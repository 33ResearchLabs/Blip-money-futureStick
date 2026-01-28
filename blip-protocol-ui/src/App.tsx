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

import Index from "./pages/Index";
import RewardsLanding from "./pages/Rewards";
import UAELandingPage from "./pages/uae";
import NotFound from "./pages/NotFound";
import BlipTokenomics from "./pages/BlipTokenomics";
import ComingSoon from "./components/ComingSoon";
import { HowItWorksPage } from "./pages/HowItWorks";
import ContactUs from "./pages/ContactUs";
import ScrollToTop from "./components/ScrollToTop";
import StarfieldBackground from "./components/StarfieldBackground";
import AirdropLogin from "./pages/AirdropLogin";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { SolanaWalletProvider } from "./providers/SolanaWalletProvider";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Import wallet adapter CSS
import "@solana/wallet-adapter-react-ui/styles.css";
import Privacy from "./components/Privecy";
import TermsService from "./components/TermsService";
import Cookies from "./components/Cookies";
import Gdpr from "./components/Gdpr";
import TwoFactorAuth from "./components/TwoFactorAuth";
import Merchant from "./pages/Merchant";

const queryClient = new QueryClient();

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
              <StarfieldBackground />
              <GoogleAnalytics />
              <StructuredData type="organization" />
              <StructuredData type="website" />
              <ScrollToTop />
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
                  <Route path="/twoFactorAuth" element={<TwoFactorAuth />} />
                  <Route path="/waitlist" element={<AirdropLogin />} />
                  <Route
                    path="/join-waitlist"
                    element={<AirdropLogin initialView="waitlist" />}
                  />
                </Route>

                {/* WAITLIST LtOGIN (NO LAYOUT) */}
                {/* <Route path="/waitlist" element={<AirdropLogin />} /> */}

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
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </SolanaWalletProvider>
  </QueryClientProvider>
);

export default App;
