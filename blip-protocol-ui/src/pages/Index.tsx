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
  <div className="relative w-[230px] h-[460px]  overflow-hidden z-10 hover:scale-[1.02] transition-transform duration-700">
    <img
      src="/home (1) - Edited.png"
      alt="image"
      className="w-full h-full object-cover p-0 shadow-2xl"
    />
  </div>
);

// 2. Reusable Architecture Node component
const ArchitectureNode = ({
  step,
  title,
  sub,
  icon: Icon,
  color,
  className = "",
  delay = 0,
  isMain = false,
}) => {
  const shadowStyle = {
    "--node-color": color,
    animationDelay: `${delay}ms`,
  };

  const ringClass = isMain
    ? `ring-4 ring-offset-4 ring-offset-[#080808] ring-[${color}]/30`
    : "ring-2 ring-gray-700/50";
  const bgColor = isMain ? "bg-[#0F0F0F]" : "bg-[#151515]";

  return (
    <div
      className={`p-6 w-56 rounded-2xl border border-white/10 flex flex-col items-center text-center transition-all duration-500 ease-out hover:shadow-lg ${bgColor} ${className}`}
      style={shadowStyle}
    >
      <div
        className={`p-3 rounded-full ${bgColor} border border-white/10 mb-4 ${ringClass}`}
      >
        <Icon size={28} style={{ color }} />
      </div>
      <p className="text-sm font-medium text-gray-400 uppercase mb-1">
        Step {step}
      </p>
      <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
      <p className="text-xs text-gray-500">{sub}</p>
    </div>
  );
};

// --- New Component for Steps 4 & 5 Focus ---

const ProtocolSupportStructure = () => {
  const items = [
    {
      step: "4",
      title: "Governance DAO",
      sub: "Protocol Upgrades & Parameter Voting",
      icon: Landmark,
      color: "#A855F7", // Purple
    },
    {
      step: "5",
      title: "Merchant Stakers",
      sub: "Fiat Liquidity & Transaction Collateral",
      icon: ShieldCheck,
      color: "#6366F1", // Indigo
    },
  ];

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-6 w-full mt-24">
      {/* Header */}
      <div className="text-center mb-12">
        <SectionLabel text="Security & Foundation" />
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white tracking-tight">
          The Decentralized Foundation.
        </h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Steps 4 and 5 provide the trustless security and collateral that
          underpin the core settlement mechanism.
        </p>
      </div>

      {/* Focused Diagram */}
      <div className="relative h-[600px] max-w-4xl mx-auto rounded-3xl border border-white/5 bg-[#080808] shadow-2xl flex items-center justify-center">
        <div
          className="absolute inset-0 opacity-10"
          style={styles.gridBackground}
        />

        {/* Central Anchor: Blip Protocol (Step 2) */}
        <div className="relative z-20">
          <ArchitectureNode
            step="2"
            title="Blip Protocol"
            sub="The Central Matching Engine"
            icon={Lock}
            color="#FBBF24"
            className="scale-110 shadow-[0_0_80px_rgba(251,191,36,0.3)] bg-[#0A0A0A]"
            isMain
          />
          <div className="absolute inset-0 rounded-2xl border border-[#FBBF24]/20 animate-ping opacity-20 pointer-events-none" />
        </div>

        {/* Supporting Nodes - Layered Below */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center">
          {/* Layer Ring 1 (Stakers) */}
          <div className="absolute w-[80%] h-[80%] border border-[#6366F1]/30 rounded-full flex items-center justify-center animate-spin-slow-reverse">
            <div className="absolute top-1/4 right-0 transform translate-x-1/2">
              <ArchitectureNode
                {...items[1]}
                className="scale-95 bg-[#101015] shadow-[0_0_30px_rgba(99,102,241,0.2)]"
              />
            </div>
          </div>

          {/* Layer Ring 2 (Governance) */}
          <div className="absolute w-[60%] h-[60%] border border-[#A855F7]/30 rounded-full flex items-center justify-center animate-spin-slow">
            <div className="absolute top-0 left-1/4 transform -translate-y-1/2">
              <ArchitectureNode
                {...items[0]}
                className="scale-95 bg-[#101015] shadow-[0_0_30px_rgba(168,85,247,0.2)]"
              />
            </div>
          </div>

          {/* Connection Lines (Static for Foundation) */}
          <svg
            className="absolute w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* Stakers to Protocol */}
            <line
              x1="75"
              y1="50"
              x2="55"
              y2="50"
              stroke="#6366F1"
              strokeWidth="0.2"
              strokeDasharray="1,1"
              opacity="0.5"
            />
            <line
              x1="25"
              y1="50"
              x2="45"
              y2="50"
              stroke="#6366F1"
              strokeWidth="0.2"
              strokeDasharray="1,1"
              opacity="0.5"
            />
            {/* Governance to Protocol */}
            <line
              x1="50"
              y1="25"
              x2="50"
              y2="45"
              stroke="#A855F7"
              strokeWidth="0.2"
              strokeDasharray="1,1"
              opacity="0.5"
            />
            <line
              x1="50"
              y1="75"
              x2="50"
              y2="55"
              stroke="#A855F7"
              strokeWidth="0.2"
              strokeDasharray="1,1"
              opacity="0.5"
            />
          </svg>
        </div>

        {/* Supporting Key */}
        <div className="absolute bottom-8 right-8 p-4 rounded-xl border border-white/10 bg-black/50 backdrop-blur-md max-w-xs">
          <div className="flex items-center gap-2 mb-2 text-xs text-gray-400 uppercase tracking-widest">
            <Layers size={12} className="text-[#FBBF24]" /> Support Structure
          </div>
          <p className="text-xs text-gray-500">
            The core protocol is anchored by Governance (4) for oversight and
            Merchant Stakers (5) for guaranteed liquidity.
          </p>
        </div>
      </div>
    </div>
  );
};

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

