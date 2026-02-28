// import React from "react";
// import {
//   ChevronDown,
//   CheckCircle2,
//   Mic,
//   MoreHorizontal,
//   ArrowRight,
//   Shield,
// } from "lucide-react";

// /* ═══════════════════════════════════════════════════════════════════════════ */
// /*  GradientCard — outer = gradient border, inner = card                     */
// /* ═══════════════════════════════════════════════════════════════════════════ */
// function GradientCard({
//   width,
//   children,
//   className = "",
// }: {
//   width: string;
//   children: React.ReactNode;
//   className?: string;
// }) {
//   return (
//     <div
//       style={{ width }}
//       className={`
//         relative rounded-2xl p-[1px]
//         bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-blue-500/40
//         shadow-[0_0_40px_rgba(99,102,241,0.25)]
//         transition-all duration-300 hover:scale-[1.02]
//         ${className}
//       `}
//     >
//       <div className="rounded-2xl bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e293b] h-full text-white overflow-hidden">
//         {children}
//       </div>
//     </div>
//   );
// }

// /* ─── Card header bar ─── */
// function CardHeader({
//   title,
//   right,
// }: {
//   title: React.ReactNode;
//   right?: React.ReactNode;
// }) {
//   return (
//     <div className="px-5 py-3 flex items-center justify-between border-b border-white/[0.06]">
//       <h3 className="text-[13px] text-gray-200 font-medium tracking-wide">
//         {title}
//       </h3>
//       {right ?? <MoreHorizontal className="w-4 h-4 text-gray-500" />}
//     </div>
//   );
// }

// /* ─── Flag ─── */
// function Flag({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="w-5 h-3.5 rounded-[2px] border border-white/10 overflow-hidden flex-shrink-0">
//       <div className="w-full h-full flex items-center justify-center text-[8px] font-bold text-white/70">
//         {children}
//       </div>
//     </div>
//   );
// }

// /* ═══════════════════════════════════════════════════════════════════════════ */
// /*  MAIN COMPONENT                                                           */
// /* ═══════════════════════════════════════════════════════════════════════════ */
// export default function NewSection() {
//   return (
//     <section className="relative  py-24 overflow-hidden">
//       <div className="max-w-[1300px] mx-auto px-6">
//         {/* ===== Title ===== */}
//         <div className="text-center mb-16">
//           <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-black leading-[1.1]">
//             Blip Money: The Real-Time
//             <br className="hidden sm:block" /> Settlement Layer
//           </h2>
//           <p className="mt-4 text-gray-600 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed">
//             Blip Money aggregates institutional liquidity into a single, unified
//             settlement layer. Powering your Treasury and Ops with automated
//             AI-assisted reconciliation, it becomes the true collective
//             intelligence for your entire global network.
//           </p>
//         </div>

//         {/* ===== CARD SYSTEM ===== */}
//         <div className="relative  p-2 rounded-2xl shadow-lg">
//           {/* Background glow behind entire card system */}
//           <div className="absolute -inset-8 -z-10 rounded-[40px] blur-3xl bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 pointer-events-none" />

//           {/* ━━━ TOP ROW — 4 cards, right-aligned ━━━ */}
//           <div className=" bg-black rounded-2xl">
//             <div className="flex flex-wrap lg:flex-nowrap justify-end gap-2 p-2 rounded-2xl rounded-tr-2xl  ">
//               {/* 1 — Initiate a Corridor */}
//               <div
//                 aria-hidden="true"
//                 className="w-full sm:w-[calc(50%-12px)] lg:w-[260px] bg-white -m-2  pl-2 rounded-br-2xl rounded-bl-2xl rounded-br-2xl"
//               ></div>
//               <GradientCard
//                 width="240px"
//                 className="w-full sm:w-[calc(50%-12px)] lg:!w-[260px] ml-2"
//               >
//                 <CardHeader title="Initiate a Corridor" />
//                 <div className="p-5 space-y-2.5">
//                   <div className="text-[10px] text-gray-500 uppercase tracking-[0.15em] font-medium">
//                     Choose corridor
//                   </div>
//                   <div className="bg-white/[0.04] border border-white/[0.06] rounded-lg py-2 px-3 flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       <Flag>🇺🇸</Flag>
//                       <span className="text-sm text-gray-100 font-medium">
//                         USD ⇌ INR
//                       </span>
//                       <span className="text-[10px] text-gray-500">
//                         (Real-Time)
//                       </span>
//                     </div>
//                     <ChevronDown className="w-4 h-4 text-gray-500" />
//                   </div>
//                   <div className="space-y-1.5 text-[11px] text-gray-400">
//                     <div className="flex items-center gap-2">
//                       <Flag>🇪🇺</Flag> EUR ⇌ AED
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Flag>🇬🇧</Flag> GBP ⇌ SGD → into escrow
//                     </div>
//                   </div>
//                   <ul className="space-y-1 text-[11px] text-gray-400 pt-1">
//                     <li>· Execute Treasury Order</li>
//                     <li>· Secure in smart contract</li>
//                     <li>· No float risk</li>
//                   </ul>
//                 </div>
//               </GradientCard>

