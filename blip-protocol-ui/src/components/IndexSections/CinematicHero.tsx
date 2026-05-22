import { useEffect, useRef, useState, useMemo, memo } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Loader2,
  AlertCircle,
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
              <span className="absolute inset-0 rounded-full bg-[#3ddc84] opacity-60 animate-ping" />
              <span className="relative inline-flex rounded-full w-1 h-1 bg-[#3ddc84]" />
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
            <span className="absolute inset-0 rounded-full bg-[#3ddc84] opacity-60 animate-ping" />
            <span className="relative inline-flex rounded-full w-1 h-1 bg-[#3ddc84]" />
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
                color: "#7be5ad",
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
                <span className="text-[#3ddc84]">●</span> Online · vol $0
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
                  color: "#7be5ad",
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
              isPending ? "text-emerald-400" : "text-white"
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
              color: isPending ? "#7be5ad" : "#ffc790",
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
        style={{ color: active ? "#7be5ad" : "rgba(255,255,255,0.55)" }}
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
          className="w-3 h-3 text-[#7be5ad] shrink-0"
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
      <span className="font-mono text-[11px] font-semibold tabular-nums text-[#7be5ad] shrink-0 ml-2">
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
      ? "#7be5ad"
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
        <div className="flex flex-col items-center text-center min-h-[44vh] md:min-h-[48vh] justify-end">
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

        {/* Merchant CTAs below the dashboard — only appear after user submits a trade */}
        {dashboardState.userHasTraded && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mt-10 md:mt-14 flex flex-col items-center text-center"
        >
          <div className="text-[10.5px] font-semibold tracking-[0.3em] uppercase mb-4" style={{ color: "#cc785c" }}>
            Earn on every order
          </div>

          <h2
            className="font-display text-white max-w-[680px] mx-auto"
            style={{
              fontSize: "clamp(1.9rem, 4.2vw, 3rem)",
              fontWeight: 500,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              marginBottom: 14,
            }}
          >
            <span className="text-white/55">In this trade, the merchant made </span>
            <motion.span
              key={dashboardState.lastEarning ?? 0}
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="font-mono tabular-nums"
              style={{ color: "#cc785c" }}
            >
              ${(dashboardState.lastEarning ?? 30).toFixed(0)}
            </motion.span>
            <span className="text-white/55">.</span>
          </h2>

          <p className="text-white/55 max-w-[440px] mx-auto leading-[1.5] text-[14px] md:text-[15px] mb-8 tracking-tight">
            Verified merchants bid on every order. Set your spread, win volume,
            settle on-chain.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <Link
              to="/merchant"
              className="group relative inline-flex items-center justify-center gap-2 w-full sm:w-auto sm:min-w-[200px] h-[48px] px-7 rounded-full bg-white text-black text-[14px] font-semibold tracking-tight transition-all duration-300 shadow-[0_1px_0_rgba(255,255,255,0.4)_inset,0_10px_30px_-10px_rgba(255,255,255,0.3)] hover:-translate-y-[1px] active:scale-[0.985]"
            >
              <span>Become a merchant now</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="mt-4 text-[11.5px] text-white/40 tracking-tight">
            ${dashboardState.totalEarned.toFixed(0)} earned today · {dashboardState.activeTrades.length + dashboardState.pendingOrders.length} live orders
          </div>
        </motion.div>
        )}
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
  const blurPx = useTransform(scrollYProgress, [0, 0.35, 0.6], [6, 2, 0]);
  const filter = useTransform(blurPx, (v) => `blur(${v}px)`);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.55], [0.45, 0.75, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.6], [0.985, 1]);

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
      {/* Dashboard surface — scroll-linked depth */}
      <motion.div
        className="relative rounded-2xl overflow-hidden"
        style={{
          filter,
          opacity,
          scale,
          background: "#0a0a0a",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow:
            "0 60px 120px -40px rgba(0,0,0,0.85), 0 1px 0 rgba(255,255,255,0.03) inset",
          transformOrigin: "center top",
        }}
      >
        {/* Minimal chrome — no traffic-light dots, just a quiet corridor strip */}
        <div className="flex items-center justify-center px-4 py-2 border-b border-white/[0.04]" style={{ background: "rgba(255,255,255,0.015)" }}>
          <div className="text-[9.5px] font-mono uppercase tracking-[0.32em] text-white/30">
            Settlement Network · Live
          </div>
        </div>

        <MerchantDashboardBody state={state} />
      </motion.div>

      {/* Top fade — bleeds dashboard into hero darkness */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-24 pointer-events-none rounded-t-2xl"
        style={{
          background:
            "linear-gradient(180deg, #000 0%, rgba(0,0,0,0.6) 50%, transparent 100%)",
        }}
      />
      {/* Bottom fade — sinks dashboard into next section */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-32 pointer-events-none rounded-b-2xl"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.7) 60%, #000 100%)",
        }}
      />
    </motion.div>
  );
}

export default memo(CinematicHero);
