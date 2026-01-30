import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Send,
  Users,
  Twitter,
  Briefcase,
  Mail,
  Zap,
  Lock,
  Rocket,
  Clock,
  Bell,
  Sparkles,
  ArrowLeft,
  Shield,
  Globe,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { SEO } from "@/components";
import { toast } from "sonner";

/* ============================================
   2025/2026 COMING SOON PAGE
   Matching homepage design system
   - Orange (#ffffff) accent color
   - Dark theme with subtle gradients
   - Animated particles
   - Clean, minimal aesthetic
   ============================================ */

// Animated particle background
const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      opacity: number;
    }> = [];

    const particleCount = window.innerWidth > 768 ? 80 : 40;

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.5 + 0.5,
        color: Math.random() > 0.7 ? "#ffffff" : "rgba(255, 255, 255, 0.3)",
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255, 107, 53, ${0.1 * (1 - distance / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Update and draw particles
      particles.forEach((p) => {
        // Mouse interaction
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          p.vx -= dx * 0.0001;
          p.vy -= dy * 0.0001;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 opacity-60" />;
};

// Countdown timer component
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Fixed launch date: February 24, 2026
    const launchDate = new Date(2026, 1, 24, 0, 0, 0).getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Minutes" },
    { value: timeLeft.seconds, label: "Seconds" },
  ];

  return (
    <div className="flex items-center justify-center gap-3 md:gap-6">
      {timeUnits.map((unit, i) => (
        <React.Fragment key={unit.label}>
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center backdrop-blur-sm">
                <span className="text-2xl md:text-3xl font-bold text-white tabular-nums">
                  {String(unit.value).padStart(2, "0")}
                </span>
              </div>
              <div className="absolute -inset-1 rounded-2xl bg-[#ffffff]/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-[10px] md:text-xs text-white/40 uppercase tracking-wider mt-2 block">
              {unit.label}
            </span>
          </div>
          {i < timeUnits.length - 1 && (
            <span className="text-2xl md:text-3xl text-white/20 font-light">
              :
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// Main Coming Soon Component
const ComingSoon = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email || status === "loading") return;

      setStatus("loading");

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (email.includes("@") && email.length > 5) {
        setStatus("success");
        toast.success("You're on the list!", {
          description: "We'll notify you as soon as we launch!",
        });
        setEmail(""); // Clear email after successful submission
      } else {
        setStatus("error");
        toast.error("Invalid email", {
          description: "Please enter a valid email address.",
        });
      }

      // Reset status after showing toast
      setTimeout(() => setStatus("idle"), 2000);
    },
    [email, status],
  );

  return (
    <>
      <SEO
        title="Coming Soon | Blip Money"
        description="Something big is coming. Join the waitlist to be the first to know when we launch new features."
        canonical="https://blip.money/coming-soon"
      />

      <div className="min-h-screen bg-black text-white overflow-hidden">
        {/* Background layers */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-[#050505] to-black" />

          {/* Floating orbs */}
          <motion.div
            className="absolute top-[20%] right-[10%] w-[500px] h-[500px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,107,53,0.15) 0%, transparent 70%)",
              x: mousePosition.x * -40,
              y: mousePosition.y * -30,
            }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,107,53,0.08) 0%, transparent 70%)",
              x: mousePosition.x * 30,
              y: mousePosition.y * 20,
            }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />

          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,107,53,0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,107,53,0.5) 1px, transparent 1px)
              `,
              backgroundSize: "80px 80px",
            }}
          />
        </div>

        <ParticleBackground />

        {/* Back button */}
        {/* <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed top-6 left-6 z-50"
        >
          <Link
            to="/"
            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 hover:border-[#ffffff]/30 hover:bg-white/[0.05] transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 text-white/50 group-hover:text-[#ffffff] transition-colors" />
            <span className="text-sm text-white/50 group-hover:text-white transition-colors">Back</span>
          </Link>
        </motion.div> */}

        {/* Main content */}
        <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-10"
              style={{
                background: "rgba(255, 107, 53, 0.05)",
                border: "1px solid rgba(255, 107, 53, 0.2)",
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Rocket className="w-4 h-4 text-[#ffffff]" />
              </motion.div>
              <span className="text-[13px] text-white/70 font-medium tracking-wide">
                Launch Imminent
              </span>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6 tracking-tight"
            >
              Something
              <br />
              <span className="text-[#ffffff]">Big</span> is Coming.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed mb-12"
            >
              We're building the future of decentralized payments. Be the first
              to experience instant, borderless transactions with maximum
              privacy.
            </motion.p>

            {/* Countdown timer */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="mb-16"
            >
              <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] mb-6">
                Launching In
              </p>
              <CountdownTimer />
            </motion.div>

            {/* Email signup */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="max-w-md mx-auto"
            >
              <div className="rounded-3xl bg-white/[0.02] border border-white/[0.08] p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#ffffff]/10 border border-[#ffffff]/20 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-[#ffffff]" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-semibold text-white">
                      Get Notified
                    </h3>
                    <p className="text-xs text-white/40">
                      Be first to know when we launch
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status === "error") setStatus("idle");
                      }}
                      disabled={status === "loading"}
                      className="w-full bg-white/[0.03] border border-white/[0.08] py-3.5 pl-11 pr-4 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#ffffff]/50 focus:ring-1 focus:ring-[#ffffff]/20 transition-all disabled:opacity-50"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full bg-[#ffffff] text-black py-3.5 rounded-full font-semibold hover:bg-[#e5e5e5]  transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {status === "loading" ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full" />
                        </motion.div>
                        <span>Subscribing...</span>
                      </>
                    ) : (
                      <>
                        <span>Notify Me</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="mt-12"
            >
              <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] mb-6">
                Join the Community
              </p>
              <div className="flex items-center justify-center gap-4">
                <a
                  href="https://x.com/blipmoney_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 px-5 py-3 rounded-full bg-white/[0.02] border border-white/[0.08] hover:border-[#ffffff]/30 hover:bg-white/[0.04] transition-all duration-300"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center group-hover:bg-[#ffffff]/10 transition-colors">
                    <Twitter className="w-4 h-4 text-white/50 group-hover:text-[#ffffff] transition-colors" />
                  </div>
                  <span className="text-sm text-white/60 group-hover:text-white transition-colors">
                    Follow on X
                  </span>
                </a>

                <a
                  href="https://t.me/+3DpHLzc2BfJhOWEx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 px-5 py-3 rounded-full bg-white/[0.02] border border-white/[0.08] hover:border-[#ffffff]/30 hover:bg-white/[0.04] transition-all duration-300"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center group-hover:bg-[#ffffff]/10 transition-colors">
                    <Send className="w-4 h-4 text-white/50 group-hover:text-[#ffffff] transition-colors" />
                  </div>
                  <span className="text-sm text-white/60 group-hover:text-white transition-colors">
                    Join Telegram
                  </span>
                </a>
              </div>
            </motion.div>

            {/* Features preview */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {[
                {
                  icon: Zap,
                  title: "Instant Transfers",
                  desc: "Sub-second settlement times globally",
                },
                {
                  icon: Shield,
                  title: "Maximum Privacy",
                  desc: "Zero-knowledge proof transactions",
                },
                {
                  icon: Globe,
                  title: "Borderless",
                  desc: "Send value anywhere, anytime",
                },
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1 + i * 0.1 }}
                  className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] group hover:bg-white/[0.03] hover:border-white/[0.1] transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#ffffff]/10 border border-[#ffffff]/20 flex items-center justify-center mb-4 group-hover:bg-[#ffffff]/20 transition-colors">
                    <feature.icon className="w-5 h-5 text-[#ffffff]" />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-white/40">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ComingSoon;
