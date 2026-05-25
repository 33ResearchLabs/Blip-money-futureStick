import { motion } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

const MERCHANT_CARDS = [
  {
    img: "/illustrations/zero-fees-card.png",
    label: "ZERO FEES THIS WEEK",
    accent: "#6ee0c5",
    titlePre: "Don't miss out on",
    titleAccent: "0% fees",
    titleTail: " this week.",
    cta: "Send money",
    footnote: "Auto-applied at checkout",
  },
  {
    img: "/illustrations/first-transfers-card.png",
    label: "FIRST TRANSFERS · FEE-FREE",
    accent: "#ffd45a",
    titlePre: "Your first 3 transfers",
    titleAccent: "home — fee-free.",
    titleTail: "",
    cta: "Send home",
    footnote: "USD → INR live rate",
  },
  {
    img: "/illustrations/bring-friend-card.png",
    label: "BRING A FRIEND",
    accent: "#ff8c6b",
    titlePre: "Bring a friend.",
    titleAccent: "You both get upto $20.",
    titleTail: "",
    cta: "Share invite",
    footnote: "Paid when they trade $100+",
  },
  {
    img: "/illustrations/boost-trades-card.png",
    label: "BOOST ON YOUR NEXT 5 TRADES",
    accent: "#9ad1ff",
    titlePre: "Stack a",
    titleAccent: "+15% boost",
    titleTail: " on your next 5 trades.",
    cta: "Activate boost",
    footnote: "Avg user banked $48 last week",
  },
] as const;

export function MerchantCardsImageCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.85), behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Prev / next side buttons — hidden on small mobile, shown md+ */}
      <button
        onClick={() => scrollBy(-1)}
        aria-label="Previous"
        className="hidden md:flex absolute -left-4 lg:-left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 items-center justify-center rounded-full bg-white text-black shadow-[0_18px_40px_-14px_rgba(0,0,0,0.55)] hover:-translate-y-[calc(50%+1px)] transition-transform"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => scrollBy(1)}
        aria-label="Next"
        className="hidden md:flex absolute -right-4 lg:-right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 items-center justify-center rounded-full bg-white text-black shadow-[0_18px_40px_-14px_rgba(0,0,0,0.55)] hover:-translate-y-[calc(50%+1px)] transition-transform"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
      {MERCHANT_CARDS.map((c, i) => (
        <motion.div
          key={c.img}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8%" }}
          transition={{ duration: 0.55, delay: i * 0.05, ease: EASE }}
          whileHover={{ y: -4 }}
          className="relative rounded-[22px] overflow-hidden text-left flex flex-col snap-start shrink-0 w-[78vw] sm:w-[300px] md:w-[280px] lg:w-[260px] xl:w-[280px]"
          style={{
            background: "#ffffff",
            border: "1px solid rgba(0,0,0,0.06)",
            transition: "transform 0.35s ease",
            boxShadow: "0 24px 60px -24px rgba(0,0,0,0.15)",
          }}
        >
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: "1/1" }}>
            <img
              src={c.img}
              alt={c.label}
              className="absolute inset-0 w-full h-full object-cover block"
              loading="lazy"
            />
          </div>
          <div className="px-5 py-5 flex-1 flex flex-col">
            <div className="flex items-center gap-1.5 mb-2.5">
              <span className="w-1 h-1 rounded-full" style={{ background: c.accent }} />
              <span
                className="text-[10px] font-bold tracking-[0.18em]"
                style={{ color: "rgba(0,0,0,0.55)" }}
              >
                {c.label}
              </span>
            </div>
            <div
              className="font-display leading-[1.12] flex-1"
              style={{
                fontSize: "20px",
                fontWeight: 600,
                letterSpacing: "-0.025em",
                color: "#0a0a0a",
              }}
            >
              {c.titlePre}{" "}
              <span
                style={{
                  color: c.accent,
                  fontStyle: "italic",
                  fontWeight: 500,
                  fontFamily: "ui-serif, Georgia, serif",
                }}
              >
                {c.titleAccent}
              </span>
              {c.titleTail && <span>{c.titleTail}</span>}
            </div>
            <div className="mt-5 flex items-center justify-between gap-2 flex-wrap">
              <Link
                to="https://app.blip.money/waitlist/merchant-login"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold tracking-tight whitespace-nowrap"
                style={{ background: "#0a0a0a", color: "#fff" }}
              >
                {c.cta} →
              </Link>
              <span
                className="text-[10px] tracking-tight leading-tight"
                style={{ color: "rgba(0,0,0,0.45)" }}
              >
                {c.footnote}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
      </div>
    </div>
  );
}
