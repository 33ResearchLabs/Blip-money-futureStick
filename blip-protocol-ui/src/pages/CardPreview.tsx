import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * CardPreview — standalone showcase of the 5 merchant benefit cards.
 * Visible at /card-preview. Not wired into the merchant hero per user request.
 */
export default function CardPreview() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-[1180px] mx-auto px-4 md:px-10 py-20 md:py-28">
        <div className="flex items-center gap-3 mb-3 justify-center">
          <span className="w-5 h-px bg-white/25" />
          <span
            className="text-[10px] font-semibold tracking-[0.3em] uppercase"
            style={{ color: "#ff7a3d" }}
          >
            Card preview
          </span>
          <span className="w-5 h-px bg-white/25" />
        </div>
        <h1
          className="font-display text-center text-white mb-12"
          style={{
            fontSize: "clamp(1.8rem, 3.6vw, 2.6rem)",
            fontWeight: 500,
            letterSpacing: "-0.04em",
          }}
        >
          5 cards — claude_web_theme.md
        </h1>

        <MerchantBenefitsGrid />

        <h2
          className="font-display text-center text-white mt-24 mb-10"
          style={{
            fontSize: "clamp(1.4rem, 2.6vw, 1.9rem)",
            fontWeight: 500,
            letterSpacing: "-0.035em",
          }}
        >
          10 more — image only
        </h2>
        <ImageTileGrid />
      </div>
    </main>
  );
}

const TILES = [
  { kind: "gift", accent: "#ff5d8f", label: "Gift" },
  { kind: "trophy", accent: "#ffd45a", label: "Winner" },
  { kind: "plane", accent: "#9ad1ff", label: "Send" },
  { kind: "key", accent: "#cc785c", label: "Unlock" },
  { kind: "stack", accent: "#6ee0c5", label: "Stack" },
  { kind: "wave", accent: "#ff8c6b", label: "Hello" },
  { kind: "sunrise", accent: "#ffb38a", label: "New day" },
  { kind: "heart", accent: "#ff5d8f", label: "Loved" },
  { kind: "bell", accent: "#9ad1ff", label: "Alert" },
  { kind: "rocket", accent: "#ffd45a", label: "Launch" },
] as const;

function ImageTileGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {TILES.map((t, i) => (
        <motion.div
          key={t.kind}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ duration: 0.55, delay: i * 0.04, ease: EASE }}
          whileHover={{ y: -4 }}
          className="relative rounded-[22px] overflow-hidden"
          style={{
            background: "#0a0a0a",
            border: "1px solid rgba(255,255,255,0.06)",
            transition: "transform 0.35s ease",
            boxShadow: "0 24px 60px -24px rgba(0,0,0,0.6)",
          }}
        >
          <div style={{ aspectRatio: "1/1" }}>
            <TileScene kind={t.kind} accent={t.accent} />
          </div>
          <div className="px-3 py-2.5 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full" style={{ background: t.accent }} />
            <span
              className="text-[10px] font-bold tracking-[0.2em]"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              {t.label.toUpperCase()}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function TileScene({ kind, accent }: { kind: string; accent: string }) {
  const dark = ["trophy", "key", "sunrise", "heart", "rocket"].includes(kind);
  const BG = dark ? INK : PAPER;
  const FG = dark ? PAPER : INK;

  /* 01 — Gift box with bow (pink, white bg) */
  if (kind === "gift") {
    return (
      <svg viewBox="0 0 300 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <rect width="300" height="300" fill={BG} />
        <ellipse cx="150" cy="252" rx="100" ry="6" fill={INK} opacity="0.08" />
        <motion.g
          animate={{ y: [0, -5, 0], rotate: [-2, 2, -2] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <rect x="80" y="130" width="140" height="110" rx="6" fill={INK} />
          <rect x="80" y="130" width="140" height="22" rx="6" fill={accent} />
          <rect x="140" y="130" width="20" height="110" fill={accent} />
          <path d="M 130 130 Q 110 100 130 90 Q 150 100 150 130 Q 150 100 170 90 Q 190 100 170 130 Z" fill={accent} stroke={INK} strokeWidth="2" />
          <circle cx="150" cy="118" r="6" fill={INK} />
        </motion.g>
        {[
          { x: 60, y: 90, d: 0 },
          { x: 240, y: 110, d: 0.5 },
          { x: 70, y: 200, d: 1 },
          { x: 232, y: 200, d: 1.4 },
        ].map((s, i) => (
          <motion.path
            key={i}
            d={`M ${s.x} ${s.y - 6} L ${s.x + 1.6} ${s.y - 1.6} L ${s.x + 6} ${s.y} L ${s.x + 1.6} ${s.y + 1.6} L ${s.x} ${s.y + 6} L ${s.x - 1.6} ${s.y + 1.6} L ${s.x - 6} ${s.y} L ${s.x - 1.6} ${s.y - 1.6} Z`}
            fill={accent}
            animate={{ scale: [0.6, 1.3, 0.6], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.8, delay: s.d, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: `${s.x}px ${s.y}px` }}
          />
        ))}
      </svg>
    );
  }

  /* 02 — Trophy (gold, black bg) */
  if (kind === "trophy") {
    return (
      <svg viewBox="0 0 300 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <rect width="300" height="300" fill={BG} />
        <motion.g
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M 110 80 L 190 80 L 184 168 Q 184 196 150 196 Q 116 196 116 168 Z" fill={accent} stroke={PAPER} strokeWidth="2" />
          <path d="M 110 92 Q 78 92 78 116 Q 78 140 110 144" stroke={accent} strokeWidth="6" fill="none" />
          <path d="M 190 92 Q 222 92 222 116 Q 222 140 190 144" stroke={accent} strokeWidth="6" fill="none" />
          <rect x="138" y="196" width="24" height="20" fill={accent} />
          <rect x="118" y="216" width="64" height="10" rx="2" fill={accent} />
          <text x="150" y="146" textAnchor="middle" fontSize="36" fontFamily="ui-serif, Georgia" fontWeight="800" fill={INK}>1</text>
        </motion.g>
        {[
          { x: 70, y: 70, d: 0 },
          { x: 230, y: 70, d: 0.5 },
          { x: 60, y: 180, d: 1 },
          { x: 240, y: 200, d: 1.4 },
        ].map((s, i) => (
          <motion.circle
            key={i}
            cx={s.x}
            cy={s.y}
            r="2.4"
            fill={accent}
            animate={{ scale: [0.5, 1.5, 0.5], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.8, delay: s.d, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </svg>
    );
  }

  /* 03 — Paper plane with $ trail (sky, white bg) */
  if (kind === "plane") {
    return (
      <svg viewBox="0 0 300 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <rect width="300" height="300" fill={BG} />
        <motion.path
          d="M 40 240 Q 100 180 160 200 Q 220 220 260 100"
          stroke={accent}
          strokeWidth="2"
          strokeDasharray="4 6"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: EASE }}
        />
        <motion.g
          animate={{ x: [0, 6, 0], y: [0, -4, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M 200 110 L 270 80 L 240 150 L 222 130 Z" fill={accent} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
          <path d="M 222 130 L 240 150 L 230 158 Z" fill={INK} opacity="0.3" />
        </motion.g>
        <g>
          <circle cx="56" cy="240" r="14" fill={accent} stroke={INK} strokeWidth="2" />
          <text x="56" y="246" textAnchor="middle" fontSize="14" fontFamily="ui-serif, Georgia" fontWeight="800" fill={INK}>$</text>
        </g>
      </svg>
    );
  }

  /* 04 — Key + lock (claude orange, black bg) */
  if (kind === "key") {
    return (
      <svg viewBox="0 0 300 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <rect width="300" height="300" fill={BG} />
        <g>
          <rect x="160" y="140" width="100" height="90" rx="8" fill={accent} />
          <path d="M 178 140 L 178 116 Q 178 90 210 90 Q 242 90 242 116 L 242 140" stroke={accent} strokeWidth="8" fill="none" />
          <circle cx="210" cy="180" r="8" fill={INK} />
          <rect x="208" y="186" width="4" height="14" fill={INK} />
        </g>
        <motion.g
          animate={{ x: [-30, 0, -30], rotate: [-8, 0, -8] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <circle cx="70" cy="170" r="22" fill="none" stroke={accent} strokeWidth="6" />
          <rect x="92" y="166" width="60" height="8" fill={accent} />
          <rect x="138" y="174" width="6" height="10" fill={accent} />
          <rect x="148" y="174" width="6" height="14" fill={accent} />
        </motion.g>
        <motion.circle
          cx="244"
          cy="106"
          r="3"
          fill={accent}
          animate={{ scale: [0.6, 1.4, 0.6], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    );
  }

  /* 05 — Cash stack growing (mint, white bg) */
  if (kind === "stack") {
    return (
      <svg viewBox="0 0 300 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <rect width="300" height="300" fill={BG} />
        <ellipse cx="150" cy="262" rx="100" ry="5" fill={INK} opacity="0.08" />
        {[
          { y: 240, w: 140, d: 0 },
          { y: 220, w: 134, d: 0.1 },
          { y: 200, w: 128, d: 0.2 },
          { y: 180, w: 122, d: 0.3 },
        ].map((b, i) => (
          <motion.g
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: b.d, ease: EASE }}
          >
            <rect x={150 - b.w / 2} y={b.y} width={b.w} height="16" rx="2" fill={accent} stroke={INK} strokeWidth="1.6" />
            <circle cx="150" cy={b.y + 8} r="4" fill={INK} />
          </motion.g>
        ))}
        <motion.g
          animate={{ y: [-12, 0, -12], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M 150 130 L 138 150 L 148 150 L 148 170 L 152 170 L 152 150 L 162 150 Z" fill={accent} stroke={INK} strokeWidth="1.6" />
        </motion.g>
        <text x="150" y="106" textAnchor="middle" fontSize="14" fontFamily="ui-monospace, monospace" fontWeight="800" fill={INK}>+15%</text>
      </svg>
    );
  }

  /* 06 — Friendly character waving (coral, white bg) */
  if (kind === "wave") {
    return (
      <svg viewBox="0 0 300 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <rect width="300" height="300" fill={BG} />
        <ellipse cx="150" cy="270" rx="100" ry="6" fill={INK} opacity="0.08" />
        <g>
          <ellipse cx="134" cy="262" rx="10" ry="5" fill={INK} />
          <ellipse cx="166" cy="262" rx="10" ry="5" fill={INK} />
          <rect x="128" y="220" width="11" height="42" fill="#2a2a2a" />
          <rect x="160" y="220" width="11" height="42" fill="#2a2a2a" />
          <path d="M 116 158 L 184 158 L 192 222 L 108 222 Z" fill={accent} />
          <rect x="143" y="148" width="14" height="12" fill={SKIN} />
          <circle cx="150" cy="126" r="24" fill={SKIN} />
          <path d="M 126 124 Q 122 98 144 94 Q 162 88 174 100 Q 178 116 174 124 L 168 120 Q 158 110 148 112 Q 138 112 132 120 Z" fill="#3a2618" />
          <circle cx="141" cy="128" r="1.8" fill={INK} />
          <circle cx="159" cy="128" r="1.8" fill={INK} />
          <ellipse cx="138" cy="136" rx="3" ry="1.6" fill={accent} opacity="0.55" />
          <ellipse cx="162" cy="136" rx="3" ry="1.6" fill={accent} opacity="0.55" />
          <path d="M 140 138 Q 150 146 160 138" stroke={INK} strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <rect x="98" y="160" width="10" height="48" rx="4" fill={accent} />
        </g>
        <motion.g
          animate={{ rotate: [-18, 18, -18] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "200px 168px" }}
        >
          <rect x="196" y="120" width="10" height="56" rx="4" fill={accent} />
          <circle cx="201" cy="116" r="9" fill={SKIN} />
        </motion.g>
        <motion.text
          x="232"
          y="100"
          fontFamily="ui-serif, Georgia"
          fontSize="22"
          fontWeight="800"
          fill={accent}
          animate={{ opacity: [0.4, 1, 0.4], y: [100, 92, 100] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          Hi!
        </motion.text>
      </svg>
    );
  }

  /* 07 — Sunrise over horizon (highlight orange, black bg) */
  if (kind === "sunrise") {
    return (
      <svg viewBox="0 0 300 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <rect width="300" height="300" fill={BG} />
        <motion.circle
          cx="150"
          cy="200"
          r="60"
          fill={accent}
          animate={{ cy: [220, 180, 220], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        {[1, 2, 3].map((i) => (
          <motion.circle
            key={i}
            cx="150"
            cy="200"
            r="60"
            fill="none"
            stroke={accent}
            strokeOpacity="0.35"
            animate={{ r: [60, 60 + i * 14, 60], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 3.2, delay: i * 0.3, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
        <rect x="0" y="220" width="300" height="80" fill={INK} />
        {[40, 90, 150, 210, 260].map((x, i) => (
          <line key={i} x1={x} y1="232" x2={x + 30} y2="232" stroke={accent} strokeWidth="2" opacity={0.6 - i * 0.08} />
        ))}
        {[60, 130, 220].map((x, i) => (
          <line key={i} x1={x} y1="246" x2={x + 22} y2="246" stroke={accent} strokeWidth="2" opacity="0.4" />
        ))}
      </svg>
    );
  }

  /* 08 — Heart with $ (pink, black bg) */
  if (kind === "heart") {
    return (
      <svg viewBox="0 0 300 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <rect width="300" height="300" fill={BG} />
        <motion.g
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "150px 156px" }}
        >
          <path
            d="M 150 220 C 90 188 70 144 70 116 C 70 88 92 70 116 70 C 134 70 146 80 150 92 C 154 80 166 70 184 70 C 208 70 230 88 230 116 C 230 144 210 188 150 220 Z"
            fill={accent}
          />
          <text
            x="150"
            y="160"
            textAnchor="middle"
            fontSize="48"
            fontFamily="ui-serif, Georgia"
            fontWeight="800"
            fill={INK}
          >
            $
          </text>
        </motion.g>
        {[
          { x: 60, y: 60, d: 0 },
          { x: 240, y: 80, d: 0.6 },
          { x: 70, y: 230, d: 1 },
          { x: 246, y: 220, d: 1.4 },
        ].map((s, i) => (
          <motion.path
            key={i}
            d={`M ${s.x} ${s.y + 8} C ${s.x - 6} ${s.y + 4} ${s.x - 6} ${s.y - 4} ${s.x} ${s.y - 2} C ${s.x + 6} ${s.y - 4} ${s.x + 6} ${s.y + 4} ${s.x} ${s.y + 8} Z`}
            fill={accent}
            animate={{ scale: [0.6, 1.2, 0.6], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.8, delay: s.d, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: `${s.x}px ${s.y}px` }}
          />
        ))}
      </svg>
    );
  }

  /* 09 — Bell with $ notification (sky, white bg) */
  if (kind === "bell") {
    return (
      <svg viewBox="0 0 300 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <rect width="300" height="300" fill={BG} />
        <motion.g
          animate={{ rotate: [-6, 6, -6] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "150px 90px" }}
        >
          <path
            d="M 100 200 Q 100 110 150 96 Q 200 110 200 200 L 210 210 L 90 210 Z"
            fill={INK}
          />
          <path
            d="M 110 195 Q 112 122 150 110 Q 188 122 190 195 Z"
            fill={accent}
          />
          <circle cx="150" cy="86" r="8" fill={INK} />
          <path d="M 138 220 Q 150 234 162 220 Z" fill={INK} />
        </motion.g>
        <motion.g
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <circle cx="208" cy="100" r="22" fill={accent} stroke={INK} strokeWidth="2" />
          <text
            x="208"
            y="108"
            textAnchor="middle"
            fontSize="20"
            fontFamily="ui-serif, Georgia"
            fontWeight="800"
            fill={INK}
          >
            $
          </text>
        </motion.g>
        {[1, 2].map((i) => (
          <motion.path
            key={i}
            d={i === 1 ? "M 230 60 L 246 44" : "M 60 60 L 44 44"}
            stroke={accent}
            strokeWidth="3"
            strokeLinecap="round"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.8, delay: i * 0.3, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </svg>
    );
  }

  /* 10 — Rocket launching (gold, black bg) */
  return (
    <svg viewBox="0 0 300 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <rect width="300" height="300" fill={BG} />
      {[
        { x: 50, y: 70, d: 0 },
        { x: 250, y: 90, d: 0.5 },
        { x: 70, y: 220, d: 1 },
        { x: 240, y: 240, d: 1.4 },
      ].map((s, i) => (
        <motion.circle
          key={i}
          cx={s.x}
          cy={s.y}
          r="1.6"
          fill={FG}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, delay: s.d, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      <motion.g
        animate={{ y: [4, -6, 4] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M 150 50 Q 188 100 188 160 L 188 196 L 112 196 L 112 160 Q 112 100 150 50 Z" fill={accent} stroke={PAPER} strokeWidth="2" />
        <circle cx="150" cy="120" r="14" fill={INK} stroke={PAPER} strokeWidth="2" />
        <circle cx="150" cy="120" r="6" fill={accent} />
        <path d="M 112 170 L 86 210 L 112 196 Z" fill={accent} stroke={PAPER} strokeWidth="2" strokeLinejoin="round" />
        <path d="M 188 170 L 214 210 L 188 196 Z" fill={accent} stroke={PAPER} strokeWidth="2" strokeLinejoin="round" />
        <motion.path
          d="M 130 196 L 138 240 L 144 210 L 150 250 L 156 210 L 162 240 L 170 196 Z"
          fill={accent}
          animate={{ scaleY: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "150px 196px" }}
        />
      </motion.g>
    </svg>
  );
}

const BENEFITS = [
  {
    kind: "payout",
    label: "INSTANT PAYOUTS",
    titlePre: "Settle in",
    titleAccent: "seconds — not days.",
    accent: "#cc785c",
    cta: "See payouts",
    footnote: "On-chain · 24/7",
  },
  {
    kind: "noback",
    label: "NO CHARGEBACKS",
    titlePre: "Final sale,",
    titleAccent: "really final.",
    accent: "#9ad1ff",
    cta: "How it works",
    footnote: "No bank reversals",
  },
  {
    kind: "global",
    label: "GLOBAL ORDERS",
    titlePre: "Take orders from",
    titleAccent: "anywhere.",
    accent: "#ffd45a",
    cta: "Open coverage",
    footnote: "190+ countries",
  },
  {
    kind: "margin",
    label: "YOU SET THE MARGIN",
    titlePre: "Your price.",
    titleAccent: "Your margin.",
    accent: "#ff5d8f",
    cta: "Set pricing",
    footnote: "Per-order bidding",
  },
  {
    kind: "always",
    label: "ALWAYS ON",
    titlePre: "Earn while you",
    titleAccent: "sleep.",
    accent: "#6ee0c5",
    cta: "Go live",
    footnote: "24/7 settlement",
  },
] as const;

function MerchantBenefitsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
      {BENEFITS.map((c, i) => (
        <motion.div
          key={c.kind}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ duration: 0.55, delay: i * 0.05, ease: EASE }}
          whileHover={{ y: -4 }}
          className="relative rounded-[22px] overflow-hidden text-left flex flex-col group"
          style={{
            background: "#0a0a0a",
            border: "1px solid rgba(255,255,255,0.06)",
            transition: "transform 0.35s ease",
            boxShadow: "0 24px 60px -24px rgba(0,0,0,0.6)",
          }}
        >
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: "1/1" }}>
            <BenefitScene kind={c.kind} accent={c.accent} />
          </div>

          <div className="px-4 py-4 flex-1 flex flex-col">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-1 h-1 rounded-full" style={{ background: c.accent }} />
              <span
                className="text-[9.5px] font-bold tracking-[0.18em]"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                {c.label}
              </span>
            </div>

            <div
              className="font-display leading-[1.14] flex-1"
              style={{
                fontSize: "18px",
                fontWeight: 600,
                letterSpacing: "-0.025em",
                color: "#fff",
              }}
            >
              {c.titlePre}{" "}
              <span
                style={{
                  color: c.accent,
                  fontStyle: "italic",
                  fontWeight: 500,
                  fontFamily: "ui-serif, Georgia, serif",
                }}
              >
                {c.titleAccent}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between gap-2">
              <Link
                to="/merchant-waitlist"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11.5px] font-semibold tracking-tight hover:-translate-y-[1px] transition-transform whitespace-nowrap"
                style={{ background: "#fff", color: "#0a0a0a" }}
              >
                {c.cta}
                <ArrowRight className="w-3 h-3" />
              </Link>
              <span
                className="text-[9.5px] tracking-tight leading-tight text-right"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                {c.footnote}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

const INK = "#0a0a0a";
const PAPER = "#fff";
const SKIN = "#f4c79b";

export function BenefitScene({ kind, accent }: { kind: string; accent: string }) {
  if (kind === "payout") {
    return (
      <svg viewBox="0 0 300 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <rect width="300" height="300" fill={PAPER} />
        <ellipse cx="150" cy="252" rx="110" ry="6" fill={INK} opacity="0.08" />
        <g>
          <rect x="70" y="170" width="160" height="92" rx="10" fill={INK} />
          <rect x="70" y="190" width="160" height="6" fill={accent} />
          <rect x="180" y="208" width="44" height="22" rx="4" fill={accent} />
          <circle cx="216" cy="219" r="4" fill={INK} />
        </g>
        <motion.g
          animate={{ y: [-40, 0, -2, 0], rotate: [0, 360] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <circle cx="150" cy="120" r="22" fill={accent} stroke={INK} strokeWidth="2.5" />
          <text
            x="150"
            y="128"
            textAnchor="middle"
            fontSize="22"
            fontFamily="ui-serif, Georgia"
            fontWeight="800"
            fill={INK}
          >
            $
          </text>
        </motion.g>
        {[
          { x: 86, y: 110, d: 0 },
          { x: 220, y: 96, d: 0.6 },
          { x: 240, y: 150, d: 1.1 },
        ].map((s, i) => (
          <motion.circle
            key={i}
            cx={s.x}
            cy={s.y}
            r="2.6"
            fill={accent}
            animate={{ scale: [0.6, 1.4, 0.6], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.8, delay: s.d, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </svg>
    );
  }

  if (kind === "noback") {
    return (
      <svg viewBox="0 0 300 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <rect width="300" height="300" fill={PAPER} />
        <ellipse cx="150" cy="252" rx="110" ry="6" fill={INK} opacity="0.08" />
        <g opacity="0.18">
          <rect x="58" y="186" width="184" height="60" fill={INK} />
          <path d="M 50 186 L 150 146 L 250 186 Z" fill={INK} />
          <rect x="78" y="200" width="10" height="40" fill={PAPER} />
          <rect x="108" y="200" width="10" height="40" fill={PAPER} />
          <rect x="138" y="200" width="10" height="40" fill={PAPER} />
          <rect x="168" y="200" width="10" height="40" fill={PAPER} />
          <rect x="198" y="200" width="10" height="40" fill={PAPER} />
        </g>
        <motion.line
          x1="48"
          y1="240"
          x2="252"
          y2="150"
          stroke={accent}
          strokeWidth="6"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: EASE }}
        />
        <motion.g
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M 150 60 L 210 84 L 210 134 Q 210 168 150 188 Q 90 168 90 134 L 90 84 Z"
            fill={INK}
          />
          <path
            d="M 150 70 L 200 90 L 200 134 Q 200 162 150 178 Q 100 162 100 134 L 100 90 Z"
            fill={accent}
          />
          <path
            d="M 124 128 L 144 148 L 180 110"
            stroke={INK}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.g>
      </svg>
    );
  }

  if (kind === "global") {
    return (
      <svg viewBox="0 0 300 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <rect width="300" height="300" fill={INK} />
        <ellipse cx="150" cy="262" rx="100" ry="6" fill={PAPER} opacity="0.06" />
        <g>
          <circle cx="150" cy="150" r="86" fill={INK} stroke={accent} strokeWidth="2.5" />
          <ellipse cx="150" cy="150" rx="86" ry="30" fill="none" stroke={accent} strokeWidth="1.4" opacity="0.6" />
          <ellipse cx="150" cy="150" rx="86" ry="58" fill="none" stroke={accent} strokeWidth="1.4" opacity="0.45" />
          <ellipse cx="150" cy="150" rx="30" ry="86" fill="none" stroke={accent} strokeWidth="1.4" opacity="0.6" />
          <ellipse cx="150" cy="150" rx="58" ry="86" fill="none" stroke={accent} strokeWidth="1.4" opacity="0.45" />
        </g>
        {[
          { x: 108, y: 122, d: 0 },
          { x: 190, y: 138, d: 0.7 },
          { x: 156, y: 196, d: 1.3 },
        ].map((p, i) => (
          <g key={i}>
            <motion.circle
              cx={p.x}
              cy={p.y}
              r="4"
              fill={accent}
              animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, delay: p.d, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.circle
              cx={p.x}
              cy={p.y}
              r="4"
              fill="none"
              stroke={accent}
              animate={{ r: [4, 14, 4], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 2, delay: p.d, repeat: Infinity, ease: "easeInOut" }}
            />
          </g>
        ))}
        <circle cx="44" cy="46" r="10" fill={accent} />
      </svg>
    );
  }

  if (kind === "margin") {
    return (
      <svg viewBox="0 0 300 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <rect width="300" height="300" fill={PAPER} />
        <ellipse cx="150" cy="270" rx="110" ry="6" fill={INK} opacity="0.08" />
        <g>
          <ellipse cx="128" cy="262" rx="11" ry="5" fill={INK} />
          <ellipse cx="172" cy="262" rx="11" ry="5" fill={INK} />
          <rect x="122" y="216" width="12" height="46" fill="#2a2a2a" />
          <rect x="166" y="216" width="12" height="46" fill="#2a2a2a" />
          <path d="M 110 156 L 190 156 L 196 220 L 104 220 Z" fill={INK} />
          <rect x="143" y="146" width="14" height="12" fill={SKIN} />
          <circle cx="150" cy="124" r="24" fill={SKIN} />
          <path d="M 126 122 Q 122 96 144 92 Q 158 86 172 96 Q 178 112 174 122 L 168 118 Q 160 108 150 110 Q 138 110 132 120 Z" fill="#1a1410" />
          <circle cx="141" cy="126" r="1.8" fill={INK} />
          <circle cx="159" cy="126" r="1.8" fill={INK} />
          <ellipse cx="138" cy="134" rx="3" ry="1.6" fill="#ff8c6b" opacity="0.55" />
          <ellipse cx="162" cy="134" rx="3" ry="1.6" fill="#ff8c6b" opacity="0.55" />
          <path d="M 142 136 Q 150 142 158 136" stroke={INK} strokeWidth="1.4" fill="none" strokeLinecap="round" />
          <rect x="98" y="158" width="10" height="44" rx="4" fill={INK} />
          <rect x="192" y="158" width="10" height="44" rx="4" fill={INK} />
          <circle cx="103" cy="206" r="6" fill={SKIN} />
        </g>
        <motion.g
          animate={{ rotate: [-4, 6, -4] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "197px 206px" }}
        >
          <path d="M 197 206 L 256 198 L 268 220 L 240 252 L 218 246 Z" fill={accent} stroke={INK} strokeWidth="2" />
          <circle cx="210" cy="216" r="4" fill={INK} />
          <text
            x="244"
            y="232"
            textAnchor="middle"
            fontSize="18"
            fontFamily="ui-monospace, monospace"
            fontWeight="800"
            fill={INK}
          >
            $$
          </text>
        </motion.g>
        <motion.circle
          cx="80"
          cy="80"
          r="3"
          fill={accent}
          animate={{ scale: [0.6, 1.4, 0.6], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 300 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <rect width="300" height="300" fill={INK} />
      {[
        { x: 50, y: 60, d: 0 },
        { x: 240, y: 50, d: 0.6 },
        { x: 70, y: 200, d: 1.2 },
        { x: 250, y: 200, d: 0.3 },
      ].map((s, i) => (
        <motion.circle
          key={i}
          cx={s.x}
          cy={s.y}
          r="1.8"
          fill={PAPER}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2.2, delay: s.d, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      <g>
        <circle cx="150" cy="140" r="68" fill={accent} />
        <circle cx="178" cy="124" r="58" fill={INK} />
        <circle cx="118" cy="156" r="6" fill={INK} opacity="0.18" />
        <circle cx="132" cy="178" r="4" fill={INK} opacity="0.18" />
        <circle cx="104" cy="134" r="3" fill={INK} opacity="0.18" />
      </g>
      <motion.g
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <circle cx="226" cy="226" r="30" fill={PAPER} stroke={INK} strokeWidth="2" />
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
          const r1 = 24;
          const r2 = 28;
          const rad = (deg * Math.PI) / 180;
          return (
            <line
              key={i}
              x1={226 + r1 * Math.sin(rad)}
              y1={226 - r1 * Math.cos(rad)}
              x2={226 + r2 * Math.sin(rad)}
              y2={226 - r2 * Math.cos(rad)}
              stroke={INK}
              strokeWidth="1.2"
            />
          );
        })}
        <motion.line
          x1="226"
          y1="226"
          x2="226"
          y2="206"
          stroke={accent}
          strokeWidth="2.4"
          strokeLinecap="round"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "226px 226px" }}
        />
        <circle cx="226" cy="226" r="2.5" fill={INK} />
      </motion.g>
      <motion.text
        x="64"
        y="100"
        fontFamily="ui-serif, Georgia"
        fontSize="28"
        fontWeight="800"
        fill={accent}
        animate={{ y: [100, 88, 100], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      >
        z
      </motion.text>
      <motion.text
        x="80"
        y="80"
        fontFamily="ui-serif, Georgia"
        fontSize="22"
        fontWeight="800"
        fill={accent}
        animate={{ y: [80, 68, 80], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 2.6, delay: 0.4, repeat: Infinity, ease: "easeInOut" }}
      >
        z
      </motion.text>
    </svg>
  );
}
