import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Check, ChevronUp, Copy, Sparkles, Trophy } from "lucide-react";
import {
  useMerchantCardsVariant,
  MERCHANT_CARDS_VARIANTS,
  type MerchantCardsVariant,
} from "@/hooks/useMerchantCardsVariant";
import { Dashboard } from "@/components/dashboard/Dashboard";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ════════════════════════════════════════════════════════════════════
   UsageSnippet — paste-ready import + JSX shown under each card section.
   Per CLAUDE.md: every block on /card-preview must be portable.
   ════════════════════════════════════════════════════════════════════ */
function UsageSnippet({ component, jsx }: { component: string; jsx?: string }) {
  const usage = jsx ?? `<${component} />`;
  const code = `import { ${component} } from "@/pages/CardPreview";\n\n${usage}`;
  const [copied, setCopied] = useState(false);
  const onCopy = () => {
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    });
  };
  return (
    <div className="mt-4 mb-6 rounded-xl overflow-hidden border border-white/10 bg-white/[0.03]">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-white/[0.02]">
        <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-white/55">
          Drop in: <span className="text-white/85">{component}</span>
        </span>
        <button
          onClick={onCopy}
          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10.5px] font-semibold tracking-tight text-white/75 hover:text-white hover:bg-white/10 transition"
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? "copied" : "copy"}
        </button>
      </div>
      <pre className="px-3 py-3 text-[11.5px] leading-[1.55] text-white/80 font-mono whitespace-pre overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}

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

        <Dashboard />

        <HomepageVariantPicker />

        <MerchantBenefitsGrid />
        <UsageSnippet component="MerchantBenefitsGrid" />

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
        <UsageSnippet component="ImageTileGrid" />

        <SectionHeading title="Card hero · painted illustrations" sub="3 painterly card-hero illustrations matched to homepage offers." />
        <CardHeroGrid />
        <UsageSnippet component="CardHeroGrid" />
        <UseOnHomepageButton value="card-hero" />

        <SectionHeading title="Merchant carousel · painted scenes" sub="4 painted Gemini scenes (zero-fees / first-transfers / bring-friend / boost-trades)." />
        <MerchantCarouselPainted />
        <UsageSnippet component="MerchantCarouselPainted" />
        <UseOnHomepageButton value="painted" />

        <SectionHeading title="Become a merchant · onboarding card" sub="The merchant-side card with the 'Three quick steps' message." />
        <BecomeMerchantPreview />
        <UsageSnippet component="BecomeMerchantPreview" />

        <SectionHeading title="Apple-style · product cards (animated)" sub="Wallet pass, Pay sheet, iMessage cash, Activity ring — inline animated mockups." />
        <DashboardAppleCards />
        <UsageSnippet component="DashboardAppleCards" />
        <UseOnHomepageButton value="apple" />

        <SectionHeading title="Smart app · v2 · clear hero" sub="White cards, big focal elements (0% badge, flag route, coin between avatars, trophy)." />
        <DashboardClearCards />
        <UsageSnippet component="DashboardClearCards" />
        <UseOnHomepageButton value="clear" />

        <SectionHeading title="Dashboard widgets · live rows" sub="White cards, avatar rows, sparkline, simple progress." />
        <DashboardMerchantCards />
        <UsageSnippet component="DashboardMerchantCards" />
        <UseOnHomepageButton value="live-rows" />

        <SectionHeading title="Dashboard widgets · dark + kinetic" sub="Black app-style cards with ticking numbers, sliding rows, pulses." />
        <DashboardKineticCards />
        <UsageSnippet component="DashboardKineticCards" />
        <UseOnHomepageButton value="kinetic" />

        <SectionHeading title="Editorial · live-data" sub="White cards, italic-serif hero stats matching homepage style." />
        <EditorialMerchantCards />
        <UsageSnippet component="EditorialMerchantCards" />
        <UseOnHomepageButton value="editorial" />

        <SectionHeading title="Mixed · Apple animated + scene" sub="Alternating animated mockup and painted scene." />
        <DashboardMixedCards />
        <UsageSnippet component="DashboardMixedCards" />
        <UseOnHomepageButton value="mixed" />
      </div>
    </main>
  );
}