const CheckCircle = ({ size, className }: any) => (
  <div className={`relative ${className}`}>
    <div className="absolute inset-0 bg-[#2BFF88] rounded-full opacity-20 animate-ping" />
    <Smartphone size={size} />
  </div>
);
const SectionLabel = ({ text }) => (
  <div className="flex items-center gap-3 mb-8">
    <div className="flex gap-1">
      <div className="w-1 h-1 rounded-full bg-[#00FF94]" />
      <div className="w-1 h-1 rounded-full bg-[#00FF94] opacity-50" />
      <div className="w-1 h-1 rounded-full bg-[#00FF94] opacity-25" />
    </div>
    <span className="text-[#00FF94] uppercase tracking-[0.3em] text-[10px] font-mono font-bold">
      {text}
    </span>
  </div>
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

// Custom styles for the glow effect and the grid background
const stylesBlip = {
  glowText: {
    textShadow:
      "0 0 15px rgba(0, 255, 148, 0.5), 0 0 5px rgba(0, 255, 148, 0.3)",
  },
  gridBackground: {
    backgroundImage:
      "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
    backgroundSize: "20px 20px",
  },
};

const Index = () => {
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
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#2BFF88] selection:text-black overflow-x-hidden">
      <Navbar />
      <Hero />
      <SocialSidebar />
      {/* --- SECTION 2: HOW BLIP WORKS --- */}
      <TransferFlow />
      {/* --- SECTION 4: REAL WORLD USAGE --- */}
      <section className="py-16 sm:py-24 md:py-32 bg-[#020202] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-[#050505] to-[#020202] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <SectionLabel text="Real World Usage" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 sm:mb-12 md:mb-16 tracking-tight">
            Use crypto the same way
            <br />
            you use money.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <CinematicCard
              title="Cafés"
              subtitle="TAP TO PAY"
              icon={Coffee}
              delay={0}
              active={false}
            />
            <CinematicCard
              title="Restaurants"
              subtitle="TABLE SETTLEMENT"
              icon={Utensils}
              delay={100}
              active={false}
            />
            <CinematicCard
              title="Hotels"
              subtitle="INSTANT BOOKING"
              icon={MapPin}
              delay={200}
              active={false}
            />
            <CinematicCard
              title="Retail"
              subtitle="POS INTEGRATION"
              icon={ShoppingBag}
              delay={300}
              active={false}
            />
            <CinematicCard
              title="Friends"
              subtitle="P2P TRANSFER"
              icon={Users}
              delay={400}
              active={false}
            />
            <CinematicCard
              title="Transport"
              subtitle="RIDE SETTLEMENT"
              icon={Car}
              delay={500}
              active={false}
            />
          </div>
        </div>
      </section>
      {/* --- SECTION 5: MERCHANTS --- */}
      <section
        id="merchants"
        className="py-16 sm:py-24 md:py-32 bg-[#050505] overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 sm:gap-16 lg:gap-20 items-center">
          <div className="order-2 lg:order-1">
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
          </div>
          <div className="order-1 lg:order-2">
            <SectionLabel text="Merchants" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              Accept crypto.
              <br />
              Receive value instantly.
              <br />
              No risk.
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              You don’t need crypto knowledge — payments settle instantly into
              stable value.
            </p>
            <div className="flex items-center gap-4 p-4 border border-[#00FF94]/30 bg-[#00FF94]/5 rounded-lg mb-8">
              <Gem className="text-[#00FF94]" />
              <span className="text-[#00FF94] font-bold">
                Earn up to 2.5% in Blip Tokens on every transaction.
              </span>
            </div>
            {/* <Button>Create Business Account</Button> */}
          </div>
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

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-white tracking-tight">
              Get rewarded every <br /> time you spend.
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
          className="py-16 md:py-32 bg-[#050505] border-t border-white/5 font-['Inter']"
        >
          <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-20">
            {/* Left Content Area */}
            <div>
              <SectionLabel text="The Network" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
                A decentralized human-powered liquidity network.
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

      {/* --- SECTION 8: PROTOCOL ARCHITECTURE (Fixed & Scalable) --- */}
      {/* Added min-h-screen, flex, flex-col, and justify-center */}
      <section
        id="protocol"
        className="min-h-screen flex flex-col justify-center py-16 bg-[#020202] relative border-t border-white/5 overflow-hidden"
      >
        <style>
          {`
                @keyframes moveRight {
                    0% { transform: translate(0, -50%); opacity: 1; }
                    50% { transform: translate(300%, -50%); opacity: 1; }
                    100% { transform: translate(0, -50%); opacity: 0; }
                }
                .animate-\\[moveRight_3s_linear_infinite\\] {
                    animation: moveRight 3s linear infinite;
                }
                `}
        </style>
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] to-[#020202]" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <SectionLabel text="Protocol Architecture" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white tracking-tight">
              How Blip Settles Value.
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              A trustless mechanism connecting digital wallets to real-world
              banking rails in three steps.
            </p>
          </div>

          {/* Diagram Container (Desktop View) */}
          <div className="relative h-[800px] max-w-7xl my-auto mx-auto rounded-3xl border border-white/5 bg-[#080808] overflow-hidden hidden lg:block shadow-2xl">
            <div
              style={styles.gridBackground}
              className="absolute inset-0 opacity-10 top-[50%]"
            />

            {/* SVG Lines */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient
                  id="flowGradient"
                  x1="0%"
                  y1="50%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#0088FF" stopOpacity="0.3" />
                  <stop offset="47%" stopColor="#FBBF24" stopOpacity="0.5" />
                  <stop offset="70%" stopColor="#00FF94" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              {/* Main Flow Lines (1->2->3) */}
              <path
                d="M 25 50 L 75 50" // Simplified straight path for better animation visual
                stroke="url(#flowGradient)"
                strokeWidth="0.7"
                strokeDasharray="4, 4"
                className="animate-[pulse_3s_infinite]"
              />

              {/* Step 4 (Governance) Connection */}
              <path
                d="M 50 50 Q 60 30 75 25"
                fill="none"
                stroke="#A855F7"
                strokeWidth="0.2"
                strokeDasharray="1,1"
                opacity="0.3"
              />
              {/* Step 5 (Stakers) Connection */}
              <path
                d="M 50 50 Q 60 70 75 75"
                fill="none"
                stroke="#6366F1"
                strokeWidth="0.2"
                strokeDasharray="1,1"
                opacity="0.3"
              />
            </svg>

            {/* Step 1: Sender Wallet */}
            <div className="absolute top-1/2 left-[25%] -translate-x-1/2 -translate-y-1/2">
              <ArchitectureNode
                step="1"
                title="Sender Wallet"
                sub="Locks USDT/USDC in Protocol"
                icon={Wallet}
                color="#0088FF"
                className="shadow-[0_0_40px_rgba(0,136,255,0.1)]"
                isMain
              />
            </div>

            {/* Step 2: Blip Protocol (Center) */}
            <div className="absolute top-1/2 left-[50%] -translate-x-1/2 -translate-y-1/2">
              <ArchitectureNode
                step="2"
                title="Blip Protocol"
                sub="Matches liquidity & Secures Escrow"
                icon={Lock}
                color="#FBBF24"
                className="scale-110 shadow-[0_0_60px_rgba(251,191,36,0.2)] z-30 bg-[#0A0A0A]"
                delay={200}
                isMain
              />
              <div className="absolute inset-0 rounded-2xl border border-[#FBBF24]/20 animate-ping opacity-20 pointer-events-none" />
            </div>

            {/* Step 3: Receiver */}
            <div className="absolute top-1/2 left-[75%] -translate-x-1/2 -translate-y-1/2">
              <ArchitectureNode
                step="3"
                title="Receiver"
                sub="Receives Fiat via Local Rails"
                icon={Building2}
                color="#00FF94"
                className="shadow-[0_0_40px_rgba(0,255,148,0.1)]"
                delay={400}
                isMain
              />
            </div>

            {/* Step 4: Governance (Top Right) */}
            <div className="absolute top-[25%] left-[75%] -translate-x-1/2 -translate-y-1/2">
              <ArchitectureNode
                step="4"
                title="Governance"
                sub="DAO & Treasury"
                icon={Landmark}
                color="#A855F7"
                className="scale-90 opacity-80 shadow-[0_0_20px_rgba(168,85,247,0.1)]"
              />
            </div>

            {/* Step 5: Merchant Stakers (Bottom Right) */}
            <div className="absolute top-[75%] left-[75%] -translate-x-1/2 -translate-y-1/2">
              <ArchitectureNode
                step="5"
                title="Merchant Stakers"
                sub="Collateral Providers"
                icon={ShieldCheck}
                color="#6366F1"
                className="scale-90 opacity-80 shadow-[0_0_20px_rgba(99,102,241,0.1)]"
              />
            </div>

            {/* Live Logic Indicators (Animating circles) */}
            <div
              className="absolute top-[50%] left-[25%] w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_#3B82F6] animate-[moveRight_3s_linear_infinite]"
              style={{ transform: "translateY(-50%)" }}
            />
            <div
              className="absolute top-[50%] left-[60%] w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_#22C55E] animate-[moveRight_3s_linear_infinite]"
              style={{
                animationDelay: "1.5s",
                transform: "translateY(-50%)",
              }}
            />

            {/* Legend */}
            <div className="absolute bottom-8 left-8 p-4 rounded-xl border border-white/10 bg-black/50 backdrop-blur-md max-w-xs">
              <div className="flex items-center gap-2 mb-2 text-xs text-gray-400 uppercase tracking-widest">
                <Activity size={12} className="text-[#00FF94]" /> Live Logic
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />{" "}
                  Digital Asset Lock
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />{" "}
                  Smart Contract Escrow
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Fiat
                  Settlement
                </div>
              </div>
            </div>
          </div>

          {/* Mobile View */}
          <div className="lg:hidden space-y-4">
            <ArchitectureNode
              step="1"
              title="Sender"
              sub="Locks Crypto"
              icon={Wallet}
              color="#0088FF"
              className="relative w-full translate-x-0 translate-y-0"
              isMain
            />
            <div className="flex justify-center">
              <ArrowRight className="rotate-90 text-gray-600" />
            </div>
            <ArchitectureNode
              step="2"
              title="Protocol"
              sub="Matches & Escrows"
              icon={Lock}
              color="#FBBF24"
              className="relative w-full translate-x-0 translate-y-0"
              isMain
            />
            <div className="flex justify-center">
              <ArrowRight className="rotate-90 text-gray-600" />
            </div>
            <ArchitectureNode
              step="3"
              title="Receiver"
              sub="Gets Fiat"
              icon={Building2}
              color="#00FF94"
              className="relative w-full translate-x-0 translate-y-0"
              isMain
            />
            <div className="flex justify-center mt-4">
              <Zap className="rotate-90 text-[#FBBF24]" size={20} />
            </div>
            {/* Steps 4 and 5 in Mobile View */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700/50">
              <ArchitectureNode
                step="4"
                title="Governance"
                sub="Oversight"
                icon={Landmark}
                color="#A855F7"
                className="relative w-full translate-x-0 translate-y-0"
              />
              <ArchitectureNode
                step="5"
                title="Stakers"
                sub="Collateral"
                icon={ShieldCheck}
                color="#6366F1"
                className="relative w-full translate-x-0 translate-y-0"
              />
            </div>
          </div>
        </div>
      </section>
      {/* --- NEW SECTION 8b: MULTI-PARTY PAYMENTS --- */}
      <section className="py-16 sm:py-24 md:py-32 bg-[#030303] relative border border-white/5 rounded-3xl overflow-hidden shadow-2xl shadow-[#00FF94]/10 max-w-8xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00FF94]/5 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 sm:gap-16 lg:gap-20 items-center">
          {/* Left Content */}
          <div>
            <SectionLabel text="Native Splits" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white tracking-tight">
              Built natively for <br />
              <span
                className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF94] to-cyan-400"
                style={stylesBlip.glowText}
              >
                multi-party payments
              </span>
            </h2>
            <p className="text-xl text-gray-400 leading-relaxed mb-8">
              Blip natively supports multi-vendor basket and payment splits, so
              you don't have to build complex workarounds. Process a single
              transaction and distribute funds instantly.
            </p>
            <div className="space-y-4">
              {[
                "Automated Revenue Sharing",
                "Marketplace Payouts",
                "Commission Splits",
                "Supply Chain Routing",
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#00FF94]/10 flex items-center justify-center border border-[#00FF94]/30 text-[#00FF94]">
                    <CheckCircle size={12} />
                  </div>
                  <span className="text-gray-300 font-mono text-sm">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Visualization (Fan Out) */}
          <div className="relative h-[500px] w-full bg-[#080808] rounded-3xl border border-white/5 flex items-center p-8 overflow-hidden shadow-inner shadow-white/5">
            <div
              style={styles.gridBackground}
              className="absolute inset-0 opacity-10"
            />

            {/* SVG Lines (Bezier curves for dynamic feel) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient
                  id="splitGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#00FF94" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#0088FF" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              {pathPositions.map((pos, i) => (
                // Path drawn from (100, 250) to (450, pos*5), curving towards the right center
                <path
                  key={i}
                  d={`M 100 250 C 250 250, 300 ${pos * 5}, 450 ${pos * 5}`}
                  fill="none"
                  stroke="url(#splitGradient)"
                  strokeWidth="1.5"
                  strokeDasharray="4,4"
                  className="animate-pulse"
                  style={{ animationDelay: `${i * 0.4}s` }}
                />
              ))}
            </svg>

            {/* Source Node (Left: Single Payment) */}
            <div className="absolute left-[8%] top-1/2 -translate-y-1/2 z-20">
              <div className="w-24 h-24 rounded-3xl bg-[#0A0A0A] border-2 border-[#00FF94] shadow-[0_0_30px_rgba(0,255,148,0.3)] flex items-center justify-center relative transition-all duration-300 hover:scale-[1.02]">
                <CreditCard size={40} className="text-[#00FF94]" />
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-sm font-bold text-[#00FF94] whitespace-nowrap bg-[#0A0A0A] px-2 py-1 rounded-md shadow-lg border border-[#00FF94]/50">
                  Single Payment
                </div>
              </div>
            </div>

            {/* Destination Nodes (Right Fan: Recipients) */}
            {/* The py-12 adjustment helps position the elements to align with the SVG paths */}
            <div className="absolute right-[8%] top-0 bottom-0 flex flex-col justify-between py-12 w-44">
              {[
                { label: "Freelancer (35%)", icon: Users, color: "#3B82F6" },
                { label: "Supplier (20%)", icon: Package, color: "#8B5CF6" },
                { label: "Platform Fee (10%)", icon: Store, color: "#00FF94" },
                { label: "Partner (20%)", icon: Handshake, color: "#F59E0B" },
                { label: "Driver (15%)", icon: Truck, color: "#EC4899" },
              ].map((node, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-[#111] border border-white/10 p-3 rounded-xl z-20 transform transition-all duration-300 hover:scale-[1.05] hover:shadow-xl"
                  style={{ borderColor: `${node.color}40` }}
                >
                  <div
                    className="p-2 rounded-lg"
                    style={{
                      backgroundColor: `${node.color}20`,
                      color: node.color,
                    }}
                  >
                    <node.icon size={18} />
                  </div>
                  <span className="text-xs font-bold text-gray-200">
                    {node.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Animated Packets (Small dots moving along the paths) */}
            {pathPositions.map((pos, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-[#00FF94] rounded-full shadow-[0_0_10px_#00FF94] z-30"
                style={{
                  left: "96px", // Aligned with the center of the source node (100px)
                  top: "246px", // Aligned with the center of the source node (250px)
                  animation: `fanOut${i} 3s linear infinite`,
                  animationDelay: `${i * 0.4 + 0.5}s`, // Stagger the start
                }}
              />
            ))}

            {/* CSS Keyframes for the Animation */}
            <style>{`
              ${pathPositions
                .map(
                  (pos, i) => `
                @keyframes fanOut${i} {
                  0% { transform: translate(0, 0); opacity: 0; }
                  10% { opacity: 1; }
                  30% { opacity: 1; } /* Hold full opacity briefly */
                  100% { 
                    /* 350px horizontal shift (100->450) and vertical shift based on endpoint (pos*5) */
                    transform: translate(350px, ${pos * 5 - 250}px); 
                    opacity: 0; 
                  }
                }
              `
                )
                .join("")}
              /* Ensure the pulse animation is defined */
              @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
              }
              .animate-pulse {
                animation: pulse 2s infinite;
              }
            `}</style>
          </div>
        </div>
      </section>

      {/* --- SECTION 9: FINAL HERO --- */}
      <section className="py-20 sm:py-28 md:py-36 lg:py-40 relative flex items-center justify-center overflow-hidden bg-black text-center border-t border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#00FF94]/5 via-black to-black" />
        <div className="relative z-10 max-w-4xl px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 tracking-tight">
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
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">
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
    </div>
  );
};

export default Index;
