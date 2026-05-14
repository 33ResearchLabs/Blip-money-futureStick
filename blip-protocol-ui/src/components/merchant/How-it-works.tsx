import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Radar,
  Zap,
  CheckCircle2,
  ArrowRight,
  Bell,
  Hand,
  Trophy,
  Receipt,
  Lock,
} from "lucide-react";
import { SwipeHint } from "@/components/IndexSections/SwipeHint";

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

/* ── Borderless stage (matches TrustSection style) ─────────────── */
const Stage = ({ children }: { children: React.ReactNode }) => (
  <div
    className="relative mx-auto"
    style={{ width: 260, height: 200 }}
  >
    {children}
  </div>
);

/* ── 01 — Find a new order: iPhone with order alert ───────────── */
function OrderAlertVisual() {
  return (
    <Stage>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative rounded-[22px] overflow-hidden flex flex-col items-center"
          style={{
            width: 132,
            height: 188,
            background:
              "linear-gradient(155deg, #1a1a1d 0%, #0a0a0c 50%, #050507 100%)",
            boxShadow:
              "0 30px 60px -20px rgba(0,0,0,0.55), 0 0 0 1.5px rgba(255,255,255,0.06), inset 0 0 0 1px rgba(255,255,255,0.04)",
          }}
        >
          {/* status bar */}
          <div className="w-full flex items-center justify-between px-3 pt-2">
            <span className="text-[6.5px] font-semibold text-white/80">
              9:41
            </span>
            <div className="flex items-center gap-[2px]">
              <div className="w-[7px] h-[3.5px] rounded-[1.5px] bg-white/55" />
              <div className="w-[3.5px] h-[3.5px] rounded-full bg-white/55" />
            </div>
          </div>
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-7 h-1.5 rounded-full bg-black" />

          {/* notification card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: -6 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
              repeat: Infinity,
              repeatDelay: 2.6,
              repeatType: "reverse",
            }}
            className="mt-4 mx-2 rounded-[10px] overflow-hidden"
            style={{
              width: "calc(100% - 16px)",
              background:
                "linear-gradient(160deg, rgba(255,107,53,0.22) 0%, rgba(255,107,53,0.08) 100%)",
              border: "1px solid rgba(255,107,53,0.4)",
              boxShadow:
                "0 6px 16px -6px rgba(255,107,53,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            <div className="px-2.5 py-2">
              <div className="flex items-center gap-1.5 mb-1.5">
                <motion.div
                  animate={{
                    rotate: [0, -12, 12, -6, 6, 0],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    repeatDelay: 2.4,
                  }}
                  className="w-3.5 h-3.5 rounded-full flex items-center justify-center"
                  style={{ background: ORANGE }}
                >
                  <Bell size={7} strokeWidth={2.6} className="text-white" />
                </motion.div>
                <span className="text-[6.5px] font-bold uppercase tracking-[0.18em] text-white">
                  New order
                </span>
                <span className="ml-auto text-[5.5px] font-mono text-white/45">
                  now
                </span>
              </div>
              <div className="text-[9px] font-bold font-mono text-white tabular-nums leading-tight">
                $2,400
              </div>
              <div className="text-[6.5px] text-white/55 leading-tight mt-0.5">
                USDT → AED · 3.672
              </div>
            </div>
          </motion.div>

          {/* second muted notification */}
          <div
            className="mt-1.5 mx-2 rounded-[8px] px-2 py-1.5 opacity-50"
            style={{
              width: "calc(100% - 16px)",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div className="text-[6px] font-bold uppercase tracking-[0.15em] text-white/45 mb-0.5">
              Order
            </div>
            <div className="text-[7px] font-mono text-white/55">
              $850 · USDT/INR
            </div>
          </div>

          <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[5.5px] font-mono text-white/30 tracking-wider">
            Live feed · {`{2 new}`}
          </span>
        </motion.div>
      </div>
    </Stage>
  );
}

/* ── 02 — Accept before others: tap button + WON badge ────────── */
function AcceptVisual() {
  return (
    <Stage>
      <div className="absolute inset-0 flex items-center justify-center">
        {/* WON trophy ribbon — top */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
            repeat: Infinity,
            repeatDelay: 2.6,
            repeatType: "reverse",
          }}
          className="absolute top-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,107,53,1) 0%, rgba(220,82,30,1) 100%)",
            boxShadow:
              "0 6px 18px -4px rgba(255,107,53,0.6), inset 0 1px 0 rgba(255,255,255,0.4)",
          }}
        >
          <Trophy size={9} strokeWidth={2.6} className="text-white" />
          <span className="text-[8px] font-bold uppercase tracking-[0.22em] text-white">
            Won · 1.2s
          </span>
        </motion.div>

        {/* Tap button — large glossy */}
        <motion.div
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <motion.div
            animate={{
              boxShadow: [
                `0 16px 32px -10px rgba(255,107,53,0.5), inset 0 1px 0 rgba(255,255,255,0.25)`,
                `0 16px 32px -10px rgba(255,107,53,0.8), inset 0 1px 0 rgba(255,255,255,0.25)`,
                `0 16px 32px -10px rgba(255,107,53,0.5), inset 0 1px 0 rgba(255,255,255,0.25)`,
              ],
            }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="relative rounded-[26px] flex flex-col items-center justify-center"
            style={{
              width: 130,
              height: 130,
              background:
                "linear-gradient(155deg, #ff8c5a 0%, #ff6b35 45%, #d44d1f 100%)",
            }}
          >
            {/* glossy highlight */}
            <div
              className="absolute"
              style={{
                top: 6,
                left: 6,
                right: 6,
                height: 36,
                borderRadius: 22,
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.42), rgba(255,255,255,0))",
                opacity: 0.85,
              }}
            />
            <Hand
              size={42}
              strokeWidth={1.8}
              className="text-white relative z-10"
            />
            <span className="mt-1 relative z-10 text-[9px] font-bold uppercase tracking-[0.18em] text-white drop-shadow-sm">
              Accept
            </span>

            {/* pulsing ripple */}
            <motion.span
              className="absolute inset-0 rounded-[26px] border-2"
              style={{ borderColor: ORANGE }}
              animate={{
                scale: [1, 1.18, 1],
                opacity: [0.55, 0, 0.55],
              }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
            />
          </motion.div>
        </motion.div>

        {/* Competing dots below */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.span
              key={i}
              animate={{ opacity: [0.2, 0.6, 0.2] }}
              transition={{
                duration: 1.5,
                delay: i * 0.15,
                repeat: Infinity,
              }}
              className="w-1 h-1 rounded-full bg-white/45"
            />
          ))}
          <span className="ml-1.5 text-[6.5px] font-mono uppercase tracking-[0.2em] text-white/40">
            150+ bidding
          </span>
        </div>
      </div>
    </Stage>
  );
}

