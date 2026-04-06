import { memo } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ── Big stat moment — Apple "20 hours" style ── */
const BigStat = memo(({
  value,
  label,
  sublabel,
}: {
  value: string;
  label: string;
  sublabel?: string;
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: isDark ? "#000" : "#FAF8F5",
        padding: "120px 24px",
      }}
    >
      <div className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 1.2, ease: EASE }}
          style={{
            fontSize: "clamp(5rem, 15vw, 12rem)",
            fontWeight: 700,
            letterSpacing: "-0.05em",
            lineHeight: 0.9,
            color: isDark ? "#fff" : "#1d1d1f",
            marginBottom: 16,
          }}
        >
          {value}
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          style={{
            fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)",
            fontWeight: 600,
            color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
            letterSpacing: "-0.02em",
          }}
        >
          {label}
        </motion.p>
        {sublabel && (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
            style={{
              fontSize: 15,
              color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)",
              marginTop: 8,
            }}
          >
            {sublabel}
          </motion.p>
        )}
      </div>
    </section>
  );
});

export default BigStat;
