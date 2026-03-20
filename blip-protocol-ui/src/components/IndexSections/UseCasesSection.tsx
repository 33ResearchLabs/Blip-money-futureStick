/* eslint-disable */
import { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Globe,
  ShoppingBag,
  Gift,
  Eye,
  Store,
  Zap,
  ShieldOff,
  TrendingDown,
  Sparkles,
  ArrowUpRight,
  Trophy,
  Star,
  Crown,
  ChevronRight,
} from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

const userCases = [
  {
    icon: Globe,
    label: "Pay globally",
    desc: "Send to anyone, anywhere — instantly.",
  },
  {
    icon: ShoppingBag,
    label: "Pay anywhere",
    desc: "Tap to pay at stores and across borders.",
  },
  { icon: Gift, label: "Earn rewards", desc: "Cashback on every transaction." },
  {
    icon: Eye,
    label: "Private by default",
    desc: "Your keys, your funds, your data.",
  },
];

const merchantCases = [
  {
    icon: Store,
    label: "Global payments",
    desc: "Receive from any corridor without banks.",
  },
  {
    icon: Zap,
    label: "Instant liquidity",
    desc: "On-demand liquidity for every trade.",
  },
  {
    icon: ShieldOff,
    label: "No chargebacks",
    desc: "Escrow-settled trades are final.",
  },
  {
    icon: TrendingDown,
    label: "Lower fees",
    desc: "0.1% vs 3–7% on traditional rails.",
  },
];

/* ── Live earn feed ── */
const ALL_TXNS = [
  { emoji: "☕", label: "The Coffee Co.", amount: 0.5 },
  { emoji: "🛒", label: "Dubai Mall", amount: 2.4 },
  { emoji: "✈️", label: "Emirates Air", amount: 12.8 },
  { emoji: "🏨", label: "Armani Hotel", amount: 28.6 },
  { emoji: "🍽️", label: "Zuma Dubai", amount: 5.2 },
];

