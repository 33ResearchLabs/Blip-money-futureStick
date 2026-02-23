import { useState, useRef, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  Send,
  Globe,
  Clock,
  DollarSign,
  ChevronDown,
  ArrowRight,
  Check,
  Shield,
  Zap,
  TrendingDown,
  Users,
} from "lucide-react";
import SEO from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { HreflangTags } from "@/components/HreflangTags";
import StructuredData from "@/components/StructuredData";
import { sounds } from "@/lib/sounds";

/* ═══════════════════════════════════════════════
   TYPES & CONSTANTS
   ═══════════════════════════════════════════════ */

interface Corridor {
  name: string;
  flag: string;
  currency: string;
  rate: number;
  bankFee: number;
  wuFee: number;
  wiseFee: number;
  blipFee: number;
  bankMarkup: number;
  wuMarkup: number;
  wiseMarkup: number;
  blipMarkup: number;
}

const CORRIDORS: Record<string, Corridor> = {
  INR: { name: "India", flag: "\u{1F1EE}\u{1F1F3}", currency: "INR", rate: 22.5, bankFee: 50, wuFee: 35, wiseFee: 15, blipFee: 5, bankMarkup: 0.04, wuMarkup: 0.055, wiseMarkup: 0.007, blipMarkup: 0.003 },
  PKR: { name: "Pakistan", flag: "\u{1F1F5}\u{1F1F0}", currency: "PKR", rate: 75.8, bankFee: 50, wuFee: 40, wiseFee: 18, blipFee: 5, bankMarkup: 0.05, wuMarkup: 0.06, wiseMarkup: 0.01, blipMarkup: 0.003 },
  PHP: { name: "Philippines", flag: "\u{1F1F5}\u{1F1ED}", currency: "PHP", rate: 15.2, bankFee: 45, wuFee: 30, wiseFee: 12, blipFee: 5, bankMarkup: 0.035, wuMarkup: 0.05, wiseMarkup: 0.006, blipMarkup: 0.003 },
  BDT: { name: "Bangladesh", flag: "\u{1F1E7}\u{1F1E9}", currency: "BDT", rate: 32.6, bankFee: 55, wuFee: 38, wiseFee: 16, blipFee: 5, bankMarkup: 0.045, wuMarkup: 0.06, wiseMarkup: 0.009, blipMarkup: 0.003 },
  NPR: { name: "Nepal", flag: "\u{1F1F3}\u{1F1F5}", currency: "NPR", rate: 36.0, bankFee: 60, wuFee: 42, wiseFee: 20, blipFee: 5, bankMarkup: 0.05, wuMarkup: 0.065, wiseMarkup: 0.01, blipMarkup: 0.003 },
  LKR: { name: "Sri Lanka", flag: "\u{1F1F1}\u{1F1F0}", currency: "LKR", rate: 81.2, bankFee: 55, wuFee: 38, wiseFee: 17, blipFee: 5, bankMarkup: 0.045, wuMarkup: 0.058, wiseMarkup: 0.008, blipMarkup: 0.003 },
  EGP: { name: "Egypt", flag: "\u{1F1EA}\u{1F1EC}", currency: "EGP", rate: 13.4, bankFee: 50, wuFee: 35, wiseFee: 14, blipFee: 5, bankMarkup: 0.04, wuMarkup: 0.055, wiseMarkup: 0.007, blipMarkup: 0.003 },
};

const CORRIDOR_KEYS = Object.keys(CORRIDORS);

/* ═══════════════════════════════════════════════
   CALCULATOR LOGIC
   ═══════════════════════════════════════════════ */

