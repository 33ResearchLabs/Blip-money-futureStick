import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useMemo, useState, useEffect } from "react";

/* ============================================
   DESIGN SHOWCASE — SCROLL-DRIVEN THEME STORY
   ────────────────────────────────────────────
   Showcases the app's visual identity: light/dark themes,
   typography, color palette, and responsive design.

   Same scroll-driven animation system as before:
   Phase 1  (0.0–0.2)   Heading shrinks gently
   Phase 2  (0.2–0.7)   Cards fly in and settle
   Phase 3  (0.7–1.0)   Hold final composition
   ============================================ */

const showcaseCards = [
  {
    label: "LIGHT_MODE",
    type: "light-theme",
    size: "w-52 h-60 sm:w-60 sm:h-72 lg:w-64 lg:h-80",
    glow: "rgba(250,248,245,0.3)",
  },
  {
    label: "DARK_MODE",
    type: "dark-theme",
    size: "w-52 h-60 sm:w-60 sm:h-72 lg:w-64 lg:h-80",
    glow: "rgba(139,92,246,0.15)",
  },
  {
    label: "TYPOGRAPHY",
    type: "typography",
    size: "w-52 h-64 sm:w-60 sm:h-72 lg:w-64 lg:h-80",
    glow: "rgba(0,0,0,0.08)",
  },
  {
    label: "PALETTE",
    type: "palette",
    size: "w-52 h-60 sm:w-60 sm:h-72 lg:w-64 lg:h-80",
    glow: "rgba(34,197,94,0.12)",
  },
];

