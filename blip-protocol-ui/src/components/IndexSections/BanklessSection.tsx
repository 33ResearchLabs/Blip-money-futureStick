import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { SwipeHint } from "./SwipeHint";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ============================================
   BANKLESS / PEOPLE'S BANK SECTION
   Frame: "Banking, without the bank." (paradox)
   Body: 3 features that prove it — merchants bid, best rates, on-chain proof.
   Climax: "A bank, built by people." (resolution)
   ============================================ */

const BanklessSection = () => {
  const ref = useRef<HTMLElement>(null);
  useInView(ref, { once: true, margin: "-15%" });

  return (
    <section
      ref={ref}
      className="relative py-28 md:py-36 overflow-hidden bg-black text-white"
    >
      {/* Soft ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 40% at 50% 30%, rgba(255,255,255,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-6">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-center"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
            Global liquidity network
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
          className="text-center heading-h2 leading-[1.02] mt-8"
          style={{ marginBottom: 0 }}
        >
          <span className="block">Banking,</span>
          <span className="block text-white/30">without the bank.</span>
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
          className="text-center text-base md:text-lg text-white/55 max-w-xl mx-auto mt-10 leading-relaxed"
        >
          A global liquidity marketplace where transactions are fulfilled by
          participants instead of traditional banking rails.
        </motion.p>

        {/* ── Three Feature Cards ──
            Mobile: horizontal snap-scroll (cards peek at edges).
            md+ : 3-column grid. */}
        <div className="relative mt-20 sm:mt-24">
          <div
            className="flex md:grid md:grid-cols-3 gap-4 md:gap-5 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="snap-start shrink-0 w-[85%] md:w-auto flex">
              <BiddingCard />
            </div>
            <div className="snap-start shrink-0 w-[85%] md:w-auto flex">
              <RatesCard />
            </div>
            <div className="snap-start shrink-0 w-[85%] md:w-auto flex">
              <ProofCard />
            </div>
          </div>
          <SwipeHint />
        </div>
      </div>

      {/* Killer line — resolution of the opening paradox */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, delay: 0.2, ease: EASE }}
        className="relative z-10 mt-32 sm:mt-40 mx-auto max-w-5xl px-5 md:px-6 text-center font-display text-2xl sm:text-4xl md:text-5xl font-semibold tracking-[-0.02em] leading-[1.15] text-white"
      >
        <span className="block">Settlement becomes a marketplace</span>
        <span className="block text-white/30">instead of a monopoly.</span>
      </motion.p>
    </section>
  );
};

/* ─── Card shell — white card with illustration band ───────────── */
function CardShell({
  index,
  tag,
  title,
  caption,
  illustration,
}: {
  index: string;
  tag: string;
  title: string;
  caption: string;
  illustration: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.7, ease: EASE }}
      whileHover={{ y: -4 }}
      className="relative w-full rounded-[24px] overflow-hidden flex flex-col"
      style={{
        background: "#fff",
        boxShadow:
          "0 24px 60px -24px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.85) inset",
        transition: "transform 0.35s ease",
      }}
    >
      {/* Top: illustration band */}
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: "16/10", background: "#fff4ea" }}
      >
        {illustration}
      </div>

      {/* Body */}
      <div className="p-6 md:p-7 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <span className="font-mono text-[10px] text-black/35">{index}</span>
          <span className="w-1 h-1 rounded-full bg-black/20" />
          <span className="text-[9px] font-bold uppercase tracking-[0.24em] text-black/55">
            {tag}
          </span>
        </div>
        <h3 className="font-display text-[20px] md:text-[22px] font-semibold tracking-tight leading-tight text-black mb-2">
          {title}
        </h3>
        <p className="text-[12.5px] text-black/55 leading-snug">
          {caption}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Bankless illustrations ───────────────────────────────────── */
