import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RewardsLanding from "./pages/Rewards";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import StructuredData from "@/components/StructuredData";
import Index from "./pages/Index";
import UAELandingPage from "./pages/uae";
import NotFound from "./pages/NotFound";
import BlipTokenomics from "./components/BlipTokenomics";
import ComingSoon from "./components/ComingSoon";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <GoogleAnalytics />
        <StructuredData type="organization" />
        <StructuredData type="website" />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/tokenomics" element={<BlipTokenomics />} />
          <Route path="/rewards" element={<RewardsLanding />} />
          <Route path="/uae" element={<UAELandingPage />} />
          <Route path="/comingsoon" element={<ComingSoon />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
