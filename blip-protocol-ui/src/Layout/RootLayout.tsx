import { Outlet, useLocation } from "react-router-dom";
import { HashRedirectScroll } from "@/components/HashRedirectScroll";
import { Navbar } from "@/components/Navbar";

const MainLayout = () => {
  const location = useLocation()
  console.log(location)
  return (
    <>
      <Navbar />

      {/* ✅ SAFE PLACE for non-route logic */}
      <HashRedirectScroll />

      <Outlet />
    </>
  );
};

export default MainLayout;
