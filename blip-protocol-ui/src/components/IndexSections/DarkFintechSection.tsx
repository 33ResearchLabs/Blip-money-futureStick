import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Globe, ChevronDown, Check } from "lucide-react";

import { FingerCursor } from "../AdvancedDashboard/MerchantDashbaordTradeLive";

/* ═══════════════════════════════════════════════════════════════
   TYPES & CONSTANTS
   ═══════════════════════════════════════════════════════════════ */

type Stage =
  | "list"
  | "stacked"
  | "phone"
  | "trading"
  | "instantBidding"
  | "verified"
  | "receipt"
  | "finale";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const stageCopy: Record<Stage, { headline: string; subline: string }> = {
  list: {
    headline: "Money is fragmented.",
    subline: "Crypto. Banks. Separate rails.",
  },
  stacked: {
    headline: "One settlement layer.",
    subline: "Match. Lock. Confirm. Release.",
  },
  phone: {
    headline: "Pay with crypto.",
    subline: "Recipient receives local currency.",
  },
  trading: { headline: "Place your order.", subline: "Matched in seconds." },
  instantBidding: { headline: "Live bidding.", subline: "Best rate wins." },
  verified: {
    headline: "Verified on-chain.",
    subline: "Immutable. Transparent.",
  },
  receipt: { headline: "Settlement complete.", subline: "Funds delivered." },
  finale: {
    headline: "Blip Money",
    subline: "Global crypto liquidity. Settled.",
  },
};

const currencies = [
  { id: 1, title: "All Assets", amount: 12847.5, symbol: "$", icon: Globe },
  { id: 2, title: "USDT", amount: 8420.0, symbol: "$", flag: "\u{1FA99}" },
  {
    id: 3,
    title: "AED",
    amount: 15632.4,
    symbol: "\u062F.\u0625",
    flag: "\u{1F1E6}\u{1F1EA}",
  },
  { id: 4, title: "BTC", amount: 0.0847, symbol: "\u20BF", flag: "\u26A1" },
];

const transactions = [
  {
    name: "P2P Trade \u00B7 Ahmed",
    time: "20:14",
    amount: "+5,000",
    currency: "AED",
  },
  { name: "Sold USDT", time: "18:01", amount: "-2,500", currency: "USDT" },
  { name: "Escrow Release", time: "09:01", amount: "+1,200", currency: "USDT" },
];

const CARD_HEIGHT = 130;
const LIST_GAP = 35;
const STACK_OFFSET = 6;

const orderTimelineSteps = [
  { label: "Order Created", time: "20:23:01" },
  { label: "Merchant Matched", time: "20:23:03" },
  { label: "Payment Pending", time: "20:23:05" },
  { label: "Payment Confirmed", time: "20:23:41" },
  { label: "Completed", time: "20:24:12" },
];

const STAGE_ORDER: Stage[] = [
  "list",
  "stacked",
  "phone",
  "trading",
  "instantBidding",
  "verified",
  "receipt",
  "finale",
];

/* ═══════════════════════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════════════════════ */

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
      const tick = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / (duration * 1000), 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [target, duration, delay, start]);
  return value;
}

function useDimensions() {
  const [dims, setDims] = useState(() => ({
    cardW:
      typeof window !== "undefined"
        ? Math.min(420, window.innerWidth - 48)
        : 420,
    phoneW:
      typeof window !== "undefined"
        ? Math.min(290, window.innerWidth - 60)
        : 290,
    phoneH:
      typeof window !== "undefined"
        ? Math.min(600, window.innerHeight * 0.7)
        : 600,
  }));
  useEffect(() => {
    const update = () =>
      setDims({
        cardW: Math.min(420, window.innerWidth - 48),
        phoneW: Math.min(290, window.innerWidth - 60),
        phoneH: Math.min(600, window.innerHeight * 0.7),
      });
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return dims;
}

/* ═══════════════════════════════════════════════════════════════
   SHARED UI
   ═══════════════════════════════════════════════════════════════ */

function StatusBarIcons() {
  return (
    <div className="flex items-center gap-1.5">
      <svg
        width="14"
        height="10"
        viewBox="0 0 14 10"
        className="text-black/60 dark:text-white"
      >
        <rect x="0" y="7" width="2" height="3" rx="0.5" fill="currentColor" />
        <rect x="3" y="5" width="2" height="5" rx="0.5" fill="currentColor" />
        <rect x="6" y="3" width="2" height="7" rx="0.5" fill="currentColor" />
        <rect x="9" y="0" width="2" height="10" rx="0.5" fill="currentColor" />
      </svg>
      <svg
        width="12"
        height="10"
        viewBox="0 0 12 10"
        className="text-black/60 dark:text-white"
      >
        <path d="M6 8.5a1 1 0 110 2 1 1 0 010-2z" fill="currentColor" />
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
      <div className="flex items-center">
        <div className="w-[18px] h-[9px] border border-black/40 dark:border-white/80 rounded-[2px] flex items-center p-[1px]">
          <div className="w-[70%] h-full bg-black/60 dark:bg-white rounded-[1px]" />
        </div>
        <div className="w-[1.5px] h-[4px] bg-black/40 dark:bg-white/80 rounded-r-full ml-[0.5px]" />
      </div>
    </div>
  );
}

function PhoneChrome({
  time = "20:22",
  inset = false,
}: {
  time?: string;
  inset?: boolean;
}) {
  return (
    <>
      <div
        className={`absolute ${inset ? "top-[14px] left-[3px] right-[3px]" : "top-[16px] left-[6px] right-[6px]"} z-50 flex items-center justify-between px-5 h-[20px]`}
      >
        <span className="text-black/80 dark:text-white text-[9px] font-semibold">
          {time}
        </span>
        <div className="w-[100px]" />
        <StatusBarIcons />
      </div>
      <div
        className={`absolute ${inset ? "top-[9px]" : "top-[12px]"} left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-black rounded-full z-[60]`}
      />
    </>
  );
}

function BottomNav({ activeTab = "Home" }: { activeTab?: string }) {
  return (
    <div className="bg-white/90 dark:bg-[#111]/90 backdrop-blur-xl rounded-2xl px-4 py-2.5 flex items-center justify-around border border-black/[0.06] dark:border-white/[0.06] shadow-lg dark:shadow-none">
      {[
        { icon: "\u{1F3E0}", label: "Home" },
        { icon: "\u{1F4CA}", label: "Markets" },
        { icon: "\u{1F4B0}", label: "Wallet" },
        { icon: "\u{1F464}", label: "Profile" },
      ].map((tab) => (
        <div key={tab.label} className="flex flex-col items-center gap-0.5">
          <span
            className={`text-[12px] ${tab.label === activeTab ? "" : "opacity-40"}`}
          >
            {tab.icon}
          </span>
          <span
            className={`text-[7px] font-medium ${
              tab.label === activeTab
                ? "text-[#ff6b35]"
                : "text-black/40 dark:text-white/30"
            }`}
          >
            {tab.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   UTILITY COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

function FloatingParticles({
  count = 20,
  isActive,
}: {
  count?: number;
  isActive: boolean;
}) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 8 + 6,
        delay: Math.random() * 4,
        opacity: Math.random() * 0.4 + 0.1,
      })),
    [count],
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0 }}
          animate={
            isActive
              ? {
                  opacity: [0, p.opacity, p.opacity, 0],
                  y: [0, -40, -80, -120],
                  x: [
                    0,
                    Math.sin(p.id) * 20,
                    Math.cos(p.id) * 15,
                    Math.sin(p.id) * 25,
                  ],
                }
              : { opacity: 0 }
          }
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background:
              p.id % 3 === 0
                ? "#ff6b35"
                : p.id % 3 === 1
                  ? "rgba(255,255,255,0.6)"
                  : "#ff6b35",
            filter: `blur(${p.size > 2.5 ? 1 : 0}px)`,
          }}
        />
      ))}
    </div>
  );
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
  const value = useCountUp(amount, 0.8, delay * 0.6, start);
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

/* ═══════════════════════════════════════════════════════════════
   INTERACTIVE COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

function TradingBuySellToggle() {
  const [isBuy, setIsBuy] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => setIsBuy((v) => !v), 3000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="flex items-center bg-gray-200 dark:bg-neutral-800 rounded-full p-0.5 relative">
      <motion.div
        className="absolute top-0.5 bottom-0.5 rounded-full"
        animate={{
          left: isBuy ? 2 : "50%",
          right: isBuy ? "50%" : 2,
          backgroundColor: isBuy ? "#10b981" : "#ef4444",
        }}
        transition={{ duration: 0.3, ease: EASE }}
      />
      <span
        className={`relative z-10 text-[9px] font-semibold px-3 py-0.5 ${
          isBuy ? "text-white" : "text-gray-500 dark:text-white/50"
        }`}
      >
        Buy
      </span>
      <span
        className={`relative z-10 text-[9px] font-semibold px-3 py-0.5 ${
          !isBuy ? "text-white" : "text-gray-500 dark:text-white/50"
        }`}
      >
        Sell
      </span>
    </div>
  );
}

function TradingAmountTyping() {
  const chars = ["5", "0", "0", "0"];
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
      }, 180);
      return () => clearInterval(interval);
    }, 800);
    return () => clearTimeout(timeout);
  }, []);
  return (
    <span className="text-[16px] font-bold text-gray-900 dark:text-white tabular-nums">
      {shown === 0 ? (
        <span className="text-gray-300 dark:text-white/20">0</span>
      ) : (
        chars.slice(0, shown).join("")
      )}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SCREEN COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

function OrderReceiptScreen() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    orderTimelineSteps.forEach((_, i) => {
      if (i === 0) return;
      timers.push(setTimeout(() => setActiveStep(i), 500 + i * 700));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="h-full flex flex-col"
    >
      <div className="pt-[46px] px-4 pb-3">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[9px] text-gray-400 dark:text-white/40 font-medium">
            &larr; Back
          </span>
          <span className="text-[11px] font-semibold text-gray-900 dark:text-white">
            Order Receipt
          </span>
          <div className="w-8" />
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.3,
            duration: 0.5,
            type: "spring",
            stiffness: 200,
          }}
          className="flex justify-center mb-3"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center">
            <Check
              size={20}
              className="text-emerald-500 dark:text-emerald-400"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center mb-4"
        >
          <p className="text-[20px] font-bold text-gray-900 dark:text-white">
            5,000.00 USDT
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <span className="text-[9px] text-gray-400 dark:text-white/40">
              &rarr;
            </span>
            <span className="text-[13px] font-semibold text-emerald-500 dark:text-emerald-400">
              18,350.00 AED
            </span>
          </div>
          <p className="text-[8px] text-gray-400 dark:text-white/30 mt-1">
            Rate: 1 USDT = 3.67 AED
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="bg-gray-50 dark:bg-neutral-900 rounded-xl p-3 border border-gray-200 dark:border-white/[0.04] mb-3"
        >
          {[
            { label: "Order ID", value: "#BLP-48291" },
            { label: "Type", value: "Buy AED" },
            { label: "Pay via", value: "Bank Transfer" },
            { label: "Merchant", value: "FastExchange.ae" },
            { label: "Fee", value: "0.00 USDT" },
          ].map((item, i) => (
            <div
              key={item.label}
              className={`flex items-center justify-between py-1.5 ${
                i < 4
                  ? "border-b border-gray-200/60 dark:border-white/[0.04]"
                  : ""
              }`}
            >
              <span className="text-[8px] text-gray-400 dark:text-white/40">
                {item.label}
              </span>
              <span className="text-[8px] font-medium text-gray-700 dark:text-white/80">
                {item.value}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="px-4 flex-1"
      >
        <p className="text-[8px] text-gray-400 dark:text-white/40 uppercase tracking-wider mb-2.5">
          Status Timeline
        </p>
        <div className="relative">
          {orderTimelineSteps.map((step, i) => {
            const isActive = i <= activeStep;
            const isLast = i === orderTimelineSteps.length - 1;
            const isCurrent = i === activeStep;
            return (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + i * 0.15, duration: 0.4 }}
                className="flex items-start gap-2.5 relative"
              >
                <div className="flex flex-col items-center">
                  <motion.div
                    animate={{
                      backgroundColor: isActive ? "#10b981" : "#ADADAD",
                      scale: isCurrent ? 1.2 : 1,
                    }}
                    transition={{ duration: 0.4 }}
                    className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 border border-gray-200 dark:border-white/[0.06]"
                  >
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, type: "spring" }}
                      >
                        <Check size={8} className="text-white" />
                      </motion.div>
                    )}
                  </motion.div>
                  {!isLast && (
                    <div
                      className={`w-[1.5px] h-5 transition-colors duration-400 ${
                        i < activeStep
                          ? "bg-emerald-500"
                          : "bg-gray-300 dark:bg-white/[0.06]"
                      }`}
                    />
                  )}
                </div>
                <div className="pb-2">
                  <p
                    className={`text-[9px] font-medium leading-none ${
                      isActive
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-300 dark:text-white/30"
                    }`}
                  >
                    {step.label}
                  </p>
                  <p
                    className={`text-[7px] mt-0.5 font-mono ${
                      isActive
                        ? "text-gray-400 dark:text-white/40"
                        : "text-gray-200 dark:text-white/15"
                    }`}
                  >
                    {step.time}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="px-4 pb-14 pt-2"
      >
        <div className="w-full py-2.5 rounded-xl bg-emerald-500 text-center">
          <span className="text-[10px] font-semibold text-white">Done</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

function InstantBiddingUnwrap() {
  const bids = [
    {
      name: "QuickSwap Pro",
      rate: "3.672",
      profit: "+$185",
      trades: "2,847",
      time: "~30s",
      best: true,
      avatar: "QS",
    },
    {
      name: "FastSettle UAE",
      rate: "3.668",
      profit: "+$165",
      trades: "1,923",
      time: "~45s",
      best: false,
      avatar: "FS",
    },
    {
      name: "DubaiExchange",
      rate: "3.665",
      profit: "+$150",
      trades: "3,102",
      time: "~60s",
      best: false,
      avatar: "DE",
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-center mb-8"
      >
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black dark:text-white tracking-tight font-display">
          {stageCopy.instantBidding.headline}
        </h3>
        <p className="text-sm text-black/40 dark:text-white/40 mt-2 tracking-wide">
          {stageCopy.instantBidding.subline}
        </p>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
          className="h-[1px] mt-4 mx-auto w-20 bg-gradient-to-r from-transparent via-[#ff6b35]/60 to-transparent"
        />
      </motion.div>

      <div className="space-y-3" style={{ perspective: 1200 }}>
        {bids.map((bid, i) => (
          <motion.div
            key={bid.name}
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            transition={{ delay: 0.4 + i * 0.25, duration: 0.8, ease: EASE }}
            style={{ transformOrigin: "top center" }}
            className={`p-4 rounded-xl border backdrop-blur-xl ${
              bid.best
                ? "bg-white/90 dark:bg-white/[0.08] border-[#ff6b35]/30 shadow-[0_4px_24px_-6px_rgba(255,107,53,0.15)] dark:shadow-[0_4px_24px_-6px_rgba(255,107,53,0.1)]"
                : "bg-white/70 dark:bg-white/[0.03] border-black/[0.06] dark:border-white/[0.06]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold ${
                    bid.best
                      ? "bg-[#ff6b35]/10 dark:bg-[#ff6b35]/20 text-[#ff6b35]"
                      : "bg-black/[0.05] dark:bg-white/[0.05] text-black/60 dark:text-white/50"
                  }`}
                >
                  {bid.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-black dark:text-white">
                      {bid.name}
                    </span>
                    {bid.best && (
                      <span className="px-2 py-0.5 rounded-full bg-[#ff6b35]/10 dark:bg-[#ff6b35]/20 text-[9px] text-[#ff6b35] font-bold uppercase">
                        Best Rate
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-black/50 dark:text-white/40">
                    {bid.trades} trades &middot; ETA {bid.time}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-black dark:text-white">
                  {bid.rate}{" "}
                  <span className="text-xs text-black/40 dark:text-white/40">
                    AED
                  </span>
                </div>
                <div className="text-xs text-black/50 dark:text-white/50">
                  {bid.profit}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        <motion.div
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8, ease: EASE }}
          style={{ transformOrigin: "top center" }}
          className="p-3 rounded-xl bg-[#ff6b35]/5 dark:bg-[#ff6b35]/10 border border-[#ff6b35]/20 text-center"
        >
          <div className="flex items-center justify-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-[#ff6b35]"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-sm text-[#ff6b35] font-medium">
              Auto-selecting best offer in 8s...
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function VerifiedUnwrap() {
  const [confirmations, setConfirmations] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setConfirmations(1), 800),
      setTimeout(() => setConfirmations(2), 1400),
      setTimeout(() => setConfirmations(3), 2000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-center mb-8"
      >
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black dark:text-white tracking-tight font-display">
          {stageCopy.verified.headline}
        </h3>
        <p className="text-sm text-black/40 dark:text-white/40 mt-2 tracking-wide">
          {stageCopy.verified.subline}
        </p>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
          className="h-[1px] mt-4 mx-auto w-20 bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent"
        />
      </motion.div>

      <div style={{ perspective: 1200 }}>
        <motion.div
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 1, ease: EASE }}
          style={{ transformOrigin: "top center" }}
          className="rounded-2xl bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.06] overflow-hidden"
        >
          <div className="p-4 border-b border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 rounded-full bg-emerald-500"
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-xs font-semibold text-black dark:text-white">
                Verified on Solana
              </span>
            </div>
            <span className="text-[10px] text-black/40 dark:text-white/40 font-mono">
              Block #248,192,847
            </span>
          </div>

          <div className="p-4 space-y-1">
            {[
              { label: "Transaction Hash", value: "5Kd8nR...v9Qm" },
              { label: "From", value: "MQu6b5...TQeK" },
              { label: "To", value: "7xKp2R...nW4J" },
              { label: "Amount", value: "5,000.00 USDT" },
              { label: "Fee", value: "0.00025 SOL" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.12, duration: 0.4 }}
                className="flex items-center justify-between py-2 border-b border-black/[0.04] dark:border-white/[0.04] last:border-0"
              >
                <span className="text-xs text-black/50 dark:text-white/40">
                  {item.label}
                </span>
                <span className="text-xs font-medium font-mono text-black/80 dark:text-white/80">
                  {item.value}
                </span>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4, duration: 0.4 }}
              className="flex items-center justify-between py-2"
            >
              <span className="text-xs text-black/50 dark:text-white/40">
                Status
              </span>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[1, 2, 3].map((n) => (
                    <motion.div
                      key={n}
                      initial={{ scale: 0 }}
                      animate={{
                        scale: confirmations >= n ? 1 : 0.5,
                        backgroundColor:
                          confirmations >= n ? "#10b981" : "#d1d5db",
                      }}
                      transition={{
                        delay: 0.6 + n * 0.6,
                        duration: 0.3,
                        type: "spring",
                      }}
                      className="w-2 h-2 rounded-full"
                    />
                  ))}
                </div>
                <span
                  className={`text-xs font-medium font-mono ${
                    confirmations >= 3 ? "text-emerald-500" : "text-amber-500"
                  }`}
                >
                  {confirmations}/3 Confirmed
                </span>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{
              rotateX: confirmations >= 3 ? 0 : -90,
              opacity: confirmations >= 3 ? 1 : 0,
            }}
            transition={{ delay: 2.2, duration: 0.8, ease: EASE }}
            style={{ transformOrigin: "top center" }}
            className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border-t border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center gap-2"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: confirmations >= 3 ? 1 : 0 }}
              transition={{
                delay: 2.5,
                duration: 0.4,
                type: "spring",
                stiffness: 200,
              }}
            >
              <Check size={16} className="text-emerald-500" />
            </motion.div>
            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              Transaction Verified
            </span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MICRO-PROOF OVERLAYS
   ═══════════════════════════════════════════════════════════════ */

