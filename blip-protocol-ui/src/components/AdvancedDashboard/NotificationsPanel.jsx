import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  generateNotifications,
  generateNotification,
  generateMessages,
  generateMessage,
} from '@/utils/liveDataGenerator';

// ── Notification Item ────────────────────────────────────────────────────────
function NotificationItem({ notification, index }) {
  const typeIcons = {
    trade: '⇄',
    market: '📊',
    completion: '✓',
    alert: '⚠',
    escrow: '🔐',
    lp: '◎',
    withdrawal: '↑',
    system: '⚙',
    message: '💬',
  };

  const typeColors = {
    trade: 'bg-green-500/10 text-green-400 ring-green-500/20',
    market: 'bg-blue-500/10 text-blue-400 ring-blue-500/20',
    completion: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20',
    alert: 'bg-orange-500/10 text-orange-400 ring-orange-500/20',
    escrow: 'bg-purple-500/10 text-purple-400 ring-purple-500/20',
    lp: 'bg-cyan-500/10 text-cyan-400 ring-cyan-500/20',
    withdrawal: 'bg-yellow-500/10 text-yellow-400 ring-yellow-500/20',
    system: 'bg-white/5 text-white/40 ring-white/10',
    message: 'bg-indigo-500/10 text-indigo-400 ring-indigo-500/20',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 15, height: 0 }}
      animate={{ opacity: 1, x: 0, height: 'auto' }}
      exit={{ opacity: 0, x: -10, height: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`flex items-start gap-3 p-3 rounded-xl transition-colors cursor-pointer ${
        !notification.read
          ? 'bg-white/[0.02] hover:bg-white/[0.04]'
          : 'hover:bg-white/[0.02]'
      }`}
    >
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] ring-1 flex-shrink-0 ${
        typeColors[notification.type] || typeColors.system
      }`}>
        {typeIcons[notification.type] || '•'}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-[11px] leading-relaxed ${
          !notification.read ? 'text-white/60' : 'text-white/30'
        }`}>
          {notification.text}
        </p>
        <p className="text-[9px] text-white/15 mt-1 font-mono">{notification.time}</p>
      </div>
      {!notification.read && (
        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
      )}
    </motion.div>
  );
}

// ── Message Item ─────────────────────────────────────────────────────────────
function MessageItem({ message }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer"
    >
      <div className="relative flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center text-[11px] font-bold text-white/30 ring-1 ring-white/[0.08]">
          {message.user.charAt(0)}
        </div>
        {message.online && (
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-[#0a0a0a]" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className={`text-[11px] font-semibold ${
            message.unread ? 'text-white/70' : 'text-white/30'
          }`}>
            {message.user}
          </span>
          <span className="text-[9px] text-white/15 font-mono">{message.time}</span>
        </div>
        <p className={`text-[10px] mt-0.5 truncate ${
          message.unread ? 'text-white/40' : 'text-white/20'
        }`}>
          {message.text}
        </p>
      </div>
      {message.unread && (
        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
      )}
    </motion.div>
  );
}

// ── Status Toggle ────────────────────────────────────────────────────────────
function StatusIndicator() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.85) setOnline(prev => !prev);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <button
      onClick={() => setOnline(!online)}
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${
        online
          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
          : 'bg-white/5 text-white/30 border border-white/[0.08]'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${online ? 'bg-green-500' : 'bg-white/20'}`} />
      {online ? 'Online' : 'Offline'}
    </button>
  );
}

// ── Notifications Panel ──────────────────────────────────────────────────────
export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState(() => generateNotifications(4));
  const [messages, setMessages] = useState(() => generateMessages(3));
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(3);

  // Auto-add notifications
  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications(prev => {
        const next = [generateNotification(), ...prev];
        return next.slice(0, 12);
      });
      setUnreadCount(prev => prev + 1);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  // Auto-add messages
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        setMessages(prev => {
          const next = [generateMessage(), ...prev];
          return next.slice(0, 8);
        });
      }
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex flex-col h-full gap-3"
    >
      {/* Notifications */}
      <div className="flex-1 bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl overflow-hidden flex flex-col">
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white/60 uppercase tracking-wider">Notifications</span>
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 min-w-[18px] text-center"
                >
                  {unreadCount}
                </motion.span>
              )}
            </div>
            <StatusIndicator />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-0.5 scrollbar-thin scrollbar-thumb-white/10">
          <AnimatePresence mode="popLayout">
            {notifications.map((notif, i) => (
              <NotificationItem key={notif.id} notification={notif} index={i} />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Messages */}
      <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl overflow-hidden flex flex-col" style={{ minHeight: '200px' }}>
        <div className="px-4 pt-3 pb-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-white/30">◯</span>
              <span className="text-xs font-bold text-white/50 uppercase tracking-wider">Messages</span>
            </div>
            {messages.filter(m => m.unread).length > 0 && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white/5 text-white/30 border border-white/[0.08]">
                {messages.filter(m => m.unread).length} new
              </span>
            )}
          </div>

          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/15" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg pl-9 pr-3 py-1.5 text-[11px] text-white placeholder-white/15 focus:outline-none focus:border-white/10 transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-3 scrollbar-thin scrollbar-thumb-white/10">
          <AnimatePresence mode="popLayout">
            {messages.length > 0 ? (
              messages.map(msg => (
                <MessageItem key={msg.id} message={msg} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="text-lg opacity-15 mb-1">💬</div>
                <p className="text-[10px] text-white/20">No messages yet</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
