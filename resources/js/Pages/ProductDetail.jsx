import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { MotionConfig } from 'motion/react';
import { ArrowLeft, Check, Plus } from 'lucide-react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import CartDrawer from '../Components/CartDrawer';
import ProductGallery from '../Components/ProductGallery';
import ProductInquiryForm from '../Components/ProductInquiryForm';
import Button from '../Components/Button';
import { money } from '../data/products';
import { stockLabels } from '../catalog';
import { useCart } from '../hooks/useCart';
import '../../css/product-detail.css';

export default function ProductDetail({ product, products = [], whatsapp }) {
 const [cartOpen, setCartOpen] = useState(false);
 const { items, count, total, message, notice, setNotice, add, quantity, remove } = useCart(products, money);
 const closeCart = () => setCartOpen(false);

 return <MotionConfig reducedMotion="user">
  <Head title={`${product.name} — Gallo Negro`}>
   <meta name="description" content={product.description} />
   <meta property="og:title" content={`${product.name} — Gallo Negro`} />
   <meta property="og:description" content={product.description} />
   <meta property="og:image" content={product.absoluteImageUrl} />
   <meta property="og:url" content={product.url} />
  </Head>
  <a className="skip-link" href="#contenido">Ir al contenido</a>
  <div className="catalog-surface">
   <Navbar whatsapp={whatsapp} count={count} onOpenCart={() => setCartOpen(true)} />
   <main id="contenido" className="product-detail-page shell">
    <Link href="/catalogo" className="product-detail-back"><ArrowLeft size={17} aria-hidden="true" /> Volver al catálogo</Link>
    <div className="product-detail-layout">
     <ProductGallery product={product} />
     <div className="product-detail-info">
      <p className="product-detail-category">{product.category}{product.subcategory ? ` / ${product.subcategory}` : ''}</p>
      <h1>{product.name}</h1>
      <p className="product-detail-description">{product.description}</p>
      <dl className="product-detail-specs">
       {product.model && <div><dt>Modelo</dt><dd>{product.model}</dd></div>}
       {product.size && <div><dt>Medidas</dt><dd>{product.size}</dd></div>}
       {product.colorsVariants && <div><dt>Colores o variantes</dt><dd>{product.colorsVariants}</dd></div>}
       {product.material && <div><dt>Material</dt><dd>{product.material}</dd></div>}
       {product.finish && <div><dt>Terminación</dt><dd>{product.finish}</dd></div>}
      </dl>
      <div className="product-detail-price">{product.compareAtPrice && <span>{money(product.compareAtPrice)}</span>}<strong>{money(product.price)}</strong></div>
      <p className="product-detail-stock">{stockLabels[product.stockStatus]}</p>
      {product.isDemo && <p className="product-detail-demo">Datos de muestra hasta cargar la ficha definitiva.</p>}
      <Button className="product-detail-add" onClick={() => add(product)} disabled={product.stockStatus === 'out'}><Plus size={18} aria-hidden="true" /> Agregar a mi pedido</Button>
      <ProductInquiryForm product={product} />
     </div>
    </div>
   </main>
  </div>
  <Footer />
  <div role="status" aria-live="polite" className={notice ? 'toast visible' : 'toast'}>{notice && <><Check size={18} />{notice}<button onClick={() => { setCartOpen(true); setNotice(''); }}>Ver pedido</button></>}</div>
  {cartOpen && <CartDrawer items={items} count={count} total={total} message={message} whatsapp={whatsapp} money={money} quantity={quantity} remove={remove} onClose={closeCart} emptyCtaLabel="Explorar el catálogo" onEmptyCta={() => { closeCart(); router.visit('/catalogo'); }} />}
 </MotionConfig>;
}
