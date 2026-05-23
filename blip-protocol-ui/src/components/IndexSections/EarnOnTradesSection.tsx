import { memo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { IllustrationCard } from "./sceneArt";

const EASE = [0.16, 1, 0.3, 1] as const;

const TRADES = [
  { id: "TX-8421", pair: "USD → INR", vol: "$2,400", earn: "$84.00", pct: "3.5%" },
  { id: "TX-8420", pair: "EUR → PHP", vol: "$1,150", earn: "$57.50", pct: "5.0%" },
  { id: "TX-8419", pair: "USD → NGN", vol: "$3,800", earn: "$190.00", pct: "5.0%" },
];

function EarningsArt() {
  return (
    <div className="relative w-full max-w-[560px] mx-auto" style={{ aspectRatio: "5 / 6" }}>
      <div
        className="absolute -inset-10 rounded-[60px] blur-3xl opacity-55"
        style={{
          background:
            "radial-gradient(60% 50% at 60% 40%, rgba(204,120,92,0.2), transparent 70%)",
        }}
      />

      {/* Big earnings card — dark, hero foreground */}
      <motion.div
        initial={{ opacity: 0, y: 24, rotate: -3 }}
        whileInView={{ opacity: 1, y: 0, rotate: -2 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 1.1, ease: EASE }}
        className="absolute left-1/2 top-1/2 w-[340px] md:w-[400px] rounded-[28px] bg-[#0d0a08] border border-white/[0.06] overflow-hidden"
        style={{
          transform: "translate(-50%, -55%) rotate(-2deg)",
          boxShadow:
            "0 70px 140px -30px rgba(80,40,20,0.4), 0 30px 60px -15px rgba(0,0,0,0.3)",
        }}
      >
        <div className="p-7">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[10px] tracking-[0.32em] uppercase text-white/45 font-bold">
              Today's Earnings
            </div>
            <TrendingUp className="w-3.5 h-3.5 text-[#cc785c]" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
            className="flex items-baseline gap-2 mb-1"
          >
            <span className="text-[52px] md:text-[60px] font-semibold tracking-[-0.035em] tabular-nums text-white leading-none">
              $331
            </span>
            <span className="text-[26px] font-semibold text-white/55 tabular-nums">.50</span>
            <span className="text-[14px] font-mono text-[#cc785c] ml-2">+12.4%</span>
          </motion.div>
          <div className="text-[11.5px] text-white/45 font-mono">
            from 7 fulfilled trades · 4h
          </div>

          {/* Sparkline */}
          <svg viewBox="0 0 200 50" className="w-full h-14 mt-4">
            <defs>
              <linearGradient id="spark-fill-2" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#cc785c" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#cc785c" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              d="M 0 38 L 25 32 L 50 35 L 75 26 L 100 28 L 125 18 L 150 22 L 175 10 L 200 14 L 200 50 L 0 50 Z"
              fill="url(#spark-fill-2)"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.3 }}
            />
            <motion.path
              d="M 0 38 L 25 32 L 50 35 L 75 26 L 100 28 L 125 18 L 150 22 L 175 10 L 200 14"
              fill="none"
              stroke="#cc785c"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease: EASE }}
            />
          </svg>

          <div className="space-y-2 mt-5 pt-5 border-t border-white/[0.06]">
            {TRADES.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                className="flex items-center justify-between text-[11.5px]"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-white/35">{t.id}</span>
                  <span className="text-white/80 font-medium">{t.pair}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-white/45 tabular-nums">{t.vol}</span>
                  <span className="font-mono text-[#cc785c] font-semibold tabular-nums">
                    +{t.earn}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Floating "up to 10%" badge */}
      <motion.div
        initial={{ opacity: 0, y: 12, x: -8 }}
        whileInView={{ opacity: 1, y: 0, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 1.5, ease: EASE }}
        className="absolute -top-2 -left-2 md:-left-6 bg-white rounded-2xl px-4 py-2.5 border border-black/[0.05]"
        style={{
          boxShadow: "0 30px 70px -20px rgba(80,40,20,0.28), 0 10px 24px -8px rgba(0,0,0,0.12)",
          transform: "rotate(-6deg)",
        }}
      >
        <div className="text-[9px] uppercase tracking-[0.24em] text-black/45 font-bold">
          Up to
        </div>
        <div className="text-[22px] font-semibold text-[#cc785c] tracking-tight leading-none">
          10%
        </div>
        <div className="text-[10px] text-black/55 font-medium">per trade</div>
      </motion.div>

      {/* Floating withdraw chip */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 1.7, ease: EASE }}
        className="absolute bottom-2 right-0 md:-right-4 bg-black text-white rounded-full px-4 py-2 flex items-center gap-2"
        style={{
          boxShadow: "0 24px 50px -16px rgba(0,0,0,0.4)",
          transform: "rotate(3deg)",
        }}
      >
        <span className="text-[10px] font-mono text-[#cc785c]">●</span>
        <span className="text-[11px] font-medium tracking-tight">
          Withdraw anytime · 0 fees
        </span>
      </motion.div>
    </div>
  );
}

const EarnOnTradesSection = memo(function EarnOnTradesSection() {
  return (
    <section
      className="relative text-black pt-10 md:pt-16 pb-16 md:pb-32 overflow-hidden"
      style={{ background: "#FAF8F5" }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4] mix-blend-multiply"
        style={{
          background:
            "radial-gradient(70% 60% at 100% 50%, rgba(204,120,92,0.08), transparent 60%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-14 md:gap-20 items-center">
        {/* Text LEFT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1, ease: EASE }}
        >
          <h2
            className="font-display leading-[1.02] mb-6"
            style={{
              fontSize: "clamp(2.8rem, 5.4vw, 4.4rem)",
              fontWeight: 500,
              letterSpacing: "-0.035em",
            }}
          >
            Earn up to 10%{" "}
            <span style={{ fontStyle: "italic", fontFamily: "ui-serif, Georgia, serif" }}>
              on every trade.
            </span>
          </h2>
          <p className="text-[18px] md:text-[19px] leading-[1.55] opacity-70 max-w-[480px] mb-9">
            Liquidity providers and merchants earn real yield by routing real orders.
            No emissions, no farming.
          </p>
          <Link
            to="/merchant"
            className="inline-flex items-center justify-center self-start gap-1.5 px-6 h-12 rounded-full bg-black text-white text-[14px] font-semibold tracking-tight transition-transform hover:-translate-y-[1px]"
          >
            Start earning <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Visual RIGHT */}
        <div>
          <IllustrationCard>
            <img
              src="/illustrations/earn-trade-card.png"
              alt="Sleeping woman with her capital flowing out as a golden stream to global cities earning +10%"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </IllustrationCard>
        </div>
      </div>
    </section>
  );
});

export default EarnOnTradesSection;
