import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { CTAButton } from "../Navbar";

/* ============================================
   SECTION 13: CTA
   ============================================ */

const CTASection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.8, 1],
    [0, 1, 1, 0.8],
  );
  const scale = useTransform(scrollYProgress, [0, 0.3], [0.95, 1]);
  const glowY = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section
      ref={containerRef}
      className="relative py-24 sm:py-32 md:py-48 bg-[#FAF8F5] dark:bg-black overflow-hidden"
    >
      {/* Immersive glow background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 40%, transparent 70%)",
            y: glowY,
          }}
        />
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse, rgba(255,255,255,0.05) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* Animated particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-black/60 dark:bg-white/60"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0.1, 0.5, 0.1],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}

      <motion.div
        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
        style={{ opacity, scale }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-[0.95] mb-6 sm:mb-8"
        >
          <span className="text-black dark:text-white">Join the merchant</span>
          <br />
          <span className="text-black/80 dark:text-white/40">
            network.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-base sm:text-lg text-black dark:text-white/40 font-medium max-w-md mx-auto mb-8 sm:mb-12 px-4"
        >
          Access global liquidity. Start trading instantly.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <CTAButton to="/waitlist" className="w-[180px] h-[48px]">Join Waitlist</CTAButton>
          <Link
            to="/merchant"
            className="inline-flex items-center justify-center w-[180px] h-[48px] rounded-full border border-black/20 dark:border-white/20 text-black/60 dark:text-white/40 text-sm font-medium hover:border-black/40 dark:hover:border-white/40 hover:text-black dark:hover:text-white/70 transition-all duration-300"
          >
            Become a Merchant
          </Link>
          <Link
            to="/whitepaper"
            className="inline-flex items-center gap-1.5 text-sm text-black/40 dark:text-white/30 font-medium hover:text-black/70 dark:hover:text-white/50 transition-colors"
          >
            Read Whitepaper
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default CTASection;
