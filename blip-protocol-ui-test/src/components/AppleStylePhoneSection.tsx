import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Wifi, Battery, Signal } from "lucide-react";

/**
 * Apple-Style White Centered Hero Phone Section
 * Inspired by Apple's clean white product pages
 * - Pure white background
 * - Phone centered and HUGE
 * - Minimal dark text
 * - Clean, elegant presentation
 * - Custom-built phone mockup
 */

// Phone UI Component - iPhone 17 Pro Max Style
const PhoneMockup = () => {
  return (
    <div className="relative w-full h-full">
      {/* Phone Frame - iPhone Pro Max titanium style */}
      <div className="relative rounded-[3.2rem] bg-gradient-to-br from-[#3a3a3c] via-[#2c2c2e] to-[#1c1c1e] p-[3px] shadow-2xl">
        {/* Inner bezel */}
        <div className="rounded-[3.1rem] bg-black p-[2px]">
          {/* Screen */}
          <div className="relative rounded-[3rem] bg-black overflow-hidden" style={{ aspectRatio: "9/19.5" }}>
            {/* Dynamic Island - More accurate */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50">
              <div className="w-28 h-7 rounded-full bg-black border border-gray-900/50 shadow-inner" />
            </div>

          {/* Status Bar */}
          <div className="relative z-40 flex items-center justify-between px-7 pt-2 pb-1">
            <span className="text-white text-xs font-semibold">9:41</span>
            <div className="flex items-center gap-1">
              <Signal className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
              <Wifi className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
              <Battery className="w-5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
          </div>

          {/* App Content */}
          <div className="relative px-5 pt-4 pb-6 h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center">
                  <span className="text-white text-base font-bold">B</span>
                </div>
                <div>
                  <div className="text-white/60 text-[10px]">Good morning</div>
                  <div className="text-white text-xs font-semibold">David</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10" />
                <div className="w-8 h-8 rounded-full bg-green-500" />
              </div>
            </div>

            {/* Trade Card */}
            <div className="rounded-3xl bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-white/10 p-5 mb-4">
              {/* Trade Toggle */}
              <div className="flex items-center gap-2 mb-5">
                <div className="flex rounded-full bg-white/5 p-0.5">
                  <button className="px-3.5 py-1.5 rounded-full bg-orange-500 text-white text-xs font-medium">
                    Buy
                  </button>
                  <button className="px-3.5 py-1.5 rounded-full text-white/50 text-xs font-medium">
                    Sell
                  </button>
                </div>
              </div>

              {/* You pay */}
              <div className="mb-4">
                <div className="text-white/40 text-[10px] mb-1.5">You pay</div>
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value="500"
                    readOnly
                    className="bg-transparent text-white text-3xl font-bold outline-none w-24"
                  />
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5">
                    <div className="w-5 h-5 rounded-full bg-blue-500" />
                    <span className="text-white text-xs font-medium">USDC</span>
                  </div>
                </div>
                <div className="text-white/30 text-[10px] mt-0.5">Balance: $27.99 USDC</div>
              </div>

              {/* Exchange Icon */}
              <div className="flex justify-center my-3">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </div>
              </div>

              {/* You receive */}
              <div className="mb-4">
                <div className="text-white/40 text-[10px] mb-1.5">You receive</div>
                <div className="flex items-center justify-between">
                  <div className="text-white text-2xl font-bold">1,835</div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-400 to-emerald-500" />
                    <span className="text-white text-xs font-medium">AED</span>
                  </div>
                </div>
                <div className="text-white/30 text-[10px] mt-0.5">Rate: 1 USDC = 3.67 AED</div>
              </div>

              {/* Payment Method */}
              <div className="mb-3">
                <div className="text-white/40 text-[10px] mb-1.5">Pay via</div>
                <div className="flex gap-1.5">
                  <button className="flex-1 py-2 px-2 rounded-lg bg-orange-500/20 border border-orange-500/50 text-orange-400 text-[10px] font-medium">
                    Bank
                  </button>
                  <button className="flex-1 py-2 px-2 rounded-lg bg-white/5 border border-white/10 text-white/40 text-[10px] font-medium">
                    Cash
                  </button>
                </div>
              </div>

              {/* Matching Priority */}
              <div className="mb-4">
                <div className="text-white/40 text-[10px] mb-1.5">Matching priority</div>
                <div className="flex gap-1.5">
                  <button className="px-2 py-1.5 rounded-lg bg-orange-500/20 border border-orange-500/50 text-orange-400 text-[10px] font-medium">
                    Fastest
                  </button>
                  <button className="px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/40 text-[10px] font-medium">
                    Best rate
                  </button>
                  <button className="px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/40 text-[10px] font-medium">
                    Cheapest
                  </button>
                </div>
              </div>

              {/* Continue Button */}
              <button className="w-full py-3 rounded-2xl bg-orange-500 text-white font-semibold text-sm">
                Continue
              </button>

              {/* Info Text */}
              <div className="text-center mt-3">
                <span className="text-white/30 text-[10px]">Have a large amount? </span>
                <button className="text-orange-400 text-[10px] font-medium">Create an offer</button>
              </div>
            </div>
          </div>

          {/* Home Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full" />
        </div>
      </div>
      </div>

      {/* Titanium frame shine effect */}
      <div
        className="absolute inset-0 rounded-[3.2rem] pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, transparent 50%)",
        }}
      />
    </div>
  );
};

