import { useState, useEffect, useRef, memo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import { Shield } from "lucide-react";
import { MerchantDashboardVisual } from "../MerchantDashboard";
import { BiddingUI, ExplorerUI } from "../FeatureCinema";
import InstantBIdding from "../InstantBIdding";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/* ═══════════════════════════════════════════════════════════
   Smooth spring config for buttery scroll interpolation
   ═══════════════════════════════════════════════════════════ */
const SPRING_CONFIG = { stiffness: 80, damping: 30, mass: 0.8 };

/* ═══════════════════════════════════════════════════════════
   SCENE WRAPPER
   Cinematic horizontal slide with depth, blur & rotation
   ═══════════════════════════════════════════════════════════ */
interface SceneProps {
  progress: MotionValue<number>;
  start: number;
  end: number;
  eyebrow: string;
  headline: [string, string];
  subline: string;
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
  accent,
  isLast,
  children,
}: SceneProps) {
  const range = end - start;

  // 5-phase keyframes: quick enter → LONG hold at 100% → quick exit
  const k0 = start; // fully offscreen right
  const k1 = start + range * 0.1; // arriving center
  const k2 = start + range * 0.15; // fully settled — hold starts
  const k3 = end - range * 0.15; // hold ends — begin exit
  const k4 = end - range * 0.1; // exiting
  const k5 = end; // fully offscreen left

  // --- Horizontal X: slide right → center → left ---
  const xRaw = useTransform(
    progress,
    isLast ? [k0, k1, k2] : [k0, k1, k2, k3, k4, k5],
    isLast ? [80, 10, 0] : [80, 10, 0, 0, -10, -80],
  );
  const x = useSpring(xRaw, SPRING_CONFIG);
  // Convert to vw for responsive movement
  const xPercent = useTransform(x, (v) => `${v}vw`);

  // --- Opacity: smooth fade in & out ---
  const opacityRaw = useTransform(
    progress,
    isLast ? [k0, k1, k2] : [k0, k1, k2, k3, k4, k5],
    isLast ? [0, 0.6, 1] : [0, 0.6, 1, 1, 0.6, 0],
  );
  const opacity = useSpring(opacityRaw, SPRING_CONFIG);

  // --- Scale: grow in, shrink out ---
  const scaleRaw = useTransform(
    progress,
    isLast ? [k0, k1, k2] : [k0, k1, k2, k3, k4, k5],
    isLast ? [0.82, 0.94, 1] : [0.82, 0.94, 1, 1, 0.94, 0.82],
  );
  const scale = useSpring(scaleRaw, SPRING_CONFIG);

  // rotateY + blur removed — 3D perspective and filter: blur() force
  // expensive repaints. Depth conveyed via scale + opacity (compositor-only).

  // --- Ambient glow ---
  const glowOp = useTransform(
    progress,
    isLast ? [k0, k2] : [k0, k2, k3, k5],
    isLast ? [0, 0.6] : [0, 0.6, 0.6, 0],
  );

  // --- Text: quick entrance, stays visible through hold ---
  const textEnterStart = start + range * 0.04;
  const textEnterEnd = start + range * 0.14;
  const textOp = useTransform(
    progress,
    isLast
      ? [textEnterStart, textEnterEnd]
      : [textEnterStart, textEnterEnd, k3, k5],
    isLast ? [0, 1] : [0, 1, 1, 0],
  );
  const textYRaw = useTransform(
    progress,
    isLast
      ? [textEnterStart, textEnterEnd]
      : [textEnterStart, textEnterEnd, k3, k5],
    isLast ? [40, 0] : [40, 0, 0, -20],
  );
  const textY = useSpring(textYRaw, SPRING_CONFIG);

  // --- UI mockup: slightly delayed, then stays visible ---
  const uiEnterStart = start + range * 0.06;
  const uiEnterEnd = start + range * 0.16;
  const uiOp = useTransform(
    progress,
    isLast ? [uiEnterStart, uiEnterEnd] : [uiEnterStart, uiEnterEnd, k3, k5],
    isLast ? [0, 1] : [0, 1, 1, 0],
  );
  const uiYRaw = useTransform(
    progress,
    isLast ? [uiEnterStart, uiEnterEnd] : [uiEnterStart, uiEnterEnd, k3, k5],
    isLast ? [30, 0] : [30, 0, 0, -15],
  );
  const uiY = useSpring(uiYRaw, SPRING_CONFIG);

  return (
    <motion.div
      className="absolute inset-0"
      style={{
        x: xPercent,
        opacity,
        pointerEvents: "none",
        willChange: "transform, opacity",
      }}
    >
      {/* Scene ambient glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 45%, ${accent}25 0%, transparent 65%)`,
          opacity: glowOp,
        }}
      />

      <div className="absolute inset-0 flex flex-col items-center pt-[60px] sm:pt-[72px]">
        <motion.div
          className="w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center"
          style={{
            scale,
            willChange: "transform",
          }}
        >
          {/* Text — staggered entrance */}
          <motion.div
            style={{ y: textY, opacity: textOp }}
            className="w-full mb-4 sm:mb-6"
          >
            <div
              className="text-[10px] uppercase tracking-[3px] mb-2 font-semibold"
              style={{ color: accent }}
            >
              {eyebrow}
            </div>
            <h2 className="heading-h3 text-white mb-2 text-2xl sm:text-3xl lg:text-5xl">
              {headline[0]}
              <br />
              {headline[1]}
            </h2>
            <p className="p-medium text-white/50 max-w-[440px] mx-auto text-sm lg:text-base">
              {subline}
            </p>
          </motion.div>

          {/* UI mockup — delayed stagger */}
          <motion.div
            className="scale-[0.55] sm:scale-[0.7] md:scale-[0.85] lg:scale-100"
            style={{
              y: uiY,
              opacity: uiOp,
              willChange: "transform, opacity",
            }}
          >
            {children}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════════════════ */
const SCENE_COUNT = 4;
const SCENE_DURATION = 1 / SCENE_COUNT;
const OVERLAP = 0.03;

const SCENES_DATA = [
  {
    start: 0.0,
    end: SCENE_DURATION + OVERLAP,
    eyebrow: "01 · Escrow",
    headline: ["Funds locked.", "Always."] as [string, string],
    subline:
      "Smart contracts hold every dollar until both sides confirm. No bank. No trust required.",
    accent: "#ff6b35",
  },
  {
    start: SCENE_DURATION - OVERLAP,
    end: SCENE_DURATION * 2 + OVERLAP,
    eyebrow: "02 · Matching",
    headline: ["Best rate.", "Every time."] as [string, string],
    subline:
      "150+ merchants compete in real-time. You automatically get the winner.",
    accent: "#ff6b35",
  },
  {
    start: SCENE_DURATION * 2 - OVERLAP,
    end: SCENE_DURATION * 3 + OVERLAP,
    eyebrow: "03 · Verification",
    headline: ["On-chain.", "Forever."] as [string, string],
    subline:
      "Every settlement is public and immutable on BlipScan. Verifiable by anyone.",
    accent: "#ff6b35",
  },
  {
    start: SCENE_DURATION * 3 - OVERLAP,
    end: 1.0,
    eyebrow: "04 · Merchant Portal",
    headline: ["Full control.", "Real-time."] as [string, string],
    subline:
      "Track revenue, monitor settlements, and manage your merchant operations from one dashboard.",
    accent: "#ff6b35",
  },
];

const FeatureCinemaSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 90%", "end end"],
  });

  // Smooth out the raw scroll for the entire section
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 40,
    mass: 0.5,
  });

  const [activeScene, setActiveScene] = useState(0);
  const scrollHintOpacity = useTransform(smoothProgress, [0, 0.06], [1, 0]);

  // Background gradient transitions — dark base
  const bgGradient = useTransform(
    smoothProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [
      "radial-gradient(ellipse at 50% 50%, rgba(20,20,20,1) 0%, #000 70%)",
      "radial-gradient(ellipse at 40% 50%, rgba(15,15,25,1) 0%, #000 70%)",
      "radial-gradient(ellipse at 60% 50%, rgba(15,20,25,1) 0%, #000 70%)",
      "radial-gradient(ellipse at 50% 40%, rgba(15,25,20,1) 0%, #000 70%)",
      "radial-gradient(ellipse at 50% 50%, rgba(20,20,20,1) 0%, #000 70%)",
    ],
  );

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      if (v < 0.25) setActiveScene(0);
      else if (v < 0.5) setActiveScene(1);
      else if (v < 0.75) setActiveScene(2);
      else setActiveScene(3);
    });
    return unsub;
  }, [scrollYProgress]);

  return (
    <div
      ref={containerRef}
      className="h-[300vh] my-10 sm:h-[350vh] lg:h-[400vh]"
    >
      <div className="sticky top-0 overflow-hidden" style={{ height: "100vh" }}>
        {/* Animated background */}
        <motion.div
          className="absolute inset-0"
          style={{ background: bgGradient }}
        />

        {/* Subtle grid */}
        {/* <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        /> */}

        {/* Top pill label */}
        <div className="absolute top-4 sm:top-8 left-1/2 -translate-x-1/2 z-20">
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <Shield
              style={{
                width: 12,
                height: 12,
                color: "rgba(255,255,255,0.4)",
              }}
            />
            <span
              style={{
                fontSize: 10,
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
              }}
            >
              Core Features
            </span>
          </div>
        </div>

        {/* Scenes — fed smoothProgress for buttery interpolation */}
        {SCENES_DATA.map((s, i) => (
          <Scene
            key={i}
            progress={smoothProgress}
            {...s}
            isLast={i === SCENES_DATA.length - 1}
          >
            {i === 0 ? (
              <div className="mx-auto" style={{ width: "min(900px, 90vw)" }}>
                <InstantBIdding />
              </div>
            ) : i === 1 ? (
              <div className="mx-auto" style={{ width: "min(900px, 90vw)" }}>
                <BiddingUI />
              </div>
            ) : i === 2 ? (
              <div className="mx-auto" style={{ width: "min(900px, 90vw)" }}>
                <ExplorerUI />
              </div>
            ) : (
              <div
                className="relative mx-auto"
                style={{
                  width: "min(900px, 90vw)",
                  aspectRatio: "900 / 675",
                  overflow: "hidden",
                  borderRadius: 16,
                  background: "#0a0a0a",
                  boxShadow:
                    "0 25px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.06)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    width: 1220,
                    left: "50%",
                    transform: "translateX(-50%) scale(var(--dash-scale))",
                    transformOrigin: "top center",
                  }}
                  className="[--dash-scale:0.33] sm:[--dash-scale:0.46] md:[--dash-scale:0.62] lg:[--dash-scale:0.74]"
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
                width: 28,
                height: 6,
                borderRadius: 999,
                background: s.accent,
                transformOrigin: "center",
                willChange: "transform, opacity",
              }}
              animate={{
                scaleX: activeScene === i ? 1 : 6 / 28,
                opacity: activeScene === i ? 1 : 0.22,
              }}
              transition={{ duration: 0.5, ease: EASE }}
            />
          ))}
        </div>

        {/* Scroll cue */}
        <motion.div
          className="absolute right-6 sm:right-10 bottom-8 sm:bottom-12 hidden sm:flex flex-col items-center gap-2 z-20"
          style={{ opacity: scrollHintOpacity }}
        >
          <div
            className="h-8 w-px"
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgba(255,255,255,0.2))",
            }}
          />
          <span
            style={{
              fontSize: 8,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            Scroll
          </span>
        </motion.div>
      </div>
    </div>
  );
};

export default memo(FeatureCinemaSection);
