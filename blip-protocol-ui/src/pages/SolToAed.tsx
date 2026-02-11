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

const COIN_ID = "solana";
const COIN_SYMBOL = "SOL";
const COIN_NAME = "Solana";
const COIN_ICON = "◎";
const COIN_DECIMALS = 4;

const COINGECKO_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=aed,usd&include_24hr_change=true";

const REFRESH_INTERVAL = 30_000;

const STATIC_RATE = { aed: 700, usd: 190, aed_24h_change: 1.5 };

const CONVERSION_TABLE = [
  { amount: 100, label: "100 SOL" },
  { amount: 50, label: "50 SOL" },
  { amount: 10, label: "10 SOL" },
  { amount: 1, label: "1 SOL" },
  { amount: 0.1, label: "0.1 SOL" },
];

const POPULAR_AMOUNTS = [
  { crypto: 100, label: "100 SOL to AED" },
  { crypto: 50, label: "50 SOL to AED" },
  { crypto: 10, label: "10 SOL to AED" },
  { crypto: 5, label: "5 SOL to AED" },
  { crypto: 1, label: "1 SOL to AED" },
  { crypto: 0.5, label: "0.5 SOL to AED" },
];

/* ═══════════════════════════════════════════════
   HOW-TO STEPS
   ═══════════════════════════════════════════════ */

const HOW_TO_STEPS = [
  {
    step: 1,
    title: "Connect your Solana wallet",
    description:
      "Open Blip and connect your Solana wallet (Phantom, Solflare, or Backpack). Since Blip is built natively on Solana, SOL conversions are the fastest and cheapest available.",
  },
  {
    step: 2,
    title: "Enter SOL amount",
    description:
      "Select Solana (SOL) and enter the amount you want to convert. The live SOL/AED rate and exact Dirham amount you will receive are displayed instantly — no bridging required.",
  },
  {
    step: 3,
    title: "Confirm and escrow",
    description:
      "Review the exchange rate, fee breakdown, and matched merchant. Confirm the trade — your SOL is locked in Blip's on-chain escrow smart contract in under one second.",
  },
  {
    step: 4,
    title: "Receive AED",
    description:
      "The verified merchant sends AED to your UAE bank account. Once confirmed, the escrow releases your SOL to the merchant automatically. Typical settlement: 5-10 minutes.",
  },
];

/* ═══════════════════════════════════════════════
   FAQ DATA
   ═══════════════════════════════════════════════ */

const FAQ_DATA = [
  {
    q: "What is the current Solana price in AED?",
    a: "The current Solana price in AED is displayed in our live converter at the top of this page, updated every 30 seconds from global market data. SOL/AED fluctuates continuously based on market dynamics. Because Blip is built natively on Solana, you get the most direct and competitive SOL/AED rate available.",
  },
  {
    q: "How to sell Solana for AED in Dubai?",
    a: "Blip is the fastest way to sell SOL for AED in Dubai. Connect your Solana wallet, enter the amount, and Blip matches you with a verified local merchant. Your SOL is locked in on-chain escrow (sub-second on Solana) until the merchant confirms the AED transfer. Since Blip runs natively on Solana, there is no bridging delay — the entire process typically completes in 5-10 minutes.",
  },
  {
    q: "Is Solana legal in the UAE?",
    a: "Yes. Solana and other cryptocurrencies are legal in the UAE under the regulatory frameworks provided by VARA (Dubai) and ADGM FSRA (Abu Dhabi). The UAE is one of the most crypto-forward jurisdictions globally, with Solana-based projects and validators operating actively in Dubai's free zones. Blip operates within these regulatory guidelines.",
  },
  {
    q: "Why is SOL to AED faster on Blip than other platforms?",
    a: "Blip is built natively on the Solana blockchain, which means SOL transactions do not require any cross-chain bridging. Solana's 400ms block time and sub-second finality make escrow locking near-instant. Combined with Blip's merchant matching engine, most SOL to AED settlements complete in 5-10 minutes — faster than any centralized exchange withdrawal process.",
  },
  {
    q: "What fees apply to SOL to AED conversion?",
    a: "Blip charges a transparent 0.5% protocol fee displayed before you confirm any trade. Solana network fees are under $0.01 per transaction — the lowest of any major blockchain. There are no hidden fees, exchange rate markups, or withdrawal charges. SOL conversions are the most cost-effective on Blip due to Solana's native integration.",
  },
  {
    q: "Can I convert SOL directly from Phantom wallet?",
    a: "Yes. Blip supports direct connection from Phantom, Solflare, Backpack, and other Solana wallets. Simply connect your Phantom wallet to Blip, enter the SOL amount, and initiate the trade. Your SOL never leaves your wallet until you confirm the escrow — maintaining full self-custody throughout the process.",
  },
  {
    q: "What is the minimum SOL to AED conversion amount?",
    a: "The minimum SOL to AED conversion on Blip is approximately 100 AED equivalent. At current rates, this is typically less than 1 SOL. There is no maximum limit — Blip's merchant matching engine can connect you with high-liquidity merchants for large SOL to AED conversions. The live converter above lets you check exact amounts before initiating a trade.",
  },
  {
    q: "How does Blip's native Solana integration benefit SOL holders?",
    a: "Because Blip's escrow smart contracts are deployed directly on Solana, SOL holders benefit from the fastest possible settlement, the lowest network fees (under $0.01), and no bridging risk. Your SOL stays native throughout the entire process — from your wallet to escrow to merchant release. This is a significant advantage over platforms that require bridging SOL to other chains for conversion.",
  },
];

