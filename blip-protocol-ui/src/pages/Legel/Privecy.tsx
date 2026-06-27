import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";

const ACCENT = "#cc785c";
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

const sections = [
  { id: "introduction", title: "Introduction" },
  { id: "collect", title: "Information We Collect" },
  { id: "not-collect", title: "Information We Do Not Collect" },
  { id: "use", title: "How We Use Information" },
  { id: "blockchain", title: "Blockchain Data" },
  { id: "cookies", title: "Cookies and Tracking Technologies" },
  { id: "analytics", title: "Analytics" },
  { id: "sharing", title: "Information Sharing" },
  { id: "retention", title: "Data Retention" },
  { id: "security", title: "Security" },
  { id: "third-party", title: "Third-Party Services" },
  { id: "transfers", title: "International Transfers" },
  { id: "children", title: "Children's Privacy" },
  { id: "rights", title: "Your Rights" },
  { id: "changes", title: "Changes to This Privacy Policy" },
  { id: "contact", title: "Contact Us" },
];

const DOC_META = [
  { label: "Document", value: "Privacy" },
  { label: "Sections", value: "15" },
  { label: "Status", value: "Active" },
  { label: "Updated", value: "May 2026" },
];

const Privacy = ({ tabSlot }: { tabSlot?: ReactNode }) => {
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
      <SEO canonical="https://www.blip.money/privacy" />

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
                LEGAL · PRIVACY POLICY
              </span>
            </div>

            <h1
              className="font-semibold tracking-[-0.035em] leading-[1.02] mb-6"
              style={{ fontSize: "clamp(44px, 10vw, 74px)", color: "#0a0a0a" }}
            >
              Privacy{" "}
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
                        Data · Wallets · Cookies
                        <br />
                        Sharing · Retention · Rights
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
                    Welcome to blip.money ("blip.money", "we", "our", or "us").
                  </div>
                  <p>
                    This Privacy Policy explains how information is collected,
                    used, disclosed, and protected when you access or use the
                    blip.money website, applications, protocol, interfaces, APIs,
                    smart contracts, and related services (collectively, the
                    "Services").
                  </p>
                  <p>
                    Blip.money is committed to protecting user privacy while
                    providing access to decentralized peer-to-peer marketplace
                    infrastructure.
                  </p>
                  <p>
                    By accessing or using the Services, you acknowledge and agree
                    to the practices described in this Privacy Policy.
                  </p>
                </section>

                {/* 01 Information We Collect */}
                <section id="collect" className="mb-16">
                  <span className="sec-num">01</span>
                  <h2>Information We Collect</h2>
                  <p>
                    Blip.money seeks to minimize the collection of personal
                    information. Depending on your use of the Services, we may
                    collect the following information.
                  </p>

                  <h3>1.1 Information You Provide</h3>
                  <p>You may voluntarily provide:</p>
                  <ul>
                    <li>Email address.</li>
                    <li>Username.</li>
                    <li>Telegram username.</li>
                    <li>Support communications.</li>
                    <li>Feedback and reports.</li>
                  </ul>

                  <h3>1.2 Wallet Information</h3>
                  <p>When connecting a wallet, we may access:</p>
                  <ul>
                    <li>Public wallet addresses.</li>
                    <li>Blockchain transaction history.</li>
                    <li>Public on-chain activity.</li>
                  </ul>
                  <p>
                    Wallet addresses and blockchain transactions are public by
                    nature and are not considered confidential information.
                  </p>

                  <h3>1.3 Technical Information</h3>
                  <p>We may automatically collect:</p>
                  <ul>
                    <li>IP address.</li>
                    <li>Device information.</li>
                    <li>Browser type.</li>
                    <li>Operating system.</li>
                    <li>Session information.</li>
                    <li>Referral URLs.</li>
                    <li>Usage statistics.</li>
                    <li>Crash reports.</li>
                  </ul>

                  <h3>1.4 Cookies and Analytics</h3>
                  <p>We may use:</p>
                  <ul>
                    <li>Cookies.</li>
                    <li>Local storage.</li>
                    <li>Analytics technologies.</li>
                    <li>Performance monitoring tools.</li>
                  </ul>
                </section>

                {/* 02 Information We Do Not Collect */}
                <section id="not-collect" className="mb-16">
                  <span className="sec-num">02</span>
                  <h2>Information We Do Not Collect</h2>
                  <p>Blip.money does not intentionally collect:</p>
                  <ul>
                    <li>Private keys.</li>
                    <li>Seed phrases.</li>
                    <li>Passwords to external wallets.</li>
                    <li>Bank account credentials.</li>
                    <li>Debit or credit card information.</li>
                    <li>Social security numbers.</li>
                    <li>Government identification documents.</li>
                    <li>Biometric information.</li>
                  </ul>
                  <p>Blip.money does not have access to your non-custodial wallet.</p>
                </section>

                {/* 03 How We Use Information */}
                <section id="use" className="mb-16">
                  <span className="sec-num">03</span>
                  <h2>How We Use Information</h2>
                  <p>Information may be used to:</p>
                  <ul>
                    <li>Operate and improve the Services.</li>
                    <li>Maintain security.</li>
                    <li>Prevent abuse and fraud.</li>
                    <li>Respond to support requests.</li>
                    <li>Analyze platform usage.</li>
                    <li>Detect technical issues.</li>
                    <li>Communicate updates and announcements.</li>
                    <li>Enforce our Terms of Service.</li>
                  </ul>
                </section>

                {/* 04 Blockchain Data */}
                <section id="blockchain" className="mb-16">
                  <span className="sec-num">04</span>
                  <h2>Blockchain Data</h2>
                  <p>Blockchain transactions are public and immutable.</p>
                  <p>Blip.money cannot:</p>
                  <ul>
                    <li>Delete blockchain records.</li>
                    <li>Modify blockchain data.</li>
                    <li>Restrict access to public blockchains.</li>
                  </ul>
                  <p>
                    Users acknowledge that transactions conducted through public
                    blockchains may remain permanently visible to others.
                  </p>
                </section>

                {/* 05 Cookies and Tracking Technologies */}
                <section id="cookies" className="mb-16">
                  <span className="sec-num">05</span>
                  <h2>Cookies and Tracking Technologies</h2>
                  <p>
                    Blip.money may use cookies and similar technologies to:
                  </p>
                  <ul>
                    <li>Remember preferences.</li>
                    <li>Improve performance.</li>
                    <li>Measure usage.</li>
                    <li>Maintain sessions.</li>
                    <li>Enhance user experience.</li>
                  </ul>
                  <p>
                    Users may disable cookies through browser settings, although
                    some features may not function properly.
                  </p>
                </section>

                {/* 06 Analytics */}
                <section id="analytics" className="mb-16">
                  <span className="sec-num">06</span>
                  <h2>Analytics</h2>
                  <p>
                    Blip.money may use third-party analytics providers to better
                    understand platform usage.
                  </p>
                  <p>Analytics providers may collect:</p>
                  <ul>
                    <li>Device information.</li>
                    <li>Browser information.</li>
                    <li>Usage metrics.</li>
                    <li>IP addresses.</li>
                    <li>Session activity.</li>
                  </ul>
                  <p>Analytics data is used solely to improve the Services.</p>
                </section>

                {/* 07 Information Sharing */}
                <section id="sharing" className="mb-16">
                  <span className="sec-num">07</span>
                  <h2>Information Sharing</h2>
                  <p>Blip.money does not sell personal information.</p>
                  <p>Information may be shared with:</p>

                  <h3>7.1 Service Providers</h3>
                  <p>Third parties assisting with:</p>
                  <ul>
                    <li>Hosting.</li>
                    <li>Analytics.</li>
                    <li>Infrastructure.</li>
                    <li>Customer support.</li>
                    <li>Security monitoring.</li>
                  </ul>

                  <h3>7.2 Legal Compliance</h3>
                  <p>Information may be disclosed when necessary to:</p>
                  <ul>
                    <li>Comply with legal obligations.</li>
                    <li>Respond to lawful requests.</li>
                    <li>Protect users.</li>
                    <li>Prevent fraud.</li>
                    <li>Enforce our policies.</li>
                  </ul>

                  <h3>7.3 Corporate Transactions</h3>
                  <p>In connection with:</p>
                  <ul>
                    <li>Mergers.</li>
                    <li>Acquisitions.</li>
                    <li>Asset sales.</li>
                    <li>Reorganizations.</li>
                  </ul>
                </section>

                {/* 08 Data Retention */}
                <section id="retention" className="mb-16">
                  <span className="sec-num">08</span>
                  <h2>Data Retention</h2>
                  <p>Information may be retained:</p>
                  <ul>
                    <li>For as long as necessary to provide the Services.</li>
                    <li>To comply with legal obligations.</li>
                    <li>To resolve disputes.</li>
                    <li>To enforce agreements.</li>
                  </ul>
                  <p>
                    Blockchain records are permanent and cannot be deleted by
                    blip.money.
                  </p>
                </section>

                {/* 09 Security */}
                <section id="security" className="mb-16">
                  <span className="sec-num">09</span>
                  <h2>Security</h2>
                  <p>
                    Blip.money employs commercially reasonable security measures.
                  </p>
                  <p>
                    However, no method of electronic transmission or storage is
                    completely secure.
                  </p>
                  <p>Users acknowledge that:</p>
                  <ul>
                    <li>Internet communications carry inherent risks.</li>
                    <li>Unauthorized access may occur.</li>
                    <li>Data breaches may occur despite safeguards.</li>
                  </ul>
                  <p>Blip.money cannot guarantee absolute security.</p>
                </section>

                {/* 10 Third-Party Services */}
                <section id="third-party" className="mb-16">
                  <span className="sec-num">10</span>
                  <h2>Third-Party Services</h2>
                  <p>
                    The Services may integrate with or link to third-party
                    services, including:
                  </p>
                  <ul>
                    <li>Wallet providers.</li>
                    <li>Blockchain networks.</li>
                    <li>RPC providers.</li>
                    <li>Analytics providers.</li>
                    <li>Communication platforms.</li>
                  </ul>
                  <p>
                    Blip.money does not control third-party services and is not
                    responsible for their privacy practices.
                  </p>
                  <p>
                    Users should review the policies of those third parties
                    independently.
                  </p>
                </section>

                {/* 11 International Transfers */}
                <section id="transfers" className="mb-16">
                  <span className="sec-num">11</span>
                  <h2>International Transfers</h2>
                  <p>
                    By using the Services, you acknowledge that information may
                    be processed and stored in multiple jurisdictions depending
                    on infrastructure providers and service partners.
                  </p>
                  <p>Protection standards may differ between jurisdictions.</p>
                </section>

                {/* 12 Children's Privacy */}
                <section id="children" className="mb-16">
                  <span className="sec-num">12</span>
                  <h2>Children's Privacy</h2>
                  <p>
                    The Services are not directed to individuals under the age of
                    eighteen (18).
                  </p>
                  <p>
                    Blip.money does not knowingly collect information from minors.
                  </p>
                  <p>
                    If information from a minor is identified, reasonable efforts
                    will be made to delete such information.
                  </p>
                </section>

                {/* 13 Your Rights */}
                <section id="rights" className="mb-16">
                  <span className="sec-num">13</span>
                  <h2>Your Rights</h2>
                  <p>Subject to applicable laws, users may have rights to:</p>
                  <ul>
                    <li>Access information.</li>
                    <li>Correct inaccurate information.</li>
                    <li>Request deletion.</li>
                    <li>Restrict processing.</li>
                    <li>Object to certain processing activities.</li>
                    <li>Receive copies of personal information.</li>
                  </ul>
                  <p>
                    Certain rights may be limited by technical or legal
                    constraints, including the immutable nature of blockchain
                    records.
                  </p>
                </section>

                {/* 14 Changes to This Privacy Policy */}
                <section id="changes" className="mb-16">
                  <span className="sec-num">14</span>
                  <h2>Changes to This Privacy Policy</h2>
                  <p>
                    Blip.money may update this Privacy Policy from time to time.
                  </p>
                  <p>Changes become effective upon publication.</p>
                  <p>
                    Continued use of the Services constitutes acceptance of any
                    revised Privacy Policy.
                  </p>
                </section>

                {/* 15 Contact Us */}
                <section id="contact" className="mb-16">
                  <span className="sec-num">15</span>
                  <h2>Contact Us</h2>
                  <p>
                    Questions regarding this Privacy Policy may be directed to:
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
                        END OF DOCUMENT · PRIVACY POLICY
                      </div>
                      <h3 className="text-[22px] font-semibold tracking-[-0.02em] text-black mb-2">
                        Your acknowledgment.
                      </h3>
                      <p
                        className="text-[13.5px] leading-[1.6]"
                        style={{ color: "rgba(0,0,0,0.58)" }}
                      >
                        By accessing or using the Services, you acknowledge that
                        you have read and understood this Privacy Policy and
                        agree to its terms.
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

export default Privacy;
