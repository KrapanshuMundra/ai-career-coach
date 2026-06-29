import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const KeywordChip = ({ word, priority }) => {
  const isHigh = priority === "high";
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold border ${
      isHigh ? "bg-red-50 text-red-700 border-red-100" : "bg-amber-50 text-amber-700 border-amber-100"
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isHigh ? "bg-red-500" : "bg-amber-400"}`} />
      {word}
    </span>
  );
};

const MiniScoreBar = ({ score }) => {
  let barColor = "bg-red-400";
  if (score >= 85) barColor = "bg-green-500";
  else if (score >= 71) barColor = "bg-amber-400";
  else if (score >= 56) barColor = "bg-orange-400";
  return (
    <div className="flex items-center gap-3">
      <span className="font-black text-black text-base w-8 shrink-0">{score}</span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div className={`h-full rounded-full ${barColor}`}
          initial={{ width: 0 }} animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }} />
      </div>
      <span className="text-gray-400 text-xs font-bold shrink-0">/ 100</span>
    </div>
  );
};

const getStatusConfig = (score) => {
  if (score >= 85) return { label: "Excellent",  badge: "bg-green-50 text-green-700 border-green-200",    icon: "verified"      };
  if (score >= 71) return { label: "Good Match", badge: "bg-amber-50 text-amber-700 border-amber-200",    icon: "trending_up"   };
  if (score >= 56) return { label: "Average",    badge: "bg-orange-50 text-orange-700 border-orange-200", icon: "remove_circle" };
  if (score >= 36) return { label: "Below Avg",  badge: "bg-red-50 text-red-700 border-red-200",          icon: "warning"       };
  return                  { label: "Poor Match", badge: "bg-red-100 text-red-800 border-red-300",         icon: "dangerous"     };
};

// Compact suggestion card with collapse/expand
const SuggestionCard = ({ text, index }) => {
  const [expanded, setExpanded] = useState(false);

  // Extract a short title: first quoted term OR first 5 words
  const quotedMatch = text.match(/[''""]([^''"",\.]{3,40})[''""]/);
  const shortTitle  = quotedMatch
    ? quotedMatch[1]
    : text.split(" ").slice(0, 5).join(" ") + "…";

  // Preview = first sentence only
  const firstSentence = text.split(/\.\s+/)[0].trimEnd() + ".";
  const hasMore       = text.trim().length > firstSentence.length + 3;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
      <div className="flex items-start gap-3 px-4 pt-4 pb-3 flex-1">
        <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-black text-[9px] shrink-0 mt-0.5">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          {/* Keyword headline */}
          <p className="text-[10px] font-black text-[#6A0DAD] uppercase tracking-wider mb-1.5 truncate">
            {shortTitle}
          </p>
          {/* Body text */}
          <p className="text-gray-600 text-[12.5px] font-medium leading-relaxed">
            {expanded ? text : firstSentence}
          </p>
        </div>
      </div>
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-center gap-1 py-2 border-t border-gray-50 text-[11px] font-bold text-gray-400 hover:text-[#6A0DAD] hover:bg-purple-50/40 transition-all"
        >
          <span className="material-symbols-outlined text-[13px]">
            {expanded ? "expand_less" : "expand_more"}
          </span>
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
};

export default function Dashboard() {
  const { currentUser } = useAuth();
  const navigate        = useNavigate();

  const [evaluations, setEvaluations] = useState([]);
  const [selected, setSelected]       = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");

  useEffect(() => {
    async function fetchUserHistory() {
      if (!currentUser?.uid) return;
      try {
        setLoading(true);
        setError("");
        const baseUrl  = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
        const response = await axios.get(`${baseUrl}/api/upload/history/${currentUser.uid}`);
        if (response.data.success) {
          const formatted = response.data.data.map((item) => ({
            id:              item._id,
            date:            item.createdAt
                               ? new Date(item.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
                               : "Recent Run",
            atsScore:        item.atsScore ?? 0,
            jobRole:         item.jobDescription
                               ? item.jobDescription.substring(0, 50) + "…"
                               : "Technical Profile Assessment",
            suggestions:     item.suggestions    || [],
            missingKeywords: item.missingKeywords || { high: [], medium: [] },
          }));
          setEvaluations(formatted);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load evaluation history.");
      } finally {
        setLoading(false);
      }
    }
    fetchUserHistory();
  }, [currentUser]);

  const totalScans  = evaluations.length;
  const bestScore   = totalScans > 0 ? Math.max(...evaluations.map((e) => e.atsScore)) : 0;
  const latestScore = totalScans > 0 ? evaluations[0].atsScore : 0;
  const avgScore    = totalScans > 0
    ? Math.round(evaluations.reduce((s, e) => s + e.atsScore, 0) / totalScans)
    : 0;

  const fadeUp = {
    hidden:  { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };
  const stagger = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-center items-center font-['Inter',sans-serif]">
        <svg className="animate-spin h-10 w-10 text-[#6A0DAD] mb-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Synchronizing Profile…</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#FAFAFA] font-['Inter',sans-serif] text-gray-900 pb-24">
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12 pt-10 md:pt-16">

        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-xs text-[#6A0DAD] font-bold mb-6 uppercase tracking-widest">
            <span className="material-symbols-outlined text-[14px]">space_dashboard</span>
            Overview
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-black">Evaluation History</h1>
          <p className="mt-4 text-gray-500 max-w-2xl font-medium leading-relaxed">
            Track your ATS score progress over time. Click any row to view AI recommendations and missing keywords.
          </p>
        </motion.div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="p-4 mb-8 text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3"
          >
            <span className="material-symbols-outlined">error</span>{error}
          </motion.div>
        )}

        {totalScans === 0 && !error ? (
          <motion.div initial="hidden" animate="visible" variants={fadeUp}
            className="p-16 text-center rounded-[2rem] bg-white border border-gray-200 shadow-sm flex flex-col items-center"
          >
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-4xl text-gray-300">note_add</span>
            </div>
            <h3 className="text-xl font-extrabold text-black mb-2">No Evaluations Yet</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed font-medium mb-8">
              You haven't run any evaluations yet. Head to the Evaluator to get your first ATS score.
            </p>
            <button onClick={() => navigate("/evaluator")}
              className="px-8 py-3.5 rounded-full font-bold text-white bg-[#6A0DAD] hover:bg-[#580b94] transition-all shadow-md active:scale-95"
            >
              Start First Evaluation
            </button>
          </motion.div>
        ) : (
          <>
            {/* Stats */}
            <motion.div initial="hidden" animate="visible" variants={stagger}
              className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-10"
            >
              {[
                { label: "Total Scans",   value: totalScans,  suffix: "",      icon: "monitoring",   iconColor: "text-blue-400"   },
                { label: "Best Score",    value: bestScore,   suffix: "/ 100", icon: "emoji_events", iconColor: "text-green-400"  },
                { label: "Latest Score",  value: latestScore, suffix: "/ 100", icon: "update",       iconColor: "text-orange-400" },
                { label: "Average Score", value: avgScore,    suffix: "/ 100", icon: "bar_chart",    iconColor: "text-purple-400" },
              ].map((stat) => (
                <motion.div key={stat.label} variants={fadeUp}
                  className="p-7 rounded-[2rem] bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                >
                  <div className={`absolute top-0 right-0 p-5 opacity-[0.08] group-hover:opacity-[0.12] group-hover:scale-110 transition-all ${stat.iconColor}`}>
                    <span className="material-symbols-outlined text-8xl">{stat.icon}</span>
                  </div>
                  <div className="relative z-10">
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-3">{stat.label}</p>
                    <div className="flex items-baseline gap-1.5">
                      <p className="text-4xl font-black text-black">{stat.value}</p>
                      {stat.suffix && <p className="text-gray-400 font-bold text-sm">{stat.suffix}</p>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Table */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp}
              className="rounded-[2rem] bg-white border border-gray-200 shadow-sm overflow-hidden"
            >
              <div className="px-8 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-black">All Evaluations</h2>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {totalScans} {totalScans === 1 ? "record" : "records"}
                </span>
              </div>

              <div>
  {/* ── MOBILE: Card list (shown below md) ── */}
  <div className="md:hidden divide-y divide-gray-100">
    {evaluations.map((item) => {
      const status   = getStatusConfig(item.atsScore);
      const isOpen   = selected === item.id;
      const highKw   = item.missingKeywords?.high   ?? [];
      const mediumKw = item.missingKeywords?.medium  ?? [];
      const hasKw    = highKw.length > 0 || mediumKw.length > 0;

      return (
        <React.Fragment key={item.id}>
          <div
            className={`px-5 py-4 cursor-pointer transition-colors ${isOpen ? "bg-purple-50/40" : "hover:bg-gray-50/60"}`}
            onClick={() => setSelected(isOpen ? null : item.id)}
          >
            {/* Top row: date + status badge */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold text-gray-400">{item.date}</span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${status.badge}`}>
                <span className="material-symbols-outlined text-[11px]">{status.icon}</span>
                {status.label}
              </span>
            </div>

            {/* Job role */}
            <p className="text-[13px] font-semibold text-gray-700 mb-3 truncate">{item.jobRole}</p>

            {/* Score bar */}
            <MiniScoreBar score={item.atsScore} />

            {/* Expand button */}
            <button
              onClick={(e) => { e.stopPropagation(); setSelected(isOpen ? null : item.id); }}
              className={`mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                isOpen
                  ? "bg-gray-100 text-gray-700 border-gray-200"
                  : "bg-white text-[#6A0DAD] border-gray-200 hover:bg-purple-50"
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">{isOpen ? "expand_less" : "expand_more"}</span>
              {isOpen ? "Close" : "View Fixes"}
            </button>
          </div>

          {/* Expandable detail — mobile */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden border-b border-purple-100/60"
              >
                <div className="bg-[#F9F5FF] px-5 py-6 space-y-6">
                  {/* AI Fixes */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-[#6A0DAD]">
                        <span className="material-symbols-outlined text-sm">auto_awesome</span>
                      </div>
                      <h3 className="text-black font-extrabold text-sm">AI Recommended Fixes</h3>
                    </div>
                    {item.suggestions.length > 0 ? (
                      <div className="space-y-2">
                        {item.suggestions.map((sug, idx) => (
                          <SuggestionCard key={idx} text={sug} index={idx} />
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-2 text-gray-500 text-sm">
                        <span className="material-symbols-outlined text-green-500">verified</span>
                        No major improvements needed.
                      </div>
                    )}
                  </div>

                  {/* Missing Keywords */}
                  {hasKw && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                          <span className="material-symbols-outlined text-sm">key</span>
                        </div>
                        <h3 className="text-black font-extrabold text-sm">Missing Keywords</h3>
                      </div>
                      <div className="space-y-3">
                        {highKw.length > 0 && (
                          <div>
                            <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest mb-2">Critical</p>
                            <div className="flex flex-wrap gap-1.5">
                              {highKw.map((kw, i) => <KeywordChip key={i} word={kw} priority="high" />)}
                            </div>
                          </div>
                        )}
                        {mediumKw.length > 0 && (
                          <div>
                            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-2">Contextualise</p>
                            <div className="flex flex-wrap gap-1.5">
                              {mediumKw.map((kw, i) => <KeywordChip key={i} word={kw} priority="medium" />)}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <button onClick={() => navigate("/evaluator")}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm text-white bg-[#6A0DAD] hover:bg-[#580b94] transition-all active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[15px]">refresh</span>
                      Re-scan with updated resume
                    </button>
                    <button onClick={() => navigate("/interview")}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-all active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[15px]">record_voice_over</span>
                      Practice interview
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </React.Fragment>
      );
    })}
  </div>

  {/* ── DESKTOP: Table (hidden below md) ── */}
  <div className="hidden md:block overflow-x-auto">
    <table className="w-full text-sm text-left table-fixed">
      <thead className="text-gray-400 bg-gray-50/80 border-b border-gray-100 text-[11px] uppercase tracking-widest font-bold">
        <tr>
          <th className="px-8 py-4">Date</th>
          <th className="px-8 py-4">Target Role</th>
          <th className="px-8 py-4 w-[220px]">ATS Score</th>
          <th className="px-8 py-4">Status</th>
          <th className="px-8 py-4 text-right">Details</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {evaluations.map((item) => {
          const status   = getStatusConfig(item.atsScore);
          const isOpen   = selected === item.id;
          const highKw   = item.missingKeywords?.high   ?? [];
          const mediumKw = item.missingKeywords?.medium  ?? [];
          const hasKw    = highKw.length > 0 || mediumKw.length > 0;

          return (
            <React.Fragment key={item.id}>
              <tr
                className={`transition-colors cursor-pointer ${isOpen ? "bg-purple-50/40" : "hover:bg-gray-50/60"}`}
                onClick={() => setSelected(isOpen ? null : item.id)}
              >
                <td className="px-8 py-5 font-medium text-gray-700 whitespace-nowrap">{item.date}</td>
                <td className="px-8 py-5 text-gray-600 font-medium max-w-[260px] truncate">{item.jobRole}</td>
                <td className="px-8 py-5 w-[220px]"><MiniScoreBar score={item.atsScore} /></td>
                <td className="px-8 py-5">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${status.badge}`}>
                    <span className="material-symbols-outlined text-[13px]">{status.icon}</span>
                    {status.label}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelected(isOpen ? null : item.id); }}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                      isOpen
                        ? "bg-gray-100 text-gray-700 border-gray-200"
                        : "bg-white text-[#6A0DAD] border-gray-200 hover:border-[#6A0DAD]/40 hover:bg-purple-50 shadow-sm"
                    }`}
                  >
                    {isOpen
                      ? <><span className="material-symbols-outlined text-[14px]">expand_less</span> Close</>
                      : <><span className="material-symbols-outlined text-[14px]">expand_more</span> View Fixes</>
                    }
                  </button>
                </td>
              </tr>

              <AnimatePresence>
                {isOpen && (
                  <tr>
                    <td colSpan="5" className="p-0">
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden border-b border-purple-100/60"
                      >
                        <div className="bg-[#F9F5FF] px-10 py-8 space-y-8">
                          <div>
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-[#6A0DAD]">
                                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                              </div>
                              <div>
                                <h3 className="text-black font-extrabold text-base leading-tight">AI Recommended Fixes</h3>
                                <p className="text-[11px] text-gray-400 font-medium mt-0.5">Tap a card to expand the full detail</p>
                              </div>
                            </div>
                            {item.suggestions.length > 0 ? (
                              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {item.suggestions.map((sug, idx) => (
                                  <SuggestionCard key={idx} text={sug} index={idx} />
                                ))}
                              </div>
                            ) : (
                              <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3 text-gray-500 font-medium text-sm">
                                <span className="material-symbols-outlined text-green-500 text-xl">verified</span>
                                No major improvements needed for this evaluation.
                              </div>
                            )}
                          </div>

                          {hasKw && (
                            <div>
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                                  <span className="material-symbols-outlined text-sm">key</span>
                                </div>
                                <h3 className="text-black font-extrabold text-base">Missing Keywords</h3>
                              </div>
                              <div className="space-y-4">
                                {highKw.length > 0 && (
                                  <div>
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                                      <p className="text-[11px] font-bold text-red-600 uppercase tracking-widest">Critical — add immediately</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      {highKw.map((kw, i) => <KeywordChip key={i} word={kw} priority="high" />)}
                                    </div>
                                  </div>
                                )}
                                {mediumKw.length > 0 && (
                                  <div>
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                                      <p className="text-[11px] font-bold text-amber-600 uppercase tracking-widest">Contextualise — listed but not proven</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      {mediumKw.map((kw, i) => <KeywordChip key={i} word={kw} priority="medium" />)}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-3 pt-1">
                            <button onClick={() => navigate("/evaluator")}
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm text-white bg-[#6A0DAD] hover:bg-[#580b94] transition-all shadow-sm active:scale-95"
                            >
                              <span className="material-symbols-outlined text-[16px]">refresh</span>
                              Re-scan with updated resume
                            </button>
                            <button onClick={() => navigate("/interview")}
                              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm text-gray-700 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all active:scale-95"
                            >
                              <span className="material-symbols-outlined text-[16px]">record_voice_over</span>
                              Practice interview
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  </div>
</div>
            </motion.div>
          </>
        )}
      </section>
    </div>
  );
}