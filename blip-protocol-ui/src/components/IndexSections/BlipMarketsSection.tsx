import { memo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, X } from "lucide-react";
import {
  MerchantDashboardBody,
  useMerchantDashboardState,
} from "./LiveMerchantDashboard";

const EASE = [0.16, 1, 0.3, 1] as const;

function WaitlistPopup({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.35, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl bg-[#0d0a08] border border-white/[0.08] p-8 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-white/[0.05] flex items-center justify-center text-white/50 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div
              className="text-[11px] font-bold tracking-[0.32em] uppercase mb-3"
              style={{ color: "#cc785c" }}
            >
              Early Access
            </div>
            <h3 className="text-[26px] font-semibold tracking-tight text-white leading-tight mb-3">
              Join the Blip Market waitlist.
            </h3>
            <p className="text-white/55 text-[14px] leading-relaxed mb-6">
              Get notified when Blip opens to your country. Early users get priority
              merchant matching and reduced fees.
            </p>

            <Link
              to="/register"
              className="group flex items-center justify-center gap-2 h-[48px] rounded-full bg-white text-black text-[14px] font-semibold tracking-tight transition-all duration-300 hover:-translate-y-[1px] shadow-[0_10px_30px_-10px_rgba(255,255,255,0.3)]"
            >
              <span>Join Waitlist</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>

            <p className="text-[11px] text-white/35 text-center mt-4">
              We'll only email you when there's something real to share.
            </p>
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

const BlipMarketsSection = memo(function BlipMarketsSection() {
  const [popupOpen, setPopupOpen] = useState(false);
  const state = useMerchantDashboardState();

  // Auto-open popup once when section has been viewed for ~6s
  useEffect(() => {
    let timer: number | undefined;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !sessionStorage.getItem("blip-mkts-prompted")) {
            timer = window.setTimeout(() => {
              setPopupOpen(true);
              sessionStorage.setItem("blip-mkts-prompted", "1");
            }, 6000);
          } else if (!e.isIntersecting && timer) {
            window.clearTimeout(timer);
          }
        });
      },
      { threshold: 0.4 }
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
      className="relative bg-black text-white py-28 md:py-36 overflow-hidden"
    >
      <div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-0 w-[900px] h-[600px] rounded-full opacity-[0.08] blur-3xl"
        style={{ background: "radial-gradient(circle, #cc785c 0%, transparent 65%)" }}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10">
        {/* Eyebrow + headline — centered keynote style */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1, ease: EASE }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div
            className="text-[11px] font-bold tracking-[0.36em] uppercase mb-5"
            style={{ color: "#cc785c" }}
          >
            Blip Markets
          </div>
          <h2 className="text-[clamp(2.6rem,6vw,5rem)] font-semibold tracking-[-0.025em] leading-[1.02] mb-6">
            A live marketplace <br className="hidden md:block" />
            <span className="text-white/55">for global settlement.</span>
          </h2>
          <p className="text-white/60 text-[1.05rem] md:text-[1.2rem] leading-[1.55] max-w-[620px] mx-auto">
            Watch real money move. Merchants compete. Trades clear in seconds.
            This is the market that powers every Blip transfer.
          </p>
        </motion.div>

        {/* Big earnings strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1, delay: 0.1, ease: EASE }}
          className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-14 max-w-4xl mx-auto"
        >
          {KPIS.map((k, i) => (
            <div
              key={k.label}
              className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 backdrop-blur-sm"
            >
              <div className="text-[10px] tracking-[0.28em] uppercase text-white/45 font-semibold mb-3">
                {k.label}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-[34px] md:text-[40px] font-semibold tracking-[-0.025em] tabular-nums text-white leading-none">
                  {k.value}
                </span>
                <span className="text-[12px] font-mono text-[#cc785c]">{k.delta}</span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* The live dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.2, delay: 0.2, ease: EASE }}
          className="relative rounded-[28px] bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/[0.07] p-3 md:p-4 shadow-[0_60px_160px_-30px_rgba(0,0,0,0.9)]"
        >
          <MerchantDashboardBody state={state} />
        </motion.div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-14">
          <button
            onClick={() => setPopupOpen(true)}
            className="group inline-flex items-center justify-center gap-2 h-[48px] px-7 rounded-full bg-white text-black text-[14px] font-semibold tracking-tight transition-all duration-300 shadow-[0_1px_0_rgba(255,255,255,0.4)_inset,0_10px_30px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_1px_0_rgba(255,255,255,0.4)_inset,0_16px_42px_-12px_rgba(255,255,255,0.4)] hover:-translate-y-[1px]"
          >
            <span>Join Waitlist</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
          <Link
            to="/blip-market"
            className="group inline-flex items-center gap-1.5 h-[48px] px-4 text-white/75 text-[14px] font-medium tracking-tight hover:text-white transition-colors"
          >
            <span>Explore Blip Market</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      <WaitlistPopup open={popupOpen} onClose={() => setPopupOpen(false)} />
    </section>
  );
});

export default BlipMarketsSection;
