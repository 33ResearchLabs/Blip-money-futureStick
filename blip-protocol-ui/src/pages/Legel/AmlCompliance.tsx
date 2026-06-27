import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";

const ACCENT = "#cc785c";
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

const sections = [
  { id: "introduction", title: "Introduction" },
  { id: "role", title: "Our Role" },
  { id: "principles", title: "Compliance Principles" },
  { id: "responsibilities", title: "User Responsibilities" },
  { id: "prohibited", title: "Prohibited Activities" },
  { id: "sanctions", title: "Sanctions Compliance" },
  { id: "integrity", title: "Marketplace Integrity" },
  { id: "reporting", title: "Reporting Suspicious Activity" },
  { id: "merchant", title: "Merchant Responsibilities" },
  { id: "third-party", title: "Third-Party Services" },
  { id: "investigations", title: "Investigations" },
  { id: "legal-requests", title: "Legal Requests" },
  { id: "no-advice", title: "No Legal or Regulatory Advice" },
  { id: "limitation", title: "Limitation of Responsibility" },
  { id: "changes", title: "Changes to This Statement" },
  { id: "contact", title: "Contact" },
];

const DOC_META = [
  { label: "Document", value: "AML" },
  { label: "Sections", value: "15" },
  { label: "Status", value: "Active" },
  { label: "Updated", value: "May 2026" },
];