function SectionHeading({ title, sub }: { title: string; sub: string }) {
  return (
    <>
      <h2
        className="font-display text-center text-white mt-24 mb-3"
        style={{
          fontSize: "clamp(1.4rem, 2.6vw, 1.9rem)",
          fontWeight: 500,
          letterSpacing: "-0.035em",
        }}
      >
        {title}
      </h2>
      <p className="text-center text-white/55 text-[13px] max-w-[560px] mx-auto mb-10 leading-relaxed">
        {sub}
      </p>
    </>
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

export function ImageTileGrid() {
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

export function MerchantBenefitsGrid() {
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

/* ════════════════════════════════════════════════════════════════════
   CardHeroGrid — 3 painted illustration card heroes
   ════════════════════════════════════════════════════════════════════ */
const CARD_HEROES = [
  { img: "pay-anyone-card.png", titlePre: "Pay anyone, anywhere.", titleAccent: "Instantly.", desc: "Send money worldwide in under 60 seconds — no banks, no friction.", cta: "Send money", bg: "#fff", fg: "#0a0a0a" },
  { img: "rate-neon-card.png", titlePre: "The best rate,", titleAccent: "every single time.", desc: "Live rates from merchants competing for your order. Winner is always cheapest.", cta: "See live rates", bg: "#0a0a0a", fg: "#fff" },
  { img: "earn-trade-card.png", titlePre: "Earn up to 10%", titleAccent: "on every trade.", desc: "Liquidity providers earn real yield by routing real orders.", cta: "Start earning", bg: "#fff", fg: "#0a0a0a" },
] as const;
export function CardHeroGrid() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
      {CARD_HEROES.map((c, i) => {
        const reversed = i % 2 === 1;
        return (
          <motion.div key={c.img} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-8%" }} transition={{ duration: 0.55, delay: i * 0.05, ease: EASE }} whileHover={{ y: -4 }} className="relative rounded-[28px] overflow-hidden p-6 sm:p-8 flex flex-col sm:flex-row items-stretch gap-6" style={{ background: c.bg, color: c.fg, border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 30px 80px -30px rgba(0,0,0,0.7)", transition: "transform 0.35s ease", minHeight: 320 }}>
            <div className={`flex-1 flex flex-col justify-between ${reversed ? "sm:order-2" : ""}`}>
              <div>
                <h3 className="font-display leading-[1.05] mb-4" style={{ fontSize: "clamp(1.6rem, 2.4vw, 2.1rem)", fontWeight: 500, letterSpacing: "-0.035em" }}>
                  {c.titlePre}{" "}
                  <span style={{ fontStyle: "italic", fontFamily: "ui-serif, Georgia, serif" }}>{c.titleAccent}</span>
                </h3>
                <p className="text-[14px] leading-[1.5] opacity-70 max-w-[340px]">{c.desc}</p>
              </div>
              <button className="mt-6 inline-flex items-center justify-center self-start px-5 h-10 rounded-full text-[13px] font-semibold tracking-tight" style={{ background: c.fg, color: c.bg }}>
                {c.cta} →
              </button>
            </div>
            <div className={`flex-1 ${reversed ? "sm:order-1" : ""}`}>
              <img src={`/illustrations/${c.img}`} alt={c.titlePre} className="w-full aspect-square object-cover rounded-2xl" loading="lazy" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   MerchantCarouselPainted — 4 painted scene cards with the original
   merchant offers (uses Gemini PNGs in public/illustrations/)
   ════════════════════════════════════════════════════════════════════ */
const MC_PAINTED = [
  { img: "zero-fees-card.png", label: "ZERO FEES THIS WEEK", accent: "#6ee0c5", titlePre: "Don't miss out on", titleAccent: "0% fees", titleTail: " this week.", cta: "Send money", footnote: "Auto-applied at checkout" },
  { img: "first-transfers-card.png", label: "FIRST TRANSFERS · FEE-FREE", accent: "#ffd45a", titlePre: "Your first 3 transfers", titleAccent: "home — fee-free.", titleTail: "", cta: "Send home", footnote: "USD → INR live rate" },
  { img: "bring-friend-card.png", label: "BRING A FRIEND", accent: "#ff8c6b", titlePre: "Bring a friend.", titleAccent: "You both get $20.", titleTail: "", cta: "Share invite", footnote: "Paid when they trade $100+" },
  { img: "boost-trades-card.png", label: "BOOST ON YOUR NEXT 5 TRADES", accent: "#9ad1ff", titlePre: "Stack a", titleAccent: "+15% boost", titleTail: " on your next 5 trades.", cta: "Activate boost", footnote: "Avg user banked $48 last week" },
] as const;
export function MerchantCarouselPainted() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {MC_PAINTED.map((c, i) => (
        <motion.div key={c.img} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-8%" }} transition={{ duration: 0.55, delay: i * 0.05, ease: EASE }} whileHover={{ y: -4 }} className="relative rounded-[22px] overflow-hidden text-left flex flex-col" style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", transition: "transform 0.35s ease", boxShadow: "0 24px 60px -24px rgba(0,0,0,0.6)" }}>
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: "1/1" }}>
            <img src={`/illustrations/${c.img}`} alt={c.label} className="absolute inset-0 w-full h-full object-cover block" loading="lazy" />
          </div>
          <div className="px-5 py-5 flex-1 flex flex-col">
            <div className="flex items-center gap-1.5 mb-2.5">
              <span className="w-1 h-1 rounded-full" style={{ background: c.accent }} />
              <span className="text-[10px] font-bold tracking-[0.18em]" style={{ color: "rgba(255,255,255,0.55)" }}>{c.label}</span>
            </div>
            <div className="font-display leading-[1.12] flex-1" style={{ fontSize: "20px", fontWeight: 600, letterSpacing: "-0.025em", color: "#fff" }}>
              {c.titlePre}{" "}
              <span style={{ color: c.accent, fontStyle: "italic", fontWeight: 500, fontFamily: "ui-serif, Georgia, serif" }}>{c.titleAccent}</span>
              {c.titleTail && <span>{c.titleTail}</span>}
            </div>
            <div className="mt-5 flex items-center justify-between gap-2 flex-wrap">
              <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold tracking-tight" style={{ background: "#fff", color: "#0a0a0a" }}>{c.cta} →</button>
              <span className="text-[10px] tracking-tight leading-tight" style={{ color: "rgba(255,255,255,0.4)" }}>{c.footnote}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   BecomeMerchantPreview
   ════════════════════════════════════════════════════════════════════ */
export function BecomeMerchantPreview() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
      <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-8%" }} transition={{ duration: 0.55, ease: EASE }} whileHover={{ y: -4 }} className="relative rounded-[22px] overflow-hidden" style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 30px 80px -30px rgba(0,0,0,0.7)", transition: "transform 0.35s ease", aspectRatio: "1/1" }}>
        <img src="/illustrations/become-merchant.png" alt="Become a merchant" className="absolute inset-0 w-full h-full object-cover block" loading="lazy" />
        <div className="absolute top-3 left-3 text-[10px] font-bold tracking-[0.18em] text-white px-2 py-1 rounded-md bg-black/55 backdrop-blur-sm">APPLY</div>
        <div className="absolute top-3 right-3 text-[10px] font-bold tracking-[0.18em] text-white/75 px-2 py-1 rounded-md bg-black/55 backdrop-blur-sm text-right leading-tight">
          ONBOARD IN<br /><span className="text-white">5 MIN</span>
        </div>
        <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-white/95 text-black px-4 py-3 flex items-center justify-between gap-3">
          <div>
            <div className="font-display text-[15px] leading-tight" style={{ letterSpacing: "-0.02em" }}>
              Three quick steps.{" "}
              <span style={{ fontStyle: "italic", fontFamily: "ui-serif, Georgia, serif" }}>Then you're live.</span>
            </div>
            <div className="text-[10px] tracking-tight opacity-60 mt-0.5">Onboard in 5 minutes</div>
          </div>
          <button className="bg-black text-white text-[12px] font-semibold rounded-full px-4 py-1.5 whitespace-nowrap">Start →</button>
        </div>
      </motion.div>
      <div className="flex flex-col">
        <span className="text-[10px] font-semibold tracking-[0.3em] uppercase mb-3" style={{ color: "#ff7a3d" }}>Onboard in minutes</span>
        <h3 className="font-display text-white mb-4 leading-[1.02]" style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 500, letterSpacing: "-0.04em" }}>
          Become a merchant <span className="text-white/65">in 5 minutes.</span>
        </h3>
        <p className="text-white/65 text-[14px] leading-[1.5] mb-6 max-w-[420px]">Three quick steps. Then you're live on the Blip Market, fulfilling real settlement demand.</p>
        <ol className="flex flex-col gap-3 mb-6">
          {[{ n: "1", t: "Apply", d: "30 seconds. Tell us your country and volume." }, { n: "2", t: "Verify", d: "Quick identity check, no paperwork drama." }, { n: "3", t: "Start earning", d: "Fulfill your first trade within the hour." }].map((s) => (
            <li key={s.n} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold mt-0.5" style={{ background: "rgba(255,122,61,0.18)", color: "#ff7a3d" }}>{s.n}</span>
              <div>
                <div className="text-white text-[14px] font-semibold tracking-tight">{s.t}</div>
                <div className="text-white/55 text-[12px] leading-tight">{s.d}</div>
              </div>
            </li>
          ))}
        </ol>
        <div className="flex items-center gap-4">
          <button className="bg-white text-black text-[13px] font-semibold rounded-full px-5 py-2.5">Start Onboarding →</button>
          <button className="text-white/80 text-[13px] font-medium tracking-tight">Learn more →</button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   DashboardAppleCards — Apple-style animated mockups
   (Wallet pass / Pay sheet / iMessage cash / Activity ring)
   ════════════════════════════════════════════════════════════════════ */
const APPLE_ACCENT = "#cc785c";
const APPLE_CARDS = [
  { key: "fees", label: "FEE WAIVER · LIVE", refTag: "WEEK 21", hero: "wallet-pass" as const, titlePre: "Don't miss out on", titleAccent: "0% fees", titleTail: " this week.", cta: "Send" },
  { key: "route", label: "TRANSFER ROUTE", refTag: "USD → INR", hero: "pay-sheet" as const, titlePre: "Your first 3 transfers", titleAccent: "home — fee-free.", cta: "Send home" },
  { key: "friend", label: "REFERRAL · LIVE", refTag: "#R-1842", hero: "messages-cash" as const, titlePre: "Bring a friend.", titleAccent: "You both get $20.", cta: "Share invite" },
  { key: "boost", label: "LEADERBOARD", refTag: "RANK 3", hero: "activity-ring" as const, titlePre: "Stack a", titleAccent: "+15% boost", titleTail: " on your next 5.", cta: "Activate" },
];
export function DashboardAppleCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {APPLE_CARDS.map((c, i) => <AppleCard key={c.key} card={c} index={i} />)}
    </div>
  );
}
function AppleCard({ card, index }: { card: typeof APPLE_CARDS[number]; index: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-8%" }} transition={{ duration: 0.55, delay: index * 0.05, ease: EASE }} whileHover={{ y: -4 }} className="relative rounded-[24px] overflow-hidden text-left flex flex-col" style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.06)", transition: "transform 0.35s ease", boxShadow: "0 1px 0 rgba(255,255,255,0.6) inset, 0 30px 80px -30px rgba(0,0,0,0.5)", color: "#0a0a0a" }}>
      <CardEyebrow label={card.label} refTag={card.refTag} accent={APPLE_ACCENT} dark={false} />
      <div className="relative mx-5 mt-5 rounded-2xl overflow-hidden flex items-center justify-center" style={{ aspectRatio: "16/11", background: `radial-gradient(ellipse 80% 80% at 50% 30%, #f8f8f8 0%, #eeeeee 100%), radial-gradient(circle at 1px 1px, rgba(0,0,0,0.06) 1px, transparent 0)`, backgroundSize: "100% 100%, 14px 14px", backgroundBlendMode: "normal, multiply", border: `1px solid rgba(0,0,0,0.05)`, boxShadow: "0 1px 0 rgba(255,255,255,0.9) inset", perspective: 1000 }}>
        {card.hero === "wallet-pass" && <WalletPassHero accent={APPLE_ACCENT} />}
        {card.hero === "pay-sheet" && <PaySheetHero accent={APPLE_ACCENT} />}
        {card.hero === "messages-cash" && <MessagesCashHero accent={APPLE_ACCENT} />}
        {card.hero === "activity-ring" && <ActivityRingHero accent={APPLE_ACCENT} />}
      </div>
      <CardFooter card={card} dark={false} />
    </motion.div>
  );
}

