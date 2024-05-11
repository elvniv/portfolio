import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileInvoice, faUsers } from '@fortawesome/free-solid-svg-icons';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../Firebase';
import useCurrentUser from '../Authentication/currentUser';

const UserNameFrame = () => {
  const { username } = useCurrentUser();
  return (
    <div className="flex justify-center items-center py-3">
      <h1 className="text-2xl font-light text-gray-800">Hello, <span className="font-bold text-black">{username}</span></h1>
    </div>
  );
};

const TopHalf = () => {
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();
  const [invoiceCount, setInvoiceCount] = useState(0);
  const [clientCount, setClientCount] = useState(0);

  useEffect(() => {
    const user = auth.currentUser;
    if (user && user.uid) {
      const invoicesQuery = query(collection(db, 'invoices'), where('userId', '==', user.uid));
      const clientsQuery = query(collection(db, `users/${user.uid}/clients`));

      const unsubscribeInvoices = onSnapshot(invoicesQuery, snapshot => {
        setInvoiceCount(snapshot.size);
      });
      const unsubscribeClients = onSnapshot(clientsQuery, snapshot => {
        setClientCount(snapshot.size);
      });

      return () => {
        unsubscribeInvoices();
        unsubscribeClients();
      };
    }
  }, [currentUser]);

  return (
    <div className="flex flex-col items-center bg-white ">
      <UserNameFrame />
      <div className="flex w-full justify-around px-10">

        <div className="bg-black text-white p-4 rounded-xl flex flex-col items-center m-2 shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out cursor-pointer" style={{ minWidth: '165px' }} onClick={() => navigate('/invoices')}>
          <FontAwesomeIcon icon={faFileInvoice} size="2x" />
          <div className="text-xl font-bold mt-2">Invoices</div>
          <div className="text-3xl font-bold">{invoiceCount}</div>
          <div>Total</div>
          <button className="mt-2 bg-white text-black py-2 px-4 rounded-full text-sm hover:bg-gray-300 transition-colors" onClick={(e) => { e.stopPropagation(); navigate('/invoices'); }}>
            View All
          </button>
        </div>
        
        <div className="bg-white text-black p-4 rounded-xl flex flex-col items-center m-2  hover:shadow-2xl transition-shadow duration-300 ease-in-out cursor-pointer" style={{ minWidth: '165px', backgroundColor: '#f8f5f5' }} onClick={() => navigate('/clients')}>
          <FontAwesomeIcon icon={faUsers} size="2x" />
          <div className="text-xl font-bold mt-2">Clients</div>
          <div className="text-3xl font-bold">{clientCount}</div>
          <div>Total</div>
          <button className="mt-2 bg-black text-white py-2 px-4 rounded-full text-sm hover:bg-gray-800 transition-colors" onClick={(e) => { e.stopPropagation(); navigate('/clients'); }}>
            View All
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopHalf;

