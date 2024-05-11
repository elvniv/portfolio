import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../NavigationBar';
import useCurrentUser from '../Authentication/currentUser';
import LoadingPage from '../Dashboard/Agreement/loadingPage';
// import { getFirestore, doc, getDoc } from 'firebase/firestore';

const WalletView = () => {
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();
  const [stripeAccountId, setStripeAccountId] = useState(null);
  const [balance, setBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');


    // Redirect users who haven't completed the onboarding process
    useEffect(() => {
      if (currentUser) {
        // Assuming `currentUser` includes `onboardingComplete` and `stripeOnboarded`
        if (!currentUser.onboardingComplete || !currentUser.stripeOnboarded) {
          navigate('/stripe-ob');
        }
      }
    }, [currentUser, navigate]);
  
  const transactions = [
    // { date: '2022-01-01', amount: 100 },
    // { date: '2022-01-02', amount: 200 },
    // { date: '2022-01-03', amount: 300 },
    // { date: '2022-01-04', amount: 400 },
    // { date: '2022-01-05', amount: 500 },
    // { date: '2022-01-06', amount: 600 },
    // { date: '2022-01-07', amount: 700 },
    // { date: '2022-01-08', amount: 800 },
    // { date: '2022-01-09', amount: 900 },
    // { date: '2022-01-10', amount: 1000 },
    // { date: '2022-01-11', amount: 1100 },
    // { date: '2022-01-12', amount: 1200 },
    // { date: '2022-01-13', amount: 1300 },
    // { date: '2022-01-14', amount: 1400 },
    // { date: '2022-01-15', amount: 1500 },
    // { date: '2022-01-16', amount: 1600 },
    // { date: '2022-01-17', amount: 1700 },
    // { date: '2022-01-18', amount: 1800 },
    // { date: '2022-01-19', amount: 1900 },
    // { date: '2022-01-20', amount: 2000 },
    // { date: '2022-01-21', amount: 2100 },
    // { date: '2022-01-22', amount: 2200 },
    // { date: '2022-01-23', amount: 2300 },
    // { date: '2022-01-24', amount: 2400 },
    // { date: '2022-01-25', amount: 2500 },
  ];

  // useEffect(() => {
  //   console.log('Current User:', currentUser);
  // }, [currentUser]);
  
  // useEffect(() => {
  //   console.log('Stripe Account ID:', stripeAccountId);
  // }, [stripeAccountId]);
  
  useEffect(() => {
    console.log('Current User:', currentUser);
    if (currentUser?.stripeAccountId) {
      console.log('Stripe Account ID:', currentUser.stripeAccountId);
      fetchBalance(currentUser.stripeAccountId);
    }
  }, [currentUser]);
  
  const fetchBalance = async (accountId) => {
    setIsLoading(true);
    try {
      setError(''); // Clear any existing error messages
      const response = await fetch(`https://klorah-fast-server-9266fe8d441a.herokuapp.com/balance/${accountId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch balance: ${response.statusText}`);
      }
      const data = await response.json();
      setBalance(data);
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Failed to fetch balance. Please try again later.');
    }
    setIsLoading(false);
  };
  // useEffect(() => {
  //   if (currentUser && currentUser.uid) {
  //     const fetchStripeAccountId = async () => {
  //       const db = getFirestore();
  //       const userDocRef = doc(db, 'users', currentUser.uid);
  //       try {
  //         setError(''); // Clear any existing error messages
  //         const userDoc = await getDoc(userDocRef);
  //         if (userDoc.exists() && userDoc.data().stripeAccountId) {
  //           setStripeAccountId(userDoc.data().stripeAccountId);
  //         } else {
  //           console.log("No such document in Firestore or stripeAccountId is missing!");
  //           setError('Failed to load Stripe account information.');
  //         }
  //       } catch (error) {
  //         console.error("Error fetching from Firestore:", error);
  //         setError('Failed to fetch account details. Please try again later.');
  //       }
  //     };
  //     fetchStripeAccountId();
  //   }
  // }, [currentUser]);
  
  // useEffect(() => {
  //   const fetchBalance = async () => {
  //     if (stripeAccountId) {
  //       try {
  //         const response = await fetch(`https://klorah-fast-server-9266fe8d441a.herokuapp.com/balance/${stripeAccountId}`);
  //         const data = await response.json();
  //         setBalance(data);
  //       } catch (error) {
  //         console.error('Fetch error:', error);
  //         setError('Failed to fetch balance. Please try again later.');
  //       }
  //     }
  //     setIsLoading(false);
  //   };

  //   fetchBalance();
  // }, [stripeAccountId]);

  

  if (isLoading) {
    return (
      <div>
        <NavigationBar />
        <div className="flex justify-center items-center h-screen">
          <LoadingPage />
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavigationBar />
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-full max-w-4xl p-6 bg-white border rounded-lg">
          {balance && (
            <div>
              <h2 className="text-2xl font-bold text-center mb-4">Your Balance</h2>
              <p className="text-xl">Available: ${balance.available[0].amount / 100}</p>
              <p className="text-xl">Pending: ${balance.pending[0].amount / 100}</p>
            </div>
          )}
          <h3 className="text-lg font-semibold mt-6 mb-2">Past Transactions</h3>
          <div style={{ maxHeight: '200px', overflowY: 'scroll' }}>
            {transactions.map((transaction, index) => (
              <div key={index} className="border-b py-2">
                <p>{`${transaction.date}: ${transaction.amount}`}</p>
              </div>
            ))}
          </div>
          <button
            className="mt-4 px-4 py-2 text-white bg-black rounded hover:bg-gray-900"
            // add the logic to this here
            onClick={() => navigate('/change-payout-account')}
          >
            Change Payout Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletView;