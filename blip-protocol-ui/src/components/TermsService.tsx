import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import SEO from "./SEO";

const ACCENT = "#cc785c";
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

const sections = [
  { id: "important-notice", title: "Important Notice" },
  { id: "acceptance", title: "Acceptance of Terms" },
  { id: "nature", title: "Nature of blip.money" },
  { id: "non-custodial", title: "Non-Custodial Services" },
  { id: "marketplace", title: "Marketplace Model" },
  { id: "responsibilities", title: "User Responsibilities" },
  { id: "prohibited", title: "Prohibited Activities" },
  { id: "reputation", title: "Reputation System" },
  { id: "merchants", title: "Merchants and Liquidity Providers" },
  { id: "fees", title: "Fees" },
  { id: "risk", title: "Risk Disclosures" },
  { id: "warranties", title: "No Warranties" },
  { id: "liability", title: "Limitation of Liability" },
  { id: "ip", title: "Intellectual Property" },
  { id: "modifications", title: "Modifications" },
  { id: "termination", title: "Termination" },
  { id: "force-majeure", title: "Force Majeure" },
  { id: "entire-agreement", title: "Entire Agreement" },
  { id: "contact", title: "Contact" },
];

const DOC_META = [
  { label: "Document", value: "Terms" },
  { label: "Sections", value: "18" },
  { label: "Status", value: "Active" },
  { label: "Updated", value: "May 2026" },
];

