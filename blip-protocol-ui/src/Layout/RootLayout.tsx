import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import { HashRedirectScroll } from "@/components/HashRedirectScroll";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NotificationBannerProvider } from "@/components/NotificationPopup";
import ScrollToBottomButton from "@/components/ScrollToBottomButton";
import { ScrollProgressBar } from "@/components/GlobalPolish";

/**
 * Forces light theme on the landing page, dark theme on every other route.
 * Runs on every route change so navigation between pages re-applies the
 * route's preferred default.
 */
const RouteThemeSync = () => {
  const { setTheme } = useTheme();
  const location = useLocation();
  useEffect(() => {
    const isLanding = location.pathname === "/" || location.pathname === "";
    setTheme(isLanding ? "light" : "dark");
  }, [location.pathname, setTheme]);
  return null;
};

const MainLayout = () => {
  return (
    <NotificationBannerProvider>
      <RouteThemeSync />
      <ScrollProgressBar />
      <Navbar />
      <HashRedirectScroll />
      <Outlet />
      <ScrollToBottomButton />
      <Footer />
    </NotificationBannerProvider>
  );
};

export default MainLayout;
