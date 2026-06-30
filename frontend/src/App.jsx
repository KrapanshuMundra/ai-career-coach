import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { AnimatePresence, motion } from "framer-motion";

// Components
import Navbar from "./components/Navbar";
import Loader from "./components/Loader";
import Footer from "./pages/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import ResumeEvaluator from "./pages/ResumeEvaluator";
import MockInterview from "./pages/MockInterview";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import FeedbackForm from "./components/FeedbackFrom";
function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

export default function App() {
  // Starts as TRUE so the loader shows immediately during application boot
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation(); 
  const hideNavbar = location.pathname === "/login" || location.pathname === "/signup";

  // Flag tracking to verify a resume evaluation occurred in the active lifecycle
  const [isResumeEvaluated, setIsResumeEvaluated] = useState(() => {
    return sessionStorage.getItem("cached_evaluation_result") !== null;
  });

  // =========================================================
  // 🛡️ Handles Initial App Boot / Refresh ONLY
  // =========================================================
  useEffect(() => {
    const initialBootDelay = setTimeout(() => {
      // authentication context initialization happens here
      setIsLoading(false); // App is fully booted, hide loader permanently
    }, 800); 

    return () => clearTimeout(initialBootDelay);
  }, []); // Empty dependency array = Runs ONCE on fresh boot/refresh

  // 🗑️ DELETED the second useEffect that was artificially slowing down route changes!

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#FAFAFA] text-gray-900 font-['Inter',sans-serif] selection:bg-purple-100 selection:text-purple-900 overflow-x-hidden">
      
      {/* 🚀 GLOBAL LOADER OVERLAY (Only shows on initial boot) */}
      <AnimatePresence mode="wait">
        {isLoading && <Loader isGlobal={true} />}
      </AnimatePresence>
      
      {/* RENDER MAIN APP CONTENT */}
      <motion.div
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col flex-grow"
      >
        {!hideNavbar && <Navbar />}

        {/* Main Content Area */}
        <main className="flex-grow">
          {/* AnimatePresence here allows for smooth page transitions without a loading spinner */}
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/signup" element={<Auth />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/contact" element={<Contact />} />

              {/* Protected Routes */}
              <Route 
                path="/evaluator" 
                element={
                  <PrivateRoute>
                    <ResumeEvaluator 
                      onEvaluationComplete={() => setIsResumeEvaluated(true)} 
                      onEvaluationReset={() => setIsResumeEvaluated(false)} 
                    />
                  </PrivateRoute>
                } 
              />
              <Route
                path="/interview"
                element={
                  <PrivateRoute>
                    <MockInterview isResumeReady={isResumeEvaluated} />
                  </PrivateRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                    <FeedbackForm/>
                  </PrivateRoute>
                }
              />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </AnimatePresence>
        </main>

        <Footer />
      </motion.div>
    </div>
  );
}