import { useP2PRate } from "@/hooks/useP2PRate";
import {
  Activity,
  Gift,
  Bell,
  Search,
  ScanLine,
  CircleDollarSign,
  ArrowDownToLine,
  ArrowUpDown,
  TrendingUp,
  Scan,
  HelpCircle,
  FileText,
  Award,
  Share2,
  Home,
  Navigation,
  MessageCircle,
  User,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Config + mock data                                                  */
/* ------------------------------------------------------------------ */

/** Brand accent used across the screen (amber/gold). */
const ACCENT = "#F5A623";

/** Time-of-day greeting based on the local hour. */
function getGreeting(date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

interface ActionItem {
  id: string;
  label: string;
  icon: LucideIcon;
  highlighted?: boolean;
}

const QUICK_ACTIONS: ActionItem[] = [
  { id: "deposit", label: "Deposit", icon: ArrowDownToLine },
  { id: "swap", label: "Swap", icon: ArrowUpDown },
  { id: "trade", label: "Trade", icon: TrendingUp, highlighted: true },
  { id: "scan", label: "Scan", icon: Scan },
];

const LEARN_MORE: ActionItem[] = [
  { id: "support", label: "Support", icon: HelpCircle },
  { id: "ticket", label: "Ticket", icon: FileText },
  { id: "rewards", label: "Rewards", icon: Award },
  { id: "refer", label: "Refer", icon: Share2 },
];

const PROMO = {
  title: "Best rates",
  subtitle: "beat it & we match it -₹92.00 LIVE",
  progress: 5,
  totalDots: 8,
  bonusText: "2 days to a bonus 🔥",
};

/* ------------------------------------------------------------------ */
/* Public component                                                    */
/* ------------------------------------------------------------------ */

interface BlipPhoneMockupProps {
  /** Wallet balance in USDT; drives the headline amount + INR note. */
  balance?: number | string;
}

export function BlipPhoneMockup({ balance = 56000 }: BlipPhoneMockupProps) {
  // Live USDT/INR rate from /api/rates (shared hook); falls back to 95.38.
  const live = useP2PRate("INR");
  const inrRate = live.isLive && live.buy != null ? live.buy : 95.38;

  const amount = Number(balance) || 0;
  const [whole, cents] = amount.toFixed(2).split(".");
  const wholeFormatted = Number(whole).toLocaleString("en-US");

  return (
    // Outer frame keeps the original responsive footprint + aspect ratio.
    // The device is designed at a fixed 390×861 and scaled down to fit.
    <div
      className="relative mx-auto w-full max-w-[200px] overflow-hidden sm:max-w-[250px]"
      style={{ aspectRatio: "390 / 780" }}
    >
      <div className="absolute left-0 top-0 origin-top-left scale-[0.513] sm:scale-[0.641]">
        <PhoneDevice
          whole={wholeFormatted}
          cents={cents}
          inrRate={inrRate}
        />
      </div>
    </div>
  );
}

export default BlipPhoneMockup;

/* ------------------------------------------------------------------ */
/* Device frame (fixed design size, scaled by parent)                  */
/* ------------------------------------------------------------------ */

function PhoneDevice({
  whole,
  cents,
  inrRate,
}: {
  whole: string;
  cents: string;
  inrRate: number;
}) {
  return (
    <div className="h-[780px] w-[390px] rounded-[3.2rem] bg-black p-[10px] ">
      <div className="relative h-full w-full overflow-hidden rounded-[2.7rem] bg-white">
        {/* Dynamic island */}
        <div className="absolute left-1/2 top-2.5 z-30 h-7 w-28 -translate-x-1/2 rounded-full bg-black" />

        <div className="flex h-full flex-col">
          {/* Dark top panel: greeting + balance */}
          <div className="bg-[#0b0b0d] px-5 pb-9 pt-14">
            <Header />
            <BalanceCard whole={whole} cents={cents} inrRate={inrRate} />
          </div>

          {/* White content sheet overlapping the dark panel */}
          <div className="-mt-5 flex-1 rounded-t-[28px] bg-white px-5 pt-5">
            <SearchBar />
            <PromoCard />
            <ActionGrid />
            <LearnMore />
          </div>

          <BottomNav />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */

function Header() {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="">
          <img src="/brand/blip-icon-bg-remove.png" className="h-12 w-12 rounded-xl" style={{ color: ACCENT }} />
        </div>
        <div className="leading-tight">
          <p className="text-xs font-medium text-white/50">{getGreeting()}</p>
          <p className="text-sm font-semibold text-white">Alex</p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
          <Gift className="h-[18px] w-[18px] text-white/80" />
        </span>
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
          <Bell className="h-[18px] w-[18px] text-white/80" />
        </span>
      </div>
    </header>
  );
}

function BalanceCard({
  whole,
  cents,
  inrRate,
}: {
  whole: string;
  cents: string;
  inrRate: number;
}) {
  return (
    <section className="mt-7">
      <p className="text-[11px] font-semibold tracking-[0.14em] text-white/40">
        BALANCE
      </p>

      <div className="mt-1.5 flex items-center gap-3">
        <h1 className="flex items-baseline font-bold tracking-tight text-white">
          <span className="text-2xl">$</span>
          <span className="text-[2.6rem] leading-none">{whole}</span>
          <span className="text-xl text-white/80">.{cents}</span>
        </h1>

        <button
          type="button"
          className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-black active:scale-95"
        >
          Add
        </button>
      </div>

      <p className="mt-2 text-xs font-medium text-white/45">
        1.00 USDT. = INR {inrRate.toFixed(0)}
      </p>
    </section>
  );
}

function SearchBar() {
  return (
    <div className="flex items-center gap-3 rounded-full border border-neutral-200/80 bg-white px-4 py-2.5 shadow-sm">
      <Search className="h-[18px] w-[18px] shrink-0 text-neutral-400" />
      <input
        type="text"
        placeholder="Name, phone or UPI ID"
        className="flex-1 bg-transparent text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none"
      />
      <button
        type="button"
        aria-label="Scan QR"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full active:scale-95"
        style={{ backgroundColor: ACCENT }}
      >
        <ScanLine className="h-4 w-4 text-white" strokeWidth={2.5} />
      </button>
    </div>
  );
}

function PromoCard() {
  return (
    <div className="mt-4 rounded-2xl border border-neutral-200/80 bg-white p-3.5 shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${ACCENT}1A` }}
        >
          <CircleDollarSign className="h-5 w-5" style={{ color: ACCENT }} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-neutral-900">{PROMO.title}</p>
          <p className="truncate text-xs text-neutral-500">{PROMO.subtitle}</p>
        </div>

        <button
          type="button"
          className="shrink-0 rounded-lg px-4 py-1.5 text-sm font-semibold text-white active:scale-95"
          style={{ backgroundColor: ACCENT }}
        >
          Trade
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {Array.from({ length: PROMO.totalDots }).map((_, i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: i < PROMO.progress ? ACCENT : "#E5E5E5" }}
            />
          ))}
        </div>
        <p className="text-xs font-medium text-neutral-400">{PROMO.bonusText}</p>
      </div>
    </div>
  );
}

function ActionGrid() {
  return (
    <div className="mt-5 grid grid-cols-4 gap-3">
      {QUICK_ACTIONS.map(({ id, label, icon: Icon, highlighted }) => (
        <div key={id} className="flex flex-col items-center gap-2">
          <span className="flex aspect-square w-full items-center justify-center rounded-2xl bg-neutral-900 active:scale-95">
            <Icon
              className="h-5 w-5"
              strokeWidth={2}
              style={{ color: highlighted ? ACCENT : "#fff" }}
            />
          </span>
          <span className="text-xs font-medium text-neutral-700">{label}</span>
        </div>
      ))}
    </div>
  );
}

function LearnMore() {
  return (
    <section className="mt-6">
      <h2 className="text-base font-semibold text-neutral-900">Learn more</h2>

      <div className="mt-3 grid grid-cols-4 gap-3">
        {LEARN_MORE.map(({ id, label, icon: Icon }) => (
          <div key={id} className="flex flex-col items-center gap-2">
            <span className="flex aspect-square w-full items-center justify-center rounded-2xl border border-neutral-200/80 bg-neutral-50">
              <Icon className="h-5 w-5 text-neutral-500" strokeWidth={2} />
            </span>
            <span className="text-xs font-medium text-neutral-700">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function BottomNav() {
  return (
    <nav className="border-t border-neutral-100 bg-white">
      <ul className="flex items-end justify-between px-6 pb-6 pt-3">
        <NavTab icon={Home} label="Home" active />
        <NavTab icon={Activity} label="Activity" />

        <li className="flex flex-1 justify-center">
          <span
            className="-mt-6 flex h-14 w-14 items-center justify-center rounded-full shadow-lg"
            style={{ backgroundColor: ACCENT }}
          >
            <Navigation className="h-6 w-6 text-white" fill="white" strokeWidth={0} />
          </span>
        </li>

        <NavTab icon={MessageCircle} label="Inbox" />
        <NavTab icon={User} label="You" />
      </ul>
    </nav>
  );
}

function NavTab({
  icon: Icon,
  label,
  active = false,
}: {
  icon: LucideIcon;
  label: string;
  active?: boolean;
}) {
  const color = active ? "#111" : "#9CA3AF";
  return (
    <li className="flex flex-1 justify-center">
      <div className="flex flex-col items-center gap-1">
        <Icon className="h-[22px] w-[22px]" strokeWidth={2} style={{ color }} />
        <span className="text-[11px] font-medium" style={{ color }}>
          {label}
        </span>
      </div>
    </li>
  );
}
