import { motion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ── Comparison data ── */
const ROWS: Array<{
  label: string;
  sub?: string;
  blip: string | boolean;
  swift: string | boolean;
  stripe: string | boolean;
  ripple: string | boolean;
}> = [
  {
    label: "Settlement time",
    blip: "< 2 seconds",
    swift: "3–5 days",
    stripe: "1–2 days",
    ripple: "3–5 seconds",
  },
  {
    label: "Transaction fee",
    blip: "0.1%",
    swift: "5–7%",
    stripe: "2.9% + $0.30",
    ripple: "~0.5%",
  },
  {
    label: "Custody",
    blip: "Non-custodial",
    swift: "Bank-held",
    stripe: "Stripe-held",
    ripple: "Partial",
  },
  {
    label: "Privacy by default",
    blip: true,
    swift: false,
    stripe: false,
    ripple: false,
  },
  {
    label: "On-chain proof",
    blip: true,
    swift: false,
    stripe: false,
    ripple: true,
  },
  {
    label: "Escrow protection",
    blip: true,
    swift: false,
    stripe: false,
    ripple: false,
  },
  {
    label: "Merchant bidding",
    sub: "Best rate via competition",
    blip: true,
    swift: false,
    stripe: false,
    ripple: false,
  },
  {
    label: "Stablecoin native",
    blip: true,
    swift: false,
    stripe: false,
    ripple: false,
  },
  {
    label: "Permissionless",
    sub: "No bank relationship needed",
    blip: true,
    swift: false,
    stripe: false,
    ripple: false,
  },
];

const COLS = [
  { key: "blip",   label: "Blip",   accent: true  },
  { key: "swift",  label: "SWIFT",  accent: false },
  { key: "stripe", label: "Stripe", accent: false },
  { key: "ripple", label: "Ripple", accent: false },
] as const;

type ColKey = typeof COLS[number]["key"];

function Cell({ val, isBlip }: { val: string | boolean; isBlip: boolean }) {
  if (typeof val === "boolean") {
    return val ? (
      <span
        className="inline-flex items-center justify-center w-6 h-6 rounded-full"
        style={{
          background: isBlip ? "rgba(255,107,53,0.15)" : "rgba(255,255,255,0.04)",
          border: isBlip ? "1px solid rgba(255,107,53,0.3)" : "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Check
          style={{
            width: 11,
            height: 11,
            color: isBlip ? "#ff6b35" : "rgba(255,255,255,0.45)",
          }}
        />
      </span>
    ) : (
      <span className="inline-flex items-center justify-center w-6 h-6">
        <X style={{ width: 11, height: 11, color: "rgba(255,255,255,0.18)" }} />
      </span>
    );
  }

  return (
    <span
      style={{
        fontSize: 12,
        fontFamily: "monospace",
        fontWeight: isBlip ? 700 : 400,
        color: isBlip ? "#ff6b35" : "rgba(255,255,255,0.4)",
        letterSpacing: "-0.02em",
      }}
    >
      {val}
    </span>
  );
}

/* ============================================
   SECTION: COMPARISON TABLE
   ============================================ */
const ComparisonSection = () => {
  return (
    <section
      className="relative py-28 overflow-hidden"
      style={{ background: "#0a0a0f" }}
    >
      {/* Ambient top glow */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,107,53,0.3) 50%, transparent)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: -100,
          left: "50%",
          transform: "translateX(-50%)",
          width: 800,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(255,107,53,0.06) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="max-w-5xl mx-auto px-6">
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
              color: "rgba(255,107,53,0.6)",
              marginBottom: 20,
            }}
          >
            Why Blip
          </p>
          <h2
            style={{
              fontSize: "clamp(2.8rem, 5.5vw, 5rem)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.08,
              color: "#ffffff",
              marginBottom: 16,
            }}
          >
            The infrastructure gap{" "}
            <span style={{ color: "rgba(255,255,255,0.28)" }}>
              nobody else closes.
            </span>
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "rgba(255,255,255,0.35)",
              maxWidth: 440,
              margin: "0 auto",
              lineHeight: 1.65,
            }}
          >
            Every alternative forces a trade-off. Blip doesn't.
          </p>
        </motion.div>

        {/* ── Table ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: EASE }}
          className="overflow-x-auto"
        >
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
            {/* Column headers */}
            <thead>
              <tr>
                {/* Feature label column */}
                <th
                  style={{
                    padding: "12px 20px 20px 0",
                    textAlign: "left",
                    width: "32%",
                  }}
                />
                {COLS.map((col) => (
                  <th
                    key={col.key}
                    style={{
                      padding: "12px 16px 20px",
                      textAlign: "center",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        display: "inline-flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      {col.accent && (
                        <div
                          style={{
                            fontSize: 8,
                            fontWeight: 700,
                            letterSpacing: "2px",
                            color: "#ff6b35",
                            textTransform: "uppercase",
                            padding: "2px 8px",
                            background: "rgba(255,107,53,0.12)",
                            border: "1px solid rgba(255,107,53,0.2)",
                            borderRadius: 999,
                          }}
                        >
                          Our pick
                        </div>
                      )}
                      <span
                        style={{
                          fontSize: col.accent ? 16 : 13,
                          fontWeight: 700,
                          color: col.accent ? "#ffffff" : "rgba(255,255,255,0.35)",
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {col.label}
                      </span>
                    </div>
                    {/* Highlight column indicator */}
                    {col.accent && (
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          borderLeft: "1px solid rgba(255,107,53,0.2)",
                          borderRight: "1px solid rgba(255,107,53,0.2)",
                          borderTop: "1px solid rgba(255,107,53,0.2)",
                          borderRadius: "12px 12px 0 0",
                          background: "rgba(255,107,53,0.03)",
                          pointerEvents: "none",
                        }}
                      />
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {ROWS.map((row, i) => (
                <motion.tr
                  key={row.label}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04, duration: 0.5 }}
                >
                  {/* Label */}
                  <td
                    style={{
                      padding: "14px 20px 14px 0",
                      borderTop: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "rgba(255,255,255,0.65)",
                      }}
                    >
                      {row.label}
                    </div>
                    {row.sub && (
                      <div
                        style={{
                          fontSize: 10,
                          color: "rgba(255,255,255,0.25)",
                          marginTop: 2,
                        }}
                      >
                        {row.sub}
                      </div>
                    )}
                  </td>

                  {COLS.map((col) => (
                    <td
                      key={col.key}
                      style={{
                        padding: "14px 16px",
                        textAlign: "center",
                        borderTop: "1px solid rgba(255,255,255,0.05)",
                        position: "relative",
                        ...(col.accent
                          ? {
                              background: "rgba(255,107,53,0.025)",
                              borderLeft: "1px solid rgba(255,107,53,0.15)",
                              borderRight: "1px solid rgba(255,107,53,0.15)",
                            }
                          : {}),
                      }}
                    >
                      <Cell
                        val={row[col.key as ColKey]}
                        isBlip={col.accent}
                      />
                    </td>
                  ))}
                </motion.tr>
              ))}

              {/* Bottom border row for blip column highlight */}
              <tr>
                <td style={{ padding: 0 }} />
                {COLS.map((col) => (
                  <td
                    key={col.key}
                    style={{
                      padding: 0,
                      height: 0,
                      ...(col.accent
                        ? {
                            borderLeft: "1px solid rgba(255,107,53,0.2)",
                            borderRight: "1px solid rgba(255,107,53,0.2)",
                            borderBottom: "1px solid rgba(255,107,53,0.2)",
                            borderRadius: "0 0 12px 12px",
                            background: "rgba(255,107,53,0.03)",
                          }
                        : {}),
                    }}
                  />
                ))}
              </tr>
            </tbody>
          </table>
        </motion.div>

        {/* ── Bottom summary stats ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          className="grid grid-cols-1 md:grid-cols-3 gap-px mt-16 rounded-2xl overflow-hidden"
          style={{ border: "1px solid rgba(255,255,255,0.08)" }}
        >
          {[
            { val: "70×",   label: "Cheaper than SWIFT",    sub: "0.1% vs 5–7% average" },
            { val: "∞",     label: "Faster than traditional", sub: "Seconds, not days"   },
            { val: "100%",  label: "Non-custodial",           sub: "You hold the keys"   },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center p-8"
              style={{ background: "rgba(255,255,255,0.02)" }}
            >
              <div
                style={{
                  fontSize: "clamp(2.2rem,4vw,3.2rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.05em",
                  lineHeight: 1,
                  background: "linear-gradient(135deg, #ffffff 25%, #ff8c50 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  color: "transparent",
                  marginBottom: 8,
                }}
              >
                {stat.val}
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.65)",
                  marginBottom: 4,
                }}
              >
                {stat.label}
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.28)" }}>
                {stat.sub}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ComparisonSection;
