import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // NEW: OTP States
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setPassword("");
    setPasswordConfirm("");
    setShowPassword(false);
    setShowOtpInput(false); // Reset OTP state on toggle
    setOtp("");
  };

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!isLogin && !showOtpInput && password !== passwordConfirm) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setLoading(true);
      
      // =========================================
      // FLOW 1: STANDARD LOGIN
      // =========================================
      if (isLogin) {
        await login(email, password);
        navigate("/evaluator");
      } 
      // =========================================
      // FLOW 2: SIGNUP - REQUEST OTP
      // =========================================
      else if (!showOtpInput) {
        await axios.post("http://localhost:5000/api/auth/send-otp", { email });
        setShowOtpInput(true); // Switch UI to OTP mode
      } 
      // =========================================
      // FLOW 3: SIGNUP - VERIFY OTP & REGISTER
      // =========================================
      else {
        // 1. Verify OTP with Backend
        await axios.post("http://localhost:5000/api/auth/verify-otp", { email, otp });

        // 2. Create Firebase Account
        const userCredential = await signup(email, password);
        const userId = userCredential?.user?.uid;

        // 3. Sync with MongoDB
        if (userId) {
          await axios.post("http://localhost:5000/api/auth/register", {
            userId: userId,
            email: email,
            password: password,
          });
          console.log("👤 User registration profile synchronized with MongoDB cluster.");
        }
        navigate("/evaluator");
      }
    } catch (err) {
      if (!isLogin && !showOtpInput) {
        setError("Failed to send verification code. Ensure your email is correct.");
      } else if (!isLogin && showOtpInput) {
        setError(err.response?.data?.message || "Invalid or expired OTP.");
      } else {
        setError("Failed to log in: Incorrect credentials.");
      }
    } finally {
      setLoading(false);
    }
  }

  const fadeUp = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.2 } }
  };

  // --- CONTENT FOR SCROLLING COLUMNS (Unchanged) ---
  const column1Cards = [
    <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
          <span className="material-symbols-outlined text-xl">radar</span>
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">ATS Match</p>
          <p className="text-xs text-gray-500">Resume parsed successfully</p>
        </div>
      </div>
      <div className="flex items-end gap-2 mt-1">
        <span className="text-3xl font-black text-gray-900">92%</span>
      </div>
      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-green-500 w-[92%] rounded-full" />
      </div>
    </div>,
    <div className="bg-[#6A0DAD] p-5 rounded-3xl shadow-md border border-[#7B1EBF] text-white flex flex-col gap-2">
      <span className="material-symbols-outlined text-2xl text-purple-300">record_voice_over</span>
      <p className="font-bold text-sm leading-snug">"Tell me about a time you optimized a backend system."</p>
      <p className="text-[10px] text-purple-200 mt-1">AI Interviewer • Technical Round</p>
    </div>,
    <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <span className="px-2.5 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded-lg border border-red-100">Missing Keyword</span>
      </div>
      <p className="text-sm font-bold text-gray-900">AWS CloudFormation</p>
      <p className="text-xs text-gray-500 leading-tight">Consider adding this to your experience section.</p>
    </div>
  ];

  const column2Cards = [
    <div className="bg-gray-900 p-5 rounded-3xl shadow-md border border-gray-800 text-white flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" className="w-8 h-8 rounded-full border border-gray-600" />
        <div>
          <p className="text-sm font-bold">Landed the job!</p>
          <p className="text-[10px] text-gray-400">Priya R. • Software Engineer</p>
        </div>
      </div>
      <p className="text-xs text-gray-300 leading-relaxed italic">"The mock interview was exactly what I needed. It asked questions straight from my resume."</p>
    </div>,
    <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-1">
        <span className="material-symbols-outlined text-blue-500 text-lg">psychology</span>
        <p className="text-sm font-bold text-gray-900">AI Feedback</p>
      </div>
      <p className="text-xs text-gray-600 leading-relaxed font-medium">Your answer structure was great. Next time, try using the <strong>STAR method</strong> to define the results.</p>
    </div>,
    <div className="bg-[#FFF6EF] p-5 rounded-3xl shadow-sm border border-orange-100 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <p className="text-sm font-bold text-gray-900">Action Verbs</p>
        <span className="material-symbols-outlined text-orange-500 text-base">check_circle</span>
      </div>
      <div className="flex flex-wrap gap-2 mt-1">
        <span className="px-2.5 py-1 bg-white text-orange-700 text-[10px] font-bold rounded-lg shadow-sm border border-orange-50">Spearheaded</span>
        <span className="px-2.5 py-1 bg-white text-orange-700 text-[10px] font-bold rounded-lg shadow-sm border border-orange-50">Architected</span>
      </div>
    </div>
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 lg:p-12 bg-gray-50/50 font-['Inter',sans-serif]">
      <div className="w-full max-w-[1100px] bg-white rounded-[2.5rem] shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-gray-100 flex overflow-hidden relative lg:h-[650px]">
        
        {/* LEFT COLUMN: The Auth Forms */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 sm:px-12 py-12 relative z-10 bg-white">
          <div className="w-full max-w-[380px]">
            
            {/* Brand Logo */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6A0DAD] flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                </svg>
              </div>
              <span className="text-black font-extrabold text-2xl tracking-tight">careercoach</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={isLogin ? "login" : "signup"} initial="hidden" animate="visible" exit="exit" variants={fadeUp}>
                <div className="mb-6">
                  <h2 className="text-3xl font-extrabold text-black tracking-tight">
                    {isLogin ? "Welcome back" : (showOtpInput ? "Verify Email" : "Create Account")}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1.5 font-medium">
                    {isLogin 
                      ? "Please enter your details to access your dashboard." 
                      : (showOtpInput ? `We sent a 6-digit code to ${email}` : "Join to start optimizing your resume with AI.")}
                  </p>
                </div>

                {error && (
                  <div className="p-3 mb-5 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">error</span>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* --- CONDITIONAL RENDER: ONLY SHOW EMAIL/PASS IF OTP NOT REQUESTED --- */}
                  {!showOtpInput && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                      <div>
                        <label className="block mb-1.5 text-[10px] font-bold text-gray-500 tracking-widest uppercase">Email</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 text-black placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-[#6A0DAD]/30 focus:border-[#6A0DAD] outline-none transition-all font-medium text-sm shadow-sm"
                          placeholder="name@example.com"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="block text-[10px] font-bold text-gray-500 tracking-widest uppercase">Password</label>
                          {isLogin && <a href="#" className="text-[10px] font-bold text-[#6A0DAD] hover:underline">Forgot?</a>}
                        </div>
                        <div className="relative flex items-center">
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 pr-10 rounded-xl bg-gray-50 border border-gray-200 text-black placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-[#6A0DAD]/30 focus:border-[#6A0DAD] outline-none transition-all font-medium text-sm shadow-sm"
                            placeholder="Enter your password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center focus:outline-none"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              {showPassword ? "visibility" : "visibility_off"}
                            </span>
                          </button>
                        </div>
                      </div>

                      {!isLogin && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                          <label className="block mb-1.5 text-[10px] font-bold text-gray-500 tracking-widest uppercase mt-4">Confirm Password</label>
                          <div className="relative flex items-center">
                            <input
                              type={showPassword ? "text" : "password"}
                              required
                              value={passwordConfirm}
                              onChange={(e) => setPasswordConfirm(e.target.value)}
                              className="w-full p-3 pr-10 rounded-xl bg-gray-50 border border-gray-200 text-black placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-[#6A0DAD]/30 focus:border-[#6A0DAD] outline-none transition-all font-medium text-sm shadow-sm"
                              placeholder="Confirm your password"
                            />
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {/* --- CONDITIONAL RENDER: ONLY SHOW OTP IF REQUESTED --- */}
                  {showOtpInput && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <label className="block mb-1.5 text-[10px] font-bold text-gray-500 tracking-widest uppercase mt-2">6-Digit Code</label>
                      <input
                        type="text"
                        required
                        maxLength="6"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Only allow numbers
                        className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 text-black placeholder:text-gray-300 focus:bg-white focus:ring-2 focus:ring-[#6A0DAD]/30 focus:border-[#6A0DAD] outline-none transition-all font-black text-2xl tracking-[0.5em] text-center shadow-sm"
                        placeholder="••••••"
                      />
                      <div className="flex justify-between items-center mt-3">
                        <button type="button" onClick={() => setShowOtpInput(false)} className="text-[11px] font-bold text-gray-500 hover:text-gray-800 transition-colors">
                          &larr; Use a different email
                        </button>
                        <button type="button" onClick={() => axios.post("http://localhost:5000/api/auth/send-otp", { email })} className="text-[11px] font-bold text-[#6A0DAD] hover:underline">
                          Resend Code
                        </button>
                      </div>
                    </motion.div>
                  )}

                  <button
                    disabled={loading}
                    type="submit"
                    className="w-full py-3.5 mt-4 rounded-xl font-bold text-white bg-[#6A0DAD] hover:bg-[#580b94] transition-all shadow-md active:scale-95 disabled:opacity-70 flex justify-center items-center gap-2 text-sm"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      isLogin ? "Sign In" : (showOtpInput ? "Verify & Register" : "Continue with Email")
                    )}
                  </button>
                </form>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 text-center text-xs text-gray-500 font-medium border-t border-gray-100 pt-5">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button onClick={toggleAuthMode} className="text-[#6A0DAD] font-bold hover:underline transition-all">
                {isLogin ? "Sign up for free" : "Log in here"}
              </button>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: Infinite Scrolling Masonry Grid (Unchanged) */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#F9F5FF] relative overflow-hidden items-center justify-center pointer-events-none border-l border-gray-100">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#F9F5FF] to-transparent z-10" />
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#F9F5FF] to-transparent z-10" />
          <div className="flex gap-5 w-full max-w-[420px] px-4 transform rotate-[-2deg] scale-110">
            <motion.div animate={{ y: ["0%", "-50%"] }} transition={{ ease: "linear", duration: 25, repeat: Infinity }} className="flex-1 flex flex-col gap-5">
              {[...column1Cards, ...column1Cards].map((card, index) => (
                <div key={`col1-${index}`}>{card}</div>
              ))}
            </motion.div>
            <motion.div animate={{ y: ["-50%", "0%"] }} transition={{ ease: "linear", duration: 30, repeat: Infinity }} className="flex-1 flex flex-col gap-5 pt-10">
              {[...column2Cards, ...column2Cards].map((card, index) => (
                <div key={`col2-${index}`}>{card}</div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}