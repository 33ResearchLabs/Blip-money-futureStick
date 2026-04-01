import { useState, useEffect, useRef, memo } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { CTAButton } from "../Navbar";
import createGlobe from "cobe";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ── Currency float symbols (Card 1) ── */
const CURRENCIES: Array<{
  char: string;
  size: number;
  rotate: number;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}> = [
  { char: "$", size: 170, top: -35, right: -18, rotate: -12 },
  { char: "€", size: 90, bottom: 24, left: -14, rotate: 9 },
  { char: "£", size: 65, top: 55, right: 62, rotate: 5 },
  { char: "¥", size: 52, bottom: 72, right: 28, rotate: -5 },
];

/* ── Card definitions (Apple-style: white cards, black text) ── */
const CARDS = [
  {
    eyebrow: "The Cost",
    headlinePre: null as string | null,
    headline: "7%",
    sub: "Lost before it arrives." as string | null,
    micro: "Every cross-border transfer.",
    hasProgress: false,
  },
  {
    eyebrow: "The Wait",
    headlinePre: null as string | null,
    headline: "3 – 5 Days",
    sub: "To settle." as string | null,
    micro: "Global payments shouldn't crawl.",
    hasProgress: true,
  },
  {
    eyebrow: "The Exposure",
    headlinePre: "Every transaction" as string | null,
    headline: "Tracked.",
    sub: null as string | null,
    micro: "Stored. Shared. Permanent.",
    hasProgress: false,
  },
];

/* ── Bento stats ── */
const BENTO = [
  { val: "<2s", lbl: "Settlement" },
  { val: "1.5%", lbl: "Cheapest in market" },
  { val: "Non-custodial", lbl: "You keep control" },
  { val: "On-chain", lbl: "Full transparency" },
];

/* ─── Night Globe — scroll-driven rotation ──────────────────────── */
function NightGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phiRef = useRef(0.5);
  const widthRef = useRef(0);
  const lastScrollY = useRef(
    typeof window !== "undefined" ? window.scrollY : 0,
  );

  useEffect(() => {
    if (!canvasRef.current) return;

    const onResize = () => {
      if (canvasRef.current) widthRef.current = canvasRef.current.offsetWidth;
    };
    window.addEventListener("resize", onResize);
    onResize();

    // Scroll-delta driven rotation: up = right (phi +), down = left (phi -)
    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;
      phiRef.current -= delta * 0.004;
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    let globe: ReturnType<typeof createGlobe> | null = null;
    try {
      globe = createGlobe(canvasRef.current, {
        devicePixelRatio: 2,
        width: widthRef.current * 2,
        height: widthRef.current * 2,
        phi: 0.5,
        theta: 0.42,
        dark: 1,
        diffuse: 1.4,
        mapSamples: 20000,
        mapBrightness: 7,
        baseColor: [0.06, 0.07, 0.12],
        markerColor: [1, 0.82, 0.28],
        glowColor: [0.18, 0.32, 0.72],
        markers: [
          { location: [25.2048, 55.2708], size: 0.06 }, // Dubai
          { location: [40.7128, -74.006], size: 0.05 }, // New York
          { location: [51.5074, -0.1278], size: 0.05 }, // London
          { location: [1.3521, 103.8198], size: 0.045 }, // Singapore
          { location: [35.6762, 139.6503], size: 0.04 }, // Tokyo
          { location: [19.076, 72.8777], size: 0.04 }, // Mumbai
          { location: [48.8566, 2.3522], size: 0.04 }, // Paris
          { location: [-23.5505, -46.6333], size: 0.04 }, // São Paulo
        ],
        onRender: (state) => {
          state.phi = phiRef.current;
          state.width = widthRef.current * 2;
          state.height = widthRef.current * 2;
        },
      });
    } catch (e) {
      console.warn("Globe initialization failed:", e);
    }

    return () => {
      globe?.destroy();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        mixBlendMode: "screen",
      }}
    />
  );
}

