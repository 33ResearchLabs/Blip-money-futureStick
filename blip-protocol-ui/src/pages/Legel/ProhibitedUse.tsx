import { useEffect, useState } from "react";
import SEO from "@/components/SEO";

const sections = [
  { id: "illegal", title: "Illegal Activities" },
  { id: "money-laundering", title: "Money Laundering" },
  { id: "sanctions", title: "Sanctions Evasion" },
  { id: "fraud", title: "Fraud" },
  { id: "stolen-funds", title: "Stolen or Unauthorized Funds" },
  { id: "terrorist", title: "Terrorist Financing" },
  { id: "exploitation", title: "Child Exploitation and Human Trafficking" },
  { id: "manipulation", title: "Market Manipulation" },
  { id: "malicious", title: "Malicious Activities" },
  { id: "software", title: "Exploitation of Software" },
  { id: "automated", title: "Automated Abuse" },
  { id: "ip", title: "Intellectual Property Violations" },
  { id: "impersonation", title: "Impersonation" },
  { id: "privacy", title: "Privacy Violations" },
  { id: "reputation", title: "Abuse of Reputation Systems" },
  { id: "merchant", title: "Abuse of Merchant Programs" },
  { id: "harmful", title: "Harmful Conduct" },
  { id: "enforcement", title: "Enforcement" },
  { id: "reporting", title: "Reporting Violations" },
  { id: "changes", title: "Changes to This Policy" },
];

