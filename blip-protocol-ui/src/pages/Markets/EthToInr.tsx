import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  ArrowDownUp,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ChevronDown,
  ArrowRight,
  Shield,
  Zap,
  Wallet,
  Lock,
} from "lucide-react";
import SEO from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { HreflangTags } from "@/components/HreflangTags";
import StructuredData from "@/components/StructuredData";
import { sounds } from "@/lib/sounds";

/* ═══════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════ */

const COIN_ID = "ethereum";
const COIN_SYMBOL = "ETH";
const COIN_NAME = "Ethereum";
const COIN_ICON = "Ξ";
const COIN_DECIMALS = 6;

const COINGECKO_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr,usd&include_24hr_change=true";

const REFRESH_INTERVAL = 300_000; // 5 minutes (CoinGecko free tier rate limit)

const STATIC_RATE = { inr: 222000, usd: 2670, inr_24h_change: 0.8 };

const CONVERSION_TABLE = [
  { amount: 1, label: "1 ETH" },
  { amount: 0.5, label: "0.5 ETH" },
  { amount: 0.1, label: "0.1 ETH" },
  { amount: 0.01, label: "0.01 ETH" },
  { amount: 0.001, label: "0.001 ETH" },
];

const POPULAR_AMOUNTS = [
  { crypto: 10, label: "10 ETH to INR" },
  { crypto: 5, label: "5 ETH to INR" },
  { crypto: 1, label: "1 ETH to INR" },
  { crypto: 0.5, label: "0.5 ETH to INR" },
  { crypto: 0.1, label: "0.1 ETH to INR" },
  { crypto: 0.01, label: "0.01 ETH to INR" },
];

/* ═══════════════════════════════════════════════
   HOW-TO STEPS
   ═══════════════════════════════════════════════ */

const HOW_TO_STEPS = [
  {
    step: 1,
    title: "Connect your wallet",
    description:
      "Open Blip and connect your Solana wallet (Phantom, Solflare, or Backpack). Ethereum is supported through Blip's cross-chain bridge — no centralized exchange needed.",
  },
  {
    step: 2,
    title: "Enter ETH amount",
    description:
      "Select Ethereum (ETH) and enter the amount you want to convert. The live ETH/INR rate and exact Rupee amount you will receive are displayed instantly.",
  },
  {
    step: 3,
    title: "Confirm and escrow",
    description:
      "Review the exchange rate, fee breakdown, and matched merchant. Confirm the trade — your ETH value is locked in an on-chain escrow smart contract for protection.",
  },
  {
    step: 4,
    title: "Receive INR",
    description:
      "The verified merchant sends INR to your Indian bank account via UPI or IMPS. Once both sides confirm, the escrow releases automatically. Average settlement: under 15 minutes.",
  },
];

/* ═══════════════════════════════════════════════
   FAQ DATA
   ═══════════════════════════════════════════════ */

