import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../../NavigationBar';
import LoadingPage from './loadingPage';
import { db } from '../../Firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import useCurrentUser from '../../Authentication/currentUser';
import mixpanel from 'mixpanel-browser';

const CreateAgreement = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [isEnabled, setIsEnabled] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [scopeOfWork, setScopeOfWork] = useState('');
  const [price, setPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { username } = useCurrentUser(); // Fetch the username (freelancer's name)
  const [currentUser, setCurrentUser] = useState(() => {
    const auth = getAuth();
    return auth.currentUser; // This will have the current user at the time of component initialization
  });
  const [clientName, setClientName] = useState(''); // Add state for client's name
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // Set the current user if the auth state changes
        setCurrentUser(user);
      }
    });
    return () => unsubscribe(); // Unsubscribe on component unmount
  }, []);

  useEffect(() => {
    // Set default title with the current date when the component mounts
    const today = new Date().toLocaleDateString();
    setTitle(`Agreement with ${clientName} - ${today}`);
  }, [clientName]);

  const handleGenerate = async () => {
    setIsLoading(true);
    mixpanel.track("Agreement Generation Initiated", { "User": username, "Client": clientName, "Scope of Work": scopeOfWork, "Price": price, "Currency": currency });

    // Ensure currentUser is not null and has a uid before proceeding
    if (currentUser && currentUser.uid) {
      if (date instanceof Date) {
        const formattedDate = date.toISOString().split('T')[0];
        const contractData = {
          scope_of_work: scopeOfWork,
          price: parseFloat(price),
          currency: currency,
          due_date: formattedDate,
          freelancer_name: username,
          client_name: clientName, // Include client's name in the contract data
        };

        // Replace with your backend URL
        const response = await fetch('https://klorah-fast-server-9266fe8d441a.herokuapp.com/generate-contract', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(contractData),
        });

        if (response.ok) {
          const data = await response.json();
          const agreementText = data.contract_text;

          // Save the agreement to Firestore under the 'agreements' collection
          const agreementData = {
            text: agreementText,
            name: title,
            description: description,
            date: new Date().toISOString().split('T')[0], // Current date
            amount: price, // Assuming 'price' is a state variable holding the agreement amount
            userId: currentUser.uid,
            created: serverTimestamp(),
          };

          const docRef = await addDoc(collection(db, 'agreements'), agreementData);

          // Navigate to the sharing/editing page with the new agreement ID
          navigate(`/share-agreement/${docRef.id}`);
          mixpanel.track("Agreement Generation Successful", { "User": username, "Client": clientName, "Agreement ID": docRef.id });
        } else {
          console.error('Failed to generate contract:', response.statusText);
          mixpanel.track("Agreement Generation Failed", { "User": username, "Client": clientName, "Error": response.statusText });
        }
        setIsLoading(false);
      } else {
        console.error('Invalid date');
        mixpanel.track("Agreement Generation Failed", { "User": username, "Client": clientName, "Error": "Invalid date" });
        setIsLoading(false);
      }
    } else {
      console.error('No user is logged in.');
      mixpanel.track("Agreement Generation Failed", { "User": username, "Client": clientName, "Error": "No user is logged in" });
    }
  };

  const onChange = (event) => {
    const newDate = new Date(event.target.value);
    setDate(newDate);
  };

  const currencies = ['USD', 'EUR', 'JPY', 'GBP', 'AUD', 'CAD', 'CHF', 'CNY', 'HKD', 'NZD'];

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  if (isLoading) {
    return <LoadingPage />;
  }

return (
  <div>
    <NavigationBar />
    <div className="flex flex-col items-center justify-center p-5 pt-20 ">
      <div className="w-full max-w-2xl bg-white rounded-lg border border-gray-300 p-9">
        <h1 className="text-2xl font-semibold mb-5">Create Agreement using AI</h1>

        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Describe the scope of work for this contract?
          </label>
          <input
            type="text"
            value={scopeOfWork}
            onChange={(e) => setScopeOfWork(e.target.value)}
            placeholder="Enter scope of work details"
            className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-700 mb-2">Price</label>
          <div className="flex items-center gap-2">
            <div className="relative w-1/3">
              <button onClick={() => setDropdownVisible(!dropdownVisible)} className="w-full h-12 border border-gray-300 rounded-lg px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {currency}
              </button>
              {dropdownVisible && (
                <div className="absolute top-full mt-1 bg-white border border-gray-300 rounded-lg max-h-36 overflow-y-scroll z-10">
                  {currencies.map((item, index) => (
                    <button key={index} onClick={() => { setCurrency(item); setDropdownVisible(false) }} className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
              className="w-2/3 h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <div className="w-1/2">
            <label className="block text-lg font-medium text-gray-700 mb-2">Client's Name</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Enter client's name"
              className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-lg font-medium text-gray-700 mb-2">Due Date</label>
            <input 
              type="date" 
              value={date.toISOString().split('T')[0]} 
              onChange={onChange} 
              className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-700 mb-2">Agreement Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter agreement title"
            className="w-full h-12 border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-700 mb-2">Agreement Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter agreement description (this is only for your records)"
            className="w-full h-32 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <button
          onClick={handleGenerate}
          className="w-full h-12 bg-black text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Generate Agreement
        </button>
      </div>
    </div>
  </div>
);

};

export default CreateAgreement;
