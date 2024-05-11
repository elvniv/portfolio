import React from 'react';

const ServiceModal = ({ newService, setNewService, addService }) => {
  return (
    <div>
      <input type="text" placeholder="Service Name" value={newService.name} onChange={(e) => setNewService({ ...newService, name: e.target.value })} className="w-full p-2 border rounded" />
      <textarea placeholder="Description" value={newService.description} onChange={(e) => setNewService({ ...newService, description: e.target.value })} className="w-full p-2 border rounded my-2" rows="2"></textarea>
      <input type="text" placeholder="Price" value={newService.price} onChange={(e) => setNewService({ ...newService, price: e.target.value })} className="w-full p-2 border rounded" />
      <select value={newService.currency} onChange={(e) => setNewService({ ...newService, currency: e.target.value })} className="w-full p-2 border rounded my-2">
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="JPY">JPY</option>
        <option value="GBP">GBP</option>
        <option value="AUD">AUD</option>
        <option value="CAD">CAD</option>
        <option value="CHF">CHF</option>
        <option value="CNY">CNY</option>
        <option value="HKD">HKD</option>
        <option value="NZD">NZD</option>
      </select>
      <button onClick={addService} className="mt-4 py-2 px-4 bg-black text-white rounded hover:bg-white hover:text-black">Save Service</button>
    </div>
  );
};

export default ServiceModal;