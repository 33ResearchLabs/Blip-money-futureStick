import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;
const ACCENT = "#cc785c";

type DashboardCardData = {
  key: string;
  label: string;
  refTag: string;
  widget: "fee-waiver" | "transfer-route" | "referral-pair" | "leaderboard";
  titlePre: string;
  titleAccent: string;
  titleTail?: string;
  cta: string;
};

const CARDS: DashboardCardData[] = [
  {
    key: "fees",
    label: "FEE WAIVER · LIVE",
    refTag: "WEEK 21",
    widget: "fee-waiver",
    titlePre: "Don't miss out on",
    titleAccent: "0% fees",
    titleTail: " this week.",
    cta: "Send",
  },
  {
    key: "home",
    label: "TRANSFER ROUTE · OPEN",
    refTag: "USD → INR",
    widget: "transfer-route",
    titlePre: "Your first 3 transfers",
    titleAccent: "home — fee-free.",
    cta: "Send home",
  },
  {
    key: "friend",
    label: "REFERRAL · PAID",
    refTag: "#R-1842",
    widget: "referral-pair",
    titlePre: "Bring a friend.",
    titleAccent: "You both get upto $20.",
    cta: "Share invite",
  },
  {
    key: "boost",
    label: "LEADERBOARD · RISING",
    refTag: "RANK · 3",
    widget: "leaderboard",
    titlePre: "Stack a",
    titleAccent: "+15% boost",
    titleTail: " on your next 5.",
    cta: "Activate",
  },
];

export function DashboardMerchantCards() {
  return (
    <div
      className="w-full -mx-4 px-4 flex gap-3 overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible lg:grid-cols-4 lg:gap-5"
    >
      {CARDS.map((c, i) => (
        <DashboardCard key={c.key} card={c} index={i} />
      ))}
    </div>
  );
}

function DashboardCard({ card, index }: { card: DashboardCardData; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{ duration: 0.55, delay: index * 0.05, ease: EASE }}
      whileHover={{ y: -4 }}
      className="relative rounded-[24px] overflow-hidden text-left flex flex-col snap-start shrink-0 w-[82vw] max-w-[340px] sm:w-auto sm:max-w-none"
      style={{
        background: "#ffffff",
        border: "1px solid rgba(0,0,0,0.06)",
        transition: "transform 0.35s ease",
        boxShadow:
          "0 1px 0 rgba(255,255,255,0.6) inset, 0 30px 80px -30px rgba(0,0,0,0.5)",
        color: "#0a0a0a",
      }}
    >
      <div className="px-5 pt-5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <motion.span
            animate={{ opacity: [1, 0.35, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: ACCENT }}
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

      <div className="px-5 pt-4 pb-2">
        <Widget kind={card.widget} />
      </div>

      <div className="px-5 pb-5 pt-4 mt-auto">
        <div
          className="font-display leading-[1.12] mb-4"
          style={{
            fontSize: "17px",
            fontWeight: 600,
            letterSpacing: "-0.022em",
            color: "#0a0a0a",
          }}
        >
          {card.titlePre}{" "}
          <span style={{ fontStyle: "italic", fontWeight: 500, fontFamily: "ui-serif, Georgia, serif" }}>
            {card.titleAccent}
          </span>
          {card.titleTail && <span>{card.titleTail}</span>}
        </div>
        <Link
          to="/merchant-waitlist"
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

function Widget({ kind }: { kind: DashboardCardData["widget"] }) {
  if (kind === "fee-waiver") return <FeeWaiverWidget />;
  if (kind === "transfer-route") return <TransferRouteWidget />;
  if (kind === "referral-pair") return <ReferralPairWidget />;
  return <LeaderboardWidget />;
}

function Avatar({
  initials,
  bg,
  size = 36,
}: {
  initials: string;
  bg: string;
  size?: number;
}) {
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold flex-shrink-0"
      style={{
        background: bg,
        color: "#0a0a0a",
        width: size,
        height: size,
        fontSize: size * 0.4,
        fontFamily: "ui-serif, Georgia, serif",
        border: "2px solid #fff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}
    >
      {initials}
    </div>
  );
}

function FeeWaiverWidget() {
  return (
    <div className="space-y-3">
      <div
        className="flex items-center gap-3 p-3 rounded-xl"
        style={{ background: "rgba(0,0,0,0.025)", border: "1px solid rgba(0,0,0,0.05)" }}
      >
        <Avatar initials="AW" bg="#ffe1d6" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] font-bold text-black truncate">Alex Wei</span>
            <span className="text-[9px] font-bold tracking-[0.18em] text-black/40">· SENT</span>
          </div>
          <div className="text-[10.5px] text-black/55 mt-0.5" style={{ fontFamily: "ui-monospace, monospace" }}>
            $250.00 · 14s ago
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between px-1">
        <div className="flex items-baseline gap-2">
          <span className="text-[9px] font-bold tracking-[0.18em] text-black/45">FEE</span>
          <span
            className="text-[13px] font-bold text-black/30 line-through"
            style={{ fontFamily: "ui-monospace, monospace" }}
          >
            $4.20
          </span>
        </div>
        <div
          className="px-2.5 py-1 rounded-full flex items-center gap-1.5"
          style={{ background: `${ACCENT}1a`, border: `1px solid ${ACCENT}55` }}
        >
          <motion.span
            animate={{ opacity: [1, 0.35, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: ACCENT }}
          />
          <span className="text-[11px] font-bold" style={{ color: ACCENT, fontFamily: "ui-monospace, monospace" }}>
            $0.00
          </span>
        </div>
      </div>
    </div>
  );
}

function TransferRouteWidget() {
  return (
    <div className="space-y-3">
      <div
        className="flex items-center gap-3 p-3 rounded-xl"
        style={{ background: "rgba(0,0,0,0.025)", border: "1px solid rgba(0,0,0,0.05)" }}
      >
        <Avatar initials="PR" bg="#d6ecff" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] font-bold text-black truncate">Priya R.</span>
            <span className="text-[9px] font-bold tracking-[0.18em] text-black/40">· DUBAI</span>
          </div>
          <div className="text-[10.5px] text-black/55 mt-0.5" style={{ fontFamily: "ui-monospace, monospace" }}>
            $1,000 → ₹83,250
          </div>
        </div>
        <ArrowUpRight className="w-4 h-4 text-black/40" strokeWidth={2} />
      </div>
      <div className="px-1">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex-1 flex items-center gap-1.5">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.12, ease: EASE }}
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: i === 0 ? ACCENT : `${ACCENT}55` }}
              />
              {i < 2 && <div className="flex-1 h-px" style={{ background: i === 0 ? ACCENT : `${ACCENT}55` }} />}
            </div>
          ))}
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[8.5px] font-bold tracking-[0.18em] text-black/50">
          <span style={{ color: ACCENT }}>SENT</span>
          <span>FREE</span>
          <span>FREE</span>
        </div>
      </div>
    </div>
  );
}

function ReferralPairWidget() {
  return (
    <div className="space-y-3">
      <div
        className="flex items-center gap-3 p-3 rounded-xl"
        style={{ background: "rgba(0,0,0,0.025)", border: "1px solid rgba(0,0,0,0.05)" }}
      >
        <div className="flex -space-x-2">
          <Avatar initials="Y" bg="#ffd6e7" size={34} />
          <Avatar initials="K" bg="#d6f5eb" size={34} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] font-bold text-black truncate">You + Kai</span>
            <span className="text-[9px] font-bold tracking-[0.18em] text-black/40">· REF</span>
          </div>
          <div className="text-[10.5px] text-black/55 mt-0.5" style={{ fontFamily: "ui-monospace, monospace" }}>
            Trade $100 to unlock
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {["You +$20", "Kai +$20"].map((t, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-3 py-2 rounded-lg"
            style={{ background: `${ACCENT}10`, border: `1px solid ${ACCENT}33` }}
          >
            <span className="text-[9.5px] font-bold tracking-[0.12em] text-black/55">
              {t.split(" ")[0].toUpperCase()}
            </span>
            <span
              className="text-[12px] font-bold"
              style={{ color: ACCENT, fontFamily: "ui-monospace, monospace" }}
            >
              {t.split(" ")[1]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LeaderboardWidget() {
  const points: [number, number][] = [
    [0, 28], [16, 22], [32, 24], [48, 14], [64, 10], [80, 4],
  ];
  return (
    <div className="space-y-3">
      <div
        className="flex items-center gap-3 p-3 rounded-xl"
        style={{ background: "rgba(0,0,0,0.025)", border: "1px solid rgba(0,0,0,0.05)" }}
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
          style={{ background: ACCENT, color: "#0a0a0a", fontFamily: "ui-serif, Georgia, serif" }}
        >
          3
        </div>
        <Avatar initials="JS" bg="#fff0d6" size={32} />
        <div className="flex-1 min-w-0">
          <div className="text-[12px] font-bold text-black truncate">Jules S.</div>
          <div className="text-[10.5px] text-black/55 mt-0.5" style={{ fontFamily: "ui-monospace, monospace" }}>
            $48 / wk · rising
          </div>
        </div>
        <svg viewBox="0 0 80 32" width="56" height="22" className="flex-shrink-0">
          <motion.path
            d={`M ${points.map((p) => p.join(",")).join(" L ")}`}
            stroke={ACCENT}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE }}
          />
          <circle cx={points[points.length - 1][0]} cy={points[points.length - 1][1]} r="2.5" fill={ACCENT} />
        </svg>
      </div>
      <div className="flex items-center justify-between px-1">
        <span className="text-[9px] font-bold tracking-[0.18em] text-black/45">NEXT TRADES</span>
        <div
          className="px-2.5 py-1 rounded-full flex items-center gap-1.5"
          style={{ background: `${ACCENT}1a`, border: `1px solid ${ACCENT}55` }}
        >
          <span className="text-[11px] font-bold" style={{ color: ACCENT, fontFamily: "ui-monospace, monospace" }}>
            +15%
          </span>
          <span className="text-[8.5px] font-bold tracking-[0.18em] text-black/55">· 5 LEFT</span>
        </div>
      </div>
    </div>
  );
}
