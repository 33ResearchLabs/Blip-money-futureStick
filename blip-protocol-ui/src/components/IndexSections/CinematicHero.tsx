import { useRef, memo } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Tag } from "lucide-react";
import { CTAButton } from "../Navbar";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ── Hero ── */
const CinematicHero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.2 });
  const isDark = true;

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen md:min-h-0 lg:min-h-screen overflow-hidden flex items-center justify-center text-center bg-[#FAF8F5] dark:bg-black"
    >

      {/* ── Apple-style cinematic hero: pure black void + radiant Earth focal ── */}
      {/* Pure black base */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none bg-black"
      />

      {/* Atmospheric halo — orange bloom radiating from Earth */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.4, ease: EASE }}
        style={{
          background:
            "radial-gradient(ellipse 75% 55% at 50% 88%, rgba(255,140,80,0.35), rgba(255,107,53,0.12) 30%, transparent 60%)",
        }}
      />

      {/* Cool atmospheric rim — adds dimension at top */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(80,110,180,0.10), transparent 60%)",
        }}
      />

      {/* THE Earth — bottom-anchored, crisp, with breathing scale */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        initial={{ scale: 1.02, y: 20 }}
        animate={isInView ? { scale: [1.02, 1.08, 1.02], y: 0 } : { scale: 1.02, y: 0 }}
        transition={
          isInView
            ? { scale: { duration: 18, repeat: Infinity, ease: "easeInOut" }, y: { duration: 1.6, ease: EASE } }
            : { duration: 0 }
        }
        style={{
          height: "85%",
          backgroundImage: "url('/hero-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat",
          filter: "contrast(1.18) saturate(1.3) brightness(1.08)",
          maskImage:
            "radial-gradient(ellipse 90% 100% at 50% 100%, black 40%, rgba(0,0,0,0.5) 75%, transparent 95%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 100% at 50% 100%, black 40%, rgba(0,0,0,0.5) 75%, transparent 95%)",
          transform: "translateZ(0)",
        }}
      />

      {/* Top darken — clean canvas for headline */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[72%] pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, #000 0%, rgba(0,0,0,0.85) 55%, rgba(0,0,0,0.35) 88%, transparent 100%)",
        }}
      />

      {/* Side vignette — keeps focus center */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 100% at 50% 50%, transparent 45%, rgba(0,0,0,0.4) 90%, rgba(0,0,0,0.8) 100%)",
        }}
      />

      {/* Drifting starlight — subtle motion */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-60"
        animate={
          isInView
            ? { backgroundPosition: ["0% 0%", "100% 50%"] }
            : { backgroundPosition: "0% 0%" }
        }
        transition={
          isInView
            ? { duration: 40, repeat: Infinity, ease: "linear" }
            : { duration: 0 }
        }
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.5), transparent), radial-gradient(1px 1px at 75% 18%, rgba(255,255,255,0.4), transparent), radial-gradient(1px 1px at 42% 12%, rgba(255,255,255,0.35), transparent), radial-gradient(1px 1px at 88% 35%, rgba(255,255,255,0.45), transparent), radial-gradient(1px 1px at 12% 22%, rgba(255,255,255,0.3), transparent)",
          backgroundSize: "200% 200%",
        }}
      />

      {/* Ultra-fine grain */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* Content */}
      <main className="relative z-10 w-full max-w-[860px] mx-auto px-6 md:px-10 pt-28 pb-6 md:pb-12 lg:pb-24 text-center">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="text-white/55"
          style={{
            fontSize: "11px",
            fontWeight: 500,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            marginBottom: 32,
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
            fontSize: "clamp(3.25rem, 8.2vw, 7rem)",
            fontWeight: 500,
            lineHeight: 1.02,
            letterSpacing: "-0.045em",
            marginBottom: 36,
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
          style={{ maxWidth: 480, margin: "0 auto 24px" }}
        >
          <p
            className="text-white/65 dark:text-[#999]"
            style={{
              fontSize: 18,
              lineHeight: 1.6,
            }}
          >
            Best rates, guaranteed. Private by design.
            <br />
            Settled on-chain.
          </p>
        </motion.div>

        {/* Best-rates promise — white button-style pill, links to live rate finder */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
          className="mb-9 flex justify-center"
        >
          <Link
            to="/rates"
            className="group inline-flex flex-col items-center gap-1 px-5 py-2.5 rounded-2xl bg-white text-black shadow-[0_4px_20px_rgba(0,0,0,0.18)] hover:shadow-[0_6px_28px_rgba(255,107,53,0.30)] active:scale-[0.98] transition-all duration-300 max-w-[260px]"
          >
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff6b35] leading-none">
              <Tag className="w-3 h-3" strokeWidth={2.8} />
              Best rates, guaranteed
            </span>
            <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-black/75 group-hover:text-black tracking-tight leading-none">
              Find cheaper. We&apos;ll cut deeper.
              <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </Link>
        </motion.div>


        {/* Stats — live network pulse */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: EASE, delay: 0.6 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="flex items-center gap-2">
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-[#3ddc84]"
              animate={isInView ? { opacity: [1, 0.3, 1] } : { opacity: 0.6 }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-white/45">
              Live
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-8">
            {[
              { value: "3+", label: "Countries" },
              { value: "100+", label: "Merchants" },
              { value: "1 min", label: "Avg settlement" },
            ].map((s, i) => (
              <div key={s.label} className="flex items-center gap-3">
                {i > 0 && (
                  <div className="hidden sm:block w-px h-6 bg-white/10" />
                )}
                <div className="text-center">
                  <div className="font-mono text-base sm:text-lg font-bold text-white tracking-tight">
                    {s.value}
                  </div>
                  <div className="text-[9px] sm:text-[10px] font-semibold tracking-[0.18em] uppercase text-white/35 mt-0.5">
                    {s.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </section>
  );
};

export default memo(CinematicHero);
