import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Tag, Calendar } from "lucide-react";
import SEO from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { HreflangTags } from "@/components/HreflangTags";
import {
  changelogEntries,
  type ChangelogEntry,
  type ChangelogType,
} from "@/data/changelogData";
import { sounds } from "@/lib/sounds";

/* -- Type badge color mapping -- */
const typeConfig: Record<
  ChangelogType,
  { label: string; bg: string; text: string; dot: string }
> = {
  feature: {
    label: "Feature",
    bg: "bg-emerald-500/10 dark:bg-emerald-400/10",
    text: "text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500 dark:bg-emerald-400",
  },
  improvement: {
    label: "Improvement",
    bg: "bg-blue-500/10 dark:bg-blue-400/10",
    text: "text-blue-600 dark:text-blue-400",
    dot: "bg-blue-500 dark:bg-blue-400",
  },
  fix: {
    label: "Fix",
    bg: "bg-amber-500/10 dark:bg-amber-400/10",
    text: "text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500 dark:bg-amber-400",
  },
  security: {
    label: "Security",
    bg: "bg-red-500/10 dark:bg-red-400/10",
    text: "text-red-600 dark:text-red-400",
    dot: "bg-red-500 dark:bg-red-400",
  },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/* -- Single Timeline Entry -- */
const TimelineEntry = ({
  entry,
  index,
  isLast,
}: {
  entry: ChangelogEntry;
  index: number;
  isLast: boolean;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const config = typeConfig[entry.type];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.19, 1, 0.22, 1],
      }}
      className="relative flex gap-6 sm:gap-8"
    >
      {/* Timeline line + dot */}
      <div className="flex flex-col items-center flex-shrink-0">
        {/* Dot */}
        <div className="relative z-10 w-3 h-3 rounded-full border-2 border-black/20 dark:border-white/20 bg-[#FAF8F5] dark:bg-black mt-2">
          <div
            className={`absolute inset-0.5 rounded-full ${config.dot} opacity-60`}
          />
        </div>
        {/* Line */}
        {!isLast && (
          <div className="w-px flex-1 bg-gradient-to-b from-black/10 dark:from-white/10 to-transparent min-h-[40px]" />
        )}
      </div>

      {/* Content card */}
      <div
        className="flex-1 pb-10 sm:pb-12"
        onMouseEnter={() => sounds.hover()}
      >
        <div className="p-5 sm:p-6 rounded-xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] hover:border-black/15 dark:hover:border-white/[0.12] transition-colors duration-300">
          {/* Header row: version + type badge + date */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {/* Version badge */}
            <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-black dark:text-white bg-black/[0.05] dark:bg-white/[0.08] px-2.5 py-1 rounded-md">
              <Tag className="w-3 h-3" />
              v{entry.version}
            </span>

            {/* Type badge */}
            <span
              className={`inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] px-2.5 py-1 rounded-full ${config.bg} ${config.text}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${config.dot}`}
              />
              {config.label}
            </span>

            {/* Date */}
            <span className="flex items-center gap-1.5 text-[12px] text-gray-400 dark:text-white/30 ml-auto">
              <Calendar className="w-3 h-3" />
              {formatDate(entry.date)}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl sm:text-2xl font-bold text-black dark:text-white tracking-tight mb-4">
            {entry.title}
          </h3>

          {/* Changes list */}
          <ul className="space-y-2.5">
            {entry.changes.map((change, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black/20 dark:bg-white/20 mt-2 flex-shrink-0" />
                <span className="text-[15px] text-gray-500 dark:text-white/40 leading-relaxed">
                  {change}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

/* -- Main Changelog Page -- */
export default function Changelog() {
  return (
    <>
      <SEO
        title="Changelog | Blip Money - Product Updates & Release Notes"
        description="Track the latest updates, features, improvements, and fixes across the Blip Money platform. See our full development history and release timeline."
        canonical="https://blip.money/changelog"
        keywords="Blip Money changelog, product updates, release notes, Blip features, development timeline"
      />
      <HreflangTags path="/changelog" />

      <div className="min-h-screen bg-[#FAF8F5] dark:bg-transparent">
        {/* Hero */}
        <section className="relative pt-32 sm:pt-36 pb-12 sm:pb-16">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Changelog" }]} />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
              className="text-center"
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-black dark:text-white tracking-tight mb-5">
                Changelog
              </h1>
              <p className="text-lg sm:text-xl text-black dark:text-white/40 max-w-lg mx-auto leading-relaxed">
                A timeline of every feature, improvement, and fix shipped across
                the Blip protocol.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Version count label */}
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 mb-8">
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400 dark:text-white/30">
              {changelogEntries.length} Releases
            </span>
            <div className="flex-1 h-px bg-gray-100 dark:bg-white/[0.06]" />

            {/* Legend */}
            <div className="hidden sm:flex items-center gap-4">
              {(Object.keys(typeConfig) as ChangelogType[]).map((type) => (
                <span
                  key={type}
                  className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-white/30"
                >
                  <span
                    className={`w-2 h-2 rounded-full ${typeConfig[type].dot}`}
                  />
                  {typeConfig[type].label}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Timeline */}
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 pb-24">
          {changelogEntries.map((entry, index) => (
            <TimelineEntry
              key={entry.version}
              entry={entry}
              index={index}
              isLast={index === changelogEntries.length - 1}
            />
          ))}
        </div>
      </div>
    </>
  );
}
