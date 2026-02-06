import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Check, Globe, User, Building2, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/Hero/PhoneMockup";

/* ============================================
   SECTION 7: HOW IT WORKS - Interactive Horizontal Timeline
   ============================================ */

const HowItWorksSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

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
            <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-white/5 flex items-center justify-center">
              <User className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-white/40" />
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center min-h-0">
            <span className="text-[10px] sm:text-xs text-white/40 uppercase tracking-wider mb-2">
              You send
            </span>
            <div className="flex items-baseline gap-1.5 mb-4">
              <span className="text-3xl sm:text-4xl font-bold text-white">
                500
              </span>
              <span className="text-sm sm:text-base text-white/50">USDT</span>
            </div>
            <div className="w-full px-3 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center mb-2">
              <span className="text-[10px] text-white/30 block mb-0.5">
                Recipient gets
              </span>
              <span className="text-sm sm:text-base text-white font-medium">
                1,835 AED
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-white/30">
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
            <span className="text-xs sm:text-sm font-semibold text-white">
              Live Orders
            </span>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10">
              <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
              <span className="text-[8px] sm:text-[10px] text-white/60 font-medium">
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
                    ? "bg-white/[0.06] border border-white/20"
                    : "bg-white/[0.02] border border-white/[0.04]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 sm:w-7 h-6 sm:h-7 rounded-md sm:rounded-lg ${
                        bid.best ? "bg-white/10" : "bg-white/5"
                      } flex items-center justify-center`}
                    >
                      {bid.best ? (
                        <CheckCircle2 className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-white" />
                      ) : (
                        <Building2 className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-white/40" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-semibold text-white block">
                        {bid.rate} AED
                      </span>
                      <span className="text-[8px] sm:text-[10px] text-white/30">
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
          <div className="mt-3 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white/60" />
              <span className="text-[10px] sm:text-xs text-white/40">
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
        <div className="p-3 sm:p-4 md:p-5 lg:p-6 h-full flex flex-col text-left overflow-hidden">
          <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-5 ">
            <div className="flex items-center gap-2 md:gap-2.5">
              <div className="w-7 sm:w-8 md:w-9 lg:w-10 h-7 sm:h-8 md:h-9  rounded-md sm:rounded-lg bg-white flex items-center justify-center">
                <Globe className="w-3 sm:w-3.5 md:w-4 lg:w-4.5 h-3 sm:h-3.5 md:h-4 lg:h-4.5 text-black" />
              </div>
              <span className="text-xs sm:text-sm md:text-base  font-semibold text-white">
                Blipscan
              </span>
            </div>
            <div className="px-2 ml-1  py-0.5 md:py-1 rounded md:rounded-md bg-white/[0.05]">
              <span className="text-[8px] sm:text-[10px] md:text-xs lg:text-sm text-white/40 font-mono">
                Mainnet
              </span>
            </div>
          </div>
          <div className="space-y-2 md:space-y-2.5 lg:space-y-3 flex-1 min-h-0 overflow-hidden">
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
                className="p-2.5 sm:p-3 md:p-3.5 lg:p-4 rounded-lg md:rounded-xl bg-white/[0.02] border border-white/[0.04]"
              >
                <div className="flex items-center justify-between mb-1.5 md:mb-2">
                  <span className="text-[8px] sm:text-[10px] md:text-xs lg:text-sm text-white/40 font-mono">
                    {tx.id}...
                  </span>
                  <div className="flex items-center gap-1 md:gap-1.5 px-1.5 md:px-2 lg:px-2.5 py-0.5 md:py-1 rounded md:rounded-md bg-emerald-500/10">
                    <Check className="w-2.5 sm:w-3 md:w-3.5 lg:w-4 h-2.5 sm:h-3 md:h-3.5 lg:h-4 text-emerald-400" />
                    <span className="text-[8px] sm:text-[10px] md:text-xs lg:text-sm text-emerald-400 font-medium">
                      {tx.time}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm md:text-base lg:text-lg text-white">
                    {tx.to}
                  </span>
                  <span className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-white">
                    {tx.amount}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 md:mt-4 flex items-center gap-1.5 md:gap-2 flex-shrink-0 px-2 md:px-2.5 lg:px-3 py-1.5 md:py-2 rounded-md bg-white/[0.02]">
            <div className="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-emerald-400" />
            <span className="text-[8px] sm:text-[10px] md:text-xs lg:text-sm text-white/40">
              Connected to Solana
            </span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section
      ref={containerRef}
      className="relative py-12 md:py-40 bg-black overflow-hidden"
    >
      {/* Subtle background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-white/[0.02] blur-[100px]" />
      </div>

      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-6"
        style={{ opacity }}
      >
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/[0.03] border border-white/[0.06] mb-5 sm:mb-6 md:mb-8"
          >
            <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#ff6b35]" />
            <span className="text-[10px] sm:text-xs text-white/50 uppercase tracking-wider">
              How it works
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-4 sm:mb-5 md:mb-6 px-4 sm:px-0"
          >
            Three steps.
            <br />
            <span className="text-white/40">Zero friction.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm sm:text-base md:text-lg text-white/40 max-w-md lg:max-w-lg mx-auto px-4 sm:px-0"
          >
            From crypto to cash in under 2 seconds. No banks, no delays, no
            complexity.
          </motion.p>
        </div>

        {/* Steps with phone mockups */}
        <div className="relative">
          {/* Connecting line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-[260px] left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent hidden lg:block"
            style={{ originX: 0 }}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6 lg:gap-10">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="relative text-center"
              >
                {/* App label - Above the phone */}
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-4">
                  <span className="text-sm sm:text-base">{step.appIcon}</span>
                  <span className="text-xs sm:text-sm text-white/50 font-medium">
                    {step.app}
                  </span>
                </div>
                {/* Content */}
                <div className=" sm:hidden mt-8 sm:mt-10 my-6">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-white/10 text-white/60 text-[10px] sm:text-xs font-mono mb-2 sm:mb-3">
                    {step.num}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2 sm:mb-3">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/40 leading-relaxed max-w-[280px] mx-auto px-4 md:px-0">
                    {step.desc}
                  </p>
                </div>
                {/* Phone mockup - optimized for mobile */}
                <div className="relative mx-auto mb-8 w-[200px] sm:w-[220px] md:w-[240px] lg:w-[260px]">
                  <div className="rounded-[32px] sm:rounded-[36px] md:rounded-[38px] lg:rounded-[40px] bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] p-[2px] sm:p-[3px] shadow-[0_20px_40px_rgba(0,0,0,0.5)] sm:shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
                    <div className="rounded-[30px] sm:rounded-[34px] md:rounded-[36px] lg:rounded-[38px] bg-[#0a0a0a] p-[6px] sm:p-[8px] md:p-[9px] lg:p-[10px]">
                      <div className="rounded-[24px] sm:rounded-[28px] md:rounded-[29px] lg:rounded-[30px] bg-black overflow-hidden h-[320px] sm:h-[360px] md:h-[380px] lg:h-[400px] relative">
                        {/* Status bar with time, signal, battery */}
                        <div className="absolute top-0 left-0 right-0 h-8 sm:h-9 lg:h-10 flex items-center justify-between px-4 sm:px-5 lg:px-6 z-20">
                          {/* Time */}
                          <span className="text-[10px] sm:text-xs font-semibold text-white">
                            9:41
                          </span>
                          {/* Right side - Signal, Wifi, Battery */}
                          <div className="flex items-center gap-1 sm:gap-1.5">
                            {/* Signal bars */}
                            <div className="flex items-end gap-[1px] sm:gap-[2px]">
                              <div className="w-[3px] sm:w-1 h-1 sm:h-1.5 bg-white rounded-[1px]" />
                              <div className="w-[3px] sm:w-1 h-1.5 sm:h-2 bg-white rounded-[1px]" />
                              <div className="w-[3px] sm:w-1 h-2 sm:h-2.5 bg-white rounded-[1px]" />
                              <div className="w-[3px] sm:w-1 h-2.5 sm:h-3 bg-white rounded-[1px]" />
                            </div>
                            {/* Wifi */}
                            <svg
                              className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-white"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M12 18c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-4.9-2.3l1.4 1.4c1.9-1.9 5.1-1.9 7 0l1.4-1.4c-2.7-2.7-7.1-2.7-9.8 0zM3.5 12.1l1.4 1.4c3.9-3.9 10.2-3.9 14.1 0l1.4-1.4c-4.7-4.7-12.3-4.7-17 0z" />
                            </svg>
                            {/* Battery */}
                            <div className="flex items-center">
                              <div className="w-5 sm:w-6 h-2.5 sm:h-3 rounded-[3px] border border-white/80 p-[1px] sm:p-[2px]">
                                <div className="h-full w-[80%] bg-white rounded-[1px]" />
                              </div>
                              <div className="w-[2px] h-1 sm:h-1.5 bg-white/80 rounded-r-[1px] ml-[1px]" />
                            </div>
                          </div>
                        </div>

                        {/* Screen content */}
                        <div className="pt-10 sm:pt-11 lg:pt-12 h-full">
                          {step.screen}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="hidden sm:block mt-8 sm:mt-10">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-white/10 text-white/60 text-[10px] sm:text-xs font-mono mb-2 sm:mb-3">
                    {step.num}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2 sm:mb-3">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/40 leading-relaxed max-w-[280px] mx-auto px-4 md:px-0">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HowItWorksSection;
