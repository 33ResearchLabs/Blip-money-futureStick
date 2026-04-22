/* ════════════════════════════════════════════════════════════
   BLIP RATES — app shell
   A cinematic, addictive rates terminal for USD / USDT → INR, AED, PHP
   Hybrid shell: dark app chrome + cream content cards.
   Live sources: Binance, Bybit, OKX, KuCoin, HTX P2P.
   Future: Cash / Wire / Remittance / Arbitrage routes (stubbed).
   ════════════════════════════════════════════════════════════ */

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import {
  Search,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  ExternalLink,
  Loader2,
  Copy,
  Check,
  Zap,
  ArrowRight,
  Flame,
  Banknote,
  Building2,
  Send,
  Globe2,
  LineChart,
  Radio,
  Sparkles,
  BellRing,
  Star,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SEO from "@/components/SEO";

/* ────────── TYPES ────────── */

type Side = "BUY" | "SELL";
type AmountUnit = "INR" | "USDT";
type Pair = "USDT_INR" | "USDT_AED" | "USDT_PHP";
type RouteKey = "p2p" | "cash" | "wire" | "remit" | "arb";

type Quote = {
  source: string;
  sourceUrl: string;
  price: number;
  minINR: number;
  maxINR: number;
  availableUSDT: number;
  merchant: string;
  completionRate: number | null;
  orders: number | null;
  payments: string[];
};

type SourceResult = {
  source: string;
  ok: boolean;
  quotes: Quote[];
  error?: string;
};

/* ────────── FETCHERS ────────── */

const PROXY = "https://corsproxy.io/?";
const px = (url: string) => PROXY + encodeURIComponent(url);

async function fetchBinance(side: Side): Promise<Quote[]> {
  const res = await fetch(
    px("https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search"),
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        asset: "USDT",
        fiat: "INR",
        tradeType: side,
        page: 1,
        rows: 10,
        publisherType: null,
        payTypes: [],
      }),
    },
  );
  const json = await res.json();
  const rows = json?.data ?? [];
  return rows.map(
    (r: any): Quote => ({
      source: "Binance",
      sourceUrl:
        "https://p2p.binance.com/en/trade/all-payments/USDT?fiat=INR",
      price: parseFloat(r.adv.price),
      minINR: parseFloat(r.adv.minSingleTransAmount),
      maxINR: parseFloat(
        r.adv.dynamicMaxSingleTransAmount ?? r.adv.maxSingleTransAmount,
      ),
      availableUSDT: parseFloat(r.adv.tradableQuantity),
      merchant: r.advertiser.nickName,
      completionRate: r.advertiser.monthFinishRate ?? null,
      orders: r.advertiser.monthOrderCount ?? null,
      payments: (r.adv.tradeMethods ?? []).map(
        (m: any) => m.tradeMethodName || m.identifier,
      ),
    }),
  );
}

async function fetchBybit(side: Side): Promise<Quote[]> {
  const res = await fetch(px("https://api2.bybit.com/fiat/otc/item/online"), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      userId: "",
      tokenId: "USDT",
      currencyId: "INR",
      payment: [],
      side: side === "BUY" ? "1" : "0",
      size: "10",
      page: "1",
      amount: "",
      authMaker: false,
      canTrade: false,
    }),
  });
  const json = await res.json();
  const rows = json?.result?.items ?? [];
  return rows.map(
    (r: any): Quote => ({
      source: "Bybit",
      sourceUrl:
        "https://www.bybit.com/fiat/trade/otc/?actionType=0&token=USDT&fiat=INR",
      price: parseFloat(r.price),
      minINR: parseFloat(r.minAmount),
      maxINR: parseFloat(r.maxAmount),
      availableUSDT: parseFloat(r.lastQuantity ?? r.quantity),
      merchant: r.nickName,
      completionRate:
        r.recentExecuteRate != null ? r.recentExecuteRate / 100 : null,
      orders: r.recentOrderNum ?? null,
      payments: (r.payments ?? []).map((p: any) =>
        typeof p === "string" ? p : p.paymentType,
      ),
    }),
  );
}

async function fetchOkx(side: Side): Promise<Quote[]> {
  const okxSide = side === "BUY" ? "sell" : "buy";
  const url = `https://www.okx.com/v3/c2c/tradingOrders/books?quoteCurrency=INR&baseCurrency=USDT&side=${okxSide}&paymentMethod=all&userType=all&receivingAds=false&showTrade=false&showFollow=false&showAlreadyTraded=false&isAbleFilter=false`;
  const res = await fetch(px(url));
  const json = await res.json();
  const rows = json?.data?.[okxSide] ?? json?.data ?? [];
  return (Array.isArray(rows) ? rows : []).slice(0, 10).map(
    (r: any): Quote => ({
      source: "OKX",
      sourceUrl: "https://www.okx.com/p2p-markets/inr/buy-usdt",
      price: parseFloat(r.price),
      minINR: parseFloat(r.quoteMinAmountPerOrder ?? r.minAmount ?? 0),
      maxINR: parseFloat(r.quoteMaxAmountPerOrder ?? r.maxAmount ?? 0),
      availableUSDT: parseFloat(r.availableAmount ?? r.quantity ?? 0),
      merchant: r.nickName ?? r.merchantName ?? "OKX Merchant",
      completionRate:
        r.completedRate != null ? parseFloat(r.completedRate) : null,
      orders: r.completedOrderQuantity ?? null,
      payments: (r.paymentMethods ?? []).map((p: any) => p.name ?? p),
    }),
  );
}

