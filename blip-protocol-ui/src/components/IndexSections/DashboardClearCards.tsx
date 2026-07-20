import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, Check, ShieldCheck } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;
const ACCENT = "#cc785c";

type CardData = {
  key: string;
  label: string;
  refTag: string;
  accent: string;
  hero: "orderbook" | "spread" | "settle" | "verified";
  titlePre: string;
  titleAccent: string;
  titleTail?: string;
  cta: string;
};

const CARDS: CardData[] = [
  {
    key: "orderbook", label: "ORDER FLOW · LIVE", refTag: "ROUTING", accent: ACCENT,
    hero: "orderbook", titlePre: "Verified orders route", titleAccent: "straight to your desk.",
    cta: "Open desk",
  },
  {
    key: "spread", label: "MERCHANT SPREAD", refTag: "YOU SET IT", accent: ACCENT,
    hero: "spread", titlePre: "Set your own spread.", titleAccent: "Keep the margin.",
    cta: "Set spread",
  },
  {
    key: "settle", label: "INSTANT SETTLEMENT", refTag: "< 60s", accent: ACCENT,
    hero: "settle", titlePre: "Profit settles", titleAccent: "instantly, on-chain.",
    cta: "View payouts",
  },
  {
    key: "verified", label: "VERIFIED · FINAL", refTag: "ON-CHAIN", accent: ACCENT,
    hero: "verified", titlePre: "Final settlement.", titleAccent: "No chargebacks, ever.",
    cta: "Get verified",
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
  if (kind === "orderbook") return <OrderBookHero accent={accent} />;
  if (kind === "spread") return <SpreadHero accent={accent} />;
  if (kind === "settle") return <SettleHero accent={accent} />;
  return <VerifiedHero accent={accent} />;
}

/* Live feed of incoming orders routing to the merchant desk. */
function OrderBookHero({ accent }: { accent: string }) {
  const rows = [
    { pair: "USDT → INR", amt: "$1,000", take: "+$2.40", live: true },
    { pair: "USDC → BRL", amt: "$420", take: "+$0.98", live: false },
    { pair: "USDT → NGN", amt: "$780", take: "+$1.82", live: false },
  ];
  return (
    <div className="w-full px-4 flex flex-col gap-1.5">
      {rows.map((r, i) => (
        <motion.div
          key={r.pair}
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 + i * 0.1, duration: 0.5, ease: EASE }}
          className="flex items-center justify-between rounded-lg px-2.5 py-1.5"
          style={{
            background: r.live ? `${accent}14` : "#ffffff",
            border: `1px solid ${r.live ? accent + "55" : "rgba(0,0,0,0.06)"}`,
          }}
        >
          <div className="flex items-center gap-1.5">
            {r.live && (
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: accent }}
              />
            )}
            <span
              className="text-[10px] font-bold tracking-tight text-black/70"
              style={{ fontFamily: "ui-monospace, monospace" }}
            >
              {r.pair}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] font-bold text-black/45"
              style={{ fontFamily: "ui-monospace, monospace" }}
            >
              {r.amt}
            </span>
            <span
              className="text-[10px] font-bold"
              style={{ color: accent, fontFamily: "ui-monospace, monospace" }}
            >
              {r.take}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* Bid/ask bar with the merchant's margin highlighted. */
function SpreadHero({ accent }: { accent: string }) {
  return (
    <div className="w-full px-5 flex flex-col items-center justify-center gap-3">
      <div className="w-full flex items-baseline justify-between" style={{ fontFamily: "ui-monospace, monospace" }}>
        <div className="flex flex-col">
          <span className="text-[8px] font-bold tracking-[0.18em] text-black/40">BUY</span>
          <span className="text-[15px] font-bold text-black/80">102.5</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[8px] font-bold tracking-[0.18em]" style={{ color: accent }}>SELL</span>
          <span className="text-[15px] font-bold" style={{ color: accent }}>105.4</span>
        </div>
      </div>
      <div className="relative w-full h-2 rounded-full" style={{ background: "rgba(0,0,0,0.06)" }}>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "58%" }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
          className="absolute left-0 top-0 h-full rounded-full"
          style={{ background: accent }}
        />
        <motion.div
          initial={{ left: 0 }}
          whileInView={{ left: "calc(58% - 8px)" }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
          className="absolute -top-1 w-4 h-4 rounded-full border-2 border-white"
          style={{ background: accent, boxShadow: `0 4px 12px ${accent}66` }}
        />
      </div>
      <div
        className="px-2.5 py-1 rounded-full text-[9.5px] font-bold tracking-[0.14em]"
        style={{ background: "#0a0a0a", color: "#fff", fontFamily: "ui-monospace, monospace" }}
      >
        YOUR MARGIN · 2.9%
      </div>
    </div>
  );
}

/* On-chain payout chip — settles instantly. */
function SettleHero({ accent }: { accent: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-4">
      <div className="flex items-center gap-2.5 rounded-2xl px-4 py-2.5" style={{ background: "#0a0a0a" }}>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[12px]"
          style={{ background: accent, color: "#0a0a0a", fontFamily: "ui-serif, Georgia, serif" }}
        >
          $
        </div>
        <div className="flex flex-col">
          <span className="text-white font-bold text-[15px] leading-none" style={{ fontFamily: "ui-monospace, monospace" }}>
            +$1,000
          </span>
          <span className="text-white/45 text-[8px] font-bold tracking-[0.14em] mt-1">USDT · SETTLED</span>
        </div>
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: 0.4 }}
          className="ml-1 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: accent }}
        >
          <Check className="w-3 h-3 text-white" strokeWidth={3.5} />
        </motion.div>
      </div>
      <span
        className="text-[9px] font-bold tracking-[0.16em] text-black/45"
        style={{ fontFamily: "ui-monospace, monospace" }}
      >
        0x7a…f3 · CONFIRMED
      </span>
    </div>
  );
}

/* Verified-merchant shield — final settlement, no chargebacks. */
function VerifiedHero({ accent }: { accent: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-4">
      <motion.div
        animate={{ boxShadow: [`0 0 0 ${accent}00`, `0 0 28px ${accent}44`, `0 0 0 ${accent}00`] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: accent }}
      >
        <ShieldCheck className="w-8 h-8 text-white" strokeWidth={1.8} />
      </motion.div>
      <div className="flex flex-col items-center gap-1.5">
        <span className="text-[9.5px] font-bold tracking-[0.16em] text-black/55">VERIFIED MERCHANT</span>
        <span
          className="px-2.5 py-1 rounded-full text-[9px] font-bold tracking-[0.14em] line-through"
          style={{ background: "rgba(0,0,0,0.05)", color: "#0a0a0a", fontFamily: "ui-monospace, monospace" }}
        >
          CHARGEBACKS
        </span>
      </div>
    </div>
  );
}
