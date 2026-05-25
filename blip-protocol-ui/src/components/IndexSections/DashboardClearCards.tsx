import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Check,
  ChevronUp,
  Sparkles,
  Trophy,
} from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;
const ACCENT = "#cc785c";

type CardData = {
  key: string;
  label: string;
  refTag: string;
  accent: string;
  hero: "fees" | "route" | "friend" | "boost";
  titlePre: string;
  titleAccent: string;
  titleTail?: string;
  cta: string;
};

const CARDS: CardData[] = [
  {
    key: "fees", label: "FEE WAIVER · LIVE", refTag: "WEEK 21", accent: ACCENT,
    hero: "fees", titlePre: "Don't miss out on", titleAccent: "0% fees",
    titleTail: " this week.", cta: "Send",
  },
  {
    key: "route", label: "TRANSFER ROUTE", refTag: "USD → INR", accent: ACCENT,
    hero: "route", titlePre: "Your first 3 transfers", titleAccent: "home — fee-free.",
    cta: "Send home",
  },
  {
    key: "friend", label: "REFERRAL · LIVE", refTag: "#R-1842", accent: ACCENT,
    hero: "friend", titlePre: "Bring a friend.", titleAccent: "You both get upto $20.",
    cta: "Share invite",
  },
  {
    key: "boost", label: "LEADERBOARD", refTag: "RANK 3", accent: ACCENT,
    hero: "boost", titlePre: "Stack a", titleAccent: "+15% boost",
    titleTail: " on your next 5.", cta: "Activate",
  },
];

export function DashboardClearCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {CARDS.map((c, i) => <Card key={c.key} card={c} index={i} />)}
    </div>
  );
}

function Card({ card, index }: { card: CardData; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.55, delay: index * 0.05, ease: EASE }}
      whileHover={{ y: -4 }}
      className="relative rounded-[24px] overflow-hidden text-left flex flex-col"
      style={{
        background: "#ffffff",
        border: "1px solid rgba(0,0,0,0.06)",
        transition: "transform 0.35s ease",
        boxShadow: "0 1px 0 rgba(255,255,255,0.6) inset, 0 30px 80px -30px rgba(0,0,0,0.5)",
        color: "#0a0a0a",
      }}
    >
      <div className="px-5 pt-5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <motion.span
            animate={{ opacity: [1, 0.35, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: card.accent }}
          />
          <span className="text-[9.5px] font-bold tracking-[0.22em] text-black/55">
            {card.label}
          </span>
        </div>
        <span
          className="text-[9.5px] font-bold tracking-[0.15em] text-black/35"
          style={{ fontFamily: "ui-monospace, monospace" }}
        >
          {card.refTag}
        </span>
      </div>

      <div
        className="relative mx-5 mt-5 rounded-2xl overflow-hidden flex items-center justify-center"
        style={{
          aspectRatio: "16/11",
          background: `radial-gradient(ellipse 80% 80% at 50% 40%, ${card.accent}1f 0%, #fafafa 100%)`,
          border: `1px solid ${card.accent}22`,
        }}
      >
        <Hero kind={card.hero} accent={card.accent} />
      </div>

      <div className="px-5 pb-5 pt-5 mt-auto">
        <div
          className="font-display leading-[1.12] mb-4"
          style={{ fontSize: "17px", fontWeight: 600, letterSpacing: "-0.022em", color: "#0a0a0a" }}
        >
          {card.titlePre}{" "}
          <span style={{ fontStyle: "italic", fontWeight: 500, fontFamily: "ui-serif, Georgia, serif" }}>
            {card.titleAccent}
          </span>
          {card.titleTail && <span>{card.titleTail}</span>}
        </div>
        <Link
          to="https://app.blip.money/waitlist/merchant-login"
          className="inline-flex items-center gap-1.5 px-4 h-9 rounded-full text-[12.5px] font-semibold tracking-tight"
          style={{ background: "#0a0a0a", color: "#fff" }}
        >
          {card.cta}
          <ArrowUpRight className="w-3 h-3" strokeWidth={2.5} />
        </Link>
      </div>
    </motion.div>
  );
}

function Hero({ kind, accent }: { kind: CardData["hero"]; accent: string }) {
  if (kind === "fees") return <FeesHero accent={accent} />;
  if (kind === "route") return <RouteHero accent={accent} />;
  if (kind === "friend") return <FriendHero accent={accent} />;
  return <BoostHero accent={accent} />;
}

function Avatar({
  initials, bg, size, badge,
}: {
  initials: string; bg: string; size: number; badge?: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div
        className="rounded-full flex items-center justify-center font-bold flex-shrink-0"
        style={{
          background: bg, color: "#0a0a0a", width: size, height: size,
          fontSize: size * 0.38, fontFamily: "ui-serif, Georgia, serif",
          border: "3px solid #fff",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        }}
      >
        {initials}
      </div>
      {badge}
    </div>
  );
}

