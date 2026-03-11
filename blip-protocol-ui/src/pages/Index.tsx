import { useEffect, lazy, Suspense } from "react";
import { SEO } from "@/components";
import CinematicHero from "@/components/IndexSections/CinematicHero";
import ProblemSection from "@/components/IndexSections/ProblemSection";
import DarkFintechSection from "@/components/IndexSections/DarkFintechSection";
import ProtocolInterstitial from "@/components/IndexSections/ProtocolInterstitial";

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

      <div className="bg-black text-white relative overflow-x-clip">
        <div className="bg-black text-white relative">
          <div className="overflow-x-clip">
            {/* Grain overlay for premium film texture */}
            <div className="grain-overlay" />

            {/* 1. Hero */}
            <CinematicHero />

            {/* 2. Problem → Why Now */}
            <ProblemSection />

          </div>
        </div>
        {/* Dark Fintech — Trading & Currency Section */}
        <DarkFintechSection />

        {/* 4. The Blip Protocol */}
        <ProtocolInterstitial />

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
