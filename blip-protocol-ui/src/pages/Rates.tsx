import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  X,
  Shield,
  Lock,
  Eye,
  Zap,
  Globe,
  Award,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "@/components";
import { CTAButton } from "@/components/Navbar";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ============================================
   CURRENCY MARKET DATA
   - "market" = mid-market reference rate
   - Blip's edge: -0.25 (paise) for INR / -0.005 for AED on BUY
                  +0.25 (paise) for INR / +0.005 for AED on SELL
   - Competitors stack worse than market on both sides.
   ============================================ */
type Direction = "buy" | "sell";

interface Currency {
  code: string;
  flag: string;
  name: string;
  /** Mid-market USDT/<currency> reference */
  market: number;
  /** Blip's edge per side (subtract on buy, add on sell) */
  edge: number;
  /** Decimals shown */
  digits: number;
  /** Currency symbol prefix */
  symbol: string;
  /** 25 paise vs 0.005 AED — tooltip text */
  edgeLabel: string;
}

const CURRENCIES: Currency[] = [
  {
    code: "INR",
    flag: "🇮🇳",
    name: "Indian Rupee",
    market: 87.95,
    edge: 0.25,
    digits: 2,
    symbol: "₹",
    edgeLabel: "25 paise better than market",
  },
  {
    code: "AED",
    flag: "🇦🇪",
    name: "UAE Dirham",
    market: 3.6735,
    edge: 0.005,
    digits: 4,
    symbol: "د.إ ",
    edgeLabel: "5 fils better than market",
  },
  {
    code: "PHP",
    flag: "🇵🇭",
    name: "Philippine Peso",
    market: 56.4,
    edge: 0.18,
    digits: 2,
    symbol: "₱",
    edgeLabel: "18 sentimo better than market",
  },
  {
    code: "PKR",
    flag: "🇵🇰",
    name: "Pakistani Rupee",
    market: 278.5,
    edge: 0.7,
    digits: 2,
    symbol: "₨",
    edgeLabel: "70 paisa better than market",
  },
];

/* Competitor metadata. Live prices are fetched from /api/p2p-rates;
   when the API is unreachable we fall back to a static spread vs market. */
interface CompetitorMeta {
  /** Backend venue name from /api/p2p-rates (must match) */
  apiName?: string;
  name: string;
  logo: string;
  /** Fallback spread vs market when live data is unavailable */
  fallbackBuy: number;
  fallbackSell: number;
  settle: string;
}