/* ═══════════════════════════════════════════════
   LIVE RATE HOOK
   ═══════════════════════════════════════════════ */

interface RateData {
  aed: number;
  usd: number;
  aed_24h_change?: number;
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
      `https://api.coingecko.com/api/v3/coins/${COIN_ID}/market_chart?vs_currency=aed&days=${days}`
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
        <linearGradient id="solChartFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.12" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillPoints} fill="url(#solChartFill)" />
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
    name: "Blip Money — Solana to AED Converter",
    description:
      "Convert Solana to UAE Dirhams instantly with native on-chain escrow. Live SOL/AED rates, sub-$0.01 fees, fastest settlement available. Built natively on Solana.",
    url: "https://blip.money/sol-to-aed",
    areaServed: { "@type": "Country", name: "United Arab Emirates" },
    serviceType: "Cryptocurrency Exchange",
    provider: {
      "@type": "Organization",
      name: "Blip Money",
      url: "https://blip.money",
    },
    offers: {
      "@type": "Offer",
      description: "SOL to AED conversion",
      price: rate.aed.toString(),
      priceCurrency: "AED",
    },
  };

  const exchangeRateSchema = {
    "@context": "https://schema.org",
    "@type": "ExchangeRateSpecification",
    currency: "AED",
    currentExchangeRate: {
      "@type": "UnitPriceSpecification",
      price: rate.aed.toString(),
      priceCurrency: "AED",
      referenceQuantity: {
        "@type": "QuantitativeValue",
        value: "1",
        unitCode: "SOL",
      },
    },
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Convert Solana to AED",
    description:
      "Step-by-step guide to convert Solana (SOL) to UAE Dirhams using Blip Money's native Solana escrow-protected settlement protocol.",
    totalTime: "PT10M",
    estimatedCost: { "@type": "MonetaryAmount", currency: "AED", value: "0" },
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

export default function SolToAed() {
  const { rate, lastUpdated, loading, error, isLive, refresh } = useLiveRate();
  const timeAgo = useTimeAgo(lastUpdated);
  const [searchParams, setSearchParams] = useSearchParams();

  const [amount, setAmount] = useState(searchParams.get("amount") || "10");
  const [direction, setDirection] = useState<"sell" | "buy">(
    searchParams.get("direction") === "buy" ? "buy" : "sell"
  );
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [chartPeriod, setChartPeriod] = useState(7);
  const { data: priceHistory, loading: chartLoading } = usePriceHistory(chartPeriod);

  // Sync state to URL
  useEffect(() => {
    const p = new URLSearchParams();
    if (amount && amount !== "10") p.set("amount", amount);
    if (direction !== "sell") p.set("direction", direction);
    setSearchParams(p, { replace: true });
  }, [amount, direction, setSearchParams]);

  // Computed conversion
  const conversion = useMemo(() => {
    const r = rate.aed;
    const change = rate.aed_24h_change ?? 0;
    const numAmount = parseFloat(amount) || 0;
    const fee = numAmount * 0.005;
    const netAmount = direction === "sell" ? numAmount - fee : numAmount;
    const aedAmount = direction === "sell" ? netAmount * r : numAmount;
    const cryptoAmount = direction === "buy" ? (numAmount / r) * (1 - 0.005) : numAmount;

    return {
      rate: r,
      change,
      aedAmount: direction === "sell" ? aedAmount : numAmount,
      cryptoAmount: direction === "sell" ? numAmount : cryptoAmount,
      fee: direction === "sell" ? fee * r : fee,
      youReceive: direction === "sell" ? aedAmount : cryptoAmount,
    };
  }, [rate, amount, direction]);

  const schemas = useMemo(() => buildSchemas(rate), [rate]);

  return (
    <>
      <SEO
        title="Solana to AED — Live SOL/AED Rate | Blip Money"
        description="Convert Solana to UAE Dirhams instantly. Live SOL/AED exchange rate updated every 30 seconds. Native Solana escrow, sub-$0.01 fees, fastest settlement. Best SOL to AED rate in Dubai and UAE."
        canonical="https://blip.money/sol-to-aed"
        keywords="SOL to AED, solana to AED, solana price AED, SOL AED rate, convert solana to AED, sell solana Dubai, solana price UAE, 1 SOL to AED, solana to dirham, SOL to AED today"
        type="website"
      />
      <HreflangTags path="/sol-to-aed" />
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
                { label: "Crypto to AED", href: "/crypto-to-aed" },
                { label: "Solana to AED" },
              ]}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
              className="mt-6"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black dark:text-white tracking-tight leading-[1.08] mb-4">
                Solana to AED
                <br />
                <span className="bg-gradient-to-r from-black/60 to-black/30 dark:from-white/60 dark:to-white/30 bg-clip-text text-transparent">
                  Live Converter
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-black/50 dark:text-white/40 max-w-xl leading-relaxed mb-10">
                Convert SOL to UAE Dirhams natively on Solana. Fastest settlement, lowest fees, escrow-protected.
              </p>

              {/* Live status badge */}
              <div className="flex items-center gap-3 mb-8">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/[0.08] dark:border-white/[0.08]">
                  <div className="w-2 h-2 rounded-full bg-[#ff6b35] animate-pulse" />
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
                    Sell SOL
                  </button>
                  <button
                    onClick={() => { setDirection("buy"); sounds.click(); }}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${direction === "buy" ? "bg-black dark:bg-white text-white dark:text-black" : "bg-black/5 dark:bg-white/5 text-black/50 dark:text-white/50"}`}
                  >
                    Buy SOL
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
                        <span className="text-lg leading-none">🇦🇪</span>
                        <span className="text-black dark:text-white">AED</span>
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
                          ? `${conversion.aedAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                          : `${conversion.cryptoAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: COIN_DECIMALS })}`
                      ) : (
                        "—"
                      )}
                    </div>
                    {direction === "sell" ? (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/[0.08] dark:border-white/[0.08] text-sm font-semibold">
                        <span className="text-lg leading-none">🇦🇪</span>
                        <span className="text-black dark:text-white">AED</span>
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
                        1 {COIN_SYMBOL} = {conversion.rate.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AED
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
                        {conversion.fee.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AED
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black/40 dark:text-white/30">Network Fee</span>
                      <span className="text-black/60 dark:text-white/40">&lt; $0.01 (Solana native)</span>
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
                  <span className="relative z-10">Convert SOL to AED</span>
                  <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                </Link>

                <p className="text-center text-[11px] text-black/30 dark:text-white/20 mt-3">
                  Native Solana escrow. Sub-second finality. Your keys, your SOL.
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
                  SOL/AED Price Chart
                </h2>
                <p className="text-black/40 dark:text-white/35 mt-1">
                  Historical Solana to AED exchange rate
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
                        {stat.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AED
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            WHAT IS SOLANA
            ═══════════════════════════════════════════ */}
        <Section className="py-16 sm:py-20 border-t border-black/[0.04] dark:border-white/[0.04]">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-4">
              What is Solana?
            </h2>
            <div className="bg-white/60 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl p-6 sm:p-8">
              <p className="text-[15px] text-black/50 dark:text-white/40 leading-relaxed mb-4">
                Solana (SOL) is a high-performance Layer 1 blockchain designed for speed and scalability. With 400-millisecond block times, sub-second transaction finality, and fees consistently under $0.01, Solana has become the preferred blockchain for DeFi, NFTs, and payment applications. It processes thousands of transactions per second without sacrificing decentralization.
              </p>
              <p className="text-[15px] text-black/50 dark:text-white/40 leading-relaxed mb-4">
                Solana uses a unique proof-of-history (PoH) consensus mechanism combined with proof-of-stake, enabling its unmatched throughput. The ecosystem includes leading DeFi protocols (Jupiter, Raydium, Marinade), top NFT marketplaces (Magic Eden, Tensor), and a growing number of real-world payment applications — including Blip.
              </p>
              <p className="text-[15px] text-black/50 dark:text-white/40 leading-relaxed">
                Blip is built natively on Solana, which means SOL to AED conversions benefit from the fastest escrow settlement, the lowest network fees, and zero bridging delays. For SOL holders, Blip provides the most direct path from SOL to AED in the UAE market — your tokens never leave the Solana network during the entire conversion process.
              </p>
            </div>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            SOL PRICE IN AED TODAY
            ═══════════════════════════════════════════ */}
        <Section className="py-16 sm:py-20 border-t border-black/[0.04] dark:border-white/[0.04]">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-2">
              Solana Price in AED Today
            </h2>
            <p className="text-black/40 dark:text-white/35 mb-8">
              The live Solana to AED exchange rate and key network metrics.
            </p>

            <div className="bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] rounded-2xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/30 dark:text-white/25">1 SOL =</span>
                  <div className="text-3xl sm:text-4xl font-bold text-black dark:text-white tabular-nums mt-1">
                    {rate.aed.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AED
                  </div>
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${(rate.aed_24h_change ?? 0) >= 0 ? "text-emerald-500" : "text-red-400"}`}>
                  {(rate.aed_24h_change ?? 0) >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {Math.abs(rate.aed_24h_change ?? 0).toFixed(2)}% (24h)
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
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-black/30 dark:text-white/25">Network TPS</span>
                  <span className="block text-lg font-bold text-black dark:text-white mt-1 tabular-nums">~4,000+</span>
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
              Solana to AED Conversion Table
            </h2>
            <p className="text-black/40 dark:text-white/35 mb-8">
              Quick reference for common SOL to AED amounts at the current live rate.
            </p>

            <div className="bg-white/80 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/[0.06] dark:border-white/[0.06]">
                    <th className="text-left px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/40 dark:text-white/30">Solana (SOL)</th>
                    <th className="text-right px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/40 dark:text-white/30">UAE Dirham (AED)</th>
                    <th className="text-right px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/40 dark:text-white/30">US Dollar (USD)</th>
                  </tr>
                </thead>
                <tbody>
                  {CONVERSION_TABLE.map((row) => (
                    <tr key={row.amount} className="border-b border-black/[0.04] dark:border-white/[0.04] last:border-0 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 font-semibold text-black dark:text-white">{row.label}</td>
                      <td className="px-6 py-4 text-right font-semibold text-black dark:text-white tabular-nums">
                        {(row.amount * rate.aed).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AED
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
              Popular SOL to AED Conversions
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {POPULAR_AMOUNTS.map((item) => (
                <Link
                  key={item.crypto}
                  to={`/sol-to-aed?amount=${item.crypto}`}
                  className="group p-5 rounded-2xl bg-white/60 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] hover:border-black/[0.12] dark:hover:border-white/[0.12] transition-colors"
                >
                  <span className="block text-sm font-semibold text-black dark:text-white group-hover:text-gray-600 dark:group-hover:text-white/80 transition-colors">
                    {item.label}
                  </span>
                  <span className="block text-lg font-bold text-black dark:text-white mt-1 tabular-nums">
                    {(item.crypto * rate.aed).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AED
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
              How to Convert Solana to AED
            </h2>
            <p className="text-black/40 dark:text-white/35 mb-10">
              Convert SOL to UAE Dirhams in 4 simple steps — natively on Solana, no bridging required.
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
            WHY BLIP FOR SOL — Native advantage
            ═══════════════════════════════════════════ */}
        <Section className="py-16 sm:py-20 border-t border-black/[0.04] dark:border-white/[0.04]">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-10">
              Why Blip is the Best Way to Convert SOL to AED
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Zap, title: "Native Solana", desc: "Blip is built on Solana. SOL conversions use native escrow — no bridging, no wrapping, no delays." },
                { icon: Shield, title: "5-10 Min Settlement", desc: "SOL's sub-second finality means escrow locks instantly. Average SOL to AED settlement is under 10 minutes." },
                { icon: Wallet, title: "Sub-$0.01 Fees", desc: "Solana network fees are consistently under a penny. Combined with 0.5% protocol fee, it is the cheapest conversion path." },
                { icon: Lock, title: "Direct from Phantom", desc: "Connect Phantom, Solflare, or Backpack directly. Your SOL stays native throughout the entire conversion." },
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
              Solana to AED — Frequently Asked Questions
            </h2>
            <p className="text-black/40 dark:text-white/35 mb-8">
              Everything you need to know about converting Solana to UAE Dirhams.
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
              Ready to Convert Solana to AED?
            </h2>
            <p className="text-lg text-black/40 dark:text-white/35 max-w-lg mx-auto mb-8">
              Join thousands converting SOL to AED on the fastest, most native settlement protocol in the UAE.
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
                { label: "Crypto to AED", href: "/crypto-to-aed", desc: "All crypto rates" },
                { label: "BTC to AED", href: "/btc-to-aed", desc: "Bitcoin converter" },
                { label: "ETH to AED", href: "/eth-to-aed", desc: "Ethereum converter" },
                { label: "Sell USDT Dubai", href: "/sell-usdt-dubai", desc: "Dubai guide" },
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
