import { useEffect, lazy, Suspense } from "react";
import { SEO } from "@/components";

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
        <div className="bg-[#FAF8F5] dark:bg-black text-black dark:text-white relative">
          <div className="overflow-x-clip">
            {/* Grain overlay for premium film texture */}
            <div className="grain-overlay" />

            {/* 1. Hero */}
            <CinematicHero />

            {/* 2. Problem → Why Now */}
            <Suspense fallback={null}>
              <ProblemSection />
            </Suspense>

          </div>
        </div>
        {/* Dark Fintech — Trading & Currency Section */}
        <Suspense fallback={null}>
          <DarkFintechSection />
        </Suspense>

        {/* 4. The Blip Protocol */}
        <Suspense fallback={null}>
          <ProtocolInterstitial />
        </Suspense>

        <Suspense fallback={null}>
          {/* 5. Why Blip — competitive comparison */}
          <ComparisonSection />

          {/* How It Works — isolated (no overflow-x-hidden parent) */}
          <HowItWorksSection />

          {/* App Showcase — Apple bento grid with device mockups */}
          <AppShowcaseSection />

          <div className="overflow-x-clip">
            {/* 6. Core Features */}
            <FeatureStrip />

            {/* 6-7-8. Locked & Secured · Instant Bidding · Verified — cinematic scroll */}
            <FeatureCinemaSection />

            {/* 8. Use Cases */}
            <UseCasesSection />

            {/* 9. Earn & Incentives */}
            <RewardsSection />
            {/* 10. Dubai Launch */}
            <UAESection />

            {/* 12. Trust / Architecture */}
            <TrustSection />

            {/* 13. Final CTA */}
            <CTASection />
          </div>
        </Suspense>
      </div>
    </>
  );
};

export default Index;
