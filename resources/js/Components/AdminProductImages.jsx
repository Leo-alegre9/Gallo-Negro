import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, GripVertical, ImagePlus, X } from 'lucide-react';

function Preview({ file, src, alt, className }) {
 const [url, setUrl] = useState(null);
 useEffect(() => {
  if (!file) { setUrl(null); return; }
  const next = URL.createObjectURL(file);
  setUrl(next);
  return () => URL.revokeObjectURL(next);
 }, [file]);
 return <img src={file ? url || undefined : src} alt={alt} className={className} draggable={false} />;
}

export const savedGallery = product => (product?.images || []).map(image => ({ ...image, key: `saved:${image.id}` }));

export default function AdminProductImages({ product, primary, setPrimary, gallery, setGallery, processing, errors }) {
 const [error, setError] = useState('');
 const [dragged, setDragged] = useState(null);
 const [over, setOver] = useState(null);
 const [announcement, setAnnouncement] = useState('');
 const nextId = useRef(0);
 const primaryInput = useRef(null);
 const validFile = file => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type) && file.size <= 5 * 1024 * 1024;
 const add = event => {
  const files = Array.from(event.target.files || []);
  event.target.value = '';
  if (!files.length) return;
  if (files.some(file => !validFile(file))) { setError('Elegí imágenes JPG, PNG o WebP de hasta 5 MB cada una.'); return; }
  if (gallery.filter(image => image.file).length + files.length > 12) { setError('Podés agregar hasta 12 fotos nuevas antes de guardar. Guardá los cambios y luego agregá más.'); return; }
  setGallery(previous => [...previous, ...files.map(file => ({ key: `new:${nextId.current++}`, file }))]);
  setError('');
  setAnnouncement(`${files.length} fotos agregadas a la galería.`);
 };
 const move = (key, target) => {
  const from = gallery.findIndex(image => image.key === key);
  if (from < 0 || target < 0 || target >= gallery.length || from === target) return;
  const next = [...gallery];
  const [item] = next.splice(from, 1);
  next.splice(target, 0, item);
  setGallery(next);
  setAnnouncement(`Foto movida a la posición ${target + 1}.`);
 };

 return <fieldset className="admin-form-section min-w-0" disabled={processing}>
  <h2>Fotografías</h2>
  <div className="admin-photo-layout">
   <div>
    <label className="admin-field" htmlFor="primary-image"><span>Imagen principal {product ? '' : '*'}</span></label>
    <div className="admin-primary-preview">
     {primary || product?.primary_image_url ? <Preview file={primary} src={product?.primary_image_url} alt="Previsualización de la imagen principal" /> : <div><ImagePlus size={32} aria-hidden="true" /><p>La portada de tu producto</p></div>}
    </div>
    <input ref={primaryInput} id="primary-image" type="file" accept="image/jpeg,image/png,image/webp" required={!product && !primary} onChange={event => {
     const file = event.target.files?.[0];
     if (!file) return;
     if (!validFile(file)) { setError('La imagen principal debe ser JPG, PNG o WebP de hasta 5 MB.'); event.target.value = ''; return; }
     setPrimary(file); setError('');
    }} />
    {primary && <button type="button" className="admin-photo-text-button" onClick={() => { setPrimary(null); primaryInput.current.value = ''; }}>Cancelar cambio de imagen</button>}
    <p className="mt-3 text-xs leading-relaxed text-[#626b60]">JPG, PNG o WebP. Hasta 5 MB por imagen.</p>
    {errors.primary_image && <p className="admin-error">{errors.primary_image}</p>}
   </div>
   <div className="min-w-0">
    <div className="mb-4"><h3 className="text-sm font-semibold">Galería <span className="ml-2 text-[#626b60]">({gallery.length})</span></h3><p id="gallery-help" className="mt-2 text-xs leading-relaxed text-[#626b60]">Arrastrá las fotos para ordenarlas o usá las flechas. Los cambios se aplican al guardar el producto.</p></div>
    <label className="admin-field" htmlFor="gallery-images"><span className="inline-flex items-center gap-2"><ImagePlus size={17} aria-hidden="true" />Agregar fotos a la galería</span></label>
    <input id="gallery-images" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={add} aria-describedby="gallery-help" />
    <p className="mt-2 text-[11px] text-[#626b60]">Podés seleccionar más fotos en varias tandas. Hasta 12 nuevas por guardado.</p>
    {error && <p role="alert" className="admin-error mt-3">{error}</p>}
    {errors.gallery_order && <p className="admin-error">{errors.gallery_order}</p>}
    <ol className="admin-sortable-gallery" aria-label="Fotos de la galería">
     {gallery.map((image, index) => <li key={image.key} data-image-key={image.key} className={`admin-gallery-tile ${over === image.key ? 'is-drag-over' : ''} ${dragged === image.key ? 'is-dragging' : ''}`}
      draggable={!processing} onDragStart={event => { event.dataTransfer.setData('text/plain', image.key); event.dataTransfer.effectAllowed = 'move'; setDragged(image.key); }}
      onDragOver={event => { if (dragged) { event.preventDefault(); event.dataTransfer.dropEffect = 'move'; setOver(image.key); } }}
      onDrop={event => { event.preventDefault(); if (dragged) move(dragged, index); setDragged(null); setOver(null); }}
      onDragEnd={() => { setDragged(null); setOver(null); }}>
      <div className="admin-gallery-tile-heading"><span><GripVertical size={14} aria-hidden="true" />Foto {index + 1}</span>{image.file && <small>Nueva</small>}</div>
      <Preview file={image.file} src={image.url} alt={`Foto ${index + 1} de la galería`} />
      <p className="admin-gallery-filename" title={image.file?.name}>{image.file?.name || 'Foto guardada'}</p>
      <div className="admin-gallery-controls">
       <button type="button" disabled={index === 0 || processing} aria-label={`Mover foto ${index + 1} antes`} onClick={() => move(image.key, index - 1)}><ArrowLeft size={16} aria-hidden="true" /></button>
       <button type="button" disabled={index === gallery.length - 1 || processing} aria-label={`Mover foto ${index + 1} después`} onClick={() => move(image.key, index + 1)}><ArrowRight size={16} aria-hidden="true" /></button>
       <button type="button" aria-label={`Quitar foto ${index + 1}`} onClick={() => { setGallery(previous => previous.filter(item => item.key !== image.key)); setAnnouncement(`Foto ${index + 1} quitada. Guardá para aplicar el cambio.`); }}><X size={16} aria-hidden="true" /></button>
      </div>
     </li>)}
    </ol>
    {!gallery.length && <p className="admin-gallery-placeholder">Agregá otras vistas y detalles de la pieza.</p>}
    <p role="status" aria-live="polite" className="sr-only">{announcement}</p>
   </div>
  </div>
 </fieldset>;
}
