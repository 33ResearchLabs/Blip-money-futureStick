import { Gift, HandCoins, Zap, Activity, Users, Wallet } from "lucide-react";
import { SEO } from "@/components";
import { HreflangTags } from "@/components/HreflangTags";
import Register from "./Register";
import AuthPageLayout from "@/components/auth/AuthPageLayout";

const merchantFeatures = [
  {
    icon: Activity,
    title: "Early App Access",
    desc: "Test the merchant dashboard before public launch.",
  },
  {
    icon: HandCoins,
    title: "Zero Settlement Fees",
    desc: "Early merchants receive reduced or zero fees during the beta phase.",
  },
  {
    icon: Zap,
    title: "Priority Routing",
    desc: "Merchant nodes get faster matching and network priority.",
  },
  {
    icon: Users,
    title: "Referral Rewards",
    desc: "Refer other merchants and unlock priority access perks.",
  },
  {
    icon: Wallet,
    title: "Direct Settlement",
    desc: "Get paid directly on-chain — no banks, no chargebacks.",
  },
  {
    icon: Gift,
    title: "Founding Merchant Status",
    desc: "Recognised as a founding partner during the beta.",
  },
];

export default function MerchantRegister() {
  return (
    <>
      <SEO
        title="Register as Merchant | Blip Money"
        description="Register as a merchant on Blip Money. Get early access to the P2P merchant network, earn genesis token allocation, and enjoy zero settlement fees."
        canonical="https://www.blip.money/merchant-register"
      />
      <HreflangTags path="/merchant-register" />

      <div className="relative bg-[#FAF8F5] dark:bg-black text-black dark:text-white overflow-hidden">
        {/* Ambient peach glow — premium fintech vibe */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 dark:opacity-100"
          style={{
            background:
              "radial-gradient(900px circle at 15% 0%, rgba(244,200,168,0.10), transparent 50%), radial-gradient(700px circle at 90% 100%, rgba(244,200,168,0.06), transparent 50%)",
          }}
        />

        <main className="relative z-10 max-w-7xl mx-auto px-6 pt-14 pb-24">
          <AuthPageLayout
            badge="Join the future of global payments"
            heading="Join the merchant waitlist."
            headingAccent="Be the first to accept money without limits."
            description="Blip is coming soon. Join the merchant waitlist and get early access plus exclusive benefits."
            variant="merchant"
            bottomContent={
              <div className="mt-16 w-full max-w-5xl mx-auto">
                <p className="text-center text-[11px] font-semibold tracking-[0.25em] text-black/50 dark:text-white/60 mb-8">
                  WHAT MERCHANTS GET
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {merchantFeatures.map((item, i) => (
                    <div
                      key={i}
                      className="group p-6 border border-black/10 dark:border-white/[0.08] rounded-2xl bg-black/[0.01] dark:bg-white/[0.02] hover:border-[#f4c8a8]/40 dark:hover:border-[#f4c8a8]/30 hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-all duration-300"
                    >
                      <div className="w-10 h-10 rounded-xl bg-[#f4c8a8]/10 border border-[#f4c8a8]/20 flex items-center justify-center mb-4">
                        <item.icon className="w-4 h-4 text-[#f4c8a8]" strokeWidth={2} />
                      </div>
                      <h3 className="text-sm font-semibold text-black dark:text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-xs text-black/55 dark:text-white/60 leading-relaxed">
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
