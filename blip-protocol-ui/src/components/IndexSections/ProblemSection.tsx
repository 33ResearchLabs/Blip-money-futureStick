import { useEffect, useRef, memo } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useState } from "react";
import { SwipeHint } from "./SwipeHint";
import createGlobe from "cobe";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ────────────────────────────────────────────────────────────
   Atmospheric night globe — restrained, lives in the bg.
   ──────────────────────────────────────────────────────────── */
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

    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;
      phiRef.current -= delta * 0.0035;
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
        theta: 0.4,
        dark: 1,
        diffuse: 1.2,
        mapSamples: 18000,
        mapBrightness: 5,
        baseColor: [0.05, 0.06, 0.1],
        markerColor: [1, 0.42, 0.21],
        glowColor: [0.14, 0.22, 0.5],
        markers: [
          { location: [25.2048, 55.2708], size: 0.05 }, // Dubai
          { location: [40.7128, -74.006], size: 0.04 }, // New York
          { location: [51.5074, -0.1278], size: 0.04 }, // London
          { location: [1.3521, 103.8198], size: 0.04 }, // Singapore
          { location: [35.6762, 139.6503], size: 0.035 }, // Tokyo
          { location: [19.076, 72.8777], size: 0.035 }, // Mumbai
          { location: [48.8566, 2.3522], size: 0.035 }, // Paris
          { location: [-23.5505, -46.6333], size: 0.035 }, // São Paulo
        ],
        onRender: (state) => {
          state.phi = phiRef.current;
          state.width = widthRef.current * 2;
          state.height = widthRef.current * 2;
        },
      });
    } catch (e) {
      console.warn("Globe init failed:", e);
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
        opacity: 0.7,
      }}
    />
  );
}

/* ────────────────────────────────────────────────────────────
   Editorial problem card — premium dark glass.
   Big metric/keyword dominates. Three sub-lines secondary.
   ──────────────────────────────────────────────────────────── */
interface ProblemCardProps {
  index: number;
  eyebrow: string;
  metric: string;
  metricSub: string;
  lines: string[];
}
/* Pastel theme variants — all orange family, three shades */
const CARD_THEMES = [
  {
    bg: "linear-gradient(165deg, #fff4ea 0%, #ffe5d0 100%)",
    eyebrowColor: "#a45a40",
    widget: { label: "Fees collected right now", value: "$69,445", color: "#cc785c" },
  },
  {
    bg: "linear-gradient(165deg, #fff8f1 0%, #ffece0 100%)",
    eyebrowColor: "#a45a40",
    widget: { label: "Time lost to book waiting", value: "03:14:38", color: "#cc785c" },
  },
  {
    bg: "linear-gradient(165deg, #ffe8dc 0%, #ffd6c2 100%)",
    eyebrowColor: "#a45a40",
    widget: { label: "Scams reported on P2P desks", value: "Account Takeover #0061", color: "#cc785c" },
  },
];

