import { motion } from "framer-motion";
import { Lock, Shield, Zap, Globe, Wifi, Battery } from "lucide-react";

/* ============================================
   LOCKED & SECURED SECTION
   Escrow protection showcase with phone mockup
   ============================================ */

const LockedAndSecuredSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden py-16 sm:py-20 lg:py-0 ">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none ">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#050505] to-black" />
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
            <div className="relative w-10 h-10 rounded-lg border border-white/[0.08] flex items-center justify-center group hover:border-white/20 transition-colors">
              <Lock
                className="w-4 h-4 text-white/40 group-hover:text-[#ff6b35] transition-colors"
                strokeWidth={1.5}
              />
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-black border border-white/10 flex items-center justify-center">
                <span className="text-[10px] font-medium text-white/50">2</span>
              </div>
            </div>
            <span className="text-lg font-semibold text-white">Escrow</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 leading-[1.1] tracking-tight">
            Locked &
            <br />
            <span className="text-white/20">secured.</span>
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
          {/* Phone Frame */}
          <div className="relative w-[280px] sm:w-[300px] lg:w-[340px]">
            {/* Phone outer frame */}
            <div className="rounded-[36px] sm:rounded-[40px] lg:rounded-[44px] bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] p-[2px] shadow-[0_25px_50px_rgba(0,0,0,0.6)]">
              <div className="rounded-[34px] sm:rounded-[38px] lg:rounded-[42px] bg-[#0a0a0a] p-[10px] sm:p-[12px]">
                {/* Phone screen */}
                <div className="rounded-[28px] sm:rounded-[30px] lg:rounded-[34px] bg-black overflow-hidden relative h-[500px] sm:h-[550px] lg:h-[600px]">
                  {/* Dynamic Island */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
                    <div className="w-28 h-7 rounded-full bg-black flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-[#1a1a1a] mr-2" />
                    </div>
                  </div>

                  {/* Status bar */}
                  <div className="flex items-center justify-between px-6 pt-4 pb-2">
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
                  <div className="px-6 pb-8 pt-8 flex flex-col h-full">
                    {/* Lock icon */}
                    <div className="flex justify-center mb-8">
                      <div className="w-20 h-20 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
                        <Lock className="w-10 h-10 text-white/60" />
                      </div>
                    </div>

                    {/* Main text */}
                    <div className="text-center mb-8">
                      <div className="text-sm text-white/50 mb-2">
                        Funds Secured
                      </div>
                      <div className="text-3xl font-bold text-white mb-1">
                        5,000 USDT
                      </div>
                      <div className="text-xs text-white/40">≈ $5,000.00</div>
                    </div>

                    {/* Status card */}
                    <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-white/40">Status</span>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full " />
                          <span className="text-xs text-[#ff6b35] font-medium">
                            In Escrow
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-white/40">Contract</span>
                        <span className="text-sm text-white/60 font-mono">
                          0x7a2...f91
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/40">Network</span>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />
                          <span className="text-sm text-white/60">Solana</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1" />

                    {/* Static button */}
                    <div className="w-full py-3 rounded-full bg-white text-black font-bold text-base text-center">
                      Secured
                    </div>

                    {/* Home indicator */}
                    <div className="flex justify-center pt-4">
                      <div className="w-32 h-1 bg-white/30 rounded-full" />
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
            <div className="relative w-10 h-10 rounded-lg border border-white/[0.08] flex items-center justify-center group hover:border-white/20 transition-colors">
              <Lock
                className="w-4 h-4 text-white/40 group-hover:text-[#ff6b35] transition-colors"
                strokeWidth={1.5}
              />
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-black border border-white/10 flex items-center justify-center">
                <span className="text-[10px] font-medium text-white/50">2</span>
              </div>
            </div>
            <span className="text-lg font-semibold text-white">Escrow</span>
          </div>

          {/* Heading */}
          <h2 className="hidden lg:block text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 leading-[1.1] tracking-tight">
            Locked &
            <br />
            <span className="text-white/20">secured.</span>
          </h2>

          {/* Description */}
          <p className="text-white/50 text-base sm:text-lg mb-8 leading-relaxed max-w-sm mx-auto lg:mx-0">
            Funds locked in smart contract. Protected by DAO escrow. Your crypto
            stays safe until the transaction completes.
          </p>

          {/* Features */}
          <div className="space-y-3 max-w-sm mx-auto lg:mx-0">
            {[
              {
                icon: Shield,
                label: "Non-custodial",
                desc: "You control your keys",
              },
              {
                icon: Zap,
                label: "Instant lock",
                desc: "Sub-second confirmation",
              },
              {
                icon: Globe,
                label: "On-chain proof",
                desc: "Fully transparent",
              },
            ].map((feature) => (
              <motion.div
                key={feature.label}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-10 h-10 rounded-lg bg-white/[0.03] flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-white/40" />
                </div>
                <div>
                  <div className="text-white text-left text-sm font-medium">
                    {feature.label}
                  </div>
                  <div className="text-white/40 text-xs">{feature.desc}</div>
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
