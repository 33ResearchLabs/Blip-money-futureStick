import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Check,
  Shield,
  Building2,
  Globe,
  Scale,
  Landmark,
  FileText,
  BadgeCheck,
  Users,
  Briefcase,
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
      name: "Is cryptocurrency taxed in the UAE?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For individuals, cryptocurrency gains are not taxed in the UAE. There is no personal income tax or capital gains tax. For businesses, profits exceeding 375,000 AED are subject to a 9% corporate tax since June 2023.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to pay capital gains tax on crypto in the UAE?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. The UAE does not impose capital gains tax on individuals. Personal crypto trading profits are entirely tax-free for UAE residents, whether you are a citizen or an expat.",
      },
    },
    {
      "@type": "Question",
      name: "What is the corporate tax rate on crypto businesses in the UAE?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Since June 2023, the UAE charges a 9% corporate tax on taxable income exceeding 375,000 AED. This applies to crypto businesses operating in the UAE mainland. Qualifying Free Zone entities may be eligible for a 0% rate on qualifying income.",
      },
    },
    {
      "@type": "Question",
      name: "Is there VAT on cryptocurrency transactions in the UAE?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Crypto-to-crypto trades are generally exempt from VAT. However, service fees charged by exchanges and platforms may be subject to the standard 5% VAT. The Federal Tax Authority (FTA) has not published comprehensive crypto-specific VAT guidance yet.",
      },
    },
    {
      "@type": "Question",
      name: "What is CARF and how does it affect crypto holders in the UAE?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CARF (Crypto-Asset Reporting Framework) is an OECD standard for automatic exchange of crypto tax information between jurisdictions. The UAE has committed to implementing CARF by 2027. This means exchanges and platforms operating in the UAE will need to report user transactions to tax authorities.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need a VARA license to trade crypto in Dubai?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Individual traders do not need a VARA license. VARA licensing is required for businesses providing virtual asset services in Dubai, such as exchanges, brokerages, and custody providers. Using a VARA-licensed platform is recommended for regulatory protection.",
      },
    },
    {
      "@type": "Question",
      name: "Are crypto-to-crypto trades taxed in the UAE?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. For individuals, crypto-to-crypto trades are not taxed. For businesses, the gains from crypto-to-crypto trades would form part of the overall taxable income subject to the 9% corporate tax (above the 375,000 AED threshold).",
      },
    },
    {
      "@type": "Question",
      name: "What happens if I move to the UAE with existing crypto gains?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The UAE does not tax historical gains. Once you are a UAE tax resident, any future personal crypto gains are tax-free. However, you may still have tax obligations in your previous country of residence depending on their exit tax rules.",
      },
    },
    {
      "@type": "Question",
      name: "Do Free Zone companies pay tax on crypto income?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Qualifying Free Zone Persons can benefit from a 0% corporate tax rate on qualifying income. However, income from crypto activities must meet specific conditions to qualify. Non-qualifying income is taxed at the standard 9% rate.",
      },
    },
    {
      "@type": "Question",
      name: "Should I keep records of my crypto transactions in the UAE?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Even though individuals are not taxed, it is advisable to maintain transaction records for compliance, especially with CARF implementation approaching in 2027. Businesses are required to maintain proper accounting records for corporate tax purposes.",
      },
    },
  ],
};

/* ═══════════════════════════════════════════════
   COUNTRY COMPARISON DATA
   ═══════════════════════════════════════════════ */
