import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';
import { IoIosArrowBack, IoMdRefresh, IoMdCheckmarkCircleOutline, IoMdClose } from 'react-icons/io';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../../Firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import NavigationBar from '../../NavigationBar';

const SignaturePage = ({ onClose = () => {} }) => {
  const { agreementId } = useParams();
  const [agreement, setAgreement] = useState(null);
  const [signatureData, setSignatureData] = useState('');
  const [signaturePosition, setSignaturePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const sigCanvas = useRef({});
  const agreementRef = useRef(null);
  const signatureRef = useRef(null);

  const containerRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 500, height: 300 });

  const [showSignFlow, setShowSignFlow] = useState(false);

  const toggleSignFlow = () => {
    setShowSignFlow(!showSignFlow);
  };

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setCanvasSize({ width, height });
    }
  }, []);

  useEffect(() => {
    const fetchAgreement = async () => {
      setLoading(true);
      const docRef = doc(db, 'agreements', agreementId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setAgreement(docSnap.data());
        setLoading(false);
      } else {
        setError('No such document!');
        setLoading(false);
      }
    };
    fetchAgreement();
  }, [agreementId]);

  const handleSignatureEnd = () => {
    const sigData = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
    setSignatureData(sigData);
  };

  const clearSignature = () => {
    sigCanvas.current.clear();
    setSignatureData('');
  };

  const handleMouseDown = (e) => {
    if (signatureRef.current && signatureRef.current.contains(e.target)) {
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const rect = agreementRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - signatureRef.current.offsetWidth / 2;
      const y = e.clientY - rect.top - signatureRef.current.offsetHeight / 2;
      setSignaturePosition({ x, y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const signDocument = async () => {
    setLoading(true);
    if (signatureData && agreementRef.current) {
      const canvas = await html2canvas(agreementRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      const pdfBlob = pdf.output('blob');

      const storageRef = ref(storage, `signed_agreements/${agreementId}.pdf`);
      await uploadBytes(storageRef, pdfBlob);
      const downloadUrl = await getDownloadURL(storageRef);

      const agreementDoc = doc(db, 'agreements', agreementId);
      await updateDoc(agreementDoc, {
        status: 'Signed',
        signedUrl: downloadUrl,
      });

      setLoading(false);
      onClose();
    } else {
      setError('Signature data or agreement reference is missing');
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <NavigationBar />
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-2/3 p-5 overflow-auto">
          {agreement ? (
            <div
              ref={agreementRef}
              className="agreement-content relative"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
            <h2 className="font-bold text-lg mb-5">Klorah Sign</h2>
              <ol className="list-decimal pl-4 mb-8 font-bold">
                <li>Draw your signature in the signature pad below.</li>
                <li>Position your signature on the agreement preview.</li>
                <li>Click "Sign Agreement" to complete the signing process.</li>
              </ol>
              <div className="text-gray-700 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: agreement.text }} />
              {signatureData && (
                <img
                  ref={signatureRef}
                  src={signatureData}
                  alt="Signature"
                  className="absolute cursor-move"
                  style={{ left: signaturePosition.x, top: signaturePosition.y }}
                />
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No agreement available. Please wait...</p>
            </div>
          )}
        </div>
        <div className="sticky top-0 w-full md:w-1/3 p-5 border-b md:border-b-0 md:border-l bg-white">
          {showSignFlow ? (
            <>
              <button className="bg-white text-black p-2 mb-4 rounded-lg flex items-center justify-center hover:bg-gray-300 transition duration-300" onClick={toggleSignFlow}>
                <IoMdClose size={24} className="mr-2" /> Hide
              </button>
              <div
                ref={containerRef}
                className="border border-gray-300 rounded-lg p-2 relative"
                style={{ height: '300px' }}
              >
                <div className="h-full">
                  <SignatureCanvas
                    ref={sigCanvas}
                    penColor="black"
                    canvasProps={{
                      width: canvasSize.width,
                      height: canvasSize.height,
                      className: 'sigCanvas w-full h-full'
                    }}
                    onEnd={handleSignatureEnd}
                  />
                </div>
                <div className="absolute bottom-0 left-0 w-full border-t border-dashed border-gray-400">
                  <span className="bg-white px-2 text-xs text-gray-400">Sign Here</span>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 mt-4">
                <button className="text-black p-2 rounded-lg flex items-center justify-center hover:bg-gray-200 transition duration-300" onClick={clearSignature}>
                  <IoMdRefresh size={24} className="mr-2" /> Reset
                </button>
              </div>
              <div className="mt-4">
                <button className="bg-green-500 text-white p-2 rounded-lg flex items-center justify-center hover:bg-green-700 transition duration-300 w-full" onClick={signDocument}>
                  <IoMdCheckmarkCircleOutline size={24} className="mr-2" /> Sign
                </button>
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center h-full">
              <button
                className="bg-green-500 text-white p-2 rounded-lg flex items-center justify-center hover:bg-green-700 transition duration-300"
                onClick={toggleSignFlow}
              >
                <IoMdCheckmarkCircleOutline size={24} className="mr-2" /> Sign Document
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignaturePage;