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
  TrendingUp,
  Globe,
  Shield,
  Zap,
  Wallet,
  Building2,
  ChevronDown,
  ChevronUp,
  DollarSign,
  BarChart3,
  Landmark,
  Briefcase,
  Users,
  Scale,
  Calculator,
  Percent,
  PiggyBank,
  Plane,
  Clock,
} from "lucide-react";

/* ═══════════════════════════════════════════════
   STRUCTURED DATA
   ═══════════════════════════════════════════════ */

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can you legally get paid in crypto in the UAE?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. A 2024 Dubai Court ruling established that employers can pay part of an employee's salary in cryptocurrency, provided both parties agree. The AED portion must still comply with the Wage Protection System (WPS) for mainland companies. Free zone entities have more flexibility in structuring crypto compensation.",
      },
    },
    {
      "@type": "Question",
      name: "Do I pay tax on crypto salary in the UAE?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The UAE has 0% personal income tax, which applies to all forms of salary including cryptocurrency. There is no capital gains tax on crypto holdings for individuals either. This makes the UAE one of the most tax-efficient jurisdictions globally for receiving crypto compensation.",
      },
    },
    {
      "@type": "Question",
      name: "How do I convert crypto salary to AED?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can use Blip to convert any portion of your crypto salary to AED instantly. Connect your Solana wallet, select the amount to convert, and receive AED via bank transfer. The process takes minutes and uses Blip's escrow-protected settlement for security.",
      },
    },
    {
      "@type": "Question",
      name: "Which companies pay crypto salaries in UAE?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Web3 companies and DAOs commonly pay full or partial crypto salaries. Tech startups in DMCC, DIFC, and ADGM free zones are increasingly offering crypto compensation packages. Many global remote companies also pay international contractors in crypto, and freelancers on platforms like Gitcoin and Braintrust receive crypto natively.",
      },
    },
    {
      "@type": "Question",
      name: "What's the best crypto to receive salary in?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It depends on your goals. USDT/USDC provide stability (pegged to USD, which is pegged to AED). BTC and ETH offer growth potential but come with volatility. SOL is fast and cheap for transfers. Many employees opt for a split — stablecoins for expenses and BTC/ETH for long-term accumulation.",
      },
    },
    {
      "@type": "Question",
      name: "Does the Wage Protection System (WPS) apply to crypto salaries?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "WPS applies to the AED portion of salaries for mainland UAE companies. The crypto portion is treated as an additional benefit or bonus structure. Free zone companies have different rules — many DMCC and DIFC entities can structure crypto payments more flexibly.",
      },
    },
    {
      "@type": "Question",
      name: "Can freelancers receive crypto payments in the UAE?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Freelancers with a UAE freelance visa or permit can receive payments in any form, including cryptocurrency. Many international freelance platforms pay in crypto by default. Blip makes it easy to convert freelance crypto earnings to AED when needed.",
      },
    },
    {
      "@type": "Question",
      name: "How do I set up a wallet for crypto salary?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We recommend Phantom wallet for Solana-based payments. Download the Phantom app or browser extension, create a wallet (save your seed phrase securely), and share your wallet address with your employer. The setup takes under 5 minutes.",
      },
    },
    {
      "@type": "Question",
      name: "Is crypto salary volatile? How do I manage the risk?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "If you receive salary in BTC or ETH, yes — the value fluctuates. You can manage this by: (1) receiving stablecoins like USDT/USDC for expenses, (2) using a split strategy where only a portion is in volatile crypto, or (3) converting to AED immediately on payday using Blip.",
      },
    },
    {
      "@type": "Question",
      name: "What happens to my crypto salary if I leave the UAE?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Your crypto stays in your wallet regardless of where you live — that's the beauty of self-custody. Unlike bank accounts that may be frozen when you leave, your crypto wallet travels with you globally. You can continue to access and convert your holdings from anywhere.",
      },
    },
  ],
};

