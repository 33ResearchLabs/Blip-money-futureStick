import { motion } from "framer-motion";
import { Shield, CheckCircle2, FileText, Map, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

/* ============================================
   SECTION 10: TRUST & ARCHITECTURE
   Security, audits, whitepaper, roadmap — futuristic
   ============================================ */

const trustCards = [
  {
    icon: Shield,
    title: "Non-custodial",
    desc: "Funds never touch Blip servers. You hold the keys. Smart contracts enforce every step.",
    tag: "Security",
    accent: "rgba(255,107,53,0.12)",
    accentBorder: "rgba(255,107,53,0.2)",
  },
  {
    icon: CheckCircle2,
    title: "On-chain settlement",
    desc: "Every trade is verifiable on-chain. No hidden clearing. No trust required.",
    tag: "Transparency",
    accent: "rgba(0,229,153,0.08)",
    accentBorder: "rgba(0,229,153,0.2)",
  },
  {
    icon: FileText,
    title: "Whitepaper",
    desc: "Full protocol documentation — escrow mechanics, reputation scoring, liquidity auctions.",
    tag: "Documentation",
    link: "/whitepaper",
    linkLabel: "Read whitepaper →",
    accent: "rgba(120,119,255,0.08)",
    accentBorder: "rgba(120,119,255,0.2)",
  },
  {
    icon: Map,
    title: "Roadmap",
    desc: "Q2 2025 Dubai beta · Q3 Global expansion · Q4 DAO governance · 2026 Open protocol.",
    tag: "Milestones",
    accent: "rgba(255,107,53,0.08)",
    accentBorder: "rgba(255,107,53,0.15)",
  },
];

const TrustSection = () => {
  return (
    <section className="relative py-24 md:py-40 bg-[#FAF8F5] dark:bg-black overflow-hidden">
      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent" />

      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-[30%] left-[10%] w-[400px] h-[400px] rounded-full opacity-[0.04] dark:opacity-[0.06]"
          style={{ background: "radial-gradient(circle, rgba(255,107,53,0.8) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[20%] right-[10%] w-[350px] h-[350px] rounded-full opacity-[0.04] dark:opacity-[0.06]"
          style={{ background: "radial-gradient(circle, rgba(0,229,153,0.6) 0%, transparent 70%)" }}
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-black/[0.08] dark:border-white/[0.08] bg-white/60 dark:bg-white/[0.03]">
            <span className="text-[10px] uppercase tracking-[0.25em] text-black/50 dark:text-white/40 font-semibold">
              Architecture
            </span>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-black dark:text-white tracking-tight leading-[1.05] text-center mb-6"
        >
          Built to last.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-base md:text-lg text-black/50 dark:text-white/40 font-medium max-w-lg mx-auto text-center leading-relaxed mb-16"
        >
          Blip is infrastructure, not a product. Designed to operate without trust — verified by code, secured by escrow, governed by reputation.
        </motion.p>

        {/* 2×2 grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {trustCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="relative p-7 rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white/60 dark:bg-white/[0.03] shadow-[0_4px_30px_-8px_rgba(0,0,0,0.06)] dark:shadow-none overflow-hidden group hover:border-black/[0.14] dark:hover:border-white/[0.1] transition-all duration-300"
              >
                {/* Hover accent glow */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                  style={{ background: `radial-gradient(circle at 30% 30%, ${card.accent}, transparent 60%)` }}
                />

                <div className="relative">
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
                      style={{ background: "rgba(0,0,0,0.04)" }}
                    >
                      <Icon className="w-5 h-5 text-black/50 dark:text-white/50" strokeWidth={1.5} />
                    </div>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-black/30 dark:text-white/25 font-semibold border border-black/[0.08] dark:border-white/[0.08] px-2 py-0.5 rounded-full">
                      {card.tag}
                    </span>
                  </div>

                  <h3 className="text-lg md:text-xl font-semibold text-black dark:text-white mb-2">
                    {card.title}
                  </h3>
                  <p className="text-sm text-black/50 dark:text-white/40 leading-relaxed mb-3">
                    {card.desc}
                  </p>

                  {card.link && (
                    <Link
                      to={card.link}
                      className="inline-flex items-center gap-1.5 text-xs text-black/50 dark:text-white/40 font-medium hover:text-black dark:hover:text-white transition-colors"
                    >
                      {card.linkLabel}
                    </Link>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center"
        >
          <Link
            to="/whitepaper"
            className="inline-flex items-center gap-2 text-sm text-black/50 dark:text-white/40 font-medium hover:text-black dark:hover:text-white transition-colors border border-black/[0.08] dark:border-white/[0.08] px-5 py-2.5 rounded-full hover:border-black/20 dark:hover:border-white/20"
          >
            Read the whitepaper
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent" />
    </section>
  );
};

export default TrustSection;
