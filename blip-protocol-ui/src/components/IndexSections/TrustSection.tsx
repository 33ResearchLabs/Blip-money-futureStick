import { memo } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  CheckCircle2,
  FileText,
  Map,
  ArrowRight,
  Lock,
  Search,
  Box,
  Server,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SwipeHint } from "./SwipeHint";

const EASE = [0.16, 1, 0.3, 1] as const;
const ORANGE = "#ff6b35";

/* ─────────────────────────────────────────────────────────────
   Inline visuals — on-brand mockups (no stock images)
   Each accepts `large: boolean` to render at one of two sizes.
   Large: 300 × 140  |  Small: 100 × 72
───────────────────────────────────────────────────────────── */

/* Borderless, Apple-style stage — no frame, no background, just the visual */
const VisualStage = ({
  large,
  children,
}: {
  large: boolean;
  children: React.ReactNode;
}) => (
  <div
    className="relative"
    style={{
      width: large ? 300 : 110,
      height: large ? 180 : 90,
    }}
  >
    {children}
  </div>
);

/* 01 — Deterministic settlement: iPhone mockup, large, premium */
function SettlementVisual({ large }: { large: boolean }) {
  const phoneW = large ? 122 : 58;
  const phoneH = large ? 176 : 84;
  return (
    <VisualStage large={large}>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative rounded-[22px] overflow-hidden flex flex-col items-center"
          style={{
            width: phoneW,
            height: phoneH,
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
          {/* dynamic island */}
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-7 h-1.5 rounded-full bg-black" />

          {/* check */}
          <motion.div
            className="mt-5 flex items-center justify-center rounded-full"
            style={{
              width: large ? 38 : 22,
              height: large ? 38 : 22,
              border: `2px solid ${ORANGE}`,
              background:
                "radial-gradient(circle, rgba(255,107,53,0.18) 0%, rgba(255,107,53,0.04) 60%, transparent 100%)",
            }}
            animate={{
              boxShadow: [
                `0 0 0 0 rgba(255,107,53,0.55)`,
                `0 0 0 ${large ? 14 : 8}px rgba(255,107,53,0)`,
              ],
            }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
          >
            <CheckCircle2
              size={large ? 20 : 12}
              strokeWidth={2.6}
              style={{ color: ORANGE }}
            />
          </motion.div>

          {large && (
            <>
              <span className="mt-3 text-[9px] font-semibold text-white text-center leading-tight">
                Settlement
                <br />
                successful
              </span>
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[6px] font-mono text-white/45 whitespace-nowrap tracking-tight">
                Tx 0x713…a9b8
              </span>
            </>
          )}
        </motion.div>
      </div>
    </VisualStage>
  );
}

/* 02 — Escrow: large brushed-steel padlock with USDT display */
function EscrowVisual({ large }: { large: boolean }) {
  const bodyW = large ? 110 : 60;
  const bodyH = large ? 100 : 56;
  const shackleW = large ? 60 : 34;
  const shackleH = large ? 50 : 28;
  return (
    <VisualStage large={large}>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          {/* shackle (top arch) */}
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              top: large ? -38 : -22,
              width: shackleW,
              height: shackleH,
            }}
          >
            <svg viewBox="0 0 60 50" width="100%" height="100%">
              <defs>
                <linearGradient id="shackleG" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="#d8d8da" />
                  <stop offset="55%" stopColor="#8a8a8c" />
                  <stop offset="100%" stopColor="#3c3c3e" />
                </linearGradient>
              </defs>
              <path
                d="M9 50 L9 22 A21 21 0 0 1 51 22 L51 50"
                fill="none"
                stroke="url(#shackleG)"
                strokeWidth="9"
                strokeLinecap="round"
              />
              {/* inner highlight */}
              <path
                d="M11 50 L11 22 A19 19 0 0 1 49 22 L49 50"
                fill="none"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1"
              />
            </svg>
          </div>

          {/* body */}
          <div
            className="relative rounded-[14px] overflow-hidden flex flex-col items-center justify-center"
            style={{
              width: bodyW,
              height: bodyH,
              background:
                "linear-gradient(155deg, #2a2a2c 0%, #1d1d1f 50%, #0d0d0f 100%)",
              boxShadow:
                "0 25px 40px -18px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -2px 4px rgba(0,0,0,0.5)",
            }}
          >
            {/* top metallic highlight */}
            <div
              className="absolute inset-x-3 top-1 h-[1px]"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)",
              }}
            />

            {large ? (
              <>
                <motion.div
                  animate={{ opacity: [0.85, 1, 0.85] }}
                  transition={{ duration: 2.4, repeat: Infinity }}
                  className="rounded-md flex flex-col items-center justify-center py-1.5 px-4"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.25))",
                    border: "1px solid rgba(255,255,255,0.04)",
                    boxShadow:
                      "inset 0 1px 4px rgba(0,0,0,0.6), 0 0 8px rgba(61,220,132,0.18)",
                  }}
                >
                  <span
                    className="text-[16px] font-bold font-mono tabular-nums tracking-tight"
                    style={{ color: "#a5f1c5" }}
                  >
                    600 USDT
                  </span>
                  <span className="text-[6.5px] font-semibold uppercase tracking-[0.22em] text-white/45 mt-0.5">
                    Secured in escrow
                  </span>
                </motion.div>

                {/* keyhole */}
                <div
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-black/85"
                  style={{ boxShadow: "0 0 0 2px rgba(0,0,0,0.4)" }}
                />
              </>
            ) : (
              <Lock
                size={20}
                strokeWidth={2}
                className="text-white/80"
              />
            )}
          </div>
        </motion.div>
      </div>
    </VisualStage>
  );
}

