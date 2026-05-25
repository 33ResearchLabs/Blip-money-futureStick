import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { HeroDashboardVisual } from "../HeroDashbaordVisual";
import { MerchantHeroDashbaord } from "../MerchantHeroDashboard";
import { EditableText } from "@/components/dashboard/Editable";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Merchant hero — themed to match the index CinematicHero:
 * black canvas, blue wash + slow aurora, vignette, film grain,
 * eyebrow hairlines, Apple-display headline with two-tone emphasis,
 * Claude-orange (#cc785c) accent, primary white pill + ghost CTA.
 * Copy is merchant-first.
 */
export const CinematicHeroOfMerchant = () => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { amount: 0.2 });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden flex flex-col items-stretch text-white bg-black"
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: "#000" }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 35%, rgba(60,100,200,0.08) 0%, transparent 70%)",
        }}
      />
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-50"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        style={{
          background:
            "radial-gradient(ellipse 35% 22% at 30% 30%, rgba(80,140,230,0.05), transparent 65%), radial-gradient(ellipse 30% 20% at 75% 65%, rgba(204,120,92,0.05), transparent 65%)",
          backgroundSize: "240% 240%",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 95% 75% at 50% 45%, transparent 30%, rgba(0,0,0,0.6) 80%, rgba(0,0,0,0.96) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-40 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-56 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.5) 50%, #000 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.55 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
        }}
      />

      <main className="relative z-10 w-full max-w-[1180px] mx-auto px-4 md:px-10 pt-24 md:pt-32 pb-16 md:pb-24 flex-1 flex flex-col items-stretch">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <span className="w-5 h-px bg-white/25" />
            <EditableText
              id="merchant.hero.eyebrow"
              default="Merchant-First Protocol"
              className="text-[10px] font-semibold tracking-[0.3em] uppercase whitespace-nowrap"
              style={{
                color: "#ff7a3d",
                textShadow: "0 0 18px rgba(255,122,61,0.45)",
              }}
            />
            <span className="w-5 h-px bg-white/25" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, ease: EASE, delay: 0.08 }}
            className="font-display text-white max-w-[920px]"
            style={{
              fontSize: "clamp(2.8rem, 9vw, 3.9rem)",
              fontWeight: 500,
              lineHeight: 1.02,
              letterSpacing: "-0.055em",
              marginBottom: 22,
              textShadow: "0 2px 24px rgba(0,0,0,0.45)",
            }}
          >
            <EditableText id="merchant.hero.title.pre" default="You set the margin. " />
            <EditableText
              id="merchant.hero.title.accent"
              default="You win the order."
              as="span"
              className="text-white/85"
              style={{ fontStyle: "italic", fontFamily: "ui-serif, Georgia, serif", fontWeight: 500 }}
            />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: EASE, delay: 0.22 }}
            className="text-white/65 max-w-[560px] mx-auto leading-[1.5] text-[15px] md:text-[16px] mb-9 tracking-tight"
          >
            <EditableText
              id="merchant.hero.sub"
              default="Orders route to you through Blip Market — paid on-chain, no banks, no chargebacks. Earn on every settlement."
              multiline
            />
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto"
          >
            <Link
              to="/merchant-waitlist"
              className="group relative inline-flex items-center justify-center gap-2 w-full sm:w-auto sm:min-w-[168px] h-[44px] px-6 rounded-full bg-white text-black text-[13.5px] font-semibold tracking-tight transition-all duration-300 shadow-[0_1px_0_rgba(255,255,255,0.4)_inset,0_10px_30px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_1px_0_rgba(255,255,255,0.4)_inset,0_16px_42px_-12px_rgba(255,255,255,0.4)] hover:-translate-y-[1px] active:scale-[0.985] active:translate-y-0"
            >
              <EditableText id="merchant.hero.cta.primary" default="Apply as Merchant" as="span" />
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/merchant-login"
              className="group inline-flex items-center justify-center gap-1.5 w-full sm:w-auto sm:min-w-[168px] h-[44px] px-6 rounded-full text-white/85 text-[13.5px] font-medium tracking-tight hover:text-white transition-colors"
            >
              <EditableText id="merchant.hero.cta.secondary" default="Merchant Sign-in" as="span" />
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>

        <div className="h-[20vh] md:h-[24vh]" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.1, ease: EASE, delay: 0.55 }}
          className="relative w-full"
        >
          <HeroDashboardVisual>
            <MerchantHeroDashbaord />
          </HeroDashboardVisual>
        </motion.div>
      </main>
    </section>
  );
};
