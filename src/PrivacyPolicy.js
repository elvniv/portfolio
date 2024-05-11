import React from 'react';
import { useNavigate } from 'react-router-dom';

function PrivacyPolicy() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col items-center justify-center p-10">
      <div className="w-full max-w-xl bg-white p-10 rounded-lg shadow-md">
        <button onClick={goBack}>Back</button>
        <h1 className="text-2xl font-bold mb-5 text-center">Privacy Policy</h1>
        <p className="mb-5 text-center"><strong>Last Updated: October 14, 2023</strong></p>
        <h2 className="text-xl font-bold mb-3">Introduction</h2>
        <p className="mb-5">This Privacy Policy governs how Klorah collects, uses, and discloses your personal information.</p>
        <h2 className="text-xl font-bold mb-3">Information Collection</h2>
        <p className="mb-5">We collect information like your name, email, and payment details.</p>
        <h2 className="text-xl font-bold mb-3">Third-Party Services</h2>
        <h3 className="text-lg font-bold mb-2">Stripe</h3>
        <p className="mb-5">We use Stripe for payment processing. Your payment information is securely handled by Stripe and is not stored on our servers.</p>
        <h3 className="text-lg font-bold mb-2">Firebase</h3>
        <p className="mb-5">We use Firebase for backend services, which may include data storage and analytics.</p>
        <h3 className="text-lg font-bold mb-2">OpenAI</h3>
        <p className="mb-5">We use OpenAI models for AI-powered features in our service.</p>
        <h2 className="text-xl font-bold mb-3">Information Use</h2>
        <p className="mb-5">We use this information to provide and improve our service.</p>
        <h2 className="text-xl font-bold mb-3">Information Sharing</h2>
        <p className="mb-5">We do not sell your information to third parties but may share it with the third-party services mentioned above for operational purposes.</p>
        <h2 className="text-xl font-bold mb-3">Security</h2>
        <p className="mb-5">We take reasonable measures to protect your information.</p>
        <h2 className="text-xl font-bold mb-3">Changes to This Policy</h2>
        <p className="mb-5">We may update this Privacy Policy.</p>
        <h2 className="text-xl font-bold mb-3">Contact Us</h2>
        <p>If you have questions, contact us at <strong>support@klorah.zendesk.com</strong>.</p>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
