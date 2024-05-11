import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import NavigationBar from '../../NavigationBar';
import LoadingPage from '../Agreement/loadingPage';

const stripePromise = loadStripe("pk_live_51IuUXbLwpaCHfpZ1EZNNYaQYdXSIrE6NrdA3r7lUQOIq5tsdhC7MaTITIMFb3nW4yxqyppRd8C66QcxWhuoPC8aa00Ow2q0o0z");

const updateInvoiceStatus = async (invoiceId) => {
  const firestore = getFirestore();
  const invoiceDocRef = doc(firestore, 'invoices', invoiceId);

  await updateDoc(invoiceDocRef, {
    status: 'paid',
  });
};

const PaymentForm = ({ clientSecret, price, invoiceId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);
    setPaymentError('');
  
    if (!stripe || !elements) {
      setIsProcessing(false);
      return;
    }
  
    const result = await stripe.confirmPayment({
      elements,
      clientSecret: clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/completion`,
      },
    });
  
    if (result.error) {
      console.error(result.error.message);
      setPaymentError(result.error.message);
      setIsProcessing(false);
    } else {
      if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        setPaymentSuccess(true);
        setIsProcessing(false);
        // Update the invoice status to "paid"
        updateInvoiceStatus(invoiceId);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />
      <button 
        type="submit" 
        className="mt-4 w-full bg-black hover:bg-green text-white font-semibold py-2 px-4 rounded-lg" 
        disabled={!stripe || isProcessing || paymentSuccess}
      >
        {isProcessing ? 'Processing...' : paymentSuccess ? 'Payment Successful' : `Pay $${price}`}
      </button>
      {paymentError && <div className="text-red-500 mt-2">{paymentError}</div>}
      {paymentSuccess && <div className="text-green-500 mt-2">Payment was successful!</div>}
    </form>
  );
};

const PaymentPage = () => {
  const { invoiceId } = useParams();
  const [clientSecret, setClientSecret] = useState('');
  const [invoiceData, setInvoiceData] = useState(null);
  const auth = getAuth();
  const user = auth.currentUser;

  const normalizeInvoiceData = (invoice) => {
    return {
      customer: invoice.customer,
      gig: invoice.gig,
      price: invoice.price,
      currency: invoice.currency,
      connectedAccountId: invoice.connectedAccountId || invoice.stripeAccountId,
      dueDate: invoice.dueDate ? invoice.dueDate.toDate() : new Date(invoice.due_date),
      status: invoice.status || 'pending',
    };
  };

  useEffect(() => {
    const fetchInvoice = async () => {
      const firestore = getFirestore();
      const invoiceDocRef = doc(firestore, 'invoices', invoiceId);
      const invoiceDocSnap = await getDoc(invoiceDocRef);

      if (invoiceDocSnap.exists()) {
        const invoice = normalizeInvoiceData(invoiceDocSnap.data());
        setInvoiceData(invoice);

        const requestBody = {
          amount: invoice.price * 100,
          currency: invoice.currency,
          description: `${invoice.gig} for ${invoice.customer}`,
          invoiceId: invoiceId,
          connectedAccountId: invoice.connectedAccountId,
        };

        const response = await fetch('https://klorah-fast-server-9266fe8d441a.herokuapp.com/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          const paymentIntent = await response.json();
          setClientSecret(paymentIntent.clientSecret);
        } else {
          console.error('Failed to create payment intent:', await response.text());
        }
      } else {
        console.log('No such invoice document!');
      }
    };

    fetchInvoice();
  }, [invoiceId]);

  if (!clientSecret) {
    return <LoadingPage />;
  }

  return (
    <div>
      {user && <NavigationBar />}
      <div className="min-h-screen flex flex-col justify-center items-center px-4">
        <h1 className="text-2xl font-semibold mb-4">Payment Details</h1>
        <div className="w-full max-w-md">
          {invoiceData && (
            <div className="bg-black shadow-md rounded-lg p-6 mb-4 text-white">
              <h2 className="text-2xl font-bold mb-4 border-b border-white">Invoice Summary</h2>
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-gray-300">Customer:</p>
                <p className="text-white">{invoiceData.customer}</p>
              </div>
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-gray-300">Gig:</p>
                <p className="text-white">{invoiceData.gig}</p>
              </div>
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-gray-300">Due Date:</p>
                <p className="text-white">{invoiceData.dueDate.toLocaleDateString()}</p>
              </div>
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-gray-300">Price:</p>
                <p className="text-white">${invoiceData.price}</p>
              </div>
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-gray-300">Status:</p>
                <p className={`text-white ${invoiceData.status === 'paid' ? 'text-green-500' : 'text-red-500'}`}>
                  {invoiceData.status.toUpperCase()}
                </p>
              </div>
            </div>
          )}
          {invoiceData?.status !== 'paid' && (
            <Elements stripe={stripePromise} options={{clientSecret: clientSecret}}>
              <PaymentForm clientSecret={clientSecret} price={invoiceData?.price} invoiceId={invoiceId} />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
