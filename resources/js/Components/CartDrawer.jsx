import Button from './Button';
import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ShoppingBag, Flame, Plus, Minus, X, MessageCircle } from 'lucide-react';
import Modal from './Modal';
import { orderMessage } from '../cart';

export default function CartDrawer({ items, count, total, message, whatsapp, money, quantity, remove, onClose, emptyCtaLabel, onEmptyCta }) {
 const reduced = useReducedMotion();
 const [preview, setPreview] = useState(false);
 const [note, setNote] = useState('');
 const token = usePage().props.csrfToken;
 return <Modal title="Tu pedido" onClose={onClose} drawer>
  <div className="cart-head"><ShoppingBag size={25} /><h2>Tu pedido</h2><p>{count} {count === 1 ? 'pieza elegida' : 'piezas elegidas'}</p></div>
  {!items.length ? <div className="empty-state"><Flame size={42} strokeWidth={1.3} /><h3>Todo empieza con una chispa.</h3><p>Sumá tu primera pieza y armemos tu próximo encuentro.</p><Button className="mt-5 w-full" onClick={onEmptyCta}>{emptyCtaLabel}</Button></div> : <>
   <motion.div layout className="cart-items"><AnimatePresence initial={false}>{items.map(p => <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }} transition={{ duration: reduced ? 0 : 0.2 }} className="cart-item" key={p.id}><img src={p.image} alt={p.name} /><div><h3>{p.name}</h3><span>{money(p.price)}</span><div className="quantity"><button aria-label={`Restar ${p.name}`} onClick={() => quantity(p.id, -1)}><Minus size={14} /></button><span>{p.quantity}</span><button disabled={p.quantity >= 99} aria-label={`Sumar ${p.name}`} onClick={() => quantity(p.id, 1)}><Plus size={14} /></button></div></div><button className="remove" aria-label={`Quitar ${p.name}`} onClick={() => remove(p.id)}><X size={17} /></button></motion.div>)}</AnimatePresence></motion.div>
   <div className="cart-total"><span>Total estimado</span><strong>{money(total)}</strong></div>
   <p className="cart-help">Entrega a coordinar. Confirmamos disponibilidad y precio final al conversar.</p>
   <form action="/consultas/pedido" method="post" target="_blank" className="cart-inquiry-form">
    <input type="hidden" name="_token" value={token} />
    <input type="hidden" name="items" value={JSON.stringify(items.map(item => ({ id: item.id, quantity: item.quantity })))} />
    <label htmlFor="cart-note">¿Buscás algo específico? <span>Opcional</span></label>
    <textarea id="cart-note" name="note" maxLength={500} rows={3} placeholder="Agregá un mensaje para el taller" value={note} onChange={event => setNote(event.target.value)} />
    <Button type="submit" className="w-full"><MessageCircle size={20} />Consultar pedido por WhatsApp</Button>
   </form>
   <button className="continue-button" onClick={() => setPreview(!preview)}>{preview ? 'Ocultar mensaje' : 'Ver mensaje para WhatsApp'}</button>
   <AnimatePresence>{preview && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: reduced ? 0 : 0.25 }} className="message-preview"><h3>Así llegará tu consulta</h3><pre>{orderMessage(items, money, note)}</pre></motion.div>}</AnimatePresence>
   <button className="continue-button" onClick={onClose}>Seguir explorando</button>
  </>}
 </Modal>;
}
