import { motion } from "framer-motion";
import { Gift } from "lucide-react";
import { SEO } from "@/components";
import { HreflangTags } from "@/components/HreflangTags";
import Register from "./Register";

const EASE = [0.16, 1, 0.3, 1] as const;
const ACCENT = "#34c08c";

/* /waitlist/user — app-style signup card.
   Waitlist phase: real account is created via the existing register flow;
   same credentials carry into the app at launch. Not a marketing page. */
export default function WaitlistUserHero() {
  return (
    <>
      <SEO
        title="Create your Blip account | Waitlist"
        description="Create your Blip account, earn 5,000 BLIP points, and unlock early access the moment the app opens."
        canonical="https://app.blip.money/waitlist/user"
      />
      <HreflangTags path="https://app.blip.money/waitlist/user" />

      <div className="min-h-screen bg-[#FAF8F5] text-black flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="w-full max-w-[460px]"
        >
          {/* Tight header — no marketing eyebrow */}
          <div className="text-center mb-6">
            <h1 className="text-[26px] sm:text-[28px] font-bold tracking-tight text-black leading-tight">
              Create your Blip account
            </h1>
            <p className="mt-2 text-[14px] text-black/55 leading-snug">
              Waitlist is open. Same login works when the app launches.
            </p>
          </div>

          {/* The card (dark scope so existing form styles apply) */}
          <div
            className="dark bg-black text-white rounded-3xl border border-white/[0.08] p-6 sm:p-7"
            style={{
              boxShadow: "0 40px 100px -32px rgba(0,0,0,0.45), 0 16px 40px -20px rgba(0,0,0,0.28)",
            }}
          >
            {/* Token reward — the actual unlock */}
            <div
              className="flex items-center gap-3 rounded-2xl px-4 py-3.5 mb-5"
              style={{
                background: "rgba(52,192,140,0.10)",
                border: "1px solid rgba(52,192,140,0.22)",
              }}
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                style={{ background: "rgba(52,192,140,0.18)" }}
              >
                <Gift className="h-4 w-4" style={{ color: ACCENT }} />
              </div>
              <div className="text-[13px] leading-snug">
                <span className="font-semibold" style={{ color: ACCENT }}>
                  +5,000 BLIP pts
                </span>{" "}
                <span className="text-white/70">credited to your account on signup</span>
              </div>
            </div>

            <Register embedded />
          </div>

          {/* Sub-card trust line */}
          <p className="mt-5 text-center text-[11.5px] tracking-[0.14em] uppercase text-black/40 font-semibold">
            12,438 in line · early access at launch
          </p>
        </motion.div>
      </div>
    </>
  );
}
