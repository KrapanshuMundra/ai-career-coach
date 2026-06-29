import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 flex flex-col md:flex-row gap-6 justify-between items-center">
        
        {/* Brand & Copyright */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="text-[#6A0DAD] group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
              </svg>
            </div>
            <span className="text-black font-extrabold text-lg tracking-tight">
              careercoach
            </span>
          </Link>
          <p className="text-sm text-gray-500 font-medium">
            © {new Date().getFullYear()} CareerCoach. All rights reserved.
          </p>
        </div>

        {/* Contact & Location Info */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 font-medium">
          <a href="mailto:support@careercoach.ai" className="flex items-center gap-2 hover:text-[#6A0DAD] transition-colors">
            <span className="w-2 h-2 rounded-full bg-[#6A0DAD] shadow-sm" />
            support@careercoach.ai
          </a>

          <span className="hidden md:block text-gray-200">|</span>

          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 shadow-sm animate-pulse" />
            Surat, Gujarat
          </span>
        </div>

      </div>
    </footer>
  );
}