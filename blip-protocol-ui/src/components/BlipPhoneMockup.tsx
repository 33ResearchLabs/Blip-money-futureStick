import { motion } from "framer-motion";
import { useP2PRate } from "@/hooks/useP2PRate";
import {
  Home,
  MessageCircle,
  Activity,
  User,
  ExternalLink,
  SunMedium,
  Bell,
  QrCode,
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  Zap,
  ShieldCheck,
} from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

const TRANSACTIONS = [
  {
    id: 1,
    type: "Buy USDT",
    user: "Rahul S.",
    date: "22 May 2026",
    amount: "-₹10,242.5",
    usdt: "120.50 USDT",
    negative: true,
  },
  {
    id: 2,
    type: "Sell USDT",
    user: "Priya M.",
    date: "21 May 2026",
    amount: "+₹4,250",
    usdt: "50.00 USDT",
    negative: false,
  },
  {
    id: 3,
    type: "Buy USDT",
    user: "Aman K.",
    date: "20 May 2026",
    amount: "-₹6,396.25",
    usdt: "75.25 USDT",
    negative: true,
  },
];

export function BlipPhoneMockup({balance}) {
  // Live USDT/INR rate from /api/rates (shared hook); falls back to 95.38.
  const live = useP2PRate("INR");
  const inrRate = live.isLive && live.buy != null ? live.buy : 95.38;
  const inrValue = (Number(balance) || 0) * inrRate;

  return (
    // <div
    //   className="relative mx-auto"
    //   style={{
    //     width: "min(290px, calc(100vw - 60px))",
    //     height: "min(600px, 70vh)",
    //     padding: "10px",
    //     background: "linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)",
    //     borderRadius: 48,
    //     border: "1px solid rgba(255,255,255,0.06)",
    //   }}
    // >
    //   {/* Side buttons */}
    //   <span
    //     aria-hidden
    //     className="absolute -left-[2px] top-[18%] h-6 w-[3px] rounded-r bg-[#222]"
    //   />
    //   <span
    //     aria-hidden
    //     className="absolute -left-[2px] top-[28%] h-10 w-[3px] rounded-r bg-[#222]"
    //   />
    //   <span
    //     aria-hidden
    //     className="absolute -left-[2px] top-[42%] h-10 w-[3px] rounded-r bg-[#222]"
    //   />
    //   <span
    //     aria-hidden
    //     className="absolute -right-[2px] top-[32%] h-14 w-[3px] rounded-l bg-[#222]"
    //   />
    //   {/* Dynamic island */}
    //   <div
    //     aria-hidden
    //     className="absolute left-1/2 -translate-x-1/2 z-50"
    //     style={{
    //       top: 9,
    //       width: 78,
    //       height: 22,
    //       borderRadius: 999,
    //       background: "#0a0a0a",
    //       border: "1px solid #1a1a1a",
    //     }}
    //   />
    //   <motion.div
    //     initial={{ opacity: 0, scale: 0.92, filter: "blur(6px)" }}
    //     animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
    //     exit={{ opacity: 0, scale: 0.95 }}
    //     transition={{ duration: 1, ease: EASE }}
    //     className="absolute inset-[10px] rounded-[2.4rem] z-40 overflow-hidden bg-white dark:bg-[#0a0a0a]"
    //   >
    //     <div className="absolute inset-0 bg-white flex flex-col">
    //       {/* HERO — ~75% of phone height */}
    //       <div className="relative bg-[#050816] rounded-b-[22px] px-3 pt-9 pb-3 overflow-hidden h-[75%] flex-shrink-0 flex flex-col">
    //         {/* background glow */}
    //         <div className="absolute inset-0">
    //           <div className="absolute -top-12 left-[-30px] w-40 h-40 bg-blue-500/10 blur-3xl rounded-full" />
    //           <div className="absolute bottom-[-60px] right-[-20px] w-40 h-40 bg-emerald-500/10 blur-3xl rounded-full" />
    //           <div
    //             className="absolute inset-0 opacity-[0.08]"
    //             style={{
    //               backgroundImage:
    //                 "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)",
    //               backgroundSize: "14px 14px",
    //             }}
    //           />
    //         </div>

    //         {/* Header */}
    //         <div className="relative z-10 flex items-start justify-between ">
    //           <div className="flex gap-2">
    //             <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-black font-bold text-[11px]">
    //               A
    //             </div>
    //             <div>
    //               <h2 className="text-white font-bold text-[14px] leading-none">
    //                 alex01
    //               </h2>
    //               <div className="flex items-center gap-1 mt-1">
    //                 <p className="text-white/40 text-[8px] font-medium">
    //                   9pMEix...J8LgV7
    //                 </p>
    //                 <button className="w-3 h-3 rounded-[3px] border border-white/10 bg-white/5 flex items-center justify-center">
    //                   <ExternalLink size={6} className="text-white/50" />
    //                 </button>
    //               </div>
    //             </div>
    //           </div>
    //           <div className="flex gap-1">
    //             <button className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
    //               <SunMedium size={10} className="text-white/70" />
    //             </button>
    //             <button className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
    //               <Bell size={10} className="text-white/70" />
    //             </button>
    //           </div>
    //         </div>

    //         {/* Rate pill */}
    //         <div className="relative z-10 mt-3 flex items-center justify-center">
    //           <div className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-1">
    //             <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_rgba(16,185,129,0.9)]" />
    //             <span className="text-white/70 text-[9px] font-semibold">
    //               {inrRate.toFixed(2)} INR
    //             </span>
    //           </div>
    //         </div>

    //         {/* Status pills */}
    //         <div className="relative z-10 mt-2 flex items-center justify-center gap-1.5">
    //           <div className="px-2 py-0.5 rounded-full bg-[#171d2c] border border-white/10 flex items-center gap-1">
    //             <ShieldCheck size={8} className="text-white/50" />
    //             <span className="text-white/60 text-[8px] font-semibold">
    //               New · 500
    //             </span>
    //           </div>
    //           <div className="px-2 py-0.5 rounded-full bg-[#2b2207] border border-yellow-500/20 flex items-center gap-1">
    //             <Zap size={8} className="text-white" />
    //             <span className="text-white text-[8px] font-semibold">
    //               100
    //             </span>
    //           </div>
    //         </div>

    //         {/* Balance */}
    //         <div className="relative z-10 text-center mt-2">
    //           <div className="flex items-end justify-center">
    //             <span className="text-white text-5xl font-black tracking-[-2px] leading-none">
    //               {balance}
    //             </span>
    //             <span className="text-white/40 text-3xl font-black tracking-[-1px] leading-none">
    //               .00
    //             </span>
    //             <span className="text-white/50 text-xs font-bold ml-1">
    //               USDT
    //             </span>
    //           </div>
    //           <p className="mt-1 text-white/50 text-[10px] font-semibold">
    //             ≈ {inrValue.toLocaleString("en-IN", { maximumFractionDigits: 2 })} INR
    //           </p>
    //           <div className="flex items-center justify-center gap-1 mt-1">
    //             <div className="w-3.5 h-1.5 rounded-full bg-white" />
    //             <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
    //             <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
    //           </div>
    //         </div>

    //         {/* <div className="relative z-10 flex-1" /> */}

    //         {/* ACTION BUTTONS */}
    //         <div className="relative z-10 grid grid-cols-4 gap-2 mt-2">
    //           {[
    //             { label: "Pay", icon: QrCode, light: false },
    //             { label: "Buy", icon: ArrowDownLeft, light: true },
    //             { label: "Sell", icon: ArrowUpRight, light: true },
    //             { label: "Deposit", icon: Download, light: false },
    //           ].map((item, i) => {
    //             const Icon = item.icon;
    //             return (
    //               <button
    //                 key={i}
    //                 className={`h-12 rounded-xl border flex flex-col items-center justify-center gap-1 ${
    //                   item.light
    //                     ? "bg-white text-black border-white"
    //                     : "bg-white/[0.03] text-white border-white/10"
    //                 }`}
    //               >
    //                 <Icon size={16} strokeWidth={2.3} />
    //                 <span className="text-[10px] font-bold">{item.label}</span>
    //               </button>
    //             );
    //           })}
    //         </div>

    //         {/* Beat any rate */}
    //         <div className="relative z-10 mt-4 rounded-xl border border-white/40 overflow-hidden bg-gradient-to-r from-[#f5f7fb] via-[#e4e7ed] to-[#dce3ec] p-2.5 shadow-[0_8px_20px_rgba(0,0,0,0.25)]">
    //           <div className="flex items-center gap-2">
    //             <div className="w-7 h-7 rounded-lg bg-[#0B0F14] border border-black/10 flex items-center justify-center flex-shrink-0">
    //               <ShieldCheck size={12} className="text-[#e8b66a]" />
    //             </div>
    //             <div className="flex-1 min-w-0">
    //               <div className="flex items-center gap-1">
    //                 <h3 className="text-black font-extrabold text-[11px]">
    //                   Beat any rate
    //                 </h3>
    //                 <div className="px-1 py-[1px] rounded-full bg-emerald-500/15 border border-emerald-500/20 flex items-center gap-0.5">
    //                   <div className="w-1 h-1 rounded-full bg-emerald-500" />
    //                   <span className="text-[7px] font-extrabold text-emerald-700">
    //                     LIVE
    //                   </span>
    //                 </div>
    //               </div>
    //               <p className="text-[#5d6777] text-[8px] font-medium leading-tight truncate">
    //                 Compared across exchanges
    //               </p>
    //             </div>
    //             <button className="w-5 h-5 rounded-full bg-black/5 border border-black/10 flex items-center justify-center flex-shrink-0">
    //               <ExternalLink size={8} className="text-black/70" />
    //             </button>
    //           </div>
    //         </div>
    //       </div>

    //       {/* TRANSACTIONS */}
    //       <div className="px-3 pt-0.5 pb-14 flex-1 overflow-hidden">
    //         <h2 className="text-[#5a6578] font-bold text-xs">Transactions</h2>
    //         <div className="">
    //           {TRANSACTIONS.slice(0, 1).map((tx) => (
    //             <div
    //               key={tx.id}
    //               className="flex items-center py-1 "
    //             >
    //               <div className="w-7 h-7 rounded-lg bg-[#f4f5f7] border border-[#e5e7eb] flex items-center justify-center font-bold text-[10px] text-[#0B1220] flex-shrink-0">
    //                 {tx.user[0]}
    //               </div>
    //               <div className="flex-1 ml-2 min-w-0">
    //                 <h3 className="font-bold text-[10px] text-[#0B1220] leading-tight">
    //                   {tx.type}
    //                 </h3>
    //                 <p className="text-[#94a3b8] text-[8px] font-medium leading-tight mt-0.5 truncate">
    //                   {tx.user} · {tx.date}
    //                 </p>
    //               </div>
    //               <div className="text-right flex-shrink-0">
    //                 <p
    //                   className={`text-[10px] font-bold leading-tight ${
    //                     tx.negative ? "text-red-500" : "text-emerald-500"
    //                   }`}
    //                 >
    //                   {tx.amount}
    //                 </p>
    //                 <p className="text-[8px] text-[#94a3b8] font-medium leading-tight">
    //                   {tx.usdt}
    //                 </p>
    //               </div>
    //             </div>
    //           ))}
    //         </div>
    //       </div>
    //     </div>

    //     <motion.div
    //       initial={{ opacity: 0, y: 10 }}
    //       animate={{ opacity: 1, y: 0 }}
    //       transition={{ delay: 0.8, duration: 0.6 }}
    //       className="absolute bottom-3 left-2 right-2 z-10"
    //     >
    //       <div className="h-11 rounded-2xl border border-[#dfe3ea] bg-[#f5f7fb]/95 backdrop-blur-xl flex items-center justify-around px-2 shadow-[0_-5px_20px_rgba(0,0,0,0.06)]">
    //         {[
    //           { Icon: Home, label: "HOME", active: true },
    //           { Icon: Zap, label: "TRADE" },
    //           { Icon: MessageCircle, label: "INBOX" },
    //           { Icon: Activity, label: "ACTIVITY" },
    //           { Icon: User, label: "YOU" },
    //         ].map(({ Icon, label, active }) => (
    //           <div
    //             key={label}
    //             className="flex flex-col items-center gap-0.5"
    //           >
    //             <Icon
    //               size={12}
    //               strokeWidth={active ? 2.4 : 1.8}
    //               className={active ? "text-black" : "text-[#9ca3af]"}
    //             />
    //             <span
    //               className={`text-[7px] font-extrabold tracking-wide ${
    //                 active ? "text-black" : "text-[#9ca3af]"
    //               }`}
    //             >
    //               {label}
    //             </span>
    //           </div>
    //         ))}
    //       </div>
    //     </motion.div>
    //   </motion.div>
    // </div>
    // E:\33researchlabs\Blip-money-futureStick\blip-protocol-ui\public\screenshots\image.png
    <div
      className="overflow-hidden rounded-[3rem]"
      style={{
        width: "min(290px, calc(100vw - 60px))",
        height: "min(600px, 77vh)",
      }}
    >
      <img className="w-full h-full object-cover" src="/screenshots/image2-bg.png" alt="" />
    </div>
  );
}

export default BlipPhoneMockup;
