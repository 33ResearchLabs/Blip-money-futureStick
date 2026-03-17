import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import SEO from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { HreflangTags } from "@/components/HreflangTags";
import {
  faqItems,
  faqCategories,
  type FAQItem,
  type FAQCategory,
} from "@/data/faqData";
import { sounds } from "@/lib/sounds";

/* -- Single FAQ Accordion Item -- */
const FAQAccordionItem = ({
  item,
  index,
  isExpanded,
  onToggle,
}: {
  item: FAQItem;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [visibleCount, setVisibleCount] = useState(8);


  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.04,
        ease: [0.19, 1, 0.22, 1],
      }}
      className="border-b border-gray-100 dark:border-white/[0.06]"
    >
      <button
        onClick={() => {
          sounds.click();
          onToggle();
        }}
        onMouseEnter={() => sounds.hover()}
        className="w-full flex items-center justify-between gap-4 py-6 text-left group"
      >
        <h3 className="text-base sm:text-lg font-semibold text-black dark:text-white group-hover:text-gray-600 dark:group-hover:text-white/80 transition-colors pr-4">
          {item.question}
        </h3>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
          className="flex-shrink-0 w-8 h-8 rounded-full bg-black/[0.04] dark:bg-white/[0.06] flex items-center justify-center"
        >
          <ChevronDown className="w-4 h-4 text-black/50 dark:text-white/50" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-6 pr-12">
              <p className="text-[15px] text-gray-500 dark:text-white/40 leading-relaxed">
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* -- Main FAQ Page -- */
export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState<FAQCategory | "All">(
    "All",
  );
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const filteredItems =
    activeCategory === "All"
      ? faqItems
      : faqItems.filter((item) => item.category === activeCategory);

  const toggleItem = (index: number) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  /* -- JSON-LD FAQPage Schema -- */
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <>
      <SEO
        title="FAQ | Blip Money - Frequently Asked Questions"
        description="Find answers to common questions about Blip Money, crypto payments, escrow security, merchant tools, tokenomics, and technical details."
        canonical="https://blip.money/faq"
        keywords="Blip Money FAQ, crypto payments FAQ, escrow FAQ, Solana FAQ, BLIP token FAQ"
      />
      <HreflangTags path="/faq" />

      <div className="min-h-screen bg-[#FAF8F5] dark:bg-transparent">
        {/* Hero */}
        <section ref={ref} className="relative pt-32 sm:pt-36 pb-12 sm:pb-16">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <Breadcrumbs
              items={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
              className="text-center"
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-black dark:text-white tracking-tight mb-5">
                FAQ
              </h1>
              <p className="text-lg sm:text-xl text-black dark:text-white/40 max-w-lg mx-auto leading-relaxed">
                Everything you need to know about Blip Money, from getting
                started to advanced protocol details.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Category tabs */}
        <section className="max-w-[900px] mx-auto px-4 sm:px-6 mb-12">
          <motion.div
            className="flex items-center gap-1 overflow-x-auto pb-1  dark:border-white/[0.06] scrollbar-hide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {["All", ...faqCategories].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  sounds.click();
                  setActiveCategory(cat as FAQCategory | "All");
                  setExpandedItems(new Set());
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
                    layoutId="faqTabIndicator"
                    className="absolute bottom-0 left-4 right-4 h-[2px] bg-black dark:bg-white rounded-full"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </button>
            ))}
          </motion.div>
        </section>

        {/* FAQ Items */}
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 pb-24">
          {/* Count label */}
          {/* {filteredItems.length > 0 && (
            <div className="flex items-center gap-4 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400 dark:text-white/30">
                {filteredItems.length}{" "}
                {filteredItems.length === 1 ? "Question" : "Questions"}
              </span>
              <div className="flex-1 h-px bg-gray-100 dark:bg-white/[0.06]" />
            </div>
          )} */}

          {/* Accordion list */}
          {/* <div>
            {filteredItems.map((item, index) => (
              <FAQAccordionItem
                key={`${activeCategory}-${index}`}
                item={item}
                index={index}
                isExpanded={expandedItems.has(index)}
                onToggle={() => toggleItem(index)}
              />
            ))}
          </div> */}

          <div className="space-y-4  ">
            {filteredItems.map((faq, i) => (
              <motion.div
                key={`${activeCategory}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 * i }}
                className="border border-black/[0.08] dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.02] backdrop-blur-xl rounded-xl overflow-hidden"
              >
                <button
                  className="w-full flex justify-between items-center p-5 text-left hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                  onClick={() => {
                    setOpenFaq(openFaq === i ? null : i);
                    sounds.click();
                  }}
                  onMouseEnter={() => sounds.hover()}
                >
                  <span className="font-medium text-black dark:text-white text-sm pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-black/40 dark:text-white/40 flex-shrink-0 transition-transform duration-300 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className="overflow-hidden bg-gray-200 dark:bg-black"
                    >
                      <div className="px-5 pb-5 text-sm text-black dark:text-white/40 leading-relaxed border-t border-black/[0.06] dark:border-white/[0.06] pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-24">
              <p className="text-lg text-gray-400 dark:text-white/30">
                No questions in this category yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
