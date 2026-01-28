import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ============================================
   SECTION 2: UAE ANNOUNCEMENT - Apple-style cinematic
   ============================================ */

const UAESection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.9, 1, 1, 0.9],
  );

  // Floating elements for depth - more dynamic
  const float1Y = useTransform(scrollYProgress, [0, 1], [100, -150]);
  const float2Y = useTransform(scrollYProgress, [0, 1], [50, -200]);
  const float3Y = useTransform(scrollYProgress, [0, 1], [150, -100]);
  const rotateOrb = useTransform(scrollYProgress, [0, 1], [0, 180]);

  return (
    <section
      ref={containerRef}
      className="relative md:min-h-screen  flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Immersive background with glow */}
      <div className="absolute inset-0">

        {/* Ambient glow - top */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 40%, transparent 70%)",
            y: float1Y,
          }}
        />

        {/* Secondary glow - floating */}
        <motion.div
          className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 60%)",
            y: float2Y,
            rotate: rotateOrb,
          }}
        />

        {/* White ambient for contrast */}
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 70%)",
            y: float3Y,
          }}
        />

        {/* Animated particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/60"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.6, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* Main content */}
      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
        style={{ opacity, scale }}
      >
        {/* Animated badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-12 backdrop-blur-sm"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <motion.span
            className="w-2 h-2 rounded-full bg-white/60"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-[13px] text-white/70 font-medium tracking-wide">
            Launching 2026{" "}
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <h2
            className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-semibold tracking-tight leading-[0.9] text-white"
          >
            Dubai
          </h2>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-semibold text-white/15 tracking-tight">
              is next.
            </span>
          </motion.div>
        </motion.div>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto leading-relaxed font-light mb-12"
        >
          The world's fastest-growing financial hub meets the future of
          payments.
          <br className="hidden md:block" />
          Private. Instant. Non-custodial.
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center gap-6 sm:gap-12 md:gap-20"
        >
          {[
            { value: "40+", label: "Banks" },
            { value: "180+", label: "Nationalities" },
            { value: "$2T+", label: "Annual Trade" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.8 + i * 0.1 }}
            >
              <div className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-[9px] sm:text-[11px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-white/30">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
};

export default UAESection;
