// import React from "react";

// export const Footer = () => {
//   return (
//     <footer className="py-12 border-t border-gray-500  bg-black">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm">
//         <p>
//           © <span id="year">2025</span> Blip.money Protocol. All rights
//           reserved. Bankless. Trustless. Instant. Secure and fully trustworthy.
//         </p>
//       </div>
//     </footer>
//   );
// };

import { Twitter, Send, Mail, Youtube } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="relative border-t border-white/5 bg-black overflow-hidden">
      {/* subtle glow */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -left-24 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-[#00FF94]/20 blur-3xl" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-[#00C8FF]/15 blur-3xl" />
      </div>

      {/* MAIN CONTENT */}
      <div className="relative max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row justify-between gap-12">
        {/* BRAND */}
        <div className="min-w-[180px]  space-y-4 text-center md:text-left -mt-2">
          <Link
            to="#hero"
            className="flex items-center gap-2 justify-center md:justify-start"
            onClick={() => {
              const hero = document.getElementById("hero");
              hero?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-[#2BFF88] shadow-[0_0_10px_#2BFF88]" />
              <div className="absolute inset-0 rounded-full bg-[#2BFF88] animate-pulse opacity-50" />
            </div>
            <span className="text-2xl font-bold text-white">
              Blip.<span className="text-[#2BFF88]">money</span>
            </span>
          </Link>

          <p className="text-sm text-gray-400 leading-relaxed max-w-sm mx-auto">
            Pay with Crypto — Anyone, Anywhere. <br />
            Blip money is the non-custodial settlement protocol for cash, wire,
            and crypto transfers without KYC, secured by DAO escrow.
          </p>

          {/* SOCIAL */}
          <div className="flex items-center gap-3 pt-2 justify-center md:justify-start">
            <a
              href="https://x.com/blipmoney_"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-[#00FF94] hover:border-[#00FF94] transition"
            >
              <Twitter size={16} />
            </a>

            <a
              href="https://t.me/+3DpHLzc2BfJhOWEx"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-[#00FF94] hover:border-[#00FF94] transition"
            >
              <Send size={16} />
            </a>

            <a
              href="https://www.youtube.com/@BlipMoney"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-[#00FF94] hover:border-[#00FF94] transition"
            >
              <Youtube size={16} />
            </a>

            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=blipmoney9@gmail.com&su=Support Request&body=Hello Team"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-[#00FF94] hover:border-[#00FF94] transition"
            >
              <Mail size={16} />
            </a>
          </div>
        </div>

        {/* PRODUCT */}
        <div className="min-w-[180px] text-center md:text-left">
          <h4 className="text-sm font-medium uppercase tracking-widest  mb-2">
            Product
          </h4>
          <ul className="space-y-3 text-sm text-gray-300">
            <li>
              <Link
                to="/how-it-works"
                className="hover:text-[#00FF94] transition"
              >
                How it Works
              </Link>
            </li>
            <li>
              <Link to="/waitlist" className="hover:text-[#00FF94] transition">
                Waitlist
              </Link>
            </li>
            <li>
              <Link
                to="/tokenomics"
                className="hover:text-[#00FF94] transition"
              >
                Tokenomics
              </Link>
            </li>
            <li>
              <Link to="/rewards" className="hover:text-[#00FF94] transition">
                Rewards & Cashback
              </Link>
            </li>
          </ul>
        </div>

        {/* LEGAL */}
        <div className="min-w-[180px] text-center md:text-left">
          <h4 className="text-sm font-medium uppercase tracking-widest  mb-2">
            Legal
          </h4>
          <ul className="space-y-3 text-sm">
            {[
              { to: "/privacy", label: "Privacy Policy" },
              { to: "/terms", label: "Terms of Service" },
              { to: "/cookies", label: "Cookie Policy" },
              { to: "/gdpr", label: "GDPR Compliance" },
            ].map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    isActive
                      ? "text-[#00FF94] font-medium"
                      : "text-gray-300 hover:text-[#00FF94] transition"
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="relative border-t border-white/5">
        <div className="px-6 py-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Blip.money Protocol. All rights reserved.
          Bankless. Trustless. Instant. Secure and fully trustworthy.
        </div>
      </div>
    </footer>
  );
};
