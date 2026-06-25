import { useEffect, useState } from "react";
import SEO from "@/components/SEO";

const sections = [
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

const MerchantLiquidityTerms = () => {
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
      <SEO canonical="https://www.blip.money/merchant-liquidity-terms" />

      <div className="min-h-screen text-black dark:text-white mt-12">
        {/* Hero Header */}
        <div className="py-8 px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
              Merchant &amp; Liquidity Provider Terms
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
                        {index + 1}. {section.title}
                      </button>
                    ))}
                  </nav>
                </div>
              </aside>

              {/* Main Content */}
              <div className="flex-1 max-w-3xl">
                {/* Intro */}
                <p className="text-black dark:text-white mb-2 font-medium">
                  IMPORTANT NOTICE
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  These Merchant &amp; Liquidity Provider Terms ("Merchant
                  Terms") govern participation by merchants, liquidity providers,
                  and marketplace participants ("Participants") utilizing the
                  BLIP.money platform and related Services.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
                  By acting as a merchant or liquidity provider, you acknowledge
                  that you act independently and assume all risks associated with
                  your activities.
                </p>

                {/* Section 1 */}
                <section id="independent" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    1. Independent Participation
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Participants acknowledge that:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>They participate voluntarily.</li>
                    <li>They are independent users.</li>
                    <li>
                      They are not employees, agents, contractors,
                      representatives, or partners of Blip.money.
                    </li>
                    <li>
                      No employment or agency relationship exists between
                      Blip.money and any Participant.
                    </li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Blip.money merely provides software interfaces and
                    marketplace infrastructure.
                  </p>
                </section>

                {/* Section 2 */}
                <section id="no-guarantee" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    2. No Guarantee of Volume or Profits
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Blip.money does not guarantee:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Trading volume.</li>
                    <li>Earnings.</li>
                    <li>Profitability.</li>
                    <li>User activity.</li>
                    <li>Transaction frequency.</li>
                    <li>Business opportunities.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Participation may result in financial losses.
                  </p>
                </section>

                {/* Section 3 */}
                <section id="responsibilities" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    3. Merchant Responsibilities
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Participants are solely responsible for:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Their activities.</li>
                    <li>Their counterparties.</li>
                    <li>Compliance with applicable laws.</li>
                    <li>Tax reporting.</li>
                    <li>Banking relationships.</li>
                    <li>Fund management.</li>
                    <li>Security practices.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Blip.money does not supervise or manage merchant operations.
                  </p>
                </section>

                {/* Section 4 */}
                <section id="fiat" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    4. Fiat Settlements
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    All fiat settlements occur directly between participants.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Blip.money:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Does not hold fiat balances.</li>
                    <li>Does not process bank transfers.</li>
                    <li>Does not guarantee payments.</li>
                    <li>Does not verify settlement completion.</li>
                    <li>Does not participate in fiat transfers.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Users bear all risks associated with fiat transactions.
                  </p>
                </section>

                {/* Section 5 */}
                <section id="counterparty" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    5. Counterparty Risk
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Participants acknowledge that:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Counterparties may default.</li>
                    <li>Fraud may occur.</li>
                    <li>Delays may arise.</li>
                    <li>Chargebacks may happen.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Blip.money does not guarantee:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                    <li>Counterparty performance.</li>
                    <li>Payment completion.</li>
                    <li>Recovery of losses.</li>
                  </ul>
                </section>

                {/* Section 6 */}
                <section id="compliance" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    6. Compliance Responsibilities
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Participants are solely responsible for ensuring compliance
                    with all laws applicable to them.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    This includes:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Tax obligations.</li>
                    <li>Reporting requirements.</li>
                    <li>Licensing obligations.</li>
                    <li>Record keeping.</li>
                    <li>Anti-money laundering obligations.</li>
                    <li>Sanctions compliance.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Blip.money does not provide legal or regulatory advice.
                  </p>
                </section>

                {/* Section 7 */}
                <section id="bank-risks" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    7. Bank Account Risks
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Participants acknowledge that banks may:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Restrict accounts.</li>
                    <li>Freeze balances.</li>
                    <li>Delay transfers.</li>
                    <li>Conduct reviews.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Blip.money has no control over banking institutions and
                    assumes no liability for banking actions.
                  </p>
                </section>

                {/* Section 8 */}
                <section id="fraud" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    8. Fraud Prevention
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Participants agree:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Not to engage in fraud.</li>
                    <li>Not to use stolen funds.</li>
                    <li>Not to conduct deceptive activities.</li>
                    <li>Not to impersonate others.</li>
                    <li>Not to manipulate reputation systems.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Blip.money reserves the right to suspend or restrict users
                    engaged in harmful conduct.
                  </p>
                </section>

                {/* Section 9 */}
                <section id="reputation" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    9. Reputation System
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Blip.money may maintain reputation mechanisms to encourage
                    marketplace integrity.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Reputation may be influenced by:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Successful settlements.</li>
                    <li>Transaction history.</li>
                    <li>Counterparty feedback.</li>
                    <li>Fraud reports.</li>
                    <li>Appeals and disputes.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Blip.money reserves discretion to:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Reduce scores.</li>
                    <li>Suspend privileges.</li>
                    <li>Restrict access.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Such actions may be taken to protect users and maintain
                    marketplace integrity.
                  </p>
                </section>

                {/* Section 10 */}
                <section id="staking" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">10. Staking</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Certain merchant privileges may require staking.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Participants acknowledge that:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Staked assets may fluctuate in value.</li>
                    <li>Staking does not guarantee profits.</li>
                    <li>Staking does not create ownership rights.</li>
                    <li>Staking requirements may change.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Blip.money may suspend privileges associated with staking if
                    misuse or abuse is detected.
                  </p>
                </section>

                {/* Section 11 */}
                <section id="security" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    11. Security Responsibilities
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Participants are responsible for:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Wallet security.</li>
                    <li>Private keys.</li>
                    <li>Device protection.</li>
                    <li>Password management.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Blip.money cannot recover:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                    <li>Wallets.</li>
                    <li>Seed phrases.</li>
                    <li>Private keys.</li>
                    <li>Lost funds.</li>
                  </ul>
                </section>

                {/* Section 12 */}
                <section id="tax" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    12. Tax Obligations
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Participants are solely responsible for:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Income taxes.</li>
                    <li>Capital gains taxes.</li>
                    <li>Sales taxes.</li>
                    <li>Reporting requirements.</li>
                    <li>Filing obligations.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Blip.money neither calculates nor reports taxes on behalf of
                    participants.
                  </p>
                </section>

                {/* Section 13 */}
                <section id="no-advice" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    13. No Financial Advice
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Nothing provided by Blip.money constitutes:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Financial advice.</li>
                    <li>Investment advice.</li>
                    <li>Legal advice.</li>
                    <li>Tax advice.</li>
                    <li>Accounting advice.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Participants should consult qualified professionals when
                    appropriate.
                  </p>
                </section>

                {/* Section 14 */}
                <section id="suspension" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    14. Suspension and Termination
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Blip.money may restrict, suspend, or terminate access where
                    necessary to:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Protect users.</li>
                    <li>Prevent abuse.</li>
                    <li>Preserve marketplace integrity.</li>
                    <li>Address security concerns.</li>
                    <li>Comply with legal obligations.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Termination does not relieve Participants of obligations
                    incurred before termination.
                  </p>
                </section>

                {/* Section 15 */}
                <section id="liability" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    15. Limitation of Liability
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    To the maximum extent permitted by applicable law, Blip.money
                    shall not be liable for:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Fraud committed by counterparties.</li>
                    <li>Frozen bank accounts.</li>
                    <li>Chargebacks.</li>
                    <li>Delayed payments.</li>
                    <li>Regulatory actions.</li>
                    <li>Lost profits.</li>
                    <li>Lost opportunities.</li>
                    <li>Consequential damages.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Participants assume all risks associated with their
                    activities.
                  </p>
                </section>

                {/* Section 16 */}
                <section id="risk" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    16. Assumption of Risk
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Participants acknowledge that:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                    <li>They act voluntarily.</li>
                    <li>They understand the risks involved.</li>
                    <li>They accept full responsibility for their activities.</li>
                    <li>
                      They release Blip.money from liability to the maximum
                      extent permitted by applicable law.
                    </li>
                  </ul>
                </section>

                {/* Section 17 */}
                <section id="changes" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    17. Changes to These Terms
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Blip.money reserves the right to modify these Merchant Terms
                    at any time.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Continued participation constitutes acceptance of any revised
                    terms.
                  </p>
                </section>

                {/* Section 18 */}
                <section id="contact" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">18. Contact</h2>

                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Questions regarding these Merchant Terms may be directed to:
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
                  By participating as a merchant or liquidity provider, you
                  acknowledge that you have read, understood, and agreed to these
                  Merchant &amp; Liquidity Provider Terms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MerchantLiquidityTerms;