const ProblemSection = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted ? theme === "dark" : true;

  const cards = CARDS;

  return (
    <section
      style={{
        background: isDark ? "rgba(0,0,0,0.7)" : "rgba(250,248,245,0.95)",
        padding: "80px 20px 70px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Blue/purple ambient glow */}
      <div className="section-glow" aria-hidden />

      {/* Vignette */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: isDark
            ? `
            radial-gradient(ellipse 60% 35% at 35% 0%,  rgba(59,130,246,0.035) 0%, transparent 100%),
            radial-gradient(ellipse 50% 30% at 55% 0%,  rgba(139,92,246,0.025) 0%, transparent 100%),
            radial-gradient(ellipse 40% 25% at 65% 0%,  rgba(6,182,212,0.02)  0%, transparent 100%),
            radial-gradient(ellipse 80% 50% at 50% 100%, rgba(0,0,0,0.45)      0%, transparent 100%)
          `
            : `
            radial-gradient(ellipse 60% 35% at 35% 0%,  rgba(59,130,246,0.018) 0%, transparent 100%),
            radial-gradient(ellipse 50% 30% at 55% 0%,  rgba(139,92,246,0.012) 0%, transparent 100%),
            radial-gradient(ellipse 40% 25% at 65% 0%,  rgba(6,182,212,0.01)   0%, transparent 100%),
            radial-gradient(ellipse 80% 50% at 50% 100%, rgba(0,0,0,0.02)      0%, transparent 100%)
          `,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Grain noise */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          opacity: isDark ? 0.022 : 0.012,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Globe — right edge, half-visible */}
      {isDark && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            right: -300,
            top: "50%",
            transform: "translateY(-50%)",
            width: 600,
            height: 600,
            zIndex: 1,
            pointerEvents: "none",
          }}
        >
          <NightGlobe />
        </div>
      )}

      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* ── Header ── */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{
            textAlign: "center",
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: isDark ? "#808080" : "#555555",
            marginBottom: 28,
          }}
        >
          Why now
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
          className="heading-h2"
          style={{
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          <span className="mb-3"
            style={{
              color: isDark ? "#ffffff" : "#1a1a1a",
              display: "block",
            }}
          >
            Global payments
          </span>
          {/* <span
            style={{
              display: "block",
              color: isDark ? "rgba(255,255,255,0.4)" : "#555555",
            }}
          >
            are broken.
          </span> */}
          <span
            style={{
              display: "block",
              color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
            }}
          >
            are broken.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.15, ease: EASE }}
          className="p-large text-black/80 dark:text-white/50 max-w-lg text-center mx-auto mb-10"
        >
          The traditional financial system was built for a different era.
          Stablecoin adoption is rising. Merchants are stuck. The timing is now.
        </motion.p>

        {/* ── 3 Problem Cards ── */}
        {/* ── 3 Problem Cards — Apple style ── */}
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ gap: 16, marginBottom: 16 }}
        >
          {cards.map((card, i) => (
            <motion.div
              key={card.eyebrow}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.08 + i * 0.1, ease: EASE }}
              whileHover={{ y: -6, boxShadow: "0 20px 60px rgba(0,0,0,0.12)" }}
              style={{
                position: "relative",
                background: "#ffffff",
                borderRadius: 20,
                overflow: "hidden",
                height: 340,
                border: "none",
                boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
                transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                cursor: "default",
              }}
            >
              {/* Content */}
              <div
                style={{
                  position: "relative",
                  zIndex: 2,
                  padding: "36px 32px 32px",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                {/* Eyebrow */}
                <span
                  style={{
                    display: "block",
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    color: "rgba(0,0,0,0.4)",
                    marginBottom: 24,
                  }}
                >
                  {card.eyebrow}
                </span>

                {/* Pre-headline */}
                {card.headlinePre && (
                  <span
                    style={{
                      display: "block",
                      fontSize: "clamp(1.1rem, 1.8vw, 1.35rem)",
                      fontWeight: 500,
                      color: "rgba(0,0,0,0.45)",
                      letterSpacing: "-0.02em",
                      lineHeight: 1.3,
                      marginBottom: 4,
                    }}
                  >
                    {card.headlinePre}
                  </span>
                )}

                {/* Headline */}
                <div
                  style={{
                    fontSize: "clamp(3.5rem, 5vw, 4.8rem)",
                    fontWeight: 700,
                    letterSpacing: "-0.04em",
                    lineHeight: 0.95,
                    marginBottom: 12,
                    color: "#1d1d1f",
                  }}
                >
                  {card.headline}
                </div>

                {/* Sub */}
                {card.sub && (
                  <div
                    style={{
                      fontSize: "clamp(1rem, 1.6vw, 1.15rem)",
                      fontWeight: 500,
                      color: "rgba(0,0,0,0.5)",
                      letterSpacing: "-0.01em",
                      lineHeight: 1.4,
                    }}
                  >
                    {card.sub}
                  </div>
                )}

                {/* Micro */}
                <div
                  style={{
                    marginTop: "auto",
                    paddingTop: 20,
                    fontSize: 13,
                    fontWeight: 400,
                    color: "rgba(0,0,0,0.35)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {card.micro}
                </div>
              </div>

              {/* Stalled progress bar — Card 2 only */}
              {card.hasProgress && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: "rgba(0,0,0,0.06)",
                    zIndex: 3,
                  }}
                >
                  <motion.div
                    style={{
                      height: "100%",
                      background: "#1d1d1f",
                      borderRadius: "0 2px 2px 0",
                    }}
                    animate={{
                      width: ["0%", "73%", "75%", "75%", "0%"],
                      opacity: [1, 1, 1, 0, 0],
                    }}
                    transition={{
                      duration: 5.5,
                      times: [0, 0.55, 0.72, 0.88, 1],
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* ── Enter Blip card — Apple-style colorful ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
          whileHover={{ y: -3 }}
          className="flex flex-col md:flex-row items-center"
          style={{
            background: "linear-gradient(135deg, #1d1d1f 0%, #2d1b4e 25%, #4a1942 45%, #c0392b 70%, #f39c12 100%)",
            borderRadius: 20,
            padding: "40px 48px",
            gap: 48,
            overflow: "hidden",
            position: "relative",
            border: "none",
            boxShadow: "0 4px 30px rgba(192,57,43,0.15), 0 20px 60px rgba(0,0,0,0.2)",
            transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          {/* Ambient color blobs */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: -80,
              right: -80,
              width: 350,
              height: 350,
              background: "radial-gradient(circle, rgba(243,156,18,0.3) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              bottom: -60,
              left: -60,
              width: 300,
              height: 300,
              background: "radial-gradient(circle, rgba(142,68,173,0.25) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* Left — text */}
          <div style={{ flex: 1, minWidth: 0, position: "relative" }}>
            {/* Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "4px 12px",
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 999,
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#ffffff",
                marginBottom: 16,
              }}
            >
              <motion.div
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "#ffffff",
                  flexShrink: 0,
                }}
              />
              The Fix
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: "clamp(2.6rem, 4.2vw, 4rem)",
                fontWeight: 700,
                letterSpacing: "-0.05em",
                lineHeight: 0.95,
                marginBottom: 14,
                color: "#ffffff",
              }}
            >
              Enter Blip.
            </div>

            <p
              style={{
                fontSize: 14,
                lineHeight: 1.65,
                color: "rgba(255,255,255,0.7)",
                marginBottom: 28,
                letterSpacing: "-0.01em",
                maxWidth: 340,
              }}
            >
              Instant settlement. Minimal fees.
              <br />
              Complete privacy.
            </p>

            <CTAButton to="/waitlist">
              Join Waitlist
            </CTAButton>
          </div>

          {/* Right — Bento 2×2 */}
          <div className="w-full md:w-[380px] flex-shrink-0">
            <div
              className="grid grid-cols-1 md:grid-cols-2 rounded-[18px] overflow-hidden"
              style={{
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              {BENTO.map((stat, i) => (
                <div
                  key={stat.lbl}
                  style={{
                    padding: "20px",
                    transition: "background 0.2s",
                    background:
                      i === 0
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(255,255,255,0.03)",
                    borderRight:
                      i % 2 === 0
                        ? "1px solid rgba(255,255,255,0.15)"
                        : "none",
                    borderBottom:
                      i < 2
                        ? "1px solid rgba(255,255,255,0.15)"
                        : "none",
                  }}
                >
                  {/* Value */}
                  <div
                    style={{
                      fontWeight: 700,
                      lineHeight: 1,
                      marginBottom: 4,
                      fontSize: "clamp(1.25rem, 2vw, 1.75rem)",
                      letterSpacing: "-0.04em",
                      ...(i === 0
                        ? {
                            background: "linear-gradient(to bottom right, #ffffff, #f39c12)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                            color: "transparent",
                          }
                        : {
                            color: "#ffffff",
                          }),
                    }}
                  >
                    {stat.val}
                  </div>

                  {/* Label */}
                  <div
                    style={{
                      fontSize: 9.5,
                      fontWeight: 600,
                      letterSpacing: "1.5px",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    {stat.lbl}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(ProblemSection);
