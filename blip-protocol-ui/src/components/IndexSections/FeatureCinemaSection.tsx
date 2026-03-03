import { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  MotionValue,
} from "framer-motion";
import { Shield, Zap, Check, Lock, Globe, ArrowRight } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/* ═══════════════════════════════════════════════════════════
   SCENE 1 UI — ESCROW LOCK
   Cycles: sending → locking → locked → verified → repeat
   ═══════════════════════════════════════════════════════════ */
type EscrowPhase = "sending" | "locking" | "locked" | "verified";

function EscrowUI() {
  const [phase, setPhase] = useState<EscrowPhase>("sending");

  useEffect(() => {
    const run = () => {
      setPhase("sending");
      setTimeout(() => setPhase("locking"), 2000);
      setTimeout(() => setPhase("locked"), 3600);
      setTimeout(() => setPhase("verified"), 5000);
    };
    run();
    const id = setInterval(run, 7500);
    return () => clearInterval(id);
  }, []);

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
      ? "#3ddc84"
      : "rgba(255,255,255,0.4)";

  return (
    <div
      style={{
        width: 340,
        background: "#0d0d0d",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20,
        overflow: "hidden",
        boxShadow:
          "0 0 80px rgba(61,220,132,0.08), 0 30px 60px rgba(0,0,0,0.6)",
      }}
    >
      {/* Card header */}
      <div
        style={{
          padding: "18px 20px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
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
                  : "rgba(255,255,255,0.04)",
              borderColor:
                phase === "verified"
                  ? "rgba(61,220,132,0.25)"
                  : "rgba(255,255,255,0.07)",
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
                    phase === "verified" ? "#3ddc84" : "rgba(255,255,255,0.45)",
                }}
              />
            ) : (
              <Shield
                style={{
                  width: 16,
                  height: 16,
                  color: "rgba(255,255,255,0.35)",
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
                color: "rgba(255,255,255,0.25)",
                marginBottom: 2,
              }}
            >
              {phase === "sending"
                ? "Escrow Service"
                : phase === "locking"
                ? "Locking Funds"
                : "Escrow Active"}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>
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
            background:
              phase === "locking" ? "#ffbd2e" : "#3ddc84",
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
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div
          style={{
            fontSize: 10,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.2)",
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
            color: "#fff",
            marginBottom: 4,
          }}
        >
          5,000{" "}
          <span
            style={{
              fontSize: 18,
              color: "rgba(255,255,255,0.35)",
              fontWeight: 500,
            }}
          >
            USDT
          </span>
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>
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
              color: "rgba(255,255,255,0.2)",
            }}
          >
            {phase === "sending" ? "Transfer Progress" : "Escrow Progress"}
          </span>
          <span
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.35)",
              fontWeight: 600,
            }}
          >
            {phase === "sending"
              ? "42%"
              : phase === "locking"
              ? "74%"
              : "100%"}
          </span>
        </div>
        <div
          style={{
            height: 3,
            borderRadius: 999,
            background: "rgba(255,255,255,0.05)",
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
                  : "linear-gradient(90deg, rgba(255,255,255,0.25), rgba(255,255,255,0.1))",
            }}
            transition={{ duration: 0.9, ease: EASE }}
          />
        </div>
      </div>

      {/* Divider */}
      <div style={{ margin: "0 20px", height: 1, background: "rgba(255,255,255,0.05)" }} />

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
            color: "rgba(255,255,255,0.38)",
            mono: true,
          },
          {
            label: "Network",
            value: "Solana",
            color: "rgba(255,255,255,0.38)",
            solana: true,
          },
          {
            label: "Release",
            value: "On confirmation",
            color: "rgba(255,255,255,0.32)",
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
              style={{ fontSize: 11.5, color: "rgba(255,255,255,0.25)" }}
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
                    background: "linear-gradient(135deg, #9945FF, #14F195)",
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
              <span
                style={{ fontSize: 13, fontWeight: 600, color: "#3ddc84" }}
              >
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
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                textAlign: "center",
              }}
            >
              <span style={{ fontSize: 11.5, color: "rgba(255,255,255,0.25)" }}>
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
   SCENE 2 UI — INSTANT BIDDING
   Live bid rates fluctuating, countdown timer
   ═══════════════════════════════════════════════════════════ */
