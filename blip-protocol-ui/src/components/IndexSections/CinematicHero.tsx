import { useEffect, useRef, useState, useMemo, memo } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { MerchantCardsAppStyle } from "./MerchantCardsAppStyle";
import { DashboardMerchantCards as LocalDashboardMerchantCards } from "./DashboardMerchantCards";
import {
  EditorialMerchantCards,
  DashboardMixedCards,
  DashboardAppleCards,
  DashboardClearCards,
  DashboardKineticCards,
  DashboardMerchantCards,
  MerchantCarouselPainted,
  CardHeroGrid,
} from "@/pages/CardPreview";
import { useMerchantCardsVariant } from "@/hooks/useMerchantCardsVariant";
import {
  ArrowRight,
  Loader2,
  AlertCircle,
  Lock,
  Check,
} from "lucide-react";
import {
  MerchantDashboardBody,
  useMerchantDashboardState,
} from "./LiveMerchantDashboard";

const EASE = [0.16, 1, 0.3, 1] as const;

/* Hero character crossfade slideshow — 4 vibe portraits, 4s per slide. */
const HERO_CHARS = [
  { src: "/illustrations/hero-char-1.png?v=2", alt: "Streetwear skater girl with headphones" },
  { src: "/illustrations/hero-char-3.png?v=2", alt: "Cozy creator with laptop and coffee" },
  { src: "/illustrations/hero-char-4.png?v=2", alt: "Chill music producer with headphones" },
] as const;

function HeroCharacterSlideshow() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => {
      setIdx((i) => (i + 1) % HERO_CHARS.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}
      className="relative w-full max-w-[480px] mx-auto md:mx-0 md:justify-self-end"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
        style={{ aspectRatio: "1 / 1" }}
      >
        <AnimatePresence mode="sync">
          {HERO_CHARS.map((c, i) =>
            i === idx ? (
              <motion.img
                key={c.src}
                src={c.src}
                alt={c.alt}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.9, ease: EASE }}
                className="absolute inset-0 w-full h-full object-contain"
                loading="eager"
              />
            ) : null,
          )}
        </AnimatePresence>
      </motion.div>

      {/* Floating market pills — subtle context, max 3 */}
      <motion.div
        initial={{ opacity: 0, x: -10, y: 8 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2, ease: EASE }}
        className="absolute left-[-6%] top-[18%] z-10 hidden sm:block"
        style={{ pointerEvents: "none" }}
      >
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white text-black text-[10.5px] font-semibold tracking-tight"
          style={{
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow: "0 10px 24px -10px rgba(0,0,0,0.18)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#cc785c" }} />
          Offer matched
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 10, y: -8 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, delay: 1.45, ease: EASE }}
        className="absolute right-[-4%] top-[44%] z-10 hidden sm:block"
        style={{ pointerEvents: "none" }}
      >
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black text-white text-[10.5px] font-semibold tracking-tight"
          style={{ boxShadow: "0 10px 24px -10px rgba(0,0,0,0.45)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
          Escrow locked
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -10, y: -8 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, delay: 1.7, ease: EASE }}
        className="absolute left-[2%] bottom-[12%] z-10 hidden sm:block"
        style={{ pointerEvents: "none" }}
      >
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white text-black text-[10.5px] font-semibold tracking-tight"
          style={{
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow: "0 10px 24px -10px rgba(0,0,0,0.18)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#6ee0c5" }} />
          Local payout
        </div>
      </motion.div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {HERO_CHARS.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            aria-label={`Show character ${i + 1}`}
            className="h-1.5 rounded-full transition-all"
            style={{
              width: i === idx ? 18 : 6,
              background: i === idx ? "#0a0a0a" : "rgba(0,0,0,0.2)",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────
   BlipMarketHeroVisual — premium market preview for the hero
   right column. Central offers card + ambient pills + subtle
   network nodes. No people, no crypto cliché.
   ──────────────────────────────────────────────────────────── */
const MARKET_OFFERS = [
  { name: "Merchant A", rate: "₹97,850", time: "2 min", best: true },
  { name: "Merchant B", rate: "₹97,640", time: "4 min", best: false },
  { name: "Merchant C", rate: "₹97,420", time: "6 min", best: false },
];

function BlipMarketHeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}
      className="relative w-full max-w-[480px] mx-auto md:mx-0 md:justify-self-end"
    >
      {/* Subtle network lines — sit behind everything */}
      <svg
        aria-hidden
        viewBox="0 0 400 400"
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="hero-dots" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.7" fill="rgba(0,0,0,0.05)" />
          </pattern>
        </defs>
        <rect width="400" height="400" fill="url(#hero-dots)" />
        {/* faint connector strokes */}
        <path d="M 60 100 Q 200 60 340 120" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="1" strokeDasharray="2 4" />
        <path d="M 60 320 Q 200 360 340 280" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="1" strokeDasharray="2 4" />
        {/* tiny route nodes */}
        {[
          { x: 60, y: 100 },
          { x: 340, y: 120 },
          { x: 340, y: 280 },
          { x: 60, y: 320 },
        ].map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r="2.4" fill="#0a0a0a" opacity="0.18" />
            <motion.circle
              cx={n.x}
              cy={n.y}
              r="5"
              fill="none"
              stroke="#cc785c"
              strokeWidth="0.6"
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: [0, 0.5, 0], scale: [0.4, 2, 2.4] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.75, ease: "easeOut" }}
              style={{ transformOrigin: `${n.x}px ${n.y}px` }}
            />
          </g>
        ))}
      </svg>

      {/* Central market card — gently floats. On mobile, splits into 2 stacked cards. */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative flex flex-col gap-3 sm:gap-0 sm:rounded-2xl sm:bg-white sm:border sm:border-black/[0.06] sm:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.18),0_8px_24px_-12px_rgba(0,0,0,0.08)]"
      >
        {/* ─── Card A: header (mobile gets its own chrome) ─── */}
        <div className="rounded-2xl bg-white sm:bg-transparent sm:rounded-none border border-black/[0.06] sm:border-0 shadow-[0_20px_40px_-18px_rgba(0,0,0,0.14)] sm:shadow-none">
        {/* Card header */}
        <div className="px-4 pt-4 pb-3 flex items-center justify-between">
          <div>
            <div className="text-[15px] font-semibold tracking-tight text-black leading-none">
              Blip Market
            </div>
            <div className="text-[11px] text-black/55 mt-1 tracking-tight">
              Live settlement offers
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inset-0 rounded-full bg-[#cc785c] opacity-60 animate-ping" />
              <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-[#cc785c]" />
            </span>
            <span className="text-[9.5px] font-mono text-black/45 uppercase tracking-[0.16em]">
              Live
            </span>
          </div>
        </div>

        <div className="hidden sm:block h-px bg-black/[0.06] mx-4" />
        </div>
        {/* ─── Card B: offers + footer ─── */}
        <div className="rounded-2xl bg-white sm:bg-transparent sm:rounded-none border border-black/[0.06] sm:border-0 shadow-[0_20px_40px_-18px_rgba(0,0,0,0.14)] sm:shadow-none">

        {/* Offer rows */}
        <div className="px-3 py-2 space-y-1">
          {MARKET_OFFERS.map((o, i) => (
            <motion.div
              key={o.name}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.35 + i * 0.1, ease: EASE }}
              className="flex items-center justify-between rounded-lg px-2.5 py-2"
              style={{
                background: o.best ? "rgba(204,120,92,0.07)" : "transparent",
                border: o.best ? "1px solid rgba(204,120,92,0.18)" : "1px solid transparent",
              }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: o.best ? "#cc785c" : "rgba(0,0,0,0.2)" }}
                />
                <span className="text-[12px] font-medium text-black truncate">{o.name}</span>
                {o.best && (
                  <span
                    className="text-[8.5px] font-bold tracking-[0.14em] uppercase shrink-0"
                    style={{ color: "#cc785c" }}
                  >
                    Best quote
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <span className="font-mono text-[12px] font-semibold text-black tabular-nums">
                  {o.rate}
                </span>
                <span className="text-[10px] font-mono text-black/40 tabular-nums">
                  {o.time}
                </span>
                <Check className="w-3 h-3 text-black/35" strokeWidth={2.5} />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="h-px bg-black/[0.06] mx-4" />

        {/* Card footer */}
        <div className="px-4 py-3 flex items-center justify-between text-[10.5px] text-black/50">
          <span>Quotes refresh in real time</span>
          <span className="font-mono">3 / 3 live</span>
        </div>
        </div>
      </motion.div>

      {/* Floating pills */}
      <motion.div
        initial={{ opacity: 0, x: -12, y: 6 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, delay: 1.0, ease: EASE }}
        className="absolute -left-3 sm:-left-6 top-[10%] z-10"
      >
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white text-black text-[10.5px] font-semibold tracking-tight"
          style={{
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow: "0 14px 30px -14px rgba(0,0,0,0.2)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#cc785c" }} />
          3 merchants competing
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 12, y: -6 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2, ease: EASE }}
        className="absolute -right-2 sm:-right-4 top-[44%] z-10 hidden sm:block"
      >
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black text-white text-[10.5px] font-semibold tracking-tight"
          style={{ boxShadow: "0 14px 30px -12px rgba(0,0,0,0.45)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
          Escrow locked
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -12, y: -6 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, delay: 1.4, ease: EASE }}
        className="absolute -left-2 sm:-left-5 bottom-[10%] z-10 hidden sm:block"
      >
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white text-black text-[10.5px] font-semibold tracking-tight"
          style={{
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow: "0 14px 30px -14px rgba(0,0,0,0.2)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#cc785c" }} />
          Best quote matched
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 12, y: 6 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, delay: 1.6, ease: EASE }}
        className="absolute -right-1 sm:-right-3 bottom-[6%] z-10"
      >
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white text-black text-[10.5px] font-semibold tracking-tight"
          style={{
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow: "0 14px 30px -14px rgba(0,0,0,0.2)",
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#9ad1ff" }} />
          Local payout ready
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────
   Quiet global network — sits behind everything as ambient
   texture, never as a focal element. No arcs flashing, no
   node pulses. Just an intelligent map breathing slowly.
   ──────────────────────────────────────────────────────────── */
const NODES = [
  { id: "MUM", x: 71, y: 56 },
  { id: "DEL", x: 70, y: 47 },
  { id: "DXB", x: 63, y: 52 },
  { id: "MNL", x: 86.5, y: 60 },
  { id: "SIN", x: 81.5, y: 67 },
  { id: "BKK", x: 81, y: 60 },
  { id: "LON", x: 48, y: 38 },
  { id: "NYC", x: 26, y: 45 },
  { id: "TYO", x: 89, y: 47 },
  { id: "LAG", x: 49, y: 65 },
];

/* Four corridors — minimal, all cool tones, slow flow */
const ARCS = [
  { from: "DXB", to: "MUM" },
  { from: "SIN", to: "MUM" },
  { from: "LON", to: "DXB" },
  { from: "NYC", to: "MUM" },
];

function QuietNetwork() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    let raf = 0;
    let nextX = 0;
    let nextY = 0;
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      nextX = ((e.clientX - cx) / cx) * 6;
      nextY = ((e.clientY - cy) / cy) * 4;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setTilt({ x: nextX, y: nextY });
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const arcs = useMemo(
    () =>
      ARCS.map((a, i) => {
        const from = NODES.find((n) => n.id === a.from)!;
        const to = NODES.find((n) => n.id === a.to)!;
        const mx = (from.x + to.x) / 2;
        const my = (from.y + to.y) / 2 - 7;
        return {
          d: `M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`,
          delay: i * 1.4,
        };
      }),
    [],
  );

  const landDots = useMemo(() => {
    const out: { x: number; y: number; r: number; o: number }[] = [];
    for (let i = 0; i < 180; i++) {
      const seed = i * 9301 + 49297;
      const x = seed % 100;
      const y = ((seed * 1.37) % 38) + 8;
      const isLand =
        (x < 30 && y > 12 && y < 45) ||
        (x > 40 && x < 58 && y > 6 && y < 42) ||
        (x > 58 && x < 95 && y > 10 && y < 42);
      if (!isLand) continue;
      out.push({
        x,
        y,
        r: 0.07 + (seed % 7 === 0 ? 0.05 : 0),
        o: 0.07 + ((seed * 7) % 100) / 1800,
      });
    }
    return out;
  }, []);

  return (
    <motion.svg
      viewBox="0 0 100 50"
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="xMidYMid slice"
      animate={{ x: tilt.x, y: tilt.y }}
      transition={{ type: "spring", stiffness: 35, damping: 18, mass: 0.6 }}
    >
      {/* Latitude hairlines — extremely subtle */}
      {[14, 26, 38].map((y) => (
        <line
          key={y}
          x1="0"
          x2="100"
          y1={y}
          y2={y}
          stroke="rgba(255,255,255,0.025)"
          strokeWidth="0.1"
        />
      ))}

      {/* Continent dots */}
      {landDots.map((d, i) => (
        <circle
          key={i}
          cx={d.x}
          cy={d.y}
          r={d.r}
          fill={`rgba(180,200,240,${d.o})`}
        />
      ))}

      {/* Corridor arcs — slow, cool, no warm tones */}
      {arcs.map((arc, i) => (
        <g key={i}>
          <path
            d={arc.d}
            fill="none"
            stroke="rgba(110,170,255,0.12)"
            strokeWidth="0.12"
          />
          <motion.path
            d={arc.d}
            fill="none"
            stroke="rgba(150,200,255,0.7)"
            strokeWidth="0.16"
            strokeLinecap="round"
            strokeDasharray="2 36"
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: -38 }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "linear",
              delay: arc.delay,
            }}
            opacity={0.85}
          />
        </g>
      ))}

      {/* City nodes — static, no pulses */}
      {NODES.map((n) => (
        <circle
          key={n.id}
          cx={n.x}
          cy={n.y}
          r="0.32"
          fill="rgba(200,220,255,0.85)"
        />
      ))}
    </motion.svg>
  );
}

