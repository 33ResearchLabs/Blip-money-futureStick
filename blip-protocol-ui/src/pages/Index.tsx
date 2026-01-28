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
  PeopleBankSection,
  CTASection,
} from "@/components/IndexSections";

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

      <div className="bg-transparent text-white relative overflow-x-hidden">
        {/* Grain overlay for premium film texture */}
        <div className="grain-overlay" />

        <CinematicHero />
        <BlipscanExplorerSection />
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
        <PeopleBankSection />
        <CTASection />
      </div>
    </>
  );
};

export default Index;
