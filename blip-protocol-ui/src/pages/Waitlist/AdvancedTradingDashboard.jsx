import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TradePanel from '@/components/AdvancedDashboard/TradePanel';
import OrdersPanel from '@/components/AdvancedDashboard/OrdersPanel';
import Leaderboard from '@/components/AdvancedDashboard/Leaderboard';
import NotificationsPanel from '@/components/AdvancedDashboard/NotificationsPanel';

// ── Header Nav ───────────────────────────────────────────────────────────────
function DashboardHeader({ activeTab, setActiveTab, user }) {
  const tabs = ['Dashboard', 'Analytics', 'Wallet', 'Settings'];

  return (
    <header className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-[#060606]/90 backdrop-blur-xl sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-[0_0_15px_rgba(255,107,53,0.3)]">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-sm font-bold text-white tracking-tight">
            Blip <span className="text-white/40 font-normal italic">money</span>
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] rounded-xl p-1 border border-white/[0.06]">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`relative px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === tab.toLowerCase()
                ? 'text-white'
                : 'text-white/30 hover:text-white/50'
            }`}
          >
            {activeTab === tab.toLowerCase() && (
              <motion.div
                layoutId="activeNavTab"
                className="absolute inset-0 bg-white/10 rounded-lg border border-white/[0.08]"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative z-10">{tab}</span>
          </button>
        ))}
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* Quick action buttons */}
        <div className="hidden lg:flex items-center gap-1.5">
          <button className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:border-white/10 transition-colors group">
            <svg className="w-4 h-4 text-white/25 group-hover:text-white/50 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:border-white/10 transition-colors group relative">
            <svg className="w-4 h-4 text-white/25 group-hover:text-white/50 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:border-white/10 transition-colors group relative">
            <svg className="w-4 h-4 text-white/25 group-hover:text-white/50 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-orange-500" />
          </button>
        </div>

        {/* User */}
        <div className="flex items-center gap-2 pl-3 border-l border-white/[0.06]">
          <div className="w-7 h-7 rounded-full bg-white/[0.05] flex items-center justify-center text-[10px] font-bold text-white/30 ring-1 ring-white/[0.08]">
            {user?.charAt(0) || 'U'}
          </div>
          <span className="text-xs text-white/40 font-medium hidden sm:block">{user || 'User'}</span>
        </div>
      </div>
    </header>
  );
}

// ── Mobile Tab Switcher ──────────────────────────────────────────────────────
function MobileTabSwitcher({ activePanel, setActivePanel }) {
  const panels = [
    { key: 'trade', label: 'Trade', icon: '⇄' },
    { key: 'orders', label: 'Orders', icon: '📋' },
    { key: 'leaderboard', label: 'Leaders', icon: '🏆' },
    { key: 'notifications', label: 'Alerts', icon: '🔔' },
  ];

  return (
    <div className="lg:hidden flex items-center gap-1 px-4 py-2 bg-[#060606]/90 backdrop-blur-xl border-b border-white/[0.06] overflow-x-auto scrollbar-none">
      {panels.map(panel => (
        <button
          key={panel.key}
          onClick={() => setActivePanel(panel.key)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all ${
            activePanel === panel.key
              ? 'bg-white/10 text-white border border-white/[0.1]'
              : 'text-white/25 hover:text-white/40'
          }`}
        >
          <span>{panel.icon}</span>
          {panel.label}
        </button>
      ))}
    </div>
  );
}

// ── Main Dashboard ───────────────────────────────────────────────────────────
export default function AdvancedTradingDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activePanel, setActivePanel] = useState('trade');
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  // Update clock
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#060606] text-white overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/[0.02] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/[0.015] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col h-screen">
        <DashboardHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user="jojo2"
        />

        <MobileTabSwitcher activePanel={activePanel} setActivePanel={setActivePanel} />

        {/* Main Grid */}
        <div className="flex-1 overflow-hidden">
          {/* Desktop: 4-column grid */}
          <div className="hidden lg:grid grid-cols-[280px_1fr_300px_280px] gap-3 p-3 h-full">
            <TradePanel />
            <OrdersPanel />
            <Leaderboard />
            <NotificationsPanel />
          </div>

          {/* Tablet: 2-column grid */}
          <div className="hidden md:grid lg:hidden grid-cols-2 gap-3 p-3 h-full overflow-y-auto">
            <TradePanel />
            <OrdersPanel />
            <Leaderboard />
            <NotificationsPanel />
          </div>

          {/* Mobile: Single panel with switcher */}
          <div className="md:hidden p-3 h-full overflow-y-auto">
            {activePanel === 'trade' && <TradePanel />}
            {activePanel === 'orders' && <OrdersPanel />}
            {activePanel === 'leaderboard' && <Leaderboard />}
            {activePanel === 'notifications' && <NotificationsPanel />}
          </div>
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between px-5 py-2 border-t border-white/[0.04] bg-[#060606]/90 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
              </span>
              <span className="text-[9px] text-green-400/60 font-medium">Connected</span>
            </div>
            <span className="text-[9px] text-white/15 font-mono">
              Latency: {Math.floor(Math.random() * 30 + 10)}ms
            </span>
            <span className="text-[9px] text-white/15 font-mono">
              Block: #{(19847523 + Math.floor(Math.random() * 100)).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[9px] text-white/15 font-mono">
              {currentTime.toLocaleTimeString('en-US', { hour12: false })} UTC
            </span>
            <span className="text-[9px] text-white/10">v2.4.0-beta</span>
          </div>
        </div>
      </div>
    </div>
  );
}
