'use client';
import { useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from "../firebase/config";
import { useRouter } from 'next/navigation';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [signInWithEmailAndPassword, user, loading, errorMessage] = useSignInWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSignIn = async () => {
    setError(''); // Reset any previous errors

    try {
      const res = await signInWithEmailAndPassword(email, password);

      if (res.user) {
        sessionStorage.setItem('user', true);
        setEmail('');
        setPassword('');
        router.push('/'); // Redirect to the homepage after successful sign-in
      }
    } catch (e) {
      console.error(e);

      // Firebase error handling
      if (e.code === 'auth/user-not-found') {
        setError('No account found with that email address.');
      } else {
        setError('Something went wrong. Please check you email and password and try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#9E1B32]">
      <div className="bg-black p-10 rounded-lg shadow-xl w-96">
        <h1 className="text-2xl mb-5 text-center font-bold text-white">Login</h1>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
        />
        <button 
          onClick={handleSignIn}
          className="w-full p-3 bg-[#9E1B32] rounded text-white hover:bg-[#9E1B32]/80"
        >
          Login
        </button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default SignIn;