function calculateTransfer(amount: number, corridor: Corridor) {
  // Bank Wire
  const bankNetAmount = amount - corridor.bankFee;
  const bankMarkupCost = amount * corridor.bankMarkup;
  const bankTotalCost = corridor.bankFee + bankMarkupCost;
  const bankReceived = bankNetAmount * corridor.rate * (1 - corridor.bankMarkup);

  // Western Union
  const wuNetAmount = amount - corridor.wuFee;
  const wuMarkupCost = amount * corridor.wuMarkup;
  const wuTotalCost = corridor.wuFee + wuMarkupCost;
  const wuReceived = wuNetAmount * corridor.rate * (1 - corridor.wuMarkup);

  // Wise
  const wiseNetAmount = amount - corridor.wiseFee;
  const wiseMarkupCost = amount * corridor.wiseMarkup;
  const wiseTotalCost = corridor.wiseFee + wiseMarkupCost;
  const wiseReceived = wiseNetAmount * corridor.rate * (1 - corridor.wiseMarkup);

  // Blip (Crypto)
  const blipNetAmount = amount - corridor.blipFee;
  const blipMarkupCost = amount * corridor.blipMarkup;
  const blipTotalCost = corridor.blipFee + blipMarkupCost;
  const blipReceived = blipNetAmount * corridor.rate * (1 - corridor.blipMarkup);

  const savingsVsBank = bankTotalCost - blipTotalCost;
  const savingsVsWu = wuTotalCost - blipTotalCost;
  const savingsVsWise = wiseTotalCost - blipTotalCost;
  const bestSavings = Math.max(savingsVsBank, savingsVsWu);
  const annualSavings = bestSavings * 12;

  return {
    bank: { fee: corridor.bankFee, markupCost: bankMarkupCost, totalCost: bankTotalCost, received: bankReceived },
    wu: { fee: corridor.wuFee, markupCost: wuMarkupCost, totalCost: wuTotalCost, received: wuReceived },
    wise: { fee: corridor.wiseFee, markupCost: wiseMarkupCost, totalCost: wiseTotalCost, received: wiseReceived },
    blip: { fee: corridor.blipFee, markupCost: blipMarkupCost, totalCost: blipTotalCost, received: blipReceived },
    savingsVsBank,
    savingsVsWu,
    savingsVsWise,
    bestSavings,
    annualSavings,
  };
}

/* ═══════════════════════════════════════════════
   FAQ DATA
   ═══════════════════════════════════════════════ */

const FAQ_DATA = [
  {
    q: "Is it legal to send money from UAE using crypto?",
    a: "Yes. The UAE has a progressive regulatory framework for virtual assets. Dubai's VARA and Abu Dhabi's ADGM FSRA regulate crypto activities. Using crypto to facilitate remittances is legal, though specific regulations around money transmission apply. Blip operates within these guidelines, using stablecoins as a settlement rail rather than as a speculative instrument.",
  },
  {
    q: "How much can I save on remittance fees with crypto?",
    a: "Depending on the corridor and amount, you can save 70-90% compared to traditional bank wires and services like Western Union. For a typical 1,000 AED transfer, bank fees plus exchange rate markups can cost 80-90 AED, while crypto remittance through Blip costs approximately 8-10 AED total. That translates to over 900 AED in annual savings on monthly transfers.",
  },
  {
    q: "How does the recipient receive the money?",
    a: "The recipient can sell the USDT they receive for local currency through a local exchange, P2P platform, or Blip's partner network. The funds are then deposited into their local bank account. In many corridors like India and Philippines, the conversion process takes minutes and the recipient can cash out to their bank within the same day.",
  },
  {
    q: "Which countries can I send to from UAE?",
    a: "With crypto remittance, you can send to virtually any country. Our most popular corridors from UAE are India (INR), Pakistan (PKR), Philippines (PHP), Bangladesh (BDT), Nepal (NPR), Sri Lanka (LKR), and Egypt (EGP). Since USDT is globally accepted, recipients in any country with a crypto exchange or P2P market can convert to their local currency.",
  },
  {
    q: "Is it faster than bank wire transfer?",
    a: "Significantly faster. A traditional bank wire from UAE takes 1-3 business days and is unavailable on weekends and holidays. Crypto transfers settle on-chain in under a minute, and the entire end-to-end process — including the recipient's local conversion — typically takes under 30 minutes. It works 24/7, 365 days a year.",
  },
  {
    q: "Do I need a special app or crypto wallet?",
    a: "You need a basic crypto wallet that supports Solana (like Phantom or Solflare) to send USDT. Blip provides a simple web interface — no special app download required. If you are new to crypto, our onboarding guide walks you through setting up a wallet and purchasing your first USDT in under 10 minutes.",
  },
  {
    q: "What if the recipient doesn't have a crypto wallet?",
    a: "The recipient can set up a free crypto wallet in minutes. Alternatively, they can use popular local exchanges or P2P platforms in their country to receive and immediately convert to local currency. In India, for example, platforms like WazirX and CoinDCX make it easy. We also provide step-by-step guides for recipients in each supported country.",
  },
  {
    q: "Are there limits on how much I can send?",
    a: "Crypto transfers have no inherent protocol-level limits. However, local regulations may apply. In the UAE, for larger amounts, certain compliance steps may be required depending on the on-ramp provider. On the receiving side, local exchange withdrawal limits vary by platform and KYC level. For typical remittance amounts (500-5,000 AED), there are no practical restrictions.",
  },
  {
    q: "How does Blip protect my funds during transfer?",
    a: "Blip uses non-custodial escrow smart contracts on Solana. When you initiate a transfer, USDT is locked in an on-chain escrow that neither Blip nor any third party can access. The funds are only released when both parties confirm the transaction. This eliminates counterparty risk entirely.",
  },
  {
    q: "What exchange rate do I get with crypto remittance?",
    a: "With crypto remittance, you effectively get the mid-market exchange rate with minimal markup (0-0.5%). Traditional banks and services mark up the exchange rate by 3-7%, which is a hidden cost most people do not notice. With stablecoins pegged to USD, you convert AED to USDT at near-official rates, and the recipient converts USDT to local currency at their local mid-market rate.",
  },
];

