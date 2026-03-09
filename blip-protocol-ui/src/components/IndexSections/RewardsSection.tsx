import { useRef, useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { CTAButton } from "../Navbar";

const EARN_TXNS = [
  { emoji: "☕", label: "The Coffee Co.", amount: 0.5, pct: "2%" },
  { emoji: "🛒", label: "Dubai Mall", amount: 2.4, pct: "2%" },
  { emoji: "✈️", label: "Emirates Air", amount: 12.8, pct: "2%" },
  { emoji: "🏨", label: "Armani Hotel", amount: 28.6, pct: "2%" },
  { emoji: "🍽️", label: "Zuma Dubai", amount: 5.2, pct: "2%" },
];

type TxRow = (typeof EARN_TXNS)[number];

function EarnUI() {
  const [total, setTotal] = useState(847.2);
  const [cursor, setCursor] = useState(0);
  const [rows, setRows] = useState<TxRow[]>(EARN_TXNS.slice(0, 3));
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      const next = EARN_TXNS[cursor % EARN_TXNS.length];
      setTotal((prev) => parseFloat((prev + next.amount).toFixed(2)));
      setRows((prev) => [next, ...prev].slice(0, 3));
      setCursor((c) => c + 1);
      setFlash(true);
      setTimeout(() => setFlash(false), 700);
    }, 2600);
    return () => clearInterval(id);
  }, [cursor]);

  return (
    <div
      style={{
        background: "rgba(0,0,0,0.03)",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 18,
        padding: "18px 18px 14px",
      }}
    >
      {/* Total row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 14,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 9,
              letterSpacing: "0.18em",
              color: "rgba(0,0,0,0.35)",
              marginBottom: 5,
              textTransform: "uppercase",
              fontFamily: "monospace",
            }}
          >
            Total earned
          </div>
          <motion.div
            key={total}
            initial={{ y: -6, opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.35 }}
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#1a1a1a",
              letterSpacing: "-0.045em",
              lineHeight: 1,
              fontFamily: "monospace",
            }}
          >
            $
            {total.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            <span
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "rgba(0,0,0,0.3)",
                marginLeft: 6,
                letterSpacing: 0,
              }}
            >
              BLIP
            </span>
          </motion.div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 5,
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              padding: "3px 9px",
              borderRadius: 999,
              background: "rgba(255,107,53,0.1)",
              border: "1px solid rgba(255,107,53,0.2)",
              fontSize: 9,
              fontWeight: 700,
              color: "#ff6b35",
              fontFamily: "monospace",
              letterSpacing: "0.05em",
            }}
          >
            2% BACK
          </div>
          <div
            style={{
              padding: "3px 9px",
              borderRadius: 999,
              background: "rgba(22,163,74,0.08)",
              border: "1px solid rgba(22,163,74,0.18)",
              fontSize: 9,
              fontWeight: 700,
              color: "#16a34a",
              fontFamily: "monospace",
              letterSpacing: "0.05em",
            }}
          >
            ×5 STREAK
          </div>
        </div>
      </div>

      <div
        style={{ height: 1, background: "rgba(0,0,0,0.06)", marginBottom: 10 }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <AnimatePresence mode="popLayout">
          {rows.map((tx, i) => (
            <motion.div
              key={`${tx.label}-${cursor - i}`}
              initial={i === 0 ? { opacity: 0, y: -10 } : false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.28 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "7px 9px",
                borderRadius: 9,
                background:
                  i === 0 && flash
                    ? "rgba(255,107,53,0.06)"
                    : "rgba(0,0,0,0.015)",
                border:
                  i === 0 && flash
                    ? "1px solid rgba(255,107,53,0.14)"
                    : "1px solid transparent",
                transition: "background 0.3s, border 0.3s",
              }}
            >
              <span style={{ fontSize: 14 }}>{tx.emoji}</span>
              <span
                style={{
                  flex: 1,
                  fontSize: 11,
                  color: "rgba(0,0,0,0.55)",
                  fontFamily: "monospace",
                }}
              >
                {tx.label}
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#16a34a",
                  fontFamily: "monospace",
                  marginRight: 4,
                }}
              >
                +{tx.amount.toFixed(2)}
              </span>
              <span
                style={{
                  fontSize: 8,
                  padding: "1px 5px",
                  borderRadius: 999,
                  background: "rgba(255,107,53,0.09)",
                  color: "#ff6b35",
                  fontWeight: 700,
                  fontFamily: "monospace",
                }}
              >
                {tx.pct}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

const stats = [
  { value: "2.5%", label: "Cashback", desc: "On every payment" },
  { value: "10x", label: "Early Bonus", desc: "First 1000 users" },
  { value: "20M", label: "BLIP Pool", desc: "Total rewards" },
];

const RewardsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [0, 1, 1, 0],
  );

  return (
    <section
      ref={containerRef}
      className="relative py-20 sm:py-28 md:py-32 overflow-hidden bg-[#FAF8F5]"
    >
      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6"
        style={{ opacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl overflow-hidden"
          style={{
            background: "#ffffff",
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow:
              "0 1px 3px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.06)",
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left — copy */}
            <div className="p-10 lg:p-14 flex flex-col justify-center">
              {/* Badge */}
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(255,107,53,0.7)",
                  fontWeight: 600,
                  marginBottom: 18,
                }}
              >
                Rewards
              </div>

              {/* Heading */}
              <h2
                style={{
                  fontSize: "clamp(2.8rem, 5.5vw, 5rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.08,
                  color: "#1a1a1a",
                  marginBottom: 12,
                }}
              >
                Earn while you spend.{" "}
                <span style={{ color: "#555555" }}>
                  Every transaction.
                </span>
              </h2>

              {/* Subtext */}
              <p
                style={{
                  fontSize: 15,
                  color: "rgba(0,0,0,0.45)",
                  lineHeight: 1.7,
                  maxWidth: 380,
                  marginBottom: 24,
                }}
              >
                Every payment earns you BLIP rewards automatically — no
                sign-ups, no points programs. Just instant cashback, on-chain
                and non-custodial.
              </p>

              {/* Stats row */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 1,
                  background: "rgba(0,0,0,0.06)",
                  borderRadius: 14,
                  overflow: "hidden",
                  marginBottom: 24,
                }}
              >
                {stats.map((s) => (
                  <div
                    key={s.label}
                    style={{
                      background: "#ffffff",
                      padding: "14px 10px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 700,
                        color: "#1a1a1a",
                        letterSpacing: "-0.04em",
                        lineHeight: 1,
                      }}
                    >
                      {s.value}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        color: "rgba(0,0,0,0.5)",
                        marginTop: 4,
                      }}
                    >
                      {s.label}
                    </div>
                    <div
                      style={{
                        fontSize: 9,
                        color: "rgba(0,0,0,0.3)",
                        marginTop: 2,
                      }}
                    >
                      {s.desc}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pills */}
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  marginBottom: 28,
                }}
              >
                {[
                  { label: "Up to 5% cashback", accent: true },
                  { label: "Instant rewards", accent: false },
                  { label: "Non-custodial", accent: false },
                ].map((pill) => (
                  <div
                    key={pill.label}
                    style={{
                      padding: "5px 13px",
                      borderRadius: 999,
                      background: pill.accent
                        ? "rgba(255,107,53,0.1)"
                        : "rgba(0,0,0,0.03)",
                      border: pill.accent
                        ? "1px solid rgba(255,107,53,0.2)"
                        : "1px solid rgba(0,0,0,0.08)",
                      fontSize: 11,
                      fontWeight: 600,
                      color: pill.accent ? "#ff6b35" : "rgba(0,0,0,0.5)",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {pill.label}
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div>
                <CTAButton to="rewards" className="w-[200px] h-[44px]">
                  View Rewards
                </CTAButton>
              </div>
            </div>

            {/* Right — live ticker */}
            <div
              className="flex items-center justify-center p-8 lg:p-10"
              style={{
                background: "rgba(0,0,0,0.015)",
                borderLeft: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ width: "100%", maxWidth: 360 }}>
                {/* Mini header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: "rgba(255,107,53,0.1)",
                      border: "1px solid rgba(255,107,53,0.18)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Sparkles
                      style={{ width: 13, height: 13, color: "#ff6b35" }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "rgba(0,0,0,0.6)",
                    }}
                  >
                    My Rewards
                  </div>
                  <div
                    style={{
                      marginLeft: "auto",
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "#16a34a",
                      boxShadow: "0 0 6px rgba(22,163,74,0.5)",
                    }}
                  />
                </div>

                <EarnUI />

                <div
                  style={{
                    textAlign: "center",
                    marginTop: 10,
                    fontSize: 9,
                    color: "rgba(0,0,0,0.25)",
                    letterSpacing: "0.05em",
                    fontFamily: "monospace",
                  }}
                >
                  LIVE · REWARDS ACCUMULATING
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default RewardsSection;
