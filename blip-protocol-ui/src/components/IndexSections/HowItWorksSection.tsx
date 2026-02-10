// import { useRef, useState, useEffect } from "react";
// import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
// import { Check, Globe, User, Building2, CheckCircle2 } from "lucide-react";
// import { Header } from "@/components/Hero/PhoneMockup";

// /* ============================================
//    SECTION 7: HOW IT WORKS - Interactive Single Screen
//    ============================================ */

// const HowItWorksSection = () => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const { scrollYProgress } = useScroll({
//     target: containerRef,
//     offset: ["start end", "end start"],
//   });

//   const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
//   const [activeStep, setActiveStep] = useState(0);

//   // Auto-advance steps every 5 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setActiveStep((prev) => (prev + 1) % 3);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   const steps = [
//     {
//       num: "01",
//       title: "Send",
//       desc: "Create a payment from your wallet. Connect, enter amount, and send globally.",
//       app: "Blip App",
//       appIcon: "📱",
//       screen: (
//         <div className="p-3 sm:p-4 h-full flex flex-col overflow-hidden">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-2">
//               <Header className="text-xl w-28" />
//             </div>
//             <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center">
//               <User className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-black dark:text-white/40" />
//             </div>
//           </div>
//           <div className="flex-1 flex flex-col items-center justify-center min-h-0">
//             <span className="text-[10px] sm:text-xs text-black dark:text-white/40 uppercase tracking-wider mb-2">
//               You send
//             </span>
//             <div className="flex items-baseline gap-1.5 mb-4">
//               <span className="text-3xl sm:text-4xl font-bold text-black dark:text-white">
//                 500
//               </span>
//               <span className="text-sm sm:text-base text-black dark:text-white/50">USDT</span>
//             </div>
//             <div className="w-full px-3 py-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] text-center mb-2">
//               <span className="text-[10px] text-black dark:text-white/30 block mb-0.5">
//                 Recipient gets
//               </span>
//               <span className="text-sm sm:text-base text-black dark:text-white font-medium">
//                 1,835 AED
//               </span>
//             </div>
//             <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-black dark:text-white/30">
//               <Check className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-emerald-400" />
//               <span>Best rate locked</span>
//             </div>
//           </div>
//           <div className="w-full py-2.5 sm:py-3 rounded-full bg-white text-center mt-3 flex-shrink-0">
//             <span className="text-xs sm:text-sm font-semibold text-black">
//               Continue
//             </span>
//           </div>
//         </div>
//       ),
//     },
//     {
//       num: "02",
//       title: "Match",
//       desc: "150+ verified merchants compete to fulfill your order. Best rate wins.",
//       app: "Merchant Dashboard",
//       appIcon: "🏪",
//       screen: (
//         <div className="p-3 sm:p-4 h-full flex flex-col text-left overflow-hidden">
//           <div className="flex items-center justify-between mb-3 sm:mb-4">
//             <span className="text-xs sm:text-sm font-semibold text-black dark:text-white">
//               Live Orders
//             </span>
//             <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10">
//               <div className="w-1.5 h-1.5 rounded-full bg-black/60 dark:bg-white/60" />
//               <span className="text-[8px] sm:text-[10px] text-black dark:text-white/60 font-medium">
//                 LIVE
//               </span>
//             </div>
//           </div>
//           <div className="space-y-2 flex-1 min-h-0 overflow-hidden">
//             {[
//               {
//                 rate: "3.672",
//                 profit: "+$1.85",
//                 best: true,
//                 merchant: "Dubai Exchange",
//               },
//               {
//                 rate: "3.668",
//                 profit: "+$1.65",
//                 best: false,
//                 merchant: "Emirates FX",
//               },
//               {
//                 rate: "3.665",
//                 profit: "+$1.50",
//                 best: false,
//                 merchant: "Gulf Markets",
//               },
//             ].map((bid, i) => (
//               <div
//                 key={i}
//                 className={`p-2.5 sm:p-3 rounded-lg sm:rounded-xl ${
//                   bid.best
//                     ? "bg-black/[0.06] dark:bg-white/[0.06] border border-black/20 dark:border-white/20"
//                     : "bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.04]"
//                 }`}
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <div
//                       className={`w-6 sm:w-7 h-6 sm:h-7 rounded-md sm:rounded-lg ${
//                         bid.best ? "bg-black/10 dark:bg-white/10" : "bg-black/5 dark:bg-white/5"
//                       } flex items-center justify-center`}
//                     >
//                       {bid.best ? (
//                         <CheckCircle2 className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-black dark:text-white" />
//                       ) : (
//                         <Building2 className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-black dark:text-white/40" />
//                       )}
//                     </div>
//                     <div>
//                       <span className="text-xs sm:text-sm font-semibold text-black dark:text-white block">
//                         {bid.rate} AED
//                       </span>
//                       <span className="text-[8px] sm:text-[10px] text-black dark:text-white/30">
//                         {bid.merchant}
//                       </span>
//                     </div>
//                   </div>
//                   <span className="text-[10px] sm:text-xs text-emerald-400 font-medium">
//                     {bid.profit}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <div className="mt-3 p-2.5 rounded-lg bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.04] flex-shrink-0">
//             <div className="flex items-center gap-2">
//               <div className="w-3 h-3 rounded-full border-2 border-black/30 dark:border-white/30 border-t-white/60" />
//               <span className="text-[10px] sm:text-xs text-black dark:text-white/40">
//                 Auto-selecting best rate...
//               </span>
//             </div>
//           </div>
//         </div>
//       ),
//     },
//     {
//       num: "03",
//       title: "Verify",
//       desc: "Every transaction on-chain. Track, verify, and confirm on Blipscan.",
//       app: "Blipscan",
//       appIcon: "🔍",
//       screen: (
//         <div className="p-3 sm:p-4 h-full flex flex-col text-left overflow-hidden">
//           <div className="flex items-center justify-between mb-3">
//             <div className="flex items-center gap-2 md:gap-2.5">
//               <div className="w-6 h-6 rounded-md sm:rounded-lg bg-white flex items-center justify-center">
//                 <Globe className="w-3 sm:w-3.5 md:w-4 lg:w-4.5 h-3 sm:h-3.5 md:h-4 lg:h-4.5 text-black" />
//               </div>
//               <span className="text-xs sm:text-sm md:text-base font-semibold text-black dark:text-white">
//                 Blipscan
//               </span>
//             </div>
//             <div className="px-2 py-0.5 rounded-full flex justify-normal bg-black/[0.05] dark:bg-white/[0.05]">
//               <span className="text-[8px] sm:text-[10px] text-black dark:text-white/60 font-medium">
//                 Mainnet
//               </span>
//             </div>
//           </div>
//           <div className="space-y-2 flex-1 min-h-0 overflow-hidden">
//             {[
//               { id: "BLP-7x2K", to: "Ahmed M.", amount: "$500", time: "2s" },
//               {
//                 id: "BLP-4mR8",
//                 to: "Sarah K.",
//                 amount: "$1,200",
//                 time: "1.4s",
//               },
//               { id: "BLP-9nP3", to: "John D.", amount: "$320", time: "1.8s" },
//             ].map((tx, i) => (
//               <div
//                 key={i}
//                 className="p-2.5 sm:p-3 rounded-lg md:rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.04]"
//               >
//                 <div className="flex items-center justify-between mb-1.5">
//                   <span className="text-[8px] sm:text-[10px] md:text-xs text-black dark:text-white/40 font-mono">
//                     {tx.id}...
//                   </span>
//                   <div className="flex items-center gap-1 md:gap-1.5 px-1.5 md:px-2 lg:px-2.5 py-0.5 rounded md:rounded-md bg-emerald-500/10">
//                     <Check className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-emerald-400" />
//                     <span className="text-[10px] sm:text-xs text-emerald-400 font-medium">
//                       {tx.time}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <span className="text-xs text-black dark:text-white">
//                     {tx.to}
//                   </span>
//                   <span className="text-[13px] font-semibold text-black dark:text-white">
//                     {tx.amount}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="mt-3 p-2.5 rounded-lg bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.04] flex-shrink-0">
//             <div className="flex items-center justify-center gap-2">
//               {/* <div className="w-3 h-3 rounded-full border-2 border-black/30 dark:border-white/30 border-t-white/60" /> */}
//               <div className="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-emerald-400" />
//               <span className="text-[10px] sm:text-xs text-black dark:text-white/40">
//                  Connected to Solana
//               </span>
//             </div>
//           </div>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <section
//       ref={containerRef}
//       className="relative min-h-screen lg:h-screen flex items-center justify-center bg-[#FAF8F5] dark:bg-black overflow-hidden py-12 lg:py-0"
//     >
//       {/* Animated background */}
//       <div className="absolute inset-0">
//         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-black/[0.02] dark:bg-white/[0.02] blur-[120px]" />
//         <motion.div
//           className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-[#ff6b35]/[0.03] blur-[100px]"
//           animate={{
//             scale: [1, 1.2, 1],
//             opacity: [0.03, 0.05, 0.03],
//           }}
//           transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
//         />
//       </div>

