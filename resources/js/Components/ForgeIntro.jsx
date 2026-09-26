import React, { useEffect, useId, useRef, useState } from 'react';
import '../../css/forge-intro.css';

let playedThisLoad = false;
export function shouldPlayForgeIntro() {
 return typeof window !== 'undefined' && !playedThisLoad && !document.hidden
  && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// An inverse SVG mask exposes the live hero through the fire bowl silhouette.
export default function ForgeIntro({ onReveal, onDone }) {
 const maskId = useId();
 const shapeRef = useRef(null);
 const overlayRef = useRef(null);
 const [viewport, setViewport] = useState(() => ({ width: window.innerWidth, height: window.innerHeight }));
 useEffect(() => {
  playedThisLoad = true;
  let frame;
  let revealed = false;
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const resize = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
  const finishIfHidden = () => { if (document.hidden || media.matches) onDone(); };
  const start = performance.now();
  const draw = now => {
   const elapsed = (now - start) / 1000;
   const progress = Math.max(0, Math.min((elapsed - .65) / 1.65, 1));
   const ease = progress * progress * progress;
   const base = Math.min(window.innerWidth / 420, 1.25);
   // The focus sits inside the flame so the opening covers every viewport corner.
   const final = Math.max(window.innerWidth, window.innerHeight) / 12;
   const scale = base * Math.pow(final / base, ease);
   shapeRef.current.setAttribute('transform', `translate(${window.innerWidth / 2} ${window.innerHeight / 2}) scale(${scale}) translate(-120 -108)`);
   overlayRef.current.style.opacity = String(1 - Math.max(0, (progress - .88) / .12));
   if (progress > .55 && !revealed) { revealed = true; onReveal(); }
   if (progress >= 1) { onDone(); return; }
   frame = requestAnimationFrame(draw);
  };
  if (media.matches) { onDone(); return; }
  frame = requestAnimationFrame(draw);
  const fallback = setTimeout(onDone, 3000);
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', finishIfHidden);
  media.addEventListener('change', finishIfHidden);
  return () => {
   cancelAnimationFrame(frame); clearTimeout(fallback);
   window.removeEventListener('resize', resize);
   document.removeEventListener('visibilitychange', finishIfHidden);
   media.removeEventListener('change', finishIfHidden);
  };
 }, [onReveal, onDone]);
 const base = Math.min(viewport.width / 420, 1.25);
 return <div ref={overlayRef} className="forge-intro" aria-hidden="true">
  <svg className="forge-intro-mask" width={viewport.width} height={viewport.height} viewBox={`0 0 ${viewport.width} ${viewport.height}`}>
   <defs>
    <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width={viewport.width} height={viewport.height} style={{ maskType: 'luminance' }}>
     <rect width={viewport.width} height={viewport.height} fill="white" />
     <g ref={shapeRef} fill="black" transform={`translate(${viewport.width / 2} ${viewport.height / 2}) scale(${base}) translate(-120 -108)`}>
      <path d="M119 142 C78 139 73 114 89 92 C91 109 100 110 102 100 C92 74 117 66 119 32 C152 57 137 81 153 93 C159 100 163 89 163 80 C189 120 159 145 119 142 Z" />
      <path d="M42 148 Q120 160 198 148 Q185 195 120 195 Q55 195 42 148 Z M70 188 L80 188 L66 219 L57 219 Z M160 188 L170 188 L183 219 L174 219 Z" />
      <path d="M85 143 L151 127 M90 127 L151 143" fill="none" stroke="black" strokeWidth="8" strokeLinecap="round" />
     </g>
    </mask>
   </defs>
   <rect width={viewport.width} height={viewport.height} fill="#080706" mask={`url(#${maskId})`} />
  </svg>
 </div>;
}
