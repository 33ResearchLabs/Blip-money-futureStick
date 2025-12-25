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
import BlipAirdropHub from "./pages/JoinWaitlist";
import { SolanaWalletProvider } from "./providers/SolanaWalletProvider";

// Import wallet adapter CSS
import "@solana/wallet-adapter-react-ui/styles.css";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SolanaWalletProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <GoogleAnalytics />
          <StructuredData type="organization" />
          <StructuredData type="website" />
          <ScrollToTop />
          <Routes>
            {/* LAYOUT ROUTE */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/airdrop" element={<BlipAirdropHub />} />
              <Route path="/tokenomics" element={<BlipTokenomics />} />
              <Route path="/rewards" element={<RewardsLanding />} />
              <Route path="/uae" element={<UAELandingPage />} />
              <Route path="/coming-soon" element={<ComingSoon />} />
              <Route path="/howItWorks" element={<HowItWorksPage />} />
              <Route path="/contact" element={<ContactUs />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SolanaWalletProvider>
  </QueryClientProvider>
);

export default App;
