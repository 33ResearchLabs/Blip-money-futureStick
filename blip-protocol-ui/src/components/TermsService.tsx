import React, { useEffect } from "react";
import SEO from "./SEO";

const TermsService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO
        title="Terms of Service | blip.money"
        description="Read the Terms of Service governing your use of the blip.money protocol and services."
        canonical="https://blip.money/terms"
      />

      <div className="min-h-screen bg-black text-white px-6 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight">
            Terms of Service — blip.money
          </h1>

          <p className="text-gray-500 mb-6 text-sm">
            Last updated: {new Date().toLocaleDateString("en-GB")}
          </p>

          {/* Intro */}
          <p className="text-gray-300 mb-8 leading-relaxed">
            These Terms of Service ("Terms") govern your access to and use of
            the blip.money protocol, website, applications, and related services
            (collectively, the "Services").
          </p>

          <p className="text-gray-300 mb-10 leading-relaxed">
            By accessing or using blip.money, you agree to be bound by these
            Terms.
          </p>

          {/* Section 1 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">
              1. Nature of the Service
            </h2>

            <p className="text-gray-400 mb-4 leading-relaxed">blip.money is:</p>

            <ul className="list-disc list-inside text-gray-400 space-y-2 mb-4">
              <li>A non-custodial escrow coordination protocol</li>
              <li>
                A technology platform that facilitates peer-to-peer transactions
              </li>
            </ul>

            <p className="text-gray-400 mb-4 leading-relaxed">
              blip.money is not:
            </p>

            <ul className="list-disc list-inside text-gray-400 space-y-2 mb-4">
              <li>A bank</li>
              <li>A wallet provider</li>
              <li>A payment institution</li>
              <li>A financial intermediary</li>
              <li>A custodian of funds</li>
            </ul>

            <p className="text-gray-400 leading-relaxed">
              blip.money does not hold user funds. Funds remain in smart
              contracts or in accounts controlled by users or their chosen
              payment providers.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">
              2. User Responsibilities
            </h2>

            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>You control your wallet(s), accounts, and funds</li>
              <li>
                You understand the risks associated with cryptocurrencies and
                peer-to-peer transactions
              </li>
              <li>
                You are solely responsible for all actions taken using your
                wallet or account
              </li>
              <li>
                You are responsible for complying with all applicable laws and
                regulations
              </li>
              <li>
                You will not use the Services for illegal, fraudulent, or
                abusive activities
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">
              3. Escrow System (User Escrow Agreement)
            </h2>

            <p className="text-gray-400 mb-4 leading-relaxed">
              When you open or participate in a trade:
            </p>

            <ul className="list-disc list-inside text-gray-400 space-y-2 mb-4">
              <li>
                Funds are locked using escrow logic defined by the Protocol
              </li>
              <li>
                Funds are released only when both parties confirm completion or
                a dispute resolution decision is made
              </li>
            </ul>

            <p className="text-gray-400 mb-4 leading-relaxed">
              By using the escrow system, you agree that any proofs, documents,
              or information you submit are truthful, accurate, and not
              misleading.
            </p>

            <p className="text-gray-400 leading-relaxed">
              Submitting false or fraudulent evidence may result in permanent
              suspension, loss of access to the platform, and cooperation with
              law enforcement where required.
            </p>
          </section>

          {/* Section 4 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">
              4. Merchant Terms (Merchant Agreement)
            </h2>

            <ul className="list-disc list-inside text-gray-400 space-y-2 mb-4">
              <li>
                You will provide genuine liquidity and legitimate services
              </li>
              <li>You will honor advertised prices and availability</li>
              <li>You will use lawful and compliant payment channels</li>
              <li>
                You will respond to disputes and user requests within required
                timeframes
              </li>
            </ul>

            <p className="text-gray-400 mb-4 leading-relaxed">
              You accept the risks associated with bank freezes, payment
              reversals, and local regulatory obligations.
            </p>

            <p className="text-gray-400 leading-relaxed">
              blip.money reserves the right to impose restrictions or suspend
              merchant accounts at its sole discretion.
            </p>
          </section>

          {/* Section 5 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">
              5. Dispute Resolution Framework
            </h2>

            <p className="text-gray-400 mb-4 leading-relaxed">
              In the event of a dispute, both parties must submit relevant
              evidence. Disputes are reviewed using internal processes.
            </p>

            <p className="text-gray-400 leading-relaxed">
              You acknowledge that blip.money is not a court and only determines
              how escrowed funds are routed within the Protocol. Decisions are
              final within the platform.
            </p>
          </section>

          {/* Section 6 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">6. Risk Disclosure</h2>

            <ul className="list-disc list-inside text-gray-400 space-y-2">
              <li>Cryptocurrency price volatility</li>
              <li>Payment reversals or bank account freezes</li>
              <li>Regulatory or legal changes</li>
              <li>Counterparty default or fraud</li>
              <li>Blockchain or smart contract failures</li>
            </ul>

            <p className="text-gray-400 mt-4 leading-relaxed">
              You use the Services at your own risk.
            </p>
          </section>

          {/* Section 7 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">7. AML / CTF Policy</h2>

            <p className="text-gray-400 mb-4 leading-relaxed">
              blip.money operates a risk-based compliance and abuse-prevention
              framework, which may include monitoring, sanctions screening, and
              mandatory verification in certain cases.
            </p>

            <p className="text-gray-400 leading-relaxed">
              Money laundering, terrorist financing, sanctions evasion, and
              fraud are strictly prohibited.
            </p>
          </section>

          {/* Section 8 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">
              8. Account Suspension and Enforcement
            </h2>

            <p className="text-gray-400 leading-relaxed">
              blip.money may suspend or terminate access to the Services at any
              time in cases of fraud, abuse, legal risk, or violation of these
              Terms.
            </p>
          </section>

          {/* Section 9 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">
              9. Limitation of Liability
            </h2>

            <p className="text-gray-400 leading-relaxed">
              To the maximum extent permitted by law, blip.money shall not be
              liable for indirect, incidental, special, or consequential damages
              arising from use of the Services.
            </p>
          </section>

          {/* Section 10 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">
              10. Jurisdiction and Arbitration
            </h2>

            <p className="text-gray-400 leading-relaxed">
              Jurisdiction and dispute resolution methods may vary based on your
              location and the nature of the dispute.
            </p>
          </section>

          {/* Section 11 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">
              11. Termination of Service
            </h2>

            <p className="text-gray-400 leading-relaxed">
              blip.money may terminate or restrict access to the Services at any
              time in accordance with applicable law.
            </p>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="text-xl font-semibold mb-3">
              12. Changes to These Terms
            </h2>

            <p className="text-gray-400 leading-relaxed">
              We may update these Terms from time to time. Continued use of the
              Services constitutes acceptance of the updated Terms.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default TermsService;
