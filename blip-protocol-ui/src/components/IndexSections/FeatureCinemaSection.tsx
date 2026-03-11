import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import {
  Shield,
  Zap,
  Check,
  Lock,
  Globe,
  ArrowRight,
  Activity,
  TrendingUp,
  Star,
  CheckCircle2,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  MerchantDashboardVisual,
  MerchantHeroDashbaord,
} from "../MerchantDashboard";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/* ═══════════════════════════════════════════════════════════
   SCENE 1 UI — ESCROW LOCK
   Cycles: sending → locking → locked → verified → repeat
   ═══════════════════════════════════════════════════════════ */
type EscrowPhase = "sending" | "locking" | "locked" | "verified";

function EscrowUI({
  active = true,
  isDark = true,
}: {
  active?: boolean;
  isDark?: boolean;
}) {
  const [phase, setPhase] = useState<EscrowPhase>("sending");

  useEffect(() => {
    if (!active) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const run = () => {
      setPhase("sending");
      timers.push(setTimeout(() => setPhase("locking"), 2000));
      timers.push(setTimeout(() => setPhase("locked"), 3600));
      timers.push(setTimeout(() => setPhase("verified"), 5000));
    };
    run();
    const id = setInterval(run, 7500);
    return () => {
      clearInterval(id);
      timers.forEach(clearTimeout);
    };
  }, [active]);

  const progressWidth =
    phase === "sending" ? "42%" : phase === "locking" ? "74%" : "100%";

  const statusLabel =
    phase === "sending"
      ? "Transferring..."
      : phase === "locking"
        ? "Locking in escrow..."
        : phase === "locked"
          ? "In Escrow"
          : "Verified & Secured";

  const statusColor =
    phase === "verified" || phase === "locked"
      ? isDark
        ? "rgba(255,255,255,0.6)"
        : "rgba(0,0,0,0.6)"
      : isDark
        ? "rgba(255,255,255,0.4)"
        : "rgba(0,0,0,0.4)";

  return (
    <div
      style={{
        width: 340,
        background: isDark ? "#0d0d0d" : "#ffffff",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: isDark
          ? "0 0 80px rgba(61,220,132,0.08), 0 30px 60px rgba(0,0,0,0.6)"
          : "0 0 80px rgba(61,220,132,0.06), 0 30px 60px rgba(0,0,0,0.08)",
      }}
    >
      {/* Card header */}
      <div
        style={{
          padding: "18px 20px 16px",
          borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <motion.div
            animate={{
              background:
                phase === "verified"
                  ? "rgba(61,220,132,0.12)"
                  : isDark
                    ? "rgba(255,255,255,0.04)"
                    : "rgba(0,0,0,0.04)",
              borderColor:
                phase === "verified"
                  ? "rgba(61,220,132,0.25)"
                  : isDark
                    ? "rgba(255,255,255,0.07)"
                    : "rgba(0,0,0,0.07)",
            }}
            transition={{ duration: 0.5 }}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid",
            }}
          >
            {phase === "locked" || phase === "verified" ? (
              <Lock
                style={{
                  width: 16,
                  height: 16,
                  color:
                    phase === "verified"
                      ? "#3ddc84"
                      : isDark
                        ? "rgba(255,255,255,0.45)"
                        : "rgba(0,0,0,0.45)",
                }}
              />
            ) : (
              <Shield
                style={{
                  width: 16,
                  height: 16,
                  color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)",
                }}
              />
            )}
          </motion.div>
          <div>
            <div
              style={{
                fontSize: 9,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)",
                marginBottom: 2,
              }}
            >
              {phase === "sending"
                ? "Escrow Service"
                : phase === "locking"
                  ? "Locking Funds"
                  : "Escrow Active"}
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: isDark ? "#fff" : "#000",
              }}
            >
              {phase === "sending"
                ? "Processing..."
                : phase === "locking"
                  ? "Securing..."
                  : "Funds Secured"}
            </div>
          </div>
        </div>
        <motion.div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: phase === "locking" ? "#ffbd2e" : "#3ddc84",
            boxShadow: `0 0 6px ${
              phase === "locking"
                ? "rgba(255,189,46,0.7)"
                : "rgba(61,220,132,0.7)"
            }`,
          }}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>

      {/* Amount */}
      <div
        style={{
          padding: "24px 20px 20px",
          textAlign: "center",
          borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
        }}
      >
        <div
          style={{
            fontSize: 10,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
            marginBottom: 8,
          }}
        >
          {phase === "sending" ? "Sending Amount" : "Secured Amount"}
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            letterSpacing: "-0.04em",
            color: isDark ? "#fff" : "#000",
            marginBottom: 4,
          }}
        >
          5,000{" "}
          <span
            style={{
              fontSize: 18,
              color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)",
              fontWeight: 500,
            }}
          >
            USDT
          </span>
        </div>
        <div
          style={{
            fontSize: 11,
            color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
          }}
        >
          ≈ $5,000.00 · Solana Network
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ padding: "16px 20px" }}>
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
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
            }}
          >
            {phase === "sending" ? "Transfer Progress" : "Escrow Progress"}
          </span>
          <span
            style={{
              fontSize: 11,
              color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)",
              fontWeight: 600,
            }}
          >
            {phase === "sending" ? "42%" : phase === "locking" ? "74%" : "100%"}
          </span>
        </div>
        <div
          style={{
            height: 3,
            borderRadius: 999,
            background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
            overflow: "hidden",
          }}
        >
          <motion.div
            style={{ height: "100%", borderRadius: 999 }}
            animate={{
              width: progressWidth,
              background:
                phase === "verified" || phase === "locked"
                  ? "linear-gradient(90deg, #3ddc84, #2ab870)"
                  : isDark
                    ? "linear-gradient(90deg, rgba(255,255,255,0.25), rgba(255,255,255,0.1))"
                    : "linear-gradient(90deg, rgba(0,0,0,0.25), rgba(0,0,0,0.1))",
            }}
            transition={{ duration: 0.9, ease: EASE }}
          />
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          margin: "0 20px",
          height: 1,
          background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
        }}
      />

      {/* Detail rows */}
      <div
        style={{
          padding: "14px 20px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 11,
        }}
      >
        {[
          {
            label: "Status",
            value: statusLabel,
            color: statusColor,
            dot: true,
          },
          {
            label: "Contract",
            value: "0x7a2f...3e91",
            color: isDark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.38)",
            mono: true,
          },
          {
            label: "Network",
            value: "Solana",
            color: isDark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.38)",
            solana: true,
          },
          {
            label: "Release",
            value: "On confirmation",
            color: isDark ? "rgba(255,255,255,0.32)" : "rgba(0,0,0,0.32)",
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
            <span
              style={{
                fontSize: 11.5,
                color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)",
              }}
            >
              {row.label}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {row.dot && (
                <motion.div
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: statusColor,
                  }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              {row.solana && (
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #a4d7e1, #14F195)",
                  }}
                />
              )}
              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: 500,
                  color: row.color,
                  fontFamily: row.mono ? "monospace" : undefined,
                }}
              >
                {row.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ padding: "12px 20px 20px" }}>
        <AnimatePresence mode="wait">
          {phase === "verified" ? (
            <motion.div
              key="verified"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                padding: "12px",
                borderRadius: 12,
                background: "rgba(61,220,132,0.08)",
                border: "1px solid rgba(61,220,132,0.2)",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Check
                style={{ width: 14, height: 14, color: "#3ddc84" }}
                strokeWidth={3}
              />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#3ddc84" }}>
                Verified &amp; Secured
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="pending"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                padding: "12px",
                borderRadius: 12,
                background: isDark
                  ? "rgba(255,255,255,0.03)"
                  : "rgba(0,0,0,0.03)",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                textAlign: "center",
              }}
            >
              <span
                style={{
                  fontSize: 11.5,
                  color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)",
                }}
              >
                {phase === "sending"
                  ? "Awaiting escrow lock..."
                  : phase === "locking"
                    ? "Deploying smart contract..."
                    : "Contract active · Awaiting confirmation"}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCENE 2 UI — MERCHANT DASHBOARD
   Live balance, locked escrow, active orders cycling through states
   ═══════════════════════════════════════════════════════════ */