/* ═══════════════════════════════════════════════
   HOW IT WORKS STEPS
   ═══════════════════════════════════════════════ */

const HOW_STEPS = [
  { step: 1, title: "Buy USDT with AED", desc: "Purchase USDT (a US Dollar stablecoin) on Blip using your UAE bank account or card. AED to USDT conversion takes minutes with near-official exchange rates.", icon: DollarSign },
  { step: 2, title: "Send USDT to recipient", desc: "Transfer USDT to your recipient's Solana wallet address. The on-chain transfer settles in under a second with a fee of approximately $0.01.", icon: Send },
  { step: 3, title: "Recipient sells USDT locally", desc: "Your recipient sells USDT for their local currency through a local exchange or Blip's partner network at competitive mid-market rates.", icon: Globe },
  { step: 4, title: "Money in local bank account", desc: "The converted local currency is deposited into the recipient's bank account. In most corridors, this step takes minutes to a few hours.", icon: Shield },
  { step: 5, title: "Done in under 30 minutes", desc: "Total transfer time: under 30 minutes. Total cost: under $3. Available 24/7, no business hours or holiday restrictions.", icon: Zap },
];

/* ═══════════════════════════════════════════════
   COUNTRY CONTENT
   ═══════════════════════════════════════════════ */

const COUNTRY_SECTIONS = [
  {
    title: "Send Money to India from UAE",
    flag: "\u{1F1EE}\u{1F1F3}",
    currency: "INR",
    content: "India is the largest remittance recipient in the world, with UAE being one of the top source countries. Traditional bank wires to India cost 50+ AED in fees plus a 3-5% exchange rate markup. With crypto remittance through Blip, you send USDT for under 5 AED and your recipient converts to INR at mid-market rates via Indian exchanges like WazirX or CoinDCX. Total savings: 75-80 AED per 1,000 AED sent. Popular with the 3.5 million Indian expats in UAE.",
  },
  {
    title: "Send Money to Pakistan from UAE",
    flag: "\u{1F1F5}\u{1F1F0}",
    currency: "PKR",
    content: "Pakistan receives over $8 billion annually in remittances from UAE. The PKR corridor is notorious for poor exchange rates with markups of 5-6% at traditional providers. Crypto remittance eliminates this hidden cost entirely. Your recipient converts USDT to PKR through local P2P platforms at transparent market rates. The 1.5 million Pakistani expats in UAE can save over 1,000 AED annually by switching to crypto-based transfers with Blip.",
  },
  {
    title: "Send Money to Philippines from UAE",
    flag: "\u{1F1F5}\u{1F1ED}",
    currency: "PHP",
    content: "Over 700,000 Filipino workers in UAE send billions of pesos home each year. Traditional remittance services charge 30-45 AED per transfer plus unfavorable exchange rates. Crypto remittance through Blip reduces this to under 5 AED with mid-market PHP rates. The Philippines has a thriving crypto ecosystem with platforms like Coins.ph making USDT-to-PHP conversion seamless. Transfers arrive in minutes instead of days.",
  },
];

/* ═══════════════════════════════════════════════
   SCHEMAS
   ═══════════════════════════════════════════════ */

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_DATA.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Send Money from UAE with Crypto",
  description: "Step-by-step guide to sending remittances from UAE using cryptocurrency stablecoins for lower fees and faster transfers.",
  totalTime: "PT30M",
  estimatedCost: { "@type": "MonetaryAmount", currency: "AED", value: "5" },
  step: HOW_STEPS.map((s) => ({
    "@type": "HowToStep",
    position: s.step,
    name: s.title,
    text: s.desc,
  })),
};

/* ═══════════════════════════════════════════════
   ANIMATED SECTION
   ═══════════════════════════════════════════════ */

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

/* ═══════════════════════════════════════════════
   FAQ ACCORDION
   ═══════════════════════════════════════════════ */

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
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        className="overflow-hidden"
      >
        <p className="pb-5 text-[14px] text-black/50 dark:text-white/40 leading-relaxed">{a}</p>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   CORRIDOR DROPDOWN
   ═══════════════════════════════════════════════ */

