import React from "react";
import { motion } from "framer-motion";

export default function Loader({ isGlobal = false }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      variants={isGlobal ? containerVariants : {}}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`${
        isGlobal
          ? "fixed inset-0 bg-[#FAFAFA] dark:bg-black z-[9999]"
          : "w-full h-full min-h-[300px] bg-white dark:bg-zinc-900 rounded-[2rem]"
      } flex flex-col items-center justify-center text-center p-12 font-['Inter',sans-serif] transition-colors duration-300`}
    >
      {/* Premium Purple Spinner matching style */}
      <div className="relative w-16 h-16 mb-8 flex items-center justify-center">
        {/* Outer Ring with subtle glow */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-4 border-[#F5EEFF] dark:border-zinc-800 border-t-[#6A0DAD] dark:border-t-purple-500 shadow-[0_0_15px_rgba(106,13,173,0.15)]"
        />

        {/* Inner static icon */}
        <div className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center shadow-inner dark:shadow-none">
          <svg className="w-5 h-5 text-[#6A0DAD] dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>

      <h2 className="text-xl font-black text-black dark:text-white tracking-tight">Initializing Session</h2>
      <p className="text-gray-500 dark:text-zinc-400 font-medium mt-2 max-w-[320px]">
        Preparing your optimized workspace and setting up the context engine...
      </p>
    </motion.div>
  );
}