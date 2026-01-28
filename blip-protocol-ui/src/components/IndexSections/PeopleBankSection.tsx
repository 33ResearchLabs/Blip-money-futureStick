import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

/* ============================================
   SECTION 12: PEOPLEBANK
   ============================================ */

const PeopleBankSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Mouse tracking for interactive effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!networkRef.current) return;
      const rect = networkRef.current.getBoundingClientRect();
      setMousePos({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    };

    const network = networkRef.current;
    if (network) {
      network.addEventListener("mousemove", handleMouseMove);
      return () => network.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  // Network node positions
  const nodes = [
    { x: 50, y: 25, label: "You", isCentral: true },
    { x: 22, y: 40, label: "Node" },
    { x: 78, y: 40, label: "Node" },
    { x: 15, y: 65, label: "Node" },
    { x: 38, y: 70, label: "Node" },
    { x: 62, y: 70, label: "Node" },
    { x: 85, y: 65, label: "Node" },
    { x: 50, y: 85, label: "Node" },
  ];

  // Connection pairs
  const connections = [
    [0, 1],
    [0, 2],
    [1, 3],
    [1, 4],
    [2, 5],
    [2, 6],
    [4, 7],
    [5, 7],
    [3, 4],
    [5, 6],
  ];

  return (
    <section
      ref={containerRef}
      className="relative py-12 md:py-48 bg-black overflow-hidden"
    >
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-6"
        style={{ opacity }}
      >
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <motion.div
              className="h-px w-16 bg-gradient-to-r from-transparent to-white/20"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            />
            <span className="text-[11px] uppercase tracking-[0.4em] text-white/40 font-light">
              The Network
            </span>
            <motion.div
              className="h-px w-16 bg-gradient-to-l from-transparent to-white/20"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.1] mb-6"
          >
            <span className="text-white">People</span>
            <span className="text-white/20">Bank</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-base md:text-lg text-white/30 max-w-xl mx-auto leading-relaxed"
          >
            A decentralized, human-powered liquidity network
          </motion.p>
        </div>

        {/* Interactive Network Visualization */}
        <motion.div
          ref={networkRef}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative h-[280px] sm:h-[350px] md:h-[500px] mb-12 sm:mb-16 md:mb-20 cursor-crosshair"
        >
          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <linearGradient
                id="lineGradWhite"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.15)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
              <linearGradient
                id="lineGradActive"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.6)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>
            {connections.map(([from, to], i) => {
              const isActive = hoveredNode === from || hoveredNode === to;
              return (
                <motion.line
                  key={i}
                  x1={`${nodes[from].x}%`}
                  y1={`${nodes[from].y}%`}
                  x2={`${nodes[to].x}%`}
                  y2={`${nodes[to].y}%`}
                  stroke={
                    isActive ? "url(#lineGradActive)" : "url(#lineGradWhite)"
                  }
                  strokeWidth={isActive ? "2" : "1"}
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.5 + i * 0.05 }}
                />
              );
            })}
          </svg>

          {/* Network Nodes */}
          {nodes.map((node, i) => {
            // Subtle parallax based on mouse position
            const offsetX = (mousePos.x - 0.5) * (node.isCentral ? 10 : 20);
            const offsetY = (mousePos.y - 0.5) * (node.isCentral ? 10 : 20);
            const isHovered = hoveredNode === i;
            const isConnectedToHovered =
              hoveredNode !== null &&
              connections.some(
                ([from, to]) =>
                  (from === hoveredNode && to === i) ||
                  (to === hoveredNode && from === i),
              );

            return (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  x: offsetX,
                  y: offsetY,
                }}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: 0.6 + i * 0.1,
                  type: "spring",
                }}
                onMouseEnter={() => setHoveredNode(i)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <motion.div
                  className={`
                    relative -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center cursor-pointer
                    transition-all duration-300
                    ${node.isCentral ? "w-14 h-14 sm:w-18 sm:h-18 md:w-24 md:h-24" : "w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14"}
                  `}
                  style={{
                    background:
                      isHovered || node.isCentral
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(255,255,255,0.03)",
                    border: isHovered
                      ? "1px solid rgba(255,255,255,0.4)"
                      : isConnectedToHovered
                        ? "1px solid rgba(255,255,255,0.2)"
                        : "1px solid rgba(255,255,255,0.08)",
                    boxShadow: isHovered
                      ? "0 0 30px rgba(255,255,255,0.1)"
                      : "none",
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Icon */}
                  <div
                    className={`
                    transition-colors duration-300
                    ${node.isCentral ? "text-2xl md:text-3xl" : "text-lg md:text-xl"}
                    ${isHovered ? "text-white" : "text-white/40"}
                  `}
                  >
                    {node.isCentral ? "◉" : "○"}
                  </div>

                  {/* Label on hover */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
                      >
                        <span className="text-[10px] uppercase tracking-wider text-white/60 font-medium">
                          {node.label}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Pulse ring for central node */}
                  {node.isCentral && (
                    <motion.div
                      className="absolute inset-0 rounded-full border border-white/10"
                      animate={{
                        scale: [1, 1.5, 1.5],
                        opacity: [0.3, 0, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                    />
                  )}
                </motion.div>
              </motion.div>
            );
          })}

          {/* Data flow particles */}
          {connections.slice(0, 4).map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-1.5 h-1.5 rounded-full bg-white/30"
              style={{
                left: `${nodes[0].x}%`,
                top: `${nodes[0].y}%`,
              }}
              animate={{
                left: [
                  `${nodes[0].x}%`,
                  `${nodes[i + 1].x}%`,
                  `${nodes[0].x}%`,
                ],
                top: [`${nodes[0].y}%`, `${nodes[i + 1].y}%`, `${nodes[0].y}%`],
                opacity: [0, 0.6, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 1.5,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>

        {/* Flow steps - clean minimal cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
        >
          {[
            { step: "Join", desc: "Connect wallet" },
            { step: "Lock", desc: "Stake assets" },
            { step: "Route", desc: "Process payments" },
            { step: "Earn", desc: "Get rewarded" },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
              className="group relative p-5 md:p-6 rounded-xl border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300"
            >
              <div className="relative">
                <span className="text-[12px] text-white/40 uppercase tracking-[0.3em]  block mb-4 font-mono">
                  {String(i + 1).padStart(2, "#")}
                </span>
                <h4 className="text-base md:text-lg font-medium text-white mb-1 group-hover:text-white transition-colors">
                  {item.step}
                </h4>
                <p className="text-xs text-white/30">{item.desc}</p>
              </div>

              {/* Subtle hover indicator */}
              <div className="absolute bottom-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-white/0 to-transparent group-hover:via-white/20 transition-all duration-500" />
            </motion.div>
          ))}
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 flex items-center justify-center gap-12 md:gap-20"
        >
          {[
            { value: "100+", label: "Active Nodes" },
            { value: "$2M+", label: "TVL" },
            { value: "12%", label: "Avg APY" },
          ].map((stat, i) => (
            <div key={stat.label} className="text-center group cursor-default">
              <motion.div
                className="text-2xl md:text-3xl font-semibold text-white/90 mb-1 group-hover:text-white transition-colors"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: 1 + i * 0.1,
                  type: "spring",
                }}
              >
                {stat.value}
              </motion.div>
              <div className="text-[10px] text-white/25 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default PeopleBankSection;
