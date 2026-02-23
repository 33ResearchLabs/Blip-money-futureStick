import { Gift, HandCoins, Zap, Activity, Users, Wallet } from "lucide-react";
import { SEO } from "@/components";
import { HreflangTags } from "@/components/HreflangTags";
import Register from "./Register";
import AuthPageLayout from "@/components/auth/AuthPageLayout";

const merchantFeatures = [
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
];

export default function MerchantRegister() {
  return (
    <>
      <SEO
        title="Register as Merchant | Blip Money"
        description="Register as a merchant on Blip Money. Get early access to the P2P merchant network, earn genesis token allocation, and enjoy zero settlement fees."
        canonical="https://blip.money/merchant-register"
      />
      <HreflangTags path="/merchant-register" />

      <div className="bg-[#FAF8F5] dark:bg-black text-black dark:text-white overflow-hidden">
        <main className="relative z-10 max-w-7xl mx-auto px-6 pt-14 pb-24">
          <AuthPageLayout
            badge="Merchant Registration"
            heading="Create Merchant Account"
            description="Join the Blip P2P merchant network before public launch."
            variant="merchant"
            bottomContent={
              <div className="mt-16 w-full max-w-5xl mx-auto">
                <p className="text-center text-xs tracking-widest text-black/40 dark:text-white/50 mb-8">
                  WHAT MERCHANTS GET
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {merchantFeatures.map((item, i) => (
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
            }
          >
            <Register role="merchant" />
          </AuthPageLayout>
        </main>
      </div>
    </>
  );
}
