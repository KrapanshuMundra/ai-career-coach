import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../utils/api";

// ─────────────────────────────────────────────────────────────────────────────
// DIMENSION SCORE BAR — used in the report breakdown
// ─────────────────────────────────────────────────────────────────────────────
const DimensionBar = ({ label, score, delay = 0 }) => {
  let barColor = "bg-red-400";
  let textColor = "text-red-600";
  if (score >= 17)      { barColor = "bg-green-500";  textColor = "text-green-700"; }
  else if (score >= 14) { barColor = "bg-amber-400";  textColor = "text-amber-700"; }
  else if (score >= 10) { barColor = "bg-orange-400"; textColor = "text-orange-700"; }


  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[13px] font-semibold text-gray-700 dark:text-zinc-300">{label}</span>
        <span className={`text-[13px] font-black ${textColor} dark:${textColor}`}>{score}<span className="text-gray-400 dark:text-zinc-500 font-bold text-[11px]">/20</span></span>
      </div>
      <div className="h-2 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${barColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${(score / 20) * 100}%` }}
          transition={{ duration: 0.9, ease: "easeOut", delay }}
        />
      </div>
    </div>
  );
};


// ─────────────────────────────────────────────────────────────────────────────
// OVERALL SCORE RING — report header
// ─────────────────────────────────────────────────────────────────────────────
const ReportScoreRing = ({ score }) => {
  const s = Math.min(Math.max(score, 0), 100);
  let stroke = "#DC2626"; let text = "text-red-600"; let label = "Needs Practice";
  if (s >= 85) { stroke = "#16A34A"; text = "text-green-600"; label = "Outstanding"; }
  else if (s >= 71) { stroke = "#D97706"; text = "text-amber-600"; label = "Strong"; }
  else if (s >= 56) { stroke = "#EA580C"; text = "text-orange-600"; label = "Average"; }


  const circ = 2 * Math.PI * 38;


  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="38" stroke="#F3F4F6" className="dark:stroke-zinc-800" strokeWidth="8" fill="none" />
          <motion.circle
            cx="50" cy="50" r="38"
            stroke={stroke} strokeWidth="8" fill="none" strokeLinecap="round"
            initial={{ strokeDasharray: circ, strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - (circ * s) / 100 }}
            transition={{ duration: 1.4, ease: "easeOut", delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: "spring" }}
            className={`text-[36px] font-black leading-none tracking-tighter ${text}`}
          >
            {s}
          </motion.span>
          <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-widest">/ 100</span>
        </div>
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className={`mt-2 text-[12px] font-bold uppercase tracking-widest ${text}`}
      >
        {label}
      </motion.span>
    </div>
  );
};


