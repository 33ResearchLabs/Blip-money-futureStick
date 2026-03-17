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
import { EscrowUI, BiddingUI, ExplorerUI } from "../FeatureCinema";

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

  // --- Subtle Y rotation for 3D depth feel ---
  const rotateYRaw = useTransform(
    progress,
    isLast ? [k0, k1, k2] : [k0, k1, k2, k3, k4, k5],
    isLast ? [6, 1, 0] : [6, 1, 0, 0, -1, -6],
  );
  const rotateY = useSpring(rotateYRaw, SPRING_CONFIG);

  // --- Blur for depth ---
  const blurRaw = useTransform(
    progress,
    isLast ? [k0, k1, k2] : [k0, k1, k2, k3, k4, k5],
    isLast ? [8, 2, 0] : [8, 2, 0, 0, 2, 8],
  );
  const blur = useSpring(blurRaw, SPRING_CONFIG);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);

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
        perspective: 1200,
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
            rotateY,
            transformStyle: "preserve-3d",
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
            <h2 className="heading-h3 text-gray-900 mb-2 text-2xl sm:text-3xl lg:text-5xl">
              {headline[0]}
              <br />
              <span className="text-gray-400">{headline[1]}</span>
            </h2>
            <p className="p-medium text-gray-500 max-w-[440px] mx-auto text-sm lg:text-base">
              {subline}
            </p>
          </motion.div>

          {/* UI mockup — delayed stagger */}
          <motion.div
            className="scale-[0.55] sm:scale-[0.7] md:scale-[0.85] lg:scale-100"
            style={{
              y: uiY,
              opacity: uiOp,
              filter,
              willChange: "transform, opacity, filter",
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
    offset: ["start start", "end end"],
  });

  // Smooth out the raw scroll for the entire section
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 40,
    mass: 0.5,
  });

  const [activeScene, setActiveScene] = useState(0);
  const scrollHintOpacity = useTransform(smoothProgress, [0, 0.06], [1, 0]);

  // Background gradient transitions — warm light base matching site theme
  const bgGradient = useTransform(
    smoothProgress,
    [0, 0.25, 0.5, 0.75, 1],
    [
      "radial-gradient(ellipse at 50% 50%, rgba(255,248,240,1) 0%, #F0EBE3 70%)",
      "radial-gradient(ellipse at 40% 50%, rgba(245,240,250,1) 0%, #F0EBE3 70%)",
      "radial-gradient(ellipse at 60% 50%, rgba(240,248,255,1) 0%, #F0EBE3 70%)",
      "radial-gradient(ellipse at 50% 40%, rgba(240,250,245,1) 0%, #F0EBE3 70%)",
      "radial-gradient(ellipse at 50% 50%, rgba(255,248,240,1) 0%, #F0EBE3 70%)",
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
      className="h-[600vh] my-10 sm:h-[650vh] lg:h-[700vh]"
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
              background: "rgba(0,0,0,0.04)",
              border: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            <Shield
              style={{
                width: 12,
                height: 12,
                color: "rgba(0,0,0,0.35)",
              }}
            />
            <span
              style={{
                fontSize: 10,
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "rgba(0,0,0,0.35)",
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
              <EscrowUI />
            ) : i === 1 ? (
              <BiddingUI />
            ) : i === 2 ? (
              <ExplorerUI />
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
                "linear-gradient(to bottom, transparent, rgba(0,0,0,0.15))",
            }}
          />
          <span
            style={{
              fontSize: 8,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "rgba(0,0,0,0.25)",
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
