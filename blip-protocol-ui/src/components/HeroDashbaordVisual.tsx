import { motion } from "framer-motion";

export const HeroDashboardVisual = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="relative mt-28 h-[520px] overflow-hidden">
      {/* Perspective stage */}
      <div className="absolute inset-0 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 120 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            transformPerspective: 2000,
          }}
          className="relative"
        >
          {/* Dashboard */}
          <motion.div
            initial={{ rotateX: 22, rotateZ: -4, scale: 0.92 }}
            animate={{ rotateX: 18, rotateZ: -3, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative origin-top rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-[0_80px_160px_rgba(0,0,0,0.9)]"
          >
            {children}
          </motion.div>
        </motion.div>
      </div>

      {/* HARD VIGNETTE (this is the missing piece 🔥) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black" />

      {/* Extra darkness at bottom */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-black" />
    </div>
  );
};