//               {/* 2 — Match in Seconds */}
//               <GradientCard
//                 width="240px"
//                 className="w-full sm:w-[calc(50%-12px)] lg:!w-[260px]"
//               >
//                 <CardHeader title="Match in Seconds" />
//                 <div className="p-5 space-y-2.5">
//                   <div className="text-[10px] text-gray-500 uppercase tracking-[0.15em] font-medium">
//                     Live graph
//                   </div>
//                   <div className="relative h-[80px] w-full rounded-md overflow-hidden">
//                     <svg
//                       viewBox="0 0 200 72"
//                       className="absolute inset-0 w-full h-full"
//                     >
//                       <path
//                         d="M0 50 C 50 50, 80 15, 130 15 C 160 15, 180 40, 200 40"
//                         fill="none"
//                         stroke="#8b5cf6"
//                         strokeWidth="2.5"
//                         strokeLinecap="round"
//                       />
//                       <path
//                         d="M0 20 C 40 20, 70 55, 120 55 C 150 55, 170 20, 200 20"
//                         fill="none"
//                         stroke="#3b82f6"
//                         strokeWidth="2.5"
//                         strokeLinecap="round"
//                       />
//                       <circle r="4" fill="#a78bfa">
//                         <animateMotion
//                           dur="3s"
//                           repeatCount="indefinite"
//                           path="M0 50 C 50 50, 80 15, 130 15 C 160 15, 180 40, 200 40"
//                         />
//                       </circle>
//                       <circle r="4" fill="#60a5fa">
//                         <animateMotion
//                           dur="3s"
//                           repeatCount="indefinite"
//                           path="M0 20 C 40 20, 70 55, 120 55 C 150 55, 170 20, 200 20"
//                         />
//                       </circle>
//                     </svg>
//                   </div>
//                   <ul className="space-y-1 text-[11px] text-gray-400 pt-1">
//                     <li>· Best available institutional rates sourced</li>
//                     <li>· Real-time FX spread optimization</li>
//                   </ul>
//                 </div>
//               </GradientCard>

//               {/* 3 — Settlement Finality */}
//               <GradientCard
//                 width="240px"
//                 className="w-full sm:w-[calc(50%-12px)] lg:!w-[260px]"
//               >
//                 <CardHeader title="Settlement Finality" />
//                 <div className="p-5 space-y-2.5">
//                   <div className="flex items-center gap-3">
//                     <div className="w-9 h-9 rounded-full bg-emerald-500/15 flex items-center justify-center border border-emerald-400/20 shrink-0">
//                       <CheckCircle2 className="w-5 h-5 text-emerald-400" />
//                     </div>
//                     <div className="min-w-0">
//                       <div className="text-sm text-gray-100 font-semibold">
//                         Verified
//                       </div>
//                       <div className="text-[10px] text-gray-500 leading-tight">
//                         Verified transaction hash
//                         <br />
//                         receipt: 3a060453e133
//                       </div>
//                     </div>
//                     <div className="ml-auto shrink-0">
//                       <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
//                         <CheckCircle2 className="w-4 h-4 text-emerald-400/60" />
//                       </div>
//                     </div>
//                   </div>
//                   <ul className="space-y-1 text-[11px] text-gray-400 pt-1">
//                     <li>· Institutional-grade confirmation (1 block)</li>
//                     <li>· Funds settle with absolute finality</li>
//                     <li>· Immutable transaction ledger</li>
//                     <li>· Atomic settlement across chains</li>
//                   </ul>
//                 </div>
//               </GradientCard>