//       <motion.div
//         className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 w-full"
//         style={{ opacity }}
//       >
//         {/* Header */}
//         <div className="text-center mb-8 lg:mb-10">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.8 }}
//             className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] mb-4"
//           >
//             <div className="w-1.5 h-1.5 rounded-full bg-[#ff6b35]" />
//             <span className="text-[10px] text-black dark:text-white/50 uppercase tracking-wider">
//               How it works
//             </span>
//           </motion.div>
//           <motion.h2
//             initial={{ opacity: 0, y: 40 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 1 }}
//             className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black dark:text-white tracking-tight leading-[1.1] mb-3"
//           >
//             Three steps.
//             <br />
//             <span className="text-black dark:text-white/40">Zero friction.</span>
//           </motion.h2>
//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 1, delay: 0.1 }}
//             className="text-sm md:text-base text-black dark:text-white/40 font-medium max-w-2xl mx-auto px-2"
//           >
//             From crypto to cash in under 2 seconds. No banks, no delays, no
//             complexity.
//           </motion.p>
//         </div>

//         {/* Interactive Single Screen Layout */}
//         <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
//           {/* Left: Phone Mockup with Dynamic Content */}
//           <motion.div
//             initial={{ opacity: 0, x: -50 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.8 }}
//             className="flex justify-center items-center order-2 lg:order-1"
//           >
//             <div className="relative w-[200px] sm:w-[240px] md:w-[280px] lg:w-[320px]">
//               <div className="rounded-[36px] sm:rounded-[40px] bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] p-[2px] sm:p-[2.5px] shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
//                 <div className="rounded-[34px] sm:rounded-[37.5px] bg-[#fafafa] dark:bg-[#0a0a0a] p-[8px] sm:p-[10px]">
//                   <div className="rounded-[28px] sm:rounded-[30px] bg-[#FAF8F5] dark:bg-black overflow-hidden h-[360px] sm:h-[420px] md:h-[480px] lg:h-[540px] relative">
//                     {/* Status bar */}
//                     <div className="absolute top-0 left-0 right-0 h-9 sm:h-10 flex items-center justify-between px-4 sm:px-5 z-20">
//                       <span className="text-[9px] sm:text-[10px] font-semibold text-black dark:text-white">
//                         9:41
//                       </span>
//                       <div className="flex items-center gap-1 sm:gap-1.5">
//                         <div className="flex items-end gap-[1.5px] sm:gap-[2px]">
//                           <div className="w-[3px] sm:w-1 h-1 sm:h-1.5 bg-black dark:bg-white rounded-[1px]" />
//                           <div className="w-[3px] sm:w-1 h-1.5 sm:h-2 bg-black dark:bg-white rounded-[1px]" />
//                           <div className="w-[3px] sm:w-1 h-2 sm:h-2.5 bg-black dark:bg-white rounded-[1px]" />
//                           <div className="w-[3px] sm:w-1 h-2.5 sm:h-3 bg-black dark:bg-white rounded-[1px]" />
//                         </div>
//                         <div className="w-4 sm:w-5 h-2 sm:h-2.5 rounded-[2px] sm:rounded-[3px] border border-black/80 dark:border-white/80 p-[1px] sm:p-[1.5px]">
//                           <div className="h-full w-[80%] bg-black dark:bg-white rounded-[1px]" />
//                         </div>
//                       </div>
//                     </div>

