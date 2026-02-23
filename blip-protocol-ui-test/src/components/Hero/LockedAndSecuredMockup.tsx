import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Lock,
  ArrowLeft,
  Signal,
  Wifi,
  Battery,
  FileText,
  Copy,
  CheckCircle,
  TrendingUp,
  BatteryFull,
} from "lucide-react";

type Screen = "transaction" | "secured" | "progress" | "complete" | "verified";

interface Settlement {
  id: string;
  amount: string;
  currency: string;
  timestamp: string;
}

export default function LockedAndSecuredMockup() {
  const [screen, setScreen] = useState<Screen>("transaction");
  const [progressStep, setProgressStep] = useState(0);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  /* Auto-progress through screens */
  useEffect(() => {
    if (screen === "progress") {
      setProgressStep(1);
      const timer1 = setTimeout(() => setProgressStep(2), 1500);
      const timer2 = setTimeout(() => setProgressStep(3), 3000);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      setProgressStep(0);
    }
  }, [screen]);

  /* Auto-progression to next screen */
  useEffect(() => {
    const timings: Record<Screen, number> = {
      transaction: 2500,
      secured: 2000,
      progress: 3500,
      complete: 2500,
      verified: 3000,
    };

    const nextScreen: Record<Screen, Screen> = {
      transaction: "secured",
      secured: "progress",
      progress: "complete",
      complete: "verified",
      verified: "transaction",
    };

    const timer = setTimeout(() => {
      setScreen(nextScreen[screen]);
    }, timings[screen]);

    return () => clearTimeout(timer);
  }, [screen]);

  /* Generate random settlements continuously */
  useEffect(() => {
    if (screen === "verified") {
      // Initial settlements
      const initialSettlements: Settlement[] = [
        {
          id: "BLP-7x2K...9fN3",
          amount: "500.00",
          currency: "USDT → AED",
          timestamp: "2s",
        },
        {
          id: "BLP-4mR8...2hL5",
          amount: "1,200.00",
          currency: "USDT → AED",
          timestamp: "14s",
        },
        {
          id: "BLP-9pT4...6wM2",
          amount: "750.00",
          currency: "USDT → AED",
          timestamp: "18s",
        },
      ];
      setSettlements(initialSettlements);

      // Generate new settlement continuously
      const generateSettlement = () => {
        const amounts = [
          "342.00",
          "856.00",
          "1,450.00",
          "720.00",
          "2,300.00",
          "590.00",
          "1,890.00",
          "425.00",
          "650.00",
          "980.00",
          "1,120.00",
          "475.00",
        ];
        const randomAmount =
          amounts[Math.floor(Math.random() * amounts.length)];

        // Generate random hash-like ID
        const chars =
          "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const randomHash = Array.from(
          { length: 4 },
          () => chars[Math.floor(Math.random() * chars.length)],
        ).join("");
        const randomHash2 = Array.from(
          { length: 4 },
          () => chars[Math.floor(Math.random() * chars.length)],
        ).join("");
        const randomId = `BLP-${randomHash}...${randomHash2}`;

        const newSettlement: Settlement = {
          id: randomId,
          amount: randomAmount,
          currency: "USDT → AED",
          timestamp: "Just now",
        };

        setSettlements((prev) => {
          const updated = [newSettlement, ...prev];
          return updated.slice(0, 15); // Keep latest 15
        });
      };

      // Start generating after 1.5 seconds
      const firstTimeout = setTimeout(() => {
        generateSettlement();
      }, 1500);

      // Then generate continuously every 2-3.5 seconds
      const scheduleNext = () => {
        const delay = 2000 + Math.random() * 1500; // 2-3.5 seconds
        return setTimeout(() => {
          generateSettlement();
          timeoutIds.push(scheduleNext());
        }, delay);
      };

      const timeoutIds: NodeJS.Timeout[] = [firstTimeout];
      timeoutIds.push(scheduleNext());

      return () => {
        timeoutIds.forEach((id) => clearTimeout(id));
      };
    } else {
      setSettlements([]);
    }
  }, [screen]);

  /* Mouse tilt effect */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      setMouse({
        x: ((e.clientX - r.left) / r.width - 0.5) * 2,
        y: ((e.clientY - r.top) / r.height - 0.5) * 2,
      });
    };

    const reset = () => setMouse({ x: 0, y: 0 });

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", reset);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", reset);
    };
  }, []);

  return (
    <div className="flex justify-center">
      <div ref={containerRef} className="relative">
        {/* Ambient glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="absolute w-[450px] h-[450px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 50%)",
              x: mouse.x * 10,
              y: mouse.y * 8,
            }}
          />
          <div className="absolute w-[350px] h-[350px] rounded-full border border-white/[0.04]" />
        </div>

        {/* iPhone Frame with 3D Perspective */}
        <motion.div
          animate={{
            x: mouse.x * -12,
            y: mouse.y * -10,
            rotateY: mouse.x * 6,
            rotateX: mouse.y * -4,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          style={{ transformPerspective: 1200, transformStyle: "preserve-3d" }}
        >
          {/* Reflection effect */}
          <motion.div
            className="absolute inset-0 rounded-[28px] sm:rounded-[36px] md:rounded-[44px] lg:rounded-[52px] pointer-events-none z-10"
            style={{
              background: `linear-gradient(${135 + mouse.x * 25}deg, rgba(255,255,255,0.06) 0%, transparent 50%, rgba(0,0,0,0.12) 100%)`,
            }}
          />

          <div className=" mt-8 mb-16 sm:mb-0 w-[250px] md:mt-0 sm:w-[250px] lg:w-[320px] ">
            {/* Phone outer frame */}
            <div className="rounded-[28px] sm:rounded-[36px] md:rounded-[40px] lg:rounded-[44px] bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] p-[1.5px] sm:p-[2px] md:p-[2.5px] shadow-[0_20px_40px_rgba(0,0,0,0.5)] sm:shadow-[0_25px_50px_rgba(0,0,0,0.5)] md:shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
              <div className="rounded-[26px] sm:rounded-[34px] md:rounded-[38px] lg:rounded-[42px] bg-[#0a0a0a] p-[6px] sm:p-[8px] md:p-[10px] lg:p-[12px]">
                {/* Phone screen */}
                <div className="rounded-[22px] sm:rounded-[28px] md:rounded-[30px] lg:rounded-[34px] bg-black overflow-y-auto overflow-x-hidden relative max-h-[500px] sm:max-h-[600px] md:max-h-[650px] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  {/* Dynamic Island */}
                  <div className="hidden sm:block absolute top-2 sm:top-3 left-1/2 -translate-x-1/2 z-10">
                    <div className="w-20 h-6 sm:w-28 sm:h-7 rounded-full bg-black flex items-center justify-center">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#1a1a1a] mr-1.5 sm:mr-2" />
                    </div>
                  </div>

                  {/* Status bar */}
                  <div className="flex items-center justify-between px-6 pt-4 pb-2">
                    <span className="text-[10px] md:text-[13px] text-white font-semibold">
                      9:41
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Signal className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      <Wifi className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      <BatteryFull className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                  </div>

                  {/* SCREENS */}
                  {/* TRANSACTION SCREEN */}
                  {screen === "transaction" && (
                    <motion.div
                      initial={{ x: 40, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -40, opacity: 0 }}
                      transition={{ duration: 0.45 }}
                      className="px-3 sm:px-4 md:px-5 lg:px-6 pb-6 sm:pb-8 md:pb-10 pt-4 sm:pt-6 md:pt-8 flex flex-col min-h-[400px] sm:min-h-[500px]"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
                        <button className="flex items-center gap-1.5 sm:gap-2 text-white/50">
                          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="text-xs sm:text-sm">Back</span>
                        </button>
                        <span className="text-xs sm:text-sm font-medium text-white">
                          Transaction
                        </span>
                      </div>

                      {/* Lock animation */}
                      <div className="flex justify-center mb-2 sm:mb-5 md:mb-6">
                        <motion.div
                          className="w-10 h-10 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center"
                          animate={{ scale: [1, 1.02, 1] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          <Lock className="w-7 h-7 sm:w-7.5 sm:h-7.5 md:w-8 md:h-8 text-white/60" />
                        </motion.div>
                      </div>

                      <div className="text-center mb-4 sm:mb-5 md:mb-6">
                        <span className="text-xs sm:text-sm text-white/50 block mb-1.5 sm:mb-2">
                          Funds Secured
                        </span>
                        <div className="text-sm sm:text-2xl md:text-3xl font-bold text-white">
                          5,000 USDT
                        </div>
                        <span className="text-[10px] sm:text-xs text-white/40">
                          ≈ $5,000.00
                        </span>
                      </div>

                      {/* Status card */}
                      <div className="rounded-lg sm:rounded-xl bg-white/[0.02] border border-white/[0.06] p-3 sm:p-3.5 md:p-4 mb-3 sm:mb-4 md:mb-5">
                        <div className="flex items-center justify-between mb-2 sm:mb-2.5 md:mb-3">
                          <span className="text-[10px] sm:text-xs text-white/40">
                            Status
                          </span>
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <motion.div
                              className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white"
                              animate={{ opacity: [1, 0.5, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                            <span className="text-[10px] sm:text-xs text-black dark:text-white font-medium">
                              In Escrow
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                          <span className="text-xs sm:text-sm text-white/40">
                            Contract
                          </span>
                          <span className="text-xs sm:text-sm text-white/60 font-mono">
                            0x7a2...f91
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm text-white/40">
                            Network
                          </span>
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-white/20" />
                            <span className="text-xs sm:text-sm text-white/60">
                              Solana
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1" />

                      <motion.button
                        onClick={() => setScreen("secured")}
                        className="w-full py-2 sm:py-3 rounded-full bg-[#ffffff] text-black font-bold text-sm sm:text-base"
                        whileTap={{
                          scale: 0.93,
                          boxShadow: "0 0 30px rgba(0,0,0,0.6)",
                        }}
                        whileHover={{
                          boxShadow: "0 0 20px rgba(0,0,0,0.4)",
                        }}
                      >
                        Next
                      </motion.button>
                    </motion.div>
                  )}

                  {/* SECURED SCREEN */}
                  {screen === "secured" && (
                    <motion.div
                      initial={{ x: 40, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -40, opacity: 0 }}
                      transition={{ duration: 0.45 }}
                      className="px-3 sm:px-4 md:px-5 lg:px-6 pb-6 sm:pb-8 md:pb-10 pt-4 sm:pt-6 md:pt-8 flex flex-col min-h-[400px] sm:min-h-[500px]"
                    >
                      <div className="text-center mb-6 sm:mb-8">
                        <span className="text-xs sm:text-sm text-white/50 block mb-2">
                          Your funds are
                        </span>
                        <h3 className="text-white text-xl sm:text-2xl font-bold">
                          Fully Secured
                        </h3>
                      </div>

                      <div className="rounded-lg sm:rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 space-y-3 sm:space-y-4">
                        <SecurityFeature
                          label="Non-Custodial"
                          desc="You control your keys"
                        />
                        <SecurityFeature
                          label="Smart Contract"
                          desc="On-chain escrow"
                        />
                        <SecurityFeature
                          label="Instant Lock"
                          desc="Sub-second confirmation"
                        />
                      </div>

                      <div className="flex-1" />

                      <motion.button
                        onClick={() => setScreen("progress")}
                        className="w-full py-2 sm:py-3 rounded-full bg-[#ffffff] text-black font-bold text-sm sm:text-base mb-2 sm:mb-3"
                        whileTap={{
                          scale: 0.93,
                          boxShadow: "0 0 30px rgba(0,0,0,0.6)",
                        }}
                        whileHover={{
                          boxShadow: "0 0 20px rgba(0,0,0,0.4)",
                        }}
                      >
                        Start Transaction
                      </motion.button>

                      {/* <button
                        onClick={() => setScreen("transaction")}
                        className="w-full text-center text-white/50 text-[9px] sm:text-xs"
                      >
                        ← Back
                      </button> */}
                    </motion.div>
                  )}

                  {/* PROGRESS SCREEN */}
                  {screen === "progress" && (
                    <motion.div
                      initial={{ x: 40, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.45 }}
                      className="px-3 sm:px-4 md:px-5 lg:px-6 pb-6 sm:pb-8 md:pb-10 pt-4 sm:pt-6 md:pt-8 flex flex-col min-h-[400px] sm:min-h-[500px]"
                    >
                      <div className="text-center mb-6 sm:mb-8">
                        <span className="text-xs sm:text-sm text-white/50 block mb-1">
                          Processing
                        </span>
                        <h3 className="text-white text-lg sm:text-xl font-bold">
                          Transaction
                        </h3>
                      </div>

                      {/* Progress bars */}
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                        <div
                          className={`flex-1 h-0.5 sm:h-1 rounded-full transition-all ${
                            progressStep >= 1 ? "bg-black dark:bg-white" : "bg-white/10"
                          }`}
                        />
                        <div
                          className={`flex-1 h-0.5 sm:h-1 rounded-full transition-all ${
                            progressStep >= 2 ? "bg-black dark:bg-white" : "bg-white/10"
                          }`}
                        />
                        <div
                          className={`flex-1 h-0.5 sm:h-1 rounded-full transition-all ${
                            progressStep >= 3 ? "bg-black dark:bg-white" : "bg-white/10"
                          }`}
                        />
                      </div>

                      {/* Progress steps */}
                      <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                        <ProgressItem
                          title="Locking funds"
                          active={progressStep >= 1}
                        />
                        <ProgressItem
                          title="Verifying merchant"
                          active={progressStep >= 2}
                        />
                        <ProgressItem
                          title="Completing transfer"
                          active={progressStep >= 3}
                        />
                      </div>

                      {/* Animated dots */}
                      <div className="text-center mb-4 sm:mb-6">
                        <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-white/40"
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.2,
                              }}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] sm:text-xs text-white/30 mt-2">
                          Please wait...
                        </span>
                      </div>

                      <div className="flex-1" />

                      <motion.button
                        onClick={() => setScreen("complete")}
                        className="w-full py-2 sm:py-3 rounded-full bg-[#ffffff] text-black font-bold text-sm sm:text-base"
                        whileTap={{
                          scale: 0.93,
                          boxShadow: "0 0 30px rgba(0,0,0,0.6)",
                        }}
                        whileHover={{
                          boxShadow: "0 0 20px rgba(0,0,0,0.4)",
                        }}
                      >
                        View Details
                      </motion.button>
                    </motion.div>
                  )}

                  {/* COMPLETE TRADE SCREEN */}
                  {screen === "complete" && (
                    <motion.div
                      key="complete"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ x: -40, opacity: 0 }}
                      transition={{ duration: 0.45 }}
                      className="px-3 sm:px-4 md:px-5 lg:px-6 pb-6 sm:pb-8 md:pb-10 pt-4 sm:pt-6 md:pt-8 flex flex-col min-h-[400px] sm:min-h-[500px] max-h-[400px] sm:max-h-[500px]"
                    >
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <h3 className="text-white text-base sm:text-lg font-bold">
                          Trade Complete
                        </h3>
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/[0.06] flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-black dark:text-white" />
                        </div>
                      </div>

                      {/* Scrollable content area */}
                      <div className="flex-1 pr-1">
                        {/* Order Details Card */}
                        <div className="rounded-lg sm:rounded-xl bg-white/[0.02] border border-white/[0.06] p-2.5 sm:p-3 mb-3 sm:mb-4 space-y-2 sm:space-y-2.5 text-[10px] sm:text-xs text-white">
                          {/* Order ID */}
                          <div className="flex justify-between">
                            <span className="text-white/40">Order ID</span>
                            <span className="font-mono">#ESC-92847</span>
                          </div>

                          <div className="border-t border-white/5" />

                          {/* Amounts */}
                          <div className="flex justify-between">
                            <span className="text-white/40">Amount</span>
                            <span className="font-medium">5,000 USDT</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/40">Received</span>
                            <span className="font-medium">18,350 AED</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/40">Rate</span>
                            <span>1 USDT = 3.67 AED</span>
                          </div>

                          <div className="border-t border-white/5" />

                          {/* Network / Fee */}
                          <div className="flex justify-between">
                            <span className="text-white/40">Network</span>
                            <span>Solana</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/40">Fee</span>
                            <span>$250</span>
                          </div>

                          <div className="border-t border-white/5" />

                          {/* Status */}
                          <div className="flex items-center justify-between">
                            <span className="text-white/40">Status</span>
                            <div className="flex items-center gap-1.5">
                              <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-black dark:text-white" />
                              <span className="text-black dark:text-white font-medium">
                                Completed
                              </span>
                            </div>
                          </div>

                          {/* Date */}
                          <div className="flex justify-between">
                            <span className="text-white/40">Date</span>
                            <span>Jan 23, 2026</span>
                          </div>
                        </div>

                        {/* Transaction ID */}
                        {/* <div className="rounded-lg sm:rounded-xl bg-white/[0.02] border border-white/[0.06] p-2.5 sm:p-3 mb-3 sm:mb-4">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] sm:text-xs text-white/40">
                              Transaction Hash
                            </span>
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <span className="text-[10px] sm:text-xs text-white/60 font-mono">
                                0x7a2...f91
                              </span>
                              <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/40" />
                            </div>
                          </div>
                        </div> */}
                      </div>

                      <motion.button
                        onClick={() => setScreen("verified")}
                        className="w-full py-2 sm:py-3 rounded-full bg-[#ffffff] text-black font-bold text-sm sm:text-base mb-2 sm:mb-3"
                        whileTap={{
                          scale: 0.93,
                          boxShadow: "0 0 30px rgba(0,0,0,0.6)",
                        }}
                        whileHover={{
                          boxShadow: "0 0 20px rgba(0,0,0,0.4)",
                        }}
                      >
                        View Settlements
                      </motion.button>

                      {/* <button
                        onClick={() => setScreen("progress")}
                        className="w-full text-center text-white/50 text-[9px] sm:text-xs"
                      >
                        ← Back
                      </button> */}
                    </motion.div>
                  )}

                  {/* SETTLEMENT VERIFIED SCREEN */}
                  {screen === "verified" && (
                    <motion.div
                      key="verified"
                      initial={{ x: 40, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -40, opacity: 0 }}
                      transition={{ duration: 0.45 }}
                      className="px-3 sm:px-4 md:px-5 lg:px-6 pb-6 sm:pb-8 md:pb-10 pt-4 sm:pt-6 md:pt-8 flex flex-col min-h-[400px] sm:min-h-[500px] max-h-[400px] sm:max-h-[500px]"
                    >
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <h3 className="text-white text-base sm:text-lg font-bold">
                          Live Settlements
                        </h3>
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#ffffff]/10 flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#ffffff]" />
                        </div>
                      </div>

                      <div className="mb-3 sm:mb-4">
                        <p className="text-[10px] sm:text-xs text-white/40 leading-relaxed">
                          Every transaction on-chain. Transparent and immutable.
                          Track in real-time.
                        </p>
                      </div>

                      {/* Scrollable settlements list */}

                      <div className="flex-1  pr-1 space-y-2 sm:space-y-2.5">
                        <AnimatePresence initial={false}>
                          {settlements.slice(2).map((settlement, index) => (
                            <motion.div
                              key={settlement.id} // ✅ stable key
                              layout // ✅ smooth reflow
                              initial={{ opacity: 0, x: -12 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 12 }}
                              transition={{
                                duration: 0.25,
                                ease: "easeOut",
                              }}
                              className="relative rounded-lg sm:rounded-xl bg-white/[0.02] border border-white/[0.06] p-2.5 sm:p-3 flex items-center justify-between"
                            >
                              {/* New item pulse (only top item) */}
                              {index === 0 && (
                                <motion.div
                                  className="absolute inset-0 rounded-lg sm:rounded-xl bg-[#ffffff]/10 pointer-events-none"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: [0, 0.4, 0] }}
                                  transition={{ duration: 1 }}
                                />
                              )}

                              <div className="flex items-center gap-2 sm:gap-2.5">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#ffffff]/10 flex items-center justify-center flex-shrink-0">
                                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#ffffff]" />
                                </div>
                                <div>
                                  <div className="text-[10px] sm:text-xs text-white font-medium">
                                    {settlement.amount} {settlement.currency}
                                  </div>
                                  <div className="text-[8px] sm:text-[10px] text-white/40 font-mono">
                                    {settlement.id}
                                  </div>
                                </div>
                              </div>

                              <div className="text-[8px] sm:text-[10px] text-white/30">
                                {settlement.timestamp}
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>

                      <motion.button
                        onClick={() => setScreen("transaction")}
                        className="w-full py-2 sm:py-3 rounded-full bg-[#ffffff] text-black font-bold text-sm sm:text-base mb-2 sm:mb-3 mt-3 sm:mt-4"
                        whileTap={{
                          scale: 0.93,
                          boxShadow: "0 0 30px rgba(0,0,0,0.6)",
                        }}
                        whileHover={{
                          boxShadow: "0 0 20px rgba(0,0,0,0.4)",
                        }}
                      >
                        New Transaction
                      </motion.button>

                      {/* <button
                        onClick={() => setScreen("complete")}
                        className="w-full text-center text-white/50 text-[9px] sm:text-xs"
                      >
                        ← Back
                      </button> */}
                    </motion.div>
                  )}

                  {/* Home indicator */}
                  <div className="flex justify-center pb-1.5 sm:pb-2">
                    <div className="w-24 sm:w-28 md:w-32 h-0.5 sm:h-1 bg-white/30 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* UI Components */
const SecurityFeature = ({ label, desc }: { label: string; desc: string }) => (
  <div className="flex items-center gap-2.5 sm:gap-3">
    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#ffffff] flex items-center justify-center flex-shrink-0">
      <div className="w-2 h-2 rounded-full bg-black" />
    </div>
    <div>
      <div className="text-white text-xs sm:text-sm font-medium">{label}</div>
      <div className="text-white/40 text-[10px] sm:text-xs">{desc}</div>
    </div>
  </div>
);

const ProgressItem = ({
  title,
  active,
}: {
  title: string;
  active: boolean;
}) => (
  <div className="flex items-center gap-2 sm:gap-3">
    <motion.div
      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center border-2 transition-all ${
        active
          ? "bg-[#ffffff] border-[#ffffff]"
          : "border-white/20 bg-white/[0.03]"
      }`}
      animate={active ? { scale: [1, 1.1, 1] } : {}}
      transition={{ duration: 0.5, repeat: Infinity }}
    >
      {active && <div className="w-2 h-2 rounded-full bg-black" />}
    </motion.div>
    <span
      className={`text-xs sm:text-sm transition-colors ${
        active ? "text-white" : "text-white/40"
      }`}
    >
      {title}
    </span>
  </div>
);

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between">
    <span className="text-[10px] sm:text-xs text-white/40">{label}</span>
    <span className="text-[10px] sm:text-xs text-white/60 font-medium">
      {value}
    </span>
  </div>
);
