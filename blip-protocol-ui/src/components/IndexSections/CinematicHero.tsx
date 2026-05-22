import { useEffect, useRef, useState, useMemo, memo } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Loader2,
  AlertCircle,
  Lock,
} from "lucide-react";
import {
  MerchantDashboardBody,
  useMerchantDashboardState,
} from "./LiveMerchantDashboard";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ────────────────────────────────────────────────────────────
   Quiet global network — sits behind everything as ambient
   texture, never as a focal element. No arcs flashing, no
   node pulses. Just an intelligent map breathing slowly.
   ──────────────────────────────────────────────────────────── */
const NODES = [
  { id: "MUM", x: 71, y: 56 },
  { id: "DEL", x: 70, y: 47 },
  { id: "DXB", x: 63, y: 52 },
  { id: "MNL", x: 86.5, y: 60 },
  { id: "SIN", x: 81.5, y: 67 },
  { id: "BKK", x: 81, y: 60 },
  { id: "LON", x: 48, y: 38 },
  { id: "NYC", x: 26, y: 45 },
  { id: "TYO", x: 89, y: 47 },
  { id: "LAG", x: 49, y: 65 },
];

/* Four corridors — minimal, all cool tones, slow flow */
const ARCS = [
  { from: "DXB", to: "MUM" },
  { from: "SIN", to: "MUM" },
  { from: "LON", to: "DXB" },
  { from: "NYC", to: "MUM" },
];

function QuietNetwork() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      setTilt({
        x: ((e.clientX - cx) / cx) * 6,
        y: ((e.clientY - cy) / cy) * 4,
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const arcs = useMemo(
    () =>
      ARCS.map((a, i) => {
        const from = NODES.find((n) => n.id === a.from)!;
        const to = NODES.find((n) => n.id === a.to)!;
        const mx = (from.x + to.x) / 2;
        const my = (from.y + to.y) / 2 - 7;
        return {
          d: `M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`,
          delay: i * 1.4,
        };
      }),
    [],
  );

  const landDots = useMemo(() => {
    const out: { x: number; y: number; r: number; o: number }[] = [];
    for (let i = 0; i < 180; i++) {
      const seed = i * 9301 + 49297;
      const x = seed % 100;
      const y = ((seed * 1.37) % 38) + 8;
      const isLand =
        (x < 30 && y > 12 && y < 45) ||
        (x > 40 && x < 58 && y > 6 && y < 42) ||
        (x > 58 && x < 95 && y > 10 && y < 42);
      if (!isLand) continue;
      out.push({
        x,
        y,
        r: 0.07 + (seed % 7 === 0 ? 0.05 : 0),
        o: 0.07 + ((seed * 7) % 100) / 1800,
      });
    }
    return out;
  }, []);

  return (
    <motion.svg
      viewBox="0 0 100 50"
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="xMidYMid slice"
      animate={{ x: tilt.x, y: tilt.y }}
      transition={{ type: "spring", stiffness: 35, damping: 18, mass: 0.6 }}
    >
      {/* Latitude hairlines — extremely subtle */}
      {[14, 26, 38].map((y) => (
        <line
          key={y}
          x1="0"
          x2="100"
          y1={y}
          y2={y}
          stroke="rgba(255,255,255,0.025)"
          strokeWidth="0.1"
        />
      ))}

      {/* Continent dots */}
      {landDots.map((d, i) => (
        <circle
          key={i}
          cx={d.x}
          cy={d.y}
          r={d.r}
          fill={`rgba(180,200,240,${d.o})`}
        />
      ))}

      {/* Corridor arcs — slow, cool, no warm tones */}
      {arcs.map((arc, i) => (
        <g key={i}>
          <path
            d={arc.d}
            fill="none"
            stroke="rgba(110,170,255,0.12)"
            strokeWidth="0.12"
          />
          <motion.path
            d={arc.d}
            fill="none"
            stroke="rgba(150,200,255,0.7)"
            strokeWidth="0.16"
            strokeLinecap="round"
            strokeDasharray="2 36"
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: -38 }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "linear",
              delay: arc.delay,
            }}
            opacity={0.85}
          />
        </g>
      ))}

      {/* City nodes — static, no pulses */}
      {NODES.map((n) => (
        <circle
          key={n.id}
          cx={n.x}
          cy={n.y}
          r="0.32"
          fill="rgba(200,220,255,0.85)"
        />
      ))}
    </motion.svg>
  );
}

/* ────────────────────────────────────────────────────────────
   Send/Receive — clean vertical stack (Wise-style).
   Send on top, Receive below, tagline beneath.
   ──────────────────────────────────────────────────────────── */
const FIATS = [
  { code: "INR", symbol: "₹", flag: "🇮🇳", rate: 97.85, locale: "en-IN", digits: 0 },
  { code: "AED", symbol: "AED", flag: "🇦🇪", rate: 3.665, locale: "en-AE", digits: 2 },
  { code: "PHP", symbol: "₱", flag: "🇵🇭", rate: 55.81, locale: "en-PH", digits: 0 },
  { code: "THB", symbol: "฿", flag: "🇹🇭", rate: 35.4, locale: "en-TH", digits: 0 },
];

