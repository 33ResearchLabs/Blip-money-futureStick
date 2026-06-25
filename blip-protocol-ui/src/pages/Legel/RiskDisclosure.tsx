import { useEffect, useState } from "react";
import SEO from "@/components/SEO";

const sections = [
  { id: "no-guarantee", title: "No Guarantee of Profits" },
  { id: "market", title: "Market Risk" },
  { id: "stablecoin", title: "Stablecoin Risk" },
  { id: "counterparty", title: "Counterparty Risk" },
  { id: "smart-contract", title: "Smart Contract Risk" },
  { id: "blockchain", title: "Blockchain Risk" },
  { id: "private-key", title: "Private Key Risk" },
  { id: "cybersecurity", title: "Cybersecurity Risk" },
  { id: "regulatory", title: "Regulatory Risk" },
  { id: "liquidity", title: "Liquidity Risk" },
  { id: "third-party", title: "Third-Party Risk" },
  { id: "fiat", title: "Fiat Settlement Risk" },
  { id: "bank", title: "Bank Account Risk" },
  { id: "technical", title: "Technical Failure Risk" },
  { id: "force-majeure", title: "Force Majeure" },
  { id: "tax", title: "Tax Risk" },
  { id: "no-advice", title: "No Investment Advice" },
  { id: "risk-assumption", title: "Assumption of Risk" },
  { id: "liability", title: "Limitation of Liability" },
  { id: "acknowledgement", title: "Acknowledgement" },
];

