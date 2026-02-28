import { motion } from "framer-motion";
import {
  Globe,
  Coins,
  Gift,
  Eye,
  Store,
  Zap,
  ShieldOff,
  TrendingDown,
} from "lucide-react";

/* ============================================
   SECTION 6: USE CASES — Users vs Merchants
   ============================================ */

const userCases = [
  {
    icon: Globe,
    label: "Pay globally",
    desc: "Send money to anyone, anywhere — instantly.",
  },
  {
    icon: Coins,
    label: "Spend stablecoins",
    desc: "Use USDT like cash, without conversion friction.",
  },
  {
    icon: Gift,
    label: "Earn rewards",
    desc: "Cashback and points on every transaction.",
  },
  {
    icon: Eye,
    label: "Private by default",
    desc: "Non-custodial. Your keys, your funds, your data.",
  },
];

const merchantCases = [
  {
    icon: Store,
    label: "Accept global payments",
    desc: "Receive from any corridor without bank accounts.",
  },
  {
    icon: Zap,
    label: "Instant liquidity",
    desc: "Access on-demand liquidity matched to your trade.",
  },
  {
    icon: ShieldOff,
    label: "No chargebacks",
    desc: "Escrow-settled trades are final and irreversible.",
  },
  {
    icon: TrendingDown,
    label: "Lower fees",
    desc: "0.1% protocol fee vs 3–7% traditional rails.",
  },
];

const UseCasesSection = () => {
  return (
    <section className="relative py-24 md:py-40 bg-[#FAF8F5] dark:bg-black overflow-hidden">
      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent" />

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
              Use cases
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
          Built for everyone.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-base md:text-lg text-black/50 dark:text-white/40 font-medium max-w-lg mx-auto text-center leading-relaxed mb-20"
        >
          Whether you're sending value globally or running a merchant business,
          Blip is the network that makes it possible.
        </motion.p>

        {/* Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* For Users */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl sm:rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-white/60 dark:bg-white/[0.03] p-8 shadow-[0_4px_40px_-12px_rgba(0,0,0,0.08)] dark:shadow-none"
          >
            <div className="mb-6">
              <div className="text-[10px] uppercase tracking-[0.3em] text-black/30 dark:text-white/30 font-semibold mb-2">
                For Users
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-semibold text-black dark:text-white">
                Send & spend freely.
              </h3>
            </div>

            <div className="space-y-3">
              {userCases.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                    className="flex items-start gap-3.5 p-4 rounded-xl border border-black/[0.06] dark:border-white/[0.06] bg-white/40 dark:bg-white/[0.02] hover:border-black/[0.12] dark:hover:border-white/[0.1] transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-black/[0.04] dark:bg-white/[0.04] flex items-center justify-center flex-shrink-0 group-hover:bg-black/[0.07] dark:group-hover:bg-white/[0.07] transition-colors">
                      <Icon
                        className="w-4 h-4 text-black/50 dark:text-white/50"
                        strokeWidth={1.5}
                      />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-black dark:text-white mb-0.5">
                        {item.label}
                      </div>
                      <div className="text-xs text-black/40 dark:text-white/30 leading-relaxed">
                        {item.desc}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* For Merchants */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="
    rounded-2xl sm:rounded-3xl
    border border-white/10
    bg-white/5
    backdrop-blur-2xl
    text-white
    p-6 sm:p-8
    shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)]
  "
          >
            {/* Header */}
            <div className="mb-6">
              <div className="text-[10px] uppercase tracking-[0.3em] text-white/70 font-semibold mb-2">
                For Merchants
              </div>

              <h3 className="font-display text-2xl md:text-3xl font-semibold text-white">
                Scale without limits.
              </h3>
            </div>

            {/* Items */}
            <div className="space-y-3">
              {merchantCases.map((item, i) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                    className="
            flex items-start gap-3.5
            p-4
            rounded-xl
            border border-white/10
            bg-white/10
            hover:bg-white/15
            transition-all duration-300
            group
          "
                  >
                    {/* Icon */}
                    <div
                      className="
              w-9 h-9
              rounded-lg
              bg-white/15
              flex items-center justify-center
              flex-shrink-0
              group-hover:bg-white/25
              transition-colors
            "
                    >
                      <Icon className="w-4 h-4 text-white" strokeWidth={1.5} />
                    </div>

                    {/* Text */}
                    <div>
                      <div className="text-sm font-semibold text-white mb-0.5">
                        {item.label}
                      </div>

                      <div className="text-xs text-white/80 leading-relaxed">
                        {item.desc}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent" />
    </section>
  );
};

export default UseCasesSection;
