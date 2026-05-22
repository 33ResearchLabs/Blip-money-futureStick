import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeftRight,
  ArrowUpFromLine,
  ArrowDownToLine,
  Lock,
  Search,
  Radio,
  Activity,
  ChevronDown,
  ChevronRight,
  Crown,
  Bell,
  History,
  Plus,
  Bug,
  Star,
  Shield,
  CheckCircle2,
  RotateCcw,
  Filter,
  Clock,
  MessageSquare,
  AlertCircle,
} from "lucide-react";

/* ============================================
   LIVE MERCHANT DASHBOARD — Homepage showcase
   ────────────────────────────────────────────
   Exact replica of the production merchant
   console, scripted with live data so the
   landing page reads as a working panel.

     • useMerchantDashboardState() — headless hook
     • <MerchantDashboardBody/>   — top nav + 5-pane grid (chrome-less),
                                    drop into any existing browser frame
     • <LiveMerchantDashboard/>   — standalone section w/ frame + header
   ============================================ */

const AVATARS = ["🐢", "🦊", "🐼", "🦁", "🐯", "🐸", "🐻", "🦄", "🐧", "🦉"];

const FIRST_NAMES = [
  "John",
  "zoro",
  "Zayn Khan",
  "Drako",
  "Hulk",
  "Craig Mo",
  "Zooo",
  "shubham",
  "Mira",
  "Tariq",
  "Nora",
  "Ravi",
];

export type Order = {
  id: string;
  user: string;
  avatar: string;
  side: "BUY" | "SELL";
  amount: number;
  fiat: "INR" | "AED";
  price: number;
  age: number;
};

export type ActiveTrade = {
  id: string;
  user: string;
  avatar: string;
  side: "BUY" | "SELL";
  amount: number;
  fiat: "INR" | "AED";
  status: "ACCEPTED" | "ESCROWED" | "PAID";
  progress: number;
  ttl: number;
};

export type ActivityEvent = {
  id: string;
  type: "order" | "settle" | "claim" | "release";
  msg: string;
  detail: string;
  amount: string;
  ts: string;
};

export type Notification = {
  id: string;
  kind: "order_new" | "order_accepted" | "escrow_locked" | "payment_received" | "trade_settled" | "system";
  title: string;
  body: string;
  ts: string;
  read: boolean;
};

export type ChatMessage = {
  id: string;
  from: "me" | "them";
  text: string;
  ts: string;
};

export type ChatThread = {
  orderId: string;
  user: string;
  avatar: string;
  side: "BUY" | "SELL";
  amount: number;
  fiat: "INR" | "AED";
  unread: number;
  isTyping: boolean;
  isOnline: boolean;
  messages: ChatMessage[];
};

let __orderSeq = 26050800;
function nextOrderId() {
  __orderSeq += 1;
  return `BM-${__orderSeq.toString(36).toUpperCase().slice(-7)}`;
}
function rand<T>(arr: readonly T[] | T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeOrder(): Order {
  const side: "BUY" | "SELL" = Math.random() > 0.5 ? "BUY" : "SELL";
  const fiat: "INR" | "AED" = Math.random() > 0.45 ? "INR" : "AED";
  const amount = Math.floor(50 + Math.random() * 4950);
  const basePrice = fiat === "INR" ? 95 : 3.67;
  const price = +(basePrice * (1 + (Math.random() - 0.5) * 0.04)).toFixed(2);
  return {
    id: nextOrderId(),
    user: rand(FIRST_NAMES),
    avatar: rand(AVATARS),
    side,
    amount,
    fiat,
    price,
    age: 0,
  };
}

function seedPending(): Order[] {
  return Array.from({ length: 3 }, makeOrder);
}

function seedActive(): ActiveTrade[] {
  return [
    {
      id: "F8421X",
      user: "Mira",
      avatar: "🦊",
      side: "BUY",
      amount: 1250,
      fiat: "INR",
      status: "ESCROWED",
      progress: 0.5,
      ttl: 4480,
    },
    {
      id: "F8419Q",
      user: "Tariq",
      avatar: "🐯",
      side: "SELL",
      amount: 780,
      fiat: "AED",
      status: "PAID",
      progress: 0.78,
      ttl: 3120,
    },
  ];
}

function seedActivity(): ActivityEvent[] {
  return [
    {
      id: "seed-1",
      type: "order",
      msg: "Order Cancelled",
      detail: "#BM-260508-F857 · open...",
      amount: "10.00 USDT",
      ts: "8 May",
    },
  ];
}

function seedNotifications(): Notification[] {
  return [
    {
      id: "n-welcome",
      kind: "system",
      title: "Welcome back!",
      body: "You are now online and accepting orders.",
      ts: "now",
      read: false,
    },
  ];
}

const COUNTERPARTY_LINES = [
  "Hey, ready to start the trade?",
  "Payment sent via UPI, can you confirm?",
  "I've shared the bank details — please check.",
  "Sending now, give me 2 mins.",
  "Got the receipt, releasing escrow soon.",
  "Thanks — fastest trade today.",
  "Can you bump the priority fee?",
  "Marking paid now, see chat.",
];

const MY_LINES = [
  "Sure, locking escrow now.",
  "Got it. Releasing once I see the bank credit.",
  "Confirmed receipt — releasing.",
  "Take your time, no rush.",
  "Done. Funds released ✓",
  "Sharing UPI details now.",
];

let __chatSeq = 0;
function nextChatMsgId() {
  __chatSeq += 1;
  return `cm-${__chatSeq}`;
}

function seedChatThreads(): ChatThread[] {
  return [
    {
      orderId: "F8421X",
      user: "Mira",
      avatar: "🦊",
      side: "BUY",
      amount: 1250,
      fiat: "INR",
      unread: 2,
      isTyping: false,
      isOnline: true,
      messages: [
        { id: nextChatMsgId(), from: "them", text: "Hey, ready to start the trade?", ts: "14:32" },
        { id: nextChatMsgId(), from: "me", text: "Sure, locking escrow now.", ts: "14:32" },
        { id: nextChatMsgId(), from: "them", text: "Sending UPI now, give me 2 mins.", ts: "14:33" },
      ],
    },
    {
      orderId: "F8419Q",
      user: "Tariq",
      avatar: "🐯",
      side: "SELL",
      amount: 780,
      fiat: "AED",
      unread: 0,
      isTyping: false,
      isOnline: false,
      messages: [
        { id: nextChatMsgId(), from: "them", text: "Got the receipt, releasing escrow soon.", ts: "14:18" },
        { id: nextChatMsgId(), from: "me", text: "Confirmed receipt — releasing.", ts: "14:19" },
      ],
    },
  ];
}

function relTs(_offset: number) {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, "0")}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
}

