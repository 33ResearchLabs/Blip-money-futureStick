import { useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, CheckCircle2, User } from "lucide-react";

export const MerchantHeroDashbaord = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [0, 1, 1, 0],
  );
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.95, 1]);

  // Selected order state for detail view
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState("inbox");

  // Mock merchant order data
  const [newOrders, setNewOrders] = useState([
    {
      id: "ORD-7821",
      user: "SM",
      userName: "Sarah M.",
      amount: "500 USDT",
      rate: "1,620 AED",
      time: "2m",
      country: "AE",
      status: "new",
      description: "Crypto to cash transfer - Dubai",
      priority: "high",
    },
    {
      id: "ORD-7820",
      user: "AK",
      userName: "Ahmed K.",
      amount: "1,200 USDT",
      rate: "1,618 AED",
      time: "5m",
      country: "AE",
      status: "new",
      description: "Bulk exchange request",
      priority: "medium",
    },
    {
      id: "ORD-7819",
      user: "LT",
      userName: "Lisa T.",
      amount: "250 USDT",
      rate: "3.67 AED",
      time: "8m",
      country: "AE",
      status: "new",
      description: "Quick cash out",
      priority: "low",
    },
  ]);

  const mockUsers = ["SM", "AK", "LT", "JD", "ER"];
  const mockCountries = ["AE"]; // ✅ only AED region
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

  // Auto-add orders every 6–10 seconds

  useEffect(() => {
    const interval = setInterval(() => {
      const order = generateOrder();

      setNewOrders((prev) => {
        if (prev.length >= 5) return prev;
        return [order, ...prev];
      });

      showNotification("New order received", "Waiting for merchant action");
    }, 1000);

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
    }, 2000); // 👈 2 seconds
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
    }, 1000);

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
    <section
      ref={containerRef}
      className="relative py-0 overflow-hidden w-full"
      style={{
        background: "transparent",
      }}
    >
      {/* Premium vignette effect - light mode */}
      <div className="absolute inset-0 pointer-events-none block dark:hidden">
        {/* Top spotlight glow */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(0,0,0,0.06) 0%, transparent 60%)",
          }}
        />
        {/* Center soft glow on mockup */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(0,0,0,0.04) 0%, transparent 70%)",
          }}
        />
        {/* Vignette edges */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(250,248,245,0.85) 100%)",
          }}
        />
      </div>

      {/* Premium vignette effect - dark mode only */}
      <div className="absolute inset-0 pointer-events-none hidden dark:block">
        {/* Top spotlight glow */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(255,255,255,0.04) 0%, transparent 60%)",
          }}
        />
        {/* Center soft glow on mockup */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(255,255,255,0.02) 0%, transparent 70%)",
          }}
        />
        {/* Vignette edges */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.6) 100%)",
          }}
        />
      </div>

      <motion.div
        className="relative z-10 max-w-[1800px] mx-auto px-0"
        style={{ opacity }}
      >
        {/* Merchant Dashboard Browser Mockup */}
        <div className="">
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ scale }}
            className="relative"
          >
            {/* Browser window - flat without tilt */}
            <div className="rounded-2xl overflow-hidden border border-black/[0.18] dark:border-white/[0.08] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25),0_10px_30px_-10px_rgba(0,0,0,0.18)] dark:shadow-[0_60px_120px_-30px_rgba(0,0,0,0.9),0_40px_80px_-40px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.05)] w-full min-w-[1200px]">
              {/* Browser header - minimal premium style */}
              <div className="flex items-center gap-3 px-5 py-3.5 bg-[#e8e8e8] dark:bg-[#0d0d0d] border-b border-black/[0.08] dark:border-white/[0.04]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-black/20 dark:bg-white/20" />
                  <div className="w-3 h-3 rounded-full bg-black/20 dark:bg-white/20" />
                  <div className="w-3 h-3 rounded-full bg-black/20 dark:bg-white/20" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-black/[0.06] dark:bg-white/[0.03] border border-black/[0.08] dark:border-white/[0.04]">
                    <div className="w-2 h-2 rounded-full bg-black/30 dark:bg-white/30" />
                    <span className="text-xs text-black dark:text-white/50 font-medium tracking-wide">
                      merchant.blipprotocol.com
                    </span>
                  </div>
                </div>
                <div className="w-16" />
              </div>

              {/* Dashboard content with sidebar */}
              <div className="flex">
                {/* Sidebar Navigation */}
                <div className="w-44 border-r border-black/[0.08] dark:border-white/[0.04] p-3 hidden md:block bg-[#ececec] dark:bg-black relative">
                  {/* Logo area */}
                  <div className="flex items-center gap-2 mb-4 px-1">
                    <div className="w-6 h-6 rounded-lg bg-black/10 dark:bg-white/10 flex items-center justify-center">
                      <span className="text-black dark:text-white text-[10px] font-bold">
                        B
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-black dark:text-white">
                      Blip Merchant
                    </span>
                  </div>

                  {/* Nav items */}
                  <div className="space-y-1">
                    {[
                      { icon: "◉", label: "Dashboard", active: true },
                      { icon: "↗", label: "Orders", active: false },
                      { icon: "◈", label: "Escrow", active: false },
                      { icon: "⬡", label: "Wallet", active: false },
                      { icon: "◎", label: "Analytics", active: false },
                      { icon: "⚙", label: "Settings", active: false },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                          item.active
                            ? "bg-black/[0.06] dark:bg-white/[0.06] text-black dark:text-white"
                            : "text-black/90 dark:text-white/60 hover:text-black/80 dark:hover:text-white/80 hover:bg-black/[0.03] dark:hover:bg-white/[0.02]"
                        }`}
                      >
                        <span className="text-xs">{item.icon}</span>
                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Bottom section */}
                  <div className="absolute bottom-6 left-4 right-4">
                    <div className="p-3 rounded-lg bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.08] dark:border-white/[0.04]">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 flex justify-center items-center rounded-full bg-gradient-to-br from-black to-black dark:from-white dark:to-white">
                          {" "}
                          <User
                            size={16}
                            className="text-white dark:text-black"
                          />
                        </div>

                        <div className="flex flex-col">
                          <div className="text-xs font-medium text-black dark:text-white flex items-center gap-1 leading-none">
                            John
                            <CheckCircle2
                              size={16}
                              className="text-blue-400 translate-y-[1px] px-2"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main content area */}
                <div className="flex-1 p-4 md:p-5 bg-[#f0f0f0] dark:bg-transparent">
                  {/* Top stats bar - premium minimal */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-black/[0.06] dark:border-white/[0.03]">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <motion.div
                          className="w-1.5 h-1.5 rounded-full bg-black/60 dark:bg-white/60"
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <span className="text-sm text-black/90 dark:text-white/60 font-medium">
                          Live
                        </span>
                      </div>
                      <div className="h-3 w-px bg-black/[0.1] dark:bg-white/[0.06]" />
                      <span className="text-sm text-black dark:text-white/50">
                        Solana Mainnet
                      </span>
                    </div>
                    {/* Search bar */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.08] dark:border-white/[0.04]">
                        <span className="text-black dark:text-white/50 text-xs">
                          ⌘K
                        </span>
                        <span className="text-xs text-black dark:text-white/50">
                          Search...
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-black/[0.04] dark:bg-white/[0.04] flex items-center justify-center">
                        <span className="text-black/90 dark:text-white/60 text-sm">
                          !
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats cards row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-4">
                    {[
                      {
                        label: "Volume",
                        value: "$55,450",
                        change: "+12%",
                        up: true,
                      },
                      {
                        label: "Earnings",
                        value: "$1,386",
                        change: "+8%",
                        up: true,
                      },
                      { label: "Orders", value: "23", change: "+5", up: true },
                      {
                        label: "Match Time",
                        value: "12s",
                        change: "-3s",
                        up: true,
                      },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="p-3 rounded-lg bg-[#efefef] dark:bg-[#0c0c0c] border border-black/[0.06] dark:border-white/[0.03]"
                      >
                        <div className="text-[8px] text-black dark:text-white/50 uppercase tracking-widest font-medium mb-0.5">
                          {stat.label}
                        </div>
                        <div className="flex items-end justify-between">
                          <div className="text-base font-semibold text-black dark:text-white tracking-tight">
                            {stat.value}
                          </div>
                          <div
                            className={`text-[10px] font-medium ${
                              stat.up
                                ? "text-black dark:text-white/50"
                                : "text-black/90 dark:text-white/50"
                            }`}
                          >
                            {stat.change}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chart area - Premium Volume Overview */}
                  <div className="mb-4 p-4 rounded-xl bg-gradient-to-br from-[#efefef] dark:from-[#0c0c0c] to-[#e5e5e5] dark:to-[#080808] border border-black/[0.15] dark:border-white/[0.04] relative overflow-hidden">
                    {/* Subtle glow effect */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-black/[0.03] dark:bg-white/[0.03] blur-[60px] rounded-full" />

                    {/* Header */}
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <div>
                        <div className="text-[10px] text-black dark:text-white/40 uppercase tracking-wider mb-1">
                          Volume Overview
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold text-black dark:text-white">
                            $55,450
                          </span>
                          <span className="text-[10px] font-medium text-black dark:text-white/50 flex items-center gap-0.5">
                            <svg
                              className="w-2.5 h-2.5"
                              viewBox="0 0 10 10"
                              fill="currentColor"
                            >
                              <path d="M5 2L8 6H2L5 2Z" />
                            </svg>
                            +12.5%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-black/[0.03] dark:bg-white/[0.03] rounded-lg p-0.5">
                        {["24h", "7d", "30d"].map((period) => (
                          <button
                            key={period}
                            className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all ${
                              period === "7d"
                                ? "bg-black/[0.1] dark:bg-white/[0.1] text-black dark:text-white shadow-sm"
                                : "text-black dark:text-white/40 hover:text-black/90 dark:hover:text-white/60"
                            }`}
                          >
                            {period}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Chart with Y-axis */}
                    <div className="flex gap-2 relative z-10">
                      {/* Y-axis labels */}
                      <div className="flex flex-col justify-between text-[8px] text-black/90 dark:text-white/50 font-mono py-1 pr-1">
                        <span>$8k</span>
                        <span>$4k</span>
                        <span>$0</span>
                      </div>

                      {/* Chart area */}
                      <div className="flex-1 relative">
                        {/* Grid lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                          <div className="h-px bg-black/[0.12] dark:bg-white/[0.03]" />
                          <div className="h-px bg-black/[0.12] dark:bg-white/[0.03]" />
                          <div className="h-px bg-black/[0.12] dark:bg-white/[0.03]" />
                        </div>

                        {/* Bars */}
                        <div className="flex items-end gap-1 h-20 relative">
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
                                    ? "bg-gradient-to-t from-black/75 dark:from-white/30 via-black/50 dark:via-white/20 to-black/25 dark:to-white/10 group-hover:from-black/85 dark:group-hover:from-white/40"
                                    : "bg-gradient-to-t from-black/60 dark:from-white/25 via-black/40 dark:via-white/15 to-black/20 dark:to-white/5 group-hover:from-black/70 dark:group-hover:from-white/35"
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
                              <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 backdrop-blur-sm text-[8px] text-black dark:text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                ${(bar.value * 80).toLocaleString()}
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {/* X-axis labels */}
                        <div className="flex justify-between mt-2 px-0.5">
                          {[
                            "Mon",
                            "Tue",
                            "Wed",
                            "Thu",
                            "Fri",
                            "Sat",
                            "Sun",
                          ].map((day, i) => (
                            <span
                              key={day}
                              className="text-[7px] text-black/90 dark:text-white/50 font-medium"
                            >
                              {day}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom stats */}
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-black/[0.08] dark:border-white/[0.04] relative z-10">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-sm bg-gradient-to-t from-black/60 dark:from-white/25 to-black/20 dark:to-white/10" />
                        <span className="text-[9px] text-black dark:text-white/40">
                          This week
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-sm bg-gradient-to-t from-black/75 dark:from-white/30 to-black/25 dark:to-white/15" />
                        <span className="text-[9px] text-black dark:text-white/40">
                          Peak days
                        </span>
                      </div>
                      <div className="ml-auto text-[9px] text-black/90 dark:text-white/50">
                        Updated 2 min ago
                      </div>
                    </div>
                  </div>

                  {/* 3-Column Dashboard Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Column 1: New Orders */}
                    <div className="rounded-lg bg-[#e9e9e9] dark:bg-[#0f0f0f] border border-black/[0.08] dark:border-white/[0.04] overflow-hidden">
                      <div className="flex items-center justify-between px-3 py-2 border-b border-black/[0.06] dark:border-white/[0.03]">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1 h-1 rounded-full bg-black/60 dark:bg-white/60" />
                          <span className="text-xs font-medium text-black dark:text-white">
                            New Orders
                          </span>
                        </div>
                        <span className="text-[10px] text-black dark:text-white/50 bg-black/[0.04] dark:bg-white/[0.04] px-1.5 py-0.5 rounded font-medium">
                          {newOrders.length}
                        </span>
                      </div>
                      <div className="p-2 space-y-1.5 max-h-[180px] overflow-y-auto scrollbar-thin scrollbar-thumb-black/10 dark:scrollbar-thumb-white/10">
                        <AnimatePresence initial={false}>
                          {newOrders.slice(0, 4).map((order, i) => (
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
                              className={`group relative p-2 rounded border transition-colors duration-300 bg-[#e3e3e3] dark:bg-[#1a1a1a] border-black/[0.1] dark:border-white/[0.06]`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-sm">{order.user}</span>
                                  <span className="text-[10px] font-mono text-black/90 dark:text-white/60">
                                    {order.id}
                                  </span>
                                </div>
                                <span className="text-sm">{order.country}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-xs font-semibold text-black dark:text-white">
                                    {order.amount}
                                  </div>
                                  <div className="text-[10px] text-black/90 dark:text-white/60">
                                    @ {order.rate}
                                  </div>
                                </div>
                                <motion.div
                                  className="px-2 py-1 rounded text-[10px] font-medium bg-black/90 dark:bg-white/90 text-white dark:text-black hover:bg-black dark:hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
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
                    <div className="rounded-lg bg-[#e9e9e9] dark:bg-[#0f0f0f] border border-black/[0.08] dark:border-white/[0.04] overflow-hidden">
                      <div className="flex items-center justify-between px-3 py-2 border-b border-black/[0.06] dark:border-white/[0.03]">
                        <div className="flex items-center gap-1.5">
                          <motion.div
                            className="w-1 h-1 rounded-full bg-black dark:bg-white"
                            animate={{ opacity: [1, 0.4, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                          <span className="text-xs font-medium text-black dark:text-white">
                            In Escrow
                          </span>
                        </div>
                        <span className="text-[10px] text-black dark:text-white/50 bg-black/[0.04] dark:bg-white/[0.04] px-1.5 py-0.5 rounded font-medium">
                          {inEscrow.length}
                        </span>
                      </div>
                      <div className="p-2 space-y-1.5 max-h-[180px] overflow-y-auto scrollbar-thin scrollbar-thumb-black/10 dark:scrollbar-thumb-white/10">
                        {inEscrow.slice(0, 4).map((order, i) => (
                          <motion.div
                            key={order.id}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                            className={`p-2 rounded border transition-colors duration-300 bg-[#e3e3e3] dark:bg-[#1a1a1a] border-black/[0.1] dark:border-white/[0.06]`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm">{order.user}</span>
                                <span className="text-[10px] font-mono text-black/90 dark:text-white/60">
                                  {order.id}
                                </span>
                              </div>
                              <span className="text-sm">{order.country}</span>
                            </div>
                            <div className="flex items-center justify-between mb-1.5">
                              <div>
                                <div className="text-xs font-semibold text-black dark:text-white">
                                  {order.amount}
                                </div>
                                <div className="text-[10px] text-black/90 dark:text-white/60">
                                  @ {order.rate}
                                </div>
                              </div>
                              <span className="text-[10px] text-black/90 dark:text-white/60">
                                {order.progress}%
                              </span>
                            </div>
                            <div className="h-1 bg-black/[0.05] dark:bg-white/[0.05] rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-black dark:bg-white rounded-full"
                                initial={{ width: 0 }}
                                whileInView={{ width: `${order.progress}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Column 3: Completed */}
                    <div className="rounded-lg bg-[#e9e9e9] dark:bg-[#0f0f0f] border border-black/[0.08] dark:border-white/[0.04] overflow-hidden">
                      <div className="flex items-center justify-between px-3 py-2 border-b border-black/[0.06] dark:border-white/[0.03]">
                        <div className="flex items-center gap-1.5">
                          <div className="w-1 h-1 rounded-full bg-black/60 dark:bg-white/60" />
                          <span className="text-xs font-medium text-black dark:text-white">
                            Completed
                          </span>
                        </div>
                        <span className="text-[10px] text-black dark:text-white/50 bg-black/[0.04] dark:bg-white/[0.04] px-1.5 py-0.5 rounded font-medium">
                          {completed.length}
                        </span>
                      </div>
                      <div className="p-2 space-y-1.5 max-h-[180px] overflow-y-auto scrollbar-thin scrollbar-thumb-black/10 dark:scrollbar-thumb-white/10">
                        {completed.slice(0, 4).map((order, i) => (
                          <motion.div
                            key={order.id}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                            className="p-2 rounded bg-[#e5e5e5] dark:bg-[#131313] border border-black/[0.08] dark:border-white/[0.04] hover:border-black/[0.12] dark:hover:border-white/[0.08] transition-colors"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm">{order.user}</span>
                                <span className="text-[10px] font-mono text-black/90 dark:text-white/60">
                                  {order.id}
                                </span>
                              </div>
                              <span className="text-[10px] text-black dark:text-white/50 font-medium">
                                ✓ Settled
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-xs font-semibold text-black dark:text-white">
                                  {order.amount}
                                </div>
                                <div className="text-[10px] text-black/90 dark:text-white/60">
                                  @ {order.rate}
                                </div>
                              </div>
                              <span className="text-[10px] text-black dark:text-white/50">
                                {order.time}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Live matching indicator */}
                  <div className="mt-4 p-3 rounded-lg bg-[#efefef] dark:bg-[#0c0c0c] border border-black/[0.08] dark:border-white/[0.03]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center">
                          <span className="text-xs">⚡</span>
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-black dark:text-white">
                            Live Matching Active
                          </div>
                          <div className="text-[10px] text-black/85 dark:text-white/60">
                            3 orders matched in 5 min
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-[8px] text-black dark:text-white/50 uppercase">
                            Avg. Time
                          </div>
                          <div className="text-xs font-semibold text-black dark:text-white">
                            12 seconds
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[8px] text-black dark:text-white/50 uppercase">
                            Success
                          </div>
                          <div className="text-xs font-semibold text-black dark:text-white/50">
                            99.8%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity, Messages & Quick Actions */}
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {/* Recent Activity */}
                    <div className="p-3 rounded-lg bg-[#efefef] dark:bg-[#0c0c0c] border border-black/[0.06] dark:border-white/[0.03]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-black dark:text-white">
                          Recent Activity
                        </span>
                        <span className="text-[10px] text-black dark:text-white/50">
                          View all
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {[
                          {
                            action: "Order completed",
                            amount: "+$240",
                            time: "2m",
                          },
                          { action: "New order", amount: "$890", time: "5m" },
                        ].map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between py-1"
                          >
                            <div className="flex items-center gap-1.5">
                              <div className="w-4 h-4 rounded bg-black/[0.04] dark:bg-white/[0.04] flex items-center justify-center text-[8px] text-black/90 dark:text-white/60">
                                ✓
                              </div>
                              <div>
                                <div className="text-[10px] text-black dark:text-white/70">
                                  {item.action}
                                </div>
                                <div className="text-[8px] text-black dark:text-white/50">
                                  {item.time}
                                </div>
                              </div>
                            </div>
                            <span className="text-[10px] text-black dark:text-white/50">
                              {item.amount}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="p-3 rounded-lg bg-[#efefef] dark:bg-[#0c0c0c] border border-black/[0.06] dark:border-white/[0.03]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-black dark:text-white">
                          Messages
                        </span>
                        <span className="text-[10px] text-black/90 dark:text-white/50 bg-black/[0.04] dark:bg-white/[0.04] px-1.5 py-0.5 rounded">
                          3
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {[
                          {
                            user: "SM",
                            name: "Sarah M.",
                            message: "Payment sent",
                            time: "1m",
                          },
                          {
                            user: "AK",
                            name: "Ahmed K.",
                            message: "Ready to trade",
                            time: "3m",
                          },
                        ].map((msg, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 p-1.5 rounded bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/[0.04] dark:hover:bg-white/[0.04] transition-colors"
                          >
                            <span className="text-sm">{msg.user}</span>
                            <div className="flex-1 min-w-0">
                              <div className="text-[10px] text-black dark:text-white font-medium truncate">
                                {msg.name}
                              </div>
                              <div className="text-[9px] text-black/90 dark:text-white/50 truncate">
                                {msg.message}
                              </div>
                            </div>
                            <span className="text-[8px] text-black dark:text-white/40">
                              {msg.time}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="p-3 rounded-lg bg-[#efefef] dark:bg-[#0c0c0c] border border-black/[0.06] dark:border-white/[0.03]">
                      <span className="text-xs font-medium text-black dark:text-white mb-2 block">
                        Quick Actions
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          { label: "Add Liquidity", icon: "+" },
                          { label: "Withdraw", icon: "↓" },
                          { label: "Set Rates", icon: "⚙" },
                          { label: "Reports", icon: "◎" },
                        ].map((action) => (
                          <button
                            key={action.label}
                            className="p-2 rounded bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.08] dark:border-white/[0.04] hover:bg-black/[0.06] dark:hover:bg-white/[0.06] transition-colors text-left"
                          >
                            <div className="text-[8px] text-black/90 dark:text-white/60">
                              {action.icon}
                            </div>
                            <div className="text-[10px] text-black/90 dark:text-white/70">
                              {action.label}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating notification */}
            <AnimatePresence>
              {notification.visible && (
                <motion.div
                  initial={{ opacity: 0, x: 40, y: -10 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, x: 40, y: -10 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="absolute right-6 top-24 hidden lg:block z-50"
                >
                  <div className="p-4 pr-5 rounded-xl bg-[#efefef] dark:bg-[#0d0d0d] border border-black/[0.08] dark:border-white/[0.04] shadow-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center">
                        <span className="text-lg">!</span>
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-black dark:text-white">
                          {notification.title}
                        </div>
                        <div className="text-xs text-black/90 dark:text-white/60">
                          {notification.desc}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Cinematic glow effect */}
            <div
              className="absolute -bottom-20 left-1/2 w-[70%] h-40 blur-[100px] opacity-[0.07]"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(255,255,255,0.8), transparent 70%)",
                transform: "translateX(-50%)",
              }}
            />
          </motion.div>
        </div>{" "}
      </motion.div>
    </section>
  );
};

export default MerchantHeroDashbaord;
