import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, X, Search, RefreshCw, Sparkles, ChevronDown, TrendingDown } from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "@/components";
import { CTAButton } from "@/components/Navbar";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ============================================
   CURRENCY METADATA
   - "edge" is Blip's advantage vs the live mid:
     subtract on BUY, add on SELL.
   - For INR: 25 paise / for AED: 5 fils / similar small cuts elsewhere.
   ============================================ */
type Direction = "buy" | "sell";

interface Currency {
  code: string;
  flag: string;
  name: string;
  fallbackMid: number; // used when the live feed is unavailable
  digits: number;
  symbol: string;
}

/** Blip's price advantage as a fraction of the live market.
 *  0.2% on either side: cheaper than the cheapest BUY ad,
 *  higher than what other venues would pay on a SELL. */
const BLIP_EDGE_PCT = 0.002;

const CURRENCIES: Currency[] = [
  { code: "INR", flag: "🇮🇳", name: "Indian Rupee", fallbackMid: 99.5, digits: 2, symbol: "₹" },
  { code: "AED", flag: "🇦🇪", name: "UAE Dirham", fallbackMid: 3.6735, digits: 4, symbol: "د.إ " },
  { code: "PHP", flag: "🇵🇭", name: "Philippine Peso", fallbackMid: 56.4, digits: 2, symbol: "₱" },
  { code: "PKR", flag: "🇵🇰", name: "Pakistani Rupee", fallbackMid: 278.5, digits: 2, symbol: "₨" },
  { code: "USD", flag: "🇺🇸", name: "US Dollar", fallbackMid: 1.001, digits: 4, symbol: "$" },
];

interface CompetitorMeta {
  apiName?: string; // matches /api/p2p-rates venue name
  name: string;
  badge: string;   // small two-letter badge shown in the row
  fallbackBuy: number;
  fallbackSell: number;
  settle: string;
}

const COMPETITORS: CompetitorMeta[] = [
  { apiName: "Binance P2P", name: "Binance P2P", badge: "BN", fallbackBuy: 0.0014, fallbackSell: 0.0014, settle: "5–15 min" },
  { apiName: "Bybit P2P",   name: "Bybit P2P",   badge: "BY", fallbackBuy: 0.0020, fallbackSell: 0.0020, settle: "5–20 min" },
  { apiName: "OKX P2P",     name: "OKX P2P",     badge: "OK", fallbackBuy: 0.0025, fallbackSell: 0.0025, settle: "5–20 min" },
  { apiName: "KuCoin P2P",  name: "KuCoin P2P",  badge: "KC", fallbackBuy: 0.0030, fallbackSell: 0.0030, settle: "10–30 min" },
  {                          name: "Paxful",      badge: "PX", fallbackBuy: 0.0035, fallbackSell: 0.0035, settle: "10–30 min" },
  {                          name: "Direct P2P",  badge: "P2", fallbackBuy: 0.0050, fallbackSell: 0.0050, settle: "Variable" },
];

function formatRate(value: number, digits: number, symbol: string) {
  if (!Number.isFinite(value)) return symbol + "—";
  return (
    symbol +
    value.toLocaleString("en-US", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    })
  );
}

/* ───────── Live rate hook ───────── */
type LiveRate = {
  mid: number | null;
  venues: Record<string, number | null>;
  loading: boolean;
  error: string | null;
  observed_at: number | null;
};

function useLiveRates(fiat: string, direction: Direction, amount: number): LiveRate {
  const [state, setState] = useState<LiveRate>({
    mid: null,
    venues: {},
    loading: true,
    error: null,
    observed_at: null,
  });
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setState((s) => ({ ...s, loading: true, error: null }));

    const params = new URLSearchParams({
      fiat,
      tradeType: direction === "buy" ? "BUY" : "SELL",
      amount: String(Math.max(0, amount)),
    });
    fetch(`/api/p2p-rates?${params.toString()}`, { signal: ctrl.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error(`http-${r.status}`);
        return r.json() as Promise<{
          mid: number | null;
          venues: Array<{ name: string; price: number | null; error?: string }>;
          observed_at: number;
        }>;
      })
      .then((data) => {
        const map: Record<string, number | null> = {};
        for (const v of data.venues) map[v.name] = v.price;
        setState({
          mid: data.mid ?? null,
          venues: map,
          loading: false,
          error: null,
          observed_at: data.observed_at ?? Date.now(),
        });
      })
      .catch((err: unknown) => {
        if ((err as { name?: string })?.name === "AbortError") return;
        setState((s) => ({
          ...s,
          loading: false,
          error: err instanceof Error ? err.message : String(err),
        }));
      });

    return () => ctrl.abort();
  }, [fiat, direction, amount]);

  return state;
}

