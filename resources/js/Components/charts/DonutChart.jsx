import React from 'react';

const SIZE = 160;
const RADIUS = 58;
const CENTER = SIZE / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP = 3;

export default function DonutChart({ segments, formatValue = v => v, centerLabel, ariaLabel }) {
 const total = segments.reduce((sum, s) => sum + s.value, 0);
 let offset = 0;

 return <div className="chart-donut">
  <svg viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label={ariaLabel} className="chart-donut-svg">
   <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="#edf0e8" strokeWidth="20" />
   {total > 0 && segments.filter(s => s.value > 0).map(s => {
    const share = s.value / total;
    const len = Math.max(0, share * CIRCUMFERENCE - GAP);
    const dashoffset = -offset;
    offset += share * CIRCUMFERENCE;
    return <circle key={s.key} cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke={s.color} strokeWidth="20"
     strokeDasharray={`${len} ${CIRCUMFERENCE - len}`} strokeDashoffset={dashoffset}
     strokeLinecap="round" transform={`rotate(-90 ${CENTER} ${CENTER})`} />;
   })}
   <text x={CENTER} y={CENTER - 3} textAnchor="middle" className="chart-donut-total">{formatValue(total)}</text>
   {centerLabel && <text x={CENTER} y={CENTER + 16} textAnchor="middle" className="chart-donut-caption">{centerLabel}</text>}
  </svg>
  <ul className="chart-legend chart-legend-block">
   {segments.map(s => <li key={s.key}><i style={{ background: s.color }} aria-hidden="true" />{s.label}<b>{formatValue(s.value)}</b><span>{total ? Math.round((s.value / total) * 100) : 0}%</span></li>)}
  </ul>
 </div>;
}
