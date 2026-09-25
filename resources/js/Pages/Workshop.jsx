import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { MotionConfig } from 'motion/react';
import { Reveal } from '../Components/Effects';
import CartDrawer from '../Components/CartDrawer';
import Footer from '../Components/Footer';
import Navbar from '../Components/Navbar';
import Button from '../Components/Button';
import { ArrowUpRight, Check, Hammer, Ruler, ShieldCheck } from 'lucide-react';
import { money } from '../data/products';
import { useCart } from '../hooks/useCart';
import '../../css/workshop-page.css';

const img = name => `/images/${encodeURIComponent(name)}`;

export default function Workshop({ whatsapp, products = [] }) {
 const [cartOpen, setCartOpen] = useState(false);
 const { items, count, total, message, notice, setNotice, add, quantity, remove } = useCart(products, money);
 const closeCart = () => setCartOpen(false);
 return <MotionConfig reducedMotion="user">
  <Head title="Gallo Negro — Nuestro taller" />
  <a className="skip-link" href="#contenido">Ir al contenido</a>
  <div className="catalog-surface">
   <Navbar whatsapp={whatsapp} count={count} onOpenCart={() => setCartOpen(true)} />
   <main id="contenido">
    <section className="workshop-page shell">
     <Reveal className="section-heading catalog-spotlight-heading">
      <div>
       <p className="section-intro catalog-spotlight-eyebrow"><Hammer size={13} aria-hidden="true" /> Nuestro taller</p>
       <h2>El oficio se nota.<br />El fuego se siente.</h2>
      </div>
      <p>Gallo Negro<br />Herrería para compartir el fuego.</p>
     </Reveal>
     <div className="workshop-page-story">
      <div>
       <h3>Nuestra historia</h3>
       <p>Gallo Negro nació como un proyecto familiar con una idea: crear productos para cocinar carnes y compartir al aire libre. En nuestros 8 años de experiencia, el taller creció y sumamos muebles y artículos de decoración.</p>
      </div>
      <div>
       <h3>Nuestra misión</h3>
       <p>Hacemos fogoneros, parrillas y otros productos de herrería que combinan diseño, funcionalidad y resistencia. Buscamos que cada pieza responda a las necesidades de quien la elige y dure en el tiempo.</p>
      </div>
     </div>
     <div className="workshop-page-values">
      <h3>Lo que nos define</h3>
      <div className="workshop-page-value-grid">
       <div><Hammer size={22} aria-hidden="true" /><h4>Trabajo artesanal</h4><p>Fabricamos cada producto con cuidado en los detalles.</p></div>
       <div><ShieldCheck size={22} aria-hidden="true" /><h4>Calidad y resistencia</h4><p>Elegimos materiales de calidad para lograr durabilidad y buen rendimiento.</p></div>
       <div><Ruler size={22} aria-hidden="true" /><h4>Hecho a medida</h4><p>Desarrollamos soluciones personalizadas para cada cliente.</p></div>
      </div>
     </div>
     <div className="workshop-page-gallery">
      <img src={img('14.jpeg')} alt="Soldando la base de un fogonero en el taller" loading="lazy" />
      <img src={img('17.jpeg')} alt="Terminando una pieza a mano en el taller" loading="lazy" />
      <img src={img('16.jpeg')} alt="Detalle de la placa Gallo Negro sobre una pieza terminada" loading="lazy" />
     </div>
     <div className="workshop-page-cta"><Button href="/catalogo" navigate size="large">Ver catálogo completo <ArrowUpRight size={19} aria-hidden="true" /></Button></div>
    </section>
   </main>
  </div>
  <Footer />
  <div role="status" aria-live="polite" className={notice ? 'toast visible' : 'toast'}>{notice && <><Check size={18} />{notice}<button onClick={() => { setCartOpen(true); setNotice(''); }}>Ver pedido</button></>}</div>
  {cartOpen && <CartDrawer items={items} count={count} total={total} message={message} whatsapp={whatsapp} money={money} quantity={quantity} remove={remove} onClose={closeCart} emptyCtaLabel="Explorar el catálogo" onEmptyCta={() => { closeCart(); router.visit('/catalogo'); }} />}
 </MotionConfig>;
}
