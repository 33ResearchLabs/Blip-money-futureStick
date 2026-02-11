import { useParams, Navigate, Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowLeft, Clock, ArrowRight, FlaskConical } from "lucide-react";
import SEO from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { HreflangTags } from "@/components/HreflangTags";
import StructuredData, {
  createArticleSchema,
  createBreadcrumbSchema,
} from "@/components/StructuredData";
import {
  researchArticles,
  type ResearchArticle as ResearchArticleType,
  type ResearchContentSection,
} from "@/data/researchArticles";
import { sounds } from "@/lib/sounds";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function renderContentSection(section: ResearchContentSection, index: number) {
  switch (section.type) {
    case "heading":
      return (
        <h2
          key={index}
          className="text-2xl sm:text-3xl font-bold mt-12 mb-4"
        >
          {section.content}
        </h2>
      );
    case "subheading":
      return (
        <h3
          key={index}
          className="text-xl sm:text-2xl font-semibold mt-10 mb-3"
        >
          {section.content}
        </h3>
      );
    case "paragraph":
      return (
        <p
          key={index}
          className="mb-6 leading-[1.8] text-[17px] text-black dark:text-white/40"
        >
          {section.content}
        </p>
      );
    case "list":
      return (
        <ul key={index} className="mb-6 space-y-3">
          {section.items?.map((item, i) => (
            <li key={i} className="leading-[1.7]">
              {item}
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote
          key={index}
          className="my-10 text-xl sm:text-2xl leading-[1.5]"
        >
          {section.content}
        </blockquote>
      );
    case "callout":
      return (
        <div
          key={index}
          className="not-prose my-10 p-8 rounded-2xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] shadow-[0_4px_30px_-8px_rgba(0,0,0,0.08)] dark:shadow-none"
        >
          <p className="text-black dark:text-white/40 text-[16px] leading-[1.8]">
            {section.content}
          </p>
        </div>
      );
    default:
      return null;
  }
}

/* ── Related Article Row ── */
const RelatedRow = ({
  article,
  index,
}: {
  article: ResearchArticleType;
  index: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 15 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.4,
        delay: index * 0.08,
        ease: [0.19, 1, 0.22, 1],
      }}
    >
      <Link
        to={`/research/${article.slug}`}
        onClick={() => sounds.click()}
        onMouseEnter={() => sounds.hover()}
        className="group block py-6"
      >
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400 dark:text-white/30 mb-1 block">
              {article.category}
            </span>
            <h4 className="text-lg font-bold text-black dark:text-white leading-snug group-hover:text-gray-600 dark:group-hover:text-white/80 transition-colors">
              {article.title}
            </h4>
            <p className="text-sm text-gray-400 dark:text-white/35 mt-1 line-clamp-1">
              {article.excerpt}
            </p>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 dark:text-white/30">
              <span>{formatDate(article.date)}</span>
              <span className="w-1 h-1 rounded-full bg-gray-200 dark:bg-white/15" />
              <span>{article.readTime}</span>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-300 dark:text-white/15 group-hover:text-gray-500 dark:group-hover:text-white/40 group-hover:translate-x-1 transition-all mt-2 flex-shrink-0" />
        </div>
      </Link>
    </motion.div>
  );
};

export default function ResearchArticle() {
  const { slug } = useParams<{ slug: string }>();
  const article = researchArticles.find((a) => a.slug === slug);

  if (!article) {
    return <Navigate to="/research" replace />;
  }

  const relatedArticles = researchArticles
    .filter((a) => a.id !== article.id)
    .slice(0, 3);

  return (
    <>
      <SEO
        title={article.seo.title}
        description={article.seo.description}
        canonical={article.seo.canonical}
        keywords={article.seo.keywords}
      />

      <StructuredData
        type="custom"
        schema={createArticleSchema({
          headline: article.seo.title,
          description: article.seo.description,
          image: article.coverImage.startsWith("http") ? article.coverImage : `https://blip.money${article.coverImage}`,
          datePublished: article.date,
          author: article.author.name,
        })}
      />

      <StructuredData
        type="custom"
        schema={createBreadcrumbSchema([
          { name: "Home", url: "https://blip.money" },
          { name: "Research", url: "https://blip.money/research" },
          { name: article.title, url: article.seo.canonical },
        ])}
      />
      <HreflangTags path={`/research/${slug}`} />

      <div className="min-h-screen bg-[#FAF8F5] dark:bg-transparent">
        {/* Article Header */}
        <header className="relative pt-32 sm:pt-40 pb-10 sm:pb-14">
          <div className="max-w-[720px] mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            >
              <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Research", href: "/research" }, { label: article.title }]} />

              {/* Back link */}
              <Link
                to="/research"
                onClick={() => sounds.click()}
                onMouseEnter={() => sounds.hover()}
                className="inline-flex items-center gap-2 text-sm text-gray-400 dark:text-white/40 mb-10 hover:text-black dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                All research
              </Link>

              {/* Category */}
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400 dark:text-white/35 mb-5">
                <FlaskConical className="w-3 h-3" />
                {article.category}
              </span>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black dark:text-white tracking-tight leading-[1.08] mb-8">
                {article.title}
              </h1>

              {/* Excerpt */}
              <p className="text-xl sm:text-2xl text-gray-400 dark:text-white/45 leading-relaxed mb-10">
                {article.excerpt}
              </p>

              {/* Hero image */}
              <div className="rounded-2xl overflow-hidden mb-10">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-[240px] sm:h-[360px] object-cover"
                />
              </div>

              {/* Author row */}
              <div className="flex items-center gap-4 pb-10 border-b border-gray-100 dark:border-white/[0.06]">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 dark:from-white/10 to-gray-300 dark:to-white/5 flex items-center justify-center">
                  <span className="text-base font-bold text-gray-500 dark:text-white/50">
                    {article.author.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-black dark:text-white">
                    {article.author.name}
                  </p>
                  <div className="flex items-center gap-3 text-[13px] text-gray-400 dark:text-white/40">
                    <span>{formatDate(article.date)}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-white/20" />
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </header>

        {/* Article Content */}
        <motion.div
          className="max-w-[720px] mx-auto px-4 sm:px-6 pb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
        >
          <div className="prose prose-lg dark:prose-invert prose-headings:tracking-tight prose-headings:text-black dark:prose-headings:text-white prose-p:text-black dark:prose-p:text-white/40 prose-a:text-neon-mint prose-blockquote:border-l-2 prose-blockquote:border-gray-200 dark:prose-blockquote:border-white/10 prose-blockquote:text-gray-500 dark:prose-blockquote:text-white/50 prose-blockquote:font-normal prose-blockquote:not-italic prose-li:text-black dark:prose-li:text-white/40 max-w-none">
            {article.content.map((section, i) =>
              renderContentSection(section, i),
            )}
          </div>
        </motion.div>

        {/* Related Articles */}
        <section className="border-t border-gray-100 dark:border-white/[0.06]">
          <div className="max-w-[720px] mx-auto px-4 sm:px-6 py-16">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400 dark:text-white/30 mb-2">
              More Research
            </h3>
            <div className="divide-y divide-gray-100 dark:divide-white/[0.06]">
              {relatedArticles.map((a, i) => (
                <RelatedRow key={a.id} article={a} index={i} />
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/[0.06]">
              <Link
                to="/research"
                onClick={() => sounds.click()}
                onMouseEnter={() => sounds.hover()}
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors"
              >
                View all research
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Cross-links to other content */}
        <section className="border-t border-gray-100 dark:border-white/[0.06] bg-[#FAF8F5]/50 dark:bg-white/[0.01]">
          <div className="max-w-[720px] mx-auto px-4 sm:px-6 py-12">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400 dark:text-white/30 mb-6">
              Explore More
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "FAQ", href: "/faq", desc: "Common questions" },
                { label: "Glossary", href: "/glossary", desc: "Crypto terms" },
                { label: "Use Cases", href: "/use-cases", desc: "Who it's for" },
                { label: "Compare", href: "/compare", desc: "How we differ" },
              ].map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="group p-4 rounded-xl bg-white/60 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] hover:border-black/[0.12] dark:hover:border-white/[0.12] transition-colors"
                >
                  <span className="block text-sm font-semibold text-black dark:text-white group-hover:text-gray-600 dark:group-hover:text-white/80 transition-colors">{link.label}</span>
                  <span className="block text-xs text-gray-400 dark:text-white/30 mt-1">{link.desc}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