function fmtTTL(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m ${sec.toString().padStart(2, "0")}s`;
}

/* ───────────────────────── Headless hook ───────────────────────── */

export function useMerchantDashboardState() {
  const [pendingOrders, setPendingOrders] = useState<Order[]>(() => seedPending());
  const [activeTrades, setActiveTrades] = useState<ActiveTrade[]>(() => seedActive());
  const [activity, setActivity] = useState<ActivityEvent[]>(() => seedActivity());
  const [notifications, setNotifications] = useState<Notification[]>(() => seedNotifications());
  const [chatThreads, setChatThreads] = useState<ChatThread[]>(() => seedChatThreads());
  const [activeChatId, setActiveChatId] = useState<string | null>("F8421X");
  const [tab, setTab] = useState<"Pending" | "My Orders" | "All">("Pending");
  const [progressTab, setProgressTab] = useState<
    "All" | "Accepted" | "Escrowed" | "Paid" | "Cancelled"
  >("All");
  const [corridor, setCorridor] = useState<"AED" | "INR">("INR");
  const [spread, setSpread] = useState<"Fast" | "Best" | "Cheap">("Fast");
  const [boost, setBoost] = useState<0 | 5 | 10 | 15>(0);
  const [livePulse, setLivePulse] = useState(true);

  const pushNotification = (n: Omit<Notification, "id" | "ts" | "read">) => {
    setNotifications((prev) =>
      [
        { ...n, id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, ts: "now", read: false },
        ...prev,
      ].slice(0, 8),
    );
  };

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const unread = notifications.filter((n) => !n.read).length;

  // New pending orders stream in + notify
  useEffect(() => {
    const id = setInterval(() => {
      const order = makeOrder();
      setPendingOrders((prev) => [order, ...prev].slice(0, 6));
      // Notify only ~50% of the time so the panel doesn't drown
      if (Math.random() > 0.5) {
        pushNotification({
          kind: "order_new",
          title: `New ${order.side} order`,
          body: `${order.user} · ${order.amount.toLocaleString()} USDT @ ${order.fiat === "INR" ? "₹" : ""}${order.price.toFixed(2)}${order.fiat === "AED" ? " AED" : ""}`,
        });
      }
    }, 3200);
    return () => clearInterval(id);
  }, []);

  // Oldest pending promotes to active + notify + spawn chat thread
  useEffect(() => {
    const id = setInterval(() => {
      setPendingOrders((prev) => {
        if (prev.length === 0) return prev;
        const oldest = prev[prev.length - 1];
        const rest = prev.slice(0, -1);
        setActiveTrades((cur) => {
          const promoted: ActiveTrade = {
            id: oldest.id,
            user: oldest.user,
            avatar: oldest.avatar,
            side: oldest.side,
            amount: oldest.amount,
            fiat: oldest.fiat,
            status: "ACCEPTED",
            progress: 0.05,
            ttl: 7200,
          };
          setActivity((a) =>
            [
              {
                id: `${oldest.id}-accept`,
                type: "order" as const,
                msg: "Order Accepted",
                detail: `#${oldest.id} · ${oldest.user}`,
                amount: `${oldest.amount.toLocaleString()} USDT`,
                ts: relTs(0),
              },
              ...a,
            ].slice(0, 8),
          );
          pushNotification({
            kind: "order_accepted",
            title: "Order accepted",
            body: `Trade with ${oldest.user} is live — ${oldest.amount.toLocaleString()} USDT`,
          });
          // Spawn a chat thread for the new active trade
          setChatThreads((threads) => {
            if (threads.find((t) => t.orderId === oldest.id)) return threads;
            const newThread: ChatThread = {
              orderId: oldest.id,
              user: oldest.user,
              avatar: oldest.avatar,
              side: oldest.side,
              amount: oldest.amount,
              fiat: oldest.fiat,
              unread: 1,
              isTyping: false,
              isOnline: true,
              messages: [
                {
                  id: nextChatMsgId(),
                  from: "them",
                  text: rand(COUNTERPARTY_LINES),
                  ts: relTs(0),
                },
              ],
            };
            return [newThread, ...threads].slice(0, 5);
          });
          return [promoted, ...cur].slice(0, 4);
        });
        return rest;
      });
    }, 5500);
    return () => clearInterval(id);
  }, []);

  // Advance active trades through escrowed / paid / settled + notify
  useEffect(() => {
    const id = setInterval(() => {
      setActiveTrades((prev) =>
        prev
          .map((t) => {
            const next = { ...t };
            next.progress = Math.min(1, t.progress + 0.08 + Math.random() * 0.04);
            next.ttl = Math.max(0, t.ttl - 6);
            if (next.progress > 0.35 && t.status === "ACCEPTED") {
              next.status = "ESCROWED";
              pushNotification({
                kind: "escrow_locked",
                title: "Escrow locked",
                body: `${t.amount.toLocaleString()} USDT held in escrow · #${t.id}`,
              });
            } else if (next.progress > 0.7 && t.status === "ESCROWED") {
              next.status = "PAID";
              pushNotification({
                kind: "payment_received",
                title: "Payment received",
                body: `${t.user} marked ${t.fiat === "INR" ? "₹" : ""}${(t.amount * (t.fiat === "INR" ? 95 : 3.67)).toLocaleString()}${t.fiat === "AED" ? " AED" : ""} as paid`,
              });
            }
            return next;
          })
          .filter((t) => {
            if (t.progress >= 1) {
              setActivity((a) =>
                [
                  {
                    id: `${t.id}-settle`,
                    type: "settle" as const,
                    msg: "Trade Settled",
                    detail: `#${t.id} · ${t.user}`,
                    amount: `${t.amount.toLocaleString()} USDT`,
                    ts: relTs(0),
                  },
                  ...a,
                ].slice(0, 8),
              );
              pushNotification({
                kind: "trade_settled",
                title: "Trade settled ✓",
                body: `${t.amount.toLocaleString()} USDT credited from ${t.user}`,
              });
              return false;
            }
            return true;
          }),
      );
    }, 1100);
    return () => clearInterval(id);
  }, []);

  // Live indicator pulse
  useEffect(() => {
    const id = setInterval(() => setLivePulse((v) => !v), 950);
    return () => clearInterval(id);
  }, []);

  // Chat: simulated typing + incoming/outgoing messages on the active thread
  useEffect(() => {
    if (!activeChatId) return;
    let typingTimer: number | undefined;
    const id = setInterval(() => {
      const incoming = Math.random() > 0.45;
      setChatThreads((prev) => {
        const idx = prev.findIndex((t) => t.orderId === activeChatId);
        if (idx === -1) return prev;
        const target = prev[idx];
        const newMsg: ChatMessage = {
          id: nextChatMsgId(),
          from: incoming ? "them" : "me",
          text: incoming ? rand(COUNTERPARTY_LINES) : rand(MY_LINES),
          ts: relTs(0),
        };
        const next = [...prev];
        next[idx] = {
          ...target,
          isTyping: false,
          messages: [...target.messages.slice(-9), newMsg],
        };
        return next;
      });
    }, 4200);

    // Typing indicator pulse
    typingTimer = window.setInterval(() => {
      setChatThreads((prev) => {
        const idx = prev.findIndex((t) => t.orderId === activeChatId);
        if (idx === -1) return prev;
        const next = [...prev];
        next[idx] = { ...next[idx], isTyping: !next[idx].isTyping };
        return next;
      });
    }, 2600);

    return () => {
      clearInterval(id);
      if (typingTimer) clearInterval(typingTimer);
    };
  }, [activeChatId]);

  return {
    tab, setTab,
    progressTab, setProgressTab,
    corridor, setCorridor,
    spread, setSpread,
    boost, setBoost,
    livePulse,
    pendingOrders,
    activeTrades,
    activity,
    notifications,
    unread,
    markAllRead,
    chatThreads,
    activeChatId,
    setActiveChatId,
  };
}

