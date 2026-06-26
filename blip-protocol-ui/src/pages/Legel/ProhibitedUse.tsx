import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";

const ACCENT = "#cc785c";
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

const sections = [
  { id: "important-notice", title: "Important Notice" },
  { id: "illegal", title: "Illegal Activities" },
  { id: "money-laundering", title: "Money Laundering" },
  { id: "sanctions", title: "Sanctions Evasion" },
  { id: "fraud", title: "Fraud" },
  { id: "stolen-funds", title: "Stolen or Unauthorized Funds" },
  { id: "terrorist", title: "Terrorist Financing" },
  { id: "exploitation", title: "Child Exploitation and Human Trafficking" },
  { id: "manipulation", title: "Market Manipulation" },
  { id: "malicious", title: "Malicious Activities" },
  { id: "software", title: "Exploitation of Software" },
  { id: "automated", title: "Automated Abuse" },
  { id: "ip", title: "Intellectual Property Violations" },
  { id: "impersonation", title: "Impersonation" },
  { id: "privacy", title: "Privacy Violations" },
  { id: "reputation", title: "Abuse of Reputation Systems" },
  { id: "merchant", title: "Abuse of Merchant Programs" },
  { id: "harmful", title: "Harmful Conduct" },
  { id: "enforcement", title: "Enforcement" },
  { id: "reporting", title: "Reporting Violations" },
  { id: "changes", title: "Changes to This Policy" },
];

const DOC_META = [
  { label: "Document", value: "Prohibited" },
  { label: "Sections", value: "20" },
  { label: "Status", value: "Active" },
  { label: "Updated", value: "May 2026" },
];

