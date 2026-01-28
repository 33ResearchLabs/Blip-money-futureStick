import { useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const defaultEscrowOrders = [
  {
    id: "ESC-1001",
    user: "🦊",
    userName: "John D.",
    amount: "750 USDT",
    rate: "1,619 AED",
    time: "1m",
    country: "🇦🇪",
    status: "escrow",
    progress: 60,
    description: "Business settlement",
    priority: "medium",
  },
  {
    id: "ESC-1002",
    user: "🐼",
    userName: "Emily R.",
    amount: "1,100 USDT",
    rate: "1,620 AED",
    time: "3m",
    country: "🇦🇪",
    status: "escrow",
    progress: 40,
    description: "Quick cash out",
    priority: "high",
  },
];

const defaultCompletedOrders = [
  {
    id: "CMP-2001",
    user: "🐸",
    userName: "Ahmed K.",
    amount: "500 USDT",
    rate: "1,618 AED",
    time: "just settled",
    country: "🇦🇪",
    status: "completed",
    progress: 100,
    description: "Personal remittance",
    priority: "low",
  },
];

// Standalone mockup without section wrapper
export const MerchantDashboardIndex = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [newOrders, setNewOrders] = useState([
    {
      id: "ORD-7821",
      user: "🦁",
      amount: "500 USDT",
      rate: "1,620 AED",
      time: "2m",
      country: "🇦🇪",
    },
    {
      id: "ORD-7820",
      user: "🐯",
      amount: "1,200 USDT",
      rate: "1,618 AED",
      time: "5m",
      country: "🇦🇪",
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
      amount: `${Math.floor(100 + Math.random() * 1500)} USDT`,
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

  useEffect(() => {
    const interval = setInterval(() => {
      const order = generateOrder();
      setNewOrders((prev) => {
        if (prev.length >= 3) return prev;
        return [order, ...prev];
      });
      showNotification("New order received", "Waiting for merchant action");
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const [inEscrow, setInEscrow] = useState<any[]>(defaultEscrowOrders);
  const [completed, setCompleted] = useState<any[]>(defaultCompletedOrders);

  const [notification, setNotification] = useState({
    visible: false,
    title: "",
    desc: "",
  });

  const acceptOrder = (order: any) => {
    setNewOrders((prev) => prev.filter((o) => o.id !== order.id));
    setInEscrow((prev) => [{ ...order, progress: 60 }, ...prev]);
    showNotification("Order moved to escrow", `${order.amount} secured`);
  };

  const releaseOrder = (order: any) => {
    setInEscrow((prev) => prev.filter((o) => o.id !== order.id));
    setCompleted((prev) => [...prev, order]);
    showNotification("Order completed", `${order.amount} settled`);
  };

  const showNotification = (title: string, desc: string) => {
    setNotification({ visible: true, title, desc });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, visible: false }));
    }, 2000);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setNewOrders((prev) => {
        if (prev.length === 0) return prev;
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
            ...completedOrders.map((o) => ({ ...o, time: "just settled" })),
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

  return (
    <motion.div
      ref={containerRef}
      className="
        relative mx-auto w-full
        h-[450px] sm:h-[550px] lg:h-[710px]
      "
      style={
        {
          // perspective: "600px",
        }
      }
    >
      {/* Browser Window */}
      <motion.div
        style={{ transformPerspective: 1200, transformStyle: "preserve-3d" }}
        className="
        w-full
        h-full
        min-h-full
        max-h-full
        rounded-2xl
        overflow-hidden
        bg-gradient-to-br from-[#0a0a0a] via-[#0d0d0d] to-[#080808]
        border border-white/10
        shadow-2xl shadow-white/10
        flex flex-col
      "
      >
        {/* Browser Header - Enhanced */}
        <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-[#111111] to-[#0a0a0a] border-b border-white/[0.06]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28ca42]" />
          </div>

          <div className="flex-1 flex justify-center">
            <div className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-white/5 to-black/40 border border-white/10 text-xs text-white/40 font-medium">
              merchant.blipprotocol.com
            </div>
          </div>

          <div className="w-16" />
        </div>

        {/* ---------------- CONTENT ---------------- */}
        <div className="flex-1 p-4 sm:p-6 flex flex-col">
          {/* Top stats - Enhanced */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06] text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#28ca42]" />
              <span className="text-white/60 font-medium">
                Live · Solana Mainnet
              </span>
            </div>
            <div className="flex gap-6 text-right">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="cursor-pointer"
              >
                <div className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">
                  Volume
                </div>
                <div className="text-sm text-white font-bold">$55,450</div>
              </motion.div>
              <div className="h-6 w-px bg-white/10" />
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="cursor-pointer"
              >
                <div className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">
                  Earnings
                </div>
                <div className="text-sm text-emerald-400 font-bold">+$1,386</div>
              </motion.div>
            </div>
          </div>

          {/* ---------------- GRID ---------------- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 flex-1">
            {/* Column Wrapper */}
            {[
              { title: "New Orders", data: newOrders },
              { title: "In Escrow", data: inEscrow },
              { title: "Completed", data: completed },
            ].map((col, idx) => (
              <div
                key={col.title}
                className="rounded-lg sm:rounded-xl bg-[#0d0d0d] border border-white/[0.04] flex flex-col min-h-0"
              >
                <div className="px-3 sm:px-4 py-3 sm:py-4 border-b border-white/[0.06] flex justify-between items-center bg-gradient-to-r from-white/[0.03] to-transparent">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        idx === 0
                          ? "bg-white/60"
                          : idx === 1
                            ? "bg-yellow-500"
                            : "bg-[#28ca42]"
                      }`}
                    />
                    <span className="text-xs sm:text-sm font-bold text-white truncate">
                      {col.title}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold ml-2 px-2 py-1 rounded-full ${
                      idx === 0
                        ? "bg-white/10 text-white/60"
                        : idx === 1
                          ? "bg-yellow-500/20 text-yellow-500"
                          : "bg-[#28ca42]/20 text-[#28ca42]"
                    }`}
                  >
                    {col.data.length}
                  </span>
                </div>

                <div className="overflow-hidden p-2 sm:p-3 space-y-2 min-h-[450px] max-h-[380px]">
                  <AnimatePresence mode="sync">
                    {col.data.slice(0, 3).map((order: any) => (
                      <motion.div
                        key={order.id}
                        initial={{
                          opacity: 0,
                          y: -12,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          y: -20,
                          filter: "blur(6px)",
                        }}
                        transition={{
                          opacity: { duration: 0.4, ease: "easeOut" },
                          y: { duration: 0.5, ease: "easeOut" },
                          filter: { duration: 0.4, ease: "easeOut" },
                        }}
                        whileHover={{
                          backgroundColor: "rgba(255, 255, 255, 0.03)",
                          transition: { duration: 0.2 },
                        }}
                        className="relative p-3 rounded-lg bg-gradient-to-r from-[#111111] to-[#0d0d0d] border border-white/10 hover:border-white/20 transition-all group cursor-pointer"
                      >
                        <div className="flex justify-between mb-2">
                          <span className="text-lg sm:text-xl font-bold">
                            {order.user}
                          </span>
                          <span className="text-xs text-white/50 bg-white/5 px-2 py-1 rounded-full">
                            {order.country}
                          </span>
                        </div>
                        <div className="flex md:flex-col justify-between items-start gap-2 mb-2">
                          <div className="min-w-0">
                            <div className="text-xs sm:text-sm font-bold text-white truncate">
                              {order.amount}
                            </div>
                            <div className="text-xs text-white/40 font-medium">
                              @ {order.rate}
                            </div>
                          </div>
                        </div>

                        {idx === 0 && (
                          <motion.button
                            onClick={() => acceptOrder(order)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full text-xs font-bold bg-white text-black px-2 sm:px-3 py-2 sm:py-2 rounded-lg flex-shrink-0 whitespace-nowrap"
                          >
                            Accept
                          </motion.button>
                        )}

                        {idx === 1 && (
                          <motion.button
                            onClick={() => releaseOrder(order)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full text-xs font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-2 sm:px-3 py-2 sm:py-2 rounded-lg flex-shrink-0 whitespace-nowrap"
                          >
                            Release
                          </motion.button>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Notification - Enhanced */}
      <AnimatePresence>
        {notification.visible && (
          <motion.div
            initial={{ opacity: 0, x: 30, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 30, y: -20 }}
            className="absolute top-6 right-6 z-50"
          >
            <div className="bg-gradient-to-r from-[#111111] to-[#0d0d0d] border border-white/20 rounded-xl px-4 py-3 text-sm text-white shadow-xl shadow-white/10">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-white/60" />
                <div className="font-bold text-sm text-white">
                  {notification.title}
                </div>
              </div>
              <div className="text-white/50 text-xs ml-4">
                {notification.desc}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const MerchantDashboardVisual = () => {
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
    {
      id: "ORD-7819",
      user: "🦊",
      userName: "Lisa T.",
      amount: "250 USDT",
      rate: "3.67 AED",
      time: "8m",
      country: "🇦🇪",
      status: "new",
      description: "Quick cash out",
      priority: "low",
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
    {
      id: "ORD-7819",
      user: "🦊",
      userName: "Lisa T.",
      amount: "250 USDT",
      rate: "3.67 AED",
      time: "8m",
      country: "🇦🇪",
      status: "new",
      description: "Quick cash out",
      priority: "low",
    },
  ]);

  const mockUsers = ["🦁", "🐯", "🦊", "🐼", "🐸"];
  const mockCountries = ["🇦🇪"]; // ✅ only AED region
  const mockRates = ["1,620 AED", "1,618 AED", "3.67 AED"];

  const generateOrder = () => {
    const id = `ORD-${Date.now()}-${Math.floor(Math.random() * 100)}`;

    return {
      id,
      user: mockUsers[Math.floor(Math.random() * mockUsers.length)],
      amount: `${Math.floor(100 + Math.random() * 1500)} USDT`,
      rate: mockRates[Math.floor(Math.random() * mockRates.length)],
      time: "just now",
      country: mockCountries[Math.floor(Math.random() * mockCountries.length)],
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
      className="relative py-12 md:py-48 bg-black overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-white/[0.02] blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-white/[0.01] blur-[120px]" />
      </div>

      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6"
        style={{ opacity }}
      >
        {/* Merchant Dashboard Browser Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ scale }}
          className="relative"
        >
          {/* Browser window chrome with 3D tilt effect */}
          <motion.div
            initial={{ rotateX: 3, rotateY: -3 }}
            whileHover={{ rotateX: 0, rotateY: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{
              transformStyle: "preserve-3d",
              perspective: "1200px",
            }}
            className="rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0a0a0a] shadow-2xl"
          >
            {/* Browser header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-[#111111] border-b border-white/[0.06]">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28ca42]" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-black/40 border border-white/[0.06]">
                  <div className="w-3 h-3 rounded-full bg-white/10 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
                  </div>
                  <span className="text-xs text-white/40">
                    merchant.blipprotocol.com
                  </span>
                </div>
              </div>
              <div className="w-16" />
            </div>

            {/* Dashboard content */}
            <div className="p-4 md:p-6">
              {/* Top stats bar */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.04]">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-2 h-2 rounded-full bg-[#28ca42]"
                      animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-sm text-white/50 font-medium">
                      Live
                    </span>
                  </div>
                  <div className="h-4 w-px bg-white/10" />
                  <span className="text-sm text-white/30">
                    Connected to Solana Mainnet
                  </span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-xs text-white/30 uppercase tracking-wider font-semibold">
                      Today's Volume
                    </div>
                    <div className="text-lg font-semibold text-white">
                      $55,450
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-white/30 uppercase tracking-wider font-semibold">
                      Earnings
                    </div>
                    <div className="text-lg font-semibold text-emerald-400">
                      +$1,386
                    </div>
                  </div>
                </div>
              </div>

              {/* 3-Column Dashboard Layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Column 1: New Orders */}
                <div className="rounded-xl bg-[#0d0d0d] border border-white/[0.04] overflow-hidden flex flex-col h-[520px]">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.04]">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-white/60" />
                      <span className="text-base font-semibold text-white">
                        New Orders
                      </span>
                    </div>
                    <span className="text-sm text-white/30 bg-white/[0.05] px-2 py-0.5 rounded-full font-medium">
                      {newOrders.length}
                    </span>
                  </div>
                  <div className="flex-1 p-3 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
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
                          className="group relative h-[92px] p-3 rounded-lg border transition-colors duration-300 bg-[#111111] border-white/[0.04]"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{order.user}</span>
                              <span
                                className={`text-xs font-mono text-white/40`}
                              >
                                {order.id}
                              </span>
                            </div>
                            <span className="text-xl">{order.country}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-base font-semibold text-white">
                                {order.amount}
                              </div>
                              <div className="text-sm text-white/40">
                                @ {order.rate}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-white/30">
                                {order.time}
                              </span>
                              <motion.div
                                className="px-3 py-1.5 rounded-md text-sm font-medium bg-white text-black opacity-0 group-hover:opacity-100 transition-opacity"
                                whileHover={{ scale: 1.05 }}
                                onClick={() => acceptOrder(order)}
                              >
                                Accept
                              </motion.div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Column 2: In Escrow */}
                <div className="rounded-xl bg-[#0d0d0d] border border-white/[0.04] overflow-hidden flex flex-col h-[520px]">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.04]">
                    <div className="flex items-center gap-2">
                      <motion.div
                        className="w-2 h-2 rounded-full bg-yellow-500"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <span className="text-base font-semibold text-white">
                        In Escrow
                      </span>
                    </div>
                    <span className="text-sm text-white/30 bg-white/[0.05] px-2 py-0.5 rounded-full font-medium">
                      {inEscrow.length}
                    </span>
                  </div>
                  <div className="flex-1 p-3 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                    {inEscrow.slice(0, 4).map((order, i) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                        className="group relative h-[92px] p-3 rounded-lg border transition-colors duration-300 bg-[#111111] border-white/[0.04]"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{order.user}</span>
                            <span className={`text-xs font-mono text-white/40`}>
                              {order.id}
                            </span>
                          </div>
                          <span className="text-xl">{order.country}</span>
                        </div>
                        <div className="mb-3">
                          <div className="text-base font-semibold text-white">
                            {order.amount}
                          </div>
                          <div className="text-sm text-white/40">
                            @ {order.rate}
                          </div>
                        </div>
                        {/* Progress bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-white/30 font-medium">
                              Settlement progress
                            </span>
                            <span className="text-yellow-500 font-semibold">
                              {order.progress}%
                            </span>
                          </div>
                          <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-yellow-500 rounded-full"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${order.progress}%` }}
                              viewport={{ once: true }}
                              transition={{
                                duration: 1,
                                delay: 0.6 + i * 0.1,
                                ease: [0.16, 1, 0.3, 1],
                              }}
                            />
                          </div>
                        </div>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          onClick={() => releaseOrder(order)}
                          className="mt-3 text-center px-3 py-1.5 rounded-md text-sm font-medium bg-yellow-500 text-black cursor-pointer"
                        >
                          Release
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Column 3: Completed */}
                <div className="rounded-xl bg-[#0d0d0d] border border-white/[0.04] overflow-hidden flex flex-col h-[520px]">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.04]">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#28ca42]" />
                      <span className="text-base font-semibold text-white">
                        Completed
                      </span>
                    </div>
                    <span className="text-sm text-white/30 bg-white/[0.05] px-2 py-0.5 rounded-full font-medium">
                      {completed.length}
                    </span>
                  </div>
                  <div className="flex-1 p-3 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                    {completed.slice(0, 4).map((order, i) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                        className="group relative h-[92px] p-3 rounded-lg border transition-colors duration-300 bg-[#111111] border-white/[0.04]"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{order.user}</span>
                            <span className="text-xs font-mono text-white/40">
                              {order.id}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-[#28ca42] font-semibold">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span>Settled</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-base font-semibold text-white">
                              {order.amount}
                            </div>
                            <div className="text-sm text-white/40">
                              @ {order.rate}
                            </div>
                          </div>
                          <span className="text-xs text-white/30">
                            {order.time}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live matching indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="mt-6 p-4 rounded-xl bg-gradient-to-r from-white/[0.03] to-transparent border border-white/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="relative w-10 h-10 rounded-full bg-white/5 flex items-center justify-center"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <motion.div
                        className="absolute inset-0 rounded-full border border-white/20"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <svg
                        className="w-5 h-5 text-white/60"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </motion.div>
                    <div>
                      <div className="text-base font-semibold text-white">
                        Live Matching Active
                      </div>
                      <div className="text-sm text-white/40">
                        3 orders matched in the last 5 minutes
                      </div>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-white/30 uppercase tracking-wider font-semibold">
                        Avg. Match Time
                      </div>
                      <div className="text-lg font-semibold text-white">
                        12 seconds
                      </div>
                    </div>
                    <div className="h-8 w-px bg-white/10" />
                    <div className="text-right">
                      <div className="text-xs text-white/30 uppercase tracking-wider font-semibold">
                        Success Rate
                      </div>
                      <div className="text-lg font-semibold text-[#28ca42]">
                        99.8%
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

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
                <div className="p-3 pr-4 rounded-xl bg-[#111111] border border-white/[0.08] shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                      <span className="text-lg">🔔</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">
                        {notification.title}
                      </div>
                      <div className="text-xs text-white/40">
                        {notification.desc}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reflection effect */}
          <div
            className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[80%] h-20 blur-2xl opacity-20"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)",
            }}
          />
        </motion.div>

        {/* Bottom feature highlights */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
        >
          {[
            {
              title: "Set Your Rates",
              desc: "Full control over your exchange rates. Compete for the best deals.",
            },
            {
              title: "Instant Settlement",
              desc: "Funds released immediately after confirmation. No waiting.",
            },
            {
              title: "2.5% Rewards",
              desc: "Earn Blip tokens on every successful transaction you complete.",
            },
          ].map((feature, i) => (
            <div
              key={feature.title}
              className="text-center p-6 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/20 transition-colors"
            >
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-base text-white/40">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};
