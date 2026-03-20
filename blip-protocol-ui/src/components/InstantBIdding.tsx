import { ArrowRight, Lock, Zap } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";
const InstantBIdding = () => {
  return (
    <div className="rounded-2xl overflow-hidden border border-black/[0.08] dark:border-white/[0.08] bg-white/90 dark:bg-[#0a0a0a]  dark:backdrop-blur-none shadow-[0_8px_40px_-8px_rgba(0,0,0,0.08),0_30px_80px_-20px_rgba(0,0,0,0.06)] sm:shadow-[0_12px_60px_-12px_rgba(0,0,0,0.1),0_50px_120px_-30px_rgba(0,0,0,0.08)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.4)] dark:sm:shadow-[0_50px_100px_rgba(0,0,0,0.5),0_0_80px_rgba(255,255,255,0.04)] lg:max-h-[65vh] relative">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2.5 sm:py-4 bg-white/90 dark:bg-[#111] backdrop-blur-sm dark:backdrop-blur-none border-b border-black/[0.06] dark:border-white/[0.06]">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28ca42]" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] w-full max-w-[200px] sm:max-w-[300px] md:max-w-[400px]">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center shrink-0">
              <Lock className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-black dark:text-white/40" />
            </div>
            <span className="text-[10px] sm:text-sm text-black dark:text-white/40 font-mono truncate">
              settle.blipprotocol.com/merchant
            </span>
            <div className="hidden sm:flex items-center gap-1.5 ml-auto shrink-0">
              <motion.div
                className="w-2 h-2 rounded-full bg-black/50 dark:bg-white/50"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-[10px] text-black dark:text-white/60 font-medium">
                LIVE
              </span>
            </div>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-black/10 to-black/5 dark:from-white/20 dark:to-white/10 flex items-center justify-center text-xs font-bold text-black dark:text-white">
            M
          </div>
        </div>
      </div>

      {/* Dashboard content */}
      <div className="p-4 sm:p-6 md:p-8 bg-white/40 dark:bg-transparent text-zinc-900 dark:text-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Left Panel - Order Details */}
          <div className="lg:col-span-5">
            <div className="rounded-xl bg-white/90 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.06] shadow-[0_2px_20px_-4px_rgba(0,0,0,0.06),0_4px_8px_-2px_rgba(0,0,0,0.04)] dark:shadow-none p-5 mb-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase tracking-wider text-black dark:text-white/40">
                  Active Order
                </span>
                <motion.div
                  className="px-2 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10"
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="text-[10px] text-black dark:text-white/60 font-medium">
                    BIDDING OPEN
                  </span>
                </motion.div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-black/[0.06] to-black/[0.02] dark:from-white/10 dark:to-white/5 flex items-center justify-center">
                  <span className="text-xl font-bold text-black dark:text-white">
                    US
                  </span>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-black dark:text-white tracking-tight">
                    5,000 USDT
                  </div>
                  <div className="flex items-center gap-2 text-sm text-black/70 dark:text-white/50">
                    <ArrowRight className="w-3 h-3" />
                    <span>AED (United Arab Emirates)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between py-2 border-b border-black/[0.04] dark:border-white/[0.04]">
                  <span className="text-sm text-black dark:text-white/40">
                    Order ID
                  </span>
                  <span className="text-sm text-black dark:text-white font-mono">
                    #BLP-8472
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-black/[0.04] dark:border-white/[0.04]">
                  <span className="text-sm text-black dark:text-white/40">
                    Escrow Status
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-black/50 dark:bg-white/50" />
                    <span className="text-sm text-black dark:text-white/60">
                      Locked
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-black dark:text-white/40">
                    Time Remaining
                  </span>
                  <motion.span
                    className="text-sm text-black dark:text-white/70 font-mono font-medium"
                    animate={{ opacity: [1, 0.6, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    00:12
                  </motion.span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="relative h-2 rounded-full bg-black/[0.05] dark:bg-white/[0.05] overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-black/30 to-black/15 dark:from-white/40 dark:to-white/20 rounded-full"
                  initial={{ width: "20%" }}
                  animate={{ width: "65%" }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-black dark:text-white/30">
                  Collecting bids...
                </span>
                <span className="text-[10px] text-black dark:text-white/30">
                  4 merchants bidding
                </span>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/80 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.06] shadow-[0_2px_20px_-4px_rgba(0,0,0,0.06),0_4px_8px_-2px_rgba(0,0,0,0.04)] dark:shadow-none p-4 text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-black dark:text-white">
                  ~8s
                </div>
                <div className="text-[11px] text-black dark:text-white/30 uppercase tracking-[0.3em] font-semibold">
                  Avg Match
                </div>
              </div>
              <div className="rounded-xl bg-white/80 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.06] shadow-[0_2px_20px_-4px_rgba(0,0,0,0.06),0_4px_8px_-2px_rgba(0,0,0,0.04)] dark:shadow-none p-4 text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-black dark:text-white">
                  99.9%
                </div>
                <div className="text-[11px] text-black dark:text-white/30 uppercase tracking-[0.3em] font-semibold">
                  Fill Rate
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Live Merchant Bids */}
          <div className="hidden sm:block lg:col-span-7">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-black dark:text-white">
                  Live Merchant Bids
                </h3>
                <span className="text-xs text-black dark:text-white/40">
                  Real-time competitive pricing
                </span>
              </div>
              <div className="flex items-center gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-black/40 dark:bg-white/40"
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
            <div className="space-y-3">
              {[
                {
                  name: "QuickSwap Pro",
                  rate: "3.672",
                  profit: "+$185",
                  trades: "2,847",
                  time: "~30s",
                  best: true,
                  avatar: "QS",
                },
                {
                  name: "FastSettle UAE",
                  rate: "3.668",
                  profit: "+$165",
                  trades: "1,923",
                  time: "~45s",
                  best: false,
                  avatar: "FS",
                },
                {
                  name: "DubaiExchange",
                  rate: "3.665",
                  profit: "+$150",
                  trades: "3,102",
                  time: "~60s",
                  best: false,
                  avatar: "DE",
                },
                {
                  name: "GulfTrade",
                  rate: "3.660",
                  profit: "+$125",
                  trades: "892",
                  time: "~90s",
                  best: false,
                  avatar: "GT",
                },
              ].map((bid, i) => (
                <motion.div
                  key={bid.name}
                  className={`p-4 rounded-xl border backdrop-blur-xl transition-all ${
                    bid.best
                      ? "bg-white/90 dark:bg-white/[0.08] border-black/[0.1] dark:border-white/20 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.08),0_8px_16px_-4px_rgba(0,0,0,0.04)] dark:shadow-none"
                      : "bg-white/70 dark:bg-white/[0.03] border-black/[0.06] dark:border-white/[0.06] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] dark:shadow-none hover:bg-white/80 hover:dark:bg-white/[0.05] hover:shadow-[0_4px_20px_-6px_rgba(0,0,0,0.08)]"
                  }`}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold ${
                          bid.best
                            ? "bg-black/10 dark:bg-white/10 text-black dark:text-white/80"
                            : "bg-black/[0.05] dark:bg-white/[0.05] text-black dark:text-white/50"
                        }`}
                      >
                        {bid.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-black dark:text-white">
                            {bid.name}
                          </span>
                          {bid.best && (
                            <span className="px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10 text-[9px] text-black dark:text-white/70 font-bold uppercase">
                              Best Rate
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-black dark:text-white/40">
                          <span>{bid.trades} trades</span>
                          <span>•</span>
                          <span>ETA {bid.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-lg font-bold text-black dark:text-white">
                          {bid.rate}{" "}
                          <span className="text-xs text-black dark:text-white/40">
                            AED
                          </span>
                        </div>
                        <div className="text-xs text-black dark:text-white/50">
                          {bid.profit} profit
                        </div>
                      </div>
                      <motion.div
                        className={`w-3 h-3 rounded-full ${
                          bid.best
                            ? "bg-black/60 dark:bg-white/60"
                            : "bg-black/20 dark:bg-white/20"
                        }`}
                        animate={bid.best ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Auto-select notice */}
            <div className="mt-4 p-4 rounded-xl bg-white/80 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.06] shadow-[0_2px_20px_-4px_rgba(0,0,0,0.06),0_4px_8px_-2px_rgba(0,0,0,0.04)] dark:shadow-none">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-black/10 dark:bg-white/10 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-black dark:text-white/60" />
                </div>
                <div>
                  <span className="text-sm text-black dark:text-white/70 font-medium">
                    Auto-selecting best offer
                  </span>
                  <span className="text-xs text-black dark:text-white/40 block">
                    You'll receive 18,360 AED in ~30 seconds
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient fade at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/90 via-white/30 to-transparent dark:from-[#0a0a0a] dark:via-[#0a0a0a]/80 pointer-events-none" />
    </div>
  );
};

export default InstantBIdding;
