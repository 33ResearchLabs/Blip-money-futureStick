import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Gift,
  Percent,
  Wallet,
  Sparkles,
  Activity,
  Info,
  Menu,
  X,
  Layers,
  Zap,
  DollarSign,
} from "lucide-react";
import { NavLink } from "react-router-dom";

// --- MOCK/MIGRATED DEPENDENCIES (for single-file execution) ---

// 1. Mock Link (using standard <a>)
const Link = ({ to, children }) => <a href={to}>{children}</a>;

// 3. Mock SocialSidebar
const SocialSidebar = () => (
  <div className="fixed left-0 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
    <div className="flex flex-col gap-3 p-3 rounded-r-lg backdrop-blur-sm bg-black/40 border-r border-y border-white/5">
      <a
        href="https://t.me/+3DpHLzc2BfJhOWEx"
        className="p-2 text-gray-400 hover:text-[#00FF94] transition-colors"
      >
        T
      </a>
      <a
        href="#"
        className="p-2 text-gray-400 hover:text-[#00FF94] transition-colors"
      >
        D
      </a>
      <a
        href="#"
        className="p-2 text-gray-400 hover:text-[#00FF94] transition-colors"
      >
        M
      </a>
    </div>
  </div>
);

/* --------- SHARED BUTTON (Enhanced) --------- */
// const RewardsButton = ({ primary = false, className = "", children }) => (
//   <button
//     className={`
//       relative overflow-hidden px-7 py-3 rounded-full font-semibold tracking-wide
//       text-sm sm:text-base transition-all duration-300 group
//       ${
//         primary
//           ? "bg-[#00FF94] text-black hover:bg-[#0B9A4A] hover:shadow-[0_0_40px_rgba(0,255,148,0.5)] transform hover:scale-[1.02]"
//           : "border border-white/15 text-white bg-black/40 hover:border-[#00FF94] hover:text-[#00FF94] hover:shadow-[0_0_15px_rgba(0,255,148,0.1)]"
//       }
//       ${className}
//     `}
//   >
//     <span className="relative z-10 flex items-center gap-2">{children}</span>
//   </button>
// );
const RewardsButton = ({
  primary = false,
  className = "",
  children,
  onClick,
  type = "button",
}) => (
  <button
    type={type}
    onClick={onClick}
    className={`
      relative overflow-hidden px-7 py-3 rounded-full font-semibold tracking-wide 
      text-sm sm:text-base transition-all duration-300 group
      ${
        primary
          ? "bg-[#00FF94] text-black hover:bg-[#0B9A4A] hover:shadow-[0_0_40px_rgba(0,255,148,0.5)] transform hover:scale-[1.02]"
          : "border border-white/15 text-white bg-black/40 hover:border-[#00FF94] hover:text-[#00FF94] hover:shadow-[0_0_15px_rgba(0,255,148,0.1)]"
      }
      ${className}
    `}
  >
    <span className="relative z-10 flex items-center gap-2">{children}</span>
  </button>
);

