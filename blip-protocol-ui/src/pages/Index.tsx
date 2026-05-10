import { useEffect, lazy, Suspense } from "react";
import { SEO } from "@/components";
import LazySection from "@/components/LazySection";

// Hero + the immediately-next section are eagerly loaded — every scroller sees them,
// so deferring ProblemSection just produces a black flash on dark-themed first paint.
import CinematicHero from "@/components/IndexSections/CinematicHero";
import ProblemSection from "@/components/IndexSections/ProblemSection";

// Below-fold sections are lazy loaded
const BanklessSection = lazy(() => import("@/components/IndexSections/BanklessSection"));
const ProductPreview = lazy(() => import("@/components/IndexSections/ProductPreview"));
const DarkFintechSection = lazy(() => import("@/components/IndexSections/DarkFintechSection"));
const ProtocolInterstitial = lazy(() => import("@/components/IndexSections/ProtocolInterstitial"));
const UseCasesSection = lazy(() => import("@/components/IndexSections/UseCasesSection"));
const LiquidityLayer = lazy(() => import("@/components/IndexSections/LiquidityLayer"));
const LiveNetworkFeed = lazy(() => import("@/components/IndexSections/LiveNetworkFeed"));
const AppShowcaseSection = lazy(() => import("@/components/IndexSections/AppShowcaseSection"));
const TrustSection = lazy(() => import("@/components/IndexSections/TrustSection"));
const CTASection = lazy(() => import("@/components/IndexSections/CTASection"));

/* ============================================
   MAIN INDEX PAGE — 10 Section Architecture
   1  Cinematic Hero (Entry Point)
   2  The Break (Problem → Settlement Layer)
   3  How It Works (Animated Flow)
   4  The Blip Protocol (Proof Layer)
   5  Use Cases (Tabbed: Users / Merchants / LPs)
   6  Liquidity Layer (Capital Section)
   7  Live Network / Airdrop Feed
   8  Product Experience (Showcase)
   9  Trust & Architecture
   10 Final CTA
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
        canonical="https://blip.money/"
      />

      <div className="bg-[#FAF8F5] dark:bg-black text-black dark:text-white relative overflow-x-clip">
        {/* Grain overlay for premium film texture */}
        <div className="grain-overlay" />

        {/* 1. Cinematic Hero */}
        <CinematicHero />

        {/* 2. The Break — Problem → Settlement Layer (eager: visible to every scroller) */}
        <ProblemSection />

        {/* 2.5 Bankless / Global — P2P is the future of payments */}
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

        {/* 4.5 Product Reveal — "This is Blip." Keynote moment */}
        <LazySection minHeight="80vh">
          <Suspense fallback={null}>
            <ProductPreview />
          </Suspense>
        </LazySection>

        <div className="overflow-x-clip">
          {/* 5. Use Cases — Tabbed (Users / Merchants / LPs) */}
          <LazySection minHeight="80vh">
            <Suspense fallback={null}>
              <UseCasesSection />
            </Suspense>
          </LazySection>

          {/* 6. Liquidity Layer — Capital Section */}
          <LazySection minHeight="60vh">
            <Suspense fallback={null}>
              <LiquidityLayer />
            </Suspense>
          </LazySection>

          {/* 7. Live Network / Airdrop Feed */}
          <LazySection minHeight="60vh">
            <Suspense fallback={null}>
              <LiveNetworkFeed />
            </Suspense>
          </LazySection>

          {/* 8. Product Experience */}
          <LazySection minHeight="100vh">
            <Suspense fallback={null}>
              <AppShowcaseSection />
            </Suspense>
          </LazySection>

          {/* 9. Trust & Architecture */}
          <LazySection minHeight="60vh">
            <Suspense fallback={null}>
              <TrustSection />
            </Suspense>
          </LazySection>

          {/* 10. Final CTA */}
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
