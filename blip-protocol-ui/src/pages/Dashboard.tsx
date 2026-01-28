import React, { useState, useEffect, useRef } from 'react';
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
  Power,
  Check
} from 'lucide-react';
import DashboardNavbar from '@/components/DashboardNavbar';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {Footer} from '@/components/Footer';
import ReferralModal from '@/components/ReferralModal';
import PointsHistoryModal from '@/components/PointsHistoryModal';

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
  const [displayText, setDisplayText] = useState('');
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
      { text: "INITIALIZING KERNEL...", delay: 100 },
      { text: "LOADING ASSETS...", delay: 400 },
      { text: "VERIFYING CRYPTOGRAPHIC SIGNATURES...", delay: 800 },
      { text: "ESTABLISHING SECURE CONNECTION...", delay: 1200 },
      { text: "SYNCING WITH MAINNET BEACON CHAIN...", delay: 1800 },
      { text: "SYSTEM READY.", delay: 2400 },
    ];

    let timeouts = [];

    sequence.forEach(({ text, delay }) => {
      const timeout = setTimeout(() => {
        setLogs(prev => [...prev, text]);
      }, delay);
      timeouts.push(timeout);
    });

    const endTimeout = setTimeout(onComplete, 2800);
    timeouts.push(endTimeout);

    return () => timeouts.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center  text-[#ff6b35] p-8 scanline">
      <div className="w-full max-w-lg">
        <div className="mb-8 flex justify-center">
           <Terminal className="w-12 h-12 animate-pulse" />
        </div>
        <div className="space-y-2 text-xs uppercase tracking-wider">
          {logs.map((log, i) => (
            <div key={i} className="flex gap-2">
              <span className="opacity-50">[{new Date().toLocaleTimeString()}]</span>
              <span>{log}</span>
            </div>
          ))}
          <div className="h-4 w-2 bg-orange-500 animate-blink mt-2" />
        </div>
        <div className="mt-8 h-1 w-full bg-neutral-900 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 animate-[width_2.5s_ease-in-out_forwards] w-0" />
        </div>
      </div>
    </div>
  );
};

const SpotlightCard = ({ children, className = "", onClick }) => {
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
      onClick={onClick}
      className={`relative overflow-hidden rounded-sm bg-[#0A0A0A] border border-neutral-800 ${className}`}
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
          maskImage: 'linear-gradient(black, black), linear-gradient(black, black)',
          maskClip: 'content-box, border-box',
          maskComposite: 'exclude', // Keeps only the border
          padding: '1px',
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};

// --- Reusable Components (Enhanced) ---

const TechBorder = () => (
  <>
    <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-orange-500/30 transition-all duration-300 group-hover:w-4 group-hover:h-4 group-hover:border-orange-500" />
    <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-orange-500/30 transition-all duration-300 group-hover:w-4 group-hover:h-4 group-hover:border-orange-500" />
    <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-orange-500/30 transition-all duration-300 group-hover:w-4 group-hover:h-4 group-hover:border-orange-500" />
    <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-orange-500/30 transition-all duration-300 group-hover:w-4 group-hover:h-4 group-hover:border-orange-500" />
  </>
);

const Badge = ({ children, type = 'neutral' }) => {
  const styles = {
    neutral: 'bg-neutral-900/80 text-neutral-400 border-neutral-800',
    orange: 'bg-orange-500/10 text-[#ff6b35] border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.1)]',
  };
  return (
    <span className={`text-[10px] uppercase tracking-widest  px-2 py-0.5 border ${styles[type]} backdrop-blur-sm transition-all hover:scale-105 select-none`}>
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
  // Extract number from string if needed, simple parser
  const numValue = parseFloat(value.toString().replace(/,/g, ''));
  const count = useCountUp(isNaN(numValue) ? 0 : numValue, 2000);
  
  // Format back to locale string if it was a number
  const display = isNaN(numValue) 
    ? value 
    : count.toLocaleString(undefined, { minimumFractionDigits: value.toString().includes('.') ? 2 : 0, maximumFractionDigits: 2 });

  return <span>{prefix}{display}{suffix}</span>;
};

// ... (Toast and Modal remain mostly the same, but Modal uses SpotlightCard logic visually)

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-8 right-8 z-[100] animate-in slide-in-from-right-10 fade-in duration-300 cursor-pointer" onClick={onClose}>
      <div className={`flex items-center gap-3 px-4 py-3 border backdrop-blur-md rounded-sm shadow-[0_0_20px_rgba(0,0,0,0.5)] ${
        type === 'success' ? 'bg-[#050505]/95 border-orange-500/50 text-white shadow-[0_0_10px_rgba(249,115,22,0.2)]' : 'bg-red-950/90 border-red-500/30 text-red-200'
      }`}>
        {type === 'success' ? <CheckCircle className="w-4 h-4 text-[#ff6b35]" /> : <AlertCircle className="w-4 h-4 text-red-500" />}
        <span className="text-xs  uppercase tracking-wider">{message}</span>
      </div>
    </div>
  );
};

