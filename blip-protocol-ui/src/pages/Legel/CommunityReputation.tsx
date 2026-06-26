import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";

const ACCENT = "#cc785c";
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

const sections = [
  { id: "introduction", title: "Introduction" },
  { id: "purpose", title: "Purpose of the Reputation System" },
  { id: "score", title: "Reputation Score" },
  { id: "trust-levels", title: "Trust Levels" },
  { id: "earning", title: "Earning Reputation" },
  { id: "reductions", title: "Reputation Reductions" },
  { id: "fraud-prevention", title: "Fraud Prevention" },
  { id: "merchant-reputation", title: "Merchant Reputation" },
  { id: "staking", title: "Staking and Trust" },
  { id: "disputes", title: "Disputes" },
  { id: "appeals", title: "Appeals" },
  { id: "community-standards", title: "Community Standards" },
  { id: "prohibited-conduct", title: "Prohibited Community Conduct" },
  { id: "integrity", title: "Marketplace Integrity" },
  { id: "no-guarantee", title: "No Guarantee" },
  { id: "updates", title: "Policy Updates" },
  { id: "contact", title: "Contact" },
];

const DOC_META = [
  { label: "Document", value: "Community" },
  { label: "Sections", value: "16" },
  { label: "Status", value: "Active" },
  { label: "Updated", value: "May 2026" },
];

