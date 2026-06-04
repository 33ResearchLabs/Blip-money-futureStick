import { memo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, X, Check } from "lucide-react";
import {
  MerchantDashboardBody,
  useMerchantDashboardState,
} from "./LiveMerchantDashboard";
import MobileMerchantDashboard from "@/components/MobileDashboard";
import { EditableText } from "@/components/dashboard/Editable";

const EASE = [0.16, 1, 0.3, 1] as const;

function WaitlistPopup({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6"
          style={{
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(10px)",
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[360px] rounded-[20px] overflow-hidden bg-white text-black"
            style={{
              boxShadow:
                "0 40px 100px -24px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,0,0,0.04)",
            }}
          >
            <button
              onClick={onClose}
              className="absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-full flex items-center justify-center text-black/45 hover:text-black hover:bg-black/[0.08] transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Hero band — merchant illustration */}
            <div className="relative px-5 pt-7 pb-5 text-center overflow-hidden">
              <div
                aria-hidden
                className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
                style={{
                  top: 4,
                  width: 220,
                  height: 130,
                  background:
                    "radial-gradient(ellipse at center, rgba(255,180,140,0.55) 0%, transparent 70%)",
                  filter: "blur(10px)",
                }}
              />

              <motion.div
                initial={{ scale: 0.92, opacity: 0, y: 12 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="relative mx-auto mb-3 rounded-2xl overflow-hidden"
                style={{
                  width: 140,
                  height: 140,
                  background: "#f1ece4",
                  boxShadow: "0 6px 16px -8px rgba(0,0,0,0.2)",
                }}
              >
                <img
                  src="/generated/popup-earned.png"
                  alt="Phone showing a $30 earnings notification with gold coins"
                  className="w-full h-full object-contain p-2"
                />
              </motion.div>

              {/* Order complete badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.25, ease: EASE }}
                className="inline-flex items-center gap-1.5 mb-3 px-3 py-1 rounded-full"
                style={{ background: "#0a0a0a", color: "#fff" }}
              >
                <Check className="w-3 h-3" strokeWidth={2.8} />
                <span className="text-[10.5px] font-bold tracking-[0.16em] uppercase">
                  Order Complete
                </span>
              </motion.div>

              <div
                className="font-display tracking-tight leading-[1.05] text-black"
                style={{
                  fontSize: "22px",
                  fontWeight: 600,
                  letterSpacing: "-0.028em",
                }}
              >
                Merchant earned <span style={{ color: "#cc785c" }}>$30</span>
              </div>
              <p className="text-[11.5px] text-black/55 mt-1.5 tracking-tight">
                on a single trade · 90 seconds ago
              </p>
            </div>

            {/* Compact CTA strip */}
            <div className="px-5 py-4 bg-white border-t border-black/[0.05]">
              <div
                className="rounded-xl px-4 py-3 mb-4"
                style={{ background: "#0a0a0a", color: "#fff" }}
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="text-[9px] font-bold tracking-[0.2em] uppercase text-white/45">
                      Provide Liquidity
                    </div>
                    <div
                      className="font-display tracking-tight mt-0.5"
                      style={{ fontSize: "16px", fontWeight: 600 }}
                    >
                      Earn up to <span style={{ color: "#cc785c" }}>10%</span>{" "}
                      per trade
                    </div>
                  </div>
                  <div className="text-[10.5px] font-mono text-white/45 whitespace-nowrap">
                    24/7
                  </div>
                </div>
              </div>

              <a
                href="https://app.blip.money/waitlist/merchant"
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="group flex items-center justify-center gap-2 h-[46px] rounded-full bg-black text-white text-[14px] font-semibold tracking-tight transition-all duration-300 hover:-translate-y-[1px] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.4)]"
              >
                <span>Join as Merchant</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </a>

              <p className="text-[10.5px] text-black/40 text-center mt-3 leading-relaxed">
                No guaranteed returns. Earnings depend on volume + competitive
                spreads.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const KPIS = [
  { label: "Volume Today", value: "$12,840", delta: "+18.4%" },
  { label: "Trades Filled", value: "47", delta: "+12" },
  { label: "Total Earned", value: "$642.18", delta: "+8.2%" },
];

/* ── Floating profit "windows" — zoomed-in merchant earnings tooltips
      that pulse into view around the section background. ── */
const PROFITS = [
  {
    initial: "A",
    name: "Ananya M.",
    pair: "USD → INR",
    earn: 84.0,
    pos: "left-[3%] top-[18%]",
    rotate: -4,
  },
  {
    initial: "K",
    name: "Karan S.",
    pair: "EUR → PHP",
    earn: 57.5,
    pos: "right-[4%] top-[32%]",
    rotate: 5,
  },
  {
    initial: "M",
    name: "Mei L.",
    pair: "USD → NGN",
    earn: 190.0,
    pos: "left-[5%] bottom-[18%]",
    rotate: -3,
  },
  {
    initial: "R",
    name: "Rohit P.",
    pair: "USD → INR",
    earn: 31.2,
    pos: "right-[3%] bottom-[28%]",
    rotate: 6,
  },
];

function ProfitTooltipSwarm() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden md:block">
      {PROFITS.map((p, i) => (
        <motion.div
          key={p.name}
          initial={{ opacity: 0, scale: 0.6, y: 12 }}
          whileInView={{
            opacity: [0, 1, 1, 0.92, 1],
            scale: [0.6, 1.08, 1, 1, 1],
            y: [12, 0, 0, -2, 0],
          }}
          viewport={{ once: false, margin: "-10%" }}
          transition={{
            duration: 4,
            delay: 1.2 + i * 0.9,
            times: [0, 0.15, 0.6, 0.8, 1],
            repeat: Infinity,
            repeatDelay: 5,
            ease: EASE,
          }}
          className={`absolute ${p.pos}`}
          style={{ transform: `rotate(${p.rotate}deg)` }}
        >
          <div
            className="relative rounded-2xl bg-white text-black px-3.5 py-2.5 flex items-center gap-2.5"
            style={{
              boxShadow:
                "0 30px 70px -18px rgba(204,120,92,0.35), 0 12px 24px -8px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,0,0,0.04)",
              minWidth: 180,
            }}
          >
            {/* avatar */}
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#ffa473,#cc785c)" }}
            >
              {p.initial}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-black/45">
                  Settled
                </span>
                <span className="relative flex w-1 h-1">
                  <span className="absolute inset-0 rounded-full bg-[#cc785c] opacity-60 animate-ping" />
                  <span className="relative inline-flex rounded-full w-1 h-1 bg-[#cc785c]" />
                </span>
              </div>
              <div className="text-[12.5px] font-semibold tracking-tight text-black truncate">
                {p.name}
              </div>
              <div className="text-[10px] text-black/45 font-mono mt-0.5">
                {p.pair}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[9px] font-bold tracking-[0.16em] uppercase text-black/40">
                Earned
              </div>
              <div
                className="font-mono font-bold tabular-nums text-[15px] leading-none mt-0.5"
                style={{ color: "#cc785c" }}
              >
                +${p.earn.toFixed(p.earn % 1 === 0 ? 0 : 2)}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function TiltDashboard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 1.2, delay: 0.2, ease: EASE }}
      className="relative rounded-[28px] bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.08] p-3 md:p-4 overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)",
        }}
      />
      <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {children}
      </div>
    </motion.div>
  );
}

const BlipMarketsSection = memo(function BlipMarketsSection() {
  const [popupOpen, setPopupOpen] = useState(false);
  const state = useMerchantDashboardState();

  // Auto-open popup once when section has been viewed for ~6s
  useEffect(() => {
    let timer: number | undefined;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            if (timer) return;
            timer = window.setTimeout(() => {
              setPopupOpen(true);
            }, 4000);
          } else if (!e.isIntersecting && timer) {
            window.clearTimeout(timer);
            timer = undefined;
          }
        });
      },
      { threshold: 0.2 },
    );
    const el = document.getElementById("blip-markets-section");
    if (el) obs.observe(el);
    return () => {
      obs.disconnect();
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  return (
    <section
      id="blip-markets-section"
      className="relative bg-black text-white py-16 md:py-32 overflow-hidden"
    >
      <div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-0 w-[900px] h-[600px] rounded-full opacity-[0.08] blur-3xl"
        style={{
          background: "radial-gradient(circle, #cc785c 0%, transparent 65%)",
        }}
      />

      <ProfitTooltipSwarm />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10">
        {/* Eyebrow + headline — centered keynote style */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1, ease: EASE }}
          className="text-center max-w-3xl mx-auto mb-8 md:mb-14"
        >
          <EditableText
            id="home.markets.eyebrow"
            default="Blip Markets"
            as="div"
            className="text-[11px] font-bold tracking-[0.36em] uppercase mb-5"
            style={{ color: "#cc785c" }}
          />
          <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] font-semibold tracking-[-0.025em] leading-[1.02] mb-4 md:mb-6">
            <EditableText
              id="home.markets.title.line1"
              default="A live marketplace"
              as="span"
            />{" "}
            <br className="hidden md:block" />
            <EditableText
              id="home.markets.title.line2"
              default="for global settlement."
              as="span"
              className="italic"
            />
          </h2>
          <p className="text-white/60 text-[0.95rem] md:text-[1.2rem] leading-[1.55] max-w-[620px] mx-auto px-2">
            <EditableText
              id="home.markets.sub"
              default="Watch real money move. Merchants compete. Trades clear in seconds."
              multiline
            />
          </p>
        </motion.div>

        {/* Big earnings strip */}
        {/* <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1, delay: 0.1, ease: EASE }}
          className="grid grid-cols-3 gap-2 md:gap-3 mb-6 md:mb-12 max-w-4xl mx-auto"
        >
          {KPIS.map((k, i) => (
            <div
              key={k.label}
              className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-2.5 md:p-6 backdrop-blur-sm min-w-0 overflow-hidden"
            >
              <div className="text-[8px] md:text-[10px] tracking-[0.12em] md:tracking-[0.28em] uppercase text-white/45 font-semibold mb-1 md:mb-3 whitespace-nowrap">
                {k.label}
              </div>
              <div className="flex flex-col items-start gap-0.5 md:flex-row md:items-baseline md:gap-2 min-w-0">
                <span className="text-[15px] md:text-[40px] font-semibold tracking-[-0.025em] tabular-nums text-white leading-none truncate max-w-full">
                  {k.value}
                </span>
                <span className="text-[9px] md:text-[12px] font-mono text-[#cc785c]">
                  {k.delta}
                </span>
              </div>
            </div>
          ))}
        </motion.div> */}

        {/* The live dashboard — rests at a subtle tilt, straightens on hover · desktop only */}
        <div className="hidden lg:block">
          <TiltDashboard>
            <MerchantDashboardBody state={state} />
          </TiltDashboard>
        </div>

        {/* Mobile / tablet — mobile dashboard mockup */}
        <div className="lg:hidden w-full flex justify-center overflow-hidden px-4">
          <div className="w-full max-w-[400px] rounded-[28px] overflow-hidden border border-white/10 shadow-2xl">
            <MobileMerchantDashboard />
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 md:mt-12">
          {/* <Link
            to="https://app.blip.money/waitlist/user"
            className="group inline-flex items-center justify-center gap-2 h-[48px] px-7 rounded-full bg-white text-black text-[14px] font-semibold tracking-tight transition-all duration-300 shadow-[0_1px_0_rgba(255,255,255,0.4)_inset,0_10px_30px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_1px_0_rgba(255,255,255,0.4)_inset,0_16px_42px_-12px_rgba(255,255,255,0.4)] hover:-translate-y-[1px]"
          >
            <EditableText id="home.markets.cta.primary" default="Join Waitlist" as="span" />
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link> */}
          <a
            href="https://app.blip.money/waitlist/merchant-login"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-2 h-[48px] px-7 rounded-full bg-white text-black text-[14px] font-semibold tracking-tight transition-all duration-300 shadow-[0_1px_0_rgba(255,255,255,0.4)_inset,0_10px_30px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_1px_0_rgba(255,255,255,0.4)_inset,0_16px_42px_-12px_rgba(255,255,255,0.4)] hover:-translate-y-[1px]"
          >
            <EditableText
              id="home.markets.cta.primary"
              default="Join Waitlist"
              as="span"
            />
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </a>
          <Link
            to="/market"
            className="group inline-flex items-center gap-1.5 h-[48px] px-4 text-white/75 text-[14px] font-medium tracking-tight hover:text-white transition-colors"
          >
            <EditableText
              id="home.markets.cta.secondary"
              default="Explore Blip Market"
              as="span"
            />
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      <WaitlistPopup open={popupOpen} onClose={() => setPopupOpen(false)} />
    </section>
  );
});

export default BlipMarketsSection;