/* 03 — On-chain verification: large glass cube w/ blocks + magnifier */
function VerificationVisual({ large }: { large: boolean }) {
  const cubeSize = large ? 138 : 70;
  return (
    <VisualStage large={large}>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ y: [0, -3, 0], rotate: [0, 1.5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="relative rounded-[20px] overflow-hidden"
          style={{
            width: cubeSize,
            height: cubeSize,
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.78) 0%, rgba(220,225,255,0.32) 45%, rgba(255,255,255,0.6) 100%)",
            boxShadow:
              "0 30px 50px -18px rgba(0,0,0,0.22), inset 0 0 28px rgba(255,255,255,0.45), inset 0 1px 0 rgba(255,255,255,0.85)",
            backdropFilter: "blur(8px)",
          }}
        >
          {/* top highlight */}
          <div
            className="absolute"
            style={{
              top: 6,
              left: 6,
              right: 6,
              height: large ? 30 : 14,
              borderRadius: 14,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0))",
              opacity: 0.8,
            }}
          />
          {/* corner highlight */}
          <div
            className="absolute"
            style={{
              top: 8,
              left: 8,
              width: large ? 16 : 8,
              height: large ? 16 : 8,
              borderRadius: 50,
              background:
                "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 70%)",
              opacity: 0.9,
            }}
          />

          {/* blocks inside */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="grid grid-cols-2"
              style={{ gap: large ? 6 : 3 }}
            >
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    opacity: [0.55, 1, 0.55],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.25,
                    repeat: Infinity,
                  }}
                  className="rounded-[4px] flex items-center justify-center"
                  style={{
                    width: large ? 26 : 13,
                    height: large ? 26 : 13,
                    background:
                      "linear-gradient(135deg, rgba(120,119,255,0.25), rgba(120,119,255,0.08))",
                    border: "1px solid rgba(120,119,255,0.5)",
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.5), 0 2px 4px rgba(120,119,255,0.18)",
                  }}
                >
                  <Box
                    size={large ? 14 : 7}
                    strokeWidth={1.8}
                    style={{ color: "#5d5cff" }}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* magnifier — floating outside the cube bottom-right */}
          <motion.div
            initial={{ x: 0, y: 0 }}
            animate={{
              x: [-(large ? 10 : 5), large ? 14 : 7, -(large ? 10 : 5)],
              y: [large ? 8 : 4, -(large ? 5 : 3), large ? 8 : 4],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute"
            style={{
              right: large ? -8 : -4,
              bottom: large ? -8 : -4,
            }}
          >
            <div
              className="rounded-full flex items-center justify-center"
              style={{
                width: large ? 40 : 22,
                height: large ? 40 : 22,
                background:
                  "linear-gradient(155deg, rgba(255,255,255,0.95), rgba(235,235,250,0.85))",
                border: "3px solid #5d5cff",
                boxShadow:
                  "0 8px 18px -4px rgba(93,92,255,0.4), inset 0 1px 0 rgba(255,255,255,0.9)",
              }}
            >
              <Search
                size={large ? 18 : 10}
                strokeWidth={2.6}
                style={{ color: "#5d5cff" }}
              />
            </div>
            {/* handle */}
            <div
              className="absolute"
              style={{
                right: large ? -6 : -3,
                bottom: large ? -6 : -3,
                width: large ? 14 : 7,
                height: 3,
                borderRadius: 2,
                background:
                  "linear-gradient(90deg, #5d5cff, rgba(93,92,255,0.5))",
                transform: "rotate(45deg)",
                transformOrigin: "left",
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </VisualStage>
  );
}

/* 04 — System isolation: large server rack stack + embossed shield */
function IsolationVisual({ large }: { large: boolean }) {
  const rackW = large ? 134 : 70;
  const rackH = large ? 32 : 16;
  return (
    <VisualStage large={large}>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative flex items-center"
          style={{ gap: large ? 12 : 6 }}
        >
          {/* server stack */}
          <div className="flex flex-col" style={{ gap: large ? 5 : 2 }}>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.92, 1, 0.92] }}
                transition={{
                  duration: 2,
                  delay: i * 0.3,
                  repeat: Infinity,
                }}
                className="relative rounded-[6px] flex items-center"
                style={{
                  width: rackW,
                  height: rackH,
                  padding: large ? "0 10px" : "0 6px",
                  background:
                    "linear-gradient(165deg, #2a2a2c 0%, #1a1a1c 50%, #0d0d0f 100%)",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.16), inset 0 -1px 0 rgba(0,0,0,0.5), 0 8px 16px -8px rgba(0,0,0,0.45)",
                }}
              >
                {/* status LED */}
                <motion.span
                  animate={{ opacity: [1, 0.25, 1] }}
                  transition={{
                    duration: 1.4,
                    delay: i * 0.35,
                    repeat: Infinity,
                  }}
                  className="rounded-full"
                  style={{
                    width: large ? 5 : 3,
                    height: large ? 5 : 3,
                    background: "#3ddc84",
                    boxShadow: "0 0 6px rgba(61,220,132,0.7)",
                  }}
                />
                {/* drive bays */}
                {large && (
                  <div className="ml-3 flex" style={{ gap: 3 }}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <div
                        key={j}
                        style={{
                          width: 6,
                          height: 14,
                          borderRadius: 1.5,
                          background:
                            "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(0,0,0,0.4))",
                          border: "1px solid rgba(0,0,0,0.5)",
                        }}
                      />
                    ))}
                  </div>
                )}
                {/* badge */}
                <div className="ml-auto flex items-center gap-1">
                  {large && (
                    <span className="text-[6.5px] font-mono uppercase tracking-[0.18em] text-white/30">
                      node {i + 1}
                    </span>
                  )}
                  <Server
                    size={large ? 11 : 7}
                    strokeWidth={1.8}
                    className="text-white/45"
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Embossed shield overlay */}
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
            style={{
              width: large ? 64 : 36,
              height: large ? 76 : 42,
            }}
          >
            <svg
              viewBox="0 0 64 76"
              width="100%"
              height="100%"
              className="drop-shadow-[0_12px_22px_rgba(0,0,0,0.4)]"
            >
              <defs>
                <linearGradient id="shieldBody" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3a3a3c" />
                  <stop offset="55%" stopColor="#1d1d1f" />
                  <stop offset="100%" stopColor="#050507" />
                </linearGradient>
                <linearGradient id="shieldRim" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.45)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </linearGradient>
              </defs>
              <path
                d="M32 3 L58 13 L58 38 C58 56 46 70 32 73 C18 70 6 56 6 38 L6 13 Z"
                fill="url(#shieldBody)"
                stroke="url(#shieldRim)"
                strokeWidth="1.5"
              />
              {/* inner highlight */}
              <path
                d="M32 7 L54 15.5 L54 38 C54 53 44 65 32 68"
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1"
              />
              {/* check */}
              <path
                d="M20 38 L29 47 L46 28"
                fill="none"
                stroke="#ffffff"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </VisualStage>
  );
}

