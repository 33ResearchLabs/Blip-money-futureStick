import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Globe, ChevronDown } from "lucide-react";
import { MerchantDashboardCompact } from "@/components/MerchantDashboardCompact";

const currencies = [
  {
    id: 1,
    title: "All accounts",
    amount: 4224.47,
    symbol: "€",
    icon: Globe,
    color: "bg-[#f4a68c]/60",
  },
  {
    id: 2,
    title: "Euro",
    amount: 3414.32,
    symbol: "€",
    flag: "🇪🇺",
    color: "bg-[#f4a68c]/45",
  },
  {
    id: 3,
    title: "British Pound",
    amount: 532.67,
    symbol: "£",
    flag: "🇬🇧",
    color: "bg-[#f4a68c]/35",
  },
  {
    id: 4,
    title: "Polish Zloty",
    amount: 326.98,
    symbol: "zł",
    flag: "🇵🇱",
    color: "bg-[#f4a68c]/25",
  },
];

const transactions = [
  {
    name: "Sent to Peter Smith",
    time: "20:14",
    amount: "-500",
    currency: "EUR",
  },
  {
    name: "Bought EUR with PLN",
    time: "18:01",
    amount: "-730.25",
    currency: "PLN",
  },
  {
    name: "Sent to George...",
    time: "09:01",
    amount: "-10,345",
    currency: "PLN",
  },
];

const CARD_HEIGHT = 130;
const LIST_GAP = 35;
const STACK_OFFSET = 6;

function useCountUp(
  target: number,
  duration: number,
  delay: number,
  start: boolean,
) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    const timeout = setTimeout(() => {
      const startTime = performance.now();
      const step = (now: number) => {
        const progress = Math.min((now - startTime) / (duration * 1000), 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(eased * target);
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [target, duration, delay, start]);
  return value;
}

function AnimatedAmount({
  symbol,
  amount,
  delay,
  start,
}: {
  symbol: string;
  amount: number;
  delay: number;
  start: boolean;
}) {
  const value = useCountUp(amount, 1.4, delay, start);
  return (
    <span>
      {symbol}
      {value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </span>
  );
}

function AnimatedTypingAmount() {
  const digits = ["€", "2", ",", "5", "0", "0", ".", "0", "0"];
  const [shown, setShown] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setShown(i);
      if (i >= digits.length) {
        clearInterval(interval);
        setTimeout(() => setDone(true), 400);
      }
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <motion.p
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-[28px] font-bold text-gray-900 tabular-nums"
      >
        {digits.slice(0, shown).join("")}
        {!done && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="text-[#E6391E]"
          >
            |
          </motion.span>
        )}
        {shown === 0 && <span className="text-gray-300">€0.00</span>}
      </motion.p>
    </div>
  );
}

function TradingBuySellToggle() {
  const [isBuy, setIsBuy] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => setIsBuy((v) => !v), 3000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="flex items-center bg-neutral-800 rounded-full p-0.5 relative">
      <motion.div
        className="absolute top-0.5 bottom-0.5 rounded-full"
        animate={{
          left: isBuy ? 2 : "50%",
          right: isBuy ? "50%" : 2,
          backgroundColor: isBuy ? "#10b981" : "#ef4444",
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
      <span className={`relative z-10 text-[9px] font-semibold px-3 py-0.5 ${isBuy ? "text-white" : "text-white/50"}`}>Buy</span>
      <span className={`relative z-10 text-[9px] font-semibold px-3 py-0.5 ${!isBuy ? "text-white" : "text-white/50"}`}>Sell</span>
    </div>
  );
}

function TradingAmountTyping() {
  const chars = ["5", "0"];
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setShown((s) => {
          if (s >= chars.length) {
            clearInterval(interval);
            return s;
          }
          return s + 1;
        });
      }, 300);
      return () => clearInterval(interval);
    }, 1500);
    return () => clearTimeout(timeout);
  }, []);
  return (
    <span className="text-[16px] font-bold text-white tabular-nums">
      {shown === 0 ? <span className="text-white/20">0</span> : chars.slice(0, shown).join("")}
    </span>
  );
}

