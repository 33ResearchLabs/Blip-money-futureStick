import { useLocation, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/* Small site-wide ad strip — points to merchant/LP signup on /waitlist.
   Sits above the footer on every public route except the auth + dashboard
   surfaces (no point pitching merchant signup if the user is already there). */
const HIDE_ROUTES = new Set<string>([
  "/waitlist",
  "/waitlist/user",
  "/waitlist/merchant",
  "/login",
  "/register",
  "/merchant-login",
  "/merchant-register",
  "/merchant-waitlist",
  "/join-waitlist",
  "/dashboard",
  "/merchant-dashboard",
  "/merchant-dashboard-preview",
]);

export default function MerchantAdBanner() {
  const { pathname } = useLocation();
  if (HIDE_ROUTES.has(pathname)) return null;

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        background:
          "linear-gradient(90deg, rgba(204,120,92,0.06) 0%, rgba(204,120,92,0.12) 50%, rgba(204,120,92,0.06) 100%)",
        borderTop: "1px solid rgba(204,120,92,0.18)",
        borderBottom: "1px solid rgba(204,120,92,0.18)",
      }}
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-3 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 text-center">
        <p className="text-[13px] sm:text-[13.5px] leading-snug" style={{ color: "#1d1d1f" }}>
          <span className="font-semibold">Join as a merchant / LP</span>{" "}
          <span style={{ color: "#3a3a3c" }}>
            in Blip Market and earn up to{" "}
          </span>
          <span className="font-semibold" style={{ color: "#cc785c" }}>
            10% on every transaction.
          </span>
        </p>
        <Link
          to="/waitlist?role=merchant"
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] font-semibold tracking-tight transition-transform hover:-translate-y-[1px] shrink-0"
          style={{
            background: "#cc785c",
            color: "#ffffff",
            boxShadow: "0 6px 18px -8px rgba(204,120,92,0.6)",
          }}
        >
          Become a merchant
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