const ProhibitedUse = () => {
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
      <SEO canonical="https://www.blip.money/prohibited-use" />

      <div className="min-h-screen text-black dark:text-white mt-12">
        {/* Hero Header */}
        <div className="py-8 px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
              Prohibited Use Policy
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
                  This Prohibited Use Policy ("Policy") forms part of the Terms
                  of Service governing the use of BLIP.money ("Blip.money", "we",
                  "our", or "us").
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  By accessing or using the Services, you agree not to engage in
                  any prohibited activities described herein.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
                  Violation of this Policy may result in suspension, termination,
                  restricted access, or other protective measures.
                </p>

                {/* Section 1 */}
                <section id="illegal" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    1. Illegal Activities
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    You may not use the Services for any unlawful purpose.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Prohibited activities include:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Violations of applicable laws.</li>
                    <li>Criminal conduct.</li>
                    <li>Fraudulent schemes.</li>
                    <li>Unauthorized financial activities.</li>
                    <li>Activities prohibited within your jurisdiction.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Users are solely responsible for determining the legality of
                    their activities.
                  </p>
                </section>

                {/* Section 2 */}
                <section id="money-laundering" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    2. Money Laundering
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    You may not use the Services to:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Conceal the origin of funds.</li>
                    <li>Layer transactions.</li>
                    <li>
                      Structure transactions to evade reporting requirements.
                    </li>
                    <li>Facilitate illicit financial activities.</li>
                    <li>Assist others in unlawful conduct.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Blip.money reserves the right to restrict access where
                    suspicious activity is detected.
                  </p>
                </section>

                {/* Section 3 */}
                <section id="sanctions" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    3. Sanctions Evasion
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Users may not:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                    <li>Violate applicable sanctions laws.</li>
                    <li>Transact with sanctioned persons or entities.</li>
                    <li>Facilitate prohibited transactions.</li>
                    <li>Attempt to conceal sanctioned activity.</li>
                  </ul>
                </section>

                {/* Section 4 */}
                <section id="fraud" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">4. Fraud</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Users are prohibited from:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Misrepresentation.</li>
                    <li>False claims.</li>
                    <li>Impersonation.</li>
                    <li>Identity deception.</li>
                    <li>Fake payment confirmations.</li>
                    <li>Social engineering.</li>
                    <li>Counterparty fraud.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Fraudulent conduct may result in immediate restrictions.
                  </p>
                </section>

                {/* Section 5 */}
                <section id="stolen-funds" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    5. Stolen or Unauthorized Funds
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Users shall not:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                    <li>Transfer stolen assets.</li>
                    <li>Use compromised accounts.</li>
                    <li>Use unauthorized payment methods.</li>
                    <li>
                      Participate in theft or unlawful acquisition of funds.
                    </li>
                  </ul>
                </section>

                {/* Section 6 */}
                <section id="terrorist" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    6. Terrorist Financing
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    The Services may not be used to:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                    <li>Support terrorism.</li>
                    <li>Finance unlawful organizations.</li>
                    <li>Facilitate prohibited activities.</li>
                  </ul>
                </section>

                {/* Section 7 */}
                <section id="exploitation" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    7. Child Exploitation and Human Trafficking
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Users may not utilize the Services in connection with:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Human trafficking.</li>
                    <li>Child exploitation.</li>
                    <li>Sexual exploitation.</li>
                    <li>Any activity involving abuse or violence.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Such conduct is strictly prohibited.
                  </p>
                </section>

                {/* Section 8 */}
                <section id="manipulation" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    8. Market Manipulation
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Users may not engage in:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                    <li>Wash trading.</li>
                    <li>Price manipulation.</li>
                    <li>Artificial activity.</li>
                    <li>Reputation manipulation.</li>
                    <li>Collusion.</li>
                    <li>False transaction reporting.</li>
                  </ul>
                </section>

                {/* Section 9 */}
                <section id="malicious" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    9. Malicious Activities
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Users shall not:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                    <li>Introduce malware.</li>
                    <li>Conduct phishing attacks.</li>
                    <li>Spread ransomware.</li>
                    <li>Deploy harmful code.</li>
                    <li>Attempt denial-of-service attacks.</li>
                    <li>Interfere with system operations.</li>
                  </ul>
                </section>

                {/* Section 10 */}
                <section id="software" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    10. Exploitation of Software
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Users may not:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Exploit bugs.</li>
                    <li>Manipulate smart contracts.</li>
                    <li>Circumvent restrictions.</li>
                    <li>Reverse engineer software.</li>
                    <li>Attempt unauthorized access.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Any discovered vulnerabilities should be reported responsibly.
                  </p>
                </section>

                {/* Section 11 */}
                <section id="automated" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    11. Automated Abuse
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Users may not:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Scrape data without authorization.</li>
                    <li>Use abusive bots.</li>
                    <li>Spam systems.</li>
                    <li>Generate excessive traffic.</li>
                    <li>Interfere with platform availability.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Reasonable API or automated access authorized by Blip.money is
                    permitted.
                  </p>
                </section>

                {/* Section 12 */}
                <section id="ip" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    12. Intellectual Property Violations
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Users may not:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                    <li>Copy proprietary materials.</li>
                    <li>Reproduce branding.</li>
                    <li>Create unauthorized derivative works.</li>
                    <li>Infringe copyrights or trademarks.</li>
                  </ul>
                </section>

                {/* Section 13 */}
                <section id="impersonation" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    13. Impersonation
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Users shall not:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                    <li>Pretend to be another person.</li>
                    <li>Use misleading identities.</li>
                    <li>Misrepresent affiliations.</li>
                    <li>Create deceptive accounts.</li>
                  </ul>
                </section>

                {/* Section 14 */}
                <section id="privacy" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    14. Privacy Violations
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Users may not:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                    <li>Harvest personal information.</li>
                    <li>Track individuals unlawfully.</li>
                    <li>Publish confidential information.</li>
                    <li>Violate the privacy rights of others.</li>
                  </ul>
                </section>

                {/* Section 15 */}
                <section id="reputation" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    15. Abuse of Reputation Systems
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Users may not:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                    <li>Manipulate reputation scores.</li>
                    <li>Create fake accounts.</li>
                    <li>Coordinate artificial activity.</li>
                    <li>Abuse feedback mechanisms.</li>
                  </ul>
                </section>

                {/* Section 16 */}
                <section id="merchant" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    16. Abuse of Merchant Programs
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Merchants and liquidity providers may not:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                    <li>Conduct fake transactions.</li>
                    <li>Collude with counterparties.</li>
                    <li>Abuse reward mechanisms.</li>
                    <li>Artificially inflate volume.</li>
                    <li>Misrepresent settlement status.</li>
                  </ul>
                </section>

                {/* Section 17 */}
                <section id="harmful" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    17. Harmful Conduct
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Users may not engage in:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Harassment.</li>
                    <li>Threats.</li>
                    <li>Hate speech.</li>
                    <li>Violence.</li>
                    <li>Abusive conduct.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Blip.money seeks to maintain a safe environment for
                    participants.
                  </p>
                </section>

                {/* Section 18 */}
                <section id="enforcement" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">18. Enforcement</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Blip.money reserves the right to:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Restrict access.</li>
                    <li>Suspend accounts.</li>
                    <li>Reduce reputation privileges.</li>
                    <li>Disable features.</li>
                    <li>Limit participation.</li>
                    <li>Permanently terminate access.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Protective measures may be taken without prior notice when
                    necessary to protect users or preserve marketplace integrity.
                  </p>
                </section>

                {/* Section 19 */}
                <section id="reporting" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    19. Reporting Violations
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Users are encouraged to report suspected abuse or violations
                    to:
                  </p>

                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    <a
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=abuse@blip.money"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black dark:text-white underline"
                    >
                      abuse@blip.money
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

                {/* Section 20 */}
                <section id="changes" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    20. Changes to This Policy
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Blip.money reserves the right to modify this Policy at any
                    time.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Continued use of the Services constitutes acceptance of
                    revised policies.
                  </p>
                </section>

                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  By accessing or using the Services, you acknowledge that you
                  have read, understood, and agreed to this Prohibited Use
                  Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProhibitedUse;
