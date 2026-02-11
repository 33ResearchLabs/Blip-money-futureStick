import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Calendar,
  ArrowUpRight,
  Download,
  FileText,
  Package,
  Mail,
  ArrowRight,
} from "lucide-react";
import SEO from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { HreflangTags } from "@/components/HreflangTags";
import { sounds } from "@/lib/sounds";

/* ============================================
   PRESS & MEDIA PAGE
   Matching the Blip Money design system
   ============================================ */

const easeOut = [0.19, 1, 0.22, 1] as const;

/* -- Data -- */

const pressReleases = [
  {
    date: "2025-12-15",
    title: "Blip Money Launches Non-Custodial Payment Protocol on Solana Devnet",
    description:
      "Blip Money goes live on Solana devnet, enabling stablecoin settlements for merchants and consumers with on-chain escrow protection. Public testing begins with 20 early users.",
  },
  {
    date: "2025-06-20",
    title: "Blip Protocol Introduces On-Chain Escrow with Automated Dispute Resolution",
    description:
      "A trustless escrow system that leverages smart contracts to resolve payment disputes without intermediaries. Currently in development and internal testing.",
  },
  {
    date: "2025-02-05",
    title: "Blip Money Announces $BLIP Token and Community Airdrop Program",
    description:
      "The BLIP token powers governance, staking rewards, and cashback incentives across the protocol. Early users qualify for the genesis airdrop.",
  },
];

const mediaMentions: { publication: string; title: string; date: string }[] = [];

const brandAssets = [
  {
    icon: FileText,
    title: "Logo Package",
    description:
      "Blip Money wordmark with Zap icon in SVG format.",
    href: "/brand/blip-logo-dark.svg",
  },
  {
    icon: Package,
    title: "Icon Only",
    description:
      "Standalone Zap icon in SVG — black, white, and brand orange variants.",
    href: "/brand/blip-icon-orange.svg",
  },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* -- Animated Section Wrapper -- */

const AnimatedSection = ({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: easeOut }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ============================================
   PRESS RELEASE CARD
   ============================================ */

const PressReleaseCard = ({
  release,
  index,
}: {
  release: (typeof pressReleases)[0];
  index: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: easeOut }}
    >
      <div
        onMouseEnter={() => sounds.hover()}
        className="group py-8 sm:py-10 border-b border-gray-100 dark:border-white/[0.06] cursor-default"
      >
        {/* Date */}
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-3.5 h-3.5 text-gray-400 dark:text-white/30" />
          <span className="text-[12px] text-gray-400 dark:text-white/30">
            {formatDate(release.date)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-bold text-black dark:text-white leading-snug mb-3 group-hover:text-gray-600 dark:group-hover:text-white/80 transition-colors">
          {release.title}
        </h3>

        {/* Description */}
        <p className="text-[15px] text-gray-500 dark:text-white/40 leading-relaxed max-w-3xl">
          {release.description}
        </p>
      </div>
    </motion.div>
  );
};

/* ============================================
   MEDIA MENTION CARD
   ============================================ */

const MediaMentionCard = ({
  mention,
  index,
}: {
  mention: (typeof mediaMentions)[0];
  index: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: easeOut }}
      onMouseEnter={() => sounds.hover()}
      className="group p-6 sm:p-8 rounded-2xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] hover:border-black/[0.15] dark:hover:border-white/[0.12] transition-all duration-300 cursor-pointer"
    >
      {/* Publication name */}
      <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400 dark:text-white/35 block mb-3">
        {mention.publication}
      </span>

      {/* Article title */}
      <h3 className="text-base sm:text-lg font-semibold text-black dark:text-white leading-snug mb-4 group-hover:text-gray-600 dark:group-hover:text-white/80 transition-colors">
        {mention.title}
      </h3>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-gray-400 dark:text-white/30">
          {formatDate(mention.date)}
        </span>
        <ArrowUpRight className="w-4 h-4 text-gray-300 dark:text-white/20 group-hover:text-black dark:group-hover:text-white transition-colors" />
      </div>
    </motion.div>
  );
};

/* ============================================
   BRAND ASSET CARD
   ============================================ */

const BrandAssetCard = ({
  asset,
  index,
}: {
  asset: (typeof brandAssets)[0];
  index: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1, ease: easeOut }}
    >
      <a
        href={asset.href}
        download
        onMouseEnter={() => sounds.hover()}
        onClick={() => sounds.click()}
        className="group block p-6 sm:p-8 rounded-2xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06] hover:border-black/[0.15] dark:hover:border-white/[0.12] transition-all duration-300 cursor-pointer"
      >
        <div className="flex items-start justify-between mb-5">
          <div className="w-12 h-12 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] flex items-center justify-center group-hover:scale-110 transition-transform">
            <asset.icon className="w-5 h-5 text-black dark:text-white" />
          </div>
          <Download className="w-4 h-4 text-gray-300 dark:text-white/20 group-hover:text-black dark:group-hover:text-white transition-colors" />
        </div>

        <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
          {asset.title}
        </h3>
        <p className="text-[14px] text-gray-500 dark:text-white/40 leading-relaxed">
          {asset.description}
        </p>
      </a>
    </motion.div>
  );
};

