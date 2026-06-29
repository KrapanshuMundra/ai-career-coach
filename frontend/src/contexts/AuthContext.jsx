import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';

// Create the Context
const AuthContext = createContext();

// Create a custom hook so other files can easily use this context
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // Prevents rendering before Firebase checks the user

  // ==========================================
  // 🔐 CORE AUTHENTICATION METHODS
  // ==========================================

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  // ==========================================
  // 🚀 PRO SAAS FEATURES
  // ==========================================

  // Allows users to reset their forgotten passwords
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  // One-click Google Login (Requires Google Auth enabled in Firebase Console)
  function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  }

  // ==========================================
  // 🎧 AUTH STATE LISTENER
  // ==========================================
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe; // Cleanup listener when component unmounts
  }, []);

  // The data and functions we want to make available to the rest of the app
  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    loginWithGoogle
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}