type DashPhase = "escrowed" | "payment_sent" | "confirmed";

const DASH_PHASE_CFG = {
  escrowed: {
    label: "ESCROWED",
    color: "#a4d7e1",
    bg: "rgba(164,215,225,0.08)",
    border: "rgba(164,215,225,0.22)",
  },
  payment_sent: {
    label: "PAID",
    color: "#93c5fd",
    bg: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.22)",
  },
  confirmed: {
    label: "CONFIRMED",
    color: "#34d399",
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.22)",
  },
};

const COMPLETED_TX = [
  { usdc: "5,000", aed: "18,350", profit: "+50.00", time: "2m ago" },
  { usdc: "8,000", aed: "29,360", profit: "+80.00", time: "18m ago" },
  { usdc: "3,000", aed: "11,010", profit: "+30.00", time: "1h ago" },
];

const LEADERBOARD_MINI = [
  { rank: 1, name: "TrustMerchant22", vol: "420K", online: true },
  { rank: 2, name: "AliH_Dubai", vol: "280K", online: true },
  { rank: 3, name: "QuickSettle", vol: "195K", online: false },
  { rank: 4, name: "GlobalFX", vol: "140K", online: false },
];

function MerchantDashboardUI({
  active = true,
  isDark = true,
}: {
  active?: boolean;
  isDark?: boolean;
}) {
  const [earnings, setEarnings] = useState(124.5);
  const [balance, setBalance] = useState(12450.0);
  const [phase, setPhase] = useState<DashPhase>("escrowed");

  useEffect(() => {
    if (!active) return;
    const phases: DashPhase[] = ["escrowed", "payment_sent", "confirmed"];
    let idx = 0;
    const cycleId = setInterval(() => {
      idx = (idx + 1) % phases.length;
      setPhase(phases[idx]);
      if (phases[idx] === "confirmed") {
        setTimeout(() => {
          setEarnings((e) => parseFloat((e + 50).toFixed(2)));
          setBalance((b) => b + 50);
        }, 400);
      }
    }, 2600);
    return () => clearInterval(cycleId);
  }, [active]);

  const cfg = DASH_PHASE_CFG[phase];

  return (
    <div
      style={{
        width: 660,
        background: isDark ? "#08080e" : "#ffffff",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: isDark
          ? "0 0 80px rgba(251,146,60,0.07), 0 30px 60px rgba(0,0,0,0.65)"
          : "0 0 80px rgba(251,146,60,0.05), 0 30px 60px rgba(0,0,0,0.08)",
      }}
    >
      {/* ── App chrome ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 16px",
          background: isDark ? "#0f0f14" : "#f5f5f5",
          borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
        }}
      >
        <div className="flex gap-1.5">
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#ff5f56",
            }}
          />
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#ffbd2e",
            }}
          />
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#27c93f",
            }}
          />
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "3px 10px",
            background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
            borderRadius: 6,
            fontSize: 10,
            color: isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.28)",
            fontFamily: "monospace",
            maxWidth: 280,
            margin: "0 auto",
          }}
        >
          <span style={{ color: "#3ddc84" }}>⚡</span> merchant.blip.money
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#3ddc84",
              boxShadow: "0 0 4px #3ddc84",
            }}
          />
          <span
            style={{
              fontSize: 9,
              color: "#3ddc84",
              fontFamily: "monospace",
              fontWeight: 700,
            }}
          >
            ONLINE
          </span>
        </div>
      </div>

      {/* ── 3-panel body ── */}
      <div style={{ display: "flex", minHeight: 380 }}>
        {/* Panel 1 — Balance */}
        <div
          style={{
            width: 190,
            flexShrink: 0,
            borderRight: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
            display: "flex",
            flexDirection: "column",
            gap: 0,
          }}
        >
          {/* Balance */}
          <div
            style={{
              padding: "16px 14px 14px",
              borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
            }}
          >
            <div
              style={{
                fontSize: 8,
                color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)",
                fontFamily: "monospace",
                textTransform: "uppercase",
                letterSpacing: "2px",
                marginBottom: 6,
              }}
            >
              Available
            </div>
            <motion.div
              key={Math.floor(balance)}
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 1 }}
              style={{
                fontSize: 22,
                fontWeight: 700,
                fontFamily: "monospace",
                color: isDark ? "#fff" : "#000",
                letterSpacing: "-0.04em",
                lineHeight: 1,
              }}
            >
              {balance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </motion.div>
            <div
              style={{
                fontSize: 9,
                color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
                fontFamily: "monospace",
                marginTop: 3,
              }}
            >
              USDC
            </div>
          </div>

          {/* Locked */}
          <div
            style={{
              padding: "12px 14px",
              borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
              background: "rgba(164,215,225,0.03)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                marginBottom: 5,
              }}
            >
              <Lock
                style={{ width: 9, height: 9, color: "rgba(164,215,225,0.6)" }}
              />
              <span
                style={{
                  fontSize: 8,
                  color: "rgba(164,215,225,0.5)",
                  fontFamily: "monospace",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                }}
              >
                Locked
              </span>
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                fontFamily: "monospace",
                color: "#a4d7e1",
                letterSpacing: "-0.03em",
              }}
            >
              3,200{" "}
              <span style={{ fontSize: 9, color: "rgba(164,215,225,0.45)" }}>
                USDC
              </span>
            </div>
          </div>

          {/* Today */}
          <div
            style={{
              padding: "12px 14px",
              borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
              background: "rgba(52,211,153,0.025)",
            }}
          >
            <div
              style={{
                fontSize: 8,
                color: "rgba(52,211,153,0.5)",
                fontFamily: "monospace",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                marginBottom: 5,
              }}
            >
              Today
            </div>
            <motion.div
              key={Math.floor(earnings)}
              initial={{ y: -4, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                fontSize: 16,
                fontWeight: 700,
                fontFamily: "monospace",
                color: "#34d399",
                letterSpacing: "-0.03em",
              }}
            >
              +${earnings.toFixed(2)}
            </motion.div>
          </div>

          {/* Rate */}
          <div
            style={{
              padding: "12px 14px",
              borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
            }}
          >
            <div
              style={{
                fontSize: 8,
                color: isDark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.22)",
                fontFamily: "monospace",
                marginBottom: 5,
              }}
            >
              AED / USDC
            </div>
            <div
              style={{
                fontSize: 17,
                fontWeight: 700,
                fontFamily: "monospace",
                color: "#fb923c",
              }}
            >
              3.6700
            </div>
            <div
              style={{
                fontSize: 8,
                color: isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.18)",
                fontFamily: "monospace",
                marginTop: 3,
              }}
            >
              5m: $42.5K · 12 live
            </div>
          </div>

          {/* Stats */}
          <div
            style={{
              marginTop: "auto",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
            }}
          >
            {[
              { val: "47", lbl: "Done" },
              { val: "#7", lbl: "Rank" },
            ].map((s, i) => (
              <div
                key={s.lbl}
                style={{
                  padding: "10px 0",
                  textAlign: "center",
                  borderRight:
                    i === 0
                      ? `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`
                      : undefined,
                }}
              >
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    fontFamily: "monospace",
                    color: isDark ? "#fff" : "#000",
                  }}
                >
                  {s.val}
                </div>
                <div
                  style={{
                    fontSize: 7,
                    color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    marginTop: 2,
                  }}
                >
                  {s.lbl}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 2 — Active Orders */}
        <div
          style={{
            flex: 1,
            borderRight: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
            display: "flex",
            flexDirection: "column",
            padding: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 10,
            }}
          >
            <Activity
              style={{
                width: 10,
                height: 10,
                color: isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.28)",
              }}
            />
            <span
              style={{
                fontSize: 9,
                fontWeight: 600,
                color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
                fontFamily: "monospace",
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
            >
              In Progress
            </span>
            <span
              style={{
                marginLeft: "auto",
                fontSize: 8,
                padding: "1px 7px",
                borderRadius: 999,
                background: "rgba(255,107,53,0.12)",
                border: "1px solid rgba(255,107,53,0.22)",
                color: "#fb923c",
                fontFamily: "monospace",
              }}
            >
              2 ACTIVE
            </span>
          </div>

          {/* Order 1 — animated */}
          <motion.div
            animate={{ background: cfg.bg, borderColor: cfg.border }}
            transition={{ duration: 0.45 }}
            style={{
              padding: "10px 11px",
              borderRadius: 10,
              border: "1px solid",
              marginBottom: 7,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 7,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: isDark
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.08)",
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 8,
                    fontWeight: 700,
                    color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
                  }}
                >
                  AH
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: isDark
                        ? "rgba(255,255,255,0.65)"
                        : "rgba(0,0,0,0.65)",
                    }}
                  >
                    Ali Hassan
                  </div>
                  <span
                    style={{
                      fontSize: 7,
                      fontWeight: 700,
                      fontFamily: "monospace",
                      padding: "1px 4px",
                      borderRadius: 3,
                      background: "rgba(255,107,53,0.1)",
                      border: "1px solid rgba(255,107,53,0.2)",
                      color: "#fb923c",
                    }}
                  >
                    SELL
                  </span>
                </div>
              </div>
              <motion.span
                key={phase}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                  fontSize: 8,
                  fontWeight: 700,
                  fontFamily: "monospace",
                  padding: "2px 7px",
                  borderRadius: 4,
                  border: `1px solid ${cfg.border}`,
                  color: cfg.color,
                  background: cfg.bg,
                }}
              >
                {cfg.label}
              </motion.span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 0",
                borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: "monospace",
                  color: isDark ? "#fff" : "#000",
                  letterSpacing: "-0.03em",
                }}
              >
                5,000{" "}
                <span
                  style={{
                    fontSize: 9,
                    color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
                  }}
                >
                  USDC
                </span>
              </span>
              <ArrowRight
                style={{
                  width: 10,
                  height: 10,
                  color: isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.18)",
                }}
              />
              <span
                style={{
                  fontSize: 12,
                  fontFamily: "monospace",
                  color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
                }}
              >
                18,350 AED
              </span>
            </div>
          </motion.div>

          {/* Order 2 — static */}
          <div
            style={{
              padding: "9px 11px",
              borderRadius: 10,
              border: "1px solid rgba(59,130,246,0.2)",
              background: "rgba(59,130,246,0.04)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                marginBottom: 6,
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: isDark
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(0,0,0,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 8,
                  fontWeight: 700,
                  color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
                }}
              >
                TM
              </div>
              <span
                style={{
                  fontSize: 10,
                  color: isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)",
                }}
              >
                TrustMerchant22
              </span>
              <span
                style={{
                  fontSize: 7,
                  fontWeight: 700,
                  fontFamily: "monospace",
                  padding: "1px 4px",
                  borderRadius: 3,
                  background: isDark
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(0,0,0,0.06)",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                  color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
                }}
              >
                BUY
              </span>
              <span
                style={{
                  marginLeft: "auto",
                  fontSize: 8,
                  fontWeight: 700,
                  fontFamily: "monospace",
                  padding: "2px 7px",
                  borderRadius: 4,
                  border: "1px solid rgba(59,130,246,0.2)",
                  color: "#93c5fd",
                  background: "rgba(59,130,246,0.07)",
                }}
              >
                PAID
              </span>
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                fontFamily: "monospace",
                color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)",
                letterSpacing: "-0.03em",
              }}
            >
              2,000{" "}
              <span
                style={{
                  fontSize: 9,
                  color: isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.28)",
                }}
              >
                USDC
              </span>{" "}
              <span
                style={{
                  fontSize: 10,
                  color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
                }}
              >
                →
              </span>{" "}
              <span
                style={{
                  fontSize: 11,
                  color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)",
                }}
              >
                7,340 AED
              </span>
            </div>
          </div>

          {/* Completed mini */}
          <div style={{ marginTop: 10, flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                marginBottom: 6,
              }}
            >
              <CheckCircle2
                style={{
                  width: 9,
                  height: 9,
                  color: isDark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.22)",
                }}
              />
              <span
                style={{
                  fontSize: 8,
                  color: isDark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.22)",
                  fontFamily: "monospace",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                }}
              >
                Completed today
              </span>
            </div>
            {COMPLETED_TX.map((tx, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "5px 8px",
                  borderRadius: 7,
                  background: isDark
                    ? "rgba(255,255,255,0.02)"
                    : "rgba(0,0,0,0.02)",
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
                  marginBottom: 4,
                }}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "rgba(52,211,153,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <CheckCircle2
                    style={{ width: 8, height: 8, color: "#34d399" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <span
                    style={{
                      fontSize: 9,
                      fontFamily: "monospace",
                      color: isDark
                        ? "rgba(255,255,255,0.5)"
                        : "rgba(0,0,0,0.5)",
                    }}
                  >
                    {tx.usdc} USDC
                  </span>
                  <span
                    style={{
                      fontSize: 8,
                      color: isDark
                        ? "rgba(255,255,255,0.18)"
                        : "rgba(0,0,0,0.18)",
                      fontFamily: "monospace",
                      marginLeft: 4,
                    }}
                  >
                    {tx.time}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    fontFamily: "monospace",
                    color: "#34d399",
                  }}
                >
                  {tx.profit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 3 — Leaderboard */}
        <div style={{ width: 180, flexShrink: 0, padding: "12px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              marginBottom: 10,
            }}
          >
            <Star
              style={{
                width: 9,
                height: 9,
                color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)",
              }}
            />
            <span
              style={{
                fontSize: 9,
                fontWeight: 600,
                color: isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.28)",
                fontFamily: "monospace",
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
            >
              Leaderboard
            </span>
          </div>
          {LEADERBOARD_MINI.map((m, i) => (
            <div
              key={m.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "6px 8px",
                borderRadius: 7,
                marginBottom: 4,
                ...(i === 0
                  ? {
                      background: isDark
                        ? "rgba(255,255,255,0.04)"
                        : "rgba(0,0,0,0.04)",
                      border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
                    }
                  : {}),
              }}
            >
              <span
                style={{
                  fontSize: 8,
                  fontFamily: "monospace",
                  color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
                  width: 14,
                }}
              >
                #{m.rank}
              </span>
              <div
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: m.online
                    ? "#3ddc84"
                    : isDark
                      ? "rgba(255,255,255,0.2)"
                      : "rgba(0,0,0,0.2)",
                  flexShrink: 0,
                  ...(m.online ? { boxShadow: "0 0 4px #3ddc84" } : {}),
                }}
              />
              <span
                style={{
                  fontSize: 9,
                  fontFamily: "monospace",
                  color: isDark ? "rgba(255,255,255,0.42)" : "rgba(0,0,0,0.42)",
                  flex: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {m.name}
              </span>
              <span
                style={{
                  fontSize: 8,
                  fontFamily: "monospace",
                  color: isDark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.22)",
                  flexShrink: 0,
                }}
              >
                ${m.vol}
              </span>
            </div>
          ))}

          {/* Reputation mini */}
          <div
            style={{
              marginTop: 12,
              padding: "10px 10px",
              borderRadius: 10,
              background: "rgba(255,107,53,0.05)",
              border: "1px solid rgba(255,107,53,0.15)",
            }}
          >
            <div
              style={{
                fontSize: 7,
                color: "rgba(255,107,53,0.6)",
                fontFamily: "monospace",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                marginBottom: 6,
              }}
            >
              Your Score
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                fontFamily: "monospace",
                color: "#fb923c",
                marginBottom: 2,
              }}
            >
              847
            </div>
            <div style={{ fontSize: 8, color: "rgba(255,107,53,0.5)" }}>
              Gold tier · Top 5%
            </div>
            <div
              style={{
                marginTop: 8,
                height: 3,
                borderRadius: 999,
                background: isDark
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(0,0,0,0.06)",
              }}
            >
              <motion.div
                style={{
                  height: "100%",
                  borderRadius: 999,
                  background: "linear-gradient(90deg, #fb923c, #fbbf24)",
                }}
                initial={{ width: "0%" }}
                animate={{ width: "72%" }}
                transition={{
                  duration: 1.5,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.5,
                }}
              />
            </div>
          </div>

          {/* Notification */}
          <div
            style={{
              marginTop: 8,
              padding: "8px 10px",
              borderRadius: 8,
              background: "rgba(52,211,153,0.04)",
              border: "1px solid rgba(52,211,153,0.14)",
            }}
          >
            <div
              style={{
                fontSize: 8,
                color: "rgba(52,211,153,0.7)",
                fontFamily: "monospace",
                fontWeight: 700,
                marginBottom: 3,
              }}
            >
              ✓ Settlement complete
            </div>
            <div
              style={{
                fontSize: 7,
                color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)",
              }}
            >
              5,000 USDC → 18,350 AED
            </div>
            <div
              style={{
                fontSize: 7,
                color: isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.18)",
              }}
            >
              2m ago · #BM7F2X
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCENE 2 UI — INSTANT BIDDING
   Live bid rates fluctuating, countdown timer
   ═══════════════════════════════════════════════════════════ */
const INITIAL_BIDS = [
  {
    id: 1,
    name: "QuickSwap Pro",
    avatar: "QS",
    rate: 3.672,
    trades: 2847,
    time: "~30s",
    best: true,
  },
  {
    id: 2,
    name: "FastSettle UAE",
    avatar: "FS",
    rate: 3.668,
    trades: 1923,
    time: "~45s",
    best: false,
  },
  {
    id: 3,
    name: "DubaiExchange",
    avatar: "DE",
    rate: 3.665,
    trades: 3102,
    time: "~60s",
    best: false,
  },
  {
    id: 4,
    name: "GulfTrade",
    avatar: "GT",
    rate: 3.66,
    trades: 892,
    time: "~90s",
    best: false,
  },
];

function BiddingUI({
  active = true,
  isDark = true,
}: {
  active?: boolean;
  isDark?: boolean;
}) {
  const [bids, setBids] = useState(INITIAL_BIDS);
  const [countdown, setCountdown] = useState(15);
  const [matched, setMatched] = useState(false);

  useEffect(() => {
    if (!active) return;
    let resetTimer: ReturnType<typeof setTimeout>;
    const rateId = setInterval(() => {
      setBids((prev) => {
        const updated = prev
          .map((b) => ({
            ...b,
            rate: parseFloat(
              (b.rate + (Math.random() - 0.48) * 0.004).toFixed(3),
            ),
          }))
          .sort((a, b) => b.rate - a.rate)
          .map((b, i) => ({ ...b, best: i === 0 }));
        return updated;
      });
    }, 1200);

    const cdId = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          setMatched(true);
          resetTimer = setTimeout(() => {
            setMatched(false);
            setCountdown(15);
          }, 2200);
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => {
      clearInterval(rateId);
      clearInterval(cdId);
      clearTimeout(resetTimer);
    };
  }, [active]);

  const bestBid = bids[0];

  return (
    <div
      className={`w-[560px] rounded-2xl overflow-hidden border ${isDark ? "border-white/[0.08] bg-[#0a0a0a] shadow-[0_30px_60px_rgba(0,0,0,0.5),0_0_80px_rgba(255,107,53,0.06)]" : "border-black/[0.08] bg-white shadow-[0_30px_60px_rgba(0,0,0,0.08),0_0_80px_rgba(255,107,53,0.04)]"}`}
    >
      {/* Browser chrome — matches InstantBiddingSection exactly */}
      <div
        className={`flex items-center gap-3 px-5 py-3.5 ${isDark ? "bg-[#111] border-b border-white/[0.06]" : "bg-[#f5f5f5] border-b border-black/[0.06]"}`}
      >
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28ca42]" />
        </div>
        <div className="flex-1 flex justify-center">
          <div
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg w-full max-w-[300px] ${isDark ? "bg-white/[0.03] border border-white/[0.06]" : "bg-black/[0.03] border border-black/[0.06]"}`}
          >
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${isDark ? "bg-white/10" : "bg-black/10"}`}
            >
              <Lock
                className={`w-2.5 h-2.5 ${isDark ? "text-white/40" : "text-black/40"}`}
              />
            </div>
            <span
              className={`text-xs font-mono truncate flex-1 ${isDark ? "text-white/30" : "text-black/30"}`}
            >
              settle.blipprotocol.com/merchant
            </span>
            <div className="flex items-center gap-1.5 ml-auto shrink-0">
              <motion.div
                className="w-2 h-2 rounded-full bg-[#ff6b35]"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-[10px] text-[#ff6b35] font-bold tracking-wide">
                LIVE
              </span>
            </div>
          </div>
        </div>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isDark ? "bg-white/[0.08] text-white/60" : "bg-black/[0.08] text-black/60"}`}
        >
          M
        </div>
      </div>

      {/* Dashboard content */}
      <div className={`p-5 ${isDark ? "text-white" : "text-black"}`}>
        {/* Order header + timer */}
        <div
          className={`flex items-center justify-between mb-5 pb-4 border-b ${isDark ? "border-white/[0.06]" : "border-black/[0.06]"}`}
        >
          <div>
            <div
              className={`text-[10px] uppercase tracking-widest mb-1 ${isDark ? "text-white/30" : "text-black/30"}`}
            >
              Active Order · #BLP-8472
            </div>
            <div className="text-2xl font-bold tracking-tight">
              5,000 USDT → AED
            </div>
          </div>
          <div className="text-center">
            <div
              className={`text-[10px] uppercase tracking-widest mb-1 ${isDark ? "text-white/30" : "text-black/30"}`}
            >
              Match in
            </div>
            <AnimatePresence mode="wait">
              {matched ? (
                <motion.div
                  key="m"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Check className="w-6 h-6 text-emerald-400" />
                </motion.div>
              ) : (
                <motion.div
                  key={countdown}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className={`text-xl font-bold font-mono tracking-tight ${countdown <= 5 ? "text-[#ff6b35]" : isDark ? "text-white" : "text-black"}`}
                >
                  {`00:${countdown.toString().padStart(2, "0")}`}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bids header */}
        <div className="flex items-center justify-between mb-3">
          <h3
            className={`text-sm font-bold ${isDark ? "text-white" : "text-black"}`}
          >
            Live Merchant Bids
          </h3>
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${isDark ? "bg-white/40" : "bg-black/40"}`}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
              />
            ))}
          </div>
        </div>

        {/* Bid cards — same structure as InstantBiddingSection */}
        <div className="space-y-2.5">
          {bids.map((bid) => (
            <motion.div
              key={bid.id}
              layout
              animate={{
                background: bid.best
                  ? isDark
                    ? "rgba(255,255,255,0.07)"
                    : "rgba(0,0,0,0.07)"
                  : isDark
                    ? "rgba(255,255,255,0.025)"
                    : "rgba(0,0,0,0.025)",
                borderColor: bid.best
                  ? isDark
                    ? "rgba(255,255,255,0.18)"
                    : "rgba(0,0,0,0.18)"
                  : isDark
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(0,0,0,0.06)",
              }}
              transition={{ duration: 0.35 }}
              className="p-3.5 rounded-xl border"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold ${
                      bid.best
                        ? isDark
                          ? "bg-white/10 text-white/80"
                          : "bg-black/10 text-black/80"
                        : isDark
                          ? "bg-white/[0.05] text-white/40"
                          : "bg-black/[0.05] text-black/40"
                    }`}
                  >
                    {bid.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className={`text-sm font-semibold ${bid.best ? (isDark ? "text-white" : "text-black") : isDark ? "text-white/55" : "text-black/55"}`}
                      >
                        {bid.name}
                      </span>
                      {bid.best && (
                        <motion.span
                          layout
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${isDark ? "bg-white/10 text-white/70" : "bg-black/10 text-black/70"}`}
                        >
                          Best Rate
                        </motion.span>
                      )}
                    </div>
                    <div
                      className={`text-xs ${isDark ? "text-white/30" : "text-black/30"}`}
                    >
                      {bid.trades.toLocaleString("en-US")} trades · ETA{" "}
                      {bid.time}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <motion.div
                      className="text-lg font-bold"
                      animate={{
                        color: bid.best
                          ? isDark
                            ? "#ffffff"
                            : "#000000"
                          : isDark
                            ? "rgba(255,255,255,0.4)"
                            : "rgba(0,0,0,0.4)",
                      }}
                    >
                      {bid.rate.toFixed(3)}{" "}
                      <span
                        className={`text-xs font-normal ${isDark ? "text-white/30" : "text-black/30"}`}
                      >
                        AED
                      </span>
                    </motion.div>
                    <div
                      className={`text-xs ${isDark ? "text-white/30" : "text-black/30"}`}
                    >
                      ≈{" "}
                      {(bid.rate * 5000).toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}{" "}
                      AED
                    </div>
                  </div>
                  <motion.div
                    className={`w-3 h-3 rounded-full ${bid.best ? (isDark ? "bg-white/60" : "bg-black/60") : isDark ? "bg-white/20" : "bg-black/20"}`}
                    animate={bid.best ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Auto-select footer */}
        <div
          className={`mt-3 p-3.5 rounded-xl flex items-center gap-3 ${isDark ? "bg-white/[0.03] border border-white/[0.06]" : "bg-black/[0.03] border border-black/[0.06]"}`}
        >
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? "bg-white/10" : "bg-black/10"}`}
          >
            <Zap
              className={`w-4 h-4 ${isDark ? "text-white/60" : "text-black/60"}`}
            />
          </div>
          <div>
            <span
              className={`text-sm font-medium ${isDark ? "text-white/70" : "text-black/70"}`}
            >
              Auto-selecting best offer
            </span>
            <span
              className={`text-xs block ${isDark ? "text-white/35" : "text-black/35"}`}
            >
              You'll receive ~
              {(bestBid?.rate * 5000).toLocaleString("en-US", {
                maximumFractionDigits: 0,
              })}{" "}
              AED in ~30 seconds
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCENE 3 UI — BLIPSCAN EXPLORER
   Live transactions appearing every 2.2s
   ═══════════════════════════════════════════════════════════ */
const TX_NAMES = [
  "Ahmed M.",
  "Sarah K.",
  "James O.",
  "Maria G.",
  "Alex T.",
  "Emma S.",
];
const TX_ADDRS = ["0x8a9...3f2", "0x3b7...9k1", "0x7c4...2m8", "0x1a2...4b5"];
const TX_INITIAL = [
  {
    id: "BLP-7X2K",
    from: "0x8a9...3f2",
    to: "Ahmed M.",
    amount: "$5,750",
    age: "2s",
    isNew: false,
  },
  {
    id: "BLP-4MR8",
    from: "0x3b7...9k1",
    to: "Sarah K.",
    amount: "$12,867",
    age: "5s",
    isNew: false,
  },
  {
    id: "BLP-9PT4",
    from: "0x7c4...2m8",
    to: "James O.",
    amount: "$7,589",
    age: "9s",
    isNew: false,
  },
  {
    id: "BLP-2NQ7",
    from: "0x1a2...4b5",
    to: "Maria G.",
    amount: "$3,220",
    age: "12s",
    isNew: false,
  },
];

function ExplorerUI({
  active = true,
  isDark = true,
}: {
  active?: boolean;
  isDark?: boolean;
}) {
  const [txs, setTxs] = useState(TX_INITIAL);
  const [block, setBlock] = useState(241_847_293);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      const newTx = {
        id: `BLP-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        from: TX_ADDRS[Math.floor(Math.random() * TX_ADDRS.length)],
        to: TX_NAMES[Math.floor(Math.random() * TX_NAMES.length)],
        amount: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(Math.floor(Math.random() * 15000) + 1000),
        age: "Just now",
        isNew: true,
      };
      setTxs((prev) =>
        [newTx, ...prev.slice(0, 4)].map((t, i) => ({
          ...t,
          isNew: i === 0,
        })),
      );
      setBlock((b) => b + Math.floor(Math.random() * 3) + 1);
    }, 2200);
    return () => clearInterval(id);
  }, [active]);

  return (
    <div
      className={`w-[540px] rounded-2xl border backdrop-blur-xl overflow-hidden ${isDark ? "border-white/[0.06] bg-black/40 shadow-[0_8px_60px_-12px_rgba(0,0,0,0.8)]" : "border-black/[0.06] bg-white/80 shadow-[0_8px_60px_-12px_rgba(0,0,0,0.1)]"}`}
    >
      {/* Browser chrome — matches BlipscanExplorerSection exactly */}
      <div
        className={`flex items-center justify-between px-5 py-3.5 border-b ${isDark ? "bg-black/60 border-white/[0.06]" : "bg-black/[0.03] border-black/[0.06]"}`}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28ca42]" />
          </div>
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${isDark ? "bg-white/[0.03] border border-white/[0.04]" : "bg-black/[0.03] border border-black/[0.04]"}`}
          >
            <Globe
              className={`w-3.5 h-3.5 ${isDark ? "text-white/30" : "text-black/30"}`}
            />
            <span
              className={`text-xs font-mono ${isDark ? "text-white/40" : "text-black/40"}`}
            >
              blipscan.io/explorer
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full bg-emerald-400"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-xs text-emerald-400 font-medium">
            Live · Solana
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div
        className={`grid grid-cols-4 border-b ${isDark ? "border-white/[0.05]" : "border-black/[0.05]"}`}
      >
        {[
          { label: "Block", value: block.toLocaleString("en-US") },
          { label: "24h Volume", value: "$2.4M" },
          { label: "Settled", value: "12,847" },
          { label: "Avg Speed", value: "1.8s" },
        ].map((s, i) => (
          <div
            key={s.label}
            className={`text-center p-3 ${i < 3 ? (isDark ? "border-r border-white/[0.05]" : "border-r border-black/[0.05]") : ""}`}
          >
            <motion.div
              key={s.value}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              className={`text-[15px] font-bold mb-0.5 ${isDark ? "text-white" : "text-black"}`}
            >
              {s.value}
            </motion.div>
            <div
              className={`text-[9px] uppercase tracking-[1.5px] ${isDark ? "text-white/20" : "text-black/20"}`}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Transaction list */}
      <div className="p-4">
        <div className="flex items-center justify-between px-1 mb-2.5">
          <span
            className={`text-[9px] uppercase tracking-[2px] font-medium ${isDark ? "text-white/20" : "text-black/20"}`}
          >
            Recent Settlements
          </span>
          <div className="flex items-center gap-1.5">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-[#14F195]"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-[10px] text-[#14F195]">Live</span>
          </div>
        </div>

        <AnimatePresence mode="popLayout">
          {txs.map((tx) => (
            <motion.div
              key={tx.id}
              layout="position"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
                layout: { duration: 0.6, ease: EASE },
              }}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl border mb-1.5 ${isDark ? "border-white/[0.04]" : "border-black/[0.04]"}`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isDark ? "bg-white/[0.06] border border-white/[0.08]" : "bg-black/[0.04] border border-black/[0.06]"}`}>
                  <Check
                    className={`w-3.5 h-3.5 ${isDark ? "text-white/50" : "text-black/40"}`}
                    strokeWidth={2.5}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span
                      className={`text-[11px] font-mono truncate ${isDark ? "text-white/40" : "text-black/40"}`}
                    >
                      {tx.id}
                    </span>
                    <span
                      className={`text-[11px] ${isDark ? "text-white/20" : "text-black/20"}`}
                    >
                      →
                    </span>
                    <span
                      className={`text-[13px] font-semibold truncate ${isDark ? "text-white" : "text-black"}`}
                    >
                      {tx.to}
                    </span>
                    {tx.isNew && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`px-1.5 py-px rounded-full text-[8px] font-bold whitespace-nowrap ${isDark ? "bg-white/[0.08] border border-white/[0.12] text-white/60" : "bg-black/[0.06] border border-black/[0.08] text-black/50"}`}
                      >
                        NEW
                      </motion.span>
                    )}
                  </div>
                  <div
                    className={`text-[10px] font-mono truncate ${isDark ? "text-white/20" : "text-black/20"}`}
                  >
                    {tx.from}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <div className="text-right">
                  <div
                    className={`text-[13px] font-semibold ${isDark ? "text-white" : "text-black"}`}
                  >
                    {tx.amount}
                  </div>
                  <div
                    className={`text-[9px] ${isDark ? "text-white/25" : "text-black/25"}`}
                  >
                    USDT
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-lg ${isDark ? "bg-white/[0.04] border border-white/[0.06]" : "bg-black/[0.03] border border-black/[0.05]"}`}>
                  <span className={`text-[10px] ${isDark ? "text-white/35" : "text-black/35"}`}>{tx.age}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <div
          className={`flex items-center justify-between mt-2 pt-2.5 border-t ${isDark ? "border-white/[0.04]" : "border-black/[0.04]"}`}
        >
          <div className="flex items-center gap-1.5">
            <div
              className={`w-1.5 h-1.5 rounded-full ${isDark ? "bg-white/15" : "bg-black/15"}`}
            />
            <span
              className={`text-[10px] ${isDark ? "text-white/20" : "text-black/20"}`}
            >
              Powered by Blip Protocol
            </span>
          </div>
          <div
            className={`flex items-center gap-1 text-[10px] cursor-pointer transition-colors ${isDark ? "text-white/40 hover:text-white/70" : "text-black/40 hover:text-black/70"}`}
          >
            View Explorer <ArrowRight className="w-2.5 h-2.5" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   FEATURES DATA
   ═══════════════════════════════════════════════════════════ */
