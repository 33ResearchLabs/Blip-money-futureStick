import {
  Home,
  Plus,
  Activity,
  MessageCircle,
  History,
  Bell,
  CreditCard,
  X,
  ChevronRight,
  ArrowUpRight,
  Check,
  ArrowUpDown,
  ArrowDownLeft,
  ArrowDown,
  ArrowUp,
} from "lucide-react";

export default function MobileMerchantDashboard() {
  return (
    <div className="relative flex max-h-screen w-full flex-col overflow-hidden bg-black text-white antialiased [font-feature-settings:'ss01']">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(120,120,255,0.22),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_30%,rgba(255,107,53,0.14),transparent_45%)]" />

      {/* Scrollable content — flex-1 so the bottom nav stays pinned below it (in flow, never overlapping). */}
      <div className="relative z-10 min-h-0 flex-1 overflow-hidden px-4 pt-3 pb-3">
        {/* Header — top bar keeps icons compact so the greeting owns its own full-width line (no wrap at 320px) */}
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/40">
            Thursday, Jun 4
          </p>

          <div className="flex items-center gap-2">
            <button
              aria-label="Cards"
              className="relative flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors active:bg-white/10"
            >
              <CreditCard size={13} className="text-white/80" />
              <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-violet-500 ring-2 ring-black" />
            </button>

            <button
              aria-label="Notifications"
              className="relative flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors active:bg-white/10"
            >
              <Bell size={13} className="text-white/80" />
              <span className="absolute -top-1 -right-1 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-emerald-300 px-1 text-[10px] font-bold leading-none text-black ring-2 ring-black">
                1
              </span>
            </button>

            <div className="h-7 w-7 overflow-hidden rounded-full border border-white/10">
              <img
                src="https://i.pravatar.cc/100"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        <h1 className=" text-[20px] font-bold leading-tight tracking-[-0.02em]">
          Good afternoon
        </h1>

        {/* Balance */}
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300" />
            </span>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-200/80">
              Live Balance
            </p>
          </div>

          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-[44px] font-bold leading-none tracking-[-0.03em]">
              0.00
            </span>
            <span className="text-[20px] font-semibold tracking-[-0.01em] text-white/35">
              USDT
            </span>
          </div>
        </div>

        {/* Rate */}
        <div className="mt-4 flex items-stretch gap-2.5">
          <button className="flex flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-left transition-colors active:bg-white/[0.07]">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-[10px] font-bold text-white/60">
              IN
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1.5 text-[13px] font-semibold leading-tight">
                USDT / INR
                <span className="h-3 w-px bg-white/15" />
              </span>
              <span className="block text-[13px] font-bold leading-tight">
                ₹102.45
              </span>
            </span>
            <ArrowUpDown size={15} className="shrink-0 text-white/40" />
          </button>

          <button className="flex w-[88px] shrink-0 flex-col items-center justify-center gap-1.5 rounded-2xl border border-white/10 bg-white/[0.04] px-2 py-2.5 text-center transition-colors active:bg-white/[0.07]">
            <span className="text-[13px] font-semibold leading-tight text-white/55">
              Set rate
            </span>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
              <Plus size={14} />
            </span>
          </button>
        </div>

        {/* Buy / Sell */}
        <div className="mt-2.5 grid grid-cols-2 gap-2.5">
          <button className="relative flex flex-col rounded-2xl bg-white px-3 pt-2.5 pb-2.5 text-left text-black transition-transform active:scale-[0.98]">
            <div className="flex items-start justify-between">
              <ArrowUpRight size={16} />
              <ChevronRight size={13} className="text-black/30" />
            </div>
            <span className="mt-1.5 text-[15px] font-bold tracking-[-0.02em]">
              Buy
            </span>
            <span className="text-[10px] font-medium text-black/50">
              Acquire USDT
            </span>
          </button>

          <button className="relative flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] px-3 pt-2.5 pb-2.5 text-left transition-transform active:scale-[0.98]">
            <div className="flex items-start justify-between">
              <ArrowDownLeft size={16} className="text-white/85" />
              <ChevronRight size={13} className="text-white/30" />
            </div>
            <span className="mt-1.5 text-[15px] font-bold tracking-[-0.02em]">
              Sell
            </span>
            <span className="text-[10px] font-medium text-white/45">
              Offload USDT
            </span>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="mt-2.5 grid grid-cols-3 gap-2.5">
          <QuickAction icon={<ArrowDown size={18} />} label="Deposit" />
          <QuickAction icon={<ArrowUpDown size={18} />} label="Swap" />
          <QuickAction icon={<ArrowUp size={18} />} label="Send" />
        </div>

        {/* Recent Activity */}
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[13px] font-bold tracking-[-0.01em]">
              Recent activity
            </h2>
            <button className="flex items-center gap-1 text-[12px] font-semibold text-white/55 transition-colors active:text-white/80">
              See all
              <ChevronRight size={13} />
            </button>
          </div>

          <div className="mt-2 flex flex-col items-center rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-2 text-center">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-white/[0.06]">
              <Activity size={13} className="text-white/40" />
            </div>
            <p className="mt-2 text-[12px] text-white/40">No recent activity</p>
            <button className="mt-1.5 rounded-xl border border-dashed border-white/15 px-3.5 py-1 text-[10px] font-semibold text-white/70 transition-colors active:bg-white/5">
              Post your first trade
            </button>
          </div>
        </div>

        {/* Merchant Setup */}
        <div className="mt-2.5 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="px-4 pt-2 pb-3.5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/35">
                  Getting Started
                </p>
                <h3 className="mt-0.5 text-[13px] font-bold tracking-[-0.01em]">
                  Merchant Setup
                </h3>
                <p className="mt-0.5 text-[10px] text-white/45">
                  1 of 2 required steps done
                </p>
              </div>

              <button
                aria-label="Dismiss"
                className="-mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white/30 transition-colors active:bg-white/5"
              >
                <X size={13} />
              </button>
            </div>

            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-brand to-brand-light" />
            </div>
            <div className="mt-1.5 flex justify-between text-[10px] font-medium text-white/35">
              <span>33% complete</span>
              <span>1 / 3 steps</span>
            </div>
          </div>

          <div className="border-t border-white/[0.06]">
            <div className="flex items-center gap-3 px-4 py-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-300/15 text-emerald-300">
                <Check size={13} />
              </div>
              <span className="flex-1 text-xs text-white/40 line-through decoration-white/20">
                Connect Wallet
              </span>
            </div>

            <div className="flex items-center gap-3 border-t border-white/[0.06] px-4 py-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-white/70">
                <ArrowUpRight size={13} />
              </div>
              <span className="flex-1 text-xs font-semibold">Set INR Rate</span>
              <button className="flex shrink-0 items-center gap-1 rounded-xl bg-white/10 px-3 py-1 text-[11px] font-semibold transition-colors active:bg-white/15">
                Set Rate
                <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Floating Action Button — sits in the gap just above the in-flow nav */}
      <button
        aria-label="New order"
        className="absolute bottom-[54px] right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-light text-white shadow-[0_12px_30px_-8px_rgba(255,107,53,0.7)] transition-transform active:scale-95"
      >
        <Plus size={20} />
      </button>

      {/* Bottom Navigation — in normal flow as the last flex child, so it can never overlap content */}
      <div className="relative z-10 shrink-0 border-t border-white/10 bg-black/90 backdrop-blur-xl">
        <div className="flex justify-around px-1 pt-1.5 pb-2">
          <NavItem icon={<Home size={18} />} label="Home" active />
          <NavItem icon={<Plus size={18} />} label="New Order" />
          <NavItem icon={<Activity size={18} />} label="Active" />
          <NavItem icon={<MessageCircle size={18} />} label="Chat" />
          <NavItem icon={<History size={18} />} label="History" />
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button className="flex flex-col items-center gap-1.5 rounded-2xl border border-white/10 bg-white/[0.04] py-3 text-[12px] font-semibold text-white/80 transition-colors active:bg-white/[0.07]">
      {icon}
      <span className="leading-none">{label}</span>
    </button>
  );
}

function NavItem({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`flex flex-1 flex-col items-center gap-0.5 text-[10px] font-medium transition-colors ${
        active ? "text-white" : "text-white/35 active:text-white/60"
      }`}
    >
      {icon}
      <span className="leading-none">{label}</span>
    </button>
  );
}
