import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowRight, Globe } from "lucide-react";

/* ============================================
   BLIPSCAN EXPLORER SECTION - Linear.app style
   Interactive real-time transaction viewer
   ============================================ */
const BlipscanExplorerSection = () => {
  const [transactions, setTransactions] = useState([
    {
      id: "BLP-7x2K",
      from: "0x8a9...3f2",
      to: "Ahmed M.",
      amount: "$5,750",
      time: "2s",
      new: false,
    },
    {
      id: "BLP-4mR8",
      from: "0x3b7...9k1",
      to: "Sarah K.",
      amount: "$12,867",
      time: "5s",
      new: false,
    },
    {
      id: "BLP-9pT4",
      from: "0x7c4...2m8",
      to: "James O.",
      amount: "$7,589",
      time: "8s",
      new: false,
    },
  ]);

  // Add new transaction every 3 seconds
  useEffect(() => {
    const names = [
      "Alex T.",
      "Maria G.",
      "John D.",
      "Lisa W.",
      "Mike R.",
      "Emma S.",
    ];
    const addresses = [
      "0x1a2...4b5",
      "0x6c7...8d9",
      "0x2e3...7f4",
      "0x9a1...3c6",
    ];

    const interval = setInterval(() => {
      const newTx = {
        id: `BLP-${Math.random().toString(36).substr(2, 4)}`,
        from: addresses[Math.floor(Math.random() * addresses.length)],
        to: names[Math.floor(Math.random() * names.length)],
        amount: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(Math.floor(Math.random() * 10000 + 10000)),

        time: "Just now",
        new: true,
      };

      setTransactions((prev) => {
        const updated = [newTx, ...prev.slice(0, 4)].map((tx, i) => ({
          ...tx,
          new: i === 0,
        }));
        return updated;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative bg-black py-10 sm:py-32 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.05] mb-6"
          >
            <div className="w-2 h-2 rounded-full bg-[#ff6b35] animate-pulse" />
            <span className="text-xs text-white/50 uppercase tracking-wider">
              Live on Solana
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight"
          >
            Every transaction, <span className="text-white/20">verified.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/50 text-base sm:text-lg max-w-2xl mx-auto"
          >
            Watch settlements happen in real-time on Blipscan Explorer
          </motion.p>
        </div>

        {/* Blipscan Window - Linear style */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative"
        >
          {/* Ambient glow */}
          <div className="absolute -inset-4 bg-gradient-to-b from-white/[0.03] via-transparent to-transparent blur-3xl" />

          {/* Main container */}
          <div className="relative h-[450px] sm:[600px] rounded-2xl border border-white/[0.06] bg-black/40 backdrop-blur-xl overflow-hidden">
            {/* Header bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28ca42]" />
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <Globe className="w-3.5 h-3.5 text-white/30" />
                  <span className="text-xs text-white/40 font-mono">
                    blipscan.io/explorer
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <motion.div
                  className="w-2 h-2 rounded-full bg-emerald-500"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-xs text-emerald-400 font-medium">
                  Live
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: "24h Volume", value: "$2.4M" },
                  { label: "Settlements", value: "12,847" },
                  { label: "Avg Speed", value: "1.8s" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                    className="text-center p-3 rounded-lg bg-white/[0.01] border border-white/[0.04]"
                  >
                    <div className="text-xl sm:text-2xl font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-[10px] sm:text-xs text-white/40 uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Transaction table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="text-xs text-white/30 uppercase tracking-wider">
                    Recent Settlements
                  </span>
                </div>

                <AnimatePresence mode="popLayout">
                  {transactions.map((tx) => (
                    <motion.div
                      key={tx.id}
                      layout="position"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        backgroundColor: tx.new
                          ? "rgba(255, 255, 255, 0.04)"
                          : "rgba(255, 255, 255, 0.01)",
                      }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{
                        duration: 0.6,
                        ease: "easeOut",
                        layout: {
                          duration: 0.8,
                          ease: [0.22, 1, 0.36, 1], // very smooth
                        },
                      }}
                      className="flex items-center justify-between px-4 py-3 rounded-lg border border-white/[0.04]"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                          <Check
                            className="w-4 h-4 text-white/60"
                            strokeWidth={2}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-mono text-white/60 truncate">
                              {tx.id}
                            </span>
                            <span className="text-xs text-white/20">→</span>
                            <span className="text-sm text-white font-medium truncate">
                              {tx.to}
                            </span>
                          </div>
                          <div className="text-xs text-white/30 font-mono truncate">
                            {tx.from}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 md:gap-10 flex-shrink-0">
                        <div className="text-right hidden sm:block">
                          <div className="text-base font-semibold text-white">
                            {tx.amount}
                          </div>
                          <div className="text-xs text-white/30">USDT</div>
                        </div>
                        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                          <span className="text-xs text-emerald-400 font-medium whitespace-nowrap">
                            {tx.time}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="hidden sm:flex items-center justify-between mt-6 pt-4 border-t border-white/[0.04]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#ff6b35]" />
                  <span className="text-xs text-white/30">
                    Powered by Blip Protocol
                  </span>
                </div>
                <div className="text-xs text-white/60 hover:text-white/80 transition-colors flex items-center gap-1 cursor-pointer">
                  View Explorer
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BlipscanExplorerSection;
