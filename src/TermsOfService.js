import React from 'react';
import { useNavigate } from 'react-router-dom';

function TermsOfService() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col items-center justify-center p-10">
      <div className="w-full max-w-xl bg-white p-10 rounded-lg shadow-md">
        <button onClick={goBack}>Back</button>
        <h1 className="text-2xl font-bold mb-5 text-center">Terms of Service</h1>
        <p className="mb-5 text-center"><strong>Last Updated: October 14, 2023</strong></p>
        <h2 className="text-xl font-bold mb-3">Introduction</h2>
        <p className="mb-5">Welcome to Klorah. These Terms of Service govern your use of our service.</p>
        <h2 className="text-xl font-bold mb-3">Acceptance of Terms</h2>
        <p className="mb-5">By using Klorah, you agree to these Terms.</p>
        <h2 className="text-xl font-bold mb-3">Changes to Terms</h2>
        <p className="mb-5">Klorah reserves the right to change these terms at any time.</p>
        <h2 className="text-xl font-bold mb-3">Usage Restrictions</h2>
        <p className="mb-5">You may not use Klorah for any illegal activities.</p>
        <h2 className="text-xl font-bold mb-3">Termination</h2>
        <p className="mb-5">Klorah reserves the right to terminate your access to the service.</p>
        <h2 className="text-xl font-bold mb-3">Governing Law</h2>
        <p>These Terms are governed by the laws of the United States.</p>
      </div>
    </div>
  );
}

export default TermsOfService;
