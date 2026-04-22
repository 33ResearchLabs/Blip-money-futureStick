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
} from "lucide-react";
import SEO from "@/components/SEO";

/* ═══════════════════════════════════════════════
   TYPES
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
  error?: string;
};

/* ═══════════════════════════════════════════════
   FETCHER — calls our own /api/rates Edge function
   (avoids CORS and unreliable public proxies)
   ═══════════════════════════════════════════════ */

async function fetchFromAPI(slug: string, side: Side): Promise<Quote[]> {
  const res = await fetch(
    `/api/rates?source=${slug}&side=${side}`,
    { headers: { accept: "application/json" } },
  );
  if (!res.ok) throw new Error(`${slug} ${res.status}`);
  const json = await res.json();
  if (json?.error && (!json.quotes || json.quotes.length === 0)) {
    throw new Error(String(json.error));
  }
  return (json?.quotes ?? []) as Quote[];
}

const SOURCES: { name: string; slug: string }[] = [
  { name: "Binance P2P", slug: "binance" },
  { name: "Bybit P2P", slug: "bybit" },
  { name: "OKX P2P", slug: "okx" },
  { name: "KuCoin P2P", slug: "kucoin" },
  { name: "HTX P2P", slug: "htx" },
];

/* ═══════════════════════════════════════════════
   GLOBAL SPOT + BASELINE + SIGNAL
   ═══════════════════════════════════════════════ */

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

function readTodayBaseline(price: number, side: Side): number {
  if (typeof window === "undefined") return price;
  const key = `blip-rates-baseline-${side}-${new Date().toISOString().slice(0, 10)}`;
  const stored = localStorage.getItem(key);
  if (stored) {
    const n = parseFloat(stored);
    if (!Number.isNaN(n) && n > 0) return n;
  }
  localStorage.setItem(key, String(price));
  return price;
}

function buildSignal(args: {
  best: number;
  baseline: number;
  spreadPct: number;
  premiumPct: number | null;
}): { text: string; tone: "up" | "down" | "neutral" } {
  const change = ((args.best - args.baseline) / args.baseline) * 100;
  if (args.spreadPct > 0 && args.spreadPct < 0.35) {
    return {
      text: "Spread tightening — good execution window",
      tone: "neutral",
    };
  }
  if (change >= 1) {
    return {
      text: `Rates jumped +${change.toFixed(2)}% today — momentum building`,
      tone: "up",
    };
  }
  if (change <= -1) {
    return {
      text: `Rates dropped ${change.toFixed(2)}% today — cheap entry`,
      tone: "down",
    };
  }
  if (args.premiumPct != null && args.premiumPct >= 12) {
    return {
      text: `Premium at ${args.premiumPct.toFixed(1)}% — India paying above global`,
      tone: "up",
    };
  }
  if (args.premiumPct != null && args.premiumPct <= 2) {
    return {
      text: `Premium near zero (${args.premiumPct.toFixed(1)}%) — rare arb window`,
      tone: "down",
    };
  }
  return {
    text: `Market stable — ${args.premiumPct != null ? args.premiumPct.toFixed(1) + "% premium vs global" : "tracking global spot"}`,
    tone: "neutral",
  };
}

/* ═══════════════════════════════════════════════
   SHARE IMAGE — canvas-rendered 1200×630 OG card
   ═══════════════════════════════════════════════ */

