import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Zap, Clock, CheckCircle2, Search, Layers } from "lucide-react";
import { ratesDb, RATES_DB_CONFIGURED } from "./supabaseClient";

type MerchantRow = {
  merchant_id: string;
  exchange: string;
  external_id: string;
  nickname: string | null;
  badge_tier: string | null;
  is_online: boolean | null;
  completion_rate: number | null;
  monthly_orders: number | null;
  all_time_orders: number | null;
  avg_release_secs: number | null;
  avg_pay_secs: number | null;
  registered_at: string | null;
  snapshot_at: string | null;
  first_seen_at: string;
  last_seen_at: string;
  active_ad_count: number;
  offered_fiat_value: number | null;
  offered_crypto: number | null;
  typical_min_fiat: number | null;
  typical_max_fiat: number | null;
  best_buy_price: number | null;
  best_sell_price: number | null;
};

type FiatTarget = { fiat: string; crypto: string; merchant_count: number; last_seen: string };

type SortKey =
  | "score"
  | "monthly_orders"
  | "all_time_orders"
  | "offered_fiat_value"
  | "completion_rate";

const EXCHANGE_FILTERS = [
  { id: "all", label: "All" },
  { id: "binance", label: "Binance" },
  { id: "bybit", label: "Bybit" },
  { id: "okx", label: "OKX" },
  { id: "htx", label: "HTX" },
] as const;

const EXCHANGE_COLORS: Record<string, string> = {
  binance: "#f0b90b",
  bybit: "#f7a600",
  okx: "#000000",
  htx: "#127eff",
};

const FIAT_SYMBOLS: Record<string, string> = {
  INR: "₹", USD: "$", EUR: "€", GBP: "£", RUB: "₽", UAH: "₴",
  IDR: "Rp", VND: "₫", PKR: "₨", PHP: "₱", CNY: "¥", NGN: "₦",
  AED: "AED ", TRY: "₺", BRL: "R$", THB: "฿", MYR: "RM",
  ARS: "$", KRW: "₩", JPY: "¥", ZAR: "R", KES: "KSh",
};
const FIAT_FLAGS: Record<string, string> = {
  INR: "🇮🇳", USD: "🇺🇸", EUR: "🇪🇺", GBP: "🇬🇧", RUB: "🇷🇺", UAH: "🇺🇦",
  IDR: "🇮🇩", VND: "🇻🇳", PKR: "🇵🇰", PHP: "🇵🇭", CNY: "🇨🇳", NGN: "🇳🇬",
  AED: "🇦🇪", TRY: "🇹🇷", BRL: "🇧🇷", THB: "🇹🇭", MYR: "🇲🇾",
  ARS: "🇦🇷", KRW: "🇰🇷", JPY: "🇯🇵", ZAR: "🇿🇦", KES: "🇰🇪",
};

function fiatSymbol(f: string) {
  return FIAT_SYMBOLS[f] ?? f + " ";
}

function volumeProxy(m: MerchantRow): number {
  return m.monthly_orders ?? m.all_time_orders ?? 0;
}

function reliabilityScore(m: MerchantRow): number {
  const comp = m.completion_rate ?? 0;
  const release = m.avg_release_secs == null ? 0.5 : Math.max(0, 1 - m.avg_release_secs / 600);
  const volume = volumeProxy(m);
  const volNorm = volume === 0 ? 0 : Math.min(1, Math.log10(volume + 1) / 4);
  const online = m.is_online ? 0.1 : 0;
  const badge = (() => {
    const t = (m.badge_tier ?? "").toLowerCase();
    if (t.includes("gold") || t.includes("verified") || t === "merchant") return 1;
    if (t.includes("pro") || t.includes("silver")) return 0.8;
    if (t === "user") return 0.3;
    return 0.2;
  })();
  return 45 * comp + 20 * release + 20 * volNorm + 10 * badge + 5 * (online ? 1 : 0);
}

