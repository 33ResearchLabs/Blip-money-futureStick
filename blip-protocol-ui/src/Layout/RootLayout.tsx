import { Outlet, useLocation } from "react-router-dom";
import { HashRedirectScroll } from "@/components/HashRedirectScroll";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NotificationBannerProvider } from "@/components/NotificationPopup";
import ScrollToBottomButton from "@/components/ScrollToBottomButton";
import { ScrollProgressBar } from "@/components/GlobalPolish";

const MainLayout = () => {
  const location = useLocation();
  const isBlipRates = location.pathname.startsWith("/blip-rates");

  return (
    <NotificationBannerProvider>
      <ScrollProgressBar />

      {!isBlipRates && <Navbar />}

      <HashRedirectScroll />

      <Outlet />

      <ScrollToBottomButton />
      {!isBlipRates && <Footer />}
    </NotificationBannerProvider>
  );
};

export default MainLayout;
