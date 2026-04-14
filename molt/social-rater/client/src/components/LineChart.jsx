// Bar + line chart — pure SVG
// data: [{ date: '2026-04-14', value: 1234 }, ...]
export default function LineChart({ data, color = '#4ade80', height = 160, label = '' }) {
  if (!data || data.length === 0) {
    return <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#52525b', fontSize: '.62rem' }}>no data yet — history builds over time</div>;
  }

  const values = data.map(d => d.value || 0);
  const maxVal = Math.max(...values, 1);
  const minVal = 0; // Always start bars from 0
  const range = maxVal - minVal || 1;

  const width = 800;
  const padding = { top: 14, right: 14, bottom: 22, left: 48 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const xStep = data.length > 1 ? innerW / (data.length - 1) : 0;
  const barWidth = data.length > 1 ? Math.min(xStep * 0.65, 24) : 24;

  const points = data.map((d, i) => {
    const x = padding.left + i * xStep;
    const y = padding.top + innerH - ((d.value - minVal) / range) * innerH;
    return { x, y, value: d.value, date: d.date };
  });

  const pathD = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');

  const fmtN = n => { if (!n) return '0'; if (n >= 1e6) return (n/1e6).toFixed(1)+'M'; if (n >= 1e3) return (n/1e3).toFixed(1)+'K'; return String(Math.round(n)); };

  const ticks = [0, 0.25, 0.5, 0.75, 1].map(f => minVal + f * range);

  // Growth
  const first = values[0] || 0;
  const last = values[values.length - 1] || 0;
  const growth = first > 0 ? ((last - first) / first * 100) : 0;
  const growthColor = growth >= 0 ? '#4ade80' : '#f87171';

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <span style={{ fontSize: '.55rem', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '.1em', fontWeight: 600 }}>{label}</span>
          <span style={{ fontSize: '.62rem', color: growthColor, fontWeight: 600 }}>
            {first > 0 && <>{growth >= 0 ? '+' : ''}{growth.toFixed(1)}% {'\u00b7'} </>}
            {data.length} days {'\u00b7'} peak {fmtN(maxVal)}
          </span>
        </div>
      )}
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height, display: 'block' }} preserveAspectRatio="none">
        {/* Grid */}
        {ticks.map((t, i) => {
          const y = padding.top + innerH - ((t - minVal) / range) * innerH;
          return (
            <g key={i}>
              <line x1={padding.left} x2={width - padding.right} y1={y} y2={y} stroke="#1c1c1f" strokeWidth="1" strokeDasharray="2 3" />
              <text x={padding.left - 8} y={y + 3} textAnchor="end" fill="#52525b" fontSize="9" fontFamily="SF Mono, monospace">{fmtN(t)}</text>
            </g>
          );
        })}
        {/* Bars */}
        {points.map((p, i) => {
          const barH = padding.top + innerH - p.y;
          return (
            <rect
              key={i}
              x={p.x - barWidth / 2}
              y={p.y}
              width={barWidth}
              height={Math.max(barH, 1)}
              fill={color}
              fillOpacity="0.25"
              rx="2"
            />
          );
        })}
        {/* Line */}
        <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {/* Points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="3" fill={color} stroke="#09090b" strokeWidth="1.5" />
            <title>{p.date}: {fmtN(p.value)}</title>
          </g>
        ))}
        {/* X labels */}
        {[0, Math.floor(points.length / 4), Math.floor(points.length / 2), Math.floor(points.length * 3 / 4), points.length - 1].filter((v, i, a) => a.indexOf(v) === i).map(idx => {
          const p = points[idx];
          if (!p) return null;
          const d = new Date(p.date);
          const label = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
          return <text key={idx} x={p.x} y={height - 6} textAnchor="middle" fill="#52525b" fontSize="9" fontFamily="SF Mono, monospace">{label}</text>;
        })}
      </svg>
    </div>
  );
}