//                     {/* Dynamic Screen Content */}
//                     <div className="pt-9 sm:pt-10 h-full">
//                       <AnimatePresence mode="wait">
//                         <motion.div
//                           key={activeStep}
//                           initial={{ opacity: 0, y: 20 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           exit={{ opacity: 0, y: -20 }}
//                           transition={{ duration: 0.4 }}
//                           className="h-full"
//                         >
//                           {steps[activeStep].screen}
//                         </motion.div>
//                       </AnimatePresence>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </motion.div>

//           {/* Right: Step Navigation & Content */}
//           <motion.div
//             initial={{ opacity: 0, x: 50 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.8 }}
//             className="space-y-3 lg:space-y-4 order-1 lg:order-2"
//           >
//             {steps.map((step, i) => (
//               <motion.div
//                 key={i}
//                 onClick={() => setActiveStep(i)}
//                 className={`group cursor-pointer p-3 sm:p-4 lg:p-5 rounded-lg sm:rounded-xl lg:rounded-2xl border backdrop-blur-xl transition-all duration-300 ${
//                   activeStep === i
//                     ? "bg-white/70 dark:bg-white/[0.06] border-black/20 dark:border-white/20 shadow-[0_8px_40px_-8px_rgba(0,0,0,0.12)] dark:shadow-none"
//                     : "bg-white/60 dark:bg-white/[0.03] border-black/[0.08] dark:border-white/[0.06] shadow-[0_4px_30px_-8px_rgba(0,0,0,0.08)] dark:shadow-none hover:bg-white/70 hover:dark:bg-white/[0.05] hover:border-black/15 hover:dark:border-white/10"
//                 }`}
//               >
//                 <div className="flex items-start gap-2.5 sm:gap-3 lg:gap-4">
//                   {/* Step Number */}
//                   <div
//                     className={`flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-md sm:rounded-lg lg:rounded-xl flex items-center justify-center font-mono font-bold text-xs sm:text-sm lg:text-base transition-all duration-300 ${
//                       activeStep === i
//                         ? "bg-black dark:bg-white text-white dark:text-black"
//                         : "bg-black/5 dark:bg-white/5 text-black dark:text-white/40 group-hover:bg-black/10 group-hover:dark:bg-white/10 group-hover:text-black/60 group-hover:dark:text-white/60"
//                     }`}
//                   >
//                     {step.num}
//                   </div>

