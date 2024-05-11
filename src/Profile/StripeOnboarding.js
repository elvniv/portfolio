import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from "firebase/auth";
import mixpanel from 'mixpanel-browser'; // Import Mixpanel
import { VerificationBanner } from '../Dashboard/VerificationBanner';

const StripeOnboarding = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Listener for authentication state changes
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUserId(user.uid);
        mixpanel.track('User Authenticated', { 'User ID': user.uid }); // Track authenticated user
      } else {
        // Optionally handle unauthenticated user scenario
        setUserId(null);
        setError('User not authenticated');
        mixpanel.track('User Not Authenticated'); // Track unauthenticated user
      }
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [auth]);


  // const handleOnboarding = async () => {
  //   setLoading(true);
  //   setError('');
  //   if (!userId) {
  //     setError('User not authenticated');
  //     setLoading(false);
  //     return;
  //   }
  //   try {
  //     const response = await fetch('https://klorah-fast-server-9266fe8d441a.herokuapp.com/create-onboarding-session', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ userId: userId }), // Ensure this matches the expected schema in FastAPI
  //     });
  //     const data = await response.json();
  //     if (!response.ok) {
  //       throw new Error(data.error || 'An error occurred during onboarding');
  //     }
  //     if (data.url) {
  //       window.location.href = data.url; // Redirect to Stripe
  //       mixpanel.track('Stripe Onboarding Redirect', { 'User ID': userId }); // Track Stripe onboarding redirect
  //     } else {
  //       setError('No URL returned from the server');
  //       setTimeout(() => setError(''), 5000);
  //     }
  //   } catch (error) {
  //     setError(error.message || 'Error during onboarding. Please try again later.');
  //     setTimeout(() => setError(''), 5000);
  //     mixpanel.track('Stripe Onboarding Error', { 'User ID': userId, 'Error': error.message }); // Track Stripe onboarding error
  //   }
  //   setLoading(false);
  // };
  const handleOnboarding = async () => {
    setLoading(true);
    setError('');
    if (!userId) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }
    if (!auth.currentUser.emailVerified) {
      setError('Please verify your email before proceeding.');
      setLoading(false);
      return;
    }
    try {
      const response = await fetch('https://klorah-fast-server-9266fe8d441a.herokuapp.com/create-onboarding-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userId }), // Ensure this matches the expected schema in FastAPI
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'An error occurred during onboarding');
      }
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe
        mixpanel.track('Stripe Onboarding Redirect', { 'User ID': userId }); // Track Stripe onboarding redirect
      } else {
        setError('No URL returned from the server');
        setTimeout(() => setError(''), 5000);
      }
    } catch (error) {
      setError(error.message || 'Error during onboarding. Please try again later.');
      setTimeout(() => setError(''), 5000);
      mixpanel.track('Stripe Onboarding Error', { 'User ID': userId, 'Error': error.message }); // Track Stripe onboarding error
    }
    setLoading(false);
  };
  

  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white">
        <button 
          onClick={handleOnboarding} 
          disabled={loading} 
          className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
        >
          {loading ? 'Loading...' : 'Start Stripe Onboarding'}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {loading && <p className="mt-2">Please wait while we prepare your onboarding session...</p>}
        <button 
          onClick={() => navigate('/dashboard')} 
          className="mt-4 px-4 py-2 font-bold text-white rounded hover:bg-red-700"
        >
          Back to Dashboard
        </button>
      </div>
      <VerificationBanner /> 
    </div>
  );
};

export default StripeOnboarding;
