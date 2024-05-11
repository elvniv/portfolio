import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StripeOnboarded = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleOnboard = async () => {
    try {
      const response = await axios.get('https://klorah-fast-server-9266fe8d441a.herokuapp.com/create-onboarding-session');

      if (response.status === 200 && response.data.url) {
        window.location.href = response.data.url; // Redirect user to Stripe
      } else {
        throw new Error('Failed to retrieve onboarding link');
      }
    } catch (error) {
      setError(error.response ? error.response.data.detail : error.message);
    }
  };

  return (
    <div>
      <h2>Stripe Onboarding</h2>
      <button onClick={handleOnboard}>Onboard to Stripe</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default StripeOnboarded;
