import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/* ============================================
   SECTION 4: THE PROBLEM - Interactive Timeline
   ============================================ */

const ProblemSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const problems = [
    {
      year: "2024",
      title: "High Fees",
      desc: "Banks charge 3-7% on international transfers.",
      stat: "~$48B",
      statLabel: "Lost to fees annually",
    },
    {
      year: "2025",
      title: "Slow Settlement",
      desc: "SWIFT takes 2-5 business days.",
      stat: "3-5 days",
      statLabel: "Average settlement",
    },
    {
      year: "2026",
      title: "No Privacy",
      desc: "Every transaction tracked, reported, and stored.",
      stat: "100%",
      statLabel: "Transactions monitored",
    },
    {
      year: "Now",
      title: "Enter Blip",
      desc: "Sub-second settlement. 0.1% fees. Full privacy.",
      stat: "~2s",
      statLabel: "Settlement time",
      highlight: true,
    },
  ];

  return (
    <section
      ref={containerRef}
      className="relative py-12 md:py-40 bg-[#FAF8F5] dark:bg-black overflow-hidden"
    >
      {/* Subtle background gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-black/[0.02] dark:bg-white/[0.02] blur-[120px]" />
      </div>

      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-6"
        style={{ opacity }}
      >
        {/* Header - Centered focus headline */}
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-black dark:text-white tracking-tight leading-[1.05] mb-6"
          >
            Global payments
            <br />
            <span className="text-black dark:text-white/20">are broken.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl md:text-2xl text-black dark:text-white/40 font-medium max-w-xl mx-auto"
          >
            The traditional financial system was built for a different era. It's
            time for something better.
          </motion.p>
        </div>

        {/* Interactive Timeline */}
        <div className="relative">
          {/* Central timeline line - static background */}
          <div className="absolute left-8 md:left-[46.5%] md:-translate-x-px top-0 bottom-0 w-[2px] bg-gradient-to-b from-black/[0.06] via-black/20 to-black/[0.06] dark:from-white/[0.06] dark:via-white/20 dark:to-white/[0.06]" />

          {/* Moving line following from top to bottom */}
          <motion.div
            className="absolute left-8 md:left-[46.5%]  md:-translate-x-px w-1 h-12 rounded-full bg-gradient-to-b from-transparent via-black/40 to-transparent dark:via-white/60 shadow-[0_0_20px_rgba(0,0,0,0.2)] dark:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
            initial={{ top: "-50px" }}
            animate={{ top: "100%" }}
            transition={{
              duration: 6, // ✅ very slow & smooth
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Timeline items */}
          <div className="space-y-12 md:space-y-0">
            {problems.map((problem, i) => (
              <motion.div
                key={problem.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  delay: 0.2 + i * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`relative md:grid md:grid-cols-2 md:gap-12 ${i % 2 === 0 ? "" : "md:direction-rtl"}`}
              >
                {/* Timeline dot */}
                <div
                  className={`absolute left-8 md:left-[46.5%]  -translate-x-1/2 top-6 z-10`}
                >
                  <motion.div
                    className={`w-4 h-4 rounded-full border-2 ${problem.highlight ? "bg-black dark:bg-white border-black dark:border-white" : "bg-[#FAF8F5] dark:bg-black border-black/20 dark:border-white/20"}`}
                    whileInView={
                      problem.highlight
                        ? {
                            boxShadow: [
                              "0 0 0 0 rgba(0,0,0,0)",
                              "0 0 20px 4px rgba(0,0,0,0.15)",
                              "0 0 0 0 rgba(0,0,0,0)",
                            ],
                          }
                        : {}
                    }
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>

                {/* Content card */}
                <div
                  className={`ml-20 md:ml-0 ${i % 2 === 0 ? "md:text-right md:pr-16" : "md:col-start-2 md:pl-16 md:text-left"}`}
                >
                  <div
                    className={`w-full max-w-[380px] p-6 rounded-2xl border backdrop-blur-xl ${problem.highlight ? "bg-white/70 dark:bg-white/[0.06] border-black dark:border-white shadow-[0_8px_40px_-8px_rgba(0,0,0,0.12)] dark:shadow-none" : "bg-white/60 dark:bg-white/[0.03] border-black/[0.08] dark:border-white/[0.06] shadow-[0_4px_30px_-8px_rgba(0,0,0,0.08)] dark:shadow-none"}`}
                  >
                    <div
                      className={`text-[10px] uppercase tracking-[0.3em] ${problem.highlight ? "text-black dark:text-white/60" : "text-black dark:text-white/40"} font-semibold mb-2`}
                    >
                      {problem.year}
                    </div>
                    <h3
                      className={`text-xl md:text-2xl font-semibold ${problem.highlight ? "text-black dark:text-white" : "text-black dark:text-white"} mb-2`}
                    >
                      {problem.title}
                    </h3>
                    <p className="text-base md:text-lg text-black dark:text-white/50 font-medium mb-4 leading-relaxed max-w-sm">
                      {problem.desc}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span
                        className={`text-2xl font-bold ${problem.highlight ? "text-black dark:text-white" : "text-black dark:text-white"}`}
                      >
                        {problem.stat}
                      </span>
                      <span className="text-xs text-black dark:text-white/30 font-medium">
                        {problem.statLabel}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ProblemSection;
