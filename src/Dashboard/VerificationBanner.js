import React from 'react';
import { getAuth, sendEmailVerification } from 'firebase/auth';

export const VerificationBanner = () => {
    const auth = getAuth();
  
    const handleSendVerificationEmail = () => {
      if (auth.currentUser) {
        sendEmailVerification(auth.currentUser).then(() => {
          console.log('Verification email sent');
        }).catch((error) => {
          console.error('Error sending verification email:', error);
        });
      }
    };
  
    if (auth.currentUser && !auth.currentUser.emailVerified) {
      return (
        <div className="fixed inset-x-0 bottom-0 px-6 pb-6">
            <div className="mr-auto max-w-xl rounded-xl bg-red-600 p-6 shadow-lg ring-1 ring-gray-900/10">
            <p className="text-sm leading-6 text-white">
                <strong>Please verify your email</strong><br/> Check your inbox for a verification email.
            </p>
            <div className="mt-4 flex items-center gap-x-5">
                <button
                className="rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700"
                onClick={handleSendVerificationEmail}
                >
                Resend Verification Email
                </button>
            </div>
            </div>
        </div>
      );
    } else {
      return null;
    }
  };
  