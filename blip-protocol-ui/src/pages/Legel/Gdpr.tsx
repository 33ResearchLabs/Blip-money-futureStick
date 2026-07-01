import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";

const ACCENT = "#cc785c";
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

const sections = [
  { id: "introduction", title: "Introduction" },
  { id: "principles", title: "Our Privacy Principles" },
  { id: "data-process", title: "Personal Data We May Process" },
  { id: "data-not-collect", title: "Personal Data We Do Not Collect" },
  { id: "purposes", title: "Purposes of Processing" },
  { id: "legal-bases", title: "Legal Bases for Processing" },
  { id: "minimization", title: "Data Minimization" },
  { id: "retention", title: "Data Retention" },
  { id: "transfers", title: "International Data Transfers" },
  { id: "rights", title: "Your GDPR Rights" },
  { id: "automated", title: "Automated Decision-Making" },
  { id: "security", title: "Security" },
  { id: "third-party", title: "Third-Party Services" },
  { id: "cookies", title: "Cookies" },
  { id: "children", title: "Children's Privacy" },
  { id: "changes", title: "Changes to This Notice" },
  { id: "contact", title: "Contact" },
];

const DOC_META = [
  { label: "Document", value: "GDPR" },
  { label: "Sections", value: "16" },
  { label: "Status", value: "Active" },
  { label: "Updated", value: "May 2026" },
];

