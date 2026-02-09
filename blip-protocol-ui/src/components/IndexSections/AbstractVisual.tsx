import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/* ============================================
   ABSTRACT VISUAL SECTION - Elegant, Conceptual
   ============================================ */

const AbstractVisual = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative py-32 md:py-48 bg-white dark:bg-black overflow-hidden"
    >
      {/* Abstract flowing lines - suggesting speed and movement */}
      <motion.div style={{ opacity }} className="absolute inset-0">
        {/* Flowing gradient lines */}
        <motion.div
          style={{ y: y1 }}
          className="absolute top-1/4 left-0 right-0 h-px"
        >
          <div
            className="h-full w-full bg-gradient-to-r from-transparent via-black/20 dark:via-white/20 to-transparent"
          />
        </motion.div>

        <motion.div
          style={{ y: y2 }}
          className="absolute top-1/2 left-0 right-0 h-px"
        >
          <div
            className="h-full w-full bg-gradient-to-r from-transparent via-black/15 dark:via-white/15 to-transparent"
          />
        </motion.div>

        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, -80]) }}
          className="absolute top-3/4 left-0 right-0 h-px"
        >
          <div
            className="h-full w-full bg-gradient-to-r from-transparent via-black/12 dark:via-white/12 to-transparent"
          />
        </motion.div>

        {/* Subtle circular gradients - suggesting nodes/connections */}
        <motion.div
          style={{
            y: useTransform(scrollYProgress, [0, 1], [50, -50]),
          }}
          className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.03)_0%,transparent_60%)] dark:bg-[radial-gradient(circle,rgba(255,255,255,0.03)_0%,transparent_60%)] blur-[40px]"
        />

        <motion.div
          style={{
            y: useTransform(scrollYProgress, [0, 1], [-30, 70]),
          }}
          className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.04)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(255,255,255,0.04)_0%,transparent_70%)] blur-[50px]"
        />
      </motion.div>

      {/* Center content - minimal text */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-semibold text-black dark:text-white tracking-tight leading-[1.1] mb-6">
            Speed meets
            <br />
            <span className="text-black/30 dark:text-white/30">simplicity.</span>
          </h2>
          <p className="text-lg text-black/40 dark:text-white/40 max-w-xl mx-auto">
            Every transaction, instant. Every detail, effortless.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AbstractVisual;
