import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import sounds from "@/lib/sounds";
import { EditableText } from "@/components/dashboard/Editable";

const faqs = [
  {
    key: "item1",
    question: "How do I receive orders?",
    answer: "Orders appear in your dashboard feed. You accept to lock.",
  },
  {
    key: "item2",
    question: "Can I adjust pricing to win orders?",
    answer: "Yes, within allowed ranges.",
  },
  {
    key: "item3",
    question: "What if a user doesn't complete?",
    answer: "The trade follows the escrow timeline and dispute rules.",
  },
  {
    key: "item4",
    question: "Do I need full KYC?",
    answer: "Not during early Beta. Basic verification is required.",
  },
  {
    key: "item5",
    question: "Which corridors launch first?",
    answer: "Starting with Dubai-focused corridors, expanding in stages.",
  },
];

const ScrollFAQ = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section className="py-24 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-black dark:text-white">
            <EditableText id="merchant.faq.title" default="Frequently Asked Questions" as="span" />
          </h2>

          <p className="mt-4 text-black/60 dark:text-white/60 text-sm md:text-base max-w-xl mx-auto">
            <EditableText id="merchant.faq.sub" default="Everything you need to know about how Blip works, onboarding,  and trading flow." multiline />
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
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
                  <EditableText id={`merchant.faq.${faq.key}.question`} default={faq.question} as="span" />
                </span>

                <ChevronDown
                  className={`w-4 h-4 text-black/40 dark:text-white/40 transition-transform duration-300 ${
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
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-4 text-sm text-black dark:text-white/60 border-t border-black/[0.06] dark:border-white/[0.06] bg-black/[0.03] dark:bg-white/[0.04]">
                      <EditableText id={`merchant.faq.${faq.key}.answer`} default={faq.answer} multiline />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ScrollFAQ;
