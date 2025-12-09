// import React from 'react'

// export const blipSettalte = () => {
//   return (
//         {/* Added min-h-screen, flex, flex-col, and justify-center */}
//       <section
//         id="protocol"
//         className="min-h-screen flex flex-col justify-center py-16 bg-[#020202] relative border-t border-white/5 overflow-hidden"
//       >
//         <style>
//           {`
//                 @keyframes moveRight {
//                     0% { transform: translate(0, -50%); opacity: 1; }
//                     50% { transform: translate(300%, -50%); opacity: 1; }
//                     100% { transform: translate(0, -50%); opacity: 0; }
//                 }
//                 .animate-\\[moveRight_3s_linear_infinite\\] {
//                     animation: moveRight 3s linear infinite;
//                 }
//                 `}
//         </style>
//         <div className="absolute inset-0 bg-gradient-to-b from-[#050505] to-[#020202]" />

//         <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
//           {/* Header */}
//           <div className="text-center mb-12">
//             <SectionLabel text="Protocol Architecture" />
//             <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white tracking-tight">
//               How Blip Settles Value.
//             </h2>
//             <p className="text-xl text-gray-400 max-w-2xl mx-auto">
//               A trustless mechanism connecting digital wallets to real-world
//               banking rails in three steps.
//             </p>
//           </div>

//           {/* Diagram Container (Desktop View) */}
//           <div className="relative h-[800px] max-w-7xl my-auto mx-auto rounded-3xl border border-white/5 bg-[#080808] overflow-hidden hidden lg:block shadow-2xl">
//             <div
//               style={styles.gridBackground}
//               className="absolute inset-0 opacity-10 top-[50%]"
//             />

//             {/* SVG Lines */}
//             <svg
//               className="absolute inset-0 w-full h-full pointer-events-none z-10"
//               viewBox="0 0 100 100"
//               preserveAspectRatio="none"
//             >
//               <defs>
//                 <linearGradient
//                   id="flowGradient"
//                   x1="0%"
//                   y1="50%"
//                   x2="100%"
//                   y2="0%"
//                 >
//                   <stop offset="0%" stopColor="#0088FF" stopOpacity="0.3" />
//                   <stop offset="47%" stopColor="#FBBF24" stopOpacity="0.5" />
//                   <stop offset="70%" stopColor="#00FF94" stopOpacity="0.3" />
//                 </linearGradient>
//               </defs>
//               {/* Main Flow Lines (1->2->3) */}
//               <path
//                 d="M 25 50 L 75 50" // Simplified straight path for better animation visual
//                 stroke="url(#flowGradient)"
//                 strokeWidth="0.7"
//                 strokeDasharray="4, 4"
//                 className="animate-[pulse_3s_infinite]"
//               />

//               {/* Step 4 (Governance) Connection */}
//               <path
//                 d="M 50 50 Q 60 30 75 25"
//                 fill="none"
//                 stroke="#A855F7"
//                 strokeWidth="0.2"
//                 strokeDasharray="1,1"
//                 opacity="0.3"
//               />
//               {/* Step 5 (Stakers) Connection */}
//               <path
//                 d="M 50 50 Q 60 70 75 75"
//                 fill="none"
//                 stroke="#6366F1"
//                 strokeWidth="0.2"
//                 strokeDasharray="1,1"
//                 opacity="0.3"
//               />
//             </svg>

//             {/* Step 1: Sender Wallet */}
//             <div className="absolute top-1/2 left-[25%] -translate-x-1/2 -translate-y-1/2">
//               <ArchitectureNode
//                 step="1"
//                 title="Sender Wallet"
//                 sub="Locks USDT/USDC in Protocol"
//                 icon={Wallet}
//                 color="#0088FF"
//                 className="shadow-[0_0_40px_rgba(0,136,255,0.1)]"
//                 isMain
//               />
//             </div>

//             {/* Step 2: Blip Protocol (Center) */}
//             <div className="absolute top-1/2 left-[50%] -translate-x-1/2 -translate-y-1/2">
//               <ArchitectureNode
//                 step="2"
//                 title="Blip Protocol"
//                 sub="Matches liquidity & Secures Escrow"
//                 icon={Lock}
//                 color="#FBBF24"
//                 className="scale-110 shadow-[0_0_60px_rgba(251,191,36,0.2)] z-30 bg-[#0A0A0A]"
//                 delay={200}
//                 isMain
//               />
//               <div className="absolute inset-0 rounded-2xl border border-[#FBBF24]/20 animate-ping opacity-20 pointer-events-none" />
//             </div>

