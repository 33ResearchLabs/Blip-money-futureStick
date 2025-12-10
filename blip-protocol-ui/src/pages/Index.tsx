import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Activity,
  Wallet,
  ShieldCheck,
  Smartphone,
  X,
  Coffee,
  Users,
  Hexagon,
  Utensils,
  MapPin,
  ShoppingBag,
  Car,
  Gem,
  Package,
  Truck,
  Handshake,
  Store,
  Lock,
  CreditCard,
  Building2,
  Landmark,
  Menu,
  Zap,
  Layers,
} from "lucide-react";
import { SocialSidebar } from "@/components/SocialSidebar";
import { Link } from "react-router-dom";
import TransferFlow from "@/components/TransferFlow";
import useScrollActive from "@/hooks/useScrollActive";
import ScrollReveal from "@/components/ScrollReveal";
import { SectionLabel } from "@/components/SectionLable";

// --- Visual Effects Components ---

// Button UI
const Button = ({ children, primary = false, className = "" }) => (
  <button
    className={`
      relative overflow-hidden px-8 py-4 rounded-full font-bold tracking-wide transition-all duration-300 group cursor-pointer
      ${
        primary
          ? "bg-[#00FF94] text-black hover:bg-[#00cc76] hover:shadow-[0_0_40px_rgba(0,255,148,0.5)]"
          : "bg-transparent border border-[#333] text-white hover:border-[#00FF94] hover:text-[#00FF94] hover:shadow-[0_0_20px_rgba(0,255,148,0.2)]"
      }
      ${className}
    `}
  >
    <span className="relative z-10 flex items-center gap-2">{children}</span>
    {primary && (
      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 backdrop-blur-sm" />
    )}
  </button>
);

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

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-white/5 bg-black/60 supports-[backdrop-filter]:bg-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <div className="relative">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#2BFF88] shadow-[0_0_10px_#2BFF88] relative z-10" />
            <div className="absolute inset-0 bg-[#2BFF88] rounded-full animate-ping opacity-50" />
          </div>
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Blip.<span className="text-[#2BFF88]">money</span>
          </span>
        </a>

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
            <a
              href="/tokenomics"
              className="hover:text-[#2BFF88] transition-colors"
            >
              Tokenomics
            </a>
          </div>
          <a href="/comming-soon">
            <button className="px-5 py-2 rounded-full border border-white/10 text-white text-sm hover:border-[#2BFF88] hover:shadow-[0_0_15px_rgba(43,255,136,0.3)] transition-all bg-black/50 backdrop-blur-sm group">
              <span className="group-hover:text-[#2BFF88] transition-colors">
                Open App
              </span>
            </button>
          </a>
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

const PhoneMockup = () => (
  <div
    className="mt-20 md:mt-0 flex justify-center md:justify-end animate-fade-in"
    style={{ animationDelay: "0.1s" }}
  >
    {/* GLOW WRAPPER */}
    <div className="relative">
      {/* Outer green glow aura */}
      <div className="absolute inset-0  blur-md bg-green-500/20"></div>

      {/* PHONE FRAME */}
      <div className="relative items-center justify-center  w-60 h-[455px] rounded-[2rem] overflow-hidden shadow-[0_0_60px_15px_rgba(0,255,127,0.25)] bg-green-500/20  p-0.5">
        {/* INNER SCREEN (your image) */}
        <img
          src="home.png"
          alt="app-screen"
          className="w-full h-full object-cover "
        />
      </div>
    </div>
  </div>
);

// const ArchitectureNode = ({
//   step,
//   title,
//   sub,
//   icon: Icon,
//   color,
//   className = "",
//   delay = 0,
//   isMain = false,
// }) => {
//   const shadowStyle = {
//     "--node-color": color,
//     animationDelay: `${delay}ms`,
//   };

//   const ringClass = isMain
//     ? `ring-4 ring-offset-4 ring-offset-[#080808] ring-[${color}]/30`
//     : "ring-2 ring-gray-700/50";
//   const bgColor = isMain ? "bg-[#0F0F0F]" : "bg-[#151515]";

//   return (
//     <div
//       className={`p-6 w-56 rounded-2xl border border-white/10 flex flex-col items-center text-center transition-all duration-500 ease-out hover:shadow-lg ${bgColor} ${className}`}
//       style={shadowStyle}
//     >
//       <div
//         className={`p-3 rounded-full ${bgColor} border border-white/10 mb-4 ${ringClass}`}
//       >
//         <Icon size={28} style={{ color }} />
//       </div>
//       <p className="text-sm font-medium text-gray-400 uppercase mb-1">
//         Step {step}
//       </p>
//       <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
//       <p className="text-xs text-gray-500">{sub}</p>
//     </div>
//   );
// };

// --- Main Application Component ---

const styles = {
  gridBackground: {
    backgroundImage: `radial-gradient(circle, #333333 1px, transparent 1px), radial-gradient(circle, #333333 1px, transparent 1px)`,
    backgroundSize: "40px 40px",
    backgroundPosition: "0 0, 20px 20px",
  },
};

