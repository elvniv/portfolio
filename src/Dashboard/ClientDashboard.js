import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../Firebase';
import NavigationBar from '../NavigationBar';
import { FaPlus } from 'react-icons/fa';

const Modal = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg max-w-sm w-full relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-lg font-bold">&times;</button>
        {children}
      </div>
    </div>
  );
};

const AddClientForm = ({ onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (user) {
        await addDoc(collection(db, 'users', user.uid, 'clients'), formData);
        onClose();
      } else {
        console.error("User not authenticated");
      }
    } catch (error) {
      console.error("Error adding client: ", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg">
      <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required className="border-2 border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:border-green-500 transition-colors" />
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="border-2 border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:border-green-500 transition-colors" />
      <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="border-2 border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:border-green-500 transition-colors" />
      <div className="flex justify-end space-x-4">
        <button type="button" onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-black font-semibold p-3 rounded-lg transition-colors">Cancel</button>
        <button type="submit" className="bg-black hover:bg-green-500 text-white font-semibold p-3 rounded-lg transition-colors">Add Client</button>
      </div>
    </form>
  );
};

const ClientDashboard = () => {
  const [clients, setClients] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchClients = async () => {
      const user = auth.currentUser;
      if (user) {
        const clientsRef = collection(db, 'users', user.uid, 'clients');
        const unsubscribe = onSnapshot(clientsRef, snapshot => {
          const clientsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setClients(clientsData);
        });
        return () => unsubscribe();
      }
    };

    fetchClients();
  }, []);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleDeleteClient = async (id) => {
    try {
      const user = auth.currentUser;
      if (user) {
        await deleteDoc(doc(db, 'users', user.uid, 'clients', id));
      } else {
        console.error("User not authenticated");
      }
    } catch (error) {
      console.error("Error deleting client: ", error);
    }
  };

  return (
    <div>
      <NavigationBar />
      <div className="text-black min-h-screen flex">
        <div className="w-3/4 container mx-auto px-4">
        <input type="text" placeholder="Search clients" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border-2 border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:border-green-500 transition-colors mt-4" />
          {clients.length > 0 ? (
            <div className="space-y-4 py-4">
              {clients.filter(client => client.name.toLowerCase().includes(searchTerm.toLowerCase())).map(client => (
                <div key={client.id} className="flex justify-between items-center p-4 border-b-2">
                  <div>
                    <p className="font-semibold">{client.name}</p>
                    <p>{client.email}</p>
                    <p>{client.phone}</p>
                  </div>
                  <div>
                    {/* <button className="p-2 rounded-md hover:bg-gray-100 transition-colors">Message</button>
                    <button className="p-2 rounded-md ml-2 hover:bg-gray-100 transition-colors">Call</button> */}
                    <button onClick={() => handleDeleteClient(client.id)} className="p-2 rounded-md ml-2 hover:bg-red-100 transition-colors">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-lg">No current contacts</p>
            </div>
          )}
        </div>
        <div className="fixed bottom-4 right-4">
          <div className="flex justify-center items-center">
            <button onClick={handleOpenModal} className="bg-black text-white p-3 rounded-full hover:bg-green-500 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110 shadow-lg group relative">
              <div className="flex items-center justify-center">
                <FaPlus size={24} />
                <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out text-lg font-semibold">Add Client</span>
              </div>
            </button>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <AddClientForm onClose={handleCloseModal} />
      </Modal>
    </div>
  );
};

export default ClientDashboard;
