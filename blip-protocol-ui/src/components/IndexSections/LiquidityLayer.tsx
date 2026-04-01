import { useState, useEffect, useRef, memo } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

const EASE = [0.22, 1, 0.36, 1] as const;

const ROUTES = [
  { corridor: "UAE → India", utilization: 87, apy: "12.4%", volume: "$2.1M" },
  { corridor: "UAE → Philippines", utilization: 72, apy: "9.8%", volume: "$1.4M" },
  { corridor: "UAE → Pakistan", utilization: 64, apy: "11.2%", volume: "$890K" },
  { corridor: "UAE → Nigeria", utilization: 91, apy: "14.1%", volume: "$1.8M" },
  { corridor: "UAE → Egypt", utilization: 58, apy: "8.6%", volume: "$620K" },
];

const LiquidityLayer = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const [totalDeployed, setTotalDeployed] = useState(4847000);
  const [totalEarned, setTotalEarned] = useState(284700);

  useEffect(() => {
    if (!isInView) return;
    const id = setInterval(() => {
      setTotalDeployed((v) => v + Math.floor(Math.random() * 5000 + 1000));
      setTotalEarned((v) => v + Math.floor(Math.random() * 200 + 50));
    }, 3000);
    return () => clearInterval(id);
  }, [isInView]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{ background: isDark ? "#000" : "#FAF8F5", padding: "140px 24px" }}
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
            Liquidity
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE }}
            className="heading-h2"
            style={{ color: isDark ? "#fff" : "#1d1d1f", marginBottom: 16 }}
          >
            Infrastructure yield,{" "}
            <span className="bg-orange-600/10 text-[#ff6b35] px-3 py-0.5 rounded-md">not speculation.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
            style={{ fontSize: 18, color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", lineHeight: 1.6, maxWidth: 520, margin: "0 auto" }}
          >
            Deploy capital into settlement routes. Capture spread on every trade. Full control, real-time earnings, transparent risk.
          </motion.p>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {[
            { label: "Total deployed", value: `$${(totalDeployed / 1000000).toFixed(1)}M`, live: true },
            { label: "Total earned by LPs", value: `$${(totalEarned / 1000).toFixed(0)}K`, live: true },
            { label: "Active routes", value: "42", live: false },
            { label: "Avg APY", value: "11.2%", live: false },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl p-5 text-center" style={{
              background: isDark ? "rgba(255,255,255,0.03)" : "#ffffff",
              border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)",
              boxShadow: isDark ? "none" : "0 2px 16px rgba(0,0,0,0.04)",
            }}>
              <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)", marginBottom: 6 }}>
                {s.label}
              </div>
              <motion.div
                key={s.live ? s.value : undefined}
                initial={s.live ? { y: -3, opacity: 0.6 } : false}
                animate={{ y: 0, opacity: 1 }}
                className="font-mono"
                style={{ fontSize: 24, fontWeight: 700, color: isDark ? "#fff" : "#1d1d1f", letterSpacing: "-0.03em" }}
              >
                {s.value}
              </motion.div>
            </div>
          ))}
        </motion.div>

        {/* Route table */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
          className="rounded-2xl overflow-hidden"
          style={{
            background: isDark ? "rgba(255,255,255,0.03)" : "#ffffff",
            border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)",
            boxShadow: isDark ? "none" : "0 2px 16px rgba(0,0,0,0.04)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)" }}>
            <div className="flex items-center gap-2">
              <motion.div className="w-1.5 h-1.5 rounded-full bg-[#3ddc84]" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>
                Active settlement routes
              </span>
            </div>
            <span style={{ fontSize: 10, fontWeight: 600, color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)" }}>Live</span>
          </div>

          {/* Column headers */}
          <div className="grid grid-cols-4 px-6 py-2" style={{ borderBottom: isDark ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(0,0,0,0.04)" }}>
            {["Corridor", "Utilization", "APY", "24h Volume"].map((h) => (
              <span key={h} style={{ fontSize: 9, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)" }}>
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          {ROUTES.map((r, i) => (
            <motion.div
              key={r.corridor}
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.08, ease: EASE }}
              className="grid grid-cols-4 items-center px-6 py-3.5"
              style={{ borderBottom: i < ROUTES.length - 1 ? (isDark ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(0,0,0,0.04)") : "none" }}
            >
              <span className="text-sm font-medium" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)" }}>{r.corridor}</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: r.utilization > 80 ? "#ff6b35" : "#3ddc84" }}
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${r.utilization}%` } : {}}
                    transition={{ duration: 1, delay: 0.5 + i * 0.1, ease: EASE }}
                  />
                </div>
                <span className="text-xs font-mono" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>{r.utilization}%</span>
              </div>
              <span className="text-sm font-bold font-mono" style={{ color: "#3ddc84" }}>{r.apy}</span>
              <span className="text-sm font-mono" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>{r.volume}</span>
            </motion.div>
          ))}
        </motion.div>

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
            Provide liquidity
            <span>→</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(LiquidityLayer);
