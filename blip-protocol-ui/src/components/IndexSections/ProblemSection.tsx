import { useState, useEffect, useRef, memo, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { useTheme } from "next-themes";
import { CTAButton } from "../Navbar";
import { SwipeHint } from "./SwipeHint";
import createGlobe from "cobe";

/* ── Live counter hook ── */
function useLiveCounter(rate: number, start: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    const interval = setInterval(() => {
      setValue((v) => v + rate);
    }, 50);
    return () => clearInterval(interval);
  }, [rate, start]);
  return value;
}

const EASE = [0.16, 1, 0.3, 1] as const;

/* ── Currency float symbols (Card 1) ── */
const CURRENCIES: Array<{
  char: string;
  size: number;
  rotate: number;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}> = [
  { char: "$", size: 170, top: -35, right: -18, rotate: -12 },
  { char: "€", size: 90, bottom: 24, left: -14, rotate: 9 },
  { char: "£", size: 65, top: 55, right: 62, rotate: 5 },
  { char: "¥", size: 52, bottom: 72, right: 28, rotate: -5 },
];

/* ── Card definitions (Apple-style: white cards, black text) ── */
const CARDS = [
  {
    eyebrow: "The Cost",
    headlinePre: null as string | null,
    headline: "7%",
    sub: "Lost before it arrives." as string | null,
    micro: "Every cross-border transfer.",
    hasProgress: false,
  },
  {
    eyebrow: "The Wait",
    headlinePre: null as string | null,
    headline: "3 – 5 Days",
    sub: "To settle." as string | null,
    micro: "Global payments shouldn't crawl.",
    hasProgress: true,
  },
  {
    eyebrow: "The Exposure",
    headlinePre: "Every transaction" as string | null,
    headline: "Tracked.",
    sub: null as string | null,
    micro: "Stored. Shared. Permanent.",
    hasProgress: false,
  },
];

/* ── Bento stats ── */
const BENTO = [
  { val: "<60s", lbl: "Settlement" },
  { val: "1.5%", lbl: "Cheapest in market" },
  { val: "Non-custodial", lbl: "You keep control" },
  { val: "On-chain", lbl: "Full transparency" },
];

/* ─── Night Globe — scroll-driven rotation ──────────────────────── */
function NightGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phiRef = useRef(0.5);
  const widthRef = useRef(0);
  const lastScrollY = useRef(
    typeof window !== "undefined" ? window.scrollY : 0,
  );

  useEffect(() => {
    if (!canvasRef.current) return;

    const onResize = () => {
      if (canvasRef.current) widthRef.current = canvasRef.current.offsetWidth;
    };
    window.addEventListener("resize", onResize);
    onResize();

    // Scroll-delta driven rotation: up = right (phi +), down = left (phi -)
    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;
      phiRef.current -= delta * 0.004;
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    let globe: ReturnType<typeof createGlobe> | null = null;
    try {
      globe = createGlobe(canvasRef.current, {
        devicePixelRatio: 2,
        width: widthRef.current * 2,
        height: widthRef.current * 2,
        phi: 0.5,
        theta: 0.42,
        dark: 1,
        diffuse: 1.4,
        mapSamples: 20000,
        mapBrightness: 7,
        baseColor: [0.06, 0.07, 0.12],
        markerColor: [1, 0.82, 0.28],
        glowColor: [0.18, 0.32, 0.72],
        markers: [
          { location: [25.2048, 55.2708], size: 0.06 }, // Dubai
          { location: [40.7128, -74.006], size: 0.05 }, // New York
          { location: [51.5074, -0.1278], size: 0.05 }, // London
          { location: [1.3521, 103.8198], size: 0.045 }, // Singapore
          { location: [35.6762, 139.6503], size: 0.04 }, // Tokyo
          { location: [19.076, 72.8777], size: 0.04 }, // Mumbai
          { location: [48.8566, 2.3522], size: 0.04 }, // Paris
          { location: [-23.5505, -46.6333], size: 0.04 }, // São Paulo
        ],
        onRender: (state) => {
          state.phi = phiRef.current;
          state.width = widthRef.current * 2;
          state.height = widthRef.current * 2;
        },
      });
    } catch (e) {
      console.warn("Globe initialization failed:", e);
    }

    return () => {
      globe?.destroy();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        mixBlendMode: "screen",
      }}
    />
  );
}

