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

// Desktop Phone Mockup Component — iPhone 17 Pro / Black Titanium
const DesktopPhoneMockup = ({ activeSection, steps }) => {
  const FRAME = 11;
  const OUTER_R = 48;
  const INNER_R = 38;
  const SIDEBUTTON = 3;
  return (
    <div className="relative w-full max-w-[300px] h-[600px] mx-auto">
      <motion.div
        animate={{ y: [0, -9, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "relative", width: "100%", height: "100%" }}
      >
        {/* ── Black Titanium outer frame ── */}
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: OUTER_R,
            padding: FRAME,
            position: "relative",
            background: `linear-gradient(
              158deg,
              #a0a0a5 0%,
              #6c6c70 4%,
              #3a3a3c 12%,
              #2c2c2e 28%,
              #1c1c1e 46%,
              #2c2c2e 64%,
              #3d3d3f 78%,
              #5a5a5e 90%,
              #8a8a8f 100%
            )`,
            boxShadow: [
              "0 100px 180px -20px rgba(0,0,0,0.95)",
              "0 50px 80px rgba(0,0,0,0.7)",
              "0 20px 40px rgba(0,0,0,0.5)",
              "inset 0 1px 0 rgba(255,255,255,0.22)",
              "inset 0 0 0 1px rgba(255,255,255,0.07)",
              "0 0 80px rgba(255,107,53,0.09)",
            ].join(", "),
          }}
        >
          {/* Top edge catch-light */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "18%",
              right: "18%",
              height: 1,
              borderRadius: "50%",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.52), transparent)",
              zIndex: 30,
            }}
          />
          {/* Bottom secondary catch-light */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: "30%",
              right: "30%",
              height: 1,
              borderRadius: "50%",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)",
              zIndex: 30,
            }}
          />

          {/* Dynamic Island */}
          <div
            style={{
              position: "absolute",
              top: FRAME + 13,
              left: "50%",
              transform: "translateX(-50%)",
              width: 112,
              height: 32,
              background: "#000",
              borderRadius: 999,
              zIndex: 20,
              boxShadow:
                "inset 0 1px 2px rgba(0,0,0,0.8), 0 0 0 0.5px rgba(255,255,255,0.04)",
            }}
          />

          {/* Left buttons */}
          <div
            style={{
              position: "absolute",
              left: -SIDEBUTTON - 1,
              top: 72,
              width: SIDEBUTTON,
              height: 28,
              borderRadius: "1px 0 0 3px",
              background: "linear-gradient(to right, #111, #2e2e30)",
              zIndex: 10,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: -SIDEBUTTON - 1,
              top: 118,
              width: SIDEBUTTON + 1,
              height: 54,
              borderRadius: "3px 0 0 3px",
              background: "linear-gradient(to right, #111, #2e2e30)",
              zIndex: 10,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: -SIDEBUTTON - 1,
              top: 184,
              width: SIDEBUTTON + 1,
              height: 54,
              borderRadius: "3px 0 0 3px",
              background: "linear-gradient(to right, #111, #2e2e30)",
              zIndex: 10,
            }}
          />

          {/* Power button */}
          <div
            style={{
              position: "absolute",
              right: -SIDEBUTTON - 1,
              top: 148,
              width: SIDEBUTTON + 1,
              height: 72,
              borderRadius: "0 3px 3px 0",
              background: "linear-gradient(to left, #111, #2e2e30)",
              zIndex: 10,
            }}
          />

          {/* ── Screen ── */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              borderRadius: INNER_R,
              overflow: "hidden",
              background: "#000",
            }}
          >
            {/* Status bar */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 52,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 22px 0 26px",
                zIndex: 55,
                color: "rgba(255,255,255,0.7)",
                fontSize: 10,
                fontWeight: 700,
              }}
            >
              <span>9:41</span>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
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
                style={{ width: "100%", height: "100%" }}
              >
                {steps[activeSection % 3].screen}
              </motion.div>
            </AnimatePresence>

            {/* Glass glare overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(138deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.02) 25%, transparent 50%, transparent 75%, rgba(255,255,255,0.018) 100%)",
                pointerEvents: "none",
                zIndex: 60,
                borderRadius: "inherit",
              }}
            />
          </div>
        </div>

        {/* Ambient glow beneath */}
        <div
          style={{
            position: "absolute",
            bottom: -55,
            left: "50%",
            transform: "translateX(-50%)",
            width: 240,
            height: 55,
            background:
              "radial-gradient(ellipse, rgba(255,107,53,0.2) 0%, transparent 70%)",
            filter: "blur(20px)",
            pointerEvents: "none",
          }}
        />
      </motion.div>

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
};