function NoBankIllustration({ kind }: { kind: "price" | "hours" | "keys" }) {
  const INK = "#0a0a0a";
  const ACCENT = "#cc785c";
  const SKIN = "#f4c79b";
  const HAIR = "#1a1410";

  if (kind === "price") {
    // Bank building struck through, replaced by merchant character
    return (
      <svg viewBox="0 0 320 200" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        {/* faded bank silhouette */}
        <g opacity="0.18">
          <rect x="20" y="92" width="100" height="80" fill={INK} />
          <path d="M 14 92 L 70 56 L 126 92 Z" fill={INK} />
          <rect x="34" y="110" width="10" height="40" fill="#fff" />
          <rect x="54" y="110" width="10" height="40" fill="#fff" />
          <rect x="74" y="110" width="10" height="40" fill="#fff" />
          <rect x="94" y="110" width="10" height="40" fill="#fff" />
        </g>
        <motion.line
          x1="14" y1="58" x2="128" y2="170"
          stroke={ACCENT} strokeWidth="5" strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* arrow */}
        <path d="M 150 100 L 178 100 M 170 92 L 178 100 L 170 108" stroke={INK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* merchant character */}
        <g transform="translate(208, 38)">
          <circle cx="40" cy="34" r="20" fill={SKIN} />
          <path d="M 20 32 Q 18 14 32 10 Q 40 4 48 8 Q 60 10 62 28 Q 64 36 58 36 L 54 32 Q 48 24 42 26 Q 32 26 26 32 Q 22 34 20 32 Z" fill={HAIR} />
          <circle cx="34" cy="36" r="1.5" fill={INK} />
          <circle cx="46" cy="36" r="1.5" fill={INK} />
          <ellipse cx="30" cy="43" rx="2.5" ry="1.3" fill="#ff9a8c" opacity="0.55" />
          <ellipse cx="50" cy="43" rx="2.5" ry="1.3" fill="#ff9a8c" opacity="0.55" />
          <path d="M 34 44 Q 40 50 46 44" stroke={INK} strokeWidth="1.3" fill="none" strokeLinecap="round" />
          {/* body holding coin */}
          <rect x="34" y="54" width="12" height="6" fill={SKIN} />
          <path d="M 16 62 Q 16 58 20 58 L 60 58 Q 64 58 64 62 L 70 110 L 10 110 Z" fill={INK} />
          {/* coin */}
          <motion.g
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <circle cx="40" cy="78" r="14" fill={ACCENT} stroke={INK} strokeWidth="2" />
            <text x="40" y="84" textAnchor="middle" fontSize="14" fontWeight="800" fill="#fff" fontFamily="ui-serif, Georgia">$</text>
          </motion.g>
        </g>
      </svg>
    );
  }

  if (kind === "hours") {
    // 24/7 clock with no closed sign
    return (
      <svg viewBox="0 0 320 200" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        {/* big clock face */}
        <circle cx="160" cy="104" r="68" fill="#fff" stroke={INK} strokeWidth="3" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * 30 - 90) * (Math.PI / 180);
          const x1 = 160 + Math.cos(a) * 58;
          const y1 = 104 + Math.sin(a) * 58;
          const x2 = 160 + Math.cos(a) * 64;
          const y2 = 104 + Math.sin(a) * 64;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={INK} strokeWidth={i % 3 === 0 ? 2 : 1} />;
        })}
        {/* 24/7 label */}
        <text x="160" y="98" textAnchor="middle" fontSize="22" fontWeight="800" fill={ACCENT} fontFamily="ui-serif, Georgia">24/7</text>
        <text x="160" y="118" textAnchor="middle" fontSize="9" fontWeight="700" fill={INK} opacity="0.55" letterSpacing="2">OPEN</text>
        {/* hour hand */}
        <motion.line
          x1="160" y1="104" x2="160" y2="64"
          stroke={ACCENT} strokeWidth="3" strokeLinecap="round"
          animate={{ rotate: 360 }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "160px 104px" }}
        />
        <circle cx="160" cy="104" r="4" fill={INK} />
        {/* sun + moon at sides */}
        <motion.g
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <circle cx="48" cy="60" r="14" fill={ACCENT} />
          {[0, 45, 90, 135].map((a, i) => (
            <line key={i} x1="48" y1="60" x2="48" y2="42" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" transform={`rotate(${a} 48 60)`} opacity="0.7" />
          ))}
        </motion.g>
        <motion.g
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        >
          <path d="M 272 150 a 12 12 0 1 0 5 11 a 9 9 0 0 1 -5 -11 z" fill={INK} />
          <circle cx="262" cy="142" r="1.5" fill="#fff" />
          <circle cx="278" cy="158" r="1.2" fill="#fff" />
        </motion.g>
      </svg>
    );
  }

  // kind === "keys"
  return (
    <svg viewBox="0 0 320 200" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      {/* big key with floating coin */}
      <g transform="translate(50, 60)">
        {/* key bow (head) */}
        <circle cx="40" cy="40" r="34" fill="none" stroke={INK} strokeWidth="7" />
        <circle cx="40" cy="40" r="14" fill={ACCENT} />
        {/* shaft */}
        <rect x="74" y="36" width="120" height="8" fill={INK} />
        {/* teeth */}
        <rect x="170" y="44" width="8" height="14" fill={INK} />
        <rect x="184" y="44" width="8" height="10" fill={INK} />
      </g>
      {/* floating coin (your money) */}
      <motion.g
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <circle cx="270" cy="60" r="18" fill={ACCENT} stroke={INK} strokeWidth="2" />
        <text x="270" y="67" textAnchor="middle" fontSize="18" fontWeight="800" fill="#fff" fontFamily="ui-serif, Georgia">$</text>
      </motion.g>
      {/* connecting dotted line: key → coin */}
      <path d="M 250 110 Q 260 90 264 78" stroke={INK} strokeOpacity="0.25" strokeWidth="1.6" strokeDasharray="3 4" fill="none" />
      {/* small text below */}
      <text x="160" y="184" textAnchor="middle" fontSize="9" fontWeight="700" fill={INK} opacity="0.5" letterSpacing="2.5">SELF-CUSTODY</text>
    </svg>
  );
}

/* ─── Card 1: Merchants bid for you ────────────────────────────── */
function BiddingCard() {
  return (
    <CardShell
      index="01"
      tag="No bank fees"
      title="People price. Not banks."
      caption="Merchants bid live. Best rate wins."
      illustration={<NoBankIllustration kind="price" />}
    />
  );
}

/* ─── Card 2: 24/7 open ────────────────────── */
function RatesCard() {
  return (
    <CardShell
      index="02"
      tag="24/7 open"
      title="Settles any hour."
      caption="No bank windows. No SWIFT cut-offs."
      illustration={<NoBankIllustration kind="hours" />}
    />
  );
}

/* ─── Card 3: Self-custody ─────────────────────────────────── */
function ProofCard() {
  return (
    <CardShell
      index="03"
      tag="Self-custody"
      title="Your keys. Your money."
      caption="No bank holds your funds. You do."
      illustration={<NoBankIllustration kind="keys" />}
    />
  );
}

export default BanklessSection;
