// import React from "react";

// const ComingSoon = () => {
//   return (
//     <>
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-black via-green-900 to-black text-white px-6 relative">
//         {/* Responsive Back Button */}
//         <a
//           href="/"
//           className="
//             absolute top-4
//             left-4
//             sm:top-6 sm:left-6
//             md:top-6 md:left-10
//             lg:top-8 lg:left-20
//             flex items-center space-x-2
//             px-4 py-2
//             rounded-full
//             bg-green-800/70 hover:bg-green-700
//             backdrop-blur
//             transition
//             text-sm font-semibold
//           "
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-5 w-5 text-green-400"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//             strokeWidth={2}
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M15 19l-7-7 7-7"
//             />
//           </svg>
//           <span>Back</span>
//         </a>

//         <div className="max-w-lg text-center space-y-6">
//           {/* Gradient "Coming Soon" badge */}
//           <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 text-black font-bold uppercase tracking-wide text-xs">
//             Coming Soon
//           </span>

//           {/* Main heading */}
//           <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
//             Exciting Features <br /> Are On The Way
//           </h1>

//           {/* Subtext */}
//           <p className="text-gray-300 text-lg">
//             We're working hard to bring you something awesome. Stay tuned for
//             updates and new releases.
//           </p>

//           {/* Button with green gradient */}
//           <a href="/comming-soon">
//             <button className="mt-4 px-8 py-3 rounded-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 transition duration-300 font-semibold shadow-lg">
//               Notify Me
//             </button>
//           </a>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ComingSoon;

import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  ArrowRight,
  Send,
  Users,
  Twitter,
  Briefcase,
  Mail,
  Zap,
  Lock,
  X,
  Menu,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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

// export const Navbar = () => {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [language, setLanguage] = useState("en");

//   return (
//     <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-white/5 bg-black/60 supports-[backdrop-filter]:bg-black/40">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
//         <a href="/" className="flex items-center gap-2">
//           <div className="relative">
//             <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#2BFF88] shadow-[0_0_10px_#2BFF88] relative z-10" />
//             <div className="absolute inset-0 bg-[#2BFF88] rounded-full animate-ping opacity-50" />
//           </div>
//           <span className="text-xl sm:text-2xl font-bold tracking-tight text-white">
//             Blip.<span className="text-[#2BFF88]">money</span>
//           </span>
//         </a>

//         {/* Desktop Menu */}
//         <div className="hidden lg:flex items-center gap-8">
//           <div className="flex items-center gap-8 text-sm font-medium text-gray-400">
//             <a href="/" className="hover:text-[#2BFF88] transition-colors">
//               Protocol
//             </a>

//             <a href="/" className="hover:text-[#2BFF88] transition-colors">
//               Merchants
//             </a>
//             <a href="/" className="hover:text-[#2BFF88] transition-colors">
//               PeopleBank
//             </a>

//              <NavLink
//                            to="/rewards"
//                            className={({ isActive }) =>
//                              `transition-colors ${
//                                isActive
//                                  ? "text-[#2BFF88] font-semibold"
//                                  : "hover:text-[#2BFF88]"
//                              }`
//                            }
//                          >
//                            Rewards
//                          </NavLink>

//             <NavLink
//               to="/tokenomics"
//               className={({ isActive }) =>
//                 `transition-colors ${
//                   isActive
//                     ? "text-[#2BFF88] font-semibold"
//                     : "hover:text-[#2BFF88]"
//                 }`
//               }
//             >
//               Tokenomics
//             </NavLink>
//           </div>{" "}
//           <LanguageSwitcher language={language} setLanguage={setLanguage} />
//           {/* <a href="/coming-soon">
//             <button className="px-5 py-2 rounded-full border border-white/10 text-white text-sm hover:border-[#2BFF88] hover:shadow-[0_0_15px_rgba(43,255,136,0.3)] transition-all bg-black/50 backdrop-blur-sm group">
//               <span className="group-hover:text-[#2BFF88] transition-colors">
//                 Coming Soon
//               </span>
//             </button>
//           </a> */}
//         </div>

//         {/* Mobile Menu Button */}
//         <button
//           onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//           className="lg:hidden p-2 text-white hover:text-[#2BFF88] transition-colors"
//           aria-label="Toggle menu"
//         >
//           {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
//         </button>

