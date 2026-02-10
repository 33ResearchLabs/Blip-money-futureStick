import { useEffect } from "react";
import SEO from "./SEO";

const sections = [
  { id: "nature", title: "Nature of the Service" },
  { id: "responsibilities", title: "User Responsibilities" },
  { id: "escrow", title: "Escrow System" },
  { id: "merchant", title: "Merchant Terms" },
  { id: "disputes", title: "Dispute Resolution" },
  { id: "risk", title: "Risk Disclosure" },
  { id: "aml", title: "AML / CTF Policy" },
  { id: "suspension", title: "Account Suspension" },
  { id: "liability", title: "Limitation of Liability" },
  { id: "jurisdiction", title: "Jurisdiction" },
  { id: "termination", title: "Termination of Service" },
  { id: "changes", title: "Changes to Terms" },
];

const TermsService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
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
        title="Terms of Service | blip.money"
        description="Read the Terms of Service governing your use of the blip.money protocol and services."
        canonical="https://blip.money/terms"
      />

      <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0a0a0b] text-black dark:text-white">
        {/* Hero Header */}
        <div className="pt-32 pb-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight italic">
              Terms of Service
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
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">
                    Contents
                  </p>
                  <nav className="space-y-2">
                    {sections.map((section, index) => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className="block text-sm text-gray-500 dark:text-gray-400 hover:text-white transition-colors text-left"
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
                  These Terms of Service ("Terms") govern your access to and use
                  of the blip.money protocol, website, applications, and related
                  services (collectively, the "Services").
                </p>

                <p className="text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
                  By accessing or using blip.money, you agree to be bound by
                  these Terms.
                </p>

                {/* Section 1 */}
                <section id="nature" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    1. Nature of the Service
                  </h2>

                  <p className="text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                    blip.money is:
                  </p>

                  <ul className="list-disc list-inside text-gray-500 dark:text-gray-400 space-y-2 mb-4">
                    <li>A non-custodial escrow coordination protocol</li>
                    <li>
                      A technology platform that facilitates peer-to-peer
                      transactions
                    </li>
                  </ul>

                  <p className="text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                    blip.money is not:
                  </p>

                  <ul className="list-disc list-inside text-gray-500 dark:text-gray-400 space-y-2 mb-4">
                    <li>A bank</li>
                    <li>A wallet provider</li>
                    <li>A payment institution</li>
                    <li>A financial intermediary</li>
                    <li>A custodian of funds</li>
                  </ul>

                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    blip.money does not hold user funds. Funds remain in smart
                    contracts or in accounts controlled by users or their chosen
                    payment providers.
                  </p>
                </section>

                {/* Section 2 */}
                <section id="responsibilities" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    2. User Responsibilities
                  </h2>

                  <ul className="list-disc list-inside text-gray-500 dark:text-gray-400 space-y-2">
                    <li>You control your wallet(s), accounts, and funds</li>
                    <li>
                      You understand the risks associated with cryptocurrencies
                      and peer-to-peer transactions
                    </li>
                    <li>
                      You are solely responsible for all actions taken using
                      your wallet or account
                    </li>
                    <li>
                      You are responsible for complying with all applicable laws
                      and regulations
                    </li>
                    <li>
                      You will not use the Services for illegal, fraudulent, or
                      abusive activities
                    </li>
                  </ul>
                </section>

                {/* Section 3 */}
                <section id="escrow" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    3. Escrow System (User Escrow Agreement)
                  </h2>

                  <p className="text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                    When you open or participate in a trade:
                  </p>

                  <ul className="list-disc list-inside text-gray-500 dark:text-gray-400 space-y-2 mb-4">
                    <li>
                      Funds are locked using escrow logic defined by the
                      Protocol
                    </li>
                    <li>
                      Funds are released only when both parties confirm
                      completion or a dispute resolution decision is made
                    </li>
                  </ul>

                  <p className="text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                    By using the escrow system, you agree that any proofs,
                    documents, or information you submit are truthful, accurate,
                    and not misleading.
                  </p>

                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    Submitting false or fraudulent evidence may result in
                    permanent suspension, loss of access to the platform, and
                    cooperation with law enforcement where required.
                  </p>
                </section>

                {/* Section 4 */}
                <section id="merchant" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    4. Merchant Terms (Merchant Agreement)
                  </h2>

                  <ul className="list-disc list-inside text-gray-500 dark:text-gray-400 space-y-2 mb-4">
                    <li>
                      You will provide genuine liquidity and legitimate services
                    </li>
                    <li>You will honor advertised prices and availability</li>
                    <li>You will use lawful and compliant payment channels</li>
                    <li>
                      You will respond to disputes and user requests within
                      required timeframes
                    </li>
                  </ul>

                  <p className="text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                    You accept the risks associated with bank freezes, payment
                    reversals, and local regulatory obligations.
                  </p>

                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    blip.money reserves the right to impose restrictions or
                    suspend merchant accounts at its sole discretion.
                  </p>
                </section>

                {/* Section 5 */}
                <section id="disputes" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    5. Dispute Resolution Framework
                  </h2>

                  <p className="text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                    In the event of a dispute, both parties must submit relevant
                    evidence. Disputes are reviewed using internal processes.
                  </p>

                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    You acknowledge that blip.money is not a court and only
                    determines how escrowed funds are routed within the
                    Protocol. Decisions are final within the platform.
                  </p>
                </section>

                {/* Section 6 */}
                <section id="risk" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    6. Risk Disclosure
                  </h2>

                  <ul className="list-disc list-inside text-gray-500 dark:text-gray-400 space-y-2">
                    <li>Cryptocurrency price volatility</li>
                    <li>Payment reversals or bank account freezes</li>
                    <li>Regulatory or legal changes</li>
                    <li>Counterparty default or fraud</li>
                    <li>Blockchain or smart contract failures</li>
                  </ul>

                  <p className="text-gray-500 dark:text-gray-400 mt-4 leading-relaxed">
                    You use the Services at your own risk.
                  </p>
                </section>

                {/* Section 7 */}
                <section id="aml" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    7. AML / CTF Policy
                  </h2>

                  <p className="text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                    blip.money operates a risk-based compliance and
                    abuse-prevention framework, which may include monitoring,
                    sanctions screening, and mandatory verification in certain
                    cases.
                  </p>

                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    Money laundering, terrorist financing, sanctions evasion,
                    and fraud are strictly prohibited.
                  </p>
                </section>

                {/* Section 8 */}
                <section id="suspension" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    8. Account Suspension and Enforcement
                  </h2>

                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    blip.money may suspend or terminate access to the Services
                    at any time in cases of fraud, abuse, legal risk, or
                    violation of these Terms.
                  </p>
                </section>

                {/* Section 9 */}
                <section id="liability" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    9. Limitation of Liability
                  </h2>

                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    To the maximum extent permitted by law, blip.money shall not
                    be liable for indirect, incidental, special, or
                    consequential damages arising from use of the Services.
                  </p>
                </section>

                {/* Section 10 */}
                <section id="jurisdiction" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    10. Jurisdiction and Arbitration
                  </h2>

                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    Jurisdiction and dispute resolution methods may vary based
                    on your location and the nature of the dispute.
                  </p>
                </section>

                {/* Section 11 */}
                <section id="termination" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    11. Termination of Service
                  </h2>

                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    blip.money may terminate or restrict access to the Services
                    at any time in accordance with applicable law.
                  </p>
                </section>

                {/* Section 12 */}
                <section id="changes">
                  <h2 className="text-xl font-semibold mb-3">
                    12. Changes to These Terms
                  </h2>

                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    We may update these Terms from time to time. Continued use
                    of the Services constitutes acceptance of the updated Terms.
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

export default TermsService;
