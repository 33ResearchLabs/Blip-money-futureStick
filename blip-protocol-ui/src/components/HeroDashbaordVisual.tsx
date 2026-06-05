import { motion } from "framer-motion";

export const HeroDashboardVisual = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="relative z-10 min-h-[550px] md:min-h-[650px] lg:min-h-[750px] overflow-visible">
      {/* Perspective stage - Linear style */}
      <div
        className="absolute inset-0 flex justify-center"
        style={{ perspective: "2000px" }}
      >
        <motion.div
          className="relative w-[120vw] md:w-[110vw] lg:w-[100vw] max-w-[1800px]"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          <motion.div
            initial={{
              opacity: 0,
              x: -10,
              y: -420, // ⬅️ START far above screen
              z: -250,
              rotateX: 20,
              rotateY: 25,
              rotateZ: -25,
              zIndex: -40,
            }}
            animate={{
              opacity: 1,
              x: -10,
              y: [-420, -180, -200, -180], // ⬇️ drop → settle → float
              z: -250,
              rotateX: 20,
              rotateY: 25,
              rotateZ: -25,
              zIndex: -40,
            }}
            transition={{
              duration: 2,
              delay: 0.2,
              ease: "easeInOut",
            }}
            className="relative origin-top transform-gpu will-change-transform"
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {children}
          </motion.div>
        </motion.div>
      </div>

      {/*
        Immersive dark fade overlays.
        Wrapped in a stage that matches the dashboard's own width (w-120vw → 100vw)
        so the gradients line up with the tilted dashboard and reach the viewport
        edges instead of being clipped to the centered content column.
        Each layer fades to transparent toward the center so it blends seamlessly
        with the section's existing center vignette — content stays partially visible.
      */}
      {/*
        Break out of the narrow <main> column to the full viewport width
        (left-1/2 + -translate-x-1/2 + w-screen) and overscan upward
        (-top-[260px]) so the fade also covers the dashboard's floated-up top
        edge. Each gradient is anchored to its OWN real edge, so the dark always
        reaches the actual top / right of the screen — no leftover bright band.
      */}
      <div className="pointer-events-none absolute z-20 left-1/2 -translate-x-1/2 w-screen -top-[260px] bottom-0">
        {/* Right-side fade — black at the right edge, gone by mid-canvas.
            Stays clear of the center (transparent by 78%). */}
        <div
          aria-hidden
          className="absolute inset-y-0 right-0 w-[48vw]"
          style={{
            background:
              "linear-gradient(to left, #000 0%, rgba(0,0,0,0.92) 14%, rgba(0,0,0,0.6) 34%, rgba(0,0,0,0.25) 56%, transparent 78%)",
          }}
        />
        {/* Top-right corner only — darkens the lifted corner of the tilted board.
            Anchored to the top-RIGHT and fades out toward the center, so the
            center-top is left untouched (handled by the section's own vignette). */}
        <div
          aria-hidden
          className="absolute top-0 right-0 w-[68vw] h-[88%]"
          style={{
            background:
              "radial-gradient(ellipse 90% 95% at 100% 0%, #000 0%, rgba(0,0,0,0.78) 30%, rgba(0,0,0,0.35) 55%, transparent 78%)",
          }}
        />
      </div>
    </div>
  );
};
