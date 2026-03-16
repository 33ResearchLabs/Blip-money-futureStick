import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { Shield, Check } from "lucide-react";
import { MerchantDashboardVisual } from "../MerchantDashboard";
import { EscrowUI, BiddingUI, ExplorerUI } from "../FeatureCinema";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/* ═══════════════════════════════════════════════════════════
   SCENE WRAPPER
   Scroll-driven zoom-in / zoom-out + text overlay
   ═══════════════════════════════════════════════════════════ */
interface SceneProps {
  progress: MotionValue<number>;
  start: number;
  end: number;
  eyebrow: string;
  headline: [string, string];
  subline: string;
  bullets: string[];
  accent: string;
  isLast?: boolean;
  children: React.ReactNode;
}

function Scene({
  progress,
  start,
  end,
  eyebrow,
  headline,
  subline,
  bullets,
  accent,
  isLast,
  children,
}: SceneProps) {
  const range = end - start;
  const enterEnd = start + range * 0.18;
  const exitStart = end - range * 0.22;

  const opacity = useTransform(
    progress,
    isLast ? [start, enterEnd] : [start, enterEnd, exitStart, end],
    isLast ? [0, 1] : [0, 1, 1, 0],
  );
  const scale = useTransform(
    progress,
    isLast ? [start, enterEnd] : [start, enterEnd, exitStart, end],
    isLast ? [0.22, 1] : [0.22, 1, 1, 1.75],
  );
  const blurN = useTransform(
    progress,
    isLast ? [start, enterEnd] : [start, enterEnd, exitStart, end],
    isLast ? [30, 0] : [30, 0, 0, 26],
  );
  const filter = useTransform(blurN, (v) => `blur(${v}px)`);
  const glowOp = useTransform(
    progress,
    isLast ? [start, enterEnd] : [start, enterEnd, exitStart, end],
    isLast ? [0, 0.8] : [0, 0.8, 0.8, 0],
  );
  const textOp = useTransform(
    progress,
    isLast
      ? [start, start + range * 0.12]
      : [start, start + range * 0.12, exitStart, end],
    isLast ? [0, 1] : [0, 1, 1, 0],
  );
  const textY = useTransform(progress, [start, enterEnd], [24, 0]);

  return (
    <motion.div
      className="absolute inset-0"
      style={{ opacity, pointerEvents: "none" }}
    >
      {/* Scene ambient glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 62% 50%, ${accent}12 0%, transparent 55%)`,
          opacity: glowOp,
        }}
      />

      <div className="absolute inset-0 flex flex-col">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center h-full pt-16 sm:pt-20">
          {/* Text on top — centered */}
          <motion.div
            style={{ y: textY, opacity: textOp }}
            className="flex-shrink-0 w-full text-center mb-6 sm:mb-8"
          >
            <div
              className="text-[10px] uppercase tracking-[3px] mb-3 font-semibold"
              style={{ color: accent }}
            >
              {eyebrow}
            </div>
            <h2 className="heading-h3 text-white mb-3 text-2xl sm:text-3xl lg:text-5xl">
              {headline[0]}
              <br />
              <span style={{ color: "rgba(255,255,255,0.28)" }}>
                {headline[1]}
              </span>
            </h2>
            <p className="p-medium text-white/40 max-w-[440px] mx-auto text-sm lg:text-base">
              {subline}
            </p>
          </motion.div>

          {/* Screen below — zoom-in UI */}
          <div className="flex-1 flex items-start justify-center w-full max-w-full overflow-hidden">
            <motion.div
              className="origin-top scale-[0.55] sm:scale-[0.7] md:scale-[0.85] lg:scale-100"
              style={{ scale, filter }}
            >
              {children}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════════════════ */
const SCENES_DATA = [
  {
    start: 0.0,
    end: 0.3,
    eyebrow: "01 · Escrow",
    headline: ["Funds locked.", "Always."] as [string, string],
    subline:
      "Smart contracts hold every dollar until both sides confirm. No bank. No trust required.",
    bullets: [
      "Non-custodial smart contracts",
      "Instant on-chain lock",
      "Auto-release on confirmation",
    ],
    accent: "rgba(255,255,255,0.5)",
  },
  {
    start: 0.22,
    end: 0.48,
    eyebrow: "02 · Matching",
    headline: ["Best rate.", "Every time."] as [string, string],
    subline:
      "150+ merchants compete in real-time. You automatically get the winner.",
    bullets: [
      "150+ verified merchants",
      "Real-time competitive pricing",
      "Auto-select best offer",
    ],
    accent: "rgba(255,255,255,0.5)",
  },
  {
    start: 0.4,
    end: 0.68,
    eyebrow: "03 · Verification",
    headline: ["On-chain.", "Forever."] as [string, string],
    subline:
      "Every settlement is public and immutable on BlipScan. Verifiable by anyone.",
    bullets: [
      "Immutable on-chain record",
      "Verifiable by anyone",
      "Real-time explorer",
    ],
    accent: "rgba(255,255,255,0.5)",
  },
  {
    start: 0.6,
    end: 1.0,
    eyebrow: "04 · Merchant Portal",
    headline: ["Full control.", "Real-time."] as [string, string],
    subline:
      "Track revenue, monitor settlements, and manage your merchant operations from one dashboard.",
    bullets: [
      "Live revenue tracking",
      "Settlement history & analytics",
      "Merchant verification status",
    ],
    accent: "rgba(255,255,255,0.5)",
  },
];

export default function FeatureCinemaSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [activeScene, setActiveScene] = useState(0);
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.07], [1, 0]);

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      if (v < 0.25) setActiveScene(0);
      else if (v < 0.45) setActiveScene(1);
      else if (v < 0.65) setActiveScene(2);
      else setActiveScene(3);
    });
    return unsub;
  }, [scrollYProgress]);

  return (
    <div ref={containerRef} className="h-[350vh] sm:h-[400vh] lg:h-[450vh]">
      <div
        className="sticky top-0 overflow-hidden"
        style={{ height: "100vh", background: "#060606" }}
      >
        {/* Subtle grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* Top pill label */}
        <div className="absolute top-4 sm:top-8 left-1/2 -translate-x-1/2 z-20">
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <Shield
              style={{
                width: 12,
                height: 12,
                color: "rgba(255,255,255,0.28)",
              }}
            />
            <span
              style={{
                fontSize: 10,
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.28)",
              }}
            >
              Core Features
            </span>
          </div>
        </div>

        {/* Scenes */}
        {SCENES_DATA.map((s, i) => (
          <Scene
            key={i}
            progress={scrollYProgress}
            {...s}
            isLast={i === SCENES_DATA.length - 1}
          >
            {i === 0 ? (
              <EscrowUI />
            ) : i === 1 ? (
              <BiddingUI />
            ) : i === 2 ? (
              <ExplorerUI />
            ) : (
              <div
                key={1}
                className="w-[300px] sm:w-[400px] md:w-[500px] lg:w-[560px] h-[225px] sm:h-[300px] md:h-[375px] lg:h-[420px]"
                style={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 16,
                }}
              >
                <div
                  className="scale-[0.25] sm:scale-[0.33] md:scale-[0.41] lg:scale-[0.46]"
                  style={{
                    transformOrigin: "top left",
                    width: 1220,
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                >
                  <MerchantDashboardVisual />
                </div>
              </div>
            )}
          </Scene>
        ))}

        {/* Progress dots */}
        <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-30">
          {SCENES_DATA.map((s, i) => (
            <motion.div
              key={i}
              style={{
                height: 6,
                borderRadius: 999,
                background: s.accent,
              }}
              animate={{
                width: activeScene === i ? 28 : 6,
                opacity: activeScene === i ? 1 : 0.22,
              }}
              transition={{ duration: 0.4, ease: EASE }}
            />
          ))}
        </div>

        {/* Scroll cue (fades out early, hidden on mobile) */}
        <motion.div
          className="absolute right-6 sm:right-10 bottom-8 sm:bottom-12 hidden sm:flex flex-col items-center gap-2 z-20"
          style={{ opacity: scrollHintOpacity }}
        >
          <div
            className="h-8 w-px"
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgba(255,255,255,0.15))",
            }}
          />
          <span
            style={{
              fontSize: 8,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.18)",
            }}
          >
            Scroll
          </span>
        </motion.div>
      </div>
    </div>
  );
}
