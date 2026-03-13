import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  ArrowDownUp,
  Clock,
  Shield,
  Zap,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ChevronDown,
  Check,
  ArrowRight,
  Globe,
  Lock,
  Wallet,
  BadgeCheck,
  Minus,
} from "lucide-react";
import SEO from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { HreflangTags } from "@/components/HreflangTags";
import StructuredData from "@/components/StructuredData";
import { sounds } from "@/lib/sounds";
import { CTAButton } from "@/components/Navbar";

/* ═══════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════ */

interface CryptoAsset {
  id: string; // coingecko id
  symbol: string;
  name: string;
  icon: string;
  decimals: number;
}

interface RateData {
  inr: number;
  usd: number;
  inr_24h_change?: number;
}

type Rates = Record<string, RateData>;

/* ═══════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════ */

const CRYPTO_ASSETS: CryptoAsset[] = [
  { id: "tether", symbol: "USDT", name: "Tether", icon: "₮", decimals: 2 },
  { id: "usd-coin", symbol: "USDC", name: "USD Coin", icon: "◈", decimals: 2 },
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin", icon: "₿", decimals: 8 },
  { id: "ethereum", symbol: "ETH", name: "Ethereum", icon: "Ξ", decimals: 6 },
  { id: "solana", symbol: "SOL", name: "Solana", icon: "◎", decimals: 4 },
];

const COINGECKO_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=tether,usd-coin,bitcoin,ethereum,solana&vs_currencies=inr,usd&include_24hr_change=true";

const REFRESH_INTERVAL = 300_000; // 5 minutes (CoinGecko free tier rate limit)

// Pre-rendered static rates so Google crawler sees real content on first paint (no empty placeholders)
const STATIC_RATES: Rates = {
  usdt: { inr: 83.5, usd: 1.0, inr_24h_change: 0.01 }, // added
  tether: { inr: 83.5, usd: 1.0, inr_24h_change: 0.01 },
  "usd-coin": { inr: 83.5, usd: 1.0, inr_24h_change: 0.02 },
  bitcoin: { inr: 8100000, usd: 97200, inr_24h_change: 1.2 },
  ethereum: { inr: 222000, usd: 2670, inr_24h_change: 0.8 },
  solana: { inr: 15900, usd: 190, inr_24h_change: 1.5 },
};

/* ═══════════════════════════════════════════════
   LIVE RATES HOOK
   ═══════════════════════════════════════════════ */

function useLiveRates() {
  const [rates, setRates] = useState<Rates>(STATIC_RATES);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isLive, setIsLive] = useState(false);

  const fetchRates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(COINGECKO_URL);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setRates(data);
      setLastUpdated(new Date());
      setError(false);
      setIsLive(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchRates]);

  return { rates, lastUpdated, loading, error, isLive, refresh: fetchRates };
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
   DROPDOWN COMPONENT
   ═══════════════════════════════════════════════ */

