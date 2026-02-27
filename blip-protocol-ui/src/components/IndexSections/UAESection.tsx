import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, MapPin, Zap } from "lucide-react";
import { Link } from "react-router-dom";

/* ============================================
   SECTION 8: DUBAI LAUNCH
   UAE / Dubai pilot — futuristic with real Dubai photo
   ============================================ */

const corridors = [
  { from: "🇦🇪", fromLabel: "UAE", fromCcy: "AED", to: "🇮🇳", toLabel: "India", toCcy: "INR", volume: "$4.2B/yr", delay: 0 },
  { from: "🇦🇪", fromLabel: "UAE", fromCcy: "USDT", to: "💵", toLabel: "USD", toCcy: "USD", volume: "$6.1B/yr", delay: 0.1 },
  { from: "🇦🇪", fromLabel: "UAE", fromCcy: "AED", to: "🇵🇭", toLabel: "Philippines", toCcy: "PHP", volume: "$1.6B/yr", delay: 0.2 },
];

const stats = [
  { value: "30%", label: "UAE crypto adoption" },
  { value: "Q2 2025", label: "Dubai beta launch" },
  { value: "3", label: "Live corridors" },
];

const UAESection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.4, 1], [0.75, 0.65, 0.8]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Dubai photo — parallax */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{ y: imgY }}
      >
        <img
          src="/Dubai.jpeg"
          alt="Dubai skyline"
          className="w-full h-full object-cover object-center scale-110"
        />
      </motion.div>

      {/* Dark overlay — layered for depth */}
      <motion.div
        className="absolute inset-0"
        style={{ opacity: overlayOpacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />
      </motion.div>

      {/* Orange accent glow — brand color */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(255,107,53,0.12) 0%, transparent 70%)" }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(0,229,153,0.06) 0%, transparent 70%)" }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      {/* Animated scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-24 md:py-40">
        {/* Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.15] bg-white/[0.06] backdrop-blur-sm">
            <MapPin className="w-3 h-3 text-[#ff6b35]" strokeWidth={1.5} />
            <span className="text-[10px] uppercase tracking-[0.25em] text-white/60 font-semibold">
              Dubai, UAE · First market
            </span>
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-[#00e599]"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.05] text-center mb-6"
        >
          Launching in
          <br />
          <span className="text-white/50">Dubai.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-base md:text-lg text-white/50 font-medium max-w-lg mx-auto text-center leading-relaxed mb-14"
        >
          The UAE is the world's fastest-growing crypto hub. Blip's pilot starts here — live corridors, merchant onboarding, and on-chain settlement from day one.
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex justify-center gap-10 md:gap-20 mb-14"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              className="text-center"
            >
              <div className="font-display text-2xl md:text-3xl font-bold text-white tracking-tight">
                {stat.value}
              </div>
              <div className="text-[10px] uppercase tracking-[0.15em] text-white/30 font-semibold mt-1 max-w-[90px] mx-auto leading-tight">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Corridor cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-14">
          {corridors.map((corridor, i) => (
            <motion.div
              key={corridor.toLabel}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: corridor.delay }}
              whileHover={{ y: -4, borderColor: "rgba(255,107,53,0.35)" }}
              className="relative p-5 rounded-2xl border border-white/[0.1] bg-white/[0.05] backdrop-blur-md overflow-hidden group transition-all duration-300"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b35]/0 to-[#ff6b35]/0 group-hover:from-[#ff6b35]/[0.05] group-hover:to-transparent transition-all duration-500 rounded-2xl" />

              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{corridor.from}</span>
                  <div className="flex-1 flex items-center gap-1">
                    <div className="h-px flex-1 bg-white/20" />
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-[#ff6b35]"
                      animate={{ x: [-8, 8, -8] }}
                      transition={{ duration: 2 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <div className="h-px flex-1 bg-white/20" />
                  </div>
                  <span className="text-xl">{corridor.to}</span>
                </div>

                <div className="text-sm font-semibold text-white mb-1.5">
                  {corridor.fromCcy} → {corridor.toCcy}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-white/30 font-semibold">
                    {corridor.fromLabel} → {corridor.toLabel}
                  </span>
                  <span className="text-xs text-[#00e599] font-mono font-semibold">
                    {corridor.volume}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/waitlist"
            className="group relative overflow-hidden inline-flex items-center justify-center gap-3 px-8 h-[52px] rounded-full bg-[#ff6b35] text-white text-sm font-semibold transition-all duration-300 hover:bg-[#ff8050]"
          >
            <Zap className="w-4 h-4" strokeWidth={2} />
            <span>Join Dubai Beta</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/merchant"
            className="inline-flex items-center gap-2 text-sm text-white/50 font-medium hover:text-white/80 transition-colors border border-white/[0.12] px-6 h-[52px] rounded-full hover:border-white/25 backdrop-blur-sm"
          >
            Merchant onboarding
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default UAESection;
