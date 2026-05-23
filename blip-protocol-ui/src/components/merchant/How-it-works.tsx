import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Radar,
  Zap,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { SwipeHint } from "@/components/IndexSections/SwipeHint";
import { EditableText } from "@/components/dashboard/Editable";

const ORANGE = "#ff6b35";

const STEPS = [
  {
    step: 1,
    title: "Find a new order",
    subtitle: "Live order feed.",
    icon: Radar,
    desc: "Incoming user requests stream into your dashboard the moment they're created — filtered by your corridors, limits, and risk profile.",
    accent: ORANGE,
  },
  {
    step: 2,
    title: "Accept before others",
    subtitle: "First merchant wins.",
    icon: Zap,
    desc: "150+ merchants compete on every order. The fastest competitive bid wins — one tap to lock it in.",
    accent: ORANGE,
  },
  {
    step: 3,
    title: "Execute & settle",
    subtitle: "Escrow handles the rest.",
    icon: CheckCircle2,
    desc: "Funds release the moment fiat lands. On-chain proof, deterministic settlement, no chargebacks.",
    accent: ORANGE,
  },
] as const;

/* ── Cartoon scene stage — square, white surface like the carousel cards ── */
const Stage = ({ children }: { children: React.ReactNode }) => (
  <div
    className="relative w-full overflow-hidden bg-white"
    style={{ aspectRatio: "1/1" }}
  >
    {children}
  </div>
);

/* shared cartoon palette */
const SKIN = "#f4c79b";
const HAIR = "#3a2618";
const INK = "#0a0a0a";
const PAPER = "#fff";
const ACCENT = "#ff6b35";

