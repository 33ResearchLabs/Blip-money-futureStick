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
import AirdropLogin from "./pages/AirdropLogin";
import Dashboard from "./pages/Dashboard";
import { SolanaWalletProvider } from "./providers/SolanaWalletProvider";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Import wallet adapter CSS
import "@solana/wallet-adapter-react-ui/styles.css";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SolanaWalletProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />

          <BrowserRouter>
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
                <Route path="/uae" element={<UAELandingPage />} />
                <Route path="/coming-soon" element={<ComingSoon />} />
                <Route path="/howItWorks" element={<HowItWorksPage />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/airdrop" element={<AirdropLogin />} />
                 <Route path="/dashboard" element={   <ProtectedRoute>     <Dashboard />   </ProtectedRoute>}/>
              </Route>

              {/* AIRDROP LOGIN (NO LAYOUT) */}
              

              {/* PROTECTED DASHBOARD (NO LAYOUT) */}
              <Route path="/dashboard" element={   <ProtectedRoute>     <Dashboard />   </ProtectedRoute>}/>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </SolanaWalletProvider>
  </QueryClientProvider>
);

export default App;
