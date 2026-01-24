import { motion } from "framer-motion";

export const CinematicMockup = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="relative mt-24">
      {/* Center container */}
      <div className="flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 80, rotateX: 18, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, rotateX: 12, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ transformPerspective: 1600 }}
          className="relative"
        >
          {/* Glow */}
          <div className="absolute inset-0 -z-10 blur-3xl opacity-40 bg-gradient-to-t from-[#ff6b35]/30 to-transparent" />

          {/* Frame */}
          <div className="relative rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-[0_40px_120px_rgba(0,0,0,0.85)] overflow-hidden">
            {children}
          </div>

          {/* Bottom fade (KEY PART 🔥) */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black to-transparent" />
        </motion.div>
      </div>
    </div>
  );
};