const stylesPeopleBank = {
  gridBackground: {
    backgroundImage: `linear-gradient(to right, #00FF9422 1px, transparent 1px),
                      linear-gradient(to bottom, #00FF9422 1px, transparent 1px)`,
    backgroundSize: "20px 20px",
  },
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
              Protocol Live
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-[0.95] mb-6 sm:mb-8 tracking-tight">
            Pay with Crypto
            <br />
            Anyone,
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
            <Link to="/comming-soon">
              <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-[#2BFF88] text-black font-bold text-base sm:text-lg hover:shadow-[0_0_40px_rgba(43,255,136,0.4)] hover:scale-105 transition-all flex items-center justify-center gap-2 group">
                Open App{" "}
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
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

const CinematicCard = ({ title, subtitle, icon: Icon, delay, active }) => (
  <div
    className={`
      relative group h-60 overflow-hidden rounded-2xl bg-[#080808] border transition-all duration-500 flex flex-col justify-between p-8
      ${
        active
          ? "border-[#00FF94] shadow-[0_0_30px_rgba(0,255,148,0.15)]"
          : "border-white/5 hover:border-[#00FF94] hover:shadow-[0_0_30px_rgba(0,255,148,0.15)]"
      }
    `}
    style={{ animationDelay: `${delay}ms` }}
  >
    {/* Background Glow */}
    <div
      className={`absolute inset-0 bg-gradient-to-br from-[#00FF94]/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 ${
        active ? "opacity-100" : "group-hover:opacity-100"
      }`}
    />

    {/* Top Row: Icon and Badge */}
    <div className="relative z-10 flex justify-between items-start">
      <div
        className={`
        w-12 h-12 rounded-xl bg-[#111] border flex items-center justify-center transition-all duration-300
        ${
          active
            ? "text-[#00FF94] border-[#00FF94] shadow-[0_0_15px_rgba(0,255,148,0.3)]"
            : "text-white border-white/10 group-hover:text-[#00FF94] group-hover:border-[#00FF94] group-hover:shadow-[0_0_15px_rgba(0,255,148,0.3)]"
        }
      `}
      >
        <Icon size={20} />
      </div>

      <div
        className={`
        px-3 py-1 rounded bg-[#00FF94]/10 border border-[#00FF94]/30 text-[#00FF94] text-[10px] font-mono font-bold tracking-widest uppercase transition-opacity duration-300
        ${active ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
      `}
      >
        Settlement: 40ms
      </div>
    </div>

    {/* Bottom Row: Content */}
    <div className="relative z-10">
      <h3 className="text-2xl font-bold text-white mb-3 group-hover:translate-x-1 transition-transform duration-300">
        {title}
      </h3>

      <div className="flex items-center gap-3 mb-4">
        <div
          className={`h-[1px] w-6 transition-colors duration-300 ${
            active ? "bg-[#00FF94]" : "bg-gray-600 group-hover:bg-[#00FF94]"
          }`}
        />
        <span
          className={`text-xs font-mono font-bold uppercase tracking-widest transition-colors duration-300 ${
            active
              ? "text-[#00FF94]"
              : "text-gray-500 group-hover:text-[#00FF94]"
          }`}
        >
          {subtitle}
        </span>
      </div>

      <p className="text-sm text-gray-500 font-light leading-relaxed">
        You pay in digital value.
        <br />
        They receive instantly.
      </p>
    </div>
  </div>
);

const INITIAL_NODES = Array.from({ length: 30 }).map(() => ({
  top: `${Math.random() * 80 + 10}%`,
  left: `${Math.random() * 80 + 10}%`,
  animationDuration: `${Math.random() * 2 + 1}s`,
  animationDelay: `-${Math.random() * 2}s`,
}));

const Index = () => {
  // Initialize scroll active hook
  useScrollActive("hero");
  const [activeCommingSoon, setActiveCommingSoon] = useState(false);
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const pathPositions = [15, 32, 50, 68, 85];
  // Optional: Add a subtle movement to the nodes over time for more dynamism
  useEffect(() => {
    const interval = setInterval(() => {
      setNodes((prevNodes) =>
        prevNodes.map((node) => ({
          ...node,
          // Apply small random shift
          top: `${Math.min(
            90,
            Math.max(10, parseFloat(node.top) + (Math.random() - 0.5) * 0.5)
          )}%`,
          left: `${Math.min(
            90,
            Math.max(10, parseFloat(node.left) + (Math.random() - 0.5) * 0.5)
          )}%`,
        }))
      );
    }, 3000); // Shift every 3 seconds

    return () => clearInterval(interval);
  }, []);
  return (
    <div
      className="min-h-screen   bg-black text-white font-sans selection:bg-[#2BFF88] selection:text-black overflow-x-hidden overflow-y-hidden scrollbar-hide"
      style={{ scrollbarWidth: "none", scrollBehavior: "smooth" }}
    >
      <Navbar />
      <Hero />
      <SocialSidebar />

      {/* <!-- 2. THE PROBLEM SECTION (Scroll-Reveal Timeline) -->
        <!-- -------------------------------------- --> */}
      <section id="the-problem" className="py-40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center mb-24">
          <SectionLabel
            text="Global
Payments"
            className={"items-center justify-center"}
          />
          <h2 className="text-xl sm:text-xl md:text-2xl lg:text-3xl xl:text-5xl font-bold mb-8 mint-gradient-text tracking-tight text-center">
            The Problem: Why{" "}
            <span className="text-[#2BFF88]">
              Global <br />
              Payments
            </span>
            <br /> Are Broken Today
          </h2>
        </div>

        <div className="relative max-w-2xl mx-auto">
          <div className="timeline-line"></div>

          <div className="space-y-30">
            <div className="relative flex justify-start items-center group">
              <div className="w-1/2 pr-16 text-right opacity-100 transition-all duration-500">
                <h3 className="text-4xl font-bold tracking-tight text-white mb-3 relative inline-block">
                  High Fees.
                  <span className="absolute left-0 right-0 bottom-[-5px] h-[2px] bg-mint-gradient-bg opacity-30 group-hover:opacity-100 transition-opacity duration-300"></span>
                </h3>
                <p className="text-lg text-gray-400">
                  Traditional banking and legacy systems impose excessive,
                  hidden costs on cross-border transactions.
                </p>
              </div>
              <div className="w-14 h-14 rounded-full bg-black border-2 border-mint-gradient-bg neon-glow-md absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-10 flex items-center justify-center">
                <span className="text-sm font-bold text-mint-secondary">I</span>
              </div>
            </div>

            <div className="relative flex justify-end items-center group">
              <div className="w-1/2 pl-16 text-left opacity-100 transition-all duration-500">
                <h3 className="text-4xl font-bold tracking-tight text-white mb-3 relative inline-block">
                  Slow Settlement Times.
                  <span className="absolute left-0 right-0 bottom-[-5px] h-[2px] bg-mint-gradient-bg opacity-30 group-hover:opacity-100 transition-opacity duration-300"></span>
                </h3>
                <p className="text-lg text-gray-400">
                  Settlements often take days, crippling cash flow for
                  businesses and individuals.
                </p>
              </div>
              <div className="w-14 h-14 rounded-full bg-black border-2 border-mint-gradient-bg neon-glow-md absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-10 flex items-center justify-center">
                <span className="text-sm font-bold text-mint-secondary">
                  II
                </span>
              </div>
            </div>

            <div className="relative flex justify-start items-center group">
              <div className="w-1/2 pr-16 text-right opacity-100 transition-all duration-500">
                <h3 className="text-4xl font-bold tracking-tight text-white mb-3 relative inline-block">
                  Lack of Privacy.
                  <span className="absolute left-0 right-0 bottom-[-5px] h-[2px] bg-mint-gradient-bg opacity-30 group-hover:opacity-100 transition-opacity duration-300"></span>
                </h3>
                <p className="text-lg text-gray-400">
                  Every transaction exposes sensitive data to multiple, often
                  untrustworthy, intermediaries.
                </p>
              </div>
              <div className="w-14 h-14 rounded-full bg-black border-2 border-mint-gradient-bg neon-glow-md absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-10 flex items-center justify-center">
                <span className="text-sm font-bold text-mint-secondary">
                  III
                </span>
              </div>
            </div>

            <div className="relative flex justify-end items-center group">
              <div className="w-1/2 pl-16 text-left opacity-100 transition-all duration-500">
                <h3 className="text-4xl font-bold tracking-tight text-white mb-3 relative inline-block">
                  Opaque Intermediaries.
                  <span className="absolute left-0 right-0 bottom-[-5px] h-[2px] bg-mint-gradient-bg opacity-30 group-hover:opacity-100 transition-opacity duration-300"></span>
                </h3>
                <p className="text-lg text-gray-400">
                  The current system is controlled by centralized entities
                  lacking transparent accountability.
                </p>
              </div>
              <div className="w-14 h-14 rounded-full bg-black border-2 border-mint-gradient-bg neon-glow-md absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-10 flex items-center justify-center">
                <span className="text-sm font-bold text-mint-secondary">
                  IV
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*
     <!-- -------------------------------------- -->
        <!-- 3. THE PROTOCOL SECTION (Cinematic Diagram) -->
        <!-- -------------------------------------- --> */}
      <section
        id="protocol-section"
        className="py-40 overflow-hidden bg-[#000000]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* <!-- Text Block (Left) --> */}
          <div className="lg:sticky lg:top-1/4">
            <SectionLabel
              text="The Global Settlement Layer"
              className={"items-center justify-start"}
            />
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-8 mint-gradient-text tracking-tight text-left">
              <span className="text-[#2BFF88]">Blip Protocol</span>: The Global
              Settlement Layer
            </h2>
            <p className="text-2xl text-gray-300 mb-10 font-light">
              Blip is a decentralized, open-source protocol built for instant,
              low-cost global value transfer, leveraging Zero-Knowledge proofs
              for privacy and Solana's speed for scalability. It's the new
              financial infrastructure the world needs.
            </p>
            <button className="px-10 py-4 rounded-full text-base font-semibold bg-transparent border border-cyan-400/50 text-cyan-400 transition hover:bg-cyan-400/15 hover:shadow-[0_0_20px_rgba(0,200,255,0.5)]">
              Explore Whitepaper
            </button>
          </div>

          <div className="relative h-[700px] w-full">
            {/* Background Glows */}
            <div className="absolute inset-0 transform rotate-12 bg-cyan-400 opacity-10 blur-3xl"></div>
            <div className="absolute inset-0 transform -rotate-6 bg-mint-primary opacity-10 blur-3xl"></div>

            {/* SVG Network Diagram */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 500 500"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Central Node */}
              <circle
                cx="250"
                cy="250"
                r="50"
                fill="#19F7A7"
                className="neon-glow pulse-animation"
                style={{
                  filter: "drop-shadow(0 0 20px #19F7A7)",
                }}
              />
              <text
                x="250"
                y="255"
                textAnchor="middle"
                fill="#000"
                fontWeight="bold"
                fontSize="22"
              >
                BLIP
              </text>

              {/* Peripheral Nodes */}
              {[
                { cx: 100, cy: 150, delay: "0s" },
                { cx: 400, cy: 150, delay: "0.5s" },
                { cx: 100, cy: 350, delay: "1s" },
                { cx: 400, cy: 350, delay: "1.5s" },
              ].map((node, idx) => (
                <circle
                  key={idx}
                  cx={node.cx}
                  cy={node.cy}
                  r="20"
                  fill="#00C8FF"
                  className="float-element"
                  style={{
                    animation: `float 4s ease-in-out ${node.delay} infinite alternate`,
                  }}
                />
              ))}

              {/* Animated Connections */}
              {[
                { d: "M100 150 Q250 100 400 150", delay: "0s" },
                { d: "M100 350 L250 250", delay: "0.3s" },
                { d: "M400 350 L250 250", delay: "0.6s" },
              ].map((pathData, idx) => (
                <path
                  key={idx}
                  d={pathData.d}
                  stroke="#19F7A7"
                  strokeWidth="2"
                  fill="none"
                  style={{
                    strokeDasharray: 500,
                    strokeDashoffset: 500,
                    animation: `drawLine 2s ${pathData.delay} forwards`,
                    filter: "drop-shadow(0 0 10px #19F7A7)",
                  }}
                />
              ))}
            </svg>

            {/* Tailwind Animations */}
            <style>{`
              @keyframes pulseGlow {
                0% {
                  transform: scale(1);
                  filter: drop-shadow(0 0 20px #19f7a7)
                    drop-shadow(0 0 40px #19f7a7);
                }
                100% {
                  transform: scale(1.05);
                  filter: drop-shadow(0 0 30px #19f7a7)
                    drop-shadow(0 0 60px #19f7a7);
                }
              }

              @keyframes float {
                0% {
                  transform: translateY(0);
                }
                50% {
                  transform: translateY(-8px);
                }
                100% {
                  transform: translateY(0);
                }
              }

              @keyframes drawLine {
                to {
                  stroke-dashoffset: 0;
                }
              }
            `}</style>
          </div>
        </div>
      </section>

      {/* <!-- SECTION 3: HOW IT WORKS (3 STEPS - STRIPE VIBE) --> */}
      <section id="how-it-works" className="py-32 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionLabel
            text="Real-World Value"
            className={"items-center justify-center"}
          />
          <h2
            data-animate-on-scroll
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-8 mint-gradient-text tracking-tight text-center"
          >
            How It Works:
            <br />3 Steps to{" "}
            <span className="text-[#2BFF88]">Real-World Value</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* <!-- Step 1 --> */}
            <div
              data-animate-on-scroll
              className="relative p-12 rounded-xl bg-dark-gray border border-gray-900 transition duration-500 hover:border-neon-green/50 group hover:shadow-neon-sm hover:translate-y-[-5px]"
            >
              <span className="absolute -top-4 -left-4 text-8xl font-extrabold text-neon-green opacity-5 group-hover:opacity-10 transition duration-500 tracking-tighter">
                01
              </span>
              <h3 className="text-2xl font-bold mb-4 flex items-center tracking-tight text-white/90">
                <span className="text-neon-green text-3xl mr-3">⌲</span> Create
                a payment using your wallet (choose cash, bank, wire, or goods).
              </h3>
              <p className="text-gray-400">
                Details of your payment are encoded and submitted on-chain,
                committing the crypto to an immutable escrow smart contract.
              </p>
            </div>

            {/* <!-- Step 2 --> */}
            <div
              data-animate-on-scroll
              className="relative p-12 rounded-xl bg-dark-gray border border-gray-900 transition duration-500 hover:border-neon-green/50 group hover:shadow-neon-sm hover:translate-y-[-5px]"
              style={{ animationDelay: "100ms;" }}
            >
              <span className="absolute -top-4 -left-4 text-8xl font-extrabold text-neon-green opacity-5 group-hover:opacity-10 transition duration-500 tracking-tighter">
                02
              </span>
              <h3 className="text-2xl font-bold mb-4 flex items-center tracking-tight text-white/90">
                <span className="text-neon-green text-3xl mr-3">🤝</span>{" "}
                Merchants in the target country bid to fulfill your order.
              </h3>
              <p className="text-gray-400">
                The decentralized Merchant Network competes to provide the best
                fulfillment service, ensuring competitive rates and speed.
              </p>
            </div>

            {/* <!-- Step 3 --> */}
            <div
              data-animate-on-scroll
              className="relative p-12 rounded-xl bg-dark-gray border border-gray-900 transition duration-500 hover:border-neon-green/50 group hover:shadow-neon-sm hover:translate-y-[-5px]"
              style={{ animationDelay: "200ms" }}
            >
              <span className="absolute -top-4 -left-4 text-8xl font-extrabold text-neon-green opacity-5 group-hover:opacity-10 transition duration-500 tracking-tighter">
                03
              </span>
              <h3 className="text-2xl font-bold mb-4 flex items-center tracking-tight text-white/90">
                <span className="text-neon-green text-3xl mr-3">✓</span>{" "}
                Receiver gets real-world value instantly, and settlement is
                recorded on-chain.
              </h3>
              <p className="text-gray-400">
                Once settlement proof is confirmed, the escrow is released and
                the transaction is immutably recorded, completing the global
                transfer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 4: REAL WORLD USAGE --- */}
      <section className="py-16 sm:py-24 md:py-32 bg-[#020202] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-[#050505] to-[#020202] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <ScrollReveal delay={0}>
            <SectionLabel
              text="Real World Usage"
              className={"items-center justify-center"}
            />
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-8 mint-gradient-text tracking-tight text-center">
              <span className="text-[#2BFF88]">Use crypto</span> the same way
              <br />
              you <span className="text-[#2BFF88]">use money.</span>
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <ScrollReveal delay={0.2}>
              <CinematicCard
                title="Cafés"
                subtitle="TAP TO PAY"
                icon={Coffee}
                delay={0}
                active={false}
              />
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <CinematicCard
                title="Restaurants"
                subtitle="TABLE SETTLEMENT"
                icon={Utensils}
                delay={100}
                active={false}
              />
            </ScrollReveal>
            <ScrollReveal delay={0.4}>
              <CinematicCard
                title="Hotels"
                subtitle="INSTANT BOOKING"
                icon={MapPin}
                delay={200}
                active={false}
              />
            </ScrollReveal>
            <ScrollReveal delay={0.5}>
              <CinematicCard
                title="Retail"
                subtitle="POS INTEGRATION"
                icon={ShoppingBag}
                delay={300}
                active={false}
              />
            </ScrollReveal>
            <ScrollReveal delay={0.6}>
              <CinematicCard
                title="Friends"
                subtitle="P2P TRANSFER"
                icon={Users}
                delay={400}
                active={false}
              />
            </ScrollReveal>
            <ScrollReveal delay={0.7}>
              <CinematicCard
                title="Transport"
                subtitle="RIDE SETTLEMENT"
                icon={Car}
                delay={500}
                active={false}
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* <!-- SECTION 7: PRIVACY & TRUST (TWO-COLUMN MINIMAL) --> */}
      <section className="py-32 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionLabel
            text=" Privacy by Design."
            className={"items-center justify-center"}
          />
          <h2
            data-animate-on-scroll
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-8 mint-gradient-text tracking-tight text-center"
          >
            <span className="text-[#2BFF88]">Privacy</span> by Design. Trust by
            <br />
            Protocol.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* <!-- Left: Privacy (Cyan Accent) --> */}
            <div
              data-animate-on-scroll
              className="p-10 rounded-xl bg-dark-gray border border-cyan/50 shadow-neon-sm shadow-cyan/20 transition duration-300 hover:border-cyan"
            >
              <h3 className="text-3xl font-bold mb-4 text-neon-green tracking-tight">
                Privacy Layer
              </h3>
              <ul className="space-y-4 text-gray-300 text-lg">
                <li className="flex items-start">
                  <span className="text-2xl mr-3 text-neon-green">◇</span>
                  Wallet-based identity: Your wallet address is your ID,
                  decoupled from personal data.
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3 text-neon-green">◇</span>
                  No personal info required for small transfers, ensuring true
                  freedom.
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3 text-neon-green">◇</span>
                  End-to-end private transaction construction.
                </li>
              </ul>
            </div>

            {/* <!-- Right: On-chain transparency (Neon Green Accent) --> */}
            <div
              data-animate-on-scroll
              className="p-10 rounded-xl bg-dark-gray border border-neon-green/50 shadow-neon-sm shadow-neon-green/20 transition duration-300 hover:border-neon-green"
              style={{ animationDelay: "100ms" }}
            >
              <h3 className="text-3xl font-bold mb-4 text-neon-green tracking-tight">
                On-chain Trust
              </h3>
              <ul className="space-y-4 text-gray-300 text-lg">
                <li className="flex items-start">
                  <span className="text-2xl mr-3 text-neon-green">✓</span>
                  Orders and Matching are recorded on-chain for verification.
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3 text-neon-green">✓</span>
                  Settlement proofs guarantee real-world delivery.
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3 text-neon-green">✓</span>
                  Immutable audit trail of all transactions.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 5: MERCHANTS --- */}
      <section
        id="merchants"
        className="py-16 sm:py-24 md:py-32 bg-[#050505] overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 sm:gap-16 lg:gap-20 items-center">
          <ScrollReveal delay={0} className="order-2 lg:order-1">
            <div className="bg-[#080808] rounded-xl border border-white/10 shadow-2xl relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#00FF94] to-blue-600 rounded-xl opacity-20 blur-lg group-hover:opacity-30 transition-opacity" />
              <div className="relative bg-[#0A0A0A] rounded-xl overflow-hidden p-1">
                <div className="bg-[#111] px-4 py-3 border-b border-white/5 flex justify-between items-center">
                  <div className="text-xs font-mono text-gray-500">
                    BLIP MERCHANT TERMINAL
                  </div>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                    <div className="w-2 h-2 rounded-full bg-green-500/50" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 bg-[#111] rounded border border-white/5">
                      <div className="text-[10px] text-gray-500 uppercase mb-1">
                        Total Volume (24h)
                      </div>
                      <div className="text-xl font-mono text-white">
                        $42,921.50
                      </div>
                    </div>
                    <div className="p-4 bg-[#00FF94]/5 rounded border border-[#00FF94]/20">
                      <div className="text-[10px] text-[#00FF94] uppercase mb-1">
                        Rewards Earned
                      </div>
                      <div className="text-xl font-mono text-[#00FF94]">
                        +2.5%
                      </div>
                    </div>
                  </div>
                  <div className="h-32 flex items-end justify-between gap-1 mb-6 px-1">
                    {[30, 45, 35, 60, 50, 75, 65, 90, 80, 55, 70, 40].map(
                      (h, i) => (
                        <div
                          key={i}
                          className="w-full bg-[#1A1A1A] hover:bg-[#00FF94] transition-colors rounded-t-sm"
                          style={{ height: `${h}%` }}
                        />
                      )
                    )}
                  </div>
                  <div className="text-xs font-mono text-gray-600 border-t border-white/5 pt-4 flex justify-between">
                    <span>NETWORK RATING</span>
                    <span className="text-white">TIER 1 (TRUSTED)</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.2} className="order-1 lg:order-2">
            <SectionLabel text="Merchants" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              Accept crypto.
              <br />
              Receive value <span className="text-[#2BFF88]">instantly.</span>
              <br />
              No risk.
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              You don't need crypto knowledge — payments settle instantly into
              stable value.
            </p>
            <div className="flex items-center gap-4 p-4 border border-[#00FF94]/30 bg-[#00FF94]/5 rounded-lg mb-8">
              <Gem className="text-[#00FF94]" />
              <span className="text-[#00FF94] font-bold">
                Earn up to 2.5% in Blip Tokens on every transaction.
              </span>
            </div>
            {/* <Button>Create Business Account</Button> */}
          </ScrollReveal>
        </div>
      </section>
      {/* --- SECTION 6: PREMIUM REWARDS --- */}
      <section className="py-16 sm:py-24 md:py-32 lg:py-40 relative bg-[#020202] overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-[#00FF94]/5 to-transparent opacity-50" />
        <div
          style={styles.gridBackground}
          className="absolute inset-0 opacity-20 pointer-events-none"
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center gap-10 sm:gap-16 lg:gap-20">
          {/* LEFT SIDE — TEXT */}
          <div className="flex-1 text-left">
            <SectionLabel text="Incentives & Early Access" />

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-8 text-white tracking-tight">
              Get <span className="text-[#2BFF88]">rewarded</span> every <br />{" "}
              time you spend.
            </h2>

            <p className="text-xl text-gray-400 mb-10 max-w-lg">
              Earn up to 2.5% in Blip Tokens on every payment — plus early
              supporter airdrops.
            </p>

            <div className="flex flex-col gap-4 max-w-xs">
              <button className="bg-black/80 backdrop-blur border border-[#00FF94]/30 text-[#00FF94] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#00FF94] hover:text-black hover:shadow-[0_0_30px_#00FF94] transition-all duration-300">
                Join Early Supporters
              </button>

              <button className="bg-black/80 backdrop-blur border border-white/20 text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:border-[#00FF94] hover:text-[#00FF94] transition-all duration-300">
                Join the Waitlist
              </button>

              <button className="bg-black/80 backdrop-blur border border-white/20 text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:border-[#00FF94] hover:text-[#00FF94] transition-all duration-300">
                Get Airdrop Access
              </button>
            </div>
          </div>

          {/* RIGHT SIDE — IMAGE / ANIMATION */}
          <div className="flex-1 relative w-[450px] h-[450px] hidden md:block">
            <div className="absolute inset-0 w-full h-full rounded-full border border-dashed border-[#00FF94]/10 animate-[spin_60s_linear_infinite]" />

            <div className="absolute inset-0 w-[300px] h-[300px] m-auto rounded-full border border-[#00FF94]/20 animate-[spin_40s_linear_infinite_reverse]" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-40 h-40 group cursor-pointer">
                <div className="absolute inset-0 bg-[#00FF94] rounded-full blur-[80px] opacity-40 group-hover:opacity-60 transition-opacity duration-500" />

                <div className="w-full h-full rounded-full bg-gradient-to-br from-[#111] to-black border-[6px] border-[#0A0A0A] flex items-center justify-center relative shadow-[0_0_60px_rgba(0,255,148,0.3)] animate-[spin_10s_linear_infinite]">
                  <div className="absolute inset-1 rounded-full border border-[#00FF94]/40" />
                  <div className="absolute inset-3 rounded-full border border-dashed border-[#00FF94]/20" />
                  <span className="text-6xl font-black text-[#00FF94] italic">
                    B
                  </span>
                </div>

                <div className="absolute -inset-1 rounded-full border border-[#00FF94]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
              </div>

              <div className="absolute bottom-[-50px] text-xs font-mono text-[#00FF94] uppercase tracking-widest opacity-80">
                Early users earn higher rewards
              </div>
            </div>

            {/* Floating Buttons */}
            {/* <div className="absolute inset-0 animate-[orbit_30s_linear_infinite]">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 animate-[counterOrbit_30s_linear_infinite]">
                <button className="bg-black/80 backdrop-blur border border-[#00FF94]/30 text-[#00FF94] px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#00FF94] hover:text-black transition-all duration-300">
                  Join Early Supporters
                </button>
              </div>

              <div className="absolute bottom-[15%] right-[10%] animate-[counterOrbit_30s_linear_infinite]">
                <button className="bg-black/80 backdrop-blur border border-white/20 text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:border-[#00FF94] hover:text-[#00FF94] transition-all duration-300">
                  Join the Waitlist
                </button>
              </div>

              <div className="absolute bottom-[15%] left-[10%] animate-[counterOrbit_30s_linear_infinite]">
                <button className="bg-black/80 backdrop-blur border border-white/20 text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:border-[#00FF94] hover:text-[#00FF94] transition-all duration-300">
                  Get Airdrop Access
                </button>
              </div>
            </div> */}
          </div>
        </div>
      </section>

      {/* --- SECTION 7: PEOPLEBANK --- */}
      <>
        {" "}
        <style>
          {`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.5;
              transform: scale(1.2);
            }
          }
          @keyframes flow-animation {
            to {
              /* Animates the dash pattern offset, simulating movement */
              stroke-dashoffset: 0;
            }
          }
        `}
        </style>
        <section
          id="peoplebank"
          className="py-16 md:py-32 bg-[#050505] border-t border-white/5 "
        >
          <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-20">
            {/* Left Content Area */}
            <div>
              <SectionLabel text="The Network" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 tracking-light">
                A <span className="text-[#2BFF88]">decentralized</span>{" "}
                human-powered liquidity network.
              </h2>
              <p className="text-xl text-gray-400 mb-10 leading-relaxed">
                PeopleBank is the network that powers real-time settlement.
                Anyone can provide liquidity, route payments, and earn Blip
                Tokens for supporting global value transfer.
              </p>
              <div className="space-y-6">
                {[
                  "Liquidity providers join PeopleBank",
                  "They lock value in non-custodial channels",
                  "Blip routes P2P payments through available liquidity",
                  "Providers earn rewards",
                  "Everything is on-chain and transparent",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 text-gray-300">
                    <div className="flex-shrink-0 w-6 h-6 rounded bg-[#111] border border-[#00FF94]/20 flex items-center justify-center text-[#00FF94] text-xs font-bold">
                      {i + 1}
                    </div>
                    <p className="pt-0.5">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Live Routing Visualization */}
            <div className="relative bg-[#080808] rounded-2xl border border-white/5 p-8 flex items-center justify-center overflow-hidden min-h-[400px]">
              <div
                style={stylesPeopleBank.gridBackground}
                className="absolute inset-0 opacity-10"
              />
              {/* Network Container (Aspect Ratio fixed to square) */}
              <div className="relative w-full aspect-square max-w-md">
                {/* Animated Nodes (Dots) */}
                {nodes.map((node, i) => (
                  <div
                    key={i}
                    className="absolute w-1.5 h-1.5 bg-[#00FF94] rounded-full shadow-[0_0_10px_#00FF94] transition-all duration-300 ease-in-out"
                    style={{
                      top: node.top,
                      left: node.left,
                      animation: `pulse ${node.animationDuration} infinite`,
                    }}
                  />
                ))}

                {/* Animated Connecting Lines (SVG Paths) */}
                <svg
                  viewBox="0 0 400 400"
                  className="absolute inset-0 w-full h-full opacity-50 pointer-events-none"
                >
                  {/* Path 1: Longer, Curvier Route */}
                  <path
                    d="M50,50 Q150,150 250,50 T350,250"
                    fill="none"
                    stroke="#00FF94"
                    strokeWidth="2"
                    // Animation Setup for Flow
                    strokeDasharray="10 10" // Dash/Gap length
                    style={{
                      strokeDashoffset: "20", // Start offset (must be larger than dash array total)
                      animation: "flow-animation 4s linear infinite",
                    }}
                  />

                  {/* Path 2: Shorter, Direct Route */}
                  <path
                    d="M100,300 Q200,200 300,300"
                    fill="none"
                    stroke="#00FF94"
                    strokeWidth="1"
                    // Animation Setup for Flow
                    strokeDasharray="5 5"
                    style={{
                      strokeDashoffset: "10",
                      animation: "flow-animation 2s linear infinite reverse", // Reverse for variety
                    }}
                  />

                  {/* Path 3: Diagonal Route */}
                  <path
                    d="M300,50 L50,350"
                    fill="none"
                    stroke="#00FF94"
                    strokeWidth="1.5"
                    // Animation Setup for Flow
                    strokeDasharray="8 8"
                    style={{
                      strokeDashoffset: "16",
                      animation: "flow-animation 3s linear infinite",
                      filter: "drop-shadow(0 0 2px #00FF94)", // Add subtle glow to path
                    }}
                  />
                </svg>

                {/* LIVE ROUTING label */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-sm font-mono text-[#00FF94] bg-black/70 px-4 py-2 rounded-full border border-[#00FF94]/50 shadow-xl shadow-black/50">
                    LIVE ROUTING
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>

      {/* SECTION 9: TOKEN UTILITY (SIMPLE GRID) */}
      <section className="py-32 border-t border-gray-900 container mx-auto px-4">
        <div className="max-w-6xl mx-auto px-6">
          <SectionLabel
            text="Protocol Token Utility"
            className="items-center justify-center"
          />
          <h2
            data-animate-on-scroll
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-8 sm:mb-12 md:mb-16 tracking-tight text-center"
          >
            Protocol <span className="text-[#2BFF88]">Token Utility</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 max-w-7xl mx-auto">
            {/* Merchant Staking */}
            <div
              data-animate-on-scroll
              className="text-center p-6 bg-dark-gray rounded-lg border border-gray-800 hover:border-neon-green/50 transition duration-300 group hover:scale-[1.03]"
            >
              <div className="text-2xl text-neon-green mb-2 transition duration-300 group-hover:text-cyan">
                ◆
              </div>
              <p className="text-sm font-semibold text-gray-300">
                Merchant Staking
              </p>
            </div>

            {/* Routing Priority */}
            <div
              data-animate-on-scroll
              className="text-center p-6 bg-dark-gray rounded-lg border border-gray-800 hover:border-neon-green/50 transition duration-300 group hover:scale-[1.03]"
              style={{ animationDelay: "50ms" }}
            >
              <div className="text-2xl text-cyan mb-2 transition duration-300 group-hover:text-neon-green">
                ➤
              </div>
              <p className="text-sm font-semibold text-gray-300">
                Routing Priority
              </p>
            </div>

            {/* Liquidity Rewards */}
            <div
              data-animate-on-scroll
              className="text-center p-6 bg-dark-gray rounded-lg border border-gray-800 hover:border-neon-green/50 transition duration-300 group hover:scale-[1.03]"
              style={{ animationDelay: "100ms" }}
            >
              <div className="text-2xl text-purple-400 mb-2 transition duration-300 group-hover:text-cyan">
                ◉
              </div>
              <p className="text-sm font-semibold text-gray-300">
                Liquidity Rewards
              </p>
            </div>

            {/* Dispute Slashing */}
            <div
              data-animate-on-scroll
              className="text-center p-6 bg-dark-gray rounded-lg border border-gray-800 hover:border-neon-green/50 transition duration-300 group hover:scale-[1.03]"
              style={{ animationDelay: "150ms" }}
            >
              <div className="text-2xl text-red-400 mb-2 transition duration-300 group-hover:text-cyan">
                ⚔
              </div>
              <p className="text-sm font-semibold text-gray-300">
                Dispute Slashing
              </p>
            </div>

            {/* Governance */}
            <div
              data-animate-on-scroll
              className="text-center p-6 bg-dark-gray rounded-lg border border-gray-800 hover:border-neon-green/50 transition duration-300 group hover:scale-[1.03]"
              style={{ animationDelay: "200ms" }}
            >
              <div className="text-2xl text-yellow-300 mb-2 transition duration-300 group-hover:text-cyan">
                ⚖
              </div>
              <p className="text-sm font-semibold text-gray-300">Governance</p>
            </div>

            {/* Fee Reductions */}
            <div
              data-animate-on-scroll
              className="text-center p-6 bg-dark-gray rounded-lg border border-gray-800 hover:border-neon-green/50 transition duration-300 group hover:scale-[1.03]"
              style={{ animationDelay: "250ms" }}
            >
              <div className="text-2xl text-green-300 mb-2 transition duration-300 group-hover:text-cyan">
                ⬉
              </div>
              <p className="text-sm font-semibold text-gray-300">
                Fee Reductions
              </p>
            </div>

            {/* Marketplace Promotions */}
            <div
              data-animate-on-scroll
              className="text-center p-6 bg-dark-gray rounded-lg border border-gray-800 hover:border-neon-green/50 transition duration-300 group hover:scale-[1.03]"
              style={{ animationDelay: "300ms" }}
            >
              <div className="text-2xl text-pink-400 mb-2 transition duration-300 group-hover:text-cyan">
                ✦
              </div>
              <p className="text-sm font-semibold text-gray-300">
                Marketplace Promotions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 9: FINAL HERO --- */}
      <section className="py-20 sm:py-28 md:py-36 lg:py-40 relative flex items-center justify-center overflow-hidden bg-black text-center border-t border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#00FF94]/5 via-black to-black" />
        <div className="relative z-10 max-w-4xl px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-8 tracking-tight">
            A new payment layer
            <br />
            for the real world.
          </h2>
          <div className="flex px-6 justify-center gap-2 text-gray-500 font-mono text-sm mb-12 uppercase tracking-widest">
            <span>Instant</span>•<span>Bankless</span>•<span>Borderless</span>•
            <span>P2P</span>
          </div>
          <a href="https://t.me/+Pi3Ijs3Q5-ZjZTAx" target="_blank">
            <Button
              primary
              className="text-lg px-12 py-5 shadow-[0_0_50px_rgba(0,255,148,0.2)] hover:shadow-[0_0_80px_rgba(0,255,148,0.4)] transform hover:scale-105"
            >
              Join Early Access
            </Button>
          </a>
        </div>
        <div className="absolute bottom-[-40vh] left-1/2 -translate-x-1/2 w-[150vw] h-[80vh] bg-[#00FF94]/5 rounded-[100%] blur-[120px] pointer-events-none" />
      </section>
      {/* section 10 */}
      <section className="py-16 sm:py-20 md:py-24 text-center border-t border-white/5 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#111] to-black opacity-50" />
        <div className="relative z-10 px-4 sm:px-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-6 sm:mb-8">
            Coming soon in 12 Countries
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

      {/* <!-- Footer --> */}
      <footer className="py-12 border-t border-gray-900 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          <p>
            &copy; <span id="year">2025</span> Blip.money Protocol. All Rights
            Reserved. Bankless. Trustless. Instant.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
