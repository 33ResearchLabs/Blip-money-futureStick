import { useEffect } from "react";
import { Download } from "lucide-react";
import SEO from "./SEO";

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
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDownload = () => {
    // Create a link to download the PDF
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

      <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0a0a0b] text-black dark:text-white">
        {/* Hero Header */}
        <div className="pt-32 pb-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight italic mb-6">
              Whitepaper
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              A Pseudonymous, On-Chain Protocol for Global Peer-to-Peer Value
              Settlement
            </p>

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
                        className="block text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-left"
                      >
                        {index + 1}. {section.title}
                      </button>
                    ))}
                  </nav>
                </div>
              </aside>

              {/* Main Content */}
              <div className="flex-1 max-w-3xl">
                {/* Abstract */}
                <section id="abstract" className="mb-12">
                  <h2 className="text-2xl font-bold text-black dark:text-white mb-4 pb-2 border-b-2 border-black/10 dark:border-white/10">1. Abstract</h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    This paper introduces <strong>Blip.money</strong>, a
                    decentralized, peer-to-peer (P2P) protocol built on the
                    Solana Program Library (SPL) architecture, designed to
                    facilitate trust-minimized, cross-border value settlement.
                    The core innovation lies in establishing an enforceable,
                    pseudonymous P2P layer by mandating that all critical
                    settlement actions—escrow, bond staking, reputation scoring,
                    and dispute resolution—are recorded and enforced via
                    on-chain smart contracts.
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    The system employs a hybrid architecture, utilizing
                    off-chain, sealed-bid auctions for efficient, dynamic fee
                    discovery and on-chain mechanisms for non-custodial escrow,
                    reputation, and merchant staking. This structure ensures
                    settlement finality, low latency, and a permanent, auditable
                    cryptographic trail, thereby mitigating the need for users
                    to rely on centralized financial intermediaries or to expose
                    personal identity for routine transfers.
                  </p>
                </section>

                {/* The Problem */}
                <section id="problem" className="mb-12">
                  <h2 className="text-2xl font-bold text-black dark:text-white mb-4 pb-2 border-b-2 border-black/10 dark:border-white/10">
                    2. The Problem: Limitations of Extant Cross-Border P2P
                    Systems
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                    The current landscape for cross-border and P2P value
                    transfer is characterized by fundamental inefficiencies, a
                    reliance on centralized authority, and a pervasive lack of
                    cryptographic enforcement.
                  </p>

                  <h3 className="text-xl font-bold text-black dark:text-white mb-3">
                    2.1. Inefficient, Manual, and Trust-Based Settlement
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    The prevailing system for international payments suffers
                    from high latency and opaque fee structures due to reliance
                    on layered financial institutions and correspondent banking
                    networks. P2P systems, even those utilizing cryptocurrency,
                    merely shift the off-chain risk.
                  </p>

                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-6 ml-4">
                    <li>
                      <strong>High Latency:</strong> Settlement finality is
                      achieved manually, often requiring human intervention to
                      verify off-chain proofs, leading to significant delays.
                      The maximum execution time (τ<sub>max</sub>) is often
                      minutes or hours, making instant payments unfeasible.
                    </li>
                    <li>
                      <strong>Trust Dependence:</strong> Settlement is
                      non-atomic and reliant on the mutual trust between an
                      unknown User (U) and a Merchant (M). The core technical
                      problem is the absence of a mechanism for trust-minimized
                      P2P liquidity provision across disparate jurisdictions
                      without requiring complete centralization of funds.
                    </li>
                    <li>
                      <strong>No On-Chain Audit Trail:</strong> The critical
                      steps of fiat payment and verification occur off-chain.
                      There is no cryptographic, immutable record of the
                      settlement event, which prevents the creation of provable
                      trust.
                    </li>
                  </ul>

                  <h3 className="text-xl font-bold text-black dark:text-white mb-3">
                    2.2. Failure of Privacy and Pseudonymity
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    Current centralized P2P systems fundamentally violate user
                    privacy and pseudonymous transfer capacity.
                  </p>

                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-6 ml-4">
                    <li>
                      <strong>Identity Exposure:</strong> Users are typically
                      required to expose sensitive information, including phone
                      numbers, chat histories, bank account details, and
                      KYC/AML documents, for every transaction.
                    </li>
                    <li>
                      <strong>Data Linkability:</strong> All transaction data,
                      chat logs, and personal identifiers are aggregated by a
                      central entity, creating a single point of failure and a
                      highly linkable transaction graph for users.
                    </li>
                    <li>
                      <strong>Centralized Reputation:</strong> Reputation
                      systems are off-chain, easy to manipulate, susceptible to
                      Sybil attacks, and tied to the centralized exchange
                      hosting them. They can be reset, deleted, or fabricated.
                    </li>
                  </ul>

                  <h3 className="text-xl font-bold text-black dark:text-white mb-3">
                    2.3. Security Vulnerabilities and Fraud
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    The lack of an enforced, on-chain mechanism makes the system
                    highly vulnerable to fraud.
                  </p>

                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-6 ml-4">
                    <li>
                      <strong>Scam and Non-Delivery Risk:</strong> Dishonest
                      Users or Merchants can exploit the manual verification
                      process using fake bank screenshots, non-delivery of fiat
                      funds, or stalling tactics, which frequently result in
                      frozen funds or chargebacks.
                    </li>
                    <li>
                      <strong>Reputation Manipulation:</strong> Since reputation
                      is off-chain, it is easily inflated or faked, undermining
                      its utility as a reliable signal of counterparty
                      trustworthiness.
                    </li>
                  </ul>

                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Blip.money directly addresses these failures by proposing an
                    electronically enforced, competitive market for global
                    currency settlement, anchored by the Solana blockchain's
                    high throughput and low latency.
                  </p>
                </section>

                {/* Protocol */}
                <section id="protocol" className="mb-12">
                  <h2 className="text-2xl font-bold text-black dark:text-white mb-4 pb-2 border-b-2 border-black/10 dark:border-white/10">
                    3. Blip.money: A Pseudonymous P2P Escrow Protocol
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                    Blip.money is defined as a protocol enabling P2P
                    cross-border value settlement with minimized reliance on
                    trusted third parties. It is a smart-contract enforced
                    system that shifts the settlement burden onto a network of
                    cryptographically bonded Merchants.
                  </p>

                  <h3 className="text-xl font-semibold mb-4">
                    3.1. Core Design Principles
                  </h3>
                  <div className="overflow-x-auto mb-6">
                    <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
                      <thead>
                        <tr className="bg-gray-100 dark:bg-[#1a1a1a]">
                          <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left font-semibold">
                            Principle
                          </th>
                          <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left font-semibold">
                            Description
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-600 dark:text-gray-300">
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-medium">
                            Trust Minimization
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                            Settlement is enforced via smart-contract logic and
                            Merchant cryptographic staking, removing reliance on
                            centralized custodians.
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-medium">
                            Non-Custodial Escrow
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                            User funds are locked in a Program Derived Address
                            (PDA) on Solana, controllable only by the Blip.money
                            program logic, not by a single private key.
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-medium">
                            Competitive Liquidity
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                            Fees are discovered dynamically through a
                            sealed-bid, second-price auction, driving costs
                            toward the marginal cost of the most efficient
                            Merchant.
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-medium">
                            Accountability
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                            Merchant performance is secured by a required
                            cryptographic Bond (B) and a reputation score subject
                            to a slashing mechanism for non-performance.
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-medium">
                            High Performance
                          </td>
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
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
                <section id="features" className="mb-12">
                  <h2 className="text-2xl font-bold text-black dark:text-white mb-4 pb-2 border-b-2 border-black/10 dark:border-white/10">
                    4. Core Features and Innovation
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                    Blip.money introduces several technical innovations to
                    establish the first truly enforceable, pseudonymous P2P
                    settlement layer.
                  </p>

                  <h3 className="text-xl font-bold text-black dark:text-white mb-3">
                    4.1. Pseudonymous P2P Settlement Layer
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    The protocol is designed to maximize user privacy by
                    minimizing data exposure at the protocol level.
                  </p>

                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-6 ml-4">
                    <li>
                      <strong>Cryptographic Identity:</strong> The User's (U)
                      identity is restricted to their cryptographic keypair on
                      Solana. The base protocol does not require KYC, phone
                      numbers, or external account information from the User.
                    </li>
                    <li>
                      <strong>Off-Chain Negotiation Shield:</strong> Users do
                      not need to expose identity or chat history to the
                      Merchant to initiate the transaction. All that is required
                      is the ability to cryptographically sign the Order (O).
                    </li>
                    <li>
                      <strong>Linkability Reduction:</strong> Users may employ
                      ephemeral wallets for each transaction. Interaction with
                      the protocol can be conducted via privacy-preserving
                      relayers, minimizing linkability between the on-chain
                      activity and the off-chain fiat receipt.
                    </li>
                    <li>
                      <strong>Merchant-Only KYC Burden:</strong> Only the
                      Merchants (liquidity providers), who must interface with
                      traditional banking/fiat rails, bear the burden of
                      potential regulatory compliance (e.g., KYC for their own
                      operational accounts) and financial staking.
                    </li>
                  </ul>

                  <h3 className="text-xl font-bold text-black dark:text-white mb-3">
                    4.2. On-Chain Enforcement and Audit Trail
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    The protocol's integrity is guaranteed by the immutability
                    of the Solana state.
                  </p>

                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-6 ml-4">
                    <li>
                      <strong>Atomic State Transitions:</strong> All key
                      events—Escrow Deposit, Escrow Release, Refund, and
                      Slashing—are executed as atomic, single-transaction state
                      transitions within the Blip.money program.
                    </li>
                    <li>
                      <strong>Provable Finality:</strong> Settlement finality is
                      achieved via smart-contract enforcement. Once the Oracle's
                      (R) cryptographic proof of off-chain payout is verified
                      on-chain, the Escrow PDA (E) must execute the Release
                      Operation.
                    </li>
                    <li>
                      <strong>Non-Repudiation:</strong> Orders, Bids, and Oracle
                      proofs are signed messages incorporating a unique Order
                      Hash and a sequence number, preventing replay attacks and
                      guaranteeing non-repudiation.
                    </li>
                  </ul>

                  <h3 className="text-xl font-bold text-black dark:text-white mb-3">
                    4.3. On-Chain Reputation and Accountability System
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    Merchant reliability is quantified and enforced on-chain,
                    replacing central authority feedback systems.
                  </p>

                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-6 ml-4">
                    <li>
                      <strong>Reputation PDA(R):</strong> A persistent,
                      non-resetting Reputation Score is maintained for every
                      Merchant in their dedicated, cryptographically secured
                      Reputation PDA.
                    </li>
                    <li>
                      <strong>Algorithmic Update Rules:</strong> The score is
                      updated based on successful or unsuccessful Escrow
                      closure, with success scaling logarithmically and failure
                      scaling polynomially.
                    </li>
                    <li>
                      <strong>Tiering and Access Control:</strong> The Tier is
                      derived from the score, influencing the maximum Order size
                      a Merchant can accept.
                    </li>
                    <li>
                      <strong>Auction Weighting:</strong> Reputation is a
                      critical input to the Auction Winner Function, where a
                      higher reputation increases the Merchant's effective bid
                      score.
                    </li>
                  </ul>

                  <h3 className="text-xl font-bold text-black dark:text-white mb-3">
                    4.4. DAO-Based Dispute and Governance System
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    Dispute resolution and critical protocol parameters are
                    governed by a Decentralized Autonomous Organization (DAO).
                  </p>

                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-6 ml-4">
                    <li>
                      <strong>DAO Authority:</strong> The DAO is the collective
                      entity responsible for protocol governance, including
                      setting slashing parameters, fee schedules, and initial
                      Oracle management.
                    </li>
                    <li>
                      <strong>Dispute Resolution:</strong> In the event of a
                      Timeout or a Proof Submit failure, the Escrow state
                      transitions to DISPUTE. The DAO can resolve disputes by
                      using evidence and Oracle proofs.
                    </li>
                    <li>
                      <strong>DAO Actions:</strong> Upon DAO Resolution, the DAO
                      can execute the Forced Closure operation on the Escrow
                      PDA, which may result in partial/full release, refund, or
                      bond slashing.
                    </li>
                  </ul>

                  <h3 className="text-xl font-bold text-black dark:text-white mb-3">
                    4.5. Ultra-Fast Settlement via Solana
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    The selection of Solana as the base layer is critical for
                    achieving low-latency settlement.
                  </p>

                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-6 ml-4">
                    <li>
                      <strong>Low-Latency Transactions:</strong> Solana's
                      architecture enables rapid state transitions for Order
                      creation, Escrow funding, Merchant matching, and Escrow
                      release.
                    </li>
                    <li>
                      <strong>Liveness Guarantees:</strong> The rapid
                      confirmation time is essential for maintaining the maximum
                      execution time liveness guarantee.
                    </li>
                    <li>
                      <strong>Efficient On-Chain Verification:</strong> On-chain
                      verification of the Oracle signature is executed within
                      the constrained Solana Compute Budget.
                    </li>
                  </ul>
                </section>

                {/* Architecture */}
                <section id="architecture" className="mb-12">
                  <h2 className="text-2xl font-bold text-black dark:text-white mb-4 pb-2 border-b-2 border-black/10 dark:border-white/10">
                    5. System Architecture
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                    The Blip.money protocol is defined by a set of actors and a
                    collection of cryptographically secured Program Derived
                    Addresses (PDAs) on the Solana blockchain.
                  </p>

                  <h3 className="text-xl font-bold text-black dark:text-white mb-3">5.1. Actors</h3>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-6 ml-4">
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
                      <strong>Oracle (R):</strong> A designated, signed entity
                      responsible for submitting cryptographic proof of
                      off-chain fiat payout, which triggers the Escrow release.
                    </li>
                    <li>
                      <strong>Decentralized Autonomous Organization (DAO):</strong>{" "}
                      The collective entity responsible for protocol governance
                      and dispute resolution.
                    </li>
                  </ul>

                  <h3 className="text-xl font-bold text-black dark:text-white mb-3">
                    5.2. Core Data Structures and PDAs
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    All on-chain state is stored in Program Derived Addresses
                    (PDAs), which are cryptographically controlled by the
                    Blip.money program, guaranteeing non-custodial handling of
                    funds.
                  </p>

                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-6 ml-4">
                    <li>
                      <strong>Order (O):</strong> The formal record of the
                      desired transfer with parameters including user, currency,
                      amount, and maximum execution time.
                    </li>
                    <li>
                      <strong>Escrow PDA (E):</strong> A non-custodial smart
                      contract that cryptographically holds the User's funds
                      until a Merchant proves settlement or a timeout occurs.
                    </li>
                    <li>
                      <strong>Reputation PDA (R):</strong> A structure storing
                      the on-chain performance record for a Merchant M.
                    </li>
                    <li>
                      <strong>Staking/Bond PDA (S):</strong> A structure holding
                      the Merchant's cryptographic bond (B).
                    </li>
                    <li>
                      <strong>DAO Vault:</strong> A separate PDA or set of
                      accounts that holds slashed Bond funds and platform fees.
                    </li>
                  </ul>

                  <h3 className="text-xl font-bold text-black dark:text-white mb-3">
                    5.3. Hybrid Architecture Model
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    The protocol utilizes an off-chain/on-chain hybrid model for
                    efficiency.
                  </p>

                  <ol className="list-decimal list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-6 ml-4">
                    <li>
                      <strong>Off-Chain Indexer:</strong> Aggregates and scores
                      Merchant Bids based on the Auction Mechanism. This
                      off-chain processing prevents network congestion and
                      reduces transaction costs.
                    </li>
                    <li>
                      <strong>On-Chain Program:</strong> The core smart contract
                      logic on Solana that manages Escrow state transitions,
                      verifies the Oracle signature, and updates the Reputation
                      and Bond PDAs.
                    </li>
                  </ol>
                </section>

                {/* Transaction Lifecycle */}
                <section id="lifecycle" className="mb-12">
                  <h2 className="text-2xl font-bold text-black dark:text-white mb-4 pb-2 border-b-2 border-black/10 dark:border-white/10">
                    6. Transaction Lifecycle: Step-by-Step
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                    The Blip.money protocol operates in a sequence of
                    interdependent on-chain and off-chain steps. The Escrow
                    State Machine is the core enforcer of finality.
                  </p>

                  <div className="space-y-4">
                    <div className="p-4 bg-white dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-gray-800">
                      <h4 className="font-semibold mb-2">1. Order Creation</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        User broadcasts Order (O) off-chain with detailed
                        parameters.
                      </p>
                    </div>

                    <div className="p-4 bg-white dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-gray-800">
                      <h4 className="font-semibold mb-2">2. Merchant Bidding</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Merchants submit signed Bids to the off-chain indexer
                        during the auction window.
                      </p>
                    </div>

                    <div className="p-4 bg-white dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-gray-800">
                      <h4 className="font-semibold mb-2">
                        3. Winner Publication
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Indexer determines winning Merchant and publishes on-chain,
                        initializing Escrow and Reputation PDAs.
                      </p>
                    </div>

                    <div className="p-4 bg-white dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-gray-800">
                      <h4 className="font-semibold mb-2">4. Escrow Deposit</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        User deposits funds into Escrow PDA, initiating the
                        maximum execution time timer.
                      </p>
                    </div>

                    <div className="p-4 bg-white dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-gray-800">
                      <h4 className="font-semibold mb-2">
                        5. Merchant Settlement
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Winning Merchant executes off-chain fiat payout and
                        obtains Proof-of-Settlement from Oracle.
                      </p>
                    </div>

                    <div className="p-4 bg-white dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-gray-800">
                      <h4 className="font-semibold mb-2">6. Proof Submission</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Merchant or Oracle submits signed proof to the on-chain
                        program for verification.
                      </p>
                    </div>

                    <div className="p-4 bg-white dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-gray-800">
                      <h4 className="font-semibold mb-2">7. Escrow Release</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Program verifies Oracle signature, releases funds to
                        Merchant, and increments Reputation score.
                      </p>
                    </div>

                    <div className="p-4 bg-white dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-gray-800">
                      <h4 className="font-semibold mb-2">8. Refund Path</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        If timeout elapses without proof, User initiates Refund.
                        Funds return to User, Reputation decremented, Bond
                        reviewed for slashing.
                      </p>
                    </div>

                    <div className="p-4 bg-white dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-gray-800">
                      <h4 className="font-semibold mb-2">9. Dispute Path</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        User or Merchant flags a Dispute. DAO resolves, resulting
                        in either RELEASED or REFUNDED state.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Economic Incentives */}
                <section id="economics" className="mb-12">
                  <h2 className="text-2xl font-bold text-black dark:text-white mb-4 pb-2 border-b-2 border-black/10 dark:border-white/10">
                    7. Economic Incentives and Token Model
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                    The protocol is engineered to align the economic incentives
                    of all participants, securing the system through staked
                    capital and reputation.
                  </p>

                  <h3 className="text-xl font-bold text-black dark:text-white mb-3">
                    7.1. Merchant Bond and Slashing
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    Merchants must post a cryptographic Bond (B) in their
                    Staking/Bond PDA (S).
                  </p>

                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-6 ml-4">
                    <li>
                      <strong>Mitigation of Non-Delivery:</strong> The Bond
                      mitigates the financial incentive for non-delivery. The
                      potential gain from fraud is capped while the loss from
                      slashing is the staked Bond.
                    </li>
                    <li>
                      <strong>Incentive Compatibility:</strong> The maximum
                      Order value allowed for a Merchant's Bond level is set to
                      ensure the penalty outweighs the reward.
                    </li>
                    <li>
                      <strong>Expected Profit:</strong> Merchant participation
                      is sustained if their expected profit from successful
                      transactions exceeds losses from failures.
                    </li>
                  </ul>

                  <h3 className="text-xl font-bold text-black dark:text-white mb-3">
                    7.2. Fee Model and Splits
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    Merchant revenue is generated from the fee paid by the User.
                    This revenue is competitive, driven toward the marginal cost
                    of the most efficient Merchant.
                  </p>

                  <h3 className="text-xl font-bold text-black dark:text-white mb-3">
                    7.3. Reputation-Based Cost Reduction
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    The reputation weighting in the Auction creates a long-term
                    incentive for truthfulness and reliability.
                  </p>

                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-6 ml-4">
                    <li>
                      <strong>Monetization of Reliability:</strong> Past
                      reliable performance is monetized by increasing the
                      likelihood of winning future Orders.
                    </li>
                    <li>
                      <strong>Dynamic Subsidy:</strong> High-reputation
                      Merchants receive a reputation-based cost reduction,
                      allowing them to win at marginally better effective rates.
                    </li>
                    <li>
                      <strong>Game-Theoretic Stability:</strong> The system is
                      stable as the value of the Bond and accumulated Reputation
                      must exceed the maximum single-transaction profit from
                      non-compliance.
                    </li>
                  </ul>
                </section>

                {/* Regulatory Neutrality */}
                <section id="regulatory" className="mb-12">
                  <h2 className="text-2xl font-bold text-black dark:text-white mb-4 pb-2 border-b-2 border-black/10 dark:border-white/10">
                    8. Regulatory Neutrality and Frontends
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                    The Blip.money protocol adopts a principle of regulatory
                    neutrality, similar to other open-source protocols.
                  </p>

                  <h3 className="text-xl font-bold text-black dark:text-white mb-3">
                    8.1. Pseudonymous Core Protocol
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    The base layer of Blip.money is designed to be pseudonymous
                    and neutral.
                  </p>

                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-6 ml-4">
                    <li>
                      <strong>No Base-Layer KYC:</strong> The protocol does not
                      require Users or Merchants to submit identifying
                      information to the smart contract logic.
                    </li>
                    <li>
                      <strong>Censorship Resistance:</strong> The Escrow PDA is
                      secured by the Solana runtime, and only the Blip.money
                      program can execute token transfers out of it.
                    </li>
                  </ul>

                  <h3 className="text-xl font-bold text-black dark:text-white mb-3">
                    8.2. Frontend Compliance Layer
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    Regulatory compliance is a matter for the external
                    interfaces and the Merchants themselves.
                  </p>

                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-6 ml-4">
                    <li>
                      <strong>Optional KYC:</strong> Frontends or service
                      providers built on top of Blip.money may implement KYC/AML
                      checks based on their local legal requirements.
                    </li>
                    <li>
                      <strong>Merchant Discretion:</strong> Merchants operating
                      in regulated corridors are responsible for any required
                      off-chain identity verification.
                    </li>
                  </ul>
                </section>

                {/* Ecosystem Vision */}
                <section id="ecosystem" className="mb-12">
                  <h2 className="text-2xl font-bold text-black dark:text-white mb-4 pb-2 border-b-2 border-black/10 dark:border-white/10">
                    9. Ecosystem Vision
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                    Blip.money is envisioned as a foundational,
                    censorship-resistant rail for global liquidity.
                  </p>

                  <h3 className="text-xl font-bold text-black dark:text-white mb-3">
                    9.1. Global P2P Liquidity Rail
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    The protocol provides a standardized, low-latency framework
                    for instantaneous value transfer.
                  </p>

                  <h3 className="text-xl font-bold text-black dark:text-white mb-3">
                    9.2. Merchant Network Expansion
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    The on-chain Reputation PDA and the competitive auction
                    model provide a clear, monetizable path for reliable
                    Merchants to increase their volume and profit.
                  </p>

                  <h3 className="text-xl font-bold text-black dark:text-white mb-3">
                    9.3. Protocol Integration and Utility
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    Direct integration with non-custodial wallets can offer an
                    in-wallet P2P settlement feature. A standardized interface
                    will allow any FinTech application to utilize the Blip.money
                    Merchant network.
                  </p>

                  <h3 className="text-xl font-bold text-black dark:text-white mb-3">
                    9.4. Decentralized Governance
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                    The DAO ensures long-term stability by continuously
                    optimizing critical economic parameters and managing the
                    transition to a fully decentralized oracle network.
                  </p>
                </section>

                {/* Conclusion */}
                <section id="conclusion" className="mb-12">
                  <h2 className="text-2xl font-bold text-black dark:text-white mb-4 pb-2 border-b-2 border-black/10 dark:border-white/10">
                    10. Conclusion
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Blip.money defines a hybrid, trust-minimized P2P protocol
                    for cross-border value settlement. By coupling Solana's
                    high-throughput architecture for non-custodial escrow and
                    on-chain reputation with an off-chain, sealed-bid auction
                    for efficient fee discovery, the system achieves enforceable
                    settlement finality. The mechanism relies on a
                    cryptographically bonded Merchant network and a set of
                    game-theoretic incentives designed to align participant
                    behavior toward reliability and low-cost service provision,
                    offering a technically sound alternative to legacy remittance
                    systems.
                  </p>
                </section>

                {/* References */}
                <section id="references" className="mb-12">
                  <h2 className="text-2xl font-bold text-black dark:text-white mb-4 pb-2 border-b-2 border-black/10 dark:border-white/10">
                    11. References
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                    This section lists the key foundational works and
                    documentation that underpin the Blip.money protocol design.
                  </p>

                  <ol className="list-decimal list-inside text-gray-600 dark:text-gray-300 space-y-3">
                    <li>
                      Nakamoto, S. <em>Bitcoin: A Peer-to-Peer Electronic Cash System.</em> 2008.
                    </li>
                    <li>
                      Vickrey, W. <em>Counterspeculation, Auctions, and Competitive Sealed Tenders.</em> The Journal of Finance, 1961.
                    </li>
                    <li>
                      Solana Documentation. <em>Program Derived Addresses and Accounts.</em>
                    </li>
                    <li>
                      <em>Threshold Cryptography and Multi-Signature Schemes.</em>
                    </li>
                    <li>
                      Blip.money Protocol Documentation (v1.0).
                    </li>
                  </ol>
                </section>

                {/* Download Again */}
                <div className="mt-16 p-8 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 text-center">
                  <h3 className="text-2xl font-bold text-black dark:text-white mb-4 pb-2 border-b-2 border-black/10 dark:border-white/10">
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
