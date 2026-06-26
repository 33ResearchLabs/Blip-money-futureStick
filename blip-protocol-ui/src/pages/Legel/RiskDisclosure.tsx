import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";

const ACCENT = "#cc785c";
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

const sections = [
  { id: "important-notice", title: "Important Notice" },
  { id: "no-guarantee", title: "No Guarantee of Profits" },
  { id: "market", title: "Market Risk" },
  { id: "stablecoin", title: "Stablecoin Risk" },
  { id: "counterparty", title: "Counterparty Risk" },
  { id: "smart-contract", title: "Smart Contract Risk" },
  { id: "blockchain", title: "Blockchain Risk" },
  { id: "private-key", title: "Private Key Risk" },
  { id: "cybersecurity", title: "Cybersecurity Risk" },
  { id: "regulatory", title: "Regulatory Risk" },
  { id: "liquidity", title: "Liquidity Risk" },
  { id: "third-party", title: "Third-Party Risk" },
  { id: "fiat", title: "Fiat Settlement Risk" },
  { id: "bank", title: "Bank Account Risk" },
  { id: "technical", title: "Technical Failure Risk" },
  { id: "force-majeure", title: "Force Majeure" },
  { id: "tax", title: "Tax Risk" },
  { id: "no-advice", title: "No Investment Advice" },
  { id: "risk-assumption", title: "Assumption of Risk" },
  { id: "liability", title: "Limitation of Liability" },
  { id: "acknowledgement", title: "Acknowledgement" },
];

const DOC_META = [
  { label: "Document", value: "Risk" },
  { label: "Sections", value: "20" },
  { label: "Status", value: "Active" },
  { label: "Updated", value: "May 2026" },
];

