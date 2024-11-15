'use client'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from "../app/firebase/config";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import MainPage from './components/ugathens-bus';

export default function Home() {
  const [user] = useAuthState(auth);
  const router = useRouter()
  const userSession = sessionStorage.getItem('user');

  console.log({user})
 
  if (!user && !userSession){
    router.push('/sign-up')
  }

  useEffect(() => {
    if (!user) {
      router.push('/sign-up');  // Redirect if no user is authenticated
    }
  }, [user, router]);  // Only run the effect when the user state changes
  
  if (!user) {
    return <div>Loading...</div>;  // Render loading state while redirecting
  }

  return (
    <>
      <button 
        onClick={() => {
          signOut(auth);
          sessionStorage.removeItem('user');
        }}
      >
        Log out
      </button>
      <div>
        <MainPage />
      </div>
    </>
  );
}
