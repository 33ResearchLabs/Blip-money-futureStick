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
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-[120vw] md:w-[110vw] lg:w-[100vw] max-w-[1800px]"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          <motion.div
            initial={{}}
            animate={{
              x: -10,
              y: [-180, -200, -180],
              z: -250,
              x2: -200,
              rotateX: 20,
              rotateZ: -25,
              rotateY: 25,
              zIndex: -40,
            }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative origin-top transform-gpu will-change-transform"
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {children}
          </motion.div>
        </motion.div>
      </div>

      {/* Right side fade */}
      <div
        className="
    pointer-events-none
    absolute top-0 right-0
    h-screen
    w-44 md:w-52 lg:w-[32rem]
    bg-gradient-to-l from-black via-black/70 to-transparent
    -skew-y-10
    origin-top-right
  "
      />

      {/* Left side fade */}
      {/* <div className="pointer-events-none absolute top-0 left-0 h-full w-20 md:w-28 bg-gradient-to-r from-black via-black/70 to-transparent" /> */}

      {/* Bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 md:h-56 bg-gradient-to-t from-black via-black/40 to-transparent -skew-x-6" />
    </div>
  );
};
