// BalanceCard.js
import React, { useEffect, useState } from 'react';
import { PlusIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { auth } from '../Firebase';

export default function BalanceCard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      fetch('/get-account-balance?userId=' + user.uid)
        .then(response => response.json())
        .then(data => {
          setBalance(data.balance);
          setIsLoaded(true);
        });
    }
  }, [user]);

  const handleCreateInvoice = () => {
    navigate('/dashboard/create-invoice');
  };

  const handleViewDocuments = () => {
    navigate('/dashboard/invoices');
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!user.stripeOnboarded) {
    return (
      <div className="message">
        <p>You need to complete the onboarding process to view your balance.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
      <main className="container mx-auto mt-10 p-4">
        <div className="w-96 h-48 bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-700">Balance</h3>
            <span className="text-xl font-semibold text-green-600">${balance}</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 h-2/3">
            <button onClick={handleCreateInvoice} className="flex flex-col items-center justify-center bg-green-600 text-white p-4 rounded-lg hover:bg-gray-300">
              <PlusIcon className="h-6 w-6 mb-2" />
              <span>Create Invoice</span>
            </button>
            <button onClick={handleViewDocuments} className="flex flex-col items-center justify-center bg-gray-200 text-gray-700 p-4 rounded-lg">
              <DocumentIcon className="h-6 w-6 mb-2" />
              <span>Documents</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
s