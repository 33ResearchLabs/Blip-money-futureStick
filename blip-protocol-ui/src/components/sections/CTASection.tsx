import { useRef, ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { sounds } from "@/lib/sounds";
import { MagneticWrapper } from "@/components/MagneticButton";
import { CTAButton } from "../Navbar";

/* ============================================
   CTA SECTION COMPONENT
   Call-to-action with optional background
   ============================================ */

interface CTASectionProps {
  title: ReactNode;
  description?: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  background?: "dark" | "gradient" | "image";
  backgroundImage?: string;
}

export const CTASection = ({
  title,
  description,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
  background = "dark",
  backgroundImage,
}: CTASectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative py-32 md:py-40 overflow-hidden">
      {/* Background */}
      {background === "image" && backgroundImage ? (
        <>
          <div className="absolute inset-0">
            <img
              src={backgroundImage}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black/70" />
        </>
      ) : background === "gradient" ? (
        <>
          <div className="absolute inset-0 bg-black" />
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-[0.07]"
            style={{
              background:
                "radial-gradient(ellipse, rgba(255, 107, 53, 1) 0%, transparent 70%)",
            }}
          />
        </>
      ) : (
        <div className="absolute inset-0 bg-black" />
      )}

      {/* Border lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="heading-lg text-white mb-6"
        >
          {title}
        </motion.h2>

        {description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl text-white/50 mb-10 max-w-2xl mx-auto"
          >
            {description}
          </motion.p>
        )}

        <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={isInView ? { opacity: 1, y: 0 } : {}}
  transition={{ duration: 0.6, delay: 0.2 }}
  className="flex flex-col sm:flex-row gap-4 justify-center items-center"
>
  {/* PRIMARY */}
  <CTAButton
    to="/join-waitlist"
    
    
  >
    {primaryButtonText}
  </CTAButton>

  {/* SECONDARY */}
  {secondaryButtonText && secondaryButtonLink && (
    <MagneticWrapper strength={0.2}>
      {/* <Link
        to={secondaryButtonLink}
        onClick={() => sounds.click()}
        onMouseEnter={() => sounds.hover()}
        className="
          group
          inline-flex items-center justify-center
           
          gap-2 sm:gap-3
          px-10 py-4
          min-h-[52px] w-[220px]
          text-[16px] font-medium
          rounded-full
          border border-white/10
          text-white
          transition-all duration-500
          hover:border-white/30 hover:bg-white/5
        "
      >
        {secondaryButtonText}
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </Link> */}
     <CTAButton to={secondaryButtonLink} className="border border-white/10 text-white hover:border-white/30 hover:bg-white/5">
        {secondaryButtonText}
        {/* <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /> */}
      </CTAButton> 
    </MagneticWrapper>
  )}
</motion.div>

      </div>
    </section>
  );
};

export default CTASection;
