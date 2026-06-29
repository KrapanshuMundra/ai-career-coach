import {React,useState,useRef,useEffect} from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import MarqueePackage from "react-fast-marquee";
import { motion } from "framer-motion";

const Marquee = MarqueePackage.default || MarqueePackage;

export default function Home() {
  const { currentUser } = useAuth();

  const testimonials = [
    { name: "Nitin Chauhan.", role: "Software Engineer", text: "The ATS feedback told me exactly what keywords I was missing. The mock interview sealed the deal.", image: "/user1.jpg" },
    { name: "Evanya David.", role: "HR Specialist", text: "Practicing with the AI interviewer gave me so much confidence. It asked questions directly from my CV!", image: "/user4.jpg" },
    { name: "Sahil Katariya.", role: "Product Designer", text: "Got two interview invites the same week I used this tool to fix my ATS score. It really works!", image: "/user2.jpg" },
    { name: "Shivam Tiwari.", role: "Business Analyst", text: "Best career prep tool I've tried. It made my CV sound more confident and focused.", image: "/user3.jpg" },
    { name: "Maitri Patel.", role: "Project Coordinator", text: "Simple, fast, and effective. The interview feedback was spot on.", image: "/user5.jpg" }
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };
  const ATSScoreReveal = () => {
  const [score, setScore] = useState(0);
  const CIRC = 339.3; const TARGET = 73;
  useEffect(() => {
    let start = null; const dur = 1600;
    const ease = t => 1 - Math.pow(1 - t, 3);
    const tick = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      setScore(Math.round(TARGET * ease(p)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);
  return (
    <div className="flex flex-col items-center pt-7 pb-5 px-6">
      
      <div className="relative w-[120px] h-[120px]">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 130 130">
          <circle cx="65" cy="65" r="54" stroke="#f3f4f6" strokeWidth="9" fill="none" />
          <circle cx="65" cy="65" r="54" stroke="#6A0DAD" strokeWidth="9" fill="none"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC - (CIRC * score / 100)}
            style={{ transition: "stroke-dashoffset 0.05s linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[34px] font-black text-[#6A0DAD] leading-none tracking-tight">{score}</span>
          <span className="text-[10px] font-bold text-gray-400 mt-1">/ 100</span>
        </div>
      </div>
    </div>
  );
};

const chips = [
  { label: "+ Docker",                 cls: "bg-green-50 text-green-700",  delay: 900  },
  { label: "+ Kubernetes",             cls: "bg-green-50 text-green-700",  delay: 1000 },
  { label: '~ "led" → "spearheaded"', cls: "bg-amber-50 text-amber-700",  delay: 1100 },
  { label: "✓ Python",                 cls: "bg-purple-50 text-purple-700", delay: 1200 },
  { label: "✓ REST API",               cls: "bg-purple-50 text-purple-700", delay: 1300 },
];

const KeywordReveal = () => (
  <div className="px-6 pb-4">
    
    <div className="flex flex-wrap gap-1.5">
      {chips.map((c, i) => (
        <motion.span key={i} initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: c.delay / 1000, duration: 0.3 }}
          className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${c.cls}`}>
          {c.label}
        </motion.span>
      ))}
    </div>
  </div>
);

const bars = [
  { label: "Technical Accuracy",    score: 16, pct: 80, delay: 0.7 },
  { label: "Communication Clarity", score: 14, pct: 70, delay: 0.85 },
  { label: "Problem-Solving",       score: 15, pct: 75, delay: 1.0 },
];

const BreakdownBars = () => (
  <div className="px-6 pb-4 border-t border-gray-50 pt-4">
    
    <div className="space-y-2.5">
      {bars.map((b, i) => (
        <div key={i}>
          <div className="flex justify-between mb-1">
            <span className="text-[11px] font-semibold text-gray-600">{b.label}</span>
            <span className="text-[11px] font-black text-[#6A0DAD]">{b.score}<span className="text-gray-400 font-semibold">/20</span></span>
          </div>
          <div className="h-[5px] bg-gray-100 rounded-full overflow-hidden">
            <motion.div className="h-full bg-[#6A0DAD] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${b.pct}%` }}
              transition={{ delay: b.delay, duration: 0.9, ease: "easeOut" }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ChatSnippet = () => (
  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1.6, duration: 0.4 }}
    className="px-6 pb-6 pt-4 border-t border-gray-50"
  >
    
    <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-bl-sm p-3 text-[11.5px] text-gray-600 font-medium leading-relaxed mb-2">
      "Walk me through the architecture of your most recent backend project."
    </div>
    <div className="bg-purple-50 rounded-2xl rounded-tl-sm p-3 flex gap-2 items-start">
      <span className="text-[9px] font-black bg-[#6A0DAD] text-white px-1.5 py-0.5 rounded mt-0.5 shrink-0">AI</span>
      <p className="text-[11px] text-purple-700 font-medium leading-relaxed">
        Good structure. Quantify the impact — "handled 50K req/day" beats "high traffic." Add the tech stack you chose and why.
      </p>
    </div>
  </motion.div>
);

  return (
    <div className="w-full bg-white min-h-screen font-['Inter',sans-serif] text-gray-900 overflow-hidden">

      {/* ============================================================ */}
      {/* 🚀 REDESIGNED HERO — CLEAN SPLIT WITH PHONE DASHBOARD MOCKUP */}
      {/* ============================================================ */}
      <section className="relative w-full pt-4 pb-0 overflow-hidden">

        {/* Soft purple glow — right side only */}
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-purple-400/10 blur-[160px] rounded-full pointer-events-none" />

       <div className="max-w-[1180px] mx-auto px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-0 relative z-10">

          {/* ── LEFT COLUMN ── */}
          <motion.div
            className="flex-1 py-8 pr-0 lg:pr-16 text-center lg:text-left"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Badge */}
            <motion.div variants={fadeUp} className="flex justify-center lg:justify-start mb-7">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 text-[11px] font-bold text-[#6A0DAD] uppercase tracking-widest">
                <span className="relative flex h-[7px] w-[7px]">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6A0DAD] opacity-40"></span>
                  <span className="relative inline-flex rounded-full h-[7px] w-[7px] bg-[#6A0DAD]"></span>
                </span>
                CareerCoach AI 2.0
              </span>
            </motion.div>

            {/* Headline — NO highlight boxes, clean gradient on second line */}
            <motion.h1
              variants={fadeUp}
              className="text-5xl md:text-6xl lg:text-[58px] font-black tracking-[-0.03em] text-black leading-[1.08] mb-5"
            >
              Master the interview.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6A0DAD] to-[#9D4EDD]">
                Starting with your resume.
              </span>
            </motion.h1>

            {/* Subtext — more breathing room */}
            <motion.p
              variants={fadeUp}
              className="text-[16px] text-gray-500 max-w-[440px] mx-auto lg:mx-0 font-normal leading-relaxed mb-10"
            >
              Upload your resume, unlock your ATS score with actionable fixes, and practice with our AI interviewer — all tailored to your target job.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap justify-center lg:justify-start gap-3 mb-12"
            >
              <Link
                to={currentUser ? "/evaluator" : "/signup"}
                className="inline-flex items-center gap-2 px-7 py-[14px] rounded-full font-bold text-[15px] text-white bg-[#6A0DAD] hover:bg-[#580b94] transition-all shadow-[0_8px_24px_rgba(106,13,173,0.22)] hover:-translate-y-0.5 active:scale-95"
              >
                {currentUser ? "Go to Dashboard" : "Start For Free"}
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
              <Link
                to={currentUser ? "/evaluator" : "/login"}
                className="inline-flex items-center gap-2 px-7 py-[14px] rounded-full font-semibold text-[15px] text-gray-700 bg-white border-[1.5px] border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all active:scale-95"
              >
                
                See How It Works
              </Link>
            </motion.div>

            {/* Social proof — more prominent placement, stars above */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col lg:flex-row items-center lg:items-start gap-3"
            >
              <div className="flex -space-x-2">
  {[1, 2, 3, 4].map((n) => (
    <img
      key={n}
      src={`/user${n}.jpg`}
      alt={`User ${n}`}
      className="w-9 h-9 rounded-full border-[2.5px] border-white object-cover"
    />
  ))}
  <div className="w-9 h-9 rounded-full border-[2.5px] border-white bg-gray-100 flex items-center justify-center text-[9px] font-bold text-gray-500">
    100+
  </div>
</div>
              <div className="text-center lg:text-left">
                <div className="text-[#f59e0b] text-sm tracking-wide mb-0.5">★★★★★</div>
                <p className="text-[13px] text-gray-500 font-medium">
                  <span className="text-gray-800 font-bold">1,200+ professionals</span> landed interviews
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* ── RIGHT COLUMN: Animated Score Reveal ── */}
<motion.div
  initial={{ x: 60, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ type: "spring", stiffness: 50, damping: 16, delay: 0.2 }}
  className="relative flex-shrink-0 w-full lg:w-[600px] flex items-center justify-center py-8 self-stretch"
>
  {/* Purple glow */}
  <div className="absolute inset-0 bg-[#6A0DAD]/8 blur-[100px] rounded-full pointer-events-none" />

  {/* Card */}
  <div className="relative z-10 w-full bg-white rounded-[2rem] border border-gray-100 shadow-[0_24px_60px_rgba(106,13,173,0.10),0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden mb-8">

    {/* LEFT: Score ring */}
<div className="flex flex-row h-full">
  
  <div className="flex flex-col items-center justify-center px-6 py-6 border-r border-gray-100 min-w-[160px]">
    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">ATS Score</p>
    <ATSScoreReveal />
  </div>

  {/* RIGHT: Everything else stacked */}
  <div className="flex-1 flex flex-col justify-between px-5 py-5 gap-4">
    
    {/* Keywords */}
    <div>
      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Missing keywords</p>
      <KeywordReveal />
    </div>

    {/* Bars */}
    <div>
      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Interview breakdown</p>
      <BreakdownBars />
    </div>

    {/* Chat */}
    <div>
      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Mock interview feedback</p>
      <ChatSnippet />
    </div>

  </div>
</div>
  </div>
</motion.div>

        </div>
      </section>

      {/* CONTINUOUS SCROLL: COMPANIES */}
      <section className="py-6 bg-white border-b border-gray-100 relative z-40">
        <p className="text-center text-[11px] text-gray-400 font-medium mb-5 uppercase tracking-widest">
          Helping users land jobs at
        </p>
        <Marquee gradient={true} gradientColor={[255, 255, 255]} speed={80}>
          <div className="flex items-center gap-16 px-8">
            {["TCS", "Infosys", "Google", "Deloitte", "Bolt", "L & T", "Microsoft", "Wipro", "Accenture"].map((c) => (
              <span key={c} className="text-[15px] font-bold text-gray-300 tracking-wide">{c}</span>
            ))}
          </div>
        </Marquee>
      </section>

      {/* HOW IT WORKS (Pastel Cards) */}
      <section className="py-24 max-w-6xl mx-auto px-6 lg:px-12">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-black">How it Works</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} className="p-8 rounded-2xl bg-[#FFF6EF] relative group cursor-pointer hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm">
              <span className="material-symbols-outlined text-orange-500">upload_file</span>
            </div>
            <div className="absolute top-8 right-8 text-gray-400 group-hover:text-black transition-colors">
              <span className="material-symbols-outlined">north_east</span>
            </div>
            <h3 className="font-bold text-lg text-black mb-2">Upload Details</h3>
            <p className="text-sm text-gray-600 leading-relaxed font-medium">Provide your resume PDF and the job description you are targeting.</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} transition={{ delay: 0.1 }} className="p-8 rounded-2xl bg-[#F0F7FF] relative group cursor-pointer hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm">
              <span className="material-symbols-outlined text-blue-500">radar</span>
            </div>
            <div className="absolute top-8 right-8 text-gray-400 group-hover:text-black transition-colors">
              <span className="material-symbols-outlined">north_east</span>
            </div>
            <h3 className="font-bold text-lg text-black mb-2">Fix ATS Score</h3>
            <p className="text-sm text-gray-600 leading-relaxed font-medium">Get your match percentage and instantly apply the suggested keyword fixes.</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} transition={{ delay: 0.2 }} className="p-8 rounded-2xl bg-[#F5EEFF] relative group cursor-pointer hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm">
              <span className="material-symbols-outlined text-purple-500">record_voice_over</span>
            </div>
            <div className="absolute top-8 right-8 text-gray-400 group-hover:text-black transition-colors">
              <span className="material-symbols-outlined">north_east</span>
            </div>
            <h3 className="font-bold text-lg text-black mb-2">AI Mock Interview</h3>
            <p className="text-sm text-gray-600 leading-relaxed font-medium">Start a practice session. The AI will generate questions based on your resume.</p>
          </motion.div>
        </div>
      </section>

      {/* WHY USE CAREERCOACH */}
      <section className="py-20 max-w-6xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-16">

          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="flex-1 w-full relative min-h-[570px]">
            <div className="absolute inset-0 bg-gray-100 rounded-[2rem] transform translate-x-4 translate-y-4 -z-10"></div>
            <div className="w-full h-[550px] bg-gray-200 rounded-[2rem] overflow-visible relative shadow-lg">
              <img
  src="https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?q=80&w=1000&auto=format&fit=crop"
  alt="Confident Job Seeker"
  className="w-full h-full object-cover rounded-[2rem]"
  loading="eager"
/>
              <motion.div
  initial={{ opacity: 0, x: -10 }}
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: true }}
  transition={{ delay: 0.6, duration: 0.4 }}
  className="absolute top-20 left-[-20px] bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-start gap-3 max-w-[250px] will-change-transform"
>
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-green-600 text-[18px]">check_circle</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-black mb-1">ATS Score: 95%</p>
                  <p className="text-[10px] text-gray-500 leading-tight">Great job! Your resume now matches the required keywords.</p>
                </div>
              </motion.div>
              <motion.div
  initial={{ opacity: 0, x: 10 }}
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: true }}
  transition={{ delay: 0.9, duration: 0.4 }}
  className="absolute bottom-16 right-[-20px] bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-start gap-3 max-w-[250px] will-change-transform"
