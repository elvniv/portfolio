import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const AutoLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  useEffect(() => {
    if (initialCheckDone || location.pathname === '/contact-us') {
      return;
    }
  
    const remember = localStorage.getItem('rememberMe');
    if (remember && remember === 'true') {
      const unsubscribe = onAuthStateChanged(auth, user => {
        if (user) {
          const isOnboardingComplete = localStorage.getItem('isOnboardingComplete');
          if (
            !location.pathname.startsWith('/share-agreement/') &&
            !location.pathname.startsWith('/edit-agreement/') &&
            location.pathname !== '/contact-us' &&
            location.pathname !== '/profile'
        ) {
            if (!isOnboardingComplete) {
              // this is where you can tweak for onboarding questions when you change logic of cookies or firestore writes
              navigate('/dashboard');
            } else {
              navigate('/dashboard');
            }
          }
          setInitialCheckDone(true);
        }
      });
  
      return () => unsubscribe();
    }
  }, [navigate, auth, initialCheckDone, location.pathname]);

  return null;
};

export default AutoLogin;
