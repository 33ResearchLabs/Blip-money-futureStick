import { memo, useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Inbox,
  Loader2,
  TrendingUp,
  LayoutDashboard,
  Wallet,
  Activity,
} from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ────────────────────────────────────────────────────────────
   Order pool — new orders are picked from here and animated
   through Incoming → Settling → Settled.
   ──────────────────────────────────────────────────────────── */
type Order = {
  id: string;
  pair: string;
  amount: string;
  payout: string;
  rate: string;
  merchant: string;
  profit: string;
  time: string;
};

const ORDER_POOL: Omit<Order, "id" | "time">[] = [
  { pair: "USDT → INR", amount: "$2,400", payout: "₹2,14,608", rate: "₹89.42", merchant: "AlphaFX", profit: "+$4.20" },
  { pair: "USDT → AED", amount: "$5,100", payout: "AED 18,720", rate: "3.671", merchant: "GulfTrade", profit: "+$9.18" },
  { pair: "USDT → PHP", amount: "$850", payout: "₱47,438", rate: "55.81", merchant: "NovaP2P", profit: "+$1.53" },
  { pair: "USDC → INR", amount: "$1,200", payout: "₹1,07,304", rate: "₹89.42", merchant: "SwiftExch", profit: "+$2.16" },
  { pair: "USDT → THB", amount: "$3,400", payout: "฿120,360", rate: "35.4", merchant: "CedarFX", profit: "+$6.12" },
  { pair: "USDT → INR", amount: "$1,800", payout: "₹1,60,956", rate: "₹89.42", merchant: "AlphaFX", profit: "+$3.24" },
  { pair: "USDC → AED", amount: "$4,700", payout: "AED 17,250", rate: "3.671", merchant: "GulfTrade", profit: "+$8.46" },
  { pair: "USDT → PHP", amount: "$650", payout: "₱36,277", rate: "55.81", merchant: "NovaP2P", profit: "+$1.17" },
];

function makeOrder(seq: number): Order {
  const seed = ORDER_POOL[seq % ORDER_POOL.length];
  return {
    ...seed,
    id: `ord-${seq}`,
    time: "Just now",
  };
}