//                   {/* Content */}
//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
//                       <span className="text-sm sm:text-base lg:text-lg">{step.appIcon}</span>
//                       <h3
//                         className={`text-sm sm:text-base lg:text-lg font-semibold transition-colors ${
//                           activeStep === i
//                             ? "text-black dark:text-white"
//                             : "text-black dark:text-white/60 group-hover:text-black/80 group-hover:dark:text-white/80"
//                         }`}
//                       >
//                         {step.title}
//                       </h3>
//                     </div>
//                     <p
//                       className={`text-[11px] sm:text-xs lg:text-sm leading-relaxed transition-colors ${
//                         activeStep === i
//                           ? "text-black dark:text-white/50"
//                           : "text-black dark:text-white/30 group-hover:text-black/40 group-hover:dark:text-white/40"
//                       }`}
//                     >
//                       {step.desc}
//                     </p>
//                     <div className="mt-1.5 sm:mt-2 text-[9px] sm:text-[10px] lg:text-xs text-black dark:text-white/30">
//                       {step.app}
//                     </div>
//                   </div>

//                   {/* Active Indicator */}
//                   {activeStep === i && (
//                     <motion.div
//                       layoutId="activeIndicator"
//                       className="flex-shrink-0 w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-[#ff6b35]"
//                     />
//                   )}
//                 </div>

//                 {/* Progress Bar */}
//                 {activeStep === i && (
//                   <motion.div
//                     initial={{ scaleX: 0 }}
//                     animate={{ scaleX: 1 }}
//                     transition={{ duration: 5, ease: "linear" }}
//                     className="h-0.5 bg-gradient-to-r from-[#ff6b35] to-[#ff8c5a] rounded-full mt-2.5 sm:mt-3 lg:mt-4 origin-left"
//                   />
//                 )}
//               </motion.div>
//             ))}

//             {/* Manual Navigation Dots */}
//             <div className="flex items-center justify-center gap-1.5 sm:gap-2 pt-2 sm:pt-3 lg:pt-4">
//               {steps.map((_, i) => (
//                 <button
//                   key={i}
//                   onClick={() => setActiveStep(i)}
//                   className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 ${
//                     activeStep === i
//                       ? "w-5 sm:w-6 lg:w-8 bg-[#ff6b35]"
//                       : "w-1 sm:w-1.5 bg-black/20 dark:bg-white/20 hover:bg-black/40 hover:dark:bg-white/40"
//                   }`}
//                   aria-label={`Go to step ${i + 1}`}
//                 />
//               ))}
//             </div>
//           </motion.div>
//         </div>
//       </motion.div>
//     </section>
//   );
// };

// export default HowItWorksSection;



import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  RefreshCcw, 
  ShieldCheck, 
  Globe, 
  Lock, 
  Zap, 
  ArrowRight, 
  Wallet, 
  CheckCircle2,
  TrendingUp,
  Fingerprint,
  Activity,
  ChevronRight,
  MousePointer2,
  CreditCard,
  Layers,
  Bell,
  Wifi,
  Battery,
  Signal,
  Plus,
  ArrowDownCircle,
  Coins
} from 'lucide-react';
import { CTAButton } from '../Navbar';