function renderShareImage(args: {
  price: number;
  side: Side;
  source: string;
  premiumPct: number | null;
  globalRate: number | null;
}): Promise<Blob | null> {
  return new Promise((resolve) => {
    const W = 1200;
    const H = 630;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return resolve(null);

    // Background
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#FAF8F5");
    bg.addColorStop(1, "#FFFFFF");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Soft brand corner glow (top-right)
    const glow = ctx.createRadialGradient(W - 100, 100, 10, W - 100, 100, 600);
    glow.addColorStop(0, "rgba(255,107,53,0.22)");
    glow.addColorStop(1, "rgba(255,107,53,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    // Live dot + label
    ctx.fillStyle = "#ff6b35";
    ctx.beginPath();
    ctx.arc(80, 90, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#666";
    ctx.font = "600 18px -apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif";
    ctx.textBaseline = "middle";
    ctx.fillText("LIVE MARKET", 100, 90);

    // Wordmark "Blip Rates"
    ctx.font =
      "800 72px -apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#000";
    ctx.fillText("Blip ", 80, 180);
    const blipW = ctx.measureText("Blip ").width;
    ctx.fillStyle = "#ff6b35";
    ctx.fillText("Rates", 80 + blipW, 180);

    // "USDT / INR · BUY" tag
    ctx.font =
      "600 22px -apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif";
    ctx.fillStyle = "#888";
    ctx.fillText(`USDT / INR · ${args.side === "BUY" ? "Best buy" : "Best sell"}`, 80, 220);

    // Big price
    ctx.font =
      "800 180px -apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif";
    ctx.fillStyle = "#000";
    const priceStr = `₹${args.price.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
    ctx.fillText(priceStr, 72, 400);

    // "/ USDT" suffix
    const priceW = ctx.measureText(priceStr).width;
    ctx.font =
      "600 32px -apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif";
    ctx.fillStyle = "#888";
    ctx.fillText("/ USDT", 88 + priceW, 400);

    // Premium pill
    if (args.premiumPct != null) {
      const up = args.premiumPct >= 0;
      const pillX = 80;
      const pillY = 440;
      const pillText = `${up ? "+" : ""}${args.premiumPct.toFixed(2)}% vs global`;
      ctx.font =
        "700 28px -apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif";
      const pw = ctx.measureText(pillText).width + 56;
      const ph = 56;
      ctx.fillStyle = up ? "rgba(16,185,129,0.16)" : "rgba(239,68,68,0.16)";
      roundRect(ctx, pillX, pillY, pw, ph, 28);
      ctx.fill();
      ctx.fillStyle = up ? "#047857" : "#b91c1c";
      ctx.fillText(pillText, pillX + 28, pillY + ph / 2 + 10);
    }

    // Global spot sub-line
    if (args.globalRate != null) {
      ctx.font =
        "500 22px -apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif";
      ctx.fillStyle = "#666";
      ctx.fillText(
        `Global spot ₹${args.globalRate.toFixed(2)} · India P2P ₹${args.price.toFixed(2)}`,
        80,
        535,
      );
    }

    // Source + URL footer
    ctx.font =
      "600 22px -apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif";
    ctx.fillStyle = "#888";
    ctx.fillText(`Cheapest on ${args.source}`, 80, 580);
    ctx.textAlign = "right";
    ctx.fillStyle = "#ff6b35";
    ctx.fillText("blip.money/blip-rates", W - 80, 580);
    ctx.textAlign = "left";

    canvas.toBlob((b) => resolve(b), "image/png");
  });
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/* ═══════════════════════════════════════════════
   ANIMATED PRICE — smooth count-up on updates
   ═══════════════════════════════════════════════ */

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

/* ═══════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════ */

type AmountUnit = "INR" | "USDT";

const QUICK_AMOUNTS_INR = [10000, 50000, 100000, 500000];
const QUICK_AMOUNTS_USDT = [100, 500, 1000, 5000];
const DEFAULTS: Record<Side, { unit: AmountUnit; amount: string }> = {
  BUY: { unit: "INR", amount: "10000" },
  SELL: { unit: "USDT", amount: "500" },
};

export default function BlipRates() {
  const [amount, setAmount] = useState<string>("10000");
  const [side, setSide] = useState<Side>("BUY");
  const [amountUnit, setAmountUnit] = useState<AmountUnit>("INR");
  const [results, setResults] = useState<SourceResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [lastFetched, setLastFetched] = useState<number | null>(null);
  const [globalRate, setGlobalRate] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const [copied, setCopied] = useState(false);
  const didAutoRun = useRef(false);

  const amountNum = parseFloat(amount) || 0;
  const isBuy = side === "BUY";
  const isINR = amountUnit === "INR";
  const quickAmounts = isINR ? QUICK_AMOUNTS_INR : QUICK_AMOUNTS_USDT;
  const unitSymbol = isINR ? "₹" : "$";
  const amountPlaceholder = isINR ? "10,000" : "500";

  const onSideChange = (next: Side) => {
    if (next === side) return;
    setSide(next);
    setAmountUnit(DEFAULTS[next].unit);
    setAmount(DEFAULTS[next].amount);
  };

  const onUnitChange = (next: AmountUnit) => {
    if (next === amountUnit) return;
    setAmountUnit(next);
    // Reset to that unit's default so it feels clean
    const defaults = isINR ? QUICK_AMOUNTS_USDT[1] : QUICK_AMOUNTS_INR[0];
    setAmount(String(defaults));
  };

  const onAmountInput = (v: string) => {
    // allow only digits + single decimal
    const cleaned = v.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
    setAmount(cleaned);
  };

  const runSearch = useCallback(async () => {
    setLoading(true);
    setSearched(true);
    const [settled, g] = await Promise.all([
      Promise.allSettled(SOURCES.map((s) => fetchFromAPI(s.slug, side))),
      fetchGlobalUsdtInr(),
    ]);
    const out: SourceResult[] = settled.map((r, i) => {
      if (r.status === "fulfilled") {
        return { source: SOURCES[i].name, ok: true, quotes: r.value };
      }
      return { source: SOURCES[i].name, ok: false, quotes: [], error: String(r.reason) };
    });
    setResults(out);
    if (g != null) setGlobalRate(g);
    setLastFetched(Date.now());
    setLoading(false);
  }, [side]);

  // Auto-fetch on first mount so page is instantly useful
  useEffect(() => {
    if (didAutoRun.current) return;
    didAutoRun.current = true;
    runSearch();
  }, [runSearch]);

  // Tick "updated Xs ago"
  useEffect(() => {
    if (!lastFetched) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [lastFetched]);

  // Flatten + filter + rank for current amount
  const ranked = useMemo(() => {
    const all = results.flatMap((r) => r.quotes).filter((q) => q.price > 0);
    if (all.length === 0) return [];
    const sortedPrices = [...all.map((q) => q.price)].sort((a, b) => a - b);
    const medianPrice = sortedPrices[Math.floor(sortedPrices.length / 2)];
    // Convert user amount to INR for limit filtering
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

  const baseline = best ? readTodayBaseline(best.price, side) : 0;
  const signal = best
    ? buildSignal({
        best: best.price,
        baseline,
        spreadPct,
        premiumPct,
      })
    : null;

  const secondsAgo = lastFetched
    ? Math.max(0, Math.floor((now - lastFetched) / 1000))
    : 0;

  const shareText = best
    ? `USDT/INR is ₹${best.price.toFixed(2)} right now${
        premiumPct != null
          ? ` (${premiumPct >= 0 ? "+" : ""}${premiumPct.toFixed(1)}% premium vs global)`
          : ""
      } — live at blip.money/blip-rates`
    : "";

  const [shareHint, setShareHint] = useState<string | null>(null);
  const flashHint = (msg: string) => {
    setShareHint(msg);
    setTimeout(() => setShareHint(null), 2400);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText("https://blip.money/blip-rates");
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  // On mobile, native share sheet attaches the PNG when user picks WA/TG.
  // On desktop, copy the PNG to the clipboard AND open the chat with text,
  // so the user can paste the image into the conversation.
  const shareTo = async (channel: "whatsapp" | "telegram") => {
    if (!best) return;
    const blob = await renderShareImage({
      price: best.price,
      side,
      source: best.source,
      premiumPct,
      globalRate,
    });
    if (!blob) return;

    const file = new File([blob], "blip-rates.png", { type: "image/png" });
    const nav = navigator as Navigator & {
      canShare?: (d: { files?: File[] }) => boolean;
      share?: (d: {
        files?: File[];
        title?: string;
        text?: string;
      }) => Promise<void>;
    };

    // Mobile path — native share sheet with image + text
    if (nav.canShare?.({ files: [file] }) && nav.share) {
      try {
        await nav.share({
          files: [file],
          title: "Blip Rates",
          text: shareText,
        });
        return;
      } catch {
        // user cancelled — fall through to desktop path
      }
    }

    // Desktop path — copy image to clipboard, then open chat app
    let clipboardOk = false;
    try {
      if ("ClipboardItem" in window && navigator.clipboard?.write) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        clipboardOk = true;
      }
    } catch {}

    if (!clipboardOk) {
      // Final fallback: download so the user has the image to attach manually
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `blip-rates-${new Date().toISOString().slice(0, 10)}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      flashHint("Image downloaded — attach it in chat");
    } else {
      flashHint("Image copied — paste with Ctrl/⌘+V in chat");
    }

    const chatUrl =
      channel === "whatsapp"
        ? `https://wa.me/?text=${encodeURIComponent(shareText)}`
        : `https://t.me/share/url?url=${encodeURIComponent("https://blip.money/blip-rates")}&text=${encodeURIComponent(shareText)}`;
    window.open(chatUrl, "_blank", "noopener");
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch();
  };

  return (
    <>
      <SEO
        title="Blip Rates — Live USDT/INR P2P Prices from Binance, Bybit, OKX & more"
        description="Search live USDT to INR rates across every major P2P exchange. Find the cheapest price in seconds. No login, no paywall."
        canonical="https://blip.money/blip-rates"
        keywords="usdt to inr, usdt inr rate, binance p2p, bybit p2p, buy usdt india, sell usdt india, p2p usdt"
      />

      <main
        className="min-h-screen"
        style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
      >
        <div className="max-w-3xl mx-auto px-6 pt-24 md:pt-28 pb-24">
          {/* Wordmark — subtle */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-10"
          >
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-4 text-[11px] font-semibold uppercase tracking-wider"
              style={{
                background: "#fff",
                border: "1px solid var(--border-default)",
                color: "var(--text-tertiary)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: "var(--brand)" }}
              />
              Live market
            </div>
            <h1
              className="font-bold tracking-tight"
              style={{
                fontSize: "clamp(3rem, 7vw, 5.5rem)",
                letterSpacing: "-0.05em",
                lineHeight: 1,
                color: "var(--text-primary)",
              }}
            >
              Blip <span style={{ color: "var(--brand)" }}>Rates</span>
            </h1>
            <p
              className="mt-3 text-sm md:text-base max-w-xl mx-auto"
              style={{ color: "var(--text-tertiary)" }}
            >
              The real USDT/INR market price in India — not exchange price.
            </p>
          </motion.div>

          {/* Search box — majestic */}
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mb-5 relative"
          >
            {/* Side toggle pill */}
            <div className="flex justify-center mb-4">
              <div
                className="inline-flex items-center gap-1 p-1 rounded-full"
                style={{
                  background: "#fff",
                  border: "1px solid var(--border-default)",
                }}
              >
                {(["BUY", "SELL"] as Side[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => onSideChange(s)}
                    className="px-5 py-1.5 rounded-full text-xs md:text-sm font-semibold transition"
                    style={{
                      background:
                        side === s ? "var(--text-primary)" : "transparent",
                      color: side === s ? "#fff" : "var(--text-secondary)",
                    }}
                  >
                    {s === "BUY" ? "Buy USDT" : "Sell USDT"}
                  </button>
                ))}
              </div>
            </div>

            {/* Hero search bar */}
            <div
              className="relative rounded-[28px] transition-all"
              style={{
                background: "#ffffff",
                border: "1px solid var(--border-default)",
                boxShadow:
                  "0 24px 60px -30px rgba(255,107,53,0.22), 0 8px 24px -10px rgba(0,0,0,0.08)",
              }}
            >
              <div
                aria-hidden
                className="absolute inset-0 -z-10 blur-3xl opacity-50 rounded-[28px] pointer-events-none"
                style={{
                  background:
                    "radial-gradient(70% 100% at 50% 50%, rgba(255,107,53,0.18) 0%, rgba(255,107,53,0) 70%)",
                }}
              />

              <div className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-3.5 md:py-5">
                <motion.span
                  key={unitSymbol}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="font-bold shrink-0 tabular-nums leading-none"
                  style={{
                    fontSize: "clamp(1.75rem, 4.2vw, 3rem)",
                    letterSpacing: "-0.035em",
                    color: "var(--text-tertiary)",
                  }}
                >
                  {unitSymbol}
                </motion.span>

                <input
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  value={amount}
                  onChange={(e) => onAmountInput(e.target.value)}
                  placeholder={amountPlaceholder}
                  aria-label={`Amount in ${amountUnit}`}
                  className="flex-1 bg-transparent outline-none font-bold tabular-nums min-w-0 placeholder:opacity-25 leading-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  style={{
                    fontSize: "clamp(1.75rem, 4.2vw, 3rem)",
                    letterSpacing: "-0.035em",
                    color: "var(--text-primary)",
                    caretColor: "var(--brand)",
                  }}
                />

                {/* INR / USDT unit toggle */}
                <div
                  className="inline-flex items-center p-0.5 rounded-full shrink-0"
                  style={{
                    background: "var(--bg-tertiary)",
                    border: "1px solid var(--border-default)",
                  }}
                >
                  {(["INR", "USDT"] as AmountUnit[]).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => onUnitChange(u)}
                      className="px-2.5 py-1 rounded-full text-[11px] font-semibold transition"
                      style={{
                        background:
                          amountUnit === u ? "#fff" : "transparent",
                        color:
                          amountUnit === u
                            ? "var(--text-primary)"
                            : "var(--text-muted)",
                        boxShadow:
                          amountUnit === u ? "var(--shadow-sm)" : "none",
                      }}
                    >
                      {u}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={loading || !amountNum}
                  className="shrink-0 rounded-full font-semibold transition hover:brightness-110 active:scale-95 disabled:opacity-50 w-11 h-11 md:w-12 md:h-12 flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--brand) 0%, #ff8c50 100%)",
                    color: "#fff",
                    boxShadow: "0 10px 24px rgba(255,107,53,0.4)",
                  }}
                  aria-label="Search rates"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Search size={18} strokeWidth={2.5} />
                  )}
                </button>
              </div>
            </div>

            {/* Quick amount chips */}
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
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
                    className="px-3 py-1.5 rounded-full text-xs font-medium transition"
                    style={{
                      background: active ? "var(--text-primary)" : "#fff",
                      border: `1px solid ${active ? "var(--text-primary)" : "var(--border-default)"}`,
                      color: active ? "#fff" : "var(--text-secondary)",
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </motion.form>

          {/* Results */}
          <AnimatePresence mode="wait">
            {searched && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-8"
              >
                {loading && ranked.length === 0 ? (
                  <div
                    className="text-center py-16"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    <Loader2
                      size={28}
                      className="animate-spin mx-auto mb-3"
                      style={{ color: "var(--brand)" }}
                    />
                    Fetching live rates from {SOURCES.length} exchanges…
                  </div>
                ) : ranked.length === 0 ? (
                  <div
                    className="text-center py-16 rounded-3xl"
                    style={{
                      background: "#fff",
                      border: "1px solid var(--border-default)",
                    }}
                  >
                    <p style={{ color: "var(--text-secondary)" }}>
                      No listings found for ₹{amountNum.toLocaleString("en-IN")}.
                      Try a different amount.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Global vs P2P comparison */}
                    {globalRate && (
                      <div
                        className="rounded-2xl px-5 py-4 mb-4 flex items-center justify-between gap-4 flex-wrap"
                        style={{
                          background: "#fff",
                          border: "1px solid var(--border-default)",
                        }}
                      >
                        <div className="flex items-center gap-6 flex-wrap">
                          <div>
                            <div
                              className="text-[11px] uppercase tracking-wider font-semibold"
                              style={{ color: "var(--text-muted)" }}
                            >
                              Global spot
                            </div>
                            <div className="text-lg font-bold tabular-nums">
                              ₹<AnimatedPrice value={globalRate} />
                            </div>
                          </div>
                          <motion.div
                            animate={{ x: [0, 4, 0] }}
                            transition={{
                              duration: 2.2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            className="text-xl"
                            style={{ color: "var(--brand)" }}
                          >
                            →
                          </motion.div>
                          <div>
                            <div
                              className="text-[11px] uppercase tracking-wider font-semibold"
                              style={{ color: "var(--text-muted)" }}
                            >
                              India P2P
                            </div>
                            <div className="text-lg font-bold tabular-nums">
                              ₹<AnimatedPrice value={best.price} />
                            </div>
                          </div>
                        </div>
                        {premiumPct != null && (
                          <motion.div
                            key={`prem-${Math.round(premiumPct * 10)}`}
                            initial={{ scale: 0.95, opacity: 0.6 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="px-3 py-2 rounded-xl flex items-center gap-2"
                            style={{
                              background:
                                premiumPct >= 0
                                  ? "rgba(16, 185, 129, 0.14)"
                                  : "rgba(239, 68, 68, 0.14)",
                              color: premiumPct >= 0 ? "#047857" : "#b91c1c",
                            }}
                          >
                            {premiumPct >= 0 ? (
                              <TrendingUp size={16} />
                            ) : (
                              <TrendingDown size={16} />
                            )}
                            <div className="leading-tight">
                              <div className="text-[10px] uppercase tracking-wider font-semibold opacity-90">
                                Premium
                              </div>
                              <div className="text-base font-bold tabular-nums">
                                {premiumPct >= 0 ? "+" : ""}
                                <AnimatedPrice value={premiumPct} />%
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}

                    {/* Hero — live market signal */}
                    <div
                      className="rounded-2xl p-6 mb-4"
                      style={{
                        background: "#fff",
                        border: "1px solid var(--border-default)",
                      }}
                    >
                      <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                          <div
                            className="flex items-center gap-1.5 mb-2 text-xs font-semibold uppercase tracking-wider"
                            style={{ color: "var(--text-tertiary)" }}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full animate-pulse"
                              style={{ background: "var(--brand)" }}
                            />
                            Best rate right now
                          </div>
                          <motion.div
                            key={best.price}
                            initial={{ scale: 0.98, opacity: 0.6 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{
                              duration: 0.35,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                            className="font-bold tracking-tight tabular-nums"
                            style={{
                              fontSize: "clamp(2rem, 4.5vw, 2.75rem)",
                              lineHeight: 1,
                              color: "var(--text-primary)",
                            }}
                          >
                            ₹<AnimatedPrice value={best.price} />
                            <span
                              className="text-sm font-medium ml-2"
                              style={{ color: "var(--text-tertiary)" }}
                            >
                              / USDT
                            </span>
                          </motion.div>
                          <div
                            className="text-sm mt-2"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            on {best.source} — {(() => {
                              const usdt = isINR
                                ? amountNum / best.price
                                : amountNum;
                              const inr = isINR
                                ? amountNum
                                : amountNum * best.price;
                              const usdtStr =
                                usdt.toFixed(2) + " USDT";
                              const inrStr =
                                "₹" +
                                inr.toLocaleString("en-IN", {
                                  maximumFractionDigits: 0,
                                });
                              if (isBuy) {
                                return (
                                  <>
                                    you pay{" "}
                                    <b style={{ color: "var(--text-primary)" }}>
                                      {inrStr}
                                    </b>{" "}
                                    → get{" "}
                                    <b style={{ color: "var(--text-primary)" }}>
                                      {usdtStr}
                                    </b>
                                  </>
                                );
                              }
                              return (
                                <>
                                  you sell{" "}
                                  <b style={{ color: "var(--text-primary)" }}>
                                    {usdtStr}
                                  </b>{" "}
                                  → get{" "}
                                  <b style={{ color: "var(--text-primary)" }}>
                                    {inrStr}
                                  </b>
                                </>
                              );
                            })()}
                          </div>
                          <div
                            className="text-xs mt-1.5"
                            style={{ color: "var(--text-muted)" }}
                          >
                            ₹{spread.toFixed(2)} spread across {ranked.length}{" "}
                            listings · updated {secondsAgo}s ago
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-1.5 flex-wrap justify-end">
                            <button
                              onClick={() => shareTo("whatsapp")}
                              className="inline-flex items-center justify-center text-xs font-semibold px-3.5 py-2 rounded-full transition hover:brightness-110 active:scale-95"
                              style={{
                                background: "#25D366",
                                color: "#fff",
                                boxShadow: "0 6px 16px rgba(37,211,102,0.35)",
                              }}
                              title="Share on WhatsApp with image"
                            >
                              WhatsApp
                            </button>
                            <button
                              onClick={() => shareTo("telegram")}
                              className="inline-flex items-center justify-center text-xs font-semibold px-3.5 py-2 rounded-full transition hover:brightness-110 active:scale-95"
                              style={{
                                background: "#229ED9",
                                color: "#fff",
                                boxShadow: "0 6px 16px rgba(34,158,217,0.35)",
                              }}
                              title="Share on Telegram with image"
                            >
                              Telegram
                            </button>
                            <button
                              onClick={copyLink}
                              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-full transition"
                              style={{
                                background: "var(--bg-tertiary)",
                                color: "var(--text-secondary)",
                              }}
                              title="Copy link"
                            >
                              {copied ? (
                                <>
                                  <Check size={12} /> Copied
                                </>
                              ) : (
                                <>
                                  <Copy size={12} /> Copy link
                                </>
                              )}
                            </button>
                          </div>
                          <AnimatePresence>
                            {shareHint && (
                              <motion.div
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                transition={{ duration: 0.2 }}
                                className="text-[11px] font-medium"
                                style={{ color: "var(--brand)" }}
                              >
                                {shareHint}
                              </motion.div>
                            )}
                          </AnimatePresence>
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
                            Refresh
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Market signal line */}
                    {signal && (
                      <div
                        className="flex items-center gap-2 px-4 py-3 mb-2 rounded-xl"
                        style={{
                          background:
                            signal.tone === "up"
                              ? "rgba(16, 185, 129, 0.08)"
                              : signal.tone === "down"
                                ? "rgba(239, 68, 68, 0.08)"
                                : "var(--bg-tertiary)",
                          color:
                            signal.tone === "up"
                              ? "#059669"
                              : signal.tone === "down"
                                ? "#dc2626"
                                : "var(--text-secondary)",
                        }}
                      >
                        <Zap size={14} />
                        <span className="text-sm font-semibold">{signal.text}</span>
                      </div>
                    )}

                    {/* Trust line */}
                    <div
                      className="text-xs mb-6 px-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Based on top listings from {results.filter((r) => r.ok && r.quotes.length > 0).map((r) => r.source).join(", ") || "P2P exchanges"}.
                    </div>

                    {/* Listings table */}
                    <div
                      className="rounded-3xl overflow-hidden"
                      style={{
                        background: "#fff",
                        border: "1px solid var(--border-default)",
                      }}
                    >
                      <div
                        className="hidden md:grid grid-cols-[1fr_110px_130px_1.2fr_110px] gap-4 px-6 py-3 text-xs font-semibold uppercase tracking-wider"
                        style={{
                          background: "var(--bg-tertiary)",
                          color: "var(--text-tertiary)",
                          borderBottom: "1px solid var(--border-default)",
                        }}
                      >
                        <div>Exchange</div>
                        <div className="text-right">Price (₹)</div>
                        <div className="text-right">You get</div>
                        <div>Merchant</div>
                        <div className="text-right">Go</div>
                      </div>

                      {ranked.slice(0, 15).map((q, i) => {
                        const youGet = isINR
                          ? (amountNum / q.price).toFixed(2) + " USDT"
                          : "₹" +
                            (amountNum * q.price).toLocaleString("en-IN", {
                              maximumFractionDigits: 0,
                            });
                        const diff = ((q.price - best.price) / best.price) * 100;
                        return (
                          <div
                            key={i}
                            className="grid grid-cols-[1fr_auto] md:grid-cols-[1fr_110px_130px_1.2fr_110px] gap-x-4 gap-y-1 px-6 py-4 items-center"
                            style={{
                              borderBottom:
                                i === ranked.slice(0, 15).length - 1
                                  ? "none"
                                  : "1px solid var(--border-subtle)",
                              background:
                                i === 0 ? "var(--bg-tertiary)" : "transparent",
                              boxShadow:
                                i === 0
                                  ? "inset 3px 0 0 var(--brand)"
                                  : "none",
                            }}
                          >
                            {/* Exchange */}
                            <div className="flex items-center gap-2 min-w-0">
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                                style={{
                                  background:
                                    i === 0
                                      ? "var(--text-primary)"
                                      : "var(--bg-tertiary)",
                                  color:
                                    i === 0 ? "#fff" : "var(--text-primary)",
                                  border:
                                    i === 0
                                      ? "none"
                                      : "1px solid var(--border-default)",
                                }}
                              >
                                {q.source.charAt(0)}
                              </div>
                              <div className="min-w-0">
                                <div className="font-semibold text-sm truncate">
                                  {q.source}
                                </div>
                                {i === 0 && (
                                  <div
                                    className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide"
                                    style={{ color: "var(--text-tertiary)" }}
                                  >
                                    <TrendingDown size={10} /> Cheapest
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Price */}
                            <div className="md:text-right">
                              <div className="font-bold text-base tabular-nums">
                                ₹<AnimatedPrice value={q.price} />
                              </div>
                              {i > 0 && (
                                <div
                                  className="text-[11px]"
                                  style={{ color: "var(--text-muted)" }}
                                >
                                  +{diff.toFixed(2)}%
                                </div>
                              )}
                            </div>

                            {/* You get */}
                            <div
                              className="md:text-right text-sm font-medium hidden md:block"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              {youGet}
                            </div>

                            {/* Merchant */}
                            <div className="hidden md:block min-w-0">
                              <div className="text-sm font-medium truncate">
                                {q.merchant}
                              </div>
                              <div
                                className="text-[11px]"
                                style={{ color: "var(--text-muted)" }}
                              >
                                {q.completionRate != null &&
                                  `${(q.completionRate * 100).toFixed(1)}% · `}
                                {q.orders != null && `${q.orders} orders`}
                              </div>
                            </div>

                            {/* CTA */}
                            <div className="md:text-right">
                              <a
                                href={q.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold transition hover:brightness-110 active:scale-95"
                                style={{
                                  background:
                                    i === 0
                                      ? "linear-gradient(135deg, var(--brand) 0%, #ff8c50 100%)"
                                      : "#fff",
                                  color: i === 0 ? "#fff" : "var(--text-primary)",
                                  border:
                                    i === 0
                                      ? "none"
                                      : "1px solid var(--border-default)",
                                  boxShadow:
                                    i === 0
                                      ? "0 6px 18px rgba(255,107,53,0.38)"
                                      : "none",
                                }}
                              >
                                Trade
                                <ExternalLink size={11} />
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Source status footer */}
                    <div
                      className="mt-4 flex flex-wrap items-center justify-between gap-2 px-2 text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <div className="flex flex-wrap gap-3">
                        {results.map((r) => (
                          <span key={r.source} className="flex items-center gap-1.5">
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{
                                background: r.ok && r.quotes.length > 0
                                  ? "#10b981"
                                  : "#ef4444",
                              }}
                            />
                            {r.source}
                          </span>
                        ))}
                      </div>
                      {lastFetched && <span>Updated {secondsAgo}s ago</span>}
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>
    </>
  );
}
