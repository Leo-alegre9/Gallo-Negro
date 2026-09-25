import React from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { LayoutDashboard, Package, Tags, History, ExternalLink, LogOut, CheckCircle2, ShieldCheck, ChartNoAxesCombined } from 'lucide-react';
import '../../css/admin.css';

const links = [
 { href: '/admin', label: 'Resumen', icon: LayoutDashboard },
 { href: '/admin/productos', label: 'Productos', icon: Package },
 { href: '/admin/categorias', label: 'Categorías', icon: Tags },
 { href: '/admin/estadisticas', label: 'Estadísticas', icon: ChartNoAxesCombined },
 { href: '/admin/auditoria', label: 'Auditoría', icon: History },
];
const descriptions = {
 '/admin': 'Una mirada al catálogo y a la actividad de tu tienda.',
 '/admin/productos': 'Administrá las piezas que tus clientes encuentran en el catálogo.',
 '/admin/categorias': 'Organizá tus productos para que sea más fácil encontrarlos.',
 '/admin/estadisticas': 'Métricas de visitas, consultas y actividad del equipo.',
 '/admin/auditoria': 'El historial de cambios del equipo, en un solo lugar.',
};

export default function AdminLayout({ title, children, actions }) {
 const { auth, flash, errors } = usePage().props;
 const path = usePage().url.split('?')[0];
 const current = links.find(link => path === link.href || (link.href !== '/admin' && path.startsWith(`${link.href}/`)));
 const initials = (auth?.user?.name || 'GN').split(' ').slice(0, 2).map(word => word[0]).join('');

 return <div className="admin-app lg:pl-[248px]">
  <Head title={`${title} — Administración Gallo Negro`} />
  <a className="skip-link" href="#admin-content">Ir al contenido</a>
  <aside className="admin-sidebar lg:fixed lg:inset-y-0 lg:left-0 lg:w-[248px]">
   <Link href="/admin" className="flex items-center gap-3 px-5 py-5 lg:px-6 lg:py-8">
    <img src="/images/logo.png" alt="" className="size-11 rounded-full border border-white/20" />
    <span className="font-display text-[27px] font-semibold leading-none text-[#fff8ed]">GALLO NEGRO<small className="mt-2 block font-sans text-[11px] font-normal text-[#b6beb6]">Administración del taller</small></span>
   </Link>
   <nav aria-label="Administración" className="grid grid-cols-5 gap-1 px-3 pb-3 lg:flex lg:flex-col lg:px-4 lg:py-4">
    {links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} aria-current={current?.href === href ? 'page' : undefined} className={`admin-side-link ${current?.href === href ? 'is-current' : ''}`}><Icon size={18} aria-hidden="true" /><span>{label}</span></Link>)}
   </nav>
   <div className="mt-auto hidden px-6 pb-7 lg:block">
    <div className="mb-5 flex gap-3 border-t border-white/15 pt-5 text-xs leading-relaxed text-[#b6beb6]"><ShieldCheck size={19} aria-hidden="true" /><p>Los cambios del equipo quedan registrados en Auditoría.</p></div>
    <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-sm text-[#eed1a9]">Ver tienda <ExternalLink size={16} aria-hidden="true" /></a>
   </div>
  </aside>
  <header className="flex min-h-[76px] items-center justify-between gap-4 border-b border-[#dfdfd6] bg-white/80 px-5 sm:px-8 lg:px-10">
   <span className="hidden text-xs text-[#626b60] sm:block">Panel de administración <span className="mx-2 text-[#bcc2b9]">/</span> <span className="font-medium text-iron">{current?.label}</span></span>
   <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs lg:hidden">Ver tienda <ExternalLink size={14} aria-hidden="true" /></a>
   <div className="ml-auto flex items-center gap-3">
    <span className="grid size-9 place-items-center rounded-full bg-[#e9ece3] text-xs font-semibold text-[#46533e]" aria-hidden="true">{initials}</span>
    <div className="hidden sm:block"><p className="text-xs font-semibold">{auth?.user?.name}</p><p className="mt-1 text-[11px] text-[#626b60]">Administrador</p></div>
    <button type="button" className="admin-logout" onClick={() => router.post('/admin/logout')}><LogOut size={16} aria-hidden="true" /><span>Cerrar sesión</span></button>
   </div>
  </header>
  <main id="admin-content" className="mx-auto max-w-[1550px] px-5 py-7 sm:px-8 lg:px-10 lg:py-10">
   <div className="admin-page-heading"><div><h1>{title}</h1>{descriptions[path] && <p className="mt-3 max-w-[65ch] text-[13px] leading-relaxed text-[#626b60]">{descriptions[path]}</p>}</div>{actions}</div>
   {flash?.success && <p className="admin-success flex items-center gap-3" role="status"><CheckCircle2 size={19} aria-hidden="true" />{flash.success}</p>}
   {Object.keys(errors || {}).length > 0 && <div className="admin-errors" role="alert">{Object.values(errors).map((error, index) => <p key={index}>{error}</p>)}</div>}
   {children}
   <footer className="mt-12 flex flex-wrap justify-between gap-2 border-t border-[#dfdfd6] pt-5 text-[11px] text-[#677061]"><span>Gallo Negro · Gestión del taller</span><span>Catálogo, consultas y equipo</span></footer>
  </main>
 </div>;
}