/** Glass chip that auto-appears after `delayMs` and fades out after `durationMs`. */
function TimedChip({
  show,
  delayMs,
  durationMs = 1800,
  label,
  subline,
}: {
  show: boolean;
  delayMs: number;
  durationMs?: number;
  label: string;
  subline?: string;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!show) {
      setVisible(false);
      return;
    }
    const enter = setTimeout(() => setVisible(true), delayMs);
    const exit = setTimeout(() => setVisible(false), delayMs + durationMs);
    return () => {
      clearTimeout(enter);
      clearTimeout(exit);
    };
  }, [show, delayMs, durationMs]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 6, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -4, filter: "blur(4px)" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex flex-col items-center gap-0.5 pointer-events-none"
        >
          <span className="text-[9px] font-semibold tracking-[0.08em] uppercase text-black/70 dark:text-white/70 bg-white/50 dark:bg-white/[0.06] backdrop-blur-xl rounded-full px-3 py-1 border border-black/[0.04] dark:border-white/[0.06]">
            {label}
          </span>
          {subline && (
            <span className="text-[8px] text-black/40 dark:text-white/35 tracking-wide">
              {subline}
            </span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Rate tightening chip for instantBidding stage. */
function RateChip({
  show,
  delayMs = 800,
}: {
  show: boolean;
  delayMs?: number;
}) {
  const [visible, setVisible] = useState(false);
  const [rateIdx, setRateIdx] = useState(0);
  const rates = ["3.664", "3.667", "3.670", "3.672"];

  useEffect(() => {
    if (!show) {
      setVisible(false);
      setRateIdx(0);
      return;
    }
    const enter = setTimeout(() => setVisible(true), delayMs);
    const exit = setTimeout(() => setVisible(false), delayMs + 2200);
    return () => {
      clearTimeout(enter);
      clearTimeout(exit);
    };
  }, [show, delayMs]);

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setRateIdx((i) => (i < rates.length - 1 ? i + 1 : i));
    }, 450);
    return () => clearInterval(interval);
  }, [visible, rates.length]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 6, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -4, filter: "blur(4px)" }}
          transition={{ duration: 0.5, ease: EASE }}
          className="flex items-center gap-1.5 bg-white/50 dark:bg-white/[0.06] backdrop-blur-xl rounded-full px-3 py-1 border border-black/[0.04] dark:border-white/[0.06] pointer-events-none"
        >
          <span className="text-[9px] font-semibold tracking-wide text-black/70 dark:text-white/70 tabular-nums">
            {rates[rateIdx]}{" "}
            <span className="text-[7px] text-black/40 dark:text-white/35">
              AED/USDT
            </span>
          </span>
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.9, repeat: Infinity }}
            className="text-[8px] text-emerald-500"
          >
            ▲
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Three animated check-lines during the "stacked" (protocol lock) moment. */
function ProtocolLockShot({ show }: { show: boolean }) {
  const lines = ["Escrow locked", "Merchant matched", "Local payout ready"];
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="protocol-lock"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.5, ease: EASE }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[35] flex flex-col items-center gap-2 pointer-events-none"
        >
          {lines.map((line, i) => (
            <motion.div
              key={line}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.2 + i * 0.25, ease: EASE }}
              className="flex items-center gap-2"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  duration: 0.2,
                  delay: 0.2 + i * 0.25 + 0.15,
                  ease: EASE,
                }}
              >
                <Check size={10} className="text-emerald-400" strokeWidth={3} />
              </motion.div>
              <span className="text-[10px] font-medium tracking-[0.06em] text-black/60 dark:text-white/55">
                {line}
              </span>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function PremiumFintechSection() {
  const [stage, setStage] = useState<Stage>("list");
  const [animKey, setAnimKey] = useState(0);
  const [animDone, setAnimDone] = useState(false);
  const [showProtocolLock, setShowProtocolLock] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });
  const { cardW, phoneW, phoneH } = useDimensions();

  useEffect(() => {
    if (!isInView) return;
    setAnimDone(false);
    const timers = [
      setTimeout(() => setStage("stacked"), 2000),
      setTimeout(() => setStage("phone"), 4200),
      setTimeout(() => setStage("trading"), 7000),
      setTimeout(() => setStage("instantBidding"), 11000),
      setTimeout(() => setStage("verified"), 15500),
      setTimeout(() => setStage("receipt"), 20000),
      setTimeout(() => setStage("finale"), 25000),
      setTimeout(() => setAnimDone(true), 29000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [isInView, animKey]);

  /* Protocol lock shot — brief overlay during "stacked" stage */
  useEffect(() => {
    if (stage !== "stacked") {
      setShowProtocolLock(false);
      return;
    }
    const show = setTimeout(() => setShowProtocolLock(true), 800);
    const hide = setTimeout(() => setShowProtocolLock(false), 2000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [stage]);

  const handleReplay = useCallback(() => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setAnimDone(false);
    setShowProtocolLock(false);
    setStage("list");
    setTimeout(() => setAnimKey((k) => k + 1), 800);
  }, []);

  /* ─── Derived state ─── */
  const isFinale = stage === "finale";
  const isInstantBidding = stage === "instantBidding";
  const isVerified = stage === "verified";
  const isUnwrapStage = isInstantBidding || isVerified;
  const isTrading = stage === "trading";
  const isReceipt = stage === "receipt";
  const isTradingOrReceipt = isTrading || isReceipt;
  const isPhone = stage === "phone" || isTradingOrReceipt;
  const isStacked = stage !== "list" && !isFinale;
  const isFocusMoment = isTradingOrReceipt || isUnwrapStage;
  const isCalm = isReceipt || isFinale;

  const getCardY = useCallback(
    (idx: number) =>
      stage === "list" ? idx * (CARD_HEIGHT + LIST_GAP) : idx * STACK_OFFSET,
    [stage],
  );

  const totalListHeight =
    currencies.length * CARD_HEIGHT + (currencies.length - 1) * LIST_GAP;
  const totalStackHeight = CARD_HEIGHT + (currencies.length - 1) * STACK_OFFSET;

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#FAF8F5] dark:bg-black overflow-hidden"
      style={{ height: "100vh" }}
    >
      {/* ── Background Layer ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        animate={{ filter: isFocusMoment ? "blur(2px)" : "blur(0px)" }}
        transition={{ duration: 2 }}
      >
        <motion.div
          animate={{
            scale: isFinale ? 0.8 : isStacked ? 1.6 : 1,
            opacity: isFinale ? 0.08 : isStacked ? 0.5 : 0.25,
            x: isPhone ? 60 : 0,
            y: isPhone ? 40 : 0,
          }}
          transition={{ duration: 3, ease: "easeInOut" }}
          className="absolute top-[-15%] left-[-15%] w-[65%] h-[65%] dark:bg-[#ff6b35]/12 rounded-full blur-[160px]"
        />
        <motion.div
          animate={{
            scale: isFinale ? 0.7 : isStacked ? 1.4 : 1,
            opacity: isFinale ? 0.05 : isStacked ? 0.3 : 0.12,
            x: isPhone ? -40 : 0,
            y: isPhone ? -30 : 0,
          }}
          transition={{ duration: 3, delay: 0.3, ease: "easeInOut" }}
          className="absolute bottom-[-15%] right-[-15%] w-[55%] h-[55%] bg-violet-500/10 dark:bg-violet-500/8 rounded-full blur-[160px]"
        />
        <motion.div
          animate={{
            opacity: isFinale ? 0 : isPhone ? 0.2 : 0,
            scale: isPhone ? 1.2 : 0.8,
          }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-[#ff6b35]/15 dark:bg-[#ff6b35]/8 rounded-full blur-[180px]"
        />
        <motion.div
          animate={{ opacity: isFinale ? 0.01 : 0.03 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 dark:opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </motion.div>

      {/* ── Noise Texture ── */}
      <motion.div
        animate={{ opacity: isFinale ? 0.01 : 0.025 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 pointer-events-none z-[2] dark:opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* ── Cinematic Vignette ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-[3]"
        animate={{ opacity: isFocusMoment ? 1 : isCalm ? 0.2 : 0.4 }}
        transition={{ duration: 2 }}
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.1) 100%)",
        }}
      />

      {/* ── Protocol Lock Vignette (tighter focus during lock shot) ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-[4]"
        animate={{ opacity: showProtocolLock ? 1 : 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.18) 100%)",
        }}
      />

      {/* ── Subtle Background Darken ── */}
      <motion.div
        className="absolute inset-0 bg-black pointer-events-none z-[2]"
        animate={{ opacity: isPhone && !isFinale ? 0.03 : 0 }}
        transition={{ duration: 2 }}
      />

      {/* ── Floating Particles ── */}
      <motion.div
        animate={{ opacity: isFinale ? 0 : isCalm ? 0.3 : 1 }}
        transition={{ duration: 2.5 }}
      >
        <FloatingParticles count={24} isActive={isInView} />
      </motion.div>

      {/* ── Bottom Fade Gradient ── */}
      <AnimatePresence>
        {(stage === "list" || stage === "stacked") && (
          <motion.div
            key="bottom-fade"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute bottom-0 left-0 right-0 h-[40%] z-30 pointer-events-none bg-gradient-to-t from-[#FAF8F5] via-[#FAF8F5]/80 dark:from-black dark:via-black/80 to-transparent"
          />
        )}
      </AnimatePresence>

      {/* ── Camera Drift Wrapper ── */}
      <motion.div
        className="absolute inset-0"
        animate={{ x: [0, 5, -3, 4, 0], y: [0, -3, 2, -2, 0] }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
      >
        <div
          className={`h-full flex justify-center px-4 sm:px-6 md:px-20 overflow-hidden ${
            isPhone || isUnwrapStage
              ? "items-center py-10 sm:py-20"
              : "items-start pt-16 sm:pt-28 mt-8 sm:mt-16 md:pt-32"
          }`}
        >
          <div className="relative w-full max-w-6xl flex items-center justify-center">
            {/* ── Left Text — phone stage, desktop ── */}
            <AnimatePresence>
              {isPhone && !isTradingOrReceipt && !isFinale && (
                <motion.div
                  key="left-text"
                  initial={{ opacity: 0, x: -60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 1.2, ease: EASE }}
                  className="hidden md:block absolute left-0 max-w-sm z-10"
                >
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
                    className="w-16 h-[1px] bg-gradient-to-r from-[#ff6b35]/60 to-transparent mb-10 origin-left"
                  />
                  <motion.h3
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.1, ease: EASE }}
                    className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight font-display bg-gradient-to-br from-black via-black/80 to-black/50 dark:from-white dark:via-white/80 dark:to-white/40 bg-clip-text text-transparent"
                  >
                    {stageCopy.phone.headline}
                  </motion.h3>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
                    className="h-[1px] mt-4 w-32 bg-gradient-to-r from-[#ff6b35]/50 to-transparent origin-left"
                  />
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
                    className="text-black/40 dark:text-white/40 text-base md:text-lg mt-5 max-w-xs"
                  >
                    {stageCopy.phone.subline}
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Instant Bidding Unwrap ── */}
            <AnimatePresence>
              {isInstantBidding && (
                <motion.div
                  key="instant-bidding-unwrap"
                  initial={{ opacity: 0, scale: 0.92, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.9, filter: "blur(12px)" }}
                  transition={{ duration: 1.4, ease: EASE }}
                  className="absolute inset-0 flex flex-col items-center justify-center pb-[100px] sm:pb-[120px] md:pb-[150px] z-10"
                >
                  <InstantBiddingUnwrap />
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Verified Unwrap ── */}
            <AnimatePresence>
              {isVerified && (
                <motion.div
                  key="verified-unwrap"
                  initial={{ opacity: 0, scale: 0.92, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.9, filter: "blur(12px)" }}
                  transition={{ duration: 1.4, ease: EASE }}
                  className="absolute inset-0 flex flex-col items-center justify-center pb-[100px] sm:pb-[120px] md:pb-[100px] z-10"
                >
                  <VerifiedUnwrap />
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Finale Lockup ── */}
            <AnimatePresence>
              {isFinale && (
                <motion.div
                  key="finale-lockup"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 2.5, ease: EASE }}
                  className="absolute inset-0 flex flex-col items-center justify-center z-20"
                >
                  <motion.h2
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 2, delay: 0.3, ease: EASE }}
                    className="bg-gradient-to-br from-black via-black/80 to-black/50 dark:from-white dark:via-white/80 dark:to-white/40 bg-clip-text text-transparent"
                    style={{
                      fontSize: "clamp(2.8rem, 5.5vw, 5rem)",
                      fontWeight: 700,
                      letterSpacing: "-0.04em",
                      lineHeight: 1.08,
                    }}
                  >
                    {stageCopy.finale.headline}
                  </motion.h2>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 1.2, ease: EASE }}
                    className="h-[1px] mt-5 w-24 bg-gradient-to-r from-transparent via-[#ff6b35]/40 to-transparent"
                  />
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2, delay: 1.5, ease: EASE }}
                    className="text-base sm:text-lg text-black/35 dark:text-white/35 mt-5 tracking-wide"
                  >
                    {stageCopy.finale.subline}
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Center Content ── */}
            <motion.div
              animate={{
                opacity: isUnwrapStage || isFinale ? 0 : 1,
                scale: isUnwrapStage || isFinale ? 0.9 : 1,
                pointerEvents: (isUnwrapStage || isFinale ? "none" : "auto") as
                  | "none"
                  | "auto",
              }}
              transition={{ duration: 1.4, ease: EASE }}
              className="flex flex-col items-center"
            >
              {/* ── Heading — per stage ── */}
              <motion.div
                animate={{
                  height: isPhone && !isTradingOrReceipt ? 0 : "auto",
                  opacity: isPhone && !isTradingOrReceipt ? 0 : 1,
                  marginBottom:
                    isPhone && !isTradingOrReceipt
                      ? 0
                      : isTradingOrReceipt
                        ? 20
                        : 48,
                }}
                transition={{ duration: 1, ease: EASE }}
                className="overflow-hidden"
              >
                <AnimatePresence mode="wait">
                  {stage === "list" && (
                    <motion.div
                      key="list-title"
                      initial={{ opacity: 0, x: -80, filter: "blur(8px)" }}
                      animate={
                        isInView
                          ? { opacity: 1, x: 0, filter: "blur(0px)" }
                          : {}
                      }
                      exit={{ opacity: 0, x: 60, filter: "blur(6px)" }}
                      transition={{ duration: 1, ease: EASE }}
                      className="text-center"
                    >
                      <h2
                        className="bg-gradient-to-br from-black via-black/80 to-black/50 dark:from-white dark:via-white/80 dark:to-white/40 bg-clip-text text-transparent inline-block"
                        style={{
                          fontSize: "clamp(2.8rem, 5.5vw, 5rem)",
                          fontWeight: 700,
                          letterSpacing: "-0.04em",
                          lineHeight: 1.08,
                        }}
                      >
                        {stageCopy.list.headline}
                      </h2>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="text-sm sm:text-base text-black/35 dark:text-white/35 mt-3 tracking-wide"
                      >
                        {stageCopy.list.subline}
                      </motion.p>
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
                        className="h-[1px] mt-4 mx-auto bg-gradient-to-r from-transparent via-[#ff6b35]/50 to-transparent origin-left"
                      />
                    </motion.div>
                  )}

                  {stage === "stacked" && (
                    <motion.div
                      key="stacked-title"
                      initial={{ opacity: 0, x: 80, filter: "blur(8px)" }}
                      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, x: -60, filter: "blur(6px)" }}
                      transition={{ duration: 1, ease: EASE }}
                      className="text-center"
                    >
                      <h2
                        className="bg-gradient-to-br from-black via-black/80 to-[#ff6b35]/70 dark:from-white dark:via-white/80 dark:to-[#ff6b35]/70 bg-clip-text text-transparent inline-block"
                        style={{
                          fontSize: "clamp(2.8rem, 5.5vw, 5rem)",
                          fontWeight: 700,
                          letterSpacing: "-0.04em",
                          lineHeight: 1.08,
                        }}
                      >
                        {stageCopy.stacked.headline}
                      </h2>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="text-sm sm:text-base text-black/35 dark:text-white/35 mt-3 tracking-wide"
                      >
                        {stageCopy.stacked.subline}
                      </motion.p>
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
                        className="h-[1px] mt-4 mx-auto bg-gradient-to-r from-transparent via-[#ff6b35]/50 to-transparent origin-right"
                      />
                    </motion.div>
                  )}

                  {isTradingOrReceipt && (
                    <motion.div
                      key="user-title"
                      initial={{ opacity: 0, y: -15, filter: "blur(6px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                      transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
                      className="text-center"
                    >
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-black dark:text-white tracking-tight font-display inline-block">
                        {stage === "trading"
                          ? stageCopy.trading.headline
                          : stageCopy.receipt.headline}
                      </h3>
                      <p className="text-xs text-black/35 dark:text-white/35 mt-1.5 tracking-wide">
                        {stage === "trading"
                          ? stageCopy.trading.subline
                          : stageCopy.receipt.subline}
                      </p>
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.5, delay: 0.5, ease: EASE }}
                        className="h-[1px] mt-3 mx-auto w-16 bg-gradient-to-r from-transparent via-[#ff6b35]/40 to-transparent origin-left"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* ── Cards + Phone Wrapper ── */}
              <motion.div
                animate={{
                  width: isPhone ? phoneW : cardW,
                  height: isPhone
                    ? phoneH
                    : isStacked
                      ? totalStackHeight
                      : totalListHeight,
                }}
                transition={{
                  width: { duration: 1.4, ease: EASE },
                  height: { duration: isPhone ? 0.8 : 1.4, ease: EASE },
                }}
                className="relative"
              >
                {/* Glowing halo behind phone */}
                <motion.div
                  initial={false}
                  animate={{
                    opacity: isPhone ? 1 : 0,
                    scale: isPhone ? 1 : 0.8,
                  }}
                  transition={{ duration: 1.8, ease: "easeOut" }}
                  className="absolute inset-[-40px] z-[-1] pointer-events-none"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-[#ff6b35]/20 via-[#ff6b35]/5 to-transparent dark:from-[#ff6b35]/15 dark:via-[#ff6b35]/5 dark:to-transparent rounded-[4rem] blur-[40px]" />
                  <motion.div
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-[10px] bg-gradient-to-br from-[#ff6b35]/10 via-transparent to-violet-500/10 dark:from-[#ff6b35]/8 dark:to-violet-500/8 rounded-[3.5rem] blur-[30px]"
                  />
                </motion.div>

                {/* Phone Frame */}
                <motion.div
                  initial={false}
                  animate={{
                    opacity: isPhone ? 1 : 0,
                    scale: isPhone ? 1 : 0.95,
                    rotateZ: isPhone && !isTradingOrReceipt ? 1 : 0,
                  }}
                  transition={{ duration: 1.2, ease: EASE }}
                  className="absolute inset-[-4px] z-0 pointer-events-none"
                  style={{ transformOrigin: "center center" }}
                >
                  {/* Titanium bezel */}
                  <div className="w-full h-full bg-gradient-to-b from-[#d8d5d0] via-[#c8c5c0] to-[#bab7b2] dark:from-[#48484a] dark:via-[#3a3a3c] dark:to-[#2c2c2e] rounded-[3rem] shadow-[0_30px_80px_-10px_rgba(0,0,0,0.25),0_10px_20px_-5px_rgba(0,0,0,0.1),0_0_60px_-10px_rgba(255,107,53,0.1)] dark:shadow-[0_30px_80px_-10px_rgba(0,0,0,0.6),0_10px_20px_-5px_rgba(0,0,0,0.3),0_0_60px_-10px_rgba(255,107,53,0.15)]" />
                  <div className="absolute inset-0 rounded-[3rem] border border-white/40 dark:border-white/10" />
                  <div className="absolute inset-[1.5px] rounded-[2.85rem] border border-black/10 dark:border-black/30" />
                  <div className="absolute inset-[3px] bg-[#f5f2ee] dark:bg-[#0a0a0a] rounded-[2.7rem] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b35]/[0.06] via-transparent to-[#ff6b35]/[0.03] dark:from-[#ff6b35]/[0.04] dark:to-transparent" />
                  </div>
                  <PhoneChrome />
                  {/* Side buttons */}
                  <div className="absolute top-[130px] -right-[3px] w-[3px] h-[50px] bg-gradient-to-b from-[#b8b5b0] to-[#a8a5a0] dark:from-[#4a4a4c] dark:to-[#3a3a3c] rounded-r-full shadow-sm" />
                  <div className="absolute top-[80px] -left-[3px] w-[3px] h-[18px] bg-gradient-to-b from-[#b8b5b0] to-[#a8a5a0] dark:from-[#4a4a4c] dark:to-[#3a3a3c] rounded-l-full shadow-sm" />
                  <div className="absolute top-[115px] -left-[3px] w-[3px] h-[35px] bg-gradient-to-b from-[#b8b5b0] to-[#a8a5a0] dark:from-[#4a4a4c] dark:to-[#3a3a3c] rounded-l-full shadow-sm" />
                  <div className="absolute top-[158px] -left-[3px] w-[3px] h-[35px] bg-gradient-to-b from-[#b8b5b0] to-[#a8a5a0] dark:from-[#4a4a4c] dark:to-[#3a3a3c] rounded-l-full shadow-sm" />

                  {/* ── Light Sweep on Glass ── */}
                  <div className="absolute inset-[3px] rounded-[2.7rem] overflow-hidden pointer-events-none z-[5]">
                    <motion.div
                      animate={{ x: ["-100%", "300%"] }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        repeatDelay: 5,
                        ease: EASE,
                      }}
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.03) 42%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 58%, transparent 70%)",
                      }}
                    />
                  </div>
                </motion.div>

                {/* ── Card Stack ── */}
                <motion.div
                  animate={{
                    scale: isPhone ? 0.6 : 1,
                    y: isPhone ? 50 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 80, damping: 22 }}
                  className="relative z-10"
                  style={{
                    width: cardW,
                    left: "50%",
                    marginLeft: -(cardW / 2),
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
                          ease: EASE,
                        }}
                        className="absolute top-0 left-0 w-full"
                        style={{ zIndex: currencies.length - idx }}
                      >
                        <div
                          className={`
                            relative overflow-hidden
                            bg-white/80 dark:bg-white/[0.06] backdrop-blur-2xl rounded-[2rem] p-6 md:p-8
                            border border-white/60 dark:border-white/[0.08]
                            transition-all duration-700
                            ${
                              isStacked && idx === 0
                                ? "shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,107,53,0.05)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,107,53,0.1)]"
                                : "shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] dark:shadow-none"
                            }
                          `}
                        >
                          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent" />
                          {idx === 0 && (
                            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-[#ff6b35]/[0.04] dark:from-[#ff6b35]/[0.06] to-transparent rounded-[2rem] pointer-events-none" />
                          )}
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center">
                              {curr.flag ? (
                                <span className="text-lg">{curr.flag}</span>
                              ) : (
                                <Globe
                                  size={16}
                                  className="text-black/40 dark:text-white/70"
                                />
                              )}
                            </div>
                            <span className="text-black/80 dark:text-white/90 font-medium text-sm flex items-center gap-1">
                              {curr.title}
                              {curr.id === 1 && (
                                <ChevronDown size={14} className="opacity-40" />
                              )}
                            </span>
                          </div>
                          <div className="text-black dark:text-white text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
                            <AnimatedAmount
                              symbol={curr.symbol}
                              amount={curr.amount}
                              delay={0.3 + idx * 0.25}
                              start={isInView}
                            />
                          </div>
                          {idx === 0 && isPhone && !isTradingOrReceipt && (
                            <div className="flex items-center gap-2 mt-4">
                              <button className="bg-[#ff6b35] text-white font-semibold py-2 px-5 rounded-full flex items-center gap-1.5 text-xs shadow-md">
                                + Buy Crypto
                              </button>
                              <button className="bg-black/5 dark:bg-white/20 text-black/70 dark:text-white font-medium py-2 px-5 rounded-full flex items-center gap-1.5 text-xs border border-black/[0.06] dark:border-white/10">
                                &rarr; Trade P2P
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* ── Phone Inner Content — Transactions + Nav ── */}
                <AnimatePresence>
                  {isPhone && !isTradingOrReceipt && (
                    <>
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.8, ease: EASE }}
                        className="absolute left-3 right-3 z-10"
                        style={{ top: 220 }}
                      >
                        <div className="bg-white dark:bg-white/[0.08] rounded-2xl p-3 shadow-lg dark:shadow-none dark:border dark:border-white/[0.06]">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-semibold text-gray-900 dark:text-white">
                              Transactions
                            </span>
                            <span className="text-[10px] font-semibold text-[#ff6b35]">
                              See all &gt;
                            </span>
                          </div>
                          <p className="text-[9px] text-gray-400 dark:text-gray-500 mb-1.5">
                            Today
                          </p>
                          {transactions.map((tx, i) => (
                            <div
                              key={i}
                              className={`flex items-center justify-between py-2 ${
                                i < transactions.length - 1
                                  ? "border-b border-gray-100 dark:border-white/[0.06]"
                                  : ""
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                                  <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-white/20" />
                                </div>
                                <div>
                                  <p className="text-[10px] font-medium text-gray-900 dark:text-white leading-tight">
                                    {tx.name}
                                  </p>
                                  <p className="text-[8px] text-gray-400 dark:text-gray-500">
                                    {tx.time}
                                  </p>
                                </div>
                              </div>
                              <span className="text-[10px] font-semibold text-gray-900 dark:text-white">
                                {tx.amount}{" "}
                                <span className="text-gray-400 dark:text-gray-500 font-normal text-[9px]">
                                  {tx.currency}
                                </span>
                              </span>
                            </div>
                          ))}
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.8, ease: EASE }}
                        className="absolute bottom-3 left-3 right-3 z-10"
                      >
                        <BottomNav activeTab="Home" />
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>

                {/* ── Trading Screen ── */}
                <AnimatePresence>
                  {stage === "trading" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.92, filter: "blur(6px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 1, ease: EASE }}
                      className="absolute inset-[3px] rounded-[2.7rem] z-40 overflow-hidden bg-white dark:bg-[#0a0a0a]"
                    >
                      <PhoneChrome inset />

                      <div className="pt-[48px] px-4 pb-14 h-full overflow-hidden">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3, duration: 0.6 }}
                          className="flex items-center justify-between mb-3"
                        >
                          <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-[8px] font-bold text-gray-500 dark:text-white/60">
                              G
                            </div>
                            <div>
                              <p className="text-[9px] font-semibold text-gray-900 dark:text-white leading-none">
                                goravesearchlab
                              </p>
                              <p className="text-[7px] text-gray-400 dark:text-white/40 font-mono">
                                MQu6b5...TQeK
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-neutral-800 flex items-center justify-center">
                              <span className="text-[8px] text-gray-500 dark:text-white/50">
                                {"\u{1F4AC}"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 bg-gray-100 dark:bg-neutral-800 rounded-full px-2 py-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <span className="text-[9px] font-semibold text-gray-900 dark:text-white">
                                4,847
                              </span>
                            </div>
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5, duration: 0.7 }}
                          className="bg-gray-50 dark:bg-neutral-900 rounded-2xl p-3 border border-gray-200 dark:border-white/[0.04]"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[11px] font-bold text-gray-900 dark:text-white">
                              Trade
                            </span>
                            <TradingBuySellToggle />
                          </div>

                          <div className="bg-gray-100 dark:bg-neutral-800/60 rounded-xl p-2.5 mb-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[8px] text-gray-400 dark:text-white/40">
                                You pay
                              </span>
                              <span className="text-[8px] text-gray-400 dark:text-white/40">
                                Balance: 4,847.20 USDT
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <TradingAmountTyping />
                              <div className="flex items-center gap-1 bg-gray-200 dark:bg-neutral-700/50 rounded-full px-2 py-0.5">
                                <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center">
                                  <span className="text-[6px] font-bold text-white">
                                    T
                                  </span>
                                </div>
                                <span className="text-[9px] font-medium text-gray-900 dark:text-white">
                                  USDT
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-center -my-1 relative z-10">
                            <div className="w-6 h-6 rounded-lg bg-gray-200 dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 flex items-center justify-center">
                              <span className="text-[10px] text-gray-500 dark:text-white/60">
                                {"\u21C5"}
                              </span>
                            </div>
                          </div>

                          <div className="bg-gray-100 dark:bg-neutral-800/60 rounded-xl p-2.5 mt-1 mb-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[8px] text-gray-400 dark:text-white/40">
                                You receive
                              </span>
                              <span className="text-[8px] text-gray-400 dark:text-white/40">
                                Rate: 1 USDC = 3.67 AED
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[14px] font-bold text-gray-300 dark:text-white/30">
                                0 {"\u062F.\u0625"}
                              </span>
                              <div className="flex items-center gap-1 bg-gray-200 dark:bg-neutral-700/50 rounded-full px-2 py-0.5">
                                <span className="text-[8px]">
                                  {"\u{1F1E6}\u{1F1EA}"}
                                </span>
                                <span className="text-[9px] font-medium text-gray-900 dark:text-white">
                                  AED
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[8px] text-gray-400 dark:text-white/40">
                              Pay via
                            </span>
                            <div className="flex items-center gap-1">
                              <div className="bg-black/[0.06] dark:bg-white/10 rounded-full px-2.5 py-0.5 border border-black/[0.08] dark:border-white/10">
                                <span className="text-[8px] text-gray-900 dark:text-white font-medium">
                                  {"\u{1F3E6}"} Bank
                                </span>
                              </div>
                              <div className="bg-transparent rounded-full px-2.5 py-0.5">
                                <span className="text-[8px] text-gray-400 dark:text-white/40">
                                  {"\u{1F4B5}"} Cash
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="mb-3">
                            <span className="text-[8px] text-gray-400 dark:text-white/40 block mb-1.5">
                              Matching priority
                            </span>
                            <div className="flex gap-1">
                              <div className="flex-1 bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 rounded-lg py-1.5 text-center">
                                <span className="text-[8px] font-semibold text-emerald-600 dark:text-emerald-400">
                                  Fastest
                                </span>
                              </div>
                              <div className="flex-1 bg-gray-100 dark:bg-neutral-800 rounded-lg py-1.5 text-center">
                                <span className="text-[8px] text-gray-500 dark:text-white/50">
                                  Best rate
                                </span>
                              </div>
                              <div className="flex-1 bg-gray-100 dark:bg-neutral-800 rounded-lg py-1.5 text-center">
                                <span className="text-[8px] text-gray-500 dark:text-white/50">
                                  Cheapest
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="relative">
                            <motion.div
                              initial={{ opacity: 0.4 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 1.5, duration: 0.4 }}
                              className="w-full py-2.5 rounded-xl text-center relative overflow-hidden"
                            >
                              <motion.div
                                className="absolute inset-0 rounded-xl"
                                initial={{ backgroundColor: "rgb(64,64,64)" }}
                                animate={{
                                  backgroundColor: [
                                    "rgb(64,64,64)",
                                    "rgb(16,185,129)",
                                    "rgb(16,185,129)",
                                    "rgb(16,185,129)",
                                  ],
                                  scale: [1, 1, 1, 0.93],
                                  boxShadow: [
                                    "0 0 0 0 rgba(16,185,129,0)",
                                    "0 0 0 0 rgba(16,185,129,0)",
                                    "0 0 24px 4px rgba(16,185,129,0.25)",
                                    "0 0 0 0 rgba(16,185,129,0)",
                                  ],
                                }}
                                transition={{
                                  delay: 1.5,
                                  duration: 1.2,
                                  times: [0, 0.25, 0.7, 1],
                                }}
                              />
                              <motion.div
                                className="absolute inset-0 m-auto w-6 h-6 rounded-full bg-white/40"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: [0, 3], opacity: [0.6, 0] }}
                                transition={{
                                  delay: 2.5,
                                  duration: 0.5,
                                  ease: "easeOut",
                                }}
                              />
                              <motion.span
                                className="relative z-10 text-[10px] font-semibold"
                                initial={{ color: "rgba(255,255,255,0.4)" }}
                                animate={{
                                  color: [
                                    "rgba(255,255,255,0.4)",
                                    "rgba(255,255,255,1)",
                                    "rgba(255,255,255,1)",
                                  ],
                                }}
                                transition={{
                                  delay: 1.5,
                                  duration: 0.7,
                                  times: [0, 0.3, 1],
                                }}
                              >
                                Continue
                              </motion.span>
                            </motion.div>

                            <motion.div
                              initial={{ opacity: 0, scale: 0.4, y: 15, x: 5 }}
                              animate={{
                                opacity: [0, 0, 1, 1, 1, 0.8, 0],
                                scale: [0.4, 0.4, 1, 1, 0.8, 0.8, 0.4],
                                y: [15, 15, 0, 0, 3, 3, -5],
                                x: [5, 5, 0, 0, 0, 0, 0],
                              }}
                              transition={{
                                delay: 1.8,
                                duration: 1.6,
                                times: [0, 0.05, 0.25, 0.55, 0.65, 0.85, 1],
                                ease: EASE,
                              }}
                              className="absolute -bottom-10 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
                            >
                              <FingerCursor size={42} />
                            </motion.div>
                          </div>

                          <p className="text-center mt-2">
                            <span className="text-[7px] text-gray-400 dark:text-white/30">
                              Have a large amount?{" "}
                            </span>
                            <span className="text-[7px] text-gray-600 dark:text-white/60 font-semibold">
                              Create an offer
                            </span>
                          </p>
                        </motion.div>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                        className="absolute bottom-3 left-3 right-3 z-10"
                      >
                        <BottomNav activeTab="Markets" />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ── Receipt Screen ── */}
                <AnimatePresence>
                  {isReceipt && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.92, filter: "blur(6px)" }}
                      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1, ease: EASE }}
                      className="absolute inset-[3px] rounded-[2.7rem] z-40 overflow-hidden bg-white dark:bg-[#0a0a0a]"
                    >
                      <PhoneChrome time="20:23" inset />
                      <OrderReceiptScreen />
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="absolute bottom-3 left-3 right-3 z-10"
                      >
                        <BottomNav activeTab="Markets" />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ── Protocol Lock Shot ── */}
      <ProtocolLockShot show={showProtocolLock} />

      {/* ── Micro-Proof Overlay Chips ── */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-[38] flex flex-col items-center gap-1.5 pointer-events-none">
        {/* phone stage */}
        <TimedChip
          show={isPhone && !isTradingOrReceipt && !isUnwrapStage}
          delayMs={1200}
          durationMs={1800}
          label="Non-custodial wallet"
          subline="You control funds."
        />
        {/* instantBidding stage */}
        <TimedChip
          show={isInstantBidding}
          delayMs={600}
          durationMs={1800}
          label="Merchant liquidity engine"
          subline="Bids compete for your order."
        />
        <RateChip show={isInstantBidding} delayMs={1000} />
        {/* verified stage */}
        <TimedChip
          show={isVerified}
          delayMs={800}
          durationMs={2000}
          label="On-chain audit trail"
          subline="Every step verifiable."
        />
        <TimedChip
          show={isVerified}
          delayMs={1600}
          durationMs={1800}
          label="View on BlipScan"
        />
      </div>

      {/* ── Cinematic Timeline ── */}
      <motion.div
        animate={{
          opacity: isFinale || animDone ? 0 : 0.6,
          y: isFinale ? 10 : 0,
        }}
        transition={{ duration: 1.2 }}
        className="absolute bottom-8 left-6 md:left-10 z-40"
      >
        <div className="flex items-center gap-0 bg-white/40 dark:bg-white/[0.03] backdrop-blur-xl rounded-full px-2.5 py-1.5 border border-black/[0.03] dark:border-white/[0.04]">
          {[
            { key: "list", label: "Assets" },
            { key: "stacked", label: "Protocol" },
            { key: "phone", label: "Wallet" },
            { key: "trading", label: "Trade" },
            { key: "instantBidding", label: "Match" },
            { key: "verified", label: "Verify" },
            { key: "receipt", label: "Settle" },
          ].map((step, i, arr) => {
            const currentIdx = STAGE_ORDER.indexOf(stage);
            const stepIdx = STAGE_ORDER.indexOf(step.key as Stage);
            const isActive = step.key === stage;
            const isPast = stepIdx < currentIdx;
            return (
              <div key={step.key} className="flex items-center">
                <div className="flex flex-col items-center gap-0.5 relative">
                  <motion.div
                    animate={{
                      backgroundColor:
                        isActive || isPast
                          ? "#ff6b35"
                          : "rgba(128,128,128,0.12)",
                      scale: isActive ? 1.3 : 1,
                    }}
                    transition={{ duration: 0.4 }}
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  />
                  <motion.span
                    animate={{ opacity: isActive ? 0.8 : isPast ? 0.4 : 0.15 }}
                    transition={{ duration: 0.3 }}
                    className="text-[6px] font-medium text-black dark:text-white tracking-wider whitespace-nowrap uppercase"
                  >
                    {step.label}
                  </motion.span>
                </div>
                {i < arr.length - 1 && (
                  <motion.div
                    animate={{
                      backgroundColor: isPast
                        ? "rgba(255,107,53,0.4)"
                        : "rgba(128,128,128,0.08)",
                    }}
                    transition={{ duration: 0.4 }}
                    className="h-[1px] w-3 sm:w-4 md:w-6 mx-0.5 -mt-2.5 rounded-full"
                  />
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ── Replay Button ── */}
      <AnimatePresence>
        {animDone && (
          <motion.button
            key="replay-btn"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            onClick={handleReplay}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-black/[0.06] dark:bg-white/[0.06] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.08] text-black/50 dark:text-white/50 hover:text-black/80 dark:hover:text-white/80 hover:bg-black/[0.1] dark:hover:bg-white/[0.1] text-xs font-semibold px-6 py-3 rounded-full hover:scale-105 transition-all duration-300"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 4v6h6" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
            Replay
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
}

// import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
// import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
// import { Globe, ChevronDown, Check } from "lucide-react";

// import { FingerCursor } from "../AdvancedDashboard/MerchantDashbaordTradeLive";

// /* ═══════════════════════════════════════════════════════════════
//    TYPES & CONSTANTS
//    ═══════════════════════════════════════════════════════════════ */

// type Stage =
//   | "list"
//   | "stacked"
//   | "phone"
//   | "trading"
//   | "instantBidding"
//   | "verified"
//   | "receipt"
//   | "finale";

// const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

// const stageCopy: Record<Stage, { headline: string; subline: string }> = {
//   list:           { headline: "Money is fragmented.",   subline: "Crypto. Banks. Separate rails." },
//   stacked:        { headline: "One settlement layer.",  subline: "Match. Lock. Confirm. Release." },
//   phone:          { headline: "Pay with crypto.",       subline: "Recipient receives local currency." },
//   trading:        { headline: "Place your order.",      subline: "Matched in seconds." },
//   instantBidding: { headline: "Live bidding.",          subline: "Best rate wins." },
//   verified:       { headline: "Verified on-chain.",     subline: "Immutable. Transparent." },
//   receipt:        { headline: "Settlement complete.",    subline: "Funds delivered." },
//   finale:         { headline: "Blip Money",             subline: "Global crypto liquidity. Settled." },
// };

// const currencies = [
//   { id: 1, title: "All Assets", amount: 12847.5, symbol: "$", icon: Globe },
//   { id: 2, title: "USDT", amount: 8420.0, symbol: "$", flag: "\u{1FA99}" },
//   { id: 3, title: "AED", amount: 15632.4, symbol: "\u062F.\u0625", flag: "\u{1F1E6}\u{1F1EA}" },
//   { id: 4, title: "BTC", amount: 0.0847, symbol: "\u20BF", flag: "\u26A1" },
// ];

// const transactions = [
//   { name: "P2P Trade \u00B7 Ahmed", time: "20:14", amount: "+5,000", currency: "AED" },
//   { name: "Sold USDT", time: "18:01", amount: "-2,500", currency: "USDT" },
//   { name: "Escrow Release", time: "09:01", amount: "+1,200", currency: "USDT" },
// ];

// const CARD_HEIGHT = 130;
// const LIST_GAP = 35;
// const STACK_OFFSET = 6;

// const orderTimelineSteps = [
//   { label: "Order Created",     time: "20:23:01" },
//   { label: "Merchant Matched",  time: "20:23:03" },
//   { label: "Payment Pending",   time: "20:23:05" },
//   { label: "Payment Confirmed", time: "20:23:41" },
//   { label: "Completed",         time: "20:24:12" },
// ];

// const STAGE_ORDER: Stage[] = [
//   "list", "stacked", "phone", "trading",
//   "instantBidding", "verified", "receipt", "finale",
// ];

// /* ═══════════════════════════════════════════════════════════════
//    HOOKS
//    ═══════════════════════════════════════════════════════════════ */

// function useCountUp(target: number, duration: number, delay: number, start: boolean) {
//   const [value, setValue] = useState(0);
//   useEffect(() => {
//     if (!start) return;
//     const timeout = setTimeout(() => {
//       const startTime = performance.now();
//       const tick = (now: number) => {
//         const elapsed = now - startTime;
//         const progress = Math.min(elapsed / (duration * 1000), 1);
//         const eased = 1 - Math.pow(1 - progress, 3);
//         setValue(eased * target);
//         if (progress < 1) requestAnimationFrame(tick);
//       };
//       requestAnimationFrame(tick);
//     }, delay * 1000);
//     return () => clearTimeout(timeout);
//   }, [target, duration, delay, start]);
//   return value;
// }

// function useDimensions() {
//   const [dims, setDims] = useState(() => ({
//     cardW: typeof window !== "undefined" ? Math.min(420, window.innerWidth - 48) : 420,
//     phoneW: typeof window !== "undefined" ? Math.min(290, window.innerWidth - 60) : 290,
//     phoneH: typeof window !== "undefined" ? Math.min(600, window.innerHeight * 0.7) : 600,
//   }));
//   useEffect(() => {
//     const update = () =>
//       setDims({
//         cardW: Math.min(420, window.innerWidth - 48),
//         phoneW: Math.min(290, window.innerWidth - 60),
//         phoneH: Math.min(600, window.innerHeight * 0.7),
//       });
//     window.addEventListener("resize", update);
//     return () => window.removeEventListener("resize", update);
//   }, []);
//   return dims;
// }

// /* ═══════════════════════════════════════════════════════════════
//    SHARED UI
//    ═══════════════════════════════════════════════════════════════ */

// function StatusBarIcons() {
//   return (
//     <div className="flex items-center gap-1.5">
//       <svg width="14" height="10" viewBox="0 0 14 10" className="text-black/60 dark:text-white">
//         <rect x="0" y="7" width="2" height="3" rx="0.5" fill="currentColor" />
//         <rect x="3" y="5" width="2" height="5" rx="0.5" fill="currentColor" />
//         <rect x="6" y="3" width="2" height="7" rx="0.5" fill="currentColor" />
//         <rect x="9" y="0" width="2" height="10" rx="0.5" fill="currentColor" />
//       </svg>
//       <svg width="12" height="10" viewBox="0 0 12 10" className="text-black/60 dark:text-white">
//         <path d="M6 8.5a1 1 0 110 2 1 1 0 010-2z" fill="currentColor" />
//         <path d="M3.5 7a3.5 3.5 0 015 0" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
//         <path d="M1.5 5a6 6 0 019 0" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
//       </svg>
//       <div className="flex items-center">
//         <div className="w-[18px] h-[9px] border border-black/40 dark:border-white/80 rounded-[2px] flex items-center p-[1px]">
//           <div className="w-[70%] h-full bg-black/60 dark:bg-white rounded-[1px]" />
//         </div>
//         <div className="w-[1.5px] h-[4px] bg-black/40 dark:bg-white/80 rounded-r-full ml-[0.5px]" />
//       </div>
//     </div>
//   );
// }

// function PhoneChrome({ time = "20:22", inset = false }: { time?: string; inset?: boolean }) {
//   return (
//     <>
//       <div
//         className={`absolute ${inset ? "top-[14px] left-[3px] right-[3px]" : "top-[16px] left-[6px] right-[6px]"} z-50 flex items-center justify-between px-5 h-[20px]`}
//       >
//         <span className="text-black/80 dark:text-white text-[9px] font-semibold">{time}</span>
//         <div className="w-[100px]" />
//         <StatusBarIcons />
//       </div>
//       <div
//         className={`absolute ${inset ? "top-[9px]" : "top-[12px]"} left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-black rounded-full z-[60]`}
//       />
//     </>
//   );
// }

// function BottomNav({ activeTab = "Home" }: { activeTab?: string }) {
//   return (
//     <div className="bg-white/90 dark:bg-[#111]/90 backdrop-blur-xl rounded-2xl px-4 py-2.5 flex items-center justify-around border border-black/[0.06] dark:border-white/[0.06] shadow-lg dark:shadow-none">
//       {[
//         { icon: "\u{1F3E0}", label: "Home" },
//         { icon: "\u{1F4CA}", label: "Markets" },
//         { icon: "\u{1F4B0}", label: "Wallet" },
//         { icon: "\u{1F464}", label: "Profile" },
//       ].map((tab) => (
//         <div key={tab.label} className="flex flex-col items-center gap-0.5">
//           <span className={`text-[12px] ${tab.label === activeTab ? "" : "opacity-40"}`}>
//             {tab.icon}
//           </span>
//           <span
//             className={`text-[7px] font-medium ${
//               tab.label === activeTab ? "text-[#ff6b35]" : "text-black/40 dark:text-white/30"
//             }`}
//           >
//             {tab.label}
//           </span>
//         </div>
//       ))}
//     </div>
//   );
// }

// /* ═══════════════════════════════════════════════════════════════
//    UTILITY COMPONENTS
//    ═══════════════════════════════════════════════════════════════ */

// function FloatingParticles({ count = 20, isActive }: { count?: number; isActive: boolean }) {
//   const particles = useMemo(
//     () =>
//       Array.from({ length: count }, (_, i) => ({
//         id: i,
//         x: Math.random() * 100,
//         y: Math.random() * 100,
//         size: Math.random() * 3 + 1,
//         duration: Math.random() * 8 + 6,
//         delay: Math.random() * 4,
//         opacity: Math.random() * 0.4 + 0.1,
//       })),
//     [count],
//   );

//   return (
//     <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
//       {particles.map((p) => (
//         <motion.div
//           key={p.id}
//           initial={{ opacity: 0 }}
//           animate={
//             isActive
//               ? {
//                   opacity: [0, p.opacity, p.opacity, 0],
//                   y: [0, -40, -80, -120],
//                   x: [0, Math.sin(p.id) * 20, Math.cos(p.id) * 15, Math.sin(p.id) * 25],
//                 }
//               : { opacity: 0 }
//           }
//           transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
//           className="absolute rounded-full"
//           style={{
//             left: `${p.x}%`,
//             top: `${p.y}%`,
//             width: p.size,
//             height: p.size,
//             background:
//               p.id % 3 === 0
//                 ? "#ff6b35"
//                 : p.id % 3 === 1
//                   ? "rgba(255,255,255,0.6)"
//                   : "#ff6b35",
//             filter: `blur(${p.size > 2.5 ? 1 : 0}px)`,
//           }}
//         />
//       ))}
//     </div>
//   );
// }

// function AnimatedAmount({
//   symbol,
//   amount,
//   delay,
//   start,
// }: {
//   symbol: string;
//   amount: number;
//   delay: number;
//   start: boolean;
// }) {
//   const value = useCountUp(amount, 0.8, delay * 0.6, start);
//   return (
//     <span>
//       {symbol}
//       {value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//     </span>
//   );
// }

// /* ═══════════════════════════════════════════════════════════════
//    INTERACTIVE COMPONENTS
//    ═══════════════════════════════════════════════════════════════ */

// function TradingBuySellToggle() {
//   const [isBuy, setIsBuy] = useState(true);
//   useEffect(() => {
//     const interval = setInterval(() => setIsBuy((v) => !v), 3000);
//     return () => clearInterval(interval);
//   }, []);
//   return (
//     <div className="flex items-center bg-gray-200 dark:bg-neutral-800 rounded-full p-0.5 relative">
//       <motion.div
//         className="absolute top-0.5 bottom-0.5 rounded-full"
//         animate={{
//           left: isBuy ? 2 : "50%",
//           right: isBuy ? "50%" : 2,
//           backgroundColor: isBuy ? "#10b981" : "#ef4444",
//         }}
//         transition={{ duration: 0.3, ease: EASE }}
//       />
//       <span
//         className={`relative z-10 text-[9px] font-semibold px-3 py-0.5 ${
//           isBuy ? "text-white" : "text-gray-500 dark:text-white/50"
//         }`}
//       >
//         Buy
//       </span>
//       <span
//         className={`relative z-10 text-[9px] font-semibold px-3 py-0.5 ${
//           !isBuy ? "text-white" : "text-gray-500 dark:text-white/50"
//         }`}
//       >
//         Sell
//       </span>
//     </div>
//   );
// }

// function TradingAmountTyping() {
//   const chars = ["5", "0", "0", "0"];
//   const [shown, setShown] = useState(0);
//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       const interval = setInterval(() => {
//         setShown((s) => {
//           if (s >= chars.length) {
//             clearInterval(interval);
//             return s;
//           }
//           return s + 1;
//         });
//       }, 180);
//       return () => clearInterval(interval);
//     }, 800);
//     return () => clearTimeout(timeout);
//   }, []);
//   return (
//     <span className="text-[16px] font-bold text-gray-900 dark:text-white tabular-nums">
//       {shown === 0 ? (
//         <span className="text-gray-300 dark:text-white/20">0</span>
//       ) : (
//         chars.slice(0, shown).join("")
//       )}
//     </span>
//   );
// }

// /* ═══════════════════════════════════════════════════════════════
//    SCREEN COMPONENTS
//    ═══════════════════════════════════════════════════════════════ */

// function OrderReceiptScreen() {
//   const [activeStep, setActiveStep] = useState(0);

//   useEffect(() => {
//     const timers: ReturnType<typeof setTimeout>[] = [];
//     orderTimelineSteps.forEach((_, i) => {
//       if (i === 0) return;
//       timers.push(setTimeout(() => setActiveStep(i), 500 + i * 700));
//     });
//     return () => timers.forEach(clearTimeout);
//   }, []);

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 30 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6, ease: EASE }}
//       className="h-full flex flex-col"
//     >
//       <div className="pt-[46px] px-4 pb-3">
//         <div className="flex items-center justify-between mb-4">
//           <span className="text-[9px] text-gray-400 dark:text-white/40 font-medium">
//             &larr; Back
//           </span>
//           <span className="text-[11px] font-semibold text-gray-900 dark:text-white">
//             Order Receipt
//           </span>
//           <div className="w-8" />
//         </div>

//         <motion.div
//           initial={{ scale: 0 }}
//           animate={{ scale: 1 }}
//           transition={{ delay: 0.3, duration: 0.5, type: "spring", stiffness: 200 }}
//           className="flex justify-center mb-3"
//         >
//           <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center">
//             <Check size={20} className="text-emerald-500 dark:text-emerald-400" />
//           </div>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.5, duration: 0.5 }}
//           className="text-center mb-4"
//         >
//           <p className="text-[20px] font-bold text-gray-900 dark:text-white">5,000.00 USDT</p>
//           <div className="flex items-center justify-center gap-1.5 mt-1">
//             <span className="text-[9px] text-gray-400 dark:text-white/40">&rarr;</span>
//             <span className="text-[13px] font-semibold text-emerald-500 dark:text-emerald-400">
//               18,350.00 AED
//             </span>
//           </div>
//           <p className="text-[8px] text-gray-400 dark:text-white/30 mt-1">
//             Rate: 1 USDT = 3.67 AED
//           </p>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, y: 15 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.7, duration: 0.5 }}
//           className="bg-gray-50 dark:bg-neutral-900 rounded-xl p-3 border border-gray-200 dark:border-white/[0.04] mb-3"
//         >
//           {[
//             { label: "Order ID", value: "#BLP-48291" },
//             { label: "Type", value: "Buy AED" },
//             { label: "Pay via", value: "Bank Transfer" },
//             { label: "Merchant", value: "FastExchange.ae" },
//             { label: "Fee", value: "0.00 USDT" },
//           ].map((item, i) => (
//             <div
//               key={item.label}
//               className={`flex items-center justify-between py-1.5 ${
//                 i < 4 ? "border-b border-gray-200/60 dark:border-white/[0.04]" : ""
//               }`}
//             >
//               <span className="text-[8px] text-gray-400 dark:text-white/40">{item.label}</span>
//               <span className="text-[8px] font-medium text-gray-700 dark:text-white/80">
//                 {item.value}
//               </span>
//             </div>
//           ))}
//         </motion.div>
//       </div>

//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.9, duration: 0.5 }}
//         className="px-4 flex-1"
//       >
//         <p className="text-[8px] text-gray-400 dark:text-white/40 uppercase tracking-wider mb-2.5">
//           Status Timeline
//         </p>
//         <div className="relative">
//           {orderTimelineSteps.map((step, i) => {
//             const isActive = i <= activeStep;
//             const isLast = i === orderTimelineSteps.length - 1;
//             const isCurrent = i === activeStep;
//             return (
//               <motion.div
//                 key={step.label}
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 1 + i * 0.15, duration: 0.4 }}
//                 className="flex items-start gap-2.5 relative"
//               >
//                 <div className="flex flex-col items-center">
//                   <motion.div
//                     animate={{
//                       backgroundColor: isActive ? "#10b981" : "#ADADAD",
//                       scale: isCurrent ? 1.2 : 1,
//                     }}
//                     transition={{ duration: 0.4 }}
//                     className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 border border-gray-200 dark:border-white/[0.06]"
//                   >
//                     {isActive && (
//                       <motion.div
//                         initial={{ scale: 0 }}
//                         animate={{ scale: 1 }}
//                         transition={{ duration: 0.3, type: "spring" }}
//                       >
//                         <Check size={8} className="text-white" />
//                       </motion.div>
//                     )}
//                   </motion.div>
//                   {!isLast && (
//                     <div
//                       className={`w-[1.5px] h-5 transition-colors duration-400 ${
//                         i < activeStep ? "bg-emerald-500" : "bg-gray-300 dark:bg-white/[0.06]"
//                       }`}
//                     />
//                   )}
//                 </div>
//                 <div className="pb-2">
//                   <p
//                     className={`text-[9px] font-medium leading-none ${
//                       isActive ? "text-gray-900 dark:text-white" : "text-gray-300 dark:text-white/30"
//                     }`}
//                   >
//                     {step.label}
//                   </p>
//                   <p
//                     className={`text-[7px] mt-0.5 font-mono ${
//                       isActive
//                         ? "text-gray-400 dark:text-white/40"
//                         : "text-gray-200 dark:text-white/15"
//                     }`}
//                   >
//                     {step.time}
//                   </p>
//                 </div>
//               </motion.div>
//             );
//           })}
//         </div>
//       </motion.div>

//       <motion.div
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 1.5, duration: 0.5 }}
//         className="px-4 pb-14 pt-2"
//       >
//         <div className="w-full py-2.5 rounded-xl bg-emerald-500 text-center">
//           <span className="text-[10px] font-semibold text-white">Done</span>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// }

// function InstantBiddingUnwrap() {
//   const bids = [
//     { name: "QuickSwap Pro", rate: "3.672", profit: "+$185", trades: "2,847", time: "~30s", best: true, avatar: "QS" },
//     { name: "FastSettle UAE", rate: "3.668", profit: "+$165", trades: "1,923", time: "~45s", best: false, avatar: "FS" },
//     { name: "DubaiExchange", rate: "3.665", profit: "+$150", trades: "3,102", time: "~60s", best: false, avatar: "DE" },
//   ];

//   return (
//     <div className="w-full max-w-3xl mx-auto px-4">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.2, duration: 0.6 }}
//         className="text-center mb-8"
//       >
//         <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black dark:text-white tracking-tight font-display">
//           {stageCopy.instantBidding.headline}
//         </h3>
//         <p className="text-sm text-black/40 dark:text-white/40 mt-2 tracking-wide">
//           {stageCopy.instantBidding.subline}
//         </p>
//         <motion.div
//           initial={{ scaleX: 0 }}
//           animate={{ scaleX: 1 }}
//           transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
//           className="h-[1px] mt-4 mx-auto w-20 bg-gradient-to-r from-transparent via-[#ff6b35]/60 to-transparent"
//         />
//       </motion.div>

//       <div className="space-y-3" style={{ perspective: 1200 }}>
//         {bids.map((bid, i) => (
//           <motion.div
//             key={bid.name}
//             initial={{ rotateX: -90, opacity: 0 }}
//             animate={{ rotateX: 0, opacity: 1 }}
//             transition={{ delay: 0.4 + i * 0.25, duration: 0.8, ease: EASE }}
//             style={{ transformOrigin: "top center" }}
//             className={`p-4 rounded-xl border backdrop-blur-xl ${
//               bid.best
//                 ? "bg-white/90 dark:bg-white/[0.08] border-[#ff6b35]/30 shadow-[0_4px_24px_-6px_rgba(255,107,53,0.15)] dark:shadow-[0_4px_24px_-6px_rgba(255,107,53,0.1)]"
//                 : "bg-white/70 dark:bg-white/[0.03] border-black/[0.06] dark:border-white/[0.06]"
//             }`}
//           >
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-3">
//                 <div
//                   className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold ${
//                     bid.best
//                       ? "bg-[#ff6b35]/10 dark:bg-[#ff6b35]/20 text-[#ff6b35]"
//                       : "bg-black/[0.05] dark:bg-white/[0.05] text-black/60 dark:text-white/50"
//                   }`}
//                 >
//                   {bid.avatar}
//                 </div>
//                 <div>
//                   <div className="flex items-center gap-2">
//                     <span className="text-sm font-semibold text-black dark:text-white">
//                       {bid.name}
//                     </span>
//                     {bid.best && (
//                       <span className="px-2 py-0.5 rounded-full bg-[#ff6b35]/10 dark:bg-[#ff6b35]/20 text-[9px] text-[#ff6b35] font-bold uppercase">
//                         Best Rate
//                       </span>
//                     )}
//                   </div>
//                   <span className="text-xs text-black/50 dark:text-white/40">
//                     {bid.trades} trades &middot; ETA {bid.time}
//                   </span>
//                 </div>
//               </div>
//               <div className="text-right">
//                 <div className="text-lg font-bold text-black dark:text-white">
//                   {bid.rate}{" "}
//                   <span className="text-xs text-black/40 dark:text-white/40">AED</span>
//                 </div>
//                 <div className="text-xs text-black/50 dark:text-white/50">{bid.profit}</div>
//               </div>
//             </div>
//           </motion.div>
//         ))}

//         <motion.div
//           initial={{ rotateX: -90, opacity: 0 }}
//           animate={{ rotateX: 0, opacity: 1 }}
//           transition={{ delay: 1.2, duration: 0.8, ease: EASE }}
//           style={{ transformOrigin: "top center" }}
//           className="p-3 rounded-xl bg-[#ff6b35]/5 dark:bg-[#ff6b35]/10 border border-[#ff6b35]/20 text-center"
//         >
//           <div className="flex items-center justify-center gap-2">
//             <motion.div
//               className="w-2 h-2 rounded-full bg-[#ff6b35]"
//               animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
//               transition={{ duration: 1.5, repeat: Infinity }}
//             />
//             <span className="text-sm text-[#ff6b35] font-medium">
//               Auto-selecting best offer in 8s...
//             </span>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// }

// function VerifiedUnwrap() {
//   const [confirmations, setConfirmations] = useState(0);

//   useEffect(() => {
//     const timers = [
//       setTimeout(() => setConfirmations(1), 800),
//       setTimeout(() => setConfirmations(2), 1400),
//       setTimeout(() => setConfirmations(3), 2000),
//     ];
//     return () => timers.forEach(clearTimeout);
//   }, []);

//   return (
//     <div className="w-full max-w-3xl mx-auto px-4">
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.2, duration: 0.6 }}
//         className="text-center mb-8"
//       >
//         <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black dark:text-white tracking-tight font-display">
//           {stageCopy.verified.headline}
//         </h3>
//         <p className="text-sm text-black/40 dark:text-white/40 mt-2 tracking-wide">
//           {stageCopy.verified.subline}
//         </p>
//         <motion.div
//           initial={{ scaleX: 0 }}
//           animate={{ scaleX: 1 }}
//           transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
//           className="h-[1px] mt-4 mx-auto w-20 bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent"
//         />
//       </motion.div>

