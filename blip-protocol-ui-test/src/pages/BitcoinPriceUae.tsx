import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  TrendingUp,
  Shield,
  Zap,
  ChevronDown,
  RefreshCw,
  Globe,
  Banknote,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "@/components";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { HreflangTags } from "@/components/HreflangTags";
import StructuredData from "@/components/StructuredData";
import { sounds } from "@/lib/sounds";
import { CTAButton } from "@/components/Navbar";

/* ═══════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════ */

const AED_RATE = 3.6725;
const STATIC_BTC_USD = 97500;
const STATIC_BTC_AED = Math.round(STATIC_BTC_USD * AED_RATE);

/* ═══════════════════════════════════════════════
   FAQ DATA
   ═══════════════════════════════════════════════ */

const FAQ_DATA = [
  {
    q: "What is the current Bitcoin price in UAE Dirhams?",
    a: "The current Bitcoin price in AED is displayed in the live rate card on this page, updated every 60 seconds from CoinGecko market data. Because the UAE Dirham is pegged to the US Dollar at approximately 3.6725 AED per USD, the BTC/AED price moves in lockstep with the global BTC/USD rate. You can also use our BTC to AED converter for exact amounts.",
  },
  {
    q: "Is Bitcoin legal in the UAE?",
    a: "Yes. Bitcoin and other cryptocurrencies are legal in the UAE. Dubai's Virtual Assets Regulatory Authority (VARA) and Abu Dhabi's Financial Services Regulatory Authority (ADGM FSRA) provide clear licensing frameworks for virtual asset activities. The UAE is one of the most crypto-friendly jurisdictions in the world, with over 40 licensed exchanges and growing institutional adoption.",
  },
  {
    q: "How can I buy or sell Bitcoin in the UAE?",
    a: "You can buy or sell Bitcoin in the UAE through licensed centralized exchanges, peer-to-peer platforms, or escrow-protected protocols like Blip Money. With Blip, you connect your wallet, enter the BTC amount, and a verified merchant settles the trade in AED — all protected by on-chain smart contract escrow on Solana. Settlement typically takes under 15 minutes.",
  },
  {
    q: "Why does the Bitcoin price differ in AED vs USD?",
    a: "The Bitcoin price in AED is derived from the BTC/USD price multiplied by the USD/AED exchange rate (approximately 3.6725). Since the Dirham is pegged to the US Dollar, the AED price tracks the USD price closely. Minor variations can occur due to local supply and demand on UAE-based exchanges, but the peg ensures they remain tightly correlated.",
  },
  {
    q: "What factors affect Bitcoin's price in the UAE market?",
    a: "Bitcoin's price in the UAE is primarily driven by global market factors: institutional adoption, macroeconomic conditions, regulatory developments, and network fundamentals like the halving cycle. Local factors include UAE regulatory announcements from VARA, regional adoption trends, and liquidity on UAE-based exchanges. The AED peg to USD means currency fluctuation is not a significant factor.",
  },
];

/* ═══════════════════════════════════════════════
   WHY TRACK DATA
   ═══════════════════════════════════════════════ */

const WHY_TRACK_DATA = [
  {
    icon: Globe,
    title: "AED-Pegged Clarity",
    description:
      "The UAE Dirham is pegged to the US Dollar at 3.6725, giving you a stable reference point. Tracking BTC in AED removes currency conversion guesswork for UAE-based investors.",
  },
  {
    icon: Banknote,
    title: "Local Spending Power",
    description:
      "Knowing your Bitcoin balance in AED helps you plan real purchases, bill payments, and investments in the local economy without mental currency conversion.",
  },
  {
    icon: TrendingUp,
    title: "Tax & Compliance",
    description:
      "While the UAE has no personal income tax on crypto gains, businesses and free zone entities may need AED-denominated records for VAT and accounting purposes.",
  },
  {
    icon: Shield,
    title: "Smarter Off-Ramping",
    description:
      "Monitoring the BTC/AED rate helps you time your conversions to AED more effectively, whether you are selling through Blip, an exchange, or an OTC desk.",
  },
];

