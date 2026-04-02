import { memo } from "react";
import { Shield, CheckCircle2, FileText, Map, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

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
    <section className="relative py-24 md:py-36 bg-[#f5f5f7] dark:bg-[#111] overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Heading — Apple style: bold + muted subtext */}
        <div className="mb-12">
          <h2
            className="text-black dark:text-white mb-4"
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 600,
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
            }}
          >
            Built to not break.
          </h2>
        </div>
        <div className="mb-10" />

        {/* Apple Store-style grid: 1 large + 1 large on top, 2 smaller below */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {trustCards.map((card, i) => {
            const Icon = card.icon;
            const isLarge = i < 2;
            return (
              <div
                key={card.title}
                className={`group relative rounded-3xl overflow-hidden transition-transform duration-500 hover:scale-[1.01] ${
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
                      className="text-black/50 dark:text-white/45"
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
                        width: isLarge ? 140 : 100,
                        height: isLarge ? 100 : 72,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
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
