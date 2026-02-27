import { useEffect } from "react";
import { SEO } from "@/components";
import CinematicHero from "@/components/IndexSections/CinematicHero";
import {
  ProblemSection,
  SolutionSection,
  FeatureStrip,
  LockedAndSecuredSection,
  InstantBiddingSection,
  BlipscanExplorerSection,
  UseCasesSection,
  RewardsSection,
  CashbackBanner,
  UAESection,
  ProtocolSection,
  TrustSection,
  CTASection,
  HowItWorksSection,
  AppShowcaseSection,
  DarkFintechSection,
  DashboardShowcaseSection,
} from "@/components/IndexSections";

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

      <div className="bg-white dark:bg-transparent text-black dark:text-white relative overflow-x-clip">
        <div className="bg-white dark:bg-transparent text-black dark:text-white relative">
          <div className="overflow-x-clip">
            {/* Grain overlay for premium film texture */}
            <div className="grain-overlay" />

            {/* 1. Hero */}
            <CinematicHero />

            {/* 2. Problem → Why Now */}
            <ProblemSection />

            {/* <DashboardShowcaseSection /> */}

            {/* 3. Solution — Blip Protocol flow diagram */}
            <SolutionSection />
          </div>
        </div>
        {/* Dark Fintech — Trading & Currency Section */}
        <DarkFintechSection />
        {/* 4. How It Works — isolated (no overflow-x-hidden parent) */}
        <HowItWorksSection />

        {/* 5. App Showcase — Apple bento grid with device mockups */}
        <AppShowcaseSection />

        <div className="overflow-x-clip">
          {/* 6. Core Features */}
          <FeatureStrip />

          <LockedAndSecuredSection />

          {/* 6. Instant Bidding */}
          <InstantBiddingSection />

          {/* 7. Verified on Blockchain (Blipscan explorer) */}
          <BlipscanExplorerSection />

          {/* 8. Use Cases */}
          <UseCasesSection />

          {/* 9. Earn & Incentives */}
          <RewardsSection />
          <CashbackBanner />

          {/* 10. Dubai Launch */}
          <UAESection />

          {/* 11. Protocol Benefits */}
          <ProtocolSection />

          {/* 12. Trust / Architecture */}
          <TrustSection />

          {/* 13. Final CTA */}
          <CTASection />
        </div>
      </div>
    </>
  );
};

export default Index;
