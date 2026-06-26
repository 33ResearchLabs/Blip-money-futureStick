import { useEffect, useState } from "react";
import SEO from "../../components/SEO";

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

const Gdpr = () => {
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
        canonical="https://www.blip.money/gdpr"
      />

      <div className="min-h-screen text-black dark:text-white mt-12">
        {/* Hero Header */}
        <div className="py-8 px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
              GDPR Compliance Notice
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
                    Blip.money ("blip.money", "we", "our", or "us") respects the
                    privacy rights of individuals and is committed to handling
                    personal information in a transparent and responsible manner.
                  </p>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    This GDPR Compliance Notice explains how we process personal
                    data relating to individuals located in the European Economic
                    Area ("EEA"), the United Kingdom ("UK"), and other
                    jurisdictions with similar data protection laws.
                  </p>

                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    This Notice supplements our Privacy Policy.
                  </p>
                </section>

                {/* Section 1 */}
                <section id="principles" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    1. Our Privacy Principles
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Blip.money is committed to the following principles:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
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
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    We seek to collect only the information reasonably necessary
                    to provide and improve our Services.
                  </p>
                </section>

                {/* Section 2 */}
                <section id="data-process" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    2. Personal Data We May Process
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Depending on how you use the Services, we may process:
                  </p>

                  <p className="text-black dark:text-white mb-2 font-medium">
                    Account Information
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Username</li>
                    <li>Email address</li>
                    <li>Telegram username (if voluntarily provided)</li>
                  </ul>

                  <p className="text-black dark:text-white mb-2 font-medium">
                    Technical Information
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>IP address</li>
                    <li>Browser type</li>
                    <li>Device information</li>
                    <li>Operating system</li>
                    <li>Session information</li>
                    <li>Diagnostic logs</li>
                  </ul>

                  <p className="text-black dark:text-white mb-2 font-medium">
                    Blockchain Information
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Because public blockchains are transparent by design, we may
                    process publicly available blockchain information, including:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Wallet addresses</li>
                    <li>Public transaction history</li>
                    <li>Public smart contract interactions</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Blockchain records cannot generally be altered or deleted.
                  </p>
                </section>

                {/* Section 3 */}
                <section id="data-not-collect" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    3. Personal Data We Do Not Collect
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Blip.money does not intentionally collect or store:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
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

                {/* Section 4 */}
                <section id="purposes" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    4. Purposes of Processing
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Personal information may be processed for purposes including:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
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

                {/* Section 5 */}
                <section id="legal-bases" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    5. Legal Bases for Processing
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Where GDPR applies, blip.money may process personal
                    information on one or more of the following legal bases:
                  </p>

                  <p className="text-black dark:text-white mb-2 font-medium">
                    Performance of a Contract
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Processing necessary to provide requested Services.
                  </p>

                  <p className="text-black dark:text-white mb-2 font-medium">
                    Legitimate Interests
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Including:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Platform security</li>
                    <li>Fraud prevention</li>
                    <li>Service improvements</li>
                    <li>Network integrity</li>
                    <li>Customer support</li>
                  </ul>

                  <p className="text-black dark:text-white mb-2 font-medium">
                    Legal Obligations
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Where processing is required by applicable law.
                  </p>

                  <p className="text-black dark:text-white mb-2 font-medium">
                    Consent
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Where required by law, we rely upon user consent before
                    processing certain categories of information.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Users may withdraw consent where applicable.
                  </p>
                </section>

                {/* Section 6 */}
                <section id="minimization" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    6. Data Minimization
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Blip.money seeks to collect only the information reasonably
                    necessary to operate the Services.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    We avoid collecting unnecessary personal information whenever
                    possible.
                  </p>
                </section>

                {/* Section 7 */}
                <section id="retention" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    7. Data Retention
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Personal information is retained only for as long as
                    reasonably necessary to:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Provide the Services</li>
                    <li>Comply with legal obligations</li>
                    <li>Resolve disputes</li>
                    <li>Protect users</li>
                    <li>Enforce agreements</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Public blockchain records remain permanently available on
                    their respective networks.
                  </p>
                </section>

                {/* Section 8 */}
                <section id="transfers" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    8. International Data Transfers
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Your information may be processed by infrastructure providers
                    located in multiple jurisdictions.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Where appropriate, reasonable safeguards may be implemented
                    to protect personal information during international
                    transfers.
                  </p>
                </section>

                {/* Section 9 */}
                <section id="rights" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    9. Your GDPR Rights
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Subject to applicable law, individuals may have the following
                    rights:
                  </p>

                  <p className="text-black dark:text-white mb-2 font-medium">
                    Right of Access
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Request confirmation regarding whether personal information
                    is processed.
                  </p>

                  <p className="text-black dark:text-white mb-2 font-medium">
                    Right to Rectification
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Request correction of inaccurate personal information.
                  </p>

                  <p className="text-black dark:text-white mb-2 font-medium">
                    Right to Erasure
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Request deletion of personal information where legally
                    applicable.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Certain blockchain records cannot be deleted because they
                    exist on decentralized public networks.
                  </p>

                  <p className="text-black dark:text-white mb-2 font-medium">
                    Right to Restrict Processing
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Request limitation of certain processing activities.
                  </p>

                  <p className="text-black dark:text-white mb-2 font-medium">
                    Right to Data Portability
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Receive certain personal information in a commonly used
                    format where applicable.
                  </p>

                  <p className="text-black dark:text-white mb-2 font-medium">
                    Right to Object
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Object to processing based upon legitimate interests.
                  </p>

                  <p className="text-black dark:text-white mb-2 font-medium">
                    Right to Withdraw Consent
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Withdraw consent where processing relies upon consent.
                  </p>

                  <p className="text-black dark:text-white mb-2 font-medium">
                    Right to Lodge a Complaint
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Individuals may submit complaints to the relevant supervisory
                    authority if they believe their rights have been violated.
                  </p>
                </section>

                {/* Section 10 */}
                <section id="automated" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    10. Automated Decision-Making
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Blip.money may use automated systems to:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Detect fraud</li>
                    <li>Improve platform security</li>
                    <li>Identify abusive behavior</li>
                    <li>Protect marketplace integrity</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    These systems assist operational decisions but are not
                    intended to produce solely automated legal or similarly
                    significant effects without appropriate review where required
                    by applicable law.
                  </p>
                </section>

                {/* Section 11 */}
                <section id="security" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">11. Security</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Blip.money implements commercially reasonable administrative,
                    technical, and organizational measures designed to protect
                    personal information.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Despite these efforts, no system can guarantee complete
                    security.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Users should also take appropriate measures to secure their
                    devices and wallets.
                  </p>
                </section>

                {/* Section 12 */}
                <section id="third-party" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    12. Third-Party Services
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    The Services may integrate with third-party providers
                    including:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Wallet providers</li>
                    <li>Blockchain networks</li>
                    <li>Analytics providers</li>
                    <li>Infrastructure providers</li>
                    <li>Customer support providers</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    These third parties maintain their own privacy practices and
                    policies.
                  </p>
                </section>

                {/* Section 13 */}
                <section id="cookies" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">13. Cookies</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Blip.money uses cookies and similar technologies as described
                    in our Cookie Policy.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Users may control cookie preferences through browser settings
                    where available.
                  </p>
                </section>

                {/* Section 14 */}
                <section id="children" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    14. Children's Privacy
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    The Services are intended only for individuals who are at
                    least 18 years of age.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Blip.money does not knowingly collect personal information
                    from children.
                  </p>
                </section>

                {/* Section 15 */}
                <section id="changes" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    15. Changes to This Notice
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Blip.money may update this GDPR Compliance Notice
                    periodically.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Updated versions become effective upon publication.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Continued use of the Services constitutes acceptance of the
                    revised Notice.
                  </p>
                </section>

                {/* Section 16 */}
                <section id="contact" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">16. Contact</h2>

                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Questions regarding GDPR or privacy matters may be directed
                    to:
                  </p>

                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    <a
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=privacy@blip.money"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black dark:text-white underline"
                    >
                      privacy@blip.money
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

                  <p className="text-gray-600 dark:text-gray-300 mt-4 leading-relaxed">
                    If you wish to exercise any applicable data protection
                    rights, please contact us using the above email addresses.
                  </p>
                </section>

                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  By using the Services, you acknowledge that you have read and
                  understood this GDPR Compliance Notice and your rights
                  regarding the processing of personal information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Gdpr;