async function fetchKucoin(side: Side): Promise<Quote[]> {
  const kuSide = side === "BUY" ? "SELL" : "BUY";
  const url = `https://www.kucoin.com/_api/otc/ad/list?currency=INR&legal=INR&lang=en_US&status=PUTUP&side=${kuSide}&page=1&pageSize=10&token=USDT`;
  const res = await fetch(px(url));
  const json = await res.json();
  const rows = json?.items ?? json?.data?.items ?? [];
  return rows.slice(0, 10).map(
    (r: any): Quote => ({
      source: "KuCoin",
      sourceUrl: "https://www.kucoin.com/otc/buy/USDT-INR",
      price: parseFloat(r.floatPrice ?? r.price),
      minINR: parseFloat(r.limitMinQuote ?? r.minQuote ?? 0),
      maxINR: parseFloat(r.limitMaxQuote ?? r.maxQuote ?? 0),
      availableUSDT: parseFloat(r.currencyQuantity ?? r.quantity ?? 0),
      merchant: r.userName ?? r.nickName ?? "KuCoin Merchant",
      completionRate:
        r.completedRate != null ? parseFloat(r.completedRate) / 100 : null,
      orders: r.completedCount ?? null,
      payments: (r.premiumPayMethodList ?? r.payMethodList ?? []).map(
        (p: any) => p.payMethod ?? p.name ?? p,
      ),
    }),
  );
}

async function fetchHtx(side: Side): Promise<Quote[]> {
  const htxType = side === "BUY" ? "sell" : "buy";
  const url = `https://www.htx.com/-/x/otc/v1/data/trade-market?coinId=2&currency=102&tradeType=${htxType}&currPage=1&payMethod=0&acceptOrder=0&country=37&blockType=general&online=1&range=0&amount=`;
  const res = await fetch(px(url));
  const json = await res.json();
  const rows = json?.data ?? [];
  return rows.slice(0, 10).map(
    (r: any): Quote => ({
      source: "HTX",
      sourceUrl: "https://www.htx.com/en-us/fiat-crypto/trade/buy-usdt_inr/",
      price: parseFloat(r.price),
      minINR: parseFloat(r.minTradeLimit ?? 0),
      maxINR: parseFloat(r.maxTradeLimit ?? 0),
      availableUSDT: parseFloat(r.tradeCount ?? 0),
      merchant: r.userName ?? "HTX Merchant",
      completionRate:
        r.orderCompleteRate != null
          ? parseFloat(r.orderCompleteRate) / 100
          : null,
      orders: r.tradeMonthTimes ?? null,
      payments: (r.payMethods ?? []).map((p: any) => p.name ?? p),
    }),
  );
}

const SOURCES: { name: string; fetch: (side: Side) => Promise<Quote[]> }[] = [
  { name: "Binance", fetch: fetchBinance },
  { name: "Bybit", fetch: fetchBybit },
  { name: "OKX", fetch: fetchOkx },
  { name: "KuCoin", fetch: fetchKucoin },
  { name: "HTX", fetch: fetchHtx },
];

async function fetchGlobalUsdtInr(): Promise<number | null> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=inr",
    );
    const j = await res.json();
    const v = j?.tether?.inr;
    return typeof v === "number" ? v : null;
  } catch {
    return null;
  }
}

/* ────────── ANIMATED PRICE ────────── */

function AnimatedPrice({
  value,
  decimals = 2,
}: {
  value: number;
  decimals?: number;
}) {
  const mv = useMotionValue(value);
  const display = useTransform(mv, (v) =>
    v.toLocaleString("en-IN", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }),
  );
  useEffect(() => {
    const controls = animate(mv, value, {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    });
    return controls.stop;
  }, [value, mv]);
  return <motion.span>{display}</motion.span>;
}

/* ────────── TICKER TAPE ────────── */

type TickerItem = {
  pair: string;
  price: number;
  delta: number;
  highlight?: boolean;
};