//         {/* Mobile Menu */}
//         <AnimatePresence>
//           {mobileMenuOpen && (
//             <motion.div
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               className="lg:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/10"
//             >
//               <div className="flex flex-col p-6 space-y-4">
//                 <a
//                   href="#protocol"
//                   onClick={() => setMobileMenuOpen(false)}
//                   className="text-gray-400 hover:text-[#2BFF88] transition-colors text-lg py-2"
//                 >
//                   Protocol
//                 </a>
//                 <a
//                   href="#merchants"
//                   onClick={() => setMobileMenuOpen(false)}
//                   className="text-gray-400 hover:text-[#2BFF88] transition-colors text-lg py-2"
//                 >
//                   Merchants
//                 </a>
//                 <a
//                   href="#peoplebank"
//                   onClick={() => setMobileMenuOpen(false)}
//                   className="text-gray-400 hover:text-[#2BFF88] transition-colors text-lg py-2"
//                 >
//                   PeopleBank
//                 </a>
//                 <a
//                   href="/tokenomics"
//                   className="hover:text-[#2BFF88] transition-colors"
//                 >
//                   Tokenomics
//                 </a>
//                 <a href="/coming-soon">
//                   <button className="w-full px-5 py-3 rounded-full border border-white/10 text-white hover:border-[#2BFF88] hover:shadow-[0_0_15px_rgba(43,255,136,0.3)] transition-all bg-black/50 backdrop-blur-sm mt-2">
//                     Open App
//                   </button>
//                 </a>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </nav>
//   );
// };

