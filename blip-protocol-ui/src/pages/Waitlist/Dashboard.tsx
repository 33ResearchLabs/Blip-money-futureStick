import React, { useState, useEffect, useRef } from "react";
import {
  ShieldCheck,
  Wallet,
  Copy,
  Lock,
  ArrowRight,
  Activity,
  Landmark,
  Database,
  Vote,
  Terminal,
  Cpu,
  Globe,
  Radio,
  Megaphone,
  Share2,
  Users,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Wifi,
  Construction,
  Check,
  Info,
  RefreshCw,
  Clock,
  UserPlus,
  TrendingUp,
  Award,
  Crown,
  Trophy,
  Send,
  Gift,
  Star,
  Plus,
  Layout,
  CheckCircle2,
  Menu,
  Sun,
  Moon,
  LogOut,
  CircleCheck,
  Repeat2,
} from "lucide-react";
import DashboardNavbar from "@/components/DashboardNavbar";
import { api } from "@/services/api";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import PointsHistoryModal from "@/components/PointsHistoryModal";
import ReferralModal from "@/components/ReferralModal";
import WalletLinkingModal from "@/components/WalletLinkingModal";
import TwitterVerificationModal from "@/components/TwitterVerificationModal";
import TelegramVerificationModal from "@/components/TelegramVerificationModal";
import XFollowVerificationModal from "@/components/XFollowVerificationModal";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Navbar";
import { airdropApi } from "@/services/Airdrop";
import { useAutoRefreshLeaderboard } from "@/hooks/useAutoRefreshLeaderboard";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// X (Twitter) brand logo — lucide doesn't ship one
const XBrand = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// --- Global Styles & Keyframes ---
const GlobalStyles = () => (
  <style>{`
    @keyframes scanline {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100%); }
    }
    .scanline::after {
      content: " ";
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
      z-index: 2;
      background-size: 100% 2px, 3px 100%;
      pointer-events: none;
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    .animate-blink {
      animation: blink 1s step-end infinite;
    }
    .text-glow {
      text-shadow: 0 0 10px rgba(249, 115, 22, 0.5);
    }
    .shake {
      animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
    }
    @keyframes shake {
      10%, 90% { transform: translate3d(-1px, 0, 0); }
      20%, 80% { transform: translate3d(2px, 0, 0); }
      30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
      40%, 60% { transform: translate3d(4px, 0, 0); }
    }
  `}</style>
);

// --- Hooks ---

const useCountUp = (end, duration = 1000, start = 0) => {
  const [count, setCount] = useState(start);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;

      if (progress < duration) {
        setCount(Math.min(end, start + (end - start) * (progress / duration)));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, start]);

  return count;
};

const useTypewriter = (text, speed = 30, delay = 0) => {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      let i = 0;
      const intervalId = setInterval(() => {
        setDisplayText(text.substring(0, i + 1));
        i++;
        if (i > text.length) {
          clearInterval(intervalId);
          setIsTyping(false);
        }
      }, speed);
      return () => clearInterval(intervalId);
    }, delay);
    return () => clearTimeout(timeoutId);
  }, [text, speed, delay]);

  return { displayText, isTyping };
};

// --- Specialized Interactive Components ---

