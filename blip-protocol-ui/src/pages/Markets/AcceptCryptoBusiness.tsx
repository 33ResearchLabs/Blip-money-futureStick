import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Users,
  Shield,
  Zap,
  TrendingUp,
  BarChart3,
  Settings,
  Globe,
  ShoppingCart,
  Building2,
  Utensils,
  Home,
  Briefcase,
  Wrench,
  BadgeCheck,
  Wallet,
  Bell,
  FileText,
  PieChart,
  Lock,
  CreditCard,
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
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Accept Crypto for Business" }]} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 backdrop-blur-sm border border-black/[0.06] dark:border-white/10 bg-white/80 dark:bg-white/[0.03]"
        >
          <span className="w-2 h-2 rounded-full bg-black dark:bg-white animate-pulse" />
          <span className="text-xs text-black/60 dark:text-white/60 tracking-wide font-medium">
            For Businesses
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-5xl sm:text-6xl md:text-7xl font-bold text-black dark:text-white tracking-tight leading-[1.1] mb-6"
        >
          Accept Crypto
          <br />
          <span className="text-black/80 dark:text-white/50">
            for Your Business.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-lg sm:text-xl text-black dark:text-white/40 max-w-2xl mb-10 leading-relaxed"
        >
          Tap into the growing crypto economy. Accept crypto payments from
          420M+ global holders with instant AED settlement, zero chargebacks,
          and lower fees than traditional payment processors.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <Link
            to="/merchant"
            onClick={() => sounds.click()}
            onMouseEnter={() => sounds.hover()}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold hover:opacity-90 transition-all"
          >
            Apply as a Merchant
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

/* ============================================
   WHY ACCEPT CRYPTO SECTION
   ============================================ */
const WhyAcceptCryptoSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const benefits = [
    {
      icon: Users,
      title: "Access 420M+ Crypto Holders",
      desc: "Open your business to the global crypto community. Accept payments from customers who prefer to pay with digital assets.",
      metric: "420M+",
      metricLabel: "Global Users",
    },
    {
      icon: TrendingUp,
      title: "Lower Fees Than Credit Cards",
      desc: "Traditional card processors charge 2.5-3.5% per transaction. Crypto payments through Blip offer significantly lower settlement costs.",
      metric: "~1%",
      metricLabel: "Avg. Fee",
    },
    {
      icon: Shield,
      title: "No Chargebacks",
      desc: "Crypto transactions are final once confirmed. Eliminate chargeback fraud and the costs associated with payment disputes.",
      metric: "0%",
      metricLabel: "Chargeback Rate",
    },
    {
      icon: Zap,
      title: "Instant Settlement",
      desc: "Receive AED in your bank account the same day. No more waiting 3-5 business days for payment processor settlements.",
      metric: "<1hr",
      metricLabel: "Avg. Settlement",
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
            Benefits
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-black dark:text-white tracking-tight">
            Why Accept{" "}
            <span className="text-black/80 dark:text-white/50">Crypto</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="group relative p-8 rounded-2xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] hover:border-black/20 dark:hover:border-white/20 transition-colors duration-500"
                onMouseEnter={() => sounds.hover()}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors duration-500">
                    <Icon className="w-6 h-6 text-black/60 dark:text-white/60 group-hover:text-black dark:group-hover:text-white transition-colors duration-500" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-black dark:text-white tracking-tight">
                      {benefit.metric}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-black/40 dark:text-white/40">
                      {benefit.metricLabel}
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-black dark:text-white mb-3">
                  {benefit.title}
                </h3>
                <p className="text-sm text-black dark:text-white/40 leading-relaxed">
                  {benefit.desc}
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
   HOW IT WORKS FOR MERCHANTS SECTION
   ============================================ */
const HowItWorksSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    {
      num: "01",
      title: "Apply & Get Approved",
      desc: "Submit a merchant application. Our team reviews your business and sets up your merchant profile with appropriate corridors and limits.",
      icon: BadgeCheck,
    },
    {
      num: "02",
      title: "Integrate Payment Flow",
      desc: "Add Blip's payment option to your checkout. Customers see a simple crypto payment interface alongside traditional methods.",
      icon: CreditCard,
    },
    {
      num: "03",
      title: "Customer Pays with Crypto",
      desc: "Your customer selects crypto payment and sends funds. The crypto is locked in non-custodial escrow immediately upon confirmation.",
      icon: Wallet,
    },
    {
      num: "04",
      title: "Receive AED Settlement",
      desc: "Blip's settlement network converts the crypto and deposits AED into your business bank account. Fast, automatic, and hands-off.",
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
            Merchant Flow
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-black dark:text-white tracking-tight">
            How It Works{" "}
            <span className="text-black/80 dark:text-white/50">
              for Merchants
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: i * 0.12 }}
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
   DASHBOARD FEATURES SECTION
   ============================================ */
const DashboardFeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      icon: BarChart3,
      title: "Revenue Analytics",
      desc: "Track crypto payment volume, conversion rates, and revenue trends in real time.",
    },
    {
      icon: Bell,
      title: "Instant Notifications",
      desc: "Get alerted immediately when a crypto payment is received, settled, or requires attention.",
    },
    {
      icon: Settings,
      title: "Payment Configuration",
      desc: "Set accepted currencies, minimum amounts, auto-settlement preferences, and payout schedules.",
    },
    {
      icon: FileText,
      title: "Transaction History",
      desc: "Full audit trail of every crypto payment with on-chain verification links and settlement details.",
    },
    {
      icon: PieChart,
      title: "Settlement Reports",
      desc: "Generate detailed settlement reports for accounting. Export to CSV for your bookkeeper or accountant.",
    },
    {
      icon: Lock,
      title: "Security Controls",
      desc: "Multi-signature approvals, API key management, IP whitelisting, and activity logs for your team.",
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
            Your Command Center
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-black dark:text-white tracking-tight">
            Dashboard{" "}
            <span className="text-black/80 dark:text-white/50">Features</span>
          </h2>
          <p className="text-lg text-black dark:text-white/40 max-w-xl mx-auto mt-4">
            Everything you need to manage crypto payments from one place.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: i * 0.08 }}
                className="group flex items-start gap-4 p-5 rounded-xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] hover:border-black/20 dark:hover:border-white/20 transition-colors duration-500"
                onMouseEnter={() => sounds.hover()}
              >
                <div className="w-10 h-10 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors duration-500">
                  <Icon className="w-5 h-5 text-black/60 dark:text-white/60 group-hover:text-black dark:group-hover:text-white transition-colors duration-500" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-black dark:text-white mb-1">
                    {feature.title}
                  </h4>
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
   INDUSTRIES USING BLIP SECTION
   ============================================ */
const IndustriesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const industries = [
    {
      icon: ShoppingCart,
      title: "E-Commerce",
      desc: "Online stores and marketplaces accepting crypto at checkout for global customers.",
    },
    {
      icon: Building2,
      title: "Hospitality",
      desc: "Hotels, resorts, and travel services settling bookings in crypto with instant fiat conversion.",
    },
    {
      icon: Wrench,
      title: "Services",
      desc: "Freelancers, agencies, and consultants accepting project payments in digital assets.",
    },
    {
      icon: Home,
      title: "Real Estate",
      desc: "Property developers and agents facilitating crypto-denominated real estate transactions.",
    },
    {
      icon: Utensils,
      title: "Food & Beverage",
      desc: "Restaurants, cafes, and delivery services offering crypto as a payment option.",
    },
    {
      icon: Briefcase,
      title: "Professional Services",
      desc: "Law firms, accounting firms, and consulting practices accepting crypto from international clients.",
    },
    {
      icon: Globe,
      title: "SaaS & Digital",
      desc: "Software platforms and digital product businesses accepting subscription payments in crypto.",
    },
    {
      icon: TrendingUp,
      title: "Trading & Finance",
      desc: "OTC desks, fund managers, and financial services leveraging Blip for crypto settlement.",
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
            Use Cases
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-black dark:text-white tracking-tight">
            Industries{" "}
            <span className="text-black/80 dark:text-white/50">
              Using Blip
            </span>
          </h2>
          <p className="text-lg text-black dark:text-white/40 max-w-xl mx-auto mt-4">
            Businesses across sectors are accepting crypto payments through
            Blip.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {industries.map((industry, i) => {
            const Icon = industry.icon;
            return (
              <motion.div
                key={industry.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.06 }}
                className="group p-6 rounded-2xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] hover:border-black/20 dark:hover:border-white/20 transition-colors duration-500 text-center"
                onMouseEnter={() => sounds.hover()}
              >
                <div className="w-12 h-12 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center mx-auto mb-4 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors duration-500">
                  <Icon className="w-6 h-6 text-black/60 dark:text-white/60 group-hover:text-black dark:group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-base font-semibold text-black dark:text-white mb-2">
                  {industry.title}
                </h3>
                <p className="text-xs text-black dark:text-white/40 leading-relaxed">
                  {industry.desc}
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
          Ready to Accept{" "}
          <span className="text-black/80 dark:text-white/50">Crypto?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg text-black dark:text-white/40 max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Apply today and start accepting crypto payments from customers
          worldwide. Get set up in minutes with instant AED settlement.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            to="/merchant"
            onClick={() => sounds.click()}
            onMouseEnter={() => sounds.hover()}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold hover:opacity-90 transition-all"
          >
            Apply as a Merchant
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/waitlist"
            onClick={() => sounds.click()}
            onMouseEnter={() => sounds.hover()}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-black/10 dark:border-white/10 text-black dark:text-white font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-all"
          >
            Join Waitlist
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
          Accept Crypto Payments for Your Business
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Blip Money enables businesses of all sizes to accept cryptocurrency
          payments with automatic fiat settlement. Whether you run an e-commerce
          store, a restaurant, a real estate agency, or a professional services
          firm, Blip provides the infrastructure to accept Bitcoin, USDT, USDC,
          and other digital assets from customers worldwide.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-4"
        >
          As a cryptocurrency payment gateway, Blip handles the complexity of
          crypto acceptance so you can focus on your business. Accept crypto,
          receive AED. It is that simple. With escrow-protected settlement, zero
          chargebacks, and lower fees than traditional payment processors, Blip
          is the modern way to accept payments for your business.
        </motion.p>
      </motion.div>
    </section>
  );
};

/* ============================================
   MAIN PAGE COMPONENT
   ============================================ */
const AcceptCryptoBusiness = () => {
  return (
    <>
      <SEO
        title="Accept Crypto Payments for Your Business | Blip Money"
        description="Accept cryptocurrency payments for your business with Blip Money. Instant AED settlement, zero chargebacks, lower fees, and a full merchant dashboard."
        canonical="https://blip.money/accept-crypto-business"
        keywords="accept crypto payments business, cryptocurrency payment gateway, crypto merchant, accept Bitcoin business, crypto payments for business, accept USDT business"
      />
      <HreflangTags path="/accept-crypto-business" />

      <div className="bg-[#FAF8F5] dark:bg-black text-black dark:text-white overflow-x-hidden">
        <HeroSection />
        <WhyAcceptCryptoSection />
        <HowItWorksSection />
        <DashboardFeaturesSection />
        <IndustriesSection />
        <SEOContentBlock />
        <CTABottomSection />
      </div>
    </>
  );
};

export default AcceptCryptoBusiness;
