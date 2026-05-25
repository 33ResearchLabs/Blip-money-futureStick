import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles, Home, Users, Rocket, Tag } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

type Card = {
  key: string;
  label: string;
  accent: string;
  titlePre: string;
  titleAccent: string;
  titleTail?: string;
  cta: string;
  footnote: string;
  graphic: "fees" | "home" | "friend" | "boost";
};

const CARDS: Card[] = [
  {
    key: "fees",
    label: "ZERO FEES THIS WEEK",
    accent: "#6ee0c5",
    titlePre: "Don't miss out on",
    titleAccent: "0% fees",
    titleTail: " this week.",
    cta: "Send money",
    footnote: "Auto-applied at checkout",
    graphic: "fees",
  },
  {
    key: "home",
    label: "FIRST TRANSFERS · FEE-FREE",
    accent: "#ffd45a",
    titlePre: "Your first 3 transfers",
    titleAccent: "home — fee-free.",
    cta: "Send home",
    footnote: "USD → INR live rate",
    graphic: "home",
  },
  {
    key: "friend",
    label: "BRING A FRIEND",
    accent: "#ff8c6b",
    titlePre: "Bring a friend.",
    titleAccent: "You both get upto $20.",
    cta: "Share invite",
    footnote: "Paid when they trade $100+",
    graphic: "friend",
  },
  {
    key: "boost",
    label: "BOOST ON YOUR NEXT 5 TRADES",
    accent: "#9ad1ff",
    titlePre: "Stack a",
    titleAccent: "+15% boost",
    titleTail: " on your next 5 trades.",
    cta: "Activate boost",
    footnote: "Avg user banked $48 last week",
    graphic: "boost",
  },
];

export function MerchantCardsAppStyle() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {CARDS.map((c, i) => (
        <FeatureCard key={c.key} card={c} index={i} />
      ))}
    </div>
  );
}

function FeatureCard({ card, index }: { card: Card; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.55, delay: index * 0.05, ease: EASE }}
      whileHover={{ y: -4 }}
      className="relative rounded-[22px] overflow-hidden text-left flex flex-col group"
      style={{
        background: "#0a0a0a",
        border: "1px solid rgba(255,255,255,0.06)",
        transition: "transform 0.35s ease",
        boxShadow: "0 24px 60px -24px rgba(0,0,0,0.6)",
      }}
    >
      <div
        className="relative w-full overflow-hidden flex items-center justify-center"
        style={{
          aspectRatio: "1/1",
          background: `radial-gradient(ellipse 70% 60% at 50% 45%, ${card.accent}1a 0%, transparent 70%), #0a0a0a`,
        }}
      >
        <Graphic kind={card.graphic} accent={card.accent} />
      </div>
      <div className="px-5 py-5 flex-1 flex flex-col">
        <div className="flex items-center gap-1.5 mb-2.5">
          <span className="w-1 h-1 rounded-full" style={{ background: card.accent }} />
          <span
            className="text-[10px] font-bold tracking-[0.18em]"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            {card.label}
          </span>
        </div>
        <div
          className="font-display leading-[1.12] flex-1"
          style={{
            fontSize: "20px",
            fontWeight: 600,
            letterSpacing: "-0.025em",
            color: "#fff",
          }}
        >
          {card.titlePre}{" "}
          <span
            style={{
              color: card.accent,
              fontStyle: "italic",
              fontWeight: 500,
              fontFamily: "ui-serif, Georgia, serif",
            }}
          >
            {card.titleAccent}
          </span>
          {card.titleTail && <span>{card.titleTail}</span>}
        </div>
        <div className="mt-5 flex items-center justify-between gap-2 flex-wrap">
          <Link
            to="/merchant-waitlist"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold tracking-tight whitespace-nowrap"
            style={{ background: "#fff", color: "#0a0a0a" }}
          >
            {card.cta}
            <ArrowUpRight className="w-3 h-3" strokeWidth={2.5} />
          </Link>
          <span className="text-[10px] tracking-tight leading-tight" style={{ color: "rgba(255,255,255,0.4)" }}>
            {card.footnote}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* Per-card graphics */
