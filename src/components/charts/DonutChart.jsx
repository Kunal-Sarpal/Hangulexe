import { polarToCartesian } from '../../utils/helpers';

const DonutChart = ({ data }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const colors = [
    'var(--text-accent, #3b82f6)',
    '#8b5cf6',
    '#f59e0b',
    '#22c55e',
    '#ef4444',
    '#ec4899',
    '#14b8a6'
  ];
  let cumulative = 0;
  const radius = 70;
  const cx = 90;
  const cy = 90;
  return (
    <div className="flex flex-col sm:flex-row items-center gap-8">
      <svg width="180" height="180" viewBox="0 0 180 180" className="flex-shrink-0">
        {data.map((d, i) => {
          const startAngle = (cumulative / total) * 360;
          cumulative += d.value;
          const endAngle = (cumulative / total) * 360;
          const start = polarToCartesian(cx, cy, radius, startAngle);
          const end = polarToCartesian(cx, cy, radius, endAngle);
          const largeArc = endAngle - startAngle > 180 ? 1 : 0;
          const path = `M ${cx} ${cy} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
          return (
            <path
              key={i}
              d={path}
              fill={colors[i % colors.length]}
              opacity={0.9}
              className="hover:opacity-100 transition-opacity cursor-pointer"
            />
          );
        })}
        <circle cx={cx} cy={cy} r={44} fill="var(--surface-1)" />
        <text x={cx} y={cy + 2} textAnchor="middle" className="donut-center-number" fill="var(--text-primary)">{total}</text>
        <text x={cx} y={cy + 18} textAnchor="middle" className="donut-center-label" fill="var(--text-secondary)">Total Items</text>
      </svg>
      <div className="flex-1 w-full space-y-1.5">
        {data.map((d, i) => (
          <div key={i} className="donut-legend-item">
            <div className="donut-legend-dot" style={{ backgroundColor: colors[i % colors.length] }} />
            <span style={{ color: 'var(--text-secondary)' }}>{d.label}</span>
            <span style={{ marginLeft: 'auto', fontWeight: 600, color: 'var(--text-primary)' }}>{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;
