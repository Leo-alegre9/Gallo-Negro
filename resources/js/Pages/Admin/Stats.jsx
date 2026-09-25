import React from 'react';
import { Link } from '@inertiajs/react';
import { TrendingUp, TrendingDown, Minus, Users, Eye, MessageCircle, Percent, ChartNoAxesCombined } from 'lucide-react';
import AdminLayout from '../../Components/AdminLayout';
import LineChart from '../../Components/charts/LineChart';
import BarChart from '../../Components/charts/BarChart';
import DonutChart from '../../Components/charts/DonutChart';
import { CHART_COLORS, STATUS_COLORS } from '../../Components/charts/colors';

const number = value => Number(value || 0).toLocaleString('es-AR');
const percent = value => `${Number(value || 0).toLocaleString('es-AR')}%`;
const shortDate = date => date.slice(5).split('-').reverse().join('/');
const kpiIcons = [Users, Eye, MessageCircle, Percent];
const ranges = [[7, '7 días'], [30, '30 días'], [90, '90 días']];

function Delta({ value }) {
 const direction = value > 0 ? 'is-up' : value < 0 ? 'is-down' : 'is-flat';
 const Icon = value > 0 ? TrendingUp : value < 0 ? TrendingDown : Minus;
 return <span className={`admin-kpi-delta ${direction}`}><Icon size={13} aria-hidden="true" />{value > 0 ? '+' : ''}{value}% <span className="sr-only">vs. período anterior</span></span>;
}

export default function Stats({ range, kpis, visitsSeries, eventsSeries, activitySeries, topProducts, byCategory, stockStatus, catalogStatus }) {
 const dates = visitsSeries.map(day => day.date);

 return <AdminLayout title="Estadísticas">
  <div className="admin-tabs admin-range-tabs" role="group" aria-label="Rango de tiempo">
   {ranges.map(([value, label]) => <Link key={value} href={`/admin/estadisticas?rango=${value}`} className={range === value ? 'active' : ''}>{label}</Link>)}
  </div>

  <div className="admin-kpi-grid mt-6">
   {kpis.map((kpi, index) => { const Icon = kpiIcons[index]; return <section key={kpi.label} className="admin-kpi">
    <div className="flex items-center justify-between gap-2"><span className="admin-kpi-label">{kpi.label}</span><Icon size={16} className="text-[#8c6746]" aria-hidden="true" /></div>
    <strong>{kpi.isRate ? percent(kpi.value) : number(kpi.value)}</strong>
    <Delta value={kpi.delta} />
   </section>; })}
  </div>

  <div className="admin-stats-grid">
   <section className="admin-panel is-wide">
    <h2>Visitas y páginas vistas</h2><p>Sesiones únicas y páginas recorridas por día.</p>
    {visitsSeries.some(d => d.visitors || d.pageViews) ? <LineChart
     ariaLabel="Visitas y páginas vistas por día"
     labels={dates}
     formatLabel={shortDate}
     formatValue={number}
     series={[
      { key: 'visitors', label: 'Visitantes', color: CHART_COLORS[0], data: visitsSeries.map(d => d.visitors) },
      { key: 'pageViews', label: 'Páginas vistas', color: CHART_COLORS[1], data: visitsSeries.map(d => d.pageViews) },
     ]}
    /> : <div className="admin-empty"><ChartNoAxesCombined size={30} aria-hidden="true" /><strong>Sin visitas en este período</strong><p>Cuando alguien recorra la tienda vas a ver la curva acá.</p></div>}
   </section>

   <section className="admin-panel is-wide">
    <h2>Vistas y consultas de producto</h2><p>Fichas abiertas y consultas iniciadas por WhatsApp, día a día.</p>
    {eventsSeries.some(d => d.views || d.consultations) ? <LineChart
     ariaLabel="Vistas y consultas de producto por día"
     labels={dates}
     formatLabel={shortDate}
     formatValue={number}
     series={[
      { key: 'views', label: 'Vistas de producto', color: CHART_COLORS[0], data: eventsSeries.map(d => d.views) },
      { key: 'consultations', label: 'Consultas', color: CHART_COLORS[2], data: eventsSeries.map(d => d.consultations) },
     ]}
    /> : <div className="admin-empty"><ChartNoAxesCombined size={30} aria-hidden="true" /><strong>Sin actividad de producto</strong><p>Las vistas y consultas de este período van a aparecer acá.</p></div>}
   </section>

   <section className="admin-panel">
    <h2>Productos más consultados</h2><p>Ranking por consultas iniciadas; visitas a la ficha como referencia.</p>
    {topProducts.length ? <BarChart
     ariaLabel="Productos más consultados"
     color={CHART_COLORS[0]}
     formatValue={number}
     rows={topProducts.map(p => ({ key: p.id, label: p.name, value: p.consultations, hint: `${number(p.views)} visitas` }))}
    /> : <div className="admin-empty"><MessageCircle size={28} aria-hidden="true" /><strong>Sin consultas todavía</strong><p>Cuando consulten una pieza por WhatsApp, va a aparecer acá.</p></div>}
   </section>

   <section className="admin-panel">
    <h2>Interés por categoría</h2><p>Consultas por categoría; visitas a fichas como referencia.</p>
    {byCategory.length ? <BarChart
     ariaLabel="Interés por categoría"
     color={CHART_COLORS[1]}
     formatValue={number}
     rows={byCategory.map(c => ({ key: c.id, label: c.name, value: c.consultations, hint: `${number(c.views)} visitas` }))}
    /> : <div className="admin-empty"><ChartNoAxesCombined size={28} aria-hidden="true" /><strong>Sin datos por categoría</strong><p>Vas a ver qué categorías generan más interés acá.</p></div>}
   </section>

   <section className="admin-panel">
    <h2>Estado del catálogo</h2><p>Cómo se reparten tus productos hoy.</p>
    <DonutChart
     ariaLabel="Distribución de productos por estado"
     centerLabel="productos"
     formatValue={number}
     segments={catalogStatus.map((s, i) => ({ key: s.key, label: s.label, value: s.total, color: [STATUS_COLORS.good, STATUS_COLORS.warn, STATUS_COLORS.critical][i] }))}
    />
   </section>

   <section className="admin-panel">
    <h2>Disponibilidad de stock</h2><p>Piezas activas según su estado de stock.</p>
    <DonutChart
     ariaLabel="Distribución de productos por estado de stock"
     centerLabel="productos"
     formatValue={number}
     segments={stockStatus.map((s, i) => ({ key: s.key, label: s.label, value: s.total, color: [STATUS_COLORS.good, STATUS_COLORS.warn, STATUS_COLORS.critical][i] ?? STATUS_COLORS.muted }))}
    />
   </section>

   <section className="admin-panel is-wide">
    <h2>Actividad del equipo</h2><p>Cambios registrados en Auditoría por día.</p>
    {activitySeries.some(d => d.total) ? <LineChart
     ariaLabel="Cambios de administración por día"
     labels={activitySeries.map(d => d.date)}
     formatLabel={shortDate}
     formatValue={number}
     series={[{ key: 'total', label: 'Cambios', color: CHART_COLORS[3], data: activitySeries.map(d => d.total) }]}
    /> : <div className="admin-empty"><ChartNoAxesCombined size={28} aria-hidden="true" /><strong>Sin cambios en este período</strong><p>Las altas, bajas y ediciones del equipo van a aparecer acá.</p></div>}
   </section>
  </div>
 </AdminLayout>;
}
