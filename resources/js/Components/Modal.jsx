import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { X } from 'lucide-react';
import { ease } from './Effects';

export default function Modal({ children, onClose, title, drawer = false }) {
 const ref = useRef(null);
 const reduced = useReducedMotion();
 const [closing, setClosing] = useState(false);
 const requestClose = () => setClosing(true);
 useEffect(() => {
  const previous = document.activeElement;
  const dialog = ref.current;
  dialog.showModal();
  const overflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  return () => { document.body.style.overflow = overflow; previous?.focus(); };
 }, []);
 return <motion.dialog ref={ref} className={drawer ? 'modal drawer' : 'modal'} aria-label={title} initial={reduced ? false : { opacity: 0, x: drawer ? '100%' : 0, y: drawer ? 0 : 20, scale: drawer ? 1 : 0.96 }} animate={closing ? { opacity: 0, x: reduced || !drawer ? 0 : '100%', y: 0, scale: 1 } : { opacity: 1, x: 0, y: 0, scale: 1 }} transition={{ duration: reduced ? 0 : 0.32, ease }} onAnimationComplete={() => { if (closing) onClose(); }} onCancel={e => { e.preventDefault(); requestClose(); }} onClick={e => { if (e.target === e.currentTarget) requestClose(); }}><div className="modal-inner"><button className="icon-button modal-close" onClick={requestClose} aria-label="Cerrar"><X /></button>{children}</div></motion.dialog>;
}