const App = () => {
  const [activeSection, setActiveSection] = useState(0);
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.content-section');
      const viewportHeight = window.innerHeight;
      const triggerPoint = viewportHeight * 0.6; // Trigger when section reaches 60% from top

      let newActiveSection = 0;
      let closestDistance = Infinity;

      // Find the section closest to the trigger point
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(sectionCenter - triggerPoint);

        if (distance < closestDistance && rect.bottom > 0 && rect.top < viewportHeight) {
          closestDistance = distance;
          newActiveSection = index;
        }
      });

      setActiveSection(newActiveSection);
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const steps = [
    { title: "Initiation", screen: <RequestScreen /> },
    { title: "Match", screen: <MatchScreen /> },
    { title: "Verify", screen: <VerifyScreen /> }
  ];

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#FAF8F5] dark:bg-black text-black dark:text-white selection:bg-[#ff6b35]/20 isolate py-12 md:py-20">

        <div className="text-center mb-12 lg:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] mb-4"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#ff6b35]" />
            <span className="text-[10px] text-black dark:text-white/50 uppercase tracking-wider">
              How it works
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black dark:text-white tracking-tight leading-[1.1] mb-3"
          >
            Three steps.
            <br />
            <span className="text-black/40 dark:text-white/40">Zero friction.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.1 }}
            className="text-sm md:text-base text-black/60 dark:text-white/40 font-medium max-w-2xl mx-auto px-2"
          >
            From crypto to cash in under 2 seconds. No banks, no delays, no
            complexity.
          </motion.p>
        </div>


      {/* Top Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[1px] bg-black/20 dark:bg-white/20 z-[100] origin-left"
        style={{ scaleX }}
      />

      <div className="max-w-7xl mx-auto px-8 lg:px-12 flex flex-col lg:flex-row gap-16 relative min-h-screen">
        
        {/* LEFT SIDE: Sticky Phone UI */}
        <div className="w-full lg:w-[45%] lg:sticky lg:top-0 h-[75vh] lg:h-screen flex items-center justify-center py-12">
          <div className="relative w-full max-w-[340px] aspect-[9/19.5]">
            <motion.div
              animate={{ opacity: [0.02, 0.04, 0.02], scale: [1, 1.1, 1] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute inset-0 bg-[#ff6b35] dark:bg-white blur-[140px] rounded-full pointer-events-none"
            />

            <div className="relative z-10 w-full h-full bg-black/5 dark:bg-[#0a0a0a] rounded-[4rem] p-3 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] dark:shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] border-[1.5px] border-black/10 dark:border-white/10 ring-1 ring-black/5 dark:ring-white/5">
              <div className="w-full h-full bg-white dark:bg-black rounded-[3.4rem] p-2 relative overflow-hidden border border-black/5 dark:border-white/5">
                {/* Dynamic Island */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-32 h-8 bg-black dark:bg-black rounded-full z-[60] flex items-center justify-between px-5 border border-black/10 dark:border-white/10">
                   <div className="w-1.5 h-1.5 rounded-full bg-black/20 dark:bg-white/20" />
                   <div className="w-1 h-1 rounded-full bg-[#ff6b35]/40" />
                </div>

                <div className="w-full h-full bg-[#FAF8F5] dark:bg-black rounded-[2.8rem] overflow-hidden relative shadow-[inset_0_0_40px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_40px_rgba(0,0,0,1)]">
                  <div className="absolute top-0 left-0 right-0 h-14 flex items-center justify-between px-10 z-[55] text-[10px] font-bold text-black/20 dark:text-white/20">
                    <span>9:41</span>
                    <div className="flex gap-1.5 items-center">
                      <Signal size={10} />
                      <Wifi size={10} />
                      <Battery size={10} />
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeSection}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.02 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="w-full h-full"
                    >
                      {steps[activeSection % 3].screen}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <Cursor name="Gateway" color="bg-black dark:bg-white" textColor="text-white dark:text-black" initialPos={{ top: '15%', left: '-25%' }} delay={0} />
            <Cursor name="Blip_Bot" color="bg-black/10 dark:bg-white/10" textColor="text-black dark:text-white" initialPos={{ bottom: '25%', right: '-25%' }} delay={2} />
          </div>
        </div>

        {/* RIGHT SIDE: Content Narrative */}
        <div className="w-full lg:w-[55%] py-24 lg:py-48 space-y-72">

          {/* Section 01: Initiation */}
          <section className="content-section space-y-12">
            <div className="space-y-4">
              <span className="text-black/60 dark:text-white/40 font-bold tracking-[0.4em] uppercase text-[10px]">Initiation</span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-7xl font-semibold tracking-tight leading-[0.85] text-black dark:text-white"
              >
                Request Your <br />
                <span className="text-black/30 dark:text-white/20">Capital Flow.</span>
              </motion.h1>
            </div>

            <p className="text-2xl text-black/60 dark:text-white/40 font-normal leading-relaxed max-w-xl">
              Connect institutional treasuries. Blip enables instant payment requests across 40+ fiat rails with sub-second finality.
            </p>

            <div className="bg-white/80 dark:bg-white/[0.03] border-l-[1px] border-black/10 dark:border-white/10 p-8 rounded-r-3xl backdrop-blur-md">
              <p className="text-xl leading-relaxed text-black/70 dark:text-white/60">
                <span className="font-semibold text-black dark:text-white">Autonomous Rails:</span> Blip bypasses legacy systems, providing instant liquidity matching without the overhead.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
               {['STABLECOINS', 'LOCAL FIAT', 'API HOOKS'].map(tag => (
                 <span key={tag} className="px-5 py-2 bg-white/80 dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/10 rounded-full text-[10px] font-semibold tracking-widest text-black/60 dark:text-white/40">{tag}</span>
               ))}
            </div>
          </section>

          {/* Section 02: Match */}
          <section className="content-section space-y-12">
            <div className="space-y-4">
              <span className="text-black/60 dark:text-white/40 font-bold tracking-[0.4em] uppercase text-[10px]">Match</span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-7xl font-semibold tracking-tight leading-[0.85] text-black dark:text-white"
              >
                Price <br />
                <span className="text-black/30 dark:text-white/20 italic underline underline-offset-8 decoration-black/10 dark:decoration-white/10">Optimization.</span>
              </motion.h2>

              <p className="text-2xl text-black/60 dark:text-white/40 font-normal leading-relaxed max-w-xl">
                Behind the scenes, our engine scans local liquidity in Dubai to find the exact mid-market exchange rate, avoiding hidden bank fees.
              </p>

              <div className="grid grid-cols-2 gap-6">
                <div className="p-8 bg-white/80 dark:bg-white/[0.03] rounded-3xl border border-black/[0.06] dark:border-white/5 group hover:border-black/20 dark:hover:border-[#ff6b35]/20 transition-all">
                    <Layers className="text-black/40 dark:text-white/40 mb-6 group-hover:text-black dark:group-hover:text-white transition-colors" size={24} />
                    <h4 className="font-semibold text-xl mb-1 text-black dark:text-white">Best Rate</h4>
                    <p className="text-xs text-black/40 dark:text-white/20 font-medium tracking-widest uppercase">1 USDT = 3.67 AED</p>
                </div>
                <div className="p-8 bg-white/80 dark:bg-white/[0.03] rounded-3xl border border-black/[0.06] dark:border-white/5 group hover:border-black/20 dark:hover:border-[#ff6b35]/20 transition-all">
                    <Activity className="text-black/40 dark:text-white/40 mb-6 group-hover:text-black dark:group-hover:text-white transition-colors" size={24} />
                    <h4 className="font-semibold text-xl mb-1 text-black dark:text-white">Live Search</h4>
                    <p className="text-xs text-black/40 dark:text-white/20 font-medium tracking-widest uppercase">Liquidity Scan</p>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-white/5 border-l-[1px] border-black/20 dark:border-white/20 p-8 rounded-r-3xl backdrop-blur-md">
                <p className="text-xl leading-relaxed text-black/70 dark:text-white/70">
                  <span className="font-semibold text-black dark:text-white">The Match Stage:</span> This module finds the "match" between your USDT and real-time liquidity providers in Dubai at the fairest price globally.
                </p>
              </div>
            </div>
          </section>

          {/* Section 03: Verify */}
          <section className="content-section space-y-12">
            <div className="space-y-4">
              <span className="text-black/60 dark:text-white/40 font-bold tracking-[0.4em] uppercase text-[10px]">Verify</span>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-7xl font-semibold tracking-tight leading-[0.85] text-black dark:text-white"
              >
                Secure <br />
                <span className="text-black/30 dark:text-white/20">Execution.</span>
              </motion.h2>

              <p className="text-2xl text-black/60 dark:text-white/40 font-normal leading-relaxed max-w-xl">
                The final check. We verify the legality of the funds through multi-sig protocols. Once cleared, the AED is released to your destination instantly.
              </p>

              <div className="bg-white/90 dark:bg-[#080808] rounded-[32px] overflow-hidden shadow-2xl border border-black/[0.06] dark:border-white/10">
                <div className="flex items-center justify-between px-6 py-4 bg-black/[0.03] dark:bg-white/5 border-b border-black/[0.06] dark:border-white/5">
                  <div className="flex gap-2 text-black/40 dark:text-white/20">
                    <Zap size={12} />
                  </div>
                  <div className="text-[10px] text-black/40 dark:text-white/20 font-mono tracking-widest uppercase">trade_finalize.v1</div>
                  <Lock size={12} className="text-black/20 dark:text-white/10" />
                </div>
                <div className="p-10 font-mono text-[14px] leading-relaxed text-black/60 dark:text-white/40">
                  <div className="flex gap-4"><span className="text-black/20 dark:text-white/10">01</span><span className="text-black/70 dark:text-white/80">await</span> ledger.<span className="text-black dark:text-white">confirm</span>(trade_USDT_AED);</div>
                  <div className="flex gap-4"><span className="text-black/20 dark:text-white/10">02</span><span className="text-black/20 dark:text-white/10">// Status: Compliance Verified</span></div>
                  <div className="flex gap-4"><span className="text-black/20 dark:text-white/10">03</span><span className="text-black/40 dark:text-white/20">const</span> receipt = <span className="text-black/70 dark:text-white/80">"AED_TX_DUBAI_SAFE"</span>;</div>
                  <div className="flex gap-4"><span className="text-black/20 dark:text-white/10">04</span>blip.<span className="text-black dark:text-white font-semibold">release</span>(receipt);</div>
                </div>
              </div>

              {/* <motion.button
                whileHover={{ scale: 1.02,  }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-5 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-semibold text-sm uppercase tracking-widest flex items-center gap-3 transition-all"
              >
                Initiate Trade <ChevronRight size={18} />
              </motion.button> */}
              <CTAButton to='' className='w-[220px] h-[48px] uppercase'>Initiate Trade</CTAButton>
            </div>
          </section>

          <div className="h-40" />
        </div>
      </div>
    </div>
  );
};

// --- APP SCREENS ---

const RequestScreen = () => (
  <div className="p-7 pt-20 flex flex-col h-full bg-[#FAF8F5] dark:bg-black text-black dark:text-white font-sans">
    <div className="flex justify-between items-start mb-8">
      <div>
        <p className="text-[9px] font-semibold text-black/20 dark:text-white/10 uppercase tracking-[0.2em] mb-1">Portfolio</p>
        <h3 className="text-3xl font-semibold tracking-tight text-black dark:text-white/90">24,500.00</h3>
        <p className="text-[9px] text-black/50 dark:text-white/40 font-medium mt-1 tracking-tight italic">USDT (ERC-20)</p>
      </div>
      <div className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center">
        <Bell size={16} className="text-black/40 dark:text-white/20" />
      </div>
    </div>
    
    <div className="space-y-3">
      <div className="bg-white/80 dark:bg-white/[0.03] p-5 rounded-[2rem] border border-black/[0.06] dark:border-white/5">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[9px] font-semibold text-black/30 dark:text-white/10 uppercase tracking-widest">Swap</span>
          <span className="text-[9px] text-black/40 dark:text-white/20 font-medium uppercase tracking-wider">Sell</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="text-3xl font-semibold tracking-tight text-black dark:text-white/80">10,000</span>
          <span className="text-[10px] font-semibold text-black/40 dark:text-white/20 tracking-widest uppercase">USDT</span>
        </div>
      </div>

      <div className="flex justify-center -my-6 relative z-10">
        <div className="bg-[#FAF8F5] dark:bg-black p-1">
          <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 w-9 h-9 rounded-full flex items-center justify-center text-black/50 dark:text-white/40 shadow-xl">
            <ArrowRight size={18} className="rotate-90" />
          </div>
        </div>
      </div>

      <div className="bg-black dark:bg-white p-6 rounded-[2rem] shadow-2xl">
        <div className="flex justify-between items-center mb-4 text-white/40 dark:text-black/20">
          <span className="text-[9px] font-semibold uppercase tracking-widest">Receive</span>
          <span className="text-[9px] font-medium tracking-wider">Spot_AED</span>
        </div>
        <div className="flex justify-between items-baseline text-white dark:text-black">
          <span className="text-3xl font-semibold tracking-tight">36,730</span>
          <span className="text-[10px] font-semibold opacity-40 uppercase tracking-widest font-mono italic">AED</span>
        </div>
      </div>
    </div>

    <div className="mt-8">
      <p className="text-[9px] font-semibold text-black/30 dark:text-white/10 uppercase tracking-widest mb-3">Destination</p>
      <div className="flex gap-2">
        <div className="w-10 h-10 rounded-full bg-black/10 dark:bg-white/10 border border-black/10 dark:border-white/10 flex items-center justify-center text-[10px] font-semibold text-black/60 dark:text-white/40">
           DXB
        </div>
        <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-[10px] font-semibold text-black/40 dark:text-white/20">
           AUH
        </div>
        <div className="w-10 h-10 rounded-full border border-dashed border-black/10 dark:border-white/10 flex items-center justify-center text-black/30 dark:text-white/10">
          <Plus size={12} />
        </div>
      </div>
    </div>

    <div className="mt-auto mb-6 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-black/50 dark:text-white/40 py-4 rounded-3xl text-center font-semibold text-[9px] uppercase tracking-[0.2em] flex items-center justify-center gap-2">
      <Lock size={10} className="text-[#ff6b35]/60" />
      Secure Authorization
    </div>
  </div>
);

const MatchScreen = () => (
  <div className="p-7 pt-20 flex flex-col h-full bg-[#FAF8F5] dark:bg-black items-center font-sans">
    <div className="relative w-40 h-40 mb-10">
       <motion.div
        animate={{ rotate: 360, opacity: [0.05, 0.1, 0.05] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 border border-black/10 dark:border-white/10 rounded-full"
      />
       <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute inset-8 border border-black/5 dark:border-white/5 border-dashed rounded-full"
      />
      <div className="absolute inset-0 flex items-center justify-center">
         <div className="w-20 h-20 bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-full border border-black/10 dark:border-white/10 flex flex-col items-center justify-center shadow-2xl text-black/50 dark:text-white/40">
            <RefreshCcw size={28} className="mb-1" />
            <span className="text-[7px] font-semibold tracking-[0.2em] uppercase text-black/30 dark:text-white/10">Routing</span>
         </div>
      </div>
    </div>

    <div className="w-full space-y-2">
      <div className="flex justify-between items-baseline px-2 mb-2">
        <h3 className="text-lg font-semibold text-black dark:text-white/80 tracking-tight">Liquidity</h3>
        <span className="text-[8px] text-[#ff6b35]/60 font-semibold tracking-[0.2em] uppercase animate-pulse">Syncing AED</span>
      </div>

      {[
        { city: "London LP", value: "3.6732", active: true },
        { city: "Singapore LP", value: "3.6719", active: false },
        { city: "Local OTC", value: "3.6730", active: false }
      ].map((node, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 dark:bg-white/[0.02] p-4 rounded-2xl border border-black/[0.06] dark:border-white/5 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className={`w-1.5 h-1.5 rounded-full ${node.active ? 'bg-[#ff6b35]/60 shadow-[0_0_8px_#ff6b35]' : 'bg-black/10 dark:bg-white/5'}`} />
            <div>
              <p className="text-[10px] font-semibold text-black/60 dark:text-white/40 uppercase tracking-tight">{node.city}</p>
              <p className="text-[8px] text-black/40 dark:text-white/20 tracking-widest font-mono">RATE: {node.value}</p>
            </div>
          </div>
          <span className={`text-[8px] font-semibold tracking-widest uppercase ${node.active ? 'text-black dark:text-white/60' : 'text-black/30 dark:text-white/10'}`}>
            {node.active ? 'Match' : 'Wait'}
          </span>
        </motion.div>
      ))}
    </div>

    <div className="mt-auto w-full p-4 bg-white/80 dark:bg-white/5 rounded-2xl border border-black/[0.06] dark:border-white/5 flex justify-between items-center mb-4">
      <span className="text-[8px] font-semibold text-black/40 dark:text-white/20 uppercase tracking-[0.2em]">Efficiency</span>
      <span className="text-xs font-semibold text-black dark:text-white/80 tracking-tight">99.98%</span>
    </div>
  </div>
);

const VerifyScreen = () => (
  <div className="p-8 pt-20 flex flex-col h-full bg-[#FAF8F5] dark:bg-black items-center font-sans text-center">
    <div className="flex flex-col items-center justify-center h-2/3 w-full">
      <div className="relative mb-8">
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 15 }}
          className="relative w-24 h-24 bg-black dark:bg-white rounded-full flex items-center justify-center shadow-2xl"
        >
          <CheckCircle2 size={40} className="text-white dark:text-black" />
        </motion.div>
      </div>

      <h3 className="text-2xl font-semibold text-black dark:text-white/80 uppercase tracking-[0.1em]">Settled</h3>
      <p className="text-[9px] text-black/30 dark:text-white/10 font-semibold tracking-[0.3em] uppercase mt-3">LEDGER_ID: 0x9A...F21</p>
    </div>

    <div className="w-full space-y-2 mt-auto mb-6">
      <div className="bg-white/80 dark:bg-white/5 p-4 rounded-2xl border border-black/[0.06] dark:border-white/5 flex justify-between items-center">
         <div className="flex items-center gap-2">
            <Fingerprint size={14} className="text-black/40 dark:text-white/20" />
            <span className="text-[8px] font-semibold text-black/40 dark:text-white/20 uppercase tracking-widest">Authorization</span>
         </div>
         <span className="text-[8px] font-semibold text-black dark:text-white/60 tracking-widest uppercase">Success</span>
      </div>
      <div className="bg-white/80 dark:bg-white/5 p-4 rounded-2xl border border-black/[0.06] dark:border-white/5 flex justify-between items-center">
         <div className="flex items-center gap-2">
            <Zap size={14} className="text-[#ff6b35]/60" />
            <span className="text-[8px] font-semibold text-black/40 dark:text-white/20 uppercase tracking-widest">Settlement</span>
         </div>
         <span className="text-[8px] font-semibold text-black dark:text-white/60 tracking-widest uppercase">420MS</span>
      </div>
    </div>
  </div>
);

const Cursor = ({ name, color, textColor, initialPos, delay }) => (
  <motion.div 
    animate={{ 
      x: [0, 8, -5, 0],
      y: [0, -12, 4, 0]
    }}
    transition={{ 
      duration: 6, 
      repeat: Infinity, 
      ease: "easeInOut",
      delay 
    }}
    style={initialPos}
    className="absolute z-20 pointer-events-none hidden lg:block"
  >
    <div className="relative">
      <div className={`${color} ${textColor} text-[8px] px-3.5 py-1.5 rounded-full rounded-tl-none font-black shadow-2xl flex items-center gap-2 tracking-[0.2em] uppercase`}>
        <MousePointer2 size={10} fill="currentColor" />
        {name}
      </div>
    </div>
  </motion.div>
);

export default App;