function CorridorDropdown({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (key: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const corridor = CORRIDORS[selected];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { setOpen(!open); sounds.click(); }}
        className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/[0.08] dark:border-white/[0.08] hover:border-black/[0.15] dark:hover:border-white/[0.15] transition-colors text-sm font-semibold w-full"
      >
        <span className="text-xl leading-none">{corridor.flag}</span>
        <div className="flex-1 text-left">
          <span className="text-black dark:text-white">{corridor.name}</span>
          <span className="text-black/40 dark:text-white/30 ml-1.5">({corridor.currency})</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-black/40 dark:text-white/40 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full mt-1 left-0 right-0 z-50 bg-white dark:bg-[#111] border border-black/[0.08] dark:border-white/[0.08] rounded-xl shadow-xl overflow-hidden max-h-[320px] overflow-y-auto"
        >
          {CORRIDOR_KEYS.map((key) => {
            const c = CORRIDORS[key];
            return (
              <button
                key={key}
                onClick={() => { onSelect(key); setOpen(false); sounds.click(); }}
                className="flex items-center gap-3 w-full px-4 py-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <span className="text-xl leading-none">{c.flag}</span>
                <div className="text-left flex-1">
                  <span className="block text-sm font-semibold text-black dark:text-white">{c.name}</span>
                  <span className="block text-xs text-black/40 dark:text-white/40">{c.currency}</span>
                </div>
                {key === selected && <Check className="w-4 h-4 text-black dark:text-white ml-auto" />}
              </button>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════ */

export default function CryptoRemittanceUae() {
  const [selectedCorridor, setSelectedCorridor] = useState("INR");
  const [amount, setAmount] = useState("1000");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const corridor = CORRIDORS[selectedCorridor];
  const numAmount = parseFloat(amount) || 0;

  const calc = useMemo(
    () => calculateTransfer(numAmount > 0 ? numAmount : 1000, corridor),
    [numAmount, corridor]
  );

  const displayAmount = numAmount > 0 ? numAmount : 1000;

  return (
    <>
      <SEO
        title="Send Money from UAE with Crypto — Remittance Calculator | Blip Money"
        description="Send money from UAE to India, Pakistan, Philippines using crypto. Compare fees: bank wire vs crypto remittance. Save up to 90% on transfer fees with stablecoin settlement."
        canonical="https://blip.money/crypto-remittance-uae"
        keywords="crypto remittance UAE, send money from UAE crypto, cheap remittance UAE, USDT remittance Dubai, crypto money transfer, send money India from UAE crypto, Pakistan remittance crypto"
      />
      <HreflangTags path="/crypto-remittance-uae" />
      <StructuredData type="custom" schema={faqSchema} />
      <StructuredData type="custom" schema={howToSchema} />

      <div className="min-h-screen bg-[#FAF8F5] dark:bg-transparent">
        {/* ═══════════════════════════════════════════
            HERO SECTION
            ═══════════════════════════════════════════ */}
        <header className="relative pt-32 sm:pt-36 pb-12 sm:pb-16">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Crypto Remittance UAE" }]} />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
              className="mt-6"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black dark:text-white tracking-tight leading-[1.08] mb-4">
                Send Money from
                <br />
                <span className="bg-gradient-to-r from-black/60 to-black/30 dark:from-white/60 dark:to-white/30 bg-clip-text text-transparent">
                  UAE with Crypto
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-black/50 dark:text-white/40 max-w-xl leading-relaxed mb-6">
                Save up to 90% on remittance fees using stablecoin settlement. Send to India, Pakistan, Philippines and more — in minutes, not days.
              </p>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06]">
                  <TrendingDown className="w-3.5 h-3.5 text-black dark:text-white" />
                  <span className="text-xs font-semibold text-black/60 dark:text-white/40">90% lower fees</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/[0.06] dark:border-white/[0.06]">
                  <Clock className="w-3.5 h-3.5 text-black/40 dark:text-white/40" />
                  <span className="text-xs font-semibold text-black/50 dark:text-white/40">Under 30 min</span>
                </div>
              </div>
            </motion.div>
          </div>
        </header>

        {/* ═══════════════════════════════════════════
            INTERACTIVE REMITTANCE CALCULATOR
            ═══════════════════════════════════════════ */}
        <Section className="py-16 sm:py-20 border-t border-black/[0.04] dark:border-white/[0.04]">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-2">
              Remittance Fee Calculator
            </h2>
            <p className="text-black/50 dark:text-white/40 mb-8">
              Compare what you actually pay across providers. Enter your amount and destination to see real savings.
            </p>

            <div className="bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] rounded-2xl p-6 sm:p-8 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] dark:shadow-none">
              {/* Input Row */}
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {/* Amount Input */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-black/40 dark:text-white/30 mb-2">
                    You Send (AED)
                  </label>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-[#FAF8F5] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06]">
                    <span className="text-lg leading-none">{"\u{1F1E6}\u{1F1EA}"}</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                      className="flex-1 bg-transparent text-2xl font-bold text-black dark:text-white outline-none placeholder:text-black/20 dark:placeholder:text-white/20 min-w-0"
                      placeholder="1000"
                    />
                    <span className="text-sm font-semibold text-black/40 dark:text-white/30">AED</span>
                  </div>
                </div>

                {/* Destination */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-black/40 dark:text-white/30 mb-2">
                    Destination Country
                  </label>
                  <CorridorDropdown selected={selectedCorridor} onSelect={setSelectedCorridor} />
                </div>
              </div>

              {/* Savings Banner */}
              <motion.div
                key={`${selectedCorridor}-${amount}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="mb-8 p-5 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06]"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/40 dark:text-white/30 mb-1">
                      You save with Blip
                    </p>
                    <p className="text-3xl sm:text-4xl font-bold text-black dark:text-white">
                      {calc.bestSavings.toFixed(0)} AED
                      <span className="text-base font-medium text-black/70 dark:text-white/70 ml-2">per transfer</span>
                    </p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/40 dark:text-white/30 mb-1">
                      Annual savings (monthly transfers)
                    </p>
                    <p className="text-xl font-bold text-black dark:text-white">
                      {calc.annualSavings.toLocaleString("en-US", { maximumFractionDigits: 0 })} AED/year
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Comparison Table */}
              <div className="overflow-x-auto -mx-6 sm:-mx-8 px-6 sm:px-8">
                <table className="w-full text-sm min-w-[600px]">
                  <thead>
                    <tr className="border-b border-black/[0.08] dark:border-white/[0.08]">
                      <th className="text-left py-3 pr-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/40 dark:text-white/30"></th>
                      <th className="text-center px-3 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/40 dark:text-white/30">Bank Wire</th>
                      <th className="text-center px-3 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/40 dark:text-white/30">Western Union</th>
                      <th className="text-center px-3 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/40 dark:text-white/30">Wise</th>
                      <th className="text-center px-3 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-black dark:text-white bg-black/[0.02] dark:bg-white/[0.02] rounded-t-lg">
                        Crypto (Blip)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Transfer Fee */}
                    <tr className="border-b border-black/[0.04] dark:border-white/[0.04]">
                      <td className="py-3 pr-4 font-medium text-black/60 dark:text-white/50">Transfer Fee</td>
                      <td className="text-center px-3 py-3 text-black/50 dark:text-white/40 tabular-nums">{calc.bank.fee} AED</td>
                      <td className="text-center px-3 py-3 text-black/50 dark:text-white/40 tabular-nums">{calc.wu.fee} AED</td>
                      <td className="text-center px-3 py-3 text-black/50 dark:text-white/40 tabular-nums">{calc.wise.fee} AED</td>
                      <td className="text-center px-3 py-3 font-semibold text-black dark:text-white bg-black/[0.02] dark:bg-white/[0.02] tabular-nums">{calc.blip.fee} AED</td>
                    </tr>
                    {/* Rate Markup */}
                    <tr className="border-b border-black/[0.04] dark:border-white/[0.04]">
                      <td className="py-3 pr-4 font-medium text-black/60 dark:text-white/50">Rate Markup</td>
                      <td className="text-center px-3 py-3 text-black/50 dark:text-white/40">{(corridor.bankMarkup * 100).toFixed(0)}-{(corridor.bankMarkup * 100 + 1).toFixed(0)}%</td>
                      <td className="text-center px-3 py-3 text-black/50 dark:text-white/40">{(corridor.wuMarkup * 100).toFixed(0)}-{(corridor.wuMarkup * 100 + 1.5).toFixed(0)}%</td>
                      <td className="text-center px-3 py-3 text-black/50 dark:text-white/40">{(corridor.wiseMarkup * 100).toFixed(1)}-{(corridor.wiseMarkup * 100 + 0.3).toFixed(1)}%</td>
                      <td className="text-center px-3 py-3 font-semibold text-black dark:text-white bg-black/[0.02] dark:bg-white/[0.02]">0-0.5%</td>
                    </tr>
                    {/* Markup Cost */}
                    <tr className="border-b border-black/[0.04] dark:border-white/[0.04]">
                      <td className="py-3 pr-4 font-medium text-black/60 dark:text-white/50">Hidden Markup Cost</td>
                      <td className="text-center px-3 py-3 text-red-400 tabular-nums">~{calc.bank.markupCost.toFixed(0)} AED</td>
                      <td className="text-center px-3 py-3 text-red-400 tabular-nums">~{calc.wu.markupCost.toFixed(0)} AED</td>
                      <td className="text-center px-3 py-3 text-black/50 dark:text-white/40 tabular-nums">~{calc.wise.markupCost.toFixed(0)} AED</td>
                      <td className="text-center px-3 py-3 font-semibold text-black dark:text-white bg-black/[0.02] dark:bg-white/[0.02] tabular-nums">~{calc.blip.markupCost.toFixed(0)} AED</td>
                    </tr>
                    {/* Total Cost */}
                    <tr className="border-b border-black/[0.04] dark:border-white/[0.04]">
                      <td className="py-3 pr-4 font-bold text-black/70 dark:text-white/60">Total Cost</td>
                      <td className="text-center px-3 py-3 font-bold text-black/70 dark:text-white/60 tabular-nums">~{calc.bank.totalCost.toFixed(0)} AED</td>
                      <td className="text-center px-3 py-3 font-bold text-black/70 dark:text-white/60 tabular-nums">~{calc.wu.totalCost.toFixed(0)} AED</td>
                      <td className="text-center px-3 py-3 font-bold text-black/70 dark:text-white/60 tabular-nums">~{calc.wise.totalCost.toFixed(0)} AED</td>
                      <td className="text-center px-3 py-3 font-bold text-black dark:text-white bg-black/[0.02] dark:bg-white/[0.02] tabular-nums">~{calc.blip.totalCost.toFixed(0)} AED</td>
                    </tr>
                    {/* Recipient Gets */}
                    <tr className="border-b border-black/[0.04] dark:border-white/[0.04]">
                      <td className="py-3 pr-4 font-medium text-black/60 dark:text-white/50">Recipient Gets</td>
                      <td className="text-center px-3 py-3 text-black/50 dark:text-white/40 tabular-nums">{calc.bank.received.toLocaleString("en-US", { maximumFractionDigits: 0 })} {corridor.currency}</td>
                      <td className="text-center px-3 py-3 text-black/50 dark:text-white/40 tabular-nums">{calc.wu.received.toLocaleString("en-US", { maximumFractionDigits: 0 })} {corridor.currency}</td>
                      <td className="text-center px-3 py-3 text-black/50 dark:text-white/40 tabular-nums">{calc.wise.received.toLocaleString("en-US", { maximumFractionDigits: 0 })} {corridor.currency}</td>
                      <td className="text-center px-3 py-3 font-bold text-black dark:text-white bg-black/[0.02] dark:bg-white/[0.02] tabular-nums">{calc.blip.received.toLocaleString("en-US", { maximumFractionDigits: 0 })} {corridor.currency}</td>
                    </tr>
                    {/* You Save */}
                    <tr className="border-b border-black/[0.04] dark:border-white/[0.04]">
                      <td className="py-3 pr-4 font-medium text-black/60 dark:text-white/50">You Save</td>
                      <td className="text-center px-3 py-3 text-black/30 dark:text-white/20">--</td>
                      <td className="text-center px-3 py-3 text-black/30 dark:text-white/20">--</td>
                      <td className="text-center px-3 py-3 text-black/30 dark:text-white/20">--</td>
                      <td className="text-center px-3 py-3 font-bold text-black dark:text-white bg-black/[0.02] dark:bg-white/[0.02] tabular-nums">{calc.bestSavings.toFixed(0)} AED</td>
                    </tr>
                    {/* Arrival Time */}
                    <tr>
                      <td className="py-3 pr-4 font-medium text-black/60 dark:text-white/50">Arrival Time</td>
                      <td className="text-center px-3 py-3 text-black/50 dark:text-white/40">1-3 days</td>
                      <td className="text-center px-3 py-3 text-black/50 dark:text-white/40">Min - 1 day</td>
                      <td className="text-center px-3 py-3 text-black/50 dark:text-white/40">1-2 days</td>
                      <td className="text-center px-3 py-3 font-semibold text-black dark:text-white bg-black/[0.02] dark:bg-white/[0.02] rounded-b-lg">Under 15 min</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Annual Savings Callout */}
              <div className="mt-6 pt-6 border-t border-black/[0.06] dark:border-white/[0.06] text-center">
                <p className="text-black/50 dark:text-white/40 text-sm">
                  If you send <span className="font-semibold text-black dark:text-white">{displayAmount.toLocaleString()} AED/month</span>, you save{" "}
                  <span className="font-bold text-black dark:text-white">{calc.annualSavings.toLocaleString("en-US", { maximumFractionDigits: 0 })} AED/year</span> with Blip
                </p>
              </div>

              {/* CTA */}
              <div className="mt-6">
                <Link
                  to="/waitlist"
                  onClick={() => sounds.click()}
                  onMouseEnter={() => sounds.hover()}
                  className="group relative flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-black dark:bg-white text-white dark:text-black font-semibold text-[15px] overflow-hidden transition-all hover:opacity-90"
                >
                  <Send className="w-4 h-4" />
                  <span className="relative z-10">Start Saving on Remittance</span>
                  <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                </Link>
                <p className="text-center text-[11px] text-black/30 dark:text-white/20 mt-3">
                  Non-custodial escrow on Solana. Send globally in minutes.
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            CORRIDOR STATISTICS
            ═══════════════════════════════════════════ */}
        <Section className="py-16 sm:py-20 border-t border-black/[0.04] dark:border-white/[0.04]">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-2">
              UAE Remittance Market
            </h2>
            <p className="text-black/50 dark:text-white/40 mb-10">
              The UAE is one of the world's largest remittance corridors, with millions of expats sending money home every month.
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { value: "$40B+", label: "Sent annually from UAE", icon: DollarSign },
                { value: "8.5M", label: "Expats living in UAE", icon: Users },
                { value: "1,500", label: "Avg. AED sent monthly", icon: Send },
                { value: "75%", label: "Avg. fee savings with crypto", icon: TrendingDown },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] text-center"
                >
                  <stat.icon className="w-5 h-5 text-black/25 dark:text-white/20 mx-auto mb-3" />
                  <p className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-1">{stat.value}</p>
                  <p className="text-[12px] text-black/40 dark:text-white/30 leading-snug">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            HOW CRYPTO REMITTANCE WORKS
            ═══════════════════════════════════════════ */}
        <Section className="py-16 sm:py-20 border-t border-black/[0.04] dark:border-white/[0.04]">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-2">
              How Crypto Remittance Works
            </h2>
            <p className="text-black/50 dark:text-white/40 mb-10">
              Send money from UAE to anywhere in the world in 5 simple steps using stablecoins.
            </p>

            <div className="space-y-4">
              {HOW_STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="flex items-start gap-5 p-6 rounded-2xl bg-white/60 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06]"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-black dark:bg-white flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white dark:text-black" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/30 dark:text-white/25">Step {step.step}</span>
                      </div>
                      <h3 className="text-[16px] font-bold text-black dark:text-white mb-1">{step.title}</h3>
                      <p className="text-[14px] text-black/50 dark:text-white/40 leading-relaxed">{step.desc}</p>
                    </div>
                    {i < HOW_STEPS.length - 1 && (
                      <div className="hidden sm:block flex-shrink-0 self-center">
                        <ArrowRight className="w-4 h-4 text-black/15 dark:text-white/10" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            COUNTRY-SPECIFIC SECTIONS
            ═══════════════════════════════════════════ */}
        <Section className="py-16 sm:py-20 border-t border-black/[0.04] dark:border-white/[0.04]">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-2">
              Popular UAE Remittance Corridors
            </h2>
            <p className="text-black/50 dark:text-white/40 mb-10">
              Detailed savings breakdowns for the most popular destinations from UAE.
            </p>

            <div className="space-y-6">
              {COUNTRY_SECTIONS.map((section, i) => (
                <motion.div
                  key={section.currency}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="p-6 sm:p-8 rounded-2xl bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06]"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{section.flag}</span>
                    <div>
                      <h3 className="text-lg font-bold text-black dark:text-white">{section.title}</h3>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/30 dark:text-white/25">
                        AED to {section.currency} corridor
                      </span>
                    </div>
                  </div>
                  <p className="text-[14px] text-black/50 dark:text-white/40 leading-relaxed mb-4">{section.content}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06]">
                      <Check className="w-3 h-3 text-black dark:text-white" />
                      <span className="text-xs font-semibold text-black/60 dark:text-white/40">
                        Rate: 1 AED = {CORRIDORS[section.currency].rate} {section.currency}
                      </span>
                    </div>
                    <button
                      onClick={() => { setSelectedCorridor(section.currency); window.scrollTo({ top: 0, behavior: "smooth" }); sounds.click(); }}
                      className="text-xs font-semibold text-black/40 dark:text-white/30 hover:text-black dark:hover:text-white transition-colors"
                    >
                      Calculate savings →
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            WHY CRYPTO BEATS TRADITIONAL
            ═══════════════════════════════════════════ */}
        <Section className="py-16 sm:py-20 border-t border-black/[0.04] dark:border-white/[0.04]">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-2">
              Why Crypto Beats Traditional Remittance
            </h2>
            <p className="text-black/50 dark:text-white/40 mb-10">
              A side-by-side comparison of crypto-powered transfers versus legacy remittance services.
            </p>

            <div className="bg-white/80 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-black/[0.08] dark:border-white/[0.08]">
                      <th className="text-left px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/40 dark:text-white/30">Feature</th>
                      <th className="text-center px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-black dark:text-white bg-black/[0.02] dark:bg-white/[0.02]">Crypto (Blip)</th>
                      <th className="text-center px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/40 dark:text-white/30">Traditional</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { feature: "Speed", crypto: "Minutes", traditional: "1-3 business days", icon: Zap },
                      { feature: "Total Cost", crypto: "$1-5 per transfer", traditional: "$30-90 per transfer", icon: DollarSign },
                      { feature: "Transparency", crypto: "Fully on-chain, verifiable", traditional: "Opaque fees, hidden markups", icon: Shield },
                      { feature: "Availability", crypto: "24/7, 365 days", traditional: "Business hours only", icon: Clock },
                      { feature: "Exchange Rate", crypto: "Mid-market, 0-0.5% markup", traditional: "Marked up 3-7%", icon: TrendingDown },
                      { feature: "Access", crypto: "Any internet connection", traditional: "Branch or app required", icon: Globe },
                    ].map((row, i) => {
                      const Icon = row.icon;
                      return (
                        <tr key={i} className="border-b border-black/[0.04] dark:border-white/[0.04] last:border-0">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Icon className="w-4 h-4 text-black/25 dark:text-white/20 flex-shrink-0" />
                              <span className="font-medium text-black/70 dark:text-white/60">{row.feature}</span>
                            </div>
                          </td>
                          <td className="text-center px-6 py-4 font-semibold text-black dark:text-white bg-black/[0.02] dark:bg-white/[0.02]">{row.crypto}</td>
                          <td className="text-center px-6 py-4 text-black/50 dark:text-white/40">{row.traditional}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            FAQ
            ═══════════════════════════════════════════ */}
        <Section className="py-16 sm:py-20 border-t border-black/[0.04] dark:border-white/[0.04]">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-2">
              Crypto Remittance UAE — Frequently Asked Questions
            </h2>
            <p className="text-black/50 dark:text-white/40 mb-8">
              Everything you need to know about sending money from UAE using cryptocurrency.
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

        {/* ═══════════════════════════════════════════
            CTA
            ═══════════════════════════════════════════ */}
        <Section className="py-16 sm:py-20 border-t border-black/[0.04] dark:border-white/[0.04]">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white mb-4">
              Stop Overpaying for Remittance
            </h2>
            <p className="text-lg text-black/50 dark:text-white/40 max-w-lg mx-auto mb-8">
              Join thousands of UAE expats who switched to crypto-powered transfers and save up to 90% on every transfer.
            </p>
            <Link
              to="/waitlist"
              onClick={() => sounds.click()}
              onMouseEnter={() => sounds.hover()}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold text-[15px] hover:opacity-90 transition-opacity"
            >
              <Send className="w-4 h-4" />
              Start Saving Now
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-[12px] text-black/30 dark:text-white/20 mt-4">
              Non-custodial escrow on Solana. Under 30 minutes. Under $3 total cost.
            </p>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            CROSS-LINKS
            ═══════════════════════════════════════════ */}
        <section className="border-t border-black/[0.06] dark:border-white/[0.06] bg-[#FAF8F5]/50 dark:bg-white/[0.01]">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-12">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/40 dark:text-white/30 mb-6">
              Related Resources
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Crypto to AED", href: "/crypto-to-aed", desc: "Live converter" },
                { label: "Sell USDT Dubai", href: "/sell-usdt-dubai", desc: "Cash out in UAE" },
                { label: "How It Works", href: "/how-it-works", desc: "Protocol explained" },
                { label: "Compare", href: "/compare", desc: "Blip vs others" },
              ].map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="group p-4 rounded-xl bg-white/60 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] hover:border-black/[0.12] dark:hover:border-white/[0.12] transition-colors"
                >
                  <span className="block text-sm font-semibold text-black dark:text-white group-hover:text-gray-600 dark:group-hover:text-white/80 transition-colors">{link.label}</span>
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
