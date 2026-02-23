// import { useRef } from "react";
// import { motion, useScroll, useSpring, useTransform } from "framer-motion";

// /* ============================================
//    SECTION 2: UAE ANNOUNCEMENT - Apple-style cinematic
//    ============================================ */

// const UAESection = () => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const { scrollYProgress } = useScroll({
//     target: containerRef,
//     offset: ["start end", "end start"],
//   });

//   const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
//   const scale = useTransform(
//     scrollYProgress,
//     [0, 0.3, 0.7, 1],
//     [0.9, 1, 1, 0.9],
//   );

//   const smoothConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };

//   // Floating elements for depth - more dynamic
//   const float1Y = useTransform(scrollYProgress, [0, 1], [100, -150]);
//   const float2Y = useTransform(scrollYProgress, [0, 1], [50, -200]);
//   const float3Y = useTransform(scrollYProgress, [0, 1], [150, -100]);
//   const rotateOrb = useTransform(scrollYProgress, [0, 1], [0, 180]);

//   const y = useSpring(
//     useTransform(scrollYProgress, [0, 1], [0, 150]),
//     smoothConfig,
//   );

//   return (
//     <>
//     <section
//       ref={containerRef}
//       className="relative md:min-h-screen flex items-center justify-center overflow-hidden bg-[#FAF8F5] dark:bg-black"

//     >
//       {/* Immersive background with glow */}
//       <div className="absolute inset-0">

//         {/* Ambient glow - top */}
//         <motion.div
//           className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] rounded-full"
//           style={{
//             background:
//               "radial-gradient(ellipse, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 40%, transparent 70%)",
//             y: float1Y,
//           }}
//         />

//         {/* Secondary glow - floating */}
//         <motion.div
//           className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full"
//           style={{
//             background:
//               "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 60%)",
//             y: float2Y,
//             rotate: rotateOrb,
//           }}
//         />

//         {/* White ambient for contrast */}
//         <motion.div
//           className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full"
//           style={{
//             background:
//               "radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 70%)",
//             y: float3Y,
//           }}
//         />

//        {/* Background with parallax */}
//       <motion.div className="absolute aspect-[21/9] inset-0 z-0 max-w-screen-2xl mx-auto rounded-3xl" style={{ y }}>
//         <img
//            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2940&auto=format&fit=crop"
//           alt="Modern office"
//           className="w-full h-full object-cover rounded-3xl"
//         />
//         <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-white dark:to-black" />
//       </motion.div>

//         {/* Grid overlay */}
//         <div
//           className="absolute inset-0 opacity-[0.02]"
//           style={{
//             backgroundImage: `
//               linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
//               linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
//             `,
//             backgroundSize: "80px 80px",
//           }}
//         />
//       </div>

//       {/* Main content */}
//       <motion.div
//         className="relative z-10 max-w-5xl mx-auto px-6 text-center"
//         style={{ opacity, scale }}
//       >
//         {/* Animated badge */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
//           className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-12 backdrop-blur-sm"
//           style={{
//             background: "rgba(255, 255, 255, 0.03)",
//             border: "1px solid rgba(255, 255, 255, 0.1)",
//           }}
//         >
//           <motion.span
//             className="w-2 h-2 rounded-full bg-[#ff6b35]"

//           />
//           <span className="text-[13px] text-black dark:text-white/70 font-medium tracking-wide">
//             Launching 2026{" "}
//           </span>
//         </motion.div>

//         {/* Main headline */}
//         <motion.div
//           initial={{ opacity: 0, y: 50 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
//           className="mb-8"
//         >
//           <h2
//             className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-semibold tracking-tight leading-[0.9] text-black dark:text-white"
//           >
//             Dubai
//           </h2>
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
//           >
//             <span className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-semibold text-black dark:text-white/15 tracking-tight">
//               is next.
//             </span>
//           </motion.div>
//         </motion.div>

//         {/* Subtext */}
//         <motion.p
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
//           className="text-lg md:text-xl text-black dark:text-white/40 max-w-2xl mx-auto leading-relaxed font-light mb-12"
//         >
//           The world's fastest-growing financial hub meets the future of
//           payments.
//           <br className="hidden md:block" />
//           Private. Instant. Non-custodial.
//         </motion.p>