function fmtPct(v: number | null) {
  if (v == null) return "—";
  return (v * 100).toFixed(1) + "%";
}
function fmtCount(v: number | null) {
  if (v == null) return "—";
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(1) + "M";
  if (v >= 1_000) return (v / 1_000).toFixed(1) + "K";
  return String(v);
}
// Currency-aware formatting — INR uses L/Cr, others use K/M/B.
function fmtMoney(v: number | null, fiat: string): string {
  if (v == null) return "—";
  const sym = fiatSymbol(fiat);
  if (fiat === "INR") {
    if (v >= 1e7) return sym + (v / 1e7).toFixed(2) + " Cr";
    if (v >= 1e5) return sym + (v / 1e5).toFixed(1) + " L";
    if (v >= 1000) return sym + Math.round(v / 1000) + "K";
    return sym + Math.round(v);
  }
  if (v >= 1e9) return sym + (v / 1e9).toFixed(2) + "B";
  if (v >= 1e6) return sym + (v / 1e6).toFixed(2) + "M";
  if (v >= 1e3) return sym + (v / 1e3).toFixed(1) + "K";
  return sym + Math.round(v);
}
function fmtCrypto(v: number | null, crypto: string) {
  if (v == null) return "—";
  if (v >= 1000) return (v / 1000).toFixed(1) + "K " + crypto;
  return v.toFixed(0) + " " + crypto;
}

