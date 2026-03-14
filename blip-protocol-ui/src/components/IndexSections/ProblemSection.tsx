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

/* ── Card definitions ── */
const CARDS_DARK = [
  {
    eyebrow: "The Cost",
    headlinePre: null as string | null,
    headline: "7%",
    sub: "Lost before it arrives." as string | null,
    micro: "Every cross-border transfer.",
    glowColor: "rgba(255,122,69,0.08)",
    headlineGradient: "linear-gradient(135deg, #ffffff 25%, #ffb07a 100%)",
    hasCurrencies: true,
    hasProgress: false,
    hasDotGrid: false,
  },
  {
    eyebrow: "The Wait",
    headlinePre: null as string | null,
    headline: "3 – 5 Days",
    sub: "To settle." as string | null,
    micro: "Global payments shouldn't crawl.",
    glowColor: "rgba(106,168,255,0.08)",
    headlineGradient: "linear-gradient(135deg, #ffffff 25%, #6aa8ff 100%)",
    hasCurrencies: false,
    hasProgress: true,
    hasDotGrid: false,
  },
  {
    eyebrow: "The Exposure",
    headlinePre: "Every transaction" as string | null,
    headline: "Tracked.",
    sub: null as string | null,
    micro: "Stored. Shared. Permanent.",
    glowColor: "rgba(176,124,255,0.08)",
    headlineGradient: "linear-gradient(135deg, #ffffff 25%, #b07cff 100%)",
    hasCurrencies: false,
    hasProgress: false,
    hasDotGrid: true,
  },
];

const CARDS_LIGHT = [
  {
    eyebrow: "The Cost",
    headlinePre: null as string | null,
    headline: "7%",
    sub: "Lost before it arrives." as string | null,
    micro: "Every cross-border transfer.",
    glowColor: "rgba(255,122,69,0.08)",
    headlineGradient: "linear-gradient(135deg, #2a2a2a 20%, #e8663a 100%)",
    hasCurrencies: true,
    hasProgress: false,
    hasDotGrid: false,
  },
  {
    eyebrow: "The Wait",
    headlinePre: null as string | null,
    headline: "3 – 5 Days",
    sub: "To settle." as string | null,
    micro: "Global payments shouldn't crawl.",
    glowColor: "rgba(106,168,255,0.08)",
    headlineGradient: "linear-gradient(135deg, #2a2a2a 20%, #3a7bd5 100%)",
    hasCurrencies: false,
    hasProgress: true,
    hasDotGrid: false,
  },
  {
    eyebrow: "The Exposure",
    headlinePre: "Every transaction" as string | null,
    headline: "Tracked.",
    sub: null as string | null,
    micro: "Stored. Shared. Permanent.",
    glowColor: "rgba(176,124,255,0.08)",
    headlineGradient: "linear-gradient(135deg, #2a2a2a 20%, #7a4ae0 100%)",
    hasCurrencies: false,
    hasProgress: false,
    hasDotGrid: true,
  },
];

