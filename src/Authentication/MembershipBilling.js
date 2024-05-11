import React from 'react';
import { CheckIcon } from '@heroicons/react/24/solid'; // Correct import for Heroicons v2
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from './OnboardingContext';

const includedFeaturesPro = [
  'Unlimited invoicing',
  'Unlimited AI agreements',
  'No minimum invoice amount',
  'No transaction fees'
];

const includedFeaturesNonPro = [
  'Up to 5 invoices per month',
  'Up to 5 agreements per month',
  'Transaction fee: 3.9% per invoice',
  'Minimum invoice amount: $120',
];

export { includedFeaturesPro, includedFeaturesNonPro };

export default function MembershipBilling() {
  const { setOnboardingComplete } = useOnboarding();
  const navigate = useNavigate();

  const handleProOnboarding = () => {
    localStorage.setItem('isOnboardingComplete', 'true');
    navigate('/billing');
  };

  const handleCompleteOnboarding = () => {
    // When the user finishes the onboarding questions or skips them
    localStorage.setItem('isOnboardingComplete', 'true');
    navigate('/dashboard');
  };

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Suggestion Section */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-black">Based on your answers...</h2>
          <p className="mt-2 text-xl text-gray-600">You are a perfect match for Klorah Pro!</p>
        </div>

        {/* Pro Plan Section */}
        <div className="mx-auto mb-8 max-w-2xl rounded-3xl bg-black py-10 px-6 text-white shadow-xl">
          <h3 className="text-2xl font-bold">Klorah Pro Plan</h3>
          <p className="mt-4">$10 / month</p>
          <ul className="mt-6">
            {includedFeaturesPro.map((feature) => (
              <li key={feature} className="flex gap-x-3">
                <CheckIcon className="h-6 w-5" aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>
          <button className="mt-6 px-4 py-2 rounded bg-white text-black" onClick={handleProOnboarding}>
            Sign Up for Pro
          </button>
        </div>

        {/* Free Plan Section */}
        <div className="mx-auto max-w-2xl rounded-3xl border border-gray-300 p-8 text-center">
          <h3 className="text-xl font-semibold text-black">Or Continue with the Free Plan</h3>
          <ul className="mt-4">
            {includedFeaturesNonPro.map((feature) => (
              <li key={feature} className="flex gap-x-3">
                <CheckIcon className="h-6 w-5 flex-none text-black" aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>
          <button className="mt-6 px-4 py-2 rounded border border-black text-black" onClick={handleCompleteOnboarding}>
            Continue for Free
          </button>
        </div>
      </div>
    </div>
  );
}
