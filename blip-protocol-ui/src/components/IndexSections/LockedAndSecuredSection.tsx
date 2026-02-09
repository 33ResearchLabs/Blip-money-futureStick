import { motion } from "framer-motion";
import { Lock, Shield, Zap, Globe, Wifi, Battery } from "lucide-react";
import { MicroIcon } from "@/components/visuals/MicroIcon";

/* ============================================
   LOCKED & SECURED SECTION
   Escrow protection showcase with phone mockup
   ============================================ */

const LockedAndSecuredSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-white dark:bg-black overflow-hidden py-16 sm:py-20 lg:py-0 ">
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

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 xl:gap-20 items-center">
        <div className="flex flex-col justify-center items-center lg:hidden">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="relative w-10 h-10 rounded-lg border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-center group hover:border-black/20 dark:hover:border-white/20 transition-colors">
              <Lock
                className="w-4 h-4 text-black/40 dark:text-white/40 group-hover:text-[#ff6b35] transition-colors"
                strokeWidth={1.5}
              />
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-black border border-black/10 dark:border-white/10 flex items-center justify-center">
                <span className="text-[10px] font-medium text-black/50 dark:text-white/50">2</span>
              </div>
            </div>
            <span className="text-lg font-semibold text-black dark:text-white">Escrow</span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-black dark:text-white mb-4 sm:mb-6 leading-[1.1] tracking-tight">
            Locked &
            <br />
            <span className="text-black/20 dark:text-white/20">secured.</span>
          </h2>
        </div>

        {/* Left: Static Phone Mockup */}
        <motion.div
          className="relative flex justify-center items-center"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Phone Frame - 30% smaller */}
          <div className="relative w-[196px] sm:w-[210px] lg:w-[238px]">
            {/* Phone outer frame */}
            <div className="rounded-[25px] sm:rounded-[28px] lg:rounded-[31px] bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] p-[2px] shadow-[0_18px_35px_rgba(0,0,0,0.6)]">
              <div className="rounded-[24px] sm:rounded-[27px] lg:rounded-[29px] bg-[#0a0a0a] p-[7px] sm:p-[8px]">
                {/* Phone screen */}
                <div className="rounded-[20px] sm:rounded-[21px] lg:rounded-[24px] bg-black overflow-hidden relative h-[350px] sm:h-[385px] lg:h-[420px]">
                  {/* Dynamic Island */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10">
                    <div className="w-20 h-5 rounded-full bg-black flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-[#1a1a1a] mr-1" />
                    </div>
                  </div>

                  {/* Status bar */}
                  <div className="flex items-center justify-between px-4 pt-3 pb-1">
                    <span className="text-[13px] text-white font-semibold">
                      9:41
                    </span>
                    <div className="flex items-center gap-1.5">
                      {/* Signal bars */}
                      <div className="flex items-end gap-[1px] h-3">
                        <div className="w-[3px] h-[40%] bg-white rounded-full opacity-60" />
                        <div className="w-[3px] h-[60%] bg-white rounded-full opacity-70" />
                        <div className="w-[3px] h-[80%] bg-white rounded-full opacity-80" />
                        <div className="w-[3px] h-[100%] bg-white rounded-full" />
                      </div>
                      <Wifi
                        className="w-3.5 h-3.5 text-white"
                        strokeWidth={2.5}
                      />
                      <Battery
                        className="w-6 h-3.5 text-white"
                        strokeWidth={2.5}
                      />
                    </div>
                  </div>

                  {/* Screen Content */}
                  <div className="px-4 pb-6 pt-6 flex flex-col h-full">
                    {/* Lock icon with pulse/glow effect */}
                    <div className="flex justify-center mb-6">
                      <motion.div
                        className="relative w-14 h-14 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center"
                        animate={{
                          boxShadow: [
                            "0 0 0 0 rgba(255, 107, 53, 0)",
                            "0 0 20px 4px rgba(255, 107, 53, 0.15)",
                            "0 0 0 0 rgba(255, 107, 53, 0)",
                          ],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <motion.div
                          animate={{
                            scale: [1, 1.05, 1],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <Lock className="w-7 h-7 text-white/60" />
                        </motion.div>
                      </motion.div>
                    </div>

                    {/* Main text */}
                    <div className="text-center mb-6">
                      <div className="text-xs text-white/50 mb-1">
                        Funds Secured
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">
                        5,000 USDT
                      </div>
                      <div className="text-[10px] text-white/40">≈ $5,000.00</div>
                    </div>

                    {/* Status card */}
                    <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-3 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] text-white/40">Status</span>
                        <div className="flex items-center gap-1.5">
                          <div className="w-1 h-1 rounded-full bg-[#ff6b35]" />
                          <span className="text-[10px] text-white/40 font-medium">
                            In Escrow
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-white/40">Contract</span>
                        <span className="text-xs text-white/60 font-mono">
                          0x7a2...f91
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/40">Network</span>
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-white/20" />
                          <span className="text-xs text-white/60">Solana</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1" />

                    {/* Static button */}
                    <div className="w-full py-2 rounded-full bg-white text-black font-bold text-sm text-center">
                      Secured
                    </div>

                    {/* Home indicator */}
                    <div className="flex justify-center pt-3">
                      <div className="w-24 h-0.5 bg-white/30 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: Text content */}
        <motion.div
          className="text-center lg:text-left"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Step indicator */}
          <div className="hidden lg:inline-flex items-center gap-3 mb-6">
            <div className="relative w-10 h-10 rounded-lg border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-center group hover:border-black/20 dark:hover:border-white/20 transition-colors">
              <Lock
                className="w-4 h-4 text-black/40 dark:text-white/40 group-hover:text-[#ff6b35] transition-colors"
                strokeWidth={1.5}
              />
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-black border border-black/10 dark:border-white/10 flex items-center justify-center">
                <span className="text-[10px] font-medium text-black/50 dark:text-white/50">2</span>
              </div>
            </div>
            <span className="text-lg font-semibold text-black dark:text-white">Escrow</span>
          </div>

          {/* Heading */}
          <h2 className="hidden lg:block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-black dark:text-white mb-6 sm:mb-8 leading-[1.1] tracking-tight">
            Locked &
            <br />
            <span className="text-black/20 dark:text-white/20">secured.</span>
          </h2>

          {/* Description */}
          <p className="text-black/50 dark:text-white/50 text-lg sm:text-xl lg:text-2xl mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
            Funds locked in smart contract. Protected by DAO escrow. Your crypto
            stays safe until the transaction completes.
          </p>

          {/* Features */}
          <div className="space-y-4 max-w-xl mx-auto lg:mx-0">
            {[
              {
                icon: Zap,
                label: "Instant lock",
                desc: "Sub-second confirmation",
                variant: "pulse" as const,
              },
              {
                icon: Globe,
                label: "On-chain proof",
                desc: "Fully transparent",
                variant: "spin" as const,
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.label}
                className="flex items-center gap-4 p-5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.04] hover:border-black/[0.08] dark:hover:border-white/[0.08] transition-colors"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-14 h-14 rounded-lg bg-black/[0.03] dark:bg-white/[0.03] flex items-center justify-center">
                  <MicroIcon
                    icon={feature.icon}
                    variant={feature.variant}
                    size={28}
                    delay={index * 0.3}
                  />
                </div>
                <div>
                  <div className="text-black dark:text-white text-left text-lg font-medium">
                    {feature.label}
                  </div>
                  <div className="text-black/40 dark:text-white/40 text-base">{feature.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LockedAndSecuredSection;
