import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { CTAButton } from "../Navbar";

/* ============================================
   SECTION 3: REWARDS TEASER - Elegant minimal banner
   ============================================ */

const CashbackBanner = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative md:py-32 py-16 bg-[#FAF8F5] dark:bg-black overflow-hidden"
    >
      {/* Accent gradient blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(ellipse,rgba(0,0,0,0.04)_0%,transparent_60%)] dark:bg-[radial-gradient(ellipse,rgba(255,255,255,0.03)_0%,transparent_60%)]"
          style={{
            x: useTransform(scrollYProgress, [0, 1], [-80, 80]),
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-[radial-gradient(ellipse,rgba(0,200,150,0.06)_0%,transparent_60%)] dark:bg-[radial-gradient(ellipse,rgba(0,200,150,0.04)_0%,transparent_60%)]"
          style={{
            x: useTransform(scrollYProgress, [0, 1], [60, -60]),
          }}
        />
      </div>

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${8 + Math.random() * 84}%`,
            top: `${8 + Math.random() * 84}%`,
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
            background: i % 3 === 0 ? 'rgba(0,0,0,0.2)' : i % 3 === 1 ? 'rgba(0,200,150,0.3)' : 'rgba(0,0,0,0.15)',
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0.15, 0.7, 0.15],
            scale: [1, 1.8, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}

      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-6"
        style={{ opacity }}
      >
        <div className="relative p-8 md:p-12 rounded-3xl border border-black/[0.08] dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl overflow-hidden shadow-[0_8px_60px_-12px_rgba(0,0,0,0.1)] dark:shadow-none">
          {/* Accent gradient stripe */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-black/20 dark:via-white/20 to-transparent" />
          {/* Inner glow */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.03)_0%,transparent_60%)] dark:bg-[radial-gradient(circle,rgba(255,255,255,0.02)_0%,transparent_60%)] -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(0,200,150,0.04)_0%,transparent_60%)] dark:bg-[radial-gradient(circle,rgba(0,200,150,0.03)_0%,transparent_60%)] translate-y-1/2 -translate-x-1/3" />

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1"
            >
              <div className="flex items-center gap-3 mb-6">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-black dark:text-white/60 block">
                    Early Access
                  </span>
                  <span className="text-xs text-black dark:text-white/40">
                    Limited spots available
                  </span>
                </div>
              </div>

              <h3 className="heading-h3 text-black dark:text-white" style={{ marginBottom: 16 }}>
                Earn while you{" "}
                <span className="relative">
                  <span className="relative z-10 text-black dark:text-white">spend.</span>
                  <motion.span
                    className="absolute bottom-1 left-0 right-0 h-3 bg-black/10 dark:bg-white/10 rounded-sm -z-0"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  />
                </span>
              </h3>

              <p className="p-medium text-black dark:text-white/50 max-w-md mb-6">
                Up to{" "}
                <span className="text-black dark:text-white font-semibold">
                  5% cashback
                </span>{" "}
                in BLIP tokens on every payment. No tiers. No complexity.
              </p>

            </motion.div>

            {/* Right CTA */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex flex-col items-center gap-4"
            >
              <CTAButton to="rewards">View Rewards </CTAButton>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CashbackBanner;
