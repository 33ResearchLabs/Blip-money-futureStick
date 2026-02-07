import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Compact version for hero section
export const MerchantDashboardCompact = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mock merchant order data
  const [newOrders, setNewOrders] = useState([
    {
      id: "ORD-7821",
      user: "🦁",
      userName: "Sarah M.",
      amount: "500 USDT",
      rate: "1,620 AED",
      time: "2m",
      country: "🇦🇪",
      status: "new",
      description: "Crypto to cash transfer - Dubai",
      priority: "high",
    },
    {
      id: "ORD-7820",
      user: "🐯",
      userName: "Ahmed K.",
      amount: "1,200 USDT",
      rate: "1,618 AED",
      time: "5m",
      country: "🇦🇪",
      status: "new",
      description: "Bulk exchange request",
      priority: "medium",
    },
  ]);

  const mockUsers = ["🦁", "🐯", "🦊", "🐼", "🐸"];
  const mockCountries = ["🇦🇪"];
  const mockRates = ["1,620 AED", "1,618 AED", "3.67 AED"];

  const mockUserNames = [
    "Sarah M.",
    "Ahmed K.",
    "Lisa T.",
    "John D.",
    "Emily R.",
  ];
  const mockDescriptions = [
    "Crypto to cash transfer - Dubai",
    "Bulk exchange request",
    "Quick cash out",
    "Personal remittance",
    "Business settlement",
  ];
  const mockPriorities = ["high", "medium", "low"];

  const generateOrder = () => {
    const id = `ORD-${Date.now()}-${Math.floor(Math.random() * 100)}`;

    return {
      id,
      user: mockUsers[Math.floor(Math.random() * mockUsers.length)],
      userName: mockUserNames[Math.floor(Math.random() * mockUserNames.length)],
      amount: `${Math.floor(100 + Math.random() * 1500).toLocaleString(
        "en-US",
      )} USDT`,

      rate: mockRates[Math.floor(Math.random() * mockRates.length)],
      time: "just now",
      country: mockCountries[Math.floor(Math.random() * mockCountries.length)],
      status: "new",
      description:
        mockDescriptions[Math.floor(Math.random() * mockDescriptions.length)],
      priority:
        mockPriorities[Math.floor(Math.random() * mockPriorities.length)],
    };
  };

  // Auto-add orders every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const order = generateOrder();

      setNewOrders((prev) => {
        if (prev.length >= 3) return prev;
        return [order, ...prev];
      });

      showNotification("New order received", "Waiting for merchant action");
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const [inEscrow, setInEscrow] = useState([]);
  const [completed, setCompleted] = useState([]);

  const [notification, setNotification] = useState({
    visible: false,
    title: "",
    desc: "",
  });

  const acceptOrder = (order) => {
    setNewOrders((prev) => prev.filter((o) => o.id !== order.id));

    setInEscrow((prev) => [{ ...order, progress: 60 }, ...prev]);

    showNotification("Order moved to escrow", `${order.amount} secured`);
  };

  const releaseOrder = (order) => {
    setInEscrow((prev) => prev.filter((o) => o.id !== order.id));
    setCompleted((prev) => [...prev, order]);

    showNotification("Order completed", `${order.amount} settled`);
  };

  const showNotification = (title, desc) => {
    setNotification({
      visible: true,
      title,
      desc,
    });

    setTimeout(() => {
      setNotification((prev) => ({
        ...prev,
        visible: false,
      }));
    }, 2000);
  };

  // Auto-move New → Escrow (random)
  useEffect(() => {
    const timer = setInterval(() => {
      setNewOrders((prev) => {
        if (prev.length === 0) return prev;

        // 30% chance
        if (Math.random() > 0.3) return prev;

        const [order, ...rest] = prev;

        setInEscrow((escrow) => [{ ...order, progress: 40 }, ...escrow]);

        showNotification(
          "Order auto-matched",
          `${order.amount} moved to escrow`,
        );

        return rest;
      });
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  //  Auto-progress Escrow → Completed
  useEffect(() => {
    const timer = setInterval(() => {
      setInEscrow((prev) => {
        if (prev.length === 0) return prev;

        const updated = prev.map((order) =>
          order.progress < 100
            ? { ...order, progress: order.progress + 20 }
            : order,
        );

        const completedOrders = updated.filter((o) => o.progress >= 100);
        const remaining = updated.filter((o) => o.progress < 100);

        if (completedOrders.length > 0) {
          setCompleted((done) => [
            ...completedOrders.map((o) => ({
              ...o,
              time: "just settled",
            })),
            ...done,
          ]);

          showNotification(
            "Auto settlement completed",
            `${completedOrders[0].amount} released`,
          );
        }

        return remaining;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  const transferVariants = {
    initial: { scale: 1, opacity: 1 },
    press: { scale: 0.96 },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.9,
      transition: { duration: 0.25, ease: "easeInOut" },
    },
  };

  return (
    <div
      ref={containerRef}
      className="w-full lg:w-1/2 flex items-center justify-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[800px]"
      >
        {/* Browser window - compact */}
        <div
          className="rounded-xl overflow-hidden
          border border-white/[0.08]
          shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9),0_20px_40px_-20px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.05)]
          w-full"
        >
          {/* Browser header */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0d0d0d] border-b border-white/[0.04]">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#28ca42]" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/[0.03] border border-white/[0.04]">
                <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                <span className="text-[10px] text-white/50 font-medium tracking-wide">
                  merchant.blipprotocol.com
                </span>
              </div>
            </div>
            <div className="w-12" />
          </div>

          {/* Dashboard content with sidebar */}
          <div className="flex">
            {/* Sidebar Navigation - Compact */}
            <div className="w-32 border-r border-white/[0.04] p-2 hidden md:block bg-black relative">
              {/* Logo area */}
              <div className="flex items-center gap-1.5 mb-3 px-1">
                <div className="w-5 h-5 rounded-lg bg-white/10 flex items-center justify-center">
                  <span className="text-white text-[9px] font-bold">B</span>
                </div>
                <span className="text-[10px] font-semibold text-white">
                  Blip Merchant
                </span>
              </div>

              {/* Nav items */}
              <div className="space-y-0.5">
                {[
                  { icon: "◉", label: "Dashboard", active: true },
                  { icon: "↗", label: "Orders", active: false },
                  { icon: "◈", label: "Escrow", active: false },
                  { icon: "⬡", label: "Wallet", active: false },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
                      item.active
                        ? "bg-white/[0.06] text-white"
                        : "text-white/60 hover:text-white/80 hover:bg-white/[0.02]"
                    }`}
                  >
                    <span className="text-[10px]">{item.icon}</span>
                    <span className="text-[11px] font-medium">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Main content area - Compact */}
            <div className="flex-1 p-3">
              {/* Top stats bar */}
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/[0.03]">
                <div className="flex items-center gap-2">
                  <motion.div
                    className="w-1 h-1 rounded-full bg-emerald-400"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-[11px] text-white/60 font-medium">
                    Live
                  </span>
                </div>
                <span className="text-[10px] text-white/50">
                  Solana Mainnet
                </span>
              </div>

              {/* Stats cards row - Compact */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 mb-3">
                {[
                  {
                    label: "Volume",
                    value: "$55.4k",
                    change: "+12%",
                    up: true,
                  },
                  {
                    label: "Earnings",
                    value: "$1.4k",
                    change: "+8%",
                    up: true,
                  },
                  { label: "Orders", value: "23", change: "+5", up: true },
                  {
                    label: "Time",
                    value: "12s",
                    change: "-3s",
                    up: true,
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="p-2 rounded-md bg-[#0c0c0c] border border-white/[0.03]"
                  >
                    <div className="text-[7px] text-white/50 uppercase tracking-widest font-medium mb-0.5">
                      {stat.label}
                    </div>
                    <div className="flex items-end justify-between">
                      <div className="text-xs font-semibold text-white tracking-tight">
                        {stat.value}
                      </div>
                      <div
                        className={`text-[8px] font-medium ${
                          stat.up ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {stat.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Volume Chart - Compact */}
              <div className="mb-3 p-2.5 rounded-lg bg-gradient-to-br from-[#0c0c0c] to-[#080808] border border-white/[0.04] relative overflow-hidden">
                {/* Subtle glow effect */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/[0.03] blur-[40px] rounded-full" />

                {/* Header */}
                <div className="flex items-center justify-between mb-2.5 relative z-10">
                  <div>
                    <div className="text-[8px] text-white/40 uppercase tracking-wider mb-0.5">
                      Volume Overview
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-bold text-white">
                        $55.4k
                      </span>
                      <span className="text-[8px] font-medium text-emerald-400 flex items-center gap-0.5">
                        <svg
                          className="w-2 h-2"
                          viewBox="0 0 10 10"
                          fill="currentColor"
                        >
                          <path d="M5 2L8 6H2L5 2Z" />
                        </svg>
                        +12.5%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 bg-white/[0.03] rounded-md p-0.5">
                    {["24h", "7d", "30d"].map((period) => (
                      <button
                        key={period}
                        className={`px-2 py-0.5 rounded text-[8px] font-medium transition-all ${
                          period === "7d"
                            ? "bg-white/[0.1] text-white shadow-sm"
                            : "text-white/40 hover:text-white/60"
                        }`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chart with Y-axis */}
                <div className="flex gap-1.5 relative z-10">
                  {/* Y-axis labels */}
                  <div className="flex flex-col justify-between text-[7px] text-white/30 font-mono py-0.5 pr-1">
                    <span>$8k</span>
                    <span>$4k</span>
                    <span>$0</span>
                  </div>

                  {/* Chart area */}
                  <div className="flex-1 relative">
                    {/* Grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                      <div className="h-px bg-white/[0.03]" />
                      <div className="h-px bg-white/[0.03]" />
                      <div className="h-px bg-white/[0.03]" />
                    </div>

                    {/* Bars */}
                    <div className="flex items-end gap-0.5 h-16 relative">
                      {[
                        { value: 40, label: "Mon" },
                        { value: 65, label: "Tue" },
                        { value: 45, label: "Wed" },
                        { value: 80, label: "Thu" },
                        { value: 55, label: "Fri" },
                        { value: 90, label: "Sat" },
                        { value: 70, label: "Sun" },
                        { value: 85, label: "" },
                        { value: 60, label: "" },
                        { value: 95, label: "" },
                        { value: 75, label: "" },
                        { value: 88, label: "" },
                      ].map((bar, i) => (
                        <motion.div
                          key={i}
                          className="flex-1 relative group cursor-pointer"
                          initial={{ height: 0 }}
                          whileInView={{ height: `${bar.value}%` }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.6,
                            delay: i * 0.04,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                        >
                          {/* Bar with gradient */}
                          <div
                            className={`absolute inset-0 rounded-t-sm transition-all duration-200 ${
                              i >= 9
                                ? "bg-gradient-to-t from-white/25 via-white/15 to-white/5 group-hover:from-white/35"
                                : "bg-gradient-to-t from-white/25 via-white/15 to-white/5 group-hover:from-white/35"
                            }`}
                          />

                          {/* Glow on hover */}
                          <div
                            className={`absolute inset-0 rounded-t-sm opacity-0 group-hover:opacity-100 transition-opacity ${
                              i >= 9
                                ? "shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                                : "shadow-[0_0_12px_rgba(255,255,255,0.1)]"
                            }`}
                          />

                          {/* Tooltip on hover */}
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-1 py-0.5 rounded bg-white/10 backdrop-blur-sm text-[7px] text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            ${(bar.value * 80).toLocaleString()}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* X-axis labels */}
                    <div className="flex justify-between mt-1.5 px-0.5">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                        (day) => (
                          <span
                            key={day}
                            className="text-[6px] text-white/30 font-medium"
                          >
                            {day}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom stats */}
                <div className="flex items-center gap-3 mt-2 pt-2 border-t border-white/[0.04] relative z-10">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-sm bg-gradient-to-t from-white/25 to-white/10" />
                    <span className="text-[7px] text-white/40">This week</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-sm bg-gradient-to-t from-emerald-500/60 to-emerald-400/30" />
                    <span className="text-[7px] text-white/40">Peak days</span>
                  </div>
                  <div className="ml-auto text-[7px] text-white/30">
                    Updated 2 min ago
                  </div>
                </div>
              </div>

              {/* 3-Column Dashboard Layout - Compact */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {/* Column 1: New Orders */}
                <div className="rounded-md bg-[#0f0f0f] border border-white/[0.04] overflow-hidden">
                  <div className="flex items-center justify-between px-2 py-1.5 border-b border-white/[0.03]">
                    <div className="flex items-center gap-1">
                      <div className="w-0.5 h-0.5 rounded-full bg-white/60" />
                      <span className="text-[10px] font-medium text-white">
                        New Orders
                      </span>
                    </div>
                    <span className="text-[8px] text-white/50 bg-white/[0.04] px-1 py-0.5 rounded font-medium">
                      {newOrders.length}
                    </span>
                  </div>
                  <div className="p-1.5 space-y-1 max-h-[180px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                    <AnimatePresence initial={false}>
                      {newOrders.slice(0, 3).map((order, i) => (
                        <motion.div
                          key={order.id}
                          initial="initial"
                          animate="initial"
                          exit="exit"
                          whileTap="press"
                          layout
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 25,
                          }}
                          className={`group relative p-1.5 rounded border transition-colors duration-300 bg-[#1a1a1a] border-white/[0.06]`}
                        >
                          <div className="flex items-center justify-between mb-0.5">
                            <div className="flex items-center gap-1">
                              <span className="text-xs">{order.user}</span>
                              <span className="text-[8px] font-mono text-white/60">
                                {order.id}
                              </span>
                            </div>
                            <span className="text-xs">{order.country}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-[10px] font-semibold text-white">
                                {order.amount}
                              </div>
                              <div className="text-[8px] text-white/60">
                                @ {order.rate}
                              </div>
                            </div>
                            <motion.div
                              className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-white/90 text-black hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                              whileHover={{ scale: 1.05 }}
                              onClick={() => acceptOrder(order)}
                            >
                              Accept
                            </motion.div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Column 2: In Escrow */}
                <div className="rounded-md bg-[#0f0f0f] border border-white/[0.04] overflow-hidden">
                  <div className="flex items-center justify-between px-2 py-1.5 border-b border-white/[0.03]">
                    <div className="flex items-center gap-1">
                      <motion.div
                        className="w-0.5 h-0.5 rounded-full bg-white"
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <span className="text-[10px] font-medium text-white">
                        In Escrow
                      </span>
                    </div>
                    <span className="text-[8px] text-white/50 bg-white/[0.04] px-1 py-0.5 rounded font-medium">
                      {inEscrow.length}
                    </span>
                  </div>
                  <div className="p-1.5 space-y-1 max-h-[180px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                    {inEscrow.slice(0, 3).map((order, i) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                        className={`p-1.5 rounded border transition-colors duration-300 bg-[#1a1a1a] border-white/[0.06]`}
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <div className="flex items-center gap-1">
                            <span className="text-xs">{order.user}</span>
                            <span className="text-[8px] font-mono text-white/60">
                              {order.id}
                            </span>
                          </div>
                          <span className="text-xs">{order.country}</span>
                        </div>
                        <div>
                          <div className="text-[10px] font-semibold text-white mb-1">
                            {order.amount}
                          </div>
                          <div className="w-full bg-white/[0.08] h-1 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                              initial={{ width: "0%" }}
                              animate={{ width: `${order.progress}%` }}
                              transition={{ duration: 1 }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Column 3: Completed */}
                <div className="rounded-md bg-[#0f0f0f] border border-white/[0.04] overflow-hidden">
                  <div className="flex items-center justify-between px-2 py-1.5 border-b border-white/[0.03]">
                    <div className="flex items-center gap-1">
                      <div className="w-0.5 h-0.5 rounded-full bg-emerald-400" />
                      <span className="text-[10px] font-medium text-white">
                        Completed
                      </span>
                    </div>
                    <span className="text-[8px] text-white/50 bg-white/[0.04] px-1 py-0.5 rounded font-medium">
                      {completed.length}
                    </span>
                  </div>
                  <div className="p-1.5 space-y-1 max-h-[180px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                    {completed.slice(0, 3).map((order, i) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className={`p-1.5 rounded border bg-[#0c1a0f] border-emerald-500/20`}
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <div className="flex items-center gap-1">
                            <span className="text-xs">{order.user}</span>
                            <span className="text-[8px] font-mono text-white/60">
                              {order.id}
                            </span>
                          </div>
                          <span className="text-[9px] text-emerald-400">✓</span>
                        </div>
                        <div>
                          <div className="text-[10px] font-semibold text-white">
                            {order.amount}
                          </div>
                          <div className="text-[8px] text-emerald-400/60">
                            Settled
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Messages Section - Compact */}
              {/* <div className="mt-2 p-2 rounded-md bg-[#0c0c0c] border border-white/[0.03]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-medium text-white">
                    Messages
                  </span>
                  <span className="text-[8px] text-white/50 bg-white/[0.04] px-1 py-0.5 rounded">
                    3
                  </span>
                </div>
                <div className="space-y-1">
                  {[
                    {
                      user: "🦁",
                      name: "Sarah M.",
                      message: "Payment sent",
                      time: "1m",
                    },
                    {
                      user: "🐯",
                      name: "Ahmed K.",
                      message: "Ready to trade",
                      time: "3m",
                    },
                    {
                      user: "🦊",
                      name: "Lisa T.",
                      message: "How long for confirmation?",
                      time: "5m",
                    },
                  ].map((msg, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 p-1.5 rounded bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer"
                    >
                      <span className="text-xs">{msg.user}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[9px] text-white font-medium truncate">
                          {msg.name}
                        </div>
                        <div className="text-[8px] text-white/50 truncate">
                          {msg.message}
                        </div>
                      </div>
                      <span className="text-[7px] text-white/40">
                        {msg.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Floating notification */}
        <AnimatePresence>
          {notification.visible && (
            <motion.div
              initial={{ opacity: 0, x: 20, y: -10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 20, y: -10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute right-4 top-16 hidden lg:block z-50"
            >
              <div className="p-2.5 pr-3 rounded-lg bg-[#0d0d0d] border border-white/[0.04] shadow-2xl">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                    <span className="text-sm">🔔</span>
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-white">
                      {notification.title}
                    </div>
                    <div className="text-[9px] text-white/60">
                      {notification.desc}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Compact glow effect */}
        <div
          className="absolute -bottom-10 left-1/2 w-[60%] h-20 blur-[60px] opacity-[0.05]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255,255,255,0.8), transparent 70%)",
            transform: "translateX(-50%)",
          }}
        />
      </motion.div>
    </div>
  );
};
