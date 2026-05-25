import { memo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { IllustrationCard } from "./sceneArt";

const EASE = [0.16, 1, 0.3, 1] as const;

const ROUTES = [
  { from: { x: 22, y: 42 }, to: { x: 72, y: 58 } },
  { from: { x: 49, y: 38 }, to: { x: 64, y: 52 } },
  { from: { x: 82, y: 62 }, to: { x: 72, y: 58 } },
];

const NODES = [
  { x: 22, y: 42 },
  { x: 49, y: 38 },
  { x: 64, y: 52 },
  { x: 72, y: 58 },
  { x: 82, y: 62 },
];

/* Big premium phone-payment moment, foreground hero-style art */
function PaymentMomentArt() {
  return (
    <div className="relative w-full max-w-[560px] mx-auto" style={{ aspectRatio: "5 / 6" }}>
      {/* Soft warm glow on the cream */}
      <div
        className="absolute -inset-10 rounded-[60px] blur-3xl opacity-60"
        style={{
          background:
            "radial-gradient(60% 50% at 60% 40%, rgba(204,120,92,0.18), transparent 70%)",
        }}
      />

      {/* Faint global routes — sits behind everything */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-[0.5]" preserveAspectRatio="none">
        <defs>
          <linearGradient id="route-light" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#cc785c" stopOpacity="0" />
            <stop offset="50%" stopColor="#cc785c" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#cc785c" stopOpacity="0" />
          </linearGradient>
          <pattern id="grid-light" width="3" height="3" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.25" fill="rgba(0,0,0,0.06)" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid-light)" />
        {ROUTES.map((r, i) => {
          const mx = (r.from.x + r.to.x) / 2;
          const my = (r.from.y + r.to.y) / 2 - 14;
          const d = `M ${r.from.x} ${r.from.y} Q ${mx} ${my} ${r.to.x} ${r.to.y}`;
          return (
            <g key={i}>
              <path d={d} fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth="0.2" />
              <motion.path
                d={d}
                fill="none"
                stroke="url(#route-light)"
                strokeWidth="0.45"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2.4, delay: 0.3 + i * 0.4, ease: EASE }}
              />
            </g>
          );
        })}
        {NODES.map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r="0.55" fill="#cc785c" />
            <motion.circle
              cx={n.x}
              cy={n.y}
              r="1.8"
              fill="none"
              stroke="#cc785c"
              strokeWidth="0.18"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 0.4, 0], scale: [0.4, 2, 2.6] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.45 }}
              style={{ transformOrigin: `${n.x}px ${n.y}px` }}
            />
          </g>
        ))}
      </svg>

      {/* The phone — centerpiece, hero foreground */}
      <motion.div
        initial={{ opacity: 0, y: 24, rotate: -3 }}
        whileInView={{ opacity: 1, y: 0, rotate: -2.5 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 1.2, ease: EASE }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] md:w-[300px]"
        style={{ transform: "translate(-50%, -50%) rotate(-2.5deg)" }}
      >
        <div
          className="relative rounded-[44px] bg-gradient-to-b from-[#1a1411] to-black p-[3px]"
          style={{
            boxShadow:
              "0 60px 120px -30px rgba(80,40,20,0.35), 0 30px 60px -15px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.04)",
            aspectRatio: "9 / 19",
          }}
        >
          <div className="absolute inset-[3px] rounded-[41px] overflow-hidden bg-[#0d0a08]">
            {/* status bar */}
            <div className="absolute top-0 inset-x-0 h-7 flex items-center justify-between px-6 z-10">
              <span className="text-[10px] font-mono text-white/55">9:41</span>
              <div className="w-16 h-4 rounded-full bg-black absolute left-1/2 -translate-x-1/2 top-1.5 border border-white/[0.04]" />
              <div className="flex items-center gap-1">
                <div className="w-3.5 h-1.5 rounded-sm bg-white/70" />
              </div>
            </div>

            <div className="absolute inset-x-5 top-12">
              <div
                className="text-[9px] font-bold tracking-[0.32em] uppercase mb-3"
                style={{ color: "#cc785c" }}
              >
                Sending
              </div>
              <div className="text-[13px] text-white/55 mb-1">To Priya in Mumbai</div>
              <div className="flex items-baseline gap-1 mb-5">
                <span className="text-[44px] font-semibold tracking-[-0.03em] tabular-nums text-white leading-none">
                  $2,400
                </span>
                <span className="text-[12px] text-white/40 font-mono">.00</span>
              </div>

              {/* Animated route progress */}
              <div className="relative h-[2px] rounded-full bg-white/[0.08] overflow-hidden mb-3">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, #cc785c 30%, #ffa473 70%, transparent)",
                  }}
                  initial={{ width: "0%" }}
                  whileInView={{ width: "82%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 2.4, delay: 0.6, ease: EASE }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] mb-7">
                <span className="text-white/50 font-mono">New York</span>
                <span className="text-[#cc785c] font-mono">routing · 12s</span>
                <span className="text-white/50 font-mono">Mumbai</span>
              </div>

              <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] p-3 mb-3">
                <div className="flex items-center justify-between text-[10.5px]">
                  <span className="text-white/45">Rate</span>
                  <span className="text-white font-mono">₹83.42 / $1</span>
                </div>
                <div className="flex items-center justify-between text-[10.5px] mt-1.5">
                  <span className="text-white/45">She receives</span>
                  <span className="text-white font-semibold font-mono">₹2,00,160</span>
                </div>
                <div className="flex items-center justify-between text-[10.5px] mt-1.5 pt-1.5 border-t border-white/[0.06]">
                  <span className="text-[#cc785c]">You save vs bank</span>
                  <span className="text-[#cc785c] font-semibold font-mono">+$32</span>
                </div>
              </div>

              <div className="rounded-full bg-white text-black text-[12px] font-semibold tracking-tight py-3 text-center mt-2">
                Confirm send
              </div>
            </div>
          </div>
        </div>

        {/* Floating "Received" toast — second piece of foreground art */}
        <motion.div
          initial={{ opacity: 0, x: 30, y: 10 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 1.4, ease: EASE }}
          className="absolute -right-16 md:-right-24 top-16 w-[200px] rounded-2xl bg-white p-3.5 border border-black/[0.06]"
          style={{
            boxShadow: "0 30px 80px -20px rgba(80,40,20,0.25), 0 12px 24px -8px rgba(0,0,0,0.12)",
            transform: "rotate(4deg)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#ffa473] to-[#cc785c] flex items-center justify-center text-white text-[11px] font-bold">
              P
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-semibold text-black truncate">Priya · Mumbai</div>
              <div className="text-[9px] text-black/45">just now</div>
            </div>
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inset-0 rounded-full bg-[#cc785c] opacity-60 animate-ping" />
              <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-[#cc785c]" />
            </span>
          </div>
          <div className="text-[10px] text-black/55">Received</div>
          <div className="text-[18px] font-semibold tabular-nums text-black tracking-tight">
            ₹2,00,160
          </div>
        </motion.div>

        {/* Floating "settles in" pill — bottom left */}
        <motion.div
          initial={{ opacity: 0, x: -20, y: 10 }}
          whileInView={{ opacity: 1, x: 0, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 1.7, ease: EASE }}
          className="absolute -left-8 md:-left-14 bottom-20 rounded-full bg-black text-white px-4 py-2 flex items-center gap-2"
          style={{
            boxShadow: "0 24px 50px -16px rgba(0,0,0,0.35)",
            transform: "rotate(-3deg)",
          }}
        >
          <Send className="w-3 h-3 text-[#cc785c]" />
          <span className="text-[11px] font-medium tracking-tight">Settles in 42s</span>
        </motion.div>
      </motion.div>
    </div>
  );
}

const SendGloballySection = memo(function SendGloballySection() {
  return (
    <section
      className="relative text-black pt-16 md:pt-36 pb-10 md:pb-16 overflow-hidden"
      style={{ background: "#ffffff" }}
    >
      <div className="relative max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-14 md:gap-20 items-center">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1, ease: EASE }}
        >
          <h2
            className="font-display leading-[1.02] mb-6"
            style={{
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              fontWeight: 500,
              letterSpacing: "-0.035em",
            }}
          >
            Pay anyone, anywhere.{" "}
            <span style={{ fontStyle: "italic", fontFamily: "ui-serif, Georgia, serif" }}>
              Instantly.
            </span>
          </h2>
          <p className="text-[18px] md:text-[19px] leading-[1.55] opacity-70 max-w-[480px] mb-9">
            Send money to friends or family worldwide in under 60 seconds — no banks,
            no friction, no waiting.
          </p>
          <Link
            to="https://app.blip.money/waitlist/user"
            className="inline-flex items-center justify-center self-start gap-1.5 px-6 h-12 rounded-full bg-black text-white text-[14px] font-semibold tracking-tight transition-transform hover:-translate-y-[1px]"
          >
            Send money <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Visual */}
        <div className="relative">
          <IllustrationCard>
            <img
              src="/illustrations/pay-anyone-card.png"
              alt="Dubai sender and Indian family receiver connected by a golden thread"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </IllustrationCard>
        </div>
      </div>
    </section>
  );
});

export default SendGloballySection;