const ProhibitedUse = ({ tabSlot }: { tabSlot?: ReactNode }) => {
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
      <SEO canonical="https://www.blip.money/prohibited" />

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
        <div className="relative pt-2 sm:pt-6 pb-3 sm:pb-4 px-5 sm:px-6">
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
                LEGAL · PROHIBITED USE POLICY
              </span>
            </div>

            <h1
              className="font-semibold tracking-[-0.035em] leading-[1.02] mb-6"
              style={{ fontSize: "clamp(44px, 10vw, 74px)", color: "#0a0a0a" }}
            >
              Prohibited Use{" "}
              <span
                style={{
                  color: ACCENT,
                  fontStyle: "italic",
                  fontWeight: 500,
                  fontFamily: "ui-serif, Georgia, serif",
                }}
              >
                Policy.
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
                        Illegal · Laundering · Sanctions
                        <br />
                        Fraud · Abuse · Enforcement
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
                  <div className="callout">
                    This Prohibited Use Policy ("Policy") forms part of the Terms
                    of Service governing the use of blip.money ("blip.money",
                    "we", "our", or "us").
                  </div>
                  <p>
                    By accessing or using the Services, you agree not to engage in
                    any prohibited activities described herein.
                  </p>
                  <p>
                    Violation of this Policy may result in suspension,
                    termination, restricted access, or other protective measures.
                  </p>
                </section>

                {/* 01 Illegal Activities */}
                <section id="illegal" className="mb-16">
                  <span className="sec-num">01</span>
                  <h2>Illegal Activities</h2>
                  <p>You may not use the Services for any unlawful purpose.</p>
                  <p>Prohibited activities include:</p>
                  <ul>
                    <li>Violations of applicable laws.</li>
                    <li>Criminal conduct.</li>
                    <li>Fraudulent schemes.</li>
                    <li>Unauthorized financial activities.</li>
                    <li>Activities prohibited within your jurisdiction.</li>
                  </ul>
                  <p>
                    Users are solely responsible for determining the legality of
                    their activities.
                  </p>
                </section>

                {/* 02 Money Laundering */}
                <section id="money-laundering" className="mb-16">
                  <span className="sec-num">02</span>
                  <h2>Money Laundering</h2>
                  <p>You may not use the Services to:</p>
                  <ul>
                    <li>Conceal the origin of funds.</li>
                    <li>Layer transactions.</li>
                    <li>
                      Structure transactions to evade reporting requirements.
                    </li>
                    <li>Facilitate illicit financial activities.</li>
                    <li>Assist others in unlawful conduct.</li>
                  </ul>
                  <p>
                    Blip.money reserves the right to restrict access where
                    suspicious activity is detected.
                  </p>
                </section>

                {/* 03 Sanctions Evasion */}
                <section id="sanctions" className="mb-16">
                  <span className="sec-num">03</span>
                  <h2>Sanctions Evasion</h2>
                  <p>Users may not:</p>
                  <ul>
                    <li>Violate applicable sanctions laws.</li>
                    <li>Transact with sanctioned persons or entities.</li>
                    <li>Facilitate prohibited transactions.</li>
                    <li>Attempt to conceal sanctioned activity.</li>
                  </ul>
                </section>

                {/* 04 Fraud */}
                <section id="fraud" className="mb-16">
                  <span className="sec-num">04</span>
                  <h2>Fraud</h2>
                  <p>Users are prohibited from:</p>
                  <ul>
                    <li>Misrepresentation.</li>
                    <li>False claims.</li>
                    <li>Impersonation.</li>
                    <li>Identity deception.</li>
                    <li>Fake payment confirmations.</li>
                    <li>Social engineering.</li>
                    <li>Counterparty fraud.</li>
                  </ul>
                  <p>Fraudulent conduct may result in immediate restrictions.</p>
                </section>

                {/* 05 Stolen or Unauthorized Funds */}
                <section id="stolen-funds" className="mb-16">
                  <span className="sec-num">05</span>
                  <h2>Stolen or Unauthorized Funds</h2>
                  <p>Users shall not:</p>
                  <ul>
                    <li>Transfer stolen assets.</li>
                    <li>Use compromised accounts.</li>
                    <li>Use unauthorized payment methods.</li>
                    <li>
                      Participate in theft or unlawful acquisition of funds.
                    </li>
                  </ul>
                </section>

                {/* 06 Terrorist Financing */}
                <section id="terrorist" className="mb-16">
                  <span className="sec-num">06</span>
                  <h2>Terrorist Financing</h2>
                  <p>The Services may not be used to:</p>
                  <ul>
                    <li>Support terrorism.</li>
                    <li>Finance unlawful organizations.</li>
                    <li>Facilitate prohibited activities.</li>
                  </ul>
                </section>

                {/* 07 Child Exploitation and Human Trafficking */}
                <section id="exploitation" className="mb-16">
                  <span className="sec-num">07</span>
                  <h2>Child Exploitation and Human Trafficking</h2>
                  <p>Users may not utilize the Services in connection with:</p>
                  <ul>
                    <li>Human trafficking.</li>
                    <li>Child exploitation.</li>
                    <li>Sexual exploitation.</li>
                    <li>Any activity involving abuse or violence.</li>
                  </ul>
                  <p>Such conduct is strictly prohibited.</p>
                </section>

                {/* 08 Market Manipulation */}
                <section id="manipulation" className="mb-16">
                  <span className="sec-num">08</span>
                  <h2>Market Manipulation</h2>
                  <p>Users may not engage in:</p>
                  <ul>
                    <li>Wash trading.</li>
                    <li>Price manipulation.</li>
                    <li>Artificial activity.</li>
                    <li>Reputation manipulation.</li>
                    <li>Collusion.</li>
                    <li>False transaction reporting.</li>
                  </ul>
                </section>

                {/* 09 Malicious Activities */}
                <section id="malicious" className="mb-16">
                  <span className="sec-num">09</span>
                  <h2>Malicious Activities</h2>
                  <p>Users shall not:</p>
                  <ul>
                    <li>Introduce malware.</li>
                    <li>Conduct phishing attacks.</li>
                    <li>Spread ransomware.</li>
                    <li>Deploy harmful code.</li>
                    <li>Attempt denial-of-service attacks.</li>
                    <li>Interfere with system operations.</li>
                  </ul>
                </section>

                {/* 10 Exploitation of Software */}
                <section id="software" className="mb-16">
                  <span className="sec-num">10</span>
                  <h2>Exploitation of Software</h2>
                  <p>Users may not:</p>
                  <ul>
                    <li>Exploit bugs.</li>
                    <li>Manipulate smart contracts.</li>
                    <li>Circumvent restrictions.</li>
                    <li>Reverse engineer software.</li>
                    <li>Attempt unauthorized access.</li>
                  </ul>
                  <p>
                    Any discovered vulnerabilities should be reported responsibly.
                  </p>
                </section>

                {/* 11 Automated Abuse */}
                <section id="automated" className="mb-16">
                  <span className="sec-num">11</span>
                  <h2>Automated Abuse</h2>
                  <p>Users may not:</p>
                  <ul>
                    <li>Scrape data without authorization.</li>
                    <li>Use abusive bots.</li>
                    <li>Spam systems.</li>
                    <li>Generate excessive traffic.</li>
                    <li>Interfere with platform availability.</li>
                  </ul>
                  <p>
                    Reasonable API or automated access authorized by blip.money is
                    permitted.
                  </p>
                </section>

                {/* 12 Intellectual Property Violations */}
                <section id="ip" className="mb-16">
                  <span className="sec-num">12</span>
                  <h2>Intellectual Property Violations</h2>
                  <p>Users may not:</p>
                  <ul>
                    <li>Copy proprietary materials.</li>
                    <li>Reproduce branding.</li>
                    <li>Create unauthorized derivative works.</li>
                    <li>Infringe copyrights or trademarks.</li>
                  </ul>
                </section>

                {/* 13 Impersonation */}
                <section id="impersonation" className="mb-16">
                  <span className="sec-num">13</span>
                  <h2>Impersonation</h2>
                  <p>Users shall not:</p>
                  <ul>
                    <li>Pretend to be another person.</li>
                    <li>Use misleading identities.</li>
                    <li>Misrepresent affiliations.</li>
                    <li>Create deceptive accounts.</li>
                  </ul>
                </section>

                {/* 14 Privacy Violations */}
                <section id="privacy" className="mb-16">
                  <span className="sec-num">14</span>
                  <h2>Privacy Violations</h2>
                  <p>Users may not:</p>
                  <ul>
                    <li>Harvest personal information.</li>
                    <li>Track individuals unlawfully.</li>
                    <li>Publish confidential information.</li>
                    <li>Violate the privacy rights of others.</li>
                  </ul>
                </section>

                {/* 15 Abuse of Reputation Systems */}
                <section id="reputation" className="mb-16">
                  <span className="sec-num">15</span>
                  <h2>Abuse of Reputation Systems</h2>
                  <p>Users may not:</p>
                  <ul>
                    <li>Manipulate reputation scores.</li>
                    <li>Create fake accounts.</li>
                    <li>Coordinate artificial activity.</li>
                    <li>Abuse feedback mechanisms.</li>
                  </ul>
                </section>

                {/* 16 Abuse of Merchant Programs */}
                <section id="merchant" className="mb-16">
                  <span className="sec-num">16</span>
                  <h2>Abuse of Merchant Programs</h2>
                  <p>Merchants and liquidity providers may not:</p>
                  <ul>
                    <li>Conduct fake transactions.</li>
                    <li>Collude with counterparties.</li>
                    <li>Abuse reward mechanisms.</li>
                    <li>Artificially inflate volume.</li>
                    <li>Misrepresent settlement status.</li>
                  </ul>
                </section>

                {/* 17 Harmful Conduct */}
                <section id="harmful" className="mb-16">
                  <span className="sec-num">17</span>
                  <h2>Harmful Conduct</h2>
                  <p>Users may not engage in:</p>
                  <ul>
                    <li>Harassment.</li>
                    <li>Threats.</li>
                    <li>Hate speech.</li>
                    <li>Violence.</li>
                    <li>Abusive conduct.</li>
                  </ul>
                  <p>
                    Blip.money seeks to maintain a safe environment for
                    participants.
                  </p>
                </section>

                {/* 18 Enforcement */}
                <section id="enforcement" className="mb-16">
                  <span className="sec-num">18</span>
                  <h2>Enforcement</h2>
                  <p>Blip.money reserves the right to:</p>
                  <ul>
                    <li>Restrict access.</li>
                    <li>Suspend accounts.</li>
                    <li>Reduce reputation privileges.</li>
                    <li>Disable features.</li>
                    <li>Limit participation.</li>
                    <li>Permanently terminate access.</li>
                  </ul>
                  <p>
                    Protective measures may be taken without prior notice when
                    necessary to protect users or preserve marketplace integrity.
                  </p>
                </section>

                {/* 19 Reporting Violations */}
                <section id="reporting" className="mb-16">
                  <span className="sec-num">19</span>
                  <h2>Reporting Violations</h2>
                  <p>
                    Users are encouraged to report suspected abuse or violations
                    to:
                  </p>
                  <p>
                    <a
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=abuse@blip.money"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      abuse@blip.money
                    </a>
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

                {/* 20 Changes to This Policy */}
                <section id="changes" className="mb-16">
                  <span className="sec-num">20</span>
                  <h2>Changes to This Policy</h2>
                  <p>
                    Blip.money reserves the right to modify this Policy at any
                    time.
                  </p>
                  <p>
                    Continued use of the Services constitutes acceptance of
                    revised policies.
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
                        END OF DOCUMENT · PROHIBITED USE POLICY
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

export default ProhibitedUse;