/* ─────────────────────── Body (chrome-less) ─────────────────────── */

interface MerchantDashboardBodyProps {
  state: ReturnType<typeof useMerchantDashboardState>;
  /** Cap the dashboard height — useful when embedding in a fixed frame. */
  className?: string;
}

export function MerchantDashboardBody({ state, className = "" }: MerchantDashboardBodyProps) {
  const {
    tab, setTab,
    progressTab, setProgressTab,
    corridor, setCorridor,
    spread, setSpread,
    boost, setBoost,
    unread, markAllRead,
    livePulse,
    pendingOrders, activeTrades, activity,
    notifications,
    chatThreads, activeChatId, setActiveChatId,
  } = state;
  const activeChat = chatThreads.find((t) => t.orderId === activeChatId) ?? chatThreads[0] ?? null;

  return (
    <div className={`bg-black text-white ${className}`}>
      {/* Top navbar */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 bg-black border-b border-white/[0.06]">
        <div className="flex items-center gap-2 sm:gap-6">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-white/70" />
            <span className="font-display text-sm font-semibold text-white">
              Blip <span className="text-white/50">money</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-1 text-[12px]">
            <span className="px-3 py-1 rounded-md bg-white/[0.06] text-white font-medium">
              Dashboard
            </span>
            <span className="px-3 py-1 rounded-md text-white/40 cursor-default">Settings</span>
            <span className="px-3 py-1 rounded-md text-white/40 cursor-default flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
              Compliance
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <IconBtn><History className="w-3.5 h-3.5" /></IconBtn>
          <IconBtn><Plus className="w-3.5 h-3.5" /></IconBtn>
          <span className="hidden sm:inline-flex items-center w-2 h-2 rounded-full bg-emerald-500" />
          <IconBtn><Bug className="w-3.5 h-3.5" /></IconBtn>
          <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md border border-emerald-500/30 bg-emerald-500/5">
            <Shield className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] font-mono text-emerald-300 font-bold">500 Rep</span>
          </div>
          <div className="hidden md:flex items-center gap-1 px-2 py-1 rounded-md border border-amber-500/30 bg-amber-500/5">
            <Star className="w-3 h-3 text-amber-400" />
            <span className="text-[10px] font-mono text-amber-300 font-bold">500 Blip Points</span>
          </div>
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-300 to-orange-500 border border-white/10 flex items-center justify-center text-[14px]">
            🐝
          </div>
        </div>
      </div>

      {/* Body grid — tuned to fit a max-w-5xl (1024px) browser frame without
          column overlap. Pending/InProgress use 1fr each; sidebar + side rails
          are fixed and narrow. On lg+ the grid is height-locked + overflow-
          hidden so streaming pending orders don't push the dashboard taller —
          inner panels clip via their own flex-1 overflow rules. */}
      <div className="grid grid-cols-1 lg:grid-cols-[210px_minmax(220px,1fr)_minmax(220px,1fr)_220px_240px] lg:h-[600px] lg:overflow-hidden">
        {/* ===== Col 1: Wallet sidebar ===== */}
        <div className="border-r border-white/[0.05] flex flex-col min-h-0">
          <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.04] text-[9px] font-mono">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-white/60">
                <Shield className="w-2.5 h-2.5 text-emerald-400/70" />
                <span className="tabular-nums font-bold">547</span>
              </span>
              <span className="flex items-center gap-1 text-white/60">
                <span className="w-2 h-2 rounded-full bg-amber-400/80" />
                <span className="tabular-nums font-bold">500</span>
              </span>
            </div>
            <button className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <Radio className={`w-3 h-3 text-emerald-400 transition-transform ${livePulse ? "scale-110" : "scale-100"}`} />
            </button>
          </div>

          <div className="px-4 py-3 relative">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-40 h-20 bg-emerald-400/[0.04] rounded-full blur-[60px]" />
            </div>
            <div className="flex items-center gap-1.5 mb-1.5 relative z-10">
              <Lock className="w-3 h-3 text-white/30" />
              <span className="text-[10px] text-white/30 font-mono uppercase tracking-widest">
                Wallet Locked
              </span>
            </div>
            <div className="text-center relative z-10">
              <div className="text-3xl sm:text-4xl font-black text-white/30 font-mono tracking-tight leading-none">
                ••••
              </div>
              <button className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/[0.12] border border-emerald-500/30 text-[11px] font-bold text-emerald-300 font-mono hover:bg-emerald-500/[0.2] transition-colors">
                <Lock className="w-3 h-3" />
                Unlock Wallet
              </button>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-1.5 relative z-10">
              {[
                { Icon: ArrowLeftRight, label: "SWAP" },
                { Icon: ArrowUpFromLine, label: "SEND" },
                { Icon: ArrowDownToLine, label: "DEPOSIT" },
              ].map((a) => (
                <button
                  key={a.label}
                  className="flex flex-col items-center gap-1 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-white/70 transition-colors"
                >
                  <a.Icon className="w-3 h-3" />
                  <span className="text-[8px] font-bold tracking-wide">{a.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="px-3 mb-1.5">
            <div className="inline-flex w-full rounded-lg bg-white/[0.03] border border-white/[0.05] p-0.5">
              {(["AED", "INR"] as const).map((c) => {
                const active = corridor === c;
                return (
                  <button
                    key={c}
                    onClick={() => setCorridor(c)}
                    className={`flex-1 py-1 px-1 rounded-md flex items-center justify-center gap-1 transition-all ${
                      active ? "bg-white/[0.08] text-white" : "text-white/40"
                    }`}
                  >
                    <span className="text-[10px] font-medium tracking-tight">USDT/{c}</span>
                    <span className={`text-[9px] font-mono tabular-nums ${active ? "text-white/55" : "text-white/30"}`}>
                      {c === "INR" ? "₹95" : "3.67"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="px-3 mb-1.5">
            <button className="w-full flex items-center justify-between py-1 px-2 rounded-lg bg-white/[0.025] border border-white/[0.04] hover:bg-white/[0.05] transition-all">
              <span className="text-[9px] text-white/30 font-mono uppercase tracking-wider">Cash & Market</span>
              <ChevronRight className="w-3 h-3 text-white/25" />
            </button>
          </div>
          <div className="px-3 mb-1.5">
            <button className="w-full flex items-center justify-between py-1 px-2 rounded-lg bg-white/[0.025] border border-white/[0.04] hover:bg-white/[0.05] transition-all">
              <div className="flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-white/20" />
                <span className="text-[9px] text-white/30 font-mono uppercase tracking-wider">Corridor</span>
              </div>
              <CounterText className="text-[9px] text-white/40 font-mono tabular-nums" base={4} jitter={2} suffix=" online" />
            </button>
          </div>

          <div className="px-3 mb-2 flex items-center justify-between text-[9px] font-mono text-white/25">
            <span>0 done</span>
            <span className="text-white/10">·</span>
            <span>1 cancelled</span>
            <span className="text-white/10">·</span>
            <span>1 total</span>
          </div>

          {/* Trade form */}
          <div className="border-t border-white/[0.05] px-3 pt-2 pb-3 mt-auto">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <ArrowLeftRight className="w-3 h-3 text-white/30" />
                <span className="text-[10px] uppercase font-mono tracking-widest text-white/40">Amount</span>
                <span className="px-1 py-[1px] rounded bg-white/[0.06] text-[8px] font-mono text-white/50">
                  USDT / {corridor}
                </span>
              </div>
              <span className="text-[9px] text-white/30 font-mono">MAX 0</span>
            </div>
            <div className="relative mb-1.5">
              <input
                readOnly
                value="0"
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-md px-2 py-1.5 text-sm font-mono text-white/70 outline-none"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-mono text-white/30">USDT</span>
            </div>

            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono">Spread</span>
            </div>
            <div className="grid grid-cols-3 gap-1 mb-2">
              {([
                { label: "Fast", v: "+2.5%" },
                { label: "Best", v: "+2%" },
                { label: "Cheap", v: "+1.5%" },
              ] as const).map((s) => {
                const active = spread === s.label;
                return (
                  <button
                    key={s.label}
                    onClick={() => setSpread(s.label as typeof spread)}
                    className={`rounded-md py-1 px-1 flex flex-col items-center gap-0 transition-all border ${
                      active ? "bg-white/[0.08] border-white/15 text-white" : "bg-white/[0.02] border-white/[0.04] text-white/50"
                    }`}
                  >
                    <span className="text-[10px]">{s.label}</span>
                    <span className="text-[8px] font-mono tabular-nums text-white/60">{s.v}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono">Boost</span>
              <span className="text-[8px] font-mono text-white/30">manual</span>
            </div>
            <div className="grid grid-cols-4 gap-1 mb-2">
              {([0, 5, 10, 15] as const).map((b) => {
                const active = boost === b;
                return (
                  <button
                    key={b}
                    onClick={() => setBoost(b)}
                    className={`rounded-md py-0.5 text-[10px] font-mono tabular-nums transition-all border ${
                      active ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300" : "bg-white/[0.02] border-white/[0.04] text-white/40"
                    }`}
                  >
                    {b}%
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button className="py-1.5 rounded-md bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.08] text-[11px] font-bold text-white/80 tracking-wide transition-all">
                BUY
              </button>
              <button className="py-1.5 rounded-md bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.06] text-[11px] font-bold text-white/60 tracking-wide transition-all">
                SELL
              </button>
            </div>
          </div>
        </div>

        {/* ===== Col 2: Pending Orders ===== */}
        <div className="border-r border-white/[0.05] flex flex-col min-w-0 min-h-0">
          <div className="px-3 py-2 border-b border-white/[0.05] flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-0.5 text-[10px] min-w-0">
              {(["All", "Pending", "My Orders"] as const).map((t) => {
                const active = tab === t;
                return (
                  <button
                    key={t}
                    onClick={() => setTab(t as typeof tab)}
                    className={`px-1.5 py-0.5 rounded-md font-medium whitespace-nowrap transition-all ${
                      active ? "bg-white/[0.06] text-white" : "text-white/40"
                    }`}
                  >
                    {t === "My Orders" ? "Mine" : t}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className="flex items-center gap-1 text-[10px] font-medium text-white/50">
                <span className="relative flex w-1.5 h-1.5">
                  <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-60" />
                  <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </span>
                Live
              </span>
              <span className="text-[10px] font-mono text-white/30 tabular-nums">
                {pendingOrders.length}
              </span>
            </div>
          </div>

          <div className="px-3 py-1.5 flex items-center gap-1.5 border-b border-white/[0.04]">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white/25" />
              <input
                readOnly
                placeholder="Search..."
                className="w-full bg-white/[0.03] border border-white/[0.05] rounded-md py-0.5 pl-7 pr-2 text-[10px] text-white/60 outline-none placeholder-white/25"
              />
            </div>
            <button className="px-1.5 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.05] text-[10px] text-white/50 flex items-center gap-0.5 flex-shrink-0">
              <Filter className="w-2.5 h-2.5" />
              <ChevronDown className="w-2.5 h-2.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto relative min-h-0">
            <AnimatePresence initial={false}>
              {pendingOrders.length === 0 ? (
                <EmptyState
                  icon={<Activity className="w-5 h-5 text-white/20" />}
                  title="No pending orders"
                  sub="New orders from the network show here"
                />
              ) : (
                <div className="px-2 py-1.5 space-y-1.5">
                  {pendingOrders.map((o, i) => (
                    <motion.div
                      key={o.id}
                      layout
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 50, scale: 0.96 }}
                      transition={{ type: "spring", stiffness: 320, damping: 28 }}
                      className="group relative rounded-lg border border-white/[0.05] bg-gradient-to-br from-white/[0.03] to-white/[0.01] hover:from-white/[0.05] hover:to-white/[0.02] p-2 transition-colors"
                    >
                      {i === 0 && (
                        <div className="absolute -top-px left-3 right-3 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />
                      )}
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base leading-none">{o.avatar}</span>
                          <div className="flex flex-col leading-tight">
                            <span className="text-[11px] font-medium text-white/85">{o.user}</span>
                            <span className="text-[8px] font-mono text-white/30">#{o.id}</span>
                          </div>
                        </div>
                        <span
                          className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            o.side === "BUY"
                              ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                              : "bg-orange-500/10 text-orange-300 border border-orange-500/20"
                          }`}
                        >
                          {o.side}
                        </span>
                      </div>
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="text-sm font-bold text-white font-mono tabular-nums leading-none">
                            {o.amount.toLocaleString()}{" "}
                            <span className="text-[9px] text-white/40 font-normal">USDT</span>
                          </div>
                          <div className="text-[9px] text-white/40 font-mono mt-0.5 tabular-nums">
                            @ {o.fiat === "INR" ? "₹" : ""}
                            {o.price.toFixed(2)}
                            {o.fiat === "AED" ? " AED" : ""}
                          </div>
                        </div>
                        <button className="px-2 py-0.5 rounded-md bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-[10px] font-bold text-emerald-300 transition-colors flex items-center gap-1">
                          Accept <ChevronRight className="w-2.5 h-2.5" />
                        </button>
                      </div>
                      <div className="mt-1.5 h-0.5 rounded-full bg-white/[0.04] overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-emerald-400/60 to-amber-400/60"
                          initial={{ width: "0%" }}
                          animate={{ width: `${Math.min(100, (o.age + 3) * 4)}%` }}
                          transition={{ duration: 1, ease: "linear" }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ===== Col 3: In Progress ===== */}
        <div className="border-r border-white/[0.05] flex flex-col min-w-0 min-h-0">
          <div className="px-3 py-2 border-b border-white/[0.05] flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-white/50" />
              <span className="text-[11px] font-medium text-white/80 uppercase tracking-wider">In Progress</span>
            </div>
            <span className="text-[10px] font-mono text-white/30 tabular-nums">{activeTrades.length}</span>
          </div>

          <div className="px-3 py-1.5 flex items-center gap-1 border-b border-white/[0.04] text-[10px] overflow-x-auto">
            {(["All", "Accepted", "Escrowed", "Paid", "Cancelled"] as const).map((t) => {
              const active = progressTab === t;
              return (
                <button
                  key={t}
                  onClick={() => setProgressTab(t as typeof progressTab)}
                  className={`px-1.5 py-0.5 rounded font-medium whitespace-nowrap transition-all ${
                    active ? "bg-white/[0.08] text-white" : "text-white/40"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>

          <div className="flex-1 overflow-y-auto relative min-h-0">
            {activeTrades.length === 0 ? (
              <EmptyState
                icon={<Shield className="w-5 h-5 text-white/20" />}
                title="No active trades"
                sub="Accepted orders will appear here"
              />
            ) : (
              <div className="px-2 py-1.5 space-y-1.5">
                <AnimatePresence initial={false}>
                  {activeTrades.map((t) => (
                    <motion.div
                      key={t.id}
                      layout
                      initial={{ opacity: 0, y: 12, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.94, x: -30 }}
                      transition={{ type: "spring", stiffness: 280, damping: 28 }}
                      className="relative rounded-lg border border-white/[0.06] bg-white/[0.02] p-2 overflow-hidden"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base leading-none">{t.avatar}</span>
                          <div className="flex flex-col leading-tight">
                            <span className="text-[11px] font-medium text-white/85">{t.user}</span>
                            <span className="text-[8px] font-mono text-white/30">#{t.id}</span>
                          </div>
                        </div>
                        <StatusBadge status={t.status} />
                      </div>

                      <div className="flex items-end justify-between mb-1.5">
                        <div>
                          <div className="text-sm font-bold text-white font-mono tabular-nums leading-none">
                            {t.amount.toLocaleString()}{" "}
                            <span className="text-[9px] text-white/40 font-normal">USDT</span>
                          </div>
                          <div className="text-[9px] text-white/40 font-mono mt-0.5 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            <span className="tabular-nums">{fmtTTL(t.ttl)}</span>
                          </div>
                        </div>
                        <button className="px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/[0.08] text-[10px] font-bold text-white/70 flex items-center gap-1">
                          <MessageSquare className="w-2.5 h-2.5" /> Chat
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        {(["A", "E", "P", "S"] as const).map((step, i, arr) => {
                          const reached =
                            (t.status === "ACCEPTED" && i === 0) ||
                            (t.status === "ESCROWED" && i <= 1) ||
                            (t.status === "PAID" && i <= 2);
                          const isLast = i === arr.length - 1;
                          return (
                            <div key={step} className="flex-1 flex items-center gap-0.5">
                              <div className={`h-1 flex-1 rounded-full ${reached ? "bg-emerald-400/60" : "bg-white/[0.05]"}`} />
                              {!isLast && <span className="w-0.5 h-0.5 rounded-full bg-white/[0.1]" />}
                            </div>
                          );
                        })}
                      </div>
                      <motion.div
                        className="absolute inset-0 rounded-lg pointer-events-none opacity-25"
                        style={{
                          background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.1), transparent)",
                          backgroundSize: "200% 100%",
                        }}
                        animate={{ backgroundPosition: ["-200% 0", "200% 0"] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* ===== Col 4: Leaderboard + Activity (50/50 split) ===== */}
        <div className="border-r border-white/[0.05] grid grid-rows-2 min-w-0 min-h-0">
          {/* Top half: Leaderboard */}
          <div className="flex flex-col min-h-0 border-b border-white/[0.05]">
            <div className="px-3 py-2 border-b border-white/[0.05] flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-400/80" />
                <span className="text-[11px] font-medium text-white/80 uppercase tracking-wider">
                  Leaderboard
                </span>
              </div>
              <button className="px-1.5 py-0.5 rounded bg-white/[0.04] text-[10px] text-white/50 flex items-center gap-1">
                Vol <ChevronDown className="w-2.5 h-2.5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5 min-h-0">
              {LEADERS.map((m, i) => (
                <div
                  key={m.name}
                  className="flex items-center justify-between px-1.5 py-0.5 rounded hover:bg-white/[0.03]"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    {i < 3 ? (
                      <span className="text-[10px]">{["👑", "🥈", "🥉"][i]}</span>
                    ) : (
                      <span className="w-3 text-[10px] font-mono text-white/30 tabular-nums">
                        {i + 1}
                      </span>
                    )}
                    <span className="text-base leading-none">{m.avatar}</span>
                    <div className="flex flex-col leading-tight min-w-0">
                      <span className="text-[10px] text-white/80 truncate">{m.name}</span>
                      <span className="text-[8px] font-mono text-white/30">{m.trades}T</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="text-[10px] font-mono text-white/70 tabular-nums">
                      ${m.vol}
                    </span>
                    {m.rating ? (
                      <span className="flex items-center gap-0.5 text-[9px] text-amber-400/80 font-mono">
                        <Star className="w-2 h-2 fill-current" />
                        {m.rating.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-white/15 text-[10px]">—</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom half: Activity */}
          <div className="flex flex-col min-h-0">
            <div className="px-3 py-2 border-b border-white/[0.05] flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-white/50" />
                <span className="text-[11px] font-medium text-white/70 uppercase tracking-wider">
                  Activity
                </span>
              </div>
              <RotateCcw className="w-3 h-3 text-white/30" />
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-1.5 min-h-0">
              <ul className="space-y-1">
                <AnimatePresence initial={false}>
                  {activity.slice(0, 6).map((a) => (
                    <motion.li
                      key={a.id}
                      layout
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-start gap-1.5"
                    >
                      <div
                        className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                          a.type === "settle"
                            ? "bg-emerald-500/10 border border-emerald-500/30"
                            : a.type === "order"
                              ? "bg-blue-500/10 border border-blue-500/30"
                              : "bg-white/[0.04] border border-white/[0.06]"
                        }`}
                      >
                        {a.type === "settle" ? (
                          <CheckCircle2 className="w-2 h-2 text-emerald-300" />
                        ) : a.type === "order" ? (
                          <Activity className="w-2 h-2 text-blue-300" />
                        ) : (
                          <AlertCircle className="w-2 h-2 text-white/40" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] text-white/80 leading-tight truncate">
                          {a.msg}
                        </div>
                        <div className="text-[9px] font-mono text-white/30 truncate">
                          {a.detail}
                        </div>
                      </div>
                      <div className="text-[9px] font-mono text-white/50 tabular-nums flex-shrink-0">
                        {a.amount}
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </div>
          </div>
        </div>

        {/* ===== Col 5: Notifications + Messages (50/50 split) ===== */}
        <div className="grid grid-rows-2 min-w-0 min-h-0">
          {/* Top half: Notifications — live stream */}
          <div className="flex flex-col min-h-0 border-b border-white/[0.05]">
            <div className="px-3 py-2 border-b border-white/[0.05] flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-white/60" />
                <span className="text-[11px] font-medium text-white/80 uppercase tracking-wider">
                  Notifications
                </span>
                {unread > 0 && (
                  <span className="px-1 py-[1px] rounded bg-emerald-500/20 border border-emerald-500/30 text-[9px] font-bold text-emerald-300">
                    {unread}
                  </span>
                )}
              </div>
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-[10px] text-white/40 hover:text-white/60"
              >
                <CheckCircle2 className="w-3 h-3" /> READ
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-2 py-1.5 space-y-1 min-h-0">
              <AnimatePresence initial={false}>
                {notifications.map((n) => (
                  <motion.div
                    key={n.id}
                    layout
                    initial={{ opacity: 0, x: 30, scale: 0.96 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 40 }}
                    transition={{ type: "spring", stiffness: 300, damping: 26 }}
                    className={`relative rounded-lg border p-2 ${
                      n.read
                        ? "border-white/[0.04] bg-white/[0.015]"
                        : "border-white/[0.08] bg-white/[0.04]"
                    }`}
                  >
                    {!n.read && (
                      <span className="absolute right-2 top-2 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    )}
                    <div className="flex items-start gap-1.5 pr-3">
                      <NotificationIcon kind={n.kind} />
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-medium text-white/85 leading-snug truncate">
                          {n.title}
                        </div>
                        <div className="text-[9px] text-white/45 leading-tight mt-0.5 truncate">
                          {n.body}
                        </div>
                        <div className="text-[8px] font-mono text-white/25 mt-0.5">{n.ts}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {notifications.length === 0 && (
                <div className="flex flex-col items-center justify-center text-center py-4">
                  <div className="w-7 h-7 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-1.5">
                    <Bell className="w-3 h-3 text-white/30" />
                  </div>
                  <span className="text-[10px] text-white/40">All caught up</span>
                </div>
              )}
            </div>
          </div>

          {/* Bottom half: Messages — live chat */}
          <div className="flex flex-col min-h-0">
            {activeChat ? (
              <ChatPanel
                threads={chatThreads}
                active={activeChat}
                onSelect={setActiveChatId}
              />
            ) : (
              <>
                <div className="px-3 py-2 border-b border-white/[0.05] flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-white/60" />
                    <span className="text-[11px] font-medium text-white/80 uppercase tracking-wider">
                      Messages
                    </span>
                  </div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center text-center min-h-0">
                  <div className="w-7 h-7 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-1.5">
                    <MessageSquare className="w-3 h-3 text-white/30" />
                  </div>
                  <span className="text-[10px] text-white/40">No active order chats</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────── Sub-components ───────────────────── */

function NotificationIcon({ kind }: { kind: Notification["kind"] }) {
  const map: Record<
    Notification["kind"],
    { Icon: React.ComponentType<{ className?: string }>; cls: string }
  > = {
    order_new: {
      Icon: Activity,
      cls: "bg-blue-500/15 border-blue-500/30 text-blue-300",
    },
    order_accepted: {
      Icon: CheckCircle2,
      cls: "bg-emerald-500/15 border-emerald-500/30 text-emerald-300",
    },
    escrow_locked: {
      Icon: Lock,
      cls: "bg-amber-500/15 border-amber-500/30 text-amber-300",
    },
    payment_received: {
      Icon: ArrowDownToLine,
      cls: "bg-violet-500/15 border-violet-500/30 text-violet-300",
    },
    trade_settled: {
      Icon: Shield,
      cls: "bg-emerald-500/15 border-emerald-500/30 text-emerald-300",
    },
    system: {
      Icon: Bell,
      cls: "bg-white/[0.06] border-white/[0.08] text-white/60",
    },
  };
  const { Icon, cls } = map[kind];
  return (
    <div
      className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${cls}`}
    >
      <Icon className="w-2.5 h-2.5" />
    </div>
  );
}

interface ChatPanelProps {
  threads: ChatThread[];
  active: ChatThread;
  onSelect: (orderId: string) => void;
}

function ChatPanel({ threads, active, onSelect }: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [active.messages.length, active.orderId]);

  return (
    <>
      {/* Header: counterparty + status */}
      <div className="px-3 py-2 border-b border-white/[0.05] flex items-center gap-2 flex-shrink-0">
        <div className="relative w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-base flex-shrink-0">
          {active.avatar}
          {active.isOnline && (
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-black" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-[11px] font-medium text-white/85 truncate">{active.user}</p>
            <span
              className={`text-[9px] px-1 py-[1px] rounded font-mono border ${
                active.side === "BUY"
                  ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/25"
                  : "bg-orange-500/10 text-orange-300 border-orange-500/25"
              }`}
            >
              {active.side}
            </span>
          </div>
          <p className="text-[9px] font-mono text-white/40 truncate">
            {active.isTyping ? (
              <span className="text-emerald-300">typing…</span>
            ) : active.isOnline ? (
              <span className="text-emerald-300/80">Online</span>
            ) : (
              `#${active.orderId}`
            )}
          </p>
        </div>
        <span className="text-[9px] font-mono text-white/35 tabular-nums flex-shrink-0">
          {active.amount.toLocaleString()} USDT
        </span>
      </div>

      {/* Thread switcher — only if multiple threads */}
      {threads.length > 1 && (
        <div className="px-2 py-1 border-b border-white/[0.04] flex items-center gap-1 overflow-x-auto flex-shrink-0">
          {threads.slice(0, 4).map((t) => {
            const isActive = t.orderId === active.orderId;
            return (
              <button
                key={t.orderId}
                onClick={() => onSelect(t.orderId)}
                className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md border whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-white/[0.08] border-white/15 text-white"
                    : "bg-white/[0.02] border-white/[0.05] text-white/45 hover:text-white/70"
                }`}
              >
                <span className="text-xs leading-none">{t.avatar}</span>
                <span className="text-[10px] font-medium">{t.user}</span>
                {t.unread > 0 && !isActive && (
                  <span className="px-1 rounded-full bg-emerald-500/25 text-emerald-300 text-[8px] font-bold tabular-nums">
                    {t.unread}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5 min-h-0"
      >
        <AnimatePresence initial={false}>
          {active.messages.map((m) => {
            const isMe = m.from === "me";
            return (
              <motion.div
                key={m.id}
                layout
                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-2 py-1 rounded-lg text-[10px] leading-snug ${
                    isMe
                      ? "bg-emerald-500/15 border border-emerald-500/25 text-emerald-100 rounded-br-sm"
                      : "bg-white/[0.05] border border-white/[0.08] text-white/85 rounded-bl-sm"
                  }`}
                >
                  <p>{m.text}</p>
                  <div
                    className={`text-[8px] font-mono mt-0.5 ${
                      isMe ? "text-emerald-300/50 text-right" : "text-white/30"
                    }`}
                  >
                    {m.ts}
                    {isMe && <span className="ml-1">✓✓</span>}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {active.isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="px-2 py-1.5 rounded-lg rounded-bl-sm bg-white/[0.05] border border-white/[0.08]">
              <div className="flex items-center gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-1 h-1 rounded-full bg-white/60"
                    animate={{ y: [0, -2, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{
                      duration: 0.9,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input bar */}
      <div className="border-t border-white/[0.05] p-2 flex-shrink-0">
        <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.06] rounded-md px-2 py-1">
          <input
            readOnly
            placeholder="Type a message…"
            className="flex-1 bg-transparent text-[10px] text-white/70 outline-none placeholder-white/30 min-w-0"
          />
          <button className="w-5 h-5 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 flex items-center justify-center">
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </>
  );
}

function IconBtn({ children }: { children: React.ReactNode }) {
  return (
    <button className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.05] text-white/60 flex items-center justify-center transition-colors">
      {children}
    </button>
  );
}

function StatusBadge({ status }: { status: ActiveTrade["status"] }) {
  const map = {
    ACCEPTED: { cls: "bg-blue-500/10 text-blue-300 border-blue-500/25", label: "ACCEPTED" },
    ESCROWED: { cls: "bg-amber-500/10 text-amber-300 border-amber-500/25", label: "ESCROWED" },
    PAID: { cls: "bg-emerald-500/10 text-emerald-300 border-emerald-500/25", label: "PAID" },
  } as const;
  const s = map[status];
  return (
    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border tabular-nums flex items-center gap-1 ${s.cls}`}>
      <span className="relative flex w-1 h-1">
        <span className="absolute inset-0 rounded-full bg-current animate-ping opacity-60" />
        <span className="relative inline-flex w-1 h-1 rounded-full bg-current" />
      </span>
      {s.label}
    </span>
  );
}

function EmptyState({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
      <div className="w-9 h-9 rounded-full border border-white/[0.06] bg-white/[0.02] flex items-center justify-center">
        {icon}
      </div>
      <div className="text-center">
        <p className="text-[11px] font-medium text-white/40 mb-0.5">{title}</p>
        <p className="text-[9px] text-white/20 font-mono">{sub}</p>
      </div>
    </div>
  );
}

function CounterText({
  base,
  jitter,
  suffix,
  className,
}: {
  base: number;
  jitter: number;
  suffix: string;
  className?: string;
}) {
  const [n, setN] = useState(base);
  useEffect(() => {
    const id = setInterval(() => {
      setN(base + Math.floor(Math.random() * jitter * 2) - jitter);
    }, 4000);
    return () => clearInterval(id);
  }, [base, jitter]);
  return (
    <span className={className}>
      {n}
      {suffix}
    </span>
  );
}

const LEADERS = [
  { name: "John", avatar: "🌊", trades: 23, vol: "3.8k", rating: 5.0 },
  { name: "zoro", avatar: "🦋", trades: 36, vol: "2.7k", rating: 4.5 },
  { name: "Zayn Khan", avatar: "🐱", trades: 4, vol: "1.4k", rating: null },
  { name: "Drako", avatar: "🐙", trades: 2, vol: "1.0k", rating: null },
  { name: "Hulk", avatar: "🐢", trades: 14, vol: "315", rating: 1.0 },
  { name: "Craig Mo...", avatar: "🐻", trades: 0, vol: "0", rating: null },
  { name: "Zooo", avatar: "🐧", trades: 0, vol: "0", rating: null },
  { name: "shubham", avatar: "🌊", trades: 0, vol: "0", rating: null },
] as const;

/* ───────────────────── Standalone export (optional) ───────────────────── */

export default function LiveMerchantDashboard() {
  const state = useMerchantDashboardState();

  return (
    <section className="relative bg-[#FAF8F5] dark:bg-black py-16 sm:py-24 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 mb-8 sm:mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-black/[0.08] dark:border-white/[0.08] bg-white/60 dark:bg-white/[0.03] mb-4">
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-60" />
              <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-black/50 dark:text-white/40 font-semibold">
              Live Merchant Console
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-tight text-black dark:text-white mb-3">
            Settlement, in motion.
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-black/60 dark:text-white/60 max-w-2xl mx-auto">
            A real-time view of the merchant dashboard. Orders stream in, escrow locks, fiat
            confirms, and trades settle — all on-protocol.
          </p>
        </motion.div>
      </div>

      <div className="relative z-10 max-w-[1480px] mx-auto px-3 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-black/10 dark:border-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.4)] bg-[#0a0a0a]"
        >
          <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0f0f10] border-b border-white/[0.06]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
            <div className="flex-1 flex justify-center">
              <div className="px-3 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-[10px] font-mono text-white/40">
                app.blip.money/merchant
              </div>
            </div>
            <div className="w-12" />
          </div>

          <MerchantDashboardBody state={state} />
        </motion.div>
      </div>
    </section>
  );
}
