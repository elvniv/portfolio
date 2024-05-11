import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import LoadingPage from '../Agreement/loadingPage';
import NavigationBar from '../../NavigationBar';
import { IoMdClipboard, IoIosArrowBack } from 'react-icons/io';
import { ToastContainer, toast } from 'react-toastify';

export default function PreviewInvoice() {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const firestore = getFirestore();
    const fetchInvoiceDetails = async () => {
      setIsLoading(true);
      try {
        const invoiceRef = doc(firestore, "invoices", invoiceId);
        const docSnap = await getDoc(invoiceRef);

        if (docSnap.exists()) {
          setInvoiceDetails(docSnap.data());
        } else {
          throw new Error("Invoice not found");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoiceDetails();
  }, [invoiceId]);

  const proceedToPayment = () => {
    navigate(`/payment/${invoiceId}`);
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen"><p>Error: {error}</p></div>;
  }

  if (!invoiceDetails) {
    return <div className="flex justify-center items-center h-screen"><p>No invoice details available.</p></div>;
  }

  return (
    <div>
      <NavigationBar />
      <div className="container mx-auto p-4 pt-20">
        <div className="max-w-xl mx-auto bg-white rounded-lg p-6 border border-gray-300 shadow-sm">
          <h1 className="text-2xl font-semibold mb-2">{invoiceDetails.gig}</h1>
          <h2 className="text-xl font-semibold text-gray-600">Invoice</h2>

          <div className="mt-4">
            <p className="text-sm text-gray-500">ID: {invoiceId}</p>
            <p className="text-lg mt-2">{invoiceDetails.gig}</p>
            <p className="text-lg font-medium mt-2">Price: {invoiceDetails.currency} {invoiceDetails.price}</p>
            <p className="text-lg font-medium mt-2">
              Status: <span className={`font-bold ${invoiceDetails.status === 'paid' ? 'text-green-500' : 'text-red-500'}`}>
                {invoiceDetails.status ? invoiceDetails.status.toUpperCase() : 'PENDING'}
              </span>
            </p>
          </div>

          <div className="mt-6">
            <button 
              className="flex items-center justify-center px-4 py-2 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg transition duration-300"
              onClick={() => {
                const link = `https://www.klorah.app/payment/${invoiceId}`;
                navigator.clipboard.writeText(link).then(() => {
                  toast.success("Link copied successfully!");
                });
              }}
            >
              <IoMdClipboard className="mr-2" /> Copy Link For Client
            </button>
          </div>

          <button 
            onClick={proceedToPayment}
            className="mt-4 w-full rounded-md border border-transparent bg-black px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-800"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