function CardEyebrow({ label, refTag, accent, dark }: { label: string; refTag: string; accent: string; dark: boolean }) {
  return (
    <div className="px-5 pt-5 flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <motion.span animate={{ opacity: [1, 0.35, 1] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }} className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
        <span className="text-[9.5px] font-bold tracking-[0.22em]" style={{ color: dark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)" }}>{label}</span>
      </div>
      <span className="text-[9.5px] font-bold tracking-[0.15em]" style={{ color: dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)", fontFamily: "ui-monospace, monospace" }}>{refTag}</span>
    </div>
  );
}
function CardFooter({ card, dark }: { card: { titlePre: string; titleAccent: string; titleTail?: string; cta: string }; dark: boolean }) {
  return (
    <div className="px-5 pb-5 pt-5 mt-auto">
      <div className="font-display leading-[1.12] mb-4" style={{ fontSize: "17px", fontWeight: 600, letterSpacing: "-0.022em", color: dark ? "#fff" : "#0a0a0a" }}>
        {card.titlePre}{" "}
        <span style={{ fontStyle: "italic", fontWeight: 500, fontFamily: "ui-serif, Georgia, serif", color: dark ? APPLE_ACCENT : "#0a0a0a" }}>{card.titleAccent}</span>
        {card.titleTail && <span>{card.titleTail}</span>}
      </div>
      <button className="inline-flex items-center gap-1.5 px-4 h-9 rounded-full text-[12.5px] font-semibold tracking-tight" style={{ background: dark ? "#fff" : "#0a0a0a", color: dark ? "#0a0a0a" : "#fff" }}>
        {card.cta}
        <ArrowUpRight className="w-3 h-3" strokeWidth={2.5} />
      </button>
    </div>
  );
}

function WalletPassHero({ accent, hovered = false }: { accent: string; hovered?: boolean }) {
  return (
    <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }} style={{ transform: "rotateX(10deg) rotateY(-10deg) rotateZ(-1deg)", transformStyle: "preserve-3d", filter: `drop-shadow(0 20px 32px rgba(0,0,0,0.35)) drop-shadow(0 0 16px ${accent}33)` }}>
      <div className="rounded-[16px] overflow-hidden relative" style={{ width: 188, height: 124, background: `radial-gradient(ellipse 100% 60% at 50% 0%, rgba(255,255,255,0.06), transparent 60%), linear-gradient(160deg, #1f1f1f 0%, #0e0e0e 55%, #050505 100%)`, boxShadow: "0 1px 0 rgba(255,255,255,0.1) inset, 0 -1px 0 rgba(0,0,0,0.5) inset" }}>
        <div className="absolute top-0 inset-x-0" style={{ height: 3, background: `linear-gradient(90deg, ${accent}, #ffb38a, ${accent})`, boxShadow: `0 0 14px ${accent}99` }} />
        <div className="px-3.5 pt-3.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full flex items-center justify-center" style={{ background: accent }}><span className="text-[7px] font-black text-black leading-none">B</span></div>
            <span className="text-[8.5px] font-bold tracking-[0.2em] text-white/80">BLIP · WALLET</span>
          </div>
          <span className="text-[8px] font-bold tracking-[0.15em] px-1.5 py-0.5 rounded" style={{ color: accent, background: `${accent}1f`, fontFamily: "ui-monospace, monospace" }}>WK21</span>
        </div>
        <div className="px-3.5 mt-2"><span className="text-[8px] font-bold tracking-[0.24em] text-white/45">FEE WAIVER · LIVE</span></div>
        <div className="px-3.5 mt-0.5 flex items-baseline gap-2">
          <span className="font-bold leading-none" style={{ color: "#fff", fontFamily: "ui-serif, Georgia, serif", fontSize: 44, letterSpacing: "-0.045em", textShadow: `0 0 24px ${accent}66` }}>0<span style={{ color: accent, fontStyle: "italic" }}>%</span></span>
          <motion.span
            animate={{ color: hovered ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.55)" }}
            transition={{ duration: 0.3 }}
            className="relative text-[9px] font-bold pb-1"
            style={{ fontFamily: "ui-monospace, monospace" }}
          >
            $4.20
            <motion.span
              aria-hidden
              initial={{ scaleX: 0 }}
              animate={{ scaleX: hovered ? 1 : 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-none absolute left-0 top-1/2 h-[1.5px] origin-left"
              style={{
                width: "100%",
                background: `linear-gradient(90deg, ${accent}, #ffb38a)`,
                boxShadow: `0 0 8px ${accent}cc`,
              }}
            />
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 2 }}
            transition={{ duration: 0.35, delay: hovered ? 0.25 : 0 }}
            className="ml-1 inline-flex items-center px-1.5 py-[2px] rounded-full text-[7.5px] font-bold tracking-[0.18em]"
            style={{
              color: accent,
              background: `${accent}22`,
              border: `1px solid ${accent}66`,
              fontFamily: "ui-monospace, monospace",
            }}
          >
            WAIVED
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}

function PaySheetHero({ accent }: { accent: string }) {
  return (
    <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }} style={{ transform: "rotateX(8deg) rotateY(-8deg) rotateZ(1deg)", transformStyle: "preserve-3d", filter: "drop-shadow(0 24px 40px rgba(0,0,0,0.2))" }}>
      <div className="rounded-[18px] overflow-hidden bg-white relative" style={{ width: 188, height: 134, boxShadow: "0 1px 0 rgba(255,255,255,1) inset, 0 24px 50px -12px rgba(0,0,0,0.18)", border: "1px solid rgba(0,0,0,0.05)" }}>
        <div className="flex justify-center pt-1.5 pb-1"><div className="w-9 h-1 rounded-full bg-black/15" /></div>
        <div className="px-3.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full flex items-center justify-center" style={{ background: "#0a0a0a" }}><span className="text-[7px] font-black text-white leading-none">B</span></div>
            <span className="text-[9px] font-bold tracking-[0.18em] text-black/65">BLIP · PAY</span>
          </div>
        </div>
        <div className="mx-3 mt-2 flex items-center justify-between px-2.5 py-2 rounded-lg" style={{ background: "linear-gradient(180deg, #fafafa, #f3f3f3)", border: "1px solid rgba(0,0,0,0.06)" }}>
          <div className="flex items-center gap-1.5"><span aria-hidden style={{ fontSize: 13 }}>🇺🇸</span><span className="text-[9px] font-bold tracking-[0.12em] text-black/60">USD</span></div>
          <span className="text-[12px] font-bold text-black" style={{ fontFamily: "ui-monospace, monospace" }}>$1,000.00</span>
        </div>
        <div className="mx-3 mt-1.5 flex items-center justify-between px-2.5 py-2 rounded-lg" style={{ background: `linear-gradient(180deg, ${accent}14, ${accent}1f)`, border: `1px solid ${accent}66` }}>
          <div className="flex items-center gap-1.5"><span aria-hidden style={{ fontSize: 13 }}>🇮🇳</span><span className="text-[9px] font-bold tracking-[0.12em]" style={{ color: accent }}>INR</span></div>
          <span className="text-[12px] font-bold" style={{ color: accent, fontFamily: "ui-monospace, monospace" }}>₹83,250</span>
        </div>
      </div>
    </motion.div>
  );
}

