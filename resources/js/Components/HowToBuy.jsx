import React, { useEffect, useRef, useState } from 'react';
import { ShoppingBag, Search, ListChecks, MessageCircle, Truck, ArrowDown } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import Button from './Button';
import '../../css/how-to-buy.css';

const steps = [
 { title:'Encontrá tu pieza', description:'Recorré el catálogo de fogoneros, parrillas y estufas. Abrí la ficha para ver fotos, medidas y materiales, y elegí la que mejor va con tu espacio.', detail:'Cuando te decidas, tocá «Agregar a mi pedido».', Icon:Search },
 { title:'Revisá tu pedido', description:'Abrí «Tu pedido» para revisar las piezas y ajustar las cantidades. Vas a ver un total estimado y podés quitar productos o seguir explorando.', detail:'Si necesitás algo a medida, agregá un mensaje para el taller.', Icon:ListChecks },
 { title:'Mandanos la consulta', description:'Tocá «Consultar pedido por WhatsApp». Se abrirá una conversación con el detalle de los productos y tu mensaje, listo para enviar.', detail:'Revisá el mensaje y envialo desde WhatsApp para que recibamos tu consulta.', Icon:MessageCircle },
 { title:'Coordinamos con vos', description:'Te confirmamos disponibilidad y precio final. Después acordamos la forma de pago y cómo recibir tu pieza.', detail:'La entrega se coordina directamente con el taller.', Icon:Truck },
];

export default function HowToBuy({ count = 0, onOpenCart }) {
 const ref = useRef(null);
 const reduced = useReducedMotion();
 const [active, setActive] = useState(0);
 useEffect(() => {
  let frame = 0;
  const update = () => {
   frame = 0;
   const elements = [...ref.current.querySelectorAll('[data-step]')];
   const center = window.innerHeight / 2;
   const nearest = elements.reduce((best, element) => {
    const box = element.getBoundingClientRect();
    const distance = Math.abs(box.top + box.height / 2 - center);
    return !best || distance < best.distance ? { element, distance } : best;
   }, null);
   if (nearest) setActive(Number(nearest.element.dataset.step));
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  update();
  window.addEventListener('scroll', schedule, { passive:true });
  window.addEventListener('resize', schedule);
  return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); };
 }, []);
 return <section ref={ref} id="como-comprar" className="how-to-buy" aria-labelledby="how-to-buy-title">
  <div className="how-to-buy-heading">
   <div className="how-to-buy-mark" aria-hidden="true"><ShoppingBag size={26} /></div>
   <h2 id="how-to-buy-title">Cómo comprar</h2>
   <p>De la primera idea al próximo encuentro alrededor del fuego. Te acompañamos en cada paso.</p>
   <Button onClick={onOpenCart} className="how-to-buy-button" aria-label={count > 0 ? `Ver mi pedido, ${count} productos` : 'Ver mi pedido'}>
    <ShoppingBag size={18} aria-hidden="true" /> Ver mi pedido
    {count > 0 && <span className="how-to-buy-count">{count}</span>}
   </Button>
   <span className="how-to-buy-scroll"><ArrowDown size={15} aria-hidden="true" /> Seguí los pasos al bajar</span>
  </div>
  <ol className="how-to-buy-steps">
   {steps.map(({ title, description, detail, Icon }, index) => <motion.li key={title} data-step={index} className={active === index ? 'is-active' : ''} initial={reduced ? false : { opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, amount:.2 }} transition={{ duration:reduced ? 0 : .5 }}>
    <span className="how-to-buy-number" aria-hidden="true">0{index + 1}</span>
    <div className="how-to-buy-step-copy"><Icon className="how-to-buy-step-icon" size={26} aria-hidden="true" /><h3>{title}</h3><p>{description}</p><p className="how-to-buy-detail">{detail}</p></div>
   </motion.li>)}
  </ol>
 </section>;
}
