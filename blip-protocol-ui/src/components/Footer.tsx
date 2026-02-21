import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
import { CTAButton } from "./Navbar";
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
  { icon: FaTelegramPlane, href: "https://t.me/+3DpHLzc2BfJhOWEx" },
  { icon: FaXTwitter, href: "https://x.com/blipmoney_" },
  { icon: FaYoutube, href: "https://www.youtube.com/@BlipMoney" },
  {
    icon: FaLinkedin,
    href: "https://www.linkedin.com/company/blipmoneyofficial/",
  },
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
  const [isActive, setIsActive] = useState(false);
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

  /* Glow Pulse Animation */
  useEffect(() => {
    const interval = setInterval(() => {
      setIsActive(true);
      setTimeout(() => setIsActive(false), 2000);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative z-10 w-full bg-[#FAF8F5] dark:bg-black text-black dark:text-white overflow-hidden"
    >
      {/* ================= CTA SECTION ================= */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 flex flex-col lg:flex-row items-center justify-between gap-16">
        {/* LEFT PULSE CIRCLE */}
        <div
          className={`relative w-full max-w-[330px] aspect-square flex items-center justify-center transition-all duration-[1200ms] ease-out ${
            isVisible
              ? "opacity-100 translate-x-0 blur-0"
              : "opacity-0 -translate-x-20 blur-xl"
          }`}
        >
          {/* Expanding Shockwaves */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className={`absolute w-24 h-24 rounded-full border border-orange-500/70 transition-all duration-[1500ms] ease-out ${
                isActive ? "scale-[3.5] opacity-0" : "scale-1 opacity-0"
              }`}
            />
            <div
              className={`absolute w-24 h-24 rounded-full border border-black/15 dark:border-white/30 transition-all duration-[1200ms] delay-150 ease-out ${
                isActive ? "scale-[2.5] opacity-0" : "scale-1 opacity-0"
              }`}
            />
          </div>

          {/* Background Environmental Atmosphere */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-[140%] rotate-[-15deg] pointer-events-none transition-opacity duration-1000 ${
              isActive ? "opacity-80" : "opacity-35"
            }`}
          >
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent blur-sm -translate-y-18"></div>
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/40 to-transparent blur-sm translate-y-18"></div>
          </div>

          {/* Main Dial */}
          <div
            className={`relative z-10 w-full h-full rounded-full border-[4px]
      bg-white dark:bg-[#0a0a0a]
      border-black/10 dark:border-white/5
      shadow-[0_10px_40px_rgba(0,0,0,0.08),inset_0_0_25px_rgba(0,0,0,0.04)]
      dark:shadow-[0_0_80px_rgba(0,0,0,1),inset_0_0_50px_rgba(0,0,0,0.9)]
      flex items-center justify-center overflow-hidden
      transition-all duration-1000
      ${isActive ? "ring-1 ring-black/20 dark:ring-white/10" : ""}`}
          >
            {/* Dot Grid Texture */}
            <div
              className="absolute inset-0 opacity-[0.12] dark:opacity-[0.18]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(0,0,0,0.35) 0.5px, transparent 0.5px)",
                backgroundSize: "8px 8px",
              }}
            />

            <div className="absolute inset-9 rounded-full border border-black/10 dark:border-white/15"></div>
            <div className="absolute inset-18 rounded-full border border-black/5 dark:border-white/10 opacity-70"></div>

            {/* Conic Glow Layers */}
            <div
              className="absolute inset-5 rounded-full opacity-30 blur-[1px]"
              style={{
                background:
                  "conic-gradient(from 180deg at 50% 50%, transparent 0deg, #f97316 40deg, transparent 120deg)",
                transform: "rotate(-45deg)",
              }}
            />
            <div
              className="absolute inset-5 rounded-full opacity-30 blur-[1px]"
              style={{
                background:
                  "conic-gradient(from 0deg at 50% 50%, transparent 0deg, #3b82f6 40deg, transparent 120deg)",
                transform: "rotate(-45deg)",
              }}
            />

            {/* Hash Markers */}
            {[...Array(24)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-[1.5px] transition-all duration-700 ${
                  i % 6 === 0
                    ? "h-3 bg-black/30 dark:bg-white/30"
                    : "h-1.5 bg-black/20 dark:bg-white/15"
                } ${
                  isActive
                    ? "bg-orange-500/70 shadow-[0_0_8px_rgba(249,115,22,0.5)]"
                    : ""
                }`}
                style={{
                  transform: `rotate(${i * 15}deg) translateY(-131px)`,
                }}
              />
            ))}

            {/* Central Core */}
            <div className="relative z-20 w-36 h-36 flex items-center justify-center">
              <div
                className={`absolute w-24 h-24 bg-orange-500/25 blur-3xl rounded-full transition-all duration-700 ${
                  isActive ? "opacity-100 scale-125" : "opacity-0 scale-100"
                }`}
              />

              <svg
                viewBox="0 0 100 100"
                className="w-full h-full overflow-visible text-zinc-900 dark:text-white"
              >
                <defs>
                  <linearGradient
                    id="waveGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop
                      offset="0%"
                      stopColor={isActive ? "#f97316" : "currentColor"}
                    />
                    <stop offset="50%" stopColor="#f97316" />
                    <stop
                      offset="100%"
                      stopColor={isActive ? "#f97316" : "currentColor"}
                    />
                  </linearGradient>
                </defs>

                <path
                  d="M26 50 L38 50 L46 28 L54 72 L62 50 L74 50"
                  fill="none"
                  stroke="url(#waveGradient)"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-[dash_2.5s_ease-in-out_infinite]"
                  style={{
                    strokeDasharray: "140",
                    strokeDashoffset: "0",
                    filter: isActive
                      ? "drop-shadow(0 0 8px rgba(249,115,22,0.6))"
                      : "none",
                  }}
                />

                <circle
                  cx="50"
                  cy="50"
                  r="46"
                  stroke={isActive ? "#f97316" : "currentColor"}
                  strokeWidth="0.8"
                  fill="none"
                  className="transition-all duration-1000"
                  opacity={isActive ? "0.5" : "0.25"}
                />
              </svg>
            </div>

            {/* Center Dot */}
            <div
              className={`absolute w-3 h-3 rounded-full
        bg-white dark:bg-[#111]
        border border-black/10 dark:border-white/20
        z-30 transition-shadow duration-1000 ${
          isActive ? "shadow-[0_0_14px_rgba(249,115,22,0.6)]" : ""
        }`}
            />
          </div>
        </div>

        {/* RIGHT TEXT */}
        <div
          className={`flex-1 text-center lg:text-left transition-all duration-1000 ${
            isVisible ? "opacity-100" : "opacity-0 translate-x-10"
          }`}
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Join the Movement
          </h2>

          <p className="text-sm lg:text-base text-black/60 dark:text-white/50 max-w-md mb-6">
            Simple, fast, and secure financial infrastructure for modern
            businesses and individuals.
          </p>

          <CTAButton to="/contact" className="w-[220px] h-[48px]">
            Get Support
          </CTAButton>
        </div>
      </div>

      {/* ================= LINKS GRID ================= */}

      <div
        className={`border-t border-black/5 dark:border-white/5 transition-all duration-1000 ${
          isVisible ? "opacity-100" : "opacity-0 translate-y-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-8 sm:px-6 py-12">
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
