import { memo, useRef, useEffect, useState } from "react";
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
    to: "💵",
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
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black/70"
    >
      {/* Dubai photo — only rendered when section is near viewport */}
      {isVisible && (
        <div className="absolute inset-0 w-full h-full">
          <img
            src="/Dubai.webp"
            alt="Dubai skyline"
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            className="w-full h-full object-cover object-center"
          />
        </div>
      )}

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
          <span className="text-white/80">Dubai.</span>
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

        {/* Corridor cards — GPU-accelerated hover (translate3d instead of translate-y) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-14">
          {corridors.map((corridor) => (
            <div
              key={corridor.toLabel}
              className="relative p-5 rounded-2xl bg-gradient-to-br from-white/90 via-white/70 to-white/50 backdrop-blur-md border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] overflow-hidden group hover:border-[#ff6b35]/40 hover:shadow-[0_8px_32px_rgba(255,107,53,0.12),inset_0_1px_0_rgba(255,255,255,0.9)] transition-all duration-300"
            >
              {/* Glossy shine overlay */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/40 via-transparent to-transparent pointer-events-none" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{corridor.from}</span>
                  <div className="flex-1 flex items-center gap-1">
                    <div className="h-px flex-1 bg-neutral-400" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ff6b35]" />
                    <div className="h-px flex-1 bg-neutral-400" />
                  </div>
                  <span className="text-xl">{corridor.to}</span>
                </div>

                <div className="text-sm font-bold text-neutral-900 mb-1.5">
                  {corridor.fromCcy} → {corridor.toCcy}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-600 font-semibold">
                    {corridor.fromLabel} → {corridor.toLabel}
                  </span>
                  <span className="text-xs text-[#ff6b35] font-mono font-bold">
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

          <CTAButton
            to="/merchant"
            variant="secondary"
            className="h-[52px] px-6"
          >
            Merchant onboarding
          </CTAButton>
        </div>
      </div>
    </section>
  );
};

export default memo(UAESection);
