// import React, { useState, useEffect } from "react";
// import {
//   Copy,
//   Share2,
//   X,
//   CheckCircle,
//   AlertCircle,
//   Loader2,
//   Check,
// } from "lucide-react";
// import DashboardNavbar from "@/components/DashboardNavbar";
// import { useWallet } from "@solana/wallet-adapter-react";
// import { useAuth } from "@/contexts/AuthContext";
// import { useNavigate } from "react-router-dom";
// import { Footer } from "@/components/Footer";
// import ReferralModal from "@/components/ReferralModal";
// import PointsHistoryModal from "@/components/PointsHistoryModal";

// /* ---------- Global Styles ---------- */
// const GlobalStyles = () => (
//   <style>{`
//     @keyframes blink {
//       0%,100%{opacity:1}
//       50%{opacity:0}
//     }
//     .animate-blink{animation:blink 1s step-end infinite}
//     .scanline::after{
//       content:"";
//       position:absolute;
//       inset:0;
//       background:
//         linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,.25) 50%),
//         linear-gradient(90deg, rgba(255,0,0,.06), rgba(0,255,0,.02), rgba(0,0,255,.06));
//       background-size:100% 2px,3px 100%;
//       pointer-events:none;
//     }
//   `}</style>
// );

// /* ---------- Boot Sequence ---------- */
// const BootSequence = ({ onComplete }: { onComplete: () => void }) => {
//   const [logs, setLogs] = useState<string[]>([]);

//   useEffect(() => {
//     const steps = [
//       "INITIALIZING KERNEL...",
//       "LOADING ASSETS...",
//       "VERIFYING SIGNATURES...",
//       "ESTABLISHING SECURE CONNECTION...",
//       "SYSTEM READY.",
//     ];

//     const timers = steps.map((text, i) =>
//       setTimeout(() => setLogs((l) => [...l, text]), i * 400)
//     );

//     const done = setTimeout(onComplete, 2200);

//     return () => {
//       timers.forEach(clearTimeout);
//       clearTimeout(done);
//     };
//   }, [onComplete]);

//   return (
//     <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center text-[#ffffff] scanline">
//       <div className="text-xs uppercase space-y-2">
//         {logs.map((l, i) => (
//           <div key={i}>{l}</div>
//         ))}
//         <div className="w-2 h-4 bg-[#ffffff] animate-blink" />
//       </div>
//     </div>
//   );
// };

// /* ---------- Toast ---------- */
// const Toast = ({
//   message,
//   type,
//   onClose,
// }: {
//   message: string;
//   type: "success" | "error";
//   onClose: () => void;
// }) => {
//   useEffect(() => {
//     const t = setTimeout(onClose, 3000);
//     return () => clearTimeout(t);
//   }, [onClose]);

//   return (
//     <div
//       onClick={onClose}
//       className="fixed bottom-8 right-8 z-[100] cursor-pointer"
//     >
//       <div
//         className={`flex items-center gap-3 px-4 py-3 border rounded-sm ${
//           type === "success"
//             ? "bg-black border-[#ffffff] text-white"
//             : "bg-red-950 border-red-500 text-red-200"
//         }`}
//       >
//         {type === "success" ? (
//           <CheckCircle size={16} />
//         ) : (
//           <AlertCircle size={16} />
//         )}
//         <span className="text-xs uppercase">{message}</span>
//       </div>
//     </div>
//   );
// };

// /* ---------- Dashboard ---------- */
// export default function BlipDashboard() {
//   const [booted, setBooted] = useState(false);
//   const [toast, setToast] = useState<any>(null);
//   const [copied, setCopied] = useState(false);
//   const [walletCopied, setWalletCopied] = useState(false);
//   const [showPointsHistoryModal, setShowPointsHistoryModal] = useState(false);
//   const [showReferralModal, setShowReferralModal] = useState(false);

//   const { publicKey, disconnect } = useWallet();
//   const { logout, user } = useAuth();
//   const navigate = useNavigate();

//   if (!booted) {
//     return (
//       <>
//         <GlobalStyles />
//         <BootSequence onComplete={() => setBooted(true)} />
//       </>
//     );
//   }

