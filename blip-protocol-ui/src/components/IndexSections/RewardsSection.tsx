import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

/* ============================================
   SECTION 11: REWARDS - Minimal black/white
   ============================================ */

const RewardsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const rewards = [
    { value: "2.5%", label: "Cashback", desc: "On every payment" },
    { value: "10x", label: "Early Bonus", desc: "For first 1000 users" },
    { value: "20M", label: "Pool", desc: "Total BLIP rewards" },
  ];

  return (
    <section
      ref={containerRef}
      className="relative py-20 sm:py-28 md:py-32 lg:py-40 bg-black overflow-hidden"
    >
      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6"
        style={{ opacity }}
      >
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8"
          >
            <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-white/20" />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] sm:tracking-[0.4em] text-white/30 font-light">
              Rewards
            </span>
            <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-white/20" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight leading-[1.1] mb-4 sm:mb-6"
          >
            Earn while you spend.
            <br />
            <span className="text-white/20">Every transaction.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm sm:text-base md:text-lg text-white/40 max-w-xl mx-auto leading-relaxed"
          >
            Up to 2.5% back in BLIP tokens on every payment. Early supporters
            unlock multipliers and exclusive airdrops.
          </motion.p>
        </div>

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-3 gap-px bg-white/[0.03] rounded-xl sm:rounded-2xl overflow-hidden mb-12 sm:mb-16"
        >
          {rewards.map((reward) => (
            <div
              key={reward.label}
              className="bg-black p-6 sm:p-8 md:p-10 text-center"
            >
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                {reward.value}
              </div>
              <div className="text-xs sm:text-sm text-white/50 mb-1">
                {reward.label}
              </div>
              <div className="text-[10px] sm:text-xs text-white/25 hidden sm:block">
                {reward.desc}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Single CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <Link
            to="/rewards"
            className="group inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-white text-black text-sm sm:text-base font-semibold hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all duration-300"
          >
            <span>View Rewards</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default RewardsSection;