export function SendReceiveWidget({
  isInView,
  onSend,
  sending,
  availableBalance,
  sendAmount,
  setSendAmount,
  fiatIdx,
  setFiatIdx,
}: {
  isInView: boolean;
  onSend: (order: InlineOrder, numericAmount: number) => void;
  sending: boolean;
  availableBalance: number;
  sendAmount: string;
  setSendAmount: (v: string) => void;
  fiatIdx: number;
  setFiatIdx: (fn: (i: number) => number) => void;
}) {
  const fiat = FIATS[fiatIdx];

  const numeric = useMemo(() => {
    const n = parseFloat(sendAmount.replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? n : 0;
  }, [sendAmount]);
  const receive = useMemo(() => numeric * fiat.rate, [numeric, fiat.rate]);
  const fmt = (n: number) =>
    n.toLocaleString(fiat.locale, {
      minimumFractionDigits: fiat.digits,
      maximumFractionDigits: fiat.digits,
    });

  const insufficient = numeric > availableBalance;
  const canSend = !sending && numeric > 0 && !insufficient;

  const handleSend = () => {
    if (!canSend) return;
    const profit = (numeric * 0.0018).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    onSend(
      {
        id: `usr-${Date.now()}`,
        pair: `USD → ${fiat.code}`,
        amount: `$${numeric.toLocaleString("en-US")}`,
        payout: `${fiat.symbol === "AED" ? "AED " : fiat.symbol}${fmt(receive)}`,
        rate: `${fiat.symbol === "AED" ? "AED " : fiat.symbol}${fiat.rate}`,
        merchant: "AlphaFX",
        profit: `+$${profit}`,
      },
      numeric,
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, ease: EASE, delay: 0.4 }}
      className="w-full max-w-[640px] mx-auto mb-5"
    >
      {/* Single-line widget */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background:
            "rgba(255,255,255,0.035)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          boxShadow:
            "0 18px 50px -28px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.04) inset",
        }}
      >
        <div className="grid grid-cols-[1fr_auto_1fr_auto] items-stretch">
          {/* Send */}
          <label className="block px-4 py-3 text-left cursor-text min-w-0">
            <div className="text-[9px] font-semibold tracking-[0.22em] uppercase text-white/40 mb-1">
              You send
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-baseline gap-1 flex-1 min-w-0">
                <span className="font-mono text-[14px] font-semibold text-white/55 tabular-nums">
                  $
                </span>
                <input
                  inputMode="decimal"
                  value={sendAmount}
                  onChange={(e) =>
                    setSendAmount(e.target.value.replace(/[^0-9.,]/g, ""))
                  }
                  className="bg-transparent border-0 outline-none w-full font-mono text-[18px] md:text-[20px] font-semibold tracking-tight text-white tabular-nums placeholder:text-white/25 min-w-0"
                  placeholder="0"
                  aria-label="Send amount"
                />
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-white/10 bg-white/[0.04] shrink-0">
                <span className="text-[10px]">💵</span>
                <span className="text-[10px] font-semibold tracking-tight text-white">
                  USDT
                </span>
              </span>
            </div>
          </label>

          {/* Divider with arrow */}
          <div className="relative flex items-center justify-center px-1">
            <div className="absolute inset-y-3 left-1/2 w-px bg-white/[0.08]" />
            <div
              className="relative z-10 w-7 h-7 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(110,170,255,0.10)",
                border: "1px solid rgba(110,170,255,0.22)",
              }}
            >
              <ArrowRight className="w-3 h-3 text-[#a8c8ff]" />
            </div>
          </div>

          {/* Receive */}
          <div className="block px-4 py-3 text-right min-w-0">
            <div className="text-[9px] font-semibold tracking-[0.22em] uppercase text-white/40 mb-1">
              They get
            </div>
            <div className="flex items-center gap-2 justify-end">
              <button
                type="button"
                onClick={() => setFiatIdx((i) => (i + 1) % FIATS.length)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-colors shrink-0"
                aria-label="Change currency"
              >
                <span className="text-[11px]">{fiat.flag}</span>
                <span className="text-[10px] font-semibold tracking-tight text-white">
                  {fiat.code}
                </span>
                <span className="text-white/35 text-[8px]">▾</span>
              </button>
              <div className="flex items-baseline gap-1 min-w-0">
                <span className="font-mono text-[14px] font-semibold text-white/55 tabular-nums">
                  {fiat.symbol === "AED" ? "AED " : fiat.symbol}
                </span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={`${fiat.code}-${receive}`}
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -3 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className="font-mono text-[18px] md:text-[20px] font-semibold tracking-tight text-white tabular-nums truncate"
                  >
                    {fmt(receive)}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Send button */}
          <div className="px-2 py-2 flex items-center">
            <button
              type="button"
              onClick={handleSend}
              disabled={!canSend}
              className="group inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-full bg-white text-black text-[12.5px] font-semibold tracking-tight transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_1px_0_rgba(255,255,255,0.4)_inset,0_6px_20px_-8px_rgba(255,255,255,0.25)] hover:not(:disabled):-translate-y-[1px] active:not(:disabled):scale-[0.985] whitespace-nowrap"
            >
              {sending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={2.5} />
                  <span>Sending</span>
                </>
              ) : (
                <>
                  <span>Send</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer rate strip + balance/validation */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-white/[0.05] bg-white/[0.012] text-[10.5px] tracking-tight">
          <div className="flex items-center gap-1.5">
            <span className="relative flex w-1 h-1">
              <span className="absolute inset-0 rounded-full bg-[#cc785c] opacity-60 animate-ping" />
              <span className="relative inline-flex rounded-full w-1 h-1 bg-[#cc785c]" />
            </span>
            <span className="text-white/45">
              1 USD ={" "}
              <span className="font-mono text-white/85 tabular-nums">
                {fiat.symbol === "AED" ? "AED " : fiat.symbol}
                {fiat.rate.toLocaleString("en-US", {
                  minimumFractionDigits: fiat.code === "AED" ? 4 : 2,
                  maximumFractionDigits: fiat.code === "AED" ? 4 : 2,
                })}
              </span>
            </span>
          </div>
          {insufficient ? (
            <div className="flex items-center gap-1.5 text-[#ff9b6a]">
              <AlertCircle className="w-3 h-3" strokeWidth={2.5} />
              <span className="font-medium">Insufficient balance</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-white/40">
              <span>
                Avail{" "}
                <span className="font-mono text-white/65 tabular-nums">
                  $
                  {availableBalance.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </span>
              <span className="text-white/20">·</span>
              <span>&lt; 60s</span>
              <span className="text-white/20">·</span>
              <span>0% fee</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────
   Stacked field box used for Send + Receive
   ──────────────────────────────────────────────────────────── */
function FieldBox({
  label,
  suffix,
  suffixIcon,
  onSuffixClick,
  children,
  compact = false,
}: {
  label: string;
  suffix: string;
  suffixIcon?: string;
  onSuffixClick?: () => void;
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <label
      className="block relative rounded-xl cursor-text overflow-hidden"
      style={{
        background:
          "rgba(255,255,255,0.035)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        boxShadow:
          "0 14px 36px -22px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.04) inset",
      }}
    >
      <div className={`flex items-center justify-between ${compact ? "px-3.5 py-2.5" : "px-5 py-4"}`}>
        <div className="flex-1 min-w-0">
          <div className={`text-[9px] font-semibold tracking-[0.22em] uppercase text-white/40 ${compact ? "mb-1" : "mb-2"}`}>
            {label}
          </div>
          {children}
        </div>
        {onSuffixClick ? (
          <button
            type="button"
            onClick={onSuffixClick}
            className={`flex items-center gap-1 ml-2.5 ${compact ? "px-2 py-1" : "px-3 py-2"} rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-colors shrink-0`}
            aria-label="Change currency"
          >
            {suffixIcon && <span className={compact ? "text-[12px]" : "text-[14px]"}>{suffixIcon}</span>}
            <span className={`${compact ? "text-[10.5px]" : "text-[11.5px]"} font-semibold tracking-tight text-white`}>
              {suffix}
            </span>
            <span className="text-white/35 text-[8.5px]">▾</span>
          </button>
        ) : (
          <div className={`flex items-center gap-1 ml-2.5 ${compact ? "px-2 py-1" : "px-3 py-2"} rounded-full border border-white/10 bg-white/[0.04] shrink-0`}>
            {suffixIcon && <span className={compact ? "text-[12px]" : "text-[14px]"}>{suffixIcon}</span>}
            <span className={`${compact ? "text-[10.5px]" : "text-[11.5px]"} font-semibold tracking-tight text-white`}>
              {suffix}
            </span>
          </div>
        )}
      </div>
    </label>
  );
}

/* ────────────────────────────────────────────────────────────
   Inline Merchant Dashboard — compact version that lives in
   the bottom half of the hero. Auto-cycles new orders through
   Incoming → Settling → Settled every ~2.6s.
   ──────────────────────────────────────────────────────────── */
export type InlineOrder = {
  id: string;
  pair: string;
  amount: string;
  payout: string;
  rate: string;
  merchant: string;
  profit: string;
};

const INLINE_ORDER_POOL: Omit<InlineOrder, "id">[] = [
  { pair: "USDT → INR", amount: "$2,400", payout: "₹2,14,608", rate: "₹89.42", merchant: "AlphaFX", profit: "+$4.20" },
  { pair: "USDT → AED", amount: "$5,100", payout: "AED 18,720", rate: "3.671", merchant: "GulfTrade", profit: "+$9.18" },
  { pair: "USDT → PHP", amount: "$850", payout: "₱47,438", rate: "55.81", merchant: "NovaP2P", profit: "+$1.53" },
  { pair: "USDT → INR", amount: "$1,200", payout: "₹1,07,304", rate: "₹89.42", merchant: "SwiftExch", profit: "+$2.16" },
  { pair: "USDT → THB", amount: "$3,400", payout: "฿120,360", rate: "35.4", merchant: "CedarFX", profit: "+$6.12" },
  { pair: "USDT → INR", amount: "$1,800", payout: "₹1,60,956", rate: "₹89.42", merchant: "AlphaFX", profit: "+$3.24" },
];

function makeInlineOrder(seq: number): InlineOrder {
  const seed = INLINE_ORDER_POOL[seq % INLINE_ORDER_POOL.length];
  return { ...seed, id: `inline-ord-${seq}` };
}

export type DashNotification = {
  id: string;
  kind: "info" | "warn" | "success";
  title: string;
  meta?: string;
};

export function InlineMerchantDashboard({
  balance,
  totalEarned,
  pending,
  inProgress,
  completed,
  notifications,
  currentSend,
  currentFiat,
}: {
  balance: number;
  totalEarned: number;
  pending: InlineOrder | null;
  inProgress: InlineOrder | null;
  completed: InlineOrder[];
  notifications: DashNotification[];
  currentSend: string;
  currentFiat: string;
}) {

  const isIdle = !pending && !inProgress;
  const balanceFmt = balance.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const earnedFmt = totalEarned.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: EASE, delay: 0.7 }}
      className="relative rounded-2xl overflow-hidden"
      style={{
        /* Spotlight: break out of the 1180px main, span ~92vw */
        width: "92vw",
        maxWidth: 1480,
        marginLeft: "calc(50% - min(46vw, 740px))",
        marginRight: "calc(50% - min(46vw, 740px))",
        background:
          "rgba(255,255,255,0.035)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow:
          "0 40px 90px -32px rgba(0,0,0,0.7), 0 1px 0 rgba(255,255,255,0.04) inset",
      }}
    >
      {/* Chrome bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-white/15" />
            <span className="w-2 h-2 rounded-full bg-white/15" />
            <span className="w-2 h-2 rounded-full bg-white/15" />
          </div>
          <span className="text-[9.5px] font-mono tracking-tight text-white/35 hidden sm:inline">
            app.blip.money/merchant · Dashboard
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex w-1 h-1">
            <span className="absolute inset-0 rounded-full bg-[#cc785c] opacity-60 animate-ping" />
            <span className="relative inline-flex rounded-full w-1 h-1 bg-[#cc785c]" />
          </span>
          <span className="text-[8.5px] font-semibold tracking-[0.22em] uppercase text-white/50">
            {isIdle ? "Merchant · Idle" : "Merchant · Routing"}
          </span>
        </div>
      </div>

      {/* App navbar (Dashboard / Settings + Blip Points + Wallet) */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.05] bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-1">
          <DashTab label="Dashboard" active />
          <DashTab label="Settings" />
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06]">
            <span className="w-1 h-1 rounded-full bg-[#ffb872]" />
            <span className="text-[10px] font-semibold text-white/75 tracking-tight">
              500
            </span>
            <span className="text-[9px] text-white/40">Blip Points</span>
          </span>
          <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06]">
            <Wallet className="w-3 h-3 text-white/65" strokeWidth={2.2} />
            <span className="text-[10px] font-semibold text-white/75 tracking-tight">
              Wallet
            </span>
          </span>
        </div>
      </div>

      {/* 5-panel layout: Sidebar · Pending · In Progress · Leaderboard/Activity · Notifications */}
      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr_1fr_180px_200px]">
        {/* ── LEFT SIDEBAR: StatusCard replica ── */}
        <aside className="border-b md:border-b-0 md:border-r border-white/[0.05] bg-black/30">
          {/* Sticky live ticker — Shield + Coins + Active toggle */}
          <div className="sticky top-0 z-20 flex items-center justify-between px-3 py-2 border-b border-white/[0.04] bg-black/60 backdrop-blur-md text-[9px] font-mono">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Shield className="w-2.5 h-2.5 text-[#6eaaff]" />
                <span className="text-white/70 font-bold tabular-nums">850</span>
              </span>
              <span className="flex items-center gap-1">
                <Coins className="w-2.5 h-2.5 text-amber-400/80" />
                <span className="text-white/70 font-bold tabular-nums">500</span>
              </span>
            </div>
            <div
              className="flex items-center justify-center w-5 h-5 rounded-full border"
              style={{
                background: "rgba(80,220,150,0.10)",
                borderColor: "rgba(80,220,150,0.30)",
                color: "#cc785c",
              }}
              title="Active"
            >
              <Radio className="w-2.5 h-2.5" />
            </div>
          </div>

          {/* Balance hero */}
          <div className="px-4 py-3 relative">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <Wallet className="w-3 h-3 text-white/25" />
                <span className="text-[9.5px] text-white/30 font-mono uppercase tracking-widest">
                  Available Balance
                </span>
              </div>
              <span className="text-[10px] text-white/30">⚙</span>
            </div>
            <motion.div
              key={balanceFmt}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45 }}
              className="font-mono text-[22px] font-black tabular-nums text-white tracking-tight leading-none text-center"
            >
              ${balanceFmt.split(".")[0]}
              <span className="text-white/30">
                .{balanceFmt.split(".")[1]}
              </span>
            </motion.div>
            <div className="text-center text-[9px] text-white/30 font-mono uppercase tracking-widest mt-0.5">
              USDT
            </div>

            {/* 24h earnings badge */}
            {totalEarned > 0 && (
              <div className="mt-2.5 flex justify-center">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(110,170,255,0.08)",
                    border: "1px solid rgba(110,170,255,0.18)",
                  }}
                >
                  <TrendingUp className="w-2.5 h-2.5 text-[#6eaaff]" />
                  <span className="text-[10px] font-bold text-[#6eaaff] font-mono tabular-nums">
                    +{earnedFmt} USDT
                  </span>
                  <span className="text-[9px] text-[#6eaaff]/50 font-mono">24h</span>
                </div>
              </div>
            )}

            {/* Locked in escrow */}
            {(pending || inProgress) && (
              <div className="mt-1.5 text-center text-[9px] text-white/20 font-mono">
                {(pending ? parseFloat(pending.amount.replace(/[^0-9.]/g, "")) : 0) +
                  (inProgress
                    ? parseFloat(inProgress.amount.replace(/[^0-9.]/g, ""))
                    : 0)}{" "}
                locked in escrow
              </div>
            )}
          </div>

          {/* Corridor segmented control */}
          <div className="px-3 pb-2 space-y-1.5">
            <div className="inline-flex w-full rounded-lg bg-white/[0.025] border border-white/[0.05] p-0.5">
              {[
                { code: "INR", rate: "₹97.85" },
                { code: "AED", rate: "3.66 AED" },
              ].map((c) => {
                const active = currentFiat === c.code;
                return (
                  <div
                    key={c.code}
                    className={`flex-1 py-1.5 px-2 rounded-md flex items-center justify-center gap-2 transition-colors ${
                      active ? "bg-white/[0.07]" : ""
                    }`}
                  >
                    <span
                      className={`text-[11px] font-medium tracking-tight ${
                        active ? "text-white" : "text-white/40"
                      }`}
                    >
                      USDT/{c.code}
                    </span>
                    <span
                      className={`text-[10px] font-mono tabular-nums ${
                        active ? "text-white/55" : "text-white/30"
                      }`}
                    >
                      {c.rate}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Cash & Market collapsed row */}
            <button
              type="button"
              className="w-full flex items-center justify-between py-1.5 px-2.5 rounded-lg"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-white/30 font-mono uppercase tracking-wider">
                  Cash & Market
                </span>
                <span className="text-[9px] text-white/40 font-mono">₹0</span>
              </div>
              <ChevronDown className="w-3 h-3 text-white/25 -rotate-90" />
            </button>

            {/* Corridor status */}
            <div className="flex items-center justify-between px-2 py-1 text-[9.5px] tracking-tight">
              <span className="text-white/40">Corridor</span>
              <span className="text-white/65">
                <span className="text-[#cc785c]">●</span> Online · vol $0
              </span>
            </div>
          </div>

          {/* Send form — Amount + USDT/INR + MAX + Bank */}
          <div className="px-3 pb-3 space-y-2 border-t border-white/[0.04] pt-3">
            <div className="flex items-center justify-between text-[9px] font-semibold tracking-[0.18em] uppercase text-white/40">
              <span>Amount</span>
              <span className="text-white/30">USDT/{currentFiat} · MAX</span>
            </div>
            <div
              className="flex items-center justify-between rounded-md px-2.5 py-1.5"
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <span className="font-mono text-[14px] font-semibold tabular-nums text-white">
                {currentSend}
              </span>
              <span className="text-[10px] text-white/45 font-medium">USDT</span>
            </div>

            {/* Bank account pill */}
            <div
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-md"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <div className="w-5 h-5 rounded bg-white/[0.06] flex items-center justify-center text-[8px]">
                🏦
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] text-white font-medium truncate leading-tight">
                  Emirates Islamic
                </div>
                <div className="text-[8.5px] text-white/35 truncate font-mono">
                  Anupam Sharma · 27500178802
                </div>
              </div>
              <ChevronDown className="w-3 h-3 text-white/30 shrink-0" />
            </div>

            {/* Spread chips */}
            <div className="pt-1">
              <div className="text-[9px] font-semibold tracking-[0.18em] uppercase text-white/40 mb-1">
                Spread
              </div>
              <div className="grid grid-cols-3 gap-1">
                <SpreadChip label="Fast" pct="+2.5%" />
                <SpreadChip label="Best" pct="+2%" active />
                <SpreadChip label="Cheap" pct="+1.5%" />
              </div>
            </div>

            {/* Boost */}
            <div className="pt-1">
              <div className="flex items-center justify-between text-[9px] font-semibold tracking-[0.18em] uppercase text-white/40 mb-1">
                <span>Boost</span>
                <span className="text-white/30">manual</span>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {["0", "5%", "10%", "15%"].map((v, i) => (
                  <button
                    key={v}
                    type="button"
                    className="text-[10px] font-mono font-semibold tracking-tight py-1 rounded"
                    style={{
                      background:
                        i === 0
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(255,255,255,0.025)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      color: i === 0 ? "#fff" : "rgba(255,255,255,0.5)",
                    }}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* BUY / SELL */}
            <div className="grid grid-cols-2 gap-1 pt-1">
              <button
                type="button"
                className="h-9 rounded-lg text-[11.5px] font-bold tracking-wider"
                style={{
                  background: "rgba(80,220,150,0.12)",
                  border: "1px solid rgba(80,220,150,0.28)",
                  color: "#cc785c",
                }}
              >
                BUY
              </button>
              <button
                type="button"
                className="h-9 rounded-lg text-[11.5px] font-bold tracking-wider"
                style={{
                  background: "rgba(255,120,120,0.10)",
                  border: "1px solid rgba(255,120,120,0.25)",
                  color: "#ff9b9b",
                }}
              >
                SELL
              </button>
            </div>
          </div>
        </aside>

        {/* ── COL 2: PENDING ORDERS — ported header from real PendingOrdersPanel ── */}
        <section className="border-b md:border-b-0 md:border-r border-white/[0.05] min-h-[520px] flex flex-col">
          {/* Sticky panel header */}
          <div className="px-3 py-2 border-b border-white/[0.06]">
            {/* Tabs row */}
            <div className="flex items-center justify-between gap-1 mb-2">
              <div className="inline-flex items-center gap-0.5 h-7 p-0.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                {["All", "Pending", "My Orders"].map((t) => (
                  <button
                    key={t}
                    className={`h-full px-2 inline-flex items-center rounded-md text-[10px] font-bold transition-all ${
                      t === "Pending"
                        ? "bg-white text-black shadow"
                        : "text-white/40 hover:text-white/65"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1">
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#ff6b6b]/15 border border-[#ff6b6b]/30">
                  <span className="relative flex w-1 h-1">
                    <span className="absolute inset-0 rounded-full bg-[#ff6b6b] opacity-60 animate-ping" />
                    <span className="relative inline-flex rounded-full w-1 h-1 bg-[#ff6b6b]" />
                  </span>
                  <span className="text-[8.5px] font-bold text-[#ff9b9b] uppercase tracking-tight">
                    Live
                  </span>
                </span>
                <span className="text-[9px] font-mono text-white/45 px-1.5 py-0.5 rounded border border-white/[0.08]">
                  {pending ? 1 : 0}
                </span>
              </div>
            </div>
            {/* Search + filter */}
            <div className="flex items-center gap-1.5">
              <div className="flex-1 flex items-center gap-1.5 bg-white/[0.02] border border-white/[0.06] rounded-lg px-2.5 py-1">
                <span className="text-white/20 text-[10px]">🔍</span>
                <input
                  type="search"
                  placeholder="Search orders..."
                  className="flex-1 bg-transparent text-[10.5px] text-white placeholder:text-white/15 outline-none font-mono"
                />
              </div>
              <button className="flex items-center gap-1 text-[9px] font-mono bg-white/[0.02] text-white/35 border border-white/[0.06] rounded-lg px-1.5 py-1.5">
                Filter
                <ChevronDown className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>

          {/* Orders list */}
          <div className="flex-1 overflow-hidden px-3 py-2.5 space-y-2">
            <AnimatePresence mode="popLayout">
              {pending ? (
                <RealOrderRow key={pending.id} order={pending} status="pending" />
              ) : (
                <motion.div
                  key="empty-pending"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-8 gap-1.5"
                >
                  <Inbox className="w-5 h-5 text-white/15" strokeWidth={1.5} />
                  <span className="text-[10.5px] text-white/30 tracking-tight">
                    No pending orders
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* ── COL 3: IN PROGRESS ── */}
        <section className="border-b md:border-b-0 md:border-r border-white/[0.05] min-h-[520px] flex flex-col">
          {/* Header */}
          <div className="px-3 py-2 border-b border-white/[0.06]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[9.5px] font-bold uppercase tracking-[0.18em] text-white/65">
                  In Progress
                </span>
                <span className="text-[9px] font-mono text-white/45 px-1.5 py-0.5 rounded border border-white/[0.08]">
                  {inProgress ? 1 : 0}
                </span>
              </div>
              <button className="text-white/30 text-[10px]">⋯</button>
            </div>
            {/* Status filter chips */}
            <div className="flex items-center gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden">
              {["All", "Accepted", "Escrowed", "Paid", "Cancelled"].map((c) => (
                <button
                  key={c}
                  className={`px-2 py-0.5 rounded text-[9.5px] font-semibold whitespace-nowrap ${
                    c === "All"
                      ? "bg-white/[0.08] text-white border border-white/[0.12]"
                      : "text-white/30 hover:text-white/50"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Orders list */}
          <div className="flex-1 overflow-hidden px-3 py-2.5 space-y-2">
            <AnimatePresence mode="popLayout">
              {inProgress ? (
                <RealOrderRow
                  key={inProgress.id}
                  order={inProgress}
                  status="settling"
                />
              ) : (
                <motion.div
                  key="empty-prog"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-8 gap-1.5"
                >
                  <Inbox className="w-5 h-5 text-white/15" strokeWidth={1.5} />
                  <span className="text-[10.5px] text-white/30 tracking-tight">
                    No active orders
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* ── COL 4: LEADERBOARD + ACTIVITY ── */}
        <aside className="bg-black/20 border-b md:border-b-0 md:border-r border-white/[0.05] flex flex-col">
          {/* Leaderboard header */}
          <div className="px-3 py-2 border-b border-white/[0.06]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/65">
                Leaderboard
              </span>
              <button className="text-white/30 text-[10px]">⋯</button>
            </div>
            <div className="inline-flex items-center gap-0.5 h-6 p-0.5 rounded-md bg-white/[0.04] border border-white/[0.06]">
              {["Volume", "Rated", "Rep"].map((t) => (
                <button
                  key={t}
                  className={`h-full px-1.5 inline-flex items-center rounded text-[9px] font-bold ${
                    t === "Volume" ? "bg-white text-black" : "text-white/40"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          {/* Leaderboard rows */}
          <div className="px-3 py-2 space-y-1">
            {LEADERBOARD.map((row, i) => {
              const RankIcon = i === 0 ? Crown : i === 1 ? Medal : i === 2 ? Award : null;
              return (
                <div
                  key={row.name}
                  className="flex items-center justify-between gap-1.5 py-1 px-1.5 rounded text-[10px] tracking-tight"
                  style={{
                    background: i < 3 ? "rgba(255,255,255,0.022)" : "transparent",
                    border:
                      i < 3 ? "1px solid rgba(255,255,255,0.05)" : "1px solid transparent",
                  }}
                >
                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    <span className="font-mono text-white/35 w-3 text-[9px] tabular-nums">
                      {i + 1}
                    </span>
                    {RankIcon && (
                      <RankIcon className="w-2.5 h-2.5 text-white/55" strokeWidth={2} />
                    )}
                    <span className="text-[11px]">{getEmoji(row.name)}</span>
                    <span className="text-white/85 truncate">{row.name}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="font-mono text-white/85 tabular-nums text-[10px]">
                      {row.volume}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Activity */}
          <div className="mt-auto border-t border-white/[0.05]">
            <div className="px-3 py-2 flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/65">
                Activity
              </span>
              <span className="text-[9px] text-white/30 font-mono">{completed.length}</span>
            </div>
            <div className="px-3 pb-2 space-y-1 max-h-[120px] overflow-hidden">
              <AnimatePresence initial={false}>
                {completed.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-[9.5px] text-white/25 tracking-tight px-1.5 py-1"
                  >
                    No completed trades yet.
                  </motion.div>
                ) : (
                  completed.slice(0, 3).map((order) => (
                    <ActivityRow key={order.id} order={order} />
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </aside>

        {/* ── COL 5: NOTIFICATIONS + MESSAGES ── */}
        <aside className="bg-black/20 flex flex-col">
          {/* Notifications header */}
          <div className="px-3 py-2 border-b border-white/[0.06] flex items-center justify-between">
            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/65">
              Notifications
            </span>
            <div className="flex items-center gap-1.5">
              {notifications.length > 0 && (
                <span className="font-mono text-[9px] font-bold text-white px-1.5 py-0.5 rounded bg-[#ff6b6b]/15 border border-[#ff6b6b]/30 tabular-nums">
                  {notifications.length}
                </span>
              )}
              <span className="text-[9.5px] text-white/35 uppercase tracking-tight">
                Read
              </span>
            </div>
          </div>
          {/* Notifications list */}
          <div className="px-3 py-2 space-y-1.5 max-h-[260px] overflow-hidden">
            <AnimatePresence initial={false}>
              {notifications.slice(0, 5).map((n) => (
                <NotificationRow key={n.id} notif={n} />
              ))}
            </AnimatePresence>
          </div>

          {/* Messages tabs */}
          <div className="mt-auto border-t border-white/[0.05]">
            <div className="px-3 py-2 flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/65">
                Messages
              </span>
              <span className="text-[9px] font-mono text-white/30">⋯</span>
            </div>
            <div className="px-3 pb-2">
              <div className="grid grid-cols-3 gap-1 mb-2">
              <MsgTab label="Active" active />
              <MsgTab label="Inbox" />
              <MsgTab label="Disputes" />
            </div>
            <div
              className="rounded px-2 py-2 text-[10px] text-white/30 tracking-tight text-center"
              style={{
                background: "rgba(255,255,255,0.015)",
                border: "1px dashed rgba(255,255,255,0.07)",
              }}
            >
              Search active chats…
            </div>
            </div>
          </div>
        </aside>
      </div>
    </motion.div>
  );
}

const LEADERBOARD = [
  { name: "John", volume: "$3.8K", rating: "5.0" },
  { name: "zoro", volume: "$2.7K", rating: "4.5" },
  { name: "Zayn Khan", volume: "$1.4K", rating: "—" },
  { name: "Drako", volume: "$1.0K", rating: "—" },
  { name: "Hulk", volume: "$315", rating: "1.0" },
  { name: "Craig Morse", volume: "$0", rating: "—" },
];

/** Deterministic emoji per username — mirrors the real app's getEntityEmoji util */
function getEmoji(name: string): string {
  const emojis = ["🦊", "🐻", "🐼", "🐨", "🦁", "🐯", "🐸", "🐙", "🦋", "🐳", "🦄", "🐲", "🐺", "🦅", "🐢"];
  const hash = name.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
  return emojis[hash % emojis.length];
}

/** RealOrderRow — mirrors the actual PendingOrdersPanel order card design.
 *  User emoji + name + amount mono + rate + accept button. */
function RealOrderRow({
  order,
  status,
}: {
  order: InlineOrder;
  status: "pending" | "settling";
}) {
  const isPending = status === "pending";
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.45, ease: EASE }}
      className="rounded-lg overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.022)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="px-3 py-2.5">
        {/* Top: user + amount */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] shrink-0"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              {getEmoji(order.merchant)}
            </div>
            <span className="text-[11px] font-semibold text-white/90 truncate">
              {order.merchant}
            </span>
            {isPending ? (
              <span
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8.5px] font-bold uppercase tracking-tight"
                style={{
                  background: "rgba(110,170,255,0.10)",
                  color: "#a8c8ff",
                  border: "1px solid rgba(110,170,255,0.22)",
                }}
              >
                <motion.span
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                  className="block w-1 h-1 rounded-full bg-[#6eaaff]"
                />
                New
              </span>
            ) : (
              <span
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8.5px] font-bold uppercase tracking-tight"
                style={{
                  background: "rgba(255,180,100,0.10)",
                  color: "#ffc790",
                  border: "1px solid rgba(255,180,100,0.22)",
                }}
              >
                <Loader2 className="w-2.5 h-2.5 animate-spin" strokeWidth={2.5} />
                Escrowed
              </span>
            )}
          </div>
          <span
            className={`font-mono text-sm font-extrabold tabular-nums shrink-0 ${
              isPending ? "text-[#cc785c]" : "text-white"
            }`}
          >
            {order.amount}
          </span>
        </div>

        {/* Middle: pair + rate */}
        <div className="flex items-center justify-between mb-2 text-[10px]">
          <span className="font-mono text-white/55">{order.pair}</span>
          <span className="font-mono text-white/65">@ {order.rate}</span>
        </div>

        {/* Payout */}
        <div className="flex items-baseline justify-between pb-2 border-b border-white/[0.05]">
          <span className="text-[9px] text-white/35 font-mono uppercase tracking-wider">
            They get
          </span>
          <span className="font-mono text-[13px] font-bold text-white tabular-nums">
            {order.payout}
          </span>
        </div>

        {/* Action button */}
        <div className="flex items-center justify-between gap-2 pt-2">
          <button
            type="button"
            className="flex-1 h-7 rounded-md text-[10px] font-bold tracking-wider"
            style={{
              background: isPending
                ? "rgba(80,220,150,0.12)"
                : "rgba(255,180,100,0.10)",
              border: isPending
                ? "1px solid rgba(80,220,150,0.28)"
                : "1px solid rgba(255,180,100,0.22)",
              color: isPending ? "#cc785c" : "#ffc790",
            }}
          >
            {isPending ? "ACCEPT" : "RELEASE ESCROW"}
          </button>
          <button
            type="button"
            className="w-7 h-7 rounded-md flex items-center justify-center text-[10px] text-white/55"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
            title="Chat"
          >
            💬
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function DashTab({ label, active }: { label: string; active?: boolean }) {
  return (
    <span
      className="px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-tight transition-colors"
      style={{
        background: active ? "rgba(255,255,255,0.08)" : "transparent",
        color: active ? "#fff" : "rgba(255,255,255,0.5)",
      }}
    >
      {label}
    </span>
  );
}

function DashSubTab({ label, active }: { label: string; active?: boolean }) {
  return (
    <span
      className="px-2 py-1 rounded-md text-[10.5px] font-semibold tracking-tight"
      style={{
        background: active ? "rgba(255,255,255,0.08)" : "transparent",
        color: active ? "#fff" : "rgba(255,255,255,0.5)",
      }}
    >
      {label}
    </span>
  );
}

function BalanceMini({ code, value }: { code: string; value: string }) {
  return (
    <div className="rounded px-1.5 py-1.5"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="text-[8.5px] font-semibold tracking-tight text-white/45 truncate">
        {code}
      </div>
      <div className="font-mono text-[11px] font-semibold tabular-nums text-white truncate">
        {value}
      </div>
    </div>
  );
}

function ActionChip({
  label,
  highlight,
}: {
  label: string;
  highlight?: boolean;
}) {
  return (
    <button
      type="button"
      className="h-9 rounded-md text-[11px] font-semibold tracking-tight transition-colors"
      style={{
        background: highlight
          ? "rgba(110,170,255,0.12)"
          : "rgba(255,255,255,0.025)",
        border: highlight
          ? "1px solid rgba(110,170,255,0.28)"
          : "1px solid rgba(255,255,255,0.06)",
        color: highlight ? "#a8c8ff" : "rgba(255,255,255,0.75)",
      }}
    >
      {label}
    </button>
  );
}

function PairChip({
  code,
  rate,
  active,
}: {
  code: string;
  rate: string;
  active?: boolean;
}) {
  return (
    <div
      className="rounded-md px-2 py-1.5 flex items-center justify-between"
      style={{
        background: active
          ? "rgba(110,170,255,0.10)"
          : "rgba(255,255,255,0.025)",
        border: active
          ? "1px solid rgba(110,170,255,0.25)"
          : "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <span
        className="text-[10px] font-semibold tracking-tight"
        style={{ color: active ? "#a8c8ff" : "rgba(255,255,255,0.65)" }}
      >
        {code}
      </span>
      <span className="font-mono text-[10px] tabular-nums text-white/65">
        {rate}
      </span>
    </div>
  );
}

function SpreadChip({
  label,
  pct,
  active,
}: {
  label: string;
  pct: string;
  active?: boolean;
}) {
  return (
    <div
      className="rounded-md px-2 py-1.5 text-center"
      style={{
        background: active
          ? "rgba(80,220,150,0.10)"
          : "rgba(255,255,255,0.025)",
        border: active
          ? "1px solid rgba(80,220,150,0.25)"
          : "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        className="text-[9.5px] font-semibold tracking-tight"
        style={{ color: active ? "#cc785c" : "rgba(255,255,255,0.55)" }}
      >
        {label}
      </div>
      <div className="font-mono text-[10px] tabular-nums text-white/75">
        {pct}
      </div>
    </div>
  );
}

function OrderPanel({
  title,
  order,
  palette,
  icon,
  emptyLabel,
}: {
  title: string;
  order: InlineOrder | null;
  palette: {
    chip: string;
    chipBorder: string;
    chipText: string;
    dot: string;
  };
  icon: "dot" | "spinner";
  emptyLabel: string;
}) {
  return (
    <div
      className="relative rounded-lg overflow-hidden flex flex-col min-h-[140px]"
      style={{
        background: order
          ? "rgba(255,255,255,0.035)"
          : "rgba(255,255,255,0.012)",
        border: order
          ? "1px solid rgba(255,255,255,0.07)"
          : "1px dashed rgba(255,255,255,0.07)",
      }}
    >
      <div className="px-3 py-2 border-b border-white/[0.05] flex items-center justify-between">
        <span className="text-[9.5px] font-semibold tracking-[0.16em] uppercase text-white/55">
          {title}
        </span>
        <span className="text-[9px] text-white/30">⋯</span>
      </div>
      <AnimatePresence mode="popLayout">
        {order ? (
          <motion.div
            key={order.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="flex-1 px-3 py-3"
          >
            <div
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full mb-2"
              style={{
                background: palette.chip,
                border: `1px solid ${palette.chipBorder}`,
              }}
            >
              {icon === "spinner" ? (
                <Loader2
                  className="w-2.5 h-2.5 animate-spin"
                  style={{ color: palette.chipText }}
                  strokeWidth={2.5}
                />
              ) : (
                <motion.span
                  animate={{ scale: [0.8, 1.2, 1], opacity: [0.6, 1, 0.95] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                  className="block w-1 h-1 rounded-full"
                  style={{ background: palette.dot }}
                />
              )}
              <span
                className="text-[8.5px] font-semibold tracking-[0.16em] uppercase"
                style={{ color: palette.chipText }}
              >
                {icon === "spinner" ? "Settling" : "New"}
              </span>
            </div>
            <div className="font-mono text-[10px] font-semibold tracking-tight text-white/55 mb-1">
              {order.pair}
            </div>
            <div className="font-mono text-[15px] font-semibold tracking-tight text-white tabular-nums truncate">
              {order.payout}
            </div>
            <div className="text-[10px] text-white/40 mt-0.5 tracking-tight truncate">
              from {order.amount} · {order.merchant}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center px-3 py-4 text-center gap-1"
          >
            <Inbox className="w-4 h-4 text-white/15" strokeWidth={1.8} />
            <span className="text-[10px] text-white/30 tracking-tight">
              {emptyLabel}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MsgTab({ label, active }: { label: string; active?: boolean }) {
  return (
    <button
      type="button"
      className="text-[10px] font-semibold py-1 rounded tracking-tight"
      style={{
        background: active
          ? "rgba(255,255,255,0.08)"
          : "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.06)",
        color: active ? "#fff" : "rgba(255,255,255,0.5)",
      }}
    >
      {label}
    </button>
  );
}

/* ────────────────────────────────────────────────────────────
   Dashboard sub-components
   ──────────────────────────────────────────────────────────── */
function BalanceRow({
  icon,
  code,
  value,
}: {
  icon: string;
  code: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between text-[11px] tracking-tight">
      <div className="flex items-center gap-1.5">
        <span className="text-[10px]">{icon}</span>
        <span className="text-white/55 font-medium">{code}</span>
      </div>
      <span className="font-mono text-white/85 tabular-nums">{value}</span>
    </div>
  );
}

function OrderSlot({
  label,
  order,
  palette,
  icon,
}: {
  label: string;
  order: InlineOrder | null;
  palette: {
    chip: string;
    chipBorder: string;
    chipText: string;
    dot: string;
  };
  icon: "dot" | "spinner";
}) {
  return (
    <div
      className="relative rounded-xl overflow-hidden min-h-[112px]"
      style={{
        background: order
          ? "rgba(255,255,255,0.035)"
          : "rgba(255,255,255,0.012)",
        border: order
          ? "1px solid rgba(255,255,255,0.07)"
          : "1px dashed rgba(255,255,255,0.07)",
      }}
    >
      {/* Label chip top-left */}
      <div className="absolute top-2.5 left-2.5 z-10">
        <div
          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full"
          style={{
            background: order ? palette.chip : "rgba(255,255,255,0.04)",
            border: order
              ? `1px solid ${palette.chipBorder}`
              : "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {order ? (
            icon === "spinner" ? (
              <Loader2
                className="w-2.5 h-2.5 animate-spin"
                style={{ color: palette.chipText }}
                strokeWidth={2.5}
              />
            ) : (
              <motion.span
                animate={{ scale: [0.8, 1.2, 1], opacity: [0.6, 1, 0.95] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                className="block w-1 h-1 rounded-full"
                style={{ background: palette.dot }}
              />
            )
          ) : (
            <span className="block w-1 h-1 rounded-full bg-white/20" />
          )}
          <span
            className="text-[8.5px] font-semibold tracking-[0.16em] uppercase"
            style={{ color: order ? palette.chipText : "rgba(255,255,255,0.3)" }}
          >
            {label}
          </span>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {order ? (
          <motion.div
            key={order.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="px-3 py-3 pt-9"
          >
            <div className="font-mono text-[10px] font-semibold tracking-tight text-white/55 mb-1">
              {order.pair}
            </div>
            <div className="font-mono text-[15px] md:text-[16px] font-semibold tracking-tight text-white tabular-nums truncate">
              {order.payout}
            </div>
            <div className="text-[10px] text-white/40 mt-0.5 tracking-tight truncate">
              from {order.amount}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="text-[10px] text-white/20 tracking-tight">—</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ActivityRow({ order }: { order: InlineOrder }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 8 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="flex items-center justify-between px-3 py-2 rounded-lg"
      style={{
        background: "rgba(255,255,255,0.022)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <CheckCircle2
          className="w-3 h-3 text-[#cc785c] shrink-0"
          strokeWidth={2.5}
        />
        <div className="min-w-0">
          <div className="font-mono text-[11px] font-semibold tracking-tight text-white/90 truncate">
            {order.pair} · {order.payout}
          </div>
          <div className="text-[9.5px] text-white/35 tracking-tight">
            from {order.amount} · {order.merchant}
          </div>
        </div>
      </div>
      <span className="font-mono text-[11px] font-semibold tabular-nums text-[#cc785c] shrink-0 ml-2">
        {order.profit}
      </span>
    </motion.div>
  );
}

function NotificationRow({ notif }: { notif: DashNotification }) {
  const Icon =
    notif.kind === "success"
      ? CheckCircle2
      : notif.kind === "warn"
        ? ShieldCheck
        : Bell;
  const color =
    notif.kind === "success"
      ? "#cc785c"
      : notif.kind === "warn"
        ? "#ffc790"
        : "#a8c8ff";
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ duration: 0.45, ease: EASE }}
      className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg"
      style={{
        background: "rgba(255,255,255,0.022)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <Icon
        className="w-3 h-3 shrink-0 mt-[3px]"
        style={{ color }}
        strokeWidth={2.5}
      />
      <div className="min-w-0">
        <div className="text-[11px] font-medium tracking-tight text-white/85 leading-snug">
          {notif.title}
        </div>
        {notif.meta && (
          <div className="text-[9.5px] text-white/35 mt-0.5 tracking-tight font-mono">
            {notif.meta}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────
   Hero
   ──────────────────────────────────────────────────────────── */
const CinematicHero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.2 });

  /* Scroll-linked black → white background transition.
     As the user scrolls past the hero into the dashboard area,
     a white wash sweeps up from the bottom so the dashboard
     ends up floating on a bright surface. */
  const { scrollYProgress: heroScroll } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const whiteWashOpacity = useTransform(heroScroll, [0.5, 0.95], [0, 1]);

  /* ── Widget inputs ── */
  const [sendAmount, setSendAmount] = useState("1,000");
  const [fiatIdx, setFiatIdx] = useState(0);

  /* ── Available balance (still validates Send) ── */
  const STARTING_BALANCE = 12847.2;
  const [balance, setBalance] = useState(STARTING_BALANCE);
  const [sending, setSending] = useState(false);

  /* ── Live merchant dashboard state (real replica hook) ── */
  const dashboardState = useMerchantDashboardState();
  const dashboardRef = useRef<HTMLDivElement>(null);

  const handleSend = (order: InlineOrder, numericAmount: number) => {
    if (sending || numericAmount <= 0 || numericAmount > balance) return;
    setSending(true);
    setBalance((b) => b - numericAmount);

    /* Push the order into the LIVE dashboard's pending list */
    dashboardState.addPendingOrder({
      amount: numericAmount,
      fiat: FIATS[fiatIdx].code === "AED" ? "AED" : "INR",
      side: "SELL",
      user: "You",
      avatar: "🟢",
      price: FIATS[fiatIdx].rate,
    });

    /* Smooth-scroll the dashboard into view so the user sees their order land */
    setTimeout(() => {
      dashboardRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 120);

    /* Re-enable send after the dashboard has time to advance it through stages */
    setTimeout(() => {
      setBalance((b) => b + numericAmount + numericAmount * 0.0018);
      setSending(false);
    }, 6000);
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[150vh] overflow-hidden flex flex-col items-stretch text-white bg-black"
    >
      {/* Solid black background (image removed) */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: "#000" }}
      />

      {/* Layer 2: atmospheric depth — gentle blue wash, no warm noise */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 35%, rgba(60,100,200,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Layer 3: very slow drifting aurora */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-50"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        style={{
          background:
            "radial-gradient(ellipse 35% 22% at 30% 30%, rgba(80,140,230,0.05), transparent 65%), radial-gradient(ellipse 30% 20% at 75% 65%, rgba(120,160,255,0.04), transparent 65%)",
          backgroundSize: "240% 240%",
        }}
      />

      {/* Layer 4: vignette */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 95% 75% at 50% 45%, transparent 30%, rgba(0,0,0,0.6) 80%, rgba(0,0,0,0.96) 100%)",
        }}
      />

      {/* Layer 5: top + bottom fades */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-40 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-56 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.5) 50%, #000 100%)",
        }}
      />

      {/* White wash disabled — hero stays black through the merchant section */}

      {/* Layer 6: film grain */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.55 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* ── Content — 50/50 vertical split ── */}
      <main className="relative z-10 w-full max-w-[1180px] mx-auto px-4 md:px-10 pt-16 md:pt-24 pb-16 md:pb-24 flex-1 flex flex-col items-stretch">
        {/* ── TOP HALF — anchored ~50% from top (10% lower than before) ── */}
        <div className="flex flex-col items-center text-center min-h-[54vh] md:min-h-[58vh] justify-end">
          {/* Eyebrow — Apple-clean */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <span className="w-5 h-px bg-white/25" />
            <span className="text-[10px] font-semibold tracking-[0.3em] uppercase whitespace-nowrap" style={{ color: "#ff7a3d", textShadow: "0 0 18px rgba(255,122,61,0.45)" }}>
              Global Settlement Network
            </span>
            <span className="w-5 h-px bg-white/25" />
          </motion.div>

          {/* Headline — Apple display type */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.08 }}
            className="font-display text-white max-w-[920px]"
            style={{
              fontSize: "clamp(2.1rem, 4.8vw, 3.9rem)",
              fontWeight: 500,
              lineHeight: 1.02,
              letterSpacing: "-0.055em",
              marginBottom: 22,
              textShadow: "0 2px 24px rgba(0,0,0,0.45)",
            }}
          >
            <span>Your money finds </span>
            <span className="text-white/75">the best route.</span>
          </motion.h1>

          {/* Subhead — Apple-clean, slightly larger */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.22 }}
            className="text-white/65 max-w-[560px] mx-auto leading-[1.5] text-[15px] md:text-[16px] mb-7 tracking-tight"
          >
            <span style={{ color: "#cc785c" }}>Blip Market</span> automatically routes transactions through trusted
            liquidity providers to deliver better rates and faster settlement.
          </motion.p>

          {/* Send/Receive calculator — single-line with Send button */}
          <SendReceiveWidget
            isInView={isInView}
            onSend={handleSend}
            sending={sending}
            availableBalance={balance}
            sendAmount={sendAmount}
            setSendAmount={setSendAmount}
            fiatIdx={fiatIdx}
            setFiatIdx={setFiatIdx}
          />

          {/* CTAs — Apple hierarchy: one primary, one ghost */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.52 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto"
          >
            <Link
              to="/register"
              className="group relative inline-flex items-center justify-center gap-2 w-full sm:w-auto sm:min-w-[168px] h-[44px] px-6 rounded-full bg-white text-black text-[13.5px] font-semibold tracking-tight transition-all duration-300 shadow-[0_1px_0_rgba(255,255,255,0.4)_inset,0_10px_30px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_1px_0_rgba(255,255,255,0.4)_inset,0_16px_42px_-12px_rgba(255,255,255,0.4)] hover:-translate-y-[1px] active:scale-[0.985] active:translate-y-0"
            >
              <span>Join Waitlist</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/merchant"
              className="group inline-flex items-center justify-center gap-1.5 w-full sm:w-auto sm:min-w-[168px] h-[44px] px-6 rounded-full text-white/85 text-[13.5px] font-medium tracking-tight hover:text-white transition-colors"
            >
              <span>Become a Merchant</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>

        {/* Spacer between top section and dashboard */}
        <div className="h-[5vh] md:h-[10vh]" />

        {/* ── Live Merchant Dashboard (real replica from feat/live-merchant-dashboard) ── */}
        <div ref={dashboardRef}>
          <RealLiveDashboard state={dashboardState} />
        </div>

        {/* Merchant earnings — flat on black hero, no card wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1, ease: EASE }}
          className="relative mt-20 md:mt-28 mb-12 md:mb-20 flex flex-col items-center text-center w-full"
        >
          <div className="text-[11.5px] font-bold tracking-[0.36em] uppercase mb-5" style={{ color: "#cc785c" }}>
            Powered by Merchants
          </div>

          <h2
            className="font-display text-white mx-auto"
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 500,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              marginBottom: 14,
              maxWidth: "720px",
            }}
          >
            <span className="text-white/55">Merchants provide liquidity. </span>
            <span>Earn on every order.</span>
          </h2>

          <p className="text-white/55 max-w-[480px] mx-auto leading-[1.55] text-[13px] md:text-[14.5px] mb-10 tracking-tight">
            Verified merchants bid live, set their own spread, and capture
            profit on every settlement — paid out instantly, on-chain.
          </p>

          {/* ── 6-card horizontal scroller, flat on black ── */}
          <MerchantCardCarousel />

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-5">
            <Link
              to="/merchant"
              className="group relative inline-flex items-center justify-center gap-2 w-full sm:w-auto sm:min-w-[220px] h-[50px] px-7 rounded-full bg-white text-black text-[14px] font-semibold tracking-tight transition-all duration-300 hover:-translate-y-[1px] active:scale-[0.985]"
            >
              <span>Become a merchant now</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="inline-flex items-center gap-3 text-[12px] text-white/45 tracking-tight">
            <span className="flex items-center gap-1.5">
              <motion.span
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#cc785c" }}
              />
              <span className="font-mono tabular-nums">${dashboardState.totalEarned.toFixed(0)}</span>
              <span>earned today</span>
            </span>
            <span className="text-white/20">·</span>
            <span><span className="font-mono tabular-nums">{dashboardState.activeTrades.length + dashboardState.pendingOrders.length}</span> live orders</span>
            <span className="text-white/20">·</span>
            <span>+2,400 merchants</span>
          </div>
        </motion.div>
      </main>
    </section>
  );
};

/* ────────────────────────────────────────────────────────────
   RealLiveDashboard — wraps the production replica with the
   hero's spotlight frame (92vw + chrome bar). Pulls the dash
   state from the same useMerchantDashboardState hook the real
   site uses on /merchant, so all panels animate live.
   ──────────────────────────────────────────────────────────── */
function RealLiveDashboard({
  state,
}: {
  state: ReturnType<typeof useMerchantDashboardState>;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  /* Scroll-linked emergence: dashboard sits beneath the hero, blurred and
     dim. As the user scrolls past the hero into the dashboard, it sharpens
     and brightens — "command center beneath the surface" feel. */
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start end", "end start"],
  });
  const blurPx = useTransform(scrollYProgress, [0, 0.35, 0.6], [0.825, 0.275, 0]);
  const filter = useTransform(blurPx, (v) => `blur(${v}px)`);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.55], [0.45, 0.75, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.6], [0.985, 1]);
  /* Playful scroll-linked sway: dashboard drifts gently as the user
     scrolls past it, then settles. Adds liveliness without being distracting. */
  const xDrift = useTransform(scrollYProgress, [0, 0.4, 0.7, 1], [0, -18, 12, 0]);
  const rotateZ = useTransform(scrollYProgress, [0, 0.4, 0.7, 1], [0, -0.7, 0.5, 0]);
  const yLift = useTransform(scrollYProgress, [0, 0.5, 1], [0, -28, -8]);

  return (
    <motion.div
      ref={wrapperRef}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.1, ease: EASE, delay: 0.5 }}
      className="relative rounded-2xl"
      style={{
        /* Spotlight: break out of the 1180px main, span ~94vw */
        width: "94vw",
        maxWidth: 1540,
        marginLeft: "calc(50% - min(47vw, 770px))",
        marginRight: "calc(50% - min(47vw, 770px))",
      }}
    >
      {/* Dashboard surface — clean dark with macOS chrome + URL */}
      <motion.div
        className="relative rounded-2xl overflow-hidden"
        style={{
          filter,
          opacity,
          scale,
          x: xDrift,
          y: yLift,
          rotate: rotateZ,
          background: "#0a0a0a",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 60px 120px -40px rgba(0,0,0,0.85)",
          transformOrigin: "center top",
        }}
      >
        {/* Browser chrome — traffic-light dots + favicon URL pill */}
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-white/[0.06]" style={{ background: "#0f0f10" }}>
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f57" }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#febc2e" }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#28c840" }} />
          <div className="flex-1 flex justify-center min-w-0 px-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-[10.5px] font-mono text-white/65 border border-white/[0.06] bg-white/[0.04] w-full max-w-[440px]">
              {/* Favicon — orange "B" mark */}
              <span
                className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-[3px] flex-shrink-0 text-white font-bold"
                style={{
                  background: "linear-gradient(135deg, #ffa473, #cc785c)",
                  fontSize: "8px",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  letterSpacing: 0,
                }}
                aria-hidden
              >
                B
              </span>
              <span className="text-white/35">https://</span>
              <span className="text-white/85">blip.money</span>
              <span className="text-white/45">/markets</span>
              <span className="flex-1" />
              <Lock className="w-2.5 h-2.5 text-white/30" />
            </div>
          </div>
          <div className="w-12" />
        </div>

        <MerchantDashboardBody state={state} />
      </motion.div>

      {/* Top fade removed — peach bezel sits clean against the hero darkness */}
      {/* Bottom edge — clean, sits on white wash. Soft elevation shadow only. */}
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────
   SceneIllustration — flat editorial SVG scenes used in the
   merchant-perk card grid (Uber-style).
   ──────────────────────────────────────────────────────────── */
function SceneIllustration({ kind, accent, fg }: { kind: string; accent: string; fg: string }) {
  const skin = "#f4c79b";
  const ink = "#1a1a1a";
  if (kind === "city") {
    return (
      <svg viewBox="0 0 160 100" className="w-full h-auto max-h-[110px]">
        {/* skyline */}
        <rect x="10" y="50" width="20" height="40" fill={accent} opacity="0.85" />
        <rect x="32" y="35" width="22" height="55" fill={fg} opacity="0.9" />
        <rect x="56" y="45" width="18" height="45" fill={accent} opacity="0.7" />
        <rect x="76" y="28" width="24" height="62" fill={fg} opacity="0.85" />
        <rect x="102" y="48" width="20" height="42" fill={accent} opacity="0.85" />
        <rect x="124" y="38" width="22" height="52" fill={fg} opacity="0.9" />
        {/* windows */}
        {Array.from({ length: 6 }).map((_, i) => (
          <rect key={`w${i}`} x={36 + (i % 2) * 8} y={40 + Math.floor(i / 2) * 8} width="3" height="3" fill={ink} />
        ))}
        {/* moon */}
        <circle cx="135" cy="20" r="6" fill={accent} />
        {/* person */}
        <circle cx="80" cy="78" r="4" fill={skin} />
        <rect x="77" y="82" width="6" height="10" rx="1" fill={accent} />
      </svg>
    );
  }
  if (kind === "phone") {
    return (
      <svg viewBox="0 0 160 100" className="w-full h-auto max-h-[110px]">
        {/* phone */}
        <rect x="62" y="18" width="36" height="64" rx="6" fill={fg} />
        <rect x="66" y="24" width="28" height="46" rx="3" fill={ink} />
        {/* big balance number */}
        <text x="80" y="50" textAnchor="middle" fontSize="11" fontWeight="700" fill={accent} fontFamily="ui-monospace, monospace">
          $240
        </text>
        <text x="80" y="62" textAnchor="middle" fontSize="5" fill={fg} opacity="0.6" letterSpacing="1">FREE</text>
        {/* sparkles */}
        <circle cx="40" cy="30" r="2" fill={accent} />
        <circle cx="125" cy="35" r="2" fill={accent} />
        <circle cx="35" cy="70" r="1.5" fill={accent} opacity="0.7" />
        <circle cx="130" cy="65" r="1.5" fill={accent} opacity="0.7" />
        {/* hand */}
        <ellipse cx="80" cy="92" rx="22" ry="5" fill={skin} />
      </svg>
    );
  }
  if (kind === "friends") {
    return (
      <svg viewBox="0 0 160 100" className="w-full h-auto max-h-[110px]">
        {/* sky / hill */}
        <ellipse cx="80" cy="98" rx="100" ry="22" fill={accent} opacity="0.5" />
        {/* friend 1 */}
        <circle cx="55" cy="48" r="9" fill={skin} />
        <rect x="48" y="56" width="14" height="22" rx="2" fill={fg} opacity="0.85" />
        {/* friend 2 */}
        <circle cx="105" cy="48" r="9" fill={skin} />
        <rect x="98" y="56" width="14" height="22" rx="2" fill={ink} />
        {/* gift/coin between */}
        <circle cx="80" cy="64" r="9" fill={accent} stroke={fg} strokeWidth="1.5" />
        <text x="80" y="68" textAnchor="middle" fontSize="9" fontWeight="700" fill={fg} fontFamily="ui-monospace, monospace">$</text>
        {/* arrows */}
        <path d="M 70 64 L 64 64" stroke={fg} strokeWidth="1.2" strokeLinecap="round" />
        <path d="M 90 64 L 96 64" stroke={fg} strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === "boost") {
    return (
      <svg viewBox="0 0 160 100" className="w-full h-auto max-h-[110px]">
        {/* rising chart */}
        <polyline
          points="20,80 45,70 65,55 85,42 105,28 130,15"
          stroke={accent}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* dots */}
        {[
          [20, 80],
          [45, 70],
          [65, 55],
          [85, 42],
          [105, 28],
          [130, 15],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3" fill={fg} />
        ))}
        {/* +15% bubble */}
        <rect x="98" y="36" width="36" height="16" rx="8" fill={accent} />
        <text x="116" y="47" textAnchor="middle" fontSize="9" fontWeight="700" fill={fg} fontFamily="ui-monospace, monospace">
          +15%
        </text>
        {/* base axis */}
        <line x1="10" y1="90" x2="150" y2="90" stroke={fg} strokeOpacity="0.3" strokeWidth="1" />
      </svg>
    );
  }
  if (kind === "shop") {
    return (
      <svg viewBox="0 0 160 100" className="w-full h-auto max-h-[110px]">
        {/* shop awning */}
        <rect x="30" y="28" width="100" height="10" fill={accent} />
        {/* shop body */}
        <rect x="30" y="38" width="100" height="50" fill={fg} opacity="0.9" />
        {/* OPEN sign */}
        <rect x="68" y="50" width="24" height="10" rx="2" fill={accent} />
        <text x="80" y="58" textAnchor="middle" fontSize="6" fontWeight="700" fill={ink} letterSpacing="1.5">OPEN</text>
        {/* door */}
        <rect x="74" y="68" width="12" height="20" fill={ink} />
        <circle cx="83" cy="78" r="0.8" fill={accent} />
        {/* windows */}
        <rect x="40" y="68" width="22" height="14" fill={ink} opacity="0.85" />
        <rect x="98" y="68" width="22" height="14" fill={ink} opacity="0.85" />
        {/* moon (sleeping = night) */}
        <path d="M 140 15 a 6 6 0 1 0 4 10 a 5 5 0 0 1 -4 -10 z" fill={accent} />
        {/* zzz */}
        <text x="120" y="20" fontSize="8" fill={fg} opacity="0.5" fontWeight="700">z</text>
      </svg>
    );
  }
  return null;
}

/* ────────────────────────────────────────────────────────────
   MerchantIllustration — small Apple-style illustration scenes
   for the merchant "Get to know" 4-card grid.
   ──────────────────────────────────────────────────────────── */
/* ────────────────────────────────────────────────────────────
   MerchantCardCarousel — 6 big cards, horizontal scroll with
   right-arrow control. Snaps to card edges.
   ──────────────────────────────────────────────────────────── */
function MerchantCardCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateButtons = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };
  useEffect(() => {
    updateButtons();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateButtons, { passive: true });
    window.addEventListener("resize", updateButtons);
    return () => {
      el.removeEventListener("scroll", updateButtons);
      window.removeEventListener("resize", updateButtons);
    };
  }, []);

  const scrollBy = (delta: number) => {
    scrollerRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  const cards: {
    label: string;
    titlePre: string;
    titleAccent: string;
    titleAccentItalic?: boolean;
    titleAccentColor: string;
    titleTail?: string;
    cta: string;
    footnote?: string;
    kind: string;
  }[] = [
    {
      label: "PROMO · ZERO FEES",
      titlePre: "Don't miss",
      titleAccent: "every transfer",
      titleAccentColor: "#e3b95c",
      titleTail: " this week.",
      cta: "Send now",
      footnote: "Auto-applied at checkout",
      kind: "shop",
    },
    {
      label: "MERCHANT · REWARDS",
      titlePre: "Stack a",
      titleAccent: "+15% boost",
      titleAccentColor: "#ffb38a",
      titleTail: " on your next 5 trades.",
      cta: "Activate boost",
      footnote: "Expires in 48h",
      kind: "bid",
    },
    {
      label: "WELCOME · FIRST 3",
      titlePre: "Your first 3 transfers",
      titleAccent: "home — fee-free.",
      titleAccentItalic: true,
      titleAccentColor: "#a7e8d1",
      cta: "Send home",
      footnote: "New corridor · USD → INR live",
      kind: "globe",
    },
    {
      label: "REFER · EARN",
      titlePre: "Bring a friend.",
      titleAccent: "You both get $20.",
      titleAccentItalic: true,
      titleAccentColor: "#9ad1ff",
      cta: "Share your invite",
      footnote: "Limit 5 invites · live this month",
      kind: "payout",
    },
    {
      label: "SPEED · SETTLEMENT",
      titlePre: "Money lands in",
      titleAccent: "92 seconds.",
      titleAccentItalic: true,
      titleAccentColor: "#e3b95c",
      titleTail: " Guaranteed.",
      cta: "How it works",
      footnote: "Faster than your bank",
      kind: "chain",
    },
    {
      label: "MARKET · LIVE",
      titlePre: "Watch merchants",
      titleAccent: "compete",
      titleAccentItalic: true,
      titleAccentColor: "#ffb38a",
      titleTail: " for your rate.",
      cta: "Open market",
      footnote: "Bidding 24/7 worldwide",
      kind: "chart",
    },
  ];

  return (
    <div className="relative w-full mb-10">
      {/* Scroller */}
      <div
        ref={scrollerRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 px-4 md:px-8 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
      >
        <style>{`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
        `}</style>
        {cards.map((c, i) => (
          <motion.div
            key={c.kind}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8%" }}
            transition={{ duration: 0.55, delay: i * 0.05, ease: EASE }}
            whileHover={{ y: -4 }}
            className="snap-start flex-shrink-0 relative rounded-[22px] overflow-hidden text-left flex flex-col group"
            style={{
              background: "#0a0a0a",
              border: "1px solid rgba(255,255,255,0.06)",
              width: "min(360px, 86vw)",
              transition: "transform 0.35s ease",
            }}
          >
            {/* TOP — animated illustration band */}
            <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16/10" }}>
              <MerchantIllustration kind={c.kind} />
            </div>

            {/* BOTTOM — copy + CTA */}
            <div className="px-5 py-5 flex-1 flex flex-col">
              {/* Label */}
              <div className="flex items-center gap-1.5 mb-2.5">
                <span
                  className="w-1 h-1 rounded-full"
                  style={{ background: c.titleAccentColor }}
                />
                <span className="text-[10px] font-bold tracking-[0.18em] text-white/55">
                  {c.label}
                </span>
              </div>

              {/* Headline */}
              <div
                className="font-display text-white leading-[1.1]"
                style={{
                  fontSize: "22px",
                  fontWeight: 600,
                  letterSpacing: "-0.025em",
                }}
              >
                {c.titlePre}{" "}
                <span
                  style={{
                    color: c.titleAccentColor,
                    fontStyle: c.titleAccentItalic ? "italic" : "normal",
                    fontWeight: c.titleAccentItalic ? 500 : 600,
                    fontFamily: c.titleAccentItalic
                      ? "ui-serif, Georgia, serif"
                      : undefined,
                  }}
                >
                  {c.titleAccent}
                </span>
                {c.titleTail && <span>{c.titleTail}</span>}
              </div>

              {/* CTA + footnote */}
              <div className="mt-5 flex items-center justify-between gap-3">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-black text-[12px] font-semibold tracking-tight hover:-translate-y-[1px] transition-transform"
                >
                  {c.cta}
                  <ArrowRight className="w-3 h-3" />
                </Link>
                {c.footnote && (
                  <span className="text-[10px] text-white/40 tracking-tight flex items-center gap-1.5 text-right">
                    <span className="w-1 h-1 rounded-full bg-white/30" />
                    <span className="leading-tight">{c.footnote}</span>
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Right arrow */}
      <button
        onClick={() => scrollBy(340)}
        disabled={!canScrollRight}
        aria-label="Scroll right"
        className="absolute top-1/2 -translate-y-1/2 right-2 md:right-4 z-10 w-11 h-11 rounded-full flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        style={{
          background: "#fff",
          color: "#000",
          boxShadow: "0 10px 28px -8px rgba(0,0,0,0.6)",
        }}
      >
        <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
      </button>

      {/* Left arrow */}
      <button
        onClick={() => scrollBy(-340)}
        disabled={!canScrollLeft}
        aria-label="Scroll left"
        className="absolute top-1/2 -translate-y-1/2 left-2 md:left-4 z-10 w-11 h-11 rounded-full flex items-center justify-center transition-all disabled:opacity-0 disabled:cursor-not-allowed"
        style={{
          background: "#fff",
          color: "#000",
          boxShadow: "0 10px 28px -8px rgba(0,0,0,0.6)",
        }}
      >
        <ArrowRight className="w-4 h-4 rotate-180" strokeWidth={2.5} />
      </button>
    </div>
  );
}

function MerchantIllustration({ kind }: { kind: string }) {
  // Refined "classy" palette — deep navy/indigo, gold + cream accents only
  const NAVY = "#0b1a2a";
  const INDIGO = "#1a2c4a";
  const GOLD = "#e3b95c";
  const CREAM = "#f0e7d2";
  const MIST = "#7a8db0";

  // 01 — Sleeping merchant under stars (Earn while you sleep)
  if (kind === "shop") {
    return (
      <svg viewBox="0 0 200 240" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="sky01" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e2547" />
            <stop offset="100%" stopColor="#0b1a2a" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="200" height="240" fill="url(#sky01)" />
        {/* Stars + crescent moon — gentle glow */}
        <motion.g
          animate={{ opacity: [1, 0.7, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M 160 36 a 14 14 0 1 0 6 14 a 11 11 0 0 1 -6 -14 z" fill={GOLD} />
        </motion.g>
        {[{x:28,y:30},{x:60,y:50},{x:108,y:24},{x:138,y:60},{x:184,y:90}].map((s,i)=>(
          <circle key={i} cx={s.x} cy={s.y} r={i%2?1.2:1.6} fill={CREAM} opacity="0.7" />
        ))}
        {/* zZz */}
        <text x="100" y="60" fontSize="13" fontWeight="500" fill={GOLD} opacity="0.65" fontFamily="ui-serif, Georgia">z</text>
        <text x="114" y="48" fontSize="10" fontWeight="500" fill={GOLD} opacity="0.45" fontFamily="ui-serif, Georgia">z</text>
        <text x="125" y="38" fontSize="7" fontWeight="500" fill={GOLD} opacity="0.3" fontFamily="ui-serif, Georgia">z</text>
        {/* Floor line */}
        <line x1="20" y1="200" x2="180" y2="200" stroke={MIST} strokeOpacity="0.2" strokeWidth="1" />
        {/* Bed silhouette */}
        <rect x="38" y="160" width="124" height="42" rx="3" fill={INDIGO} />
        <rect x="38" y="160" width="124" height="6" fill={GOLD} opacity="0.4" />
        {/* Pillow */}
        <rect x="46" y="148" width="36" height="14" rx="3" fill={CREAM} />
        {/* Person (head + body under blanket) */}
        <circle cx="64" cy="150" r="9" fill="#d4a878" />
        <path d="M 80 158 Q 110 138 150 158 L 150 200 L 80 200 Z" fill={CREAM} />
        <path d="M 88 168 Q 110 152 142 168" stroke={GOLD} strokeOpacity="0.35" strokeWidth="1" fill="none" />
        {/* Floating coins (gentle) */}
        <g>
          <circle cx="160" cy="120" r="8" fill={GOLD} />
          <text x="160" y="124" textAnchor="middle" fontSize="9" fontWeight="700" fill={NAVY}>$</text>
        </g>
        <g>
          <circle cx="22" cy="148" r="6" fill={GOLD} opacity="0.7" />
          <text x="22" y="151" textAnchor="middle" fontSize="7" fontWeight="700" fill={NAVY}>$</text>
        </g>
        {/* Bottom stat strip */}
        <rect x="0" y="222" width="200" height="18" fill={NAVY} />
        <text x="100" y="234" textAnchor="middle" fontSize="9" fontFamily="ui-monospace, monospace" fontWeight="700" fill={GOLD} letterSpacing="1.5">
          $391 / DAY AVG
        </text>
      </svg>
    );
  }

  // 02 — Live bid: stylized auction paddles
  if (kind === "bid") {
    return (
      <svg viewBox="0 0 200 240" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="sky02" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1f3d" />
            <stop offset="100%" stopColor="#0b1a2a" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="200" height="240" fill="url(#sky02)" />
        {/* Spotlight */}
        <ellipse cx="100" cy="120" rx="92" ry="58" fill={GOLD} opacity="0.08" />
        {/* Five paddles, varying heights */}
        {[
          { x: 32, h: 96, price: "$28", d: 0 },
          { x: 64, h: 80, price: "$30", d: 0.2 },
          { x: 100, h: 56, price: "$32", winner: true, d: 0.4 },
          { x: 136, h: 86, price: "$29", d: 0.6 },
          { x: 168, h: 72, price: "$31", d: 0.8 },
        ].map((p, i) => (
          <motion.g
            key={i}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: p.d }}
          >
            {/* Stick */}
            <rect x={p.x - 1.5} y={p.h + 30} width="3" height={180 - (p.h + 30)} fill={MIST} opacity="0.6" />
            {/* Paddle */}
            <rect x={p.x - 16} y={p.h} width="32" height="30" rx="3" fill={p.winner ? GOLD : INDIGO} stroke={CREAM} strokeOpacity="0.18" />
            <text x={p.x} y={p.h + 19} textAnchor="middle" fontSize="11" fontWeight="800" fill={p.winner ? NAVY : CREAM} fontFamily="ui-monospace, monospace">
              {p.price}
            </text>
            {/* Winner halo */}
            {p.winner && (
              <ellipse cx={p.x} cy={p.h + 15} rx="22" ry="22" fill="none" stroke={GOLD} strokeOpacity="0.4" strokeWidth="1" />
            )}
          </motion.g>
        ))}
        {/* Floor */}
        <line x1="20" y1="180" x2="180" y2="180" stroke={MIST} strokeOpacity="0.2" />
        {/* Bottom stat strip */}
        <rect x="0" y="222" width="200" height="18" fill={NAVY} />
        <text x="100" y="234" textAnchor="middle" fontSize="9" fontFamily="ui-monospace, monospace" fontWeight="700" fill={GOLD} letterSpacing="1.5">
          BEST BID — $32.00
        </text>
      </svg>
    );
  }

  // 03 — Single elegant chart card (Set your spread)
  if (kind === "chart") {
    return (
      <svg viewBox="0 0 200 240" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <rect x="0" y="0" width="200" height="240" fill={NAVY} />
        {/* Soft glow under chart */}
        <ellipse cx="100" cy="180" rx="100" ry="34" fill={GOLD} opacity="0.05" />
        {/* gridlines */}
        {[60, 90, 120, 150, 180].map((y) => (
          <line key={y} x1="20" y1={y} x2="180" y2={y} stroke={MIST} strokeOpacity="0.06" />
        ))}
        {/* axis */}
        <line x1="20" y1="190" x2="180" y2="190" stroke={MIST} strokeOpacity="0.15" />
        {/* Rising line — animated draw */}
        <motion.polyline
          points="26,180 50,168 76,152 100,128 126,108 152,86 176,62"
          stroke={GOLD}
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* Area under */}
        <polygon points="26,180 50,168 76,152 100,128 126,108 152,86 176,62 176,190 26,190" fill={GOLD} fillOpacity="0.1" />
        {/* Dots */}
        {[[26,180],[50,168],[76,152],[100,128],[126,108],[152,86],[176,62]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r={i===6?3.5:2} fill={i===6 ? GOLD : CREAM} />
        ))}
        {/* +18% chip in classy outline — pulse */}
        <motion.g
          animate={{ opacity: [1, 0.55, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <rect x="124" y="70" width="46" height="16" rx="8" fill={NAVY} stroke={GOLD} />
          <text x="147" y="81" textAnchor="middle" fontSize="9" fontFamily="ui-monospace, monospace" fontWeight="700" fill={GOLD}>+18%</text>
        </motion.g>
        {/* Bottom stat strip */}
        <rect x="0" y="222" width="200" height="18" fill={INDIGO} />
        <text x="100" y="234" textAnchor="middle" fontSize="9" fontFamily="ui-monospace, monospace" fontWeight="700" fill={GOLD} letterSpacing="1.5">
          SPREAD CAPTURED — 3%
        </text>
      </svg>
    );
  }

  // 04 — Elegant stopwatch (Settle in seconds)
  if (kind === "chain") {
    return (
      <svg viewBox="0 0 200 240" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <rect x="0" y="0" width="200" height="240" fill={NAVY} />
        {/* Stopwatch ring */}
        <circle cx="100" cy="110" r="52" fill={INDIGO} stroke={CREAM} strokeOpacity="0.18" />
        <circle cx="100" cy="110" r="52" fill="none" stroke={GOLD} strokeWidth="1.5" strokeDasharray="60 200" strokeDashoffset="-30" transform="rotate(-90 100 110)" />
        {/* Tick marks */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x1 = 100 + Math.cos(angle) * 46;
          const y1 = 110 + Math.sin(angle) * 46;
          const x2 = 100 + Math.cos(angle) * 50;
          const y2 = 110 + Math.sin(angle) * 50;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={CREAM} strokeOpacity={i%3===0?0.7:0.3} strokeWidth={i%3===0?1.5:1} />;
        })}
        {/* Hand — rotating slowly */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "100px 110px" }}
        >
          <line x1="100" y1="110" x2="100" y2="68" stroke={GOLD} strokeWidth="2" strokeLinecap="round" />
        </motion.g>
        <circle cx="100" cy="110" r="3" fill={GOLD} />
        {/* Center number */}
        <text x="100" y="138" textAnchor="middle" fontSize="22" fontWeight="700" fill={CREAM} fontFamily="ui-serif, Georgia">92s</text>
        <text x="100" y="150" textAnchor="middle" fontSize="6" fontWeight="600" fill={MIST} letterSpacing="2">AVG SETTLEMENT</text>
        {/* Crown / stem */}
        <rect x="96" y="50" width="8" height="6" rx="1" fill={GOLD} />
        {/* Bottom stat strip */}
        <rect x="0" y="222" width="200" height="18" fill={INDIGO} />
        <text x="100" y="234" textAnchor="middle" fontSize="9" fontFamily="ui-monospace, monospace" fontWeight="700" fill={GOLD} letterSpacing="1.5">
          FASTER THAN YOUR BANK
        </text>
      </svg>
    );
  }

  // 05 — Classy globe with merchant pins
  if (kind === "globe") {
    return (
      <svg viewBox="0 0 200 240" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <rect x="0" y="0" width="200" height="240" fill={NAVY} />
        {/* Stars */}
        {[{x:25,y:30},{x:60,y:50},{x:160,y:30},{x:175,y:80},{x:30,y:170}].map((s,i)=>(
          <circle key={i} cx={s.x} cy={s.y} r="1.3" fill={CREAM} opacity="0.6" />
        ))}
        {/* Globe */}
        <circle cx="100" cy="118" r="56" fill={INDIGO} />
        <circle cx="100" cy="118" r="56" fill="none" stroke={GOLD} strokeOpacity="0.35" strokeWidth="1.2" />
        {/* Latitude */}
        <ellipse cx="100" cy="118" rx="56" ry="16" fill="none" stroke={MIST} strokeOpacity="0.3" />
        <ellipse cx="100" cy="118" rx="56" ry="30" fill="none" stroke={MIST} strokeOpacity="0.22" />
        {/* Longitude */}
        <ellipse cx="100" cy="118" rx="32" ry="56" fill="none" stroke={MIST} strokeOpacity="0.25" />
        <ellipse cx="100" cy="118" rx="16" ry="56" fill="none" stroke={MIST} strokeOpacity="0.18" />
        {/* Continents — subtle gold, very slow drift */}
        <motion.g
          animate={{ x: [0, 6, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M 70 92 q 8 -6 18 -2 q 6 8 -2 14 q -14 4 -16 -12 z" fill={GOLD} opacity="0.45" />
          <path d="M 112 110 q 14 -2 22 6 q 4 12 -10 16 q -16 -2 -12 -22 z" fill={GOLD} opacity="0.45" />
          <path d="M 88 140 q 10 0 18 6 q -4 10 -16 8 q -10 -4 -2 -14 z" fill={GOLD} opacity="0.4" />
        </motion.g>
        {/* Merchant pins */}
        {[
          { x: 78, y: 96 },
          { x: 124, y: 112 },
          { x: 108, y: 148 },
        ].map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="3" fill={GOLD} />
            <circle cx={p.x} cy={p.y} r="6" fill="none" stroke={GOLD} strokeOpacity="0.4" />
          </g>
        ))}
        {/* Connecting arc */}
        <path d="M 78 96 Q 100 70 124 112" stroke={GOLD} strokeOpacity="0.35" strokeWidth="1" strokeDasharray="2 3" fill="none" />
        {/* Bottom stat strip */}
        <rect x="0" y="222" width="200" height="18" fill={INDIGO} />
        <text x="100" y="234" textAnchor="middle" fontSize="9" fontFamily="ui-monospace, monospace" fontWeight="700" fill={GOLD} letterSpacing="1.5">
          47 COUNTRIES · LIVE
        </text>
      </svg>
    );
  }

  // 06 — Phone receiving instant payout (refined)
  if (kind === "payout") {
    return (
      <svg viewBox="0 0 200 240" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <rect x="0" y="0" width="200" height="240" fill={NAVY} />
        {/* Soft halo */}
        <ellipse cx="100" cy="120" rx="80" ry="86" fill={GOLD} opacity="0.05" />
        {/* Phone */}
        <rect x="62" y="48" width="76" height="140" rx="12" fill={INDIGO} stroke={CREAM} strokeOpacity="0.18" />
        <rect x="66" y="54" width="68" height="128" rx="8" fill={CREAM} />
        {/* Notch */}
        <rect x="92" y="56" width="16" height="3" rx="1.5" fill={INDIGO} />
        {/* Status label */}
        <text x="100" y="90" textAnchor="middle" fontSize="6.5" fontWeight="700" fill={MIST} letterSpacing="2">CASHED OUT</text>
        {/* Big number */}
        <text x="100" y="120" textAnchor="middle" fontSize="20" fontFamily="ui-serif, Georgia" fontWeight="700" fill={NAVY}>$1,247</text>
        <text x="100" y="130" textAnchor="middle" fontSize="6.5" fontFamily="ui-monospace, monospace" fontWeight="600" fill={MIST} letterSpacing="1.5">USDT</text>
        {/* Status row */}
        <rect x="76" y="142" width="48" height="14" rx="7" fill={GOLD} />
        <text x="100" y="152" textAnchor="middle" fontSize="7" fontWeight="800" fill={NAVY} letterSpacing="1.5">INSTANT</text>
        {/* Sparkle dots around phone — twinkle */}
        {[
          { cx: 34, cy: 120, r: 2, d: 0 },
          { cx: 170, cy: 100, r: 1.8, d: 0.4 },
          { cx: 172, cy: 160, r: 1.5, d: 0.8 },
          { cx: 28, cy: 170, r: 1.4, d: 1.2 },
        ].map((s, i) => (
          <motion.circle
            key={i}
            cx={s.cx}
            cy={s.cy}
            r={s.r}
            fill={GOLD}
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.7, 1.2, 0.7] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: s.d }}
          />
        ))}
        {/* Bottom stat strip */}
        <rect x="0" y="222" width="200" height="18" fill={INDIGO} />
        <text x="100" y="234" textAnchor="middle" fontSize="9" fontFamily="ui-monospace, monospace" fontWeight="700" fill={GOLD} letterSpacing="1.5">
          PAID IN UNDER 60s
        </text>
      </svg>
    );
  }

  return null;
}

export default memo(CinematicHero);