const VISUALS = {
  settlement: SettlementVisual,
  escrow: EscrowVisual,
  verification: VerificationVisual,
  isolation: IsolationVisual,
} as const;

type VisualKey = keyof typeof VISUALS;

/* ============================================
   SECTION: TRUST & ARCHITECTURE
   ============================================ */

const trustCards: {
  icon: React.ElementType;
  title: string;
  desc: string;
  tag: string;
  color: string;
  visual: VisualKey;
}[] = [
  {
    icon: Shield,
    title: "Deterministic settlement",
    desc: "No ambiguity. No manual intervention. Every outcome predefined by protocol rules.",
    tag: "Settlement",
    color: ORANGE,
    visual: "settlement",
  },
  {
    icon: CheckCircle2,
    title: "Escrow + execution guarantees",
    desc: "Funds locked before execution. Enforced by smart contracts, not promises.",
    tag: "Guarantees",
    color: "#00e599",
    visual: "escrow",
  },
  {
    icon: FileText,
    title: "On-chain verification",
    desc: "Every transaction verifiable on-chain. Full transparency, zero trust required.",
    tag: "Verification",
    color: "#7877ff",
    visual: "verification",
  },
  {
    icon: Map,
    title: "System isolation",
    desc: "No single point of failure. Each component operates independently.",
    tag: "Resilience",
    color: ORANGE,
    visual: "isolation",
  },
];

