

// import { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { X, Menu, Coins } from "lucide-react";
// import { Link, NavLink, useLocation } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import { useAuth } from "@/contexts/AuthContext";

// /* ---------------- Language Switcher ---------------- */
// const LanguageSwitcher = () => {
//   const { i18n } = useTranslation();
//   const currentLanguage = i18n.language;

//   const changeLanguage = (lng: string) => {
//     i18n.changeLanguage(lng);
//     localStorage.setItem("lang", lng);
//   };

//   return (
//     <div className="flex items-center gap-2 text-sm font-medium">
//       {["en", "ar"].map((lng) => (
//         <button
//           key={lng}
//           onClick={() => changeLanguage(lng)}
//           className={`px-3 py-1 rounded-full transition ${
//             currentLanguage === lng
//               ? "bg-[#00FF94] text-black"
//               : "text-gray-400 hover:text-white"
//           }`}
//         >
//           {lng === "en" ? "EN" : "العربية"}
//         </button>
//       ))}
//     </div>
//   );
// };

// /* ---------------- Blip Points Badge ---------------- */
// const BlipPointsBadge = () => {
//   const { user, isAuthenticated } = useAuth();

//   if (!isAuthenticated || !user) return null;

//   return (
//     <Link
//       to="/dashboard"
//       className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2BFF88]/10 border border-[#2BFF88]/30 hover:bg-[#2BFF88]/20 transition-all"
//     >
//       <Coins className="w-4 h-4 text-[#2BFF88]" />
//       <span className="text-sm font-bold text-[#2BFF88]">
//         {user.totalBlipPoints} pts
//       </span>
//     </Link>
//   );
// };

// /* ---------------- Navbar ---------------- */
// export const Navbar = () => {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const { t } = useTranslation();
//   const { isAuthenticated } = useAuth();
//   const { pathname } = useLocation();
//   const navBase =
//     "relative pb-1 transition-colors font-medium text-gray-400 hover:text-[#2BFF88]";

//   const navActive =
//     "text-[#2BFF88] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-[#2BFF88]";

//   useEffect(() => {
//     scrollTo(0, 0);
//   }, [pathname]);

//   return (
//     <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-black/60 border-b border-white/5  overflow-hidden">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
//         {/* Logo */}
//         <Link
//           to="#hero"
//           className="flex items-center gap-2"
//           onClick={() => {
//             const protocolSection = document.getElementById("hero");
//             if (protocolSection) {
//               protocolSection.scrollIntoView({ behavior: "smooth" });
//             }
//           }}
//         >
//           <div className="relative">
//             <div className="w-3 h-3 rounded-full bg-[#2BFF88] shadow-[0_0_10px_#2BFF88]" />
//             <div className="absolute inset-0 rounded-full bg-[#2BFF88] animate-pulse opacity-50" />
//           </div>
//           <span className="text-2xl font-bold text-white">
//             Blip.<span className="text-[#2BFF88]">money</span>
//           </span>
//         </Link>

//         {/* Desktop Menu */}
//         <div className="hidden lg:flex items-center gap-10">
//           <div className="flex gap-8 text-sm">
//             <Link
//               to="/#protocol"
//               className={navBase}
//               onClick={() => {
//                 const protocolSection = document.getElementById("protocol");
//                 if (protocolSection) {
//                   protocolSection.scrollIntoView({ behavior: "smooth" });
//                 }
//               }}
//             >
//               {t("protocol")}
//             </Link>

//             <NavLink
//               to="/how-it-works"
//               className={({ isActive }) =>
//                 `${navBase} ${isActive ? navActive : ""}`
//               }
//             >
//               {t("How It Works")}
//             </NavLink>

//             <NavLink
//               to="/rewards"
//               className={({ isActive }) =>
//                 `${navBase} ${isActive ? navActive : ""}`
//               }
//             >
//               {t("rewards")}
//             </NavLink>

//             <NavLink
//               to="/tokenomics"
//               className={({ isActive }) =>
//                 `${navBase} ${isActive ? navActive : ""}`
//               }
//             >
//               {t("tokenomics")}
//             </NavLink>

//             {/* <NavLink
//               to="/contactUs"
//               className={({ isActive }) =>
//                 `${navBase} ${isActive ? navActive : ""}`
//               }
//             >
//               {t("ContactUs")}
//             </NavLink> */}
//           </div>

//           <LanguageSwitcher />

//           {/* Blip Points Badge (shown when logged in) */}
//           <BlipPointsBadge />
//           {/* CTA - Show Dashboard link if authenticated, otherwise Coming Soon */}
//           {isAuthenticated ? (
//             <NavLink
//               to="/dashboard"
//               className={({ isActive }) =>
//                 `px-5 py-2 rounded-full border text-sm transition-all ${
//                   isActive
//                     ? "border-[#2BFF88] text-[#2BFF88]"
//                     : "border-white/10 text-white hover:border-[#2BFF88]"
//                 }`
//               }
//             >
//               Dashboard
//             </NavLink>
//           ) : (
//             <NavLink
//               to="/coming-soon"
//               className={({ isActive }) =>
//                 `px-5 py-2 rounded-full border text-sm transition-all ${
//                   isActive
//                     ? "border-[#2BFF88] text-[#2BFF88]"
//                     : "border-white/10 text-white hover:border-[#2BFF88]"
//                 }`
//               }
//             >
//               {t("comingSoon")}
//             </NavLink>
//           )}
//         </div>

//         {/* Mobile Toggle */}
//         <button
//            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//   className="lg:hidden text-white"
//         >
//           {mobileMenuOpen ? <X /> : <Menu />}
//         </button>

