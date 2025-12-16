import { Outlet, useLocation } from "react-router-dom";
import { HashRedirectScroll } from "@/components/HashRedirectScroll";
import { Navbar } from "@/components/Navbar";
import { SocialSidebar } from "@/components/SocialSidebar";
import { Footer } from "@/components/Footer";

const MainLayout = () => {
  const location = useLocation();
  console.log(location);
  return (
    <>
      <Navbar />

      {/* ✅ SAFE PLACE for non-route logic */}
      <HashRedirectScroll />
      <SocialSidebar />

      <Outlet />

      <Footer />
    </>
  );
};

export default MainLayout;
