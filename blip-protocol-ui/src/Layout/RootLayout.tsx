import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import { HashRedirectScroll } from "@/components/HashRedirectScroll";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NotificationBannerProvider } from "@/components/NotificationPopup";
import ScrollToBottomButton from "@/components/ScrollToBottomButton";
import { ScrollProgressBar } from "@/components/GlobalPolish";
import { Link, useLocation as useLoc } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/* Sticky mobile-only Join Waitlist CTA. Pinned to the bottom of the viewport,
   shown on every public route except the waitlist/auth screens themselves. */
const HIDE_STICKY = new Set<string>([
  "/waitlist", "/merchant-waitlist", "/login", "/merchant-login",
  "/register", "/merchant-register", "/join-waitlist",
  "/forgot-password", "/reset-password", "/verify-email",
  "/email-verification-pending", "/redeem",
]);
const StickyJoinWaitlist = () => {
  const { pathname } = useLoc();
  if (HIDE_STICKY.has(pathname)) return null;
  return (
    <div
      className="md:hidden fixed inset-x-0 bottom-0 z-[60] px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 pointer-events-none"
      style={{
        background:
          "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0) 100%)",
      }}
    >
      <Link
        to="/waitlist"
        className="pointer-events-auto group inline-flex w-full items-center justify-center gap-2 h-14 rounded-full text-[17px] font-bold tracking-tight transition-transform active:scale-[0.98]"
        style={{
          background: "#cc785c",
          color: "#fff",
          boxShadow: "0 14px 32px -10px rgba(204,120,92,0.55), 0 4px 14px -4px rgba(0,0,0,0.35)",
        }}
      >
        <span>Join Waitlist</span>
        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
};

/**
 * Forces light theme on the landing page (and a few specific routes that
 * are designed light-first), dark theme on every other route.
 * Runs on every route change so navigation between pages re-applies the
 * route's preferred default.
 */
const LIGHT_ROUTES = new Set<string>([
  "/", "", "/rates",
  "/waitlist/user", "/waitlist/merchant", "/join-waitlist",
  "/login", "/register", "/merchant-login", "/merchant-register",
]);

const RouteThemeSync = () => {
  const { setTheme } = useTheme();
  const location = useLocation();
  useEffect(() => {
    setTheme(LIGHT_ROUTES.has(location.pathname) ? "light" : "dark");
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
      <StickyJoinWaitlist />
    </NotificationBannerProvider>
  );
};

export default MainLayout;
