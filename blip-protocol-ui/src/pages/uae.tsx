import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Zap, Users, Globe, Shield } from "lucide-react";
import { SocialSidebar } from "@/components/SocialSidebar";
import { Link } from "react-router-dom";
import { SEO } from "@/components";

const LaunchButton = ({ primary = false, className = "", children }) => (
  <button
    className={`
      relative overflow-hidden px-7 py-3 rounded-full font-semibold tracking-wide
      text-sm sm:text-base transition-all duration-300 group
      ${
        primary
          ? "bg-gradient-to-r from-[#00FF94] via-[#19F7A7] to-[#00C8FF] text-black shadow-[0_0_30px_rgba(0,255,148,0.5)] hover:shadow-[0_0_45px_rgba(0,255,148,0.7)] hover:scale-[1.02]"
          : "border border-black/10 dark:border-white/15 text-black dark:text-white bg-black/5 dark:bg-white/5 hover:border-[#00FF94] hover:text-[#00FF94] hover:bg-black/10 dark:hover:bg-white/10"
      }
      ${className}
    `}
  >
    <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
      {children}
    </span>
  </button>
);

/* ---------- BACKGROUND / UAE FLAG RIBBON ---------- */

const UAELaunchBackground = () => (
  <>
    {/* Subtle grid */}
    <div
      className="absolute inset-0 opacity-[0.18]"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(0,255,148,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,255,148,0.06) 1px, transparent 1px)",
        backgroundSize: "120px 120px",
      }}
    />

    {/* UAE angled flag ribbon */}
    <div className="pointer-events-none absolute -top-32 -right-32 w-[420px] h-[420px] rotate-12 opacity-80">
      <div className="w-full h-full rounded-[40px] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.9)] border border-black/[0.06] dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-xl flex">
        {/* Red */}
        <div className="w-[26%] bg-[#D91A20]" />
        {/* Green / White / Black gradient */}
        <div className="flex-1 bg-[linear-gradient(180deg,#00732F_0%,#FFFFFF_50%,#050505_100%)]" />
      </div>
    </div>

    {/* Soft halo behind hero */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%] w-[70vw] h-[70vh] rounded-full bg-[#00FF94]/10 blur-[120px]" />
  </>
);

/* ---------- HERO (SCREEN 1) ---------- */

