import React, { useEffect, useId, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowUp, Instagram } from 'lucide-react';
import { contact } from '../data/contact';
import '../../css/footer.css';

// Medidas de "GALLO NEGRO" en Barlow Condensed 700 a 100px: el trazo va de x=3 a x=480 y las mayúsculas miden 71px sobre la línea base.
// El viewBox muestra la palabra de lado a lado, deja aire arriba para que suba al pasar el puntero y recorta la parte de abajo.
const wordmarkViewBox = '3 21 477 69';
// Permite cortar el correo después de la "@" en pantallas angostas.
const [emailUser, emailDomain] = contact.email.split('@');

// Letras en tonos de hierro tibio; una brasa sigue al puntero y las enciende a su paso.
function Wordmark() {
 const id = useId().replace(/:/g, '');
 const svgRef = useRef(null);
 const glowRef = useRef(null);

 useEffect(() => {
  const svg = svgRef.current;
  const glow = glowRef.current;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const current = { x: 240, y: 70 };
  const target = { ...current };
  let frame = 0;

  const draw = () => {
   const ease = reduceMotion ? 1 : 0.14;
   current.x += (target.x - current.x) * ease;
   current.y += (target.y - current.y) * ease;
   glow.setAttribute('cx', current.x.toFixed(1));
   glow.setAttribute('cy', current.y.toFixed(1));
   frame = Math.abs(target.x - current.x) + Math.abs(target.y - current.y) > 0.2 ? requestAnimationFrame(draw) : 0;
  };
  const move = event => {
   const matrix = svg.getScreenCTM();
   if (!matrix) return;
   const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
   target.x = point.x;
   target.y = point.y;
   svg.classList.add('is-lit');
   if (!frame) frame = requestAnimationFrame(draw);
  };
  const leave = () => svg.classList.remove('is-lit');

  svg.addEventListener('pointermove', move);
  svg.addEventListener('pointerdown', move);
  svg.addEventListener('pointerleave', leave);
  svg.addEventListener('pointercancel', leave);
  return () => {
   cancelAnimationFrame(frame);
   svg.removeEventListener('pointermove', move);
   svg.removeEventListener('pointerdown', move);
   svg.removeEventListener('pointerleave', leave);
   svg.removeEventListener('pointercancel', leave);
  };
 }, []);

 return <div className="footer-wordmark" aria-hidden="true">
  <svg ref={svgRef} viewBox={wordmarkViewBox} preserveAspectRatio="xMidYMin meet" focusable="false">
   <defs>
    <linearGradient id={`${id}-iron`} x1="0" y1="27" x2="0" y2="90" gradientUnits="userSpaceOnUse">
     <stop offset="0" stopColor="#5a4638" />
     <stop offset=".55" stopColor="#35281f" />
     <stop offset="1" stopColor="#1a1310" />
    </linearGradient>
    <radialGradient ref={glowRef} id={`${id}-ember`} cx="240" cy="70" r="90" gradientUnits="userSpaceOnUse">
     <stop offset="0" stopColor="#ffd9bd" />
     <stop offset=".3" stopColor="#ffb992" />
     <stop offset=".62" stopColor="#c2552f" stopOpacity=".55" />
     <stop offset="1" stopColor="#984829" stopOpacity="0" />
    </radialGradient>
   </defs>
   <g className="footer-wordmark-letters">
    <text x="0" y="100" fill={`url(#${id}-iron)`}>GALLO NEGRO</text>
    <text x="0" y="100" fill={`url(#${id}-ember)`} className="footer-wordmark-ember">GALLO NEGRO</text>
   </g>
  </svg>
 </div>;
}

export default function Footer({ home = false }) {
 const homeAnchor = id => `${home ? '' : '/'}#${id}`;
 const columns = [
  { title: 'Explorá', links: [
   { label: 'Inicio', href: '/', navigate: true },
   { label: 'Catálogo', href: '/catalogo', navigate: true },
   { label: 'Nuestro taller', href: '/taller', navigate: true },
   { label: 'Contactanos', href: homeAnchor('contacto') },
  ] },
  { title: 'Contacto', links: [
   { label: contact.phoneLabel, href: `tel:+54${contact.phone}` },
   { label: <>{emailUser}@<wbr />{emailDomain}</>, href: `mailto:${contact.email}` },
  ] },
  { title: 'El taller', text: [contact.street, contact.city, contact.hours] },
 ];

 return <footer className="site-footer">
  <div className="shell">
   <div className="footer-main">
    <div className="footer-identity">
     <Link href="/" className="footer-logo" aria-label="Gallo Negro, inicio">
      <img src="/images/logo.png" alt="" width="48" height="48" loading="lazy" />
      <span>GALLO NEGRO</span>
     </Link>
     <p>Hierro, fuego y buenos encuentros. Fogoneros, parrillas y herrería a medida con el carácter de nuestro taller.</p>
    </div>

    <nav className="footer-columns" aria-label="Navegación del pie de página">
     {columns.map(column => <div key={column.title} className="footer-column">
      <h3>{column.title}</h3>
      {column.links?.map(link => link.navigate
       ? <Link key={link.href} href={link.href}>{link.label}</Link>
       : <a key={link.href} href={link.href}>{link.label}</a>)}
      {column.text?.map(line => <p key={line}>{line}</p>)}
     </div>)}
    </nav>
   </div>

   <div className="footer-bottom">
    <div className="footer-legal">
     <p>© {new Date().getFullYear()} Gallo Negro. Todos los derechos reservados.</p>
     <a className="footer-follow" href={contact.instagram} target="_blank" rel="noopener noreferrer" aria-label="Seguinos en Instagram (se abre en una pestaña nueva)">
      <span aria-hidden="true">Seguinos</span>
      <svg className="footer-follow-arrow" viewBox="0 0 32 12" aria-hidden="true" focusable="false">
       <path d="M1 6h27" />
       <path d="M23 1.5 28.5 6 23 10.5" />
      </svg>
      <span className="footer-social"><Instagram size={17} aria-hidden="true" /></span>
     </a>
    </div>
    <a className="footer-top-link" href="#contenido">Volver arriba <ArrowUp size={15} aria-hidden="true" /></a>
   </div>

   <Wordmark />
  </div>
 </footer>;
}