//         {/* Mobile Menu */}
//         <AnimatePresence>
//           {mobileMenuOpen && (
//             <motion.div
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//               className="absolute top-full left-0 right-0 bg-black/95 border-b border-white/10 lg:hidden"
//             >
//               <div className="flex flex-col p-6 space-y-4 text-lg text-gray-400">
//                 <Link to="/#protocol" onClick={() => setMobileMenuOpen(false)}>
//                   {t("protocol")}
//                 </Link>
//                 <Link to="/how-it-works" onClick={() => setMobileMenuOpen(false)}>
//   {t("howItWorks")}
// </Link>

//                 <Link to="/rewards" onClick={() => setMobileMenuOpen(false)}>
//                   {t("rewards")}
//                 </Link>
//                 <Link to="/tokenomics" onClick={() => setMobileMenuOpen(false)}>
//                   {t("tokenomics")}
//                 </Link>

//                 {/* Mobile Blip Points & Dashboard for authenticated users */}
//                 {isAuthenticated ? (
//                   <>
//                     <div className="pt-4 border-t border-white/10">
//                       <div onClick={() => setMobileMenuOpen(false)}>
//                         <BlipPointsBadge />
//                       </div>
//                     </div>
//                     <Link
//                       to="/dashboard"
//                       onClick={() => setMobileMenuOpen(false)}
//                       className="mt-2 px-5 py-3 text-center rounded-full border border-[#2BFF88] text-[#2BFF88]"
//                     >
//                       Dashboard
//                     </Link>
//                   </>
//                 ) : (
//                   <Link
//                     to="/coming-soon"
//                     onClick={() => setMobileMenuOpen(false)}
//                     className="mt-4 px-5 py-3 text-center rounded-full border border-white/10 text-white"
//                   >
//                     {t("comingSoon")}
//                   </Link>
//                 )}

//                 <div className="pt-4 border-t border-white/10">
//                   <LanguageSwitcher />
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </nav>
//   );
// };


import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu, Coins } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";

/* ---------------- Language Switcher ---------------- */
const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
  };

  return (
    <div className="flex items-center gap-2 text-sm font-medium">
      {["en", "ar"].map((lng) => (
        <button
          key={lng}
          onClick={() => changeLanguage(lng)}
          className={`px-3 py-1 rounded-full transition ${
            currentLanguage === lng
              ? "bg-[#00FF94] text-black"
              : "text-gray-400 hover:text-white"
          }`}
        >
          {lng === "en" ? "EN" : "العربية"}
        </button>
      ))}
    </div>
  );
};

/* ---------------- Blip Points Badge ---------------- */
const BlipPointsBadge = ({ onClick }: { onClick?: () => void }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) return null;

  return (
    <Link
      to="/dashboard"
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2BFF88]/10 border border-[#2BFF88]/30 hover:bg-[#2BFF88]/20 transition-all"
    >
      <Coins className="w-4 h-4 text-[#2BFF88]" />
      <span className="text-sm font-bold text-[#2BFF88]">
        {user.totalBlipPoints} pts
      </span>
    </Link>
  );
};

/* ---------------- Navbar ---------------- */
export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();

  const navBase =
    "relative pb-1 transition-colors font-medium text-gray-400 hover:text-[#2BFF88]";
  const navActive =
    "text-[#2BFF88] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-[#2BFF88]";

  /* ✅ Always close mobile menu on route change */
  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-black/60 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="relative">
            <div className="w-3 h-3 rounded-full bg-[#2BFF88] shadow-[0_0_10px_#2BFF88]" />
            <div className="absolute inset-0 rounded-full bg-[#2BFF88] animate-pulse opacity-50" />
          </div>
          <span className="text-2xl font-bold text-white">
            Blip.<span className="text-[#2BFF88]">money</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-10">
          <div className="flex gap-8 text-sm">
            <NavLink to="/how-it-works" className={({ isActive }) =>
              `${navBase} ${isActive ? navActive : ""}`
            }>
              {t("howItWorks")}
            </NavLink>

            <NavLink to="/rewards" className={({ isActive }) =>
              `${navBase} ${isActive ? navActive : ""}`
            }>
              {t("rewards")}
            </NavLink>

            <NavLink to="/tokenomics" className={({ isActive }) =>
              `${navBase} ${isActive ? navActive : ""}`
            }>
              {t("tokenomics")}
            </NavLink>
          </div>

          <LanguageSwitcher />
          <BlipPointsBadge />

          {isAuthenticated ? (
            <NavLink
              to="/dashboard"
              className="px-4 py-1 rounded-full border border-gray-500"
            >
              Dashboard
            </NavLink>
          ) : (
            <NavLink
              to="/coming-soon"
              className="px-5 py-2 rounded-full border border-white/10 text-white"
            >
              {t("comingSoon")}
            </NavLink>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen((v) => !v)}
          className="lg:hidden text-white"
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden bg-black/95 border-t border-white/10"
          >
            <div className="flex flex-col p-6 space-y-5 text-lg text-gray-400">
              <Link to="/how-it-works">{t("howItWorks")}</Link>
              <Link to="/rewards">{t("rewards")}</Link>
              <Link to="/tokenomics">{t("tokenomics")}</Link>

              {isAuthenticated ? (
                <>
                  <BlipPointsBadge />
                  <Link
                    to="/dashboard"
                    className="px-4 py-1 text-center rounded-full border border-gray-500"
                  >
                    Dashboard
                  </Link>
                </>
              ) : (
                <Link
                  to="/coming-soon"
                  className="px-5 py-3 text-center rounded-full border border-white/10 text-white"
                >
                  {t("comingSoon")}
                </Link>
              )}

              <div className="pt-4 border-t border-white/10">
                <LanguageSwitcher />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
