import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { MessageCircle } from 'lucide-react';
import Button from './Button';
import '../../css/product-detail.css';

export default function ProductInquiryForm({ product }) {
 const [note, setNote] = useState('');
 const token = usePage().props.csrfToken;

 return <form action={`/consultas/productos/${encodeURIComponent(product.id)}`} method="post" target="_blank" className="product-inquiry-form">
  <input type="hidden" name="_token" value={token} />
  <label htmlFor={`inquiry-${product.id}`}>¿Buscás algo específico? <span>Opcional</span></label>
  <textarea id={`inquiry-${product.id}`} name="note" maxLength={500} rows={3} value={note} onChange={event => setNote(event.target.value)} placeholder="Contanos qué necesitás" />
  <Button type="submit" className="w-full"><MessageCircle size={19} aria-hidden="true" /> Consultar por WhatsApp</Button>
 </form>;
}
