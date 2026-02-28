import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "next-themes";

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
    <section
      className="relative min-h-screen overflow-hidden flex items-center justify-center text-center bg-[#FAF8F5] dark:bg-[#090909]"
    >
      {/* Subtle orange radial glow centred slightly above the headline */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -60%)",
          width: 700,
          height: 400,
          background: isDark
            ? "radial-gradient(ellipse at center, rgba(224,112,64,0.07) 0%, transparent 70%)"
            : "radial-gradient(ellipse at center, rgba(224,112,64,0.12) 0%, transparent 70%)",
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
            fontSize: "clamp(3.5rem, 7vw, 7rem)",
            fontWeight: 700,
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
          style={{ maxWidth: 360, margin: "0 auto 36px" }}
        >
          <p
            className="text-[#1a1a1a] dark:text-white"
            style={{
              fontSize: 18,
              fontWeight: 500,
              letterSpacing: "-0.4px",
              marginBottom: 14,
            }}
          >
            Send value to anyone, anywhere.
          </p>
          <p
            className="text-[#666] dark:text-[#888]"
            style={{
              fontSize: 13.5,
              lineHeight: 1.6,
            }}
          >
            Powered by open, permissionless infrastructure and non-custodial
            liquidity.
          </p>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.38 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          {/* Primary — solid pill */}
          <motion.div
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <Link
              to="/waitlist"
              className="inline-flex items-center gap-2"
              style={{
                padding: "11px 24px",
                background: isDark ? "#ffffff" : "#090909",
                color: isDark ? "#090909" : "#ffffff",
                fontSize: 14,
                fontWeight: 600,
                borderRadius: 999,
                letterSpacing: "-0.2px",
                textDecoration: "none",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.background =
                  isDark ? "#e8e8e8" : "#222")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.background =
                  isDark ? "#ffffff" : "#090909")
              }
            >
              Join Waitlist
              <ArrowRight style={{ width: 14, height: 14 }} />
            </Link>
          </motion.div>

          {/* Secondary — frosted outline pill */}
          <motion.div
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <Link
              to="/merchant"
              className="inline-flex items-center "
              style={{
                padding: "11px 24px",
                background: "transparent",
                color: isDark ? "#ffffff" : "#1a1a1a",
                fontSize: 14,
                fontWeight: 500,
                borderRadius: 999,
                border: isDark
                  ? "1px solid rgba(255,255,255,0.2)"
                  : "1px solid rgba(0,0,0,0.2)",
                letterSpacing: "-0.2px",
                textDecoration: "none",
                transition: "border-color 0.2s, background 0.2s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = isDark
                  ? "rgba(255,255,255,0.45)"
                  : "rgba(0,0,0,0.45)";
                el.style.background = isDark
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(0,0,0,0.04)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = isDark
                  ? "rgba(255,255,255,0.2)"
                  : "rgba(0,0,0,0.2)";
                el.style.background = "transparent";
              }}
            >
              Become a Merchant
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </section>
  );
};

export default CinematicHero;
