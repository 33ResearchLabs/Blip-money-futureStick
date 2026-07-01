import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";

const ACCENT = "#cc785c";
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

const sections = [
  { id: "important-notice", title: "Important Notice" },
  { id: "independent", title: "Independent Participation" },
  { id: "no-guarantee", title: "No Guarantee of Volume or Profits" },
  { id: "responsibilities", title: "Merchant Responsibilities" },
  { id: "fiat", title: "Fiat Settlements" },
  { id: "counterparty", title: "Counterparty Risk" },
  { id: "compliance", title: "Compliance Responsibilities" },
  { id: "bank-risks", title: "Bank Account Risks" },
  { id: "fraud", title: "Fraud Prevention" },
  { id: "reputation", title: "Reputation System" },
  { id: "staking", title: "Staking" },
  { id: "security", title: "Security Responsibilities" },
  { id: "tax", title: "Tax Obligations" },
  { id: "no-advice", title: "No Financial Advice" },
  { id: "suspension", title: "Suspension and Termination" },
  { id: "liability", title: "Limitation of Liability" },
  { id: "risk", title: "Assumption of Risk" },
  { id: "changes", title: "Changes to These Terms" },
  { id: "contact", title: "Contact" },
];

const DOC_META = [
  { label: "Document", value: "Merchant" },
  { label: "Sections", value: "18" },
  { label: "Status", value: "Active" },
  { label: "Updated", value: "May 2026" },
];

