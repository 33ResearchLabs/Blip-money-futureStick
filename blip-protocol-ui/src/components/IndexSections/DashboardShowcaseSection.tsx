import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef } from "react";

/* ============================================
   SEND MONEY SHOWCASE — SCROLL STORY
   ────────────────────────────────────────────
   The heading is the ANCHOR. Everything reacts to it.

   HOW IT WORKS:
   - offset ["start center", "end end"] means the section
     enters from the BOTTOM of the viewport.
   - The sticky container scrolls UP naturally through
     the viewport (heading visible, moving with the page).
   - When the sticky container's top hits viewport top
     (at ~25% scroll progress), position:sticky engages.
   - The heading FREEZES at exact center. CSS does this.
     No translateY. No Framer y transform. Pure sticky.
   - Only scale + opacity animate on the heading after lock.
   - Cards begin entering AFTER heading is locked.

   Section: 190vh. Scroll range: ~140vh.
   Sticky engages at ~36% (50vh / 140vh).

   Phase 1  (0.00–0.36)  Heading scrolls naturally to center
   Phase 2  (0.36–0.42)  Heading LOCKED. Scale/opacity shift.
   Phase 3  (0.42–0.95)  Cards enter from offscreen → overlap
   Phase 4  (0.95–1.00)  ~7vh hold, then section scrolls away
   ============================================ */

const floatingCards = [
  {
    label: "SEND TO\nANYONE",
    sub: "Pay globally in seconds",
    image:
      "https://images.unsplash.com/photo-1616077168712-fc6c788db4af?w=300&h=300&fit=crop&q=80",
    size: "w-44 h-56 sm:w-52 sm:h-64 lg:w-56 lg:h-72",
    glow: "rgba(255,107,53,0.15)",
    start: { x: -700, y: -500 },
    end: { x: -70, y: -30 },
    finalRotate: -6,
  },
  {
    label: "ON-CHAIN\nSETTLEMENT",
    sub: "Transparent escrow-based settlement",
    image:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=300&h=300&fit=crop&q=80",
    size: "w-44 h-56 sm:w-52 sm:h-64 lg:w-56 lg:h-72",
    glow: "rgba(99,102,241,0.15)",
    start: { x: 700, y: -500 },
    end: { x: 80, y: -20 },
    finalRotate: 5,
  },
  {
    label: "NON-\nCUSTODIAL",
    sub: "Users keep control of funds",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300&h=300&fit=crop&q=80",
    size: "w-40 h-52 sm:w-48 sm:h-60 lg:w-52 lg:h-64",
    glow: "rgba(16,185,129,0.15)",
    start: { x: -700, y: 500 },
    end: { x: -55, y: 45 },
    finalRotate: 4,
  },
  {
    label: "MERCHANT\nLIQUIDITY",
    sub: "Offers with real limits and SLAs",
    image:
      "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=300&h=300&fit=crop&q=80",
    size: "w-44 h-56 sm:w-52 sm:h-64 lg:w-56 lg:h-68",
    glow: "rgba(251,191,36,0.15)",
    start: { x: 700, y: 500 },
    end: { x: 65, y: 50 },
    finalRotate: -5,
  },
  {
    label: "BEST\nRATES",
    sub: "Merchants compete for your trade",
    image:
      "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=300&h=300&fit=crop&q=80",
    size: "w-44 h-56 sm:w-52 sm:h-64 lg:w-56 lg:h-72",
    glow: "rgba(139,92,246,0.15)",
    start: { x: 0, y: -600 },
    end: { x: 5, y: 5 },
    finalRotate: 2,
  },
];

