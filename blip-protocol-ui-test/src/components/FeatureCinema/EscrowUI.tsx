import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Check, Lock, ArrowRight, Users } from "lucide-react";

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
      className="w-[320px] sm:w-[420px] md:w-[500px] lg:w-[560px]"
      style={{
        background: "#0a0a0a",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20,
        overflow: "hidden",
        boxShadow:
          "0 25px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.06)",
      }}
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-3 px-5 py-3.5 bg-[#111] border-b border-white/[0.06]">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28ca42]" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] w-full max-w-[180px] sm:max-w-[300px]">
            <div className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <Lock className="w-2.5 h-2.5 text-white/40" />
            </div>
            <span className="text-xs text-white/30 font-mono truncate flex-1">
              escrow.blipprotocol.com
            </span>
          </div>
        </div>
        <motion.div
          className="flex items-center gap-1.5"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-2 h-2 rounded-full bg-white/40" />
          <span className="text-[10px] text-white/40 font-medium hidden sm:inline">
            Secure
          </span>
        </motion.div>
      </div>

      {/* Main content */}
      <div className="p-5">
        {/* Header row */}
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
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
              className="w-10 h-10 rounded-xl flex items-center justify-center border"
            >
              {phase === "locked" || phase === "verified" ? (
                <Lock
                  className="w-4 h-4"
                  style={{
                    color:
                      phase === "verified"
                        ? "rgba(255,255,255,0.55)"
                        : "rgba(255,255,255,0.45)",
                  }}
                />
              ) : (
                <Shield className="w-4 h-4 text-white/35" />
              )}
            </motion.div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-white/25 mb-0.5">
                {phase === "sending"
                  ? "Escrow Service"
                  : phase === "locking"
                    ? "Locking Funds"
                    : "Escrow Active"}
              </div>
              <div className="text-sm font-semibold text-white">
                {phase === "sending"
                  ? "Processing..."
                  : phase === "locking"
                    ? "Securing..."
                    : "Funds Secured"}
              </div>
            </div>
          </div>
          <motion.div
            className="w-2.5 h-2.5 rounded-full"
            style={{
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

        {/* Amount — large */}
        <div className="text-center mb-5 pb-5 border-b border-white/[0.05]">
          <div className="text-[10px] uppercase tracking-[2px] text-white/20 mb-2">
            {phase === "sending" ? "Sending Amount" : "Secured Amount"}
          </div>
          <div className="text-4xl font-bold tracking-tight text-white mb-1">
            5,000{" "}
            <span className="text-lg text-white/35 font-medium">USDT</span>
          </div>
          <div className="text-xs text-white/20">
            ≈ $5,000.00 · Solana Network
          </div>
        </div>

        {/* Participants */}
        <div className="flex items-center gap-3 mb-5 p-3.5 rounded-xl bg-white/[0.025] border border-white/[0.05]">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.1] flex items-center justify-center shrink-0">
              <span className="text-[10px] font-bold text-white/50">JD</span>
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-white/25 uppercase tracking-wider">
                Sender
              </div>
              <div className="text-xs font-medium text-white/70 truncate">
                John D.
              </div>
            </div>
          </div>
          <motion.div
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowRight className="w-4 h-4 text-white/20 shrink-0" />
          </motion.div>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.1] flex items-center justify-center shrink-0">
              <span className="text-[10px] font-bold text-white/50">AM</span>
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-white/25 uppercase tracking-wider">
                Receiver
              </div>
              <div className="text-xs font-medium text-white/70 truncate">
                Ahmed M.
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-[9px] uppercase tracking-[1.5px] text-white/20">
              {phase === "sending" ? "Transfer Progress" : "Escrow Progress"}
            </span>
            <span className="text-xs text-white/35 font-semibold">
              {phase === "sending"
                ? "42%"
                : phase === "locking"
                  ? "74%"
                  : "100%"}
            </span>
          </div>
          <div className="h-[3px] rounded-full bg-white/[0.05] overflow-hidden">
            <motion.div
              className="h-full rounded-full"
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

        {/* Detail rows */}
        <div className="flex flex-col gap-2.5 mb-4 p-3.5 rounded-xl bg-white/[0.015] border border-white/[0.04]">
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
            },
            {
              label: "Release",
              value: "On confirmation",
              color: "rgba(255,255,255,0.32)",
            },
            {
              label: "Fee",
              value: "0.00 USDT",
              color: "rgba(255,255,255,0.32)",
            },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between"
            >
              <span className="text-[11px] text-white/25">{row.label}</span>
              <div className="flex items-center gap-1.5">
                {row.dot && (
                  <motion.div
                    className="w-[5px] h-[5px] rounded-full"
                    style={{ background: statusColor }}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
                <span
                  className="text-[11px] font-medium"
                  style={{
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
        <AnimatePresence mode="wait">
          {phase === "verified" ? (
            <motion.div
              key="verified"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="p-3.5 rounded-xl bg-white/[0.08] border border-white/[0.2] text-center flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4 text-white/55" strokeWidth={3} />
              <span className="text-sm font-semibold text-white/55">
                Verified &amp; Secured
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="pending"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center"
            >
              <span className="text-xs text-white/25">
                {phase === "sending"
                  ? "Awaiting escrow lock..."
                  : phase === "locking"
                    ? "Deploying smart contract..."
                    : "Contract active · Awaiting confirmation"}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer info */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.04]">
          <div className="flex items-center gap-1.5">
            <Users className="w-3 h-3 text-white/15" />
            <span className="text-[10px] text-white/20">
              2 participants · Non-custodial
            </span>
          </div>
          <span className="text-[10px] text-white/15 font-mono">
            Blip Protocol v2
          </span>
        </div>
      </div>
    </div>
  );
}
