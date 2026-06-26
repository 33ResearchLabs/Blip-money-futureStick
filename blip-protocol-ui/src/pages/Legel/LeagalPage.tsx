import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

type TabId = keyof typeof tabComponents;

export default function LegalPage() {
  const [activeTab, setActiveTab] = useState<TabId>("privacy");
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const ActiveComponent = tabComponents[activeTab];
  const activeIndex = tabs.findIndex((t) => t.id === activeTab);

  // Track whether the strip can scroll further in each direction.
  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, []);

  // Keep the active tab centered within the horizontal scroller.
  useEffect(() => {
    const container = scrollRef.current;
    const btn = tabRefs.current[activeIndex];
    if (!container || !btn) return;

    const cRect = container.getBoundingClientRect();
    const bRect = btn.getBoundingClientRect();
    const delta =
      bRect.left + bRect.width / 2 - (cRect.left + cRect.width / 2);

    container.scrollBy({ left: delta, behavior: "smooth" });
    updateScrollState();
  }, [activeIndex]);

  const scrollByDirection = (direction: 1 | -1) => {
    scrollRef.current?.scrollBy({ left: direction * 260, behavior: "smooth" });
  };

  const selectTab = (index: number) => {
    setActiveTab(tabs[index].id as TabId);
  };

  // Roving tabindex keyboard navigation (WAI-ARIA tabs pattern).
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    let next = activeIndex;
    switch (e.key) {
      case "ArrowRight":
        next = (activeIndex + 1) % tabs.length;
        break;
      case "ArrowLeft":
        next = (activeIndex - 1 + tabs.length) % tabs.length;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = tabs.length - 1;
        break;
      default:
        return;
    }
    e.preventDefault();
    selectTab(next);
    tabRefs.current[next]?.focus();
  };

  const arrowClasses =
    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-gray-500 transition-all duration-200 hover:text-black hover:bg-black/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 disabled:opacity-25 disabled:pointer-events-none";

  return (
    <div className="bg-white text-black min-h-screen">
      <div className="max-w-screen-2xl mx-auto px-6 py-16">
      {/* Hide the horizontal scrollbar on the tab strip */}
      <style>{`.legal-tab-scroll::-webkit-scrollbar{display:none}`}</style>

      {/* Content */}
      <div
        id="legal-panel"
        role="tabpanel"
        aria-labelledby={`legal-tab-${activeTab}`}
        tabIndex={0}
        className="focus:outline-none"
      >
        <ActiveComponent />
      </div>

      {/* Tabs */}
      <div className="mt-16 border-t border-black/10 pt-10">
        <div className="mx-auto flex w-full max-w-4xl items-center gap-1 rounded-2xl border border-black/[0.08] bg-black/[0.02] p-1.5 shadow-sm backdrop-blur-sm">
          <button
            type="button"
            aria-label="Scroll tabs left"
            onClick={() => scrollByDirection(-1)}
            disabled={!canScrollLeft}
            className={arrowClasses}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div
            ref={scrollRef}
            onScroll={updateScrollState}
            className="legal-tab-scroll min-w-0 flex-1 overflow-x-auto"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
          >
            <div
              role="tablist"
              aria-label="Legal documents"
              aria-orientation="horizontal"
              onKeyDown={onKeyDown}
              className="mx-auto flex w-max items-center gap-1"
            >
              {tabs.map((t, i) => {
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    id={`legal-tab-${t.id}`}
                    role="tab"
                    type="button"
                    aria-selected={isActive}
                    aria-controls="legal-panel"
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => selectTab(i)}
                    className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-[13px] font-medium tracking-tight transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:ring-black/30 ${
                      isActive
                        ? "bg-black text-white font-semibold shadow-[0_1px_4px_rgba(0,0,0,0.18)]"
                        : "text-gray-600 hover:text-black hover:bg-black/[0.05]"
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            aria-label="Scroll tabs right"
            onClick={() => scrollByDirection(1)}
            disabled={!canScrollRight}
            className={arrowClasses}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>



      </div>
    </div>
  );
}
