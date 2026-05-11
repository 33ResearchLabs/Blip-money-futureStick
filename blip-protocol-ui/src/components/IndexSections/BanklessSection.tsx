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
            className="-mx-5 md:mx-0 px-5 md:px-0 flex md:grid md:grid-cols-3 gap-4 md:gap-5 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{ scrollPaddingLeft: 20 }}
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

/* ─── Card shell ───────────────────────────────────────────────── */
function CardShell({
  index,
  tag,
  title,
  caption,
  children,
}: {
  index: string;
  tag: string;
  title: string;
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, ease: EASE }}
      className="relative w-full rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-7 flex flex-col"
    >
      {/* Top row: index + tag */}
      <div className="flex items-center justify-between mb-8">
        <span className="font-mono text-[11px] text-white/30">{index}</span>
        <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-white/40">
          {tag}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-display text-[22px] md:text-[24px] font-semibold tracking-tight leading-tight text-white mb-5">
        {title}
      </h3>

      {/* Visual mock */}
      <div className="mb-5">{children}</div>

      {/* Caption */}
      <p className="text-[13px] text-white/45 leading-snug mt-auto">
        {caption}
      </p>
    </motion.div>
  );
}

/* ─── Card 1: Merchants bid for you ────────────────────────────── */
function BiddingCard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [bids, setBids] = useState([
    { name: "AlphaFX", rate: 83.42 },
    { name: "GulfTrade", rate: 83.39 },
    { name: "NovaP2P", rate: 83.37 },
    { name: "SwiftExch", rate: 83.35 },
  ]);

  useEffect(() => {
    if (!inView) return;
    const merchants = [
      "AlphaFX",
      "GulfTrade",
      "NovaP2P",
      "SwiftExch",
      "CedarFX",
      "OrbitP2P",
    ];
    const id = setInterval(() => {
      setBids((prev) => {
        // bump the top rate slightly, shuffle a name in
        const next = prev.map((b) => ({
          ...b,
          rate: +(b.rate + (Math.random() - 0.4) * 0.02).toFixed(3),
        }));
        // occasionally swap a merchant name
        if (Math.random() > 0.6) {
          const i = Math.floor(Math.random() * 4);
          next[i] = {
            name: merchants[Math.floor(Math.random() * merchants.length)],
            rate: next[i].rate,
          };
        }
        return next.sort((a, b) => b.rate - a.rate);
      });
    }, 1800);
    return () => clearInterval(id);
  }, [inView]);

  return (
    <CardShell
      index="01"
      tag="Pricing"
      title="Best rates, guaranteed."
      caption="Competitive liquidity providers compress spreads on every transfer."
    >
      <div ref={ref} className="space-y-1.5">
        {bids.map((b, i) => (
          <motion.div
            key={`${b.name}-${i}`}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className={`flex items-center justify-between px-3 py-2 rounded-md ${
              i === 0
                ? "bg-white/[0.06] border border-white/20"
                : "bg-white/[0.02] border border-white/[0.04]"
            }`}
          >
            <div className="flex items-center gap-2">
              {i === 0 ? (
                <span className="text-[9px] font-bold uppercase tracking-wider text-white/80">
                  Winner
                </span>
              ) : (
                <span className="font-mono text-[10px] text-white/25">
                  0{i + 1}
                </span>
              )}
              <span
                className={`text-[12px] ${i === 0 ? "text-white" : "text-white/45"}`}
              >
                {b.name}
              </span>
            </div>
            <motion.span
              key={b.rate}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              className={`font-mono text-[12px] font-semibold ${
                i === 0 ? "text-white" : "text-white/40"
              }`}
            >
              {b.rate.toFixed(3)}
            </motion.span>
          </motion.div>
        ))}
      </div>
    </CardShell>
  );
}

