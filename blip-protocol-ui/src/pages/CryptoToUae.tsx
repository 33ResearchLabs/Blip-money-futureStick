import { SEO } from "@/components";
import { HreflangTags } from "@/components/HreflangTags";
import { CTAButton } from "@/components/Navbar";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";

import {
  ArrowLeftRight,
  Building,
  Lock,
  ShieldCheck,
  Zap,
  Coins,
  LogOut,
  Landmark,
  Banknote,
  TrendingUp,
  ChevronDown,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Type definitions
interface MerchantNode {
  id: number;
  name: string;
  type: "bank" | "cash";
  region: "dxb" | "auh";
  min: number;
  desc: string;
  latency: string;
  bond: "LOW" | "MED" | "HIGH" | "MAX";
}

interface ServiceData {
  title: string;
  content: string;
}

/* ============================================
   HERO SECTION
   ============================================ */
const HeroSection: React.FC<{
  navigate: (path: string) => void;
  scrollToSection: (id: string) => void;
}> = ({ navigate, scrollToSection }) => {
  return (
    <main className="relative pt-40 pb-20 px-6">
      <div className="absolute inset-0 bg-vignette pointer-events-none"></div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
        <div className="lg:col-span-7 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded border border-black/[0.06] dark:border-white/10 bg-white/80 dark:bg-[#0A0A0A]/30 text-[#666666] dark:text-[#A0A0A0] text-[10px]  tracking-wider"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b35] animate-pulse"></span>
            ACTIVE ROUTING ENGINE
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-black dark:text-white leading-[1.05] mb-6 tracking-tight"
          >
            On-Demand <br />
            P2P Settlement.
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="space-y-4 max-w-lg"
          >
            <p className="text-base md:text-lg text-[#A0A0A0] font-light leading-relaxed">
              Broadcast your demand. Bonded merchants compete to fill your
              order. Experience{" "}
              <span className="text-black dark:text-white">Non-Custodial Escrow</span> and{" "}
              <span className="text-black dark:text-white">Reputation-Weighted Routing</span>{" "}
              for instant fiat settlement.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center"
          >
            {/* <button
              onClick={() => navigate("/coming-soon")}
              className="group inline-flex items-center justify-center gap-3
      w-[220px] h-[56px]
      rounded-full
      bg-[#ffffff] text-black
      text-lg font-medium
      hover:bg-[#e5e5e5]
      transition-all duration-300"
            >
              Broadcast Request
            </button> */}
            <CTAButton to="/waitlist" className="w-[220px] h-[48px]">
              Broadcast Request
            </CTAButton>
            {/* <button
              onClick={() => scrollToSection("mechanics")}
              className="inline-flex items-center justify-center gap-3
      w-[220px] h-[56px]
      rounded-full
      border border-white/10
      text-white
      text-lg font-medium
      hover:bg-white/5 hover:border-white/20
      transition-all duration-300"
            >
              How it Works
            </button> */}
            <CTAButton to="/how-it-works" className=" w-[220px] h-[48px]">
              Learn More
            </CTAButton>
          </motion.div>

          {/* Trust Signals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="pt-12 border-t border-black/10 dark:border-white/20 flex flex-wrap gap-8 items-center opacity-80"
          >
            <span className="text-[10px]  uppercase tracking-widest block w-full mb-1">
              Settlement Assurance
            </span>

            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="flex items-center gap-2 text-black dark:text-white font-bold text-xs tracking-wide"
            >
              <ShieldCheck size={14} strokeWidth={2} />
              BONDED MERCHANTS
            </motion.span>

            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="flex items-center gap-2 text-black dark:text-white font-bold text-xs tracking-wide"
            >
              <Lock size={14} strokeWidth={2} />
              SMART ESCROW
            </motion.span>

            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="flex items-center gap-2 text-black dark:text-white font-bold text-xs tracking-wide"
            >
              <Zap size={14} strokeWidth={2} />
              ALGO ROUTING
            </motion.span>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

/* ============================================
   SEO CONTENT BLOCK
   ============================================ */
const SEOContentBlock: React.FC = () => {
  return (
    <section className="border-b border-black/[0.06] dark:border-white/5 bg-[#FAF8F5] dark:bg-black">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="max-w-5xl mx-auto px-6 py-16 text-[#A0A0A0] text-sm leading-relaxed"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl font-semibold text-black dark:text-white mb-4"
        >
          Crypto Cashout & USDT to AED in UAE
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Blip.money provides a decentralized way to perform crypto cashout in
          UAE using non-custodial escrow and bonded merchants. Users can convert
          USDT to AED, sell crypto in Dubai, or withdraw crypto directly to bank
          accounts or physical cash locations without relying on centralized
          exchanges.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-4"
        >
          Unlike traditional crypto off-ramps, Blip.money enables on-demand
          settlement where merchants compete to fulfill your request. This
          ensures better pricing, faster execution, and reduced counterparty
          risk for crypto to cash Dubai transactions.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-4"
        >
          Supported services include crypto to AED conversion, USDT cashout in
          Dubai, anonymous crypto withdrawals, and institutional-grade OTC
          settlement across Dubai and Abu Dhabi.
        </motion.p>
      </motion.div>
    </section>
  );
};

/* ============================================
   MARKET SIMULATION SECTION
   ============================================ */
const MarketSimulationSection: React.FC<{
  simAsset: string;
  setSimAsset: (value: string) => void;
  simAmount: number;
  setSimAmount: (value: number) => void;
  simPriority: "cheapest" | "fastest";
  setSimPriority: (value: "cheapest" | "fastest") => void;
  pathAsset: string;
  setPathAsset: (value: string) => void;
  pathMethod: "bank" | "cash";
  setPathMethod: (value: "bank" | "cash") => void;
  pathRegion: "dxb" | "auh";
  setPathRegion: (value: "dxb" | "auh") => void;
  pathAmount: number;
  setPathAmount: (value: number) => void;
  merchantNodes: MerchantNode[];
  openTerminal: (context: string) => void;
}> = ({
  simAsset,
  setSimAsset,
  simAmount,
  setSimAmount,
  simPriority,
  setSimPriority,
  pathAsset,
  setPathAsset,
  pathMethod,
  setPathMethod,
  pathRegion,
  setPathRegion,
  pathAmount,
  setPathAmount,
  merchantNodes,
  openTerminal,
}) => {
  // Simulator calculation
  const calculateSimulation = () => {
    let rate = 3.674;
    let target = "AED";

    if (simAsset === "AED") {
      rate = 0.2721;
      target = "USDT";
    } else if (simAsset === "USDC") {
      rate = 3.672;
    } else if (simAsset === "BTC") {
      rate = 242000;
    } else if (simAsset === "ETH") {
      rate = 9800;
    }

    let spreadPercent = 0.012;
    if (simPriority === "fastest") spreadPercent = 0.02;

    const gross = simAmount * rate;
    const fee = gross * spreadPercent;
    const net = gross - fee;

    return { net, fee, spreadPercent, target };
  };

  const simResult = calculateSimulation();

  // Filter merchant nodes based on path parameters
  const filteredMerchantNodes = merchantNodes.filter((node) => {
    return (
      node.type === pathMethod &&
      node.region === pathRegion &&
      pathAmount >= node.min
    );
  });

  return (
    <section
      id="tools"
      className="py-24 px-6 border-t border-black/[0.06] dark:border-white/5 bg-white dark:bg-[#0A0A0A]"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 flex items-end justify-between"
        >
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-2xl font-semibold text-black dark:text-white mb-2 tracking-tight"
            >
              Market Simulation
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-[#666666] text-sm "
            >
              ESTIMATE BIDDING SPREADS & LIQUIDITY
            </motion.p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Rate Estimator */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="glass-panel p-6 rounded lg:col-span-2"
          >
            <div className="flex items-center gap-2 mb-6 border-b border-black/[0.06] dark:border-white/5 pb-4">
              <div className="w-1.5 h-1.5 bg-[ ] rounded-sm"></div>
              <h3 className=" text-xs text-black dark:text-white uppercase tracking-widest">
                Rate Estimator
              </h3>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[10px]  text-[#666666] mb-2 uppercase tracking-widest">
                    Asset
                  </label>
                  <div className="relative inline-block">
                    <select
                      value={simAsset}
                      onChange={(e) => setSimAsset(e.target.value)}
                      className="w-full
    bg-white/80 dark:bg-black/40
    border border-black/[0.06] dark:border-white/10
    text-black dark:text-white
    px-4 pr-10 py-3
    rounded-md
    font-mono text-sm
    transition
    hover:border-black/20 dark:hover:border-white/20
    focus:outline-none
     appearance-none"
                    >
                      <option value="USDT" className="bg-white dark:bg-[#0A0A0A]">
                        USDT{" "}
                      </option>
                      <option value="USDC" className="bg-white dark:bg-[#0A0A0A] ">
                        USDC{" "}
                      </option>
                      <option value="BTC" className="bg-white dark:bg-[#0A0A0A] ">
                        BTC{" "}
                      </option>
                      <option value="ETH" className="bg-white dark:bg-[#0A0A0A] ">
                        ETH{" "}
                      </option>
                    </select>
                    <ChevronDown
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                      strokeWidth={2.5}
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px]  text-[#666666] mb-2 uppercase tracking-widest">
                    Routing Strategy
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="sim-priority"
                        value="cheapest"
                        checked={simPriority === "cheapest"}
                        onChange={() => setSimPriority("cheapest")}
                        className="peer sr-only"
                      />
                      <div className="border border-black/[0.06] dark:border-white/10 rounded p-2 hover:bg-gray-100 dark:hover:bg-[#0A0A0A] transition-all peer-checked:border-zinc-400 dark:peer-checked:border-zinc-500 peer-checked:bg-gray-100 dark:peer-checked:bg-[#0A0A0A]">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium text-black dark:text-white">
                            Cheapest
                          </span>
                          <span className="text-[10px]  text-[#666666]">
                            ~1.2% Spread
                          </span>
                        </div>
                        <div className="text-[9px]  text-[#A0A0A0]">
                          Wait for competitive fill
                        </div>
                      </div>
                    </label>
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        name="sim-priority"
                        value="fastest"
                        checked={simPriority === "fastest"}
                        onChange={() => setSimPriority("fastest")}
                        className="peer sr-only"
                      />
                      <div className="border border-black/[0.06] dark:border-white/10 rounded p-2 hover:bg-gray-100 dark:hover:bg-[#0A0A0A] transition-all peer-checked:border-zinc-400 dark:peer-checked:border-zinc-500 peer-checked:bg-gray-100 dark:peer-checked:bg-[#0A0A0A]">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-medium text-black dark:text-white">
                            Fastest
                          </span>
                          <span className="text-[10px]  text-[#666666]">
                            ~2.0% Spread
                          </span>
                        </div>
                        <div className="text-[9px]  text-[#A0A0A0]">
                          Immediate acceptance
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="col-span-full">
                  <label className="block text-[10px]  text-[#666666] mb-2 uppercase tracking-widest">
                    Volume
                  </label>
                  <div className="flex items-center gap-4 border-b border-black/[0.06] dark:border-white/10 pb-2">
                    <input
                      type="text"
                      value={simAmount.toLocaleString("en-US")}
                      onChange={(e) =>
                        setSimAmount(parseFloat(e.target.value) || 0)
                      }
                      className="bg-transparent text-black dark:text-white  text-xl w-full outline-none"
                    />
                    <span className="text-xs  text-[#A0A0A0]">{simAsset}</span>
                  </div>
                  <div className="pt-4">
                    <input
                      type="range"
                      min="100"
                      max="1000000"
                      step="100"
                      value={simAmount}
                      onChange={(e) => setSimAmount(parseFloat(e.target.value))}
                      className="w-full accent-gray-600"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-[#0A0A0A]/30 p-4 rounded border border-black/[0.06] dark:border-white/10/50 flex justify-between items-end">
                <div>
                  <span className="text-[10px]  text-[#666666] block mb-1">
                    EST. MERCHANT SPREAD (~
                    {(simResult.spreadPercent * 100).toFixed(1)}%)
                  </span>
                  <span className="text-sm text-[#A0A0A0] ">
                    {simResult.fee.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    {simResult.target}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px]  text-[#666666] block mb-1">
                    EST. NET ({simResult.target})
                  </span>
                  <span className="text-2xl font-bold text-black dark:text-white tracking-tight">
                    {simResult.net.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Network Status */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-panel p-6 rounded"
          >
            <div className="flex items-center gap-2 mb-6 border-b border-black/[0.06] dark:border-white/5 pb-4">
              <div className="w-1.5 h-1.5 bg-[#ff6b35] rounded-full animate-pulse"></div>
              <h3 className=" text-xs text-black dark:text-white uppercase tracking-widest">
                Active Corridors
              </h3>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-black/[0.06] dark:border-white/5 pb-3">
                <span className="text-xs text-[#A0A0A0]">Dubai (DXB)</span>
                <span className="text-[10px]  text-[#ff6b35] border border-[#ff6b35]/20 bg-[#ff6b35]/10 px-1.5 py-0.5 rounded">
                  HIGH_LIQUIDITY
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-black/[0.06] dark:border-white/5 pb-3">
                <span className="text-xs text-[#A0A0A0]">Abu Dhabi (AUH)</span>
                <span className="text-[10px]  text-[#A0A0A0]">MODERATE</span>
              </div>
              <div className="pt-2">
                <div className="flex justify-between text-[10px]  text-[#A0A0A0] mb-2">
                  <span>TOTAL_BONDED_VALUE</span>
                  <span className="text-black dark:text-white">$4.2M</span>
                </div>
                <div className="h-0.5 bg-gray-200 dark:bg-[#111111] w-full">
                  <div className="h-full bg-zinc-400 w-[75%]"></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Path Finder */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="glass-panel p-8 rounded lg:col-span-3"
          >
            <div className="flex items-center gap-3 mb-8 border-b border-black/[0.06] dark:border-white/5 pb-6">
              <svg
                className="w-4 h-4 text-[#A0A0A0]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-black dark:text-white">
                  Liquidity Discovery
                </h3>
                <p className="text-[10px] text-[#666666]  mt-1">
                  BROADCAST DEMAND TO MATCH WITH MERCHANT NODES
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              <div>
                <label className="block text-[10px]  text-[#666666] mb-2 uppercase tracking-widest">
                  Input Asset
                </label>
                <div className="relative inline-block">
                  <select
                    value={pathAsset}
                    onChange={(e) => setPathAsset(e.target.value)}
                    className="
    w-full
    bg-white/80 dark:bg-black/40
    border border-black/[0.06] dark:border-white/10
    text-black dark:text-white
    px-4 pr-10 py-3
    rounded-md
    font-mono text-sm
    transition
    hover:border-black/20 dark:hover:border-white/20
    focus:outline-none
     appearance-none
  "
                  >
                    <option className="bg-white dark:bg-[#0A0A0A]" value="USDT">
                      USDT
                    </option>
                    <option className="bg-white dark:bg-[#0A0A0A]" value="USDC">
                      USDC
                    </option>
                    <option className="bg-white dark:bg-[#0A0A0A]" value="BTC">
                      BTC
                    </option>
                  </select>

                  {/* Down Arrow */}
                  <ChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                    strokeWidth={2.5}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px]  text-[#666666] mb-2 uppercase tracking-widest">
                  Payout Method
                </label>
                <div className="relative inline-block">
                  <select
                    value={pathMethod}
                    onChange={(e) =>
                      setPathMethod(e.target.value as "bank" | "cash")
                    }
                    className="

   bg-white/80 dark:bg-black/40
    border
    text-black dark:text-white
    px-4 pr-16 py-3
    rounded-md
    font-mono text-sm
    focus:outline-none appearance-none
  "
                  >
                    <option className="bg-white dark:bg-[#0A0A0A]">Bank Transfer</option>
                    <option className="bg-white dark:bg-[#0A0A0A]">Physical Vault</option>
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                    strokeWidth={2.5}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px]  text-[#666666] mb-2 uppercase tracking-widest">
                  Region
                </label>
                <div className="relative inline-block">
                  <select
                    value={pathRegion}
                    onChange={(e) =>
                      setPathRegion(e.target.value as "dxb" | "auh")
                    }
                    className="
    w-full
    bg-white/80 dark:bg-black/40
    border border-black/[0.06] dark:border-white/10
    text-black dark:text-white
    px-4 pr-10 py-3
    rounded-md
    font-mono text-sm
    transition
    hover:border-black/20 dark:hover:border-white/20
    focus:outline-none
     appearance-none
  "
                  >
                    <option className="bg-white dark:bg-[#0A0A0A]" value="dxb">
                      Dubai (Main)
                    </option>
                    <option className="bg-white dark:bg-[#0A0A0A]" value="auh">
                      Abu Dhabi
                    </option>
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                    strokeWidth={2.5}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px]  text-[#666666] mb-2 uppercase tracking-widest">
                  Volume
                </label>
                <div className="pt-2">
                  <input
                    type="range"
                    min="1000"
                    max="1000000"
                    step="5000"
                    value={pathAmount}
                    onChange={(e) => setPathAmount(parseInt(e.target.value))}
                    className="w-full accent-gray-600"
                  />
                  <div className="text-right text-[10px] text-[#A0A0A0]  mt-1">
                    {pathAmount.toLocaleString("en-US")} AED
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMerchantNodes.length === 0 ? (
                <div className="col-span-full py-8 text-center text-[#444444]  text-xs">
                  NO ACTIVE MERCHANTS FOR THESE PARAMETERS
                </div>
              ) : (
                filteredMerchantNodes.map((node) => (
                  <div
                    key={node.id}
                    className="border border-black/[0.06] dark:border-white/10 bg-white/80 dark:bg-[#0A0A0A]/20 p-4 rounded hover:border-black/20 dark:hover:border-white/20 transition-all cursor-default group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[9px]  text-[#A0A0A0] uppercase tracking-wider">
                        {node.type}
                      </span>
                      <span className="text-[9px]  text-[#A0A0A0] border border-black/[0.06] dark:border-white/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-[#ff6b35] rounded-full"></div>{" "}
                        BOND: {node.bond}
                      </span>
                    </div>
                    <h4 className="text-black dark:text-white font-medium text-sm mb-1 group-hover:text-black dark:group-hover:text-white">
                      {node.name}
                    </h4>
                    <p className="text-[10px] text-[#666666] mb-3">
                      {node.desc}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-black/[0.06] dark:border-white/10/50">
                      <span className="text-[9px] text-[#666666] ">
                        MIN: {node.min.toLocaleString()}
                      </span>
                      <button
                        onClick={() =>
                          openTerminal(`Connecting to ${node.name}...`)
                        }
                        className="text-[9px] font-medium text-[#ff6b35] hover:text-[#ff6b35]/20"
                      >
                        REQUEST -&gt;
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ============================================
   MERCHANT ASSURANCE SECTION
   ============================================ */
const MerchantAssuranceSection: React.FC = () => {
  return (
    <section className="py-24 px-6 border-t border-black/[0.06] dark:border-white/5 bg-[#FAF8F5] dark:bg-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl font-semibold text-black dark:text-white mb-2 tracking-tight"
          >
            Merchant Assurance Protocol
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-[#666666] text-sm  uppercase tracking-widest"
          >
            Reputation-Weighted Routing (Section 11)
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tier 3 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-panel p-6 rounded border border-black/10 dark:border-white/30"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs  text-[#A0A0A0] uppercase">Tier 3</span>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-[#111111]/50 transition-transform group-hover:scale-110">
                <ShieldCheck className="w-4 h-4 text-[#A0A0A0]" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-black dark:text-white mb-2">Standard Node</h3>
            <p className="text-xs text-[#A0A0A0] mb-4 h-10">
              Entry-level merchants for retail volume.
            </p>
            <div className="space-y-2 border-t border-black/[0.06] dark:border-white/10 pt-4">
              <div className="flex justify-between text-xs">
                <span className="text-[#666666]">Min Bond</span>{" "}
                <span className="text-[#A0A0A0]">$10,000</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#666666]">Max Tx</span>{" "}
                <span className="text-[#A0A0A0]">$5,000</span>
              </div>
            </div>
          </motion.div>

          {/* Tier 2 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-panel p-6 rounded border border-[#ff6b35]/30 relative overflow-hidden"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs  text-[#ff6b35] uppercase">Tier 2</span>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#ff6b35]/30 transition-transform group-hover:scale-110">
                <ShieldCheck className="w-4 h-4 text-[#ff6b35]" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-black dark:text-white mb-2">
              Verified Merchant
            </h3>
            <p className="text-xs text-[#A0A0A0] mb-4 h-10">
              High-volume nodes with automated settlement hooks.
            </p>
            <div className="space-y-2 border-t border-black/[0.06] dark:border-white/10 pt-4">
              <div className="flex justify-between text-xs">
                <span className="text-[#666666]">Min Bond</span>{" "}
                <span className="text-black dark:text-white">$50,000</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#666666]">Max Tx</span>{" "}
                <span className="text-black dark:text-white">$100,000</span>
              </div>
            </div>
          </motion.div>

          {/* Tier 1 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-panel p-6 rounded border border-[#ff6b35]/50 bg-gradient-to-br from-zinc-100 dark:from-zinc-900 to-white dark:to-black relative overflow-hidden"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs  text-[#ff6b35] uppercase font-bold">
                Tier 1 • Institutional
              </span>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#ff6b35]/20 border border-[#ff6b35]/30">
                <Building className="w-4 h-4 text-black dark:text-white" strokeWidth={2} />
              </div>
            </div>
            <h3 className="text-lg font-bold text-black dark:text-white mb-2">
              Liquidity Partner
            </h3>
            <p className="text-xs text-[#A0A0A0] mb-4 h-10">
              Fully bonded institutions with direct banking APIs.
            </p>
            <div className="space-y-2 border-t border-black/[0.06] dark:border-white/10 pt-4">
              <div className="flex justify-between text-xs">
                <span className="text-[#A0A0A0]">Min Bond</span>{" "}
                <span className="text-black dark:text-white ">$250,000+</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#A0A0A0]">Max Tx</span>{" "}
                <span className="text-black dark:text-white ">Unlimited</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ============================================
   PROTOCOL MECHANICS SECTION
   ============================================ */
const ProtocolMechanicsSection: React.FC = () => {
  return (
    <section id="mechanics" className="py-24 px-6 border-t border-black/[0.06] dark:border-white/5">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl font-semibold text-black dark:text-white mb-2 tracking-tight"
          >
            Protocol Mechanics
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-[#666666] text-sm  uppercase tracking-widest"
          >
            From Demand Broadcast to Finality
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-panel p-6 rounded relative group"
          >
            <div className="absolute -top-3 -left-3 w-8 h-8 bg-gray-100 dark:bg-[#111111] rounded-full flex items-center justify-center text-[#A0A0A0]  text-xs border border-black/[0.06] dark:border-white/10">
              01
            </div>
            <h3 className="text-sm font-bold text-black dark:text-white mb-2">
              Demand Broadcast
            </h3>
            <p className="text-xs text-[#A0A0A0] leading-relaxed">
              User broadcasts a settlement request (Asset, Volume, Max Time) to
              the network. No static listings.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-panel p-6 rounded relative group"
          >
            <div className="absolute -top-3 -left-3 w-8 h-8 bg-gray-100 dark:bg-[#111111] rounded-full flex items-center justify-center text-[#A0A0A0]  text-xs border border-black/[0.06] dark:border-white/10">
              02
            </div>
            <h3 className="text-sm font-bold text-black dark:text-white mb-2">
              Merchant Bidding
            </h3>
            <p className="text-xs text-[#A0A0A0] leading-relaxed">
              Bonded merchants analyze the request and submit bids. Routing
              engine selects best execution.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-panel p-6 rounded relative group"
          >
            <div className="absolute -top-3 -left-3 w-8 h-8 bg-gray-100 dark:bg-[#111111] rounded-full flex items-center justify-center text-[#A0A0A0]  text-xs border border-black/[0.06] dark:border-white/10">
              03
            </div>
            <h3 className="text-sm font-bold text-black dark:text-white mb-2">
              Non-Custodial Escrow
            </h3>
            <p className="text-xs text-[#A0A0A0] leading-relaxed">
              User funds are locked in a smart contract. Merchant sends fiat
              off-chain.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-panel p-6 rounded relative group"
          >
            <div className="absolute -top-3 -left-3 w-8 h-8 bg-gray-100 dark:bg-[#111111] rounded-full flex items-center justify-center text-[#A0A0A0]  text-xs border border-black/[0.06] dark:border-white/10">
              04
            </div>
            <h3 className="text-sm font-bold text-black dark:text-white mb-2">
              Proof & Release
            </h3>
            <p className="text-xs text-[#A0A0A0] leading-relaxed">
              Oracle validates payment proof. Contract releases crypto to
              merchant. Reputation score updates.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ============================================
   SERVICES GRID SECTION
   ============================================ */
const ServicesGridSection: React.FC<{
  openServiceModal: (serviceKey: string) => void;
}> = ({ openServiceModal }) => {
  return (
    <section
      id="services"
      className="py-24 px-6 border-t border-black/[0.06] dark:border-white/5 bg-white dark:bg-[#0A0A0A]"
    >
      <div className="max-w-7xl mx-auto">
        <motion.h4
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-xs  text-[#666666] uppercase tracking-widest mb-8"
        >
          Core Settlement Services
        </motion.h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              key: "crypto_aed",
              title: "Crypto to AED",
              desc: "Convert your crypto directly to AED through our decentralized settlement network.",
              icon: ArrowLeftRight,
              bg: "bg-blue-900/20",
              text: "text-blue-400",
            },
            {
              key: "usdt_aed",
              title: "USDT to AED",
              desc: "Easily exchange USDT to AED securely and instantly.",
              icon: LogOut,
              bg: "bg-purple-900/20",
              text: "text-purple-400",
            },
            {
              key: "crypto_cashout",
              title: "Crypto Cashout UAE",
              desc: "Cash out your crypto in the UAE without custodial risk.",
              icon: Coins,
              bg: "bg-green-900/20",
              text: "text-green-400",
            },
            {
              key: "withdraw_crypto",
              title: "Withdraw Crypto in Dubai",
              desc: "Withdraw crypto in Dubai safely and privately.",
              icon: Landmark,
              bg: "bg-orange-900/20",
              text: "text-orange-400",
            },
            {
              key: "crypto_cash",
              title: "Crypto to Cash Dubai",
              desc: "Turn your crypto into cash in Dubai fast.",
              icon: Banknote,
              bg: "bg-pink-900/20",
              text: "text-pink-400",
            },
            {
              key: "sell_crypto",
              title: "Sell Crypto UAE",
              desc: "Sell your crypto in the UAE with ease.",
              icon: TrendingUp,
              bg: "bg-cyan-900/20",
              text: "text-cyan-400",
            },
          ].map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.key}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="glass-panel p-6 rounded card-hover cursor-pointer group flex flex-col border border-black/10 dark:border-white/20"
              >
                <div className="flex justify-between items-start mb-2">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${service.bg} ${service.text}`}
                  >
                    <Icon size={24} strokeWidth={2} />
                  </div>
                </div>
                <h3 className="text-base font-bold text-black dark:text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-sm text-[#A0A0A0] leading-relaxed mb-6 flex-grow">
                  {service.desc}
                </p>
                <button
                  onClick={() => openServiceModal(service.key)}
                  className={`w-full py-2 rounded border border-black/[0.06] dark:border-white/10 bg-gray-50 dark:bg-[#0A0A0A]/50 text-xs font-medium text-[#A0A0A0] group-hover:border-black/20 dark:group-hover:border-white/40 group-hover:text-black/80 dark:group-hover:text-white/80 transition-all`}
                >
                  Learn More
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ============================================
   ECOSYSTEM SECTION
   ============================================ */
const EcosystemSection: React.FC = () => {
  return (
    <section className="py-24 px-6 border-t border-black/[0.06] dark:border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl font-semibold text-black dark:text-white mb-6 tracking-tight"
          >
            Ecosystem Integration
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-[#A0A0A0] text-sm leading-relaxed mb-8"
          >
            Blip acts as the invisible settlement layer for the global economy.
            Wallets, Fintechs, and DAOs can bridge directly into our merchant
            network via API.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="bg-white/80 dark:bg-[#0A0A0A]/30 border border-black/[0.06] dark:border-white/10 hover:border-black/20 dark:hover:border-white/50 p-4 rounded flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-gray-100 dark:bg-[#111111] flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-[#A0A0A0]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-black dark:text-white">Wallets</div>
                <div className="text-[10px] text-[#666666]">
                  Native "Cash Out" Button
                </div>
              </div>
            </div>
            <div className="bg-white/80 dark:bg-[#0A0A0A]/30 border border-black/[0.06] dark:border-white/10 hover:border-black/20 dark:hover:border-white/50 p-4 rounded flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-gray-100 dark:bg-[#111111] flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-[#A0A0A0]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-black dark:text-white">Fintechs</div>
                <div className="text-[10px] text-[#666666]">
                  Crypto-to-Fiat Rails
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl font-semibold text-black dark:text-white mb-6 tracking-tight"
          >
            Who is Blip For?
          </motion.h2>
          <div className="space-y-4">
            {[
              {
                title: "Freelancers & Remote Workers",
                desc: "Get paid in crypto, spend in local AED instantly without exchange delays.",
              },
              {
                title: "Institutions & Treasuries",
                desc: "Off-ramp corporate treasury with high liquidity and compliant invoicing.",
              },
              {
                title: "OTC Desks",
                desc: "Source liquidity on-demand from a network of bonded counterparties.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                className="flex gap-4"
              >
                <div className="mt-1">
                  <svg
                    className="w-5 h-5 text-[#ff6b35]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-black dark:text-white">{item.title}</h4>
                  <p className="text-xs text-[#A0A0A0]">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ============================================
   COMPARISON TABLE SECTION
   ============================================ */
const ComparisonTableSection: React.FC = () => {
  return (
    <section
      id="compare"
      className="py-24 px-6 border-t border-black/[0.06] dark:border-white/5 bg-white dark:bg-[#0A0A0A]"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl font-semibold text-black dark:text-white mb-2 tracking-tight"
          >
            Market Structure Comparison
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-[#666666] text-sm  uppercase tracking-widest"
          >
            Protocol Architecture vs Legacy Models
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="border border-black/[0.06] dark:border-white/10 rounded-lg overflow-hidden"
        >
          <div className="w-full overflow-x-auto">
            <table className="min-w-[700px] w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-[#0A0A0A]/50 text-[#A0A0A0] text-[10px] uppercase tracking-widest">
                <tr>
                  <th className="px-4 sm:px-8 py-4 font-medium">Core Metric</th>
                  <th className="px-4 sm:px-8 py-4 font-medium">
                    Standard P2P Listing
                  </th>
                  <th className="px-4 sm:px-8 py-4 font-medium text-[#ff6b35]">
                    Blip On-Demand Protocol
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/50 bg-white dark:bg-[#0A0A0A]">
                {[
                  [
                    "Discovery Model",
                    "Static Listings (Passive)",
                    "Active Demand Broadcasting",
                  ],
                  [
                    "Merchant Availability",
                    "Unknown / Offline Risk",
                    "Live Routing (Online Only)",
                  ],
                  [
                    "Pricing Efficiency",
                    "Static / Wide Spreads",
                    "Real-Time Competitive Bidding",
                  ],
                  [
                    "Trust Mechanism",
                    "Manual Dispute Resolution",
                    "Programmatic Bonding & Slashing",
                  ],
                ].map((row, i) => (
                  <tr key={i}>
                    <td className="px-4 sm:px-8 py-4 text-[#A0A0A0] whitespace-nowrap">
                      {row[0]}
                    </td>
                    <td className="px-4 sm:px-8 py-4 text-[#666666] whitespace-nowrap">
                      {row[1]}
                    </td>
                    <td className="px-4 sm:px-8 py-4 text-black dark:text-white whitespace-nowrap">
                      {row[2]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ============================================
   FAQ SECTION
   ============================================ */
const FAQSection: React.FC<{
  openFaq: number | null;
  toggleFaq: (index: number) => void;
}> = ({ openFaq, toggleFaq }) => {
  return (
    <section id="faq" className="py-24 px-6 border-t border-black/[0.06] dark:border-white/5">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl font-semibold text-black dark:text-white mb-2 tracking-tight"
          >
            Protocol FAQ
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-[#666666] text-sm  uppercase tracking-widest"
          >
            Technical & Operational Details
          </motion.p>
        </motion.div>

        <div className="space-y-4">
          {[
            {
              q: "Is crypto cashout legal in UAE?",
              a: "Crypto cashout in the UAE depends on the applicable local regulations and the method used. Blip Money operates as a decentralized coordination layer and does not directly handle fiat transactions. Individual settlement merchants are responsible for executing fiat payouts and complying with relevant local laws, licensing requirements, and regulatory obligations.",
            },
            {
              q: "How can I convert USDT to AED in Dubai?",
              a: "You can convert USDT to AED by broadcasting a settlement request on Blip.money. Bonded merchants submit bids and execute the transfer via bank or cash payout.",
            },
            {
              q: 'How does "On-Demand" routing work?',
              a: "Unlike legacy P2P platforms that rely on static order books, Blip Money uses an on-demand settlement model. When a user creates a settlement request, it is broadcast to eligible, bonded merchants. These merchants evaluate the request parameters—such as asset type, volume, and payout requirements—and submit competitive bids in real time. This process enables dynamic price discovery and helps ensure settlement occurs based on current market conditions and available liquidity.",
            },
            {
              q: "Is the escrow custodial?",
              a: "No. Blip Money uses smart-contract-enforced non-custodial escrow. Funds are locked on-chain and are only released according to protocol-defined settlement conditions. Release occurs after successful settlement verification, which may involve approved proof mechanisms or dispute resolution processes defined by the protocol.",
            },
            {
              q: 'What is a "Bonded Merchant"?',
              a: "A bonded merchant is a settlement participant who stakes a financial bond to become eligible to receive settlement requests. The bond acts as an economic guarantee of honest behavior. If a merchant accepts a request but fails to complete settlement according to protocol-defined conditions and timeframes, a portion of their bond may be slashed. This mechanism aligns incentives and encourages timely and reliable settlement.",
            },
            {
              q: "Which chains are supported?",
              a: "Blip Money is designed to be architecturally chain-agnostic. The current implementation operates on Solana, leveraging its high-throughput and low-latency settlement capabilities. Support for additional chains may be considered in the future as the protocol evolves.",
            },
            {
              q: "Do I need to perform KYC?",
              a: "The Blip Money protocol itself is neutral and permissionless and does not require KYC at the protocol level. However, individual settlement merchants may apply their own compliance requirements depending on their jurisdiction and the selected payout method. For example, certain fiat payout options may require beneficiary or source-of-funds information.",
            },
            {
              q: "What are the settlement times?",
              a: "Settlement times vary based on the selected payout method and merchant execution. Certain local or in-person settlement options may complete more quickly, while fiat bank transfers are subject to external banking systems and their operating hours. In general, settlement may occur the same day during local banking hours or the next business day, depending on the chosen rail and merchant availability",
            },
          ].map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * i }}
              className="border border-black/[0.06] dark:border-white/10 bg-white/80 dark:bg-[#0A0A0A]/20 rounded-lg overflow-hidden"
            >
              <button
                className="w-full flex justify-between items-center p-5 text-left bg-gray-50 dark:bg-[#0A0A0A]/40 hover:bg-gray-100 dark:hover:bg-[#111111]/60 transition-colors"
                onClick={() => toggleFaq(i)}
              >
                <span className="font-medium text-black dark:text-white text-sm">{faq.q}</span>

                <svg
                  className={`w-4 h-4 text-[#A0A0A0] transition-transform duration-300 ${
                    openFaq === i ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <AnimatePresence initial={false}>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="bg-gray-50 dark:bg-zinc-950/50 overflow-hidden"
                  >
                    <div className="p-5 text-xs text-[#A0A0A0] leading-relaxed border-t border-black/[0.06] dark:border-white/10">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============================================
   CTA SECTION
   ============================================ */
const CTASection: React.FC<{
  navigate: (path: string) => void;
}> = ({ navigate }) => {
  return (
    <section className="py-24 px-6 border-t border-black/[0.06] dark:border-white/5">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-3xl font-semibold text-black dark:text-white mb-6 tracking-tight"
        >
          Ready to Broadcast?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-[#A0A0A0] mb-8 max-w-lg mx-auto leading-relaxed"
        >
          Join the network where liquidity is routed, not listed. Institutional
          settlement for the decentralized economy.
        </motion.p>
        <motion.button
          
          // onClick={() => navigate("/coming-soon")}
          //     className="group inline-flex items-center justify-center gap-3
          // px-6 h-[52px]
          // rounded-full
          // bg-[#ffffff] text-black
          //  font-medium
          // hover:bg-[#e5e5e5]
          // transition-all duration-300"
        >
          <CTAButton to="/coming-soon">Launch Protocol Terminal </CTAButton>
        </motion.button>
      </div>
    </section>
  );
};

/* ============================================
   DETAIL MODAL
   ============================================ */
const DetailModal: React.FC<{
  isOpen: boolean;
  title: string;
  content: string;
  onClose: () => void;
}> = ({ isOpen, title, content, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/50 dark:bg-black/90 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="bg-white dark:bg-[#0a0a0a] border border-black/[0.06] dark:border-white/10 p-8 rounded w-full max-w-lg shadow-2xl modal-animate relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#A0A0A0] hover:text-black dark:hover:text-white"
        >
          {/* <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg> */}
        </button>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-6 bg-[#ff6b35] rounded-full"></div>
          <h3 className="text-lg font-bold text-black dark:text-white">{title}</h3>
        </div>
        <div
          className="text-sm text-[#A0A0A0] leading-relaxed font-light"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        <div className="mt-8 pt-6 border-t border-black/[0.06] dark:border-white/5 flex justify-end">
          <button
            onClick={onClose}
            className="text-xs  text-[#A0A0A0] hover:text-black dark:hover:text-white uppercase tracking-widest"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/* ============================================
   TERMINAL MODAL
   ============================================ */
const TerminalModal: React.FC<{
  isOpen: boolean;
  context: string;
}> = ({ isOpen, context }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 dark:bg-black/90 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white dark:bg-[#0a0a0a] border border-black/[0.06] dark:border-white/10 p-8 rounded w-full max-w-md shadow-2xl modal-animate ">
        <div className="flex items-center gap-3 mb-6 border-b border-black/[0.06] dark:border-white/5 pb-4">
          <div className="w-2 h-2 rounded-full bg-[#ff6b35] animate-pulse"></div>
          <span className="text-xs text-black dark:text-white tracking-widest uppercase">
            Protocol Handshake
          </span>
        </div>
        <div className="space-y-2 text-xs text-[#A0A0A0] mb-6">
          <p>
            &gt; <span>{context}</span>
          </p>
          <p>&gt; Verifying device integrity...</p>
          <p>&gt; Fetching active merchant bonds...</p>
        </div>
        <div className="h-0.5 w-full bg-gray-200 dark:bg-[#0A0A0A] rounded-full overflow-hidden mb-4">
          <div className="h-full bg-[#ff6b35]w-full transition-all duration-[2000ms] ease-out"></div>
        </div>
        <div className="text-[10px] text-black dark:text-white text-right">ESTABLISHED</div>
      </div>
    </div>
  );
};

/* ============================================
   MAIN COMPONENT
   ============================================ */
const CryptoToUae: React.FC = () => {
  // State management
  const [simAsset, setSimAsset] = useState<string>("USDT");
  const [simAmount, setSimAmount] = useState<number>(1000);
  const [simPriority, setSimPriority] = useState<"cheapest" | "fastest">(
    "cheapest",
  );
  const [pathAsset, setPathAsset] = useState<string>("USDT");
  const [pathMethod, setPathMethod] = useState<"bank" | "cash">("bank");
  const [pathRegion, setPathRegion] = useState<"dxb" | "auh">("dxb");
  const [pathAmount, setPathAmount] = useState<number>(50000);
  const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false);
  const [terminalModalOpen, setTerminalModalOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalContent, setModalContent] = useState<string>("");
  const [terminalContext, setTerminalContext] = useState<string>(
    "Initiating secure channel...",
  );
  const navigate = useNavigate();

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Service data
  const serviceData: { [key: string]: ServiceData } = {
    crypto_aed: {
      title: "Crypto to AED",
      content: `<h4 class="text-white font-bold mb-2">Crypto to AED in UAE – Fast & Secure Conversion</h4><p class="mb-4">Converting crypto to AED in the UAE requires a trusted, transparent, and locally compliant solution. Blip Money provides a secure way for individuals and businesses to convert cryptocurrency into AED across Dubai and the UAE.</p><p class="mb-4">As demand for crypto cashout UAE services grows, users need a professional platform that removes uncertainty. This crypto to AED service is designed to help users safely sell crypto in the UAE and convert digital assets into AED without delays, unclear pricing, or unnecessary risk.</p><h4 class="text-white font-bold mb-2 pt-2">Reliable Crypto to AED Conversion in Dubai</h4><p>Whether you are converting crypto for personal use or business needs, this service offers a dependable crypto to cash Dubai process with transparent rates, defined timelines, and compliance-first execution.</p>`,
    },
    usdt_aed: {
      title: "USDT to AED",
      content: `<h4 class="text-white font-bold mb-2">USDT to AED Conversion in Dubai & UAE</h4><p class="mb-4">USDT to AED conversion is one of the most requested crypto services in the region. USDT is widely used for trading and payments, making fast and reliable AED settlement essential.</p><p class="mb-4">This platform allows users to sell USDT in the UAE, withdraw USDT in Dubai, and convert stablecoins into AED through a structured and transparent process. Clear pricing and predictable execution make this an ideal solution for crypto to AED requirements.</p><h4 class="text-white font-bold mb-2 pt-2">Convert USDT to AED with Confidence</h4><p>Whether you earn in USDT or manage stablecoin liquidity, this USDT to AED service ensures smooth conversion with professional handling and UAE-friendly execution.</p>`,
    },
    crypto_cashout: {
      title: "Crypto Cashout UAE",
      content: `<h4 class="text-white font-bold mb-2">Crypto Cashout in UAE – Safe & Transparent</h4><p class="mb-4">Finding a reliable crypto cashout UAE solution can be challenging. This service is designed for users who want to sell crypto in the UAE, convert crypto to AED, and withdraw funds without relying on informal or risky channels.</p><p class="mb-4">With verified processes and structured execution, users can confidently withdraw crypto in Dubai while maintaining compliance and transparency.</p><h4 class="text-white font-bold mb-2 pt-2">Trusted Crypto Cashout Process</h4><p>From initiating the transaction to final AED settlement, the crypto cashout UAE process is clear, secure, and suitable for long-term use by individuals and businesses.</p>`,
    },
    withdraw_crypto: {
      title: "Withdraw Crypto in Dubai",
      content: `<h4 class="text-white font-bold mb-2">Withdraw Crypto in Dubai Easily</h4><p class="mb-4">If you need to withdraw crypto in Dubai, a structured and compliant approach is essential. This service allows users to convert crypto into AED efficiently while supporting safe crypto cashout UAE needs.</p><p class="mb-4">The withdrawal flow is designed to reduce friction and ensure a reliable crypto to cash Dubai experience with clear timelines and professional execution.</p><h4 class="text-white font-bold mb-2 pt-2">Simple Crypto Withdrawal for UAE Users</h4><p>Built specifically for Dubai and UAE users, this service provides a dependable method to withdraw crypto without uncertainty or hidden risks.</p>`,
    },
    crypto_cash: {
      title: "Crypto to Cash Dubai",
      content: `<h4 class="text-white font-bold mb-2">Crypto to Cash in Dubai – Professional Cashout Solution</h4><p class="mb-4">Converting crypto to cash in Dubai requires trust, execution, and regulatory awareness. This service enables users to convert crypto to AED and complete crypto cashout UAE through clean and transparent workflows.</p><p class="mb-4">Instead of informal methods, users get a reliable solution to withdraw crypto in Dubai and access AED liquidity safely.</p><h4 class="text-white font-bold mb-2 pt-2">Secure Crypto to Cash Conversion</h4><p>Each transaction follows a structured process, ensuring funds are protected while delivering timely AED access for personal or business use.</p>`,
    },
    sell_crypto: {
      title: "Sell Crypto UAE",
      content: `<h4 class="text-white font-bold mb-2">Sell Crypto in UAE with Transparency</h4><p class="mb-4">Selling crypto in the UAE should be simple and predictable. This sell crypto UAE service allows users to convert supported crypto assets into AED with clear pricing and professional execution.</p><p class="mb-4">Whether you are converting USDT to AED or completing a full crypto cashout UAE, the process is designed to remove uncertainty and provide consistent results.</p><h4 class="text-white font-bold mb-2 pt-2">Trusted Way to Sell Crypto in UAE</h4><p>This service supports traders, investors, freelancers, and businesses looking to sell crypto and convert assets into AED through a transparent and reliable system.</p>`,
    },
  };

  // Merchant nodes data
  const merchantNodes: MerchantNode[] = [
    {
      id: 1,
      name: "DIFC Liquidity Hub",
      type: "bank",
      region: "dxb",
      min: 50000,
      desc: "Institutional Tier. Bond: $250k.",
      latency: "12m",
      bond: "HIGH",
    },
    {
      id: 2,
      name: "Jumeirah Vault",
      type: "cash",
      region: "dxb",
      min: 1000,
      desc: "Physical Node. Bond: $50k.",
      latency: "10m",
      bond: "MED",
    },
    {
      id: 3,
      name: "ADGM Gateway",
      type: "bank",
      region: "auh",
      min: 100000,
      desc: "Regulated Rails. Bond: $500k.",
      latency: "15m",
      bond: "MAX",
    },
    {
      id: 4,
      name: "Marina Point",
      type: "cash",
      region: "dxb",
      min: 500,
      desc: "Retail Node. Bond: $25k.",
      latency: "14m",
      bond: "LOW",
    },
    {
      id: 5,
      name: "DSO Tech Bridge",
      type: "bank",
      region: "dxb",
      min: 5000,
      desc: "Automated. Bond: $100k.",
      latency: "25m",
      bond: "MED",
    },
    {
      id: 6,
      name: "Corniche Desk",
      type: "cash",
      region: "auh",
      min: 25000,
      desc: "VIP Node. Bond: $150k.",
      latency: "18m",
      bond: "HIGH",
    },
  ];

  // Modal handlers
  const openServiceModal = (serviceKey: string) => {
    const data = serviceData[serviceKey];
    if (data) {
      setModalTitle(data.title);
      setModalContent(data.content);
      setDetailModalOpen(true);
    }
  };

  const closeDetailModal = () => {
    setDetailModalOpen(false);
  };

  const openTerminal = (context: string) => {
    setTerminalContext(context);
    setTerminalModalOpen(true);

    setTimeout(() => {
      setTerminalModalOpen(false);
    }, 2500);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    // Schema.org structured data
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FinancialService",
      name: "Blip.money",
      url: "https://blip.money",
      description:
        "Decentralized crypto cashout and USDT to AED settlement protocol in the UAE.",
      areaServed: {
        "@type": "Country",
        name: "United Arab Emirates",
      },
      serviceType: [
        "Crypto Cashout UAE",
        "USDT to AED",
        "Sell Crypto Dubai",
        "Crypto to Cash Dubai",
        "Withdraw Crypto UAE",
      ],
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="bg-[#FAF8F5] dark:bg-[#030303] text-black dark:text-white min-h-screen selection:bg-black/20 dark:selection:bg-white/20 selection:text-black dark:selection:text-white overflow-x-hidden font-sans">
      <SEO
        title="Crypto to AED | USDT to AED Converter & Cashout in UAE | Blip Money
"
        description="Convert crypto to AED effortlessly with Blip Money. Instantly estimate USDT to AED rates, sell crypto in UAE, and explore reliable crypto cashout, withdrawals, and crypto-to-cash solutions tailored for UAE users."
        canonical="https://blip.money/cryptoToAed"
      />
      <HreflangTags path="/cryptoToAed" />

      {/* Grain overlay for premium film texture */}
      <div className="grain-overlay" />

      <HeroSection navigate={navigate} scrollToSection={scrollToSection} />

      <SEOContentBlock />

      <MarketSimulationSection
        simAsset={simAsset}
        setSimAsset={setSimAsset}
        simAmount={simAmount}
        setSimAmount={setSimAmount}
        simPriority={simPriority}
        setSimPriority={setSimPriority}
        pathAsset={pathAsset}
        setPathAsset={setPathAsset}
        pathMethod={pathMethod}
        setPathMethod={setPathMethod}
        pathRegion={pathRegion}
        setPathRegion={setPathRegion}
        pathAmount={pathAmount}
        setPathAmount={setPathAmount}
        merchantNodes={merchantNodes}
        openTerminal={openTerminal}
      />

      <MerchantAssuranceSection />

      <ProtocolMechanicsSection />

      <ServicesGridSection openServiceModal={openServiceModal} />

      <EcosystemSection />

      <ComparisonTableSection />

      <FAQSection openFaq={openFaq} toggleFaq={toggleFaq} />

      <CTASection navigate={navigate} />

      <DetailModal
        isOpen={detailModalOpen}
        title={modalTitle}
        content={modalContent}
        onClose={closeDetailModal}
      />

      <TerminalModal isOpen={terminalModalOpen} context={terminalContext} />
    </div>
  );
};

export default CryptoToUae;
