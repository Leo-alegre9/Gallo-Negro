import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Check, ChevronLeft, ChevronRight, Plus, ZoomIn } from 'lucide-react';
import ProductPhotoLightbox from './ProductPhotoLightbox';
import { stockLabels } from '../catalog';
import '../../css/featured-product-viewer.css';

export default function FeaturedProductViewer({ product, money, onView, onAdd }) {
 const [zoomOpen, setZoomOpen] = useState(false);
 const [imageIndex, setImageIndex] = useState(0);
 const [added, setAdded] = useState(false);
 const timer = useRef(null);
 const images = [...new Set([product.image, ...(product.images || [])].filter(Boolean))];
 useEffect(() => () => clearTimeout(timer.current), []);
 const add = () => {
  onAdd(product); setAdded(true); clearTimeout(timer.current);
  timer.current = setTimeout(() => setAdded(false), 1400);
 };
 const next = step => setImageIndex(value => (value + step + images.length) % images.length);
 return <><article className="featured-viewer-card">
  <div className="featured-viewer-stage">
   <button className="featured-viewer-photo" onClick={() => setZoomOpen(true)} aria-label={`Ampliar fotos de ${product.name}`}><img src={images[imageIndex]} alt={product.name} loading="lazy" /><span className="featured-viewer-zoom"><ZoomIn size={17} aria-hidden="true" /> Ampliar</span></button>
   {product.tag && <span className="featured-viewer-tag">{product.tag}</span>}
   {images.length > 1 && <div className="featured-viewer-gallery"><button onClick={() => next(-1)} aria-label={`Foto anterior de ${product.name}`}><ChevronLeft size={17} /></button><span>{imageIndex + 1} / {images.length}</span><button onClick={() => next(1)} aria-label={`Foto siguiente de ${product.name}`}><ChevronRight size={17} /></button></div>}
  </div>
  <div className="featured-viewer-info">
   <span className="featured-viewer-category">{product.category}</span>
   <button className="featured-viewer-title" onClick={() => onView(product)}><h3>{product.name}</h3><ArrowUpRight size={18} aria-hidden="true" /></button>
   <div className="featured-viewer-bottom"><div><strong>{money(product.price)}</strong><span>{stockLabels[product.stockStatus] || stockLabels.ask}</span></div><button className="featured-viewer-add" onClick={add} disabled={product.stockStatus === 'out'} aria-label={`Agregar ${product.name} al pedido`} aria-live="polite">{added ? <Check size={17} /> : <Plus size={17} />}{added ? 'Agregado' : 'Agregar'}</button></div>
  </div>
 </article>{zoomOpen && <ProductPhotoLightbox product={product} images={images} initialIndex={imageIndex} onClose={() => setZoomOpen(false)} />}</>;
}
