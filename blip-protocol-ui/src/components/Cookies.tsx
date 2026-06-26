import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";

const ACCENT = "#cc785c";
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

const sections = [
  { id: "introduction", title: "Introduction" },
  { id: "what-are-cookies", title: "What Are Cookies?" },
  { id: "types", title: "Types of Cookies We Use" },
  { id: "similar-tech", title: "Similar Technologies" },
  { id: "how-we-use", title: "How We Use Cookies" },
  { id: "third-party-analytics", title: "Third-Party Analytics" },
  { id: "managing", title: "Managing Cookies" },
  { id: "dnt", title: "Do Not Track Signals" },
  { id: "retention", title: "Data Retention" },
  { id: "changes", title: "Changes to This Cookie Policy" },
  { id: "contact", title: "Contact Us" },
];

const DOC_META = [
  { label: "Document", value: "Cookies" },
  { label: "Sections", value: "10" },
  { label: "Status", value: "Active" },
  { label: "Updated", value: "May 2026" },
];

const Cookies = ({ tabSlot }: { tabSlot?: ReactNode }) => {
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
      <SEO canonical="https://www.blip.money/cookies" />

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
                LEGAL · COOKIES POLICY
              </span>
            </div>

            <h1
              className="font-semibold tracking-[-0.035em] leading-[1.02] mb-6"
              style={{ fontSize: "clamp(44px, 10vw, 74px)", color: "#0a0a0a" }}
            >
              Cookies{" "}
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
                        Cookies · Types · Tracking
                        <br />
                        Analytics · Managing · Retention
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
                  <h2>Introduction</h2>
                  <p>
                    This Cookie Policy explains how Blip.money ("blip.money",
                    "we", "our", or "us") uses cookies and similar technologies
                    when you access or use our website, applications, interfaces,
                    and related services (collectively, the "Services").
                  </p>
                  <p>
                    By continuing to use the Services, you consent to the use of
                    cookies and similar technologies in accordance with this
                    Cookie Policy.
                  </p>
                </section>

                {/* 01 What Are Cookies? */}
                <section id="what-are-cookies" className="mb-16">
                  <span className="sec-num">01</span>
                  <h2>What Are Cookies?</h2>
                  <p>
                    Cookies are small text files stored on your device when you
                    visit a website.
                  </p>
                  <p>Cookies help websites:</p>
                  <ul>
                    <li>Remember user preferences.</li>
                    <li>Maintain sessions.</li>
                    <li>Improve functionality.</li>
                    <li>Analyze traffic.</li>
                    <li>Enhance user experience.</li>
                    <li>Detect errors and abuse.</li>
                  </ul>
                  <p>
                    Cookies do not typically contain sensitive information and
                    cannot access information stored elsewhere on your device.
                  </p>
                </section>

                {/* 02 Types of Cookies We Use */}
                <section id="types" className="mb-16">
                  <span className="sec-num">02</span>
                  <h2>Types of Cookies We Use</h2>

                  <h3>Essential Cookies</h3>
                  <p>
                    These cookies are necessary for the operation of the
                    Services.
                  </p>
                  <p>Examples include:</p>
                  <ul>
                    <li>Authentication sessions.</li>
                    <li>Wallet connection preferences.</li>
                    <li>Security protections.</li>
                    <li>Fraud prevention mechanisms.</li>
                    <li>User settings.</li>
                  </ul>
                  <p>
                    Disabling these cookies may prevent parts of the Services
                    from functioning properly.
                  </p>

                  <h3>Performance and Analytics Cookies</h3>
                  <p>
                    These cookies help us understand how users interact with the
                    Services.
                  </p>
                  <p>Information collected may include:</p>
                  <ul>
                    <li>Pages visited.</li>
                    <li>Device information.</li>
                    <li>Browser information.</li>
                    <li>Session duration.</li>
                    <li>Traffic sources.</li>
                    <li>Error logs.</li>
                  </ul>
                  <p>
                    This information helps us improve platform performance and
                    user experience.
                  </p>

                  <h3>Functional Cookies</h3>
                  <p>Functional cookies enable:</p>
                  <ul>
                    <li>Language preferences.</li>
                    <li>Theme settings.</li>
                    <li>Region settings.</li>
                    <li>Interface customizations.</li>
                    <li>Previously selected options.</li>
                  </ul>

                  <h3>Security Cookies</h3>
                  <p>Security cookies help:</p>
                  <ul>
                    <li>Detect suspicious activity.</li>
                    <li>Prevent abuse.</li>
                    <li>Protect against unauthorized access.</li>
                    <li>Improve system integrity.</li>
                  </ul>

                  <h3>Third-Party Cookies</h3>
                  <p>
                    Certain third-party service providers may place cookies
                    through the Services.
                  </p>
                  <p>These providers may include:</p>
                  <ul>
                    <li>Analytics providers.</li>
                    <li>Hosting providers.</li>
                    <li>Infrastructure providers.</li>
                    <li>Content delivery networks.</li>
                    <li>Customer support tools.</li>
                  </ul>
                  <p>
                    Blip.money does not control third-party cookies and users
                    should review the privacy policies of those providers
                    separately.
                  </p>
                </section>

                {/* 03 Similar Technologies */}
                <section id="similar-tech" className="mb-16">
                  <span className="sec-num">03</span>
                  <h2>Similar Technologies</h2>
                  <p>In addition to cookies, blip.money may use:</p>
                  <ul>
                    <li>Local storage.</li>
                    <li>Session storage.</li>
                    <li>Pixels.</li>
                    <li>Web beacons.</li>
                    <li>Device identifiers.</li>
                    <li>Log files.</li>
                  </ul>
                  <p>
                    These technologies serve similar purposes to cookies and help
                    provide, secure, and improve the Services.
                  </p>
                </section>

                {/* 04 How We Use Cookies */}
                <section id="how-we-use" className="mb-16">
                  <span className="sec-num">04</span>
                  <h2>How We Use Cookies</h2>
                  <p>Cookies may be used to:</p>
                  <ul>
                    <li>Operate the Services.</li>
                    <li>Maintain security.</li>
                    <li>Improve website performance.</li>
                    <li>Analyze traffic patterns.</li>
                    <li>Remember user preferences.</li>
                    <li>Diagnose technical issues.</li>
                    <li>Prevent fraud and abuse.</li>
                  </ul>
                  <p>
                    Cookies are not used to access private wallet information or
                    private keys.
                  </p>
                </section>

                {/* 05 Third-Party Analytics */}
                <section id="third-party-analytics" className="mb-16">
                  <span className="sec-num">05</span>
                  <h2>Third-Party Analytics</h2>
                  <p>
                    Blip.money may utilize third-party analytics and
                    infrastructure providers.
                  </p>
                  <p>Such providers may collect:</p>
                  <ul>
                    <li>IP addresses.</li>
                    <li>Device information.</li>
                    <li>Browser type.</li>
                    <li>Session information.</li>
                    <li>Usage patterns.</li>
                  </ul>
                  <p>This information is used solely for:</p>
                  <ul>
                    <li>Performance analysis.</li>
                    <li>Error monitoring.</li>
                    <li>Service improvements.</li>
                    <li>Security purposes.</li>
                  </ul>
                </section>

                {/* 06 Managing Cookies */}
                <section id="managing" className="mb-16">
                  <span className="sec-num">06</span>
                  <h2>Managing Cookies</h2>
                  <p>Most browsers allow users to:</p>
                  <ul>
                    <li>View cookies.</li>
                    <li>Delete cookies.</li>
                    <li>Block cookies.</li>
                    <li>Configure cookie preferences.</li>
                  </ul>
                  <p>Users can manage cookies through browser settings.</p>
                  <p>
                    Blocking certain cookies may affect the availability and
                    functionality of the Services.
                  </p>
                </section>

                {/* 07 Do Not Track Signals */}
                <section id="dnt" className="mb-16">
                  <span className="sec-num">07</span>
                  <h2>Do Not Track Signals</h2>
                  <p>Some browsers transmit "Do Not Track" signals.</p>
                  <p>
                    Because there is currently no universally accepted standard
                    regarding such signals, blip.money may not respond to Do Not
                    Track requests.
                  </p>
                </section>

                {/* 08 Data Retention */}
                <section id="retention" className="mb-16">
                  <span className="sec-num">08</span>
                  <h2>Data Retention</h2>
                  <p>Cookies may remain on your device:</p>

                  <h3>Session Cookies</h3>
                  <p>Deleted automatically when your browser closes.</p>

                  <h3>Persistent Cookies</h3>
                  <p>Remain until:</p>
                  <ul>
                    <li>Expiration periods end.</li>
                    <li>They are manually deleted.</li>
                    <li>Browser settings remove them.</li>
                  </ul>
                  <p>Retention periods may vary depending on their purpose.</p>
                </section>

                {/* 09 Changes to This Cookie Policy */}
                <section id="changes" className="mb-16">
                  <span className="sec-num">09</span>
                  <h2>Changes to This Cookie Policy</h2>
                  <p>
                    Blip.money may update this Cookie Policy from time to time.
                  </p>
                  <p>Changes become effective immediately upon publication.</p>
                  <p>
                    Continued use of the Services after changes are posted
                    constitutes acceptance of the revised Cookie Policy.
                  </p>
                </section>

                {/* 10 Contact Us */}
                <section id="contact" className="mb-16">
                  <span className="sec-num">10</span>
                  <h2>Contact Us</h2>
                  <p>
                    Questions regarding this Cookie Policy may be directed to:
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
                        END OF DOCUMENT · COOKIES POLICY
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

export default Cookies;