const DashboardPreviewSection = () => {
  /* Three-slot pipeline: [incoming, settling, settled].
     Every cycle: settled exits → settling → settled, incoming → settling,
     new order arrives at incoming. */
  const [orders, setOrders] = useState<Order[]>([
    makeOrder(0),
    makeOrder(1),
    makeOrder(2),
  ]);
  const seqRef = useRef(3);

  useEffect(() => {
    const id = setInterval(() => {
      setOrders((prev) => {
        const next = makeOrder(seqRef.current);
        seqRef.current += 1;
        return [next, prev[0], prev[1]]; // shift right
      });
    }, 2600);
    return () => clearInterval(id);
  }, []);

  /* Stage labels keyed by index */
  const stages = ["incoming", "settling", "settled"] as const;

  return (
    <section className="relative bg-black text-white overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-24 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.95) 0%, transparent 100%)",
        }}
      />

      <div className="relative z-10 max-w-[1240px] mx-auto px-6 md:px-10 pt-20 pb-28 md:pt-28 md:pb-36">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="flex items-center justify-center gap-2.5 mb-6"
        >
          <span className="w-6 h-px bg-white/20" />
          <span className="text-[10.5px] font-semibold tracking-[0.3em] uppercase text-white/45">
            Merchant Dashboard
          </span>
          <span className="w-6 h-px bg-white/20" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE, delay: 0.08 }}
          className="font-display text-white text-center max-w-[640px] mx-auto mb-5"
          style={{
            fontSize: "clamp(2rem, 4.4vw, 3.4rem)",
            fontWeight: 500,
            lineHeight: 1.06,
            letterSpacing: "-0.04em",
          }}
        >
          The other side of every settlement.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.18 }}
          className="text-center text-white/50 max-w-[520px] mx-auto leading-[1.6] text-[15px] md:text-[16px] mb-16 md:mb-20"
        >
          Orders enter the market, route to the best merchant, and settle
          on-chain — live, in seconds.
        </motion.p>

        {/* Dashboard frame */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ duration: 1.1, ease: EASE }}
          className="relative rounded-[28px] overflow-hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.01) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow:
              "0 40px 90px -32px rgba(0,0,0,0.7), 0 1px 0 rgba(255,255,255,0.05) inset",
          }}
        >
          {/* Chrome bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-black/40 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
              </div>
              <span className="ml-2 text-[10px] font-mono tracking-tight text-white/35 hidden sm:inline">
                app.blip.money/merchant
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inset-0 rounded-full bg-[#3ddc84] opacity-60 animate-ping" />
                <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-[#3ddc84]" />
              </span>
              <span className="text-[9.5px] font-semibold tracking-[0.22em] uppercase text-white/50">
                Live
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[180px_1fr]">
            {/* Sidebar */}
            <aside className="hidden md:flex md:flex-col border-r border-white/[0.05] bg-black/30 px-4 py-6 gap-1">
              <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
              <SidebarItem icon={Inbox} label="Orders" badge="12" />
              <SidebarItem icon={Activity} label="Spreads" />
              <SidebarItem icon={Wallet} label="Earnings" />
              <SidebarItem icon={TrendingUp} label="Reputation" />

              <div className="mt-auto pt-6 border-t border-white/[0.05]">
                <div className="text-[9px] font-semibold tracking-[0.22em] uppercase text-white/30 mb-2">
                  Today
                </div>
                <div className="text-[10.5px] text-white/45 leading-relaxed space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Filled</span>
                    <span className="font-mono text-white/85 tabular-nums">24</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Volume</span>
                    <span className="font-mono text-white/85 tabular-nums">$84.2K</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Spread</span>
                    <span className="font-mono text-[#3ddc84] tabular-nums">+0.18%</span>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main */}
            <div className="px-5 py-6 md:px-7 md:py-7">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-[15px] font-semibold tracking-tight text-white">
                    Order flow
                  </h3>
                  <p className="text-[11.5px] text-white/45 mt-0.5">
                    Auto-advancing live demo
                  </p>
                </div>
                <div className="hidden md:flex items-center gap-1.5 text-[10px] tracking-tight">
                  <span className="text-white/40">Refresh</span>
                  <span className="font-mono text-white/65 tabular-nums">2.6s</span>
                </div>
              </div>

              {/* Auto-flowing pipeline */}
              <div
                className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 relative"
                style={{ minHeight: 240 }}
              >
                {orders.map((order, slotIdx) => (
                  <motion.div
                    key={`slot-${slotIdx}`}
                    className="relative"
                  >
                    <AnimatePresence mode="popLayout">
                      <OrderCard
                        key={order.id}
                        order={order}
                        stage={stages[slotIdx]}
                      />
                    </AnimatePresence>
                    {/* Arrow between slots */}
                    {slotIdx < 2 && (
                      <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 items-center justify-center">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center"
                          style={{
                            background: "rgba(8,12,20,0.92)",
                            border: "1px solid rgba(255,255,255,0.10)",
                          }}
                        >
                          <ArrowRight className="w-3 h-3 text-white/55" />
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 md:gap-4">
                <Stat label="Avg fill time" value="42s" hint="↓ 3s vs market" />
                <Stat label="Win rate" value="68%" hint="Top decile" />
                <Stat label="Today's earnings" value="$142.80" hint="+12% wow" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
          className="mt-12 md:mt-14 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            to="/merchant"
            className="group inline-flex items-center justify-center gap-2 h-[48px] px-6 rounded-full bg-white text-black text-[14px] font-semibold tracking-tight transition-all duration-300 hover:-translate-y-[1px] active:scale-[0.985] shadow-[0_8px_28px_-10px_rgba(255,255,255,0.25)]"
          >
            Become a merchant
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
          <span className="text-[12px] text-white/45">
            Or{" "}
            <Link
              to="/how-it-works"
              className="text-white/70 hover:text-white underline-offset-2 hover:underline"
            >
              see how routing works
            </Link>
          </span>
        </motion.div>
      </div>
    </section>
  );
};

function SidebarItem({
  icon: Icon,
  label,
  active,
  badge,
}: {
  icon: typeof Inbox;
  label: string;
  active?: boolean;
  badge?: string;
}) {
  return (
    <div
      className={`flex items-center justify-between px-3 py-2 rounded-lg text-[12px] tracking-tight ${
        active ? "bg-white/[0.06] text-white" : "text-white/55 hover:bg-white/[0.03]"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <Icon className="w-3.5 h-3.5" strokeWidth={2} />
        <span className="font-medium">{label}</span>
      </div>
      {badge && (
        <span className="font-mono text-[9.5px] font-semibold text-white/60 px-1.5 py-0.5 rounded bg-white/[0.06] tabular-nums">
          {badge}
        </span>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Order card — stage prop drives the chip + accent.
   AnimatePresence handles entry/exit smoothly.
   ──────────────────────────────────────────────────────────── */
function OrderCard({
  order,
  stage,
}: {
  order: Order;
  stage: "incoming" | "settling" | "settled";
}) {
  const palette =
    stage === "incoming"
      ? {
          chip: "rgba(110,170,255,0.12)",
          chipBorder: "rgba(110,170,255,0.28)",
          chipText: "#a8c8ff",
          dot: "#6eaaff",
          label: "New order",
        }
      : stage === "settling"
        ? {
            chip: "rgba(255,180,100,0.10)",
            chipBorder: "rgba(255,180,100,0.28)",
            chipText: "#ffc790",
            dot: "#ffb872",
            label: "Settling",
          }
        : {
            chip: "rgba(80,220,150,0.10)",
            chipBorder: "rgba(80,220,150,0.28)",
            chipText: "#7be5ad",
            dot: "#50dc96",
            label: "Settled",
          };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.97 }}
      transition={{ duration: 0.55, ease: EASE }}
      className="relative rounded-2xl overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.015) 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="px-4 py-4 md:px-5 md:py-5">
        {/* Chip + time */}
        <div className="flex items-center justify-between mb-4">
          <motion.div
            layout
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full"
            style={{
              background: palette.chip,
              border: `1px solid ${palette.chipBorder}`,
            }}
          >
            {stage === "settling" ? (
              <Loader2
                className="w-3 h-3 animate-spin"
                style={{ color: palette.chipText }}
                strokeWidth={2.5}
              />
            ) : stage === "settled" ? (
              <CheckCircle2
                className="w-3 h-3"
                style={{ color: palette.chipText }}
                strokeWidth={2.5}
              />
            ) : (
              <motion.span
                animate={{ scale: [0.8, 1.25, 1], opacity: [0.6, 1, 0.95] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                className="block w-1.5 h-1.5 rounded-full"
                style={{ background: palette.dot }}
              />
            )}
            <span
              className="text-[9.5px] font-semibold tracking-[0.18em] uppercase"
              style={{ color: palette.chipText }}
            >
              {palette.label}
            </span>
          </motion.div>
          <span className="text-[10px] font-medium text-white/35 tracking-tight">
            {stage === "settled" ? "42s" : stage === "settling" ? "23s" : "Just now"}
          </span>
        </div>

        {/* Pair */}
        <div className="font-mono text-[11.5px] font-semibold tracking-tight text-white/55 mb-2">
          {order.pair}
        </div>

        {/* Payout */}
        <div className="mb-4">
          <div className="font-mono text-[20px] md:text-[22px] font-semibold tracking-tight text-white tabular-nums">
            {order.payout}
          </div>
          <div className="text-[11px] text-white/40 mt-0.5 tracking-tight">
            from {order.amount}
          </div>
        </div>

        {/* Rate / Merchant / Profit */}
        <div className="space-y-1.5 pt-3 border-t border-white/[0.05] text-[10.5px] tracking-tight">
          <Row label="Rate" value={order.rate} mono />
          <Row label="Merchant" value={order.merchant} />
          {/* Profit only revealed when settled — clean payoff moment */}
          {stage === "settled" && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
              className="flex items-center justify-between pt-1.5 mt-1.5 border-t border-white/[0.05]"
            >
              <span className="text-white/50">Merchant profit</span>
              <span className="font-mono font-semibold tabular-nums text-[#7be5ad]">
                {order.profit}
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/45">{label}</span>
      <span
        className={`${mono ? "font-mono" : ""} text-white/85 ${mono ? "tabular-nums" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-xl px-3.5 py-3 border border-white/[0.06] bg-white/[0.018]">
      <div className="text-[9px] font-semibold tracking-[0.2em] uppercase text-white/35 mb-1">
        {label}
      </div>
      <div className="font-mono text-[15px] font-semibold tabular-nums text-white tracking-tight">
        {value}
      </div>
      <div className="text-[10px] text-white/35 mt-0.5 tracking-tight">{hint}</div>
    </div>
  );
}

export default memo(DashboardPreviewSection);
