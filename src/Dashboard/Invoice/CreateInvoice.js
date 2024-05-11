import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { collection, addDoc, serverTimestamp, getFirestore, doc, getDoc, runTransaction, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../../NavigationBar';
import useCurrentUser from '../../Authentication/currentUser';
import LoadingPage from '../Agreement/loadingPage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import mixpanel from 'mixpanel-browser';
import { VerificationBanner } from '../VerificationBanner';

export default function CreateInvoice() {
  const navigation = useNavigate();
  const [error, setError] = useState('');
  const [gig, setGig] = useState('');
  const [customer, setCustomer] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [price, setPrice] = useState('');
  const [lateFee, setLateFee] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [invoiceId, setInvoiceId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [invoiceData, setInvoiceData] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const firestore = getFirestore();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]); // List of clients
  const [selectedCustomer, setSelectedCustomer] = useState(null); // Selected client from the list


  const [currentUser, setCurrentUser] = useState(() => {
    const auth = getAuth();
    return auth.currentUser;
  });

  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        console.error('No user is logged in.');
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentUser) {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      if (invoiceId) {
        const docRef = doc(firestore, 'invoices', invoiceId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setInvoiceData(docSnap.data());
        } else {
          console.log('No such document!');
        }
      }
    };

    fetchInvoiceData();
  }, [invoiceId]);

  useEffect(() => {
    const fetchServices = async () => {
      if (currentUser) {
        const profileRef = doc(firestore, 'profiles', currentUser.uid);
        const profileSnapshot = await getDoc(profileRef);
        if (profileSnapshot.exists()) {
          const profileData = profileSnapshot.data();
          setServices(profileData.services || []);
        }
      }
    };

    fetchServices();
  }, [currentUser]);

  useEffect(() => {
    const fetchClients = async () => {
      if (currentUser) {
        const clientsRef = collection(firestore, 'users', currentUser.uid, 'clients');
        const unsubscribe = onSnapshot(clientsRef, snapshot => {
          const clientsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setCustomers(clientsData);
        });
        return () => unsubscribe();
      }
    };

    fetchClients();
  }, [currentUser]);

  const fetchUserDocument = async (userId) => {
    const docRef = doc(firestore, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log('No such document!');
      return null;
    }
  };

  const handleCustomerSelect = (selectedClient) => {
    setSelectedCustomer(selectedClient);
    setCustomer(selectedClient.name); // Set customer input field to selected client name
  };


  const handleGenerate = async () => {
    setIsLoading(true);
    mixpanel.track("Invoice Generation Initiated");

    if (currentUser && currentUser.uid) {
      const userDoc = await fetchUserDocument(currentUser.uid);
      if (userDoc && userDoc.stripeAccountId) {
        if (currentUser.emailVerified) {
          const formattedDueDate = dueDate.toISOString().split('T')[0];
          const invoiceData = {
            gig,
            customer,
            price: parseFloat(price) || 0,
            currency,
            due_date: formattedDueDate,
            userId: currentUser.uid,
            created: serverTimestamp(),
            connectedAccountId: userDoc.stripeAccountId,
          };
          try {
            const docRef = await addDoc(collection(firestore, 'invoices'), invoiceData);
            console.log("Document written with ID:", docRef.id);
            mixpanel.track("Invoice Document Created", { "Document ID": docRef.id });
            navigate(`/preview-invoice/${docRef.id}`);
          } catch (error) {
            console.error("Error adding document:", error);
            mixpanel.track("Invoice Document Creation Error", { "Error": error });
          } finally {
            setIsLoading(false);
          }
        } else {
          console.error('User email is not verified.');
          mixpanel.track("Invoice Generation Error", { "Error": 'User email is not verified.' });
          setIsLoading(false);
          setError('You must verify your email to create invoices.');
        }
      } else {
        console.error('User does not have a connected Stripe account.');
        mixpanel.track("Invoice Generation Error", { "Error": 'User does not have a connected Stripe account.' });
        setIsLoading(false);
        setError('You must have a connected Stripe account to create invoices.');
      }
    } else {
      console.error('No user is logged in.');
      mixpanel.track("Invoice Generation Error", { "Error": 'No user is logged in.' });
      setIsLoading(false);
      setError('You must be logged in to create invoices.');
    }
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  const handlePayment = async () => {
    if (!invoiceId) {
      console.error("No invoice ID available for payment");
      return;
    }

    try {
      const response = await fetch('https://klorah-fast-server-9266fe8d441a.herokuapp.com/createCheckoutSession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoiceId: invoiceId,
          customerEmail: userEmail,
          amount: price * 100,
          currency: currency,
        }),
      });

      const sessionData = await response.json();
      window.location.href = `https://checkout.stripe.com/pay/${sessionData.sessionId}`;
    } catch (error) {
      console.error("Error during payment:", error);
    }
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    setPrice(value ? parseFloat(value) : '');
  };


  const InvoicePreview = () => {
    return (
      <div className="mt-10 lg:mt-0 pb-4">
        <h2 className="text-2xl font-semibold text-gray-900">Create Invoice</h2>
        <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm p-6">
          <ul role="list" className="divide-y divide-gray-200">
            <li className="px-4 py-6 sm:px-6">
              <h4 className="text-lg font-medium text-gray-700">Gig: {gig}</h4>
              <p className="text-base text-gray-500">Customer: {customer}</p>
              <p className="text-base text-gray-500">
                Amount: {currency} {typeof price === 'number' ? price.toFixed(2) : '0.00'}
              </p>
              <p className="text-base text-gray-500">Due Date: {dueDate.toLocaleDateString()}</p>
              <p className="text-base text-gray-500">Late Fee: {lateFee}</p>
            </li>
          </ul>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  const currencies = ['USD', 'EUR', 'JPY', 'GBP', 'AUD', 'CAD', 'CHF', 'CNY', 'HKD', 'NZD'];

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  if (!currentUser || !currentUser.emailVerified) {
    return (
      <div>
        <NavigationBar />
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-lg text-red-600">You must verify your email to create invoices.</p>
          </div>
        </div>
      </div>
    );
  }

  const renderInvoiceDetails = () => {
    return (
      <div className="mt-10 lg:mt-0 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900">Invoice Details</h2>
        <div className="mt-6 grid grid-cols-2 gap-6">
          <div className="text-sm font-semibold text-gray-700">Currency</div>
          <div className="text-sm font-medium text-gray-500">{invoiceData.currency}</div>
          <div className="text-sm font-semibold text-gray-700">Customer</div>
          <div className="text-sm font-medium text-gray-500">{invoiceData.customer}</div>
          <div className="text-sm font-semibold text-gray-700">Due Date</div>
          <div className="text-sm font-medium text-gray-500">{new Date(invoiceData.dueDate).toLocaleString()}</div>
          <div className="text-sm font-semibold text-gray-700">Gig</div>
          <div className="text-sm font-medium text-gray-500">{invoiceData.gig}</div>
          <div className="text-sm font-semibold text-gray-700">Late Fee</div>
          <div className="text-sm font-medium text-gray-500">{invoiceData.lateFee}</div>
          <div className="text-sm font-semibold text-gray-700">Price</div>
          <div className="text-sm font-medium text-gray-500">{invoiceData.price}</div>
        </div>
      </div>
    );
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setGig(service.name);
    setPrice(service.price);
    setCurrency(service.currency);
  };

  return (
    <div>
      <NavigationBar />
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 lg:px-8">
        <form className="lg:grid lg:grid-cols-2 lg:gap-x-14 xl:gap-x-16">
          {/* Invoice Preview */}
          <InvoicePreview />
  
          {/* Invoice Creation Form */}
          <div>
            <div>
              <label htmlFor="gig" className="block text-sm font-medium text-gray-700">Gig</label>
              <input
                type="text"
                id="gig"
                value={gig}
                onChange={(e) => setGig(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {services.length > 0 && (
                <ul className="mt-2 divide-y divide-gray-200 border border-gray-200 rounded-md">
                  {services.map((service) => (
                    <li
                      key={service.name}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleServiceSelect(service)}
                    >
                      {service.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
  
            <div className="mt-4">
              <label htmlFor="customer" className="block text-sm font-medium text-gray-700">Customer</label>
              <input
                type="text"
                id="customer"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            {customers.length > 0 && (
              <ul className="mt-2 divide-y divide-gray-200 border border-gray-200 rounded-md">
                {customers.map((client) => (
                  <li
                    key={client.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleCustomerSelect(client)}
                  >
                    {client.name}
                  </li>
                ))}
              </ul>
            )}
  
            {selectedService ? (
              <>
                <div className="mt-4">
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={handlePriceChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
  
                <div className="mt-4">
                  <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Currency</label>
                  <select
                    id="currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    {currencies.map((currency) => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <>
                <div className="mt-4">
                  <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Currency</label>
                  <select
                    id="currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    {currencies.map((currency) => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))}
                  </select>
                </div>
  
                <div className="mt-4">
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={handlePriceChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </>
            )}
  
            {/* <div className="mt-4">
              <label htmlFor="lateFee" className="block text-sm font-medium text-gray-700">Late Fee</label>
              <input
                type="number"
                id="lateFee"
                value={lateFee}
                onChange={(e) => setLateFee(parseFloat(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div> */}
  
            <div className="mt-4">
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
              <DatePicker
                selected={dueDate}
                onChange={(date) => setDueDate(date)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
  
            {error && <div className="text-red-500 font-bold">{error}</div>}
  
            <button
              onClick={handleGenerate}
              disabled={!currentUser || !currentUser.emailVerified}
              className="mt-4 w-full rounded-md border border-transparent bg-black px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-800"
            >
              Generate Invoice
            </button>
  
            {invoiceId && (
              <button
                onClick={handlePayment}
                className="mt-4 w-full rounded-md border border-transparent bg-black px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-800"
              >
                Pay Invoice
              </button>
            )}
          </div>
        </form>
      </div>
      <VerificationBanner />
    </div>
  );
}