import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Check, Plus } from 'lucide-react';
import { stockLabels } from '../catalog';
import '../../css/product-card.css';

const ProductCard = forwardRef(function ProductCard({ product, money, index = 0, onView, onAdd }, ref) {
 const reduced = useReducedMotion();
 const [added, setAdded] = useState(false);
 const timeout = useRef(null);
 useEffect(() => () => clearTimeout(timeout.current), []);
 const discount = product.compareAtPrice > product.price ? Math.round((1 - product.price / product.compareAtPrice) * 100) : null;
 const handleAdd = () => {
  if (product.stockStatus === 'out') return;
  onAdd(product); setAdded(true); clearTimeout(timeout.current);
  timeout.current = setTimeout(() => setAdded(false), 1400);
 };
 return <motion.article ref={ref} layout={reduced ? false : 'position'} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .25, delay: reduced ? 0 : Math.min(index, 5) * .04 }} className="piece-card">
  <button className="piece-card-image" onClick={() => onView(product)} aria-label={`Ver ${product.name}`}>
   <img src={product.image} alt={product.name} loading="lazy" />
   {(product.tag || discount) && <span className="piece-card-badges">{product.tag && <span>{product.tag}</span>}{discount && <span className="piece-card-discount">-{discount}%</span>}</span>}
  </button>
  <div className="piece-card-copy">
   <span className="piece-card-category">{product.category}</span>
   <button className="piece-card-title" onClick={() => onView(product)}><h3>{product.name}</h3></button>
   <div className="piece-card-price"><strong>{money(product.price)}</strong>{discount && <del>{money(product.compareAtPrice)}</del>}</div>
   <span className={`piece-card-stock ${product.stockStatus === 'out' ? 'is-out' : ''}`}>{stockLabels[product.stockStatus] || stockLabels.ask}</span>
   {product.isDemo && <span className="piece-card-demo">Datos de muestra</span>}
   <div className="piece-card-actions">
    <button className="piece-card-detail" onClick={() => onView(product)}>Ver pieza</button>
    <button className="piece-card-add" onClick={handleAdd} disabled={product.stockStatus === 'out'} aria-label={added ? `${product.name} agregado al pedido` : `Agregar ${product.name} al pedido`} aria-live="polite">{added ? <Check size={15} aria-hidden="true" /> : <Plus size={15} aria-hidden="true" />}<span>{added ? 'Agregado' : product.stockStatus === 'out' ? 'Sin stock' : 'Agregar'}</span></button>
   </div>
  </div>
 </motion.article>;
});
export default ProductCard;
