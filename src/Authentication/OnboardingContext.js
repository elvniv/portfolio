import React, { createContext, useState, useContext } from 'react';

// Create a Context for the onboarding state.
const OnboardingContext = createContext();

// Custom hook to use the onboarding context.
export const useOnboarding = () => useContext(OnboardingContext);

// Provider component that wraps your app and provides the onboarding state.
export const OnboardingProvider = ({ children }) => {
  // State to track whether onboarding is complete.
  const [isOnboardingComplete, setOnboardingComplete] = useState(false);

  // The value prop of the provider will include the state and the setter function.
  // This allows any component that uses this context to read or update the onboarding state.
  return (
    <OnboardingContext.Provider value={{ isOnboardingComplete, setOnboardingComplete }}>
      {children}
    </OnboardingContext.Provider>
  );
};