const RiskDisclosure = () => {
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
      <SEO canonical="https://www.blip.money/risk-disclosure" />

      <div className="min-h-screen text-black dark:text-white mt-12">
        {/* Hero Header */}
        <div className="py-8 px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
              Risk Disclosure Statement
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
                  Digital assets, blockchain technologies, peer-to-peer
                  transactions, and decentralized systems involve significant
                  risks. Before accessing or using BLIP.money ("Blip.money",
                  "we", "our", or "us"), you should carefully read and understand
                  this Risk Disclosure Statement.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
                  By using the Services, you acknowledge that you understand and
                  accept the risks described herein and assume full
                  responsibility for your activities.
                </p>

                {/* Section 1 */}
                <section id="no-guarantee" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    1. No Guarantee of Profits
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Participation in digital asset markets may result in:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Partial loss of capital.</li>
                    <li>Total loss of capital.</li>
                    <li>Unrealized gains.</li>
                    <li>Reduced purchasing power.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Past performance does not guarantee future results.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Blip.money does not guarantee profits, returns, or successful
                    transactions.
                  </p>
                </section>

                {/* Section 2 */}
                <section id="market" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">2. Market Risk</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Digital assets are highly volatile.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Prices may fluctuate rapidly due to:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Market sentiment.</li>
                    <li>Regulatory developments.</li>
                    <li>Liquidity conditions.</li>
                    <li>Macroeconomic events.</li>
                    <li>Geopolitical events.</li>
                    <li>Technological changes.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    You may lose some or all of your assets.
                  </p>
                </section>

                {/* Section 3 */}
                <section id="stablecoin" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    3. Stablecoin Risk
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Stablecoins may:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Lose their peg.</li>
                    <li>Become illiquid.</li>
                    <li>Experience reserve failures.</li>
                    <li>Be affected by regulatory actions.</li>
                    <li>Suffer operational disruptions.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Blip.money makes no representations regarding the stability or
                    reliability of any digital asset, including:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                    <li>USDT</li>
                    <li>USDC</li>
                    <li>FDUSD</li>
                    <li>RLUSD</li>
                    <li>Other supported assets</li>
                  </ul>
                </section>

                {/* Section 4 */}
                <section id="counterparty" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    4. Counterparty Risk
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Transactions occur directly between users and independent
                    participants.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Blip.money does not guarantee:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Counterparty solvency.</li>
                    <li>Counterparty honesty.</li>
                    <li>Timely settlement.</li>
                    <li>Payment completion.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Users assume all risks associated with counterparties.
                  </p>
                </section>

                {/* Section 5 */}
                <section id="smart-contract" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    5. Smart Contract Risk
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Smart contracts may contain:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Bugs.</li>
                    <li>Coding errors.</li>
                    <li>Design flaws.</li>
                    <li>Exploits.</li>
                    <li>Security vulnerabilities.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Such failures may result in:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Permanent loss of assets.</li>
                    <li>Delayed settlements.</li>
                    <li>Unexpected outcomes.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Blip.money cannot guarantee the security or correctness of
                    smart contracts.
                  </p>
                </section>

                {/* Section 6 */}
                <section id="blockchain" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    6. Blockchain Risk
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Underlying blockchains may experience:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Congestion.</li>
                    <li>Reorganizations.</li>
                    <li>Forks.</li>
                    <li>Outages.</li>
                    <li>Consensus failures.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    These events may affect:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Transaction execution.</li>
                    <li>Availability of assets.</li>
                    <li>Confirmation times.</li>
                    <li>User balances.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Blip.money does not control blockchain networks.
                  </p>
                </section>

                {/* Section 7 */}
                <section id="private-key" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    7. Private Key Risk
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Users are solely responsible for:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Wallet security.</li>
                    <li>Seed phrases.</li>
                    <li>Private keys.</li>
                    <li>Passwords.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Loss or compromise of credentials may result in permanent and
                    irreversible loss of digital assets.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Blip.money cannot recover lost keys or assets.
                  </p>
                </section>

                {/* Section 8 */}
                <section id="cybersecurity" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    8. Cybersecurity Risk
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Users may be exposed to:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Malware.</li>
                    <li>Phishing attacks.</li>
                    <li>Social engineering.</li>
                    <li>Ransomware.</li>
                    <li>SIM swap attacks.</li>
                    <li>Device compromise.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Unauthorized access may result in permanent loss of assets.
                  </p>
                </section>

                {/* Section 9 */}
                <section id="regulatory" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    9. Regulatory Risk
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Laws relating to digital assets may change without notice.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Government actions may include:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Restrictions.</li>
                    <li>Licensing requirements.</li>
                    <li>Tax obligations.</li>
                    <li>Prohibitions.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Such changes may negatively impact access to or use of the
                    Services.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Blip.money does not guarantee that use of digital assets is
                    lawful in your jurisdiction.
                  </p>
                </section>

                {/* Section 10 */}
                <section id="liquidity" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    10. Liquidity Risk
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Certain digital assets may experience:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Reduced liquidity.</li>
                    <li>Market disruptions.</li>
                    <li>Order slippage.</li>
                    <li>Inability to exit positions.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Users may be unable to complete transactions at desired
                    prices.
                  </p>
                </section>

                {/* Section 11 */}
                <section id="third-party" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    11. Third-Party Risk
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Blip.money depends upon third-party infrastructure including:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Wallet providers.</li>
                    <li>RPC providers.</li>
                    <li>Blockchain networks.</li>
                    <li>Internet service providers.</li>
                    <li>Hosting providers.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Blip.money does not control such services and assumes no
                    responsibility for their failures.
                  </p>
                </section>

                {/* Section 12 */}
                <section id="fiat" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    12. Fiat Settlement Risk
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Fiat settlements are conducted independently between users and
                    counterparties.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Blip.money does not:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Hold fiat balances.</li>
                    <li>Process bank transfers.</li>
                    <li>Guarantee payment completion.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Users assume all risks associated with fiat transfers.
                  </p>
                </section>

                {/* Section 13 */}
                <section id="bank" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    13. Bank Account Risk
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Participants may experience:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Bank account freezes.</li>
                    <li>Delays.</li>
                    <li>Transaction reversals.</li>
                    <li>Compliance reviews.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Blip.money has no ability to intervene in banking
                    relationships.
                  </p>
                </section>

                {/* Section 14 */}
                <section id="technical" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    14. Technical Failure Risk
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    The Services may become unavailable due to:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Software bugs.</li>
                    <li>Hardware failures.</li>
                    <li>Internet outages.</li>
                    <li>Cyber attacks.</li>
                    <li>Infrastructure disruptions.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Blip.money does not guarantee uninterrupted availability.
                  </p>
                </section>

                {/* Section 15 */}
                <section id="force-majeure" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    15. Force Majeure
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Events beyond reasonable control may affect operations,
                    including:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Natural disasters.</li>
                    <li>Wars.</li>
                    <li>Government actions.</li>
                    <li>Pandemics.</li>
                    <li>Power failures.</li>
                    <li>Internet outages.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Blip.money shall not be liable for losses resulting from such
                    events.
                  </p>
                </section>

                {/* Section 16 */}
                <section id="tax" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">16. Tax Risk</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Transactions involving digital assets may have tax
                    consequences.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Users are solely responsible for:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Determining tax obligations.</li>
                    <li>Reporting transactions.</li>
                    <li>Paying taxes.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Blip.money does not provide tax advice.
                  </p>
                </section>

                {/* Section 17 */}
                <section id="no-advice" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    17. No Investment Advice
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Nothing contained within the Services constitutes:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Investment advice.</li>
                    <li>Financial advice.</li>
                    <li>Legal advice.</li>
                    <li>Tax advice.</li>
                    <li>Accounting advice.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Users should consult qualified professionals before making
                    financial decisions.
                  </p>
                </section>

                {/* Section 18 */}
                <section id="risk-assumption" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    18. Assumption of Risk
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    By using the Services, you acknowledge and agree that:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                    <li>
                      You understand the risks associated with blockchain
                      technologies.
                    </li>
                    <li>You are financially capable of bearing losses.</li>
                    <li>You assume all risks associated with your activities.</li>
                    <li>You use the Services voluntarily.</li>
                  </ul>
                </section>

                {/* Section 19 */}
                <section id="liability" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    19. Limitation of Liability
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    To the maximum extent permitted by law, Blip.money shall not
                    be liable for:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Loss of assets.</li>
                    <li>Lost profits.</li>
                    <li>Loss of opportunity.</li>
                    <li>Data loss.</li>
                    <li>Indirect damages.</li>
                    <li>Consequential damages.</li>
                    <li>Third-party actions.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Users accept sole responsibility for their decisions and
                    activities.
                  </p>
                </section>

                {/* Section 20 */}
                <section id="acknowledgement" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    20. Acknowledgement
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    By accessing or using the Services, you acknowledge that:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>You have read this Risk Disclosure Statement.</li>
                    <li>You understand the risks involved.</li>
                    <li>You voluntarily assume such risks.</li>
                    <li>
                      You release Blip.money from liability to the maximum extent
                      permitted by applicable law.
                    </li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    For questions regarding this Risk Disclosure Statement,
                    contact:
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RiskDisclosure;
