import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  LayoutDashboard,
  Lock,
  ShieldCheck,
  Activity,
  Globe,
  Zap,
  Cpu,
  Scan,
} from "lucide-react";

const HowItWorksSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-120px" });

  /* ---------------- CARD ---------------- */
  const Card = ({ title, subtitle, icon: Icon, children, delay, step }) => {
    const cardRef = useRef(null);
    const [rotate, setRotate] = useState({ x: 0, y: 0 });
    const [hovered, setHovered] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const onMouseMove = (e) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      setRotate({
        x: (y - centerY) / 25,
        y: (centerX - x) / 25,
      });

      setMousePos({ x, y });
    };

    return (
      <div
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          setRotate({ x: 0, y: 0 });
        }}
        className="group relative flex flex-col overflow-hidden rounded-[2.5rem] 
        border border-black/10 dark:border-white/[0.06] 
        bg-white/80 dark:bg-[#050505] 
        backdrop-blur-xl p-8 
        transition-all duration-500
        hover:shadow-2xl hover:shadow-black/20 dark:hover:shadow-white/10
        hover:-translate-y-2"
        style={{
          animation: `fadeInUp 1s cubic-bezier(0.2,0.8,0.2,1) ${delay}s both`,
          transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        }}
      >
        {/* Stronger Spotlight */}
        <div
          className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
          style={{
            opacity: hovered ? 1 : 0,
            background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,0.08), transparent 40%)`,
          }}
        />

        {/* Step */}
        <div className="absolute top-6 right-6 flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              hovered
                ? "bg-black dark:bg-white shadow-[0_0_12px_rgba(0,0,0,0.4)] dark:shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                : "bg-black/50 dark:bg-white/50"
            }`}
          />
          <span className="text-[9px] font-mono tracking-[0.2em] text-black/60 dark:text-white/60">
            STEP_0{step}
          </span>
        </div>

        {/* Icon + Text */}
        <div className="relative z-10 mb-8 flex flex-col gap-6">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-300 ${
              hovered
                ? "bg-black/10 dark:bg-white/10 border-black/30 dark:border-white/30 text-black dark:text-white scale-110"
                : "bg-black/5 dark:bg-white/5 border-black/20 dark:border-white/20 text-black/70 dark:text-white/70"
            }`}
          >
            <Icon size={24} />
          </div>

          <div>
            <h3 className="text-xl font-bold text-black dark:text-white mb-2">
              {title}
            </h3>
            <p className="text-sm text-black/70 dark:text-white/50">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Mockup */}
        <div
          className="relative mt-auto h-52 overflow-hidden rounded-2xl 
        border border-black/10 dark:border-white/5 
        bg-black/5 dark:bg-[#080808]"
        >
          <div className="relative z-10 h-full">
            {React.isValidElement(children)
              ? React.cloneElement(children, { hovered })
              : children}
          </div>

          <div className="absolute bottom-0 inset-x-0 h-8 border-t border-black/10 dark:border-white/5 bg-white dark:bg-black flex items-center justify-between px-4">
            <span className="text-[8px] font-mono text-black/80 dark:text-white/60">
              SYSTEM_ACTIVE
            </span>
            <Cpu size={10} className="text-black/50 dark:text-white/30" />
          </div>
        </div>
      </div>
    );
  };

  /* ---------------- MOCKUP DASHBOARD (FIXED VISIBILITY) ---------------- */
  const MockupDashboard = ({ hovered }) => (
    <div className="p-4 flex flex-col gap-2">
      {["USDT/AED", "AED/USDT", "USDT/Cash"].map((p, i) => (
        <div
          key={i}
          className={`p-2 rounded-xl text-[10px] font-medium transition-all duration-300 ${
            hovered
              ? "bg-black/20 dark:bg-white/15 text-black dark:text-white shadow-md"
              : "bg-black/10 dark:bg-white/10 text-black/80 dark:text-white/70"
          }`}
          style={{
            transform: hovered ? `translateX(${i * 4}px)` : "translateX(0)",
          }}
        >
          {p}
        </div>
      ))}
    </div>
  );

  /* ---------------- MOCKUP LOCK ---------------- */
  const MockupLock = ({ hovered }) => (
    <div className="h-full flex flex-col items-center justify-center gap-4">
      <div
        className={`h-16 w-16 rounded-3xl flex items-center justify-center transition-all duration-500 border ${
          hovered
            ? "bg-black/20 dark:bg-white/20 border-black/40 dark:border-white/40 scale-110 shadow-lg"
            : "bg-black/10 dark:bg-white/10 border-black/20 dark:border-white/20"
        }`}
      >
        <Lock size={24} className="text-black dark:text-white" />
      </div>
      <span
        className={`text-[9px] font-mono tracking-widest transition-all duration-300 ${
          hovered
            ? "text-black dark:text-white opacity-100"
            : "text-black/70 dark:text-white/50 opacity-70"
        }`}
      >
        LOCKED
      </span>
    </div>
  );

  /* ---------------- RENDER ---------------- */
  return (
    <section
      ref={ref}
      className="relative max-w-7xl mx-auto px-6 py-16 md:py-32"
    >
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>

      <div className="text-center mb-12 sm:mb-24">
        <h2 className="text-4xl md:text-6xl font-bold text-black dark:text-white">
          How merchants execute on Blip
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card
          title="Dashboard Stream" 
          subtitle="Live routing engine."
          icon={LayoutDashboard}
          delay={0.2}
          step={1}
        >
          <MockupDashboard />
        </Card>

        <Card
          title="Protocol Lock"
          subtitle="Atomic rate locks."
          icon={Lock}
          delay={0.3}
          step={2}
        >
          <MockupLock />
        </Card>

        <Card
          title="Escrow Vault"
          subtitle="Non-custodial security."
          icon={ShieldCheck}
          delay={0.4}
          step={3}
        >
          <MockupDashboard />
        </Card>

        <Card
          title="Chain Finality"
          subtitle="On-chain proof."
          icon={Activity}
          delay={0.5}
          step={4}
        >
          <MockupDashboard />
        </Card>
      </div>
    </section>
  );
};

export default HowItWorksSection;
