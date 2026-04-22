import {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import {
  ArrowRight,
  ExternalLink,
  Loader2,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

/* ═══════════════════════════════════════════════
   TYPES & CONSTANTS
   ═══════════════════════════════════════════════ */

type Side = "BUY" | "SELL";

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
};

const SOURCES: { name: string; slug: string }[] = [
  { name: "Binance P2P", slug: "binance" },
  { name: "Bybit P2P", slug: "bybit" },
  { name: "OKX P2P", slug: "okx" },
  { name: "KuCoin P2P", slug: "kucoin" },
  { name: "HTX P2P", slug: "htx" },
];

const QUICK_CAPITAL = [25000, 100000, 500000, 1000000];

/* ═══════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════ */

async function fetchFromAPI(slug: string, side: Side): Promise<Quote[]> {
  const res = await fetch(
    `/api/rates?source=${slug}&side=${side}`,
    { headers: { accept: "application/json" } },
  );
  if (!res.ok) throw new Error(`${slug} ${res.status}`);
  const json = await res.json();
  return (json?.quotes ?? []) as Quote[];
}

// Pick the best executable quote on one side for a single exchange.
// BUY side = cheapest ask (lowest price); SELL side = highest bid.
function bestQuote(quotes: Quote[], side: Side): Quote | null {
  const gated = quotes.filter((q) => {
    if (!q.price || q.price <= 0) return false;
    if (q.completionRate != null && q.completionRate < 0.9) return false;
    if (q.orders != null && q.orders < 50) return false;
    return true;
  });
  if (gated.length === 0) return null;
  gated.sort((a, b) => (side === "BUY" ? a.price - b.price : b.price - a.price));
  return gated[0];
}

function AnimatedNumber({
  value,
  decimals = 2,
  prefix = "",
  suffix = "",
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}) {
  const mv = useMotionValue(value);
  const display = useTransform(mv, (v) =>
    prefix +
    v.toLocaleString("en-IN", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }) +
    suffix,
  );
  useEffect(() => {
    const controls = animate(mv, value, {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    });
    return controls.stop;
  }, [value, mv]);
  return <motion.span>{display}</motion.span>;
}

type Opportunity = {
  id: string;
  buy: Quote;
  sell: Quote;
  maxUSDT: number;
  capitalUsed: number;
  profitPerUSDT: number;
  profitTotal: number;
  profitPct: number;
};

function computeOpportunities(
  buyResults: SourceResult[],
  sellResults: SourceResult[],
  capitalINR: number,
): Opportunity[] {
  const buys: Quote[] = [];
  for (const r of buyResults) {
    const b = bestQuote(r.quotes, "BUY");
    if (b) buys.push(b);
  }
  const sells: Quote[] = [];
  for (const r of sellResults) {
    const s = bestQuote(r.quotes, "SELL");
    if (s) sells.push(s);
  }

  const opps: Opportunity[] = [];
  for (const buy of buys) {
    for (const sell of sells) {
      if (buy.source === sell.source) continue; // only cross-exchange
      if (sell.price <= buy.price) continue;

      const profitPerUSDT = sell.price - buy.price;

      // Max USDT we can push through this route:
      let maxUSDT = capitalINR > 0 ? capitalINR / buy.price : Infinity;
      maxUSDT = Math.min(maxUSDT, buy.availableUSDT || maxUSDT);
      if (buy.maxINR > 0) maxUSDT = Math.min(maxUSDT, buy.maxINR / buy.price);
      maxUSDT = Math.min(maxUSDT, sell.availableUSDT || maxUSDT);
      if (sell.maxINR > 0)
        maxUSDT = Math.min(maxUSDT, sell.maxINR / sell.price);
      if (!isFinite(maxUSDT) || maxUSDT <= 0) continue;

      // Ensure we don't fall below buy min-order
      if (buy.minINR > 0 && maxUSDT * buy.price < buy.minINR) continue;
      if (sell.minINR > 0 && maxUSDT * sell.price < sell.minINR) continue;

      const capitalUsed = maxUSDT * buy.price;
      const profitTotal = profitPerUSDT * maxUSDT;
      const profitPct = (profitPerUSDT / buy.price) * 100;

      opps.push({
        id: `${buy.source}→${sell.source}`,
        buy,
        sell,
        maxUSDT,
        capitalUsed,
        profitPerUSDT,
        profitTotal,
        profitPct,
      });
    }
  }
  opps.sort((a, b) => b.profitTotal - a.profitTotal);
  return opps;
}

