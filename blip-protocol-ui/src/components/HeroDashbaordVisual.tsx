import { motion } from "framer-motion";

export const HeroDashboardVisual = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="relative z-20 mt-12 min-h-[560px] overflow-visible">
      {/* Perspective stage */}
      <div className="absolute inset-0 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 140 }}
          animate={{ opacity: 1, y: -100 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ transformPerspective: 4200 }}
          className="relative"
        >
          <motion.div
            initial={{ rotateX: 65, rotateZ: -18, rotateY: -8 }}
            animate={{ rotateX: 58, rotateZ: -14, rotateY: -2 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="relative origin-top transform-gpu will-change-transform"
          >
            {children}
          </motion.div>
        </motion.div>
      </div>
      {/* Right side fade */}
      <div
        className="pointer-events-none absolute top-[-20%] right-3  h-full w-40
  bg-gradient-to-l from-black via-black/60 to-transparent"
      />

      {/* Bottom fade only - keeps image crisp */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black via-black/20 to-transparent" />
    </div>
  );
};
