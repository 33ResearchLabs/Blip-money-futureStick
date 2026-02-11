import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  TrendingUp,
  Globe,
  Shield,
  Zap,
  Users,
  Wallet,
  Building2,
  ArrowLeftRight,
  Landmark,
  BadgeCheck,
  Scale,
  Send,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "@/components";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { HreflangTags } from "@/components/HreflangTags";
import { sounds } from "@/lib/sounds";

/* ============================================
   HERO SECTION
   ============================================ */
const HeroSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section
      ref={ref}
      className="relative pt-32 sm:pt-36 pb-12 sm:pb-16 bg-[#FAF8F5] dark:bg-transparent overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-black/[0.02] dark:bg-white/[0.02] blur-[140px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Crypto Payments UAE" }]} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 backdrop-blur-sm border border-black/[0.06] dark:border-white/10 bg-white/80 dark:bg-white/[0.03]"
        >
          <span className="w-2 h-2 rounded-full bg-[#ff6b35] animate-pulse" />
          <span className="text-xs text-black/60 dark:text-white/60 tracking-wide font-medium">
            UAE Crypto Hub
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-5xl sm:text-6xl md:text-7xl font-bold text-black dark:text-white tracking-tight leading-[1.1] mb-6"
        >
          Crypto Payments
          <br />
          <span className="text-black/80 dark:text-white/50">in the UAE.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg sm:text-xl text-black dark:text-white/40 max-w-2xl mb-10 leading-relaxed"
        >
          The UAE is emerging as one of the world's most progressive crypto
          ecosystems. Blip makes it easy to buy, sell, and settle crypto
          payments across Dubai and the Emirates with speed, security, and
          transparency.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <Link
            to="/waitlist"
            onClick={() => sounds.click()}
            onMouseEnter={() => sounds.hover()}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold hover:opacity-90 transition-all"
          >
            Join Blip in the UAE
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

/* ============================================
   UAE CRYPTO LANDSCAPE SECTION
   ============================================ */
const CryptoLandscapeSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats = [
    {
      value: "30%+",
      label: "Crypto Ownership Rate",
      desc: "The UAE has one of the highest crypto ownership rates globally among its population.",
      icon: Users,
    },
    {
      value: "$25B+",
      label: "Annual Crypto Volume",
      desc: "The MENA region processes billions in crypto transactions annually, with the UAE leading.",
      icon: TrendingUp,
    },
    {
      value: "VARA",
      label: "Regulatory Framework",
      desc: "Dubai's Virtual Assets Regulatory Authority provides one of the world's clearest crypto frameworks.",
      icon: Scale,
    },
    {
      value: "40+",
      label: "Licensed Exchanges",
      desc: "A growing number of licensed crypto service providers operate under UAE regulatory oversight.",
      icon: Building2,
    },
  ];

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32 bg-[#FAF8F5] dark:bg-black overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-black/40 dark:text-white/40 mb-4 block">
            Market Overview
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-black dark:text-white tracking-tight">
            UAE Crypto{" "}
            <span className="text-black/80 dark:text-white/50">Landscape</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="group p-8 rounded-2xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] hover:border-black/20 dark:hover:border-white/20 transition-colors duration-500 text-center"
                onMouseEnter={() => sounds.hover()}
              >
                <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center mx-auto mb-5 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors duration-500">
                  <Icon className="w-6 h-6 text-black/60 dark:text-white/60 group-hover:text-black dark:group-hover:text-white transition-colors duration-500" />
                </div>
                <div className="text-3xl font-bold text-black dark:text-white mb-2 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-black dark:text-white/70 mb-2">
                  {stat.label}
                </div>
                <p className="text-xs text-black dark:text-white/40 leading-relaxed">
                  {stat.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ============================================
   WHAT YOU CAN DO SECTION
   ============================================ */
const WhatYouCanDoSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: Wallet,
      title: "Buy Crypto with AED",
      desc: "Purchase USDT, USDC, BTC, and other supported assets using AED through Blip's on-demand merchant network.",
    },
    {
      icon: ArrowLeftRight,
      title: "Sell Crypto for AED",
      desc: "Convert your crypto holdings into AED instantly. Receive payouts via bank transfer, instant transfer, or cash.",
    },
    {
      icon: Globe,
      title: "Pay Merchants with Crypto",
      desc: "Use crypto to pay businesses that accept digital assets in the UAE. Blip settles the conversion seamlessly.",
    },
    {
      icon: Send,
      title: "Send Cross-Border",
      desc: "Send value globally using crypto rails. Blip enables fast settlement between the UAE and international corridors.",
    },
  ];

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32 bg-[#FAF8F5] dark:bg-black overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-black/40 dark:text-white/40 mb-4 block">
            Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-black dark:text-white tracking-tight">
            What You{" "}
            <span className="text-black/80 dark:text-white/50">Can Do</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="group flex items-start gap-5 p-6 rounded-2xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] hover:border-black/20 dark:hover:border-white/20 transition-colors duration-500"
                onMouseEnter={() => sounds.hover()}
              >
                <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors duration-500">
                  <Icon className="w-6 h-6 text-black/60 dark:text-white/60 group-hover:text-black dark:group-hover:text-white transition-colors duration-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-black dark:text-white/40 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ============================================
   REGULATION & COMPLIANCE SECTION
   ============================================ */
const RegulationSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32 bg-[#FAF8F5] dark:bg-black overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="text-xs uppercase tracking-[0.3em] text-black/40 dark:text-white/40 mb-4 block">
              Compliance
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-black dark:text-white tracking-tight mb-6">
              Regulation &{" "}
              <span className="text-black/80 dark:text-white/50">
                Compliance
              </span>
            </h2>

            <div className="space-y-4 text-sm text-black dark:text-white/40 leading-relaxed">
              <p>
                The UAE has established itself as a global leader in crypto
                regulation. Dubai's Virtual Assets Regulatory Authority (VARA)
                provides one of the world's most comprehensive regulatory
                frameworks for virtual asset service providers, creating a safe,
                transparent environment for crypto transactions.
              </p>
              <p>
                Abu Dhabi's ADGM Financial Services Regulatory Authority (FSRA)
                similarly offers a robust regulatory sandbox for digital assets.
                Together, these frameworks position the UAE as a trusted
                jurisdiction for crypto-to-fiat settlement and digital asset
                management.
              </p>
              <p>
                Blip Money operates as a decentralized coordination protocol.
                Individual settlement merchants are responsible for adhering to
                applicable regulatory requirements within their jurisdictions and
                payout methods.
              </p>
            </div>
          </motion.div>

          {/* Right: Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4"
          >
            {[
              {
                icon: Shield,
                title: "VARA (Dubai)",
                desc: "Dubai's Virtual Assets Regulatory Authority oversees crypto activities with comprehensive licensing requirements.",
              },
              {
                icon: Landmark,
                title: "ADGM FSRA (Abu Dhabi)",
                desc: "Abu Dhabi Global Market provides a regulated environment for digital asset businesses through its financial services framework.",
              },
              {
                icon: BadgeCheck,
                title: "Progressive Framework",
                desc: "The UAE's approach balances innovation with consumer protection, attracting global crypto businesses and talent.",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="group flex items-start gap-4 p-5 rounded-xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] hover:border-black/20 dark:hover:border-white/20 transition-colors duration-500"
                  onMouseEnter={() => sounds.hover()}
                >
                  <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors duration-500">
                    <Icon className="w-5 h-5 text-black/60 dark:text-white/60 group-hover:text-black dark:group-hover:text-white transition-colors duration-500" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-black dark:text-white mb-1">
                      {item.title}
                    </h4>
                    <p className="text-sm text-black dark:text-white/40 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ============================================
   GETTING STARTED SECTION
   ============================================ */
const GettingStartedSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    {
      num: "01",
      title: "Connect Your Wallet",
      desc: "Link any Solana-compatible wallet to access the Blip network. No account registration or email required.",
      icon: Wallet,
    },
    {
      num: "02",
      title: "Choose Your Action",
      desc: "Select whether you want to buy, sell, or transfer crypto. Enter the amount and your preferred payout method.",
      icon: ArrowLeftRight,
    },
    {
      num: "03",
      title: "Settle Instantly",
      desc: "Bonded merchants compete to fill your order. Funds are protected by escrow until settlement is confirmed.",
      icon: Zap,
    },
  ];

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32 bg-[#FAF8F5] dark:bg-black overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-black/40 dark:text-white/40 mb-4 block">
            Quick Start
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-black dark:text-white tracking-tight">
            Getting{" "}
            <span className="text-black/80 dark:text-white/50">Started</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: i * 0.15 }}
                className="group relative p-8 rounded-2xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] hover:border-black/20 dark:hover:border-white/20 transition-colors duration-500"
                onMouseEnter={() => sounds.hover()}
              >
                <span className="absolute top-4 right-4 text-5xl font-bold text-black/[0.04] dark:text-white/[0.04] select-none">
                  {step.num}
                </span>

                <div className="w-14 h-14 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center mb-6 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors duration-500">
                  <Icon className="w-6 h-6 text-black/60 dark:text-white/60 group-hover:text-black dark:group-hover:text-white transition-colors duration-500" />
                </div>

                <h3 className="text-xl font-semibold text-black dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-black dark:text-white/40 leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ============================================
   CTA SECTION
   ============================================ */
const CTABottomSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32 bg-[#FAF8F5] dark:bg-black overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-black dark:text-white tracking-tight mb-6"
        >
          The Future of{" "}
          <span className="text-black/80 dark:text-white/50">
            Crypto in the UAE
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg text-black dark:text-white/40 max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Be part of the UAE's growing crypto economy. Join Blip to buy, sell,
          and settle crypto payments with speed and security.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link
            to="/waitlist"
            onClick={() => sounds.click()}
            onMouseEnter={() => sounds.hover()}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold hover:opacity-90 transition-all"
          >
            Join Blip in the UAE
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

/* ============================================
   SEO CONTENT BLOCK
   ============================================ */
const SEOContentBlock = () => {
  return (
    <section className="border-t border-black/[0.06] dark:border-white/5 bg-[#FAF8F5] dark:bg-black">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="max-w-5xl mx-auto px-6 py-16 text-black dark:text-white/40 text-sm leading-relaxed"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl font-semibold text-black dark:text-white mb-4"
        >
          Crypto Payments in the UAE
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          The United Arab Emirates has positioned itself as a global hub for
          cryptocurrency and blockchain innovation. With regulatory frameworks
          like VARA in Dubai and FSRA in Abu Dhabi, the UAE provides a clear,
          progressive environment for crypto payments, trading, and settlement.
          Blip Money leverages this ecosystem to deliver fast, secure crypto
          payment solutions for individuals and businesses across the Emirates.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-4"
        >
          Whether you need to convert Bitcoin to AED, make crypto payments in
          Dubai, send cross-border transfers, or settle crypto-to-fiat
          transactions in the UAE, Blip's decentralized protocol connects you
          with bonded merchants for competitive rates and escrow-protected
          settlement.
        </motion.p>
      </motion.div>
    </section>
  );
};

/* ============================================
   MAIN PAGE COMPONENT
   ============================================ */
const CryptoPaymentsUAE = () => {
  return (
    <>
      <SEO
        title="Crypto Payments in the UAE - Send & Receive Crypto Easily | Blip Money"
        description="Make crypto payments in the UAE with Blip Money. Buy, sell, and settle cryptocurrency across Dubai and the Emirates with escrow-protected, fast settlement."
        canonical="https://blip.money/crypto-payments-uae"
        keywords="crypto payments UAE, cryptocurrency UAE, Bitcoin payments Dubai, crypto to fiat UAE, buy crypto AED, sell crypto UAE, crypto settlement Dubai"
      />
      <HreflangTags path="/crypto-payments-uae" />

      <div className="bg-[#FAF8F5] dark:bg-black text-black dark:text-white overflow-x-hidden">
        <HeroSection />
        <CryptoLandscapeSection />
        <WhatYouCanDoSection />
        <RegulationSection />
        <GettingStartedSection />
        <SEOContentBlock />
        <CTABottomSection />
      </div>
    </>
  );
};

export default CryptoPaymentsUAE;
