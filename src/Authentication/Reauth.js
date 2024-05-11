import React, { useState } from 'react';
import { getAuth, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Reauth = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const handleReauth = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user && user.email) {
      const credential = EmailAuthProvider.credential(user.email, password);

      try {
        await reauthenticateWithCredential(user, credential);
        onSuccess && onSuccess();
        navigate('/dashboard'); // Navigate to the dashboard
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div>
      <h2>Reauthenticate</h2>
      <input 
        type="password" 
        placeholder="Enter your password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleReauth}>Reauthenticate</button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Reauth;
