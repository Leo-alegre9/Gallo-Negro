import React from 'react';
import { ShoppingBag } from 'lucide-react';
import Button from './Button';

const steps = [
 { title: 'Elegí tu fogonero', description: 'Sumalo a tu pedido desde el catálogo.' },
 { title: 'Enviá tu pedido', description: 'Mandanos la consulta por WhatsApp.' },
 { title: 'Coordinamos', description: 'Te confirmamos disponibilidad, pago y entrega.' },
];

export default function HowToBuy({ count = 0, onOpenCart }) {
 return (
  <div id="como-comprar" className="how-to-buy">
   <div className="how-to-buy-heading">
    <div>
     <h2>Cómo comprar</h2>
    </div>
    <Button onClick={onOpenCart} className="how-to-buy-button" aria-label={count > 0 ? `Ver mi pedido, ${count} productos` : 'Ver mi pedido'}>
     <ShoppingBag size={18} aria-hidden="true" /> Ver mi pedido
     {count > 0 && <span className="how-to-buy-count">{count}</span>}
    </Button>
   </div>
   <ol className="how-to-buy-steps">
    {steps.map((step, index) => (
     <li key={step.title}>
      <span className="how-to-buy-number" aria-hidden="true">0{index + 1}</span>
      <div>
       <h3>{step.title}</h3>
       <p>{step.description}</p>
      </div>
     </li>
    ))}
   </ol>
  </div>
 );
}
