import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from 'react-router-dom';


// ─────────────────────────────────────────────────────────────────────────────
// SCORE RING
// ─────────────────────────────────────────────────────────────────────────────
const ScoreRing = ({ score }) => {
  const normalizedScore = Math.min(Math.max(score, 0), 100);


  let strokeColor = "#DC2626";
  let bgGradient = "from-red-50 to-red-100/40 dark:from-red-500/10 dark:to-red-500/5";
  let textColor = "text-red-600 dark:text-red-400";
  let label = "Needs Work";
  let labelColor = "text-red-500 dark:text-red-400";


  if (normalizedScore >= 85) {
    strokeColor = "#16A34A";
    bgGradient = "from-green-50 to-green-100/40 dark:from-green-500/10 dark:to-green-500/5";
    textColor = "text-green-600 dark:text-green-400";
    label = "Excellent";
    labelColor = "text-green-500 dark:text-green-400";
  } else if (normalizedScore >= 71) {
    strokeColor = "#D97706";
    bgGradient = "from-amber-50 to-amber-100/40 dark:from-amber-500/10 dark:to-amber-500/5";
    textColor = "text-amber-600 dark:text-amber-400";
    label = "Good Match";
    labelColor = "text-amber-500 dark:text-amber-400";
  } else if (normalizedScore >= 56) {
    strokeColor = "#EA580C";
    bgGradient = "from-orange-50 to-orange-100/40 dark:from-orange-500/10 dark:to-orange-500/5";
    textColor = "text-orange-600 dark:text-orange-400";
    label = "Average";
    labelColor = "text-orange-500 dark:text-orange-400";
  }


  const circumference = 2 * Math.PI * 40;


  return (
    <div className={`relative flex items-center justify-center w-44 h-44 rounded-full bg-gradient-to-br ${bgGradient}`}>
      <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
        {/* Track */}
        <circle cx="50" cy="50" r="40" stroke="#E5E7EB" className="dark:stroke-zinc-800" strokeWidth="7" fill="none" />
        {/* Fill */}
        <motion.circle
          cx="50" cy="50" r="40"
          stroke={strokeColor}
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - (circumference * normalizedScore) / 100 }}
          transition={{ duration: 1.6, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.4, type: "spring" }}
          className={`text-[46px] font-black tracking-tighter leading-none ${textColor}`}
        >
          {normalizedScore}
        </motion.span>
        <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-widest mt-1">/ 100</span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className={`text-[11px] font-bold mt-1 ${labelColor}`}
        >
          {label}
        </motion.span>
      </div>
    </div>
  );
};


// ─────────────────────────────────────────────────────────────────────────────
// KEYWORD CHIP
// ─────────────────────────────────────────────────────────────────────────────
const KeywordChip = ({ word, priority }) => {
  const isHigh = priority === "high";
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold border transition-all ${
        isHigh
          ? "bg-red-50 text-red-700 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"
          : "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isHigh ? "bg-red-500" : "bg-amber-400"}`} />
      {word}
    </span>
  );
};


// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const ResumeEvaluator = ({ onEvaluationComplete, onEvaluationReset }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();


  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(() => sessionStorage.getItem("cached_resume_name") || "");
  const [jobDescription, setJobDescription] = useState(() => sessionStorage.getItem("cached_job_description") || "");
  const [result, setResult] = useState(() => {
    const cachedResult = sessionStorage.getItem("cached_evaluation_result");
    return cachedResult ? JSON.parse(cachedResult) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {
    sessionStorage.setItem("cached_job_description", jobDescription);
  }, [jobDescription]);


  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        return setError("Invalid file type. Please upload a PDF document.");
      }
      const maxSizeInBytes = 2 * 1024 * 1024;
      if (selectedFile.size > maxSizeInBytes) {
        return setError("File is too large. Maximum allowed size is 2MB.");
      }
      setFile(selectedFile);
      setFileName(selectedFile.name);
      sessionStorage.setItem("cached_resume_name", selectedFile.name);
      setError("");
    }
  };


  const handleEvaluate = async () => {
    if (!file && !fileName) return setError("Please upload a resume PDF.");
    if (!jobDescription.trim()) return setError("Please provide a target job description.");


    setLoading(true);
    setError("");


    const formData = new FormData();
    if (file) formData.append("resume", file);
    formData.append("jobDescription", jobDescription);
    formData.append("userId", currentUser.uid);
    formData.append("email", currentUser.email);


    try {
      const response = await axios.post(
        "http://localhost:5000/api/upload/evaluate",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );


      const runResult = response.data.data;


      sessionStorage.removeItem("careercoach_interview_chat");
      setResult(runResult);
      sessionStorage.setItem("cached_evaluation_result", JSON.stringify(runResult));


      if (runResult && runResult.atsScore !== undefined && runResult.atsScore !== null) {
        sessionStorage.setItem("careercoach_ats_score", String(runResult.atsScore));
      } else {
        sessionStorage.setItem("careercoach_ats_score", "N/A");
      }


      if (onEvaluationComplete) onEvaluationComplete();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to evaluate resume.");
    } finally {
      setLoading(false);
    }
  };


  const handleResetSession = () => {
    setFile(null);
    setFileName("");
    setJobDescription("");
    setResult(null);
    setError("");
    sessionStorage.removeItem("cached_resume_name");
    sessionStorage.removeItem("careercoach_interview_chat");
    sessionStorage.removeItem("cached_job_description");
    sessionStorage.removeItem("cached_evaluation_result");
    sessionStorage.removeItem("careercoach_ats_score");
    if (onEvaluationReset) onEvaluationReset();
  };


  // Safely pull keyword arrays — handles both old and new AI response shapes
  const highKeywords = result?.missingKeywords?.high ?? [];
  const mediumKeywords = result?.missingKeywords?.medium ?? [];
  const hasKeywords = highKeywords.length > 0 || mediumKeywords.length > 0;


  const pageTransition = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.3 } }
  };


  const stagger = {
    visible: { transition: { staggerChildren: 0.08 } }
  };


  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };


  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#FAFAFA] dark:bg-black text-gray-900 dark:text-zinc-100 font-['Inter',sans-serif] flex items-start justify-center p-6 pt-10 transition-colors duration-300">
      <div className="w-full max-w-5xl">


        <AnimatePresence mode="wait">


          {/* ============================================================ */}
          {/* STATE 1: INPUT                                               */}
          {/* ============================================================ */}
          {!result && !loading && (
            <motion.div
              key="input-stage"
              initial="hidden" animate="visible" exit="exit"
              variants={pageTransition}
              className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-xl dark:shadow-none border border-gray-100 dark:border-zinc-800 overflow-hidden transition-colors duration-300"
            >
              {/* Header */}
              <div className="px-10 py-8 border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/60 flex items-center justify-between transition-colors duration-300">
                <div>
                  <h1 className="text-2xl font-black text-black dark:text-white tracking-tight flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#6A0DAD] dark:text-purple-400 text-3xl">document_scanner</span>
                    AI Resume Evaluator
                  </h1>
                  <p className="text-gray-500 dark:text-zinc-400 text-sm font-medium mt-1">
                    Provide your resume and job description to uncover your ATS match.
                  </p>
                </div>
              </div>


              {/* Inputs */}
              <div className="p-10">
                <div className="grid md:grid-cols-2 gap-8">


                  {/* Job Description */}
                  <div className="flex flex-col h-full">
                    <label className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">work</span> Target Role
                    </label>
                    <textarea
                      className="flex-grow w-full min-h-[160px] p-5 rounded-2xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-zinc-500 focus:bg-white dark:focus:bg-zinc-800 focus:ring-2 focus:ring-[#6A0DAD]/30 focus:border-[#6A0DAD] outline-none transition-all resize-none"
                      placeholder="Paste the key responsibilities and requirements from the job posting..."
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                    />
                  </div>


                  {/* Resume Upload */}
                  <div className="flex flex-col h-full">
                    <label className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">upload_file</span> Resume Document
                    </label>
                    <div className="flex-grow relative border-2 border-dashed border-purple-200 dark:border-purple-500/20 bg-purple-50/30 dark:bg-purple-500/5 hover:bg-purple-50 dark:hover:bg-purple-500/10 rounded-2xl transition-all flex flex-col items-center justify-center p-6 text-center cursor-pointer group min-h-[160px]">
                      <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" id="resume-upload" />
                      <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform ${fileName ? "bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400" : "bg-white dark:bg-zinc-900 shadow-sm text-[#6A0DAD] dark:text-purple-400 group-hover:scale-110"}`}>
                          <span className="material-symbols-outlined text-2xl">{fileName ? "task" : "cloud_upload"}</span>
                        </div>
                        <p className="text-black dark:text-white font-extrabold text-sm">{fileName ? fileName : "Click to Upload PDF"}</p>
                        <p className="text-gray-400 dark:text-zinc-500 text-xs font-medium mt-1">PDF only · Max 2MB</p>
                      </label>
                    </div>
                  </div>
                </div>


                {error && (
                  <div className="mt-6 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined">error</span> {error}
                  </div>
                )}


                <button
                  onClick={handleEvaluate}
                  className="w-full mt-8 py-5 rounded-2xl font-extrabold text-white bg-[#6A0DAD] hover:bg-[#580b94] dark:bg-purple-600 dark:hover:bg-purple-700 transition-all shadow-[0_8px_20px_rgba(106,13,173,0.2)] active:scale-95 flex justify-center items-center gap-3 text-lg"
                >
                  Analyze Resume
                  <span className="material-symbols-outlined">insights</span>
                </button>
              </div>
            </motion.div>
          )}


          {/* ============================================================ */}
          {/* STATE 2: LOADING                                             */}
          {/* ============================================================ */}
          {loading && (
            <motion.div
              key="loading-stage"
              initial="hidden" animate="visible" exit="exit"
              variants={pageTransition}
              className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-xl dark:shadow-none border border-gray-100 dark:border-zinc-800 p-16 flex flex-col items-center justify-center text-center transition-colors duration-300"
            >
              <div className="relative w-24 h-32 bg-gray-50 dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-xl overflow-hidden mb-8 shadow-sm">
                <motion.div
                  animate={{ y: ["0%", "400%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-transparent to-[#6A0DAD]/40 border-b-2 border-[#6A0DAD] z-10"
                />
                <div className="p-3 space-y-2 opacity-30">
                  <div className="h-2 bg-gray-400 dark:bg-zinc-600 rounded w-3/4" />
                  <div className="h-2 bg-gray-400 dark:bg-zinc-600 rounded w-full" />
                  <div className="h-2 bg-gray-400 dark:bg-zinc-600 rounded w-5/6" />
                  <div className="h-2 bg-gray-400 dark:bg-zinc-600 rounded w-full mt-4" />
                </div>
              </div>
              <h2 className="text-2xl font-black text-black dark:text-white animate-pulse">Running AI Analysis</h2>
              <p className="text-gray-500 dark:text-zinc-400 font-medium mt-2">Cross-referencing your experience with the job description...</p>
            </motion.div>
          )}


          {/* ============================================================ */}
          {/* STATE 3: RESULTS                                             */}
          {/* ============================================================ */}
          {result && !loading && (
            <motion.div
              key="result-stage"
              initial="hidden" animate="visible"
              variants={stagger}
              className="flex flex-col gap-5"
            >


              {/* ── Top status bar ── */}
              <motion.div
                variants={fadeUp}
                className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-zinc-900 px-8 py-5 rounded-[2rem] shadow-sm dark:shadow-none border border-gray-100 dark:border-zinc-800 transition-colors duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center">
                    <span className="material-symbols-outlined">verified</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-black dark:text-white tracking-tight">{fileName || "Your Resume"}</p>
                    <p className="text-xs text-gray-500 dark:text-zinc-400 font-medium">Evaluation complete</p>
                  </div>
                </div>
                <button
                  onClick={handleResetSession}
                  className="px-5 py-2.5 rounded-full font-bold text-gray-700 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all active:scale-95 flex items-center gap-2 text-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                  Scan New Resume
                </button>
              </motion.div>


              {/* ── Row 1: Score + Suggestions ── */}
              <motion.div variants={fadeUp} className="grid md:grid-cols-3 gap-5">


                {/* ATS Score */}
                <div className="md:col-span-1 bg-white dark:bg-zinc-900 rounded-[2rem] shadow-sm dark:shadow-none border border-gray-100 dark:border-zinc-800 p-8 flex flex-col items-center justify-center text-center transition-colors duration-300">
                  <ScoreRing score={result.atsScore} />
                  <h3 className="text-lg font-black text-black dark:text-white mt-6">ATS Match Score</h3>
                  <p className="text-sm text-gray-500 dark:text-zinc-400 font-medium mt-2 leading-relaxed">
                    {result.atsScore >= 85
                      ? "Excellent fit. You are highly optimised for this role."
                      : result.atsScore >= 71
                      ? "Good match. A few keyword additions will strengthen it further."
                      : result.atsScore >= 56
                      ? "Moderate match. Your resume needs targeted improvements."
                      : "Low match. Core requirements are missing from your resume."}
                  </p>
                </div>


                {/* Actionable Fixes */}
                <div className="md:col-span-2 bg-white dark:bg-zinc-900 rounded-[2rem] shadow-sm dark:shadow-none border border-gray-100 dark:border-zinc-800 p-8 flex flex-col transition-colors duration-300">
                  <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100 dark:border-zinc-800">
                    <span className="material-symbols-outlined text-[#6A0DAD] dark:text-purple-400 text-2xl">fact_check</span>
                    <div>
                      <h3 className="text-lg font-black text-black dark:text-white leading-tight">Actionable Fixes</h3>
                      <p className="text-xs text-gray-400 dark:text-zinc-500 font-medium mt-0.5">Specific steps to improve your match rate</p>
                    </div>
                  </div>


                  <div className="flex-grow space-y-3 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
                    {result.suggestions && result.suggestions.length > 0 ? (
                      result.suggestions.map((tip, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/60 border border-gray-100 dark:border-zinc-700 flex items-start gap-3.5"
                        >
                          <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold text-[10px] shrink-0 mt-0.5">
                            {index + 1}
                          </div>
                          <p className="text-gray-700 dark:text-zinc-300 text-sm font-medium leading-relaxed">{tip}</p>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center h-32 opacity-60">
                        <span className="material-symbols-outlined text-4xl text-green-500">task_alt</span>
                        <p className="text-gray-800 dark:text-zinc-200 font-bold">No major gaps found.</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>


              {/* ── Row 2: Missing Keywords (only renders if AI returned them) ── */}
              {hasKeywords && (
                <motion.div
                  variants={fadeUp}
                  className="bg-white dark:bg-zinc-900 rounded-[2rem] shadow-sm dark:shadow-none border border-gray-100 dark:border-zinc-800 p-8 transition-colors duration-300"
                >
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-zinc-800">
                    <span className="material-symbols-outlined text-rose-500 dark:text-rose-400 text-2xl">key</span>
                    <div>
                      <h3 className="text-lg font-black text-black dark:text-white leading-tight">Missing Keywords</h3>
                      <p className="text-xs text-gray-400 dark:text-zinc-500 font-medium mt-0.5">
                        Add these terms to your resume to increase your ATS match rate
                      </p>
                    </div>
                  </div>


                  <div className="flex flex-col gap-5">
                    {/* High priority */}
                    {highKeywords.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                          <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-widest">
                            Critical — add immediately
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {highKeywords.map((kw, i) => (
                            <KeywordChip key={i} word={kw} priority="high" />
                          ))}
                        </div>
                      </div>
                    )}


                    {/* Medium priority */}
                    {mediumKeywords.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                          <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                            Contextualise — already listed but not proven
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {mediumKeywords.map((kw, i) => (
                            <KeywordChip key={i} word={kw} priority="medium" />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}


              {/* ── Row 3: CTA ── */}
              <motion.div variants={fadeUp}>
                <button
                  onClick={() => navigate('/interview')}
                  className="w-full py-5 rounded-2xl font-extrabold text-white bg-[#6A0DAD] hover:bg-[#580b94] dark:bg-purple-600 dark:hover:bg-purple-700 transition-all shadow-[0_8px_20px_rgba(106,13,173,0.18)] active:scale-95 flex justify-center items-center gap-2 text-base"
                >
                  Start AI Mock Interview
                  <span className="material-symbols-outlined">record_voice_over</span>
                </button>
              </motion.div>


            </motion.div>
          )}


        </AnimatePresence>
      </div>


      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D1D5DB; }
      ` }} />
    </div>
  );
};


export default ResumeEvaluator;