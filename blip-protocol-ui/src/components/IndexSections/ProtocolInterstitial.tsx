import { useRef, memo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Shield, Cpu, Users, Globe } from "lucide-react";

/* ============================================
   PROTOCOL INTERSTITIAL
   Cinematic brand moment — protocol identity,
   architecture pillars, network mesh.
   NOT transaction flow — this is infrastructure.
   ============================================ */

const EASE = [0.22, 1, 0.36, 1] as const;

/* Protocol architecture pillars */
const PILLARS = [
  {
    Icon: Shield,
    label: "Escrow Layer",
    value: "Trustless",
    desc: "Non-custodial smart contracts hold funds until both sides confirm.",
    color: "#3ddc84",
    gradFrom: "#e8faf0",
    gradTo: "#d0f5e0",
    darkGradFrom: "#0a2618",
    darkGradTo: "#071a10",
    num: "01",
  },
  {
    Icon: Cpu,
    label: "Matching Engine",
    value: "< 8s",
    desc: "150+ merchants compete in real-time to offer the best rate.",
    color: "#ff6b35",
    gradFrom: "#fff0e8",
    gradTo: "#ffe0cc",
    darkGradFrom: "#261408",
    darkGradTo: "#1a0e05",
    num: "02",
  },
  {
    Icon: Users,
    label: "Reputation Graph",
    value: "On-chain",
    desc: "Every merchant carries a verifiable trust score built over time.",
    color: "#6366f1",
    gradFrom: "#eef0ff",
    gradTo: "#dde0ff",
    darkGradFrom: "#0e0f26",
    darkGradTo: "#08091a",
    num: "03",
  },
  {
    Icon: Globe,
    label: "Settlement Network",
    value: "12 corridors",
    desc: "Crypto-to-cash rails spanning UAE, SEA, Africa & beyond.",
    color: "#ff6b35",
    gradFrom: "#fff0e8",
    gradTo: "#ffe0cc",
    darkGradFrom: "#261408",
    darkGradTo: "#1a0e05",
    num: "04",
  },
];

/* Network mesh — random node positions (stable across renders) */
const NODES: { x: number; y: number; r: number }[] = [];
for (let i = 0; i < 28; i++) {
  // Deterministic pseudo-random using simple seed
  const seed = (i * 7919 + 104729) % 100;
  NODES.push({
    x: (i * 3571 + 1234) % 100,
    y: (i * 2459 + 5678) % 100,
    r: 1.5 + (seed % 3),
  });
}

/* Edges — connect nearby nodes */
const EDGES: { from: number; to: number }[] = [];
for (let i = 0; i < NODES.length; i++) {
  for (let j = i + 1; j < NODES.length; j++) {
    const dx = NODES[i].x - NODES[j].x;
    const dy = NODES[i].y - NODES[j].y;
    if (Math.sqrt(dx * dx + dy * dy) < 22) {
      EDGES.push({ from: i, to: j });
    }
  }
}

