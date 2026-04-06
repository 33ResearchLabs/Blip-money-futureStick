import { memo, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ============================================
   PRODUCT REVEAL — Apple keynote-style
   Positioned after Protocol explanation.
   "You've heard the tech. Now see it."

   - Scroll-driven scale + perspective tilt
   - Floating stat pills around the mockup
   - Single cinematic moment, no repetition
   ============================================ */

const stats = [
  { label: "Settlement", value: "<1s", position: "top-4 left-4 md:top-8 md:-left-4" },
  { label: "Uptime", value: "99.9%", position: "top-4 right-4 md:top-12 md:-right-6" },
  { label: "Countries", value: "150+", position: "bottom-16 left-4 md:bottom-20 md:-left-2" },
  { label: "Avg Fee", value: "0.1%", position: "bottom-16 right-4 md:bottom-16 md:-right-4" },
];

const ProductPreview = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.35], [0.88, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 0.35], [6, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.35], [60, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-40 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #000 0%, #0a0a0a 50%, #000 100%)",
      }}
    >
      {/* Radial ambient light */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 40%, rgba(255,107,53,0.06) 0%, transparent 100%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.03]">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-[#00e599]"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-[10px] uppercase tracking-[0.25em] text-white/40 font-semibold">
              Live on Solana Mainnet
            </span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h2
          className="heading-h2 text-white text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
          style={{ marginBottom: 16 }}
        >
          This is Blip.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.12, ease: EASE }}
          className="text-center mx-auto px-4"
          style={{
            fontSize: "clamp(15px, 3.5vw, 18px)",
            lineHeight: 1.6,
            color: "rgba(255,255,255,0.4)",
            maxWidth: 480,
            marginBottom: "clamp(32px, 8vw, 64px)",
          }}
        >
          One dashboard. Every order, every corridor, every settlement — live.
        </motion.p>

        {/* Cinematic mockup with perspective */}
        <div style={{ perspective: "1200px" }}>
          <motion.div
            style={{ scale, rotateX, opacity, y, transformOrigin: "center bottom" }}
            className="relative mx-auto max-w-5xl"
          >
            {/* Floating stat pills */}
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 + i * 0.1, ease: EASE }}
                className={`absolute ${stat.position} z-20 hidden md:flex`}
              >
                <div
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl backdrop-blur-xl"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                  }}
                >
                  <span
                    className="font-semibold"
                    style={{ fontSize: 18, color: "#ff6b35", letterSpacing: "-0.02em" }}
                  >
                    {stat.value}
                  </span>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "0.05em" }}>
                    {stat.label}
                  </span>
                </div>
              </motion.div>
            ))}

            {/* Browser frame */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow:
                  "0 0 0 1px rgba(255,255,255,0.04), 0 40px 120px rgba(0,0,0,0.8), 0 0 80px rgba(255,107,53,0.04)",
              }}
            >
              {/* Chrome bar */}
              <div
                className="flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-3"
                style={{
                  background: "linear-gradient(180deg, #1e1e1e 0%, #1a1a1a 100%)",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div className="flex gap-[5px]">
                  <div className="w-[10px] h-[10px] md:w-[12px] md:h-[12px] rounded-full bg-[#ff5f57]" />
                  <div className="w-[10px] h-[10px] md:w-[12px] md:h-[12px] rounded-full bg-[#febc2e]" />
                  <div className="w-[10px] h-[10px] md:w-[12px] md:h-[12px] rounded-full bg-[#28ca42]" />
                </div>
                <div
                  className="flex-1 mx-2 md:mx-8 flex items-center justify-center gap-1.5 md:gap-2 px-2 md:px-4 py-[5px] md:py-[6px] rounded-lg"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth={2}
                    className="hidden sm:block"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span
                    className="text-[9px] md:text-[11px] font-mono truncate"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    merchant.blip.money
                  </span>
                  <div className="ml-1 md:ml-3 flex items-center gap-1 md:gap-1.5 shrink-0">
                    <motion.div
                      className="w-[5px] h-[5px] md:w-[6px] md:h-[6px] rounded-full bg-[#00e599]"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <span
                      className="text-[8px] md:text-[9px] font-semibold uppercase tracking-wider"
                      style={{ color: "rgba(255,255,255,0.25)" }}
                    >
                      Live
                    </span>
                  </div>
                </div>
              </div>

              {/* Dashboard */}
              <div className="relative">
                <motion.img
                  src="/images/merchant-dashboard.webp"
                  alt="Blip Merchant Dashboard"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto block"
                  style={{ willChange: "transform" }}
                  animate={{ scale: [1, 1.012, 1] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Bottom fade to black */}
                <div
                  className="absolute bottom-0 left-0 right-0 pointer-events-none"
                  style={{
                    height: "35%",
                    background:
                      "linear-gradient(to top, #0a0a0a 0%, transparent 100%)",
                  }}
                />
              </div>
            </div>

            {/* Reflection underneath — desktop only */}
            <div
              className="mx-auto mt-0 overflow-hidden pointer-events-none hidden md:block"
              style={{
                maxWidth: "85%",
                height: 80,
                opacity: 0.15,
                transform: "scaleY(-1)",
                maskImage: "linear-gradient(to bottom, white 0%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, white 0%, transparent 100%)",
              }}
            >
              <img
                src="/images/merchant-dashboard.webp"
                alt=""
                className="w-full h-auto block"
                aria-hidden="true"
              />
            </div>

            {/* Mobile stat row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
              className="flex md:hidden justify-center gap-3 mt-6 flex-wrap"
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <span className="font-semibold text-sm" style={{ color: "#ff6b35" }}>
                    {stat.value}
                  </span>
                  <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Surface glow */}
            <div
              className="absolute -inset-12 -z-10 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(255,107,53,0.08) 0%, transparent 100%)",
                filter: "blur(40px)",
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default memo(ProductPreview);