const countryComparison = [
  { country: "UAE", personalTax: "0%", capitalGains: "0%", corporateTax: "9% (over 375K AED)", highlight: true },
  { country: "USA", personalTax: "Up to 37%", capitalGains: "Up to 20%", corporateTax: "21%" },
  { country: "UK", personalTax: "Up to 45%", capitalGains: "Up to 20%", corporateTax: "25%" },
  { country: "India", personalTax: "30% flat", capitalGains: "30% flat", corporateTax: "30%" },
  { country: "Singapore", personalTax: "0%", capitalGains: "0% (if not trading)", corporateTax: "17%" },
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
            { label: "Crypto Tax UAE" },
          ]}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 backdrop-blur-sm border border-black/[0.06] dark:border-white/10 bg-white/80 dark:bg-white/[0.03]"
        >
          <span className="w-2 h-2 rounded-full bg-black dark:bg-white animate-pulse" />
          <span className="text-xs text-black/60 dark:text-white/60 tracking-wide font-medium">
            2026 Guide
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-black dark:text-white tracking-tight leading-[1.1] mb-6"
        >
          Crypto Tax UAE 2026
          <br />
          <span className="text-black/80 dark:text-white/50">
            Complete Guide
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg sm:text-xl text-black/50 dark:text-white/40 max-w-2xl mb-10 leading-relaxed"
        >
          Is crypto taxed in the UAE? The short answer: not for individuals.
          This guide covers everything you need to know about cryptocurrency
          taxation for both individuals and businesses in the UAE, including
          corporate tax rules, CARF reporting, VARA compliance, and how the
          UAE compares globally.
        </motion.p>

        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-wrap gap-4"
        >
          <a
            href="#tax-checker"
            onClick={() => sounds.click()}
            onMouseEnter={() => sounds.hover()}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold hover:opacity-90 transition-all"
          >
            Check Your Tax Status
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#comparison"
            onClick={() => sounds.click()}
            onMouseEnter={() => sounds.hover()}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-black/[0.12] dark:border-white/[0.12] text-black dark:text-white font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-all"
          >
            UAE vs Other Countries
          </a>
        </motion.div> */}
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════
   INTERACTIVE TAX STATUS CHECKER
   ═══════════════════════════════════════════════ */
const TaxCheckerSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [entityType, setEntityType] = useState<"individual" | "business">("individual");
  const [revenueOver375k, setRevenueOver375k] = useState<boolean | null>(null);
  const [isFreeZone, setIsFreeZone] = useState<boolean | null>(null);

  const handleEntityToggle = (type: "individual" | "business") => {
    setEntityType(type);
    setRevenueOver375k(null);
    setIsFreeZone(null);
    sounds.toggle(type === "business");
  };

  return (
    <section
      id="tax-checker"
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
            Interactive Tool
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-black dark:text-white tracking-tight">
            Tax Status{" "}
            <span className="text-black/80 dark:text-white/50">Checker</span>
          </h2>
          <p className="text-sm text-black/70 dark:text-white/40 mt-3 max-w-lg mx-auto">
            Answer a few questions to see how cryptocurrency is taxed based on
            your situation in the UAE.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-xl mx-auto"
        >
          {/* Entity type toggle */}
          <div className="p-6 rounded-2xl bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] mb-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/80 dark:text-white/40 mb-4">
              Are you an individual or a business?
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleEntityToggle("individual")}
                onMouseEnter={() => sounds.hover()}
                className={`flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  entityType === "individual"
                    ? "bg-black dark:bg-white text-white dark:text-black"
                    : "bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/50 hover:bg-black/10 dark:hover:bg-white/10"
                }`}
              >
                <Users className="w-4 h-4" />
                Individual
              </button>
              <button
                onClick={() => handleEntityToggle("business")}
                onMouseEnter={() => sounds.hover()}
                className={`flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  entityType === "business"
                    ? "bg-black dark:bg-white text-white dark:text-black"
                    : "bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/50 hover:bg-black/10 dark:hover:bg-white/10"
                }`}
              >
                <Briefcase className="w-4 h-4" />
                Business
              </button>
            </div>
          </div>

          {/* Individual result */}
          <AnimatePresence mode="wait">
            {entityType === "individual" && (
              <motion.div
                key="individual"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="p-6 rounded-2xl bg-white/60 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06]"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-black/60 dark:text-white/40" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                      Your crypto gains are 0% taxed in the UAE
                    </h3>
                    <ul className="space-y-2 text-sm text-black/60 dark:text-white/40">
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-black/60 dark:text-white/40" />
                        No personal income tax on crypto profits
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-black/60 dark:text-white/40" />
                        No capital gains tax on crypto trades
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-black/60 dark:text-white/40" />
                        Crypto-to-crypto swaps are not taxed
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-black/60 dark:text-white/40" />
                        No inheritance or wealth tax on crypto holdings
                      </li>
                    </ul>
                    <p className="text-xs text-black/40 dark:text-white/30 mt-4">
                      Note: Keep transaction records for CARF reporting compliance (effective 2027).
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Business flow */}
            {entityType === "business" && (
              <motion.div
                key="business"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="space-y-4"
              >
                {/* Revenue question */}
                <div className="p-6 rounded-2xl bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06]">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/80 dark:text-white/40 mb-4">
                    Is your taxable income over 375,000 AED?
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setRevenueOver375k(true);
                        sounds.click();
                      }}
                      onMouseEnter={() => sounds.hover()}
                      className={`flex-1 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                        revenueOver375k === true
                          ? "bg-black dark:bg-white text-white dark:text-black"
                          : "bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/50 hover:bg-black/10 dark:hover:bg-white/10"
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => {
                        setRevenueOver375k(false);
                        sounds.click();
                      }}
                      onMouseEnter={() => sounds.hover()}
                      className={`flex-1 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                        revenueOver375k === false
                          ? "bg-black dark:bg-white text-white dark:text-black"
                          : "bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/50 hover:bg-black/10 dark:hover:bg-white/10"
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>

                {/* Free zone question (only if revenue > 375k) */}
                <AnimatePresence>
                  {revenueOver375k === true && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 rounded-2xl bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06]">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/40 dark:text-white/40 mb-4">
                          Are you a Qualifying Free Zone Person?
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              setIsFreeZone(true);
                              sounds.click();
                            }}
                            onMouseEnter={() => sounds.hover()}
                            className={`flex-1 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                              isFreeZone === true
                                ? "bg-black dark:bg-white text-white dark:text-black"
                                : "bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/50 hover:bg-black/10 dark:hover:bg-white/10"
                            }`}
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => {
                              setIsFreeZone(false);
                              sounds.click();
                            }}
                            onMouseEnter={() => sounds.hover()}
                            className={`flex-1 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                              isFreeZone === false
                                ? "bg-black dark:bg-white text-white dark:text-black"
                                : "bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/50 hover:bg-black/10 dark:hover:bg-white/10"
                            }`}
                          >
                            No
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Results */}
                <AnimatePresence>
                  {revenueOver375k === false && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className="p-6 rounded-2xl bg-white/60 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06]"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center flex-shrink-0">
                          <Check className="w-5 h-5 text-black/60 dark:text-white/40" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                            0% Corporate Tax
                          </h3>
                          <p className="text-sm text-black/60 dark:text-white/40">
                            Taxable income up to 375,000 AED is taxed at 0%.
                            Your crypto business profits below this threshold
                            are not subject to corporate tax. You still need to
                            register and file if required by the FTA.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {revenueOver375k === true && isFreeZone === true && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className="p-6 rounded-2xl bg-white/60 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06]"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center flex-shrink-0">
                          <Shield className="w-5 h-5 text-black/60 dark:text-white/40" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                            Potentially 0% on Qualifying Income
                          </h3>
                          <p className="text-sm text-black/60 dark:text-white/40">
                            Qualifying Free Zone Persons may benefit from a 0%
                            corporate tax rate on qualifying income. Your crypto
                            activities must meet specific conditions set by the
                            Ministry of Finance. Non-qualifying income is still
                            taxed at 9%. Consult a tax advisor to confirm
                            eligibility.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {revenueOver375k === true && isFreeZone === false && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className="p-6 rounded-2xl bg-white/60 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06]"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-black/60 dark:text-white/40" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                            9% Corporate Tax Applies
                          </h3>
                          <p className="text-sm text-black/60 dark:text-white/40">
                            Taxable income exceeding 375,000 AED is subject to a
                            9% corporate tax rate. This applies to all crypto
                            business profits, including trading gains, service
                            fees, and other revenue. The first 375,000 AED
                            remains taxed at 0%. Register with the Federal Tax
                            Authority and file annual returns.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════
   KEY TAX RULES OVERVIEW
   ═══════════════════════════════════════════════ */
const TaxRulesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const rules = [
    {
      icon: Users,
      title: "Individual: 0% Tax",
      highlight: "No personal income tax. No capital gains tax.",
      items: [
        "Crypto trading profits are entirely tax-free",
        "No distinction between short-term and long-term gains",
        "Applies to UAE citizens, residents, and expats",
        "No wealth tax or inheritance tax on crypto holdings",
      ],
      color: "emerald" as const,
    },
    {
      icon: Building2,
      title: "Corporate: 9% Tax",
      highlight: "On profits exceeding 375,000 AED (since June 2023).",
      items: [
        "First 375,000 AED of taxable income is taxed at 0%",
        "9% on profits above the threshold",
        "Applies to crypto exchanges, brokerages, and service providers",
        "Must register with Federal Tax Authority (FTA)",
      ],
      color: "amber" as const,
    },
    {
      icon: Landmark,
      title: "Free Zone: Potentially 0%",
      highlight: "Qualifying Free Zone entities may get 0% rate.",
      items: [
        "Must be a Qualifying Free Zone Person (QFZP)",
        "0% on qualifying income, 9% on non-qualifying income",
        "Specific conditions must be met for crypto activities",
        "DMCC, ADGM, DIFC are popular for crypto businesses",
      ],
      color: "blue" as const,
    },
    {
      icon: Scale,
      title: "VAT: 5% on Services",
      highlight: "Crypto-to-crypto trades are exempt.",
      items: [
        "5% VAT on service fees charged by platforms and exchanges",
        "Crypto-to-crypto trades are generally VAT exempt",
        "Crypto-to-fiat conversion service fees may attract VAT",
        "FTA guidance on crypto-specific VAT is evolving",
      ],
      color: "violet" as const,
    },
  ];

  const colorMap = {
    emerald: {
      bg: "bg-white/60 dark:bg-white/[0.03]",
      border: "border-black/[0.06] dark:border-white/[0.06]",
      text: "text-black dark:text-white",
      icon: "text-black/60 dark:text-white/40",
      iconBg: "bg-black/5 dark:bg-white/5",
      check: "text-black/40 dark:text-white/30",
    },
    amber: {
      bg: "bg-white/60 dark:bg-white/[0.03]",
      border: "border-black/[0.06] dark:border-white/[0.06]",
      text: "text-black dark:text-white",
      icon: "text-black/60 dark:text-white/40",
      iconBg: "bg-black/5 dark:bg-white/5",
      check: "text-black/40 dark:text-white/30",
    },
    blue: {
      bg: "bg-white/60 dark:bg-white/[0.03]",
      border: "border-black/[0.06] dark:border-white/[0.06]",
      text: "text-black dark:text-white",
      icon: "text-black/60 dark:text-white/40",
      iconBg: "bg-black/5 dark:bg-white/5",
      check: "text-black/40 dark:text-white/30",
    },
    violet: {
      bg: "bg-white/60 dark:bg-white/[0.03]",
      border: "border-black/[0.06] dark:border-white/[0.06]",
      text: "text-black dark:text-white",
      icon: "text-black/60 dark:text-white/40",
      iconBg: "bg-black/5 dark:bg-white/5",
      check: "text-black/40 dark:text-white/30",
    },
  };

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
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/80 dark:text-white/40 mb-4 block">
            Tax Framework
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-black dark:text-white tracking-tight">
            Key Tax{" "}
            <span className="text-black/80 dark:text-white/50">Rules</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rules.map((rule, i) => {
            const Icon = rule.icon;
            const colors = colorMap[rule.color];
            return (
              <motion.div
                key={rule.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 * i }}
                className={`group p-6 rounded-2xl ${colors.bg} border ${colors.border} transition-colors duration-500`}
                onMouseEnter={() => sounds.hover()}
              >
                <div className={`w-12 h-12 rounded-xl ${colors.iconBg} flex items-center justify-center mb-5`}>
                  <Icon className={`w-5 h-5 ${colors.icon}`} />
                </div>
                <h3 className={`text-lg font-semibold ${colors.text} mb-2`}>
                  {rule.title}
                </h3>
                <p className={`text-sm ${colors.text} opacity-80 mb-4`}>
                  {rule.highlight}
                </p>
                <ul className="space-y-2">
                  {rule.items.map((item, j) => (
                    <li key={j} className={`flex items-start gap-2 text-sm ${colors.text} opacity-70`}>
                      <Check className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${colors.check}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════
   CARF & CRS REPORTING
   ═══════════════════════════════════════════════ */
const CARFSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const points = [
    {
      title: "What is CARF?",
      desc: "The Crypto-Asset Reporting Framework (CARF) is an OECD standard designed for automatic exchange of crypto transaction information between tax authorities globally. It extends the Common Reporting Standard (CRS) to cover crypto assets specifically.",
    },
    {
      title: "UAE Implementation Timeline",
      desc: "The UAE has committed to implementing CARF by 2027. This means crypto exchanges, brokers, and platforms operating in the UAE will need to collect and report user transaction data to the Federal Tax Authority, which will share it with other participating jurisdictions.",
    },
    {
      title: "What Platforms Must Report",
      desc: "Under CARF, reporting entities include exchanges, brokers, ATM operators, and certain DeFi protocols with identifiable intermediaries. They must report transaction types, aggregate values, and user identification details for both domestic and foreign users.",
    },
    {
      title: "What This Means for You",
      desc: "Even though UAE individuals pay 0% tax on crypto, CARF means your transaction data may be shared with your home country's tax authority if you hold citizenship or tax residency elsewhere. Maintaining clean records is essential for cross-border compliance.",
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
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/80 dark:text-white/40 mb-4 block">
            New for 2026-2027
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-black dark:text-white tracking-tight">
            CARF & CRS{" "}
            <span className="text-black/80 dark:text-white/50">Reporting</span>
          </h2>
        </motion.div>

        <div className="space-y-4">
          {points.map((point, i) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * i }}
              className="group flex items-start gap-5 p-6 rounded-2xl bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] hover:border-black/20 dark:hover:border-white/20 transition-colors duration-500"
              onMouseEnter={() => sounds.hover()}
            >
              <div className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors duration-500">
                <Globe className="w-5 h-5 text-black/60 dark:text-white/60 group-hover:text-black dark:group-hover:text-white transition-colors duration-500" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-black dark:text-white mb-2">
                  {point.title}
                </h3>
                <p className="text-sm text-black/50 dark:text-white/70 leading-relaxed">
                  {point.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════
   VARA REGULATORY SECTION
   ═══════════════════════════════════════════════ */
const VARASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const categories = [
    {
      title: "Advisory Services",
      desc: "Providing recommendations on virtual assets to clients.",
    },
    {
      title: "Broker-Dealer",
      desc: "Acting as intermediary in virtual asset transactions.",
    },
    {
      title: "Custody Services",
      desc: "Safeguarding and administering virtual assets on behalf of clients.",
    },
    {
      title: "Exchange",
      desc: "Operating a platform for trading virtual assets.",
    },
    {
      title: "Lending & Borrowing",
      desc: "Facilitating the lending or borrowing of virtual assets.",
    },
    {
      title: "Transfer & Settlement",
      desc: "Providing transfer and settlement services for virtual assets.",
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
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/80 dark:text-white/40 mb-4 block">
            Dubai Regulation
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-black dark:text-white tracking-tight">
            VARA{" "}
            <span className="text-black/80 dark:text-white/50">Compliance</span>
          </h2>
          <p className="text-sm text-black/50 dark:text-white/40 mt-3 max-w-lg mx-auto">
            The Virtual Assets Regulatory Authority (VARA) is Dubai's dedicated
            crypto regulator. While VARA does not directly impose taxes, its
            framework affects how crypto businesses operate and report.
          </p>
        </motion.div>

        {/* Licensing categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="p-6 rounded-2xl bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] mb-6"
        >
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/40 dark:text-white/40 mb-5">
            VARA Licensing Categories
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.05 * i + 0.3 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02]"
                onMouseEnter={() => sounds.hover()}
              >
                <BadgeCheck className="w-4 h-4 mt-0.5 text-black/40 dark:text-white/40 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-black dark:text-white">
                    {cat.title}
                  </div>
                  <div className="text-xs text-black/70 dark:text-white/30 mt-0.5">
                    {cat.desc}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Key takeaways */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="p-5 rounded-2xl bg-white/60 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06]"
          >
            <h4 className="text-sm font-semibold text-black dark:text-white mb-2">
              Impact on Taxation
            </h4>
            <p className="text-xs text-black/70 dark:text-white/40 leading-relaxed">
              VARA-licensed entities must maintain proper books and records,
              which aligns with corporate tax compliance requirements. VARA
              mandates AML/KYC procedures that create audit trails used by tax
              authorities.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="p-5 rounded-2xl bg-white/60 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06]"
          >
            <h4 className="text-sm font-semibold text-black dark:text-white mb-2">
              For Individual Traders
            </h4>
            <p className="text-xs text-black/70 dark:text-white/40 leading-relaxed">
              You do not need a VARA license to trade crypto as an individual.
              Use VARA-licensed platforms for regulatory protection and dispute
              resolution. Your personal trading remains 0% taxed regardless
              of platform choice.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════
   COUNTRY COMPARISON TABLE
   ═══════════════════════════════════════════════ */
const ComparisonSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

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
            Global Context
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-black dark:text-white tracking-tight">
            UAE vs Other{" "}
            <span className="text-black/80 dark:text-white/50">Countries</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-2xl bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] overflow-hidden"
        >
          <div className="overflow-x-scroll">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/[0.06] dark:border-white/[0.06]">
                  <th className="text-left p-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/80 dark:text-white/40">
                    Country
                  </th>
                  <th className="text-left p-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/80 dark:text-white/40">
                    Personal Crypto Tax
                  </th>
                  <th className="text-left p-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/80 dark:text-white/40">
                    Capital Gains
                  </th>
                  <th className="text-left p-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/80 dark:text-white/40">
                    Corporate Tax
                  </th>
                </tr>
              </thead>
              <tbody>
                {countryComparison.map((row, i) => (
                  <motion.tr
                    key={row.country}
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.05 * i + 0.3 }}
                    className={`border-b border-black/[0.04] dark:border-white/[0.04] last:border-0 transition-colors ${
                      row.highlight
                        ? "bg-black/[0.02] dark:bg-white/[0.02]"
                        : "hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                    }`}
                    onMouseEnter={() => sounds.hover()}
                  >
                    <td className="p-4 font-medium text-black dark:text-white">
                      <span className="flex items-center gap-2">
                        {row.country}
                        {row.highlight && (
                          <span className="px-1.5 py-0.5 text-[10px] rounded bg-black/[0.06] dark:bg-white/[0.10] text-black dark:text-white font-medium">
                            Best
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={
                          row.personalTax === "0%"
                            ? "text-black dark:text-white font-medium"
                            : "text-black/60 dark:text-white/50"
                        }
                      >
                        {row.personalTax}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={
                          row.capitalGains.startsWith("0%")
                            ? "text-black dark:text-white font-medium"
                            : "text-black/60 dark:text-white/50"
                        }
                      >
                        {row.capitalGains}
                      </span>
                    </td>
                    <td className="p-4 text-black/60 dark:text-white/50">
                      {row.corporateTax}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-xs text-black/70 dark:text-white/30 text-center mt-4"
        >
          Rates as of 2026. This is general information and does not constitute
          tax advice. Consult a qualified tax professional for your specific
          situation.
        </motion.p>
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
      q: "Is cryptocurrency taxed in the UAE?",
      a: "For individuals, no. The UAE does not impose personal income tax or capital gains tax on cryptocurrency profits. For businesses, the 9% corporate tax applies to taxable income exceeding 375,000 AED, which includes crypto-related profits.",
    },
    {
      q: "Do I need to pay capital gains tax on crypto in the UAE?",
      a: "No. The UAE does not have a capital gains tax for individuals. Whether you hold crypto for a day or a decade, your personal trading gains are tax-free. This applies to all types of crypto assets including Bitcoin, Ethereum, stablecoins, and NFTs.",
    },
    {
      q: "What is the corporate tax rate on crypto businesses in the UAE?",
      a: "Since June 2023, the UAE charges a 9% corporate tax on taxable income exceeding 375,000 AED. The first 375,000 AED is taxed at 0%. This applies to all businesses, including those dealing in cryptocurrency. Qualifying Free Zone entities may be eligible for a 0% rate on qualifying income.",
    },
    {
      q: "Is there VAT on cryptocurrency transactions in the UAE?",
      a: "Crypto-to-crypto trades are generally exempt from VAT. However, service fees charged by exchanges, brokers, and platforms may be subject to the standard 5% VAT. The Federal Tax Authority has not issued comprehensive crypto-specific VAT guidance, so consult a tax advisor for your situation.",
    },
    {
      q: "What is CARF and how does it affect crypto holders in the UAE?",
      a: "CARF (Crypto-Asset Reporting Framework) is an OECD standard for automatic exchange of crypto transaction information between jurisdictions. The UAE has committed to implementing CARF by 2027. Exchanges and platforms will be required to report transaction data to the FTA, which may share it with other countries.",
    },
    {
      q: "Do I need a VARA license to trade crypto in Dubai?",
      a: "No, individual traders do not need a VARA license. VARA licensing is required for businesses providing virtual asset services in Dubai, such as exchanges, brokerages, custody providers, and advisory services. As a trader, you should use VARA-licensed platforms for regulatory protection.",
    },
    {
      q: "Are crypto-to-crypto trades taxed in the UAE?",
      a: "For individuals, no. Swapping one cryptocurrency for another is not a taxable event in the UAE. For businesses, the gains from crypto-to-crypto trades form part of overall taxable income and are subject to the 9% corporate tax above the 375,000 AED threshold.",
    },
    {
      q: "What happens if I move to the UAE with existing crypto gains?",
      a: "The UAE does not tax historical gains earned before you become a UAE tax resident. Once you establish UAE tax residency, future personal crypto gains are tax-free. However, you may still have tax obligations in your previous country of residence depending on their exit tax rules and reporting requirements.",
    },
    {
      q: "Do Free Zone companies pay tax on crypto income?",
      a: "Qualifying Free Zone Persons (QFZPs) can benefit from a 0% corporate tax rate on qualifying income. However, crypto activities must meet specific conditions set by the Ministry of Finance to qualify. Non-qualifying income, such as income from mainland UAE sources, is taxed at the standard 9% rate.",
    },
    {
      q: "Should I keep records of my crypto transactions in the UAE?",
      a: "Yes, absolutely. Even though individuals are not taxed on crypto gains, maintaining transaction records is important for several reasons: CARF compliance (effective 2027), proof of source of funds for banking, and potential future regulatory requirements. Businesses are legally required to maintain proper accounting records for corporate tax purposes.",
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
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/80 dark:text-white/40 mb-4 block">
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
              transition={{ duration: 0.5, delay: 0.05 * i }}
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
    { label: "USDT vs USDC", href: "/usdt-vs-usdc" },
    { label: "Crypto Payments UAE", href: "/crypto-payments-uae" },
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
          Tax-Free Crypto{" "}
          <span className="text-black/80 dark:text-white/50">Settlement</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg text-black/50 dark:text-white/40 max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Convert your crypto to AED with zero personal tax in the UAE.
          Blip Money provides instant settlement through decentralized escrow
          with bonded merchants.
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
          <CTAButton to="/waitlist" className="w-[220px] h-[48px]">Start Using Blip</CTAButton>
        </motion.div>

        {/* Cross-links */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-14 pt-8 border-t border-black/[0.06] dark:border-white/[0.06]"
        >
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/80 dark:text-white/40 mb-4">
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
const CryptoTaxUae = () => {
  return (
    <>
      <SEO
        title="Crypto Tax UAE 2026 — Complete Guide for Individuals & Businesses | Blip Money"
        description="Is crypto taxed in the UAE? Complete 2026 guide to cryptocurrency taxation for individuals and businesses. Zero personal income tax, 9% corporate tax rules, CARF reporting, and VARA compliance."
        canonical="https://blip.money/crypto-tax-uae"
        keywords="crypto tax UAE, crypto tax Dubai 2026, is crypto taxed in UAE, cryptocurrency tax UAE, VARA tax, UAE crypto capital gains, corporate tax crypto UAE"
      />
      <HreflangTags path="/crypto-tax-uae" />
      <StructuredData type="custom" schema={faqSchema} />

      <div className="bg-[#FAF8F5] dark:bg-transparent text-black dark:text-white overflow-x-hidden">
        <HeroSection />
        <TaxCheckerSection />
        <TaxRulesSection />
        <CARFSection />
        <VARASection />
        <ComparisonSection />
        <FAQSection />
        <CTASection />
      </div>
    </>
  );
};

export default CryptoTaxUae;
