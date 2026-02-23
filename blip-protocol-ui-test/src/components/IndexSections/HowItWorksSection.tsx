import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import {
  Send,
  RefreshCcw,
  ShieldCheck,
  Globe,
  Lock,
  Zap,
  ArrowRight,
  Wallet,
  CheckCircle2,
  TrendingUp,
  Fingerprint,
  Activity,
  ChevronRight,
  MousePointer2,
  CreditCard,
  Layers,
  Bell,
  Wifi,
  Battery,
  Signal,
  Plus,
  ArrowDownCircle,
  Coins,
} from "lucide-react";
import { CTAButton } from "../Navbar";

// Desktop Phone Mockup Component
const DesktopPhoneMockup = ({ activeSection, steps }) => (
  <div className="relative w-full max-w-[320px] h-[580px]">
    <motion.div
      animate={{ opacity: [0.02, 0.04, 0.02], scale: [1, 1.1, 1] }}
      transition={{ duration: 8, repeat: Infinity }}
      className="absolute inset-0 bg-black dark:bg-white dark:bg-white blur-[140px] rounded-full pointer-events-none"
    />

    <div className="relative z-10 w-full h-full bg-black/5 dark:bg-[#0a0a0a] rounded-[4rem] p-3 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] dark:shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] border-[1.5px] border-black/10 dark:border-white/10 ring-1 ring-black/5 dark:ring-white/5">
      <div className="w-full h-full bg-white dark:bg-black rounded-[3.4rem] p-2 relative overflow-hidden border border-black/5 dark:border-white/5">
        {/* Dynamic Island */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-8 bg-black/70 dark:bg-black rounded-full z-[60] flex items-center justify-between px-5 border border-black/10 dark:border-white/10">
          <div className="w-1.5 h-1.5 rounded-full bg-black/20 dark:bg-white/20" />
          <div className="w-1 h-1 rounded-full dark:bg-black bg-white/70" />
        </div>

        <div className="w-full h-full bg-[#FAF8F5] dark:bg-black rounded-[2.8rem] overflow-hidden relative shadow-[inset_0_0_40px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_40px_rgba(0,0,0,1)]">
          <div className="absolute top-0 left-0 right-0 h-14 flex items-center justify-between px-8 z-[55] text-[10px] font-bold text-black/80 dark:text-white/70 ml-4">
            <span>9:41</span>
            <div className="flex gap-1.5 items-center">
              <Signal size={10} />
              <Wifi size={10} />
              <Battery size={10} />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full"
            >
              {steps[activeSection % 3].screen}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>

    <Cursor
      name="Gateway"
      color="bg-black dark:bg-white"
      textColor="text-white dark:text-black"
      initialPos={{ top: "15%", left: "-25%" }}
      delay={0}
    />
    <Cursor
      name="Blip_Bot"
      color="bg-black/10 dark:bg-white/10"
      textColor="text-black dark:text-white"
      initialPos={{ bottom: "25%", right: "-25%" }}
      delay={2}
    />
  </div>
);

const App = () => {
  const [activeSection, setActiveSection] = useState(0);
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 25,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      const isDesktop = window.innerWidth >= 1024; // lg breakpoint

      if (isDesktop) {
        // Desktop: scroll-based detection for content sections
        const sections = document.querySelectorAll(".content-section");
        const viewportHeight = window.innerHeight;
        const triggerPoint = viewportHeight * 0.45; // More responsive trigger

        let newActiveSection = 0;
        let closestDistance = Infinity;

        sections.forEach((section, index) => {
          const rect = section.getBoundingClientRect();
          const sectionCenter = rect.top + rect.height / 2;
          const distance = Math.abs(sectionCenter - triggerPoint);

          if (
            distance < closestDistance &&
            rect.bottom > 0 &&
            rect.top < viewportHeight
          ) {
            closestDistance = distance;
            newActiveSection = index;
          }
        });

        setActiveSection(newActiveSection);
      } else {
        // Mobile: container-based scroll progress
        if (!containerRef.current) return;
        const container = containerRef.current;
        const rect = container.getBoundingClientRect();
        const scrollProgress = -rect.top / (rect.height - window.innerHeight);

        let newSection = 0;
        if (scrollProgress > 0.5) {
          newSection = 2;
        } else if (scrollProgress > 0.25) {
          newSection = 1;
        }

        setActiveSection(newSection);
      }
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const steps = [
    { title: "Initiation", screen: <RequestScreen /> },
    { title: "Match", screen: <MatchScreen /> },
    { title: "Verify", screen: <VerifyScreen /> },
  ];

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-[#FAF8F5] dark:bg-black text-black dark:text-white selection:bg-black/[0.10] isolate py-12 md:py-20"
    >
      <div className="text-center mb-12 lg:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] mb-4"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white" />
          <span className="text-[10px] text-black dark:text-white/50 uppercase tracking-wider">
            How it works
          </span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black dark:text-white tracking-tight leading-[1.1] mb-3"
        >
          Three steps.
          <br />
          <span className="text-black/80 dark:text-white/50">
            Zero friction.
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.1 }}
          className="text-sm md:text-base text-black/80 dark:text-white/50 font-medium max-w-2xl mx-auto px-2"
        >
          From crypto to cash in under 2 seconds.
          <br /> No banks, no delays, no complexity.
        </motion.p>
      </div>

      {/* Top Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[1px] bg-black/20 dark:bg-white/20 z-[100] origin-left"
        style={{ scaleX }}
      />

      {/* MOBILE LAYOUT - Card-based instead of phone mockup */}
      <div className="lg:hidden max-w-7xl mx-auto px-4 space-y-12 py-8">
        {/* Step 1: Initiation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06]">
            <span className="text-xs text-black/60 dark:text-white/40 font-bold tracking-widest uppercase">
              01 • Initiation
            </span>
          </div>

          <h3 className="text-2xl font-semibold leading-snug text-black dark:text-white">
            Request Your <br />
            <span className="text-black/70 dark:text-white/50">
              Capital Flow.
            </span>
          </h3>

          <p className="text-base text-black/80 dark:text-white/60 leading-relaxed">
            Enter your USDT amount and choose your destination — Dubai, Abu
            Dhabi, or beyond. Blip handles the rest with sub-second finality
            across UAE fiat rails.
          </p>

          <div className="bg-white/80 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/10 p-5 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center">
                <Send size={18} className="text-black/60 dark:text-white/50" />
              </div>
              <div>
                <p className="text-sm font-semibold text-black dark:text-white">
                  Quick Request
                </p>
                <p className="text-xs text-black/50 dark:text-white/30">
                  DXB • AUH destinations
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {["USDT → AED", "DXB • AUH", "SECURE AUTH"].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-black/5 dark:bg-white/5 rounded-full text-xs font-semibold text-black/60 dark:text-white/40"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Step 2: Match */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06]">
            <span className="text-xs text-black/60 dark:text-white/40 font-bold tracking-widest uppercase">
              02 • Match
            </span>
          </div>

          <h3 className="text-2xl font-semibold leading-snug text-black dark:text-white">
            Price <br />
            <span className="text-black/70 dark:text-white/50">
              Optimization.
            </span>
          </h3>

          <p className="text-base text-black/80 dark:text-white/60 leading-relaxed">
            Our engine simultaneously scans global LPs — London, Singapore,
            local OTC — locking in the best real-time AED rate for your trade.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/80 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/10 p-4 rounded-2xl">
              <Layers
                size={18}
                className="text-black/40 dark:text-white/40 mb-2"
              />
              <p className="text-sm font-semibold text-black dark:text-white mb-0.5">
                Best Rate
              </p>
              <p className="text-xs text-black/40 dark:text-white/30 font-medium">
                1 USDT = 3.6732 AED
              </p>
            </div>
            <div className="bg-white/80 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/10 p-4 rounded-2xl">
              <Activity
                size={18}
                className="text-black/40 dark:text-white/40 mb-2"
              />
              <p className="text-sm font-semibold text-black dark:text-white mb-0.5">
                99.98% Efficient
              </p>
              <p className="text-xs text-black/40 dark:text-white/30 font-medium">
                Global LP Scan
              </p>
            </div>
          </div>
        </motion.div>

        {/* Step 3: Verify */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06]">
            <span className="text-xs text-black/60 dark:text-white/40 font-bold tracking-widest uppercase">
              03 • Verify
            </span>
          </div>

          <h3 className="text-2xl font-semibold leading-snug text-black dark:text-white">
            Secure <br />
            <span className="text-black/70 dark:text-white/50">Execution.</span>
          </h3>

          <p className="text-base text-black/80 dark:text-white/60 leading-relaxed">
            Authorization confirmed. Settlement executes in 420ms — your AED
            is released to your destination with a permanent on-chain ledger
            ID.
          </p>

          <div className="bg-white/80 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/10 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 bg-black/[0.03] dark:bg-white/5 border-b border-black/[0.06] dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={16}
                  className="text-black/60 dark:text-white/50"
                />
                <span className="text-xs font-semibold text-black/60 dark:text-white/40 uppercase tracking-wider">
                  Verified
                </span>
              </div>
              <span className="text-xs font-semibold text-black dark:text-white">
                420ms
              </span>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Fingerprint
                    size={14}
                    className="text-black/60 dark:text-white/40"
                  />
                  <span className="text-xs font-medium text-black/60 dark:text-white/40">
                    Authorization
                  </span>
                </div>
                <span className="text-xs font-semibold text-black dark:text-white/70">
                  Success
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-black dark:text-white" />
                  <span className="text-xs font-medium text-black/60 dark:text-white/40">
                    Settlement
                  </span>
                </div>
                <span className="text-xs font-semibold text-black dark:text-white/70">
                  Instant
                </span>
              </div>
            </div>
          </div>
          <div className="flex md:justify-start justify-center">
            <CTAButton
              to="/waitlist"
              className="w-[220px] h-12 uppercase text-sm "
            >
              Initiate Trade
            </CTAButton>{" "}
          </div>
        </motion.div>
      </div>

      {/* DESKTOP LAYOUT - Sticky phone with scrolling content sections */}
      <div className="hidden lg:block max-w-7xl mx-auto px-8 lg:px-12 flex-col lg:flex-row gap-16 relative min-h-screen">
        <div className="flex gap-16">
          {/* LEFT SIDE: Sticky Phone UI */}
          <div className="w-full lg:w-[45%] lg:sticky lg:top-0 h-screen flex items-center justify-center py-12">
            <DesktopPhoneMockup activeSection={activeSection} steps={steps} />
          </div>

          {/* RIGHT SIDE: Content Narrative */}
          <div className="w-full lg:w-[55%] min-h-[150vh] flex flex-col lg:mt-32 justify-end space-y-40 pb-[calc(50vh-290px)]">
            {/* Section 01: Initiation */}
            <section className="content-section space-y-8">
              {/* <div className="space-y-3 ">
                <span className="text-black/80 dark:text-white/50 font-bold tracking-[0.3em] uppercase text-xs">
                  Initiation
                </span>

                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="text-3xl font-semibold tracking-tight leading-tight text-black dark:text-white"
                >
                  Request Your <br />
                  <span className="text-black/70 dark:text-white/50">
                    Capital Flow.
                  </span>
                </motion.span>
              </div> */}
              <div className="space-y-3">
                <span className="text-black/80 dark:text-white/50 font-bold tracking-[0.3em] uppercase text-xs">
                  Initiation
                </span>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="text-3xl font-semibold tracking-tight leading-tight text-black dark:text-white"
                >
                  Request Your <br />
                  <span className="text-black/70 dark:text-white/50  decoration-black/10 dark:decoration-white/10">
                    Capital Flow.
                  </span>
                </motion.h2>
              </div>

              <p className="text-lg text-black/80 dark:text-white/60 leading-relaxed max-w-xl">
                Enter your USDT amount and choose your destination — Dubai, Abu
                Dhabi, or beyond. Blip handles the rest with sub-second
                finality across UAE fiat rails.
              </p>

              <div className="bg-white/80 dark:bg-white/[0.03] border-l border-black/10 dark:border-white/10 p-6 rounded-r-2xl backdrop-blur-md">
                <p className="text-base leading-relaxed text-black/70 dark:text-white/60">
                  <span className="font-semibold text-black dark:text-white">
                    Smart Routing:
                  </span>{" "}
                  Blip instantly routes your funds to your chosen destination
                  (DXB or AUH) with zero intermediaries and full on-chain
                  transparency.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {["USDT → AED", "DXB • AUH", "SECURE AUTH"].map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 bg-white/80 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/10 rounded-full text-xs font-semibold tracking-widest text-black/80 dark:text-white/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            {/* Section 02: Match */}
            <section className="content-section space-y-8">
              <div className="space-y-3">
                <span className="text-black/80 dark:text-white/50 font-bold tracking-[0.3em] uppercase text-xs">
                  Match
                </span>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="text-3xl font-semibold tracking-tight leading-tight text-black dark:text-white"
                >
                  Price <br />
                  <span className="text-black/70 dark:text-white/50  decoration-black/10 dark:decoration-white/10">
                    Optimization.
                  </span>
                </motion.h2>
              </div>

              <p className="text-lg text-black/80 dark:text-white/60 leading-relaxed max-w-xl">
                Our engine simultaneously scans global liquidity providers —
                from London to Singapore to local OTC desks — locking in the
                best real-time AED rate for your trade.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-6 bg-white/80 dark:bg-white/[0.03] rounded-2xl border border-black/[0.06] dark:border-white/5 transition-all">
                  <Layers
                    className="text-black/40 dark:text-white/40 mb-4"
                    size={20}
                  />
                  <h4 className="font-semibold text-base mb-1 text-black dark:text-white">
                    Best Rate
                  </h4>
                  <p className="text-xs text-black/40 dark:text-white/30 font-medium tracking-widest uppercase">
                    1 USDT = 3.6732 AED
                  </p>
                </div>

                <div className="p-6 bg-white/80 dark:bg-white/[0.03] rounded-2xl border border-black/[0.06] dark:border-white/5 transition-all">
                  <Activity
                    className="text-black/40 dark:text-white/40 mb-4"
                    size={20}
                  />
                  <h4 className="font-semibold text-base mb-1 text-black dark:text-white">
                    99.98% Efficient
                  </h4>
                  <p className="text-xs text-black/40 dark:text-white/30 font-medium tracking-widest uppercase">
                    Global LP Scan
                  </p>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-white/5  border-black/20 dark:border-white/20 p-6 rounded-2xl backdrop-blur-md">
                <p className="text-base leading-relaxed text-black/70 dark:text-white/70">
                  <span className="font-semibold text-black dark:text-white">
                    Global Scan, Local Settlement:
                  </span>{" "}
                  We source the best price across London, Singapore, and local
                  OTC desks — then settle directly into your UAE destination at
                  99.98% efficiency.
                </p>
              </div>
            </section>

            {/* Section 03: Verify */}
            <section className="content-section space-y-8">
              <div className="space-y-3">
                <span className="text-black/80 dark:text-white/50 font-bold tracking-[0.3em] uppercase text-xs">
                  Verify
                </span>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="text-3xl font-semibold tracking-tight leading-tight text-black dark:text-white"
                >
                  Secure <br />
                  <span className="text-black/70 dark:text-white/50">
                    Execution.
                  </span>
                </motion.h2>
              </div>

              <p className="text-lg text-black/80 dark:text-white/60 leading-relaxed max-w-xl">
                Authorization confirmed. Settlement executes in 420ms — your
                AED is released to your destination with a permanent on-chain
                ledger ID.
              </p>

              <div className="bg-white/90 dark:bg-[#080808] rounded-2xl overflow-hidden shadow-xl border border-black/[0.06] dark:border-white/10">
                <div className="flex items-center justify-between px-6 py-3 bg-black/[0.03] dark:bg-white/5 border-b border-black/[0.06] dark:border-white/5">
                  <div className="text-xs text-black/40 dark:text-white/20 font-mono tracking-widest uppercase">
                    trade_finalize.v1
                  </div>
                </div>

                <div className="p-6 font-mono text-sm leading-relaxed text-black/80 dark:text-white/50 space-y-2">
                  <div>01 await ledger.confirm(trade_USDT_AED);</div>
                  <div>02 // Status: Compliance Verified</div>
                  <div>03 const receipt = "AED_TX_DUBAI_SAFE";</div>
                  <div>04 blip.release(receipt);</div>
                </div>
              </div>

              <CTAButton
                to="/waitlist"
                className="w-[220px] h-12 uppercase text-sm"
              >
                Initiate Trade
              </CTAButton>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- APP SCREENS ---

const RequestScreen = () => (
  <div className="p-4 pt-[8vh] flex flex-col h-full bg-[#FAF8F5] dark:bg-black text-black dark:text-white font-sans">
    <div className="flex justify-between items-start mb-3">
      <div>
        <p className="text-[0.65em] font-semibold text-black/40 dark:text-white/30 uppercase tracking-[0.2em] mb-0.5">
          Portfolio
        </p>
        <h3 className="text-[2em] font-semibold tracking-tight text-black dark:text-white/90">
          24,500.00
        </h3>
        <p className="text-[0.65em] text-black/60 dark:text-white/50 font-medium mt-0.5 tracking-tight italic">
          USDT (ERC-20)
        </p>
      </div>
      <div className="w-8 h-8 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center">
        <Bell size={14} className="text-black/50 dark:text-white/40" />
      </div>
    </div>

    <div className="space-y-1">
      <div className="bg-white/80 dark:bg-white/[0.03] p-2.5 rounded-[2rem] border border-black/[0.06] dark:border-white/5">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[0.65em] font-semibold text-black/50 dark:text-white/30 uppercase tracking-widest">
            Swap
          </span>
          <span className="text-[0.65em] text-black/60 dark:text-white/40 font-medium uppercase tracking-wider">
            Sell
          </span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-[2em] font-semibold tracking-tight text-black dark:text-white/90">
            10,000
          </span>
          <span className="text-[0.7em] font-semibold text-black/60 dark:text-white/50 tracking-widest uppercase">
            USDT
          </span>
        </div>
      </div>

      <div className="flex justify-center -my-5 relative z-10">
        <div className="bg-[#FAF8F5] dark:bg-black p-1">
          <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 w-8 h-8 rounded-full flex items-center justify-center text-black/60 dark:text-white/50 shadow-xl">
            <ArrowRight size={16} className="rotate-90" />
          </div>
        </div>
      </div>

      <div className="bg-black dark:bg-white p-3.5 rounded-[2rem] shadow-2xl">
        <div className="flex justify-between items-center mb-1.5 text-white/60 dark:text-black/70">
          <span className="text-[0.65em] font-semibold uppercase tracking-widest">
            Receive
          </span>
          <span className="text-[0.65em] font-medium tracking-wider">
            Spot_AED
          </span>
        </div>
        <div className="flex justify-between items-baseline text-white dark:text-black">
          <span className="text-[2em] font-semibold tracking-tight">
            36,730
          </span>
          <span className="text-[0.7em] font-semibold opacity-60 uppercase tracking-widest font-mono italic">
            AED
          </span>
        </div>
      </div>
    </div>

    <div className="mt-3">
      <p className="text-[0.65em] font-semibold text-black/50 dark:text-white/30 uppercase tracking-widest mb-1.5">
        Destination
      </p>
      <div className="flex gap-2">
        <div className="w-9 h-9 rounded-full bg-black/10 dark:bg-white/10 border border-black/10 dark:border-white/10 flex items-center justify-center text-[0.7em] font-semibold text-black dark:text-white/70">
          DXB
        </div>
        <div className="w-9 h-9 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-[0.7em] font-semibold text-black/60 dark:text-white/40">
          AUH
        </div>
        <div className="w-9 h-9 rounded-full border border-dashed border-black/10 dark:border-white/10 flex items-center justify-center text-black/50 dark:text-white/30">
          <Plus size={11} />
        </div>
      </div>
    </div>

    <div className="mt-1 mb-2.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-black/60 dark:text-white/50 py-2 rounded-3xl text-center font-semibold text-[0.65em] uppercase tracking-[0.2em] flex items-center justify-center gap-2">
      <Lock size={9} className="text-black dark:text-white" />
      Secure Authorization
    </div>
  </div>
);

const MatchScreen = () => (
  <div className="p-4 pt-[12vh] flex flex-col h-full bg-[#FAF8F5] dark:bg-black items-center font-sans">
    <div className="relative w-24 h-24 mb-4">
      <motion.div
        animate={{ rotate: 360, opacity: [0.05, 0.1, 0.05] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 border border-black/10 dark:border-white/10 rounded-full"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute inset-6 border border-black/5 dark:border-white/5 border-dashed rounded-full"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-full border border-black/10 dark:border-white/10 flex flex-col items-center justify-center shadow-2xl text-black/60 dark:text-white/50">
          <RefreshCcw size={22} className="mb-0.5" />
          <span className="text-[0.5em] font-semibold tracking-[0.2em] uppercase text-black/50 dark:text-white/30">
            Routing
          </span>
        </div>
      </div>
    </div>

    <div className="w-full space-y-1">
      <div className="flex justify-between items-baseline px-2 mb-1">
        <h3 className="text-[1.3em] font-semibold text-black dark:text-white/90 tracking-tight">
          Liquidity
        </h3>
        <span className="text-[0.6em] text-black dark:text-white font-semibold tracking-[0.2em] uppercase animate-pulse">
          Syncing AED
        </span>
      </div>

      {[
        { city: "London LP", value: "3.6732", active: true },
        { city: "Singapore LP", value: "3.6719", active: false },
        { city: "Local OTC", value: "3.6730", active: false },
      ].map((node, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 dark:bg-white/[0.02] p-2.5 rounded-2xl border border-black/[0.06] dark:border-white/5 flex items-center justify-between"
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-1.5 h-1.5 rounded-full bg-black/20 dark:bg-white/10 `}
            />
            <div>
              <p className="text-[0.7em] font-semibold text-black dark:text-white/70 uppercase tracking-tight">
                {node.city}
              </p>
              <p className="text-[0.6em] text-black/60 dark:text-white/40 tracking-widest font-mono">
                RATE: {node.value}
              </p>
            </div>
          </div>
          <span
            className={`text-[0.6em] font-semibold tracking-widest uppercase ${node.active ? "text-black dark:text-white/70" : "text-black/50 dark:text-white/30"}`}
          >
            {node.active ? "Match" : "Wait"}
          </span>
        </motion.div>
      ))}
    </div>

    <div className="mt-auto w-full p-2.5 bg-white/80 dark:bg-white/5 rounded-2xl border border-black/[0.06] dark:border-white/5 flex justify-between items-center mb-2.5">
      <span className="text-[0.6em] font-semibold text-black/60 dark:text-white/40 uppercase tracking-[0.2em]">
        Efficiency
      </span>
      <span className="text-[0.9em] font-semibold text-black dark:text-white/90 tracking-tight">
        99.98%
      </span>
    </div>
  </div>
);

const VerifyScreen = () => (
  <div className="p-4 pt-[15vh] flex flex-col h-full bg-[#FAF8F5] dark:bg-black items-center font-sans text-center">
    <div className="flex flex-col items-center justify-center flex-1 w-full">
      <div className="relative mb-3">
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 15 }}
          className="relative w-14 h-14 bg-black dark:bg-white rounded-full flex items-center justify-center shadow-2xl"
        >
          <CheckCircle2 size={24} className="text-white dark:text-black" />
        </motion.div>
      </div>

      <h3 className="text-[1.6em] font-semibold text-black dark:text-white/90 uppercase tracking-[0.1em]">
        Settled
      </h3>
      <p className="text-[0.65em] text-black/50 dark:text-white/30 font-semibold tracking-[0.3em] uppercase mt-2">
        LEDGER_ID: 0x9A...F21
      </p>
    </div>

    <div className="w-full space-y-1 mb-2.5">
      <div className="bg-white/80 dark:bg-white/5 p-2.5 rounded-2xl border border-black/[0.06] dark:border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Fingerprint size={12} className="text-black/60 dark:text-white/40" />
          <span className="text-[0.6em] font-semibold text-black/60 dark:text-white/40 uppercase tracking-widest">
            Authorization
          </span>
        </div>
        <span className="text-[0.6em] font-semibold text-black dark:text-white/70 tracking-widest uppercase">
          Success
        </span>
      </div>
      <div className="bg-white/80 dark:bg-white/5 p-2.5 rounded-2xl border border-black/[0.06] dark:border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Zap size={12} className="text-black dark:text-white" />
          <span className="text-[0.6em] font-semibold text-black/60 dark:text-white/40 uppercase tracking-widest">
            Settlement
          </span>
        </div>
        <span className="text-[0.6em] font-semibold text-black dark:text-white/70 tracking-widest uppercase">
          420MS
        </span>
      </div>
    </div>
  </div>
);

const Cursor = ({ name, color, textColor, initialPos, delay }) => (
  <motion.div
    animate={{
      x: [0, 8, -5, 0],
      y: [0, -12, 4, 0],
    }}
    transition={{
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }}
    style={initialPos}
    className="absolute z-20 pointer-events-none hidden lg:block"
  >
    <div className="relative">
      <div
        className={`${color} ${textColor} text-[8px] px-3.5 py-1.5 rounded-full rounded-tl-none font-black shadow-2xl flex items-center gap-2 tracking-[0.2em] uppercase`}
      >
        <MousePointer2 size={10} fill="currentColor" />
        {name}
      </div>
    </div>
  </motion.div>
);

export default App;
