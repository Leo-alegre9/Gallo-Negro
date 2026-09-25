import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { ArrowUpRight, ChevronDown, Flame } from 'lucide-react';
import { HeroTitle } from './Effects';
import Button from './Button';

export default function HeroScene() {
 const reduced = useReducedMotion();
 const ref = useRef(null);
 const inView = useInView(ref, { amount: 0.1 });
 const videoRef = useRef(null);
 const [failed, setFailed] = useState(false);
 const [visible, setVisible] = useState(true);
 useEffect(() => {
  const update = () => setVisible(!document.hidden);
  update(); document.addEventListener('visibilitychange', update);
  return () => document.removeEventListener('visibilitychange', update);
 }, []);
 useEffect(() => {
  const video = videoRef.current;
  if (!video) return;
  if (reduced || !inView || !visible || failed) { video.pause(); return; }
  video.muted = true;
  video.play().catch(() => { /* The poster remains visible if autoplay is unavailable. */ });
  return () => video.pause();
 }, [reduced, inView, visible, failed]);

 return (
  <section
   ref={ref}
   className="hero-scene relative isolate flex h-[100svh] min-h-[600px] w-full items-end overflow-hidden bg-iron text-white"
   aria-label="Gallo Negro: nuestros productos y taller"
  >
   <div className="absolute inset-0" aria-hidden="true">
    <img
     className={`absolute inset-0 h-full w-full object-cover object-center ${failed || reduced ? 'opacity-100' : 'opacity-0'}`}
     src="/videos/hero-poster.jpg"
     alt=""
     fetchPriority="high"
    />
    <video
     ref={videoRef}
     className="absolute inset-0 h-full w-full object-cover object-center"
     muted
     loop
     playsInline
     preload={reduced ? 'none' : 'metadata'}
     poster="/videos/hero-poster.jpg"
     onError={() => setFailed(true)}
     style={failed || reduced ? { visibility: 'hidden' } : undefined}
    >
     <source src="/videos/gallo-negro-hero-hd.mp4" type="video/mp4" />
    </video>
    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/10 to-transparent lg:from-black/70" />
    <div className="hero-bottom-shade absolute inset-0" />
   </div>

   <div className="shell relative z-10 w-full pb-24 pt-16 sm:pb-28 sm:pt-20 lg:pb-32">
    <div className="max-w-xl">
     <span className="mb-4 inline-flex items-center gap-2 text-xs font-medium text-[#ffb992] sm:mb-5">
      <Flame size={16} /> Encendé el encuentro.
     </span>
     <HeroTitle className="text-[clamp(2.6rem,8.5vw,4.6rem)] leading-[0.98] tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)] sm:text-[clamp(3rem,6vw,4.6rem)]" />
     <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-white/85 sm:mt-5 sm:max-w-md sm:text-[15px] sm:leading-loose">
      Fogoneros y parrillas con carácter.<br className="hidden sm:block" /> Hechos para compartir buenos momentos.
     </p>
     <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8">
      <Button href="/catalogo" navigate>Ver catálogo <ArrowUpRight size={18} aria-hidden="true" /></Button>
      <Button href="/taller" navigate variant="glass">Conocé el taller <ArrowUpRight size={18} aria-hidden="true" /></Button>
     </div>
    </div>
   </div>

   <a
    href="#catalogo"
    aria-label="Ver el catálogo, desplazate hacia abajo"
    className="group absolute inset-x-0 bottom-6 z-10 mx-auto flex w-fit flex-col items-center gap-2.5 text-white/75 transition-colors hover:text-white sm:bottom-9"
   >
    <span className="text-[10px] font-semibold uppercase tracking-[0.25em]">Descubrí el catálogo</span>
    <motion.span
     animate={reduced ? undefined : { y: [0, 9, 0] }}
     transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
     className="flex size-10 items-center justify-center rounded-full border border-white/35 bg-white/10 backdrop-blur-md transition-colors duration-200 group-hover:border-white/70 group-hover:bg-white/20"
    >
     <ChevronDown size={20} aria-hidden="true" />
    </motion.span>
   </a>
  </section>
 );
}
