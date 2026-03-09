import { useRef } from "react";
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
    glow: "rgba(61,220,132,0.15)",
  },
  {
    Icon: Cpu,
    label: "Matching Engine",
    value: "< 8s",
    desc: "150+ merchants compete in real-time to offer the best rate.",
    color: "#818cf8",
    glow: "rgba(129,140,248,0.15)",
  },
  {
    Icon: Users,
    label: "Reputation Graph",
    value: "On-chain",
    desc: "Every merchant carries a verifiable trust score built over time.",
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.15)",
  },
  {
    Icon: Globe,
    label: "Settlement Network",
    value: "12 corridors",
    desc: "Crypto-to-cash rails spanning UAE, SEA, Africa & beyond.",
    color: "#3b82f6",
    glow: "rgba(59,130,246,0.15)",
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
        background: isDark ? "#050505" : "#FAF8F5",
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
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "4px",
              textTransform: "uppercase",
              color: isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.22)",
              marginBottom: 28,
            }}
          >
            Introducing
          </motion.p>

          {/* "The" */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.1, ease: EASE }}
          >
            <span
              style={{
                display: "block",
                fontSize: "clamp(1.6rem, 3vw, 2.8rem)",
                fontWeight: 400,
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
                color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.25)",
                fontStyle: "italic",
              }}
            >
              The
            </span>
          </motion.div>

          {/* "Blip" */}
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: EASE }}
            className="relative inline-block"
          >
            <h2
              style={{
                fontSize: "clamp(2.8rem, 5.5vw, 5rem)",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                lineHeight: 1.08,
                margin: 0,
                position: "relative",
                zIndex: 2,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  ...(isDark
                    ? {
                        background:
                          "linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.55) 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        color: "transparent",
                      }
                    : {
                        color: "#1a1a1a",
                      }),
                }}
              >
                Blip
              </span>
            </h2>

            {/* Glow */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "130%",
                height: "130%",
                background: isDark
                  ? "radial-gradient(ellipse, rgba(99,102,241,0.1) 0%, transparent 55%)"
                  : "radial-gradient(ellipse, rgba(99,102,241,0.05) 0%, transparent 55%)",
                pointerEvents: "none",
                filter: "blur(50px)",
              }}
            />

            {/* Shimmer */}
            <motion.div
              aria-hidden
              initial={{ x: "-130%" }}
              whileInView={{ x: "130%" }}
              viewport={{ once: true }}
              transition={{ duration: 2, delay: 0.7, ease: EASE }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "45%",
                height: "100%",
                background: isDark
                  ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)"
                  : "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
                pointerEvents: "none",
                zIndex: 3,
              }}
            />
          </motion.div>

          {/* "Protocol." */}
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3, ease: EASE }}
          >
            <span
              style={{
                display: "block",
                fontSize: "clamp(2.8rem, 7.5vw, 7.5rem)",
                fontWeight: 700,
                letterSpacing: "-0.05em",
                lineHeight: 1,
                color: isDark ? "rgba(255,255,255,0.15)" : "#555555",
              }}
            >
              Protocol.
            </span>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.45, ease: EASE }}
            style={{
              marginTop: 40,
              fontSize: "clamp(0.95rem, 1.6vw, 1.25rem)",
              fontWeight: 500,
              lineHeight: 1.7,
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
          style={{ y: pillarsY }}
        >
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.1, ease: EASE }}
              whileHover={{ y: -6 }}
              style={{
                position: "relative",
                background: isDark
                  ? "rgba(255,255,255,0.025)"
                  : "rgba(0,0,0,0.018)",
                border: isDark
                  ? "1px solid rgba(255,255,255,0.06)"
                  : "1px solid rgba(0,0,0,0.05)",
                borderRadius: 20,
                padding: "28px 24px 24px",
                cursor: "default",
                overflow: "hidden",
                transition: "border-color 0.3s, background 0.3s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = isDark
                  ? "rgba(255,255,255,0.12)"
                  : "rgba(0,0,0,0.1)";
                el.style.background = isDark
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(0,0,0,0.025)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = isDark
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(0,0,0,0.05)";
                el.style.background = isDark
                  ? "rgba(255,255,255,0.025)"
                  : "rgba(0,0,0,0.018)";
              }}
            >
              {/* Top-edge accent line */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  top: 0,
                  left: "15%",
                  right: "15%",
                  height: 1,
                  background: `linear-gradient(90deg, transparent, ${p.color}40, transparent)`,
                }}
              />

              {/* Corner glow */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  top: -40,
                  right: -40,
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${p.glow} 0%, transparent 70%)`,
                  pointerEvents: "none",
                }}
              />

              {/* Icon */}
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: `${p.color}12`,
                  border: `1px solid ${p.color}25`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <p.Icon
                  style={{ width: 18, height: 18, color: p.color }}
                  strokeWidth={1.6}
                />
              </div>

              {/* Value */}
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: isDark ? "#ffffff" : "#111",
                  marginBottom: 4,
                }}
              >
                {p.value}
              </div>

              {/* Label */}
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  color: p.color,
                  marginBottom: 10,
                }}
              >
                {p.label}
              </div>

              {/* Desc */}
              <div
                style={{
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.4)",
                  fontWeight: 450,
                }}
              >
                {p.desc}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Connecting line between pillars (desktop) ── */}
        <motion.div
          className="hidden lg:block relative mx-auto mt-8"
          style={{ height: 2, maxWidth: "80%" }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.6, ease: EASE }}
        >
          <div
            style={{
              height: 1,
              background: isDark
                ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), rgba(255,255,255,0.08), transparent)"
                : "linear-gradient(90deg, transparent, rgba(0,0,0,0.06), rgba(0,0,0,0.06), transparent)",
            }}
          />
          {/* Dots at each quarter */}
          {[0, 0.33, 0.66, 1].map((pos, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.8 + i * 0.1,
                type: "spring",
                stiffness: 300,
              }}
              style={{
                position: "absolute",
                top: "50%",
                left: `${pos * 100}%`,
                transform: "translate(-50%, -50%)",
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: PILLARS[i].color,
                boxShadow: `0 0 8px ${PILLARS[i].glow}`,
              }}
            />
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

export default ProtocolInterstitial;