//         {/* Stats row */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
//           className="flex items-center justify-center gap-6 sm:gap-12 md:gap-20"
//         >
//           {[
//             { value: "40+", label: "Banks" },
//             { value: "180+", label: "Nationalities" },
//             { value: "$2T+", label: "Annual Trade" },
//           ].map((stat, i) => (
//             <motion.div
//               key={stat.label}
//               className="text-center"
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.8, delay: 0.8 + i * 0.1 }}
//             >
//               <div className="text-xl sm:text-2xl md:text-3xl font-semibold text-black dark:text-white mb-1">
//                 {stat.value}
//               </div>
//               <div className="text-[9px] sm:text-[11px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-black dark:text-white/30">
//                 {stat.label}
//               </div>
//             </motion.div>
//           ))}
//         </motion.div>
//       </motion.div>

//       {/* Bottom fade */}
//       <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-black to-transparent" />
//     </section>
//     </>
//   );
// };

// export default UAESection;

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import dubai from "../../../public/Dubai.jpeg";

/* ============================================
   SECTION 2: UAE ANNOUNCEMENT - Apple-style cinematic
   ============================================ */

const UAESection = () => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.9, 1, 1, 0.9],
  );

  const smoothConfig = {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  };

  // Floating elements
  const float1Y = useTransform(scrollYProgress, [0, 1], [100, -150]);
  const float2Y = useTransform(scrollYProgress, [0, 1], [50, -200]);
  const float3Y = useTransform(scrollYProgress, [0, 1], [150, -100]);
  const rotateOrb = useTransform(scrollYProgress, [0, 1], [0, 180]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#FAF8F5] dark:bg-black"
    >
      {/* Background */}
      <div className="absolute inset-0">
        {/* Top glow - dark mode only */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] rounded-full hidden dark:block"
          style={{
            background:
              "radial-gradient(ellipse, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 40%, transparent 70%)",
            y: float1Y,
          }}
        />

        {/* Floating glow - dark mode only */}
        <motion.div
          className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full hidden dark:block"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 60%)",
            y: float2Y,
            rotate: rotateOrb,
          }}
        />

        {/* Bottom glow - dark mode only */}
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full hidden dark:block"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 70%)",
            y: float3Y,
          }}
        />

        {/* Image parallax */}
        <motion.div className="absolute inset-0 z-0 max-w-7xl mx-auto rounded-3xl px-4 sm:px-6">
          <img
            src={dubai}
            alt="Dubai skyline"
            className="w-full h-full object-cover rounded-3xl dark:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-transparent dark:from-black/80 dark:via-black/60 dark:to-black lg:mr-6" />
        </motion.div>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center"
        style={{ opacity, scale }}
      >
        <div className="bg-white/30 dark:bg-black/40 backdrop-blur-md border border-white/40 dark:border-white/[0.06] rounded-3xl px-8 sm:px-14 py-12 sm:py-16 shadow-[0_8px_60px_-12px_rgba(0,0,0,0.12)] dark:shadow-none">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-10 bg-black/[0.04] dark:bg-white/[0.04] border border-black/10 dark:border-white/10"
          >
            <span className="w-2 h-2 rounded-full bg-black dark:bg-white" />
            <span className="text-xs text-black/70 dark:text-white/70 tracking-wide">
              Launching 2026
            </span>
          </motion.div>

          {/* Headline */}
          <h2 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-semibold tracking-tight text-black dark:text-white leading-[0.9]">
            Dubai
          </h2>
          <span className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-semibold text-black/80 dark:text-white/15 relative inline-block">
            <span className="relative z-10">is next.</span>
            <motion.span
              className="absolute -bottom-1 left-0 right-0 h-[1.5px] rounded-full bg-gradient-to-r from-[#ff6b35]/60 via-[#ff8f5e]/50 to-[#ff6b35]/20"
              initial={{ scaleX: 0, originX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 1.2,
                delay: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          </span>

          {/* Subtext */}
          <p className="mt-8 text-lg md:text-xl text-black/60 dark:text-white/40 font-medium max-w-2xl mx-auto">
            The world's fastest-growing financial hub meets the future of
            payments.
            <br className="hidden md:block" />
            Private. Instant. Non-custodial.
          </p>

          {/* Stats */}
          <div className="mt-12 flex justify-center gap-10">
            {[
              { value: "40+", label: "Banks" },
              { value: "$2T+", label: "Annual Trade" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-semibold text-black dark:text-white">
                  {stat.value}
                </div>
                <div className="text-[10px] tracking-widest text-black/40 dark:text-white/30 font-medium uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-transparent dark:from-black to-transparent" />
    </section>
  );
};

export default UAESection;