const FEATURES_DATA = [
  {
    eyebrow: "01 · Escrow",
    headline: ["Funds locked.", "Always."] as [string, string],
    subline:
      "Smart contracts hold every dollar until both sides confirm. No bank. No trust required.",
    bullets: [
      "Non-custodial smart contracts",
      "Instant on-chain lock",
      "Auto-release on confirmation",
    ],
    accent: "#3ddc84",
  },
  {
    eyebrow: "02 · Merchant Console",
    headline: ["Your dashboard.", "Always on."] as [string, string],
    subline:
      "Real-time balance, escrow visibility, and order lifecycle — all in one merchant view.",
    bullets: [
      "Live balance & escrow tracking",
      "Order status in real-time",
      "Reputation & leaderboard",
    ],
    accent: "#fb923c",
  },
  {
    eyebrow: "03 · Matching",
    headline: ["Best rate.", "Every time."] as [string, string],
    subline:
      "150+ merchants compete in real-time. You automatically get the winner.",
    bullets: [
      "150+ verified merchants",
      "Real-time competitive pricing",
      "Auto-select best offer",
    ],
    accent: "#a4d7e1",
  },
  {
    eyebrow: "04 · Verification",
    headline: ["On-chain.", "Forever."] as [string, string],
    subline:
      "Every settlement is public and immutable on BlipScan. Verifiable by anyone.",
    bullets: [
      "Immutable on-chain record",
      "Verifiable by anyone",
      "Real-time explorer",
    ],
    accent: "#14F195",
  },
];