function ProblemCard({ index, eyebrow, metric, metricSub, lines }: ProblemCardProps) {
  const theme = CARD_THEMES[index] ?? CARD_THEMES[0];
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.9, ease: EASE, delay: index * 0.08 }}
      whileHover={{ y: -6 }}
      className="group relative h-full flex flex-col rounded-3xl overflow-hidden"
      style={{
        background: theme.bg,
        boxShadow:
          "0 24px 64px -28px rgba(0,0,0,0.18), 0 1px 0 rgba(255,255,255,0.6) inset",
        transition: "box-shadow 0.4s ease",
      }}
    >
      <div className="relative z-10 flex flex-col h-full px-7 pt-7 pb-7 md:px-8 md:pt-8 md:pb-8">
        {/* Eyebrow */}
        <div className="flex items-center gap-2.5 mb-8">
          <span
            className="text-[10px] font-bold tracking-[0.3em] uppercase"
            style={{ color: theme.eyebrowColor }}
          >
            {eyebrow}
          </span>
        </div>

        {/* Big metric */}
        <div className="mb-1">
          <div
            className="font-display text-black"
            style={{
              fontSize: "clamp(2.6rem, 4.4vw, 4rem)",
              fontWeight: 600,
              lineHeight: 0.98,
              letterSpacing: "-0.045em",
            }}
          >
            {metric}
          </div>
          <div className="mt-3 text-[14px] font-medium tracking-tight text-black/60">
            {metricSub}
          </div>
        </div>

        {/* Sub-lines */}
        <ul className="mt-6 space-y-1.5">
          {lines.map((line) => (
            <li
              key={line}
              className="flex items-start gap-2 text-[12.5px] tracking-tight text-black/55"
            >
              <span className="mt-[7px] w-1 h-1 rounded-full bg-black/25 shrink-0" />
              <span>{line}</span>
            </li>
          ))}
        </ul>

        {/* Inner live widget — shows the live cost / waiting / risk pulse */}
        <div className="mt-auto pt-6">
          <div
            className="rounded-2xl px-4 py-3.5"
            style={{
              background: "rgba(255,255,255,0.55)",
              border: "1px solid rgba(0,0,0,0.04)",
              boxShadow: "0 2px 10px -4px rgba(0,0,0,0.06)",
            }}
          >
            <div className="text-[8.5px] font-bold tracking-[0.22em] uppercase text-black/45">
              {theme.widget.label}
            </div>
            <div className="mt-1 flex items-center gap-2">
              <motion.span
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: theme.widget.color }}
              />
              <span
                className="font-mono text-[15px] font-bold tabular-nums tracking-tight"
                style={{ color: theme.widget.color }}
              >
                {theme.widget.value}
              </span>
            </div>
            <div className="mt-1 text-[10px] text-black/40 tracking-tight italic">
              {index === 0 ? "Hidden in the spread you don't see" : index === 1 ? "Bank confirmations, manual release" : "Reversed. Frozen. Disputed."}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

const PROBLEMS: ProblemCardProps[] = [
  {
    index: 0,
    eyebrow: "Pricing",
    metric: "3–5%",
    metricSub: "Traditional spreads on every P2P trade.",
    lines: [
      "Hidden pricing.",
      "Fragmented liquidity.",
      "Manual execution.",
    ],
  },
  {
    index: 1,
    eyebrow: "Time",
    metric: "18 min",
    metricSub: "Average settlement on legacy P2P desks.",
    lines: [
      "Waiting for matching.",
      "Waiting for release.",
      "Waiting for confirmation.",
    ],
  },
  {
    index: 2,
    eyebrow: "Trust",
    metric: "Disputed",
    metricSub: "1 in 8 P2P trades end in conflict.",
    lines: [
      "Chargebacks.",
      "Frozen funds.",
      "Off-platform coordination.",
    ],
  },
];

const PILLARS = [
  {
    label: "Settlement in under 60s",
    sub: "Bank-webhook auto-release.",
  },
  {
    label: "Merchant-priced liquidity",
    sub: "Verified counterparties bid live.",
  },
  {
    label: "Every settlement verifiable",
    sub: "On-chain. Auditable. Final.",
  },
];

