import { useState, useEffect, memo } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { CTAButton } from "../Navbar";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ── Status dot at the bottom ── */
const StatusDot = ({
  label,
  color,
  glow,
  delay,
}: {
  label: string;
  color: string;
  glow: string;
  delay: number;
}) => (
  <div
    className="flex items-center gap-1.5"
    style={{ fontSize: 11, fontWeight: 500, color: "#555555" }}
  >
    <motion.span
      animate={{ opacity: [1, 0.45, 1] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay }}
      style={{
        display: "inline-block",
        width: 7,
        height: 7,
        borderRadius: "50%",
        flexShrink: 0,
        background: color,
        boxShadow: `0 0 6px ${glow}`,
      }}
    />
    {label}
  </div>
);

/* ── Hero ── */
const CinematicHero = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted ? theme === "dark" : true; // default to dark until mounted

  return (
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center text-center bg-[#FAF8F5] dark:bg-black">
      {/* Background image — Earth from space */}
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
      {/* Dark overlay so text stays readable */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDark
            ? "rgba(0,0,0,0.72)"
            : "rgba(250,248,245,0.7)",
        }}
      />

      {/* Content */}
      <main className="relative z-10 w-full max-w-[860px] mx-auto px-6 md:px-10 pt-28 pb-44 text-center">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="text-[#999] dark:text-[#555555]"
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
          className="select-none text-[#1a1a1a] dark:text-white"
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
          {/* Animated warm-to-orange shimmer sweep */}
          <motion.span
            key={isDark ? "dark" : "light"}
            style={{
              background: isDark
                ? "linear-gradient(90deg, #ffffff 0%, #ffe8dc 18%, #ffb899 30%, #ff8c50 42%, #ff6b35 50%, #ff8c50 58%, #ffb899 70%, #ffe8dc 82%, #ffffff 100%)"
                : "linear-gradient(90deg, #1a1a1a 0%, #4a2a1a 18%, #c0623a 30%, #ff8c50 42%, #ff6b35 50%, #ff8c50 58%, #c0623a 70%, #4a2a1a 82%, #1a1a1a 100%)",
              backgroundSize: "300% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              color: "transparent",
            }}
            animate={{ backgroundPosition: ["100% 50%", "0% 50%", "100% 50%"] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
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
            className="text-[#666] dark:text-[#888]"
            style={{
              fontSize: 18,
              lineHeight: 1.6,
            }}
          >
            Instant fiat settlement powered by global liquidity.
            No banks. No delays. No middlemen.
          </p>
        </motion.div>

        {/* Segmented CTAs */}
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

        {/* Micro-proof stats */}
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
              <span className="text-[11px] text-[#999] dark:text-[#555]">{s.label}:</span>
              <span className="text-[11px] font-semibold font-mono text-[#666] dark:text-[#888]">{s.value}</span>
            </div>
          ))}
        </motion.div>
      </main>
    </section>
  );
};

export default memo(CinematicHero);