function MessagesCashHero({ accent }: { accent: string }) {
  return (
    <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }} className="relative" style={{ transform: "rotateX(8deg) rotateY(-8deg)", transformStyle: "preserve-3d", filter: `drop-shadow(0 22px 36px ${accent}44)` }}>
      <div className="relative rounded-[20px] px-3.5 pt-3 pb-3" style={{ background: `linear-gradient(180deg, ${accent} 0%, ${accent}dd 50%, ${accent}cc 100%)`, color: "#fff", width: 184, boxShadow: `0 1px 0 rgba(255,255,255,0.2) inset, 0 -1px 0 rgba(0,0,0,0.15) inset` }}>
        <div className="rounded-[12px] relative overflow-hidden mb-2.5" style={{ background: `radial-gradient(ellipse 100% 80% at 50% 0%, rgba(255,255,255,0.5), transparent 60%), linear-gradient(135deg, #f5f5f5 0%, #ffffff 40%, #ececec 100%)`, color: "#0a0a0a", height: 68, boxShadow: "0 1px 0 rgba(255,255,255,0.9) inset, 0 6px 14px rgba(0,0,0,0.25)", border: "1px solid rgba(0,0,0,0.06)" }}>
          <div className="px-3 pt-2 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: `linear-gradient(135deg, ${accent}, #ff9a73)` }} />
              <span className="text-[7.5px] font-bold tracking-[0.2em] text-black/65">BLIP CASH</span>
            </div>
            <span className="text-[7.5px] font-bold tracking-[0.15em] text-black/35" style={{ fontFamily: "ui-monospace, monospace" }}>★ NEW</span>
          </div>
          <div className="px-3 pt-0.5 flex items-baseline justify-between">
            <span className="font-bold leading-none" style={{ fontFamily: "ui-serif, Georgia, serif", fontSize: 28, letterSpacing: "-0.03em" }}>$20</span>
            <span className="text-[8.5px] font-bold tracking-[0.12em] text-black/45" style={{ fontFamily: "ui-monospace, monospace" }}>USD</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-white/90" strokeWidth={2.5} />
          <span className="text-[9.5px] font-bold tracking-tight">For Kai · Welcome bonus</span>
        </div>
      </div>
    </motion.div>
  );
}

