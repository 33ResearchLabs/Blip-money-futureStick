import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Wallet,
  Shield,
  Zap,
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
import { CTAButton } from "@/components/Navbar";

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
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Buy USDT Dubai" }]} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 backdrop-blur-sm border border-black/[0.06] dark:border-white/10 bg-white/80 dark:bg-white/[0.03]"
        >
          <span className="w-2 h-2 rounded-full bg-black dark:bg-white animate-pulse" />
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
          Buy USDT
          <br />
          <span className="text-black/80 dark:text-white/50">in Dubai.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg sm:text-xl text-black dark:text-white/40 max-w-2xl mb-10 leading-relaxed"
        >
          Purchase USDT with AED instantly through Blip's decentralized
          settlement network. Competitive rates, escrow-protected trades, and
          multiple payment options across Dubai and the UAE.
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
            Start Buying USDT
            <ArrowRight className="w-4 h-4" />
          </Link> */}
          <CTAButton to="/waitlist" className="w-[220px] h-[48px]">Start Buying USDT</CTAButton>
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
      title: "Choose Amount",
      desc: "Enter the amount of USDT you want to buy. Bonded merchants compete in real time to offer you the best AED-to-USDT rate.",
      icon: ArrowLeftRight,
    },
    {
      num: "03",
      title: "Receive USDT",
      desc: "Once matched, send AED via bank transfer, instant transfer, or cash. The merchant's USDT is held in escrow and released to your wallet upon confirmation.",
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
          <span className="text-xs uppercase tracking-[0.3em] text-black/80 dark:text-white/40 mb-4 block">
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
   WHY BUY USDT ON BLIP SECTION
   ============================================ */
const WhyBuySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: Zap,
      title: "Instant Settlement",
      desc: "Merchants compete to fill your order in real time. No waiting for sellers or matching delays.",
    },
    {
      icon: Shield,
      title: "Competitive Rates",
      desc: "Competitive merchant bidding drives spreads down. Pay less than traditional exchanges or OTC desks for USDT.",
    },
    {
      icon: Lock,
      title: "Escrow Protection",
      desc: "Merchant USDT is locked in a non-custodial smart contract until your AED payment is confirmed. Zero counterparty risk.",
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
          <span className="text-xs uppercase tracking-[0.3em] text-black/80 dark:text-white/40 mb-4 block">
            Advantages
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-black dark:text-white tracking-tight">
            Why Buy USDT{" "}
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
      desc: "Send AED from your UAE bank account to purchase USDT. Supports all major banks including Emirates NBD, ADCB, FAB, and more.",
      badge: "Most Popular",
    },
    {
      icon: Zap,
      title: "Instant Transfer (IPP)",
      desc: "Use the Instant Payment Platform for near-immediate AED delivery to the merchant, speeding up your USDT purchase during banking hours.",
      badge: "Fastest",
    },
    {
      icon: CreditCard,
      title: "Cash Payment",
      desc: "Pay AED in cash at bonded merchant locations across Dubai and Abu Dhabi. Ideal for high-value, same-day USDT purchases.",
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
          <span className="text-xs uppercase tracking-[0.3em] text-black/80 dark:text-white/40 mb-4 block">
            Payment Options
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
                  <span className="absolute top-4 right-4 text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-black/5 dark:bg-white/5 text-black/80 dark:text-white/40">
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
const faqs = [
  {
    q: "How do I buy USDT with AED in Dubai?",
    a: "Connect your wallet on Blip, enter the amount of USDT you want to buy, and submit a purchase request. Bonded merchants will compete to offer you the best rate. Once matched, the merchant's USDT is locked in escrow. You send AED via bank transfer, instant transfer, or cash. After payment confirmation, the USDT is released directly to your wallet.",
  },
  {
    q: "What is the exchange rate for AED to USDT?",
    a: "Rates are determined by real-time competitive bidding from bonded merchants. This typically results in tighter spreads than centralized exchanges. The estimated rate is shown before you confirm, and the final rate is locked when a merchant accepts your request. Since USDT is pegged to USD, the rate closely tracks the official AED/USD exchange rate of approximately 3.6725.",
  },
  {
    q: "Is it safe to buy USDT on Blip in Dubai?",
    a: "Yes. Blip uses non-custodial escrow smart contracts to secure every trade. The merchant's USDT is locked on-chain before you send any AED, ensuring you are always protected. Merchants are bonded, meaning they have staked collateral that can be slashed for dishonest behavior. You never send money without the USDT already being held in escrow.",
  },
  {
    q: "How long does it take to receive USDT after paying?",
    a: "Once your AED payment is confirmed by the merchant, USDT is released from escrow to your wallet within seconds on Solana. The total time depends on your chosen payment method. Instant transfers (IPP) can confirm in minutes. Bank transfers typically settle within a few hours. Cash payments are confirmed on the spot at merchant locations.",
  },
  {
    q: "Do I need KYC to buy USDT on Blip?",
    a: "The Blip protocol itself is permissionless and does not require KYC at the protocol level. However, individual settlement merchants may apply their own compliance requirements depending on the payment method and jurisdiction. Wallet-based access is all that is needed to get started.",
  },
];

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
          <span className="text-xs uppercase tracking-[0.3em] text-black/80 dark:text-white/40 mb-4 block">
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
          Buy USDT in Dubai & UAE
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Blip Money provides a fast, secure way to buy USDT in Dubai and
          convert AED to Tether through a decentralized settlement protocol.
          Whether you need to buy USDT with AED via bank transfer, instant
          payment, or cash, Blip connects you with bonded merchants who compete
          to offer the best rates in real time. Purchasing USDT in Dubai has
          never been easier or more transparent.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-4"
        >
          Unlike traditional crypto exchanges or informal OTC desks, buying
          USDT on Blip in Dubai is protected by non-custodial escrow smart
          contracts. The merchant's USDT is locked on-chain before you send any
          payment, ensuring your funds are never at risk during the settlement
          process. This makes Blip one of the safest and most reliable ways to
          buy USDT with AED in the UAE.
        </motion.p>
      </motion.div>
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
          Ready to Buy{" "}
          <span className="text-black/80 dark:text-white/50">USDT?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg text-black dark:text-white/40 max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Join thousands of users purchasing USDT with AED through Blip's
          decentralized settlement network in Dubai.
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
            Start Buying USDT
            <ArrowRight className="w-4 h-4" />
          </Link> */}
          <CTAButton to="/waitlist" > Start Buying USDT</CTAButton>

        </motion.div>
      </div>
    </section>
  );
};

