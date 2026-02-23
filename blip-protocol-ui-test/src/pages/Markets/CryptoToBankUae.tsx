import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Building2,
  Shield,
  Clock,
  DollarSign,
  ChevronDown,
  ArrowRight,
  Check,
  AlertTriangle,
  Zap,
  BadgeCheck,
  Users,
  FileText,
  Scale,
} from "lucide-react";
import SEO from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { HreflangTags } from "@/components/HreflangTags";
import StructuredData from "@/components/StructuredData";
import { sounds } from "@/lib/sounds";

/* ================================================================
   TYPES
   ================================================================ */

interface WithdrawalMethod {
  id: string;
  name: string;
  icon: React.ElementType;
  speed: string;
  fees: string;
  safety: number;
  kycLevel: string;
  supportedBanks: string;
  recommended?: boolean;
  badge?: string;
  description: string;
  steps: string[];
}

interface BankInfo {
  name: string;
  cryptoFriendly: "high" | "medium" | "low";
  restrictions: string;
  tip: string;
}

/* ================================================================
   ANIMATED SECTION WRAPPER
   ================================================================ */

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ================================================================
   FAQ ACCORDION ITEM
   ================================================================ */

function FAQItem({ q, a, open, toggle }: { q: string; a: string; open: boolean; toggle: () => void }) {
  return (
    <div className="border-b border-black/[0.06] dark:border-white/[0.06]">
      <button
        onClick={() => { toggle(); sounds.click(); }}
        className="flex items-center justify-between w-full py-5 text-left"
      >
        <span className="text-[15px] font-semibold text-black dark:text-white pr-8">{q}</span>
        <ChevronDown className={`w-4 h-4 text-black/30 dark:text-white/30 transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-[14px] text-black/50 dark:text-white/40 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================
   SAFETY RATING DOTS
   ================================================================ */

function SafetyRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((dot) => (
        <div
          key={dot}
          className={`w-2 h-2 rounded-full ${
            dot <= rating
              ? "bg-black dark:bg-white"
              : "bg-black/10 dark:bg-white/10"
          }`}
        />
      ))}
      <span className="ml-1.5 text-xs text-black/40 dark:text-white/30">{rating}/5</span>
    </div>
  );
}

/* ================================================================
   DATA: WITHDRAWAL METHODS
   ================================================================ */

const WITHDRAWAL_METHODS: WithdrawalMethod[] = [
  {
    id: "exchange",
    name: "Exchange Withdrawal",
    icon: Building2,
    speed: "1-3 business days",
    fees: "1.5-2.5%",
    safety: 3,
    kycLevel: "Full KYC required",
    supportedBanks: "All major UAE banks",
    description:
      "Sell crypto on a licensed UAE exchange (e.g., Rain, BitOasis) and withdraw AED directly to your bank account. Requires full identity verification and can take several business days for fiat withdrawal.",
    steps: [
      "Create and verify an account on a licensed UAE exchange",
      "Deposit crypto from your wallet to the exchange",
      "Sell crypto for AED on the exchange's order book",
      "Request an AED withdrawal to your linked bank account",
      "Wait 1-3 business days for the funds to arrive",
    ],
  },
  {
    id: "blip",
    name: "P2P / Blip Settlement",
    icon: Shield,
    speed: "5-15 minutes",
    fees: "0.5%",
    safety: 5,
    kycLevel: "Minimal verification",
    supportedBanks: "All major UAE banks",
    recommended: true,
    badge: "Recommended",
    description:
      "Sell crypto through Blip's non-custodial escrow protocol. Your crypto is locked in an on-chain smart contract on Solana while a bonded merchant sends AED to your bank account. Once confirmed, the escrow releases automatically. Fastest, cheapest, and most secure method.",
    steps: [
      "Connect your Solana wallet (Phantom, Solflare, Backpack)",
      "Enter the amount of crypto you want to sell and select AED payout",
      "A bonded merchant matches your order and the escrow locks your crypto",
      "The merchant sends AED directly to your UAE bank account",
      "Confirm receipt and the smart contract releases the crypto to the merchant",
    ],
  },
  {
    id: "atm",
    name: "Crypto ATM",
    icon: DollarSign,
    speed: "Instant (cash)",
    fees: "5-8%",
    safety: 2,
    kycLevel: "Varies by machine",
    supportedBanks: "Cash only (no bank transfer)",
    description:
      "Use a crypto ATM in Dubai or Abu Dhabi to sell BTC or ETH for AED cash. Convenient for small amounts but fees are very high (5-8%). Limited locations and daily withdrawal limits apply. Not suitable for large conversions.",
    steps: [
      "Locate a crypto ATM in Dubai (Mall of Emirates, Dubai Mall, etc.)",
      "Select 'Sell' and choose your cryptocurrency",
      "Scan the QR code and send crypto to the displayed wallet address",
      "Wait for network confirmations (varies by blockchain)",
      "Collect AED cash from the machine",
    ],
  },
  {
    id: "otc",
    name: "OTC Desk",
    icon: Users,
    speed: "Same day",
    fees: "2-5%",
    safety: 3,
    kycLevel: "Full KYC + AML",
    supportedBanks: "Major banks only",
    description:
      "Over-the-counter desks handle large crypto-to-AED trades (typically $10,000+). They offer personalized service and can handle volume, but fees are higher and settlement requires trust in the counterparty. Suitable for high-net-worth individuals and institutional traders.",
    steps: [
      "Contact an OTC desk and negotiate terms (rate, fees, settlement method)",
      "Complete their KYC/AML verification process",
      "Send crypto to their designated wallet address",
      "The OTC desk processes the conversion at the agreed rate",
      "Receive AED via bank wire transfer (same day or next business day)",
    ],
  },
];

/* ================================================================
   DATA: UAE BANKS
   ================================================================ */

const UAE_BANKS: BankInfo[] = [
  {
    name: "Emirates NBD",
    cryptoFriendly: "medium",
    restrictions: "May flag large crypto-related inflows. Requires source of funds documentation for amounts over 50,000 AED.",
    tip: "Label transfers as 'investment returns' or 'digital asset settlement'. Keep transaction documentation ready.",
  },
  {
    name: "ADCB",
    cryptoFriendly: "medium",
    restrictions: "Generally accepts crypto-related transfers but may request additional documentation for repeated large deposits.",
    tip: "Maintain a paper trail of your crypto trades. ADCB's compliance team may contact you for verification.",
  },
  {
    name: "First Abu Dhabi Bank (FAB)",
    cryptoFriendly: "high",
    restrictions: "One of the most crypto-friendly UAE banks. Accepts transfers from licensed exchanges and settlement protocols.",
    tip: "FAB has partnerships with VARA-licensed entities. Mention compliance with VARA regulations if questioned.",
  },
  {
    name: "Mashreq Bank",
    cryptoFriendly: "high",
    restrictions: "Proactively supports crypto and fintech. Mashreq Neo digital banking is particularly accommodating.",
    tip: "Use Mashreq Neo for faster processing. Their digital-first approach means fewer delays on crypto-related transfers.",
  },
  {
    name: "RAK Bank",
    cryptoFriendly: "medium",
    restrictions: "Accepts crypto-related transfers but applies additional scrutiny to amounts above 100,000 AED.",
    tip: "RAK Bank business accounts are generally more accommodating for regular crypto settlements than personal accounts.",
  },
  {
    name: "Dubai Islamic Bank",
    cryptoFriendly: "low",
    restrictions: "Stricter policies on crypto-related transfers due to Sharia compliance considerations. May block or delay transfers.",
    tip: "Consider using a different bank for crypto settlements. If using DIB, ensure transfers come from a VARA-licensed entity.",
  },
];

/* ================================================================
   DATA: FEE COMPARISON
   ================================================================ */

const FEE_COMPARISON = [
  {
    method: "Blip Settlement",
    tradingFee: "0.5%",
    withdrawalFee: "Free",
    exchangeMarkup: "None",
    totalCost: "~50 AED",
    settlementTime: "5-15 min",
    highlight: true,
  },
  {
    method: "Binance P2P",
    tradingFee: "0-1%",
    withdrawalFee: "Free",
    exchangeMarkup: "Varies",
    totalCost: "~100 AED",
    settlementTime: "15-60 min",
    highlight: false,
  },
  {
    method: "Exchange (Rain)",
    tradingFee: "1.5%",
    withdrawalFee: "10 AED",
    exchangeMarkup: "0.5%",
    totalCost: "~210 AED",
    settlementTime: "1-3 days",
    highlight: false,
  },
  {
    method: "Crypto ATM",
    tradingFee: "5-8%",
    withdrawalFee: "None",
    exchangeMarkup: "Built-in",
    totalCost: "~650 AED",
    settlementTime: "Instant",
    highlight: false,
  },
  {
    method: "OTC Desk",
    tradingFee: "2-5%",
    withdrawalFee: "Negotiable",
    exchangeMarkup: "Varies",
    totalCost: "~300 AED",
    settlementTime: "Same day",
    highlight: false,
  },
];

/* ================================================================
   DATA: HOW-TO STEPS
   ================================================================ */

const HOW_TO_STEPS = [
  {
    step: 1,
    title: "Choose your withdrawal method",
    description:
      "Compare exchange withdrawals, P2P settlement (Blip), crypto ATMs, and OTC desks. Consider fees, speed, and safety. For most users, Blip's escrow-protected P2P settlement offers the best balance of cost and security.",
  },
  {
    step: 2,
    title: "Connect wallet or create account",
    description:
      "For Blip: connect your Solana wallet (Phantom, Solflare, or Backpack). For exchanges: create an account and complete KYC verification. For ATMs: no account needed. For OTC: contact the desk directly.",
  },
  {
    step: 3,
    title: "Enter amount and bank details",
    description:
      "Specify how much crypto you want to withdraw and provide your UAE bank account details (IBAN). You will see the exact AED amount you will receive, including all fees and the exchange rate.",
  },
  {
    step: 4,
    title: "Confirm the transaction",
    description:
      "Review the conversion rate, fees, and total AED payout. On Blip, your crypto is locked in a non-custodial escrow smart contract. On exchanges, your sell order is placed on the order book.",
  },
  {
    step: 5,
    title: "Receive AED in your bank",
    description:
      "AED arrives in your UAE bank account. With Blip, this takes 5-15 minutes. Exchanges may take 1-3 business days. Once funds arrive, confirm receipt to release the escrow (Blip) or the process completes automatically (exchange).",
  },
];

/* ================================================================
   DATA: FAQ
   ================================================================ */

const FAQ_DATA = [
  {
    q: "Can I withdraw crypto directly to my UAE bank account?",
    a: "Not directly. UAE banks do not accept cryptocurrency deposits. You need to convert crypto to AED first through a licensed exchange, P2P platform like Blip, crypto ATM, or OTC desk. The converted AED is then sent to your bank account as a standard fiat transfer. Blip automates this entire process through escrow-protected merchant settlement.",
  },
  {
    q: "Which UAE banks accept crypto-related transfers?",
    a: "Most major UAE banks accept AED transfers originating from crypto conversions, though policies vary. First Abu Dhabi Bank (FAB) and Mashreq Bank are generally the most accommodating. Emirates NBD and ADCB accept them but may request source-of-funds documentation for large amounts. Dubai Islamic Bank has stricter policies due to Sharia compliance. Always keep transaction records and be prepared to explain the source of funds.",
  },
  {
    q: "How long does crypto to AED bank transfer take?",
    a: "It depends on the method. Blip's P2P escrow settlement takes 5-15 minutes from initiation to AED in your bank. Binance P2P typically takes 15-60 minutes. Licensed exchanges like Rain or BitOasis take 1-3 business days for fiat withdrawal. Crypto ATMs provide instant cash (no bank transfer). OTC desks usually settle same-day for wire transfers.",
  },
  {
    q: "What fees apply to withdrawing crypto to a UAE bank?",
    a: "Fees vary significantly by method. Blip charges approximately 0.5% with no withdrawal fee. Binance P2P has 0-1% trading fees. Licensed exchanges charge 1.5-2.5% plus withdrawal fees. Crypto ATMs have the highest fees at 5-8%. OTC desks typically charge 2-5% but may negotiate for large volumes. For a 10,000 AED withdrawal, Blip costs around 50 AED versus 650 AED at a crypto ATM.",
  },
  {
    q: "Is it safe to cash out crypto in Dubai?",
    a: "Yes, Dubai is one of the safest jurisdictions for crypto cashout globally. VARA (Virtual Assets Regulatory Authority) provides clear regulatory oversight. Using escrow-protected platforms like Blip adds an additional layer of security, as your crypto is held in a non-custodial smart contract until the AED transfer is confirmed. Avoid unregulated OTC deals and always use platforms with verifiable escrow or licensing.",
  },
  {
    q: "Do I need KYC to withdraw crypto to my bank?",
    a: "KYC requirements depend on the method. Licensed exchanges require full KYC (passport, proof of address, selfie). Blip requires minimal verification (wallet connection + basic identity). Crypto ATMs have varying requirements, with some allowing small transactions without KYC. OTC desks typically require full KYC and AML verification. Your receiving bank may also request documentation for large transfers.",
  },
  {
    q: "What is the maximum amount I can withdraw?",
    a: "There is no universal limit, but each method has its own constraints. Blip supports trades up to merchant liquidity levels (typically up to $50,000+ per trade). Licensed exchanges have daily/monthly limits based on your verification level. Crypto ATMs usually limit withdrawals to 5,000-15,000 AED per transaction. OTC desks can handle virtually unlimited amounts but require negotiation. For amounts over 100,000 AED, expect additional compliance documentation.",
  },
  {
    q: "Can I withdraw crypto to a business bank account in UAE?",
    a: "Yes, you can withdraw crypto proceeds to a UAE business bank account. Business accounts generally face less scrutiny for crypto-related transfers than personal accounts, especially if your trade license covers digital asset activities. Ensure your business is registered appropriately (a free zone license with a technology or trading activity is common). Blip supports both personal and business bank account payouts.",
  },
  {
    q: "What are the tax implications of cashing out crypto in UAE?",
    a: "The UAE has no personal income tax on crypto gains, making it one of the most tax-efficient jurisdictions for crypto cashout. However, businesses earning over 375,000 AED annually are subject to 9% corporate tax. CARF (Crypto-Asset Reporting Framework) requires exchanges and platforms to report user data to tax authorities. Always consult a UAE-based tax advisor for your specific situation.",
  },
  {
    q: "Is there a best time to withdraw crypto to AED?",
    a: "For the best exchange rates, consider market conditions and timing. Stablecoins (USDT, USDC) maintain a consistent AED rate pegged to USD. For volatile assets (BTC, ETH, SOL), rates fluctuate constantly. Bank transfers during UAE banking hours (Sunday-Thursday, 8AM-3PM) process faster. Blip merchants are available 24/7, but bank-side settlement is fastest during business hours.",
  },
];

/* ================================================================
   STRUCTURED DATA SCHEMAS
   ================================================================ */

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Withdraw Crypto to UAE Bank Account",
  description:
    "Step-by-step guide to withdraw cryptocurrency to a UAE bank account in AED. Compare methods, fees, and settlement times.",
  totalTime: "PT15M",
  estimatedCost: { "@type": "MonetaryAmount", currency: "AED", value: "50" },
  step: HOW_TO_STEPS.map((s) => ({
    "@type": "HowToStep",
    position: s.step,
    name: s.title,
    text: s.description,
  })),
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_DATA.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

/* ================================================================
   MAIN PAGE COMPONENT
   ================================================================ */

export default function CryptoToBankUae() {
  const [activeMethod, setActiveMethod] = useState<string | null>("blip");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <SEO
        title="Withdraw Crypto to UAE Bank Account — Step-by-Step Guide | Blip Money"
        description="Learn how to withdraw crypto to your UAE bank account. Compare withdrawal methods, fees, and settlement times. Cash out BTC, ETH, USDT to AED safely with escrow protection."
        canonical="https://blip.money/crypto-to-bank-uae"
        keywords="withdraw crypto to bank UAE, cash out crypto Dubai, crypto to bank account AED, sell crypto UAE bank transfer, USDT to bank account Dubai, cryptocurrency withdrawal UAE"
      />
      <HreflangTags path="/crypto-to-bank-uae" />
      <StructuredData type="custom" schema={howToSchema} />
      <StructuredData type="custom" schema={faqSchema} />

      <div className="min-h-screen bg-[#FAF8F5] dark:bg-transparent">
        {/* ================================================================
            HERO
            ================================================================ */}
        <header className="relative pt-32 sm:pt-36 pb-12 sm:pb-16">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Crypto to Bank UAE" }]} />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
              className="mt-6"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black dark:text-white tracking-tight leading-[1.08] mb-4">
                Withdraw Crypto to
                <br />
                <span className="bg-gradient-to-r from-black/60 to-black/30 dark:from-white/60 dark:to-white/30 bg-clip-text text-transparent">
                  UAE Bank Account
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-black/50 dark:text-white/40 max-w-xl leading-relaxed mb-8">
                Compare every method to cash out crypto to your UAE bank account in AED.
                See real fees, settlement times, and safety ratings side by side.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/waitlist"
                  onClick={() => sounds.click()}
                  onMouseEnter={() => sounds.hover()}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold text-[15px] hover:opacity-90 transition-opacity"
                >
                  Cash Out Now
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#comparison"
                  onClick={() => sounds.click()}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-black/[0.12] dark:border-white/[0.12] text-black/70 dark:text-white/60 font-semibold text-[15px] hover:border-black/[0.25] dark:hover:border-white/[0.25] transition-colors"
                >
                  Compare Methods
                  <ChevronDown className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>
        </header>

        {/* ================================================================
            INTERACTIVE METHOD COMPARISON TOOL
            ================================================================ */}
        <Section className="py-16 sm:py-20 border-t border-black/[0.04] dark:border-white/[0.04]" >
          <div id="comparison" className="max-w-[900px] mx-auto px-4 sm:px-6">
            <div className="mb-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/40 dark:text-white/30 mb-3">
                Interactive Comparison
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-2">
                Choose Your Withdrawal Method
              </h2>
              <p className="text-black/50 dark:text-white/40">
                Click any method to see detailed steps, fees, and supported banks. Each method is rated for speed, cost, and security.
              </p>
            </div>

            {/* Method Cards Grid */}
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {WITHDRAWAL_METHODS.map((method) => {
                const Icon = method.icon;
                const isActive = activeMethod === method.id;

                return (
                  <motion.button
                    key={method.id}
                    onClick={() => {
                      setActiveMethod(isActive ? null : method.id);
                      sounds.click();
                    }}
                    onMouseEnter={() => sounds.hover()}
                    whileTap={{ scale: 0.985 }}
                    className={`relative text-left p-5 sm:p-6 rounded-2xl border transition-all duration-300 ${
                      isActive
                        ? method.recommended
                          ? "bg-white/80 dark:bg-white/[0.04] border-black/[0.15] dark:border-white/[0.12] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.12)]"
                          : "bg-white/90 dark:bg-white/[0.06] border-black/[0.15] dark:border-white/[0.12] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.08)]"
                        : "bg-white/60 dark:bg-white/[0.03] border-black/[0.06] dark:border-white/[0.06] hover:border-black/[0.12] dark:hover:border-white/[0.1]"
                    }`}
                  >
                    {/* Badge */}
                    {method.badge && (
                      <span className="absolute top-4 right-4 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/40 border border-black/[0.06] dark:border-white/[0.06]">
                        {method.badge}
                      </span>
                    )}

                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        method.recommended
                          ? "bg-black/[0.06] dark:bg-white/[0.06]"
                          : "bg-black/5 dark:bg-white/5"
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          method.recommended
                            ? "text-black dark:text-white dark:text-white"
                            : "text-black/40 dark:text-white/40"
                        }`} />
                      </div>
                      <div>
                        <h3 className="text-[15px] font-bold text-black dark:text-white">{method.name}</h3>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/30 dark:text-white/25 block mb-1">Speed</span>
                        <span className="text-sm font-semibold text-black dark:text-white">{method.speed}</span>
                      </div>
                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/30 dark:text-white/25 block mb-1">Fees</span>
                        <span className="text-sm font-semibold text-black dark:text-white">{method.fees}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/30 dark:text-white/25 block mb-1">Safety</span>
                        <SafetyRating rating={method.safety} />
                      </div>
                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/30 dark:text-white/25 block mb-1">KYC</span>
                        <span className="text-xs text-black/50 dark:text-white/40">{method.kycLevel}</span>
                      </div>
                    </div>

                    {/* Expand indicator */}
                    <div className="flex items-center justify-center mt-4 pt-3 border-t border-black/[0.04] dark:border-white/[0.04]">
                      <span className="text-xs text-black/30 dark:text-white/25 mr-1">
                        {isActive ? "Hide details" : "View details"}
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 text-black/30 dark:text-white/25 transition-transform ${isActive ? "rotate-180" : ""}`} />
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Expanded Detail Panel */}
            <AnimatePresence mode="wait">
              {activeMethod && (() => {
                const method = WITHDRAWAL_METHODS.find((m) => m.id === activeMethod);
                if (!method) return null;

                return (
                  <motion.div
                    key={method.id}
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
                    className="overflow-hidden"
                  >
                    <div className={`p-6 sm:p-8 rounded-2xl border ${
                      method.recommended
                        ? "bg-black/[0.02] dark:bg-white/[0.02] border-black/[0.12] dark:border-white/[0.08]"
                        : "bg-white/80 dark:bg-white/[0.04] border-black/[0.08] dark:border-white/[0.06]"
                    } backdrop-blur-xl`}>
                      <div className="flex items-start justify-between mb-5">
                        <div>
                          <h3 className="text-lg font-bold text-black dark:text-white mb-1">{method.name} Details</h3>
                          <p className="text-[14px] text-black/50 dark:text-white/40 leading-relaxed max-w-2xl">{method.description}</p>
                        </div>
                      </div>

                      {/* Info grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 p-4 rounded-xl bg-black/[0.02] dark:bg-white/[0.02]">
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <Clock className="w-3.5 h-3.5 text-black/30 dark:text-white/25" />
                            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/30 dark:text-white/25">Speed</span>
                          </div>
                          <span className="text-sm font-semibold text-black dark:text-white">{method.speed}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <DollarSign className="w-3.5 h-3.5 text-black/30 dark:text-white/25" />
                            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/30 dark:text-white/25">Fees</span>
                          </div>
                          <span className="text-sm font-semibold text-black dark:text-white">{method.fees}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <Shield className="w-3.5 h-3.5 text-black/30 dark:text-white/25" />
                            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/30 dark:text-white/25">Safety</span>
                          </div>
                          <SafetyRating rating={method.safety} />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <Building2 className="w-3.5 h-3.5 text-black/30 dark:text-white/25" />
                            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/30 dark:text-white/25">Banks</span>
                          </div>
                          <span className="text-xs text-black/50 dark:text-white/40">{method.supportedBanks}</span>
                        </div>
                      </div>

                      {/* Steps */}
                      <h4 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/40 dark:text-white/30 mb-3">
                        Step-by-step process
                      </h4>
                      <ol className="space-y-3">
                        {method.steps.map((step, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.08, duration: 0.3 }}
                            className="flex items-start gap-3"
                          >
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                              method.recommended
                                ? "bg-black/[0.06] text-black dark:text-white"
                                : "bg-black/5 dark:bg-white/5 text-black/40 dark:text-white/40"
                            }`}>
                              {i + 1}
                            </div>
                            <span className="text-[14px] text-black/60 dark:text-white/50 leading-relaxed pt-0.5">{step}</span>
                          </motion.li>
                        ))}
                      </ol>

                      {/* CTA for Blip */}
                      {method.recommended && (
                        <div className="mt-6 pt-5 border-t border-black/[0.06] dark:border-white/[0.06]">
                          <Link
                            to="/waitlist"
                            onClick={() => sounds.click()}
                            onMouseEnter={() => sounds.hover()}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold text-[14px] hover:opacity-90 transition-opacity"
                          >
                            Try Blip Settlement
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })()}
            </AnimatePresence>
          </div>
        </Section>

        {/* ================================================================
            HOW TO WITHDRAW - STEP BY STEP
            ================================================================ */}
        <Section className="py-16 sm:py-20 border-t border-black/[0.04] dark:border-white/[0.04]">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/40 dark:text-white/30 mb-3">
              Step-by-Step Guide
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-2">
              How to Withdraw Crypto to UAE Bank
            </h2>
            <p className="text-black/50 dark:text-white/40 mb-10">
              Follow these 5 steps to convert cryptocurrency to AED and receive funds in your UAE bank account.
            </p>

            <div className="space-y-4">
              {HOW_TO_STEPS.map((s, i) => (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.1, duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                  className="flex items-start gap-5 p-5 sm:p-6 rounded-2xl bg-white/60 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06]"
                >
                  <div className="w-10 h-10 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black text-sm font-bold flex-shrink-0">
                    {s.step}
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-black dark:text-white mb-1.5">{s.title}</h3>
                    <p className="text-[14px] text-black/50 dark:text-white/40 leading-relaxed">{s.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* ================================================================
            UAE BANK COMPATIBILITY
            ================================================================ */}
        <Section className="py-16 sm:py-20 border-t border-black/[0.04] dark:border-white/[0.04]">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/40 dark:text-white/30 mb-3">
              Bank Compatibility
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-2">
              UAE Banks &amp; Crypto-Friendliness
            </h2>
            <p className="text-black/50 dark:text-white/40 mb-10">
              Not all UAE banks treat crypto-related transfers equally. Here is how the major banks stack up.
            </p>

            <div className="space-y-4">
              {UAE_BANKS.map((bank, i) => (
                <motion.div
                  key={bank.name}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="p-5 sm:p-6 rounded-2xl bg-white/60 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-black/30 dark:text-white/25 flex-shrink-0" />
                      <h3 className="text-[15px] font-bold text-black dark:text-white">{bank.name}</h3>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold self-start ${
                      bank.cryptoFriendly === "high"
                        ? "bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/40"
                        : bank.cryptoFriendly === "medium"
                        ? "bg-black/5 dark:bg-white/5 text-black/40 dark:text-white/30"
                        : "bg-black/5 dark:bg-white/5 text-black/40 dark:text-white/30"
                    }`}>
                      {bank.cryptoFriendly === "high" && <Check className="w-3 h-3" />}
                      {bank.cryptoFriendly === "medium" && <AlertTriangle className="w-3 h-3" />}
                      {bank.cryptoFriendly === "low" && <AlertTriangle className="w-3 h-3" />}
                      {bank.cryptoFriendly === "high" ? "Crypto Friendly" : bank.cryptoFriendly === "medium" ? "Moderate" : "Restrictive"}
                    </span>
                  </div>
                  <p className="text-[13px] text-black/50 dark:text-white/40 leading-relaxed mb-2">
                    {bank.restrictions}
                  </p>
                  <div className="flex items-start gap-2 mt-3 p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02]">
                    <Zap className="w-3.5 h-3.5 text-black/30 dark:text-white/25 flex-shrink-0 mt-0.5" />
                    <span className="text-[12px] text-black/40 dark:text-white/35 leading-relaxed">
                      <strong className="text-black/60 dark:text-white/50">Tip:</strong> {bank.tip}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* ================================================================
            FEE COMPARISON TABLE
            ================================================================ */}
        <Section className="py-16 sm:py-20 border-t border-black/[0.04] dark:border-white/[0.04]">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/40 dark:text-white/30 mb-3">
              Fee Breakdown
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-2">
              Fee Comparison — Crypto to Bank UAE
            </h2>
            <p className="text-black/50 dark:text-white/40 mb-8">
              Total cost for a 10,000 AED withdrawal across every method. Lower is better.
            </p>

            <div className="bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-black/[0.08] dark:border-white/[0.08]">
                      <th className="text-left px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/40 dark:text-white/30">Method</th>
                      <th className="text-center px-3 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/40 dark:text-white/30">Trading Fee</th>
                      <th className="text-center px-3 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/40 dark:text-white/30">Withdrawal Fee</th>
                      <th className="text-center px-3 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/40 dark:text-white/30 hidden sm:table-cell">Rate Markup</th>
                      <th className="text-center px-3 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/40 dark:text-white/30">Total (10K AED)</th>
                      <th className="text-center px-3 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/40 dark:text-white/30">Settlement</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FEE_COMPARISON.map((row, i) => (
                      <tr
                        key={i}
                        className={`border-b border-black/[0.04] dark:border-white/[0.04] last:border-0 ${
                          row.highlight
                            ? "bg-black/[0.02] dark:bg-white/[0.02]"
                            : ""
                        }`}
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            {row.highlight && (
                              <BadgeCheck className="w-4 h-4 text-black dark:text-white flex-shrink-0" />
                            )}
                            <span className={`font-medium ${
                              row.highlight
                                ? "text-black dark:text-white font-semibold"
                                : "text-black/70 dark:text-white/60"
                            }`}>
                              {row.method}
                            </span>
                          </div>
                        </td>
                        <td className={`px-3 py-3.5 text-center ${row.highlight ? "font-semibold text-black dark:text-white" : "text-black/50 dark:text-white/40"}`}>
                          {row.tradingFee}
                        </td>
                        <td className={`px-3 py-3.5 text-center ${row.highlight ? "font-semibold text-black dark:text-white" : "text-black/50 dark:text-white/40"}`}>
                          {row.withdrawalFee}
                        </td>
                        <td className={`px-3 py-3.5 text-center hidden sm:table-cell ${row.highlight ? "font-semibold text-black dark:text-white" : "text-black/50 dark:text-white/40"}`}>
                          {row.exchangeMarkup}
                        </td>
                        <td className={`px-3 py-3.5 text-center font-semibold ${
                          row.highlight
                            ? "text-black dark:text-white"
                            : "text-black dark:text-white"
                        }`}>
                          {row.totalCost}
                        </td>
                        <td className={`px-3 py-3.5 text-center ${row.highlight ? "font-semibold text-black dark:text-white" : "text-black/50 dark:text-white/40"}`}>
                          {row.settlementTime}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="text-xs text-black/30 dark:text-white/20 mt-4 text-center">
              Estimates based on a 10,000 AED equivalent crypto withdrawal. Actual costs may vary by market conditions and provider.
            </p>
          </div>
        </Section>

        {/* ================================================================
            TAX & COMPLIANCE
            ================================================================ */}
        <Section className="py-16 sm:py-20 border-t border-black/[0.04] dark:border-white/[0.04]">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/40 dark:text-white/30 mb-3">
              Regulatory Overview
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-2">
              Tax &amp; Compliance — Crypto in UAE
            </h2>
            <p className="text-black/50 dark:text-white/40 mb-10">
              The UAE offers one of the most favorable tax environments for cryptocurrency globally. Here is what you need to know.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  icon: DollarSign,
                  title: "No Personal Income Tax",
                  description: "Individual crypto gains are not subject to personal income tax in the UAE. This includes profits from trading, staking, and selling crypto for AED. One of the key reasons the UAE is a global crypto hub.",
                },
                {
                  icon: Scale,
                  title: "9% Corporate Tax",
                  description: "Businesses earning over 375,000 AED annually are subject to 9% corporate tax, effective June 2023. Crypto trading businesses should structure accordingly. Free zone entities may qualify for 0% tax on qualifying income.",
                },
                {
                  icon: FileText,
                  title: "CARF Reporting",
                  description: "The Crypto-Asset Reporting Framework (CARF) requires crypto platforms to collect and report user transaction data to tax authorities. Keep records of all crypto-to-AED conversions for compliance.",
                },
                {
                  icon: BadgeCheck,
                  title: "VARA Regulatory Framework",
                  description: "Dubai's Virtual Assets Regulatory Authority (VARA) provides comprehensive oversight for crypto activities. VARA-licensed platforms offer the highest level of regulatory compliance and consumer protection in the UAE.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-5 sm:p-6 rounded-2xl bg-white/60 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06]"
                >
                  <item.icon className="w-5 h-5 text-black/30 dark:text-white/25 mb-4" />
                  <h3 className="text-[15px] font-bold text-black dark:text-white mb-2">{item.title}</h3>
                  <p className="text-[13px] text-black/50 dark:text-white/40 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08]">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-black/40 dark:text-white/30 flex-shrink-0 mt-0.5" />
                <p className="text-[13px] text-black/60 dark:text-white/40 leading-relaxed">
                  <strong>Disclaimer:</strong> This is general information, not tax or legal advice. Tax regulations change frequently. Consult a UAE-based tax advisor or legal professional for guidance specific to your situation.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* ================================================================
            FAQ
            ================================================================ */}
        <Section className="py-16 sm:py-20 border-t border-black/[0.04] dark:border-white/[0.04]">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/40 dark:text-white/30 mb-3">
              Common Questions
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-2">
              Crypto to Bank UAE — FAQ
            </h2>
            <p className="text-black/50 dark:text-white/40 mb-8">
              Everything you need to know about withdrawing crypto to a UAE bank account.
            </p>

            <div className="bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] rounded-2xl px-6 sm:px-8">
              {FAQ_DATA.map((item, i) => (
                <FAQItem
                  key={i}
                  q={item.q}
                  a={item.a}
                  open={openFaq === i}
                  toggle={() => setOpenFaq(openFaq === i ? null : i)}
                />
              ))}
            </div>
          </div>
        </Section>

        {/* ================================================================
            CTA
            ================================================================ */}
        <Section className="py-16 sm:py-20 border-t border-black/[0.04] dark:border-white/[0.04]">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white mb-4">
              Ready to Cash Out?
            </h2>
            <p className="text-lg text-black/50 dark:text-white/40 max-w-lg mx-auto mb-8">
              Withdraw crypto to your UAE bank account in under 15 minutes.
              Escrow-protected, non-custodial, lowest fees.
            </p>
            <Link
              to="/waitlist"
              onClick={() => sounds.click()}
              onMouseEnter={() => sounds.hover()}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold text-[15px] hover:opacity-90 transition-opacity"
            >
              Get Started with Blip
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-xs text-black/30 dark:text-white/20 mt-4">
              Non-custodial escrow on Solana. Your keys, your crypto.
            </p>
          </div>
        </Section>

        {/* ================================================================
            CROSS-LINKS
            ================================================================ */}
        <section className="border-t border-black/[0.06] dark:border-white/[0.06] bg-[#FAF8F5]/50 dark:bg-white/[0.01]">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-12">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/40 dark:text-white/30 mb-6">
              Related Resources
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Crypto to AED", href: "/crypto-to-aed", desc: "Live converter" },
                { label: "Sell USDT Dubai", href: "/sell-usdt-dubai", desc: "USDT guide" },
                { label: "Crypto Payments UAE", href: "/crypto-payments-uae", desc: "Accept crypto" },
                { label: "How It Works", href: "/how-it-works", desc: "Protocol explained" },
              ].map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => sounds.click()}
                  className="group p-4 rounded-xl bg-white/60 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] hover:border-black/[0.12] dark:hover:border-white/[0.12] transition-colors"
                >
                  <span className="block text-sm font-semibold text-black dark:text-white group-hover:text-black/70 dark:group-hover:text-white/80 transition-colors">
                    {link.label}
                  </span>
                  <span className="block text-xs text-black/30 dark:text-white/25 mt-1">{link.desc}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
