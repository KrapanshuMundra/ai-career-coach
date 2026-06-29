// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1stPe6KEUkaBLJmJ0A9_BuHEWGkQDLYs",
  authDomain: "ai-career-coach-d0bbe.firebaseapp.com",
  projectId: "ai-career-coach-d0bbe",
  storageBucket: "ai-career-coach-d0bbe.firebasestorage.app",
  messagingSenderId: "297576295556",
  appId: "1:297576295556:web:c51c6e4d386a5a75f566d1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();