const UAELaunchHero = () => {
  return (
    <section className="relative min-h-screen bg-[#FAF8F5] dark:bg-[#020203] pt-24 sm:pt-28 lg:pt-32 pb-16 overflow-hidden">
      <UAELaunchBackground />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
        {/* LEFT: Text */}
        <motion.div
          className="w-full lg:w-[55%] text-center lg:text-left"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Launch pill */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/80 dark:bg-black/70 border border-black/[0.06] dark:border-white/10 mb-6 shadow-lg">
            <MapPin className="w-4 h-4 text-[#00FF94]" />
            <span className="text-[11px] font-mono tracking-[0.24em] uppercase text-gray-300">
              Flagship Launch · United Arab Emirates
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-[3.9rem] font-extrabold leading-[1.05] tracking-tight mb-5">
            <span className="block text-black dark:text-white">
              Blip.money is{" "}
              <span className="bg-gradient-to-r from-[#00FF94] via-[#19F7A7] to-[#00C8FF] bg-clip-text text-transparent">
                landing in the UAE
              </span>
              .
            </span>
            <span className="mt-3 block text-gray-300 text-[1.4rem] sm:text-[1.55rem] font-semibold">
              Crypto-native rails for residents, traders & merchants.
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-xl mx-auto lg:mx-0 mb-8">
            Spin up a UAE Blip account, move value from wallets to local money
            in minutes, and earn launch rewards as an early corridor partner.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-start justify-center mb-10">
            <Link to="/register-uae">
              <LaunchButton primary className="w-full sm:w-auto">
                Join UAE Priority List
                <ArrowRight className="w-4 h-4" />
              </LaunchButton>
            </Link>

            <a href="#uae-why">
              <LaunchButton className="w-full sm:w-auto">
                View UAE launch perks
              </LaunchButton>
            </a>
          </div>

          {/* Mini stats row */}
          <div className="flex flex-col sm:flex-row gap-6 text-xs sm:text-sm text-gray-400">
            <div>
              <p className="font-mono tracking-[0.18em] uppercase text-gray-500 mb-1">
                Launch focus
              </p>
              <p>Dubai · Abu Dhabi · Sharjah</p>
            </div>
            <div>
              <p className="font-mono tracking-[0.18em] uppercase text-gray-500 mb-1">
                Built for
              </p>
              <p>Crypto users, expats, high-frequency P2P</p>
            </div>
          </div>
        </motion.div>

        {/* RIGHT: “Flagship” card */}
        <motion.div
          className="w-full lg:w-[45%] flex justify-center"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <div className="relative w-full max-w-md">
            {/* Glow */}
            <div className="absolute -inset-0.5 rounded-[32px] bg-gradient-to-br from-[#00FF94]/40 via-[#19F7A7]/10 to-[#D91A20]/35 blur-xl opacity-70" />

            {/* Content card */}
            <div className="relative rounded-[28px] bg-white/80 dark:bg-black/80 border border-black/[0.06] dark:border-white/8 backdrop-blur-2xl p-6 sm:p-8 flex flex-col gap-6 shadow-[0_0_60px_rgba(0,0,0,0.2)] dark:shadow-[0_0_60px_rgba(0,0,0,0.9)]">
              {/* Flag + label */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* UAE flag mini */}
                  <div className="w-10 h-7 rounded-md overflow-hidden flex shadow-md border border-black/[0.06] dark:border-white/10">
                    <div className="w-[28%] bg-[#D91A20]" />
                    <div className="flex-1 bg-[linear-gradient(180deg,#00732F_0%,#FFFFFF_50%,#050505_100%)]" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                      Launch Corridor
                    </p>
                    <p className="text-sm font-semibold text-black dark:text-white">UAE · MENA</p>
                  </div>
                </div>
                <span className="text-[11px] px-3 py-1 rounded-full border border-[#00FF94]/40 bg-[#00FF94]/5 text-[#00FF94] font-mono tracking-[0.16em] uppercase">
                  Gen-1 Flagship
                </span>
              </div>

              {/* Stylised “Dubai rails” */}
              <div className="relative h-40 sm:h-44 rounded-2xl bg-[radial-gradient(circle_at_top,_rgba(0,255,148,0.22),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(217,26,32,0.3),_transparent_60%)] border border-black/[0.06] dark:border-white/10 overflow-hidden">
                {/* Fake “skyline” using bars */}
                <div className="absolute inset-x-4 bottom-3 flex items-end gap-2 opacity-90">
                  {[26, 40, 58, 34, 70, 46, 32].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-xl bg-gradient-to-t from-black via-[#050b0a] to-[#00FF94]"
                      style={{ height: `${h + 30}px` }}
                    />
                  ))}
                </div>
                {/* Curve line as “value rail” */}
                <div className="absolute inset-x-0 top-6">
                  <div className="h-px w-[92%] mx-auto bg-gradient-to-r from-transparent via-[#00FF94] to-transparent opacity-70" />
                </div>
                <div className="absolute left-6 top-6 text-[11px] text-gray-300 font-mono">
                  Wallets in → Dirhams out
                </div>
              </div>

              {/* Micro stats */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500 mb-1">
                    Corridor
                  </p>
                  <p className="text-black dark:text-white">UAE → 50+ lanes*</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500 mb-1">
                    Designed for
                  </p>
                  <p className="text-black dark:text-white">Crypto-native flows</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500 mb-1">
                    Launch rewards
                  </p>
                  <p className="text-[#00FF94]">Limited early pool</p>
                </div>
              </div>

              <p className="text-[11px] text-gray-500 leading-relaxed">
                *Exact corridors, limits & partners will be announced with the
                UAE compliance rollout. This page is for early access and
                community launch.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ---------- WHY UAE (SCREEN 2) ---------- */

const UAELaunchWhy = () => {
  const cards = [
    {
      icon: MapPin,
      title: "Crypto capital of the region",
      body: "Dense concentration of crypto users, exchanges and OTC desks makes the UAE the natural first rail for Blip.",
      tag: "Location",
    },
    {
      icon: Zap,
      title: "Speed over paperwork",
      body: "Blip is built for fast P2P settlement. Start with crypto-native flows, then layer compliance as corridor volume scales.",
      tag: "Speed",
    },
    {
      icon: Users,
      title: "Traders, expats, merchants",
      body: "Serve people who already think in USDT, SOL, ETH — and still need to pay rent, salaries, and suppliers in local money.",
      tag: "Users",
    },
  ];

  return (
    <section
      id="uae-why"
      className="relative bg-[#FAF8F5] dark:bg-[#050507] border-t border-black/[0.06] dark:border-white/5 py-20 sm:py-24"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/15 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-[11px] font-mono tracking-[0.28em] uppercase text-gray-500 mb-3">
            Why UAE first?
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-black dark:text-white mb-4">
            The first Blip corridor for{" "}
            <span className="bg-gradient-to-r from-[#00FF94] to-[#19F7A7] bg-clip-text text-transparent">
              real crypto money.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
            Instead of chasing every jurisdiction at once, Blip starts where
            crypto is already everyday money and grows outward from there.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {cards.map(({ icon: Icon, title, body, tag }, idx) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.45, delay: idx * 0.06 }}
              className="relative rounded-2xl border border-black/[0.06] dark:border-white/8 bg-gradient-to-br from-white dark:from-[#050608] via-gray-50 dark:via-[#050505] to-[#FAF8F5] dark:to-[#020203] p-6 shadow-[0_0_40px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_rgba(0,0,0,0.9)] overflow-hidden group"
            >
              {/* subtle glow */}
              <div className="absolute -inset-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_top,_rgba(0,255,148,0.18),transparent_60%)] pointer-events-none" />
              <div className="relative flex flex-col gap-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/80 dark:bg-black/70 border border-black/[0.06] dark:border-white/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#00FF94]" />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.22em] text-gray-500">
                    {tag}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-black dark:text-white">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{body}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Timeline / phases */}
        <div className="border border-black/[0.06] dark:border-white/10 rounded-3xl px-5 sm:px-8 py-6 sm:py-7 bg-white/80 dark:bg-black/60 backdrop-blur-xl flex flex-col md:flex-row items-center gap-6 md:gap-10">
          <div className="flex-1 text-center md:text-left">
            <p className="text-[11px] font-mono tracking-[0.26em] uppercase text-gray-500 mb-2">
              Rollout rhythm
            </p>
            <h3 className="text-lg sm:text-xl font-semibold text-black dark:text-white mb-2">
              From UAE testers to global corridors.
            </h3>
            <p className="text-sm text-gray-400">
              Early UAE users help battle-test the rails, liquidity routing, and
              real P2P behavior before we unlock more countries and higher
              limits.
            </p>
          </div>

          <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
            {[
              { label: "Phase 1", text: "Closed UAE waitlist" },
              { label: "Phase 2", text: "Core corridors & limits" },
              { label: "Phase 3", text: "Merchants & on-chain perks" },
            ].map((step, idx) => (
              <div key={step.label} className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full border border-[#00FF94]/60 bg-[#00FF94]/10 flex items-center justify-center mb-2">
                  <span className="text-xs font-mono text-[#00FF94]">
                    {idx + 1}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 uppercase tracking-[0.18em] mb-1">
                  {step.label}
                </p>
                <p className="text-xs text-gray-300 text-center max-w-[140px]">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <p className="text-xs text-gray-500 mb-3">
            If you live, trade, or build in the UAE and want to be part of the
            corridor from day zero:
          </p>
          <Link to="/register-uae">
            <LaunchButton primary>
              Claim UAE early access slot
              <Shield className="w-4 h-4" />
            </LaunchButton>
          </Link>
        </div>
      </div>
    </section>
  );
};

/* ---------- PAGE WRAPPER ---------- */

const UAELaunchPage = () => {
  return (
    <>
    <SEO
  title="Blip money UAE | Digital Payments & Rewards Platform"
  description="Blip money in the UAE offers seamless digital payments, rewards, and merchant benefits across the United Arab Emirates."
  canonical="https://blip.money/uae"
/>

    <div className="min-h-screen bg-[#FAF8F5] dark:bg-black text-black dark:text-white font-sans overflow-x-hidden">
      <style>
        {`
          /* you can move this to globals if you want */
          html, body, #root { background: #FAF8F5; }
          .dark html, .dark body, .dark #root { background: #000000; }
          @media (prefers-color-scheme: dark) {
            html, body, #root { background: #000000; }
          }
        `}
      </style>
      <SocialSidebar />
      <UAELaunchHero />
      <UAELaunchWhy />
    </div>
    </>
  );
};

export default UAELaunchPage;
