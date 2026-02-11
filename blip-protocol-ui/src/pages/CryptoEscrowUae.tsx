import { useState, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import SEO from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { HreflangTags } from "@/components/HreflangTags";
import StructuredData from "@/components/StructuredData";
import { sounds } from "@/lib/sounds";
import {
  ArrowRight,
  Shield,
  Lock,
  CheckCircle2,
  Users,
  Building2,
  Briefcase,
  Home,
  Code2,
  Scale,
  Search,
  Bug,
  FileCheck,
  ChevronDown,
  ChevronUp,
  ArrowDownUp,
  Landmark,
  Handshake,
  Timer,
  AlertTriangle,
  Gavel,
} from "lucide-react";

/* ═══════════════════════════════════════════════
   STRUCTURED DATA SCHEMAS
   ═══════════════════════════════════════════════ */

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is crypto escrow and how does it work in the UAE?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Crypto escrow is a smart contract mechanism that holds cryptocurrency during a trade until both parties fulfill their obligations. In the UAE, Blip's on-chain escrow locks the buyer's crypto in a Solana smart contract. Once the seller confirms fiat payment (AED), the smart contract automatically releases the crypto. No third party ever holds your funds.",
      },
    },
    {
      "@type": "Question",
      name: "Is crypto escrow legal in the UAE?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Dubai Law No. 16 of 2021 explicitly recognizes smart contracts as legally binding agreements. ADGM and VARA both provide frameworks for digital asset services, including escrow. Blip's non-custodial smart contract escrow aligns with UAE regulatory requirements.",
      },
    },
    {
      "@type": "Question",
      name: "How much does Blip's escrow service cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Blip charges approximately 0.5% of the trade value as an escrow fee. This is significantly lower than traditional escrow services (1-3%) and covers smart contract execution, dispute resolution infrastructure, and on-chain verification.",
      },
    },
    {
      "@type": "Question",
      name: "What happens if there's a dispute during an escrow trade?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "If a buyer or seller raises a dispute, the escrowed funds remain locked in the smart contract. Blip's DAO-governed dispute resolution process reviews on-chain evidence and off-chain proof of payment. Neither party can access the funds until the dispute is resolved fairly.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use crypto escrow for real estate transactions in Dubai?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Blip's escrow supports large-value transactions suitable for property deposits and real estate deals in Dubai. The smart contract can hold any amount of supported crypto and release it upon confirmation of title transfer or deposit receipt.",
      },
    },
    {
      "@type": "Question",
      name: "Which cryptocurrencies are supported for escrow?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Blip's escrow currently supports all Solana-based tokens including USDT, USDC, SOL, and other SPL tokens. The non-custodial smart contract can lock any supported token and release it upon trade completion.",
      },
    },
    {
      "@type": "Question",
      name: "How long does an escrow trade take to complete?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The crypto lock is instant (confirmed within seconds on Solana). The total trade time depends on fiat transfer speed — typically 5-15 minutes for bank transfers within the UAE. The smart contract release is instant once the buyer confirms.",
      },
    },
    {
      "@type": "Question",
      name: "Is Blip's escrow non-custodial?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Blip never holds your funds. The crypto is locked in an audited Solana smart contract — not in a company wallet. Only the smart contract logic can release the funds, and only when the predefined conditions are met. You can verify every escrow transaction on-chain.",
      },
    },
    {
      "@type": "Question",
      name: "What if the buyer doesn't confirm after receiving fiat?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "If the buyer fails to confirm receipt of fiat within the agreed timeframe, the seller can raise a dispute. The dispute resolution process will review bank transfer proof and release the escrowed crypto to the rightful party.",
      },
    },
  ],
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Blip On-Chain Crypto Escrow",
  description:
    "Non-custodial smart contract escrow service for P2P crypto trading, OTC deals, and real estate transactions in the UAE.",
  provider: {
    "@type": "Organization",
    name: "Blip Money",
    url: "https://blip.money",
  },
  areaServed: {
    "@type": "Country",
    name: "United Arab Emirates",
  },
  serviceType: "Cryptocurrency Escrow",
  offers: {
    "@type": "Offer",
    price: "0.5",
    priceCurrency: "USD",
    description: "0.5% escrow fee per transaction",
  },
};

