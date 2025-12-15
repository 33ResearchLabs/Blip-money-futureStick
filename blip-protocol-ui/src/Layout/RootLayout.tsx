import { Outlet, useLocation } from "react-router-dom";
import { HashRedirectScroll } from "@/components/HashRedirectScroll";
import { Navbar } from "@/components/Navbar";
import { SocialSidebar } from "@/components/SocialSidebar";

const MainLayout = () => {
  const location = useLocation()
  console.log(location)
  return (
    <>
      <Navbar />

      {/* ✅ SAFE PLACE for non-route logic */}
      <HashRedirectScroll />
      <SocialSidebar/> 

      <Outlet />
    </>
  );
};

export default MainLayout;
