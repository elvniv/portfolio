import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Cancel() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <div className="text-center p-10 rounded-lg bg-black border border-white border-opacity-20 backdrop-blur-md">
        <h1 className="text-3xl font-extrabold text-white mb-4">Payment Canceled</h1>
        <button className="px-6 py-3 bg-white text-black rounded-lg shadow-lg hover:bg-gray-200 transition-all duration-300" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
      </div>
    </div>
  );
}
