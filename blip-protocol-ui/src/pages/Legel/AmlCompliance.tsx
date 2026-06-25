import { useEffect, useState } from "react";
import SEO from "@/components/SEO";

const sections = [
  { id: "role", title: "Our Role" },
  { id: "principles", title: "Compliance Principles" },
  { id: "responsibilities", title: "User Responsibilities" },
  { id: "prohibited", title: "Prohibited Activities" },
  { id: "sanctions", title: "Sanctions Compliance" },
  { id: "integrity", title: "Marketplace Integrity" },
  { id: "reporting", title: "Reporting Suspicious Activity" },
  { id: "merchant", title: "Merchant Responsibilities" },
  { id: "third-party", title: "Third-Party Services" },
  { id: "investigations", title: "Investigations" },
  { id: "legal-requests", title: "Legal Requests" },
  { id: "no-advice", title: "No Legal or Regulatory Advice" },
  { id: "limitation", title: "Limitation of Responsibility" },
  { id: "changes", title: "Changes to This Statement" },
  { id: "contact", title: "Contact" },
];

const AmlCompliance = () => {
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
      <SEO canonical="https://www.blip.money/aml-compliance" />

      <div className="min-h-screen text-black dark:text-white mt-12">
        {/* Hero Header */}
        <div className="py-8 px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
              AML &amp; Compliance Statement
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
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  Blip.money ("Blip.money", "we", "our", or "us") is committed
                  to fostering a secure, transparent, and responsible
                  peer-to-peer marketplace.
                </p>

                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  This AML &amp; Compliance Statement explains the principles
                  that guide our approach to compliance, marketplace integrity,
                  and the prevention of unlawful activity.
                </p>

                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  This Statement should be read together with our:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-10">
                  <li>Terms of Service</li>
                  <li>Privacy Policy</li>
                  <li>Risk Disclosure Statement</li>
                  <li>Merchant &amp; Liquidity Provider Terms</li>
                  <li>Prohibited Use Policy</li>
                </ul>

                {/* Section 1 */}
                <section id="role" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">1. Our Role</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Blip.money provides software, interfaces, and technology that
                    enable users to interact within a decentralized peer-to-peer
                    marketplace.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Blip.money does not:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Act as a bank.</li>
                    <li>Hold customer fiat funds.</li>
                    <li>Custody digital assets.</li>
                    <li>Execute transactions on behalf of users.</li>
                    <li>Control users' wallets.</li>
                    <li>Control private keys.</li>
                    <li>Guarantee settlements between participants.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Users remain solely responsible for their own transactions
                    and legal obligations.
                  </p>
                </section>

                {/* Section 2 */}
                <section id="principles" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    2. Compliance Principles
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Blip.money is committed to supporting:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                    <li>Marketplace integrity.</li>
                    <li>Responsible participation.</li>
                    <li>Fraud prevention.</li>
                    <li>Protection of users.</li>
                    <li>Compliance with applicable laws where relevant.</li>
                    <li>
                      Cooperation with lawful requests where legally required.
                    </li>
                  </ul>
                </section>

                {/* Section 3 */}
                <section id="responsibilities" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    3. User Responsibilities
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Each user is solely responsible for:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Understanding applicable laws.</li>
                    <li>
                      Determining whether use of digital assets is lawful in
                      their jurisdiction.
                    </li>
                    <li>Complying with tax obligations.</li>
                    <li>Maintaining appropriate transaction records.</li>
                    <li>Conducting lawful activities.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Users are expected to exercise reasonable care when
                    interacting with counterparties.
                  </p>
                </section>

                {/* Section 4 */}
                <section id="prohibited" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    4. Prohibited Activities
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    The Services must not be used for activities including, but
                    not limited to:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Money laundering.</li>
                    <li>Terrorist financing.</li>
                    <li>Fraud.</li>
                    <li>Identity theft.</li>
                    <li>Use of stolen assets.</li>
                    <li>Sanctions evasion.</li>
                    <li>Human trafficking.</li>
                    <li>Child exploitation.</li>
                    <li>Bribery.</li>
                    <li>Corruption.</li>
                    <li>Market manipulation.</li>
                    <li>Any other unlawful activity.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Users engaging in prohibited conduct may have their access
                    restricted or terminated.
                  </p>
                </section>

                {/* Section 5 */}
                <section id="sanctions" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    5. Sanctions Compliance
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Users are responsible for ensuring that their activities do
                    not violate applicable sanctions laws.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Blip.money may restrict access where there is a reasonable
                    belief that use of the Services would involve:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                    <li>Sanctioned individuals.</li>
                    <li>Sanctioned entities.</li>
                    <li>Restricted jurisdictions.</li>
                    <li>Prohibited activities.</li>
                  </ul>
                </section>

                {/* Section 6 */}
                <section id="integrity" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    6. Marketplace Integrity
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    To help maintain a trustworthy marketplace, Blip.money may
                    implement reasonable measures to:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Detect fraudulent activity.</li>
                    <li>Prevent abuse.</li>
                    <li>Identify unusual marketplace behavior.</li>
                    <li>Protect users from scams.</li>
                    <li>Preserve marketplace integrity.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    These measures may include automated or manual reviews of
                    platform activity.
                  </p>
                </section>

                {/* Section 7 */}
                <section id="reporting" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    7. Reporting Suspicious Activity
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Users are encouraged to report suspected:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Fraud.</li>
                    <li>Scams.</li>
                    <li>Impersonation.</li>
                    <li>Security incidents.</li>
                    <li>Marketplace abuse.</li>
                    <li>Illegal activity.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Reports may be submitted through official support channels.
                  </p>
                </section>

                {/* Section 8 */}
                <section id="merchant" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    8. Merchant Responsibilities
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Merchants and liquidity providers are solely responsible for
                    ensuring that their activities comply with applicable laws
                    and regulations.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    This includes responsibility for:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Customer due diligence, where required by law.</li>
                    <li>Tax compliance.</li>
                    <li>Record keeping.</li>
                    <li>Banking relationships.</li>
                    <li>
                      Regulatory obligations applicable to their activities.
                    </li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Blip.money does not assume these responsibilities on behalf
                    of participants.
                  </p>
                </section>

                {/* Section 9 */}
                <section id="third-party" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    9. Third-Party Services
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Users may interact with third-party services including:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Wallet providers.</li>
                    <li>Blockchain networks.</li>
                    <li>Banking institutions.</li>
                    <li>Infrastructure providers.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Blip.money does not control such services and is not
                    responsible for their compliance practices.
                  </p>
                </section>

                {/* Section 10 */}
                <section id="investigations" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    10. Investigations
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Where appropriate to protect the marketplace, Blip.money may:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Review reported abuse.</li>
                    <li>Investigate fraudulent activity.</li>
                    <li>Restrict abusive participants.</li>
                    <li>Suspend marketplace privileges.</li>
                    <li>Remove users engaged in prohibited conduct.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    These actions are intended solely to preserve marketplace
                    integrity and user safety.
                  </p>
                </section>

                {/* Section 11 */}
                <section id="legal-requests" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    11. Legal Requests
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Where legally required, Blip.money may respond to valid
                    requests from competent authorities in accordance with
                    applicable law.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Nothing in this Statement obligates Blip.money to disclose
                    information except where legally required or otherwise
                    permitted by applicable law.
                  </p>
                </section>

                {/* Section 12 */}
                <section id="no-advice" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    12. No Legal or Regulatory Advice
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Nothing contained in the Services constitutes:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Legal advice.</li>
                    <li>Regulatory advice.</li>
                    <li>Tax advice.</li>
                    <li>Financial advice.</li>
                    <li>Compliance advice.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Users should seek independent professional advice where
                    appropriate.
                  </p>
                </section>

                {/* Section 13 */}
                <section id="limitation" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    13. Limitation of Responsibility
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Blip.money cannot guarantee that:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Every participant will act lawfully.</li>
                    <li>Fraud will never occur.</li>
                    <li>
                      Counterparties will always fulfill their obligations.
                    </li>
                    <li>Transactions will always complete successfully.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Users remain responsible for conducting their own risk
                    assessments before entering into transactions.
                  </p>
                </section>

                {/* Section 14 */}
                <section id="changes" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    14. Changes to This Statement
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Blip.money may modify this AML &amp; Compliance Statement from
                    time to time.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Updated versions become effective upon publication.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Continued use of the Services constitutes acceptance of the
                    revised Statement.
                  </p>
                </section>

                {/* Section 15 */}
                <section id="contact" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">15. Contact</h2>

                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Questions regarding this AML &amp; Compliance Statement may
                    be directed to:
                  </p>

                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    <a
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=compliance@blip.money"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black dark:text-white underline"
                    >
                      compliance@blip.money
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
                  By accessing or using the Services, you acknowledge that you
                  have read, understood, and accepted this AML &amp; Compliance
                  Statement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AmlCompliance;
