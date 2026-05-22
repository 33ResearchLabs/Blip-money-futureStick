import { useEffect, useRef, useState, memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, TrendingUp, Globe2, Activity } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ────────────────────────────────────────────────────────────
   Demonstrative corridor exemplars — accurate approximations
   of Blip's product, NOT live counters. Numbers rotate slowly
   to create "alive" feel without fabricating metrics.
   ──────────────────────────────────────────────────────────── */
const SETTLEMENT_EVENTS = [
  { pair: "USDT → INR", rail: "UPI", region: "Mumbai", time: "42s", amount: "$2,400" },
  { pair: "USDT → AED", rail: "Aani", region: "Dubai", time: "38s", amount: "$5,100" },
  { pair: "USDT → PHP", rail: "GCash", region: "Manila", time: "55s", amount: "$850" },
  { pair: "USDC → INR", rail: "IMPS", region: "Bangalore", time: "48s", amount: "$1,200" },
  { pair: "USDT → THB", rail: "PromptPay", region: "Bangkok", time: "51s", amount: "$3,400" },
  { pair: "USDT → INR", rail: "UPI", region: "Delhi", time: "39s", amount: "$1,800" },
  { pair: "USDC → AED", rail: "Aani", region: "Abu Dhabi", time: "44s", amount: "$4,700" },
  { pair: "USDT → PHP", rail: "Maya", region: "Cebu", time: "53s", amount: "$650" },
];

const OPPORTUNITY_FEED = [
  { type: "spread", label: "USDT → INR premium widening", value: "+0.8%", trend: "up" },
  { type: "speed", label: "Fastest corridor today", value: "USDT → AED · 32s avg", trend: "neutral" },
  { type: "demand", label: "Bangalore payout demand", value: "↑ 2.3×", trend: "up" },
  { type: "spread", label: "USDC → PHP spread", value: "0.18%", trend: "down" },
  { type: "speed", label: "Mumbai UPI completion", value: "98.4%", trend: "up" },
  { type: "demand", label: "Dubai cash desks active", value: "12 live", trend: "neutral" },
];

/* World-map node anchors (rough lat-lng → percent coords on a Mercator-ish frame) */
const NODES = [
  { id: "MUM", name: "Mumbai", x: 71, y: 55, intensity: 1 },
  { id: "DEL", name: "Delhi", x: 70, y: 47, intensity: 0.9 },
  { id: "BLR", name: "Bangalore", x: 71.5, y: 60, intensity: 0.85 },
  { id: "DXB", name: "Dubai", x: 63, y: 52, intensity: 0.95 },
  { id: "AUH", name: "Abu Dhabi", x: 62.5, y: 53.5, intensity: 0.8 },
  { id: "MNL", name: "Manila", x: 86, y: 60, intensity: 0.7 },
  { id: "BKK", name: "Bangkok", x: 81, y: 60, intensity: 0.6 },
  { id: "SIN", name: "Singapore", x: 81.5, y: 67, intensity: 0.7 },
  { id: "LON", name: "London", x: 48, y: 38, intensity: 0.5 },
  { id: "NYC", name: "New York", x: 26, y: 45, intensity: 0.55 },
];

/* Active corridor arcs — between nodes */
const ARCS: { from: string; to: string }[] = [
  { from: "DXB", to: "MUM" },
  { from: "DXB", to: "BLR" },
  { from: "DXB", to: "DEL" },
  { from: "AUH", to: "MUM" },
  { from: "DXB", to: "MNL" },
  { from: "SIN", to: "MUM" },
  { from: "BKK", to: "DEL" },
  { from: "LON", to: "DXB" },
  { from: "NYC", to: "MUM" },
];

/* ────────────────────────────────────────────────────────────
   Top-of-section settlement ticker. Rotates events.
   ──────────────────────────────────────────────────────────── */