//       <div style={{ perspective: 1200 }}>
//         <motion.div
//           initial={{ rotateX: -90, opacity: 0 }}
//           animate={{ rotateX: 0, opacity: 1 }}
//           transition={{ delay: 0.4, duration: 1, ease: EASE }}
//           style={{ transformOrigin: "top center" }}
//           className="rounded-2xl bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.06] overflow-hidden"
//         >
//           <div className="p-4 border-b border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between">
//             <div className="flex items-center gap-2">
//               <motion.div
//                 className="w-2 h-2 rounded-full bg-emerald-500"
//                 animate={{ scale: [1, 1.4, 1] }}
//                 transition={{ duration: 2, repeat: Infinity }}
//               />
//               <span className="text-xs font-semibold text-black dark:text-white">
//                 Verified on Solana
//               </span>
//             </div>
//             <span className="text-[10px] text-black/40 dark:text-white/40 font-mono">
//               Block #248,192,847
//             </span>
//           </div>

//           <div className="p-4 space-y-1">
//             {[
//               { label: "Transaction Hash", value: "5Kd8nR...v9Qm" },
//               { label: "From", value: "MQu6b5...TQeK" },
//               { label: "To", value: "7xKp2R...nW4J" },
//               { label: "Amount", value: "5,000.00 USDT" },
//               { label: "Fee", value: "0.00025 SOL" },
//             ].map((item, i) => (
//               <motion.div
//                 key={item.label}
//                 initial={{ opacity: 0, x: -20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.8 + i * 0.12, duration: 0.4 }}
//                 className="flex items-center justify-between py-2 border-b border-black/[0.04] dark:border-white/[0.04] last:border-0"
//               >
//                 <span className="text-xs text-black/50 dark:text-white/40">{item.label}</span>
//                 <span className="text-xs font-medium font-mono text-black/80 dark:text-white/80">
//                   {item.value}
//                 </span>
//               </motion.div>
//             ))}