function AssetDropdown({
  selected,
  assets,
  onSelect,
}: {
  selected: CryptoAsset;
  assets: CryptoAsset[];
  onSelect: (a: CryptoAsset) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => {
          setOpen(!open);
          sounds.click();
        }}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/[0.08] dark:border-white/[0.08] hover:border-black/[0.15] dark:hover:border-white/[0.15] transition-colors text-sm font-semibold"
      >
        <span className="text-lg leading-none">{selected.icon}</span>
        <span className="text-black dark:text-white">{selected.symbol}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-black/40 dark:text-white/40 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full mt-1 left-0 z-50 w-48 bg-white dark:bg-[#111] border border-black/[0.08] dark:border-white/[0.08] rounded-xl shadow-xl overflow-hidden"
        >
          {assets.map((a) => (
            <button
              key={a.id}
              onClick={() => {
                onSelect(a);
                setOpen(false);
                sounds.click();
              }}
              className="flex items-center gap-3 w-full px-4 py-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <span className="text-lg leading-none">{a.icon}</span>
              <div className="text-left">
                <span className="block text-sm font-semibold text-black dark:text-white">
                  {a.symbol}
                </span>
                <span className="block text-xs text-black/40 dark:text-white/40">
                  {a.name}
                </span>
              </div>
              {a.id === selected.id && (
                <Check className="w-4 h-4 text-emerald-500 ml-auto" />
              )}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   FAQ ACCORDION
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
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        className="overflow-hidden"
      >
        <p className="pb-5 text-[14px] text-black/50 dark:text-white/40 leading-relaxed">
          {a}
        </p>
      </motion.div>
    </div>
  );
}

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
   PRICE CHART
   ═══════════════════════════════════════════════ */

const CHART_PERIODS = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
  { label: "1Y", days: 365 },
] as const;

function usePriceHistory(coinId: string, days: number) {
  const [data, setData] = useState<[number, number][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=inr&days=${days}`,
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
  }, [coinId, days]);

  return { data, loading };
}

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
        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.12" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillPoints} fill="url(#chartFill)" />
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
   FAQ DATA
   ═══════════════════════════════════════════════ */

const FAQ_DATA = [
  {
    q: "How do I convert crypto to INR?",
    a: "Connect your Solana wallet on Blip, select the crypto you want to sell (USDT, USDC, BTC, ETH, or SOL), enter the amount, and submit a trade request. A verified merchant accepts your trade, funds are locked in on-chain escrow, and once the INR transfer is confirmed, the crypto is released. The entire process takes under 15 minutes.",
  },
  {
    q: "What is the current USDT to INR exchange rate?",
    a: "The USDT to INR rate fluctuates in real-time based on market conditions. Our live converter at the top of this page shows the current rate updated every 30 seconds from global market data. The USD/INR rate is approximately 83.5, and USDT typically trades within 0.1% of this rate.",
  },
  {
    q: "Is it legal to sell crypto for INR in India?",
    a: "Yes. Cryptocurrency trading is legal in India. The Supreme Court of India lifted the RBI ban on crypto in 2020. However, crypto gains are subject to a 30% tax under Section 115BBH of the Income Tax Act, and a 1% TDS applies under Section 194S. Blip operates within Indian regulatory guidelines.",
  },
  {
    q: "What fees does Blip charge for crypto to INR conversion?",
    a: "Blip charges a small, transparent protocol fee displayed before you confirm any trade. Solana network fees are under $0.01 per transaction. There are no hidden fees, exchange rate markups, or withdrawal charges. During the beta phase, early adopters benefit from reduced fees.",
  },
  {
    q: "How long does a crypto to INR conversion take?",
    a: "Most conversions complete within 5-15 minutes. The on-chain escrow lock happens instantly (sub-second on Solana). The total time depends on how quickly the merchant confirms the INR bank transfer via UPI or IMPS. Average settlement time is under 10 minutes.",
  },
  {
    q: "Is Blip safe for large crypto to INR conversions?",
    a: "Yes. Every trade is protected by on-chain smart contract escrow on Solana. Funds are locked until both parties confirm, and neither Blip nor any third party can access escrowed funds. Blip's smart contracts are audited by third-party security firms, and the protocol is fully non-custodial.",
  },
  {
    q: "What payment methods are available for receiving INR?",
    a: "For the India corridor, Blip merchants support UPI (fastest and most popular), IMPS bank transfers, NEFT, and RTGS for large amounts. Each merchant displays their supported payment methods when you match with them.",
  },
  {
    q: "Can I convert INR to crypto (buy crypto with INR)?",
    a: "Yes. Blip supports both on-ramping (INR to crypto) and off-ramping (crypto to INR). Select 'Buy' mode in the app, enter your INR amount, and a merchant will sell you the crypto through the same escrow-protected process.",
  },
  {
    q: "What's the minimum and maximum conversion amount?",
    a: "Minimum amounts vary by corridor and merchant, generally starting around \u20B9500 equivalent. Maximum amounts depend on merchant liquidity and corridor limits. For large OTC trades, Blip's matching engine connects you with high-liquidity merchants who can handle substantial volumes.",
  },
  {
    q: "How does Blip compare to WazirX P2P for crypto to INR?",
    a: "Unlike WazirX P2P where your crypto sits in a centralized exchange wallet, Blip is fully non-custodial \u2014 your funds stay in your wallet until trade initiation, then are held in transparent on-chain escrow. There's no account freezing risk, no lengthy KYC process, and every transaction is verifiable on-chain via Blip Scan.",
  },
  {
    q: "Do I need KYC to convert crypto to INR on Blip?",
    a: "Blip uses a minimal verification model \u2014 basic identity verification (phone/email + wallet connection) is required to prevent fraud, but there are no lengthy document verification processes like traditional exchanges. This is possible through Blip's DAO-governed escrow model.",
  },
  {
    q: "Which cryptocurrencies can I convert to INR?",
    a: "Blip currently supports USDT (Tether), USDC (USD Coin), SOL (Solana), and is expanding to include BTC and ETH through cross-chain bridges. All tokens are on the Solana blockchain for fast, low-cost transactions.",
  },
];

/* ═══════════════════════════════════════════════
   COMPARISON DATA
   ═══════════════════════════════════════════════ */

const COMPARISON = [
  {
    feature: "Settlement Speed",
    blip: "5-15 minutes",
    binance: "15-60 minutes",
    wise: "1-3 business days",
    otc: "Same day",
  },
  {
    feature: "Fees",
    blip: "~0.5-1%",
    binance: "0-1% + spread",
    wise: "0.4-1.5% + markup",
    otc: "2-5% + negotiation",
  },
  {
    feature: "Custody Model",
    blip: "Non-custodial",
    binance: "Custodial",
    wise: "Custodial",
    otc: "Trust-based",
  },
  {
    feature: "Escrow Protection",
    blip: "On-chain smart contract",
    binance: "Centralized",
    wise: "None",
    otc: "None",
  },
  {
    feature: "KYC Required",
    blip: "Minimal",
    binance: "Full KYC",
    wise: "Full KYC",
    otc: "Varies",
  },
  {
    feature: "Account Freeze Risk",
    blip: "None",
    binance: "Yes",
    wise: "Yes",
    otc: "N/A",
  },
  {
    feature: "Transaction Transparency",
    blip: "Fully on-chain",
    binance: "Internal only",
    wise: "Tracking number",
    otc: "None",
  },
  {
    feature: "Minimum Amount",
    blip: "~\u20B9500",
    binance: "Varies",
    wise: "\u20B91",
    otc: "Usually $1,000+",
  },
  {
    feature: "24/7 Availability",
    blip: "Yes",
    binance: "Yes",
    wise: "Business hours",
    otc: "Business hours",
  },
  {
    feature: "Rewards / Cashback",
    blip: "BLIP token cashback",
    binance: "BNB discounts",
    wise: "None",
    otc: "None",
  },
];

/* ═══════════════════════════════════════════════
   HOW TO STEPS
   ═══════════════════════════════════════════════ */

const HOW_TO_STEPS = [
  {
    step: 1,
    title: "Connect your wallet",
    description:
      "Open Blip and connect your Solana wallet (Phantom, Solflare, or Backpack). No account creation or lengthy sign-up required.",
  },
  {
    step: 2,
    title: "Enter conversion amount",
    description:
      "Select the crypto you want to sell (USDT, USDC, SOL) and enter the amount. You'll see the live INR rate and exact amount you'll receive.",
  },
  {
    step: 3,
    title: "Confirm and escrow",
    description:
      "Review the rate, fees, and matched merchant. Confirm the trade \u2014 your crypto is locked in an on-chain escrow smart contract on Solana.",
  },
  {
    step: 4,
    title: "Receive INR",
    description:
      "The merchant sends INR to your bank account via UPI, IMPS, or your preferred payment method. Once confirmed, the escrow releases automatically. Done in under 15 minutes.",
  },
];

/* ═══════════════════════════════════════════════
   SCHEMAS
   ═══════════════════════════════════════════════ */

function buildSchemas(rates: Rates | null) {
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
    name: "How to Convert Crypto to INR",
    description:
      "Step-by-step guide to convert cryptocurrency to Indian Rupees using Blip Money's escrow-protected settlement protocol.",
    totalTime: "PT15M",
    estimatedCost: { "@type": "MonetaryAmount", currency: "INR", value: "0" },
    step: HOW_TO_STEPS.map((s) => ({
      "@type": "HowToStep",
      position: s.step,
      name: s.title,
      text: s.description,
    })),
  };

  const financialServiceSchema = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: "Blip Money \u2014 Crypto to INR Converter",
    description:
      "Convert cryptocurrency to Indian Rupees instantly with non-custodial escrow protection. Live rates, low fees, settlement in under 15 minutes.",
    url: "https://blip.money/crypto-to-inr",
    areaServed: { "@type": "Country", name: "India" },
    serviceType: "Cryptocurrency Exchange",
    provider: {
      "@type": "Organization",
      name: "Blip Money",
      url: "https://blip.money",
    },
    ...(rates?.tether && {
      offers: {
        "@type": "Offer",
        description: "USDT to INR conversion",
        price: rates.tether.inr.toString(),
        priceCurrency: "INR",
      },
    }),
  };

  return { faqSchema, howToSchema, financialServiceSchema };
}

/* ═══════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════ */

export default function CryptoToInr() {
  const { rates, lastUpdated, loading, error, isLive, refresh } =
    useLiveRates();
  const timeAgo = useTimeAgo(lastUpdated);
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize from URL params (?from=btc&amount=5000&direction=buy)
  const [selectedAsset, setSelectedAsset] = useState(() => {
    const from = searchParams.get("from");
    return (
      (from &&
        CRYPTO_ASSETS.find(
          (a) => a.symbol.toLowerCase() === from.toLowerCase(),
        )) ||
      CRYPTO_ASSETS[0]
    );
  });
  const [amount, setAmount] = useState(searchParams.get("amount") || "1000");
  const [direction, setDirection] = useState<"sell" | "buy">(
    searchParams.get("direction") === "buy" ? "buy" : "sell",
  );

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Chart state
  const [chartPeriod, setChartPeriod] = useState(7);
  const { data: priceHistory, loading: chartLoading } = usePriceHistory(
    selectedAsset.id,
    chartPeriod,
  );

  // Sync converter state -> URL for shareable deep links
  useEffect(() => {
    const p = new URLSearchParams();
    if (amount && amount !== "1000") p.set("amount", amount);
    if (selectedAsset.symbol !== "USDT")
      p.set("from", selectedAsset.symbol.toLowerCase());
    if (direction !== "sell") p.set("direction", direction);
    setSearchParams(p, { replace: true });
  }, [selectedAsset, amount, direction, setSearchParams]);

  // Computed conversion
  const conversion = useMemo(() => {
    if (!rates || !rates[selectedAsset.id]) return null;
    const rate = rates[selectedAsset.id].inr;
    const change = rates[selectedAsset.id].inr_24h_change ?? 0;
    const numAmount = parseFloat(amount) || 0;
    const fee = numAmount * 0.005; // 0.5% protocol fee
    const netAmount = direction === "sell" ? numAmount - fee : numAmount;
    const inrAmount = direction === "sell" ? netAmount * rate : numAmount;
    const cryptoAmount =
      direction === "buy" ? (numAmount / rate) * (1 - 0.005) : numAmount;

    return {
      rate,
      change,
      inrAmount: direction === "sell" ? inrAmount : numAmount,
      cryptoAmount: direction === "sell" ? numAmount : cryptoAmount,
      fee: direction === "sell" ? fee * rate : fee,
      feeCrypto: fee,
      youReceive: direction === "sell" ? inrAmount : cryptoAmount,
    };
  }, [rates, selectedAsset, amount, direction]);

  const schemas = useMemo(() => buildSchemas(rates), [rates]);

  return (
    <>
      <SEO
        title="Crypto to INR Converter \u2014 Live Rates | Blip Money"
        description="Convert USDT, USDC, BTC, ETH, SOL to INR instantly. Live exchange rates updated every 30 seconds. Non-custodial escrow, low fees, settlement under 15 minutes. Best crypto to INR rates in India."
        canonical="https://blip.money/crypto-to-inr"
        keywords="crypto to INR, USDT to INR, convert crypto to INR, USDC to INR rate, sell crypto India, crypto to INR rate today, best crypto exchange India, USDT INR live rate, buy INR with crypto, crypto cashout India"
        type="website"
      />
      <HreflangTags path="/crypto-to-inr" />
      <StructuredData type="custom" schema={schemas.faqSchema} />
      <StructuredData type="custom" schema={schemas.howToSchema} />
      <StructuredData type="custom" schema={schemas.financialServiceSchema} />

      <div className="min-h-screen bg-[#FAF8F5] dark:bg-transparent">
        {/* ═══════════════════════════════════════════
            HERO — LIVE CONVERTER
            ═══════════════════════════════════════════ */}
        <header className="relative pt-32 sm:pt-36 pb-12 sm:pb-16">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <Breadcrumbs
              items={[{ label: "Home", href: "/" }, { label: "Crypto to INR" }]}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
              className="mt-6"
            >
              {/* H1 — keyword-rich */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black dark:text-white tracking-tight leading-[1.08] mb-4">
                Crypto to INR
                <br />
                <span className="bg-gradient-to-r from-black/80 to-black/70 dark:from-white/60 dark:to-white/30 bg-clip-text text-transparent">
                  Live Converter
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-black/80 dark:text-white/40 max-w-xl leading-relaxed mb-10">
                Convert USDT, USDC, BTC, ETH & SOL to Indian Rupees instantly.
                Live rates, non-custodial escrow, settlement under 15 minutes.
              </p>

              {/* Live status badge */}
              <div className="flex items-center gap-3 mb-8">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/[0.08] dark:border-white/[0.08]">
                  <div className="w-2 h-2 rounded-full bg-black dark:bg-white animate-pulse" />
                  <span className="text-xs font-semibold text-black/60 dark:text-white/40">
                    Live Rates
                  </span>
                </div>
                <span className="text-xs text-black/50 dark:text-white/30">
                  {isLive ? `Updated ${timeAgo}` : "Updating live rates..."}
                </span>
                <button
                  onClick={() => {
                    refresh();
                    sounds.click();
                  }}
                  className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  title="Refresh rates"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 text-black/30 dark:text-white/30 ${loading ? "animate-spin" : ""}`}
                  />
                </button>
              </div>

              {/* ═══ CONVERTER CARD ═══ */}
              <div className="bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] rounded-2xl p-6 sm:p-8 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] dark:shadow-none">
                {/* Direction toggle */}
                <div className="flex items-center gap-3 mb-6">
                  <button
                    onClick={() => {
                      setDirection("sell");
                      sounds.click();
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${direction === "sell" ? "bg-black dark:bg-white text-white dark:text-black" : "bg-black/5 dark:bg-white/5 text-black/50 dark:text-white/50"}`}
                  >
                    Sell Crypto
                  </button>
                  <button
                    onClick={() => {
                      setDirection("buy");
                      sounds.click();
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${direction === "buy" ? "bg-black dark:bg-white text-white dark:text-black" : "bg-black/5 dark:bg-white/5 text-black/50 dark:text-white/50"}`}
                  >
                    Buy Crypto
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
                      onChange={(e) => {
                        const v = e.target.value.replace(/[^0-9.]/g, "");
                        if (v.replace(".", "").length <= 7) setAmount(v);
                      }}
                      className="flex-1 bg-transparent text-2xl sm:text-3xl font-bold text-black dark:text-white outline-none placeholder:text-black/20 dark:placeholder:text-white/20 min-w-0 truncate"
                      placeholder="0"
                    />
                    {direction === "sell" ? (
                      <AssetDropdown
                        selected={selectedAsset}
                        assets={CRYPTO_ASSETS}
                        onSelect={setSelectedAsset}
                      />
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/[0.08] dark:border-white/[0.08] text-sm font-semibold">
                        <span className="text-lg leading-none">
                          {"\u{1F1EE}\u{1F1F3}"}
                        </span>
                        <span className="text-black dark:text-white">INR</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Swap button */}
                <div className="flex justify-center -my-1 relative z-10">
                  <button
                    onClick={() => {
                      setDirection(direction === "sell" ? "buy" : "sell");
                      sounds.click();
                    }}
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
                        <span className="text-black/20 dark:text-white/20">
                          Loading...
                        </span>
                      ) : error ? (
                        <span className="text-red-400 text-lg">
                          Rate unavailable
                        </span>
                      ) : conversion ? (
                        direction === "sell" ? (
                          `${conversion.inrAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        ) : (
                          `${conversion.cryptoAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: selectedAsset.decimals })}`
                        )
                      ) : (
                        "\u2014"
                      )}
                    </div>
                    {direction === "sell" ? (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/[0.08] dark:border-white/[0.08] text-sm font-semibold">
                        <span className="text-lg leading-none">
                          {"\u{1F1EE}\u{1F1F3}"}
                        </span>
                        <span className="text-black dark:text-white">INR</span>
                      </div>
                    ) : (
                      <AssetDropdown
                        selected={selectedAsset}
                        assets={CRYPTO_ASSETS}
                        onSelect={setSelectedAsset}
                      />
                    )}
                  </div>
                </div>

                {/* Rate details */}
                {conversion && !loading && !error && (
                  <div className="space-y-2 mb-6 text-sm">
                    <div className="flex justify-between">
                      <span className="text-black/40 dark:text-white/30">
                        Exchange Rate
                      </span>
                      <span className="font-semibold text-black dark:text-white">
                        1 {selectedAsset.symbol} ={" "}
                        {conversion.rate.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        INR
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black/40 dark:text-white/30">
                        24h Change
                      </span>
                      <span
                        className={`font-semibold flex items-center gap-1 ${conversion.change >= 0 ? "text-emerald-500" : "text-red-400"}`}
                      >
                        {conversion.change >= 0 ? (
                          <TrendingUp className="w-3.5 h-3.5" />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5" />
                        )}
                        {Math.abs(conversion.change).toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black/40 dark:text-white/30">
                        Protocol Fee (0.5%)
                      </span>
                      <span className="text-black/60 dark:text-white/40">
                        {conversion.fee.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        INR
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-black/40 dark:text-white/30">
                        Network Fee
                      </span>
                      <span className="text-black/60 dark:text-white/40">
                        &lt; $0.01 (Solana)
                      </span>
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
                  <span className="relative z-10">Convert Now</span>
                  <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                </Link>

                <p className="text-center text-[12px] text-black/50 dark:text-white/20 mt-3">
                  Non-custodial escrow on Solana. Your keys, your crypto.
                </p>
              </div>
            </motion.div>
          </div>
        </header>

        {/* ═══════════════════════════════════════════
            PRICE CHART — Increases dwell time
            ═══════════════════════════════════════════ */}
        <Section className="py-16 sm:py-20 border-t border-black/[0.04] dark:border-white/[0.04]">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white">
                  {selectedAsset.symbol}/INR Price Chart
                </h2>
                <p className="text-black/40 dark:text-white/35 mt-1">
                  Historical {selectedAsset.name} to INR exchange rate
                </p>
              </div>
              <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 rounded-lg p-1 self-start">
                {CHART_PERIODS.map((p) => (
                  <button
                    key={p.days}
                    onClick={() => {
                      setChartPeriod(p.days);
                      sounds.click();
                    }}
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
              <PriceChart
                data={priceHistory}
                loading={chartLoading}
                change={conversion?.change ?? 0}
              />

              {priceHistory.length > 1 && !chartLoading && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-black/[0.06] dark:border-white/[0.06]">
                  {[
                    {
                      label: "Low",
                      value: Math.min(...priceHistory.map((d) => d[1])),
                    },
                    {
                      label: "High",
                      value: Math.max(...priceHistory.map((d) => d[1])),
                    },
                    {
                      label: "Current",
                      value: priceHistory[priceHistory.length - 1][1],
                    },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-black/30 dark:text-white/25">
                        {stat.label}
                      </span>
                      <span className="block text-sm font-bold text-black dark:text-white tabular-nums mt-1">
                        {stat.value.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        INR
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            LIVE RATES TABLE
            ═══════════════════════════════════════════ */}
        <Section className="py-16 sm:py-20">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-2">
              Live Crypto to INR Rates
            </h2>
            <p className="text-black/40 dark:text-white/35 mb-8">
              Real-time exchange rates for popular cryptocurrencies against
              Indian Rupees.
            </p>

            <div className="bg-white/80 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-black/[0.06] dark:border-white/[0.06]">
                      <th className="text-left px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/80 dark:text-white/30">
                        Asset
                      </th>
                      <th className="text-right px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/80 dark:text-white/30">
                        Price (INR)
                      </th>
                      <th className="text-right px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/80 dark:text-white/30">
                        Price (USD)
                      </th>
                      <th className="text-right px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/80 dark:text-white/30">
                        24h Change
                      </th>
                      <th className="text-right px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/80 dark:text-white/30"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {CRYPTO_ASSETS.map((asset) => {
                      const r = rates?.[asset.id];
                      const change = r?.inr_24h_change ?? 0;
                      return (
                        <tr
                          key={asset.id}
                          className="border-b border-black/[0.04] dark:border-white/[0.04] last:border-0 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <span className="text-xl leading-none">
                                {asset.icon}
                              </span>
                              <div>
                                <span className="font-semibold text-black dark:text-white">
                                  {asset.symbol}
                                </span>
                                <span className="text-black/30 dark:text-white/25 ml-2">
                                  {asset.name}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right font-semibold text-black dark:text-white tabular-nums">
                            {loading
                              ? "\u2014"
                              : r
                                ? `\u20B9${r.inr.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                : "\u2014"}
                          </td>
                          <td className="px-6 py-4 text-right text-black/50 dark:text-white/40 tabular-nums">
                            {loading
                              ? "\u2014"
                              : r
                                ? `$${r.usd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                : "\u2014"}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {loading ? (
                              "\u2014"
                            ) : r ? (
                              <span
                                className={`inline-flex items-center gap-1 font-semibold ${change >= 0 ? "text-emerald-500" : "text-red-400"}`}
                              >
                                {change >= 0 ? (
                                  <TrendingUp className="w-3.5 h-3.5" />
                                ) : (
                                  <TrendingDown className="w-3.5 h-3.5" />
                                )}
                                {Math.abs(change).toFixed(2)}%
                              </span>
                            ) : (
                              "\u2014"
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => {
                                setSelectedAsset(asset);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                                sounds.click();
                              }}
                              className="text-xs font-semibold text-black/40 dark:text-white/30 hover:text-black dark:hover:text-white transition-colors"
                            >
                              Convert →
                            </button>
                          </td>
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
            HOW TO CONVERT — HowTo schema bait
            ═══════════════════════════════════════════ */}
        <Section className="py-16 sm:py-20 border-t border-black/[0.04] dark:border-white/[0.04]">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-2">
              How to Convert Crypto to INR
            </h2>
            <p className="text-black/40 dark:text-white/35 mb-10">
              Convert any supported cryptocurrency to Indian Rupees in 4 simple
              steps.
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
                    <h3 className="text-[15px] font-bold text-black dark:text-white">
                      {s.title}
                    </h3>
                  </div>
                  <p className="text-[14px] text-black/50 dark:text-white/40 leading-relaxed">
                    {s.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            WHY BLIP — Trust signals
            ═══════════════════════════════════════════ */}
        <Section className="py-16 sm:py-20 border-t border-black/[0.04] dark:border-white/[0.04]">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-10">
              Why Convert Crypto to INR on Blip
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Zap,
                  title: "Under 15 Minutes",
                  desc: "From trade initiation to INR in your bank. Powered by Solana's sub-second finality.",
                },
                {
                  icon: Shield,
                  title: "Escrow Protected",
                  desc: "Every trade secured by on-chain smart contract escrow. Audited and transparent.",
                },
                {
                  icon: Wallet,
                  title: "Non-Custodial",
                  desc: "Your crypto stays in your wallet until you trade. No centralized exchange risks.",
                },
                {
                  icon: Lock,
                  title: "Minimal KYC",
                  desc: "Basic verification only. No lengthy document processes or account freezing risk.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-6 rounded-2xl bg-white/60 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06]"
                >
                  <item.icon className="w-5 h-5 text-black/30 dark:text-white/25 mb-4" />
                  <h3 className="text-[15px] font-bold text-black dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[13px] text-black/50 dark:text-white/40 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            COMPARISON TABLE — Featured snippet bait
            ═══════════════════════════════════════════ */}
        <Section className="py-16 sm:py-20 border-t border-black/[0.04] dark:border-white/[0.04]">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-2">
              Blip vs Other Crypto to INR Methods
            </h2>
            <p className="text-black/40 dark:text-white/35 mb-8">
              How Blip compares to WazirX P2P, Wise, and local OTC desks for
              converting crypto to Indian Rupees.
            </p>

            <div className="bg-white/80 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-black/[0.08] dark:border-white/[0.08]">
                      <th className="text-left px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/80 dark:text-white/30">
                        Feature
                      </th>
                      <th className="text-center px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/80 dark:text-white bg-black/[0.03] dark:bg-white/[0.03]">
                        Blip
                      </th>
                      <th className="text-center px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/80 dark:text-white/30">
                        WazirX P2P
                      </th>
                      <th className="text-center px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/80 dark:text-white/30">
                        Wise
                      </th>
                      <th className="text-center px-4 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-black/80 dark:text-white/30">
                        Local OTC
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON.map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-black/[0.04] dark:border-white/[0.04] last:border-0"
                      >
                        <td className="px-5 py-3.5 font-medium text-black/70 dark:text-white/60">
                          {row.feature}
                        </td>
                        <td className="px-4 py-3.5 text-center font-semibold text-black dark:text-white bg-black/[0.02] dark:bg-white/[0.02]">
                          {row.blip}
                        </td>
                        <td className="px-4 py-3.5 text-center text-black/50 dark:text-white/40">
                          {row.binance}
                        </td>
                        <td className="px-4 py-3.5 text-center text-black/50 dark:text-white/40">
                          {row.wise}
                        </td>
                        <td className="px-4 py-3.5 text-center text-black/50 dark:text-white/40">
                          {row.otc}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            POPULAR CONVERSIONS — Keyword targeting sections
            ═══════════════════════════════════════════ */}
        <Section className="py-16 sm:py-20 border-t border-black/[0.04] dark:border-white/[0.04]">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-10">
              Popular Crypto to INR Conversions
            </h2>

            <div className="space-y-8">
              {[
                {
                  symbol: "USDT",
                  name: "Tether",
                  h: "USDT to INR",
                  text: "Tether (USDT) is the most popular stablecoin for crypto-to-INR conversions. Pegged 1:1 to the US Dollar, USDT provides a stable intermediary for converting crypto holdings into Indian Rupees. With Blip, you can sell USDT for INR through escrow-protected merchant settlement in under 15 minutes, with rates closely tracking the USD/INR exchange rate of approximately \u20B983.5.",
                },
                {
                  symbol: "USDC",
                  name: "USD Coin",
                  h: "USDC to INR",
                  text: "USD Coin (USDC) is a regulated stablecoin issued by Circle, widely trusted for its full reserve backing and regular audits. Converting USDC to INR on Blip offers the same escrow protection and speed as USDT, with rates that closely mirror the USD/INR rate. Many institutional and professional traders prefer USDC for its regulatory transparency.",
                },
                {
                  symbol: "BTC",
                  name: "Bitcoin",
                  h: "Bitcoin to INR",
                  text: "Converting Bitcoin (BTC) to INR through Blip lets you cash out your BTC holdings without going through a centralized exchange. The live BTC/INR rate is derived from global market data and updated every 30 seconds. For large BTC-to-INR conversions, Blip's matching engine connects you with high-liquidity merchants to minimize slippage.",
                },
                {
                  symbol: "ETH",
                  name: "Ethereum",
                  h: "Ethereum to INR",
                  text: "Ethereum (ETH) holders can convert to INR through Blip's escrow-protected settlement. The ETH/INR rate fluctuates based on global market conditions, and Blip provides real-time pricing so you always know exactly how many Rupees you'll receive. Cross-chain bridge support for ETH on Solana is part of Blip's roadmap.",
                },
                {
                  symbol: "SOL",
                  name: "Solana",
                  h: "SOL to INR",
                  text: "As Blip is built natively on Solana, converting SOL to INR is the fastest and cheapest path. SOL transactions settle in under a second with fees under $0.01. The SOL/INR rate is updated live from market data, and Blip merchants provide competitive quotes for SOL-to-INR settlement across Indian payment methods including UPI and IMPS.",
                },
              ].map((item) => (
                <div
                  key={item.symbol}
                  className="p-6 rounded-2xl bg-white/60 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06]"
                >
                  <h3 className="text-lg font-bold text-black dark:text-white mb-2">
                    {item.h}
                  </h3>
                  <p className="text-[14px] text-black/50 dark:text-white/40 leading-relaxed">
                    {item.text}
                  </p>
                  {rates?.[
                    CRYPTO_ASSETS.find((a) => a.symbol === item.symbol)?.id ??
                      ""
                  ] && (
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-[13px] text-black/30 dark:text-white/25">
                        Current rate:
                      </span>
                      <span className="text-[13px] font-semibold text-black dark:text-white">
                        1 {item.symbol} ={" "}
                        {rates[
                          CRYPTO_ASSETS.find((a) => a.symbol === item.symbol)!
                            .id
                        ].inr.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        INR
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            INDIA CRYPTO REGULATORY CONTEXT
            ═══════════════════════════════════════════ */}
        <Section className="py-16 sm:py-20 border-t border-black/[0.04] dark:border-white/[0.04]">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-2">
              Crypto to INR in India — What You Need to Know
            </h2>
            <p className="text-black/40 dark:text-white/35 mb-8">
              India has an evolving regulatory framework for cryptocurrency with
              clear tax guidelines.
            </p>

            <div className="grid sm:grid-cols-3 gap-6 mb-8">
              {[
                {
                  icon: BadgeCheck,
                  title: "Legal & Taxed",
                  desc: "The Supreme Court of India lifted the RBI crypto ban in 2020. Crypto gains are taxed at 30% under Section 115BBH, with 1% TDS under Section 194S. Blip operates within Indian tax and regulatory guidelines.",
                },
                {
                  icon: Globe,
                  title: "Growing Market",
                  desc: "India is one of the world's largest crypto markets by adoption, with over 100 million crypto owners and rapidly growing trading volumes. Multiple exchanges and platforms serve the Indian market.",
                },
                {
                  icon: Shield,
                  title: "Consumer Protection",
                  desc: "The RBI and SEBI are working on comprehensive crypto regulations to protect consumers while enabling innovation. Blip's non-custodial escrow model provides an additional layer of protection for Indian users.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-6 rounded-2xl bg-white/60 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06]"
                >
                  <item.icon className="w-5 h-5 text-black/30 dark:text-white/25 mb-4" />
                  <h3 className="text-[15px] font-bold text-black dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[13px] text-black/50 dark:text-white/40 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ═══════════════════════════════════════════
            FAQ — FAQPage schema
            ═══════════════════════════════════════════ */}
        <Section className="py-16 sm:py-20 border-t border-black/[0.04] dark:border-white/[0.04]">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-2">
              Crypto to INR — Frequently Asked Questions
            </h2>
            <p className="text-black/40 dark:text-white/35 mb-8">
              Everything you need to know about converting cryptocurrency to
              Indian Rupees.
            </p>

            {/* <div className="bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] rounded-2xl px-6 sm:px-8">
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
            <div className="space-y-4 ">
              {FAQ_DATA.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 1, y: 20 }}
                  // animate={isInView ? { opacity: 1, y: 0 } : {}}
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

        {/* ═══════════════════════════════════════════
            CTA
            ═══════════════════════════════════════════ */}
        <Section className="py-16 sm:py-20 border-t border-black/[0.04] dark:border-white/[0.04]">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white mb-4">
              Ready to Convert?
            </h2>
            <p className="text-lg text-black/50 dark:text-white/35 max-w-lg mx-auto mb-8">
              Join thousands converting crypto to INR on the fastest, most
              secure settlement protocol in India.
            </p>
            {/* <Link
              to="/waitlist"
              onClick={() => sounds.click()}
              onMouseEnter={() => sounds.hover()}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold text-[15px] hover:opacity-90 transition-opacity"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link> */}
            <CTAButton to="/waitlist" className="w-[220px] h-[48px]">
              Get Started
            </CTAButton>
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
                {
                  label: "How It Works",
                  href: "/how-it-works",
                  desc: "Protocol explained",
                },
                { label: "FAQ", href: "/faq", desc: "Common questions" },
                { label: "Compare", href: "/compare", desc: "Blip vs others" },
                {
                  label: "Sell USDT India",
                  href: "/sell-usdt-india",
                  desc: "India guide",
                },
              ].map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="group p-4 rounded-xl bg-white/60 dark:bg-white/[0.03] border border-black/30 dark:border-white/[0.06] hover:border-black/[0.12] dark:hover:border-white/[0.12] transition-colors"
                >
                  <span className="block text-sm font-semibold text-black dark:text-white group-hover:text-gray-600 dark:group-hover:text-white/80 transition-colors">
                    {link.label}
                  </span>
                  <span className="block text-xs text-black/50 dark:text-white/25 mt-1">
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
}