/* ── 03 — Execute & settle: settled receipt with check ────────── */
function SettleReceiptVisual() {
  return (
    <Stage>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ y: [0, -3, 0], rotate: [-1.5, 1.5, -1.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="relative rounded-[14px] overflow-hidden"
          style={{
            width: 168,
            height: 188,
            background:
              "linear-gradient(170deg, #ffffff 0%, #f4f4f6 60%, #e8e8eb 100%)",
            boxShadow:
              "0 30px 50px -20px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,1)",
          }}
        >
          {/* zig-zag bottom edge (receipt look) */}
          <div
            className="absolute bottom-0 left-0 right-0 h-2"
            style={{
              background:
                "linear-gradient(135deg, transparent 25%, white 25%) -3px 0/6px 6px, linear-gradient(225deg, transparent 25%, white 25%) -3px 0/6px 6px",
              backgroundColor: "transparent",
            }}
          />

          {/* top header band */}
          <div
            className="px-3 py-2 flex items-center justify-between"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,107,53,0.12), rgba(255,107,53,0))",
              borderBottom: "1px dashed rgba(0,0,0,0.1)",
            }}
          >
            <span className="text-[7px] font-bold uppercase tracking-[0.22em] text-black/55">
              Settlement
            </span>
            <span className="text-[6.5px] font-mono text-black/35">
              #487192
            </span>
          </div>

          {/* check badge */}
          <div className="flex flex-col items-center pt-3 pb-2">
            <motion.div
              className="rounded-full flex items-center justify-center"
              style={{
                width: 44,
                height: 44,
                background:
                  "linear-gradient(155deg, rgba(255,107,53,0.18), rgba(255,107,53,0.05))",
                border: `2px solid ${ORANGE}`,
              }}
              animate={{
                boxShadow: [
                  `0 0 0 0 rgba(255,107,53,0.55)`,
                  `0 0 0 14px rgba(255,107,53,0)`,
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            >
              <CheckCircle2
                size={22}
                strokeWidth={2.6}
                style={{ color: ORANGE }}
              />
            </motion.div>
            <span className="mt-2 text-[10px] font-bold text-black tracking-tight">
              Settled
            </span>
            <span className="text-[7px] font-semibold uppercase tracking-[0.18em] text-black/40">
              On-chain
            </span>
          </div>

          {/* details rows */}
          <div className="mx-3 mt-1 space-y-1.5 text-[7px]">
            <div className="flex items-center justify-between">
              <span className="text-black/40">Amount</span>
              <span className="font-mono font-bold text-black tabular-nums">
                $2,400
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-black/40">Margin</span>
              <motion.span
                animate={{ opacity: [0.85, 1, 0.85] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="font-mono font-bold tabular-nums"
                style={{ color: ORANGE }}
              >
                +$18.20
              </motion.span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-black/40">Tx</span>
              <span className="font-mono text-black/55 tabular-nums">
                0x7a…4f3b
              </span>
            </div>
          </div>

          {/* chain confirmations */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{ backgroundColor: [ORANGE, "#d44d1f", ORANGE] }}
                transition={{
                  duration: 1.6,
                  delay: i * 0.18,
                  repeat: Infinity,
                }}
                className="flex-1 h-1 rounded-full"
                style={{ background: ORANGE }}
              />
            ))}
            <Lock
              size={8}
              strokeWidth={2.2}
              className="ml-1 text-black/35"
            />
          </div>
        </motion.div>
      </div>
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
  title: string;
  subtitle: string;
  desc: string;
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
      className="group relative flex flex-col h-full overflow-hidden rounded-[2rem]
        border border-black/10 dark:border-white/[0.08]
        bg-white/80 dark:bg-[#0a0a0c]
        backdrop-blur-xl p-7
        transition-all duration-500
        hover:shadow-[0_30px_80px_rgba(255,107,53,0.18)]
        hover:-translate-y-2
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

      <div className="absolute top-5 right-5 flex items-center gap-1.5">
        <span
          className="text-[9px] font-mono tracking-[0.18em] uppercase"
          style={{ color: hovered ? ORANGE : "rgba(255,255,255,0.35)" }}
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

      {/* Visual — rendered, premium */}
      <div className="relative mt-auto rounded-2xl overflow-hidden bg-black/[0.02] dark:bg-[#050507] border border-black/[0.04] dark:border-white/[0.04]">
        <Visual />
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
          style={{ color: ORANGE }}
        >
          Three taps. One settled trade.
        </motion.p>
        <h2 className="text-4xl md:text-6xl font-bold text-black dark:text-white tracking-tight">
          How merchants execute on Blip
        </h2>
      </div>

      <div className="relative">
        <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {STEPS.map((s, i) => (
            <div key={s.step} className="snap-start shrink-0 w-[82%] md:w-auto h-auto">
              <StepCard
                step={s.step}
                title={s.title}
                subtitle={s.subtitle}
                desc={s.desc}
                icon={s.icon}
                delay={0.2 + i * 0.1}
                Visual={VISUALS[i]}
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
