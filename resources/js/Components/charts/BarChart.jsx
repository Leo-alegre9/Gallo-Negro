import React from 'react';

export default function BarChart({ rows, color = '#b3552a', formatValue = v => v, ariaLabel }) {
 if (!rows.length) return null;
 const max = Math.max(1, ...rows.map(r => r.value));

 return <div className="chart-bars" role="img" aria-label={ariaLabel}>
  {rows.map(row => <div key={row.key} className="chart-bar-row">
   <span className="chart-bar-label">{row.label}</span>
   <div className="chart-bar-track"><div className="chart-bar-fill" style={{ width: `${Math.max(3, (row.value / max) * 100)}%`, background: color }} /></div>
   <span className="chart-bar-value">{formatValue(row.value)}{row.hint && <small>{row.hint}</small>}</span>
  </div>)}
 </div>;
}
