import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, BookOpen, HelpCircle, Info, Users, Briefcase } from "lucide-react";
import SEO from "@/components/SEO";

const links = [
  { label: "Home", href: "/", icon: Home },
  { label: "Blog", href: "/blog", icon: BookOpen },
  { label: "FAQ", href: "/faq", icon: HelpCircle },
  { label: "How It Works", href: "/how-it-works", icon: Info },
  { label: "About", href: "/about", icon: Users },
  { label: "Use Cases", href: "/use-cases", icon: Briefcase },
];

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <SEO
        title="Page Not Found | Blip Money"
        description="The page you're looking for doesn't exist or has been moved. Browse our site to find what you need."
        canonical="https://blip.money/404"
      />

      <div className="min-h-screen bg-[#FAF8F5] dark:bg-transparent">
        <div className="max-w-[720px] mx-auto px-4 sm:px-6 pt-32 pb-16">
          {/* 404 Heading */}
          <div className="text-center mb-16">
            <h1 className="text-[120px] sm:text-[160px] font-bold leading-none tracking-tight text-black/10 dark:text-white/10 select-none">
              404
            </h1>
            <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white -mt-6 mb-4">
              Page not found
            </h2>
            <p className="text-gray-400 dark:text-white/40 text-lg max-w-md mx-auto leading-relaxed">
              The page you're looking for doesn't exist or has been moved. Try one of the links below.
            </p>
          </div>

          {/* Helpful Links Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="group p-5 rounded-xl bg-white/60 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] hover:border-black/[0.12] dark:hover:border-white/[0.12] transition-colors"
              >
                <link.icon className="w-5 h-5 text-gray-300 dark:text-white/20 group-hover:text-gray-500 dark:group-hover:text-white/40 transition-colors mb-3" />
                <span className="block text-sm font-semibold text-black dark:text-white group-hover:text-gray-600 dark:group-hover:text-white/80 transition-colors">
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
