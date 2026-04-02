import { useState, useEffect, memo } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { CTAButton } from "../Navbar";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ── Hero ── */
const CinematicHero = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted ? theme !== "light" : false;

  return (
    <section className="relative overflow-hidden flex flex-col items-center justify-center text-center bg-[#fafafa] dark:bg-black">

      {/* ── DARK MODE: Earth bg + zoom + overlay ── */}
      {isDark && (
        <>
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            initial={{ scale: 1 }}
            animate={{ scale: 1.15 }}
            transition={{ duration: 10, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
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

      {/* ── LIGHT MODE: clean white with subtle warm tint ── */}
      {!isDark && (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(180deg, #ffffff 0%, #fafafa 40%, #f5f2ef 100%)",
          }}
        />
      )}

      {/* Text content */}
      <main className="relative z-10 w-full max-w-[860px] mx-auto px-6 md:px-10 pt-32 pb-12 text-center">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="text-[#86868b] dark:text-[#555555]"
          style={{
            fontSize: "10.5px",
            fontWeight: 600,
            letterSpacing: "2.5px",
            textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          The Settlement Protocol
        </motion.p>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.08 }}
          className="select-none text-[#1d1d1f] dark:text-white"
          style={{
            fontSize: "clamp(3rem, 7vw, 5.5rem)",
            fontWeight: 600,
            lineHeight: 1.08,
            letterSpacing: "-0.035em",
            marginBottom: 20,
          }}
        >
          Borderless finance.
          <br />
          <motion.span
            key={isDark ? "dark" : "light"}
            style={{
              background: isDark
                ? "linear-gradient(90deg, #ffffff 0%, #ffe8dc 18%, #ffb899 30%, #ff8c50 42%, #ff6b35 50%, #ff8c50 58%, #ffb899 70%, #ffe8dc 82%, #ffffff 100%)"
                : "linear-gradient(90deg, #ff8c50 0%, #ff6b35 30%, #e8552d 50%, #ff6b35 70%, #ff8c50 100%)",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              color: "transparent",
            }}
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            Settled on-chain.
          </motion.span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.22 }}
          className="text-[#6e6e73] dark:text-[#888]"
          style={{
            fontSize: 18,
            lineHeight: 1.6,
            maxWidth: 480,
            margin: "0 auto 32px",
          }}
        >
          Instant fiat settlement powered by global liquidity.
          No banks. No delays. No middlemen.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.38 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6"
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
      </main>

      {/* ── Globe image — below text, Apple satellite-feature style ── */}
      {!isDark && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: EASE, delay: 0.4 }}
          className="relative z-10 w-full flex justify-center overflow-hidden"
          style={{ marginTop: -20, marginBottom: -100 }}
        >
          <img
            src="/lightModeGlobe.png"
            alt="Global settlement network"
            style={{
              maxWidth: 900,
              width: "100%",
              height: "auto",
              maskImage: "linear-gradient(to bottom, black 50%, transparent 95%)",
              WebkitMaskImage: "linear-gradient(to bottom, black 50%, transparent 95%)",
            }}
          />
        </motion.div>
      )}
    </section>
  );
};

export default memo(CinematicHero);
