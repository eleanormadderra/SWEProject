/**
 * Home component that handles user authentication and redirects.
 * 
 * This component uses Firebase authentication to check if a user is logged in.
 * If no user is authenticated, it redirects to the sign-up page.
 * 
 * @component
 * @returns {JSX.Element} The rendered component.
 * 
 * @remarks
 * This component uses the `useAuthState` hook from `react-firebase-hooks/auth` to get the current user.
 * It also uses the `useRouter` hook from `next/navigation` to handle navigation.
 * 
 * @todo
 * - Update and put the authentication check as a separate component.
 * - Improve the layout and structure of the returned JSX.
 */
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
      {/* <button 
        onClick={() => {
        //  signOut(auth); // ????
          sessionStorage.removeItem('user');
          router.push('/sign-up');
        }}
      >
        Log out
      </button> */}
      <div>
        <MainPage /> 
      </div>
    </>
  );
}