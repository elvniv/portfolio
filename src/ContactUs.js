import React from 'react';

const ContactUs = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-white text-black">
      <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
      <p className="text-center mb-8">
        We're here to help and answer any question you might have. We look forward to hearing from you 🤗
      </p>
      <div className="flex flex-col md:flex-row justify-center items-center gap-4">
        <div className="flex flex-col justify-center items-center bg-black text-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Email Us</h2>
          <p className="text-center mb-4">
            You can reach us via email for any support or general inquiries.
          </p>
          <a href="mailto:support@klorah.zendesk.com" className="text-white underline">
            support@klorah.zendesk.com
          </a>
        </div>
        <div className="flex flex-col justify-center items-center bg-black text-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Call Us</h2>
          <p className="text-center mb-4">
            You can also reach us by phone during our working hours.
          </p>
          <a href="tel:+18566996475" className="text-white underline">
            +1 856-699-6475
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

