import React, { useState, useEffect } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getFirestore, getDoc } from "firebase/firestore";

export default function SignInModal() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isNewUser, setIsNewUser] = useState(false);
    const [error, setError] = useState('');
    const [userSignedIn, setUserSignedIn] = useState(false); // Track if the user has signed in
    const auth = getAuth();
    const db = getFirestore();
    const navigate = useNavigate();

    useEffect(() => {
        if (auth.currentUser) {
            handleUserDocument(auth.currentUser);
        }
    }, [auth.currentUser]);

    const handleSignIn = async (event) => {
        event.preventDefault();
        setError('');
        try {
            const userCredential = isNewUser ? await createUserWithEmailAndPassword(auth, email, password) : await signInWithEmailAndPassword(auth, email, password);
            await handleUserDocument(userCredential.user);
            setUserSignedIn(true); // Set the user signed in state to true
        } catch (error) {
            console.error('Error in authentication:', error);
            setError(isNewUser ? 'Failed to create account. Please try again.' : 'Failed to sign in. Please check your credentials and try again.');
        }
    };

    const handleGoogleSignIn = async () => {
        setError('');
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            await handleUserDocument(result.user);
            setUserSignedIn(true); // Set the user signed in state to true
        } catch (error) {
            console.error('Error signing in with Google:', error);
            setError('Failed to sign in with Google. Please try again.');
        }
    };

    const handleUserDocument = async (user) => {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (!docSnap.exists()) {
            await setDoc(userRef, {
                email: user.email,
                category: "hireUser"
            });
        }
    };

    if (userSignedIn) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white">You have been added to the waitlist...</h2>
                    <p className="text-white">You will receive an email update soon.</p>
                <p className="text-white mt-4 cursor-pointer underline" onClick={() => window.open('https://klorah.app', '_blank')}>In the meantime you can create a profile to get hired on klorah.app</p>
                </div>
            </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <form className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg" onSubmit={handleSignIn}>
                <div className="space-y-4">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold">{isNewUser ? 'Create your account' : 'Welcome back!'}</h2>
                        <p className="text-gray-500">{isNewUser ? 'Sign up to start your journey.' : 'Sign in to your account to continue.'}</p>
                        {error && <p className="text-red-500">{error}</p>}
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="mt-1 w-full p-2 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block shadow-sm sm:text-sm border rounded-md"
                                placeholder="m@example.com"
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                id="password"
                                className="mt-1 w-full p-2 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block shadow-sm sm:text-sm border rounded-md"
                                placeholder="••••••••"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            {isNewUser ? 'Sign Up' : 'Sign In'}
                        </button>
                        <button type="button" className="mt-2 text-sm text-blue-600 hover:text-blue-800" onClick={() => setIsNewUser(!isNewUser)}>
                            {isNewUser ? 'Already have an account? Sign In' : 'Don’t have an account? Sign Up'}
                        </button>
                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-gray-500">
                                    Or continue with
                                </span>
                            </div>
                        </div>
                        <button type="button" onClick={handleGoogleSignIn} className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <ChromeIcon className="mr-2 h-4 w-4 inline" />
                            Sign in with Google
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

function ChromeIcon(props) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="4" />
            <line x1="21.17" x2="12" y1="8" y2="8" />
            <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
            <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
        </svg>
    );
}
