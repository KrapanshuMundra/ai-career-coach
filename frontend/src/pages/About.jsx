import React from "react";
import { motion } from "framer-motion";

export default function About() {
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  return (
    <div className="w-full bg-white dark:bg-black min-h-screen font-['Inter',sans-serif] text-gray-900 dark:text-zinc-100 transition-colors duration-300">
      <section className="relative max-w-6xl mx-auto px-6 lg:px-12 pt-20 pb-24">
        
        {/* HERO */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 text-xs text-[#6A0DAD] dark:text-purple-400 font-bold mb-8 uppercase tracking-widest transition-colors duration-300">
            <span className="material-symbols-outlined text-[14px]">info</span>
            About CareerCoach
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-black dark:text-white leading-tight transition-colors duration-300">
            Built for candidates who want <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6A0DAD] to-[#8B31FF]">
              real results.
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed font-medium transition-colors duration-300">
            CareerCoach is an AI-powered interview preparation platform designed to help candidates optimize their resumes, beat applicant tracking systems, and build confidence with real-time AI mock interviews.
          </p>
        </motion.div>

        {/* INFO CARDS (Pastel Theme) */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} 
          className="mt-20 grid md:grid-cols-3 gap-6"
        >
          {/* Card 1 */}
          <motion.div variants={fadeUp} className="p-8 rounded-2xl bg-[#FFF6EF] dark:bg-orange-500/5 border border-orange-50 dark:border-orange-500/10 hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center mb-6 shadow-sm transition-colors duration-300">
              <span className="material-symbols-outlined text-orange-500">analytics</span>
            </div>
            <h3 className="font-bold text-lg text-black dark:text-white mb-2 transition-colors duration-300">Resume Intelligence</h3>
            <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed font-medium transition-colors duration-300">
              Get an instant ATS score out of 100 with missing keyword detection and structured formatting tips to beat the bots.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={fadeUp} className="p-8 rounded-2xl bg-[#F0F7FF] dark:bg-blue-500/5 border border-blue-50 dark:border-blue-500/10 hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center mb-6 shadow-sm transition-colors duration-300">
              <span className="material-symbols-outlined text-blue-500">model_training</span>
            </div>
            <h3 className="font-bold text-lg text-black dark:text-white mb-2 transition-colors duration-300">Interview Simulation</h3>
            <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed font-medium transition-colors duration-300">
              Practice mock interviews with dynamic AI questions based entirely on the unique experience in your uploaded resume.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div variants={fadeUp} className="p-8 rounded-2xl bg-[#F5EEFF] dark:bg-purple-500/5 border border-purple-50 dark:border-purple-500/10 hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center mb-6 shadow-sm transition-colors duration-300">
              <span className="material-symbols-outlined text-[#6A0DAD] dark:text-purple-400">fact_check</span>
            </div>
            <h3 className="font-bold text-lg text-black dark:text-white mb-2 transition-colors duration-300">Actionable Feedback</h3>
            <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed font-medium transition-colors duration-300">
              Don't just practice—improve. Get instant feedback on clarity, answer structure, and technical depth after every session.
            </p>
          </motion.div>
        </motion.div>

        {/* PRIVACY & TRUST */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}
          className="mt-20 p-10 md:p-12 rounded-[2rem] bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 shadow-sm relative overflow-hidden transition-colors duration-300"
        >
          {/* Decorative Icon */}
          <div className="absolute top-[-20px] right-[-20px] text-gray-100 dark:text-zinc-800/50 transform rotate-12 pointer-events-none transition-colors duration-300">
             <span className="material-symbols-outlined text-[150px]">verified_user</span>
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl font-extrabold text-black dark:text-white transition-colors duration-300">
              Privacy & Security First
            </h2>
            <p className="mt-4 text-gray-600 dark:text-zinc-400 leading-relaxed max-w-3xl font-medium transition-colors duration-300">
              CareerCoach is designed with security-first principles. Your resume data and job descriptions are used solely for evaluation and interview context generation. We do not sell user data or store sensitive personal information unnecessarily.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {[
                "Secure Authentication",
                "Resume PDF Parsing",
                "Job-Specific Scoring",
                "Real-Time AI Feedback",
                "Cloud Ready"
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-5 py-2.5 rounded-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 text-xs font-bold shadow-sm flex items-center gap-2 transition-colors duration-300"
                >
                  <span className="material-symbols-outlined text-[14px] text-green-500">check_circle</span>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
        
      </section>
    </div>
  );
}