// --- Canvas Grid Background Component (Replacing Three.js) ---
const NetGridBackground = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Check for context support early
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("2D Canvas context not supported.");
      return;
    }

    let width, height;
    let particles = [];
    // Reduce particle count on smaller screens for better performance
    const particleCount = window.innerWidth > 768 ? 100 : 50;

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.2; // Velocity X
        this.vy = (Math.random() - 0.5) * 0.2; // Velocity Y
        this.radius = Math.random() * 1 + 0.5;
        // Use the neon colors
        this.color = Math.random() > 0.5 ? "#2BFF88" : "#00C8FF";
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    const init = () => {
      resizeCanvas();
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const drawConnections = () => {
      for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const distance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);

          // Connect particles within a certain distance
          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = "#2BFF88"; // Neon green lines
            // Subtle opacity based on distance
            ctx.lineWidth = 0.5;
            ctx.globalAlpha = 0.1 + (1 - distance / 150) * 0.2;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      drawConnections();

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    init();
    animate();

    window.addEventListener("resize", init);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", init);
    };
  }, []);

  return (
    <>
      {/* The Canvas element for the particle effect */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full -z-20 opacity-40"
      />

      {/* Static Glow effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-7xl max-h-7xl rounded-full bg-[#2BFF88]/10 blur-[180px] opacity-30 animate-pulse-slow" />
      </div>
      <style>
        {`
                  @keyframes pulse-slow {
                    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
                    50% { transform: translate(-50%, -50%) scale(1.05); opacity: 0.4; }
                  }
                `}
      </style>
    </>
  );
};

// --- Helper Components & Styles ---

// Button component for primary CTAs
const Button = ({
  children,
  primary = false,
  className = "",
  onClick,
  type = "button",
}) => (
  <button
    type={type}
    onClick={onClick}
    className={`
      relative overflow-hidden px-6 py-3 rounded-full font-bold tracking-wide transition-all duration-300 group cursor-pointer text-sm
      ${
        primary
          ? "bg-[#2BFF88] text-black hover:bg-[#1FD96E] hover:shadow-[0_0_24px_rgba(43,255,136,0.5)]"
          : "bg-transparent border border-white/20 text-white hover:border-[#2BFF88] hover:text-[#2BFF88] hover:shadow-[0_0_15px_rgba(43,255,136,0.15)]"
      }
      ${className}
    `}
  >
    <span className="relative z-10 flex items-center justify-center gap-2">
      {children}
    </span>
  </button>
);

// --- Main Waitlist Component ---

const ComingSoon = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // 'success', 'error', 'loading'
  const [hashVar, setHash] = useState(""); // 'success', 'error', 'loading'
  useEffect(() => {
    const { pathname, hash } = location;
    console.log(pathname, hash);
    // 1️⃣ If coming from another page with hash → redirect to home
    if (pathname !== "/" && hash) {
      setHash(hash);
      navigate(
        {
          pathname: "/",
          hash,
        },
        { replace: true }
      );
      return;
    }

    // 2️⃣ On homepage with hash → scroll AFTER render
    if (pathname === "/" && hashVar) {
      navigate(
        {
          pathname: "/",
          hash: hashVar,
        },
        { replace: true }
      );
      const id = hash.replace("#", "");

      const scrollToElement = () => {
        const el = document.getElementById(id);
        if (!el) return false;

        el.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        return true;
      };

      // Try immediately
      if (scrollToElement()) return;

      // Retry after next paint (safe for lazy sections)
      const raf = requestAnimationFrame(() => {
        scrollToElement();
      });

      return () => cancelAnimationFrame(raf);
    }
  }, [location.pathname, location.hash, navigate]);

  const handleWaitlistSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!email || status === "loading") return;

      setStatus("loading");

      // Simulate API call for email submission
      setTimeout(() => {
        if (email.includes("@") && email.length > 5) {
          console.log(`Submitting email: ${email}`);
          setStatus("success");
        } else {
          setStatus("error");
        }
      }, 1500);
    },
    [email, status]
  );

  return (
    <>
      {/* <Navbar /> */}

      <div className="min-h-screen bg-black text-white font-sans overflow-hidden flex flex-col justify-center">
        {/* <button
  onClick={() => navigate(-1)}
  className="
    fixed
    md:top-20 top-6
    md:left-56 left-8
    z-50
    flex items-center gap-2
    px-4 py-2
    rounded-full
    bg-green-800/70 hover:bg-green-700
    backdrop-blur
    transition
    text-sm font-semibold
    text-white
  "
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-green-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
  Back
</button> */}

        <NetGridBackground />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-32 sm:pb-24 grid lg:grid-cols-[3fr_2fr] gap-12 lg:gap-16 items-start">
          {/* --- LEFT COLUMN: HERO CORE & EMAIL FORM --- */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#2BFF88]/40 bg-[#2BFF88]/5 mb-6 shadow-[0_0_10px_rgba(43,255,136,0.2)]">
              <Zap className="w-4 h-4 text-[#2BFF88]" />
              <span className="text-xs font-mono text-gray-300 uppercase tracking-widest">
                PROTOCOL LAUNCH IMMINENT
              </span>
            </div>

            <h1 className="text-4xl sm:text-7xl md:text-8xl lg:text-[90px] font-extrabold tracking-tighter mb-6 leading-none">
              The Protocol.
              <br className="hidden md:block" />
              <span className="mint-gradient-text">Instant Value.</span>
              <br className="hidden md:block" />
              Everywhere.
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-10 max-w-4xl mx-auto lg:mx-0 font-light leading-relaxed">
              Unify global commerce on a decentralized, non-custodial layer.
              Join the exclusive list for Q1 access.
            </p>

            {/* --- EMAIL FORM (LEFT SIDE HIGH-IMPACT) --- */}
            <div className="relative max-w-lg lg:max-w-none w-full mx-auto lg:mx-0 p-1 rounded-[24px] bg-gradient-to-br from-[#2BFF88] to-[#00C8FF] shadow-[0_0_60px_rgba(43,255,136,0.3)] mt-8">
              <div className="p-6 rounded-[22px] bg-black/90 backdrop-blur-md border border-white/10 text-center">
                <h3 className="text-xl font-bold mb-4 flex items-center justify-center lg:justify-start gap-3">
                  <Mail className="w-5 h-5 text-[#2BFF88]" />
                  Secure Priority Access
                </h3>

                <form
                  onSubmit={handleWaitlistSubmit}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <input
                    type="email"
                    placeholder="Enter Email to Lock In Spot"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setStatus(null);
                    }}
                    required
                    className="flex-1 px-5 py-3 rounded-full bg-black border border-white/10 focus:border-[#2BFF88] focus:ring-1 focus:ring-[#2BFF88] text-white placeholder-gray-500 transition-colors text-base"
                    disabled={status === "loading" || status === "success"}
                  />
                  <Button
                    primary
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 text-base"
                    disabled={status === "loading" || status === "success"}
                  >
                    {status === "loading" && (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-black"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Subscribing...
                      </>
                    )}
                    {status === "success" && (
                      <>
                        <Lock className="w-4 h-4" />
                        Secured!
                      </>
                    )}
                    {status === "error" && "Try Again"}
                    {status === null && (
                      <>
                        Join Early as Supporters
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>

                {status === "success" && (
                  <p className="mt-4 text-sm text-[#2BFF88] font-medium">
                    Success! You are locked in for early access and token
                    rewards.
                  </p>
                )}
                {status === "error" && (
                  <p className="mt-4 text-sm text-red-400">
                    Please enter a valid email address.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: FEATURE CARDS & BOOSTS --- */}
          <div className="mt-10 lg:mt-0">
            <h2 className="text-xl font-bold mb-6 text-white text-center lg:text-left">
              Access Channels & Priority Boost
            </h2>

            <div className="flex flex-col gap-6">
              {/* Merchant Section (Top Priority Card) */}
              <div className="relative p-6 rounded-2xl bg-black/70 border border-[#2BFF88]/40 shadow-[0_0_20px_rgba(43,255,136,0.15)] text-left">
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#2BFF88]/15 flex items-center justify-center text-[#2BFF88] border border-[#2BFF88]/50 shadow-[0_0_15px_rgba(43,255,136,0.5)]">
                    <Briefcase size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    Merchant & Liquidity Pool
                  </h3>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  Secure your staking pool and access dedicated developer
                  resources and fee revenue streams.
                </p>
                <a
                  href="https://t.me/+3DpHLzc2BfJhOWEx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <Button
                    primary={false}
                    type={"button"}
                    onClick={() => {}}
                    className="w-full bg-black/50 border-[#2BFF88] text-[#2BFF88] hover:bg-[#2BFF88] hover:text-black"
                  >
                    <Users className="w-4 h-4" />
                    Join Partner Telegram
                  </Button>
                </a>
              </div>

              {/* Social Boosts (Lower Priority Grid) */}
              <div className="grid grid-cols-2 gap-4">
                {/* Follow on X */}
                <a
                  href="https://x.com/blipmoney_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center p-5 rounded-2xl bg-black/50 border border-white/10 hover:border-[#00C8FF]/70 transition-all duration-300 shadow-xl hover:shadow-[0_0_20px_rgba(0,200,255,0.2)] text-center"
                >
                  <div className="w-8 h-8 rounded-full bg-[#00C8FF]/15 flex items-center justify-center text-[#00C8FF] border border-[#00C8FF]/50 mb-2">
                    <Twitter size={16} />
                  </div>
                  <p className="text-sm font-semibold text-white group-hover:text-[#00C8FF]">
                    Follow on X
                  </p>
                  <p className="text-xs text-gray-500">Tier +5 Priority</p>
                </a>

                {/* Join Telegram */}
                <a
                  href="https://t.me/+3DpHLzc2BfJhOWEx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center p-5 rounded-2xl bg-black/50 border border-white/10 hover:border-[#2BFF88]/70 transition-all duration-300 shadow-xl hover:shadow-[0_0_20px_rgba(43,255,136,0.2)] text-center"
                >
                  <div className="w-8 h-8 rounded-full bg-[#2BFF88]/15 flex items-center justify-center text-[#2BFF88] border border-[#2BFF88]/50 mb-2">
                    <Send size={16} />
                  </div>
                  <p className="text-sm font-semibold text-white group-hover:text-[#2BFF88]">
                    Join Community TG
                  </p>
                  <p className="text-xs text-gray-500">Airdrop Qualification</p>
                </a>
              </div>
            </div>
          </div>

          {/* Aesthetic Gradient Style for Mint Text */}
          <style>
            {`
            .mint-gradient-text {
              background-image: linear-gradient(to right, #2BFF88, #00C8FF);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }
            .animate-pulse {
                animation: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
          `}
          </style>
        </div>
      </div>
    </>
  );
};

export default ComingSoon;
