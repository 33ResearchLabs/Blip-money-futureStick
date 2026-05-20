/**
 * Programmatic SEO corridor page.
 *
 * One template — many URLs. Each slug in pseoCorridors.ts becomes a page.
 * Renders deep, schema-rich content keyed off the config entry.
 */
import { useState, useMemo } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Check, ChevronDown, ShieldCheck } from "lucide-react";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { HreflangTags } from "@/components/HreflangTags";
import { getPseoCorridor, type PseoCorridor } from "@/data/pseoCorridors";

const EASE = [0.16, 1, 0.3, 1] as const;

function buildSchemas(c: PseoCorridor) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: c.howTo.heading,
    totalTime: "PT1M",
    step: c.howTo.steps.map((s) => ({
      "@type": "HowToStep",
      position: s.step,
      name: s.title,
      text: s.description,
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.blip.money/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: c.h1,
        item: `https://www.blip.money/${c.slug}`,
      },
    ],
  };

  const financialSchema = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: `Blip — ${c.h1}`,
    description: c.description,
    url: `https://www.blip.money/${c.slug}`,
    provider: {
      "@type": "Organization",
      name: "Blip Money",
      url: "https://www.blip.money",
    },
  };

  return { faqSchema, howToSchema, breadcrumbSchema, financialSchema };
}

