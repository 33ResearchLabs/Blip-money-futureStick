import { useEffect } from "react";
import {
  HandCoins,
  Activity,
  Zap,
  Wallet,
  Gift,
  Users,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { SEO } from "@/components";
import { HreflangTags } from "@/components/HreflangTags";
import Login from "./Login";
import AuthPageLayout from "@/components/auth/AuthPageLayout";

interface AirdropLoginProps {
  initialView?: "landing" | "waitlist" | "connect";
}

export const MerchantLogin = ({ initialView: _initialView }: AirdropLoginProps = {}) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Only fast-forward to the merchant dashboard if they already hold the
  // merchant role. If they're signed in as USER-only, leave them on this
  // page so they can sign in fresh (or use the inner Login flow which will
  // toast + send them to /merchant-register to upgrade their account).
  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated && user?.emailVerified) {
      const effectiveRoles = (user.roles && user.roles.length > 0)
        ? user.roles
        : (user.role ? [user.role] : []);
      if (effectiveRoles.includes("MERCHANT")) {
        navigate("/merchant-dashboard", { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  return (
    <>
      <SEO
        title="Join the Blip Money Waitlist | Early Access & Rewards"
        description="Sign up for the Blip Money waitlist and get early access to fast, secure, and borderless crypto payments. Earn 2000 bonus points."
        canonical="https://app.blip.money/waitlist/user"
      />
      <HreflangTags path="https://app.blip.money/waitlist/user" />

      <div className="min-h-screen bg-[#FAF8F5] dark:bg-black text-black dark:text-white overflow-hidden mt-8">
        <main className="relative z-10 max-w-7xl mx-auto px-6 pt-6 pb-24">
          {!isAuthenticated && (
            <AuthPageLayout
              badge="Join the future of global payments"
            heading="Join the merchant waitlist."
            headingAccent="Be the first to accept money without limits."
            description="Access your merchant dashboard and manage your business"
              variant="merchant"
              bottomContent={
                <div className="mt-16 w-full max-w-5xl mx-auto">
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
              }
            >
              <Login role="merchant" />
            </AuthPageLayout>
          )}
        </main>
      </div>
    </>
  );
};