const BootSequence = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Initializing");
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const steps = [
      { text: "Initializing", at: 0 },
      { text: "Loading data", at: 20 },
      { text: "Verifying", at: 45 },
      { text: "Syncing", at: 70 },
      { text: "Ready", at: 95 },
    ];

    let frame: number;
    const start = performance.now();
    const duration = 2200;

    const animate = (now: number) => {
      const elapsed = now - start;
      const p = Math.min((elapsed / duration) * 100, 100);
      setProgress(p);

      const current = [...steps].reverse().find((s) => p >= s.at);
      if (current) setStatusText(current.text);

      if (p < 100) {
        frame = requestAnimationFrame(animate);
      } else {
        setFadeOut(true);
        setTimeout(onComplete, 400);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center
        bg-[#FAF8F5] dark:bg-black transition-opacity duration-400
        ${fadeOut ? "opacity-0" : "opacity-100"}`}
    >
      {/* Pulse ring */}
      <div className="relative w-20 h-20 mb-10">
        <div className="absolute inset-0 rounded-full border border-black/10 dark:border-white/10" />
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-black dark:border-t-white animate-spin"
          style={{ animationDuration: "0.8s" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Activity className="w-6 h-6 text-black/70 dark:text-white/70" />
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-48 h-[2px] bg-black/10 dark:bg-white/10 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-black dark:bg-white rounded-full transition-[width] duration-100 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Status text */}
      <p className="text-[11px] uppercase tracking-[0.25em] text-black/40 dark:text-white/40">
        {statusText}
      </p>
    </div>
  );
};

const SpotlightCard = ({ children, className = "", onClick, disabled }) => {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={!disabled ? onClick : undefined}
      className={`relative overflow-hidden rounded-2xl bg-white dark:bg-[#0A0A0A] border border-black/[0.06] dark:border-neutral-800 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.10)] dark:shadow-none ${className} ${disabled ? "cursor-not-allowed" : ""}`}
    >
      {/* Spotlight Effect */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(249, 115, 22, 0.1), transparent 40%)`,
        }}
      />
      {/* Border Highlight Effect */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(249, 115, 22, 0.4), transparent 40%)`,
          maskImage:
            "linear-gradient(black, black), linear-gradient(black, black)",
          maskClip: "content-box, border-box",
          maskComposite: "exclude", // Keeps only the border
          padding: "1px",
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};

// --- Reusable Components (Enhanced) ---

const TechBorder = () => (
  <>
    <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-[#ffffff]/30 transition-all duration-300 group-hover:w-4 group-hover:h-4 group-hover:border-[#ffffff]" />
    <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-[#ffffff]/30 transition-all duration-300 group-hover:w-4 group-hover:h-4 group-hover:border-[#ffffff]" />
    <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-[#ffffff]/30 transition-all duration-300 group-hover:w-4 group-hover:h-4 group-hover:border-[#ffffff]" />
    <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-[#ffffff]/30 transition-all duration-300 group-hover:w-4 group-hover:h-4 group-hover:border-[#ffffff]" />
  </>
);

const Badge = ({ children, type = "neutral" }) => {
  const styles = {
    neutral: "bg-neutral-900/80 text-neutral-400 border-neutral-800",
    orange:
      "bg-[#ffffff]/10 text-[#ffffff] border-[#ffffff]/20 shadow-[0_0_10px_rgba(249,115,22,0.1)]",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };
  return (
    <span
      className={`text-[10px] uppercase tracking-widest  px-2 py-0.5 border ${styles[type]} backdrop-blur-sm transition-all hover:scale-105 select-none`}
    >
      {children}
    </span>
  );
};

const TypewriterText = ({ text, className = "", delay = 0 }) => {
  const { displayText, isTyping } = useTypewriter(text, 20, delay);
  return (
    <span className={`${className}`}>
      {displayText}
      {isTyping && <span className="animate-blink">_</span>}
    </span>
  );
};

const Counter = ({ value, prefix = "", suffix = "" }) => {
  const numValue = parseFloat(value.toString().replace(/,/g, ""));
  const count = useCountUp(isNaN(numValue) ? 0 : numValue, 2000);

  const display = isNaN(numValue)
    ? value
    : count.toLocaleString(undefined, {
        minimumFractionDigits: value.toString().includes(".") ? 2 : 0,
        maximumFractionDigits: 2,
      });

  return (
    <span>
      {prefix}
      {display}
      {suffix}
    </span>
  );
};

const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className="fixed bottom-8 right-8 z-[100] animate-in slide-in-from-right-10 fade-in duration-300 cursor-pointer"
      onClick={onClose}
    >
      <div
        className={`flex items-center gap-3 px-4 py-3 border backdrop-blur-md rounded-sm shadow-[0_0_20px_rgba(0,0,0,0.5)] ${
          type === "success"
            ? "bg-[#050505]/95 border-[#ffffff]/50 text-white shadow-[0_0_10px_rgba(249,115,22,0.2)]"
            : "bg-red-950/90 border-red-500/30 text-red-200"
        }`}
      >
        {type === "success" ? (
          <CheckCircle className="w-4 h-4 text-[#ffffff]" />
        ) : (
          <AlertCircle className="w-4 h-4 text-red-500" />
        )}
        <span className="text-xs  uppercase tracking-wider">{message}</span>
      </div>
    </div>
  );
};

// --- Modal Component ---

const Modal = ({ task, onClose, onExecute }) => {
  const [loading, setLoading] = useState(false);
  const [gleamState, setGleamState] = useState({
    connected: false,
    followed: false,
    verified: false,
    claimed: false,
  });

  const handleExecute = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onExecute();
      onClose();
    }, 1500);
  };

  if (!task) return null;

  const isGleamTask = task.id === "s1";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 dark:bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="relative w-full max-w-lg 
        bg-white dark:bg-[#0A0A0A] 
        border border-black/10 dark:border-neutral-800 
        shadow-2xl"
      >
        <div className="p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-black/50 dark:text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-black/5 dark:bg-neutral-900 border border-black/10 dark:border-neutral-800 text-black dark:text-white">
              <task.icon className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-black dark:text-white uppercase">
                {task.title}
              </h3>

              <span className="text-xs text-black/60 dark:text-neutral-500">
                REWARD: {task.reward} PTS
              </span>
            </div>
          </div>

          <div className="p-5 bg-black/5 dark:bg-neutral-900/30 border border-black/10 dark:border-neutral-800 rounded-sm mb-6">
            <h4 className="text-[10px] uppercase tracking-widest text-black/50 dark:text-neutral-500 mb-2">
              Mission Briefing
            </h4>
            <p className="text-sm text-black/80 dark:text-neutral-300">
              {task.description}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 text-xs uppercase tracking-wider border border-black/10 dark:border-neutral-800 text-black/60 dark:text-neutral-400 hover:bg-black/5 dark:hover:bg-neutral-900"
            >
              Abort
            </button>

            <button
              onClick={handleExecute}
              disabled={loading}
              className="flex-1 py-3 text-xs font-bold uppercase tracking-wider bg-white text-black border border-black/10 hover:scale-[1.01] hover:bg-gray-50 hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)] active:scale-[0.98] transition"
            >
              {loading ? "Processing..." : "Start Task"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TaskCard = ({ task, onClick, redeemed = false }) => {
  const { title, description, reward, status, icon: Icon } = task;
  const isDisabled = status === "coming_soon" || status === "locked";

  return (
    <div
      onClick={() => !redeemed && !isDisabled && onClick(task)}
      className={`w-full text-left p-5 flex flex-col h-full
        border transition-all duration-300 group relative
        ${
          redeemed
            ? "bg-white dark:bg-white/[0.02] border-green-500/20 dark:border-green-500/20 cursor-default"
            : isDisabled
              ? "bg-black/[0.02] dark:bg-neutral-900/20 border-black/5 dark:border-neutral-800/50 cursor-not-allowed opacity-60"
              : "bg-white dark:bg-neutral-900/50 border-black/10 dark:border-neutral-800 hover:border-black/30 dark:hover:border-white/40 cursor-pointer"
        }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div
          className={`p-2 border rounded-sm ${
            isDisabled
              ? "bg-black/[0.03] dark:bg-neutral-900/50 border-black/5 dark:border-neutral-800/50 text-black/30 dark:text-neutral-600"
              : "bg-black/5 dark:bg-neutral-900 border-black/10 dark:border-neutral-800 text-black dark:text-neutral-400"
          }`}
        >
          <Icon className="w-5 h-5" />
        </div>

        {status === "coming_soon" && (
          <span className="text-[10px] tracking-wider px-2 py-0.5 border bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            COMING SOON
          </span>
        )}

        {status === "locked" && (
          <span className="text-[10px] tracking-wider px-2 py-0.5 border bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-black/40 dark:text-neutral-500 flex items-center gap-1">
            <Lock className="w-3 h-3" />
            LOCKED
          </span>
        )}

        {status === "active" && (
          <span
            className={`text-[10px] tracking-wider px-1.5 py-0.5 border ${
              redeemed
                ? "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400"
                : "text-black dark:text-white border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5"
            }`}
          >
            +{reward} PTS
          </span>
        )}
      </div>

      <h3 className={`text-sm font-medium mb-1 ${isDisabled ? "text-black/40 dark:text-neutral-500" : "text-black dark:text-neutral-200"}`}>
        {title}
      </h3>

      <p className={`text-xs leading-relaxed mb-4 ${isDisabled ? "text-black/30 dark:text-neutral-600" : "text-black/60 dark:text-neutral-500"}`}>
        {description}
      </p>

      {redeemed ? (
        <div className="mt-auto flex items-center gap-2 text-green-600 dark:text-green-400">
          <CheckCircle className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Redeemed
          </span>
        </div>
      ) : status === "active" ? (
        <div className="mt-auto text-xs text-black/60 dark:text-neutral-400 uppercase tracking-wider group-hover:translate-x-1 transition-transform">
          Start →
        </div>
      ) : null}
    </div>
  );
};

const EducationCard = ({ onStart }) => (
  <div
    className="w-full p-6 md:p-8 
    bg-white dark:bg-neutral-900/30
    border border-black/10 dark:border-neutral-800
    transition-all duration-300 group"
  >
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
      <div className="flex-1">
        <h2 className="text-2xl md:text-3xl font-medium text-black dark:text-white mb-2">
          Learn the Basics
        </h2>

        <p className="text-sm text-black/60 dark:text-neutral-400 mb-6">
          Understand how the protocol works and earn your first rewards.
        </p>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 text-sm text-black/70 dark:text-neutral-400">
            <div className="w-5 h-5 bg-black/10 dark:bg-neutral-800 rounded-full flex items-center justify-center text-[10px] font-bold">
              1
            </div>
            Read the Whitepaper
          </div>

          <div className="flex items-center gap-3 text-sm text-black/70 dark:text-neutral-400">
            <div className="w-5 h-5 bg-black/10 dark:bg-neutral-800 rounded-full flex items-center justify-center text-[10px] font-bold">
              2
            </div>
            Take the Quiz
          </div>
        </div>
      </div>

      <div
        className="w-full md:w-72 p-4 
        bg-black/5 dark:bg-neutral-900/30
        border border-black/10 dark:border-neutral-800"
      >
        <div className="text-[10px] text-black/60 dark:text-neutral-400 mb-3 uppercase tracking-wider">
          Your Progress
        </div>

        <div className="h-1.5 w-full bg-black/10 dark:bg-neutral-800 mb-6">
          <div className="h-full w-1/4 bg-black dark:bg-white" />
        </div>

        <button
          onClick={onStart}
          className="w-full py-3 px-4 bg-white text-black border border-black/10 text-[10px] font-bold uppercase tracking-[0.2em] hover:scale-[1.01] hover:bg-gray-50 hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)] active:scale-[0.98] transition-all"
        >
          Continue
        </button>
      </div>
    </div>
  </div>
);

const SectionTitle = ({ title, count }) => (
  <div className="flex items-center gap-3 mb-6 mt-14 pb-3 border-b border-black/10 dark:border-neutral-900">
    {/* Dot */}
    <div className="w-1.5 h-1.5 bg-black dark:bg-white shadow-none dark:shadow-[0_0_5px_white]" />

    {/* Title */}
    <h2 className="text-xs font-bold text-black dark:text-white uppercase tracking-[0.2em] transition-colors cursor-default">
      {title}
    </h2>

    {/* Count */}
    {count !== undefined && (
      <span className="text-[10px] text-black/60 dark:text-neutral-500 bg-black/5 dark:bg-neutral-900/50 border border-black/10 dark:border-neutral-800 px-2 py-0.5 rounded-sm">
        {count.toString().padStart(2, "0")}
      </span>
    )}
  </div>
);

// --- Data Definitions (REVISED FOR CLARITY) ---
const TASKS_DATA = {
  social: [
    {
      id: "s1",
      title: "Complete Social Quest",
      description:
        "Follow our official channels to verify your identity.",
      reward: "1000",
      status: "hidden",
      icon: Share2,
      difficulty: "Easy",
    },
    // Card order mirrors MerchantDashboard:
    //   1. Follow Us on X     2. Follow Us on Telegram
    //   3. Share on X (Tweet) 4. Share Referral Link
    {
      id: "s4",
      title: "Follow on X (Twitter)",
      description: "Follow @blip_money on X to stay updated and earn points.",
      reward: "50",
      status: "active",
      icon: UserPlus,
      difficulty: "Very Easy",
    },
    {
      id: "s3",
      title: "Join Telegram Channel",
      description: "Join our Telegram channel and verify your membership to earn points.",
      reward: "100",
      status: "active",
      icon: Users,
      difficulty: "Easy",
    },
    {
      id: "s2",
      title: "Share on X (Twitter)",
      description: "Post about Blip Money on X with the campaign message to earn points.",
      reward: "100",
      status: "active",
      icon: Megaphone,
      difficulty: "Very Easy",
    },
    {
      id: "referral",
      title: "Share Referral Link",
      description:
        "Earn 100 pts per user signup or 1,000 pts per merchant signup.",
      reward: "100",
      status: "active",
      icon: Share2,
      difficulty: "Easy",
    },
  ],
  activity: [
    {
      id: "a1",
      title: "Deposit USDC Liquidity",
      description:
        "Deposit at least 1000 USDC into the Genesis Vault for 30 days.",
      reward: "5000",
      status: "coming_soon",
      icon: Database,
      difficulty: "Hard",
    },
    {
      id: "a2",
      title: "Swap Tokens on Testnet",
      description: "Complete a token swap on the Goerli Testnet.",
      reward: "500",
      status: "coming_soon",
      icon: Terminal,
      difficulty: "Medium",
    },
    {
      id: "a3",
      title: "Secure Your Vault",
      description: "Deposit ETH collateral to initialize your primary vault.",
      reward: "2500",
      status: "coming_soon",
      icon: Landmark,
      difficulty: "Hard",
    },
    {
      id: "a4",
      title: "Sync Network Node",
      description: "Calibrate your local node with the mainnet beacon chain.",
      reward: "1200",
      status: "coming_soon",
      icon: Cpu,
      difficulty: "Expert",
    },
  ],
  core: [
    {
      id: "c1",
      title: "Run Validator Node",
      description: "Support network consensus by running a validator.",
      reward: "2000",
      status: "coming_soon",
      icon: Globe,
      difficulty: "Expert",
    },
    {
      id: "c2",
      title: "Deploy Smart Vault",
      description: "Deploy your own personal savings contract on-chain.",
      reward: "1000",
      status: "coming_soon",
      icon: Lock,
      difficulty: "Hard",
    },
  ],
  governance: [
    {
      id: "g1",
      title: "Vote on Proposal",
      description: "Cast your vote on the Fee Structure Amendment (BIP-12).",
      reward: "150",
      status: "coming_soon",
      icon: Vote,
      difficulty: "Easy",
    },
    {
      id: "g2",
      title: "Bug Bounty Program",
      description: "Found a vulnerability? Report it via Immunefi.",
      reward: "Var",
      status: "coming_soon",
      icon: ShieldCheck,
      difficulty: "Expert",
    },
    {
      id: "g3",
      title: "Test Merchant API",
      description: "Process a test transaction using our Merchant API.",
      reward: "5000",
      status: "coming_soon",
      icon: Wallet,
      difficulty: "Hard",
    },
  ],
};

// --- Main Layout ---

export default function BlipDashboard() {
  const [booted, setBooted] = useState(false);
  const [filter, setFilter] = useState("all");
  const [selectedTask, setSelectedTask] = useState(null);
  const [toast, setToast] = useState(null);
  const [isWalletConnected, setIsWalletConnected] = useState(true);

  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [walletCopied, setWalletCopied] = useState(false);
  const [showPointsHistoryModal, setShowPointsHistoryModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showWalletLinkingModal, setShowWalletLinkingModal] = useState(false);
  const [showTwitterModal, setShowTwitterModal] = useState(false);
  const [showTelegramModal, setShowTelegramModal] = useState(false);
  const [showXFollowModal, setShowXFollowModal] = useState(false);
  const [rewardStatus, setRewardStatus] = useState({
    signup: true,
    telegram: false,
    twitter: false,
    xFollow: false,
  });

  const { publicKey, disconnect, connected } = useWallet();
  const { logout, user, updatePoints, refreshSession } = useAuth();
  const [isRefreshingPoints, setIsRefreshingPoints] = useState(false);
  const navigate = useNavigate();
  const { resolvedTheme, setTheme } = useTheme();
  const d = resolvedTheme === "dark" || resolvedTheme === undefined;

  // Leaderboard + referrals data for the merchant-style layout
  const { data: leaderboardData, isRefreshing: leaderboardLoading, refresh: refreshLeaderboard } =
    useAutoRefreshLeaderboard(!!user);
  const [lbFilter, setLbFilter] = useState("Points");
  const [referralCount, setReferralCount] = useState(0);
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const navMenuRef = useRef<HTMLDivElement>(null);

  // Fetch referrals count for the hero stats
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const res: any = await airdropApi.getMyReferrals();
        const list = res?.referrals || res?.data?.referrals || [];
        setReferralCount(Array.isArray(list) ? list.length : 0);
      } catch {
        // ignore — leave count at 0
      }
    })();
  }, [user]);

  // Close the nav menu when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navMenuRef.current && !navMenuRef.current.contains(e.target as Node)) {
        setNavMenuOpen(false);
      }
    };
    if (navMenuOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [navMenuOpen]);

  // Wallet linking is optional — the modal opens only when the user
  // explicitly clicks the wallet status card or "Connect Wallet" banner.

  // Check reward verification status
  useEffect(() => {
    const checkRewardStatus = async () => {
      try {
        const [telegramRes, twitterRes, xFollowRes]: any[] = await Promise.all([
          api.get("/telegram/status"),
          api.get("/twitter/campaign-status/general_twitter_share"),
          api.get("/twitter/campaign-status/x_follow").catch(() => ({ data: { completed: false } })),
        ]);

        setRewardStatus((prev) => ({
          ...prev,
          telegram: !!telegramRes?.data?.verified,
          twitter: !!twitterRes?.data?.completed,
          xFollow: !!xFollowRes?.data?.completed,
        }));
      } catch (err) {
        // Failed to check reward status
      }
    };

    if (user && booted) checkRewardStatus();
  }, [user, booted]);

  // Telegram link status
  const [dismissedTelegramBanner, setDismissedTelegramBanner] = useState(
    () => localStorage.getItem("blip_dismiss_telegram_banner") === "true"
  );
  const [telegramLink, setTelegramLink] = useState<{
    linked: boolean;
    telegram_username?: string;
    telegramPoints: number;
    totalPoints: number;
  } | null>(null);

  useEffect(() => {
    const fetchTelegramLink = async () => {
      try {
        const res = await airdropApi.getRedeemStatus() as any;
        if (res.success) setTelegramLink(res.data);
      } catch {
        // ignore
      }
    };
    if (user && booted) fetchTelegramLink();
  }, [user, booted]);

  if (!booted) {
    return (
      <>
        <GlobalStyles />
        <BootSequence onComplete={() => setBooted(true)} />
      </>
    );
  }

  const displayWalletAddress = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
    : "Not Connected";

  const blipPoints = user?.totalBlipPoints ?? 0;

  const referralLink = user?.referralCode
    ? `${import.meta.env.VITE_FRONTEND_URL}/register?ref=${user.referralCode}`
    : "";

  const handleCopyWalletAddress = async () => {
    if (!publicKey) return;
    await navigator.clipboard.writeText(publicKey.toBase58());
    setWalletCopied(true);
    showToast("Wallet copied");
    setTimeout(() => setWalletCopied(false), 2000);
  };

  const handleCopyReferralCode = async () => {
    if (!user?.referralCode) return;
    await navigator.clipboard.writeText(user.referralCode);
    setCopied(true);
    showToast("Referral code copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyAffiliateLink = async () => {
    if (!referralLink) return;
    await navigator.clipboard.writeText(referralLink);
    setLinkCopied(true);
    showToast("Affiliate link copied");
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleShareReferral = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Join Blip Money",
        text: `Join Blip Money and earn rewards! Use my referral code: ${user?.referralCode}`,
        url: referralLink,
      });
    } else {
      handleCopyAffiliateLink();
    }
  };

  const handleRefreshPoints = async () => {
    setIsRefreshingPoints(true);
    try {
      await refreshSession();
      showToast("Points refreshed", "success");
    } catch {
      showToast("Failed to refresh points", "error");
    } finally {
      setIsRefreshingPoints(false);
    }
  };

  const handleLogout = async () => {
    await disconnect();
    await logout();
    navigate("/waitlist");
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const handleTaskClick = (task) => {
    // Open verification modals for social tasks
    if (task.id === "s4") {
      setShowXFollowModal(true);
      return;
    }
    if (task.id === "s2") {
      setShowTwitterModal(true);
      return;
    }
    if (task.id === "s3") {
      setShowTelegramModal(true);
      return;
    }
    if (task.id === "referral") {
      setShowReferralModal(true);
      return;
    }

    // Coming soon / locked tasks
    if (task.status === "coming_soon") {
      handleComingSoon();
      return;
    }
    if (task.status === "locked") {
      handleLocked();
      return;
    }

    // Default behavior for other active tasks
    setSelectedTask(task);
  };

  const handleTaskExecute = () => {
    showToast("Protocol Sequence Initiated");
  };

  const handleTwitterSuccess = (points) => {
    showToast(`Tweet verified! +${points} points awarded`, "success");
    updatePoints(points);
    setRewardStatus((prev) => ({ ...prev, twitter: true }));
  };

  const handleTelegramSuccess = (points) => {
    showToast(`Telegram verified! +${points} points awarded`, "success");
    updatePoints(points);
    setRewardStatus((prev) => ({ ...prev, telegram: true }));
  };

  const handleXFollowSuccess = (points) => {
    showToast(`X follow verified! +${points} points awarded`, "success");
    updatePoints(points);
    setRewardStatus((prev) => ({ ...prev, xFollow: true }));
  };

  const handleComingSoon = () => {
    showToast("Module Inactive: Awaiting Mainnet Upgrade", "error");
  };

  const handleLocked = () => {
    showToast("Access Denied: Prerequisites Incomplete", "error");
  };

  const handleStepClick = (step) => {
    if (step === "reading") showToast("Opening Reading Module...", "success");
    if (step === "verify") showToast("Verification Engine Offline", "error");
  };

  const getVisibleTasks = (categoryTasks) => {
    // Always drop quests flagged as "hidden" (e.g. s1 Gleam — not shipping yet)
    const visible = categoryTasks.filter((t) => t.status !== "hidden");
    if (filter === "all") return visible;
    return visible.filter((t) => t.status === "active");
  };

  if (!booted) {
    return (
      <>
        <GlobalStyles />
        <BootSequence onComplete={() => setBooted(true)} />
      </>
    );
  }

  // ── Theme tokens — match MerchantDashboard ────────────────────────────
  const bg = d ? "bg-black" : "bg-[#FAF8F5]";
  const surface = d ? "bg-[#0f0f0f]" : "bg-white";
  const border = d ? "border-white/[0.06]" : "border-black/[0.08]";
  const txt = d ? "text-white" : "text-black";
  const muted = d ? "text-white/60" : "text-black/60";
  const sub = d ? "text-white/40" : "text-black/40";
  const hov = d ? "hover:bg-white/5" : "hover:bg-black/[0.03]";
  const inputBg = d ? "bg-white/5" : "bg-[#F5F3F0]";
  const divider = d ? "border-white/[0.06]" : "border-black/[0.06]";
  const accentBg = d ? "bg-white" : "bg-black";

  // ── Progress gauge (BLIP points vs next milestone) ────────────────────
  const milestones = [100, 250, 500, 1000, 2500];
  const nextMilestone =
    milestones.find((m) => m > blipPoints) ?? milestones[milestones.length - 1];
  const unlockedPercent = Math.min(100, (blipPoints / nextMilestone) * 100);
  const gaugeEmpty = d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)";
  const gaugeFilled = [
    { value: unlockedPercent, color: d ? "#ffffff" : "#000000" },
    { value: 100 - unlockedPercent, color: gaugeEmpty },
  ];

  // Per-quest reward overrides for the user-side cards (icons + reward labels)
  const questPresentation: Record<string, { icon: any; reward: string }> = {
    s1: { icon: Share2, reward: "+1,000 PTS" },
    s4: { icon: XBrand, reward: "+50 PTS" },
    s2: { icon: Send, reward: "+100 PTS" },
    s3: { icon: Users, reward: "+100 PTS" },
    referral: { icon: Share2, reward: "+100 PTS" },
  };

  return (
    <div className={`min-h-screen ${bg} ${txt} font-sans antialiased`}>
      <GlobalStyles />

      {/* Toast (preserved from original — same data flow) */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Generic task modal — still mounted for any fall-through active task */}
      <Modal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onExecute={handleTaskExecute}
      />

      {/* All verification + utility modals — wiring unchanged */}
      <TwitterVerificationModal
        isOpen={showTwitterModal}
        onClose={() => setShowTwitterModal(false)}
        onSuccess={handleTwitterSuccess}
        userWallet={publicKey?.toBase58() || ""}
      />
      <TelegramVerificationModal
        isOpen={showTelegramModal}
        onClose={() => setShowTelegramModal(false)}
        onSuccess={handleTelegramSuccess}
      />
      <XFollowVerificationModal
        isOpen={showXFollowModal}
        onClose={() => setShowXFollowModal(false)}
        onSuccess={handleXFollowSuccess}
        userRole={user?.role}
      />
      <ReferralModal
        isOpen={showReferralModal}
        onClose={() => setShowReferralModal(false)}
        referralCode={user?.referralCode || ""}
        referralLink={referralLink}
      />
      <WalletLinkingModal
        isOpen={showWalletLinkingModal}
        onClose={() => setShowWalletLinkingModal(false)}
      />
      <PointsHistoryModal
        isOpen={showPointsHistoryModal}
        onClose={() => setShowPointsHistoryModal(false)}
        totalPoints={blipPoints}
      />

      {/* ── Navbar (inline, mirrors MerchantDashboard) ─────────────────── */}
      <header className={`${surface} border-b ${border} sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6 md:gap-10">
            <Logo />
            <nav className="hidden md:flex items-center gap-1 text-[13px] font-semibold">
              <button
                onClick={() => navigate("/dashboard")}
                className={`relative px-3 py-1.5 ${txt} font-bold`}
              >
                Dashboard
                <span
                  className={`absolute left-2 right-2 -bottom-[22px] h-[2px] ${d ? "bg-white" : "bg-black"}`}
                />
              </button>
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setShowPointsHistoryModal(true)}
              className={`${inputBg} border ${border} rounded-md px-3 py-1.5 flex items-center gap-2.5 ${hov} transition`}
              title="View points history"
            >
              <div className="text-left">
                <div className={`text-[8px] font-black uppercase tracking-[0.18em] ${sub} leading-none mb-0.5`}>
                  Protocol Balance
                </div>
                <div className={`text-[11px] font-bold ${txt} leading-none`}>
                  {blipPoints.toLocaleString()} pts
                </div>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </button>
            <button
              onClick={() => setShowWalletLinkingModal(true)}
              className={`${inputBg} border ${border} rounded-md px-3 py-1.5 flex items-center gap-2.5 ${hov} transition`}
              title={connected && publicKey ? "Wallet connected" : "Connect wallet"}
            >
              <div className="text-left">
                <div className={`text-[8px] font-black uppercase tracking-[0.18em] ${sub} leading-none mb-0.5`}>
                  Wallet
                </div>
                <div className={`text-[11px] font-bold ${txt} leading-none`}>
                  {connected && publicKey ? displayWalletAddress : "Not Connected"}
                </div>
              </div>
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  connected && publicKey && user?.walletLinked ? "bg-emerald-500" : "bg-red-500"
                }`}
              />
            </button>
            <button
              onClick={() => setTheme(d ? "light" : "dark")}
              className={`w-9 h-9 rounded-md flex items-center justify-center border ${border} ${inputBg} ${hov}`}
              title="Toggle theme"
            >
              {d ? <Sun className={`w-4 h-4 ${txt}`} /> : <Moon className={`w-4 h-4 ${txt}`} />}
            </button>
            <div className="relative" ref={navMenuRef}>
              <button
                onClick={() => setNavMenuOpen(!navMenuOpen)}
                className={`w-9 h-9 rounded-md flex items-center justify-center border ${border} ${inputBg} ${hov}`}
              >
                <Menu className={`w-4 h-4 ${txt}`} />
              </button>
              {navMenuOpen && (
                <div className={`absolute right-0 mt-2 w-60 ${surface} border ${border} rounded-xl shadow-xl overflow-hidden z-50`}>
                  <div className={`px-4 py-3 border-b ${divider} flex items-center gap-3`}>
                    <div className="w-9 h-9 bg-gradient-to-tr from-black to-black/70 dark:from-white dark:to-white/70 rounded-full flex items-center justify-center text-white dark:text-black text-sm font-black uppercase shrink-0">
                      {(user?.email || "U").charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-bold ${txt} truncate`}>
                        {user?.email?.split("@")[0] || "User"}
                      </p>
                      <p className={`text-[10px] ${sub} truncate`}>{user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleRefreshPoints}
                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold ${txt} ${hov} transition-colors`}
                  >
                    <RefreshCw className={`w-4 h-4 ${isRefreshingPoints ? "animate-spin" : ""}`} /> Refresh Points
                  </button>
                  <button
                    onClick={async () => {
                      setNavMenuOpen(false);
                      await handleLogout();
                    }}
                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-red-500 ${hov} transition-colors`}
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden">
            <button
              onClick={() => setNavMenuOpen(!navMenuOpen)}
              className={`w-9 h-9 rounded-md flex items-center justify-center border ${border} ${inputBg}`}
            >
              <Menu className={`w-5 h-5 ${txt}`} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Main grid ──────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 relative z-10 lg:min-h-[calc(100vh-64px)] lg:flex lg:flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mb-3 lg:items-stretch">
          {/* LEFT COLUMN: Hero + Social Quests + Invite Friends */}
          <div className="lg:col-span-8 flex flex-col gap-3">
            {/* Hero card */}
            <div className={`${surface} border ${border} rounded-xl p-5 md:p-6 relative overflow-hidden`}>
              <div
                className="absolute top-0 right-0 bottom-0 w-1/2 opacity-50 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle, ${d ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.12)"} 1.2px, transparent 1.2px)`,
                  backgroundSize: "14px 14px",
                  maskImage: "linear-gradient(to right, transparent, black 40%, black)",
                  WebkitMaskImage: "linear-gradient(to right, transparent, black 40%, black)",
                }}
              />
              <div className="relative z-10">
                <h1 className={`text-3xl sm:text-4xl md:text-[44px] font-black font-display mb-2 tracking-tight leading-tight`}>
                  <span className={txt}>Refer Friends. </span>
                  <span className="text-[#ff6b35]">Earn More.</span>
                </h1>
                <p className={`text-sm ${muted} mb-5 max-w-md leading-relaxed`}>
                  Earn <span className={`font-bold ${txt}`}>100 pts</span> when a friend joins as a user, or{" "}
                  <span className={`font-bold ${txt}`}>1,000 pts</span> when they join as a merchant.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-5">
                  <button
                    onClick={() => setShowPointsHistoryModal(true)}
                    className={`flex items-start gap-3 text-left group ${hov} rounded-md -m-1 p-1 transition`}
                    title="View points history"
                  >
                    <TrendingUp className={`w-5 h-5 ${txt} shrink-0 mt-0.5`} />
                    <div>
                      <p className={`text-2xl font-black font-display ${txt} leading-none mb-0.5`}>
                        {blipPoints.toLocaleString()}{" "}
                        <span className="text-xs font-bold">pts</span>
                      </p>
                      <p className={`text-[11px] font-bold ${txt}`}>BLIP Points</p>
                      <p className={`text-[10px] ${muted} font-semibold flex items-center gap-1 group-hover:underline`}>
                        View History <ArrowRight className="w-2.5 h-2.5" />
                      </p>
                    </div>
                  </button>
                  <div className="flex items-start gap-3">
                    <UserPlus className={`w-5 h-5 ${txt} shrink-0 mt-0.5`} />
                    <div>
                      <p className={`text-2xl font-black font-display ${txt} leading-none mb-0.5`}>
                        {referralCount}
                      </p>
                      <p className={`text-[11px] font-bold ${txt}`}>Your Referrals</p>
                      <p className={`text-[10px] ${sub}`}>Friends joined with your code</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Award className={`w-5 h-5 ${txt} shrink-0 mt-0.5`} />
                    <div>
                      <p className={`text-2xl font-black font-display ${txt} leading-none mb-0.5`}>
                        {(referralCount * 100).toLocaleString()}
                        <span className="text-xs font-bold ml-0.5">pts+</span>
                      </p>
                      <p className={`text-[11px] font-bold ${txt}`}>Referral Earnings</p>
                      <p className={`text-[10px] ${sub}`}>100 pts user / 1,000 pts merchant</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-5">
                  <button
                    onClick={() => setShowReferralModal(true)}
                    className={`text-[11px] font-bold uppercase tracking-[0.12em] ${muted} hover:${txt} flex items-center gap-1.5 transition-colors`}
                  >
                    Share Code <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Social Quests grid */}
            <div id="social-quests">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-1.5 rounded-md ${inputBg} border ${border}`}>
                  <Layout className={`w-3.5 h-3.5 ${txt}`} />
                </div>
                <div>
                  <h2 className={`text-sm font-black uppercase tracking-[0.18em] ${txt}`}>
                    Social Quests
                  </h2>
                  <p className={`text-[11px] ${muted}`}>
                    Complete quests to earn points and boost your rewards
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {getVisibleTasks(TASKS_DATA.social).map((task) => {
                  const isRedeemed =
                    (task.id === "s2" && rewardStatus.twitter) ||
                    (task.id === "s3" && rewardStatus.telegram) ||
                    (task.id === "s4" && rewardStatus.xFollow) ||
                    (task.id === "referral" && referralCount > 0);
                  const isComingSoon = task.status === "coming_soon";
                  const isLocked = task.status === "locked";
                  const preset = questPresentation[task.id] ?? { icon: Share2, reward: `+${task.reward} PTS` };
                  const QuestIcon = preset.icon;
                  return (
                    <div
                      key={task.id}
                      className={`${surface} border ${border} rounded-xl p-4 flex flex-col ${isRedeemed || isComingSoon || isLocked ? "opacity-70" : ""}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className={`p-2 rounded-md ${inputBg} border ${border}`}>
                          <QuestIcon className={`w-4 h-4 ${txt}`} />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-[0.12em] text-emerald-500 whitespace-nowrap pt-1">
                          {preset.reward}
                        </span>
                      </div>
                      <div className="mb-3">
                        <h3 className={`text-sm font-bold ${txt} mb-0.5 leading-tight`}>
                          {task.title}
                        </h3>
                        <p className={`text-[11px] ${muted} leading-relaxed`}>
                          {task.description}
                        </p>
                      </div>
                      <div className="mt-auto flex justify-end">
                        {isRedeemed ? (
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-500">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Redeemed
                          </div>
                        ) : isComingSoon ? (
                          <div className={`text-[11px] font-bold uppercase tracking-[0.12em] ${sub}`}>
                            Coming Soon
                          </div>
                        ) : isLocked ? (
                          <div className={`text-[11px] font-bold uppercase tracking-[0.12em] ${sub} flex items-center gap-1`}>
                            <Lock className="w-3 h-3" /> Locked
                          </div>
                        ) : (
                          <button
                            onClick={() => handleTaskClick(task)}
                            className={`${accentBg} ${d ? "text-black" : "text-white"} px-6 py-2 rounded-md text-[11px] font-bold uppercase tracking-[0.14em] hover:opacity-90 active:scale-[0.98] transition`}
                          >
                            Start
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Invite Friends — pinned to bottom of left column */}
            <div className={`${surface} border ${border} rounded-xl p-4 mt-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${inputBg} border ${border} flex items-center justify-center shrink-0`}>
                  <Users className={`w-5 h-5 ${txt}`} />
                </div>
                <div>
                  <p className={`text-sm font-bold ${txt}`}>Invite Friends. Earn More.</p>
                  <p className={`text-[11px] ${muted} leading-relaxed`}>
                    Earn 100 pts per user signup — 1,000 pts if they join as a merchant.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div>
                  <p className={`text-[10px] font-bold uppercase tracking-[0.14em] ${sub}`}>
                    Your Referrals
                  </p>
                  <p className={`text-lg font-black font-display ${txt} leading-tight`}>
                    {referralCount}
                  </p>
                </div>
                <button
                  onClick={() => setShowReferralModal(true)}
                  className={`${inputBg} border ${border} rounded-md px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] ${txt} ${hov} transition`}
                >
                  View Referrals
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Referral Code + Progress + Leaderboard stacked */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            {/* Referral Code card — clickable, opens Referral modal */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => setShowReferralModal(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setShowReferralModal(true);
                }
              }}
              className={`${surface} border ${border} rounded-xl p-4 cursor-pointer ${hov} hover:border-black/20 dark:hover:border-white/20 transition-all`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-1.5 h-1.5 rounded-full ${d ? "bg-white" : "bg-black"}`} />
                <span className={`text-[10px] font-black uppercase tracking-[0.18em] ${sub}`}>
                  Your Referral Code
                </span>
              </div>
              <div className={`flex items-center justify-between mb-2 ${inputBg} border ${border} rounded-md px-3 py-2.5`}>
                <span className={`text-base font-black font-display ${txt} tracking-[0.08em]`}>
                  {user?.referralCode || "—"}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyReferralCode();
                  }}
                  className={`p-1 rounded ${hov} transition`}
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className={`w-4 h-4 ${muted}`} />
                  )}
                </button>
              </div>
              <p className={`text-[11px] ${muted} mb-3 leading-relaxed`}>
                Earn <span className={`font-bold ${txt}`}>100 pts</span> per user signup or{" "}
                <span className={`font-bold ${txt}`}>1,000 pts</span> per merchant signup.
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowReferralModal(true);
                }}
                className={`w-full py-2 ${inputBg} border ${border} rounded-md text-[11px] font-bold uppercase tracking-[0.12em] ${txt} flex items-center justify-center gap-2 ${hov} transition-all`}
              >
                <Share2 className="w-3.5 h-3.5" />
                Share Code
              </button>
            </div>

            {/* Your Progress */}
            <div className={`${surface} border ${border} rounded-xl p-4`}>
              <div className={`text-[10px] font-black uppercase tracking-[0.18em] ${sub} mb-1`}>
                Your Progress
              </div>
              <div className="flex flex-col items-center pt-1 pb-1">
                <div className="relative w-36 h-20">
                  <ResponsiveContainer width="100%" height={76}>
                    <PieChart>
                      <Pie
                        data={gaugeFilled}
                        cx="50%"
                        cy="100%"
                        startAngle={180}
                        endAngle={0}
                        innerRadius={52}
                        outerRadius={66}
                        dataKey="value"
                        stroke="none"
                      >
                        {gaugeFilled.map((e, i) => (
                          <Cell key={i} fill={e.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
                    <p className={`text-xl font-black font-display ${txt} leading-none`}>
                      {blipPoints.toLocaleString()}
                    </p>
                    <p className={`text-[9px] font-bold uppercase tracking-[0.16em] ${sub} mt-0.5`}>
                      Total Points
                    </p>
                  </div>
                </div>
                <p className={`text-[10px] ${muted} mt-2`}>
                  Next Milestone:{" "}
                  <span className={`font-bold ${txt}`}>{nextMilestone.toLocaleString()} pts</span>
                </p>
              </div>
              <div className={`pt-2 border-t ${divider} space-y-0.5`}>
                {milestones.map((m) => {
                  const achieved = blipPoints >= m;
                  return (
                    <div key={m} className="flex items-center justify-between py-0.5">
                      <div className="flex items-center gap-2">
                        <Plus className={`w-3 h-3 ${achieved ? txt : sub}`} />
                        <span className={`text-[11px] ${achieved ? txt : muted} font-medium`}>
                          {m.toLocaleString()} pts
                        </span>
                      </div>
                      {achieved ? (
                        <Check className={`w-3.5 h-3.5 ${txt}`} />
                      ) : (
                        <Lock className={`w-3 h-3 ${sub}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Leaderboard */}
            <div className={`${surface} border ${border} rounded-xl overflow-hidden flex flex-col flex-1 min-h-0`}>
              <div className={`px-4 py-2.5 border-b ${divider} flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <Trophy className={`w-3.5 h-3.5 ${txt}`} />
                  <span className={`text-[10px] font-black uppercase tracking-[0.18em] ${sub}`}>
                    Leaderboard
                  </span>
                </div>
                <button
                  onClick={() => {
                    setLbFilter(lbFilter === "Points" ? "Followers" : "Points");
                    refreshLeaderboard?.();
                  }}
                  className={`text-[10px] font-bold ${muted} hover:${txt} transition-colors`}
                >
                  View All
                </button>
              </div>

              <div className="px-1.5 py-1 max-h-[200px] overflow-y-auto flex-1">
                {leaderboardLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className={`w-5 h-5 animate-spin ${sub}`} />
                  </div>
                ) : !leaderboardData || leaderboardData.length === 0 ? (
                  <div className={`text-center py-8 text-xs ${sub}`}>
                    No participants yet. Be the first!
                  </div>
                ) : (
                  leaderboardData.slice(0, 5).map((item: any) => (
                    <div
                      key={`${item.rank}-${item.name}`}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg ${hov} cursor-pointer group`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-4 shrink-0 flex items-center justify-center">
                          {item.rank <= 3 ? (
                            <Crown className={`w-3.5 h-3.5 ${txt}`} />
                          ) : (
                            <span className={`text-[11px] font-bold ${sub}`}>{item.rank}</span>
                          )}
                        </span>
                        <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-black to-black/70 dark:from-white dark:to-white/70 flex items-center justify-center text-white dark:text-black text-[8px] font-black uppercase shrink-0">
                          {item.name[0]}
                        </div>
                        <span className={`text-[11px] font-semibold ${txt} truncate`}>
                          {item.name}
                        </span>
                        {item.verified && (
                          <CircleCheck className={`w-3 h-3 ${txt} shrink-0`} />
                        )}
                      </div>
                      <span className={`text-[11px] font-black font-display ${txt} shrink-0`}>
                        {(item.allocation || 0).toLocaleString()} pts
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer skipAnimation />
    </div>
  );
}