export default function DashboardShowcaseSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    // CRITICAL: "start center" means progress=0 when section top
    // reaches viewport center. The sticky container physically
    // scrolls through the viewport before engaging.
    // Sticky engages at ~36% progress (50vh / 140vh total scroll).
    offset: ["start center", "end end"],
  });

  // ── Heading transforms ─────────────────────────────
  // NO y transform. Zero. None.
  // Heading vertical position = CSS only:
  //   Before sticky: container scrolls naturally → heading moves with page
  //   After sticky:  container pinned at top:0 → heading locked at center
  //
  // Framer only controls scale + opacity (after lock at ~0.36):
  // Scale: 1.15 → 0.75 = dramatic 35% shrink as cards pile on
  const headingScale = useTransform(
    scrollYProgress,
    [0, 0.36, 0.95, 1],
    [1.9, 1.3, 0.75, 0.75],
  );
  // Opacity: 1 → 0.15 = heading nearly invisible behind overlapping cards
  const headingOpacity = useTransform(
    scrollYProgress,
    [0, 0.36, 0.95, 1],
    [1, 1, 0.15, 0.15],
  );

  // ── Card 0 · top-left → overlaps left side of heading ──
  const c0x = useTransform(
    scrollYProgress,
    [0, 0.42, 0.95, 1],
    [-700, -700, -70, -70],
  );
  const c0y = useTransform(
    scrollYProgress,
    [0, 0.42, 0.95, 1],
    [-500, -500, -30, -30],
  );
  const c0o = useTransform(scrollYProgress, [0, 0.42, 0.7, 1], [0, 0, 1, 1]);
  const c0s = useTransform(
    scrollYProgress,
    [0, 0.42, 0.95, 1],
    [0.9, 0.9, 1, 1],
  );
  const c0r = useTransform(scrollYProgress, [0, 0.42, 0.95, 1], [0, 0, -6, -6]);

  // ── Card 1 · top-right → overlaps right side of heading ──
  const c1x = useTransform(
    scrollYProgress,
    [0, 0.42, 0.95, 1],
    [700, 700, 80, 80],
  );
  const c1y = useTransform(
    scrollYProgress,
    [0, 0.42, 0.95, 1],
    [-500, -500, -20, -20],
  );
  const c1o = useTransform(scrollYProgress, [0, 0.44, 0.72, 1], [0, 0, 1, 1]);
  const c1s = useTransform(
    scrollYProgress,
    [0, 0.42, 0.95, 1],
    [0.9, 0.9, 1, 1],
  );
  const c1r = useTransform(scrollYProgress, [0, 0.42, 0.95, 1], [0, 0, 5, 5]);

  // ── Card 2 · bottom-left → overlaps CTA left ──
  const c2x = useTransform(
    scrollYProgress,
    [0, 0.42, 0.95, 1],
    [-700, -700, -55, -55],
  );
  const c2y = useTransform(
    scrollYProgress,
    [0, 0.42, 0.95, 1],
    [500, 500, 45, 45],
  );
  const c2o = useTransform(scrollYProgress, [0, 0.46, 0.74, 1], [0, 0, 1, 1]);
  const c2s = useTransform(
    scrollYProgress,
    [0, 0.42, 0.95, 1],
    [0.9, 0.9, 1, 1],
  );
  const c2r = useTransform(scrollYProgress, [0, 0.42, 0.95, 1], [0, 0, 4, 4]);

  // ── Card 3 · bottom-right → overlaps CTA right ──
  const c3x = useTransform(
    scrollYProgress,
    [0, 0.42, 0.95, 1],
    [700, 700, 65, 65],
  );
  const c3y = useTransform(
    scrollYProgress,
    [0, 0.42, 0.95, 1],
    [500, 500, 50, 50],
  );
  const c3o = useTransform(scrollYProgress, [0, 0.48, 0.76, 1], [0, 0, 1, 1]);
  const c3s = useTransform(
    scrollYProgress,
    [0, 0.42, 0.95, 1],
    [0.9, 0.9, 1, 1],
  );
  const c3r = useTransform(scrollYProgress, [0, 0.42, 0.95, 1], [0, 0, -5, -5]);

  // ── Card 4 · dead center → covers heading directly (topmost) ──
  const c4x = useTransform(scrollYProgress, [0, 0.42, 0.95, 1], [0, 0, 5, 5]);
  const c4y = useTransform(
    scrollYProgress,
    [0, 0.42, 0.95, 1],
    [-600, -600, 5, 5],
  );
  const c4o = useTransform(scrollYProgress, [0, 0.43, 0.71, 1], [0, 0, 1, 1]);
  const c4s = useTransform(
    scrollYProgress,
    [0, 0.42, 0.95, 1],
    [0.9, 0.9, 1, 1],
  );
  const c4r = useTransform(scrollYProgress, [0, 0.42, 0.95, 1], [0, 0, 2, 2]);

  const transforms = [
    { x: c0x, y: c0y, opacity: c0o, scale: c0s, rotate: c0r },
    { x: c1x, y: c1y, opacity: c1o, scale: c1s, rotate: c1r },
    { x: c2x, y: c2y, opacity: c2o, scale: c2s, rotate: c2r },
    { x: c3x, y: c3y, opacity: c3o, scale: c3s, rotate: c3r },
    { x: c4x, y: c4y, opacity: c4o, scale: c4s, rotate: c4r },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative h-[190vh] bg-white dark:bg-black"
    >
      {/*
        Sticky viewport — the KEY to the entire effect.
        - Before sticky: this div scrolls UP through the viewport naturally.
          The heading (centered inside) scrolls with it = "normal scroll".
        - Sticky engages when this div's top hits viewport top (top:0).
          Everything inside FREEZES. Heading locked at center.
        - Stays stuck for 90vh of scroll (190vh section - 100vh container).
      */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* ── Desktop cards — z-20, ABOVE heading for overlap depth ── */}
        <div className="absolute inset-0 z-20 hidden sm:flex items-center justify-center pointer-events-none">
          {floatingCards.map((card, index) => (
            <motion.div
              key={card.label}
              className={`absolute ${card.size}`}
              style={{
                x: transforms[index].x,
                y: transforms[index].y,
                opacity: transforms[index].opacity,
                scale: transforms[index].scale,
                rotate: transforms[index].rotate,
                zIndex: index === 4 ? 25 : 20 - index,
              }}
            >
              {/* Subtle glow */}
              <div
                className="absolute -inset-4 rounded-3xl blur-2xl opacity-50"
                style={{ background: card.glow }}
              />

              {/* Card face */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/[0.10] shadow-[0_12px_48px_-8px_rgba(0,0,0,0.5)]">
                <img
                  src={card.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="block text-xs sm:text-sm font-extrabold text-white uppercase tracking-[0.15em] leading-tight whitespace-pre-line">
                    {card.label}
                  </span>
                  <span className="block text-[10px] sm:text-xs text-white/50 mt-1 font-semibold tracking-wide">
                    {card.sub}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Heading — absolute centered, z-10 BELOW cards ──
             NO y transform. Position = CSS only.
             Framer only touches scale + opacity. ── */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <motion.div
            className="text-center px-6 max-w-3xl"
            style={{
              scale: headingScale,
              opacity: headingOpacity,
            }}
          >
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-semibold tracking-tight leading-[0.95] text-black dark:text-white">
              Send money to
              <br />
              anyone, anywhere.
            </h2>

            <div className="mt-10 flex flex-col sm:flex-row items-center gap-6 rounded-full border border-black/10 dark:border-white/[0.08] px-10 py-6 backdrop-blur-sm">
              <div className="text-sm text-black/60 dark:text-white/40 space-y-1">
                <p>Users buy and sell crypto with local merchants.</p>
                <p>Merchants provide liquidity and compete on price.</p>
                <p>Blip settles instantly on-chain.</p>
              </div>

              <Link
                to="/waitlist"
                className="group relative overflow-hidden inline-flex items-center justify-center gap-3 w-[240px] h-[56px] rounded-full bg-black dark:bg-white text-white dark:text-black text-base font-semibold transition-all duration-300"
              >
                <span className="absolute inset-0 bg-white/20 dark:bg-black/10 rounded-full scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-out" />
                <span className="relative z-10">Get Started</span>
                <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
