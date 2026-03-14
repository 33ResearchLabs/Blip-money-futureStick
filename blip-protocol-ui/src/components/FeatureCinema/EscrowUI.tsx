import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Check, Lock } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

type EscrowPhase = "sending" | "locking" | "locked" | "verified";

export default function EscrowUI() {
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
      ? "rgba(255,255,255,0.55)"
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
          "0 0 80px rgba(255,255,255,0.08), 0 30px 60px rgba(0,0,0,0.6)",
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
                  ? "rgba(255,255,255,0.12)"
                  : "rgba(255,255,255,0.04)",
              borderColor:
                phase === "verified"
                  ? "rgba(255,255,255,0.25)"
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
                    phase === "verified"
                      ? "rgba(255,255,255,0.55)"
                      : "rgba(255,255,255,0.45)",
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
              phase === "locking"
                ? "rgba(255,255,255,0.4)"
                : "rgba(255,255,255,0.55)",
            boxShadow: `0 0 6px ${
              phase === "locking"
                ? "rgba(255,255,255,0.4)"
                : "rgba(255,255,255,0.7)"
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
            {phase === "sending" ? "42%" : phase === "locking" ? "74%" : "100%"}
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
                  ? "linear-gradient(90deg, rgba(255,255,255,0.5), rgba(255,255,255,0.25))"
                  : "linear-gradient(90deg, rgba(255,255,255,0.25), rgba(255,255,255,0.1))",
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
          background: "rgba(255,255,255,0.05)",
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
            <span style={{ fontSize: 11.5, color: "rgba(255,255,255,0.25)" }}>
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
                    background: "rgba(255,255,255,0.3)",
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
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.2)",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Check
                style={{
                  width: 14,
                  height: 14,
                  color: "rgba(255,255,255,0.55)",
                }}
                strokeWidth={3}
              />
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.55)",
                }}
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
