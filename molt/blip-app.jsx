import React, { useState } from 'react';
import {
  ArrowUpRight, ArrowDownLeft, ArrowLeft, ChevronDown,
  Users, Zap, Globe, Fingerprint, Bell, CheckCircle2,
  TrendingUp, Plus, Home, Activity, User, QrCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TRANSITION = {
  spring: { type: 'spring', stiffness: 300, damping: 30 },
  bounce: { type: 'spring', stiffness: 400, damping: 10 },
  tap: { scale: 0.94 },
};

const FRIENDS = [
  { id: 1, name: 'Alex',   img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop', status: 'active' },
  { id: 2, name: 'Sasha',  img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop', status: 'online' },
  { id: 3, name: 'Jordan', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop', status: 'online' },
  { id: 4, name: 'Taylor', img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop', status: 'offline' },
];

const ACTIVITY = [
  { id: 1, merchant: 'Apple Store', location: 'Fifth Ave',  amount: '1,299.00', date: '2m ago',   img: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=300&h=300&fit=crop',  type: 'out', category: 'Tech',   catColor: '#007AFF' },
  { id: 2, merchant: 'Starbucks',   location: 'Met Square', amount: '12.40',    date: '1h ago',   img: 'https://images.unsplash.com/photo-1544787210-2827448b303c?w=300&h=300&fit=crop',  type: 'out', category: 'Food',   catColor: '#00b14f' },
  { id: 3, merchant: 'Nike HQ',     location: 'Settlement', amount: '4,500.00', date: 'Yesterday',img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',  type: 'in',  category: 'Income', catColor: '#10b981' },
  { id: 4, merchant: 'Airbnb',      location: 'Brooklyn',   amount: '340.00',   date: 'Mon',      img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300&h=300&fit=crop', type: 'out', category: 'Travel', catColor: '#FF5A5F' },
];

const SPARK = [28, 42, 33, 58, 44, 70, 55, 82, 69, 98, 87, 115, 102, 138];

// ─── Sparkline SVG ───────────────────────────────────────────────────────────
const Sparkline = ({ data = SPARK, width = 300, height = 56 }) => {
  const max = Math.max(...data), min = Math.min(...data), rng = max - min || 1;
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - 6 - ((v - min) / rng) * (height - 14),
  }));
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const area = `${line} L${width},${height} L0,${height} Z`;
  const last = pts[pts.length - 1];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full">
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <path d={area} fill="url(#sg)" />
      <path d={line} fill="none" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last.x} cy={last.y} r="3.5" fill="#10b981" filter="url(#glow)" />
      <circle cx={last.x} cy={last.y} r="7" fill="none" stroke="#10b981" strokeWidth="1" opacity="0.35" />
    </svg>
  );
};

// ─── Ambient background orbs ─────────────────────────────────────────────────
const AmbientGlow = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    {[
      { color: 'rgba(124,58,237,0.13)', dur: 18, style: { top: '-15%', left: '-10%', width: '65%', height: '55%' } },
      { color: 'rgba(16,185,129,0.09)', dur: 22, style: { bottom: '-20%', right: '-10%', width: '60%', height: '55%' } },
      { color: 'rgba(59,130,246,0.07)', dur: 26, style: { top: '35%',  right: '15%',  width: '40%', height: '40%' } },
    ].map((orb, i) => (
      <motion.div
        key={i}
        animate={{ x: [0, 40 * (i % 2 === 0 ? 1 : -1), -30, 0], y: [0, -40, 50, 0], scale: [1, 1.15, 0.9, 1] }}
        transition={{ duration: orb.dur, repeat: Infinity, ease: 'linear' }}
        className="absolute rounded-full"
        style={{ ...orb.style, background: `radial-gradient(ellipse, ${orb.color} 0%, transparent 70%)`, filter: 'blur(60px)' }}
      />
    ))}
  </div>
);

// ─── Bottom nav ───────────────────────────────────────────────────────────────
const TABS = [
  { id: 'home',     Icon: Home,         label: 'Home' },
  { id: 'activity', Icon: Activity,     label: 'Activity' },
  { id: 'send',     Icon: ArrowUpRight, label: 'Pay' },
  { id: 'profile',  Icon: User,         label: 'You' },
];

const BottomNav = ({ active, onChange }) => (
  <div className="absolute bottom-0 left-0 right-0 z-[200] px-4 pb-4">
    <div className="flex items-center justify-around px-2 py-2.5 rounded-[28px]"
      style={{ background: 'rgba(14,14,22,0.92)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.07)' }}>
      {TABS.map(({ id, Icon, label }) => {
        const on = active === id;
        return (
          <motion.button key={id} whileTap={{ scale: 0.85 }} onClick={() => onChange(id)}
            className="relative flex flex-col items-center gap-1 px-5 py-1">
            {on && (
              <motion.div layoutId="pill" className="absolute inset-0 rounded-[18px]"
                style={{ background: 'rgba(124,58,237,0.18)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
            )}
            <Icon size={19} strokeWidth={on ? 2.5 : 1.5} style={{ color: on ? '#a78bfa' : 'rgba(255,255,255,0.22)', position: 'relative' }} />
            <span className="text-[8.5px] font-black uppercase tracking-wider relative"
              style={{ color: on ? '#a78bfa' : 'rgba(255,255,255,0.18)' }}>
              {label}
            </span>
          </motion.button>
        );
      })}
    </div>
  </div>
);

// ─── Stat chip ────────────────────────────────────────────────────────────────
const Chip = ({ label, value, color }) => (
  <div className="flex-1 rounded-[18px] px-3 py-3"
    style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.055)' }}>
    <p className="text-[7.5px] font-black uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.25)' }}>{label}</p>
    <p className="text-[13px] font-black" style={{ color }}>{value}</p>
  </div>
);

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState('home');
  const [tab, setTab]       = useState('home');
  const [amount, setAmount] = useState('0');

  const go = (s) => { setScreen(s); if (s !== 'success') setTab(s); };
  const handleTab = (t) => { setTab(t); setScreen(t); };
  const key = (v) => {
    if (v === 'delete') setAmount(a => a.length > 1 ? a.slice(0, -1) : '0');
    else if (v === '.' && !amount.includes('.')) setAmount(a => a + '.');
    else if (v !== '.') setAmount(a => a === '0' ? v : a + v);
  };

  // ── HOME ──────────────────────────────────────────────────────────────────
  const Home_ = () => (
    <div className="flex flex-col h-full w-full">
      <header className="px-5 pt-14 pb-3 flex items-center justify-between z-50">
        <div>
          <p style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.38em', color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', marginBottom: 3 }}>Portfolio</p>
          <div className="flex items-center gap-1.5">
            <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.04em' }}>Blip Network</span>
            <ChevronDown size={13} style={{ color: 'rgba(255,255,255,0.3)', marginTop: 1 }} />
          </div>
        </div>
        <div className="flex gap-2.5">
          <motion.button whileTap={TRANSITION.tap} className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <Bell size={15} style={{ color: 'rgba(255,255,255,0.4)' }} />
          </motion.button>
          <motion.button whileTap={TRANSITION.tap} className="w-9 h-9 rounded-xl overflow-hidden"
            style={{ border: '2px solid rgba(124,58,237,0.45)' }}>
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Elias" className="w-full h-full" alt="me" />
          </motion.button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-28 no-scrollbar z-10" style={{ paddingLeft: 20, paddingRight: 20 }}>

        {/* ── WALLET CARD ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="relative mb-5">
          {/* Outer glow halo */}
          <div className="absolute inset-0 rounded-[40px] opacity-70" style={{
            background: 'radial-gradient(ellipse at 25% 35%, rgba(16,185,129,0.22) 0%, transparent 55%), radial-gradient(ellipse at 80% 75%, rgba(124,58,237,0.22) 0%, transparent 55%)',
            filter: 'blur(22px)', transform: 'scale(1.05)',
          }} />
          <div className="relative overflow-hidden rounded-[40px]" style={{
            background: 'linear-gradient(148deg, #0b0e1a 0%, #12102c 42%, #0c1a2e 100%)',
            border: '1px solid rgba(255,255,255,0.085)',
            boxShadow: '0 28px 72px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.055)',
            minHeight: 252,
          }}>
            {/* Emerald corner glow */}
            <div className="absolute" style={{
              top: 0, left: 0, width: 180, height: 180,
              background: 'radial-gradient(circle, rgba(16,185,129,0.16) 0%, transparent 70%)',
              transform: 'translate(-38%, -38%)',
            }} />
            {/* Violet corner glow */}
            <div className="absolute" style={{
              bottom: 0, right: 0, width: 180, height: 180,
              background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)',
              transform: 'translate(38%, 38%)',
            }} />
            {/* Subtle dot grid */}
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
              backgroundSize: '22px 22px', opacity: 0.4,
            }} />
            {/* Shimmer sweep */}
            <motion.div
              animate={{ x: ['-220%', '220%'] }}
              transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 5.5, ease: 'easeInOut' }}
              className="absolute inset-0 skew-x-12"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.035), transparent)' }}
            />

            <div className="relative z-10 p-6">
              {/* Top row */}
              <div className="flex justify-between items-start mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-[14px] flex items-center justify-center" style={{
                    background: 'linear-gradient(135deg, #059669, #7c3aed)',
                    boxShadow: '0 0 18px rgba(16,185,129,0.35)',
                  }}>
                    <Zap size={15} className="fill-white text-white" />
                  </div>
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>BLIP</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                      <span style={{ fontSize: 8, fontWeight: 900, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Live</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p style={{ fontSize: 8, fontWeight: 900, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase' }}>Signature</p>
                  <p style={{ fontSize: 8, fontWeight: 900, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase' }}>v 2.0</p>
                </div>
              </div>

              {/* Balance */}
              <div className="mb-1">
                <p style={{ fontSize: 8.5, fontWeight: 900, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', marginBottom: 4 }}>Total Balance</p>
                <div className="flex items-baseline gap-0">
                  <span style={{ fontSize: 54, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, color: '#fff' }}>$242</span>
                  <span style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.02em', color: 'rgba(255,255,255,0.25)', lineHeight: 1 }}>.8k</span>
                </div>
              </div>

              {/* Trend badge */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{
                  background: 'rgba(16,185,129,0.13)', border: '1px solid rgba(16,185,129,0.3)',
                }}>
                  <TrendingUp size={9} style={{ color: '#10b981' }} />
                  <span style={{ fontSize: 10, fontWeight: 900, color: '#10b981' }}>+12.4%</span>
                </div>
                <span style={{ fontSize: 8.5, fontWeight: 700, color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>this week</span>
              </div>

              {/* Sparkline */}
              <div className="mb-4" style={{ marginLeft: -4, marginRight: -4 }}>
                <Sparkline />
              </div>

              {/* Bottom row */}
              <div className="flex justify-between items-center">
                <div>
                  <p style={{ fontSize: 7, fontWeight: 900, letterSpacing: '0.25em', color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase', marginBottom: 2 }}>ID Hash</p>
                  <p style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 600, color: 'rgba(255,255,255,0.45)' }}>0x71C...3a21</p>
                </div>
                <div className="flex" style={{ gap: -8 }}>
                  {['#1a56db', '#7c3aed'].map((c, i) => (
                    <div key={i} className="w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ background: c, border: '2px solid rgba(0,0,0,0.5)', marginLeft: i > 0 ? -8 : 0, opacity: 0.75 }}>
                      {i === 0 && <Globe size={11} style={{ color: 'rgba(255,255,255,0.7)' }} />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── QUICK STATS ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex gap-2.5 mb-6">
          <Chip label="Total In"  value="+$5.8k" color="#10b981" />
          <Chip label="Total Out" value="-$1.3k" color="#f87171" />
          <Chip label="Pending"   value="2 txns" color="#fbbf24" />
        </motion.div>

        {/* ── ACTIONS ── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.13 }}
          className="grid grid-cols-4 gap-2 mb-8">
          {[
            { label: 'Send',    Icon: ArrowUpRight,  primary: true,  fn: () => go('send') },
            { label: 'Receive', Icon: ArrowDownLeft, primary: false, fn: () => {} },
            { label: 'Add',     Icon: Plus,          primary: false, fn: () => {} },
            { label: 'Scan',    Icon: QrCode,        primary: false, fn: () => {} },
          ].map(({ label, Icon, primary, fn }) => (
            <motion.button key={label} whileTap={TRANSITION.tap} onClick={fn} className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={
                primary
                  ? { background: '#ffffff', boxShadow: '0 8px 28px rgba(255,255,255,0.12)' }
                  : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }
              }>
                <Icon size={21} strokeWidth={2.5} style={{ color: primary ? '#000' : 'rgba(255,255,255,0.45)' }} />
              </div>
              <span style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em',
                color: primary ? '#fff' : 'rgba(255,255,255,0.3)' }}>{label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* ── CIRCLE ── */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <p style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase' }}>Circle</p>
            <Users size={14} style={{ color: 'rgba(255,255,255,0.18)' }} />
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar" style={{ marginLeft: -4, paddingLeft: 4, paddingRight: 4 }}>
            {FRIENDS.map((f, i) => (
              <motion.div key={f.id}
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.18 + i * 0.06 }}
                whileTap={TRANSITION.tap} className="flex flex-col items-center gap-2 shrink-0">
                <div className="relative">
                  <div style={f.status === 'active'
                    ? { padding: 2, borderRadius: 24, background: 'linear-gradient(135deg, #10b981, #7c3aed)' }
                    : { padding: 2, borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)' }}>
                    <img src={f.img} className="block object-cover" alt={f.name}
                      style={{ width: 56, height: 56, borderRadius: 22 }} />
                  </div>
                  {f.status === 'active' && (
                    <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }}
                      className="absolute flex items-center justify-center"
                      style={{ bottom: -4, right: -4, width: 16, height: 16, borderRadius: '50%',
                        background: '#7c3aed', border: '2px solid #080810', boxShadow: '0 0 8px rgba(124,58,237,0.7)' }}>
                      <Zap size={7} className="fill-white text-white" />
                    </motion.div>
                  )}
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.35)' }}>{f.name}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── RECENT PULSE ── */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <p style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase' }}>Recent Pulse</p>
            <motion.button whileTap={TRANSITION.tap}
              style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.1em', color: '#a78bfa', textTransform: 'uppercase' }}>
              See all
            </motion.button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ACTIVITY.map((item, i) => (
              <motion.div key={item.id}
                initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.22 + i * 0.07 }}
                whileTap={TRANSITION.tap}
                className="flex items-center gap-3 rounded-[22px]"
                style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="relative shrink-0 rounded-2xl overflow-hidden" style={{ width: 48, height: 48 }}>
                  <img src={item.img} className="w-full h-full object-cover" alt={item.merchant} />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,rgba(0,0,0,0.15),rgba(0,0,0,0.38))' }} />
                  <div className="absolute flex items-center justify-center"
                    style={{ bottom: 3, right: 3, width: 15, height: 15, borderRadius: '50%',
                      background: item.type === 'in' ? 'rgba(16,185,129,0.9)' : 'rgba(0,0,0,0.65)' }}>
                    {item.type === 'out'
                      ? <ArrowUpRight size={8} style={{ color: '#fff' }} />
                      : <ArrowDownLeft size={8} style={{ color: '#fff' }} />}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center" style={{ marginBottom: 4 }}>
                    <p style={{ fontSize: 14.5, fontWeight: 900, letterSpacing: '-0.02em', color: '#fff' }} className="truncate">{item.merchant}</p>
                    <p style={{ fontSize: 14.5, fontWeight: 900, marginLeft: 8, flexShrink: 0,
                      color: item.type === 'in' ? '#10b981' : '#fff' }}>
                      {item.type === 'in' ? '+' : '-'}${item.amount}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: 8, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em',
                      padding: '1px 7px', borderRadius: 99,
                      background: `${item.catColor}1a`, color: item.catColor, border: `1px solid ${item.catColor}40` }}>
                      {item.category}
                    </span>
                    <span style={{ fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.25)' }}>{item.location} · {item.date}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ── ACTIVITY ─────────────────────────────────────────────────────────────
  const Activity_ = () => (
    <div className="flex flex-col h-full w-full">
      <header className="px-5 pt-14 pb-4 z-50">
        <p style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.38em', color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', marginBottom: 3 }}>Overview</p>
        <p style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.04em' }}>Activity</p>
      </header>
      <div className="flex-1 overflow-y-auto pb-28 no-scrollbar z-10 px-5">
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
          {['All','Income','Expenses','Pending'].map((f, i) => (
            <motion.button key={f} whileTap={TRANSITION.tap}
              className="shrink-0 px-4 py-1.5 rounded-full"
              style={i === 0
                ? { background: '#fff', color: '#000', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }
                : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.07)',
                    fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {f}
            </motion.button>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ACTIVITY.map((item, i) => (
            <motion.div key={item.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              whileTap={TRANSITION.tap}
              className="flex items-center gap-3 rounded-[22px]"
              style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="shrink-0 rounded-2xl overflow-hidden" style={{ width: 50, height: 50 }}>
                <img src={item.img} className="w-full h-full object-cover" alt={item.merchant} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center" style={{ marginBottom: 5 }}>
                  <p style={{ fontSize: 15, fontWeight: 900, letterSpacing: '-0.02em' }}>{item.merchant}</p>
                  <p style={{ fontSize: 15, fontWeight: 900, color: item.type === 'in' ? '#10b981' : '#fff' }}>
                    {item.type === 'in' ? '+' : '-'}${item.amount}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: 8, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em',
                    padding: '2px 7px', borderRadius: 99,
                    background: `${item.catColor}1a`, color: item.catColor }}>
                    {item.category}
                  </span>
                  <span style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.28)', fontWeight: 600 }}>{item.location} · {item.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── PROFILE ───────────────────────────────────────────────────────────────
  const Profile_ = () => (
    <div className="flex flex-col h-full w-full">
      <header className="px-5 pt-14 pb-4 z-50">
        <p style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.38em', color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', marginBottom: 3 }}>Account</p>
        <p style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.04em' }}>Profile</p>
      </header>
      <div className="flex-1 overflow-y-auto pb-28 no-scrollbar z-10 px-5 flex flex-col items-center pt-6">
        <div className="rounded-[32px] overflow-hidden mb-4" style={{ width: 90, height: 90, border: '2.5px solid rgba(124,58,237,0.55)' }}>
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Elias" className="w-full h-full" alt="Profile" />
        </div>
        <p style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 4 }}>Elias Vance</p>
        <p style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 28 }}>0x71C...3a21</p>
        {[
          { label: 'Verified Identity', value: 'KYC Level 2', color: '#10b981' },
          { label: 'Network Tier',      value: 'Signature v2', color: '#a78bfa' },
          { label: 'Total Settled',     value: '$48,200',       color: '#60a5fa' },
          { label: 'Circle Members',    value: '4 active',      color: '#fbbf24' },
        ].map(row => (
          <div key={row.label} className="w-full flex justify-between items-center rounded-[18px] mb-2.5"
            style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{row.label}</span>
            <span style={{ fontSize: 13, fontWeight: 900, color: row.color }}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // ── SEND ──────────────────────────────────────────────────────────────────
  const Send_ = () => (
    <div className="flex flex-col h-full w-full">
      <header className="px-5 pt-14 pb-3 flex items-center gap-4 z-50">
        <motion.button whileTap={TRANSITION.tap} onClick={() => go('home')} style={{ padding: 4 }}>
          <ArrowLeft size={22} strokeWidth={2.5} />
        </motion.button>
        <p style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.38em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>New Settlement</p>
      </header>
      <div className="flex-1 px-6 pt-4 flex flex-col items-center z-10">
        {/* Recipient chips */}
        <div className="w-full flex gap-2.5 overflow-x-auto no-scrollbar mb-8">
          {FRIENDS.slice(0, 3).map(f => (
            <motion.div key={f.id} whileTap={TRANSITION.tap}
              className="shrink-0 flex items-center gap-2 rounded-2xl"
              style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <img src={f.img} alt={f.name} style={{ width: 24, height: 24, borderRadius: 8, objectFit: 'cover', display: 'block' }} />
              <span style={{ fontSize: 11, fontWeight: 900, color: 'rgba(255,255,255,0.5)' }}>{f.name}</span>
            </motion.div>
          ))}
        </div>

        <p style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.38em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', marginBottom: 20 }}>Amount</p>
        <div className="flex items-baseline justify-center" style={{ marginBottom: 36 }}>
          <span style={{ fontSize: 44, fontWeight: 900, letterSpacing: '-0.04em', color: 'rgba(255,255,255,0.22)', marginRight: 10 }}>$</span>
          <motion.span key={amount} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            style={{ fontSize: 88, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1 }}>
            {amount}
          </motion.span>
        </div>

        <div className="grid grid-cols-3 mb-8" style={{ gap: '12px 32px', maxWidth: 280, width: '100%' }}>
          {['1','2','3','4','5','6','7','8','9','•','0','delete'].map(k => (
            <motion.button key={k} whileTap={TRANSITION.tap} onClick={() => key(k)}
              className="flex items-center justify-center"
              style={{ height: 56, fontSize: 30, fontWeight: 900, color: 'rgba(255,255,255,0.8)' }}>
              {k === 'delete' ? <ArrowLeft size={26} strokeWidth={2.5} /> : k === '•' ? '.' : k}
            </motion.button>
          ))}
        </div>

        <motion.button whileTap={TRANSITION.tap} disabled={amount === '0'} onClick={() => go('success')}
          className="w-full flex items-center justify-center gap-3"
          style={{
            height: 76, borderRadius: 32, fontSize: 18, fontWeight: 900,
            ...(amount !== '0'
              ? { background: '#fff', color: '#000', boxShadow: '0 16px 48px rgba(255,255,255,0.09)' }
              : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.07)' })
          }}>
          Sign with BioID <Fingerprint size={24} />
        </motion.button>
      </div>
    </div>
  );

  // ── SUCCESS ───────────────────────────────────────────────────────────────
  const Success_ = () => (
    <div className="h-full w-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: '#06060e', padding: 40, textAlign: 'center' }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 50% 38%, rgba(16,185,129,0.12) 0%, rgba(124,58,237,0.08) 40%, transparent 70%)'
      }} />
      <motion.div
        initial={{ scale: 0.4, rotate: -15, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={TRANSITION.bounce}
        className="flex items-center justify-center z-10"
        style={{
          width: 140, height: 140, borderRadius: 48, marginBottom: 36,
          background: 'linear-gradient(135deg, #059669 0%, #7c3aed 100%)',
          boxShadow: '0 0 60px rgba(16,185,129,0.28), 0 0 100px rgba(124,58,237,0.18)',
        }}>
        <CheckCircle2 size={68} strokeWidth={2.5} style={{ color: '#fff' }} />
      </motion.div>

      <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}
        style={{ fontSize: 60, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 10, zIndex: 1 }}>
        Done.
      </motion.p>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
        style={{ fontSize: 18, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em',
          color: 'rgba(255,255,255,0.28)', marginBottom: 60, zIndex: 1 }}>
        Settled ${amount}
      </motion.p>
      <motion.button
        whileTap={TRANSITION.tap}
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        onClick={() => { setAmount('0'); go('home'); }}
        className="w-full z-10"
        style={{ height: 76, borderRadius: 32, fontSize: 17, fontWeight: 900,
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
          color: 'rgba(255,255,255,0.45)' }}>
        Back to Home
      </motion.button>
    </div>
  );

  const showNav = screen !== 'success';

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center font-sans antialiased text-white overflow-hidden">
      <div className="relative w-full h-full max-w-[430px] mx-auto overflow-hidden" style={{ background: '#080810' }}>
        <AmbientGlow />

        {/* Status bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-7 z-[100] pointer-events-none"
          style={{ height: 46, opacity: 0.32 }}>
          <span style={{ fontSize: 14, fontWeight: 900, letterSpacing: '-0.04em' }}>9:41</span>
          <div style={{ width: 20, height: 10, border: '2px solid rgba(255,255,255,0.7)', borderRadius: 3 }} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={screen}
            initial={{ opacity: 0, x: screen === 'success' ? 0 : 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: screen === 'success' ? 0 : -18 }}
            transition={{ duration: 0.27, ease: [0.25, 0.1, 0.25, 1] }}
            className="h-full w-full">
            {screen === 'home'     && <Home_ />}
            {screen === 'activity' && <Activity_ />}
            {screen === 'send'     && <Send_ />}
            {screen === 'profile'  && <Profile_ />}
            {screen === 'success'  && <Success_ />}
          </motion.div>
        </AnimatePresence>

        {showNav && <BottomNav active={tab} onChange={handleTab} />}

        <div className="absolute left-1/2 -translate-x-1/2 z-[300]"
          style={{ bottom: 8, width: 110, height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.1)' }} />
      </div>
    </div>
  );
}
