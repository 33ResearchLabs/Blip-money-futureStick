import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef, useMemo } from "react";

/* ============================================
   SEND MONEY SHOWCASE — OPTIMIZED SCROLL STORY
   ────────────────────────────────────────────
   Smoother, lighter animations with reduced height (140vh).

   OPTIMIZATIONS:
   - Reduced section height for snappier feel
   - Earlier animation start (0.3 vs 0.42) for responsiveness
   - Lighter scale transitions for smoothness
   - GPU-accelerated with willChange hints
   - Memoized transforms to reduce recalculations

   Phase 1  (0.0–0.2)   Heading shrinks gently
   Phase 2  (0.2–0.7)   Cards fly in and settle
   Phase 3  (0.7–1.0)   Hold final composition
   ============================================ */

const floatingCards = [
  {
    label: "PARENTS",
    type: "default",
    size: "w-52 h-60 sm:w-60 sm:h-72 lg:w-64 lg:h-80",
    glow: "rgba(34,197,94,0.15)",
    bgColor: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    textColor: "#ffffff",
    icon: "💚",
    iconBg: "rgba(255,255,255,0.2)",
    subtitle: "TO PARENTS",
    mainText: "$500",
    secondaryText: "Sent today",
    footer: "Completed",
    footerBg: "rgba(255,255,255,0.2)",
    footerColor: "#ffffff",
  },
  {
    label: "CRYPTO",
    type: "default",
    size: "w-52 h-60 sm:w-60 sm:h-72 lg:w-64 lg:h-80",
    glow: "rgba(59,130,246,0.15)",
    bgColor: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    textColor: "#ffffff",
    icon: "₿",
    iconBg: "rgba(255,255,255,0.2)",
    subtitle: "BITCOIN",
    mainText: "0.034",
    secondaryText: "≈ $1,847",
    footer: "Send",
    footerBg: "rgba(255,255,255,0.2)",
    footerColor: "#ffffff",
  },
  {
    label: "ONCHAIN",
    type: "onchain",
    size: "w-52 h-64 sm:w-60 sm:h-72 lg:w-64 lg:h-80",
    glow: "rgba(139,92,246,0.15)",
    bgColor: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    textColor: "#ffffff",
  },
  {
    label: "BILLS",
    type: "default",
    size: "w-52 h-60 sm:w-60 sm:h-72 lg:w-64 lg:h-80",
    glow: "rgba(251,146,60,0.15)",
    bgColor: "linear-gradient(135deg, #fb923c 0%, #f97316 100%)",
    textColor: "#ffffff",
    icon: "⚡",
    iconBg: "rgba(255,255,255,0.2)",
    subtitle: "ELECTRIC BILL",
    mainText: "$145",
    secondaryText: "Due today",
    footer: "Pay Now",
    footerBg: "rgba(255,255,255,0.2)",
    footerColor: "#ffffff",
  },
  {
    label: "MERCHANT",
    type: "default",
    size: "w-52 h-60 sm:w-60 sm:h-72 lg:w-64 lg:h-80",
    glow: "rgba(99,102,241,0.15)",
    bgColor: "rgba(255, 255, 255, 0.98)",
    textColor: "#1e293b",
    icon: "🏪",
    iconBg: "rgba(99,102,241,0.1)",
    subtitle: "BEST RATE",
    mainText: "0.99%",
    secondaryText: "Processing fee",
    footer: "Accept",
    footerBg: "#6366f1",
    footerColor: "#ffffff",
  },
];

