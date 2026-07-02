import { React, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import MarqueePackage from "react-fast-marquee";
import { motion } from "framer-motion";


const Marquee = MarqueePackage.default || MarqueePackage;


// ─────────────────────────────────────────────────────────────────────────────
// HERO RIGHT COLUMN SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
const ATSScoreReveal = () => {
  const [score, setScore] = useState(0);
  const CIRC = 339.3;
  const TARGET = 73;
  useEffect(() => {
    let start = null;
    const dur = 1600;
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const tick = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      setScore(Math.round(TARGET * ease(p)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);
  return (
    <div className="flex flex-col items-center justify-center py-5 px-4 sm:py-6 sm:px-6">
      <div className="relative w-[90px] h-[90px] sm:w-[110px] sm:h-[110px] lg:w-[120px] lg:h-[120px]">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 130 130">
          <circle cx="65" cy="65" r="54" stroke="#f3f4f6" className="dark:stroke-zinc-800" strokeWidth="9" fill="none" />
          <circle
            cx="65" cy="65" r="54"
            stroke="#6A0DAD" strokeWidth="9" fill="none"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC - (CIRC * score) / 100}
            style={{ transition: "stroke-dashoffset 0.05s linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[26px] sm:text-[30px] lg:text-[34px] font-black text-[#6A0DAD] dark:text-purple-400 leading-none tracking-tight">
            {score}
          </span>
          <span className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 mt-1">/ 100</span>
        </div>
      </div>
    </div>
  );
};


const keywordRows = [
  [
    { label: "+ Docker", cls: "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400", delay: 900 },
    { label: "+ Kubernetes", cls: "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400", delay: 1000 },
    { label: '~ "led" → "spearheaded"', cls: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400", delay: 1100 },
  ],
  [
    { label: "✓ Python", cls: "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400", delay: 1200 },
    { label: "✓ REST API", cls: "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400", delay: 1300 },
    { label: "✓ SQL", cls: "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400", delay: 1400 },
  ],
  [
    { label: "+ CI/CD", cls: "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400", delay: 1400 },
    { label: "+ Redis", cls: "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400", delay: 1500 },
  ],
];


const KeywordReveal = () => (
  <div className="space-y-1.5">
    {keywordRows.map((row, rowIndex) => (
      <div key={rowIndex} className="flex flex-wrap gap-1.5">
        {row.map((c, i) => (
          <motion.span
            key={c.label}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: c.delay / 1000, duration: 0.3 }}
            className={`text-[10px] sm:text-[11px] font-semibold px-2 sm:px-2.5 py-1 rounded-full ${c.cls}`}
          >
            {c.label}
          </motion.span>
        ))}
      </div>
    ))}
  </div>
);


const bars = [
  { label: "Technical Accuracy",    score: 16, pct: 80, delay: 1  },
  { label: "Communication Clarity", score: 14, pct: 70, delay: 1.15 },
  { label: "Problem-Solving",       score: 15, pct: 75, delay: 1.30  },
  { label: "Role Alignment",       score: 15, pct: 75, delay: 1.45  },
  { label: "Specificity",       score: 12, pct: 80, delay: 1.60  },
];


const BreakdownBars = () => (
  <div className="space-y-2">
    {bars.map((b, i) => (
      <div key={i}>
        <div className="flex justify-between mb-1">
          <span className="text-[10px] sm:text-[11px] font-semibold text-gray-600 dark:text-zinc-400">{b.label}</span>
          <span className="text-[10px] sm:text-[11px] font-black text-[#6A0DAD] dark:text-purple-400">
            {b.score}<span className="text-gray-400 dark:text-zinc-500 font-semibold">/20</span>
          </span>
        </div>
        <div className="h-[4px] sm:h-[5px] bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#6A0DAD] dark:bg-purple-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${b.pct}%` }}
            transition={{ delay: b.delay, duration: 0.9, ease: "easeOut" }}
          />
        </div>
      </div>
    ))}
  </div>
);


const ChatSnippet = () => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.8, duration: 0.4 }}
  >
    <div className="bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl rounded-bl-sm p-2.5 text-[10px] sm:text-[11px] text-gray-600 dark:text-zinc-300 font-medium leading-relaxed mb-2">
  "Explain how JWT authentication works in your MERN project."
</div>


<div className="bg-purple-50 dark:bg-purple-500/10 rounded-xl rounded-tl-sm p-2.5 flex gap-2 items-start">
  <span className="text-[8px] font-black bg-[#6A0DAD] dark:bg-purple-600 text-white px-1.5 py-0.5 rounded mt-0.5 shrink-0">
    User
  </span>


  <p className="text-[10px] sm:text-[11px] text-purple-700 dark:text-purple-300 font-medium leading-relaxed">
    I used JWT to authenticate users and protected private routes with middleware.
  </p>
</div>


<div className="bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl rounded-bl-sm p-2.5 text-[10px] sm:text-[11px] text-gray-600 dark:text-zinc-300 font-medium leading-relaxed mt-2">
  "Why did you choose JWT instead of session-based authentication?"
</div>
  </motion.div>
);


// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function Home() {
  const { currentUser } = useAuth();


  const testimonials = [
    { name: "Nitin Chauhan.",  role: "Software Engineer",   text: "The ATS feedback told me exactly what keywords I was missing. The mock interview sealed the deal.",          image: "/user1.jpg" },
    { name: "Evanya David.",   role: "HR Specialist",       text: "Practicing with the AI interviewer gave me so much confidence. It asked questions directly from my CV!",  image: "/user4.jpg" },
    { name: "Sahil Katariya.", role: "Product Designer",    text: "Got two interview invites the same week I used this tool to fix my ATS score. It really works!",           image: "/user2.jpg" },
    { name: "Shivam Tiwari.",  role: "Business Analyst",    text: "Best career prep tool I've tried. It made my CV sound more confident and focused.",                        image: "/user3.jpg" },
    { name: "Maitri Patel.",   role: "Project Coordinator", text: "Simple, fast, and effective. The interview feedback was spot on.",                                          image: "/user5.jpg" },
  ];


  const fadeUp = {
    hidden:  { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };


  const staggerContainer = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };


  return (
    <div className="w-full bg-white dark:bg-black min-h-screen font-['Inter',sans-serif] text-gray-900 dark:text-zinc-100 overflow-hidden transition-colors duration-300">


      {/* ═══════════════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative w-full pt-4 pb-0 overflow-hidden">


        {/* Background glow */}
        <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] lg:w-[700px] h-[300px] sm:h-[500px] lg:h-[700px] bg-purple-400/10 dark:bg-purple-500/10 blur-[120px] lg:blur-[160px] rounded-full pointer-events-none" />


        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-stretch gap-8 lg:gap-0 relative z-10">


          {/* ── LEFT COLUMN ── */}
          <motion.div
            className="flex-1 py-6 sm:py-8 pr-0 lg:pr-16 text-center lg:text-left w-full"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Badge */}
            <motion.div variants={fadeUp} className="flex justify-center lg:justify-start mb-5 sm:mb-7">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 text-[11px] font-bold text-[#6A0DAD] dark:text-purple-400 uppercase tracking-widest">
                <span className="relative flex h-[7px] w-[7px]">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6A0DAD] opacity-40" />
                  <span className="relative inline-flex rounded-full h-[7px] w-[7px] bg-[#6A0DAD]" />
                </span>
                CareerCoach AI 2.0
              </span>
            </motion.div>


            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[58px] font-black tracking-[-0.03em] text-black dark:text-white leading-[1.08] mb-4 sm:mb-5"
            >
              Master the interview.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6A0DAD] to-[#9D4EDD]">
                Starting with your resume.
              </span>
            </motion.h1>


            {/* Subtext */}
            <motion.p
              variants={fadeUp}
              className="text-[14px] sm:text-[16px] text-gray-500 dark:text-zinc-400 max-w-[440px] mx-auto lg:mx-0 font-normal leading-relaxed mb-8 sm:mb-10"
            >
              Upload your resume, unlock your ATS score with actionable fixes, and practice with our AI interviewer — all tailored to your target job.
            </motion.p>


            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8 sm:mb-12"
            >
              <Link
                to={currentUser ? "/evaluator" : "/signup"}
                className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 sm:py-[14px] rounded-full font-bold text-[14px] sm:text-[15px] text-white bg-[#6A0DAD] hover:bg-[#580b94] dark:bg-purple-600 dark:hover:bg-purple-700 transition-all shadow-[0_8px_24px_rgba(106,13,173,0.22)] hover:-translate-y-0.5 active:scale-95"
              >
                {currentUser ? "Go to Dashboard" : "Start For Free"}
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
              <Link
                to={currentUser ? "/evaluator" : "/login"}
                className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 sm:py-[14px] rounded-full font-semibold text-[14px] sm:text-[15px] text-gray-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 border-[1.5px] border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all active:scale-95"
              >
                See How It Works
              </Link>
            </motion.div>


            {/* Social proof */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row items-center lg:items-start gap-3 justify-center lg:justify-start"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((n) => (
                  <img
                    key={n}
                    src={`/user${n}.jpg`}
                    alt={`User ${n}`}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-[2.5px] border-white dark:border-zinc-900 object-cover"
                  />
                ))}
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-[2.5px] border-white dark:border-zinc-900 bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-[9px] font-bold text-gray-500 dark:text-zinc-400">
                  100+
                </div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-[#f59e0b] text-sm tracking-wide mb-0.5">★★★★★</div>
                <p className="text-[12px] sm:text-[13px] text-gray-500 dark:text-zinc-400 font-medium">
                  <span className="text-gray-800 dark:text-white font-bold">1,200+ professionals</span> landed interviews
                </p>
              </div>
            </motion.div>
          </motion.div>


          {/* ── RIGHT COLUMN: Animated Score Reveal ── */}
          <motion.div
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 50, damping: 16, delay: 0.2 }}
            className="relative w-full lg:w-[580px] xl:w-[620px] flex pb-6 lg:pb-8 lg:py-8"
          >
            {/* Glow */}
            <div className="absolute inset-0 bg-[#6A0DAD]/6 dark:bg-purple-500/10 blur-[80px] rounded-full pointer-events-none" />


            {/* Card */}
            <div className="relative z-10 w-full h-full min-h-[560px] bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-[2rem] border border-gray-100 dark:border-zinc-800 shadow-[0_16px_40px_rgba(106,13,173,0.08),0_4px_16px_rgba(0,0,0,0.05)] dark:shadow-none overflow-hidden transition-colors duration-300">
              {/* ── MOBILE & TABLET: Vertical stack ── */}
              <div className="flex flex-col lg:hidden">


                {/* Score + Keywords row */}
                <div className="flex items-stretch border-b border-gray-50 dark:border-zinc-800">
                  {/* Score ring */}
                  <div className="flex flex-col items-center justify-center border-r border-gray-50 dark:border-zinc-800 px-4 sm:px-6 py-4 sm:py-5 min-w-[110px] sm:min-w-[130px]">
                    <p className="text-[8px] sm:text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-2">ATS Score</p>
                    <ATSScoreReveal />
                  </div>


                  {/* Keywords */}
                  <div className="flex-1 px-3 sm:px-4 py-4 sm:py-5">
                    <p className="text-[8px] sm:text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-2">Missing keywords</p>
                    <KeywordReveal />
                  </div>
                </div>


                {/* Chat */}