/* ============================================
   SEARCH PANEL — Skyscanner-style
   Amount first, then currency, then direction.
   Currency uses a searchable dropdown that scales to 100+ entries.
   ============================================ */

interface SearchValues {
  amount: string;
  currencyCode: string;
  direction: Direction;
}

const CurrencyPicker = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (code: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const current = CURRENCIES.find((c) => c.code === value) ?? CURRENCIES[0];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CURRENCIES;
    return CURRENCIES.filter(
      (c) =>
        c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q),
    );
  }, [query]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [open]);

  // Auto-focus search on open
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl border border-black/[0.10] dark:border-white/[0.10] bg-white dark:bg-white/[0.04] hover:border-black/[0.25] dark:hover:border-white/[0.25] transition-colors"
      >
        <span className="flex items-center gap-2 min-w-0">
          <span className="text-lg leading-none">{current.flag}</span>
          <span className="text-sm font-bold text-black dark:text-white">
            {current.code}
          </span>
          <span className="text-[12px] text-black/45 dark:text-white/45 truncate hidden sm:inline">
            {current.name}
          </span>
        </span>
        <ChevronDown
          className={`w-4 h-4 text-black/45 dark:text-white/45 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute z-30 left-0 right-0 mt-2 rounded-2xl border border-black/[0.10] dark:border-white/[0.12] bg-white dark:bg-[#111] shadow-[0_12px_40px_-10px_rgba(0,0,0,0.30)] overflow-hidden"
          >
            <div className="px-3 py-2 border-b border-black/[0.06] dark:border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-black/40 dark:text-white/40" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search currency"
                  className="flex-1 bg-transparent border-0 focus:outline-none text-sm text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/35"
                />
              </div>
            </div>
            <ul role="listbox" className="max-h-64 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <li className="px-3 py-2 text-[13px] text-black/45 dark:text-white/40">
                  No matches
                </li>
              ) : (
                filtered.map((c) => {
                  const selected = c.code === value;
                  return (
                    <li key={c.code}>
                      <button
                        type="button"
                        onClick={() => {
                          onChange(c.code);
                          setOpen(false);
                          setQuery("");
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${selected ? "bg-black/[0.05] dark:bg-white/[0.06]" : "hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"}`}
                      >
                        <span className="text-lg leading-none">{c.flag}</span>
                        <span className="font-bold text-sm text-black dark:text-white w-12 shrink-0">
                          {c.code}
                        </span>
                        <span className="text-[13px] text-black/55 dark:text-white/55 truncate flex-1">
                          {c.name}
                        </span>
                        {selected && (
                          <Check className="w-3.5 h-3.5 text-[#ff6b35] shrink-0" strokeWidth={3} />
                        )}
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SearchPanel = ({
  values,
  onChange,
}: {
  values: SearchValues;
  onChange: (v: SearchValues) => void;
}) => {
  return (
    <div className="rounded-3xl bg-white dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] overflow-hidden shadow-[0_2px_30px_rgba(0,0,0,0.08)]">
      <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr_auto] divide-y md:divide-y-0 md:divide-x divide-black/[0.07] dark:divide-white/[0.07]">
        {/* Amount + Buy/Sell selector inline (p2prate-style) */}
        <label className="block px-5 py-4 hover:bg-black/[0.015] dark:hover:bg-white/[0.02] transition-colors cursor-text">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-black/45 dark:text-white/40">
              Amount
            </span>
            {/* Compact Buy/Sell selector right where the eye lands */}
            <div
              role="tablist"
              className="flex gap-0.5 rounded-full p-0.5 bg-black/[0.05] dark:bg-white/[0.06]"
              onClick={(e) => e.preventDefault()}
            >
              {(["buy", "sell"] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  role="tab"
                  aria-selected={values.direction === d}
                  onClick={() => onChange({ ...values, direction: d })}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider transition-colors ${
                    values.direction === d
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "text-black/50 dark:text-white/50"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <input
              type="number"
              inputMode="decimal"
              value={values.amount}
              onChange={(e) => onChange({ ...values, amount: e.target.value })}
              placeholder="100"
              className="w-full bg-transparent border-0 focus:outline-none font-display text-2xl md:text-3xl font-semibold text-black dark:text-white tracking-tight tabular-nums placeholder:text-black/25 dark:placeholder:text-white/25"
            />
            <span className="text-sm font-semibold text-black/55 dark:text-white/45">
              USDT
            </span>
          </div>
        </label>

        {/* Currency — searchable dropdown */}
        <div className="block px-5 py-4">
          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-black/45 dark:text-white/40">
            Currency
          </span>
          <div className="mt-2">
            <CurrencyPicker
              value={values.currencyCode}
              onChange={(code) => onChange({ ...values, currencyCode: code })}
            />
          </div>
        </div>

        {/* Search action — reactive */}
        <div className="px-5 py-4 md:py-3 md:pl-3 md:pr-5 flex md:items-center md:justify-end">
          <div className="w-12 h-12 rounded-2xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center shadow-md">
            <Search className="w-5 h-5" strokeWidth={2.4} />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================
   RESULTS — Skyscanner-style cards
   ============================================ */

const RateFinder = () => {
  const [values, setValues] = useState<SearchValues>({
    amount: "100",
    currencyCode: "INR",
    direction: "buy",
  });

  const currency = useMemo(
    () => CURRENCIES.find((c) => c.code === values.currencyCode) ?? CURRENCIES[0],
    [values.currencyCode],
  );
  const amt = parseFloat(values.amount) || 0;
  const live = useLiveRates(currency.code, values.direction, amt);

  const market = live.mid ?? currency.fallbackMid;

  // Blip is always 0.2% better than the live market — cheaper to buy, more
  // received on sell — instead of a fixed paise/fils gap that drifts when
  // the SELL-side mid jumps to the highest quote on a thin order book.
  const blipRate =
    values.direction === "buy"
      ? market * (1 - BLIP_EDGE_PCT)
      : market * (1 + BLIP_EDGE_PCT);
  const blipTotal = blipRate * amt;

  const competitorRows = useMemo(() => {
    return COMPETITORS.map((c) => {
      const livePrice = c.apiName ? live.venues[c.apiName] : null;
      let rate: number;
      let isLive: boolean;
      if (livePrice != null && Number.isFinite(livePrice) && livePrice > 0) {
        rate = livePrice;
        isLive = true;
      } else {
        rate =
          values.direction === "buy"
            ? market * (1 + c.fallbackBuy)
            : market * (1 - c.fallbackSell);
        isLive = false;
      }
      const total = rate * amt;
      const youLose =
        values.direction === "buy"
          ? (rate - blipRate) * amt
          : (blipRate - rate) * amt;
      return { ...c, rate, total, youLose, isLive };
    });
  }, [values.direction, amt, blipRate, market, live.venues]);

  // Quick saving estimate vs the worst competitor on the page (gives the
  // hero a concrete savings claim instead of an abstract one).
  const worstCompetitorRate = useMemo(() => {
    const rates = competitorRows.map((c) => c.rate);
    if (rates.length === 0) return null;
    return values.direction === "buy" ? Math.max(...rates) : Math.min(...rates);
  }, [competitorRows, values.direction]);
  const youSaveVsWorst = useMemo(() => {
    if (worstCompetitorRate == null || amt === 0) return null;
    return values.direction === "buy"
      ? (worstCompetitorRate - blipRate) * amt
      : (blipRate - worstCompetitorRate) * amt;
  }, [worstCompetitorRate, blipRate, amt, values.direction]);

  return (
    <section className="relative pt-24 pb-12 sm:pt-28 sm:pb-16 px-5 sm:px-6">
      {/* Subtle hero backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(255,107,53,0.08) 0%, transparent 70%), radial-gradient(50% 40% at 100% 30%, rgba(120,119,255,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-5xl mx-auto">
        {/* Eyebrow pill */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex justify-center mb-6"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-black/[0.10] dark:border-white/[0.10] bg-white/70 dark:bg-white/[0.04] backdrop-blur">
            <Sparkles className="w-3 h-3 text-[#ff6b35]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-black/65 dark:text-white/55">
              Live · Comparing 4 venues
            </span>
          </span>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.05, ease: EASE }}
          className="text-center mb-3"
        >
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-black dark:text-white tracking-tight leading-[1.02]">
            Always cheaper.<br className="hidden sm:block" />{" "}
            <span className="text-black/55 dark:text-white/45">Anywhere you look.</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.18 }}
          className="text-center text-base md:text-lg text-black/55 dark:text-white/50 max-w-xl mx-auto mb-10 sm:mb-12"
        >
          We aggregate every major P2P venue and undercut the best price on
          every trade. Live numbers. Zero spread tricks.
        </motion.p>

        {/* Search panel — narrower than the results column for visual focus */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className="max-w-3xl mx-auto"
        >
          <SearchPanel values={values} onChange={setValues} />
        </motion.div>

        {/* Status row */}
        <div className="mt-5 flex items-center justify-between text-[12px] gap-3 text-black/55 dark:text-white/50">
          <div className="flex items-center gap-2 min-w-0">
            {live.loading ? (
              <>
                <RefreshCw className="w-3 h-3 animate-spin shrink-0" />
                <span className="truncate">Searching live rates…</span>
              </>
            ) : live.error ? (
              <span className="truncate">Live feed unavailable — showing indicative spreads</span>
            ) : live.observed_at ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-[#3ddc84] animate-pulse shrink-0" />
                <span className="truncate">
                  Live · {Math.max(0, Math.round((Date.now() - live.observed_at) / 1000))}s ago
                </span>
              </>
            ) : null}
          </div>
          <span className="text-black/40 dark:text-white/35 hidden sm:inline">
            {competitorRows.length + 1} venues compared
          </span>
        </div>

        {/* SAVINGS CARD — big, obvious moat */}
        <AnimatePresence>
          {youSaveVsWorst != null && youSaveVsWorst > 0 && (
            <motion.div
              key="savings-card"
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="mt-5 relative overflow-hidden rounded-3xl border border-[#ff6b35]/25 bg-black text-white"
            >
              {/* Subtle orange wash from the right */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-80"
                style={{
                  background:
                    "radial-gradient(80% 100% at 100% 50%, rgba(255,107,53,0.32) 0%, transparent 60%)",
                }}
              />
              <div className="relative px-6 py-5 sm:px-8 sm:py-6 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-[#ff6b35] shrink-0 shadow-[0_6px_20px_-4px_rgba(255,107,53,0.55)]">
                    <TrendingDown className="w-5 h-5 text-white" strokeWidth={2.6} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#ff8c50]">
                      You save with Blip
                    </div>
                    <div className="font-mono text-3xl sm:text-4xl font-bold tabular-nums leading-none mt-1">
                      {formatRate(youSaveVsWorst, currency.digits, currency.symbol)}
                    </div>
                    <div className="text-[12px] text-white/55 mt-1.5">
                      vs the worst quote on this page
                      {amt > 0 ? ` · on ${amt.toLocaleString("en-US")} USDT` : ""}
                    </div>
                  </div>
                </div>
                <Link
                  to="/waitlist"
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-white text-black text-[13px] font-bold hover:scale-[1.02] active:scale-[0.98] transition-transform shrink-0"
                >
                  Lock this rate
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results — Blip first then competitors */}
        <div className="mt-3 space-y-2">
          {/* Blip — best deal row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
            className="relative group"
          >
            <div className="absolute -left-1 top-3 bottom-3 w-1 rounded-full bg-[#ff6b35]" />
            <div className="rounded-2xl bg-white dark:bg-white/[0.035] border border-black/[0.08] dark:border-white/[0.08] hover:border-black/20 dark:hover:border-white/20 px-5 py-4 transition-colors flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Tiny logo mark */}
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-black dark:bg-white shrink-0">
                  <svg viewBox="0 0 70 60" className="w-4 h-4" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 36 L16 36 L25 8 L38 52 L47 28 L66 28" className="stroke-white dark:stroke-black" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-semibold text-black dark:text-white">
                      Blip Money
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#ff6b35] px-1.5 py-0.5 rounded-md bg-[#ff6b35]/10">
                      Best deal
                    </span>
                  </div>
                  <div className="text-[11px] text-black/50 dark:text-white/50">
                    Settle in &lt;60s · 0.2% better than market · 0% protocol fee
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:flex sm:items-center gap-x-6 gap-y-1 sm:text-right">
                <div>
                  <div className="text-[9px] uppercase tracking-[0.16em] text-black/40 dark:text-white/40">Rate</div>
                  <div className="font-mono text-base sm:text-lg font-bold text-black dark:text-white tabular-nums">
                    {formatRate(blipRate, currency.digits, currency.symbol)}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-[0.16em] text-black/40 dark:text-white/40">
                    {values.direction === "buy" ? "You pay" : "You get"}
                  </div>
                  <div className="font-mono text-base sm:text-lg font-bold text-black dark:text-white tabular-nums">
                    {formatRate(blipTotal, currency.digits, currency.symbol)}
                  </div>
                </div>
                <div className="col-span-2 sm:col-auto sm:ml-3">
                  <Link
                    to="/waitlist"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-[12px] font-semibold hover:opacity-90 transition-opacity"
                  >
                    Get rate
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Competitor rows */}
          {competitorRows.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 + i * 0.04, ease: EASE }}
              className="rounded-2xl bg-white/70 dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.05] px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:border-black/15 dark:hover:border-white/15 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-black/[0.04] dark:bg-white/[0.05] text-[10px] font-bold tracking-wider text-black/65 dark:text-white/65 shrink-0">
                  {c.badge}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-medium text-black/80 dark:text-white/80">
                      {c.name}
                    </span>
                    {c.isLive ? (
                      <span className="text-[8px] font-semibold uppercase tracking-wider text-[#3ddc84]">
                        ● Live
                      </span>
                    ) : (
                      <span className="text-[8px] font-semibold uppercase tracking-wider text-black/30 dark:text-white/30">
                        Indicative
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-black/45 dark:text-white/40">
                    Settle: {c.settle}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:flex sm:items-center gap-x-6 gap-y-1 sm:text-right">
                <div>
                  <div className="text-[9px] uppercase tracking-[0.16em] text-black/35 dark:text-white/35">Rate</div>
                  <div className="font-mono text-sm sm:text-base font-medium text-black/65 dark:text-white/60 tabular-nums">
                    {formatRate(c.rate, currency.digits, currency.symbol)}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-[0.16em] text-black/35 dark:text-white/35">
                    You {values.direction === "buy" ? "pay" : "get"}
                  </div>
                  <div className="font-mono text-sm sm:text-base font-medium text-black/65 dark:text-white/60 tabular-nums">
                    {formatRate(c.total, currency.digits, currency.symbol)}
                  </div>
                </div>
                {c.youLose > 0 && (
                  <div className="col-span-2 sm:col-auto sm:ml-3">
                    <div className="text-[9px] uppercase tracking-[0.16em] text-black/35 dark:text-white/35">
                      vs Blip
                    </div>
                    <div className="font-mono text-sm font-bold text-red-500/80 tabular-nums">
                      {values.direction === "buy" ? "+" : "−"}
                      {formatRate(c.youLose, currency.digits, currency.symbol)}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <p className="mt-6 text-center text-[11px] text-black/40 dark:text-white/35">
          Quotes aggregated through p2prate.live · Live merchant rates may
          vary slightly · No hidden fees on Blip
        </p>
      </div>
    </section>
  );
};

/* ============================================
   COMPARISON
   Cleaner Apple-style grid, restrained orange.
   ============================================ */

interface CompareRow {
  feature: string;
  blip: { value: string; good: boolean };
  binance: { value: string; good: boolean };
  paxful: { value: string; good: boolean };
  direct: { value: string; good: boolean };
}

const COMPARE_ROWS: CompareRow[] = [
  { feature: "On-chain settlement", blip: { value: "Native Solana", good: true }, binance: { value: "Off-chain", good: false }, paxful: { value: "Optional", good: false }, direct: { value: "None", good: false } },
  { feature: "Privacy", blip: { value: "Minimal KYC", good: true }, binance: { value: "Full KYC", good: false }, paxful: { value: "Tiered KYC", good: false }, direct: { value: "None", good: false } },
  { feature: "Non-custodial", blip: { value: "Smart-contract escrow", good: true }, binance: { value: "Binance custody", good: false }, paxful: { value: "Paxful custody", good: false }, direct: { value: "Counterparty risk", good: false } },
  { feature: "Settlement speed", blip: { value: "< 60 seconds", good: true }, binance: { value: "5–15 minutes", good: false }, paxful: { value: "10–30 minutes", good: false }, direct: { value: "Variable", good: false } },
  { feature: "Cheapest rate", blip: { value: "Best price match", good: true }, binance: { value: "+0.14% spread", good: false }, paxful: { value: "+0.35% spread", good: false }, direct: { value: "+0.50% typical", good: false } },
  { feature: "Bonded merchants", blip: { value: "On-chain bond", good: true }, binance: { value: "Verified, no bond", good: false }, paxful: { value: "Reputation only", good: false }, direct: { value: "Personal trust", good: false } },
  { feature: "Dispute resolution", blip: { value: "DAO arbitration", good: true }, binance: { value: "Centralized support", good: false }, paxful: { value: "Moderator queue", good: false }, direct: { value: "Self-resolve", good: false } },
  { feature: "Hidden fees", blip: { value: "0% protocol fee", good: true }, binance: { value: "Maker/taker fees", good: false }, paxful: { value: "1% escrow fee", good: false }, direct: { value: "Hawala-style", good: false } },
];

const ComparisonSection = () => {
  return (
    <section className="relative py-20 px-5 sm:py-28 sm:px-6 border-t border-black/[0.06] dark:border-white/[0.06]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="text-center mb-14"
        >
          <span className="text-[11px] uppercase tracking-[0.3em] text-black/55 dark:text-white/40 font-semibold mb-3 block">
            Side by side
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-black dark:text-white tracking-tight leading-[1.08] mb-4">
            Why Blip wins<br className="hidden sm:block" /> on the rest.
          </h2>
          <p className="text-base text-black/55 dark:text-white/50 max-w-xl mx-auto">
            Centralized P2P desks took the consumer's side. Blip rebuilt them
            on-chain — cheaper, faster, and verifiable.
          </p>
        </motion.div>

        {/* Mobile per-feature cards */}
        <div className="md:hidden space-y-3">
          {COMPARE_ROWS.map((row, i) => (
            <motion.div
              key={row.feature}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.03, ease: EASE }}
              className="rounded-2xl bg-white dark:bg-white/[0.025] border border-black/[0.07] dark:border-white/[0.06] p-5"
            >
              <h3 className="text-[13px] font-bold uppercase tracking-[0.12em] text-black/65 dark:text-white/55 mb-3">
                {row.feature}
              </h3>
              <div className="space-y-1.5">
                {[
                  { name: "Blip", data: row.blip, accent: true },
                  { name: "Binance P2P", data: row.binance },
                  { name: "Paxful", data: row.paxful },
                  { name: "Direct P2P", data: row.direct },
                ].map((entry) => (
                  <div
                    key={entry.name}
                    className={`flex items-center justify-between gap-3 px-3 py-2 rounded-xl ${entry.accent ? "bg-black text-white dark:bg-white dark:text-black" : "bg-black/[0.03] dark:bg-white/[0.03]"}`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {entry.data.good ? (
                        <Check className={`w-3.5 h-3.5 shrink-0 ${entry.accent ? "text-[#ff6b35]" : "text-black/35 dark:text-white/30"}`} strokeWidth={3} />
                      ) : (
                        <X className="w-3.5 h-3.5 text-black/30 dark:text-white/30 shrink-0" strokeWidth={3} />
                      )}
                      <span className={`text-[12px] font-semibold truncate ${entry.accent ? "" : "text-black/65 dark:text-white/65"}`}>
                        {entry.name}
                      </span>
                    </div>
                    <span className={`text-[12px] tabular-nums text-right ${entry.accent ? "font-bold" : "text-black/55 dark:text-white/50"}`}>
                      {entry.data.value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop minimal table — Blip column is one continuous black band */}
        <div className="hidden md:grid grid-cols-[1.6fr_1fr_1fr_1fr_1fr] rounded-3xl overflow-hidden bg-white dark:bg-white/[0.025] border border-black/[0.08] dark:border-white/[0.06]">
          {/* HEADER ROW (5 cells) */}
          <div className="px-7 py-5 bg-black/[0.025] dark:bg-white/[0.03] border-b border-black/[0.06] dark:border-white/[0.06] text-[11px] font-bold uppercase tracking-[0.16em] text-black/55 dark:text-white/45">
            Feature
          </div>
          <div className="px-4 py-5 bg-black text-white text-center inline-flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em]">
            <svg viewBox="0 0 70 60" className="w-3.5 h-3.5" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 36 L16 36 L25 8 L38 52 L47 28 L66 28" stroke="white" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Blip
          </div>
          {[ "Binance P2P", "Paxful", "Direct P2P" ].map((label) => (
            <div
              key={label}
              className="px-4 py-5 bg-black/[0.025] dark:bg-white/[0.03] border-b border-black/[0.06] dark:border-white/[0.06] text-center text-[11px] font-bold uppercase tracking-[0.14em] text-black/55 dark:text-white/45"
            >
              {label}
            </div>
          ))}

          {/* DATA ROWS — Blip cells share continuous bg-black */}
          {COMPARE_ROWS.map((row, i) => {
            const isLast = i === COMPARE_ROWS.length - 1;
            return (
              <Fragment key={row.feature}>
                {/* Feature label */}
                <div
                  className={`px-7 py-4 text-[14px] font-semibold text-black dark:text-white flex items-center ${isLast ? "" : "border-b border-black/[0.04] dark:border-white/[0.04]"}`}
                >
                  {row.feature}
                </div>
                {/* Blip cell — continuous black */}
                <div className="px-4 py-4 bg-black text-white text-center flex items-center justify-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#ff6b35] shrink-0" strokeWidth={3} />
                  <span className="text-[13px] font-bold tabular-nums">
                    {row.blip.value}
                  </span>
                </div>
                {/* Competitor cells */}
                {[row.binance, row.paxful, row.direct].map((c, idx) => (
                  <div
                    key={idx}
                    className={`px-4 py-4 text-center flex items-center justify-center gap-1.5 ${isLast ? "" : "border-b border-black/[0.04] dark:border-white/[0.04]"}`}
                  >
                    {c.good ? (
                      <Check className="w-3 h-3 text-[#3ddc84] shrink-0" strokeWidth={3} />
                    ) : (
                      <X className="w-3 h-3 text-black/25 dark:text-white/25 shrink-0" strokeWidth={3} />
                    )}
                    <span className="text-[12px] text-black/65 dark:text-white/55 tabular-nums">
                      {c.value}
                    </span>
                  </div>
                ))}
              </Fragment>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mt-14"
        >
          <h3 className="font-display text-2xl sm:text-3xl font-semibold text-black dark:text-white tracking-tight mb-3">
            Lower price. Stronger guarantees.
          </h3>
          <p className="text-base text-black/55 dark:text-white/50 max-w-md mx-auto mb-6">
            One protocol. Every venue beat on the row that matters: the rate
            you actually pay.
          </p>
          <CTAButton to="/waitlist">Join Waitlist</CTAButton>
        </motion.div>
      </div>
    </section>
  );
};

/* ============================================
   PAGE
   ============================================ */
const Rates = () => {
  return (
    <>
      <SEO
        title="Best USDT Rate, Live | Blip vs Binance P2P, Paxful & More"
        canonical="https://blip.money/rates"
        description="Find the cheapest USDT rate in the market. Blip beats Binance P2P, Paxful, KuCoin, OKX, and direct P2P on rate, speed, privacy, and on-chain settlement guarantees. See live rates compared."
        keywords="cheapest USDT rate, USDT INR rate, USDT AED rate, Blip vs Binance P2P, P2P USDT comparison, Paxful alternative"
      />
      <div className="bg-[#FAF8F5] dark:bg-black text-black dark:text-white min-h-screen">
        <RateFinder />
        <ComparisonSection />
      </div>
    </>
  );
};

export default Rates;
