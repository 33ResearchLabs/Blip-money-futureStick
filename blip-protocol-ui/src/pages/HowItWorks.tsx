import React, { useEffect } from "react";



export const HowItWorksPage = () => {
  // Custom Color Constants mapped from the original HTML
  const colors = {
    bgPrimary: "#000000",
    bgSecondary: "#070A08",
    bgCard: "#0B0F0D",
    bgCardHover: "#0F1512",
    greenPrimary: "#00E599",
    textSecondary: "#A3B1AA",
    textMuted: "#6F7C76",
  };

  useEffect(()=>{
    scrollTo(0,0)
  },[])

  const DigitalGridBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          "linear-gradient(to right, #00FF9410 1px, transparent 1px), linear-gradient(to bottom, #00FF9410 1px, transparent 1px)",
        backgroundSize: "80px 80px",
        animation: "wave 60s linear infinite",
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-br from-[#020202] via-transparent to-[#020202]" />

    {/* Center pulsing glow */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] rounded-full bg-[#00FF94]/5 blur-[100px] animate-[pulse-slow_6s_ease-in-out_infinite]" />
  </div>
);

  return (
    <div className="min-h-screen bg-[#000000] font-sans overflow-x-hidden ">
      {/* Inject Fonts and Global Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto+Mono:wght@400;500;700&display=swap');

        body {
          background-color: #000000;
          background-image: radial-gradient(80% 60% at 50% 0%, rgba(0, 255, 160, 0.06), transparent 60%);
        }

        .text-[#2BFF88] {
          background-image: linear-gradient(90deg, #00E599, #00FFB3);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .timeline-dot-shadow {
          box-shadow: 0 0 0 4px #000000, 0 0 10px rgba(0, 229, 153, 0.35);
        }
      `}</style>

      <main className="max-w-7xl mx-auto ">
        {/* 1. Hero Section */}
        <section id="hero" className="text-center pt-[140px] pb-[120px] relative ">
         {/* <div className="absolute inset-0 bg-gradient-to-tr from-[#2BFF88]/15 to-transparent blur-3xl rounded-full" />  */}
         <DigitalGridBackground /> 
          <h1 className="text-6xl sm:text-7xl lg:text-7xl mb-6 text-white font-semibold tracking-wide leading-[1.1]">
            <span className="text-[#2BFF88]">Value. Settled.</span>
            <br />
            Privately.
          </h1>
          <p className="text-xl sm:text-2xl text-[#A3B1AA] max-w-[720px] mx-auto mb-10 font- tracking-wider line-clamp-3">
            Blip.money is the on-chain protocol for instant, secure, and
            KYC-free global value transfer.
          </p>
        </section>

        {/* Key Features Section */}
        <section
          id="key-features"
          className="pb-[120px] border-t border-white/15"
        >
          <h2 className="sr-only">Key Concepts</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-10">
            {[
              {
                title: "Non-Custodial Escrow",
                desc: "Funds are secured by code, not intermediaries.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  ></path>
                ),
              },
              {
                title: "Zero Intermediaries",
                desc: "Direct settlement between wallet and merchant processor.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                ),
              },
              {
                title: "Privacy-First Design",
                desc: "Wallet-based access with zero KYC required.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 8a8 8 0 01-8-8c0-2.887 2.146-5.267 5-5.917V6.083C7.146 6.733 5 9.113 5 12a7 7 0 1014 0z"
                  ></path>
                ),
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="p-6 text-center rounded-[14px] bg-gradient-to-b from-white/3 to-white/1 border border-white/6 hover:border-[#00FF94]/60 hover:shadow-[0_0_40px_rgba(0,255,148,0.25)] transition-all duration-500"
              >
                <svg
                  className="w-8 h-8 text-[#00E599] mx-auto mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {feature.icon}
                </svg>
                <span className="text-xl font-semibold text-white font-sans tracking-tight">
                  {feature.title}
                </span>
                <p className="text-sm text-[#6F7C76] mt-1">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 2. The Core Idea */}
        <section id="core-idea" className="py-[120px] border-t border-white/15">
          <h2 className="text-5xl max-w-4xl mx-auto mb-16 text-center text-white font-semibold tracking-wide">
            The Protocol: Trust Redefined.
          </h2>
          <p className="text-lg text-[#A3B1AA] max-w-[640px] mx-auto text-center mb-12">
            Blip.money is a decentralized, trust-minimized settlement layer that
            enables global transfers across crypto, cash, and bank rails without
            centralized intermediaries.
          </p>

          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto text-center">
            {[
              {
                title: "1. Escrow PDA",
                desc: "Funds are secured by an immutable smart contract account until conditions are met.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  ></path>
                ),
              },
              {
                title: "2. Merchant Staking",
                desc: "Off-chain executors lock collateral as skin-in-the-game for secure execution.",
                icon: (
                  <>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M15 7a2 2 0 012 2v5a2 2 0 01-2 2h-5a2 2 0 01-2-2V9a2 2 0 012-2h5z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M17 17L19 19"
                    ></path>
                  </>
                ),
              },
              {
                title: "3. DAO Governance",
                desc: "A decentralized body provides final, non-custodial arbitration during disputes.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 8a8 8 0 01-8-8c0-2.887 2.146-5.267 5-5.917V6.083C7.146 6.733 5 9.113 5 12a7 7 0 1014 0z"
                  ></path>
                ),
              },
              {
                title: "4. Wallet-Only Access",
                desc: "Access requires zero KYC, ensuring financial privacy and censorship resistance.",
                icon: (
                  <>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M12 11c0-1.657-1.343-3-3-3s-3 1.343-3 3v4a3 3 0 003 3h4a3 3 0 003-3v-4c0-1.657-1.343-3-3-3s-3 1.343-3 3v4"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M12 22s-8-6-8-10A8 8 0 0112 2a8 8 0 018 8c0 4-8 10-8 10z"
                    ></path>
                  </>
                ),
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-[14px] bg-gradient-to-b from-white/3 to-white/1 border border-white/6 hover:border-[#00FF94]/60 hover:shadow-[0_0_40px_rgba(0,255,148,0.25)] transition-all duration-500"
              >
                <svg
                  className="w-8 h-8 text-[#00E599] mx-auto mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {item.icon}
                </svg>
                <h3 className="text-xl font-medium text-[#00E599] mb-2 font-sans tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm text-[#A3B1AA]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. How It Works: Transaction Flow */}
        <section id="lifecycle" className="py-[120px] border-t border-white/15">
          <h2 className="text-5xl text-center mb-16 text-white font-semibold tracking-wide">
            How It Works: Atomic Transaction Flow
          </h2>
          <div className="max-w-[720px] mx-auto">
            <p className="text-lg text-[#A3B1AA] max-w-[640px] mx-auto text-center mb-10">
              The entire transaction executes atomically, guaranteed by on-chain
              escrow state transitions.
            </p>

            <ol className="relative border-l border-[#00E599]/15 mx-auto max-w-2xl">
              {[
                {
                  id: "1",
                  title: "01. Initiation & Lock",
                  content:
                    "User defines order parameters (amount, recipient) and executes FUND_ESCROW.",
                  result:
                    "Funds are immediately secured in the immutable Escrow PDA.",
                },
                {
                  id: "2",
                  title: "02. Commitment & Stake",
                  content:
                    "A Merchant accepts the order and locks their proportional collateral stake.",
                  result:
                    "Escrow state moves to IN_PROGRESS. Merchant guarantees execution within the set timeout (τ_max).",
                },
                {
                  id: "3",
                  title: "03. Off-Chain Payout",
                  content:
                    "The Merchant executes the fiat payout (cash, bank, or wire) to the designated recipient off-chain.",
                  result:
                    "Fiat value is delivered. The transaction is ready for on-chain verification.",
                },
                {
                  id: "4",
                  title: "04. Verification & Release",
                  content:
                    "The user confirms receipt (or Merchant submits Proof). The escrow instantly executes RELEASE_FUNDS.",
                  result:
                    "Crypto is sent to the Merchant, stake is returned, and the escrow moves to COMPLETED.",
                },
                {
                  id: "5",
                  title: "05. Finality or Arbitration",
                  content:
                    "If a dispute is raised before the timeout, the DAO reviews evidence and votes on resolution.",
                  result:
                    "The transaction reaches its final state: COMPLETED, RESOLVED, or SLASHED.",
                },
              ].map((step, idx) => (
                <>
                  <li
                    key={idx}
                    className={`mb-10 ml-6 p-5 rounded-[14px] bg-[#0B0F0D] border border-white/6 hover:border-[#00FF94]/60 hover:shadow-[0_0_40px_rgba(0,255,148,0.25)] transition-all duration-500`}
                  >
                    <span className="absolute p-4 flex items-center justify-center w-6 h-6 text-white rounded-full -left-3 ring-4 ring-[#000000]  font-semibold font-sans text-sm timeline-dot-shadow">
                      {step.id}
                    </span>
                    <h3 className="flex items-center mb-1 text-2xl font-medium text-white font-sans tracking-tight">
                      {step.title}
                    </h3>
                    <p className="mb-2 text-[#A3B1AA]">
                      {step.content.split(" ").map((word, wIdx) =>
                        ["FUND_ESCROW", "IN_PROGRESS", "RELEASE_FUNDS"].some(
                          (k) => word.includes(k)
                        ) ? (
                          <span key={wIdx} className="text-[#00E599] font-sans">
                            {word}{" "}
                          </span>
                        ) : (
                          word + " "
                        )
                      )}
                    </p>
                    <p className="text-[#6F7C76] text-sm">
                      Result:{" "}
                      {step.result.split(" ").map((word, wIdx) =>
                        [
                          "PDA",
                          "IN_PROGRESS",
                          "COMPLETED",
                          "RESOLVED",
                          "SLASHED",
                        ].some((k) => word.includes(k)) ? (
                          <span key={wIdx} className="font-sans text-[#A3B1AA]">
                            {word}{" "}
                          </span>
                        ) : (
                          word + " "
                        )
                      )}
                    </p>
                  </li>
                </>
              ))}
            </ol>
          </div>
        </section>

        {/* 4. Technical Architecture */}
        <section
          id="architecture"
          className="py-[120px] border-t border-white/15"
        >
          <h2 className="text-5xl text-center mb-16 text-white font-semibold tracking-wide">
            System Architecture: Hybrid Trust
          </h2>
          <p className="text-lg text-[#A3B1AA] max-w-[640px] mx-auto text-center mb-10">
            Blip.money uses a hybrid on-chain / off-chain architecture to
            maximize speed, privacy, and scalability. On-chain logic is
            minimized to only what must be trusted.
          </p>

          <div className="max-w-4xl mx-auto mb-16 rounded-[14px] bg-gradient-to-b from-white/3 to-white/1 border border-white/6 overflow-hidden">
            <div className="grid grid-cols-3 text-sm sm:text-base font-semibold text-[#00E599] border-b border-white/6 bg-[#070A08] p-4 font-sans tracking-tight">
              <div className="uppercase">Layer</div>
              <div className="uppercase">Responsibility</div>
              <div className="uppercase">On-chain Components</div>
            </div>
            <div className="grid grid-cols-3 border-b border-white/6 p-4 hover:bg-[#0F1512] transition">
              <div className="text-[#00E599] font-sans">On-chain</div>
              <div className="text-white">Trust, Finality, Enforcement</div>
              <div className="text-[#A3B1AA] text-sm">
                Escrow Locking, Merchant Staking, Governance Voting
              </div>
            </div>
            <div className="grid grid-cols-3 p-4 hover:bg-[#0F1512] transition">
              <div className="text-[#00E599] font-sans">Off-chain</div>
              <div className="text-white">
                Speed, Fiat Interaction, Discovery
              </div>
              <div className="text-[#A3B1AA] text-sm">
                Fiat Execution, Merchant Routing, Proof Aggregation
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto pt-16 border-t border-white/15">
            <h3 className="text-2xl font-medium text-[#00E599] mb-8 text-center tracking-wide">
              Escrow Architecture
            </h3>
            <p className="text-lg text-[#A3B1AA] mb-8 text-center">
              Each transaction utilizes a unique Escrow{" "}
              <span className="font-sans text-[#00E599]">PDA</span> on Solana,
              serving as the immutable trust primitive of the protocol.
            </p>

            <div className="grid md:grid-cols-3 gap-6 text-center">
              {[
                {
                  title: "IMMUTABLE",
                  desc: "Conditions set at creation cannot be modified.",
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M7 7h10M7 7v10M7 7l10 10m-3-10h3M10 10v3M10 10h3"
                    ></path>
                  ),
                },
                {
                  title: "TIME-BOUND",
                  desc: "Timeouts enforce liveness and prevent state lock.",
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  ),
                },
                {
                  title: "DETERMINISTIC",
                  desc: "Fund release governed strictly by code state.",
                  icon: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M14 10l-2 1m0 0l-2-1m2 1v2.5M12 21a9 9 0 100-18 9 9 0 000 18zm0 0l-1-1m1 1l1-1"
                    ></path>
                  ),
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-[14px] bg-gradient-to-b from-white/3 to-white/1 border border-white/6 hover:border-[#00FF94]/60 hover:shadow-[0_0_40px_rgba(0,255,148,0.25)] transition-all duration-500"
                >
                  <svg
                    className="w-8 h-8 text-[#00E599] mx-auto mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {item.icon}
                  </svg>
                  <p className="font-bold text-white text-xl font-sans tracking-wide">
                    {item.title}
                  </p>
                  <p className="text-sm text-[#6F7C76] mt-2">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Cryptographic Security Model */}
        <section id="security" className="py-[120px] border-t border-white/15">
          <h2 className="text-5xl text-center mb-16 text-white font-semibold tracking-wide">
            Cryptographic Security Model
          </h2>
          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto text-center">
            {[
              {
                title: "Economic Enforcement",
                desc: "Security is enforced by economic incentives, not promises. Merchant stake is always at risk (slashing) if delivery is unconfirmed or fraudulent.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                ),
              },
              {
                title: "Immutable Code",
                desc: "No admin keys control user funds. The protocol leverages non-upgradable custody contracts, ensuring finality and preventing unauthorized changes.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  ></path>
                ),
              },
              {
                title: "DAO Arbiter",
                desc: "The DAO acts as the final arbiter during contested disputes. This mechanism decentralizes control and prevents single-party failure.",
                icon: (
                  <>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M17 14v6m-4-2h4m0 0l-4-4m4 4l-4 4"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M12 18h4a2 2 0 002-2v-4a2 2 0 00-2-2H8a2 2 0 00-2 2v4a2 2 0 002 2h4z"
                    ></path>
                  </>
                ),
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-8 rounded-[14px] bg-gradient-to-b from-white/3 to-white/1 border border-white/6 hover:border-[#00FF94]/60 hover:shadow-[0_0_40px_rgba(0,255,148,0.25)] transition-all duration-500"
              >
                <svg
                  className="w-8 h-8 text-[#00E599] mx-auto mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {item.icon}
                </svg>
                <h3 className="text-2xl font-medium mb-3 text-white">
                  {item.title}
                </h3>
                <p className="text-[#A3B1AA]">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-12 border-t border-white/15 max-w-4xl mx-auto">
            <h3 className="text-3xl font-medium text-[#00E599] text-center mb-6 tracking-wide">
              Latency & Settlement Guarantees
            </h3>
            <div className="grid md:grid-cols-3 text-center gap-4 text-[#A3B1AA] font-sans">
              <div>
                <p className="text-4xl font-extrabold text-white tracking-wide">
                  ~500ms
                </p>
                <p className="text-sm text-[#00E599]">Escrow Lock</p>
              </div>
              <div>
                <p className="text-4xl font-extrabold text-white tracking-wide">
                  {"< 1s"}
                </p>
                <p className="text-sm text-[#00E599]">Proof Verification</p>
              </div>
              <div>
                <p className="text-4xl font-extrabold text-white tracking-wide">
                  Solana Finality
                </p>
                <p className="text-sm text-[#00E599]">On-chain Finality</p>
              </div>
            </div>
            <p className="text-lg text-[#A3B1AA] mt-8 text-center">
              Blip.money targets near-instant settlement, minimizing exposure
              time for both user and merchant.
            </p>
          </div>
        </section>

        {/* 6. Order Types */}
        <section id="use-cases" className="py-[120px] border-t border-white/15">
          <h2 className="text-5xl text-center mb-16 text-white font-semibold tracking-wide">
            Order Types
          </h2>
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "Crypto → Cash",
                desc: "The fastest way to convert digital assets into physical currency anywhere in the world, secured by localized, staked merchant commitment.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                ),
              },
              {
                title: "Crypto → Bank / Wire",
                desc: "Anonymously settle high-value transactions directly into any bank account or corporate wire system, bypassing traditional identity requirements.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  ></path>
                ),
              },
              {
                title: "Crypto → Crypto",
                desc: "Instantly swap assets across different chains using the same escrow security model, ensuring seamless capital mobility without relying on CEX infrastructure.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  ></path>
                ),
              },
            ].map((type, idx) => (
              <div
                key={idx}
                className="p-10 rounded-[14px] bg-gradient-to-b from-white/3 to-white/1 border border-white/6 hover:border-[#00FF94]/60 hover:shadow-[0_0_40px_rgba(0,255,148,0.25)] transition-all duration-500"
              >
                <svg
                  className="w-12 h-12 text-[#00E599] mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {type.icon}
                </svg>
                <h3 className="text-2xl font-medium mb-3 text-white">
                  {type.title}
                </h3>
                <p className="text-[#A3B1AA]">{type.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Protocol Economics */}
        <section id="fees" className="py-[120px] border-t border-white/15">
          <h2 className="text-5xl text-center mb-16 text-white font-semibold tracking-wide">
            Protocol Economics & Governance
          </h2>
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Merchant Staking */}
            <div className="p-8 rounded-[14px] bg-gradient-to-b from-white/3 to-white/1 border border-white/6 hover:border-[#00FF94]/60 hover:shadow-[0_0_40px_rgba(0,255,148,0.25)] transition-all duration-500">
              <h3 className="text-2xl font-medium mb-4 text-[#00E599]">
                Merchant Staking & Reputation
              </h3>
              <p className="text-[#A3B1AA] mb-4">
                Merchants must stake BLIP tokens and accept slashing risk.
                Reputation increases order priority, fee share, and trust score.
              </p>
              <ul className="list-disc list-inside text-[#A3B1AA] space-y-1 ml-4">
                <li>
                  High reputation provides increased order priority and greater
                  fee share.
                </li>
                <li>
                  DAO-governed protocol ensures decentralized evolution and fee
                  distribution.
                </li>
                <li>
                  Slashing mechanism enforces accountability and protects user
                  funds.
                </li>
              </ul>
            </div>

            {/* Fee Mechanics */}
            <div className="p-8 rounded-[14px] bg-gradient-to-b from-white/3 to-white/1 border border-white/6 hover:border-[#00FF94]/60 hover:shadow-[0_0_40px_rgba(0,255,148,0.25)] transition-all duration-500">
              <h3 className="text-2xl font-medium mb-4 text-[#00E599]">
                Fee Mechanics & Transparency
              </h3>
              <p className="text-[#A3B1AA] mb-4">
                A transparent base fee (typically{" "}
                <span className="font-sans text-[#00E599]">3–5%</span>) is
                applied to the user, ensuring the protocol is self-sustaining
                and incentivizes merchant participation.
              </p>
              <div className="bg-[#070A08] p-4 rounded-lg border border-white/6 font-sans">
                <p className="font-semibold text-white mb-2 tracking-wide">
                  Fee Split:
                </p>
                <ul className="text-[#A3B1AA] space-y-1 ml-4">
                  <li>**Merchant:** Compensation for off-chain execution.</li>
                  <li>
                    **DAO Treasury:** Used for protocol development and
                    incentives.
                  </li>
                  <li>
                    **Protocol Incentives:** Distributed to stake-holders.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Anonymity is Infrastructure */}
        <section id="anonymous" className="py-[120px] border-t border-white/15">
          <h2 className="text-5xl text-center mb-16 text-white font-semibold tracking-wide">
            Anonymity is Infrastructure
          </h2>
          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto text-center">
            {[
              {
                title: "Zero KYC",
                desc: "Blip.money does not require names, documents, or personal identifiers to use the core protocol functions.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4m-4-2H5a2 2 0 01-2-2V7a2 2 0 012-2h12a2 2 0 012 2v3m-7 4l4-4-4-4"
                  ></path>
                ),
              },
              {
                title: "Wallet-Only",
                desc: "All interaction and authentication occurs solely via your cryptographic wallet signature. No accounts.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  ></path>
                ),
              },
              {
                title: "Recipient Isolation",
                desc: "The final fiat recipient does not interact with the protocol, preserving the sender's security posture.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                  ></path>
                ),
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-[14px] bg-gradient-to-b from-white/3 to-white/1 border border-white/6 hover:border-[#00FF94]/60 hover:shadow-[0_0_40px_rgba(0,255,148,0.25)] transition-all duration-500"
              >
                <svg
                  className="w-8 h-8 text-[#00E599] mx-auto mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {item.icon}
                </svg>
                <h3 className="text-2xl font-medium mb-2 text-white">
                  {item.title}
                </h3>
                <p className="text-[#A3B1AA] text-base">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 9. Closing Section */}
        <section
          id="closing"
          className="text-center py-[140px] border-t border-white/15"
        >
          <h2 className="text-5xl font-extrabold mb-10 text-white max-w-4xl mx-auto tracking-wide leading-tight">
            <span className="text-[#2BFF88]">The Certainty of Code</span>{" "}
            Replacing the Necessity of Trust.
          </h2>
          <p className="text-2xl sm:text-3xl text-[#A3B1AA] max-w-3xl mx-auto mb-12">
            Blip.money is the essential bridge between digital assets and the
            physical world, abstracting away identity and geography to focus
            purely on the secure, reliable transfer of economic value.
          </p>
          <a
            href="/whitepaper.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-12 py-3 text-xl bg-[#00E599] text-black rounded-full font-medium tracking-wide transition duration-300 transform hover:scale-[1.02]"
          >
            Explore the Whitepaper Now →
          </a>
        </section>
      </main>
    </div>
  );
};
