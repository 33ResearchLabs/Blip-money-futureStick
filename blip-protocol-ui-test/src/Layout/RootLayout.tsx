import { Outlet, useLocation } from "react-router-dom";
import { HashRedirectScroll } from "@/components/HashRedirectScroll";
import { Navbar } from "@/components/Navbar";
import { SocialSidebar } from "@/components/SocialSidebar";
import { Footer } from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollToBottomButton from "@/components/ScrollToBottomButton";

const MainLayout = () => {
  const location = useLocation();
  console.log(location);
  return (
    <>
    <ScrollToTop />
      <Navbar />

      {/* ✅ SAFE PLACE for non-route logic */}
      <HashRedirectScroll />
      {/* <SocialSidebar /> */}

      <Outlet />
      <ScrollToBottomButton/>

      <Footer />
    </>
  );
};

export default MainLayout;
