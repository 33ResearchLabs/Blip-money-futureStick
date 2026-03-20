import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Check, Lock } from "lucide-react";

const INITIAL_BIDS = [
  {
    id: 1,
    name: "QuickSwap Pro",
    avatar: "QS",
    rate: 3.672,
    trades: 2847,
    time: "~30s",
    best: true,
  },
  {
    id: 2,
    name: "FastSettle UAE",
    avatar: "FS",
    rate: 3.668,
    trades: 1923,
    time: "~45s",
    best: false,
  },
  {
    id: 3,
    name: "DubaiExchange",
    avatar: "DE",
    rate: 3.665,
    trades: 3102,
    time: "~60s",
    best: false,
  },
];

export default function BiddingUI() {
  const [bids, setBids] = useState(INITIAL_BIDS);
  const [countdown, setCountdown] = useState(15);
  const [matched, setMatched] = useState(false);

  useEffect(() => {
    const rateId = setInterval(() => {
      setBids((prev) => {
        const updated = prev
          .map((b) => ({
            ...b,
            rate: parseFloat(
              (b.rate + (Math.random() - 0.48) * 0.004).toFixed(3),
            ),
          }))
          .sort((a, b) => b.rate - a.rate)
          .map((b, i) => ({ ...b, best: i === 0 }));
        return updated;
      });
    }, 1200);

    const cdId = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          setMatched(true);
          setTimeout(() => {
            setMatched(false);
            setCountdown(15);
          }, 2200);
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => {
      clearInterval(rateId);
      clearInterval(cdId);
    };
  }, []);

  const bestBid = bids[0];

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0a0a0a] shadow-[0_30px_60px_rgba(0,0,0,0.5),0_0_80px_rgba(255,107,53,0.06)]">
      {/* Browser chrome */}
      <div className="flex items-center gap-3 px-5 py-3.5 bg-[#111] border-b border-white/[0.06]">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28ca42]" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] w-full max-w-[180px] sm:max-w-[300px]">
            <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <Lock className="w-2.5 h-2.5 text-white/40" />
            </div>
            <span className="text-xs text-white/30 font-mono truncate flex-1">
              settle.blipprotocol.com/merchant
            </span>
            <div className="flex items-center gap-1.5 ml-auto shrink-0">
              <motion.div
                className="w-2 h-2 rounded-full bg-[rgba(255,255,255,0.5)]"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-[10px] text-[rgba(255,255,255,0.5)] font-bold tracking-wide">
                LIVE
              </span>
            </div>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-white/[0.08] flex items-center justify-center text-xs font-bold text-white/60">
          M
        </div>
      </div>

      {/* Dashboard content */}
      <div className="p-5 text-white">
        {/* Order header + timer */}
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/[0.06]">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-white/30 mb-1">
              Active Order · #BLP-8472
            </div>
            <div className="text-2xl font-bold tracking-tight">
              5,000 USDT → AED
            </div>
          </div>
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-widest text-white/30 mb-1">
              Match in
            </div>
            <AnimatePresence mode="wait">
              {matched ? (
                <motion.div
                  key="m"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Check className="w-6 h-6 text-white/60" />
                </motion.div>
              ) : (
                <motion.div
                  key={countdown}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className={`text-xl font-bold font-mono tracking-tight ${countdown <= 5 ? "text-[rgba(255,255,255,0.5)]" : "text-white"}`}
                >
                  {`00:${countdown.toString().padStart(2, "0")}`}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bids header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white">Live Merchant Bids</h3>
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-white/40"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
              />
            ))}
          </div>
        </div>

        {/* Bid cards */}
        <div className="space-y-2.5">
          {bids.map((bid) => (
            <motion.div
              key={bid.id}
              layout
              animate={{
                background: bid.best
                  ? "rgba(255,255,255,0.07)"
                  : "rgba(255,255,255,0.025)",
                borderColor: bid.best
                  ? "rgba(255,255,255,0.18)"
                  : "rgba(255,255,255,0.06)",
              }}
              transition={{ duration: 0.35 }}
              className="p-3.5 rounded-xl border"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold ${
                      bid.best
                        ? "bg-white/10 text-white/80"
                        : "bg-white/[0.05] text-white/40"
                    }`}
                  >
                    {bid.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className={`text-sm font-semibold ${bid.best ? "text-white" : "text-white/55"}`}
                      >
                        {bid.name}
                      </span>
                      {bid.best && (
                        <motion.span
                          layout
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="px-2 py-0.5 rounded-full bg-white/10 text-[9px] text-white/70 font-bold uppercase"
                        >
                          Best Rate
                        </motion.span>
                      )}
                    </div>
                    <div className="text-xs text-white/30">
                      {bid.trades.toLocaleString()} trades · ETA {bid.time}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <motion.div
                      className="text-lg font-bold"
                      animate={{
                        color: bid.best ? "#ffffff" : "rgba(255,255,255,0.4)",
                      }}
                    >
                      {bid.rate.toFixed(3)}{" "}
                      <span className="text-xs text-white/30 font-normal">
                        AED
                      </span>
                    </motion.div>
                    <div className="text-xs text-white/30">
                      ≈{" "}
                      {(bid.rate * 5000).toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}{" "}
                      AED
                    </div>
                  </div>
                  <motion.div
                    className={`w-3 h-3 rounded-full ${bid.best ? "bg-white/60" : "bg-white/20"}`}
                    animate={bid.best ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Auto-select footer */}
        <div className="mt-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white/60" />
          </div>
          <div>
            <span className="text-sm text-white/70 font-medium">
              Auto-selecting best offer
            </span>
            <span className="text-xs text-white/35 block">
              You'll receive ~{(bestBid?.rate * 5000).toFixed(0)} AED in ~30
              seconds
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