/* ═══════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════ */

export default function BlipArbitrage() {
  const [capital, setCapital] = useState<string>("50000");
  const [buyResults, setBuyResults] = useState<SourceResult[]>([]);
  const [sellResults, setSellResults] = useState<SourceResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchedAt, setFetchedAt] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const didAutoRun = useRef(false);

  const capitalNum = parseFloat(capital) || 0;

  const onCapitalInput = (v: string) => {
    const cleaned = v.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
    setCapital(cleaned);
  };

  const runSearch = useCallback(async () => {
    setLoading(true);
    const [buy, sell] = await Promise.all([
      Promise.allSettled(SOURCES.map((s) => fetchFromAPI(s.slug, "BUY"))),
      Promise.allSettled(SOURCES.map((s) => fetchFromAPI(s.slug, "SELL"))),
    ]);
    const mapResults = (
      settled: PromiseSettledResult<Quote[]>[],
    ): SourceResult[] =>
      settled.map((r, i) => ({
        source: SOURCES[i].name,
        ok: r.status === "fulfilled",
        quotes: r.status === "fulfilled" ? r.value : [],
      }));
    setBuyResults(mapResults(buy));
    setSellResults(mapResults(sell));
    setFetchedAt(Date.now());
    setLoading(false);
  }, []);

  useEffect(() => {
    if (didAutoRun.current) return;
    didAutoRun.current = true;
    runSearch();
  }, [runSearch]);

  useEffect(() => {
    if (!fetchedAt) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [fetchedAt]);

  const opportunities = useMemo(
    () => computeOpportunities(buyResults, sellResults, capitalNum),
    [buyResults, sellResults, capitalNum],
  );

  const best = opportunities[0] ?? null;
  const secondsAgo = fetchedAt
    ? Math.max(0, Math.floor((now - fetchedAt) / 1000))
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Capital input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          runSearch();
        }}
        className="mb-5 relative"
      >
        <div
          aria-hidden
          className="absolute inset-0 -z-10 blur-3xl opacity-50 rounded-[28px] pointer-events-none"
          style={{
            background:
              "radial-gradient(70% 100% at 50% 50%, rgba(255,107,53,0.18) 0%, rgba(255,107,53,0) 70%)",
          }}
        />
        <div
          className="relative rounded-[28px]"
          style={{
            background: "#fff",
            border: "1px solid var(--border-default)",
            boxShadow:
              "0 24px 60px -30px rgba(255,107,53,0.22), 0 8px 24px -10px rgba(0,0,0,0.08)",
          }}
        >
          <div className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-3.5 md:py-5">
            <div className="flex flex-col">
              <span
                className="text-[10px] uppercase tracking-wider font-semibold"
                style={{ color: "var(--text-muted)" }}
              >
                Your capital
              </span>
            </div>
            <span
              className="font-bold shrink-0 tabular-nums leading-none ml-1"
              style={{
                fontSize: "clamp(1.75rem, 4.2vw, 3rem)",
                letterSpacing: "-0.035em",
                color: "var(--text-tertiary)",
              }}
            >
              ₹
            </span>
            <input
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={capital}
              onChange={(e) => onCapitalInput(e.target.value)}
              placeholder="50,000"
              aria-label="Capital in INR"
              className="flex-1 bg-transparent outline-none font-bold tabular-nums min-w-0 placeholder:opacity-25 leading-none"
              style={{
                fontSize: "clamp(1.75rem, 4.2vw, 3rem)",
                letterSpacing: "-0.035em",
                color: "var(--text-primary)",
                caretColor: "var(--brand)",
              }}
            />
            <button
              type="submit"
              disabled={loading || !capitalNum}
              className="shrink-0 rounded-full font-semibold transition hover:brightness-110 active:scale-95 disabled:opacity-50 w-11 h-11 md:w-12 md:h-12 flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, var(--brand) 0%, #ff8c50 100%)",
                color: "#fff",
                boxShadow: "0 10px 24px rgba(255,107,53,0.4)",
              }}
              aria-label="Find opportunities"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <TrendingUp size={18} strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>

        {/* Quick capital chips */}
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          {QUICK_CAPITAL.map((v) => {
            const active = parseFloat(capital) === v;
            return (
              <button
                key={v}
                type="button"
                onClick={() => setCapital(String(v))}
                className="px-3 py-1.5 rounded-full text-xs font-medium transition"
                style={{
                  background: active ? "var(--text-primary)" : "#fff",
                  border: `1px solid ${active ? "var(--text-primary)" : "var(--border-default)"}`,
                  color: active ? "#fff" : "var(--text-secondary)",
                }}
              >
                ₹{v.toLocaleString("en-IN")}
              </button>
            );
          })}
        </div>
      </form>

      {loading && opportunities.length === 0 ? (
        <div
          className="text-center py-16"
          style={{ color: "var(--text-tertiary)" }}
        >
          <Loader2
            size={26}
            className="animate-spin mx-auto mb-3"
            style={{ color: "var(--brand)" }}
          />
          Scanning 5 exchanges × 2 sides for opportunities…
        </div>
      ) : opportunities.length === 0 ? (
        <div
          className="text-center py-14 rounded-3xl"
          style={{
            background: "#fff",
            border: "1px solid var(--border-default)",
          }}
        >
          <AlertTriangle
            size={22}
            className="mx-auto mb-3"
            style={{ color: "var(--text-muted)" }}
          />
          <div
            className="text-sm font-semibold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            No arbitrage window right now
          </div>
          <div
            className="text-xs max-w-sm mx-auto"
            style={{ color: "var(--text-muted)" }}
          >
            Across all exchange pairs, the highest sell bid is lower than the
            cheapest buy ask. Check back in a minute — windows open and close
            fast.
          </div>
        </div>
      ) : (
        <>
          {/* Summary */}
          {best && (
            <div
              className="rounded-2xl px-5 py-4 mb-4 flex items-center justify-between gap-4 flex-wrap"
              style={{
                background: "#fff",
                border: "1px solid var(--border-default)",
              }}
            >
              <div>
                <div
                  className="text-[11px] uppercase tracking-wider font-semibold mb-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  Best opportunity
                </div>
                <div
                  className="font-bold tracking-tight tabular-nums"
                  style={{
                    fontSize: "clamp(1.75rem, 4vw, 2.4rem)",
                    lineHeight: 1,
                    color: "#059669",
                  }}
                >
                  +
                  <AnimatedNumber
                    value={best.profitTotal}
                    decimals={0}
                    prefix="₹"
                  />
                </div>
                <div
                  className="text-xs mt-1"
                  style={{ color: "var(--text-secondary)" }}
                >
                  on ₹{best.capitalUsed.toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                  })}{" "}
                  deployed ·{" "}
                  <AnimatedNumber
                    value={best.profitPct}
                    decimals={2}
                    suffix="%"
                  />{" "}
                  spread
                </div>
              </div>
              <div className="text-right">
                <div
                  className="text-[11px] uppercase tracking-wider font-semibold mb-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  {opportunities.length} route
                  {opportunities.length === 1 ? "" : "s"}
                </div>
                <button
                  onClick={runSearch}
                  disabled={loading}
                  className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full transition"
                  style={{ color: "var(--text-muted)" }}
                >
                  <RefreshCw
                    size={11}
                    className={loading ? "animate-spin" : ""}
                  />
                  Updated {secondsAgo}s ago
                </button>
              </div>
            </div>
          )}

          {/* Opportunity cards */}
          <div className="flex flex-col gap-3">
            {opportunities.slice(0, 10).map((o, i) => (
              <OpportunityCard key={o.id} opp={o} rank={i + 1} />
            ))}
          </div>

          {/* Warning */}
          <div
            className="mt-5 flex items-start gap-2 px-4 py-3 rounded-xl text-[11px]"
            style={{
              background: "rgba(239,68,68,0.06)",
              color: "#b91c1c",
            }}
          >
            <AlertTriangle size={13} className="shrink-0 mt-0.5" />
            <div>
              <b>Execution risk:</b> both legs must complete. Prices can move
              during the 5–15 min window. Never commit funds you aren't ready
              to hold at the buy price if the sell leg fails. Liquidity shown
              is merchant-advertised and may fill partially.
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════
   SUBCOMPONENT — OpportunityCard
   ═══════════════════════════════════════════════ */

