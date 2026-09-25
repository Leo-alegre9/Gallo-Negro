import React from 'react';
import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import Modal from './Modal';
import ProductGallery from './ProductGallery';
import ProductInquiryForm from './ProductInquiryForm';
import Button from './Button';
import { stockLabels } from '../catalog';

const spec = 'inline-flex items-center rounded-full border border-[#d8cfba] bg-[#f4efe3] px-3.5 py-1.5 text-[11px] text-[#6e6252]';

export default function ProductModal({ product, money, onClose, onAdd }) {
 return <Modal title={product.name} onClose={onClose}><div className="detail-grid"><ProductGallery product={product} /><div className="detail-copy">
  <p className="section-intro">{product.category}{product.subcategory ? ` / ${product.subcategory}` : ''}</p>
  <h2>{product.name}</h2>
  <p className="mt-5 text-[13px] leading-loose text-[#676656]">{product.description}</p>
  <div className="mt-6 flex flex-wrap gap-2">
   {product.model && <span className={spec}>Modelo: {product.model}</span>}
   {product.size && <span className={spec}>{product.size}</span>}
   {product.colorsVariants && <span className={spec}>{product.colorsVariants}</span>}
   {product.material && <span className={spec}>{product.material}</span>}
   {product.finish && <span className={spec}>{product.finish}</span>}
  </div>
  <div className="mt-6 flex items-baseline gap-3">{product.compareAtPrice && <span className="text-sm text-[#8a8378] line-through">{money(product.compareAtPrice)}</span>}<strong className="text-2xl font-medium">{money(product.price)}</strong></div>
  <p className="mt-2 text-xs text-[#675b4b]">{stockLabels[product.stockStatus]}</p>
  {product.isDemo && <p className="demo-note">Datos de muestra hasta cargar la ficha definitiva.</p>}
  <Button className="mt-5 w-full" onClick={() => onAdd(product)} disabled={product.stockStatus === 'out'}>Agregar a mi pedido <Plus size={20} /></Button>
  <ProductInquiryForm product={product} />
  <Link className="text-link mt-5" href={product.url}>Ver ficha completa</Link>
 </div></div></Modal>;
}
