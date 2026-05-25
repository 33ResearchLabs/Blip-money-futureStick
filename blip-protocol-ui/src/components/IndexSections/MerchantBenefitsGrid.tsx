import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { BenefitScene } from "@/pages/CardPreview";

const EASE = [0.16, 1, 0.3, 1] as const;

const BENEFITS = [
  {
    kind: "payout",
    label: "INSTANT PAYOUTS",
    titlePre: "Settle in",
    titleAccent: "seconds — not days.",
    accent: "#cc785c",
    cta: "See payouts",
    footnote: "On-chain · 24/7",
  },
  {
    kind: "noback",
    label: "NO CHARGEBACKS",
    titlePre: "Final sale,",
    titleAccent: "really final.",
    accent: "#9ad1ff",
    cta: "How it works",
    footnote: "No bank reversals",
  },
  {
    kind: "global",
    label: "GLOBAL ORDERS",
    titlePre: "Take orders from",
    titleAccent: "anywhere.",
    accent: "#ffd45a",
    cta: "Open coverage",
    footnote: "190+ countries",
  },
  {
    kind: "margin",
    label: "YOU SET THE MARGIN",
    titlePre: "Your price.",
    titleAccent: "Your margin.",
    accent: "#ff5d8f",
    cta: "Set pricing",
    footnote: "Per-order bidding",
  },
  {
    kind: "always",
    label: "ALWAYS ON",
    titlePre: "Earn while you",
    titleAccent: "sleep.",
    accent: "#6ee0c5",
    cta: "Go live",
    footnote: "24/7 settlement",
  },
] as const;

export function MerchantBenefitsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
      {BENEFITS.map((c, i) => (
        <motion.div
          key={c.kind}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ duration: 0.55, delay: i * 0.05, ease: EASE }}
          whileHover={{ y: -4 }}
          className="relative rounded-[22px] overflow-hidden text-left flex flex-col group"
          style={{
            background: "#0a0a0a",
            border: "1px solid rgba(255,255,255,0.06)",
            transition: "transform 0.35s ease",
            boxShadow: "0 24px 60px -24px rgba(0,0,0,0.6)",
          }}
        >
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: "1/1" }}>
            <BenefitScene kind={c.kind} accent={c.accent} />
          </div>

          <div className="px-4 py-4 flex-1 flex flex-col">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-1 h-1 rounded-full" style={{ background: c.accent }} />
              <span
                className="text-[9.5px] font-bold tracking-[0.18em]"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                {c.label}
              </span>
            </div>

            <div
              className="font-display leading-[1.14] flex-1"
              style={{
                fontSize: "18px",
                fontWeight: 600,
                letterSpacing: "-0.025em",
                color: "#fff",
              }}
            >
              {c.titlePre}{" "}
              <span
                style={{
                  color: c.accent,
                  fontStyle: "italic",
                  fontWeight: 500,
                  fontFamily: "ui-serif, Georgia, serif",
                }}
              >
                {c.titleAccent}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between gap-2">
              <Link
                to="https://app.blip.money/waitlist/merchant-login"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11.5px] font-semibold tracking-tight hover:-translate-y-[1px] transition-transform whitespace-nowrap"
                style={{ background: "#fff", color: "#0a0a0a" }}
              >
                {c.cta}
                <ArrowRight className="w-3 h-3" />
              </Link>
              <span
                className="text-[9.5px] tracking-tight leading-tight text-right"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                {c.footnote}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
