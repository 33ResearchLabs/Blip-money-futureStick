import { useEffect, lazy, Suspense } from "react";
import { SEO } from "@/components";
import LazySection from "@/components/LazySection";

import CinematicHero from "@/components/IndexSections/CinematicHero";

// Premium redesign (2026-05) — Uber-style alternating two-column sections.
const SendGloballySection = lazy(() => import("@/components/IndexSections/SendGloballySection"));
const BestRatesSection = lazy(() => import("@/components/IndexSections/BestRatesSection"));
const EarnOnTradesSection = lazy(() => import("@/components/IndexSections/EarnOnTradesSection"));
const BlipMarketsSection = lazy(() => import("@/components/IndexSections/BlipMarketsSection"));
const ProtocolInterstitial = lazy(() => import("@/components/IndexSections/ProtocolInterstitial"));
const BecomeMerchantSection = lazy(() => import("@/components/IndexSections/BecomeMerchantSection"));
const CTASection = lazy(() => import("@/components/IndexSections/CTASection"));

/* ============================================
   MAIN INDEX PAGE — Premium Redesign 2026-05
   1  Cinematic Hero
   2  Pay Anyone, Anywhere, Instantly
   3  Best Market Rates (Blip Market)
   4  Earn Up to 10% on Every Trade
   5  Blip Markets — Live Dashboard (keynote)
   6  The Blip Protocol (whitepaper / docs)
   7  Become a Merchant in 5 Minutes
   8  Final CTA
   ============================================ */

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO
        title="Blip Money - Instant Merchant-to-Merchant Crypto Settlement"
        description="No banks. No delays. Global liquidity. Blip is the non-custodial settlement protocol for instant crypto-to-cash transfers, secured by escrow and reputation."
        canonical="https://www.blip.money/"
      />

      <div className="bg-[#FAF8F5] dark:bg-black text-black dark:text-white relative overflow-x-clip">
        <div className="grain-overlay" />

        {/* 1. Cinematic Hero */}
        <CinematicHero />

        {/* 2. Pay anyone, anywhere, instantly */}
        <LazySection minHeight="80vh">
          <Suspense fallback={null}>
            <SendGloballySection />
          </Suspense>
        </LazySection>

        {/* 3. Best market rates */}
        <LazySection minHeight="80vh">
          <Suspense fallback={null}>
            <BestRatesSection />
          </Suspense>
        </LazySection>

        {/* 4. Earn up to 10% on every trade */}
        <LazySection minHeight="80vh">
          <Suspense fallback={null}>
            <EarnOnTradesSection />
          </Suspense>
        </LazySection>

        {/* 5. Blip Markets — live dashboard keynote */}
        <LazySection minHeight="100vh">
          <Suspense fallback={null}>
            <BlipMarketsSection />
          </Suspense>
        </LazySection>

        {/* 6. Blip Protocol (whitepaper / github / docs) */}
        <LazySection minHeight="80vh">
          <Suspense fallback={null}>
            <ProtocolInterstitial />
          </Suspense>
        </LazySection>

        {/* 7. Become a merchant in 5 minutes */}
        <LazySection minHeight="80vh">
          <Suspense fallback={null}>
            <BecomeMerchantSection />
          </Suspense>
        </LazySection>

        {/* 8. Final CTA */}
        <LazySection minHeight="40vh">
          <Suspense fallback={null}>
            <CTASection />
          </Suspense>
        </LazySection>
      </div>
    </>
  );
};

export default Index;
