import { lazy, Suspense } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import GoogleAnalytics from "@/components/GoogleAnalytics";
import StructuredData from "@/components/StructuredData";
import "./i18n";

import MainLayout from "./Layout/RootLayout";
import ScrollToTop from "./components/ScrollToTop";
import { SolanaWalletProvider } from "./providers/SolanaWalletProvider";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Import wallet adapter CSS
import "@solana/wallet-adapter-react-ui/styles.css";
import CryptoToUae from "./pages/CryptoToUae";
import { Toaster } from "./components/ui/toaster";
import LegalPage from "./pages/LeagalPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EmailVerificationPending from "./pages/EmailVerificationPending";

// Lazy load page components
const Index = lazy(() => import("./pages/Index"));
const RewardsLanding = lazy(() => import("./pages/Rewards"));
const UAELandingPage = lazy(() => import("./pages/uae"));
const NotFound = lazy(() => import("./pages/NotFound"));
const BlipTokenomics = lazy(() => import("./pages/BlipTokenomics"));
const ComingSoon = lazy(() => import("./components/ComingSoon"));
const HowItWorksPage = lazy(() =>
  import("./pages/HowItWorks").then((module) => ({
    default: module.HowItWorksPage,
  })),
);
const ContactUs = lazy(() => import("./pages/ContactUs"));
const AirdropLogin = lazy(() => import("./pages/AirdropLogin"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Privacy = lazy(() => import("./components/Privecy"));
const TermsService = lazy(() => import("./components/TermsService"));
const Cookies = lazy(() => import("./components/Cookies"));
const Gdpr = lazy(() => import("./components/Gdpr"));
const TwoFactorAuth = lazy(() => import("./components/TwoFactorAuth"));
const Whitepaper = lazy(() => import("./pages/Whitepaper"));
const Merchant = lazy(() => import("./pages/Merchant"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogArticle = lazy(() => import("./pages/BlogArticle"));
const Research = lazy(() => import("./pages/Research"));
const ResearchArticle = lazy(() => import("./pages/ResearchArticle"));

// SEO & Content Pages
const FAQ = lazy(() => import("./pages/FAQ"));
const Glossary = lazy(() => import("./pages/Glossary"));
const Changelog = lazy(() => import("./pages/Changelog"));
const UseCases = lazy(() => import("./pages/UseCases"));
const UseCaseDetail = lazy(() => import("./pages/UseCaseDetail"));
const Compare = lazy(() => import("./pages/Compare"));
const Docs = lazy(() => import("./pages/Docs"));
const About = lazy(() => import("./pages/About"));
const Press = lazy(() => import("./pages/Press"));
const Community = lazy(() => import("./pages/Community"));

// Geo Landing Pages
const SellUsdtDubai = lazy(() => import("./pages/SellUsdtDubai"));
const CryptoPaymentsUAE = lazy(() => import("./pages/CryptoPaymentsUAE"));
const AcceptCryptoBusiness = lazy(() => import("./pages/AcceptCryptoBusiness"));
const CryptoToAed = lazy(() => import("./pages/CryptoToAed"));
const CryptoRemittanceUae = lazy(() => import("./pages/CryptoRemittanceUae"));

// Per-Coin Converter Pages
const BtcToAed = lazy(() => import("./pages/BtcToAed"));
const EthToAed = lazy(() => import("./pages/EthToAed"));
const SolToAed = lazy(() => import("./pages/SolToAed"));

// Keyword Landing Pages
const CryptoToBankUae = lazy(() => import("./pages/CryptoToBankUae"));
const UsdtVsUsdc = lazy(() => import("./pages/UsdtVsUsdc"));
const CryptoTaxUae = lazy(() => import("./pages/CryptoTaxUae"));
const CryptoEscrowUae = lazy(() => import("./pages/CryptoEscrowUae"));
const CryptoSalaryUae = lazy(() => import("./pages/CryptoSalaryUae"));
const BuyUsdtDubai = lazy(() => import("./pages/BuyUsdtDubai"));
const CryptoOtcDubai = lazy(() => import("./pages/CryptoOtcDubai"));
const BestCryptoExchangeUae = lazy(
  () => import("./pages/BestCryptoExchangeUae"),
);
const BitcoinPriceUae = lazy(() => import("./pages/BitcoinPriceUae"));

const queryClient = new QueryClient();

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-black/20 dark:border-white/20 border-t-black dark:border-t-white rounded-full animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SolanaWalletProvider>
      <AuthProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <TooltipProvider>
            <Toaster />
            <Sonner />

            <BrowserRouter>
              <GoogleAnalytics />
              <StructuredData type="organization" />
              <StructuredData type="website" />
              <ScrollToTop />
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* PUBLIC ROUTES WITH LAYOUT */}
                  <Route element={<MainLayout />}>
                    <Route path="/" element={<Index />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                      path="/email-verification-pending"
                      element={<EmailVerificationPending />}
                    />
                    <Route
                      path="/forgot-password"
                      element={<ForgotPassword />}
                    />
                    <Route
                      path="/reset-password/:token"
                      element={<ResetPassword />}
                    />
                    <Route path="/tokenomics" element={<BlipTokenomics />} />
                    <Route path="/rewards" element={<RewardsLanding />} />
                    <Route path="/merchant" element={<Merchant />} />
                    <Route path="/uae" element={<UAELandingPage />} />
                    <Route path="/coming-soon" element={<ComingSoon />} />
                    <Route path="/how-it-works" element={<HowItWorksPage />} />
                    <Route path="/contact" element={<ContactUs />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<TermsService />} />
                    <Route path="/cookies" element={<Cookies />} />
                    <Route path="/gdpr" element={<Gdpr />} />
                    <Route path="/legal/:tab" element={<LegalPage />} />

                    <Route path="/whitepaper" element={<Whitepaper />} />
                    <Route path="/twoFactorAuth" element={<TwoFactorAuth />} />
                    <Route path="/cryptoToAed" element={<CryptoToUae />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogArticle />} />
                    <Route path="/research" element={<Research />} />
                    <Route
                      path="/research/:slug"
                      element={<ResearchArticle />}
                    />

                    {/* SEO & Content Pages */}
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/glossary" element={<Glossary />} />
                    <Route path="/changelog" element={<Changelog />} />
                    <Route path="/use-cases" element={<UseCases />} />
                    <Route
                      path="/use-cases/:slug"
                      element={<UseCaseDetail />}
                    />
                    <Route path="/compare" element={<Compare />} />
                    <Route path="/compare/:slug" element={<Compare />} />
                    <Route path="/docs" element={<Docs />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/press" element={<Press />} />
                    <Route path="/community" element={<Community />} />

                    {/* Geo Landing Pages */}
                    <Route
                      path="/sell-usdt-dubai"
                      element={<SellUsdtDubai />}
                    />
                    <Route
                      path="/crypto-payments-uae"
                      element={<CryptoPaymentsUAE />}
                    />
                    <Route
                      path="/accept-crypto-business"
                      element={<AcceptCryptoBusiness />}
                    />
                    <Route path="/crypto-to-aed" element={<CryptoToAed />} />
                    <Route
                      path="/crypto-remittance-uae"
                      element={<CryptoRemittanceUae />}
                    />

                    {/* Per-Coin Converter Pages */}
                    <Route path="/btc-to-aed" element={<BtcToAed />} />
                    <Route path="/eth-to-aed" element={<EthToAed />} />
                    <Route path="/sol-to-aed" element={<SolToAed />} />

                    {/* Keyword Landing Pages */}
                    <Route
                      path="/crypto-to-bank-uae"
                      element={<CryptoToBankUae />}
                    />
                    <Route path="/usdt-vs-usdc" element={<UsdtVsUsdc />} />
                    <Route path="/crypto-tax-uae" element={<CryptoTaxUae />} />
                    <Route
                      path="/crypto-escrow-uae"
                      element={<CryptoEscrowUae />}
                    />
                    <Route
                      path="/crypto-salary-uae"
                      element={<CryptoSalaryUae />}
                    />
                    <Route path="/buy-usdt-dubai" element={<BuyUsdtDubai />} />
                    <Route
                      path="/crypto-otc-dubai"
                      element={<CryptoOtcDubai />}
                    />
                    <Route
                      path="/best-crypto-exchange-uae"
                      element={<BestCryptoExchangeUae />}
                    />
                    <Route
                      path="/bitcoin-price-uae"
                      element={<BitcoinPriceUae />}
                    />

                    <Route
                      path="/waitlist"
                      element={<AirdropLogin initialView="waitlist" />}
                    />
                    <Route
                      path="/join-waitlist"
                      element={<AirdropLogin initialView="waitlist" />}
                    />
                  </Route>

                  {/* PROTECTED DASHBOARD (NO LAYOUT) */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* ADMIN DASHBOARD (NO LAYOUT) */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </SolanaWalletProvider>
  </QueryClientProvider>
);

export default App;
