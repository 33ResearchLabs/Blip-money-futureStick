import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Check, Globe, User, Building2, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/Hero/PhoneMockup";

/* ============================================
   SECTION 7: HOW IT WORKS - Interactive Single Screen
   ============================================ */

const HowItWorksSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const [activeStep, setActiveStep] = useState(0);

  // Auto-advance steps every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      num: "01",
      title: "Send",
      desc: "Create a payment from your wallet. Connect, enter amount, and send globally.",
      app: "Blip App",
      appIcon: "📱",
      screen: (
        <div className="p-3 sm:p-4 h-full flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Header className="text-xl w-28" />
            </div>
            <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center">
              <User className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-black dark:text-white/40" />
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center min-h-0">
            <span className="text-[10px] sm:text-xs text-black dark:text-white/40 uppercase tracking-wider mb-2">
              You send
            </span>
            <div className="flex items-baseline gap-1.5 mb-4">
              <span className="text-3xl sm:text-4xl font-bold text-black dark:text-white">
                500
              </span>
              <span className="text-sm sm:text-base text-black dark:text-white/50">USDT</span>
            </div>
            <div className="w-full px-3 py-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] text-center mb-2">
              <span className="text-[10px] text-black dark:text-white/30 block mb-0.5">
                Recipient gets
              </span>
              <span className="text-sm sm:text-base text-black dark:text-white font-medium">
                1,835 AED
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-black dark:text-white/30">
              <Check className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-emerald-400" />
              <span>Best rate locked</span>
            </div>
          </div>
          <div className="w-full py-2.5 sm:py-3 rounded-full bg-white text-center mt-3 flex-shrink-0">
            <span className="text-xs sm:text-sm font-semibold text-black">
              Continue
            </span>
          </div>
        </div>
      ),
    },
    {
      num: "02",
      title: "Match",
      desc: "150+ verified merchants compete to fulfill your order. Best rate wins.",
      app: "Merchant Dashboard",
      appIcon: "🏪",
      screen: (
        <div className="p-3 sm:p-4 h-full flex flex-col text-left overflow-hidden">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <span className="text-xs sm:text-sm font-semibold text-black dark:text-white">
              Live Orders
            </span>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10">
              <div className="w-1.5 h-1.5 rounded-full bg-black/60 dark:bg-white/60" />
              <span className="text-[8px] sm:text-[10px] text-black dark:text-white/60 font-medium">
                LIVE
              </span>
            </div>
          </div>
          <div className="space-y-2 flex-1 min-h-0 overflow-hidden">
            {[
              {
                rate: "3.672",
                profit: "+$1.85",
                best: true,
                merchant: "Dubai Exchange",
              },
              {
                rate: "3.668",
                profit: "+$1.65",
                best: false,
                merchant: "Emirates FX",
              },
              {
                rate: "3.665",
                profit: "+$1.50",
                best: false,
                merchant: "Gulf Markets",
              },
            ].map((bid, i) => (
              <div
                key={i}
                className={`p-2.5 sm:p-3 rounded-lg sm:rounded-xl ${
                  bid.best
                    ? "bg-black/[0.06] dark:bg-white/[0.06] border border-black/20 dark:border-white/20"
                    : "bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.04]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 sm:w-7 h-6 sm:h-7 rounded-md sm:rounded-lg ${
                        bid.best ? "bg-black/10 dark:bg-white/10" : "bg-black/5 dark:bg-white/5"
                      } flex items-center justify-center`}
                    >
                      {bid.best ? (
                        <CheckCircle2 className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-black dark:text-white" />
                      ) : (
                        <Building2 className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-black dark:text-white/40" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-semibold text-black dark:text-white block">
                        {bid.rate} AED
                      </span>
                      <span className="text-[8px] sm:text-[10px] text-black dark:text-white/30">
                        {bid.merchant}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] sm:text-xs text-emerald-400 font-medium">
                    {bid.profit}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 p-2.5 rounded-lg bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.04] flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border-2 border-black/30 dark:border-white/30 border-t-white/60" />
              <span className="text-[10px] sm:text-xs text-black dark:text-white/40">
                Auto-selecting best rate...
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      num: "03",
      title: "Verify",
      desc: "Every transaction on-chain. Track, verify, and confirm on Blipscan.",
      app: "Blipscan",
      appIcon: "🔍",
      screen: (
        <div className="p-3 sm:p-4 h-full flex flex-col text-left overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 md:gap-2.5">
              <div className="w-6 h-6 rounded-md sm:rounded-lg bg-white flex items-center justify-center">
                <Globe className="w-3 sm:w-3.5 md:w-4 lg:w-4.5 h-3 sm:h-3.5 md:h-4 lg:h-4.5 text-black" />
              </div>
              <span className="text-xs sm:text-sm md:text-base font-semibold text-black dark:text-white">
                Blipscan
              </span>
            </div>
            <div className="px-2 py-0.5 rounded-full flex justify-normal bg-black/[0.05] dark:bg-white/[0.05]">
              <span className="text-[8px] sm:text-[10px] text-black dark:text-white/60 font-medium">
                Mainnet
              </span>
            </div>
          </div>
          <div className="space-y-2 flex-1 min-h-0 overflow-hidden">
            {[
              { id: "BLP-7x2K", to: "Ahmed M.", amount: "$500", time: "2s" },
              {
                id: "BLP-4mR8",
                to: "Sarah K.",
                amount: "$1,200",
                time: "1.4s",
              },
              { id: "BLP-9nP3", to: "John D.", amount: "$320", time: "1.8s" },
            ].map((tx, i) => (
              <div
                key={i}
                className="p-2.5 sm:p-3 rounded-lg md:rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.04]"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[8px] sm:text-[10px] md:text-xs text-black dark:text-white/40 font-mono">
                    {tx.id}...
                  </span>
                  <div className="flex items-center gap-1 md:gap-1.5 px-1.5 md:px-2 lg:px-2.5 py-0.5 rounded md:rounded-md bg-emerald-500/10">
                    <Check className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-emerald-400" />
                    <span className="text-[10px] sm:text-xs text-emerald-400 font-medium">
                      {tx.time}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-black dark:text-white">
                    {tx.to}
                  </span>
                  <span className="text-[13px] font-semibold text-black dark:text-white">
                    {tx.amount}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-3 p-2.5 rounded-lg bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.04] flex-shrink-0">
            <div className="flex items-center justify-center gap-2">
              {/* <div className="w-3 h-3 rounded-full border-2 border-black/30 dark:border-white/30 border-t-white/60" /> */}
              <div className="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-emerald-400" />
              <span className="text-[10px] sm:text-xs text-black dark:text-white/40">
                 Connected to Solana
              </span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen lg:h-screen flex items-center justify-center bg-white dark:bg-black overflow-hidden py-12 lg:py-0"
    >
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-black/[0.02] dark:bg-white/[0.02] blur-[120px]" />
        <motion.div
          className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-[#ff6b35]/[0.03] blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.03, 0.05, 0.03],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 w-full"
        style={{ opacity }}
      >
        {/* Header */}
        <div className="text-center mb-8 lg:mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] mb-4"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#ff6b35]" />
            <span className="text-[10px] text-black dark:text-white/50 uppercase tracking-wider">
              How it works
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black dark:text-white tracking-tight leading-[1.1] mb-3"
          >
            Three steps.
            <br />
            <span className="text-black dark:text-white/40">Zero friction.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.1 }}
            className="text-sm md:text-base text-black dark:text-white/40 font-medium max-w-2xl mx-auto px-2"
          >
            From crypto to cash in under 2 seconds. No banks, no delays, no
            complexity.
          </motion.p>
        </div>

        {/* Interactive Single Screen Layout */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Phone Mockup with Dynamic Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex justify-center items-center order-2 lg:order-1"
          >
            <div className="relative w-[200px] sm:w-[240px] md:w-[280px] lg:w-[320px]">
              <div className="rounded-[36px] sm:rounded-[40px] bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] p-[2px] sm:p-[2.5px] shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
                <div className="rounded-[34px] sm:rounded-[37.5px] bg-[#fafafa] dark:bg-[#0a0a0a] p-[8px] sm:p-[10px]">
                  <div className="rounded-[28px] sm:rounded-[30px] bg-white dark:bg-black overflow-hidden h-[360px] sm:h-[420px] md:h-[480px] lg:h-[540px] relative">
                    {/* Status bar */}
                    <div className="absolute top-0 left-0 right-0 h-9 sm:h-10 flex items-center justify-between px-4 sm:px-5 z-20">
                      <span className="text-[9px] sm:text-[10px] font-semibold text-black dark:text-white">
                        9:41
                      </span>
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        <div className="flex items-end gap-[1.5px] sm:gap-[2px]">
                          <div className="w-[3px] sm:w-1 h-1 sm:h-1.5 bg-white rounded-[1px]" />
                          <div className="w-[3px] sm:w-1 h-1.5 sm:h-2 bg-white rounded-[1px]" />
                          <div className="w-[3px] sm:w-1 h-2 sm:h-2.5 bg-white rounded-[1px]" />
                          <div className="w-[3px] sm:w-1 h-2.5 sm:h-3 bg-white rounded-[1px]" />
                        </div>
                        <div className="w-4 sm:w-5 h-2 sm:h-2.5 rounded-[2px] sm:rounded-[3px] border border-black/80 dark:border-white/80 p-[1px] sm:p-[1.5px]">
                          <div className="h-full w-[80%] bg-white rounded-[1px]" />
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Screen Content */}
                    <div className="pt-9 sm:pt-10 h-full">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeStep}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.4 }}
                          className="h-full"
                        >
                          {steps[activeStep].screen}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Step Navigation & Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-3 lg:space-y-4 order-1 lg:order-2"
          >
            {steps.map((step, i) => (
              <motion.div
                key={i}
                onClick={() => setActiveStep(i)}
                className={`group cursor-pointer p-3 sm:p-4 lg:p-5 rounded-lg sm:rounded-xl lg:rounded-2xl border transition-all duration-300 ${
                  activeStep === i
                    ? "bg-black/[0.06] dark:bg-white/[0.06] border-black/20 dark:border-white/20"
                    : "bg-black/[0.02] dark:bg-white/[0.02] border-black/[0.05] dark:border-white/[0.05] hover:bg-black/[0.04] hover:dark:bg-white/[0.04] hover:border-black/10 hover:dark:border-white/10"
                }`}
              >
                <div className="flex items-start gap-2.5 sm:gap-3 lg:gap-4">
                  {/* Step Number */}
                  <div
                    className={`flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-md sm:rounded-lg lg:rounded-xl flex items-center justify-center font-mono font-bold text-xs sm:text-sm lg:text-base transition-all duration-300 ${
                      activeStep === i
                        ? "bg-black dark:bg-white text-white dark:text-black"
                        : "bg-black/5 dark:bg-white/5 text-black dark:text-white/40 group-hover:bg-black/10 group-hover:dark:bg-white/10 group-hover:text-black/60 group-hover:dark:text-white/60"
                    }`}
                  >
                    {step.num}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                      <span className="text-sm sm:text-base lg:text-lg">{step.appIcon}</span>
                      <h3
                        className={`text-sm sm:text-base lg:text-lg font-semibold transition-colors ${
                          activeStep === i
                            ? "text-black dark:text-white"
                            : "text-black dark:text-white/60 group-hover:text-black/80 group-hover:dark:text-white/80"
                        }`}
                      >
                        {step.title}
                      </h3>
                    </div>
                    <p
                      className={`text-[11px] sm:text-xs lg:text-sm leading-relaxed transition-colors ${
                        activeStep === i
                          ? "text-black dark:text-white/50"
                          : "text-black dark:text-white/30 group-hover:text-black/40 group-hover:dark:text-white/40"
                      }`}
                    >
                      {step.desc}
                    </p>
                    <div className="mt-1.5 sm:mt-2 text-[9px] sm:text-[10px] lg:text-xs text-black dark:text-white/30">
                      {step.app}
                    </div>
                  </div>

                  {/* Active Indicator */}
                  {activeStep === i && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="flex-shrink-0 w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-[#ff6b35]"
                    />
                  )}
                </div>

                {/* Progress Bar */}
                {activeStep === i && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 5, ease: "linear" }}
                    className="h-0.5 bg-gradient-to-r from-[#ff6b35] to-[#ff8c5a] rounded-full mt-2.5 sm:mt-3 lg:mt-4 origin-left"
                  />
                )}
              </motion.div>
            ))}

            {/* Manual Navigation Dots */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 pt-2 sm:pt-3 lg:pt-4">
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveStep(i)}
                  className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 ${
                    activeStep === i
                      ? "w-5 sm:w-6 lg:w-8 bg-[#ff6b35]"
                      : "w-1 sm:w-1.5 bg-black/20 dark:bg-white/20 hover:bg-black/40 hover:dark:bg-white/40"
                  }`}
                  aria-label={`Go to step ${i + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HowItWorksSection;