/* ── Bento stats ── */
const BENTO = [
  { val: "<2s", lbl: "Settlement" },
  { val: "0.1%", lbl: "Fee" },
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

  const CARDS = isDark ? CARDS_DARK : CARDS_LIGHT;

  return (
    <section
      style={{
        background: isDark ? "rgba(0,0,0,0.7)" : "rgba(250,248,245,0.95)",
        padding: "80px 20px 70px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Vignette */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: isDark
            ? `
            radial-gradient(ellipse 80% 40% at 50% 0%,  rgba(255,255,255,0.015) 0%, transparent 100%),
            radial-gradient(ellipse 80% 50% at 50% 100%, rgba(0,0,0,0.45)       0%, transparent 100%)
          `
            : `
            radial-gradient(ellipse 80% 40% at 50% 0%,  rgba(0,0,0,0.01) 0%, transparent 100%),
            radial-gradient(ellipse 80% 50% at 50% 100%, rgba(0,0,0,0.02) 0%, transparent 100%)
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
          style={{
            textAlign: "center",
            fontSize: "clamp(2.8rem, 5.5vw, 5rem)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 1.08,
            marginBottom: 20,
          }}
        >
          <span
            style={{
              color: isDark ? "#ffffff" : "#1a1a1a",
              display: "block",
            }}
          >
            Global payments
          </span>
          <span
            style={{
              display: "block",
              color: isDark ? "rgba(255,255,255,0.4)" : "#555555",
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
          className="text-base md:text-lg lg:text-xl text-black/80 dark:text-white/50 max-w-lg text-center mx-auto leading-relaxed mb-10 font-medium"
        >
          The traditional financial system was built for a different era.
          Stablecoin adoption is rising. Merchants are stuck. The timing is now.
        </motion.p>

        {/* ── 3 Problem Cards ── */}
        <div
          key={`cards-${isDark ? "dark" : "light"}`}
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ gap: 14, marginBottom: 14 }}
        >
          {CARDS.map((card, i) => (
            <motion.div
              key={card.eyebrow}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.08 + i * 0.1, ease: EASE }}
              whileHover={{ y: -4 }}
              style={{
                position: "relative",
                background: isDark
                  ? card.hasDotGrid
                    ? `radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px) #0f0f0f`
                    : "#0f0f0f"
                  : card.hasDotGrid
                    ? `radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px) #ffffff`
                    : "#ffffff",
                backgroundSize: card.hasDotGrid ? "22px 22px" : undefined,
                borderRadius: 24,
                overflow: "hidden",
                height: 360,
                border: isDark
                  ? "1px solid rgba(255,255,255,0.085)"
                  : "1px solid rgba(0,0,0,0.06)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                boxShadow: isDark
                  ? `
                  inset 0 1px 0 rgba(255,255,255,0.06),
                  0 0 80px 28px ${card.glowColor},
                  0 2px 4px rgba(0,0,0,0.55),
                  0 16px 48px rgba(0,0,0,0.65)
                `
                  : `
                  0 0 40px 12px ${card.glowColor},
                  0 1px 2px rgba(0,0,0,0.04),
                  0 4px 16px rgba(0,0,0,0.05),
                  0 12px 40px rgba(0,0,0,0.04)
                `,
                transition:
                  "box-shadow 0.32s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
              }}
            >
              {/* Top-edge highlight */}
              {isDark && (
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 1,
                    background:
                      "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.11) 50%, transparent 100%)",
                    pointerEvents: "none",
                    zIndex: 10,
                  }}
                />
              )}

              {/* Currency bg symbols — Card 1 only */}
              {card.hasCurrencies &&
                CURRENCIES.map((c, ci) => (
                  <div
                    key={ci}
                    aria-hidden
                    style={{
                      position: "absolute",
                      fontSize: c.size,
                      fontWeight: 700,
                      color: isDark ? "white" : "black",
                      opacity: isDark ? 0.035 : 0.055,
                      pointerEvents: "none",
                      userSelect: "none",
                      lineHeight: 1,
                      zIndex: 1,
                      top: c.top,
                      bottom: c.bottom,
                      left: c.left,
                      right: c.right,
                      transform: `rotate(${c.rotate}deg)`,
                    }}
                  >
                    {c.char}
                  </div>
                ))}

              {/* Content */}
              <div
                style={{
                  position: "relative",
                  zIndex: 2,
                  padding: "32px 32px 36px",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <span
                  style={{
                    display: "block",
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "2.5px",
                    textTransform: "uppercase",
                    color: isDark
                      ? "rgba(255,255,255,0.22)"
                      : "rgba(0,0,0,0.70)",
                    marginBottom: 22,
                  }}
                >
                  {card.eyebrow}
                </span>

                {card.headlinePre && (
                  <span
                    style={{
                      display: "block",
                      fontSize: "clamp(1.1rem, 1.8vw, 1.35rem)",
                      fontWeight: 500,
                      color: isDark
                        ? "rgba(255,255,255,0.42)"
                        : "rgba(0,0,0,0.45)",
                      letterSpacing: "-0.02em",
                      lineHeight: 1.3,
                      marginBottom: 4,
                    }}
                  >
                    {card.headlinePre}
                  </span>
                )}

                <div
                  style={{
                    fontSize: "clamp(3.8rem, 5.5vw, 5.2rem)",
                    fontWeight: 700,
                    letterSpacing: "-0.05em",
                    lineHeight: 0.95,
                    marginBottom: 12,
                    background: card.headlineGradient,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  {card.headline}
                </div>

                {card.sub && (
                  <div
                    style={{
                      fontSize: "clamp(1rem, 1.6vw, 1.2rem)",
                      fontWeight: 500,
                      color: isDark
                        ? "rgba(255,255,255,0.38)"
                        : "rgba(0,0,0,0.42)",
                      letterSpacing: "-0.02em",
                      lineHeight: 1.3,
                    }}
                  >
                    {card.sub}
                  </div>
                )}

                <div
                  style={{
                    marginTop: "auto",
                    paddingTop: 20,
                    fontSize: 11.5,
                    fontWeight: 400,
                    color: isDark
                      ? "rgba(255,255,255,0.16)"
                      : "rgba(0,0,0,0.70)",
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
                    background: isDark
                      ? "rgba(255,255,255,0.04)"
                      : "rgba(0,0,0,0.06)",
                    zIndex: 3,
                  }}
                >
                  <motion.div
                    style={{
                      height: "100%",
                      background: isDark
                        ? "rgba(255,255,255,0.22)"
                        : "rgba(0,0,0,0.22)",
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

        {/* ── Enter Blip card ── */}
        <motion.div
          key={`blip-${isDark ? "dark" : "light"}`}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.35, ease: EASE }}
          whileHover={{ y: -3 }}
          className="flex flex-col md:flex-row items-center"
          style={{
            background: isDark ? "#0f0f0f" : "#ffffff",
            border: isDark
              ? "1px solid rgba(255,255,255,0.08)"
              : "1px solid rgba(0,0,0,0.06)",
            borderRadius: 20,
            padding: "40px 48px",
            gap: 48,
            overflow: "hidden",
            position: "relative",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: isDark
              ? `
              inset 0 1px 0 rgba(255,255,255,0.05),
              0 0 60px 22px rgba(255,107,53,0.07),
              0 2px 4px rgba(0,0,0,0.5),
              0 20px 60px rgba(0,0,0,0.65)
            `
              : `
              0 0 40px 12px rgba(255,107,53,0.04),
              0 1px 2px rgba(0,0,0,0.04),
              0 4px 16px rgba(0,0,0,0.05),
              0 12px 40px rgba(0,0,0,0.04)
            `,
            transition: "box-shadow 0.32s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          {/* Orange glow top-left */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: -60,
              left: -60,
              width: 280,
              height: 280,
              background: isDark
                ? "radial-gradient(circle, rgba(255,107,53,0.08) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(255,107,53,0.06) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          {/* Top-edge highlight */}
          {isDark && (
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 1,
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
                pointerEvents: "none",
                zIndex: 2,
              }}
            />
          )}

          {/* Left — text */}
          <div style={{ flex: 1, minWidth: 0, position: "relative" }}>
            {/* Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "4px 10px",
                background: "rgba(255,107,53,0.12)",
                border: "1px solid rgba(255,107,53,0.2)",
                borderRadius: 999,
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#ff6b35",
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
                  background: "#ff6b35",
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
                background: isDark
                  ? "linear-gradient(140deg, #ffffff 25%, #ff8c50 100%)"
                  : "linear-gradient(140deg, #2a2a2a 20%, #e8663a 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Enter Blip.
            </div>

            <p
              style={{
                fontSize: 14,
                lineHeight: 1.65,
                color: isDark ? "rgba(255,255,255,0.32)" : "rgba(0,0,0,0.70)",
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
                border: isDark
                  ? "1px solid rgba(255,255,255,0.1)"
                  : "1px solid rgba(0,0,0,0.06)",
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
                        ? isDark
                          ? "rgba(249,115,22,0.05)"
                          : "rgba(255,107,53,0.06)"
                        : isDark
                          ? "rgba(255,255,255,0.012)"
                          : "rgba(0,0,0,0.015)",
                    borderRight:
                      i % 2 === 0
                        ? isDark
                          ? "1px solid rgba(255,255,255,0.1)"
                          : "1px solid rgba(0,0,0,0.06)"
                        : "none",
                    borderBottom:
                      i < 2
                        ? isDark
                          ? "1px solid rgba(255,255,255,0.1)"
                          : "1px solid rgba(0,0,0,0.06)"
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
                            background: isDark
                              ? "linear-gradient(to bottom right, white, #fb923c)"
                              : "linear-gradient(to bottom right, #2a2a2a, #e8663a)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                            color: "transparent",
                          }
                        : {
                            color: isDark ? "#ffffff" : "#2a2a2a",
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
                      color: isDark
                        ? "rgba(255,255,255,0.25)"
                        : "rgba(0,0,0,0.70)",
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
