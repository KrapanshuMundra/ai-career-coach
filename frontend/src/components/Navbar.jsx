import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const { toggleTheme, isDarkMode } = useTheme(); // isDarkMode only needed for the icon toggle
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
    { name: "Contact", path: "/contact" },
  ];

  if (currentUser) {
    navLinks.push({ name: "Dashboard", path: "/dashboard" });
    navLinks.push({ name: "Evaluator", path: "/evaluator" });
    navLinks.push({ name: "Interview", path: "/interview" });
  }

  const isActive = (path) => location.pathname === path;

  const getDisplayName = (email) => {
    if (!email) return "User";
    const namePart = email.split("@")[0];
    const cleanName = namePart.replace(/[0-9]/g, "");
    return cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b transition-colors duration-300 bg-white dark:bg-black border-gray-100 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-20">

          {/* BRAND LOGO */}
          <Link to="/" className="flex items-center gap-2.5 group" style={{ alignItems: "center" }}>
            <div className="group-hover:scale-105 transition-transform shrink-0">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="9" fill="#6A0DAD" />
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
            <span className="font-black text-[17px] tracking-[-0.04em] transition-colors text-black dark:text-white">
              Career<span className="text-[#6A0DAD]">Coach</span>
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
                    : "text-gray-500 dark:text-zinc-400 hover:text-black dark:hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* DESKTOP AUTH + THEME TOGGLE */}
          <div className="hidden lg:flex items-center gap-4">

            {/* DARK MODE TOGGLE — isDarkMode still needed here for the icon */}
            <button
              onClick={toggleTheme}
              title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              className="w-9 h-9 flex items-center justify-center rounded-full transition-all border bg-gray-100 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-500 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-zinc-800"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isDarkMode ? "light_mode" : "dark_mode"}
              </span>
            </button>

            {currentUser ? (
              <>
                {/* User Profile Pill */}
                <div className="flex items-center gap-3 py-1.5 px-2 pr-4 rounded-full border cursor-default transition-colors bg-gray-50 dark:bg-zinc-900 border-gray-100 dark:border-zinc-800">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-[#6A0DAD] flex items-center justify-center font-black text-sm uppercase shadow-sm">
                    {currentUser.email.charAt(0)}
                  </div>
                  <span className="text-xs font-bold max-w-[120px] truncate transition-colors text-gray-700 dark:text-zinc-200">
                    {getDisplayName(currentUser?.email)}
                  </span>
                </div>

                {/* Logout Button */}
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

          {/* MOBILE: THEME TOGGLE + HAMBURGER */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              className="w-9 h-9 flex items-center justify-center rounded-full transition-all border bg-gray-100 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-500 dark:text-yellow-400"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isDarkMode ? "light_mode" : "dark_mode"}
              </span>
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 transition-all text-gray-600 dark:text-zinc-300 hover:text-black dark:hover:text-white"
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
        <div className="lg:hidden px-6 pb-6 pt-3 border-t absolute w-full shadow-lg transition-colors bg-white dark:bg-black border-gray-100 dark:border-zinc-800">
          <div className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-5 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive(link.path)
                    ? "bg-purple-50 text-[#6A0DAD]"
                    : "text-gray-600 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-900 hover:text-black dark:hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="mt-5 border-t pt-5 border-gray-100 dark:border-zinc-800">
            {currentUser ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-10 h-10 rounded-full bg-[#6A0DAD]/10 text-[#6A0DAD] flex items-center justify-center font-black text-lg uppercase shrink-0">
                    {currentUser?.email?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest mb-0.5 text-gray-400 dark:text-zinc-500">
                      Signed in as
                    </span>
                    <span className="text-sm font-black truncate max-w-[200px] text-gray-800 dark:text-zinc-100">
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
                  className="block text-center px-5 py-3 rounded-xl font-bold text-sm text-[#6A0DAD] transition-colors bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-950/60"
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