import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Twitter,
  Linkedin,
  Github,
  Youtube,
  Slack,
  Send,
  Zap,
} from "lucide-react";
import { CTAButton } from "./Navbar";
import { getYear } from "date-fns";
import { FaLinkedin, FaTelegramPlane, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

/**
 * BlipFooter Component
 * Professional messaging for blip.money.
 * Added: Scroll-triggered entrance animations using Intersection Observer.
 */

const FooterLink = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => (
  <Link
    to={to}
    className="
      text-[13px] text-black/80 dark:text-zinc-500
      hover:text-black dark:hover:text-white
      transition-all duration-300 font-light
      flex items-center gap-0 hover:gap-2 group/link
    "
  >
    <span
      className="
      w-0 group-hover/link:w-2 h-[1px]
      bg-orange-500 rounded-full
      transition-all duration-300
      opacity-0 group-hover/link:opacity-100
    "
    />
    {children}
  </Link>
);

const socialPlatforms = [
  {
    icon: FaTelegramPlane,
    href: "https://t.me/+3DpHLzc2BfJhOWEx",
  },
  {
    icon: FaXTwitter,
    href: "https://x.com/blipmoney_",
  },
  {
    icon: FaYoutube,
    href: "https://www.youtube.com/@BlipMoney",
  },

  {
    icon: FaLinkedin,
    href: "https://www.linkedin.com/company/blipmoneyofficial/",
  },
];

export const Footer = () => {
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef(null);

  // Intersection Observer to trigger entrance animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }, // Triggers when 10% of the component is visible
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Automated glow cycle synchronized with the pulse (Total cycle: 3s, Glow duration: 2s)
  useEffect(() => {
    const pulseCycle = setInterval(() => {
      setIsActive(true);
      setTimeout(() => setIsActive(false), 2000);
    }, 3000);
    return () => clearInterval(pulseCycle);
  }, []);

  return (
    <footer
      ref={footerRef}
      className="w-full bg-[#FAF8F5] dark:bg-[#050505] text-black dark:text-white font-sans overflow-hidden selection:bg-[#ff6b35]/20"
    >
      {/* <div className="max-w-7xl mx-auto px-6 pt-24 pb-16 lg:pt-32 lg:pb-24"> */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24">
          {/* LEFT SIDE: THE FUTURISTIC PULSE DIAL */}
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
                className={`absolute w-24 h-24 rounded-full border border-gray-400 dark:border-white/30 transition-all duration-[1200ms] delay-150 ease-out ${
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
      bg-white dark:bg-[#080808]
      border-gray-400 dark:border-black
      shadow-[0_10px_40px_rgba(0,0,0,0.15),inset_0_0_25px_rgba(0,0,0,0.08)]
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

              <div className="absolute inset-9 rounded-full border border-gray-400/70 dark:border-white/15"></div>
              <div className="absolute inset-18 rounded-full border border-gray-400/50 dark:border-white/10 opacity-70"></div>

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
                      ? "h-3 bg-gray-500 dark:bg-zinc-500"
                      : "h-1.5 bg-gray-400 dark:bg-zinc-700"
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
        border border-gray-400 dark:border-white/20
        z-30 transition-shadow duration-1000 ${
          isActive ? "shadow-[0_0_14px_rgba(249,115,22,0.6)]" : ""
        }`}
              />
            </div>
          </div>

          {/* RIGHT SIDE: CLEAN TEXT CONTENT */}
          <div
            className={`flex-1 text-center lg:text-left transition-all duration-[1200ms] delay-200 ease-out ${
              isVisible
                ? "opacity-100 translate-x-0 blur-0"
                : "opacity-0 translate-x-20 blur-xl"
            }`}
          >
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tighter mb-3 leading-[0.9]">
              <span className="text-black dark:text-white">Join the</span>{" "}
              <br />
              <span className="text-black/80 dark:text-white/80">Movement</span>
            </h2>
            <p className="text-sm lg:text-base text-black dark:text-zinc-500 max-w-md mb-6 leading-relaxed font-light">
              Simple, fast, and secure financial infrastructure for modern
              blip.money businesses and individuals. is how money moves now.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
              {/* <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-zinc-800 hover:border-black/20 dark:hover:border-white/20 rounded-full transition-all text-[10px] tracking-[0.2em] uppercase font-bold text-black/60 dark:text-zinc-400 hover:text-black dark:hover:text-white group">
                <Slack className="w-3.5 h-3.5 text-black/50 dark:text-zinc-500 group-hover:text-black dark:group-hover:text-white transition-colors" />
                Get Support
              </button> */}
              <CTAButton to="/contact" className="w-[220px] h-[48px]">
                Get Support
              </CTAButton>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER LINKS GRID */}
      <div
        className={`border-t border-black/5 dark:border-white/5 transition-all duration-[1200ms] delay-300 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Protocol */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-black/80 dark:text-white/80">
                Protocol
              </h4>
              <ul className="space-y-2">
                <li>
                  <FooterLink to="/how-it-works">How It Works</FooterLink>
                </li>
                <li>
                  <FooterLink to="/tokenomics">Tokenomics</FooterLink>
                </li>
                <li>
                  <FooterLink to="/whitepaper">Whitepaper</FooterLink>
                </li>
                {/* <li>
                  <FooterLink to="/docs">Documentation</FooterLink>
                </li> */}
                {/* <li>
                  <FooterLink to="/changelog">Changelog</FooterLink>
                </li> */}
              </ul>
            </div>

            {/* Use Cases */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-black/80 dark:text-white/80">
                Use Cases
              </h4>
              <ul className="space-y-2">
                <li>
                  <FooterLink to="/use-cases/freelancers">
                    Freelancers
                  </FooterLink>
                </li>
                <li>
                  <FooterLink to="/use-cases/otc-traders">
                    OTC Traders
                  </FooterLink>
                </li>
                <li>
                  <FooterLink to="/use-cases/e-commerce">E-Commerce</FooterLink>
                </li>
                <li>
                  <FooterLink to="/use-cases/remittance">
                    Remittances
                  </FooterLink>
                </li>
                <li>
                  <FooterLink to="/merchant">Merchants</FooterLink>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-black/80 dark:text-white/80">
                Resources
              </h4>
              <ul className="space-y-2">
                <li>
                  <FooterLink to="/blog">Blog</FooterLink>
                </li>
                <li>
                  <FooterLink to="/research">Research</FooterLink>
                </li>
                <li>
                  <FooterLink to="/faq">FAQ</FooterLink>
                </li>
                <li>
                  <FooterLink to="/glossary">Glossary</FooterLink>
                </li>
                <li>
                  <FooterLink to="/compare">Compare</FooterLink>
                </li>
              </ul>
            </div>

            {/* Markets */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-black/80 dark:text-white/80">
                Markets
              </h4>
              <ul className="space-y-2">
                <li>
                  <FooterLink to="/crypto-to-aed">Crypto to AED</FooterLink>
                </li>
                <li>
                  <FooterLink to="/btc-to-aed">BTC to AED</FooterLink>
                </li>
                <li>
                  <FooterLink to="/usdt-vs-usdc">USDT vs USDC</FooterLink>
                </li>
                <li>
                  <FooterLink to="/buy-usdt-dubai">Buy USDT Dubai</FooterLink>
                </li>
                <li>
                  <FooterLink to="/crypto-otc-dubai">
                    Crypto OTC Dubai
                  </FooterLink>
                </li>
                <li>
                  <FooterLink to="/bitcoin-price-uae">
                    Bitcoin Price UAE
                  </FooterLink>
                </li>
                <li>
                  <FooterLink to="/crypto-tax-uae">Crypto Tax UAE</FooterLink>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-black/80 dark:text-white/80">
                Company
              </h4>
              <ul className="space-y-2">
                <li>
                  <FooterLink to="/about">About</FooterLink>
                </li>
                <li>
                  <FooterLink to="/press">Press</FooterLink>
                </li>
                <li>
                  <FooterLink to="/community">Community</FooterLink>
                </li>
                <li>
                  <FooterLink to="/waitlist">Waitlist</FooterLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM FOOTER BAR */}
      <div
        className={`border-t border-black/5 dark:border-white/5 px-6 py-10 bg-white dark:bg-[#030303] transition-opacity duration-1000 delay-500 ${isVisible ? "opacity-100" : "opacity-0"}`}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex flex-col md:flex-row items-center gap-8 text-[13.5px] text-black/60 dark:text-zinc-600 uppercase tracking-widest font-medium">
            <span>© {new Date().getFullYear()} blip.money</span>
            <div className="flex items-center gap-8">
              <a
                href="#"
                className="hover:text-black dark:hover:text-white transition-colors"
              >
                Compliance
              </a>
              <Link
                to="/legal/:tab"
                className="hover:text-black dark:hover:text-white transition-colors"
              >
                Legal
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-6">
            {socialPlatforms.map((platform, i) => {
              const Icon = platform.icon;

              return (
                <a
                  key={i}
                  href={platform.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon
                    className="w-5 h-5 text-black/90 dark:text-white/90
      hover:text-black hover dark:hover:text-white"
                  />
                </a>
              );
            })}
          </div>
          <div className="flex items-center gap-3 text-[14.5px] text-black/60 dark:text-zinc-500 group cursor-default uppercase tracking-widest font-bold">
            <div className="relative">
              <div className="w-5 h-5 bg-[#ff6b35]/10 rounded-sm flex items-center justify-center transition-all group-hover:bg-[#ff6b35] group-hover:scale-110">
                <Zap
                  size={11}
                  className="text-[#ff6b35] transition-colors group-hover:text-white dark:group-hover:text-black fill-current"
                />
              </div>
              <div className="absolute inset-0 bg-[#ff6b35]/10 blur-md rounded-full group-hover:opacity-100 opacity-0 transition-opacity"></div>
            </div>
            <span>Fast. Simple. Blip.</span>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes dash {
          0% { stroke-dashoffset: 180; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { stroke-dashoffset: -180; opacity: 0; }
        }
      `,
        }}
      />

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

const SocialIcon = ({ icon }) => (
  <a
    href="#"
    className="text-black/60 dark:text-zinc-600 hover:text-black dark:hover:text-white transition-all transform hover:scale-125 active:scale-90"
  >
    {icon}
  </a>
);
