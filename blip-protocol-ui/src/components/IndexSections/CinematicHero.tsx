import { useState, useEffect, useRef, memo } from "react";
import { motion, useInView } from "framer-motion";
import { useTheme } from "next-themes";
import { CTAButton } from "../Navbar";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ── Hero ── */
const CinematicHero = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted ? theme === "dark" : true;

  const sectionRef = useRef<HTMLElement>(null);
  // Once the hero is ~halfway out of view, pause infinite animations to free up GPU/CPU
  const isInView = useInView(sectionRef, { amount: 0.2 });

  const bgZoomAnimate = isInView ? { scale: 1.15 } : { scale: 1 };
  const bgZoomTransition = isInView
    ? { duration: 10, ease: "linear", repeat: Infinity, repeatType: "reverse" as const }
    : { duration: 0 };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden flex items-center justify-center text-center bg-[#FAF8F5] dark:bg-black"
    >

      {/* ── DARK MODE: Earth bg + zoom + overlay ── */}
      {isDark && (
        <>
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            initial={{ scale: 1 }}
            animate={bgZoomAnimate}
            transition={bgZoomTransition}
            style={{
              backgroundImage: "url('/hero-bg.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{ background: "rgba(0,0,0,0.72)" }}
          />
        </>
      )}

      {/* ── LIGHT MODE: same Earth bg ── */}
      {!isDark && mounted && (
        <>
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            initial={{ scale: 1 }}
            animate={bgZoomAnimate}
            transition={bgZoomTransition}
            style={{
              backgroundImage: "url('/hero-bg.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{ background: "rgba(0,0,0,0.72)" }}
          />
        </>
      )}

      {/* Content */}
      <main className="relative z-10 w-full max-w-[860px] mx-auto px-6 md:px-10 pt-28 pb-44 text-center">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="text-white/50 dark:text-[#555555]"
          style={{
            fontSize: "10.5px",
            fontWeight: 600,
            letterSpacing: "2.5px",
            textTransform: "uppercase",
            marginBottom: 28,
          }}
        >
          The Settlement Protocol
        </motion.p>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.08 }}
          className="select-none text-white dark:text-white"
          style={{
            fontSize: "clamp(3.5rem, 8vw, 6.5rem)",
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: "-0.04em",
            marginBottom: 32,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span>Borderless finance.</span>
          {/* Animated shimmer — orange in both modes */}
          <motion.span
            key={isDark ? "dark" : "light"}
            style={{
              background: isDark
                ? "linear-gradient(90deg, #ffffff 0%, #ffe8dc 18%, #ffb899 30%, #ff8c50 42%, #ff6b35 50%, #ff8c50 58%, #ffb899 70%, #ffe8dc 82%, #ffffff 100%)"
                : "linear-gradient(90deg, #ffffff 0%, #ffe8dc 18%, #ffb899 30%, #ff8c50 42%, #ff6b35 50%, #ff8c50 58%, #ffb899 70%, #ffe8dc 82%, #ffffff 100%)",
              backgroundSize: "300% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              color: "transparent",
            }}
            animate={
              isInView
                ? { backgroundPosition: ["100% 50%", "0% 50%", "100% 50%"] }
                : { backgroundPosition: "100% 50%" }
            }
            transition={
              isInView
                ? { duration: 7, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0 }
            }
          >
            Settled on-chain.
          </motion.span>
        </motion.h1>

        {/* Subtext */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.22 }}
          style={{ maxWidth: 480, margin: "0 auto 36px" }}
        >
          <p
            className="text-white/60 dark:text-[#888]"
            style={{
              fontSize: 18,
              lineHeight: 1.6,
            }}
          >
            Instant fiat settlement powered by global liquidity.
            No banks. No delays. No middlemen.
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.38 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10"
        >
          <CTAButton to="/waitlist">
            Join as User
          </CTAButton>
          <CTAButton to="/waitlist" variant="secondary">
            Provide Liquidity
          </CTAButton>
          <CTAButton to="/merchant" variant="secondary">
            Accept Payments
          </CTAButton>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: EASE, delay: 0.6 }}
          className="flex items-center justify-center gap-6"
        >
          {[
            { label: "Avg settlement", value: "~42s" },
            { label: "Active routes", value: "42" },
          ].map((s, i) => (
            <div key={s.label} className="flex items-center gap-2">
              {i > 0 && <div className="w-px h-3 bg-black/10 dark:bg-white/10" />}
              <span className="text-[11px] text-white/40 dark:text-[#555]">{s.label}:</span>
              <span className="text-[11px] font-semibold font-mono text-white/70 dark:text-[#888]">{s.value}</span>
            </div>
          ))}
        </motion.div>
      </main>
    </section>
  );
};

export default memo(CinematicHero);
