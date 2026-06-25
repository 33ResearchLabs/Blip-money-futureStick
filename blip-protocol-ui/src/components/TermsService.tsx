import { useEffect, useState } from "react";
import SEO from "./SEO";

const sections = [
  { id: "acceptance", title: "Acceptance of Terms" },
  { id: "nature", title: "Nature of Blip.money" },
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

const TermsService = () => {
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
      <SEO
        title="Blip Money – Terms of Service & User Agreement"
        description="Read the official Terms of Service for Blip Money. Learn about your rights, responsibilities, and the legal conditions governing the use of our platform and services."
        canonical="https://www.blip.money/terms"
      />

      <div className="min-h-screen  text-black dark:text-white mt-12">
        {/* Hero Header */}
        <div className="py-8 px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
              Terms of Service
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
                  <p className="text-xs font-bold text-black dark:text-white  uppercase tracking-wider mb-4">
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
                <p className="text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
                  BLIP.MONEY is a decentralized protocol interface and
                  marketplace that facilitates interactions between users and
                  independent participants. BLIP.money is not a bank, financial
                  institution, money transmitter, payment processor, broker,
                  investment advisor, or custodian of assets. By accessing or
                  using the Services, you acknowledge and accept the risks
                  associated with blockchain technology, digital assets, and
                  peer-to-peer transactions.
                </p>

                {/* Section 1 */}
                <section id="acceptance" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    1. Acceptance of Terms
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    These Terms of Service ("Terms") govern your access to and
                    use of the BLIP.money website, applications, interfaces,
                    software, APIs, smart contracts, and related services
                    (collectively, the "Services").
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    By accessing or using the Services, you acknowledge that:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
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
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    If you do not agree with these Terms, you must discontinue
                    using the Services immediately.
                  </p>
                </section>

                {/* Section 2 */}
                <section id="nature" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    2. Nature of Blip.money
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    BLIP.money provides software interfaces and tools that enable
                    users to participate in a decentralized peer-to-peer
                    marketplace and settlement protocol.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    BLIP.money:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
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
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Transactions occur directly between users and independent
                    participants.
                  </p>
                </section>

                {/* Section 3 */}
                <section id="non-custodial" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    3. Non-Custodial Services
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Users retain sole control over their wallets and private
                    keys.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    BLIP.money cannot:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Access user funds.</li>
                    <li>Recover lost wallets.</li>
                    <li>Reverse transactions.</li>
                    <li>Freeze assets.</li>
                    <li>Retrieve private keys.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    You are solely responsible for:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Wallet security.</li>
                    <li>Backup procedures.</li>
                    <li>Password management.</li>
                    <li>Device security.</li>
                    <li>Private key protection.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Loss of access credentials may result in permanent loss of
                    digital assets.
                  </p>
                </section>

                {/* Section 4 */}
                <section id="marketplace" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    4. Marketplace Model
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    BLIP.money operates as a decentralized marketplace and
                    coordination layer.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    BLIP.money does not:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Buy or sell digital assets.</li>
                    <li>Provide liquidity.</li>
                    <li>Match orders as principal.</li>
                    <li>Participate in fiat settlements.</li>
                    <li>Guarantee payment obligations.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Users interact directly with independent counterparties at
                    their own risk.
                  </p>
                </section>

                {/* Section 5 */}
                <section id="responsibilities" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    5. User Responsibilities
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    By using the Services, you represent and warrant that:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>All information provided is accurate.</li>
                    <li>You are acting on your own behalf.</li>
                    <li>
                      You understand the risks associated with digital assets.
                    </li>
                    <li>You are solely responsible for your actions.</li>
                    <li>You will comply with all applicable laws.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    You are responsible for determining whether the use of
                    digital assets is lawful in your jurisdiction.
                  </p>
                </section>

                {/* Section 6 */}
                <section id="prohibited" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    6. Prohibited Activities
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Users shall not:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
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
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    BLIP.money reserves the right to restrict access to users
                    engaged in harmful or prohibited conduct.
                  </p>
                </section>

                {/* Section 7 */}
                <section id="reputation" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    7. Reputation System
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    BLIP.money may maintain reputation mechanisms to promote
                    trust and marketplace integrity.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Reputation scores may be influenced by:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Successful transaction history.</li>
                    <li>Disputes and appeals.</li>
                    <li>Fraud reports.</li>
                    <li>Counterparty feedback.</li>
                    <li>Merchant staking and participation.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    BLIP.money reserves the right to suspend, limit, or remove
                    reputation privileges to protect users and maintain
                    marketplace integrity.
                  </p>
                </section>

                {/* Section 8 */}
                <section id="merchants" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    8. Merchants and Liquidity Providers
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Merchants and liquidity providers participate independently.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    BLIP.money:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Does not employ merchants.</li>
                    <li>Does not guarantee merchant performance.</li>
                    <li>Does not supervise transactions.</li>
                    <li>Does not guarantee profitability.</li>
                    <li>Does not verify bank accounts or payment methods.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Merchants and liquidity providers are solely responsible for:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Compliance with applicable laws.</li>
                    <li>Tax obligations.</li>
                    <li>Reporting requirements.</li>
                    <li>Anti-money laundering obligations.</li>
                    <li>Counterparty risk.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Any risks associated with frozen bank accounts, chargebacks,
                    fraud, or regulatory actions are borne solely by
                    participants.
                  </p>
                </section>

                {/* Section 9 */}
                <section id="fees" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">9. Fees</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    BLIP.money may charge protocol or marketplace fees.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Fees:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>May change without notice.</li>
                    <li>Are generally non-refundable.</li>
                    <li>
                      May vary depending on network conditions and transaction
                      size.
                    </li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Blockchain network fees are determined independently by
                    underlying networks and are outside BLIP.money's control.
                  </p>
                </section>

                {/* Section 10 */}
                <section id="risk" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    10. Risk Disclosures
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Digital assets involve substantial risks, including:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
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
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Past performance does not guarantee future results.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Users assume all risks associated with their use of the
                    Services.
                  </p>
                </section>

                {/* Section 11 */}
                <section id="warranties" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    11. No Warranties
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    The Services are provided on an "AS IS" and "AS AVAILABLE"
                    basis.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    BLIP.money makes no representations or warranties regarding:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Availability.</li>
                    <li>Accuracy.</li>
                    <li>Reliability.</li>
                    <li>Security.</li>
                    <li>Performance.</li>
                    <li>Fitness for any particular purpose.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    BLIP.money does not guarantee uninterrupted access to the
                    Services.
                  </p>
                </section>

                {/* Section 12 */}
                <section id="liability" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    12. Limitation of Liability
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    To the maximum extent permitted by law, BLIP.money and its
                    affiliates shall not be liable for:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
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
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Users assume all risks arising from use of the Services.
                  </p>
                </section>

                {/* Section 13 */}
                <section id="ip" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    13. Intellectual Property
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    All software, trademarks, logos, content, interfaces,
                    designs, and materials associated with BLIP.money are
                    protected by intellectual property laws.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Users may not:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Copy.</li>
                    <li>Modify.</li>
                    <li>Distribute.</li>
                    <li>Reverse engineer.</li>
                    <li>Create derivative works.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Without prior written permission.
                  </p>
                </section>

                {/* Section 14 */}
                <section id="modifications" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    14. Modifications
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    BLIP.money reserves the right to modify these Terms or any
                    aspect of the Services at any time.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Continued use of the Services constitutes acceptance of
                    revised Terms.
                  </p>
                </section>

                {/* Section 15 */}
                <section id="termination" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">15. Termination</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    BLIP.money may suspend or restrict access in order to:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Protect users.</li>
                    <li>Preserve system integrity.</li>
                    <li>Prevent fraud.</li>
                    <li>Address abuse.</li>
                    <li>Comply with legal obligations.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Termination does not affect obligations incurred before
                    termination.
                  </p>
                </section>

                {/* Section 16 */}
                <section id="force-majeure" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    16. Force Majeure
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    BLIP.money shall not be liable for delays, interruptions, or
                    failures caused by:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
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

                {/* Section 17 */}
                <section id="entire-agreement" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    17. Entire Agreement
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    These Terms constitute the entire agreement between you and
                    BLIP.money regarding the Services and supersede all prior
                    understandings and communications.
                  </p>
                </section>

                {/* Section 18 */}
                <section id="contact" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">18. Contact</h2>

                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Questions regarding these Terms may be directed to:
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
                  By using the Services, you acknowledge that you have read,
                  understood, and agreed to these Terms of Service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsService;
