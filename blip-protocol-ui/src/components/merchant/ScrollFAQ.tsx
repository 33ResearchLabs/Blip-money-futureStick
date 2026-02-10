import React, { useRef, useState } from "react";
import { motion, useScroll, useInView } from "framer-motion";

/* ============================================
   FAQ SECTION — Cascading Card Reveal

   Cards appear one by one as you scroll.
   All revealed cards stay visible.
   Normal flow layout — no overlap.
   ============================================ */

const faqs = [
  {
    question: "How do I receive orders?",
    answer: "Orders appear in your dashboard feed. You accept to lock.",
  },
  {
    question: "Can I adjust pricing to win orders?",
    answer: "Yes, within allowed ranges.",
  },
  {
    question: "What if a user doesn't complete?",
    answer: "The trade follows the escrow timeline and dispute rules.",
  },
  {
    question: "Do I need full KYC?",
    answer: "Not during early Beta. Basic verification is required.",
  },
  {
    question: "Which corridors launch first?",
    answer: "Starting with Dubai-focused corridors, expanding in stages.",
  },
];

const TOTAL_FAQS = faqs.length;

// Scroll timeline: 0–70% cards appear one by one | 70–100% hold
const ITEMS_END = 0.7;

// Smooth ease-out cubic
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

// Returns 0→1 entrance progress for each card
const getCardEntrance = (index: number, progress: number) => {
  const segmentSize = ITEMS_END / TOTAL_FAQS;
  const cardStart = index * segmentSize;
  const cardEnd = cardStart + segmentSize * 0.85;

  if (progress <= cardStart) return 0;
  if (progress >= cardEnd) return 1;
  return (progress - cardStart) / (cardEnd - cardStart);
};

const ScrollFAQ = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  const headingInView = useInView(headingRef, { once: false, margin: "-10%" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [progress, setProgress] = useState(0);

  React.useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => setProgress(v));
    return unsub;
  }, [scrollYProgress]);

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ height: "300vh" }}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/faq.jpg')" }}
        />
        <div className="absolute inset-0 bg-white/30 dark:bg-black/50" />

        <div className="relative z-10 h-full flex flex-col">
          {/* Heading */}
          <motion.div
            ref={headingRef}
            initial={{ opacity: 0, y: 30 }}
            animate={
              headingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center pt-16 sm:pt-20 md:pt-24 px-6"
          >
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-black dark:text-white tracking-tight leading-[1.05]">
              Frequently Asked <span className="text-black/80 dark:text-white/50">Questions</span>
            </h2>
          </motion.div>

          {/* Cards — normal flow, no overlap */}
          <div className="flex-1 flex items-center justify-center px-6 pb-8 overflow-y-auto">
            <div className="w-full max-w-xl space-y-3">
              {faqs.map((faq, index) => {
                const entrance = getCardEntrance(index, progress);
                const eased = easeOut(entrance);

                return (
                  <div
                    key={index}
                    style={{
                      opacity: eased,
                      transform: `translateY(${(1 - eased) * 30}px)`,
                      pointerEvents: entrance > 0.5 ? "auto" : "none",
                    }}
                    className="rounded-2xl border border-black/[0.08] dark:border-white/[0.06] bg-white/80 dark:bg-[#2a2a2a]/80 backdrop-blur-2xl p-6 sm:p-7 shadow-[0_8px_32px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center">
                        <span className="text-xs font-mono text-black/50 dark:text-white/50">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-medium text-black dark:text-white mb-2 leading-snug">
                          {faq.question}
                        </h3>
                        <p className="text-sm sm:text-base text-black/60 dark:text-white/60 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScrollFAQ;