/* ═══════════════════════════════════════════════
   ESCROW FLOW DATA
   ═══════════════════════════════════════════════ */

const ESCROW_STEPS = [
  {
    step: 1,
    title: "Trade Creation",
    description:
      "Buyer and seller agree on trade terms — crypto amount, AED price, and payment method. Both parties connect their wallets to Blip.",
    time: "~1 min",
    dispute:
      "Either party can cancel before locking. No funds are at risk at this stage.",
    icon: Handshake,
    color: "bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/40",
  },
  {
    step: 2,
    title: "Crypto Lock",
    description:
      "Buyer's crypto is locked in a Solana smart contract. The funds are visible on-chain and cannot be withdrawn by either party until conditions are met.",
    time: "~5 sec",
    dispute:
      "If the buyer fails to lock within the agreed time, the trade expires automatically.",
    icon: Lock,
    color: "bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/40",
  },
  {
    step: 3,
    title: "Fiat Transfer",
    description:
      "Seller sends AED to the buyer's bank account via the agreed payment method — bank transfer, InstaPay, or cash deposit.",
    time: "5-15 min",
    dispute:
      "If the seller doesn't send fiat within the time limit, the buyer can reclaim the locked crypto.",
    icon: ArrowDownUp,
    color: "bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/40",
  },
  {
    step: 4,
    title: "Confirmation",
    description:
      "Buyer confirms receipt of AED in their bank account. This triggers the release mechanism in the smart contract.",
    time: "~1 min",
    dispute:
      "If the buyer doesn't confirm within the window, the seller can raise a dispute with bank proof.",
    icon: CheckCircle2,
    color: "bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/40",
  },
  {
    step: 5,
    title: "Release",
    description:
      "Smart contract automatically releases the crypto to the seller's wallet. The trade is complete and recorded on-chain.",
    time: "~5 sec",
    dispute:
      "Release is automatic and irreversible once confirmed. Full on-chain audit trail maintained.",
    icon: Shield,
    color: "bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/40",
  },
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
          items={[
            { label: "Home", href: "/" },
            { label: "UAE", href: "/crypto-payments-uae" },
            { label: "Crypto Escrow UAE" },
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
            Non-Custodial Smart Contract Escrow
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-black dark:text-white tracking-tight leading-[1.1] mb-6"
        >
          Crypto Escrow UAE
          <br />
          <span className="text-black/80 dark:text-white/50">
            On-Chain Protection for Every Trade.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg sm:text-xl text-black/50 dark:text-white/40 max-w-2xl mb-10 leading-relaxed"
        >
          Secure your crypto trades with Blip's on-chain escrow in the UAE.
          Smart contract protection for P2P trading, OTC deals, and real estate
          transactions. Non-custodial, transparent, instant settlement.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-wrap gap-4"
        >
          <Link
            to="/waitlist"
            onClick={() => sounds.click()}
            onMouseEnter={() => sounds.hover()}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold hover:opacity-90 transition-all"
          >
            Start Escrowed Trade
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#how-it-works"
            onClick={() => sounds.click()}
            onMouseEnter={() => sounds.hover()}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-black/[0.08] dark:border-white/[0.06] text-black dark:text-white font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-all"
          >
            See How It Works
          </a>
        </motion.div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════
   INTERACTIVE ESCROW FLOW VISUALIZATION
   ═══════════════════════════════════════════════ */

const EscrowFlowSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [activeStep, setActiveStep] = useState(0);
  const [tradeAmount, setTradeAmount] = useState("10000");

  const escrowFee = useMemo(() => {
    const amount = parseFloat(tradeAmount) || 0;
    return (amount * 0.005).toFixed(2);
  }, [tradeAmount]);

  const netAmount = useMemo(() => {
    const amount = parseFloat(tradeAmount) || 0;
    const fee = amount * 0.005;
    return (amount - fee).toFixed(2);
  }, [tradeAmount]);

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="relative py-16 sm:py-20 bg-[#FAF8F5] dark:bg-transparent border-t border-black/[0.06] dark:border-white/[0.06]"
    >
      <div className="relative z-10 max-w-[900px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/50 dark:text-white/40 mb-4 block">
            Interactive Demo
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-black dark:text-white tracking-tight">
            Escrow Flow{" "}
            <span className="text-black/80 dark:text-white/50">
              Visualization
            </span>
          </h2>
        </motion.div>

        {/* Fee Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-10 p-6 rounded-2xl bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06]"
        >
          <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/50 dark:text-white/40 mb-3 block">
            How much are you trading?
          </label>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative flex-1 w-full">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/30 text-sm">
                AED
              </span>
              <input
                type="number"
                value={tradeAmount}
                onChange={(e) => {
                  setTradeAmount(e.target.value);
                  sounds.tick();
                }}
                className="w-full pl-14 pr-4 py-3 rounded-xl bg-white/60 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] text-black dark:text-white text-lg font-medium focus:outline-none focus:border-black/20 dark:focus:border-white/20 transition-colors"
                placeholder="10000"
                min="0"
              />
            </div>
            <div className="flex gap-6 text-sm">
              <div>
                <span className="text-black/40 dark:text-white/30 text-xs block">
                  Escrow Fee (0.5%)
                </span>
                <span className="text-black dark:text-white font-semibold">
                  AED {escrowFee}
                </span>
              </div>
              <div>
                <span className="text-black/40 dark:text-white/30 text-xs block">
                  Seller Receives
                </span>
                <span className="text-black dark:text-white font-semibold">
                  AED {netAmount}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Step-by-step flow */}
        <div className="space-y-4">
          {ESCROW_STEPS.map((item, i) => {
            const Icon = item.icon;
            const isActive = activeStep === i;

            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
              >
                <button
                  onClick={() => {
                    setActiveStep(isActive ? -1 : i);
                    sounds.click();
                  }}
                  onMouseEnter={() => sounds.hover()}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 ${
                    isActive
                      ? "bg-white/80 dark:bg-white/[0.04] border-black/[0.12] dark:border-white/[0.1]"
                      : "bg-white/60 dark:bg-white/[0.03] border-black/[0.06] dark:border-white/[0.06] hover:border-black/[0.1] dark:hover:border-white/[0.08]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/30 dark:text-white/20">
                          Step {item.step}
                        </span>
                        <span className="text-xs text-black/30 dark:text-white/20">
                          {item.time}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-black dark:text-white">
                        {item.title}
                      </h3>
                    </div>
                    {isActive ? (
                      <ChevronUp className="w-4 h-4 text-black/30 dark:text-white/30 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-black/30 dark:text-white/30 flex-shrink-0" />
                    )}
                  </div>

                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pl-14 space-y-3"
                    >
                      <p className="text-sm text-black/50 dark:text-white/40 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="flex items-start gap-2 p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.06]">
                        <AlertTriangle className="w-4 h-4 text-black/40 dark:text-white/30 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-black/60 dark:text-white/40 leading-relaxed">
                          <span className="font-semibold">Dispute scenario:</span>{" "}
                          {item.dispute}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </button>

                {/* Connector line */}
                {i < ESCROW_STEPS.length - 1 && (
                  <div className="flex justify-center py-1">
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={isInView ? { scaleY: 1 } : {}}
                      transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                      className="w-px h-6 bg-black/10 dark:bg-white/10 origin-top"
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════
   HOW ON-CHAIN ESCROW WORKS (DETAILED)
   ═══════════════════════════════════════════════ */

const HowItWorksSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative py-16 sm:py-20 bg-[#FAF8F5] dark:bg-transparent border-t border-black/[0.06] dark:border-white/[0.06]"
    >
      <div className="relative z-10 max-w-[900px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/50 dark:text-white/40 mb-4 block">
            Deep Dive
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-black dark:text-white tracking-tight mb-4">
            How On-Chain Escrow{" "}
            <span className="text-black/80 dark:text-white/50">Works</span>
          </h2>
          <p className="text-black/50 dark:text-white/40 max-w-2xl leading-relaxed">
            Blip's escrow is powered by audited Solana smart contracts. Every
            step is verifiable on-chain. No intermediary ever touches your funds.
          </p>
        </motion.div>

        <div className="space-y-6">
          {ESCROW_STEPS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="group flex gap-5 p-6 rounded-2xl bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] hover:border-black/[0.12] dark:hover:border-white/[0.1] transition-colors duration-500"
                onMouseEnter={() => sounds.hover()}
              >
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  <div
                    className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono text-black/30 dark:text-white/20">
                    {item.time}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                    Step {item.step}: {item.title}
                  </h3>
                  <p className="text-sm text-black/50 dark:text-white/40 leading-relaxed mb-3">
                    {item.description}
                  </p>
                  <div className="flex items-start gap-2 text-xs text-black/40 dark:text-white/30">
                    <Timer className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>If disputed:</strong> {item.dispute}
                    </span>
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

/* ═══════════════════════════════════════════════
   USE CASES
   ═══════════════════════════════════════════════ */

const useCases = [
  {
    icon: Users,
    title: "P2P Trading",
    description:
      "Protect both parties in peer-to-peer crypto trades. Escrow ensures the buyer's crypto is safe until fiat payment is confirmed, eliminating the risk of send-first scams.",
  },
  {
    icon: Building2,
    title: "OTC Deals",
    description:
      "Secure large-volume over-the-counter transactions. Whether you're trading $10K or $1M, the same smart contract logic protects every dirham of your trade.",
  },
  {
    icon: Home,
    title: "Real Estate",
    description:
      "Hold deposits for Dubai property transactions in crypto. The escrow releases upon confirmation of title transfer or deposit receipt, bridging crypto and real estate.",
  },
  {
    icon: Code2,
    title: "Freelancing",
    description:
      "Milestone-based payment protection for services. Clients lock payment upfront; freelancers receive funds as milestones are completed and approved.",
  },
  {
    icon: Briefcase,
    title: "Business Transactions",
    description:
      "B2B crypto payment security for invoices, contracts, and recurring agreements. Automate payment release upon delivery confirmation or service completion.",
  },
];

const UseCasesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative py-16 sm:py-20 bg-[#FAF8F5] dark:bg-transparent border-t border-black/[0.06] dark:border-white/[0.06]"
    >
      <div className="relative z-10 max-w-[900px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/50 dark:text-white/40 mb-4 block">
            Applications
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-black dark:text-white tracking-tight">
            Use Cases for{" "}
            <span className="text-black/80 dark:text-white/50">
              Crypto Escrow
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {useCases.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group p-6 rounded-2xl bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] hover:border-black/[0.12] dark:hover:border-white/[0.1] transition-colors duration-500"
                onMouseEnter={() => sounds.hover()}
              >
                <div className="w-11 h-11 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center mb-4 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors duration-500">
                  <Icon className="w-5 h-5 text-black/60 dark:text-white/60 group-hover:text-black dark:group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-base font-semibold text-black dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-black/50 dark:text-white/40 leading-relaxed">
                  {item.description}
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
   COMPARISON TABLE
   ═══════════════════════════════════════════════ */

const comparisonData = [
  {
    feature: "Speed",
    blip: "Instant lock, 15min settle",
    traditional: "Days to weeks",
    exchange: "Minutes to hours",
  },
  {
    feature: "Cost",
    blip: "0.5%",
    traditional: "1-3%",
    exchange: "0-1%",
  },
  {
    feature: "Transparency",
    blip: "Fully on-chain, verifiable",
    traditional: "Opaque",
    exchange: "Internal only",
  },
  {
    feature: "Custody",
    blip: "Non-custodial (smart contract)",
    traditional: "Third-party holds funds",
    exchange: "Exchange holds funds",
  },
  {
    feature: "Dispute Resolution",
    blip: "DAO-governed",
    traditional: "Legal process",
    exchange: "Exchange decides",
  },
  {
    feature: "Trust Required",
    blip: "Zero (code-is-law)",
    traditional: "High (trust the agent)",
    exchange: "Medium (trust the exchange)",
  },
  {
    feature: "Regulatory",
    blip: "VARA-aligned",
    traditional: "Varies",
    exchange: "Varies",
  },
  {
    feature: "Account Freeze Risk",
    blip: "Zero",
    traditional: "Low",
    exchange: "High",
  },
];

const ComparisonSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative py-16 sm:py-20 bg-[#FAF8F5] dark:bg-transparent border-t border-black/[0.06] dark:border-white/[0.06]"
    >
      <div className="relative z-10 max-w-[900px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/50 dark:text-white/40 mb-4 block">
            Comparison
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-black dark:text-white tracking-tight">
            On-Chain vs{" "}
            <span className="text-black/80 dark:text-white/50">
              Traditional Escrow
            </span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="overflow-x-auto rounded-2xl border border-black/[0.08] dark:border-white/[0.06]"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/80 dark:bg-white/[0.04] border-b border-black/[0.06] dark:border-white/[0.06]">
                <th className="text-left p-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/50 dark:text-white/40">
                  Feature
                </th>
                <th className="text-left p-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-black dark:text-white">
                  Blip On-Chain
                </th>
                <th className="text-left p-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/50 dark:text-white/40">
                  Traditional
                </th>
                <th className="text-left p-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/50 dark:text-white/40">
                  Exchange
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, i) => (
                <tr
                  key={row.feature}
                  className={`border-b border-black/[0.04] dark:border-white/[0.04] last:border-0 ${
                    i % 2 === 0
                      ? "bg-white/60 dark:bg-white/[0.02]"
                      : "bg-white/40 dark:bg-transparent"
                  }`}
                >
                  <td className="p-4 text-black/60 dark:text-white/50 font-medium">
                    {row.feature}
                  </td>
                  <td className="p-4 text-black dark:text-white font-medium">
                    {row.blip}
                  </td>
                  <td className="p-4 text-black/50 dark:text-white/40">
                    {row.traditional}
                  </td>
                  <td className="p-4 text-black/50 dark:text-white/40">
                    {row.exchange}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════
   UAE LEGAL FRAMEWORK
   ═══════════════════════════════════════════════ */

const legalItems = [
  {
    icon: Gavel,
    title: "Dubai Law No. 16 of 2021",
    description:
      "Dubai's landmark legislation explicitly recognizes smart contracts as legally enforceable agreements. This means Blip's on-chain escrow contracts carry legal weight in Dubai courts, providing an additional layer of protection beyond the cryptographic guarantees.",
  },
  {
    icon: Landmark,
    title: "ADGM's Digital Asset Framework",
    description:
      "Abu Dhabi Global Market's Financial Services Regulatory Authority (FSRA) has established a comprehensive framework for digital asset activities. This includes provisions for custodial and non-custodial services, settlement systems, and smart contract-based financial services.",
  },
  {
    icon: Scale,
    title: "VARA's Position on Escrow",
    description:
      "Dubai's Virtual Assets Regulatory Authority classifies escrow services under its virtual asset service provider (VASP) framework. VARA's approach distinguishes between custodial escrow (where a company holds funds) and non-custodial escrow (smart contract-based), with Blip's model falling into the latter category.",
  },
  {
    icon: Shield,
    title: "Why UAE Is the Best Jurisdiction",
    description:
      "The UAE combines legal recognition of smart contracts, zero personal income tax, a dedicated crypto regulatory body, and a business-friendly environment. No other jurisdiction offers this combination for crypto escrow services, making UAE the global gold standard for on-chain settlement.",
  },
];

const LegalFrameworkSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative py-16 sm:py-20 bg-[#FAF8F5] dark:bg-transparent border-t border-black/[0.06] dark:border-white/[0.06]"
    >
      <div className="relative z-10 max-w-[900px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/50 dark:text-white/40 mb-4 block">
            Legal
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-black dark:text-white tracking-tight mb-4">
            UAE Legal Framework{" "}
            <span className="text-black/80 dark:text-white/50">
              for Smart Contracts
            </span>
          </h2>
          <p className="text-black/50 dark:text-white/40 max-w-2xl leading-relaxed">
            The UAE has built the world's most progressive legal framework for
            smart contracts and digital assets — a key reason why Blip's escrow
            operates from this jurisdiction.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {legalItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group p-6 rounded-2xl bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] hover:border-black/[0.12] dark:hover:border-white/[0.1] transition-colors duration-500"
                onMouseEnter={() => sounds.hover()}
              >
                <div className="w-11 h-11 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center mb-4 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors duration-500">
                  <Icon className="w-5 h-5 text-black/60 dark:text-white/60 group-hover:text-black dark:group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-base font-semibold text-black dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-black/50 dark:text-white/40 leading-relaxed">
                  {item.description}
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
   SECURITY & AUDIT
   ═══════════════════════════════════════════════ */

const securityItems = [
  {
    icon: FileCheck,
    title: "Smart Contract Audit",
    description:
      "Blip's escrow smart contracts have been audited by independent security firms. The audit covers reentrancy protection, overflow checks, access control, and fund safety. Full audit reports are published on-chain for transparency.",
  },
  {
    icon: Bug,
    title: "Bug Bounty Program",
    description:
      "We maintain an active bug bounty program rewarding security researchers who identify vulnerabilities. Critical findings are eligible for bounties up to $50,000, ensuring continuous security improvement from the global community.",
  },
  {
    icon: Search,
    title: "On-Chain Verification",
    description:
      "Every escrow transaction is verifiable on Solana's blockchain via Blip Scan. You can independently verify that funds are locked, the contract state, release conditions, and the full transaction history — all without trusting Blip.",
  },
  {
    icon: Lock,
    title: "Non-Custodial Architecture",
    description:
      "Blip never holds your crypto. The smart contract is the sole custodian during a trade. Even Blip's team cannot access, redirect, or freeze escrowed funds. The code enforces the rules — not a company policy.",
  },
];

const SecuritySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="relative py-16 sm:py-20 bg-[#FAF8F5] dark:bg-transparent border-t border-black/[0.06] dark:border-white/[0.06]"
    >
      <div className="relative z-10 max-w-[900px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/50 dark:text-white/40 mb-4 block">
            Security
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-black dark:text-white tracking-tight mb-4">
            Security{" "}
            <span className="text-black/80 dark:text-white/50">& Audit</span>
          </h2>
          <p className="text-black/50 dark:text-white/40 max-w-2xl leading-relaxed">
            Trust the code, not the company. Blip's escrow is built on audited,
            open-source smart contracts with multiple layers of protection.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {securityItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group p-6 rounded-2xl bg-white/60 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] hover:border-black/[0.1] dark:hover:border-white/[0.08] transition-colors duration-500"
                onMouseEnter={() => sounds.hover()}
              >
                <div className="w-11 h-11 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center mb-4 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors duration-500">
                  <Icon className="w-5 h-5 text-black/60 dark:text-white/60 group-hover:text-black dark:group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-base font-semibold text-black dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-black/50 dark:text-white/40 leading-relaxed">
                  {item.description}
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

const faqItems = [
  {
    q: "What is crypto escrow and how does it work in the UAE?",
    a: "Crypto escrow is a smart contract mechanism that holds cryptocurrency during a trade until both parties fulfill their obligations. In the UAE, Blip's on-chain escrow locks the buyer's crypto in a Solana smart contract. Once the seller confirms fiat payment (AED), the smart contract automatically releases the crypto. No third party ever holds your funds.",
  },
  {
    q: "Is crypto escrow legal in the UAE?",
    a: "Yes. Dubai Law No. 16 of 2021 explicitly recognizes smart contracts as legally binding agreements. ADGM and VARA both provide frameworks for digital asset services, including escrow. Blip's non-custodial smart contract escrow aligns with UAE regulatory requirements.",
  },
  {
    q: "How much does Blip's escrow service cost?",
    a: "Blip charges approximately 0.5% of the trade value as an escrow fee. This is significantly lower than traditional escrow services (1-3%) and covers smart contract execution, dispute resolution infrastructure, and on-chain verification.",
  },
  {
    q: "What happens if there's a dispute during an escrow trade?",
    a: "If a buyer or seller raises a dispute, the escrowed funds remain locked in the smart contract. Blip's DAO-governed dispute resolution process reviews on-chain evidence and off-chain proof of payment. Neither party can access the funds until the dispute is resolved fairly.",
  },
  {
    q: "Can I use crypto escrow for real estate transactions in Dubai?",
    a: "Yes. Blip's escrow supports large-value transactions suitable for property deposits and real estate deals in Dubai. The smart contract can hold any amount of supported crypto and release it upon confirmation of title transfer or deposit receipt.",
  },
  {
    q: "Which cryptocurrencies are supported for escrow?",
    a: "Blip's escrow currently supports all Solana-based tokens including USDT, USDC, SOL, and other SPL tokens. The non-custodial smart contract can lock any supported token and release it upon trade completion.",
  },
  {
    q: "How long does an escrow trade take to complete?",
    a: "The crypto lock is instant (confirmed within seconds on Solana). The total trade time depends on fiat transfer speed — typically 5-15 minutes for bank transfers within the UAE. The smart contract release is instant once the buyer confirms.",
  },
  {
    q: "Is Blip's escrow non-custodial?",
    a: "Yes. Blip never holds your funds. The crypto is locked in an audited Solana smart contract — not in a company wallet. Only the smart contract logic can release the funds, and only when the predefined conditions are met. You can verify every escrow transaction on-chain.",
  },
  {
    q: "What if the buyer doesn't confirm after receiving fiat?",
    a: "If the buyer fails to confirm receipt of fiat within the agreed timeframe, the seller can raise a dispute. The dispute resolution process will review bank transfer proof and release the escrowed crypto to the rightful party.",
  },
];

const FAQSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      ref={ref}
      className="relative py-16 sm:py-20 bg-[#FAF8F5] dark:bg-transparent border-t border-black/[0.06] dark:border-white/[0.06]"
    >
      <div className="relative z-10 max-w-[900px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/50 dark:text-white/40 mb-4 block">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-black dark:text-white tracking-tight">
            Frequently Asked{" "}
            <span className="text-black/80 dark:text-white/50">Questions</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <button
                onClick={() => {
                  setOpenIndex(openIndex === i ? null : i);
                  sounds.click();
                }}
                onMouseEnter={() => sounds.hover()}
                className="w-full text-left p-5 rounded-2xl bg-white/60 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] hover:border-black/[0.1] dark:hover:border-white/[0.08] transition-all duration-300"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-sm font-semibold text-black dark:text-white leading-snug">
                    {item.q}
                  </h3>
                  {openIndex === i ? (
                    <ChevronUp className="w-4 h-4 text-black/30 dark:text-white/30 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-black/30 dark:text-white/30 flex-shrink-0" />
                  )}
                </div>
                {openIndex === i && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                    className="mt-3 text-sm text-black/50 dark:text-white/40 leading-relaxed"
                  >
                    {item.a}
                  </motion.p>
                )}
              </button>
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

  return (
    <section
      ref={ref}
      className="relative py-16 sm:py-20 bg-[#FAF8F5] dark:bg-transparent border-t border-black/[0.06] dark:border-white/[0.06]"
    >
      <div className="relative z-10 max-w-[900px] mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl font-bold text-black dark:text-white tracking-tight mb-6"
        >
          Ready to Trade{" "}
          <span className="text-black/80 dark:text-white/50">
            with Confidence?
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg text-black/50 dark:text-white/40 max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Start using Blip's on-chain escrow for secure, non-custodial crypto
          trading in the UAE. No sign-up required — just connect your wallet.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          <Link
            to="/waitlist"
            onClick={() => sounds.click()}
            onMouseEnter={() => sounds.hover()}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold hover:opacity-90 transition-all"
          >
            Start Escrowed Trade
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Cross-links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-3 text-sm"
        >
          <Link
            to="/crypto-payments-uae"
            className="px-4 py-2 rounded-full border border-black/[0.06] dark:border-white/[0.06] text-black/50 dark:text-white/40 hover:text-black dark:hover:text-white hover:border-black/[0.12] dark:hover:border-white/[0.1] transition-all"
            onMouseEnter={() => sounds.hover()}
          >
            Crypto Payments UAE
          </Link>
          <Link
            to="/crypto-to-aed"
            className="px-4 py-2 rounded-full border border-black/[0.06] dark:border-white/[0.06] text-black/50 dark:text-white/40 hover:text-black dark:hover:text-white hover:border-black/[0.12] dark:hover:border-white/[0.1] transition-all"
            onMouseEnter={() => sounds.hover()}
          >
            Crypto to AED
          </Link>
          <Link
            to="/crypto-salary-uae"
            className="px-4 py-2 rounded-full border border-black/[0.06] dark:border-white/[0.06] text-black/50 dark:text-white/40 hover:text-black dark:hover:text-white hover:border-black/[0.12] dark:hover:border-white/[0.1] transition-all"
            onMouseEnter={() => sounds.hover()}
          >
            Crypto Salary UAE
          </Link>
          <Link
            to="/how-it-works"
            className="px-4 py-2 rounded-full border border-black/[0.06] dark:border-white/[0.06] text-black/50 dark:text-white/40 hover:text-black dark:hover:text-white hover:border-black/[0.12] dark:hover:border-white/[0.1] transition-all"
            onMouseEnter={() => sounds.hover()}
          >
            How Blip Works
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════ */

const CryptoEscrowUae = () => {
  return (
    <>
      <SEO
        title="Crypto Escrow UAE — On-Chain Smart Contract Escrow Service | Blip Money"
        description="Secure your crypto trades with on-chain escrow in the UAE. Smart contract protection for P2P trading, OTC deals, and real estate transactions. Non-custodial, transparent, instant settlement."
        canonical="https://blip.money/crypto-escrow-uae"
        keywords="crypto escrow UAE, crypto escrow service Dubai, smart contract escrow, on-chain escrow, crypto escrow real estate, P2P crypto escrow UAE, non-custodial escrow"
      />
      <HreflangTags path="/crypto-escrow-uae" />
      <StructuredData type="custom" schema={faqSchema} />
      <StructuredData type="custom" schema={serviceSchema} />

      <div className="bg-[#FAF8F5] dark:bg-transparent text-black dark:text-white overflow-x-hidden">
        <HeroSection />
        <EscrowFlowSection />
        <HowItWorksSection />
        <UseCasesSection />
        <ComparisonSection />
        <LegalFrameworkSection />
        <SecuritySection />
        <FAQSection />
        <CTASection />
      </div>
    </>
  );
};

export default CryptoEscrowUae;
