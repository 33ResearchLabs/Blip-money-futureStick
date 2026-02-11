import { motion } from "framer-motion";

export const HeroDashboardMobVisual = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      drag="x"
      dragConstraints={{ left: -400, right: 100 }}
      dragElastic={0.1}
      whileDrag={{ scale: 1.02 }}
      style={{ perspective: 3000, cursor: "grab" }}
      className="relative"
    >
      {/* 3D Tilt Panel - Y axis only */}
      <motion.div
        initial={{
          rotateY: -20,
          scale: 0.92,
        }}
        animate={{
          //   rotateZ: -4,
          rotateY: -55,
          scale: 1,
        }}
        transition={{
          duration: 1.6,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="relative origin-center transform-gpu will-change-transform"
      >
        {/* Panel Container */}
        <div className="relative w-[700px] md:w-[800px] md:right-[-250px] lg:w-[1000px] xl:w-[1100px] h-[550px] md:h-[400px] lg:h-[750px] rounded-xl overflow-hidden ">
          {/* Glass shine */}
          {/* <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/30" /> */}

          {/* Content */}
          {children}
        </div>
      </motion.div>

      {/* Right side fade */}
      <div className="pointer-events-none absolute top-0 right-0 h-full w-32 bg-gradient-to-l from-black via-black/60 to-transparent" />

      {/* Bottom fade */}
      {/* <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/30 to-transparent" /> */}
    </motion.div>
  );
};