export default function PseoCorridor() {
  const { slug } = useParams<{ slug: string }>();
  const corridor = slug ? getPseoCorridor(slug) : undefined;
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const schemas = useMemo(
    () => (corridor ? buildSchemas(corridor) : null),
    [corridor],
  );

  if (!corridor) return <Navigate to="/" replace />;

  const isWithoutKyc = corridor.slug.includes("without-kyc");
  const isIndia = corridor.slug.includes("inr") || corridor.slug.includes("india");

  return (
    <>
      <SEO
        title={corridor.title}
        description={corridor.description}
        canonical={`https://www.blip.money/${corridor.slug}`}
        keywords={corridor.keywords}
        type="website"
      />
      <HreflangTags path={`/${corridor.slug}`} />
      {schemas && (
        <>
          <StructuredData type="custom" schema={schemas.faqSchema} />
          <StructuredData type="custom" schema={schemas.howToSchema} />
          <StructuredData type="custom" schema={schemas.breadcrumbSchema} />
          <StructuredData type="custom" schema={schemas.financialSchema} />
        </>
      )}

      <main className="bg-[#FAF8F5] dark:bg-black text-black dark:text-white">
        {/* ── Hero ── */}
        <section className="relative pt-28 pb-16 px-5 sm:pt-32 sm:pb-24 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#ff6b35] mb-5"
            >
              {corridor.eyebrow}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.05 }}
              className="font-display text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.05] mb-6"
            >
              {corridor.h1}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
              className="text-base sm:text-lg text-black/65 dark:text-white/55 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              {corridor.lede}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
              className="inline-flex flex-col sm:flex-row items-stretch sm:items-center gap-3 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/[0.04] px-5 py-4"
            >
              <div className="text-left">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/45 dark:text-white/40">
                  {corridor.rateLabel}
                </div>
                <div className="font-mono text-2xl font-bold tabular-nums mt-0.5">
                  {corridor.indicativeRate}
                </div>
              </div>
              <Link
                to="/rates"
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-[13px] font-bold hover:opacity-90 transition-opacity"
              >
                {corridor.ctaPrimary}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>

            <p className="mt-4 text-[11px] text-black/40 dark:text-white/35">
              Last updated {corridor.lastUpdated} · Rates aggregated live across
              verified merchants
            </p>
          </div>
        </section>

        {/* ── Intro ── */}
        <section className="px-5 pb-16 sm:px-6 sm:pb-20">
          <div className="max-w-3xl mx-auto">
            <p className="text-lg leading-relaxed text-black/75 dark:text-white/65">
              {corridor.intro}
            </p>
            {isWithoutKyc && (
              <div className="mt-6 rounded-xl border border-amber-400/30 bg-amber-50/60 dark:bg-amber-400/[0.04] px-5 py-4 text-[13px] leading-relaxed text-black/70 dark:text-white/60">
                <strong className="font-semibold text-black/85 dark:text-white/85">
                  Compliance note:
                </strong>{" "}
                "Without exchange KYC" refers to not creating an account on a
                centralized exchange. Local tax laws still apply
                {isIndia
                  ? " — in India, the 30% VDA tax on gains and 1% TDS on transfers above ₹10,000/year per counterparty are statutory regardless of platform"
                  : ""}
                . Blip provides export-ready trade history for your tax filing.
                This page is not legal advice; consult a qualified tax advisor
                for your specific situation.
              </div>
            )}
          </div>
        </section>

        {/* ── Comparison table ── */}
        <section className="px-5 py-16 sm:px-6 sm:py-24 border-t border-black/5 dark:border-white/5">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-10 text-center">
              {corridor.comparison.heading}
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/[0.025]">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="bg-black/[0.03] dark:bg-white/[0.04] text-[11px] font-bold uppercase tracking-[0.14em] text-black/55 dark:text-white/45">
                    <th className="px-4 py-4 text-left">Platform</th>
                    <th className="px-4 py-4 text-left">Rate</th>
                    <th className="px-4 py-4 text-left">Fees</th>
                    <th className="px-4 py-4 text-left">KYC</th>
                    <th className="px-4 py-4 text-left">Speed</th>
                    <th className="px-4 py-4 text-left">Custody</th>
                  </tr>
                </thead>
                <tbody>
                  {corridor.comparison.rows.map((r, i) => {
                    const isBlip = r.name.toLowerCase() === "blip";
                    return (
                      <tr
                        key={r.name}
                        className={`text-[13px] border-t border-black/5 dark:border-white/5 ${
                          isBlip
                            ? "bg-[#ff6b35]/[0.06] font-semibold"
                            : i % 2 === 0
                              ? ""
                              : "bg-black/[0.015] dark:bg-white/[0.02]"
                        }`}
                      >
                        <td className="px-4 py-4 font-medium">{r.name}</td>
                        <td className="px-4 py-4">{r.rate}</td>
                        <td className="px-4 py-4">{r.fees}</td>
                        <td className="px-4 py-4">{r.kyc}</td>
                        <td className="px-4 py-4">{r.speed}</td>
                        <td className="px-4 py-4">{r.custody}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="px-5 py-16 sm:px-6 sm:py-24 border-t border-black/5 dark:border-white/5">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-10 text-center">
              {corridor.howTo.heading}
            </h2>
            <ol className="space-y-4">
              {corridor.howTo.steps.map((s) => (
                <li
                  key={s.step}
                  className="flex gap-4 p-5 rounded-2xl bg-white dark:bg-white/[0.025] border border-black/[0.07] dark:border-white/[0.06]"
                >
                  <div className="flex items-center justify-center w-9 h-9 rounded-full bg-black text-white dark:bg-white dark:text-black font-bold text-sm shrink-0">
                    {s.step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-base mb-1">{s.title}</h3>
                    <p className="text-[14px] text-black/65 dark:text-white/55 leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Benefits ── */}
        <section className="px-5 py-16 sm:px-6 sm:py-24 border-t border-black/5 dark:border-white/5">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-10 text-center">
              Why this works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {corridor.benefits.map((b) => (
                <div
                  key={b.title}
                  className="p-5 rounded-2xl bg-white dark:bg-white/[0.025] border border-black/[0.07] dark:border-white/[0.06]"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-4 h-4 text-[#ff6b35]" />
                    <h3 className="font-semibold text-[15px]">{b.title}</h3>
                  </div>
                  <p className="text-[13px] text-black/60 dark:text-white/50 leading-relaxed">
                    {b.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="px-5 py-16 sm:px-6 sm:py-24 border-t border-black/5 dark:border-white/5">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight mb-10 text-center">
              Frequently asked
            </h2>
            <div className="space-y-2">
              {corridor.faqs.map((f, i) => {
                const open = openFaq === i;
                return (
                  <div
                    key={i}
                    className="rounded-xl bg-white dark:bg-white/[0.025] border border-black/[0.07] dark:border-white/[0.06] overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(open ? null : i)}
                      className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                    >
                      <span className="font-medium text-[15px]">{f.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                      />
                    </button>
                    {open && (
                      <div className="px-5 pb-5 text-[14px] text-black/65 dark:text-white/55 leading-relaxed">
                        {f.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Related ── */}
        {corridor.related.length > 0 && (
          <section className="px-5 py-16 sm:px-6 sm:py-20 border-t border-black/5 dark:border-white/5">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.25em] text-black/45 dark:text-white/40 mb-6">
                Related corridors
              </h2>
              <div className="flex flex-wrap justify-center gap-2">
                {corridor.related.map((r) => (
                  <Link
                    key={r.to}
                    to={r.to}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-black/10 dark:border-white/10 text-[13px] font-medium text-black/75 dark:text-white/65 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    {r.label}
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Final CTA ── */}
        <section className="px-5 py-20 sm:px-6 sm:py-28 border-t border-black/5 dark:border-white/5">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-3xl sm:text-5xl font-semibold tracking-tight mb-5">
              Try a live trade.
            </h2>
            <p className="text-base text-black/60 dark:text-white/50 mb-8">
              See real merchant quotes before you commit. No signup required to
              quote.
            </p>
            <Link
              to="/rates"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black text-white dark:bg-white dark:text-black text-[15px] font-bold hover:opacity-90 transition-opacity"
            >
              See live rates
              <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-black/40 dark:text-white/35">
              <Check className="w-3 h-3" /> Non-custodial · Verified merchants ·
              Audit-ready trade history
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
