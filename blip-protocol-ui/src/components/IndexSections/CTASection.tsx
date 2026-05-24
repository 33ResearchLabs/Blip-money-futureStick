import { useRef, useMemo, memo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { sounds } from "@/lib/sounds";
import { EditableText } from "@/components/dashboard/Editable";

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

  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: `${10 + ((i * 37 + 13) % 80)}%`,
        top: `${10 + ((i * 53 + 7) % 80)}%`,
        duration: 4 + (i % 5) * 0.6,
        delay: (i % 7) * 0.4,
      })),
    [],
  );

  return (
    <section
      ref={containerRef}
      className="relative py-24 sm:py-32 md:py-48 bg-[#FAF8F5] dark:bg-black/70 overflow-hidden"
    >
      {/* Immersive glow background */}
      <div className="absolute inset-0 hidden dark:block">
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
      {/* Light mode subtle glow */}
      <div className="absolute inset-0 dark:hidden">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse, rgba(255,107,53,0.06) 0%, rgba(255,107,53,0.02) 40%, transparent 70%)",
            y: glowY,
          }}
        />
      </div>

      {/* Animated particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-1 h-1 rounded-full bg-black/60 dark:bg-white/60"
          style={{ left: p.left, top: p.top }}
          animate={{
            y: [0, -40, 0],
            opacity: [0.1, 0.5, 0.1],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
          }}
        />
      ))}

      <motion.div
        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
        style={{ opacity, scale }}
      >
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-[12px] font-bold uppercase tracking-[0.36em] mb-6"
          style={{ color: "#cc785c" }}
        >
          <EditableText id="home.cta.eyebrow" default="The next chapter" />
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-center"
          style={{
            fontSize: "clamp(2.6rem, 7vw, 4.4rem)",
            fontWeight: 600,
            letterSpacing: "-0.05em",
            lineHeight: 1.02,
            marginBottom: 64,
          }}
        >
          <EditableText id="home.cta.title.pre" default="The new financial rail is " as="span" className="text-black dark:text-white" />
          <EditableText
            id="home.cta.title.accent"
            default="being built."
            as="span"
            className="text-black dark:text-white"
            style={{ fontStyle: "italic", fontFamily: "ui-serif, Georgia, serif", fontWeight: 500 }}
          />
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          <a
            href="/waitlist/user"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sounds.click()}
            className="group w-[220px] h-[56px] inline-flex items-center justify-center gap-2 px-7 rounded-full text-[17px] font-bold tracking-tight transition-all duration-300 ease-out bg-black text-white border border-black hover:shadow-[0_14px_36px_rgba(0,0,0,0.3)] hover:-translate-y-[1px] dark:bg-white dark:text-black dark:border-white dark:hover:shadow-[0_14px_36px_rgba(255,255,255,0.2)] active:scale-[0.98]"
          >
            <EditableText id="home.cta.button.primary" default="Join waitlist" as="span" />
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </a>

          <a
            href="https://app.blip.money/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-[220px] h-[56px] inline-flex items-center justify-center px-7 rounded-full text-[17px] font-semibold tracking-tight transition-all duration-300 ease-out text-black border border-black/30 hover:border-black/60 hover:bg-black/5 dark:text-white dark:border-white/30 dark:hover:border-white/60 dark:hover:bg-white/10 active:scale-[0.98]"
          >
            <EditableText id="home.cta.button.secondary" default="Provide liquidity" as="span" />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default memo(CTASection);
