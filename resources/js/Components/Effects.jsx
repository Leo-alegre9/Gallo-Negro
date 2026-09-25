import React from 'react';
import { motion, useReducedMotion } from 'motion/react';


export const ease = [0.22, 1, 0.36, 1];
export function Reveal({ children, className, ...props }) {
 const reduced = useReducedMotion();
 return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: reduced ? 0 : 0.65, ease }} {...props}>{children}</motion.div>;
}

export function HeroTitle({ className = '' }) {
 const reduced = useReducedMotion();
 return <h1 className={className} aria-label="Donde hay fuego, hay encuentro.">{['Donde hay fuego,', 'hay encuentro.'].map((line, i) => <span className="title-mask" aria-hidden="true" key={line}><motion.span initial={reduced ? false : { y: '110%', rotate: 3 }} animate={{ y: 0, rotate: 0 }} transition={{ duration: 0.95, delay: 0.12 + i * 0.15, ease }}>{line}</motion.span></span>)}</h1>;
}

export function CartCount({ count }) {
 const reduced = useReducedMotion();
 return <motion.b key={count} initial={false} animate={{ scale: reduced ? 1 : [1, 1.35, 1], backgroundColor: ['#d2b49a', '#e5dfd2'] }} transition={{ duration: reduced ? 0 : 0.4 }}>{count}</motion.b>;
}
