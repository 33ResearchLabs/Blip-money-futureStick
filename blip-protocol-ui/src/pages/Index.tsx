import { useEffect } from "react";
import { SEO } from "@/components";
import CinematicHero from "@/components/CinematicHero";
import {
  BlipscanExplorerSection,
  UAESection,
  CashbackBanner,
  ProblemSection,
  ProtocolSection,
  FeatureStrip,
  MerchantDashboardSection,
  HowItWorksSection,
  PrivacySection,
  EarlyAdopterBanner,
  RewardsSection,
  CTASection,
  LockedAndSecuredSection,
  InstantBiddingSection,
  DashboardShowcaseSection,
} from "@/components/IndexSections";
import AbstractVisual from "@/components/IndexSections/AbstractVisual";
import { InteractiveBackground } from "@/components/InteractiveBackground";

/* ============================================
   MAIN INDEX PAGE
   ============================================ */

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO
        title="Blip Money - Fast, Secure, and Simple Payment Solutions"
        description="Pay with Crypto — Anyone, Anywhere. Blip money is the non-custodial settlement protocol for cash, wire, and crypto transfers without KYC, secured by DAO escrow."
        canonical="https://blip.money/"
      />

      <div className="bg-white dark:bg-transparent text-black dark:text-white relative overflow-x-hidden">
        {/* Interactive merchant dashboard background */}
        <InteractiveBackground />

        {/* Grain overlay for premium film texture */}
        <div className="grain-overlay" />

        <CinematicHero />
        <DashboardShowcaseSection />
        <LockedAndSecuredSection />
        <InstantBiddingSection />
        <BlipscanExplorerSection />
        <AbstractVisual />
        <UAESection />
        <CashbackBanner />
        <ProblemSection />
        <ProtocolSection />
        <FeatureStrip />
        <MerchantDashboardSection />
        <HowItWorksSection />
        <PrivacySection />
        <EarlyAdopterBanner />
        <RewardsSection />
        <CTASection />
      </div>
    </>
  );
};

export default Index;