>
                <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[#6A0DAD] text-[18px]">campaign</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-black mb-1">Great Answer!</p>
                  <p className="text-[10px] text-gray-500 leading-tight">Your explanation of your leadership role was perfectly structured.</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="flex-1">
            <p className="text-xs font-bold text-[#6A0DAD] tracking-widest uppercase mb-4">WHY USE CAREERCOACH</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-black leading-tight mb-10">
              CareerCoach takes the stress out of interview prep
            </h2>
            <div className="space-y-8">
              {[
                { title: "Beat the ATS bots", body: "Instantly identify missing keywords and format your resume to ensure it passes automated applicant tracking systems." },
                { title: "Realistic AI mock interviews", body: "Practice with an AI that asks tough, relevant questions based entirely on the experience listed in your uploaded resume." },
                { title: "Actionable improvement feedback", body: "Don't just practice—improve. Get instant, actionable suggestions on how to strengthen weak answers and project explanations." },
              ].map((pt, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
                    <span className="material-symbols-outlined text-sm font-bold">check</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-black text-lg">{pt.title}</h4>
                    <p className="text-gray-600 text-sm mt-1.5 font-medium leading-relaxed">{pt.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-white">
        <div className="text-center mb-12 px-6">
          <p className="text-xs font-bold text-[#6A0DAD] tracking-widest uppercase mb-3">Testimonial</p>
          <h2 className="text-3xl font-extrabold text-black">What our happy users are <br /> saying about us</h2>
        </div>
        <Marquee gradient={true} gradientColor={[255, 255, 255]} speed={80} pauseOnHover={true}>
          <div className="flex gap-6 px-4">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="w-[320px] p-6 rounded-2xl bg-white border border-gray-200 shadow-sm shrink-0 flex flex-col justify-between">
                <div>
                  <div className="flex text-[#FFC53D] text-xl mb-4">
                    {[...Array(5)].map((_, s) => (
                      <span key={s} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-6 font-medium">"{testimonial.text}"</p>
                </div>
                <div className="flex items-center gap-3 mt-auto">
                  <img src={testimonial.image} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                  <div>
                    <p className="text-black font-bold text-sm">{testimonial.name}</p>
                    <p className="text-gray-500 text-xs font-medium">{testimonial.role}</p>
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