function TickerTape({ items }: { items: TickerItem[] }) {
  if (items.length === 0) return null;
  // duplicate to create seamless loop
  const loop = [...items, ...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-white/5 bg-black">
      <div className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-black to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-black to-transparent z-10" />
      <motion.div
        className="flex gap-8 whitespace-nowrap py-2.5"
        animate={{ x: ["0%", "-33.333%"] }}
        transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
      >
        {loop.map((t, i) => {
          const up = t.delta >= 0;
          return (
            <div
              key={i}
              className="flex items-center gap-2 text-[12px] font-mono"
            >
              <span className="text-white/40">{t.pair}</span>
              <span
                className={`font-semibold tabular-nums ${
                  t.highlight ? "text-[#ff6b35]" : "text-white"
                }`}
              >
                {t.price.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <span
                className={`tabular-nums text-[11px] ${
                  up ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {up ? "▲" : "▼"} {Math.abs(t.delta).toFixed(2)}%
              </span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

/* ────────── ROUTE CATALOG ────────── */

const ROUTES: {
  key: RouteKey;
  label: string;
  sub: string;
  icon: LucideIcon;
  live: boolean;
}[] = [
  { key: "p2p", label: "P2P", sub: "Exchanges", icon: Radio, live: true },
  {
    key: "cash",
    label: "Cash",
    sub: "OTC desks",
    icon: Banknote,
    live: false,
  },
  {
    key: "wire",
    label: "Wire",
    sub: "Bank rails",
    icon: Building2,
    live: false,
  },
  {
    key: "remit",
    label: "Remittance",
    sub: "Cross-border",
    icon: Send,
    live: false,
  },
  {
    key: "arb",
    label: "Arbitrage",
    sub: "Cross-venue",
    icon: Flame,
    live: true,
  },
];

const PAIRS: { key: Pair; label: string; flag: string; live: boolean }[] = [
  { key: "USDT_INR", label: "USDT · INR", flag: "🇮🇳", live: true },
  { key: "USDT_AED", label: "USDT · AED", flag: "🇦🇪", live: false },
  { key: "USDT_PHP", label: "USDT · PHP", flag: "🇵🇭", live: false },
];

/* ────────── PAGE ────────── */

const QUICK_AMOUNTS_INR = [10000, 50000, 100000, 500000];
const QUICK_AMOUNTS_USDT = [100, 500, 1000, 5000];
const DEFAULTS: Record<Side, { unit: AmountUnit; amount: string }> = {
  BUY: { unit: "INR", amount: "10000" },
  SELL: { unit: "USDT", amount: "500" },
};

export default function BlipRatesApp() {
  /* state */
  const [route, setRoute] = useState<RouteKey>("p2p");
  const [pair, setPair] = useState<Pair>("USDT_INR");
  const [side, setSide] = useState<Side>("BUY");
  const [amount, setAmount] = useState<string>("10000");
  const [amountUnit, setAmountUnit] = useState<AmountUnit>("INR");
  const [results, setResults] = useState<SourceResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastFetched, setLastFetched] = useState<number | null>(null);
  const [globalRate, setGlobalRate] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const [copied, setCopied] = useState(false);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const didAutoRun = useRef(false);

  const amountNum = parseFloat(amount) || 0;
  const isBuy = side === "BUY";
  const isINR = amountUnit === "INR";
  const quickAmounts = isINR ? QUICK_AMOUNTS_INR : QUICK_AMOUNTS_USDT;
  const unitSymbol = isINR ? "₹" : "";
  const unitSuffix = isINR ? "" : "USDT";
  const amountPlaceholder = isINR ? "10,000" : "500";
  const pairIsLive = pair === "USDT_INR";

  const onSideChange = (next: Side) => {
    if (next === side) return;
    setSide(next);
    setAmountUnit(DEFAULTS[next].unit);
    setAmount(DEFAULTS[next].amount);
  };

  const onUnitChange = (next: AmountUnit) => {
    if (next === amountUnit) return;
    setAmountUnit(next);
    const defaults =
      next === "INR" ? QUICK_AMOUNTS_INR[0] : QUICK_AMOUNTS_USDT[1];
    setAmount(String(defaults));
  };

  const onAmountInput = (v: string) => {
    const cleaned = v.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
    setAmount(cleaned);
  };

  const runSearch = useCallback(async () => {
    if (!pairIsLive) return;
    setLoading(true);
    const [settled, g] = await Promise.all([
      Promise.allSettled(SOURCES.map((s) => s.fetch(side))),
      fetchGlobalUsdtInr(),
    ]);
    const out: SourceResult[] = settled.map((r, i) => {
      if (r.status === "fulfilled") {
        return { source: SOURCES[i].name, ok: true, quotes: r.value };
      }
      return {
        source: SOURCES[i].name,
        ok: false,
        quotes: [],
        error: String(r.reason),
      };
    });
    setResults(out);
    if (g != null) setGlobalRate(g);
    setLastFetched(Date.now());
    setLoading(false);
  }, [side, pairIsLive]);

  // Auto-fetch on first mount
  useEffect(() => {
    if (didAutoRun.current) return;
    didAutoRun.current = true;
    runSearch();
  }, [runSearch]);

  // Re-fetch when side changes
  useEffect(() => {
    if (!didAutoRun.current) return;
    runSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [side]);

  // Tick "updated Xs ago"
  useEffect(() => {
    if (!lastFetched) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [lastFetched]);

  // Keyboard shortcuts: B = Buy, S = Sell, R = Refresh, 1..5 = routes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        (e.target as HTMLElement | null)?.tagName === "INPUT" ||
        (e.target as HTMLElement | null)?.tagName === "TEXTAREA"
      )
        return;
      if (e.key === "b" || e.key === "B") setSide("BUY");
      else if (e.key === "s" || e.key === "S") setSide("SELL");
      else if (e.key === "r" || e.key === "R") runSearch();
      else if (["1", "2", "3", "4", "5"].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        const r = ROUTES[idx];
        if (r) setRoute(r.key);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [runSearch]);

  /* ranked listings (for P2P + arbitrage) */
  const ranked = useMemo(() => {
    const all = results.flatMap((r) => r.quotes).filter((q) => q.price > 0);
    if (all.length === 0) return [];
    const sortedPrices = [...all.map((q) => q.price)].sort((a, b) => a - b);
    const medianPrice = sortedPrices[Math.floor(sortedPrices.length / 2)];
    const inrAmount = isINR ? amountNum : amountNum * medianPrice;
    const viable = all.filter((q) => {
      if (inrAmount > 0) {
        if (q.minINR > inrAmount) return false;
        if (q.maxINR > 0 && q.maxINR < inrAmount) return false;
      }
      return Math.abs(q.price - medianPrice) / medianPrice <= 0.05;
    });
    viable.sort((a, b) => (isBuy ? a.price - b.price : b.price - a.price));
    return viable;
  }, [results, amountNum, isBuy, isINR]);

  const best = ranked[0];
  const worst = ranked[ranked.length - 1];
  const spread = best && worst ? Math.abs(worst.price - best.price) : 0;
  const spreadPct = best && worst ? (spread / best.price) * 100 : 0;
  const premiumPct =
    best && globalRate ? ((best.price - globalRate) / globalRate) * 100 : null;

  const secondsAgo = lastFetched
    ? Math.max(0, Math.floor((now - lastFetched) / 1000))
    : 0;

  /* per-exchange best for arbitrage */
  const perSourceBest = useMemo(() => {
    const map = new Map<string, Quote>();
    for (const r of results) {
      for (const q of r.quotes) {
        const cur = map.get(q.source);
        if (!cur) map.set(q.source, q);
        else {
          if (isBuy && q.price < cur.price) map.set(q.source, q);
          else if (!isBuy && q.price > cur.price) map.set(q.source, q);
        }
      }
    }
    return Array.from(map.values()).sort((a, b) =>
      isBuy ? a.price - b.price : b.price - a.price,
    );
  }, [results, isBuy]);

  /* ticker items — mix of live best + synthetic placeholders */
  const tickerItems: TickerItem[] = useMemo(() => {
    const items: TickerItem[] = [];
    if (best) {
      items.push({
        pair: "USDT/INR",
        price: best.price,
        delta: premiumPct ?? 0,
        highlight: true,
      });
    }
    if (globalRate)
      items.push({ pair: "USDT/INR·GLOBAL", price: globalRate, delta: 0 });
    // illustrative secondary feeds (stable placeholders)
    items.push({ pair: "USDT/AED", price: 3.672, delta: 0.02 });
    items.push({ pair: "USDT/PHP", price: 58.42, delta: -0.15 });
    items.push({ pair: "USD/INR", price: 83.46, delta: 0.08 });
    items.push({ pair: "BTC/USD", price: 97324, delta: 1.42 });
    items.push({ pair: "ETH/USD", price: 3456, delta: -0.72 });
    items.push({ pair: "SOL/USD", price: 184.6, delta: 2.1 });
    items.push({ pair: "AED/INR", price: 22.71, delta: 0.04 });
    return items;
  }, [best, globalRate, premiumPct]);

  const shareText = best
    ? `USDT/INR is ₹${best.price.toFixed(2)} on ${best.source}${
        premiumPct != null
          ? ` · ${premiumPct >= 0 ? "+" : ""}${premiumPct.toFixed(1)}% vs global`
          : ""
      } — blip.money/rates`
    : "";

  const copyRate = async () => {
    if (!shareText) return;
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  const toggleWatch = (key: string) => {
    setWatchlist((w) =>
      w.includes(key) ? w.filter((k) => k !== key) : [...w, key],
    );
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch();
  };

  return (
    <>
      <SEO
        title="Blip Rates — Live USDT, Cash & Wire Prices · Built like an app"
        description="The real USD/USDT to INR, AED, and PHP market price across P2P, OTC cash, wires and remittance. One terminal. Live. No login."
        canonical="https://blip.money/rates"
        keywords="usdt inr rate, usdt aed rate, usdt php, p2p rate, otc rate, wire rate, cash rate, arbitrage"
      />

      <main className="min-h-screen bg-[#FAF8F5] text-black">
        {/* ════════════ DARK APP CHROME ════════════ */}
        <section className="relative bg-black text-white overflow-hidden">
          {/* glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(80% 60% at 20% 0%, rgba(255,107,53,0.18) 0%, rgba(0,0,0,0) 60%), radial-gradient(70% 50% at 90% 10%, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0) 60%)",
            }}
          />
          {/* grid */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* TICKER */}
          <TickerTape items={tickerItems} />

          {/* HERO */}
          <div className="relative max-w-6xl mx-auto px-5 md:px-8 pt-8 md:pt-10">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="relative flex h-2 w-2"
                >
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff6b35] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff6b35]" />
                </motion.span>
                <span className="text-[11px] uppercase tracking-[0.22em] text-white/50 font-semibold">
                  Live · {SOURCES.length} venues
                </span>
                <span className="hidden md:inline text-[11px] text-white/30">
                  · Updated {lastFetched ? `${secondsAgo}s ago` : "just now"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Kbd>B</Kbd>
                <span className="text-[10px] text-white/40">Buy</span>
                <Kbd>S</Kbd>
                <span className="text-[10px] text-white/40">Sell</span>
                <Kbd>R</Kbd>
                <span className="text-[10px] text-white/40">Refresh</span>
              </div>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 font-black tracking-tight"
              style={{
                fontSize: "clamp(2.6rem, 6.5vw, 5rem)",
                letterSpacing: "-0.055em",
                lineHeight: 0.95,
              }}
            >
              Blip <span className="text-[#ff6b35]">Rates</span>
              <span className="ml-3 align-middle text-[11px] md:text-[12px] uppercase tracking-[0.22em] text-white/40 font-semibold">
                v1 · terminal
              </span>
            </motion.h1>
            <p className="mt-3 text-white/50 max-w-2xl text-sm md:text-base">
              One terminal for every way dollars cross borders. P2P, cash,
              wire, remittance — priced in real time, ranked by cheapest
              execution.
            </p>

            {/* PAIR TABS */}
            <div className="mt-7 flex items-center gap-2 overflow-x-auto no-scrollbar -mx-2 px-2">
              {PAIRS.map((p) => {
                const active = pair === p.key;
                return (
                  <button
                    key={p.key}
                    onClick={() => setPair(p.key)}
                    className={`flex items-center gap-2 shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      active
                        ? "bg-white text-black border-white"
                        : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <span className="text-base leading-none">{p.flag}</span>
                    <span>{p.label}</span>
                    {!p.live && (
                      <span
                        className={`text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded ${
                          active
                            ? "bg-black/10 text-black/50"
                            : "bg-[#ff6b35]/20 text-[#ff6b35]"
                        }`}
                      >
                        Soon
                      </span>
                    )}
                  </button>
                );
              })}
              <button
                onClick={() => toggleWatch(pair)}
                className={`ml-2 flex items-center gap-1 shrink-0 rounded-full border px-3 py-2 text-xs font-semibold transition ${
                  watchlist.includes(pair)
                    ? "bg-[#ff6b35]/15 border-[#ff6b35]/40 text-[#ff6b35]"
                    : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                }`}
                title="Add to watchlist"
              >
                <Star
                  size={12}
                  className={watchlist.includes(pair) ? "fill-[#ff6b35]" : ""}
                />
                {watchlist.includes(pair) ? "Watching" : "Watch"}
              </button>
            </div>

            {/* ROUTE TABS */}
            <div className="mt-4 border-t border-white/5 pt-4">
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar -mx-2 px-2">
                {ROUTES.map((r, idx) => {
                  const Icon = r.icon;
                  const active = route === r.key;
                  return (
                    <button
                      key={r.key}
                      onClick={() => setRoute(r.key)}
                      className={`relative flex items-center gap-2 shrink-0 px-4 py-2.5 rounded-t-lg text-sm font-semibold transition ${
                        active
                          ? "text-white bg-white/[0.06]"
                          : "text-white/50 hover:text-white/80"
                      }`}
                    >
                      <Icon size={15} />
                      <span>{r.label}</span>
                      <span className="hidden md:inline text-[10px] text-white/30 font-medium">
                        {r.sub}
                      </span>
                      {!r.live && (
                        <span className="text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-white/10 text-white/50">
                          Soon
                        </span>
                      )}
                      <span className="text-[9px] ml-1 text-white/25">
                        {idx + 1}
                      </span>
                      {active && (
                        <motion.span
                          layoutId="route-underline"
                          className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#ff6b35] rounded-full"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SEARCH BAR */}
            <form
              onSubmit={onSubmit}
              className="relative mt-5 mb-7 rounded-[22px] border border-white/10 bg-white/[0.03] backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 px-4 md:px-5 py-3.5">
                {/* side toggle */}
                <div className="inline-flex items-center p-0.5 rounded-full bg-black/40 border border-white/10 shrink-0">
                  {(["BUY", "SELL"] as Side[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => onSideChange(s)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition ${
                        side === s
                          ? s === "BUY"
                            ? "bg-emerald-500 text-black"
                            : "bg-rose-500 text-black"
                          : "text-white/50"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {unitSymbol && (
                  <span
                    className="font-bold tabular-nums shrink-0"
                    style={{
                      fontSize: "clamp(1.1rem, 2vw, 1.35rem)",
                      color: "rgba(255,255,255,0.35)",
                    }}
                  >
                    {unitSymbol}
                  </span>
                )}

                <input
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  value={amount}
                  onChange={(e) => onAmountInput(e.target.value)}
                  placeholder={amountPlaceholder}
                  aria-label={`Amount in ${amountUnit}`}
                  className="flex-1 bg-transparent outline-none text-white font-bold tabular-nums placeholder:text-white/20 min-w-0"
                  style={{
                    fontSize: "clamp(1.1rem, 2vw, 1.35rem)",
                    letterSpacing: "-0.02em",
                    caretColor: "#ff6b35",
                  }}
                />

                {unitSuffix && (
                  <span className="font-bold text-white/30 shrink-0 text-sm">
                    {unitSuffix}
                  </span>
                )}

                <div className="hidden md:flex items-center p-0.5 rounded-full bg-black/40 border border-white/10 shrink-0">
                  {(["INR", "USDT"] as AmountUnit[]).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => onUnitChange(u)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition ${
                        amountUnit === u
                          ? "bg-white text-black"
                          : "text-white/50"
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading || !pairIsLive}
                  className="shrink-0 rounded-full font-semibold transition hover:brightness-110 active:scale-95 disabled:opacity-50 w-11 h-11 flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, #ff6b35 0%, #ff8c50 100%)",
                    color: "#000",
                    boxShadow: "0 10px 30px rgba(255,107,53,0.35)",
                  }}
                  aria-label="Search"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Search size={18} strokeWidth={2.7} />
                  )}
                </button>
              </div>
              {/* quick amounts */}
              <div className="flex flex-wrap gap-1.5 px-4 md:px-5 pb-3 border-t border-white/5 pt-3">
                {quickAmounts.map((v) => {
                  const active = parseFloat(amount) === v;
                  const label = isINR
                    ? "₹" + v.toLocaleString("en-IN")
                    : v.toLocaleString("en-IN") + " USDT";
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setAmount(String(v))}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition ${
                        active
                          ? "bg-white text-black"
                          : "bg-white/5 text-white/60 hover:bg-white/10"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </form>
          </div>
        </section>

        {/* ════════════ CONTENT AREA ════════════ */}
        <section className="max-w-6xl mx-auto px-5 md:px-8 py-10 md:py-14">
          <AnimatePresence mode="wait">
            {route === "p2p" && (
              <motion.div
                key="p2p"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {!pairIsLive ? (
                  <SoonCard pair={pair} />
                ) : (
                  <P2PView
                    loading={loading}
                    ranked={ranked}
                    best={best}
                    globalRate={globalRate}
                    premiumPct={premiumPct}
                    spread={spread}
                    spreadPct={spreadPct}
                    side={side}
                    amountNum={amountNum}
                    results={results}
                    secondsAgo={secondsAgo}
                    shareText={shareText}
                    copied={copied}
                    onCopy={copyRate}
                    onRefresh={runSearch}
                  />
                )}
              </motion.div>
            )}

            {route === "cash" && (
              <motion.div
                key="cash"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <StubRoute
                  icon={Banknote}
                  title="Cash — OTC desks"
                  description="Live quotes from OTC desks in Dubai, Mumbai and Manila. Hand-to-hand pricing for $10k — $10M. Settlement windows, escrow status, and minimum tickets."
                  bullets={[
                    "Dubai USDT/AED cash desks",
                    "Mumbai hawala-grade USDT/INR OTC",
                    "Manila peso cash desks",
                    "Minimum ticket, settlement window, KYC level",
                  ]}
                />
              </motion.div>
            )}

            {route === "wire" && (
              <motion.div
                key="wire"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <StubRoute
                  icon={Building2}
                  title="Wire — Bank rails"
                  description="SWIFT, SEPA, IMPS and Fedwire rates compared across banks and fintech rails. Includes correspondent fees, FX spread, and expected arrival time."
                  bullets={[
                    "USD → INR (wire, IMPS, UPI settle-back)",
                    "USD → AED (SWIFT, local ACH)",
                    "EUR → USD (SEPA, FX spreads)",
                    "All-in cost including correspondent fees",
                  ]}
                />
              </motion.div>
            )}

            {route === "remit" && (
              <motion.div
                key="remit"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <StubRoute
                  icon={Send}
                  title="Remittance — Cross-border"
                  description="Wise, Remitly, Western Union, MoneyGram, Revolut — all priced head-to-head. See what $1,000 lands as in each corridor in real time."
                  bullets={[
                    "Corridor-aware pricing ($1k / $5k / $10k)",
                    "Speed: instant, same-day, 2–3 business days",
                    "Pay-in and pay-out method matrix",
                    "Promo codes and first-transfer discounts",
                  ]}
                />
              </motion.div>
            )}

            {route === "arb" && (
              <motion.div
                key="arb"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {!pairIsLive ? (
                  <SoonCard pair={pair} />
                ) : (
                  <ArbitrageView
                    perSource={perSourceBest}
                    globalRate={globalRate}
                    loading={loading}
                    side={side}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </>
  );
}

/* ════════════ P2P VIEW ════════════ */

function P2PView({
  loading,
  ranked,
  best,
  globalRate,
  premiumPct,
  spread,
  spreadPct,
  side,
  amountNum,
  results,
  secondsAgo,
  shareText,
  copied,
  onCopy,
  onRefresh,
}: {
  loading: boolean;
  ranked: Quote[];
  best: Quote | undefined;
  globalRate: number | null;
  premiumPct: number | null;
  spread: number;
  spreadPct: number;
  side: Side;
  amountNum: number;
  results: SourceResult[];
  secondsAgo: number;
  shareText: string;
  copied: boolean;
  onCopy: () => void;
  onRefresh: () => void;
}) {
  const isBuy = side === "BUY";

  if (loading && ranked.length === 0) {
    return (
      <div className="py-16 text-center text-black/50">
        <Loader2
          size={28}
          className="animate-spin mx-auto mb-3 text-[#ff6b35]"
        />
        Scanning {results.length || 5} venues…
      </div>
    );
  }

  if (ranked.length === 0) {
    return (
      <div className="rounded-3xl bg-white border border-black/[0.08] p-10 text-center">
        <p className="text-black/60">
          No listings found. Try a different amount.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* HEADLINE STRIP */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4 mb-6">
        {/* Best rate hero */}
        <motion.div
          layout
          className="relative rounded-3xl overflow-hidden bg-white border border-black/[0.08]"
          style={{ boxShadow: "0 20px 50px -30px rgba(255,107,53,0.35)" }}
        >
          <div
            aria-hidden
            className="absolute -top-20 -right-10 h-60 w-60 rounded-full blur-3xl"
            style={{ background: "rgba(255,107,53,0.18)" }}
          />
          <div className="relative p-6 md:p-8">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] font-bold text-black/40">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff6b35] opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#ff6b35]" />
              </span>
              Best {isBuy ? "buy" : "sell"} rate
            </div>
            <div className="mt-3 flex items-baseline gap-3 flex-wrap">
              <div
                className="font-black tabular-nums"
                style={{
                  fontSize: "clamp(2.4rem, 5.5vw, 3.75rem)",
                  letterSpacing: "-0.045em",
                  lineHeight: 0.95,
                }}
              >
                ₹<AnimatedPrice value={best!.price} />
              </div>
              <span className="text-sm font-semibold text-black/40">
                / USDT
              </span>
              {premiumPct != null && (
                <span
                  className={`ml-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    premiumPct >= 0
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {premiumPct >= 0 ? (
                    <ArrowUpRight size={12} />
                  ) : (
                    <ArrowDownRight size={12} />
                  )}
                  {premiumPct >= 0 ? "+" : ""}
                  {premiumPct.toFixed(2)}% vs global
                </span>
              )}
            </div>
            <div className="mt-2 text-sm text-black/60">
              On <b className="text-black">{best!.source}</b> — you{" "}
              {isBuy ? "get" : "receive"}{" "}
              <b className="text-black tabular-nums">
                {isBuy
                  ? (amountNum / best!.price).toFixed(2) + " USDT"
                  : "₹" +
                    (amountNum * best!.price).toLocaleString("en-IN", {
                      maximumFractionDigits: 0,
                    })}
              </b>
            </div>
            <div className="mt-1 text-xs text-black/40">
              ₹{spread.toFixed(2)} spread · {spreadPct.toFixed(2)}% across{" "}
              {ranked.length} listings · updated {secondsAgo}s ago
            </div>

            <div className="mt-5 flex items-center gap-2 flex-wrap">
              <a
                href={best!.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-black text-white text-xs font-bold px-4 py-2 hover:bg-black/80 transition"
              >
                Trade on {best!.source}
                <ExternalLink size={12} />
              </a>
              <button
                onClick={onCopy}
                className="inline-flex items-center gap-1.5 rounded-full bg-black/[0.05] text-black/70 text-xs font-semibold px-3 py-2 hover:bg-black/10 transition"
              >
                {copied ? (
                  <>
                    <Check size={12} /> Copied
                  </>
                ) : (
                  <>
                    <Copy size={12} /> Copy
                  </>
                )}
              </button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-black/[0.05] text-black/70 text-xs font-semibold px-3 py-2 hover:bg-black/10 transition"
              >
                WhatsApp
              </a>
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(
                  "https://blip.money/rates",
                )}&text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-black/[0.05] text-black/70 text-xs font-semibold px-3 py-2 hover:bg-black/10 transition"
              >
                Telegram
              </a>
              <button
                onClick={onRefresh}
                className="ml-auto inline-flex items-center gap-1 text-[11px] text-black/40 hover:text-black px-2 py-1"
              >
                <RefreshCw size={11} /> Refresh
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stat tiles */}
        <div className="grid grid-cols-3 gap-3">
          <StatTile
            label="Global"
            value={globalRate ? `₹${globalRate.toFixed(2)}` : "—"}
            icon={Globe2}
          />
          <StatTile
            label="Spread"
            value={`₹${spread.toFixed(2)}`}
            hint={`${spreadPct.toFixed(2)}%`}
            icon={Activity}
          />
          <StatTile
            label="Venues"
            value={`${results.filter((r) => r.ok && r.quotes.length).length}/${
              results.length
            }`}
            icon={Radio}
          />
          <ArbTeaser best={best!.price} worst={ranked[ranked.length - 1].price} />
        </div>
      </div>

      {/* LISTINGS */}
      <div className="rounded-3xl overflow-hidden bg-white border border-black/[0.08]">
        <div className="hidden md:grid grid-cols-[1fr_110px_130px_1.3fr_110px] gap-4 px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-black/40 bg-black/[0.03] border-b border-black/[0.05]">
          <div>Venue</div>
          <div className="text-right">Price</div>
          <div className="text-right">You {isBuy ? "get" : "receive"}</div>
          <div>Merchant</div>
          <div className="text-right">Go</div>
        </div>
        {ranked.slice(0, 15).map((q, i) => {
          const youGet = isBuy
            ? (amountNum / q.price).toFixed(2) + " USDT"
            : "₹" +
              (amountNum * q.price).toLocaleString("en-IN", {
                maximumFractionDigits: 0,
              });
          const diff = ((q.price - best!.price) / best!.price) * 100;
          const isTop = i === 0;
          return (
            <motion.div
              key={`${q.source}-${q.merchant}-${i}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className="relative grid grid-cols-[1fr_auto] md:grid-cols-[1fr_110px_130px_1.3fr_110px] gap-x-4 gap-y-1 px-6 py-3.5 items-center"
              style={{
                background: isTop ? "rgba(255,107,53,0.04)" : "transparent",
                borderBottom:
                  i === Math.min(ranked.length, 15) - 1
                    ? "none"
                    : "1px solid rgba(0,0,0,0.04)",
              }}
            >
              {isTop && (
                <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#ff6b35]" />
              )}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black shrink-0 ${
                    isTop ? "bg-black text-white" : "bg-black/[0.05] text-black"
                  }`}
                >
                  {q.source.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-sm truncate">{q.source}</div>
                  {isTop ? (
                    <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-[#ff6b35]">
                      <Sparkles size={10} /> Cheapest
                    </div>
                  ) : (
                    <div className="text-[10px] text-black/40">
                      #{i + 1} · {q.payments.slice(0, 2).join(" · ") || "P2P"}
                    </div>
                  )}
                </div>
              </div>

              <div className="md:text-right">
                <div className="font-bold text-base tabular-nums">
                  ₹<AnimatedPrice value={q.price} />
                </div>
                {i > 0 && (
                  <div className="text-[11px] text-rose-500 tabular-nums">
                    +{diff.toFixed(2)}%
                  </div>
                )}
              </div>

              <div className="hidden md:block md:text-right text-sm font-semibold tabular-nums text-black/70">
                {youGet}
              </div>

              <div className="hidden md:block min-w-0">
                <div className="text-sm font-medium truncate">{q.merchant}</div>
                <div className="text-[11px] text-black/40">
                  {q.completionRate != null &&
                    `${(q.completionRate * 100).toFixed(1)}% · `}
                  {q.orders != null && `${q.orders} orders`}
                </div>
              </div>

              <div className="md:text-right">
                <a
                  href={q.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1 rounded-full text-[11px] font-bold px-3 py-1.5 transition ${
                    isTop
                      ? "bg-black text-white hover:bg-black/80"
                      : "bg-white border border-black/[0.08] text-black hover:bg-black/[0.04]"
                  }`}
                >
                  Trade
                  <ArrowRight size={11} />
                </a>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* VENUES STATUS */}
      <div className="mt-5 flex flex-wrap items-center gap-3 text-[11px] text-black/40">
        {results.map((r) => (
          <span key={r.source} className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background:
                  r.ok && r.quotes.length > 0 ? "#10b981" : "#ef4444",
              }}
            />
            {r.source}
            <span className="text-black/30">
              {r.ok ? `· ${r.quotes.length}` : "· down"}
            </span>
          </span>
        ))}
      </div>
    </>
  );
}

/* ════════════ ARBITRAGE VIEW ════════════ */

function ArbitrageView({
  perSource,
  globalRate,
  loading,
  side,
}: {
  perSource: Quote[];
  globalRate: number | null;
  loading: boolean;
  side: Side;
}) {
  if (loading && perSource.length === 0) {
    return (
      <div className="py-16 text-center text-black/50">
        <Loader2
          size={28}
          className="animate-spin mx-auto mb-3 text-[#ff6b35]"
        />
        Scanning arbitrage windows…
      </div>
    );
  }

  if (perSource.length < 2) {
    return (
      <div className="rounded-3xl bg-white border border-black/[0.08] p-10 text-center text-black/50">
        Not enough venues to arb right now. Try again in a moment.
      </div>
    );
  }

  const cheapest = perSource[0];
  const priciest = perSource[perSource.length - 1];
  const spread = Math.abs(priciest.price - cheapest.price);
  const pct = (spread / cheapest.price) * 100;

  // Construct buy-low/sell-high pairs
  const pairs: {
    buy: Quote;
    sell: Quote;
    spread: number;
    pct: number;
  }[] = [];
  for (let i = 0; i < perSource.length; i++) {
    for (let j = 0; j < perSource.length; j++) {
      if (i === j) continue;
      const a = perSource[i];
      const b = perSource[j];
      if (b.price > a.price) {
        pairs.push({
          buy: a,
          sell: b,
          spread: b.price - a.price,
          pct: ((b.price - a.price) / a.price) * 100,
        });
      }
    }
  }
  pairs.sort((a, b) => b.pct - a.pct);
  const top = pairs.slice(0, 5);

  return (
    <>
      {/* HEADLINE */}
      <div className="rounded-3xl overflow-hidden bg-white border border-black/[0.08] mb-6">
        <div
          className="p-6 md:p-8 relative"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,107,53,0.08) 0%, rgba(255,255,255,0) 60%)",
          }}
        >
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] font-bold text-black/40">
            <Flame size={12} className="text-[#ff6b35]" />
            Top arbitrage window
          </div>
          <div className="mt-3 flex items-baseline gap-3 flex-wrap">
            <div
              className="font-black tabular-nums"
              style={{
                fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
                letterSpacing: "-0.04em",
              }}
            >
              {pct.toFixed(2)}%
            </div>
            <span className="text-sm font-semibold text-black/40">
              ≈ ₹{spread.toFixed(2)} per USDT
            </span>
          </div>
          <div className="mt-3 flex items-center gap-3 text-sm flex-wrap">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 font-bold">
              Buy {cheapest.source} · ₹{cheapest.price.toFixed(2)}
            </span>
            <ArrowRight size={14} className="text-black/30" />
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 text-rose-700 px-3 py-1 font-bold">
              Sell {priciest.source} · ₹{priciest.price.toFixed(2)}
            </span>
          </div>
          <div className="mt-2 text-xs text-black/40">
            On a ₹100,000 trade that's ≈ ₹
            {((spread / cheapest.price) * 100000).toFixed(0)} gross — before
            fees, slippage and escrow time.
          </div>
        </div>
      </div>

      {/* OPPORTUNITY LIST */}
      <div className="rounded-3xl overflow-hidden bg-white border border-black/[0.08]">
        <div className="hidden md:grid grid-cols-[1fr_1fr_130px_130px] gap-4 px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-black/40 bg-black/[0.03] border-b border-black/[0.05]">
          <div>Buy on</div>
          <div>Sell on</div>
          <div className="text-right">Spread</div>
          <div className="text-right">Edge</div>
        </div>
        {top.map((p, i) => (
          <motion.div
            key={`${p.buy.source}-${p.sell.source}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="grid grid-cols-2 md:grid-cols-[1fr_1fr_130px_130px] gap-x-4 gap-y-2 px-6 py-4 items-center"
            style={{
              borderBottom:
                i === top.length - 1 ? "none" : "1px solid rgba(0,0,0,0.04)",
              background: i === 0 ? "rgba(255,107,53,0.04)" : "transparent",
            }}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black">
                {p.buy.source.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-bold">{p.buy.source}</div>
                <div className="text-[11px] tabular-nums text-black/50">
                  ₹{p.buy.price.toFixed(2)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-black">
                {p.sell.source.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-bold">{p.sell.source}</div>
                <div className="text-[11px] tabular-nums text-black/50">
                  ₹{p.sell.price.toFixed(2)}
                </div>
              </div>
            </div>
            <div className="md:text-right text-sm font-bold tabular-nums">
              ₹{p.spread.toFixed(2)}
            </div>
            <div className="md:text-right">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#ff6b35]/15 text-[#ff6b35] px-2.5 py-1 text-xs font-black tabular-nums">
                +{p.pct.toFixed(2)}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {globalRate && (
        <div className="mt-5 text-[11px] text-black/40">
          Reference: global spot ₹{globalRate.toFixed(2)}. Arb windows close
          fast — rates refresh every time you hit R.
        </div>
      )}
    </>
  );
}

/* ════════════ HELPER COMPONENTS ════════════ */

function StatTile({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-2xl bg-white border border-black/[0.08] p-4 flex flex-col">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-black/40">
        <Icon size={11} /> {label}
      </div>
      <div className="mt-1.5 font-black tabular-nums text-lg leading-tight">
        {value}
      </div>
      {hint && <div className="text-[10px] text-black/40 mt-0.5">{hint}</div>}
    </div>
  );
}

function ArbTeaser({ best, worst }: { best: number; worst: number }) {
  const pct = ((worst - best) / best) * 100;
  return (
    <div
      className="rounded-2xl p-4 flex flex-col text-white relative overflow-hidden col-span-3 md:col-span-3"
      style={{
        background:
          "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 60%, #ff6b35 260%)",
      }}
    >
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-white/50">
        <Flame size={11} className="text-[#ff6b35]" /> Arbitrage edge
      </div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-lg font-black tabular-nums text-[#ff6b35]">
          +{pct.toFixed(2)}%
        </span>
        <span className="text-[11px] text-white/50">
          cheapest → priciest venue
        </span>
      </div>
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-white/70">
      {children}
    </kbd>
  );
}

function SoonCard({ pair }: { pair: Pair }) {
  const info = PAIRS.find((p) => p.key === pair);
  return (
    <div
      className="rounded-3xl bg-white border border-black/[0.08] p-10 text-center relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #fff 0%, rgba(255,107,53,0.05) 100%)",
      }}
    >
      <div className="text-4xl mb-3">{info?.flag}</div>
      <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-2">
        {info?.label} · coming soon
      </h3>
      <p className="text-black/50 max-w-xl mx-auto text-sm">
        We're wiring up live feeds for this corridor. Drop your email and we'll
        ping you the day rates light up.
      </p>
      <button className="mt-6 inline-flex items-center gap-2 rounded-full bg-black text-white text-sm font-bold px-5 py-2.5 hover:bg-black/80 transition">
        <BellRing size={14} /> Notify me
      </button>
    </div>
  );
}

function StubRoute({
  icon: Icon,
  title,
  description,
  bullets,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  bullets: string[];
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-4">
      <div
        className="rounded-3xl bg-white border border-black/[0.08] p-8 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #fff 0%, rgba(255,107,53,0.06) 120%)",
        }}
      >
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-black text-white mb-5">
          <Icon size={22} />
        </div>
        <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-3">
          {title}
        </h3>
        <p className="text-black/60 text-sm md:text-base leading-relaxed">
          {description}
        </p>
        <div className="mt-6 flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-full bg-black text-white text-sm font-bold px-5 py-2.5 hover:bg-black/80 transition">
            <BellRing size={14} /> Notify me when live
          </button>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#ff6b35]/15 text-[#ff6b35] px-2.5 py-1 text-[11px] font-black uppercase tracking-wider">
            <LineChart size={10} /> in build
          </span>
        </div>
      </div>
      <div className="rounded-3xl bg-white border border-black/[0.08] p-8">
        <div className="text-[11px] uppercase tracking-[0.22em] font-bold text-black/40 mb-4">
          What's shipping
        </div>
        <ul className="space-y-3">
          {bullets.map((b, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-sm text-black/70"
            >
              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ff6b35]/15 text-[#ff6b35] text-[11px] font-black">
                {i + 1}
              </span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 pt-6 border-t border-black/[0.06] text-xs text-black/40">
          Rates you see elsewhere are out of date the moment you screenshot
          them. Blip keeps the terminal honest — every tab, every corridor,
          every refresh.
        </div>
      </div>
    </div>
  );
}
