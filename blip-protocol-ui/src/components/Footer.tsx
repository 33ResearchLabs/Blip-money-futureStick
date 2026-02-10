import { motion } from "framer-motion";
import { Twitter, Send, Mail, Youtube, ArrowUpRight } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { sounds } from "@/lib/sounds";

/* ============================================
   LINEAR-INSPIRED FOOTER
   Minimal, refined, deeply interactive
   ============================================ */

const Logo = () => {
  return (
    <Link
      to="/"
      className="flex items-center gap-2.5 group"
      onClick={() => {
        sounds.click();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      <div className="flex items-center gap-2 ">
        {/* Dot */}

        {/* Text */}
        <span className="text-2xl font-semibold tracking-tight">
          <span className="text-black dark:text-white">blip</span>
          <span className="text-black dark:text-white">.</span>
          <span className="text-black dark:text-white">money</span>
        </span>
      </div>
    </Link>
  );
};

const SocialLink = ({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: any;
  label: string;
}) => {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-9 h-9 rounded-lg flex items-center justify-center bg-black/5 dark:bg-[#18181B] border border-black/10 dark:border-[rgba(255,255,255,0.06)] text-gray-500 dark:text-[#71717A] hover:text-black dark:hover:text-white hover:border-black/20 dark:hover:border-[rgba(255,255,255,0.12)] transition-all"
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onMouseEnter={() => sounds.hover()}
      onClick={() => sounds.click()}
      aria-label={label}
    >
      <Icon className="w-4 h-4 text-black dark:text-white" />
    </motion.a>
  );
};

const FooterLink = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => {
  return (
    <NavLink
      to={to}
      onClick={() => sounds.click()}
      onMouseEnter={() => sounds.hover()}
      className={({ isActive }) => `
        group flex items-center gap-1 text-[13px] transition-colors
        ${isActive ? "text-black dark:text-white" : "text-gray-500 dark:text-[#71717A] hover:text-gray-700 dark:hover:text-[#A1A1AA]"}
      `}
    >
      {children}
    </NavLink>
  );
};

const FooterColumn = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="space-y-3">
      <h4 className="text-[11px] font-bold uppercase tracking-[0.1em] text-black/80 dark:text-white/80">
        {title}
      </h4>
      <ul className="space-y-2">{children}</ul>
    </div>
  );
};

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-black/10 dark:border-[rgba(255,255,255,0.06)] bg-white dark:bg-black">
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-16">
          {/* Brand */}
          <div className="col-span-4 lg:col-span-2 space-y-4">
            <Logo />
            <p className="text-[13px] text-gray-500 dark:text-[#71717A] leading-relaxed max-w-xs">
              The non-custodial settlement protocol for instant global payments.
            </p>
            <div className="flex items-center gap-2">
              <SocialLink
                href="https://x.com/blipmoney_"
                icon={Twitter}
                label="Twitter"
              />
              <SocialLink
                href="https://t.me/+3DpHLzc2BfJhOWEx"
                icon={Send}
                label="Telegram"
              />
              <SocialLink
                href="https://www.youtube.com/@BlipMoney"
                icon={Youtube}
                label="YouTube"
              />
              <SocialLink
                href="https://mail.google.com/mail/?view=cm&fs=1&to=support@blip.money&su=Contact%20Blip%20Money&body=Hello%20Team,%0A%0AI%20would%20like%20to%20get%20in%20touch.%0A%0AThanks"
                icon={Mail}
                label="Email"
              />
            </div>
          </div>

          {/* Product */}
          <FooterColumn title="Product">
            <li>
              <FooterLink to="/how-it-works">How It Works</FooterLink>
            </li>
            <li>
              <FooterLink to="/rewards">Rewards</FooterLink>
            </li>
            <li>
              <FooterLink to="/tokenomics">Tokenomics</FooterLink>
            </li>
            <li>
              <FooterLink to="/waitlist">Waitlist</FooterLink>
            </li>
          </FooterColumn>

          {/* Resources */}
          <FooterColumn title="Resources">
            <li>
              <a
                href="/whitepaper.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sounds.click()}
                onMouseEnter={() => sounds.hover()}
                className="group flex items-center gap-1 text-[13px] text-gray-500 dark:text-[#71717A] hover:text-gray-700 dark:hover:text-[#A1A1AA] transition-colors"
              >
                Whitepaper
                <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </li>
            <li>
              <FooterLink to="/blog">Blog</FooterLink>
            </li>
            <li>
              <FooterLink to="/contact">Contact</FooterLink>
            </li>
          </FooterColumn>

          {/* Legal */}
          <FooterColumn title="Legal">
            <li>
              <FooterLink to="/privacy">Privacy</FooterLink>
            </li>
            <li>
              <FooterLink to="/terms">Terms</FooterLink>
            </li>
            <li>
              <FooterLink to="/cookies">Cookies</FooterLink>
            </li>
            <li>
              <FooterLink to="/gdpr">GDPR</FooterLink>
            </li>
          </FooterColumn>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-black/10 dark:border-[rgba(255,255,255,0.06)]">
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 py-4
                  flex flex-col items-center gap-2
                  sm:flex-row sm:justify-between sm:items-center"
        >
          {/* Left text */}
          <p className="text-[12px] text-gray-500 dark:text-[#52525B] text-center sm:text-left">
            © {currentYear} Blip.money. All rights reserved.
          </p>

          {/* Right text */}
          <div className="text-[11px] text-gray-500 dark:text-[#52525B] flex items-center gap-2 sm:pr-32">
            <span className="w-1 h-1 rounded-full bg-[#ff6b35] " />
            Built on Solana
          </div>
        </div>
      </div>
    </footer>
  );
};
