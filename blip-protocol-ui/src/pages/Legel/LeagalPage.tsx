import { useEffect, useRef, useState, type ComponentType } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  FileText,
  Cookie,
  Lock,
  AlertTriangle,
  Store,
  Ban,
  Users,
  Scale,
} from "lucide-react";
import Cookies from "@/components/Cookies";
import Gdpr from "@/pages/Legel/Gdpr";
import Privacy from "@/pages/Legel/Privecy";
import TermsService from "@/components/TermsService";
import RiskDisclosure from "@/pages/Legel/RiskDisclosure";
import MerchantLiquidityTerms from "@/pages/Legel/MerchantLiquidityTerms";
import ProhibitedUse from "@/pages/Legel/ProhibitedUse";
import CommunityReputation from "@/pages/Legel/CommunityReputation";
import AmlCompliance from "@/pages/Legel/AmlCompliance";

type TabIcon = ComponentType<{ className?: string }>;

const tabs: { id: string; label: string; icon: TabIcon }[] = [
  { id: "privacy", label: "Privacy Policy", icon: ShieldCheck },
  { id: "terms", label: "Terms of Service", icon: FileText },
  { id: "cookies", label: "Cookies Policy", icon: Cookie },
  { id: "gdpr", label: "GDPR", icon: Lock },
  { id: "risk", label: "Risk Disclosure Statement", icon: AlertTriangle },
  { id: "merchant", label: "Merchant & Liquidity Provider Terms", icon: Store },
  { id: "prohibited", label: "Prohibited Use Policy", icon: Ban },
  { id: "community", label: "Community & Reputation Policy", icon: Users },
  { id: "aml", label: "AML & Compliance Statement", icon: Scale },
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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  // The tab strip is injected into the active page (tabSlot), so it fully
  // remounts on every tab change. Remember its horizontal scroll position on
  // LegalPage (which does NOT remount) so the fresh strip can be restored
  // synchronously instead of flashing back to the start and sliding.
  const savedScrollLeft = useRef(0);
  // While the strip auto-centers a tab, the tabs slide under a stationary
  // cursor and fire spurious mouseenter events. Ignore hover during that window
  // so dividers don't flicker on/off as tabs pass beneath the pointer.
  const autoScrolling = useRef(false);
  const autoScrollTimer = useRef<ReturnType<typeof setTimeout>>();

  const beginAutoScroll = () => {
    autoScrolling.current = true;
    setHoveredIndex(null);
    clearTimeout(autoScrollTimer.current);
    autoScrollTimer.current = setTimeout(() => {
      autoScrolling.current = false;
    }, 450);
  };

  const ActiveComponent = tabComponents[activeTab];
  const activeIndex = tabs.findIndex((t) => t.id === activeTab);

  // Track whether the strip can scroll further in each direction.
  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    savedScrollLeft.current = el.scrollLeft;
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, []);

  // Reserve the window scrollbar gutter while the Legal page is mounted. Docs
  // differ in length, so without this the vertical scrollbar can toggle
  // between tabs, shifting all content horizontally (a visible jump). Scoped
  // to this page and reverted on unmount so the rest of the app is unaffected.
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.style.scrollbarGutter;
    root.style.scrollbarGutter = "stable";
    return () => {
      root.style.scrollbarGutter = prev;
    };
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

    if (Math.abs(delta) > 1) {
      beginAutoScroll();
      container.scrollBy({ left: delta, behavior: "smooth" });
    }
    updateScrollState();
  }, [activeIndex]);

  const scrollByDirection = (direction: 1 | -1) => {
    beginAutoScroll();
    scrollRef.current?.scrollBy({ left: direction * 260, behavior: "smooth" });
  };

  useEffect(() => () => clearTimeout(autoScrollTimer.current), []);

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

  // Circular, bordered scroll controls — matched to the reference design.
  const arrowClasses =
    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/[0.08] bg-white text-gray-500 shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-all duration-200 hover:text-black hover:border-black/15 hover:shadow-[0_2px_6px_rgba(0,0,0,0.08)] focus:outline-none focus-visible:ring-2 focus-visible:ring-black/25 disabled:opacity-30 disabled:pointer-events-none disabled:shadow-none";

  // The tab strip is injected into the active page so it can sit directly
  // below that page's heading (the heading lives inside each page component).
  const tabStrip = (
    <div className="px-5 sm:px-6 mb-12">
      <div className="max-w-6xl mx-auto">
        <div className="mx-auto flex w-full max-w-4xl items-center gap-1.5 sm:gap-2 rounded-[20px] border border-black/[0.08] bg-white/70 p-1.5 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.18),0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur-md">
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
            ref={(el) => {
              scrollRef.current = el;
              // Runs during commit (before paint): restore the pre-switch
              // scroll offset onto the freshly mounted strip so it doesn't
              // jump to the start. The activeIndex effect then makes a small,
              // intentional smooth adjustment to re-center the new tab.
              if (el) el.scrollLeft = savedScrollLeft.current;
            }}
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
                const Icon = t.icon;
                // Show a divider before every tab except the first, and hide it
                // whenever it would touch the filled active pill or a hovered
                // tab on either side (so neither reads as a boxed-in tab).
                const touchesActiveOrHover = (idx: number) =>
                  activeTab === tabs[idx].id || hoveredIndex === idx;
                const showDivider =
                  i > 0 && !touchesActiveOrHover(i) && !touchesActiveOrHover(i - 1);
                return (
                  <div key={t.id} className="flex items-center">
                    {i > 0 && (
                      <span
                        aria-hidden
                        className={`h-5 w-px shrink-0 transition-opacity duration-200 ${
                          showDivider ? "bg-black/[0.12]" : "bg-transparent"
                        }`}
                      />
                    )}
                    <button
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
                      onMouseEnter={() => {
                        if (!autoScrolling.current) setHoveredIndex(i);
                      }}
                      onMouseLeave={() =>
                        setHoveredIndex((prev) => (prev === i ? null : prev))
                      }
                      className={`group flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2.5 sm:px-4 text-[13px] font-medium tracking-tight transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:ring-black/30 ${
                        i > 0 ? "ml-1" : ""
                      } ${
                        isActive
                          ? "bg-black text-white font-semibold shadow-[0_1px_4px_rgba(0,0,0,0.18)]"
                          : "text-gray-600 hover:text-black hover:bg-black/[0.05]"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-colors duration-200 ${
                          isActive
                            ? "text-white"
                            : "text-gray-400 group-hover:text-black"
                        }`}
                      />
                      {t.label}
                    </button>
                  </div>
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
  );

  return (
    <div className="bg-white text-black min-h-screen">
      {/* Hide the horizontal scrollbar on the tab strip */}
      <style>{`.legal-tab-scroll::-webkit-scrollbar{display:none}`}</style>

      <div
        id="legal-panel"
        role="tabpanel"
        aria-labelledby={`legal-tab-${activeTab}`}
        tabIndex={0}
        className="focus:outline-none"
      >
        <ActiveComponent tabSlot={tabStrip} />
      </div>
    </div>
  );
}
