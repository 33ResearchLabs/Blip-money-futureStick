import { Outlet } from "react-router-dom";
import { HashRedirectScroll } from "@/components/HashRedirectScroll";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NotificationBannerProvider } from "@/components/NotificationPopup";
import ScrollToBottomButton from "@/components/ScrollToBottomButton";

const MainLayout = () => {
  return (
    <NotificationBannerProvider>
      <Navbar />

      {/* ✅ SAFE PLACE for non-route logic */}
      <HashRedirectScroll />
      {/* <SocialSidebar /> */}

      <Outlet />
      <ScrollToBottomButton />

      <Footer />
    </NotificationBannerProvider>
  );
};

export default MainLayout;
