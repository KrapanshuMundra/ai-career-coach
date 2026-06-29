import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  }

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" }
  ];

  if (currentUser) {
    navLinks.push({ name: "Dashboard", path: "/dashboard" });
    navLinks.push({ name: "Evaluator", path: "/evaluator" });
    navLinks.push({ name: "Interview", path: "/interview" });
  }

  const isActive = (path) => location.pathname === path;

  // Extract a clean display name from a raw email
  const getDisplayName = (email) => {
    if (!email) return "User";
    
    // 1. Grab everything before the '@' symbol
    const namePart = email.split('@')[0]; 
    
    // 2. (Optional) Remove numbers so 'mundragopal412' becomes 'mundragopal'
    const cleanName = namePart.replace(/[0-9]/g, ''); 
    
    // 3. Capitalize the first letter
    return cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-20">
          
          {/* BRAND LOGO */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="text-[#6A0DAD] group-hover:scale-105 transition-transform">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
              </svg>
            </div>
            <span className="text-black font-extrabold text-xl tracking-tight">
              CareerCoach
            </span>
          </Link>

          {/* DESKTOP NAV LINKS */}
          <div className="hidden lg:flex items-center gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-bold transition-all ${
                  isActive(link.path)
                    ? "text-[#6A0DAD]"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* DESKTOP AUTH BUTTONS */}
          <div className="hidden lg:flex items-center gap-4">
            {currentUser ? (
              <>
                {/* 🌟 UPGRADED: User Profile Pill */}
                <div className="flex items-center gap-3 bg-gray-50 py-1.5 px-2 pr-4 rounded-full border border-gray-100 cursor-default">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-[#6A0DAD] flex items-center justify-center font-black text-sm uppercase shadow-sm">
                    {currentUser.email.charAt(0)}
                  </div>
                  <span className="text-xs font-bold text-gray-700 max-w-[120px] truncate">
                    {getDisplayName(currentUser?.email)}
                  </span>
                </div>

                {/* 🌟 UPGRADED: Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-100 active:scale-95"
                  title="Logout"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-bold text-[#6A0DAD] hover:text-[#580b94] transition-all px-4"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2.5 rounded-full font-bold text-sm text-white bg-[#6A0DAD] hover:bg-[#580b94] transition-all shadow-md active:scale-95"
                >
                  Try for Free
                </Link>
              </>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-black transition-all"
            >
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="lg:hidden px-6 pb-6 pt-3 bg-white border-t border-gray-100 absolute w-full shadow-lg">
          <div className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-5 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive(link.path)
                    ? "bg-purple-50 text-[#6A0DAD]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-black"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

         <div className="mt-5 border-t border-gray-100 pt-5">
  {currentUser ? (
    <div className="space-y-4">
      {/* Mobile User Info */}
      <div className="flex items-center gap-3 px-2">
        <div className="w-10 h-10 rounded-full bg-[#6A0DAD]/10 text-[#6A0DAD] flex items-center justify-center font-black text-lg uppercase shrink-0">
          {currentUser?.email?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Signed in as</span>
          <span className="text-sm font-black text-gray-800 truncate max-w-[200px]">
            {getDisplayName(currentUser?.email)}
          </span>
        </div>
      </div>
                
                <button
                  onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-center px-5 py-3 rounded-xl font-bold text-sm text-[#6A0DAD] bg-purple-50 hover:bg-purple-100"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-center px-5 py-3 rounded-xl font-bold text-sm text-white bg-[#6A0DAD] hover:bg-[#580b94]"
                >
                  Try for Free
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}