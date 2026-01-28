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

      cardRef.current.style.setProperty("--mouse-x", `${x}px`);
      cardRef.current.style.setProperty("--mouse-y", `${y}px`);
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
        className="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-white/[0.06] bg-[#050505] p-8 transition-all duration-500"
        style={{
          animation: `fadeInUp 1s cubic-bezier(0.2,0.8,0.2,1) ${delay}s both`,
          transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        }}
      >
        {/* Spotlight */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.08), transparent 40%)",
          }}
        />

        {/* Step */}
        <div className="absolute top-6 right-6 flex items-center gap-2">
          <div
            className={`h-1.5 w-1.5 rounded-full ${
              hovered ? "bg-gray-400 shadow-[0_0_8px_rgba(255,255,255,0.3)]" : "bg-zinc-800"
            }`}
          />
          <span className="text-[9px] font-mono tracking-[0.2em] text-zinc-600">
            STEP_0{step}
          </span>
        </div>

        {/* Icon + Text */}
        <div className="relative z-10 mb-8 flex flex-col gap-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 border border-white/5 text-zinc-500 group-hover:text-white/20 group-hover:border-white/30 transition">
            <Icon size={24} />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-sm text-zinc-500">{subtitle}</p>
          </div>
        </div>

        {/* Mockup */}
        <div className="relative mt-auto h-52 overflow-hidden rounded-2xl border border-white/5 bg-[#080808]">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />
          <div className="relative z-10 h-full">{children}</div>

          <div className="absolute bottom-0 inset-x-0 h-8 border-t border-white/5 bg-black/80 flex items-center justify-between px-4">
            <span className="text-[8px] font-mono text-zinc-500">
              SYSTEM_ACTIVE
            </span>
            <Cpu size={10} className="text-zinc-800" />
          </div>
        </div>
      </div>
    );
  };

  /* ---------------- MOCKUPS ---------------- */
  const MockupDashboard = () => (
    <div className="p-4 flex flex-col gap-2">
      <div className="flex justify-between">
        <div className="h-1 w-12 bg-zinc-800 rounded-full" />
        <Zap size={10} className="text-white/20 animate-spin-slow" />
      </div>
      {["USD/NGN", "EUR/GHS", "GBP/KES"].map((p, i) => (
        <div
          key={i}
          className="bg-zinc-900/40 p-2 rounded-xl text-[9px] text-zinc-400"
        >
          {p}
        </div>
      ))}
    </div>
  );

  const MockupLock = () => (
    <div className="h-full flex flex-col items-center justify-center gap-4">
      <div className="h-16 w-16 rounded-3xl bg-black border border-white/20 flex items-center justify-center">
        <Lock className="text-white/20" />
      </div>
      <div className="h-1.5 w-24 bg-zinc-900 rounded-full overflow-hidden">
        <div className="h-full bg-white/20 w-1/3 group-hover:w-full transition-all duration-[1500ms]" />
      </div>
    </div>
  );

  const MockupEscrow = () => (
    <div className="p-4">
      <div className="bg-black rounded-xl border border-white/5 p-4">
        <ShieldCheck className="text-white/20 mb-3" size={14} />
        <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
          <div className="h-full bg-white/20 w-1/2 animate-pulse" />
        </div>
      </div>
    </div>
  );

  const MockupOnChain = () => (
    <div className="p-4 font-mono text-[9px] text-zinc-500">
      <div className="flex items-center gap-2 text-white/20 mb-2">
        <Scan size={12} /> BLIP_SCAN
      </div>
      <div>{"> BLOCK CONFIRMED"}</div>
      <div className="text-white/20">{"> FINALIZED"}</div>
      <Globe
        size={40}
        className="absolute bottom-2 right-2 text-white/10"
      />
    </div>
  );

  /* ---------------- RENDER ---------------- */
  return (
    <section ref={ref} className="relative max-w-7xl mx-auto px-6 py-32">
      <style>{`
        @keyframes fadeInUp {
          from { opacity:0; transform:translateY(40px); }
          to { opacity:1; transform:translateY(0); }
        }
        @keyframes spin-slow {
          from { transform:rotate(0deg); }
          to { transform:rotate(360deg); }
        }
      `}</style>

      <div className="text-center mb-24">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-bold text-white"
        >
          How merchants <span className="text-white/20">execute</span> on Blip
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
