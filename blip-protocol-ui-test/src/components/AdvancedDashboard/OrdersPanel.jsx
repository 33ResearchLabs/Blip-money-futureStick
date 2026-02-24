import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  generateOrders,
  generateOrder,
  generateActiveOrder,
} from '@/utils/liveDataGenerator';

// ── Order Card ───────────────────────────────────────────────────────────────
function OrderCard({ order, index }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="group bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] hover:border-white/[0.1] rounded-xl p-3 transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold ${
            order.online
              ? 'bg-green-500/10 text-green-400 ring-1 ring-green-500/20'
              : 'bg-white/5 text-white/30 ring-1 ring-white/10'
          }`}>
            {order.user.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-white/80">{order.user}</span>
              {order.online && (
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              )}
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[9px] text-white/25 font-mono">{order.completedTrades} trades</span>
              <span className="text-[9px] text-orange-400/60">★ {order.rating}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
            order.type === 'BUY'
              ? 'bg-green-500/10 text-green-400'
              : 'bg-red-500/10 text-red-400'
          }`}>
            {order.type}
          </span>
        </div>
      </div>

      <div className="flex items-baseline justify-between">
        <div>
          <span className="text-sm font-bold text-white font-mono">
            {order.amount.toLocaleString()}
          </span>
          <span className="text-[10px] text-white/30 ml-1">{order.currency}</span>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono text-white/50">@ {order.rate}</span>
          <span className="text-[10px] text-orange-400/60 ml-1">{order.spread}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.04]">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.04] text-white/25 border border-white/[0.06]">
            {order.paymentMethod}
          </span>
          {order.tags.map((tag) => (
            <span
              key={tag}
              className={`text-[9px] px-1.5 py-0.5 rounded border ${
                tag === 'Premium'
                  ? 'bg-orange-500/10 text-orange-400/60 border-orange-500/20'
                  : tag === 'Large'
                  ? 'bg-purple-500/10 text-purple-400/60 border-purple-500/20'
                  : tag === 'Mineable'
                  ? 'bg-blue-500/10 text-blue-400/60 border-blue-500/20'
                  : 'bg-white/[0.04] text-white/25 border-white/[0.06]'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
        <span className="text-[9px] text-white/15 font-mono">{order.timePosted}</span>
      </div>
    </motion.div>
  );
}

// ── Active Order Card ────────────────────────────────────────────────────────
function ActiveOrderCard({ order }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white/[0.03] border border-orange-500/20 rounded-xl p-3"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center text-[10px] font-bold text-orange-400 ring-1 ring-orange-500/20">
            {order.user.charAt(0)}
          </div>
          <div>
            <span className="text-xs font-semibold text-white/80">{order.user}</span>
            <span className="text-[9px] text-white/25 ml-2 font-mono">#{order.id}</span>
          </div>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 font-medium">
          {order.status}
        </span>
      </div>

      <div className="flex items-baseline justify-between mb-2">
        <span className="text-sm font-bold text-white font-mono">
          {order.amount.toLocaleString()} {order.currency}
        </span>
        <span className="text-[10px] text-white/30 font-mono">@ {order.rate}</span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-white/[0.04] rounded-full h-1.5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${order.progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400"
          style={{
            boxShadow: '0 0 10px rgba(255, 107, 53, 0.4)',
          }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[9px] text-white/20">{order.paymentMethod}</span>
        <span className="text-[9px] text-orange-400/60 font-mono">{order.progress}%</span>
      </div>
    </motion.div>
  );
}

// ── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="text-2xl mb-2 opacity-20">{icon}</div>
      <p className="text-xs text-white/25 font-medium">{title}</p>
      <p className="text-[10px] text-white/15 mt-0.5">{subtitle}</p>
    </div>
  );
}

// ── Orders Panel ─────────────────────────────────────────────────────────────
export default function OrdersPanel() {
  const [orders, setOrders] = useState(() => generateOrders(6));
  const [activeOrders, setActiveOrders] = useState([]);
  const [mainTab, setMainTab] = useState('pending');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filters = ['All', 'Mineable', 'High Premium', 'Large', 'Expiring'];

  // Auto-add new orders
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(prev => {
        const next = [generateOrder(), ...prev];
        return next.slice(0, 15);
      });
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Occasionally add/remove active orders
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveOrders(prev => {
        if (prev.length < 2 && Math.random() > 0.5) {
          return [...prev, generateActiveOrder()];
        }
        if (prev.length > 0 && Math.random() > 0.7) {
          return prev.slice(1);
        }
        return prev.map(o => ({
          ...o,
          progress: Math.min(o.progress + Math.floor(Math.random() * 15), 100),
        }));
      });
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const filteredOrders = orders.filter(o => {
    if (filter === 'all') return true;
    return o.tags.some(t => t.toLowerCase() === filter.toLowerCase() ||
      (filter === 'High Premium' && t === 'Premium'));
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex flex-col h-full"
    >
      {/* Pending Orders Section */}
      <div className="flex-1 bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl overflow-hidden flex flex-col">
        {/* Tabs header */}
        <div className="flex items-center gap-3 px-4 pt-4 pb-2">
          <button
            onClick={() => setMainTab('pending')}
            className={`text-xs font-semibold pb-1 border-b-2 transition-colors ${
              mainTab === 'pending'
                ? 'text-white border-orange-500'
                : 'text-white/30 border-transparent hover:text-white/50'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setMainTab('all')}
            className={`text-xs font-semibold pb-1 border-b-2 transition-colors ${
              mainTab === 'all'
                ? 'text-white border-orange-500'
                : 'text-white/30 border-transparent hover:text-white/50'
            }`}
          >
            All
          </button>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-500" />
              </span>
              <span className="text-[9px] text-orange-400 font-semibold">Live</span>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-1 rounded hover:bg-white/5 transition-colors">
                <svg className="w-3.5 h-3.5 text-white/25" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button className="p-1 rounded hover:bg-white/5 transition-colors">
                <svg className="w-3.5 h-3.5 text-white/25" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
            <span className="text-[10px] text-white/15 font-mono">{filteredOrders.length}</span>
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-1.5 px-4 pb-2 overflow-x-auto scrollbar-none">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f.toLowerCase() === 'high premium' ? 'High Premium' : f.toLowerCase())}
              className={`text-[10px] font-medium px-2.5 py-1 rounded-lg whitespace-nowrap transition-all ${
                filter === f.toLowerCase() || (f === 'All' && filter === 'all')
                  ? 'bg-white/10 text-white border border-white/15'
                  : 'text-white/25 hover:text-white/40 border border-transparent hover:border-white/[0.06]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders..."
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg pl-9 pr-3 py-2 text-[11px] text-white placeholder-white/15 focus:outline-none focus:border-white/10 transition-colors"
              />
            </div>
            <button className="px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-[11px] text-white/30 hover:border-white/10 transition-colors flex items-center gap-1.5">
              Time
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Orders list */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 scrollbar-thin scrollbar-thumb-white/10">
          <AnimatePresence mode="popLayout">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, i) => (
                <OrderCard key={order.id} order={order} index={i} />
              ))
            ) : (
              <EmptyState
                icon="🔍"
                title="No pending orders"
                subtitle="New orders from the network show here"
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* In Progress Section */}
      <div className="mt-3 bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-white/60">In Progress</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-white/25 font-mono">
              {activeOrders.length}
            </span>
          </div>
        </div>

        <div className="px-4 pb-4 space-y-2">
          <AnimatePresence mode="popLayout">
            {activeOrders.length > 0 ? (
              activeOrders.map(order => (
                <ActiveOrderCard key={order.id} order={order} />
              ))
            ) : (
              <EmptyState
                icon="⏳"
                title="No active trades"
                subtitle="Accepted orders will appear here"
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
