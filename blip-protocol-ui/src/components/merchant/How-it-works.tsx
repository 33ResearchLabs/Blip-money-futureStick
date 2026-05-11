import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Radar, Zap, CheckCircle2, ArrowRight } from "lucide-react";
import { SwipeHint } from "@/components/IndexSections/SwipeHint";

const STEPS = [
  {
    step: 1,
    title: "Find a new order",
    subtitle: "Live order feed.",
    icon: Radar,
    desc: "Incoming user requests stream into your dashboard the moment they're created — filtered by your corridors, limits, and risk profile.",
    accent: "#ff6b35",
  },
  {
    step: 2,
    title: "Accept before others",
    subtitle: "First merchant wins.",
    icon: Zap,
    desc: "150+ merchants compete on every order. The fastest competitive bid wins — one tap to lock it in.",
    accent: "#ff6b35",
  },
  {
    step: 3,
    title: "Execute & settle",
    subtitle: "Escrow handles the rest.",
    icon: CheckCircle2,
    desc: "Funds release the moment fiat lands. On-chain proof, deterministic settlement, no chargebacks.",
    accent: "#ff6b35",
  },
] as const;

/* ------------------------------------------------------------------ */
/* Mockup 1: Live order feed                                          */
/* ------------------------------------------------------------------ */
function OrderFeedMockup({ hovered }: { hovered?: boolean }) {
  const [orders, setOrders] = useState([
    { id: 1, pair: "USDT→AED", amt: "$2,400", rate: "3.672", fresh: true },
    { id: 2, pair: "USDT→INR", amt: "$850", rate: "97.20", fresh: false },
    { id: 3, pair: "USDT→PHP", amt: "$5,100", rate: "55.81", fresh: false },
  ]);

  useEffect(() => {
    if (!hovered) return;
    const id = setInterval(() => {
      const pairs = ["USDT→AED", "USDT→INR", "USDT→PHP", "USDT→NGN"];
      const rates: Record<string, string> = {
        "USDT→AED": "3.67",
        "USDT→INR": "97.2",
        "USDT→PHP": "55.8",
        "USDT→NGN": "1680",
      };
      const pair = pairs[Math.floor(Math.random() * pairs.length)];
      const amt = `$${Math.floor(Math.random() * 8000 + 500).toLocaleString()}`;
      setOrders((prev) =>
        [{ id: Date.now(), pair, amt, rate: rates[pair], fresh: true }, ...prev.map((o) => ({ ...o, fresh: false }))].slice(0, 3),
      );
    }, 1500);
    return () => clearInterval(id);
  }, [hovered]);

  return (
    <div className="p-3 flex flex-col gap-1.5">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-[#ff6b35]"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          <span className="text-[8px] font-bold uppercase tracking-widest text-black/50 dark:text-white/40">Live feed</span>
        </div>
        <span className="text-[8px] font-mono text-black/30 dark:text-white/25">{orders.length} open</span>
      </div>
      <AnimatePresence mode="popLayout">
        {orders.map((o) => (
          <motion.div
            key={o.id}
            layout
            initial={{ opacity: 0, x: -8, backgroundColor: "rgba(255,107,53,0.12)" }}
            animate={{ opacity: 1, x: 0, backgroundColor: "rgba(0,0,0,0.04)" }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.35 }}
            className="flex items-center justify-between px-2.5 py-1.5 rounded-md border border-black/[0.04] dark:border-white/[0.04]"
          >
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono text-black/40 dark:text-white/30">{o.pair}</span>
              <span className="text-[9px] font-semibold text-black/70 dark:text-white/70">{o.amt}</span>
            </div>
            <span className="text-[9px] font-mono text-black/50 dark:text-white/50">{o.rate}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mockup 2: Accept-before-others bid race                            */
/* ------------------------------------------------------------------ */
function BidRaceMockup({ hovered }: { hovered?: boolean }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!hovered) return;
    const id = setInterval(() => {
      setProgress((p) => (p >= 100 ? 0 : p + 4));
    }, 60);
    return () => clearInterval(id);
  }, [hovered]);

  const merchants = [
    { name: "You", color: "#ff6b35", lead: progress },
    { name: "AlphaFX", color: "rgba(0,0,0,0.45)", lead: Math.max(0, progress - 18) },
    { name: "GulfTrade", color: "rgba(0,0,0,0.3)", lead: Math.max(0, progress - 32) },
  ];

  return (
    <div className="p-3 flex flex-col gap-2 h-full justify-center">
      {merchants.map((m, i) => (
        <div key={m.name} className="flex items-center gap-2">
          <span
            className="text-[9px] font-bold w-14 shrink-0"
            style={{ color: i === 0 ? "#ff6b35" : undefined }}
          >
            {m.name}
          </span>
          <div className="flex-1 h-1.5 rounded-full bg-black/[0.06] dark:bg-white/[0.06] overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              animate={{ width: `${Math.min(m.lead, 100)}%` }}
              transition={{ duration: 0.05 }}
              style={{ background: m.color }}
            />
          </div>
          {i === 0 && progress >= 100 && (
            <span className="text-[8px] font-bold uppercase tracking-wider" style={{ color: "#ff6b35" }}>
              Won
            </span>
          )}
        </div>
      ))}
      <div className="mt-1 flex items-center justify-center gap-1">
        <Zap size={9} className="text-[#ff6b35]" />
        <span className="text-[8px] font-mono uppercase tracking-wider text-black/40 dark:text-white/40">
          {progress >= 100 ? "Order locked" : "Bidding..."}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mockup 3: Execute / Settle flow                                    */
/* ------------------------------------------------------------------ */
function SettleMockup({ hovered }: { hovered?: boolean }) {
  const stages = ["Lock", "Fiat", "Release", "Done"];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!hovered) {
      setIdx(0);
      return;
    }
    const id = setInterval(() => {
      setIdx((v) => (v >= stages.length - 1 ? 0 : v + 1));
    }, 600);
    return () => clearInterval(id);
  }, [hovered]);

  return (
    <div className="p-3 h-full flex flex-col justify-center gap-3">
      <div className="flex items-center gap-1.5">
        {stages.map((s, i) => (
          <React.Fragment key={s}>
            <motion.div
              animate={{
                backgroundColor:
                  i <= idx ? "#ff6b35" : "rgba(0,0,0,0.08)",
                scale: i === idx ? [1, 1.25, 1] : 1,
              }}
              transition={{ duration: 0.4 }}
              className="w-2 h-2 rounded-full shrink-0"
            />
            {i < stages.length - 1 && (
              <motion.div
                animate={{
                  background:
                    i < idx
                      ? "#ff6b35"
                      : "rgba(0,0,0,0.06)",
                }}
                className="flex-1 h-[1.5px] rounded-full"
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flex items-center justify-between text-[8px] font-mono">
        {stages.map((s, i) => (
          <span
            key={s}
            className="uppercase tracking-wider transition-colors"
            style={{
              color: i <= idx ? "#ff6b35" : "rgba(0,0,0,0.25)",
            }}
          >
            {s}
          </span>
        ))}
      </div>
      <div className="mt-1 rounded-md border border-black/[0.06] dark:border-white/[0.06] px-2.5 py-1.5 flex items-center justify-between">
        <span className="text-[9px] font-semibold text-black/70 dark:text-white/70">Margin earned</span>
        <motion.span
          key={idx}
          initial={{ y: -2, opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-[10px] font-bold font-mono text-black/80 dark:text-white/80"
        >
          +${(18.2 + idx * 1.4).toFixed(2)}
        </motion.span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Card                                                                */
/* ------------------------------------------------------------------ */
function StepCard({
  step,
  title,
  subtitle,
  desc,
  icon: Icon,
  index,
  delay,
  Mockup,
}: {
  step: number;
  title: string;
  subtitle: string;
  desc: string;
  icon: React.ElementType;
  index: number;
  delay: number;
  Mockup: React.ComponentType<{ hovered?: boolean }>;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const onMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    setMousePos({ x, y });
    setRotate({ x: (y - r.height / 2) / 30, y: (r.width / 2 - x) / 30 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setRotate({ x: 0, y: 0 });
      }}
      className="group relative flex flex-col overflow-hidden rounded-[2rem]
        border border-black/10 dark:border-white/[0.08]
        bg-white/80 dark:bg-[#0a0a0c]
        backdrop-blur-xl p-7
        transition-all duration-500
        hover:shadow-[0_30px_80px_rgba(255,107,53,0.12)]
        hover:-translate-y-2
        hover:border-[#ff6b35]/30"
      style={{
        animation: `fadeInUp 1s cubic-bezier(0.2,0.8,0.2,1) ${delay}s both`,
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
      }}
    >
      {/* Spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(420px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,107,53,0.10), transparent 45%)`,
        }}
      />

      {/* Step pill */}
      <div className="absolute top-5 right-5 flex items-center gap-1.5">
        <span
          className="text-[9px] font-mono tracking-[0.18em] uppercase"
          style={{ color: hovered ? "#ff6b35" : "rgba(0,0,0,0.35)" }}
        >
          Step
        </span>
        <span
          className="text-[10px] font-bold font-mono"
          style={{ color: "#ff6b35" }}
        >
          0{step}
        </span>
      </div>

      {/* Icon + title */}
      <div className="relative z-10 flex flex-col gap-5 mb-6">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-300 ${
            hovered
              ? "scale-110 border-[#ff6b35]/40 bg-[#ff6b35]/10 text-[#ff6b35]"
              : "border-black/15 dark:border-white/15 bg-black/[0.04] dark:bg-white/[0.04] text-black/60 dark:text-white/60"
          }`}
        >
          <Icon size={22} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-black dark:text-white mb-1.5 tracking-tight">
            {title}
          </h3>
          <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#ff6b35]/80 mb-2">
            {subtitle}
          </p>
          <p className="text-sm leading-relaxed text-black/60 dark:text-white/45">
            {desc}
          </p>
        </div>
      </div>

      {/* Mockup panel */}
      <div className="relative mt-auto h-44 overflow-hidden rounded-2xl border border-black/[0.06] dark:border-white/[0.05] bg-black/[0.02] dark:bg-[#050507]">
        <Mockup hovered={hovered} />
        <div className="absolute bottom-0 inset-x-0 h-6 border-t border-black/[0.05] dark:border-white/[0.05] bg-white/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-between px-3">
          <span className="text-[8px] font-mono text-black/40 dark:text-white/40">
            STEP_0{step}
          </span>
          <ArrowRight size={9} className="text-[#ff6b35]/70" />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */
const HowItWorksSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-120px" });

  const MOCKUPS = [OrderFeedMockup, BidRaceMockup, SettleMockup];

  return (
    <section
      ref={ref}
      className="relative max-w-7xl mx-auto px-6 py-16 md:py-32"
    >
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>

      <div className="text-center mb-12 sm:mb-20">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-[11px] uppercase tracking-[0.3em] font-semibold mb-4"
          style={{ color: "#ff6b35" }}
        >
          Three taps. One settled trade.
        </motion.p>
        <h2 className="text-4xl md:text-6xl font-bold text-black dark:text-white tracking-tight">
          How merchants execute on Blip
        </h2>
      </div>

      <div className="relative">
        <div className="-mx-5 md:mx-0 px-5 md:px-0 flex md:grid md:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {STEPS.map((s, i) => (
            <div key={s.step} className="snap-start shrink-0 w-[82%] md:w-auto">
              <StepCard
                step={s.step}
                title={s.title}
                subtitle={s.subtitle}
                desc={s.desc}
                icon={s.icon}
                index={i}
                delay={0.2 + i * 0.1}
                Mockup={MOCKUPS[i]}
              />
            </div>
          ))}
        </div>
        <SwipeHint />
      </div>
    </section>
  );
};

export default HowItWorksSection;
