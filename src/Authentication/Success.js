import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Success() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 3000);
    return () => clearTimeout(timer);  // This will clear the timer when the component is unmounted
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <div className="text-center p-10 rounded-lg bg-black border border-white border-opacity-20 backdrop-blur-md">
        <h1 className="text-3xl font-extrabold text-white mb-4">Welcome to Klorah Pro</h1>
        <p className="text-lg text-white mb-6">Your payment was successful</p>
        <button className="px-6 py-3 bg-white text-black rounded-lg shadow-lg hover:bg-gray-200 transition-all duration-300" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
      </div>
    </div>
  );
}
