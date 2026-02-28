import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Globe, ChevronDown, Check } from "lucide-react";
import { useTheme } from "next-themes";

import DashboardPreview from "../AdvancedDashboard/DashboardPreview";
import { MerchantHeroDashbaord } from "../MerchantDashboard";

/* ─── Floating Particles ─── */
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

const currencies = [
  {
    id: 1,
    title: "All accounts",
    amount: 4224.47,
    symbol: "€",
    icon: Globe,
  },
  {
    id: 2,
    title: "Euro",
    amount: 3414.32,
    symbol: "€",
    flag: "🇪🇺",
  },
  {
    id: 3,
    title: "British Pound",
    amount: 532.67,
    symbol: "£",
    flag: "🇬🇧",
  },
  {
    id: 4,
    title: "Polish Zloty",
    amount: 326.98,
    symbol: "zł",
    flag: "🇵🇱",
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
        setTimeout(() => setDone(true), 250);
      }
    }, 90);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <motion.p
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className="text-[28px] font-bold text-gray-900 dark:text-white tabular-nums"
      >
        {digits.slice(0, shown).join("")}
        {!done && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="text-[#ff6b35]"
          >
            |
          </motion.span>
        )}
        {shown === 0 && (
          <span className="text-gray-300 dark:text-gray-600">€0.00</span>
        )}
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
    <div className="flex items-center bg-gray-200 dark:bg-neutral-800 rounded-full p-0.5 relative">
      <motion.div
        className="absolute top-0.5 bottom-0.5 rounded-full"
        animate={{
          left: isBuy ? 2 : "50%",
          right: isBuy ? "50%" : 2,
          backgroundColor: isBuy ? "#10b981" : "#ef4444",
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
      <span
        className={`relative z-10 text-[9px] font-semibold px-3 py-0.5 ${isBuy ? "text-white" : "text-gray-500 dark:text-white/50"}`}
      >
        Buy
      </span>
      <span
        className={`relative z-10 text-[9px] font-semibold px-3 py-0.5 ${!isBuy ? "text-white" : "text-gray-500 dark:text-white/50"}`}
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

function AddMoneyScreen() {
  const [phase, setPhase] = useState<"input" | "receipt">("input");

  useEffect(() => {
    const timer = setTimeout(() => setPhase("receipt"), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="absolute top-[44px] left-[3px] right-[3px] bottom-[3px] rounded-t-2xl rounded-b-[2.7rem] z-40 overflow-hidden bg-white dark:bg-[#1a1a1a]"
    >
      <AnimatePresence mode="wait">
        {phase === "input" ? (
          <motion.div
            key="input-phase"
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="h-full"
          >
            <div className="pt-4 pb-4 px-5">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] text-gray-400 dark:text-gray-500">
                  Cancel
                </span>
                <span className="text-[12px] font-semibold text-gray-900 dark:text-white">
                  Add money
                </span>
                <div className="w-8" />
              </div>
              <div className="text-center mb-6">
                <AnimatedTypingAmount />
                <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-1">
                  EUR · Euro
                </p>
              </div>
            </div>

            <div className="px-4">
              <p className="text-[9px] text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-1">
                Choose method
              </p>
              {[
                {
                  icon: "💳",
                  label: "Debit / Credit Card",
                  sub: "Visa, Mastercard",
                },
                { icon: "🏦", label: "Bank Transfer", sub: "SEPA, SWIFT" },
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
                    delay: 0.3 + i * 0.07,
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`flex items-center gap-3 py-2.5 px-2 rounded-xl ${i < 3 ? "border-b border-gray-100 dark:border-white/[0.06]" : ""}`}
                >
                  <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center text-sm">
                    {method.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] font-medium text-gray-900 dark:text-white">
                      {method.label}
                    </p>
                    <p className="text-[9px] text-gray-400 dark:text-gray-500">
                      {method.sub}
                    </p>
                  </div>
                  <ChevronDown
                    size={12}
                    className="text-gray-300 dark:text-gray-600 -rotate-90"
                  />
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0.4, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.4 }}
              className="absolute bottom-6 left-4 right-4"
            >
              <motion.div
                initial={{ backgroundColor: "#d1d5db" }}
                animate={{
                  backgroundColor: ["#d1d5db", "#ff6b35", "#ff6b35", "#e55a2b"],
                  scale: [1, 1, 1, 0.96],
                }}
                transition={{
                  delay: 1.2,
                  duration: 0.6,
                  times: [0, 0.4, 0.85, 1],
                }}
                className="w-full py-3 rounded-2xl text-center"
              >
                <span className="text-white text-[11px] font-semibold">
                  Continue
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="receipt-phase"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="h-full flex flex-col pt-4 px-5"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] text-gray-400 dark:text-gray-500">
                Close
              </span>
              <span className="text-[12px] font-semibold text-gray-900 dark:text-white">
                Payment Receipt
              </span>
              <div className="w-8" />
            </div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.2,
                duration: 0.5,
                type: "spring",
                stiffness: 200,
              }}
              className="flex justify-center mb-3"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border-2 border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center">
                <Check size={24} className="text-emerald-500" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="text-center mb-4"
            >
              <p className="text-[14px] font-bold text-gray-900 dark:text-white">
                Payment Successful
              </p>
              <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">
                Money added to your EUR account
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="text-center mb-4"
            >
              <p className="text-[26px] font-bold text-gray-900 dark:text-white">
                €2,500.00
              </p>
              <p className="text-[9px] text-emerald-500 font-medium mt-1">
                + Added to balance
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className="bg-gray-50 dark:bg-white/[0.06] rounded-xl p-3 mb-3"
            >
              {[
                { label: "Method", value: "💳 Visa •••• 4821" },
                { label: "Reference", value: "#BLP-90124" },
                { label: "Date", value: "27 Feb 2026, 20:22" },
                { label: "Fee", value: "€0.00" },
                { label: "Status", value: "Completed", isStatus: true },
              ].map((item, i) => (
                <div
                  key={item.label}
                  className={`flex items-center justify-between py-1.5 ${i < 4 ? "border-b border-gray-200/60 dark:border-white/[0.06]" : ""}`}
                >
                  <span className="text-[9px] text-gray-800 dark:text-gray-500">
                    {item.label}
                  </span>
                  <span
                    className={`text-[9px] font-medium ${(item as { isStatus?: boolean }).isStatus ? "text-emerald-500" : "text-gray-700 dark:text-gray-300"}`}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.4 }}
              className="mt-auto pb-8"
            >
              <div className="w-full py-3 rounded-2xl bg-[#ff6b35] text-center">
                <span className="text-white text-[11px] font-semibold">
                  Done
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const orderTimelineSteps = [
  { label: "Order Created", time: "20:23:01" },
  { label: "Merchant Matched", time: "20:23:03" },
  { label: "Payment Pending", time: "20:23:05" },
  { label: "Payment Confirmed", time: "20:23:41" },
  { label: "Completed", time: "20:24:12" },
];

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
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="h-full flex flex-col"
    >
      <div className="pt-[46px] px-4 pb-3">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[9px] text-gray-400 dark:text-white/40 font-medium">← Back</span>
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
            <Check size={20} className="text-emerald-500 dark:text-emerald-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center mb-4"
        >
          <p className="text-[20px] font-bold text-gray-900 dark:text-white">5,000.00 USDT</p>
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <span className="text-[9px] text-gray-400 dark:text-white/40">→</span>
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
              className={`flex items-center justify-between py-1.5 ${i < 4 ? "border-b border-gray-200/60 dark:border-white/[0.04]" : ""}`}
            >
              <span className="text-[9px] text-black/70 dark:text-white/40">{item.label}</span>
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
                        i < activeStep ? "bg-emerald-500" : "bg-gray-300 dark:bg-white/[0.06]"
                      }`}
                    />
                  )}
                </div>
                <div className="pb-2">
                  <p
                    className={`text-[9px] font-medium leading-none ${
                      isActive ? "text-gray-900 dark:text-white" : "text-gray-300 dark:text-white/30"
                    }`}
                  >
                    {step.label}
                  </p>
                  <p
                    className={`text-[7px] mt-0.5 font-mono ${
                      isActive ? "text-gray-400 dark:text-white/40" : "text-gray-200 dark:text-white/15"
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

export default function PremiumFintechSection() {
  const [stage, setStage] = useState<
    "list" | "stacked" | "phone" | "addMoney" | "trading" | "receipt"
  >("list");
  const [animKey, setAnimKey] = useState(0);
  const [animDone, setAnimDone] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const hasAutoScrolled = useRef(false);
  const isInView = useInView(sectionRef, { once: true, margin: "-20%" });

  // Auto-scroll section to center when user scrolls 80% past the hero section above
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // Find the hero section (the previous sibling / CinematicHero)
    const heroEl = el.previousElementSibling as HTMLElement | null;
    if (!heroEl) return;

    const smoothScrollTo = (targetY: number, duration: number) => {
      const startY = window.scrollY;
      const diff = targetY - startY;
      const startTime = performance.now();

      const easeInOutCubic = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        window.scrollTo(0, startY + diff * easeInOutCubic(progress));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const handleScroll = () => {
      if (hasAutoScrolled.current) return;

      const heroRect = heroEl.getBoundingClientRect();
      const heroScrolled = -heroRect.top / heroRect.height;

      // Trigger when 80% of hero section has been scrolled past
      if (heroScrolled >= 0.8) {
        hasAutoScrolled.current = true;
        window.removeEventListener("scroll", handleScroll);

        // Calculate target: section centered in viewport
        const elRect = el.getBoundingClientRect();
        const targetY =
          window.scrollY +
          elRect.top -
          (window.innerHeight - elRect.height) / 2;

        smoothScrollTo(targetY, 1200);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isInView) return;
    setAnimDone(false);
    const t1 = setTimeout(() => setStage("stacked"), 1800);
    const t2 = setTimeout(() => setStage("phone"), 3200);
    const t3 = setTimeout(() => setStage("addMoney"), 5000);
    const t4 = setTimeout(() => setStage("trading"), 9000);
    const t5 = setTimeout(() => setStage("receipt"), 12500);
    const tDone = setTimeout(() => setAnimDone(true), 17000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(tDone);
    };
  }, [isInView, animKey]);

  const handleReplay = () => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setAnimDone(false);
    setStage("list");
    // Delay before restarting timers so layout settles
    setTimeout(() => {
      setAnimKey((k) => k + 1);
    }, 800);
  };

  const getCardY = (idx: number) => {
    if (
      stage === "stacked" ||
      stage === "phone" ||
      stage === "addMoney" ||
      stage === "trading" ||
      stage === "receipt"
    )
      return idx * STACK_OFFSET;
    return idx * (CARD_HEIGHT + LIST_GAP);
  };

  const totalListHeight =
    currencies.length * CARD_HEIGHT + (currencies.length - 1) * LIST_GAP;
  const totalStackHeight = CARD_HEIGHT + (currencies.length - 1) * STACK_OFFSET;

  const isTrading = stage === "trading";
  const isReceipt = stage === "receipt";
  const isTradingOrReceipt = isTrading || isReceipt;
  const isPhone =
    stage === "phone" || stage === "addMoney" || isTradingOrReceipt;
  const isStacked =
    stage === "stacked" ||
    stage === "phone" ||
    stage === "addMoney" ||
    isTradingOrReceipt;

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#FAF8F5] dark:bg-black overflow-hidden"
      style={{ height: "100vh" }}
    >
      {/* Animated Mesh Gradient Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Primary orange blob — top-left, drifts */}
        <motion.div
          animate={{
            scale: isStacked ? 1.6 : 1,
            opacity: isStacked ? 0.5 : 0.25,
            x: isPhone ? 60 : 0,
            y: isPhone ? 40 : 0,
          }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
          className="absolute top-[-15%] left-[-15%] w-[65%] h-[65%]  dark:bg-[#ff6b35]/12 rounded-full blur-[160px]"
        />
        {/* Secondary cool blob — bottom-right */}
        <motion.div
          animate={{
            scale: isStacked ? 1.4 : 1,
            opacity: isStacked ? 0.3 : 0.12,
            x: isPhone ? -40 : 0,
            y: isPhone ? -30 : 0,
          }}
          transition={{ duration: 2.5, delay: 0.3, ease: "easeInOut" }}
          className="absolute bottom-[-15%] right-[-15%] w-[55%] h-[55%] bg-violet-500/10 dark:bg-violet-500/8 rounded-full blur-[160px]"
        />
        {/* Tertiary accent blob — center, appears on phone stage */}
        <motion.div
          animate={{
            opacity: isPhone ? 0.2 : 0,
            scale: isPhone ? 1.2 : 0.8,
          }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-[#ff6b35]/15 dark:bg-[#ff6b35]/8 rounded-full blur-[180px]"
        />
        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Noise texture overlay for premium grain */}
      <div
        className="absolute inset-0 pointer-events-none z-[2] opacity-[0.025] dark:opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* Floating particles */}
      <FloatingParticles count={24} isActive={isInView} />

      {/* Bottom Fade Gradient — list & stacked stages */}
      <AnimatePresence>
        {(stage === "list" || stage === "stacked") && (
          <motion.div
            key="bottom-fade"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute bottom-0 left-0 right-0 h-[40%] z-30 pointer-events-none bg-gradient-to-t from-[#FAF8F5] via-[#FAF8F5]/80 dark:from-black dark:via-black/80 to-transparent"
          />
        )}
      </AnimatePresence>

      {/* Content wrapper */}
      <div
        className={`h-full flex justify-center px-4 sm:px-6 md:px-20 overflow-hidden ${isPhone ? "items-center py-10 sm:py-20" : "items-start pt-16 sm:pt-28 mt-8 sm:mt-16 md:pt-32"}`}
      >
        <div className="relative w-full max-w-6xl flex items-center justify-center">
          {/* Left Text — phone/addMoney stages */}
          <AnimatePresence>
            {isPhone && !isTradingOrReceipt && (
              <motion.div
                key="left-text"
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="hidden md:block absolute left-0 max-w-sm z-10"
              >
                <div className="w-16 h-[1px] bg-gradient-to-r from-[#ff6b35]/60 to-transparent mb-8" />
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight font-display bg-gradient-to-br from-black via-black/80 to-black/50 dark:from-white dark:via-white/80 dark:to-white/40 bg-clip-text text-transparent">
                  Move your money
                  <br />
                  across Europe
                </h3>
                <p className="text-black/50 dark:text-white/50 text-base md:text-lg mt-4 max-w-xs">
                  Send money anywhere in the EU, effortlessly.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Merchant Dashboard — trading & receipt stages */}
          <AnimatePresence>
            {isTradingOrReceipt && (
              <motion.div
                key="merchant-dashboard"
                initial={{
                  opacity: 0,
                  x: -100,
                  scale: 0.9,
                  filter: "blur(10px)",
                }}
                animate={{
                  opacity: isReceipt ? 0 : 1,
                  x: isReceipt ? -200 : 0,
                  scale: isReceipt ? 0.85 : 1,
                  filter: isReceipt ? "blur(12px)" : "blur(0px)",
                }}
                exit={{
                  opacity: 0,
                  x: -200,
                  scale: 0.85,
                  filter: "blur(12px)",
                }}
                transition={{
                  duration: 1.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="hidden lg:flex flex-col absolute left-0 top-1/2 -translate-y-1/2 w-[42%] z-10"
              >
                <div className="mb-4">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-black/40 dark:text-white/40 mb-1 font-medium">
                    Merchant
                  </p>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-black dark:text-white tracking-tight font-display">
                    Merchant Dashboard
                  </h3>
                </div>
                <MerchantHeroDashbaord />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Center Content — slides right for trading, back to center for receipt */}
          <motion.div
            animate={{
              x: isTrading ? 140 : 0,
            }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
          >
            {/* Heading — per stage */}
            <motion.div
              animate={{
                height: isPhone && !isTradingOrReceipt ? 0 : "auto",
                opacity: isPhone && !isTradingOrReceipt ? 0 : 1,
                marginBottom:
                  isPhone && !isTradingOrReceipt
                    ? 0
                    : isTradingOrReceipt
                      ? 16
                      : 40,
              }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {stage === "list" && (
                  <motion.h2
                    key="list-title"
                    initial={{ opacity: 0, y: 60 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight font-display text-center bg-gradient-to-br from-black via-black/80 to-black/50 dark:from-white dark:via-white/80 dark:to-white/40 bg-clip-text text-transparent"
                  >
                    All currencies
                  </motion.h2>
                )}
                {stage === "stacked" && (
                  <motion.h2
                    key="stacked-title"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight font-display text-center bg-gradient-to-br from-black via-black/80 to-[#ff6b35]/70 dark:from-white dark:via-white/80 dark:to-[#ff6b35]/70 bg-clip-text text-transparent"
                  >
                    One App
                  </motion.h2>
                )}
                {isTradingOrReceipt && (
                  <motion.div
                    key="user-title"
                    initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{
                      duration: 0.8,
                      delay: 0.2,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="text-center"
                  >
                    <p className="text-[11px] uppercase tracking-[0.3em] text-black/40 dark:text-white/40 mb-1 font-medium">
                      User
                    </p>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-black dark:text-white tracking-tight font-display">
                      {stage === "trading" ? "Placing Order" : "Order Complete"}
                    </h3>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Cards + Phone wrapper */}
            <motion.div
              animate={{
                width: isPhone
                  ? Math.min(
                      290,
                      typeof window !== "undefined"
                        ? window.innerWidth - 60
                        : 290,
                    )
                  : Math.min(
                      420,
                      typeof window !== "undefined"
                        ? window.innerWidth - 48
                        : 420,
                    ),
                height: isPhone
                  ? Math.min(
                      600,
                      typeof window !== "undefined"
                        ? window.innerHeight * 0.7
                        : 600,
                    )
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
              {/* Glowing halo behind phone */}
              <motion.div
                initial={false}
                animate={{
                  opacity: isPhone ? 1 : 0,
                  scale: isPhone ? 1 : 0.8,
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-[-40px] z-[-1] pointer-events-none"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[#ff6b35]/20 via-[#ff6b35]/5 to-transparent dark:from-[#ff6b35]/15 dark:via-[#ff6b35]/5 dark:to-transparent rounded-[4rem] blur-[40px]" />
                <motion.div
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{
                    duration: 3,
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
                }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-[-4px] z-0 pointer-events-none"
              >
                {/* Titanium bezel */}
                <div className="w-full h-full bg-gradient-to-b from-[#d8d5d0] via-[#c8c5c0] to-[#bab7b2] dark:from-[#48484a] dark:via-[#3a3a3c] dark:to-[#2c2c2e] rounded-[3rem] shadow-[0_30px_80px_-10px_rgba(0,0,0,0.25),0_10px_20px_-5px_rgba(0,0,0,0.1),0_0_60px_-10px_rgba(255,107,53,0.1)] dark:shadow-[0_30px_80px_-10px_rgba(0,0,0,0.6),0_10px_20px_-5px_rgba(0,0,0,0.3),0_0_60px_-10px_rgba(255,107,53,0.15)]" />
                {/* Outer bezel highlight */}
                <div className="absolute inset-0 rounded-[3rem] border border-white/40 dark:border-white/10" />
                {/* Inner bezel ring */}
                <div className="absolute inset-[1.5px] rounded-[2.85rem] border border-black/10 dark:border-black/30" />
                {/* Inner screen */}
                <div className="absolute inset-[3px] bg-[#f5f2ee] dark:bg-[#0a0a0a] rounded-[2.7rem] overflow-hidden">
                  {/* Subtle screen wallpaper gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b35]/[0.06] via-transparent to-[#ff6b35]/[0.03] dark:from-[#ff6b35]/[0.04] dark:to-transparent" />
                </div>
                {/* Status bar — aligned with dynamic island */}
                <div className="absolute top-[16px] left-[6px] right-[6px] z-20 flex items-center justify-between px-5 h-[20px]">
                  <span className="text-black/80 dark:text-white text-[9px] font-semibold">
                    20:22
                  </span>
                  <div className="w-[100px]" />
                  <div className="flex items-center gap-1.5">
                    <svg
                      width="14"
                      height="10"
                      viewBox="0 0 14 10"
                      className="text-black/60 dark:text-white"
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
                    <svg
                      width="12"
                      height="10"
                      viewBox="0 0 12 10"
                      className="text-black/60 dark:text-white"
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
                    <div className="flex items-center">
                      <div className="w-[18px] h-[9px] border border-black/40 dark:border-white/80 rounded-[2px] flex items-center p-[1px]">
                        <div className="w-[70%] h-full bg-black/60 dark:bg-white rounded-[1px]" />
                      </div>
                      <div className="w-[1.5px] h-[4px] bg-black/40 dark:bg-white/80 rounded-r-full ml-[0.5px]" />
                    </div>
                  </div>
                </div>
                {/* Dynamic Island */}
                <div className="absolute top-[12px] left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-black rounded-full z-30" />
                {/* Side buttons — power (right), volume + silent (left) */}
                <div className="absolute top-[130px] -right-[3px] w-[3px] h-[50px] bg-gradient-to-b from-[#b8b5b0] to-[#a8a5a0] dark:from-[#4a4a4c] dark:to-[#3a3a3c] rounded-r-full shadow-sm" />
                <div className="absolute top-[80px] -left-[3px] w-[3px] h-[18px] bg-gradient-to-b from-[#b8b5b0] to-[#a8a5a0] dark:from-[#4a4a4c] dark:to-[#3a3a3c] rounded-l-full shadow-sm" />
                <div className="absolute top-[115px] -left-[3px] w-[3px] h-[35px] bg-gradient-to-b from-[#b8b5b0] to-[#a8a5a0] dark:from-[#4a4a4c] dark:to-[#3a3a3c] rounded-l-full shadow-sm" />
                <div className="absolute top-[158px] -left-[3px] w-[3px] h-[35px] bg-gradient-to-b from-[#b8b5b0] to-[#a8a5a0] dark:from-[#4a4a4c] dark:to-[#3a3a3c] rounded-l-full shadow-sm" />
              </motion.div>

              {/* Card stack */}
              <motion.div
                animate={{
                  scale: isPhone ? 0.6 : 1,
                  y: isPhone ? 50 : 0,
                }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10"
                style={{
                  width: Math.min(
                    420,
                    typeof window !== "undefined"
                      ? window.innerWidth - 48
                      : 420,
                  ),
                  left: "50%",
                  marginLeft: -(
                    Math.min(
                      420,
                      typeof window !== "undefined"
                        ? window.innerWidth - 48
                        : 420,
                    ) / 2
                  ),
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
                        {/* Shimmer highlight — top edge */}
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-white/20 to-transparent" />
                        {/* Inner glow on first card */}
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
                              + Add money
                            </button>
                            <button className="bg-black/5 dark:bg-white/20 text-black/70 dark:text-white font-medium py-2 px-5 rounded-full flex items-center gap-1.5 text-xs border border-black/[0.06] dark:border-white/10">
                              → Send
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Phone inner content — transactions + bottom nav */}
              <AnimatePresence>
                {isPhone && !isTradingOrReceipt && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.8,
                        duration: 0.8,
                        ease: [0.22, 1, 0.36, 1],
                      }}
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

                    {/* Bottom Navigation — trading app style */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 1,
                        duration: 0.8,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="absolute bottom-3 left-3 right-3 z-10"
                    >
                      <div className="bg-white/90 dark:bg-[#111]/90 backdrop-blur-xl rounded-2xl px-4 py-2.5 flex items-center justify-around border border-black/[0.06] dark:border-white/[0.06] shadow-lg dark:shadow-none">
                        {[
                          { icon: "🏠", label: "Home", active: true },
                          { icon: "📊", label: "Markets", active: false },
                          { icon: "💰", label: "Wallet", active: false },
                          { icon: "👤", label: "Profile", active: false },
                        ].map((tab) => (
                          <div
                            key={tab.label}
                            className="flex flex-col items-center gap-0.5"
                          >
                            <span
                              className={`text-[12px] ${tab.active ? "" : "opacity-40"}`}
                            >
                              {tab.icon}
                            </span>
                            <span
                              className={`text-[7px] font-medium ${tab.active ? "text-[#ff6b35]" : "text-black/40 dark:text-white/30"}`}
                            >
                              {tab.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              {/* Add Money Screen */}
              <AnimatePresence>
                {stage === "addMoney" && <AddMoneyScreen />}
              </AnimatePresence>

              {/* Trading Screen */}
              <AnimatePresence>
                {stage === "trading" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92, filter: "blur(6px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-[3px] rounded-[2.7rem] z-40 overflow-hidden bg-white dark:bg-[#0a0a0a]"
                  >
                    {/* Status bar — aligned with dynamic island */}
                    <div className="absolute top-[14px] left-[3px] right-[3px] z-50 flex items-center justify-between px-5 h-[20px]">
                      <span className="text-black/80 dark:text-white text-[9px] font-semibold">
                        20:22
                      </span>
                      <div className="w-[100px]" />
                      <div className="flex items-center gap-1.5">
                        <svg
                          width="14"
                          height="10"
                          viewBox="0 0 14 10"
                          className="text-black/60 dark:text-white"
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
                        <svg
                          width="12"
                          height="10"
                          viewBox="0 0 12 10"
                          className="text-black/60 dark:text-white"
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
                        <div className="flex items-center">
                          <div className="w-[18px] h-[9px] border border-black/40 dark:border-white/80 rounded-[2px] flex items-center p-[1px]">
                            <div className="w-[70%] h-full bg-black/60 dark:bg-white rounded-[1px]" />
                          </div>
                          <div className="w-[1.5px] h-[4px] bg-black/40 dark:bg-white/80 rounded-r-full ml-[0.5px]" />
                        </div>
                      </div>
                    </div>

                    <div className="absolute top-[9px] left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-black rounded-full z-50" />

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
                            <span className="text-[8px] text-gray-500 dark:text-white/50">💬</span>
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
                            <span className="text-[10px] text-gray-500 dark:text-white/60">⇅</span>
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
                              0 د.إ
                            </span>
                            <div className="flex items-center gap-1 bg-gray-200 dark:bg-neutral-700/50 rounded-full px-2 py-0.5">
                              <span className="text-[8px]">🇦🇪</span>
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
                                🏦 Bank
                              </span>
                            </div>
                            <div className="bg-transparent rounded-full px-2.5 py-0.5">
                              <span className="text-[8px] text-gray-400 dark:text-white/40">
                                💵 Cash
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
                                "rgb(255,255,255)",
                              ],
                              scale: [1, 1, 1, 0.95],
                            }}
                            transition={{
                              delay: 1.5,
                              duration: 1,
                              times: [0, 0.3, 0.85, 1],
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
                      <div className="bg-white/90 dark:bg-[#111]/90 backdrop-blur-xl rounded-2xl px-4 py-2.5 flex items-center justify-around border border-black/[0.06] dark:border-white/[0.06] shadow-lg dark:shadow-none">
                        {[
                          { icon: "🏠", label: "Home", active: false },
                          { icon: "📊", label: "Markets", active: true },
                          { icon: "💰", label: "Wallet", active: false },
                          { icon: "👤", label: "Profile", active: false },
                        ].map((tab) => (
                          <div
                            key={tab.label}
                            className="flex flex-col items-center gap-0.5"
                          >
                            <span
                              className={`text-[12px] ${tab.active ? "" : "opacity-40"}`}
                            >
                              {tab.icon}
                            </span>
                            <span
                              className={`text-[7px] font-medium ${tab.active ? "text-[#ff6b35]" : "text-black/40 dark:text-white/30"}`}
                            >
                              {tab.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Receipt Screen */}
              <AnimatePresence>
                {isReceipt && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92, filter: "blur(6px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-[3px] rounded-[2.7rem] z-40 overflow-hidden bg-white dark:bg-[#0a0a0a]"
                  >
                    <div className="absolute top-[14px] left-[3px] right-[3px] z-50 flex items-center justify-between px-5 h-[20px]">
                      <span className="text-black/80 dark:text-white text-[9px] font-semibold">
                        20:23
                      </span>
                      <div className="w-[100px]" />
                      <div className="flex items-center gap-1.5">
                        <svg
                          width="14"
                          height="10"
                          viewBox="0 0 14 10"
                          className="text-black/60 dark:text-white"
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
                        <svg
                          width="12"
                          height="10"
                          viewBox="0 0 12 10"
                          className="text-black/60 dark:text-white"
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
                        <div className="flex items-center">
                          <div className="w-[18px] h-[9px] border border-black/40 dark:border-white/80 rounded-[2px] flex items-center p-[1px]">
                            <div className="w-[70%] h-full bg-black/60 dark:bg-white rounded-[1px]" />
                          </div>
                          <div className="w-[1.5px] h-[4px] bg-black/40 dark:bg-white/80 rounded-r-full ml-[0.5px]" />
                        </div>
                      </div>
                    </div>

                    <div className="absolute top-[9px] left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-black rounded-full z-50" />

                    <OrderReceiptScreen />

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                      className="absolute bottom-3 left-3 right-3 z-10"
                    >
                      <div className="bg-white/90 dark:bg-[#111]/90 backdrop-blur-xl rounded-2xl px-4 py-2.5 flex items-center justify-around border border-black/[0.06] dark:border-white/[0.06] shadow-lg dark:shadow-none">
                        {[
                          { icon: "🏠", label: "Home", active: false },
                          { icon: "📊", label: "Markets", active: true },
                          { icon: "💰", label: "Wallet", active: false },
                          { icon: "👤", label: "Profile", active: false },
                        ].map((tab) => (
                          <div
                            key={tab.label}
                            className="flex flex-col items-center gap-0.5"
                          >
                            <span
                              className={`text-[12px] ${tab.active ? "" : "opacity-40"}`}
                            >
                              {tab.icon}
                            </span>
                            <span
                              className={`text-[7px] font-medium ${tab.active ? "text-[#ff6b35]" : "text-black/40 dark:text-white/30"}`}
                            >
                              {tab.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Animation Timeline — horizontal bottom, refined */}
      <div className="absolute bottom-8 left-6 md:left-10 z-40">
        <div className="flex items-center gap-0 bg-white/60 dark:bg-white/[0.04] backdrop-blur-xl rounded-full px-3 py-2 border border-black/[0.04] dark:border-white/[0.06] shadow-lg dark:shadow-none">
          {[
            { key: "list", label: "Currencies" },
            { key: "stacked", label: "Stack" },
            { key: "phone", label: "Wallet" },
            { key: "addMoney", label: "Add Money" },
            { key: "trading", label: "Trading" },
            { key: "receipt", label: "Receipt" },
          ].map((step, i, arr) => {
            const stageOrder = [
              "list",
              "stacked",
              "phone",
              "addMoney",
              "trading",
              "receipt",
            ];
            const currentIdx = stageOrder.indexOf(stage);
            const isActive = step.key === stage;
            const isPast = stageOrder.indexOf(step.key) < currentIdx;
            return (
              <div key={step.key} className="flex items-center">
                <div className="flex flex-col items-center gap-1 relative">
                  <div className="relative">
                    <motion.div
                      animate={{
                        backgroundColor: isActive
                          ? "#ff6b35"
                          : isPast
                            ? "#ff6b35"
                            : "rgba(128,128,128,0.15)",
                        scale: isActive ? 1.4 : 1,
                      }}
                      transition={{ duration: 0.4 }}
                      className="w-2 h-2 rounded-full flex-shrink-0"
                    />
                    {/* Active glow ring */}
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 2.2, opacity: [0, 0.4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute inset-0 rounded-full bg-[#ff6b35]"
                      />
                    )}
                  </div>
                  <motion.span
                    animate={{
                      opacity: isActive ? 1 : isPast ? 0.6 : 0.25,
                      color: isActive ? "#ff6b35" : undefined,
                    }}
                    transition={{ duration: 0.3 }}
                    className="text-[7px] font-semibold text-black dark:text-white tracking-wider whitespace-nowrap uppercase"
                  >
                    {step.label}
                  </motion.span>
                </div>
                {i < arr.length - 1 && (
                  <motion.div
                    animate={{
                      backgroundColor: isPast
                        ? "#ff6b35"
                        : "rgba(128,128,128,0.12)",
                    }}
                    transition={{ duration: 0.4 }}
                    className="h-[1.5px] w-4 sm:w-6 md:w-10 mx-0.5 -mt-3.5 rounded-full"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Replay Button — appears after animation completes */}
      <AnimatePresence>
        {animDone && (
          <motion.button
            key="replay-btn"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            onClick={handleReplay}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-gradient-to-r from-[#ff6b35] to-[#ff8f5e] text-white text-xs font-semibold px-6 py-3 rounded-full shadow-[0_4px_24px_rgba(255,107,53,0.4),0_0_0_1px_rgba(255,107,53,0.2)] hover:shadow-[0_8px_40px_rgba(255,107,53,0.5),0_0_0_1px_rgba(255,107,53,0.3)] hover:scale-105 transition-all duration-300 backdrop-blur-sm"
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
