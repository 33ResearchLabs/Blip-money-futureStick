import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Zap,
  User,
  ArrowDown,
  Wifi,
  Battery,
  Signal,
  CheckCircle,
  Clock,
  FileText,
  Copy,
  BatteryFull,
} from "lucide-react";
import { Logo } from "../Navbar";

type Screen = "send" | "confirm" | "status" | "success" | "complete";

export default function PhoneMockupInteractive() {
  const [screen, setScreen] = useState<Screen>("send");
  const [amount, setAmount] = useState("5,000");
  const [statusProgress, setStatusProgress] = useState(0);

  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  const receiveAmount = amount
    ? (Number(amount) * 3.67).toLocaleString()
    : "18,350";

  /* ---------------- Status progress animation ---------------- */
  useEffect(() => {
    if (screen === "status") {
      setStatusProgress(1);
      const timer1 = setTimeout(() => setStatusProgress(2), 1500);
      const timer2 = setTimeout(() => setStatusProgress(3), 3000);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      setStatusProgress(0);
    }
  }, [screen]);
  const handleScreen = useCallback(
    (screen) => {
      setScreen(screen);
    },
    [screen],
  );
  /* ---------------- Auto-progression through screens ---------------- */
  useEffect(() => {
    const timings: Record<Screen, number> = {
      send: 2500,
      confirm: 2000,
      status: 3500,
      success: 2000,
      complete: 2500,
    };

    const nextScreen: Record<Screen, Screen> = {
      send: "confirm",
      confirm: "status",
      status: "success",
      success: "complete",
      complete: "send",
    };

    const timer = setTimeout(() => {
      setScreen(nextScreen[screen]);
    }, timings[screen]);

    return () => clearTimeout(timer);
  }, [screen]);

  /* ---------------- Mouse tilt ---------------- */
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
        {/* PHONE - EXACT MATCH TO LOCKED & SECURED MOCKUP */}
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
          <motion.div className="absolute inset-0 rounded-[28px] sm:rounded-[36px] md:rounded-[40px] lg:rounded-[44px] pointer-events-none z-10" />
          <div className=" mt-8 w-[200px] md:mt-0 sm:w-[250px] lg:w-[320px]  ">
            {/* Phone outer frame */}
            <div className="rounded-[36px] sm:rounded-[40px] md:rounded-[44px] bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] p-[2px] sm:p-[2.5px] shadow-[0_25px_50px_rgba(0,0,0,0.5),0_0_40px_rgba(255,107,53,0.08)] md:shadow-[0_40px_80px_rgba(0,0,0,0.6),0_0_60px_rgba(255,107,53,0.1)]">
              <div className="rounded-[34px] sm:rounded-[38px] md:rounded-[42px] bg-[#0a0a0a] p-[1px] sm:p-[8px] md:p-[10px]">
                {/* Phone screen */}
                <div className="rounded-[28px] sm:rounded-[30px] md:rounded-[34px] bg-black overflow-y-auto overflow-x-hidden relative max-h-[500px] sm:max-h-[600px] md:max-h-[650px] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  {/* Dynamic Island */}
                  <div className=" hidden md:block absolute top-3 left-1/2 -translate-x-1/2 z-10 ">
                    <div className="w-28 h-7 rounded-full bg-black flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-[#1a1a1a] " />
                    </div>
                  </div>

                  {/* Status bar */}
                  <div className="flex items-center justify-between px-6 pt-4 pb-2">
                    <span className="text-[10px] md:text-[13px] text-white font-semibold">
                      9:41
                    </span>
                    <div className="flex items-center gap-1.5 ">
                      <Signal className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      <Wifi className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      <BatteryFull className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                  </div>

                  {/* SCREENS */}
                  <AnimatePresence mode="wait">
                    {/* SEND */}
                    {screen === "send" && (
                      <motion.div
                        key="send"
                        initial={{ x: 40, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -40, opacity: 0 }}
                        transition={{ duration: 0.45 }}
                        className="px-6 pb-3 sm:pb-10 pt-1 sm:pt-8 flex flex-col min-h-[400px] sm:min-h-[500px]"
                      >
                        <Header />

                        {/* Send label */}
                        <div className="text-center mb-3 sm:mb-4">
                          <span className="text-[9px] sm:text-sm text-white/40 uppercase tracking-wider">
                            You send
                          </span>
                        </div>

                        <div className="flex justify-center items-center gap-1.5 sm:gap-2 mb-4 sm:mb-5 md:mb-6">
                          <input
                            value={amount}
                            inputMode="numeric"
                            onChange={(e) =>
                              setAmount(e.target.value.replace(/\D/g, ""))
                            }
                            className="bg-transparent text-white text-xl  md:text-3xl font-bold w-[80px] sm:w-[100px] md:w-[120px] text-center outline-none"
                          />
                          <Currency />
                        </div>

                        <Divider />

                        <Preview receiveAmount={receiveAmount} />

                        <div className="flex-1" />

                        <motion.button
                          onClick={() => handleScreen}
                          className="w-full py-2 sm:py-3 rounded-full bg-[#ff6b35] text-black font-bold text-sm sm:text-base"
                          whileHover={{
                            scale: 1.03,
                            boxShadow: "0 0 20px rgba(255, 107, 53, 0.4)",
                          }}
                          whileTap={{
                            scale: 0.93,
                            boxShadow: "0 0 30px rgba(255, 107, 53, 0.6)",
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 20,
                          }}
                        >
                          Continu
                        </motion.button>
                      </motion.div>
                    )}

                    {/* CONFIRM */}
                    {screen === "confirm" && (
                      <motion.div
                        key="confirm"
                        initial={{ x: 40, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -40, opacity: 0 }}
                        transition={{ duration: 0.45 }}
                        className="px-6 pb-3 sm:pb-10 pt-1 sm:pt-8 flex flex-col min-h-[400px] sm:min-h-[500px]"
                      >
                        <h3 className="text-white text-base sm:text-lg font-bold text-center mb-6 sm:mb-8">
                          Confirm Transfer
                        </h3>

                        <Card>
                          <Row label="From" value="Alex" />
                          <Row label="To" value="John Smith" />
                          <Row label="Amount" value={`${amount} USDT`} />
                          <Row label="They receive" value={`${"18,350"} AED`} />
                          <Row label="Fee" value="$0.10" />
                        </Card>

                        <div className="flex-1" />

                        <motion.button
                          onClick={() => setScreen("status")}
                          className="w-full py-2 sm:py-3 rounded-full bg-[#ff6b35] text-black font-bold text-sm sm:text-base mb-2 sm:mb-3"
                          whileTap={{
                            scale: 0.93,
                            boxShadow: "0 0 30px rgba(255, 107, 53, 0.6)",
                          }}
                          whileHover={{
                            boxShadow: "0 0 20px rgba(255, 107, 53, 0.4)",
                          }}
                        >
                          Send Now
                        </motion.button>

                        {/* <Back onClick={() => setScreen("send")} /> */}
                      </motion.div>
                    )}

                    {/* ORDER STATUS */}
                    {screen === "status" && (
                      <motion.div
                        key="status"
                        initial={{ x: 40, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="px-6 pb-3 sm:pb-10 pt-6 sm:pt-8 flex flex-col min-h-[400px] sm:min-h-[500px]"
                      >
                        <h3 className="text-white text-base sm:text-lg font-bold text-center mb-4 sm:mb-6">
                          Order Status
                        </h3>

                        <StatusItem
                          title="Order Placed"
                          active={statusProgress >= 1}
                          icon={
                            statusProgress >= 1 ? (
                              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#ff6b35]" />
                            ) : (
                              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white/40" />
                            )
                          }
                        />
                        <StatusItem
                          title="Processing"
                          active={statusProgress >= 2}
                          icon={
                            statusProgress >= 2 ? (
                              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#ff6b35]" />
                            ) : (
                              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white/40" />
                            )
                          }
                        />
                        <StatusItem
                          title="Completed"
                          active={statusProgress >= 3}
                          icon={
                            statusProgress >= 3 ? (
                              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#ff6b35]" />
                            ) : (
                              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white/20" />
                            )
                          }
                        />

                        <div className="flex-1" />

                        <motion.button
                          onClick={() => setScreen("success")}
                          className="w-full py-2 sm:py-3  rounded-full bg-[#ff6b35] text-black font-bold text-sm sm:text-base"
                          whileTap={{ scale: 0.97 }}
                        >
                          Continue
                        </motion.button>
                      </motion.div>
                    )}

                    {/* SUCCESS */}
                    {screen === "success" && (
                      <motion.div
                        key="success"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="px-6 pb-3 sm:pb-10 pt-6 sm:pt-8 text-center flex flex-col min-h-[400px] sm:min-h-[500px] justify-center"
                      >
                        <CheckCircle className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto text-[#ff6b35]" />
                        <h3 className="text-white text-base sm:text-lg font-bold mt-3 sm:mt-4">
                          Transfer Sent
                        </h3>
                        <p className="text-white/50 text-xs sm:text-sm mb-4 sm:mb-6">
                          {amount} USDT sent successfully
                        </p>

                        <div className="flex-1" />

                        <motion.button
                          onClick={() => setScreen("complete")}
                          className="w-full py-2 sm:py-3 rounded-full bg-[#ff6b35] text-black font-bold text-sm sm:text-base"
                          whileTap={{ scale: 0.97 }}
                        >
                          View Details
                        </motion.button>
                      </motion.div>
                    )}

                    {/* COMPLETE TRADE SCREEN */}
                    {screen === "complete" && (
                      <motion.div
                        key="complete"
                        initial={{ x: 40, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -40, opacity: 0 }}
                        transition={{ duration: 0.45 }}
                        className="px-6 pb-3 sm:pb-10 pt-1 sm:pt-8 flex flex-col min-h-[400px] sm:min-h-[500px] max-h-[400px] sm:max-h-[500px]"
                      >
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                          <h3 className="text-white text-sm sm:text-lg font-bold">
                            Order Details
                          </h3>
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#ffffff]/10 flex items-center justify-center">
                            <FileText className="w-3 h-3 sm:w-5 sm:h-5 text-[#ffffff]" />
                          </div>
                        </div>

                        {/* Scrollable content area */}
                        <div className="flex-1  pr-1 ">
                          <Card>
                            <div className="space-y-2.5 sm:space-y-3 text-white text-[9px] sm:text-sm">
                              {/* Order ID */}
                              <div className="flex justify-between">
                                <span className="text-white/60">Order ID</span>
                                <span className="font-mono">#BLP-78291</span>
                              </div>

                              <div className="border-t border-white/5" />

                              {/* Parties */}
                              <div className="flex justify-between">
                                <span className="text-white/60">From</span>
                                <span>Alex</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-white/60">To</span>
                                <span>John Smith</span>
                              </div>

                              <div className="border-t border-white/5" />

                              {/* Amounts */}
                              <div className="flex justify-between">
                                <span className="text-white/60">
                                  Amount Sent
                                </span>
                                <span>{amount} USDT</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-white/60">
                                  Amount Received
                                </span>
                                <span>{"18,350"} AED</span>
                              </div>
                              {/* <div className="flex justify-between">
        <span className="text-white/60">Exchange Rate</span>
        <span>1 USDT = 3.67 AED</span>
      </div> */}
                              <div className="flex justify-between">
                                <span className="text-white/60">Fee</span>
                                <span>$0.10</span>
                              </div>

                              <div className="border-t border-white/5" />

                              {/* Status */}
                              <div className="flex justify-between">
                                <span className="text-white/60">Status</span>
                                <span className="text-emerald-400 font-medium">
                                  ✓ Completed
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-white/60">Date</span>
                                <span>Jan 23, 2026</span>
                              </div>
                            </div>
                          </Card>

                          {/* <div className="rounded-lg sm:rounded-xl bg-white/[0.02] border border-white/[0.06] p-3 sm:p-4 mb-3 sm:mb-4">
                            <div className="flex items-center justify-between">
                              <span className="text-xs sm:text-sm text-white/40">
                                Transaction ID
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
                          onClick={() => setScreen("send")}
                          className="w-full py-2 sm:py-3 rounded-full bg-[#ff6b35] text-black font-bold text-sm sm:text-base mb-1 sm:mb-1"
                          whileTap={{ scale: 0.97 }}
                        >
                          New Transaction
                        </motion.button>

                        {/* <Back onClick={() => setScreen("success")} /> */}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Home indicator */}
                  <div className="flex justify-center pb-1.5 sm:pb-2">
                    <div className="w-16 sm:w-24 md:w-28 lg:w-32 h-0.5 sm:h-1 bg-white/30 rounded-full" />
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

/* ---------------- Small UI helpers ---------------- */

export const Header = ({ className = "" }) => (
  <div className={` ${className} group flex items-center gap-1`}>
    {/* Dot */}

    {/* Text */}
    <Logo className="text-sm" />
  </div>
);

const Currency = () => (
  <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg sm:rounded-xl bg-white/10">
    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#2775CA] flex items-center justify-center text-[10px] sm:text-xs text-white">
      $
    </div>
    <span className="text-white text-xs sm:text-sm">USDT</span>
    <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/40" />
  </div>
);

const Divider = () => (
  <div className="flex items-center justify-center mb-3 sm:mb-4">
    <div className="flex-1 h-px bg-white/10" />
    <div className="w-6 h-6 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center mx-2 sm:mx-3">
      <ArrowDown className="w-3 h-3 sm:w-5 sm:h-5 text-white/40" />
    </div>
    <div className="flex-1 h-px bg-white/10" />
  </div>
);

const Preview = ({ receiveAmount }: { receiveAmount: string }) => (
  <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-3 sm:p-5 mb-3 sm:mb-8">
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs sm:text-sm text-white/40">They receive</span>
      <div className="flex items-baseline gap-2">
        <span className="text-sm md:text-xl font-bold text-white">
          {"18,350"}
        </span>
        <span className="text-sm sm:text-base md:text-lg text-white/50">
          AED
        </span>
      </div>
    </div>

    <div className="flex items-center justify-between pt-3 border-t border-white/5">
      <span className="text-[10px] sm:text-xs text-white/30">Rate</span>
      <span className="text-[10px] sm:text-xs text-white/50">
        1 USDT = 3.67 AED
      </span>
    </div>
  </div>
);

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-lg sm:rounded-2xl bg-white/[0.04] border border-white/[0.06] p-3 sm:p-3.5 md:p-4 mb-3 sm:mb-4 md:mb-5">
    {children}
  </div>
);

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between text-white text-[9px] sm:text-sm mb-1 sm:mb-1">
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

const Back = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="w-full text-center text-white/50 text-[9px] sm:text-xs"
  >
    ← Back
  </button>
);

const StatusItem = ({
  title,
  icon,
  active,
}: {
  title: string;
  icon: React.ReactNode;
  active?: boolean;
}) => (
  <div
    className={`flex items-center gap-2 sm:gap-2 p-2 sm:p-1.5 rounded-lg sm:rounded-2xl mb-1 sm:mb-2 border ${
      active
        ? "border-[#ffffff]/40 bg-[#ffffff]/10"
        : "border-white/10 bg-white/[0.03]"
    }`}
  >
    {icon}
    <span
      className={`text-[9px] sm:text-sm ${active ? "text-white" : "text-white/40"}`}
    >
      {title}
    </span>
  </div>
);
