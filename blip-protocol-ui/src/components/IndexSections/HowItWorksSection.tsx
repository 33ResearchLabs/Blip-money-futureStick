import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import {
  Send,
  ShieldCheck,
  Globe,
  Lock,
  Zap,
  ArrowRight,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  CheckCircle2,
  Activity,
  ChevronRight,
  ChevronDown,
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
  TrendingUp,
  Fingerprint,
  QrCode,
  User,
} from "lucide-react";
import { CTAButton } from "../Navbar";
import { useTheme } from "next-themes";

// Desktop Phone Mockup Component — iPhone 17 Pro / Black Titanium
const DesktopPhoneMockup = ({ activeSection, steps, isDark }) => {
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
              background: isDark ? "#000" : "#FFFFFF",
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
                color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.70)",
                fontSize: 10,
                fontWeight: 700,
              }}
            >
              <span>9:41</span>
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  alignItems: "center",
                  color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.70)",
                }}
              >
                <Signal size={10} />
                <Wifi size={10} />
                <Battery size={10} />
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, scale: 0.97, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.01, y: -6 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{ width: "100%", height: "100%" }}
              >
                {steps[Math.min(activeSection, steps.length - 1)].screen}
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
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
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
    let hasEnteredView = false;

    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Only activate when the container is actually in view
      const containerInView =
        containerRect.top < viewportHeight * 0.8 &&
        containerRect.bottom > viewportHeight * 0.2;

      if (!containerInView) return;

      // Prevent the first-frame flicker: lock to section 0 until
      // the user has scrolled far enough into the container
      if (!hasEnteredView) {
        // Wait until the container top has scrolled above the viewport midpoint
        if (containerRect.top > viewportHeight * 0.5) return;
        hasEnteredView = true;
      }

      const isDesktop = window.innerWidth >= 1024; // lg breakpoint

      if (isDesktop) {
        // Desktop: scroll-based detection for content sections
        const sections = container.querySelectorAll(".content-section");
        const triggerPoint = viewportHeight * 0.45;

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
        const scrollProgress =
          -containerRect.top / (containerRect.height - viewportHeight);

        let newSection = 0;
        if (scrollProgress > 0.8) newSection = 4;
        else if (scrollProgress > 0.6) newSection = 3;
        else if (scrollProgress > 0.4) newSection = 2;
        else if (scrollProgress > 0.2) newSection = 1;

        setActiveSection(newSection);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const steps = [
    { title: "Dashboard", screen: <DashboardScreen isDark={isDark} /> },
    { title: "Send Money", screen: <SendScreen isDark={isDark} /> },
    { title: "Trade", screen: <TradeScreen isDark={isDark} /> },
    { title: "Pay Bills", screen: <PayScreen isDark={isDark} /> },
    { title: "Cash Out", screen: <CashOutScreen isDark={isDark} /> },
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
          className="text-black dark:text-white"
          style={{
            fontSize: "clamp(2.8rem, 5.5vw, 5rem)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 1.08,
            marginBottom: 12,
          }}
        >
          One app.
          <br />
          <span className="text-black/70 dark:text-white/50">
            Every use case.
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.1 }}
          className="text-base md:text-lg lg:text-xl text-black/80 dark:text-white/50 max-w-lg text-center mx-auto leading-relaxed mb-10 font-medium"
        >
          Send, trade, pay, or cash out — all from your crypto balance.
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
        {[
          { num: "01", label: "Dashboard", h1: "Your Wallet,", h2: "At a Glance.", desc: "See balances, sparklines, and your entire portfolio — one screen, zero noise." },
          { num: "02", label: "Send Money", h1: "Transfer to", h2: "Anyone, Anywhere.", desc: "Send stablecoins to anyone. They receive cash in local currency — no bank needed." },
          { num: "03", label: "Trade", h1: "Buy & Sell,", h2: "Instantly.", desc: "Swap between USDT, AED, and BTC with live merchant matching. Best rate wins." },
          { num: "04", label: "Pay Bills", h1: "Bills & Rent,", h2: "Handled.", desc: "Use your crypto to pay rent, utilities, or tuition — settled in local currency, instantly." },
          { num: "05", label: "Cash Out", h1: "Withdraw", h2: "Anytime.", desc: "Convert USDT to AED and withdraw — directly to your bank or in person. Under 2 seconds.", cta: true },
        ].map((step) => (
          <motion.div key={step.num}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06]">
              <span className="text-xs text-black/60 dark:text-white/40 font-bold tracking-widest uppercase">
                {step.num} • {step.label}
              </span>
            </div>
            <h3
              className="select-none text-black dark:text-white"
              style={{
                fontSize: "clamp(2.2rem, 7vw, 3.5rem)",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
              }}
            >
              {step.h1}
              <br />
              <span className="text-black/50 dark:text-white/40">{step.h2}</span>
            </h3>
            <p className="text-sm md:text-base text-black/70 dark:text-white/45 leading-relaxed font-medium">{step.desc}</p>
            {step.cta && (
              <div className="flex md:justify-start justify-center pt-1">
                <CTAButton to="/waitlist" className="w-[220px] h-12 uppercase text-sm">Get Started</CTAButton>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* DESKTOP LAYOUT - Sticky phone with scrolling content sections */}
      <div className="hidden lg:block max-w-7xl mx-auto px-8 lg:px-12 relative">
        <div className="flex gap-16">
          {/* LEFT SIDE: Sticky Phone UI */}
          <div className="w-full lg:w-[45%] lg:sticky lg:top-0 h-screen flex items-center justify-center py-12">
            <DesktopPhoneMockup
              activeSection={activeSection}
              steps={steps}
              isDark={isDark}
            />
          </div>

          {/* RIGHT SIDE: Content Narrative */}
          <div className="w-full lg:w-[55%] flex flex-col">
            {[
              { label: "Dashboard", h1: "Your Wallet,", h2: "At a Glance.", desc: "See balances, sparklines, and your entire portfolio — one screen, zero noise." },
              { label: "Send Money", h1: "Transfer to", h2: "Anyone, Anywhere.", desc: "Send stablecoins to anyone. They receive cash in local currency — no bank needed." },
              { label: "Trade", h1: "Buy & Sell,", h2: "Instantly.", desc: "Swap between USDT, AED, and BTC with live merchant matching. Best rate wins." },
              { label: "Pay Bills", h1: "Bills & Rent,", h2: "Handled.", desc: "Use your crypto to pay rent, utilities, or tuition — settled in local currency, instantly." },
              { label: "Cash Out", h1: "Withdraw", h2: "Anytime.", desc: "Convert USDT to AED and withdraw — directly to your bank or in person. Under 2 seconds.", last: true },
            ].map((s, i, arr) => (
              <section key={s.label} className={`content-section space-y-5 min-h-screen flex flex-col justify-start pt-[20vh] ${i === arr.length - 1 ? "pb-[30vh]" : ""}`}>
                <span className="text-black/80 dark:text-white/50 font-bold tracking-[0.3em] uppercase text-xs">
                  {s.label}
                </span>
                <motion.h2
                  initial={{ opacity: 0, scale: 0.99 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="select-none text-black dark:text-white"
                  style={{
                    fontSize: "clamp(2.4rem, 4.5vw, 3.5rem)",
                    fontWeight: 700,
                    letterSpacing: "-0.04em",
                    lineHeight: 1.05,
                  }}
                >
                  {s.h1}
                  <br />
                  <span className="text-black/50 dark:text-white/40">{s.h2}</span>
                </motion.h2>
                <p className="text-base md:text-lg text-black/70 dark:text-white/45 leading-relaxed max-w-md font-medium">{s.desc}</p>
                {s.last && (
                  <div className="mt-auto">
                    <CTAButton to="/waitlist" className="w-[220px] h-12 uppercase text-sm">Get Started</CTAButton>
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- APP THEME SCREENS ---

/* Sparkline chart for the wallet card */
const SPARK_DATA = [28, 42, 33, 58, 44, 70, 55, 82, 69, 98, 87, 115, 102, 138];

const Sparkline = ({ width = 220, height = 40, isDark }: { width?: number; height?: number; isDark: boolean }) => {
  const max = Math.max(...SPARK_DATA), min = Math.min(...SPARK_DATA), rng = max - min || 1;
  const pts = SPARK_DATA.map((v, i) => ({
    x: (i / (SPARK_DATA.length - 1)) * width,
    y: height - 4 - ((v - min) / rng) * (height - 10),
  }));
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;
  const last = pts[pts.length - 1];
  const color = "#10b981";
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ width: "100%" }}>
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#sparkGrad)" />
      <path d={line} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last.x} cy={last.y} r="2.5" fill={color} />
      <circle cx={last.x} cy={last.y} r="5" fill="none" stroke={color} strokeWidth="0.8" opacity="0.35" />
    </svg>
  );
};

/* Friends data for Circle section */
const CIRCLE_FRIENDS = [
  { name: "Alex",   color: "#ff6b35", emoji: "🧑", status: "active" },
  { name: "Sasha",  color: "#3b82f6", emoji: "👩", status: "online" },
  { name: "Jordan", color: "#10b981", emoji: "🧔", status: "online" },
  { name: "Taylor", color: "#f59e0b", emoji: "👱", status: "offline" },
];

/* Activity feed data */
const ACTIVITY_FEED = [
  { merchant: "Apple Store", location: "Fifth Ave",  amount: "1,299.00", time: "2m ago",  type: "out" as const, cat: "Tech",   catColor: "#007AFF", emoji: "🍎" },
  { merchant: "Starbucks",   location: "Met Square", amount: "12.40",    time: "1h ago",  type: "out" as const, cat: "Food",   catColor: "#00b14f", emoji: "☕" },
  { merchant: "Settlement",  location: "P2P Trade",  amount: "4,500.00", time: "Yesterday", type: "in" as const,  cat: "Income", catColor: "#10b981", emoji: "💰" },
];

/* Stat chip */
const StatChip = ({ label, value, color, isDark }: { label: string; value: string; color: string; isDark: boolean }) => (
  <div style={{
    flex: 1, borderRadius: 14, padding: "8px 8px",
    background: isDark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.03)",
    border: `1px solid ${isDark ? "rgba(255,255,255,0.055)" : "rgba(0,0,0,0.06)"}`,
  }}>
    <p style={{ fontSize: 6, fontWeight: 900, letterSpacing: "0.14em", textTransform: "uppercase" as const, marginBottom: 3,
      color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.35)" }}>{label}</p>
    <p style={{ fontSize: 11, fontWeight: 900, color }}>{value}</p>
  </div>
);




// ─── SHARED SCREEN HELPERS ───────────────────────────────────────────────────

const useC = (isDark: boolean) => ({
  bg: isDark ? "#080810" : "#FAFAFA",
  text: isDark ? "#fff" : "#111",
  muted: isDark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.28)",
  sub: isDark ? "rgba(255,255,255,0.42)" : "rgba(0,0,0,0.42)",
  card: isDark ? "rgba(255,255,255,0.035)" : "rgba(0,0,0,0.025)",
  border: isDark ? "rgba(255,255,255,0.065)" : "rgba(0,0,0,0.055)",
  hover: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
});

const Orbs = ({ isDark }: { isDark: boolean }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <motion.div animate={{ x: [0, 18, -12, 0], y: [0, -18, 22, 0], scale: [1, 1.08, 0.94, 1] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute rounded-full" style={{ top: "-18%", left: "-12%", width: "60%", height: "55%",
        background: `radial-gradient(ellipse, ${isDark ? "rgba(255,107,53,0.13)" : "rgba(255,107,53,0.06)"} 0%, transparent 70%)`, filter: "blur(50px)" }} />
    <motion.div animate={{ x: [0, -16, 14, 0], y: [0, 18, -22, 0], scale: [1, 0.94, 1.08, 1] }}
      transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
      className="absolute rounded-full" style={{ bottom: "-18%", right: "-12%", width: "55%", height: "50%",
        background: `radial-gradient(ellipse, ${isDark ? "rgba(16,185,129,0.09)" : "rgba(16,185,129,0.05)"} 0%, transparent 70%)`, filter: "blur(50px)" }} />
  </div>
);

const Label = ({ children, c }: { children: React.ReactNode; c: ReturnType<typeof useC> }) => (
  <p style={{ fontSize: 6.5, fontWeight: 900, letterSpacing: "0.28em", textTransform: "uppercase" as const, color: c.muted, marginBottom: 2 }}>{children}</p>
);

// ─── SCREEN 1: DASHBOARD ─────────────────────────────────────────────────────

const DashboardScreen = ({ isDark }: { isDark: boolean }) => {
  const c = useC(isDark);
  return (
    <div className="flex flex-col h-full w-full relative overflow-hidden" style={{ background: c.bg, paddingTop: 52, color: c.text }}>
      <Orbs isDark={isDark} />

      {/* Header */}
      <div className="px-4 pb-2.5 flex items-center justify-between z-10">
        <div>
          <Label c={c}>Portfolio</Label>
          <div className="flex items-center gap-1">
            <span style={{ fontSize: 15, fontWeight: 900, letterSpacing: "-0.035em" }}>Blip Network</span>
            <ChevronDown size={10} style={{ color: c.muted, marginTop: 1 }} />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-7 h-7 rounded-[10px] flex items-center justify-center" style={{ background: c.card, border: `1px solid ${c.border}` }}>
            <Bell size={12} style={{ color: c.sub }} />
          </div>
          <div className="w-7 h-7 rounded-[10px] overflow-hidden" style={{ border: "2px solid rgba(255,107,53,0.5)", background: "linear-gradient(135deg, #ff6b35, #ff8f5e)" }}>
            <div className="w-full h-full flex items-center justify-center"><span style={{ fontSize: 11 }}>🧑</span></div>
          </div>
        </div>
      </div>

      {/* Scrollable */}
      <div className="flex-1 overflow-y-auto z-10 px-4 pb-8" style={{ scrollbarWidth: "none" }}>

        {/* ── WALLET CARD ── */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="relative mb-4">
          {/* Outer halo */}
          <div className="absolute inset-0 rounded-[26px]" style={{
            background: "radial-gradient(ellipse at 20% 30%, rgba(16,185,129,0.22) 0%, transparent 50%), radial-gradient(ellipse at 85% 80%, rgba(255,107,53,0.22) 0%, transparent 50%)",
            filter: "blur(20px)", transform: "scale(1.06)", opacity: 0.7,
          }} />
          <div className="relative overflow-hidden rounded-[26px]" style={{
            background: isDark
              ? "linear-gradient(152deg, #0f0c08 0%, #1a1008 38%, #120e08 72%, #0a0906 100%)"
              : "linear-gradient(152deg, #fffaf7 0%, #fff0ea 38%, #fff5ee 72%, #fdf8f5 100%)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.07)"}`,
            boxShadow: isDark
              ? "0 24px 60px rgba(0,0,0,0.65), 0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)"
              : "0 24px 60px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.9)",
          }}>
            {/* Corner glows */}
            <div className="absolute" style={{ top: -30, left: -30, width: 140, height: 140, background: `radial-gradient(circle, ${isDark ? "rgba(16,185,129,0.16)" : "rgba(16,185,129,0.08)"} 0%, transparent 70%)` }} />
            <div className="absolute" style={{ bottom: -30, right: -30, width: 140, height: 140, background: `radial-gradient(circle, ${isDark ? "rgba(255,107,53,0.18)" : "rgba(255,107,53,0.09)"} 0%, transparent 70%)` }} />
            {/* Dot grid */}
            <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle, ${isDark ? "rgba(255,255,255,0.055)" : "rgba(0,0,0,0.035)"} 1px, transparent 1px)`, backgroundSize: "14px 14px", opacity: 0.5 }} />
            {/* Shimmer */}
            <motion.div animate={{ x: ["-250%", "250%"] }} transition={{ duration: 4, repeat: Infinity, repeatDelay: 6, ease: "easeInOut" }}
              className="absolute inset-0 skew-x-12" style={{ background: `linear-gradient(90deg, transparent 30%, ${isDark ? "rgba(255,255,255,0.025)" : "rgba(255,255,255,0.6)"} 50%, transparent 70%)` }} />

            <div className="relative z-10 p-4">
              {/* Top row */}
              <div className="flex justify-between items-start mb-3.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-[11px] flex items-center justify-center" style={{
                    background: "linear-gradient(135deg, #059669, #ff6b35)",
                    boxShadow: "0 0 16px rgba(16,185,129,0.35), 0 4px 12px rgba(255,107,53,0.2)",
                  }}>
                    <Zap size={13} className="fill-white text-white" />
                  </div>
                  <div>
                    <p style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.22em", color: c.sub, textTransform: "uppercase" as const }}>BLIP</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }}
                        style={{ width: 4, height: 4, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 6px #10b981" }} />
                      <span style={{ fontSize: 6.5, fontWeight: 900, color: "#10b981", textTransform: "uppercase" as const, letterSpacing: "0.18em" }}>Live</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p style={{ fontSize: 6.5, fontWeight: 900, letterSpacing: "0.22em", color: c.muted, textTransform: "uppercase" as const }}>Signature</p>
                  <p style={{ fontSize: 6.5, fontWeight: 900, letterSpacing: "0.22em", color: c.muted, textTransform: "uppercase" as const }}>v 2.0</p>
                </div>
              </div>

              {/* Balance */}
              <div className="mb-1.5">
                <p style={{ fontSize: 7, fontWeight: 900, letterSpacing: "0.28em", color: c.muted, textTransform: "uppercase" as const, marginBottom: 3 }}>Total Balance</p>
                <div className="flex items-baseline">
                  <motion.span initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
                    style={{ fontSize: 38, fontWeight: 900, letterSpacing: "-0.045em", lineHeight: 1 }}>$242</motion.span>
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
                    style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.02em", color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.18)", lineHeight: 1 }}>.8k</motion.span>
                </div>
              </div>

              {/* Trend badge */}
              <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                className="flex items-center gap-1.5 mb-3">
                <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full" style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.28)" }}>
                  <TrendingUp size={8} style={{ color: "#10b981" }} />
                  <span style={{ fontSize: 8.5, fontWeight: 900, color: "#10b981" }}>+12.4%</span>
                </div>
                <span style={{ fontSize: 7, fontWeight: 700, color: c.muted, textTransform: "uppercase" as const, letterSpacing: "0.12em" }}>this week</span>
              </motion.div>

              {/* Sparkline */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="mb-3" style={{ marginLeft: -2, marginRight: -2 }}>
                <Sparkline isDark={isDark} />
              </motion.div>

              {/* Bottom row */}
              <div className="flex justify-between items-center">
                <div>
                  <p style={{ fontSize: 6, fontWeight: 900, letterSpacing: "0.22em", color: c.muted, textTransform: "uppercase" as const, marginBottom: 1 }}>ID Hash</p>
                  <p style={{ fontSize: 8.5, fontFamily: "monospace", fontWeight: 600, color: c.sub }}>0x71C...3a21</p>
                </div>
                <div className="flex">
                  {["#1a56db", "#ff6b35"].map((clr, i) => (
                    <div key={i} className="w-5.5 h-5.5 rounded-full flex items-center justify-center" style={{ width: 22, height: 22, background: clr, border: `2px solid ${isDark ? "rgba(10,10,20,0.7)" : "rgba(255,255,255,0.9)"}`, marginLeft: i > 0 ? -7 : 0, opacity: 0.75 }}>
                      {i === 0 && <Globe size={9} style={{ color: "rgba(255,255,255,0.75)" }} />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── QUICK STATS ── */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex gap-2 mb-4">
          <StatChip label="Total In" value="+$5.8k" color="#10b981" isDark={isDark} />
          <StatChip label="Total Out" value="-$1.3k" color="#f87171" isDark={isDark} />
          <StatChip label="Pending" value="2 txns" color="#fbbf24" isDark={isDark} />
        </motion.div>

        {/* ── ACTIONS ── */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-4 gap-1.5 mb-5">
          {[
            { label: "Send", Icon: ArrowUpRight, primary: true },
            { label: "Receive", Icon: ArrowDownLeft, primary: false },
            { label: "Add", Icon: Plus, primary: false },
            { label: "Scan", Icon: QrCode, primary: false },
          ].map(({ label, Icon, primary }) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <div className="w-11 h-11 rounded-[13px] flex items-center justify-center" style={primary
                ? { background: isDark ? "#fff" : "#111", boxShadow: isDark ? "0 8px 24px rgba(255,255,255,0.12)" : "0 8px 24px rgba(0,0,0,0.12)" }
                : { background: c.card, border: `1px solid ${c.border}` }}>
                <Icon size={16} strokeWidth={2.5} style={{ color: primary ? (isDark ? "#000" : "#fff") : c.sub }} />
              </div>
              <span style={{ fontSize: 7, fontWeight: 900, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: primary ? c.text : c.muted }}>{label}</span>
            </div>
          ))}
        </motion.div>

        {/* ── CIRCLE ── */}
        <div className="mb-5">
          <Label c={c}>Circle</Label>
          <div className="flex gap-3 mt-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {CIRCLE_FRIENDS.map((f, i) => (
              <motion.div key={f.name} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 + i * 0.05, type: "spring", stiffness: 300, damping: 20 }}
                className="flex flex-col items-center gap-1.5 shrink-0">
                <div className="relative">
                  <div style={f.status === "active" ? { padding: 2, borderRadius: 18, background: "linear-gradient(135deg, #10b981, #ff6b35)" } : { padding: 2, borderRadius: 18, border: `1.5px solid ${c.border}` }}>
                    <div className="flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: 15, background: f.color + "1a" }}>
                      <span style={{ fontSize: 18 }}>{f.emoji}</span>
                    </div>
                  </div>
                  {f.status === "active" && (
                    <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2.5, repeat: Infinity }}
                      className="absolute flex items-center justify-center" style={{ bottom: -3, right: -3, width: 14, height: 14, borderRadius: "50%", background: "#ff6b35", border: `2px solid ${c.bg}`, boxShadow: "0 0 8px rgba(255,107,53,0.6)" }}>
                      <Zap size={6} className="fill-white text-white" />
                    </motion.div>
                  )}
                </div>
                <span style={{ fontSize: 8, fontWeight: 700, color: c.muted }}>{f.name}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── RECENT PULSE ── */}
        <div>
          <div className="flex justify-between items-center mb-2.5">
            <Label c={c}>Recent Pulse</Label>
            <span style={{ fontSize: 7, fontWeight: 900, letterSpacing: "0.1em", color: "#ff8f5e", textTransform: "uppercase" as const }}>See all</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {ACTIVITY_FEED.map((item, i) => (
              <motion.div key={item.merchant} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-2.5 rounded-[16px]" style={{ padding: "8px 10px", background: c.card, border: `1px solid ${c.border}` }}>
                <div className="relative shrink-0 rounded-[12px] flex items-center justify-center" style={{ width: 36, height: 36, background: c.hover }}>
                  <span style={{ fontSize: 17 }}>{item.emoji}</span>
                  <div className="absolute flex items-center justify-center" style={{ bottom: -1, right: -1, width: 12, height: 12, borderRadius: "50%", background: item.type === "in" ? "#10b981" : (isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"), border: `1.5px solid ${c.bg}` }}>
                    {item.type === "out" ? <ArrowUpRight size={6} style={{ color: isDark ? "#fff" : "#666" }} /> : <ArrowDownLeft size={6} style={{ color: "#fff" }} />}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center" style={{ marginBottom: 3 }}>
                    <p style={{ fontSize: 11, fontWeight: 900, letterSpacing: "-0.01em" }} className="truncate">{item.merchant}</p>
                    <p style={{ fontSize: 11, fontWeight: 900, marginLeft: 6, flexShrink: 0, color: item.type === "in" ? "#10b981" : c.text }}>{item.type === "in" ? "+" : "-"}${item.amount}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span style={{ fontSize: 6.5, fontWeight: 900, textTransform: "uppercase" as const, letterSpacing: "0.06em", padding: "1.5px 6px", borderRadius: 99, background: `${item.catColor}18`, color: item.catColor, border: `1px solid ${item.catColor}35` }}>{item.cat}</span>
                    <span style={{ fontSize: 7.5, fontWeight: 600, color: c.muted }}>{item.location} · {item.time}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── SCREEN 2: SEND MONEY ────────────────────────────────────────────────────

const SendScreen = ({ isDark }: { isDark: boolean }) => {
  const c = useC(isDark);
  return (
    <div className="flex flex-col h-full w-full relative overflow-hidden" style={{ background: c.bg, paddingTop: 52, color: c.text }}>
      <Orbs isDark={isDark} />
      {/* Header */}
      <div className="px-4 pb-3 flex items-center gap-3 z-10">
        <div className="w-8 h-8 rounded-[10px] flex items-center justify-center" style={{ background: c.card, border: `1px solid ${c.border}` }}>
          <ArrowDownLeft size={13} style={{ color: c.sub, transform: "rotate(90deg)" }} />
        </div>
        <div>
          <Label c={c}>New Settlement</Label>
          <p style={{ fontSize: 12, fontWeight: 900, letterSpacing: "-0.02em" }}>Send to Circle</p>
        </div>
      </div>

      <div className="flex-1 px-4 pt-1 flex flex-col items-center z-10">
        {/* Recipient chips */}
        <div className="w-full flex gap-2.5 overflow-x-auto mb-6" style={{ scrollbarWidth: "none" }}>
          {CIRCLE_FRIENDS.slice(0, 3).map((f, i) => (
            <motion.div key={f.name} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.06 }}
              className="shrink-0 flex items-center gap-2 rounded-[14px]" style={{ padding: "6px 10px", background: i === 0 ? (isDark ? "rgba(255,107,53,0.12)" : "rgba(255,107,53,0.06)") : c.card, border: `1px solid ${i === 0 ? "rgba(255,107,53,0.25)" : c.border}` }}>
              <div className="flex items-center justify-center" style={{ width: 22, height: 22, borderRadius: 8, background: f.color + "20" }}>
                <span style={{ fontSize: 11 }}>{f.emoji}</span>
              </div>
              <span style={{ fontSize: 9, fontWeight: 900, color: i === 0 ? (isDark ? "#ff8f5e" : "#ff6b35") : c.sub }}>{f.name}</span>
              {i === 0 && <CheckCircle2 size={10} style={{ color: "#ff8f5e" }} />}
            </motion.div>
          ))}
        </div>

        <Label c={c}>Amount</Label>
        <div className="flex items-baseline justify-center mt-3" style={{ marginBottom: 28 }}>
          <span style={{ fontSize: 30, fontWeight: 900, letterSpacing: "-0.03em", color: isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.12)", marginRight: 4 }}>$</span>
          <motion.span initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{ fontSize: 60, fontWeight: 900, letterSpacing: "-0.05em", lineHeight: 1 }}>5,000</motion.span>
        </div>

        {/* Conversion hint */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="flex items-center gap-1.5 mb-5 px-3 py-1.5 rounded-full" style={{ background: c.card, border: `1px solid ${c.border}` }}>
          <span style={{ fontSize: 8, fontWeight: 700, color: c.muted }}>≈</span>
          <span style={{ fontSize: 9, fontWeight: 900, color: "#FF6B35" }}>18,360 AED</span>
          <span style={{ fontSize: 7, fontWeight: 700, color: c.muted }}>@ 3.672</span>
        </motion.div>

        {/* Numpad */}
        <div className="grid grid-cols-3 mb-5" style={{ gap: "5px 22px", maxWidth: 210, width: "100%" }}>
          {["1","2","3","4","5","6","7","8","9","·","0","←"].map(k => (
            <div key={k} className="flex items-center justify-center rounded-[14px]" style={{ height: 38, fontSize: 22, fontWeight: 900, color: isDark ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.65)" }}>{k}</div>
          ))}
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="w-full flex items-center justify-center gap-2.5" style={{
            height: 52, borderRadius: 24, fontSize: 14, fontWeight: 900,
            background: isDark ? "#fff" : "#111", color: isDark ? "#000" : "#fff",
            boxShadow: isDark ? "0 16px 40px rgba(255,255,255,0.1)" : "0 16px 40px rgba(0,0,0,0.15)",
          }}>
          Sign with BioID <Fingerprint size={18} />
        </motion.div>
      </div>
    </div>
  );
};

// ─── SCREEN 3: TRADE ─────────────────────────────────────────────────────────

const PAIRS = [
  { from: "USDT", to: "AED", rate: "3.672", chg: "+0.3%", color: "#10b981", emoji: "🪙" },
  { from: "BTC",  to: "AED", rate: "367,200", chg: "+2.1%", color: "#f59e0b", emoji: "₿" },
  { from: "ETH",  to: "AED", rate: "13,400",  chg: "-0.8%", color: "#ef4444", emoji: "◆" },
];

const TradeScreen = ({ isDark }: { isDark: boolean }) => {
  const c = useC(isDark);
  return (
    <div className="flex flex-col h-full w-full relative overflow-hidden" style={{ background: c.bg, paddingTop: 52, color: c.text }}>
      <Orbs isDark={isDark} />
      <div className="px-4 pb-2 z-10">
        <Label c={c}>Markets</Label>
        <p style={{ fontSize: 17, fontWeight: 900, letterSpacing: "-0.035em" }}>Trade</p>
      </div>

      <div className="flex-1 overflow-y-auto z-10 px-4 pb-6" style={{ scrollbarWidth: "none" }}>
        {/* Toggle */}
        <div className="flex rounded-[14px] p-[3px] mb-4" style={{ background: c.card, border: `1px solid ${c.border}` }}>
          <div className="flex-1 text-center py-2 rounded-[11px]" style={{ background: isDark ? "#fff" : "#111", color: isDark ? "#000" : "#fff", fontSize: 9, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" as const }}>Buy</div>
          <div className="flex-1 text-center py-2 rounded-[11px]" style={{ fontSize: 9, fontWeight: 900, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: c.muted }}>Sell</div>
        </div>

        {/* Swap card */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-[22px] overflow-hidden mb-4" style={{ background: c.card, border: `1px solid ${c.border}`, boxShadow: isDark ? "0 12px 40px rgba(0,0,0,0.3)" : "0 12px 40px rgba(0,0,0,0.04)" }}>
          <div className="p-4 pb-3">
            <p style={{ fontSize: 7, fontWeight: 900, letterSpacing: "0.22em", color: c.muted, textTransform: "uppercase" as const, marginBottom: 8 }}>You Pay</p>
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 30, fontWeight: 900, letterSpacing: "-0.04em" }}>10,000</span>
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-[12px]" style={{ background: c.hover, border: `1px solid ${c.border}` }}>
                <span style={{ fontSize: 13 }}>🪙</span>
                <span style={{ fontSize: 10, fontWeight: 900 }}>USDT</span>
                <ChevronDown size={10} style={{ color: c.muted }} />
              </div>
            </div>
          </div>
          <div className="relative flex items-center justify-center" style={{ height: 1, background: c.border }}>
            <motion.div animate={{ rotate: [0, 180] }} transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute w-8 h-8 rounded-full flex items-center justify-center" style={{ background: isDark ? "#14142a" : "#f0f0f5", border: `1.5px solid ${c.border}`, boxShadow: isDark ? "0 4px 12px rgba(0,0,0,0.4)" : "0 4px 12px rgba(0,0,0,0.06)" }}>
              <ArrowDownCircle size={16} style={{ color: "#FF6B35" }} />
            </motion.div>
          </div>
          <div className="p-4 pt-5">
            <p style={{ fontSize: 7, fontWeight: 900, letterSpacing: "0.22em", color: c.muted, textTransform: "uppercase" as const, marginBottom: 8 }}>You Receive</p>
            <div className="flex items-center justify-between">
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                style={{ fontSize: 30, fontWeight: 900, letterSpacing: "-0.04em", color: "#FF6B35" }}>36,720</motion.span>
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-[12px]" style={{ background: c.hover, border: `1px solid ${c.border}` }}>
                <span style={{ fontSize: 13 }}>🇦🇪</span>
                <span style={{ fontSize: 10, fontWeight: 900 }}>AED</span>
                <ChevronDown size={10} style={{ color: c.muted }} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Rate bar */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          className="flex items-center justify-between rounded-[14px] px-3 py-2.5 mb-5" style={{ background: c.card, border: `1px solid ${c.border}` }}>
          <span style={{ fontSize: 8, fontWeight: 700, color: c.muted }}>Rate</span>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 9.5, fontWeight: 900, fontFamily: "monospace" }}>1 USDT = 3.672 AED</span>
            <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full" style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)" }}>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#10b981" }} />
              <span style={{ fontSize: 6.5, fontWeight: 900, color: "#10b981" }}>LIVE</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Pairs */}
        <Label c={c}>Live Pairs</Label>
        <div className="mt-2" style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {PAIRS.map((p, i) => (
            <motion.div key={p.from} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-between rounded-[16px] px-3 py-2.5" style={{ background: c.card, border: `1px solid ${c.border}` }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-[10px] flex items-center justify-center" style={{ background: p.color + "15", border: `1px solid ${p.color}25` }}>
                  <span style={{ fontSize: 14, color: p.color }}>{p.emoji}</span>
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 900, letterSpacing: "-0.01em" }}>{p.from}<span style={{ color: c.muted }}>/{p.to}</span></p>
                  <p style={{ fontSize: 7.5, fontWeight: 600, color: c.muted, fontFamily: "monospace" }}>{p.rate}</p>
                </div>
              </div>
              <div className="px-2 py-1 rounded-full" style={{ background: p.color + "15", border: `1px solid ${p.color}28` }}>
                <span style={{ fontSize: 8.5, fontWeight: 900, color: p.color }}>{p.chg}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── SCREEN 4: PAY BILLS ─────────────────────────────────────────────────────

const BILLS = [
  { name: "Rent",      amt: "4,200",  due: "Due 5 Mar",  emoji: "🏠", color: "#ff6b35", active: true },
  { name: "DEWA",      amt: "380",    due: "Due 12 Mar", emoji: "⚡", color: "#f59e0b", active: false },
  { name: "Du Mobile", amt: "199",    due: "Due 15 Mar", emoji: "📱", color: "#3b82f6", active: false },
  { name: "Salik",     amt: "50",     due: "Due 20 Mar", emoji: "🚗", color: "#10b981", active: false },
];

const PayScreen = ({ isDark }: { isDark: boolean }) => {
  const c = useC(isDark);
  return (
    <div className="flex flex-col h-full w-full relative overflow-hidden" style={{ background: c.bg, paddingTop: 52, color: c.text }}>
      <Orbs isDark={isDark} />
      <div className="px-4 pb-2 z-10">
        <Label c={c}>Payments</Label>
        <p style={{ fontSize: 17, fontWeight: 900, letterSpacing: "-0.035em" }}>Pay Bills</p>
      </div>

      <div className="flex-1 overflow-y-auto z-10 px-4 pb-6" style={{ scrollbarWidth: "none" }}>
        {/* Filter */}
        <div className="flex gap-2 mb-4 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {["All", "Upcoming", "Paid", "Auto-pay"].map((f, i) => (
            <div key={f} className="shrink-0 px-3.5 py-1.5 rounded-full" style={i === 0
              ? { background: isDark ? "#fff" : "#111", color: isDark ? "#000" : "#fff", fontSize: 8, fontWeight: 900, textTransform: "uppercase" as const, letterSpacing: "0.1em" }
              : { background: c.card, border: `1px solid ${c.border}`, color: c.muted, fontSize: 8, fontWeight: 900, textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>
              {f}
            </div>
          ))}
        </div>

        {/* Total due */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="rounded-[22px] p-4 mb-4 relative overflow-hidden" style={{
            background: isDark ? "linear-gradient(140deg, rgba(255,107,53,0.14), rgba(59,130,246,0.08))" : "linear-gradient(140deg, rgba(255,107,53,0.07), rgba(59,130,246,0.04))",
            border: `1px solid ${isDark ? "rgba(255,107,53,0.22)" : "rgba(255,107,53,0.12)"}`,
            boxShadow: "0 8px 32px rgba(255,107,53,0.08)",
          }}>
          <motion.div animate={{ x: ["-200%", "200%"] }} transition={{ duration: 5, repeat: Infinity, repeatDelay: 8, ease: "easeInOut" }}
            className="absolute inset-0 skew-x-12" style={{ background: "linear-gradient(90deg, transparent 30%, rgba(255,107,53,0.04) 50%, transparent 70%)" }} />
          <p style={{ fontSize: 7, fontWeight: 900, letterSpacing: "0.28em", color: "#ff8f5e", textTransform: "uppercase" as const, marginBottom: 5 }}>Total Due This Month</p>
          <div className="flex items-baseline gap-1.5">
            <span style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-0.04em" }}>4,829</span>
            <span style={{ fontSize: 15, fontWeight: 900, color: c.muted }}>AED</span>
          </div>
          <p style={{ fontSize: 8, fontWeight: 700, color: c.sub, marginTop: 5 }}>4 bills · Next due in 3 days</p>
        </motion.div>

        {/* Bills */}
        <Label c={c}>Upcoming</Label>
        <div className="mt-2" style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {BILLS.map((b, i) => (
            <motion.div key={b.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-2.5 rounded-[16px]" style={{
                padding: "9px 11px",
                background: b.active ? (isDark ? `${b.color}10` : `${b.color}06`) : c.card,
                border: `1px solid ${b.active ? b.color + "30" : c.border}`,
                boxShadow: b.active ? `0 4px 16px ${b.color}12` : "none",
              }}>
              <div className="shrink-0 w-10 h-10 rounded-[12px] flex items-center justify-center" style={{ background: b.color + "15", border: `1px solid ${b.color}20` }}>
                <span style={{ fontSize: 18 }}>{b.emoji}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center" style={{ marginBottom: 3 }}>
                  <p style={{ fontSize: 11, fontWeight: 900 }}>{b.name}</p>
                  <p style={{ fontSize: 11, fontWeight: 900 }}>{b.amt} <span style={{ fontSize: 7.5, color: c.muted }}>AED</span></p>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: 7.5, fontWeight: 600, color: c.muted }}>{b.due}</span>
                  {b.active
                    ? <span style={{ fontSize: 7.5, fontWeight: 900, color: b.color, textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>Pay Now →</span>
                    : <span style={{ fontSize: 7.5, fontWeight: 700, color: c.muted, textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>Pending</span>
                  }
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Auto-pay */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="mt-4 rounded-[16px] p-3.5 flex items-center gap-2.5" style={{ background: isDark ? "rgba(16,185,129,0.08)" : "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.18)" }}>
          <div className="w-8 h-8 rounded-[10px] flex items-center justify-center" style={{ background: "rgba(16,185,129,0.15)" }}>
            <Zap size={14} style={{ color: "#10b981" }} />
          </div>
          <div className="flex-1">
            <p style={{ fontSize: 9.5, fontWeight: 900, color: "#10b981" }}>Auto-pay enabled</p>
            <p style={{ fontSize: 7.5, fontWeight: 600, color: c.muted }}>Bills paid from your USDT balance</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// ─── SCREEN 5: CASH OUT ──────────────────────────────────────────────────────

const CashOutScreen = ({ isDark }: { isDark: boolean }) => {
  const c = useC(isDark);
  return (
    <div className="h-full w-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: isDark ? "#06060e" : c.bg, padding: 28, textAlign: "center" as const, color: c.text }}>
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse at 50% 35%, ${isDark ? "rgba(16,185,129,0.12)" : "rgba(16,185,129,0.06)"} 0%, ${isDark ? "rgba(255,107,53,0.08)" : "rgba(255,107,53,0.04)"} 40%, transparent 70%)`,
      }} />
      {/* Pulse rings */}
      <motion.div animate={{ scale: [1, 1.6, 1], opacity: [0.15, 0, 0.15] }} transition={{ duration: 2.5, repeat: Infinity }}
        className="absolute z-0" style={{ width: 160, height: 160, borderRadius: "50%", border: `1px solid ${isDark ? "rgba(16,185,129,0.15)" : "rgba(16,185,129,0.1)"}`, top: "50%", left: "50%", transform: "translate(-50%, -65%)" }} />
      <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0, 0.2] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.4 }}
        className="absolute z-0" style={{ width: 120, height: 120, borderRadius: "50%", border: `1px solid ${isDark ? "rgba(255,107,53,0.15)" : "rgba(255,107,53,0.1)"}`, top: "50%", left: "50%", transform: "translate(-50%, -65%)" }} />

      {/* Success icon */}
      <motion.div
        initial={{ scale: 0.3, rotate: -20, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 350, damping: 14, delay: 0.1 }}
        className="flex items-center justify-center z-10"
        style={{
          width: 96, height: 96, borderRadius: 34, marginBottom: 22,
          background: "linear-gradient(135deg, #059669 0%, #ff6b35 100%)",
          boxShadow: "0 0 50px rgba(16,185,129,0.3), 0 0 80px rgba(255,107,53,0.15), 0 16px 40px rgba(0,0,0,0.3)",
        }}>
        <CheckCircle2 size={46} strokeWidth={2.2} style={{ color: "#fff" }} />
      </motion.div>

      <motion.p initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
        style={{ fontSize: 42, fontWeight: 900, letterSpacing: "-0.045em", lineHeight: 1, marginBottom: 6, zIndex: 1 }}>Done.</motion.p>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        style={{ fontSize: 13, fontWeight: 900, textTransform: "uppercase" as const, letterSpacing: "0.18em", color: c.muted, marginBottom: 10, zIndex: 1 }}>Settled $5,000</motion.p>

      {/* Receipt */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className="w-full z-10 mb-5" style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {[
          { label: "Method", value: "Bank Transfer", icon: <Wallet size={11} style={{ color: c.sub }} />, color: c.text },
          { label: "Speed", value: "1.8s", icon: <Zap size={11} style={{ color: "#FF6B35" }} />, color: "#FF6B35" },
          { label: "Amount", value: "36,730 AED", icon: <Coins size={11} style={{ color: c.sub }} />, color: c.text },
        ].map((r, i) => (
          <motion.div key={r.label} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.08 }}
            className="flex items-center justify-between rounded-[14px]" style={{ padding: "9px 12px", background: c.card, border: `1px solid ${c.border}` }}>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-[9px] flex items-center justify-center" style={{ background: c.hover }}>{r.icon}</div>
              <span style={{ fontSize: 8.5, fontWeight: 700, color: c.muted, textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>{r.label}</span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 900, color: r.color }}>{r.value}</span>
          </motion.div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
        className="w-full z-10 flex items-center justify-center" style={{
          height: 46, borderRadius: 22, fontSize: 12, fontWeight: 900,
          background: c.card, border: `1px solid ${c.border}`,
          color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)",
        }}>Back to Home</motion.div>
    </div>
  );
};


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
