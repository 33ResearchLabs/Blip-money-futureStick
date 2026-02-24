import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  generateLeaderboard,
  generateActivities,
  generateActivity,
  formatNumber,
} from '@/utils/liveDataGenerator';

// ── Badge Icon ───────────────────────────────────────────────────────────────
function BadgeIcon({ badge }) {
  const colors = {
    diamond: 'text-cyan-400',
    gold: 'text-yellow-400',
    silver: 'text-gray-400',
    bronze: 'text-orange-700',
  };
  const symbols = { diamond: '◆', gold: '★', silver: '☆', bronze: '●' };
  return (
    <span className={`text-[9px] ${colors[badge] || 'text-white/20'}`}>
      {symbols[badge] || '●'}
    </span>
  );
}

// ── Rank Number ──────────────────────────────────────────────────────────────
function RankDisplay({ rank }) {
  const colors = {
    1: 'text-yellow-400 bg-yellow-400/10 ring-yellow-400/20',
    2: 'text-gray-300 bg-gray-300/10 ring-gray-300/20',
    3: 'text-orange-600 bg-orange-600/10 ring-orange-600/20',
  };
  const style = colors[rank] || 'text-white/20 bg-white/[0.03] ring-white/[0.06]';

  return (
    <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold ring-1 ${style}`}>
      {rank}
    </div>
  );
}

// ── Leaderboard Entry ────────────────────────────────────────────────────────
function LeaderboardEntry({ entry, index }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="group flex items-center gap-3 py-2 px-2 -mx-2 rounded-lg hover:bg-white/[0.03] transition-colors cursor-pointer"
    >
      <RankDisplay rank={entry.rank} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-white/70 truncate">{entry.name}</span>
          <BadgeIcon badge={entry.badge} />
          {entry.online && (
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
          )}
        </div>
        <span className="text-[9px] text-white/20 font-mono">{entry.trades}t</span>
      </div>

      <div className="text-right flex-shrink-0">
        <p className="text-xs font-semibold text-white/50 font-mono">
          {formatNumber(entry.volume)}
        </p>
        <div className="flex items-center justify-end gap-1">
          <span className="text-[9px] text-orange-400/60">★</span>
          <span className="text-[9px] text-white/30 font-mono">{entry.rating}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Activity Entry ───────────────────────────────────────────────────────────
function ActivityEntry({ activity }) {
  const statusColors = {
    done: 'text-green-400 bg-green-400/10',
    pending: 'text-yellow-400 bg-yellow-400/10',
    failed: 'text-red-400 bg-red-400/10',
  };
  const typeIcons = {
    trade: '⇄',
    deposit: '↓',
    withdrawal: '↑',
    escrow: '🔒',
    lp: '◎',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex items-center gap-3 py-2 px-2 -mx-2 rounded-lg hover:bg-white/[0.03] transition-colors"
    >
      <div className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center text-[11px] border border-white/[0.06]">
        {typeIcons[activity.type] || '•'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-white/50 font-medium truncate">{activity.description}</p>
        <p className="text-[9px] text-white/20 font-mono">{activity.time}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-[11px] font-mono text-white/40">
          {activity.amount.toLocaleString()} {activity.currency}
        </p>
        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${statusColors[activity.status] || ''}`}>
          {activity.status}
        </span>
      </div>
    </motion.div>
  );
}

// ── Leaderboard Panel ────────────────────────────────────────────────────────
export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState(() => generateLeaderboard(9));
  const [activities, setActivities] = useState(() => generateActivities(5));
  const [lbTab, setLbTab] = useState('volume');
  const [actTab, setActTab] = useState('txns');
  const [lastUpdate, setLastUpdate] = useState('just now');

  const lbTabs = [
    { key: 'volume', label: 'Volume' },
    { key: 'rated', label: 'Rated' },
    { key: 'rep', label: 'Rep' },
  ];

  const actTabs = [
    { key: 'txns', label: 'Txns' },
    { key: 'done', label: 'Done' },
    { key: 'failed', label: 'Failed' },
    { key: 'open', label: 'Open' },
  ];

  // Auto-update leaderboard
  useEffect(() => {
    const interval = setInterval(() => {
      setLeaderboard(prev => {
        const updated = prev.map(entry => ({
          ...entry,
          volume: entry.volume + Math.floor((Math.random() - 0.3) * 5000),
          trades: entry.trades + (Math.random() > 0.6 ? 1 : 0),
          online: Math.random() > 0.3,
        }));

        if (lbTab === 'volume') {
          return updated.sort((a, b) => b.volume - a.volume).map((e, i) => ({ ...e, rank: i + 1 }));
        }
        if (lbTab === 'rated') {
          return updated.sort((a, b) => b.rating - a.rating).map((e, i) => ({ ...e, rank: i + 1 }));
        }
        return updated.sort((a, b) => b.trades - a.trades).map((e, i) => ({ ...e, rank: i + 1 }));
      });
      setLastUpdate('just now');
    }, 5000);
    return () => clearInterval(interval);
  }, [lbTab]);

  // Age the "last update" text
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(prev => {
        if (prev === 'just now') return '1m ago';
        const match = prev.match(/(\d+)m ago/);
        if (match) return `${parseInt(match[1]) + 1}m ago`;
        return prev;
      });
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Auto-update activities
  useEffect(() => {
    const interval = setInterval(() => {
      setActivities(prev => {
        const next = [generateActivity(), ...prev];
        return next.slice(0, 8);
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredActivities = activities.filter(a => {
    if (actTab === 'txns') return true;
    return a.status === actTab;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col h-full gap-3"
    >
      {/* Leaderboard */}
      <div className="flex-1 bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl overflow-hidden flex flex-col">
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-white/70 uppercase tracking-wider">Leaderboard</span>
            <div className="flex items-center gap-0.5 bg-white/[0.03] rounded-lg p-0.5 border border-white/[0.06]">
              {lbTabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setLbTab(tab.key)}
                  className={`text-[10px] font-semibold px-2.5 py-1 rounded-md transition-all ${
                    lbTab === tab.key
                      ? 'bg-white/10 text-white shadow-sm'
                      : 'text-white/30 hover:text-white/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-thin scrollbar-thumb-white/10">
          <AnimatePresence mode="popLayout">
            {leaderboard.map((entry, i) => (
              <LeaderboardEntry key={entry.name + entry.rank} entry={entry} index={i} />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Activity */}
      <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl overflow-hidden flex flex-col" style={{ minHeight: '220px' }}>
        <div className="px-4 pt-3 pb-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/30">◎</span>
              <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Activity</span>
            </div>
            <div className="flex items-center gap-0.5 bg-white/[0.03] rounded-lg p-0.5 border border-white/[0.06]">
              {actTabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActTab(tab.key)}
                  className={`text-[10px] font-medium px-2 py-1 rounded-md transition-all ${
                    actTab === tab.key
                      ? 'bg-white/10 text-white'
                      : 'text-white/25 hover:text-white/40'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-white/15">Updated {lastUpdate}</span>
            <button
              onClick={() => setActivities(generateActivities(5))}
              className="p-1 rounded hover:bg-white/5 transition-colors"
            >
              <svg className="w-3 h-3 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-3 scrollbar-thin scrollbar-thumb-white/10">
          <AnimatePresence mode="popLayout">
            {filteredActivities.length > 0 ? (
              filteredActivities.map(activity => (
                <ActivityEntry key={activity.id} activity={activity} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="text-lg opacity-15 mb-1">↗</div>
                <p className="text-[10px] text-white/20">No transactions yet</p>
                <p className="text-[9px] text-white/10">Ledger entries appear after your first trade</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
