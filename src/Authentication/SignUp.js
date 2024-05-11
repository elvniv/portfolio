import React, { useState, useEffect } from "react";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import app from '../Firebase';
import { db } from "../Firebase";
import { doc, setDoc } from "firebase/firestore";
import mixpanel from 'mixpanel-browser';
import ReCAPTCHA from "react-google-recaptcha";

const needsEmailVerification = authUser =>
  authUser &&
  !authUser.emailVerified &&
  authUser.providerData
    .map(provider => provider.providerId)
    .includes('password');

export default function SignUp() {
  const auth = getAuth(app);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [captchaValue, setCaptchaValue] = useState(null);
  const [isSent, setIsSent] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.emailVerified) {
          setCurrentStep(2);
        } else {
          setCurrentStep(1.5); // User is signed up but not verified
        }
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const onSendEmailVerification = () => {
    auth.currentUser.sendEmailVerification()
      .then(() => setIsSent(true));
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    const username = event.target.username.value;

    if (!captchaValue) {
      setErrorMessage('Please verify the captcha');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await sendEmailVerification(user);
      await updateUsernameInDatabase(user.uid, username);
      mixpanel.track("User Sign Up", { "User ID": user.uid, "Email": email, "Username": username });
      setVerificationMessage('Verification email sent. Please check your inbox.');
    } catch (error) {
      const errorMessage = error.message;
      setErrorMessage(errorMessage);
      mixpanel.track("Sign Up Error", { "Error Message": errorMessage });
    }
  }

  async function updateUsernameInDatabase(userId, username) {
    const userRef = doc(db, 'users', userId);
    try {
      await setDoc(userRef, {
        username,
        userId,
        isPro: false,
        invoicesCreated: 0,
        agreementsCreated: 0,
        stripeOnboarded: false
      });
      mixpanel.track("Username Update", { "User ID": userId, "Username": username });
    } catch (error) {
      console.error('Error updating username in database:', error);
      mixpanel.track("Username Update Error", { "Error Message": error.message });
    }
  }

  if (currentStep === 1) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <img
                        className="mx-auto h-12 w-auto"
                        src="/klorahLogo.png"
                        alt="Logo"
                    />
                    <h2 className="mt-6 text-3xl font-extrabold text-black">
                        Create your account
                    </h2>
                    <p className="mt-2 text-sm text-black">
                        Or{' '}
                        <a href="/" className="font-medium text-black hover:text-gray-500">
                            login to your account
                        </a>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <input type="hidden" name="remember" defaultValue="true" />
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="relative block w-full appearance-none rounded-md border border-black px-3 py-2 text-black placeholder-gray-500 focus:z-10 focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <label htmlFor="username" className="sr-only">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="relative block w-full appearance-none rounded-md border border-black px-3 py-2 text-black placeholder-gray-500 focus:z-10 focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                                placeholder="Name"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="relative block w-full appearance-none rounded-md border border-black px-3 py-2 text-black placeholder-gray-500 focus:z-10 focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex justify-center">
                        <ReCAPTCHA
                            sitekey="6LfG2bIpAAAAAJrXdAnO_tOYO9OYmpQOHreiCr0i"
                            onChange={value => setCaptchaValue(value)}
                        />
                    </div>

                    <div className="mt-4">
                        <button
                            type="submit"
                            className="group relative flex w-full justify-center rounded-md border border-black bg-black py-2 px-4 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                        >
                            Sign up
                        </button>
                    </div>
                </form>
                {errorMessage && <div className="text-center text-sm text-red-600">{errorMessage}</div>}
                {verificationMessage && <div className="text-center text-sm text-green-600">{verificationMessage}</div>}
            </div>
        </div>
    );

  } else if (currentStep === 1.5) {
    return (
      <div className="text-center">
        {isSent ? (
          <p>
            E-Mail confirmation sent: Check your E-Mails (Spam folder included) for a confirmation E-Mail.
            Refresh this page once you confirmed your E-Mail.
          </p>
        ) : (
          <p>
            Verify your E-Mail: Check your E-Mails (Spam folder included) for a confirmation E-Mail or send
            another confirmation E-Mail.
          </p>
        )}
        <button
          type="button"
          onClick={onSendEmailVerification}
          disabled={isSent}
        >
          Send confirmation E-Mail
        </button>
      </div>
    );
  } else if (currentStep === 2) {
    navigate('/dashboard');
    mixpanel.track("Navigation", { "Destination": "/onboarding-questions" });
  } else if (currentStep === 3) {
    navigate('/membership-billing');
    mixpanel.track("Navigation", { "Destination": "/membership-billing" });
  }
}