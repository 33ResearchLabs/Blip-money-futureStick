import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { DollarSign, Clock, EyeOff, Zap, ArrowRight } from "lucide-react";

/* ============================================
   SECTION 2: THE PROBLEM — Why Now
   Bold stat grid layout — 3 problem cards + solution strip
   ============================================ */

const problems = [
  {
    icon: DollarSign,
    tag: "The cost",
    stat: "$48B",
    statSub: "lost annually",
    title: "Fees drain value.",
    desc: "Banks charge 3–7% on every international transfer. Remittance corridors are taxed before money moves.",
    color: "rgba(255,107,53,0.08)",
    borderColor: "rgba(255,107,53,0.15)",
    glowColor: "rgba(255,107,53,0.12)",
    iconColor: "#ff6b35",
  },
  {
    icon: Clock,
    tag: "The wait",
    stat: "3–5 days",
    statSub: "avg settlement",
    title: "Payments crawl.",
    desc: "SWIFT takes days. Merchants can't scale globally when money moves at 1970s speed.",
    color: "rgba(120,119,255,0.06)",
    borderColor: "rgba(120,119,255,0.12)",
    glowColor: "rgba(120,119,255,0.1)",
    iconColor: "#7877ff",
  },
  {
    icon: EyeOff,
    tag: "The exposure",
    stat: "100%",
    statSub: "transactions monitored",
    title: "Zero privacy.",
    desc: "Every transaction tracked, reported, and stored. Your business is an open book.",
    color: "rgba(239,68,68,0.05)",
    borderColor: "rgba(239,68,68,0.1)",
    glowColor: "rgba(239,68,68,0.08)",
    iconColor: "#ef4444",
  },
];

const ProblemSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative py-24 md:py-40 bg-[#FAF8F5] dark:bg-black overflow-hidden"
    >
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-[20%] left-[15%] w-[500px] h-[500px] rounded-full opacity-[0.04] dark:opacity-[0.06]"
          style={{ background: "radial-gradient(circle, rgba(255,107,53,0.8) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[20%] right-[15%] w-[400px] h-[400px] rounded-full opacity-[0.04] dark:opacity-[0.05]"
          style={{ background: "radial-gradient(circle, rgba(120,119,255,0.8) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-6"
        style={{ opacity }}
      >
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-black/[0.08] dark:border-white/[0.08] bg-white/60 dark:bg-white/[0.03]"
          >
            <span className="text-[10px] uppercase tracking-[0.25em] text-black/50 dark:text-white/40 font-semibold">
              Why now
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-black dark:text-white tracking-tight leading-[1.05] mb-5"
          >
            Global payments
            <br />
            <span className="text-black/20 dark:text-white/20">are broken.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-base md:text-lg text-black/50 dark:text-white/40 font-medium max-w-lg mx-auto leading-relaxed"
          >
            The traditional financial system was built for a different era.
            Stablecoin adoption is rising. Merchants are stuck. The timing is now.
          </motion.p>
        </div>

        {/* Problem cards grid — 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {problems.map((problem, i) => {
            const Icon = problem.icon;
            return (
              <motion.div
                key={problem.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="group relative rounded-2xl border border-black/[0.08] dark:border-white/[0.06] bg-white/70 dark:bg-white/[0.03] p-7 overflow-hidden hover:border-black/[0.14] dark:hover:border-white/[0.1] transition-all duration-300"
                style={{ boxShadow: "0 4px 30px -8px rgba(0,0,0,0.06)" }}
              >
                {/* Hover glow */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                  style={{ background: `radial-gradient(circle at 20% 20%, ${problem.glowColor}, transparent 60%)` }}
                />

                {/* Tag + Icon row */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[9px] uppercase tracking-[0.25em] text-black/30 dark:text-white/25 font-semibold">
                    {problem.tag}
                  </span>
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: problem.color, border: `1px solid ${problem.borderColor}` }}
                  >
                    <Icon className="w-4.5 h-4.5" style={{ color: problem.iconColor }} strokeWidth={1.5} />
                  </div>
                </div>

                {/* Big stat */}
                <div className="mb-1">
                  <span className="font-display text-4xl md:text-5xl font-bold text-black dark:text-white tracking-tight">
                    {problem.stat}
                  </span>
                </div>
                <div className="text-[10px] uppercase tracking-wider text-black/30 dark:text-white/25 font-semibold mb-4">
                  {problem.statSub}
                </div>

                {/* Divider */}
                <div className="h-px bg-black/[0.06] dark:bg-white/[0.06] mb-4" />

                {/* Title + desc */}
                <h3 className="text-base font-semibold text-black dark:text-white mb-2">
                  {problem.title}
                </h3>
                <p className="text-sm text-black/45 dark:text-white/35 leading-relaxed">
                  {problem.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Solution strip — full width */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-2xl bg-black dark:bg-white overflow-hidden p-7 md:p-9"
          style={{ boxShadow: "0 20px 60px -15px rgba(0,0,0,0.25)" }}
        >
          {/* Shimmer */}
          <motion.div
            className="absolute inset-0 opacity-[0.03]"
            style={{ background: "linear-gradient(135deg, transparent 30%, white 50%, transparent 70%)", backgroundSize: "200% 200%" }}
            animate={{ backgroundPosition: ["200% 200%", "-200% -200%"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          />

          {/* Orange glow */}
          <div
            className="absolute top-0 right-0 w-[400px] h-[200px] pointer-events-none"
            style={{ background: "radial-gradient(ellipse at top right, rgba(255,107,53,0.15) 0%, transparent 60%)" }}
          />

          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
            {/* Left: icon + text */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="w-11 h-11 rounded-xl bg-[#ff6b35] flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-[0.25em] text-white/40 dark:text-black/40 font-semibold mb-0.5">
                  The answer
                </div>
                <div className="text-xl font-bold text-white dark:text-black">
                  Enter Blip.
                </div>
              </div>
            </div>

            {/* Center: stats row */}
            <div className="flex flex-wrap gap-x-10 gap-y-3 flex-1">
              {[
                { value: "~2s", label: "Settlement" },
                { value: "0.1%", label: "Protocol fee" },
                { value: "Non-custodial", label: "Architecture" },
                { value: "On-chain", label: "Settlement proof" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-lg font-bold text-white dark:text-black tracking-tight">{s.value}</div>
                  <div className="text-[9px] uppercase tracking-wider text-white/35 dark:text-black/35 font-semibold">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Right: CTA */}
            <motion.div
              className="flex items-center gap-1.5 text-sm text-white/50 dark:text-black/50 font-medium group cursor-pointer flex-shrink-0 hover:text-white dark:hover:text-black transition-colors"
              whileHover={{ x: 4 }}
            >
              Learn how
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ProblemSection;
