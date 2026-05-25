import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface Props {
  /** Where the CTA navigates. */
  to: string;
  /** Big editorial hero stat shown on the left, e.g. "10%", "5%", "60s". */
  stat: string;
  /** Tiny caps label under the stat. */
  statLabel: string;
  /** Top eyebrow caps in Claude orange. */
  eyebrow: string;
  /** Bold white takeaway line. */
  title: string;
}

/* Commercial cross-sell card.
   Dark ink surface, big editorial stat on the left, eyebrow + takeaway on
   the right, arrow chip. Same look used on /waitlist, /merchant-register,
   and /merchant-login. */
export default function CrossSellCard({ to, stat, statLabel, eyebrow, title }: Props) {
  return (
    <Link
      to={to}
      className="group w-full max-w-[440px] mx-auto lg:mx-0 relative overflow-hidden rounded-2xl block text-left transition-transform hover:-translate-y-[2px]"
      style={{
        background: "linear-gradient(135deg, #0a0a0a 0%, #1d1d1f 100%)",
        boxShadow:
          "0 24px 60px -24px rgba(0,0,0,0.55), 0 8px 24px -12px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
      }}
    >
      {/* Iridescent sheen on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{
          background:
            "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.06) 50%, transparent 70%)",
        }}
      />
      {/* Warm corner glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-10 w-48 h-48 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(204,120,92,0.22) 0%, rgba(204,120,92,0) 65%)",
          filter: "blur(2px)",
        }}
      />

      <div className="relative z-10 px-5 py-4 flex items-center gap-4">
        {/* Hero stat */}
        <div className="flex flex-col leading-none shrink-0">
          <span
            className="font-display text-white"
            style={{
              fontSize: "44px",
              fontWeight: 600,
              letterSpacing: "-0.06em",
              lineHeight: 0.95,
            }}
          >
            {stat}
          </span>
          <span
            className="text-[9px] font-semibold tracking-[0.22em] uppercase mt-1.5"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            {statLabel}
          </span>
        </div>

        <span
          aria-hidden
          className="h-12 w-px shrink-0"
          style={{ background: "rgba(255,255,255,0.10)" }}
        />

        {/* Copy */}
        <div className="flex-1 min-w-0">
          <div
            className="text-[10px] font-semibold tracking-[0.22em] uppercase mb-1"
            style={{ color: "#cc785c" }}
          >
            {eyebrow}
          </div>
          <p
            className="text-[13px] font-semibold leading-snug text-white"
            style={{ letterSpacing: "-0.01em" }}
          >
            {title}
          </p>
        </div>

        {/* Arrow chip */}
        <span
          className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full transition-transform group-hover:translate-x-0.5"
          style={{
            background: "rgba(255,255,255,0.10)",
            color: "#ffffff",
          }}
          aria-hidden
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}