/* ─── Card 2: Send money in minutes (Speed) ────────────────────── */
function RatesCard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [feed, setFeed] = useState([
    { pair: "USDT→AED", time: 42 },
    { pair: "USDT→INR", time: 38 },
    { pair: "USDT→PHP", time: 55 },
    { pair: "USDT→NGN", time: 47 },
  ]);

  useEffect(() => {
    if (!inView) return;
    const pairs = ["USDT→AED", "USDT→INR", "USDT→PHP", "USDT→NGN", "USDT→EGP", "USDT→THB"];
    const id = setInterval(() => {
      setFeed((prev) => {
        const next = [
          {
            pair: pairs[Math.floor(Math.random() * pairs.length)],
            time: Math.floor(Math.random() * 35) + 25,
          },
          ...prev,
        ].slice(0, 4);
        return next;
      });
    }, 2400);
    return () => clearInterval(id);
  }, [inView]);

  const avg = Math.round(feed.reduce((s, r) => s + r.time, 0) / feed.length);

  return (
    <CardShell
      index="02"
      tag="Speed"
      title="Send money in minutes."
      caption="Cross-border transfers without banking delays."
    >
      <div ref={ref}>
        {/* Live feed */}
        <div className="rounded-md border border-white/[0.08] bg-black/30 overflow-hidden">
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/[0.06]">
            <div className="flex items-center gap-1.5">
              <motion.div
                className="w-1 h-1 rounded-full bg-white/60"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
              <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-white/40">
                Live · last 4 settled
              </span>
            </div>
            <span className="font-mono text-[8px] text-white/25">Solana</span>
          </div>
          {feed.map((r, i) => (
            <motion.div
              key={`${r.pair}-${r.time}-${i}`}
              initial={i === 0 ? { opacity: 0, y: -4 } : false}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between px-3 py-1.5 border-t border-white/[0.04]"
            >
              <div className="flex items-center gap-2">
                <span className="text-white/50 text-[9px]">✓</span>
                <span className="text-[11px] text-white/55">{r.pair}</span>
              </div>
              <span className="font-mono text-[11px] text-white/80">{r.time}s</span>
            </motion.div>
          ))}
        </div>

        {/* Avg vs benchmark */}
        <div className="mt-3 flex items-center justify-between text-[11px]">
          <div>
            <span className="text-white/35">Avg</span>{" "}
            <span className="font-mono text-white/85 font-semibold">{avg}s</span>
          </div>
          <div>
            <span className="text-white/35">Bank wire</span>{" "}
            <span className="font-mono text-white/40">3–5 days</span>
          </div>
        </div>
      </div>
    </CardShell>
  );
}

/* ─── Card 3: Secure by design ─────────────────────────────────── */
function ProofCard() {
  const layers = [
    {
      label: "Reputation",
      value: "4.9★ avg LP",
      detail: "Reviews on every counterparty",
    },
    {
      label: "Escrow",
      value: "Smart-locked",
      detail: "Funds released only on settlement",
    },
    {
      label: "On-chain",
      value: "Solana verified",
      detail: "Cryptographic proof of every trade",
    },
  ];

  return (
    <CardShell
      index="03"
      tag="Security"
      title="Secure by design."
      caption="Escrow, reputation, and on-chain verification built into every transaction."
    >
      <div className="space-y-2">
        {layers.map((l, i) => (
          <motion.div
            key={l.label}
            initial={{ opacity: 0, x: -4 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: EASE }}
            className="rounded-md border border-white/[0.08] bg-white/[0.02] px-3 py-2.5"
          >
            <div className="flex items-center justify-between mb-0.5">
              <div className="flex items-center gap-1.5">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  className="text-white/55"
                >
                  <path
                    d="M2 6.5l2.5 2.5L10 3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/85">
                  {l.label}
                </span>
              </div>
              <span className="font-mono text-[11px] text-white/65">{l.value}</span>
            </div>
            <div className="text-[11px] text-white/40 leading-snug pl-[18px]">
              {l.detail}
            </div>
          </motion.div>
        ))}
      </div>
    </CardShell>
  );
}

export default BanklessSection;