function OpportunityCard({ opp, rank }: { opp: Opportunity; rank: number }) {
  const isTop = rank === 1;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: rank * 0.04 }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: "#fff",
        border: `1px solid ${isTop ? "var(--brand-border)" : "var(--border-default)"}`,
        boxShadow: isTop
          ? "0 14px 40px -20px rgba(255,107,53,0.35)"
          : "var(--shadow-sm)",
      }}
    >
      {/* Top strip: rank + profit */}
      <div
        className="flex items-center justify-between gap-3 px-5 py-3"
        style={{
          background: isTop ? "var(--brand-muted)" : "var(--bg-tertiary)",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold"
            style={{
              background: isTop ? "var(--brand)" : "var(--text-primary)",
              color: "#fff",
            }}
          >
            {rank}
          </span>
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{
              color: isTop ? "var(--brand)" : "var(--text-secondary)",
            }}
          >
            {isTop ? "Top route" : "Route"}
          </span>
        </div>
        <div className="flex items-baseline gap-2 tabular-nums">
          <span
            className="font-bold"
            style={{ color: "#059669", fontSize: "1rem" }}
          >
            +₹
            {opp.profitTotal.toLocaleString("en-IN", {
              maximumFractionDigits: 0,
            })}
          </span>
          <span
            className="text-xs font-semibold"
            style={{ color: "#059669" }}
          >
            +{opp.profitPct.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Legs */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 md:gap-4 p-5 items-center">
        <Leg leg="BUY" quote={opp.buy} />
        <div
          className="flex items-center justify-center md:rotate-0 rotate-90 shrink-0"
          style={{ color: "var(--brand)" }}
        >
          <ArrowRight size={20} strokeWidth={2.5} />
        </div>
        <Leg leg="SELL" quote={opp.sell} />
      </div>

      {/* Metrics footer */}
      <div
        className="grid grid-cols-3 gap-3 px-5 py-3 text-center"
        style={{ borderTop: "1px solid var(--border-subtle)" }}
      >
        <Metric
          label="Capital used"
          value={`₹${opp.capitalUsed.toLocaleString("en-IN", {
            maximumFractionDigits: 0,
          })}`}
        />
        <Metric
          label="Max volume"
          value={`${opp.maxUSDT.toFixed(2)} USDT`}
        />
        <Metric
          label="Profit / USDT"
          value={`₹${opp.profitPerUSDT.toFixed(2)}`}
          tone="good"
        />
      </div>
    </motion.div>
  );
}

