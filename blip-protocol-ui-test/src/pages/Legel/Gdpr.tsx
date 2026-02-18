import { useEffect, useState } from "react";
import SEO from "../../components/SEO";

const sections = [
  { id: "commitment", title: "Commitment to GDPR" },
  { id: "controller", title: "Data Controller" },
  { id: "collection", title: "Personal Data Collection" },
  { id: "blockchain", title: "Blockchain & Public Data" },
  { id: "rights", title: "User Rights Under GDPR" },
  { id: "legal-basis", title: "Legal Basis" },
  { id: "security", title: "Data Security" },
  { id: "conclusion", title: "Conclusion" },
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
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <SEO
        title=" Blip Money – GDPR & Data Protection Policy"
        description="Discover how Blip Money complies with GDPR regulations and protects your personal data, privacy rights, and information security."
        canonical="https://blip.money/gdpr"
      />

      <div className="min-h-screen text-black dark:text-white mt-12">
        {/* Hero Header */}
        <div className="py-8 px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
              GDPR Compliance
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
                {/* Section 1 */}
                <section id="commitment" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    1. Our Commitment to Data Protection and GDPR
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    Blip.money is fundamentally designed to be a
                    privacy-preserving, trust-minimized protocol. Our approach
                    to privacy and data protection, including compliance with
                    the General Data Protection Regulation (GDPR), is rooted in
                    the principle of data minimization. We are committed to not
                    collecting or processing personal data.
                  </p>
                </section>

                {/* Section 2 */}
                <section id="controller" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    2. Data Controller and Processor
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    The Blip.money protocol is a decentralized, autonomous
                    software application. There is no central entity that acts
                    as a data controller or data processor in the traditional
                    sense. Interaction with the protocol is peer-to-peer (P2P)
                    or between a user and an independent merchant. We, the
                    developers and contributors, do not have access to, manage,
                    or process any personal data related to transactions on the
                    protocol.
                  </p>
                </section>

                {/* Section 3 */}
                <section id="collection" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    3. Personal Data Collection and Processing
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                    Blip.money is privacy-preserving by design. We do not
                    collect, store, or process any Personal Identifiable
                    Information (PII). This includes:
                  </p>

                  <ul className="list-disc list-inside text-gray-500 dark:text-gray-400 space-y-2 mb-4">
                    <li>
                      Names, email addresses, phone numbers, or physical
                      addresses.
                    </li>
                    <li>IP addresses or device identifiers.</li>
                    <li>KYC (Know Your Customer) documentation.</li>
                  </ul>

                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    Your interaction with the protocol is solely through a
                    non-custodial cryptocurrency wallet. We have no means of
                    linking your public wallet address to your real-world
                    identity.
                  </p>
                </section>

                {/* Section 4 */}
                <section id="blockchain" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    4. Blockchain and Public Data
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                    All transactions conducted on the Blip.money protocol are
                    recorded on a public blockchain. This is an inherent and
                    necessary feature of decentralized technology. This on-chain
                    data includes:
                  </p>

                  <ul className="list-disc list-inside text-gray-500 dark:text-gray-400 space-y-2 mb-4">
                    <li>Pseudonymous wallet addresses.</li>
                    <li>Transaction amounts and timestamps.</li>
                  </ul>

                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    This information is public by nature and is not controlled
                    by Blip.money. Users should be aware that blockchain data is
                    immutable and public. Your on-chain privacy is your own
                    responsibility.
                  </p>
                </section>

                {/* Section 5 */}
                <section id="rights" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    5. User Rights Under GDPR
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                    GDPR grants individuals several rights concerning their
                    personal data, including the right to access, rectify,
                    erase, and restrict processing.
                  </p>

                  <p className="text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                    Since Blip.money does not collect or store any of your
                    personal data, these rights are not directly applicable in
                    the conventional sense. You are in full control of your
                    data.
                  </p>

                  <ul className="list-disc list-inside text-gray-500 dark:text-gray-400 space-y-2">
                    <li>
                      <span className="text-black dark:text-white">
                        Control :
                      </span>{" "}
                      You control your funds and data via your personal,
                      non-custodial wallet and private keys.
                    </li>
                    <li>
                      <span className="text-black dark:text-white">
                        Privacy :
                      </span>{" "}
                      As we do not link your identity to your wallet address,
                      there is no "personal data" for us to access, rectify, or
                      erase on your behalf.
                    </li>
                  </ul>
                </section>

                {/* Section 6 */}
                <section id="legal-basis" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    6. Legal Basis for Processing
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    We do not process personal data, and therefore, we do not
                    require a legal basis for processing under GDPR. The
                    functioning of the protocol relies on the public and
                    pseudonymous nature of blockchain technology, which users
                    opt-in to use.
                  </p>
                </section>

                {/* Section 7 */}
                <section id="security" className="mb-8">
                  <h2 className="text-xl font-semibold mb-3">
                    7. Data Security
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    While we do not hold your data, we are committed to the
                    security of the protocol itself. However, the security of
                    your assets is your responsibility. You are solely
                    responsible for securing your wallet's private keys and seed
                    phrase.
                  </p>
                </section>

                {/* Section 8 */}
                <section id="conclusion">
                  <h2 className="text-xl font-semibold mb-3">8. Conclusion</h2>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    Blip.money's architecture is designed to be fundamentally
                    compliant with the spirit of GDPR by championing data
                    minimization and user control. By not collecting personal
                    data, we provide a service that respects user privacy at its
                    core.
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

export default Gdpr;