const TrustSection = () => {
  return (
    <section className="relative py-20 md:py-36 bg-[#f5f5f7] dark:bg-[#111] overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-6">
        <motion.h2
          className="heading-h2 text-black dark:text-white text-center md:text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
          style={{ marginBottom: 48 }}
        >
          Built to not break.
        </motion.h2>

        <div className="relative">
          <div className="-mx-5 md:mx-0 px-5 md:px-0 flex md:grid md:grid-cols-2 gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {trustCards.map((card, i) => {
              const Visual = VISUALS[card.visual];
              return (
                <div
                  key={card.title}
                  className="snap-start shrink-0 w-[88%] md:w-auto group relative rounded-3xl overflow-hidden transition-transform duration-500 hover:scale-[1.01] min-h-[260px] sm:min-h-[280px]"
                  style={{
                    background: "rgba(255,255,255,0.8)",
                  }}
                >
                  <div className="absolute inset-0 bg-transparent dark:bg-[#1a1a1a] rounded-3xl" />

                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 70% 50%, ${card.color}10, transparent 60%)`,
                    }}
                  />

                  {/* Apple-style: text left, visual right, both filling height */}
                  <div className="relative z-10 h-full flex items-center gap-4 sm:gap-6 p-7 sm:p-9">
                    <div className="flex-1 min-w-0">
                      <span
                        className="text-[11px] uppercase tracking-[0.15em] font-semibold inline-block mb-3"
                        style={{ color: card.color }}
                      >
                        {card.tag}
                      </span>
                      <h3
                        className="text-black dark:text-white mb-2 tracking-tight"
                        style={{
                          fontSize: "22px",
                          fontWeight: 600,
                          letterSpacing: "-0.02em",
                          lineHeight: 1.18,
                        }}
                      >
                        {card.title}
                      </h3>
                      <p
                        className="text-black/65 dark:text-white/60"
                        style={{
                          fontSize: "14px",
                          lineHeight: 1.5,
                        }}
                      >
                        {card.desc}
                      </p>
                    </div>

                    {/* Visual takes the right half, vertically centered */}
                    <div className="shrink-0 flex items-center justify-center">
                      <Visual large={true} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <SwipeHint />
        </div>

        <div className="flex justify-start mt-10">
          <Link
            to="/whitepaper"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors"
            style={{ color: ORANGE }}
          >
            Read the whitepaper
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default memo(TrustSection);
