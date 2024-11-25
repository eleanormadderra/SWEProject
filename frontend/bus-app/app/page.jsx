'use client'
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from "../app/firebase/config";
import MainPage from './components/ugathens-bus';

export default function Home() {
  const [user] = useAuthState(auth);
  const router = useRouter()
  const userSession = sessionStorage.getItem('user');
  // console.log({user})
 
  if (!user && !userSession){
    router.push('/sign-up')
  }

  useEffect(() => {
    if (!user && !userSession) {
      router.push('/sign-up');  // Redirect if no user is authenticated
    }
  }, [user, router]);  // Only run the effect when the user state changes
  
//TOOD: update and put as component

  return (
    // Will need to update this cause this is sloppy 
    <>
      <button 
        onClick={() => {
        //  signOut(auth); // ????
          sessionStorage.removeItem('user');
          router.push('/sign-up');
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