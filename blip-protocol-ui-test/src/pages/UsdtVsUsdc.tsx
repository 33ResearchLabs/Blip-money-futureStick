import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Check,
  Minus,
  Shield,
  TrendingUp,
  Globe,
  Building2,
  Scale,
  Zap,
  BadgeCheck,
  Wallet,
} from "lucide-react";
import SEO from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { HreflangTags } from "@/components/HreflangTags";
import StructuredData from "@/components/StructuredData";
import { sounds } from "@/lib/sounds";
import { CTAButton } from "@/components/Navbar";

/* ═══════════════════════════════════════════════
   FAQ STRUCTURED DATA
   ═══════════════════════════════════════════════ */
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Which is safer, USDT or USDC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "USDC is generally considered more transparent because Circle publishes monthly reserve attestations audited by Deloitte. USDT has larger market cap and liquidity but provides only quarterly attestations. Both maintain close to a 1:1 USD peg.",
      },
    },
    {
      "@type": "Question",
      name: "Can I convert USDT to USDC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. You can swap USDT for USDC on most major exchanges and DEXs with minimal slippage. On Solana, Jupiter aggregator offers near-instant conversions at competitive rates.",
      },
    },
    {
      "@type": "Question",
      name: "Which stablecoin has lower fees?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "On-chain transfer fees depend on the blockchain, not the stablecoin. Both USDT and USDC on Solana cost fractions of a cent to transfer. Exchange withdrawal fees vary by platform.",
      },
    },
    {
      "@type": "Question",
      name: "Is USDT legal in the UAE?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Both USDT and USDC are widely traded across UAE-licensed exchanges. VARA (Virtual Assets Regulatory Authority) in Dubai regulates virtual asset service providers, and both stablecoins are available on VARA-licensed platforms.",
      },
    },
    {
      "@type": "Question",
      name: "Which stablecoin is best for AED off-ramping?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Both USDT and USDC can be off-ramped to AED through Blip Money's decentralized settlement network and most UAE exchanges. USDT has slightly more liquidity on OTC desks, but both work equally well on Blip.",
      },
    },
    {
      "@type": "Question",
      name: "Has USDT ever lost its peg?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "USDT briefly de-pegged to around $0.95 during the Terra/LUNA collapse in May 2022, but recovered within days. USDC has never significantly de-pegged, though it briefly dipped during the Silicon Valley Bank crisis in March 2023 before fully recovering.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use both USDT and USDC on Blip?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Blip Money fully supports both USDT and USDC on Solana for settlement and AED off-ramping. You can use whichever stablecoin you prefer with the same speed and competitive rates.",
      },
    },
    {
      "@type": "Question",
      name: "Which stablecoin has more trading pairs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "USDT has significantly more trading pairs across centralized and decentralized exchanges globally. However, USDC trading pairs are growing rapidly and cover all major crypto assets.",
      },
    },
  ],
};

/* ═══════════════════════════════════════════════
   COMPARISON DATA
   ═══════════════════════════════════════════════ */
const comparisonRows: {
  feature: string;
  usdt: string;
  usdc: string;
  winner: "usdt" | "usdc" | "tie";
}[] = [
  { feature: "Market Cap", usdt: "~$140B", usdc: "~$45B", winner: "usdt" },
  {
    feature: "Transparency",
    usdt: "Quarterly attestations",
    usdc: "Monthly Deloitte audits",
    winner: "usdc",
  },
  {
    feature: "Blockchain Support",
    usdt: "14+ chains",
    usdc: "10+ chains",
    winner: "usdt",
  },
  {
    feature: "Trading Pairs",
    usdt: "Most extensive",
    usdc: "Growing rapidly",
    winner: "usdt",
  },
  {
    feature: "Regulatory Compliance",
    usdt: "Varies by jurisdiction",
    usdc: "Full US compliance",
    winner: "usdc",
  },
  {
    feature: "UAE Availability",
    usdt: "All exchanges",
    usdc: "Most exchanges",
    winner: "tie",
  },
  { feature: "Blip Support", usdt: "Full", usdc: "Full", winner: "tie" },
  {
    feature: "Solana Speed",
    usdt: "Sub-second",
    usdc: "Sub-second",
    winner: "tie",
  },
  {
    feature: "AED Off-ramp",
    usdt: "Via Blip, exchanges",
    usdc: "Via Blip, exchanges",
    winner: "tie",
  },
  {
    feature: "De-peg History",
    usdt: "Brief de-peg 2022",
    usdc: "Never de-pegged",
    winner: "usdc",
  },
];

