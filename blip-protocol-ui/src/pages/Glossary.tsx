import { useState, useRef, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import { Search } from "lucide-react";
import SEO from "@/components/SEO";
import {
  glossaryTerms,
  glossaryCategories,
  type GlossaryTerm,
  type GlossaryCategory,
} from "@/data/glossaryData";
import { sounds } from "@/lib/sounds";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

/* -- Single Glossary Term Card -- */
const TermCard = ({
  term,
  index,
}: {
  term: GlossaryTerm;
  index: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      id={term.slug}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.03,
        ease: [0.19, 1, 0.22, 1],
      }}
      onMouseEnter={() => sounds.hover()}
      className="p-5 sm:p-6 rounded-xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] hover:border-black/15 dark:hover:border-white/[0.12] transition-colors duration-300"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-lg font-bold text-black dark:text-white">
          {term.term}
        </h3>
        <span className="flex-shrink-0 text-[11px] font-semibold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-gray-500 dark:text-white/40">
          {term.category}
        </span>
      </div>
      <p className="text-[15px] text-gray-500 dark:text-white/40 leading-relaxed">
        {term.definition}
      </p>
    </motion.div>
  );
};

/* -- Main Glossary Page -- */
export default function Glossary() {
  const [activeCategory, setActiveCategory] = useState<
    GlossaryCategory | "All"
  >("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  /* -- Filtered and grouped terms -- */
  const filteredTerms = useMemo(() => {
    let terms = glossaryTerms;

    if (activeCategory !== "All") {
      terms = terms.filter((t) => t.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      terms = terms.filter(
        (t) =>
          t.term.toLowerCase().includes(query) ||
          t.definition.toLowerCase().includes(query),
      );
    }

    if (activeLetter) {
      terms = terms.filter(
        (t) => t.term.charAt(0).toUpperCase() === activeLetter,
      );
    }

    return terms;
  }, [activeCategory, searchQuery, activeLetter]);

  const groupedTerms = useMemo(() => {
    const groups: Record<string, GlossaryTerm[]> = {};
    const sorted = [...filteredTerms].sort((a, b) =>
      a.term.localeCompare(b.term),
    );

    for (const term of sorted) {
      const letter = term.term.charAt(0).toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(term);
    }

    return groups;
  }, [filteredTerms]);

  /* -- Letters that have terms -- */
  const availableLetters = useMemo(() => {
    const letters = new Set<string>();
    const termsToCheck =
      activeCategory === "All"
        ? glossaryTerms
        : glossaryTerms.filter((t) => t.category === activeCategory);

    for (const term of termsToCheck) {
      letters.add(term.term.charAt(0).toUpperCase());
    }
    return letters;
  }, [activeCategory]);

  return (
    <>
      <SEO
        title="Glossary | Blip Money - Crypto & DeFi Terms Explained"
        description="A comprehensive glossary of crypto, DeFi, payments, and blockchain terms. Learn the key concepts behind Blip Money and decentralized finance."
        canonical="https://blip.money/glossary"
        keywords="crypto glossary, DeFi terms, blockchain glossary, Blip Money glossary, crypto dictionary"
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
                Glossary
              </h1>
              <p className="text-lg sm:text-xl text-black dark:text-white/40 max-w-lg mx-auto leading-relaxed">
                Key terms and concepts in crypto, DeFi, and the Blip protocol
                explained clearly.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Search bar */}
        <section className="max-w-[900px] mx-auto px-4 sm:px-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="relative"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-white/30" />
            <input
              type="text"
              placeholder="Search terms..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setActiveLetter(null);
              }}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] text-black dark:text-white placeholder-gray-400 dark:placeholder-white/30 text-[15px] focus:outline-none focus:border-black/20 dark:focus:border-white/[0.12] transition-colors"
            />
          </motion.div>
        </section>

        {/* Category tabs */}
        <section className="max-w-[900px] mx-auto px-4 sm:px-6 mb-6">
          <motion.div
            className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-gray-100 dark:border-white/[0.06] scrollbar-hide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {["All", ...glossaryCategories].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  sounds.click();
                  setActiveCategory(cat as GlossaryCategory | "All");
                  setActiveLetter(null);
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
                    layoutId="glossaryTabIndicator"
                    className="absolute bottom-0 left-4 right-4 h-[2px] bg-black dark:bg-white rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </button>
            ))}
          </motion.div>
        </section>

        {/* Alphabet navigation */}
        <section className="max-w-[900px] mx-auto px-4 sm:px-6 mb-10">
          <motion.div
            className="flex items-center gap-0.5 flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            <button
              onClick={() => {
                sounds.click();
                setActiveLetter(null);
              }}
              onMouseEnter={() => sounds.hover()}
              className={`w-8 h-8 rounded-lg text-[12px] font-semibold flex items-center justify-center transition-colors ${
                activeLetter === null
                  ? "bg-black dark:bg-white text-white dark:text-black"
                  : "text-gray-400 dark:text-white/35 hover:text-gray-600 dark:hover:text-white/60 hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
              }`}
            >
              All
            </button>
            {ALPHABET.map((letter) => {
              const hasTerms = availableLetters.has(letter);
              return (
                <button
                  key={letter}
                  onClick={() => {
                    if (hasTerms) {
                      sounds.click();
                      setActiveLetter(
                        activeLetter === letter ? null : letter,
                      );
                    }
                  }}
                  onMouseEnter={() => {
                    if (hasTerms) sounds.hover();
                  }}
                  disabled={!hasTerms}
                  className={`w-8 h-8 rounded-lg text-[12px] font-semibold flex items-center justify-center transition-colors ${
                    activeLetter === letter
                      ? "bg-black dark:bg-white text-white dark:text-black"
                      : hasTerms
                        ? "text-gray-500 dark:text-white/50 hover:text-black dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
                        : "text-gray-200 dark:text-white/10 cursor-not-allowed"
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </motion.div>
        </section>

        {/* Terms grouped by letter */}
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 pb-24">
          {Object.keys(groupedTerms)
            .sort()
            .map((letter) => (
              <div key={letter} className="mb-10">
                {/* Letter heading */}
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-2xl font-bold text-black dark:text-white">
                    {letter}
                  </span>
                  <div className="flex-1 h-px bg-gray-100 dark:bg-white/[0.06]" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400 dark:text-white/30">
                    {groupedTerms[letter].length}{" "}
                    {groupedTerms[letter].length === 1 ? "term" : "terms"}
                  </span>
                </div>

                {/* Term cards */}
                <div className="space-y-3">
                  {groupedTerms[letter].map((term, idx) => (
                    <TermCard key={term.slug} term={term} index={idx} />
                  ))}
                </div>
              </div>
            ))}

          {filteredTerms.length === 0 && (
            <div className="text-center py-24">
              <p className="text-lg text-gray-400 dark:text-white/30">
                {searchQuery
                  ? "No terms match your search."
                  : "No terms in this category yet."}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