<div className="px-4 sm:px-5 py-4 sm:py-5 border-b border-gray-50 dark:border-zinc-800">
  <p className="text-[8px] sm:text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-2">
    Mock interview feedback
  </p>
  <ChatSnippet />
</div>


{/* Bars */}
<div className="px-4 sm:px-5 py-4 sm:py-5">
  <p className="text-[8px] sm:text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-3">
    Interview breakdown
  </p>
  <BreakdownBars />
</div>
              </div>


              {/* ── DESKTOP: Horizontal layout ── */}
              <div className="hidden lg:flex flex-row h-full">


                {/* Score ring — left accent column */}
                <div className="flex flex-col items-center justify-center px-6 py-6 border-r border-gray-100 dark:border-zinc-800 min-w-[180px]">
                  <p className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-3">ATS Score</p>
                  <ATSScoreReveal />
                </div>


                {/* Right side — stacked */}
                <div className="flex-1 flex flex-col justify-between h-full px-6 py-7">


                  <div>
                    <p className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-2">Missing keywords</p>
                    <KeywordReveal />
                  </div>


                  <div>
                    <p className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-2">Mock interview feedback</p>
                    <ChatSnippet />
                  </div>


                  <div>
                    <p className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-widest mb-2">Interview breakdown</p>
                    <BreakdownBars />
                  </div>


                  


                </div>
              </div>
            </div>
          </motion.div>


        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════
          COMPANIES MARQUEE
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-5 sm:py-6 bg-white dark:bg-zinc-950 border-b border-gray-100 dark:border-zinc-800 relative z-40 transition-colors duration-300">
        <p className="text-center text-[10px] sm:text-[11px] text-gray-400 dark:text-zinc-500 font-medium mb-4 sm:mb-5 uppercase tracking-widest">
          Helping users land jobs at
        </p>
        <Marquee gradient={true} gradientColor={[255, 255, 255]} speed={80}>
          <div className="flex items-center gap-10 sm:gap-16 px-6 sm:px-8">
            {["TCS", "Infosys", "Google", "Deloitte", "Bolt", "L & T", "Microsoft", "Wipro", "Accenture"].map((c) => (
              <span key={c} className="text-[13px] sm:text-[15px] font-bold text-gray-300 dark:text-zinc-700 tracking-wide">
                {c}
              </span>
            ))}
          </div>
        </Marquee>
      </section>


      {/* ═══════════════════════════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-12">
        <motion.div
          initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUp}
          className="text-center mb-10 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold text-black dark:text-white">How it Works</h2>
        </motion.div>


        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {[
            { bg: "bg-[#FFF6EF] dark:bg-orange-500/10", icon: "upload_file",     iconColor: "text-orange-500", title: "Upload Details",    body: "Provide your resume PDF and the job description you are targeting.",                    delay: 0    },
            { bg: "bg-[#F0F7FF] dark:bg-blue-500/10", icon: "radar",            iconColor: "text-blue-500",   title: "Fix ATS Score",     body: "Get your match percentage and instantly apply the suggested keyword fixes.",            delay: 0.1  },
            { bg: "bg-[#F5EEFF] dark:bg-purple-500/10", icon: "record_voice_over", iconColor: "text-purple-500", title: "AI Mock Interview", body: "Start a practice session. The AI will generate questions based on your resume.",       delay: 0.2  },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial="hidden" whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUp}
              transition={{ delay: card.delay }}
              className={`p-6 sm:p-8 rounded-2xl ${card.bg} relative group cursor-pointer hover:shadow-md transition-all`}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center mb-4 sm:mb-6 shadow-sm">
                <span className={`material-symbols-outlined ${card.iconColor}`}>{card.icon}</span>
              </div>
              <div className="absolute top-6 right-6 sm:top-8 sm:right-8 text-gray-400 dark:text-zinc-500 group-hover:text-black dark:group-hover:text-white transition-colors">
                <span className="material-symbols-outlined">north_east</span>
              </div>
              <h3 className="font-bold text-base sm:text-lg text-black dark:text-white mb-2">{card.title}</h3>
              <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed font-medium">{card.body}</p>
            </motion.div>
          ))}
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════
          WHY USE CAREERCOACH
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-10 sm:gap-16">


          {/* Left: image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1 w-full relative min-h-[300px] sm:min-h-[570px]"
          >
            <div className="absolute inset-0 bg-gray-100 dark:bg-zinc-800 rounded-[2rem] transform translate-x-4 translate-y-4 -z-10" />
            <div className="w-full h-[320px] sm:h-[550px] bg-gray-200 dark:bg-zinc-800 rounded-[2rem] overflow-visible relative shadow-lg">
              <img
                src="./user6.jpg"
                alt="Confident Job Seeker"
                className="w-full h-full object-cover object-top rounded-[2rem]"
                loading="eager"
              />


              {/* Floating card 1 */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="absolute top-2 left-2 sm:top-20 sm:left-[-20px] bg-white dark:bg-zinc-900 p-2.5 sm:p-4 rounded-2xl shadow-xl dark:shadow-none border border-gray-100 dark:border-zinc-800 flex items-start gap-2 sm:gap-3 max-w-[150px] sm:max-w-[250px] will-change-transform"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-green-50 dark:bg-green-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-[16px] sm:text-[18px]">check_circle</span>
                </div>
                <div>
                  <p className="text-[11px] sm:text-xs font-bold text-black dark:text-white mb-1">ATS Score: 95%</p>
                  <p className="text-[9px] sm:text-[10px] text-gray-500 dark:text-zinc-400 leading-tight">
                    Great job! Your resume now matches the required keywords.
                  </p>
                </div>
              </motion.div>


              {/* Floating card 2 */}
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.9, duration: 0.4 }}
                className="absolute bottom-2 right-2 sm:bottom-16 sm:right-[-20px] bg-white dark:bg-zinc-900 p-2.5 sm:p-4 rounded-2xl shadow-xl dark:shadow-none border border-gray-100 dark:border-zinc-800 flex items-start gap-2 sm:gap-3 max-w-[150px] sm:max-w-[250px] will-change-transform"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[#6A0DAD] dark:text-purple-400 text-[16px] sm:text-[18px]">campaign</span>
                </div>
                <div>
                  <p className="text-[11px] sm:text-xs font-bold text-black dark:text-white mb-1">Great Answer!</p>
                  <p className="text-[9px] sm:text-[10px] text-gray-500 dark:text-zinc-400 leading-tight">
                    Your explanation of your leadership role was perfectly structured.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>


          {/* Right: text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1 w-full"
          >
            <p className="text-xs font-bold text-[#6A0DAD] dark:text-purple-400 tracking-widest uppercase mb-4">WHY USE CAREERCOACH</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-black dark:text-white leading-tight mb-8 sm:mb-10">
              CareerCoach takes the stress out of interview prep
            </h2>
            <div className="space-y-6 sm:space-y-8">
              {[
                { title: "Beat the ATS bots",              body: "Instantly identify missing keywords and format your resume to ensure it passes automated applicant tracking systems."         },
                { title: "Realistic AI mock interviews",    body: "Practice with an AI that asks tough, relevant questions based entirely on the experience listed in your uploaded resume."   },
                { title: "Actionable improvement feedback", body: "Don't just practice—improve. Get instant, actionable suggestions on how to strengthen weak answers and project explanations." },
              ].map((pt, i) => (
                <div key={i} className="flex items-start gap-3 sm:gap-4">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
                    <span className="material-symbols-outlined text-xs sm:text-sm font-bold">check</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-black dark:text-white text-base sm:text-lg">{pt.title}</h4>
                    <p className="text-gray-600 dark:text-zinc-400 text-sm mt-1 sm:mt-1.5 font-medium leading-relaxed">{pt.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 bg-white dark:bg-zinc-950 transition-colors duration-300">
        <div className="text-center mb-8 sm:mb-12 px-4 sm:px-6">
          <p className="text-xs font-bold text-[#6A0DAD] dark:text-purple-400 tracking-widest uppercase mb-3">Testimonial</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-black dark:text-white">
            What our happy users are <br className="hidden sm:block" /> saying about us
          </h2>
        </div>
        <Marquee gradient={true} gradientColor={[255, 255, 255]} speed={80} pauseOnHover={true}>
          <div className="flex gap-4 sm:gap-6 px-4">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="w-[260px] sm:w-[320px] p-4 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm dark:shadow-none shrink-0 flex flex-col justify-between"
              >
                <div>
                  <div className="flex text-[#FFC53D] text-lg sm:text-xl mb-3 sm:mb-4">
                    {[...Array(5)].map((_, s) => (
                      <span key={s} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <p className="text-gray-700 dark:text-zinc-300 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 font-medium">
                    "{testimonial.text}"
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-auto">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-gray-100 dark:border-zinc-800"
                  />
                  <div>
                    <p className="text-black dark:text-white font-bold text-xs sm:text-sm">{testimonial.name}</p>
                    <p className="text-gray-500 dark:text-zinc-400 text-[10px] sm:text-xs font-medium">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Marquee>
      </section>


    </div>
  );
}