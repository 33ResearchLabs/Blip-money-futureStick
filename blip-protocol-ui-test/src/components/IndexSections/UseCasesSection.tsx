import React, { memo } from "react";
import {
  Globe,
  Smartphone,
  Gift,
  ShieldCheck,
  Zap,
  Banknote,
  Lock,
  TrendingDown,
  Plane,
  ShoppingBag,
  Coffee,
  ArrowUpRight,
} from "lucide-react";

const Card = ({
  category,
  title,
  description,
  children,
  bgImage,
  imagePosition = "center",
}) => (
  <div className="relative group overflow-hidden rounded-3xl bg-white h-[90%] flex flex-col transition-all duration-700 ease-out hover:scale-[1.03] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] shadow-[0_8px_30px_-10px_rgba(0,0,0,0.08)] will-change-transform">
    {/* Background Image */}
    <div
      className="absolute z-0 transition-all duration-[1200ms] ease-out group-hover:scale-110 group-hover:brightness-105"
      style={{
        inset: "-15%",
        backgroundImage: `url('${bgImage}')`,
        backgroundSize: "cover",
        backgroundPosition: imagePosition,
      }}
    />

    {/* Overlay gradient for text readability */}
    <div className="absolute inset-0 z-10 bg-gradient-to-b from-white/60 via-white/20 to-white/40 transition-opacity duration-700 group-hover:opacity-80" />

    {/* Content */}
    <div className="relative z-20 p-8 md:p-10 flex flex-col h-full">
      <span className="text-[11px] font-semibold tracking-[0.25em] text-blue-600/90 uppercase mb-5">
        {category}
      </span>
      <h3 className="text-3xl md:text-4xl font-black text-neutral-900 mb-2 leading-[1.1] tracking-tight">
        {title}
      </h3>
      {description && (
        <p className="text-neutral-700 text-sm mb-8 leading-relaxed font-medium">
          {description}
        </p>
      )}

      <div className="flex-grow">{children}</div>
    </div>
  </div>
);

const FeatureItem = ({ icon: Icon, title, desc }) => (
  <div className="flex items-start gap-3.5 mb-5 group/item cursor-pointer transition-transform duration-300 hover:translate-x-1">
    {/* Icon */}
    <div className="mt-0.5 p-2.5 rounded-xl bg-white/90 backdrop-blur-sm border border-white/60 shadow-sm transition-all duration-300 group-hover/item:bg-neutral-900 group-hover/item:shadow-md">
      <Icon
        size={16}
        strokeWidth={2}
        className="text-neutral-700 transition-colors duration-300 group-hover/item:text-white"
      />
    </div>

    {/* Content */}
    <div className="flex-1 min-w-0 bg-white/80 backdrop-blur-sm p-2.5 rounded-xl border border-white/50 shadow-sm">
      <h4 className="text-neutral-900 font-bold text-sm mb-0.5 truncate">
        {title}
      </h4>
      <p className="text-neutral-600 text-xs leading-relaxed font-medium line-clamp-2">
        {desc}
      </p>
    </div>
  </div>
);

const TransactionRow = ({ icon: Icon, name, amount, rebate }) => (
  <div className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0 transition-colors duration-200 hover:bg-neutral-50/50 -mx-2 px-2 rounded-lg">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-neutral-50 border border-neutral-100">
        <Icon size={14} className="text-neutral-600" />
      </div>
      <span className="text-sm text-neutral-900 font-semibold">{name}</span>
    </div>
    <div className="text-right">
      <div className="text-sm font-bold text-emerald-600">+{amount}</div>
      <div className="text-[10px] text-neutral-400 font-medium">
        {rebate}% back
      </div>
    </div>
  </div>
);

