import React, { useEffect, useRef } from 'react';
import '../../css/galaxy-background.css';

// Rising embers share one continuous surface, with a static frame for reduced motion.
export default function GalaxyBackground() {
 const ref = useRef(null);
 useEffect(() => {
  const canvas = ref.current;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let width = 0, height = 0, frame = 0, last = 0, visible = false;
  let sparks = [];
  const createSpark = () => ({ x:Math.random() * width, y:Math.random() * height, speed:18 + Math.random() * 34, radius:.6 + Math.random() * 1.2, phase:Math.random() * Math.PI * 2, warmth:Math.random() });
  const paint = (delta = 0) => {
   const light = root.dataset.theme === 'light';
   ctx.globalAlpha = 1;
   ctx.fillStyle = light ? '#f4eddf' : '#050302';
   ctx.fillRect(0, 0, width, height);
   for (const spark of sparks) {
    spark.y -= delta * spark.speed;
    spark.phase += delta * 1.4;
    spark.x += Math.sin(spark.phase) * delta * 8;
    if (spark.y < -12) Object.assign(spark, createSpark(), { y:height + 8 });
    const color = light ? (spark.warmth > .5 ? '#a64b20' : '#b96a27') : (spark.warmth > .65 ? '#ffd080' : spark.warmth > .3 ? '#ff943f' : '#e65b24');
    const fade = Math.min(1, Math.max(0, spark.y / 70), Math.max(0, (height - spark.y) / 70));
    ctx.globalAlpha = fade * (.55 + Math.sin(spark.phase) * .18) * (light ? .65 : 1);
    const trail = ctx.createLinearGradient(spark.x, spark.y, spark.x, spark.y + spark.radius * 7);
    trail.addColorStop(0, color); trail.addColorStop(1, light ? '#a64b2000' : '#ff943f00');
    ctx.strokeStyle = trail; ctx.lineWidth = spark.radius * .8;
    ctx.beginPath(); ctx.moveTo(spark.x, spark.y); ctx.lineTo(spark.x - Math.sin(spark.phase) * 2, spark.y + spark.radius * 7); ctx.stroke();
    ctx.fillStyle = color;
    ctx.shadowColor = color; ctx.shadowBlur = light ? 0 : spark.radius * 5;
    ctx.beginPath(); ctx.ellipse(spark.x, spark.y, spark.radius * .65, spark.radius, Math.sin(spark.phase) * .4, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
   }
   ctx.globalAlpha = 1;
  };
  const tick = now => {
   const delta = last ? Math.min((now - last) / 1000, .05) : 0;
   last = now; paint(delta); frame = requestAnimationFrame(tick);
  };
  const sync = () => {
   cancelAnimationFrame(frame); frame = 0; last = 0;
   paint();
   if (visible && !document.hidden && !reduced.matches) frame = requestAnimationFrame(tick);
  };
  const resize = () => {
   const rect = canvas.parentElement.getBoundingClientRect();
   width = rect.width; height = rect.height;
   const ratio = Math.min(window.devicePixelRatio || 1, 1.25);
   canvas.width = Math.max(1, Math.round(width * ratio));
   canvas.height = Math.max(1, Math.round(height * ratio));
   ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
   const count = Math.min(320, Math.max(50, Math.round(width * height / 14000)));
   sparks = Array.from({ length:count }, createSpark);
   paint();
  };
  const sizes = new ResizeObserver(resize); sizes.observe(canvas.parentElement);
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
  observer.observe(canvas.parentElement);
  const themes = new MutationObserver(sync); themes.observe(root, { attributes:true, attributeFilter:['data-theme'] });
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', sync);
  resize();
  return () => {
   cancelAnimationFrame(frame); sizes.disconnect(); observer.disconnect(); themes.disconnect();
   document.removeEventListener('visibilitychange', sync); reduced.removeEventListener('change', sync);
  };
 }, []);
 return <div className="galaxy-background" aria-hidden="true"><canvas ref={ref} /></div>;
}
