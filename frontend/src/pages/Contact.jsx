import React from "react";
import { motion } from "framer-motion";

export default function Contact() {
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="w-full bg-white dark:bg-black min-h-screen font-['Inter',sans-serif] text-gray-900 dark:text-zinc-100 transition-colors duration-300">
      <section className="relative max-w-6xl mx-auto px-6 lg:px-12 pt-20 pb-24">
        
        {/* HERO */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 text-xs text-[#6A0DAD] dark:text-purple-400 font-bold mb-8 uppercase tracking-widest transition-colors duration-300">
            <span className="material-symbols-outlined text-[14px]">support_agent</span>
            Contact CareerCoach
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-black dark:text-white leading-tight transition-colors duration-300">
            Need Help? <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6A0DAD] to-[#8B31FF]">
              Reach Out.
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed font-medium transition-colors duration-300">
            CareerCoach is built to help candidates prepare for real-world interviews. Whether you have a question, a bug report, or a feature request, we are here to help.
          </p>
        </motion.div>

        {/* CONTACT CARDS */}
        <motion.div 
          initial="hidden" animate="visible" variants={staggerContainer}
          className="grid md:grid-cols-3 gap-6 mb-24"
        >
          {/* Email */}
          <motion.div variants={fadeUp} className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-orange-50 dark:bg-orange-500/10 text-orange-500 flex items-center justify-center mb-6 transition-colors duration-300">
               <span className="material-symbols-outlined text-2xl">mail</span>
            </div>
            <h3 className="text-xl font-bold text-black dark:text-white transition-colors duration-300">Email</h3>
            <p className="mt-3 text-gray-500 dark:text-zinc-400 text-sm leading-relaxed font-medium transition-colors duration-300">
              For support, bug reports, or feature requests.
            </p>
            <a href="mailto:support@careercoach.ai" className="mt-6 text-[#6A0DAD] dark:text-purple-400 font-bold text-sm hover:underline transition-colors duration-300">
              support@careercoach.ai
            </a>
          </motion.div>

          {/* Location */}
          <motion.div variants={fadeUp} className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-500 flex items-center justify-center mb-6 transition-colors duration-300">
               <span className="material-symbols-outlined text-2xl">location_on</span>
            </div>
            <h3 className="text-xl font-bold text-black dark:text-white transition-colors duration-300">Location</h3>
            <p className="mt-3 text-gray-500 dark:text-zinc-400 text-sm leading-relaxed font-medium transition-colors duration-300">
              CareerCoach is currently developed and operated from India.
            </p>
            <p className="mt-6 text-black dark:text-white font-bold text-sm transition-colors duration-300">
              Surat, Gujarat
            </p>
          </motion.div>

          {/* Support Hours */}
          <motion.div variants={fadeUp} className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-300 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-500 flex items-center justify-center mb-6 transition-colors duration-300">
               <span className="material-symbols-outlined text-2xl">schedule</span>
            </div>
            <h3 className="text-xl font-bold text-black dark:text-white transition-colors duration-300">Support Hours</h3>
            <p className="mt-3 text-gray-500 dark:text-zinc-400 text-sm leading-relaxed font-medium transition-colors duration-300">
              We aim to respond to all inquiries as quickly as possible.
            </p>
            <p className="mt-6 text-black dark:text-white font-bold text-sm transition-colors duration-300">
              10:00 AM – 8:00 PM (IST)
            </p>
          </motion.div>
        </motion.div>

        {/* FAQ SECTION */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}
          className="rounded-[2rem] bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 shadow-sm p-10 md:p-14 transition-colors duration-300"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-black dark:text-white transition-colors duration-300">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-gray-600 dark:text-zinc-400 font-medium transition-colors duration-300">
              Everything you need to know about the product and how it works.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                q: "Is CareerCoach free to use?",
                a: "Yes, you can create an account and start evaluating your resume and taking mock interviews for free.",
              },
              {
                q: "How is the ATS score calculated?",
                a: "The score is calculated by cross-referencing your uploaded resume PDF against the specific job description you provide, identifying missing keywords and formatting issues.",
              },
              {
                q: "Does the AI ask job-specific questions?",
                a: "Yes! The AI generates dynamic, relevant questions based directly on the experience and skills listed in your uploaded resume.",
              },
              {
                q: "Do I need to upload my resume every time?",
                a: "Currently, yes, to ensure each interview session is perfectly tailored to your latest resume version and target job.",
              },
            ].map((item, index) => (
              <div key={index} className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm hover:border-[#6A0DAD]/30 dark:hover:border-purple-500/50 transition-colors duration-300">
                <p className="text-black dark:text-white font-bold text-base flex items-start gap-3 transition-colors duration-300">
                  <span className="text-[#6A0DAD] dark:text-purple-400 mt-0.5 transition-colors duration-300">
                    <span className="material-symbols-outlined text-[18px]">help</span>
                  </span>
                  {item.q}
                </p>
                <p className="mt-3 text-gray-600 dark:text-zinc-400 text-sm leading-relaxed font-medium pl-8 transition-colors duration-300">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
        
      </section>
    </div>
  );
}