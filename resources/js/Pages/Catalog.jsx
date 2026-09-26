import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from 'motion/react';
import { Reveal, ease } from '../Components/Effects';
import ProductModal from '../Components/ProductModal';
import ProductCard from '../Components/ProductCard';
import GalaxyBackground from '../Components/GalaxyBackground';
import CartDrawer from '../Components/CartDrawer';
import Footer from '../Components/Footer';
import Navbar from '../Components/Navbar';
import Button from '../Components/Button';
import { Check, Flame, Search } from 'lucide-react';
import { money } from '../data/products';
import { recordProductView } from '../catalog';
import { useCart } from '../hooks/useCart';
import '../../css/catalog.css';

export default function Catalog({ whatsapp, products = [], categories = [] }) {
 const reduced = useReducedMotion();
 const [categoryId, setCategoryId] = useState(null);
 const [subcategoryId, setSubcategoryId] = useState(null);
 const [material, setMaterial] = useState('Todos');
 const [search, setSearch] = useState(() => new URLSearchParams(window.location.search).get('buscar') || '');
 const [sort, setSort] = useState('featured');
 const [selected, setSelected] = useState(null);
 const [cartOpen, setCartOpen] = useState(false);
 const { items, count, total, message, notice, setNotice, add, quantity, remove } = useCart(products, money);
 const materials = ['Todos', ...new Set(products.map(product => product.material).filter(Boolean))];
 const subcategories = categories.find(item => item.id === categoryId)?.subcategories || [];
 const filtered = products
  .filter(product => (categoryId === null || product.categoryId === categoryId)
   && (subcategoryId === null || product.subcategoryId === subcategoryId)
   && (material === 'Todos' || product.material === material)
   && `${product.name} ${product.model || ''} ${product.description} ${product.category || ''}`.toLocaleLowerCase('es').includes(search.toLocaleLowerCase('es')))
  .sort((a, b) => sort === 'low' ? a.price - b.price : sort === 'high' ? b.price - a.price : sort === 'name' ? a.name.localeCompare(b.name, 'es') : 0);
 const clearFilters = () => { setSearch(''); setCategoryId(null); setSubcategoryId(null); setMaterial('Todos'); };
 const closeCart = () => setCartOpen(false);
 const viewProduct = product => { setSelected(product); recordProductView(product.id); };

 return <MotionConfig reducedMotion="user">
  <Head title="Gallo Negro — Catálogo completo" />
  <a className="skip-link" href="#contenido">Ir al contenido</a>
  <div className="catalog-surface">
   <GalaxyBackground />
   <Navbar whatsapp={whatsapp} count={count} onOpenCart={() => setCartOpen(true)} />
   <main id="contenido">
    <section className="catalog-page shell section-space">
     <Reveal className="section-heading catalog-spotlight-heading"><div><p className="section-intro catalog-spotlight-eyebrow"><Flame size={13} aria-hidden="true" /> Todas las piezas</p><h2>Catálogo completo.</h2></div><p>Explorá por categoría, material o precio.</p></Reveal>
     <div className="catalog-listing-layout">
     <aside className="catalog-sidebar" aria-label="Filtros del catálogo">
     <h3>Encontrá tu pieza</h3>
      <label className="search"><Search size={17} aria-hidden="true" /><input id="catalog-search" aria-label="Buscar productos" placeholder="Buscá tu próxima pieza" value={search} onChange={event => setSearch(event.target.value)} /></label>
     <div className="catalog-toolbar">
      <div className="filters" aria-label="Categorías">
       {[{ id: null, name: 'Todos' }, ...categories].map(category => {
        const active = categoryId === category.id;
        const countForCategory = category.id === null ? products.length : products.filter(product => product.categoryId === category.id).length;
        return <motion.button whileTap={reduced ? undefined : { scale: .95 }} key={category.id ?? 'all'} aria-pressed={active} className={active ? 'active' : ''} onClick={() => { setCategoryId(category.id); setSubcategoryId(null); }}>
         {active && <motion.span className="filter-highlight" layoutId="active-category-page" transition={{ duration: reduced ? 0 : .3, ease }} />}
         <span className="filter-label">{category.name} <span className="opacity-60">({countForCategory})</span></span>
        </motion.button>;
       })}
      </div>
     </div>
     <button className="catalog-reset" onClick={clearFilters}>Limpiar filtros</button>
     </aside>
     <div className="catalog-results">
     <div className="catalog-meta">
      <span><AnimatePresence mode="wait" initial={false}><motion.span key={filtered.length} initial={reduced ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: reduced ? 0 : .2 }} className="inline-block font-semibold text-white">{filtered.length}</motion.span></AnimatePresence> piezas para disfrutar</span>
      {subcategories.length > 0 && <label>Subcategoría <select aria-label="Filtrar por subcategoría" value={subcategoryId ?? ''} onChange={event => setSubcategoryId(event.target.value ? Number(event.target.value) : null)}><option value="">Todas</option>{subcategories.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>}
      <label>Material <select aria-label="Filtrar por material" value={material} onChange={event => setMaterial(event.target.value)}>{materials.map(item => <option key={item} value={item}>{item}</option>)}</select></label>
      <label>Ordenar por <select aria-label="Ordenar productos" value={sort} onChange={event => setSort(event.target.value)}><option value="featured">Destacados</option><option value="name">Nombre A-Z</option><option value="low">Menor precio</option><option value="high">Mayor precio</option></select></label>
     </div>
     <motion.div layout className="product-grid"><AnimatePresence initial={false} mode="popLayout">{filtered.map(product => <ProductCard key={product.id} product={product} money={money} onView={viewProduct} onAdd={add} />)}</AnimatePresence></motion.div>
     {!filtered.length && <div className="empty-state"><Search size={30} /><h3>No encontramos esa pieza</h3><p>Probá otro nombre o explorá todas las categorías.</p><Button onClick={clearFilters}>Ver todas las piezas</Button></div>}
     </div>
     </div>
     {products.some(product => product.isDemo) && <p className="demo-note">Los productos marcados como muestra tienen datos ilustrativos hasta que se carguen los definitivos.</p>}
    </section>
   </main>
  </div>
  <Footer />
  <div role="status" aria-live="polite" className={notice ? 'toast visible' : 'toast'}>{notice && <><Check size={18} />{notice}<button onClick={() => { setSelected(null); setCartOpen(true); setNotice(''); }}>Ver pedido</button></>}</div>
  {selected && <ProductModal product={selected} money={money} onClose={() => setSelected(null)} onAdd={add} />}
  {cartOpen && <CartDrawer items={items} count={count} total={total} message={message} whatsapp={whatsapp} money={money} quantity={quantity} remove={remove} onClose={closeCart} emptyCtaLabel="Ver todas las piezas" onEmptyCta={() => { closeCart(); clearFilters(); }} />}
 </MotionConfig>;
}
