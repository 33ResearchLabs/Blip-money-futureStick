import { useRef, useState, useEffect, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import {
  Flame,
  Activity,
  Zap,
  TrendingUp,
  Percent,
  RefreshCw,
  ShoppingBag,
  Layers,
  ChevronDown,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { SEO } from "@/components";
import { sounds } from "@/lib/sounds";

/* ============================================
   AWARD-WINNING TOKENOMICS PAGE
   Cinematic scroll animations with data visualization
   ============================================ */

const smoothConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };

// Color palette
const colors = {
  ecosystem: "#ff6b35",
  liquidity: "#00C2FF",
  airdrop: "#FFFFFF",
  team: "#FFB743",
  advisers: "#FCD34D",
  partners: "#9CA3AF",
  treasury: "#4B5563",
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

/* ============================================
   SECTION 1: CINEMATIC HERO
   ============================================ */

const HeroSection = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 200]),
    smoothConfig,
  );
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <motion.section
      ref={ref}
      className="relative md:min-h-screen my-12 md:my-0 flex items-center justify-center overflow-hidden"
      style={{ opacity }}
    >
      {/* Background with parallax */}
      <motion.div className="absolute inset-0 z-0" style={{ y, scale }}>
        {/* <div className="relative w-full aspect-[16/9] overflow-hidden rounded-xl">
  <img
    src="https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=2400&auto=format&fit=crop"
    alt="Crypto payments"
    className="absolute inset-0 w-full h-full object-cover"
  />
</div> */}

        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black" />
      </motion.div>

      {/* Grid overlay */}
      <div className="absolute inset-0 z-[1] opacity-[0.03]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, white 1px, transparent 1px),
              linear-gradient(to bottom, white 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-10 backdrop-blur-sm"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          <span className="w-2 h-2 rounded-full bg-[#ff6b35] animate-pulse" />
          <span className="text-[14px] text-white/70 font-medium tracking-wide">
            Fixed Supply
          </span>
        </motion.div>

        {/* Main number */}
        <div className="overflow-hidden mb-6">
          <motion.h1
            initial={{ y: 150 }}
            animate={{ y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-[clamp(2.5rem,10vw,8rem)]
           font-semibold text-white
           leading-[1]
           sm:leading-[0.95]
           tracking-[-0.04em]"
          >
            1,000,000,000
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex items-center justify-center md:gap-4  text-2xl md:text-3xl font-light tracking-[0.2em] uppercase"
        >
          <span className="text-white">BLIP</span>
          <span
            className="text-3xl"
            style={{
              background: "linear-gradient(135deg, #ff6b35 0%, #FFB743 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            •
          </span>
          <span className="text-white/50">TOKENS</span>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="  mt-4 
             flex flex-col items-center gap-3"
        >
          <span className="text-xs text-gray-500 uppercase tracking-[0.2em]">
            Explore
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-5 h-5 text-white/40" />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

/* ============================================
   SECTION 2: DISTRIBUTION CHART
   ============================================ */

const DistributionSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeSegment, setActiveSegment] = useState<number | null>(null);

  return (
    <section ref={ref} className="relative py-32 bg-black overflow-hidden ">
      {/* Background glow */}
      <div className="absolute top-0 left-[-10%] w-[60vw] h-[60vw] bg-white/5 blur-[150px] rounded-full" />
      <div className="absolute bottom-0 right-[-10%] w-[50vw] h-[50vw] bg-[#FFB743]/5 blur-[150px] rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="relative w-[290px] sm:w-[320px] md:w-[420px] aspect-square mx-auto">
              {/* Outer ring */}
              <div className="absolute -inset-9 md:-inset-10 border border-white/5 rounded-full" />

              <svg
                viewBox="0 0 100 100"
                className="w-full h-full transform -rotate-90"
              >
                {(() => {
                  let offset = 0;
                  return allocationData.map((item, i) => {
                    const radius = 40;
                    const circumference = 2 * Math.PI * radius;
                    const strokeDasharray = `${(item.value / 100) * circumference} ${circumference}`;
                    const strokeDashoffset =
                      -1 * (offset / 100) * circumference;
                    offset += item.value;
                    const isActive = activeSegment === i;

                    return (
                      <motion.circle
                        key={i}
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="transparent"
                        stroke={item.color}
                        strokeWidth={isActive ? "4" : "2.5"}
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="butt"
                        initial={{ opacity: 0 }}
                        animate={
                          isInView
                            ? {
                                opacity:
                                  activeSegment !== null && !isActive
                                    ? 0.2
                                    : 0.9,
                              }
                            : {}
                        }
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        style={{
                          filter: isActive
                            ? `drop-shadow(0 0 8px ${item.color})`
                            : "none",
                        }}
                        onMouseEnter={() => {
                          setActiveSegment(i);
                          sounds.hover();
                        }}
                        onMouseLeave={() => setActiveSegment(null)}
                        className="cursor-pointer transition-all duration-300"
                      />
                    );
                  });
                })()}
              </svg>

              {/* Center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-white/40 text-xs tracking-widest uppercase mb-2">
                  Allocation
                </span>
                <span className="text-5xl font-light text-white tracking-tight">
                  100%
                </span>
              </div>
            </div>
          </motion.div>

          {/* List */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <span className="text-xs uppercase tracking-[0.3em] text-white/60 mb-6 block">
                Distribution
              </span>
              <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight">
                Token
                <br />
                <span className="text-white/30">Split.</span>
              </h2>
            </motion.div>

            <div className="space-y-4">
              {allocationData.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 40 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 + idx * 0.08 }}
                  onMouseEnter={() => {
                    setActiveSegment(idx);
                    sounds.hover();
                  }}
                  onMouseLeave={() => setActiveSegment(null)}
                  className="relative pl-6 pr-6 py-5 rounded-xl cursor-pointer transition-all duration-300 flex items-center justify-between group"
                  style={{
                    background:
                      activeSegment === idx
                        ? "rgba(255, 255, 255, 0.03)"
                        : "rgba(255, 255, 255, 0.01)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                  }}
                >
                  {/* Color indicator */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl transition-all duration-300"
                    style={{
                      backgroundColor: item.color,
                      boxShadow:
                        activeSegment === idx
                          ? `0 0 15px ${item.color}`
                          : "none",
                    }}
                  />

                  <span className="text-lg text-white/80 group-hover:text-white transition-colors">
                    {item.label}
                  </span>
                  <span
                    className="text-2xl font-medium"
                    style={{ color: item.color }}
                  >
                    {item.value}%
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ============================================
   SECTION 3: UTILITY
   ============================================ */

const UtilitySection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const utilities = [
    {
      title: "Cashback",
      icon: RefreshCw,
      desc: "Instant rewards on every transaction.",
    },
    {
      title: "Merchants",
      icon: ShoppingBag,
      desc: "0% partner fees for holders.",
    },
    { title: "Discounts", icon: Percent, desc: "Reduced trading fees." },
    { title: "Staking", icon: Layers, desc: "Yield multiplier rewards." },
    { title: "Liquidity", icon: Activity, desc: "Market maker incentives." },
  ];

  return (
    <section
      ref={ref}
      className="relative py-12 md:py-24 bg-black overflow-hidden"
    >
      {/* Background text */}
      <motion.div
        className="absolute top-1/2 left-0 -translate-y-1/2 whitespace-nowrap text-[15vw] font-bold text-white/[0.015] select-none pointer-events-none"
        style={{
          x: useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]),
        }}
      >
        UTILITY • UTILITY • UTILITY • UTILITY •
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mb-20"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-white/60 mb-6 block">
            Token Utility
          </span>
          <h2 className="text-4xl md:text-6xl font-semibold text-white tracking-tight mb-6">
            Utility<span className="text-[#ff6b35]">.</span>
          </h2>
          <p className="text-xl text-white/50 max-w-xl">
            Engineered for maximum ecosystem velocity.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 ">
          {utilities.map((utility, i) => (
            <motion.div
              key={utility.title}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="group relative p-8 rounded-3xl min-h-[280px] flex flex-col justify-between overflow-hidden border border-transparent hover:border-[#ff6b35]/80 transition-colors duration-500 ease-out
 "
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                // border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
              onMouseEnter={() => sounds.hover()}
            >
              {/* Hover glow */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#ff6b35] opacity-0 group-hover:opacity-[0.08] blur-[40px] rounded-full transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="mb-8 text-white/40 group-hover:text-[#ff6b35] transition-colors duration-500">
                  <utility.icon className="w-8 h-8" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-light text-white mb-3">
                  {utility.title}
                </h3>
                <p className="text-sm text-white/50">{utility.desc}</p>
              </div>

              {/* Accent line */}
              <div className="w-8 h-[2px] bg-[#ff6b35] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ============================================
   SECTION 4: DEFLATION MODEL
   ============================================ */

const DeflationSection = () => {
  const deflation = [
    { title: "Buyback", icon: TrendingUp, sub: "Protocol Revenue" },
    { title: "Burn", icon: Flame, sub: "Permanent Removal" },
    { title: "Volume", icon: Zap, sub: "Dynamic Events" },
  ];

  return (
    <section className="relative py-12 md:py-24 bg-black overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=2832&auto=format&fit=crop"
          alt="Abstract"
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-white/60 mb-6 block">
            Economics
          </span>
          <h2 className="text-4xl md:text-6xl font-semibold text-white tracking-tight">
            Deflationary
            <br />
            <span className="text-white/30">Model.</span>
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {deflation.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              className="group p-10 rounded-3xl text-center border border-transparent hover:border-[#ff6b35]/80 transition-colors duration-500"
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                // border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
              onMouseEnter={() => sounds.hover()}
            >
              <div className="mb-8 p-5 rounded-full border border-white/5 bg-black/20 inline-flex group-hover:border-[#ff6b35] transition-colors duration-500">
                <item.icon
                  className="w-10 h-10 text-white group-hover:text-[#ff6b35] transition-colors"
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="text-3xl font-light text-white mb-3">
                {item.title}
              </h3>
              <p className="text-sm text-white/50 uppercase tracking-widest">
                {item.sub}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};


/* ============================================
   SECTION 5: EMISSIONS CHART
   ============================================ */

const EmissionsSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

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
      const monthValues: Record<string, number> = { month: m };
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
  }, []);

  return (
    <section
      ref={ref}
      className="relative py-12 md:py-24 bg-black overflow-hidden"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mb-16"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-white/60 mb-6 block">
            Vesting Schedule
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight mb-4">
            Emissions
          </h2>
          <p className="text-xl text-white/50">72-Month Vesting Curve</p>
        </motion.div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="rounded-3xl p-8 md:p-12 overflow-hidden relative"
          style={{
            background: "rgba(255, 255, 255, 0.02)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
          }}
        >
          {/* Chart glow */}
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#ff6b35]/5 to-transparent" />

          <div className="relative w-full aspect-[21/9]">
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
                    <stop offset="0%" stopColor={cat.color} stopOpacity="0.4" />
                    <stop offset="100%" stopColor={cat.color} stopOpacity="0" />
                  </linearGradient>
                ))}
              </defs>

              {/* Areas */}
              {chartData.categories.map((cat) => {
                const scaleX = (val: number) => (val / 72) * 1000;
                const scaleY = (val: number) => 500 - (val / 1000) * 500;
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

              {/* Main line */}
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

              {/* Milestones */}
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
        </motion.div>
      </div>
    </section>
  );
};

/* ============================================
   MAIN PAGE COMPONENT
   ============================================ */

export const BlipTokenomics = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const pathname = location.pathname;
    const hash = location.hash;

    if (pathname === "/tokenomics" && hash) {
      const id = hash.replace("#", "");
      navigate("/", { replace: true, state: { redirectHash: hash } });
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 50);
    }
  }, [location.pathname, location.hash, navigate]);

  return (
    <>
      <SEO
        title="Blip Money Tokenomics | Sustainable Payment Economy"
        description="Explore Blip Money tokenomics, including supply, utility, and incentives designed for long-term ecosystem growth."
        canonical="https://blip.money/tokenomics"
      />

      <div className="bg-black text-white overflow-x-hidden">
        <HeroSection />
        <DistributionSection />
        <UtilitySection />
        <DeflationSection />
        <EmissionsSection />
      </div>
    </>
  );
};

export default BlipTokenomics;
