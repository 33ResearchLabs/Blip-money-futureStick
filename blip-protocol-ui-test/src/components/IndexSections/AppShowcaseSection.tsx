import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

/* ============================================
   SECTION: BLIPSCAN DASHBOARD - Linear.app Inspired
   ============================================ */

const AppShowcaseSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const browserY = useTransform(scrollYProgress, [0, 1], [60, -30]);
  const browserYSmooth = useSpring(browserY, { stiffness: 100, damping: 30 });

  // Transaction data for the Blipscan dashboard
  const transactions = [
    {
      id: "BLP-7x2K...9fN3",
      from: "0x7a2...f91",
      to: "Ahmed M.",
      amount: "$500.00",
      status: "completed",
      time: "2s",
    },
    {
      id: "BLP-4mR8...2hL5",
      from: "0x3b8...c42",
      to: "Sarah K.",
      amount: "$1,200.00",
      status: "processing",
      time: "—",
    },
    {
      id: "BLP-9nQ1...6wT8",
      from: "0x5f2...a73",
      to: "Mohammed R.",
      amount: "$750.00",
      status: "completed",
      time: "1.4s",
    },
    {
      id: "BLP-2kL4...8pM7",
      from: "0x8c1...d56",
      to: "Lisa T.",
      amount: "$320.00",
      status: "completed",
      time: "0.8s",
    },
    {
      id: "BLP-6jP9...3mK2",
      from: "0x2e7...b89",
      to: "David W.",
      amount: "$890.00",
      status: "completed",
      time: "1.1s",
    },
  ];

  return (
    <section
      ref={containerRef}
      className="relative py-32 md:py-40 bg-black overflow-hidden"
    >
      {/* Subtle gradient background - Linear style */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[600px] bg-gradient-to-b from-white/[0.02] to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-white/[0.02] blur-[120px]" />
      </div>

      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-6"
        style={{ opacity }}
      >
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white mb-4"
          >
            Built for transparency.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg text-white/40 max-w-xl mx-auto"
          >
            Every transaction visible. Every settlement tracked. Real-time on
            Blipscan.
          </motion.p>
        </div>

        {/* Browser Window - Linear.app inspired */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ y: browserYSmooth }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Browser frame */}
          <div
            className="rounded-xl overflow-hidden"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow:
                "0 50px 100px -20px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset",
            }}
          >
            {/* Browser top bar */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
              {/* Traffic lights */}
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
              </div>
              {/* URL bar */}
              <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-white/[0.04] border border-white/[0.06]">
                  <div className="w-3 h-3 rounded-full bg-white/40" />
                  <span className="text-xs text-white/40 font-mono">
                    blipscan.io/explorer
                  </span>
                </div>
              </div>
              <div className="w-16" />
            </div>

            {/* Dashboard content */}
            <div className="p-6 md:p-8 bg-[#0a0a0c]">
              {/* Dashboard header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-semibold text-white">
                    Transactions
                  </h3>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/20">
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-white/60"
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-[10px] uppercase tracking-wider text-white/60 font-medium">
                      Live
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-xs text-white/50">
                    Last 24h
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                {[
                  { label: "Total Volume", value: "$2.4M", change: "+12.5%" },
                  { label: "Transactions", value: "12,847", change: "+8.2%" },
                  { label: "Avg. Settlement", value: "1.2s", change: "-0.3s" },
                  { label: "Success Rate", value: "99.8%", change: "+0.1%" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="p-3 sm:p-4 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                  >
                    <div className="text-[10px] sm:text-[11px] text-white/40 uppercase tracking-wider mb-1 sm:mb-2">
                      {stat.label}
                    </div>
                    <div className="flex items-baseline gap-1.5 sm:gap-2">
                      <span className="text-base sm:text-xl font-semibold text-white">
                        {stat.value}
                      </span>
                      <span className="text-[10px] sm:text-xs text-white/50">
                        {stat.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Transaction table - Desktop */}
              <div className="rounded-lg border border-white/[0.06] overflow-hidden hidden md:block">
                {/* Table header */}
                <div className="grid grid-cols-6 gap-4 px-4 py-3 bg-white/[0.02] border-b border-white/[0.06]">
                  <div className="text-[11px] text-white/40 uppercase tracking-wider">
                    Transaction ID
                  </div>
                  <div className="text-[11px] text-white/40 uppercase tracking-wider">
                    From
                  </div>
                  <div className="text-[11px] text-white/40 uppercase tracking-wider">
                    To
                  </div>
                  <div className="text-[11px] text-white/40 uppercase tracking-wider text-right">
                    Amount
                  </div>
                  <div className="text-[11px] text-white/40 uppercase tracking-wider text-center">
                    Status
                  </div>
                  <div className="text-[11px] text-white/40 uppercase tracking-wider text-right">
                    Time
                  </div>
                </div>

                {/* Table rows */}
                {transactions.map((tx, i) => (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
                    className="grid grid-cols-6 gap-4 px-4 py-3 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="text-sm text-white/70 font-mono">
                      {tx.id}
                    </div>
                    <div className="text-sm text-white/50 font-mono">
                      {tx.from}
                    </div>
                    <div className="text-sm text-white/70">{tx.to}</div>
                    <div className="text-sm text-white font-medium text-right">
                      {tx.amount}
                    </div>
                    <div className="flex justify-center">
                      {tx.status === "completed" ? (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.05]">
                          <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
                          <span className="text-[10px] text-white/50 uppercase tracking-wider">
                            Completed
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/10">
                          <motion.div
                            className="w-1.5 h-1.5 rounded-full bg-white/60"
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                          <span className="text-[10px] text-white/60 uppercase tracking-wider">
                            Processing
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-white/40 text-right">
                      {tx.time}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Transaction cards - Mobile */}
              <div className="space-y-3 md:hidden">
                {transactions.slice(0, 3).map((tx, i) => (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-white/50 font-mono">
                        {tx.id}
                      </span>
                      {tx.status === "completed" ? (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.05]">
                          <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
                          <span className="text-[10px] text-white/50 uppercase">
                            Done
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/10">
                          <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
                          <span className="text-[10px] text-white/60 uppercase">
                            Processing
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-white font-medium">
                          {tx.to}
                        </div>
                        <div className="text-xs text-white/30">{tx.from}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-semibold text-white">
                          {tx.amount}
                        </div>
                        <div className="text-xs text-white/40">{tx.time}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/[0.04]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-white/50" />
                  <span className="text-xs text-white/40">
                    Connected to Solana Mainnet
                  </span>
                </div>
                <div className="text-xs text-white/30">
                  Powered by Blip Protocol
                </div>
              </div>
            </div>
          </div>

          {/* Reflection effect */}
          <div
            className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[80%] h-20 blur-2xl opacity-20"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)",
            }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default AppShowcaseSection;