//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: 1.4, duration: 0.4 }}
//               className="flex items-center justify-between py-2"
//             >
//               <span className="text-xs text-black/50 dark:text-white/40">Status</span>
//               <div className="flex items-center gap-2">
//                 <div className="flex gap-1">
//                   {[1, 2, 3].map((n) => (
//                     <motion.div
//                       key={n}
//                       initial={{ scale: 0 }}
//                       animate={{
//                         scale: confirmations >= n ? 1 : 0.5,
//                         backgroundColor: confirmations >= n ? "#10b981" : "#d1d5db",
//                       }}
//                       transition={{ delay: 0.6 + n * 0.6, duration: 0.3, type: "spring" }}
//                       className="w-2 h-2 rounded-full"
//                     />
//                   ))}
//                 </div>
//                 <span
//                   className={`text-xs font-medium font-mono ${
//                     confirmations >= 3 ? "text-emerald-500" : "text-amber-500"
//                   }`}
//                 >
//                   {confirmations}/3 Confirmed
//                 </span>
//               </div>
//             </motion.div>
//           </div>

//           <motion.div
//             initial={{ rotateX: -90, opacity: 0 }}
//             animate={{
//               rotateX: confirmations >= 3 ? 0 : -90,
//               opacity: confirmations >= 3 ? 1 : 0,
//             }}
//             transition={{ delay: 2.2, duration: 0.8, ease: EASE }}
//             style={{ transformOrigin: "top center" }}
//             className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border-t border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center gap-2"
//           >
//             <motion.div
//               initial={{ scale: 0 }}
//               animate={{ scale: confirmations >= 3 ? 1 : 0 }}
//               transition={{ delay: 2.5, duration: 0.4, type: "spring", stiffness: 200 }}
//             >
//               <Check size={16} className="text-emerald-500" />
//             </motion.div>
//             <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
//               Transaction Verified
//             </span>
//           </motion.div>
//         </motion.div>
//       </div>
//     </div>
//   );
// }