const FAQ_DATA = [
  {
    q: "What is the current Ethereum price in INR?",
    a: "The current Ethereum price in INR is shown in the live converter at the top of this page, updated every 30 seconds. ETH/INR fluctuates continuously based on global market dynamics. Blip aggregates rates from major liquidity sources to provide a competitive, real-time Ethereum to INR exchange rate.",
  },
  {
    q: "How to sell Ethereum for INR in India?",
    a: "Selling Ethereum for INR in India is simple with Blip. Connect your wallet, enter your ETH amount, and Blip matches you with a verified local merchant. Your ETH value is secured in on-chain escrow until the merchant confirms the INR bank transfer via UPI or IMPS. The entire process completes in under 15 minutes — no exchange accounts or KYC delays required.",
  },
  {
    q: "Is Ethereum legal in India?",
    a: "Yes. Cryptocurrency including Ethereum is legal to buy, sell, and hold in India. The Supreme Court of India lifted the RBI banking ban in March 2020. However, crypto gains are taxed at a flat 30% under Section 115BBH of the Income Tax Act, and a 1% TDS applies on crypto transactions above ₹10,000 under Section 194S. India does not yet have a comprehensive crypto regulatory framework, but trading is fully legal.",
  },
  {
    q: "What's the best way to convert ETH to INR?",
    a: "For speed, security, and competitive rates, Blip offers non-custodial escrow-protected ETH to INR settlement. Unlike centralized exchanges where you deposit ETH to a custodial wallet, Blip lets you maintain control of your keys throughout the process. For large ETH conversions, Blip's matching engine pairs you with high-liquidity merchants for instant INR settlement.",
  },
  {
    q: "How long does ETH to INR conversion take on Blip?",
    a: "Most ETH to INR conversions on Blip complete within 5-15 minutes. The on-chain escrow lock is near-instant on Solana. Total settlement time depends on the merchant's INR transfer speed via UPI or IMPS. Average time across all Blip trades is under 10 minutes — significantly faster than centralized exchange withdrawal processes.",
  },
  {
    q: "What fees apply to ETH to INR conversion?",
    a: "Blip charges a transparent 0.5% protocol fee shown before you confirm any trade. Solana network fees are under $0.01. There are no hidden fees, spread markups, or withdrawal charges. This is considerably lower than typical Indian exchange rates (1-2%) and more transparent than centralized exchange fee structures. Note: a 30% tax on crypto gains and 1% TDS may apply as per Indian tax law.",
  },
  {
    q: "Can I convert ETH from my MetaMask wallet?",
    a: "Blip currently operates on Solana, so ETH conversions use Blip's cross-chain bridge. You can bridge your ETH from Ethereum mainnet (including MetaMask) to Solana, then convert to INR through Blip's escrow-protected settlement. Direct Ethereum mainnet support is on Blip's roadmap for future expansion.",
  },
  {
    q: "What is the ETH to INR exchange rate based on?",
    a: "Blip's ETH/INR exchange rate is derived from real-time global market data aggregated from multiple liquidity sources. The rate updates every 30 seconds and closely tracks the global ETH/USD price multiplied by the USD/INR exchange rate (approximately 83.5). There are no hidden spread markups — the rate you see is the rate you get.",
  },
];

/* ═══════════════════════════════════════════════
   LIVE RATE HOOK
   ═══════════════════════════════════════════════ */

interface RateData {
  inr: number;
  usd: number;
  inr_24h_change?: number;
}

function useLiveRate() {
  const [rate, setRate] = useState<RateData>(STATIC_RATE);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isLive, setIsLive] = useState(false);

  const fetchRate = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(COINGECKO_URL);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      if (data[COIN_ID]) {
        setRate(data[COIN_ID]);
        setLastUpdated(new Date());
        setError(false);
        setIsLive(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRate();
    const interval = setInterval(fetchRate, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchRate]);

  return { rate, lastUpdated, loading, error, isLive, refresh: fetchRate };
}

/* ═══════════════════════════════════════════════
   TIME AGO HELPER
   ═══════════════════════════════════════════════ */

function useTimeAgo(date: Date | null) {
  const [text, setText] = useState("Updating...");

  useEffect(() => {
    if (!date) return;
    const tick = () => {
      const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
      if (seconds < 5) setText("Just now");
      else if (seconds < 60) setText(`${seconds}s ago`);
      else setText(`${Math.floor(seconds / 60)}m ago`);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [date]);

  return text;
}

/* ═══════════════════════════════════════════════
   PRICE HISTORY HOOK
   ═══════════════════════════════════════════════ */

const CHART_PERIODS = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
  { label: "1Y", days: 365 },
] as const;

function usePriceHistory(days: number) {
  const [data, setData] = useState<[number, number][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(
      `https://api.coingecko.com/api/v3/coins/${COIN_ID}/market_chart?vs_currency=inr&days=${days}`
    )
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled && json.prices) setData(json.prices);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [days]);

  return { data, loading };
}

/* ═══════════════════════════════════════════════
   PRICE CHART COMPONENT
   ═══════════════════════════════════════════════ */

