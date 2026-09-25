import React, { useMemo, useRef, useState } from 'react';

const WIDTH = 720;
const PADDING = { top: 14, right: 14, bottom: 26, left: 46 };

export default function LineChart({ series, labels, height = 240, formatValue = v => v, formatLabel = l => l, area = true, ariaLabel }) {
 const wrapRef = useRef(null);
 const [hover, setHover] = useState(null);
 const n = labels.length;
 const innerW = WIDTH - PADDING.left - PADDING.right;
 const innerH = height - PADDING.top - PADDING.bottom;

 const max = useMemo(() => {
  const values = series.flatMap(s => s.data);
  const highest = Math.max(1, ...values);
  return highest <= 5 ? highest : Math.ceil(highest * 1.15 / 5) * 5;
 }, [series]);

 const xAt = i => (n <= 1 ? innerW / 2 : (i / (n - 1)) * innerW) + PADDING.left;
 const yAt = v => innerH - (v / max) * innerH + PADDING.top;
 const pointsFor = s => s.data.map((v, i) => [xAt(i), yAt(v)]);
 const lineFor = pts => pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
 const areaFor = pts => `${lineFor(pts)} L${pts[pts.length - 1][0].toFixed(1)},${innerH + PADDING.top} L${pts[0][0].toFixed(1)},${innerH + PADDING.top} Z`;

 const gridSteps = 4;
 const grid = Array.from({ length: gridSteps + 1 }, (_, i) => {
  const v = (max / gridSteps) * i;
  return { y: yAt(v), v };
 });
 const tickEvery = Math.max(1, Math.ceil(n / 6));

 function handleMove(event) {
  if (!wrapRef.current || n === 0) return;
  const rect = wrapRef.current.getBoundingClientRect();
  const fraction = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
  setHover(n <= 1 ? 0 : Math.round(fraction * (n - 1)));
 }

 if (!n) return null;

 return <div className="chart-line" ref={wrapRef} onMouseMove={handleMove} onMouseLeave={() => setHover(null)}>
  <svg viewBox={`0 0 ${WIDTH} ${height}`} role="img" aria-label={ariaLabel} preserveAspectRatio="none" className="chart-svg">
   {grid.map((g, i) => <g key={i}>
    <line x1={PADDING.left} x2={WIDTH - PADDING.right} y1={g.y} y2={g.y} className="chart-grid-line" />
    <text x={PADDING.left - 8} y={g.y} className="chart-axis-label" textAnchor="end" dominantBaseline="middle">{formatValue(Math.round(g.v))}</text>
   </g>)}
   {labels.map((label, i) => (i % tickEvery === 0 || i === n - 1) && <text key={i} x={xAt(i)} y={height - 6} className="chart-axis-label" textAnchor="middle">{formatLabel(label)}</text>)}
   {series.map(s => {
    const pts = pointsFor(s);
    return <g key={s.key}>
     {area && <path d={areaFor(pts)} fill={s.color} opacity="0.12" stroke="none" />}
     <path d={lineFor(pts)} fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </g>;
   })}
   {hover !== null && <g>
    <line x1={xAt(hover)} x2={xAt(hover)} y1={PADDING.top} y2={innerH + PADDING.top} className="chart-crosshair" />
    {series.map(s => <circle key={s.key} cx={xAt(hover)} cy={yAt(s.data[hover])} r="4" fill={s.color} stroke="#fff" strokeWidth="1.5" />)}
   </g>}
  </svg>
  {hover !== null && <div className="chart-tooltip" style={{ left: `${(xAt(hover) / WIDTH) * 100}%` }}>
   <strong>{formatLabel(labels[hover])}</strong>
   <ul>{series.map(s => <li key={s.key}><i style={{ background: s.color }} aria-hidden="true" />{s.label}<b>{formatValue(s.data[hover])}</b></li>)}</ul>
  </div>}
  {series.length > 1 && <div className="chart-legend">{series.map(s => <span key={s.key}><i style={{ background: s.color }} aria-hidden="true" />{s.label}</span>)}</div>}
 </div>;
}
