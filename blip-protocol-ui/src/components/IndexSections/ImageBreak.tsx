import { memo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/* ── Full-bleed immersive image break ── */
const ImageBreak = memo(({ src, height = "70vh" }: { src: string; height?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Parallax: image moves slower than scroll
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.05]);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden"
      style={{ height, minHeight: 400 }}
    >
      <motion.div
        style={{
          y,
          scale,
          position: "absolute",
          inset: "-15%",
          backgroundImage: `url('${src}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </div>
  );
});

export default ImageBreak;