/* ============================================
   MAIN PRESS PAGE
   ============================================ */

export default function Press() {
  return (
    <>
      <SEO
        title="Press & Media - Blip Money News & Coverage"
        description="Read the latest Blip Money press releases, media coverage, and download brand assets. Stay up to date with our announcements and milestones."
        canonical="https://blip.money/press"
        keywords="Blip Money press, Blip Money news, crypto payments press release, Blip media coverage"
      />
      <HreflangTags path="/press" />

      <div className="min-h-screen bg-[#FAF8F5] dark:bg-transparent">
        {/* ── Hero ── */}
        <section className="relative pt-32 sm:pt-36 pb-12 sm:pb-16">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Press" }]} />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeOut }}
              className="text-center"
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-black dark:text-white tracking-tight mb-5">
                Press & Media
              </h1>
              <p className="text-lg sm:text-xl text-black dark:text-white/40 max-w-lg mx-auto leading-relaxed">
                The latest news, announcements, and media coverage from the Blip
                Money team.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Press Releases ── */}
        <section className="py-8 sm:py-16">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <AnimatedSection>
              <div className="flex items-center gap-4 mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400 dark:text-white/30">
                  Press Releases
                </span>
                <div className="flex-1 h-px bg-gray-100 dark:bg-white/[0.06]" />
              </div>
            </AnimatedSection>

            <div>
              {pressReleases.map((release, index) => (
                <PressReleaseCard
                  key={release.date + release.title}
                  release={release}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── In The Media ── */}
        {mediaMentions.length > 0 && (
        <section className="py-16 sm:py-24">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
            <AnimatedSection className="text-center mb-14">
              <span className="text-[11px] uppercase tracking-[0.3em] text-black/40 dark:text-white/40 block mb-5">
                In The Media
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white tracking-tight">
                What others are saying
              </h2>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {mediaMentions.map((mention, index) => (
                <MediaMentionCard
                  key={mention.publication + mention.date}
                  mention={mention}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>
        )}

        {/* ── Brand Assets ── */}
        <section className="py-16 sm:py-24">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
            <AnimatedSection className="text-center mb-14">
              <span className="text-[11px] uppercase tracking-[0.3em] text-black/40 dark:text-white/40 block mb-5">
                Brand Assets
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white tracking-tight mb-4">
                Download brand resources
              </h2>
              <p className="text-lg text-gray-500 dark:text-white/40 max-w-md mx-auto">
                Official logos, guidelines, and media kit for press and partner
                use.
              </p>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {brandAssets.map((asset, index) => (
                <BrandAssetCard
                  key={asset.title}
                  asset={asset}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── Media Contact ── */}
        <section className="py-16 sm:py-24 pb-24 sm:pb-32">
          <div className="max-w-[900px] mx-auto px-4 sm:px-6">
            <AnimatedSection className="text-center">
              <div className="p-10 sm:p-16 rounded-3xl bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl border border-black/[0.08] dark:border-white/[0.06]">
                <Mail className="w-10 h-10 text-black dark:text-white mx-auto mb-6" />
                <h2 className="text-3xl sm:text-4xl font-bold text-black dark:text-white tracking-tight mb-4">
                  Media Inquiries
                </h2>
                <p className="text-lg text-gray-500 dark:text-white/40 max-w-md mx-auto mb-6 leading-relaxed">
                  For press inquiries, interviews, and media requests, reach out
                  to our communications team.
                </p>

                <a
                  href="mailto:press@blip.money"
                  onClick={() => sounds.click()}
                  onMouseEnter={() => sounds.hover()}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold hover:opacity-90 transition-all mb-8"
                >
                  <Mail className="w-4 h-4" />
                  press@blip.money
                </a>

                {/* Social links */}
                <div className="flex items-center justify-center gap-6 pt-6 border-t border-gray-100 dark:border-white/[0.06]">
                  {[
                    { label: "Twitter / X", href: "#" },
                    { label: "Telegram", href: "#" },
                    { label: "Discord", href: "#" },
                    { label: "LinkedIn", href: "#" },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={() => sounds.hover()}
                      className="text-[13px] font-medium text-gray-400 dark:text-white/35 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1"
                    >
                      {social.label}
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </div>
    </>
  );
}
