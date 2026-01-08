import React, { useEffect } from "react";
import SEO from "./SEO";

const TermsService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
    <SEO
  title="Blip money | Terms & Conditions | User Agreement"
  description="Review the Blip money Terms & Conditions outlining platform usage, user responsibilities, and legal policies."
  canonical="https://blip.money/terms"
/>

    <div className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 tracking-tight">
          Terms of Service for Blip.money
        </h1>

        {/* Intro */}
        <p className="text-gray-300 mb-8 leading-relaxed">
          Welcome to Blip.money. These Terms of Service ("Terms") govern your
          access to and use of the Blip.money decentralized protocol (the
          "Protocol"), our website, and any associated services (collectively,
          the "Services"). By accessing or using our Services, you agree to be
          bound by these Terms.
        </p>

        {/* Section 1 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">
            1. The Blip.money Protocol
          </h2>
          <p className="text-gray-400 leading-relaxed mb-4">
            Blip.money is a decentralized, autonomous software protocol that
            facilitates peer-to-peer (P2P) value transfers. The Protocol enables
            users to interact directly with each other to exchange digital
            assets for fiat currency (cash or bank/wire transfers) or other
            digital assets.
          </p>
          <p className="text-gray-400 leading-relaxed">
            IMPORTANT: Blip.money is a non-custodial protocol. We do not hold,
            control, or custody your funds at any point. All transactions are
            conducted P2P between users and merchants, secured by a
            decentralized smart contract escrow system.
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">
            2. Eligibility and User Obligations
          </h2>
          <ul className="list-disc list-inside text-gray-400 space-y-2">
            <li>You must be of legal age in your jurisdiction to use our Services.</li>
            <li>
              You are solely responsible for the security of your cryptocurrency
              wallet, private keys, and any other access credentials. Loss of
              access to your wallet will result in the permanent loss of your
              funds.
            </li>
            <li>
              You agree to comply with all applicable laws and regulations in
              your jurisdiction. It is your responsibility to determine what,
              if any, taxes apply to the transactions you conduct through the
              Services.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">
            3. The Role of Merchants
          </h2>
          <ul className="list-disc list-inside text-gray-400 space-y-2">
            <li>
              "Merchants" are independent participants on the network who
              facilitate fiat on-ramps and off-ramps.
            </li>
            <li>
              To act as a Merchant, you may be required to stake $BLIP tokens as a
              security deposit to ensure honest participation.
            </li>
            <li>
              Merchants are subject to the Protocol's slashing and reputation
              mechanisms. Malicious or negligent behavior may result in the loss
              of your staked tokens.
            </li>
            <li>
              Merchants are independent entities and are not employees or agents
              of Blip.money. They are solely responsible for their own compliance
              with local laws and regulations.
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">
            4. Risks and Disclaimers
          </h2>
          <ul className="list-disc list-inside text-gray-400 space-y-2">
            <li>
              Financial Risk: The value of digital assets is volatile. You
              acknowledge and accept the risks associated with cryptocurrency
              price fluctuations.
            </li>
            <li>
              Regulatory Risk: The regulatory landscape for digital assets is
              evolving. Changes in laws and regulations may materially impact
              the value and availability of the Services.
            </li>
            <li>
              Protocol Risk: The Protocol is based on smart contracts. While we
              strive for security, you acknowledge the inherent risks of smart
              contract vulnerabilities.
            </li>
            <li>
              No Warranty: The Services are provided "as is" and "as available"
              without any warranties of any kind, either express or implied. We
              do not guarantee that the Services will be uninterrupted, secure,
              or error-free.
            </li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">
            5. DAO Governance
          </h2>
          <p className="text-gray-400 leading-relaxed">
            The Blip.money Protocol is intended to be governed by a Decentralized
            Autonomous Organization ("DAO"). Holders of the $BLIP token will have
            the ability to propose and vote on changes to the Protocol,
            including but not limited to fee structures, upgrades, and treasury
            management.
          </p>
        </section>

        {/* Section 6 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">
            6. Limitation of Liability
          </h2>
          <p className="text-gray-400 leading-relaxed">
            To the fullest extent permitted by law, in no event will Blip.money,
            its developers, or its contributors be liable for any indirect,
            incidental, special, consequential, or punitive damages, or any loss
            of profits or revenues, whether incurred directly or indirectly, or
            any loss of data, use, goodwill, or other intangible losses,
            resulting from: (a) your access to or use of or inability to access
            or use the Services; (b) any conduct or content of any third party on
            the Services, including Merchants; (c) any content obtained from the
            Services; or (d) unauthorized access, use, or alteration of your
            transmissions or content.
          </p>
        </section>

        {/* Section 7 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">
            7. Changes to Terms
          </h2>
          <p className="text-gray-400 leading-relaxed">
            We reserve the right to modify these Terms at any time. If we make
            changes, we will provide notice of such changes, such as by sending
            an email notification, providing notice through the Services, or
            updating the "Last Updated" date at the top of these Terms.
          </p>
        </section>

        {/* Section 8 */}
        <section>
          <h2 className="text-xl font-semibold mb-3">
            8. Contact Information
          </h2>
          <p className="text-gray-400 leading-relaxed">
            For any questions about these Terms, please contact us through our
            official channels.
          </p>
        </section>
      </div>
    </div>
    </>
  );
};

export default TermsService;
