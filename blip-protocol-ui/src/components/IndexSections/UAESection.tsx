import { memo } from "react";
import { MapPin } from "lucide-react";
import { CTAButton } from "../Navbar";

/* ============================================
   SECTION 8: DUBAI LAUNCH
   UAE / Dubai pilot — futuristic with real Dubai photo
   ============================================ */

const corridors = [
  {
    from: "🇦🇪",
    fromLabel: "UAE",
    fromCcy: "AED",
    to: "🇮🇳",
    toLabel: "India",
    toCcy: "INR",
    volume: "$4.2B/yr",
  },
  {
    from: "🇦🇪",
    fromLabel: "UAE",
    fromCcy: "USDT",
    to: "🇺🇸",
    toLabel: "USD",
    toCcy: "USD",
    volume: "$6.1B/yr",
  },
  {
    from: "🇦🇪",
    fromLabel: "UAE",
    fromCcy: "AED",
    to: "🇵🇭",
    toLabel: "Philippines",
    toCcy: "PHP",
    volume: "$1.6B/yr",
  },
];

const stats = [
  { value: "30%", label: "UAE crypto adoption" },
  { value: "Live", label: "Dubai beta" },
  { value: "3", label: "Live corridors" },
];

const UAESection = () => {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black/70"
    >
      {/* Dubai photo */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="/Dubai.webp"
          alt="Dubai skyline"
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-24 md:py-40">
        {/* Label */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.15] bg-white/[0.06]">
            <MapPin className="w-3 h-3 text-[#ff6b35]" strokeWidth={1.5} />
            <span className="text-[10px] uppercase tracking-[0.25em] text-white/60 font-semibold">
              Dubai, UAE · First market
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#00e599]" />
          </div>
        </div>

        {/* Heading */}
        <h2
          className="heading-h2 text-white text-center"
          style={{
            marginBottom: 24,
          }}
        >
          Launching in
          <br />
          Dubai.
        </h2>

        <p className="p-large text-white max-w-lg mx-auto text-center mb-14">
          The UAE is the world's fastest-growing crypto hub. Blip's pilot starts
          here — live corridors, merchant onboarding, and on-chain settlement
          from day one.
        </p>

        {/* Stats row */}
        <div className="flex justify-center gap-10 md:gap-20 mb-14">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-2xl md:text-3xl font-bold text-white tracking-tight">
                {stat.value}
              </div>
              <div className="text-[10px] uppercase tracking-[0.15em] text-white/70 font-semibold mt-1 max-w-[90px] mx-auto leading-tight">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Corridor cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-14">
          {corridors.map((corridor) => (
            <div
              key={corridor.toLabel}
              className="relative p-5 rounded-2xl border border-white/[0.1] bg-white/[0.05] overflow-hidden group hover:-translate-y-1 hover:border-[#ff6b35]/30 transition-all duration-200"
            >
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{corridor.from}</span>
                  <div className="flex-1 flex items-center gap-1">
                    <div className="h-px flex-1 bg-white/20" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ff6b35]" />
                    <div className="h-px flex-1 bg-white/20" />
                  </div>
                  <span className="text-xl">{corridor.to}</span>
                </div>

                <div className="text-sm font-semibold text-white mb-1.5">
                  {corridor.fromCcy} → {corridor.toCcy}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-white/70 font-semibold">
                    {corridor.fromLabel} → {corridor.toLabel}
                  </span>
                  <span className="text-xs text-[#00e599] font-mono font-semibold">
                    {corridor.volume}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <CTAButton to="/waitlist" className="h-[52px] px-8">
            Join Dubai Beta
          </CTAButton>

          <CTAButton to="/merchant" variant="secondary" className="h-[52px] px-6">
            Merchant onboarding
          </CTAButton>
        </div>
      </div>
    </section>
  );
};

export default memo(UAESection);