//             {/* Step 3: Receiver */}
//             <div className="absolute top-1/2 left-[75%] -translate-x-1/2 -translate-y-1/2">
//               <ArchitectureNode
//                 step="3"
//                 title="Receiver"
//                 sub="Receives Fiat via Local Rails"
//                 icon={Building2}
//                 color="#00FF94"
//                 className="shadow-[0_0_40px_rgba(0,255,148,0.1)]"
//                 delay={400}
//                 isMain
//               />
//             </div>

//             {/* Step 4: Governance (Top Right) */}
//             <div className="absolute top-[25%] left-[75%] -translate-x-1/2 -translate-y-1/2">
//               <ArchitectureNode
//                 step="4"
//                 title="Governance"
//                 sub="DAO & Treasury"
//                 icon={Landmark}
//                 color="#A855F7"
//                 className="scale-90 opacity-80 shadow-[0_0_20px_rgba(168,85,247,0.1)]"
//               />
//             </div>

//             {/* Step 5: Merchant Stakers (Bottom Right) */}
//             <div className="absolute top-[75%] left-[75%] -translate-x-1/2 -translate-y-1/2">
//               <ArchitectureNode
//                 step="5"
//                 title="Merchant Stakers"
//                 sub="Collateral Providers"
//                 icon={ShieldCheck}
//                 color="#6366F1"
//                 className="scale-90 opacity-80 shadow-[0_0_20px_rgba(99,102,241,0.1)]"
//               />
//             </div>

//             {/* Live Logic Indicators (Animating circles) */}
//             <div
//               className="absolute top-[50%] left-[25%] w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_#3B82F6] animate-[moveRight_3s_linear_infinite]"
//               style={{ transform: "translateY(-50%)" }}
//             />
//             <div
//               className="absolute top-[50%] left-[60%] w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_#22C55E] animate-[moveRight_3s_linear_infinite]"
//               style={{
//                 animationDelay: "1.5s",
//                 transform: "translateY(-50%)",
//               }}
//             />

//             {/* Legend */}
//             <div className="absolute bottom-8 left-8 p-4 rounded-xl border border-white/10 bg-black/50 backdrop-blur-md max-w-xs">
//               <div className="flex items-center gap-2 mb-2 text-xs text-gray-400 uppercase tracking-widest">
//                 <Activity size={12} className="text-[#00FF94]" /> Live Logic
//               </div>
//               <div className="space-y-2">
//                 <div className="flex items-center gap-2 text-xs text-gray-500">
//                   <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />{" "}
//                   Digital Asset Lock
//                 </div>
//                 <div className="flex items-center gap-2 text-xs text-gray-500">
//                   <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />{" "}
//                   Smart Contract Escrow
//                 </div>
//                 <div className="flex items-center gap-2 text-xs text-gray-500">
//                   <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Fiat
//                   Settlement
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Mobile View */}
//           <div className="lg:hidden space-y-4">
//             <ArchitectureNode
//               step="1"
//               title="Sender"
//               sub="Locks Crypto"
//               icon={Wallet}
//               color="#0088FF"
//               className="relative w-full translate-x-0 translate-y-0"
//               isMain
//             />
//             <div className="flex justify-center">
//               <ArrowRight className="rotate-90 text-gray-600" />
//             </div>
//             <ArchitectureNode
//               step="2"
//               title="Protocol"
//               sub="Matches & Escrows"
//               icon={Lock}
//               color="#FBBF24"
//               className="relative w-full translate-x-0 translate-y-0"
//               isMain
//             />
//             <div className="flex justify-center">
//               <ArrowRight className="rotate-90 text-gray-600" />
//             </div>
//             <ArchitectureNode
//               step="3"
//               title="Receiver"
//               sub="Gets Fiat"
//               icon={Building2}
//               color="#00FF94"
//               className="relative w-full translate-x-0 translate-y-0"
//               isMain
//             />
//             <div className="flex justify-center mt-4">
//               <Zap className="rotate-90 text-[#FBBF24]" size={20} />
//             </div>
//             {/* Steps 4 and 5 in Mobile View */}
//             <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700/50">
//               <ArchitectureNode
//                 step="4"
//                 title="Governance"
//                 sub="Oversight"
//                 icon={Landmark}
//                 color="#A855F7"
//                 className="relative w-full translate-x-0 translate-y-0"
//               />
//               <ArchitectureNode
//                 step="5"
//                 title="Stakers"
//                 sub="Collateral"
//                 icon={ShieldCheck}
//                 color="#6366F1"
//                 className="relative w-full translate-x-0 translate-y-0"
//               />
//             </div>
//           </div>
//         </div>
//       </section>
//   )
// }
