export const PulseIcon = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg
    viewBox="0 0 70 60"
    width={size}
    height={size * (60 / 70)}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M4 36 L16 36 L25 8 L38 52 L47 28 L66 28"
      stroke="currentColor"
      strokeWidth="9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
