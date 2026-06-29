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
    <div className="w-full bg-white min-h-screen font-['Inter',sans-serif] text-gray-900">
      <section className="relative max-w-6xl mx-auto px-6 lg:px-12 pt-20 pb-24">
        
        {/* HERO */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-xs text-[#6A0DAD] font-bold mb-8 uppercase tracking-widest">
            <span className="material-symbols-outlined text-[14px]">info</span>
            About CareerCoach
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-black leading-tight">
            Built for candidates who want <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6A0DAD] to-[#8B31FF]">
              real results.
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium">
            CareerCoach is an AI-powered interview preparation platform designed to help candidates optimize their resumes, beat applicant tracking systems, and build confidence with real-time AI mock interviews.
          </p>
        </motion.div>

        {/* INFO CARDS (Pastel Theme) */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} 
          className="mt-20 grid md:grid-cols-3 gap-6"
        >
          {/* Card 1 */}
          <motion.div variants={fadeUp} className="p-8 rounded-2xl bg-[#FFF6EF] border border-orange-50 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm">
              <span className="material-symbols-outlined text-orange-500">analytics</span>
            </div>
            <h3 className="font-bold text-lg text-black mb-2">Resume Intelligence</h3>
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
              Get an instant ATS score out of 100 with missing keyword detection and structured formatting tips to beat the bots.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={fadeUp} className="p-8 rounded-2xl bg-[#F0F7FF] border border-blue-50 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm">
              <span className="material-symbols-outlined text-blue-500">model_training</span>
            </div>
            <h3 className="font-bold text-lg text-black mb-2">Interview Simulation</h3>
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
              Practice mock interviews with dynamic AI questions based entirely on the unique experience in your uploaded resume.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div variants={fadeUp} className="p-8 rounded-2xl bg-[#F5EEFF] border border-purple-50 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm">
              <span className="material-symbols-outlined text-[#6A0DAD]">fact_check</span>
            </div>
            <h3 className="font-bold text-lg text-black mb-2">Actionable Feedback</h3>
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
              Don't just practice—improve. Get instant feedback on clarity, answer structure, and technical depth after every session.
            </p>
          </motion.div>
        </motion.div>

        {/* PRIVACY & TRUST */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}
          className="mt-20 p-10 md:p-12 rounded-[2rem] bg-gray-50 border border-gray-200 shadow-sm relative overflow-hidden"
        >
          {/* Decorative Icon */}
          <div className="absolute top-[-20px] right-[-20px] text-gray-100 transform rotate-12 pointer-events-none">
             <span className="material-symbols-outlined text-[150px]">verified_user</span>
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl font-extrabold text-black">
              Privacy & Security First
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed max-w-3xl font-medium">
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
                  className="px-5 py-2.5 rounded-full bg-white border border-gray-200 text-gray-700 text-xs font-bold shadow-sm flex items-center gap-2"
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