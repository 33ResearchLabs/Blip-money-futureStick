import { useState } from "react";
import Cookies from "@/components/Cookies";
import Gdpr from "@/pages/Legel/Gdpr";
import Privacy from "@/pages/Legel/Privecy";
import TermsService from "@/components/TermsService";
import RiskDisclosure from "@/pages/Legel/RiskDisclosure";
import MerchantLiquidityTerms from "@/pages/Legel/MerchantLiquidityTerms";
import ProhibitedUse from "@/pages/Legel/ProhibitedUse";
import CommunityReputation from "@/pages/Legel/CommunityReputation";
import AmlCompliance from "@/pages/Legel/AmlCompliance";

const tabs = [
  { id: "privacy", label: "Privacy Policy" },
  { id: "terms", label: "Terms of Service" },
  { id: "cookies", label: "Cookies Policy" },
  { id: "gdpr", label: "GDPR" },
  { id: "risk", label: "Risk Disclosure Statement" },
  { id: "merchant", label: "Merchant & Liquidity Provider Terms" },
  { id: "prohibited", label: "Prohibited Use Policy" },
  { id: "community", label: "Community & Reputation Policy" },
  { id: "aml", label: "AML & Compliance Statement" },
];

const tabComponents = {
  privacy: Privacy,
  terms: TermsService,
  cookies: Cookies,
  gdpr: Gdpr,
  risk: RiskDisclosure,
  merchant: MerchantLiquidityTerms,
  prohibited: ProhibitedUse,
  community: CommunityReputation,
  aml: AmlCompliance,
} as const;

export default function LegalPage() {
  const [activeTab, setActiveTab] =
    useState<keyof typeof tabComponents>("privacy");

  const ActiveComponent = tabComponents[activeTab];

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-16">
      {/* Content */}
      <ActiveComponent />

      {/* Tabs */}
      <div className="mt-16 border-t border-black/10 dark:border-white/10 pt-10">
        <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-6">
          Legal
        </p>
        <div className="flex flex-wrap justify-center gap-2.5">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as keyof typeof tabComponents)}
              className={`px-5 py-2.5 rounded-full text-sm border transition-all duration-200 ${
                activeTab === t.id
                  ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white font-semibold shadow-sm"
                  : "bg-transparent text-gray-600 dark:text-gray-300 border-black/15 dark:border-white/15 hover:border-black/40 dark:hover:border-white/40 hover:text-black dark:hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