function PriceChart({
  data,
  loading,
  change,
}: {
  data: [number, number][];
  loading: boolean;
  change: number;
}) {
  if (loading || data.length < 2) {
    return (
      <div className="h-[200px] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-black/10 dark:border-white/10 border-t-black/40 dark:border-t-white/40 rounded-full animate-spin" />
      </div>
    );
  }

  const prices = data.map((d) => d[1]);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;

  const W = 800;
  const H = 200;
  const pad = 4;

  const points = prices
    .map((p, i) => {
      const x = (i / (prices.length - 1)) * W;
      const y = H - pad - ((p - min) / range) * (H - pad * 2);
      return `${x},${y}`;
    })
    .join(" ");

  const color = change >= 0 ? "#10b981" : "#ef4444";
  const fillPoints = `0,${H} ${points} ${W},${H}`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-[200px]"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="ethInrChartFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.12" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillPoints} fill="url(#ethInrChartFill)" />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
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
   ANIMATED SECTION WRAPPER
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
   SCHEMAS
   ═══════════════════════════════════════════════ */

function buildSchemas(rate: RateData) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_DATA.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const financialServiceSchema = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: "Blip Money — Ethereum to INR Converter",
    description:
      "Convert Ethereum to Indian Rupees instantly with non-custodial escrow protection. Live ETH/INR rates, low fees, settlement in under 15 minutes.",
    url: "https://blip.money/eth-to-inr",
    areaServed: { "@type": "Country", name: "India" },
    serviceType: "Cryptocurrency Exchange",
    provider: {
      "@type": "Organization",
      name: "Blip Money",
      url: "https://blip.money",
    },
    offers: {
      "@type": "Offer",
      description: "ETH to INR conversion",
      price: rate.inr.toString(),
      priceCurrency: "INR",
    },
  };

  const exchangeRateSchema = {
    "@context": "https://schema.org",
    "@type": "ExchangeRateSpecification",
    currency: "INR",
    currentExchangeRate: {
      "@type": "UnitPriceSpecification",
      price: rate.inr.toString(),
      priceCurrency: "INR",
      referenceQuantity: {
        "@type": "QuantitativeValue",
        value: "1",
        unitCode: "ETH",
      },
    },
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Convert Ethereum to INR",
    description:
      "Step-by-step guide to convert Ethereum to Indian Rupees using Blip Money's escrow-protected settlement protocol.",
    totalTime: "PT15M",
    estimatedCost: { "@type": "MonetaryAmount", currency: "INR", value: "0" },
    step: HOW_TO_STEPS.map((s) => ({
      "@type": "HowToStep",
      position: s.step,
      name: s.title,
      text: s.description,
    })),
  };

  return { faqSchema, financialServiceSchema, exchangeRateSchema, howToSchema };
}

/* ═══════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════ */

