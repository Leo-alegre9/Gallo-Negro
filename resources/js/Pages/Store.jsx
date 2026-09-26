import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { MotionConfig } from 'motion/react';
import { Reveal } from '../Components/Effects';
import HeroScene from '../Components/HeroScene';
import ProductModal from '../Components/ProductModal';
import FeaturedProductViewer from '../Components/FeaturedProductViewer';
import FireBackground from '../Components/FireBackground';
import CartDrawer from '../Components/CartDrawer';
import Footer from '../Components/Footer';
import Navbar from '../Components/Navbar';
import Button from '../Components/Button';
import HowToBuy from '../Components/HowToBuy';
import VisitUs from '../Components/VisitUs';
import { ArrowUpRight, Flame, Hammer, Check } from 'lucide-react';
import { money } from '../data/products';
import { recordProductView } from '../catalog';
import { useCart } from '../hooks/useCart';

const img = name => `/images/${encodeURIComponent(name)}`;
export default function Store({ whatsapp, products = [], featured = [] }) {
 const [selected, setSelected] = useState(null);
 const [cartOpen, setCartOpen] = useState(false);
 const { items, count, total, message, notice, setNotice, add, quantity, remove } = useCart(products, money);
 const closeCart = () => setCartOpen(false);
 return <MotionConfig reducedMotion="user">
  <Head title="Gallo Negro — Hierro, fuego y buenos encuentros" />
  <a className="skip-link" href="#contenido">Ir al contenido</a>
  <main id="contenido"><div className="relative">
  <Navbar whatsapp={whatsapp} count={count} onOpenCart={() => setCartOpen(true)} home />
   <HeroScene /></div>
   <section id="catalogo" className="catalog-spotlight">
    <FireBackground />
    <div className="shell">
     <Reveal className="section-heading catalog-spotlight-heading"><div><p className="section-intro catalog-spotlight-eyebrow"><Flame size={13} aria-hidden="true" /> Los más elegidos</p><h2>Piezas con carácter.</h2></div><p>Para el asado del domingo.<br />Para las noches que se alargan.</p></Reveal>
     <div className="featured-viewer-grid">{featured.map((p, i) => <FeaturedProductViewer key={p.id} product={p} money={money} index={i} onView={product => { setSelected(product); recordProductView(product.id); }} onAdd={add} />)}</div>
     <div className="catalog-spotlight-cta"><Button href="/catalogo" navigate size="large">Ver catálogo completo <ArrowUpRight size={19} aria-hidden="true" /></Button></div>
     <HowToBuy count={count} onOpenCart={() => setCartOpen(true)} />
    </div>
   </section>
   <section id="taller" className="workshop"><div className="shell workshop-grid"><Reveal className="workshop-photos"><img src={img('14.jpeg')} alt="Trabajo artesanal de soldadura en el taller" loading="lazy" /><img src={img('logo.png')} alt="Logo original de Gallo Negro Blacksmith" className="workshop-logo" loading="lazy" /></Reveal><div className="workshop-copy"><span className="workshop-label"><Hammer size={19} /> Nuestro taller</span><Reveal><h2>El oficio se nota.<br />El fuego se siente.</h2></Reveal><p>Gallo Negro nació como un proyecto familiar para crear piezas con las que cocinar y compartir al aire libre. Hoy, con 8 años de experiencia, hacemos fogoneros, parrillas y trabajos de herrería a medida, cuidando cada detalle.</p><Button href="/taller" navigate variant="glass" className="mt-7">Conocé nuestra historia <ArrowUpRight size={21} /></Button><div className="workshop-sign">Gallo Negro <span>Herrería para compartir el fuego.</span></div></div></div></section>
   <VisitUs products={products} />
  </main>
  <Footer home />
  <div role="status" aria-live="polite" className={notice ? 'toast visible' : 'toast'}>{notice && <><Check size={18} />{notice}<button onClick={() => { setSelected(null); setCartOpen(true); setNotice(''); }}>Ver pedido</button></>}</div>
  {selected && <ProductModal product={selected} money={money} onClose={() => setSelected(null)} onAdd={add} />}
  {cartOpen && <CartDrawer items={items} count={count} total={total} message={message} whatsapp={whatsapp} money={money} quantity={quantity} remove={remove} onClose={closeCart} emptyCtaLabel="Explorar el catálogo" onEmptyCta={() => { closeCart(); router.visit('/catalogo'); }} />}
 </MotionConfig>;
}