const Modal = ({ task, onClose, onExecute }) => {
  const [loading, setLoading] = useState(false);

  const handleExecute = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onExecute();
      onClose();
    }, 1500);
  };

  if (!task) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#0A0A0A] border border-neutral-800 p-1 shadow-2xl animate-in zoom-in-95 duration-200 group">
        <TechBorder />
        <div className="p-8 relative z-10 bg-[radial-gradient(circle_at_center,rgba(30,30,30,0.5),transparent)]">
          <button onClick={onClose} className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors hover:rotate-90 duration-300">
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-neutral-900 border border-neutral-800 text-[#ff6b35] shadow-[0_0_15px_rgba(249,115,22,0.1)]">
              <task.icon className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight uppercase"><TypewriterText text={task.title} speed={10} /></h3>
              <div className="flex items-center gap-3 mt-2">
                <Badge type={task.status === 'active' ? 'orange' : 'neutral'}>{task.status.replace('_', ' ')}</Badge>
                <span className="text-xs  text-neutral-500">REWARD: {task.reward} PTS</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="p-5 bg-neutral-900/30 border border-neutral-800/50 rounded-sm relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-orange-500/50" />
              <h4 className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2  flex items-center gap-2">
                <Terminal className="w-3 h-3" /> Mission Briefing
              </h4>
              <p className="text-sm text-neutral-300  leading-relaxed">
                {task.description}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-3 text-xs  uppercase tracking-wider border border-neutral-800 hover:bg-neutral-900 transition-colors text-neutral-400">
              Abort
            </button>
            <button 
              onClick={handleExecute}
              disabled={task.status !== 'active' || loading}
              className={`flex-1 py-3 text-xs font-bold  uppercase tracking-wider flex items-center justify-center gap-2 transition-all relative overflow-hidden
                ${task.status !== 'active' 
                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-transparent' 
                  : 'bg-white text-black hover:bg-orange-500 hover:text-white border border-transparent hover:shadow-[0_0_20px_rgba(249,115,22,0.5)]'
                }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" /> Processing...
                </>
              ) : (
                task.status === 'locked' ? 'Locked' : 'Initialize Protocol'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, subtext, icon: Icon, highlight = false, action, onClick, index }) => (
  <SpotlightCard 
    onClick={onClick}
    className={`group p-6 hover:bg-[#0F0F0F] transition-colors duration-300 ${onClick ? 'cursor-pointer' : ''} animate-in fade-in slide-in-from-bottom-4 hover:border-[#ff6b35]/20`}
  >
    <div style={{ animationDelay: `${index * 100}ms` }}>
        {/* <TechBorder /> */}
        
        <div className="flex justify-between items-start mb-4 relative z-10">
        <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500  flex items-center gap-2 group-hover:text-[#ff6b35]/80 transition-colors">
            {highlight && <div className="w-1.5 h-1.5 bg-orange-500 animate-pulse shadow-[0_0_8px_orange]" />}
            {label}
        </span>
        {Icon && <Icon className={`w-4 h-4 ${highlight ? 'text-[#ff6b35]' : 'text-neutral-700 group-hover:text-neutral-400'} transition-colors`} />}
        </div>
        
        <div className={`text-2xl font-medium tracking-tight  ${highlight ? 'text-[#ff6b35] text-shadow-glow' : 'text-white'}`}>
        <Counter value={value} />
        </div>
        
        <div className="flex items-center justify-between mt-4 relative z-10">
        {subtext && <p className="text-[10px] text-neutral-600  uppercase group-hover:text-neutral-500 transition-colors">{subtext}</p>}
        {action}
        </div>
    </div>
  </SpotlightCard>
);

const TaskCard = ({ task, onClick }) => {
  const { title, description, reward, status, icon: Icon } = task;
  const isLocked = status === 'locked';
  const isComingSoon = status === 'coming_soon';

  return (
    <SpotlightCard 
      onClick={() => !isComingSoon && onClick(task)}
      className={`
        w-full text-left p-5 group flex flex-col h-full
        ${isLocked ? 'opacity-60 grayscale' : 'cursor-pointer'}
        ${isComingSoon ? 'cursor-not-allowed opacity-80' : ''}
      `}
    >
        <div className="flex justify-between items-start mb-4 relative z-10 w-full">
            <div className={`p-2 border rounded-sm transition-all duration-300 group-hover:scale-110 ${isLocked ? 'bg-neutral-950 border-neutral-900 text-neutral-800' : 'bg-neutral-900/50 border-neutral-800 text-neutral-400 group-hover:text-[#ff6b35] group-hover:border-orange-500/50 group-hover:shadow-[0_0_10px_rgba(249,115,22,0.2)]'}`}>
            <Icon className="w-5 h-5" />
            </div>
            <div className="flex flex-col items-end gap-1">
            {status === 'active' && <span className="text-[#ff6b35]  text-[10px] tracking-wider border border-orange-500/20 px-1.5 py-0.5 bg-orange-500/5 group-hover:bg-orange-500/10 transition-colors">+{reward} PTS</span>}
            {isLocked && <Lock className="w-4 h-4 text-neutral-800" />}
            </div>
        </div>

        <div className="relative z-10 flex-grow">
            <h3 className={`text-sm font-medium tracking-wide mb-1 transition-colors ${isLocked ? 'text-neutral-600' : 'text-neutral-200 group-hover:text-white'}`}>
            {title}
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed mb-4 min-h-[2.5em]  group-hover:text-neutral-400 transition-colors">
            {description}
            </p>
        </div>

        <div className="flex items-center mt-auto relative z-10 w-full">
            {isComingSoon && <Badge>Coming Soon</Badge>}
            {isLocked && <span className="text-[10px] uppercase tracking-wider text-neutral-700 ">Access Restricted</span>}
            {status === 'active' && (
            <div className="flex items-center text-xs text-neutral-400 group-hover:text-[#ff6b35] transition-colors  uppercase tracking-wider group-hover:translate-x-1 duration-300">
                Initialize <ArrowRight className="w-3 h-3 ml-2" />
            </div>
            )}
        </div>
    </SpotlightCard>
  );
};

const EducationCard = ({ onStart }) => (
  <SpotlightCard className="w-full p-6 md:p-8 group">
    <TechBorder />
    
    {/* Animated Background Mesh (CSS Only) */}
    <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
       <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent)] animate-[spin_60s_linear_infinite]" />
    </div>

    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-4">
          <Badge type="orange">Priority Task</Badge>
          <span className="text-[10px] text-neutral-500  uppercase tracking-widest animate-pulse">Seq_ID: 001_A</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-medium text-white mb-2 tracking-tight font-sans group-hover:text-glow transition-all duration-500">
            <TypewriterText text="Protocol Architecture & Whitepaper" delay={1000} />
        </h2>
        
        {/* Aligned Steps List */}
        <div className="mt-6 flex flex-col gap-2">
            <div className="flex items-start gap-3 text-sm  text-neutral-400 group/item hover:text-neutral-200 transition-colors cursor-default">
                <span className="text-[#ff6b35] shrink-0 opacity-50 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all">{'>'}{'>'}</span>
                <span>Initialize reading module.</span>
            </div>
            <div className="flex items-start gap-3 text-sm  text-neutral-400 group/item hover:text-neutral-200 transition-colors cursor-default">
                <span className="text-[#ff6b35] shrink-0 opacity-50 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all">{'>'}{'>'}</span>
                <span>Verify understanding of liquidity engine.</span>
            </div>
             <div className="flex items-start gap-3 text-sm  text-neutral-400">
                <span className="text-[#ff6b35] shrink-0 opacity-50">{'>'}{'>'}</span>
                <span>Status: <span className="text-[#ff6b35] font-bold tracking-wide animate-pulse">In Progress</span></span>
            </div>
        </div>
      </div>

      <div className="w-full md:w-72 bg-neutral-900/30 p-4 border border-neutral-800 backdrop-blur-sm relative overflow-hidden">
         <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/20 blur-xl rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="flex justify-between text-[10px] text-neutral-400 mb-3  uppercase tracking-wider relative z-10">
          <span>Completion</span>
          <span className="text-[#ff6b35]">25%</span>
        </div>
        
        {/* Progress Bar */}
        <div className="flex gap-0.5 h-1.5 w-full relative z-10">
            {[...Array(20)].map((_, i) => (
            <div 
                key={i} 
                className={`flex-1 transition-all duration-500 ${i < 5 ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]' : 'bg-neutral-800'}`}
                style={{ transitionDelay: `${i * 20}ms` }}
            />
            ))}
        </div>

        <button 
          onClick={onStart}
          className="mt-6 w-full py-3 px-4 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-orange-500 hover:text-white transition-all duration-200 border-none group/btn relative overflow-hidden"
        >
          <span className="relative z-10 group-hover/btn:tracking-[0.3em] transition-all">Continue Sequence</span>
          <div className="absolute inset-0 bg-orange-400 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-300" />
        </button>
      </div>
    </div>
  </SpotlightCard>
);

const SectionTitle = ({ title, count }) => (
  <div className="flex items-center gap-3 mb-6 mt-14 pb-2 border-b border-neutral-900">
    <div className="w-1 h-1 bg-orange-500 shadow-[0_0_5px_orange]" />
    <h2 className="text-xs font-bold text-white uppercase tracking-[0.2em] hover:text-[#ff6b35] transition-colors cursor-default">{title}</h2>
    {count !== undefined && (
      <span className="text-[10px]  text-neutral-500 bg-neutral-900/50 border border-neutral-800 px-1.5 py-0.5">
        {count.toString().padStart(2, '0')}
      </span>
    )}
  </div>
);

// --- Data Definitions ---
const TASKS_DATA = {
  social: [
    { id: 's1', title: "Gleam_01 Campaign", description: "Execute social sequence on Gleam.io platform. Follow, Retweet, Verify.", reward: "1000", status: "active", icon: Share2 },
    { id: 's2', title: "Signal Amplification", description: "Boost latest protocol transmission on Twitter/X.", reward: "250", status: "active", icon: Megaphone },
    { id: 's3', title: "Discord Vanguard", description: "Acquire 'Vanguard' role in official comms channel.", reward: "500", status: "locked", icon: Users },
  ],
  activity: [
    { id: 'a1', title: "Provide Liquidity", description: "Deposit > 1000 USDC. Genesis Vault. Duration: 30d.", reward: "5000", status: "locked", icon: Database },
    { id: 'a2', title: "Execute CLI Swap", description: "Complete one swap on Goerli Testnet via terminal.", reward: "500", status: "locked", icon: Terminal },
    { id: 'a3', title: "Deposit Collateral", description: "Initialize primary vault. ETH Collateral required.", reward: "2500", status: "locked", icon: Landmark },
    { id: 'a4', title: "Node Calibration", description: "Sync local node with mainnet beacon chain.", reward: "1200", status: "active", icon: Cpu },
  ],
  core: [
    { id: 'c1', title: "Testnet Validator", description: "Run validator node. Support network consensus.", reward: "2000", status: "coming_soon", icon: Globe },
    { id: 'c2', title: "Deploy Smart Vault", description: "Deploy personal on-chain savings contract.", reward: "1000", status: "coming_soon", icon: Lock },
  ],
  governance: [
    { id: 'g1', title: "BIP-12 Vote", description: "Fee Structure Amendment. Consensus required.", reward: "150", status: "locked", icon: Vote },
    { id: 'g2', title: "Report Zero-Day", description: "Submit verified bug report via Immunefi.", reward: "Var", status: "locked", icon: ShieldCheck },
    { id: 'g3', title: "Merchant API", description: "Process tx using Merchant API gateway.", reward: "5000", status: "locked", icon: Wallet },
  ]
};

// --- Main Layout ---

export default function BlipDashboard() {
  const [booted, setBooted] = useState(false);
  const [filter, setFilter] = useState('all'); 
  const [selectedTask, setSelectedTask] = useState(null);
  const [toast, setToast] = useState(null);
  const [isWalletConnected, setIsWalletConnected] = useState(true);
  const { publicKey, disconnect } = useWallet();
  const { logout, user, refreshSession } = useAuth();
  const [copied, setCopied] = useState(false);
  const [walletCopied, setWalletCopied] = useState(false);
  const [showPointsHistoryModal, setShowPointsHistoryModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const navigate = useNavigate();

  // Skip boot sequence in development to save time if needed, currently enabled
  useEffect(() => {
    // Optional: Check local storage to only show boot once per session
    // For this demo, we show it every reload
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleCopy = (e) => {
    e.stopPropagation();
    showToast("Referral Link Copied to Clipboard");
  };

  const handleWalletToggle = () => {
    setIsWalletConnected(!isWalletConnected);
    showToast(isWalletConnected ? "Wallet Disconnected" : "Wallet Connected Successfully");
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleTaskExecute = () => {
    showToast("Protocol Sequence Initiated");
  };

  const getVisibleTasks = (categoryTasks) => {
    if (filter === 'all') return categoryTasks;
    return categoryTasks.filter(t => t.status === 'active');
  };

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
    : "";

    // Copy full wallet address to clipboard
  const handleCopyWalletAddress = async () => {
    if (!publicKey) return;

    try {
      await navigator.clipboard.writeText(publicKey.toBase58());
      setWalletCopied(true);
      toast({
        title: "Copied!",
        description: "Wallet address copied to clipboard.",
      });
      setTimeout(() => setWalletCopied(false), 2000);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to copy",
        description: "Please copy the address manually.",
      });
    }
  };

    const blipPoints = user?.totalBlipPoints ?? 0;

     // Referral link
  const referralLink = user?.referralCode
    ? `${import.meta.env.VITE_FRONTEND_URL}/waitlist?ref=${user.referralCode}`
    : "";

  // Copy referral code to clipboard (just the code, not the full link)
  const handleCopyReferralCode = async () => {
    if (!user?.referralCode) return;

    try {
      await navigator.clipboard.writeText(user.referralCode);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to copy",
        description: "Please copy the code manually.",
      });
    }
  };

  // Share referral link
  const handleShareReferral = async () => {
    if (!referralLink) return;

    const shareData = {
      title: "Join Blip Money",
      text: `Join Blip Money and earn rewards! Use my referral code: ${user?.referralCode}`,
      url: referralLink,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy code to clipboard
        await handleCopyReferralCode();
      }
    } catch (err) {
      // User cancelled share or error
      console.log("Share cancelled or failed");
    }
  };

    const handleLogout = async () => {
    try {
      await disconnect();
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate("/waitlist");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: " faild to logout , try again later   ",
      });
    }
  };

  return (
    <>
    <div className="min-h-screen bg-[#030303] text-neutral-400 font-sans selection:bg-orange-500/20 selection:text-[#ff6b35] relative overflow-x-hidden scanline">
      <GlobalStyles />
      
      {/* Interaction Layers */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <Modal task={selectedTask} onClose={() => setSelectedTask(null)} onExecute={handleTaskExecute} />

      {/* Global Grid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none" 
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), 
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-transparent to-[#030303]" />
      </div>

      {/* Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-orange-900/10 blur-[120px] rounded-full pointer-events-none z-0 animate-pulse" style={{ animationDuration: '4s' }} />

      {/* Top Navigation */}
       <DashboardNavbar
              walletAddress={displayWalletAddress}
              blipPoints={blipPoints}
              onLogout={handleLogout}
            />

      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        
        {/* Stats Grid */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          <StatCard 
            index={1}
            label="Security Level" 
            value="Lvl. 02" 
            icon={ShieldCheck} 
            subtext="Biometrics Verified"
            onClick={() => showToast("Security Level: Maximum")}
          />
          <StatCard 
            index={2}
            label="Net Worth" 
            value="12450.00" 
            icon={Zap} 
            highlight={true}
            subtext="BLIP Protocol Points"
            onClick={() => showToast("Points Balance Updated")}
          />
          <StatCard 
            index={3}
            label="Queue Position" 
            value="#4,291" 
            icon={Activity} 
            subtext="Est. Access: 2 Days"
            onClick={() => showToast("You are currently in position #4291")}
          />
          <StatCard 
            index={4}
            label="Referral Link" 
            value={user?.referralCode || "—"}
            icon={null}
            action={
              <button 
                onClick={handleCopy}
                className="flex items-center gap-2 text-[10px] text-[#ff6b35] hover:text-white transition-colors uppercase tracking-[0.15em] font-bold border border-orange-500/20 px-3 py-1 bg-orange-500/5 hover:bg-orange-500"
              >
                Copy <Copy className="w-3 h-3" />
              </button>
            }
          />
        </div> */}

         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-4">
                     <div className="bg-zinc-900/40 border border-zinc-800 hover:border-[#ff6b35]/20 p-6 rounded-sm">
                       <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block mb-2">
                         Authenticated As
                       </span>
                       <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                           <span className="text-xs font-bold text-zinc-200">
                             {displayWalletAddress ? "It has other info" : "Not Connected"}
                           </span>
                           <div className="w-2 h-2 rounded-full bg-[#ff6b35] " />
                         </div>
                         <button
                           onClick={handleCopyWalletAddress}
                           className="p-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-[#ff6b35] transition-all"
                           title="Copy wallet address"
                         >
                           {walletCopied ? (
                             <Check size={12} className="text-[#ff6b35]" />
                           ) : (
                             <Copy
                               size={12}
                               className="text-zinc-400 hover:text-[#ff6b35]"
                             />
                           )}
                         </button>
                       </div>
                     </div>
         
                     <div
                       onClick={() => setShowPointsHistoryModal(true)}
                       className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-sm relative overflow-hidden hover:border-[#ff6b35]/20 transition-all cursor-pointer group"
                     >
                       <div className="flex items-center justify-between mb-2">
                         <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
                           Accumulated Points
                         </span>
                         <span className="text-[10px] text-[#ff6b35] group-hover:text-[#ff6b35] transition-colors">
                           View history →
                         </span>
                       </div>
                       <div className="flex items-baseline gap-1">
                         <span className="text-3xl font-black text-[#ff6b35] tracking-tighter tabular-nums">
                           {blipPoints}
                         </span>
                       </div>
                       <div className="absolute bottom-0 left-0 w-full h-[2px] bg-zinc-800">
                         <div
                           className="h-full bg-[#ff6b35] transition-all duration-1000"
                           style={{
                             width: `${Math.min((blipPoints / 4000) * 100, 100)}%`,
                           }}
                         />
                       </div>
                     </div>
         
                     <div className="bg-zinc-900/40 border border-zinc-800 hover:border-[#ff6b35]/20 p-6 rounded-sm">
                       <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block mb-2">
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
                       className=" border hover:border-[#ff6b35]/20 p-6 rounded-sm  transition-all cursor-pointer group"
                     >
                       <div className="flex items-center justify-between mb-3">
                         <span className="text-[9px] font-black uppercase tracking-widest text-[#ff6b35]">
                           Your Referral Code
                         </span>
                         <span className="text-xs font-bold text-[#ff6b35]">
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
                             className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-[#ff6b35]/20 transition-all"
                             title="Copy referral code"
                           >
                             {copied ? (
                               <Check size={14} className="text-[#ff6b35]" />
                             ) : (
                               <Copy
                                 size={14}
                                 className="text-zinc-400 hover:text-[#ff6b35]"
                               />
                             )}
                           </button>
                           <button
                             onClick={(e) => {
                               e.stopPropagation();
                               handleShareReferral();
                             }}
                             className="p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-[#ff6b35]/20 transition-all"
                             title="Share referral link"
                           >
                             <Share2
                               size={14}
                               className="text-zinc-400 hover:text-[#ff6b35]"
                             />
                           </button>
                         </div>
                       </div>
                       <div className="mt-3 pt-3 border-t border-zinc-800/50 flex items-center justify-between">
                         <p className="text-[10px] text-zinc-500 truncate flex-1">
                           {referralLink || "Generate your referral link"}
                         </p>
                         <span className="text-[10px] text-zinc-600 group-hover:text-[#ff6b35] transition-colors ml-2">
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
              <div className="flex items-center gap-2 mb-2 text-[#ff6b35]">
                <Radio className="w-4 h-4 animate-pulse" />
                <span className="text-xs  uppercase tracking-widest">Incoming Transmission</span>
              </div>
              <h1 className="text-4xl font-medium text-white mb-2 tracking-tight">
                <TypewriterText text="Mission Control" speed={50} delay={500} />
              </h1>
              <p className="text-sm text-neutral-500  flex items-center gap-2">
                 <span className="text-[#ff6b35]">{'>'}{'>'}</span>
                 <TypewriterText text="Complete verification tasks to initialize vault allocation." speed={20} delay={1500} />
              </p>
            </div>
            
            <div className="flex gap-2">
               <button 
                 onClick={() => setFilter('all')}
                 className={`px-4 py-2 border text-xs  uppercase transition-all duration-300 hover:scale-105 active:scale-95 ${filter === 'all' ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:text-white hover:border-neutral-600'}`}
               >
                 Filter: All
               </button>
               <button 
                 onClick={() => setFilter('active')}
                 className={`px-4 py-2 border text-xs  uppercase transition-all duration-300 hover:scale-105 active:scale-95 ${filter === 'active' ? 'bg-orange-500 text-white border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.4)]' : 'border-neutral-800 bg-neutral-900/50 text-neutral-400 hover:text-white hover:border-neutral-600'}`}
               >
                 Filter: Active
               </button>
            </div>
          </div>

          {/* Featured Education Task */}
          <div className="mb-16">
            <EducationCard onStart={() => setSelectedTask({ 
              title: "Protocol Architecture & Whitepaper", 
              description: "Complete the foundational reading module to verify your understanding of the blip.money liquidity engine.", 
              reward: "500", 
              status: "active",
              icon: Terminal
            })} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column */}
            <div className="lg:col-span-8">
              
              {/* Social & Promotion Section */}
              <SectionTitle title="Social & Promotion" count={getVisibleTasks(TASKS_DATA.social).length} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                {getVisibleTasks(TASKS_DATA.social).map(task => (
                  <TaskCard key={task.id} task={task} onClick={handleTaskClick} />
                ))}
                {getVisibleTasks(TASKS_DATA.social).length === 0 && <div className="text-xs  text-neutral-600 italic p-4">No active social tasks available.</div>}
              </div>

              {/* Activity Section */}
              <SectionTitle title="Activity Logs" count={getVisibleTasks(TASKS_DATA.activity).length} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                {getVisibleTasks(TASKS_DATA.activity).map(task => (
                  <TaskCard key={task.id} task={task} onClick={handleTaskClick} />
                ))}
                {getVisibleTasks(TASKS_DATA.activity).length === 0 && <div className="text-xs  text-neutral-600 italic p-4">No active activity logs.</div>}
              </div>

              {/* Core Protocol Section */}
              <SectionTitle title="Core Infrastructure" count={getVisibleTasks(TASKS_DATA.core).length} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getVisibleTasks(TASKS_DATA.core).map(task => (
                  <TaskCard key={task.id} task={task} onClick={handleTaskClick} />
                ))}
                 {getVisibleTasks(TASKS_DATA.core).length === 0 && <div className="text-xs  text-neutral-600 italic p-4">Infrastructure tasks pending activation.</div>}
              </div>

            </div>

            {/* Right Column: Governance */}
            <div className="lg:col-span-4">
              <SectionTitle title="Governance & Sec" count={getVisibleTasks(TASKS_DATA.governance).length} />
              <div className="flex flex-col gap-4">
                {getVisibleTasks(TASKS_DATA.governance).map(task => (
                  <TaskCard key={task.id} task={task} onClick={handleTaskClick} />
                ))}
                 {getVisibleTasks(TASKS_DATA.governance).length === 0 && <div className="text-xs  text-neutral-600 italic p-4">Governance proposals are currently restricted.</div>}
              </div>
              
              {/* Institutional Notice */}
              <div className="mt-8 relative p-6 border border-neutral-800 bg-neutral-900/20 overflow-hidden group">
                 <div className="absolute top-0 right-0 p-2">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping" />
                 </div>
                <p className="text-[10px] text-[#ff6b35] uppercase tracking-[0.2em] font-bold mb-3 border-b border-neutral-800 pb-2 inline-block">System Notice</p>
                <p className="text-xs text-neutral-500 leading-relaxed ">
                  <span className="text-neutral-300">{'>'}{'>'} BETA_ACCESS_RESTRICTED</span><br/>
                  Rewards non-transferable until TGE. 
                  Unauthorized access attempts will result in immediate wallet blacklisting (IP_BAN).
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
    <Footer/>
    </>
  );
}