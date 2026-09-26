import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { HeroTitle, ease } from './Effects';
import ForgeIntro, { shouldPlayForgeIntro } from './ForgeIntro';

export default function HeroScene() {
 const reduced = useReducedMotion();
 const ref = useRef(null);
 const inView = useInView(ref, { amount: 0.1 });
 const videoRef = useRef(null);
 const [failed, setFailed] = useState(false);
 const [visible, setVisible] = useState(true);
 const [introPlaying, setIntroPlaying] = useState(shouldPlayForgeIntro);
 const [introRevealed, setIntroRevealed] = useState(() => !introPlaying);
 const revealHero = useCallback(() => setIntroRevealed(true), []);
 const finishIntro = useCallback(() => { setIntroRevealed(true); setIntroPlaying(false); }, []);
 // El contenido entra cuando las particulas revelan el hero.
 const enter = delay => reduced ? {} : { initial: { opacity: 0, y: 18 }, animate: introRevealed ? { opacity: 1, y: 0 } : undefined, transition: { duration: 0.7, delay: 0.2 + delay, ease } };
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
  <>
  {introPlaying && <ForgeIntro onReveal={revealHero} onDone={finishIntro} />}
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
     <HeroTitle play={introRevealed} className="text-[clamp(2.6rem,8.5vw,4.6rem)] leading-[0.98] tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)] sm:text-[clamp(3rem,6vw,4.6rem)]" />
     <motion.p className="hero-lead" {...enter(0.35)}>
      Fogoneros y parrillas hechos a mano en Ituzaingó.
     </motion.p>
     <motion.div className="hero-actions-row" {...enter(0.5)}>
      <Link href="/catalogo" className="hero-cta hero-cta-primary">
       Ver catálogo <span className="hero-cta-icon" aria-hidden="true"><ArrowRight size={17} /></span>
      </Link>
     </motion.div>

    </div>
   </div>


  </section>
  </>
 );
}
