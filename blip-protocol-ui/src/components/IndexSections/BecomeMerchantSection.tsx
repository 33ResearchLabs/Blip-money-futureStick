import { memo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

const STEPS = [
  { t: "Apply", d: "30 seconds. Tell us your country and volume." },
  { t: "Verify", d: "Quick identity check, no paperwork drama." },
  { t: "Start earning", d: "Fulfill your first trade within the hour." },
];

function OnboardingVisual() {
  return (
    <div className="relative aspect-[5/6] w-full max-w-[520px] mx-auto">
      {/* IMAGE SLOT — drop a photo of a merchant on their phone here */}
      <div className="absolute inset-0 rounded-[28px] bg-gradient-to-tr from-[#1a1411] via-black to-black border border-white/[0.06] overflow-hidden">
        <div
          className="absolute -top-32 -left-20 w-[480px] h-[480px] rounded-full opacity-[0.16] blur-3xl"
          style={{ background: "radial-gradient(circle, #cc785c 0%, transparent 60%)" }}
        />

        {/* Mock phone */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[230px] h-[440px] rounded-[36px] bg-black border border-white/[0.1] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.04)_inset] overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-7 flex items-center justify-between px-5">
              <span className="text-[9px] font-mono text-white/50">9:41</span>
              <div className="flex items-center gap-1">
                <div className="w-3 h-1 rounded-sm bg-white/60" />
              </div>
            </div>

            <div className="absolute top-10 inset-x-4">
              <div className="text-[18px] font-semibold tracking-tight text-white mb-1">
                Welcome, Ananya
              </div>
              <div className="text-[10px] text-white/45 mb-5">
                Step 2 of 3 · Verification
              </div>

              <div className="space-y-2">
                {[
                  { label: "Country", value: "India", done: true },
                  { label: "Volume", value: "$50K/mo", done: true },
                  { label: "ID Check", value: "In review", done: false },
                ].map((row, i) => (
                  <motion.div
                    key={row.label}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
                    className="flex items-center justify-between rounded-lg bg-white/[0.03] border border-white/[0.06] px-3 py-2.5"
                  >
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-white/40">
                        {row.label}
                      </div>
                      <div className="text-[12px] text-white font-medium mt-0.5">
                        {row.value}
                      </div>
                    </div>
                    {row.done ? (
                      <div className="w-5 h-5 rounded-full bg-[#cc785c]/15 flex items-center justify-center">
                        <Check className="w-3 h-3 text-[#cc785c]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#cc785c] animate-pulse" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="mt-5"
              >
                <div className="rounded-full bg-white text-black text-[11px] font-semibold tracking-tight py-2.5 text-center">
                  Continue
                </div>
              </motion.div>

              <div className="mt-3 text-center text-[9px] text-white/40 font-mono">
                ⏱  ~ 2 min remaining
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const BecomeMerchantSection = memo(function BecomeMerchantSection() {
  return (
    <section className="relative bg-black text-white py-28 md:py-40 overflow-hidden">
      <div
        className="pointer-events-none absolute -right-40 top-1/4 w-[600px] h-[600px] rounded-full opacity-[0.07] blur-3xl"
        style={{ background: "radial-gradient(circle, #cc785c 0%, transparent 70%)" }}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-14 md:gap-20 items-center">
        {/* Visual LEFT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1.1, ease: EASE }}
          className="md:order-1 order-2"
        >
          <OnboardingVisual />
        </motion.div>

        {/* Text RIGHT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1, delay: 0.1, ease: EASE }}
          className="md:order-2 order-1"
        >
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#cc785c]" />
            <span className="text-[11px] font-bold tracking-[0.32em] uppercase" style={{ color: "#cc785c" }}>
              Onboard in Minutes
            </span>
          </div>
          <h2 className="text-[clamp(2.4rem,5.5vw,4.25rem)] font-semibold tracking-[-0.02em] leading-[1.02] mb-6">
            Become a merchant <br className="hidden md:block" />
            <span className="text-white/55">in 5 minutes.</span>
          </h2>
          <p className="text-white/60 text-[1.05rem] md:text-[1.15rem] leading-[1.55] max-w-[480px] mb-8">
            Three quick steps. Then you're live on the Blip Market, fulfilling
            real settlement demand.
          </p>

          <div className="space-y-3 mb-9">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.t}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.12 }}
                className="flex gap-4"
              >
                <div className="shrink-0 w-7 h-7 rounded-full border border-[#cc785c]/40 bg-[#cc785c]/[0.08] flex items-center justify-center text-[11px] font-mono font-semibold text-[#cc785c]">
                  {i + 1}
                </div>
                <div>
                  <div className="text-[14px] font-semibold text-white">{s.t}</div>
                  <div className="text-[13px] text-white/55 mt-0.5">{s.d}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Link
              to="/merchant"
              className="group inline-flex items-center justify-center gap-2 h-[44px] px-6 rounded-full bg-white text-black text-[13.5px] font-semibold tracking-tight transition-all duration-300 shadow-[0_1px_0_rgba(255,255,255,0.4)_inset,0_10px_30px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_1px_0_rgba(255,255,255,0.4)_inset,0_16px_42px_-12px_rgba(255,255,255,0.4)] hover:-translate-y-[1px]"
            >
              <span>Start Onboarding</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/merchant"
              className="group inline-flex items-center gap-1.5 h-[44px] px-2 text-white/75 text-[13.5px] font-medium tracking-tight hover:text-white transition-colors"
            >
              <span>Learn more</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

export default BecomeMerchantSection;