function EarnUI({ isDark }: { isDark: boolean }) {
  const [total, setTotal] = useState<number>(847.2);
  const [cursor, setCursor] = useState<number>(0);
  const [rows, setRows] = useState(ALL_TXNS.slice(0, 3));
  const [flash, setFlash] = useState<boolean>(false);

  useEffect(() => {
    const id = setInterval(() => {
      const next = ALL_TXNS[cursor % ALL_TXNS.length];
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
        background: isDark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.03)",
        border: isDark
          ? "1px solid rgba(255,255,255,0.07)"
          : "1px solid rgba(0,0,0,0.08)",
        borderRadius: 16,
        padding: "16px 16px 12px",
      }}
    >
      {/* Totals row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 12,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 9,
              letterSpacing: "0.18em",
              color: isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.35)",
              marginBottom: 4,
              textTransform: "uppercase",
              fontFamily: "monospace",
            }}
          >
            Total earned
          </div>
          <motion.div
            key={total}
            initial={{ y: -5, opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: isDark ? "#ffffff" : "#1a1a1a",
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
                fontSize: 11,
                fontWeight: 500,
                color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.3)",
                marginLeft: 5,
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
            gap: 4,
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              padding: "2px 8px",
              borderRadius: 999,
              background: isDark
                ? "rgba(255,255,255,0.06)"
                : "rgba(0,0,0,0.05)",
              border: isDark
                ? "1px solid rgba(255,255,255,0.1)"
                : "1px solid rgba(0,0,0,0.08)",
              fontSize: 8,
              fontWeight: 700,
              color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
              fontFamily: "monospace",
              letterSpacing: "0.05em",
            }}
          >
            2% BACK
          </div>
          <div
            style={{
              padding: "2px 8px",
              borderRadius: 999,
              background: "rgba(61,220,132,0.08)",
              border: "1px solid rgba(61,220,132,0.18)",
              fontSize: 8,
              fontWeight: 700,
              color: isDark ? "#3ddc84" : "#1a9d52",
              fontFamily: "monospace",
              letterSpacing: "0.05em",
            }}
          >
            ×5 STREAK
          </div>
        </div>
      </div>

      <div
        style={{
          height: 1,
          background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)",
          marginBottom: 8,
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
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
                gap: 7,
                padding: "6px 8px",
                borderRadius: 8,
                background:
                  i === 0 && flash
                    ? isDark
                      ? "rgba(255,255,255,0.04)"
                      : "rgba(0,0,0,0.04)"
                    : isDark
                      ? "rgba(255,255,255,0.015)"
                      : "rgba(0,0,0,0.02)",
                border:
                  i === 0 && flash
                    ? isDark
                      ? "1px solid rgba(255,255,255,0.08)"
                      : "1px solid rgba(0,0,0,0.08)"
                    : "1px solid transparent",
                transition: "background 0.3s, border 0.3s",
              }}
            >
              <span style={{ fontSize: 13 }}>{tx.emoji}</span>
              <span
                style={{
                  flex: 1,
                  fontSize: 10,
                  color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.5)",
                  fontFamily: "monospace",
                }}
              >
                {tx.label}
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: isDark ? "#3ddc84" : "#1a9d52",
                  fontFamily: "monospace",
                  marginRight: 3,
                }}
              >
                +{tx.amount.toFixed(2)}
              </span>
              <span
                style={{
                  fontSize: 7,
                  padding: "1px 4px",
                  borderRadius: 999,
                  background: isDark
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(0,0,0,0.05)",
                  color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)",
                  fontWeight: 700,
                  fontFamily: "monospace",
                }}
              >
                2%
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ============================================
   SECTION: USE CASES
   ============================================ */
const UseCasesSection = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const t = {
    cardBg: isDark ? "#0a0a0f" : "#ffffff",
    cardBorder: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)",
    colBorder: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)",
    labelColor: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.35)",
    headingColor: isDark ? "#fff" : "#000",
    itemBg: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.025)",
    itemBorder: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)",
    iconBg: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
    iconColor: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)",
    itemLabel: isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.7)",
    itemDesc: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.4)",
    rewardSpan: isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.25)",
    rewardDesc: isDark ? "rgba(255,255,255,0.33)" : "rgba(0,0,0,0.4)",
    rewardLabel: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.35)",
    pillBg: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
    pillBorder: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
    pillColor: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)",
    myRewardsColor: isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)",
    liveColor: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.3)",
  };

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-[#FAF8F5] dark:bg-black/70">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/[0.06] to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-black/[0.08] dark:border-white/[0.08] bg-white/70 dark:bg-white/[0.03]">
            <span className="text-[10px] uppercase tracking-[0.25em] text-black/50 dark:text-white/40 font-semibold">
              Use cases
            </span>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
          className="heading-h2 text-black dark:text-white text-center"
          style={{
            marginBottom: 20,
          }}
        >
          Built for everyone.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="p-large text-black/50 dark:text-white/40 max-w-lg text-center mx-auto mb-12"
        >
          Whether you're sending value globally or running a merchant business,
          Blip is the network that makes it possible.
        </motion.p>

        {/* ONE big dark card — Users · Merchants · Earn */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4 "
        >
          {/* Col 1 — For Users */}
          <motion.div
            className="p-8 rounded-2xl cursor-pointer"
            style={{
              background: t.cardBg,
              border: `1px solid ${t.cardBorder}`,
            }}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <div
              style={{
                fontSize: 9,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: t.labelColor,
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              For Users
            </div>
            <h3
              style={{
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: t.headingColor,
                marginBottom: 20,
                lineHeight: 1.2,
              }}
            >
              Pay freely.
              <br />
              Globally.
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {userCases.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      padding: "10px 10px",
                      borderRadius: 10,
                      background: t.itemBg,
                      border: `1px solid ${t.itemBorder}`,
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 7,
                        background: t.iconBg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon
                        style={{ width: 13, height: 13, color: t.iconColor }}
                        strokeWidth={1.5}
                      />
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: t.itemLabel,
                          marginBottom: 2,
                        }}
                      >
                        {item.label}
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: t.itemDesc,
                          lineHeight: 1.5,
                        }}
                      >
                        {item.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Col 2 — For Merchants */}
          <motion.div
            className="p-8 rounded-2xl cursor-pointer"
            style={{
              background: t.cardBg,
              border: `1px solid ${t.cardBorder}`,
            }}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <div
              style={{
                fontSize: 9,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: t.labelColor,
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              For Merchants
            </div>
            <h3
              style={{
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: t.headingColor,
                marginBottom: 20,
                lineHeight: 1.2,
              }}
            >
              Scale without
              <br />
              limits.
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {merchantCases.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      padding: "10px 10px",
                      borderRadius: 10,
                      background: t.itemBg,
                      border: `1px solid ${t.itemBorder}`,
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 7,
                        background: t.iconBg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon
                        style={{ width: 13, height: 13, color: t.iconColor }}
                        strokeWidth={1.5}
                      />
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: t.itemLabel,
                          marginBottom: 2,
                        }}
                      >
                        {item.label}
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: t.itemDesc,
                          lineHeight: 1.5,
                        }}
                      >
                        {item.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Col 3 — Earn while you spend */}
          <motion.div
            className="p-8 flex flex-col justify-between rounded-2xl cursor-pointer"
            style={{
              background: t.cardBg,
              border: `1px solid ${t.cardBorder}`,
            }}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            {/* Copy */}
            <div>
              <div
                style={{
                  fontSize: 9,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: t.rewardLabel,
                  fontWeight: 600,
                  marginBottom: 6,
                }}
              >
                Rewards
              </div>
              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: t.headingColor,
                  lineHeight: 1.2,
                  marginBottom: 8,
                }}
              >
                Earn while you spend.{" "}
                <span style={{ color: t.rewardSpan }}>Every transaction.</span>
              </h3>
              <p
                style={{
                  fontSize: 11,
                  color: t.rewardDesc,
                  lineHeight: 1.65,
                  marginBottom: 16,
                }}
              >
                Every payment earns BLIP rewards automatically. No sign-ups, no
                programs. Instant, on-chain, non-custodial.
              </p>

              {/* Pills */}
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  flexWrap: "wrap",
                  marginBottom: 20,
                }}
              >
                {["2% cashback", "Instant", "Non-custodial"].map((pill) => (
                  <div
                    key={pill}
                    style={{
                      padding: "3px 10px",
                      borderRadius: 999,
                      background: t.pillBg,
                      border: `1px solid ${t.pillBorder}`,
                      fontSize: 9,
                      fontWeight: 600,
                      color: t.pillColor,
                    }}
                  >
                    {pill}
                  </div>
                ))}
              </div>
            </div>

            {/* Live panel header */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 7,
                    background: isDark
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(0,0,0,0.05)",
                    border: isDark
                      ? "1px solid rgba(255,255,255,0.08)"
                      : "1px solid rgba(0,0,0,0.07)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Sparkles
                    style={{
                      width: 11,
                      height: 11,
                      color: isDark
                        ? "rgba(255,255,255,0.4)"
                        : "rgba(0,0,0,0.4)",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: t.myRewardsColor,
                  }}
                >
                  My Rewards
                </span>
                <div
                  style={{
                    marginLeft: "auto",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#3ddc84",
                      boxShadow: "0 0 5px rgba(61,220,132,0.7)",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 8,
                      color: t.liveColor,
                      fontFamily: "monospace",
                    }}
                  >
                    LIVE
                  </span>
                </div>
              </div>

              <EarnUI isDark={isDark} />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  marginTop: 14,
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
                  }}
                >
                  Learn about Blip Rewards
                </span>
                <ArrowUpRight
                  style={{
                    width: 12,
                    height: 12,
                    color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
                  }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/[0.06] to-transparent" />
    </section>
  );
};

export default memo(UseCasesSection);
