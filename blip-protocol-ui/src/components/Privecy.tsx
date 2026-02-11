import { useEffect, useState } from "react";
import SEO from "./SEO";

const sections = [
  { id: "collect", title: "Information We Collect" },
  { id: "use", title: "How We Use Information" },
  { id: "legal-basis", title: "Legal Basis" },
  { id: "sharing", title: "Data Sharing" },
  { id: "retention", title: "Data Retention" },
  { id: "security", title: "Data Security" },
  { id: "transfers", title: "International Transfers" },
  { id: "rights", title: "Your Rights" },
  { id: "contact", title: "Contact" },
];

const Privacy = () => {
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
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <SEO
        title="Blip Money – Privacy & Personal Data Policy"
        description="Read Blip Money’s Privacy Policy to understand how we collect, use, and protect your personal information, safeguard your privacy, and handle data securely on our platform."
        canonical="https://blip.money/privacy"
      />

      <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0a0a0b] text-black dark:text-white mt-12">
        {/* Hero Header */}
        <div className="pt-32 pb-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight italic">
              Privacy Policy
            </h1>
          </div>
        </div>

        {/* Content Area with Sidebar */}
        <div className="bg-gray-50 dark:bg-[#111111]">
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
                            : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 px-3 py-2"
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
                <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  blip.money (we, our, or, us) operates a non-custodial escrow
                  and coordination protocol for peer-to-peer digital asset and
                  fiat transactions. We take privacy and data protection
                  seriously.
                </p>

                <p className="text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
                  This Privacy Policy explains how we collect, use, store, and
                  protect information when you use the blip.money platform,
                  website, applications, and related services (collectively, the
                  "Services").
                </p>

                {/* Section 1 */}
                <section id="collect" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    1. Information We Collect
                  </h2>

                  <p className="text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                    We may collect and process the following categories of
                    information depending on how you use the Services.
                  </p>

                  <p className="text-black dark:text-white mb-2 font-medium">
                    1.1 Information You Provide
                  </p>
                  <ul className="list-disc list-inside text-gray-500 dark:text-gray-400 space-y-2 mb-4">
                    <li>Email address or username (if applicable)</li>
                    <li>Wallet addresses</li>
                    <li>
                      Identity or verification information (only when required)
                    </li>
                    <li>Communications with support</li>
                    <li>Dispute-related documents, proofs, or explanations</li>
                  </ul>

                  <p className="text-black dark:text-white mb-2 font-medium">
                    1.2 Automatically Collected Information
                  </p>
                  <ul className="list-disc list-inside text-gray-500 dark:text-gray-400 space-y-2 mb-4">
                    <li>IP address, device type, and browser type</li>
                    <li>Log data, timestamps, and usage patterns</li>
                    <li>Security and fraud-prevention signals</li>
                  </ul>

                  <p className="text-black dark:text-white mb-2 font-medium">
                    1.3 Transaction Metadata
                  </p>
                  <ul className="list-disc list-inside text-gray-500 dark:text-gray-400 space-y-2">
                    <li>Transaction references or identifiers</li>
                    <li>Timestamps, amounts, and transaction status</li>
                  </ul>

                  <p className="text-gray-500 dark:text-gray-400 mt-4 leading-relaxed">
                    blip.money does not custody user funds and does not store
                    private keys or wallet credentials.
                  </p>
                </section>

                {/* Section 2 */}
                <section id="use" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    2. How We Use Your Information
                  </h2>

                  <ul className="list-disc list-inside text-gray-500 dark:text-gray-400 space-y-2">
                    <li>Operate, maintain, and secure the platform</li>
                    <li>
                      Facilitate escrow coordination and dispute resolution
                    </li>
                    <li>Detect, prevent, and mitigate fraud or abuse</li>
                    <li>Comply with legal and regulatory obligations</li>
                    <li>Improve performance, security, and user experience</li>
                  </ul>
                </section>

                {/* Section 3 */}
                <section id="legal-basis" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    3. Legal Basis for Processing
                  </h2>

                  <ul className="list-disc list-inside text-gray-500 dark:text-gray-400 space-y-2">
                    <li>Contractual necessity to provide the Services</li>
                    <li>Compliance with legal obligations</li>
                    <li>
                      Legitimate interests such as security, fraud prevention,
                      and system integrity
                    </li>
                    <li>Your consent, where required by law</li>
                  </ul>
                </section>

                {/* Section 4 */}
                <section id="sharing" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    4. Data Sharing
                  </h2>

                  <p className="text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                    We may share limited information with:
                  </p>

                  <ul className="list-disc list-inside text-gray-500 dark:text-gray-400 space-y-2">
                    <li>Compliance and verification partners</li>
                    <li>Dispute resolution service providers</li>
                    <li>
                      Law enforcement or regulatory authorities when legally
                      required
                    </li>
                  </ul>

                  <p className="text-gray-500 dark:text-gray-400 mt-4 leading-relaxed">
                    We do not sell personal data.
                  </p>
                </section>

                {/* Section 5 */}
                <section id="retention" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    5. Data Retention
                  </h2>

                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    We retain information only for as long as necessary to
                    operate and secure the Services, comply with legal
                    obligations, resolve disputes, and prevent fraud or abuse.
                  </p>

                  <p className="text-gray-500 dark:text-gray-400 mt-4 leading-relaxed">
                    Blockchain transaction data is permanent and is not
                    controlled by blip.money.
                  </p>
                </section>

                {/* Section 6 */}
                <section id="security" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    6. Data Security
                  </h2>

                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    We use appropriate technical and organizational security
                    measures, including encryption, access controls, monitoring,
                    and secure infrastructure practices. However, no system is
                    completely secure, and absolute security cannot be
                    guaranteed.
                  </p>
                </section>

                {/* Section 7 */}
                <section id="transfers" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    7. International Data Transfers
                  </h2>

                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    Your information may be processed in multiple jurisdictions
                    depending on our infrastructure and operational needs. Where
                    required, appropriate safeguards are applied.
                  </p>
                </section>

                {/* Section 8 */}
                <section id="rights" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">8. Your Rights</h2>

                  <ul className="list-disc list-inside text-gray-500 dark:text-gray-400 space-y-2">
                    <li>Access information about you</li>
                    <li>Request correction of your information</li>
                    <li>Request deletion of your information</li>
                    <li>Request a copy (export) of your information</li>
                    <li>Restrict or object to certain processing activities</li>
                  </ul>
                </section>

                {/* Section 9 */}
                <section id="contact">
                  <h2 className="text-xl font-semibold mb-3">9. Contact</h2>

                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    If you have any questions about this Privacy Policy or our
                    data practices, you may contact us at:
                  </p>

                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    Email:{" "}
                    <a
                      href="mailto:privacy@blip.money"
                      className="text-black dark:text-white underline"
                    >
                      privacy@blip.money
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

export default Privacy;
