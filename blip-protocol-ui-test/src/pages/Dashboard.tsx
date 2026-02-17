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
} from "lucide-react";
import DashboardNavbar from "@/components/DashboardNavbar";
import { api } from "@/services/api";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import PointsHistoryModal from "@/components/PointsHistoryModal";
import ReferralModal from "@/components/ReferralModal";
import WalletLinkingModal from "@/components/WalletLinkingModal";
import TwitterVerificationModal from "@/components/TwitterVerificationModal";
import TelegramVerificationModal from "@/components/TelegramVerificationModal";
import { Footer } from "@/components/Footer";

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
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const sequence = [
      { text: "INITIALIZING DASHBOARD...", delay: 100 },
      { text: "LOADING USER DATA...", delay: 400 },
      { text: "VERIFYING CREDENTIALS...", delay: 800 },
      { text: "ESTABLISHING SECURE CONNECTION...", delay: 1200 },
      { text: "SYNCING REWARDS DATA...", delay: 1800 },
      { text: "WELCOME, USER.", delay: 2400 },
    ];

    let timeouts = [];

    sequence.forEach(({ text, delay }) => {
      const timeout = setTimeout(() => {
        setLogs((prev) => [...prev, text]);
      }, delay);
      timeouts.push(timeout);
    });

    const endTimeout = setTimeout(onComplete, 2800);
    timeouts.push(endTimeout);

    return () => timeouts.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div
      className="
      fixed inset-0 z-[100] flex flex-col items-center justify-center p-8
      bg-gradient-to-br from-white via-gray-100 to-gray-200
      dark:from-black dark:via-[#050505] dark:to-black
      text-black dark:text-white
    "
    >
      <div
        className="
        w-full max-w-lg p-8 rounded-2xl
        bg-white/70 dark:bg-black/70
        backdrop-blur-xl
        border border-black/10 dark:border-white/10
        shadow-xl dark:shadow-[0_0_40px_rgba(255,255,255,0.05)]
      "
      >
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div
            className="
            p-4 rounded-xl
            bg-black/5 dark:bg-white/10
            shadow-inner
          "
          >
            <Terminal className="w-10 h-10 animate-pulse" />
          </div>
        </div>

        {/* Logs */}
        <div className="space-y-2 text-xs uppercase tracking-wider font-mono">
          {logs.map((log, i) => (
            <div key={i} className="flex gap-2">
              <span className="opacity-40">
                [{new Date().toLocaleTimeString()}]
              </span>
              <span className="animate-fadeIn">{log}</span>
            </div>
          ))}

          {/* Blinking cursor */}
          <div className="h-4 w-2 bg-black dark:bg-white animate-pulse mt-2" />
        </div>

        {/* Progress Bar */}
        <div className="mt-8 h-1.5 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className="
            h-full bg-black dark:bg-white
            animate-[width_2.5s_ease-in-out_forwards]
            w-0
          "
          />
        </div>
      </div>
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
      className={`relative overflow-hidden rounded-sm bg-[#0A0A0A] border border-neutral-800 ${className} ${disabled ? "cursor-not-allowed" : ""}`}
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
              className="flex-1 py-3 text-xs font-bold uppercase tracking-wider bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition"
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

  return (
    <div
      onClick={() => !redeemed && onClick(task)}
      className={`w-full text-left p-5 flex flex-col h-full
        border transition-all duration-300 group
        ${
          redeemed
            ? "bg-white dark:bg-white/[0.02] border-green-500/20 dark:border-green-500/20 cursor-default"
            : "bg-white dark:bg-neutral-900/50 border-black/10 dark:border-neutral-800 hover:border-black/30 dark:hover:border-white/40 cursor-pointer"
        }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div
          className={`p-2 border rounded-sm ${
            redeemed
              ? "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400"
              : "bg-black/5 dark:bg-neutral-900 border-black/10 dark:border-neutral-800 text-black dark:text-neutral-400"
          }`}
        >
          <Icon className="w-5 h-5" />
        </div>

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

      <h3 className="text-sm font-medium mb-1 text-black dark:text-neutral-200">
        {title}
      </h3>

      <p className="text-xs text-black/60 dark:text-neutral-500 leading-relaxed mb-4">
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
        <button
          className="mt-auto w-full py-2.5 text-xs font-bold uppercase tracking-wider bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-all rounded-sm"
        >
          Complete Task
        </button>
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
          className="w-full py-3 px-4 bg-black text-white dark:bg-white dark:text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-90 transition-all"
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
        "Follow our official channels on Gleam to verify your identity.",
      reward: "1000",
      status: "active",
      icon: Share2,
      difficulty: "Easy",
    },
    {
      id: "s2",
      title: "Share on X (Twitter)",
      description: "Retweet the latest protocol announcement to earn points.",
      reward: "100",
      status: "active",
      icon: Megaphone,
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
  ],
  activity: [
    {
      id: "a1",
      title: "Deposit USDC Liquidity",
      description:
        "Deposit at least 1000 USDC into the Genesis Vault for 30 days.",
      reward: "5000",
      status: "locked",
      icon: Database,
      difficulty: "Hard",
    },
    {
      id: "a2",
      title: "Swap Tokens on Testnet",
      description: "Complete a token swap on the Goerli Testnet.",
      reward: "500",
      status: "locked",
      icon: Terminal,
      difficulty: "Medium",
    },
    {
      id: "a3",
      title: "Secure Your Vault",
      description: "Deposit ETH collateral to initialize your primary vault.",
      reward: "2500",
      status: "locked",
      icon: Landmark,
      difficulty: "Hard",
    },
    {
      id: "a4",
      title: "Sync Network Node",
      description: "Calibrate your local node with the mainnet beacon chain.",
      reward: "1200",
      status: "active",
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
      status: "locked",
      icon: Vote,
      difficulty: "Easy",
    },
    {
      id: "g2",
      title: "Bug Bounty Program",
      description: "Found a vulnerability? Report it via Immunefi.",
      reward: "Var",
      status: "locked",
      icon: ShieldCheck,
      difficulty: "Expert",
    },
    {
      id: "g3",
      title: "Test Merchant API",
      description: "Process a test transaction using our Merchant API.",
      reward: "5000",
      status: "locked",
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
  const [rewardStatus, setRewardStatus] = useState({
    signup: true,
    telegram: false,
    twitter: false,
  });

  const { publicKey, disconnect, connected } = useWallet();
  const { logout, user, updatePoints } = useAuth();
  const navigate = useNavigate();

  // Show wallet linking modal only if user hasn't linked wallet (first time login)
  // For subsequent sessions, we just show the banner with "Connect Wallet" button
  useEffect(() => {
    if (user && booted) {
      // Auto-open modal only if wallet has never been linked (first time user)
      // Otherwise, user can click the banner or card to connect
      if (!user.walletLinked) {
        setShowWalletLinkingModal(true);
      }
    }
  }, [user, booted]);

  // Check reward verification status
  useEffect(() => {
    const checkRewardStatus = async () => {
      try {
        const [telegramRes, twitterRes]: any[] = await Promise.all([
          api.get("/telegram/status"),
          api.get("/twitter/campaign-status/general_twitter_share"),
        ]);

        setRewardStatus((prev) => ({
          ...prev,
          telegram: !!telegramRes?.data?.verified,
          twitter: !!twitterRes?.data?.completed,
        }));
      } catch (err) {
        console.error("Failed to check reward status:", err);
      }
    };

    if (user && booted) checkRewardStatus();
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

  const handleLogout = async () => {
    await disconnect();
    await logout();
    navigate("/waitlist");
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const handleTaskClick = (task) => {
    // Special handling for Twitter task
    if (task.id === "s2") {
      if (!user?.walletLinked || !publicKey) {
        showToast("Please link your wallet first", "error");
        setShowWalletLinkingModal(true);
        return;
      }
      setShowTwitterModal(true);
      return;
    }

    // Special handling for Telegram task
    if (task.id === "s3") {
      if (!user?.walletLinked || !publicKey) {
        showToast("Please link your wallet first", "error");
        setShowWalletLinkingModal(true);
        return;
      }
      setShowTelegramModal(true);
      return;
    }

    // Default behavior for other tasks
    setSelectedTask(task);
  };

  const handleTaskExecute = () => {
    showToast("Protocol Sequence Initiated");
  };

  const handleTwitterSuccess = (points) => {
    showToast(`Tweet verified! +${points} points awarded`, "success");
    updatePoints(points);
  };

  const handleTelegramSuccess = (points) => {
    showToast(`Telegram verified! +${points} points awarded`, "success");
    updatePoints(points);
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
    if (filter === "all") return categoryTasks;
    return categoryTasks.filter((t) => t.status === "active");
  };

  if (!booted) {
    return (
      <>
        <GlobalStyles />
        <BootSequence onComplete={() => setBooted(true)} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f8] dark:bg-[#030303] text-black/80 dark:text-neutral-400 font-sans selection:bg-black/20 dark:selection:bg-white/20 selection:text-black dark:selection:text-white relative overflow-x-hidden dark:scanline mt-10">
      <GlobalStyles />

      {/* Toast + Modal */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <Modal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onExecute={handleTaskExecute}
      />

      {/* Twitter Verification Modal */}
      <TwitterVerificationModal
        isOpen={showTwitterModal}
        onClose={() => setShowTwitterModal(false)}
        onSuccess={handleTwitterSuccess}
        userWallet={publicKey?.toBase58() || ""}
      />

      {/* Telegram Verification Modal */}
      <TelegramVerificationModal
        isOpen={showTelegramModal}
        onClose={() => setShowTelegramModal(false)}
        onSuccess={handleTelegramSuccess}
      />

      {/* Referral Modal */}
      <ReferralModal
        isOpen={showReferralModal}
        onClose={() => setShowReferralModal(false)}
        referralCode={user?.referralCode || ""}
        referralLink={referralLink}
      />

      {/* Wallet Linking Modal */}
      <WalletLinkingModal
        isOpen={showWalletLinkingModal}
        onClose={() => setShowWalletLinkingModal(false)}
        required={!user?.walletLinked}
      />

      {/* Points History Modal */}
      <PointsHistoryModal
        isOpen={showPointsHistoryModal}
        onClose={() => setShowPointsHistoryModal(false)}
        totalPoints={blipPoints}
      />

      {/* Grid Background */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
          linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px)
        `,
          backgroundSize: "40px 40px",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#f7f7f8] via-transparent to-[#f7f7f8] dark:from-[#030303] dark:to-[#030303]" />
      </div>

      {/* Ambient Glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-black/5 dark:bg-white/10 blur-[120px] rounded-full pointer-events-none z-0 animate-pulse"
        style={{ animationDuration: "4s" }}
      />

      {/* Navbar */}
      <DashboardNavbar
        walletAddress={displayWalletAddress}
        blipPoints={blipPoints}
        onLogout={handleLogout}
        onPointsClick={() => setShowPointsHistoryModal(true)}
      />

      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* ===== STATS GRID ===== */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Wallet Status Card */}
          <div
            className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-6 rounded-sm shadow-sm hover:shadow-md transition-all cursor-pointer"
            onClick={() => !connected && setShowWalletLinkingModal(true)}
          >
            <span className="text-[9px] font-black uppercase tracking-widest text-black/60 dark:text-white/50 block mb-2">
              Wallet Status
            </span>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-black dark:text-white">
                {connected && publicKey
                  ? displayWalletAddress
                  : "Not Connected"}
              </span>
              <div className={`w-2 h-2 rounded-full ${
                connected && publicKey && user?.walletLinked
                  ? "bg-green-600 dark:bg-green-400"
                  : "bg-red-600 dark:bg-red-400 animate-pulse"
              }`} />
            </div>
            {(!connected || !user?.walletLinked) && (
              <p className="text-[10px] text-black/50 dark:text-white/40 mt-2">
                Click to connect wallet
              </p>
            )}
          </div>

          {/* Points Card */}
          <div
            onClick={() => setShowPointsHistoryModal(true)}
            className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-6 rounded-sm shadow-sm hover:shadow-md transition-all cursor-pointer group relative"
          >
            <span className="text-[9px] font-black uppercase tracking-widest text-black/60 dark:text-white/50 block mb-2">
              Accumulated Points
            </span>
            <span className="text-3xl font-black text-black dark:text-white">
              {blipPoints}
            </span>
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black/10 dark:bg-white/10">
              <div
                className="h-full bg-black dark:bg-white transition-all duration-1000"
                style={{
                  width: `${Math.min((blipPoints / 4000) * 100, 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Protocol Status */}
          <div className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-6 rounded-sm shadow-sm">
            <span className="text-[9px] font-black uppercase tracking-widest text-black/60 dark:text-white/50 block mb-2">
              Protocol Status
            </span>
            <span className="text-sm font-bold text-black dark:text-white">
              {user?.status === "ACTIVE" ? "Active Participant" : "Waitlisted"}
            </span>
          </div>

          {/* Referral */}
          <div
            onClick={() => setShowReferralModal(true)}
            className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 p-6 rounded-sm shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <span className="text-[9px] font-black uppercase tracking-widest text-black/70 dark:text-white/70 block mb-2">
              Your Referral Code
            </span>
            <span className="text-lg font-bold text-black dark:text-white">
              {user?.referralCode || "—"}
            </span>
          </div>
        </div>

        {/* ===== WALLET CONNECTION BANNER ===== */}
        {(!connected || !publicKey || !user?.walletLinked) && (
          <div className="mb-6 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-orange-500/10 border border-orange-500/30 dark:border-orange-400/30 rounded-sm p-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-500/20 dark:bg-orange-400/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Wallet className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-black dark:text-white mb-1">
                    Connect Your Wallet
                  </h3>
                  <p className="text-sm text-black/70 dark:text-white/70">
                    {!connected || !publicKey
                      ? "Connect your Solana wallet to participate in campaigns and earn rewards."
                      : "Link your wallet to your account to unlock all features."}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowWalletLinkingModal(true)}
                className="whitespace-nowrap px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold text-sm uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-2 shadow-lg"
              >
                <Wallet className="w-4 h-4" />
                Connect Wallet
              </button>
            </div>
          </div>
        )}

        {/* ===== MAIN CONTENT ===== */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
          <div className="mb-8">
            <h1 className="text-4xl font-semibold text-black dark:text-white mb-2">
              Mission Control
            </h1>
            <p className="text-sm text-black/60 dark:text-white/50">
              Complete verification tasks to initialize vault allocation.
            </p>
          </div>

          {/* Your Task Sections Stay Same */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              <SectionTitle title="Social Quests" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                {getVisibleTasks(TASKS_DATA.social).map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={handleTaskClick}
                    onComingSoon={handleComingSoon}
                    onLocked={handleLocked}
                    redeemed={
                      (task.id === "s2" && rewardStatus.twitter) ||
                      (task.id === "s3" && rewardStatus.telegram)
                    }
                  />
                ))}
              </div>

              <SectionTitle title="On-Chain Activity" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                {getVisibleTasks(TASKS_DATA.activity).map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={handleTaskClick}
                    onComingSoon={handleComingSoon}
                    onLocked={handleLocked}
                  />
                ))}
              </div>

              <SectionTitle title="Core Infrastructure" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getVisibleTasks(TASKS_DATA.core).map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={handleTaskClick}
                    onComingSoon={handleComingSoon}
                    onLocked={handleLocked}
                  />
                ))}
              </div>
            </div>

            <div className="lg:col-span-4">
              <SectionTitle title="Governance & Security" />
              <div className="flex flex-col gap-4">
                {getVisibleTasks(TASKS_DATA.governance).map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={handleTaskClick}
                    onComingSoon={handleComingSoon}
                    onLocked={handleLocked}
                  />
                ))}
              </div>

              {/* System Notice */}
              <div className="mt-8 p-6 border border-black/10 dark:border-neutral-800 bg-black/5 dark:bg-neutral-900/20 rounded-sm">
                <p className="text-[10px] uppercase tracking-widest font-bold mb-3 text-black dark:text-white">
                  System Notice
                </p>
                <p className="text-xs text-black/60 dark:text-neutral-500 leading-relaxed">
                  Rewards non-transferable until TGE. Unauthorized access
                  attempts will result in immediate wallet blacklisting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
