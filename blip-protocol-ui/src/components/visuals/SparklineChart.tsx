import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface SparklineChartProps {
  data: number[];
  width?: number;
  height?: number;
  className?: string;
  color?: string;
  animate?: boolean;
}

export const SparklineChart = ({
  data,
  width = 60,
  height = 24,
  className = "",
  color = "rgba(255, 255, 255, 0.4)",
  animate = true,
}: SparklineChartProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const stepX = width / (data.length - 1 || 1);

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw line
    ctx.beginPath();
    data.forEach((value, i) => {
      const x = i * stepX;
      const y = height - ((value - min) / range) * height;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    // Draw gradient fill
    if (data.length > 1) {
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();

      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, color.replace(/[\d.]+\)$/g, "0.2)"));
      gradient.addColorStop(1, color.replace(/[\d.]+\)$/g, "0)"));
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }, [data, width, height, color]);

  return (
    <motion.canvas
      ref={canvasRef}
      className={className}
      style={{ width, height }}
      initial={animate ? { opacity: 0, scale: 0.9 } : {}}
      animate={animate ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.4 }}
    />
  );
};
