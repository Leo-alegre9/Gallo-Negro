import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowUp, Instagram } from 'lucide-react';
import '../../css/footer.css';

export default function Footer({ home = false }) {
 const homeAnchor = id => `${home ? '' : '/'}#${id}`;

 return <footer className="site-footer">
  <div className="shell">
   <div className="footer-main">
    <div className="footer-identity">
     <Link href="/" className="footer-logo" aria-label="Gallo Negro, inicio">
      <img src="/images/logo.png" alt="" width="72" height="72" loading="lazy" />
      <span>GALLO NEGRO<small>Fogoneros & herrería</small></span>
     </Link>
     <p>Hierro, fuego y buenos encuentros.<br />Piezas con el carácter de nuestro taller.</p>
    </div>

    <nav className="footer-navigation" aria-label="Navegación del pie de página">
     <h3>Conocé Gallo Negro</h3>
     <Link href="/catalogo">Catálogo completo</Link>
     <Link href="/taller">Nuestro taller</Link>
     <a href={homeAnchor('contacto')}>Contactanos</a>
    </nav>
    <a className="footer-instagram-link" href="https://www.instagram.com/gallonegroba/" target="_blank" rel="noopener noreferrer" aria-label="Gallo Negro en Instagram (se abre en una pestaña nueva)">
     <Instagram size={20} strokeWidth={2} aria-hidden="true" /> Instagram
    </a>
   </div>

   <div className="footer-bottom">
    <p>© {new Date().getFullYear()} Gallo Negro. Todos los derechos reservados.</p>
    <span>Hecho con oficio.</span>
    <a href="#contenido">Volver arriba <ArrowUp size={16} aria-hidden="true" /></a>
   </div>
  </div>
 </footer>;
}
