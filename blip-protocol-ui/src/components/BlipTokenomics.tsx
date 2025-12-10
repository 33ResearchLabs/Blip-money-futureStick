import React, { useState, useEffect, useMemo } from "react";
import {
  Wallet,
  Flame,
  Activity,
  Zap,
  Users,
  Lock,
  TrendingUp,
  Percent,
  RefreshCw,
  ShoppingBag,
  Layers,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/pages/Index";
import { useLocation, useNavigate } from "react-router-dom";

export const BlipTokenomics = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSegment, setActiveSegment] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  console.log(location);
  useEffect(() => {
    const pathname = location.pathname;
    const hash = location.hash;

    if (pathname === "/tokenomics" && hash) {
      // Remove the '#' from "#section1"
      const id = hash.replace("#", "");
      navigate("/", { replace: true, state: { redirectHash: hash } });
      // Wait for DOM to paint
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 50);
    }
  }, [location.pathname, location.hash]);

  // RESTRICTED PREMIUM PALETTE
  // Main: Neon Green, Black, White. Accent: Muted Orange/Yellow.
  const colors = {
    ecosystem: "#2BFF88", // Primary Neon Green
    liquidity: "#00C2FF", // Deep Cyber Teal (Cool tone)
    airdrop: "#FFFFFF", // Pure White (High contrast)
    team: "#FFB743", // Muted Gold/Orange (Strategic accent)
    advisers: "#FCD34D", // Lighter Gold
    partners: "#9CA3AF", // Cool Grey (Background element)
    treasury: "#4B5563", // Dark Grey (Recessive)
  };

  const allocationData = [
    { label: "Ecosystem Rewards", value: 30, color: colors.ecosystem },
    { label: "LP, MM & Early Inv.", value: 25, color: colors.liquidity },
    { label: "Airdrop & Adoption", value: 10, color: colors.airdrop },
    { label: "Team (3y Vest)", value: 10, color: colors.team },
    { label: "Partnerships", value: 10, color: colors.partners },
    { label: "Treasury", value: 10, color: colors.treasury },
    { label: "Advisers", value: 5, color: colors.advisers },
  ];

  // Chart Logic
  const chartData = useMemo(() => {
    const months = 73;
    const data = [];
    const categories = [
      { id: "ecosystem", color: colors.ecosystem, max: 300 },
      { id: "liquidity", color: colors.liquidity, max: 250 },
      { id: "airdrop", color: colors.airdrop, max: 100 },
      { id: "team", color: colors.team, max: 100 },
      { id: "partners", color: colors.partners, max: 100 },
      { id: "treasury", color: colors.treasury, max: 100 },
      { id: "advisers", color: colors.advisers, max: 50 },
    ];

    for (let m = 0; m < months; m++) {
      let cumulative = 0;
      let monthValues: any = { month: m };
      categories.forEach((cat) => {
        let progress = 0;
        if (cat.id === "liquidity") progress = Math.min(1, (m + 5) / 25);
        else if (cat.id === "team")
          progress = m < 12 ? 0 : Math.min(1, (m - 12) / 36);
        else if (cat.id === "advisers")
          progress = m < 6 ? 0 : Math.min(1, (m - 6) / 24);
        else progress = Math.min(1, m / 72);

        const val = cat.max * progress;
        monthValues[`${cat.id}_y1`] = cumulative;
        monthValues[`${cat.id}_y2`] = cumulative + val;
        cumulative += val;
      });
      monthValues.total = cumulative;
      data.push(monthValues);
    }
    return { data, categories };
  }, [colors]);

  return (
    <div className="min-h-screen bg-[#020202] text-white font-sans overflow-x-hidden selection:bg-[#2BFF88] selection:text-black">
      <div className="py-6">
        {" "}
        <Navbar />
      </div>
      {/* --- ATMOSPHERE: Deep & Minimal --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Subtle Green Glow Top Left */}
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-[#004422] opacity-30 blur-[150px] rounded-full"></div>
        {/* Very Subtle Orange Glow Bottom Right */}
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[#331a00] opacity-20 blur-[150px] rounded-full"></div>
      </div>

      <style>{`
        /* Glass Panel - Minimal & Sharp */
        .glass-panel {
          background: rgba(255, 255, 255, 0.015);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
        }
        
        .glass-panel-hover:hover {
          background: rgba(255, 255, 255, 0.03);
          border-color: rgba(43, 255, 136, 0.3); /* Green Glow Border */
          transform: translateY(-2px);
          box-shadow: 0 10px 40px -10px rgba(43, 255, 136, 0.1);
        }

        /* Typography */
        .hero-glow {
          text-shadow: 0 0 80px rgba(43, 255, 136, 0.3);
        }
        
        .section-title-glow {
          text-shadow: 0 0 30px rgba(255, 255, 255, 0.1);
        }

        /* Utilities */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 8s ease-in-out infinite; }
        
        .animate-pulse-slow { animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}</style>

      <div
        className={`relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24 transition-all duration-1000 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* 1. HERO SECTION: Minimal & Massive */}
        <section className="mb-24 sm:mb-32 md:mb-40 lg:mb-48 text-center relative max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 sm:gap-3 mb-8 sm:mb-10 md:mb-12 px-4 sm:px-5 py-2 rounded-full border border-[#2BFF88]/20 bg-[#2BFF88]/5 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#2BFF88] animate-pulse"></span>
            <span className="text-xs font-bold tracking-[0.2em] text-[#2BFF88] uppercase">
              Fixed Supply 
            </span>
          </div><br></br>

          {/* Main Number */}
          <div className="relative inline-block group cursor-default mb-6">
            {/* Spark Dot Animation */}
            <div className="absolute -top-4 -right-8 animate-float">
              <div className="w-2 h-2 bg-[#FFB743] rounded-full shadow-[0_0_15px_#FFB743]"></div>
            </div>
        
            <h1 className="text-4xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-6xl leading-none  tracking-tighter text-white hero-glow select-none">
              1,000,000,000
            </h1>
          </div>

          <div className="flex items-center justify-center gap-4 text-xl sm:text-2xl md:text-3xl font-light tracking-[0.2em] sm:tracking-[0.3em] uppercase opacity-80">
            <span className="text-white">BLIP</span>
            <span className="text-[#FFB743] text-base sm:text-lg align-middle">
            
            </span>
            <span className="text-white">TOKENS</span>
          </div>
        </section>

        {/* 2. DISTRIBUTION: Clean & Architectural */}
        <section className="grid lg:grid-cols-2 gap-12 sm:gap-16 md:gap-20 lg:gap-24 items-center mb-24 sm:mb-32 md:mb-40 lg:mb-52 max-w-7xl mx-auto">
          {/* Visual Side */}
          <div className="relative order-2 lg:order-1 flex justify-center">
            <div className="w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[450px] md:h-[450px] lg:w-[500px] lg:h-[500px] relative">
              {/* Minimal Rings */}
              <div className="absolute inset-[-40px] border border-white/5 rounded-full opacity-50"></div>

              <svg
                viewBox="0 0 100 100"
                className="w-full h-full transform -rotate-90"
              >
                {(() => {
                  let offset = 0;
                  return allocationData.map((item, i) => {
                    const dashArray = item.value;
                    const radius = 40;
                    const circumference = 2 * Math.PI * radius;
                    const strokeDasharray = `${
                      (dashArray / 100) * circumference
                    } ${circumference}`;
                    const strokeDashoffset =
                      -1 * (offset / 100) * circumference;
                    offset += item.value;
                    const isActive = activeSegment === i;

                    return (
                      <circle
                        key={i}
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="transparent"
                        stroke={item.color}
                        strokeWidth={isActive ? "4" : "2.5"} // Thinner, more elegant lines
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="butt" // Sharp edges for futuristic look
                        className="transition-all duration-300 cursor-pointer hover:opacity-100"
                        style={{
                          opacity:
                            activeSegment !== null && !isActive ? 0.2 : 0.9,
                          filter: isActive
                            ? `drop-shadow(0 0 8px ${item.color})`
                            : "none",
                        }}
                        onMouseEnter={() => setActiveSegment(i)}
                        onMouseLeave={() => setActiveSegment(null)}
                      />
                    );
                  });
                })()}
              </svg>
              {/* Center Hub */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-gray-500 text-xs tracking-widest uppercase mb-2">
                  Allocation
                </span>
                <span className="text-5xl font-light text-white tracking-tighter">
                  100%
                </span>
              </div>
            </div>
          </div>

          {/* List Side - Glass Cards with Pins */}
          <div className="order-1 lg:order-2">
            <h2 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl  text-white mb-8 sm:mb-12 md:mb-16 tracking-tight section-title-glow">
              Token <span className="text-gray-500 font-light">Split</span>
            </h2>
            <div className="space-y-4">
              {allocationData.map((item, idx) => (
                <div
                  key={idx}
                  onMouseEnter={() => setActiveSegment(idx)}
                  onMouseLeave={() => setActiveSegment(null)}
                  className={`
                    relative pl-8 pr-6 py-6 rounded-r-xl rounded-l-sm glass-panel transition-all duration-300 cursor-pointer group flex items-center justify-between
                    hover:bg-white/5
                  `}
                >
                  {/* Neon Pin Strip */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-[4px] rounded-l-sm transition-all duration-300 group-hover:w-[6px] group-hover:shadow-[0_0_15px_currentColor]"
                    style={{ backgroundColor: item.color, color: item.color }}
                  ></div>

                  <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-light text-gray-200 group-hover:text-white transition-colors">
                    {item.label}
                  </span>
                  <span
                    className="text-xl sm:text-2xl md:text-3xl font-medium tracking-tight"
                    style={{ color: item.color }}
                  >
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. UTILITY SECTION: Large, Airy, Elegant */}
        <section className="mb-24 sm:mb-32 md:mb-40 lg:mb-52 max-w-7xl mx-auto">
          <div className="mb-12 sm:mb-16 md:mb-20 flex flex-col md:flex-row justify-between items-end">
            <div>
              <h2 className="text-1xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl  text-white mb-4 section-title-glow">
                Utility{" "}
                <span className="text-[#FFB743] text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-[0]">
                  .
                </span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-500 max-w-xl font-light mt-4 sm:mt-6">
                Engineered for maximum ecosystem velocity.
              </p>
            </div>
            <Activity
              className="text-[#2BFF88] w-12 h-12 opacity-50 hidden md:block"
              strokeWidth={1}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {[
              {
                title: "Cashback",
                icon: <RefreshCw size={32} />,
                desc: "Instant rewards.",
              },
              {
                title: "Merchants",
                icon: <ShoppingBag size={32} />,
                desc: "0% Partner fees.",
              },
              {
                title: "Discounts",
                icon: <Percent size={32} />,
                desc: "Trading fee reduction.",
              },
              {
                title: "Staking",
                icon: <Layers size={32} />,
                desc: "Yield multiplier.",
              },
              {
                title: "Liquidity",
                icon: <Activity size={32} />,
                desc: "MM incentives.",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="glass-panel p-6 sm:p-8 rounded-2xl glass-panel-hover group min-h-[220px] sm:min-h-[260px] md:min-h-[280px] flex flex-col justify-between relative overflow-hidden"
              >
                {/* Soft Light Pool */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#2BFF88] opacity-[0.03] blur-[40px] rounded-full group-hover:opacity-[0.08] transition-opacity"></div>

                <div className="relative z-10">
                  <div className="mb-6 sm:mb-8 md:mb-10 text-gray-400 group-hover:text-[#2BFF88] transition-colors duration-500">
                    {React.cloneElement(card.icon, { strokeWidth: 1 })}
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-light text-white mb-2 sm:mb-3">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    {card.desc}
                  </p>
                </div>

                {/* Energy Accent Line */}
                <div className="w-8 h-[2px] bg-[#FFB743] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. DEFLATION: Minimal & Impactful */}
        <section className="mb-24 sm:mb-32 md:mb-40 lg:mb-52 max-w-7xl mx-auto">
          <h2 className="text-1xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-white mb-12 sm:mb-16 md:mb-20 text-center section-title-glow">
            Deflationary <span className="font-light text-gray-600">Model</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "Buyback",
                icon: <TrendingUp size={40} />,
                sub: "Protocol Revenue",
              },
              {
                title: "Burn",
                icon: <Flame size={40} />,
                sub: "Permanent Removal",
              },
              {
                title: "Volume",
                icon: <Zap size={40} />,
                sub: "Dynamic Events",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="glass-panel p-8 sm:p-10 md:p-12 rounded-3xl flex flex-col items-center text-center glass-panel-hover group"
              >
                <div className="mb-6 sm:mb-8 p-4 sm:p-5 md:p-6 rounded-full border border-white/5 bg-black/20 group-hover:border-[#FFB743]/30 transition-colors duration-500">
                  {React.cloneElement(card.icon, {
                    className:
                      "text-white group-hover:text-[#FFB743] transition-colors w-8 h-8 sm:w-10 sm:h-10",
                    strokeWidth: 1,
                  })}
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-light text-white mb-2 sm:mb-3">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-widest">
                  {card.sub}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. UNLOCK SCHEDULE: Pure Curve */}
        <section className="relative max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 sm:mb-16 md:mb-20 px-4">
            <div>
              <h2 className="text-1xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-white mb-4 sm:mb-6 section-title-glow">
                Emissions
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-500 font-light">
                72-Month Vesting Curve
              </p>
            </div>
          </div>

          <div className="w-full glass-panel rounded-[20px] sm:rounded-[30px] p-4 sm:p-6 md:p-12 lg:p-16 overflow-hidden relative">
            {/* Chart Atmosphere - subtle green floor */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#2BFF88]/5 to-transparent"></div>

            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/9]">
              <svg
                viewBox="0 0 1000 500"
                className="w-full h-full overflow-visible"
              >
                <defs>
                  {chartData.categories.map((cat) => (
                    <linearGradient
                      key={cat.id}
                      id={`grad-${cat.id}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={cat.color}
                        stopOpacity="0.4"
                      />
                      <stop
                        offset="100%"
                        stopColor={cat.color}
                        stopOpacity="0"
                      />
                    </linearGradient>
                  ))}
                </defs>

                {/* Areas */}
                {chartData.categories.map((cat, i) => {
                  const scaleX = (val) => (val / 72) * 1000;
                  const scaleY = (val) => 500 - (val / 1000) * 500;
                  let pathD = `M 0 500`;
                  chartData.data.forEach((d) => {
                    const x = scaleX(d.month);
                    const y = scaleY(d[`${cat.id}_y2`]);
                    pathD += ` L ${x} ${y}`;
                  });
                  pathD += ` L 1000 500 Z`;

                  return (
                    <path
                      key={cat.id}
                      d={pathD}
                      fill={`url(#grad-${cat.id})`}
                      className="transition-opacity duration-300 hover:opacity-80"
                    />
                  );
                })}

                {/* The White Line */}
                <path
                  d={(() => {
                    let d = `M 0 500`;
                    chartData.data.forEach((item) => {
                      const x = (item.month / 72) * 1000;
                      const y = 500 - (item.total / 1000) * 500;
                      d += ` L ${x} ${y}`;
                    });
                    return d;
                  })()}
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  style={{
                    filter: "drop-shadow(0 0 10px rgba(255,255,255,0.3))",
                  }}
                />

                {/* Milestones - Clean & Minimal */}
                {[0, 12, 24, 36, 48, 60, 72].map((m) => {
                  const x = (m / 72) * 1000;
                  return (
                    <g key={m}>
                      <line
                        x1={x}
                        y1="500"
                        x2={x}
                        y2="510"
                        stroke="#333"
                        strokeWidth="1"
                      />
                      <text
                        x={x}
                        y="530"
                        textAnchor="middle"
                        fill="#666"
                        fontSize="12"
                        fontFamily="sans-serif"
                      >
                        M{m}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 sm:mt-28 md:mt-40 border-t border-white/5 pt-8 sm:pt-10 md:pt-12 flex flex-col md:flex-row justify-between items-center pb-12 sm:pb-16 md:pb-20 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6 md:mb-0">
            <div className="w-2 h-2 rounded-full bg-[#2BFF88]"></div>
            <span className="text-lg sm:text-xl font-light text-white tracking-widest">
              BLIP<span className="text-gray-600">.MONEY</span>
            </span>
          </div>
          <div className="text-xs text-gray-600 tracking-[0.2em] uppercase">
            P2P Settlement Protocol
          </div>
        </footer>
      </div>
    </div>
  );
};

export default BlipTokenomics;