export default function DashboardShowcaseSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    // Smoother, lighter scroll range
    offset: ["start start", "end end"],
  });

  // ── Heading transforms - Smoother, lighter animations ─────────────────────────────
  // Scale: Gentler transition for smoother feel
  const headingScale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.7, 1],
    [1.5, 1.2, 0.85, 0.85],
  );
  // Opacity: Lighter fade for better visibility
  const headingOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.7, 1],
    [1, 1, 0.3, 0.3],
  );

  // ── Card animations - Staggered, organic floating from spatial depths ──
  // Inspired by premium fintech sites but smoother

  // Card 0 - Top-left, arrives first
  const c0x = useTransform(
    scrollYProgress,
    [0, 0.25, 0.65, 1],
    [-700, -700, -70, -70],
  );
  const c0y = useTransform(
    scrollYProgress,
    [0, 0.25, 0.65, 1],
    [-500, -500, -30, -30],
  );
  const c0o = useTransform(scrollYProgress, [0, 0.25, 0.55, 1], [0, 0, 1, 1]);
  const c0s = useTransform(
    scrollYProgress,
    [0, 0.25, 0.65, 1],
    [0.85, 0.85, 1, 1],
  );
  const c0r = useTransform(
    scrollYProgress,
    [0, 0.25, 0.65, 1],
    [-8, -8, -6, -6],
  );

  // Card 1 - Top-right, staggered entry
  const c1x = useTransform(
    scrollYProgress,
    [0, 0.28, 0.68, 1],
    [700, 700, 80, 80],
  );
  const c1y = useTransform(
    scrollYProgress,
    [0, 0.28, 0.68, 1],
    [-500, -500, -20, -20],
  );
  const c1o = useTransform(scrollYProgress, [0, 0.28, 0.58, 1], [0, 0, 1, 1]);
  const c1s = useTransform(
    scrollYProgress,
    [0, 0.28, 0.68, 1],
    [0.9, 0.9, 1, 1],
  );
  const c1r = useTransform(scrollYProgress, [0, 0.28, 0.68, 1], [8, 8, 5, 5]);

  // Card 2 - Bottom-left, arrives later for depth
  const c2x = useTransform(
    scrollYProgress,
    [0, 0.31, 0.71, 1],
    [-700, -700, -55, -55],
  );
  const c2y = useTransform(
    scrollYProgress,
    [0, 0.31, 0.71, 1],
    [500, 500, 45, 45],
  );
  const c2o = useTransform(scrollYProgress, [0, 0.31, 0.61, 1], [0, 0, 1, 1]);
  const c2s = useTransform(
    scrollYProgress,
    [0, 0.31, 0.71, 1],
    [0.88, 0.88, 1, 1],
  );
  const c2r = useTransform(scrollYProgress, [0, 0.31, 0.71, 1], [6, 6, 4, 4]);

  // Card 3 - Bottom-right
  const c3x = useTransform(
    scrollYProgress,
    [0, 0.34, 0.74, 1],
    [700, 700, 65, 65],
  );
  const c3y = useTransform(
    scrollYProgress,
    [0, 0.34, 0.74, 1],
    [500, 500, 50, 50],
  );
  const c3o = useTransform(scrollYProgress, [0, 0.34, 0.64, 1], [0, 0, 1, 1]);
  const c3s = useTransform(
    scrollYProgress,
    [0, 0.34, 0.74, 1],
    [0.92, 0.92, 1, 1],
  );
  const c3r = useTransform(
    scrollYProgress,
    [0, 0.34, 0.74, 1],
    [-7, -7, -5, -5],
  );

  // Card 4 - Center, arrives last (hero card)
  const c4x = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0, 5, 5]);
  const c4y = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [-600, -600, 5, 5],
  );
  const c4o = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [0, 0, 1, 1]);
  const c4s = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 0.8, 1, 1]);
  const c4r = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0, 2, 2]);

  const transforms = useMemo(
    () => [
      { x: c0x, y: c0y, opacity: c0o, scale: c0s, rotate: c0r },
      { x: c1x, y: c1y, opacity: c1o, scale: c1s, rotate: c1r },
      { x: c2x, y: c2y, opacity: c2o, scale: c2s, rotate: c2r },
      { x: c3x, y: c3y, opacity: c3o, scale: c3s, rotate: c3r },
      { x: c4x, y: c4y, opacity: c4o, scale: c4s, rotate: c4r },
    ],
    [
      c0x,
      c0y,
      c0o,
      c0s,
      c0r,
      c1x,
      c1y,
      c1o,
      c1s,
      c1r,
      c2x,
      c2y,
      c2o,
      c2s,
      c2r,
      c3x,
      c3y,
      c3o,
      c3s,
      c3r,
      c4x,
      c4y,
      c4o,
      c4s,
      c4r,
    ],
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-[140vh] bg-white dark:bg-black"
      style={{ contain: "paint", touchAction: "pan-y" }}
    >
      {/*
        Sticky viewport — the KEY to the entire effect.
        - Before sticky: this div scrolls UP through the viewport naturally.
          The heading (centered inside) scrolls with it = "normal scroll".
        - Sticky engages when this div's top hits viewport top (top:0).
          Everything inside FREEZES. Heading locked at center.
        - Stays stuck for 90vh of scroll (190vh section - 100vh container).
      */}
      <div
        className="sticky top-0 h-screen overflow-hidden"
        style={{ transform: "translate3d(0, 0, 0)" }}
      >
        {/* ── Animated cards — z-20, ABOVE heading for overlap depth ── */}
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          {floatingCards.map((card, index) => (
            <motion.div
              key={card.label}
              className={`absolute ${card.size}`}
              style={{
                x: transforms[index].x,
                y: transforms[index].y,
                opacity: transforms[index].opacity,
                scale: transforms[index].scale,
                rotate: transforms[index].rotate,
                zIndex: index === 4 ? 25 : 20 - index,
                willChange: "transform, opacity",
              }}
            >
              {/* Subtle glow */}
              <div
                className="absolute -inset-4 rounded-3xl blur-2xl opacity-40"
                style={{ background: card.glow }}
              />

              {/* Custom UI Card */}
              <div
                className="relative w-full h-full rounded-2xl overflow-hidden shadow-[0_12px_48px_-8px_rgba(0,0,0,0.4)] transition-shadow duration-300"
                style={{
                  backdropFilter: "blur(20px)",
                  background: card.bgColor || "rgba(255, 255, 255, 0.95)",
                }}
              >
                {card.type === "onchain" ? (
                  // Onchain Transaction Card
                  <div className="p-5 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg">
                          ⛓️
                        </div>
                        <div>
                          <div className="text-white/60 text-[10px] font-bold">
                            ONCHAIN
                          </div>
                          <div className="text-white text-xs font-bold">
                            TX SETTLED
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center space-y-3">
                      <div className="bg-white/15 rounded-xl p-3">
                        <div className="text-white/60 text-[10px] font-bold mb-2">
                          TRANSACTION
                        </div>
                        <div className="text-white text-xl sm:text-2xl font-bold mb-1">
                          $2,340
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                          <span className="text-white/70 text-[10px] font-semibold">
                            Confirmed
                          </span>
                        </div>
                      </div>

                      <div className="bg-white/15 rounded-xl p-3">
                        <div className="text-white/60 text-[10px] font-bold mb-1">
                          BLOCK
                        </div>
                        <div className="text-white text-sm font-mono font-bold">
                          8,742,891
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 bg-white/20 rounded-xl py-2.5 px-4 text-center">
                      <span className="text-white text-xs font-bold">
                        View on Explorer
                      </span>
                    </div>
                  </div>
                ) : card.type === "app" ? (
                  // Special App Interface Card
                  <div className="p-5 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">
                        💳
                      </div>
                      <div className="text-white/60 text-xs font-semibold">
                        BLIP
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center space-y-4">
                      <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                        <div className="text-white/60 text-[10px] font-bold mb-1">
                          TOTAL BALANCE
                        </div>
                        <div className="text-white text-2xl sm:text-3xl font-bold">
                          $12,847
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white/10 rounded-lg p-2.5 backdrop-blur-sm">
                          <div className="text-white/60 text-[9px] font-bold mb-1">
                            SENT
                          </div>
                          <div className="text-white text-sm font-bold">
                            $8.2K
                          </div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-2.5 backdrop-blur-sm">
                          <div className="text-white/60 text-[9px] font-bold mb-1">
                            RECEIVED
                          </div>
                          <div className="text-white text-sm font-bold">
                            $4.6K
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 bg-white rounded-xl py-2.5 px-4 text-center">
                      <span className="text-indigo-900 text-xs font-bold">
                        Open App
                      </span>
                    </div>
                  </div>
                ) : (
                  // Default Card
                  <div className="p-5 h-full flex flex-col justify-between">
                    {/* Card Icon/Badge */}
                    {card.icon && (
                      <div className="flex items-center gap-2 mb-4">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
                          style={{ background: card.iconBg }}
                        >
                          {card.icon}
                        </div>
                      </div>
                    )}

                    {/* Main Content */}
                    <div className="flex-1">
                      <p
                        className="text-xs sm:text-sm font-bold opacity-60 mb-2 tracking-wider"
                        style={{ color: card.textColor || "#000" }}
                      >
                        {card.subtitle}
                      </p>
                      <p
                        className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-2 leading-tight"
                        style={{ color: card.textColor || "#000" }}
                      >
                        {card.mainText}
                      </p>
                      {card.secondaryText && (
                        <p
                          className="text-sm sm:text-base font-semibold opacity-80"
                          style={{ color: card.textColor || "#000" }}
                        >
                          {card.secondaryText}
                        </p>
                      )}
                    </div>

                    {/* Footer/Action */}
                    {card.footer && (
                      <div className="mt-4">
                        <div
                          className="text-xs sm:text-sm font-bold px-4 py-3 rounded-xl inline-block"
                          style={{
                            background: card.footerBg || "rgba(0,0,0,0.1)",
                            color: card.footerColor || "#000",
                          }}
                        >
                          {card.footer}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Heading — absolute centered, z-10 BELOW cards ──
             NO y transform. Position = CSS only.
             Framer only touches scale + opacity. ── */}
        <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
          <motion.div
            className="text-center w-full max-w-3xl"
            style={{
              scale: headingScale,
              opacity: headingOpacity,
              willChange: "transform, opacity",
            }}
          >
            <h2 className="font-display text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-semibold tracking-tight leading-[0.95] sm:leading-[0.95] text-black dark:text-white px-2">
              Send money to
              <br />
              anyone, anywhere.
            </h2>

            <div className="mt-6 sm:mt-8 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-6 rounded-2xl sm:rounded-full border border-black/10 dark:border-white/[0.08] px-4 sm:px-6 md:px-10 py-3 sm:py-4 md:py-6 backdrop-blur-sm mx-auto max-w-2xl">
              <div className="text-xs sm:text-sm text-black/60 dark:text-white/40 space-y-1 text-center sm:text-left">
                <p className="hidden sm:block">
                  Users buy and sell crypto with local merchants.
                </p>
                <p className="hidden sm:block">
                  Merchants provide liquidity and compete on price.
                </p>
                <p className="hidden sm:block">
                  Blip settles instantly on-chain.
                </p>
                <p className="sm:hidden">
                  Buy & sell crypto with local merchants. Instant on-chain
                  settlement.
                </p>
              </div>

              <Link
                to="/send"
                className="group inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs sm:text-sm font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition whitespace-nowrap flex-shrink-0"
              >
                Get started
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