function ActivityRingHero({ accent }: { accent: string }) {
  const rings = [
    { r: 44, stroke: 8, color: accent, pct: 0.62, glow: 14 },
    { r: 33, stroke: 7, color: "#ffd45a", pct: 0.42, glow: 10 },
    { r: 23, stroke: 6, color: "#6ee0c5", pct: 0.88, glow: 8 },
  ];
  return (
    <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} style={{ transform: "rotateX(8deg) rotateY(-8deg)", transformStyle: "preserve-3d", filter: "drop-shadow(0 24px 38px rgba(0,0,0,0.5))" }}>
      <div className="relative rounded-[22px] flex items-center justify-center" style={{ width: 142, height: 142, background: `radial-gradient(ellipse 100% 60% at 50% 0%, rgba(255,255,255,0.05), transparent 70%), linear-gradient(160deg, #1c1c1c 0%, #0a0a0a 70%, #050505 100%)`, boxShadow: "0 1px 0 rgba(255,255,255,0.08) inset, 0 -1px 0 rgba(0,0,0,0.6) inset", border: "1px solid rgba(255,255,255,0.04)" }}>
        <svg width="120" height="120" viewBox="0 0 120 120">
          {rings.map((ring, i) => {
            const c = 2 * Math.PI * ring.r;
            return (
              <g key={i}>
                <circle cx="60" cy="60" r={ring.r} fill="none" stroke={`${ring.color}1f`} strokeWidth={ring.stroke} />
                <motion.circle cx="60" cy="60" r={ring.r} fill="none" stroke={ring.color} strokeWidth={ring.stroke} strokeLinecap="round" transform="rotate(-90 60 60)" strokeDasharray={c} initial={{ strokeDashoffset: c }} whileInView={{ strokeDashoffset: c * (1 - ring.pct) }} viewport={{ once: true }} transition={{ duration: 1.6, delay: i * 0.18, ease: EASE }} style={{ filter: `drop-shadow(0 0 ${ring.glow}px ${ring.color})` }} />
              </g>
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-bold leading-none" style={{ fontFamily: "ui-serif, Georgia, serif", fontSize: 26, color: "#fff", letterSpacing: "-0.04em", textShadow: `0 0 18px ${accent}55` }}>+15<span style={{ color: accent, fontStyle: "italic" }}>%</span></span>
          <span className="text-[7.5px] font-bold tracking-[0.22em] text-white/55 mt-0.5" style={{ fontFamily: "ui-monospace, monospace" }}>BOOST</span>
        </div>
        <div className="absolute -top-2 -right-2 flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-bold" style={{ background: "#fff", color: "#0a0a0a", fontFamily: "ui-monospace, monospace", boxShadow: "0 6px 16px rgba(0,0,0,0.35)" }}>
          <ChevronUp className="w-2.5 h-2.5" style={{ color: accent }} strokeWidth={3} />
          RANK 3
        </div>
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   The 5 remaining components (Clear/Merchant/Kinetic/Editorial/Mixed)
   ════════════════════════════════════════════════════════════════════ */
const CLEAR_CARDS = [
  { key: "fees", label: "FEE WAIVER · LIVE", refTag: "WEEK 21", hero: "fees" as const, titlePre: "Don't miss out on", titleAccent: "0% fees", titleTail: " this week.", cta: "Send" },
  { key: "route", label: "TRANSFER ROUTE", refTag: "USD → INR", hero: "route" as const, titlePre: "Your first 3 transfers", titleAccent: "home — fee-free.", cta: "Send home" },
  { key: "friend", label: "REFERRAL · LIVE", refTag: "#R-1842", hero: "friend" as const, titlePre: "Bring a friend.", titleAccent: "You both get $20.", cta: "Share invite" },
  { key: "boost", label: "LEADERBOARD", refTag: "RANK 3", hero: "boost" as const, titlePre: "Stack a", titleAccent: "+15% boost", titleTail: " on your next 5.", cta: "Activate" },
];
const NAMES_W = ["Alex Wei", "Priya R.", "You + Kai", "Jules S."];
const SUBS_W = ["$250 · 14s ago", "$1,000 → ₹83,250", "$72/$100 to unlock", "$48/wk · top 1%"];
const INITIALS_W = ["AW", "PR", "Y+K", "JS"];
const BG_W = ["#ffe1d6", "#d6ecff", "#ffd6e7", "#fff0d6"];

function ClearAvatar({ initials, bg, size, badge }: { initials: string; bg: string; size: number; badge?: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="rounded-full flex items-center justify-center font-bold flex-shrink-0" style={{ background: bg, color: "#0a0a0a", width: size, height: size, fontSize: size * 0.38, fontFamily: "ui-serif, Georgia, serif", border: "3px solid #fff", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>{initials}</div>
      {badge}
    </div>
  );
}

export function DashboardClearCards() {
  const renderHero = (kind: string) => {
    if (kind === "fees") return (
      <div className="flex items-center justify-center gap-5 px-4">
        <ClearAvatar initials="AW" bg="#ffe1d6" size={64} />
        <div className="relative">
          <motion.div animate={{ boxShadow: [`0 0 0 ${APPLE_ACCENT}00`, `0 0 32px ${APPLE_ACCENT}55`, `0 0 0 ${APPLE_ACCENT}00`] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }} className="rounded-full flex flex-col items-center justify-center font-bold leading-none" style={{ width: 96, height: 96, background: APPLE_ACCENT, color: "#0a0a0a", fontFamily: "ui-serif, Georgia, serif" }}>
            <span style={{ fontSize: 40, fontWeight: 800, lineHeight: 1 }}>0%</span>
            <span style={{ fontSize: 9, fontFamily: "ui-monospace, monospace", fontWeight: 700, letterSpacing: "0.18em", marginTop: 2 }}>FEES</span>
          </motion.div>
          <Sparkles className="absolute -top-2 -right-2 w-5 h-5" style={{ color: APPLE_ACCENT }} strokeWidth={2.5} />
        </div>
      </div>
    );
    if (kind === "route") return (
      <div className="flex flex-col items-center justify-center px-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full flex items-center justify-center" style={{ background: "#fff", border: "3px solid #fff", width: 56, height: 56, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", fontSize: 28 }}><span aria-hidden>🇺🇸</span></div>
          <svg width="64" height="40" viewBox="0 0 64 40">
            <motion.path d="M 4 28 Q 32 -4 60 28" stroke={APPLE_ACCENT} strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" fill="none" animate={{ strokeDashoffset: [0, -32] }} transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }} />
            <path d="M 56 24 L 62 28 L 56 32" stroke={APPLE_ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          <div className="rounded-full flex items-center justify-center" style={{ background: "#fff", border: "3px solid #fff", width: 56, height: 56, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", fontSize: 28 }}><span aria-hidden>🇮🇳</span></div>
        </div>
        <div className="mt-4 flex items-baseline gap-3">
          <span className="font-bold text-black" style={{ fontFamily: "ui-monospace, monospace", fontSize: 18 }}>$1,000</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-black/40 rotate-45" strokeWidth={2.5} />
          <span className="font-bold" style={{ fontFamily: "ui-monospace, monospace", fontSize: 18, color: APPLE_ACCENT }}>₹83,250</span>
        </div>
      </div>
    );
    if (kind === "friend") return (
      <div className="flex items-center justify-center px-4">
        <ClearAvatar initials="Y" bg="#ffd6e7" size={56} />
        <motion.div animate={{ rotate: [-6, 6, -6], y: [0, -4, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="relative -mx-3 z-10" style={{ filter: `drop-shadow(0 8px 24px ${APPLE_ACCENT}66)` }}>
          <div className="rounded-full flex items-center justify-center font-bold" style={{ background: `radial-gradient(circle at 35% 30%, #ffe5b8, ${APPLE_ACCENT} 70%)`, border: "3px solid #fff", width: 72, height: 72, color: "#0a0a0a", fontFamily: "ui-serif, Georgia, serif", fontSize: 28 }}>$</div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap" style={{ background: "#0a0a0a", color: "#fff", fontFamily: "ui-monospace, monospace" }}>+$20</div>
        </motion.div>
        <ClearAvatar initials="K" bg="#d6f5eb" size={56} />
      </div>
    );
    return (
      <div className="flex items-center justify-center gap-5 px-4">
        <div className="relative">
          <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }} className="rounded-2xl flex items-center justify-center" style={{ width: 80, height: 80, background: `linear-gradient(180deg, ${APPLE_ACCENT}, ${APPLE_ACCENT}dd)`, boxShadow: `0 12px 32px ${APPLE_ACCENT}55` }}>
            <Trophy className="w-10 h-10 text-white" strokeWidth={1.8} />
          </motion.div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap flex items-center gap-1" style={{ background: "#0a0a0a", color: "#fff", fontFamily: "ui-monospace, monospace" }}>
            <ChevronUp className="w-2.5 h-2.5" strokeWidth={3} />
            RANK 3
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="font-bold leading-none" style={{ fontFamily: "ui-serif, Georgia, serif", fontSize: 30, color: APPLE_ACCENT, letterSpacing: "-0.03em" }}>+15%</span>
          <span className="text-[9px] font-bold tracking-[0.18em] text-black/45">5 LEFT</span>
        </div>
      </div>
    );
  };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {CLEAR_CARDS.map((c, i) => (
        <motion.div
          key={c.key}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ duration: 0.55, delay: i * 0.05, ease: EASE }}
          whileHover={{
            scale: 1.08,
            y: -10,
            zIndex: 20,
            boxShadow:
              "0 1px 0 rgba(255,255,255,0.7) inset, 0 50px 110px -30px rgba(0,0,0,0.55), 0 24px 50px -20px rgba(204,120,92,0.28)",
            transition: { type: "spring", stiffness: 220, damping: 22, mass: 0.6 },
          }}
          className="relative rounded-[24px] overflow-hidden text-left flex flex-col cursor-pointer"
          style={{
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow:
              "0 1px 0 rgba(255,255,255,0.6) inset, 0 30px 80px -30px rgba(0,0,0,0.5)",
            color: "#0a0a0a",
            transformOrigin: "center center",
            willChange: "transform",
          }}
        >
          <CardEyebrow label={c.label} refTag={c.refTag} accent={APPLE_ACCENT} dark={false} />
          <div className="relative mx-5 mt-5 rounded-2xl overflow-hidden flex items-center justify-center" style={{ aspectRatio: "16/11", background: `radial-gradient(ellipse 80% 80% at 50% 40%, ${APPLE_ACCENT}1f 0%, #fafafa 100%)`, border: `1px solid ${APPLE_ACCENT}22` }}>
            {renderHero(c.hero)}
          </div>
          <CardFooter card={c} dark={false} />
        </motion.div>
      ))}
    </div>
  );
}

export function DashboardMerchantCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {CLEAR_CARDS.map((c, i) => (
        <motion.div key={c.key} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-8%" }} transition={{ duration: 0.55, delay: i * 0.05, ease: EASE }} whileHover={{ y: -4 }} className="relative rounded-[22px] overflow-hidden text-left flex flex-col" style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.06)", transition: "transform 0.35s ease", boxShadow: "0 24px 60px -24px rgba(0,0,0,0.6)", color: "#0a0a0a" }}>
          <CardEyebrow label={c.label} refTag={c.refTag} accent={APPLE_ACCENT} dark={false} />
          <div className="px-5 pt-4 pb-2">
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(0,0,0,0.025)", border: "1px solid rgba(0,0,0,0.05)" }}>
              <ClearAvatar initials={INITIALS_W[i]} bg={BG_W[i]} size={36} />
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-bold text-black truncate">{NAMES_W[i]}</div>
                <div className="text-[10.5px] text-black/55 mt-0.5" style={{ fontFamily: "ui-monospace, monospace" }}>{SUBS_W[i]}</div>
              </div>
            </div>
          </div>
          <CardFooter card={c} dark={false} />
        </motion.div>
      ))}
    </div>
  );
}

export function DashboardKineticCards() {
  const KACCENT = ["#ff8c50", "#6ee0c5", "#ff5d8f", "#9ad1ff"];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {APPLE_CARDS.map((c, i) => (
        <motion.div key={c.key} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-8%" }} transition={{ duration: 0.55, delay: i * 0.05, ease: EASE }} whileHover={{ y: -4 }} className="relative rounded-[24px] overflow-hidden text-left flex flex-col" style={{ background: "linear-gradient(180deg, #0f0f0f 0%, #0a0a0a 100%)", border: "1px solid rgba(255,255,255,0.08)", transition: "transform 0.35s ease", boxShadow: "0 30px 80px -30px rgba(0,0,0,0.9)", color: "#fff" }}>
          <div aria-hidden className="absolute pointer-events-none" style={{ top: -60, right: -60, width: 200, height: 200, background: `radial-gradient(circle, ${KACCENT[i]}33 0%, transparent 65%)`, filter: "blur(40px)" }} />
          <CardEyebrow label={c.label} refTag={c.refTag} accent={KACCENT[i]} dark={true} />
          <div className="relative px-5 pt-4 pb-2">
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <ClearAvatar initials={INITIALS_W[i]} bg={BG_W[i]} size={36} />
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-bold text-white truncate">{NAMES_W[i]}</div>
                <div className="text-[10.5px] text-white/55 mt-0.5" style={{ fontFamily: "ui-monospace, monospace" }}>{SUBS_W[i]}</div>
              </div>
              <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.6, repeat: Infinity }} className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ color: KACCENT[i], background: `${KACCENT[i]}22` }}>LIVE</motion.div>
            </div>
          </div>
          <div className="relative px-5 pb-5 pt-4 mt-auto">
            <div className="font-display leading-[1.12] mb-4 text-white" style={{ fontSize: "17px", fontWeight: 600, letterSpacing: "-0.022em" }}>
              {c.titlePre}{" "}
              <span style={{ color: KACCENT[i], fontStyle: "italic", fontWeight: 500, fontFamily: "ui-serif, Georgia, serif" }}>{c.titleAccent}</span>
              {c.titleTail && <span>{c.titleTail}</span>}
            </div>
            <button className="inline-flex items-center gap-1.5 px-4 h-9 rounded-full text-[12.5px] font-semibold tracking-tight" style={{ background: "#fff", color: "#0a0a0a" }}>
              {c.cta}
              <ArrowUpRight className="w-3 h-3" strokeWidth={2.5} />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function EditorialMerchantCards() {
  const HEROES = ["$0.00", "Home.", "+$20", "+15%"];
  const CAPS = ["SAVING 100%", "FEE-FREE x3", "BOTH PAID", "STACKED"];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {CLEAR_CARDS.map((c, i) => (
        <motion.div
          key={c.key}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ duration: 0.55, delay: i * 0.05, ease: EASE }}
          whileHover={{
            scale: 1.08,
            y: -10,
            zIndex: 20,
            boxShadow:
              "0 1px 0 rgba(255,255,255,0.7) inset, 0 50px 110px -30px rgba(0,0,0,0.55), 0 24px 50px -20px rgba(204,120,92,0.28)",
            transition: { type: "spring", stiffness: 220, damping: 22, mass: 0.6 },
          }}
          className="relative rounded-[24px] overflow-hidden text-left flex flex-col cursor-pointer"
          style={{
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow:
              "0 1px 0 rgba(255,255,255,0.6) inset, 0 30px 80px -30px rgba(0,0,0,0.5)",
            color: "#0a0a0a",
            transformOrigin: "center center",
            willChange: "transform",
          }}
        >
          <CardEyebrow label={c.label} refTag={c.refTag} accent={APPLE_ACCENT} dark={false} />
          <div className="px-6 pt-6 pb-2">
            <span className="font-bold leading-none" style={{ fontSize: 40, fontFamily: "ui-serif, Georgia, serif", color: APPLE_ACCENT, letterSpacing: "-0.04em", fontStyle: "italic" }}>{HEROES[i]}</span>
            <div className="mt-2 text-[9.5px] font-bold tracking-[0.2em]" style={{ color: APPLE_ACCENT }}>{CAPS[i]}</div>
          </div>
          <CardFooter card={c} dark={false} />
        </motion.div>
      ))}
    </div>
  );
}

export function DashboardMixedCards() {
  type MixedAnim = { key: string; label: string; refTag: string; titlePre: string; titleAccent: string; titleTail?: string; cta: string; style: "animated"; hero: "wallet-pass" | "messages-cash" };
  type MixedScene = { key: string; label: string; refTag: string; titlePre: string; titleAccent: string; titleTail: string; cta: string; style: "scene"; img: string };
  const MIXED: (MixedAnim | MixedScene)[] = [
    { key: "fees", label: APPLE_CARDS[0].label, refTag: APPLE_CARDS[0].refTag, titlePre: APPLE_CARDS[0].titlePre, titleAccent: APPLE_CARDS[0].titleAccent, titleTail: APPLE_CARDS[0].titleTail, cta: APPLE_CARDS[0].cta, style: "animated", hero: "wallet-pass" },
    { key: "home", label: MC_PAINTED[1].label, refTag: "USD → INR", titlePre: MC_PAINTED[1].titlePre, titleAccent: MC_PAINTED[1].titleAccent, titleTail: MC_PAINTED[1].titleTail, cta: MC_PAINTED[1].cta, style: "scene", img: MC_PAINTED[1].img },
    { key: "friend", label: APPLE_CARDS[2].label, refTag: APPLE_CARDS[2].refTag, titlePre: APPLE_CARDS[2].titlePre, titleAccent: APPLE_CARDS[2].titleAccent, cta: APPLE_CARDS[2].cta, style: "animated", hero: "messages-cash" },
    { key: "boost", label: MC_PAINTED[3].label, refTag: "RANK 3", titlePre: MC_PAINTED[3].titlePre, titleAccent: MC_PAINTED[3].titleAccent, titleTail: MC_PAINTED[3].titleTail, cta: MC_PAINTED[3].cta, style: "scene", img: MC_PAINTED[3].img },
  ];
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {MIXED.map((c, i) => (
        <motion.div
          key={c.key}
          onHoverStart={() => setHoveredKey(c.key)}
          onHoverEnd={() => setHoveredKey((k) => (k === c.key ? null : k))}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ duration: 0.55, delay: i * 0.05, ease: EASE }}
          whileHover={{
            scale: 1.08,
            y: -10,
            zIndex: 20,
            boxShadow:
              "0 1px 0 rgba(255,255,255,0.7) inset, 0 50px 110px -30px rgba(0,0,0,0.55), 0 24px 50px -20px rgba(204,120,92,0.28)",
            transition: { type: "spring", stiffness: 220, damping: 22, mass: 0.6 },
          }}
          className="relative rounded-[24px] overflow-hidden text-left flex flex-col cursor-pointer"
          style={{
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow:
              "0 1px 0 rgba(255,255,255,0.6) inset, 0 30px 80px -30px rgba(0,0,0,0.5)",
            color: "#0a0a0a",
            transformOrigin: "center center",
            willChange: "transform",
          }}
        >
          <CardEyebrow label={c.label} refTag={c.refTag} accent={APPLE_ACCENT} dark={false} />
          {c.style === "animated" ? (
            <div className="relative mx-5 mt-5 rounded-2xl overflow-hidden flex items-center justify-center" style={{ aspectRatio: "1/1", background: `radial-gradient(ellipse 80% 80% at 50% 30%, #f8f8f8 0%, #eeeeee 100%)`, border: "1px solid rgba(0,0,0,0.05)", perspective: 1000 }}>
              {c.hero === "wallet-pass" && <WalletPassHero accent={APPLE_ACCENT} hovered={hoveredKey === c.key} />}
              {c.hero === "messages-cash" && <MessagesCashHero accent={APPLE_ACCENT} />}
            </div>
          ) : (
            <div className="relative mx-5 mt-5 rounded-2xl overflow-hidden bg-[#f4f4f4]" style={{ aspectRatio: "1/1" }}>
              <img src={`/illustrations/${c.img}`} alt={c.label} className="absolute inset-0 w-full h-full object-cover block" loading="lazy" />
            </div>
          )}
          <CardFooter card={c} dark={false} />
        </motion.div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   HomepageVariantPicker — live UI control that sets which card variant
   renders inside the homepage "Merchants provide liquidity" section.
   Persists to localStorage. Both /card-preview and / stay in sync.
   ════════════════════════════════════════════════════════════════════ */
export function HomepageVariantPicker() {
  const { variant, setVariant } = useMerchantCardsVariant();
  return (
    <div
      className="mb-12 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur p-4 sm:p-5"
      style={{ boxShadow: "0 24px 60px -24px rgba(0,0,0,0.7)" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-[#ff7a3d] animate-pulse" />
        <span className="text-[10px] font-bold tracking-[0.22em] text-white/55">
          HOMEPAGE MERCHANT SECTION · LIVE
        </span>
      </div>
      <div className="text-[12.5px] text-white/65 mb-4 leading-relaxed">
        Pick which card set renders on the live homepage under{" "}
        <span className="italic" style={{ fontFamily: "ui-serif, Georgia, serif" }}>
          Merchants provide liquidity.
        </span>{" "}
        Selection persists across reloads.
      </div>
      <div className="flex flex-wrap gap-2">
        {MERCHANT_CARDS_VARIANTS.map((v) => {
          const active = v.value === variant;
          return (
            <button
              key={v.value}
              onClick={() => setVariant(v.value)}
              className="px-3 py-1.5 rounded-full text-[11.5px] font-semibold tracking-tight transition-all"
              style={{
                background: active ? "#fff" : "rgba(255,255,255,0.06)",
                color: active ? "#0a0a0a" : "rgba(255,255,255,0.75)",
                border: `1px solid ${active ? "#fff" : "rgba(255,255,255,0.1)"}`,
              }}
            >
              {active && <Check className="inline w-3 h-3 mr-1 -mt-0.5" strokeWidth={3} />}
              {v.label}
            </button>
          );
        })}
      </div>
      <div className="mt-4 text-[10.5px] text-white/40">
        Active: <code className="text-white/70">{variant}</code> · See it live at{" "}
        <Link to="/" className="underline text-white/70">/</Link> (Merchants section).
      </div>
    </div>
  );
}

export function UseOnHomepageButton({ value }: { value: MerchantCardsVariant }) {
  const { variant, setVariant } = useMerchantCardsVariant();
  const active = variant === value;
  return (
    <div className="flex justify-center mt-4 mb-2">
      <button
        onClick={() => setVariant(value)}
        disabled={active}
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-tight transition-all"
        style={{
          background: active ? "rgba(255,122,61,0.18)" : "rgba(255,255,255,0.06)",
          color: active ? "#ff7a3d" : "rgba(255,255,255,0.85)",
          border: `1px solid ${active ? "rgba(255,122,61,0.55)" : "rgba(255,255,255,0.12)"}`,
        }}
      >
        {active ? (
          <>
            <Check className="w-3 h-3" strokeWidth={3} />
            Live on homepage
          </>
        ) : (
          <>Use this on homepage</>
        )}
      </button>
    </div>
  );
}
