import { useRef, useLayoutEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Hexagon, CheckCircle } from "lucide-react";

export default function TransferFlow() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [maxX, setMaxX] = useState(0);
  const [barWidth, setBarWidth] = useState(0);

  // Ref to measure the size of a single node (icon container)
  const nodeRef = useRef<HTMLDivElement>(null);

  // Dynamically calculate animation distance and bar width
  useLayoutEffect(() => {
    const update = () => {
      if (!containerRef.current || !nodeRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;

      // 1. Determine Node Size (w-12, sm:w-14, md:w-16)
      const nodeSize = nodeRef.current.offsetWidth;

      // 2. Calculate Responsive Bar Size
      // Using a size that looks good and is easy to track
      const calculatedBarWidth =
        containerWidth < 400 ? 50 : containerWidth < 768 ? 70 : 90;

      // 3. Determine Outer Padding (px-4 = 16px, sm:px-6 = 24px)
      // This is the padding applied to the main container.
      const style = window.getComputedStyle(containerRef.current);
      const paddingLeft = parseFloat(style.paddingLeft);
      const paddingRight = parseFloat(style.paddingRight);

      // The animation starts at the center of the first node.
      // Start Position (X_start):
      // X_start = PaddingLeft + (NodeWidth / 2) - (BarWidth / 2)
      const X_start = paddingLeft + nodeSize / 2 - calculatedBarWidth / 2;

      // The animation ends when the bar is centered over the last node.
      // End Position (X_end):
      // X_end = (ContainerWidth - PaddingRight - (NodeWidth / 2)) - (BarWidth / 2)
      // MaxX is the total distance traveled from X=0.

      // Since the motion component starts at X=0 relative to its own position
      // (which is implicitly X=0 of the container), the actual MaxX calculation is:

      // Total Distance Available for Movement (between node centers)
      const spaceBetweenNodes =
        containerWidth - paddingLeft - paddingRight - nodeSize;

      // The total travel distance (maxX) is the space between the far edges of the two outer nodes.
      // Travel Distance = (Container Width - PaddingLeft - PaddingRight) - Bar Width
      // Since the nodes are using justify-between, we can calculate the distance
      // between the center of the first node and the center of the last node.

      const centerToCenterDistance =
        containerWidth - paddingLeft - paddingRight;

      // The total travel distance (maxX) is the full available width
      // minus the width of the bar itself.
      const maxTravelDistance =
        containerWidth - (paddingLeft + paddingRight) - calculatedBarWidth;

      // The animation starts at 0 (the left side of the container's content area)
      // and travels to MaxX.
      // To center the bar over the nodes, we must adjust where the bar is rendered (X_start).

      // We will simplify: Set the bar's initial `x` to X_start, and calculate MaxX as the remaining travel.

      // Total movement from the *center* of the first node to the *center* of the last node.
      const distanceBetweenCenters =
        containerWidth - paddingLeft - paddingRight - nodeSize;

      // The bar moves from X_start (centered on the first node)
      // to X_start + distanceBetweenCenters (centered on the last node).

      // This is the new maximum position from the bar's initial offset:
      const calculatedMaxX =
        containerWidth - paddingLeft - paddingRight - calculatedBarWidth;

      setMaxX(calculatedMaxX);
      setBarWidth(calculatedBarWidth);
    };

    update();
    window.addEventListener("resize", update);
    // Cleanup function
    return () => window.removeEventListener("resize", update);
  }, []);

  // Determine Bar Offsets (to align it centered on the first node)
  const barOffset = useRef(0);
  useLayoutEffect(() => {
    if (!containerRef.current || !nodeRef.current) return;
    const style = window.getComputedStyle(containerRef.current);
    const paddingLeft = parseFloat(style.paddingLeft);
    const nodeSize = nodeRef.current.offsetWidth;

    // The bar's initial X position should center it on the first node.
    // Offset = Container Padding Left + (Node Width / 2) - (Bar Width / 2)
    barOffset.current = paddingLeft + nodeSize / 2 - barWidth / 2;
  }, [barWidth]); // Recalculate if bar width changes

  // Define bar styles based on state
  const barStyles = {
    width: `${barWidth}px`,
  };

  return (
    <section className="py-14 sm:py-20 md:py-24 bg-[#020202] border-t border-white/5">
      <div
        ref={containerRef}
        className="relative h-44 sm:h-48 px-4 sm:px-6 max-w-6xl mx-auto flex items-center justify-between"
      >
        {/* Static background line */}
        {/* We use inset-x-4/sm:inset-x-6 to match the container padding */}
        <div className="absolute top-1/2 inset-x-4 sm:inset-x-6 h-px bg-[#111] -translate-y-1/2" />

        {/* --- Animated Glowing Bar Group --- */}

        {/* Gradient pulse line */}
        <motion.div
          className="absolute top-1/2 h-[2px] bg-gradient-to-r from-transparent via-[#00FF94] to-transparent opacity-60 rounded-full -translate-y-1/2"
          style={barStyles}
          // Set initial X position using `barOffset.current` to start centered on 'YOU'
          animate={{ x: [barOffset.current, maxX] }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />

        {/* Solid glowing bar */}
        <motion.div
          className="absolute top-1/2 h-[4px] bg-[#00FF94] rounded-full shadow-[0_0_25px_#00FF94] -translate-y-1/2"
          style={barStyles}
          // Set initial X position using `barOffset.current` to start centered on 'YOU'
          animate={{ x: [barOffset.current, maxX] }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />

        {/* --- Responsive Nodes --- */}
        {[
          { label: "YOU", icon: Users },
          { label: "BLIP ENGINE", icon: Hexagon, mid: true },
          { label: "RECEIVER", icon: CheckCircle },
        ].map((node, i) => (
          <div
            key={i}
            className="relative z-10 flex flex-col items-center gap-2 sm:gap-3"
          >
            <div
              // Use nodeRef only on the first element to get its width/height
              ref={i === 0 ? nodeRef : null}
              className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl bg-[#050505] flex items-center justify-center border transition-all duration-300 ${
                node.mid
                  ? "border-[#00FF94] shadow-[0_0_35px_rgba(0,255,148,0.25)] scale-110"
                  : "border-white/10 text-gray-500"
              }`}
            >
              <node.icon
                className={node.mid ? "text-[#00FF94]" : ""}
                size={20}
              />
            </div>
            <span
              className={`text-[10px] sm:text-xs md:text-sm font-mono font-bold tracking-widest ${
                node.mid ? "text-[#00FF94]" : "text-gray-600"
              }`}
            >
              {node.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