const INITIAL_BIDS = [
  { id: 1, name: "QuickSwap Pro", avatar: "QS", rate: 3.672, trades: 2847, time: "~30s", best: true },
  { id: 2, name: "FastSettle UAE", avatar: "FS", rate: 3.668, trades: 1923, time: "~45s", best: false },
  { id: 3, name: "DubaiExchange", avatar: "DE", rate: 3.665, trades: 3102, time: "~60s", best: false },
  { id: 4, name: "GulfTrade", avatar: "GT", rate: 3.660, trades: 892, time: "~90s", best: false },
];

function BiddingUI() {
  const [bids, setBids] = useState(INITIAL_BIDS);
  const [countdown, setCountdown] = useState(15);
  const [matched, setMatched] = useState(false);

  useEffect(() => {
    const rateId = setInterval(() => {
      setBids((prev) => {
        const updated = prev
          .map((b) => ({
            ...b,
            rate: parseFloat(
              (b.rate + (Math.random() - 0.48) * 0.004).toFixed(3)
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
          setTimeout(() => {
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
    };
  }, []);

  const bestBid = bids[0];

  return (
    <div
      style={{
        width: 480,
        background: "#0d0d0d",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20,
        overflow: "hidden",
        boxShadow:
          "0 0 80px rgba(255,107,53,0.08), 0 30px 60px rgba(0,0,0,0.6)",
      }}
    >
      {/* Browser chrome */}
      <div
        style={{
          padding: "12px 16px",
          background: "#090909",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          {["#ff5f57", "#ffbd2e", "#28ca42"].map((c) => (
            <div
              key={c}
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: c,
              }}
            />
          ))}
        </div>
        <div
          style={{ flex: 1, display: "flex", justifyContent: "center" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 12px",
              borderRadius: 8,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
              maxWidth: 280,
              width: "100%",
            }}
          >
            <Lock
              style={{
                width: 11,
                height: 11,
                color: "rgba(255,255,255,0.25)",
              }}
            />
            <span
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.25)",
                fontFamily: "monospace",
                flex: 1,
              }}
            >
              settle.blipprotocol.com/merchant
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <motion.div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#ff6b35",
                }}
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span
                style={{
                  fontSize: 9,
                  color: "#ff6b35",
                  fontWeight: 700,
                  letterSpacing: "1px",
                }}
              >
                LIVE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Order header */}
      <div
        style={{
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 9,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.2)",
              marginBottom: 4,
            }}
          >
            Active Order · #BLP-8472
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-0.03em",
            }}
          >
            5,000 USDT → AED
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 9,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.2)",
              marginBottom: 4,
            }}
          >
            Match in
          </div>
          <AnimatePresence mode="wait">
            {matched ? (
              <motion.div
                key="matched"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Check
                  style={{ width: 24, height: 24, color: "#3ddc84" }}
                />
              </motion.div>
            ) : (
              <motion.div
                key={countdown}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: countdown <= 5 ? "#ff6b35" : "#fff",
                  fontFamily: "monospace",
                  letterSpacing: "-0.02em",
                }}
              >
                {`00:${countdown.toString().padStart(2, "0")}`}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bids panel */}
      <div style={{ padding: "16px 20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <span
            style={{
              fontSize: 9,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.2)",
            }}
          >
            Live Merchant Bids
          </span>
          <div style={{ display: "flex", gap: 4 }}>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.3)",
                }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {bids.map((bid) => (
            <motion.div
              key={bid.id}
              layout
              animate={{
                background: bid.best
                  ? "rgba(255,255,255,0.055)"
                  : "rgba(255,255,255,0.02)",
                borderColor: bid.best
                  ? "rgba(255,255,255,0.14)"
                  : "rgba(255,255,255,0.06)",
              }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "11px 14px",
                borderRadius: 14,
                border: "1px solid",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    background: bid.best
                      ? "rgba(255,107,53,0.12)"
                      : "rgba(255,255,255,0.05)",
                    border: bid.best
                      ? "1px solid rgba(255,107,53,0.22)"
                      : "1px solid rgba(255,255,255,0.07)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 9,
                    fontWeight: 700,
                    color: bid.best ? "#ff6b35" : "rgba(255,255,255,0.4)",
                  }}
                >
                  {bid.avatar}
                </div>
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 2,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: bid.best
                          ? "#fff"
                          : "rgba(255,255,255,0.55)",
                      }}
                    >
                      {bid.name}
                    </span>
                    {bid.best && (
                      <motion.span
                        layout
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        style={{
                          padding: "1px 7px",
                          borderRadius: 999,
                          background: "rgba(255,107,53,0.15)",
                          border: "1px solid rgba(255,107,53,0.25)",
                          fontSize: 8,
                          color: "#ff6b35",
                          fontWeight: 700,
                          textTransform: "uppercase",
                        }}
                      >
                        Best
                      </motion.span>
                    )}
                  </div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>
                    {bid.trades.toLocaleString()} trades · ETA {bid.time}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <motion.div
                  animate={{
                    color: bid.best ? "#ffffff" : "rgba(255,255,255,0.4)",
                  }}
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {bid.rate.toFixed(3)}{" "}
                  <span
                    style={{
                      fontSize: 11,
                      color: "rgba(255,255,255,0.25)",
                      fontWeight: 400,
                    }}
                  >
                    AED
                  </span>
                </motion.div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>
                  ≈{" "}
                  {(bid.rate * 5000).toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}{" "}
                  AED
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Auto-select notice */}
        <div
          style={{
            marginTop: 12,
            padding: "10px 14px",
            borderRadius: 12,
            background: "rgba(255,107,53,0.05)",
            border: "1px solid rgba(255,107,53,0.12)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Zap
            style={{ width: 14, height: 14, color: "#ff6b35", flexShrink: 0 }}
          />
          <span style={{ fontSize: 11.5, color: "rgba(255,255,255,0.38)" }}>
            Auto-selecting best offer · You'll receive ~
            {(bestBid?.rate * 5000).toFixed(0)} AED
          </span>
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
  "Ahmed M.", "Sarah K.", "James O.", "Maria G.", "Alex T.", "Emma S.",
];
const TX_ADDRS = [
  "0x8a9...3f2", "0x3b7...9k1", "0x7c4...2m8", "0x1a2...4b5",
];
const TX_INITIAL = [
  { id: "BLP-7X2K", from: "0x8a9...3f2", to: "Ahmed M.", amount: "$5,750", age: "2s", isNew: false },
  { id: "BLP-4MR8", from: "0x3b7...9k1", to: "Sarah K.", amount: "$12,867", age: "5s", isNew: false },
  { id: "BLP-9PT4", from: "0x7c4...2m8", to: "James O.", amount: "$7,589", age: "9s", isNew: false },
  { id: "BLP-2NQ7", from: "0x1a2...4b5", to: "Maria G.", amount: "$3,220", age: "12s", isNew: false },
];

function ExplorerUI() {
  const [txs, setTxs] = useState(TX_INITIAL);
  const [block, setBlock] = useState(241_847_293);

  useEffect(() => {
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
        }))
      );
      setBlock((b) => b + Math.floor(Math.random() * 3) + 1);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{
        width: 500,
        background: "#0d0d0d",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20,
        overflow: "hidden",
        boxShadow:
          "0 0 80px rgba(20,241,149,0.06), 0 30px 60px rgba(0,0,0,0.6)",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "12px 16px",
          background: "#090909",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", gap: 6 }}>
            {["#ff5f57", "#ffbd2e", "#28ca42"].map((c) => (
              <div
                key={c}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: c,
                }}
              />
            ))}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 10px",
              borderRadius: 8,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <Globe
              style={{
                width: 11,
                height: 11,
                color: "rgba(255,255,255,0.25)",
              }}
            />
            <span
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.25)",
                fontFamily: "monospace",
              }}
            >
              blipscan.io/explorer
            </span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <motion.div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#14F195",
            }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span style={{ fontSize: 11, color: "#14F195", fontWeight: 600 }}>
            Live · Solana
          </span>
        </div>
      </div>

      {/* Stats bar */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {[
          { label: "Block", value: block.toLocaleString() },
          { label: "24h Volume", value: "$2.4M" },
          { label: "Settled", value: "12,847" },
          { label: "Avg Speed", value: "1.8s" },
        ].map((s, i) => (
          <div
            key={s.label}
            style={{
              padding: "12px 8px",
              textAlign: "center",
              borderRight:
                i < 3 ? "1px solid rgba(255,255,255,0.05)" : undefined,
            }}
          >
            <motion.div
              key={s.value}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#fff",
                marginBottom: 2,
              }}
            >
              {s.value}
            </motion.div>
            <div
              style={{
                fontSize: 9,
                color: "rgba(255,255,255,0.2)",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Transaction list */}
      <div style={{ padding: "14px 16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
            padding: "0 4px",
          }}
        >
          <span
            style={{
              fontSize: 9,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.2)",
            }}
          >
            Recent Settlements
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <motion.div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#14F195",
              }}
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span style={{ fontSize: 10, color: "#14F195" }}>Live</span>
          </div>
        </div>

        <AnimatePresence mode="popLayout">
          {txs.map((tx) => (
            <motion.div
              key={tx.id}
              layout="position"
              initial={{
                opacity: 0,
                x: -12,
                backgroundColor: "rgba(20,241,149,0.06)",
              }}
              animate={{
                opacity: 1,
                x: 0,
                backgroundColor: "rgba(255,255,255,0)",
              }}
              exit={{ opacity: 0, x: 12 }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
                layout: { duration: 0.6, ease: EASE },
              }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.04)",
                marginBottom: 6,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: "rgba(20,241,149,0.08)",
                    border: "1px solid rgba(20,241,149,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Check
                    style={{ width: 14, height: 14, color: "#14F195" }}
                    strokeWidth={2.5}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 3,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontFamily: "monospace",
                        color: "rgba(255,255,255,0.4)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {tx.id}
                    </span>
                    <span
                      style={{
                        color: "rgba(255,255,255,0.2)",
                        fontSize: 11,
                      }}
                    >
                      →
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        color: "#fff",
                        fontWeight: 600,
                      }}
                    >
                      {tx.to}
                    </span>
                    {tx.isNew && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{
                          padding: "1px 6px",
                          borderRadius: 999,
                          background: "rgba(20,241,149,0.12)",
                          border: "1px solid rgba(20,241,149,0.2)",
                          fontSize: 8,
                          color: "#14F195",
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}
                      >
                        NEW
                      </motion.span>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "rgba(255,255,255,0.2)",
                      fontFamily: "monospace",
                    }}
                  >
                    {tx.from}
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  flexShrink: 0,
                }}
              >
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#fff",
                    }}
                  >
                    {tx.amount}
                  </div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)" }}>
                    USDT
                  </div>
                </div>
                <div
                  style={{
                    padding: "5px 8px",
                    borderRadius: 8,
                    background: "rgba(20,241,149,0.08)",
                    border: "1px solid rgba(20,241,149,0.15)",
                  }}
                >
                  <span style={{ fontSize: 10, color: "#14F195" }}>
                    {tx.age}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 10,
            paddingTop: 10,
            borderTop: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.15)",
              }}
            />
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>
              Powered by Blip Protocol
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 10,
              color: "rgba(255,255,255,0.4)",
              cursor: "pointer",
            }}
          >
            View Explorer <ArrowRight style={{ width: 11, height: 11 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SCENE WRAPPER
   Scroll-driven zoom-in / zoom-out + text overlay
   ═══════════════════════════════════════════════════════════ */
interface SceneProps {
  progress: MotionValue<number>;
  start: number;
  end: number;
  eyebrow: string;
  headline: [string, string];
  subline: string;
  bullets: string[];
  accent: string;
  children: React.ReactNode;
}

function Scene({
  progress,
  start,
  end,
  eyebrow,
  headline,
  subline,
  bullets,
  accent,
  children,
}: SceneProps) {
  const range = end - start;
  const enterEnd = start + range * 0.18;
  const exitStart = end - range * 0.22;

  const opacity = useTransform(
    progress,
    [start, enterEnd, exitStart, end],
    [0, 1, 1, 0]
  );
  const scale = useTransform(
    progress,
    [start, enterEnd, exitStart, end],
    [0.22, 1, 1, 1.75]
  );
  const blurN = useTransform(
    progress,
    [start, enterEnd, exitStart, end],
    [30, 0, 0, 26]
  );
  const filter = useTransform(blurN, (v) => `blur(${v}px)`);
  const glowOp = useTransform(
    progress,
    [start, enterEnd, exitStart, end],
    [0, 0.8, 0.8, 0]
  );
  const textOp = useTransform(
    progress,
    [start, start + range * 0.12, exitStart, end],
    [0, 1, 1, 0]
  );
  const textY = useTransform(progress, [start, enterEnd], [24, 0]);

  return (
    <motion.div
      className="absolute inset-0"
      style={{ opacity, pointerEvents: "none" }}
    >
      {/* Scene ambient glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 62% 50%, ${accent}12 0%, transparent 55%)`,
          opacity: glowOp,
        }}
      />

      <div className="absolute inset-0 flex items-center">
        {/* Left text column */}
        <motion.div
          style={{ y: textY, opacity: textOp, width: 340, flexShrink: 0 }}
          className="pl-14 pr-6"
        >
          <div
            style={{
              fontSize: 9,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: accent,
              marginBottom: 16,
            }}
          >
            {eyebrow}
          </div>
          <h2
            className="text-white font-bold tracking-tight"
            style={{
              fontSize: "clamp(2rem, 3vw, 3rem)",
              lineHeight: 1.06,
              marginBottom: 20,
            }}
          >
            {headline[0]}
            <br />
            <span style={{ color: "rgba(255,255,255,0.32)" }}>
              {headline[1]}
            </span>
          </h2>
          <p
            style={{
              fontSize: 15,
              color: "rgba(255,255,255,0.38)",
              lineHeight: 1.65,
              marginBottom: 28,
              maxWidth: 280,
            }}
          >
            {subline}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {bullets.map((b) => (
              <div
                key={b}
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: `${accent}18`,
                    border: `1px solid ${accent}35`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Check
                    style={{ width: 9, height: 9, color: accent }}
                    strokeWidth={3}
                  />
                </div>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.42)" }}>
                  {b}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right: zoom-in UI */}
        <div className="flex-1 flex items-center justify-center pr-10">
          <motion.div style={{ scale, filter }}>{children}</motion.div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════════════════ */
const SCENES_DATA = [
  {
    start: 0,
    end: 0.38,
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
    start: 0.32,
    end: 0.70,
    eyebrow: "02 · Matching",
    headline: ["Best rate.", "Every time."] as [string, string],
    subline:
      "150+ merchants compete in real-time. You automatically get the winner.",
    bullets: [
      "150+ verified merchants",
      "Real-time competitive pricing",
      "Auto-select best offer",
    ],
    accent: "#ff6b35",
  },
  {
    start: 0.64,
    end: 1.0,
    eyebrow: "03 · Verification",
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

export default function FeatureCinemaSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [activeScene, setActiveScene] = useState(0);
  const scrollHintOpacity = useTransform(scrollYProgress, [0, 0.07], [1, 0]);

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      if (v < 0.40) setActiveScene(0);
      else if (v < 0.73) setActiveScene(1);
      else setActiveScene(2);
    });
    return unsub;
  }, [scrollYProgress]);

  return (
    <div ref={containerRef} style={{ height: "350vh" }}>
      <div
        className="sticky top-0 overflow-hidden"
        style={{ height: "100vh", background: "#060606" }}
      >
        {/* Subtle grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* Top pill label */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <Shield
              style={{
                width: 12,
                height: 12,
                color: "rgba(255,255,255,0.28)",
              }}
            />
            <span
              style={{
                fontSize: 10,
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.28)",
              }}
            >
              Core Features
            </span>
          </div>
        </div>

        {/* Scenes */}
        {SCENES_DATA.map((s, i) => (
          <Scene key={i} progress={scrollYProgress} {...s}>
            {i === 0 ? <EscrowUI /> : i === 1 ? <BiddingUI /> : <ExplorerUI />}
          </Scene>
        ))}

        {/* Progress dots */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-30">
          {SCENES_DATA.map((s, i) => (
            <motion.div
              key={i}
              style={{
                height: 6,
                borderRadius: 999,
                background: s.accent,
              }}
              animate={{
                width: activeScene === i ? 28 : 6,
                opacity: activeScene === i ? 1 : 0.22,
              }}
              transition={{ duration: 0.4, ease: EASE }}
            />
          ))}
        </div>

        {/* Scroll cue (fades out early) */}
        <motion.div
          className="absolute right-10 bottom-12 flex flex-col items-center gap-2 z-20"
          style={{ opacity: scrollHintOpacity }}
        >
          <div
            className="h-8 w-px"
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgba(255,255,255,0.15))",
            }}
          />
          <span
            style={{
              fontSize: 8,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.18)",
            }}
          >
            Scroll
          </span>
        </motion.div>
      </div>
    </div>
  );
}
