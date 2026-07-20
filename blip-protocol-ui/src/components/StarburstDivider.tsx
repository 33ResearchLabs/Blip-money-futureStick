import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export const StarburstDivider = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <div ref={ref} className="flex items-center justify-center py-4 overflow-hidden pointer-events-none select-none">
      {/* Left line */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="h-px flex-1 max-w-[200px] origin-right"
        style={{ background: "linear-gradient(to left, rgba(0,200,232,0.4), transparent)" }}
      />

      {/* Starburst */}
      <motion.div
        initial={{ scale: 0, opacity: 0, rotate: -30 }}
        animate={isInView ? { scale: 1, opacity: 1, rotate: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-4"
      >
        {/* Glow rings */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={isInView ? { scale: [0.5, 1.8, 1], opacity: [0, 0.3, 0] } : {}}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          className="absolute inset-0 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,200,232,0.3) 0%, transparent 70%)" }}
        />
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={isInView ? { scale: [0.5, 2.2, 1.2], opacity: [0, 0.2, 0] } : {}}
          transition={{ duration: 1.4, delay: 0.1, ease: "easeOut" }}
          className="absolute inset-0 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(204,120,92,0.3) 0%, transparent 70%)" }}
        />

        <img
          src="/blip-icon-sm.png"
          alt=""
          width="40"
          height="40"
          style={{ display: "block" }}
        />
      </motion.div>

      {/* Right line */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="h-px flex-1 max-w-[200px] origin-left"
        style={{ background: "linear-gradient(to right, rgba(204,120,92,0.4), transparent)" }}
      />
    </div>
  );
};

export default StarburstDivider;