export default function PremiumFintechSection() {
  const [stage, setStage] = useState<"list" | "stacked" | "phone" | "addMoney" | "trading">(
    "list",
  );
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-20%" });

  useEffect(() => {
    if (!isInView) return;
    const t1 = setTimeout(() => setStage("stacked"), 3500);
    const t2 = setTimeout(() => setStage("phone"), 6000);
    const t3 = setTimeout(() => setStage("addMoney"), 9000);
    const t4 = setTimeout(() => setStage("trading"), 13000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isInView]);

  const getCardY = (idx: number) => {
    if (stage === "stacked" || stage === "phone" || stage === "addMoney" || stage === "trading")
      return idx * STACK_OFFSET;
    return idx * (CARD_HEIGHT + LIST_GAP);
  };

  const totalListHeight =
    currencies.length * CARD_HEIGHT + (currencies.length - 1) * LIST_GAP;
  const totalStackHeight = CARD_HEIGHT + (currencies.length - 1) * STACK_OFFSET;

  const isTrading = stage === "trading";
  const isPhone = stage === "phone" || stage === "addMoney" || isTrading;
  const isStacked =
    stage === "stacked" || stage === "phone" || stage === "addMoney" || isTrading;

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#E6391E] overflow-hidden"
      style={{ minHeight: "200vh" }}
    >
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: isStacked ? 1.5 : 1,
            opacity: isStacked ? 0.3 : 0.15,
          }}
          transition={{ duration: 1.5 }}
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-white rounded-full blur-[140px]"
        />
      </div>

      {/* Sticky wrapper */}
      <div className="sticky top-0 min-h-screen flex items-center justify-center px-6 md:px-20 py-20">
        <div className={`relative w-full max-w-6xl flex items-center ${isTrading ? "justify-between" : "justify-center"}`}>
          {/* Left Text — phone/addMoney stages */}
          <AnimatePresence>
            {isPhone && !isTrading && (
              <motion.div
                key="left-text"
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="hidden md:block absolute left-0 max-w-sm z-10"
              >
                <div className="w-16 h-[1px] bg-white/40 mb-8" />
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight font-display">
                  Move your money
                  <br />
                  across Europe
                </h3>
                <p className="text-white/60 text-base md:text-lg mt-4 max-w-xs">
                  Send money anywhere in the EU, effortlessly.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Merchant Dashboard — trading stage (in flow, not absolute) */}
          <AnimatePresence>
            {isTrading && (
              <motion.div
                key="merchant-dashboard"
                initial={{ opacity: 0, x: -80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="hidden lg:block flex-1 max-w-[55%] z-10"
              >
                <MerchantDashboardCompact />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Center Content */}
          <div className="flex flex-col items-center">
            {/* Heading — collapses smoothly when entering phone */}
            <motion.div
              animate={{
                height: isPhone ? 0 : "auto",
                opacity: isPhone ? 0 : 1,
                marginBottom: isPhone ? 0 : 40,
              }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {stage === "list" && (
                  <motion.h2
                    key="list-title"
                    initial={{ opacity: 0, y: 80 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    exit={{ opacity: 0, y: -30, scale: 0.95 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className="pb-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white tracking-tight font-display text-center"
                  >
                    All currencies
                  </motion.h2>
                )}
                {stage === "stacked" && (
                  <motion.h2
                    key="stacked-title"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className="pb-4 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium text-white tracking-tight font-display text-center"
                  >
                    One App
                  </motion.h2>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Cards + Phone wrapper */}
            <motion.div
              animate={{
                width: isPhone ? 270 : 420,
                height: isPhone
                  ? 580
                  : isStacked
                    ? totalStackHeight
                    : totalListHeight,
              }}
              transition={{
                width: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
                height: {
                  duration: isPhone ? 0.6 : 1.2,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
              className="relative"
            >
              {/* Phone Frame — iPhone 17 Pro style */}
              <motion.div
                initial={false}
                animate={{
                  opacity: isPhone ? 1 : 0,
                  scale: isPhone ? 1 : 0.95,
                }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-[-4px] z-0 pointer-events-none"
              >
                {/* Titanium bezel — light pink/rose */}
                <div className="w-full h-full bg-gradient-to-b from-[#f5cdc1] to-[#f0b8a8] rounded-[3rem] shadow-[0_50px_100px_-25px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.3)]" />
                {/* Bezel edge highlight */}
                <div className="absolute inset-[1px] rounded-[2.9rem] border border-white/20" />
                {/* Inner screen */}
                <div className="absolute inset-[3px] bg-gradient-to-b from-[#e8593b] via-[#E6391E] to-[#c9311a] rounded-[2.7rem] overflow-hidden">
                  {/* Upper half background image/decoration */}
                  <div className="absolute top-0 left-0 right-0 h-[45%]">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#f4a68c]/50 via-[#e8593b]/30 to-transparent" />
                    <div className="absolute top-6 right-0 w-32 h-32 bg-[#f4a68c]/40 rounded-full blur-2xl" />
                    <div className="absolute top-10 right-6 w-20 h-20 bg-[#f5cdc1]/50 rounded-full blur-xl" />
                    <div className="absolute top-4 left-1/3 w-16 h-16 bg-[#f4a68c]/30 rounded-full blur-xl" />
                    {/* Abstract 3D shape hint */}
                    <div className="absolute top-8 right-8 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#f5cdc1]/60 to-[#f4a68c]/30 rotate-12 blur-[2px]" />
                    <div className="absolute top-12 right-12 w-10 h-10 rounded-xl bg-gradient-to-br from-[#f5cdc1]/80 to-[#f4a68c]/40 -rotate-6" />
                  </div>
                </div>
                {/* Status bar — time, network, battery */}
                <div className="absolute top-[5px] left-[12px] right-[12px] z-20 flex items-center justify-between px-2 py-1">
                  <span className="text-white text-[9px] font-semibold">
                    20:22
                  </span>
                  <div />
                  <div className="flex items-center gap-1">
                    {/* Signal bars */}
                    <svg
                      width="14"
                      height="10"
                      viewBox="0 0 14 10"
                      className="text-white"
                    >
                      <rect
                        x="0"
                        y="7"
                        width="2"
                        height="3"
                        rx="0.5"
                        fill="currentColor"
                      />
                      <rect
                        x="3"
                        y="5"
                        width="2"
                        height="5"
                        rx="0.5"
                        fill="currentColor"
                      />
                      <rect
                        x="6"
                        y="3"
                        width="2"
                        height="7"
                        rx="0.5"
                        fill="currentColor"
                      />
                      <rect
                        x="9"
                        y="0"
                        width="2"
                        height="10"
                        rx="0.5"
                        fill="currentColor"
                      />
                    </svg>
                    {/* WiFi */}
                    <svg
                      width="12"
                      height="10"
                      viewBox="0 0 12 10"
                      className="text-white"
                    >
                      <path
                        d="M6 8.5a1 1 0 110 2 1 1 0 010-2z"
                        fill="currentColor"
                      />
                      <path
                        d="M3.5 7a3.5 3.5 0 015 0"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        fill="none"
                        strokeLinecap="round"
                      />
                      <path
                        d="M1.5 5a6 6 0 019 0"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        fill="none"
                        strokeLinecap="round"
                      />
                    </svg>
                    {/* Battery */}
                    <div className="flex items-center">
                      <div className="w-[18px] h-[9px] border border-white/80 rounded-[2px] flex items-center p-[1px]">
                        <div className="w-[70%] h-full bg-white rounded-[1px]" />
                      </div>
                      <div className="w-[1.5px] h-[4px] bg-white/80 rounded-r-full ml-[0.5px]" />
                    </div>
                  </div>
                </div>
                {/* Dynamic Island */}
                <div className="absolute top-[12px] left-1/2 -translate-x-1/2 w-[90px] h-[28px] bg-black rounded-full z-30" />
                {/* Side button — power */}
                <div className="absolute top-[120px] -right-[2px] w-[3px] h-[40px] bg-[#d9a999] rounded-r-sm" />
                {/* Side buttons — volume */}
                <div className="absolute top-[100px] -left-[2px] w-[3px] h-[28px] bg-[#d9a999] rounded-l-sm" />
                <div className="absolute top-[138px] -left-[2px] w-[3px] h-[28px] bg-[#d9a999] rounded-l-sm" />
              </motion.div>

              {/* Card stack — scales into phone */}
              <motion.div
                animate={{
                  scale: isPhone ? 0.6 : 1,
                  y: isPhone ? 50 : 0,
                }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10"
                style={{
                  width: 420,
                  left: "50%",
                  marginLeft: -210,
                  transformOrigin: "top center",
                }}
              >
                <div
                  className="relative w-full"
                  style={{
                    height: isStacked ? totalStackHeight : totalListHeight,
                  }}
                >
                  {currencies.map((curr, idx) => (
                    <motion.div
                      key={curr.id}
                      initial={{ opacity: 0, y: 150 }}
                      animate={{
                        y: getCardY(idx),
                        scale: isStacked ? 1 - idx * 0.025 : 1,
                        opacity: isInView ? 1 : 0,
                      }}
                      transition={{
                        duration: isStacked ? 1.2 : 0.9,
                        delay:
                          isInView && stage === "list"
                            ? idx * 0.15
                            : idx * 0.05,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="absolute top-0 left-0 w-full"
                      style={{ zIndex: currencies.length - idx }}
                    >
                      <div
                        className={`
                          ${curr.color} backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 md:p-8
                          transition-shadow duration-700
                          ${
                            isStacked && idx === 0
                              ? "shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)]"
                              : "shadow-lg"
                          }
                        `}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                            {curr.flag ? (
                              <span className="text-lg">{curr.flag}</span>
                            ) : (
                              <Globe size={16} className="text-white/70" />
                            )}
                          </div>
                          <span className="text-white/90 font-medium text-sm flex items-center gap-1">
                            {curr.title}
                            {curr.id === 1 && (
                              <ChevronDown size={14} className="opacity-40" />
                            )}
                          </span>
                        </div>
                        <div className="text-white text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
                          <AnimatedAmount
                            symbol={curr.symbol}
                            amount={curr.amount}
                            delay={0.3 + idx * 0.25}
                            start={isInView}
                          />
                        </div>
                        {idx === 0 && isPhone && !isTrading && (
                          <div className="flex items-center gap-2 mt-4">
                            <button className="bg-white text-[#E6391E] font-semibold py-2 px-5 rounded-full flex items-center gap-1.5 text-xs shadow-md">
                              + Add money
                            </button>
                            <button className="bg-white/20 text-white font-medium py-2 px-5 rounded-full flex items-center gap-1.5 text-xs backdrop-blur-sm border border-white/10">
                              → Send
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Phone inner content — transactions + bottom nav (not during trading) */}
              <AnimatePresence>
                {isPhone && !isTrading && (
                  <>
                    {/* Transactions list */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.8,
                        duration: 0.8,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="absolute left-2 right-2 z-10"
                      style={{ top: 210 }}
                    >
                      <div className="bg-white rounded-2xl p-3 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-semibold text-gray-900">
                            Transactions
                          </span>
                          <span className="text-[10px] font-semibold text-[#E6391E]">
                            See all &gt;
                          </span>
                        </div>
                        <p className="text-[9px] text-gray-400 mb-1.5">Today</p>
                        {transactions.map((tx, i) => (
                          <div
                            key={i}
                            className={`flex items-center justify-between py-2 ${
                              i < transactions.length - 1
                                ? "border-b border-gray-100"
                                : ""
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                                <div className="w-3 h-3 rounded-full bg-gray-300" />
                              </div>
                              <div>
                                <p className="text-[10px] font-medium text-gray-900 leading-tight">
                                  {tx.name}
                                </p>
                                <p className="text-[8px] text-gray-400">
                                  {tx.time}
                                </p>
                              </div>
                            </div>
                            <span className="text-[10px] font-semibold text-gray-900">
                              {tx.amount}{" "}
                              <span className="text-gray-400 font-normal text-[9px]">
                                {tx.currency}
                              </span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Bottom Nav */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 1,
                        duration: 0.8,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-10"
                    >
                      <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/10 backdrop-blur-sm" />
                      <div className="w-9 h-9 rounded-full bg-[#E6391E] border-2 border-white/30 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                        +
                      </div>
                      <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/10 backdrop-blur-sm" />
                    </motion.div>

                    {/* Promo bar */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: stage === "addMoney" ? 0 : 1 }}
                      transition={{
                        delay: stage === "addMoney" ? 0 : 1.2,
                        duration: 0.6,
                      }}
                      className="absolute bottom-[52px] left-3 right-3 z-10"
                    >
                      <div className="bg-white rounded-full px-3 py-1.5 flex items-center justify-between">
                        <span className="text-[9px] text-gray-500 font-medium">
                          Promos for you
                        </span>
                        <div className="w-16 h-1 bg-gray-200 rounded-full" />
                        <span className="text-[10px] text-gray-400">×</span>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              {/* Add Money Screen — slides up from bottom inside phone */}
              <AnimatePresence>
                {stage === "addMoney" && (
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute top-[44px] left-[3px] right-[3px] bottom-[3px] rounded-t-2xl rounded-b-[2.7rem] z-40 overflow-hidden bg-white"
                  >
                    {/* Header */}
                    <div className="pt-4 pb-4 px-5">
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-[10px] text-gray-400">
                          Cancel
                        </span>
                        <span className="text-[12px] font-semibold text-gray-900">
                          Add money
                        </span>
                        <div className="w-8" />
                      </div>

                      {/* Amount input — animated typing */}
                      <div className="text-center mb-6">
                        <AnimatedTypingAmount />
                        <p className="text-[9px] text-gray-400 mt-1">
                          EUR · Euro
                        </p>
                      </div>
                    </div>

                    {/* Payment methods */}
                    <div className="px-4">
                      <p className="text-[9px] text-gray-400 uppercase tracking-wider mb-2 px-1">
                        Choose method
                      </p>
                      {[
                        {
                          icon: "💳",
                          label: "Debit / Credit Card",
                          sub: "Visa, Mastercard",
                        },
                        {
                          icon: "🏦",
                          label: "Bank Transfer",
                          sub: "SEPA, SWIFT",
                        },
                        { icon: "📱", label: "Apple Pay", sub: "Instant" },
                        {
                          icon: "🔗",
                          label: "From another account",
                          sub: "Internal transfer",
                        },
                      ].map((method, i) => (
                        <motion.div
                          key={method.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: 0.5 + i * 0.1,
                            duration: 0.6,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className={`flex items-center gap-3 py-2.5 px-2 rounded-xl hover:bg-gray-50 transition-colors ${
                            i < 3 ? "border-b border-gray-100" : ""
                          }`}
                        >
                          <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-sm">
                            {method.icon}
                          </div>
                          <div className="flex-1">
                            <p className="text-[11px] font-medium text-gray-900">
                              {method.label}
                            </p>
                            <p className="text-[9px] text-gray-400">
                              {method.sub}
                            </p>
                          </div>
                          <ChevronDown
                            size={12}
                            className="text-gray-300 -rotate-90"
                          />
                        </motion.div>
                      ))}
                    </div>

                    {/* Bottom bar — starts grey, turns active after typing */}
                    <motion.div
                      initial={{ opacity: 0.4, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 2.2, duration: 0.6 }}
                      className="absolute bottom-6 left-4 right-4"
                    >
                      <motion.div
                        initial={{ backgroundColor: "#d1d5db" }}
                        animate={{ backgroundColor: "#E6391E" }}
                        transition={{ delay: 2.2, duration: 0.4 }}
                        className="w-full py-3 rounded-2xl text-center"
                      >
                        <span className="text-white text-[11px] font-semibold">
                          Continue
                        </span>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Trading Screen — P2P crypto trading UI inside phone */}
              <AnimatePresence>
                {isTrading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-[3px] rounded-[2.7rem] z-40 overflow-hidden bg-[#0a0a0a]"
                  >
                    {/* Status bar overlay for dark bg */}
                    <div className="absolute top-[2px] left-[9px] right-[9px] z-50 flex items-center justify-between px-2 py-1">
                      <span className="text-white text-[9px] font-semibold">20:22</span>
                      <div />
                      <div className="flex items-center gap-1">
                        <svg width="14" height="10" viewBox="0 0 14 10" className="text-white">
                          <rect x="0" y="7" width="2" height="3" rx="0.5" fill="currentColor" />
                          <rect x="3" y="5" width="2" height="5" rx="0.5" fill="currentColor" />
                          <rect x="6" y="3" width="2" height="7" rx="0.5" fill="currentColor" />
                          <rect x="9" y="0" width="2" height="10" rx="0.5" fill="currentColor" />
                        </svg>
                        <svg width="12" height="10" viewBox="0 0 12 10" className="text-white">
                          <path d="M6 8.5a1 1 0 110 2 1 1 0 010-2z" fill="currentColor" />
                          <path d="M3.5 7a3.5 3.5 0 015 0" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                          <path d="M1.5 5a6 6 0 019 0" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                        </svg>
                        <div className="flex items-center">
                          <div className="w-[18px] h-[9px] border border-white/80 rounded-[2px] flex items-center p-[1px]">
                            <div className="w-[70%] h-full bg-white rounded-[1px]" />
                          </div>
                          <div className="w-[1.5px] h-[4px] bg-white/80 rounded-r-full ml-[0.5px]" />
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Island */}
                    <div className="absolute top-[9px] left-1/2 -translate-x-1/2 w-[90px] h-[28px] bg-black rounded-full z-50" />

                    {/* App content — scrollable area */}
                    <div className="pt-[46px] px-3 pb-14 h-full overflow-hidden">
                      {/* Top bar: user + wallet */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="flex items-center justify-between mb-3"
                      >
                        <div className="flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center text-[8px] font-bold text-white/60">G</div>
                          <div>
                            <p className="text-[9px] font-semibold text-white leading-none">goravesearchlab</p>
                            <p className="text-[7px] text-white/40 font-mono">MQu6b5...TQeK</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded-lg bg-neutral-800 flex items-center justify-center">
                            <span className="text-[8px] text-white/50">💬</span>
                          </div>
                          <div className="flex items-center gap-1 bg-neutral-800 rounded-full px-2 py-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span className="text-[9px] font-semibold text-white">4,847</span>
                          </div>
                        </div>
                      </motion.div>

                      {/* Trade card */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.7 }}
                        className="bg-neutral-900 rounded-2xl p-3 border border-white/[0.04]"
                      >
                        {/* Trade header + Buy/Sell toggle */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[11px] font-bold text-white">Trade</span>
                          <TradingBuySellToggle />
                        </div>

                        {/* You Pay */}
                        <div className="bg-neutral-800/60 rounded-xl p-2.5 mb-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[8px] text-white/40">You pay</span>
                            <span className="text-[8px] text-white/40">Balance: 4,847.20 USDT</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <TradingAmountTyping />
                            <div className="flex items-center gap-1 bg-neutral-700/50 rounded-full px-2 py-0.5">
                              <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center">
                                <span className="text-[6px] font-bold text-white">T</span>
                              </div>
                              <span className="text-[9px] font-medium text-white">USDT</span>
                            </div>
                          </div>
                        </div>

                        {/* Swap icon */}
                        <div className="flex justify-center -my-1 relative z-10">
                          <div className="w-6 h-6 rounded-lg bg-neutral-700 border border-neutral-600 flex items-center justify-center">
                            <span className="text-[10px] text-white/60">⇅</span>
                          </div>
                        </div>

                        {/* You Receive */}
                        <div className="bg-neutral-800/60 rounded-xl p-2.5 mt-1 mb-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[8px] text-white/40">You receive</span>
                            <span className="text-[8px] text-white/40">Rate: 1 USDC = 3.67 AED</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[14px] font-bold text-white/30">0 د.إ</span>
                            <div className="flex items-center gap-1 bg-neutral-700/50 rounded-full px-2 py-0.5">
                              <span className="text-[8px]">🇦🇪</span>
                              <span className="text-[9px] font-medium text-white">AED</span>
                            </div>
                          </div>
                        </div>

                        {/* Pay via */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[8px] text-white/40">Pay via</span>
                          <div className="flex items-center gap-1">
                            <div className="bg-white/10 rounded-full px-2.5 py-0.5 border border-white/10">
                              <span className="text-[8px] text-white font-medium">🏦 Bank</span>
                            </div>
                            <div className="bg-transparent rounded-full px-2.5 py-0.5">
                              <span className="text-[8px] text-white/40">💵 Cash</span>
                            </div>
                          </div>
                        </div>

                        {/* Priority */}
                        <div className="mb-3">
                          <span className="text-[8px] text-white/40 block mb-1.5">Matching priority</span>
                          <div className="flex gap-1">
                            <div className="flex-1 bg-emerald-500/20 border border-emerald-500/30 rounded-lg py-1.5 text-center">
                              <span className="text-[8px] font-semibold text-emerald-400">Fastest</span>
                            </div>
                            <div className="flex-1 bg-neutral-800 rounded-lg py-1.5 text-center">
                              <span className="text-[8px] text-white/50">Best rate</span>
                            </div>
                            <div className="flex-1 bg-neutral-800 rounded-lg py-1.5 text-center">
                              <span className="text-[8px] text-white/50">Cheapest</span>
                            </div>
                          </div>
                        </div>

                        {/* Continue button */}
                        <motion.div
                          initial={{ opacity: 0.4 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 2.5, duration: 0.5 }}
                          className="w-full py-2.5 rounded-xl bg-neutral-700 text-center"
                        >
                          <span className="text-[10px] font-semibold text-white/40">Continue</span>
                        </motion.div>

                        {/* Create offer link */}
                        <p className="text-center mt-2">
                          <span className="text-[7px] text-white/30">Have a large amount? </span>
                          <span className="text-[7px] text-white/60 font-semibold">Create an offer</span>
                        </p>
                      </motion.div>
                    </div>

                    {/* Bottom Navigation */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 0.6 }}
                      className="absolute bottom-3 left-3 right-3 flex items-center justify-around bg-neutral-900/90 backdrop-blur-sm rounded-2xl py-2 border border-white/[0.04]"
                    >
                      {[
                        { icon: "🏠", label: "Home", active: true },
                        { icon: "🕐", label: "Activity", active: false },
                        { icon: "💬", label: "Messages", active: false },
                        { icon: "👤", label: "Profile", active: false },
                      ].map((tab) => (
                        <div key={tab.label} className="flex flex-col items-center gap-0.5">
                          <span className="text-[10px]">{tab.icon}</span>
                          <span className={`text-[7px] font-medium ${tab.active ? "text-white" : "text-white/30"}`}>
                            {tab.label}
                          </span>
                        </div>
                      ))}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Toggle Button (demo) */}
      <button
        onClick={() => {
          if (stage === "list") setStage("stacked");
          else if (stage === "stacked") setStage("phone");
          else if (stage === "phone") setStage("addMoney");
          else if (stage === "addMoney") setStage("trading");
          else setStage("list");
        }}
        className="fixed bottom-6 left-6 z-50 bg-black/40 text-white text-[9px] px-4 py-2 rounded-full opacity-20 hover:opacity-100 transition-all uppercase tracking-[0.2em] font-bold backdrop-blur-xl border border-white/10"
      >
        {stage === "list"
          ? "Stack"
          : stage === "stacked"
            ? "Phone"
            : stage === "phone"
              ? "Add $"
              : stage === "addMoney"
                ? "Trade"
                : "Reset"}
      </button>
    </section>
  );
}
