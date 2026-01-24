import { motion } from "framer-motion";

export const HeroDashboardVisual = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="relative z-20 mt-12 min-h-[900px] overflow-visible">
      {/* Perspective stage */}
      <div className="absolute inset-0 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 140 }}
          animate={{ opacity: 1, y: -140 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ transformPerspective: 3200 }}
          className="relative"
        >
          <motion.div
            initial={{ rotateX: 65, rotateZ: -18, rotateY: -8 }}
            animate={{ rotateX: 58, rotateZ: -14, rotateY: -6 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="relative origin-top transform-gpu will-change-transform"
          >
            {children}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade only - keeps image crisp */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black via-black/80 to-transparent" />
    </div>
  );
};
