import { useEffect, useState } from "react";
import SEO from "@/components/SEO";

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

const CommunityReputation = () => {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 30;
      const top =
        element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <>
      <SEO canonical="https://www.blip.money/community-reputation" />

      <div className="min-h-screen text-black dark:text-white mt-12">
        {/* Hero Header */}
        <div className="py-8 px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
              Community &amp; Reputation Policy
            </h1>
          </div>
        </div>

        {/* Content Area with Sidebar */}
        <div className="">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="flex gap-16">
              {/* Left Sidebar */}
              <aside className="hidden lg:block w-56 flex-shrink-0">
                <div className="sticky top-24">
                  <p className="text-xs font-bold text-black dark:text-white uppercase tracking-wider mb-4">
                    Contents
                  </p>
                  <nav className="space-y-2">
                    {sections.map((section, index) => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`block text-sm transition-all text-left w-full rounded-md ${
                          activeSection === section.id
                            ? "text-black dark:text-white font-bold bg-black/10 dark:bg-white/10 px-3 py-2"
                            : "text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 px-3 py-2"
                        }`}
                      >
                        {section.id === "introduction"
                          ? section.title
                          : `${index}. ${section.title}`}
                      </button>
                    ))}
                  </nav>
                </div>
              </aside>

              {/* Main Content */}
              <div className="flex-1 max-w-3xl">
                {/* Introduction */}
                <section id="introduction" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">Introduction</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Blip.money is a decentralized peer-to-peer marketplace that
                    relies on trust, transparency, and responsible participation.
                    This Community &amp; Reputation Policy explains how reputation
                    is earned, maintained, and, where appropriate, reduced to help
                    create a safe and reliable marketplace for all users.
                  </p>

                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    By using the Services, you agree to comply with this Policy.
                  </p>
                </section>

                {/* Section 1 */}
                <section id="purpose" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    1. Purpose of the Reputation System
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    The Reputation System is designed to:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Promote honest participation.</li>
                    <li>Reward reliable users.</li>
                    <li>Improve marketplace trust.</li>
                    <li>Reduce fraud.</li>
                    <li>Encourage successful settlements.</li>
                    <li>Protect the community.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Reputation is an indicator of marketplace reliability and
                    does not guarantee future performance or trustworthiness.
                  </p>
                </section>

                {/* Section 2 */}
                <section id="score" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    2. Reputation Score
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Every eligible user may receive a Reputation Score.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    The Reputation Score may consider factors including:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
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
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    The methodology may evolve over time to improve marketplace
                    integrity.
                  </p>
                </section>

                {/* Section 3 */}
                <section id="trust-levels" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">3. Trust Levels</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Users may be assigned trust levels based on overall
                    participation and reputation.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Examples include:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>New</li>
                    <li>Bronze</li>
                    <li>Silver</li>
                    <li>Gold</li>
                    <li>Platinum</li>
                    <li>Elite</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Trust levels are informational only and do not constitute
                    guarantees or endorsements by blip.money.
                  </p>
                </section>

                {/* Section 4 */}
                <section id="earning" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    4. Earning Reputation
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Users may improve their reputation by:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Completing successful transactions.</li>
                    <li>Settling payments promptly.</li>
                    <li>Providing accurate information.</li>
                    <li>Maintaining positive trading behavior.</li>
                    <li>Resolving disputes cooperatively.</li>
                    <li>Following platform policies.</li>
                    <li>Demonstrating consistent activity.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Reputation is earned gradually through responsible
                    participation.
                  </p>
                </section>

                {/* Section 5 */}
                <section id="reductions" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    5. Reputation Reductions
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Reputation may decrease due to:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
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
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Blip.money may investigate unusual activity before taking
                    action.
                  </p>
                </section>

                {/* Section 6 */}
                <section id="fraud-prevention" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    6. Fraud Prevention
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Users must not:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Create fake accounts.</li>
                    <li>Manipulate transaction history.</li>
                    <li>Generate artificial trading volume.</li>
                    <li>Coordinate fake transactions.</li>
                    <li>Purchase or sell accounts.</li>
                    <li>Abuse referral or reward systems.</li>
                    <li>Misrepresent transaction completion.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Such conduct may result in immediate restrictions or
                    permanent removal.
                  </p>
                </section>

                {/* Section 7 */}
                <section id="merchant-reputation" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    7. Merchant Reputation
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Merchants and liquidity providers may receive additional
                    reputation indicators based on:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Settlement consistency.</li>
                    <li>Transaction completion rates.</li>
                    <li>Marketplace participation.</li>
                    <li>Customer satisfaction.</li>
                    <li>Responsiveness.</li>
                    <li>Staking participation.</li>
                    <li>Compliance with marketplace rules.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Merchant reputation may influence marketplace visibility but
                    does not guarantee future performance.
                  </p>
                </section>

                {/* Section 8 */}
                <section id="staking" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    8. Staking and Trust
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Where applicable, merchant staking may contribute to
                    marketplace trust.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Staking may:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Unlock higher participation limits.</li>
                    <li>Improve marketplace visibility.</li>
                    <li>Enable additional merchant features.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Staking does not guarantee:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                    <li>Higher earnings.</li>
                    <li>Priority matching.</li>
                    <li>Preferred treatment.</li>
                    <li>Increased transaction volume.</li>
                  </ul>
                </section>

                {/* Section 9 */}
                <section id="disputes" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">9. Disputes</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Users are encouraged to resolve disputes respectfully and in
                    good faith.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    When reviewing disputes, blip.money may consider:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Transaction records.</li>
                    <li>On-chain activity.</li>
                    <li>Available evidence.</li>
                    <li>Communication history.</li>
                    <li>Marketplace activity.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Blip.money may take reasonable actions to protect marketplace
                    integrity based on available information.
                  </p>
                </section>

                {/* Section 10 */}
                <section id="appeals" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">10. Appeals</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    If a user believes a reputation-related action was applied
                    incorrectly, they may submit an appeal through official
                    support channels.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Submission of an appeal does not guarantee modification or
                    restoration of reputation.
                  </p>
                </section>

                {/* Section 11 */}
                <section id="community-standards" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    11. Community Standards
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Users are expected to:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                    <li>Treat others respectfully.</li>
                    <li>Communicate honestly.</li>
                    <li>Conduct transactions fairly.</li>
                    <li>Avoid abusive behavior.</li>
                    <li>Cooperate during dispute resolution.</li>
                    <li>Report suspicious activity responsibly.</li>
                  </ul>
                </section>

                {/* Section 12 */}
                <section id="prohibited-conduct" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    12. Prohibited Community Conduct
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    The following behaviors are prohibited:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
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

                {/* Section 13 */}
                <section id="integrity" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    13. Marketplace Integrity
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    To maintain a trusted marketplace, blip.money may:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Monitor abnormal activity.</li>
                    <li>Detect suspicious patterns.</li>
                    <li>Restrict abusive behavior.</li>
                    <li>Limit marketplace access.</li>
                    <li>Suspend reputation privileges.</li>
                    <li>Remove fraudulent participants.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Protective actions may be taken without prior notice where
                    necessary to protect users.
                  </p>
                </section>

                {/* Section 14 */}
                <section id="no-guarantee" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">14. No Guarantee</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Reputation scores, trust levels, badges, and marketplace
                    indicators are informational only.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    They do not represent:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Financial guarantees.</li>
                    <li>Endorsements.</li>
                    <li>Creditworthiness.</li>
                    <li>Regulatory approval.</li>
                    <li>Investment quality.</li>
                    <li>Future reliability.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Users should always exercise independent judgment before
                    engaging with any counterparty.
                  </p>
                </section>

                {/* Section 15 */}
                <section id="updates" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    15. Policy Updates
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Blip.money may modify this Policy periodically to improve
                    marketplace security, fairness, and user experience.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Continued use of the Services after updates constitutes
                    acceptance of the revised Policy.
                  </p>
                </section>

                {/* Section 16 */}
                <section id="contact" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">16. Contact</h2>

                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Questions regarding this Community &amp; Reputation Policy may
                    be directed to:
                  </p>

                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    <a
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=community@blip.money"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black dark:text-white underline"
                    >
                      community@blip.money
                    </a>
                  </p>

                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    <a
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=support@blip.money"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black dark:text-white underline"
                    >
                      support@blip.money
                    </a>
                  </p>
                </section>

                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  By participating in the blip.money marketplace, you acknowledge
                  that you have read, understood, and agreed to this Community
                  &amp; Reputation Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommunityReputation;