function SettlementTicker() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % SETTLEMENT_EVENTS.length),
      2200,
    );
    return () => clearInterval(id);
  }, []);

  const event = SETTLEMENT_EVENTS[index];

  return (
    <div className="flex items-center gap-3.5 min-h-[18px]">
      <span className="relative flex w-1.5 h-1.5">
        <span className="absolute inset-0 rounded-full bg-[#3ddc84] opacity-60 animate-ping" />
        <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-[#3ddc84]" />
      </span>
      <span className="text-[10.5px] font-semibold tracking-[0.3em] uppercase text-white/40">
        Settling now
      </span>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${event.pair}-${index}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="flex items-center gap-3 text-[12px] tracking-tight text-white/75"
        >
          <span className="font-mono text-white/85">{event.pair}</span>
          <span className="text-white/30">·</span>
          <span className="text-white/55">{event.region}</span>
          <span className="text-white/30">·</span>
          <span className="text-white/55">{event.rail}</span>
          <span className="text-white/30">·</span>
          <span className="font-mono text-[#3ddc84]">{event.time}</span>
          <span className="text-white/30 hidden sm:inline">·</span>
          <span className="font-mono text-white/85 hidden sm:inline">{event.amount}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   World map — minimal SVG with animated arcs between cities.
   No tiles, no heavy globe. Pure restrained vector lines.
   ──────────────────────────────────────────────────────────── */
function WorldMap() {
  const arcs = useMemo(
    () =>
      ARCS.map((a, i) => {
        const from = NODES.find((n) => n.id === a.from)!;
        const to = NODES.find((n) => n.id === a.to)!;
        // Mid-point control offset for the bezier curve
        const mx = (from.x + to.x) / 2;
        const my = (from.y + to.y) / 2 - 6;
        return {
          d: `M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`,
          delay: i * 0.45,
        };
      }),
    [],
  );

  return (
    <div className="relative w-full aspect-[2/1] overflow-hidden rounded-2xl">
      {/* Soft radial halo behind continents */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(70,100,180,0.10), transparent 70%)",
        }}
      />

      <svg
        viewBox="0 0 100 50"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Latitude lines — extremely faint */}
        {[12, 25, 38].map((y) => (
          <line
            key={y}
            x1="0"
            x2="100"
            y1={y}
            y2={y}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="0.15"
          />
        ))}

        {/* Continent dots — sparse, premium */}
        {Array.from({ length: 160 }).map((_, i) => {
          // Pseudo-random but stable positions tuned to look continent-y
          const seed = i * 9301 + 49297;
          const x = (seed % 100);
          const y = ((seed * 1.37) % 35) + 8;
          const r = 0.08 + ((seed % 4) === 0 ? 0.06 : 0);
          // Mask out oceans roughly (rough land bands)
          const isLand =
            // Americas
            (x < 30 && y > 12 && y < 38) ||
            // EU / Africa
            (x > 40 && x < 58 && y > 6 && y < 38) ||
            // Asia
            (x > 58 && x < 95 && y > 10 && y < 40);
          if (!isLand) return null;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={r}
              fill="rgba(255,255,255,0.16)"
            />
          );
        })}

        {/* Corridor arcs */}
        {arcs.map((arc, i) => (
          <g key={i}>
            {/* Static glow line */}
            <path
              d={arc.d}
              fill="none"
              stroke="rgba(255,107,53,0.20)"
              strokeWidth="0.18"
            />
            {/* Animated pulse along path */}
            <motion.path
              d={arc.d}
              fill="none"
              stroke="rgba(255,140,90,0.95)"
              strokeWidth="0.22"
              strokeLinecap="round"
              strokeDasharray="2 30"
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: -32 }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "linear",
                delay: arc.delay,
              }}
            />
          </g>
        ))}

        {/* City nodes */}
        {NODES.map((n) => (
          <g key={n.id}>
            {/* Halo */}
            <motion.circle
              cx={n.x}
              cy={n.y}
              r="0.9"
              fill="rgba(255,107,53,0.18)"
              animate={{ r: [0.9, 1.8, 0.9], opacity: [0.6, 0, 0.6] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeOut",
                delay: (n.x + n.y) * 0.01,
              }}
            />
            {/* Core dot */}
            <circle
              cx={n.x}
              cy={n.y}
              r="0.35"
              fill="rgba(255,170,120,1)"
            />
          </g>
        ))}
      </svg>

      {/* Floating city labels — only show the major ones */}
      {NODES.filter((n) =>
        ["MUM", "DXB", "MNL", "LON", "NYC", "SIN", "BKK"].includes(n.id),
      ).map((n) => (
        <div
          key={n.id}
          className="absolute hidden md:block pointer-events-none"
          style={{
            left: `${n.x}%`,
            top: `${n.y}%`,
            transform: "translate(8px, -50%)",
          }}
        >
          <span className="font-mono text-[9px] font-semibold tracking-[0.16em] uppercase text-white/45">
            {n.name}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Opportunity card — rotates through OPPORTUNITY_FEED entries
   ──────────────────────────────────────────────────────────── */
function OpportunityCard({
  Icon,
  label,
  filter,
}: {
  Icon: typeof Activity;
  label: string;
  filter: (e: (typeof OPPORTUNITY_FEED)[number]) => boolean;
}) {
  const items = OPPORTUNITY_FEED.filter(filter);
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (items.length <= 1) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % items.length), 3600);
    return () => clearInterval(id);
  }, [items.length]);
  const item = items[idx] || items[0];

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="group relative rounded-2xl overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.015) 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        boxShadow:
          "0 24px 60px -28px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.04) inset",
      }}
    >
      <div className="relative z-10 px-5 py-5">
        <div className="flex items-center gap-2.5 mb-4">
          <Icon className="w-3.5 h-3.5 text-white/55" strokeWidth={2} />
          <span className="text-[10px] font-semibold tracking-[0.24em] uppercase text-white/45">
            {label}
          </span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${item.label}-${idx}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <div className="text-[13px] tracking-tight text-white/65 leading-snug mb-2">
              {item.label}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-[18px] font-semibold tabular-nums tracking-tight text-white">
                {item.value}
              </span>
              {item.trend === "up" && (
                <TrendingUp className="w-3 h-3 text-[#3ddc84]" strokeWidth={2.5} />
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────
   Main section
   ──────────────────────────────────────────────────────────── */
const GlobalLiquiditySection = () => {
  return (
    <section className="relative overflow-hidden bg-black text-white pt-32 pb-28 md:pt-40 md:pb-36">
      {/* ── Atmospheric layers ── */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(60,80,150,0.10) 0%, transparent 75%), radial-gradient(ellipse 60% 30% at 50% 100%, rgba(255,107,53,0.05), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.55 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
        }}
      />

      <div className="relative z-10 max-w-[1240px] mx-auto px-6 md:px-10">
        {/* Ticker strip */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="flex items-center gap-4 px-5 py-3 mb-14 md:mb-20 rounded-full border border-white/[0.07] bg-white/[0.02] backdrop-blur-md mx-auto w-fit"
        >
          <SettlementTicker />
        </motion.div>

        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="inline-flex items-center gap-2.5 mb-9"
          >
            <span className="w-6 h-px bg-white/20" />
            <span className="text-[10.5px] font-semibold tracking-[0.32em] uppercase text-white/45">
              Live Network
            </span>
            <span className="w-6 h-px bg-white/20" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE, delay: 0.08 }}
            className="font-display text-white"
            style={{
              fontSize: "clamp(2.4rem, 5.6vw, 4.6rem)",
              fontWeight: 500,
              lineHeight: 1.04,
              letterSpacing: "-0.045em",
            }}
          >
            <span className="block">Global liquidity</span>
            <span
              className="block mt-1"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.45) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              moves here.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
            className="mt-8 max-w-[560px] mx-auto text-[15.5px] md:text-[16px] leading-[1.65] text-white/50"
          >
            Verified merchants compete on rate across every active corridor.
            Settlements clear on-chain in seconds.
          </motion.p>
        </div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: EASE }}
          className="relative rounded-3xl overflow-hidden mb-12 md:mb-14"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.005) 100%)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <WorldMap />

          {/* Map corner labels */}
          <div className="absolute top-5 left-5 flex items-center gap-2.5">
            <Globe2 className="w-3.5 h-3.5 text-white/45" strokeWidth={2} />
            <span className="text-[10px] font-semibold tracking-[0.26em] uppercase text-white/45">
              Active corridors
            </span>
          </div>
          <div className="absolute top-5 right-5 flex items-center gap-2">
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inset-0 rounded-full bg-[#ff6b35] opacity-70 animate-ping" />
              <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-[#ff6b35]" />
            </span>
            <span className="text-[10px] font-semibold tracking-[0.24em] uppercase text-white/55">
              Routing live
            </span>
          </div>

          {/* Bottom strip: corridors + merchants count */}
          <div className="absolute bottom-0 inset-x-0 px-5 py-4 border-t border-white/[0.05] bg-black/30 backdrop-blur-md flex items-center justify-between text-[11px] tracking-tight">
            <div className="flex items-center gap-6 md:gap-9">
              <div>
                <div className="text-[9px] font-semibold tracking-[0.22em] uppercase text-white/35 mb-0.5">
                  Active corridors
                </div>
                <div className="font-mono text-white text-[13px] font-semibold tabular-nums">
                  IN · AE · PH · TH · SG
                </div>
              </div>
              <div className="hidden md:block">
                <div className="text-[9px] font-semibold tracking-[0.22em] uppercase text-white/35 mb-0.5">
                  Verified merchants
                </div>
                <div className="font-mono text-white text-[13px] font-semibold tabular-nums">
                  100+
                </div>
              </div>
            </div>
            <div>
              <div className="text-[9px] font-semibold tracking-[0.22em] uppercase text-white/35 mb-0.5 text-right">
                Avg settlement
              </div>
              <div className="font-mono text-white text-[13px] font-semibold tabular-nums text-right">
                &lt; 60s
              </div>
            </div>
          </div>
        </motion.div>

        {/* Opportunity grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-16 md:mb-20">
          <OpportunityCard
            Icon={TrendingUp}
            label="Spreads"
            filter={(e) => e.type === "spread"}
          />
          <OpportunityCard
            Icon={Zap}
            label="Speed"
            filter={(e) => e.type === "speed"}
          />
          <OpportunityCard
            Icon={Activity}
            label="Demand"
            filter={(e) => e.type === "demand"}
          />
          <OpportunityCard
            Icon={Globe2}
            label="Live merchants"
            filter={(e) => e.type === "demand"}
          />
        </div>

        {/* Dual-CTA — user + merchant positioning */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE }}
          className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 max-w-[820px] mx-auto"
        >
          <Link
            to="/rates"
            className="group flex items-center justify-between px-6 py-5 rounded-2xl border border-white/[0.08] bg-white/[0.025] hover:bg-white/[0.05] hover:border-white/[0.16] transition-colors backdrop-blur-md"
          >
            <div className="text-left">
              <div className="text-[10px] font-semibold tracking-[0.24em] uppercase text-white/45 mb-1.5">
                For users
              </div>
              <div className="text-[15px] font-medium text-white tracking-tight">
                See live rates →
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-white/55 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            to="/merchant"
            className="group flex items-center justify-between px-6 py-5 rounded-2xl border border-[#ff6b35]/[0.25] bg-[#ff6b35]/[0.04] hover:bg-[#ff6b35]/[0.07] hover:border-[#ff6b35]/40 transition-colors backdrop-blur-md"
          >
            <div className="text-left">
              <div className="text-[10px] font-semibold tracking-[0.24em] uppercase text-[#ff6b35]/85 mb-1.5">
                For merchants
              </div>
              <div className="text-[15px] font-medium text-white tracking-tight">
                Bid on live flows →
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-white/55 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(GlobalLiquiditySection);
