import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Shield,
  Zap,
  ChevronDown,
  Lock,
  Globe,
  Banknote,
  BadgeCheck,
  Scale,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "@/components";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { HreflangTags } from "@/components/HreflangTags";
import StructuredData from "@/components/StructuredData";
import { sounds } from "@/lib/sounds";

/* ============================================
   FAQ DATA (shared between schema + section)
   ============================================ */

const faqItems = [
  {
    q: "What is the best crypto exchange in the UAE?",
    a: "The best crypto exchange in the UAE depends on your priorities. If you value non-custodial trading, low fees, and escrow-protected settlement, Blip Money is the top choice. Unlike centralized exchanges, Blip never holds your funds — trades are secured by on-chain smart contracts on Solana, giving you full control of your assets at all times.",
  },
  {
    q: "Is crypto trading legal in the UAE?",
    a: "Yes. Crypto trading is legal and regulated in the UAE. Dubai's Virtual Assets Regulatory Authority (VARA) and Abu Dhabi's ADGM provide comprehensive frameworks for virtual asset service providers. The UAE has positioned itself as a global hub for crypto innovation with clear, progressive legislation that supports both retail and institutional traders.",
  },
  {
    q: "How do I choose a safe crypto exchange in the UAE?",
    a: "Look for exchanges that offer non-custodial architecture (so they never hold your funds), escrow protection on trades, regulatory alignment with VARA or ADGM, transparent fee structures, and on-chain verifiability. Blip meets all of these criteria through its decentralized settlement protocol built on Solana smart contracts.",
  },
  {
    q: "What fees does Blip charge for crypto trading in the UAE?",
    a: "Blip charges approximately 0.5% per trade, which is competitive with or lower than most centralized exchanges and significantly cheaper than OTC desks (which typically charge 1-3%). There are no hidden fees, withdrawal charges, or deposit minimums. The fee covers escrow smart contract execution and settlement infrastructure.",
  },
  {
    q: "Can I convert crypto to AED on Blip?",
    a: "Yes. Blip supports crypto-to-AED settlement through its decentralized merchant network. You can sell supported cryptocurrencies (including USDT, USDC, and SOL) and receive AED directly to your UAE bank account or through cash payout at bonded merchant locations across Dubai and Abu Dhabi.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

/* ============================================
   HERO SECTION
   ============================================ */

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

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "UAE", href: "/crypto-payments-uae" },
            { label: "Best Crypto Exchange UAE" },
          ]}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 backdrop-blur-sm border border-black/[0.06] dark:border-white/10 bg-white/80 dark:bg-white/[0.03]"
        >
          <span className="w-2 h-2 rounded-full bg-[#ff6b35] animate-pulse" />
          <span className="text-xs text-black/60 dark:text-white/60 tracking-wide font-medium">
            Decentralized Protocol
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-5xl sm:text-6xl md:text-7xl font-bold text-black dark:text-white tracking-tight leading-[1.1] mb-6"
        >
          Best Crypto Exchange
          <br />
          <span className="text-black/80 dark:text-white/50">
            in the UAE.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg sm:text-xl text-black dark:text-white/40 max-w-2xl mb-10 leading-relaxed"
        >
          Trade crypto in the UAE with non-custodial escrow protection,
          competitive fees, and instant settlement. Blip is built for traders
          who demand security without sacrificing control.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <Link
            to="/waitlist"
            onClick={() => sounds.click()}
            onMouseEnter={() => sounds.hover()}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold hover:opacity-90 transition-all"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

/* ============================================
   WHY BLIP IS DIFFERENT
   ============================================ */

const WhyBlipSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: Lock,
      title: "Non-Custodial",
      desc: "Blip never holds your funds. Crypto is locked in audited Solana smart contracts during settlement — not in a company wallet. You retain full ownership until trade completion.",
    },
    {
      icon: Shield,
      title: "Escrow-Protected",
      desc: "Every trade is secured by on-chain escrow. Funds are only released when both parties fulfill their obligations, eliminating counterparty risk entirely.",
    },
    {
      icon: Scale,
      title: "VARA-Aligned",
      desc: "Blip's protocol architecture is designed to align with Dubai's VARA regulatory framework. Non-custodial smart contract settlement fits within the UAE's progressive digital asset legislation.",
    },
    {
      icon: Banknote,
      title: "Low Fees",
      desc: "Competitive merchant bidding drives trading fees down to approximately 0.5% per trade — significantly lower than most centralized exchanges and OTC desks in the UAE.",
    },
  ];

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32 bg-[#FAF8F5] dark:bg-black overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-black/40 dark:text-white/40 mb-4 block">
            Why Blip
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-black dark:text-white tracking-tight">
            Why Blip Is{" "}
            <span className="text-black/80 dark:text-white/50">Different</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="group flex items-start gap-5 p-6 rounded-2xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] hover:border-black/20 dark:hover:border-white/20 transition-colors duration-500"
                onMouseEnter={() => sounds.hover()}
              >
                <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors duration-500">
                  <Icon className="w-6 h-6 text-black/60 dark:text-white/60 group-hover:text-black dark:group-hover:text-white transition-colors duration-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-black dark:text-white/40 leading-relaxed">
                    {feature.desc}
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

/* ============================================
   WHAT TO LOOK FOR
   ============================================ */

const WhatToLookForSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const criteria = [
    {
      icon: Shield,
      title: "Security",
      desc: "The best crypto exchange should never hold your funds in a centralized wallet. Look for non-custodial architecture with smart contract escrow that gives you verifiable on-chain protection.",
    },
    {
      icon: Banknote,
      title: "Fees",
      desc: "Compare trading fees, withdrawal fees, and hidden spreads. The best exchanges in the UAE offer transparent, competitive pricing — ideally under 1% per trade with no surprise charges.",
    },
    {
      icon: Zap,
      title: "Speed",
      desc: "Settlement speed matters. Look for exchanges that offer instant crypto locking and fast fiat disbursement. In the UAE, bank transfers and IPP should settle within minutes to hours.",
    },
    {
      icon: BadgeCheck,
      title: "Regulation",
      desc: "UAE-based exchanges should align with VARA (Dubai) or ADGM (Abu Dhabi) frameworks. Regulatory alignment ensures consumer protection, dispute resolution, and operational transparency.",
    },
    {
      icon: Globe,
      title: "Support",
      desc: "Responsive customer support with UAE-based availability is essential. The best exchanges provide dispute resolution mechanisms and clear escalation paths for trade issues.",
    },
  ];

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32 bg-[#FAF8F5] dark:bg-black overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-black/40 dark:text-white/40 mb-4 block">
            Buyer's Guide
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-black dark:text-white tracking-tight">
            What to{" "}
            <span className="text-black/80 dark:text-white/50">Look For</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {criteria.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="group p-6 rounded-2xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] hover:border-black/20 dark:hover:border-white/20 transition-colors duration-500"
                onMouseEnter={() => sounds.hover()}
              >
                <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center mb-5 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors duration-500">
                  <Icon className="w-6 h-6 text-black/60 dark:text-white/60 group-hover:text-black dark:group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-black dark:text-white/40 leading-relaxed">
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

/* ============================================
   HOW BLIP COMPARES (CARD GRID)
   ============================================ */

const ComparisonSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const platforms = [
    {
      name: "Blip (Decentralized)",
      highlight: true,
      traits: [
        { label: "Custody", value: "Non-custodial (smart contract)" },
        { label: "Fees", value: "~0.5% per trade" },
        { label: "Settlement", value: "Minutes (on-chain + fiat)" },
        { label: "Escrow", value: "On-chain smart contract" },
        { label: "Regulation", value: "VARA-aligned" },
        { label: "Account Freeze Risk", value: "None" },
      ],
    },
    {
      name: "Centralized Exchange (CEX)",
      highlight: false,
      traits: [
        { label: "Custody", value: "Exchange holds your funds" },
        { label: "Fees", value: "0.1-1% + withdrawal fees" },
        { label: "Settlement", value: "Instant internal, slow withdrawal" },
        { label: "Escrow", value: "Internal (trust the exchange)" },
        { label: "Regulation", value: "Varies by exchange" },
        { label: "Account Freeze Risk", value: "High" },
      ],
    },
    {
      name: "OTC Desk",
      highlight: false,
      traits: [
        { label: "Custody", value: "Desk or broker holds funds" },
        { label: "Fees", value: "1-3% spread" },
        { label: "Settlement", value: "Hours to days" },
        { label: "Escrow", value: "Manual / trust-based" },
        { label: "Regulation", value: "Varies widely" },
        { label: "Account Freeze Risk", value: "Medium" },
      ],
    },
  ];

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32 bg-[#FAF8F5] dark:bg-black overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-black/40 dark:text-white/40 mb-4 block">
            Comparison
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-black dark:text-white tracking-tight">
            How Blip{" "}
            <span className="text-black/80 dark:text-white/50">Compares</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {platforms.map((platform, i) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              className={`group relative p-6 rounded-2xl backdrop-blur-xl transition-colors duration-500 ${
                platform.highlight
                  ? "bg-white/60 dark:bg-white/[0.03] border-2 border-[#ff6b35]/30 dark:border-[#ff6b35]/20"
                  : "bg-white/60 dark:bg-white/[0.03] border border-black/[0.08] dark:border-white/[0.06] hover:border-black/20 dark:hover:border-white/20"
              }`}
              onMouseEnter={() => sounds.hover()}
            >
              {platform.highlight && (
                <span className="absolute -top-3 left-6 text-[10px] uppercase tracking-wider px-3 py-1 rounded-full bg-[#ff6b35] text-white font-semibold">
                  Recommended
                </span>
              )}

              <h3 className="text-lg font-semibold text-black dark:text-white mb-6 mt-1">
                {platform.name}
              </h3>

              <div className="space-y-4">
                {platform.traits.map((trait) => (
                  <div key={trait.label}>
                    <span className="text-[11px] uppercase tracking-wider text-black/40 dark:text-white/40 block mb-1">
                      {trait.label}
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        platform.highlight
                          ? "text-black dark:text-white"
                          : "text-black/60 dark:text-white/40"
                      }`}
                    >
                      {trait.value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============================================
   FAQ SECTION
   ============================================ */

const FAQSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32 bg-[#FAF8F5] dark:bg-black overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent" />

      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-black/40 dark:text-white/40 mb-4 block">
            Common Questions
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-black dark:text-white tracking-tight">
            Frequently{" "}
            <span className="text-black/80 dark:text-white/50">Asked</span>
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqItems.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * i }}
              className="border border-black/[0.08] dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl rounded-xl overflow-hidden"
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
                    <div className="px-5 pb-5 text-sm text-black dark:text-white/40 leading-relaxed border-t border-black/[0.06] dark:border-white/[0.06] pt-4">
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

/* ============================================
   SEO CONTENT BLOCK
   ============================================ */

const SEOContentBlock = () => {
  return (
    <section className="border-t border-black/[0.06] dark:border-white/5 bg-[#FAF8F5] dark:bg-black">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="max-w-5xl mx-auto px-6 py-16 text-black dark:text-white/40 text-sm leading-relaxed"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl font-semibold text-black dark:text-white mb-4"
        >
          Choosing the Best Crypto Exchange in the UAE
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          The UAE has emerged as one of the world's leading jurisdictions for
          cryptocurrency trading and digital asset innovation. With Dubai's
          Virtual Assets Regulatory Authority (VARA) and Abu Dhabi's ADGM
          providing clear regulatory frameworks, traders in the UAE have access
          to a growing number of crypto exchanges and settlement platforms. But
          not all exchanges are created equal — the best crypto exchange in the
          UAE should prioritize security, transparency, and user control.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-4"
        >
          Blip Money takes a fundamentally different approach to crypto trading
          in the UAE. Instead of holding user funds in centralized wallets, Blip
          uses non-custodial smart contracts on Solana to escrow crypto during
          settlement. This means your assets are never in the hands of a
          company — they are locked in audited code until both parties fulfill
          their trade obligations. Combined with competitive fees driven by
          merchant bidding, VARA-aligned architecture, and instant on-chain
          settlement, Blip represents the next generation of crypto exchange
          infrastructure for UAE-based traders.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-4"
        >
          Whether you are converting USDT to AED, trading SOL, or settling
          large OTC deals, the best crypto exchange in the UAE should give you
          full control of your funds, verifiable on-chain protection, and
          seamless fiat disbursement to UAE bank accounts. Blip delivers all of
          this through a decentralized protocol that removes the need to trust
          any single intermediary.
        </motion.p>
      </motion.div>
    </section>
  );
};

/* ============================================
   CTA BOTTOM
   ============================================ */

const CTABottomSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32 bg-[#FAF8F5] dark:bg-black overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-black dark:text-white tracking-tight mb-6"
        >
          Ready to{" "}
          <span className="text-black/80 dark:text-white/50">Trade?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg text-black dark:text-white/40 max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Join the next generation of crypto trading in the UAE. Non-custodial
          escrow, low fees, and instant settlement — all in one protocol.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link
            to="/waitlist"
            onClick={() => sounds.click()}
            onMouseEnter={() => sounds.hover()}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold hover:opacity-90 transition-all"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

/* ============================================
   MAIN PAGE COMPONENT
   ============================================ */

const BestCryptoExchangeUae = () => {
  return (
    <>
      <SEO
        title="Best Crypto Exchange UAE - Non-Custodial Settlement | Blip Money"
        description="Find the best crypto exchange in the UAE. Blip offers non-custodial escrow-protected trading, low fees, VARA-aligned architecture, and instant crypto-to-AED settlement across Dubai and Abu Dhabi."
        canonical="https://blip.money/best-crypto-exchange-uae"
        keywords="best crypto exchange UAE, best crypto exchange Dubai, crypto trading UAE, buy crypto UAE, sell crypto UAE, crypto to AED, VARA regulated exchange, non-custodial exchange UAE"
      />
      <HreflangTags path="/best-crypto-exchange-uae" />
      <StructuredData type="custom" schema={faqSchema} />

      <div className="bg-[#FAF8F5] dark:bg-black text-black dark:text-white overflow-x-hidden">
        <HeroSection />
        <WhyBlipSection />
        <WhatToLookForSection />
        <ComparisonSection />
        <FAQSection />
        <SEOContentBlock />
        <CTABottomSection />
      </div>
    </>
  );
};

export default BestCryptoExchangeUae;
