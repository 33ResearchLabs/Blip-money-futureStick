import React, { useState, useEffect, useRef, memo } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import {
  Send,
  ShieldCheck,
  Globe,
  Lock,
  Zap,
  ArrowRight,
  ArrowDownLeft,
  Wallet,
  CheckCircle2,
  Activity,
  ChevronRight,
  ChevronDown,
  MousePointer2,
  CreditCard,
  Layers,
  Wifi,
  Battery,
  Signal,
  ArrowDownCircle,
  Coins,
  Bell,
  ArrowUpRight,
  QrCode,
  Home,
  MessageCircle,
  User,
} from "lucide-react";
import { CTAButton } from "../Navbar";
import { useTheme } from "next-themes";

const TABS = [
  { key: "home", Icon: Home, label: "Home" },
  { key: "trade", Icon: Zap, label: "Trade" },
  { key: "chats", Icon: MessageCircle, label: "Inbox" },
  { key: "orders", Icon: Activity, label: "Activity" },
  { key: "profile", Icon: User, label: "You" },
] as const;

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
        // Use top-third of section as trigger anchor so the phone
        // switches as soon as the section's text enters view
        const sections = container.querySelectorAll(".content-section");
        const triggerPoint = viewportHeight * 0.4;

        let newActiveSection = 0;
        let closestDistance = Infinity;

        sections.forEach((section, index) => {
          const rect = section.getBoundingClientRect();
          // Anchor near the top of each section where the text actually sits
          const sectionAnchor = rect.top + rect.height * 0.25;
          const distance = Math.abs(sectionAnchor - triggerPoint);

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

    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
      }
    };
    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledScroll);
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
      className="relative min-h-screen bg-[#FAF8F5] dark:bg-black/70 text-black dark:text-white selection:bg-black/[0.10] dark:selection:bg-white/[0.10] isolate py-12 md:py-20"
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
          className="heading-h2 text-center text-black dark:text-white"
          style={{
            marginBottom: 12,
          }}
        >
          One app.
          
          
        </motion.h2>
        <span className="heading-h2">
            Every use case.
          </span>
      </div>

      {/* Top Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[1px] bg-black/20 dark:bg-white/20 z-[100] origin-left"
        style={{ scaleX }}
      />

      {/* MOBILE LAYOUT - Card-based instead of phone mockup */}
      <div className="lg:hidden max-w-7xl mx-auto px-4 space-y-12 py-8">
        {[
          {
            num: "01",
            label: "Dashboard",
            h1: "Your Wallet,",
            h2: "At a Glance.",
            desc: "View your complete crypto balance, transactions, and portfolio in one simple dashboard.",
            bullets: ["View your complete crypto balance, transactions, and portfolio in one simple dashboard.", "Track performance instantly with real-time updates and clean visual insights."],
          },
          {
            num: "02",
            label: "Send Money",
            h1: "Transfer to",
            h2: "Anyone, Anywhere.",
            desc: "Send crypto or stablecoins globally in seconds—no bank dependency required.",
            bullets: ["Send crypto or stablecoins globally in seconds—no bank dependency required.", "Receiver gets funds in their local currency through P2P settlement."],
          },
          {
            num: "03",
            label: "Trade",
            h1: "Buy & Sell,",
            h2: "Instantly.",
            desc: "Trade crypto (like USDT, BTC) directly with users at live market rates.",
            bullets: ["Trade crypto (like USDT, BTC) directly with users at live market rates.", "Fast, peer-to-peer transactions without intermediaries or delays."],
          },
          {
            num: "04",
            label: "Pay Bills",
            h1: "Bills & Rent,",
            h2: "Handled.",
            desc: "Pay everyday expenses like rent, utilities, or mobile bills using crypto.",
            bullets: ["Pay everyday expenses like rent, utilities, or mobile bills using crypto.", "Seamless conversion from crypto to local currency for real-world payments."],
          },
          {
            num: "05",
            label: "Cash Out",
            h1: "Withdraw",
            h2: "Anytime.",
            desc: "Convert crypto to cash and withdraw directly to bank or in-person instantly.",
            bullets: ["Convert crypto to cash and withdraw directly to bank or in-person instantly.", "Quick settlement ensures funds are available without long waiting times."],
            cta: true,
          },
        ].map((step) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="space-y-3 text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06]">
              <span className="text-xs text-black/60 dark:text-white/40 font-bold tracking-widest uppercase">
                {step.num} • {step.label}
              </span>
            </div>
            <h3 className="heading-h3 select-none text-center text-black dark:text-white">
              {step.h1}
              <br />
              {step.h2}
            </h3>
            <p className="p-small text-black/70 dark:text-white/45">
              {step.desc}
            </p>
            {step.bullets && (
              <ul className="space-y-1.5 text-left mx-auto max-w-sm">
                {step.bullets.map((b, bi) => (
                  <li key={bi} className="flex items-start gap-2 p-small text-black/60 dark:text-white/40">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#ff6b35] flex-shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            )}
            {step.cta && (
              <div className="flex md:justify-start justify-center pt-10">
                <CTAButton
                  to="/waitlist"
                  className="w-[220px] h-12 uppercase text-sm"
                >
                  Get Started
                </CTAButton>
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
              {
                label: "Dashboard",
                h1: "Your Wallet,",
                h2: "At a Glance.",
                desc: "View your complete crypto balance, transactions, and portfolio in one simple dashboard.",
                bullets: ["View your complete crypto balance, transactions, and portfolio in one simple dashboard.", "Track performance instantly with real-time updates and clean visual insights."],
              },
              {
                label: "Send Money",
                h1: "Transfer to",
                h2: "Anyone, Anywhere.",
                desc: "Send crypto or stablecoins globally in seconds—no bank dependency required.",
                bullets: ["Send crypto or stablecoins globally in seconds—no bank dependency required.", "Receiver gets funds in their local currency through P2P settlement."],
              },
              {
                label: "Trade",
                h1: "Buy & Sell,",
                h2: "Instantly.",
                desc: "Trade crypto (like USDT, BTC) directly with users at live market rates.",
                bullets: ["Trade crypto (like USDT, BTC) directly with users at live market rates.", "Fast, peer-to-peer transactions without intermediaries or delays."],
              },
              {
                label: "Pay Bills",
                h1: "Bills & Rent,",
                h2: "Handled.",
                desc: "Pay everyday expenses like rent, utilities, or mobile bills using crypto.",
                bullets: ["Pay everyday expenses like rent, utilities, or mobile bills using crypto.", "Seamless conversion from crypto to local currency for real-world payments."],
              },
              {
                label: "Cash Out",
                h1: "Withdraw",
                h2: "Anytime.",
                desc: "Convert crypto to cash and withdraw directly to bank or in-person instantly.",
                bullets: ["Convert crypto to cash and withdraw directly to bank or in-person instantly.", "Quick settlement ensures funds are available without long waiting times."],
                last: true,
              },
            ].map((s, i, arr) => (
              <section
                key={s.label}
                className={`content-section space-y-5 min-h-screen flex flex-col justify-center ${i === arr.length - 1 ? "pb-[30vh]" : ""}`}
              >
                <span className="text-black/80 dark:text-white/50 font-bold tracking-[0.3em] uppercase text-xs">
                  {s.label}
                </span>
                <motion.h3
                  initial={{ opacity: 0, scale: 0.99 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="heading-h3 select-none text-black dark:text-white "
                >
                  {s.h1}
                  <br />
                  {s.h2}
                </motion.h3>
                <p className="p-medium text-black/70 dark:text-white/45 max-w-md">
                  {s.desc}
                </p>
                {s.bullets && (
                  <ul className="space-y-2 max-w-md">
                    {s.bullets.map((b, bi) => (
                      <li key={bi} className="flex items-start gap-2.5 p-small text-black/60 dark:text-white/40">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#ff6b35] flex-shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
                {s.last && (
                  <div className="pt-8">
                    <CTAButton
                      to="/waitlist"
                      className="w-[220px] h-12 uppercase text-sm"
                    >
                      Get Started
                    </CTAButton>
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

const Sparkline = ({
  width = 220,
  height = 40,
  isDark,
}: {
  width?: number;
  height?: number;
  isDark: boolean;
}) => {
  const max = Math.max(...SPARK_DATA),
    min = Math.min(...SPARK_DATA),
    rng = max - min || 1;
  const pts = SPARK_DATA.map((v, i) => ({
    x: (i / (SPARK_DATA.length - 1)) * width,
    y: height - 4 - ((v - min) / rng) * (height - 10),
  }));
  const line = pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;
  const last = pts[pts.length - 1];
  const color = "#10b981";
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      style={{ width: "100%" }}
    >
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#sparkGrad)" />
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={last.x} cy={last.y} r="2.5" fill={color} />
      <circle
        cx={last.x}
        cy={last.y}
        r="5"
        fill="none"
        stroke={color}
        strokeWidth="0.8"
        opacity="0.35"
      />
    </svg>
  );
};

/* Friends data for Circle section */
const CIRCLE_FRIENDS = [
  {
    name: "Alex",
    color: "#ff6b35",
    emoji: "🧑",
    status: "active",
    action: "Sent",
    amount: "$50",
  },
  {
    name: "Sasha",
    color: "#3b82f6",
    emoji: "👩",
    status: "online",
    action: "Received",
    amount: "$20",
  },
  {
    name: "Jordan",
    color: "#10b981",
    emoji: "🧔",
    status: "online",
    action: "Received",
    amount: "$10",
  },
  {
    name: "Taylor",
    color: "#f59e0b",
    emoji: "👱",
    status: "offline",
    action: "Remived",
    amount: "$10",
  },
];

/* Activity feed data */
const ACTIVITY_FEED = [
  {
    merchant: "Apple Store",
    location: "Fifth Ave",
    amount: "1,299.00",
    time: "2m ago",
    type: "out" as const,
    cat: "Tech",
    catColor: "#007AFF",
    emoji: "🍎",
  },
  {
    merchant: "Starbucks",
    location: "Met Square",
    amount: "12.40",
    time: "1h ago",
    type: "out" as const,
    cat: "Food",
    catColor: "#00b14f",
    emoji: "☕",
  },
  {
    merchant: "Settlement",
    location: "P2P Trade",
    amount: "4,500.00",
    time: "Yesterday",
    type: "in" as const,
    cat: "Income",
    catColor: "#10b981",
    emoji: "💰",
  },
];

/* Stat chip */
const StatChip = ({
  label,
  value,
  color,
  isDark,
}: {
  label: string;
  value: string;
  color: string;
  isDark: boolean;
}) => (
  <div
    style={{
      flex: 1,
      borderRadius: 14,
      padding: "8px 8px",
      background: isDark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.03)",
      border: `1px solid ${isDark ? "rgba(255,255,255,0.055)" : "rgba(0,0,0,0.06)"}`,
    }}
  >
    <p
      style={{
        fontSize: 6,
        fontWeight: 900,
        letterSpacing: "0.14em",
        textTransform: "uppercase" as const,
        marginBottom: 3,
        color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.35)",
      }}
    >
      {label}
    </p>
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
    <motion.div
      animate={{
        x: [0, 18, -12, 0],
        y: [0, -18, 22, 0],
        scale: [1, 1.08, 0.94, 1],
      }}
      transition={{ duration: 20, ease: "linear" }}
      className="absolute rounded-full"
      style={{
        top: "-18%",
        left: "-12%",
        width: "60%",
        height: "55%",
        background: `radial-gradient(ellipse, ${isDark ? "rgba(255,107,53,0.13)" : "rgba(255,107,53,0.06)"} 0%, transparent 70%)`,
        filter: "blur(50px)",
      }}
    />
    <div
      className="absolute rounded-full"
      style={{
        bottom: "-18%",
        right: "-12%",
        width: "55%",
        height: "50%",
        background: `radial-gradient(ellipse, ${isDark ? "rgba(16,185,129,0.09)" : "rgba(16,185,129,0.05)"} 0%, transparent 70%)`,
        filter: "blur(50px)",
      }}
    />
  </div>
);

const Label = ({
  children,
  c,
}: {
  children: React.ReactNode;
  c: ReturnType<typeof useC>;
}) => (
  <p
    style={{
      fontSize: 6.5,
      fontWeight: 900,
      letterSpacing: "0.28em",
      textTransform: "uppercase" as const,
      color: c.muted,
      marginBottom: 2,
    }}
  >
    {children}
  </p>
);

// ─── SCREEN 1: DASHBOARD (Violet Portfolio) ─────────────────────────────────

const DashboardScreen = ({ isDark: _isDark }: { isDark: boolean }) => {
  return (
    <div
      className="flex flex-col h-full w-full relative overflow-hidden"
      style={{ background: "#050508", paddingTop: 52, color: "#fff" }}
    >
      {/* ── Dark top section ── */}
      <div className="px-4 shrink-0 z-50" style={{ background: "#0a0a0a", borderRadius: "0 0 26px 26px", paddingBottom: 14 }}>

        {/* Top row: avatar + username + bell */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs shrink-0"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}
            >
              A•
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#fff", lineHeight: 1 }}>alex_321</p>
              <div className="flex items-center gap-1 mt-0.5">
                <p style={{ fontSize: 8, color: "#555", fontFamily: "monospace" }}>EWkjzP_eRZ4NN</p>
                <div className="w-3 h-3 rounded flex items-center justify-center" style={{ background: "#1a1a1a" }}>
                  <span style={{ fontSize: 7, color: "#555" }}>⧉</span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#111", border: "1px solid rgba(255,255,255,0.08)" }}>
            <Bell size={13} className="text-white/60" />
            <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center">
              <span style={{ fontSize: 7, fontWeight: 700, color: "#000" }}>2</span>
            </div>
          </div>
        </div>

        {/* Balance */}
        <div className="flex items-center justify-between mb-0.5">
          <p style={{ fontSize: 7, letterSpacing: "0.25em", color: "rgba(255,255,255,0.35)", fontWeight: 700 }}>TOTAL BALANCE</p>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <p style={{ fontSize: 8, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>3.67 AED</p>
          </div>
        </div>
        <div className="flex items-end gap-1 mb-1">
          <span style={{ fontSize: 36, fontWeight: 900, lineHeight: 1, color: "#fff" }}>620</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.35)", marginBottom: 2 }}>.88</span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 3, marginLeft: 1 }}>USDT</span>
        </div>
        <div className="flex items-center gap-1 mb-2">
          <span style={{ fontSize: 10, color: "#4ade80" }}>↗ +$557.00 today</span>
        </div>

        {/* Chart */}
        <div style={{ marginBottom: 4 }}>
          <div className="flex items-center justify-between mb-1">
            <span style={{ fontSize: 7, color: "#555", fontWeight: 600 }}>7D</span>
            <span style={{ fontSize: 8, color: "#4ade80", fontWeight: 700 }}>↑ 3.6%</span>
          </div>
          <svg viewBox="0 0 200 44" className="w-full" style={{ height: 34 }}>
            <defs>
              <linearGradient id="dbLineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#fff" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#fff" stopOpacity="0.9" />
              </linearGradient>
              <linearGradient id="dbAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fff" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,36 C15,32 25,38 45,30 S70,26 95,28 S125,18 148,22 S178,12 200,8" fill="none" stroke="url(#dbLineGrad)" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M0,36 C15,32 25,38 45,30 S70,26 95,28 S125,18 148,22 S178,12 200,8 L200,44 L0,44 Z" fill="url(#dbAreaGrad)" />
            <circle cx="200" cy="8" r="2.5" fill="#fff" />
            <circle cx="200" cy="8" r="5" fill="rgba(255,255,255,0.15)" />
          </svg>
          <div className="flex justify-between">
            <span style={{ fontSize: 7, color: "#444" }}>Mar 13</span>
            <span style={{ fontSize: 7, color: "#444" }}>Today</span>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {[
            { label: "SEND", Icon: ArrowUpRight, active: true },
            { label: "PAY", Icon: ArrowDownLeft, active: false },
            { label: "ACTIVITY", Icon: Activity, active: false },
            { label: "DEPOSIT", Icon: QrCode, active: false },
          ].map(({ label, Icon, active }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center"
                style={{
                  background: active ? "#fff" : "#111",
                  color: active ? "#000" : "rgba(255,255,255,0.45)",
                  border: active ? "none" : "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <Icon size={16} />
              </div>
              <span style={{ fontSize: 8, color: "rgba(255,255,255,0.4)", fontWeight: 700, letterSpacing: "0.05em" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── White bottom card ── */}
      <div
        className="flex-1 flex flex-col -mt-4"
        style={{ background: "#fff", padding: "12px 14px 0", }}
      >
        {/* Circle */}
        <div className="mb-2 shrink-0 mt-3">
          <p style={{ fontSize: 7, color: "#aaa", fontWeight: 700, letterSpacing: "0.15em", marginBottom: 6 }}>CIRCLE</p>
          <div className="flex gap-3">
            {[
              { initial: "G", name: "george_smith12", color: "#111" },
              { initial: "S", name: "sara_trader",    color: "#1a1a1a", dot: true },
            ].map(({ initial, name, color, dot }) => (
              <div key={name} className="text-center relative">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-xs relative"
                  style={{ background: color }}
                >
                  {initial}
                  {dot && <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />}
                </div>
                <p style={{ fontSize: 7.5, color: "#888", marginTop: 3, maxWidth: 44 }} className="truncate">{name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Transactions header */}
        <div className="flex items-center justify-between mb-1 shrink-0">
          <p style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>Transactions</p>
          <div className="flex items-center gap-0.5">
            <span style={{ fontSize: 9, color: "#888", fontWeight: 600 }}>See all</span>
            <span style={{ fontSize: 9, color: "#888" }}>›</span>
          </div>
        </div>

        {/* Active order banner */}
        {/* <div
          className="flex items-center justify-between rounded-2xl mb-2 shrink-0"
          style={{ background: "#111", padding: "8px 12px" }}
        >
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#fff" }}>Buying 141.00 USDT</p>
              <p style={{ fontSize: 8, color: "#666", marginTop: 1 }}>Step 3 of 4 · Tap to continue</p>
            </div>
          </div>
          <ArrowUpRight size={14} className="text-white/40" />
        </div> */}

        {/* Transaction rows */}
        {[
          { initial: "G", color: "#3b82f6", type: "Sell USDT", user: "george_smith12", date: "27 Mar 2026", amount: "+368.65", currency: "د.إ", usdt: "101.00 USDT" },
          { initial: "J", color: "#f97316", type: "Buy USDT",  user: "Joe", date: "27 Mar 2026", amount: "-378.01", currency: "د.إ", usdt: "103.00 USDT" },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between py-2" style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shrink-0"
                style={{ background: item.color, fontSize: 11 }}
              >
                {item.initial}
              </div>
              <div>
                <p style={{ fontSize: 10, fontWeight: 600, color: "#111", lineHeight: 1 }}>{item.type}</p>
                <p className="text-black/80" style={{ fontSize: 8, marginTop: 1 }}>{item.user} · {item.date}</p>
              </div>
            </div>
            <div className="text-right">
              <p style={{ fontSize: 10, fontWeight: 700, color: item.amount.startsWith("+") ? "#16a34a" : "#111" }}>
                {item.amount}{item.currency}
              </p>
              <p style={{ fontSize: 8, color: "#aaa" }}>{item.usdt}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom nav */}
      <div
        className="absolute bottom-0 left-0 right-0 z-50"
        style={{ background: "rgba(5,5,8,0.97)" }}
      >
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="flex items-center justify-between px-4 pt-1.5 pb-1.5">
          {TABS.map(({ key, Icon, label }) => {
            const active = key === "home";
            return (
              <div key={key} className="relative flex flex-col items-center gap-0.5">
                {active && (
                  <div className="absolute top-1 w-7 h-7 rounded-xl" style={{ background: "rgba(255,255,255,0.08)" }} />
                )}
                <div className="relative z-10 flex items-center justify-center w-9 h-9">
                  <Icon size={17} strokeWidth={active ? 2.4 : 1.6} className={active ? "text-white" : "text-white/30"} />
                </div>
                <span style={{ fontSize: 8, color: active ? "#fff" : "rgba(255,255,255,0.3)", fontWeight: active ? 600 : 400 }}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── SCREEN 2: SEND MONEY ────────────────────────────────────────────────────

const SendScreen = ({ isDark }: { isDark: boolean }) => {
  const c = useC(isDark);
  return (
    <div
      className="flex flex-col h-full w-full relative overflow-hidden"
      style={{ background: c.bg, paddingTop: 52, color: c.text }}
    >
      <Orbs isDark={isDark} />
      {/* Header */}
      <div className="px-4 pb-3 flex items-center gap-3 z-10">
        <div
          className="w-8 h-8 rounded-[10px] flex items-center justify-center"
          style={{ background: c.card, border: `1px solid ${c.border}` }}
        >
          <ArrowDownLeft
            size={13}
            style={{ color: c.sub, transform: "rotate(90deg)" }}
          />
        </div>
        <div>
          <Label c={c}>New Settlement</Label>
          <p
            style={{ fontSize: 12, fontWeight: 900, letterSpacing: "-0.02em" }}
          >
            Send to Circle
          </p>
        </div>
      </div>

      <div className="flex-1 px-4 pt-1  flex flex-col items-center z-10">
        {/* Recipient chips */}
        <div
          className="w-full flex gap-2.5 overflow-x-auto mb-4"
          style={{ scrollbarWidth: "none" }}
        >
          {CIRCLE_FRIENDS.slice(0, 3).map((f, i) => (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.06 }}
              className="shrink-0 flex items-center gap-2 rounded-[14px]"
              style={{
                padding: "6px 10px",
                background:
                  i === 0
                    ? isDark
                      ? "rgba(255,107,53,0.12)"
                      : "rgba(255,107,53,0.06)"
                    : c.card,
                border: `1px solid ${i === 0 ? "rgba(255,107,53,0.25)" : c.border}`,
              }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 8,
                  background: f.color + "20",
                }}
              >
                <span style={{ fontSize: 11 }}>{f.emoji}</span>
              </div>
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 900,
                  color: i === 0 ? (isDark ? "#ff8f5e" : "#ff6b35") : c.sub,
                }}
              >
                {f.name}
              </span>
              {i === 0 && (
                <CheckCircle2 size={10} style={{ color: "#ff8f5e" }} />
              )}
            </motion.div>
          ))}
        </div>

        <Label c={c}>Amount</Label>
        <div
          className="flex items-baseline justify-center mt-3"
          style={{ marginBottom: 20 }}
        >
          <span
            style={{
              fontSize: 28,
              fontWeight: 900,
              letterSpacing: "-0.03em",
              color: isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.12)",
              marginRight: 4,
            }}
          >
            $
          </span>
          <motion.span
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{
              fontSize: 50,
              fontWeight: 900,
              letterSpacing: "-0.05em",
              lineHeight: 1,
            }}
          >
            5,000
          </motion.span>
        </div>

        {/* Conversion hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-1.5 mb-5 px-3 py-1.5 rounded-full"
          style={{ background: c.card, border: `1px solid ${c.border}` }}
        >
          <span style={{ fontSize: 8, fontWeight: 700, color: c.muted }}>
            ≈
          </span>
          <span style={{ fontSize: 9, fontWeight: 900, color: "#FF6B35" }}>
            18,360 AED
          </span>
          <span style={{ fontSize: 7, fontWeight: 700, color: c.muted }}>
            @ 3.672
          </span>
        </motion.div>

        {/* Numpad */}
        <div
          className="grid grid-cols-3 mb-2"
          style={{ gap: "5px 22px", maxWidth: 210, width: "100%" }}
        >
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "·", "0", "←"].map(
            (k) => (
              <div
                key={k}
                className="flex items-center justify-center rounded-[14px]"
                style={{
                  height: 38,
                  fontSize: 20,
                  fontWeight: 900,
                  color: isDark ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.65)",
                }}
              >
                {k}
              </div>
            ),
          )}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="w-full flex items-center justify-center gap-2.5"
          style={{
            height: 40,
            borderRadius: 24,
            fontSize: 14,
            fontWeight: 900,
            background: isDark ? "#fff" : "#111",
            color: isDark ? "#000" : "#fff",
            boxShadow: isDark
              ? "0 16px 40px rgba(255,255,255,0.1)"
              : "0 16px 40px rgba(0,0,0,0.15)",
          }}
        >
          Confirm & Send
        </motion.div>
      </div>

      {/* Bottom nav */}
      <div className="absolute bottom-0 left-0 right-0 z-50" style={{ background: isDark ? "rgba(5,5,5,0.97)" : "rgba(250,248,245,0.97)" }}>
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="flex items-center justify-between px-4 pt-1.5 pb-1.5">
          {TABS.map(({ key, Icon, label }) => {
            const active = key === "trade";
            return (
              <div key={key} className="relative flex flex-col items-center gap-0.5">
                {active && (
                  <div className="absolute top-1 w-7 h-7 rounded-xl" style={{ background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" }} />
                )}
                <div className="relative z-10 flex items-center justify-center w-9 h-9">
                  <Icon size={17} strokeWidth={active ? 2.4 : 1.6} style={{ color: active ? c.text : c.muted }} />
                </div>
                <span style={{ fontSize: 8, color: active ? c.text : c.muted, fontWeight: active ? 600 : 400 }}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── SCREEN 3: TRADE ─────────────────────────────────────────────────────────

const PAIRS = [
  {
    from: "USDT",
    to: "AED",
    rate: "3.672",
    chg: "+0.3%",
    color: "#10b981",
    emoji: "🪙",
  },
  {
    from: "BTC",
    to: "AED",
    rate: "367,200",
    chg: "+2.1%",
    color: "#f59e0b",
    emoji: "₿",
  },
  {
    from: "ETH",
    to: "AED",
    rate: "13,400",
    chg: "-0.8%",
    color: "#ef4444",
    emoji: "◆",
  },
];

const TradeScreen = ({ isDark }: { isDark: boolean }) => {
  const c = useC(isDark);
  const activeTabBg = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)";
  const inactiveTabBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
  const cardBg = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)";
  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const divider = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)";
  const ctaBg = isDark ? "#fff" : "#111";
  const ctaText = isDark ? "#000" : "#fff";

  return (
    <div
      className="flex flex-col h-full w-full relative overflow-hidden"
      style={{ background: c.bg, paddingTop: 52, color: c.text }}
    >
      <Orbs isDark={isDark} />

      {/* Header */}
      <div className="px-4 pb-1 z-10 shrink-0">
        <Label c={c}>Markets</Label>
        <p style={{ fontSize: 15, fontWeight: 900, letterSpacing: "-0.035em" }}>
          Trade
        </p>
      </div>

      {/* Fixed layout — no scroll so all sections stay visible */}
      <div
        className="flex-1 flex flex-col z-10 px-4 "
        style={{ gap: 6, overflow: "hidden" }}
      >
        {/* Buy / Sell toggle */}
        <div
          className="flex gap-1 p-0.5 rounded-xl shrink-0"
          style={{
            background: inactiveTabBg,
            border: `1px solid ${cardBorder}`,
          }}
        >
          {["Buy", "Sell"].map((tab) => (
            <div
              key={tab}
              className="flex-1 rounded-lg text-center"
              style={{
                padding: "5px 0",
                background: tab === "Buy" ? activeTabBg : "transparent",
                fontWeight: 700,
                fontSize: 12,
                color: tab === "Buy" ? c.text : c.muted,
              }}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* Live rate card */}
        <div
          className="rounded-xl shrink-0"
          style={{
            background: cardBg,
            border: `1px solid ${cardBorder}`,
            padding: "8px 12px",
          }}
        >
          <p
            style={{
              fontSize: 7,
              fontWeight: 900,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: c.muted,
              marginBottom: 4,
            }}
          >
            LIVE RATE · USDT / AED
          </p>
          <div className="flex justify-between items-center">
            <div>
              <p
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                  color: c.text,
                  lineHeight: 1,
                }}
              >
                3.670
              </p>
              <p
                style={{
                  fontSize: 9,
                  color: "#10b981",
                  fontWeight: 600,
                  marginTop: 2,
                }}
              >
                ▲ +0.24% today
              </p>
            </div>
            <svg width="72" height="28">
              <path
                d="M0,22 C8,17 18,25 28,19 S46,13 56,15 S64,10 72,8"
                fill="none"
                stroke="#10b981"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div
            className="flex justify-between mt-2 pt-2"
            style={{
              borderTop: `1px solid ${divider}`,
              fontSize: 8,
              color: c.muted,
              fontWeight: 700,
              letterSpacing: "0.08em",
            }}
          >
            <span>7D LOW 3.651</span>
            <span>HIGH 3.694</span>
          </div>
        </div>

        {/* Amount input card */}
        <div
          className="rounded-xl shrink-0"
          style={{
            background: cardBg,
            border: `1px solid ${cardBorder}`,
            padding: "8px 12px",
          }}
        >
          <p
            style={{
              fontSize: 7,
              fontWeight: 900,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: c.muted,
              marginBottom: 4,
            }}
          >
            YOU PAY (AED)
          </p>
          <div className="flex items-end justify-between">
            <div className="flex items-baseline gap-1">
              <span
                style={{
                  fontSize: 30,
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  color: c.text,
                  lineHeight: 1,
                }}
              >
                558
              </span>
              <span style={{ fontSize: 11, fontWeight: 600, color: c.muted }}>
                AED
              </span>
            </div>
            <p style={{ fontSize: 9, color: c.sub }}>≈ 152.00 USDT</p>
          </div>
          <div
            className="flex justify-between mt-2 pt-2"
            style={{ borderTop: `1px solid ${divider}` }}
          >
            {[
              { label: "RATE", val: "3.670" },
              { label: "FEE", val: "2.5%" },
              { label: "YOU GET", val: "152 USDT" },
            ].map(({ label, val }) => (
              <div key={label}>
                <p
                  style={{
                    fontSize: 7,
                    fontWeight: 900,
                    letterSpacing: "0.12em",
                    color: c.muted,
                    textTransform: "uppercase",
                  }}
                >
                  {label}
                </p>
                <p
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: c.text,
                    marginTop: 1,
                  }}
                >
                  {val}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Pay via */}
        <div className="shrink-0">
          <p
            style={{
              fontSize: 7,
              fontWeight: 900,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: c.muted,
              marginBottom: 5,
            }}
          >
            PAY VIA
          </p>
          <div className="flex gap-2">
            {[
              { label: "Bank Transfer", sub: "Wire / IBAN", active: true },
              { label: "Cash", sub: "Meet in person", active: false },
            ].map(({ label, sub, active }) => (
              <div
                key={label}
                className="flex-1 rounded-xl"
                style={{
                  padding: "7px 10px",
                  background: active ? activeTabBg : inactiveTabBg,
                  border: `1px solid ${active ? (isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.12)") : cardBorder}`,
                }}
              >
                <p style={{ fontSize: 10, fontWeight: 700, color: c.text }}>
                  {label}
                </p>
                <p style={{ fontSize: 8, color: c.muted, marginTop: 1 }}>
                  {sub}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Priority */}
        <div className="shrink-0">
          <p
            style={{
              fontSize: 7,
              fontWeight: 900,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: c.muted,
              marginBottom: 5,
            }}
          >
            PRIORITY
          </p>
          <div className="flex gap-2">
            {[
              { label: "Fastest", val: "3.0%", color: "#f97316" },
              { label: "Best Rate", val: "2.5%", color: "#3b82f6" },
              { label: "Cheapest", val: "1.5%", color: "#10b981" },
            ].map(({ label, val, color }, i) => (
              <div
                key={label}
                className="flex-1 rounded-xl text-center"
                style={{
                  padding: "5px 4px",
                  background: i === 1 ? activeTabBg : inactiveTabBg,
                  border: `1px solid ${i === 1 ? (isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.10)") : cardBorder}`,
                }}
              >
                <p style={{ fontSize: 8, fontWeight: 600, color: c.sub }}>
                  {label}
                </p>
                <p
                  style={{ fontSize: 9, fontWeight: 800, color, marginTop: 1 }}
                >
                  {val}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          className="w-full rounded-xl font-bold flex items-center justify-center gap-1.5 shrink-0"
          style={{
            padding: "9px 0",
            background: ctaBg,
            color: ctaText,
            fontSize: 12,
            letterSpacing: "-0.01em",
          }}
        >
          Buy 152 USDT
          <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>

      {/* Bottom nav */}
      <div className="absolute bottom-0 left-0 right-0 z-50" style={{ background: isDark ? "rgba(5,5,5,0.97)" : "rgba(250,248,245,0.97)" }}>
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="flex items-center justify-between px-4 pt-1.5 pb-1.5">
          {TABS.map(({ key, Icon, label }) => {
            const active = key === "trade";
            return (
              <div key={key} className="relative flex flex-col items-center gap-0.5">
                {active && (
                  <div className="absolute top-1 w-7 h-7 rounded-xl" style={{ background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" }} />
                )}
                <div className="relative z-10 flex items-center justify-center w-9 h-9">
                  <Icon size={17} strokeWidth={active ? 2.4 : 1.6} style={{ color: active ? c.text : c.muted }} />
                </div>
                <span style={{ fontSize: 8, color: active ? c.text : c.muted, fontWeight: active ? 600 : 400 }}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── SCREEN 4: PAY BILLS ─────────────────────────────────────────────────────

const BILLS = [
  {
    name: "Rent",
    amt: "4,200",
    due: "Due 5 Mar",
    emoji: "🏠",
    color: "#ff6b35",
    active: true,
  },
  {
    name: "DEWA",
    amt: "380",
    due: "Due 12 Mar",
    emoji: "⚡",
    color: "#f59e0b",
    active: false,
  },
  {
    name: "Du Mobile",
    amt: "199",
    due: "Due 15 Mar",
    emoji: "📱",
    color: "#3b82f6",
    active: false,
  },
  {
    name: "Salik",
    amt: "50",
    due: "Due 20 Mar",
    emoji: "🚗",
    color: "#10b981",
    active: false,
  },
];

const PayScreen = ({ isDark }: { isDark: boolean }) => {
  const c = useC(isDark);
  return (
    <div
      className="flex flex-col h-full w-full relative overflow-hidden"
      style={{ background: c.bg, paddingTop: 52, color: c.text }}
    >
      <Orbs isDark={isDark} />
      <div className="px-4 pb-2 z-10">
        <Label c={c}>Payments</Label>
        <p style={{ fontSize: 17, fontWeight: 900, letterSpacing: "-0.035em" }}>
          Pay Bills
        </p>
      </div>

      <div
        className="flex-1 overflow-y-auto z-10 px-4 "
        style={{ scrollbarWidth: "none" }}
      >
        {/* Filter */}
        {/* <div
          className="flex gap-2 mb-0 overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {["All", "Upcoming", "Paid", "Auto-pay"].map((f, i) => (
            <div
              key={f}
              className="shrink-0 px-3.5 py-1.5 rounded-full"
              style={
                i === 0
                  ? {
                      background: isDark ? "#fff" : "#111",
                      color: isDark ? "#000" : "#fff",
                      fontSize: 8,
                      fontWeight: 900,
                      textTransform: "uppercase" as const,
                      letterSpacing: "0.1em",
                    }
                  : {
                      background: c.card,
                      border: `1px solid ${c.border}`,
                      color: c.muted,
                      fontSize: 8,
                      fontWeight: 900,
                      textTransform: "uppercase" as const,
                      letterSpacing: "0.1em",
                    }
              }
            >
              {f}
            </div>
          ))}
        </div> */}

        {/* Total due */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-[18px] p-3 mb-3 relative overflow-hidden"
          style={{
            background: isDark
              ? "linear-gradient(140deg, rgba(255,107,53,0.14), rgba(59,130,246,0.08))"
              : "linear-gradient(140deg, rgba(255,107,53,0.07), rgba(59,130,246,0.04))",
            border: `1px solid ${isDark ? "rgba(255,107,53,0.22)" : "rgba(255,107,53,0.12)"}`,
            boxShadow: "0 8px 32px rgba(255,107,53,0.08)",
          }}
        >
          <motion.div
            animate={{ x: ["-200%", "200%"] }}
            transition={{
              duration: 5,
              repeat: 2,
              repeatDelay: 8,
              ease: "easeInOut",
            }}
            className="absolute inset-0 skew-x-12"
            style={{
              background:
                "linear-gradient(90deg, transparent 30%, rgba(255,107,53,0.04) 50%, transparent 70%)",
            }}
          />
          <p
            style={{
              fontSize: 7,
              fontWeight: 900,
              letterSpacing: "0.28em",
              color: "#ff8f5e",
              textTransform: "uppercase" as const,
              marginBottom: 5,
            }}
          >
            Total Due This Month
          </p>
          <div className="flex items-baseline gap-1.5">
            <span
              style={{
                fontSize: 24,
                fontWeight: 900,
                letterSpacing: "-0.04em",
              }}
            >
              4,829
            </span>
            <span style={{ fontSize: 11, fontWeight: 900, color: c.muted }}>
              AED
            </span>
          </div>
          <p
            style={{ fontSize: 8, fontWeight: 700, color: c.sub, marginTop: 2 }}
          >
            4 bills · Next due in 3 days
          </p>
        </motion.div>

        {/* Bills */}
        <Label c={c}>Upcoming</Label>
        <div
          className="mt-2"
          style={{ display: "flex", flexDirection: "column", gap: 5 }}
        >
          {BILLS.map((b, i) => (
            <motion.div
              key={b.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-2 rounded-[13px]"
              style={{
                padding: "7px 9px",
                background: b.active
                  ? isDark
                    ? `${b.color}10`
                    : `${b.color}06`
                  : c.card,
                border: `1px solid ${b.active ? b.color + "30" : c.border}`,
                boxShadow: b.active ? `0 4px 16px ${b.color}12` : "none",
              }}
            >
              <div
                className="shrink-0 w-8 h-8 rounded-[10px] flex items-center justify-center"
                style={{
                  background: b.color + "15",
                  border: `1px solid ${b.color}20`,
                }}
              >
                <span style={{ fontSize: 14 }}>{b.emoji}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className="flex justify-between items-center"
                  style={{ marginBottom: 2 }}
                >
                  <p style={{ fontSize: 10, fontWeight: 900 }}>{b.name}</p>
                  <p style={{ fontSize: 10, fontWeight: 900 }}>
                    {b.amt}{" "}
                    <span style={{ fontSize: 7.5, color: c.muted }}>AED</span>
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span
                    style={{ fontSize: 7.5, fontWeight: 600, color: c.muted }}
                  >
                    {b.due}
                  </span>
                  {b.active ? (
                    <span
                      style={{
                        fontSize: 7.5,
                        fontWeight: 900,
                        color: b.color,
                        textTransform: "uppercase" as const,
                        letterSpacing: "0.1em",
                      }}
                    >
                      Pay Now →
                    </span>
                  ) : (
                    <span
                      style={{
                        fontSize: 7.5,
                        fontWeight: 700,
                        color: c.muted,
                        textTransform: "uppercase" as const,
                        letterSpacing: "0.08em",
                      }}
                    >
                      Pending
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Auto-pay */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="my-2 rounded-[16px] p-3 flex items-center gap-2.5"
          style={{
            background: isDark
              ? "rgba(16,185,129,0.08)"
              : "rgba(16,185,129,0.04)",
            border: "1px solid rgba(16,185,129,0.18)",
          }}
        >
          <div
            className="w-8 h-8 rounded-[10px] flex items-center justify-center"
            style={{ background: "rgba(16,185,129,0.15)" }}
          >
            <Zap size={14} style={{ color: "#10b981" }} />
          </div>
          <div className="flex-1">
            <p style={{ fontSize: 9.5, fontWeight: 900, color: "#10b981" }}>
              Auto-pay enabled
            </p>
            <p style={{ fontSize: 7.5, fontWeight: 600, color: c.muted }}>
              Bills paid from your USDT balance
            </p>
          </div>
        </motion.div>
      </div>

      {/* Bottom nav */}
      <div className="absolute bottom-0 left-0 right-0 z-50" style={{ background: isDark ? "rgba(5,5,5,0.97)" : "rgba(250,248,245,0.97)" }}>
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="flex items-center justify-between px-4 pt-1.5 pb-1.5">
          {TABS.map(({ key, Icon, label }) => {
            const active = key === "trade";
            return (
              <div key={key} className="relative flex flex-col items-center gap-0.5">
                {active && (
                  <div className="absolute top-1 w-7 h-7 rounded-xl" style={{ background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" }} />
                )}
                <div className="relative z-10 flex items-center justify-center w-9 h-9">
                  <Icon size={17} strokeWidth={active ? 2.4 : 1.6} style={{ color: active ? c.text : c.muted }} />
                </div>
                <span style={{ fontSize: 8, color: active ? c.text : c.muted, fontWeight: active ? 600 : 400 }}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── SCREEN 5: CASH OUT ──────────────────────────────────────────────────────

const CashOutScreen = ({ isDark }: { isDark: boolean }) => {
  const c = useC(isDark);
  return (
    <div
      className="h-full w-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background: isDark ? "black" : c.bg,
        padding: 28,
        paddingBottom: 72,
        textAlign: "center" as const,
        color: c.text,
      }}
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 35%, ${isDark ? "rgba(255,107,53,0.15)" : "rgba(255,107,53,0.08)"} 0%, ${isDark ? "rgba(255,107,53,0.08)" : "rgba(255,107,53,0.04)"} 40%, transparent 70%)`,
        }}
      />
      {/* Pulse rings */}
      <motion.div
        animate={{ scale: [1, 1.6, 1], opacity: [0.15, 0, 0.15] }}
        transition={{ duration: 2.5, repeat: 3 }}
        className="absolute z-0"
        style={{
          width: 160,
          height: 160,
          borderRadius: "50%",
          border: `1px solid ${isDark ? "rgba(255,107,53,0.2)" : "rgba(255,107,53,0.12)"}`,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -65%)",
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0, 0.2] }}
        transition={{ duration: 2.5, repeat: 3, delay: 0.4 }}
        className="absolute z-0"
        style={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          border: `1px solid ${isDark ? "rgba(255,107,53,0.15)" : "rgba(255,107,53,0.1)"}`,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -65%)",
        }}
      />

      {/* Success icon */}
      <motion.div
        initial={{ scale: 0.3, rotate: -20, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 350, damping: 14, delay: 0.1 }}
        className="flex items-center justify-center z-10"
        style={{
          width: 96,
          height: 96,
          borderRadius: 34,
          marginBottom: 22,
          background: "transparent",
          boxShadow:
            "0 0 50px rgba(255,107,53,0.25), 0 0 80px rgba(255,107,53,0.15), 0 16px 40px rgba(0,0,0,0.3)",
        }}
      >
        <img
          src="/brand/blip-icon.svg"
          alt="Blip"
          style={{ width: 58, height: 58, borderRadius: 16 }}
        />
      </motion.div>

      <motion.p
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          fontSize: 42,
          fontWeight: 900,
          letterSpacing: "-0.045em",
          lineHeight: 1,
          marginBottom: 6,
          zIndex: 1,
        }}
      >
        Done.
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{
          fontSize: 13,
          fontWeight: 900,
          textTransform: "uppercase" as const,
          letterSpacing: "0.18em",
          color: c.muted,
          marginBottom: 10,
          zIndex: 1,
        }}
      >
        Settled $5,000
      </motion.p>

      {/* Receipt */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="w-full z-10 mb-5"
        style={{ display: "flex", flexDirection: "column", gap: 7 }}
      >
        {[
          {
            label: "Method",
            value: "Bank Transfer",
            icon: <Wallet size={11} style={{ color: c.sub }} />,
            color: c.text,
          },
          {
            label: "Speed",
            value: "1.8s",
            icon: <Zap size={11} style={{ color: "#FF6B35" }} />,
            color: "#FF6B35",
          },
          {
            label: "Amount",
            value: "36,730 AED",
            icon: <Coins size={11} style={{ color: c.sub }} />,
            color: c.text,
          },
        ].map((r, i) => (
          <motion.div
            key={r.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.08 }}
            className="flex items-center justify-between rounded-[14px]"
            style={{
              padding: "9px 12px",
              background: c.card,
              border: `1px solid ${c.border}`,
            }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-[9px] flex items-center justify-center"
                style={{ background: c.hover }}
              >
                {r.icon}
              </div>
              <span
                style={{
                  fontSize: 8.5,
                  fontWeight: 700,
                  color: c.muted,
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.1em",
                }}
              >
                {r.label}
              </span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 900, color: r.color }}>
              {r.value}
            </span>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="w-full z-10 flex items-center justify-center"
        style={{
          height: 46,
          borderRadius: 22,
          fontSize: 12,
          fontWeight: 900,
          background: c.card,
          border: `1px solid ${c.border}`,
          color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)",
        }}
      >
        Back to Home
      </motion.div>

      {/* Bottom nav */}
      <div className="absolute bottom-0 left-0 right-0 z-50" style={{ background: isDark ? "rgba(5,5,5,0.97)" : "rgba(250,248,245,0.97)" }}>
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="flex items-center justify-between px-4 pt-1.5 pb-1.5">
          {TABS.map(({ key, Icon, label }) => {
            const active = key === "trade";
            return (
              <div key={key} className="relative flex flex-col items-center gap-0.5">
                {active && (
                  <div className="absolute top-1 w-7 h-7 rounded-xl" style={{ background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" }} />
                )}
                <div className="relative z-10 flex items-center justify-center w-9 h-9">
                  <Icon size={17} strokeWidth={active ? 2.4 : 1.6} style={{ color: active ? c.text : c.muted }} />
                </div>
                <span style={{ fontSize: 8, color: active ? c.text : c.muted, fontWeight: active ? 600 : 400 }}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>
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
      repeat: 3,
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

export default memo(App);
