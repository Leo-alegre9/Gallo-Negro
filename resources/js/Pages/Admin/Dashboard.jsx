import React from 'react';
import { Link } from '@inertiajs/react';
import { Plus, Package, Users, MousePointer2, MessageCircle, Eye, ArrowUpRight, ChartNoAxesCombined } from 'lucide-react';
import AdminLayout from '../../Components/AdminLayout';
import LineChart from '../../Components/charts/LineChart';
import { CHART_COLORS } from '../../Components/charts/colors';

const number = value => Number(value || 0).toLocaleString('es-AR');
const shortDate = date => date.slice(5).split('-').reverse().join('/');

export default function Dashboard({ summary, dailyVisits, popular }) {
 const metrics = [
  ['Visitantes hoy', summary.visitorsToday, Users, 'Sesiones únicas del día'],
  ['Visitas diarias', summary.visitors30Days, MousePointer2, 'Suma de visitantes diarios · 30 días'],
  ['Páginas vistas', summary.pageViews30Days, Eye, 'Últimos 30 días'],
  ['Consultas iniciadas', summary.consultations30Days, MessageCircle, 'Desde WhatsApp · 30 días'],
 ];
 return <AdminLayout title="Resumen" actions={<Link className="admin-primary" href="/admin/productos/create"><Plus size={18} aria-hidden="true" /> Cargar producto</Link>}>
  <section className="mb-7 flex flex-col gap-6 rounded-xl border border-[#d5dbce] bg-[#e9ede3] p-6 sm:flex-row sm:items-center sm:justify-between" aria-label="Estado del catálogo">
   <div className="flex items-center gap-4"><span className="grid size-12 place-items-center rounded-xl bg-[#d7dfce] text-[#45523d]"><Package size={24} aria-hidden="true" /></span><div><h2 className="text-[27px]!">Tu catálogo</h2><p className="mt-1 text-xs text-[#58614f]">Las piezas que dan forma a Gallo Negro.</p></div></div>
   <div className="flex flex-wrap gap-6 sm:gap-9">{[['Activos', summary.activeProducts, 'activos'], ['De baja', summary.inactiveProducts, 'baja'], ['Eliminados', summary.deletedProducts, 'eliminados']].map(([label, value, status]) => <Link key={status} href={`/admin/productos?estado=${status}`} className="group"><strong className="block font-display text-4xl font-semibold group-hover:text-rust">{number(value)}</strong><span className="mt-1 block text-xs text-[#58614f]">{label}</span></Link>)}</div>
  </section>
  <div className="mb-8 grid grid-cols-2 gap-3 xl:grid-cols-4 xl:gap-5">{metrics.map(([label, value, Icon, hint]) => <section key={label} className="min-w-0 rounded-xl border border-[#e0e2d9] bg-white p-4 sm:p-5">
   <div className="mb-5 flex items-center justify-between gap-2"><span className="text-xs font-medium text-[#58614f]">{label}</span><Icon size={18} className="text-[#8c6746]" aria-hidden="true" /></div><strong className="font-display text-5xl font-semibold tabular-nums">{number(value)}</strong><p className="mt-3 text-[11px] leading-relaxed text-[#626b60]">{hint}</p>
  </section>)}</div>
  <div className="admin-dashboard-grid">
   <section className="admin-panel"><div className="flex items-center justify-between gap-3"><h2>Productos más consultados</h2><ArrowUpRight size={21} className="text-rust" aria-hidden="true" /></div><p>Consultas iniciadas por WhatsApp y visitas a las fichas.</p>
    {popular.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Producto</th><th>Consultas</th><th>Visitas</th></tr></thead><tbody>{popular.map(item => <tr key={item.id}><td><Link href={`/admin/productos/${item.id}/edit`}>{item.name}</Link></td><td>{number(item.consultations)}</td><td>{number(item.views)}</td></tr>)}</tbody></table></div> : <div className="admin-empty"><MessageCircle size={28} aria-hidden="true" /><strong>Las primeras consultas aparecerán acá</strong><p>Cuando alguien consulte una pieza desde la tienda, podrás ver cuáles generan más interés.</p><a href="/catalogo" target="_blank" rel="noopener noreferrer">Ver catálogo <ArrowUpRight size={14} aria-hidden="true" /></a></div>}
   </section>
   <section className="admin-panel"><div className="flex items-center justify-between gap-3"><h2>Visitantes recientes</h2><Link href="/admin/estadisticas" className="flex items-center gap-1 text-xs text-rust"><span className="hidden sm:inline">Ver estadísticas</span><ArrowUpRight size={16} aria-hidden="true" /></Link></div><p>Sesiones únicas y páginas vistas por día, últimos 30 días.</p>
    {dailyVisits.length ? <LineChart
     ariaLabel="Visitantes y páginas vistas por día"
     labels={dailyVisits.map(day => day.visit_date)}
     formatLabel={shortDate}
     formatValue={number}
     series={[
      { key: 'visitors', label: 'Visitantes', color: CHART_COLORS[0], data: dailyVisits.map(day => Number(day.visitors)) },
      { key: 'page_views', label: 'Páginas vistas', color: CHART_COLORS[1], data: dailyVisits.map(day => Number(day.page_views)) },
     ]}
    /> : <div className="admin-empty"><ChartNoAxesCombined size={30} aria-hidden="true" /><strong>La actividad empieza con una visita</strong><p>Acá vas a ver cómo se mueve tu tienda. Tus visitas como administrador no se cuentan.</p></div>}
   </section>
  </div>
 </AdminLayout>;
}