const CommunityReputation = ({ tabSlot }: { tabSlot?: ReactNode }) => {
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
      <SEO canonical="https://www.blip.money/community" />

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
                LEGAL · COMMUNITY & REPUTATION POLICY
              </span>
            </div>

            <h1
              className="font-semibold tracking-[-0.035em] leading-[1.02] mb-6"
              style={{ fontSize: "clamp(44px, 10vw, 74px)", color: "#0a0a0a" }}
            >
              Community & Reputation{" "}
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
                        Reputation · Trust · Staking
                        <br />
                        Disputes · Conduct · Integrity
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
                    Blip.money is a decentralized peer-to-peer marketplace that
                    relies on trust, transparency, and responsible participation.
                    This Community &amp; Reputation Policy explains how reputation
                    is earned, maintained, and, where appropriate, reduced to help
                    create a safe and reliable marketplace for all users.
                  </p>
                  <p>
                    By using the Services, you agree to comply with this Policy.
                  </p>
                </section>

                {/* 01 Purpose of the Reputation System */}
                <section id="purpose" className="mb-16">
                  <span className="sec-num">01</span>
                  <h2>Purpose of the Reputation System</h2>
                  <p>The Reputation System is designed to:</p>
                  <ul>
                    <li>Promote honest participation.</li>
                    <li>Reward reliable users.</li>
                    <li>Improve marketplace trust.</li>
                    <li>Reduce fraud.</li>
                    <li>Encourage successful settlements.</li>
                    <li>Protect the community.</li>
                  </ul>
                  <p>
                    Reputation is an indicator of marketplace reliability and
                    does not guarantee future performance or trustworthiness.
                  </p>
                </section>

                {/* 02 Reputation Score */}
                <section id="score" className="mb-16">
                  <span className="sec-num">02</span>
                  <h2>Reputation Score</h2>
                  <p>Every eligible user may receive a Reputation Score.</p>
                  <p>The Reputation Score may consider factors including:</p>
                  <ul>
                    <li>Successful transaction history.</li>
                    <li>Number of completed trades.</li>
                    <li>Settlement reliability.</li>
                    <li>Transaction volume.</li>
                    <li>Account longevity.</li>
                    <li>Merchant staking status.</li>
                    <li>Community feedback.</li>
                    <li>Verified account features.</li>
                    <li>Fraud reports.</li>
                    <li>Dispute outcomes.</li>
                  </ul>
                  <p>
                    The methodology may evolve over time to improve marketplace
                    integrity.
                  </p>
                </section>

                {/* 03 Trust Levels */}
                <section id="trust-levels" className="mb-16">
                  <span className="sec-num">03</span>
                  <h2>Trust Levels</h2>
                  <p>
                    Users may be assigned trust levels based on overall
                    participation and reputation.
                  </p>
                  <p>Examples include:</p>
                  <ul>
                    <li>New</li>
                    <li>Bronze</li>
                    <li>Silver</li>
                    <li>Gold</li>
                    <li>Platinum</li>
                    <li>Elite</li>
                  </ul>
                  <p>
                    Trust levels are informational only and do not constitute
                    guarantees or endorsements by blip.money.
                  </p>
                </section>

                {/* 04 Earning Reputation */}
                <section id="earning" className="mb-16">
                  <span className="sec-num">04</span>
                  <h2>Earning Reputation</h2>
                  <p>Users may improve their reputation by:</p>
                  <ul>
                    <li>Completing successful transactions.</li>
                    <li>Settling payments promptly.</li>
                    <li>Providing accurate information.</li>
                    <li>Maintaining positive trading behavior.</li>
                    <li>Resolving disputes cooperatively.</li>
                    <li>Following platform policies.</li>
                    <li>Demonstrating consistent activity.</li>
                  </ul>
                  <p>
                    Reputation is earned gradually through responsible
                    participation.
                  </p>
                </section>

                {/* 05 Reputation Reductions */}
                <section id="reductions" className="mb-16">
                  <span className="sec-num">05</span>
                  <h2>Reputation Reductions</h2>
                  <p>Reputation may decrease due to:</p>
                  <ul>
                    <li>Failed settlements.</li>
                    <li>Payment reversals or chargebacks.</li>
                    <li>Fraudulent conduct.</li>
                    <li>Abuse of the marketplace.</li>
                    <li>False confirmations.</li>
                    <li>Manipulation of trading activity.</li>
                    <li>Repeated transaction cancellations.</li>
                    <li>Violations of platform policies.</li>
                    <li>Security-related incidents.</li>
                    <li>Abuse of merchants or counterparties.</li>
                  </ul>
                  <p>
                    Blip.money may investigate unusual activity before taking
                    action.
                  </p>
                </section>

                {/* 06 Fraud Prevention */}
                <section id="fraud-prevention" className="mb-16">
                  <span className="sec-num">06</span>
                  <h2>Fraud Prevention</h2>
                  <p>Users must not:</p>
                  <ul>
                    <li>Create fake accounts.</li>
                    <li>Manipulate transaction history.</li>
                    <li>Generate artificial trading volume.</li>
                    <li>Coordinate fake transactions.</li>
                    <li>Purchase or sell accounts.</li>
                    <li>Abuse referral or reward systems.</li>
                    <li>Misrepresent transaction completion.</li>
                  </ul>
                  <p>
                    Such conduct may result in immediate restrictions or
                    permanent removal.
                  </p>
                </section>

                {/* 07 Merchant Reputation */}
                <section id="merchant-reputation" className="mb-16">
                  <span className="sec-num">07</span>
                  <h2>Merchant Reputation</h2>
                  <p>
                    Merchants and liquidity providers may receive additional
                    reputation indicators based on:
                  </p>
                  <ul>
                    <li>Settlement consistency.</li>
                    <li>Transaction completion rates.</li>
                    <li>Marketplace participation.</li>
                    <li>Customer satisfaction.</li>
                    <li>Responsiveness.</li>
                    <li>Staking participation.</li>
                    <li>Compliance with marketplace rules.</li>
                  </ul>
                  <p>
                    Merchant reputation may influence marketplace visibility but
                    does not guarantee future performance.
                  </p>
                </section>

                {/* 08 Staking and Trust */}
                <section id="staking" className="mb-16">
                  <span className="sec-num">08</span>
                  <h2>Staking and Trust</h2>
                  <p>
                    Where applicable, merchant staking may contribute to
                    marketplace trust.
                  </p>
                  <p>Staking may:</p>
                  <ul>
                    <li>Unlock higher participation limits.</li>
                    <li>Improve marketplace visibility.</li>
                    <li>Enable additional merchant features.</li>
                  </ul>
                  <p>Staking does not guarantee:</p>
                  <ul>
                    <li>Higher earnings.</li>
                    <li>Priority matching.</li>
                    <li>Preferred treatment.</li>
                    <li>Increased transaction volume.</li>
                  </ul>
                </section>

                {/* 09 Disputes */}
                <section id="disputes" className="mb-16">
                  <span className="sec-num">09</span>
                  <h2>Disputes</h2>
                  <p>
                    Users are encouraged to resolve disputes respectfully and in
                    good faith.
                  </p>
                  <p>When reviewing disputes, blip.money may consider:</p>
                  <ul>
                    <li>Transaction records.</li>
                    <li>On-chain activity.</li>
                    <li>Available evidence.</li>
                    <li>Communication history.</li>
                    <li>Marketplace activity.</li>
                  </ul>
                  <p>
                    Blip.money may take reasonable actions to protect marketplace
                    integrity based on available information.
                  </p>
                </section>

                {/* 10 Appeals */}
                <section id="appeals" className="mb-16">
                  <span className="sec-num">10</span>
                  <h2>Appeals</h2>
                  <p>
                    If a user believes a reputation-related action was applied
                    incorrectly, they may submit an appeal through official
                    support channels.
                  </p>
                  <p>
                    Submission of an appeal does not guarantee modification or
                    restoration of reputation.
                  </p>
                </section>

                {/* 11 Community Standards */}
                <section id="community-standards" className="mb-16">
                  <span className="sec-num">11</span>
                  <h2>Community Standards</h2>
                  <p>Users are expected to:</p>
                  <ul>
                    <li>Treat others respectfully.</li>
                    <li>Communicate honestly.</li>
                    <li>Conduct transactions fairly.</li>
                    <li>Avoid abusive behavior.</li>
                    <li>Cooperate during dispute resolution.</li>
                    <li>Report suspicious activity responsibly.</li>
                  </ul>
                </section>

                {/* 12 Prohibited Community Conduct */}
                <section id="prohibited-conduct" className="mb-16">
                  <span className="sec-num">12</span>
                  <h2>Prohibited Community Conduct</h2>
                  <p>The following behaviors are prohibited:</p>
                  <ul>
                    <li>Harassment.</li>
                    <li>Hate speech.</li>
                    <li>Threats.</li>
                    <li>Impersonation.</li>
                    <li>Spam.</li>
                    <li>Fraud.</li>
                    <li>Market manipulation.</li>
                    <li>Reputation manipulation.</li>
                    <li>Fake reviews.</li>
                    <li>Coordinated abuse.</li>
                    <li>False reporting.</li>
                    <li>Bribery or coercion of counterparties.</li>
                  </ul>
                </section>

                {/* 13 Marketplace Integrity */}
                <section id="integrity" className="mb-16">
                  <span className="sec-num">13</span>
                  <h2>Marketplace Integrity</h2>
                  <p>To maintain a trusted marketplace, blip.money may:</p>
                  <ul>
                    <li>Monitor abnormal activity.</li>
                    <li>Detect suspicious patterns.</li>
                    <li>Restrict abusive behavior.</li>
                    <li>Limit marketplace access.</li>
                    <li>Suspend reputation privileges.</li>
                    <li>Remove fraudulent participants.</li>
                  </ul>
                  <p>
                    Protective actions may be taken without prior notice where
                    necessary to protect users.
                  </p>
                </section>

                {/* 14 No Guarantee */}
                <section id="no-guarantee" className="mb-16">
                  <span className="sec-num">14</span>
                  <h2>No Guarantee</h2>
                  <p>
                    Reputation scores, trust levels, badges, and marketplace
                    indicators are informational only.
                  </p>
                  <p>They do not represent:</p>
                  <ul>
                    <li>Financial guarantees.</li>
                    <li>Endorsements.</li>
                    <li>Creditworthiness.</li>
                    <li>Regulatory approval.</li>
                    <li>Investment quality.</li>
                    <li>Future reliability.</li>
                  </ul>
                  <p>
                    Users should always exercise independent judgment before
                    engaging with any counterparty.
                  </p>
                </section>

                {/* 15 Policy Updates */}
                <section id="updates" className="mb-16">
                  <span className="sec-num">15</span>
                  <h2>Policy Updates</h2>
                  <p>
                    Blip.money may modify this Policy periodically to improve
                    marketplace security, fairness, and user experience.
                  </p>
                  <p>
                    Continued use of the Services after updates constitutes
                    acceptance of the revised Policy.
                  </p>
                </section>

                {/* 16 Contact */}
                <section id="contact" className="mb-16">
                  <span className="sec-num">16</span>
                  <h2>Contact</h2>
                  <p>
                    Questions regarding this Community &amp; Reputation Policy may
                    be directed to:
                  </p>
                  <p>
                    <a
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=community@blip.money"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      community@blip.money
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
                    By participating in the blip.money marketplace, you acknowledge
                    that you have read, understood, and agreed to this Community
                    &amp; Reputation Policy.
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
                        END OF DOCUMENT · COMMUNITY & REPUTATION POLICY
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

export default CommunityReputation;
