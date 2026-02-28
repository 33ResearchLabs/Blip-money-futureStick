import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Zap, Globe, Check, Lock } from "lucide-react";
import { useTheme } from "next-themes";

const EASE = [0.16, 1, 0.3, 1] as const;

const FEATURES = [
  {
    Icon: Shield,
    label: "Escrow protection",
    desc: "Funds held safely until trade is complete",
    color: "#3ddc84",
    glow: "rgba(61,220,132,0.12)",
    border: "rgba(61,220,132,0.2)",
  },
  {
    Icon: Zap,
    label: "Instant lock",
    desc: "Secured in under a second",
    color: "#ff8c50",
    glow: "rgba(255,140,80,0.1)",
    border: "rgba(255,140,80,0.18)",
  },
  {
    Icon: Globe,
    label: "Fully verifiable",
    desc: "Every step recorded on-chain",
    color: "#4b94f5",
    glow: "rgba(75,148,245,0.1)",
    border: "rgba(75,148,245,0.18)",
  },
];

const LockedAndSecuredSection = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted ? theme === "dark" : true;

  return (
    <section
      style={{
        background: isDark ? "#090909" : "#FAF8F5",
        padding: "100px 48px 100px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient green glow — top right */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: -80, right: -60,
          width: 560, height: 400,
          background: isDark
            ? "radial-gradient(ellipse at top right, rgba(61,220,132,0.06) 0%, transparent 65%)"
            : "radial-gradient(ellipse at top right, rgba(61,220,132,0.08) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />
      {/* Ambient warm glow — bottom left */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: -60, left: -40,
          width: 420, height: 320,
          background: isDark
            ? "radial-gradient(ellipse at bottom left, rgba(255,107,53,0.05) 0%, transparent 65%)"
            : "radial-gradient(ellipse at bottom left, rgba(255,107,53,0.06) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1120, margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 72 }}
        >
          <p
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: isDark ? "#3a3a3a" : "rgba(0,0,0,0.35)",
              marginBottom: 20,
            }}
          >
            Protection
          </p>
          <h2
            style={{
              fontSize: "clamp(2.8rem, 5.5vw, 5rem)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              color: isDark ? "#ffffff" : "#1a1a1a",
            }}
          >
            Locked &{" "}
            <span style={{ color: isDark ? "#333333" : "rgba(0,0,0,0.2)" }}>secured.</span>
          </h2>
        </motion.div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left — Escrow card */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="flex justify-center"
          >
            <div style={{ position: "relative", width: "100%", maxWidth: 380 }}>

              {/* Green glow behind card */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: -30,
                  background: isDark
                    ? "radial-gradient(ellipse at center, rgba(61,220,132,0.07) 0%, transparent 65%)"
                    : "radial-gradient(ellipse at center, rgba(61,220,132,0.1) 0%, transparent 65%)",
                  pointerEvents: "none",
                }}
              />

              {/* Main escrow card */}
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.32, ease: "easeOut" }}
                style={{
                  position: "relative",
                  background: isDark ? "#0f0f0f" : "#ffffff",
                  borderRadius: 24,
                  overflow: "hidden",
                  border: isDark
                    ? "1px solid rgba(255,255,255,0.085)"
                    : "1px solid rgba(0,0,0,0.08)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  boxShadow: isDark
                    ? `
                      inset 0 1px 0 rgba(255,255,255,0.06),
                      0 0 80px 28px rgba(61,220,132,0.06),
                      0 2px 4px rgba(0,0,0,0.55),
                      0 16px 48px rgba(0,0,0,0.65)
                    `
                    : `
                      0 0 60px 20px rgba(61,220,132,0.05),
                      0 2px 4px rgba(0,0,0,0.04),
                      0 16px 48px rgba(0,0,0,0.08)
                    `,
                }}
              >
                {/* Top-edge highlight */}
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: 0, left: 0, right: 0,
                    height: 1,
                    background:
                      "linear-gradient(90deg, transparent 0%, rgba(61,220,132,0.25) 50%, transparent 100%)",
                    pointerEvents: "none",
                    zIndex: 10,
                  }}
                />

                {/* Card header */}
                <div
                  style={{
                    padding: "24px 24px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        position: "relative",
                        width: 40, height: 40,
                        borderRadius: 12,
                        background: "rgba(61,220,132,0.08)",
                        border: "1px solid rgba(61,220,132,0.18)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >
                      <Shield style={{ width: 18, height: 18, color: "#3ddc84" }} strokeWidth={1.5} />
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8, type: "spring", stiffness: 300 }}
                        style={{
                          position: "absolute",
                          bottom: -3, right: -3,
                          width: 16, height: 16,
                          borderRadius: "50%",
                          background: "#3ddc84",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      >
                        <Check style={{ width: 9, height: 9, color: "#000" }} strokeWidth={3} />
                      </motion.div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          letterSpacing: "2px",
                          textTransform: "uppercase",
                          color: isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.3)",
                          marginBottom: 2,
                        }}
                      >
                        Escrow Active
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: isDark ? "#ffffff" : "#1a1a1a",
                        }}
                      >
                        Funds Secured
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <motion.div
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{
                        width: 7, height: 7,
                        borderRadius: "50%",
                        background: "#3ddc84",
                        boxShadow: "0 0 6px rgba(61,220,132,0.7)",
                      }}
                    />
                    <span style={{ fontSize: 10, color: "#3ddc84", fontWeight: 500 }}>
                      Live
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ margin: "0 24px", height: 1, background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }} />

                {/* Amount */}
                <div style={{ padding: "24px", textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
                      fontWeight: 700,
                      letterSpacing: "-0.04em",
                      color: isDark ? "#ffffff" : "#1a1a1a",
                      marginBottom: 4,
                    }}
                  >
                    5,000 USDT
                  </div>
                  <div style={{ fontSize: 11, color: isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.35)" }}>
                    ≈ $5,000.00
                  </div>
                </div>

                {/* Progress */}
                <div style={{ padding: "0 24px 20px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 600,
                        letterSpacing: "1.5px",
                        textTransform: "uppercase",
                        color: isDark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.3)",
                      }}
                    >
                      Escrow Progress
                    </span>
                    <span style={{ fontSize: 11, color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.5)", fontWeight: 600 }}>
                      75%
                    </span>
                  </div>
                  <div
                    style={{
                      height: 4,
                      borderRadius: 999,
                      background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
                      overflow: "hidden",
                    }}
                  >
                    <motion.div
                      initial={{ width: "0%" }}
                      whileInView={{ width: "75%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.5, ease: EASE }}
                      style={{
                        height: "100%",
                        borderRadius: 999,
                        background: "linear-gradient(90deg, #3ddc84, #2ab870)",
                      }}
                    />
                  </div>
                </div>

                {/* Divider */}
                <div style={{ margin: "0 24px", height: 1, background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }} />

                {/* Details */}
                <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    {
                      label: "Status",
                      value: "In Escrow",
                      valueStyle: { color: "#3ddc84" },
                      dot: true,
                    },
                    {
                      label: "Contract",
                      value: "0x7a2...f91",
                      valueStyle: { fontFamily: "monospace", color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)" },
                      dot: false,
                    },
                    {
                      label: "Network",
                      value: "Solana",
                      valueStyle: { color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)" },
                      dot: false,
                      network: true,
                    },
                  ].map((row) => (
                    <div
                      key={row.label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ fontSize: 11.5, color: isDark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.35)" }}>
                        {row.label}
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        {row.dot && (
                          <motion.div
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            style={{ width: 5, height: 5, borderRadius: "50%", background: "#3ddc84" }}
                          />
                        )}
                        {row.network && (
                          <div
                            style={{
                              width: 12, height: 12,
                              borderRadius: "50%",
                              background: "linear-gradient(135deg, #9945FF, #14F195)",
                            }}
                          />
                        )}
                        <span style={{ fontSize: 11.5, fontWeight: 500, ...row.valueStyle }}>
                          {row.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA button */}
                <div style={{ padding: "12px 24px 24px" }}>
                  <div
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: 12,
                      background: "rgba(61,220,132,0.1)",
                      border: "1px solid rgba(61,220,132,0.2)",
                      textAlign: "center",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#3ddc84",
                    }}
                  >
                    Secured
                  </div>
                </div>
              </motion.div>

              {/* Floating badge — top right */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.5, ease: EASE }}
                style={{
                  position: "absolute",
                  top: -20, right: -20,
                  background: isDark ? "#0f0f0f" : "#ffffff",
                  border: isDark
                    ? "1px solid rgba(255,255,255,0.085)"
                    : "1px solid rgba(0,0,0,0.08)",
                  borderRadius: 14,
                  padding: "10px 14px",
                  display: "flex", alignItems: "center", gap: 8,
                  boxShadow: isDark
                    ? "0 8px 30px rgba(0,0,0,0.5)"
                    : "0 8px 30px rgba(0,0,0,0.08)",
                }}
              >
                <div
                  style={{
                    width: 24, height: 24,
                    borderRadius: "50%",
                    background: "rgba(61,220,132,0.12)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <Check style={{ width: 11, height: 11, color: "#3ddc84" }} strokeWidth={2.5} />
                </div>
                <div>
                  <div style={{ fontSize: 9, color: isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.35)", letterSpacing: "1px" }}>
                    Verified
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: isDark ? "#ffffff" : "#1a1a1a" }}>
                    On-chain
                  </div>
                </div>
              </motion.div>

              {/* Floating badge — bottom left */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.5, ease: EASE }}
                style={{
                  position: "absolute",
                  bottom: -18, left: -20,
                  background: isDark ? "#0f0f0f" : "#ffffff",
                  border: isDark
                    ? "1px solid rgba(255,255,255,0.085)"
                    : "1px solid rgba(0,0,0,0.08)",
                  borderRadius: 14,
                  padding: "10px 14px",
                  display: "flex", alignItems: "center", gap: 8,
                  boxShadow: isDark
                    ? "0 8px 30px rgba(0,0,0,0.5)"
                    : "0 8px 30px rgba(0,0,0,0.08)",
                }}
              >
                <div
                  style={{
                    width: 24, height: 24,
                    borderRadius: "50%",
                    background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <Lock style={{ width: 11, height: 11, color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)" }} strokeWidth={2} />
                </div>
                <div>
                  <div style={{ fontSize: 9, color: isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.35)", letterSpacing: "1px" }}>
                    Smart Contract
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: isDark ? "#ffffff" : "#1a1a1a" }}>
                    Protected
                  </div>
                </div>
              </motion.div>

            </div>
          </motion.div>

          {/* Right — Text + features */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          >
            <p
              style={{
                fontSize: 15,
                fontWeight: 500,
                color: isDark ? "rgba(255,255,255,0.32)" : "rgba(0,0,0,0.45)",
                lineHeight: 1.7,
                marginBottom: 36,
                maxWidth: 400,
              }}
            >
              Your funds are held in a secure on-chain escrow. Neither party can
              touch them until the trade is complete.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {FEATURES.map((f, i) => (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1, ease: EASE }}
                  whileHover={{ x: 4 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "16px 20px",
                    background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
                    border: isDark
                      ? "1px solid rgba(255,255,255,0.07)"
                      : "1px solid rgba(0,0,0,0.06)",
                    borderRadius: 14,
                    cursor: "default",
                    transition: "border-color 0.2s, background 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = isDark
                      ? "rgba(255,255,255,0.12)"
                      : "rgba(0,0,0,0.1)";
                    (e.currentTarget as HTMLDivElement).style.background = isDark
                      ? "rgba(255,255,255,0.04)"
                      : "rgba(0,0,0,0.03)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = isDark
                      ? "rgba(255,255,255,0.07)"
                      : "rgba(0,0,0,0.06)";
                    (e.currentTarget as HTMLDivElement).style.background = isDark
                      ? "rgba(255,255,255,0.02)"
                      : "rgba(0,0,0,0.02)";
                  }}
                >
                  <div
                    style={{
                      width: 38, height: 38,
                      borderRadius: 10,
                      background: f.glow,
                      border: `1px solid ${f.border}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <f.Icon style={{ width: 16, height: 16, color: f.color }} strokeWidth={1.6} />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 13.5,
                        fontWeight: 600,
                        color: isDark ? "#ffffff" : "#1a1a1a",
                        marginBottom: 2,
                      }}
                    >
                      {f.label}
                    </div>
                    <div style={{ fontSize: 11.5, color: isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.4)" }}>
                      {f.desc}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default LockedAndSecuredSection;