function FeesHero({ accent }: { accent: string }) {
  return (
    <div className="flex items-center justify-center gap-5 px-4">
      <Avatar
        initials="AW" bg="#ffe1d6" size={64}
        badge={
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: 0.4 }}
            className="absolute -bottom-1 -right-1 rounded-full flex items-center justify-center"
            style={{ background: "#fff", border: "2px solid #fff", width: 22, height: 22 }}
          >
            <div
              className="rounded-full flex items-center justify-center"
              style={{ background: accent, width: 18, height: 18 }}
            >
              <Check className="w-3 h-3 text-white" strokeWidth={3.5} />
            </div>
          </motion.div>
        }
      />
      <div className="relative">
        <motion.div
          animate={{
            boxShadow: [`0 0 0 ${accent}00`, `0 0 32px ${accent}55`, `0 0 0 ${accent}00`],
          }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="rounded-full flex flex-col items-center justify-center font-bold leading-none"
          style={{
            width: 96, height: 96, background: accent, color: "#0a0a0a",
            fontFamily: "ui-serif, Georgia, serif",
          }}
        >
          <span style={{ fontSize: 40, fontWeight: 800, lineHeight: 1 }}>0%</span>
          <span
            style={{
              fontSize: 9, fontFamily: "ui-monospace, monospace",
              fontWeight: 700, letterSpacing: "0.18em", marginTop: 2,
            }}
          >
            FEES
          </span>
        </motion.div>
        <motion.div
          animate={{ rotate: [0, 360], opacity: [1, 0.4, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute -top-2 -right-2"
        >
          <Sparkles className="w-5 h-5" style={{ color: accent }} strokeWidth={2.5} />
        </motion.div>
      </div>
    </div>
  );
}

function RouteHero({ accent }: { accent: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-4">
      <div className="flex items-center gap-3">
        <div
          className="rounded-full flex items-center justify-center"
          style={{
            background: "#fff", border: "3px solid #fff",
            width: 56, height: 56,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)", fontSize: 28,
          }}
        >
          <span aria-hidden>🇺🇸</span>
        </div>
        <svg width="64" height="40" viewBox="0 0 64 40">
          <motion.path
            d="M 4 28 Q 32 -4 60 28"
            stroke={accent} strokeWidth="2" strokeDasharray="4 4"
            strokeLinecap="round" fill="none"
            animate={{ strokeDashoffset: [0, -32] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
          />
          <path
            d="M 56 24 L 62 28 L 56 32"
            stroke={accent} strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" fill="none"
          />
        </svg>
        <div
          className="rounded-full flex items-center justify-center"
          style={{
            background: "#fff", border: "3px solid #fff",
            width: 56, height: 56,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)", fontSize: 28,
          }}
        >
          <span aria-hidden>🇮🇳</span>
        </div>
      </div>
      <div className="mt-4 flex items-baseline gap-3">
        <span className="font-bold text-black" style={{ fontFamily: "ui-monospace, monospace", fontSize: 18 }}>
          $1,000
        </span>
        <ArrowUpRight className="w-3.5 h-3.5 text-black/40 rotate-45" strokeWidth={2.5} />
        <span
          className="font-bold"
          style={{ fontFamily: "ui-monospace, monospace", fontSize: 18, color: accent }}
        >
          ₹83,250
        </span>
      </div>
    </div>
  );
}

function FriendHero({ accent }: { accent: string }) {
  return (
    <div className="flex items-center justify-center px-4">
      <Avatar initials="Y" bg="#ffd6e7" size={56} />
      <motion.div
        animate={{ rotate: [-6, 6, -6], y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative -mx-3 z-10"
        style={{ filter: `drop-shadow(0 8px 24px ${accent}66)` }}
      >
        <div
          className="rounded-full flex items-center justify-center font-bold"
          style={{
            background: `radial-gradient(circle at 35% 30%, #ffe5b8, ${accent} 70%)`,
            border: "3px solid #fff", width: 72, height: 72,
            color: "#0a0a0a", fontFamily: "ui-serif, Georgia, serif", fontSize: 28,
          }}
        >
          $
        </div>
        <div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap"
          style={{ background: "#0a0a0a", color: "#fff", fontFamily: "ui-monospace, monospace" }}
        >
          +$20
        </div>
      </motion.div>
      <Avatar initials="K" bg="#d6f5eb" size={56} />
    </div>
  );
}

function BoostHero({ accent }: { accent: string }) {
  const points: [number, number][] = [
    [0, 36], [20, 28], [40, 30], [60, 18], [80, 12], [100, 4],
  ];
  return (
    <div className="flex items-center justify-center gap-5 px-4">
      <div className="relative">
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="rounded-2xl flex items-center justify-center"
          style={{
            width: 80, height: 80,
            background: `linear-gradient(180deg, ${accent}, ${accent}dd)`,
            boxShadow: `0 12px 32px ${accent}55`,
          }}
        >
          <Trophy className="w-10 h-10 text-white" strokeWidth={1.8} />
        </motion.div>
        <div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap flex items-center gap-1"
          style={{ background: "#0a0a0a", color: "#fff", fontFamily: "ui-monospace, monospace" }}
        >
          <ChevronUp className="w-2.5 h-2.5" strokeWidth={3} />
          RANK 3
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span
          className="font-bold leading-none"
          style={{
            fontFamily: "ui-serif, Georgia, serif",
            fontSize: 30, color: accent, letterSpacing: "-0.03em",
          }}
        >
          +15%
        </span>
        <svg viewBox="0 0 100 40" width="84" height="34" className="mt-1">
          <motion.path
            d={`M ${points.map((p) => p.join(",")).join(" L ")} L 100 40 L 0 40 Z`}
            fill={`${accent}22`}
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.4 }}
          />
          <motion.path
            d={`M ${points.map((p) => p.join(",")).join(" L ")}`}
            fill="none" stroke={accent} strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
            viewport={{ once: true }} transition={{ duration: 1.1, ease: EASE }}
          />
          <motion.circle
            cx={points[points.length - 1][0]} cy={points[points.length - 1][1]}
            r="3" fill={accent}
            animate={{ r: [3, 4.5, 3] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
        </svg>
        <span className="text-[9px] font-bold tracking-[0.18em] text-black/45">5 LEFT</span>
      </div>
    </div>
  );
}
