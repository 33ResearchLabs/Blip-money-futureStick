import { motion } from "framer-motion";
import { ShieldCheck, Zap } from "lucide-react";
export const Comparison = () => (
  <section className="py-16 sm:py-20 md:py-24 bg-[#050505] border-y border-white/5">
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            Built for <span className="text-[#2BFF88]">Speed</span>
          </h2>
          <p className="text-gray-400 mb-6 sm:mb-8 text-base sm:text-lg">
            Banks sleep. Blockchain doesn't. Blip abstracts the complexity of
            crypto to deliver settlement speeds that feel like magic.
          </p>

          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#2BFF88]/10 flex items-center justify-center text-[#2BFF88] flex-shrink-0">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm sm:text-base">
                  400ms Settlement
                </h4>
                <p className="text-xs sm:text-sm text-gray-500">
                  Solana mainnet finality
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FFD43B]/10 flex items-center justify-center text-[#FFD43B] flex-shrink-0">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm sm:text-base">
                  Non-Custodial
                </h4>
                <p className="text-xs sm:text-sm text-gray-500">
                  Smart contract escrow
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#0A0A0A] p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/5 relative overflow-hidden mt-8 lg:mt-0">
          <h3 className="text-white font-bold mb-6 sm:mb-8 text-base sm:text-lg">
            Speed Comparison
          </h3>

          <div className="space-y-5 sm:space-y-6">
            <div>
              <div className="flex justify-between text-xs sm:text-sm text-gray-400 mb-2">
                <span className="text-white font-medium flex items-center gap-1.5 sm:gap-2">
                  Blip{" "}
                  <Zap className="w-3 h-3 sm:w-[12px] sm:h-[12px] text-[#2BFF88]" />
                </span>
                <span className="text-[#2BFF88]">~0.4s</span>
              </div>
              <div className="h-3 sm:h-4 bg-white/5 rounded-full overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="absolute top-0 left-0 h-full bg-[#2BFF88] shadow-[0_0_10px_#2BFF88]"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs sm:text-sm text-gray-400 mb-2">
                <span>Remittance Apps</span>
                <span className="text-xs sm:text-sm">1-2 Hours</span>
              </div>
              <div className="h-3 sm:h-4 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "60%" }}
                  transition={{ duration: 1.5, delay: 0.4 }}
                  className="h-full bg-white/20"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs sm:text-sm text-gray-400 mb-2">
                <span>Banks (SWIFT)</span>
                <span className="text-xs sm:text-sm">2-5 Days</span>
              </div>
              <div className="h-3 sm:h-4 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "15%" }}
                  transition={{ duration: 2, delay: 0.6 }}
                  className="h-full bg-white/10"
                />
              </div>
            </div>
          </div>

          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />
        </div>
      </div>
    </div>
  </section>
);
