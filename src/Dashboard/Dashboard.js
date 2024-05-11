import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native-web';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../NavigationBar';
import BottomHalf from './BottomHalf';
import TopHalf from './TopHalf';
import useCurrentUser from '../Authentication/currentUser';
import FeedbackButtonWithForm from '../FeedbackButtonWithForm';
import useAuthAndEmailVerification from '../Authentication/useAuthandEmailVerification';
import { getAuth, sendEmailVerification } from 'firebase/auth';
import DownloadBanner from './DownloasAppBanner';
import { VerificationBanner } from './VerificationBanner';



const Dashboard = () => {
  const { isAuthenticated, isEmailVerified } = useAuthAndEmailVerification();
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();
  const [showVerificationBanner, setShowVerificationBanner] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !isEmailVerified) {
      setShowVerificationBanner(true);
    } else {
      setShowVerificationBanner(false);
    }
  }, [isAuthenticated, isEmailVerified]);

  const initiateStripeOnboarding = () => {
    navigate('/stripe-ob');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <View>
      <NavigationBar />
      {showVerificationBanner && <VerificationBanner />}
      {currentUser && !currentUser.stripeOnboarded && (
        <div className="flex items-center justify-center gap-x-6 bg-red-600 px-6 py-2.5 sm:px-3.5">
          <p className="text-sm leading-6 text-white text-center">
            <a onClick={initiateStripeOnboarding}>
              <strong className="font-semibold">Additional information required</strong>
              <svg viewBox="0 0 2 2" className="mx-2 inline h-0.5 w-0.5 fill-current" aria-hidden="true">
                <circle cx={1} cy={1} r={1} />
              </svg>
              You will need to provide more information to start accepting payments&nbsp;<span aria-hidden="true">&rarr;</span>
            </a>
          </p>
        </div>
      )}
      <View style={styles.topFrameContainer}>
        <TopHalf style={styles.topHalf} />
        <BottomHalf style={styles.bottomHalf} />
      </View>
      <FeedbackButtonWithForm />
      <DownloadBanner />
      <VerificationBanner />
    </View>
  );
};

const styles = StyleSheet.create({
  topFrameContainer: {
    position: 'relative',
    top: 20,
    alignItems: 'center',
    width: '100%',
    gap: 5,
  },
  topHalf: {
    marginBottom: 5,
  },
  bottomHalf: {
    marginTop: -5,
  },
});

export default Dashboard;
