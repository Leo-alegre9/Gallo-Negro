import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function ProductGallery({ product }) {
 const reduced = useReducedMotion();
 const [index, setIndex] = useState(0);
 const images = product.images?.length ? product.images : [product.image];
 const current = images[index];
 const previous = () => setIndex(value => (value - 1 + images.length) % images.length);
 const next = () => setIndex(value => (value + 1) % images.length);
 useEffect(() => {
  const onKey = event => { if (event.key === 'ArrowLeft') previous(); if (event.key === 'ArrowRight') next(); };
  window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
 }, [images.length]);
 return <div className="product-gallery">
  <div className="gallery-stage"><AnimatePresence mode="wait" initial={false}><motion.img key={current} src={current} alt={`${product.name}, imagen ${index + 1} de ${images.length}`} initial={reduced ? false : { opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: reduced ? 0 : .28 }} /></AnimatePresence><div className="gallery-count">0{index + 1} <span>/ 0{images.length}</span></div>{images.length > 1 && <><button className="gallery-arrow gallery-prev" onClick={previous} aria-label="Imagen anterior"><ArrowLeft /></button><button className="gallery-arrow gallery-next" onClick={next} aria-label="Imagen siguiente"><ArrowRight /></button></>}</div>
  <div className="gallery-thumbs" role="tablist" aria-label={`Imágenes de ${product.name}`}>{images.map((image, i) => <button role="tab" aria-selected={i === index} className={i === index ? 'active' : ''} key={image} onClick={() => setIndex(i)}><img src={image} alt="" /></button>)}</div>
 </div>;
}
