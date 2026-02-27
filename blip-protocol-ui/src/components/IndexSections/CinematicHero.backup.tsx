import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

/* Shared spring easing across all staggered elements */
const EASE = [0.16, 1, 0.3, 1] as const;

const CinematicHero = () => (
  <section
    className="relative min-h-screen overflow-hidden flex items-center justify-center"
    style={{ backgroundColor: "#0a0a0a" }}
  >
    {/* ── Background layers (pointer-events-none, aria-hidden) ─────────────── */}

    {/* 1. Very faint desaturated dashboard — adds institutional depth */}
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.06 }}
    >
      <img
        src="/images/merchant-dashboard.png"
        alt=""
        className="w-full h-full object-contain object-center"
        style={{ filter: "blur(4px) saturate(0)" }}
      />
    </div>

    {/* 2. Soft radial glow centered on headline area */}
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          "radial-gradient(ellipse 65% 52% at 50% 40%, rgba(255,255,255,0.032) 0%, transparent 68%)",
      }}
    />

    {/* 3. Edge vignette — darkens corners for cinematic depth */}
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 38%, rgba(0,0,0,0.52) 100%)",
      }}
    />

    {/* 4. Film grain — almost invisible, adds tactility */}
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none z-10"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        opacity: 0.028,
        mixBlendMode: "overlay",
      }}
    />

    {/* ── Content ──────────────────────────────────────────────────────────── */}
    <main className="relative z-20 w-full max-w-[820px] mx-auto px-6 md:px-10 text-center py-24">

      {/* Eyebrow label */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE }}
        className="mb-9 text-[10.5px] uppercase tracking-[0.3em] font-medium"
        style={{ color: "rgba(255,255,255,0.22)" }}
      >
        The settlement protocol
      </motion.p>

      {/* Headline — opacity + scale entry */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: EASE, delay: 0.08 }}
        className="font-sans font-semibold leading-[1.05] tracking-[-0.032em] mb-9 select-none"
        style={{
          fontSize: "clamp(2.75rem, 7.5vw, 5.75rem)",
          filter: "drop-shadow(0 2px 14px rgba(255,255,255,0.055))",
        }}
      >
        {/* Line 1 — static white → warm gray gradient */}
        <span
          style={{
            background: "linear-gradient(175deg, #FFFFFF 0%, #F2F0EC 38%, #B0ACA6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Borderless finance.
        </span>
        <br />
        {/* Line 2 — slow orange shimmer sweep (20 s loop) */}
        <motion.span
          style={{
            background:
              "linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 32%, #FF8040 45%, #FF4500 50%, #FF8040 55%, #FFFFFF 68%, #FFFFFF 100%)",
            backgroundSize: "300% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            display: "inline-block",
          }}
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        >
          Settled on-chain.
        </motion.span>
      </motion.h1>

      {/* Subtext block */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE, delay: 0.22 }}
        className="max-w-[400px] mx-auto mb-12 space-y-3"
      >
        <p
          className="text-[1.2rem] sm:text-[1.275rem] font-medium tracking-[-0.02em]"
          style={{ color: "rgba(255,255,255,0.88)" }}
        >
          Send value to anyone, anywhere.
        </p>
        <p
          className="text-[0.875rem] sm:text-[0.9375rem] leading-relaxed tracking-[0.003em]"
          style={{ color: "rgba(255,255,255,0.28)" }}
        >
          Powered by open, permissionless infrastructure
          {" "}and non-custodial liquidity.
        </p>
      </motion.div>

      {/* CTA buttons */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.38 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4"
      >
        {/* Primary — solid white pill */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          <Link
            to="/waitlist"
            className="group relative overflow-hidden inline-flex items-center justify-center gap-2 px-8 h-[50px] rounded-[10px] bg-white text-[#0d0d0d] text-[14.5px] font-semibold tracking-[-0.01em] transition-shadow duration-300"
            style={{
              boxShadow: "0 1px 10px rgba(255,255,255,0.06)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                "0 4px 24px rgba(255,255,255,0.13)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                "0 1px 10px rgba(255,255,255,0.06)";
            }}
          >
            {/* Shimmer sweep on hover */}
            <span className="absolute inset-0 rounded-[10px] overflow-hidden pointer-events-none">
              <span className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-black/[0.05] to-transparent -translate-x-full group-hover:translate-x-[200%] transition-transform duration-700 ease-out" />
            </span>
            <span className="relative z-10">Join Waitlist</span>
            <ArrowRight className="relative z-10 w-[14px] h-[14px] group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
        </motion.div>

        {/* Secondary — frosted glass outline */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          <Link
            to="/merchant"
            className="inline-flex items-center justify-center px-8 h-[50px] rounded-[10px] text-[14.5px] font-medium tracking-[-0.01em] transition-all duration-300 backdrop-blur-sm"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.10)",
              color: "rgba(255,255,255,0.55)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = "rgba(255,255,255,0.07)";
              el.style.border = "1px solid rgba(255,255,255,0.18)";
              el.style.color = "rgba(255,255,255,0.78)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = "rgba(255,255,255,0.04)";
              el.style.border = "1px solid rgba(255,255,255,0.10)";
              el.style.color = "rgba(255,255,255,0.55)";
            }}
          >
            Become a Merchant
          </Link>
        </motion.div>
      </motion.div>

      {/* Tertiary text link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.55 }}
        className="flex justify-center"
      >
        <Link
          to="/protocol"
          className="group inline-flex items-center gap-1.5 text-[12.5px] font-medium tracking-[0.01em] transition-colors duration-300"
          style={{ color: "rgba(255,255,255,0.18)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.38)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.18)";
          }}
        >
          View Protocol
          <ArrowRight className="w-[11px] h-[11px] group-hover:translate-x-0.5 transition-transform duration-200" />
        </Link>
      </motion.div>

      {/* Token badges */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.68, ease: EASE }}
        className="mt-14 flex flex-col items-center gap-2.5"
      >
        <span
          className="text-[10px] uppercase tracking-[0.22em] font-medium"
          style={{ color: "rgba(255,255,255,0.18)" }}
        >
          Supports
        </span>
        <div className="flex items-center gap-2">
          {/* USDT */}
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <circle cx="16" cy="16" r="16" fill="#26A17B" />
              <path
                d="M17.922 17.383v-.002c-.114.008-.7.044-2.004.044-1.04 0-1.772-.032-2.028-.044v.002c-4.001-.176-6.983-.878-6.983-1.722 0-.844 2.982-1.546 6.983-1.726v2.75c.26.018 1.01.063 2.044.063 1.24 0 1.862-.053 1.988-.063v-2.75c3.994.18 6.97.882 6.97 1.726 0 .844-2.976 1.546-6.97 1.722zm0-3.752v-2.456h5.564V7.5H8.517v3.675h5.37v2.455c-4.53.202-7.937 1.073-7.937 2.128 0 1.055 3.407 1.925 7.938 2.127v7.615h3.951V17.885c4.524-.202 7.924-1.072 7.924-2.126 0-1.054-3.4-1.924-7.841-2.128z"
                fill="white"
              />
            </svg>
            <span
              className="text-[11px] font-medium tracking-[0.01em]"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              USDT
            </span>
          </div>

          <span style={{ color: "rgba(255,255,255,0.12)" }}>·</span>

          {/* USDC */}
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <circle cx="16" cy="16" r="16" fill="#2775CA" />
              <path
                d="M20 18.16c0-2.11-1.27-2.83-3.8-3.13-1.8-.24-2.16-.72-2.16-1.56 0-.84.6-1.4 1.8-1.4 1.08 0 1.68.36 1.98 1.26.06.18.24.3.42.3h.96a.4.4 0 0 0 .4-.42v-.06a3.05 3.05 0 0 0-2.76-2.52V9.9a.45.45 0 0 0-.46-.46h-.9a.45.45 0 0 0-.46.46v.72c-1.74.24-2.82 1.38-2.82 2.82 0 1.98 1.2 2.76 3.72 3.06 1.68.3 2.22.66 2.22 1.62 0 .96-.84 1.62-1.98 1.62-1.56 0-2.1-.66-2.28-1.56-.06-.24-.24-.36-.48-.36h-1.02a.4.4 0 0 0-.4.42v.06c.24 1.44 1.14 2.46 3.06 2.76v.72c0 .24.2.46.46.46h.9c.24 0 .46-.2.46-.46v-.72c1.8-.3 2.94-1.5 2.94-3.06z"
                fill="white"
              />
            </svg>
            <span
              className="text-[11px] font-medium tracking-[0.01em]"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              USDC
            </span>
          </div>
        </div>
      </motion.div>

      {/* Bottom separator */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 1.8, delay: 0.9, ease: EASE }}
        className="mx-auto mt-14 h-px w-full max-w-[260px]"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(255,255,255,0.05), transparent)",
        }}
      />
    </main>
  </section>
);

export default CinematicHero;
