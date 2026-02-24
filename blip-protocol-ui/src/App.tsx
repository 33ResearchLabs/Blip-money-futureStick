import { lazy, Suspense } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useSearchParams,
} from "react-router-dom";

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
import { Toaster } from "./components/ui/toaster";

const CryptoToUae = lazy(() => import("./pages/Markets/CryptoToUae"));
const LegalPage = lazy(() => import("./pages/Legel/LeagalPage"));
const UserRegister = lazy(() => import("./pages/Waitlist/UserRegister"));
const ForgotPassword = lazy(() => import("./pages/Waitlist/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/Waitlist/ResetPassword"));
const EmailVerificationPending = lazy(() => import("./pages/Waitlist/EmailVerificationPending"));
const VerifyEmail = lazy(() => import("./pages/Waitlist/VerifyEmail"));
const MerchantDashboard = lazy(() => import("./pages/Waitlist/MerchantDashboard"));
const MerchantLogin = lazy(() => import("./pages/Waitlist/MerchantLogin").then((m) => ({ default: m.MerchantLogin })));
const MerchantRegister = lazy(() => import("./pages/Waitlist/MerchantRegister"));
const SuperAdminDashboard = lazy(() => import("./pages/Waitlist/SuperAdminDashboard"));

// Lazy load page components
const Index = lazy(() => import("./pages/Index"));
const RewardsLanding = lazy(() => import("./pages/Unused/Rewards"));
const UAELandingPage = lazy(() => import("./pages/Unused/uae"));
const NotFound = lazy(() => import("./pages/NotFound"));
const BlipTokenomics = lazy(() => import("./pages/Protocol/BlipTokenomics"));
const ComingSoon = lazy(() => import("./components/ComingSoon"));
const HowItWorksPage = lazy(() =>
  import("./pages/Protocol/HowItWorks").then((module) => ({
    default: module.HowItWorksPage,
  })),
);
const ContactUs = lazy(() => import("./pages/Company/ContactUs"));
const UserLogin = lazy(() => import("./pages/Waitlist/UserLogin"));
const Dashboard = lazy(() => import("./pages/Waitlist/Dashboard"));
const AdminDashboard = lazy(() => import("./pages/Unused/AdminDashboard"));
const Privacy = lazy(() => import("./pages/Legel/Privecy"));
const TermsService = lazy(() => import("./components/TermsService"));
const Cookies = lazy(() => import("./components/Cookies"));
const Gdpr = lazy(() => import("./pages/Legel/Gdpr"));
const TwoFactorAuth = lazy(() => import("./components/TwoFactorAuth"));
const Whitepaper = lazy(() => import("./pages/Protocol/Whitepaper"));
const Merchant = lazy(() => import("./pages/UseCases/Merchant"));
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

// Handle Firebase auth action URLs (e.g. /?mode=resetPassword&oobCode=...)
const FirebaseActionHandler = ({ children }: { children: React.ReactNode }) => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const oobCode = searchParams.get("oobCode");

  if (mode === "resetPassword" && oobCode) {
    return <Navigate to={`/reset-password?oobCode=${oobCode}`} replace />;
  }

  if (mode === "verifyEmail" && oobCode) {
    return <Navigate to={`/verify-email?oobCode=${oobCode}`} replace />;
  }

  return <>{children}</>;
};

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
          disableTransitionOnChange
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
                    <Route
                      path="/"
                      element={
                        <FirebaseActionHandler>
                          <Index />
                        </FirebaseActionHandler>
                      }
                    />
                    <Route path="/register" element={<UserRegister />} />
                    <Route
                      path="/email-verification-pending"
                      element={<EmailVerificationPending />}
                    />
                    <Route
                      path="/forgot-password"
                      element={<ForgotPassword />}
                    />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/verify-email" element={<VerifyEmail />} />
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
                    <Route path="/legal" element={<LegalPage />} />

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
                      element={<UserLogin initialView="waitlist" />}
                    />
                    <Route
                      path="/join-waitlist"
                      element={<UserLogin initialView="waitlist" />}
                    />
                    <Route
                      path="/merchant-waitlist"
                      element={<MerchantLogin initialView="waitlist" />}
                    />
                    <Route
                      path="/merchant-register"
                      element={<MerchantRegister />}
                    />
                  </Route>

                  {/* PROTECTED DASHBOARD (NO LAYOUT) */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute requiredRole="user">
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/merchant-dashboard"
                    element={
                      <ProtectedRoute requiredRole="merchant">
                        <MerchantDashboard />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/superadmin"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <SuperAdminDashboard />
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