/* ═══════════════════════════════════════════════
   HOW TO CONVERT STEPS
   ═══════════════════════════════════════════════ */

const HOW_TO_STEPS = [
  {
    step: 1,
    title: "Check the live BTC/AED rate",
    description:
      "Visit this page or our BTC to AED converter to see the current Bitcoin price in UAE Dirhams, updated in real time from global market data.",
  },
  {
    step: 2,
    title: "Enter your BTC amount",
    description:
      "Go to the BTC to AED converter, enter how much Bitcoin you want to convert, and instantly see the equivalent AED value at the live rate.",
  },
  {
    step: 3,
    title: "Convert with escrow protection",
    description:
      "Confirm your trade on Blip. Your BTC value is locked in an on-chain escrow smart contract, a verified merchant sends AED to your bank, and settlement completes in under 15 minutes.",
  },
];

/* ═══════════════════════════════════════════════
   ANIMATED SECTION WRAPPER
   ═══════════════════════════════════════════════ */

function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
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
   FAQ ACCORDION ITEM
   ═══════════════════════════════════════════════ */

function FAQItem({
  q,
  a,
  open,
  toggle,
}: {
  q: string;
  a: string;
  open: boolean;
  toggle: () => void;
}) {
  return (
    <div className="border-b border-black/[0.06] dark:border-white/[0.06]">
      <button
        onClick={() => {
          toggle();
          sounds.click();
        }}
        className="flex items-center justify-between w-full py-5 text-left"
      >
        <span className="text-[15px] font-semibold text-black dark:text-white pr-8">
          {q}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-black/30 dark:text-white/30 transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-[14px] text-black/50 dark:text-white/40 leading-relaxed">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   STRUCTURED DATA SCHEMA
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

/* ═══════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════ */

const BitcoinPriceUae = () => {
  /* ── Live price state ── */
  const [btcPrice, setBtcPrice] = useState({ usd: STATIC_BTC_USD, aed: STATIC_BTC_AED });
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPrice = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,aed"
        );
        const data = await res.json();
        if (data.bitcoin) {
          setBtcPrice({ usd: data.bitcoin.usd, aed: data.bitcoin.aed });
          setLastUpdated(new Date().toLocaleTimeString());
        }
      } catch {
        // Use static fallback — no-op
      } finally {
        setLoading(false);
      }
    };
    fetchPrice();
    const interval = setInterval(fetchPrice, 60000);
    return () => clearInterval(interval);
  }, []);

  /* ── FAQ state ── */
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  /* ── Section refs ── */
  const heroRef = useRef(null);
  const ref = useRef(null);
  const heroInView = useInView(heroRef, { once: true, margin: "-60px" });
  const isInView = useInView(heroRef, { once: true, margin: "-100px" });

  return (
    <>
      {/* ═══ SEO ═══ */}
      <SEO
        title="Bitcoin Price UAE - Live BTC to AED Rate | Blip Money"
        description="Track the live Bitcoin price in UAE Dirhams (AED). Real-time BTC/AED rate, market insights, and instant conversion tools for UAE residents. Convert BTC to AED with escrow protection on Blip Money."
        canonical="https://blip.money/bitcoin-price-uae"
        keywords="bitcoin price uae, bitcoin price in uae, btc price aed, bitcoin uae dirham, bitcoin rate dubai, btc to aed rate, bitcoin price in dubai, bitcoin aed live, crypto price uae"
        type="website"
      />
      <HreflangTags path="/bitcoin-price-uae" />
      <StructuredData type="custom" schema={faqSchema} />

      <div className="bg-[#FAF8F5] dark:bg-black text-black dark:text-white overflow-x-hidden">
        {/* ═══════════════════════════════════════════════
            HERO
            ═══════════════════════════════════════════════ */}
        <header className="relative pt-32 sm:pt-36 pb-12 sm:pb-16">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "BTC to AED", href: "/btc-to-aed" },
                { label: "Bitcoin Price UAE" },
              ]}
            />

            <motion.div
              ref={heroRef}
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
              className="mt-6"
            >
              {/* Badge */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/[0.08] dark:border-white/[0.08]">
                  <div className="w-2 h-2 rounded-full bg-[#ff6b35] animate-pulse" />
                  <span className="text-xs font-semibold text-black/60 dark:text-white/40">
                    Live Rates
                  </span>
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black dark:text-white tracking-tight leading-[1.08] mb-4">
                Bitcoin Price
                <br />
                <span className="text-black/80 dark:text-white/60">
  in the UAE.
</span>

              </h1>

              <p className="text-lg sm:text-xl text-black/50 dark:text-white/40 max-w-xl leading-relaxed mb-10">
                Track the live Bitcoin to AED exchange rate. Real-time price data
                for UAE residents, updated every minute from global markets.
              </p>

              {/* <Link
                to="/btc-to-aed"
                onClick={() => sounds.click()}
                onMouseEnter={() => sounds.hover()}
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold text-[15px] hover:opacity-90 transition-opacity"
              >
                Convert BTC to AED
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link> */}
              <CTAButton to="/btc-to-aed" className="w-[220px] h-[48px]">Convert BTC to AED</CTAButton>
            </motion.div>
          </div>
        </header>

        {/* ═══════════════════════════════════════════════
            LIVE PRICE SECTION
            ═══════════════════════════════════════════════ */}
        <Section className="py-16 sm:py-20 border-t border-black/[0.04] dark:border-white/[0.04]">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <p className="text-xs uppercase tracking-[0.3em] text-black/80 dark:text-white/40 mb-4">
              Live Bitcoin Price
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-8">
              BTC / AED Rate Today
            </h2>

            <div className="bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] rounded-2xl p-6 sm:p-8 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] dark:shadow-none">
              {/* Coin header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-lg font-bold">
                  ₿
                </div>
                <div>
                  <span className="block text-[15px] font-bold text-black dark:text-white">
                    Bitcoin (BTC)
                  </span>
                  <span className="block text-xs text-black/40 dark:text-white/40">
                    AED/USD Peg: {AED_RATE}
                  </span>
                </div>
                {loading && (
                  <RefreshCw className="w-4 h-4 text-black/20 dark:text-white/20 animate-spin ml-auto" />
                )}
              </div>

              {/* Price display */}
              <div className="mb-4">
                <div className="text-4xl sm:text-5xl font-bold text-black dark:text-white tabular-nums tracking-tight">
                  AED{" "}
                  {btcPrice.aed.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="text-lg text-black/40 dark:text-white/40 mt-2 tabular-nums">
                  &asymp; $
                  {btcPrice.usd.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  USD
                </div>
              </div>

              {/* Last updated */}
              <div className="flex items-center gap-2 pt-4 border-t border-black/[0.06] dark:border-white/[0.06]">
                <div className="w-2 h-2 rounded-full bg-[#ff6b35] animate-pulse" />
                <span className="text-xs text-black/80 dark:text-white/40">
                  {lastUpdated
                    ? `Last updated: ${lastUpdated}`
                    : "Fetching live rate..."}
                </span>
              </div>
            </div>

            {/* Quick stats row */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="p-4 rounded-xl bg-white/60 dark:bg-white/[0.03] border border-black/[0.08] dark:border-white/[0.06]">
                <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-black/30 dark:text-white/25">
                  1 BTC in USD
                </span>
                <span className="block text-lg font-bold text-black dark:text-white mt-1 tabular-nums">
                  $
                  {btcPrice.usd.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-white/60 dark:bg-white/[0.03] border border-black/[0.08] dark:border-white/[0.06]">
                <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-black/30 dark:text-white/25">
                  AED/USD Peg
                </span>
                <span className="block text-lg font-bold text-black dark:text-white mt-1 tabular-nums">
                  {AED_RATE}
                </span>
              </div>
            </div>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════════
            WHY TRACK BTC IN AED
            ═══════════════════════════════════════════════ */}
        <Section className="py-16 sm:py-20 border-t border-black/[0.04] dark:border-white/[0.04]">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <p className="text-xs uppercase tracking-[0.3em] text-black/80 dark:text-white/40 mb-4">
              For UAE Residents
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-10">
              Why Track Bitcoin in AED
            </h2>

            <div className="grid sm:grid-cols-2 gap-6">
              {WHY_TRACK_DATA.map((item) => (
                <div
                  key={item.title}
                  className="p-6 rounded-2xl bg-white/60 dark:bg-white/[0.03] border border-black/[0.08] dark:border-white/[0.06]"
                >
                  <div className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center mb-4">
                    <item.icon className="w-5 h-5 text-black/40 dark:text-white/40" />
                  </div>
                  <h3 className="text-[15px] font-bold text-black dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[14px] text-black/50 dark:text-white/40 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════════
            HOW TO CONVERT
            ═══════════════════════════════════════════════ */}
        <Section className="py-16 sm:py-20 border-t border-black/[0.04] dark:border-white/[0.04]">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <p className="text-xs uppercase tracking-[0.3em] text-black/80 dark:text-white/40 mb-4">
              Step by Step
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-2">
              How to Convert BTC to AED
            </h2>
            <p className="text-black/80 dark:text-white/50 mb-10 max-w-xl">
              Go from checking the Bitcoin price to converting your BTC to UAE
              Dirhams in three simple steps.
            </p>

            <div className="grid sm:grid-cols-3 gap-6">
              {HOW_TO_STEPS.map((s) => (
                <div
                  key={s.step}
                  className="relative p-4 rounded-2xl bg-white/60 dark:bg-white/[0.03] border border-black/[0.08] dark:border-white/[0.06]"
                >
                  <div className="flex items-center  gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black text-sm font-semibold">
                      {s.step}
                    </div>
                    <h3 className="text-[14px] font-bold text-black dark:text-white">
                      {s.title}
                    </h3>
                  </div>
                  <p className="text-[14px] text-black/50 dark:text-white/40 leading-relaxed">
                    {s.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              {/* <Link
                to="/btc-to-aed"
                onClick={() => sounds.click()}
                onMouseEnter={() => sounds.hover()}
                className="group inline-flex items-center gap-2 text-sm font-semibold text-black dark:text-white hover:opacity-70 transition-opacity"
              >
                Open BTC to AED Converter
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link> */}
               <CTAButton to="/btc-to-aed" className="w-[220px] h-[48px]">Convert BTC to AED</CTAButton>
            </div>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════════
            FAQ SECTION
            ═══════════════════════════════════════════════ */}
        <Section className="py-16 sm:py-20 border-t border-black/[0.04] dark:border-white/[0.04]">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <p className="text-xs text-center uppercase tracking-[0.3em] text-black/80 dark:text-white/40 mb-4">
              Common Questions
            </p>
            <h2 className="text-2xl sm:text-3xl text-center font-bold text-black dark:text-white mb-2">
              Bitcoin Price UAE — FAQ
            </h2>
            <p className="text-black/80 text-center dark:text-white/50 mb-8">
              Everything you need to know about Bitcoin pricing and trading in
              the United Arab Emirates.
            </p>
{/* 
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
            </div> */}

            <div className="space-y-4">
                      {FAQ_DATA.map((faq, i) => (
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
        </Section>

        {/* ═══════════════════════════════════════════════
            SEO CONTENT BLOCK
            ═══════════════════════════════════════════════ */}
        <Section className="py-16 sm:py-20 border-t border-black/[0.04] dark:border-white/[0.04]">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <p className="text-xs uppercase tracking-[0.3em] text-black/80 dark:text-white/40 mb-4">
              Market Context
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-6">
              Bitcoin Price and Trading in the UAE
            </h2>

            <div className="bg-white/60 dark:bg-white/[0.03] border border-black/[0.08] dark:border-white/[0.06] rounded-2xl p-6 sm:p-8 space-y-5">
              <p className="text-[15px] text-black/50 dark:text-white/40 leading-relaxed">
                The United Arab Emirates has emerged as one of the world's
                leading cryptocurrency hubs, and Bitcoin sits at the center of
                that momentum. With Dubai's VARA framework providing clear
                regulatory guidelines and Abu Dhabi's ADGM offering an
                innovation-friendly sandbox, the UAE attracts crypto investors,
                traders, and businesses from across the globe.
              </p>
              <p className="text-[15px] text-black/50 dark:text-white/40 leading-relaxed">
                For UAE residents, tracking the Bitcoin price in AED is
                essential. The Dirham's peg to the US Dollar at 3.6725 means
                the BTC/AED rate is a straightforward multiple of the BTC/USD
                rate, but seeing your portfolio value in the local currency
                simplifies financial planning, accounting, and off-ramp
                decisions. Whether you are a long-term holder evaluating gains
                or a trader timing an exit, real-time AED pricing eliminates
                the need for mental currency arithmetic.
              </p>
              <p className="text-[15px] text-black/50 dark:text-white/40 leading-relaxed">
                Bitcoin adoption in the UAE extends beyond individual investors.
                Major real estate developers accept BTC for property purchases,
                luxury retailers integrate crypto payments, and free zone
                companies increasingly hold Bitcoin on their balance sheets. The
                UAE's zero personal income tax policy on capital gains further
                incentivizes holding and trading Bitcoin, though businesses
                should consult tax advisors regarding VAT and corporate tax
                implications under the new federal framework.
              </p>
              <p className="text-[15px] text-black/50 dark:text-white/40 leading-relaxed">
                When it comes to converting Bitcoin to AED, UAE residents have
                multiple options: centralized exchanges like Binance and
                Bybit, local OTC desks, and decentralized protocols. Blip
                Money offers a non-custodial alternative where your BTC value
                is protected by on-chain smart contract escrow throughout the
                settlement process, with typical completion times under 15
                minutes and transparent fees starting at 0.5%.
              </p>
            </div>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════════
            CTA BOTTOM
            ═══════════════════════════════════════════════ */}
        <Section className="py-16 sm:py-20 border-t border-black/[0.04] dark:border-white/[0.04]">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6 text-center">
            {/* <div className="w-3 h-3 rounded-full bg-[#ff6b35] mx-auto mb-6" /> */}
            <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white mb-4">
              Ready to Convert Bitcoin?
            </h2>
            <p className="text-lg text-black/40 dark:text-white/40 max-w-lg mx-auto mb-8">
              Use our BTC to AED converter to check exact amounts and convert
              Bitcoin to UAE Dirhams with escrow protection.
            </p>
            {/* <Link
              to="/btc-to-aed"
              onClick={() => sounds.click()}
              onMouseEnter={() => sounds.hover()}
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold text-[15px] hover:opacity-90 transition-opacity"
            >
              Convert BTC to AED
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link> */}
            <CTAButton to="/btc-to-aed" className="w-[220px] h-[48px]">Convert BTC to AED</CTAButton>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════════
            CROSS-LINKS
            ═══════════════════════════════════════════════ */}
        <section className="border-t border-black/[0.06] dark:border-white/[0.06] bg-[#FAF8F5]/50 dark:bg-white/[0.01]">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-12">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/80 dark:text-white/30 mb-6">
              Related Pages
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "BTC to AED", href: "/btc-to-aed", desc: "Live converter" },
                { label: "ETH to AED", href: "/eth-to-aed", desc: "Ethereum converter" },
                { label: "Crypto to AED", href: "/crypto-to-aed", desc: "All crypto rates" },
                { label: "Crypto Payments UAE", href: "/crypto-payments-uae", desc: "UAE payments" },
              ].map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="group p-4 rounded-xl bg-white/60 dark:bg-white/[0.03] border border-black/40 dark:border-white/[0.06] hover:border-black/[0.12] dark:hover:border-white/[0.12] transition-colors"
                >
                  <span className="block text-sm font-semibold text-black dark:text-white group-hover:text-gray-600 dark:group-hover:text-white/80 transition-colors">
                    {link.label}
                  </span>
                  <span className="block text-xs text-black/30 dark:text-white/25 mt-1">
                    {link.desc}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BitcoinPriceUae;
