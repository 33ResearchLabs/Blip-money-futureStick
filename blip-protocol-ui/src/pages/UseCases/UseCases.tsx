import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { Laptop, TrendingUp, ShoppingCart, Globe, ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { HreflangTags } from "@/components/HreflangTags";
import { useCases, type UseCase } from "@/data/useCasesData";
import { sounds } from "@/lib/sounds";

/* ── Icon mapping ── */
const iconMap: Record<string, React.FC<{ className?: string }>> = {
  laptop: Laptop,
  "trending-up": TrendingUp,
  "shopping-cart": ShoppingCart,
  globe: Globe,
};

/* ── Use Case Card ── */
const UseCaseCard = ({ useCase, index }: { useCase: UseCase; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const Icon = iconMap[useCase.icon] || Globe;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.19, 1, 0.22, 1],
      }}
    >
      <Link
        to={`/use-cases/${useCase.slug}`}
        onClick={() => sounds.click()}
        onMouseEnter={() => sounds.hover()}
        className="group block h-full"
      >
        <div className="relative h-full overflow-hidden rounded-2xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] hover:border-black/20 dark:hover:border-white/[0.15] transition-all duration-500 hover:-translate-y-1 shadow-[0_4px_30px_-8px_rgba(0,0,0,0.06)] dark:shadow-none">
          {/* Gradient accent top */}
          <div className={`h-1 w-full bg-gradient-to-r ${useCase.gradient}`} />

          <div className="p-8 sm:p-10">
            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center mb-6 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors duration-500">
              <Icon className="w-6 h-6 text-black/60 dark:text-white/60 group-hover:text-black dark:group-hover:text-white transition-colors duration-500" />
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-bold text-black dark:text-white tracking-tight mb-2 group-hover:text-gray-700 dark:group-hover:text-white/90 transition-colors">
              {useCase.title}
            </h3>

            {/* Headline */}
            <p className="text-[15px] font-medium text-gray-500 dark:text-white/50 mb-4">
              {useCase.headline}
            </p>

            {/* Description */}
            <p className="text-[15px] text-gray-400 dark:text-white/35 leading-relaxed line-clamp-3 mb-6">
              {useCase.description}
            </p>

            {/* Learn more link */}
            <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 dark:text-white/40 group-hover:text-black dark:group-hover:text-white transition-colors">
              Learn more
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

/* ── Main Use Cases Page ── */
export default function UseCases() {
  return (
    <>
      <SEO
        title="Use Cases | Blip Money - Crypto Payments for Every Need"
        description="Discover how Blip Money serves freelancers, OTC traders, e-commerce businesses, and remittance users with fast, secure crypto-to-fiat settlement."
        canonical="https://blip.money/use-cases"
        keywords="Blip use cases, crypto payments freelancers, OTC trading escrow, crypto ecommerce, crypto remittance"
      />
      <HreflangTags path="/use-cases" />

      <div className="min-h-screen bg-[#FAF8F5] dark:bg-transparent">
        {/* Hero */}
        <section className="relative pt-32 sm:pt-36 pb-12 sm:pb-16">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Use Cases" }]} />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
              className="text-center"
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-black dark:text-white tracking-tight mb-5">
                Use Cases
              </h1>
              <p className="text-lg sm:text-xl text-black dark:text-white/40 max-w-lg mx-auto leading-relaxed">
                From freelancers to enterprises, Blip powers fast and secure
                crypto settlement for every audience.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Use Cases Grid */}
        <section className="max-w-[900px] mx-auto px-4 sm:px-6 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {useCases.map((useCase, index) => (
              <UseCaseCard key={useCase.id} useCase={useCase} index={index} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