const UseCasesSection = () => {
  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-blue-100">
      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-black/[0.08] bg-white/60 mb-6">
            <span className="text-[10px] uppercase tracking-[0.25em] text-black/50 font-semibold">
              Use Cases
            </span>
          </div>
          <h2 className="heading-h2 text-neutral-900 mb-6">
            Built for everyone.
          </h2>
          <p className="p-large text-neutral-500 max-w-lg mx-auto">
            Whether you're sending value globally or running a merchant
            business, Blip is the network that makes it possible.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* For Users - Updated with image matching image_4a9a0d.png */}
          <Card
            category="For Users"
            title={
              <>
                Pay freely.
                <br />
                Globally.
              </>
            }
            bgImage="https://images.unsplash.com/photo-1662695088711-acfdfda51c01?w=800&auto=format&q=80&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTYzfHxnaXJsJTIwcGhvbmUlMjB1c2luZyUyMGZvciUyMHBheW1lbnR8ZW58MHx8MHx8fDA%3D&crop=entropy&gravity=south"
            imagePosition="center 80%"
          >
            <div className="mt-6">
              <FeatureItem
                icon={Globe}
                title="Pay globally"
                desc="Send to anyone, anywhere — instantly."
              />
              <FeatureItem
                icon={Smartphone}
                title="Pay anywhere"
                desc="Tap to pay at stores and across borders."
              />
              <FeatureItem
                icon={Gift}
                title="Earn rewards"
                desc="Cashback on every transaction."
              />
              <FeatureItem
                icon={ShieldCheck}
                title="Private by default"
                desc="Your keys, your funds, your data."
              />
            </div>
          </Card>

          {/* For Merchants */}
          <Card
            category="For Merchants"
            title={
              <>
                Scale without
                <br />
                limits.
              </>
            }
            bgImage="https://images.unsplash.com/photo-1556742111-a301076d9d18?auto=format&fit=crop&q=80&w=1200"
            imagePosition="center"
          >
            <div className="mt-6">
              <FeatureItem
                icon={Banknote}
                title="Global payments"
                desc="Receive from any corridor without banks."
              />
              <FeatureItem
                icon={Zap}
                title="Instant liquidity"
                desc="On-demand liquidity for every trade."
              />
              <FeatureItem
                icon={Lock}
                title="No chargebacks"
                desc="Escrow-settled trades are final."
              />
              <FeatureItem
                icon={TrendingDown}
                title="Lower fees"
                desc="0.1% vs 3-7% on traditional rails."
              />
            </div>
          </Card>

          {/* Rewards Dashboard */}
          <Card
            category="Rewards"
            title={<>Earn while you spend.</>}
            description="Every payment earns BLIP rewards automatically."
            bgImage="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200"
          >
            <div className="mt-2 p-6 rounded-2xl bg-white/95 backdrop-blur-md border border-white/60 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">
                    My Rewards
                  </span>
                </div>
                <div className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-black border border-emerald-200">
                  2% BACK
                </div>
              </div>

              <div className="mb-8">
                <div className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1 font-bold">
                  Total Earned
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-neutral-900">
                    $1,357.90
                  </span>
                  <span className="text-xs font-bold text-neutral-400 uppercase">
                    BLIP
                  </span>
                </div>
                <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full bg-neutral-100 text-[10px] text-neutral-600 font-bold border border-neutral-200">
                  <Zap
                    size={10}
                    className="mr-1 text-yellow-500 fill-yellow-500"
                  />{" "}
                  ×5 STREAK
                </div>
              </div>

              <div className="space-y-1">
                <TransactionRow
                  icon={Plane}
                  name="Emirates Air"
                  amount="12.80"
                  rebate="2"
                />
                <TransactionRow
                  icon={ShoppingBag}
                  name="Dubai Mall"
                  amount="2.40"
                  rebate="2"
                />
                <TransactionRow
                  icon={Coffee}
                  name="The Coffee Co."
                  amount="0.50"
                  rebate="2"
                />
              </div>
            </div>

            <button className="w-full mt-6 py-3 flex items-center justify-center gap-2 text-sm font-semibold text-neutral-700 hover:text-neutral-900 transition-all duration-300 group/btn">
              Learn about Blip Rewards
              <ArrowUpRight
                size={14}
                className="transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
              />
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default memo(UseCasesSection);
