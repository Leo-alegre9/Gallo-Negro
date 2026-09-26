import React, { useEffect, useRef, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import Button from './Button';
import WhatsAppButton from './WhatsAppButton';
import '../../css/navbar.css';

export default function Navbar({ count, onOpenCart, whatsapp, home = false }) {
 const { url } = usePage();
 const pathname = url.split(/[?#]/)[0];
 const [hash, setHash] = useState(() => window.location.hash);
 const [scrolled, setScrolled] = useState(false);
 const [panel, setPanel] = useState(null);
 const [mobileOpen, setMobileOpen] = useState(false);
 const [query, setQuery] = useState('');
 const [height, setHeight] = useState(null);
 const header = useRef(null);
 const searchInput = useRef(null);
 const searchTrigger = useRef(null);

 const menuTrigger = useRef(null);
 const catalogActive = pathname === '/catalogo' || pathname.startsWith('/productos/') || (home && hash === '#catalogo');
 const workshopActive = pathname === '/taller' || (home && hash === '#taller');
 const visitActive = home && hash === '#contacto';
 const moreActive = home && hash === '#como-comprar';

 useEffect(() => {
  const syncHash = () => setHash(window.location.hash);
  syncHash();
  window.addEventListener('hashchange', syncHash);
  return () => window.removeEventListener('hashchange', syncHash);
 }, [url]);

 useEffect(() => {
  const update = () => setScrolled(window.scrollY > 32);
  update();
  window.addEventListener('scroll', update, { passive: true });
  return () => window.removeEventListener('scroll', update);
 }, []);
 useEffect(() => {
  const element = header.current;
  const update = () => {
   const measured = Math.ceil(element.getBoundingClientRect().bottom);
   document.documentElement.style.setProperty('--navigation-offset', `${measured + 28}px`);
   // Reserve the expanded height so shrinking the fixed header never moves the page.
   if (!scrolled) setHeight(Math.ceil(element.querySelector('.navbar-layout').getBoundingClientRect().bottom) + 20);
  };
  const observer = new ResizeObserver(update);
  observer.observe(element); update();
  return () => observer.disconnect();
 }, [scrolled]);
 useEffect(() => {
  if (!panel && !mobileOpen) return;
  if (panel === 'search') searchInput.current?.focus();
  const dismiss = event => {
   if (event.type === 'keydown' && event.key === 'Escape') {
    const returnTo = mobileOpen ? menuTrigger : searchTrigger;
    setPanel(null); setMobileOpen(false);
    returnTo.current?.focus();
   }
   if (event.type === 'pointerdown' && !header.current?.contains(event.target)) { setPanel(null); setMobileOpen(false); }
  };
  document.addEventListener('pointerdown', dismiss);
  document.addEventListener('keydown', dismiss);
  return () => { document.removeEventListener('pointerdown', dismiss); document.removeEventListener('keydown', dismiss); };
 }, [panel, mobileOpen]);
 useEffect(() => {
  const desktop = window.matchMedia('(min-width: 1024px)');
  const collapse = () => { if (desktop.matches) { setMobileOpen(false); setPanel(null); } };
  desktop.addEventListener('change', collapse);
  return () => desktop.removeEventListener('change', collapse);
 }, []);
 const close = () => { setPanel(null); setMobileOpen(false); };
 const openCart = () => { close(); onOpenCart(); };
 const submitSearch = event => {
  event.preventDefault();
  close();
  router.get('/catalogo', query.trim() ? { buscar: query.trim() } : {}, {
   onSuccess: () => document.getElementById('catalog-search')?.focus({ preventScroll: true }),
  });
 };
 return <>
  {!home && <div className="navbar-spacer" style={height ? { height } : undefined} aria-hidden="true" />}
  <header ref={header} data-scrolled={scrolled} className={`site-navigation ${home ? 'site-navigation-home' : ''} ${scrolled ? 'is-scrolled' : ''} ${mobileOpen ? 'is-menu-open' : ''}`} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) close(); }}>
   <div className="shell navbar-layout">
    <Link href="/" aria-label="Gallo Negro, inicio" className="navbar-logo" onClick={close}>
     <img src="/images/logo.png" alt="" width="52" height="52" />
     <span>GALLO NEGRO</span>
    </Link>
    <nav id="primary-navigation" aria-label="Principal" className="navbar-links">
     <Link className="navbar-link" href="/catalogo" aria-current={catalogActive ? 'page' : undefined} onClick={close}>Catálogo</Link>
     <Link className="navbar-link" href="/taller" aria-current={workshopActive ? 'page' : undefined} onClick={close}>Nuestro taller</Link>
     <a className="navbar-link" href={`${home ? '' : '/'}#contacto`} aria-current={visitActive ? 'location' : undefined} onClick={close}>Contactanos</a>
     <a className="navbar-link" href={`${home ? '' : '/'}#como-comprar`} aria-current={moreActive ? 'location' : undefined} onClick={close}>Cómo comprar</a>
    </nav>
    <div className="navbar-actions">
     <Button ref={searchTrigger} variant="glass" size="icon" className="navbar-search-trigger" aria-label="Buscar en el catálogo" aria-expanded={panel === 'search'} aria-controls="navbar-search-panel" onClick={() => setPanel(panel === 'search' ? null : 'search')}><Search size={19} aria-hidden="true" /></Button>
     <Button variant="glass" size="compact" className="navbar-order" onClick={openCart} aria-label={`Abrir pedido, ${count} productos`}><ShoppingBag size={18} aria-hidden="true" /><span className="navbar-order-label">Tu pedido</span><span className="navbar-count">{count}</span></Button>
     <Button ref={menuTrigger} variant="glass" size="icon" className="navbar-menu-trigger" aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={mobileOpen} aria-controls="navbar-mobile-panel" onClick={() => { setPanel(null); setMobileOpen(!mobileOpen); }}>{mobileOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}</Button>
    </div>
    {panel === 'search' && <div id="navbar-search-panel" className="navbar-popover navbar-search-panel">
     <form role="search" onSubmit={submitSearch}>
      <label htmlFor="navbar-search-input">¿Qué pieza estás buscando?</label>
      <div className="navbar-search-field"><Search size={18} aria-hidden="true" /><input ref={searchInput} id="navbar-search-input" type="search" placeholder="Fogoneros, parrillas, estufas…" value={query} onChange={event => setQuery(event.target.value)} /><button type="submit">Buscar</button></div>
     </form>
     <button className="navbar-search-close" type="button" aria-label="Cerrar búsqueda" onClick={() => { close(); searchTrigger.current?.focus(); }}><X size={18} /></button>
    </div>}
   </div>
   {mobileOpen && <div id="navbar-mobile-panel" className="navbar-mobile-panel">
    <form role="search" className="navbar-mobile-search" onSubmit={submitSearch}>
     <Search size={18} aria-hidden="true" />
     <input aria-label="Buscá tu próxima pieza" type="search" placeholder="Buscá tu próxima pieza" value={query} onChange={event => setQuery(event.target.value)} />
     <button type="submit">Buscar</button>
    </form>
    <nav aria-label="Principal" className="navbar-mobile-links">
     <Link href="/catalogo" aria-current={catalogActive ? 'page' : undefined} onClick={close}>Catálogo</Link>
     <Link href="/taller" aria-current={workshopActive ? 'page' : undefined} onClick={close}>Nuestro taller</Link>
     <a href={`${home ? '' : '/'}#contacto`} aria-current={visitActive ? 'location' : undefined} onClick={close}>Contactanos</a>
     {!home && <Link href="/" onClick={close}>Inicio</Link>}
     <a href={`${home ? '' : '/'}#como-comprar`} aria-current={moreActive ? 'location' : undefined} onClick={close}>Cómo comprar</a>
    </nav>
   </div>}
  </header>
  <WhatsAppButton number={whatsapp} floating onOpenCart={onOpenCart} />
 </>;
}