function Graphic({ kind, accent }: { kind: Card["graphic"]; accent: string }) {
  if (kind === "fees") return <FeesGraphic accent={accent} />;
  if (kind === "home") return <HomeGraphic accent={accent} />;
  if (kind === "friend") return <FriendGraphic accent={accent} />;
  return <BoostGraphic accent={accent} />;
}

function FeesGraphic({ accent }: { accent: string }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
        style={{ filter: `drop-shadow(0 14px 32px ${accent}55)` }}
      >
        <svg viewBox="0 0 140 170" width="140" height="170">
          <path
            d="M 12 6 L 128 6 L 128 158 L 116 150 L 104 158 L 92 150 L 80 158 L 68 150 L 56 158 L 44 150 L 32 158 L 20 150 L 12 158 Z"
            fill="#0f0f0f" stroke={accent} strokeWidth="2"
          />
          <rect x="22" y="22" width="60" height="3" rx="1.5" fill="rgba(255,255,255,0.55)" />
          <rect x="22" y="32" width="40" height="2.5" rx="1.25" fill="rgba(255,255,255,0.22)" />
          <line x1="22" y1="50" x2="118" y2="50" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          {[60, 72, 84, 96].map((y) => (
            <g key={y}>
              <rect x="22" y={y} width="44" height="2.5" rx="1.25" fill="rgba(255,255,255,0.25)" />
              <rect x="86" y={y} width="32" height="2.5" rx="1.25" fill="rgba(255,255,255,0.15)" />
            </g>
          ))}
          <line x1="22" y1="110" x2="118" y2="110" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <text x="22" y="128" fontSize="8" fontWeight="700" letterSpacing="1" fill="rgba(255,255,255,0.55)">FEES</text>
          <text x="118" y="128" textAnchor="end" fontSize="14" fontWeight="800"
                fontFamily="ui-monospace, monospace" fill={accent}>$0.00</text>
        </svg>
        <motion.div
          animate={{ rotate: [-8, -2, -8], scale: [1, 1.04, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute" style={{ top: -10, right: -16 }}
        >
          <div
            className="w-14 h-14 rounded-full flex flex-col items-center justify-center font-bold leading-tight"
            style={{ background: accent, color: "#0a0a0a", boxShadow: `0 8px 24px ${accent}66` }}
          >
            <span style={{ fontSize: 18, fontFamily: "ui-serif, Georgia", fontWeight: 800 }}>0%</span>
            <span className="text-[7px] tracking-[0.15em]">FEES</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function HomeGraphic({ accent }: { accent: string }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.svg viewBox="0 0 200 140" width="200" height="140" className="absolute inset-0 m-auto">
        <motion.path
          d="M 20 110 Q 100 10 180 80" stroke={accent} strokeWidth="2"
          strokeDasharray="4 6" fill="none" strokeLinecap="round"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
          viewport={{ once: true }} transition={{ duration: 1.4, ease: EASE }}
        />
      </motion.svg>
      <motion.div
        animate={{ y: [0, -6, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute" style={{ left: "10%", bottom: "20%" }}
      >
        <div className="w-10 h-7 rounded-md flex items-center justify-center"
             style={{ background: `${accent}22`, border: `1.5px solid ${accent}` }}>
          <svg viewBox="0 0 24 16" width="22" height="14">
            <path d="M 2 4 L 12 11 L 22 4" stroke={accent} strokeWidth="1.5"
                  fill="none" strokeLinecap="round" />
          </svg>
        </div>
      </motion.div>
      <motion.div
        animate={{ y: [0, -3, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute"
        style={{ right: "12%", bottom: "32%", filter: `drop-shadow(0 10px 26px ${accent}66)` }}
      >
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
             style={{ background: `${accent}1a`, border: `1.5px solid ${accent}66` }}>
          <Home color={accent} size={32} strokeWidth={2} fill={`${accent}33`} />
        </div>
      </motion.div>
      <div className="absolute bottom-4 px-2.5 py-1 rounded-full text-[9px] font-bold tracking-[0.18em] flex items-center gap-1"
           style={{ background: `${accent}22`, color: accent, border: `1px solid ${accent}44` }}>
        <Tag size={10} strokeWidth={2.5} /> FEE-FREE
      </div>
    </div>
  );
}

function FriendGraphic({ accent }: { accent: string }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center gap-6">
      <motion.div
        animate={{ y: [0, -3, 0] }} transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-14 h-14 rounded-full flex items-center justify-center"
        style={{ background: `${accent}22`, border: `2px solid ${accent}`, boxShadow: `0 10px 24px ${accent}44` }}
      >
        <Users color={accent} size={26} strokeWidth={2} />
      </motion.div>
      <motion.div
        animate={{ scale: [1, 1.15, 1], rotate: [0, -8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-12 h-12 rounded-full flex items-center justify-center"
        style={{ background: accent, boxShadow: `0 0 32px ${accent}88, 0 10px 24px ${accent}55` }}
      >
        <span className="font-bold" style={{ color: "#0a0a0a", fontSize: 18, fontFamily: "ui-serif, Georgia" }}>$</span>
        <motion.div
          animate={{ y: [-2, -8, -2] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-3 -right-3 px-1.5 py-0.5 rounded-md text-[9px] font-bold"
          style={{ background: "#0a0a0a", color: accent, border: `1px solid ${accent}` }}
        >+$20</motion.div>
      </motion.div>
      <motion.div
        animate={{ y: [0, -3, 0] }} transition={{ duration: 2.6, delay: 0.3, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-14 h-14 rounded-full flex items-center justify-center"
        style={{ background: `${accent}22`, border: `2px solid ${accent}`, boxShadow: `0 10px 24px ${accent}44` }}
      >
        <Users color={accent} size={26} strokeWidth={2} />
      </motion.div>
    </div>
  );
}

function BoostGraphic({ accent }: { accent: string }) {
  const points: [number, number][] = [
    [12, 110], [44, 92], [76, 100], [108, 64], [140, 44], [168, 22],
  ];
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 180 130" width="180" height="130">
        {[30, 60, 90].map((y) => (
          <line key={y} x1="0" y1={y} x2="180" y2={y}
                stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        ))}
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 1.2, ease: EASE }}
          d={`M ${points.map((p) => p.join(",")).join(" L ")} L 168 130 L 12 130 Z`}
          fill={`${accent}22`} stroke="none"
        />
        <motion.path
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
          viewport={{ once: true }} transition={{ duration: 1.2, ease: EASE }}
          d={`M ${points.map((p) => p.join(",")).join(" L ")}`}
          fill="none" stroke={accent} strokeWidth="2.4"
          strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
      <motion.div
        animate={{ y: [0, -6, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute"
        style={{ right: "10%", top: "12%", filter: `drop-shadow(0 10px 26px ${accent}88)` }}
      >
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center rotate-12"
             style={{ background: `${accent}1a`, border: `1.5px solid ${accent}` }}>
          <Rocket color={accent} size={24} strokeWidth={2} fill={`${accent}55`} />
        </div>
      </motion.div>
      <motion.div
        animate={{ y: [0, -3, 0], scale: [1, 1.04, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute px-2 py-0.5 rounded-md text-[10px] font-bold tracking-tight"
        style={{ left: "8%", top: "14%", background: accent, color: "#0a0a0a" }}
      >+15%</motion.div>
      <motion.div
        animate={{ rotate: [0, 90, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute" style={{ right: "40%", bottom: "20%" }}
      ><Sparkles color={accent} size={14} /></motion.div>
    </div>
  );
}