export const AppleStylePhoneSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll-based animations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Phone parallax - subtle movement
  const phoneY = useSpring(
    useTransform(scrollYProgress, [0, 1], [100, -100]),
    { stiffness: 100, damping: 30 }
  );

  const phoneScale = useSpring(
    useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1, 0.85]),
    { stiffness: 100, damping: 30 }
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-screen bg-white overflow-hidden flex flex-col items-center justify-center px-6"
    >
      {/* Minimal background */}
      <div className="absolute inset-0">
        {/* Subtle center glow - orange tint */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255, 107, 53, 0.15) 0%, transparent 60%)",
          }}
        />

        {/* Very subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0, 0, 0, 0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 0, 0, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: "100px 100px",
          }}
        />
      </div>

      {/* Content Container - Card Width */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center justify-center px-6 h-full">
        {/* Top Text */}
        <div className="text-center mb-6 space-y-3 max-w-2xl">
          {/* Small label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 text-sm text-gray-500 font-medium tracking-[0.2em] uppercase"
          >
            <span className="w-1 h-1 rounded-full bg-[#ff6b35]" />
            Mobile First
          </motion.div>

          {/* Large headline - Apple style */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[clamp(48px,8vw,88px)] font-serif leading-[1.05] tracking-tighter"
          >
            <span className="block text-black">Trade instantly.</span>
            <span className="block text-gray-400">Anywhere.</span>
          </motion.h2>
        </div>

        {/* HERO PHONE - Centered and HUGE */}
        <motion.div
          className="relative w-full max-w-md flex items-center justify-center my-6"
          style={{ y: phoneY, scale: phoneScale }}
        >
          {/* Subtle glow behind phone */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-[500px] h-[700px] rounded-full blur-[100px] opacity-[0.08]"
              style={{
                background:
                  "radial-gradient(ellipse, rgba(255, 107, 53, 0.3) 0%, transparent 70%)",
              }}
            />
          </div>

          {/* Phone mockup - iPhone 17 Pro Max Size */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 100 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10"
            style={{
              width: "clamp(240px, 35vw, 340px)",
              filter: "drop-shadow(0 40px 80px rgba(0, 0, 0, 0.25))",
            }}
          >
            <PhoneMockup />
          </motion.div>
        </motion.div>

        {/* Bottom Content - Minimal */}
        <div className="text-center space-y-4 mt-4 max-w-xl">
          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg text-gray-600 mx-auto leading-relaxed"
          >
            Lightning-fast trades, real-time rates, seamless global transactions. All in your pocket.
          </motion.p>

          {/* Stats - Inline and minimal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center justify-center gap-8 text-gray-500 text-sm flex-wrap"
          >
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-black">&lt;10s</span>
              <span>Settlement</span>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-black">24/7</span>
              <span>Available</span>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-black">150+</span>
              <span>Countries</span>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <button className="group px-9 py-4 rounded-full bg-black text-white font-medium text-base hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] transition-all duration-500 hover:scale-105">
              <span className="flex items-center gap-2">
                Download App
                <svg
                  className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </span>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Subtle fade at edges */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
};

export default AppleStylePhoneSection;