/* ── Card wrapper ── */
function CardShell({ children, bg }: { children: React.ReactNode; bg?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-5%" }}
      transition={{ duration: 0.8, ease: EASE }}
      whileHover={{ y: -6, boxShadow: "0 20px 60px rgba(0,0,0,0.12)" }}
      style={{
        position: "relative",
        background: bg || "#ffffff",
        borderRadius: 24,
        overflow: "hidden",
        minHeight: 380,
        boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
        transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        cursor: "default",
      }}
    >
      <div style={{ position: "relative", zIndex: 2, padding: "36px 32px 32px", display: "flex", flexDirection: "column", height: "100%" }}>
        {children}
      </div>
    </motion.div>
  );
}

/* ── Card 1: The Cost — live money lost counter ── */
function CostCard() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  // ~$95/sec lost to P2P fees globally based on a $4B/year P2P fee pool
  const lost = useLiveCounter(isInView ? 95 : 0, isInView);

  return (
    <div ref={ref}>
      <CardShell bg="linear-gradient(165deg, #fff5f0 0%, #ffe8dc 100%)">
        <span style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(0,0,0,0.4)", marginBottom: 16 }}>
          The Fee
        </span>

        {/* Big stat */}
        <div style={{ fontSize: "clamp(3.5rem, 5vw, 4.8rem)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 0.95, marginBottom: 6, color: "#1d1d1f" }}>
          3–5%
        </div>
        <div style={{ fontSize: "clamp(1rem, 1.6vw, 1.15rem)", fontWeight: 500, color: "rgba(0,0,0,0.5)", marginBottom: 20 }}>
          Spread + fees on every P2P trade.
        </div>

        {/* Live counter */}
        <div style={{ background: "rgba(0,0,0,0.03)", borderRadius: 12, padding: "14px 16px", marginBottom: 8 }}>
          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(0,0,0,0.3)", marginBottom: 6 }}>
            P2P fees collected right now
          </div>
          <div className="font-mono" style={{ fontSize: 24, fontWeight: 700, color: "#e53e3e", letterSpacing: "-0.03em" }}>
            ${Math.floor(lost).toLocaleString()}
          </div>
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ fontSize: 10, color: "#e53e3e", marginTop: 4, fontWeight: 500 }}
          >
            ● live · since you opened this page
          </motion.div>
        </div>

        <div style={{ marginTop: "auto", paddingTop: 12, fontSize: 13, fontWeight: 400, color: "rgba(0,0,0,0.35)" }}>
          Hidden in the spread you don't see.
        </div>
      </CardShell>
    </div>
  );
}

