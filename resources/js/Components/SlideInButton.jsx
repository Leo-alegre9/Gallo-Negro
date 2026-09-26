import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import '../../css/slide-in-button.css';

export default function SlideInButton({ children, href = '/catalogo', className = '' }) {
 return <Link href={href} className={`slide-in-button ${className}`}>
  <span className="slide-in-button-fill" aria-hidden="true" />
  <span className="slide-in-button-label">{children}</span>
  <ArrowRight className="slide-in-button-arrow" size={20} strokeWidth={2.5} aria-hidden="true" />
 </Link>;
}
