import React, { useEffect, useState } from 'react';
import '../../css/forge-intro.css';

let playedThisLoad = false;
export function shouldPlayForgeIntro() {
 return typeof window !== 'undefined' && !playedThisLoad && !document.hidden
  && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// LogoPreloader sequence: enter from below, hold, exit upward and fade the backdrop.
export default function ForgeIntro({ onReveal, onDone }) {
 const [phase, setPhase] = useState('init');
 useEffect(() => {
  playedThisLoad = true;
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finishIfHidden = () => { if (document.hidden || media.matches) onDone(); };
  if (document.hidden || media.matches) { onDone(); return; }
  const enter = setTimeout(() => setPhase('loading'), 50);
  const exit = setTimeout(() => { setPhase('logo-out'); onReveal(); }, 2050);
  const finish = setTimeout(onDone, 2750);
  document.addEventListener('visibilitychange', finishIfHidden);
  media.addEventListener('change', finishIfHidden);
  return () => {
   clearTimeout(enter); clearTimeout(exit); clearTimeout(finish);
   document.removeEventListener('visibilitychange', finishIfHidden);
   media.removeEventListener('change', finishIfHidden);
  };
 }, [onReveal, onDone]);
 return <div className="forge-intro" data-phase={phase} aria-hidden="true">
  <svg className="forge-intro-logo" viewBox="0 0 240 240" fill="none">
   <path fill="#ed7b35" d="M119 142 C78 139 73 114 89 92 C91 109 100 110 102 100 C92 74 117 66 119 32 C152 57 137 81 153 93 C159 100 163 89 163 80 C189 120 159 145 119 142 Z" />
   <path d="M42 148 Q120 160 198 148 Q185 195 120 195 Q55 195 42 148 Z M70 188 L80 188 L66 219 L57 219 Z M160 188 L170 188 L183 219 L174 219 Z" fill="#fff8ed" />
   <path d="M85 143 L151 127 M90 127 L151 143" stroke="#c87945" strokeWidth="8" strokeLinecap="round" />
   <path d="M110 126 C102 116 113 108 120 92 C131 108 139 119 130 129 C124 136 115 134 110 126 Z" fill="#ffd080" />
  </svg>
 </div>;
}
