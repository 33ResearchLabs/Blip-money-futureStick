import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

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
const CinematicHero = () => (
  <section
    className="relative min-h-screen overflow-hidden flex items-center justify-center text-center"
    style={{ backgroundColor: "#090909" }}
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
        background:
          "radial-gradient(ellipse at center, rgba(224,112,64,0.07) 0%, transparent 70%)",
      }}
    />

    {/* Content */}
    <main className="relative z-10 w-full max-w-[860px] mx-auto px-6 md:px-10 pt-28 pb-44 text-center">

      {/* Eyebrow */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE }}
        style={{
          fontSize: "10.5px",
          fontWeight: 600,
          letterSpacing: "2.5px",
          textTransform: "uppercase",
          color: "#555555",
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
        className="select-none"
        style={{
          fontSize: "clamp(3.5rem, 7vw, 7rem)",
          fontWeight: 700,
          lineHeight: 1.05,
          letterSpacing: "-0.04em",
          color: "#ffffff",
          marginBottom: 32,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <span>Borderless finance.</span>
        {/* Animated warm-to-orange shimmer sweep */}
        <motion.span
          style={{
            background:
              "linear-gradient(90deg, #ffffff 0%, #ffe8dc 18%, #ffb899 30%, #ff8c50 42%, #ff6b35 50%, #ff8c50 58%, #ffb899 70%, #ffe8dc 82%, #ffffff 100%)",
            backgroundSize: "300% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
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
          style={{
            fontSize: 18,
            fontWeight: 500,
            color: "#ffffff",
            letterSpacing: "-0.4px",
            marginBottom: 14,
          }}
        >
          Send value to anyone, anywhere.
        </p>
        <p
          style={{
            fontSize: 13.5,
            color: "#888888",
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
        {/* Primary — solid white pill */}
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
              background: "#ffffff",
              color: "#090909",
              fontSize: 14,
              fontWeight: 600,
              borderRadius: 999,
              letterSpacing: "-0.2px",
              textDecoration: "none",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.background = "#e8e8e8")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.background = "#ffffff")
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
            className="inline-flex items-center"
            style={{
              padding: "11px 24px",
              background: "transparent",
              color: "#ffffff",
              fontSize: 14,
              fontWeight: 500,
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.2)",
              letterSpacing: "-0.2px",
              textDecoration: "none",
              transition: "border-color 0.2s, background 0.2s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = "rgba(255,255,255,0.45)";
              el.style.background = "rgba(255,255,255,0.04)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = "rgba(255,255,255,0.2)";
              el.style.background = "transparent";
            }}
          >
            Become a Merchant
          </Link>
        </motion.div>
      </motion.div>
    </main>

    {/* Status bar — fixed to viewport bottom */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.7 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-5 z-20"
    >
      <StatusDot
        label="Base"
        color="#3ddc84"
        glow="rgba(61,220,132,0.7)"
        delay={0}
      />
      <StatusDot
        label="Solana"
        color="#4b94f5"
        glow="rgba(75,148,245,0.7)"
        delay={0.8}
      />
    </motion.div>
  </section>
);

export default CinematicHero;
