import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Check, Eye, ShoppingBag } from 'lucide-react';
import { ease } from './Effects';
import Button from './Button';
import { stockLabels } from '../catalog';

const ProductCard = forwardRef(function ProductCard({ product, money, index = 0, onView, onAdd }, ref) {
 const reduced = useReducedMotion();
 const [added, setAdded] = useState(false);
 const [revealed, setRevealed] = useState(false);
 const canHover = useRef(typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches).current;
 const timeout = useRef(null);
 useEffect(() => () => window.clearTimeout(timeout.current), []);
 const discount = product.compareAtPrice && product.compareAtPrice > product.price
  ? Math.round((1 - product.price / product.compareAtPrice) * 100)
  : null;
 const handleAdd = () => {
  if (product.stockStatus === 'out') return;
  onAdd(product);
  setAdded(true);
  window.clearTimeout(timeout.current);
  timeout.current = window.setTimeout(() => setAdded(false), 1400);
 };
 const openOrReveal = () => {
  if (!canHover && !revealed) { setRevealed(true); return; }
  onView(product);
 };
 const revealClass = revealed ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none';
 return (
  <motion.article
   ref={ref}
   layout={reduced ? false : 'position'}
   initial={reduced ? false : { opacity: 0, y: 26 }}
   animate={{ opacity: 1, y: 0 }}
   exit={{ opacity: 0 }}
   transition={{ duration: reduced ? 0 : .55, delay: reduced ? 0 : Math.min(index, 6) * .07, ease }}
   className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] transition-all duration-300 hover:-translate-y-1.5 hover:border-white/25 hover:bg-white/[0.08] hover:shadow-[0_28px_60px_-24px_rgba(0,0,0,0.65)]"
  >
   <div className="pointer-events-none absolute inset-x-4 top-4 z-10 flex items-start justify-between gap-2">
    {product.tag ? <span className="inline-flex items-center rounded-full bg-rust px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#fff8ed] shadow-[0_6px_16px_-4px_rgba(152,72,41,0.75)]">{product.tag}</span> : <span />}
    {discount && <motion.span animate={reduced ? undefined : { scale: [1, 1.08, 1] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }} className="grid size-11 place-items-center rounded-full bg-[#e0503a] text-[11px] font-bold leading-none text-white shadow-[0_6px_16px_-4px_rgba(224,80,58,0.8)]">-{discount}%</motion.span>}
   </div>
   <button className="relative block aspect-[4/5] w-full overflow-hidden bg-[#e8e1d5]" onClick={openOrReveal} aria-label={`Ver ${product.name}`}>
    <img src={product.image} alt={product.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]" />
    <span className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent transition-opacity duration-300 group-hover:opacity-100 ${revealed ? 'opacity-100' : 'opacity-0'}`} />
    <span className={`pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 px-4 py-3.5 text-[12px] font-medium text-white transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 ${revealed ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
     Ver la pieza <ArrowUpRight size={14} aria-hidden="true" />
    </span>
   </button>
   <div className="flex flex-1 flex-col gap-1 p-5">
    <span className="text-[10px] font-medium uppercase tracking-wider text-white/50">{product.category}{product.subcategory ? ` · ${product.subcategory}` : ''}</span>
    <button className="text-left" onClick={() => onView(product)}>
     <h3 className="font-display text-[24px] font-semibold leading-tight text-white transition-colors group-hover:text-[#ffb992]">{product.name}</h3>
    </button>
    <div className="mt-3 flex items-baseline gap-2">
     {discount && <span className="text-[13px] text-white/40 line-through">{money(product.compareAtPrice)}</span>}
     <strong className="text-[17px] font-medium text-white">{money(product.price)}</strong>
    </div>
    <span className={`mt-1 text-[11px] ${product.stockStatus === 'out' ? 'text-[#f19b89]' : 'text-[#c8bd9e]'}`}>{stockLabels[product.stockStatus] || stockLabels.ask}</span>
    {product.isDemo && <span className="text-[10px] text-white/50">Datos de muestra</span>}
    <div className={`mt-4 flex items-center gap-2 border-t border-white/10 pt-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto ${revealClass}`}>
     <Button className={`flex-1 overflow-hidden ${added ? 'bg-[#3f7a4d]! border-[#3f7a4d]!' : ''}`} onClick={handleAdd} disabled={product.stockStatus === 'out'} aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
       {added
        ? <motion.span key="added" initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: reduced ? 0 : .2 }} className="inline-flex items-center gap-2"><Check size={16} aria-hidden="true" /> Agregado</motion.span>
        : <motion.span key="idle" initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: reduced ? 0 : .2 }} className="inline-flex items-center gap-2"><ShoppingBag size={16} aria-hidden="true" /> {product.stockStatus === 'out' ? 'Sin stock' : 'Agregar'}</motion.span>}
      </AnimatePresence>
     </Button>
     <Button variant="glass" size="compact" onClick={() => onView(product)} aria-label={`Ver ${product.name}`}><Eye size={16} aria-hidden="true" /> Ver</Button>
    </div>
   </div>
  </motion.article>
 );
});
export default ProductCard;