const App = () => {
  const [activeSection, setActiveSection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

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
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold text-black dark:text-white tracking-[-0.025em] leading-[0.96] mb-3"
        >
          Three steps.
          <br />
          <span className="text-black/70 dark:text-white/50">
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
          className="space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06]">
            <span className="text-xs text-black/60 dark:text-white/40 font-bold tracking-widest uppercase">
              01 • Initiation
            </span>
          </div>
          <h3
            className="font-sans font-semibold leading-[1.05] tracking-[-0.032em] select-none text-black dark:text-white [filter:drop-shadow(0_2px_14px_rgba(0,0,0,0.06))] dark:[filter:drop-shadow(0_2px_14px_rgba(255,255,255,0.055))]"
            style={{ fontSize: "clamp(2rem, 5.5vw, 4rem)" }}
          >
            Request Your
            <br />
            <span className="text-black/60 dark:text-white/50">
              Capital Flow.
            </span>
          </h3>
          <p className="text-sm text-black/60 dark:text-white/40 leading-relaxed">
            Enter your USDT amount and choose your destination — Dubai, Abu
            Dhabi, or beyond.
          </p>
        </motion.div>

        {/* Step 2: Match */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06]">
            <span className="text-xs text-black/60 dark:text-white/40 font-bold tracking-widest uppercase">
              02 • Match
            </span>
          </div>
          <h3
            className="font-sans font-semibold leading-[1.05] tracking-[-0.032em] select-none text-black dark:text-white [filter:drop-shadow(0_2px_14px_rgba(0,0,0,0.06))] dark:[filter:drop-shadow(0_2px_14px_rgba(255,255,255,0.055))]"
            style={{ fontSize: "clamp(2rem, 5.5vw, 4rem)" }}
          >
            Price
            <br />
            <span className="text-black/60 dark:text-white/50">
              Optimization.
            </span>
          </h3>
          <p className="text-sm text-black/60 dark:text-white/40 leading-relaxed">
            Our engine scans global LPs — London, Singapore, local OTC — locking
            in the best real-time AED rate.
          </p>
        </motion.div>

        {/* Step 3: Verify */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06]">
            <span className="text-xs text-black/60 dark:text-white/40 font-bold tracking-widest uppercase">
              03 • Verify
            </span>
          </div>
          <h3
            className="font-sans font-semibold leading-[1.05] tracking-[-0.032em] select-none text-black dark:text-white [filter:drop-shadow(0_2px_14px_rgba(0,0,0,0.06))] dark:[filter:drop-shadow(0_2px_14px_rgba(255,255,255,0.055))]"
            style={{ fontSize: "clamp(2rem, 5.5vw, 4rem)" }}
          >
            Secure
            <br />
            <span className="text-black/60 dark:text-white/50">Execution.</span>
          </h3>
          <p className="text-sm text-black/60 dark:text-white/40 leading-relaxed">
            Settlement executes in 420ms — AED released to your destination with
            a permanent on-chain ledger ID.
          </p>
          <div className="flex md:justify-start justify-center pt-1">
            <CTAButton
              to="/waitlist"
              className="w-[220px] h-12 uppercase text-sm"
            >
              Initiate Trade
            </CTAButton>
          </div>
        </motion.div>
      </div>

      {/* DESKTOP LAYOUT - Sticky phone with scrolling content sections */}
      <div className="hidden lg:block max-w-7xl mx-auto px-8 lg:px-12 relative">
        <div className="flex gap-16">
          {/* LEFT SIDE: Sticky Phone UI */}
          <div className="w-full lg:w-[45%] lg:sticky lg:top-0 h-screen flex items-center justify-center py-12">
            <DesktopPhoneMockup activeSection={activeSection} steps={steps} />
          </div>

          {/* RIGHT SIDE: Content Narrative */}
          <div className="w-full lg:w-[55%] flex flex-col">
            {/* Section 01: Initiation */}
            <section className="content-section space-y-4 min-h-screen flex flex-col justify-start pt-[20vh]">
              <span className="text-black/80 dark:text-white/50 font-bold tracking-[0.3em] uppercase text-xs">
                Initiation
              </span>
              <motion.h2
                initial={{ opacity: 0, scale: 0.99 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="font-sans font-semibold leading-[1.05] tracking-[-0.032em] select-none text-black dark:text-white [filter:drop-shadow(0_2px_14px_rgba(0,0,0,0.06))] dark:[filter:drop-shadow(0_2px_14px_rgba(255,255,255,0.055))]"
                style={{ fontSize: "clamp(2rem, 5.5vw, 4rem)" }}
              >
                Request Your
                <br />
                <span className="text-black/60 dark:text-white/50">
                  Capital Flow.
                </span>
              </motion.h2>
              <p className="text-sm text-black/60 dark:text-white/40 leading-relaxed max-w-md">
                Enter your USDT amount and choose your destination — Dubai, Abu
                Dhabi, or beyond.
              </p>
            </section>

            {/* Section 02: Match */}
            <section className="content-section space-y-4 min-h-screen flex flex-col justify-start pt-[20vh]">
              <span className="text-black/80 dark:text-white/50 font-bold tracking-[0.3em] uppercase text-xs">
                Match
              </span>
              <motion.h2
                initial={{ opacity: 0, scale: 0.99 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="font-sans font-semibold leading-[1.05] tracking-[-0.032em] select-none text-black dark:text-white [filter:drop-shadow(0_2px_14px_rgba(0,0,0,0.06))] dark:[filter:drop-shadow(0_2px_14px_rgba(255,255,255,0.055))]"
                style={{ fontSize: "clamp(2rem, 5.5vw, 4rem)" }}
              >
                Price
                <br />
                <span className="text-black/60 dark:text-white/50">
                  Optimization.
                </span>
              </motion.h2>
              <p className="text-sm text-black/60 dark:text-white/40 leading-relaxed max-w-md">
                Our engine scans global LPs — London, Singapore, local OTC —
                locking in the best real-time AED rate.
              </p>
            </section>

            {/* Section 03: Verify */}
            <section className="content-section space-y-4 min-h-screen flex flex-col justify-start pt-[20vh] pb-[30vh]">
              <span className="text-black/80 dark:text-white/50 font-bold tracking-[0.3em] uppercase text-xs">
                Verify
              </span>
              <motion.h2
                initial={{ opacity: 0, scale: 0.99 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="font-sans font-semibold leading-[1.05] tracking-[-0.032em] select-none text-black dark:text-white [filter:drop-shadow(0_2px_14px_rgba(0,0,0,0.06))] dark:[filter:drop-shadow(0_2px_14px_rgba(255,255,255,0.055))]"
                style={{ fontSize: "clamp(2rem, 5.5vw, 4rem)" }}
              >
                Secure
                <br />
                <span className="text-black/60 dark:text-white/50">
                  Execution.
                </span>
              </motion.h2>
              <p className="text-sm text-black/60 dark:text-white/40 leading-relaxed max-w-md">
                Settlement executes in 420ms — AED released to your destination
                with a permanent on-chain ledger ID.
              </p>
              <div className="mt-auto">
                <CTAButton
                  to="/waitlist"
                  className="w-[220px] h-12 uppercase text-sm"
                >
                  Initiate Trade
                </CTAButton>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- APP SCREENS ---

const RequestScreen = () => (
  <div
    className="flex flex-col h-full bg-black text-white font-sans relative overflow-hidden"
    style={{ paddingTop: 52 }}
  >
    {/* Subtle orange ambient at bottom */}
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: "40%",
        background:
          "radial-gradient(ellipse at 50% 100%, rgba(255,107,53,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }}
    />

    <div className="flex-1 flex flex-col gap-2.5 px-4 pb-3">
      {/* Portfolio header */}
      <div className="flex justify-between items-start pt-1">
        <div>
          <p
            style={{
              fontSize: 9,
              fontWeight: 600,
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: 2,
            }}
          >
            Portfolio
          </p>
          <p
            style={{
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#fff",
              lineHeight: 1,
            }}
          >
            24,500.00
          </p>
          <p
            style={{
              fontSize: 9,
              color: "rgba(255,255,255,0.35)",
              fontWeight: 500,
              marginTop: 3,
            }}
          >
            USDT (ERC-20)
          </p>
        </div>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Bell size={13} style={{ color: "rgba(255,255,255,0.35)" }} />
        </div>
      </div>

      {/* Swap from card */}
      <div
        style={{
          background: "rgba(255,255,255,0.04)",
          borderRadius: 22,
          padding: "10px 14px",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 4,
          }}
        >
          <span
            style={{
              fontSize: 9,
              fontWeight: 600,
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            Swap
          </span>
          <span
            style={{
              fontSize: 9,
              color: "rgba(255,255,255,0.35)",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Sell
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <span
            style={{
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#fff",
            }}
          >
            10,000
          </span>
          <span
            style={{
              fontSize: 9,
              fontWeight: 600,
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            USDT
          </span>
        </div>
      </div>

      {/* Arrow */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "-4px 0",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "#000",
            border: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ArrowRight
            size={13}
            style={{
              transform: "rotate(90deg)",
              color: "rgba(255,255,255,0.45)",
            }}
          />
        </div>
      </div>

      {/* Receive card — orange accent */}
      <div
        style={{
          borderRadius: 22,
          padding: "10px 14px",
          background:
            "linear-gradient(135deg, rgba(255,107,53,0.12) 0%, rgba(255,107,53,0.05) 100%)",
          border: "1px solid rgba(255,107,53,0.22)",
          boxShadow: "0 0 30px rgba(255,107,53,0.07)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 4,
          }}
        >
          <span
            style={{
              fontSize: 9,
              fontWeight: 600,
              color: "rgba(255,107,53,0.7)",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            Receive
          </span>
          <span
            style={{
              fontSize: 9,
              color: "rgba(255,107,53,0.55)",
              fontWeight: 500,
              letterSpacing: "0.1em",
            }}
          >
            Spot_AED
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <span
            style={{
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#fff",
            }}
          >
            36,730
          </span>
          <span
            style={{
              fontSize: 9,
              fontWeight: 600,
              color: "rgba(255,107,53,0.55)",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            AED
          </span>
        </div>
      </div>

      {/* Destination */}
      <div>
        <p
          style={{
            fontSize: 9,
            fontWeight: 600,
            color: "rgba(255,255,255,0.28)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          Destination
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <div
            style={{
              height: 32,
              padding: "0 12px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.14)",
              display: "flex",
              alignItems: "center",
              fontSize: 9,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "0.06em",
            }}
          >
            DXB
          </div>
          <div
            style={{
              height: 32,
              padding: "0 12px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              fontSize: 9,
              fontWeight: 600,
              color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.06em",
            }}
          >
            AUH
          </div>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 999,
              border: "1px dashed rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Plus size={10} style={{ color: "rgba(255,255,255,0.28)" }} />
          </div>
        </div>
      </div>

      {/* Auth button */}
      <div
        style={{
          marginTop: "auto",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 999,
          padding: "9px 0",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 7,
          fontSize: 9,
          fontWeight: 700,
          color: "rgba(255,255,255,0.45)",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
        }}
      >
        <Lock size={9} style={{ color: "rgba(255,255,255,0.55)" }} />
        Secure Authorization
      </div>
    </div>
  </div>
);

const MatchScreen = () => (
  <div
    className="flex flex-col h-full bg-black text-white font-sans items-center relative overflow-hidden"
    style={{ paddingTop: 52 }}
  >
    {/* Background pulse glow */}
    <div
      style={{
        position: "absolute",
        top: "28%",
        left: "50%",
        transform: "translateX(-50%)",
        width: 160,
        height: 160,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(255,107,53,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }}
    />

    <div
      className="w-full px-4 flex flex-col items-center flex-1 pb-3"
      style={{ paddingTop: 16 }}
    >
      {/* Radar animation */}
      <div
        style={{
          position: "relative",
          width: 96,
          height: 96,
          marginBottom: 16,
          flexShrink: 0,
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "1px solid rgba(255,107,53,0.15)",
          }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            inset: 10,
            borderRadius: "50%",
            border: "1px dashed rgba(255,255,255,0.08)",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.6, 1], opacity: [0.15, 0, 0.15] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
          style={{
            position: "absolute",
            inset: 16,
            borderRadius: "50%",
            border: "1px solid rgba(255,107,53,0.3)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: "50%",
              background: "rgba(255,107,53,0.08)",
              border: "1px solid rgba(255,107,53,0.2)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <RefreshCcw size={18} style={{ color: "rgba(255,107,53,0.8)" }} />
            <span
              style={{
                fontSize: 7,
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)",
              }}
            >
              Routing
            </span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 10,
        }}
      >
        <span
          style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em" }}
        >
          Liquidity
        </span>
        <motion.span
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.4, repeat: Infinity }}
          style={{
            fontSize: 8,
            fontWeight: 700,
            color: "rgba(255,107,53,0.8)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          Syncing AED
        </motion.span>
      </div>

      {/* LP nodes */}
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {[
          { city: "London LP", value: "3.6732", active: true },
          { city: "Singapore LP", value: "3.6719", active: false },
          { city: "Local OTC", value: "3.6730", active: false },
        ].map((node, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "9px 12px",
              borderRadius: 16,
              background: node.active
                ? "rgba(255,107,53,0.08)"
                : "rgba(255,255,255,0.03)",
              border: node.active
                ? "1px solid rgba(255,107,53,0.2)"
                : "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: node.active
                    ? "#FF6B35"
                    : "rgba(255,255,255,0.15)",
                  boxShadow: node.active
                    ? "0 0 8px rgba(255,107,53,0.6)"
                    : "none",
                }}
              />
              <div>
                <p
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    color: node.active ? "#fff" : "rgba(255,255,255,0.55)",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  {node.city}
                </p>
                <p
                  style={{
                    fontSize: 8,
                    color: node.active
                      ? "rgba(255,107,53,0.6)"
                      : "rgba(255,255,255,0.25)",
                    fontFamily: "monospace",
                    letterSpacing: "0.06em",
                  }}
                >
                  RATE: {node.value}
                </p>
              </div>
            </div>
            <span
              style={{
                fontSize: 8,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: node.active ? "#FF6B35" : "rgba(255,255,255,0.25)",
              }}
            >
              {node.active ? "Match" : "Wait"}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Efficiency */}
      <div
        style={{
          marginTop: "auto",
          width: "100%",
          padding: "10px 14px",
          background: "rgba(255,255,255,0.04)",
          borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: 8,
            fontWeight: 600,
            color: "rgba(255,255,255,0.35)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          Efficiency
        </span>
        <span
          style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.02em" }}
        >
          99.98%
        </span>
      </div>
    </div>
  </div>
);

const VerifyScreen = () => (
  <div
    className="flex flex-col h-full bg-black text-white font-sans items-center text-center relative overflow-hidden"
    style={{ paddingTop: 52 }}
  >
    {/* Success glow */}
    <div
      style={{
        position: "absolute",
        top: "30%",
        left: "50%",
        transform: "translateX(-50%)",
        width: 180,
        height: 180,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(255,107,53,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }}
    />

    <div className="flex flex-col items-center justify-center flex-1 w-full px-4 pb-3">
      {/* Success ring + icon */}
      <div style={{ position: "relative", marginBottom: 16 }}>
        <motion.div
          animate={{ scale: [1, 1.18, 1], opacity: [0.2, 0, 0.2] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
          style={{
            position: "absolute",
            inset: -14,
            borderRadius: "50%",
            border: "1px solid rgba(255,107,53,0.35)",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0, 0.3] }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeOut",
            delay: 0.4,
          }}
          style={{
            position: "absolute",
            inset: -6,
            borderRadius: "50%",
            border: "1px solid rgba(255,107,53,0.25)",
          }}
        />
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 14, delay: 0.1 }}
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #FF6B35, #FF8C42)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 32px rgba(255,107,53,0.35)",
          }}
        >
          <CheckCircle2 size={24} style={{ color: "#fff" }} />
        </motion.div>
      </div>

      <h3
        style={{
          fontSize: 22,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#fff",
          marginBottom: 6,
        }}
      >
        Settled
      </h3>
      <p
        style={{
          fontSize: 8,
          color: "rgba(255,255,255,0.25)",
          fontWeight: 600,
          letterSpacing: "0.26em",
          textTransform: "uppercase",
          fontFamily: "monospace",
        }}
      >
        LEDGER_ID: 0x9A...F21
      </p>
    </div>

    {/* Receipt rows */}
    <div style={{ width: "100%", padding: "0 16px 14px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {[
          {
            icon: (
              <Fingerprint
                size={11}
                style={{ color: "rgba(255,255,255,0.35)" }}
              />
            ),
            label: "Authorization",
            value: "Success",
          },
          {
            icon: <Zap size={11} style={{ color: "#FF6B35" }} />,
            label: "Settlement",
            value: "420ms",
          },
          {
            icon: (
              <TrendingUp
                size={11}
                style={{ color: "rgba(255,255,255,0.35)" }}
              />
            ),
            label: "Rate",
            value: "3.6732 AED",
          },
        ].map((row, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.08 }}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "9px 12px",
              background: "rgba(255,255,255,0.04)",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {row.icon}
              <span
                style={{
                  fontSize: 8,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.4)",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                {row.label}
              </span>
            </div>
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: i === 1 ? "#FF6B35" : "rgba(255,255,255,0.7)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {row.value}
            </span>
          </motion.div>
        ))}
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
