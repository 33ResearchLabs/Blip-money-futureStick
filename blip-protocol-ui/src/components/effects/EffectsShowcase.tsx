import { motion } from "framer-motion";
import {
  TextShimmer,
  MagneticHover,
  HoverTooltip,
  GradientText,
  GlowCard,
  MicroBounce,
  KineticText,
  ProgressiveReveal,
  CursorFollower,
  BorderGlow,
  ScrollRevealBlur,
} from "./SubtleEffects";

/* ============================================
   EFFECTS SHOWCASE COMPONENT
   Demonstrates all available subtle effects
   ============================================ */

export const EffectsShowcase = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black py-20 px-6">
      <div className="max-w-6xl mx-auto space-y-20">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-black dark:text-white">
            <GradientText animated>Subtle Effects</GradientText> Library
          </h1>
          <p className="text-lg text-black/60 dark:text-white/60">
            Minimal, classy animations inspired by top Web3 & AI startups
          </p>
        </div>

        {/* Section 1: Text Effects */}
        <section className="space-y-8">
          <h2 className="text-3xl font-semibold text-black dark:text-white">
            Text Effects
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Text Shimmer */}
            <div className="p-8 rounded-2xl border border-black/10 dark:border-white/10 space-y-4">
              <h3 className="text-sm font-mono text-black/50 dark:text-white/50">
                TextShimmer
              </h3>
              <div className="text-3xl font-bold">
                <TextShimmer>Amazing Feature</TextShimmer>
              </div>
              <p className="text-sm text-black/60 dark:text-white/60">
                Subtle shimmer that passes over text periodically
              </p>
            </div>

            {/* Gradient Text */}
            <div className="p-8 rounded-2xl border border-black/10 dark:border-white/10 space-y-4">
              <h3 className="text-sm font-mono text-black/50 dark:text-white/50">
                GradientText
              </h3>
              <div className="text-3xl font-bold">
                <GradientText animated>Beautiful Gradient</GradientText>
              </div>
              <p className="text-sm text-black/60 dark:text-white/60">
                Animated gradient text effect
              </p>
            </div>

            {/* Kinetic Text */}
            <div className="p-8 rounded-2xl border border-black/10 dark:border-white/10 space-y-4">
              <h3 className="text-sm font-mono text-black/50 dark:text-white/50">
                KineticText
              </h3>
              <div className="text-3xl font-bold">
                <KineticText>Hover over me</KineticText>
              </div>
              <p className="text-sm text-black/60 dark:text-white/60">
                Text weight changes on hover (try it!)
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Interactive Effects */}
        <section className="space-y-8">
          <h2 className="text-3xl font-semibold text-black dark:text-white">
            Interactive Effects
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Magnetic Hover */}
            <div className="p-8 rounded-2xl border border-black/10 dark:border-white/10 space-y-4">
              <h3 className="text-sm font-mono text-black/50 dark:text-white/50">
                MagneticHover
              </h3>
              <div className="flex items-center justify-center min-h-[120px]">
                <MagneticHover strength={0.3}>
                  <button className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-semibold">
                    Magnetic Button
                  </button>
                </MagneticHover>
              </div>
              <p className="text-sm text-black/60 dark:text-white/60">
                Follows your cursor subtly
              </p>
            </div>

            {/* Micro Bounce */}
            <div className="p-8 rounded-2xl border border-black/10 dark:border-white/10 space-y-4">
              <h3 className="text-sm font-mono text-black/50 dark:text-white/50">
                MicroBounce
              </h3>
              <div className="flex items-center justify-center min-h-[120px]">
                <MicroBounce>
                  <button className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-semibold">
                    Bouncy Button
                  </button>
                </MicroBounce>
              </div>
              <p className="text-sm text-black/60 dark:text-white/60">
                Subtle bounce on hover & tap
              </p>
            </div>

            {/* Hover Tooltip */}
            <div className="p-8 rounded-2xl border border-black/10 dark:border-white/10 space-y-4">
              <h3 className="text-sm font-mono text-black/50 dark:text-white/50">
                HoverTooltip
              </h3>
              <div className="flex items-center justify-center min-h-[120px]">
                <HoverTooltip content="This is helpful context!" delay={0.3}>
                  <div className="px-6 py-3 bg-black/5 dark:bg-white/5 rounded-lg text-black dark:text-white cursor-help">
                    Hover for tooltip
                  </div>
                </HoverTooltip>
              </div>
              <p className="text-sm text-black/60 dark:text-white/60">
                Perplexity-style hover hints
              </p>
            </div>

            {/* Cursor Follower */}
            <div className="p-8 rounded-2xl border border-black/10 dark:border-white/10 space-y-4 overflow-hidden">
              <h3 className="text-sm font-mono text-black/50 dark:text-white/50">
                CursorFollower
              </h3>
              <div className="min-h-[120px] relative group">
                <CursorFollower>
                  <div className="w-full h-full flex items-center justify-center p-6 rounded-lg bg-gradient-to-br from-black/5 to-black/10 dark:from-white/5 dark:to-white/10">
                    <span className="text-black dark:text-white">
                      Move cursor over this area
                    </span>
                  </div>
                </CursorFollower>
              </div>
              <p className="text-sm text-black/60 dark:text-white/60">
                Subtle spotlight follows cursor
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Card Effects */}
        <section className="space-y-8">
          <h2 className="text-3xl font-semibold text-black dark:text-white">
            Card Effects
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Glow Card */}
            <GlowCard glowColor="rgba(0, 255, 148, 0.15)" hoverScale={1.02}>
              <div className="p-8 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 space-y-3">
                <h3 className="text-sm font-mono text-black/50 dark:text-white/50">
                  GlowCard
                </h3>
                <div className="text-2xl font-bold text-black dark:text-white">
                  Subtle Glow Effect
                </div>
                <p className="text-sm text-black/60 dark:text-white/60">
                  Glows on hover - try it!
                </p>
              </div>
            </GlowCard>

            {/* Border Glow */}
            <BorderGlow glowColor="#00FF94">
              <div className="p-8 rounded-xl bg-black dark:bg-white space-y-3">
                <h3 className="text-sm font-mono text-white/50 dark:text-black/50">
                  BorderGlow
                </h3>
                <div className="text-2xl font-bold text-white dark:text-black">
                  Animated Border
                </div>
                <p className="text-sm text-white/60 dark:text-black/60">
                  Hover to see animated glow
                </p>
              </div>
            </BorderGlow>
          </div>
        </section>

        {/* Section 4: Reveal Effects */}
        <section className="space-y-8">
          <h2 className="text-3xl font-semibold text-black dark:text-white">
            Reveal Effects
          </h2>

          <div className="space-y-6">
            {/* Progressive Reveal */}
            <div className="grid md:grid-cols-3 gap-4">
              {[0, 0.1, 0.2].map((delay, i) => (
                <ProgressiveReveal key={i} delay={delay}>
                  <div className="p-6 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                    <div className="text-sm font-mono text-black/50 dark:text-white/50 mb-2">
                      ProgressiveReveal
                    </div>
                    <div className="text-lg font-semibold text-black dark:text-white">
                      Staggered {i + 1}
                    </div>
                  </div>
                </ProgressiveReveal>
              ))}
            </div>

            {/* Scroll Reveal Blur */}
            <ScrollRevealBlur>
              <div className="p-8 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 border border-purple-500/20 text-center">
                <h3 className="text-sm font-mono text-black/50 dark:text-white/50 mb-3">
                  ScrollRevealBlur
                </h3>
                <div className="text-2xl font-bold text-black dark:text-white mb-2">
                  Scroll to Reveal
                </div>
                <p className="text-sm text-black/60 dark:text-white/60">
                  Reveals with blur effect as you scroll
                </p>
              </div>
            </ScrollRevealBlur>
          </div>
        </section>

        {/* Section 5: Combination Example */}
        <section className="space-y-8">
          <h2 className="text-3xl font-semibold text-black dark:text-white">
            Combined Effects Example
          </h2>

          <div className="text-center space-y-8 p-12 rounded-3xl bg-gradient-to-br from-black/5 via-transparent to-black/5 dark:from-white/5 dark:via-transparent dark:to-white/5 border border-black/10 dark:border-white/10">
            <h3 className="text-4xl md:text-5xl font-bold text-black dark:text-white">
              <KineticText>The future of </KineticText>
              <GradientText animated>payments</GradientText>
            </h3>

            <p className="text-lg text-black/60 dark:text-white/60 max-w-2xl mx-auto">
              Multiple effects combined for maximum impact while maintaining
              elegance and performance
            </p>

            <div className="flex gap-4 justify-center flex-wrap">
              <MagneticHover strength={0.2}>
                <MicroBounce>
                  <button className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-semibold hover:shadow-2xl transition-shadow">
                    Get Started
                  </button>
                </MicroBounce>
              </MagneticHover>

              <HoverTooltip content="Learn how it works">
                <MicroBounce>
                  <button className="px-8 py-4 bg-transparent border-2 border-black dark:border-white text-black dark:text-white rounded-full font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    Learn More
                  </button>
                </MicroBounce>
              </HoverTooltip>
            </div>
          </div>
        </section>

        {/* Footer Note */}
        <div className="text-center py-12 space-y-4">
          <p className="text-sm text-black/40 dark:text-white/40">
            Inspired by top Web3 & AI startups: Perplexity, Hedera, Runway AI,
            Cursor, Linear
          </p>
          <p className="text-xs text-black/30 dark:text-white/30">
            All effects are GPU-accelerated for 60fps performance
          </p>
        </div>
      </div>
    </div>
  );
};

export default EffectsShowcase;
