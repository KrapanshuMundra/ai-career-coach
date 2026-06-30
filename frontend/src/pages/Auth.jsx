import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import api from "../utils/api";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setShowPassword(false);
  };

  // Validation schema — confirmPassword only required when signing up
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Please enter a valid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: isLogin
      ? Yup.string()
      : Yup.string()
          .oneOf([Yup.ref("password")], "Passwords do not match")
          .required("Please confirm your password"),
  });

  async function handleFormSubmit(values, { setSubmitting }) {
    try {
      setError("");

      // =========================================
      // FLOW 1: STANDARD LOGIN
      // =========================================
      if (isLogin) {
        await login(values.email, values.password);
        navigate("/evaluator");
      }
      // =========================================
      // FLOW 2: SIGNUP - DIRECT (NO OTP)
      // =========================================
      else {
        const userCredential = await signup(values.email, values.password);
        const userId = userCredential?.user?.uid;

        if (userId) {
          await api.post("/api/auth/register", {
            userId,
            email: values.email,
            password: values.password,
          });
        }
        navigate("/evaluator");
      }
    } catch (err) {
      if (isLogin) {
        setError("Failed to log in: Incorrect credentials.");
      } else {
        setError(err.response?.data?.message || "Failed to create account. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  const fadeUp = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.2 } }
  };

  // --- CONTENT FOR SCROLLING COLUMNS ---
  const column1Cards = [
    <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col gap-3 transition-colors duration-300">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0 transition-colors duration-300">
          <span className="material-symbols-outlined text-xl">radar</span>
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 dark:text-zinc-100 transition-colors duration-300">ATS Match</p>
          <p className="text-xs text-gray-500 dark:text-zinc-400 transition-colors duration-300">Resume parsed successfully</p>
        </div>
      </div>
      <div className="flex items-end gap-2 mt-1">
        <span className="text-3xl font-black text-gray-900 dark:text-zinc-100 transition-colors duration-300">92%</span>
      </div>
      <div className="h-1.5 w-full bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden transition-colors duration-300">
        <div className="h-full bg-green-500 w-[92%] rounded-full" />
      </div>
    </div>,
    <div className="bg-[#6A0DAD] dark:bg-purple-900 p-5 rounded-3xl shadow-md border border-[#7B1EBF] dark:border-purple-700 text-white flex flex-col gap-2 transition-colors duration-300">
      <span className="material-symbols-outlined text-2xl text-purple-300">record_voice_over</span>
      <p className="font-bold text-sm leading-snug">"Tell me about a time you optimized a backend system."</p>
      <p className="text-[10px] text-purple-200 mt-1">AI Interviewer • Technical Round</p>
    </div>,
    <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col gap-2 transition-colors duration-300">
      <div className="flex justify-between items-start">
        <span className="px-2.5 py-1 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-bold rounded-lg border border-red-100 dark:border-red-500/20 transition-colors duration-300">Missing Keyword</span>
      </div>
      <p className="text-sm font-bold text-gray-900 dark:text-zinc-100 transition-colors duration-300">AWS CloudFormation</p>
      <p className="text-xs text-gray-500 dark:text-zinc-400 leading-tight transition-colors duration-300">Consider adding this to your experience section.</p>
    </div>
  ];

  const column2Cards = [
    <div className="bg-gray-900 dark:bg-black p-5 rounded-3xl shadow-md border border-gray-800 dark:border-zinc-800 text-white flex flex-col gap-3 transition-colors duration-300">
      <div className="flex items-center gap-3">
        <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" className="w-8 h-8 rounded-full border border-gray-600 dark:border-zinc-700 transition-colors duration-300" />
        <div>
          <p className="text-sm font-bold">Landed the job!</p>
          <p className="text-[10px] text-gray-400 dark:text-zinc-500 transition-colors duration-300">Priya R. • Software Engineer</p>
        </div>
      </div>
      <p className="text-xs text-gray-300 dark:text-zinc-400 leading-relaxed italic transition-colors duration-300">"The mock interview was exactly what I needed. It asked questions straight from my resume."</p>
    </div>,
    <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col gap-2 transition-colors duration-300">
      <div className="flex items-center gap-2 mb-1">
        <span className="material-symbols-outlined text-blue-500 text-lg">psychology</span>
        <p className="text-sm font-bold text-gray-900 dark:text-zinc-100 transition-colors duration-300">AI Feedback</p>
      </div>
      <p className="text-xs text-gray-600 dark:text-zinc-400 leading-relaxed font-medium transition-colors duration-300">Your answer structure was great. Next time, try using the <strong>STAR method</strong> to define the results.</p>
    </div>,
    <div className="bg-[#FFF6EF] dark:bg-orange-500/5 p-5 rounded-3xl shadow-sm border border-orange-100 dark:border-orange-500/10 flex flex-col gap-2 transition-colors duration-300">
      <div className="flex justify-between items-center">
        <p className="text-sm font-bold text-gray-900 dark:text-zinc-100 transition-colors duration-300">Action Verbs</p>
        <span className="material-symbols-outlined text-orange-500 text-base">check_circle</span>
      </div>
      <div className="flex flex-wrap gap-2 mt-1">
        <span className="px-2.5 py-1 bg-white dark:bg-zinc-800 text-orange-700 dark:text-orange-400 text-[10px] font-bold rounded-lg shadow-sm border border-orange-50 dark:border-orange-500/20 transition-colors duration-300">Spearheaded</span>
        <span className="px-2.5 py-1 bg-white dark:bg-zinc-800 text-orange-700 dark:text-orange-400 text-[10px] font-bold rounded-lg shadow-sm border border-orange-50 dark:border-orange-500/20 transition-colors duration-300">Architected</span>
      </div>
    </div>
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 lg:p-12 bg-gray-50/50 dark:bg-black transition-colors duration-300 font-['Inter',sans-serif]">
      <div className="w-full max-w-[1100px] bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-gray-100 dark:border-zinc-800 flex overflow-hidden relative lg:h-[650px] transition-colors duration-300">

        {/* LEFT COLUMN: The Auth Forms */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 sm:px-12 py-12 relative z-10 bg-white dark:bg-zinc-900 transition-colors duration-300">
          <div className="w-full max-w-[380px]">

            {/* Brand Logo */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-[#6A0DAD] dark:text-purple-400 flex items-center justify-center transition-colors duration-300">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                </svg>
              </div>
              <span className="text-black dark:text-white font-extrabold text-2xl tracking-tight transition-colors duration-300">careercoach</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={isLogin ? "login" : "signup"} initial="hidden" animate="visible" exit="exit" variants={fadeUp}>
                <div className="mb-6">
                  <h2 className="text-3xl font-extrabold text-black dark:text-white tracking-tight transition-colors duration-300">
                    {isLogin ? "Welcome back" : "Create Account"}
                  </h2>
                  <p className="text-gray-500 dark:text-zinc-400 text-sm mt-1.5 font-medium transition-colors duration-300">
                    {isLogin
                      ? "Please enter your details to access your dashboard."
                      : "Join to start optimizing your resume with AI."}
                  </p>
                </div>

                {error && (
                  <div className="p-3 mb-5 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl font-medium flex items-center gap-2 transition-colors duration-300">
                    <span className="material-symbols-outlined text-base">error</span>
                    {error}
                  </div>
                )}

                <Formik
                  initialValues={{ email: "", password: "", confirmPassword: "" }}
                  validationSchema={validationSchema}
                  onSubmit={handleFormSubmit}
                  enableReinitialize
                >
                  {({ isSubmitting }) => (
                    <Form className="space-y-4" noValidate>

                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                        <div>
                          <label className="block mb-1.5 text-[10px] font-bold text-gray-500 dark:text-zinc-400 tracking-widest uppercase transition-colors duration-300">Email</label>
                          <Field
                            type="email"
                            name="email"
                            className="w-full p-3 rounded-xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:bg-white dark:focus:bg-zinc-800 focus:ring-2 focus:ring-[#6A0DAD]/30 focus:border-[#6A0DAD] outline-none transition-all font-medium text-sm shadow-sm"
                            placeholder="name@example.com"
                          />
                          <ErrorMessage name="email">
                            {(msg) => (
                              <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">error</span>
                                {msg}
                              </p>
                            )}
                          </ErrorMessage>
                        </div>

                        <div>
                          <div className="relative flex items-center">
                            <Field
                              type={showPassword ? "text" : "password"}
                              name="password"
                              className="w-full p-3 pr-10 rounded-xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:bg-white dark:focus:bg-zinc-800 focus:ring-2 focus:ring-[#6A0DAD]/30 focus:border-[#6A0DAD] outline-none transition-all font-medium text-sm shadow-sm"
                              placeholder="Enter your password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 text-gray-400 dark:text-zinc-400 hover:text-gray-600 dark:hover:text-zinc-200 transition-colors flex items-center justify-center focus:outline-none"
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                {showPassword ? "visibility" : "visibility_off"}
                              </span>
                            </button>
                          </div>
                          <ErrorMessage name="password">
                            {(msg) => (
                              <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">error</span>
                                {msg}
                              </p>
                            )}
                          </ErrorMessage>
                        </div>

                        {!isLogin && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                            <label className="block mb-1.5 text-[10px] font-bold text-gray-500 dark:text-zinc-400 tracking-widest uppercase mt-4 transition-colors duration-300">Confirm Password</label>
                            <div className="relative flex items-center">
                              <Field
                                type={showPassword ? "text" : "password"}
                                name="confirmPassword"
                                className="w-full p-3 pr-10 rounded-xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:bg-white dark:focus:bg-zinc-800 focus:ring-2 focus:ring-[#6A0DAD]/30 focus:border-[#6A0DAD] outline-none transition-all font-medium text-sm shadow-sm"
                                placeholder="Confirm your password"
                              />
                            </div>
                            <ErrorMessage name="confirmPassword">
                              {(msg) => (
                                <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[14px]">error</span>
                                  {msg}
                                </p>
                              )}
                            </ErrorMessage>
                          </motion.div>
                        )}
                      </motion.div>

                      <button
                        disabled={isSubmitting}
                        type="submit"
                        className="w-full py-3.5 mt-4 rounded-xl font-bold text-white bg-[#6A0DAD] hover:bg-[#580b94] dark:bg-purple-600 dark:hover:bg-purple-700 transition-all shadow-md active:scale-95 disabled:opacity-70 flex justify-center items-center gap-2 text-sm"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          isLogin ? "Sign In" : "Create Account"
                        )}
                      </button>
                    </Form>
                  )}
                </Formik>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 text-center text-xs text-gray-500 dark:text-zinc-400 font-medium border-t border-gray-100 dark:border-zinc-800 pt-5 transition-colors duration-300">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button onClick={toggleAuthMode} className="text-[#6A0DAD] dark:text-purple-400 font-bold hover:underline transition-all">
                {isLogin ? "Sign up for free" : "Log in here"}
              </button>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: Infinite Scrolling Masonry Grid */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#F9F5FF] dark:bg-zinc-950 relative overflow-hidden items-center justify-center pointer-events-none border-l border-gray-100 dark:border-zinc-800 transition-colors duration-300">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#F9F5FF] dark:from-zinc-950 to-transparent z-10 transition-colors duration-300" />
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#F9F5FF] dark:from-zinc-950 to-transparent z-10 transition-colors duration-300" />
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