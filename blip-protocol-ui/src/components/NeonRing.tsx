export const NeonRing = ({ size, color, duration, reverse }: any) => (
  <div
    className="absolute rounded-full border border-dashed opacity-30 animate-spin"
    style={{
      width: size,
      height: size,
      borderColor: color,
      animationDuration: `${duration}s`,
      animationDirection: reverse ? "reverse" : "normal",
      boxShadow: `0 0 20px ${color}20`,
    }}
  />
);