export default function DashboardShowcaseSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001,
  });

  // ── Heading transforms ─────────────────────────────
  const headingScale = useTransform(
    smoothScrollProgress,
    [0, 0.2, 0.7, 1],
    isMobile ? [1.2, 1, 0.9, 0.8] : [2.5, 1.8, 1.2, 0.9],
  );
  const headingOpacity = useTransform(
    smoothScrollProgress,
    [0, 0.2, 0.7, 1],
    [1, 1, 0.3, 0.3],
  );

  // ── Card animations — Staggered fly-in ──

  // Card 0 - Top-left
  const c0x = useTransform(smoothScrollProgress, [0, 0.25, 0.65, 1], [-700, -700, -70, -70]);
  const c0y = useTransform(smoothScrollProgress, [0, 0.25, 0.65, 1], [-500, -500, -30, -30]);
  const c0o = useTransform(smoothScrollProgress, [0, 0.25, 0.55, 1], [0, 0, 1, 1]);
  const c0s = useTransform(smoothScrollProgress, [0, 0.25, 0.65, 1], [0.85, 0.85, 1, 1]);
  const c0r = useTransform(smoothScrollProgress, [0, 0.25, 0.65, 1], [-8, -8, -6, -6]);

  // Card 1 - Top-right
  const c1x = useTransform(smoothScrollProgress, [0, 0.28, 0.68, 1], [700, 700, 80, 80]);
  const c1y = useTransform(smoothScrollProgress, [0, 0.28, 0.68, 1], [-500, -500, -20, -20]);
  const c1o = useTransform(smoothScrollProgress, [0, 0.28, 0.58, 1], [0, 0, 1, 1]);
  const c1s = useTransform(smoothScrollProgress, [0, 0.28, 0.68, 1], [0.9, 0.9, 1, 1]);
  const c1r = useTransform(smoothScrollProgress, [0, 0.28, 0.68, 1], [8, 8, 5, 5]);

  // Card 2 - Bottom-left
  const c2x = useTransform(smoothScrollProgress, [0, 0.31, 0.71, 1], [-700, -700, -55, -55]);
  const c2y = useTransform(smoothScrollProgress, [0, 0.31, 0.71, 1], [500, 500, 45, 45]);
  const c2o = useTransform(smoothScrollProgress, [0, 0.31, 0.61, 1], [0, 0, 1, 1]);
  const c2s = useTransform(smoothScrollProgress, [0, 0.31, 0.71, 1], [0.88, 0.88, 1, 1]);
  const c2r = useTransform(smoothScrollProgress, [0, 0.31, 0.71, 1], [6, 6, 4, 4]);

  // Card 3 - Bottom-right
  const c3x = useTransform(smoothScrollProgress, [0, 0.34, 0.74, 1], [700, 700, 65, 65]);
  const c3y = useTransform(smoothScrollProgress, [0, 0.34, 0.74, 1], [500, 500, 50, 50]);
  const c3o = useTransform(smoothScrollProgress, [0, 0.34, 0.64, 1], [0, 0, 1, 1]);
  const c3s = useTransform(smoothScrollProgress, [0, 0.34, 0.74, 1], [0.92, 0.92, 1, 1]);
  const c3r = useTransform(smoothScrollProgress, [0, 0.34, 0.74, 1], [-7, -7, -5, -5]);

  const transforms = useMemo(
    () => [
      { x: c0x, y: c0y, opacity: c0o, scale: c0s, rotate: c0r },
      { x: c1x, y: c1y, opacity: c1o, scale: c1s, rotate: c1r },
      { x: c2x, y: c2y, opacity: c2o, scale: c2s, rotate: c2r },
      { x: c3x, y: c3y, opacity: c3o, scale: c3s, rotate: c3r },
    ],
    [
      c0x, c0y, c0o, c0s, c0r,
      c1x, c1y, c1o, c1s, c1r,
      c2x, c2y, c2o, c2s, c2r,
      c3x, c3y, c3o, c3s, c3r,
    ],
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-[220vh] bg-white dark:bg-black"
      style={{ contain: "paint", touchAction: "pan-y" }}
    >
      <div
        className="sticky top-0 h-screen overflow-hidden"
        style={{ transform: "translate3d(0, 0, 0)" }}
      >
        {/* ── Animated cards — z-20, ABOVE heading ── */}
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          {showcaseCards.map((card, index) => (
            <motion.div
              key={card.label}
              className={`absolute ${card.size}`}
              style={{
                x: transforms[index].x,
                y: transforms[index].y,
                scale: transforms[index].scale,
                rotate: transforms[index].rotate,
                opacity: transforms[index].opacity,
                willChange: "transform, opacity",
              }}
            >
              {/* Subtle glow */}
              <div
                className="absolute -inset-4 rounded-3xl blur-2xl opacity-40"
                style={{ background: card.glow }}
              />

              {/* Card content by type */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-[0_12px_48px_-8px_rgba(0,0,0,0.4)] transition-shadow duration-300">
                {card.type === "light-theme" ? (
                  /* ── Light Mode Preview ── */
                  <div className="w-full h-full bg-[#FAF8F5] p-5 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-black/[0.05] flex items-center justify-center">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                        </div>
                        <div>
                          <div className="text-black/30 text-[9px] font-bold tracking-widest">THEME</div>
                          <div className="text-black/80 text-xs font-semibold">Light</div>
                        </div>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-amber-400" />
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="bg-white rounded-xl p-3 border border-black/[0.06]">
                        <div className="h-2 rounded-full bg-black/[0.08] w-3/4 mb-2" />
                        <div className="h-2 rounded-full bg-black/[0.05] w-1/2" />
                      </div>
                      <div className="flex gap-2">
                        <div className="bg-white rounded-lg p-2.5 border border-black/[0.06] flex-1">
                          <div className="h-2 rounded-full bg-black/[0.06] w-full mb-1.5" />
                          <div className="h-4 rounded bg-black/[0.04]" />
                        </div>
                        <div className="bg-white rounded-lg p-2.5 border border-black/[0.06] flex-1">
                          <div className="h-2 rounded-full bg-black/[0.06] w-full mb-1.5" />
                          <div className="h-4 rounded bg-black/[0.04]" />
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 bg-black rounded-xl py-2.5 text-center">
                      <span className="text-white text-xs font-bold">Clean & Bright</span>
                    </div>
                  </div>
                ) : card.type === "dark-theme" ? (
                  /* ── Dark Mode Preview ── */
                  <div className="w-full h-full bg-[#0a0a0a] p-5 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                        </div>
                        <div>
                          <div className="text-white/25 text-[9px] font-bold tracking-widest">THEME</div>
                          <div className="text-white/70 text-xs font-semibold">Dark</div>
                        </div>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-violet-500" />
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.06]">
                        <div className="h-2 rounded-full bg-white/[0.08] w-3/4 mb-2" />
                        <div className="h-2 rounded-full bg-white/[0.05] w-1/2" />
                      </div>
                      <div className="flex gap-2">
                        <div className="bg-white/[0.04] rounded-lg p-2.5 border border-white/[0.06] flex-1">
                          <div className="h-2 rounded-full bg-white/[0.06] w-full mb-1.5" />
                          <div className="h-4 rounded bg-white/[0.04]" />
                        </div>
                        <div className="bg-white/[0.04] rounded-lg p-2.5 border border-white/[0.06] flex-1">
                          <div className="h-2 rounded-full bg-white/[0.06] w-full mb-1.5" />
                          <div className="h-4 rounded bg-white/[0.04]" />
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 bg-white rounded-xl py-2.5 text-center">
                      <span className="text-black text-xs font-bold">Midnight Mode</span>
                    </div>
                  </div>
                ) : card.type === "typography" ? (
                  /* ── Typography Card ── */
                  <div className="w-full h-full bg-gradient-to-br from-[#1a1a2e] to-[#16213e] p-5 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                          <span className="text-white/60 text-sm font-display font-bold">Aa</span>
                        </div>
                        <div>
                          <div className="text-white/30 text-[9px] font-bold tracking-widest">TYPE</div>
                          <div className="text-white/70 text-xs font-semibold">Fonts</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center space-y-4">
                      <div>
                        <div className="text-white/30 text-[9px] font-bold tracking-widest mb-1">DISPLAY</div>
                        <div className="font-display text-white text-2xl sm:text-3xl font-semibold tracking-tight leading-tight">
                          Space Grotesk
                        </div>
                      </div>

                      <div className="h-px bg-white/10" />

                      <div>
                        <div className="text-white/30 text-[9px] font-bold tracking-widest mb-1">BODY</div>
                        <div className="text-white/80 text-base font-medium">
                          Inter
                        </div>
                        <div className="text-white/40 text-xs mt-1">
                          ABCDEFGHIJKLM
                        </div>
                        <div className="text-white/30 text-xs">
                          0123456789
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 bg-white/15 rounded-xl py-2.5 text-center">
                      <span className="text-white text-xs font-bold">Premium Type</span>
                    </div>
                  </div>
                ) : (
                  /* ── Color Palette Card ── */
                  <div className="w-full h-full bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-5 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="10.5" r="2.5"/><circle cx="8.5" cy="7.5" r="2.5"/><circle cx="6.5" cy="12.5" r="2.5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
                        </div>
                        <div>
                          <div className="text-white/30 text-[9px] font-bold tracking-widest">COLORS</div>
                          <div className="text-white/70 text-xs font-semibold">Palette</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 space-y-3">
                      {/* Primary colors */}
                      <div className="grid grid-cols-5 gap-1.5">
                        <div className="aspect-square rounded-lg bg-black border border-white/10" />
                        <div className="aspect-square rounded-lg bg-white" />
                        <div className="aspect-square rounded-lg bg-[#FAF8F5] border border-white/10" />
                        <div className="aspect-square rounded-lg bg-[#00e599]" />
                        <div className="aspect-square rounded-lg bg-violet-500" />
                      </div>

                      {/* Neutral scale */}
                      <div>
                        <div className="text-white/30 text-[9px] font-bold tracking-widest mb-1.5">NEUTRALS</div>
                        <div className="flex gap-1">
                          {["#ffffff", "#e5e5e5", "#a3a3a3", "#525252", "#262626", "#0a0a0a"].map((color) => (
                            <div
                              key={color}
                              className="flex-1 h-5 rounded-md first:rounded-l-lg last:rounded-r-lg"
                              style={{ background: color, border: color === "#ffffff" || color === "#0a0a0a" ? "1px solid rgba(255,255,255,0.1)" : "none" }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Accent */}
                      <div>
                        <div className="text-white/30 text-[9px] font-bold tracking-widest mb-1.5">ACCENT</div>
                        <div className="h-8 rounded-xl bg-gradient-to-r from-[#00e599] to-[#00cc88]" />
                      </div>
                    </div>

                    <div className="mt-3 bg-[#00e599] rounded-xl py-2.5 text-center">
                      <span className="text-black text-xs font-bold">Brand System</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Heading — absolute centered, z-10 BELOW cards ── */}
        <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
          <motion.div
            className="text-center w-full max-w-3xl"
            style={{
              scale: headingScale,
              opacity: headingOpacity,
              willChange: "transform, opacity",
            }}
          >
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-[1.1] text-black dark:text-white px-2">
              Crafted with
              <br />
              care.
            </h2>

            <p className="mt-4 sm:mt-6 p-2 text-base md:text-lg lg:text-xl text-black/80 dark:text-white/50 font-medium leading-relaxed">
              Every pixel, every shade, every detail — intentional.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