/* ============================================
   MAIN PAGE COMPONENT
   ============================================ */
const BuyUsdtDubai = () => {
  return (
    <>
      <SEO
        title="Buy USDT in Dubai - Instant Tether Purchase | Blip Money"
        description="Buy USDT in Dubai and convert AED to Tether instantly with Blip Money. Escrow-protected trades, competitive rates, and multiple payment options across the UAE."
        canonical="https://blip.money/buy-usdt-dubai"
        keywords="buy USDT Dubai, AED to USDT, buy tether Dubai, buy crypto Dubai, purchase USDT Dubai, USDT Dubai price, buy USDT UAE"
      />
      <HreflangTags path="/buy-usdt-dubai" />
      <StructuredData
        type="custom"
        schema={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'How do I buy USDT with AED in Dubai?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Connect your wallet on Blip, enter the amount of USDT you want to buy, and submit a purchase request. Bonded merchants will compete to offer you the best rate. Once matched, the merchant\'s USDT is locked in escrow. You send AED via bank transfer, instant transfer, or cash. After payment confirmation, the USDT is released directly to your wallet.',
              },
            },
            {
              '@type': 'Question',
              name: 'What is the exchange rate for AED to USDT?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Rates are determined by real-time competitive bidding from bonded merchants. This typically results in tighter spreads than centralized exchanges. The estimated rate is shown before you confirm, and the final rate is locked when a merchant accepts your request. Since USDT is pegged to USD, the rate closely tracks the official AED/USD exchange rate of approximately 3.6725.',
              },
            },
            {
              '@type': 'Question',
              name: 'Is it safe to buy USDT on Blip in Dubai?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. Blip uses non-custodial escrow smart contracts to secure every trade. The merchant\'s USDT is locked on-chain before you send any AED, ensuring you are always protected. Merchants are bonded, meaning they have staked collateral that can be slashed for dishonest behavior. You never send money without the USDT already being held in escrow.',
              },
            },
            {
              '@type': 'Question',
              name: 'How long does it take to receive USDT after paying?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Once your AED payment is confirmed by the merchant, USDT is released from escrow to your wallet within seconds on Solana. The total time depends on your chosen payment method. Instant transfers (IPP) can confirm in minutes. Bank transfers typically settle within a few hours. Cash payments are confirmed on the spot at merchant locations.',
              },
            },
            {
              '@type': 'Question',
              name: 'Do I need KYC to buy USDT on Blip?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'The Blip protocol itself is permissionless and does not require KYC at the protocol level. However, individual settlement merchants may apply their own compliance requirements depending on the payment method and jurisdiction. Wallet-based access is all that is needed to get started.',
              },
            },
          ],
        }}
      />

      <div className="bg-[#FAF8F5] dark:bg-black text-black dark:text-white overflow-x-hidden">
        <HeroSection />
        <HowItWorksSection />
        <WhyBuySection />
        <PaymentMethodsSection />
        <FAQSection />
        <SEOContentBlock />
        <CTABottomSection />
      </div>
    </>
  );
};

export default BuyUsdtDubai;
