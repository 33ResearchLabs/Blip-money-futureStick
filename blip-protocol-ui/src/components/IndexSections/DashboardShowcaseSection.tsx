import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

/* ============================================
   USE-CASE SHOWCASE
   Floating tilted image cards around heading
   ============================================ */

const floatingCards = [
  {
    label: "SEND TO\nANYONE",
    sub: "Pay globally in seconds",
    image:
      "https://images.unsplash.com/photo-1616077168712-fc6c788db4af?w=300&h=300&fit=crop&q=80",
    position: "top-[8%] left-[10%] sm:left-[13%] lg:left-[16%]",
    rotate: -10,
    size: "w-28 h-32 sm:w-34 sm:h-38 lg:w-40 lg:h-44",
    delay: 0,
    glow: "rgba(255,107,53,0.15)",
  },
  {
    label: "ON-CHAIN\nSETTLEMENT",
    sub: "Transparent escrow-based settlement",
    image:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=300&h=300&fit=crop&q=80",
    position: "top-[6%] right-[10%] sm:right-[13%] lg:right-[16%]",
    rotate: 8,
    size: "w-28 h-32 sm:w-34 sm:h-38 lg:w-40 lg:h-44",
    delay: 0.1,
    glow: "rgba(99,102,241,0.15)",
  },
  {
    label: "NON-\nCUSTODIAL",
    sub: "Users keep control of funds",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300&h=300&fit=crop&q=80",
    position: "top-[42%] sm:top-[38%] right-[8%] sm:right-[10%] lg:right-[12%]",
    rotate: 6,
    size: "w-24 h-28 sm:w-30 sm:h-34 lg:w-34 lg:h-38",
    delay: 0.2,
    glow: "rgba(16,185,129,0.15)",
  },
  {
    label: "MERCHANT\nLIQUIDITY",
    sub: "Offers with real limits and SLAs",
    image:
      "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=300&h=300&fit=crop&q=80",
    position: "bottom-[10%] left-[12%] sm:left-[16%] lg:left-[18%]",
    rotate: -7,
    size: "w-28 h-32 sm:w-34 sm:h-38 lg:w-38 lg:h-42",
    delay: 0.3,
    glow: "rgba(251,191,36,0.15)",
  },
  {
    label: "BEST\nRATES",
    sub: "Merchants compete for your trade",
    image:
      "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=300&h=300&fit=crop&q=80",
    position: "bottom-[12%] right-[12%] sm:right-[16%] lg:right-[18%]",
    rotate: 11,
    size: "w-28 h-32 sm:w-34 sm:h-38 lg:w-38 lg:h-42",
    delay: 0.4,
    glow: "rgba(139,92,246,0.15)",
  },
];

const DashboardShowcaseSection = () => {
  return (
    <section className="relative overflow-hidden bg-black py-20 sm:py-28 md:py-36 lg:py-44">
      {/* Subtle radial glow behind center */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] opacity-[0.08]"
          style={{
            background:
              "radial-gradient(ellipse, rgba(255,255,255,1) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Floating image cards - desktop */}
      <div className="absolute inset-0 hidden sm:block">
        {floatingCards.map((card, index) => (
          <motion.div
            key={card.label}
            className={`absolute ${card.position} ${card.size}`}
            initial={{ opacity: 0, y: 30, rotate: card.rotate }}
            whileInView={{
              opacity: 1,
              y: 0,
              rotate: card.rotate,
            }}
            viewport={{ once: true }}
            transition={{
              duration: 0.7,
              delay: card.delay,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {/* Glow behind card */}
            <div
              className="absolute -inset-4 rounded-3xl blur-2xl opacity-60"
              style={{ background: card.glow }}
            />

            <motion.div
              className="relative w-full h-full rounded-2xl overflow-hidden border border-white/[0.12] shadow-[0_8px_40px_-10px_rgba(0,0,0,0.5)]"
              animate={{ y: [0, -5, 0] }}
              transition={{
                duration: 3.5 + index * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={{ scale: 1.08, rotate: 0 }}
            >
              <img
                src={card.image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5" />

              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-3">
                <span className="block text-[9px] sm:text-[10px] lg:text-[11px] font-extrabold text-white uppercase tracking-[0.15em] leading-tight whitespace-pre-line">
                  {card.label}
                </span>
                <span className="block text-[7px] sm:text-[8px] lg:text-[9px] text-white/50 mt-0.5 font-semibold tracking-wide">
                  {card.sub}
                </span>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Connecting lines between cards and center - subtle */}
      <div className="absolute inset-0 hidden lg:block pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="lineGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="white" stopOpacity="0.06" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Subtle radial lines from center */}
          <line x1="50%" y1="50%" x2="20%" y2="20%" stroke="white" strokeOpacity="0.04" strokeWidth="1" />
          <line x1="50%" y1="50%" x2="80%" y2="18%" stroke="white" strokeOpacity="0.04" strokeWidth="1" />
          <line x1="50%" y1="50%" x2="85%" y2="50%" stroke="white" strokeOpacity="0.04" strokeWidth="1" />
          <line x1="50%" y1="50%" x2="22%" y2="80%" stroke="white" strokeOpacity="0.04" strokeWidth="1" />
          <line x1="50%" y1="50%" x2="78%" y2="80%" stroke="white" strokeOpacity="0.04" strokeWidth="1" />
        </svg>
      </div>

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 min-h-[360px] sm:min-h-[420px] lg:min-h-[480px]">
        {/* Mobile cards - horizontal scroll */}
        <div className="flex gap-3 mb-8 sm:hidden overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
          {floatingCards.map((card, index) => (
            <motion.div
              key={card.label}
              className="flex-shrink-0 w-28 h-32 rounded-xl overflow-hidden border border-white/[0.1]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              style={{ rotate: `${card.rotate * 0.5}deg` }}
            >
              <div className="relative w-full h-full">
                <img
                  src={card.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5" />
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <span className="block text-[9px] font-extrabold text-white uppercase tracking-[0.12em] leading-tight whitespace-pre-line">
                    {card.label}
                  </span>
                  <span className="block text-[7px] text-white/50 mt-0.5 font-semibold tracking-wide">
                    {card.sub}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="text-[11px] uppercase tracking-[0.3em] text-white/25 font-semibold mb-5"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          How Blip works
        </motion.p>

        <motion.h2
          className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-semibold text-white tracking-tight leading-[0.95]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          Send money to
          <br />
          anyone, anywhere.
        </motion.h2>

        {/* Pill box: explainer text + CTA */}
        <motion.div
          className="mt-8 sm:mt-10 inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 rounded-full bg-white/[0.06] border border-white/[0.08] px-6 sm:px-8 py-4 sm:py-4 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex flex-col gap-1.5 text-left">
            <p className="text-white/55 text-sm sm:text-[15px] font-medium leading-relaxed">
              Users buy and sell crypto with local merchants.
            </p>
            <p className="text-white/50 text-sm sm:text-[15px] font-medium leading-relaxed">
              Merchants provide liquidity and compete on price.
            </p>
            <p className="text-white/60 text-sm sm:text-[15px] font-medium leading-relaxed">
              Blip settles instantly on-chain.
            </p>
          </div>
          <Link
            to="/send"
            className="group shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black text-sm font-semibold transition-all duration-200 hover:bg-[#000] hover:text-[#fff] border border-transparent hover:border-white/20"
          >
            Get started
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default DashboardShowcaseSection;
