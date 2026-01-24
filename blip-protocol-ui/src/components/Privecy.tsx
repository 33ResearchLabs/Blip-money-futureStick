import React, { useEffect } from "react";
import SEO from "./SEO";

const Privacy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO
        title="Privacy Policy | Blip Money"
        description="Learn how blip.money collects, uses, and protects information when you use our non-custodial escrow protocol."
        canonical="https://blip.money/privacy"
      />

      <div className="min-h-screen bg-black text-white px-6 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight">
            Privacy Policy
          </h1>

          <p className="text-gray-500 mb-6 text-sm">
            {" "}
            Last updated: {new Date().toLocaleDateString("en-GB")}
          </p>

          {/* Intro */}
          <p className="text-gray-300 mb-8 leading-relaxed">
            blip.money (we, our, or, us) operates a non-custodial escrow and
            coordination protocol for peer-to-peer digital asset and fiat
            transactions. We take privacy and data protection seriously.
          </p>

          <p className="text-gray-300 mb-10 leading-relaxed">
            This Privacy Policy explains how we collect, use, store, and protect
            information when you use the blip.money platform, website,
            applications, and related services (collectively, the "Services").
          </p>

          {/* Section 1 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">
              1. Information We Collect
            </h2>

            <p className="text-gray-400 mb-4 leading-relaxed">
              We may collect and process the following categories of information
              depending on how you use the Services.
            </p>

            <p className="text-white mb-2 font-medium">
              1.1 Information You Provide
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2 mb-4">
              <li>Email address or username (if applicable)</li>
              <li>Wallet addresses</li>
              <li>Identity or verification information (only when required)</li>
              <li>Communications with support</li>
              <li>Dispute-related documents, proofs, or explanations</li>
            </ul>

            <p className="text-white mb-2 font-medium">
              1.2 Automatically Collected Information
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2 mb-4">
              <li>IP address, device type, and browser type</li>
              <li>Log data, timestamps, and usage patterns</li>
              <li>Security and fraud-prevention signals</li>
            </ul>

            <p className="text-white mb-2 font-medium">
              1.3 Transaction Metadata
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Transaction references or identifiers</li>
              <li>Timestamps, amounts, and transaction status</li>
            </ul>

            <p className="text-gray-400 mt-4 leading-relaxed">
              blip.money does not custody user funds and does not store private
              keys or wallet credentials.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">
              2. How We Use Your Information
            </h2>

            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Operate, maintain, and secure the platform</li>
              <li>Facilitate escrow coordination and dispute resolution</li>
              <li>Detect, prevent, and mitigate fraud or abuse</li>
              <li>Comply with legal and regulatory obligations</li>
              <li>Improve performance, security, and user experience</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">
              3. Legal Basis for Processing
            </h2>

            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Contractual necessity to provide the Services</li>
              <li>Compliance with legal obligations</li>
              <li>
                Legitimate interests such as security, fraud prevention, and
                system integrity
              </li>
              <li>Your consent, where required by law</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">4. Data Sharing</h2>

            <p className="text-gray-400 mb-4 leading-relaxed">
              We may share limited information with:
            </p>

            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Compliance and verification partners</li>
              <li>Dispute resolution service providers</li>
              <li>
                Law enforcement or regulatory authorities when legally required
              </li>
            </ul>

            <p className="text-gray-400 mt-4 leading-relaxed">
              We do not sell personal data.
            </p>
          </section>

          {/* Section 5 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">5. Data Retention</h2>

            <p className="text-gray-400 leading-relaxed">
              We retain information only for as long as necessary to operate and
              secure the Services, comply with legal obligations, resolve
              disputes, and prevent fraud or abuse.
            </p>

            <p className="text-gray-400 mt-4 leading-relaxed">
              Blockchain transaction data is permanent and is not controlled by
              blip.money.
            </p>
          </section>

          {/* Section 6 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">6. Data Security</h2>

            <p className="text-gray-400 leading-relaxed">
              We use appropriate technical and organizational security measures,
              including encryption, access controls, monitoring, and secure
              infrastructure practices. However, no system is completely secure,
              and absolute security cannot be guaranteed.
            </p>
          </section>

          {/* Section 7 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">
              7. International Data Transfers
            </h2>

            <p className="text-gray-400 leading-relaxed">
              Your information may be processed in multiple jurisdictions
              depending on our infrastructure and operational needs. Where
              required, appropriate safeguards are applied.
            </p>
          </section>

          {/* Section 8 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">8. Your Rights</h2>

            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Access information about you</li>
              <li>Request correction of your information</li>
              <li>Request deletion of your information</li>
              <li>Request a copy (export) of your information</li>
              <li>Restrict or object to certain processing activities</li>
            </ul>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">9. Contact</h2>

            <p className="text-gray-400 leading-relaxed">
              If you have any questions about this Privacy Policy or our data
              practices, you may contact us at:
            </p>

            <p className="text-gray-300 mt-2">
              Email:{" "}
              <a
                href="mailto:privacy@blip.money"
                className="text-white underline"
              >
                privacy@blip.money
              </a>
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default Privacy;
