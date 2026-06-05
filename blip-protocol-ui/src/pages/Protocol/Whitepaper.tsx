import { useEffect, useRef, useState } from "react";
import {
  Download,
  FileText,
  GitCommit,
  Hash,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { HreflangTags } from "@/components/HreflangTags";

const ACCENT = "#cc785c";
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

const sections = [
  { id: "abstract", title: "Abstract" },
  { id: "problem", title: "The Problem" },
  { id: "market", title: "Blip Market" },
  { id: "participants", title: "Participants" },
  { id: "liquidity", title: "Liquidity Architecture" },
  { id: "lifecycle", title: "Transaction Lifecycle" },
  { id: "staking", title: "Staking & Incentives" },
  { id: "boosts", title: "Boosted Transactions" },
  { id: "api", title: "Blip API" },
  { id: "ecosystem", title: "Ecosystem Vision" },
  { id: "conclusion", title: "Conclusion" },
];

const DOC_META = [
  { label: "Version", value: "1.0" },
  { label: "Pages", value: "14" },
  { label: "Status", value: "Draft" },
  { label: "Updated", value: "May 2026" },
];

/* Liquidity flow diagram */
function LiquidityFlowDiagram() {
  const nodes = [
    {
      id: "staker",
      label: "Staker",
      sub: "provides stake",
      x: 20,
      y: 60,
      w: 120,
      h: 52,
    },
    {
      id: "merchant",
      label: "Merchant",
      sub: "liquidity provider",
      x: 200,
      y: 60,
      w: 130,
      h: 52,
    },
    {
      id: "pool",
      label: "Market Pool",
      sub: "order matching",
      x: 390,
      y: 60,
      w: 130,
      h: 52,
    },
    {
      id: "merchant2",
      label: "Merchant Network",
      sub: "peer settlement",
      x: 580,
      y: 60,
      w: 145,
      h: 52,
    },
    {
      id: "user",
      label: "User",
      sub: "sends / receives",
      x: 390,
      y: 150,
      w: 130,
      h: 52,
    },
    {
      id: "api",
      label: "Blip API",
      sub: "any app, anywhere",
      x: 580,
      y: 150,
      w: 130,
      h: 52,
    },
  ];

  const cx = (n: (typeof nodes)[0]) => n.x + n.w / 2;
  const cy = (n: (typeof nodes)[0]) => n.y + n.h / 2;
  const get = (id: string) => nodes.find((n) => n.id === id)!;

  const arrow = (from: string, to: string, label?: string) => {
    const f = get(from);
    const t = get(to);
    const isRight = t.x > f.x + f.w - 10;
    const x1 = isRight ? f.x + f.w : f.x + f.w / 2;
    const y1 = isRight ? cy(f) : f.y + f.h;
    const x2 = isRight ? t.x : t.x + t.w / 2;
    const y2 = isRight ? cy(t) : t.y;
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    return (
      <g key={`${from}-${to}`}>
        <path
          d={`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`}
          fill="none"
          stroke="rgba(0,0,0,0.16)"
          strokeWidth="1.5"
          markerEnd="url(#arr2)"
        />
        {label && (
          <text
            x={mx}
            y={my - 6}
            textAnchor="middle"
            fontSize="9"
            fill={ACCENT}
            fontFamily={MONO}
          >
            {label}
          </text>
        )}
      </g>
    );
  };

  const isAccent = (id: string) => id === "pool";
  const isDark = (id: string) => id === "api";

  return (
    <div className="overflow-x-auto -mx-2 px-2 my-8">
      <svg
        viewBox="0 0 760 220"
        className="w-full min-w-[580px]"
        style={{ maxHeight: 200 }}
      >
        <defs>
          <marker
            id="arr2"
            markerWidth="7"
            markerHeight="7"
            refX="6"
            refY="3.5"
            orient="auto"
          >
            <path d="M0,0 L7,3.5 L0,7 Z" fill="rgba(0,0,0,0.26)" />
          </marker>
        </defs>
        {arrow("staker", "merchant", "stake")}
        {arrow("merchant", "pool", "liquidity")}
        {arrow("pool", "merchant2", "matched")}
        {arrow("user", "pool", "order")}
        {arrow("pool", "api", "settled")}

        {nodes.map((n) => {
          const accent = isAccent(n.id);
          const dark = isDark(n.id);
          const bg = dark
            ? "#0a0a0a"
            : accent
              ? `${ACCENT}18`
              : "rgba(0,0,0,0.03)";
          const border = dark
            ? "transparent"
            : accent
              ? `${ACCENT}55`
              : "rgba(0,0,0,0.09)";
          const labelColor = dark ? "#fff" : accent ? ACCENT : "#0a0a0a";
          const subColor = dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.42)";
          return (
            <g key={n.id}>
              <rect
                x={n.x}
                y={n.y}
                width={n.w}
                height={n.h}
                rx="10"
                ry="10"
                fill={bg}
                stroke={border}
                strokeWidth="1"
              />
              <text
                x={n.x + n.w / 2}
                y={n.y + 20}
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fontFamily={MONO}
                fill={labelColor}
                letterSpacing="0.04em"
              >
                {n.label}
              </text>
              <text
                x={n.x + n.w / 2}
                y={n.y + 35}
                textAnchor="middle"
                fontSize="9"
                fill={subColor}
                fontFamily={MONO}
              >
                {n.sub}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* Transaction lifecycle diagram */
function LifecycleDiagram() {
  const nodes = [
    {
      id: "ORDER",
      label: "ORDER",
      sub: "user or API",
      x: 20,
      y: 20,
      w: 120,
      h: 52,
    },
    {
      id: "MATCH",
      label: "MATCH",
      sub: "auction + boost",
      x: 180,
      y: 20,
      w: 130,
      h: 52,
    },
    {
      id: "ESCROW",
      label: "ESCROW",
      sub: "funds locked",
      x: 350,
      y: 20,
      w: 120,
      h: 52,
    },
    {
      id: "SETTLE",
      label: "SETTLE",
      sub: "merchant executes",
      x: 510,
      y: 20,
      w: 130,
      h: 52,
    },
    {
      id: "RELEASED",
      label: "RELEASED",
      sub: "funds flow",
      x: 680,
      y: 20,
      w: 120,
      h: 52,
    },
    {
      id: "DISPUTE",
      label: "DISPUTE",
      sub: "DAO resolves",
      x: 510,
      y: 108,
      w: 130,
      h: 52,
    },
    {
      id: "REFUND",
      label: "REFUND",
      sub: "timeout path",
      x: 350,
      y: 108,
      w: 120,
      h: 52,
    },
  ];

  const get = (id: string) => nodes.find((n) => n.id === id)!;
  const cx = (n: (typeof nodes)[0]) => n.x + n.w / 2;
  const cy = (n: (typeof nodes)[0]) => n.y + n.h / 2;

  const straight = (from: string, to: string) => {
    const f = get(from);
    const t = get(to);
    const x1 = f.x + f.w;
    const y1 = cy(f);
    const x2 = t.x;
    const y2 = cy(t);
    const mx = (x1 + x2) / 2;
    return (
      <path
        key={`${from}-${to}`}
        d={`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`}
        fill="none"
        stroke="rgba(0,0,0,0.16)"
        strokeWidth="1.5"
        markerEnd="url(#arr3)"
      />
    );
  };

  const drop = (from: string, to: string, dashed?: boolean) => {
    const f = get(from);
    const t = get(to);
    const sx = cx(f);
    const sy = f.y + f.h;
    const ex = t.x + t.w;
    const ey = cy(t);
    return (
      <path
        key={`${from}-${to}-d`}
        d={`M${sx},${sy} L${sx},${ey} L${ex},${ey}`}
        fill="none"
        stroke="rgba(0,0,0,0.14)"
        strokeWidth="1.5"
        strokeDasharray={dashed ? "4 3" : undefined}
        markerEnd="url(#arr3)"
      />
    );
  };

  const isGood = (id: string) => id === "RELEASED";
  const isBad = (id: string) => ["DISPUTE", "REFUND"].includes(id);

  return (
    <div className="overflow-x-auto -mx-2 px-2 my-8">
      <svg
        viewBox="0 0 830 175"
        className="w-full min-w-[640px]"
        style={{ maxHeight: 170 }}
      >
        <defs>
          <marker
            id="arr3"
            markerWidth="7"
            markerHeight="7"
            refX="6"
            refY="3.5"
            orient="auto"
          >
            <path d="M0,0 L7,3.5 L0,7 Z" fill="rgba(0,0,0,0.26)" />
          </marker>
        </defs>
        {straight("ORDER", "MATCH")}
        {straight("MATCH", "ESCROW")}
        {straight("ESCROW", "SETTLE")}
        {straight("SETTLE", "RELEASED")}
        {drop("SETTLE", "DISPUTE", true)}
        {drop("ESCROW", "REFUND", true)}

        {nodes.map((n) => {
          const good = isGood(n.id);
          const bad = isBad(n.id);
          const bg = good
            ? `${ACCENT}18`
            : bad
              ? "rgba(0,0,0,0.035)"
              : "rgba(0,0,0,0.03)";
          const border = good
            ? `${ACCENT}55`
            : bad
              ? "rgba(0,0,0,0.13)"
              : "rgba(0,0,0,0.09)";
          const labelColor = good ? ACCENT : "#0a0a0a";
          return (
            <g key={n.id}>
              <rect
                x={n.x}
                y={n.y}
                width={n.w}
                height={n.h}
                rx="10"
                ry="10"
                fill={bg}
                stroke={border}
                strokeWidth="1"
              />
              <text
                x={n.x + n.w / 2}
                y={n.y + 20}
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fontFamily={MONO}
                fill={labelColor}
                letterSpacing="0.04em"
              >
                {n.label}
              </text>
              <text
                x={n.x + n.w / 2}
                y={n.y + 35}
                textAnchor="middle"
                fontSize="9"
                fill="rgba(0,0,0,0.42)"
                fontFamily={MONO}
              >
                {n.sub}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

const Whitepaper = () => {
  const [activeSection, setActiveSection] = useState("");
  const [progress, setProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    contentRef.current?.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    const target = isDesktop ? contentRef.current : null;
    const readProgress = () => {
      if (target) {
        const total = target.scrollHeight - target.clientHeight;
        setProgress(total > 0 ? Math.min(1, target.scrollTop / total) : 0);
      } else {
        const h = document.documentElement;
        const total = h.scrollHeight - h.clientHeight;
        setProgress(total > 0 ? Math.min(1, h.scrollTop / total) : 0);
      }
    };
    if (target)
      target.addEventListener("scroll", readProgress, { passive: true });
    else window.addEventListener("scroll", readProgress, { passive: true });
    readProgress();
    return () => {
      if (target) target.removeEventListener("scroll", readProgress);
      else window.removeEventListener("scroll", readProgress);
    };
  }, []);

  useEffect(() => {
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        }),
      {
        root: isDesktop ? contentRef.current : null,
        rootMargin: "-20% 0px -70% 0px",
        threshold: 0,
      },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () =>
      sections.forEach((s) => {
        const el = document.getElementById(s.id);
        if (el) observer.unobserve(el);
      });
  }, []);

  const scrollToSection = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = "/whitepaper.pdf";
    a.download = "blip-money-whitepaper.pdf";
    a.click();
  };

  return (
    <>
      <SEO canonical="https://www.blip.money/whitepaper" />
      <HreflangTags path="/whitepaper" />

      {/* Scroll-progress bar */}
      <div
        className="fixed left-0 right-0 z-[60] pointer-events-none"
        style={{ top: 0, height: 2, background: "rgba(0,0,0,0.06)" }}
      >
        <div
          className="h-full origin-left"
          style={{
            width: `${progress * 100}%`,
            background: `linear-gradient(90deg, ${ACCENT}, #ffb38a)`,
            boxShadow: `0 0 12px ${ACCENT}aa`,
            transition: "width 0.08s linear",
          }}
        />
      </div>

      <style>{`
        @media print {
          aside { display: none !important; }
          .prose-tech section { page-break-inside: avoid; scroll-margin-top: 0 !important; }
        }
        .prose-tech section { scroll-margin-top: 120px; }
        .prose-tech h2 {
          font-size: clamp(20px, 3.5vw, 27px);
          line-height: 1.15;
          letter-spacing: -0.028em;
          font-weight: 600;
          color: #0a0a0a;
          margin-bottom: 20px;
          padding-bottom: 14px;
          border-bottom: 1px solid rgba(0,0,0,0.09);
        }
        .prose-tech h3 {
          font-size: 15.5px;
          line-height: 1.3;
          letter-spacing: -0.01em;
          font-weight: 600;
          color: #0a0a0a;
          margin-top: 28px;
          margin-bottom: 11px;
        }
        .prose-tech p, .prose-tech li { color: #0a0a0a; line-height: 1.74; font-size: 15px; }
        .prose-tech p { margin-bottom: 14px; }
        .prose-tech strong { font-weight: 600; color: #0a0a0a; }
        .prose-tech a { color: ${ACCENT}; text-decoration: underline; text-underline-offset: 3px; text-decoration-thickness: 1px; }
        .prose-tech ul, .prose-tech ol { list-style: none; margin-left: 0; padding-left: 0; font-size: 15px; line-height: 1.74; }
        .prose-tech ul > li, .prose-tech ol > li { position: relative; padding-left: 20px; margin-bottom: 9px; color: #0a0a0a; }
        .prose-tech ul > li::before {
          content: ""; position: absolute; left: 3px; top: 0.7em;
          width: 5px; height: 5px; background: ${ACCENT}; border-radius: 1px; transform: rotate(45deg);
        }
        .prose-tech ol { counter-reset: wp-li; }
        .prose-tech ol > li { counter-increment: wp-li; }
        .prose-tech ol > li::before {
          content: counter(wp-li, decimal-leading-zero);
          position: absolute; left: 0; top: 0;
          font-family: ${MONO}; font-size: 10px; font-weight: 700;
          color: ${ACCENT}; letter-spacing: 0.05em;
        }
        .prose-tech table {
          width: 100%; border-collapse: separate; border-spacing: 0;
          background: #fff; border: 1px solid rgba(0,0,0,0.08);
          border-radius: 12px; overflow: hidden; font-size: 13.5px; margin-bottom: 20px;
        }
        .prose-tech thead { background: rgba(204,120,92,0.055); }
        .prose-tech th {
          font-family: ${MONO}; font-size: 10px; letter-spacing: 0.18em;
          text-transform: uppercase; color: ${ACCENT}; font-weight: 700;
          padding: 12px 14px; text-align: left; border-bottom: 1px solid rgba(0,0,0,0.07);
        }
        .prose-tech td { border-bottom: 1px solid rgba(0,0,0,0.055); padding: 12px 14px; color: #0a0a0a; vertical-align: top; }
        .prose-tech tbody tr:last-child td { border-bottom: none; }
        .prose-tech tbody tr:hover { background: rgba(0,0,0,0.018); }
        .prose-tech td:first-child { font-weight: 600; }
        .prose-tech sub, .prose-tech sup { font-family: ${MONO}; font-size: 0.7em; color: ${ACCENT}; }
        .prose-tech .wp-eq {
          background: linear-gradient(180deg,#111114 0%,#1a1a1d 100%);
          border: 1px solid rgba(255,255,255,0.07); border-radius: 10px;
          padding: 12px 16px; margin-top: 10px; font-family: ${MONO};
          color: #f4f4f5; overflow-x: auto;
          box-shadow: 0 1px 0 rgba(255,255,255,0.04) inset, 0 10px 24px -14px rgba(0,0,0,0.45);
          font-size: 13.5px;
        }
        .prose-tech .wp-eq sub, .prose-tech .wp-eq sup { color: #ffb38a; }
        .sec-num {
          display: block; font-family: ${MONO}; font-size: 11px;
          font-weight: 700; letter-spacing: 0.18em; color: ${ACCENT}; margin-bottom: 8px;
        }
        .callout {
          padding: 14px 18px; border-radius: 12px; margin-bottom: 18px;
          font-size: 14px; line-height: 1.62;
          background: rgba(204,120,92,0.07); border: 1px solid rgba(204,120,92,0.22);
          color: rgba(0,0,0,0.72);
        }
      `}</style>

      <div className="min-h-screen bg-white text-black pt-20 relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.42]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(0,0,0,0.07) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage:
              "radial-gradient(ellipse 80% 50% at 50% 0%, #000 30%, transparent 75%)",
          }}
        />

        {/* ── HERO ── */}
        <div className="relative pt-12 sm:pt-24 pb-12 sm:pb-20 px-5 sm:px-6">
          <div className="max-w-6xl mx-auto text-center lg:text-left">
            <div
              className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 mb-10 text-[10.5px] font-semibold tracking-[0.22em] uppercase"
              style={{ fontFamily: MONO, color: "rgba(0,0,0,0.42)" }}
            >
              <span className="flex items-center gap-1.5">
                <FileText className="w-3 h-3" style={{ color: ACCENT }} />
                Whitepaper · v1.0
              </span>
              <span style={{ color: "rgba(0,0,0,0.14)" }}>/</span>
              <span className="flex items-center gap-1.5">
                <GitCommit className="w-3 h-3" />
                draft
              </span>
              <span style={{ color: "rgba(0,0,0,0.14)" }}>/</span>
              <span className="flex items-center gap-1.5">
                <Hash className="w-3 h-3" />
                blip-money/market
              </span>
              <span style={{ color: "rgba(0,0,0,0.14)" }}>/</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                ~20 min read
              </span>
            </div>

            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
              style={{
                background: `${ACCENT}14`,
                border: `1px solid ${ACCENT}44`,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: ACCENT, boxShadow: `0 0 8px ${ACCENT}` }}
              />
              <span
                className="text-[10.5px] font-bold tracking-[0.22em]"
                style={{ color: ACCENT, fontFamily: MONO }}
              >
                BLIP MARKET · OPEN LIQUIDITY NETWORK
              </span>
            </div>

            <h1
              className="font-semibold tracking-[-0.035em] leading-[1.02] mb-6"
              style={{ fontSize: "clamp(44px, 10vw, 74px)", color: "#0a0a0a" }}
            >
              An open network for
              <br />
              fast, cheap global
              <br />
              <span
                style={{
                  color: ACCENT,
                  fontStyle: "italic",
                  fontWeight: 500,
                  fontFamily: "ui-serif, Georgia, serif",
                }}
              >
                value settlement.
              </span>
            </h1>

            <p
              className="max-w-[620px] text-[15px] sm:text-[16px] leading-[1.6] mb-8 sm:mb-10"
              style={{ color: "rgba(0,0,0,0.62)" }}
            >
              Blip Market is a peer-to-peer liquidity network where merchants
              provide settlement capacity, users stake behind the merchants they
              trust, and any developer can plug in via API to move value
              anywhere — instantly and cheaply.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              {/* <button onClick={handleDownload}
                className="group inline-flex items-center gap-2 px-5 h-11 rounded-full text-[13px] font-semibold tracking-tight transition-all hover:-translate-y-[1px]"
                style={{ background: "#0a0a0a", color: "#fff", boxShadow: "0 10px 30px -10px rgba(0,0,0,0.32)" }}>
                <Download className="w-4 h-4" />
                Download PDF
              </button> */}
              <a
                href="#abstract"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("abstract");
                }}
                className="inline-flex items-center gap-2 px-5 h-11 rounded-full text-[13px] font-semibold tracking-tight"
                style={{
                  background: "#0a0a0a",
                  color: "#fff",
                  boxShadow: "0 10px 30px -10px rgba(0,0,0,0.32)",
                }}
              >
                Read in-browser →
              </a>
            </div>
          </div>
        </div>

        {/* ── CONTENT + SIDEBAR ── */}
        <div className="relative">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 pb-16 sm:pb-28">
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-14">
              {/* Sidebar */}
              <aside className="lg:w-[220px] flex-shrink-0">
                {/* Mobile chips */}
                <div className="lg:hidden overflow-x-auto pb-4 -mx-6 px-6">
                  <div className="flex gap-2 min-w-max">
                    {sections.map((s, i) => (
                      <button
                        key={s.id}
                        onClick={() => scrollToSection(s.id)}
                        className="whitespace-nowrap px-3 h-8 rounded-full text-[11px] font-semibold tracking-tight transition"
                        style={{
                          fontFamily: MONO,
                          background:
                            activeSection === s.id
                              ? `${ACCENT}1f`
                              : "rgba(0,0,0,0.04)",
                          color:
                            activeSection === s.id ? ACCENT : "rgba(0,0,0,0.6)",
                          border:
                            activeSection === s.id
                              ? `1px solid ${ACCENT}55`
                              : "1px solid rgba(0,0,0,0.08)",
                        }}
                      >
                        {String(i + 1).padStart(2, "0")} · {s.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Desktop sticky TOC */}
                <div className="hidden lg:block sticky top-28 space-y-6">
                  <div>
                    <div
                      className="text-[10px] font-bold tracking-[0.22em] mb-4 flex items-center gap-2"
                      style={{ color: "rgba(0,0,0,0.45)", fontFamily: MONO }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: ACCENT }}
                      />
                      CONTENTS
                    </div>
                    <div className="relative">
                      <div
                        className="absolute left-0 top-0 bottom-0 w-px"
                        style={{ background: "rgba(0,0,0,0.08)" }}
                      />
                      <div
                        className="absolute left-0 top-0 w-px origin-top"
                        style={{
                          height: `${progress * 100}%`,
                          background: `linear-gradient(180deg, ${ACCENT}, #ffb38a)`,
                          boxShadow: `0 0 8px ${ACCENT}aa`,
                          transition: "height 0.1s linear",
                        }}
                      />
                      <nav className="pl-4 space-y-0">
                        {sections.map((s, i) => {
                          const active = activeSection === s.id;
                          return (
                            <button
                              key={s.id}
                              onClick={() => scrollToSection(s.id)}
                              className="group block text-left w-full py-[7px] transition-colors relative"
                              style={{
                                fontFamily: MONO,
                                fontSize: 11.5,
                                color: active ? "#0a0a0a" : "rgba(0,0,0,0.48)",
                                fontWeight: active ? 700 : 500,
                              }}
                            >
                              {active && (
                                <span
                                  className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                                  style={{
                                    background: ACCENT,
                                    boxShadow: `0 0 8px ${ACCENT}`,
                                  }}
                                />
                              )}
                              <span
                                className="mr-1.5"
                                style={{
                                  color: active ? ACCENT : "rgba(0,0,0,0.28)",
                                }}
                              >
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              <span className="hover:text-black transition-colors">
                                {s.title}
                              </span>
                            </button>
                          );
                        })}
                      </nav>
                    </div>
                  </div>

                  {/* Doc metadata card */}
                  <div
                    className="rounded-2xl overflow-hidden"
                    style={{
                      border: "1px solid rgba(0,0,0,0.09)",
                      boxShadow: "0 4px 20px -8px rgba(0,0,0,0.10)",
                    }}
                  >
                    <div
                      className="px-4 py-3"
                      style={{
                        borderBottom: "1px solid rgba(0,0,0,0.07)",
                        background: `${ACCENT}0d`,
                      }}
                    >
                      <span
                        className="text-[9.5px] font-bold tracking-[0.2em] uppercase"
                        style={{ color: ACCENT, fontFamily: MONO }}
                      >
                        Document
                      </span>
                    </div>
                    <div>
                      {DOC_META.map((m) => (
                        <div
                          key={m.label}
                          className="px-4 py-2.5 flex items-center justify-between gap-2"
                          style={{
                            borderBottom: "1px solid rgba(0,0,0,0.055)",
                          }}
                        >
                          <span
                            className="text-[11px]"
                            style={{
                              color: "rgba(0,0,0,0.45)",
                              fontFamily: MONO,
                            }}
                          >
                            {m.label}
                          </span>
                          <span
                            className="text-[11.5px] font-semibold"
                            style={{ color: "#0a0a0a", fontFamily: MONO }}
                          >
                            {m.value}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div
                      className="px-4 py-3"
                      style={{ background: "rgba(0,0,0,0.025)" }}
                    >
                      <p
                        className="text-[10px] leading-[1.5]"
                        style={{ color: "rgba(0,0,0,0.5)", fontFamily: MONO }}
                      >
                        Market Architecture
                        <br />
                        Liquidity · Staking · API
                        <br />
                        <span style={{ color: ACCENT }}>v1.0</span>
                      </p>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Main content */}
              <div
                ref={contentRef}
                className="flex-1 min-w-0 prose-tech lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-3 [scrollbar-width:thin]"
              >
                {/* 01 Abstract */}
                <section id="abstract" className="mb-16">
                  <span className="sec-num">01</span>
                  <h2>Abstract</h2>
                  <div className="mb-5 flex flex-wrap gap-5">
                    {[
                      { label: "Document", value: "Whitepaper" },
                      { label: "Authors", value: "Blip.money Protocol" },
                      { label: "Published", value: "May 2026" },
                      { label: "License", value: "CC BY 4.0" },
                    ].map((m) => (
                      <div key={m.label} className="flex flex-col gap-0.5">
                        <span
                          className="text-[10px] font-bold tracking-[0.16em] uppercase"
                          style={{
                            color: "rgba(0,0,0,0.38)",
                            fontFamily: MONO,
                          }}
                        >
                          {m.label}
                        </span>
                        <span
                          className="text-[12.5px] font-semibold"
                          style={{ color: "#0a0a0a", fontFamily: MONO }}
                        >
                          {m.value}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="callout">
                    Blip Market is an open, enforceable settlement network —
                    where liquidity flows through a competitive mesh of
                    merchants, stakers earn alongside the merchants they back,
                    and any application in the world can plug in through the
                    Blip API.
                  </div>
                  <p>
                    Moving money across borders today is slow, expensive, and
                    fragmented. Blip Market proposes a different model: a
                    competitive network of liquidity providers (merchants) who
                    settle value on behalf of users, enforced by smart contracts
                    rather than trust. Merchants compete in real-time auctions
                    to offer the best rate. Users and stakers back their
                    preferred merchants with stake and earn a share of fees.
                    Developers access the entire network through a single,
                    unified API.
                  </p>
                  <p>
                    The result is a self-reinforcing marketplace — cheaper over
                    time as competition intensifies, safer as merchant
                    reputation compounds on-chain, and open by design so any
                    product can integrate global settlement without building
                    infrastructure from scratch.
                  </p>
                </section>

                {/* 02 The Problem */}
                <section id="problem" className="mb-16">
                  <span className="sec-num">02</span>
                  <h2>The Problem</h2>
                  <p>
                    Global value transfer is still structured around a model
                    designed for the 1970s: chains of correspondent banks,
                    opaque fees, and multi-day settlement windows. Even modern
                    crypto-based systems have largely recreated the same trust
                    problems in new clothes.
                  </p>

                  <h3>2.1 High cost, high friction</h3>
                  <ul>
                    <li>
                      <strong>Hidden fees.</strong> Sending $200 internationally
                      costs 6–8% on average when you factor in exchange rates
                      and transfer charges. The money often arrives days late.
                    </li>
                    <li>
                      <strong>No competition at the point of transfer.</strong>{" "}
                      Users accept whatever rate the app offers. There is no
                      real-time market forcing providers to compete.
                    </li>
                    <li>
                      <strong>Fragmented rails.</strong> Different corridors
                      require different apps, different accounts, and different
                      wait times. No single layer connects them.
                    </li>
                  </ul>

                  <h3>2.2 Trust without guarantees</h3>
                  <ul>
                    <li>
                      <strong>Off-chain verification.</strong> Even in P2P
                      crypto exchanges, the critical step — confirming the fiat
                      arrived — happens over screenshots and chat. There is no
                      enforceable proof.
                    </li>
                    <li>
                      <strong>Centralized reputation.</strong> Ratings live
                      inside the app that hosts them. They can be reset, gamed,
                      or deleted. A reliable merchant has no portable track
                      record.
                    </li>
                    <li>
                      <strong>No recourse.</strong> When something goes wrong,
                      users are at the mercy of the platform's support process —
                      not a transparent, rule-based resolution system.
                    </li>
                  </ul>

                  <h3>2.3 Developers have no good option</h3>
                  <p>
                    Any app that wants to move money — a fintech, a marketplace,
                    a payroll tool — must either build its own rails (expensive,
                    slow, jurisdictionally limited) or integrate incumbents that
                    charge heavily and move slowly. There is no open, composable
                    settlement primitive that developers can build on top of.
                  </p>
                </section>

                {/* 03 Blip Market */}
                <section id="market" className="mb-16">
                  <span className="sec-num">03</span>
                  <h2>Blip Market</h2>
                  <p>
                    Blip Market is a peer-to-peer settlement network. At its
                    core is a competitive marketplace of merchants — entities
                    who hold local currency and payment relationships — bidding
                    to fulfill user orders in real time.
                  </p>
                  <div className="callout">
                    Think of it as a live, global order book for value transfer.
                    Merchants post capacity and rates. Users submit orders. The
                    market finds the best match automatically — and on-chain
                    contracts enforce the outcome.
                  </div>

                  <h3>3.1 How the market works</h3>
                  <p>
                    When a user wants to send value — say, dollars in New York
                    to pesos in Mexico City — they submit an order to the
                    network. Merchants with local settlement capacity in the
                    target corridor bid on the order. The auction selects the
                    best merchant, not just on price, but on a composite score
                    that includes their on-chain reputation and staked
                    collateral. The user gets the best available rate. The
                    merchant earns a fee.
                  </p>
                  <p>
                    All of this happens in seconds. The user's funds are held in
                    an escrow contract during transit — released only when the
                    merchant proves the settlement was completed. If the
                    merchant fails to deliver, the user gets a full refund. No
                    trust required.
                  </p>

                  <h3>3.2 Merchant-to-merchant transactions</h3>
                  <p>
                    Merchants don't only settle for end users. They can transact
                    with each other — bridging liquidity across corridors,
                    netting positions, and routing through the most efficient
                    path. A merchant in London and a merchant in Lagos can
                    settle directly when it's cheaper than going through the
                    main market pool. This mesh of bilateral merchant
                    relationships is what gives the network depth and
                    resilience.
                  </p>

                  <LiquidityFlowDiagram />

                  <h3>3.3 Open by design</h3>
                  <p>
                    Blip Market is not a closed product — it's a protocol. Any
                    merchant, staker, or developer can participate. The rules
                    are enforced by code, not policy. The rates are set by
                    competition, not by any single entity.
                  </p>
                </section>

                {/* 04 Participants */}
                <section id="participants" className="mb-16">
                  <span className="sec-num">04</span>
                  <h2>Participants</h2>
                  <p>
                    The market has four distinct roles. Each one earns from the
                    activity of the others, creating a flywheel where volume
                    drives value for everyone.
                  </p>
                  <table>
                    <thead>
                      <tr>
                        <th>Role</th>
                        <th>What they do</th>
                        <th>How they earn</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        [
                          "User",
                          "Submits transfer orders. Deposits value into escrow. Receives settlement on the other side.",
                          "Gets the best available market rate. No hidden fees.",
                        ],
                        [
                          "Merchant",
                          "Provides settlement capacity in local corridors. Bids on orders. Executes fiat-side transfers.",
                          "Earns the spread between their cost and the winning auction price. Higher reputation → more wins.",
                        ],
                        [
                          "Staker",
                          "Backs a merchant by staking alongside them. Increases the merchant's effective credibility and auction score.",
                          "Earns a share of the fees generated by the merchants they stake behind.",
                        ],
                        [
                          "Developer / API Consumer",
                          "Integrates the Blip API into any product — fintech app, marketplace, payroll tool, wallet.",
                          "Accesses the full merchant network without building infrastructure. Can earn referral flows.",
                        ],
                      ].map(([r, d, e]) => (
                        <tr key={r}>
                          <td>{r}</td>
                          <td>{d}</td>
                          <td>{e}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>

                {/* 05 Liquidity Architecture */}
                <section id="liquidity" className="mb-16">
                  <span className="sec-num">05</span>
                  <h2>Liquidity Architecture</h2>
                  <p>
                    Liquidity in Blip Market doesn't sit in a central pool —
                    it's distributed across the merchant network and activated
                    on demand through the auction mechanism.
                  </p>

                  <h3>5.1 How liquidity flows</h3>
                  <p>
                    Each merchant maintains their own settlement capacity —
                    local bank accounts, mobile money relationships, payment
                    rails — in the corridors they serve. When an order is
                    matched to a merchant, that merchant's liquidity is reserved
                    for that specific settlement. Nothing is pooled or
                    commingled.
                  </p>
                  <p>
                    Stakers amplify merchant liquidity by contributing stake to
                    a merchant's collateral position. A merchant with more total
                    stake behind them can accept larger orders and scores better
                    in auctions. This means stakers directly increase a
                    merchant's earning potential — and are compensated
                    proportionally.
                  </p>

                  <h3>5.2 The auction mechanism</h3>
                  <p>
                    Order matching uses a sealed-bid, second-price auction. Each
                    merchant submits a bid — their proposed fee for handling the
                    order. The winning merchant is chosen not just on the lowest
                    fee, but on a composite score:
                  </p>
                  <div className="wp-eq ">
                    Score<sub>i</sub> = (1 / fee<sub>i</sub>) + α · reputation
                    <sub>i</sub> <br className="md:hidden " /> <span className="ml-[20%] md:ml-0">+ β · stake<sub>i</sub></span>
                  </div>
                  <p
                    className="text-[13px] mt-2"
                    style={{ color: "rgba(0,0,0,0.52)" }}
                  >
                    Where α and β are network-set weights. A higher reputation
                    or more stake behind a merchant lifts their effective score,
                    allowing them to win more orders even when they don't have
                    the absolute lowest fee.
                  </p>
                  <p>
                    The second-price rule means the winning merchant pays the
                    price of the second-best offer — incentivizing honest
                    bidding rather than strategic undercutting.
                  </p>

                  <h3>5.3 Escrow enforcement</h3>
                  <p>
                    When an order is matched, the user's funds are locked in a
                    smart-contract escrow. The contract releases funds to the
                    merchant only after a signed proof of settlement is
                    submitted and verified on-chain. If the merchant fails to
                    deliver within the agreed window, the user can trigger a
                    full refund. The escrow is controlled entirely by the
                    protocol — no single party can unilaterally move funds.
                  </p>
                </section>

                {/* 06 Transaction Lifecycle */}
                <section id="lifecycle" className="mb-16">
                  <span className="sec-num">06</span>
                  <h2>Transaction Lifecycle</h2>
                  <p>
                    Every transaction moves through a defined set of states. The
                    contracts enforce each transition — no step can be skipped,
                    reversed, or faked.
                  </p>

                  <LifecycleDiagram />

                  {/* Scroll wrapper — 4-col table with a nowrap "Where" column would clip on
                      narrow screens; min-width keeps columns readable and lets it scroll instead. */}
                  <div className="overflow-x-auto -mx-2 px-2">
                    <table style={{ minWidth: 560 }}>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Step</th>
                          <th>What happens</th>
                          <th>Where</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          [
                            "1",
                            "Order",
                            "User (or API) submits a transfer order specifying amount, corridor, and maximum time window.",
                            "Off-chain / API",
                          ],
                          [
                            "2",
                            "Match",
                            "Merchants bid in a sealed auction. The network scores bids by fee, reputation, and stake. Boost tokens can elevate priority.",
                            "Off-chain auction",
                          ],
                          [
                            "3",
                            "Escrow",
                            "User deposits funds into a smart-contract escrow tied to the matched order. The settlement clock starts.",
                            "On-chain",
                          ],
                          [
                            "4",
                            "Settle",
                            "The winning merchant executes the fiat-side transfer and obtains a signed proof of completion from the oracle.",
                            "Off-chain fiat",
                          ],
                          [
                            "5",
                            "Released",
                            "Proof is verified on-chain. Escrow releases funds to the merchant. Reputation incremented. Stakers earn fees.",
                            "On-chain",
                          ],
                          [
                            "6",
                            "Refund",
                            "If the settlement window expires without proof, the user triggers a refund. Merchant reputation decremented.",
                            "On-chain (timeout)",
                          ],
                          [
                            "7",
                            "Dispute",
                            "Either party can flag a dispute. A decentralized arbiter reviews evidence and resolves to release or refund.",
                            "On-chain / DAO",
                          ],
                        ].map(([n, s, w, l]) => (
                          <tr key={n}>
                            <td>{n}</td>
                            <td>{s}</td>
                            <td>{w}</td>
                            <td style={{ whiteSpace: "nowrap" }}>{l}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* 07 Staking & Incentives */}
                <section id="staking" className="mb-16">
                  <span className="sec-num">07</span>
                  <h2>Staking &amp; Incentives</h2>
                  <p>
                    Staking in Blip Market is not abstract yield farming — it's
                    a direct bet on a specific merchant's performance. Stakers
                    and merchants are aligned: both earn more when the merchant
                    executes reliably and wins more orders.
                  </p>

                  <h3>7.1 How staking works</h3>
                  <p>
                    Any user can stake behind one or more merchants. Their stake
                    is added to the merchant's total collateral position,
                    boosting the merchant's auction score and unlocking access
                    to larger order sizes. In return, stakers receive a
                    proportional share of the fees earned by that merchant.
                  </p>
                  <ul>
                    <li>
                      <strong>
                        Stake more → merchant scores higher → merchant wins more
                        orders → staker earns more fees.
                      </strong>
                    </li>
                    <li>
                      <strong>If a merchant underperforms</strong>, their
                      reputation decreases, they win fewer orders, and staker
                      returns fall. Stake can be withdrawn, so bad merchants
                      lose backing over time.
                    </li>
                    <li>
                      <strong>Stake is not slashed</strong> for normal merchant
                      failure — only in proven cases of fraud, where the
                      merchant's own bond is at risk.
                    </li>
                  </ul>

                  <h3>7.2 Merchant bond</h3>
                  <p>
                    Every active merchant must post a bond — their own capital
                    at risk. The bond sets the maximum order size the merchant
                    can accept. A larger bond unlocks larger orders. If a
                    merchant is found to have acted fraudulently, their bond is
                    slashed by the protocol. This makes cheating economically
                    irrational: the potential gain from any single fraud is
                    always smaller than the bond required to be eligible for it.
                  </p>
                  <div className="wp-eq">
                    max_order &lt; slashing_factor · bond
                  </div>

                  <h3>7.3 Fee distribution</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Recipient</th>
                        <th>Share</th>
                        <th>Source</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        [
                          "Merchant",
                          "Largest portion",
                          "Direct revenue for executing settlement",
                        ],
                        [
                          "Stakers",
                          "Proportional to stake",
                          "Split from merchant's fee pool",
                        ],
                        [
                          "Protocol treasury",
                          "Small %",
                          "Funds governance and development",
                        ],
                        [
                          "Referral / API partner",
                          "Optional",
                          "For orders sourced via partner integrations",
                        ],
                      ].map(([r, s, src]) => (
                        <tr key={r}>
                          <td>{r}</td>
                          <td>{s}</td>
                          <td>{src}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <h3>7.4 On-chain reputation</h3>
                  <p>
                    Every merchant's track record is stored on-chain and cannot
                    be reset or deleted. Successful settlements increase the
                    score (logarithmically, weighted by order size). Failures
                    decrease it — more sharply for larger orders. This score
                    follows the merchant permanently and is visible to every
                    staker and user.
                  </p>
                </section>

                {/* 08 Boosted Transactions */}
                <section id="boosts" className="mb-16">
                  <span className="sec-num">08</span>
                  <h2>Boosted Transactions</h2>
                  <p>
                    Not all transfers are the same. Blip Market includes a boost
                    mechanism — a way for users or API partners to prioritize
                    certain orders in the matching queue.
                  </p>

                  <h3>8.1 What a boost does</h3>
                  <ul>
                    <li>
                      <strong>Priority matching.</strong> Boosted orders are
                      surfaced to higher-tier merchants first, getting access to
                      the most reliable and liquid providers in the network.
                    </li>
                    <li>
                      <strong>Faster auction window.</strong> A boosted order
                      shortens the bid collection window, accelerating
                      time-to-match for time-sensitive transfers.
                    </li>
                    <li>
                      <strong>Elevated in the queue.</strong> When the network
                      is busy, boosted orders move ahead of unboosted ones at
                      the same price point.
                    </li>
                  </ul>

                  <h3>8.2 Who uses boosts</h3>
                  <p>
                    Boosts are most useful for high-value or time-critical
                    transfers — businesses making payroll runs, API partners
                    handling checkout flows, or users who need confirmation in a
                    tight window. The boost cost is small relative to the value
                    of certainty. Boosting can be applied programmatically via
                    the API, making it composable into any downstream product
                    logic.
                  </p>

                  <h3>8.3 Boost economics</h3>
                  <p>
                    Boost fees flow directly to the protocol treasury and to the
                    merchants who fill boosted orders. This creates a secondary
                    incentive for high-reputation merchants to stay active —
                    premium orders pay premium rates.
                  </p>
                </section>

                {/* 09 Blip API */}
                <section id="api" className="mb-16">
                  <span className="sec-num">09</span>
                  <h2>Blip API</h2>
                  <p>
                    The Blip API is the developer interface to the full Blip
                    Market network. Any product that wants to move value
                    globally can integrate the API and immediately access every
                    merchant, every corridor, and every liquidity relationship
                    in the network — without building any settlement
                    infrastructure themselves.
                  </p>
                  <div className="callout">
                    One integration. Every corridor. Real-time rates. Settlement
                    finality in seconds.
                  </div>

                  <h3>9.1 What the API provides</h3>
                  <ul>
                    <li>
                      <strong>Rate quotes.</strong> Get live, competitive rates
                      for any corridor before committing to a transfer.
                    </li>
                    <li>
                      <strong>Order submission.</strong> Submit transfer orders
                      programmatically. Apply boosts, set time windows, specify
                      corridors.
                    </li>
                    <li>
                      <strong>Settlement tracking.</strong> Track order state in
                      real time — from match to escrow to settlement or refund.
                    </li>
                    <li>
                      <strong>Webhook notifications.</strong> Get callbacks on
                      state changes so downstream systems can react immediately.
                    </li>
                    <li>
                      <strong>Batch processing.</strong> Submit multiple orders
                      in a single call — ideal for payroll, bulk disbursements,
                      or marketplace payouts.
                    </li>
                  </ul>

                  <h3>9.2 Where the API can be used</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Use case</th>
                        <th>What Blip enables</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        [
                          "Fintech apps",
                          "Embed cross-border transfers with live rates and settlement guarantees into any consumer product.",
                        ],
                        [
                          "Marketplaces",
                          "Pay sellers in any country, in their local currency, without holding foreign exchange positions.",
                        ],
                        [
                          "Payroll tools",
                          "Disburse salaries across jurisdictions in a single batch call. Guaranteed delivery.",
                        ],
                        [
                          "E-commerce checkout",
                          "Accept payment in one currency, settle the merchant in another — instantly, at market rates.",
                        ],
                        [
                          "Wallet providers",
                          "Add cross-border send capability without building correspondent banking relationships.",
                        ],
                        [
                          "B2B payments",
                          "Settle invoices across borders faster and cheaper than SWIFT, with full on-chain audit trail.",
                        ],
                      ].map(([u, w]) => (
                        <tr key={u}>
                          <td>{u}</td>
                          <td>{w}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <h3>9.3 API economics</h3>
                  <p>
                    API-sourced orders are treated identically to user-generated
                    orders in the auction. Partners can optionally configure
                    referral arrangements — earning a share of the fee on every
                    order they source. Boosts can be applied programmatically.
                    Rate quotes are free; settlement fees are paid only on
                    completed transfers.
                  </p>
                </section>

                {/* 10 Ecosystem Vision */}
                <section id="ecosystem" className="mb-16">
                  <span className="sec-num">10</span>
                  <h2>Ecosystem Vision</h2>
                  <p>
                    The long-term vision for Blip Market is a global, open
                    settlement layer — the infrastructure primitive that sits
                    underneath any product that moves value.
                  </p>

                  <h3>10.1 A self-reinforcing network</h3>
                  <p>
                    Every new merchant adds liquidity. Every new staker deepens
                    merchant capacity. Every new API integration brings more
                    order flow. More order flow means better rates, which
                    attracts more users, which attracts more merchants. The
                    network compounds over time.
                  </p>

                  <h3>10.2 Merchant network expansion</h3>
                  <ul>
                    <li>
                      <strong>Corridor depth.</strong> As more merchants join
                      each corridor, rates become tighter and settlement becomes
                      more reliable. Thin corridors today become competitive
                      markets over time.
                    </li>
                    <li>
                      <strong>Merchant tiers.</strong> High-reputation merchants
                      unlock premium order sizes and access to large
                      institutional flows — giving them a long-term business
                      built on their track record.
                    </li>
                    <li>
                      <strong>Merchant-to-merchant routing.</strong> As the
                      network matures, merchants will increasingly settle with
                      each other directly — netting positions, sharing
                      liquidity, and routing around inefficiencies
                      automatically.
                    </li>
                  </ul>

                  <h3>10.3 Protocol governance</h3>
                  <p>
                    Core protocol parameters — auction weights, slashing rules,
                    boost mechanics, fee splits — are governed by the protocol's
                    DAO. Any participant can propose changes. The DAO also
                    manages dispute resolution for contested settlements and
                    oversees the oracle network that verifies off-chain proofs.
                  </p>

                  <h3>10.4 The open settlement primitive</h3>
                  <p>
                    The ultimate goal is for Blip Market to be the settlement
                    layer that every financial product builds on top of — the
                    way TCP/IP is the layer the internet builds on top of. Open,
                    composable, competitive, and enforceable by design. Any
                    value that needs to move anywhere in the world should be
                    able to flow through Blip Market, instantly and cheaply,
                    without asking anyone's permission.
                  </p>
                </section>

                {/* 11 Conclusion */}
                <section id="conclusion" className="mb-16">
                  <span className="sec-num">11</span>
                  <h2>Conclusion</h2>
                  <p>
                    Blip Market is a competitive, open network for global value
                    settlement. Merchants provide the liquidity. Users set the
                    demand. Stakers align incentives by backing the merchants
                    they trust. Boosts let high-priority flows move to the front
                    of the queue. And the Blip API makes all of it accessible to
                    any product, anywhere.
                  </p>
                  <p>
                    The market enforces itself — through smart-contract escrow,
                    on-chain reputation, and a bond system that makes fraud
                    economically irrational. No single entity controls it. No
                    gatekeeper sets the rates. The network gets better as it
                    gets bigger, and it's open to anyone who wants to join.
                  </p>
                  <p
                    className="text-[13.5px] mt-4"
                    style={{ color: "rgba(0,0,0,0.5)" }}
                  >
                    For a non-technical introduction to Blip Money and Blip
                    Market — written for users, merchants, and contributors —
                    see the{" "}
                    <Link to="/market" style={{ color: ACCENT }}>
                      Blip Market Overview
                    </Link>
                    .
                  </p>
                </section>

                {/* End-of-doc footer card */}
                <div
                  className="mt-20 relative rounded-[20px] overflow-hidden bg-white"
                  style={{
                    border: "1px solid rgba(0,0,0,0.08)",
                    boxShadow: `0 30px 80px -30px rgba(204,120,92,0.22), 0 14px 36px -18px rgba(0,0,0,0.10)`,
                  }}
                >
                  <div
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-px"
                    style={{
                      background: `linear-gradient(90deg, transparent 0%, ${ACCENT}88 50%, transparent 100%)`,
                    }}
                  />
                  <div className="p-8 sm:p-10 grid sm:grid-cols-[1fr_auto] gap-6 items-center">
                    <div>
                      <div
                        className="text-[10.5px] font-bold tracking-[0.22em] mb-3"
                        style={{ color: ACCENT, fontFamily: MONO }}
                      >
                        END OF DOCUMENT · v1.0
                      </div>
                      <h3 className="text-[22px] font-semibold tracking-[-0.02em] text-black mb-2">
                        Read the full specification.
                      </h3>
                      <p
                        className="text-[13.5px] leading-[1.6]"
                        style={{ color: "rgba(0,0,0,0.58)" }}
                      >
                        Complete paper - Technical notes, protocol assumptions,
                        settlement flows, appendices and supporting material
                        referenced throughout this paper.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 ">
                      {/* <button onClick={handleDownload}
                        className="inline-flex items-center gap-2 px-5 h-11 rounded-full text-[13px] font-semibold tracking-tight transition-all hover:-translate-y-[1px] max-w-[220px]"
                        style={{ background: "#0a0a0a", color: "#fff", boxShadow: "0 14px 36px -10px rgba(0,0,0,0.32)" }}>
                        <Download className="w-4 h-4" />
                        Download PDF
                      </button> */}
                      <Link
                        to="/market"
                        className="flex items-center justify-center gap-2 px-5 h-11 rounded-full text-[13px] font-semibold tracking-tight max-w-[220px]"
                        style={{
                          color: "rgba(0,0,0,0.78)",
                          border: "1px solid rgba(0,0,0,0.13)",
                        }}
                      >
                        Overview
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Whitepaper;