//               {/* 4 — Funds Secured */}
//               <GradientCard
//                 width="240px"
//                 className="w-full sm:w-[calc(50%-12px)] lg:!w-[260px]"
//               >
//                 <CardHeader title="Funds Secured" />
//                 <div className="p-5 space-y-2.5">
//                   <div className="inline-flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.06] rounded-full px-3 py-1">
//                     <Shield className="w-3 h-3 text-emerald-400" />
//                     <span className="text-[11px] text-gray-300">
//                       Smart contract
//                     </span>
//                   </div>
//                   <ul className="space-y-1 text-[11px] text-gray-400 pt-1">
//                     <li>· Multi-party escrow logic enforced</li>
//                     <li>· Real-time release conditions validation</li>
//                     <li>· Proactive risk and dispute resolution</li>
//                     <li>· Automated regulatory reporting data</li>
//                   </ul>
//                 </div>
//               </GradientCard>
//             </div>
//           </div>

//           {/* ━━━ BOTTOM ROW — 3 cards, left-aligned ━━━ */}
//           <div className="bg-gradient-to-r from-purple-300/30 via-pink-300/30 to-blue-300/30 bg-black px-2 rounded-lt-2xl  p-2">
//             <div className="relative flex flex-wrap lg:flex-nowrap overflow-visible   gap-2 mt-2  ">
//               {/* Soft glow under bottom row */}
//               <div className="absolute inset-0 -z-10  blur-3xl bg-gradient-to-r from-purple-300/30 via-pink-300/30 to-blue-300/30 pointer-events-none" />

//               {/* 5 — Merchant Dashboard */}
//               <GradientCard
//                 width="360px"
//                 className="w-full sm:w-[calc(50%-12px)] lg:!w-[260px]  "
//               >
//                 <CardHeader title="Merchant Dashboard" />
//                 <div className="p-4 space-y-3">
//                   <div className="bg-black/30 border border-white/[0.06] rounded-lg p-3 space-y-2.5">
//                     <div className="text-[10px] text-gray-500">
//                       US Treasury → Mumbai Hub
//                     </div>
//                     <div className="space-y-1.5 text-[10px] text-gray-400">
//                       <div className="flex items-center gap-1.5">
//                         <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
//                         Operations Hub (Mumbai)
//                       </div>
//                       <div className="flex items-center gap-1.5">
//                         <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
//                         US Treasury → Metzury
//                       </div>
//                       <div className="flex items-center gap-1.5">
//                         <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
//                         Operations Hub (Mumbai)
//                       </div>
//                     </div>
//                     <div className="grid grid-cols-3 gap-1.5 pt-1">
//                       {[
//                         { label: "Total Value", val: "$2.4M" },
//                         { label: "Avg. Time", val: "1.2s" },
//                         { label: "FX Exp.", val: "0.02%" },
//                       ].map((s) => (
//                         <div
//                           key={s.label}
//                           className="bg-white/[0.04] rounded px-1.5 py-2 text-center"
//                         >
//                           <div className="text-[8px] text-gray-500 leading-tight">
//                             {s.label}
//                           </div>
//                           <div className="text-[11px] text-gray-200 font-medium">
//                             {s.val}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </GradientCard>