function FeatureRow({
  feature,
  visual,
  index,
  isDark,
}: {
  feature: (typeof FEATURES_DATA)[0];
  visual: React.ReactNode;
  index: number;
  isDark: boolean;
}) {
  const isEven = index % 2 === 0;

  return (
    <div className="relative">
      {/* Subtle accent glow behind visual */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          background: `radial-gradient(ellipse 60% 50% at ${isEven ? "70%" : "30%"} 50%, ${feature.accent}, transparent)`,
        }}
      />

      <div
        className={`w-full max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center ${
          isEven ? "" : "direction-rtl"
        }`}
        style={{ direction: isEven ? "ltr" : "rtl" }}
      >
        {/* Text side */}
        <motion.div
          initial={{ opacity: 0, x: isEven ? -40 : 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{ direction: "ltr" }}
        >
          {/* Number + accent line */}
          <div className="flex items-center gap-4 mb-8">
            <span
              className="text-[11px] uppercase tracking-[0.3em] font-semibold"
              style={{ color: feature.accent }}
            >
              {feature.eyebrow}
            </span>
            <div
              className="flex-1 h-px"
              style={{
                background: `linear-gradient(90deg, ${feature.accent}40, transparent)`,
              }}
            />
          </div>

          {/* Headline */}
          <h2
            className={`font-display ${isDark ? "text-white" : "text-black"}`}
            style={{
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              marginBottom: 24,
            }}
          >
            {feature.headline[0]}
            <br />
            <span
              style={{
                color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.35)",
              }}
            >
              {feature.headline[1]}
            </span>
          </h2>

          {/* Subline */}
          <p
            className={`text-base md:text-lg leading-relaxed mb-8 max-w-[440px] ${
              isDark ? "text-white/40" : "text-black/60"
            }`}
          >
            {feature.subline}
          </p>

          {/* Bullets — vertical list */}
          <div className="flex flex-col gap-3">
            {feature.bullets.map((b, bi) => (
              <motion.div
                key={b}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.5,
                  ease: EASE,
                  delay: 0.15 + bi * 0.08,
                }}
                className="flex items-center gap-3"
              >
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `${feature.accent}12`,
                    border: `1px solid ${feature.accent}25`,
                  }}
                >
                  <Check
                    style={{ width: 11, height: 11, color: feature.accent }}
                    strokeWidth={2.5}
                  />
                </div>
                <span
                  className={`text-sm md:text-[15px] ${
                    isDark ? "text-white/50" : "text-black/65"
                  }`}
                >
                  {b}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Visual side */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
          className="flex items-center justify-center"
          style={{ direction: "ltr" }}
        >
          {visual}
        </motion.div>
      </div>
    </div>
  );
}

