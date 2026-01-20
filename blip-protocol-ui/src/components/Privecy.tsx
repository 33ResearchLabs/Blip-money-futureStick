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
  description="Learn how Blip Money collects, uses, and protects your personal data in accordance with privacy regulations."
  canonical="https://blip.money/privacy"
/>

    <div className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 tracking-tight">
          Privacy Policy
        </h1>

        {/* Intro — ORIGINAL TEXT */}
        <p className="text-gray-300 mb-8 leading-relaxed">
          This Privacy Policy describes how information is handled when you use
          the Blip.money decentralized protocol (the "Protocol") and its
          associated services (the "Services"). Our core mission is to provide a
          universal anonymous money protocol, and this policy reflects that
          commitment to your privacy.
        </p>

        {/* Section 1 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">
            1. The Principle of Anonymity
          </h2>
          <p className="text-gray-400 leading-relaxed">
            Blip.money is anonymous by design. Our goal is to collect the
            absolute minimum amount of information required for the Protocol to
            function.
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">
            2. Information We DO NOT Collect
          </h2>

          <p className="text-gray-400 mb-4 leading-relaxed">
            We do not require you to create an account, and we never collect any
            Personal Identifiable Information (PII). This includes, but is not
            limited to:
          </p>

          <ul className="list-disc list-inside text-gray-400 space-y-2">
            <li>Your name</li>
            <li>Your email address</li>
            <li>Your physical address or phone number</li>
            <li>Your government-issued identification or KYC documents</li>
            <li>Your IP address</li>
          </ul>

          <p className="text-gray-400 mt-4 leading-relaxed">
            Interaction with the Protocol is through your cryptocurrency wallet
            only. We have no way of linking your wallet to your real-world
            identity.
          </p>
        </section>

        {/* Section 3 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">
            3. Information We Collect
          </h2>

          <p className="text-gray-400 mb-4 leading-relaxed">
            The only information processed by our Services is the public data
            required for blockchain transactions to occur. This includes:
          </p>

          <ul className="list-disc list-inside text-gray-400 space-y-2">
            <li>
              <span className="text-white">Public Wallet Address:</span> Your
              wallet address is publicly visible on the blockchain. This is
              inherent to how all blockchain technologies function.
            </li>
            <li>
              <span className="text-white">Transaction Data:</span> Information
              related to your transactions, such as the transaction ID, asset
              type, and amount, is permanently recorded on the public blockchain.
            </li>
          </ul>

          <p className="text-gray-400 mt-4 leading-relaxed">
            This information is pseudonymous and is not linked to your personal
            identity by us.
          </p>
        </section>

        {/* Section 4 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">
            4. How We Use Information
          </h2>

          <p className="text-gray-400 mb-4 leading-relaxed">
            The public blockchain data we process is used exclusively to:
          </p>

          <ul className="list-disc list-inside text-gray-400 space-y-2">
            <li>Facilitate peer-to-peer transactions through the Protocol.</li>
            <li>
              Enable the functioning of the smart contract escrow system.
            </li>
            <li>
              Display transaction history associated with public wallet
              addresses.
            </li>
          </ul>

          <p className="text-gray-400 mt-4 leading-relaxed">
            We do not use this data for tracking, analytics, or marketing
            purposes.
          </p>
        </section>

        {/* Section 5 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">
            5. Data Security
          </h2>
          <p className="text-gray-400 leading-relaxed">
            While the Protocol is designed to be secure, you are solely
            responsible for the security of your personal cryptocurrency wallet,
            private keys, and seed phrases. Never share your private keys or seed
            phrase with anyone. Blip.money developers will never ask you for
            them. The security of your funds depends on your own security
            practices.
          </p>
        </section>

        {/* Section 6 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">
            6. Third-Party Services
          </h2>
          <p className="text-gray-400 leading-relaxed">
            The Blip.money website may contain links to third-party websites or
            services (e.g., community channels like Telegram or Discord). This
            Privacy Policy does not apply to those third-party services. We
            encourage you to review their privacy policies before interacting
            with them.
          </p>
        </section>

        {/* Section 7 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">
            7. Changes to This Policy
          </h2>
          <p className="text-gray-400 leading-relaxed">
            We may update this Privacy Policy from time to time. When we do, we
            will post the updated policy on our website and update the "Last
            Updated" date at the top of this policy.
          </p>
        </section>

        {/* Section 8 */}
        <section>
          <h2 className="text-xl font-semibold mb-3">
            8. Contact Information
          </h2>
          <p className="text-gray-400 leading-relaxed">
            For any questions about this Privacy Policy, please contact us
            through our official channels.
          </p>
        </section>
      </div>
    </div>
    </>
  );
};

export default Privacy;
