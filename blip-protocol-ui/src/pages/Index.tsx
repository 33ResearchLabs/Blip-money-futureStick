import { useEffect, lazy, Suspense } from "react";
import { SEO } from "@/components";
import LazySection from "@/components/LazySection";

// Only the hero is eagerly loaded (above the fold)
import CinematicHero from "@/components/IndexSections/CinematicHero";

// Below-fold sections are lazy loaded to reduce initial bundle
const ProblemSection = lazy(() => import("@/components/IndexSections/ProblemSection"));
const DarkFintechSection = lazy(() => import("@/components/IndexSections/DarkFintechSection"));
const ProtocolInterstitial = lazy(() => import("@/components/IndexSections/ProtocolInterstitial"));
const ComparisonSection = lazy(() => import("@/components/IndexSections/ComparisonSection"));
const HowItWorksSection = lazy(() => import("@/components/IndexSections/HowItWorksSection"));
const AppShowcaseSection = lazy(() => import("@/components/IndexSections/AppShowcaseSection"));
const FeatureStrip = lazy(() => import("@/components/IndexSections/FeatureStrip"));
const FeatureCinemaSection = lazy(() => import("@/components/IndexSections/FeatureCinemaSection"));
const UseCasesSection = lazy(() => import("@/components/IndexSections/UseCasesSection"));
const RewardsSection = lazy(() => import("@/components/IndexSections/RewardsSection"));
const UAESection = lazy(() => import("@/components/IndexSections/UAESection"));
const TrustSection = lazy(() => import("@/components/IndexSections/TrustSection"));
const CTASection = lazy(() => import("@/components/IndexSections/CTASection"));

/* ============================================
   MAIN INDEX PAGE
   1  Hero
   2  Problem → Why Now
   3  Solution (Blip Protocol diagram)
   4  How It Works (3 screens)
   5  Core Features (strip + escrow)
   6  Instant Bidding
   7  Verified on Blockchain (Blipscan)
   8  Use Cases (users & merchants)
   9  Earn & Incentives
   10 Dubai Launch
   11 Protocol Benefits
   12 Trust / Architecture
   13 Final CTA
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

        {/* 1. Hero — eagerly loaded, above the fold */}
        <CinematicHero />

        {/* 2. Problem → Why Now */}
        <LazySection minHeight="100vh">
          <Suspense fallback={null}>
            <ProblemSection />
          </Suspense>
        </LazySection>

        {/* Dark Fintech — Trading & Currency Section */}
        <LazySection minHeight="100vh">
          <Suspense fallback={null}>
            <DarkFintechSection />
          </Suspense>
        </LazySection>

        {/* 4. The Blip Protocol */}
        <LazySection minHeight="80vh">
          <Suspense fallback={null}>
            <ProtocolInterstitial />
          </Suspense>
        </LazySection>

        {/* 5. Why Blip — competitive comparison */}
        <LazySection minHeight="80vh">
          <Suspense fallback={null}>
            <ComparisonSection />
          </Suspense>
        </LazySection>

        {/* How It Works — isolated (no overflow-x-hidden parent) */}
        <LazySection minHeight="100vh">
          <Suspense fallback={null}>
            <HowItWorksSection />
          </Suspense>
        </LazySection>

        {/* App Showcase — Apple bento grid with device mockups */}
        <LazySection minHeight="100vh">
          <Suspense fallback={null}>
            <AppShowcaseSection />
          </Suspense>
        </LazySection>

        <div className="overflow-x-clip">
          {/* 6. Core Features */}
          <LazySection minHeight="20vh">
            <Suspense fallback={null}>
              <FeatureStrip />
            </Suspense>
          </LazySection>

          {/* 6-7-8. Locked & Secured · Instant Bidding · Verified — cinematic scroll */}
          <LazySection minHeight="300vh">
            <Suspense fallback={null}>
              <FeatureCinemaSection />
            </Suspense>
          </LazySection>

          {/* 8. Use Cases */}
          <LazySection minHeight="80vh">
            <Suspense fallback={null}>
              <UseCasesSection />
            </Suspense>
          </LazySection>

          {/* 9. Earn & Incentives */}
          <LazySection minHeight="60vh">
            <Suspense fallback={null}>
              <RewardsSection />
            </Suspense>
          </LazySection>

          {/* 10. Dubai Launch */}
          <LazySection minHeight="60vh">
            <Suspense fallback={null}>
              <UAESection />
            </Suspense>
          </LazySection>

          {/* 12. Trust / Architecture */}
          <LazySection minHeight="60vh">
            <Suspense fallback={null}>
              <TrustSection />
            </Suspense>
          </LazySection>

          {/* 13. Final CTA */}
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
