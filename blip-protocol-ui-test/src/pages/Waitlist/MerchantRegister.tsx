import { motion } from "framer-motion";
import { Gift, HandCoins, Zap, Activity, Users, Wallet } from "lucide-react";
import { SEO } from "@/components";
import { HreflangTags } from "@/components/HreflangTags";
import Register from "./Register";

export default function MerchantRegister() {
  return (
    <>
      <SEO
        title="Register as Merchant | Blip Money"
        description="Register as a merchant on Blip Money. Get early access to the P2P merchant network, earn genesis token allocation, and enjoy zero settlement fees."
        canonical="https://blip.money/merchant-register"
      />
      <HreflangTags path="/merchant-register" />

      <div className=" bg-[#FAF8F5] dark:bg-black text-black dark:text-white overflow-hidden">
        <main className="relative z-10 max-w-7xl mx-auto px-6 pt-14 pb-24">
          <div className="max-w-7xl flex flex-col justify-center items-center mx-auto ">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-md mx-auto pt-24"
            >
              <div className="mb-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                  style={{
                    background: "rgba(255, 107, 53, 0.05)",
                    border: "1px solid rgba(255, 107, 53, 0.15)",
                  }}
                >
                  <span className="text-[11px] font-semibold text-gray-600 dark:text-white uppercase tracking-wider">
                    Merchant Registration
                  </span>
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-3">
                  Create Merchant Account
                </h2>
                <p className="text-black/50 dark:text-white/50">
                  Join the Blip P2P merchant network before public launch.
                </p>
              </div>
              <Register role="merchant" />
            </motion.div>

            <div className="mt-16 w-full max-w-5xl">
              <p className="text-center text-xs tracking-widest text-black/40 dark:text-white/50 mb-8">
                WHAT MERCHANTS GET
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    icon: Gift,
                    title: "Genesis Token Allocation",
                    desc: "Earn BLIP allocation for onboarding early and providing volume.",
                  },
                  {
                    icon: HandCoins,
                    title: "Zero Settlement Fees",
                    desc: "Early merchants receive reduced or zero fees during test phase.",
                  },
                  {
                    icon: Zap,
                    title: "Priority Routing",
                    desc: "Merchant nodes get faster matching + network priority.",
                  },
                  {
                    icon: Activity,
                    title: "Early App Access",
                    desc: "Test merchant dashboard before public launch.",
                  },
                  {
                    icon: Users,
                    title: "Governance Rights",
                    desc: "Vote on fees, routes, and network policies.",
                  },
                  {
                    icon: Wallet,
                    title: "Liquidity Rewards",
                    desc: "Earn rewards for committing settlement volume.",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-6 border border-black/10 dark:border-white/10 rounded-xl hover:border-black/20 dark:hover:border-white/20 transition"
                  >
                    <item.icon className="w-5 h-5 text-black/60 dark:text-white/50 mb-4" />
                    <h3 className="text-sm font-semibold text-black dark:text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-black/50 dark:text-white/50 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