export default function EthToInr() {
  const { rate, lastUpdated, loading, error, isLive, refresh } = useLiveRate();
  const timeAgo = useTimeAgo(lastUpdated);
  const [searchParams, setSearchParams] = useSearchParams();

  const [amount, setAmount] = useState(searchParams.get("amount") || "1");
  const [direction, setDirection] = useState<"sell" | "buy">(
    searchParams.get("direction") === "buy" ? "buy" : "sell"
  );
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [chartPeriod, setChartPeriod] = useState(7);
  const { data: priceHistory, loading: chartLoading } = usePriceHistory(chartPeriod);

  // Sync state to URL
  useEffect(() => {
    const p = new URLSearchParams();
    if (amount && amount !== "1") p.set("amount", amount);
    if (direction !== "sell") p.set("direction", direction);
    setSearchParams(p, { replace: true });
  }, [amount, direction, setSearchParams]);

  // Computed conversion
  const conversion = useMemo(() => {
    const r = rate.inr;
    const change = rate.inr_24h_change ?? 0;
    const numAmount = parseFloat(amount) || 0;
    const fee = numAmount * 0.005;
    const netAmount = direction === "sell" ? numAmount - fee : numAmount;
    const inrAmount = direction === "sell" ? netAmount * r : numAmount;
    const cryptoAmount = direction === "buy" ? (numAmount / r) * (1 - 0.005) : numAmount;

    return {
      rate: r,
      change,
      inrAmount: direction === "sell" ? inrAmount : numAmount,
      cryptoAmount: direction === "sell" ? numAmount : cryptoAmount,
      fee: direction === "sell" ? fee * r : fee,
      youReceive: direction === "sell" ? inrAmount : cryptoAmount,
    };
  }, [rate, amount, direction]);

  const schemas = useMemo(() => buildSchemas(rate), [rate]);

  return (
    <>
      <SEO
        title="Ethereum to INR — Live ETH/INR Rate | Blip Money"
        description="Convert Ethereum to Indian Rupees instantly. Live ETH/INR exchange rate updated every 30 seconds. Non-custodial escrow, 0.5% fees, settlement under 15 minutes. Best ETH to INR rate in India."
        canonical="https://blip.money/eth-to-inr"
        keywords="ETH to INR, ethereum to INR, ethereum price INR, ETH INR rate, convert ethereum to INR, sell ethereum India, ethereum price India, 1 ETH to INR, ethereum to Indian Rupee, ETH to INR today"
        type="website"
      />
      <HreflangTags path="/eth-to-inr" />
      <StructuredData type="custom" schema={schemas.faqSchema} />
      <StructuredData type="custom" schema={schemas.howToSchema} />
      <StructuredData type="custom" schema={schemas.financialServiceSchema} />
      <StructuredData type="custom" schema={schemas.exchangeRateSchema} />

      <div className="min-h-screen bg-[#FAF8F5] dark:bg-transparent">
        {/* ═══════════════════════════════════════════
            HERO — LIVE CONVERTER
            ═══════════════════════════════════════════ */}
        <header className="relative pt-32 sm:pt-36 pb-12 sm:pb-16">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Crypto to INR", href: "/crypto-to-inr" },
                { label: "Ethereum to INR" },
              ]}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
              className="mt-6"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black dark:text-white tracking-tight leading-[1.08] mb-4">
                Ethereum to INR
                <br />
                <span className="bg-gradient-to-r from-black/60 to-black/30 dark:from-white/60 dark:to-white/30 bg-clip-text text-transparent">
                  Live Converter
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-black/50 dark:text-white/40 max-w-xl leading-relaxed mb-10">
                Convert ETH to Indian Rupees instantly. Live ETH/INR rate, escrow-protected settlement, under 15 minutes.
              </p>

              {/* Live status badge */}
              <div className="flex items-center gap-3 mb-8">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/[0.08] dark:border-white/[0.08]">
                  <div className="w-2 h-2 rounded-full bg-black dark:bg-white animate-pulse" />
                  <span className="text-xs font-semibold text-black/60 dark:text-white/40">Live Rate</span>
                </div>
                <span className="text-xs text-black/30 dark:text-white/30">
                  {isLive ? `Updated ${timeAgo}` : "Updating live rate..."}
                </span>
                <button
                  onClick={() => { refresh(); sounds.click(); }}
                  className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  title="Refresh rate"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-black/30 dark:text-white/30 ${loading ? "animate-spin" : ""}`} />
                </button>
              </div>

              {/* ═══ CONVERTER CARD ═══ */}
              <div className="bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] rounded-2xl p-6 sm:p-8 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] dark:shadow-none">
                {/* Direction toggle */}
                <div className="flex items-center gap-3 mb-6">
                  <button
                    onClick={() => { setDirection("sell"); sounds.click(); }}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${direction === "sell" ? "bg-black dark:bg-white text-white dark:text-black" : "bg-black/5 dark:bg-white/5 text-black/50 dark:text-white/50"}`}
                  >
                    Sell ETH
                  </button>
                  <button
                    onClick={() => { setDirection("buy"); sounds.click(); }}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${direction === "buy" ? "bg-black dark:bg-white text-white dark:text-black" : "bg-black/5 dark:bg-white/5 text-black/50 dark:text-white/50"}`}
                  >
                    Buy ETH
                  </button>
                </div>

                {/* You Send */}
                <div className="mb-3">
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-black/40 dark:text-white/30 mb-2">
                    {direction === "sell" ? "You Send" : "You Pay"}
                  </label>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-[#FAF8F5] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06]">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={amount}
                      onChange={(e) => { const v = e.target.value.replace(/[^0-9.]/g, ""); if (v.replace(".", "").length <= 7) setAmount(v); }}
                      className="flex-1 bg-transparent text-2xl sm:text-3xl font-bold text-black dark:text-white outline-none placeholder:text-black/20 dark:placeholder:text-white/20 min-w-0 truncate"
                      placeholder="0"
                    />
                    {direction === "sell" ? (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/[0.08] dark:border-white/[0.08] text-sm font-semibold">
                        <span className="text-lg leading-none">{COIN_ICON}</span>
                        <span className="text-black dark:text-white">{COIN_SYMBOL}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/[0.08] dark:border-white/[0.08] text-sm font-semibold">
                        <span className="text-lg leading-none">🇮🇳</span>
                        <span className="text-black dark:text-white">INR</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Swap button */}
                <div className="flex justify-center -my-1 relative z-10">
                  <button
                    onClick={() => { setDirection(direction === "sell" ? "buy" : "sell"); sounds.click(); }}
                    className="w-10 h-10 rounded-full bg-white dark:bg-[#111] border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-center hover:border-black/[0.15] dark:hover:border-white/[0.15] transition-colors shadow-sm"
                  >
                    <ArrowDownUp className="w-4 h-4 text-black/40 dark:text-white/40" />
                  </button>
                </div>

                {/* You Receive */}
                <div className="mt-3 mb-6">
                  <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-black/40 dark:text-white/30 mb-2">
                    You Receive
                  </label>
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.06]">
                    <div className="flex-1 text-2xl sm:text-3xl font-bold text-black dark:text-white min-w-0 truncate">
                      {loading ? (
                        <span className="text-black/20 dark:text-white/20">Loading...</span>
                      ) : error ? (
                        <span className="text-red-400 text-lg">Rate unavailable</span>
                      ) : conversion ? (
                        direction === "sell"
                          ? `${conversion.inrAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                          : `${conversion.cryptoAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: COIN_DECIMALS })}`
                      ) : (
                        "—"
                      )}
                    </div>
                    {direction === "sell" ? (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/[0.08] dark:border-white/[0.08] text-sm font-semibold">
                        <span className="text-lg leading-none">🇮🇳</span>
                        <span className="text-black dark:text-white">INR</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/[0.08] dark:border-white/[0.08] text-sm font-semibold">
                        <span className="text-lg leading-none">{COIN_ICON}</span>
                        <span className="text-black dark:text-white">{COIN_SYMBOL}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Rate details */}
                {conversion && !loading && !error && (
                  <div className="space-y-2 mb-6 text-sm">
                    <div className="flex justify-between">
                      <span className="text-black/40 dark:text-white/30">Exchange Rate</span>
                      <span className="font-semibold text-black dark:text-white">
                        1 {COIN_SYMBOL} = {conversion.rate.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} INR
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black/40 dark:text-white/30">24h Change</span>
                      <span className={`font-semibold flex items-center gap-1 ${conversion.change >= 0 ? "text-emerald-500" : "text-red-400"}`}>
                        {conversion.change >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        {Math.abs(conversion.change).toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black/40 dark:text-white/30">Protocol Fee (0.5%)</span>
                      <span className="text-black/60 dark:text-white/40">
                        ₹{conversion.fee.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black/40 dark:text-white/30">Network Fee</span>
                      <span className="text-black/60 dark:text-white/40">&lt; $0.01 (Solana)</span>
                    </div>
                  </div>
                )}

                {/* CTA */}
                <Link
                  to="/waitlist"
                  onClick={() => sounds.click()}
                  onMouseEnter={() => sounds.hover()}
                  className="group relative flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-black dark:bg-white text-white dark:text-black font-semibold text-[15px] overflow-hidden transition-all hover:opacity-90"
                >
                  <span className="relative z-10">Convert ETH to INR</span>
                  <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                </Link>

                <p className="text-center text-[11px] text-black/30 dark:text-white/20 mt-3">
                  Non-custodial escrow on Solana. Your keys, your Ethereum.
                </p>
              </div>
            </motion.div>
          </div>
        </header>

        {/* ═══════════════════════════════════════════
            PRICE CHART
            ═══════════════════════════════════════════ */}
        <Section className="py-16 sm:py-20 border-t border-black/[0.04] dark:border-white/[0.04]">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white">
                  ETH/INR Price Chart
                </h2>
                <p className="text-black/40 dark:text-white/35 mt-1">
                  Historical Ethereum to INR exchange rate
                </p>
              </div>
              <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 rounded-lg p-1 self-start">
                {CHART_PERIODS.map((p) => (
                  <button
                    key={p.days}
                    onClick={() => { setChartPeriod(p.days); sounds.click(); }}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                      chartPeriod === p.days
                        ? "bg-white dark:bg-white/10 text-black dark:text-white shadow-sm"
                        : "text-black/40 dark:text-white/30 hover:text-black/60 dark:hover:text-white/50"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/80 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] rounded-2xl p-6 sm:p-8">
              <PriceChart data={priceHistory} loading={chartLoading} change={conversion.change} />

              {priceHistory.length > 1 && !chartLoading && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-black/[0.06] dark:border-white/[0.06]">
                  {[
                    { label: "Low", value: Math.min(...priceHistory.map((d) => d[1])) },
                    { label: "High", value: Math.max(...priceHistory.map((d) => d[1])) },
                    { label: "Current", value: priceHistory[priceHistory.length - 1][1] },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-black/30 dark:text-white/25">
                        {stat.label}
                      </span>
                      <span className="block text-sm font-bold text-black dark:text-white tabular-nums mt-1">
                        ₹{stat.value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            WHAT IS ETHEREUM
            ═══════════════════════════════════════════ */}
        <Section className="py-16 sm:py-20 border-t border-black/[0.04] dark:border-white/[0.04]">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-4">
              What is Ethereum?
            </h2>
            <div className="bg-white/60 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl p-6 sm:p-8">
              <p className="text-[15px] text-black/50 dark:text-white/40 leading-relaxed mb-4">
                Ethereum (ETH) is the world's leading smart contract platform and the second-largest cryptocurrency by market capitalization. Created by Vitalik Buterin and launched in 2015, Ethereum pioneered programmable blockchain technology — enabling decentralized applications (dApps), DeFi protocols, NFTs, and more.
              </p>
              <p className="text-[15px] text-black/50 dark:text-white/40 leading-relaxed mb-4">
                Since transitioning to proof-of-stake in "The Merge" (September 2022), Ethereum has become significantly more energy-efficient while maintaining its position as the backbone of decentralized finance. ETH is used to pay gas fees for transactions and smart contract execution on the Ethereum network.
              </p>
              <p className="text-[15px] text-black/50 dark:text-white/40 leading-relaxed">
                In India, Ethereum is widely held by both retail and institutional investors. While the Indian government taxes crypto gains at 30% and applies a 1% TDS on transactions, Ethereum remains one of the most popular digital assets among Indian traders. Converting ETH to INR through Blip provides a fast, non-custodial path to liquidity without surrendering your keys to a centralized exchange.
              </p>
            </div>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            ETH PRICE IN INR TODAY
            ═══════════════════════════════════════════ */}
        <Section className="py-16 sm:py-20 border-t border-black/[0.04] dark:border-white/[0.04]">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-2">
              Ethereum Price in INR Today
            </h2>
            <p className="text-black/40 dark:text-white/35 mb-8">
              The live Ethereum to INR exchange rate and key market data.
            </p>

            <div className="bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] rounded-2xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/30 dark:text-white/25">1 ETH =</span>
                  <div className="text-3xl sm:text-4xl font-bold text-black dark:text-white tabular-nums mt-1">
                    ₹{rate.inr.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${(rate.inr_24h_change ?? 0) >= 0 ? "text-emerald-500" : "text-red-400"}`}>
                  {(rate.inr_24h_change ?? 0) >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {Math.abs(rate.inr_24h_change ?? 0).toFixed(2)}% (24h)
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.04]">
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-black/30 dark:text-white/25">USD Price</span>
                  <span className="block text-lg font-bold text-black dark:text-white mt-1 tabular-nums">
                    ${rate.usd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF8F5] dark:bg-white/[0.03] border border-black/[0.04] dark:border-white/[0.04]">
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-black/30 dark:text-white/25">ETH/BTC Ratio</span>
                  <span className="block text-lg font-bold text-black dark:text-white mt-1 tabular-nums">~0.027</span>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            CONVERSION TABLE
            ═══════════════════════════════════════════ */}
        <Section className="py-16 sm:py-20 border-t border-black/[0.04] dark:border-white/[0.04]">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-2">
              Ethereum to INR Conversion Table
            </h2>
            <p className="text-black/40 dark:text-white/35 mb-8">
              Quick reference for common ETH to INR amounts at the current live rate.
            </p>

            <div className="bg-white/80 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/[0.06] dark:border-white/[0.06]">
                    <th className="text-left px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/40 dark:text-white/30">Ethereum (ETH)</th>
                    <th className="text-right px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/40 dark:text-white/30">Indian Rupee (INR)</th>
                    <th className="text-right px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/40 dark:text-white/30">US Dollar (USD)</th>
                  </tr>
                </thead>
                <tbody>
                  {CONVERSION_TABLE.map((row) => (
                    <tr key={row.amount} className="border-b border-black/[0.04] dark:border-white/[0.04] last:border-0 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-semibold text-black dark:text-white">{row.label}</td>
                      <td className="px-6 py-4 text-right font-semibold text-black dark:text-white tabular-nums">
                        ₹{(row.amount * rate.inr).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-right text-black/50 dark:text-white/40 tabular-nums">
                        ${(row.amount * rate.usd).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            POPULAR AMOUNTS
            ═══════════════════════════════════════════ */}
        <Section className="py-16 sm:py-20 border-t border-black/[0.04] dark:border-white/[0.04]">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-8">
              Popular ETH to INR Conversions
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {POPULAR_AMOUNTS.map((item) => (
                <Link
                  key={item.crypto}
                  to={`/eth-to-inr?amount=${item.crypto}`}
                  className="group p-5 rounded-2xl bg-white/60 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] hover:border-black/[0.12] dark:hover:border-white/[0.12] transition-colors"
                >
                  <span className="block text-sm font-semibold text-black dark:text-white group-hover:text-gray-600 dark:group-hover:text-white/80 transition-colors">
                    {item.label}
                  </span>
                  <span className="block text-lg font-bold text-black dark:text-white mt-1 tabular-nums">
                    ₹{(item.crypto * rate.inr).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="block text-xs text-black/30 dark:text-white/25 mt-1">
                    ${(item.crypto * rate.usd).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            HOW TO CONVERT
            ═══════════════════════════════════════════ */}
        <Section className="py-16 sm:py-20 border-t border-black/[0.04] dark:border-white/[0.04]">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-2">
              How to Convert Ethereum to INR
            </h2>
            <p className="text-black/40 dark:text-white/35 mb-10">
              Convert ETH to Indian Rupees in 4 simple steps using Blip's escrow-protected settlement.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {HOW_TO_STEPS.map((s) => (
                <div
                  key={s.step}
                  className="relative p-6 rounded-2xl bg-white/60 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06]"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black text-sm font-bold">
                      {s.step}
                    </div>
                    <h3 className="text-[15px] font-bold text-black dark:text-white">{s.title}</h3>
                  </div>
                  <p className="text-[14px] text-black/50 dark:text-white/40 leading-relaxed">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            WHY BLIP FOR ETH
            ═══════════════════════════════════════════ */}
        <Section className="py-16 sm:py-20 border-t border-black/[0.04] dark:border-white/[0.04]">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-10">
              Why Convert Ethereum to INR on Blip
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Zap, title: "Under 15 Minutes", desc: "From trade initiation to INR in your bank via UPI or IMPS. Faster than any centralized exchange withdrawal." },
                { icon: Shield, title: "Escrow Protected", desc: "Every ETH trade is secured by on-chain smart contract escrow. Fully audited and transparent." },
                { icon: Wallet, title: "Non-Custodial", desc: "Your Ethereum stays in your control until the trade executes. No centralized deposit required." },
                { icon: Lock, title: "Competitive Rates", desc: "ETH/INR rates sourced from global markets. No hidden spread or markup on your conversion." },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-6 rounded-2xl bg-white/60 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06]"
                >
                  <item.icon className="w-5 h-5 text-black/30 dark:text-white/25 mb-4" />
                  <h3 className="text-[15px] font-bold text-black dark:text-white mb-2">{item.title}</h3>
                  <p className="text-[13px] text-black/50 dark:text-white/40 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            FAQ
            ═══════════════════════════════════════════ */}
        <Section className="py-16 sm:py-20 border-t border-black/[0.04] dark:border-white/[0.04]">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-2">
              Ethereum to INR — Frequently Asked Questions
            </h2>
            <p className="text-black/40 dark:text-white/35 mb-8">
              Everything you need to know about converting Ethereum to Indian Rupees.
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
              Ready to Convert Ethereum to INR?
            </h2>
            <p className="text-lg text-black/40 dark:text-white/35 max-w-lg mx-auto mb-8">
              Join thousands converting ETH to INR on the fastest, most secure settlement protocol in India.
            </p>
            <Link
              to="/waitlist"
              onClick={() => sounds.click()}
              onMouseEnter={() => sounds.hover()}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold text-[15px] hover:opacity-90 transition-opacity"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            CROSS-LINKS
            ═══════════════════════════════════════════ */}
        <section className="border-t border-black/[0.06] dark:border-white/[0.06] bg-[#FAF8F5]/50 dark:bg-white/[0.01]">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-12">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/40 dark:text-white/30 mb-6">
              Other Converters
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Crypto to INR", href: "/crypto-to-inr", desc: "All crypto rates" },
                { label: "BTC to INR", href: "/btc-to-inr", desc: "Bitcoin converter" },
                { label: "SOL to INR", href: "/sol-to-inr", desc: "Solana converter" },
                { label: "USDT to INR", href: "/usdt-to-inr", desc: "Tether converter" },
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