function Leg({ leg, quote }: { leg: "BUY" | "SELL"; quote: Quote }) {
  const isBuy = leg === "BUY";
  return (
    <div
      className="rounded-xl px-4 py-3"
      style={{
        background: "var(--bg-tertiary)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full"
          style={{
            background: isBuy
              ? "rgba(239,68,68,0.12)"
              : "rgba(16,185,129,0.14)",
            color: isBuy ? "#b91c1c" : "#047857",
          }}
        >
          {isBuy ? "Buy" : "Sell"}
        </span>
        <span className="text-xs font-semibold truncate">{quote.source}</span>
      </div>
      <div
        className="font-bold tabular-nums"
        style={{ fontSize: "1.25rem", lineHeight: 1.1 }}
      >
        ₹{quote.price.toFixed(2)}
      </div>
      <div
        className="text-[11px] mt-0.5 truncate"
        style={{ color: "var(--text-muted)" }}
      >
        {quote.merchant}
        {quote.completionRate != null &&
          ` · ${(quote.completionRate * 100).toFixed(1)}%`}
      </div>
      <a
        href={quote.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 mt-2 px-3 py-1.5 rounded-full text-[11px] font-semibold transition hover:brightness-110"
        style={{
          background: isBuy
            ? "var(--text-primary)"
            : "linear-gradient(135deg, var(--brand) 0%, #ff8c50 100%)",
          color: "#fff",
          boxShadow: isBuy
            ? "none"
            : "0 4px 12px rgba(255,107,53,0.3)",
        }}
      >
        {isBuy ? "Go buy" : "Go sell"}
        <ExternalLink size={10} />
      </a>
    </div>
  );
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "good";
}) {
  return (
    <div>
      <div
        className="text-[10px] uppercase tracking-wider font-semibold"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </div>
      <div
        className="text-sm font-bold tabular-nums mt-0.5"
        style={{
          color: tone === "good" ? "#059669" : "var(--text-primary)",
        }}
      >
        {value}
      </div>
    </div>
  );
}
