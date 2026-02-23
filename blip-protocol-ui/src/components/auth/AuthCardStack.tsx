import { motion } from "framer-motion";

interface AuthCardStackProps {
  variant?: "merchant" | "user";
  className?: string;
}

const ease = [0.16, 1, 0.3, 1] as const;

export default function AuthCardStack({
  variant = "user",
  className = "",
}: AuthCardStackProps) {
  return (
    <div className={`relative w-[460px] h-[420px] ${className}`}>
      {/* ── Main phone-frame card (center, largest) ── */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.9, ease }}
        className="absolute left-[95px] top-[30px] z-20 w-[250px] h-[340px] rounded-[28px] overflow-hidden border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#111] shadow-[0_24px_80px_-16px_rgba(0,0,0,0.25)] dark:shadow-[0_24px_80px_-16px_rgba(0,0,0,0.6)]"
      >
        {/* Phone notch */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-20 h-1.5 bg-black/10 dark:bg-white/10 rounded-full" />
        </div>

        {/* Dashboard screen content */}
        <div className="px-4 pt-1">
          <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-black/40 dark:text-white/40 mb-2">
            Blip Dashboard
          </div>

          {/* Balance */}
          <div className="mb-3">
            <div className="text-[10px] text-black/40 dark:text-white/40 mb-1">
              Total Balance
            </div>
            <div className="text-[24px] font-bold text-black dark:text-white tracking-tight leading-none">
              $12,847
              <span className="text-[12px] text-black/30 dark:text-white/30">
                .00
              </span>
            </div>
          </div>

          {/* Mini chart */}
          <div className="flex items-end gap-[3px] h-10 mb-3">
            {[25, 40, 35, 55, 45, 70, 50, 85, 60, 75, 65, 90].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-[2px]"
                style={{
                  height: `${h}%`,
                  background:
                    i >= 9 ? "rgba(255, 107, 53, 0.6)" : "rgba(0,0,0,0.06)",
                }}
              />
            ))}
          </div>

          {/* Transaction list */}
          <div className="space-y-2">
            {[
              {
                flag: "🇦🇪",
                pair: "USDT → AED",
                amount: "$2,500",
                status: "Settled",
              },
              {
                flag: "🇳🇬",
                pair: "BTC → NGN",
                amount: "₦2.8M",
                status: "Pending",
              },
              {
                flag: "🇮🇳",
                pair: "USDC → INR",
                amount: "₹42,000",
                status: "Settled",
              },
            ].map((tx, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-1.5 border-b border-black/[0.04] dark:border-white/[0.04] last:border-0"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs">{tx.flag}</span>
                  <div>
                    <div className="text-[10px] font-medium text-black dark:text-white">
                      {tx.pair}
                    </div>
                    <div className="text-[8px] text-black/30 dark:text-white/30">
                      {tx.status}
                    </div>
                  </div>
                </div>
                <div className="text-[10px] font-semibold text-black dark:text-white">
                  {tx.amount}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom nav bar */}
        <div className="absolute bottom-0 inset-x-0 flex justify-center pb-2 pt-1.5 border-t border-black/[0.04] dark:border-white/[0.04]">
          <div className="flex gap-6">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full ${i === 0 ? "bg-[#ff6b35]/20" : "bg-black/[0.04] dark:bg-white/[0.06]"}`}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Small card: Transaction confirmed (top-left, behind phone) ── */}
      <motion.div
        initial={{ opacity: 0, y: 30, rotate: 0 }}
        animate={{ opacity: 1, y: 0, rotate: -8 }}
        transition={{ delay: 0.35, duration: 0.8, ease }}
        className="absolute left-0 top-0 z-10 w-[155px] rounded-2xl overflow-hidden border border-white/15 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.3)]"
        style={{
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        }}
      >
        <div className="p-3.5">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="text-[9px] font-semibold text-white/90">
              Confirmed
            </span>
          </div>
          <div className="text-base font-bold text-white">$2,500</div>
          <div className="text-[8px] text-white/50 mt-0.5">0.8s settlement</div>
        </div>
      </motion.div>

      {/* ── Small card: Rewards (left side, overlaps phone bottom-left) ── */}
      <motion.div
        initial={{ opacity: 0, y: 30, rotate: 0 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ delay: 0.5, duration: 0.8, ease }}
        className="absolute -left-[30px] top-[260px] z-30 w-[140px] rounded-xl overflow-hidden border border-white/15 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.3)]"
        style={{
          background: "linear-gradient(135deg, #ff6b35 0%, #f97316 100%)",
        }}
      >
        <div className="p-3">
          <div className="text-[8px] font-bold uppercase tracking-[0.15em] text-white/50 mb-1">
            Rewards
          </div>
          <div className="text-xl font-bold text-white leading-none">+200</div>
          <div className="text-[8px] text-white/60 mt-1">Welcome Bonus</div>
          <div className="mt-1.5 w-full h-1 bg-white/15 rounded-full overflow-hidden">
            <div className="w-[35%] h-full bg-white/60 rounded-full" />
          </div>
        </div>
      </motion.div>

      {/* ── Floating badge: Wallet connected (top-right) ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.6, ease }}
        className="absolute right-[10px] top-[10px] z-30"
      >
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#1a1a1a] border border-black/[0.06] dark:border-white/[0.08] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.12)]">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-[9px] font-semibold text-black/70 dark:text-white/70">
            Wallet Connected
          </span>
        </div>
      </motion.div>

      {/* ── Floating emoji (top-left corner) ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, duration: 0.5, type: "spring", bounce: 0.5 }}
        className="absolute left-[40px] top-[90px] z-10"
      >
        <div className="w-9 h-9 rounded-full bg-white dark:bg-[#1a1a1a] border border-black/[0.06] dark:border-white/[0.08] shadow-[0_4px_16px_-4px_rgba(0,0,0,0.12)] flex items-center justify-center text-base">
          ⚡
        </div>
      </motion.div>

      {/* ── Circular Blip token icon (right of phone, mid-height) ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.65, duration: 0.6, type: "spring", bounce: 0.4 }}
        className="absolute right-[15px] top-[240px] z-30"
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#f97316] border-[3px] border-white dark:border-[#111] shadow-[0_8px_24px_-4px_rgba(255,107,53,0.4)] flex items-center justify-center">
          <span className="text-white font-bold text-xs">B</span>
        </div>
      </motion.div>

      {/* ── Small card: Privacy shield (right side, overlaps phone edge) ── */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.55, duration: 0.7, ease }}
        className="absolute right-0 top-[120px] z-30 w-[130px] rounded-xl bg-white dark:bg-[#1a1a1a] border border-black/[0.06] dark:border-white/[0.08] shadow-[0_8px_32px_-8px_rgba(0,0,0,0.15)] overflow-hidden"
      >
        <div className="p-2.5">
          <div className="flex items-center gap-2 mb-1.5">
            <div
              className="w-5 h-5 rounded-lg flex items-center justify-center"
              style={{
                background:
                  variant === "merchant"
                    ? "rgba(139, 92, 246, 0.1)"
                    : "rgba(59, 130, 246, 0.1)",
              }}
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke={variant === "merchant" ? "#8b5cf6" : "#3b82f6"}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <span className="text-[8px] font-semibold text-black/70 dark:text-white/70">
              Encrypted
            </span>
          </div>
          <div className="text-[7px] text-black/40 dark:text-white/40 leading-relaxed">
            Zero-knowledge proofs protect every transaction
          </div>
        </div>
      </motion.div>

      {/* ── Heart reaction (right side float) ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.5, type: "spring", bounce: 0.5 }}
        className="absolute right-[40px] top-[300px] z-30"
      >
        <div className="w-8 h-8 rounded-full bg-rose-500 shadow-[0_4px_16px_-4px_rgba(244,63,94,0.5)] flex items-center justify-center">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="white"
            stroke="none"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>
      </motion.div>
    </div>
  );
}