export default function FeatureCinemaSection() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const visuals = [
    <EscrowUI key={0} isDark={isDark} />,
    <div
      key={1}
      style={{
        width: 560,
        height: 420,
        position: "relative",
        overflow: "hidden",
        borderRadius: 16,
      }}
    >
      <div
        style={{
          transform: "scale(0.46)",
          transformOrigin: "top left",
          width: 1220,
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <MerchantDashboardVisual />
      </div>
    </div>,
    <BiddingUI key={2} isDark={isDark} />,
    <ExplorerUI key={3} isDark={isDark} />,
  ];

  return (
    <div
      className={isDark ? "bg-black" : "bg-[#FAF8F5]"}
      style={{ position: "relative", overflow: "hidden" }}
    >
      {/* Section header */}
      <div className="flex flex-col items-center pt-24 md:pt-32 pb-20 md:pb-28 px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex items-center gap-2.5 px-5 py-2.5 rounded-full mb-8"
          style={{
            background: isDark
              ? "rgba(255,255,255,0.04)"
              : "rgba(0,0,0,0.04)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
          }}
        >
          <Shield
            style={{
              width: 13,
              height: 13,
              color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
            }}
          />
          <span
            className={`text-[11px] uppercase tracking-[0.3em] font-medium ${
              isDark ? "text-white/30" : "text-black/30"
            }`}
          >
            Core Features
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          className={`text-center font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight ${
            isDark ? "text-white" : "text-black"
          }`}
          style={{ letterSpacing: "-0.04em", lineHeight: 1.08 }}
        >
          Built for trust.
          <br />
          <span
            className={isDark ? "text-white/25" : "text-black/30"}
          >
            Designed for speed.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
          className={`text-center text-base md:text-lg mt-6 max-w-lg ${
            isDark ? "text-white/35" : "text-black/50"
          }`}
        >
          Every layer of Blip Protocol is engineered for secure, instant
          settlements — from escrow to verification.
        </motion.p>
      </div>

      {/* Feature rows */}
      <div className="flex flex-col gap-28 md:gap-40 pb-28 md:pb-40">
        {FEATURES_DATA.map((f, i) => (
          <FeatureRow
            key={i}
            feature={f}
            visual={visuals[i]}
            index={i}
            isDark={isDark}
          />
        ))}
      </div>
    </div>
  );
}