//               {/* 6 — Unified Team / Treasury Ops */}
//               <GradientCard
//                 width="520px"
//                 className="w-full sm:w-[calc(50%-12px)] lg:!w-[520px] lg:shrink"
//               >
//                 <CardHeader title="Merchant Dashboard. Unified Team/Treasury Ops" />
//                 <div className="p-5 relative min-h-[220px] flex items-center justify-center">
//                   {/* Radial glow */}
//                   <div
//                     className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full blur-[80px] pointer-events-none"
//                     style={{
//                       background:
//                         "radial-gradient(circle, rgba(99,102,241,0.12), transparent 60%)",
//                     }}
//                   />
//                   <div className="relative z-10 flex flex-col items-center gap-4">
//                     <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-violet-600 to-blue-500 flex items-center justify-center shadow-[0_0_60px_rgba(99,102,241,0.25)]">
//                       <div className="w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center backdrop-blur-sm">
//                         <Mic className="w-5 h-5 text-white/90" />
//                       </div>
//                     </div>
//                     <div className="flex items-center -space-x-2">
//                       {[1, 2, 3, 4, 5].map((i) => (
//                         <img
//                           key={i}
//                           src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}&backgroundColor=b6e3f4,c0aede,d1d4f9`}
//                           alt=""
//                           className="w-9 h-9 rounded-full ring-2 ring-[#111827]"
//                         />
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </GradientCard>

//               {/* 7 — Corridors */}
//               <GradientCard
//                 width="520px"
//                 className="w-full sm:w-full lg:!w-[360px] mr-2"
//               >
//                 <CardHeader
//                   title={
//                     <div className="flex items-center justify-between w-full">
//                       <span>Corridors</span>
//                       <span className="text-[10px] text-gray-500 font-normal ml-2">
//                         150+ corridors · Any currency · 08 March
//                       </span>
//                     </div>
//                   }
//                 />
//                 <div className="p-5 relative min-h-[220px]">
//                   <div className="flex gap-4 text-[10px] text-gray-500 mb-3 uppercase tracking-wider">
//                     <span className="text-gray-300 border-b border-gray-300 pb-0.5">
//                       Active Corridors
//                     </span>
//                     <span>Corridor Health</span>
//                   </div>
//                   <div className="text-[10px] text-gray-500 mb-2">
//                     Currency flows
//                   </div>
//                   <div className="space-y-2">
//                     {[
//                       { flag: "🇮🇳", from: "INR", to: "AED" },
//                       { flag: "🇪🇺", from: "EUR", to: "USD" },
//                       { flag: "🇪🇺", from: "EUR", to: "USD" },
//                       { flag: "🇦🇪", from: "AER", to: "AED" },
//                     ].map((r, i) => (
//                       <div
//                         key={i}
//                         className="flex items-center gap-2 text-[12px]"
//                       >
//                         <Flag>{r.flag}</Flag>
//                         <span className="text-gray-300">{r.from}</span>
//                         <ArrowRight className="w-3 h-3 text-gray-600" />
//                         <span className="text-gray-500">{r.to}</span>
//                       </div>
//                     ))}
//                   </div>

//                   {/* White popup overlay */}
//                   <div className="absolute top-20 right-4 w-[58%] bottom-3 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-200 overflow-hidden z-20">
//                     <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
//                       <span className="text-sm font-semibold text-gray-800">
//                         Corridors
//                       </span>
//                       <span className="text-gray-400 text-xs cursor-pointer hover:text-gray-600">
//                         ✕
//                       </span>
//                     </div>
//                     <div className="p-2 space-y-0.5 overflow-y-auto max-h-[160px]">
//                       {[
//                         { from: "INR", to: "" },
//                         { from: "AED", to: "🇮🇳" },
//                         { from: "USD", to: "" },
//                         { from: "EUR", to: "" },
//                         { from: "EHR", to: "🇪🇺" },
//                       ].map((r, i) => (
//                         <div
//                           key={i}
//                           className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors"
//                         >
//                           <div className="flex items-center gap-2">
//                             <div className="w-2 h-2 rounded-full bg-emerald-400" />
//                             <span className="text-sm font-medium text-gray-700">
//                               {r.from}
//                             </span>
//                           </div>
//                           <div className="flex items-center gap-1.5">
//                             <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
//                             {r.to && (
//                               <span className="text-sm text-gray-500">
//                                 {r.to}
//                               </span>
//                             )}
//                             <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </GradientCard>

//               <div
//                 width="360px"
//                 className="w-full sm:w-[calc(50%-12px)] lg:!w-[260px] bg-white -mx-2 -my-2 -pr-4 rounded-tl-2xl rounded-tr-none"
//               ></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
import React from "react";
import { motion } from "framer-motion";
import { Mic, MoreHorizontal } from "lucide-react";

