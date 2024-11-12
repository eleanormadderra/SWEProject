// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDS1IMFbci3Gp2kWi4ezEUbVfHEQeypvjw",
  authDomain: "sweproject-5ece5.firebaseapp.com",
  projectId: "sweproject-5ece5",
  storageBucket: "sweproject-5ece5.firebasestorage.app",
  messagingSenderId: "478861654053",
  appId: "1:478861654053:web:899d8d13326e376b09a7cc",
  measurementId: "G-Q4D8N37EKY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);