import { useEffect, useState } from "react";
import { useP2PRate, type Fiat } from "@/hooks/useP2PRate";

/* Drop-in live USDT/<fiat> rate card. Reproduces the p2prate.live
   "CURRENT USDT/INR RATE" card using our own /api/p2p-rates endpoint.

   Usage:
     <LiveRateCard />                 // USDT/INR (default)
     <LiveRateCard fiat="AED" />
     <LiveRateCard fiat="INR" className="max-w-sm" /> */

const SYMBOL: Record<Fiat, string> = {
  INR: "₹",
  AED: "د.إ ",
  PHP: "₱",
  THB: "฿",
  USD: "$",
};

const DIGITS: Record<Fiat, number> = {
  INR: 2,
  AED: 4,
  PHP: 2,
  THB: 2,
  USD: 4,
};

function format(value: number | null, fiat: Fiat): string {
  const symbol = SYMBOL[fiat] ?? "";
  if (value == null || !Number.isFinite(value)) return symbol + "—";
  return (
    symbol +
    value.toLocaleString("en-US", {
      minimumFractionDigits: DIGITS[fiat],
      maximumFractionDigits: DIGITS[fiat],
    })
  );
}

/* "1 min ago" style relative timestamp that re-renders every 15s. */
function useTimeAgo(ts: number | null): string {
  const [text, setText] = useState("updating…");
  useEffect(() => {
    if (!ts) return;
    const tick = () => {
      const s = Math.floor((Date.now() - ts) / 1000);
      if (s < 10) setText("just now");
      else if (s < 60) setText(`${s}s ago`);
      else setText(`${Math.floor(s / 60)} min ago`);
    };
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, [ts]);
  return text;
}

export function LiveRateCard({
  fiat = "INR",
  className = "",
}: {
  fiat?: Fiat;
  className?: string;
}) {
  const { buy, sell, buyVenue, sellVenue, spreadPct, observedAt, isLive } =
    useP2PRate(fiat);
  const updatedAgo = useTimeAgo(observedAt);

  return (
    <div
      className={`rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#111] p-6 shadow-sm ${className}`}
    >
      {/* header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="relative flex h-2 w-2">
          {isLive && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-500 opacity-75" />
          )}
          <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
        </span>
        <span className="text-xs font-semibold tracking-wide uppercase text-black/50 dark:text-white/50">
          Current USDT/{fiat} Rate
        </span>
      </div>

      {/* rates */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
            Buy
          </div>
          <div className="text-3xl font-bold text-black dark:text-white tabular-nums">
            {format(buy, fiat)}
          </div>
          {buyVenue && (
            <div className="text-xs text-black/40 dark:text-white/40 mt-0.5">
              {buyVenue}
            </div>
          )}
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-rose-600 dark:text-rose-400">
            Sell
          </div>
          <div className="text-3xl font-bold text-black dark:text-white tabular-nums">
            {format(sell, fiat)}
          </div>
          {sellVenue && (
            <div className="text-xs text-black/40 dark:text-white/40 mt-0.5">
              {sellVenue}
            </div>
          )}
        </div>

        {spreadPct != null && (
          <div className="text-right">
            <div className="text-xs font-semibold uppercase tracking-wide text-black/40 dark:text-white/40">
              Spread
            </div>
            <div className="inline-block mt-1 rounded-full bg-orange-500/10 px-2.5 py-1 text-sm font-semibold text-orange-600 dark:text-orange-400 tabular-nums">
              {spreadPct.toFixed(2)}%
            </div>
          </div>
        )}
      </div>

      {/* footer */}
      <div className="mt-4 pt-3 border-t border-black/[0.06] dark:border-white/[0.06] text-xs text-black/40 dark:text-white/40">
        {isLive ? `Live · updated ${updatedAgo}` : "Showing reference rate…"} ·
        aggregated across 9 exchanges via p2prate.live
      </div>
    </div>
  );
}

export default LiveRateCard;
