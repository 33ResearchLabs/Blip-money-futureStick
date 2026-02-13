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
        className="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-black/[0.08] dark:border-white/[0.06] bg-white/60 dark:bg-[#050505] backdrop-blur-xl p-8 transition-all duration-500"
        style={{
          animation: `fadeInUp 1s cubic-bezier(0.2,0.8,0.2,1) ${delay}s both`,
          transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        }}
      >
        {/* Spotlight */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            opacity: hovered ? 1 : 0,
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.08), transparent 40%)`,
          }}
        />

        {/* Step */}
        <div className="absolute top-6 right-6 flex items-center gap-2">
          <div
            className="h-1.5 w-1.5 rounded-full transition-all duration-300"
            style={{
              backgroundColor: hovered ? "rgb(156,163,175)" : "rgba(0,0,0,0.4)",
              boxShadow: hovered ? "0 0 8px rgba(100,100,100,0.3)" : "none",
            }}
          />
          <span className="text-[9px] font-mono tracking-[0.2em] text-black/50 dark:text-zinc-600">
            STEP_0{step}
          </span>
        </div>

        {/* Icon + Text */}
        <div className="relative z-10 mb-8 flex flex-col gap-6">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-300"
            style={{
              backgroundColor: hovered
                ? "rgba(0,0,0,0.08)"
                : "rgba(0,0,0,0.05)",
              borderColor: hovered ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.1)",
              color: hovered ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.4)",
            }}
          >
            <Icon size={24} />
          </div>

          <div>
            <h3 className="text-xl font-bold text-black dark:text-white mb-2">
              {title}
            </h3>
            <p className="text-sm text-black/40 dark:text-zinc-500">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Mockup — pass hovered down via React clone */}
        <div className="relative mt-auto h-52 overflow-hidden rounded-2xl border border-black/[0.06] dark:border-white/5 bg-black/[0.03] dark:bg-[#080808]">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />
          <div className="relative z-10 h-full">
            {/* Inject hovered prop into children */}
            {React.isValidElement(children)
              ? React.cloneElement(children, { hovered })
              : children}
          </div>

          <div className="absolute bottom-0 inset-x-0 h-8 border-t border-black/5 dark:border-white/5 bg-white/80 dark:bg-black/80 flex items-center justify-between px-4">
            <span className="text-[8px] font-mono text-black/70 dark:text-zinc-500">
              SYSTEM_ACTIVE
            </span>
            <Cpu size={10} className="text-black/10 dark:text-zinc-800" />
          </div>
        </div>
      </div>
    );
  };

  /* ---------------- MOCKUPS ---------------- */
  const MockupDashboard = ({ hovered }: { hovered: boolean }) => (
    <div className="p-4 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div className="h-1 w-12 bg-black/30 dark:bg-zinc-800 rounded-full" />
        <Zap
          size={10}
          className="text-black/20 dark:text-white/20"
          style={{
            animation: hovered ? "spin-slow 2s linear infinite" : "none",
          }}
        />
      </div>
      {["USDT/AED", "AED/USDT", "USDT/Cash"].map((p, i) => (
        <div
          key={i}
          className="p-2 rounded-xl text-[9px] transition-all duration-300"
          style={{
            backgroundColor: hovered ? "rgba(0,0,0,0.12)" : "rgba(0,0,0,0.06)",
            color: hovered ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.4)",
            transform: hovered ? `translateX(${i * 2}px)` : "translateX(0)",
            transitionDelay: `${i * 60}ms`,
          }}
        >
          {p}
        </div>
      ))}
    </div>
  );

  const MockupLock = ({ hovered }: { hovered: boolean }) => (
    <div className="h-full flex flex-col items-center justify-center gap-4">
      <div
        className="h-16 w-16 rounded-3xl flex items-center justify-center transition-all duration-500"
        style={{
          backgroundColor: hovered ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.08)",
          borderColor: hovered ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.15)",
          borderWidth: "1px",
          borderStyle: "solid",
          transform: hovered ? "scale(1.08)" : "scale(1)",
        }}
      >
        <Lock
          size={24}
          style={{
            color: hovered ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.2)",
            transition: "color 0.4s",
          }}
        />
      </div>
      <div className="h-1.5 w-24 bg-black/10 dark:bg-zinc-900 rounded-full overflow-hidden">
        <div
          className="h-full bg-black/40 dark:bg-white/20 rounded-full transition-all duration-[1500ms]"
          style={{ width: hovered ? "100%" : "33%" }}
        />
      </div>
      <span
        className="text-[8px] font-mono tracking-widest transition-all duration-300"
        style={{
          color: hovered ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.2)",
          opacity: hovered ? 1 : 0,
        }}
      >
        LOCKED
      </span>
    </div>
  );

  const MockupEscrow = ({ hovered }) => (
    <div className="p-4">
      <div
        className="rounded-xl border p-4 transition-all duration-500"
        style={{
          backgroundColor: hovered ? "rgba(0,0,0,0.1)" : "rgba(0,0,0,0.04)",
          borderColor: hovered ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.08)",
          transform: hovered ? "scale(1.03)" : "scale(1)",
        }}
      >
        <ShieldCheck
          size={14}
          className="mb-3 transition-all duration-300"
          style={{
            color: hovered ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.2)",
          }}
        />

        <div className="h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-[1200ms]"
            style={{
              width: hovered ? "80%" : "50%",
              backgroundColor: hovered ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.25)",
              animation: hovered ? "none" : "pulse 1.5s infinite",
            }}
          />
        </div>

        <div className="mt-3 flex gap-1">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full transition-all duration-300"
              style={{
                backgroundColor: hovered
                  ? "rgba(0,0,0,0.3)"
                  : "rgba(0,0,0,0.08)",
                transitionDelay: `${i * 80}ms`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const MockupOnChain = ({ hovered }) => (
    <div className="p-4 font-mono text-[9px] text-black/60 dark:text-zinc-500 relative h-full overflow-hidden">
      <div
        className="flex items-center gap-2 mb-2 transition-colors duration-300"
        style={{ color: hovered ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.25)" }}
      >
        <Scan size={12} /> BLIP_SCAN
      </div>
      <div
        className="transition-all duration-300"
        style={{
          color: hovered ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.4)",
          transform: hovered ? "translateX(4px)" : "translateX(0)",
        }}
      >
        {"> BLOCK CONFIRMED"}
      </div>
      <div
        className="transition-all duration-500"
        style={{
          color: hovered ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.2)",
          transform: hovered ? "translateX(4px)" : "translateX(0)",
          transitionDelay: "80ms",
        }}
      >
        {"> FINALIZED"}
      </div>

      {/* Extra lines that fade in on hover */}
      <div
        className="transition-all duration-500 mt-1"
        style={{
          color: "rgba(0,0,0,0.25)",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateX(4px)" : "translateX(0)",
          transitionDelay: "160ms",
        }}
      >
        {"> HASH_0xA3F…"}
      </div>

      <Globe
        size={40}
        className="absolute bottom-2 right-2 transition-all duration-500"
        style={{
          color: hovered ? "rgba(0,0,0,0.15)" : "rgba(0,0,0,0.06)",
          transform: hovered
            ? "rotate(15deg) scale(1.1)"
            : "rotate(0deg) scale(1)",
        }}
      />
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
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>

      <div className="text-center mb-12 sm:mb-24">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-black dark:text-white leading-tight mb-6 sm:mb-8 tracking-tight max-w-xl mx-auto"
        >
          How merchants{" "}
          <span className="text-black/80 dark:text-white/50">execute</span> on
          Blip
        </motion.h2>
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
          <MockupEscrow />
        </Card>

        <Card
          title="Chain Finality"
          subtitle="On-chain proof."
          icon={Activity}
          delay={0.5}
          step={4}
        >
          <MockupOnChain />
        </Card>
      </div>
    </section>
  );
};

export default HowItWorksSection;
