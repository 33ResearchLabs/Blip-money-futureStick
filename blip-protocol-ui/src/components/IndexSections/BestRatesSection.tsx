import { memo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { IllustrationCard } from "./sceneArt";

const EASE = [0.16, 1, 0.3, 1] as const;

const OFFERS = [
  { merchant: "Leila M.", rate: "83.42", spread: "+0.18%", best: true },
  { merchant: "Lee S.", rate: "83.38", spread: "+0.13%", best: false },
  { merchant: "Omar P.", rate: "83.31", spread: "+0.05%", best: false },
  { merchant: "Bank wire", rate: "82.10", spread: "−1.46%", best: false, muted: true },
];

function RateMarketArt() {
  return (
    <div className="relative w-full max-w-[560px] mx-auto" style={{ aspectRatio: "5 / 6" }}>
      {/* Warm ambient glow */}
      <div
        className="absolute -inset-10 rounded-[60px] blur-3xl opacity-50"
        style={{
          background:
            "radial-gradient(55% 50% at 40% 60%, rgba(204,120,92,0.18), transparent 70%)",
        }}
      />

      {/* Main rate board — large, dark card, floats on cream */}
      <motion.div
        initial={{ opacity: 0, y: 24, rotate: 2 }}
        whileInView={{ opacity: 1, y: 0, rotate: 1.5 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 1.1, ease: EASE }}
        className="absolute left-1/2 top-1/2 w-[340px] md:w-[400px] rounded-[28px] bg-[#0d0a08] border border-white/[0.06] overflow-hidden"
        style={{
          transform: "translate(-50%, -50%) rotate(1.5deg)",
          boxShadow:
            "0 70px 140px -30px rgba(80,40,20,0.4), 0 30px 60px -15px rgba(0,0,0,0.3)",
        }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-[10px] tracking-[0.32em] uppercase text-white/45 font-bold">
                Blip Market
              </div>
              <div className="text-[18px] text-white font-semibold tracking-tight mt-1">
                USD → INR
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inset-0 rounded-full bg-[#cc785c] opacity-60 animate-ping" />
                <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-[#cc785c]" />
              </span>
              <span className="text-[10px] font-mono text-white/55">12 merchants live</span>
            </div>
          </div>

          <div className="space-y-2">
            {OFFERS.map((o, i) => (
              <motion.div
                key={o.merchant}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.3 + i * 0.12, ease: EASE }}
                className={`flex items-center justify-between rounded-xl px-3.5 py-3 border ${
                  o.best
                    ? "border-[#cc785c]/40 bg-[#cc785c]/[0.08]"
                    : o.muted
                    ? "border-white/[0.04] bg-white/[0.01] opacity-50"
                    : "border-white/[0.06] bg-white/[0.02]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${o.best ? "bg-[#cc785c]" : "bg-white/30"}`} />
                  <span className="text-[12.5px] text-white/85 font-medium">{o.merchant}</span>
                  {o.best && (
                    <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#cc785c]">
                      Best
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[12.5px] font-mono tabular-nums text-white">₹{o.rate}</span>
                  <span
                    className="text-[10px] font-mono tabular-nums"
                    style={{
                      color: o.muted ? "rgba(255,120,120,0.7)" : o.best ? "#cc785c" : "rgba(180,255,200,0.7)",
                    }}
                  >
                    {o.spread}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-5 pt-5 border-t border-white/[0.06] flex items-center justify-between">
            <span className="text-[10.5px] uppercase tracking-wider text-white/45 font-semibold">
              You save vs banks
            </span>
            <span className="text-[18px] font-semibold font-mono text-[#cc785c]">+$32.40</span>
          </div>
        </div>
      </motion.div>

      {/* Floating "winner" pill on cream */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 1.5, ease: EASE }}
        className="absolute -top-2 left-2 md:left-8 bg-white rounded-full px-4 py-2 flex items-center gap-2 border border-black/[0.05]"
        style={{
          boxShadow: "0 24px 50px -16px rgba(80,40,20,0.25), 0 8px 20px -6px rgba(0,0,0,0.1)",
          transform: "rotate(-5deg)",
        }}
      >
        <TrendingDown className="w-3 h-3 text-[#cc785c]" />
        <span className="text-[11px] font-semibold tracking-tight text-black">
          0.18% better than bank
        </span>
      </motion.div>

      {/* Floating "merchants competing" badge */}
      <motion.div
        initial={{ opacity: 0, y: 12, x: 8 }}
        whileInView={{ opacity: 1, y: 0, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 1.7, ease: EASE }}
        className="absolute bottom-6 -right-2 md:-right-6 bg-white rounded-2xl p-3 border border-black/[0.05]"
        style={{
          boxShadow: "0 30px 70px -20px rgba(80,40,20,0.3), 0 10px 24px -8px rgba(0,0,0,0.1)",
          transform: "rotate(4deg)",
        }}
      >
        <div className="text-[9px] uppercase tracking-[0.24em] text-black/45 font-bold mb-1">
          Auction · 1.8s
        </div>
        <div className="flex -space-x-1.5">
          {["A", "K", "R", "S", "M"].map((c, i) => (
            <div
              key={i}
              className="w-6 h-6 rounded-full border-2 border-white text-white text-[10px] font-bold flex items-center justify-center"
              style={{
                background:
                  i % 2
                    ? "linear-gradient(135deg,#ffa473,#cc785c)"
                    : "linear-gradient(135deg,#1a1411,#3a2a22)",
              }}
            >
              {c}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

const BestRatesSection = memo(function BestRatesSection() {
  return (
    <section
      className="relative bg-black text-white py-12 md:py-24 overflow-hidden"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.7]"
        style={{
          background:
            "radial-gradient(70% 60% at 0% 50%, rgba(110,224,197,0.07), transparent 60%), radial-gradient(60% 50% at 100% 50%, rgba(204,120,92,0.08), transparent 65%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-14 md:gap-20 items-center">
        {/* Visual LEFT */}
        <div className="md:order-1 order-2">
          <IllustrationCard>
            <img
              src="/illustrations/rate-neon-card.png"
              alt="Night bazaar with merchants bidding, middle merchant winning with mint-green sign and gold coin"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </IllustrationCard>
        </div>

        {/* Text RIGHT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1, delay: 0.1, ease: EASE }}
          className="md:order-2 order-1"
        >
          <h2
            className="font-display leading-[1.02] mb-6"
            style={{
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              fontWeight: 500,
              letterSpacing: "-0.035em",
            }}
          >
            The best rate,{" "}
            <span style={{ fontStyle: "italic", fontFamily: "ui-serif, Georgia, serif" }}>
              every single time.
            </span>
          </h2>
          <p className="text-[18px] md:text-[19px] leading-[1.55] opacity-70 max-w-[480px] mb-9">
            Live rates from real merchants competing for your order. The winner is always
            the best price.
          </p>
          <Link
            to="/rates"
            className="inline-flex items-center justify-center self-start gap-1.5 px-6 h-12 rounded-full bg-white text-black text-[14px] font-semibold tracking-tight transition-transform hover:-translate-y-[1px]"
          >
            See live rates <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
});

export default BestRatesSection;