//   const displayWalletAddress = publicKey
//     ? `${publicKey.toBase58().slice(0, 4)}...${publicKey
//         .toBase58()
//         .slice(-4)}`
//     : "Not Connected";

//   const blipPoints = user?.totalBlipPoints ?? 0;

//   const referralLink = user?.referralCode
//     ? `${import.meta.env.VITE_FRONTEND_URL}/waitlist?ref=${user.referralCode}`
//     : "";

//   const showToast = (message: string, type: "success" | "error" = "success") =>
//     setToast({ message, type });

//   const handleCopyWalletAddress = async () => {
//     if (!publicKey) return;
//     await navigator.clipboard.writeText(publicKey.toBase58());
//     setWalletCopied(true);
//     showToast("Wallet copied");
//     setTimeout(() => setWalletCopied(false), 2000);
//   };

//   const handleCopyReferralCode = async () => {
//     if (!user?.referralCode) return;
//     await navigator.clipboard.writeText(user.referralCode);
//     setCopied(true);
//     showToast("Referral code copied");
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const handleShareReferral = async () => {
//     if (navigator.share) {
//       await navigator.share({
//         title: "Join Blip Money",
//         url: referralLink,
//       });
//     } else {
//       handleCopyReferralCode();
//     }
//   };

//   const handleLogout = async () => {
//     await disconnect();
//     await logout();
//     navigate("/waitlist");
//   };

//   return (
//     <>
//       <div className="min-h-screen bg-[#030303] text-neutral-400 scanline">
//         <GlobalStyles />

//         {toast && (
//           <Toast
//             message={toast.message}
//             type={toast.type}
//             onClose={() => setToast(null)}
//           />
//         )}

//         <DashboardNavbar
//           walletAddress={displayWalletAddress}
//           blipPoints={blipPoints}
//           onLogout={handleLogout}
//         />

//         <main className="max-w-7xl mx-auto px-6 py-12">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             {/* Wallet */}
//             <div className="bg-zinc-900/40 border p-6">
//               <p className="text-xs mb-2">Authenticated As</p>
//               <div className="flex justify-between items-center">
//                 <span className="text-white">{displayWalletAddress}</span>
//                 <button onClick={handleCopyWalletAddress}>
//                   {walletCopied ? <Check size={14} /> : <Copy size={14} />}
//                 </button>
//               </div>
//             </div>

//             {/* Points */}
//             <div
//               onClick={() => setShowPointsHistoryModal(true)}
//               className="bg-zinc-900/40 border p-6 cursor-pointer"
//             >
//               <p className="text-xs mb-2">Accumulated Points</p>
//               <span className="text-3xl text-[#ffffff] font-bold">
//                 {blipPoints}
//               </span>
//             </div>

//             {/* Status */}
//             <div className="bg-zinc-900/40 border p-6">
//               <p className="text-xs mb-2">Protocol Status</p>
//               <span className="text-white">
//                 {user?.status === "ACTIVE" ? "Active" : "Waitlisted"}
//               </span>
//             </div>

//             {/* Referral */}
//             <div
//               onClick={() => setShowReferralModal(true)}
//               className="border p-6 cursor-pointer"
//             >
//               <p className="text-xs mb-2 text-[#ffffff]">Referral Code</p>
//               <div className="flex justify-between items-center">
//                 <span className="text-white font-mono">
//                   {user?.referralCode}
//                 </span>
//                 <div className="flex gap-2">
//                   <button onClick={handleCopyReferralCode}>
//                     {copied ? <Check size={14} /> : <Copy size={14} />}
//                   </button>
//                   <button onClick={handleShareReferral}>
//                     <Share2 size={14} />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <PointsHistoryModal
//             isOpen={showPointsHistoryModal}
//             onClose={() => setShowPointsHistoryModal(false)}
//             totalPoints={blipPoints}
//           />

//           <ReferralModal
//             isOpen={showReferralModal}
//             onClose={() => setShowReferralModal(false)}
//             referralCode={user?.referralCode || ""}
//             referralLink={referralLink}
//           />
//         </main>
//       </div>
//       <Footer />
//     </>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import {
  ShieldCheck,
  Wallet,
  Copy,
  Lock,
  ArrowRight,
  Activity,
  Landmark,
  Zap,
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
  Twitter,
  Check,
  Info,
} from "lucide-react";
import DashboardNavbar from "@/components/DashboardNavbar";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import PointsHistoryModal from "@/components/PointsHistoryModal";
import ReferralModal from "@/components/ReferralModal";

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
    <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center font-mono text-[#ffffff] p-8 scanline">
      <div className="w-full max-w-lg">
        <div className="mb-8 flex justify-center">
          <Terminal className="w-12 h-12 animate-pulse" />
        </div>
        <div className="space-y-2 text-xs uppercase tracking-wider">
          {logs.map((log, i) => (
            <div key={i} className="flex gap-2">
              <span className="opacity-50">
                [{new Date().toLocaleTimeString()}]
              </span>
              <span>{log}</span>
            </div>
          ))}
          <div className="h-4 w-2 bg-[#ffffff] animate-blink mt-2" />
        </div>
        <div className="mt-8 h-1 w-full bg-neutral-900 rounded-full overflow-hidden">
          <div className="h-full bg-[#ffffff] animate-[width_2.5s_ease-in-out_forwards] w-0" />
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
      className={`text-[10px] uppercase tracking-widest font-mono px-2 py-0.5 border ${styles[type]} backdrop-blur-sm transition-all hover:scale-105 select-none`}
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
        <span className="text-xs font-mono uppercase tracking-wider">
          {message}
        </span>
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

  const handleGleamAction = (action) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setGleamState((prev) => ({ ...prev, [action]: true }));
    }, 1500);
  };

  if (!task) return null;

  const isGleamTask = task.id === "s1";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-[#0A0A0A] border border-neutral-800 p-1 shadow-2xl animate-in zoom-in-95 duration-200 group">
        <TechBorder />
        <div className="p-8 relative z-10 bg-[radial-gradient(circle_at_center,rgba(30,30,30,0.5),transparent)]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors hover:rotate-90 duration-300"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-neutral-900 border border-neutral-800 text-[#ffffff] shadow-[0_0_15px_rgba(249,115,22,0.1)]">
              <task.icon className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight uppercase">
                <TypewriterText text={task.title} speed={10} />
              </h3>
              <div className="flex items-center gap-3 mt-2">
                <Badge type={task.status === "active" ? "orange" : "neutral"}>
                  {task.status.replace("_", " ")}
                </Badge>
                {task.difficulty && (
                  <Badge type="blue">{task.difficulty}</Badge>
                )}
                <span className="text-xs font-mono text-neutral-500">
                  REWARD: {task.reward} PTS
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="p-5 bg-neutral-900/30 border border-neutral-800/50 rounded-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#ffffff]/50" />
              <h4 className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2 font-mono flex items-center gap-2">
                <Info className="w-3 h-3" /> Mission Briefing
              </h4>
              <p className="text-sm text-neutral-300 font-mono leading-relaxed">
                {task.description}
              </p>
            </div>

            {isGleamTask && (
              <div className="space-y-3 mt-6">
                {/* Step 1: Connect */}
                <div
                  className={`p-3 border rounded-sm flex items-center justify-between transition-all ${gleamState.connected ? "bg-[#ffffff]/10 border-[#ffffff]/30" : "bg-neutral-900 border-neutral-800"}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-1.5 rounded-full ${gleamState.connected ? "bg-[#ffffff] text-black" : "bg-neutral-800 text-neutral-500"}`}
                    >
                      {gleamState.connected ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <Twitter className="w-3 h-3" />
                      )}
                    </div>
                    <span
                      className={`text-xs font-mono uppercase tracking-wider ${gleamState.connected ? "text-white" : "text-neutral-400"}`}
                    >
                      {gleamState.connected
                        ? "Identity Linked: @user"
                        : "Link Social Identity"}
                    </span>
                  </div>
                  {!gleamState.connected && (
                    <button
                      onClick={() => handleGleamAction("connected")}
                      disabled={loading}
                      className="text-[10px] bg-neutral-800 hover:bg-white hover:text-black px-3 py-1.5 uppercase font-bold tracking-wider transition-colors disabled:opacity-50"
                    >
                      {loading ? "Linking..." : "Connect"}
                    </button>
                  )}
                </div>

                {/* Step 2: Follow */}
                <div
                  className={`p-3 border rounded-sm flex items-center justify-between transition-all ${gleamState.followed ? "bg-[#ffffff]/10 border-[#ffffff]/30" : "bg-neutral-900 border-neutral-800"} ${!gleamState.connected ? "opacity-50" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-1.5 rounded-full ${gleamState.followed ? "bg-[#ffffff] text-black" : "bg-neutral-800 text-neutral-500"}`}
                    >
                      {gleamState.followed ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <Share2 className="w-3 h-3" />
                      )}
                    </div>
                    <span
                      className={`text-xs font-mono uppercase tracking-wider ${gleamState.followed ? "text-white" : "text-neutral-400"}`}
                    >
                      {gleamState.followed
                        ? "Uplink Established"
                        : "Follow @blip.money"}
                    </span>
                  </div>
                  {!gleamState.followed && (
                    <button
                      onClick={() => handleGleamAction("followed")}
                      disabled={loading || !gleamState.connected}
                      className="text-[10px] bg-neutral-800 hover:bg-white hover:text-black px-3 py-1.5 uppercase font-bold tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Verifying..." : "Follow"}
                    </button>
                  )}
                </div>

                {/* Step 3: Verify */}
                <div
                  className={`p-3 border rounded-sm flex items-center justify-between transition-all ${gleamState.verified ? "bg-[#ffffff]/10 border-[#ffffff]/30" : "bg-neutral-900 border-neutral-800"} ${!gleamState.followed ? "opacity-50" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-1.5 rounded-full ${gleamState.verified ? "bg-[#ffffff] text-black" : "bg-neutral-800 text-neutral-500"}`}
                    >
                      {gleamState.verified ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <ShieldCheck className="w-3 h-3" />
                      )}
                    </div>
                    <span
                      className={`text-xs font-mono uppercase tracking-wider ${gleamState.verified ? "text-white" : "text-neutral-400"}`}
                    >
                      {gleamState.verified
                        ? "Compliance Verified"
                        : "Verify Engagement"}
                    </span>
                  </div>
                  {!gleamState.verified && (
                    <button
                      onClick={() => handleGleamAction("verified")}
                      disabled={loading || !gleamState.followed}
                      className="text-[10px] bg-neutral-800 hover:bg-white hover:text-black px-3 py-1.5 uppercase font-bold tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Checking..." : "Verify"}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 text-xs font-mono uppercase tracking-wider border border-neutral-800 hover:bg-neutral-900 transition-colors text-neutral-400"
            >
              Abort
            </button>

            {!isGleamTask ? (
              <button
                onClick={handleExecute}
                disabled={task.status !== "active" || loading}
                className={`flex-1 py-3 text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all relative overflow-hidden
                    ${
                      task.status !== "active"
                        ? "bg-neutral-800 text-neutral-500 cursor-not-allowed border border-transparent"
                        : "bg-white text-black hover:bg-[#ffffff] hover:text-white border border-transparent hover:shadow-[0_0_20px_rgba(249,115,22,0.5)]"
                    }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" /> Processing...
                  </>
                ) : task.status === "locked" ? (
                  "Locked"
                ) : (
                  "Start Task"
                )}
              </button>
            ) : (
              <button
                onClick={handleExecute}
                disabled={!gleamState.verified || loading}
                className={`flex-1 py-3 text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all relative overflow-hidden
                    ${
                      !gleamState.verified
                        ? "bg-neutral-800 text-neutral-500 cursor-not-allowed border border-transparent"
                        : "bg-[#ffffff] text-white hover:bg-white border border-transparent hover:shadow-[0_0_20px_rgba(249,115,22,0.8)]"
                    }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" /> Claiming...
                  </>
                ) : !gleamState.verified ? (
                  "Complete Steps Above"
                ) : (
                  "Claim Reward"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const TaskCard = ({ task, onClick, onComingSoon, onLocked }) => {
  const { title, description, reward, status, icon: Icon, difficulty } = task;
  const isLocked = status === "locked";
  const isComingSoon = status === "coming_soon";
  const [shake, setShake] = useState(false);

  const handleClick = () => {
    if (isComingSoon) {
      onComingSoon && onComingSoon(task);
    } else if (isLocked) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      onLocked && onLocked(task);
    } else {
      onClick && onClick(task);
    }
  };

  return (
    <SpotlightCard
      onClick={handleClick}
      className={`
        w-full text-left p-5 group flex flex-col h-full cursor-pointer
        ${isLocked ? "opacity-80 grayscale" : ""}
        ${isComingSoon ? "opacity-70 border-dashed border-neutral-800" : ""}
        ${shake ? "shake border-red-900/50 bg-red-950/10" : ""}
      `}
    >
      <div className="flex justify-between items-start mb-4 relative z-10 w-full">
        <div
          className={`p-2 border rounded-sm transition-all duration-300 group-hover:scale-110 ${isLocked ? "bg-neutral-950 border-neutral-900 text-neutral-800" : isComingSoon ? "bg-neutral-900 border-neutral-800 text-neutral-600" : "bg-neutral-900/50 border-neutral-800 text-neutral-400 group-hover:text-[#ffffff] group-hover:border-[#ffffff]/50 group-hover:shadow-[0_0_10px_rgba(249,115,22,0.2)]"}`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex flex-col items-end gap-1">
          {status === "active" && (
            <span className="text-[#ffffff] font-mono text-[10px] tracking-wider border border-[#ffffff]/20 px-1.5 py-0.5 bg-[#ffffff]/5 group-hover:bg-[#ffffff]/10 transition-colors">
              +{reward} PTS
            </span>
          )}
          {isLocked && <Lock className="w-4 h-4 text-neutral-700" />}
          {isComingSoon && (
            <Construction className="w-4 h-4 text-neutral-700" />
          )}
        </div>
      </div>

      <div className="relative z-10 flex-grow">
        <h3
          className={`text-sm font-medium tracking-wide mb-1 transition-colors ${isLocked || isComingSoon ? "text-neutral-500" : "text-neutral-200 group-hover:text-white"}`}
        >
          {title}
        </h3>
        <p className="text-xs text-neutral-500 leading-relaxed mb-4 min-h-[2.5em] font-mono group-hover:text-neutral-400 transition-colors">
          {description}
        </p>
      </div>

      <div className="flex items-center justify-between mt-auto relative z-10 w-full border-t border-neutral-900/50 pt-3">
        {difficulty && (
          <span className="text-[10px] text-neutral-600 font-mono uppercase tracking-wider">
            {difficulty}
          </span>
        )}

        {isComingSoon && (
          <span className="text-[10px] uppercase tracking-wider text-neutral-600 font-mono">
            Coming Soon
          </span>
        )}
        {isLocked && (
          <span className="text-[10px] uppercase tracking-wider text-red-900/70 font-mono group-hover:text-red-500 transition-colors">
            Locked
          </span>
        )}
        {status === "active" && (
          <div className="flex items-center text-xs text-neutral-400 group-hover:text-[#ffffff] transition-colors font-mono uppercase tracking-wider group-hover:translate-x-1 duration-300 ml-auto">
            Start <ArrowRight className="w-3 h-3 ml-2" />
          </div>
        )}
      </div>
    </SpotlightCard>
  );
};

const EducationCard = ({ onStart, onStepClick }) => (
  <SpotlightCard className="w-full p-6 md:p-8 group">
    <TechBorder />

    {/* Animated Background Mesh (CSS Only) */}
    <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
      <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent)] animate-[spin_60s_linear_infinite]" />
    </div>

    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-4">
          <Badge type="orange">Start Here</Badge>
          <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest animate-pulse">
            Seq_ID: 001_A
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-medium text-white mb-2 tracking-tight font-sans group-hover:text-glow transition-all duration-500">
          <TypewriterText text="Learn the Basics" delay={1000} />
        </h2>
        <p className="text-sm text-neutral-400 mb-6 max-w-lg">
          Understand how the protocol works and earn your first rewards by
          completing this quick reading module.
        </p>

        {/* Aligned Steps List */}
        <div className="flex flex-col gap-2">
          <a
            href="/whitepaper.pdf"
            target="_blank"
            rel="noopener noreferrer">
          <div
            onClick={() => onStepClick && onStepClick("reading")}
            className="flex items-center gap-3 text-sm font-mono text-neutral-400 group/item hover:text-white transition-colors cursor-pointer bg-neutral-900/20 p-2 rounded-sm border border-transparent hover:border-neutral-800"
          >
            <div className="w-5 h-5 bg-neutral-800 rounded-full flex items-center justify-center text-[10px] text-[#ffffff] font-bold">
              1
            </div>
            <span>Read the Whitepaper</span>
            <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover/item:opacity-100 transition-opacity text-[#ffffff]" />
          </div> </a>
          <div
            onClick={() => onStepClick && onStepClick("verify")}
            className="flex items-center gap-3 text-sm font-mono text-neutral-400 group/item hover:text-white transition-colors cursor-pointer bg-neutral-900/20 p-2 rounded-sm border border-transparent hover:border-neutral-800"
          >
            <div className="w-5 h-5 bg-neutral-800 rounded-full flex items-center justify-center text-[10px] text-[#ffffff] font-bold">
              2
            </div>
            <span>Take the Quiz</span>
            <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover/item:opacity-100 transition-opacity text-[#ffffff]" />
          </div>
        </div>
      </div>

      <div className="w-full md:w-72 bg-neutral-900/30 p-4 border border-neutral-800 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-[#ffffff]/20 blur-xl rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="flex justify-between text-[10px] text-neutral-400 mb-3 font-mono uppercase tracking-wider relative z-10">
          <span>Your Progress</span>
          <span className="text-[#ffffff]">25%</span>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-0.5 h-1.5 w-full relative z-10">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`flex-1 transition-all duration-500 ${i < 5 ? "bg-[#ffffff] shadow-[0_0_8px_rgba(249,115,22,0.8)]" : "bg-neutral-800"}`}
              style={{ transitionDelay: `${i * 20}ms` }}
            />
          ))}
        </div>

        <button
          onClick={onStart}
          className="mt-6 w-full py-3 px-4 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#ffffff] hover:text-white transition-all duration-200 border-none group/btn relative overflow-hidden"
        >
          <span className="relative z-10 group-hover/btn:tracking-[0.3em] transition-all">
            Continue
          </span>
          <div className="absolute inset-0 bg-white transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-300" />
        </button>
      </div>
    </div>
  </SpotlightCard>
);

const SectionTitle = ({ title, count }) => (
  <div className="flex items-center gap-3 mb-6 mt-14 pb-2 border-b border-neutral-900">
    <div className="w-1 h-1 bg-[#ffffff] shadow-[0_0_5px_white]" />
    <h2 className="text-xs font-bold text-white uppercase tracking-[0.2em] hover:text-[#ffffff] transition-colors cursor-default">
      {title}
    </h2>
    {count !== undefined && (
      <span className="text-[10px] font-mono text-neutral-500 bg-neutral-900/50 border border-neutral-800 px-1.5 py-0.5">
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
      reward: "250",
      status: "active",
      icon: Megaphone,
      difficulty: "Very Easy",
    },
    {
      id: "s3",
      title: "Join Discord Community",
      description: "Join the server and claim the 'Vanguard' role.",
      reward: "500",
      status: "locked",
      icon: Users,
      difficulty: "Medium",
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
  const [walletCopied, setWalletCopied] = useState(false);
  const [showPointsHistoryModal, setShowPointsHistoryModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);

  const { publicKey, disconnect } = useWallet();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

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
    ? `${import.meta.env.VITE_FRONTEND_URL}/waitlist?ref=${user.referralCode}`
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

  const handleShareReferral = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Join Blip Money",
        url: referralLink,
      });
    } else {
      handleCopyReferralCode();
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
    setSelectedTask(task);
  };

  const handleTaskExecute = () => {
    showToast("Protocol Sequence Initiated");
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
    <div className="min-h-screen bg-[#030303] text-neutral-400 font-sans selection:bg-[#ffffff]/20 selection:text-[#ffffff] relative overflow-x-hidden scanline">
      <GlobalStyles />

      {/* Interaction Layers */}
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

      {/* Global Grid Background */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), 
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-transparent to-[#030303]" />
      </div>

      {/* Ambient Glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-white/10 blur-[120px] rounded-full pointer-events-none z-0 animate-pulse"
        style={{ animationDuration: "4s" }}
      />

      {/* Navigation */}
      <DashboardNavbar
        walletAddress={displayWalletAddress}
        blipPoints={blipPoints}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-sm">
            <span className="text-[9px] font-black uppercase tracking-widest  block mb-2">
              Authenticated As
            </span>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-200">
                  {displayWalletAddress ? "It will Show Others Details " : "Not Connected"}
                </span>
                <div className="w-2 h-2 rounded-full bg-[#ffffff] " />
              </div>
              <button
                onClick={handleCopyWalletAddress}
                className="p-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-[#ffffff] transition-all"
                title="Copy wallet address"
              >
                {walletCopied ? (
                  <Check size={12} className="text-[#ffffff]" />
                ) : (
                  <Copy
                    size={12}
                    className="text-zinc-400 hover:text-[#ffffff]"
                  />
                )}
              </button>
            </div>
          </div>

          <div
            onClick={() => setShowPointsHistoryModal(true)}
            className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-sm relative overflow-hidden hover:border-text-[#ffffff]/30 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-black uppercase tracking-widest ">
                Accumulated Points
              </span>
              <span className="text-[10px] text-[#ffffff] group-hover:text-[#ffffff] transition-colors">
                View history →
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black  tracking-tighter text-white">
                {blipPoints}
              </span>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-zinc-800">
              <div
                className="h-full bg-[#ffffff] transition-all duration-1000"
                style={{
                  width: `${Math.min((blipPoints / 4000) * 100, 100)}%`,
                }}
              />
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-sm">
            <span className="text-[9px] font-black uppercase tracking-widest  block mb-2">
              Protocol Status
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">
                {user?.status === "ACTIVE"
                  ? "Active Participant"
                  : "Waitlisted"}
              </span>
            </div>
          </div>

          <div
            onClick={() => setShowReferralModal(true)}
            className=" border border-[#ffffff]/10 p-6 rounded-sm  transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#ffffff]">
                Your Referral Code
              </span>
              <span className="text-xs font-bold text-[#ffffff]">
                +100 pts per referral
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-lg font-mono font-bold text-white tracking-wider">
                {user?.referralCode || "—"}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyReferralCode();
                  }}
                  className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-[#39ff14]/50 transition-all"
                  title="Copy referral code"
                >
                  {copied ? (
                    <Check size={14} className="text-[#ffffff]" />
                  ) : (
                    <Copy
                      size={14}
                      className="text-zinc-400 hover:text-[#ffffff]"
                    />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShareReferral();
                  }}
                  className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-[#ffffff]/50 transition-all"
                  title="Share referral link"
                >
                  <Share2
                    size={14}
                    className="text-zinc-400 hover:text-[#ffffff]"
                  />
                </button>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-zinc-800/50 flex items-center justify-between">
              <p className="text-[10px]  truncate flex-1">
                {referralLink || "Generate your referral link"}
              </p>
              <span className="text-[10px] text-zinc-600 group-hover:text-[#ffffff] transition-colors ml-2">
                Click to view referrals →
              </span>
            </div>
          </div>
        </div>

        <PointsHistoryModal
          isOpen={showPointsHistoryModal}
          onClose={() => setShowPointsHistoryModal(false)}
          totalPoints={blipPoints}
        />

        <ReferralModal
          isOpen={showReferralModal}
          onClose={() => setShowReferralModal(false)}
          referralCode={user?.referralCode || ""}
          referralLink={referralLink}
        />

        {/* Main Content Area */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2 text-[#ffffff]">
                <Radio className="w-4 h-4 animate-pulse" />
                <span className="text-xs font-mono uppercase tracking-widest">
                  Incoming Transmission
                </span>
              </div>
              <h1 className="text-4xl font-medium text-white mb-2 tracking-tight">
                <TypewriterText text="Mission Control" speed={50} delay={500} />
              </h1>
              <p className="text-sm text-neutral-500 font-mono flex items-center gap-2">
                <span className="text-[#ffffff]">
                  {">"}
                  {">"}
                </span>
                <TypewriterText
                  text="Complete verification tasks to initialize vault allocation."
                  speed={20}
                  delay={1500}
                />
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 border text-xs font-mono uppercase transition-all duration-300 hover:scale-105 active:scale-95 ${filter === "all" ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]" : "border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:text-white hover:border-neutral-600"}`}
              >
                All Tasks
              </button>
              <button
                onClick={() => setFilter("active")}
                className={`px-4 py-2 border text-xs font-mono uppercase transition-all duration-300 hover:scale-105 active:scale-95 ${filter === "active" ? "bg-[#ffffff] text-white border-[#ffffff] shadow-[0_0_15px_rgba(249,115,22,0.4)]" : "border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:text-white hover:border-neutral-600"}`}
              >
                Active Only
              </button>
            </div>
          </div>

          {/* Featured Education Task */}
          <div className="mb-16">
            <EducationCard
              onStart={() =>
                setSelectedTask({
                  title: "Learn the Basics",
                  description:
                    "Read the whitepaper to understand the protocol's core mechanics.",
                  reward: "500",
                  status: "active",
                  icon: Terminal,
                  difficulty: "Easy",
                })
              }
              onStepClick={handleStepClick}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column */}
            <div className="lg:col-span-8">
              {/* Social & Promotion Section */}
              <SectionTitle
                title="Social Quests"
                count={getVisibleTasks(TASKS_DATA.social).length}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                {getVisibleTasks(TASKS_DATA.social).map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={handleTaskClick}
                    onComingSoon={handleComingSoon}
                    onLocked={handleLocked}
                  />
                ))}
                {getVisibleTasks(TASKS_DATA.social).length === 0 && (
                  <div className="text-xs font-mono text-neutral-600 italic p-4">
                    No active social tasks available.
                  </div>
                )}
              </div>

              {/* Activity Section */}
              <SectionTitle
                title="On-Chain Activity"
                count={getVisibleTasks(TASKS_DATA.activity).length}
              />
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
                {getVisibleTasks(TASKS_DATA.activity).length === 0 && (
                  <div className="text-xs font-mono text-neutral-600 italic p-4">
                    No active activity logs.
                  </div>
                )}
              </div>

              {/* Core Protocol Section */}
              <SectionTitle
                title="Core Infrastructure"
                count={getVisibleTasks(TASKS_DATA.core).length}
              />
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
                {getVisibleTasks(TASKS_DATA.core).length === 0 && (
                  <div className="text-xs font-mono text-neutral-600 italic p-4">
                    Infrastructure tasks pending activation.
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Governance */}
            <div className="lg:col-span-4">
              <SectionTitle
                title="Governance & Security"
                count={getVisibleTasks(TASKS_DATA.governance).length}
              />
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
                {getVisibleTasks(TASKS_DATA.governance).length === 0 && (
                  <div className="text-xs font-mono text-neutral-600 italic p-4">
                    Governance proposals are currently restricted.
                  </div>
                )}
              </div>

              {/* Institutional Notice */}
              <div className="mt-8 relative p-6 border border-neutral-800 bg-neutral-900/20 overflow-hidden group">
                <div className="absolute top-0 right-0 p-2">
                  <div className="w-1.5 h-1.5 bg-[#ffffff] rounded-full animate-ping" />
                </div>
                <p className="text-[10px] text-[#ffffff] uppercase tracking-[0.2em] font-bold mb-3 border-b border-neutral-800 pb-2 inline-block">
                  System Notice
                </p>
                <p className="text-xs text-neutral-500 leading-relaxed font-mono">
                  <span className="text-neutral-300">
                    {">"}
                    {">"} BETA_ACCESS_RESTRICTED
                  </span>
                  <br />
                  Rewards non-transferable until TGE. Unauthorized access
                  attempts will result in immediate wallet blacklisting
                  (IP_BAN).
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
