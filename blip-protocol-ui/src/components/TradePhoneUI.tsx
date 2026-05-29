import { memo, useState } from "react";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Building2,
  Wallet,
  ChevronDown,
  Home,
  Zap,
  MessageCircle,
  Activity,
  User,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   TradePhoneUI — Coded iPhone mockup · P2P Trade USDT screen
   ═══════════════════════════════════════════════════════════ */

const TradePhoneUI = () => {
  const cardBg = "rgba(255,255,255,0.05)";
  const cardBorder = "rgba(255,255,255,0.08)";
  const activeTabBg = "rgba(255,255,255,0.10)";
  const inactiveTabBg = "rgba(255,255,255,0.04)";
  const divider = "rgba(255,255,255,0.07)";
  const muted = "rgba(255,255,255,0.28)";
  const sub = "rgba(255,255,255,0.42)";
  const [amount , setAmount] = useState('123')
  const inrRate = 95.38;
  const inrValue = (Number(amount) || 0) * inrRate;
  const formattedInr = inrValue.toLocaleString("en-IN", { maximumFractionDigits: 2 });

  

  return (
    <div className="relative w-full flex items-center justify-center pt-4 pb-2">
      {/* Phone frame */}
      <div
        className="relative mx-auto"
        style={{
          width: 232,
          height: 490,
          background:
            "linear-gradient(160deg, #2a2a2a 0%, #1a1a1a 50%, #222 100%)",
          borderRadius: 38,
          padding: 8,
          boxShadow:
            "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}
      >
        {/* Screen */}
        <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[30px] bg-[#050816] text-white">
          {/* Header */}
          <div className="relative shrink-0 px-3 pt-4 pb-2 text-center mt-2">
            <div className="absolute right-3 top-3">
              <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] font-medium">
                INR
                <ChevronDown size={9} />
              </div>
            </div>

            <p className="text-[7px] font-semibold uppercase tracking-[3px] text-white/40">
              You're Buying
            </p>

            <div className="mt-1 flex items-end justify-center gap-1.5">
              <span className="text-[38px] font-bold leading-none">{amount}</span>
              <span className="mb-0.5 text-sm font-semibold text-white/50">
                USDT
              </span>
            </div>

            <p className="mt-1 text-[10px] font-semibold text-white/50">
              ₹{formattedInr} INR
            </p>

            <div className="mt-2 flex justify-center gap-1.5 ">
              {[
                { label: "100", value: "100" },
                { label: "500", value: "500" },
                { label: "1K", value: "1000" },
                { label: "5K", value: "5000" },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => setAmount(item.value)}
                  className={`h-6 w-6 rounded-full border text-[8px] transition ${
                    amount === item.value
                      ? "border-white/30 bg-white/15 text-white"
                      : "border-white/10 bg-white/[0.03] text-white/60"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="my-2 grid grid-cols-2 gap-1.5">
              <button className="flex h-7 items-center justify-center gap-1 rounded-lg bg-white text-[10px] font-semibold text-black">
                <ArrowDownLeft size={10} className="text-emerald-500" />
                Buy
              </button>

              <button className="flex h-7 items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/[0.02] text-[10px] font-semibold text-white/40">
                <ArrowUpRight size={10} />
                Sell
              </button>
            </div>
          </div>

          {/* Bottom Sheet */}
          <div className="flex flex-1 flex-col rounded-t-[20px] border-t border-white/10 bg-[#0d1223] px-2.5 pt-2 pb-1.5">
            <div className="mx-auto mb-1.5 h-0.5 w-7 rounded-full bg-white/20" />

            {/* Settlement */}
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 mt-1">
              <span className="text-[8px] text-white/70">
                Final settlement amount
              </span>

              <div className="flex items-center gap-1 text-[11px] font-bold">
                {formattedInr} INR
                <ChevronDown size={10} />
              </div>
            </div>

            {/* Payment */}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-[7px] uppercase tracking-[2px] text-white/40 mb-1">
                Pay With
              </span>

              <span className="text-[7px] text-white/50">
                Add payment method
              </span>
            </div>

            <div className="mt-1 grid grid-cols-2 gap-1.5">
              <div className="rounded-lg bg-white p-1.5 text-black">
                <div className="flex items-center gap-1.5">
                  <div className="rounded-md bg-black/10 p-1">
                    <Building2 size={10} />
                  </div>

                  <div>
                    <p className="text-[9px] font-semibold leading-tight">Bank Transfer</p>
                    <p className="text-[7px] text-black/60">Wire / IBAN</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="rounded-md bg-white/5 p-1">
                    <Wallet size={10} />
                  </div>

                  <div>
                    <p className="text-[9px] font-semibold leading-tight">Cash</p>
                    <p className="text-[7px] text-white/40">In-person</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Priority */}
            <div className="mt-4">
              <p className="mb-1 text-[7px] uppercase tracking-[2px] text-white/40">
                Priority
              </p>

              <div className="grid grid-cols-3 rounded-lg border border-white/10 bg-white/[0.03] p-0.5">
                <div className="rounded-md bg-white py-1 text-center text-black">
                  <p className="text-[8px] font-semibold leading-tight">Fastest</p>
                  <p className="text-[7px] text-black/60">2.9%</p>
                </div>

                <div className="py-1 text-center text-white/50">
                  <p className="text-[8px] font-semibold leading-tight">Best Rate</p>
                  <p className="text-[7px]">2.5%</p>
                </div>

                <div className="py-1 text-center text-white/50">
                  <p className="text-[8px] font-semibold leading-tight">Cheapest</p>
                  <p className="text-[7px]">1.5%</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <button className="mt-4 flex h-8 w-full items-center justify-center gap-1 rounded-xl bg-white text-[11px] font-bold text-black">
              <ArrowDownLeft size={12} />
              Buy {amount} USDT
            </button>
          </div>

          {/* Bottom Nav */}
          <div className="shrink-0 bg-white px-2 py-1.5">
            <div className="grid grid-cols-5">
              {[
                { icon: Home, label: "HOME" },
                { icon: Zap, label: "TRADE", active: true },
                { icon: MessageCircle, label: "INBOX" },
                { icon: Activity, label: "ACTIVITY" },
                { icon: User, label: "YOU" },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className={`flex flex-col items-center ${
                      item.active ? "text-black" : "text-gray-400"
                    }`}
                  >
                    <Icon size={12} />
                    <span className="mt-0.5 text-[6px]">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ....... */}
      </div>

      {/* Glow under phone */}
      <div
        className="absolute bottom-0 left-1/4 right-1/4 h-8 rounded-full blur-2xl"
        style={{ background: "rgba(255,107,53,0.2)" }}
      />
    </div>
  );
};

export default memo(TradePhoneUI);