/* ────────────────────────────────────────────────────────────
   Send/Receive — clean vertical stack (Wise-style).
   Send on top, Receive below, tagline beneath.
   ──────────────────────────────────────────────────────────── */
const FIATS = [
  { code: "INR", symbol: "₹", flag: "🇮🇳", rate: 97.85, locale: "en-IN", digits: 0 },
  { code: "AED", symbol: "AED", flag: "🇦🇪", rate: 3.665, locale: "en-AE", digits: 2 },
  { code: "PHP", symbol: "₱", flag: "🇵🇭", rate: 55.81, locale: "en-PH", digits: 0 },
  { code: "THB", symbol: "฿", flag: "🇹🇭", rate: 35.4, locale: "en-TH", digits: 0 },
];

export function SendReceiveWidget({
  isInView,
  onSend,
  sending,
  availableBalance,
  sendAmount,
  setSendAmount,
  fiatIdx,
  setFiatIdx,
}: {
  isInView: boolean;
  onSend: (order: InlineOrder, numericAmount: number) => void;
  sending: boolean;
  availableBalance: number;
  sendAmount: string;
  setSendAmount: (v: string) => void;
  fiatIdx: number;
  setFiatIdx: (fn: (i: number) => number) => void;
}) {
  const fiat = FIATS[fiatIdx];

  const numeric = useMemo(() => {
    const n = parseFloat(sendAmount.replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? n : 0;
  }, [sendAmount]);
  const receive = useMemo(() => numeric * fiat.rate, [numeric, fiat.rate]);
  const fmt = (n: number) =>
    n.toLocaleString(fiat.locale, {
      minimumFractionDigits: fiat.digits,
      maximumFractionDigits: fiat.digits,
    });

  const insufficient = numeric > availableBalance;
  const canSend = !sending && numeric > 0 && !insufficient;

  const handleSend = () => {
    if (!canSend) return;
    const profit = (numeric * 0.0018).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    onSend(
      {
        id: `usr-${Date.now()}`,
        pair: `USD → ${fiat.code}`,
        amount: `$${numeric.toLocaleString("en-US")}`,
        payout: `${fiat.symbol === "AED" ? "AED " : fiat.symbol}${fmt(receive)}`,
        rate: `${fiat.symbol === "AED" ? "AED " : fiat.symbol}${fiat.rate}`,
        merchant: "AlphaFX",
        profit: `+$${profit}`,
      },
      numeric,
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, ease: EASE, delay: 0.4 }}
      className="w-full max-w-[440px] mb-5"
    >
      {/* Live settlement-request — single card on desktop, split into 2 stacked cards on mobile */}
      <div className="flex flex-col gap-2 sm:gap-0 sm:rounded-2xl sm:overflow-hidden sm:bg-white sm:border sm:border-black/[0.08]">
        {/* ─── Card A: Send (Move) ─── */}
        <div className="rounded-2xl sm:rounded-none bg-white border border-black/[0.08] sm:border-0">
        {/* Header strip */}
        <div className="flex items-center justify-between px-3 pt-2 pb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inset-0 rounded-full bg-[#cc785c] opacity-60 animate-ping" />
              <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-[#cc785c]" />
            </span>
            <span className="text-[9px] font-semibold tracking-[0.16em] uppercase text-black/55">
              Live Settlement Request
            </span>
          </div>
          <span className="text-[9px] font-mono text-black/40">#REQ-8421</span>
        </div>

        {/* Move + Best market quote */}
        <div className="px-3 pb-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-[8.5px] font-semibold tracking-[0.14em] uppercase text-black/45">Move</div>
              <div className="font-mono text-[17px] font-semibold tracking-tight text-black tabular-nums leading-tight">
                $1,000
              </div>
            </div>
            <ArrowRight className="w-3 h-3 text-black/30 shrink-0 hidden sm:block" />
            {/* Best quote — desktop only; mobile renders below in Card B */}
            <div className="text-right min-w-0 hidden sm:block">
              <div className="flex items-center justify-end gap-1">
                <span className="text-[8.5px] font-semibold tracking-[0.14em] uppercase text-black/45">Best quote</span>
                <button
                  type="button"
                  onClick={() => setFiatIdx((i) => (i + 1) % FIATS.length)}
                  className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded hover:bg-black/[0.05] transition-colors"
                  aria-label="Change currency"
                >
                  <span className="text-[10px]">{fiat.flag}</span>
                  <span className="font-mono text-[9px] font-semibold text-black tabular-nums">
                    {fiat.symbol === "AED" ? "AED" : fiat.symbol}
                  </span>
                  <span className="text-black/30 text-[6px]">▾</span>
                </button>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${fiat.code}-${receive}`}
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="font-mono text-[17px] font-semibold tracking-tight tabular-nums leading-tight"
                  style={{ color: "#cc785c" }}
                >
                  {fmt(receive)}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
        </div>

        {/* ─── Card B: Receive (Best quote) — mobile only ─── */}
        <div className="sm:hidden rounded-2xl bg-white border border-black/[0.08]">
          <div className="px-3 py-2.5 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-[8.5px] font-semibold tracking-[0.14em] uppercase text-black/45">Best quote</div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${fiat.code}-${receive}-m`}
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="font-mono text-[17px] font-semibold tracking-tight tabular-nums leading-tight"
                  style={{ color: "#cc785c" }}
                >
                  {fmt(receive)}
                </motion.div>
              </AnimatePresence>
            </div>
            <button
              type="button"
              onClick={() => setFiatIdx((i) => (i + 1) % FIATS.length)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-black/10 hover:bg-black/[0.04] transition-colors"
              aria-label="Change currency"
            >
              <span className="text-[12px]">{fiat.flag}</span>
              <span className="font-mono text-[10px] font-semibold text-black tabular-nums">
                {fiat.symbol === "AED" ? "AED" : fiat.symbol}
              </span>
              <span className="text-black/35 text-[7px]">▾</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────
   Stacked field box used for Send + Receive
   ──────────────────────────────────────────────────────────── */
function FieldBox({
  label,
  suffix,
  suffixIcon,
  onSuffixClick,
  children,
  compact = false,
}: {
  label: string;
  suffix: string;
  suffixIcon?: string;
  onSuffixClick?: () => void;
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <label
      className="block relative rounded-xl cursor-text overflow-hidden"
      style={{
        background:
          "rgba(255,255,255,0.035)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        boxShadow:
          "0 14px 36px -22px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.04) inset",
      }}
    >
      <div className={`flex items-center justify-between ${compact ? "px-3.5 py-2.5" : "px-5 py-4"}`}>
        <div className="flex-1 min-w-0">
          <div className={`text-[9px] font-semibold tracking-[0.22em] uppercase text-white/40 ${compact ? "mb-1" : "mb-2"}`}>
            {label}
          </div>
          {children}
        </div>
        {onSuffixClick ? (
          <button
            type="button"
            onClick={onSuffixClick}
            className={`flex items-center gap-1 ml-2.5 ${compact ? "px-2 py-1" : "px-3 py-2"} rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-colors shrink-0`}
            aria-label="Change currency"
          >
            {suffixIcon && <span className={compact ? "text-[12px]" : "text-[14px]"}>{suffixIcon}</span>}
            <span className={`${compact ? "text-[10.5px]" : "text-[11.5px]"} font-semibold tracking-tight text-white`}>
              {suffix}
            </span>
            <span className="text-white/35 text-[8.5px]">▾</span>
          </button>
        ) : (
          <div className={`flex items-center gap-1 ml-2.5 ${compact ? "px-2 py-1" : "px-3 py-2"} rounded-full border border-white/10 bg-white/[0.04] shrink-0`}>
            {suffixIcon && <span className={compact ? "text-[12px]" : "text-[14px]"}>{suffixIcon}</span>}
            <span className={`${compact ? "text-[10.5px]" : "text-[11.5px]"} font-semibold tracking-tight text-white`}>
              {suffix}
            </span>
          </div>
        )}
      </div>
    </label>
  );
}

/* ────────────────────────────────────────────────────────────
   Inline Merchant Dashboard — compact version that lives in
   the bottom half of the hero. Auto-cycles new orders through
   Incoming → Settling → Settled every ~2.6s.
   ──────────────────────────────────────────────────────────── */
export type InlineOrder = {
  id: string;
  pair: string;
  amount: string;
  payout: string;
  rate: string;
  merchant: string;
  profit: string;
};

const INLINE_ORDER_POOL: Omit<InlineOrder, "id">[] = [
  { pair: "USDT → INR", amount: "$2,400", payout: "₹2,14,608", rate: "₹89.42", merchant: "AlphaFX", profit: "+$4.20" },
  { pair: "USDT → AED", amount: "$5,100", payout: "AED 18,720", rate: "3.671", merchant: "GulfTrade", profit: "+$9.18" },
  { pair: "USDT → PHP", amount: "$850", payout: "₱47,438", rate: "55.81", merchant: "NovaP2P", profit: "+$1.53" },
  { pair: "USDT → INR", amount: "$1,200", payout: "₹1,07,304", rate: "₹89.42", merchant: "SwiftExch", profit: "+$2.16" },
  { pair: "USDT → THB", amount: "$3,400", payout: "฿120,360", rate: "35.4", merchant: "CedarFX", profit: "+$6.12" },
  { pair: "USDT → INR", amount: "$1,800", payout: "₹1,60,956", rate: "₹89.42", merchant: "AlphaFX", profit: "+$3.24" },
];

function makeInlineOrder(seq: number): InlineOrder {
  const seed = INLINE_ORDER_POOL[seq % INLINE_ORDER_POOL.length];
  return { ...seed, id: `inline-ord-${seq}` };
}

export type DashNotification = {
  id: string;
  kind: "info" | "warn" | "success";
  title: string;
  meta?: string;
};

export function InlineMerchantDashboard({
  balance,
  totalEarned,
  pending,
  inProgress,
  completed,
  notifications,
  currentSend,
  currentFiat,
}: {
  balance: number;
  totalEarned: number;
  pending: InlineOrder | null;
  inProgress: InlineOrder | null;
  completed: InlineOrder[];
  notifications: DashNotification[];
  currentSend: string;
  currentFiat: string;
}) {

  const isIdle = !pending && !inProgress;
  const balanceFmt = balance.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const earnedFmt = totalEarned.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: EASE, delay: 0.7 }}
      className="relative rounded-2xl overflow-hidden"
      style={{
        /* Spotlight: break out of the 1180px main, span ~92vw */
        width: "92vw",
        maxWidth: 1480,
        marginLeft: "calc(50% - min(46vw, 740px))",
        marginRight: "calc(50% - min(46vw, 740px))",
        background:
          "rgba(255,255,255,0.035)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow:
          "0 40px 90px -32px rgba(0,0,0,0.7), 0 1px 0 rgba(255,255,255,0.04) inset",
      }}
    >
      {/* Chrome bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-white/15" />
            <span className="w-2 h-2 rounded-full bg-white/15" />
            <span className="w-2 h-2 rounded-full bg-white/15" />
          </div>
          <span className="text-[9.5px] font-mono tracking-tight text-white/35 hidden sm:inline">
            app.blip.money/merchant · Dashboard
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex w-1 h-1">
            <span className="absolute inset-0 rounded-full bg-[#cc785c] opacity-60 animate-ping" />
            <span className="relative inline-flex rounded-full w-1 h-1 bg-[#cc785c]" />
          </span>
          <span className="text-[8.5px] font-semibold tracking-[0.22em] uppercase text-white/50">
            {isIdle ? "Merchant · Idle" : "Merchant · Routing"}
          </span>
        </div>
      </div>

      {/* App navbar (Dashboard / Settings + Blip Points + Wallet) */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.05] bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-1">
          <DashTab label="Dashboard" active />
          <DashTab label="Settings" />
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06]">
            <span className="w-1 h-1 rounded-full bg-[#ffb872]" />
            <span className="text-[10px] font-semibold text-white/75 tracking-tight">
              500
            </span>
            <span className="text-[9px] text-white/40">Blip Points</span>
          </span>
          <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06]">
            <Wallet className="w-3 h-3 text-white/65" strokeWidth={2.2} />
            <span className="text-[10px] font-semibold text-white/75 tracking-tight">
              Wallet
            </span>
          </span>
        </div>
      </div>

      {/* 5-panel layout: Sidebar · Pending · In Progress · Leaderboard/Activity · Notifications */}
      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr_1fr_180px_200px]">
        {/* ── LEFT SIDEBAR: StatusCard replica ── */}
        <aside className="border-b md:border-b-0 md:border-r border-white/[0.05] bg-black/30">
          {/* Sticky live ticker — Shield + Coins + Active toggle */}
          <div className="sticky top-0 z-20 flex items-center justify-between px-3 py-2 border-b border-white/[0.04] bg-black/60 backdrop-blur-md text-[9px] font-mono">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Shield className="w-2.5 h-2.5 text-[#6eaaff]" />
                <span className="text-white/70 font-bold tabular-nums">850</span>
              </span>
              <span className="flex items-center gap-1">
                <Coins className="w-2.5 h-2.5 text-amber-400/80" />
                <span className="text-white/70 font-bold tabular-nums">500</span>
              </span>
            </div>
            <div
              className="flex items-center justify-center w-5 h-5 rounded-full border"
              style={{
                background: "rgba(80,220,150,0.10)",
                borderColor: "rgba(80,220,150,0.30)",
                color: "#cc785c",
              }}
              title="Active"
            >
              <Radio className="w-2.5 h-2.5" />
            </div>
          </div>

          {/* Balance hero */}
          <div className="px-4 py-3 relative">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <Wallet className="w-3 h-3 text-white/25" />
                <span className="text-[9.5px] text-white/30 font-mono uppercase tracking-widest">
                  Available Balance
                </span>
              </div>
              <span className="text-[10px] text-white/30">⚙</span>
            </div>
            <motion.div
              key={balanceFmt}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45 }}
              className="font-mono text-[22px] font-black tabular-nums text-white tracking-tight leading-none text-center"
            >
              ${balanceFmt.split(".")[0]}
              <span className="text-white/30">
                .{balanceFmt.split(".")[1]}
              </span>
            </motion.div>
            <div className="text-center text-[9px] text-white/30 font-mono uppercase tracking-widest mt-0.5">
              USDT
            </div>

            {/* 24h earnings badge */}
            {totalEarned > 0 && (
              <div className="mt-2.5 flex justify-center">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(110,170,255,0.08)",
                    border: "1px solid rgba(110,170,255,0.18)",
                  }}
                >
                  <TrendingUp className="w-2.5 h-2.5 text-[#6eaaff]" />
                  <span className="text-[10px] font-bold text-[#6eaaff] font-mono tabular-nums">
                    +{earnedFmt} USDT
                  </span>
                  <span className="text-[9px] text-[#6eaaff]/50 font-mono">24h</span>
                </div>
              </div>
            )}

            {/* Locked in escrow */}
            {(pending || inProgress) && (
              <div className="mt-1.5 text-center text-[9px] text-white/20 font-mono">
                {(pending ? parseFloat(pending.amount.replace(/[^0-9.]/g, "")) : 0) +
                  (inProgress
                    ? parseFloat(inProgress.amount.replace(/[^0-9.]/g, ""))
                    : 0)}{" "}
                locked in escrow
              </div>
            )}
          </div>

          {/* Corridor segmented control */}
          <div className="px-3 pb-2 space-y-1.5">
            <div className="inline-flex w-full rounded-lg bg-white/[0.025] border border-white/[0.05] p-0.5">
              {[
                { code: "INR", rate: "₹97.85" },
                { code: "AED", rate: "3.66 AED" },
              ].map((c) => {
                const active = currentFiat === c.code;
                return (
                  <div
                    key={c.code}
                    className={`flex-1 py-1.5 px-2 rounded-md flex items-center justify-center gap-2 transition-colors ${
                      active ? "bg-white/[0.07]" : ""
                    }`}
                  >
                    <span
                      className={`text-[11px] font-medium tracking-tight ${
                        active ? "text-white" : "text-white/40"
                      }`}
                    >
                      USDT/{c.code}
                    </span>
                    <span
                      className={`text-[10px] font-mono tabular-nums ${
                        active ? "text-white/55" : "text-white/30"
                      }`}
                    >
                      {c.rate}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Cash & Market collapsed row */}
            <button
              type="button"
              className="w-full flex items-center justify-between py-1.5 px-2.5 rounded-lg"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-white/30 font-mono uppercase tracking-wider">
                  Cash & Market
                </span>
                <span className="text-[9px] text-white/40 font-mono">₹0</span>
              </div>
              <ChevronDown className="w-3 h-3 text-white/25 -rotate-90" />
            </button>

            {/* Corridor status */}
            <div className="flex items-center justify-between px-2 py-1 text-[9.5px] tracking-tight">
              <span className="text-white/40">Corridor</span>
              <span className="text-white/65">
                <span className="text-[#cc785c]">●</span> Online · vol $0
              </span>
            </div>
          </div>

          {/* Send form — Amount + USDT/INR + MAX + Bank */}
          <div className="px-3 pb-3 space-y-2 border-t border-white/[0.04] pt-3">
            <div className="flex items-center justify-between text-[9px] font-semibold tracking-[0.18em] uppercase text-white/40">
              <span>Amount</span>
              <span className="text-white/30">USDT/{currentFiat} · MAX</span>
            </div>
            <div
              className="flex items-center justify-between rounded-md px-2.5 py-1.5"
              style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <span className="font-mono text-[14px] font-semibold tabular-nums text-white">
                {currentSend}
              </span>
              <span className="text-[10px] text-white/45 font-medium">USDT</span>
            </div>

            {/* Bank account pill */}
            <div
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-md"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <div className="w-5 h-5 rounded bg-white/[0.06] flex items-center justify-center text-[8px]">
                🏦
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] text-white font-medium truncate leading-tight">
                  Emirates Islamic
                </div>
                <div className="text-[8.5px] text-white/35 truncate font-mono">
                  Anupam Sharma · 27500178802
                </div>
              </div>
              <ChevronDown className="w-3 h-3 text-white/30 shrink-0" />
            </div>

            {/* Spread chips */}
            <div className="pt-1">
              <div className="text-[9px] font-semibold tracking-[0.18em] uppercase text-white/40 mb-1">
                Spread
              </div>
              <div className="grid grid-cols-3 gap-1">
                <SpreadChip label="Fast" pct="+2.5%" />
                <SpreadChip label="Best" pct="+2%" active />
                <SpreadChip label="Cheap" pct="+1.5%" />
              </div>
            </div>

            {/* Boost */}
            <div className="pt-1">
              <div className="flex items-center justify-between text-[9px] font-semibold tracking-[0.18em] uppercase text-white/40 mb-1">
                <span>Boost</span>
                <span className="text-white/30">manual</span>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {["0", "5%", "10%", "15%"].map((v, i) => (
                  <button
                    key={v}
                    type="button"
                    className="text-[10px] font-mono font-semibold tracking-tight py-1 rounded"
                    style={{
                      background:
                        i === 0
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(255,255,255,0.025)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      color: i === 0 ? "#fff" : "rgba(255,255,255,0.5)",
                    }}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* BUY / SELL */}
            <div className="grid grid-cols-2 gap-1 pt-1">
              <button
                type="button"
                className="h-9 rounded-lg text-[11.5px] font-bold tracking-wider"
                style={{
                  background: "rgba(80,220,150,0.12)",
                  border: "1px solid rgba(80,220,150,0.28)",
                  color: "#cc785c",
                }}
              >
                BUY
              </button>
              <button
                type="button"
                className="h-9 rounded-lg text-[11.5px] font-bold tracking-wider"
                style={{
                  background: "rgba(255,120,120,0.10)",
                  border: "1px solid rgba(255,120,120,0.25)",
                  color: "#ff9b9b",
                }}
              >
                SELL
              </button>
            </div>
          </div>
        </aside>

        {/* ── COL 2: PENDING ORDERS — ported header from real PendingOrdersPanel ── */}
        <section className="border-b md:border-b-0 md:border-r border-white/[0.05] min-h-[520px] flex flex-col">
          {/* Sticky panel header */}
          <div className="px-3 py-2 border-b border-white/[0.06]">
            {/* Tabs row */}
            <div className="flex items-center justify-between gap-1 mb-2">
              <div className="inline-flex items-center gap-0.5 h-7 p-0.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                {["All", "Pending", "My Orders"].map((t) => (
                  <button
                    key={t}
                    className={`h-full px-2 inline-flex items-center rounded-md text-[10px] font-bold transition-all ${
                      t === "Pending"
                        ? "bg-white text-black shadow"
                        : "text-white/40 hover:text-white/65"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1">
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#ff6b6b]/15 border border-[#ff6b6b]/30">
                  <span className="relative flex w-1 h-1">
                    <span className="absolute inset-0 rounded-full bg-[#ff6b6b] opacity-60 animate-ping" />
                    <span className="relative inline-flex rounded-full w-1 h-1 bg-[#ff6b6b]" />
                  </span>
                  <span className="text-[8.5px] font-bold text-[#ff9b9b] uppercase tracking-tight">
                    Live
                  </span>
                </span>
                <span className="text-[9px] font-mono text-white/45 px-1.5 py-0.5 rounded border border-white/[0.08]">
                  {pending ? 1 : 0}
                </span>
              </div>
            </div>
            {/* Search + filter */}
            <div className="flex items-center gap-1.5">
              <div className="flex-1 flex items-center gap-1.5 bg-white/[0.02] border border-white/[0.06] rounded-lg px-2.5 py-1">
                <span className="text-white/20 text-[10px]">🔍</span>
                <input
                  type="search"
                  placeholder="Search orders..."
                  className="flex-1 bg-transparent text-[10.5px] text-white placeholder:text-white/15 outline-none font-mono"
                />
              </div>
              <button className="flex items-center gap-1 text-[9px] font-mono bg-white/[0.02] text-white/35 border border-white/[0.06] rounded-lg px-1.5 py-1.5">
                Filter
                <ChevronDown className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>

          {/* Orders list */}
          <div className="flex-1 overflow-hidden px-3 py-2.5 space-y-2">
            <AnimatePresence mode="popLayout">
              {pending ? (
                <RealOrderRow key={pending.id} order={pending} status="pending" />
              ) : (
                <motion.div
                  key="empty-pending"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-8 gap-1.5"
                >
                  <Inbox className="w-5 h-5 text-white/15" strokeWidth={1.5} />
                  <span className="text-[10.5px] text-white/30 tracking-tight">
                    No pending orders
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* ── COL 3: IN PROGRESS ── */}
        <section className="border-b md:border-b-0 md:border-r border-white/[0.05] min-h-[520px] flex flex-col">
          {/* Header */}
          <div className="px-3 py-2 border-b border-white/[0.06]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[9.5px] font-bold uppercase tracking-[0.18em] text-white/65">
                  In Progress
                </span>
                <span className="text-[9px] font-mono text-white/45 px-1.5 py-0.5 rounded border border-white/[0.08]">
                  {inProgress ? 1 : 0}
                </span>
              </div>
              <button className="text-white/30 text-[10px]">⋯</button>
            </div>
            {/* Status filter chips */}
            <div className="flex items-center gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden">
              {["All", "Accepted", "Escrowed", "Paid", "Cancelled"].map((c) => (
                <button
                  key={c}
                  className={`px-2 py-0.5 rounded text-[9.5px] font-semibold whitespace-nowrap ${
                    c === "All"
                      ? "bg-white/[0.08] text-white border border-white/[0.12]"
                      : "text-white/30 hover:text-white/50"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Orders list */}
          <div className="flex-1 overflow-hidden px-3 py-2.5 space-y-2">
            <AnimatePresence mode="popLayout">
              {inProgress ? (
                <RealOrderRow
                  key={inProgress.id}
                  order={inProgress}
                  status="settling"
                />
              ) : (
                <motion.div
                  key="empty-prog"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-8 gap-1.5"
                >
                  <Inbox className="w-5 h-5 text-white/15" strokeWidth={1.5} />
                  <span className="text-[10.5px] text-white/30 tracking-tight">
                    No active orders
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* ── COL 4: LEADERBOARD + ACTIVITY ── */}
        <aside className="bg-black/20 border-b md:border-b-0 md:border-r border-white/[0.05] flex flex-col">
          {/* Leaderboard header */}
          <div className="px-3 py-2 border-b border-white/[0.06]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/65">
                Leaderboard
              </span>
              <button className="text-white/30 text-[10px]">⋯</button>
            </div>
            <div className="inline-flex items-center gap-0.5 h-6 p-0.5 rounded-md bg-white/[0.04] border border-white/[0.06]">
              {["Volume", "Rated", "Rep"].map((t) => (
                <button
                  key={t}
                  className={`h-full px-1.5 inline-flex items-center rounded text-[9px] font-bold ${
                    t === "Volume" ? "bg-white text-black" : "text-white/40"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          {/* Leaderboard rows */}
          <div className="px-3 py-2 space-y-1">
            {LEADERBOARD.map((row, i) => {
              const RankIcon = i === 0 ? Crown : i === 1 ? Medal : i === 2 ? Award : null;
              return (
                <div
                  key={row.name}
                  className="flex items-center justify-between gap-1.5 py-1 px-1.5 rounded text-[10px] tracking-tight"
                  style={{
                    background: i < 3 ? "rgba(255,255,255,0.022)" : "transparent",
                    border:
                      i < 3 ? "1px solid rgba(255,255,255,0.05)" : "1px solid transparent",
                  }}
                >
                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    <span className="font-mono text-white/35 w-3 text-[9px] tabular-nums">
                      {i + 1}
                    </span>
                    {RankIcon && (
                      <RankIcon className="w-2.5 h-2.5 text-white/55" strokeWidth={2} />
                    )}
                    <span className="text-[11px]">{getEmoji(row.name)}</span>
                    <span className="text-white/85 truncate">{row.name}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="font-mono text-white/85 tabular-nums text-[10px]">
                      {row.volume}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Activity */}
          <div className="mt-auto border-t border-white/[0.05]">
            <div className="px-3 py-2 flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/65">
                Activity
              </span>
              <span className="text-[9px] text-white/30 font-mono">{completed.length}</span>
            </div>
            <div className="px-3 pb-2 space-y-1 max-h-[120px] overflow-hidden">
              <AnimatePresence initial={false}>
                {completed.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-[9.5px] text-white/25 tracking-tight px-1.5 py-1"
                  >
                    No completed trades yet.
                  </motion.div>
                ) : (
                  completed.slice(0, 3).map((order) => (
                    <ActivityRow key={order.id} order={order} />
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </aside>

        {/* ── COL 5: NOTIFICATIONS + MESSAGES ── */}
        <aside className="bg-black/20 flex flex-col">
          {/* Notifications header */}
          <div className="px-3 py-2 border-b border-white/[0.06] flex items-center justify-between">
            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/65">
              Notifications
            </span>
            <div className="flex items-center gap-1.5">
              {notifications.length > 0 && (
                <span className="font-mono text-[9px] font-bold text-white px-1.5 py-0.5 rounded bg-[#ff6b6b]/15 border border-[#ff6b6b]/30 tabular-nums">
                  {notifications.length}
                </span>
              )}
              <span className="text-[9.5px] text-white/35 uppercase tracking-tight">
                Read
              </span>
            </div>
          </div>
          {/* Notifications list */}
          <div className="px-3 py-2 space-y-1.5 max-h-[260px] overflow-hidden">
            <AnimatePresence initial={false}>
              {notifications.slice(0, 5).map((n) => (
                <NotificationRow key={n.id} notif={n} />
              ))}
            </AnimatePresence>
          </div>

          {/* Messages tabs */}
          <div className="mt-auto border-t border-white/[0.05]">
            <div className="px-3 py-2 flex items-center justify-between">
              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/65">
                Messages
              </span>
              <span className="text-[9px] font-mono text-white/30">⋯</span>
            </div>
            <div className="px-3 pb-2">
              <div className="grid grid-cols-3 gap-1 mb-2">
              <MsgTab label="Active" active />
              <MsgTab label="Inbox" />
              <MsgTab label="Disputes" />
            </div>
            <div
              className="rounded px-2 py-2 text-[10px] text-white/30 tracking-tight text-center"
              style={{
                background: "rgba(255,255,255,0.015)",
                border: "1px dashed rgba(255,255,255,0.07)",
              }}
            >
              Search active chats…
            </div>
            </div>
          </div>
        </aside>
      </div>
    </motion.div>
  );
}

const LEADERBOARD = [
  { name: "John", volume: "$3.8K", rating: "5.0" },
  { name: "zoro", volume: "$2.7K", rating: "4.5" },
  { name: "Zayn Khan", volume: "$1.4K", rating: "—" },
  { name: "Drako", volume: "$1.0K", rating: "—" },
  { name: "Hulk", volume: "$315", rating: "1.0" },
  { name: "Craig Morse", volume: "$0", rating: "—" },
];

/** Deterministic emoji per username — mirrors the real app's getEntityEmoji util */
function getEmoji(name: string): string {
  const emojis = ["🦊", "🐻", "🐼", "🐨", "🦁", "🐯", "🐸", "🐙", "🦋", "🐳", "🦄", "🐲", "🐺", "🦅", "🐢"];
  const hash = name.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
  return emojis[hash % emojis.length];
}

/** RealOrderRow — mirrors the actual PendingOrdersPanel order card design.
 *  User emoji + name + amount mono + rate + accept button. */
function RealOrderRow({
  order,
  status,
}: {
  order: InlineOrder;
  status: "pending" | "settling";
}) {
  const isPending = status === "pending";
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.45, ease: EASE }}
      className="rounded-lg overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.022)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="px-3 py-2.5">
        {/* Top: user + amount */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] shrink-0"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              {getEmoji(order.merchant)}
            </div>
            <span className="text-[11px] font-semibold text-white/90 truncate">
              {order.merchant}
            </span>
            {isPending ? (
              <span
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8.5px] font-bold uppercase tracking-tight"
                style={{
                  background: "rgba(110,170,255,0.10)",
                  color: "#a8c8ff",
                  border: "1px solid rgba(110,170,255,0.22)",
                }}
              >
                <motion.span
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                  className="block w-1 h-1 rounded-full bg-[#6eaaff]"
                />
                New
              </span>
            ) : (
              <span
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8.5px] font-bold uppercase tracking-tight"
                style={{
                  background: "rgba(255,180,100,0.10)",
                  color: "#ffc790",
                  border: "1px solid rgba(255,180,100,0.22)",
                }}
              >
                <Loader2 className="w-2.5 h-2.5 animate-spin" strokeWidth={2.5} />
                Escrowed
              </span>
            )}
          </div>
          <span
            className={`font-mono text-sm font-extrabold tabular-nums shrink-0 ${
              isPending ? "text-[#cc785c]" : "text-white"
            }`}
          >
            {order.amount}
          </span>
        </div>

        {/* Middle: pair + rate */}
        <div className="flex items-center justify-between mb-2 text-[10px]">
          <span className="font-mono text-white/55">{order.pair}</span>
          <span className="font-mono text-white/65">@ {order.rate}</span>
        </div>

        {/* Payout */}
        <div className="flex items-baseline justify-between pb-2 border-b border-white/[0.05]">
          <span className="text-[9px] text-white/35 font-mono uppercase tracking-wider">
            They get
          </span>
          <span className="font-mono text-[13px] font-bold text-white tabular-nums">
            {order.payout}
          </span>
        </div>

        {/* Action button */}
        <div className="flex items-center justify-between gap-2 pt-2">
          <button
            type="button"
            className="flex-1 h-7 rounded-md text-[10px] font-bold tracking-wider"
            style={{
              background: isPending
                ? "rgba(80,220,150,0.12)"
                : "rgba(255,180,100,0.10)",
              border: isPending
                ? "1px solid rgba(80,220,150,0.28)"
                : "1px solid rgba(255,180,100,0.22)",
              color: isPending ? "#cc785c" : "#ffc790",
            }}
          >
            {isPending ? "ACCEPT" : "RELEASE ESCROW"}
          </button>
          <button
            type="button"
            className="w-7 h-7 rounded-md flex items-center justify-center text-[10px] text-white/55"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
            title="Chat"
          >
            💬
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function DashTab({ label, active }: { label: string; active?: boolean }) {
  return (
    <span
      className="px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-tight transition-colors"
      style={{
        background: active ? "rgba(255,255,255,0.08)" : "transparent",
        color: active ? "#fff" : "rgba(255,255,255,0.5)",
      }}
    >
      {label}
    </span>
  );
}

function DashSubTab({ label, active }: { label: string; active?: boolean }) {
  return (
    <span
      className="px-2 py-1 rounded-md text-[10.5px] font-semibold tracking-tight"
      style={{
        background: active ? "rgba(255,255,255,0.08)" : "transparent",
        color: active ? "#fff" : "rgba(255,255,255,0.5)",
      }}
    >
      {label}
    </span>
  );
}

function BalanceMini({ code, value }: { code: string; value: string }) {
  return (
    <div className="rounded px-1.5 py-1.5"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="text-[8.5px] font-semibold tracking-tight text-white/45 truncate">
        {code}
      </div>
      <div className="font-mono text-[11px] font-semibold tabular-nums text-white truncate">
        {value}
      </div>
    </div>
  );
}

function ActionChip({
  label,
  highlight,
}: {
  label: string;
  highlight?: boolean;
}) {
  return (
    <button
      type="button"
      className="h-9 rounded-md text-[11px] font-semibold tracking-tight transition-colors"
      style={{
        background: highlight
          ? "rgba(110,170,255,0.12)"
          : "rgba(255,255,255,0.025)",
        border: highlight
          ? "1px solid rgba(110,170,255,0.28)"
          : "1px solid rgba(255,255,255,0.06)",
        color: highlight ? "#a8c8ff" : "rgba(255,255,255,0.75)",
      }}
    >
      {label}
    </button>
  );
}

function PairChip({
  code,
  rate,
  active,
}: {
  code: string;
  rate: string;
  active?: boolean;
}) {
  return (
    <div
      className="rounded-md px-2 py-1.5 flex items-center justify-between"
      style={{
        background: active
          ? "rgba(110,170,255,0.10)"
          : "rgba(255,255,255,0.025)",
        border: active
          ? "1px solid rgba(110,170,255,0.25)"
          : "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <span
        className="text-[10px] font-semibold tracking-tight"
        style={{ color: active ? "#a8c8ff" : "rgba(255,255,255,0.65)" }}
      >
        {code}
      </span>
      <span className="font-mono text-[10px] tabular-nums text-white/65">
        {rate}
      </span>
    </div>
  );
}

function SpreadChip({
  label,
  pct,
  active,
}: {
  label: string;
  pct: string;
  active?: boolean;
}) {
  return (
    <div
      className="rounded-md px-2 py-1.5 text-center"
      style={{
        background: active
          ? "rgba(80,220,150,0.10)"
          : "rgba(255,255,255,0.025)",
        border: active
          ? "1px solid rgba(80,220,150,0.25)"
          : "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        className="text-[9.5px] font-semibold tracking-tight"
        style={{ color: active ? "#cc785c" : "rgba(255,255,255,0.55)" }}
      >
        {label}
      </div>
      <div className="font-mono text-[10px] tabular-nums text-white/75">
        {pct}
      </div>
    </div>
  );
}

function OrderPanel({
  title,
  order,
  palette,
  icon,
  emptyLabel,
}: {
  title: string;
  order: InlineOrder | null;
  palette: {
    chip: string;
    chipBorder: string;
    chipText: string;
    dot: string;
  };
  icon: "dot" | "spinner";
  emptyLabel: string;
}) {
  return (
    <div
      className="relative rounded-lg overflow-hidden flex flex-col min-h-[140px]"
      style={{
        background: order
          ? "rgba(255,255,255,0.035)"
          : "rgba(255,255,255,0.012)",
        border: order
          ? "1px solid rgba(255,255,255,0.07)"
          : "1px dashed rgba(255,255,255,0.07)",
      }}
    >
      <div className="px-3 py-2 border-b border-white/[0.05] flex items-center justify-between">
        <span className="text-[9.5px] font-semibold tracking-[0.16em] uppercase text-white/55">
          {title}
        </span>
        <span className="text-[9px] text-white/30">⋯</span>
      </div>
      <AnimatePresence mode="popLayout">
        {order ? (
          <motion.div
            key={order.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="flex-1 px-3 py-3"
          >
            <div
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full mb-2"
              style={{
                background: palette.chip,
                border: `1px solid ${palette.chipBorder}`,
              }}
            >
              {icon === "spinner" ? (
                <Loader2
                  className="w-2.5 h-2.5 animate-spin"
                  style={{ color: palette.chipText }}
                  strokeWidth={2.5}
                />
              ) : (
                <motion.span
                  animate={{ scale: [0.8, 1.2, 1], opacity: [0.6, 1, 0.95] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                  className="block w-1 h-1 rounded-full"
                  style={{ background: palette.dot }}
                />
              )}
              <span
                className="text-[8.5px] font-semibold tracking-[0.16em] uppercase"
                style={{ color: palette.chipText }}
              >
                {icon === "spinner" ? "Settling" : "New"}
              </span>
            </div>
            <div className="font-mono text-[10px] font-semibold tracking-tight text-white/55 mb-1">
              {order.pair}
            </div>
            <div className="font-mono text-[15px] font-semibold tracking-tight text-white tabular-nums truncate">
              {order.payout}
            </div>
            <div className="text-[10px] text-white/40 mt-0.5 tracking-tight truncate">
              from {order.amount} · {order.merchant}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center px-3 py-4 text-center gap-1"
          >
            <Inbox className="w-4 h-4 text-white/15" strokeWidth={1.8} />
            <span className="text-[10px] text-white/30 tracking-tight">
              {emptyLabel}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MsgTab({ label, active }: { label: string; active?: boolean }) {
  return (
    <button
      type="button"
      className="text-[10px] font-semibold py-1 rounded tracking-tight"
      style={{
        background: active
          ? "rgba(255,255,255,0.08)"
          : "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.06)",
        color: active ? "#fff" : "rgba(255,255,255,0.5)",
      }}
    >
      {label}
    </button>
  );
}

/* ────────────────────────────────────────────────────────────
   Dashboard sub-components
   ──────────────────────────────────────────────────────────── */
function BalanceRow({
  icon,
  code,
  value,
}: {
  icon: string;
  code: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between text-[11px] tracking-tight">
      <div className="flex items-center gap-1.5">
        <span className="text-[10px]">{icon}</span>
        <span className="text-white/55 font-medium">{code}</span>
      </div>
      <span className="font-mono text-white/85 tabular-nums">{value}</span>
    </div>
  );
}

function OrderSlot({
  label,
  order,
  palette,
  icon,
}: {
  label: string;
  order: InlineOrder | null;
  palette: {
    chip: string;
    chipBorder: string;
    chipText: string;
    dot: string;
  };
  icon: "dot" | "spinner";
}) {
  return (
    <div
      className="relative rounded-xl overflow-hidden min-h-[112px]"
      style={{
        background: order
          ? "rgba(255,255,255,0.035)"
          : "rgba(255,255,255,0.012)",
        border: order
          ? "1px solid rgba(255,255,255,0.07)"
          : "1px dashed rgba(255,255,255,0.07)",
      }}
    >
      {/* Label chip top-left */}
      <div className="absolute top-2.5 left-2.5 z-10">
        <div
          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full"
          style={{
            background: order ? palette.chip : "rgba(255,255,255,0.04)",
            border: order
              ? `1px solid ${palette.chipBorder}`
              : "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {order ? (
            icon === "spinner" ? (
              <Loader2
                className="w-2.5 h-2.5 animate-spin"
                style={{ color: palette.chipText }}
                strokeWidth={2.5}
              />
            ) : (
              <motion.span
                animate={{ scale: [0.8, 1.2, 1], opacity: [0.6, 1, 0.95] }}
                transition={{ duration: 1.4, repeat: Infinity }}
                className="block w-1 h-1 rounded-full"
                style={{ background: palette.dot }}
              />
            )
          ) : (
            <span className="block w-1 h-1 rounded-full bg-white/20" />
          )}
          <span
            className="text-[8.5px] font-semibold tracking-[0.16em] uppercase"
            style={{ color: order ? palette.chipText : "rgba(255,255,255,0.3)" }}
          >
            {label}
          </span>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {order ? (
          <motion.div
            key={order.id}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="px-3 py-3 pt-9"
          >
            <div className="font-mono text-[10px] font-semibold tracking-tight text-white/55 mb-1">
              {order.pair}
            </div>
            <div className="font-mono text-[15px] md:text-[16px] font-semibold tracking-tight text-white tabular-nums truncate">
              {order.payout}
            </div>
            <div className="text-[10px] text-white/40 mt-0.5 tracking-tight truncate">
              from {order.amount}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="text-[10px] text-white/20 tracking-tight">—</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ActivityRow({ order }: { order: InlineOrder }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 8 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="flex items-center justify-between px-3 py-2 rounded-lg"
      style={{
        background: "rgba(255,255,255,0.022)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <CheckCircle2
          className="w-3 h-3 text-[#cc785c] shrink-0"
          strokeWidth={2.5}
        />
        <div className="min-w-0">
          <div className="font-mono text-[11px] font-semibold tracking-tight text-white/90 truncate">
            {order.pair} · {order.payout}
          </div>
          <div className="text-[9.5px] text-white/35 tracking-tight">
            from {order.amount} · {order.merchant}
          </div>
        </div>
      </div>
      <span className="font-mono text-[11px] font-semibold tabular-nums text-[#cc785c] shrink-0 ml-2">
        {order.profit}
      </span>
    </motion.div>
  );
}

function NotificationRow({ notif }: { notif: DashNotification }) {
  const Icon =
    notif.kind === "success"
      ? CheckCircle2
      : notif.kind === "warn"
        ? ShieldCheck
        : Bell;
  const color =
    notif.kind === "success"
      ? "#cc785c"
      : notif.kind === "warn"
        ? "#ffc790"
        : "#a8c8ff";
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ duration: 0.45, ease: EASE }}
      className="flex items-start gap-2.5 px-2.5 py-2 rounded-lg"
      style={{
        background: "rgba(255,255,255,0.022)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <Icon
        className="w-3 h-3 shrink-0 mt-[3px]"
        style={{ color }}
        strokeWidth={2.5}
      />
      <div className="min-w-0">
        <div className="text-[11px] font-medium tracking-tight text-white/85 leading-snug">
          {notif.title}
        </div>
        {notif.meta && (
          <div className="text-[9.5px] text-white/35 mt-0.5 tracking-tight font-mono">
            {notif.meta}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────
   Hero
   ──────────────────────────────────────────────────────────── */
const CinematicHero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.2 });

  /* Scroll-linked black → white background transition.
     As the user scrolls past the hero into the dashboard area,
     a white wash sweeps up from the bottom so the dashboard
     ends up floating on a bright surface. */
  const { scrollYProgress: heroScroll } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const whiteWashOpacity = useTransform(heroScroll, [0.5, 0.95], [0, 1]);

  /* ── Widget inputs ── */
  const [sendAmount, setSendAmount] = useState("1,000");
  const [fiatIdx, setFiatIdx] = useState(0);

  /* ── Available balance (still validates Send) ── */
  const STARTING_BALANCE = 12847.2;
  const [balance, setBalance] = useState(STARTING_BALANCE);
  const [sending, setSending] = useState(false);

  /* ── Live merchant dashboard state (real replica hook) ── */
  const dashboardState = useMerchantDashboardState();
  const dashboardRef = useRef<HTMLDivElement>(null);

  const handleSend = (order: InlineOrder, numericAmount: number) => {
    if (sending || numericAmount <= 0 || numericAmount > balance) return;
    setSending(true);
    setBalance((b) => b - numericAmount);

    /* Push the order into the LIVE dashboard's pending list */
    dashboardState.addPendingOrder({
      amount: numericAmount,
      fiat: FIATS[fiatIdx].code === "AED" ? "AED" : "INR",
      side: "SELL",
      user: "You",
      avatar: "🟢",
      price: FIATS[fiatIdx].rate,
    });

    /* Smooth-scroll the dashboard into view so the user sees their order land */
    setTimeout(() => {
      dashboardRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 120);

    /* Re-enable send after the dashboard has time to advance it through stages */
    setTimeout(() => {
      setBalance((b) => b + numericAmount + numericAmount * 0.0018);
      setSending(false);
    }, 6000);
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[150vh] flex flex-col items-stretch text-black bg-white"
    >

      {/* ── Content — 50/50 vertical split ── */}
      <main className="relative z-10 w-full max-w-[1180px] mx-auto px-4 md:px-10 pt-16 md:pt-24 pb-0 md:pb-24 flex-1 flex flex-col items-stretch">
        {/* ── TOP HALF — single centered column ── */}
        <div className="flex flex-col items-center text-center min-h-[80vh] md:min-h-[58vh] justify-center md:justify-end pt-8 pb-0 md:py-16 max-w-[760px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <span className="w-5 h-px bg-black/15" />
            <span className="text-[10px] font-semibold tracking-[0.3em] uppercase whitespace-nowrap text-black">
              Open Liquidity Network
            </span>
            <span className="w-5 h-px bg-black/15" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.08 }}
            className="font-display text-black w-full max-w-none sm:max-w-[760px] px-1"
            style={{
              fontSize: "clamp(3.2rem, 11vw, 3.9rem)",
              fontWeight: 700,
              lineHeight: 0.98,
              letterSpacing: "-0.06em",
              marginBottom: 18,
            }}
          >
            Settle money globally through{" "}
            <span style={{ fontStyle: "italic", fontWeight: 600 }}>open markets.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.18 }}
            className="text-black/55 text-[15px] md:text-[16px] leading-[1.55] tracking-tight max-w-[560px] mx-auto mb-7"
          >
            Blip connects users with verified merchants who compete to settle
            payments faster, safer, and at better rates.
          </motion.p>

          <SendReceiveWidget
            isInView={isInView}
            onSend={handleSend}
            sending={sending}
            availableBalance={balance}
            sendAmount={sendAmount}
            setSendAmount={setSendAmount}
            fiatIdx={fiatIdx}
            setFiatIdx={setFiatIdx}
          />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.52 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-2"
          >
            <button
              type="button"
              disabled={sending}
              onClick={() => {
                const numeric = parseFloat(sendAmount.replace(/[^0-9.]/g, "")) || 0;
                if (numeric <= 0 || numeric > balance) return;
                const fiat = FIATS[fiatIdx];
                const receive = numeric * fiat.rate;
                const fmt = (n: number) =>
                  n.toLocaleString(fiat.locale, {
                    minimumFractionDigits: fiat.digits,
                    maximumFractionDigits: fiat.digits,
                  });
                const profit = (numeric * 0.0018).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                });
                handleSend(
                  {
                    id: `usr-${Date.now()}`,
                    pair: `USD → ${fiat.code}`,
                    amount: `$${numeric.toLocaleString("en-US")}`,
                    payout: `${fiat.symbol === "AED" ? "AED " : fiat.symbol}${fmt(receive)}`,
                    rate: `${fiat.symbol === "AED" ? "AED " : fiat.symbol}${fiat.rate}`,
                    merchant: "AlphaFX",
                    profit: `+$${profit}`,
                  },
                  numeric,
                );
              }}
              className="group inline-flex items-center justify-center gap-2 w-full sm:w-auto h-14 sm:h-12 px-8 sm:px-7 rounded-full bg-black text-white text-[17.5px] sm:text-[15px] font-bold tracking-tight transition-transform hover:-translate-y-[1px] disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_10px_28px_-12px_rgba(0,0,0,0.55)]"
            >
              <span>{sending ? "Sending…" : "Send"}</span>
              <ArrowRight className="w-5 h-5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
            <Link
              to="/register"
              className="group inline-flex items-center justify-center gap-2 w-full sm:w-auto h-14 sm:h-12 px-8 sm:px-6 rounded-full text-[17px] sm:text-[14.5px] font-bold tracking-tight transition-all hover:-translate-y-[1px]"
              style={{
                background: "rgba(204,120,92,0.10)",
                color: "#cc785c",
                border: "1.5px solid #cc785c",
              }}
            >
              <span>Join Waitlist</span>
              <ArrowRight className="w-5 h-5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>

      </main>

      {/* Caption above the dashboard */}
      <div className="relative z-10 w-full text-center mt-4 md:-mt-[6vh] mb-3 md:mb-4 px-6">
        <span className="text-[10px] font-semibold tracking-[0.32em] uppercase text-black/55">
          Live Blip Market Dashboard
        </span>
        <p className="text-[12.5px] md:text-[13.5px] text-black/55 max-w-[600px] mx-auto mt-1.5 leading-[1.5]">
          Requests, merchant offers, liquidity and settlement status in one market.
        </p>
      </div>

      {/* ── Live Merchant Dashboard — section-level, centered on viewport ── */}
      <div className="relative z-10 w-full flex justify-center pb-[5vh]">
        <motion.div
          ref={dashboardRef}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.2, ease: EASE }}
          className="relative rounded-[28px] border border-white/[0.07] p-3 md:p-4 overflow-hidden text-white shadow-[0_30px_80px_-30px_rgba(204,120,92,0.25),0_12px_30px_-15px_rgba(0,0,0,0.18)]"
          style={{ width: "min(98vw, 1410px)", background: "#0a0a0a" }}
        >
          <div className="overflow-x-auto">
            <MerchantDashboardBody state={dashboardState} />
          </div>
        </motion.div>
      </div>

      {/* ── Merchant section — white band, black text ── */}
      <div className="relative z-10 w-full bg-white text-black">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1, ease: EASE }}
          className="relative max-w-[1180px] mx-auto px-4 md:px-10 py-20 md:py-28 flex flex-col items-center text-center w-full"
        >
          <div className="text-[11.5px] font-bold tracking-[0.36em] uppercase mb-5" style={{ color: "#cc785c" }}>
            Powered by Merchants
          </div>

          <h2
            className="font-display text-black mx-auto"
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 500,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              marginBottom: 14,
              maxWidth: "720px",
            }}
          >
            <span className="text-black">Merchants provide liquidity. </span>
            <span className="text-black">Earn on every order.</span>
          </h2>

          <p className="text-black/55 max-w-[480px] mx-auto leading-[1.55] text-[13px] md:text-[14.5px] mb-10 tracking-tight">
            Verified merchants bid live, set their own spread, and capture
            profit on every settlement — paid out instantly, on-chain.
          </p>

          {/* ── 4-card merchant set. Switch live from /card-preview via the variant picker. ── */}
          <LiveMerchantCards />

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10 md:mt-14 mb-5">
            <Link
              to="/merchant"
              className="group relative inline-flex items-center justify-center gap-2 w-full sm:w-auto sm:min-w-[220px] h-[50px] px-7 rounded-full bg-black text-white text-[14px] font-semibold tracking-tight transition-all duration-300 hover:-translate-y-[1px] active:scale-[0.985]"
            >
              <span>Become a merchant now</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="inline-flex items-center gap-3 text-[12px] text-black/50 tracking-tight">
            <span className="flex items-center gap-1.5">
              <motion.span
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#cc785c" }}
              />
              <span className="font-mono tabular-nums">${dashboardState.totalEarned.toFixed(0)}</span>
              <span>earned today</span>
            </span>
            <span className="text-black/25">·</span>
            <span><span className="font-mono tabular-nums">{dashboardState.activeTrades.length + dashboardState.pendingOrders.length}</span> live orders</span>
            <span className="text-black/25">·</span>
            <span>+2,400 merchants</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ────────────────────────────────────────────────────────────
   RealLiveDashboard — wraps the production replica with the
   hero's spotlight frame (92vw + chrome bar). Pulls the dash
   state from the same useMerchantDashboardState hook the real
   site uses on /merchant, so all panels animate live.
   ──────────────────────────────────────────────────────────── */
function RealLiveDashboard({
  state,
}: {
  state: ReturnType<typeof useMerchantDashboardState>;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  /* Scroll-linked emergence: dashboard sits beneath the hero, blurred and
     dim. As the user scrolls past the hero into the dashboard, it sharpens
     and brightens — "command center beneath the surface" feel. */
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start end", "end start"],
  });
  const blurPx = useTransform(scrollYProgress, [0, 0.35, 0.6], [0.825, 0.275, 0]);
  const filter = useTransform(blurPx, (v) => `blur(${v}px)`);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.55], [0.45, 0.75, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.6], [0.985, 1]);
  /* Playful scroll-linked sway: dashboard drifts gently as the user
     scrolls past it, then settles. Adds liveliness without being distracting. */
  const xDrift = useTransform(scrollYProgress, [0, 0.4, 0.7, 1], [0, -18, 12, 0]);
  const rotateZ = useTransform(scrollYProgress, [0, 0.4, 0.7, 1], [0, -0.7, 0.5, 0]);
  const yLift = useTransform(scrollYProgress, [0, 0.5, 1], [0, -28, -8]);

  return (
    <motion.div
      ref={wrapperRef}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.1, ease: EASE, delay: 0.5 }}
      className="relative rounded-2xl w-full"
    >
      {/* Dashboard surface — no surrounding chrome, sits flat */}
      <motion.div
        className="relative rounded-2xl overflow-hidden"
        style={{
          filter,
          opacity,
          scale,
          x: xDrift,
          y: yLift,
          rotate: rotateZ,
          background: "transparent",
          transformOrigin: "center top",
        }}
      >
        {/* Browser chrome — traffic-light dots + favicon URL pill */}
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-white/[0.06]" style={{ background: "#0f0f10" }}>
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f57" }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#febc2e" }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#28c840" }} />
          <div className="flex-1 flex justify-center min-w-0 px-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-[10.5px] font-mono text-white/65 border border-white/[0.06] bg-white/[0.04] w-full max-w-[440px]">
              {/* Favicon — orange "B" mark */}
              <span
                className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-[3px] flex-shrink-0 text-white font-bold"
                style={{
                  background: "linear-gradient(135deg, #ffa473, #cc785c)",
                  fontSize: "8px",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  letterSpacing: 0,
                }}
                aria-hidden
              >
                B
              </span>
              <span className="text-white/35">https://</span>
              <span className="text-white/85">blip.money</span>
              <span className="text-white/45">/markets</span>
              <span className="flex-1" />
              <Lock className="w-2.5 h-2.5 text-white/30" />
            </div>
          </div>
          <div className="w-12" />
        </div>

        <MerchantDashboardBody state={state} />
      </motion.div>

      {/* Top fade removed — peach bezel sits clean against the hero darkness */}
      {/* Bottom edge — clean, sits on white wash. Soft elevation shadow only. */}
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────
   SceneIllustration — flat editorial SVG scenes used in the
   merchant-perk card grid (Uber-style).
   ──────────────────────────────────────────────────────────── */
function SceneIllustration({ kind, accent, fg }: { kind: string; accent: string; fg: string }) {
  const skin = "#f4c79b";
  const ink = "#1a1a1a";
  if (kind === "city") {
    return (
      <svg viewBox="0 0 160 100" className="w-full h-auto max-h-[110px]">
        {/* skyline */}
        <rect x="10" y="50" width="20" height="40" fill={accent} opacity="0.85" />
        <rect x="32" y="35" width="22" height="55" fill={fg} opacity="0.9" />
        <rect x="56" y="45" width="18" height="45" fill={accent} opacity="0.7" />
        <rect x="76" y="28" width="24" height="62" fill={fg} opacity="0.85" />
        <rect x="102" y="48" width="20" height="42" fill={accent} opacity="0.85" />
        <rect x="124" y="38" width="22" height="52" fill={fg} opacity="0.9" />
        {/* windows */}
        {Array.from({ length: 6 }).map((_, i) => (
          <rect key={`w${i}`} x={36 + (i % 2) * 8} y={40 + Math.floor(i / 2) * 8} width="3" height="3" fill={ink} />
        ))}
        {/* moon */}
        <circle cx="135" cy="20" r="6" fill={accent} />
        {/* person */}
        <circle cx="80" cy="78" r="4" fill={skin} />
        <rect x="77" y="82" width="6" height="10" rx="1" fill={accent} />
      </svg>
    );
  }
  if (kind === "phone") {
    return (
      <svg viewBox="0 0 160 100" className="w-full h-auto max-h-[110px]">
        {/* phone */}
        <rect x="62" y="18" width="36" height="64" rx="6" fill={fg} />
        <rect x="66" y="24" width="28" height="46" rx="3" fill={ink} />
        {/* big balance number */}
        <text x="80" y="50" textAnchor="middle" fontSize="11" fontWeight="700" fill={accent} fontFamily="ui-monospace, monospace">
          $240
        </text>
        <text x="80" y="62" textAnchor="middle" fontSize="5" fill={fg} opacity="0.6" letterSpacing="1">FREE</text>
        {/* sparkles */}
        <circle cx="40" cy="30" r="2" fill={accent} />
        <circle cx="125" cy="35" r="2" fill={accent} />
        <circle cx="35" cy="70" r="1.5" fill={accent} opacity="0.7" />
        <circle cx="130" cy="65" r="1.5" fill={accent} opacity="0.7" />
        {/* hand */}
        <ellipse cx="80" cy="92" rx="22" ry="5" fill={skin} />
      </svg>
    );
  }
  if (kind === "friends") {
    return (
      <svg viewBox="0 0 160 100" className="w-full h-auto max-h-[110px]">
        {/* sky / hill */}
        <ellipse cx="80" cy="98" rx="100" ry="22" fill={accent} opacity="0.5" />
        {/* friend 1 */}
        <circle cx="55" cy="48" r="9" fill={skin} />
        <rect x="48" y="56" width="14" height="22" rx="2" fill={fg} opacity="0.85" />
        {/* friend 2 */}
        <circle cx="105" cy="48" r="9" fill={skin} />
        <rect x="98" y="56" width="14" height="22" rx="2" fill={ink} />
        {/* gift/coin between */}
        <circle cx="80" cy="64" r="9" fill={accent} stroke={fg} strokeWidth="1.5" />
        <text x="80" y="68" textAnchor="middle" fontSize="9" fontWeight="700" fill={fg} fontFamily="ui-monospace, monospace">$</text>
        {/* arrows */}
        <path d="M 70 64 L 64 64" stroke={fg} strokeWidth="1.2" strokeLinecap="round" />
        <path d="M 90 64 L 96 64" stroke={fg} strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === "boost") {
    return (
      <svg viewBox="0 0 160 100" className="w-full h-auto max-h-[110px]">
        {/* rising chart */}
        <polyline
          points="20,80 45,70 65,55 85,42 105,28 130,15"
          stroke={accent}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* dots */}
        {[
          [20, 80],
          [45, 70],
          [65, 55],
          [85, 42],
          [105, 28],
          [130, 15],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3" fill={fg} />
        ))}
        {/* +15% bubble */}
        <rect x="98" y="36" width="36" height="16" rx="8" fill={accent} />
        <text x="116" y="47" textAnchor="middle" fontSize="9" fontWeight="700" fill={fg} fontFamily="ui-monospace, monospace">
          +15%
        </text>
        {/* base axis */}
        <line x1="10" y1="90" x2="150" y2="90" stroke={fg} strokeOpacity="0.3" strokeWidth="1" />
      </svg>
    );
  }
  if (kind === "shop") {
    return (
      <svg viewBox="0 0 160 100" className="w-full h-auto max-h-[110px]">
        {/* shop awning */}
        <rect x="30" y="28" width="100" height="10" fill={accent} />
        {/* shop body */}
        <rect x="30" y="38" width="100" height="50" fill={fg} opacity="0.9" />
        {/* OPEN sign */}
        <rect x="68" y="50" width="24" height="10" rx="2" fill={accent} />
        <text x="80" y="58" textAnchor="middle" fontSize="6" fontWeight="700" fill={ink} letterSpacing="1.5">OPEN</text>
        {/* door */}
        <rect x="74" y="68" width="12" height="20" fill={ink} />
        <circle cx="83" cy="78" r="0.8" fill={accent} />
        {/* windows */}
        <rect x="40" y="68" width="22" height="14" fill={ink} opacity="0.85" />
        <rect x="98" y="68" width="22" height="14" fill={ink} opacity="0.85" />
        {/* moon (sleeping = night) */}
        <path d="M 140 15 a 6 6 0 1 0 4 10 a 5 5 0 0 1 -4 -10 z" fill={accent} />
        {/* zzz */}
        <text x="120" y="20" fontSize="8" fill={fg} opacity="0.5" fontWeight="700">z</text>
      </svg>
    );
  }
  return null;
}

/* ────────────────────────────────────────────────────────────
   MerchantIllustration — small Apple-style illustration scenes
   for the merchant "Get to know" 4-card grid.
   ──────────────────────────────────────────────────────────── */
/* ────────────────────────────────────────────────────────────
   MerchantCardCarousel — 6 big cards, horizontal scroll with
   right-arrow control. Snaps to card edges.
   ──────────────────────────────────────────────────────────── */
function MerchantCardCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateButtons = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };
  useEffect(() => {
    updateButtons();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateButtons, { passive: true });
    window.addEventListener("resize", updateButtons);
    return () => {
      el.removeEventListener("scroll", updateButtons);
      window.removeEventListener("resize", updateButtons);
    };
  }, []);

  const scrollBy = (delta: number) => {
    scrollerRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  const cards: {
    label: string;
    titlePre: string;
    titleAccent: string;
    titleAccentItalic?: boolean;
    titleAccentColor: string;
    titleTail?: string;
    cta: string;
    footnote?: string;
    kind: string;
    cardBg?: string;
    textOnLight?: boolean;
  }[] = [
    {
      label: "ZERO FEES THIS WEEK",
      titlePre: "Don't miss out on",
      titleAccent: "0% fees",
      titleAccentColor: "#3ddc84",
      titleTail: " this week.",
      cta: "Send money",
      footnote: "Auto-applied at checkout",
      kind: "shop",
    },
    {
      label: "FIRST TRANSFERS · FEE-FREE",
      titlePre: "Your first 3 transfers",
      titleAccent: "home — fee-free.",
      titleAccentItalic: true,
      titleAccentColor: "#ffd45a",
      cta: "Send home",
      footnote: "USD → INR live rate",
      kind: "chain",
    },
    {
      label: "BRING A FRIEND",
      titlePre: "Bring a friend.",
      titleAccent: "You both get $20.",
      titleAccentItalic: true,
      titleAccentColor: "#6ee0c5",
      cta: "Share invite",
      footnote: "Paid when they trade $100+",
      kind: "payout",
    },
    {
      label: "BOOST ON YOUR NEXT 5 TRADES",
      titlePre: "Stack a",
      titleAccent: "+15% boost",
      titleAccentColor: "#9ad1ff",
      titleTail: " on your next 5 trades.",
      cta: "Activate boost",
      footnote: "Avg user banked $48 last week",
      kind: "bid",
    },
  ];

  return (
    <div className="relative w-full mb-10">
      {/* Scroller */}
      <div
        ref={scrollerRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 px-4 md:px-8 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
      >
        <style>{`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
        `}</style>
        {cards.map((c, i) => (
          <motion.div
            key={c.kind}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8%" }}
            transition={{ duration: 0.55, delay: i * 0.05, ease: EASE }}
            whileHover={{ y: -4 }}
            className="snap-start flex-shrink-0 relative rounded-[22px] overflow-hidden text-left flex flex-col group w-[84vw] sm:w-[340px] md:w-[300px] lg:w-[280px]"
            style={{
              background: "#0a0a0a",
              border: "1px solid rgba(255,255,255,0.06)",
              transition: "transform 0.35s ease",
            }}
          >
            {/* TOP — animated illustration band */}
            <div className="relative w-full overflow-hidden" style={{ aspectRatio: "1/1" }}>
              <MerchantIllustration kind={c.kind} />
            </div>

            {/* BOTTOM — copy + CTA */}
            <div className="px-5 py-5 flex-1 flex flex-col">
              {/* Label */}
              <div className="flex items-center gap-1.5 mb-2.5">
                <span
                  className="w-1 h-1 rounded-full"
                  style={{ background: c.titleAccentColor }}
                />
                <span
                  className="text-[10px] font-bold tracking-[0.18em]"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  {c.label}
                </span>
              </div>

              {/* Headline */}
              <div
                className="font-display leading-[1.12] flex-1"
                style={{
                  fontSize: "22px",
                  fontWeight: 600,
                  letterSpacing: "-0.025em",
                  color: "#fff",
                }}
              >
                {c.titlePre}{" "}
                <span
                  style={{
                    color: c.titleAccentColor,
                    fontStyle: c.titleAccentItalic ? "italic" : "normal",
                    fontWeight: c.titleAccentItalic ? 500 : 600,
                    fontFamily: c.titleAccentItalic
                      ? "ui-serif, Georgia, serif"
                      : undefined,
                  }}
                >
                  {c.titleAccent}
                </span>
                {c.titleTail && <span>{c.titleTail}</span>}
              </div>

              {/* CTA + footnote */}
              <div className="mt-5 flex items-center justify-between gap-2 flex-wrap">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold tracking-tight hover:-translate-y-[1px] transition-transform whitespace-nowrap flex-shrink-0"
                  style={{
                    background: "#fff",
                    color: "#0a0a0a",
                  }}
                >
                  {c.cta}
                  <ArrowRight className="w-3 h-3" />
                </Link>
                {c.footnote && (
                  <span
                    className="text-[10px] tracking-tight inline-flex items-center gap-1 leading-tight"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    <span
                      className="w-1 h-1 rounded-full shrink-0"
                      style={{ background: "rgba(255,255,255,0.3)" }}
                    />
                    <span>{c.footnote}</span>
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Right arrow */}
      <button
        onClick={() => scrollBy(340)}
        disabled={!canScrollRight}
        aria-label="Scroll right"
        className="absolute top-1/2 -translate-y-1/2 right-2 md:right-4 z-10 w-11 h-11 rounded-full flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        style={{
          background: "#fff",
          color: "#000",
          boxShadow: "0 10px 28px -8px rgba(0,0,0,0.6)",
        }}
      >
        <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
      </button>

      {/* Left arrow */}
      <button
        onClick={() => scrollBy(-340)}
        disabled={!canScrollLeft}
        aria-label="Scroll left"
        className="absolute top-1/2 -translate-y-1/2 left-2 md:left-4 z-10 w-11 h-11 rounded-full flex items-center justify-center transition-all disabled:opacity-0 disabled:cursor-not-allowed"
        style={{
          background: "#fff",
          color: "#000",
          boxShadow: "0 10px 28px -8px rgba(0,0,0,0.6)",
        }}
      >
        <ArrowRight className="w-4 h-4 rotate-180" strokeWidth={2.5} />
      </button>
    </div>
  );
}


/* ────────────────────────────────────────────────────────────
   MerchantIllustration — vibrant Uber-style scenes with
   editorial scenes with partial characters, walking animations,
   4 scenes — 2 with characters, 2 with story/place. Base white/black,
   one accent color per card, rich layered animation.
   ──────────────────────────────────────────────────────────── */
function MerchantIllustration({ kind }: { kind: string }) {
  const SKIN = "#f4c79b";
  const SKIN2 = "#d4a878";
  const HAIR = "#1a1a1a";
  const INK = "#0a0a0a";
  const PAPER = "#fff";
  const PANTS = "#2a2a2a";
  const SHOE = "#0a0a0a";

  /* 01 — Character at desk in front of laptop, "0% FEES" on screen */
  if (kind === "shop") {
    const ACCENT = "#3ddc84"; // vibrant green
    return (
      <svg viewBox="0 0 300 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <rect width="300" height="300" fill={PAPER} />
        {/* desk */}
        <rect x="20" y="220" width="260" height="8" fill={INK} />
        <rect x="32" y="228" width="6" height="40" fill={INK} opacity="0.85" />
        <rect x="262" y="228" width="6" height="40" fill={INK} opacity="0.85" />
        <ellipse cx="150" cy="278" rx="120" ry="5" fill={INK} opacity="0.08" />
        {/* coffee mug on desk */}
        <g>
          <rect x="46" y="200" width="20" height="18" rx="2" fill={INK} />
          <ellipse cx="56" cy="200" rx="10" ry="3" fill="#5a3a1a" />
          <path d="M 66 204 q 6 0 6 6 q 0 6 -6 6" stroke={INK} strokeWidth="2" fill="none" />
          {/* steam */}
          <motion.path d="M 50 196 q -2 -6 2 -10 q -2 -6 2 -10" stroke={INK} strokeOpacity="0.35" strokeWidth="1.4" fill="none" strokeLinecap="round"
            animate={{ y: [0, -3, 0], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }} />
          <motion.path d="M 58 192 q -2 -6 2 -10" stroke={INK} strokeOpacity="0.35" strokeWidth="1.4" fill="none" strokeLinecap="round"
            animate={{ y: [0, -3, 0], opacity: [0.4, 0.15, 0.4] }}
            transition={{ duration: 2.6, delay: 0.4, repeat: Infinity, ease: "easeInOut" }} />
        </g>
        {/* Laptop */}
        <g>
          {/* base */}
          <path d="M 90 218 L 220 218 L 230 226 L 80 226 Z" fill={INK} />
          {/* screen body */}
          <rect x="98" y="120" width="114" height="100" rx="4" fill={INK} />
          <rect x="103" y="125" width="104" height="84" rx="2" fill={PAPER} />
          {/* screen content */}
          <text x="155" y="142" textAnchor="middle" fontSize="7" fontWeight="700" fill={INK} letterSpacing="1.5">BLIP MARKET</text>
          <line x1="113" y1="148" x2="197" y2="148" stroke={INK} strokeOpacity="0.15" strokeWidth="1" />
          <text x="155" y="166" textAnchor="middle" fontSize="6" fontWeight="700" fill={INK} opacity="0.55" letterSpacing="1.2">FEES THIS WEEK</text>
          <motion.text x="155" y="190" textAnchor="middle" fontSize="26" fontFamily="ui-serif, Georgia" fontWeight="800" fill={ACCENT}
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>0%</motion.text>
          <rect x="133" y="196" width="44" height="10" rx="5" fill={INK} />
          <text x="155" y="203" textAnchor="middle" fontSize="5" fontWeight="800" fill={PAPER} letterSpacing="1">CLAIMED</text>
        </g>
        {/* Character behind laptop — head + shoulders visible above the screen */}
        <g>
          <circle cx="150" cy="80" r="26" fill={SKIN} />
          {/* hair — wavy */}
          <path d="M 122 78 Q 120 56 138 50 Q 146 42 158 48 Q 174 50 178 70 Q 180 80 174 80 L 168 76 Q 162 64 154 66 Q 144 66 138 74 Q 132 78 122 78 Z" fill="#3a2618" />
          <path d="M 122 78 Q 120 88 126 92" stroke="#3a2618" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="124" cy="84" r="3" fill={SKIN} />
          <circle cx="141" cy="82" r="2" fill={INK} />
          <circle cx="159" cy="82" r="2" fill={INK} />
          <ellipse cx="138" cy="90" rx="3" ry="1.6" fill="#ff9a8c" opacity="0.5" />
          <ellipse cx="162" cy="90" rx="3" ry="1.6" fill="#ff9a8c" opacity="0.5" />
          <path d="M 142 92 Q 150 98 158 92" stroke={INK} strokeWidth="1.4" fill="none" strokeLinecap="round" />
          <rect x="143" y="104" width="14" height="8" fill={SKIN} />
          {/* T-shirt visible above laptop (cropped by it) */}
          <path d="M 116 112 L 184 112 L 192 122 L 108 122 Z" fill="#4a7fb8" />
        </g>
        {/* Sparkles around the screen */}
        {[{x:78,y:140,d:0},{x:230,y:160,d:0.5},{x:236,y:104,d:1}].map((s,i)=>(
          <motion.circle key={i} cx={s.x} cy={s.y} r="2.5" fill={ACCENT}
            animate={{ scale: [0.6, 1.4, 0.6], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.8, delay: s.d, repeat: Infinity, ease: "easeInOut" }} />
        ))}
        {/* "FREE" tag floating */}
        <motion.g animate={{ y: [0, -6, 0], rotate: [-3, 3, -3] }} transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}>
          <path d="M 220 50 L 244 50 L 256 62 L 256 96 L 220 96 Z" fill={ACCENT} />
          <circle cx="235" cy="62" r="3" fill={PAPER} />
          <text x="238" y="82" textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily="ui-serif, Georgia">FREE</text>
        </motion.g>
      </svg>
    );
  }

  /* 02 — Cozy home scene receiving cash through window (no character) */
  if (kind === "chain") {
    const ACCENT = "#6ee0c5";
    return (
      <svg viewBox="0 0 300 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <rect width="300" height="300" fill={PAPER} />
        <rect y="245" width="300" height="55" fill={INK} opacity="0.06" />
        {/* tree */}
        <rect x="244" y="180" width="6" height="68" fill="#2a1810" />
        <g>
          <circle cx="247" cy="174" r="22" fill={INK} />
          <circle cx="235" cy="180" r="14" fill={INK} />
          <circle cx="260" cy="178" r="14" fill={INK} />
        </g>
        {/* fence */}
        <g opacity="0.15" stroke={INK} strokeWidth="1.5" fill="none">
          <line x1="20" y1="244" x2="20" y2="220" />
          <line x1="34" y1="244" x2="34" y2="220" />
          <line x1="48" y1="244" x2="48" y2="220" />
          <line x1="62" y1="244" x2="62" y2="220" />
          <line x1="20" y1="226" x2="62" y2="226" />
        </g>
        {/* house */}
        <g>
          <rect x="92" y="138" width="146" height="110" fill={INK} />
          <path d="M 78 138 L 165 78 L 252 138 Z" fill={INK} />
          <rect x="206" y="84" width="18" height="34" fill={INK} />
          {[
            { x: 215, y: 76, r: 5, d: 0 },
            { x: 220, y: 60, r: 4, d: 0.5 },
            { x: 213, y: 46, r: 3.5, d: 1.0 },
          ].map((s, i) => (
            <motion.circle key={i} cx={s.x} cy={s.y} r={s.r} fill={INK} opacity="0.25"
              animate={{ y: [0, -10, 0], opacity: [0.25, 0.05, 0.25] }}
              transition={{ duration: 4, delay: s.d, repeat: Infinity, ease: "easeInOut" }} />
          ))}
          <rect x="148" y="190" width="34" height="58" fill={ACCENT} />
          <circle cx="174" cy="220" r="1.5" fill={INK} />
          <rect x="106" y="166" width="34" height="34" fill={PAPER} stroke={INK} strokeWidth="2" />
          <line x1="123" y1="166" x2="123" y2="200" stroke={INK} strokeWidth="1.2" />
          <line x1="106" y1="183" x2="140" y2="183" stroke={INK} strokeWidth="1.2" />
          <rect x="108" y="168" width="30" height="30" fill={ACCENT} opacity="0.25" />
          <rect x="196" y="166" width="34" height="34" fill={PAPER} stroke={INK} strokeWidth="2" />
          <line x1="213" y1="166" x2="213" y2="200" stroke={INK} strokeWidth="1.2" />
          <line x1="196" y1="183" x2="230" y2="183" stroke={INK} strokeWidth="1.2" />
          <rect x="198" y="168" width="30" height="30" fill={ACCENT} opacity="0.25" />
          <rect x="210" y="194" width="14" height="6" fill={ACCENT} />
          <circle cx="217" cy="190" r="3.5" fill={INK} />
        </g>
        {/* mailbox */}
        <g>
          <rect x="46" y="218" width="3" height="30" fill={INK} />
          <rect x="38" y="206" width="20" height="14" rx="2" fill={INK} />
          <rect x="56" y="208" width="3" height="10" fill={ACCENT} />
        </g>
        {/* Flying cash IN to window */}
        <motion.g
          animate={{ x: [-180, -8], y: [-30, 0], opacity: [0, 1, 1, 0.8] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}>
          <rect x="240" y="170" width="32" height="20" rx="3" fill={ACCENT} stroke={INK} strokeWidth="1.5" />
          <circle cx="256" cy="180" r="5" fill={INK} />
          <text x="256" y="183" textAnchor="middle" fontSize="6" fontWeight="800" fill={ACCENT}>$</text>
        </motion.g>
        <motion.g
          animate={{ x: [-200, -20], y: [-10, 0], opacity: [0, 1, 1, 0.6] }}
          transition={{ duration: 3.8, delay: 1, repeat: Infinity, ease: "easeInOut" }}>
          <rect x="252" y="184" width="28" height="16" rx="2" fill={ACCENT} opacity="0.85" stroke={INK} strokeWidth="1.2" />
        </motion.g>
        {/* path dots */}
        <g opacity="0.15">
          <circle cx="170" cy="262" r="2" fill={INK} />
          <circle cx="178" cy="258" r="2" fill={INK} />
          <circle cx="172" cy="254" r="2" fill={INK} />
        </g>
        {/* sun */}
        <circle cx="44" cy="44" r="14" fill={ACCENT} />
        <motion.circle cx="44" cy="44" r="14" fill="none" stroke={ACCENT} strokeOpacity="0.4"
          animate={{ r: [14, 22, 14], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }} />
      </svg>
    );
  }

  /* 03 — Two friends walking together */
  if (kind === "payout") {
    const ACCENT = "#ffd45a";
    return (
      <svg viewBox="0 0 300 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <rect width="300" height="300" fill={PAPER} />
        <line x1="0" y1="270" x2="300" y2="270" stroke={INK} strokeOpacity="0.08" />
        {/* park bench */}
        <g opacity="0.18">
          <rect x="14" y="218" width="50" height="3" fill={INK} />
          <rect x="14" y="222" width="50" height="3" fill={INK} />
          <rect x="16" y="225" width="3" height="20" fill={INK} />
          <rect x="59" y="225" width="3" height="20" fill={INK} />
        </g>
        {/* lamppost */}
        <g opacity="0.22">
          <rect x="252" y="180" width="2.5" height="70" fill={INK} />
          <circle cx="253" cy="174" r="6" fill={INK} />
          <motion.circle cx="253" cy="174" r="10" fill={ACCENT} opacity="0.55"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }} />
        </g>
        <path d="M 30 268 Q 150 230 270 268" stroke={INK} strokeOpacity="0.18" strokeWidth="1.5" strokeDasharray="3 5" fill="none" />
        {[
          { x: 96, hair: "#3a2618", skin: SKIN, shirt: "#e85d4a", shorts: "#2a3a52", d: 0, hairStyle: "wave" },
          { x: 204, hair: "#5a3a1a", skin: SKIN2, shirt: "#4a7fb8", shorts: "#3a2a1a", d: 0.4, hairStyle: "bun" },
        ].map((p, i) => (
          <g key={i} transform={`translate(${p.x}, 0)`}>
            {/* head */}
            <circle cx="0" cy="78" r="22" fill={p.skin} />
            {/* hair styles */}
            {p.hairStyle === "wave" ? (
              <>
                <path d="M -22 76 Q -24 56 -8 50 Q 0 44 10 50 Q 22 52 22 70 Q 22 78 18 78 L 14 74 Q 8 64 0 66 Q -10 66 -16 72 Q -20 76 -22 76 Z" fill={p.hair} />
                <path d="M -22 76 Q -22 86 -18 90" stroke={p.hair} strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </>
            ) : (
              <>
                <ellipse cx="0" cy="64" rx="22" ry="14" fill={p.hair} />
                <circle cx="0" cy="58" r="7" fill={p.hair} />
              </>
            )}
            {/* ears */}
            <circle cx="-22" cy="86" r="2.5" fill={p.skin} />
            <circle cx="22" cy="86" r="2.5" fill={p.skin} />
            {/* eyes */}
            <circle cx="-7" cy="80" r="1.8" fill={INK} />
            <circle cx="7" cy="80" r="1.8" fill={INK} />
            {/* blush */}
            <ellipse cx="-12" cy="88" rx="2.5" ry="1.3" fill="#ff9a8c" opacity="0.5" />
            <ellipse cx="12" cy="88" rx="2.5" ry="1.3" fill="#ff9a8c" opacity="0.5" />
            {/* smile */}
            <path d="M -5 89 Q 0 93 5 89" stroke={INK} strokeWidth="1.2" fill="none" strokeLinecap="round" />
            {/* neck */}
            <rect x="-5" y="98" width="10" height="6" fill={p.skin} />
            {/* t-shirt */}
            <path d="M -22 110 Q -22 104 -16 104 L 16 104 Q 22 104 22 110 L 28 148 L 22 152 L 22 184 L -22 184 L -22 152 L -28 148 Z" fill={p.shirt} />
            {/* collar */}
            <path d="M -7 104 Q 0 110 7 104" stroke="rgba(0,0,0,0.25)" strokeWidth="1" fill="none" />
            {/* shorts */}
            <path d="M -22 184 L 22 184 L 24 216 L 4 216 L 2 200 L -2 200 L -4 216 L -24 216 Z" fill={p.shorts} />
            {/* arms — shoulder sleeve (shirt) + forearm (skin) */}
            <motion.g
              animate={{ rotate: [12, -12, 12] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut", delay: p.d }}
              style={{ transformOrigin: "-27px 120px" }}>
              <rect x="-32" y="116" width="10" height="22" rx="5" fill={p.shirt} />
              <rect x="-32" y="136" width="10" height="22" rx="5" fill={p.skin} />
              <circle cx="-27" cy="160" r="5" fill={p.skin} />
            </motion.g>
            <motion.g
              animate={{ rotate: [-12, 12, -12] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut", delay: p.d }}
              style={{ transformOrigin: "27px 120px" }}>
              <rect x="22" y="116" width="10" height="22" rx="5" fill={p.shirt} />
              <rect x="22" y="136" width="10" height="22" rx="5" fill={p.skin} />
              <circle cx="27" cy="160" r="5" fill={p.skin} />
            </motion.g>
            {/* legs — skin (shorts) + shoes, animated walk */}
            <motion.g animate={{ rotate: [-15, 15, -15] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut", delay: p.d }}
              style={{ transformOrigin: "-8px 216px" }}>
              <rect x="-14" y="216" width="12" height="48" rx="3" fill={p.skin} />
              <ellipse cx="-8" cy="268" rx="11" ry="5" fill={SHOE} />
            </motion.g>
            <motion.g animate={{ rotate: [15, -15, 15] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut", delay: p.d }}
              style={{ transformOrigin: "8px 216px" }}>
              <rect x="2" y="216" width="12" height="48" rx="3" fill={p.skin} />
              <ellipse cx="8" cy="268" rx="11" ry="5" fill={SHOE} />
            </motion.g>
          </g>
        ))}
        {/* chat bubble */}
        <motion.g animate={{ y: [0, -2, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}>
          <rect x="42" y="20" width="48" height="22" rx="11" fill={INK} />
          <path d="M 76 42 L 80 50 L 84 42 Z" fill={INK} />
          <text x="66" y="35" textAnchor="middle" fontSize="9" fontWeight="700" fill={PAPER}>+$20</text>
        </motion.g>
        {/* coin */}
        <motion.g animate={{ y: [0, -8, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}>
          <circle cx="150" cy="116" r="18" fill={ACCENT} stroke={INK} strokeWidth="2" />
          <text x="150" y="124" textAnchor="middle" fontSize="18" fontWeight="800" fill={INK} fontFamily="ui-serif, Georgia">$</text>
        </motion.g>
      </svg>
    );
  }

  /* 04 — Rocket launch with +15% trail (no character) */
  if (kind === "bid") {
    const ACCENT = "#9ad1ff";
    return (
      <svg viewBox="0 0 300 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <rect width="300" height="300" fill={INK} />
        {[
          {x:30,y:40},{x:70,y:24},{x:120,y:50},{x:180,y:30},{x:240,y:50},{x:280,y:22},
          {x:50,y:130},{x:260,y:140},{x:20,y:200},{x:280,y:220},
        ].map((s,i)=>(
          <motion.circle key={i} cx={s.x} cy={s.y} r="1.4" fill={PAPER}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.2, delay: i * 0.2, repeat: Infinity, ease: "easeInOut" }} />
        ))}
        <ellipse cx="150" cy="298" rx="200" ry="40" fill={PAPER} opacity="0.06" />
        <line x1="0" y1="270" x2="300" y2="270" stroke={PAPER} strokeOpacity="0.1" />
        {/* growth chart */}
        <g>
          <polyline points="34,250 60,232 86,210 112,188 138,168" stroke={ACCENT} strokeWidth="2" fill="none" strokeLinecap="round" strokeOpacity="0.7" />
          {[[34,250],[60,232],[86,210],[112,188],[138,168]].map(([x,y],i)=>(
            <circle key={i} cx={x} cy={y} r="2" fill={ACCENT} opacity="0.85" />
          ))}
        </g>
        {/* Rocket */}
        <motion.g
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
          <path d="M 150 60 L 168 110 L 168 200 L 132 200 L 132 110 Z" fill={PAPER} />
          <circle cx="150" cy="130" r="10" fill={ACCENT} />
          <circle cx="150" cy="130" r="10" fill="none" stroke={INK} strokeWidth="1.5" />
          <circle cx="147" cy="127" r="3" fill={PAPER} opacity="0.55" />
          <path d="M 132 180 L 116 220 L 132 210 Z" fill={ACCENT} />
          <path d="M 168 180 L 184 220 L 168 210 Z" fill={ACCENT} />
          <rect x="143" y="160" width="14" height="3" fill={INK} />
          <rect x="143" y="170" width="14" height="3" fill={INK} />
        </motion.g>
        {/* Flame */}
        <motion.g
          animate={{ scaleY: [1, 1.2, 0.9, 1.15, 1] }}
          transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "150px 200px" }}>
          <path d="M 138 200 L 150 250 L 162 200 Z" fill={ACCENT} />
          <path d="M 144 200 L 150 234 L 156 200 Z" fill={PAPER} />
        </motion.g>
        {/* Smoke */}
        {[
          { x: 130, y: 240, r: 8, d: 0 },
          { x: 170, y: 244, r: 7, d: 0.3 },
          { x: 110, y: 256, r: 6, d: 0.6 },
          { x: 190, y: 258, r: 6, d: 0.9 },
        ].map((c, i) => (
          <motion.circle key={i} cx={c.x} cy={c.y} r={c.r} fill={PAPER} opacity="0.18"
            animate={{ y: [0, 14, 0], opacity: [0.18, 0.05, 0.18], scale: [1, 1.4, 1] }}
            transition={{ duration: 2.4, delay: c.d, repeat: Infinity, ease: "easeInOut" }} />
        ))}
        {/* +15% pill */}
        <motion.g
          animate={{ opacity: [1, 0.55, 1], scale: [1, 1.06, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "236px 100px" }}>
          <rect x="208" y="86" width="56" height="22" rx="11" fill={ACCENT} />
          <text x="236" y="100" textAnchor="middle" fontSize="12" fontWeight="800" fill={INK} fontFamily="ui-serif, Georgia">+15%</text>
        </motion.g>
        <path d="M 150 60 Q 150 30 240 100" stroke={ACCENT} strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="3 4" fill="none" />
      </svg>
    );
  }

  return null;
}

function LiveMerchantCards() {
  const { variant } = useMerchantCardsVariant();
  if (variant === "apple") return <DashboardAppleCards />;
  if (variant === "clear") return <DashboardClearCards />;
  if (variant === "kinetic") return <DashboardKineticCards />;
  if (variant === "live-rows") return <DashboardMerchantCards />;
  if (variant === "editorial") return <EditorialMerchantCards />;
  if (variant === "painted") return <MerchantCarouselPainted />;
  if (variant === "card-hero") return <CardHeroGrid />;
  if (variant === "app-style") return <MerchantCardsAppStyle />;
  if (variant === "local-rows") return <LocalDashboardMerchantCards />;
  return <DashboardMixedCards />;
}

export default memo(CinematicHero);
