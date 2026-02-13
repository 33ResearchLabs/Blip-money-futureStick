import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import SEO from "../components/SEO";
import { HreflangTags } from "@/components/HreflangTags";

const sections = [
  { id: "abstract", title: "Abstract" },
  { id: "problem", title: "The Problem" },
  { id: "protocol", title: "Blip.money Protocol" },
  { id: "features", title: "Core Features" },
  { id: "architecture", title: "System Architecture" },
  { id: "lifecycle", title: "Transaction Lifecycle" },
  { id: "economics", title: "Economic Incentives" },
  { id: "regulatory", title: "Regulatory Neutrality" },
  { id: "ecosystem", title: "Ecosystem Vision" },
  { id: "conclusion", title: "Conclusion" },
  { id: "references", title: "References" },
];

const Whitepaper = () => {
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

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/whitepaper.pdf";
    link.download = "blip-money-whitepaper.pdf";
    link.click();
  };

  return (
    <>
      <SEO
        title="Whitepaper | Blip Money"
        description="Blip.money: A Pseudonymous, On-Chain Protocol for Global Peer-to-Peer Value Settlement"
        canonical="https://blip.money/whitepaper"
      />
      <HreflangTags path="/whitepaper" />

      <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0a0a0b] text-black dark:text-white mt-12">
        {/* Hero Header */}
        <div className="pt-32 pb-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Blip<span className="text-orange-500">.money</span>: A
              Pseudonymous, On-Chain Protocol for Global Peer-to-Peer Value
              Settlement
            </h1>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-medium hover:bg-black/80 dark:hover:bg-white/90 transition-colors"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </button>
          </div>
        </div>

        {/* Content Area with Sidebar */}
        <div className="bg-gray-50 dark:bg-[#111111]">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
              {/* Left Sidebar */}
              {/* Left Sidebar */}
              <aside className="lg:w-60 flex-shrink-0">
                {/* Mobile Horizontal Scroll Menu */}
                <div className="lg:hidden overflow-x-auto pb-4">
                  <div className="flex gap-3 min-w-max">
                    {sections.map((section, index) => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`whitespace-nowrap px-4 py-2 rounded-full text-sm transition ${
                          activeSection === section.id
                            ? "bg-black dark:bg-white text-white dark:text-black"
                            : "bg-gray-200 dark:bg-[#222] text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {index + 1}. {section.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Desktop Sticky Sidebar */}
                <div className="hidden lg:block sticky top-24">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">
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
              <div className="flex-1 min-w-0">
                {/* Abstract */}
                <section id="abstract" className="mb-16">
                  <h2 className="text-3xl font-bold text-black dark:text-white mb-6">
                    1. Abstract
                  </h2>
                  <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                    <p>
                      This paper introduces Blip.money, a decentralized,
                      peer-to-peer (P2P) protocol built on the{" "}
                      <strong>Solana Program Library (SPL)</strong>{" "}
                      architecture, designed to facilitate trust-minimized,
                      cross-border value settlement. The core innovation lies in
                      establishing an{" "}
                      <strong>enforceable, pseudonymous P2P layer</strong> by
                      mandating that all critical settlement actions—escrow,
                      bond staking, reputation scoring, and dispute
                      resolution—are recorded and enforced via on-chain smart
                      contracts.
                    </p>
                    <p>
                      The system employs a <strong>hybrid architecture</strong>,
                      utilizing off-chain, sealed-bid auctions for efficient,
                      dynamic fee discovery and on-chain mechanisms for
                      non-custodial <strong>escrow, reputation</strong>, and{" "}
                      <strong>merchant staking</strong>. This structure ensures
                      settlement finality, low latency, and a permanent,
                      auditable cryptographic trail, thereby mitigating the need
                      for users to rely on centralized financial intermediaries
                      or to expose personal identity for routine transfers.
                    </p>
                  </div>
                </section>

                {/* The Problem */}
                <section id="problem" className="mb-16">
                  <h2 className="text-3xl font-bold text-black dark:text-white mb-6">
                    2. The Problem: Limitations of Extant Cross-Border P2P
                    Systems
                  </h2>
                  <div className="space-y-6">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      The current landscape for cross-border and P2P value
                      transfer is characterized by fundamental inefficiencies, a
                      reliance on centralized authority, and a pervasive lack of
                      cryptographic enforcement.
                    </p>

                    <div>
                      <h3 className="text-xl font-bold text-black dark:text-white mb-4">
                        2.1. Inefficient, Manual, and Trust-Based Settlement
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        The prevailing system for international payments suffers
                        from <strong>high latency</strong> and{" "}
                        <strong>opaque fee structures</strong> due to reliance
                        on layered financial institutions and correspondent
                        banking networks. P2P systems, even those utilizing
                        cryptocurrency, merely shift the off-chain risk.
                      </p>

                      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-3 ml-4">
                        <li>
                          <strong>High Latency:</strong> Settlement finality is
                          achieved manually, often requiring human intervention
                          to verify off-chain proofs, leading to significant
                          delays. The maximum execution time (τ<sub>max</sub>)
                          is often minutes or hours, making instant payments
                          unfeasible.
                        </li>
                        <li>
                          <strong>Trust Dependence:</strong> Settlement is
                          non-atomic and reliant on the mutual trust between an
                          unknown <strong>User (U)</strong> and a{" "}
                          <strong>Merchant (M)</strong>. The core technical
                          problem is the absence of a mechanism for
                          trust-minimized P2P liquidity provision across
                          disparate jurisdictions without requiring complete
                          centralization of funds.
                        </li>
                        <li>
                          <strong>No On-Chain Audit Trail:</strong> The critical
                          steps of fiat payment and verification occur
                          off-chain. There is no cryptographic, immutable record
                          of the settlement event, which prevents the creation
                          of provable trust.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-black dark:text-white mb-4">
                        2.2. Failure of Privacy and Pseudonymity
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        Current centralized P2P systems fundamentally violate
                        user privacy and pseudonymous transfer capacity.
                      </p>

                      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-3 ml-4">
                        <li>
                          <strong>Identity Exposure:</strong> Users are
                          typically required to expose sensitive information,
                          including phone numbers, chat histories, bank account
                          details, and KYC/AML documents, for every transaction.
                        </li>
                        <li>
                          <strong>Data Linkability:</strong> All transaction
                          data, chat logs, and personal identifiers are
                          aggregated by a central entity, creating a single
                          point of failure and a highly linkable transaction
                          graph for users.
                        </li>
                        <li>
                          <strong>Centralized Reputation:</strong> Reputation
                          systems are off-chain, easy to manipulate, susceptible
                          to Sybil attacks, and tied to the centralized exchange
                          hosting them. They can be reset, deleted, or
                          fabricated.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-black dark:text-white mb-4">
                        2.3. Security Vulnerabilities and Fraud
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        The lack of an enforced, on-chain mechanism makes the
                        system highly vulnerable to fraud.
                      </p>

                      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-3 ml-4">
                        <li>
                          <strong>Scam and Non-Delivery Risk:</strong> Dishonest
                          Users or Merchants can exploit the manual verification
                          process using fake bank screenshots, non-delivery of
                          fiat funds, or stalling tactics, which frequently
                          result in frozen funds or chargebacks.
                        </li>
                        <li>
                          <strong>Reputation Manipulation:</strong> Since
                          reputation is off-chain, it is easily inflated or
                          faked, undermining its utility as a reliable signal of
                          counterparty trustworthiness.
                        </li>
                      </ul>

                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                        Blip.money directly addresses these failures by
                        proposing an electronically enforced, competitive market
                        for global currency settlement, anchored by the Solana
                        blockchain's high throughput and low latency.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Protocol */}
                <section id="protocol" className="mb-16">
                  <h2 className="text-3xl font-bold text-black dark:text-white mb-6">
                    3. Blip.money: A Pseudonymous P2P Escrow Protocol
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                    Blip.money is defined as a protocol enabling P2P
                    cross-border value settlement with minimized reliance on
                    trusted third parties. It is a smart-contract enforced
                    system that shifts the settlement burden onto a network of
                    cryptographically bonded Merchants.
                  </p>

                  <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
                    3.1. Core Design Principles
                  </h3>
                  <div className="overflow-x-auto mb-8">
                    <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
                      <thead>
                        <tr className="bg-gray-100 dark:bg-[#1a1a1a]">
                          <th className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-left font-bold">
                            Principle
                          </th>
                          <th className="border border-gray-300 dark:border-gray-700 px-4 py-3 text-left font-bold">
                            Description
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-700 dark:text-gray-300">
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-3 font-semibold align-top">
                            Trust-Minimization
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-3">
                            Settlement is enforced via smart-contract logic and
                            Merchant cryptographic staking, removing reliance on
                            centralized custodians.
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-3 font-semibold align-top">
                            Non-Custodial Escrow
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-3">
                            User funds are locked in a{" "}
                            <strong>Program Derived Address (PDA)</strong> on
                            Solana, controllable only by the Blip.money program
                            logic, not by a single private key.
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-3 font-semibold align-top">
                            Competitive Liquidity
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-3">
                            Fees are discovered dynamically through a{" "}
                            <strong>sealed-bid, second-price auction</strong>,
                            driving costs toward the marginal cost of the most
                            efficient Merchant.
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-3 font-semibold align-top">
                            Accountability
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-3">
                            Merchant performance is secured by a required
                            cryptographic <strong>Bond (B)</strong> and a
                            reputation score subject to a{" "}
                            <strong>slashing mechanism</strong> for
                            non-performance.
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-3 font-semibold align-top">
                            High Performance
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-3">
                            The protocol is built on Solana to leverage its high
                            throughput and rapid state transitions, ensuring
                            liveness and near-instant confirmation of escrow
                            updates.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Core Features */}
                <section id="features" className="mb-16">
                  <h2 className="text-3xl font-bold text-black dark:text-white mb-6">
                    4. Core Features and Innovation
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                    Blip.money introduces several technical innovations to
                    establish the first truly enforceable, pseudonymous P2P
                    settlement layer.
                  </p>

                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
                        4.1. Pseudonymous P2P Settlement Layer
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        The protocol is designed to maximize user privacy by
                        minimizing data exposure at the protocol level.
                      </p>

                      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-3 ml-4">
                        <li>
                          <strong>Cryptographic Identity:</strong> The User's
                          (U) identity is restricted to their cryptographic
                          keypair on Solana. The base protocol does not require
                          KYC, phone numbers, or external account information
                          from the User.
                        </li>
                        <li>
                          <strong>Off-Chain Negotiation Shield:</strong> Users
                          do not need to expose identity or chat history to the
                          Merchant to initiate the transaction. All that is
                          required is the ability to{" "}
                          <strong>cryptographically sign the Order (O)</strong>.
                        </li>
                        <li>
                          <strong>Linkability Reduction:</strong> Users may
                          employ ephemeral wallets for each transaction.
                          Interaction with the protocol can be conducted via
                          privacy-preserving relayers, minimizing linkability
                          between the on-chain activity and the off-chain fiat
                          receipt.
                        </li>
                        <li>
                          <strong>Merchant-Only KYC Burden:</strong> Only the
                          Merchants (liquidity providers), who must interface
                          with traditional banking/fiat rails, bear the burden
                          of potential regulatory compliance (e.g., KYC for
                          their own operational accounts) and financial staking.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
                        4.2. On-Chain Enforcement and Audit Trail
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        The protocol's integrity is guaranteed by the
                        immutability of the Solana state.
                      </p>

                      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-3 ml-4">
                        <li>
                          <strong>Atomic State Transitions:</strong> All key
                          events—Escrow Deposit, Escrow Release, Refund, and
                          Slashing—are executed as atomic, single-transaction
                          state transitions within the Blip.money program.
                        </li>
                        <li>
                          <strong>Provable Finality:</strong> Settlement
                          finality is achieved via{" "}
                          <strong>smart-contract enforcement</strong>. Once the
                          Oracle's (R) cryptographic{" "}
                          <strong>proof of off-chain payout</strong> is verified
                          on-chain, the
                          <strong> Escrow PDA (E)</strong> must execute the{" "}
                          <strong>Release Operation</strong>. This creates an
                          irreversible, cryptographic proof of settlement.
                        </li>
                        <li>
                          <strong>Non-Repudiation:</strong> Orders, Bids, and
                          Oracle proofs are signed messages incorporating a
                          unique{" "}
                          <strong>
                            Order Hash (O<sub>hash</sub>)
                          </strong>{" "}
                          and a sequence number (or slot), preventing replay
                          attacks and guaranteeing non-repudiation.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
                        4.3. On-Chain Reputation and Accountability System
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        Merchant reliability is quantified and enforced
                        on-chain, replacing central authority feedback systems.
                      </p>

                      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-4 ml-4">
                        <li>
                          <strong>Reputation PDA(R):</strong> A persistent,
                          non-resetting{" "}
                          <strong>
                            Reputation Score (R<sub>M</sub>)
                          </strong>{" "}
                          is maintained for every Merchant in their dedicated,
                          cryptographically secured Reputation PDA.
                        </li>
                        <li>
                          <strong>Algorithmic Update Rules:</strong> The score
                          is updated based on successful (→ <em>RELEASED</em>)
                          or unsuccessful (→ <em>REFUNDED</em>) Escrow closure.
                          <ul className="list-none ml-6 mt-2 space-y-2">
                            <li>
                              <strong>
                                Success Increment (ΔR<sub>success</sub>):
                              </strong>{" "}
                              Scales logarithmically with the Order amount,
                              <div className="bg-gray-100 dark:bg-[#1a1a1a] p-3 rounded-lg mt-2 font-mono text-sm">
                                ΔR = α<sub>success</sub> · log(Amount)
                              </div>
                            </li>
                            <li>
                              <strong>
                                Failure Decrement (ΔR<sub>failure</sub>):
                              </strong>{" "}
                              Scales polynomially with the Order amount,
                              <div className="bg-gray-100 dark:bg-[#1a1a1a] p-3 rounded-lg mt-2 font-mono text-sm">
                                ΔR = −β<sub>failure</sub> · (Amount)<sup>γ</sup>
                                ,
                              </div>
                              <span className="text-sm">
                                severely penalizing failures.
                              </span>
                            </li>
                          </ul>
                        </li>
                        <li>
                          <strong>Tiering and Access Control:</strong> The Tier
                          is derived from the score, influencing the maximum{" "}
                          <em>Order</em> size (O<sub>max</sub>) a Merchant can
                          accept.
                        </li>
                        <li>
                          <strong>Auction Weighting:</strong> R<sub>M</sub> is a
                          critical input to the Auction Winner Function, where a
                          higher R<sub>M</sub> increases the Merchant's
                          effective bid score (S<sub>i</sub>).
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
                        4.4. DAO-Based Dispute and Governance System
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        Dispute resolution and critical protocol parameters are
                        governed by a Decentralized Autonomous Organization
                        (DAO).
                      </p>

                      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-3 ml-4">
                        <li>
                          <strong>DAO Authority:</strong> The DAO is the
                          collective entity responsible for protocol governance,
                          including setting slashing parameters, fee schedules,
                          and initial Oracle management.
                        </li>
                        <li>
                          <strong>Dispute Resolution:</strong> In the event of a
                          Timeout or a Proof Submit failure, the Escrow state
                          transitions to <strong>DISPUTE</strong>. The DAO can
                          resolve disputes by using evidence and Oracle proofs.
                        </li>
                        <li>
                          <strong>DAO Actions:</strong> Upon DAO Resolution, the
                          DAO can execute the <strong>Forced Closure</strong>{" "}
                          operation on the Escrow PDA, which may result in:
                          <ul className="list-none ml-6 mt-2 space-y-1">
                            <li>
                              ○ <strong>Partial/Full Release:</strong> Funds
                              transferred to the Merchant.
                            </li>
                            <li>
                              ○ <strong>Partial/Full Refund:</strong> Funds
                              transferred back to the User.
                            </li>
                            <li>
                              ○ <strong>Bond Slashing:</strong> If the failure
                              is deemed malicious, the Merchant's Bond is
                              partially or fully slashed, with the funds
                              transferred to the DAO or the affected User.
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
                        4.5. Ultra-Fast Settlement via Solana
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        The selection of Solana as the base layer is critical
                        for achieving low-latency settlement.
                      </p>

                      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-3 ml-4">
                        <li>
                          <strong>Low-Latency Transactions:</strong> Solana's
                          architecture enables rapid state transitions for Order
                          creation, Escrow funding, Merchant matching, and
                          Escrow release, ensuring confirmations in seconds.
                        </li>
                        <li>
                          <strong>Liveness Guarantees:</strong> The rapid
                          confirmation time is essential for maintaining the (τ
                          <sub>max</sub>) (maximum execution time) liveness
                          guarantee, which permits the User U to unilaterally
                          trigger a Refund Operation after the timelock elapses,
                          preventing custodial risk.
                        </li>
                        <li>
                          <strong>Efficient On-Chain Verification:</strong>{" "}
                          On-chain verification of the Oracle signature is
                          executed within the constrained Solana Compute Budget,
                          minimizing transaction latency and cost.
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Architecture */}
                <section id="architecture" className="mb-16">
                  <h2 className="text-3xl font-bold text-black dark:text-white mb-6">
                    5. System Architecture
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                    The Blip.money protocol is defined by a set of actors and a
                    collection of cryptographically secured Program Derived
                    Addresses (PDAs) on the Solana blockchain.
                  </p>

                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
                        5.1. Actors
                      </h3>
                      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-3 ml-4">
                        <li>
                          <strong>User (U):</strong> The entity initiating a
                          cross-border value transfer Order (O) and depositing
                          cryptocurrency into Escrow.
                        </li>
                        <li>
                          <strong>Merchant (M):</strong> The entity that bids on
                          Orders and commits to executing the off-chain fiat
                          settlement. Merchants must stake a Bond.
                        </li>
                        <li>
                          <strong>Oracle (R):</strong> A designated, signed
                          entity responsible for submitting cryptographic proof
                          of off-chain fiat payout, which triggers the Escrow
                          release.
                        </li>
                        <li>
                          <strong>
                            Decentralized Autonomous Organization (DAO):
                          </strong>{" "}
                          The collective entity responsible for protocol
                          governance and dispute resolution.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
                        5.2. Core Data Structures and PDAs
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        All on-chain state is stored in{" "}
                        <strong>Program Derived Addresses (PDAs)</strong>, which
                        are cryptographically controlled by the Blip.money
                        program, guaranteeing non-custodial handling of funds.
                      </p>

                      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-3 ml-4">
                        <li>
                          <strong>Order (O):</strong> The formal record of the
                          desired transfer:
                          <span className="inline-block ml-2 font-mono text-sm">
                            (U, F<sub>send</sub>, A<sub>send</sub>, F
                            <sub>recv</sub>, A<sub>recv</sub>, τ<sub>max</sub>)
                          </span>
                          , where F is currency, A is amount, and τ
                          <sub>max</sub> is maximum execution time.
                        </li>
                        <li>
                          <strong>Escrow PDA (E):</strong> A non-custodial smart
                          contract that cryptographically holds the User's funds
                          until a Merchant proves settlement or a timeout
                          occurs.
                          <div className="ml-6 mt-1 text-sm font-mono">
                            <em>Seeds:</em> seed(O<sub>hash</sub>, 'escrow')
                          </div>
                        </li>
                        <li>
                          <strong>Reputation PDA (R):</strong> A structure
                          storing the on-chain performance record for a Merchant
                          M.
                          <div className="ml-6 mt-1 text-sm font-mono">
                            <em>Seeds:</em> seed(M<sub>key</sub>, 'rep')
                          </div>
                        </li>
                        <li>
                          <strong>Staking/Bond PDA (S):</strong> A structure
                          holding the Merchant's cryptographic bond (B).
                          <div className="ml-6 mt-1 text-sm font-mono">
                            <em>Seeds:</em> seed(M<sub>key</sub>, 'bond')
                          </div>
                        </li>
                        <li>
                          <strong>DAO Vault:</strong> A separate PDA or set of
                          accounts that holds slashed Bond funds and platform
                          fees.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
                        5.3. Hybrid Architecture Model
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        The protocol utilizes an off-chain/on-chain hybrid model
                        for efficiency.
                      </p>

                      <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-3 ml-4">
                        <li>
                          <strong>Off-Chain Indexer:</strong> Aggregates and
                          scores Merchant{" "}
                          <strong>
                            Bids (B<sub>i</sub>)
                          </strong>{" "}
                          based on the Auction Mechanism (Section 5.4). This
                          off-chain processing prevents network congestion and
                          reduces transaction costs. It determines and relays
                          the winning signed bid (B<sub>w</sub>).
                        </li>
                        <li>
                          <strong>On-Chain Program:</strong> The core smart
                          contract logic on Solana that manages Escrow state
                          transitions, verifies the Oracle signature, and
                          updates the Reputation and Bond PDAs.
                        </li>
                      </ol>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
                        5.4. Auction Mechanism: Sealed-Bid, Second-Price
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        The fee is determined by a{" "}
                        <strong>sealed-bid, second-price auction</strong>,
                        modified by the Merchant's on-chain metrics. This
                        mechanism enforces{" "}
                        <strong>incentive compatibility</strong> in fee
                        discovery.
                      </p>

                      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-4 ml-4">
                        <li>
                          <strong>
                            Weighted Bid Score (S<sub>i</sub>):
                          </strong>{" "}
                          The score incorporates the Merchant's proposed fee (R
                          <sub>fee,i</sub>), <em>Reputation</em> (R<sub>i</sub>
                          ), and <em>Staked Bond Level</em> (L<sub>i</sub>):
                          <div className="bg-gray-100 dark:bg-[#1a1a1a] p-4 rounded-lg mt-3 font-mono text-base">
                            S<sub>i</sub> = 1/R<sub>fee,i</sub> + αR<sub>i</sub>{" "}
                            + βL<sub>i</sub>
                          </div>
                          <span className="text-sm mt-2 block">
                            Where α &gt; 0 and β &gt; 0 are <em>DAO-set</em>{" "}
                            weighting coefficients.
                          </span>
                        </li>
                        <li>
                          <strong>Winner Function:</strong> The winning Merchant
                          (M<sub>w</sub>) is the one with the highest score.
                          <div className="bg-gray-100 dark:bg-[#1a1a1a] p-4 rounded-lg mt-3 font-mono text-base">
                            M<sub>w</sub> = argmax<sub>i</sub>(S<sub>i</sub>)
                          </div>
                        </li>
                        <li>
                          <strong>Pricing Function:</strong> The fee paid by the
                          User (R<sub>fee,w</sub>) is set such that the winning
                          score (S<sub>w</sub>) approximately equals the
                          second-highest score (S<sub>2nd</sub>), plus a minimal
                          increment (ε).
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Transaction Lifecycle */}
                <section id="lifecycle" className="mb-16">
                  <h2 className="text-3xl font-bold text-black dark:text-white mb-6">
                    6. Transaction Lifecycle: Step-by-Step
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                    The Blip.money protocol operates in a sequence of
                    interdependent on-chain and off-chain steps. The Escrow
                    State Machine is the core enforcer of finality.
                  </p>

                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 dark:border-gray-700 text-sm">
                      <thead>
                        <tr className="bg-gray-100 dark:bg-[#1a1a1a]">
                          <th className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-left font-bold">
                            Step
                          </th>
                          <th className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-left font-bold">
                            Action
                          </th>
                          <th className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-left font-bold">
                            Mechanism
                          </th>
                          <th className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-left font-bold">
                            On/Off-Chain
                          </th>
                          <th className="border border-gray-300 dark:border-gray-700 px-3 py-2 text-left font-bold">
                            Escrow State (SE)
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-700 dark:text-gray-300">
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 font-semibold">
                            1. Order Creation
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                            U broadcasts Order (O) off-chain.
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                            O detailing parameters
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                            Off-Chain
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                            INIT
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 font-semibold">
                            2. Merchant Bidding
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                            M submit signed Bids (B<sub>i</sub>) to the
                            off-chain indexer.
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                            Auction Window τ<sub>auction</sub>
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                            Off-Chain
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                            AUCTION
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 font-semibold">
                            3. Winner Publication
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                            Indexer determines M<sub>w</sub> and B<sub>w</sub>{" "}
                            is published on-chain, initializing E and R.
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                            M<sub>w</sub>=argmax (S<sub>i</sub>)
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                            On-Chain
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                            AUCTION
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 font-semibold">
                            4. Escrow Deposit
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                            U deposits A<sub>send</sub> into E. This initiate τ
                            <sub>max</sub>.
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                            Deposit Operation
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                            On-Chain
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                            DEPOSITED
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 font-semibold">
                            5. Merchant Settlement
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                            M<sub>w</sub> executes off-chain fiat payout and
                            obtains Proof-of-Settlement from R.
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                            Off-Chain Fiat Transfer
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                            Off-Chain
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                            DEPOSITED
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 font-semibold">
                            6. Proof Submission
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                            M<sub>w</sub> (or R) submits the signed proof to the
                            on-chain program.
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                            Proof_Submit
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                            On-Chain
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                            PROOF_PENDING
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 font-semibold">
                            7. Escrow Release
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                            Program verifies R signature. E releases funds to M
                            <sub>w</sub>. R score is incremented.
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                            Release Operation
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                            On-Chain
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                            RELEASED → CLOSED
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 font-semibold">
                            8. Refund Path
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                            If τ<sub>max</sub> elapses without proof, U
                            initiates a Refund. Funds return to U. R score
                            decremented; B reviewed for slashing.
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                            Timeout → Refund Operation
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                            On-Chain
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                            REFUNDED → CLOSED
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-3 py-2 font-semibold">
                            9. Dispute Path
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                            U or M<sub>w</sub> flags a Dispute. DAO resolves,
                            resulting in RELEASED or REFUNDED.
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                            DAO_Resolution
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                            DAO/On-Chain
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-3 py-2">
                            DISPUTE → RELEASED or REFUNDED CLOSED
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Economic Incentives */}
                <section id="economics" className="mb-16">
                  <h2 className="text-3xl font-bold text-black dark:text-white mb-6">
                    7. Economic Incentives and Token Model
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                    The protocol is engineered to align the economic incentives
                    of all participants, securing the system through staked
                    capital and reputation.
                  </p>

                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
                        7.1. Merchant Bond and Slashing
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        Merchants must post a cryptographic{" "}
                        <strong>Bond (B)</strong> in their Staking/Bond PDA (S).
                      </p>

                      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-4 ml-4">
                        <li>
                          <strong>Mitigation of Non-Delivery:</strong> The Bond
                          mitigates the financial incentive for non-delivery.
                          The potential gain from fraud is capped by O
                          <sub>max</sub>, while the loss from slashing is the
                          staked B.
                        </li>
                        <li>
                          <strong>Incentive Compatibility Condition:</strong>{" "}
                          The maximum Order value allowed for a Merchant's Bond
                          level (O<sub>max</sub>) is set to ensure the penalty
                          outweighs the reward:
                          <div className="bg-gray-100 dark:bg-[#1a1a1a] p-4 rounded-lg mt-3 font-mono text-base">
                            O<sub>max</sub> &lt; δB
                          </div>
                          <span className="text-sm mt-2 block">
                            Where δ is the DAO-set slashing factor.
                          </span>
                        </li>
                        <li>
                          <strong>
                            Expected Profit (E[Π<sub>M</sub>]):
                          </strong>{" "}
                          Merchant participation is sustained if their expected
                          profit is non-negative:
                          <div className="bg-gray-100 dark:bg-[#1a1a1a] p-4 rounded-lg mt-3 font-mono text-sm overflow-x-auto">
                            E[Π<sub>M</sub>] = p<sub>success</sub> · (R
                            <sub>fee</sub> − C<sub>op</sub>) − p
                            <sub>failure</sub> · (Penalty + C<sub>fail</sub>)
                            &gt; 0
                          </div>
                          <span className="text-sm mt-2 block">
                            Where <em>Penalty</em> includes the lost{" "}
                            <em>Reputation</em> value and potential Slashing
                            amount.
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
                        7.2. Fee Model and Splits
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        Merchant revenue is generated from the fee R
                        <sub>fee,w</sub> paid by the User. This revenue is
                        competitive, driven toward the marginal cost of the most
                        efficient Merchant.
                      </p>

                      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-3 ml-4">
                        <li>
                          <strong>Fee Structure:</strong> Determined by the
                          second-price rule to ensure Merchants reveal their
                          true cost.
                        </li>
                        <li>
                          <strong>Fee Allocation (Conceptual):</strong>
                          <ul className="list-none ml-6 mt-2 space-y-1">
                            <li>
                              ○{" "}
                              <strong>
                                Merchant Share (M<sub>share</sub>):
                              </strong>{" "}
                              The largest portion, serving as direct revenue.
                            </li>
                            <li>
                              ○ <strong>DAO Treasury:</strong> Used for
                              governance and development.
                            </li>
                            <li>
                              ○ <strong>Referral/Cashback Pool:</strong>{" "}
                              Incentives for user activity (optional).
                            </li>
                            <li>
                              ○ <strong>Oracle Network Fee:</strong>{" "}
                              Compensation for the Oracle service.
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
                        7.3. Reputation-Based Cost Reduction
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        The αR<sub>i</sub> weighting in the Auction creates a
                        long-term incentive for truthfulness and reliability.
                      </p>

                      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-3 ml-4">
                        <li>
                          <strong>Monetization of Reliability:</strong> Past
                          reliable performance (R<sub>i</sub>) monetized by
                          increasing the likelihood of winning future Orders.
                        </li>
                        <li>
                          <strong>Dynamic Subsidy:</strong> High-reputation
                          Merchants receive a{" "}
                          <strong>Reputation-based cost reduction</strong>,
                          allowing them to win at marginally better effective
                          rates.
                        </li>
                        <li>
                          <strong>Game-Theoretic Stability:</strong> The system
                          is stable as the value of the Bond and accumulated{" "}
                          <strong>Reputation</strong> must exceed the maximum
                          single-transaction profit from non-compliance.
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Regulatory Neutrality */}
                <section id="regulatory" className="mb-16">
                  <h2 className="text-3xl font-bold text-black dark:text-white mb-6">
                    8. Regulatory Neutrality and Frontends
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                    The Blip.money protocol adopts a principle of regulatory
                    neutrality, similar to other open-source protocols.
                  </p>

                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
                        8.1. Pseudonymous Core Protocol
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        The base layer of Blip.money is designed to be{" "}
                        <strong>pseudonymous and neutral</strong>.
                      </p>

                      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-3 ml-4">
                        <li>
                          <strong>No Base-Layer KYC:</strong> The protocol does
                          not require Users or Merchants to submit identifying
                          information to the smart contract logic.
                        </li>
                        <li>
                          <strong>Censorship Resistance:</strong> The{" "}
                          <strong>Escrow PDA</strong> is secured by the Solana
                          runtime, and only the Blip.money program can execute
                          token transfers out of it. This design, along with{" "}
                          <strong>DAO governance</strong>, enforces censorship
                          resistance.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
                        8.2. Frontend Compliance Layer
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        Regulatory compliance is a matter for the external
                        interfaces and the Merchants themselves.
                      </p>

                      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-3 ml-4">
                        <li>
                          <strong>Optional KYC:</strong> Frontends or service
                          providers built on top of Blip.money may implement
                          KYC/AML checks based on their local legal requirements
                          or jurisdiction, without impacting the core protocol's
                          logic.
                        </li>
                        <li>
                          <strong>Merchant Discretion:</strong> Merchants
                          operating in regulated corridors are responsible for
                          any required off-chain identity verification necessary
                          to comply with their financial licenses or local
                          banking laws.
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Ecosystem Vision */}
                <section id="ecosystem" className="mb-16">
                  <h2 className="text-3xl font-bold text-black dark:text-white mb-6">
                    9. Ecosystem Vision
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                    Blip.money is envisioned as a foundational,
                    censorship-resistant rail for global liquidity.
                  </p>

                  <div className="space-y-8">
                    <div>
                      <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
                        9.1. Global P2P Liquidity Rail
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        The protocol provides a standardized, low-latency
                        framework for instantaneous value transfer.
                      </p>

                      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-3 ml-4">
                        <li>
                          <strong>Cross-Border Remittance:</strong> Offers a
                          structurally efficient alternative to legacy
                          remittance systems.
                        </li>
                        <li>
                          <strong>Instant Payments:</strong> Leveraging Solana,
                          the protocol supports near-instant P2P payments for
                          high-velocity transaction corridors.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
                        9.2. Merchant Network Expansion
                      </h3>
                      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-3 ml-4">
                        <li>
                          <strong>Merchant Staking Incentives:</strong> The
                          on-chain <strong>Reputation PDA (R)</strong> and the
                          competitive auction model (Section 5.4) provide a
                          clear, monetizable path for reliable Merchants to
                          increase their volume and profit.
                        </li>
                        <li>
                          <strong>Optional Premium Tiers:</strong> Future
                          protocol updates can introduce tiers linked to higher
                          staked B and text scores, allowing Merchants to handle
                          significantly larger (O<sub>max</sub>) limits.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
                        9.3. Protocol Integration and Utility
                      </h3>
                      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-3 ml-4">
                        <li>
                          <strong>Wallet Integration:</strong> Direct
                          integration with non-custodial wallets can offer an
                          in-wallet P2P settlement feature.
                        </li>
                        <li>
                          <strong>FinTech Bridge:</strong> A standardized
                          interface will allow any FinTech application to
                          utilize the Blip.money Merchant network for liquidity
                          and off-ramp services.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
                        9.4. Decentralized Governance
                      </h3>
                      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-3 ml-4">
                        <li>
                          <strong>Parameter Optimization:</strong> The DAO
                          ensures the long-term stability by continuously
                          optimizing critical economic parameters α, β, δ, α
                          <sub>success</sub>, β<sub>failure</sub>, γ.
                        </li>
                        <li>
                          <strong>Oracle Transition:</strong> The DAO will
                          manage the transition to a fully decentralized,
                          economic-security-enforced oracle network, further
                          mitigating the Oracle spoofing threat.
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Conclusion */}
                <section id="conclusion" className="mb-16">
                  <h2 className="text-3xl font-bold text-black dark:text-white mb-6">
                    10. Conclusion
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Blip.money defines a hybrid, trust-minimized P2P protocol
                    for cross-border value settlement. By coupling Solana's
                    high-throughput architecture for non-custodial escrow and
                    on-chain reputation with an off-chain, sealed-bid auction
                    for efficient fee discovery, the system achieves enforceable
                    settlement finality. The mechanism relies on a
                    cryptographically bonded Merchant network and a set of
                    game-theoretic incentives designed to align participant
                    behavior toward reliability and low-cost service provision,
                    offering a technically sound alternative to legacy
                    remittance systems.
                  </p>
                </section>

                {/* References */}
                <section id="references" className="mb-16">
                  <h2 className="text-3xl font-bold text-black dark:text-white mb-6">
                    11. References
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                    This section lists the key foundational works and
                    documentation that underpin the Blip.money protocol design.
                    These documents are intended as external links for the final
                    published whitepaper.
                  </p>

                  <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-4">
                    <li>
                      Nakamoto, S.{" "}
                      <em>Bitcoin: A Peer-to-Peer Electronic Cash System.</em>{" "}
                      2008.
                      <div className="ml-6 text-sm text-gray-500">
                        (Link to be added here)
                      </div>
                    </li>
                    <li>
                      Vickrey, W.{" "}
                      <em>
                        Counterspeculation, Auctions, and Competitive Sealed
                        Tenders.
                      </em>{" "}
                      The Journal of Finance, 1961.
                      <div className="ml-6 text-sm text-gray-500">
                        (Link to be added here)
                      </div>
                    </li>
                    <li>
                      Solana Documentation.{" "}
                      <em>Program Derived Addresses and Accounts.</em>
                      <div className="ml-6 text-sm text-gray-500">
                        (Link to be added here)
                      </div>
                    </li>
                    <li>
                      <em>
                        Threshold Cryptography and Multi-Signature Schemes.
                      </em>
                      <div className="ml-6 text-sm text-gray-500">
                        (Link to relevant external research/documentation to be
                        added here)
                      </div>
                    </li>
                    <li>
                      Blip.money Protocol Documentation (v1.0).
                      <div className="ml-6 text-sm text-gray-500">
                        (Link to the official GitHub/Protocol docs to be added
                        here)
                      </div>
                    </li>
                  </ol>
                </section>

                {/* Download Again */}
                <div className="mt-16 p-8 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 text-center">
                  <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
                    Download Full Whitepaper
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Get the complete technical specification as a PDF document.
                  </p>
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-semibold hover:bg-black/80 dark:hover:bg-white/90 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Whitepaper;
