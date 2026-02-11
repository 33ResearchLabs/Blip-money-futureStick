import { lazy, Suspense } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
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
                    <Route path="/whitepaper" element={<Whitepaper />} />
                    <Route path="/twoFactorAuth" element={<TwoFactorAuth />} />
                    <Route path="/cryptoToAed" element={<CryptoToUae />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogArticle />} />
                    <Route path="/research" element={<Research />} />
                    <Route path="/research/:slug" element={<ResearchArticle />} />
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
