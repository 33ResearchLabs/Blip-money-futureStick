import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Send,
  ArrowDownLeft,
  RefreshCw,
  LogOut,
  Home,
  Activity,
  Wallet,
  User,
  Zap,
  ShieldCheck,
  Smartphone,
  TrendingUp,
  Menu,
  X,
} from "lucide-react";

// --- Visual Effects Components ---

const ParticleBackground = () => {
  const particles = Array.from({ length: 40 });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-[#2BFF88]"
          initial={{
            x:
              Math.random() *
              (typeof window !== "undefined" ? window.innerWidth : 1000),
            y:
              Math.random() *
              (typeof window !== "undefined" ? window.innerHeight : 1000),
            opacity: 0,
            scale: 0,
          }}
          animate={{
            y: [null, Math.random() * -200],
            opacity: [0, 0.4, 0],
            scale: [0, Math.random() * 3 + 1, 0],
          }}
          transition={{
            duration: Math.random() * 7 + 7,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 7,
          }}
          style={{
            width: Math.random() * 3 + 1 + "px",
            height: Math.random() * 3 + 1 + "px",
            filter: "blur(1px)",
          }}
        />
      ))}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(43,255,136,0.05),transparent_75%)]" />
    </div>
  );
};

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-white/5 bg-black/60 supports-[backdrop-filter]:bg-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#2BFF88] shadow-[0_0_10px_#2BFF88] relative z-10" />
            <div className="absolute inset-0 bg-[#2BFF88] rounded-full animate-ping opacity-50" />
          </div>
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Blip.<span className="text-[#2BFF88]">money</span>
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex items-center gap-8 text-sm font-medium text-gray-400">
            <a
              href="#protocol"
              className="hover:text-[#2BFF88] transition-colors"
            >
              Protocol
            </a>
            <a
              href="#merchants"
              className="hover:text-[#2BFF88] transition-colors"
            >
              Merchants
            </a>
            <a
              href="#peoplebank"
              className="hover:text-[#2BFF88] transition-colors"
            >
              PeopleBank
            </a>
          </div>
          <button className="px-5 py-2 rounded-full border border-white/10 text-white text-sm hover:border-[#2BFF88] hover:shadow-[0_0_15px_rgba(43,255,136,0.3)] transition-all bg-black/50 backdrop-blur-sm group">
            <span className="group-hover:text-[#2BFF88] transition-colors">
              Open App
            </span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-white hover:text-[#2BFF88] transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/10"
            >
              <div className="flex flex-col p-6 space-y-4">
                <a
                  href="#protocol"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-400 hover:text-[#2BFF88] transition-colors text-lg py-2"
                >
                  Protocol
                </a>
                <a
                  href="#merchants"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-400 hover:text-[#2BFF88] transition-colors text-lg py-2"
                >
                  Merchants
                </a>
                <a
                  href="#peoplebank"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-400 hover:text-[#2BFF88] transition-colors text-lg py-2"
                >
                  PeopleBank
                </a>
                <button className="w-full px-5 py-3 rounded-full border border-white/10 text-white hover:border-[#2BFF88] hover:shadow-[0_0_15px_rgba(43,255,136,0.3)] transition-all bg-black/50 backdrop-blur-sm mt-2">
                  Open App
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

const PulseWave = () => {
  return (
    <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 -z-10 pointer-events-none opacity-80 mix-blend-screen">
      <svg
        width="100%"
        height="500"
        viewBox="0 0 1440 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0" />
            <stop offset="20%" stopColor="#2BFF88" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#2BFF88" stopOpacity="0.8" />
            <stop offset="80%" stopColor="#2BFF88" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </linearGradient>
          <filter id="strongGlow">
            <feGaussianBlur stdDeviation="25" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          d="M-100,280 C300,200 400,50 720,280 C1040,400 1140,250 1540,280"
          stroke="url(#pulseGradient)"
          strokeWidth="1"
          fill="none"
          filter="url(#strongGlow)"
          className="opacity-30"
        >
          <animate
            attributeName="opacity"
            values="0.3; 0.6; 0.3"
            dur="6s"
            repeatCount="indefinite"
          />
        </path>

        <path
          d="M-100,250 C300,250 400,100 720,250 C1040,400 1140,250 1540,250"
          stroke="url(#pulseGradient)"
          strokeWidth="10"
          fill="none"
          filter="url(#strongGlow)"
          className="opacity-80"
        />

        <circle r="5" fill="white" filter="url(#strongGlow)">
          <animateMotion
            dur="4s"
            repeatCount="indefinite"
            path="M-100,250 C300,250 400,100 720,250 C1040,400 1140,250 1540,250"
            keyPoints="0;1"
            keyTimes="0;1"
            calcMode="linear"
          />
          <animate
            attributeName="opacity"
            values="0; 1; 1; 0"
            dur="4s"
            repeatCount="indefinite"
          />
        </circle>

        <circle
          r="12"
          stroke="#FFD43B"
          strokeWidth="2"
          fill="none"
          opacity="0.8"
        >
          <animateMotion
            dur="4s"
            repeatCount="indefinite"
            path="M-100,250 C300,250 400,100 720,250 C1040,400 1140,250 1540,250"
            keyPoints="0;1"
            keyTimes="0;1"
            calcMode="linear"
          />
          <animate
            attributeName="r"
            values="8;18;8"
            dur="1s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.5;1;0.5"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>

        <circle cx="720" cy="250" r="0" fill="#FF8B1A" opacity="0.8">
          <animate
            attributeName="r"
            values="0;60;0"
            dur="4s"
            begin="1.8s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0;0.8;0"
            dur="4s"
            begin="1.8s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
};

const PhoneMockup = () => {
  return (
    <motion.div
      initial={{ y: 40, opacity: 0, rotateX: 10 }}
      animate={{ y: 0, opacity: 1, rotateX: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="relative mx-auto w-[280px] sm:w-[300px] md:w-[275px] h-[480px] sm:h-[520px] md:h-[540px] lg:h-[600px] bg-[#050505] rounded-[2.5rem] sm:rounded-[3rem] md:rounded-[3.5rem] border border-white/10 shadow-[0_0_60px_-15px_rgba(43,255,136,0.15)] overflow-hidden z-20"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Full screen background image */}
      <img
        src="/home.jpg"
        alt="Home"
        className="absolute inset-0 w-full h-full object-contain rounded-[2.5rem] sm:rounded-[3rem] md:rounded-[3.5rem]"
      />

      {/* Dark overlay for better readability */}
      {/* <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80 rounded-[2.5rem] sm:rounded-[3rem] md:rounded-[3.5rem]" /> */}

      {/* <div className="absolute inset-0 rounded-[3.5rem] ring-1 ring-white/20 pointer-events-none z-50" /> */}
      {/* <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none z-40" /> */}

      <div className="w-full h-full flex flex-col p-4 sm:p-5 md:p-6 pt-10 sm:pt-12 md:pt-14 relative">
        <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[60%] bg-[#2BFF88] opacity-[0.06] blur-[90px] rounded-full pointer-events-none" />

        {/* <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium">
            Crypto Balance — Self Custody
          </p>
        </div> */}

        {/* <div className="relative w-full aspect-[1.4/1] flex flex-col justify-center items-center mb-6 sm:mb-7 md:mb-8">
          <div className="absolute w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-[#2BFF88] rounded-full opacity-[0.08] blur-2xl" />

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-white tracking-tight z-10 relative drop-shadow-lg">
            $23,590
            <span className="text-gray-500 text-2xl sm:text-2xl md:text-3xl">
              .73
            </span>
          </h2>
          <div className="flex items-center gap-2 mt-2 sm:mt-3 z-10 px-2.5 sm:px-3 py-1 rounded-full bg-black/40 border border-white/10 backdrop-blur-md">
            <div className="w-1.5 h-1.5 bg-[#2BFF88] rounded-full animate-pulse shadow-[0_0_5px_#2BFF88]" />
            <span className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-400 font-medium tracking-wide">
              UPDATED JUST NOW
            </span>
          </div>
        </div> */}

        {/* <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mb-6 sm:mb-7 md:mb-8">
          {[
            { icon: Send, label: "Send", active: true },
            { icon: ArrowDownLeft, label: "Request" },
            { icon: RefreshCw, label: "Swap" },
            { icon: LogOut, label: "Cash Out" },
          ].map((action, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-1.5 sm:gap-2 group cursor-pointer"
            >
              <div
                className={`w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                  action.active
                    ? "bg-[#2BFF88]/10 border border-[#2BFF88] text-[#2BFF88] shadow-[0_0_15px_rgba(43,255,136,0.15)]"
                    : "bg-white/5 border border-white/5 text-white group-hover:bg-white/10"
                }`}
              >
                <action.icon
                  className="w-[18px] h-[18px] sm:w-5 sm:h-5 md:w-[22px] md:h-[22px]"
                  strokeWidth={1.5}
                />
              </div>
              <span className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-400 font-medium tracking-wide group-hover:text-white transition-colors">
                {action.label}
              </span>
            </div>
          ))}
        </div> */}

        {/* <div className="flex-grow rounded-t-2xl sm:rounded-t-3xl bg-white/5 border-t border-white/5 p-3 sm:p-4 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <span className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">
              Recent Blips
            </span>
          </div>
          {[1, 2, 3].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2 sm:py-3 border-b border-white/5 last:border-0"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/5 flex items-center justify-center">
                  {i === 0 ? (
                    <ArrowDownLeft
                      size={12}
                      className="sm:w-[14px] sm:h-[14px] text-[#2BFF88]"
                    />
                  ) : (
                    <Send
                      size={12}
                      className="sm:w-[14px] sm:h-[14px] text-white"
                    />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm text-white font-medium">
                    {i === 0 ? "Received USDC" : "Sent SOL"}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-gray-500">
                    2 min ago
                  </span>
                </div>
              </div>
              <span
                className={`text-xs sm:text-sm font-mono ${
                  i === 0 ? "text-[#2BFF88]" : "text-white"
                }`}
              >
                {i === 0 ? "+" : "-"} $120.00
              </span>
            </div>
          ))}
        </div> */}

        <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-18 md:h-20 bg-[#050505]/90 backdrop-blur-xl border-t border-white/5 flex items-center justify-between px-6 sm:px-7 md:px-8 pb-3 sm:pb-4">
          {[Home, Activity, Wallet, User].map((Icon, i) => (
            <div
              key={i}
              className={`flex flex-col items-center gap-0.5 sm:gap-1 ${
                i === 2 ? "text-[#2BFF88]" : "text-gray-500 hover:text-white"
              } transition-colors cursor-pointer`}
            >
              <Icon
                className="w-5 h-5 sm:w-[22px] sm:h-[22px]"
                strokeWidth={1.5}
              />
              {i === 2 && (
                <div className="w-1 h-1 bg-[#2BFF88] rounded-full shadow-[0_0_5px_#2BFF88]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const Hero = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-20">
    <ParticleBackground />
    <div className="absolute top-[20%] right-[-10%] w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] bg-[#FFD43B] opacity-[0.03] blur-[100px] sm:blur-[150px] rounded-full pointer-events-none animate-pulse-slow" />

    <PulseWave />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center relative z-10">
      <div className="text-center lg:text-left pt-6 sm:pt-8 lg:pt-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full border border-[#FFD43B]/20 bg-[#FFD43B]/5 backdrop-blur-sm mb-6 sm:mb-8 hover:bg-[#FFD43B]/10 transition-colors cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD43B] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFD43B]"></span>
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-[#FFD43B] uppercase tracking-wider">
              Protocol V2 Live
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[0.95] mb-6 sm:mb-8 tracking-tight">
            Pay with Crypto Anyone,
            <br />
            Anywhere —<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2BFF88] via-[#2BFF88] to-[#2BFF88]/40 relative inline-block animate-pulse">
              In a Blip.
              <span className="absolute -inset-2 bg-[#2BFF88] opacity-25 blur-xl -z-10"></span>
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 sm:mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed font-light">
            Instant global transfers powered by the decentralized{" "}
            <span className="text-white font-medium">Blip Protocol</span>.
            Crypto native. P2P. Non-custodial.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center lg:justify-start">
            <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-[#2BFF88] text-black font-bold text-base sm:text-lg hover:shadow-[0_0_40px_rgba(43,255,136,0.4)] hover:scale-105 transition-all flex items-center justify-center gap-2 group">
              Open App{" "}
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-full border border-white/20 text-white font-medium hover:bg-white/5 hover:border-white/40 transition-all flex items-center justify-center gap-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-white/30 flex items-center justify-center">
                <div className="w-0 h-0 border-t-[3px] border-t-transparent border-l-[6px] border-l-white border-b-[3px] border-b-transparent ml-0.5"></div>
              </div>
              How Blip Works
            </button>
          </div>
        </motion.div>
      </div>

      <div className="flex justify-center items-center relative perspective-[2000px]">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#2BFF88]/10 to-transparent blur-3xl rounded-full" />
        <PhoneMockup />
      </div>
    </div>
  </section>
);

const StepCard = ({ number, title, desc, icon: Icon, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="relative p-6 sm:p-7 md:p-8 rounded-2xl sm:rounded-3xl bg-[#0A0A0A] border border-white/5 hover:border-[#2BFF88]/30 transition-all group z-10 w-full"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl sm:rounded-3xl" />
    <div className="relative z-10">
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#111] border border-white/10 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform group-hover:border-[#2BFF88] shadow-lg">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-[#2BFF88] transition-colors" />
      </div>
      <div className="text-[#2BFF88] font-mono text-xs sm:text-sm mb-2 tracking-wider">
        STEP 0{number}
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">
        {title}
      </h3>
      <p className="text-gray-400 leading-relaxed text-sm">{desc}</p>
    </div>
    <div className="absolute -inset-[1px] bg-gradient-to-br from-[#2BFF88] to-transparent rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-20 blur-sm transition-opacity -z-10" />
  </motion.div>
);

const CheckCircle = ({ size, className }: any) => (
  <div className={`relative ${className}`}>
    <div className="absolute inset-0 bg-[#2BFF88] rounded-full opacity-20 animate-ping" />
    <Smartphone size={size} />
  </div>
);

const HowItWorks = () => {
  return (
    <section className="py-16 sm:py-24 md:py-32 bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="text-center mb-12 sm:mb-16 md:mb-24">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
            How Blip Works
          </h2>
          <p className="text-sm sm:text-base text-gray-400 max-w-xl mx-auto px-4">
            Seamless movement from fiat to crypto and back again. Just follow
            the blip.
          </p>
        </div>

        <div className="relative flex flex-col md:flex-row justify-between items-stretch gap-6 sm:gap-8">
          <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-[100px] pointer-events-none z-0">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 800 100"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M0,50 C200,50 200,50 400,50 C600,50 600,50 800,50"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
                strokeDasharray="5 5"
              />
              <path
                d="M0,50 C200,50 200,50 400,50 C600,50 600,50 800,50"
                stroke="url(#lineGradient)"
                strokeWidth="2"
                fill="none"
                className="opacity-50"
              />
              <defs>
                <linearGradient
                  id="lineGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#2BFF88" stopOpacity="0" />
                  <stop offset="50%" stopColor="#2BFF88" stopOpacity="1" />
                  <stop offset="100%" stopColor="#2BFF88" stopOpacity="0" />
                </linearGradient>
              </defs>
              <circle r="4" fill="#2BFF88" filter="url(#glow)">
                <animateMotion
                  dur="3s"
                  repeatCount="indefinite"
                  path="M0,50 C200,50 200,50 400,50 C600,50 600,50 800,50"
                />
              </circle>
            </svg>
          </div>

          <StepCard
            number="1"
            title="Load Crypto"
            desc="Deposit USDT/USDC directly from your bank or cash-in at local merchants."
            icon={Wallet}
            delay={0}
          />
          <StepCard
            number="2"
            title="Send in a Blip"
            desc="Instant P2P routing finds the fastest, cheapest path on-chain."
            icon={Zap}
            delay={0.2}
          />
          <StepCard
            number="3"
            title="Receive Instantly"
            desc="Recipient gets funds instantly. Keep in crypto or cash out locally."
            icon={CheckCircle}
            delay={0.4}
          />
        </div>
      </div>
    </section>
  );
};

const Comparison = () => (
  <section className="py-16 sm:py-20 md:py-24 bg-[#050505] border-y border-white/5">
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            Built for <span className="text-[#2BFF88]">Speed</span>
          </h2>
          <p className="text-gray-400 mb-6 sm:mb-8 text-base sm:text-lg">
            Banks sleep. Blockchain doesn't. Blip abstracts the complexity of
            crypto to deliver settlement speeds that feel like magic.
          </p>

          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#2BFF88]/10 flex items-center justify-center text-[#2BFF88] flex-shrink-0">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm sm:text-base">
                  400ms Settlement
                </h4>
                <p className="text-xs sm:text-sm text-gray-500">
                  Solana mainnet finality
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FFD43B]/10 flex items-center justify-center text-[#FFD43B] flex-shrink-0">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm sm:text-base">
                  Non-Custodial
                </h4>
                <p className="text-xs sm:text-sm text-gray-500">
                  Smart contract escrow
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0A0A0A] p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/5 relative overflow-hidden mt-8 lg:mt-0">
          <h3 className="text-white font-bold mb-6 sm:mb-8 text-base sm:text-lg">
            Speed Comparison
          </h3>

          <div className="space-y-5 sm:space-y-6">
            <div>
              <div className="flex justify-between text-xs sm:text-sm text-gray-400 mb-2">
                <span className="text-white font-medium flex items-center gap-1.5 sm:gap-2">
                  Blip{" "}
                  <Zap className="w-3 h-3 sm:w-[12px] sm:h-[12px] text-[#2BFF88]" />
                </span>
                <span className="text-[#2BFF88]">~0.4s</span>
              </div>
              <div className="h-3 sm:h-4 bg-white/5 rounded-full overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="absolute top-0 left-0 h-full bg-[#2BFF88] shadow-[0_0_10px_#2BFF88]"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs sm:text-sm text-gray-400 mb-2">
                <span>Remittance Apps</span>
                <span className="text-xs sm:text-sm">1-2 Hours</span>
              </div>
              <div className="h-3 sm:h-4 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "60%" }}
                  transition={{ duration: 1.5, delay: 0.4 }}
                  className="h-full bg-white/20"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs sm:text-sm text-gray-400 mb-2">
                <span>Banks (SWIFT)</span>
                <span className="text-xs sm:text-sm">2-5 Days</span>
              </div>
              <div className="h-3 sm:h-4 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "15%" }}
                  transition={{ duration: 2, delay: 0.6 }}
                  className="h-full bg-white/10"
                />
              </div>
            </div>
          </div>

          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />
        </div>
      </div>
    </div>
  </section>
);

const ProtocolNode = ({ cx, cy, label }: any) => (
  <g>
    <circle
      cx={cx}
      cy={cy}
      r="20"
      fill="#0A0A0A"
      stroke="rgba(255,255,255,0.1)"
      strokeWidth="1"
    />
    <circle cx={cx} cy={cy} r="6" fill="#2BFF88" className="animate-pulse" />
    <text
      x={cx}
      y={cy + 35}
      textAnchor="middle"
      fill="white"
      fontSize="10"
      fontFamily="monospace"
      opacity="0.7"
    >
      {label}
    </text>
  </g>
);

const ProtocolSection = () => (
  <section id="protocol" className="py-16 sm:py-24 md:py-32 bg-black relative">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center mb-12 sm:mb-16">
      <span className="text-[#FFD43B] text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase mb-3 sm:mb-4 block">
        The Backbone
      </span>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
        The Blip Protocol
      </h2>
    </div>

    <div className="w-full h-[250px] sm:h-[350px] md:h-[400px] relative overflow-hidden flex items-center justify-center mb-8 sm:mb-10 md:mb-12 px-4">
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10" />
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 800 400"
        className="opacity-80 max-w-3xl"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          d="M400,200 L200,100"
          stroke="rgba(43,255,136,0.1)"
          strokeWidth="1"
        />
        <path
          d="M400,200 L600,100"
          stroke="rgba(43,255,136,0.1)"
          strokeWidth="1"
        />
        <path
          d="M400,200 L200,300"
          stroke="rgba(43,255,136,0.1)"
          strokeWidth="1"
        />
        <path
          d="M400,200 L600,300"
          stroke="rgba(43,255,136,0.1)"
          strokeWidth="1"
        />

        <path
          d="M200,100 L400,200 L600,300"
          stroke="url(#activePathGrad)"
          strokeWidth="2"
          fill="none"
        />
        <defs>
          <linearGradient id="activePathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2BFF88" stopOpacity="0" />
            <stop offset="50%" stopColor="#2BFF88" stopOpacity="1" />
            <stop offset="100%" stopColor="#2BFF88" stopOpacity="0" />
          </linearGradient>
        </defs>

        <circle r="3" fill="#fff">
          <animateMotion
            dur="2s"
            repeatCount="indefinite"
            path="M200,100 L400,200 L600,300"
          />
        </circle>

        <ProtocolNode cx="400" cy="200" label="Core Router" />
        <ProtocolNode cx="200" cy="100" label="Merchant Node A" />
        <ProtocolNode cx="600" cy="100" label="Wallet B" />
        <ProtocolNode cx="200" cy="300" label="User C" />
        <ProtocolNode cx="600" cy="300" label="Liquidity Pool" />
      </svg>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 text-center">
      {[
        {
          title: "Decentralized Routing",
          desc: "No central server. Pure P2P logic.",
        },
        {
          title: "Liquidity Efficient",
          desc: "Just-in-time provisioning via pools.",
        },
        { title: "Permissionless", desc: "Anyone can run a node and earn." },
      ].map((item, i) => (
        <div key={i} className="p-4 sm:p-6">
          <h3 className="text-white font-bold text-base sm:text-lg mb-2">
            {item.title}
          </h3>
          <p className="text-gray-500 text-xs sm:text-sm">{item.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

const NeonRing = ({ size, color, duration, reverse }: any) => (
  <div
    className="absolute rounded-full border border-dashed opacity-30 animate-spin"
    style={{
      width: size,
      height: size,
      borderColor: color,
      animationDuration: `${duration}s`,
      animationDirection: reverse ? "reverse" : "normal",
      boxShadow: `0 0 20px ${color}20`,
    }}
  />
);

const PeopleBank = () => (
  <section
    id="peoplebank"
    className="py-16 sm:py-24 md:py-32 relative overflow-hidden bg-[#020202]"
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
      <div className="relative h-[300px] sm:h-[400px] md:h-[500px] flex items-center justify-center order-2 lg:order-1">
        <div
          className="relative w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] flex items-center justify-center [transform:rotateX(60deg)_rotateZ(-20deg)]"
          style={{ transformStyle: "preserve-3d" }}
        >
          <NeonRing size="100%" color="#2BFF88" duration={20} />
          <NeonRing size="70%" color="#FFD43B" duration={15} reverse />
          <NeonRing size="40%" color="#2BFF88" duration={10} />

          <div className="absolute w-16 h-16 sm:w-20 sm:h-20 bg-[#2BFF88] rounded-full blur-xl opacity-20 animate-pulse" />
          <div className="absolute w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-[0_0_30px_#2BFF88]" />

          <div className="absolute inset-0 flex items-center justify-center [transform:rotateX(-60deg)]">
            <div className="flex flex-col items-center gap-1 animate-float">
              <div className="text-[#2BFF88] font-mono text-[10px] sm:text-xs">
                +12.4% APY
              </div>
              <div className="w-[1px] h-8 sm:h-10 bg-gradient-to-t from-[#2BFF88] to-transparent" />
            </div>
          </div>
        </div>
      </div>

      <div className="order-1 lg:order-2">
        <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full border border-[#2BFF88]/20 bg-[#2BFF88]/5 mb-4 sm:mb-6">
          <TrendingUp className="w-3 h-3 sm:w-[14px] sm:h-[14px] text-[#2BFF88]" />
          <span className="text-[10px] sm:text-xs font-bold text-[#2BFF88] uppercase tracking-wider">
            Earn While You Sleep
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
          PeopleBank Liquidity
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-6 sm:mb-8 font-light">
          Be the bank. Deposit USDC/USDT into liquidity pools to facilitate
          instant transfers and earn yield from transaction volume.
        </p>

        <div className="space-y-3 sm:space-y-4">
          {[
            {
              label: "Total Value Locked",
              val: "$142.5M",
              color: "text-white",
            },
            { label: "24h Volume", val: "$2.1B", color: "text-white" },
            { label: "Current APY", val: "12.4%", color: "text-[#2BFF88]" },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors"
            >
              <span className="text-gray-400 text-sm sm:text-base">
                {stat.label}
              </span>
              <span
                className={`text-lg sm:text-xl font-mono font-bold ${stat.color}`}
              >
                {stat.val}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const AppScreens = () => {
  return (
    <section className="py-16 sm:py-24 md:py-32 bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12 sm:mb-16 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">
          One App. Total Control.
        </h2>
        <p className="text-sm sm:text-base text-gray-500">
          Minimal by design. Powerful by nature.
        </p>
      </div>

      <div className="flex flex-row md:justify-center gap-6 sm:gap-8 px-4 sm:px-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide">
        {[
          { title: "My Ads", color: "from-black to-black", img: "/myads.jpg" },
          {
            title: "P2P",
            color: "from-black to-[#2BFF88]/10",
            img: "/p2p.jpg",
          },
          {
            title: "Profile",
            color: "from-black to-[#FFD43B]/10",
            img: "/profile.jpg",
          },
        ].map((screen, i) => (
          <div
            key={i}
            className={`min-w-[240px] sm:min-w-[260px] md:min-w-[230px] h-[420px] sm:h-[460px] md:h-[500px] rounded-[2.5rem] sm:rounded-[3rem] border border-white/10 relative overflow-hidden snap-center group hover:-translate-y-2 transition-transform duration-500 flex-shrink-0`}
          >
            {/* Full screen background image */}
            <img
              src={screen.img}
              alt={screen.title}
              className="absolute inset-0 w-full h-full object-contain rounded-[3rem] sm:rounded-[4rem]"
            />

            {/* Dark overlay for better readability */}
            {/* <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 rounded-[2.5rem] sm:rounded-[3rem]" /> */}

            {/* Top bar */}
            {/* <div className="relative w-16 h-5 sm:w-20 sm:h-6 rounded-full bg-white/10 backdrop-blur-sm mx-auto mt-5 sm:mt-6 border border-white/20" /> */}

            {/* Title */}
            <div className="absolute bottom-5 sm:bottom-6 left-0 right-0 text-center">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white drop-shadow-lg group-hover:text-[#2BFF88] transition-colors">
                {screen.title}
              </span>
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-[2.5rem] sm:rounded-[3rem]" />
          </div>
        ))}
      </div>
    </section>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#2BFF88] selection:text-black overflow-x-hidden">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Comparison />
      <ProtocolSection />
      <PeopleBank />
      <AppScreens />

      <section className="py-16 sm:py-20 md:py-24 text-center border-t border-white/5 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#111] to-black opacity-50" />
        <div className="relative z-10 px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">
            Comming soon in 12 Countries
          </h2>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-2xl mx-auto">
            {[
              "UAE",
              "India",
              "Philippines",
              "Brazil",
              "Nigeria",
              "Vietnam",
            ].map((country) => (
              <div
                key={country}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/10 bg-white/5 text-xs sm:text-sm text-gray-300 flex items-center gap-1.5 sm:gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#2BFF88] animate-pulse" />
                {country}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
