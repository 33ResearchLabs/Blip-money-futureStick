import { useRef, memo } from "react";
import { motion, useInView } from "framer-motion";
import { useTheme } from "next-themes";
import { SwipeHint } from "./SwipeHint";

const EASE = [0.22, 1, 0.36, 1] as const;

const COMPARISONS = [
  { metric: "Settlement time", traditional: "3–5 days", blip: "< 60 seconds" },
  { metric: "Fees", traditional: "5–7%", blip: "< 1%" },
  { metric: "Transparency", traditional: "None", blip: "On-chain proof" },
  { metric: "Custody", traditional: "Bank-held", blip: "Non-custodial" },
  { metric: "Availability", traditional: "Business hours", blip: "24/7" },
  { metric: "Verification", traditional: "Manual / delayed", blip: "Instant on Solana" },
];

const LiquidityLayer = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-20 px-5 md:py-[140px] md:px-6"
      style={{ background: isDark ? "#000" : "#FAF8F5" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            style={{ fontSize: 12, fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", color: isDark ? "#555" : "#999", marginBottom: 24 }}
          >
            Why Blip
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE }}
            className="heading-h2"
            style={{ color: isDark ? "#fff" : "#1d1d1f", marginBottom: 48 }}
          >
            Traditional rails vs Blip Protocol.
          </motion.h2>
        </div>

        {/* Stats row — key differences at a glance */}
        <div className="relative mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          className="-mx-5 md:mx-0 px-5 md:px-0 flex md:grid md:grid-cols-4 gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {[
            { label: "Speed", old: "3–5 days", new: "< 60s" },
            { label: "Fees", old: "5–7%", new: "< 1%" },
            { label: "Transparency", old: "Zero", new: "Full" },
            { label: "Availability", old: "9–5", new: "24/7" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
              className="snap-start shrink-0 w-[58%] md:w-auto rounded-2xl p-5 text-center"
              style={{
              background: isDark ? "rgba(255,255,255,0.03)" : "#ffffff",
              border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)",
              boxShadow: isDark ? "none" : "0 2px 16px rgba(0,0,0,0.04)",
            }}>
              <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)", marginBottom: 8 }}>
                {s.label}
              </div>
              <div className="font-mono" style={{ fontSize: 14, fontWeight: 500, color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)", textDecoration: "line-through", marginBottom: 4 }}>
                {s.old}
              </div>
              <div className="font-mono" style={{ fontSize: 24, fontWeight: 700, color: isDark ? "#fff" : "#1d1d1f", letterSpacing: "-0.03em" }}>
                {s.new}
              </div>
            </motion.div>
          ))}
        </motion.div>
        <SwipeHint />
        </div>

        {/* Comparison table — full width at md+, horizontally scrollable on mobile */}
        <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
          className="-mx-5 md:mx-0 px-5 md:px-0 overflow-x-auto md:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div
            className="rounded-2xl overflow-hidden min-w-[640px] md:min-w-0"
            style={{
              background: isDark ? "rgba(255,255,255,0.03)" : "#ffffff",
              border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)",
              boxShadow: isDark ? "none" : "0 2px 16px rgba(0,0,0,0.04)",
            }}
          >
            {/* Column headers */}
            <div className="grid grid-cols-3 px-6 py-4" style={{ borderBottom: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)" }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>
                Metric
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.7)" }}>
                Traditional
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: isDark ? "#fff" : "#1d1d1f" }}>
                Blip Protocol
              </span>
            </div>

            {/* Rows */}
            {COMPARISONS.map((r, i) => (
              <motion.div
                key={r.metric}
                initial={{ opacity: 0, x: -10 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.08, ease: EASE }}
                className="grid grid-cols-3 items-center px-6 py-4"
                style={{ borderBottom: i < COMPARISONS.length - 1 ? (isDark ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(0,0,0,0.04)") : "none" }}
              >
                <span className="text-sm font-medium" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)" }}>
                  {r.metric}
                </span>
                <span className="text-sm font-mono" style={{ color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.8)" }}>
                  {r.traditional}
                </span>
                <span className="text-sm font-bold font-mono" style={{ color: isDark ? "#fff" : "#1d1d1f" }}>
                  {r.blip}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
        <SwipeHint />
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
          className="text-center mt-10"
        >
          <motion.a
            href="/waitlist"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold"
            style={{ background: "#1d1d1f", color: "#fff" }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Get early access
            <span>→</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(LiquidityLayer);
