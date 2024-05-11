import { useEffect, useState } from 'react';
import axios from 'axios';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase';

const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [invoiceLimit, setInvoiceLimit] = useState(null);
  const [transactionFee, setTransactionFee] = useState(null);

  const NON_PRO_INVOICE_LIMIT = 5;
  const NON_PRO_TRANSACTION_FEE = 3.9;

  useEffect(() => {
    const auth = getAuth();

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const unsubscribeDoc = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setCurrentUser(userData);

            if (userData.isPro) {
              setInvoiceLimit(Infinity);
              setTransactionFee(0);
            } else {
              setInvoiceLimit(NON_PRO_INVOICE_LIMIT);
              setTransactionFee(NON_PRO_TRANSACTION_FEE);
            }
          } else {
            console.log("No such document!");
          }
        });

        const idToken = await user.getIdToken();
        axios.defaults.headers.common['Authorization'] = `Bearer ${idToken}`;

        return () => unsubscribeDoc();
      } else {
        setCurrentUser(null);
        delete axios.defaults.headers.common['Authorization'];
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const setOnboardingComplete = async (isComplete) => {
    if (!currentUser) return;

    const userRef = doc(db, 'users', currentUser.userId);
    try {
      await updateDoc(userRef, {
        onboardingComplete: isComplete
      });
    } catch (error) {
      console.error('Error updating onboarding status:', error);
    }
  };

  return {
    currentUser,
    invoiceLimit,
    transactionFee,
    username: currentUser?.username,
    setOnboardingComplete,
  };
};

export default useCurrentUser;
