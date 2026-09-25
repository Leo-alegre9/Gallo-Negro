import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import '../../css/whatsapp.css';

function WhatsAppIcon() {
 return <svg viewBox="0 0 32 32" width="25" height="25" fill="none" aria-hidden="true"><path d="M26.6 5.4a14 14 0 0 0-22 16.8L2.5 29.5l7.5-2A14 14 0 0 0 26.6 5.4Z" stroke="currentColor" strokeWidth="2.1" strokeLinejoin="round" /><path d="M11.1 8.7c-.3-.7-.6-.7-.9-.7h-.8c-.3 0-.7.1-1 .5-.4.4-1.4 1.4-1.4 3.4s1.5 3.9 1.7 4.2c.2.3 2.9 4.5 7.1 6.1 3.5 1.3 4.2 1 5 .9.8-.1 2.6-1.1 3-2.1.4-1 .4-1.9.3-2.1-.1-.2-.4-.3-.8-.5l-2.8-1.3c-.4-.2-.7-.3-1 .2l-1.3 1.6c-.2.3-.5.3-.9.1-1.2-.5-2.3-1.2-3.3-2.1-.9-.8-1.6-1.8-2.2-2.8-.2-.4 0-.6.2-.8l.6-.7.4-.7c.1-.3.1-.5 0-.7l-1.4-2.5Z" fill="currentColor" /></svg>;
}

export default function WhatsAppButton({ number, floating = false, onOpenCart }) {
 const [unavailable, setUnavailable] = useState(false);
 const valid = /^\d{8,15}$/.test(number || '');
 const className = `whatsapp-access ${floating ? 'whatsapp-floating' : 'whatsapp-navbar'}`;
 const content = <><WhatsAppIcon />{!floating && <span>WhatsApp</span>}</>;
 return <>
  {valid
   ? <a className={className} href={`https://wa.me/${number}?text=${encodeURIComponent('Hola, Gallo Negro. Quisiera consultar por sus productos.')}`} target="_blank" rel="noopener noreferrer" aria-label="Consultar por WhatsApp">{content}</a>
   : <button className={className} type="button" aria-label="Consultar por WhatsApp" onClick={() => setUnavailable(true)}>{content}</button>}
  {unavailable && <Modal title="Contacto por WhatsApp" onClose={() => setUnavailable(false)}>
   <div className="whatsapp-unavailable"><WhatsAppIcon /><h2>Contacto por WhatsApp</h2><p>Este canal de contacto todavía no está disponible. Mientras tanto, podés explorar las piezas y preparar tu pedido.</p><Button onClick={() => { setUnavailable(false); onOpenCart(); }}>Ver mi pedido</Button></div>
  </Modal>}
 </>;
}