const ProblemSection = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted ? theme === "dark" : true;

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "#ffffff",
        color: "#0a0a0a",
        padding: "140px 20px 120px",
      }}
    >
      {/* ── Atmospheric layers ── */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 75% 45% at 50% 0%, rgba(204,120,92,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Single restrained warm accent at the right edge */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 35% 28% at 100% 35%, rgba(255,107,53,0.08), transparent 70%)",
        }}
      />

      {/* Globe — bg only, very low opacity */}
      <div
        aria-hidden
        className="absolute hidden lg:block pointer-events-none"
        style={{
          right: -340,
          top: "52%",
          transform: "translateY(-50%)",
          width: 640,
          height: 640,
          opacity: 0.55,
        }}
      >
        <NightGlobe />
      </div>

      {/* Ultra-fine grain */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.55 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
        }}
      />

      <div className="relative z-10 max-w-[1240px] mx-auto">
        {/* ── Editorial header ── */}
        <div className="flex flex-col items-center text-center mb-24 md:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="inline-flex items-center gap-2.5 mb-9"
          >
            <span className="w-6 h-px bg-black/15" />
            <span className="text-[10.5px] font-semibold tracking-[0.32em] uppercase text-black/55">
              The P2P Problem
            </span>
            <span className="w-6 h-px bg-black/15" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE, delay: 0.08 }}
            className="font-display text-black"
            style={{
              fontSize: "clamp(2.6rem, 6vw, 5rem)",
              fontWeight: 500,
              lineHeight: 1.04,
              letterSpacing: "-0.045em",
            }}
          >
            <span className="block">P2P payments</span>
            <span
              className="block mt-1"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.45) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              are broken.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
            className="mt-8 max-w-[520px] mx-auto text-[15.5px] md:text-[16px] leading-[1.65] text-black/55"
          >
            Fragmented liquidity. Manual settlement. Trust risk on every trade.
            The legacy P2P stack wasn't built for global, instant payments.
          </motion.p>
        </div>

        {/* ── Problem cards ── */}
        <div className="relative mb-28 md:mb-36">
          <div className="flex md:grid md:grid-cols-3 gap-5 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {PROBLEMS.map((p) => (
              <div
                key={p.eyebrow}
                className="snap-start shrink-0 w-[86%] md:w-auto"
              >
                <ProblemCard {...p} />
              </div>
            ))}
          </div>
          <SwipeHint />
        </div>

        {/* ── The Fix — institutional transition ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: EASE }}
          className="relative rounded-[28px] overflow-hidden"
          style={{
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow:
              "0 30px 80px -32px rgba(0,0,0,0.7), 0 1px 0 rgba(255,255,255,0.04) inset",
          }}
        >
          {/* Slowly drifting earth backdrop */}
          <motion.div
            aria-hidden
            initial={{ scale: 1.05 }}
            animate={{ scale: [1.05, 1.12, 1.05] }}
            transition={{ duration: 36, ease: "easeInOut", repeat: Infinity }}
            className="absolute inset-0"
            style={{
              backgroundImage: "url('/fix-bg.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.55) contrast(1.05) saturate(0.8)",
            }}
          />

          {/* Multi-layer cinematic overlay */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%)",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 100% 70% at 50% 50%, transparent 35%, rgba(0,0,0,0.45) 80%)",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 opacity-50"
            style={{
              background:
                "radial-gradient(ellipse 60% 25% at 50% 100%, rgba(255,107,53,0.10), transparent 65%)",
            }}
          />

          {/* Content */}
          <div className="relative z-10 px-6 py-16 sm:px-8 sm:py-20 md:px-12 md:py-24 lg:px-16 lg:py-28">
            <div className="max-w-[860px] mx-auto text-center">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2.5 mb-10">
                <span className="relative flex w-1.5 h-1.5">
                  <span className="absolute inset-0 rounded-full bg-[#ff6b35] opacity-70 animate-ping" />
                  <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-[#ff6b35]" />
                </span>
                <span className="text-[10.5px] font-semibold tracking-[0.32em] uppercase text-black/60">
                  The Settlement Layer
                </span>
              </div>

              {/* Headline — institutional moment */}
              <h3
                className="font-display"
                style={{
                  fontSize: "clamp(2.2rem, 5.4vw, 4.4rem)",
                  fontWeight: 500,
                  lineHeight: 1.04,
                  letterSpacing: "-0.045em",
                }}
              >
                <span className="block text-black/50">
                  This is not a payments app.
                </span>
                <span className="block mt-2 text-black">
                  This is a settlement layer.
                </span>
              </h3>

              {/* Subtext */}
              <p className="mt-10 max-w-[560px] mx-auto text-[15.5px] md:text-[16px] leading-[1.65] text-black/60">
                Protocol-level infrastructure for borderless, on-chain
                settlement — with merchant-powered liquidity at every venue.
              </p>

              {/* Pillars — differentiated, technical, credible */}
              <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                {PILLARS.map((p, i) => (
                  <motion.div
                    key={p.label}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.7,
                      delay: 0.2 + i * 0.08,
                      ease: EASE,
                    }}
                    className="group relative text-left rounded-2xl px-5 py-4 transition-colors"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      backdropFilter: "blur(14px)",
                      WebkitBackdropFilter: "blur(14px)",
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-mono text-[10px] font-semibold tracking-[0.18em] text-black/45 mt-1 shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <div className="text-[14px] font-semibold text-black leading-tight tracking-tight">
                          {p.label}
                        </div>
                        <div className="text-[12px] text-black/55 mt-1 tracking-tight">
                          {p.sub}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(ProblemSection);
