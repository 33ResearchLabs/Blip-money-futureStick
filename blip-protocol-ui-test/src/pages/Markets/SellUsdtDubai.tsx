import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Wallet,
  Shield,
  Zap,
  Clock,
  ChevronDown,
  Banknote,
  Building2,
  Lock,
  BadgeCheck,
  ArrowLeftRight,
  CreditCard,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "@/components";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { HreflangTags } from "@/components/HreflangTags";
import StructuredData from "@/components/StructuredData";
import { sounds } from "@/lib/sounds";

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
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Sell USDT Dubai" }]} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 backdrop-blur-sm border border-black/[0.06] dark:border-white/10 bg-white/80 dark:bg-white/[0.03]"
        >
          <span className="w-2 h-2 rounded-full bg-[#ff6b35] animate-pulse" />
          <span className="text-xs text-black/60 dark:text-white/60 tracking-wide font-medium">
            Live in Dubai
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-5xl sm:text-6xl md:text-7xl font-bold text-black dark:text-white tracking-tight leading-[1.1] mb-6"
        >
          Sell USDT
          <br />
          <span className="text-black/80 dark:text-white/50">in Dubai.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg sm:text-xl text-black dark:text-white/40 max-w-2xl mb-10 leading-relaxed"
        >
          Convert USDT to AED instantly through Blip's decentralized settlement
          network. Competitive rates, escrow-protected trades, and direct bank
          or cash payout across Dubai and the UAE.
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
            Start Selling USDT
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

/* ============================================
   HOW IT WORKS SECTION
   ============================================ */
const HowItWorksSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    {
      num: "01",
      title: "Connect Your Wallet",
      desc: "Link any Solana-compatible wallet. No sign-ups, no KYC at the protocol level. Your keys, your control.",
      icon: Wallet,
    },
    {
      num: "02",
      title: "Enter Amount & Confirm",
      desc: "Specify how much USDT you want to sell. Bonded merchants compete in real time to offer you the best AED rate.",
      icon: ArrowLeftRight,
    },
    {
      num: "03",
      title: "Receive AED",
      desc: "Once matched, funds are locked in escrow. The merchant sends AED to your bank account or cash payout point. Confirm and release.",
      icon: Banknote,
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
            How It{" "}
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
   WHY SELL USDT ON BLIP SECTION
   ============================================ */
const WhySellSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: Zap,
      title: "Instant Settlement",
      desc: "Merchants compete to fill your order in real time. No waiting for buyers or matching delays.",
    },
    {
      icon: Banknote,
      title: "Low Fees",
      desc: "Competitive merchant bidding drives spreads down. Pay less than traditional exchanges or OTC desks.",
    },
    {
      icon: Lock,
      title: "Escrow Protection",
      desc: "Your USDT is locked in a non-custodial smart contract until the merchant delivers AED. Zero counterparty risk.",
    },
    {
      icon: BadgeCheck,
      title: "No KYC Hassle",
      desc: "Connect your wallet and trade. The protocol is permissionless at the base layer. Merchants handle compliance where required.",
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
            Why Sell USDT{" "}
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
   SUPPORTED PAYMENT METHODS SECTION
   ============================================ */
const PaymentMethodsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const methods = [
    {
      icon: Building2,
      title: "Bank Transfer (AED)",
      desc: "Receive AED directly into your UAE bank account. Supports all major banks including Emirates NBD, ADCB, FAB, and more.",
      badge: "Most Popular",
    },
    {
      icon: Zap,
      title: "Instant Transfer (IPP)",
      desc: "Instant Payment Platform transfers for near-immediate AED delivery to your local bank account during banking hours.",
      badge: "Fastest",
    },
    {
      icon: CreditCard,
      title: "Physical Cash Payout",
      desc: "Collect AED in cash from bonded merchant locations across Dubai and Abu Dhabi. Ideal for high-value, same-day settlement.",
      badge: "In-Person",
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
            Payout Options
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-black dark:text-white tracking-tight">
            Supported{" "}
            <span className="text-black/80 dark:text-white/50">
              Payment Methods
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {methods.map((method, i) => {
            const Icon = method.icon;
            return (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: i * 0.15 }}
                className="group relative p-8 rounded-2xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] hover:border-black/20 dark:hover:border-white/20 transition-colors duration-500 text-center"
                onMouseEnter={() => sounds.hover()}
              >
                {method.badge && (
                  <span className="absolute top-4 right-4 text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-black/5 dark:bg-white/5 text-black/40 dark:text-white/40">
                    {method.badge}
                  </span>
                )}
                <div className="w-16 h-16 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center mx-auto mb-6 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors duration-500">
                  <Icon className="w-7 h-7 text-black/60 dark:text-white/60 group-hover:text-black dark:group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-lg font-semibold text-black dark:text-white mb-3">
                  {method.title}
                </h3>
                <p className="text-sm text-black dark:text-white/40 leading-relaxed">
                  {method.desc}
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
   FAQ SECTION
   ============================================ */
const FAQSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "How do I sell USDT for AED in Dubai?",
      a: "Connect your wallet on Blip, enter the amount of USDT you want to sell, and broadcast a settlement request. Bonded merchants will bid to fill your order. Once matched, your USDT is locked in escrow and the merchant sends AED to your bank account or cash payout point. You confirm receipt and the escrow releases.",
    },
    {
      q: "What is the exchange rate for USDT to AED?",
      a: "Rates are determined by real-time competitive bidding from bonded merchants. This typically results in tighter spreads than centralized exchanges. The estimated rate is shown before you confirm, and the final rate is locked when a merchant accepts your request.",
    },
    {
      q: "Is it safe to sell USDT on Blip in Dubai?",
      a: "Yes. Blip uses non-custodial escrow smart contracts to secure every trade. Your USDT is locked on-chain and only released after the merchant delivers AED and you confirm receipt. Merchants are bonded, meaning they have staked collateral that can be slashed for dishonest behavior.",
    },
    {
      q: "How long does it take to receive AED after selling USDT?",
      a: "Settlement times depend on the payout method. Bank transfers typically settle within a few hours during banking hours. Instant transfers (IPP) can arrive in minutes. Cash payouts can be completed same-day at bonded merchant locations in Dubai and Abu Dhabi.",
    },
    {
      q: "Do I need KYC to sell USDT on Blip?",
      a: "The Blip protocol itself is permissionless and does not require KYC at the protocol level. However, individual settlement merchants may apply their own compliance requirements depending on the payout method and jurisdiction. Wallet-based access is all that is needed to get started.",
    },
  ];

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
   CTA SECTION
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
          Ready to Sell{" "}
          <span className="text-black/80 dark:text-white/50">USDT?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg text-black dark:text-white/40 max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Join thousands of users converting USDT to AED through Blip's
          decentralized settlement network in Dubai.
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
            Start Selling USDT
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
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
          Sell USDT in Dubai & UAE
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Blip Money provides a fast, secure way to sell USDT in Dubai and
          convert Tether to AED through a decentralized settlement protocol.
          Whether you need to sell USDT for AED via bank transfer or cash
          payout, Blip connects you with bonded merchants who compete to offer
          the best rates in real time.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-4"
        >
          Unlike traditional crypto exchanges or informal OTC desks, selling
          USDT on Blip in Dubai is protected by non-custodial escrow smart
          contracts. This ensures your funds are never at risk during the
          settlement process, making it one of the safest ways to convert crypto
          to AED in the UAE.
        </motion.p>
      </motion.div>
    </section>
  );
};

/* ============================================
   MAIN PAGE COMPONENT
   ============================================ */
const SellUsdtDubai = () => {
  return (
    <>
      <SEO
        title="Sell USDT in Dubai - Instant Crypto to AED Conversion | Blip Money"
        description="Sell USDT in Dubai and convert Tether to AED instantly with Blip Money. Escrow-protected trades, competitive rates, and multiple payout options across the UAE."
        canonical="https://blip.money/sell-usdt-dubai"
        keywords="sell USDT Dubai, USDT to AED, sell tether Dubai, crypto to AED Dubai, convert USDT Dubai, sell crypto Dubai, USDT cashout Dubai"
      />
      <HreflangTags path="/sell-usdt-dubai" />
      <StructuredData
        type="custom"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'How do I sell USDT for AED in Dubai?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Connect your wallet on Blip, enter the amount of USDT you want to sell, and broadcast a settlement request. Bonded merchants will bid to fill your order. Once matched, your USDT is locked in escrow and the merchant sends AED to your bank account or cash payout point. You confirm receipt and the escrow releases.',
              },
            },
            {
              '@type': 'Question',
              name: 'What is the exchange rate for USDT to AED?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Rates are determined by real-time competitive bidding from bonded merchants. This typically results in tighter spreads than centralized exchanges. The estimated rate is shown before you confirm, and the final rate is locked when a merchant accepts your request.',
              },
            },
            {
              '@type': 'Question',
              name: 'Is it safe to sell USDT on Blip in Dubai?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. Blip uses non-custodial escrow smart contracts to secure every trade. Your USDT is locked on-chain and only released after the merchant delivers AED and you confirm receipt. Merchants are bonded, meaning they have staked collateral that can be slashed for dishonest behavior.',
              },
            },
            {
              '@type': 'Question',
              name: 'How long does it take to receive AED after selling USDT?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Settlement times depend on the payout method. Bank transfers typically settle within a few hours during banking hours. Instant transfers (IPP) can arrive in minutes. Cash payouts can be completed same-day at bonded merchant locations in Dubai and Abu Dhabi.',
              },
            },
            {
              '@type': 'Question',
              name: 'Do I need KYC to sell USDT on Blip?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'The Blip protocol itself is permissionless and does not require KYC at the protocol level. However, individual settlement merchants may apply their own compliance requirements depending on the payout method and jurisdiction. Wallet-based access is all that is needed to get started.',
              },
            },
          ],
        }}
      />

      <div className="bg-[#FAF8F5] dark:bg-black text-black dark:text-white overflow-x-hidden">
        <HeroSection />
        <HowItWorksSection />
        <WhySellSection />
        <PaymentMethodsSection />
        <FAQSection />
        <SEOContentBlock />
        <CTABottomSection />
      </div>
    </>
  );
};

export default SellUsdtDubai;
