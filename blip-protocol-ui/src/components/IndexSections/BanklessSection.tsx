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
            "radial-gradient(50% 40% at 50% 30%, rgba(255,107,53,0.10) 0%, transparent 70%)",
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
      tag="Routing"
      title="Competitive settlement routing."
      caption="Liquidity providers compete to fulfill transactions in real time."
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
                ? "bg-[#ff6b35]/10 border border-[#ff6b35]/25"
                : "bg-white/[0.02] border border-white/[0.04]"
            }`}
          >
            <div className="flex items-center gap-2">
              {i === 0 ? (
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#ff6b35]">
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
                i === 0 ? "text-[#ff6b35]" : "text-white/40"
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

/* ─── Card 2: Best rates, guaranteed ───────────────────────────── */
function RatesCard() {
  const rows = [
    { name: "Blip", val: "0%", isBest: true },
    { name: "Binance P2P", val: "2.4%", isBest: false },
    { name: "Wise", val: "3.1%", isBest: false },
    { name: "Bank wire", val: "6.8%", isBest: false },
  ];
  const widthFor = (v: string) => {
    const n = parseFloat(v);
    if (n === 0) return 4; // tiny visible sliver so 0% still renders
    return Math.min(100, (n / 6.8) * 100);
  };

  return (
    <CardShell
      index="02"
      tag="Pricing"
      title="Market-driven pricing."
      caption="Competition compresses spreads and improves execution."
    >
      <div className="space-y-2.5">
        {rows.map((r) => (
          <div key={r.name}>
            <div className="flex items-center justify-between mb-1">
              <span
                className={`text-[12px] ${r.isBest ? "text-white" : "text-white/45"}`}
              >
                {r.name}
              </span>
              <span
                className={`font-mono text-[12px] font-semibold ${
                  r.isBest ? "text-[#3ddc84]" : "text-white/40"
                }`}
              >
                {r.val}
              </span>
            </div>
            <div className="h-[3px] rounded-full bg-white/[0.05] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${widthFor(r.val)}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease: EASE, delay: 0.1 }}
                className={`h-full rounded-full ${
                  r.isBest ? "bg-[#3ddc84]" : "bg-white/20"
                }`}
              />
            </div>
          </div>
        ))}
      </div>
    </CardShell>
  );
}

/* ─── Card 3: On-chain proof ───────────────────────────────────── */
function ProofCard() {
  return (
    <CardShell
      index="03"
      tag="Verification"
      title="On-chain verification."
      caption="Every settlement is cryptographically verifiable and traceable."
    >
      <div className="rounded-md border border-white/[0.08] bg-black/40 p-3 font-mono text-[11px] space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-white/30">tx</span>
          <span className="text-white/70">7xKm…4pQn</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/30">block</span>
          <span className="text-white/70">#248,173</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/30">amount</span>
          <span className="text-white/70">1,000 USDT</span>
        </div>
        <div className="border-t border-white/[0.06] pt-2 flex items-center justify-between">
          <span className="text-white/30">status</span>
          <span className="flex items-center gap-1 text-[#3ddc84]">
            <svg
              width="10"
              height="10"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
            >
              <path d="M2 6.5l2.5 2.5L10 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Verified · Solana
          </span>
        </div>
      </div>
    </CardShell>
  );
}

export default BanklessSection;
