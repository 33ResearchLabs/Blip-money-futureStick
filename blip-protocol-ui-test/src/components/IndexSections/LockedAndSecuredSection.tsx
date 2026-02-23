import { motion } from "framer-motion";
import { Lock, Shield, Zap, Globe, Check } from "lucide-react";
import { MicroIcon } from "@/components/visuals/MicroIcon";

/* ============================================
   LOCKED & SECURED SECTION
   Escrow protection showcase with floating card
   ============================================ */

const LockedAndSecuredSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[#FAF8F5] dark:bg-black overflow-hidden py-16 sm:py-20 lg:py-0 ">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none ">
        <div className="absolute inset-0 bg-gradient-to-b from-white dark:from-black via-[#fafafa] dark:via-[#050505] to-white dark:to-black" />
        <motion.div
          className="absolute top-[20%] right-[10%] w-[400px] h-[400px] rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(255,107,53,0.1) 0%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6">
        {/* Mobile heading - shown only on mobile */}
        <div className="flex flex-col justify-center items-center lg:hidden mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="relative w-8 h-8 rounded-lg border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-center group hover:border-black/20 dark:hover:border-white/20 transition-colors">
              <Lock
                className="w-3.5 h-3.5 text-black dark:text-white/40 dark:hover:text-white transition-colors"
                strokeWidth={1.5}
              />
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FAF8F5] dark:bg-black border border-black/10 dark:border-white/10 flex items-center justify-center">
                <span className="text-[8px] font-medium text-black dark:text-white/50">
                  2
                </span>
              </div>
            </div>
            <span className="text-sm font-semibold text-black dark:text-white">
              Protection
            </span>
          </div>

          {/* Heading */}
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-black dark:text-white mb-4 leading-[1.1] tracking-tight text-center">
            Locked &
            <br />
            <span className="text-black/70 dark:text-white/50 relative inline-block">
              <span className="relative z-10">secured.</span>
            </span>
          </h2>
        </div>

        {/* Desktop centered heading - shown only on desktop */}
        <motion.div
          className="hidden lg:flex flex-col items-center text-center mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Step indicator */}
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="relative w-8 h-8 rounded-lg border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-center group hover:border-black/20 dark:hover:border-white/20 transition-colors">
              <Lock
                className="w-3.5 h-3.5 text-black dark:text-white/40 group-hover:text-black/60 group-hover:dark:text-white/60 transition-colors"
                strokeWidth={1.5}
              />
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FAF8F5] dark:bg-black border border-black/10 dark:border-white/10 flex items-center justify-center">
                <span className="text-[8px] font-medium text-black dark:text-white/50">
                  2
                </span>
              </div>
            </div>
            <span className="text-sm font-semibold text-black dark:text-white">
              Protection
            </span>
          </div>

          {/* Heading */}
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-black dark:text-white leading-[1.1] tracking-tight">
            Locked &{" "}
            <span className="text-black/70 dark:text-white/50 relative inline-block">
              <span className="relative z-10">secured.</span>
              {/* <motion.span
                className="absolute -bottom-1 left-0 right-0 h-[1.5px] rounded-full bg-gradient-to-r from-[#ff6b35]/60 via-[#ff8f5e]/50 to-[#ff6b35]/20"
                initial={{ scaleX: 0, originX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 1.2,
                  delay: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
              /> */}
            </span>
          </h2>
        </motion.div>

        {/* Two column layout for card and content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 xl:gap-20 items-center">

        {/* Left: Floating Escrow Card */}
        <motion.div
          className="relative flex justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Ambient glow behind card */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              className="w-[320px] h-[320px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(0,0,0,0.04) 0%, transparent 70%)",
              }}
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <div className="relative w-full max-w-[380px]">
            {/* Main card */}
            <motion.div
              className="rounded-2xl sm:rounded-3xl overflow-hidden border border-black/[0.08] dark:border-white/[0.08] bg-white/80 dark:bg-white/[0.04]  shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1),0_4px_20px_-5px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              {/* Card header */}
              <div className="px-6 pt-6 pb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="relative w-10 h-10 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] flex items-center justify-center"
                    animate={{
                      boxShadow: [
                        "0 0 0 0 rgba(0, 0, 0, 0)",
                        "0 0 20px 4px rgba(0, 0, 0, 0.04)",
                        "0 0 0 0 rgba(0, 0, 0, 0)",
                      ],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Shield
                      className="w-5 h-5 text-black/60 dark:text-white/60"
                      strokeWidth={1.5}
                    />
                    <motion.div
                      className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: 0.8,
                        type: "spring",
                        stiffness: 300,
                      }}
                    >
                      <Check
                        className="w-2.5 h-2.5 text-white"
                        strokeWidth={3}
                      />
                    </motion.div>
                  </motion.div>
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.3em] text-black/70 dark:text-white/30 font-semibold">
                      Escrow Active
                    </div>
                    <div className="text-sm font-semibold text-black dark:text-white">
                      Funds Secured
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-emerald-500"
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                    Live
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="mx-6 h-px bg-black/[0.06] dark:bg-white/[0.06]" />

              {/* Amount */}
              <div className="px-6 py-5 text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-black dark:text-white tracking-tight">
                  5,000 USDT
                </div>
                <div className="text-xs text-black/70 dark:text-white/30 mt-1">
                  ≈ $5,000.00
                </div>
              </div>

              {/* Progress */}
              <div className="px-6 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-wider text-black/80 dark:text-white/25">
                    Escrow Progress
                  </span>
                  <span className="text-[12px] text-black/60 dark:text-white/50 font-medium">
                    75%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-black dark:bg-white"
                    initial={{ width: "0%" }}
                    whileInView={{ width: "75%" }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1.5,
                      delay: 0.5,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="mx-6 h-px bg-black/[0.06] dark:bg-white/[0.06]" />

              {/* Details */}
              <div className="px-6 py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-black/80 dark:text-white/30">
                    Status
                  </span>
                  <div className="flex items-center gap-1.5">
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-xs text-black/80 dark:text-white/60 font-medium">
                      In Escrow
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-black/80 dark:text-white/30">
                    Contract
                  </span>
                  <span className="text-xs text-black/80 dark:text-white/40 font-mono">
                    0x7a2...f91
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-black/80 dark:text-white/30">
                    Network
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#9945FF] to-[#14F195]" />
                    <span className="text-xs text-black/80 dark:text-white/40">
                      Solana
                    </span>
                  </div>
                </div>
              </div>

              {/* Button */}
              <div className="px-6 pb-6 pt-2">
                <div className="w-full py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black font-semibold text-sm text-center">
                  Secured
                </div>
              </div>
            </motion.div>

            {/* Floating mini card - top right */}
            <motion.div
              className="absolute -top-8 -right-2 sm:-top-6 sm:-right-8 rounded-xl border border-black/[0.06] dark:border-white/[0.08] bg-white/90 dark:bg-white/[0.06]  shadow-[0_8px_30px_-8px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.3)] px-4 py-3"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
                  <Check
                    className="w-3 h-3 text-emerald-600 dark:text-emerald-400"
                    strokeWidth={2.5}
                  />
                </div>
                <div>
                  <div className="text-[10px] text-black/80 dark:text-white/30">
                    Verified
                  </div>
                  <div className="text-xs font-semibold text-black dark:text-white">
                    On-chain
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating mini card - bottom left */}
            <motion.div
              className="absolute -bottom-6 -left-3 sm:-bottom-5 sm:-left-6 rounded-xl border border-black/[0.06] dark:border-white/[0.08] bg-white/90 dark:bg-white/[0.06]  shadow-[0_8px_30px_-8px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.3)] px-4 py-3"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-black/[0.04] dark:bg-white/10 flex items-center justify-center">
                  <Lock
                    className="w-3 h-3 text-black/60 dark:text-white/60"
                    strokeWidth={2}
                  />
                </div>
                <div>
                  <div className="text-[10px] text-black/80 dark:text-white/30">
                    Smart Contract
                  </div>
                  <div className="text-xs font-semibold text-black dark:text-white">
                    Protected
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

          {/* Right: Text content */}
          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Description */}
            <p className="text-base md:text-lg lg:text-xl text-black/60 dark:text-white/50 font-medium mb-8 leading-relaxed max-w-md mx-auto lg:mx-0">
            Your funds are held in a secure on-chain escrow. Neither party can
            touch them until the trade is complete.
          </p>

          {/* Features */}
          <div className="space-y-3 max-w-md mx-auto lg:mx-0">
            {[
              {
                icon: Shield,
                label: "Escrow protection",
                desc: "Funds held safely until complete",
                variant: "pulse" as const,
              },
              {
                icon: Zap,
                label: "Instant lock",
                desc: "Secured in under a second",
                variant: "pulse" as const,
              },
              {
                icon: Globe,
                label: "Fully verifiable",
                desc: "Every step recorded on-chain",
                variant: "spin" as const,
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.label}
                className="flex items-center gap-3.5 p-4 rounded-xl bg-white/60 dark:bg-white/[0.03]  border border-black/[0.06] dark:border-white/[0.06] shadow-[0_2px_20px_-6px_rgba(0,0,0,0.06)] dark:shadow-none hover:border-black/[0.12] dark:hover:border-white/[0.1] transition-all duration-300"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                whileHover={{ x: 4 }}
              >
                <div className="w-10 h-10 rounded-lg bg-black/[0.03] dark:bg-white/[0.04] flex items-center justify-center flex-shrink-0">
                  <MicroIcon
                    icon={feature.icon}
                    variant={feature.variant}
                    size={20}
                    delay={index * 0.3}
                  />
                </div>
                <div>
                  <div className="text-black dark:text-white text-left text-sm font-medium">
                    {feature.label}
                  </div>
                  <div className="text-black dark:text-white/30 text-xs">
                    {feature.desc}   
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LockedAndSecuredSection;