export default function BlipMerchants() {
  const [rows, setRows] = useState<MerchantRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exchange, setExchange] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("score");
  const [search, setSearch] = useState("");
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [fiat, setFiat] = useState<string>("INR");
  const [targets, setTargets] = useState<FiatTarget[]>([]);

  // Load the list of fiats we have data for
  useEffect(() => {
    if (!RATES_DB_CONFIGURED || !ratesDb) return;
    (async () => {
      const { data } = await ratesDb
        .from("crawl_targets_seen")
        .select("*")
        .order("merchant_count", { ascending: false });
      setTargets((data as FiatTarget[]) ?? []);
    })();
  }, []);

  // Load merchants for the selected fiat
  useEffect(() => {
    if (!RATES_DB_CONFIGURED || !ratesDb) {
      setError("Supabase credentials missing.");
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    (async () => {
      const { data, error } = await ratesDb.rpc("merchants_for_fiat", {
        p_fiat: fiat,
        p_crypto: "USDT",
      });
      if (cancelled) return;
      if (error) setError(error.message);
      else {
        setError(null);
        setRows((data as MerchantRow[]) ?? []);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [fiat]);

  const totals = useMemo(
    () => ({
      merchants: rows.length,
      online: rows.filter((r) => r.is_online).length,
      liveAds: rows.reduce((a, r) => a + (r.active_ad_count ?? 0), 0),
      offered: rows.reduce((a, r) => a + (r.offered_fiat_value ?? 0), 0),
    }),
    [rows],
  );

  const filtered = useMemo(() => {
    let out = rows;
    if (exchange !== "all") out = out.filter((r) => r.exchange === exchange);
    if (onlineOnly) out = out.filter((r) => r.is_online);
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter((r) => (r.nickname ?? "").toLowerCase().includes(q));
    }
    const getSort = (r: MerchantRow) => {
      switch (sort) {
        case "score": return reliabilityScore(r);
        case "monthly_orders": return r.monthly_orders ?? -1;
        case "all_time_orders": return r.all_time_orders ?? -1;
        case "offered_fiat_value": return r.offered_fiat_value ?? -1;
        case "completion_rate": return r.completion_rate ?? -1;
      }
    };
    return [...out].sort((a, b) => getSort(b) - getSort(a));
  }, [rows, exchange, sort, search, onlineOnly]);

  return (
    <div className="pt-2">
      {/* Currency dropdown */}
      <div className="flex justify-center mb-5">
        <div className="relative inline-block">
          <select
            value={fiat}
            onChange={(e) => setFiat(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2.5 rounded-full text-[13px] font-semibold outline-none cursor-pointer transition"
            style={{
              background: "#fff",
              border: "1px solid var(--border-default)",
              color: "var(--text-primary)",
              boxShadow: "var(--shadow-sm)",
              minWidth: 240,
            }}
          >
            {targets.map((t) => (
              <option key={`${t.fiat}-${t.crypto}`} value={t.fiat}>
                {FIAT_FLAGS[t.fiat] ?? "🏳️"}  {t.fiat}/{t.crypto}  ·  {t.merchant_count} merchants
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            style={{ color: "var(--text-tertiary)" }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* Aggregate stat strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-5">
        {[
          { label: `${fiat} merchants`, value: fmtCount(totals.merchants) },
          { label: "Online now", value: fmtCount(totals.online) },
          { label: "Live ads", value: fmtCount(totals.liveAds) },
          { label: "Offered liquidity", value: fmtMoney(totals.offered, fiat) },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl p-3"
            style={{
              background: "#fff",
              border: "1px solid var(--border-default)",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div className="text-[10px] uppercase tracking-wider mb-1"
              style={{ color: "var(--text-tertiary)" }}>
              {s.label}
            </div>
            <div className="text-[18px] font-bold" style={{ color: "var(--text-primary)" }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
        <div className="flex items-center gap-1 p-1 rounded-full"
          style={{ background: "#fff", border: "1px solid var(--border-default)" }}>
          {EXCHANGE_FILTERS.map((e) => (
            <button
              key={e.id}
              onClick={() => setExchange(e.id)}
              className="px-3 py-1 rounded-full text-[12px] font-semibold transition"
              style={{
                background: exchange === e.id ? "var(--brand)" : "transparent",
                color: exchange === e.id ? "#fff" : "var(--text-secondary)",
              }}
            >
              {e.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-1 min-w-[240px] flex-wrap">
          <div className="relative flex-1 min-w-[180px]">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "var(--text-tertiary)" }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search merchant…"
              className="w-full pl-9 pr-3 py-2 rounded-full text-[13px] outline-none"
              style={{
                background: "#fff",
                border: "1px solid var(--border-default)",
                color: "var(--text-primary)",
              }}
            />
          </div>
          <label
            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-[12px] font-semibold cursor-pointer select-none"
            style={{
              background: onlineOnly ? "rgba(22,163,74,0.08)" : "#fff",
              color: onlineOnly ? "#16a34a" : "var(--text-secondary)",
              border: "1px solid var(--border-default)",
            }}
          >
            <input
              type="checkbox"
              checked={onlineOnly}
              onChange={(e) => setOnlineOnly(e.target.checked)}
              className="hidden"
            />
            <span className="w-1.5 h-1.5 rounded-full"
              style={{ background: onlineOnly ? "#16a34a" : "#888" }} />
            Online only
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="px-3 py-2 rounded-full text-[12px] font-semibold outline-none"
            style={{
              background: "#fff",
              border: "1px solid var(--border-default)",
              color: "var(--text-primary)",
            }}
          >
            <option value="score">Reliability</option>
            <option value="monthly_orders">Volume (30d)</option>
            <option value="all_time_orders">All-time orders</option>
            <option value="offered_fiat_value">Liquidity {fiatSymbol(fiat).trim()}</option>
            <option value="completion_rate">Completion %</option>
          </select>
        </div>
      </div>

      <div className="text-[12px] mb-3" style={{ color: "var(--text-tertiary)" }}>
        {loading ? "Loading…" : `${filtered.length} of ${rows.length} ${fiat} merchants`}
        {error ? <span style={{ color: "#e11d48" }}> — {error}</span> : null}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--brand)" }} />
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((m, i) => {
            const score = reliabilityScore(m);
            const tradeSize =
              m.typical_min_fiat != null && m.typical_max_fiat != null
                ? `${fmtMoney(m.typical_min_fiat, fiat)}–${fmtMoney(m.typical_max_fiat, fiat)}`
                : null;
            return (
              <motion.div
                key={m.merchant_id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(i * 0.006, 0.25) }}
                className="rounded-xl p-3 md:p-4 flex items-center gap-3 md:gap-4"
                style={{
                  background: "#fff",
                  border: "1px solid var(--border-default)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                <div
                  className="flex-shrink-0 w-8 text-center text-[12px] font-bold"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  #{i + 1}
                </div>

                <div className="flex-shrink-0 flex items-center gap-2 w-[70px]">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: EXCHANGE_COLORS[m.exchange] ?? "#888" }}
                  />
                  <span className="text-[10px] font-semibold uppercase tracking-wider"
                    style={{ color: "var(--text-tertiary)" }}>
                    {m.exchange}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-[14px] truncate"
                      style={{ color: "var(--text-primary)" }}>
                      {m.nickname ?? "—"}
                    </span>
                    {m.is_online && (
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: "#16a34a" }}
                        title="Online now"
                      />
                    )}
                    {m.badge_tier ? (
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                        style={{
                          background: "rgba(255,107,53,0.08)",
                          color: "var(--brand)",
                        }}
                      >
                        {m.badge_tier}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] mt-1 flex-wrap"
                    style={{ color: "var(--text-tertiary)" }}>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {fmtPct(m.completion_rate)}
                    </span>
                    {m.monthly_orders != null && (
                      <span className="flex items-center gap-1"
                        title="Trades in the last 30 days">
                        <Zap className="w-3 h-3" />
                        {fmtCount(m.monthly_orders)}/mo
                      </span>
                    )}
                    {m.all_time_orders != null && (
                      <span title="Lifetime trade count">
                        {fmtCount(m.all_time_orders)} all-time
                      </span>
                    )}
                    {m.avg_release_secs != null && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {m.avg_release_secs < 60
                          ? `${m.avg_release_secs}s`
                          : `${Math.round(m.avg_release_secs / 60)}m`}
                      </span>
                    )}
                  </div>
                </div>

                <div className="hidden md:block flex-shrink-0 text-right w-[140px]">
                  <div className="text-[13px] font-semibold"
                    style={{ color: "var(--text-primary)" }}
                    title={m.offered_crypto != null ? `${fmtCrypto(m.offered_crypto, "USDT")} offered` : ""}>
                    {fmtMoney(m.offered_fiat_value, fiat)}
                  </div>
                  <div className="text-[10px] flex items-center justify-end gap-1"
                    style={{ color: "var(--text-tertiary)" }}>
                    <Layers className="w-3 h-3" />
                    {m.active_ad_count} active ad{m.active_ad_count !== 1 ? "s" : ""}
                  </div>
                  {tradeSize && (
                    <div className="text-[10px] mt-0.5"
                      style={{ color: "var(--text-tertiary)" }}
                      title="Typical trade size (median min–max of their ads)">
                      {tradeSize}
                    </div>
                  )}
                </div>

                <div
                  className="flex-shrink-0 text-right w-[60px]"
                  title="Reliability score 0-100 — 45% completion, 20% release speed, 20% volume, 10% badge, 5% online"
                >
                  <div
                    className="text-[18px] font-bold"
                    style={{
                      color:
                        score >= 70 ? "#16a34a"
                        : score >= 45 ? "var(--brand)"
                        : "var(--text-tertiary)",
                    }}
                  >
                    {score.toFixed(0)}
                  </div>
                  <div className="text-[9px] uppercase tracking-wider"
                    style={{ color: "var(--text-tertiary)" }}>
                    score
                  </div>
                </div>
              </motion.div>
            );
          })}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-16 text-[13px]"
              style={{ color: "var(--text-tertiary)" }}>
              No merchants match the filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