const RiskDisclosure = ({ tabSlot }: { tabSlot?: ReactNode }) => {
  const [activeSection, setActiveSection] = useState("");
  const [progress, setProgress] = useState(0);
  const [panelMaxH, setPanelMaxH] = useState<number | undefined>(undefined);
  const contentRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Match the scrollable content panel's height to the sidebar (desktop only).
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const measure = () => {
      setPanelMaxH(
        mq.matches && sidebarRef.current
          ? sidebarRef.current.offsetHeight
          : undefined,
      );
    };
    measure();
    const ro =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    if (ro && sidebarRef.current) ro.observe(sidebarRef.current);
    window.addEventListener("resize", measure);
    mq.addEventListener("change", measure);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", measure);
      mq.removeEventListener("change", measure);
    };
  }, []);

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

  return (
    <>
      <SEO canonical="https://www.blip.money/risk" />

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

      <div className="min-h-screen bg-white text-black relative overflow-hidden">
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
        <div className="relative pt-20 sm:pt-24 pb-3 sm:pb-4 px-5 sm:px-6">
          <div className="max-w-6xl mx-auto text-center lg:text-left">
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
                LEGAL · RISK DISCLOSURE STATEMENT
              </span>
            </div>

            <h1
              className="font-semibold tracking-[-0.035em] leading-[1.02] mb-6"
              style={{ fontSize: "clamp(44px, 10vw, 74px)", color: "#0a0a0a" }}
            >
              Risk Disclosure{" "}
              <span
                style={{
                  color: ACCENT,
                  fontStyle: "italic",
                  fontWeight: 500,
                  fontFamily: "ui-serif, Georgia, serif",
                }}
              >
                Statement.
              </span>
            </h1>
          </div>
        </div>

        {tabSlot}

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
                        {s.id === "important-notice"
                          ? s.title
                          : `${String(i).padStart(2, "0")} · ${s.title}`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Desktop sticky TOC */}
                <div
                  ref={sidebarRef}
                  className="hidden lg:block sticky top-28 space-y-6 "
                >
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
                          const isIntro = s.id === "important-notice";
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
                              {!isIntro && (
                                <span
                                  className="mr-1.5"
                                  style={{
                                    color: active
                                      ? ACCENT
                                      : "rgba(0,0,0,0.28)",
                                  }}
                                >
                                  {String(i).padStart(2, "0")}
                                </span>
                              )}
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
                        Market · Stablecoin · Smart Contract
                        <br />
                        Counterparty · Liquidity · Regulatory
                        <br />
                        <span style={{ color: ACCENT }}>blip.money</span>
                      </p>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Main content */}
              <div
                ref={contentRef}
                style={{ maxHeight: panelMaxH }}
                className="flex-1 min-w-0 prose-tech lg:sticky lg:top-28 lg:overflow-y-auto lg:pr-3 [scrollbar-width:thin]"
              >
                {/* Important Notice — first, directly below the heading */}
                <section id="important-notice" className="mb-16">
                  <span className="sec-num">IMPORTANT NOTICE</span>
                  <h2>Important Notice</h2>
                  <p>
                    Digital assets, blockchain technologies, peer-to-peer
                    transactions, and decentralized systems involve significant
                    risks. Before accessing or using blip.money ("blip.money",
                    "we", "our", or "us"), you should carefully read and
                    understand this Risk Disclosure Statement.
                  </p>
                  <p>
                    By using the Services, you acknowledge that you understand and
                    accept the risks described herein and assume full
                    responsibility for your activities.
                  </p>
                </section>

                {/* 01 No Guarantee of Profits */}
                <section id="no-guarantee" className="mb-16">
                  <span className="sec-num">01</span>
                  <h2>No Guarantee of Profits</h2>
                  <p>Participation in digital asset markets may result in:</p>
                  <ul>
                    <li>Partial loss of capital.</li>
                    <li>Total loss of capital.</li>
                    <li>Unrealized gains.</li>
                    <li>Reduced purchasing power.</li>
                  </ul>
                  <p>Past performance does not guarantee future results.</p>
                  <p>
                    Blip.money does not guarantee profits, returns, or successful
                    transactions.
                  </p>
                </section>

                {/* 02 Market Risk */}
                <section id="market" className="mb-16">
                  <span className="sec-num">02</span>
                  <h2>Market Risk</h2>
                  <p>Digital assets are highly volatile.</p>
                  <p>Prices may fluctuate rapidly due to:</p>
                  <ul>
                    <li>Market sentiment.</li>
                    <li>Regulatory developments.</li>
                    <li>Liquidity conditions.</li>
                    <li>Macroeconomic events.</li>
                    <li>Geopolitical events.</li>
                    <li>Technological changes.</li>
                  </ul>
                  <p>You may lose some or all of your assets.</p>
                </section>

                {/* 03 Stablecoin Risk */}
                <section id="stablecoin" className="mb-16">
                  <span className="sec-num">03</span>
                  <h2>Stablecoin Risk</h2>
                  <p>Stablecoins may:</p>
                  <ul>
                    <li>Lose their peg.</li>
                    <li>Become illiquid.</li>
                    <li>Experience reserve failures.</li>
                    <li>Be affected by regulatory actions.</li>
                    <li>Suffer operational disruptions.</li>
                  </ul>
                  <p>
                    Blip.money makes no representations regarding the stability or
                    reliability of any digital asset, including:
                  </p>
                  <ul>
                    <li>USDT</li>
                    <li>USDC</li>
                    <li>FDUSD</li>
                    <li>RLUSD</li>
                    <li>Other supported assets</li>
                  </ul>
                </section>

                {/* 04 Counterparty Risk */}
                <section id="counterparty" className="mb-16">
                  <span className="sec-num">04</span>
                  <h2>Counterparty Risk</h2>
                  <p>
                    Transactions occur directly between users and independent
                    participants.
                  </p>
                  <p>Blip.money does not guarantee:</p>
                  <ul>
                    <li>Counterparty solvency.</li>
                    <li>Counterparty honesty.</li>
                    <li>Timely settlement.</li>
                    <li>Payment completion.</li>
                  </ul>
                  <p>Users assume all risks associated with counterparties.</p>
                </section>

                {/* 05 Smart Contract Risk */}
                <section id="smart-contract" className="mb-16">
                  <span className="sec-num">05</span>
                  <h2>Smart Contract Risk</h2>
                  <p>Smart contracts may contain:</p>
                  <ul>
                    <li>Bugs.</li>
                    <li>Coding errors.</li>
                    <li>Design flaws.</li>
                    <li>Exploits.</li>
                    <li>Security vulnerabilities.</li>
                  </ul>
                  <p>Such failures may result in:</p>
                  <ul>
                    <li>Permanent loss of assets.</li>
                    <li>Delayed settlements.</li>
                    <li>Unexpected outcomes.</li>
                  </ul>
                  <p>
                    Blip.money cannot guarantee the security or correctness of
                    smart contracts.
                  </p>
                </section>

                {/* 06 Blockchain Risk */}
                <section id="blockchain" className="mb-16">
                  <span className="sec-num">06</span>
                  <h2>Blockchain Risk</h2>
                  <p>Underlying blockchains may experience:</p>
                  <ul>
                    <li>Congestion.</li>
                    <li>Reorganizations.</li>
                    <li>Forks.</li>
                    <li>Outages.</li>
                    <li>Consensus failures.</li>
                  </ul>
                  <p>These events may affect:</p>
                  <ul>
                    <li>Transaction execution.</li>
                    <li>Availability of assets.</li>
                    <li>Confirmation times.</li>
                    <li>User balances.</li>
                  </ul>
                  <p>Blip.money does not control blockchain networks.</p>
                </section>

                {/* 07 Private Key Risk */}
                <section id="private-key" className="mb-16">
                  <span className="sec-num">07</span>
                  <h2>Private Key Risk</h2>
                  <p>Users are solely responsible for:</p>
                  <ul>
                    <li>Wallet security.</li>
                    <li>Seed phrases.</li>
                    <li>Private keys.</li>
                    <li>Passwords.</li>
                  </ul>
                  <p>
                    Loss or compromise of credentials may result in permanent and
                    irreversible loss of digital assets.
                  </p>
                  <p>Blip.money cannot recover lost keys or assets.</p>
                </section>

                {/* 08 Cybersecurity Risk */}
                <section id="cybersecurity" className="mb-16">
                  <span className="sec-num">08</span>
                  <h2>Cybersecurity Risk</h2>
                  <p>Users may be exposed to:</p>
                  <ul>
                    <li>Malware.</li>
                    <li>Phishing attacks.</li>
                    <li>Social engineering.</li>
                    <li>Ransomware.</li>
                    <li>SIM swap attacks.</li>
                    <li>Device compromise.</li>
                  </ul>
                  <p>Unauthorized access may result in permanent loss of assets.</p>
                </section>

                {/* 09 Regulatory Risk */}
                <section id="regulatory" className="mb-16">
                  <span className="sec-num">09</span>
                  <h2>Regulatory Risk</h2>
                  <p>Laws relating to digital assets may change without notice.</p>
                  <p>Government actions may include:</p>
                  <ul>
                    <li>Restrictions.</li>
                    <li>Licensing requirements.</li>
                    <li>Tax obligations.</li>
                    <li>Prohibitions.</li>
                  </ul>
                  <p>
                    Such changes may negatively impact access to or use of the
                    Services.
                  </p>
                  <p>
                    Blip.money does not guarantee that use of digital assets is
                    lawful in your jurisdiction.
                  </p>
                </section>

                {/* 10 Liquidity Risk */}
                <section id="liquidity" className="mb-16">
                  <span className="sec-num">10</span>
                  <h2>Liquidity Risk</h2>
                  <p>Certain digital assets may experience:</p>
                  <ul>
                    <li>Reduced liquidity.</li>
                    <li>Market disruptions.</li>
                    <li>Order slippage.</li>
                    <li>Inability to exit positions.</li>
                  </ul>
                  <p>
                    Users may be unable to complete transactions at desired
                    prices.
                  </p>
                </section>

                {/* 11 Third-Party Risk */}
                <section id="third-party" className="mb-16">
                  <span className="sec-num">11</span>
                  <h2>Third-Party Risk</h2>
                  <p>
                    Blip.money depends upon third-party infrastructure including:
                  </p>
                  <ul>
                    <li>Wallet providers.</li>
                    <li>RPC providers.</li>
                    <li>Blockchain networks.</li>
                    <li>Internet service providers.</li>
                    <li>Hosting providers.</li>
                  </ul>
                  <p>
                    Blip.money does not control such services and assumes no
                    responsibility for their failures.
                  </p>
                </section>

                {/* 12 Fiat Settlement Risk */}
                <section id="fiat" className="mb-16">
                  <span className="sec-num">12</span>
                  <h2>Fiat Settlement Risk</h2>
                  <p>
                    Fiat settlements are conducted independently between users and
                    counterparties.
                  </p>
                  <p>Blip.money does not:</p>
                  <ul>
                    <li>Hold fiat balances.</li>
                    <li>Process bank transfers.</li>
                    <li>Guarantee payment completion.</li>
                  </ul>
                  <p>Users assume all risks associated with fiat transfers.</p>
                </section>

                {/* 13 Bank Account Risk */}
                <section id="bank" className="mb-16">
                  <span className="sec-num">13</span>
                  <h2>Bank Account Risk</h2>
                  <p>Participants may experience:</p>
                  <ul>
                    <li>Bank account freezes.</li>
                    <li>Delays.</li>
                    <li>Transaction reversals.</li>
                    <li>Compliance reviews.</li>
                  </ul>
                  <p>
                    Blip.money has no ability to intervene in banking
                    relationships.
                  </p>
                </section>

                {/* 14 Technical Failure Risk */}
                <section id="technical" className="mb-16">
                  <span className="sec-num">14</span>
                  <h2>Technical Failure Risk</h2>
                  <p>The Services may become unavailable due to:</p>
                  <ul>
                    <li>Software bugs.</li>
                    <li>Hardware failures.</li>
                    <li>Internet outages.</li>
                    <li>Cyber attacks.</li>
                    <li>Infrastructure disruptions.</li>
                  </ul>
                  <p>Blip.money does not guarantee uninterrupted availability.</p>
                </section>

                {/* 15 Force Majeure */}
                <section id="force-majeure" className="mb-16">
                  <span className="sec-num">15</span>
                  <h2>Force Majeure</h2>
                  <p>
                    Events beyond reasonable control may affect operations,
                    including:
                  </p>
                  <ul>
                    <li>Natural disasters.</li>
                    <li>Wars.</li>
                    <li>Government actions.</li>
                    <li>Pandemics.</li>
                    <li>Power failures.</li>
                    <li>Internet outages.</li>
                  </ul>
                  <p>
                    Blip.money shall not be liable for losses resulting from such
                    events.
                  </p>
                </section>

                {/* 16 Tax Risk */}
                <section id="tax" className="mb-16">
                  <span className="sec-num">16</span>
                  <h2>Tax Risk</h2>
                  <p>
                    Transactions involving digital assets may have tax
                    consequences.
                  </p>
                  <p>Users are solely responsible for:</p>
                  <ul>
                    <li>Determining tax obligations.</li>
                    <li>Reporting transactions.</li>
                    <li>Paying taxes.</li>
                  </ul>
                  <p>Blip.money does not provide tax advice.</p>
                </section>

                {/* 17 No Investment Advice */}
                <section id="no-advice" className="mb-16">
                  <span className="sec-num">17</span>
                  <h2>No Investment Advice</h2>
                  <p>Nothing contained within the Services constitutes:</p>
                  <ul>
                    <li>Investment advice.</li>
                    <li>Financial advice.</li>
                    <li>Legal advice.</li>
                    <li>Tax advice.</li>
                    <li>Accounting advice.</li>
                  </ul>
                  <p>
                    Users should consult qualified professionals before making
                    financial decisions.
                  </p>
                </section>

                {/* 18 Assumption of Risk */}
                <section id="risk-assumption" className="mb-16">
                  <span className="sec-num">18</span>
                  <h2>Assumption of Risk</h2>
                  <p>By using the Services, you acknowledge and agree that:</p>
                  <ul>
                    <li>
                      You understand the risks associated with blockchain
                      technologies.
                    </li>
                    <li>You are financially capable of bearing losses.</li>
                    <li>You assume all risks associated with your activities.</li>
                    <li>You use the Services voluntarily.</li>
                  </ul>
                </section>

                {/* 19 Limitation of Liability */}
                <section id="liability" className="mb-16">
                  <span className="sec-num">19</span>
                  <h2>Limitation of Liability</h2>
                  <p>
                    To the maximum extent permitted by law, blip.money shall not
                    be liable for:
                  </p>
                  <ul>
                    <li>Loss of assets.</li>
                    <li>Lost profits.</li>
                    <li>Loss of opportunity.</li>
                    <li>Data loss.</li>
                    <li>Indirect damages.</li>
                    <li>Consequential damages.</li>
                    <li>Third-party actions.</li>
                  </ul>
                  <p>
                    Users accept sole responsibility for their decisions and
                    activities.
                  </p>
                </section>

                {/* 20 Acknowledgement */}
                <section id="acknowledgement" className="mb-16">
                  <span className="sec-num">20</span>
                  <h2>Acknowledgement</h2>
                  <p>By accessing or using the Services, you acknowledge that:</p>
                  <ul>
                    <li>You have read this Risk Disclosure Statement.</li>
                    <li>You understand the risks involved.</li>
                    <li>You voluntarily assume such risks.</li>
                    <li>
                      You release blip.money from liability to the maximum extent
                      permitted by applicable law.
                    </li>
                  </ul>
                  <p>
                    For questions regarding this Risk Disclosure Statement,
                    contact:
                  </p>
                  <p>
                    <a
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=support@blip.money"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      support@blip.money
                    </a>
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
                        END OF DOCUMENT · RISK DISCLOSURE STATEMENT
                      </div>
                      <h3 className="text-[22px] font-semibold tracking-[-0.02em] text-black mb-2">
                        End of document.
                      </h3>
                      <p
                        className="text-[13.5px] leading-[1.6]"
                        style={{ color: "rgba(0,0,0,0.58)" }}
                      >
                        You have reached the end of this document.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 ">
                      <a
                        href="https://mail.google.com/mail/?view=cm&fs=1&to=support@blip.money"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-5 h-11 rounded-full text-[13px] font-semibold tracking-tight max-w-[220px]"
                        style={{
                          color: "rgba(0,0,0,0.78)",
                          border: "1px solid rgba(0,0,0,0.13)",
                        }}
                      >
                        Contact us
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
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

export default RiskDisclosure;
