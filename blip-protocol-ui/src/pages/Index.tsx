import { useEffect, lazy, Suspense } from "react";
import { SEO } from "@/components";
import LazySection from "@/components/LazySection";

import CinematicHero from "@/components/IndexSections/CinematicHero";

// Pulled in from the latest main branch (Blip-web-latest)
const BanklessSection = lazy(() => import("@/components/IndexSections/BanklessSection"));
const DarkFintechSection = lazy(() => import("@/components/IndexSections/DarkFintechSection"));
const ProtocolInterstitial = lazy(() => import("@/components/IndexSections/ProtocolInterstitial"));
const UseCasesSection = lazy(() => import("@/components/IndexSections/UseCasesSection"));
const LiquidityLayer = lazy(() => import("@/components/IndexSections/LiquidityLayer"));
const LiveNetworkFeed = lazy(() => import("@/components/IndexSections/LiveNetworkFeed"));
const AppShowcaseSection = lazy(() => import("@/components/IndexSections/AppShowcaseSection"));
const TrustSection = lazy(() => import("@/components/IndexSections/TrustSection"));

// Kept from the redesign: live marketplace keynote — replaces "This is Blip" slot
const BlipMarketsSection = lazy(() => import("@/components/IndexSections/BlipMarketsSection"));

const CTASection = lazy(() => import("@/components/IndexSections/CTASection"));

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO
        canonical="https://www.blip.money/"
      />

      <div className="bg-[#FAF8F5] dark:bg-black text-black dark:text-white relative overflow-x-clip">
        <div className="grain-overlay" />

        {/* 1. Cinematic Hero */}
        <CinematicHero />

        {/* 2. Bankless / Global — P2P is the future of payments */}
        <LazySection minHeight="80vh">
          <Suspense fallback={null}>
            <BanklessSection />
          </Suspense>
        </LazySection>

        {/* 3. How It Works — Animated Flow */}
        <LazySection minHeight="100vh">
          <Suspense fallback={null}>
            <DarkFintechSection />
          </Suspense>
        </LazySection>

        {/* 4. The Blip Protocol — Proof Layer */}
        <LazySection minHeight="80vh">
          <Suspense fallback={null}>
            <ProtocolInterstitial />
          </Suspense>
        </LazySection>

        {/* 5. A live marketplace for global settlement (replaces "This is Blip") */}
        <LazySection minHeight="100vh">
          <Suspense fallback={null}>
            <BlipMarketsSection />
          </Suspense>
        </LazySection>

        <div className="overflow-x-clip">
          {/* 6. Use Cases — Tabbed (Users / Merchants / LPs) */}
          <LazySection minHeight="80vh">
            <Suspense fallback={null}>
              <UseCasesSection />
            </Suspense>
          </LazySection>

          {/* 7. Liquidity Layer */}
          <LazySection minHeight="60vh">
            <Suspense fallback={null}>
              <LiquidityLayer />
            </Suspense>
          </LazySection>

          {/* 8. Live Network / Airdrop Feed */}
          <LazySection minHeight="60vh">
            <Suspense fallback={null}>
              <LiveNetworkFeed />
            </Suspense>
          </LazySection>

          {/* 9. Product Experience */}
          <LazySection minHeight="100vh">
            <Suspense fallback={null}>
              <AppShowcaseSection  />
            </Suspense>
          </LazySection>

          {/* 10. Trust & Architecture */}
          <LazySection minHeight="60vh">
            <Suspense fallback={null}>
              <TrustSection />
            </Suspense>
          </LazySection>

          {/* 11. Final CTA */}
          <LazySection minHeight="40vh">
            <Suspense fallback={null}>
              <CTASection />
            </Suspense>
          </LazySection>
        </div>
      </div>
    </>
  );
};

export default Index;
