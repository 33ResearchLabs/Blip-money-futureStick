import { memo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowDownToLine, TrendingUp } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * BothSides — the "User · Merchant" split that lives right under
 * the hero. Two glass cards, identical shape, communicating that
 * Blip is built for both sides of every settlement.
 */
const BothSidesSection = () => {
  return (
    <section className="relative bg-black text-white overflow-hidden">
      {/* Soft cinematic fade in from the hero */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-32 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.95) 0%, transparent 100%)",
        }}
      />

      <div className="relative z-10 max-w-[1180px] mx-auto px-6 md:px-10 pt-24 pb-28 md:pt-32 md:pb-36">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="flex items-center justify-center gap-2.5 mb-9"
        >
          <span className="w-6 h-px bg-white/20" />
          <span className="text-[10.5px] font-semibold tracking-[0.3em] uppercase text-white/45">
            Built for both sides
          </span>
          <span className="w-6 h-px bg-white/20" />
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE, delay: 0.08 }}
          className="font-display text-white text-center mb-16 md:mb-20"
          style={{
            fontSize: "clamp(2rem, 4.4vw, 3.4rem)",
            fontWeight: 500,
            lineHeight: 1.06,
            letterSpacing: "-0.04em",
          }}
        >
          One market.
          <span className="text-white/45"> Two sides of every settlement.</span>
        </motion.h2>

        {/* Two role cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {/* User card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8%" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="group relative rounded-3xl overflow-hidden"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.015) 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow:
                "0 28px 70px -30px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.05) inset",
            }}
          >
            {/* Subtle blue accent */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{
                background:
                  "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(110,170,255,0.08), transparent 70%)",
              }}
            />

            <div className="relative z-10 p-7 md:p-9">
              <div className="flex items-center gap-3 mb-7">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    background: "rgba(110,170,255,0.12)",
                    border: "1px solid rgba(110,170,255,0.25)",
                  }}
                >
                  <ArrowDownToLine
                    className="w-4 h-4 text-[#a8c8ff]"
                    strokeWidth={2}
                  />
                </div>
                <div>
                  <div className="text-[10px] font-semibold tracking-[0.24em] uppercase text-white/45">
                    For users
                  </div>
                  <div className="text-[18px] font-semibold text-white tracking-tight leading-snug mt-0.5">
                    Send anywhere. Land in seconds.
                  </div>
                </div>
              </div>

              <p className="text-[14.5px] text-white/55 leading-[1.6] mb-7">
                The Blip market routes your transaction through verified
                merchants for the best available rate. Settlement lands directly
                in your bank or e-wallet.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  "Best rate across the merchant network",
                  "Sub-minute settlement to UPI · Aani · GCash",
                  "Non-custodial escrow protects every trade",
                ].map((line) => (
                  <li
                    key={line}
                    className="flex items-start gap-2.5 text-[13.5px] text-white/65 tracking-tight"
                  >
                    <span className="mt-[7px] w-1 h-1 rounded-full bg-[#6eaaff] shrink-0" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/user"
                className="group/cta inline-flex items-center gap-1.5 text-[13px] font-semibold text-white hover:text-[#a8c8ff] transition-colors"
              >
                <span>Explore for users</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/cta:translate-x-0.5" />
              </Link>
            </div>
          </motion.div>

          {/* Merchant card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8%" }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
            className="group relative rounded-3xl overflow-hidden"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.015) 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow:
                "0 28px 70px -30px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.05) inset",
            }}
          >
            {/* Subtle warm accent */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{
                background:
                  "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,140,80,0.06), transparent 70%)",
              }}
            />

            <div className="relative z-10 p-7 md:p-9">
              <div className="flex items-center gap-3 mb-7">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    background: "rgba(255,170,110,0.10)",
                    border: "1px solid rgba(255,170,110,0.22)",
                  }}
                >
                  <TrendingUp
                    className="w-4 h-4 text-[#ffb88a]"
                    strokeWidth={2}
                  />
                </div>
                <div>
                  <div className="text-[10px] font-semibold tracking-[0.24em] uppercase text-white/45">
                    For merchants
                  </div>
                  <div className="text-[18px] font-semibold text-white tracking-tight leading-snug mt-0.5">
                    Earn from global flow.
                  </div>
                </div>
              </div>

              <p className="text-[14.5px] text-white/55 leading-[1.6] mb-7">
                Bid on live settlement requests across every active corridor.
                Set your spread, get matched on rate, settle on-chain — the
                Blip market routes the next trade to you.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  "Compete on rate across global corridors",
                  "On-chain escrow eliminates counterparty risk",
                  "Volume scales with reputation and bond",
                ].map((line) => (
                  <li
                    key={line}
                    className="flex items-start gap-2.5 text-[13.5px] text-white/65 tracking-tight"
                  >
                    <span className="mt-[7px] w-1 h-1 rounded-full bg-[#ffb88a] shrink-0" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/merchant"
                className="group/cta inline-flex items-center gap-1.5 text-[13px] font-semibold text-white hover:text-[#ffb88a] transition-colors"
              >
                <span>Explore for merchants</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/cta:translate-x-0.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default memo(BothSidesSection);