const ProtocolInterstitial = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted ? theme === "dark" : true;

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax
  const textScale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.65, 1],
    [0.88, 1, 1, 1.1],
  );
  const textOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.72, 1],
    [0, 1, 1, 0],
  );
  const meshOpacity = useTransform(
    scrollYProgress,
    [0, 0.25, 0.7, 1],
    [0, 0.6, 0.6, 0],
  );
  const meshScale = useTransform(scrollYProgress, [0, 0.4, 1], [0.9, 1, 1.15]);
  const pillarsY = useTransform(scrollYProgress, [0, 1], [60, -40]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: isDark ? "rgba(0,0,0,0.7)" : "rgba(250,248,245,0.95)",
        padding: "140px 24px 120px",
      }}
    >
      {/* ── Network mesh background ── */}

      {/* ── Ambient orbs ── */}
      {/* <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-[20%] left-[10%] w-[500px] h-[500px] rounded-full"
          style={{
            background: isDark
              ? "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 60%)"
              : "radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 60%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute bottom-[15%] right-[8%] w-[400px] h-[400px] rounded-full"
          style={{
            background: isDark
              ? "radial-gradient(circle, rgba(61,220,132,0.06) 0%, transparent 60%)"
              : "radial-gradient(circle, rgba(61,220,132,0.04) 0%, transparent 60%)",
            filter: "blur(80px)",
          }}
        />
      </div> */}

      {/* ── Content ── */}
      <motion.div
        className="relative z-10 max-w-6xl mx-auto"
        style={{ scale: textScale, opacity: textOpacity }}
      >
        {/* ── Big text ── */}
        <div className="text-center mb-20 sm:mb-28">
          {/* Label */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            className="p-large"
            style={{
              textTransform: "uppercase",
              color: isDark ? "#808080" : "#555555",
              marginBottom: 28,
            }}
          >
            Introducing
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE }}
            className="heading-h2"
            style={{
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            <span
              style={{
                color: isDark ? "#ffffff" : "#1a1a1a",
                display: "block",
              }}
            >
              The Blip
            </span>
            <span
              style={{
                display: "block",
                color: isDark ? "rgba(255,255,255,0.4)" : "#555555",
              }}
            >
              Protocol.
            </span>
          </motion.h2>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.45, ease: EASE }}
            className="p-large"
            style={{
              marginTop: 40,
              color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)",
              maxWidth: 480,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Four layers of infrastructure, working together
            <br />
            so money moves the way it should.
          </motion.p>
        </div>

        {/* ── Protocol architecture pillars ── */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          style={{ y: pillarsY }}
        >
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.12 + i * 0.1, ease: EASE }}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              style={{
                position: "relative",
                borderRadius: 20,
                padding: 1,
                background: `linear-gradient(160deg, ${p.color}30, transparent 40%, transparent 60%, ${p.color}15)`,
                cursor: "default",
              }}
            >
              {/* Inner card */}
              <div
                style={{
                  position: "relative",
                  borderRadius: 19,
                  background: isDark
                    ? "linear-gradient(160deg, #141414 0%, #0a0a0a 100%)"
                    : "linear-gradient(160deg, #ffffff 0%, #fafafa 100%)",
                  padding: "28px 24px 26px",
                  overflow: "hidden",
                  height: "100%",
                }}
              >
                {/* Large watermark number */}
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: -8,
                    right: 8,
                    fontSize: 88,
                    fontWeight: 900,
                    color: isDark
                      ? "rgba(255,255,255,0.03)"
                      : "rgba(0,0,0,0.03)",
                    lineHeight: 1,
                    fontFamily: "monospace",
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                >
                  {p.num}
                </div>

                {/* Colored dot + label row */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 20,
                  }}
                >
                  <motion.div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: p.color,
                      boxShadow: `0 0 12px ${p.color}60`,
                      flexShrink: 0,
                    }}
                    animate={{
                      boxShadow: [
                        `0 0 12px ${p.color}60`,
                        `0 0 20px ${p.color}90`,
                        `0 0 12px ${p.color}60`,
                      ],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.5,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      color: isDark
                        ? "rgba(255,255,255,0.4)"
                        : "rgba(0,0,0,0.4)",
                    }}
                  >
                    {p.label}
                  </span>
                </div>

                {/* Icon */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: `${p.color}12`,
                    border: `1px solid ${p.color}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                  }}
                >
                  <p.Icon
                    style={{ width: 20, height: 20, color: "#ffffff" }}
                    strokeWidth={1.8}
                  />
                </div>

                {/* Value */}
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    color: isDark ? "#ffffff" : "#111",
                    marginBottom: 8,
                    lineHeight: 1.1,
                  }}
                >
                  {p.value}
                </div>

                {/* Desc */}
                <div
                  style={{
                    fontSize: 13,
                    lineHeight: 1.55,
                    color: isDark
                      ? "rgba(255,255,255,0.35)"
                      : "rgba(0,0,0,0.42)",
                    fontWeight: 450,
                  }}
                >
                  {p.desc}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── Edge fades ── */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-28 pointer-events-none z-[5]"
        style={{
          background: isDark
            ? "linear-gradient(to bottom, #050505, transparent)"
            : "linear-gradient(to bottom, #FAF8F5, transparent)",
        }}
      />
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none z-[5]"
        style={{
          background: isDark
            ? "linear-gradient(to top, #050505, transparent)"
            : "linear-gradient(to top, #FAF8F5, transparent)",
        }}
      />

      {/* ── Grain ── */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none z-[6]"
        style={{
          opacity: isDark ? 0.025 : 0.015,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />
    </section>
  );
};

export default memo(ProtocolInterstitial);