/* --------- HERO BACKGROUND (NEW) --------- */
const DigitalGridBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          "linear-gradient(to right, #00FF9410 1px, transparent 1px), linear-gradient(to bottom, #00FF9410 1px, transparent 1px)",
        backgroundSize: "80px 80px",
        animation: "wave 60s linear infinite",
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-br from-[#020202] via-transparent to-[#020202]" />

    {/* Center pulsing glow */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] rounded-full bg-[#00FF94]/5 blur-[100px] animate-[pulse-slow_6s_ease-in-out_infinite]" />
  </div>
);

/* --------- HERO RIGHT: FUN REWARD GRAPHIC --------- */
const RewardOrbit = () => {
  return (
    <div className="relative w-full max-w-md aspect-square mx-auto">
      {/* outer glow */}
      <div className="absolute -inset-8 rounded-full bg-[#00FF94]/15 blur-3xl" />

      {/* orbit rings */}
      <div className="absolute inset-0 rounded-full border border-[#00FF94]/25 border-dashed animate-[spin_28s_linear_infinite]" />
      <div className="absolute inset-8 rounded-full border border-[#00C8FF]/25 animate-[spin_22s_linear_infinite_reverse]" />
      <div className="absolute inset-16 rounded-full border border-white/6" />

      {/* center coin */}
      <div className="absolute inset-[26%] rounded-full bg-gradient-to-br from-[#071810] via-[#020708] to-black shadow-[0_0_60px_rgba(0,255,148,0.4)] flex items-center justify-center">
        <div className="absolute inset-2 rounded-full border border-[#00FF94]/40" />
        <div className="absolute inset-5 rounded-full border border-dashed border-[#00FF94]/30" />
        <span className="relative text-5xl font-black text-[#00FF94] italic drop-shadow-[0_0_18px_rgba(0,255,148,0.9)]">
          B
        </span>
      </div>

      {/* floating labels */}
      <motion.div
        className="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/70 border border-white/15 text-[11px] font-mono tracking-[0.18em] text-gray-200 flex items-center gap-2"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#00FF94] animate-pulse" />
        100% FIRST TRANSFER
      </motion.div>

      <motion.div
        className="absolute bottom-6 left-0 px-3 py-1.5 rounded-2xl bg-black/80 border border-[#00C8FF]/40 text-[11px] text-[#A5F3FC] font-mono tracking-[0.16em]"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        +20M BLIP AIRDROP
      </motion.div>

      <motion.div
        className="absolute bottom-10 right-0 px-3 py-1.5 rounded-2xl bg-black/80 border border-[#FACC15]/40 text-[11px] text-[#FACC15] font-mono tracking-[0.16em]"
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7 }}
      >
        TIERED CASHBACK
      </motion.div>

      {/* orbiting chips */}
      <motion.div
        className="absolute top-[16%] left-[7%] px-3 py-1.5 rounded-full bg-black/80 border border-white/15 text-[11px] text-gray-200 flex items-center gap-1"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <Wallet size={14} className="text-[#00FF94]" />
        <span>Real payments</span>
      </motion.div>

      <motion.div
        className="absolute top-[16%] right-[7%] px-3 py-1.5 rounded-full bg-black/80 border border-white/15 text-[11px] text-gray-200 flex items-center gap-1"
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Gift size={14} className="text-[#00C8FF]" />
        <span>Mega pool</span>
      </motion.div>

      {/* animated volume line at bottom */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-4/5 h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div className="w-full h-full bg-gradient-to-r from-[#00FF94] via-[#00C8FF] to-[#FACC15]" />
        <motion.div
          className="absolute -left-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.7)]"
          animate={{ x: ["0%", "105%", "0%"] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};

/* --------- SECTION 1: HERO (UPDATED PT-CLASS) --------- */
const RewardsHero = ({ formSectionRef }) => (
  <section className="relative min-h-[90vh] pt-32 sm:pt-36 lg:pt-40 overflow-hidden bg-[#020202]">
    <DigitalGridBackground /> {/* NEW DYNAMIC BACKGROUND */}
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
      {/* LEFT */}
      <div className="w-full lg:w-[52%] text-center lg:text-left">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/70 border border-white/10 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00FF94] animate-pulse" />
            <span className="text-[10px] font-mono tracking-[0.24em] uppercase text-gray-300">
              Blip Rewards · Mega Airdrop
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.6rem] font-bold leading-[1] tracking-tight mb-5 mint-gradient-text">
            Get 100% back on your first transaction.
            <br />
            <span className="text-[#00FF94]"></span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-xl mx-auto lg:mx-0">
            **100% cashback on your first transfer**, tiered rewards on ongoing
            volume, and the first 1,000 users share a monumental{" "}
            <span className="text-[#00FF94] font-semibold">
              20,000,000 BLIP
            </span>{" "}
            pool. Be an early mover, get a massive drop.
          </p>

          {/* SHORT PILLS */}
          <div className="mt-6 flex flex-wrap gap-3 justify-center lg:justify-start">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/10 text-xs text-gray-200">
              <Wallet size={14} className="text-[#00FF94]" />
              **100% back on first transfer**
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/10 text-xs text-gray-200">
              <Gift size={14} className="text-[#00C8FF]" />
              20M BLIP Token Drop
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/10 text-xs text-gray-200">
              <Percent size={14} className="text-[#FACC15]" />
              Tiered volume cashback
            </div>
          </div>

          {/* CTAS */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            <Link to="/coming-soon">
              <RewardsButton primary className="w-full sm:w-auto">
                Start earning in a Blip
                <ArrowRight className="w-4 h-4" />
              </RewardsButton>
            </Link>

            <RewardsButton
              className="w-full sm:w-auto"
              onClick={() => {
                formSectionRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
            >
              View reward breakdown
            </RewardsButton>
          </div>
        </motion.div>
      </div>

      {/* RIGHT: GRAPHIC */}
      <div className="w-full lg:w-[48%] flex justify-center lg:justify-end py-10 lg:py-0 relative z-10">
        <RewardOrbit />
      </div>
    </div>
  </section>
);

/* --------- SECTION 2: THREE MAIN BENEFITS GRID --------- */

const RewardCard = ({ icon: Icon, badge, title, line1, line2, accent }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.6 }}
    className="relative rounded-3xl bg-[#050505] border border-white/8 overflow-hidden group p-6 sm:p-7 flex flex-col justify-between min-h-[200px] hover:border-[#00FF94]/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,255,148,0.2)]"
  >
    <div
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{
        background: `linear-gradient(to br, ${accent}15, transparent 60%)`,
      }}
    />
    <div className="relative flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-black border border-white/10 flex items-center justify-center">
            <Icon size={18} color={accent} />
          </div>
          <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-gray-500">
            {badge}
          </span>
        </div>
        <Sparkles
          size={16}
          className="text-gray-500 group-hover:text-[#00FF94]"
        />
      </div>

      <h3 className="text-lg sm:text-xl font-semibold text-white">{title}</h3>
      <p className="text-sm text-gray-300">
        {line1}
        <br />
        {line2}
      </p>
    </div>
  </motion.div>
);

const RewardsGrid = ({ formSectionRef }) => (
  <section
    ref={formSectionRef}
    // id="#rewardsgrid "
    className="py-16 sm:py-20 bg-[#020202] border-t border-white/5"
  >
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
        <div>
          <p className="text-[10px] font-mono tracking-[0.24em] uppercase text-gray-400 mb-2">
            Rewards Snapshot
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mint-gradient-text">
            Three main boosts every new user gets.
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RewardCard
          icon={Wallet}
          badge="First Transfer"
          title="100% cashback · up to $100."
          line1="We return every eligible fee from your first transfer"
          line2="as BLIP Tokens, capped at $100."
          accent="#00FF94"
        />
        <RewardCard
          icon={Gift}
          badge="Mega Sign-Up Drop"
          title="20 Million BLIP Token Drop."
          line1="Secure your spot in the 20,000,000 BLIP rewards pool."
          line2="You are guaranteed an allocation of $10,000+ (Est. Value)."
          accent="#00C8FF"
        />
        <RewardCard
          icon={Percent}
          badge="Ongoing Rewards"
          title="Tiered Volume Cashback."
          line1="Earn 10% back up to $10K volume, then 8% up to $200K."
          line2="Rewards are distributed as BLIP Tokens monthly."
          accent="#FACC15"
        />
      </div>
    </div>
  </section>
);

/* --------- NEW SECTION 3: REWARDS CALCULATOR (UPDATED LOGIC) --------- */

const RewardsCalculator = () => {
  const [monthlyVolume, setMonthlyVolume] = useState(1500); // USD
  const [tokenPrice] = useState(0.008); // USD per BLIP
  const protocolFeeRate = 0.01; // 0.5% protocol fee

  const calculateRewards = (volume) => {
    const tier1Limit = 10000;
    const tier2Limit = 200000;
    const tier1Rate = 10; // 10% cashback on fees
    const tier2Rate = 8; // 8% cashback on fees
    let rewardUSD = 0;

    // Tier 1: 10% cashback up to $10,000
    const volumeT1 = Math.min(volume, tier1Limit);
    const feesT1 = volumeT1 * protocolFeeRate;
    rewardUSD += feesT1 * tier1Rate;

    // Tier 2: 8% cashback from $10,001 up to $200,000
    if (volume > tier1Limit) {
      const volumeT2 = Math.min(volume, tier2Limit) - tier1Limit;
      const feesT2 = volumeT2 * protocolFeeRate;
      rewardUSD += feesT2 * tier2Rate;
    }

    // Note: For volumes above $200k, the reward is currently capped at the T2 reward max for simplicity in the UI.

    return {
      usd: rewardUSD,
      blip: rewardUSD / tokenPrice,
    };
  };

  const { usd: estimatedMonthlyRewardsUSD, blip: estimatedMonthlyRewardsBLIP } =
    calculateRewards(monthlyVolume);

  // Simulate market data for fun
  const [marketData] = useState({
    blipPriceChange: "+3.2%",
    blipPrice: `$${tokenPrice.toFixed(2)}`,
  });

  const handleVolumeChange = (e) => setMonthlyVolume(Number(e.target.value));

  return (
    <section className="py-24 bg-[#020202] border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-12 tracking-tight text-center mint-gradient-text">
          Rewards Estimator ( Limited Airdrop)
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-3 gap-8 rounded-3xl bg-[#080808] border border-[#00FF94]/20 p-6 sm:p-10 shadow-[0_0_60px_rgba(0,255,148,0.1)]"
        >
          {/* LEFT: Input Control */}
          <div className="lg:col-span-1 space-y-8 p-4 lg:pr-8 lg:border-r lg:border-white/5">
            <h3 className="text-xl font-semibold text-white">
              Project your cashback earnings
            </h3>

            {/* Volume Input */}
            <div className="space-y-4">
              <label htmlFor="volume-slider" className="text-sm text-gray-400">
                Total Transaction Volume (USD)
              </label>
              <input
                id="volume-slider"
                type="range"
                min="100"
                max="200000" // Max volume for T2 calculation
                step="100"
                value={monthlyVolume}
                onChange={handleVolumeChange}
                className="w-full h-1 appearance-none bg-white/10 rounded-full transition-colors accent-[#00FF94] cursor-pointer"
              />
              <p className="text-3xl font-mono text-[#00FF94] tracking-wider font-bold">
                ${monthlyVolume.toLocaleString()}
              </p>
            </div>

            {/* Assumptions/Info */}
            <div className="text-xs text-gray-500 pt-4 border-t border-white/5 space-y-1">
              <p>Assumed Protocol Fee: {protocolFeeRate * 100}%</p>
              <p>Cashback Tier 1: 10% on fees (Volume up to $10,000)</p>
              <p>Cashback Tier 2: 8% on fees (Volume $10,001 - $200,000)</p>
              <p>
                Current BLIP Price: {marketData.blipPrice} (
                {marketData.blipPriceChange})
              </p>
            </div>
            <p className="text-sm text-gray-400 border-t border-white/5 pt-4">
              *This calculator estimates your **ongoing monthly volume
              rewards**. It does not include the 100% cashback on your first
              transaction or the 20M BLIP airdrop.
            </p>
          </div>

          {/* RIGHT: Results Display */}
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6 pt-4 lg:pt-0 ">
            {/* Reward in BLIP */}
            <div className="rounded-2xl bg-black/40 border border-[#00FF94]/30 p-6 shadow-xl space-y-3">
              <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#00FF94]">
                Est. Cashback Rewards (BLIP)
              </p>
              <p className="text-[46px] font-extrabold  text-white ">
                {estimatedMonthlyRewardsBLIP.toFixed(2)}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Sparkles size={16} className="text-[#00FF94]" />
                BLIP Tokens
              </div>
            </div>

            {/* Reward in USD */}
            <div className="rounded-2xl bg-black/40 border border-white/10 p-6 space-y-3">
              <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-gray-400">
                Equivalent Value
              </p>
              <p className="text-[46px] font-extrabold text-white">
                <DollarSign className="inline w-6 h-6 mr-1 mb-1 text-gray-300" />
                {estimatedMonthlyRewardsUSD.toFixed(2)}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Zap size={16} className="text-white/80" />
                Stable Value (USD)
              </div>
            </div>

            {/* CTA */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-[#00FF94]/10 border border-[#00FF94]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm font-semibold text-gray-200">
                Ready to unlock these rewards?
              </p>
              <Link to="/coming-soon">
                <RewardsButton primary className="text-sm px-6 py-2">
                  Start Your First Transfer <ArrowRight size={16} />
                </RewardsButton>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* --------- SECTION 4: REWARDS FLOW (EXISTING) --------- */

const FlowCard = ({ number, title, line1, line2, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.5, delay: delay }}
    className="relative rounded-2xl bg-[#050505] border border-white/8 p-7"
  >
    <div className="absolute -top-4 left-6 w-9 h-9 rounded-full bg-black border border-[#00FF94]/60 flex items-center justify-center shadow-[0_0_16px_rgba(0,255,148,0.6)]">
      <span className="text-[11px] font-mono tracking-[0.16em] text-[#00FF94]">
        0{number}
      </span>
    </div>
    <h3 className="text-lg sm:text-xl font-semibold text-white mb-3">
      {title}
    </h3>
    <p className="text-sm text-gray-300 mb-2">{line1}</p>
    <p className="text-xs text-gray-500">{line2}</p>
  </motion.div>
);

const FlowSection = () => (
  <section className="py-16 sm:py-24 bg-[#020202] border-t border-white/5">
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
        <div>
          <p className="text-[10px] font-mono tracking-[0.24em] uppercase text-gray-400 mb-2">
            ONE SIMPLE FLOW
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mint-gradient-text">
            Send once. Watch three rewards unlock.
          </h2>
        </div>
      </div>

      <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Connector Lines (Desktop only) */}
        <div className="hidden lg:block absolute inset-0 pointer-events-none">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="flowLine" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00FF94" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#00FF94" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#00FF94" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            {/* Line 1 (Card 1 to Card 2) */}
            <path
              d="M18,30 L45,30"
              stroke="url(#flowLine)"
              strokeWidth="2"
              strokeDasharray="4 4"
              style={{ filter: "drop-shadow(0 0 2px #00FF94)" }}
            />
            {/* Line 2 (Card 2 to Card 3) */}
            <path
              d="M55,30 L82,30"
              stroke="url(#flowLine)"
              strokeWidth="2"
              strokeDasharray="4 4"
              style={{ filter: "drop-shadow(0 0 2px #00FF94)" }}
            />

            {/* Flow dots */}
            <circle
              cx="31.5"
              cy="30"
              r="3"
              fill="#00FF94"
              className="animate-[pulse_1.5s_ease-in-out_infinite]"
            />
            <circle
              cx="68.5"
              cy="30"
              r="3"
              fill="#00FF94"
              className="animate-[pulse_1.5s_ease-in-out_infinite_1s]"
            />
          </svg>
        </div>

        <FlowCard
          number={1}
          title="Make your first transfer."
          line1="Pay a friend, merchant, or move funds cross-border."
          line2="The app tracks it as your welcome transfer and earmarks 100% cashback (up to $100)."
          delay={0}
        />

        <FlowCard
          number={2}
          title="Unlock your Mega Drop spot."
          line1="Connect wallet, finish KYC (where needed), and verify email."
          line2="Your 20M BLIP allocation is locked to your address as long as you stay in the active cohort."
          delay={0.15}
        />

        <FlowCard
          number={3}
          title="Keep using Blip."
          line1="Every eligible transaction adds to your cashback stream."
          line2="A percentage of protocol fees loops back to you via tiered volume rewards."
          delay={0.3}
        />
      </div>
    </div>
  </section>
);

/* --------- SECTION 5: EARLY POOL (UPDATED) --------- */

const EarlyPoolSection = () => {
  const [filled, setFilled] = useState(25);

  useEffect(() => {
    // Simulate pool filling up over time
    const interval = setInterval(() => {
      setFilled((prev) => Math.min(95, prev + Math.random() * 5));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 sm:py-24 bg-[#020202] border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid gap-10 lg:grid-cols-[1.1fr_minmax(0,0.9fr)] items-center">
        {/* Left copy */}
        <div>
          <p className="text-[10px] font-mono tracking-[0.24em] uppercase text-[#00FF94] mb-2">
            MEGA AIRDROP · FIRST 1,000 USERS
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-4 tracking-tight mint-gradient-text">
            20,000,000 BLIP Tokens reserved for the first 1,000 people who move
            money.
          </h2>
          <p className="text-sm sm:text-base text-gray-300 mb-4">
            Early adopters don’t just test the protocol, they help shape it. So
            we’re putting a serious, multi-million dollar reward pool on the
            table for you.
          </p>

          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#00FF94] shadow-[0_0_8px_rgba(0,255,148,0.8)]" />
              First 1,000 verified users are placed into the early rewards pool.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#00FF94]" />
              Pool size:
              <span className="text-white font-semibold ml-1">
                20,000,000 BLIP Tokens.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#00FF94]" />
              Your share is based on your completed transfers and volume during
              the early-access period.
            </li>
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/coming-soon">
              <RewardsButton primary>
                Join the first 1,000
                <ArrowRight className="w-4 h-4" />
              </RewardsButton>
            </Link>
            <Link to="/tokenomics">
              <RewardsButton>View tokenomics page</RewardsButton>
            </Link>
          </div>
        </div>

        {/* Right “progress” card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="absolute -inset-3 bg-gradient-to-br from-[#00FF94]/25 via-[#00C8FF]/20 to-[#7C3AED]/18 blur-3xl opacity-85" />
          <div className="relative rounded-3xl bg-[#050707] border border-white/10 p-6 sm:p-7 shadow-[0_24px_80px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-mono tracking-[0.24em] uppercase text-gray-400 mb-1">
                  Pool Overview
                </p>
                <p className="text-xs text-gray-500">
                  Numbers update in the app. This is a preview.
                </p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-black border border-[#00FF94]/40 flex items-center justify-center text-[#00FF94]">
                <Activity size={18} />
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-xs text-gray-400 uppercase font-mono tracking-[0.16em]">
                  Total Early Pool (Est. USD)
                </span>
                <span className="text-sm text-gray-300">Fixed</span>
              </div>
              <p className="text-3xl sm:text-4xl font-semibold text-[#00FF94]">
                $10,000,000
              </p>
            </div>

            <div className="mb-5">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                <span>Spots filled</span>
                <span className="text-[#00FF94] font-semibold">
                  {Math.round(filled * 10)} / 1,000*
                </span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#00FF94] via-[#00C8FF] to-[#7C3AED]"
                  initial={{ width: "0%" }}
                  animate={{ width: `${filled}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <p className="mt-2 text-[11px] text-gray-500">
                *Live counter appears in-app when the campaign is active.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-gray-300">
              <div className="rounded-2xl bg-black/40 border border-white/10 p-3">
                <p className="text-[10px] font-mono tracking-[0.18em] uppercase text-gray-400 mb-1">
                  EST. PER USER
                </p>
                <p className="text-lg text-white">
                  Up to <span className="text-[#00FF94]">$10,000</span>+
                </p>
              </div>
              <div className="rounded-2xl bg-black/40 border border-white/10 p-3">
                <p className="text-[10px] font-mono tracking-[0.18em] uppercase text-gray-400 mb-1">
                  BONUS BOOST
                </p>
                <p className="text-lg text-white">
                  Heavy users
                  <br />
                  earn more.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* --------- NEW SECTION 6: TOKEN UTILITY --------- */
const BLIP_TOKEN_UTILITIES = [
  {
    id: "staking",
    label: "Merchant Staking",
    symbol: "◆",
    color: "#00FF94",
    icon: Layers,
    description: "Stake BLIP to unlock Tier 1 trust and higher routing volume.",
  },
  {
    id: "priority",
    label: "Routing Priority",
    symbol: "➤",
    color: "#38BDF8",
    icon: Zap,
    description:
      "Holders get priority matching for faster cross-border settlements.",
  },
  {
    id: "rewards",
    label: "Liquidity Rewards",
    symbol: "◉",
    color: "#A855F7",
    icon: Gift,
    description: "Earn APY by providing value to PeopleBank liquidity pools.",
  },
  {
    id: "dispute",
    label: "Protocol Governance",
    symbol: "⚖",
    color: "#FACC15",
    icon: Info,
    description: "Vote on fees, reward schedules, and network upgrades.",
  },
];

const TokenUtilitySection = () => (
  <section className="py-24 bg-[#020202] border-t border-white/5">
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-12 tracking-tight text-center mint-gradient-text">
        The BLIP Token: More Than Just Rewards
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {BLIP_TOKEN_UTILITIES.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative rounded-2xl bg-[#050505] border border-white/8 p-6 space-y-3 group hover:border-[#00FF94]/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,148,0.1)]"
            >
              <div
                className="w-10 h-10 rounded-xl bg-black border border-white/10 flex items-center justify-center text-xl"
                style={{ color: item.color }}
              >
                <Icon size={18} />
              </div>
              <h3 className="text-xl font-semibold text-white group-hover:text-[#00FF94] transition-colors">
                {item.label}
              </h3>
              <p className="text-sm text-gray-400">{item.description}</p>
            </motion.div>
          );
        })}
      </div>
      <div className="mt-12 text-center">
        <Link to="/tokenomics">
          <RewardsButton>Read the Full Tokenomics</RewardsButton>
        </Link>
      </div>
    </div>
  </section>
);

/* --------- SECTION 7: FUN STRIP + MINI FAQ (EXISTING) --------- */

const FunStrip = () => (
  <section className="py-16 bg-[#020202] border-t border-white/5">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 grid gap-10 md:grid-cols-[1.1fr_minmax(0,0.9fr)] items-start">
      {/* Fun summary */}
      <div>
        <p className="text-[10px] font-mono tracking-[0.24em] uppercase text-gray-400 mb-2">
          TL;DR
        </p>
        <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4 mint-gradient-text">
          Blip feels less like a bank, more like a game with real money.
        </h3>
        <p className="text-sm sm:text-base text-gray-300 mb-4">
          You move money the way you usually would. In the background, the
          rewards engine keeps ticking: welcome bonus, sign-up drop, and ongoing
          volume rewards.
        </p>
        <div className="flex flex-wrap gap-3 text-xs sm:text-sm">
          <div className="px-4 py-2 rounded-full bg-black/60 border border-white/10 text-gray-300 hover:border-[#FACC15] transition-colors">
            No points. Real tokens.
          </div>
          <div className="px-4 py-2 rounded-full bg-black/60 border border-white/10 text-gray-300 hover:border-[#00C8FF] transition-colors">
            No loot boxes. Clear caps.
          </div>
          <div className="px-4 py-2 rounded-full bg-black/60 border border-white/10 text-gray-300 hover:border-[#00FF94] transition-colors">
            On-chain. Transparent.
          </div>
        </div>
      </div>

      {/* Mini FAQ */}
      <div className="rounded-2xl bg-[#050505] border border-white/10 p-6 sm:p-7 hover:border-[#00FF94]/50 transition-colors">
        <div className="flex items-center gap-2 mb-4">
          <Info size={18} className="text-[#00FF94]" />
          <p className="text-[11px] font-mono tracking-[0.18em] uppercase text-gray-400">
            QUICK QUESTIONS
          </p>
        </div>

        <div className="space-y-4 text-sm text-gray-300">
          <div>
            <p className="font-medium text-white mb-1">
              Is this live data or simulated?
            </p>
            <p className="text-gray-400">
              Numbers you see here are design previews. Live balances and pool
              stats appear in the app.
            </p>
          </div>
          <div>
            <p className="font-medium text-white mb-1">
              Can rewards change later?
            </p>
            <p className="text-gray-400">
              Yes. Rates, caps and terms can be updated by governance. Early
              access rewards are time-limited.
            </p>
          </div>
          <div>
            <p className="font-medium text-white mb-1">
              How do I know if I&apos;m in the first 1,000?
            </p>
            <p className="text-gray-400">
              The app shows a simple badge and counter once you secure a spot.
              If the pool is full, you&apos;ll see that too.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <Link to="/coming-soon">
            <RewardsButton primary className="w-full sm:w-auto">
              I want a spot
              <ArrowRight className="w-4 h-4" />
            </RewardsButton>
          </Link>
        </div>
      </div>
    </div>
  </section>
);

/* --------- PAGE WRAPPER --------- */

const App = () => {
  const formSectionRef = useRef(null);

  useEffect(() => {
    scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
      {/* Custom Styles/Keyframes */}
      <style>
        {`
          /* Custom Keyframes for Rewards Orbit */
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.8; }
          }
          @keyframes pulse-slow {
             0%, 100% { opacity: 0.4; }
             50% { opacity: 0.6; }
          }
          @keyframes wave {
             0% { background-position: 0 0; }
             100% { background-position: 100% 100%; }
          }
          /* Custom Gradient Text */
          .mint-gradient-text {
            background-image: linear-gradient(to right, #ffffff, #00FF94);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            color: transparent;
          }
        `}
      </style>
      {/* <Navbar /> */}
      <SocialSidebar />
      <RewardsHero formSectionRef={formSectionRef} />{" "}
      {/* 1. Enhanced Hero + Orbit */}
      <RewardsGrid formSectionRef={formSectionRef} />{" "}
      {/* 2. Three rewards cards */}
      <RewardsCalculator /> {/* 3. Interactive reward estimation */}
      <FlowSection /> {/* 4. How it flows */}
      <EarlyPoolSection /> {/* 5. 20M BLIP Mega Airdrop */}
      <TokenUtilitySection />
      {/* 6. Token utility grid */}
      <FunStrip /> {/* 7. Fun TL;DR + FAQ */}
    </div>
  );
};

export default App;
