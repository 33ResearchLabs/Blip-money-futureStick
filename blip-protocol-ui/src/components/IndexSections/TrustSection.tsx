import { memo } from "react";
import { motion } from "framer-motion";
import { Shield, CheckCircle2, FileText, Map, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { SwipeHint } from "./SwipeHint";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ============================================
   SECTION 10: TRUST & ARCHITECTURE
   Apple Store-style card grid
   ============================================ */

const trustCards = [
  {
    icon: Shield,
    title: "Deterministic settlement",
    desc: "No ambiguity. No manual intervention. Every outcome predefined by protocol rules.",
    tag: "Settlement",
    color: "#ff6b35",
    image: "/settlement.webp",
  },
  {
    icon: CheckCircle2,
    title: "Escrow + execution guarantees",
    desc: "Funds locked before execution. Enforced by smart contracts, not promises.",
    tag: "Guarantees",
    color: "#00e599",
    image: "/escrowlocked.webp",
  },
  {
    icon: FileText,
    title: "On-chain verification",
    desc: "Every transaction verifiable on-chain. Full transparency, zero trust required.",
    tag: "Verification",
    color: "#7877ff",
    image: "/blockchainNodes_opt.webp",
  },
  {
    icon: Map,
    title: "System isolation",
    desc: "No single point of failure. Each component operates independently.",
    tag: "Resilience",
    color: "#ff6b35",
    image: "/global.webp",
  },
];

const TrustSection = () => {
  return (
    <section className="relative py-20 md:py-36 bg-[#f5f5f7] dark:bg-[#111] overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-6">
        {/* Heading — Apple style: bold + muted subtext */}
        <motion.h2
          className="heading-h2 text-black dark:text-white"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
          style={{ marginBottom: 48 }}
        >
          Built to not break.
        </motion.h2>

        {/* Mobile: horizontal snap-scroll. md+: 2-col grid. */}
        <div className="relative">
        <div className="-mx-5 md:mx-0 px-5 md:px-0 flex md:grid md:grid-cols-2 gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {trustCards.map((card, i) => {
            const Icon = card.icon;
            const isLarge = i < 4;
            return (
              <div
                key={card.title}
                className={`snap-start shrink-0 w-[88%] md:w-auto group relative rounded-3xl overflow-hidden transition-transform duration-500 hover:scale-[1.01] ${
                  isLarge ? "min-h-[340px] sm:min-h-[380px]" : "min-h-[280px] sm:min-h-[300px]"
                }`}
                style={{
                  background: "rgba(255,255,255,0.8)",
                }}
              >
                {/* Dark mode override */}
                <div className="absolute inset-0 bg-transparent dark:bg-[#1a1a1a] rounded-3xl" />

                {/* Subtle color glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 70% 80%, ${card.color}10, transparent 60%)`,
                  }}
                />

                <div className="relative z-10 h-full flex flex-col justify-between p-8 sm:p-10">
                  {/* Top: text content */}
                  <div>
                    <span
                      className="text-[11px] uppercase tracking-[0.15em] font-semibold inline-block mb-4"
                      style={{ color: card.color }}
                    >
                      {card.tag}
                    </span>
                    <h3
                      className="text-black dark:text-white mb-2"
                      style={{
                        fontSize: isLarge ? "24px" : "20px",
                        fontWeight: 600,
                        letterSpacing: "-0.02em",
                        lineHeight: 1.2,
                      }}
                    >
                      {card.title}
                    </h3>
                    <p
                      className="text-black/70 dark:text-white/65"
                      style={{
                        fontSize: "15px",
                        lineHeight: 1.5,
                        maxWidth: 320,
                      }}
                    >
                      {card.desc}
                    </p>
                  </div>

                  {/* Bottom: small image */}
                  <div className="flex justify-end mt-4">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="rounded-xl object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        width: isLarge ? 300 : 100,    // 140 : 100
                        height: isLarge ? 140 : 72,    // 100:72
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <SwipeHint />
        </div>

        {/* Bottom CTA */}
        <div className="flex justify-start mt-10">
          <Link
            to="/whitepaper"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
            style={{ color: "#ff6b35" }}
          >
            Read the whitepaper
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default memo(TrustSection);
