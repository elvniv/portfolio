import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoMdClipboard, IoIosArrowBack } from 'react-icons/io';
import { db } from '../../Firebase';
import { doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavigationBar from '../../NavigationBar';
import { generatePdfFromHtml } from './pdfUtils';
import mixpanel from 'mixpanel-browser';

const Modal = ({ title, children, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-semibold text-black">{title}</h3>
          <button className="text-black hover:text-gray-500" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};

const ShareAgreement = () => {
  const { agreementId } = useParams();
  const navigate = useNavigate();
  const [agreement, setAgreement] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [clientEmail, setClientEmail] = useState('');
  const [pdfContent, setPdfContent] = useState('');
  const auth = getAuth();

  useEffect(() => {
    const fetchAgreement = async () => {
      const docRef = doc(db, 'agreements', agreementId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const agreementData = docSnap.data();
        setAgreement(agreementData);
        setPdfContent(agreementData.text);
        mixpanel.track('Agreement Fetched', { agreementId: agreementId });
      } else {
        console.log('No such document!');
      }
    };

    fetchAgreement();
  }, [agreementId]);

  const copyLinkToClipboard = () => {
    const link = `https://klorah.app/agreements/${agreementId}`;
    navigator.clipboard.writeText(link).then(
      () => {
        toast.success('Link copied to clipboard');
        mixpanel.track('Link Copied', { agreementId: agreementId });
      },
      (err) => {
        toast.error('Could not copy text: ' + err);
      }
    );
  };

  const generatePdfBlob = async () => {
    if (pdfContent) {
      generatePdfFromHtml(pdfContent, agreement.name);
    }
  };

  const handleRequestSignature = (client = false) => {
    setShowModal(false);
    const agreementData = encodeURIComponent(JSON.stringify(agreement));
    if (client && clientEmail) {
      console.log('Sending to client:', clientEmail);
    } else {
      navigate(`/signature/${agreementId}?data=${agreementData}`);
    }
  };

  const isUserAuthenticated = auth.currentUser;

  return (
    <div>
      {isUserAuthenticated && (
        <div className="fixed top-0 w-full z-50 bg-white">
          <NavigationBar />
        </div>
      )}
      <div className={`container mx-auto p-4 ${isUserAuthenticated ? 'pt-20' : ''}`}>
        <div className="max-w-5xl mx-auto bg-white rounded-lg border-2 border-gray-300 p-6">
          {isUserAuthenticated && (
            <div className="flex justify-start pb-5">
              <IoIosArrowBack
                size={28}
                className="text-gray-800 cursor-pointer"
                onClick={() => window.history.back()}
              />
            </div>
          )}
          <h1 className="text-2xl font-semibold mb-4 text-gray-900">
            {isUserAuthenticated ? 'Share Your Agreement' : 'Your Agreement'}
          </h1>
          <div className="flex justify-between gap-4">
            {isUserAuthenticated && (
              <button
                onClick={() => navigate(`/edit-agreement/${agreementId}`)}
                className="flex items-center justify-center px-4 py-2 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg transition duration-300"
              >
                Edit Agreement
              </button>
            )}
            <button
              onClick={copyLinkToClipboard}
              className="flex items-center justify-center px-4 py-2 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg transition duration-300"
            >
              <IoMdClipboard className="mr-2" /> {isUserAuthenticated ? 'Copy Link For Client' : 'Copy Link'}
            </button>
          </div>
          <div className="flex flex-col justify-between mt-4 gap-2">
            <button
              onClick={generatePdfBlob}
              className="w-full bg-black hover:bg-white text-white hover:text-black font-bold py-2 rounded-lg transition duration-300"
            >
              Download as PDF
            </button>
            {isUserAuthenticated ? (
              <button
                onClick={() => setShowModal(true)}
                className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition duration-300"
              >
                Sign with Klorah
              </button>
            ) : (
              <button
                onClick={() => navigate(`/signature/${agreementId}`)}
                className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition duration-300"
              >
                Sign Agreement
              </button>
            )}
          </div>
          {agreement && (
            <>
              <h2 className="font-bold pt-4 pb-4 text-gray-800">Agreement:</h2>
              <div
                className="text-gray-700 whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: agreement.text }}
              />
            </>
          )}
        </div>
      </div>
      <ToastContainer position="bottom-center" autoClose={5000} hideProgressBar={true} />
      {showModal && (
        <Modal title="Request Signature" onClose={() => setShowModal(false)}>
          <div className="mb-4">
            <p className="text-gray-700 mb-4">
              Do you want to sign the document yourself or send it to your client for signature?
            </p>
            <button
              className="w-full bg-black hover:bg-gray-800 text-white font-bold py-2 rounded-lg mb-4"
              onClick={() => handleRequestSignature()}
            >
              Sign Myself
            </button>
            <input
              type="email"
              id="clientEmail"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter client's email"
            />
            <button
              className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 rounded-lg mt-2"
              onClick={() => handleRequestSignature(true)}
            >
              Send to Client
            </button>
          </div>
        </Modal>
      )}
      <div style={{ display: 'none' }}>
        <div id="pdfContent" dangerouslySetInnerHTML={{ __html: pdfContent }} />
      </div>
    </div>
  );
};

export default ShareAgreement;