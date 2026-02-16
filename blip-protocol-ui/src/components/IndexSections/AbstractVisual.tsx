import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const AbstractVisual = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Single line movement + fade
  const y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative py-20 bg-[#FAF8F5] dark:bg-black overflow-hidden"
    >
      <motion.div style={{ opacity }} className="absolute inset-0">
        <motion.div
          style={{ y }}
          className="absolute top-1/2 left-0 right-0 h-px"
        >
          <div className="h-full w-full bg-gradient-to-r from-transparent via-black/20 dark:via-white/20 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default AbstractVisual;
