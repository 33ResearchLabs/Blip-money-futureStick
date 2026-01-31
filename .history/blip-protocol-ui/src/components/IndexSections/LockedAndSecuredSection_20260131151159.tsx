import { motion } from "framer-motion";
import { Lock, Shield, Zap, Globe } from "lucide-react";
import LockedAndSecuredMockup from "@/components/Hero/LockedAndSecuredMockup";

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
        <div className="flex flex-col justify-center items-center xl:hidden">
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

        {/* Left: Phone Mockup */}
        <motion.div
          className="relative flex justify-center"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <LockedAndSecuredMockup />
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
          <div className="hidden sm:inline-flex items-center gap-3 mb-6">
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
          <h2 className="hidden sm:block text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 leading-[1.1] tracking-tight">
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