/* ── 01 — Merchant at desk, laptop shows incoming order ───────── */
function OrderAlertVisual() {
  return (
    <Stage>
      <svg viewBox="0 0 300 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <rect width="300" height="300" fill={PAPER} />
        {/* desk */}
        <rect x="20" y="220" width="260" height="8" fill={INK} />
        <rect x="32" y="228" width="6" height="40" fill={INK} opacity="0.85" />
        <rect x="262" y="228" width="6" height="40" fill={INK} opacity="0.85" />
        <ellipse cx="150" cy="278" rx="120" ry="5" fill={INK} opacity="0.08" />
        {/* coffee mug */}
        <g>
          <rect x="46" y="200" width="20" height="18" rx="2" fill={INK} />
          <ellipse cx="56" cy="200" rx="10" ry="3" fill="#5a3a1a" />
          <path d="M 66 204 q 6 0 6 6 q 0 6 -6 6" stroke={INK} strokeWidth="2" fill="none" />
          <motion.path d="M 50 196 q -2 -6 2 -10 q -2 -6 2 -10" stroke={INK} strokeOpacity="0.35" strokeWidth="1.4" fill="none" strokeLinecap="round"
            animate={{ y: [0, -3, 0], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }} />
        </g>
        {/* Laptop */}
        <g>
          <path d="M 90 218 L 220 218 L 230 226 L 80 226 Z" fill={INK} />
          <rect x="98" y="120" width="114" height="100" rx="4" fill={INK} />
          <rect x="103" y="125" width="104" height="84" rx="2" fill={PAPER} />
          <text x="155" y="142" textAnchor="middle" fontSize="7" fontWeight="700" fill={INK} letterSpacing="1.5">BLIP MARKET</text>
          <line x1="113" y1="148" x2="197" y2="148" stroke={INK} strokeOpacity="0.15" strokeWidth="1" />
          <text x="155" y="162" textAnchor="middle" fontSize="6" fontWeight="700" fill={INK} opacity="0.55" letterSpacing="1.2">NEW ORDER</text>
          <motion.text x="155" y="186" textAnchor="middle" fontSize="20" fontFamily="ui-serif, Georgia" fontWeight="800" fill={ACCENT}
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>$2,400</motion.text>
          <rect x="125" y="194" width="60" height="10" rx="5" fill={INK} />
          <text x="155" y="201" textAnchor="middle" fontSize="5" fontWeight="800" fill={PAPER} letterSpacing="1">USDT → AED</text>
        </g>
        {/* Character behind laptop */}
        <g>
          <circle cx="150" cy="80" r="26" fill={SKIN} />
          <path d="M 122 78 Q 120 56 138 50 Q 146 42 158 48 Q 174 50 178 70 Q 180 80 174 80 L 168 76 Q 162 64 154 66 Q 144 66 138 74 Q 132 78 122 78 Z" fill={HAIR} />
          <circle cx="141" cy="82" r="2" fill={INK} />
          <circle cx="159" cy="82" r="2" fill={INK} />
          <ellipse cx="138" cy="90" rx="3" ry="1.6" fill="#ff9a8c" opacity="0.5" />
          <ellipse cx="162" cy="90" rx="3" ry="1.6" fill="#ff9a8c" opacity="0.5" />
          <path d="M 142 92 Q 150 98 158 92" stroke={INK} strokeWidth="1.4" fill="none" strokeLinecap="round" />
          <rect x="143" y="104" width="14" height="8" fill={SKIN} />
          <path d="M 116 112 L 184 112 L 192 122 L 108 122 Z" fill="#4a7fb8" />
        </g>
        {/* Notification ping bubble */}
        <motion.g
          animate={{ y: [0, -4, 0], opacity: [1, 0.7, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
          <circle cx="240" cy="68" r="18" fill={ACCENT} />
          <path d="M 230 82 L 235 92 L 244 84 Z" fill={ACCENT} />
          <text x="240" y="73" textAnchor="middle" fontSize="9" fontWeight="800" fill={PAPER}>NEW</text>
          <text x="240" y="82" textAnchor="middle" fontSize="6" fontWeight="700" fill={PAPER}>ORDER</text>
        </motion.g>
        {/* Sparkles */}
        {[{x:78,y:140,d:0},{x:230,y:160,d:0.5},{x:60,y:104,d:1}].map((s,i)=>(
          <motion.circle key={i} cx={s.x} cy={s.y} r="2.5" fill={ACCENT}
            animate={{ scale: [0.6, 1.4, 0.6], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.8, delay: s.d, repeat: Infinity, ease: "easeInOut" }} />
        ))}
      </svg>
    </Stage>
  );
}

/* ── 02 — Rocket race: first merchant wins ─────────────────────── */
function AcceptVisual() {
  return (
    <Stage>
      <svg viewBox="0 0 300 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <rect width="300" height="300" fill={INK} />
        {/* stars */}
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
        {/* WON 1.2s pill */}
        <motion.g
          animate={{ opacity: [1, 0.55, 1], scale: [1, 1.08, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "232px 96px" }}>
          <rect x="198" y="82" width="68" height="24" rx="12" fill={ACCENT} />
          <text x="232" y="98" textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily="ui-serif, Georgia">WON · 1.2s</text>
        </motion.g>
        <path d="M 150 60 Q 150 30 232 94" stroke={ACCENT} strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="3 4" fill="none" />
        {/* Lagging competitors */}
        <g opacity="0.6">
          <text x="36" y="280" fontSize="7" fontWeight="700" fill={PAPER} opacity="0.55" letterSpacing="1.5">150+ MERCHANTS BIDDING</text>
        </g>
        {[40, 56, 72, 88, 104].map((x, i) => (
          <motion.circle key={i} cx={x} cy={262} r="2" fill={ACCENT} opacity="0.45"
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 1.4, delay: i * 0.15, repeat: Infinity }} />
        ))}
      </svg>
    </Stage>
  );
}

/* ── 03 — Cash settles into the merchant's house ───────────────── */
function SettleReceiptVisual() {
  return (
    <Stage>
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
        {/* sun */}
        <circle cx="44" cy="44" r="14" fill={ACCENT} />
        <motion.circle cx="44" cy="44" r="14" fill="none" stroke={ACCENT} strokeOpacity="0.4"
          animate={{ r: [14, 22, 14], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }} />
        {/* SETTLED badge */}
        <motion.g
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}>
          <rect x="14" y="86" width="72" height="22" rx="11" fill={INK} />
          <circle cx="26" cy="97" r="6" fill={ACCENT} />
          <path d="M 23 97 L 26 100 L 30 95" stroke={INK} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <text x="58" y="101" textAnchor="middle" fontSize="9" fontWeight="800" fill={PAPER}>SETTLED</text>
        </motion.g>
      </svg>
    </Stage>
  );
}

const VISUALS = [OrderAlertVisual, AcceptVisual, SettleReceiptVisual];

/* ------------------------------------------------------------------ */
/* Card                                                                */
/* ------------------------------------------------------------------ */
function StepCard({
  step,
  title,
  subtitle,
  desc,
  icon: Icon,
  delay,
  Visual,
}: {
  step: number;
  title: React.ReactNode;
  subtitle: React.ReactNode;
  desc: React.ReactNode;
  icon: React.ElementType;
  delay: number;
  Visual: React.ComponentType;
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
    setRotate({ x: (y - r.height / 2) / 35, y: (r.width / 2 - x) / 35 });
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
      className="group relative flex flex-col h-full overflow-hidden rounded-2xl
        border border-black/10
        bg-white
        p-5
        transition-all duration-500
        hover:shadow-[0_20px_50px_rgba(255,107,53,0.15)]
        hover:-translate-y-1.5
        hover:border-[#ff6b35]/30"
      style={{
        animation: `fadeInUp 1s cubic-bezier(0.2,0.8,0.2,1) ${delay}s both`,
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(420px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,107,53,0.10), transparent 45%)`,
        }}
      />

      <div className="absolute top-4 right-4 flex items-center gap-1.5">
        <span
          className="text-[9px] font-mono tracking-[0.18em] uppercase"
          style={{ color: hovered ? ORANGE : "rgba(0,0,0,0.4)" }}
        >
          Step
        </span>
        <span
          className="text-[10px] font-bold font-mono"
          style={{ color: ORANGE }}
        >
          0{step}
        </span>
      </div>

      <div className="relative z-10 flex flex-col gap-3 mb-4">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-300 ${
            hovered
              ? "scale-110 border-[#ff6b35]/40 bg-[#ff6b35]/10 text-[#ff6b35]"
              : "border-black/10 bg-black/[0.04] text-black/70"
          }`}
        >
          <Icon size={18} />
        </div>
        <div>
          <h3 className="text-base font-bold text-black mb-1 tracking-tight">
            {title}
          </h3>
          <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#ff6b35] mb-1.5">
            {subtitle}
          </p>
          <p className="text-[13px] leading-snug text-black/65">
            {desc}
          </p>
        </div>
      </div>

      {/* Visual */}
      <div className="relative mt-auto rounded-xl overflow-hidden border border-black/[0.06]">
        <Visual />
        <div className="absolute bottom-0 inset-x-0 h-5 border-t border-black/[0.06] bg-white/80 backdrop-blur-sm flex items-center justify-between px-2.5">
          <span className="text-[8px] font-mono text-black/45">
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

  return (
    <section
      ref={ref}
      className="relative bg-white"
    >
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-32">
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
          style={{ color: ORANGE }}
        >
          <EditableText id="merchant.howitworks.eyebrow" default="Three taps. One settled trade." as="span" />
        </motion.p>
        <h2 className="text-4xl md:text-6xl font-bold text-black tracking-tight">
          <EditableText id="merchant.howitworks.title" default="How merchants execute on Blip" as="span" />
        </h2>
      </div>

      <div className="relative">
        <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-5 max-w-5xl mx-auto overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {STEPS.map((s, i) => (
            <div key={s.step} className="snap-start shrink-0 w-[72%] md:w-auto h-auto">
              <StepCard
                step={s.step}
                title={<EditableText id={`merchant.howitworks.step${s.step}.title`} default={s.title} as="span" />}
                subtitle={<EditableText id={`merchant.howitworks.step${s.step}.subtitle`} default={s.subtitle} as="span" />}
                desc={<EditableText id={`merchant.howitworks.step${s.step}.desc`} default={s.desc} as="span" />}
                icon={s.icon}
                delay={0.2 + i * 0.1}
                Visual={VISUALS[i]}
              />
            </div>
          ))}
        </div>
        <SwipeHint />
      </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
