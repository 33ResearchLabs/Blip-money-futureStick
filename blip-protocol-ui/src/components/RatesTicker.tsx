import { useEffect, useState, memo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLiveRates } from "@/hooks/useLiveRates";

/* Site-wide live USDT rate ticker. Lives at the very top of the layout
   so the current rate is visible on every page. Cycles through the
   supported fiat pairs every 3.5s. Data is pulled from CoinGecko via
   useLiveRates() (60s poll). */

const PAIRS: { code: "aed" | "inr" | "usd" | "php" | "ngn" | "sgd"; label: string; symbol: string; digits: number }[] = [
  { code: "inr", label: "INR", symbol: "₹", digits: 2 },
  { code: "aed", label: "AED", symbol: "AED ", digits: 3 },
  { code: "usd", label: "USD", symbol: "$", digits: 4 },
  { code: "php", label: "PHP", symbol: "₱", digits: 2 },
  { code: "ngn", label: "NGN", symbol: "₦", digits: 0 },
  { code: "sgd", label: "SGD", symbol: "S$", digits: 3 },
];

const fmt = (v: number, digits: number) =>
  v.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });

function RatesTickerInner() {
  const { rates, loading, error } = useLiveRates();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setIdx((i) => (i + 1) % PAIRS.length), 3500);
    return () => window.clearInterval(id);
  }, []);

  const current = PAIRS[idx];
  const value = rates.USDT[current.code];

  return (
    <div
      className="relative w-full text-white"
      style={{
        background: "#0a0a0a",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="max-w-[1180px] mx-auto px-4 md:px-8 h-7 md:h-8 flex items-center justify-center md:justify-between gap-3 text-[10.5px] md:text-[11px] font-medium tracking-tight">
        {/* Live dot + pair (always visible) */}
        <div className="inline-flex items-center gap-2 min-w-0">
          <motion.span
            animate={{ opacity: [1, 0.35, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: "#cc785c" }}
          />
          <span className="font-bold uppercase tracking-[0.18em] text-white/55 hidden sm:inline">
            Live
          </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={`${current.code}-${value ?? "_"}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
              className="inline-flex items-center gap-1.5 min-w-0"
            >
              <span className="font-mono tabular-nums text-white/85 font-bold">
                1 USDT
              </span>
              <span className="text-white/35">=</span>
              <span className="font-mono tabular-nums font-bold" style={{ color: "#cc785c" }}>
                {current.symbol}
                {value !== undefined ? fmt(value, current.digits) : "—"}
              </span>
              <span className="font-bold uppercase tracking-[0.18em] text-white/45 hidden sm:inline">
                {current.label}
              </span>
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Right side: small explainer on desktop */}
        <div className="hidden md:flex items-center gap-2 text-white/35 font-mono text-[10px]">
          {loading && !error ? "fetching…" : error ? "cached" : "via market"}
          <span className="text-white/15">·</span>
          <a
            href="/rates"
            className="hover:text-white/75 transition-colors"
          >
            see all rates →
          </a>
        </div>
      </div>
    </div>
  );
}

export const RatesTicker = memo(RatesTickerInner);
