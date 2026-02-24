import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  generateMarketRate,
  generateOrder,
  generateOrders,
  generateActiveOrder,
  generateLeaderboard,
  generateNotification,
  generateNotifications,
  generateMessage,
  generateMessages,
  generateActivity,
  generateActivities,
  getCurrencyPairs,
  formatNumber,
} from "@/utils/liveDataGenerator";

// ── Animated Number ──────────────────────────────────────────────────────────
function AnimNum({ value, decimals = 2 }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    const start = prev.current;
    const end = value;
    const dur = 500;
    const t0 = Date.now();
    const step = () => {
      const p = Math.min((Date.now() - t0) / dur, 1);
      setDisplay(start + (end - start) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    prev.current = value;
  }, [value]);
  return (
    <span>
      {Number(display).toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
    </span>
  );
}

// ── SVG Icons (inline to avoid dependencies) ─────────────────────────────────

// ── 1. Trade Panel ───────────────────────────────────────────────────────────
function TradePanel() {
  const [rate, setRate] = useState(() => generateMarketRate());
  const pairs = getCurrencyPairs();

  useEffect(() => {
    const i = setInterval(() => setRate(generateMarketRate(pairs[0])), 3500);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Badges row */}
      <div className="flex items-center gap-1.5 mb-3 flex-wrap">
        <div className="flex items-center gap-1">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
          </span>
          <span className="text-[8px] font-bold text-green-400 tracking-wider">
            LIVE
          </span>
        </div>
        <span className="text-[7px] px-1.5 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/[0.06]">
          ◆ SILVER
        </span>
        <span className="text-[7px] px-1.5 py-0.5 rounded-full bg-white/5 text-white/30 font-mono">
          RNK #12
        </span>
        <span className="text-[7px] px-1.5 py-0.5 rounded-full bg-white/5 text-white/30 font-mono">
          WIN 30%
        </span>
        <span className="text-[7px] px-1.5 py-0.5 rounded-full bg-white/5 text-white/20 font-mono">
          FILL —
        </span>
        <span className="ml-auto text-[7px] px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-bold border border-orange-500/30">
          ⚡ ACTIVE
        </span>
      </div>

      {/* Available Balance */}
      <div className="mb-3">
        <p className="text-[8px] uppercase tracking-[0.2em] text-white/30 mb-0.5">
          Available Balance
        </p>
        <p className="text-[28px] font-bold text-white font-mono tracking-tight leading-none">
          10,000
        </p>
        <p className="text-[8px] text-white/20 font-mono mt-0.5">
          = 38,700 AED
        </p>
        <div className="inline-flex items-center gap-1 mt-1.5 px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20 text-[8px] font-semibold">
          <span>🚀 +4.56 USDT</span>
          <span className="px-1 py-0.5 rounded bg-green-500/20 text-[7px]">
            24h
          </span>
        </div>
        <p className="text-[7px] text-white/15 mt-1">246 locked in escrow</p>
      </div>

      {/* sAED / INR CASH */}
      <div className="grid grid-cols-2 gap-1.5 mb-3">
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-2">
          <div className="flex items-center gap-1 mb-0.5">
            <span className="text-[7px] text-white/30 uppercase">sAED</span>
            <span className="text-[7px] font-bold px-1 rounded bg-green-500/20 text-green-400">
              BUY
            </span>
            <span className="text-[7px] font-bold px-1 rounded bg-red-500/20 text-red-400">
              SELL
            </span>
            <div className="ml-auto flex gap-0.5">
              <div className="w-3 h-3 rounded bg-white/[0.06] flex items-center justify-center">
                <span className="text-[5px] text-white/20">👁</span>
              </div>
              <div className="w-3 h-3 rounded bg-white/[0.06] flex items-center justify-center">
                <span className="text-[5px] text-white/20">◎</span>
              </div>
            </div>
          </div>
          <p className="text-sm font-bold text-white font-mono">0</p>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-2">
          <span className="text-[7px] text-white/30 uppercase block mb-0.5">
            INR CASH
          </span>
          <p className="text-sm font-bold text-white font-mono">₹0</p>
        </div>
      </div>

      {/* Market Rate */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-2 mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[7px] uppercase tracking-wider text-white/30">
            Market Rate <span className="text-orange-400/60">*EST</span>
          </span>
          <button className="text-[7px] px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold border border-orange-500/30">
            SET PRICE
          </button>
        </div>
        <p className="text-xl font-bold text-white font-mono leading-none">
          <AnimNum value={rate.rate} decimals={4} />
        </p>
        <p className="text-[7px] text-white/15 mt-0.5">USDT/AED</p>
      </div>

      {/* Corridor */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-2 mb-3">
        <div className="flex items-center justify-between">
          <span className="text-[7px] uppercase tracking-wider text-white/30">
            ⟐ Corridor
          </span>
          <span className="text-[7px] text-white/20 font-mono">
            0 online · vol 0 ▾
          </span>
        </div>
        <div className="flex gap-3 mt-1 text-[7px] text-white/15 font-mono">
          <span>3 done</span>
          <span>7 cancelled</span>
          <span>10 total</span>
        </div>
      </div>

      {/* Amount */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[7px] uppercase tracking-wider text-white/30">
            ⇄ Amount
          </span>
          <span className="text-[7px] text-orange-400 font-bold">
            MAX 10,000
          </span>
        </div>
        <div className="relative">
          <div className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-2.5 py-2 text-sm font-mono text-white/15">
            0
          </div>
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[8px] text-white/20">
            USDT
          </span>
        </div>
      </div>

      {/* Payment */}
      <div className="grid grid-cols-2 gap-1.5 mb-3">
        <div className="bg-white/10 text-white border border-white/15 rounded-lg py-1.5 text-center text-[8px] font-semibold">
          Bank Transfer
        </div>
        <div className="bg-white/[0.03] text-white/25 border border-white/[0.06] rounded-lg py-1.5 text-center text-[8px] font-semibold">
          Cash
        </div>
      </div>

      {/* Spread */}
      <div className="mb-3">
        <span className="text-[7px] uppercase tracking-wider text-white/30 block mb-1">
          Spread
        </span>
        <div className="grid grid-cols-3 gap-1.5">
          <div className="bg-orange-500/15 border border-orange-500/40 rounded-lg py-1.5 text-center">
            <span className="text-[8px] font-semibold text-orange-400 block">
              Fast
            </span>
            <span className="text-[7px] font-mono text-orange-400/60">
              +2.5%
            </span>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg py-1.5 text-center">
            <span className="text-[8px] font-semibold text-white/30 block">
              Best
            </span>
            <span className="text-[7px] font-mono text-white/15">+2%</span>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg py-1.5 text-center">
            <span className="text-[8px] font-semibold text-white/30 block">
              ~&gt; Cheap
            </span>
            <span className="text-[7px] font-mono text-white/15">+1.5%</span>
          </div>
        </div>
      </div>

      {/* Boost */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[7px] uppercase tracking-wider text-white/30">
            ⚡ Boost
          </span>
          <span className="text-[7px] text-white/15">manual</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {[0, 5, 10, 15].map((v) => (
            <div
              key={v}
              className={`rounded-lg py-1.5 text-center text-[8px] font-semibold ${v === 0 ? "bg-white/10 text-white border border-white/15" : "bg-white/[0.03] text-white/20 border border-white/[0.06]"}`}
            >
              {v === 0 ? "0" : `${v}%`}
            </div>
          ))}
        </div>
      </div>

      {/* Buy / Sell */}
      <div className="grid grid-cols-2 gap-2 mt-auto">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-2.5 rounded-lg text-[10px] font-bold text-center shadow-[0_0_20px_rgba(34,197,94,0.2)]">
          BUY
        </div>
        <div className="bg-white/[0.03] text-white/30 border border-white/[0.06] py-2.5 rounded-lg text-[10px] font-bold text-center">
          SELL
        </div>
      </div>
    </div>
  );
}

// ── 2. Pending Orders Panel ──────────────────────────────────────────────────
function PendingOrdersPanel() {
  const [orders, setOrders] = useState(() => generateOrders(5));

  // Auto-add new orders every 5s, cap at 8
  useEffect(() => {
    const i = setInterval(() => {
      setOrders((prev) => {
        const next = [generateOrder(), ...prev];
        return next.slice(0, 8);
      });
    }, 5000);
    return () => clearInterval(i);
  }, []);

  // Auto-remove oldest order every 7s (simulates acceptance)
  useEffect(() => {
    const i = setInterval(() => {
      setOrders((prev) => (prev.length > 2 ? prev.slice(0, -1) : prev));
    }, 7000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[9px] font-semibold text-white/70 border-b border-orange-500 pb-0.5">
          Pending
        </span>
        <span className="text-[9px] text-white/20">All</span>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="relative flex h-1 w-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1 w-1 bg-orange-500" />
            </span>
            <span className="text-[7px] text-orange-400 font-semibold">
              Live
            </span>
          </div>
          <div className="flex gap-1">
            <div className="w-4 h-4 rounded bg-white/[0.04] flex items-center justify-center">
              <svg
                className="w-2.5 h-2.5 text-white/20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </div>
            <div className="w-4 h-4 rounded bg-white/[0.04] flex items-center justify-center">
              <svg
                className="w-2.5 h-2.5 text-white/20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
            </div>
          </div>
          <span className="text-[7px] text-white/15 font-mono">
            {orders.length}
          </span>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex items-center gap-0.5 mb-2 overflow-hidden">
        {["All", "Mineable", "High Premium", "Large", "Expiring"].map(
          (f, i) => (
            <span
              key={f}
              className={`text-[6px] px-1 py-[2px] rounded whitespace-nowrap ${i === 0 ? "bg-white/10 text-white border border-white/15" : "text-white/20"}`}
            >
              {f}
            </span>
          ),
        )}
      </div>

      {/* Search + Sort */}
      <div className="flex gap-1.5 mb-2">
        <div className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-md px-2 py-1 text-[8px] text-white/15 flex items-center gap-1">
          <svg
            className="w-2.5 h-2.5 text-white/15"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          Search orders...
        </div>
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-md px-2 py-1 text-[8px] text-white/20 flex items-center gap-1">
          Time <span className="text-[6px]">▼</span>
        </div>
      </div>

      {/* Order list */}
      <div className="flex-1 overflow-y-auto space-y-1 scrollbar-none">
        <AnimatePresence mode="popLayout">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              layout
              initial={{ opacity: 0, y: -10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-2 hover:border-white/10 transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[6px] font-bold ${order.online ? "bg-green-500/20 text-green-400 ring-1 ring-green-500/30" : "bg-white/5 text-white/20"}`}
                  >
                    {order.user.charAt(0)}
                  </div>
                  <span className="text-[8px] font-semibold text-white/60">
                    {order.user}
                  </span>
                  <span className="text-[6px] text-white/15 font-mono">
                    ({order.completedTrades}t)
                  </span>
                </div>
                <span
                  className={`text-[7px] font-bold px-1.5 py-0.5 rounded ${order.type === "BUY" ? "bg-green-500/15 text-green-400 border border-green-500/20" : "bg-red-500/15 text-red-400 border border-red-500/20"}`}
                >
                  {order.type}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-white/80 font-mono">
                  {order.amount.toLocaleString()} {order.currency}
                </span>
                <span className="text-[7px] text-white/25 font-mono">
                  {order.rate}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[6px] text-white/20">
                  {order.paymentMethod}
                </span>
                <span className="text-[6px] text-white/15">
                  {order.timePosted}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── 3. In Progress Panel ─────────────────────────────────────────────────────
function InProgressPanel() {
  const [trades, setTrades] = useState(() =>
    Array.from({ length: 3 }, () => generateActiveOrder()),
  );

  // Increment progress every 2s
  useEffect(() => {
    const i = setInterval(() => {
      setTrades((prev) => {
        const updated = prev.map((t) =>
          t.progress < 100
            ? {
                ...t,
                progress: Math.min(
                  t.progress + Math.floor(Math.random() * 15 + 5),
                  100,
                ),
              }
            : t,
        );
        // Remove completed and add new ones
        const active = updated.filter((t) => t.progress < 100);
        const completed = updated.filter((t) => t.progress >= 100);
        if (completed.length > 0) {
          return [
            ...active,
            ...Array.from({ length: completed.length }, () =>
              generateActiveOrder(),
            ),
          ];
        }
        return updated;
      });
    }, 2500);
    return () => clearInterval(i);
  }, []);

  const statusColor = (status) => {
    if (status === "Releasing")
      return "text-green-400 bg-green-500/10 border-green-500/20";
    if (status === "Payment Sent")
      return "text-blue-400 bg-blue-500/10 border-blue-500/20";
    if (status === "Confirming")
      return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
    return "text-orange-400 bg-orange-500/10 border-orange-500/20";
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[9px] font-semibold text-white/50 uppercase tracking-wider">
          In Progress
        </span>
        <span className="text-[7px] px-1.5 py-0.5 rounded-full bg-orange-500/15 text-orange-400 font-mono font-bold">
          {trades.length}
        </span>
      </div>

      {/* Active trades */}
      <div className="flex-1 overflow-y-auto space-y-2 scrollbar-none">
        <AnimatePresence mode="popLayout">
          {trades.map((trade) => (
            <motion.div
              key={trade.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-2.5"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-white/5 flex items-center justify-center text-[6px] font-bold text-white/30">
                    {trade.user.charAt(0)}
                  </div>
                  <span className="text-[8px] font-semibold text-white/60">
                    {trade.user}
                  </span>
                </div>
                <span
                  className={`text-[6px] font-bold px-1.5 py-0.5 rounded border ${statusColor(trade.status)}`}
                >
                  {trade.status}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-white/80 font-mono">
                  {trade.amount.toLocaleString()} {trade.currency}
                </span>
                <span className="text-[7px] text-white/25 font-mono">
                  @ {trade.rate}
                </span>
              </div>
              {/* Progress bar */}
              <div className="relative h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                <motion.div
                  className={`absolute inset-y-0 left-0 rounded-full ${trade.progress >= 80 ? "bg-green-500" : trade.progress >= 50 ? "bg-blue-500" : "bg-orange-500"}`}
                  initial={false}
                  animate={{ width: `${trade.progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[6px] text-white/20">
                  {trade.paymentMethod}
                </span>
                <span className="text-[6px] text-white/25 font-mono font-bold">
                  {trade.progress}%
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Divider */}
      <div className="border-t border-white/[0.04] my-2" />

      {/* LP Assignments summary */}
      <div className="flex items-center justify-between">
        <span className="text-[7px] text-white/20 uppercase tracking-wider">
          LP Assignments
        </span>
        <span className="text-[7px] text-white/15 font-mono">
          {Math.floor(Math.random() * 3)} active
        </span>
      </div>
    </div>
  );
}

// ── 4. Leaderboard + Activity Panel ──────────────────────────────────────────
function LeaderboardPanel() {
  const [leaders, setLeaders] = useState(() => generateLeaderboard(9));
  const [activities, setActivities] = useState(() => generateActivities(4));
  const [doneCount, setDoneCount] = useState(3);
  const [failedCount, setFailedCount] = useState(7);

  // Shuffle volumes every 6s
  useEffect(() => {
    const i = setInterval(() => {
      setLeaders((prev) =>
        prev
          .map((e) => ({
            ...e,
            volume: e.volume + Math.floor((Math.random() - 0.3) * 5000),
            trades: e.trades + (Math.random() > 0.7 ? 1 : 0),
          }))
          .sort((a, b) => b.volume - a.volume)
          .map((e, idx) => ({ ...e, rank: idx + 1 })),
      );
    }, 6000);
    return () => clearInterval(i);
  }, []);

  // Add new activity every 8s
  useEffect(() => {
    const i = setInterval(() => {
      const a = generateActivity();
      setActivities((prev) => [a, ...prev].slice(0, 5));
      if (a.status === "done") setDoneCount((p) => p + 1);
      if (a.status === "failed") setFailedCount((p) => p + 1);
    }, 8000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Leaderboard Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[9px] font-bold text-white/50 uppercase tracking-wider">
          Leaderboard
        </span>
        <div className="flex gap-0.5 bg-white/[0.03] rounded p-0.5 border border-white/[0.06]">
          {["Volume", "Rated", "Rep"].map((t, i) => (
            <span
              key={t}
              className={`text-[7px] font-semibold px-2 py-0.5 rounded ${i === 0 ? "bg-white/10 text-white" : "text-white/20"}`}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Entries */}
      <div className="flex-1 space-y-0">
        <AnimatePresence mode="popLayout">
          {leaders.map((entry) => (
            <motion.div
              key={entry.name}
              layout
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="flex items-center gap-2 py-[3px] px-1 rounded hover:bg-white/[0.02] transition-colors"
            >
              <span
                className={`text-[8px] font-bold w-3 text-right font-mono ${entry.rank <= 3 ? "text-orange-400/60" : "text-white/20"}`}
              >
                {entry.rank}
              </span>
              <div className="flex items-center gap-1 flex-1 min-w-0">
                <div
                  className={`w-3 h-3 rounded-full flex items-center justify-center text-[5px] font-bold ${entry.online ? "bg-green-500/20 text-green-400" : "bg-white/5 text-white/20"}`}
                >
                  {entry.name.charAt(0)}
                </div>
                <span className="text-[9px] font-semibold text-white/60 truncate">
                  {entry.name}
                </span>
              </div>
              <span className="text-[7px] text-white/20 font-mono">
                {entry.trades}t
              </span>
              <span className="text-[8px] font-semibold text-white/35 font-mono">
                {formatNumber(entry.volume)}
              </span>
              <div className="flex items-center gap-0.5">
                <span className="text-[7px] text-orange-400/60">★</span>
                <span className="text-[7px] text-white/25 font-mono">
                  {entry.rating}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Activity Section */}
      <div className="mt-2 pt-2 border-t border-white/[0.04]">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[7px] text-white/20">◎</span>
            <span className="text-[8px] font-bold text-white/35 uppercase tracking-wider">
              Activity
            </span>
          </div>
          <div className="flex gap-0.5 bg-white/[0.03] rounded p-0.5 border border-white/[0.06]">
            {[
              { label: "Txns", active: true },
              { label: `Done ${doneCount}`, active: false },
              { label: `Failed ${failedCount}`, active: false },
              { label: "Open", active: false },
            ].map((t) => (
              <span
                key={t.label}
                className={`text-[6px] px-1.5 py-0.5 rounded ${t.active ? "bg-white/10 text-white" : "text-white/15"}`}
              >
                {t.label}
              </span>
            ))}
            <span className="text-[6px] text-white/10 px-0.5">▾</span>
          </div>
        </div>

        {/* Activity list */}
        <div className="space-y-1 mt-1">
          <AnimatePresence mode="popLayout">
            {activities.map((a) => (
              <motion.div
                key={a.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-1.5 py-0.5"
              >
                <div
                  className={`w-1 h-1 rounded-full ${a.status === "done" ? "bg-green-500" : a.status === "failed" ? "bg-red-500" : "bg-yellow-500"}`}
                />
                <span className="text-[7px] text-white/40 flex-1 truncate">
                  {a.description}
                </span>
                <span className="text-[7px] text-white/25 font-mono">
                  {a.amount} {a.currency}
                </span>
                <span className="text-[6px] text-white/15">{a.time}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ── 5. Notifications + Messages Panel ────────────────────────────────────────
function NotificationsPanel() {
  const [notifs, setNotifs] = useState(() => generateNotifications(4));
  const [messages, setMessages] = useState(() => generateMessages(3));

  // Add new notification every 6s
  useEffect(() => {
    const i = setInterval(() => {
      setNotifs((prev) => [generateNotification(), ...prev].slice(0, 8));
    }, 6000);
    return () => clearInterval(i);
  }, []);

  // Add new message every 10s
  useEffect(() => {
    const i = setInterval(() => {
      setMessages((prev) => [generateMessage(), ...prev].slice(0, 5));
    }, 10000);
    return () => clearInterval(i);
  }, []);

  const typeIcon = (type) => {
    if (type === "trade" || type === "completion") return "⇄";
    if (type === "escrow") return "🔒";
    if (type === "alert") return "⚠";
    if (type === "market") return "📊";
    if (type === "lp") return "◆";
    return "🔔";
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[9px] font-bold text-white/50 uppercase tracking-wider">
          Notifications
        </span>
        <span className="text-[7px] px-1.5 py-0.5 rounded-full bg-orange-500/15 text-orange-400 font-mono font-bold">
          {notifs.filter((n) => !n.read).length}
        </span>
      </div>

      {/* Notifications list */}
      <div className="flex-1 overflow-y-auto space-y-1 scrollbar-none">
        <AnimatePresence mode="popLayout">
          {notifs.map((n) => (
            <motion.div
              key={n.id}
              layout
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
              className={`flex items-start gap-2 p-1.5 rounded-lg transition-colors ${n.read ? "bg-transparent" : "bg-white/[0.02]"}`}
            >
              <div className="w-5 h-5 rounded-full bg-white/[0.04] flex items-center justify-center flex-shrink-0 mt-0.5 text-[8px]">
                {typeIcon(n.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[7px] text-white/45 leading-relaxed truncate">
                  {n.text}
                </p>
                <p className="text-[6px] text-white/15 font-mono mt-0.5">
                  {n.time}
                </p>
              </div>
              {!n.read && (
                <div className="w-1 h-1 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Messages section */}
      <div className="border-t border-white/[0.04] pt-2 mt-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[7px] text-white/20">◯</span>
            <span className="text-[8px] font-bold text-white/35 uppercase tracking-wider">
              Messages
            </span>
          </div>
          <span className="text-[7px] px-1.5 py-0.5 rounded-full bg-white/5 text-white/20 font-mono">
            {messages.filter((m) => m.unread).length}
          </span>
        </div>

        <div
          className="space-y-1 overflow-y-auto scrollbar-none"
          style={{ maxHeight: "120px" }}
        >
          <AnimatePresence mode="popLayout">
            {messages.map((m) => (
              <motion.div
                key={m.id}
                layout
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-white/[0.02] transition-colors"
              >
                <div className="relative">
                  <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[6px] font-bold text-white/25">
                    {m.user.charAt(0)}
                  </div>
                  {m.online && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-green-500 border border-[#0c0c0c]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[7px] font-semibold text-white/50">
                      {m.user}
                    </span>
                    <span className="text-[5px] text-white/15">{m.time}</span>
                  </div>
                  <p className="text-[6px] text-white/25 truncate">{m.text}</p>
                </div>
                {m.unread && (
                  <div className="w-1 h-1 rounded-full bg-blue-500 flex-shrink-0" />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard Preview (Index page showcase) ──────────────────────────────────
// Renders at 1400px native width, then CSS-scales to fit parent container
const NATIVE_WIDTH = 1400;

export default function DashboardPreview() {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const parentWidth = containerRef.current.offsetWidth;
        setScale(Math.min(parentWidth / NATIVE_WIDTH, 1));
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div ref={containerRef} className="relative w-full">
        {/* Glow */}
        <div className="absolute -inset-4 bg-gradient-to-b from-orange-500/5 via-transparent to-transparent rounded-3xl blur-2xl pointer-events-none" />
        <div className="absolute -inset-1 bg-gradient-to-b from-white/[0.08] to-transparent rounded-2xl pointer-events-none" />

        {/* Scaled wrapper — height collapses to match scaled content */}
        <div style={{ height: scale < 1 ? `${830 * scale}px` : "auto" }}>
          <div
            style={{
              width: `${NATIVE_WIDTH}px`,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            {/* Browser window */}
            <div className="relative bg-[#0a0a0a] rounded-2xl border border-white/[0.08] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden">
              {/* ── Title bar / Header ──────────────────────────────────────── */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-[#080808]">
                {/* Left — Logo */}
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-[0_0_10px_rgba(255,107,53,0.3)]">
                    <svg
                      className="w-3.5 h-3.5 text-white"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-white">
                    Blip{" "}
                    <span className="text-white/40 font-normal italic">
                      money
                    </span>
                  </span>
                </div>

                {/* Center — Nav */}
                <div className="flex items-center gap-1 bg-white/[0.03] rounded-xl p-1 border border-white/[0.06]">
                  {["Dashboard", "Analytics", "Wallet", "Settings"].map(
                    (t, i) => (
                      <span
                        key={t}
                        className={`text-[11px] font-medium px-4 py-1.5 rounded-lg ${i === 0 ? "bg-white/10 text-white border border-white/[0.08]" : "text-white/30"}`}
                      >
                        {t}
                      </span>
                    ),
                  )}
                </div>

                {/* Right — Actions + User */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white/25"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </div>
                    <div className="w-7 h-7 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white/25"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="19" cy="12" r="1" />
                        <circle cx="5" cy="12" r="1" />
                      </svg>
                    </div>
                    <div className="relative w-7 h-7 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white/25"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pl-3 border-l border-white/[0.06]">
                    <div className="w-7 h-7 rounded-full bg-white/[0.05] flex items-center justify-center text-[9px] font-bold text-white/30 ring-1 ring-white/[0.08]">
                      J
                    </div>
                    <span className="text-[11px] text-white/35 font-medium">
                      jojo2
                    </span>
                  </div>
                </div>
              </div>

              {/* ── Dashboard Content — 5 column grid ──────────────────────── */}
              <div
                className="grid gap-2 p-2"
                style={{
                  gridTemplateColumns: "250px 270px 1fr 280px 220px",
                  height: "780px",
                }}
              >
                {/* Trade Panel */}
                <div className="bg-[#0c0c0c] border border-white/[0.06] rounded-xl p-3 overflow-hidden">
                  <TradePanel />
                </div>

                {/* Pending Orders */}
                <div className="bg-[#0c0c0c] border border-white/[0.06] rounded-xl p-3 overflow-hidden">
                  <PendingOrdersPanel />
                </div>

                {/* In Progress */}
                <div className="bg-[#0c0c0c] border border-white/[0.06] rounded-xl p-3 overflow-hidden">
                  <InProgressPanel />
                </div>

                {/* Leaderboard + Activity */}
                <div className="bg-[#0c0c0c] border border-white/[0.06] rounded-xl p-3 overflow-hidden">
                  <LeaderboardPanel />
                </div>

                {/* Notifications + Messages */}
                <div className="bg-[#0c0c0c] border border-white/[0.06] rounded-xl p-3 overflow-hidden">
                  <NotificationsPanel />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
