import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { sounds } from "@/lib/sounds";
import { MagneticWrapper } from "@/components/MagneticButton";

/* ============================================
   MINIMAL BLACK & WHITE HERO
   Large imagery, bold typography
   ============================================ */

/* ---------------- Subtle Background ---------------- */
const SubtleBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-transparent z-10" />

      {/* Very subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.5) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Subtle top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-[0.03]"
        style={{
          background: 'radial-gradient(ellipse, rgba(255, 107, 53, 1) 0%, transparent 70%)',
        }}
      />

      {/* Noise texture */}
      <div className="absolute inset-0 bg-noise opacity-50" />
    </div>
  );
};

/* ---------------- Text Reveal Animation ---------------- */
const TextReveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="overflow-hidden">
      <motion.div
        initial={{ y: "100%" }}
        animate={isInView ? { y: 0 } : { y: "100%" }}
        transition={{
          duration: 1,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

/* ---------------- CTA Button ---------------- */
const CTAButton = ({
  to,
  children,
  variant = "primary",
  icon: Icon
}: {
  to: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  icon?: React.ElementType;
}) => {
  const isPrimary = variant === "primary";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <MagneticWrapper strength={0.2}>
        <Link
          to={to}
          onClick={() => sounds.click()}
          onMouseEnter={() => sounds.hover()}
          className={`
            group inline-flex items-center gap-3 px-8 py-4 rounded-full text-[15px] font-medium
            transition-all duration-500
            ${isPrimary
              ? "bg-white text-black hover:shadow-[0_0_60px_rgba(255,255,255,0.2)]"
              : "bg-transparent text-white border border-white/10 hover:border-white/30 hover:bg-white/5"
            }
          `}
        >
          {Icon && <Icon className="w-4 h-4" />}
          {children}
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </MagneticWrapper>
    </motion.div>
  );
};

/* ---------------- Large Image Component ---------------- */
const HeroImage = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useSpring(useTransform(scrollYProgress, [0, 1], [0, -100]), {
    stiffness: 100,
    damping: 30,
  });

  const scale = useSpring(useTransform(scrollYProgress, [0, 0.5], [1, 1.1]), {
    stiffness: 100,
    damping: 30,
  });

  return (
    <motion.div
      ref={ref}
      className="relative w-full aspect-[16/9] max-w-5xl mx-auto rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Image container */}
      <motion.div
        className="absolute inset-0"
        style={{ y, scale }}
      >
        <img
          src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop"
          alt="Cryptocurrency and blockchain"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

      {/* Border */}
      <div className="absolute inset-0 rounded-2xl border border-white/10" />

      {/* Floating stats */}
      <motion.div
        className="absolute bottom-6 left-6 right-6 flex justify-between items-end"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <div className="flex gap-8">
          <div>
            <div className="text-3xl font-semibold text-white">$2.4B+</div>
            <div className="text-sm text-white/50">Total Volume</div>
          </div>
          <div>
            <div className="text-3xl font-semibold text-white">150+</div>
            <div className="text-sm text-white/50">Countries</div>
          </div>
          <div>
            <div className="text-3xl font-semibold text-white">&lt;10s</div>
            <div className="text-sm text-white/50">Settlement</div>
          </div>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
          <span className="w-2 h-2 rounded-full bg-[#ff6b35] animate-pulse" />
          <span className="text-xs text-white/70 font-medium">Live on Solana</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ---------------- Main Hero Section ---------------- */
export const HeroSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <motion.section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-[100px] pb-20"
      style={{ opacity }}
    >
      <SubtleBackground />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        {/* Text content */}
        <div className="text-center mb-16">
          {/* Small badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff6b35]" />
            <span className="text-[13px] text-white/60 font-medium">The future of payments</span>
          </motion.div>

          {/* Main heading - Large and bold */}
          <h1 className="heading-xl text-white mb-8 max-w-4xl mx-auto">
            <TextReveal delay={0.1}>
              <span className="block">Pay with crypto.</span>
            </TextReveal>
            <TextReveal delay={0.2}>
              <span className="block text-white/30">Anywhere in the world.</span>
            </TextReveal>
          </h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            The non-custodial settlement protocol for instant global payments.
            Send crypto, receive local currency in seconds.
          </motion.p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton to="/join-waitlist" variant="primary">
              Get Early Access
            </CTAButton>
            <CTAButton to="/how-it-works" variant="secondary" icon={Play}>
              Watch Demo
            </CTAButton>
          </div>
        </div>

        {/* Large hero image */}
        <HeroImage />
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          className="w-6 h-10 rounded-full border border-white/20 flex items-start justify-center p-2"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-2 rounded-full bg-white/50"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default HeroSection;
