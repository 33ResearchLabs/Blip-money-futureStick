import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu } from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

const LanguageSwitcher = ({ language, setLanguage }) => {
  return (
    <div className="flex items-center gap-2 text-sm font-medium">
      <button
        onClick={() => setLanguage("en")}
        className={`px-3 py-1 rounded-full transition ${
          language === "en"
            ? "bg-[#00FF94] text-black"
            : "text-gray-400 hover:text-white"
        }`}
      >
        EN
      </button>

      <button
        onClick={() => setLanguage("ar")}
        className={`px-3 py-1 rounded-full transition ${
          language === "ar"
            ? "bg-[#00FF94] text-black"
            : "text-gray-400 hover:text-white"
        }`}
      >
        العربية
      </button>
    </div>
  );
};

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState("en");
  const navigate = useNavigate();
  const location = useLocation();

  // Handle navigation to sections
  const handleSectionClick = (sectionId) => {
    setMobileMenuOpen(false);
    
    // If we're on the index page
    if (location.pathname === "/") {
      // Smooth scroll to section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      // Navigate to index page with hash
      navigate(`/#${sectionId}`);
    }
  };

  // Handle scrolling when navigating from another page
  useEffect(() => {
    if (location.hash) {
      // Remove the # from hash
      const sectionId = location.hash.substring(1);
      
      // Wait for page to load, then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, [location]);

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-white/5 bg-black/60 supports-[backdrop-filter]:bg-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <div className="relative">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#2BFF88] shadow-[0_0_10px_#2BFF88] relative z-10" />
            <div className="absolute inset-0 bg-[#2BFF88] rounded-full animate-ping opacity-50" />
          </div>
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Blip.<span className="text-[#2BFF88]">money</span>
          </span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex items-center gap-8 text-sm font-medium text-gray-400">
            <button
              onClick={() => handleSectionClick("protocol")}
              className="hover:text-[#2BFF88] transition-colors cursor-pointer"
            >
              Protocol
            </button>

            <button
              onClick={() => handleSectionClick("merchants")}
              className="hover:text-[#2BFF88] transition-colors cursor-pointer"
            >
              Merchants
            </button>
            
            <button
              onClick={() => handleSectionClick("peoplebank")}
              className="hover:text-[#2BFF88] transition-colors cursor-pointer"
            >
              PeopleBank
            </button> 

            <NavLink
              to="/rewards"
              className={({ isActive }) =>
                `transition-colors ${
                  isActive
                    ? "text-[#2BFF88] font-semibold"
                    : "hover:text-[#2BFF88]"
                }`
              }
            >
              Rewards
            </NavLink>
            
            <NavLink
              to="/tokenomics"
              className={({ isActive }) =>
                `transition-colors ${
                  isActive
                    ? "text-[#2BFF88] font-semibold"
                    : "hover:text-[#2BFF88]"
                }`
              }
            >
              Tokenomics
            </NavLink>
          </div>
          
          <LanguageSwitcher language={language} setLanguage={setLanguage} />
          
          <NavLink to="/coming-soon">
            <button className="px-5 py-2 rounded-full border border-white/10 text-white text-sm hover:border-[#2BFF88] hover:shadow-[0_0_15px_rgba(43,255,136,0.3)] transition-all bg-black/50 backdrop-blur-sm group">
              <span className="group-hover:text-[#2BFF88] transition-colors">
                Coming Soon
              </span>
            </button>
          </NavLink>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-white hover:text-[#2BFF88] transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/10"
            >
              <div className="flex flex-col p-6 space-y-4">
                <button
                  onClick={() => handleSectionClick("protocol")}
                  className="text-gray-400 hover:text-[#2BFF88] transition-colors text-lg py-2 text-left"
                >
                  Protocol
                </button>
                
                <button
                  onClick={() => handleSectionClick("merchants")}
                  className="text-gray-400 hover:text-[#2BFF88] transition-colors text-lg py-2 text-left"
                >
                  Merchants
                </button>
                
                <button
                  onClick={() => handleSectionClick("peoplebank")}
                  className="text-gray-400 hover:text-[#2BFF88] transition-colors text-lg py-2 text-left"
                >
                  PeopleBank
                </button>
                
                <NavLink
                  to="/tokenomics"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-400 hover:text-[#2BFF88] transition-colors text-lg py-2"
                >
                  Tokenomics
                </NavLink>
                
                <NavLink to="/coming-soon" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full px-5 py-3 rounded-full border border-white/10 text-white hover:border-[#2BFF88] hover:shadow-[0_0_15px_rgba(43,255,136,0.3)] transition-all bg-black/50 backdrop-blur-sm mt-2">
                    Open App
                  </button>
                </NavLink>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};