import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const useAuthAndEmailVerification = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        setIsAuthenticated(true);
        setIsEmailVerified(true);
      } else {
        navigate('/signup');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return { isAuthenticated, isEmailVerified };
};

export default useAuthAndEmailVerification;
