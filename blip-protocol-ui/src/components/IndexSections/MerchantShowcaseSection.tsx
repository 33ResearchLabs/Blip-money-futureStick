import { motion } from "framer-motion";
import {
  Shield,
  TrendingUp,
  Activity,
  CheckCircle2,
  Lock,
  Star,
  ArrowRight,
  Zap,
  ChevronRight,
} from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ── Static mock data matching the real Blip merchant dashboard ── */
const IN_PROGRESS = [
  {
    id: "BM7F2X",
    initials: "AH",
    name: "Ali Hassan",
    type: "buy" as const,
    usdc: "5,000",
    aed: "18,350",
    rate: "3.6700",
    status: "escrowed" as const,
    timer: "08:42",
    nextAction: "Confirm Payment",
  },
  {
    id: "BM3R9K",
    initials: "TM",
    name: "TrustMerchant22",
    type: "sell" as const,
    usdc: "2,000",
    aed: "7,340",
    rate: "3.6700",
    status: "payment_sent" as const,
    timer: "03:15",
    nextAction: "Release Escrow",
  },
];

const COMPLETED = [
  { usdc: "555", aed: "2,037", profit: "+5.55", id: "BM1A2B", time: "2m ago" },
  { usdc: "5,000", aed: "18,350", profit: "+50.00", id: "BM4C5D", time: "18m ago" },
  { usdc: "8,000", aed: "29,360", profit: "+80.00", id: "BM6E7F", time: "1h ago" },
  { usdc: "3,000", aed: "11,010", profit: "+30.00", id: "BM8G9H", time: "2h ago" },
];

const LEADERBOARD = [
  { rank: 1, name: "TrustMerchant22", vol: "420K", online: true },
  { rank: 2, name: "AliH_Dubai",       vol: "280K", online: true },
  { rank: 3, name: "QuickSettle",      vol: "195K", online: false },
  { rank: 4, name: "GlobalFX",         vol: "140K", online: false },
  { rank: 5, name: "AED_Pro",          vol: "98K",  online: false },
];

const STATUS_CFG = {
  escrowed:     { label: "ESCROWED",    cls: "text-[#a4d7e1] bg-[#a4d7e1]/10 border-[#a4d7e1]/20"  },
  payment_sent: { label: "PAID",        cls: "text-blue-400   bg-blue-500/10   border-blue-500/20"    },
  accepted:     { label: "ACCEPTED",    cls: "text-orange-400 bg-orange-500/10 border-orange-500/20"  },
};

/* ============================================
   SECTION: MERCHANT SHOWCASE
   ============================================ */