const Gdpr = ({ tabSlot }: { tabSlot?: ReactNode }) => {
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
      <SEO canonical="https://www.blip.money/gdpr" />

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
                LEGAL · GDPR
              </span>
            </div>

            <h1
              className="font-semibold tracking-[-0.035em] leading-[1.02] mb-6"
              style={{ fontSize: "clamp(44px, 10vw, 74px)", color: "#0a0a0a" }}
            >
              GDPR
              <span
                style={{
                  color: ACCENT,
                  fontStyle: "italic",
                  fontWeight: 500,
                  fontFamily: "ui-serif, Georgia, serif",
                }}
              >
                .
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
                        Principles · Data · Purposes
                        <br />
                        Legal Bases · Rights · Security
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
                  <p>
                    Blip.money ("blip.money", "we", "our", or "us") respects the
                    privacy rights of individuals and is committed to handling
                    personal information in a transparent and responsible manner.
                  </p>
                  <p>
                    This GDPR Compliance Notice explains how we process personal
                    data relating to individuals located in the European Economic
                    Area ("EEA"), the United Kingdom ("UK"), and other
                    jurisdictions with similar data protection laws.
                  </p>
                  <p>This Notice supplements our Privacy Policy.</p>
                </section>

                {/* 01 Our Privacy Principles */}
                <section id="principles" className="mb-16">
                  <span className="sec-num">01</span>
                  <h2>Our Privacy Principles</h2>
                  <p>Blip.money is committed to the following principles:</p>
                  <ul>
                    <li>Lawfulness</li>
                    <li>Fairness</li>
                    <li>Transparency</li>
                    <li>Data minimization</li>
                    <li>Accuracy</li>
                    <li>Storage limitation</li>
                    <li>Integrity</li>
                    <li>Confidentiality</li>
                    <li>Accountability</li>
                  </ul>
                  <p>
                    We seek to collect only the information reasonably necessary
                    to provide and improve our Services.
                  </p>
                </section>

                {/* 02 Personal Data We May Process */}
                <section id="data-process" className="mb-16">
                  <span className="sec-num">02</span>
                  <h2>Personal Data We May Process</h2>
                  <p>Depending on how you use the Services, we may process:</p>

                  <h3>2.1 Account Information</h3>
                  <ul>
                    <li>Username</li>
                    <li>Email address</li>
                    <li>Telegram username (if voluntarily provided)</li>
                  </ul>

                  <h3>2.2 Technical Information</h3>
                  <ul>
                    <li>IP address</li>
                    <li>Browser type</li>
                    <li>Device information</li>
                    <li>Operating system</li>
                    <li>Session information</li>
                    <li>Diagnostic logs</li>
                  </ul>

                  <h3>2.3 Blockchain Information</h3>
                  <p>
                    Because public blockchains are transparent by design, we may
                    process publicly available blockchain information, including:
                  </p>
                  <ul>
                    <li>Wallet addresses</li>
                    <li>Public transaction history</li>
                    <li>Public smart contract interactions</li>
                  </ul>
                  <p>
                    Blockchain records cannot generally be altered or deleted.
                  </p>
                </section>

                {/* 03 Personal Data We Do Not Collect */}
                <section id="data-not-collect" className="mb-16">
                  <span className="sec-num">03</span>
                  <h2>Personal Data We Do Not Collect</h2>
                  <p>Blip.money does not intentionally collect or store:</p>
                  <ul>
                    <li>Private keys</li>
                    <li>Seed phrases</li>
                    <li>Wallet passwords</li>
                    <li>
                      Government-issued identification documents (unless
                      explicitly requested for a separate compliance process)
                    </li>
                    <li>Credit or debit card information</li>
                    <li>Bank account login credentials</li>
                    <li>Biometric data</li>
                  </ul>
                </section>

                {/* 04 Purposes of Processing */}
                <section id="purposes" className="mb-16">
                  <span className="sec-num">04</span>
                  <h2>Purposes of Processing</h2>
                  <p>
                    Personal information may be processed for purposes including:
                  </p>
                  <ul>
                    <li>Providing the Services</li>
                    <li>Operating the platform</li>
                    <li>Improving user experience</li>
                    <li>Fraud prevention</li>
                    <li>Security monitoring</li>
                    <li>Customer support</li>
                    <li>Product development</li>
                    <li>Service analytics</li>
                    <li>Legal compliance</li>
                    <li>Enforcing our Terms of Service</li>
                  </ul>
                </section>

                {/* 05 Legal Bases for Processing */}
                <section id="legal-bases" className="mb-16">
                  <span className="sec-num">05</span>
                  <h2>Legal Bases for Processing</h2>
                  <p>
                    Where GDPR applies, blip.money may process personal
                    information on one or more of the following legal bases:
                  </p>

                  <h3>5.1 Performance of a Contract</h3>
                  <p>Processing necessary to provide requested Services.</p>

                  <h3>5.2 Legitimate Interests</h3>
                  <p>Including:</p>
                  <ul>
                    <li>Platform security</li>
                    <li>Fraud prevention</li>
                    <li>Service improvements</li>
                    <li>Network integrity</li>
                    <li>Customer support</li>
                  </ul>

                  <h3>5.3 Legal Obligations</h3>
                  <p>Where processing is required by applicable law.</p>

                  <h3>5.4 Consent</h3>
                  <p>
                    Where required by law, we rely upon user consent before
                    processing certain categories of information.
                  </p>
                  <p>Users may withdraw consent where applicable.</p>
                </section>

                {/* 06 Data Minimization */}
                <section id="minimization" className="mb-16">
                  <span className="sec-num">06</span>
                  <h2>Data Minimization</h2>
                  <p>
                    Blip.money seeks to collect only the information reasonably
                    necessary to operate the Services.
                  </p>
                  <p>
                    We avoid collecting unnecessary personal information whenever
                    possible.
                  </p>
                </section>

                {/* 07 Data Retention */}
                <section id="retention" className="mb-16">
                  <span className="sec-num">07</span>
                  <h2>Data Retention</h2>
                  <p>
                    Personal information is retained only for as long as
                    reasonably necessary to:
                  </p>
                  <ul>
                    <li>Provide the Services</li>
                    <li>Comply with legal obligations</li>
                    <li>Resolve disputes</li>
                    <li>Protect users</li>
                    <li>Enforce agreements</li>
                  </ul>
                  <p>
                    Public blockchain records remain permanently available on
                    their respective networks.
                  </p>
                </section>

                {/* 08 International Data Transfers */}
                <section id="transfers" className="mb-16">
                  <span className="sec-num">08</span>
                  <h2>International Data Transfers</h2>
                  <p>
                    Your information may be processed by infrastructure providers
                    located in multiple jurisdictions.
                  </p>
                  <p>
                    Where appropriate, reasonable safeguards may be implemented
                    to protect personal information during international
                    transfers.
                  </p>
                </section>

                {/* 09 Your GDPR Rights */}
                <section id="rights" className="mb-16">
                  <span className="sec-num">09</span>
                  <h2>Your GDPR Rights</h2>
                  <p>
                    Subject to applicable law, individuals may have the following
                    rights:
                  </p>

                  <h3>9.1 Right of Access</h3>
                  <p>
                    Request confirmation regarding whether personal information
                    is processed.
                  </p>

                  <h3>9.2 Right to Rectification</h3>
                  <p>Request correction of inaccurate personal information.</p>

                  <h3>9.3 Right to Erasure</h3>
                  <p>
                    Request deletion of personal information where legally
                    applicable.
                  </p>
                  <p>
                    Certain blockchain records cannot be deleted because they
                    exist on decentralized public networks.
                  </p>

                  <h3>9.4 Right to Restrict Processing</h3>
                  <p>Request limitation of certain processing activities.</p>

                  <h3>9.5 Right to Data Portability</h3>
                  <p>
                    Receive certain personal information in a commonly used
                    format where applicable.
                  </p>

                  <h3>9.6 Right to Object</h3>
                  <p>Object to processing based upon legitimate interests.</p>

                  <h3>9.7 Right to Withdraw Consent</h3>
                  <p>Withdraw consent where processing relies upon consent.</p>

                  <h3>9.8 Right to Lodge a Complaint</h3>
                  <p>
                    Individuals may submit complaints to the relevant supervisory
                    authority if they believe their rights have been violated.
                  </p>
                </section>

                {/* 10 Automated Decision-Making */}
                <section id="automated" className="mb-16">
                  <span className="sec-num">10</span>
                  <h2>Automated Decision-Making</h2>
                  <p>Blip.money may use automated systems to:</p>
                  <ul>
                    <li>Detect fraud</li>
                    <li>Improve platform security</li>
                    <li>Identify abusive behavior</li>
                    <li>Protect marketplace integrity</li>
                  </ul>
                  <p>
                    These systems assist operational decisions but are not
                    intended to produce solely automated legal or similarly
                    significant effects without appropriate review where required
                    by applicable law.
                  </p>
                </section>

                {/* 11 Security */}
                <section id="security" className="mb-16">
                  <span className="sec-num">11</span>
                  <h2>Security</h2>
                  <p>
                    Blip.money implements commercially reasonable administrative,
                    technical, and organizational measures designed to protect
                    personal information.
                  </p>
                  <p>
                    Despite these efforts, no system can guarantee complete
                    security.
                  </p>
                  <p>
                    Users should also take appropriate measures to secure their
                    devices and wallets.
                  </p>
                </section>

                {/* 12 Third-Party Services */}
                <section id="third-party" className="mb-16">
                  <span className="sec-num">12</span>
                  <h2>Third-Party Services</h2>
                  <p>
                    The Services may integrate with third-party providers
                    including:
                  </p>
                  <ul>
                    <li>Wallet providers</li>
                    <li>Blockchain networks</li>
                    <li>Analytics providers</li>
                    <li>Infrastructure providers</li>
                    <li>Customer support providers</li>
                  </ul>
                  <p>
                    These third parties maintain their own privacy practices and
                    policies.
                  </p>
                </section>

                {/* 13 Cookies */}
                <section id="cookies" className="mb-16">
                  <span className="sec-num">13</span>
                  <h2>Cookies</h2>
                  <p>
                    Blip.money uses cookies and similar technologies as described
                    in our Cookie Policy.
                  </p>
                  <p>
                    Users may control cookie preferences through browser settings
                    where available.
                  </p>
                </section>

                {/* 14 Children's Privacy */}
                <section id="children" className="mb-16">
                  <span className="sec-num">14</span>
                  <h2>Children's Privacy</h2>
                  <p>
                    The Services are intended only for individuals who are at
                    least 18 years of age.
                  </p>
                  <p>
                    Blip.money does not knowingly collect personal information
                    from children.
                  </p>
                </section>

                {/* 15 Changes to This Notice */}
                <section id="changes" className="mb-16">
                  <span className="sec-num">15</span>
                  <h2>Changes to This Notice</h2>
                  <p>
                    Blip.money may update this GDPR Compliance Notice
                    periodically.
                  </p>
                  <p>Updated versions become effective upon publication.</p>
                  <p>
                    Continued use of the Services constitutes acceptance of the
                    revised Notice.
                  </p>
                </section>

                {/* 16 Contact */}
                <section id="contact" className="mb-16">
                  <span className="sec-num">16</span>
                  <h2>Contact</h2>
                  <p>
                    Questions regarding GDPR or privacy matters may be directed
                    to:
                  </p>
                  <p>
                    <a
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=privacy@blip.money"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      privacy@blip.money
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
                  <p>
                    If you wish to exercise any applicable data protection
                    rights, please contact us using the above email addresses.
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
                        END OF DOCUMENT · GDPR
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

export default Gdpr;