// /* ═══════════════════════════════════════════════════════════════
//    MICRO-PROOF OVERLAYS
//    ═══════════════════════════════════════════════════════════════ */

// /** Glass chip that auto-appears after `delayMs` and fades out after `durationMs`. */
// function TimedChip({
//   show,
//   delayMs,
//   durationMs = 1800,
//   label,
//   subline,
// }: {
//   show: boolean;
//   delayMs: number;
//   durationMs?: number;
//   label: string;
//   subline?: string;
// }) {
//   const [visible, setVisible] = useState(false);
//   useEffect(() => {
//     if (!show) { setVisible(false); return; }
//     const enter = setTimeout(() => setVisible(true), delayMs);
//     const exit  = setTimeout(() => setVisible(false), delayMs + durationMs);
//     return () => { clearTimeout(enter); clearTimeout(exit); };
//   }, [show, delayMs, durationMs]);

//   return (
//     <AnimatePresence>
//       {visible && (
//         <motion.div
//           key={label}
//           initial={{ opacity: 0, y: 6, filter: "blur(6px)" }}
//           animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
//           exit={{ opacity: 0, y: -4, filter: "blur(4px)" }}
//           transition={{ duration: 0.6, ease: EASE }}
//           className="flex flex-col items-center gap-0.5 pointer-events-none"
//         >
//           <span className="text-[9px] font-semibold tracking-[0.08em] uppercase text-black/70 dark:text-white/70 bg-white/50 dark:bg-white/[0.06] backdrop-blur-xl rounded-full px-3 py-1 border border-black/[0.04] dark:border-white/[0.06]">
//             {label}
//           </span>
//           {subline && (
//             <span className="text-[8px] text-black/40 dark:text-white/35 tracking-wide">
//               {subline}
//             </span>
//           )}
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }

// /** Rate tightening chip for instantBidding stage. */
// function RateChip({ show, delayMs = 800 }: { show: boolean; delayMs?: number }) {
//   const [visible, setVisible] = useState(false);
//   const [rateIdx, setRateIdx] = useState(0);
//   const rates = ["3.664", "3.667", "3.670", "3.672"];

//   useEffect(() => {
//     if (!show) { setVisible(false); setRateIdx(0); return; }
//     const enter = setTimeout(() => setVisible(true), delayMs);
//     const exit  = setTimeout(() => setVisible(false), delayMs + 2200);
//     return () => { clearTimeout(enter); clearTimeout(exit); };
//   }, [show, delayMs]);

//   useEffect(() => {
//     if (!visible) return;
//     const interval = setInterval(() => {
//       setRateIdx((i) => (i < rates.length - 1 ? i + 1 : i));
//     }, 450);
//     return () => clearInterval(interval);
//   }, [visible, rates.length]);

//   return (
//     <AnimatePresence>
//       {visible && (
//         <motion.div
//           initial={{ opacity: 0, y: 6, filter: "blur(6px)" }}
//           animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
//           exit={{ opacity: 0, y: -4, filter: "blur(4px)" }}
//           transition={{ duration: 0.5, ease: EASE }}
//           className="flex items-center gap-1.5 bg-white/50 dark:bg-white/[0.06] backdrop-blur-xl rounded-full px-3 py-1 border border-black/[0.04] dark:border-white/[0.06] pointer-events-none"
//         >
//           <span className="text-[9px] font-semibold tracking-wide text-black/70 dark:text-white/70 tabular-nums">
//             {rates[rateIdx]} <span className="text-[7px] text-black/40 dark:text-white/35">AED/USDT</span>
//           </span>
//           <motion.span
//             animate={{ opacity: [0.4, 1, 0.4] }}
//             transition={{ duration: 0.9, repeat: Infinity }}
//             className="text-[8px] text-emerald-500"
//           >
//             ▲
//           </motion.span>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }

// /** Three animated check-lines during the "stacked" (protocol lock) moment. */
// function ProtocolLockShot({ show }: { show: boolean }) {
//   const lines = ["Escrow locked", "Merchant matched", "Local payout ready"];
//   return (
//     <AnimatePresence>
//       {show && (
//         <motion.div
//           key="protocol-lock"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0, filter: "blur(4px)" }}
//           transition={{ duration: 0.5, ease: EASE }}
//           className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[35] flex flex-col items-center gap-2 pointer-events-none"
//         >
//           {lines.map((line, i) => (
//             <motion.div
//               key={line}
//               initial={{ opacity: 0, x: -8 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.35, delay: 0.2 + i * 0.25, ease: EASE }}
//               className="flex items-center gap-2"
//             >
//               <motion.div
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//                 transition={{ duration: 0.2, delay: 0.2 + i * 0.25 + 0.15, ease: EASE }}
//               >
//                 <Check size={10} className="text-emerald-400" strokeWidth={3} />
//               </motion.div>
//               <span className="text-[10px] font-medium tracking-[0.06em] text-black/60 dark:text-white/55">
//                 {line}
//               </span>
//             </motion.div>
//           ))}
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }

// /* ═══════════════════════════════════════════════════════════════
//    MAIN COMPONENT
//    ═══════════════════════════════════════════════════════════════ */

// export default function PremiumFintechSection() {
//   const [stage, setStage] = useState<Stage>("list");
//   const [showProtocolLock, setShowProtocolLock] = useState(false);
//   const sectionRef = useRef<HTMLDivElement>(null);
//   const { cardW, phoneW, phoneH } = useDimensions();

//   /* ─── Scroll-driven stage progression ─── */
//   const { scrollYProgress } = useScroll({
//     target: sectionRef,
//     offset: ["start start", "end end"],
//   });

//   const prevStageRef = useRef<Stage>("list");

//   useMotionValueEvent(scrollYProgress, "change", (v) => {
//     let next: Stage;
//     if (v < 0.08)      next = "list";
//     else if (v < 0.18) next = "stacked";
//     else if (v < 0.30) next = "phone";
//     else if (v < 0.42) next = "trading";
//     else if (v < 0.56) next = "instantBidding";
//     else if (v < 0.70) next = "verified";
//     else if (v < 0.84) next = "receipt";
//     else                next = "finale";

//     if (next !== prevStageRef.current) {
//       prevStageRef.current = next;
//       setStage(next);
//     }
//   });

//   const animDone = stage === "finale";

//   const handleReplay = useCallback(() => {
//     sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
//   }, []);

//   /* Protocol lock shot — brief overlay during "stacked" stage */
//   useEffect(() => {
//     if (stage !== "stacked") { setShowProtocolLock(false); return; }
//     const show = setTimeout(() => setShowProtocolLock(true), 400);
//     return () => { clearTimeout(show); setShowProtocolLock(false); };
//   }, [stage]);

//   /* ─── Derived state ─── */
//   const isFinale = stage === "finale";
//   const isInstantBidding = stage === "instantBidding";
//   const isVerified = stage === "verified";
//   const isUnwrapStage = isInstantBidding || isVerified;
//   const isTrading = stage === "trading";
//   const isReceipt = stage === "receipt";
//   const isTradingOrReceipt = isTrading || isReceipt;
//   const isPhone = stage === "phone" || isTradingOrReceipt;
//   const isStacked = stage !== "list" && !isFinale;
//   const isFocusMoment = isTradingOrReceipt || isUnwrapStage;
//   const isCalm = isReceipt || isFinale;

//   const getCardY = useCallback(
//     (idx: number) => (stage === "list" ? idx * (CARD_HEIGHT + LIST_GAP) : idx * STACK_OFFSET),
//     [stage],
//   );

//   const totalListHeight = currencies.length * CARD_HEIGHT + (currencies.length - 1) * LIST_GAP;
//   const totalStackHeight = CARD_HEIGHT + (currencies.length - 1) * STACK_OFFSET;

//   return (
//     <div ref={sectionRef} style={{ height: "500vh" }} className="relative">
//     <section
//       className="sticky top-0 bg-[#FAF8F5] dark:bg-black overflow-hidden"
//       style={{ height: "100vh" }}
//     >
//       {/* ── Background Layer ── */}
//       <motion.div
//         className="absolute inset-0 pointer-events-none overflow-hidden"
//         animate={{ filter: isFocusMoment ? "blur(2px)" : "blur(0px)" }}
//         transition={{ duration: 2 }}
//       >
//         <motion.div
//           animate={{
//             scale: isFinale ? 0.8 : isStacked ? 1.6 : 1,
//             opacity: isFinale ? 0.08 : isStacked ? 0.5 : 0.25,
//             x: isPhone ? 60 : 0,
//             y: isPhone ? 40 : 0,
//           }}
//           transition={{ duration: 3, ease: "easeInOut" }}
//           className="absolute top-[-15%] left-[-15%] w-[65%] h-[65%] dark:bg-[#ff6b35]/12 rounded-full blur-[160px]"
//         />
//         <motion.div
//           animate={{
//             scale: isFinale ? 0.7 : isStacked ? 1.4 : 1,
//             opacity: isFinale ? 0.05 : isStacked ? 0.3 : 0.12,
//             x: isPhone ? -40 : 0,
//             y: isPhone ? -30 : 0,
//           }}
//           transition={{ duration: 3, delay: 0.3, ease: "easeInOut" }}
//           className="absolute bottom-[-15%] right-[-15%] w-[55%] h-[55%] bg-violet-500/10 dark:bg-violet-500/8 rounded-full blur-[160px]"
//         />
//         <motion.div
//           animate={{
//             opacity: isFinale ? 0 : isPhone ? 0.2 : 0,
//             scale: isPhone ? 1.2 : 0.8,
//           }}
//           transition={{ duration: 2, delay: 0.5 }}
//           className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-[#ff6b35]/15 dark:bg-[#ff6b35]/8 rounded-full blur-[180px]"
//         />
//         <motion.div
//           animate={{ opacity: isFinale ? 0.01 : 0.03 }}
//           transition={{ duration: 2 }}
//           className="absolute inset-0 dark:opacity-[0.04]"
//           style={{
//             backgroundImage:
//               "linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)",
//             backgroundSize: "60px 60px",
//           }}
//         />
//       </motion.div>

//       {/* ── Noise Texture ── */}
//       <motion.div
//         animate={{ opacity: isFinale ? 0.01 : 0.025 }}
//         transition={{ duration: 2 }}
//         className="absolute inset-0 pointer-events-none z-[2] dark:opacity-[0.04] mix-blend-overlay"
//         style={{
//           backgroundImage:
//             'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
//           backgroundRepeat: "repeat",
//           backgroundSize: "128px 128px",
//         }}
//       />

//       {/* ── Cinematic Vignette ── */}
//       <motion.div
//         className="absolute inset-0 pointer-events-none z-[3]"
//         animate={{ opacity: isFocusMoment ? 1 : isCalm ? 0.2 : 0.4 }}
//         transition={{ duration: 2 }}
//         style={{
//           background:
//             "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.1) 100%)",
//         }}
//       />

//       {/* ── Protocol Lock Vignette (tighter focus during lock shot) ── */}
//       <motion.div
//         className="absolute inset-0 pointer-events-none z-[4]"
//         animate={{ opacity: showProtocolLock ? 1 : 0 }}
//         transition={{ duration: 0.7, ease: EASE }}
//         style={{
//           background:
//             "radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.18) 100%)",
//         }}
//       />

//       {/* ── Subtle Background Darken ── */}
//       <motion.div
//         className="absolute inset-0 bg-black pointer-events-none z-[2]"
//         animate={{ opacity: isPhone && !isFinale ? 0.03 : 0 }}
//         transition={{ duration: 2 }}
//       />

//       {/* ── Floating Particles ── */}
//       <motion.div
//         animate={{ opacity: isFinale ? 0 : isCalm ? 0.3 : 1 }}
//         transition={{ duration: 2.5 }}
//       >
//         <FloatingParticles count={24} isActive={true} />
//       </motion.div>

//       {/* ── Bottom Fade Gradient ── */}
//       <AnimatePresence>
//         {(stage === "list" || stage === "stacked") && (
//           <motion.div
//             key="bottom-fade"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.8 }}
//             className="absolute bottom-0 left-0 right-0 h-[40%] z-30 pointer-events-none bg-gradient-to-t from-[#FAF8F5] via-[#FAF8F5]/80 dark:from-black dark:via-black/80 to-transparent"
//           />
//         )}
//       </AnimatePresence>

