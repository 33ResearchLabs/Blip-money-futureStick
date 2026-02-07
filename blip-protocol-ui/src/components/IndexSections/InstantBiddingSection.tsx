import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, Lock, ArrowRight } from "lucide-react";

/* ============================================
   INSTANT BIDDING SECTION
   Merchant matching dashboard showcase
   ============================================ */

const InstantBiddingSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-start justify-center bg-black overflow-hidden py-16 sm:py-20 lg:pt-28">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#050505] to-black" />
        <motion.div
          className="absolute top-[30%] left-[5%] w-[300px] h-[300px] rounded-full opacity-15"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 60%)",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-4 sm:mb-6 lg:mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-3 mb-4 sm:mb-6">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-lg border border-white/[0.08] flex items-center justify-center group hover:border-white/20 transition-colors">
              <Zap
                className="w-4 h-4 sm:w-5 sm:h-5 text-white/40 group-hover:text-white/60 transition-colors"
                strokeWidth={1.5}
              />
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-black border border-white/10 flex items-center justify-center">
                <span className="text-[10px] font-medium text-white/50">3</span>
              </div>
            </div>
            <span className="text-lg sm:text-xl font-semibold text-white">
              Match
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-4 tracking-tight">
            Instant <span className="text-white/20">bidding.</span>
          </h2>
          <p className="text-white/50 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto hidden sm:block">
            Merchants compete in real-time to fulfill your order. Best rate wins
            automatically.
          </p>
        </motion.div>

        {/* Powered by badge */}
        <motion.div
          className="hidden sm:flex justify-center mb-4 lg:mb-6"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/[0.02] border border-white/[0.06]">
            <motion.div
              className="w-2 h-2 rounded-full bg-white/40"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-[10px] sm:text-xs text-white/50">
              Powered by
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-white">
              150+ Verified Merchants
            </span>
          </div>
        </motion.div>

        {/* Browser Mockup */}
        <motion.div
          className="relative mx-auto max-w-5xl lg:max-w-6xl"
          style={{
            x: mousePosition.x * -12,
            y: mousePosition.y * -8,
            rotateY: mousePosition.x * 4,
            rotateX: mousePosition.y * -2,
            transformPerspective: 1500,
            transformStyle: "preserve-3d",
          }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.01 }}
        >
          {/* Ambient glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
            <motion.div
              className="absolute w-full h-full rounded-3xl bg-gradient-to-b from-white/5 to-transparent"
              style={{
                x: mousePosition.x * 25,
                y: mousePosition.y * 20,
              }}
            />
            <motion.div
              className="absolute w-[90%] h-[90%] rounded-3xl border border-white/5"
              style={{
                x: mousePosition.x * -10,
                y: mousePosition.y * -8,
              }}
              animate={{
                borderColor: [
                  "rgba(255,255,255,0.05)",
                  "rgba(255,255,255,0.15)",
                  "rgba(255,255,255,0.05)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>

          {/* Reflection overlay */}
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none z-10"
            style={{
              background: `linear-gradient(${
                130 + mousePosition.x * 20
              }deg, rgba(255,255,255,0.04) 0%, transparent 40%, rgba(0,0,0,0.1) 100%)`,
            }}
          />

          <div className="rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0a0a0a] shadow-[0_30px_60px_rgba(0,0,0,0.4)] sm:shadow-[0_50px_100px_rgba(0,0,0,0.5),0_0_80px_rgba(255,255,255,0.04)] lg:max-h-[65vh] relative">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2.5 sm:py-4 bg-[#111] border-b border-white/[0.06]">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white/20" />
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white/20" />
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white/20" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] w-full max-w-[200px] sm:max-w-[300px] md:max-w-[400px]">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Lock className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white/40" />
                  </div>
                  <span className="text-[10px] sm:text-sm text-white/40 font-mono truncate">
                    settle.blipprotocol.com/merchant
                  </span>
                  <div className="hidden sm:flex items-center gap-1.5 ml-auto shrink-0">
                    <motion.div
                      className="w-2 h-2 rounded-full bg-white/50"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <span className="text-[10px] text-white/60 font-medium">
                      LIVE
                    </span>
                  </div>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/20 to-white/10 flex items-center justify-center text-xs font-bold text-white">
                  M
                </div>
              </div>
            </div>

            {/* Dashboard content */}
            <div className="p-4 sm:p-6 md:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
                {/* Left Panel - Order Details */}
                <div className="lg:col-span-5">
                  <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-5 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs uppercase tracking-wider text-white/40">
                        Active Order
                      </span>
                      <motion.div
                        className="px-2 py-1 rounded-full bg-white/5 border border-white/10"
                        animate={{ opacity: [1, 0.7, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <span className="text-[10px] text-white/60 font-medium">
                          BIDDING OPEN
                        </span>
                      </motion.div>
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                        <span className="text-xl font-bold text-white">US</span>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-white">
                          5,000 USDT
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/40">
                          <ArrowRight className="w-3 h-3" />
                          <span>AED (United Arab Emirates)</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                        <span className="text-sm text-white/40">Order ID</span>
                        <span className="text-sm text-white font-mono">
                          #BLP-8472
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                        <span className="text-sm text-white/40">
                          Escrow Status
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-white/50" />
                          <span className="text-sm text-white/60">
                            Locked
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-white/40">
                          Time Remaining
                        </span>
                        <motion.span
                          className="text-sm text-white/70 font-mono font-medium"
                          animate={{ opacity: [1, 0.6, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          00:12
                        </motion.span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="relative h-2 rounded-full bg-white/[0.05] overflow-hidden">
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-white/40 to-white/20 rounded-full"
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
                      <span className="text-[10px] text-white/30">
                        Collecting bids...
                      </span>
                      <span className="text-[10px] text-white/30">
                        4 merchants bidding
                      </span>
                    </div>
                  </div>

                  {/* Quick stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 text-center">
                      <div className="text-2xl font-bold text-white">~8s</div>
                      <div className="text-[10px] text-white/40 uppercase tracking-wider">
                        Avg Match
                      </div>
                    </div>
                    <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 text-center">
                      <div className="text-2xl font-bold text-white">
                        99.9%
                      </div>
                      <div className="text-[10px] text-white/40 uppercase tracking-wider">
                        Fill Rate
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Panel - Live Merchant Bids */}
                <div className="hidden sm:block lg:col-span-7">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        Live Merchant Bids
                      </h3>
                      <span className="text-xs text-white/40">
                        Real-time competitive pricing
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
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
                        className={`p-4 rounded-xl border transition-all ${
                          bid.best
                            ? "bg-white/[0.08] border-white/20"
                            : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]"
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
                                bid.best ? "bg-white/10 text-white/80" : "bg-white/[0.05] text-white/50"
                              }`}
                            >
                              {bid.avatar}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-white">
                                  {bid.name}
                                </span>
                                {bid.best && (
                                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-[9px] text-white/70 font-bold uppercase">
                                    Best Rate
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-white/40">
                                <span>{bid.trades} trades</span>
                                <span>•</span>
                                <span>ETA {bid.time}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-lg font-bold text-white">
                                {bid.rate}{" "}
                                <span className="text-xs text-white/40">
                                  AED
                                </span>
                              </div>
                              <div className="text-xs text-white/50">
                                {bid.profit} profit
                              </div>
                            </div>
                            <motion.div
                              className={`w-3 h-3 rounded-full ${
                                bid.best ? "bg-white/60" : "bg-white/20"
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
                  <div className="mt-4 p-4 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                        <Zap className="w-4 h-4 text-white/60" />
                      </div>
                      <div>
                        <span className="text-sm text-white/70 font-medium">
                          Auto-selecting best offer
                        </span>
                        <span className="text-xs text-white/40 block">
                          You'll receive 18,360 AED in ~30 seconds
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gradient fade at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent pointer-events-none" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InstantBiddingSection;