/* ═════════════════ GradientCard ═════════════════ */
function GradientCard({
  width,
  children,
  className = "",
}: {
  width: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      style={{ width }}
      className={`
        relative rounded-2xl p-[1px]
        bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-blue-500/40
        shadow-[0_0_40px_rgba(99,102,241,0.25)]
        transition-all duration-300 hover:scale-[1.02]
        ${className}
      `}
    >
      <div className="rounded-2xl bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e293b] h-full text-white overflow-hidden">
        {children}
      </div>
    </div>
  );
}

/* ═════════════════ CardHeader ═════════════════ */
function CardHeader({ title }: { title: React.ReactNode }) {
  return (
    <div className="px-5 py-3 flex items-center justify-between border-b border-white/[0.06]">
      <h3 className="text-[13px] text-gray-200 font-medium tracking-wide">
        {title}
      </h3>
      <MoreHorizontal className="w-4 h-4 text-gray-500" />
    </div>
  );
}

/* ═════════════════ MAIN SECTION ═════════════════ */
export default function NewSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* TITLE */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-semibold tracking-tight text-black leading-tight">
            Blip Money: The Real-Time Settlement Layer
          </h2>
        </div>

        {/* CARD SYSTEM WRAPPER */}
        <div className="relative p-6 rounded-3xl bg-black">
          {/* Background Glow */}
          <div className="absolute -inset-10 -z-10 blur-3xl bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 pointer-events-none rounded-[60px]" />

          {/* 🔥 DIAGONAL PIPELINE SVG */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            viewBox="0 0 1400 500"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                id="pipelineGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>

            {/* Glow line */}
            <path
              d="M 220 380 Q 500 220 760 130"
              stroke="url(#pipelineGradient)"
              strokeWidth="8"
              fill="none"
              opacity="0.15"
            />

            {/* Animated main line */}
            <motion.path
              d="M 220 380 Q 500 220 760 130"
              stroke="url(#pipelineGradient)"
              strokeWidth="2.5"
              fill="none"
              strokeDasharray="800"
              initial={{ strokeDashoffset: 800 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 2 }}
            />

            {/* Moving dot */}
            <circle r="4" fill="#8b5cf6">
              <animateMotion
                dur="3s"
                repeatCount="indefinite"
                path="M 220 380 Q 500 220 760 130"
              />
            </circle>
          </svg>

          {/* ───────── TOP ROW ───────── */}
          <div className="flex justify-end gap-4 relative z-10">
            <GradientCard width="260px">
              <CardHeader title="Initiate a Corridor" />
              <div className="p-5 text-sm text-gray-400">
                Choose corridor and execute treasury order.
              </div>
            </GradientCard>

            <GradientCard width="260px">
              <CardHeader title="Match in Seconds" />
              <div className="p-5 text-sm text-gray-400">
                Real-time FX spread optimization.
              </div>
            </GradientCard>

            <GradientCard width="260px">
              <CardHeader title="Settlement Finality" />
              <div className="p-5 text-sm text-gray-400">
                Immutable transaction ledger confirmation.
              </div>
            </GradientCard>

            <GradientCard width="260px">
              <CardHeader title="Funds Secured" />
              <div className="p-5 text-sm text-gray-400">
                Multi-party escrow logic enforced.
              </div>
            </GradientCard>
          </div>

          {/* ───────── BOTTOM ROW ───────── */}
          <div className="flex gap-4 mt-10 relative z-10">
            <GradientCard width="260px">
              <CardHeader title="Merchant Dashboard" />
              <div className="p-5 text-sm text-gray-400">
                Track treasury operations and FX exposure.
              </div>
            </GradientCard>

            <GradientCard width="520px">
              <CardHeader title="Unified Team / Treasury Ops" />
              <div className="p-8 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-violet-600 to-blue-500 flex items-center justify-center shadow-[0_0_60px_rgba(99,102,241,0.25)]">
                  <Mic className="w-6 h-6 text-white" />
                </div>
              </div>
            </GradientCard>

            <GradientCard width="360px">
              <CardHeader title="Corridors" />
              <div className="p-5 text-sm text-gray-400">
                150+ corridors · Any currency · Live monitoring
              </div>
            </GradientCard>
          </div>
        </div>
      </div>
    </section>
  );
}
