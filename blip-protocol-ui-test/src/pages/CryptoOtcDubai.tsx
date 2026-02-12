import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Shield,
  Zap,
  ChevronDown,
  Lock,
  Users,
  Banknote,
  Building2,
  BadgeCheck,
  Scale,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "@/components";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { HreflangTags } from "@/components/HreflangTags";
import StructuredData from "@/components/StructuredData";
import { sounds } from "@/lib/sounds";
import { CTAButton } from "@/components/Navbar";

/* ============================================
   FAQ DATA (shared between section + schema)
   ============================================ */
const faqs = [
  {
    q: "What is crypto OTC trading in Dubai?",
    a: "Crypto OTC (over-the-counter) trading in Dubai refers to large-volume cryptocurrency transactions that are executed directly between two parties rather than on a public exchange order book. Blip facilitates OTC trades through its decentralized settlement protocol, connecting institutional buyers and sellers with bonded merchants who can handle high-value conversions between crypto and AED.",
  },
  {
    q: "What is the minimum trade size for OTC on Blip?",
    a: "Blip's OTC service is designed for trades starting at $10,000 USD equivalent and above. For smaller amounts, you can use the standard peer-to-peer settlement flow. OTC requests are matched with bonded merchants who specialize in handling large-volume trades with minimal slippage and competitive pricing.",
  },
  {
    q: "How does Blip protect OTC trades from counterparty risk?",
    a: "Every OTC trade on Blip is secured by non-custodial escrow smart contracts. The seller's crypto is locked on-chain before the buyer sends fiat payment. Merchants are required to post a bond (staked collateral) that can be slashed if they behave dishonestly. This eliminates the counterparty risk that plagues traditional OTC desks.",
  },
  {
    q: "Which cryptocurrencies are supported for OTC trading in Dubai?",
    a: "Blip currently supports OTC trading for USDT, USDC, and SOL with AED settlement in Dubai and across the UAE. Additional assets are being added based on merchant liquidity and user demand. All supported tokens settle through the Solana-based escrow protocol for fast finality.",
  },
  {
    q: "Is crypto OTC trading legal in Dubai?",
    a: "Yes. Dubai and the UAE have established a progressive regulatory framework for virtual assets under VARA (Virtual Assets Regulatory Authority). OTC trading is a recognized activity, and Blip's bonded merchant network ensures that compliance obligations are met at the settlement layer. The protocol itself is permissionless, while individual merchants operate within applicable licensing requirements.",
  },
];

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
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-black/[0.02] dark:bg-white/[0.02] blur-[140px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Crypto OTC Dubai" },
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
            Institutional Grade
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-5xl sm:text-6xl md:text-7xl font-bold text-black dark:text-white tracking-tight leading-[1.1] mb-6"
        >
          Crypto OTC
          <br />
          <span className="text-black/80 dark:text-white/50">
            Trading Dubai.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg sm:text-xl text-black dark:text-white/40 max-w-2xl mb-10 leading-relaxed"
        >
          Execute large-volume crypto trades in Dubai with zero counterparty
          risk. Blip's decentralized OTC desk connects you with bonded
          merchants for escrow-protected, on-chain settlement at
          institutional-grade pricing.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          {/* <Link
            to="/waitlist"
            onClick={() => sounds.click()}
            onMouseEnter={() => sounds.hover()}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold hover:opacity-90 transition-all"
          >
            Start OTC Trading
            <ArrowRight className="w-4 h-4" />
          </Link> */}
           <CTAButton to="/waitlist" className="w-[220px] h-[48px]">Start OTC Trading</CTAButton>
        </motion.div>
      </div>
    </section>
  );
};

/* ============================================
   WHY OTC ON BLIP SECTION
   ============================================ */
const WhyOtcSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: Banknote,
      title: "Large Volume Support",
      desc: "Handle trades from $10K to multi-million dollar volumes. Bonded merchants are capitalized to fill large orders without slippage or order-book impact.",
    },
    {
      icon: Lock,
      title: "Escrow Protection",
      desc: "Every OTC trade is secured by non-custodial smart contracts. Crypto is locked on-chain until fiat delivery is confirmed, eliminating counterparty risk entirely.",
    },
    {
      icon: Zap,
      title: "Competitive Spreads",
      desc: "Multiple bonded merchants compete in real time to fill your OTC request, driving spreads tighter than traditional desks or centralized exchanges.",
    },
    {
      icon: BadgeCheck,
      title: "Bonded Merchants",
      desc: "Every merchant on the network has posted staked collateral. Dishonest behavior results in bond slashing, ensuring accountability at the protocol level.",
    },
  ];

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32 bg-[#FAF8F5] dark:bg-black overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-black/40 dark:text-white/40 mb-4 block">
            Advantages
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-black dark:text-white tracking-tight">
            Why OTC{" "}
            <span className="text-black/80 dark:text-white/50">on Blip</span>
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
   HOW OTC WORKS SECTION
   ============================================ */
const HowOtcWorksSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    {
      num: "01",
      title: "Submit Request",
      desc: "Connect your wallet and submit an OTC trade request specifying the asset, volume, and preferred settlement method. Your request is broadcast to the bonded merchant network.",
      icon: Building2,
    },
    {
      num: "02",
      title: "Merchant Matching",
      desc: "Qualified merchants compete to fill your order in real time. You review offers and select the best rate. No middlemen, no hidden fees -- just direct, transparent pricing.",
      icon: Users,
    },
    {
      num: "03",
      title: "Secure Settlement",
      desc: "Once matched, crypto is locked in escrow. The merchant delivers AED via bank transfer or cash payout. You confirm receipt, and the escrow releases. Fully on-chain, fully auditable.",
      icon: Shield,
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
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-black dark:text-white tracking-tight">
            How OTC{" "}
            <span className="text-black/80 dark:text-white/50">Works</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: i * 0.15 }}
                className="group relative p-8 rounded-2xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] hover:border-black/20 dark:hover:border-white/20 transition-colors duration-500"
                onMouseEnter={() => sounds.hover()}
              >
                <span className="absolute top-4 right-4 text-5xl font-bold text-black/[0.04] dark:text-white/[0.04] select-none">
                  {step.num}
                </span>

                <div className="w-14 h-14 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center mb-6 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors duration-500">
                  <Icon className="w-6 h-6 text-black/60 dark:text-white/60 group-hover:text-black dark:group-hover:text-white transition-colors duration-500" />
                </div>

                <h3 className="text-xl font-semibold text-black dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-black dark:text-white/40 leading-relaxed">
                  {step.desc}
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
   OTC ADVANTAGES SECTION
   ============================================ */
const OtcAdvantagesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const comparisons = [
    {
      icon: Shield,
      title: "No Counterparty Risk",
      traditional: "Trust-based. Funds sent before delivery with no recourse if the other party disappears.",
      blip: "Escrow-secured. Crypto is locked in a smart contract and only released after fiat is confirmed delivered.",
    },
    {
      icon: Scale,
      title: "On-Chain Transparency",
      traditional: "Opaque pricing. Spreads and fees are hidden or bundled into the quoted rate.",
      blip: "Transparent bidding. Merchants compete openly and all settlement activity is verifiable on-chain.",
    },
    {
      icon: Zap,
      title: "Instant Settlement",
      traditional: "Slow settlement. Bank wires can take 1-3 business days, with manual reconciliation required.",
      blip: "Same-day settlement. AED delivered via bank transfer or cash payout, with on-chain confirmation in seconds.",
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
            Blip vs Traditional
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-black dark:text-white tracking-tight">
            OTC{" "}
            <span className="text-black/80 dark:text-white/50">
              Advantages
            </span>
          </h2>
        </motion.div>

        <div className="space-y-6">
          {comparisons.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: i * 0.15 }}
                className="group p-8 rounded-2xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] hover:border-black/20 dark:hover:border-white/20 transition-colors duration-500"
                onMouseEnter={() => sounds.hover()}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors duration-500">
                    <Icon className="w-6 h-6 text-black/60 dark:text-white/60 group-hover:text-black dark:group-hover:text-white transition-colors duration-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-black dark:text-white">
                    {item.title}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 rounded-xl border border-black/[0.06] dark:border-white/[0.04] bg-black/[0.02] dark:bg-white/[0.01]">
                    <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-black/5 dark:bg-white/5 text-black/40 dark:text-white/40 mb-3 inline-block">
                      Traditional OTC
                    </span>
                    <p className="text-sm text-black dark:text-white/40 leading-relaxed">
                      {item.traditional}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-black/[0.08] dark:border-white/[0.06] bg-white/80 dark:bg-white/[0.02]">
                    <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-black/5 dark:bg-white/5 text-black/40 dark:text-white/40 mb-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b35]" />
                      Blip OTC
                    </span>
                    <p className="text-sm text-black dark:text-white/40 leading-relaxed">
                      {item.blip}
                    </p>
                  </div>
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
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * i }}
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
          Crypto OTC Trading in Dubai & UAE
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Blip Money provides a secure, institutional-grade crypto OTC trading
          service in Dubai. Whether you are converting large volumes of USDT,
          USDC, or SOL to AED, or acquiring crypto with fiat, Blip's
          decentralized OTC desk eliminates the counterparty risk, opaque
          pricing, and slow settlement times that define traditional OTC
          brokers in the UAE.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-4"
        >
          Every OTC trade on Blip is protected by non-custodial escrow smart
          contracts deployed on Solana, ensuring that funds are locked on-chain
          until both parties fulfill their obligations. Bonded merchants stake
          collateral to participate, creating a trust-minimized environment
          where large trades can settle safely and transparently. Dubai's
          regulatory clarity under VARA makes it an ideal jurisdiction for
          institutional crypto activity, and Blip's protocol-level
          infrastructure is purpose-built to serve this market.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-4"
        >
          For high-net-worth individuals, crypto funds, and businesses in
          Dubai looking to move large volumes without market impact, Blip's
          OTC service offers competitive spreads driven by real-time merchant
          bidding, same-day AED settlement via bank transfer or cash payout,
          and full on-chain auditability for every transaction.
        </motion.p>
      </motion.div>
    </section>
  );
};

/* ============================================
   CTA BOTTOM SECTION
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
          Ready for OTC{" "}
          <span className="text-black/80 dark:text-white/50">Trading?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg text-black dark:text-white/40 max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Join institutional traders and high-net-worth individuals executing
          large crypto trades through Blip's escrow-protected OTC desk in
          Dubai.
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
            Start OTC Trading
            <ArrowRight className="w-4 h-4" />
          </Link> */}
          <CTAButton to="/waitlist" className="w-[220px] h-[48px]">Start OTC Trading</CTAButton>
        </motion.div>
      </div>
    </section>
  );
};

/* ============================================
   MAIN PAGE COMPONENT
   ============================================ */
const CryptoOtcDubai = () => {
  return (
    <>
      <SEO
        title="Crypto OTC Trading Dubai - Secure Large Trades | Blip Money"
        description="Execute large-volume crypto OTC trades in Dubai with escrow-protected settlement. Competitive spreads, bonded merchants, and on-chain transparency for institutional-grade crypto trading in the UAE."
        canonical="https://blip.money/crypto-otc-dubai"
        keywords="crypto OTC Dubai, OTC trading Dubai, crypto OTC desk UAE, large crypto trades Dubai, institutional crypto Dubai, OTC bitcoin Dubai, USDT OTC Dubai, crypto escrow OTC"
      />
      <HreflangTags path="/crypto-otc-dubai" />
      <StructuredData
        type="custom"
        schema={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.a,
            },
          })),
        }}
      />

      <div className="bg-[#FAF8F5] dark:bg-black text-black dark:text-white overflow-x-hidden">
        <HeroSection />
        <WhyOtcSection />
        <HowOtcWorksSection />
        <OtcAdvantagesSection />
        <FAQSection />
        <SEOContentBlock />
        <CTABottomSection />
      </div>
    </>
  );
};

export default CryptoOtcDubai;