const usdtChains = [
  "Ethereum",
  "Solana",
  "Tron",
  "BNB Chain",
  "Avalanche",
  "Polygon",
  "Arbitrum",
  "Optimism",
  "TON",
  "Near",
  "Cosmos",
  "Polkadot",
  "Algorand",
  "Celo",
];
const usdcChains = [
  "Ethereum",
  "Solana",
  "Avalanche",
  "Polygon",
  "Arbitrum",
  "Optimism",
  "Base",
  "Stellar",
  "Noble",
  "Hedera",
];

/* ═══════════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════════ */
const HeroSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section
      ref={ref}
      className="relative pt-32 sm:pt-36 pb-12 sm:pb-16 bg-[#FAF8F5] dark:bg-transparent overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-black/[0.02] dark:bg-white/[0.02] blur-[140px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-[900px] mx-auto px-6">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "USDT vs USDC" }]}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 backdrop-blur-sm border border-black/[0.06] dark:border-white/10 bg-white/80 dark:bg-white/[0.03]"
        >
          <span className="w-2 h-2 rounded-full bg-[#ff6b35] animate-pulse" />
          <span className="text-xs text-black/60 dark:text-white/60 tracking-wide font-medium">
            Updated for 2026
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-black dark:text-white tracking-tight leading-[1.1] mb-6"
        >
          USDT vs USDC
          <br />
          <span className="text-black/80 dark:text-white/50">
            The Complete Comparison for UAE Traders
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg sm:text-xl text-black/50 dark:text-white/40 max-w-2xl mb-10 leading-relaxed"
        >
          Tether (USDT) and USD Coin (USDC) are the two largest stablecoins by
          market cap. This guide breaks down every difference that matters for
          UAE-based traders, including AED off-ramping, transparency, regulatory
          compliance, and which works best on Blip.
        </motion.p>

        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-wrap gap-4"
        >
          <a
            href="#comparison"
            onClick={() => sounds.click()}
            onMouseEnter={() => sounds.hover()}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold hover:opacity-90 transition-all"
          >
            View Comparison
            <ArrowRight className="w-4 h-4" />
          </a>
          
          <a
            href="#which-to-use"
            onClick={() => sounds.click()}
            onMouseEnter={() => sounds.hover()}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-black/[0.12] dark:border-white/[0.12] text-black dark:text-white font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-all"
          >
            Which Should I Use?
          </a>
        </motion.div> */}
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════
   SIDE-BY-SIDE INTERACTIVE COMPARISON
   ═══════════════════════════════════════════════ */
const SideBySideSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const rows = [
    {
      label: "Issuer",
      usdt: "Tether Ltd (BVI)",
      usdc: "Circle (USA)",
      winner: "usdc" as const,
      reason: "US-regulated entity",
    },
    {
      label: "Price (USD)",
      usdt: "$1.00",
      usdc: "$1.00",
      winner: "tie" as const,
      reason: "Both pegged 1:1",
    },
    {
      label: "Est. AED Rate",
      usdt: "~3.67 AED",
      usdc: "~3.67 AED",
      winner: "tie" as const,
      reason: "Same USD peg",
    },
    {
      label: "Market Cap",
      usdt: "~$140B",
      usdc: "~$45B",
      winner: "usdt" as const,
      reason: "3x larger supply",
    },
    {
      label: "24h Volume",
      usdt: "~$50B+",
      usdc: "~$8B+",
      winner: "usdt" as const,
      reason: "Higher trading activity",
    },
    {
      label: "Blockchains",
      usdt: "14+ chains",
      usdc: "10+ chains",
      winner: "usdt" as const,
      reason: "Wider chain support",
    },
    {
      label: "Reserve Transparency",
      usdt: "Quarterly attestations (BDO Italia)",
      usdc: "Monthly audits (Deloitte)",
      winner: "usdc" as const,
      reason: "More frequent, Big 4 auditor",
    },
    {
      label: "AED Off-ramp",
      usdt: "Blip + all UAE exchanges",
      usdc: "Blip + most UAE exchanges",
      winner: "tie" as const,
      reason: "Both fully supported",
    },
  ];

  return (
    <section
      id="comparison"
      ref={ref}
      className="relative py-16 sm:py-20 bg-[#FAF8F5] dark:bg-transparent overflow-hidden border-t border-black/[0.04] dark:border-white/[0.04]"
    >
      <div className="relative z-10 max-w-[900px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/80 dark:text-white/40 mb-4 block">
            Head to Head
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-black dark:text-white tracking-tight">
            Interactive{" "}
            <span className="text-black/80 dark:text-white/50">Comparison</span>
          </h2>
        </motion.div>

        {/* Two column headers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-3 gap-3 mb-4"
        >
          <div />
          <div className="text-center p-4 rounded-2xl bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06]">
            <div className="text-lg font-bold text-black dark:text-white">
              USDT
            </div>
            <div className="text-xs text-black/40 dark:text-white/40 mt-1">
              Tether
            </div>
          </div>
          <div className="text-center p-4 rounded-2xl bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06]">
            <div className="text-lg font-bold text-black dark:text-white">
              USDC
            </div>
            <div className="text-xs text-black/40 dark:text-white/40 mt-1">
              USD Coin
            </div>
          </div>
        </motion.div>

        {/* Comparison rows */}
        <div className="space-y-2">
          {rows.map((row, i) => (
            <motion.div
              key={row.label}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * i + 0.3 }}
              className="grid grid-cols-3 gap-3 items-center"
              onMouseEnter={() => sounds.hover()}
            >
              <div className="text-sm font-medium text-black/90 dark:text-white/50 pr-2">
                {row.label}
              </div>
              <div
                className={`text-center p-3 rounded-xl text-sm ${
                  row.winner === "usdt"
                    ? "bg-white/80 dark:bg-white/[0.04] border border-[#ff6b35]/20 dark:border-[#ff6b35]/15 text-black dark:text-white"
                    : "bg-white/60 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] text-black/70 dark:text-white/60"
                }`}
              >
                <span>{row.usdt}</span>
                {row.winner === "usdt" && (
                  <Check className="w-3.5 h-3.5 inline ml-1.5 text-[#ff6b35]" />
                )}
              </div>
              <div
                className={`text-center p-3 rounded-xl text-sm ${
                  row.winner === "usdc"
                    ? "bg-white/80 dark:bg-white/[0.04] border border-[#ff6b35]/20 dark:border-[#ff6b35]/15 text-black dark:text-white"
                    : "bg-white/60 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] text-black/70 dark:text-white/60"
                }`}
              >
                <span>{row.usdc}</span>
                {row.winner === "usdc" && (
                  <Check className="w-3.5 h-3.5 inline ml-1.5 text-[#ff6b35]" />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chain badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10"
        >
          {[
            { title: "USDT Chains", chains: usdtChains },
            { title: "USDC Chains", chains: usdcChains },
          ].map((group) => (
            <div
              key={group.title}
              className="p-5 rounded-2xl bg-white/60 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06]"
            >
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/40 dark:text-white/40 mb-3">
                {group.title}
              </div>
              <div className="flex flex-wrap gap-2">
                {group.chains.map((chain) => (
                  <span
                    key={chain}
                    className="px-2.5 py-1 text-xs rounded-full bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/50 border border-black/[0.06] dark:border-white/[0.06]"
                  >
                    {chain}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════
   COMPARISON TABLE
   ═══════════════════════════════════════════════ */
const ComparisonTableSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative py-16 sm:py-20 bg-[#FAF8F5] dark:bg-transparent overflow-hidden border-t border-black/[0.04] dark:border-white/[0.04]"
    >
      <div className="relative z-10 max-w-[900px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/50 dark:text-white/40 mb-4 block">
            Full Breakdown
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-black dark:text-white tracking-tight">
            Head-to-Head{" "}
            <span className="text-black/80 dark:text-white/50">Table</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-2xl bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/[0.06] dark:border-white/[0.06]">
                  <th className="text-left p-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/80 dark:text-white/40">
                    Feature
                  </th>
                  <th className="text-left p-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/80 dark:text-white/40">
                    USDT (Tether)
                  </th>
                  <th className="text-left p-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/80 dark:text-white/40">
                    USDC (USD Coin)
                  </th>
                  <th className="text-center p-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/80 dark:text-white/40">
                    Winner
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <motion.tr
                    key={row.feature}
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.05 * i + 0.3 }}
                    className="border-b border-black/[0.04] dark:border-white/[0.04] last:border-0 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                    onMouseEnter={() => sounds.hover()}
                  >
                    <td className="p-4 font-medium text-black dark:text-white">
                      {row.feature}
                    </td>
                    <td className="p-4 text-black/60 dark:text-white/50">
                      {row.usdt}
                    </td>
                    <td className="p-4 text-black/60 dark:text-white/50">
                      {row.usdc}
                    </td>
                    <td className="p-4 text-center">
                      {row.winner === "tie" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/5 text-xs text-black/50 dark:text-white/40">
                          <Minus className="w-3 h-3" /> Tie
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/80 dark:bg-white/[0.04] border border-[#ff6b35]/20 dark:border-[#ff6b35]/15 text-xs text-black dark:text-white font-medium">
                          <Check className="w-3 h-3" />
                          {row.winner === "usdt" ? "USDT" : "USDC"}
                        </span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════
   WHICH SHOULD YOU USE?
   ═══════════════════════════════════════════════ */
const WhichToUseSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const recommendations = [
    {
      scenario: "For maximum liquidity",
      pick: "USDT",
      icon: TrendingUp,
      desc: "USDT dominates with $140B+ market cap and the deepest order books on virtually every exchange. For large trades with minimal slippage, USDT is the go-to choice.",
    },
    {
      scenario: "For regulatory confidence",
      pick: "USDC",
      icon: Shield,
      desc: "Circle is a US-regulated entity with monthly Deloitte-audited reserve reports. If compliance and transparency are top priorities, USDC provides peace of mind.",
    },
    {
      scenario: "For UAE AED settlement",
      pick: "Both (via Blip)",
      icon: Building2,
      desc: "Blip Money fully supports both USDT and USDC for AED off-ramping. Bonded merchants accept either stablecoin, so use whichever you already hold.",
    },
    {
      scenario: "For large OTC trades",
      pick: "USDT",
      icon: Scale,
      desc: "USDT's significantly larger liquidity pool makes it the preferred choice for high-value OTC desks. More counterparties, tighter spreads on large orders.",
    },
    {
      scenario: "For business & institutional use",
      pick: "USDC",
      icon: BadgeCheck,
      desc: "USDC's strong regulatory standing and transparent reserves make it the preferred stablecoin for corporate treasuries, payroll, and institutional settlement.",
    },
  ];

  return (
    <section
      id="which-to-use"
      ref={ref}
      className="relative py-16 sm:py-20 bg-[#FAF8F5] dark:bg-transparent overflow-hidden border-t border-black/[0.04] dark:border-white/[0.04]"
    >
      <div className="relative z-10 max-w-[900px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/50 dark:text-white/40 mb-4 block">
            Recommendations
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-black dark:text-white tracking-tight">
            Which Should{" "}
            <span className="text-black/80 dark:text-white/50">You Use?</span>
          </h2>
        </motion.div>

        <div className="space-y-4">
          {recommendations.map((rec, i) => {
            const Icon = rec.icon;
            return (
              <motion.div
                key={rec.scenario}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 * i }}
                className="group flex items-start gap-5 p-6 rounded-2xl bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] hover:border-black/20 dark:hover:border-white/20 transition-colors duration-500"
                onMouseEnter={() => sounds.hover()}
              >
                <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors duration-500">
                  <Icon className="w-5 h-5 text-black/60 dark:text-white/60 group-hover:text-black dark:group-hover:text-white transition-colors duration-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="text-base font-semibold text-black dark:text-white">
                      {rec.scenario}
                    </h3>
                    <span className="px-2.5 py-0.5 text-xs rounded-full bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/50 font-medium">
                      {rec.pick}
                    </span>
                  </div>
                  <p className="text-sm text-black/50 dark:text-white/40 leading-relaxed">
                    {rec.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════
   STABLECOIN BASICS
   ═══════════════════════════════════════════════ */
const StablecoinBasicsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const basics = [
    {
      icon: Wallet,
      title: "What is a Stablecoin?",
      desc: "A stablecoin is a cryptocurrency designed to maintain a stable value, typically pegged 1:1 to a fiat currency like the US dollar. Unlike Bitcoin or Ethereum, stablecoins do not fluctuate wildly in price, making them ideal for trading, payments, and storing value.",
    },
    {
      icon: Shield,
      title: "How Are They Backed?",
      desc: "Most major stablecoins are backed by reserves of cash, cash equivalents, and short-term government securities held by the issuing company. USDT is backed by a mix of reserves managed by Tether Ltd, while USDC is backed by cash and short-duration US treasuries held by Circle and audited monthly by Deloitte.",
    },
    {
      icon: Globe,
      title: "Why Use Stablecoins?",
      desc: "Stablecoins combine the speed and borderless nature of cryptocurrency with the price stability of traditional currencies. They are widely used for cross-border transfers, crypto trading, DeFi yield, payroll, and merchant settlement, especially in regions like the UAE where crypto adoption is high.",
    },
    {
      icon: Zap,
      title: "Stablecoins on Solana",
      desc: "On Solana, both USDT and USDC benefit from sub-second finality and transaction fees under $0.01. This makes Solana one of the fastest and cheapest networks for stablecoin transfers, which is why Blip Money built its settlement protocol on Solana.",
    },
  ];

  return (
    <section
      ref={ref}
      className="relative py-16 sm:py-20 bg-[#FAF8F5] dark:bg-transparent overflow-hidden border-t border-black/[0.04] dark:border-white/[0.04]"
    >
      <div className="relative z-10 max-w-[900px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/50 dark:text-white/40 mb-4 block">
            Fundamentals
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-black dark:text-white tracking-tight">
            Stablecoin{" "}
            <span className="text-black/80 dark:text-white/50">Basics</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {basics.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 * i }}
                className="group p-6 rounded-2xl bg-white/60 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] hover:border-black/20 dark:hover:border-white/20 transition-colors duration-500"
                onMouseEnter={() => sounds.hover()}
              >
                <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center mb-5 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors duration-500">
                  <Icon className="w-5 h-5 text-black/60 dark:text-white/60 group-hover:text-black dark:group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-lg font-semibold text-black dark:text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-black/50 dark:text-white/40 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════
   FAQ SECTION
   ═══════════════════════════════════════════════ */
const FAQSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "Which is safer, USDT or USDC?",
      a: "USDC is generally considered more transparent because Circle publishes monthly reserve attestations audited by Deloitte. USDT has a larger market cap and more liquidity, but provides only quarterly attestations through BDO Italia. Both maintain a close-to-1:1 USD peg. In terms of smart contract security, both have long operational track records on major blockchains.",
    },
    {
      q: "Can I convert USDT to USDC?",
      a: "Yes. You can swap USDT for USDC on most major exchanges (Binance, Bybit, OKX) and decentralized exchanges with minimal slippage. On Solana, Jupiter aggregator offers near-instant conversions at competitive rates. The swap is typically close to 1:1 with negligible fees.",
    },
    {
      q: "Which stablecoin has lower fees?",
      a: "On-chain transfer fees depend on the blockchain, not the stablecoin. Both USDT and USDC on Solana cost fractions of a cent to transfer. On Ethereum, gas fees apply equally to both. Exchange withdrawal fees vary by platform, but are generally similar for both stablecoins.",
    },
    {
      q: "Is USDT legal in the UAE?",
      a: "Yes. Both USDT and USDC are widely traded across UAE-licensed exchanges. VARA (Virtual Assets Regulatory Authority) in Dubai regulates virtual asset service providers, and both stablecoins are available on VARA-licensed platforms like Binance, OKX, and Bybit (all operating in the UAE).",
    },
    {
      q: "Which stablecoin is best for AED off-ramping?",
      a: "Both USDT and USDC can be off-ramped to AED through Blip Money's decentralized settlement network and most UAE-based exchanges. USDT has slightly more liquidity on informal OTC desks, but on Blip both stablecoins are supported equally with the same speed and competitive merchant rates.",
    },
    {
      q: "Has USDT ever lost its peg?",
      a: "USDT briefly de-pegged to around $0.95 during the Terra/LUNA collapse in May 2022, but recovered within days. USDC briefly dipped to $0.88 during the Silicon Valley Bank crisis in March 2023 (Circle held reserves there), but fully recovered once the bank was backstopped. Neither has ever permanently lost its peg.",
    },
    {
      q: "Can I use both USDT and USDC on Blip?",
      a: "Yes. Blip Money fully supports both USDT and USDC on Solana for settlement and AED off-ramping. Bonded merchants accept either stablecoin, so you can use whichever you already hold. The experience, speed, and fees are identical for both.",
    },
    {
      q: "Which stablecoin has more trading pairs?",
      a: "USDT has significantly more trading pairs across centralized and decentralized exchanges globally. On major exchanges like Binance, USDT pairs outnumber USDC pairs by roughly 3:1. However, USDC pairs cover all major crypto assets and are growing rapidly, especially on US-focused exchanges.",
    },
  ];

  return (
    <section
      ref={ref}
      className="relative py-16 sm:py-20 bg-[#FAF8F5] dark:bg-transparent overflow-hidden border-t border-black/[0.04] dark:border-white/[0.04]"
    >
      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/50 dark:text-white/40 mb-4 block">
            Common Questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-black dark:text-white tracking-tight">
            Frequently{" "}
            <span className="text-black/80 dark:text-white/50">Asked</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.06 * i }}
              className="border border-black/[0.08] dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] backdrop-blur-xl rounded-xl overflow-hidden"
            >
              <button
                className="w-full flex justify-between items-center p-5 text-left hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                onClick={() => {
                  setOpenFaq(openFaq === i ? null : i);
                  sounds.click();
                }}
                onMouseEnter={() => sounds.hover()}
              >
                <span className="font-medium text-black dark:text-white text-sm pr-4">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-black/40 dark:text-white/40 flex-shrink-0 transition-transform duration-300 ${
                    openFaq === i ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-sm text-black/50 dark:text-white/40 leading-relaxed border-t border-black/[0.06] dark:border-white/[0.06] pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════
   CTA + CROSS-LINKS
   ═══════════════════════════════════════════════ */
const CTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const crossLinks = [
    { label: "Sell USDT in Dubai", href: "/sell-usdt-dubai" },
    { label: "Crypto to AED", href: "/crypto-to-aed" },
    { label: "Crypto Payments UAE", href: "/crypto-payments-uae" },
    { label: "Crypto Tax UAE", href: "/crypto-tax-uae" },
    { label: "How It Works", href: "/how-it-works" },
  ];

  return (
    <section
      ref={ref}
      className="relative py-16 sm:py-20 bg-[#FAF8F5] dark:bg-transparent overflow-hidden border-t border-black/[0.04] dark:border-white/[0.04]"
    >
      <div className="relative z-10 max-w-[900px] mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl font-bold text-black dark:text-white tracking-tight mb-6"
        >
          Ready to Settle{" "}
          <span className="text-black/80 dark:text-white/50">Stablecoins?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg text-black/50 dark:text-white/40 max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Whether you choose USDT or USDC, Blip Money lets you convert
          stablecoins to AED instantly through decentralized settlement with
          bonded merchants.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* <Link
            to="/waitlist"
            onClick={() => sounds.click()}
            onMouseEnter={() => sounds.hover()}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold hover:opacity-90 transition-all"
          >
            Start Using Blip
            <ArrowRight className="w-4 h-4" />
          </Link> */}
          <CTAButton to="/waitlist" className="w-[220px] h-[48px]">
            {" "}
            Start Using Blip
          </CTAButton>
        </motion.div>

        {/* Cross-links */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-14 pt-8 border-t border-black/[0.06] dark:border-white/[0.06]"
        >
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/50 dark:text-white/40 mb-4">
            Related Pages
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {crossLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onMouseEnter={() => sounds.hover()}
                className="px-4 py-2 text-sm rounded-full border border-black/[0.08] dark:border-white/[0.06] text-black/60 dark:text-white/50 hover:text-black dark:hover:text-white hover:border-black/20 dark:hover:border-white/20 transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════ */
const UsdtVsUsdc = () => {
  return (
    <>
      <SEO
        title="USDT vs USDC — Which Stablecoin is Best for UAE? | Blip Money"
        description="Compare USDT (Tether) and USDC (USD Coin) for UAE traders. Market cap, transparency, fees, AED off-ramping support, and which is better for crypto settlement."
        canonical="https://blip.money/usdt-vs-usdc"
        keywords="USDT vs USDC, USDT vs USDC UAE, best stablecoin UAE, Tether vs USD Coin, USDT USDC comparison, stablecoin for AED"
      />
      <HreflangTags path="/usdt-vs-usdc" />
      <StructuredData type="custom" schema={faqSchema} />

      <div className="bg-[#FAF8F5] dark:bg-transparent text-black dark:text-white overflow-x-hidden">
        <HeroSection />
        <SideBySideSection />
        <ComparisonTableSection />
        <WhichToUseSection />
        <StablecoinBasicsSection />
        <FAQSection />
        <CTASection />
      </div>
    </>
  );
};

export default UsdtVsUsdc;
