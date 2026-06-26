import { useEffect, useState } from "react";
import SEO from "@/components/SEO";

const sections = [
  { id: "introduction", title: "Introduction" },
  { id: "collect", title: "Information We Collect" },
  { id: "not-collect", title: "Information We Do Not Collect" },
  { id: "use", title: "How We Use Information" },
  { id: "blockchain", title: "Blockchain Data" },
  { id: "cookies", title: "Cookies and Tracking Technologies" },
  { id: "analytics", title: "Analytics" },
  { id: "sharing", title: "Information Sharing" },
  { id: "retention", title: "Data Retention" },
  { id: "security", title: "Security" },
  { id: "third-party", title: "Third-Party Services" },
  { id: "transfers", title: "International Transfers" },
  { id: "children", title: "Children's Privacy" },
  { id: "rights", title: "Your Rights" },
  { id: "changes", title: "Changes to This Privacy Policy" },
  { id: "contact", title: "Contact Us" },
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
      const offset = 30;
      const top =
        element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <>
      <SEO
        canonical="https://www.blip.money/privacy"
      />

      <div className="min-h-screen  text-black dark:text-white mt-12">
        {/* Hero Header */}
        <div className="py-8 px-6 ">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight ">
              Privacy Policy
            </h1>
          </div>
        </div>

        {/* Content Area with Sidebar */}
        {/* <div className="bg-gray-50 dark:bg-[#111111]"> */}
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
                    Welcome to blip.money ("blip.money", "we", "our", or "us").
                  </p>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    This Privacy Policy explains how information is collected,
                    used, disclosed, and protected when you access or use the
                    blip.money website, applications, protocol, interfaces, APIs,
                    smart contracts, and related services (collectively, the
                    "Services").
                  </p>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Blip.money is committed to protecting user privacy while
                    providing access to decentralized peer-to-peer marketplace
                    infrastructure.
                  </p>

                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    By accessing or using the Services, you acknowledge and agree
                    to the practices described in this Privacy Policy.
                  </p>
                </section>

                {/* Section 1 */}
                <section id="collect" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    1. Information We Collect
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Blip.money seeks to minimize the collection of personal
                    information. Depending on your use of the Services, we may
                    collect the following information.
                  </p>

                  <p className="text-black dark:text-white mb-2 font-medium">
                    Information You Provide
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    You may voluntarily provide:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Email address.</li>
                    <li>Username.</li>
                    <li>Telegram username.</li>
                    <li>Support communications.</li>
                    <li>Feedback and reports.</li>
                  </ul>

                  <p className="text-black dark:text-white mb-2 font-medium">
                    Wallet Information
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    When connecting a wallet, we may access:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Public wallet addresses.</li>
                    <li>Blockchain transaction history.</li>
                    <li>Public on-chain activity.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Wallet addresses and blockchain transactions are public by
                    nature and are not considered confidential information.
                  </p>

                  <p className="text-black dark:text-white mb-2 font-medium">
                    Technical Information
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    We may automatically collect:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>IP address.</li>
                    <li>Device information.</li>
                    <li>Browser type.</li>
                    <li>Operating system.</li>
                    <li>Session information.</li>
                    <li>Referral URLs.</li>
                    <li>Usage statistics.</li>
                    <li>Crash reports.</li>
                  </ul>

                  <p className="text-black dark:text-white mb-2 font-medium">
                    Cookies and Analytics
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    We may use:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                    <li>Cookies.</li>
                    <li>Local storage.</li>
                    <li>Analytics technologies.</li>
                    <li>Performance monitoring tools.</li>
                  </ul>
                </section>

                {/* Section 2 */}
                <section id="not-collect" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    2. Information We Do Not Collect
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Blip.money does not intentionally collect:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Private keys.</li>
                    <li>Seed phrases.</li>
                    <li>Passwords to external wallets.</li>
                    <li>Bank account credentials.</li>
                    <li>Debit or credit card information.</li>
                    <li>Social security numbers.</li>
                    <li>Government identification documents.</li>
                    <li>Biometric information.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Blip.money does not have access to your non-custodial wallet.
                  </p>
                </section>

                {/* Section 3 */}
                <section id="use" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    3. How We Use Information
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Information may be used to:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                    <li>Operate and improve the Services.</li>
                    <li>Maintain security.</li>
                    <li>Prevent abuse and fraud.</li>
                    <li>Respond to support requests.</li>
                    <li>Analyze platform usage.</li>
                    <li>Detect technical issues.</li>
                    <li>Communicate updates and announcements.</li>
                    <li>Enforce our Terms of Service.</li>
                  </ul>
                </section>

                {/* Section 4 */}
                <section id="blockchain" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    4. Blockchain Data
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Blockchain transactions are public and immutable.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Blip.money cannot:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Delete blockchain records.</li>
                    <li>Modify blockchain data.</li>
                    <li>Restrict access to public blockchains.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Users acknowledge that transactions conducted through public
                    blockchains may remain permanently visible to others.
                  </p>
                </section>

                {/* Section 5 */}
                <section id="cookies" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    5. Cookies and Tracking Technologies
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Blip.money may use cookies and similar technologies to:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Remember preferences.</li>
                    <li>Improve performance.</li>
                    <li>Measure usage.</li>
                    <li>Maintain sessions.</li>
                    <li>Enhance user experience.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Users may disable cookies through browser settings, although
                    some features may not function properly.
                  </p>
                </section>

                {/* Section 6 */}
                <section id="analytics" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">6. Analytics</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Blip.money may use third-party analytics providers to better
                    understand platform usage.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Analytics providers may collect:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Device information.</li>
                    <li>Browser information.</li>
                    <li>Usage metrics.</li>
                    <li>IP addresses.</li>
                    <li>Session activity.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Analytics data is used solely to improve the Services.
                  </p>
                </section>

                {/* Section 7 */}
                <section id="sharing" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    7. Information Sharing
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Blip.money does not sell personal information.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Information may be shared with:
                  </p>

                  <p className="text-black dark:text-white mb-2 font-medium">
                    Service Providers
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Third parties assisting with:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Hosting.</li>
                    <li>Analytics.</li>
                    <li>Infrastructure.</li>
                    <li>Customer support.</li>
                    <li>Security monitoring.</li>
                  </ul>

                  <p className="text-black dark:text-white mb-2 font-medium">
                    Legal Compliance
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Information may be disclosed when necessary to:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Comply with legal obligations.</li>
                    <li>Respond to lawful requests.</li>
                    <li>Protect users.</li>
                    <li>Prevent fraud.</li>
                    <li>Enforce our policies.</li>
                  </ul>

                  <p className="text-black dark:text-white mb-2 font-medium">
                    Corporate Transactions
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    In connection with:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                    <li>Mergers.</li>
                    <li>Acquisitions.</li>
                    <li>Asset sales.</li>
                    <li>Reorganizations.</li>
                  </ul>
                </section>

                {/* Section 8 */}
                <section id="retention" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    8. Data Retention
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Information may be retained:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>For as long as necessary to provide the Services.</li>
                    <li>To comply with legal obligations.</li>
                    <li>To resolve disputes.</li>
                    <li>To enforce agreements.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Blockchain records are permanent and cannot be deleted by
                    blip.money.
                  </p>
                </section>

                {/* Section 9 */}
                <section id="security" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">9. Security</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Blip.money employs commercially reasonable security measures.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    However, no method of electronic transmission or storage is
                    completely secure.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Users acknowledge that:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Internet communications carry inherent risks.</li>
                    <li>Unauthorized access may occur.</li>
                    <li>Data breaches may occur despite safeguards.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Blip.money cannot guarantee absolute security.
                  </p>
                </section>

                {/* Section 10 */}
                <section id="third-party" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    10. Third-Party Services
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    The Services may integrate with or link to third-party
                    services, including:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Wallet providers.</li>
                    <li>Blockchain networks.</li>
                    <li>RPC providers.</li>
                    <li>Analytics providers.</li>
                    <li>Communication platforms.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Blip.money does not control third-party services and is not
                    responsible for their privacy practices.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Users should review the policies of those third parties
                    independently.
                  </p>
                </section>

                {/* Section 11 */}
                <section id="transfers" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    11. International Transfers
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    By using the Services, you acknowledge that information may
                    be processed and stored in multiple jurisdictions depending
                    on infrastructure providers and service partners.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Protection standards may differ between jurisdictions.
                  </p>
                </section>

                {/* Section 12 */}
                <section id="children" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    12. Children's Privacy
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    The Services are not directed to individuals under the age of
                    eighteen (18).
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Blip.money does not knowingly collect information from minors.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    If information from a minor is identified, reasonable efforts
                    will be made to delete such information.
                  </p>
                </section>

                {/* Section 13 */}
                <section id="rights" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">13. Your Rights</h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Subject to applicable laws, users may have rights to:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                    <li>Access information.</li>
                    <li>Correct inaccurate information.</li>
                    <li>Request deletion.</li>
                    <li>Restrict processing.</li>
                    <li>Object to certain processing activities.</li>
                    <li>Receive copies of personal information.</li>
                  </ul>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Certain rights may be limited by technical or legal
                    constraints, including the immutable nature of blockchain
                    records.
                  </p>
                </section>

                {/* Section 14 */}
                <section id="changes" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    14. Changes to This Privacy Policy
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Blip.money may update this Privacy Policy from time to time.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    Changes become effective upon publication.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Continued use of the Services constitutes acceptance of any
                    revised Privacy Policy.
                  </p>
                </section>

                {/* Section 15 */}
                <section id="contact" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">15. Contact Us</h2>

                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Questions regarding this Privacy Policy may be directed to:
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
                  have read and understood this Privacy Policy and agree to its
                  terms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Privacy;
