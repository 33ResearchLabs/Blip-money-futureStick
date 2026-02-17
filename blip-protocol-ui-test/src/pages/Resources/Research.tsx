import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { Clock, ArrowRight, FlaskConical } from "lucide-react";
import SEO from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { HreflangTags } from "@/components/HreflangTags";
import {
  researchArticles,
  researchCategories,
  type ResearchArticle,
  type ResearchCategory,
} from "@/data/researchArticles";
import { sounds } from "@/lib/sounds";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* ── Featured Hero Article (first article, large) ── */
const FeaturedArticle = ({ article }: { article: ResearchArticle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
    >
      <Link
        to={`/research/${article.slug}`}
        onClick={() => sounds.click()}
        onMouseEnter={() => sounds.hover()}
        className="group block"
      >
        <div className="relative overflow-hidden rounded-3xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] shadow-[0_8px_40px_-8px_rgba(0,0,0,0.1)] dark:shadow-none">
          {/* Large cover image */}
          <div className="relative h-[280px] sm:h-[360px] lg:h-[420px] overflow-hidden">
            <img
              src={article.coverImage}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-black via-white/20 dark:via-black/30 to-transparent" />
          </div>

          {/* Content overlay */}
          <div className="relative px-8 sm:px-12 pb-10 -mt-32 sm:-mt-40">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-500 dark:text-white/40 mb-4">
              <FlaskConical className="w-3 h-3" />
              Featured Research
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black dark:text-white tracking-tight leading-[1.1] mb-5 group-hover:text-gray-700 dark:group-hover:text-white/90 transition-colors">
              {article.title}
            </h2>

            <p className="text-lg sm:text-xl text-gray-500 dark:text-white/50 leading-relaxed max-w-2xl mb-6">
              {article.excerpt}
            </p>

            <div className="flex items-center gap-5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 dark:from-white/10 to-gray-300 dark:to-white/5 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-500 dark:text-white/50">
                  {article.author.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-black dark:text-white">
                  {article.author.name}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-white/40">
                  <span>{formatDate(article.date)}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-white/20" />
                  <span>{article.readTime}</span>
                </div>
              </div>

              <div className="ml-auto">
                <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 dark:text-white/40 group-hover:text-black dark:group-hover:text-white transition-colors">
                  Read research
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

/* ── Article Row (Medium-style feed item) ── */
const ArticleRow = ({
  article,
  index,
}: {
  article: ResearchArticle;
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
        delay: index * 0.08,
        ease: [0.19, 1, 0.22, 1],
      }}
    >
      <Link
        to={`/research/${article.slug}`}
        onClick={() => sounds.click()}
        onMouseEnter={() => sounds.hover()}
        className="group block"
      >
        <article className="flex gap-6 sm:gap-10 py-8 sm:py-10">
          {/* Text content */}
          <div className="flex-1 min-w-0">
            {/* Category + date */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/80 dark:text-white/35">
                {article.category}
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-200 dark:bg-white/15" />
              <span className="text-[12px] text-black/80 dark:text-white/30">
                {formatDate(article.date)}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-bold text-black dark:text-white leading-snug mb-2 group-hover:text-gray-600 dark:group-hover:text-white/80 transition-colors">
              {article.title}
            </h3>

            {/* Excerpt */}
            <p className="text-[15px] text-gray-500 dark:text-white/40 leading-relaxed line-clamp-2 mb-4">
              {article.excerpt}
            </p>

            {/* Footer meta */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-200 dark:from-white/10 to-gray-300 dark:to-white/5 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-gray-800 dark:text-white/50">
                    {article.author.name.charAt(0)}
                  </span>
                </div>
                <span className="text-[13px] text-black/80 dark:text-white/50">
                  {article.author.name}
                </span>
              </div>

              <span className="w-1 h-1 rounded-full bg-gray-200 dark:bg-white/15" />

              <span className="flex items-center gap-1 text-[13px] text-black/80 dark:text-white/30">
                <Clock className="w-3 h-3" />
                {article.readTime}
              </span>
            </div>
          </div>

          {/* Right side: thumbnail image */}
          <div className="hidden sm:block flex-shrink-0">
            <div className="w-[200px] h-[134px] rounded-xl overflow-hidden">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
};

/* ── Main Research Page ── */
export default function Research() {
  const [activeCategory, setActiveCategory] = useState<
    ResearchCategory | "All"
  >("All");

  const filteredArticles =
    activeCategory === "All"
      ? researchArticles
      : researchArticles.filter((a) => a.category === activeCategory);

  const featuredArticle = filteredArticles[0];
  const feedArticles = filteredArticles.slice(1);

  return (
    <>
      <SEO
        title="Research | Blip Money - AI Agents, P2P Bots & On-Chain Infrastructure"
        description="In-depth research on AI-powered crypto bots, autonomous agents, Telegram trading, MEV protection, and the future of decentralized P2P payments."
        canonical="https://blip.money/research"
        keywords="AI crypto research, P2P trading bots, autonomous agents, Telegram bots crypto, MEV, DeFi research, blockchain AI"
      />
      <HreflangTags path="/research" />

      <div className="min-h-screen bg-[#FAF8F5] dark:bg-transparent">
        {/* Hero */}
        <section className="relative pt-32 sm:pt-36 pb-12 sm:pb-16">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Research" }]} />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
              className="text-center"
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-black dark:text-white tracking-tight mb-5">
                Research
              </h1>
              <p className="text-lg sm:text-xl text-black dark:text-white/40 max-w-lg mx-auto leading-relaxed">
                Deep dives into AI agents, autonomous trading, and the
                infrastructure powering the next era of payments.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Category tabs */}
        <section className="max-w-[900px] mx-auto px-4 sm:px-6 mb-12">
          <motion.div
            className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-gray-100 dark:border-white/[0.06] scrollbar-hide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {["All", ...researchCategories].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  sounds.click();
                  setActiveCategory(cat as ResearchCategory | "All");
                }}
                onMouseEnter={() => sounds.hover()}
                className={`relative px-4 py-3 text-[13px] font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? "text-black dark:text-white"
                    : "text-gray-400 dark:text-white/35 hover:text-gray-600 dark:hover:text-white/60"
                }`}
              >
                {cat}
                {activeCategory === cat && (
                  <motion.div
                    layoutId="researchTabIndicator"
                    className="absolute bottom-0 left-4 right-4 h-[2px] bg-black dark:bg-white rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </button>
            ))}
          </motion.div>
        </section>

        <div className="max-w-[900px] mx-auto px-4 sm:px-6 pb-24">
          {/* Featured article */}
          {featuredArticle && (
            <div className="mb-16">
              <FeaturedArticle
                key={featuredArticle.id}
                article={featuredArticle}
              />
            </div>
          )}

          {/* Divider label */}
          {feedArticles.length > 0 && (
            <div className="flex items-center gap-4 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-black/80 dark:text-white/30">
                All Research
              </span>
              <div className="flex-1 h-px bg-gray-100 dark:bg-white/[0.06]" />
            </div>
          )}

          {/* Feed articles */}
          <div className="divide-y divide-gray-100 dark:divide-white/[0.06]">
            {feedArticles.map((article, index) => (
              <ArticleRow key={article.id} article={article} index={index} />
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-24">
              <p className="text-lg text-gray-400 dark:text-white/30">
                No research articles in this category yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
