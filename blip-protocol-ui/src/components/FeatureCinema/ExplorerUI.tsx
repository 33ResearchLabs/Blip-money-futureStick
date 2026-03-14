import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Globe, ArrowRight } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const TX_NAMES = [
  "Ahmed M.",
  "Sarah K.",
  "James O.",
  "Maria G.",
  "Alex T.",
  "Emma S.",
];
const TX_ADDRS = ["0x8a9...3f2", "0x3b7...9k1", "0x7c4...2m8", "0x1a2...4b5"];
const TX_INITIAL = [
  {
    id: "BLP-7X2K",
    from: "0x8a9...3f2",
    to: "Ahmed M.",
    amount: "$5,750",
    age: "2s",
    isNew: false,
  },
  {
    id: "BLP-4MR8",
    from: "0x3b7...9k1",
    to: "Sarah K.",
    amount: "$12,867",
    age: "5s",
    isNew: false,
  },
  {
    id: "BLP-9PT4",
    from: "0x7c4...2m8",
    to: "James O.",
    amount: "$7,589",
    age: "9s",
    isNew: false,
  },
  {
    id: "BLP-2NQ7",
    from: "0x1a2...4b5",
    to: "Maria G.",
    amount: "$3,220",
    age: "12s",
    isNew: false,
  },
];

export default function ExplorerUI() {
  const [txs, setTxs] = useState(TX_INITIAL);
  const [block, setBlock] = useState(241_847_293);

  useEffect(() => {
    const id = setInterval(() => {
      const newTx = {
        id: `BLP-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        from: TX_ADDRS[Math.floor(Math.random() * TX_ADDRS.length)],
        to: TX_NAMES[Math.floor(Math.random() * TX_NAMES.length)],
        amount: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(Math.floor(Math.random() * 15000) + 1000),
        age: "Just now",
        isNew: true,
      };
      setTxs((prev) =>
        [newTx, ...prev.slice(0, 4)].map((t, i) => ({
          ...t,
          isNew: i === 0,
        })),
      );
      setBlock((b) => b + Math.floor(Math.random() * 3) + 1);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="w-[540px] rounded-2xl border border-white/[0.06] bg-black/40 backdrop-blur-xl overflow-hidden shadow-[0_8px_60px_-12px_rgba(0,0,0,0.8),0_0_80px_rgba(20,241,149,0.05)]">
      {/* Browser chrome */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-black/60 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28ca42]" />
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.04]">
            <Globe className="w-3.5 h-3.5 text-white/30" />
            <span className="text-xs text-white/40 font-mono">
              blipscan.io/explorer
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full bg-white/40"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-xs text-white/50 font-medium">
            Live · Solana
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 border-b border-white/[0.05]">
        {[
          { label: "Block", value: block.toLocaleString() },
          { label: "24h Volume", value: "$2.4M" },
          { label: "Settled", value: "12,847" },
          { label: "Avg Speed", value: "1.8s" },
        ].map((s, i) => (
          <div
            key={s.label}
            className={`text-center p-3 ${i < 3 ? "border-r border-white/[0.05]" : ""}`}
          >
            <motion.div
              key={s.value}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              className="text-[15px] font-bold text-white mb-0.5"
            >
              {s.value}
            </motion.div>
            <div className="text-[9px] text-white/20 uppercase tracking-[1.5px]">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Transaction list */}
      <div className="p-4">
        <div className="flex items-center justify-between px-1 mb-2.5">
          <span className="text-[9px] uppercase tracking-[2px] text-white/20 font-medium">
            Recent Settlements
          </span>
          <div className="flex items-center gap-1.5">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-white/40"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-[10px] text-white/40">Live</span>
          </div>
        </div>

        <AnimatePresence mode="popLayout">
          {txs.map((tx) => (
            <motion.div
              key={tx.id}
              layout="position"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
                layout: { duration: 0.6, ease: EASE },
              }}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-white/[0.04] mb-1.5"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.12] flex items-center justify-center shrink-0">
                  <Check
                    className="w-3.5 h-3.5 text-white/50"
                    strokeWidth={2.5}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[11px] font-mono text-white/40 truncate">
                      {tx.id}
                    </span>
                    <span className="text-white/20 text-[11px]">→</span>
                    <span className="text-[13px] text-white font-semibold truncate">
                      {tx.to}
                    </span>
                    {tx.isNew && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="px-1.5 py-px rounded-full bg-white/[0.08] border border-white/[0.15] text-[8px] text-white/60 font-bold whitespace-nowrap"
                      >
                        NEW
                      </motion.span>
                    )}
                  </div>
                  <div className="text-[10px] text-white/20 font-mono truncate">
                    {tx.from}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <div className="text-right">
                  <div className="text-[13px] font-semibold text-white">
                    {tx.amount}
                  </div>
                  <div className="text-[9px] text-white/25">USDT</div>
                </div>
                <div className="px-2 py-1 rounded-lg bg-white/[0.06] border border-white/[0.12]">
                  <span className="text-[10px] text-white/40">{tx.age}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="flex items-center justify-between mt-2 pt-2.5 border-t border-white/[0.04]">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-white/15" />
            <span className="text-[10px] text-white/20">
              Powered by Blip Protocol
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-white/40 cursor-pointer hover:text-white/70 transition-colors">
            View Explorer <ArrowRight className="w-2.5 h-2.5" />
          </div>
        </div>
      </div>
    </div>
  );
}