const TermsService = ({ tabSlot }: { tabSlot?: ReactNode }) => {
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
      <SEO canonical="https://www.blip.money/terms" />

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
                LEGAL · TERMS OF SERVICE
              </span>
            </div>

            <h1
              className="font-semibold tracking-[-0.035em] leading-[1.02] mb-6"
              style={{ fontSize: "clamp(44px, 10vw, 74px)", color: "#0a0a0a" }}
            >
              Terms of{" "}
              <span
                style={{
                  color: ACCENT,
                  fontStyle: "italic",
                  fontWeight: 500,
                  fontFamily: "ui-serif, Georgia, serif",
                }}
              >
                Service.
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
                        Acceptance · Custody · Marketplace
                        <br />
                        Fees · Risk · Liability
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
                  <p>
                    Blip.money is a decentralized protocol interface and
                    marketplace that facilitates interactions between users and
                    independent participants. Blip.money is not a bank, financial
                    institution, money transmitter, payment processor, broker,
                    investment advisor, or custodian of assets. By accessing or
                    using the Services, you acknowledge and accept the risks
                    associated with blockchain technology, digital assets, and
                    peer-to-peer transactions.
                  </p>
                </section>

                {/* 01 Acceptance of Terms */}
                <section id="acceptance" className="mb-16">
                  <span className="sec-num">01</span>
                  <h2>Acceptance of Terms</h2>
                  <p>
                    These Terms of Service ("Terms") govern your access to and
                    use of the blip.money website, applications, interfaces,
                    software, APIs, smart contracts, and related services
                    (collectively, the "Services").
                  </p>
                  <p>
                    By accessing or using the Services, you acknowledge that:
                  </p>
                  <ul>
                    <li>You are at least eighteen (18) years old.</li>
                    <li>
                      You have the legal capacity to enter into binding
                      agreements.
                    </li>
                    <li>
                      You understand the risks associated with digital assets
                      and blockchain technology.
                    </li>
                    <li>
                      You agree to comply with all applicable laws and
                      regulations.
                    </li>
                    <li>You agree to be bound by these Terms.</li>
                  </ul>
                  <p>
                    If you do not agree with these Terms, you must discontinue
                    using the Services immediately.
                  </p>
                </section>

                {/* 02 Nature of blip.money */}
                <section id="nature" className="mb-16">
                  <span className="sec-num">02</span>
                  <h2>Nature of blip.money</h2>
                  <p>
                    Blip.money provides software interfaces and tools that enable
                    users to participate in a decentralized peer-to-peer
                    marketplace and settlement protocol.
                  </p>
                  <p>Blip.money:</p>
                  <ul>
                    <li>Does not hold customer funds.</li>
                    <li>Does not maintain custody of digital assets.</li>
                    <li>Does not control private keys.</li>
                    <li>Does not execute trades on behalf of users.</li>
                    <li>Does not guarantee transaction completion.</li>
                    <li>
                      Does not act as a money transmitter or financial
                      intermediary.
                    </li>
                    <li>Does not provide banking services.</li>
                    <li>
                      Does not provide investment, legal, accounting, or tax
                      advice.
                    </li>
                  </ul>
                  <p>
                    Transactions occur directly between users and independent
                    participants.
                  </p>
                </section>

                {/* 03 Non-Custodial Services */}
                <section id="non-custodial" className="mb-16">
                  <span className="sec-num">03</span>
                  <h2>Non-Custodial Services</h2>
                  <p>
                    Users retain sole control over their wallets and private
                    keys.
                  </p>
                  <p>Blip.money cannot:</p>
                  <ul>
                    <li>Access user funds.</li>
                    <li>Recover lost wallets.</li>
                    <li>Reverse transactions.</li>
                    <li>Freeze assets.</li>
                    <li>Retrieve private keys.</li>
                  </ul>
                  <p>You are solely responsible for:</p>
                  <ul>
                    <li>Wallet security.</li>
                    <li>Backup procedures.</li>
                    <li>Password management.</li>
                    <li>Device security.</li>
                    <li>Private key protection.</li>
                  </ul>
                  <p>
                    Loss of access credentials may result in permanent loss of
                    digital assets.
                  </p>
                </section>

                {/* 04 Marketplace Model */}
                <section id="marketplace" className="mb-16">
                  <span className="sec-num">04</span>
                  <h2>Marketplace Model</h2>
                  <p>
                    Blip.money operates as a decentralized marketplace and
                    coordination layer.
                  </p>
                  <p>Blip.money does not:</p>
                  <ul>
                    <li>Buy or sell digital assets.</li>
                    <li>Provide liquidity.</li>
                    <li>Match orders as principal.</li>
                    <li>Participate in fiat settlements.</li>
                    <li>Guarantee payment obligations.</li>
                  </ul>
                  <p>
                    Users interact directly with independent counterparties at
                    their own risk.
                  </p>
                </section>

                {/* 05 User Responsibilities */}
                <section id="responsibilities" className="mb-16">
                  <span className="sec-num">05</span>
                  <h2>User Responsibilities</h2>
                  <p>
                    By using the Services, you represent and warrant that:
                  </p>
                  <ul>
                    <li>All information provided is accurate.</li>
                    <li>You are acting on your own behalf.</li>
                    <li>
                      You understand the risks associated with digital assets.
                    </li>
                    <li>You are solely responsible for your actions.</li>
                    <li>You will comply with all applicable laws.</li>
                  </ul>
                  <p>
                    You are responsible for determining whether the use of
                    digital assets is lawful in your jurisdiction.
                  </p>
                </section>

                {/* 06 Prohibited Activities */}
                <section id="prohibited" className="mb-16">
                  <span className="sec-num">06</span>
                  <h2>Prohibited Activities</h2>
                  <p>Users shall not:</p>
                  <ul>
                    <li>Engage in fraud or deceptive practices.</li>
                    <li>Conduct money laundering activities.</li>
                    <li>Finance terrorism or sanctioned entities.</li>
                    <li>Use stolen funds or stolen assets.</li>
                    <li>Exploit vulnerabilities or smart contracts.</li>
                    <li>Introduce malware or harmful software.</li>
                    <li>Interfere with network operations.</li>
                    <li>Circumvent security mechanisms.</li>
                    <li>Violate intellectual property rights.</li>
                    <li>Impersonate another person or entity.</li>
                    <li>Manipulate reputation systems.</li>
                    <li>Conduct unlawful activities.</li>
                  </ul>
                  <p>
                    Blip.money reserves the right to restrict access to users
                    engaged in harmful or prohibited conduct.
                  </p>
                </section>

                {/* 07 Reputation System */}
                <section id="reputation" className="mb-16">
                  <span className="sec-num">07</span>
                  <h2>Reputation System</h2>
                  <p>
                    Blip.money may maintain reputation mechanisms to promote
                    trust and marketplace integrity.
                  </p>
                  <p>Reputation scores may be influenced by:</p>
                  <ul>
                    <li>Successful transaction history.</li>
                    <li>Disputes and appeals.</li>
                    <li>Fraud reports.</li>
                    <li>Counterparty feedback.</li>
                    <li>Merchant staking and participation.</li>
                  </ul>
                  <p>
                    Blip.money reserves the right to suspend, limit, or remove
                    reputation privileges to protect users and maintain
                    marketplace integrity.
                  </p>
                </section>

                {/* 08 Merchants and Liquidity Providers */}
                <section id="merchants" className="mb-16">
                  <span className="sec-num">08</span>
                  <h2>Merchants and Liquidity Providers</h2>
                  <p>
                    Merchants and liquidity providers participate independently.
                  </p>
                  <p>Blip.money:</p>
                  <ul>
                    <li>Does not employ merchants.</li>
                    <li>Does not guarantee merchant performance.</li>
                    <li>Does not supervise transactions.</li>
                    <li>Does not guarantee profitability.</li>
                    <li>Does not verify bank accounts or payment methods.</li>
                  </ul>
                  <p>
                    Merchants and liquidity providers are solely responsible for:
                  </p>
                  <ul>
                    <li>Compliance with applicable laws.</li>
                    <li>Tax obligations.</li>
                    <li>Reporting requirements.</li>
                    <li>Anti-money laundering obligations.</li>
                    <li>Counterparty risk.</li>
                  </ul>
                  <p>
                    Any risks associated with frozen bank accounts, chargebacks,
                    fraud, or regulatory actions are borne solely by
                    participants.
                  </p>
                </section>

                {/* 09 Fees */}
                <section id="fees" className="mb-16">
                  <span className="sec-num">09</span>
                  <h2>Fees</h2>
                  <p>Blip.money may charge protocol or marketplace fees.</p>
                  <p>Fees:</p>
                  <ul>
                    <li>May change without notice.</li>
                    <li>Are generally non-refundable.</li>
                    <li>
                      May vary depending on network conditions and transaction
                      size.
                    </li>
                  </ul>
                  <p>
                    Blockchain network fees are determined independently by
                    underlying networks and are outside blip.money's control.
                  </p>
                </section>

                {/* 10 Risk Disclosures */}
                <section id="risk" className="mb-16">
                  <span className="sec-num">10</span>
                  <h2>Risk Disclosures</h2>
                  <p>
                    Digital assets involve substantial risks, including:
                  </p>
                  <ul>
                    <li>Volatility.</li>
                    <li>Stablecoin de-pegging.</li>
                    <li>Smart contract vulnerabilities.</li>
                    <li>Network congestion.</li>
                    <li>Counterparty risk.</li>
                    <li>Regulatory uncertainty.</li>
                    <li>Loss of private keys.</li>
                    <li>Cybersecurity attacks.</li>
                    <li>Software bugs.</li>
                    <li>Blockchain forks.</li>
                    <li>Permanent loss of assets.</li>
                  </ul>
                  <p>Past performance does not guarantee future results.</p>
                  <p>
                    Users assume all risks associated with their use of the
                    Services.
                  </p>
                </section>

                {/* 11 No Warranties */}
                <section id="warranties" className="mb-16">
                  <span className="sec-num">11</span>
                  <h2>No Warranties</h2>
                  <p>
                    The Services are provided on an "AS IS" and "AS AVAILABLE"
                    basis.
                  </p>
                  <p>
                    Blip.money makes no representations or warranties regarding:
                  </p>
                  <ul>
                    <li>Availability.</li>
                    <li>Accuracy.</li>
                    <li>Reliability.</li>
                    <li>Security.</li>
                    <li>Performance.</li>
                    <li>Fitness for any particular purpose.</li>
                  </ul>
                  <p>
                    Blip.money does not guarantee uninterrupted access to the
                    Services.
                  </p>
                </section>

                {/* 12 Limitation of Liability */}
                <section id="liability" className="mb-16">
                  <span className="sec-num">12</span>
                  <h2>Limitation of Liability</h2>
                  <p>
                    To the maximum extent permitted by law, blip.money and its
                    affiliates shall not be liable for:
                  </p>
                  <ul>
                    <li>Loss of funds.</li>
                    <li>Loss of profits.</li>
                    <li>Loss of revenue.</li>
                    <li>Loss of opportunity.</li>
                    <li>Loss of reputation.</li>
                    <li>Data loss.</li>
                    <li>Smart contract failures.</li>
                    <li>Network disruptions.</li>
                    <li>Third-party actions.</li>
                    <li>
                      Indirect, incidental, consequential, or punitive damages.
                    </li>
                  </ul>
                  <p>Users assume all risks arising from use of the Services.</p>
                </section>

                {/* 13 Intellectual Property */}
                <section id="ip" className="mb-16">
                  <span className="sec-num">13</span>
                  <h2>Intellectual Property</h2>
                  <p>
                    All software, trademarks, logos, content, interfaces,
                    designs, and materials associated with blip.money are
                    protected by intellectual property laws.
                  </p>
                  <p>Users may not:</p>
                  <ul>
                    <li>Copy.</li>
                    <li>Modify.</li>
                    <li>Distribute.</li>
                    <li>Reverse engineer.</li>
                    <li>Create derivative works.</li>
                  </ul>
                  <p>Without prior written permission.</p>
                </section>

                {/* 14 Modifications */}
                <section id="modifications" className="mb-16">
                  <span className="sec-num">14</span>
                  <h2>Modifications</h2>
                  <p>
                    Blip.money reserves the right to modify these Terms or any
                    aspect of the Services at any time.
                  </p>
                  <p>
                    Continued use of the Services constitutes acceptance of
                    revised Terms.
                  </p>
                </section>

                {/* 15 Termination */}
                <section id="termination" className="mb-16">
                  <span className="sec-num">15</span>
                  <h2>Termination</h2>
                  <p>Blip.money may suspend or restrict access in order to:</p>
                  <ul>
                    <li>Protect users.</li>
                    <li>Preserve system integrity.</li>
                    <li>Prevent fraud.</li>
                    <li>Address abuse.</li>
                    <li>Comply with legal obligations.</li>
                  </ul>
                  <p>
                    Termination does not affect obligations incurred before
                    termination.
                  </p>
                </section>

                {/* 16 Force Majeure */}
                <section id="force-majeure" className="mb-16">
                  <span className="sec-num">16</span>
                  <h2>Force Majeure</h2>
                  <p>
                    Blip.money shall not be liable for delays, interruptions, or
                    failures caused by:
                  </p>
                  <ul>
                    <li>Internet outages.</li>
                    <li>Government actions.</li>
                    <li>Regulatory changes.</li>
                    <li>Wars.</li>
                    <li>Natural disasters.</li>
                    <li>Cyber attacks.</li>
                    <li>Blockchain failures.</li>
                    <li>Third-party infrastructure disruptions.</li>
                    <li>Events beyond reasonable control.</li>
                  </ul>
                </section>

                {/* 17 Entire Agreement */}
                <section id="entire-agreement" className="mb-16">
                  <span className="sec-num">17</span>
                  <h2>Entire Agreement</h2>
                  <p>
                    These Terms constitute the entire agreement between you and
                    blip.money regarding the Services and supersede all prior
                    understandings and communications.
                  </p>
                </section>

                {/* 18 Contact */}
                <section id="contact" className="mb-16">
                  <span className="sec-num">18</span>
                  <h2>Contact</h2>
                  <p>
                    Questions regarding these Terms may be directed to:
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
                        END OF DOCUMENT · TERMS OF SERVICE
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

export default TermsService;
