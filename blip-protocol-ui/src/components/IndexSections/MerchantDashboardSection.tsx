import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { MerchantDashboardVisual } from "../MerchantDashboard";

/* ============================================
   SECTION 6.5: MERCHANT DASHBOARD - Linear.app style
   ============================================ */

export const MerchantDashboardSection = () => {
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
  ]);

  const mockUsers = ["🦁", "🐯", "🦊", "🐼", "🐸"];
  const mockCountries = ["🇦🇪"]; // ✅ only AED region
  const mockRates = ["1,620 AED", "1,618 AED", "3.67 AED"];

  const generateOrder = () => {
    const id = `ORD-${Date.now()}-${Math.floor(Math.random() * 100)}`;
    const userIdx = Math.floor(Math.random() * mockUsers.length);
    const user = mockUsers[userIdx];
    const userNames = [
      "Sarah M.",
      "Ahmed K.",
      "Lisa T.",
      "Panda P.",
      "Froggy F.",
    ];
    const priorities = ["high", "medium", "low"];
    const descriptions = [
      "Crypto to cash transfer - Dubai",
      "Bulk exchange request",
      "Quick cash out",
      "Standard order",
      "Express payout",
    ];

    return {
      id,
      user,
      userName: userNames[userIdx % userNames.length],
      amount: `${Math.floor(100 + Math.random() * 1500)} USDT`,
      rate: mockRates[Math.floor(Math.random() * mockRates.length)],
      time: "just now",
      country: mockCountries[Math.floor(Math.random() * mockCountries.length)],
      status: "new",
      description: descriptions[userIdx % descriptions.length],
      priority: priorities[userIdx % priorities.length],
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

  const [inEscrow, setInEscrow] = useState<any[]>([]);
  const [completed, setCompleted] = useState<any[]>([]);

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
      className="relative py-12 md:py-48 bg-transparent overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full " />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full  " />
      </div>

      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6"
        style={{ opacity }}
      >
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/20" />
            <span className="text-[11px] uppercase tracking-[0.4em] text-white/30 font-light">
              For Merchants
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/20" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-semibold text-white tracking-tight leading-[1.1] mb-6"
          >
            Live matching.
            <br />
            <span className="text-white/20">Instant profits.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg text-white/40 max-w-2xl mx-auto"
          >
            Real-time order matching. Set your rates. Accept orders. Get paid
            instantly. No custody, no risk.
          </motion.p>
        </div>

        {/* Merchant Dashboard Browser Mockup */}
        <MerchantDashboardVisual />

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
              <h3 className="text-base font-medium text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-white/40">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default MerchantDashboardSection;
