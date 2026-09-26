import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Minus, Plus, RotateCcw } from 'lucide-react';
import Modal from './Modal';

export default function ProductPhotoLightbox({ product, images, initialIndex = 0, onClose }) {
 const [index, setIndex] = useState(initialIndex);
 const [zoom, setZoom] = useState(1);
 const [offset, setOffset] = useState({ x: 0, y: 0 });
 const drag = useRef(null);
 const reset = () => { setZoom(1); setOffset({ x: 0, y: 0 }); drag.current = null; };
 const select = value => { setIndex((value + images.length) % images.length); reset(); };
 const changeZoom = amount => {
  setZoom(value => Math.max(1, Math.min(3, value + amount)));
  setOffset({ x: 0, y: 0 });
 };
 const move = event => {
  if (!drag.current) return;
  const bounds = event.currentTarget.getBoundingClientRect();
  const limitX = bounds.width * (zoom - 1) / 2;
  const limitY = bounds.height * (zoom - 1) / 2;
  setOffset({ x: Math.max(-limitX, Math.min(limitX, drag.current.x + event.clientX - drag.current.startX)), y: Math.max(-limitY, Math.min(limitY, drag.current.y + event.clientY - drag.current.startY)) });
 };
 return <Modal title={`Fotos de ${product.name}`} onClose={onClose}>
  <div className="photo-lightbox" onKeyDown={event => {
   if (event.key === 'ArrowRight') { event.preventDefault(); select(index + 1); }
   if (event.key === 'ArrowLeft') { event.preventDefault(); select(index - 1); }
  }}>
   <div className="photo-lightbox-heading"><h2>{product.name}</h2><p>Foto {index + 1} de {images.length}</p></div>
   <div className={`photo-lightbox-stage ${zoom > 1 ? 'is-zoomed' : ''}`} onPointerDown={event => {
    if (zoom === 1 || event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { startX: event.clientX, startY: event.clientY, ...offset };
   }} onPointerMove={move} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}>
    <img src={images[index]} alt={`${product.name}, vista ${index + 1}`} draggable="false" style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})` }} />
   </div>
   <div className="photo-lightbox-controls">
    <button onClick={() => select(index - 1)} disabled={images.length < 2} aria-label="Foto anterior"><ChevronLeft size={20} /></button>
    <div><button onClick={() => changeZoom(-.5)} disabled={zoom === 1} aria-label="Alejar foto"><Minus size={18} /></button><span aria-live="polite">{Math.round(zoom * 100)}%</span><button onClick={() => changeZoom(.5)} disabled={zoom === 3} aria-label="Acercar foto"><Plus size={18} /></button><button onClick={reset} aria-label="Restablecer zoom"><RotateCcw size={17} /></button></div>
    <button onClick={() => select(index + 1)} disabled={images.length < 2} aria-label="Foto siguiente"><ChevronRight size={20} /></button>
   </div>
   <p className="photo-lightbox-help">{zoom > 1 ? 'Arrastrá la foto para explorar los detalles.' : 'Acercá la foto para ver los detalles.'}</p>
   {images.length > 1 && <div className="photo-lightbox-thumbs" aria-label="Vistas del producto">{images.map((src, i) => <button key={src} aria-label={`Ver foto ${i + 1}`} aria-pressed={index === i} onClick={() => select(i)}><img src={src} alt="" /></button>)}</div>}
  </div>
 </Modal>;
}
