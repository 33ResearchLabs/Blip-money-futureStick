import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/* ============================================
   PRODUCT SHOWCASE - Floating App Screenshots
   ============================================ */

const ProductShowcase = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  return (
    <section
      ref={containerRef}
      className="relative py-20 md:py-40 bg-black overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[11px] uppercase tracking-[0.3em] text-white/30 font-light block mb-4">
              Experience
            </span>
            <h2 className="text-4xl md:text-6xl font-semibold text-white tracking-tight leading-[1.1] mb-6">
              Built for speed.
              <br />
              <span className="text-white/40">Designed for you.</span>
            </h2>
            <p className="text-lg text-white/50 leading-relaxed max-w-lg">
              Every detail crafted for the fastest, most intuitive payment
              experience. From your first transfer to your thousandth.
            </p>
          </motion.div>

          {/* Right: Floating Screenshots */}
          <div className="relative h-[600px] hidden lg:block">
            {/* Screenshot 1 - Large */}
            <motion.div
              style={{ y: y1 }}
              className="absolute top-0 right-20 w-64 rounded-2xl overflow-hidden shadow-2xl"
            >
              <img
                src="/images/app-flow-1.jpg"
                alt="App interface"
                className="w-full h-auto"
                style={{
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              />
            </motion.div>

            {/* Screenshot 2 - Small */}
            <motion.div
              style={{ y: y2 }}
              className="absolute bottom-20 left-0 w-48 rounded-xl overflow-hidden shadow-2xl"
            >
              <img
                src="/images/app-flow-2.jpg"
                alt="Transaction details"
                className="w-full h-auto opacity-90"
                style={{
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              />
            </motion.div>

            {/* Screenshot 3 - Medium */}
            <motion.div
              style={{ y: useTransform(scrollYProgress, [0, 1], [50, -50]) }}
              className="absolute top-40 left-12 w-56 rounded-xl overflow-hidden shadow-2xl"
            >
              <img
                src="/images/app-flow-3.jpg"
                alt="Payment confirmation"
                className="w-full h-auto opacity-80"
                style={{
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                }}
              />
            </motion.div>

            {/* Glow effects */}
            <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-white/[0.02] rounded-full blur-3xl" />
            <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-white/[0.015] rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
