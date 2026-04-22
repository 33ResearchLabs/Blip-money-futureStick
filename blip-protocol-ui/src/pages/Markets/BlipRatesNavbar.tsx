import { motion } from "framer-motion";

type Tab = "rates" | "arb" | "merchants";

const NAV_ITEMS: { id: Tab; label: string }[] = [
  { id: "rates", label: "Rates" },
  { id: "arb", label: "Arbitrage" },
  { id: "merchants", label: "Merchants" },
];

export default function BlipRatesNavbar({
  tab,
  onChange,
}: {
  tab: Tab;
  onChange: (t: Tab) => void;
}) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md"
      style={{
        background: "rgba(255,255,255,0.75)",
        borderBottom: "1px solid var(--border-default)",
      }}
    >
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <a
          href="/blip-rates"
          className="flex items-center gap-1 text-[15px] font-bold tracking-tight"
          style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}
        >
          blip
          <span style={{ color: "var(--brand)" }}>.</span>
          <span
            className="ml-1.5 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{
              background: "var(--brand)",
              color: "#fff",
              letterSpacing: "0.08em",
            }}
          >
            rates
          </span>
        </a>

        <div className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChange(item.id)}
                className="relative px-4 py-1.5 rounded-full text-[13px] font-semibold transition"
                style={{
                  color: active ? "#fff" : "var(--text-secondary)",
                  background: active
                    ? "linear-gradient(135deg, var(--brand) 0%, #ff8c50 100%)"
                    : "transparent",
                  boxShadow: active
                    ? "0 4px 14px rgba(255,107,53,0.28)"
                    : "none",
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
