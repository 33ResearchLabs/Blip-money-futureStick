import { useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  BarChart3,
  Minus,
} from "lucide-react";
import SEO from "@/components/SEO";
import {
  comparisons,
  type ComparisonPage,
  type ComparisonFeature,
} from "@/data/comparisonData";
import { sounds } from "@/lib/sounds";

/* ============================================
   LISTING PAGE COMPONENTS
   ============================================ */

/* ── Comparison Card (for listing) ── */
const ComparisonCard = ({
  comparison,
  index,
}: {
  comparison: ComparisonPage;
  index: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const blipAdvantageCount = comparison.features.filter(
    (f) => f.blipAdvantage,
  ).length;

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
        to={`/compare/${comparison.slug}`}
        onClick={() => sounds.click()}
        onMouseEnter={() => sounds.hover()}
        className="group block h-full"
      >
        <div className="relative h-full overflow-hidden rounded-2xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] hover:border-black/20 dark:hover:border-white/[0.15] transition-all duration-500 hover:-translate-y-1 shadow-[0_4px_30px_-8px_rgba(0,0,0,0.06)] dark:shadow-none">
          <div className="p-8 sm:p-10">
            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center mb-6 group-hover:bg-black/10 dark:group-hover:bg-white/10 transition-colors duration-500">
              <BarChart3 className="w-6 h-6 text-black/60 dark:text-white/60 group-hover:text-black dark:group-hover:text-white transition-colors duration-500" />
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-bold text-black dark:text-white tracking-tight mb-2 group-hover:text-gray-700 dark:group-hover:text-white/90 transition-colors">
              {comparison.title}
            </h3>

            {/* Headline */}
            <p className="text-[15px] font-medium text-gray-500 dark:text-white/50 mb-5">
              {comparison.headline}
            </p>

            {/* Feature count badge */}
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 text-[12px] font-medium text-gray-500 dark:text-white/50">
                {comparison.features.length} features compared
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-[12px] font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-3 h-3" />
                Blip wins {blipAdvantageCount}
              </span>
            </div>

            {/* Learn more link */}
            <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 dark:text-white/40 group-hover:text-black dark:group-hover:text-white transition-colors">
              View comparison
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

/* ── Listing Page ── */
const CompareListing = () => {
  return (
    <>
      <SEO
        title="Compare | Blip Money vs Competitors - Honest Feature Comparisons"
        description="See how Blip Money stacks up against Wise, Binance P2P, and traditional escrow. Transparent feature-by-feature comparisons on speed, fees, security, and more."
        canonical="https://blip.money/compare"
        keywords="Blip vs Wise, Blip vs Binance P2P, crypto comparison, P2P trading comparison, escrow comparison"
      />

      <div className="min-h-screen bg-[#FAF8F5] dark:bg-transparent">
        {/* Hero */}
        <section className="relative pt-32 sm:pt-36 pb-12 sm:pb-16">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
              className="text-center"
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-black dark:text-white tracking-tight mb-5">
                Compare
              </h1>
              <p className="text-lg sm:text-xl text-black dark:text-white/40 max-w-lg mx-auto leading-relaxed">
                Transparent, feature-by-feature comparisons so you can make the
                right choice for your needs.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Comparison Cards Grid */}
        <section className="max-w-[900px] mx-auto px-4 sm:px-6 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {comparisons.map((comparison, index) => (
              <ComparisonCard
                key={comparison.id}
                comparison={comparison}
                index={index}
              />
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

/* ============================================
   DETAIL PAGE COMPONENTS
   ============================================ */

/* ── Comparison Table Row ── */
const ComparisonRow = ({
  feature,
  index,
  competitorName,
}: {
  feature: ComparisonFeature;
  index: number;
  competitorName: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  return (
    <motion.tr
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.19, 1, 0.22, 1],
      }}
      className={`border-b border-gray-100 dark:border-white/[0.06] ${
        index % 2 === 0
          ? "bg-transparent"
          : "bg-black/[0.01] dark:bg-white/[0.01]"
      }`}
    >
      {/* Feature name */}
      <td className="py-4 px-4 sm:px-6 text-[14px] sm:text-[15px] font-medium text-black dark:text-white/70">
        {feature.feature}
      </td>

      {/* Blip value */}
      <td className="py-4 px-4 sm:px-6">
        <div className="flex items-center gap-2">
          {feature.blipAdvantage && (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-500 dark:text-emerald-400" />
          )}
          <span
            className={`text-[14px] sm:text-[15px] leading-snug ${
              feature.blipAdvantage
                ? "text-emerald-700 dark:text-emerald-300 font-medium"
                : "text-gray-500 dark:text-white/40"
            }`}
          >
            {feature.blip}
          </span>
        </div>
      </td>

      {/* Competitor value */}
      <td className="py-4 px-4 sm:px-6">
        <div className="flex items-center gap-2">
          {!feature.blipAdvantage && (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-500 dark:text-emerald-400" />
          )}
          {feature.blipAdvantage && (
            <Minus className="w-4 h-4 flex-shrink-0 text-gray-300 dark:text-white/20" />
          )}
          <span
            className={`text-[14px] sm:text-[15px] leading-snug ${
              !feature.blipAdvantage
                ? "text-emerald-700 dark:text-emerald-300 font-medium"
                : "text-gray-400 dark:text-white/30"
            }`}
          >
            {feature.competitor}
          </span>
        </div>
      </td>
    </motion.tr>
  );
};

/* ── Detail Page ── */
const CompareDetail = ({ comparison }: { comparison: ComparisonPage }) => {
  return (
    <>
      <SEO
        title={comparison.seo.title}
        description={comparison.seo.description}
        canonical={comparison.seo.canonical}
        keywords={comparison.seo.keywords}
      />

      <div className="min-h-screen bg-[#FAF8F5] dark:bg-transparent">
        {/* Breadcrumb */}
        <section className="pt-28 sm:pt-32">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <motion.nav
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-1.5 text-[13px] text-gray-400 dark:text-white/35"
            >
              <Link
                to="/"
                onClick={() => sounds.click()}
                onMouseEnter={() => sounds.hover()}
                className="hover:text-black dark:hover:text-white transition-colors"
              >
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link
                to="/compare"
                onClick={() => sounds.click()}
                onMouseEnter={() => sounds.hover()}
                className="hover:text-black dark:hover:text-white transition-colors"
              >
                Compare
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-black dark:text-white/70 font-medium">
                {comparison.title}
              </span>
            </motion.nav>
          </div>
        </section>

        {/* Hero */}
        <section className="relative pt-8 sm:pt-12 pb-12 sm:pb-16">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
              className="text-center"
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-black dark:text-white tracking-tight mb-5">
                {comparison.title}
              </h1>
              <p className="text-lg sm:text-xl text-black dark:text-white/40 max-w-xl mx-auto leading-relaxed">
                {comparison.headline}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Description */}
        <section className="max-w-[900px] mx-auto px-4 sm:px-6 pb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.15,
              ease: [0.19, 1, 0.22, 1],
            }}
            className="text-[17px] text-gray-500 dark:text-white/40 leading-[1.8] text-center max-w-2xl mx-auto"
          >
            {comparison.description}
          </motion.p>
        </section>

        {/* Divider */}
        <div className="max-w-[900px] mx-auto px-4 sm:px-6">
          <div className="h-px bg-gray-100 dark:bg-white/[0.06]" />
        </div>

        {/* Comparison Table */}
        <section className="max-w-[900px] mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400 dark:text-white/30 mb-3 block">
              Feature Comparison
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white tracking-tight">
              Side by Side
            </h2>
          </motion.div>

          {/* Table wrapper */}
          <div className="overflow-x-auto rounded-2xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] shadow-[0_4px_30px_-8px_rgba(0,0,0,0.06)] dark:shadow-none">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-200 dark:border-white/[0.08]">
                  <th className="py-4 px-4 sm:px-6 text-left text-[12px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-white/30 w-[35%]">
                    Feature
                  </th>
                  <th className="py-4 px-4 sm:px-6 text-left text-[12px] font-semibold uppercase tracking-[0.1em] text-black dark:text-white w-[32.5%]">
                    Blip
                  </th>
                  <th className="py-4 px-4 sm:px-6 text-left text-[12px] font-semibold uppercase tracking-[0.1em] text-gray-400 dark:text-white/30 w-[32.5%]">
                    {comparison.competitorName}
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparison.features.map((feature, index) => (
                  <ComparisonRow
                    key={feature.feature}
                    feature={feature}
                    index={index}
                    competitorName={comparison.competitorName}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-[900px] mx-auto px-4 sm:px-6">
          <div className="h-px bg-gray-100 dark:bg-white/[0.06]" />
        </div>

        {/* Verdict Section */}
        <section className="max-w-[900px] mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400 dark:text-white/30 mb-3 block">
              Our Take
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white tracking-tight">
              Verdict
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-white/80 to-white/40 dark:from-white/[0.05] dark:to-white/[0.02] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] shadow-[0_8px_40px_-8px_rgba(0,0,0,0.08)] dark:shadow-none"
          >
            <p className="text-[17px] text-gray-600 dark:text-white/50 leading-[1.8]">
              {comparison.verdict}
            </p>
          </motion.div>
        </section>

        {/* Divider */}
        <div className="max-w-[900px] mx-auto px-4 sm:px-6">
          <div className="h-px bg-gray-100 dark:bg-white/[0.06]" />
        </div>

        {/* CTA Section */}
        <section className="max-w-[900px] mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black dark:text-white tracking-tight mb-5">
              Ready to try Blip?
            </h2>
            <p className="text-lg text-gray-500 dark:text-white/40 max-w-md mx-auto mb-10 leading-relaxed">
              Experience the difference yourself. Join the waitlist and be among
              the first to use Blip Money.
            </p>

            <Link
              to="/waitlist"
              onClick={() => sounds.click()}
              onMouseEnter={() => sounds.hover()}
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-black dark:bg-white text-white dark:text-black font-medium text-[15px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              Join Waitlist
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
        </section>
      </div>
    </>
  );
};

/* ============================================
   MAIN COMPARE PAGE (ROUTER)
   ============================================ */

export default function Compare() {
  const { slug } = useParams<{ slug: string }>();

  /* If a slug is present, find and render the detail page */
  if (slug) {
    const comparison = comparisons.find((c) => c.slug === slug);

    /* Unknown slug → fall back to listing */
    if (!comparison) {
      return <CompareListing />;
    }

    return <CompareDetail comparison={comparison} />;
  }

  /* No slug → render listing page */
  return <CompareListing />;
}
