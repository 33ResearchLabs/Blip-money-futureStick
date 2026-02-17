import { useRef } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import SEO from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { HreflangTags } from "@/components/HreflangTags";
import { useCases } from "@/data/useCasesData";
import { sounds } from "@/lib/sounds";
import { CTAButton } from "@/components/Navbar";

/* ── Pain Point Card ── */
const PainPointCard = ({
  point,
  index,
}: {
  point: string;
  index: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.19, 1, 0.22, 1],
      }}
      className="flex gap-4 p-6 rounded-xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06]"
    >
      {/* Number + warning accent */}
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-red-500/10 dark:bg-red-500/10 flex items-center justify-center">
        <AlertTriangle className="w-5 h-5 text-red-500/70 dark:text-red-400/70" />
      </div>

      <div className="flex-1 min-w-0">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-red-500 dark:text-red-400/50 mb-1 block">
          Pain Point {index + 1}
        </span>
        <p className="text-[15px] text-black dark:text-white/60 leading-relaxed">
          {point}
        </p>
      </div>
    </motion.div>
  );
};

/* ── Solution Card ── */
const SolutionCard = ({
  solution,
  index,
}: {
  solution: { title: string; description: string };
  index: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.19, 1, 0.22, 1],
      }}
      className="group p-6 sm:p-8 rounded-2xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] hover:border-black/15 dark:hover:border-white/[0.12] transition-all duration-500"
      onMouseEnter={() => sounds.hover()}
    >
      {/* Green check accent */}
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/10 flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5 text-emerald-500/70 dark:text-emerald-400/70" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-2 group-hover:text-gray-700 dark:group-hover:text-white/90 transition-colors">
            {solution.title}
          </h3>
          <p className="text-[15px] text-gray-500 dark:text-white/40 leading-relaxed">
            {solution.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

/* ── Main Use Case Detail Page ── */
export default function UseCaseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const useCase = useCases.find((uc) => uc.slug === slug);

  if (!useCase) {
    return <Navigate to="/use-cases" replace />;
  }

  return (
    <>
      <SEO
        title={useCase.seo.title}
        description={useCase.seo.description}
        canonical={useCase.seo.canonical}
        keywords={useCase.seo.keywords}
      />
      <HreflangTags path={`/use-cases/${slug}`} />

      <div className="min-h-screen bg-[#FAF8F5] dark:bg-transparent">
        {/* Hero */}
        <section className="relative pt-32 sm:pt-36 pb-12 sm:pb-16">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Use Cases", href: "/use-cases" }, { label: useCase.title }]} />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
              className="text-center"
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-black dark:text-white tracking-tight mb-5">
                {useCase.title}
              </h1>
              <p className="text-lg sm:text-xl text-black dark:text-white/40 max-w-xl mx-auto leading-relaxed">
                {useCase.headline}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Description */}
        <section className="max-w-[900px] mx-auto px-4 sm:px-6 pb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.19, 1, 0.22, 1] }}
            className="text-[17px] text-gray-500 dark:text-white/40 leading-[1.8] text-center max-w-2xl mx-auto"
          >
            {useCase.description}
          </motion.p>
        </section>

        {/* Divider */}
        <div className="max-w-[900px] mx-auto px-4 sm:px-6">
          <div className="h-px bg-gray-100 dark:bg-white/[0.06]" />
        </div>

        {/* Pain Points Section */}
        <section className="max-w-[900px] mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-red-500 dark:text-red-400/50 mb-3 block">
              The Problem
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white tracking-tight">
              Pain Points
            </h2>
          </motion.div>

          <div className="space-y-4">
            {useCase.painPoints.map((point, index) => (
              <PainPointCard key={index} point={point} index={index} />
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="max-w-[900px] mx-auto px-4 sm:px-6">
          <div className="h-px bg-gray-100 dark:bg-white/[0.06]" />
        </div>

        {/* How Blip Helps Section */}
        <section className="max-w-[900px] mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-emerald-500 dark:text-emerald-400/50 mb-3 block">
              The Solution
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white tracking-tight">
              How Blip Helps
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {useCase.howBlipHelps.map((solution, index) => (
              <SolutionCard key={index} solution={solution} index={index} />
            ))}
          </div>
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
              Ready to get started?
            </h2>
            <p className="text-lg text-gray-500 dark:text-white/40 max-w-md mx-auto mb-10 leading-relaxed">
              Join thousands using Blip for faster, cheaper, and more secure
              crypto settlement.
            </p>

            {/* <Link
              to={useCase.cta.link}
              onClick={() => sounds.click()}
              onMouseEnter={() => sounds.hover()}
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-black dark:bg-white text-white dark:text-black font-medium text-[15px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              {useCase.cta.text}
              <ArrowLeft className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link> */}
            <CTAButton to={useCase.cta.link}className=" h-[48px]">{useCase.cta.text}</CTAButton>
          </motion.div>
        </section>
      </div>
    </>
  );
}