const AmlCompliance = ({ tabSlot }: { tabSlot?: ReactNode }) => {
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
      <SEO canonical="https://www.blip.money/aml" />

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
                LEGAL · AML &amp; COMPLIANCE STATEMENT
              </span>
            </div>

            <h1
              className="font-semibold tracking-[-0.035em] leading-[1.02] mb-6"
              style={{ fontSize: "clamp(44px, 10vw, 74px)", color: "#0a0a0a" }}
            >
              AML &amp; Compliance{" "}
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
                        {s.id === "introduction"
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
                          const isIntro = s.id === "introduction";
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
                        Role · Principles · Sanctions
                        <br />
                        Reporting · Merchant · Investigations
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
                {/* Introduction — first, directly below the heading */}
                <section id="introduction" className="mb-16">
                  <span className="sec-num">INTRODUCTION</span>
                  <div className="callout">
                    Blip.money ("blip.money", "we", "our", or "us") is committed
                    to fostering a secure, transparent, and responsible
                    peer-to-peer marketplace.
                  </div>
                  <p>
                    This AML &amp; Compliance Statement explains the principles
                    that guide our approach to compliance, marketplace integrity,
                    and the prevention of unlawful activity.
                  </p>
                  <p>This Statement should be read together with our:</p>
                  <ul>
                    <li>Terms of Service</li>
                    <li>Privacy Policy</li>
                    <li>Risk Disclosure Statement</li>
                    <li>Merchant &amp; Liquidity Provider Terms</li>
                    <li>Prohibited Use Policy</li>
                  </ul>
                </section>

                {/* 01 Our Role */}
                <section id="role" className="mb-16">
                  <span className="sec-num">01</span>
                  <h2>Our Role</h2>
                  <p>
                    Blip.money provides software, interfaces, and technology that
                    enable users to interact within a decentralized peer-to-peer
                    marketplace.
                  </p>
                  <p>Blip.money does not:</p>
                  <ul>
                    <li>Act as a bank.</li>
                    <li>Hold customer fiat funds.</li>
                    <li>Custody digital assets.</li>
                    <li>Execute transactions on behalf of users.</li>
                    <li>Control users' wallets.</li>
                    <li>Control private keys.</li>
                    <li>Guarantee settlements between participants.</li>
                  </ul>
                  <p>
                    Users remain solely responsible for their own transactions
                    and legal obligations.
                  </p>
                </section>

                {/* 02 Compliance Principles */}
                <section id="principles" className="mb-16">
                  <span className="sec-num">02</span>
                  <h2>Compliance Principles</h2>
                  <p>Blip.money is committed to supporting:</p>
                  <ul>
                    <li>Marketplace integrity.</li>
                    <li>Responsible participation.</li>
                    <li>Fraud prevention.</li>
                    <li>Protection of users.</li>
                    <li>Compliance with applicable laws where relevant.</li>
                    <li>
                      Cooperation with lawful requests where legally required.
                    </li>
                  </ul>
                </section>

                {/* 03 User Responsibilities */}
                <section id="responsibilities" className="mb-16">
                  <span className="sec-num">03</span>
                  <h2>User Responsibilities</h2>
                  <p>Each user is solely responsible for:</p>
                  <ul>
                    <li>Understanding applicable laws.</li>
                    <li>
                      Determining whether use of digital assets is lawful in
                      their jurisdiction.
                    </li>
                    <li>Complying with tax obligations.</li>
                    <li>Maintaining appropriate transaction records.</li>
                    <li>Conducting lawful activities.</li>
                  </ul>
                  <p>
                    Users are expected to exercise reasonable care when
                    interacting with counterparties.
                  </p>
                </section>

                {/* 04 Prohibited Activities */}
                <section id="prohibited" className="mb-16">
                  <span className="sec-num">04</span>
                  <h2>Prohibited Activities</h2>
                  <p>
                    The Services must not be used for activities including, but
                    not limited to:
                  </p>
                  <ul>
                    <li>Money laundering.</li>
                    <li>Terrorist financing.</li>
                    <li>Fraud.</li>
                    <li>Identity theft.</li>
                    <li>Use of stolen assets.</li>
                    <li>Sanctions evasion.</li>
                    <li>Human trafficking.</li>
                    <li>Child exploitation.</li>
                    <li>Bribery.</li>
                    <li>Corruption.</li>
                    <li>Market manipulation.</li>
                    <li>Any other unlawful activity.</li>
                  </ul>
                  <p>
                    Users engaging in prohibited conduct may have their access
                    restricted or terminated.
                  </p>
                </section>

                {/* 05 Sanctions Compliance */}
                <section id="sanctions" className="mb-16">
                  <span className="sec-num">05</span>
                  <h2>Sanctions Compliance</h2>
                  <p>
                    Users are responsible for ensuring that their activities do
                    not violate applicable sanctions laws.
                  </p>
                  <p>
                    Blip.money may restrict access where there is a reasonable
                    belief that use of the Services would involve:
                  </p>
                  <ul>
                    <li>Sanctioned individuals.</li>
                    <li>Sanctioned entities.</li>
                    <li>Restricted jurisdictions.</li>
                    <li>Prohibited activities.</li>
                  </ul>
                </section>

                {/* 06 Marketplace Integrity */}
                <section id="integrity" className="mb-16">
                  <span className="sec-num">06</span>
                  <h2>Marketplace Integrity</h2>
                  <p>
                    To help maintain a trustworthy marketplace, blip.money may
                    implement reasonable measures to:
                  </p>
                  <ul>
                    <li>Detect fraudulent activity.</li>
                    <li>Prevent abuse.</li>
                    <li>Identify unusual marketplace behavior.</li>
                    <li>Protect users from scams.</li>
                    <li>Preserve marketplace integrity.</li>
                  </ul>
                  <p>
                    These measures may include automated or manual reviews of
                    platform activity.
                  </p>
                </section>

                {/* 07 Reporting Suspicious Activity */}
                <section id="reporting" className="mb-16">
                  <span className="sec-num">07</span>
                  <h2>Reporting Suspicious Activity</h2>
                  <p>Users are encouraged to report suspected:</p>
                  <ul>
                    <li>Fraud.</li>
                    <li>Scams.</li>
                    <li>Impersonation.</li>
                    <li>Security incidents.</li>
                    <li>Marketplace abuse.</li>
                    <li>Illegal activity.</li>
                  </ul>
                  <p>
                    Reports may be submitted through official support channels.
                  </p>
                </section>

                {/* 08 Merchant Responsibilities */}
                <section id="merchant" className="mb-16">
                  <span className="sec-num">08</span>
                  <h2>Merchant Responsibilities</h2>
                  <p>
                    Merchants and liquidity providers are solely responsible for
                    ensuring that their activities comply with applicable laws
                    and regulations.
                  </p>
                  <p>This includes responsibility for:</p>
                  <ul>
                    <li>Customer due diligence, where required by law.</li>
                    <li>Tax compliance.</li>
                    <li>Record keeping.</li>
                    <li>Banking relationships.</li>
                    <li>
                      Regulatory obligations applicable to their activities.
                    </li>
                  </ul>
                  <p>
                    Blip.money does not assume these responsibilities on behalf
                    of participants.
                  </p>
                </section>

                {/* 09 Third-Party Services */}
                <section id="third-party" className="mb-16">
                  <span className="sec-num">09</span>
                  <h2>Third-Party Services</h2>
                  <p>Users may interact with third-party services including:</p>
                  <ul>
                    <li>Wallet providers.</li>
                    <li>Blockchain networks.</li>
                    <li>Banking institutions.</li>
                    <li>Infrastructure providers.</li>
                  </ul>
                  <p>
                    Blip.money does not control such services and is not
                    responsible for their compliance practices.
                  </p>
                </section>

                {/* 10 Investigations */}
                <section id="investigations" className="mb-16">
                  <span className="sec-num">10</span>
                  <h2>Investigations</h2>
                  <p>
                    Where appropriate to protect the marketplace, blip.money may:
                  </p>
                  <ul>
                    <li>Review reported abuse.</li>
                    <li>Investigate fraudulent activity.</li>
                    <li>Restrict abusive participants.</li>
                    <li>Suspend marketplace privileges.</li>
                    <li>Remove users engaged in prohibited conduct.</li>
                  </ul>
                  <p>
                    These actions are intended solely to preserve marketplace
                    integrity and user safety.
                  </p>
                </section>

                {/* 11 Legal Requests */}
                <section id="legal-requests" className="mb-16">
                  <span className="sec-num">11</span>
                  <h2>Legal Requests</h2>
                  <p>
                    Where legally required, blip.money may respond to valid
                    requests from competent authorities in accordance with
                    applicable law.
                  </p>
                  <p>
                    Nothing in this Statement obligates blip.money to disclose
                    information except where legally required or otherwise
                    permitted by applicable law.
                  </p>
                </section>

                {/* 12 No Legal or Regulatory Advice */}
                <section id="no-advice" className="mb-16">
                  <span className="sec-num">12</span>
                  <h2>No Legal or Regulatory Advice</h2>
                  <p>Nothing contained in the Services constitutes:</p>
                  <ul>
                    <li>Legal advice.</li>
                    <li>Regulatory advice.</li>
                    <li>Tax advice.</li>
                    <li>Financial advice.</li>
                    <li>Compliance advice.</li>
                  </ul>
                  <p>
                    Users should seek independent professional advice where
                    appropriate.
                  </p>
                </section>

                {/* 13 Limitation of Responsibility */}
                <section id="limitation" className="mb-16">
                  <span className="sec-num">13</span>
                  <h2>Limitation of Responsibility</h2>
                  <p>Blip.money cannot guarantee that:</p>
                  <ul>
                    <li>Every participant will act lawfully.</li>
                    <li>Fraud will never occur.</li>
                    <li>
                      Counterparties will always fulfill their obligations.
                    </li>
                    <li>Transactions will always complete successfully.</li>
                  </ul>
                  <p>
                    Users remain responsible for conducting their own risk
                    assessments before entering into transactions.
                  </p>
                </section>

                {/* 14 Changes to This Statement */}
                <section id="changes" className="mb-16">
                  <span className="sec-num">14</span>
                  <h2>Changes to This Statement</h2>
                  <p>
                    Blip.money may modify this AML &amp; Compliance Statement from
                    time to time.
                  </p>
                  <p>Updated versions become effective upon publication.</p>
                  <p>
                    Continued use of the Services constitutes acceptance of the
                    revised Statement.
                  </p>
                </section>

                {/* 15 Contact */}
                <section id="contact" className="mb-16">
                  <span className="sec-num">15</span>
                  <h2>Contact</h2>
                  <p>
                    Questions regarding this AML &amp; Compliance Statement may
                    be directed to:
                  </p>
                  <p>
                    <a
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=compliance@blip.money"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      compliance@blip.money
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
                        END OF DOCUMENT · AML &amp; COMPLIANCE STATEMENT
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

export default AmlCompliance;
