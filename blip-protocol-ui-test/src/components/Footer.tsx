import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
import { FaLinkedin, FaTelegramPlane, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

/* ================= FOOTER DATA ================= */

const FOOTER_SECTIONS = [
  {
    title: "Protocol",
    links: [
      { label: "How It Works", to: "/how-it-works" },
      { label: "Tokenomics", to: "/tokenomics" },
      { label: "Whitepaper", to: "/whitepaper" },
    ],
  },
  {
    title: "Use Cases",
    links: [
      { label: "Freelancers", to: "/use-cases/freelancers" },
      { label: "OTC Traders", to: "/use-cases/otc-traders" },
      { label: "E-Commerce", to: "/use-cases/e-commerce" },
      { label: "Remittances", to: "/use-cases/remittance" },
      { label: "Merchants", to: "/merchant" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", to: "/blog" },
      { label: "Research", to: "/research" },
      { label: "FAQ", to: "/faq" },
      { label: "Glossary", to: "/glossary" },
      { label: "Compare", to: "/compare" },
    ],
  },
  {
    title: "Markets",
    links: [
      { label: "Crypto to AED", to: "/crypto-to-aed" },
      { label: "BTC to AED", to: "/btc-to-aed" },
      { label: "USDT vs USDC", to: "/usdt-vs-usdc" },
      { label: "Buy USDT Dubai", to: "/buy-usdt-dubai" },
      { label: "Crypto OTC Dubai", to: "/crypto-otc-dubai" },
      { label: "Bitcoin Price UAE", to: "/bitcoin-price-uae" },
      { label: "Crypto Tax UAE", to: "/crypto-tax-uae" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Press", to: "/press" },
      { label: "Community", to: "/community" },
      { label: "Waitlist", to: "/waitlist" },
    ],
  },
];

const SOCIAL_PLATFORMS = [
  { icon: FaTelegramPlane, href: "https://t.me/+3DpHLzc2BfJhOWEx", label: "Telegram" },
  { icon: FaXTwitter, href: "https://x.com/blipmoney_", label: "X (Twitter)" },
  { icon: FaYoutube, href: "https://www.youtube.com/@BlipMoney", label: "YouTube" },
  { icon: FaLinkedin, href: "https://www.linkedin.com/company/blipmoneyofficial/", label: "LinkedIn" },
];

/* ================= SMALL COMPONENTS ================= */

const FooterLink = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => (
  <Link
    to={to}
    className="text-[13px] text-black/70 dark:text-white/40 font-medium
    hover:text-black dark:hover:text-white
    transition-all duration-300 
    flex items-center gap-0 hover:gap-2 group"
  >
    <span
      className="w-0 group-hover:w-2 h-[1px]
      bg-black dark:bg-white
      rounded-full
      transition-all duration-300
      opacity-0 group-hover:opacity-100"
    />
    {children}
  </Link>
);

/* ================= MAIN FOOTER ================= */

export const Footer = ({
  skipAnimation = false,
}: {
  skipAnimation?: boolean;
}) => {
  const [isVisible, setIsVisible] = useState(skipAnimation);
  const footerRef = useRef<HTMLDivElement | null>(null);

  /* Scroll Animation */
  useEffect(() => {
    if (skipAnimation) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, [skipAnimation]);

  return (
    <footer
      ref={footerRef}
      className="relative z-10 w-full bg-[#FAF8F5] dark:bg-black text-black dark:text-white overflow-hidden"
    >
      {/* ================= LINKS GRID ================= */}

      <div
        className={`border-t border-black/5 dark:border-white/5 transition-all duration-1000 ${
          isVisible ? "opacity-100" : "opacity-0 translate-y-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
            {FOOTER_SECTIONS.map((section, i) => (
              <div key={i} className="space-y-3">
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-black/80 dark:text-white/80">
                  {section.title}
                </h4>

                <ul className="space-y-2">
                  {section.links.map((link, index) => (
                    <li key={index}>
                      <FooterLink to={link.to}>{link.label}</FooterLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= BOTTOM BAR ================= */}

      <div className="border-t border-black/5 dark:border-white/5 bg-[#F5F3F0] dark:bg-[#050505] px-6 py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex  gap-4">
            <div className="text-sm text-black/80 dark:text-white/30 uppercase tracking-widest">
              © {new Date().getFullYear()} blip.money
            </div>
            <div className="flex items-center gap-8">
              <Link
                to="/legal"
                className="text-sm text-black/80 dark:text-white/30 uppercase tracking-widest font-bold"
              >
                Legal
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {SOCIAL_PLATFORMS.map((platform, i) => {
              const Icon = platform.icon;
              return (
                <a
                  key={i}
                  href={platform.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={platform.label}
                >
                  <Icon className="w-5 h-5 text-black/60 dark:text-white/50 hover:text-black dark:hover:text-white hover:scale-110 transition-all duration-300" />
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-3 text-sm uppercase tracking-widest font-bold text-black/70 dark:text-white/50">
            <div className="w-5 h-5 rounded-sm flex items-center justify-center">
              <Zap
                size={11}
                className="text-black dark:text-white fill-current"
              />
            </div>
            Fast. Simple. Blip.
          </div>
        </div>
      </div>

      {/* Animation Keyframe */}
      <style>{`
        @keyframes dash {
          0% { stroke-dashoffset: 140; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { stroke-dashoffset: -140; opacity: 0; }
        }
      `}</style>
    </footer>
  );
};
