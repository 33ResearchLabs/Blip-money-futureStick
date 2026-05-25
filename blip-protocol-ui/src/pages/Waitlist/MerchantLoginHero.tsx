import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { SEO } from "@/components";
import { HreflangTags } from "@/components/HreflangTags";
import Login from "./Login";
import CrossSellCard from "@/components/auth/CrossSellCard";

const EASE = [0.16, 1, 0.3, 1] as const;

/* /merchant-login & /merchant-waitlist — Apple-minimal merchant sign-in. */
export default function MerchantLoginHero() {
  return (
    <>
      <SEO
        title="Sign In as Merchant | Blip Money"
        description="Sign back in to your Blip merchant account — check live orders, settlements, and earnings."
        canonical="https://www.blip.money/merchant-login"
      />
      <HreflangTags path="/merchant-login" />

      <div className="min-h-screen bg-[#FAF8F5] text-black overflow-hidden">
        <main className="relative z-10 max-w-[1200px] mx-auto px-6 pt-16 md:pt-24 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_475px] gap-10 lg:gap-14 items-center min-h-[80vh]">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
                className="flex justify-center lg:justify-start mb-5"
              >
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="relative w-[76px] h-[76px] overflow-hidden"
                  style={{
                    borderRadius: 20,
                    boxShadow:
                      "0 16px 36px -12px rgba(0,0,0,0.20), 0 6px 14px -8px rgba(204,120,92,0.24), inset 0 1px 0 rgba(255,255,255,0.6)",
                  }}
                >
                  <img
                    src="/illustrations/join-waitlist-icon.png?v=3"
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="eager"
                  />
                </motion.div>
              </motion.div>

              <div className="inline-flex items-center gap-3 mb-7">
                <span className="w-5 h-px bg-black/15" />
                <span className="text-[10px] font-semibold tracking-[0.3em] uppercase whitespace-nowrap text-black">
                  Merchant · Welcome Back
                </span>
                <span className="w-5 h-px bg-black/15" />
              </div>

              <h1
                className="font-display"
                style={{
                  fontSize: "clamp(2rem, 4.4vw, 3rem)",
                  fontWeight: 600,
                  lineHeight: 1.02,
                  letterSpacing: "-0.045em",
                  color: "#1d1d1f",
                  marginBottom: 16,
                }}
              >
                Welcome back, operator.{" "}
                <span style={{ fontStyle: "italic", fontWeight: 500, color: "#cc785c" }}>
                  The order book is live.
                </span>
              </h1>

              <p
                className="text-[15.5px] leading-[1.5] tracking-tight max-w-[480px] mx-auto lg:mx-0 mb-7"
                style={{ color: "#1d1d1f" }}
              >
                Pick up where you left off — live orders, settlement queue,
                merchant earnings, and your standing on the leaderboard.
              </p>

              <ul className="space-y-3 max-w-[440px] mx-auto lg:mx-0 text-left">
                {[
                  "Live order routing and bid history",
                  "Daily earnings, paid out instantly on-chain",
                  "Leaderboard standing and founder perks",
                ].map((line) => (
                  <li
                    key={line}
                    className="flex items-start gap-3 text-[14.5px] font-medium"
                    style={{ color: "#1d1d1f" }}
                  >
                    <span className="mt-[3px] inline-flex w-[18px] h-[18px] shrink-0 rounded-full items-center justify-center bg-[#1d1d1f]">
                      <Check className="w-[11px] h-[11px] text-white" strokeWidth={3} />
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              <p
                className="mt-9 text-[11px] tracking-[0.18em] uppercase font-semibold"
                style={{ color: "#3a3a3c" }}
              >
                1,284 merchants live on the network
              </p>

              <div className="mt-7">
                <CrossSellCard
                  to="/login"
                  stat="5%"
                  statLabel="Cashback"
                  eyebrow="Sign in as a User"
                  title="Earn up to 5% cashback on every transaction"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE, delay: 0.1 }}
              className="w-full"
            >
              <div
                className="bg-white rounded-[24px] border border-black/[0.06] p-6 sm:p-7"
                style={{
                  color: "#1d1d1f",
                  boxShadow:
                    "0 40px 100px -36px rgba(0,0,0,0.18), 0 16px 40px -20px rgba(0,0,0,0.08)",
                }}
              >
                <div className="mb-5">
                  <h2
                    className="font-display"
                    style={{
                      fontSize: "1.65rem",
                      fontWeight: 600,
                      letterSpacing: "-0.035em",
                      lineHeight: 1.05,
                      color: "#1d1d1f",
                    }}
                  >
                    Sign in as{" "}
                    <span style={{ fontStyle: "italic", fontWeight: 500, color: "#cc785c" }}>
                      merchant.
                    </span>
                  </h2>
                  <p className="mt-1.5 text-[12.5px]" style={{ color: "#3a3a3c" }}>
                    Welcome back. Your orders are right where you left them.
                  </p>
                </div>

                <Login role="merchant" />
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
}
