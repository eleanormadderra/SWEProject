/**
 * Initializes and configures the Firebase application.
 * @module firebase/config
 * 
 * @requires firebase/app
 * @requires firebase/auth
 * @requires firebase/analytics
 * 
 * @constant {Object} firebaseConfig - The configuration object for Firebase initialization.
 * @property {string} firebaseConfig.apiKey - The API key for Firebase.
 * @property {string} firebaseConfig.authDomain - The authentication domain for Firebase.
 * @property {string} firebaseConfig.projectId - The project ID for Firebase.
 * @property {string} firebaseConfig.storageBucket - The storage bucket for Firebase.
 * @property {string} firebaseConfig.messagingSenderId - The messaging sender ID for Firebase.
 * @property {string} firebaseConfig.appId - The app ID for Firebase.
 * 
 * @constant {Object} app - The initialized Firebase app instance.
 * 
 * @constant {Object} auth - The Firebase authentication instance.
 * 
 * @example
 * import { app, auth } from './firebase/config';
 */
import { getAnalytics } from "firebase/analytics";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

const auth = getAuth(app)

export { app, auth };
