import React from "react";
import { useTranslation } from "react-i18next";

export const HowItWorksPage = () => {
  const { t } = useTranslation();

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

  return (
    <div className="min-h-screen bg-[#000000] text-[#A3B1AA] font-sans selection:bg-[#00E599] selection:text-black">
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

      <main className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* 1. Hero Section */}
        <section id="hero" className="text-center pt-[140px] pb-[120px] ">
          <h1 className="text-6xl sm:text-7xl lg:text-7xl mb-6 text-white font-semibold tracking-wide leading-[1.1]">
            <span className="text-[#2BFF88]">{t("heroTitleHighlight")}</span>
            <br />
            {t("heroSubtitle")}
          </h1>
          <p className="text-xl sm:text-2xl text-[#A3B1AA] max-w-[720px] mx-auto mb-10 font- tracking-wider line-clamp-3">
            {t("heroDescription")}
          </p>
        </section>

        {/* Key Features Section */}
        <section
          id="key-features"
          className="pb-[120px] border-t border-white/15"
        >
          <h2 className="sr-only">{t("keyConceptsTitle")}</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-10">
            {[
              {
                title: t("nonCustodialEscrow"),
                desc: t("nonCustodialEscrowDesc"),
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
                title: t("zeroIntermediaries"),
                desc: t("zeroIntermediariesDesc"),
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
                title: t("privacyFirstDesign"),
                desc: t("privacyFirstDesignDesc"),
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
                className="p-6 text-center rounded-[14px] bg-gradient-to-b from-white/3 to-white/1 border border-white/6 hover:border-[#00E599]/25 hover:shadow-[0_0_0_1px_rgba(0,229,153,0.15)] hover:bg-[#0F1512] transition-all duration-300"
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
            {t("coreIdeaTitle")}
          </h2>
          <p className="text-lg text-[#A3B1AA] max-w-[640px] mx-auto text-center mb-12">
            {t("coreIdeaDescription")}
          </p>

          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto text-center">
            {[
              {
                title: t("escrowPDA"),
                desc: t("escrowPDADesc"),
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
                title: t("merchantStaking"),
                desc: t("merchantStakingDesc"),
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
                title: t("daoGovernance"),
                desc: t("daoGovernanceDesc"),
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
                title: t("walletOnlyAccess"),
                desc: t("walletOnlyAccessDesc"),
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
                className="p-4 rounded-[14px] bg-gradient-to-b from-white/3 to-white/1 border border-white/6 hover:border-[#00E599]/25 hover:shadow-[0_0_0_1px_rgba(0,229,153,0.15)] hover:bg-[#0F1512] transition-all duration-300"
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
            {t("transactionFlowTitle")}
          </h2>
          <div className="max-w-[720px] mx-auto">
            <p className="text-lg text-[#A3B1AA] max-w-[640px] mx-auto text-center mb-10">
              {t("transactionFlowDescription")}
            </p>

            <ol className="relative border-l border-[#00E599]/15 mx-auto max-w-2xl">
              {[
                {
                  id: "1",
                  title: t("initiationLock"),
                  content: t("initiationLockContent"),
                  result: t("initiationLockResult"),
                },
                {
                  id: "2",
                  title: t("commitmentStake"),
                  content: t("commitmentStakeContent"),
                  result: t("commitmentStakeResult"),
                },
                {
                  id: "3",
                  title: t("offChainPayout"),
                  content: t("offChainPayoutContent"),
                  result: t("offChainPayoutResult"),
                },
                {
                  id: "4",
                  title: t("verificationRelease"),
                  content: t("verificationReleaseContent"),
                  result: t("verificationReleaseResult"),
                },
                {
                  id: "5",
                  title: t("finalityArbitration"),
                  content: t("finalityArbitrationContent"),
                  result: t("finalityArbitrationResult"),
                },
              ].map((step, idx) => (
                <li
                  key={idx}
                  className={`mb-10 ml-6 p-5 rounded-[14px] bg-[#0B0F0D] border border-white/6 hover:border-[#00E599]/25 hover:shadow-[0_0_0_1px_rgba(0,229,153,0.15)] transition-all duration-300`}
                >
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-[#00E599] rounded-full -left-3 ring-4 ring-[#000000] text-black font-semibold font-sans text-sm timeline-dot-shadow">
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
            {t("architectureTitle")}
          </h2>
          <p className="text-lg text-[#A3B1AA] max-w-[640px] mx-auto text-center mb-10">
            {t("architectureDescription")}
          </p>

          <div className="max-w-4xl mx-auto mb-16 rounded-[14px] bg-gradient-to-b from-white/3 to-white/1 border border-white/6 overflow-hidden">
            <div className="grid grid-cols-3 text-sm sm:text-base font-semibold text-[#00E599] border-b border-white/6 bg-[#070A08] p-4 font-sans tracking-tight">
              <div className="uppercase">{t("layer")}</div>
              <div className="uppercase">{t("responsibility")}</div>
              <div className="uppercase">{t("onChainComponents")}</div>
            </div>
            <div className="grid grid-cols-3 border-b border-white/6 p-4 hover:bg-[#0F1512] transition">
              <div className="text-[#00E599] font-sans">{t("onChain")}</div>
              <div className="text-white">{t("trustFinalityEnforcement")}</div>
              <div className="text-[#A3B1AA] text-sm">
                {t("escrowLockingStakingVoting")}
              </div>
            </div>
            <div className="grid grid-cols-3 p-4 hover:bg-[#0F1512] transition">
              <div className="text-[#00E599] font-sans">{t("offChain")}</div>
              <div className="text-white">{t("speedFiatInteraction")}</div>
              <div className="text-[#A3B1AA] text-sm">
                {t("fiatExecutionRouting")}
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto pt-16 border-t border-white/15">
            <h3 className="text-2xl font-medium text-[#00E599] mb-8 text-center tracking-wide">
              {t("escrowArchitectureTitle")}
            </h3>
            <p className="text-lg text-[#A3B1AA] mb-8 text-center">
              {t("escrowArchitectureDescription").split("PDA")[0]}
              <span className="font-sans text-[#00E599]">PDA</span>
              {t("escrowArchitectureDescription").split("PDA")[1]}
            </p>

            <div className="grid md:grid-cols-3 gap-6 text-center">
              {[
                {
                  title: t("immutable"),
                  desc: t("immutableDesc"),
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
                  title: t("timeBound"),
                  desc: t("timeBoundDesc"),
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
                  title: t("deterministic"),
                  desc: t("deterministicDesc"),
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
                  className="p-6 rounded-[14px] bg-gradient-to-b from-white/3 to-white/1 border border-white/6 hover:border-[#00E599]/25 hover:shadow-[0_0_0_1px_rgba(0,229,153,0.15)] hover:bg-[#0F1512] transition-all duration-300"
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
            {t("securityTitle")}
          </h2>
          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto text-center">
            {[
              {
                title: t("economicEnforcement"),
                desc: t("economicEnforcementDesc"),
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
                title: t("immutableCode"),
                desc: t("immutableCodeDesc"),
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
                title: t("daoArbiter"),
                desc: t("daoArbiterDesc"),
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
                className="p-8 rounded-[14px] bg-gradient-to-b from-white/3 to-white/1 border border-white/6 hover:border-[#00E599]/25 hover:shadow-[0_0_0_1px_rgba(0,229,153,0.15)] hover:bg-[#0F1512] transition-all duration-300"
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
              {t("latencySettlementTitle")}
            </h3>
            <div className="grid md:grid-cols-3 text-center gap-4 text-[#A3B1AA] font-sans">
              <div>
                <p className="text-4xl font-extrabold text-white tracking-wide">
                  ~500ms
                </p>
                <p className="text-sm text-[#00E599]">{t("escrowLock")}</p>
              </div>
              <div>
                <p className="text-4xl font-extrabold text-white tracking-wide">
                  {"< 1s"}
                </p>
                <p className="text-sm text-[#00E599]">
                  {t("proofVerification")}
                </p>
              </div>
              <div>
                <p className="text-4xl font-extrabold text-white tracking-wide">
                  Solana Finality
                </p>
                <p className="text-sm text-[#00E599]">{t("onChainFinality")}</p>
              </div>
            </div>
            <p className="text-lg text-[#A3B1AA] mt-8 text-center">
              {t("settlementDescription")}
            </p>
          </div>
        </section>

        {/* 6. Order Types */}
        <section id="use-cases" className="py-[120px] border-t border-white/15">
          <h2 className="text-5xl text-center mb-16 text-white font-semibold tracking-wide">
            {t("orderTypesTitle")}
          </h2>
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: t("cryptoToCash"),
                desc: t("cryptoToCashDesc"),
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
                title: t("cryptoToBank"),
                desc: t("cryptoToBankDesc"),
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
                title: t("cryptoToCrypto"),
                desc: t("cryptoToCryptoDesc"),
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
                className="p-10 rounded-[14px] bg-gradient-to-b from-white/3 to-white/1 border border-white/6 hover:border-[#00E599]/25 hover:shadow-[0_0_0_1px_rgba(0,229,153,0.15)] hover:bg-[#0F1512] transition-all duration-300"
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
            {t("economicsTitle")}
          </h2>
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Merchant Staking */}
            <div className="p-8 rounded-[14px] bg-gradient-to-b from-white/3 to-white/1 border border-white/6 hover:border-[#00E599]/25 hover:shadow-[0_0_0_1px_rgba(0,229,153,0.15)] hover:bg-[#0F1512] transition-all duration-300">
              <h3 className="text-2xl font-medium mb-4 text-[#00E599]">
                {t("merchantStakingReputation")}
              </h3>
              <p className="text-[#A3B1AA] mb-4">
                {t("merchantStakingReputationDesc")}
              </p>
              <ul className="list-disc list-inside text-[#A3B1AA] space-y-1 ml-4">
                <li>{t("merchantStakingPoint1")}</li>
                <li>{t("merchantStakingPoint2")}</li>
                <li>{t("merchantStakingPoint3")}</li>
              </ul>
            </div>

            {/* Fee Mechanics */}
            <div className="p-8 rounded-[14px] bg-gradient-to-b from-white/3 to-white/1 border border-white/6 hover:border-[#00E599]/25 hover:shadow-[0_0_0_1px_rgba(0,229,153,0.15)] hover:bg-[#0F1512] transition-all duration-300">
              <h3 className="text-2xl font-medium mb-4 text-[#00E599]">
                {t("feeMechanicsTitle")}
              </h3>
              <p className="text-[#A3B1AA] mb-4">
                {t("feeMechanicsDesc").split("3–5%")[0]}
                <span className="font-sans text-[#00E599]">3–5%</span>
                {t("feeMechanicsDesc").split("3–5%")[1]}
              </p>
              <div className="bg-[#070A08] p-4 rounded-lg border border-white/6 font-sans">
                <p className="font-semibold text-white mb-2 tracking-wide">
                  {t("feeSplit")}
                </p>
                <ul className="text-[#A3B1AA] space-y-1 ml-4">
                  <li>{t("merchantFee")}</li>
                  <li>{t("daoTreasuryFee")}</li>
                  <li>{t("protocolIncentivesFee")}</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Anonymity is Infrastructure */}
        <section id="anonymous" className="py-[120px] border-t border-white/15">
          <h2 className="text-5xl text-center mb-16 text-white font-semibold tracking-wide">
            {t("anonymityTitle")}
          </h2>
          <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto text-center">
            {[
              {
                title: t("zeroKYC"),
                desc: t("zeroKYCDesc"),
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
                title: t("walletOnly"),
                desc: t("walletOnlyDesc"),
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
                title: t("recipientIsolation"),
                desc: t("recipientIsolationDesc"),
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
                className="p-4 rounded-[14px] bg-gradient-to-b from-white/3 to-white/1 border border-white/6 hover:border-[#00E599]/25 hover:shadow-[0_0_0_1px_rgba(0,229,153,0.15)] hover:bg-[#0F1512] transition-all duration-300"
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
            <span className="text-[#2BFF88]">{t("closingTitleHighlight")}</span>{" "}
            {t("closingSubtitle")}
          </h2>
          <p className="text-2xl sm:text-3xl text-[#A3B1AA] max-w-3xl mx-auto mb-12">
            {t("closingDescription")}
          </p>
          <a
            href="/whitepaper.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-12 py-3 text-xl bg-[#00E599] text-black rounded-full font-medium tracking-wide transition duration-300 transform hover:scale-[1.02]"
          >
            {t("exploreWhitepaper")}
          </a>
        </section>
      </main>
    </div>
  );
};
