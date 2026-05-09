import { useState, useEffect, useRef, memo } from "react";
import { motion, useInView } from "framer-motion";
import { useTheme } from "next-themes";
import { Link } from "react-router-dom";
import { ArrowRight, Tag } from "lucide-react";
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
          style={{ maxWidth: 480, margin: "0 auto 24px" }}
        >
          <p
            className="text-white/65 dark:text-[#999]"
            style={{
              fontSize: 18,
              lineHeight: 1.6,
            }}
          >
            The cheapest way to move money. Private by design. Settled on-chain.
          </p>
        </motion.div>

        {/* Lowest-rate promise — two-line card with tag icon and orange halo */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
          className="mb-9 flex justify-center"
        >
          <div className="relative inline-block">
            {/* Orange halo behind the card */}
            <div
              aria-hidden
              className="absolute -inset-3 rounded-[28px] blur-2xl pointer-events-none opacity-70"
              style={{
                background:
                  "radial-gradient(60% 80% at 50% 50%, rgba(255,107,53,0.35) 0%, transparent 70%)",
              }}
            />
            <div
              className="relative inline-flex items-center gap-3.5 px-5 py-3 rounded-2xl bg-white border border-[#ff6b35]/30"
              style={{
                boxShadow:
                  "0 12px 40px -10px rgba(255,107,53,0.45), 0 4px 20px rgba(0,0,0,0.10)",
              }}
            >
              {/* Price-tag chip */}
              <div className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0 bg-gradient-to-br from-[#ff8c50] to-[#ff6b35] shadow-[0_4px_12px_-2px_rgba(255,107,53,0.55)]">
                <Tag className="w-4 h-4 text-white" strokeWidth={2.6} />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#ff6b35] mb-0.5 leading-none">
                  Lowest rate, guaranteed
                </div>
                <div className="text-[14px] font-semibold text-black tracking-tight leading-tight whitespace-nowrap">
                  Find cheaper. We&apos;ll cut deeper.
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.38 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10"
        >
          {/* Mobile: single oversized primary CTA */}
          <Link
            to="/waitlist"
            className="sm:hidden group inline-flex items-center justify-center w-full max-w-[340px] py-4 px-6 rounded-full bg-white text-black text-[18px] font-semibold gap-2 shadow-[0_8px_28px_rgba(255,255,255,0.14)] active:scale-[0.98] transition-transform"
          >
            Join Waitlist
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>

          {/* Desktop: two CTAs side by side */}
          <div className="hidden sm:flex items-center justify-center gap-3">
            <CTAButton to="/waitlist">
              Join Waitlist
            </CTAButton>
            <CTAButton to="/merchant" variant="secondary">
              Join as Merchant
            </CTAButton>
          </div>
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
