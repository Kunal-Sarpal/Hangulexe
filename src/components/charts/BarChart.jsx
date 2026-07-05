const BarChart = ({ data }) => {
  const maxVal = Math.max(...data.map(d => d.value));
  const barWidth = 40;
  const gap = 16;
  const chartHeight = 160;
  const svgWidth = data.length * (barWidth + gap) + gap;
  return (
    <svg width="100%" viewBox={`0 0 ${svgWidth} ${chartHeight + 45}`} className="overflow-visible">
      {data.map((d, i) => {
        const h = (d.value / maxVal) * chartHeight;
        const x = gap + i * (barWidth + gap);
        return (
          <g key={i}>
            <defs>
              <linearGradient id={`bar-${i}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="var(--text-accent)" />
                <stop offset="100%" stopColor="rgba(99, 102, 241, 0.25)" />
              </linearGradient>
            </defs>
            {/* Background bar track */}
            <rect x={x} y={0} width={barWidth} height={chartHeight} rx={6} fill="rgba(0,0,0,0.02)" />
            {/* Main animated bar */}
            <rect x={x} y={chartHeight - h} width={barWidth} height={h} rx={6} fill={`url(#bar-${i})`}>
              <animate attributeName="height" from="0" to={h} dur="0.6s" fill="freeze" />
              <animate attributeName="y" from={chartHeight} to={chartHeight - h} dur="0.6s" fill="freeze" />
            </rect>
            {/* Month label below bars */}
            <text x={x + barWidth / 2} y={chartHeight + 20} textAnchor="middle" style={{ fontSize: '12px', fill: 'var(--text-secondary)', fontWeight: 400 }}>{d.month}</text>
            {/* Bar value label above bars */}
            <text x={x + barWidth / 2} y={chartHeight - h - 6} textAnchor="middle" style={{ fontSize: '13px', fill: 'var(--text-primary)', fontWeight: 500 }}>{`₹${(d.value / 1000).toFixed(0)}K`}</text>
          </g>
        );
      })}
    </svg>
  );
};

export default BarChart;