/* ── Card 2: The Wait — typical P2P trade time ── */
function WaitCard() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const start = Date.now();
    const id = setInterval(() => setElapsed(Date.now() - start), 100);
    return () => clearInterval(id);
  }, [isInView]);

  const mins = Math.floor(elapsed / 60000);
  const secs = Math.floor((elapsed % 60000) / 1000);
  const ms = Math.floor((elapsed % 1000) / 10);

  return (
    <div ref={ref}>
      <CardShell bg="linear-gradient(165deg, #f0f4ff 0%, #dce4f8 100%)">
        <span style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(0,0,0,0.4)", marginBottom: 16 }}>
          The Wait
        </span>

        <div style={{ fontSize: "clamp(2.8rem, 4vw, 3.8rem)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 0.95, marginBottom: 6, color: "#1d1d1f" }}>
          18 min
        </div>
        <div style={{ fontSize: "clamp(1rem, 1.6vw, 1.15rem)", fontWeight: 500, color: "rgba(0,0,0,0.5)", marginBottom: 20 }}>
          Per P2P trade.
        </div>

        {/* Live timer */}
        <div style={{ background: "rgba(0,0,0,0.03)", borderRadius: 12, padding: "14px 16px", marginBottom: 8 }}>
          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(0,0,0,0.3)", marginBottom: 6 }}>
            Time you've been waiting
          </div>
          <div className="font-mono" style={{ fontSize: 24, fontWeight: 700, color: "#1d1d1f", letterSpacing: "0.02em" }}>
            {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
            <span style={{ fontSize: 14, color: "rgba(0,0,0,0.25)" }}>.{String(ms).padStart(2, "0")}</span>
          </div>
          <div style={{ fontSize: 10, color: "rgba(0,0,0,0.3)", marginTop: 4, fontWeight: 500 }}>
            Binance P2P · Paxful · LocalBitcoins typical
          </div>
        </div>

        {/* Stalled progress */}
        <div style={{ marginTop: "auto", paddingTop: 12 }}>
          <div className="flex justify-between mb-1">
            <span style={{ fontSize: 10, color: "rgba(0,0,0,0.3)" }}>Merchant response</span>
            <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(0,0,0,0.3)" }}>Pending...</span>
          </div>
          <div style={{ height: 3, background: "rgba(0,0,0,0.06)", borderRadius: 4 }}>
            <motion.div
              style={{ height: "100%", background: "#1d1d1f", borderRadius: 4 }}
              animate={{ width: ["0%", "73%", "75%", "75%", "0%"], opacity: [1, 1, 1, 0, 0] }}
              transition={{ duration: 5.5, times: [0, 0.55, 0.72, 0.88, 1], repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      </CardShell>
    </div>
  );
}

/* ── Card 3: The Risk — live P2P scam feed ── */
function TrackedCard() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [scamCount, setScamCount] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const scamTypes = [
    "Fake escrow release",
    "Chargeback fraud",
    "Reversed UPI payment",
    "Fake screenshot",
    "Stolen ID used in KYC",
    "Triangulation scam",
    "Doctored bank receipt",
    "Account takeover",
  ];

  useEffect(() => {
    if (!isInView) return;
    const id = setInterval(() => {
      setScamCount((v) => v + 1);
      const type = scamTypes[Math.floor(Math.random() * scamTypes.length)];
      const ref = "#" + Math.random().toString(36).slice(2, 7).toUpperCase();
      setLogs((prev) => [`${type} · ${ref}`, ...prev].slice(0, 3));
    }, 1800);
    return () => clearInterval(id);
  }, [isInView]);

  return (
    <div ref={ref}>
      <CardShell bg="linear-gradient(165deg, #fff0f0 0%, #f8dcdc 100%)">
        <span style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(0,0,0,0.4)", marginBottom: 16 }}>
          The Risk
        </span>

        <div style={{ marginBottom: 4 }}>
          <span style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.35rem)", fontWeight: 500, color: "rgba(0,0,0,0.45)" }}>
            1 in 8 P2P trades
          </span>
        </div>
        <div style={{ fontSize: "clamp(3.5rem, 5vw, 4.8rem)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 0.95, marginBottom: 6, color: "#1d1d1f" }}>
          Disputed.
        </div>
        <div style={{ fontSize: "clamp(1rem, 1.6vw, 1.15rem)", fontWeight: 500, color: "rgba(0,0,0,0.5)", marginBottom: 20 }}>
          Scammed. Reversed. Frozen.
        </div>

        {/* Live scam log */}
        <div style={{ background: "rgba(0,0,0,0.03)", borderRadius: 12, padding: "14px 16px" }}>
          <div className="flex items-center justify-between mb-2">
            <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(0,0,0,0.3)" }}>
              Scams reported on P2P desks
            </span>
            <span className="font-mono" style={{ fontSize: 12, fontWeight: 700, color: "#e53e3e" }}>
              {scamCount.toLocaleString()}
            </span>
          </div>
          <div className="space-y-1">
            {logs.map((log, i) => (
              <motion.div
                key={`${log}-${i}`}
                initial={i === 0 ? { opacity: 0, y: -6 } : false}
                animate={{ opacity: i === 0 ? 1 : 0.5, y: 0 }}
                className="flex items-center gap-2"
              >
                <div className="w-1 h-1 rounded-full" style={{ background: i === 0 ? "#e53e3e" : "rgba(0,0,0,0.15)" }} />
                <span className="font-mono" style={{ fontSize: 10, color: i === 0 ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.25)" }}>
                  {log}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </CardShell>
    </div>
  );
}

/* ── Live network dashboard for Enter Blip card ── */
function BlipSettlementDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [txCount, setTxCount] = useState(148392);
  const [volume, setVolume] = useState(24847192);
  const [blockNum, setBlockNum] = useState(248173);
  const [settlements, setSettlements] = useState([
    { tx: "7xKm...4pQn", amount: "$2,400", pair: "USDT→AED", time: "42s" },
    { tx: "3aRt...9mWz", amount: "$850", pair: "USDT→INR", time: "38s" },
    { tx: "9pLx...2cNv", amount: "$5,100", pair: "USDT→PHP", time: "55s" },
  ]);
  const [bestRates, setBestRates] = useState([
    { pair: "USDT/AED", rate: "3.665", merchant: "AlphaFX" },
    { pair: "USDT/INR", rate: "83.42", merchant: "SwiftExch" },
    { pair: "USDT/PHP", rate: "55.81", merchant: "GulfTrade" },
  ]);

  const txPairs = ["USDT→AED", "USDT→INR", "USDT→PHP", "USDT→NGN", "USDT→PKR", "USDT→EGP"];
  const merchants = ["AlphaFX", "GulfTrade", "SwiftExch", "NovaP2P", "CedarFX"];

  useEffect(() => {
    if (!isInView) return;
    const id = setInterval(() => {
      const addTx = Math.floor(Math.random() * 3) + 1;
      const addVol = Math.floor(Math.random() * 15000) + 2000;
      setTxCount((v) => v + addTx);
      setVolume((v) => v + addVol);
      setBlockNum((v) => v + 1);

      // New settlement
      const pair = txPairs[Math.floor(Math.random() * txPairs.length)];
      const amt = (Math.random() * 8000 + 200).toFixed(0);
      const t = Math.floor(Math.random() * 35 + 25);
      const hash = Math.random().toString(36).slice(2, 6) + "..." + Math.random().toString(36).slice(2, 6);
      setSettlements((prev) => [{ tx: hash, amount: `$${Number(amt).toLocaleString()}`, pair, time: `${t}s` }, ...prev].slice(0, 4));

      // Fluctuate rates
      setBestRates((prev) => prev.map((r) => ({
        ...r,
        rate: (parseFloat(r.rate) + (Math.random() - 0.5) * 0.01).toFixed(r.rate.length > 4 ? 2 : 3),
        merchant: merchants[Math.floor(Math.random() * merchants.length)],
      })));
    }, 2200);
    return () => clearInterval(id);
  }, [isInView]);

  return (
    <div ref={ref} className="rounded-xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
      {/* Stats row */}
      <div className="flex" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        {[
          { label: "Tx", value: txCount.toLocaleString() },
          { label: "Vol", value: `$${(volume / 1000000).toFixed(1)}M` },
          { label: "Block", value: `#${blockNum.toLocaleString()}` },
        ].map((s, i) => (
          <div key={s.label} className="flex-1 py-2.5 px-3" style={{ borderRight: i < 2 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
            <div style={{ fontSize: 7, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 2 }}>{s.label}</div>
            <motion.div key={s.value} initial={{ y: -2, opacity: 0.6 }} animate={{ y: 0, opacity: 1 }} className="font-mono" style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{s.value}</motion.div>
          </div>
        ))}
      </div>

      {/* Settlements — 2 rows */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="flex items-center justify-between px-3 py-1.5">
          <div className="flex items-center gap-1.5">
            <motion.div className="w-1 h-1 rounded-full bg-[#3ddc84]" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
            <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>Settlements</span>
          </div>
          <span className="font-mono" style={{ fontSize: 8, color: "rgba(255,255,255,0.15)" }}>Solana</span>
        </div>
        {settlements.slice(0, 2).map((s, i) => (
          <motion.div key={`${s.tx}-${i}`} initial={i === 0 ? { opacity: 0, x: -6 } : false} animate={{ opacity: 1, x: 0 }} className="flex items-center justify-between px-3 py-1.5" style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 8, color: "#3ddc84" }}>✓</span>
              <span className="font-mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>{s.tx}</span>
              <span style={{ fontSize: 8, color: "rgba(255,255,255,0.2)" }}>{s.pair}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono" style={{ fontSize: 9, color: "#3ddc84" }}>{s.time}</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>{s.amount}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Cheapest rates — 2 rows */}
      <div>
        <div className="flex items-center justify-between px-3 py-1.5">
          <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>Best rates · guaranteed</span>
          <span style={{ fontSize: 8, color: "rgba(255,255,255,0.15)" }}>Live</span>
        </div>
        {bestRates.slice(0, 2).map((r, i) => (
          <div key={r.pair} className="flex items-center justify-between px-3 py-1.5" style={{ borderTop: "1px solid rgba(255,255,255,0.03)" }}>
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>{r.pair}</span>
              <span style={{ fontSize: 8, color: "rgba(255,255,255,0.15)" }}>{r.merchant}</span>
            </div>
            <motion.span key={r.rate} initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} className="font-mono" style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{r.rate}</motion.span>
          </div>
        ))}
      </div>
    </div>
  );
}

const ProblemSection = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted ? theme === "dark" : true;

  // CARDS data kept for reference but cards now rendered by individual components

  return (
    <section
      style={{
        background: isDark ? "rgba(0,0,0,0.7)" : "rgba(250,248,245,0.95)",
        padding: "80px 20px 70px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Blue/purple ambient glow */}
      <div className="section-glow" aria-hidden />

      {/* Vignette */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: isDark
            ? `
            radial-gradient(ellipse 60% 35% at 35% 0%,  rgba(59,130,246,0.035) 0%, transparent 100%),
            radial-gradient(ellipse 50% 30% at 55% 0%,  rgba(139,92,246,0.025) 0%, transparent 100%),
            radial-gradient(ellipse 40% 25% at 65% 0%,  rgba(6,182,212,0.02)  0%, transparent 100%),
            radial-gradient(ellipse 80% 50% at 50% 100%, rgba(0,0,0,0.45)      0%, transparent 100%)
          `
            : `
            radial-gradient(ellipse 60% 35% at 35% 0%,  rgba(59,130,246,0.018) 0%, transparent 100%),
            radial-gradient(ellipse 50% 30% at 55% 0%,  rgba(139,92,246,0.012) 0%, transparent 100%),
            radial-gradient(ellipse 40% 25% at 65% 0%,  rgba(6,182,212,0.01)   0%, transparent 100%),
            radial-gradient(ellipse 80% 50% at 50% 100%, rgba(0,0,0,0.02)      0%, transparent 100%)
          `,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Grain noise */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          opacity: isDark ? 0.022 : 0.012,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Globe — right edge, half-visible */}
      {isDark && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            right: -300,
            top: "50%",
            transform: "translateY(-50%)",
            width: 600,
            height: 600,
            zIndex: 1,
            pointerEvents: "none",
          }}
        >
          <NightGlobe />
        </div>
      )}

      <div
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* ── Header ── */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{
            textAlign: "center",
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: isDark ? "#808080" : "#555555",
            marginBottom: 28,
          }}
        >
          The P2P problem
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
          className="heading-h2"
          style={{
            textAlign: "center",
            marginBottom: 48,
          }}
        >
          <span className="mb-3"
            style={{
              color: isDark ? "#ffffff" : "#1a1a1a",
              display: "block",
            }}
          >
            P2P today
          </span>
          {/* <span
            style={{
              display: "block",
              color: isDark ? "rgba(255,255,255,0.4)" : "#555555",
            }}
          >
            are broken.
          </span> */}
          <span>are broken.</span>
        </motion.h2>

        {/* ── 3 Problem Cards — Live animated data ──
            Mobile: Apple-style horizontal snap-scroll (cards peek at edges).
            md+ : 3-column grid as before. */}
        <div className="relative" style={{ marginBottom: 16 }}>
          <div
            className="-mx-5 md:mx-0 px-5 md:px-0 flex md:grid md:grid-cols-3 gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{ scrollPaddingLeft: 20 }}
          >
            <div className="snap-start shrink-0 w-[85%] md:w-auto"><CostCard /></div>
            <div className="snap-start shrink-0 w-[85%] md:w-auto"><WaitCard /></div>
            <div className="snap-start shrink-0 w-[85%] md:w-auto"><TrackedCard /></div>
          </div>
          <SwipeHint />
        </div>

        {/* ── The Fix — full-width cinematic card ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{
            position: "relative",
            borderRadius: 24,
            overflow: "hidden",
            minHeight: 360,
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Background image — zooms on scroll */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1.15, 1.25, 1.1, 1],
              x: [0, -20, 15, -10, 20, 0],
              y: [0, -15, 10, -20, 5, 0],
            }}
            transition={{ duration: 30, ease: "easeInOut", repeat: Infinity }}
            style={{
              position: "absolute",
              inset: -40,
              backgroundImage: "url('/fix-bg.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          {/* Dark overlay for text readability */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.55) 100%)",
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-12 md:px-8 md:py-[64px]">
            <span style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 20 }}>
              The Fix
            </span>
            <div className="text-[26px] sm:text-[32px] md:text-[3.2rem] font-bold tracking-tight leading-[1.1] mb-1.5 md:mb-2 text-white/50">
              This is not a payments app.
            </div>
            <div className="text-[26px] sm:text-[32px] md:text-[3.2rem] font-bold tracking-tight leading-[1.1] text-white mb-7 md:mb-10">
              This is a settlement layer.
            </div>

            {/* Stats row — compact on mobile, spaced on desktop */}
            <div className="grid grid-cols-3 gap-3 md:flex md:items-center md:gap-16 w-full max-w-[420px] md:max-w-none">
              {[
                { val: "<60s", lbl: "Settlement" },
                { val: "150+", lbl: "Merchants" },
                { val: "On-chain", lbl: "Proof" },
              ].map((s, i) => (
                <div key={s.lbl} className="flex md:items-center md:gap-16">
                  {i > 0 && <div className="hidden md:block w-px h-8 bg-white/10 -mx-5" />}
                  <div className="text-center w-full">
                    <div className="text-base sm:text-lg md:text-[28px] font-bold text-white tracking-tight mb-1 whitespace-nowrap">
                      {s.val}
                    </div>
                    <div className="text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.15em] text-white/40">
                      {s.lbl}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(ProblemSection);
