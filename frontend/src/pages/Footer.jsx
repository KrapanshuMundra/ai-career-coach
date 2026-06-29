import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-black mt-auto transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 flex flex-col md:flex-row gap-6 justify-between items-center">
        
        {/* Brand & Copyright */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="text-[#6A0DAD] dark:text-purple-400 group-hover:scale-105 transition-all duration-300">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                {/* Changed fill to the specific purple hex code */}
                <rect width="32" height="32" rx="9" fill="#6A0DAD"/>
                <text
                  x="16" y="18"
                  fontFamily="Inter,sans-serif"
                  fontWeight="900"
                  fontSize="16"
                  fill="white"
                  letterSpacing="-1"
                  dominantBaseline="middle"
                  textAnchor="middle"
                >CC</text>
              </svg>
            </div>
            <span className="text-black dark:text-white font-extrabold text-lg tracking-tight transition-colors duration-300">
              careercoach
            </span>
          </Link>
          <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium transition-colors duration-300">
            © {new Date().getFullYear()} CareerCoach. All rights reserved.
          </p>
        </div>

        {/* Contact & Location Info */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 dark:text-zinc-400 font-medium transition-colors duration-300">
          <a href="mailto:support@careercoach.ai" className="flex items-center gap-2 hover:text-[#6A0DAD] dark:hover:text-purple-400 transition-colors duration-300">
            <span className="w-2 h-2 rounded-full bg-[#6A0DAD] dark:bg-purple-500 shadow-sm transition-colors duration-300" />
            support@careercoach.ai
          </a>

          <span className="hidden md:block text-gray-200 dark:text-zinc-800 transition-colors duration-300">|</span>

          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 dark:bg-green-400 shadow-sm animate-pulse transition-colors duration-300" />
            Surat, Gujarat
          </span>
        </div>

      </div>
    </footer>
  );
}