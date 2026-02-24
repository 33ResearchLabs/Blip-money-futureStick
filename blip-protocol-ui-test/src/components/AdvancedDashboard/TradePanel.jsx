import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  generateBalance,
  generateMarketRate,
  getCurrencyPairs,
  formatNumber,
} from '@/utils/liveDataGenerator';

// ── Animated Number ──────────────────────────────────────────────────────────
function AnimatedNumber({ value, decimals = 2, prefix = '', className = '' }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    const start = prev.current;
    const end = value;
    const duration = 600;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(start + (end - start) * eased);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
    prev.current = value;
  }, [value]);

  return (
    <span className={className}>
      {prefix}{Number(display).toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
    </span>
  );
}

// ── Trade Panel ──────────────────────────────────────────────────────────────
export default function TradePanel() {
  const [balance, setBalance] = useState(() => generateBalance());
  const [marketRate, setMarketRate] = useState(() => generateMarketRate());
  const [side, setSide] = useState('BUY');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [spread, setSpread] = useState('fast');
  const [boost, setBoost] = useState(0);
  const [selectedPair, setSelectedPair] = useState(0);
  const pairs = getCurrencyPairs();

  // Auto-update market rate
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketRate(generateMarketRate(pairs[selectedPair]));
    }, 3000);
    return () => clearInterval(interval);
  }, [selectedPair]);

  // Auto-update balance
  useEffect(() => {
    const interval = setInterval(() => {
      setBalance(prev => ({
        ...prev,
        dailyPnl: prev.dailyPnl + (Math.random() - 0.4) * 10,
        dailyPnlPercent: prev.dailyPnlPercent + (Math.random() - 0.4) * 0.1,
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const spreadOptions = [
    { key: 'fast', label: 'Fast', value: '+2.5%' },
    { key: 'best', label: 'Best', value: '+2%' },
    { key: 'cheap', label: 'Cheap', value: '+1.5%' },
  ];

  const boostOptions = [0, 5, 10, 15];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-full bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl overflow-hidden"
    >
      {/* Header badges */}
      <div className="flex items-center gap-2 px-4 pt-4 pb-2 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span className="text-[10px] font-bold text-green-400 tracking-wider">LIVE</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/50 font-medium border border-white/[0.06]">
          ◆ SILVER
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40 font-mono">
          RNK #12
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/40 font-mono">
          WIN 30%
        </span>
        <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-bold border border-orange-500/30">
          ⚡ ACTIVE
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
        {/* Available Balance */}
        <div className="pt-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-medium">
              Available Balance
            </span>
          </div>
          <div className="text-4xl font-bold text-white tracking-tight font-mono">
            <AnimatedNumber value={balance.available} decimals={0} />
          </div>
          <p className="text-xs text-white/30 mt-0.5 font-mono">
            ≈ <AnimatedNumber value={balance.available * marketRate.rate} decimals={0} /> {marketRate.quote}
          </p>
          <motion.div
            className={`inline-flex items-center gap-1 mt-2 px-2 py-1 rounded-lg text-[11px] font-semibold ${
              balance.dailyPnl >= 0
                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span>{balance.dailyPnl >= 0 ? '↑' : '↓'}</span>
            <span>{balance.dailyPnl >= 0 ? '+' : ''}{balance.dailyPnl.toFixed(2)} USDT</span>
            <span className="px-1.5 py-0.5 rounded bg-white/5 text-[9px]">24h</span>
          </motion.div>
          <p className="text-[10px] text-white/20 mt-1.5">
            {balance.locked.toFixed(0)} locked in escrow
          </p>
        </div>

        {/* Currency toggle */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] text-white/40 uppercase tracking-wider">
                {pairs[selectedPair].base}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setSide('BUY')}
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    side === 'BUY'
                      ? 'bg-green-500/20 text-green-400'
                      : 'text-white/30 hover:text-white/50'
                  } transition-colors`}
                >
                  BUY
                </button>
                <button
                  onClick={() => setSide('SELL')}
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    side === 'SELL'
                      ? 'bg-red-500/20 text-red-400'
                      : 'text-white/30 hover:text-white/50'
                  } transition-colors`}
                >
                  SELL
                </button>
              </div>
            </div>
            <p className="text-lg font-bold text-white font-mono">0</p>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
            <span className="text-[10px] text-white/40 uppercase tracking-wider block mb-1">
              {pairs[selectedPair].quote} CASH
            </span>
            <p className="text-lg font-bold text-white font-mono">
              {pairs[selectedPair].quote === 'INR' ? '₹' : pairs[selectedPair].quote === 'AED' ? '' : '$'}0
            </p>
          </div>
        </div>

        {/* Market Rate */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.15em] text-white/40 font-medium">
                Market Rate
              </span>
              <span className="text-[9px] text-orange-400/70">*EST</span>
            </div>
            <button className="text-[10px] px-2.5 py-1 rounded-lg bg-orange-500/20 text-orange-400 font-bold border border-orange-500/30 hover:bg-orange-500/30 transition-colors">
              SET PRICE
            </button>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">
              <AnimatedNumber value={marketRate.rate} decimals={4} />
            </span>
            <motion.span
              key={marketRate.change24h}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-xs font-semibold ${
                marketRate.change24h >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {marketRate.change24h >= 0 ? '+' : ''}{marketRate.change24h}%
            </motion.span>
          </div>
          <p className="text-[10px] text-white/20 mt-1">{marketRate.pair}</p>
        </div>

        {/* Corridor Stats */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/30">⟐</span>
              <span className="text-[10px] uppercase tracking-wider text-white/40 font-medium">Corridor</span>
            </div>
            <span className="text-[10px] text-white/30 font-mono">
              {Math.floor(Math.random() * 5)} online · vol {Math.floor(Math.random() * 10)}
            </span>
          </div>
          <div className="flex gap-4 mt-2 text-[10px] text-white/25 font-mono">
            <span>{Math.floor(Math.random() * 10)} done</span>
            <span>{Math.floor(Math.random() * 10)} cancelled</span>
            <span>{Math.floor(Math.random() * 20)} total</span>
          </div>
        </div>

        {/* Amount Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/30">⇄</span>
              <span className="text-[10px] uppercase tracking-[0.15em] text-white/40 font-medium">Amount</span>
            </div>
            <button
              onClick={() => setAmount(String(balance.available))}
              className="text-[10px] text-orange-400 font-bold hover:text-orange-300 transition-colors"
            >
              MAX {balance.available.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </button>
          </div>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-lg font-mono text-white placeholder-white/15 focus:outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 transition-all"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-white/30 font-medium">
              USDT
            </span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setPaymentMethod('bank')}
            className={`py-2.5 rounded-xl text-xs font-semibold transition-all ${
              paymentMethod === 'bank'
                ? 'bg-white/10 text-white border border-white/15'
                : 'bg-white/[0.03] text-white/30 border border-white/[0.06] hover:border-white/10'
            }`}
          >
            Bank Transfer
          </button>
          <button
            onClick={() => setPaymentMethod('cash')}
            className={`py-2.5 rounded-xl text-xs font-semibold transition-all ${
              paymentMethod === 'cash'
                ? 'bg-white/10 text-white border border-white/15'
                : 'bg-white/[0.03] text-white/30 border border-white/[0.06] hover:border-white/10'
            }`}
          >
            Cash
          </button>
        </div>

        {/* Spread */}
        <div>
          <span className="text-[10px] uppercase tracking-[0.15em] text-white/40 font-medium block mb-2">
            Spread
          </span>
          <div className="grid grid-cols-3 gap-2">
            {spreadOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setSpread(opt.key)}
                className={`relative py-2.5 rounded-xl text-center transition-all ${
                  spread === opt.key
                    ? 'bg-orange-500/15 border border-orange-500/40 shadow-[0_0_15px_rgba(255,107,53,0.1)]'
                    : 'bg-white/[0.03] border border-white/[0.06] hover:border-white/10'
                }`}
              >
                <span className={`text-[11px] font-semibold block ${
                  spread === opt.key ? 'text-orange-400' : 'text-white/40'
                }`}>
                  {opt.label}
                </span>
                <span className={`text-[10px] font-mono ${
                  spread === opt.key ? 'text-orange-400/70' : 'text-white/20'
                }`}>
                  {opt.value}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Boost */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/30">⚡</span>
              <span className="text-[10px] uppercase tracking-[0.15em] text-white/40 font-medium">Boost</span>
            </div>
            <span className="text-[10px] text-white/25 font-medium">manual</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {boostOptions.map((val) => (
              <button
                key={val}
                onClick={() => setBoost(val)}
                className={`py-2 rounded-xl text-[11px] font-semibold transition-all ${
                  boost === val
                    ? 'bg-white/10 text-white border border-white/15'
                    : 'bg-white/[0.03] text-white/30 border border-white/[0.06] hover:border-white/10'
                }`}
              >
                {val === 0 ? '0' : `${val}%`}
              </button>
            ))}
          </div>
        </div>

        {/* Buy / Sell Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSide('BUY')}
            className={`py-3.5 rounded-xl text-sm font-bold transition-all ${
              side === 'BUY'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-[0_0_25px_rgba(34,197,94,0.25)]'
                : 'bg-green-500/10 text-green-400/60 border border-green-500/20 hover:bg-green-500/20'
            }`}
          >
            BUY
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSide('SELL')}
            className={`py-3.5 rounded-xl text-sm font-bold transition-all ${
              side === 'SELL'
                ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-[0_0_25px_rgba(239,68,68,0.25)]'
                : 'bg-red-500/10 text-red-400/60 border border-red-500/20 hover:bg-red-500/20'
            }`}
          >
            SELL
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