//       {/* ── Camera Drift Wrapper ── */}
//       <motion.div
//         className="absolute inset-0"
//         animate={{ x: [0, 5, -3, 4, 0], y: [0, -3, 2, -2, 0] }}
//         transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
//       >
//         <div
//           className={`h-full flex justify-center px-4 sm:px-6 md:px-20 overflow-hidden ${
//             isPhone || isUnwrapStage
//               ? "items-center py-10 sm:py-20"
//               : "items-start pt-16 sm:pt-28 mt-8 sm:mt-16 md:pt-32"
//           }`}
//         >
//           <div className="relative w-full max-w-6xl flex items-center justify-center">
//             {/* ── Left Text — phone stage, desktop ── */}
//             <AnimatePresence>
//               {isPhone && !isTradingOrReceipt && !isFinale && (
//                 <motion.div
//                   key="left-text"
//                   initial={{ opacity: 0, x: -60 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -40 }}
//                   transition={{ duration: 1.2, ease: EASE }}
//                   className="hidden md:block absolute left-0 max-w-sm z-10"
//                 >
//                   <motion.div
//                     initial={{ scaleX: 0 }}
//                     animate={{ scaleX: 1 }}
//                     transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
//                     className="w-16 h-[1px] bg-gradient-to-r from-[#ff6b35]/60 to-transparent mb-10 origin-left"
//                   />
//                   <motion.h3
//                     initial={{ opacity: 0, x: -40 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ duration: 1, delay: 0.1, ease: EASE }}
//                     className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight font-display bg-gradient-to-br from-black via-black/80 to-black/50 dark:from-white dark:via-white/80 dark:to-white/40 bg-clip-text text-transparent"
//                   >
//                     {stageCopy.phone.headline}
//                   </motion.h3>
//                   <motion.div
//                     initial={{ scaleX: 0 }}
//                     animate={{ scaleX: 1 }}
//                     transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
//                     className="h-[1px] mt-4 w-32 bg-gradient-to-r from-[#ff6b35]/50 to-transparent origin-left"
//                   />
//                   <motion.p
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
//                     className="text-black/40 dark:text-white/40 text-base md:text-lg mt-5 max-w-xs"
//                   >
//                     {stageCopy.phone.subline}
//                   </motion.p>
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             {/* ── Instant Bidding Unwrap ── */}
//             <AnimatePresence>
//               {isInstantBidding && (
//                 <motion.div
//                   key="instant-bidding-unwrap"
//                   initial={{ opacity: 0, scale: 0.92, filter: "blur(10px)" }}
//                   animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
//                   exit={{ opacity: 0, scale: 0.9, filter: "blur(12px)" }}
//                   transition={{ duration: 1.4, ease: EASE }}
//                   className="absolute inset-0 flex flex-col items-center justify-center pb-[100px] sm:pb-[120px] md:pb-[150px] z-10"
//                 >
//                   <InstantBiddingUnwrap />
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             {/* ── Verified Unwrap ── */}
//             <AnimatePresence>
//               {isVerified && (
//                 <motion.div
//                   key="verified-unwrap"
//                   initial={{ opacity: 0, scale: 0.92, filter: "blur(10px)" }}
//                   animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
//                   exit={{ opacity: 0, scale: 0.9, filter: "blur(12px)" }}
//                   transition={{ duration: 1.4, ease: EASE }}
//                   className="absolute inset-0 flex flex-col items-center justify-center pb-[100px] sm:pb-[120px] md:pb-[100px] z-10"
//                 >
//                   <VerifiedUnwrap />
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             {/* ── Finale Lockup ── */}
//             <AnimatePresence>
//               {isFinale && (
//                 <motion.div
//                   key="finale-lockup"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 2.5, ease: EASE }}
//                   className="absolute inset-0 flex flex-col items-center justify-center z-20"
//                 >
//                   <motion.h2
//                     initial={{ opacity: 0, y: 15 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 2, delay: 0.3, ease: EASE }}
//                     className="bg-gradient-to-br from-black via-black/80 to-black/50 dark:from-white dark:via-white/80 dark:to-white/40 bg-clip-text text-transparent"
//                     style={{ fontSize: "clamp(2.8rem, 5.5vw, 5rem)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.08 }}
//                   >
//                     {stageCopy.finale.headline}
//                   </motion.h2>
//                   <motion.div
//                     initial={{ scaleX: 0 }}
//                     animate={{ scaleX: 1 }}
//                     transition={{ duration: 1, delay: 1.2, ease: EASE }}
//                     className="h-[1px] mt-5 w-24 bg-gradient-to-r from-transparent via-[#ff6b35]/40 to-transparent"
//                   />
//                   <motion.p
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ duration: 2, delay: 1.5, ease: EASE }}
//                     className="text-base sm:text-lg text-black/35 dark:text-white/35 mt-5 tracking-wide"
//                   >
//                     {stageCopy.finale.subline}
//                   </motion.p>
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             {/* ── Center Content ── */}
//             <motion.div
//               animate={{
//                 opacity: isUnwrapStage || isFinale ? 0 : 1,
//                 scale: isUnwrapStage || isFinale ? 0.9 : 1,
//                 pointerEvents: (isUnwrapStage || isFinale ? "none" : "auto") as "none" | "auto",
//               }}
//               transition={{ duration: 1.4, ease: EASE }}
//               className="flex flex-col items-center"
//             >
//               {/* ── Heading — per stage ── */}
//               <motion.div
//                 animate={{
//                   height: isPhone && !isTradingOrReceipt ? 0 : "auto",
//                   opacity: isPhone && !isTradingOrReceipt ? 0 : 1,
//                   marginBottom: isPhone && !isTradingOrReceipt ? 0 : isTradingOrReceipt ? 20 : 48,
//                 }}
//                 transition={{ duration: 1, ease: EASE }}
//                 className="overflow-hidden"
//               >
//                 <AnimatePresence mode="wait">
//                   {stage === "list" && (
//                     <motion.div
//                       key="list-title"
//                       initial={{ opacity: 0, x: -80, filter: "blur(8px)" }}
//                       animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
//                       exit={{ opacity: 0, x: 60, filter: "blur(6px)" }}
//                       transition={{ duration: 1, ease: EASE }}
//                       className="text-center"
//                     >
//                       <h2 className="bg-gradient-to-br from-black via-black/80 to-black/50 dark:from-white dark:via-white/80 dark:to-white/40 bg-clip-text text-transparent inline-block" style={{ fontSize: "clamp(2.8rem, 5.5vw, 5rem)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.08 }}>
//                         {stageCopy.list.headline}
//                       </h2>
//                       <motion.p
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ delay: 0.5, duration: 0.8 }}
//                         className="text-sm sm:text-base text-black/35 dark:text-white/35 mt-3 tracking-wide"
//                       >
//                         {stageCopy.list.subline}
//                       </motion.p>
//                       <motion.div
//                         initial={{ scaleX: 0 }}
//                         animate={{ scaleX: 1 }}
//                         transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
//                         className="h-[1px] mt-4 mx-auto bg-gradient-to-r from-transparent via-[#ff6b35]/50 to-transparent origin-left"
//                       />
//                     </motion.div>
//                   )}

//                   {stage === "stacked" && (
//                     <motion.div
//                       key="stacked-title"
//                       initial={{ opacity: 0, x: 80, filter: "blur(8px)" }}
//                       animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
//                       exit={{ opacity: 0, x: -60, filter: "blur(6px)" }}
//                       transition={{ duration: 1, ease: EASE }}
//                       className="text-center"
//                     >
//                       <h2 className="bg-gradient-to-br from-black via-black/80 to-[#ff6b35]/70 dark:from-white dark:via-white/80 dark:to-[#ff6b35]/70 bg-clip-text text-transparent inline-block" style={{ fontSize: "clamp(2.8rem, 5.5vw, 5rem)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.08 }}>
//                         {stageCopy.stacked.headline}
//                       </h2>
//                       <motion.p
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ delay: 0.4, duration: 0.8 }}
//                         className="text-sm sm:text-base text-black/35 dark:text-white/35 mt-3 tracking-wide"
//                       >
//                         {stageCopy.stacked.subline}
//                       </motion.p>
//                       <motion.div
//                         initial={{ scaleX: 0 }}
//                         animate={{ scaleX: 1 }}
//                         transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
//                         className="h-[1px] mt-4 mx-auto bg-gradient-to-r from-transparent via-[#ff6b35]/50 to-transparent origin-right"
//                       />
//                     </motion.div>
//                   )}

//                   {isTradingOrReceipt && (
//                     <motion.div
//                       key="user-title"
//                       initial={{ opacity: 0, y: -15, filter: "blur(6px)" }}
//                       animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
//                       exit={{ opacity: 0, y: 10, filter: "blur(4px)" }}
//                       transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
//                       className="text-center"
//                     >
//                       <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-black dark:text-white tracking-tight font-display inline-block">
//                         {stage === "trading"
//                           ? stageCopy.trading.headline
//                           : stageCopy.receipt.headline}
//                       </h3>
//                       <p className="text-xs text-black/35 dark:text-white/35 mt-1.5 tracking-wide">
//                         {stage === "trading"
//                           ? stageCopy.trading.subline
//                           : stageCopy.receipt.subline}
//                       </p>
//                       <motion.div
//                         initial={{ scaleX: 0 }}
//                         animate={{ scaleX: 1 }}
//                         transition={{ duration: 0.5, delay: 0.5, ease: EASE }}
//                         className="h-[1px] mt-3 mx-auto w-16 bg-gradient-to-r from-transparent via-[#ff6b35]/40 to-transparent origin-left"
//                       />
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </motion.div>

//               {/* ── Cards + Phone Wrapper ── */}
//               <motion.div
//                 animate={{
//                   width: isPhone ? phoneW : cardW,
//                   height: isPhone ? phoneH : isStacked ? totalStackHeight : totalListHeight,
//                 }}
//                 transition={{
//                   width: { duration: 1.4, ease: EASE },
//                   height: { duration: isPhone ? 0.8 : 1.4, ease: EASE },
//                 }}
//                 className="relative"
//               >
//                 {/* Glowing halo behind phone */}
//                 <motion.div
//                   initial={false}
//                   animate={{ opacity: isPhone ? 1 : 0, scale: isPhone ? 1 : 0.8 }}
//                   transition={{ duration: 1.8, ease: "easeOut" }}
//                   className="absolute inset-[-40px] z-[-1] pointer-events-none"
//                 >
//                   <div className="absolute inset-0 bg-gradient-to-b from-[#ff6b35]/20 via-[#ff6b35]/5 to-transparent dark:from-[#ff6b35]/15 dark:via-[#ff6b35]/5 dark:to-transparent rounded-[4rem] blur-[40px]" />
//                   <motion.div
//                     animate={{ opacity: [0.3, 0.6, 0.3] }}
//                     transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
//                     className="absolute inset-[10px] bg-gradient-to-br from-[#ff6b35]/10 via-transparent to-violet-500/10 dark:from-[#ff6b35]/8 dark:to-violet-500/8 rounded-[3.5rem] blur-[30px]"
//                   />
//                 </motion.div>

//                 {/* Phone Frame */}
//                 <motion.div
//                   initial={false}
//                   animate={{
//                     opacity: isPhone ? 1 : 0,
//                     scale: isPhone ? 1 : 0.95,
//                     rotateZ: isPhone && !isTradingOrReceipt ? 1 : 0,
//                   }}
//                   transition={{ duration: 1.2, ease: EASE }}
//                   className="absolute inset-[-4px] z-0 pointer-events-none"
//                   style={{ transformOrigin: "center center" }}
//                 >
//                   {/* Titanium bezel */}
//                   <div className="w-full h-full bg-gradient-to-b from-[#d8d5d0] via-[#c8c5c0] to-[#bab7b2] dark:from-[#48484a] dark:via-[#3a3a3c] dark:to-[#2c2c2e] rounded-[3rem] shadow-[0_30px_80px_-10px_rgba(0,0,0,0.25),0_10px_20px_-5px_rgba(0,0,0,0.1),0_0_60px_-10px_rgba(255,107,53,0.1)] dark:shadow-[0_30px_80px_-10px_rgba(0,0,0,0.6),0_10px_20px_-5px_rgba(0,0,0,0.3),0_0_60px_-10px_rgba(255,107,53,0.15)]" />
//                   <div className="absolute inset-0 rounded-[3rem] border border-white/40 dark:border-white/10" />
//                   <div className="absolute inset-[1.5px] rounded-[2.85rem] border border-black/10 dark:border-black/30" />
//                   <div className="absolute inset-[3px] bg-[#f5f2ee] dark:bg-[#0a0a0a] rounded-[2.7rem] overflow-hidden">
//                     <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b35]/[0.06] via-transparent to-[#ff6b35]/[0.03] dark:from-[#ff6b35]/[0.04] dark:to-transparent" />
//                   </div>
//                   <PhoneChrome />
//                   {/* Side buttons */}
//                   <div className="absolute top-[130px] -right-[3px] w-[3px] h-[50px] bg-gradient-to-b from-[#b8b5b0] to-[#a8a5a0] dark:from-[#4a4a4c] dark:to-[#3a3a3c] rounded-r-full shadow-sm" />
//                   <div className="absolute top-[80px] -left-[3px] w-[3px] h-[18px] bg-gradient-to-b from-[#b8b5b0] to-[#a8a5a0] dark:from-[#4a4a4c] dark:to-[#3a3a3c] rounded-l-full shadow-sm" />
//                   <div className="absolute top-[115px] -left-[3px] w-[3px] h-[35px] bg-gradient-to-b from-[#b8b5b0] to-[#a8a5a0] dark:from-[#4a4a4c] dark:to-[#3a3a3c] rounded-l-full shadow-sm" />
//                   <div className="absolute top-[158px] -left-[3px] w-[3px] h-[35px] bg-gradient-to-b from-[#b8b5b0] to-[#a8a5a0] dark:from-[#4a4a4c] dark:to-[#3a3a3c] rounded-l-full shadow-sm" />

//                   {/* ── Light Sweep on Glass ── */}
//                   <div className="absolute inset-[3px] rounded-[2.7rem] overflow-hidden pointer-events-none z-[5]">
//                     <motion.div
//                       animate={{ x: ["-100%", "300%"] }}
//                       transition={{ duration: 6, repeat: Infinity, repeatDelay: 5, ease: EASE }}
//                       className="absolute inset-0"
//                       style={{
//                         background:
//                           "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.03) 42%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 58%, transparent 70%)",
//                       }}
//                     />
//                   </div>
//                 </motion.div>

//                 {/* ── Card Stack ── */}
//                 <motion.div
//                   animate={{
//                     scale: isPhone ? 0.6 : 1,
//                     y: isPhone ? 50 : 0,
//                   }}
//                   transition={{ type: "spring", stiffness: 80, damping: 22 }}
//                   className="relative z-10"
//                   style={{
//                     width: cardW,
//                     left: "50%",
//                     marginLeft: -(cardW / 2),
//                     transformOrigin: "top center",
//                   }}
//                 >
//                   <div
//                     className="relative w-full"
//                     style={{ height: isStacked ? totalStackHeight : totalListHeight }}
//                   >
//                     {currencies.map((curr, idx) => (
//                       <motion.div
//                         key={curr.id}
//                         initial={{ opacity: 0, y: 150 }}
//                         animate={{
//                           y: getCardY(idx),
//                           scale: isStacked ? 1 - idx * 0.025 : 1,
//                           opacity: 1,
//                         }}
//                         transition={{
//                           duration: isStacked ? 1.2 : 0.9,
//                           delay: stage === "list" ? idx * 0.15 : idx * 0.05,
//                           ease: EASE,
//                         }}
//                         className="absolute top-0 left-0 w-full"
//                         style={{ zIndex: currencies.length - idx }}
//                       >
//                         <div
//                           className={`
//                             relative overflow-hidden
//                             bg-white/80 dark:bg-white/[0.06] backdrop-blur-2xl rounded-[2rem] p-6 md:p-8
//                             border border-white/60 dark:border-white/[0.08]
//                             transition-all duration-700
//                             ${
//                               isStacked && idx === 0
//                                 ? "shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,107,53,0.05)] dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,107,53,0.1)]"
//                                 : "shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] dark:shadow-none"
//                             }
//                           `}
//                         >
//                           <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent" />
//                           {idx === 0 && (
//                             <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-[#ff6b35]/[0.04] dark:from-[#ff6b35]/[0.06] to-transparent rounded-[2rem] pointer-events-none" />
//                           )}
//                           <div className="flex items-center gap-2 mb-2">
//                             <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center">
//                               {curr.flag ? (
//                                 <span className="text-lg">{curr.flag}</span>
//                               ) : (
//                                 <Globe size={16} className="text-black/40 dark:text-white/70" />
//                               )}
//                             </div>
//                             <span className="text-black/80 dark:text-white/90 font-medium text-sm flex items-center gap-1">
//                               {curr.title}
//                               {curr.id === 1 && (
//                                 <ChevronDown size={14} className="opacity-40" />
//                               )}
//                             </span>
//                           </div>
//                           <div className="text-black dark:text-white text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
//                             <AnimatedAmount
//                               symbol={curr.symbol}
//                               amount={curr.amount}
//                               delay={0.3 + idx * 0.25}
//                               start={true}
//                             />
//                           </div>
//                           {idx === 0 && isPhone && !isTradingOrReceipt && (
//                             <div className="flex items-center gap-2 mt-4">
//                               <button className="bg-[#ff6b35] text-white font-semibold py-2 px-5 rounded-full flex items-center gap-1.5 text-xs shadow-md">
//                                 + Buy Crypto
//                               </button>
//                               <button className="bg-black/5 dark:bg-white/20 text-black/70 dark:text-white font-medium py-2 px-5 rounded-full flex items-center gap-1.5 text-xs border border-black/[0.06] dark:border-white/10">
//                                 &rarr; Trade P2P
//                               </button>
//                             </div>
//                           )}
//                         </div>
//                       </motion.div>
//                     ))}
//                   </div>
//                 </motion.div>

