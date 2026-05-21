import { lazy, Suspense } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./i18n";

// Lazy load non-critical components that don't affect initial render
const GoogleAnalytics = lazy(() => import("@/components/GoogleAnalytics"));
const StructuredData = lazy(() => import("@/components/StructuredData"));

import MainLayout from "./Layout/RootLayout";
import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "./components/ui/toaster";

// ── External-redirect component ───────────────────────────────────────
// The waitlist now lives at app.blip.money. Any visit to the legacy
// `/waitlist` or `/merchant-waitlist` URL on this marketing site is
// bounced to the new external URL via window.location.replace so the
// SPA history doesn't keep the dead path around.
const ExternalRedirect = ({ to }: { to: string }) => {
  if (typeof window !== "undefined") {
    window.location.replace(to);
  }
  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
      <p className="text-sm text-black/60 dark:text-white/60">
        Redirecting to {to}…
      </p>
    </div>
  );
};

const CryptoToUae = lazy(() => import("./pages/Markets/CryptoToUae"));
const LegalPage = lazy(() => import("./pages/Legel/LeagalPage"));

// Lazy load page components
const Index = lazy(() => import("./pages/Index"));
const UAELandingPage = lazy(() => import("./pages/Unused/uae"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ComingSoon = lazy(() => import("./components/ComingSoon"));
const HowItWorksPage = lazy(() =>
  import("./pages/Protocol/HowItWorks").then((module) => ({
    default: module.HowItWorksPage,
  })),
);
const ContactUs = lazy(() => import("./pages/Company/ContactUs"));
const Privacy = lazy(() => import("./pages/Legel/Privecy"));
const TermsService = lazy(() => import("./components/TermsService"));
const Cookies = lazy(() => import("./components/Cookies"));
const Gdpr = lazy(() => import("./pages/Legel/Gdpr"));
const Whitepaper = lazy(() => import("./pages/Protocol/Whitepaper"));
const Merchant = lazy(() => import("./pages/UseCases/Merchant"));
const User = lazy(() => import("./pages/User"));
const Blog = lazy(() => import("./pages/Resources/Blog"));
const BlogArticle = lazy(() => import("./pages/Resources/BlogArticle"));
const Research = lazy(() => import("./pages/Resources/Research"));
const ResearchArticle = lazy(() => import("./pages/Resources/ResearchArticle"));

// SEO & Content Pages
const FAQ = lazy(() => import("./pages/Resources/FAQ"));
const Glossary = lazy(() => import("./pages/Resources/Glossary"));
const Changelog = lazy(() => import("./pages/Protocol/Changelog"));
const UseCases = lazy(() => import("./pages/UseCases/UseCases"));
const UseCaseDetail = lazy(() => import("./pages/UseCases/UseCaseDetail"));
const Compare = lazy(() => import("./pages/Resources/Compare"));
const Docs = lazy(() => import("./pages/Unused/Docs"));
const About = lazy(() => import("./pages/Company/About"));
const Press = lazy(() => import("./pages/Company/Press"));
const Community = lazy(() => import("./pages/Company/Community"));

// Markets Pages
const SellUsdtDubai = lazy(() => import("./pages/Markets/SellUsdtDubai"));
const CryptoPaymentsUAE = lazy(
  () => import("./pages/Markets/CryptoPaymentsUAE"),
);
const AcceptCryptoBusiness = lazy(
  () => import("./pages/Markets/AcceptCryptoBusiness"),
);
const CryptoToAed = lazy(() => import("./pages/Markets/CryptoToAed"));
const CryptoRemittanceUae = lazy(
  () => import("./pages/Markets/CryptoRemittanceUae"),
);
const BtcToAed = lazy(() => import("./pages/Markets/BtcToAed"));
const EthToAed = lazy(() => import("./pages/Markets/EthToAed"));
const SolToAed = lazy(() => import("./pages/Markets/SolToAed"));
const CryptoToInr = lazy(() => import("./pages/Markets/CryptoToInr"));
const BtcToInr = lazy(() => import("./pages/Markets/BtcToInr"));
const EthToInr = lazy(() => import("./pages/Markets/EthToInr"));
const SolToInr = lazy(() => import("./pages/Markets/SolToInr"));
const CryptoToBankUae = lazy(() => import("./pages/Markets/CryptoToBankUae"));
const UsdtVsUsdc = lazy(() => import("./pages/Markets/UsdtVsUsdc"));
const CryptoTaxUae = lazy(() => import("./pages/Markets/CryptoTaxUae"));
const CryptoEscrowUae = lazy(() => import("./pages/Markets/CryptoEscrowUae"));
const CryptoSalaryUae = lazy(() => import("./pages/Markets/CryptoSalaryUae"));
const BuyUsdtDubai = lazy(() => import("./pages/Markets/BuyUsdtDubai"));
const CryptoOtcDubai = lazy(() => import("./pages/Markets/CryptoOtcDubai"));
const BestCryptoExchangeUae = lazy(
  () => import("./pages/Markets/BestCryptoExchangeUae"),
);
const BitcoinPriceUae = lazy(() => import("./pages/Markets/BitcoinPriceUae"));
const Bounty = lazy(() => import("./pages/Bounty"));
const RewardPage = lazy(() => import("./pages/RewardPage"));
const Rates = lazy(() => import("./pages/Rates"));
const PseoCorridor = lazy(() => import("./pages/Markets/PseoCorridor"));
import { getAllPseoSlugs } from "./data/pseoCorridors";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 min — avoid refetching on every mount
      refetchOnWindowFocus: false,
    },
  },
});

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-black/20 dark:border-white/20 border-t-black dark:border-t-white rounded-full animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Suspense fallback={null}>
            <GoogleAnalytics />
            <StructuredData type="organization" />
            <StructuredData type="website" />
          </Suspense>
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* PUBLIC ROUTES WITH LAYOUT */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/rates" element={<Rates />} />
                <Route path="/merchant" element={<Merchant />} />
                <Route path="/user" element={<User />} />
                <Route path="/uae" element={<UAELandingPage />} />
                <Route path="/coming-soon" element={<ComingSoon />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/bounty" element={<Bounty />} />
                <Route path="/rewards" element={<RewardPage />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<TermsService />} />
                <Route path="/cookies" element={<Cookies />} />
                <Route path="/gdpr" element={<Gdpr />} />
                <Route path="/legal" element={<LegalPage />} />

                <Route path="/whitepaper" element={<Whitepaper />} />
                <Route path="/cryptoToAed" element={<CryptoToUae />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogArticle />} />
                <Route path="/research" element={<Research />} />
                <Route path="/research/:slug" element={<ResearchArticle />} />

                {/* SEO & Content Pages */}
                <Route path="/faq" element={<FAQ />} />
                <Route path="/glossary" element={<Glossary />} />
                <Route path="/changelog" element={<Changelog />} />
                <Route path="/use-cases" element={<UseCases />} />
                <Route path="/use-cases/:slug" element={<UseCaseDetail />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/compare/:slug" element={<Compare />} />
                <Route path="/docs" element={<Docs />} />
                <Route path="/about" element={<About />} />
                <Route path="/press" element={<Press />} />
                <Route path="/community" element={<Community />} />

                {/* Geo Landing Pages */}
                <Route path="/sell-usdt-dubai" element={<SellUsdtDubai />} />
                <Route path="/crypto-payments-uae" element={<CryptoPaymentsUAE />} />
                <Route path="/accept-crypto-business" element={<AcceptCryptoBusiness />} />
                <Route path="/crypto-to-aed" element={<CryptoToAed />} />
                <Route path="/crypto-remittance-uae" element={<CryptoRemittanceUae />} />

                {/* Per-Coin Converter Pages */}
                <Route path="/btc-to-aed" element={<BtcToAed />} />
                <Route path="/eth-to-aed" element={<EthToAed />} />
                <Route path="/sol-to-aed" element={<SolToAed />} />

                {/* Per-Coin INR Converter Pages */}
                <Route path="/crypto-to-inr" element={<CryptoToInr />} />
                <Route path="/btc-to-inr" element={<BtcToInr />} />
                <Route path="/eth-to-inr" element={<EthToInr />} />
                <Route path="/sol-to-inr" element={<SolToInr />} />

                {/* Keyword Landing Pages */}
                <Route path="/crypto-to-bank-uae" element={<CryptoToBankUae />} />
                <Route path="/usdt-vs-usdc" element={<UsdtVsUsdc />} />
                <Route path="/crypto-tax-uae" element={<CryptoTaxUae />} />
                <Route path="/crypto-escrow-uae" element={<CryptoEscrowUae />} />
                <Route path="/crypto-salary-uae" element={<CryptoSalaryUae />} />
                <Route path="/buy-usdt-dubai" element={<BuyUsdtDubai />} />
                <Route path="/crypto-otc-dubai" element={<CryptoOtcDubai />} />
                <Route path="/best-crypto-exchange-uae" element={<BestCryptoExchangeUae />} />
                <Route path="/bitcoin-price-uae" element={<BitcoinPriceUae />} />

                {/* Programmatic SEO corridor pages */}
                {getAllPseoSlugs().map((slug) => (
                  <Route key={slug} path={`/${slug}`} element={<PseoCorridor />} />
                ))}

                {/* ── Waitlist redirects ── the waitlist app lives at app.blip.money */}
                <Route
                  path="/waitlist"
                  element={<ExternalRedirect to="https://app.blip.money/waitlist/user" />}
                />
                <Route
                  path="/merchant-waitlist"
                  element={<ExternalRedirect to="https://app.blip.money/waitlist/merchant" />}
                />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