/* ═══════════════════════════════════════════════
   SALARY CONVERTER CONSTANTS
   ═══════════════════════════════════════════════ */

const RATES: Record<string, number> = {
  BTC: 357000,
  ETH: 9800,
  USDT: 3.67,
  USDC: 3.67,
  SOL: 700,
};

const CRYPTO_OPTIONS = [
  { symbol: "BTC", name: "Bitcoin", color: "text-black/60 dark:text-white/40" },
  { symbol: "ETH", name: "Ethereum", color: "text-black/60 dark:text-white/40" },
  { symbol: "USDT", name: "Tether", color: "text-black/60 dark:text-white/40" },
  { symbol: "USDC", name: "USD Coin", color: "text-black/60 dark:text-white/40" },
  { symbol: "SOL", name: "Solana", color: "text-black/60 dark:text-white/40" },
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
            { label: "Crypto Salary UAE" },
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
            Crypto Payroll Guide 2026
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-black dark:text-white tracking-tight leading-[1.1] mb-6"
        >
          Crypto Salary UAE
          <br />
          <span className="text-black/80 dark:text-white/50">
            Get Paid in Crypto in Dubai.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg sm:text-xl text-black/50 dark:text-white/40 max-w-2xl mb-10 leading-relaxed"
        >
          Can you get paid in crypto in the UAE? Yes. Following the 2024 Dubai
          Court ruling, employers can pay part of your salary in cryptocurrency.
          Here's everything you need to know about crypto salaries, legal
          frameworks, tax implications, and how to convert crypto to AED.
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
            Convert Crypto to AED
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#salary-converter"
            onClick={() => sounds.click()}
            onMouseEnter={() => sounds.hover()}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-black/[0.08] dark:border-white/[0.06] text-black dark:text-white font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-all"
          >
            Try Salary Calculator
          </a>
        </motion.div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════
   INTERACTIVE SALARY CONVERTER
   ═══════════════════════════════════════════════ */

const SalaryConverterSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [salary, setSalary] = useState("15000");
  const [selectedCrypto, setSelectedCrypto] = useState("BTC");
  const [cryptoPercent, setCryptoPercent] = useState(50);
  const [showDropdown, setShowDropdown] = useState(false);

  const calculations = useMemo(() => {
    const monthlySalary = parseFloat(salary) || 0;
    const rate = RATES[selectedCrypto] || 1;
    const cryptoPortion = (monthlySalary * cryptoPercent) / 100;
    const aedPortion = monthlySalary - cryptoPortion;
    const cryptoAmount = cryptoPortion / rate;
    const annualCrypto = cryptoAmount * 12;
    const growthScenario = annualCrypto * rate * 1.2;

    return {
      cryptoPortion,
      aedPortion,
      cryptoAmount,
      annualCrypto,
      growthScenario,
      totalEquivalent: monthlySalary * 12,
    };
  }, [salary, selectedCrypto, cryptoPercent]);

  const selectedOption = CRYPTO_OPTIONS.find(
    (c) => c.symbol === selectedCrypto
  );

  const formatCrypto = (val: number) => {
    if (selectedCrypto === "BTC") return val.toFixed(6);
    if (selectedCrypto === "ETH") return val.toFixed(4);
    if (selectedCrypto === "SOL") return val.toFixed(2);
    return val.toFixed(2);
  };

  return (
    <section
      id="salary-converter"
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
            Interactive Tool
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-black dark:text-white tracking-tight">
            Crypto Salary{" "}
            <span className="text-black/80 dark:text-white/50">Calculator</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="p-6 sm:p-8 rounded-2xl bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06]"
        >
          {/* Monthly Salary Input */}
          <div className="mb-6">
            <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/50 dark:text-white/40 mb-3 block">
              Monthly Salary (AED)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/30 text-sm">
                AED
              </span>
              <input
                type="number"
                value={salary}
                onChange={(e) => {
                  setSalary(e.target.value);
                  sounds.tick();
                }}
                className="w-full pl-14 pr-4 py-3 rounded-xl bg-white/60 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] text-black dark:text-white text-lg font-medium focus:outline-none focus:border-black/20 dark:focus:border-white/20 transition-colors"
                placeholder="15000"
                min="0"
              />
            </div>
          </div>

          {/* Crypto Selection */}
          <div className="mb-6">
            <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/50 dark:text-white/40 mb-3 block">
              Receive Salary In
            </label>
            <div className="relative">
              <button
                onClick={() => {
                  setShowDropdown(!showDropdown);
                  sounds.click();
                }}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/60 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] text-black dark:text-white font-medium hover:border-black/[0.12] dark:hover:border-white/[0.1] transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span className={`font-bold ${selectedOption?.color}`}>
                    {selectedCrypto}
                  </span>
                  <span className="text-black/40 dark:text-white/30 text-sm">
                    {selectedOption?.name}
                  </span>
                </span>
                <ChevronDown className="w-4 h-4 text-black/30 dark:text-white/30" />
              </button>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute z-20 top-full mt-2 w-full rounded-xl bg-white dark:bg-neutral-900 border border-black/[0.08] dark:border-white/[0.06] shadow-lg overflow-hidden"
                >
                  {CRYPTO_OPTIONS.map((option) => (
                    <button
                      key={option.symbol}
                      onClick={() => {
                        setSelectedCrypto(option.symbol);
                        setShowDropdown(false);
                        sounds.click();
                      }}
                      onMouseEnter={() => sounds.hover()}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${
                        selectedCrypto === option.symbol
                          ? "bg-black/[0.03] dark:bg-white/[0.03]"
                          : ""
                      }`}
                    >
                      <span className={`font-bold ${option.color}`}>
                        {option.symbol}
                      </span>
                      <span className="text-black/60 dark:text-white/50 text-sm">
                        {option.name}
                      </span>
                      <span className="ml-auto text-xs text-black/30 dark:text-white/20">
                        AED {RATES[option.symbol].toLocaleString()}
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          {/* Split Slider */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/50 dark:text-white/40">
                Crypto Portion
              </label>
              <span className="text-sm font-semibold text-black dark:text-white">
                {cryptoPercent}% crypto / {100 - cryptoPercent}% AED
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={cryptoPercent}
              onChange={(e) => {
                setCryptoPercent(parseInt(e.target.value));
                sounds.tick();
              }}
              className="w-full h-2 rounded-full appearance-none cursor-pointer bg-black/10 dark:bg-white/10 accent-black dark:accent-white"
            />
            <div className="flex justify-between text-xs text-black/30 dark:text-white/20 mt-2">
              <span>0% crypto</span>
              <span>50/50</span>
              <span>100% crypto</span>
            </div>
          </div>

          {/* Results */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-white/60 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06]">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/40 dark:text-white/30 block mb-1">
                AED in Bank
              </span>
              <span className="text-2xl font-bold text-black dark:text-white">
                {calculations.aedPortion.toLocaleString("en-AE", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </span>
              <span className="text-black/40 dark:text-white/30 text-sm ml-1">
                AED
              </span>
            </div>
            <div className="p-4 rounded-xl bg-white/60 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06]">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/40 dark:text-white/30 block mb-1">
                Crypto in Wallet
              </span>
              <span className="text-2xl font-bold text-black dark:text-white">
                {formatCrypto(calculations.cryptoAmount)}
              </span>
              <span className="text-black/40 dark:text-white/30 text-sm ml-1">
                {selectedCrypto}
              </span>
            </div>
          </div>

          {/* Projections */}
          <div className="p-4 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.04] space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-black/50 dark:text-white/40 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Annual crypto accumulation
              </span>
              <span className="font-semibold text-black dark:text-white">
                {formatCrypto(calculations.annualCrypto)} {selectedCrypto}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-black/50 dark:text-white/40 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                If {selectedCrypto} grows 20%/yr, worth
              </span>
              <span className="font-semibold text-[#ff6b35]">
                AED{" "}
                {calculations.growthScenario.toLocaleString("en-AE", {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>
            <p className="text-xs text-black/30 dark:text-white/20 pt-1 border-t border-black/[0.04] dark:border-white/[0.04]">
              Rates are approximate. Crypto values fluctuate. This is not
              financial advice.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════
   LEGAL FRAMEWORK
   ═══════════════════════════════════════════════ */

const legalItems = [
  {
    icon: Scale,
    title: "Dubai Court Ruling (2024)",
    description:
      "A landmark Dubai Court ruling in 2024 established that employers can pay part of an employee's salary in cryptocurrency, provided both parties agree to the terms. This ruling set the precedent for crypto payroll in the UAE and opened the door for companies to offer crypto compensation packages legally.",
  },
  {
    icon: Landmark,
    title: "Wage Protection System (WPS)",
    description:
      "The UAE's Wage Protection System requires mainland companies to pay salaries through approved bank channels. The crypto portion of salary is typically structured as an additional benefit or bonus, while the base salary in AED flows through WPS. Free zone companies operate under different rules with more flexibility.",
  },
  {
    icon: Building2,
    title: "Free Zone vs Mainland",
    description:
      "Free zone entities (DMCC, DIFC, ADGM) have greater flexibility in structuring crypto compensation. DMCC's Crypto Centre specifically supports blockchain companies offering token-based compensation. Mainland companies must balance WPS requirements with crypto payment arrangements.",
  },
  {
    icon: Percent,
    title: "Tax Implications (0%)",
    description:
      "The UAE has 0% personal income tax — this applies to all forms of salary, including cryptocurrency. There is no capital gains tax on crypto for individuals. Your entire crypto salary is yours to keep, whether you hold it or convert to AED.",
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
            Legal Framework{" "}
            <span className="text-black/80 dark:text-white/50">
              for Crypto Salary
            </span>
          </h2>
          <p className="text-black/50 dark:text-white/40 max-w-2xl leading-relaxed">
            The UAE provides one of the world's most favorable legal environments
            for receiving cryptocurrency as compensation.
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
   HOW TO RECEIVE CRYPTO SALARY
   ═══════════════════════════════════════════════ */

const howToSteps = [
  {
    num: "01",
    icon: Briefcase,
    title: "Agree Terms with Employer",
    description:
      "Discuss with your employer the crypto type (BTC, ETH, USDT, SOL), percentage of salary in crypto, and payment frequency. Ensure both parties sign an addendum to the employment contract specifying these terms.",
  },
  {
    num: "02",
    icon: Wallet,
    title: "Set Up a Solana Wallet",
    description:
      "Download Phantom wallet (recommended for Solana). Create your wallet, securely store your seed phrase, and share your public wallet address with your employer. This takes under 5 minutes.",
  },
  {
    num: "03",
    icon: DollarSign,
    title: "Receive Crypto on Payday",
    description:
      "Your employer transfers the agreed crypto portion directly to your wallet on payday. The AED portion goes to your bank as usual. You'll see the crypto in your wallet within seconds.",
  },
  {
    num: "04",
    icon: Calculator,
    title: "Convert to AED When Needed",
    description:
      "Use Blip to convert any amount of your crypto salary to AED instantly. Connect your wallet, select the amount, and receive AED via bank transfer. Escrow-protected for security.",
  },
  {
    num: "05",
    icon: BarChart3,
    title: "Track Portfolio Growth",
    description:
      "Monitor your crypto accumulation over time. Use the salary calculator above to project long-term growth. Consider dollar-cost averaging by holding a portion in BTC/ETH for the long term.",
  },
];

const HowToReceiveSection = () => {
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
            Step by Step
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-black dark:text-white tracking-tight">
            How to Receive{" "}
            <span className="text-black/80 dark:text-white/50">
              Crypto Salary
            </span>
          </h2>
        </motion.div>

        <div className="space-y-4">
          {howToSteps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group relative flex gap-5 p-6 rounded-2xl bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] hover:border-black/[0.12] dark:hover:border-white/[0.1] transition-colors duration-500"
                onMouseEnter={() => sounds.hover()}
              >
                <span className="absolute top-4 right-4 text-4xl font-bold text-black/[0.04] dark:text-white/[0.04] select-none">
                  {step.num}
                </span>
                <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors duration-500">
                  <Icon className="w-6 h-6 text-black/60 dark:text-white/60 group-hover:text-black dark:group-hover:text-white transition-colors duration-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-black/50 dark:text-white/40 leading-relaxed">
                    {step.description}
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
   BENEFITS OF CRYPTO SALARY
   ═══════════════════════════════════════════════ */

const benefits = [
  {
    icon: TrendingUp,
    title: "Dollar-Cost Averaging",
    description:
      "Auto-invest in BTC or ETH with each paycheck. By receiving crypto regularly, you naturally dollar-cost average into the market — the strategy most recommended by financial advisors for long-term wealth building.",
  },
  {
    icon: Shield,
    title: "Inflation Hedge",
    description:
      "Crypto exposure alongside AED stability. While the AED is pegged to USD, your crypto portion gives you exposure to assets with historically strong performance against inflation over multi-year periods.",
  },
  {
    icon: Globe,
    title: "Global Portability",
    description:
      "Your salary isn't locked to one country's banking system. If you leave the UAE, your crypto travels with you — no bank closures, no transfer delays, no frozen accounts. True financial freedom.",
  },
  {
    icon: Percent,
    title: "Tax Advantage",
    description:
      "The UAE's 0% personal income tax applies to crypto salary. No capital gains tax either. You keep every satoshi, every gwei. The most tax-efficient way to accumulate crypto globally.",
  },
  {
    icon: Zap,
    title: "Instant Settlement",
    description:
      "Crypto salary arrives in your wallet within seconds on Solana. No waiting for bank processing, no business day delays, no intermediary holds. Your money, the moment it's sent.",
  },
  {
    icon: PiggyBank,
    title: "Forced Savings",
    description:
      "Treating your crypto portion as a long-term hold creates an automatic savings mechanism. Unlike cash in a bank account, the slight friction of converting crypto encourages accumulation.",
  },
];

const BenefitsSection = () => {
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
            Why Crypto Salary
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-black dark:text-white tracking-tight">
            Benefits of{" "}
            <span className="text-black/80 dark:text-white/50">
              Crypto Salary
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.08 }}
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
   WHO'S OFFERING CRYPTO SALARIES
   ═══════════════════════════════════════════════ */

const offeringCategories = [
  {
    icon: Users,
    title: "Web3 Companies & DAOs",
    description:
      "Decentralized organizations and Web3-native companies routinely pay in tokens. Many DAOs pay contributors entirely in crypto via on-chain payroll systems. Examples include protocol teams, NFT studios, and DeFi projects based in the UAE.",
  },
  {
    icon: Building2,
    title: "Tech Startups in DMCC & DIFC",
    description:
      "Dubai's free zones are home to hundreds of blockchain and crypto companies. Startups in DMCC's Crypto Centre and DIFC's Innovation Hub increasingly offer token compensation alongside base AED salary to attract top Web3 talent.",
  },
  {
    icon: Briefcase,
    title: "Freelancers on International Contracts",
    description:
      "UAE-based freelancers working for international clients often receive payment in crypto. Platforms like Gitcoin, Braintrust, and direct contractor agreements commonly settle in USDT, USDC, or native tokens. The UAE's freelance visa makes this fully legitimate.",
  },
  {
    icon: Plane,
    title: "Remote Workers for Global Companies",
    description:
      "Digital nomads and remote workers in Dubai working for companies worldwide are increasingly choosing crypto payroll. The UAE's 0% tax makes it the optimal base for receiving crypto salary while working for employers anywhere in the world.",
  },
];

const WhoOfferingSection = () => {
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
            Employers
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-black dark:text-white tracking-tight mb-4">
            Who's Offering{" "}
            <span className="text-black/80 dark:text-white/50">
              Crypto Salaries?
            </span>
          </h2>
          <p className="text-black/50 dark:text-white/40 max-w-2xl leading-relaxed">
            From DAOs to Dubai startups, crypto compensation is growing fast in
            the UAE.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {offeringCategories.map((item, i) => {
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

const comparisonHeaders = [
  "",
  "Traditional AED Salary",
  "50/50 Split",
  "Full Crypto Salary",
];

const comparisonRows = [
  {
    feature: "Stability",
    values: ["High", "Balanced", "Variable"],
  },
  {
    feature: "Growth Potential",
    values: ["Low (AED pegged)", "Medium", "High"],
  },
  {
    feature: "Bank Compatibility",
    values: ["Full", "Full (AED portion)", "Convert when needed"],
  },
  {
    feature: "Tax Impact",
    values: ["0%", "0%", "0%"],
  },
  {
    feature: "Global Portability",
    values: ["Limited", "Good", "Excellent"],
  },
  {
    feature: "Inflation Protection",
    values: ["USD-pegged", "Partial", "Full (if holding BTC/ETH)"],
  },
  {
    feature: "WPS Compliance",
    values: ["Full", "Partial (AED via WPS)", "Requires structuring"],
  },
  {
    feature: "Recommended For",
    values: ["Risk-averse", "Most employees", "Web3 natives"],
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
            Crypto vs{" "}
            <span className="text-black/80 dark:text-white/50">
              Traditional Salary
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
                {comparisonHeaders.map((header, i) => (
                  <th
                    key={i}
                    className={`text-left p-4 text-[11px] font-semibold uppercase tracking-[0.12em] ${
                      i === 2
                        ? "text-black dark:text-white"
                        : "text-black/50 dark:text-white/40"
                    }`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => (
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
                  {row.values.map((val, j) => (
                    <td
                      key={j}
                      className={`p-4 ${
                        j === 1
                          ? "text-black dark:text-white font-medium"
                          : "text-black/50 dark:text-white/40"
                      }`}
                    >
                      {val}
                    </td>
                  ))}
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
   FAQ SECTION
   ═══════════════════════════════════════════════ */

const faqItems = [
  {
    q: "Can you legally get paid in crypto in the UAE?",
    a: "Yes. A 2024 Dubai Court ruling established that employers can pay part of an employee's salary in cryptocurrency, provided both parties agree. The AED portion must still comply with the Wage Protection System (WPS) for mainland companies. Free zone entities have more flexibility in structuring crypto compensation.",
  },
  {
    q: "Do I pay tax on crypto salary in the UAE?",
    a: "No. The UAE has 0% personal income tax, which applies to all forms of salary including cryptocurrency. There is no capital gains tax on crypto holdings for individuals either. This makes the UAE one of the most tax-efficient jurisdictions globally for receiving crypto compensation.",
  },
  {
    q: "How do I convert crypto salary to AED?",
    a: "You can use Blip to convert any portion of your crypto salary to AED instantly. Connect your Solana wallet, select the amount to convert, and receive AED via bank transfer. The process takes minutes and uses Blip's escrow-protected settlement for security.",
  },
  {
    q: "Which companies pay crypto salaries in UAE?",
    a: "Web3 companies and DAOs commonly pay full or partial crypto salaries. Tech startups in DMCC, DIFC, and ADGM free zones are increasingly offering crypto compensation packages. Many global remote companies also pay international contractors in crypto, and freelancers on platforms like Gitcoin and Braintrust receive crypto natively.",
  },
  {
    q: "What's the best crypto to receive salary in?",
    a: "It depends on your goals. USDT/USDC provide stability (pegged to USD, which is pegged to AED). BTC and ETH offer growth potential but come with volatility. SOL is fast and cheap for transfers. Many employees opt for a split — stablecoins for expenses and BTC/ETH for long-term accumulation.",
  },
  {
    q: "Does the Wage Protection System (WPS) apply to crypto salaries?",
    a: "WPS applies to the AED portion of salaries for mainland UAE companies. The crypto portion is treated as an additional benefit or bonus structure. Free zone companies have different rules — many DMCC and DIFC entities can structure crypto payments more flexibly.",
  },
  {
    q: "Can freelancers receive crypto payments in the UAE?",
    a: "Yes. Freelancers with a UAE freelance visa or permit can receive payments in any form, including cryptocurrency. Many international freelance platforms pay in crypto by default. Blip makes it easy to convert freelance crypto earnings to AED when needed.",
  },
  {
    q: "How do I set up a wallet for crypto salary?",
    a: "We recommend Phantom wallet for Solana-based payments. Download the Phantom app or browser extension, create a wallet (save your seed phrase securely), and share your wallet address with your employer. The setup takes under 5 minutes.",
  },
  {
    q: "Is crypto salary volatile? How do I manage the risk?",
    a: "If you receive salary in BTC or ETH, yes — the value fluctuates. You can manage this by: (1) receiving stablecoins like USDT/USDC for expenses, (2) using a split strategy where only a portion is in volatile crypto, or (3) converting to AED immediately on payday using Blip.",
  },
  {
    q: "What happens to my crypto salary if I leave the UAE?",
    a: "Your crypto stays in your wallet regardless of where you live — that's the beauty of self-custody. Unlike bank accounts that may be frozen when you leave, your crypto wallet travels with you globally. You can continue to access and convert your holdings from anywhere.",
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
          Ready to Get Paid{" "}
          <span className="text-black/80 dark:text-white/50">in Crypto?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg text-black/50 dark:text-white/40 max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Use Blip to convert your crypto salary to AED instantly, or hold and
          grow your portfolio. Non-custodial, escrow-protected, zero tax.
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
            Start Converting Crypto
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
            to="/crypto-escrow-uae"
            className="px-4 py-2 rounded-full border border-black/[0.06] dark:border-white/[0.06] text-black/50 dark:text-white/40 hover:text-black dark:hover:text-white hover:border-black/[0.12] dark:hover:border-white/[0.1] transition-all"
            onMouseEnter={() => sounds.hover()}
          >
            Crypto Escrow UAE
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

const CryptoSalaryUae = () => {
  return (
    <>
      <SEO
        title="Crypto Salary UAE — Get Paid in Crypto in Dubai 2026 | Blip Money"
        description="Can you get paid in crypto in the UAE? Complete guide to crypto salaries in Dubai. Dubai Court ruling, legal framework, salary conversion calculator, and how to settle crypto salary to AED."
        canonical="https://blip.money/crypto-salary-uae"
        keywords="crypto salary UAE, get paid crypto Dubai, salary in bitcoin UAE, crypto payroll Dubai, cryptocurrency salary Dubai, convert crypto salary to AED"
      />
      <HreflangTags path="/crypto-salary-uae" />
      <StructuredData type="custom" schema={faqSchema} />

      <div className="bg-[#FAF8F5] dark:bg-transparent text-black dark:text-white overflow-x-hidden">
        <HeroSection />
        <SalaryConverterSection />
        <LegalFrameworkSection />
        <HowToReceiveSection />
        <BenefitsSection />
        <WhoOfferingSection />
        <ComparisonSection />
        <FAQSection />
        <CTASection />
      </div>
    </>
  );
};

export default CryptoSalaryUae;