// ─────────────────────────────────────────────────────────────────────────────
// HIRING BADGE — colour based on recommendation text
// ─────────────────────────────────────────────────────────────────────────────
const HiringBadge = ({ text }) => {
  const lower = (text || "").toLowerCase();
  let cfg = { bg: "bg-gray-50 border-gray-200 dark:bg-zinc-900 dark:border-zinc-800", dot: "bg-gray-400", label: "text-gray-700 dark:text-zinc-300" };
  if (lower.startsWith("strong hire") || lower.startsWith("hire"))
    cfg = { bg: "bg-green-50 border-green-200 dark:bg-green-500/10 dark:border-green-500/20",  dot: "bg-green-500",  label: "text-green-800 dark:text-green-400" };
  else if (lower.startsWith("consider"))
    cfg = { bg: "bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20",  dot: "bg-amber-400",  label: "text-amber-800 dark:text-amber-400" };
  else if (lower.startsWith("no hire") || lower.startsWith("reject"))
    cfg = { bg: "bg-red-50 border-red-200 dark:bg-red-500/10 dark:border-red-500/20",      dot: "bg-red-500",    label: "text-red-800 dark:text-red-400" };


  return (
    <div className={`flex items-start gap-3 p-4 rounded-2xl border ${cfg.bg} transition-colors duration-300`}>
      <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot} mt-1 shrink-0`} />
      <p className={`text-sm font-semibold leading-relaxed ${cfg.label}`}>{text}</p>
    </div>
  );
};


// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function MockInterview({ isResumeReady }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();


  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem("careercoach_interview_chat");
      if (saved && saved !== "undefined" && saved !== "null") return JSON.parse(saved);
    } catch { /* silent */ }
    return [{ role: "ai", content: "Welcome to CareerCoach Interview Mode. I will simulate a real interview and give feedback. Are you ready to begin?" }];
  });


  const [input, setInput]                   = useState("");
  const [isLoading, setIsLoading]           = useState(false);
  const scrollRef                           = useRef(null);
  const textareaRef                         = useRef(null);


  const [isInterviewFinished, setIsInterviewFinished] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport]   = useState(false);
  const [report, setReport]                           = useState(null);


  const [showRestartModal, setShowRestartModal] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);


  // Persist chat
  useEffect(() => {
    sessionStorage.setItem("careercoach_interview_chat", JSON.stringify(messages));
  }, [messages]);


  // Auto-grow textarea
  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "52px";
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
  }, [input]);


  // Reset when resume unlocked
  useEffect(() => {
    if (!isResumeReady) {
      setMessages([{ role: "ai", content: "Welcome to CareerCoach Interview Mode. I will simulate a real interview and give feedback. Are you ready to begin?" }]);
      sessionStorage.removeItem("careercoach_interview_chat");
      setInput("");
    }
  }, [isResumeReady]);


  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);


  // ── Send message ──
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    try {
       const response = await api.post("/api/interview/chat", {
      history: messages,
      message: input,
      userId: currentUser.uid,
    });
      setMessages([...newMessages, { role: "ai", content: response.data.data }]);
    } catch {
      setMessages([...newMessages, { role: "ai", content: "Connection lost. Please try again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };


  // ── Restart ──
  const confirmRestart = () => {
    sessionStorage.removeItem("careercoach_interview_chat");
    setMessages([{ role: "ai", content: "Welcome to CareerCoach Interview Mode. I will simulate a real interview and give feedback. Are you ready to begin?" }]);
    setInput("");
    setShowRestartModal(false);
  };


  // ── End interview → generate report ──
  const handleEndInterview = async () => {
    if (isInterviewFinished || isGeneratingReport) return;
    if (messages.filter((m) => m.role === "user").length < 2) {
      setShowWarningModal(true);
      return;
    }
    setIsGeneratingReport(true);
    try {
      const savedAtsScore = sessionStorage.getItem("careercoach_ats_score") || "N/A";
      const response = await api.post("/api/interview/report", {
      history: messages,
      userEmail: currentUser.email,
      atsScore: savedAtsScore,
    });
      setReport(response.data);
      setIsInterviewFinished(true);
    } catch {
      alert("Failed to generate report. Please try again.");
    } finally {
      setIsGeneratingReport(false);
    }
  };


  // ── Practice again ──
  const handlePracticeAgain = () => {
    sessionStorage.removeItem("careercoach_interview_chat");
    setMessages([{ role: "ai", content: "Welcome to CareerCoach Interview Mode. I will simulate a real interview and give feedback. Are you ready to begin?" }]);
    setIsInterviewFinished(false);
    setReport(null);
  };


  const pageMotion = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
  };


  // ═══════════════════════════════════════════════════════════════════════════
  // 1. LOCKED STATE
  // ═══════════════════════════════════════════════════════════════════════════
  if (!isResumeReady) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#FAFAFA] dark:bg-black font-['Inter',sans-serif] flex items-center justify-center p-6 transition-colors duration-300">
        <motion.div {...pageMotion}
          className="max-w-lg w-full bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-[0_8px_40px_rgba(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-zinc-800 p-10 md:p-12 text-center relative overflow-hidden transition-colors duration-300"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-purple-50 dark:bg-purple-500/10 blur-3xl rounded-full opacity-50 pointer-events-none" />
          <div className="relative z-10">
            <div className="w-20 h-20 mx-auto bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-red-100 dark:border-red-500/20">
              <span className="material-symbols-outlined text-4xl">lock</span>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-widest rounded-md mb-4">
              Session Locked
            </span>
            <h2 className="text-2xl font-black text-black dark:text-white tracking-tight mb-3">Resume Evaluation Required</h2>
            <p className="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed font-medium mb-8">
              Before starting the AI mock interview, evaluate your resume against a job description. This gives the AI the context it needs to ask you highly targeted questions.
            </p>
            <Link
              to="/evaluator"
              className="w-full inline-flex justify-center items-center gap-2 py-4 rounded-xl font-bold text-white bg-[#6A0DAD] hover:bg-[#580b94] dark:bg-purple-600 dark:hover:bg-purple-700 transition-all shadow-md active:scale-95"
            >
              Go to Evaluator <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }


  // ═══════════════════════════════════════════════════════════════════════════
  // 2. GENERATING REPORT
  // ═══════════════════════════════════════════════════════════════════════════
  if (isGeneratingReport) {
    return (
      <motion.div {...pageMotion}
        className="min-h-[calc(100vh-80px)] bg-[#FAFAFA] dark:bg-black flex flex-col items-center justify-center p-6 font-['Inter',sans-serif] transition-colors duration-300"
      >
        <div className="w-16 h-16 border-4 border-purple-100 dark:border-zinc-800 border-t-[#6A0DAD] dark:border-t-purple-500 rounded-full animate-spin mb-6" />
        <h2 className="text-2xl font-black text-black dark:text-white">Analyzing Your Interview…</h2>
        <p className="text-gray-500 dark:text-zinc-400 mt-2 font-medium text-sm text-center max-w-sm">
          The AI is scoring your performance across five dimensions and writing your feedback report.
        </p>
      </motion.div>
    );
  }


  // ═══════════════════════════════════════════════════════════════════════════
  // 3. FINAL REPORT DASHBOARD
  // ═══════════════════════════════════════════════════════════════════════════
  if (isInterviewFinished && report) {
    const bd = report.breakdown || {};


    const dimensions = [
      { label: "Technical Accuracy",    score: bd.technicalAccuracy    ?? 0, delay: 0.1 },
      { label: "Communication Clarity", score: bd.communicationClarity ?? 0, delay: 0.2 },
      { label: "Specificity",           score: bd.specificity          ?? 0, delay: 0.3 },
      { label: "Problem-Solving",       score: bd.problemSolving        ?? 0, delay: 0.4 },
      { label: "Role Alignment",        score: bd.roleAlignment        ?? 0, delay: 0.5 },
    ];


    return (
      <motion.div {...pageMotion}
        className="min-h-[calc(100vh-80px)] bg-[#FAFAFA] dark:bg-black font-['Inter',sans-serif] py-12 px-4 sm:px-6 transition-colors duration-300"
      >
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-5">


          {/* ── Report header ── */}
          <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden transition-colors duration-300">
            <div className="px-8 py-6 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors duration-300">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 text-[10px] text-[#6A0DAD] dark:text-purple-400 font-black uppercase tracking-widest mb-3 transition-colors duration-300">
                  <span className="material-symbols-outlined text-[13px]">analytics</span>
                  Performance Report
                </div>
                <h1 className="text-2xl font-black text-black dark:text-white tracking-tight">Interview Feedback</h1>
                <p className="text-gray-500 dark:text-zinc-400 text-sm font-medium mt-1">
                  Scored across 5 professional dimensions
                </p>
              </div>
              <ReportScoreRing score={report.overallScore ?? 0} />
            </div>


            {/* ── Score breakdown bars ── */}
            <div className="px-8 py-6 border-b border-gray-100 dark:border-zinc-800">
              <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-5">Score Breakdown</p>
              <div className="grid sm:grid-cols-2 gap-x-10 gap-y-5">
                {dimensions.map((d) => (
                  <DimensionBar key={d.label} label={d.label} score={d.score} delay={d.delay} />
                ))}
              </div>
            </div>


            {/* ── Hiring recommendation ── */}
            {report.hiringRecommendation && (
              <div className="px-8 py-6 border-b border-gray-100 dark:border-zinc-800">
                <p className="text-xs font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-3">Hiring Recommendation</p>
                <HiringBadge text={report.hiringRecommendation} />
              </div>
            )}
          </div>


          {/* ── Strengths + Improvements ── */}
          <div className="grid md:grid-cols-2 gap-5">


            {/* Strengths */}
            <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-gray-100 dark:border-zinc-800 shadow-sm p-7 transition-colors duration-300">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400">
                  <span className="material-symbols-outlined text-[18px]">thumb_up</span>
                </div>
                <h3 className="font-extrabold text-black dark:text-white text-base">Top Strengths</h3>
              </div>
              <ul className="space-y-3">
                {(report.strengths || []).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-sm text-gray-700 dark:text-zinc-300 font-medium leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>
            </div>


            {/* Improvements */}
            <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-gray-100 dark:border-zinc-800 shadow-sm p-7 transition-colors duration-300">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-500 dark:text-orange-400">
                  <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                </div>
                <h3 className="font-extrabold text-black dark:text-white text-base">Areas to Improve</h3>
              </div>
              <ul className="space-y-3">
                {(report.improvements || []).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-sm text-gray-700 dark:text-zinc-300 font-medium leading-relaxed">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>


          {/* ── Footer actions ── */}
          <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-gray-100 dark:border-zinc-800 shadow-sm px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors duration-300">


            {/* Email indicator */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-3 bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20 px-4 py-2.5 rounded-xl"
            >
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">mark_email_read</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-zinc-400 font-medium leading-tight">
                Report sent to<br />
                <strong className="text-gray-900 dark:text-white">{currentUser?.email}</strong>
              </p>
            </motion.div>


            {/* CTA buttons */}
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={handlePracticeAgain}
                className="flex-1 sm:flex-none px-6 py-3 rounded-xl font-bold text-gray-700 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all text-sm active:scale-95"
              >
                Practice Again
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-[#6A0DAD] hover:bg-[#580b94] dark:bg-purple-600 dark:hover:bg-purple-700 transition-all shadow-md active:scale-95 text-sm"
              >
                Dashboard <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>


        </div>
      </motion.div>
    );
  }


  // ═══════════════════════════════════════════════════════════════════════════
  // 4. ACTIVE INTERVIEW
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#FAFAFA] dark:bg-black font-['Inter',sans-serif] py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center transition-colors duration-300">


      {/* Page header */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 px-1">
        <div>
          <h1 className="text-3xl font-black text-black dark:text-white tracking-tight">Mock Interview</h1>
          <p className="mt-1 text-gray-500 dark:text-zinc-400 text-sm font-medium">
            Answer naturally — the AI will push back, probe, and score you at the end.
          </p>
        </div>


        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowRestartModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-zinc-700 text-xs font-bold uppercase tracking-widest transition-all shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-[14px]">refresh</span>
            Restart
          </button>


          <button
            onClick={handleEndInterview}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500 border border-red-600 text-white hover:bg-red-600 text-xs font-bold uppercase tracking-widest transition-all shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-[14px]">stop_circle</span>
            End & Get Report
          </button>


          <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20 text-green-700 dark:text-green-400 text-xs font-bold uppercase tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            Live Session
          </span>
        </div>
      </div>


      {/* Chat window */}
      <div className="w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-[2rem] shadow-sm dark:shadow-none border border-gray-200 dark:border-zinc-800 flex flex-col h-[70vh] min-h-[600px] overflow-hidden transition-colors duration-300">


        {/* Chat header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/80 dark:bg-zinc-950/60 flex items-center justify-between transition-colors duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 flex items-center justify-center text-[#6A0DAD] dark:text-purple-400">
              <span className="material-symbols-outlined text-[20px]">smart_toy</span>
            </div>
            <div>
              <p className="text-black dark:text-white font-extrabold text-sm tracking-tight">AI Hiring Manager</p>
              <p className="text-gray-400 dark:text-zinc-500 text-xs font-medium">Technical & Behavioural Round</p>
            </div>
          </div>


          {/* Message count pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">
            <span className="material-symbols-outlined text-[13px] text-gray-500 dark:text-zinc-400">forum</span>
            <span className="text-[11px] font-bold text-gray-500 dark:text-zinc-400">
              {messages.filter((m) => m.role === "user").length} responses
            </span>
          </div>
        </div>


        {/* Message feed */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-6 py-8 space-y-5 bg-[#FAFAFA] dark:bg-zinc-950 custom-scrollbar transition-colors duration-300"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className="flex items-end gap-2.5 max-w-[85%] sm:max-w-[75%]">
                  {msg.role === "ai" && (
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center text-[#6A0DAD] dark:text-purple-400 shrink-0 mb-1">
                      <span className="material-symbols-outlined text-[15px]">smart_toy</span>
                    </div>
                  )}
                  <div
                    className={`px-5 py-3.5 text-sm leading-relaxed whitespace-pre-wrap font-medium shadow-sm ${
                      msg.role === "user"
                        ? "bg-[#6A0DAD] text-white rounded-[1.5rem] rounded-br-sm"
                        : "bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-800 dark:text-zinc-200 rounded-[1.5rem] rounded-bl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-500 dark:text-zinc-400 shrink-0 mb-1 text-[11px] font-bold uppercase">
                      {currentUser?.displayName?.[0] || currentUser?.email?.[0] || "U"}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}


            {/* Typing indicator */}
            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="flex items-end gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center text-[#6A0DAD] dark:text-purple-400 shrink-0 mb-1">
                    <span className="material-symbols-outlined text-[15px]">smart_toy</span>
                  </div>
                  <div className="px-5 py-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-[1.5rem] rounded-bl-sm shadow-sm flex gap-1.5 items-center h-[46px]">
                    {[0, 0.2, 0.4].map((delay, i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay }}
                        className="w-1.5 h-1.5 bg-gray-300 dark:bg-zinc-500 rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>


        {/* Input bar */}
        <div className="p-4 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 transition-colors duration-300">
          <form onSubmit={handleSend} className="flex gap-3 items-end">
            <div className="flex-1">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight + 2}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (input.trim()) {
                      handleSend(e);
                      if (textareaRef.current) textareaRef.current.style.height = "auto";
                    }
                  }
                }}
                placeholder="Type your answer… (Shift+Enter for new line)"
                className="block w-full px-5 py-3.5 rounded-2xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-[#6A0DAD]/30 focus:border-[#6A0DAD] outline-none transition-colors resize-none min-h-[52px] max-h-[150px] overflow-y-auto text-sm font-medium leading-relaxed [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                disabled={isLoading}
                rows={1}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className={`h-[52px] w-[52px] rounded-2xl flex items-center justify-center transition-all shrink-0 ${
                isLoading || !input.trim()
                  ? "bg-gray-100 dark:bg-zinc-800 text-gray-300 dark:text-zinc-600 cursor-not-allowed"
                  : "bg-[#6A0DAD] text-white hover:bg-[#580b94] shadow-md active:scale-95"
              }`}
            >
              <span className="material-symbols-outlined">send</span>
            </button>
          </form>
        </div>
      </div>


      {/* ── Restart modal ── */}
      <AnimatePresence>
        {showRestartModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 10, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl dark:shadow-none p-8 max-w-sm w-full text-center border border-gray-100 dark:border-zinc-800 transition-colors duration-300"
            >
              <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-5 border border-red-100 dark:border-red-500/20">
                <span className="material-symbols-outlined text-3xl">refresh</span>
              </div>
              <h3 className="text-xl font-black text-black dark:text-white mb-2">Restart Interview?</h3>
              <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium mb-8 leading-relaxed">
                This will permanently clear your current conversation. This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRestartModal(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-gray-600 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all text-sm active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRestart}
                  className="flex-1 py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-all shadow-md active:scale-95 text-sm"
                >
                  Yes, restart
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* ── Warning modal ── */}
      <AnimatePresence>
        {showWarningModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 10, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl dark:shadow-none p-8 max-w-sm w-full text-center border border-gray-100 dark:border-zinc-800 transition-colors duration-300"
            >
              <div className="w-16 h-16 bg-amber-50 dark:bg-amber-500/10 text-amber-500 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto mb-5 border border-amber-100 dark:border-amber-500/20">
                <span className="material-symbols-outlined text-3xl">info</span>
              </div>
              <h3 className="text-xl font-black text-black dark:text-white mb-2">Interview Just Started</h3>
              <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium mb-8 leading-relaxed">
                Answer at least two questions before generating your performance report. The more you answer, the more accurate your feedback will be.
              </p>
              <button
                onClick={() => setShowWarningModal(false)}
                className="w-full py-3 rounded-xl font-bold text-white bg-[#6A0DAD] hover:bg-[#580b94] transition-all shadow-md active:scale-95 text-sm"
              >
                Continue Interview
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D1D5DB; }
      ` }} />
    </div>
  );
}