const MerchantLiquidityTerms = ({ tabSlot }: { tabSlot?: ReactNode }) => {
  const [activeSection, setActiveSection] = useState("");
  const [progress, setProgress] = useState(0);
  const [panelMaxH, setPanelMaxH] = useState<number | undefined>(undefined);
  const contentRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Match the scrollable content panel's height to the sidebar (desktop only).
  useLayoutEffect(() => {
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

  useLayoutEffect(() => {
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
      <SEO canonical="https://www.blip.money/merchant" />

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
                LEGAL · MERCHANT &amp; LIQUIDITY PROVIDER TERMS
              </span>
            </div>

            <h1
              className="font-semibold tracking-[-0.035em] leading-[1.02] mb-6"
              style={{ fontSize: "clamp(44px, 10vw, 74px)", color: "#0a0a0a" }}
            >
              Merchant &amp; Liquidity{" "}
              <span
                style={{
                  color: ACCENT,
                  fontStyle: "italic",
                  fontWeight: 500,
                  fontFamily: "ui-serif, Georgia, serif",
                }}
              >
                Terms.
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
                        Participation · Settlements · Counterparty
                        <br />
                        Compliance · Reputation · Staking
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
                  <span className="sec-num">INTRODUCTION</span>
                  <div className="callout">
                    These Merchant &amp; Liquidity Provider Terms ("Merchant
                    Terms") govern participation by merchants, liquidity
                    providers, and marketplace participants ("Participants")
                    utilizing the blip.money platform and related Services.
                  </div>
                  <p>
                    By acting as a merchant or liquidity provider, you acknowledge
                    that you act independently and assume all risks associated
                    with your activities.
                  </p>
                </section>

                {/* 01 Independent Participation */}
                <section id="independent" className="mb-16">
                  <span className="sec-num">01</span>
                  <h2>Independent Participation</h2>
                  <p>Participants acknowledge that:</p>
                  <ul>
                    <li>They participate voluntarily.</li>
                    <li>They are independent users.</li>
                    <li>
                      They are not employees, agents, contractors,
                      representatives, or partners of blip.money.
                    </li>
                    <li>
                      No employment or agency relationship exists between
                      blip.money and any Participant.
                    </li>
                  </ul>
                  <p>
                    Blip.money merely provides software interfaces and
                    marketplace infrastructure.
                  </p>
                </section>

                {/* 02 No Guarantee of Volume or Profits */}
                <section id="no-guarantee" className="mb-16">
                  <span className="sec-num">02</span>
                  <h2>No Guarantee of Volume or Profits</h2>
                  <p>Blip.money does not guarantee:</p>
                  <ul>
                    <li>Trading volume.</li>
                    <li>Earnings.</li>
                    <li>Profitability.</li>
                    <li>User activity.</li>
                    <li>Transaction frequency.</li>
                    <li>Business opportunities.</li>
                  </ul>
                  <p>Participation may result in financial losses.</p>
                </section>

                {/* 03 Merchant Responsibilities */}
                <section id="responsibilities" className="mb-16">
                  <span className="sec-num">03</span>
                  <h2>Merchant Responsibilities</h2>
                  <p>Participants are solely responsible for:</p>
                  <ul>
                    <li>Their activities.</li>
                    <li>Their counterparties.</li>
                    <li>Compliance with applicable laws.</li>
                    <li>Tax reporting.</li>
                    <li>Banking relationships.</li>
                    <li>Fund management.</li>
                    <li>Security practices.</li>
                  </ul>
                  <p>
                    Blip.money does not supervise or manage merchant operations.
                  </p>
                </section>

                {/* 04 Fiat Settlements */}
                <section id="fiat" className="mb-16">
                  <span className="sec-num">04</span>
                  <h2>Fiat Settlements</h2>
                  <p>All fiat settlements occur directly between participants.</p>
                  <p>Blip.money:</p>
                  <ul>
                    <li>Does not hold fiat balances.</li>
                    <li>Does not process bank transfers.</li>
                    <li>Does not guarantee payments.</li>
                    <li>Does not verify settlement completion.</li>
                    <li>Does not participate in fiat transfers.</li>
                  </ul>
                  <p>Users bear all risks associated with fiat transactions.</p>
                </section>

                {/* 05 Counterparty Risk */}
                <section id="counterparty" className="mb-16">
                  <span className="sec-num">05</span>
                  <h2>Counterparty Risk</h2>
                  <p>Participants acknowledge that:</p>
                  <ul>
                    <li>Counterparties may default.</li>
                    <li>Fraud may occur.</li>
                    <li>Delays may arise.</li>
                    <li>Chargebacks may happen.</li>
                  </ul>
                  <p>Blip.money does not guarantee:</p>
                  <ul>
                    <li>Counterparty performance.</li>
                    <li>Payment completion.</li>
                    <li>Recovery of losses.</li>
                  </ul>
                </section>

                {/* 06 Compliance Responsibilities */}
                <section id="compliance" className="mb-16">
                  <span className="sec-num">06</span>
                  <h2>Compliance Responsibilities</h2>
                  <p>
                    Participants are solely responsible for ensuring compliance
                    with all laws applicable to them.
                  </p>
                  <p>This includes:</p>
                  <ul>
                    <li>Tax obligations.</li>
                    <li>Reporting requirements.</li>
                    <li>Licensing obligations.</li>
                    <li>Record keeping.</li>
                    <li>Anti-money laundering obligations.</li>
                    <li>Sanctions compliance.</li>
                  </ul>
                  <p>Blip.money does not provide legal or regulatory advice.</p>
                </section>

                {/* 07 Bank Account Risks */}
                <section id="bank-risks" className="mb-16">
                  <span className="sec-num">07</span>
                  <h2>Bank Account Risks</h2>
                  <p>Participants acknowledge that banks may:</p>
                  <ul>
                    <li>Restrict accounts.</li>
                    <li>Freeze balances.</li>
                    <li>Delay transfers.</li>
                    <li>Conduct reviews.</li>
                  </ul>
                  <p>
                    Blip.money has no control over banking institutions and
                    assumes no liability for banking actions.
                  </p>
                </section>

                {/* 08 Fraud Prevention */}
                <section id="fraud" className="mb-16">
                  <span className="sec-num">08</span>
                  <h2>Fraud Prevention</h2>
                  <p>Participants agree:</p>
                  <ul>
                    <li>Not to engage in fraud.</li>
                    <li>Not to use stolen funds.</li>
                    <li>Not to conduct deceptive activities.</li>
                    <li>Not to impersonate others.</li>
                    <li>Not to manipulate reputation systems.</li>
                  </ul>
                  <p>
                    Blip.money reserves the right to suspend or restrict users
                    engaged in harmful conduct.
                  </p>
                </section>

                {/* 09 Reputation System */}
                <section id="reputation" className="mb-16">
                  <span className="sec-num">09</span>
                  <h2>Reputation System</h2>
                  <p>
                    Blip.money may maintain reputation mechanisms to encourage
                    marketplace integrity.
                  </p>
                  <p>Reputation may be influenced by:</p>
                  <ul>
                    <li>Successful settlements.</li>
                    <li>Transaction history.</li>
                    <li>Counterparty feedback.</li>
                    <li>Fraud reports.</li>
                    <li>Appeals and disputes.</li>
                  </ul>
                  <p>Blip.money reserves discretion to:</p>
                  <ul>
                    <li>Reduce scores.</li>
                    <li>Suspend privileges.</li>
                    <li>Restrict access.</li>
                  </ul>
                  <p>
                    Such actions may be taken to protect users and maintain
                    marketplace integrity.
                  </p>
                </section>

                {/* 10 Staking */}
                <section id="staking" className="mb-16">
                  <span className="sec-num">10</span>
                  <h2>Staking</h2>
                  <p>Certain merchant privileges may require staking.</p>
                  <p>Participants acknowledge that:</p>
                  <ul>
                    <li>Staked assets may fluctuate in value.</li>
                    <li>Staking does not guarantee profits.</li>
                    <li>Staking does not create ownership rights.</li>
                    <li>Staking requirements may change.</li>
                  </ul>
                  <p>
                    Blip.money may suspend privileges associated with staking if
                    misuse or abuse is detected.
                  </p>
                </section>

                {/* 11 Security Responsibilities */}
                <section id="security" className="mb-16">
                  <span className="sec-num">11</span>
                  <h2>Security Responsibilities</h2>
                  <p>Participants are responsible for:</p>
                  <ul>
                    <li>Wallet security.</li>
                    <li>Private keys.</li>
                    <li>Device protection.</li>
                    <li>Password management.</li>
                  </ul>
                  <p>Blip.money cannot recover:</p>
                  <ul>
                    <li>Wallets.</li>
                    <li>Seed phrases.</li>
                    <li>Private keys.</li>
                    <li>Lost funds.</li>
                  </ul>
                </section>

                {/* 12 Tax Obligations */}
                <section id="tax" className="mb-16">
                  <span className="sec-num">12</span>
                  <h2>Tax Obligations</h2>
                  <p>Participants are solely responsible for:</p>
                  <ul>
                    <li>Income taxes.</li>
                    <li>Capital gains taxes.</li>
                    <li>Sales taxes.</li>
                    <li>Reporting requirements.</li>
                    <li>Filing obligations.</li>
                  </ul>
                  <p>
                    Blip.money neither calculates nor reports taxes on behalf of
                    participants.
                  </p>
                </section>

                {/* 13 No Financial Advice */}
                <section id="no-advice" className="mb-16">
                  <span className="sec-num">13</span>
                  <h2>No Financial Advice</h2>
                  <p>Nothing provided by blip.money constitutes:</p>
                  <ul>
                    <li>Financial advice.</li>
                    <li>Investment advice.</li>
                    <li>Legal advice.</li>
                    <li>Tax advice.</li>
                    <li>Accounting advice.</li>
                  </ul>
                  <p>
                    Participants should consult qualified professionals when
                    appropriate.
                  </p>
                </section>

                {/* 14 Suspension and Termination */}
                <section id="suspension" className="mb-16">
                  <span className="sec-num">14</span>
                  <h2>Suspension and Termination</h2>
                  <p>
                    Blip.money may restrict, suspend, or terminate access where
                    necessary to:
                  </p>
                  <ul>
                    <li>Protect users.</li>
                    <li>Prevent abuse.</li>
                    <li>Preserve marketplace integrity.</li>
                    <li>Address security concerns.</li>
                    <li>Comply with legal obligations.</li>
                  </ul>
                  <p>
                    Termination does not relieve Participants of obligations
                    incurred before termination.
                  </p>
                </section>

                {/* 15 Limitation of Liability */}
                <section id="liability" className="mb-16">
                  <span className="sec-num">15</span>
                  <h2>Limitation of Liability</h2>
                  <p>
                    To the maximum extent permitted by applicable law, blip.money
                    shall not be liable for:
                  </p>
                  <ul>
                    <li>Fraud committed by counterparties.</li>
                    <li>Frozen bank accounts.</li>
                    <li>Chargebacks.</li>
                    <li>Delayed payments.</li>
                    <li>Regulatory actions.</li>
                    <li>Lost profits.</li>
                    <li>Lost opportunities.</li>
                    <li>Consequential damages.</li>
                  </ul>
                  <p>
                    Participants assume all risks associated with their
                    activities.
                  </p>
                </section>

                {/* 16 Assumption of Risk */}
                <section id="risk" className="mb-16">
                  <span className="sec-num">16</span>
                  <h2>Assumption of Risk</h2>
                  <p>Participants acknowledge that:</p>
                  <ul>
                    <li>They act voluntarily.</li>
                    <li>They understand the risks involved.</li>
                    <li>They accept full responsibility for their activities.</li>
                    <li>
                      They release blip.money from liability to the maximum
                      extent permitted by applicable law.
                    </li>
                  </ul>
                </section>

                {/* 17 Changes to These Terms */}
                <section id="changes" className="mb-16">
                  <span className="sec-num">17</span>
                  <h2>Changes to These Terms</h2>
                  <p>
                    Blip.money reserves the right to modify these Merchant Terms
                    at any time.
                  </p>
                  <p>
                    Continued participation constitutes acceptance of any revised
                    terms.
                  </p>
                </section>

                {/* 18 Contact */}
                <section id="contact" className="mb-16">
                  <span className="sec-num">18</span>
                  <h2>Contact</h2>
                  <p>
                    Questions regarding these Merchant Terms may be directed to:
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
                        END OF DOCUMENT · MERCHANT &amp; LIQUIDITY PROVIDER TERMS
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

export default MerchantLiquidityTerms;
