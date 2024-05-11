import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, setPersistence, browserLocalPersistence, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore"; // Import Firestore functions
import app, { db } from '../Firebase'; // Import your Firestore instance


export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const [rememberMe, setRememberMe] = useState(true);
    
    
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
  
    const handleLoginWithEmail = (event) => {
      event.preventDefault();
      
      if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
      } else {
          localStorage.removeItem('rememberMe');
      }

      signInWithEmailAndPassword(auth, email, password)
          .then(() => {
              navigate('/dashboard');
          })
          .catch(handleAuthErrors);
  };

//   const handleGoogleSignIn = () => {
//     signInWithPopup(auth, provider)
//         .then((result) => {
//             if (rememberMe) {
//                 localStorage.setItem('rememberMe', 'true');
//             } else {
//                 localStorage.removeItem('rememberMe');
//             }
//             navigate('/dashboard');
//         })
//         .catch((error) => {
//             const errorMessage = 'Failed to sign in with Google. Please try again later.';
//             setErrorMessage(errorMessage);
//         });
// };
    const handleGoogleSignIn = () => {
        signInWithPopup(auth, provider)
            .then(async (result) => {
                const user = result.user;
                const userRef = doc(db, 'users', user.uid);
    
                // Check if the user document exists
                const docSnap = await getDoc(userRef);
                if (!docSnap.exists()) {
                    // Create a new user document
                    await setDoc(userRef, {
                        userId: user.uid,
                        username: user.displayName || 'Anonymous', // Or any other default value
                        email: user.email,
                        isPro: false,
                        invoicesCreated: 0,
                        agreementsCreated: 0,
                        stripeOnboarded: false,
                        // Add any other default fields you require
                    });
                }
    
                if (rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                } else {
                    localStorage.removeItem('rememberMe');
                }
                navigate('/dashboard');
            })
            .catch((error) => {
                const errorMessage = 'Failed to sign in with Google. Please try again later.';
                setErrorMessage(errorMessage);
            });
    };
  

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'email') setEmail(value);
        if (name === 'password') setPassword(value);
    };

    function handleAuthErrors(error) {
        let errorMessage = '';
        if (error.code === 'auth/user-not-found') {
            errorMessage = 'Invalid email address.';
        } else if (error.code === 'auth/wrong-password') {
            errorMessage = 'Invalid password.';
        } else {
            errorMessage = 'Failed to sign in. Please try again later.';
        }
        setErrorMessage(errorMessage);
    }

    return (
        <div className="flex min-h-screen flex-1">
            <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <h1 className="text-3xl font-black mb-2">Login to Klorah</h1>
                    <h1 className="text-2xl font-regular mb-4">The only invoicing app you need</h1>
                    <p className="text-sm mb-4">Don't have an account? <Link to="/signup" className="text-blue-600 ">Create a free account</Link></p>
                    
                    <form onSubmit={handleLoginWithEmail}>
                        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="mt-1 p-2 w-full border rounded-md"
                                value={email}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="mt-1 p-2 w-full border rounded-md"
                                value={password}
                                onChange={handleInputChange}
                            />
                        </div>
                        
                        <div className="mb-4 flex items-center">
                          <input
                                  type="checkbox"
                                  id="rememberMe"
                                  name="rememberMe"
                                  checked={rememberMe}
                                  onChange={(e) => setRememberMe(e.target.checked)}
                              />
                          <label htmlFor="rememberMe" className="ml-2 text-sm font-medium text-gray-700">Remember me</label>
                          <Link to="/auth/forgot-password" className="text-black ml-auto">Forgot password?</Link>
                        </div>
                        <div className="mb-4">
                            <button type="submit" className="w-full p-2 border border-transparent rounded-md shadow-sm text-white bg-black hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                Sign in
                            </button>
                        </div>
                        <div className="mb-4">
                            <button type="button" onClick={handleGoogleSignIn} className="w-full p-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                Sign in with Google
                            </button>
                        </div>
                        <div className="mt-6 text-sm">
                            <Link to="/tos" className="text-black mr-4">Terms of Service</Link>
                            <Link to="/privacy-policy" className="text-black ">Privacy Policy</Link>
                        </div>
                    </form>
                </div>
            </div>
            <div className="flex-1 lg:block hidden">
                <img
                    className="h-full w-full object-cover"
                    src="./freelancer.jpg"
                    alt="Background Image"
                />
            </div>
        </div>
    );
}