//                 {/* ── Phone Inner Content — Transactions + Nav ── */}
//                 <AnimatePresence>
//                   {isPhone && !isTradingOrReceipt && (
//                     <>
//                       <motion.div
//                         initial={{ opacity: 0, y: 30 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: 0.8, duration: 0.8, ease: EASE }}
//                         className="absolute left-3 right-3 z-10"
//                         style={{ top: 220 }}
//                       >
//                         <div className="bg-white dark:bg-white/[0.08] rounded-2xl p-3 shadow-lg dark:shadow-none dark:border dark:border-white/[0.06]">
//                           <div className="flex items-center justify-between mb-2">
//                             <span className="text-[11px] font-semibold text-gray-900 dark:text-white">
//                               Transactions
//                             </span>
//                             <span className="text-[10px] font-semibold text-[#ff6b35]">
//                               See all &gt;
//                             </span>
//                           </div>
//                           <p className="text-[9px] text-gray-400 dark:text-gray-500 mb-1.5">
//                             Today
//                           </p>
//                           {transactions.map((tx, i) => (
//                             <div
//                               key={i}
//                               className={`flex items-center justify-between py-2 ${
//                                 i < transactions.length - 1
//                                   ? "border-b border-gray-100 dark:border-white/[0.06]"
//                                   : ""
//                               }`}
//                             >
//                               <div className="flex items-center gap-2">
//                                 <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center">
//                                   <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-white/20" />
//                                 </div>
//                                 <div>
//                                   <p className="text-[10px] font-medium text-gray-900 dark:text-white leading-tight">
//                                     {tx.name}
//                                   </p>
//                                   <p className="text-[8px] text-gray-400 dark:text-gray-500">
//                                     {tx.time}
//                                   </p>
//                                 </div>
//                               </div>
//                               <span className="text-[10px] font-semibold text-gray-900 dark:text-white">
//                                 {tx.amount}{" "}
//                                 <span className="text-gray-400 dark:text-gray-500 font-normal text-[9px]">
//                                   {tx.currency}
//                                 </span>
//                               </span>
//                             </div>
//                           ))}
//                         </div>
//                       </motion.div>

//                       <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: 1, duration: 0.8, ease: EASE }}
//                         className="absolute bottom-3 left-3 right-3 z-10"
//                       >
//                         <BottomNav activeTab="Home" />
//                       </motion.div>
//                     </>
//                   )}
//                 </AnimatePresence>

//                 {/* ── Trading Screen ── */}
//                 <AnimatePresence>
//                   {stage === "trading" && (
//                     <motion.div
//                       initial={{ opacity: 0, scale: 0.92, filter: "blur(6px)" }}
//                       animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
//                       exit={{ opacity: 0, scale: 0.95 }}
//                       transition={{ duration: 1, ease: EASE }}
//                       className="absolute inset-[3px] rounded-[2.7rem] z-40 overflow-hidden bg-white dark:bg-[#0a0a0a]"
//                     >
//                       <PhoneChrome inset />

//                       <div className="pt-[48px] px-4 pb-14 h-full overflow-hidden">
//                         <motion.div
//                           initial={{ opacity: 0, y: 10 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           transition={{ delay: 0.3, duration: 0.6 }}
//                           className="flex items-center justify-between mb-3"
//                         >
//                           <div className="flex items-center gap-1.5">
//                             <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-[8px] font-bold text-gray-500 dark:text-white/60">
//                               G
//                             </div>
//                             <div>
//                               <p className="text-[9px] font-semibold text-gray-900 dark:text-white leading-none">
//                                 goravesearchlab
//                               </p>
//                               <p className="text-[7px] text-gray-400 dark:text-white/40 font-mono">
//                                 MQu6b5...TQeK
//                               </p>
//                             </div>
//                           </div>
//                           <div className="flex items-center gap-1.5">
//                             <div className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-neutral-800 flex items-center justify-center">
//                               <span className="text-[8px] text-gray-500 dark:text-white/50">
//                                 {"\u{1F4AC}"}
//                               </span>
//                             </div>
//                             <div className="flex items-center gap-1 bg-gray-100 dark:bg-neutral-800 rounded-full px-2 py-1">
//                               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
//                               <span className="text-[9px] font-semibold text-gray-900 dark:text-white">
//                                 4,847
//                               </span>
//                             </div>
//                           </div>
//                         </motion.div>

//                         <motion.div
//                           initial={{ opacity: 0, y: 20 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           transition={{ delay: 0.5, duration: 0.7 }}
//                           className="bg-gray-50 dark:bg-neutral-900 rounded-2xl p-3 border border-gray-200 dark:border-white/[0.04]"
//                         >
//                           <div className="flex items-center justify-between mb-3">
//                             <span className="text-[11px] font-bold text-gray-900 dark:text-white">
//                               Trade
//                             </span>
//                             <TradingBuySellToggle />
//                           </div>

//                           <div className="bg-gray-100 dark:bg-neutral-800/60 rounded-xl p-2.5 mb-1">
//                             <div className="flex items-center justify-between mb-1">
//                               <span className="text-[8px] text-gray-400 dark:text-white/40">
//                                 You pay
//                               </span>
//                               <span className="text-[8px] text-gray-400 dark:text-white/40">
//                                 Balance: 4,847.20 USDT
//                               </span>
//                             </div>
//                             <div className="flex items-center justify-between">
//                               <TradingAmountTyping />
//                               <div className="flex items-center gap-1 bg-gray-200 dark:bg-neutral-700/50 rounded-full px-2 py-0.5">
//                                 <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center">
//                                   <span className="text-[6px] font-bold text-white">T</span>
//                                 </div>
//                                 <span className="text-[9px] font-medium text-gray-900 dark:text-white">
//                                   USDT
//                                 </span>
//                               </div>
//                             </div>
//                           </div>

//                           <div className="flex justify-center -my-1 relative z-10">
//                             <div className="w-6 h-6 rounded-lg bg-gray-200 dark:bg-neutral-700 border border-gray-300 dark:border-neutral-600 flex items-center justify-center">
//                               <span className="text-[10px] text-gray-500 dark:text-white/60">
//                                 {"\u21C5"}
//                               </span>
//                             </div>
//                           </div>

//                           <div className="bg-gray-100 dark:bg-neutral-800/60 rounded-xl p-2.5 mt-1 mb-2">
//                             <div className="flex items-center justify-between mb-1">
//                               <span className="text-[8px] text-gray-400 dark:text-white/40">
//                                 You receive
//                               </span>
//                               <span className="text-[8px] text-gray-400 dark:text-white/40">
//                                 Rate: 1 USDC = 3.67 AED
//                               </span>
//                             </div>
//                             <div className="flex items-center justify-between">
//                               <span className="text-[14px] font-bold text-gray-300 dark:text-white/30">
//                                 0 {"\u062F.\u0625"}
//                               </span>
//                               <div className="flex items-center gap-1 bg-gray-200 dark:bg-neutral-700/50 rounded-full px-2 py-0.5">
//                                 <span className="text-[8px]">{"\u{1F1E6}\u{1F1EA}"}</span>
//                                 <span className="text-[9px] font-medium text-gray-900 dark:text-white">
//                                   AED
//                                 </span>
//                               </div>
//                             </div>
//                           </div>

//                           <div className="flex items-center justify-between mb-2">
//                             <span className="text-[8px] text-gray-400 dark:text-white/40">
//                               Pay via
//                             </span>
//                             <div className="flex items-center gap-1">
//                               <div className="bg-black/[0.06] dark:bg-white/10 rounded-full px-2.5 py-0.5 border border-black/[0.08] dark:border-white/10">
//                                 <span className="text-[8px] text-gray-900 dark:text-white font-medium">
//                                   {"\u{1F3E6}"} Bank
//                                 </span>
//                               </div>
//                               <div className="bg-transparent rounded-full px-2.5 py-0.5">
//                                 <span className="text-[8px] text-gray-400 dark:text-white/40">
//                                   {"\u{1F4B5}"} Cash
//                                 </span>
//                               </div>
//                             </div>
//                           </div>

//                           <div className="mb-3">
//                             <span className="text-[8px] text-gray-400 dark:text-white/40 block mb-1.5">
//                               Matching priority
//                             </span>
//                             <div className="flex gap-1">
//                               <div className="flex-1 bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 rounded-lg py-1.5 text-center">
//                                 <span className="text-[8px] font-semibold text-emerald-600 dark:text-emerald-400">
//                                   Fastest
//                                 </span>
//                               </div>
//                               <div className="flex-1 bg-gray-100 dark:bg-neutral-800 rounded-lg py-1.5 text-center">
//                                 <span className="text-[8px] text-gray-500 dark:text-white/50">
//                                   Best rate
//                                 </span>
//                               </div>
//                               <div className="flex-1 bg-gray-100 dark:bg-neutral-800 rounded-lg py-1.5 text-center">
//                                 <span className="text-[8px] text-gray-500 dark:text-white/50">
//                                   Cheapest
//                                 </span>
//                               </div>
//                             </div>
//                           </div>

//                           <div className="relative">
//                             <motion.div
//                               initial={{ opacity: 0.4 }}
//                               animate={{ opacity: 1 }}
//                               transition={{ delay: 1.5, duration: 0.4 }}
//                               className="w-full py-2.5 rounded-xl text-center relative overflow-hidden"
//                             >
//                               <motion.div
//                                 className="absolute inset-0 rounded-xl"
//                                 initial={{ backgroundColor: "rgb(64,64,64)" }}
//                                 animate={{
//                                   backgroundColor: [
//                                     "rgb(64,64,64)",
//                                     "rgb(16,185,129)",
//                                     "rgb(16,185,129)",
//                                     "rgb(16,185,129)",
//                                   ],
//                                   scale: [1, 1, 1, 0.93],
//                                   boxShadow: [
//                                     "0 0 0 0 rgba(16,185,129,0)",
//                                     "0 0 0 0 rgba(16,185,129,0)",
//                                     "0 0 24px 4px rgba(16,185,129,0.25)",
//                                     "0 0 0 0 rgba(16,185,129,0)",
//                                   ],
//                                 }}
//                                 transition={{
//                                   delay: 1.5,
//                                   duration: 1.2,
//                                   times: [0, 0.25, 0.7, 1],
//                                 }}
//                               />
//                               <motion.div
//                                 className="absolute inset-0 m-auto w-6 h-6 rounded-full bg-white/40"
//                                 initial={{ scale: 0, opacity: 0 }}
//                                 animate={{ scale: [0, 3], opacity: [0.6, 0] }}
//                                 transition={{ delay: 2.5, duration: 0.5, ease: "easeOut" }}
//                               />
//                               <motion.span
//                                 className="relative z-10 text-[10px] font-semibold"
//                                 initial={{ color: "rgba(255,255,255,0.4)" }}
//                                 animate={{
//                                   color: [
//                                     "rgba(255,255,255,0.4)",
//                                     "rgba(255,255,255,1)",
//                                     "rgba(255,255,255,1)",
//                                   ],
//                                 }}
//                                 transition={{ delay: 1.5, duration: 0.7, times: [0, 0.3, 1] }}
//                               >
//                                 Continue
//                               </motion.span>
//                             </motion.div>

//                             <motion.div
//                               initial={{ opacity: 0, scale: 0.4, y: 15, x: 5 }}
//                               animate={{
//                                 opacity: [0, 0, 1, 1, 1, 0.8, 0],
//                                 scale: [0.4, 0.4, 1, 1, 0.8, 0.8, 0.4],
//                                 y: [15, 15, 0, 0, 3, 3, -5],
//                                 x: [5, 5, 0, 0, 0, 0, 0],
//                               }}
//                               transition={{
//                                 delay: 1.8,
//                                 duration: 1.6,
//                                 times: [0, 0.05, 0.25, 0.55, 0.65, 0.85, 1],
//                                 ease: EASE,
//                               }}
//                               className="absolute -bottom-10 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
//                             >
//                               <FingerCursor size={42} />
//                             </motion.div>
//                           </div>

//                           <p className="text-center mt-2">
//                             <span className="text-[7px] text-gray-400 dark:text-white/30">
//                               Have a large amount?{" "}
//                             </span>
//                             <span className="text-[7px] text-gray-600 dark:text-white/60 font-semibold">
//                               Create an offer
//                             </span>
//                           </p>
//                         </motion.div>
//                       </div>

//                       <motion.div
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: 0.8, duration: 0.6 }}
//                         className="absolute bottom-3 left-3 right-3 z-10"
//                       >
//                         <BottomNav activeTab="Markets" />
//                       </motion.div>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>

//                 {/* ── Receipt Screen ── */}
//                 <AnimatePresence>
//                   {isReceipt && (
//                     <motion.div
//                       initial={{ opacity: 0, scale: 0.92, filter: "blur(6px)" }}
//                       animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
//                       exit={{ opacity: 0 }}
//                       transition={{ duration: 1, ease: EASE }}
//                       className="absolute inset-[3px] rounded-[2.7rem] z-40 overflow-hidden bg-white dark:bg-[#0a0a0a]"
//                     >
//                       <PhoneChrome time="20:23" inset />
//                       <OrderReceiptScreen />
//                       <motion.div
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: 0.4, duration: 0.6 }}
//                         className="absolute bottom-3 left-3 right-3 z-10"
//                       >
//                         <BottomNav activeTab="Markets" />
//                       </motion.div>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </motion.div>
//             </motion.div>
//           </div>
//         </div>
//       </motion.div>

//       {/* ── Protocol Lock Shot ── */}
//       <ProtocolLockShot show={showProtocolLock} />

//       {/* ── Micro-Proof Overlay Chips ── */}
//       <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-[38] flex flex-col items-center gap-1.5 pointer-events-none">
//         {/* phone stage */}
//         <TimedChip show={isPhone && !isTradingOrReceipt && !isUnwrapStage} delayMs={1200} durationMs={1800} label="Non-custodial wallet" subline="You control funds." />
//         {/* instantBidding stage */}
//         <TimedChip show={isInstantBidding} delayMs={600} durationMs={1800} label="Merchant liquidity engine" subline="Bids compete for your order." />
//         <RateChip show={isInstantBidding} delayMs={1000} />
//         {/* verified stage */}
//         <TimedChip show={isVerified} delayMs={800} durationMs={2000} label="On-chain audit trail" subline="Every step verifiable." />
//         <TimedChip show={isVerified} delayMs={1600} durationMs={1800} label="View on BlipScan" />
//       </div>

//       {/* ── Cinematic Timeline ── */}
//       <motion.div
//         animate={{
//           opacity: isFinale ? 0 : 0.6,
//           y: isFinale ? 10 : 0,
//         }}
//         transition={{ duration: 1.2 }}
//         className="absolute bottom-8 left-6 md:left-10 z-40"
//       >
//         <div className="flex items-center gap-0 bg-white/40 dark:bg-white/[0.03] backdrop-blur-xl rounded-full px-2.5 py-1.5 border border-black/[0.03] dark:border-white/[0.04]">
//           {[
//             { key: "list", label: "Assets" },
//             { key: "stacked", label: "Protocol" },
//             { key: "phone", label: "Wallet" },
//             { key: "trading", label: "Trade" },
//             { key: "instantBidding", label: "Match" },
//             { key: "verified", label: "Verify" },
//             { key: "receipt", label: "Settle" },
//           ].map((step, i, arr) => {
//             const currentIdx = STAGE_ORDER.indexOf(stage);
//             const stepIdx = STAGE_ORDER.indexOf(step.key as Stage);
//             const isActive = step.key === stage;
//             const isPast = stepIdx < currentIdx;
//             return (
//               <div key={step.key} className="flex items-center">
//                 <div className="flex flex-col items-center gap-0.5 relative">
//                   <motion.div
//                     animate={{
//                       backgroundColor: isActive || isPast ? "#ff6b35" : "rgba(128,128,128,0.12)",
//                       scale: isActive ? 1.3 : 1,
//                     }}
//                     transition={{ duration: 0.4 }}
//                     className="w-1.5 h-1.5 rounded-full flex-shrink-0"
//                   />
//                   <motion.span
//                     animate={{ opacity: isActive ? 0.8 : isPast ? 0.4 : 0.15 }}
//                     transition={{ duration: 0.3 }}
//                     className="text-[6px] font-medium text-black dark:text-white tracking-wider whitespace-nowrap uppercase"
//                   >
//                     {step.label}
//                   </motion.span>
//                 </div>
//                 {i < arr.length - 1 && (
//                   <motion.div
//                     animate={{
//                       backgroundColor: isPast ? "rgba(255,107,53,0.4)" : "rgba(128,128,128,0.08)",
//                     }}
//                     transition={{ duration: 0.4 }}
//                     className="h-[1px] w-3 sm:w-4 md:w-6 mx-0.5 -mt-2.5 rounded-full"
//                   />
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </motion.div>

//       {/* ── Replay Button ── */}
//       <AnimatePresence>
//         {animDone && (
//           <motion.button
//             key="replay-btn"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 10 }}
//             transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
//             onClick={handleReplay}
//             className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-black/[0.06] dark:bg-white/[0.06] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.08] text-black/50 dark:text-white/50 hover:text-black/80 dark:hover:text-white/80 hover:bg-black/[0.1] dark:hover:bg-white/[0.1] text-xs font-semibold px-6 py-3 rounded-full hover:scale-105 transition-all duration-300"
//           >
//             <svg
//               width="14"
//               height="14"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2.5"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <path d="M1 4v6h6" />
//               <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
//             </svg>
//             Replay
//           </motion.button>
//         )}
//       </AnimatePresence>
//     </section>
//     </div>
//   );
// }