const MerchantShowcaseSection = () => {
  return (
    <section className="relative py-28 overflow-hidden" style={{ background: "#030305" }}>
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          opacity: 0.35,
        }}
      />
      {/* Ambient glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "20%",
          left: "30%",
          width: 600,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(255,107,53,0.04) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: EASE }}
          className="text-center mb-14"
        >
          <p
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.25)",
              marginBottom: 20,
            }}
          >
            Merchant Console
          </p>
          <h2
            className="heading-h2"
            style={{
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            The settlement layer{" "}
            <span style={{ color: "rgba(255,255,255,0.28)" }}>
              merchants have been waiting for.
            </span>
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "rgba(255,255,255,0.35)",
              maxWidth: 480,
              margin: "0 auto",
              lineHeight: 1.65,
            }}
          >
            Real-time bidding, escrow-secured trades, instant AED settlement —
            all in one dashboard.
          </p>
        </motion.div>

        {/* ── macOS Window Frame ── */}
        <motion.div
          initial={{ opacity: 0, y: 48, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.1, ease: EASE }}
          className="hidden md:block relative rounded-2xl overflow-hidden"
          style={{
            border: "1px solid rgba(255,255,255,0.09)",
            boxShadow:
              "0 0 0 1px rgba(0,0,0,0.8), 0 40px 120px rgba(0,0,0,0.7), 0 0 80px 20px rgba(255,107,53,0.04)",
          }}
        >
          {/* Chrome — traffic lights + URL bar */}
          <div
            className="flex items-center gap-3 px-4 py-3"
            style={{
              background: "#0f0f14",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="flex gap-1.5">
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f56" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ffbd2e" }} />
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#27c93f" }} />
            </div>
            <div className="flex-1 flex justify-center">
              <div
                className="flex items-center gap-1.5 px-3 py-1 rounded"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  fontSize: 11,
                  color: "rgba(255,255,255,0.3)",
                  fontFamily: "monospace",
                }}
              >
                <span style={{ color: "#3ddc84" }}>⚡</span> merchant.blip.money
              </div>
            </div>
          </div>

          {/* App navbar */}
          <div
            className="flex items-center gap-4 px-4 py-2.5"
            style={{
              background: "#0a0a0f",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: "-0.02em",
              }}
            >
              Blip<span style={{ color: "rgba(255,255,255,0.35)" }}>.money</span>
            </span>
            <div className="flex gap-0.5">
              {["Dashboard", "Mempool", "Analytics", "Settings"].map((tab) => (
                <button
                  key={tab}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 500,
                    background:
                      tab === "Dashboard"
                        ? "rgba(255,255,255,0.08)"
                        : "transparent",
                    color:
                      tab === "Dashboard"
                        ? "rgba(255,255,255,0.8)"
                        : "rgba(255,255,255,0.25)",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="ml-auto flex items-center gap-3">
              <div
                className="flex items-center gap-1.5"
                style={{ fontSize: 10, color: "#3ddc84", fontFamily: "monospace" }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#3ddc84",
                    display: "inline-block",
                    boxShadow: "0 0 6px #3ddc84",
                    animation: "pulse 2s infinite",
                  }}
                />
                ONLINE
              </div>
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: "rgba(255,107,53,0.25)",
                  border: "1px solid rgba(255,107,53,0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#ffb07a",
                }}
              >
                M
              </div>
            </div>
          </div>

          {/* Dashboard — 3 panels */}
          <div
            className="flex"
            style={{ background: "#060609", minHeight: 520 }}
          >
            {/* ── Panel 1: Status / Balance ── */}
            <div
              className="flex flex-col gap-2.5 p-3"
              style={{
                width: 220,
                flexShrink: 0,
                borderRight: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {/* Balance */}
              <div
                className="p-3 rounded-lg"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    color: "rgba(255,255,255,0.28)",
                    fontFamily: "monospace",
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    marginBottom: 4,
                  }}
                >
                  Available Balance
                </div>
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 700,
                    fontFamily: "monospace",
                    color: "#ffffff",
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                  }}
                >
                  12,450
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>.00</span>
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "rgba(255,255,255,0.35)",
                    fontFamily: "monospace",
                    marginTop: 2,
                  }}
                >
                  USDC
                </div>
              </div>

              {/* Locked in Escrow */}
              <div
                className="p-3 rounded-lg"
                style={{
                  background: "rgba(164,215,225,0.05)",
                  border: "1px solid rgba(164,215,225,0.15)",
                }}
              >
                <div className="flex items-center gap-1.5" style={{ marginBottom: 4 }}>
                  <Lock style={{ width: 10, height: 10, color: "rgba(164,215,225,0.6)" }} />
                  <span
                    style={{
                      fontSize: 9,
                      color: "rgba(164,215,225,0.6)",
                      fontFamily: "monospace",
                      textTransform: "uppercase",
                      letterSpacing: "1.5px",
                    }}
                  >
                    Locked in Escrow
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    fontFamily: "monospace",
                    color: "#a4d7e1",
                    letterSpacing: "-0.03em",
                  }}
                >
                  3,200
                  <span style={{ fontSize: 11, color: "rgba(192,132,252,0.5)" }}> USDC</span>
                </div>
              </div>

              {/* Today earnings */}
              <div
                className="p-3 rounded-lg"
                style={{
                  background: "rgba(52,211,153,0.04)",
                  border: "1px solid rgba(52,211,153,0.14)",
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    color: "rgba(52,211,153,0.6)",
                    fontFamily: "monospace",
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    marginBottom: 4,
                  }}
                >
                  Today's Earnings
                </div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    fontFamily: "monospace",
                    color: "#34d399",
                    letterSpacing: "-0.03em",
                  }}
                >
                  +$124.50
                </div>
              </div>

              {/* Rate */}
              <div
                className="p-3 rounded-lg"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div
                  style={{
                    fontSize: 9,
                    color: "rgba(255,255,255,0.28)",
                    fontFamily: "monospace",
                    marginBottom: 4,
                  }}
                >
                  AED / USDC Rate
                </div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    fontFamily: "monospace",
                    color: "#fb923c",
                    letterSpacing: "-0.03em",
                  }}
                >
                  3.6700
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: "rgba(255,255,255,0.2)",
                    fontFamily: "monospace",
                    marginTop: 4,
                  }}
                >
                  5m vol: $42.5K · 12 active
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 gap-1.5 mt-auto">
                {[
                  { val: "47", lbl: "Done" },
                  { val: "#7",  lbl: "Rank" },
                ].map((s) => (
                  <div
                    key={s.lbl}
                    className="p-2 rounded text-center"
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        fontFamily: "monospace",
                        color: "#ffffff",
                      }}
                    >
                      {s.val}
                    </div>
                    <div
                      style={{
                        fontSize: 8,
                        color: "rgba(255,255,255,0.22)",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                      }}
                    >
                      {s.lbl}
                    </div>
                  </div>
                ))}
              </div>

              <button
                style={{
                  width: "100%",
                  padding: "8px 0",
                  borderRadius: 8,
                  background: "rgba(255,107,53,0.18)",
                  border: "1px solid rgba(255,107,53,0.3)",
                  color: "#fb923c",
                  fontSize: 11,
                  fontWeight: 700,
                  fontFamily: "monospace",
                  letterSpacing: "1px",
                  cursor: "pointer",
                }}
              >
                + POST OFFER
              </button>
            </div>

            {/* ── Panel 2: In Progress ── */}
            <div
              className="flex flex-col p-3"
              style={{
                flex: 1,
                borderRight: "1px solid rgba(255,255,255,0.05)",
                minWidth: 0,
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Activity style={{ width: 12, height: 12, color: "rgba(255,255,255,0.28)" }} />
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.35)",
                    fontFamily: "monospace",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                  }}
                >
                  In Progress
                </span>
                <span
                  className="ml-auto"
                  style={{
                    fontSize: 9,
                    padding: "2px 8px",
                    borderRadius: 999,
                    background: "rgba(255,107,53,0.14)",
                    color: "#fb923c",
                    fontFamily: "monospace",
                    border: "1px solid rgba(255,107,53,0.22)",
                  }}
                >
                  2 ACTIVE
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {IN_PROGRESS.map((order, i) => {
                  const cfg = STATUS_CFG[order.status];
                  const isEscrowed = order.status === "escrowed";
                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.12, duration: 0.55 }}
                      style={{
                        padding: "10px 12px",
                        borderRadius: 10,
                        background: isEscrowed
                          ? "rgba(164,215,225,0.04)"
                          : "rgba(59,130,246,0.04)",
                        border: isEscrowed
                          ? "1px solid rgba(164,215,225,0.22)"
                          : "1px solid rgba(59,130,246,0.22)",
                        cursor: "pointer",
                      }}
                    >
                      {/* Row 1: User + type + timer */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            style={{
                              width: 26,
                              height: 26,
                              borderRadius: "50%",
                              background: "rgba(255,255,255,0.08)",
                              border: "1px solid rgba(255,255,255,0.14)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 9,
                              fontWeight: 700,
                              color: "rgba(255,255,255,0.65)",
                            }}
                          >
                            {order.initials}
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: 11,
                                fontWeight: 600,
                                color: "rgba(255,255,255,0.65)",
                              }}
                            >
                              {order.name}
                            </div>
                            <span
                              style={{
                                fontSize: 8,
                                fontWeight: 700,
                                fontFamily: "monospace",
                                padding: "1px 5px",
                                borderRadius: 3,
                                ...(order.type === "buy"
                                  ? {
                                      background: "rgba(255,107,53,0.1)",
                                      border: "1px solid rgba(255,107,53,0.2)",
                                      color: "#fb923c",
                                    }
                                  : {
                                      background: "rgba(255,255,255,0.06)",
                                      border: "1px solid rgba(255,255,255,0.08)",
                                      color: "rgba(255,255,255,0.45)",
                                    }),
                              }}
                            >
                              {order.type === "buy" ? "SELL" : "BUY"}
                            </span>
                          </div>
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            fontFamily: "monospace",
                            padding: "2px 8px",
                            borderRadius: 5,
                            ...(isEscrowed
                              ? { color: "#a4d7e1", background: "rgba(164,215,225,0.1)" }
                              : { color: "#93c5fd", background: "rgba(59,130,246,0.1)" }),
                          }}
                        >
                          {order.timer}
                        </div>
                      </div>

                      {/* Row 2: Amounts */}
                      <div
                        className="flex items-center gap-2 py-2 my-1"
                        style={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: 15,
                              fontWeight: 700,
                              fontFamily: "monospace",
                              color: "#ffffff",
                              letterSpacing: "-0.03em",
                            }}
                          >
                            {order.usdc}{" "}
                            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>
                              USDC
                            </span>
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: "rgba(255,255,255,0.35)",
                              fontFamily: "monospace",
                            }}
                          >
                            {order.aed} AED
                          </div>
                        </div>
                        <ArrowRight
                          style={{
                            width: 12,
                            height: 12,
                            color: "rgba(255,255,255,0.15)",
                            margin: "0 auto",
                          }}
                        />
                        <div className="ml-auto text-right">
                          <div
                            style={{
                              fontSize: 9,
                              color: "rgba(255,255,255,0.25)",
                              fontFamily: "monospace",
                              marginBottom: 3,
                            }}
                          >
                            @ {order.rate}
                          </div>
                          <span
                            style={{
                              fontSize: 9,
                              fontWeight: 700,
                              fontFamily: "monospace",
                              padding: "1px 6px",
                              borderRadius: 3,
                              border: "1px solid",
                            }}
                            className={cfg.cls}
                          >
                            {cfg.label}
                          </span>
                        </div>
                      </div>

                      {/* Row 3: Next action */}
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <Zap style={{ width: 9, height: 9, color: "rgba(251,146,60,0.6)" }} />
                        <span
                          style={{
                            fontSize: 9,
                            color: "rgba(255,255,255,0.35)",
                            fontFamily: "monospace",
                          }}
                        >
                          Next: {order.nextAction}
                        </span>
                        <ChevronRight
                          style={{ width: 9, height: 9, color: "rgba(255,255,255,0.18)", marginLeft: "auto" }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Mempool placeholder */}
              <div
                className="flex-1 mt-3 rounded-lg flex flex-col items-center justify-center gap-2"
                style={{
                  border: "1px solid rgba(255,255,255,0.04)",
                  background: "rgba(255,255,255,0.01)",
                  minHeight: 100,
                }}
              >
                <Shield style={{ width: 18, height: 18, color: "rgba(255,255,255,0.1)" }} />
                <div
                  style={{
                    fontSize: 9,
                    color: "rgba(255,255,255,0.2)",
                    fontFamily: "monospace",
                    textAlign: "center",
                    lineHeight: 1.6,
                  }}
                >
                  8 orders in mempool
                  <br />
                  waiting for match
                </div>
              </div>
            </div>

            {/* ── Panel 3: Completed + Leaderboard ── */}
            <div
              className="flex flex-col p-3 gap-3"
              style={{ width: 260, flexShrink: 0 }}
            >
              {/* Completed */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 style={{ width: 12, height: 12, color: "rgba(255,255,255,0.28)" }} />
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.35)",
                      fontFamily: "monospace",
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                    }}
                  >
                    Completed
                  </span>
                  <span
                    className="ml-auto"
                    style={{
                      fontSize: 9,
                      color: "rgba(255,255,255,0.2)",
                      fontFamily: "monospace",
                    }}
                  >
                    today
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {COMPLETED.map((tx, i) => (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.07 }}
                      className="flex items-center gap-2 p-2 rounded"
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.04)",
                      }}
                    >
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          background: "rgba(52,211,153,0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <CheckCircle2 style={{ width: 10, height: 10, color: "#34d399" }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 11,
                            fontFamily: "monospace",
                            color: "rgba(255,255,255,0.55)",
                          }}
                        >
                          {tx.usdc} USDC
                        </div>
                        <div
                          style={{
                            fontSize: 9,
                            fontFamily: "monospace",
                            color: "rgba(255,255,255,0.22)",
                          }}
                        >
                          {tx.aed} AED
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            fontFamily: "monospace",
                            color: "#34d399",
                          }}
                        >
                          {tx.profit}
                        </div>
                        <div
                          style={{
                            fontSize: 8,
                            color: "rgba(255,255,255,0.18)",
                            fontFamily: "monospace",
                          }}
                        >
                          {tx.time}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Leaderboard */}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 12 }}>
                <div className="flex items-center gap-2 mb-2">
                  <Star style={{ width: 12, height: 12, color: "rgba(255,255,255,0.28)" }} />
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.35)",
                      fontFamily: "monospace",
                      textTransform: "uppercase",
                      letterSpacing: "2px",
                    }}
                  >
                    Leaderboard
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  {LEADERBOARD.map((m, i) => (
                    <div
                      key={m.name}
                      className="flex items-center gap-2 px-2 py-1.5 rounded"
                      style={
                        i === 0
                          ? {
                              background: "rgba(255,255,255,0.04)",
                              border: "1px solid rgba(255,255,255,0.08)",
                            }
                          : {}
                      }
                    >
                      <span
                        style={{
                          fontSize: 9,
                          fontFamily: "monospace",
                          color: "rgba(255,255,255,0.22)",
                          width: 16,
                        }}
                      >
                        #{m.rank}
                      </span>
                      <div
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: m.online ? "#3ddc84" : "rgba(255,255,255,0.2)",
                          flexShrink: 0,
                          ...(m.online
                            ? { boxShadow: "0 0 4px #3ddc84" }
                            : {}),
                        }}
                      />
                      <span
                        style={{
                          fontSize: 11,
                          fontFamily: "monospace",
                          color: "rgba(255,255,255,0.45)",
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
                          fontSize: 9,
                          fontFamily: "monospace",
                          color: "rgba(255,255,255,0.25)",
                          flexShrink: 0,
                        }}
                      >
                        ${m.vol}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Feature callouts ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
          {[
            {
              icon: Lock,
              title: "Escrow-secured",
              desc: "Every trade backed by smart contract escrow. Funds release only when both parties confirm.",
              accent: "#a4d7e1",
            },
            {
              icon: Zap,
              title: "Sub-2s settlement",
              desc: "AED hits your account before the counterparty blinks. No clearing, no holds, no delays.",
              accent: "#fb923c",
            },
            {
              icon: TrendingUp,
              title: "Competitive bidding",
              desc: "150+ merchants compete in real-time to give you the best rate on every corridor.",
              accent: "#34d399",
            },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.65, ease: EASE }}
              className="flex gap-4 p-5 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <f.icon style={{ width: 16, height: 16, color: f.accent }} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.65)",
                    marginBottom: 5,
                  }}
                >
                  {f.title}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.3)",
                    lineHeight: 1.6,
                  }}
                >
                  {f.desc}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MerchantShowcaseSection;
