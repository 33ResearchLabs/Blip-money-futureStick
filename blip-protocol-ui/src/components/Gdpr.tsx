import React, { useEffect } from "react";
import SEO from "./SEO";

const Gdpr = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO
        title="GDPR Compliance | Blip Money"
        description="Learn how Blip Money complies with GDPR and protects user data and privacy rights."
        canonical="https://blip.money/gdpr"
      />

      <div className="min-h-screen bg-black text-white px-6 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold mb-6 tracking-tight">
            GDPR Compliance Statement for Blip.money
          </h1>

          {/* Section 1 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">
              1. Our Commitment to Data Protection and GDPR
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Blip.money is fundamentally designed to be a privacy-preserving,
              trust-minimized protocol. Our approach to privacy and data
              protection, including compliance with the General Data Protection
              Regulation (GDPR), is rooted in the principle of data
              minimization. We are committed to not collecting or processing
              personal data.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">
              2. Data Controller and Processor
            </h2>
            <p className="text-gray-400 leading-relaxed">
              The Blip.money protocol is a decentralized, autonomous software
              application. There is no central entity that acts as a data
              controller or data processor in the traditional sense. Interaction
              with the protocol is peer-to-peer (P2P) or between a user and an
              independent merchant. We, the developers and contributors, do not
              have access to, manage, or process any personal data related to
              transactions on the protocol.
            </p>
          </section>

          {/* Section 3 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">
              3. Personal Data Collection and Processing
            </h2>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Blip.money is privacy-preserving by design. We do not collect,
              store, or process any Personal Identifiable Information (PII).
              This includes:
            </p>

            <ul className="list-disc list-inside text-gray-400 space-y-2 mb-4">
              <li>
                Names, email addresses, phone numbers, or physical addresses.
              </li>
              <li>IP addresses or device identifiers.</li>
              <li>KYC (Know Your Customer) documentation.</li>
            </ul>

            <p className="text-gray-400 leading-relaxed">
              Your interaction with the protocol is solely through a
              non-custodial cryptocurrency wallet. We have no means of linking
              your public wallet address to your real-world identity.
            </p>
          </section>

          {/* Section 4 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">
              4. Blockchain and Public Data
            </h2>
            <p className="text-gray-400 mb-4 leading-relaxed">
              All transactions conducted on the Blip.money protocol are recorded
              on a public blockchain. This is an inherent and necessary feature
              of decentralized technology. This on-chain data includes:
            </p>

            <ul className="list-disc list-inside text-gray-400 space-y-2 mb-4">
              <li>Pseudonymous wallet addresses.</li>
              <li>Transaction amounts and timestamps.</li>
            </ul>

            <p className="text-gray-400 leading-relaxed">
              This information is public by nature and is not controlled by
              Blip.money. Users should be aware that blockchain data is
              immutable and public. Your on-chain privacy is your own
              responsibility.
            </p>
          </section>

          {/* Section 5 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">
              5. User Rights Under GDPR
            </h2>
            <p className="text-gray-400 mb-4 leading-relaxed">
              GDPR grants individuals several rights concerning their personal
              data, including the right to access, rectify, erase, and restrict
              processing.
            </p>

            <p className="text-gray-400 mb-4 leading-relaxed">
              Since Blip.money does not collect or store any of your personal
              data, these rights are not directly applicable in the conventional
              sense. You are in full control of your data.
            </p>

            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>
                <span className="text-white">Control:</span> You control your
                funds and data via your personal, non-custodial wallet and
                private keys.
              </li>
              <li>
                <span className="text-white">Anonymity:</span> As we do not link
                your identity to your wallet address, there is no "personal
                data" for us to access, rectify, or erase on your behalf.
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">
              6. Legal Basis for Processing
            </h2>
            <p className="text-gray-400 leading-relaxed">
              We do not process personal data, and therefore, we do not require
              a legal basis for processing under GDPR. The functioning of the
              protocol relies on the public and pseudonymous nature of
              blockchain technology, which users opt-in to use.
            </p>
          </section>

          {/* Section 7 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">7. Data Security</h2>
            <p className="text-gray-400 leading-relaxed">
              While we do not hold your data, we are committed to the security
              of the protocol itself. However, the security of your assets is
              your responsibility. You are solely responsible for securing your
              wallet's private keys and seed phrase.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">8. Conclusion</h2>
            <p className="text-gray-400 leading-relaxed">
              Blip.money's architecture is designed to be fundamentally
              compliant with the spirit of GDPR by championing data minimization
              and user control. By not collecting personal data, we provide a
              service that respects user privacy at its core.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default Gdpr;
