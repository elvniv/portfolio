import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate } from 'react-router-dom';
import { getAuth } from "firebase/auth";
import axios from 'axios';

// Initialize stripe
const stripePromise = loadStripe('pk_live_51IuUXbLwpaCHfpZ1EZNNYaQYdXSIrE6NrdA3r7lUQOIq5tsdhC7MaTITIMFb3nW4yxqyppRd8C66QcxWhuoPC8aa00Ow2q0o0z');

export default function Billing() {
  const navigate = useNavigate();
  const [loading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    async function createStripeCustomer() {
      const userEmail = auth.currentUser?.email;
      if (!userEmail) {
        console.error("User email is not available");
        return null;
      }

      try {
        const customerRes = await axios.post('https://klorah-fast-server-9266fe8d441a.herokuapp.com/create-customer', {
          email: userEmail,
        });

        const customerData = customerRes.data;
        return customerData.stripe_customer_id;
      } catch (error) {
        console.error("Error in createStripeCustomer:", error);
        return null;
      }
    }


    async function createCheckoutSession(stripeCustomerId) {
      try {
        const sessionRes = await axios.post('https://klorah-fast-server-9266fe8d441a.herokuapp.com/createCheckoutSession', {
          stripeCustomerId,
          priceId: 'price_1O1ja2LwpaCHfpZ1h26oZKFW',
        });

        const sessionData = sessionRes.data;

        if (!sessionData.sessionId) {
          throw new Error("Session ID is missing in the response");
        }

        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({ sessionId: sessionData.sessionId });
        if (error) {
          console.error('Stripe Checkout error:', error.message);
        } else {
          // In your Billing component after successful Stripe checkout
          localStorage.setItem('isOnboardingComplete', 'true');
        }
      } catch (error) {
        console.error("Error in createCheckoutSession:", error);
      }
    }

    if (auth.currentUser) {
      createStripeCustomer().then(stripeCustomerId => {
        if (stripeCustomerId) {
          createCheckoutSession(stripeCustomerId);
        }
      });
    }
  }, [navigate]);

  return (
    <div className="p-5">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <img
            className="h-8 w-auto"
            src="/klorahLogo.png"
            alt="Klorah"
            onClick={() => navigate('/')}
          />
          <div className="bg-red-100 text-red-700 p-5 border border-red-400 rounded mt-5">
            <p>There was an error. It might be due to an active ad blocker.</p>
            <p>Please disable it and try again. If the error persists, contact us at:</p>
            <p><a href="mailto:support@klorah.zendesk.com" className="text-blue-500">support@klorah.zendesk.com</a></p>
            <p>or call us at: <strong>+1 (856) 699-6475</strong></p>
          </div>
          <button className="bg-black text-white px-4 py-2 rounded mt-4" onClick={() => navigate('/dashboard')}>
            Navigate to dashboard with free account
          </button>
        </div>
      )}
    </div>
  );
}