const COMPETITORS: CompetitorMeta[] = [
  { apiName: "Binance P2P", name: "Binance P2P", logo: "🟡", fallbackBuy: 0.0014, fallbackSell: 0.0014, settle: "5–15 min" },
  { apiName: "Bybit P2P", name: "Bybit P2P", logo: "🟠", fallbackBuy: 0.0020, fallbackSell: 0.0020, settle: "5–20 min" },
  { apiName: "OKX P2P", name: "OKX P2P", logo: "⚫", fallbackBuy: 0.0025, fallbackSell: 0.0025, settle: "5–20 min" },
  { name: "Paxful", logo: "🟢", fallbackBuy: 0.0035, fallbackSell: 0.0035, settle: "10–30 min" },
  { name: "Direct P2P", logo: "⚪", fallbackBuy: 0.0050, fallbackSell: 0.0050, settle: "Variable" },
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

/* ───────── Live rate hook ─────────
   Fetches /api/p2p-rates whenever fiat/direction/amount changes.
   Returns a map of venue name -> live price, plus a mid value used as
   the market reference (the best of all live venues). */
type LiveRate = { mid: number | null; venues: Record<string, number | null>; loading: boolean; error: string | null; observed_at: number | null };

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
        const venueMap: Record<string, number | null> = {};
        for (const v of data.venues) venueMap[v.name] = v.price;
        setState({
          mid: data.mid ?? null,
          venues: venueMap,
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
   RATE FINDER + RESULTS
   ============================================ */
const RateFinder = () => {
  const [direction, setDirection] = useState<Direction>("sell");
  const [currencyCode, setCurrencyCode] = useState<string>("INR");
  const [amount, setAmount] = useState<string>("100");

  const currency = useMemo(
    () => CURRENCIES.find((c) => c.code === currencyCode) ?? CURRENCIES[0],
    [currencyCode],
  );

  const amt = parseFloat(amount) || 0;
  const live = useLiveRates(currency.code, direction, amt);

  // Use live mid-market if available; fall back to static reference rate.
  const market = live.mid ?? currency.market;

  const blipRate = useMemo(() => {
    return direction === "buy" ? market - currency.edge : market + currency.edge;
  }, [market, currency.edge, direction]);

  const blipTotal = blipRate * amt;

  const competitorRows = useMemo(() => {
    return COMPETITORS.map((c) => {
      const livePrice = c.apiName ? live.venues[c.apiName] : null;
      let rate: number;
      let live_: boolean;
      if (livePrice != null && Number.isFinite(livePrice) && livePrice > 0) {
        rate = livePrice;
        live_ = true;
      } else {
        rate =
          direction === "buy"
            ? market * (1 + c.fallbackBuy)
            : market * (1 - c.fallbackSell);
        live_ = false;
      }
      const total = rate * amt;
      const youLose =
        direction === "buy"
          ? (rate - blipRate) * amt
          : (blipRate - rate) * amt;
      return { ...c, rate, total, youLose, isLive: live_ };
    });
  }, [direction, amt, blipRate, market, live.venues]);

  return (
    <section className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 px-5 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="text-center mb-12"
        >
          <span className="text-[11px] uppercase tracking-[0.3em] text-black/60 dark:text-white/40 font-semibold mb-4 block">
            Best USDT Rate, Live
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-black dark:text-white tracking-tight leading-[1.05] mb-4">
            Find the <span className="text-[#ff6b35]">cheapest</span> rate
            <br className="hidden sm:block" /> in the market.
          </h1>
          <p className="text-base md:text-lg text-black/60 dark:text-white/55 max-w-xl mx-auto">
            We compare Blip with every major P2P venue. Real numbers, no hidden
            spreads, updated continuously.
          </p>
        </motion.div>

        {/* Inputs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          className="rounded-3xl bg-white dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] p-6 sm:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.06)]"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Direction toggle */}
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-semibold text-black/50 dark:text-white/40 mb-2 block">
                I want to
              </label>
              <div className="flex rounded-full p-1 bg-black/[0.04] dark:bg-white/[0.05]">
                {(["buy", "sell"] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDirection(d)}
                    className={`flex-1 py-2 rounded-full text-sm font-semibold transition-colors ${
                      direction === d
                        ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
                        : "text-black/55 dark:text-white/55"
                    }`}
                  >
                    {d === "buy" ? "Buy USDT" : "Sell USDT"}
                  </button>
                ))}
              </div>
            </div>
            {/* Currency */}
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] font-semibold text-black/50 dark:text-white/40 mb-2 block">
                Currency
              </label>
              <div className="grid grid-cols-4 gap-1 rounded-full p-1 bg-black/[0.04] dark:bg-white/[0.05]">
                {CURRENCIES.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setCurrencyCode(c.code)}
                    className={`py-2 rounded-full text-sm font-semibold transition-colors ${
                      currencyCode === c.code
                        ? "bg-black text-white dark:bg-white dark:text-black shadow-sm"
                        : "text-black/55 dark:text-white/55"
                    }`}
                    aria-label={c.name}
                  >
                    {c.code}
                  </button>
                ))}
              </div>
            </div>
            {/* Amount */}
            <div>
              <label
                htmlFor="rate-amount"
                className="text-[10px] uppercase tracking-[0.2em] font-semibold text-black/50 dark:text-white/40 mb-2 block"
              >
                Amount (USDT)
              </label>
              <input
                id="rate-amount"
                type="number"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="100"
                className="w-full px-4 py-2.5 rounded-full bg-black/[0.04] dark:bg-white/[0.05] border border-transparent focus:border-[#ff6b35]/40 focus:outline-none text-base font-semibold text-black dark:text-white tracking-tight tabular-nums transition-colors"
              />
            </div>
          </div>
        </motion.div>

        {/* Rate cards */}
        <div className="mt-10 space-y-3">
          {/* Blip — highlighted top row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
            className="relative"
          >
            {/* Orange halo */}
            <div
              aria-hidden
              className="absolute -inset-2 rounded-3xl blur-2xl pointer-events-none opacity-50"
              style={{
                background:
                  "radial-gradient(50% 80% at 50% 50%, rgba(255,107,53,0.35) 0%, transparent 70%)",
              }}
            />
            <div
              className="relative rounded-3xl border-2 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,107,53,0.10) 0%, rgba(255,107,53,0.02) 100%)",
                borderColor: "rgba(255,107,53,0.55)",
                boxShadow: "0 12px 40px -10px rgba(255,107,53,0.40)",
              }}
            >
              <div className="flex items-center gap-4 flex-1">
                {/* Blip logo mark */}
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ff8c50] to-[#ff6b35] shadow-[0_4px_12px_-2px_rgba(255,107,53,0.55)] shrink-0">
                  <svg viewBox="0 0 70 60" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 36 L16 36 L25 8 L38 52 L47 28 L66 28" stroke="white" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <span className="text-base font-bold text-black dark:text-white">
                      Blip Money
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ff6b35] text-white text-[9px] font-bold uppercase tracking-wider">
                      <Award className="w-3 h-3" /> Best rate
                    </span>
                  </div>
                  <div className="text-[12px] text-black/60 dark:text-white/55">
                    {currency.flag} {currency.name} · Settled on Solana in &lt;60s · {currency.edgeLabel}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 sm:gap-8 sm:text-right">
                <div>
                  <div className="text-[9px] uppercase tracking-[0.18em] text-black/45 dark:text-white/45 mb-1">
                    Rate
                  </div>
                  <div className="font-mono text-xl sm:text-2xl font-bold text-[#ff6b35] tabular-nums">
                    {formatRate(blipRate, currency.digits, currency.symbol)}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-[0.18em] text-black/45 dark:text-white/45 mb-1">
                    {direction === "buy" ? "You pay" : "You receive"}
                  </div>
                  <div className="font-mono text-xl sm:text-2xl font-bold text-black dark:text-white tabular-nums">
                    {formatRate(blipTotal, currency.digits, currency.symbol)}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Competitor rows */}
          {competitorRows.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 + i * 0.06, ease: EASE }}
              className="rounded-2xl bg-white/60 dark:bg-white/[0.025] border border-black/[0.06] dark:border-white/[0.05] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-black/[0.04] dark:bg-white/[0.05] text-base shrink-0">
                  {c.logo}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-semibold text-black dark:text-white">
                      {c.name}
                    </span>
                    {c.isLive ? (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#3ddc84]/15 border border-[#3ddc84]/30 text-[#3ddc84]">
                        <span className="w-1 h-1 rounded-full bg-[#3ddc84] animate-pulse" />
                        <span className="text-[8px] font-bold uppercase tracking-wider">Live</span>
                      </span>
                    ) : (
                      <span className="text-[8px] font-bold uppercase tracking-wider text-black/35 dark:text-white/30 px-1.5 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.04]">
                        Indicative
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-black/50 dark:text-white/45">
                    Settle: {c.settle}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 sm:gap-8 sm:text-right">
                <div>
                  <div className="text-[9px] uppercase tracking-[0.18em] text-black/40 dark:text-white/40 mb-0.5">
                    Rate
                  </div>
                  <div className="font-mono text-base sm:text-lg font-semibold text-black/70 dark:text-white/65 tabular-nums">
                    {formatRate(c.rate, currency.digits, currency.symbol)}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-[0.18em] text-black/40 dark:text-white/40 mb-0.5">
                    You {direction === "buy" ? "pay" : "get"}
                  </div>
                  <div className="font-mono text-base sm:text-lg font-semibold text-black/70 dark:text-white/65 tabular-nums">
                    {formatRate(c.total, currency.digits, currency.symbol)}
                  </div>
                </div>
                {c.youLose > 0 && (
                  <div className="col-span-2 sm:col-auto">
                    <div className="text-[9px] uppercase tracking-[0.18em] text-red-500/60 mb-0.5">
                      You {direction === "buy" ? "overpay" : "lose"}
                    </div>
                    <div className="font-mono text-sm font-bold text-red-500 tabular-nums">
                      {direction === "buy" ? "+" : "−"}
                      {formatRate(c.youLose, currency.digits, currency.symbol)}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 flex flex-col items-center gap-1">
          {live.loading ? (
            <span className="inline-flex items-center gap-2 text-[12px] text-black/55 dark:text-white/50">
              <RefreshCw className="w-3 h-3 animate-spin" />
              Fetching live rates from Binance, Bybit, OKX…
            </span>
          ) : live.error ? (
            <span className="text-[12px] text-black/55 dark:text-white/50">
              Live feed unavailable — showing indicative spreads
            </span>
          ) : live.observed_at ? (
            <span className="inline-flex items-center gap-2 text-[12px] text-black/55 dark:text-white/50">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3ddc84] animate-pulse" />
              Live · last updated {Math.max(0, Math.round((Date.now() - live.observed_at) / 1000))}s ago
            </span>
          ) : null}
          <span className="text-[11px] text-black/40 dark:text-white/35">
            Live merchant quotes vary slightly within protocol limits · No
            hidden fees on Blip
          </span>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <CTAButton to="/waitlist">
            Join Waitlist
          </CTAButton>
          <Link
            to="/how-it-works"
            className="text-[14px] font-semibold text-black/70 dark:text-white/70 hover:text-[#ff6b35] dark:hover:text-[#ff8c50] transition-colors inline-flex items-center gap-1"
          >
            How Blip beats the rest
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

/* ============================================
   COMPARISON TABLE
   Blip vs Binance P2P, Paxful, Direct P2P
   ============================================ */

interface CompareRow {
  feature: string;
  icon: typeof Shield;
  blip: { value: string; good: boolean };
  binance: { value: string; good: boolean };
  paxful: { value: string; good: boolean };
  direct: { value: string; good: boolean };
}

const COMPARE_ROWS: CompareRow[] = [
  {
    feature: "On-chain settlement",
    icon: Globe,
    blip: { value: "Native Solana", good: true },
    binance: { value: "Off-chain ledger", good: false },
    paxful: { value: "Optional", good: false },
    direct: { value: "None", good: false },
  },
  {
    feature: "Privacy",
    icon: Eye,
    blip: { value: "Minimal KYC", good: true },
    binance: { value: "Full KYC + selfie", good: false },
    paxful: { value: "Tiered KYC", good: false },
    direct: { value: "None — but no recourse", good: false },
  },
  {
    feature: "Non-custodial",
    icon: Lock,
    blip: { value: "Smart-contract escrow", good: true },
    binance: { value: "Binance custody", good: false },
    paxful: { value: "Paxful custody", good: false },
    direct: { value: "Counterparty risk", good: false },
  },
  {
    feature: "Settlement speed",
    icon: Zap,
    blip: { value: "< 60 seconds", good: true },
    binance: { value: "5–15 minutes", good: false },
    paxful: { value: "10–30 minutes", good: false },
    direct: { value: "Variable", good: false },
  },
  {
    feature: "Cheapest rate",
    icon: Award,
    blip: { value: "−25 paise / +25 paise", good: true },
    binance: { value: "+0.14% spread", good: false },
    paxful: { value: "+0.35% spread", good: false },
    direct: { value: "+0.50% typical", good: false },
  },
  {
    feature: "Bonded merchants",
    icon: Shield,
    blip: { value: "On-chain bond + slashing", good: true },
    binance: { value: "Verified, no bond", good: false },
    paxful: { value: "Reputation only", good: false },
    direct: { value: "Personal trust only", good: false },
  },
  {
    feature: "Dispute resolution",
    icon: Shield,
    blip: { value: "DAO arbitration on-chain", good: true },
    binance: { value: "Centralized support", good: false },
    paxful: { value: "Moderator queue", good: false },
    direct: { value: "Self-resolve or lose", good: false },
  },
  {
    feature: "Hidden fees",
    icon: Lock,
    blip: { value: "None — 0% protocol fee", good: true },
    binance: { value: "Maker/taker on top", good: false },
    paxful: { value: "1% escrow fee", good: false },
    direct: { value: "Hawala-style markup", good: false },
  },
];

const ComparisonSection = () => {
  return (
    <section className="relative py-20 px-5 sm:py-28 sm:px-6 border-t border-black/[0.06] dark:border-white/[0.06]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="text-center mb-14"
        >
          <span className="text-[11px] uppercase tracking-[0.3em] text-black/60 dark:text-white/40 font-semibold mb-4 block">
            Side by side
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-black dark:text-white tracking-tight leading-[1.08] mb-5">
            Blip vs <span className="text-black/55 dark:text-white/40">the rest.</span>
          </h2>
          <p className="text-base md:text-lg text-black/60 dark:text-white/55 max-w-2xl mx-auto">
            Centralized P2P desks built last decade's rails. Blip rebuilt them
            on-chain — cheaper, faster, and verifiable.
          </p>
        </motion.div>

        {/* Mobile per-feature cards */}
        <div className="md:hidden space-y-3">
          {COMPARE_ROWS.map((row, i) => {
            const Icon = row.icon;
            return (
              <motion.div
                key={row.feature}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.04, ease: EASE }}
                className="rounded-2xl bg-white/60 dark:bg-white/[0.025] border border-black/[0.06] dark:border-white/[0.06] p-5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Icon className="w-4 h-4 text-[#ff6b35]" strokeWidth={2.4} />
                  <h3 className="text-[14px] font-bold text-black dark:text-white">
                    {row.feature}
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { name: "Blip", data: row.blip, accent: true },
                    { name: "Binance P2P", data: row.binance },
                    { name: "Paxful", data: row.paxful },
                    { name: "Direct P2P", data: row.direct },
                  ].map((entry) => (
                    <div
                      key={entry.name}
                      className={`flex items-center justify-between gap-3 px-3 py-2 rounded-xl ${entry.accent ? "bg-[#ff6b35]/10 border border-[#ff6b35]/25" : "bg-black/[0.03] dark:bg-white/[0.03]"}`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {entry.data.good ? (
                          <Check className="w-3.5 h-3.5 text-[#3ddc84] shrink-0" strokeWidth={3} />
                        ) : (
                          <X className="w-3.5 h-3.5 text-red-500/70 shrink-0" strokeWidth={3} />
                        )}
                        <span className={`text-[12px] font-semibold ${entry.accent ? "text-[#ff6b35]" : "text-black/70 dark:text-white/65"} truncate`}>
                          {entry.name}
                        </span>
                      </div>
                      <span className={`text-[12px] tabular-nums text-right ${entry.accent ? "font-bold text-black dark:text-white" : "text-black/55 dark:text-white/55"}`}>
                        {entry.data.value}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-hidden rounded-3xl bg-white/60 dark:bg-white/[0.025] border border-black/[0.08] dark:border-white/[0.06]">
          {/* Header */}
          <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr_1fr] px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.06] bg-black/[0.02] dark:bg-white/[0.02]">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-black/55 dark:text-white/45">
              Feature
            </span>
            <span className="text-center">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#ff6b35]">
                <svg viewBox="0 0 70 60" className="w-3.5 h-3.5" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 36 L16 36 L25 8 L38 52 L47 28 L66 28" stroke="currentColor" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Blip
              </span>
            </span>
            <span className="text-center text-[11px] font-bold uppercase tracking-[0.14em] text-black/55 dark:text-white/45">
              Binance P2P
            </span>
            <span className="text-center text-[11px] font-bold uppercase tracking-[0.14em] text-black/55 dark:text-white/45">
              Paxful
            </span>
            <span className="text-center text-[11px] font-bold uppercase tracking-[0.14em] text-black/55 dark:text-white/45">
              Direct P2P
            </span>
          </div>
          {/* Rows */}
          {COMPARE_ROWS.map((row, i) => {
            const Icon = row.icon;
            return (
              <motion.div
                key={row.feature}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: 0.05 + i * 0.04, ease: EASE }}
                className={`grid grid-cols-[1.6fr_1fr_1fr_1fr_1fr] px-6 py-5 items-center ${i < COMPARE_ROWS.length - 1 ? "border-b border-black/[0.05] dark:border-white/[0.04]" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#ff6b35]/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[#ff6b35]" strokeWidth={2.4} />
                  </div>
                  <span className="text-[14px] font-semibold text-black dark:text-white">
                    {row.feature}
                  </span>
                </div>
                <div className="text-center px-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff6b35]/10 border border-[#ff6b35]/25">
                    <Check className="w-3 h-3 text-[#3ddc84]" strokeWidth={3} />
                    <span className="text-[12px] font-bold text-[#ff6b35] tabular-nums">
                      {row.blip.value}
                    </span>
                  </div>
                </div>
                {[row.binance, row.paxful, row.direct].map((c, idx) => (
                  <div key={idx} className="text-center px-2">
                    <div className="inline-flex items-center gap-1.5">
                      {c.good ? (
                        <Check className="w-3 h-3 text-[#3ddc84]" strokeWidth={3} />
                      ) : (
                        <X className="w-3 h-3 text-red-500/70" strokeWidth={3} />
                      )}
                      <span className="text-[12px] text-black/65 dark:text-white/60 tabular-nums">
                        {c.value}
                      </span>
                    </div>
                  </div>
                ))}
              </motion.div>
            );
          })}
        </div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center mt-14"
        >
          <h3 className="font-display text-2xl sm:text-3xl font-semibold text-black dark:text-white tracking-tight mb-3">
            Lower price. Stronger guarantees.
          </h3>
          <p className="text-base text-black/55 dark:text-white/50 max-w-md mx-auto mb-7">
            One protocol that beats every centralized P2P desk on the row that
            matters: the rate you actually pay.
          </p>
          <CTAButton to="/waitlist">
            Join Waitlist
          </CTAButton>
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
        description="Find the cheapest USDT rate in the market. Blip beats Binance P2P, Paxful, and direct P2P on rate, speed, privacy, and on-chain settlement guarantees. See the comparison live."
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
