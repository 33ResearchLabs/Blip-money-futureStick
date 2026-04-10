export default function ScoreBadge({ score, size = 'md' }) {
  const s = score || 0;
  const color = s >= 80 ? '#22c55e' : s >= 60 ? '#f59e0b' : s >= 40 ? '#f97316' : s >= 20 ? '#ef4444' : '#3b3f4a';
  const bg = s >= 80 ? '#0a2614' : s >= 60 ? '#1c1508' : s >= 40 ? '#1c1108' : s >= 20 ? '#1c0a0a' : '#0f1014';
  const border = s >= 80 ? '#166534' : s >= 60 ? '#854d0e' : s >= 40 ? '#9a3412' : s >= 20 ? '#991b1b' : '#1c1e24';

  const sizes = {
    sm: { w: 32, h: 32, font: '0.72rem', bar: 3 },
    md: { w: 44, h: 44, font: '0.9rem', bar: 4 },
    lg: { w: 56, h: 56, font: '1.1rem', bar: 5 },
  };
  const sz = sizes[size] || sizes.md;
  const pct = Math.min(100, s);

  return (
    <div style={{
      width: sz.w, height: sz.h, flexShrink: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: bg, border: `1px solid ${border}`, borderRadius: 6,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Fill bar from bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: `${pct}%`,
        background: color + '18',
        transition: 'height 0.3s ease',
      }} />
      {/* Score number */}
      <div style={{
        fontWeight: 700, fontSize: sz.font, color,
        position: 'relative', zIndex: 1,
        textShadow: `0 0 12px ${color}40`,
      }}>
        {s}
      </div>
    </div>
  );
}
