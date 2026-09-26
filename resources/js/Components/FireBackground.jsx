import React, { useEffect, useRef } from 'react';
import '../../css/fire-background.css';

const vertex = `attribute vec2 position; varying vec2 uv;
void main(){uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`;
const fragment = `precision mediump float;
varying vec2 uv; uniform float time; uniform float aspect; uniform float pointer;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.03+vec2(17.1,9.2);a*=.5;}return v;}
void main(){
 vec2 p=vec2(uv.x*aspect*3.5,uv.y*3.2);
 p.x+=pointer*uv.y*.22;
 float t=time*.45;
 float warp=fbm(p*1.5-vec2(0.,t));
 float n=fbm(vec2(p.x+warp*1.5,p.y-t*2.));
 float tongues=fbm(vec2(p.x*2.2,p.y*.6-t*2.5));
 float height=.12+n*.6+tongues*.2;
 float flame=clamp((height-uv.y)*4.5,0.,1.);
 flame*=smoothstep(0.,.12,uv.y);
 vec3 fire=mix(vec3(.55,.055,.008),vec3(1.,.36,.035),smoothstep(.1,.65,flame));
 fire=mix(fire,vec3(1.,.76,.24),pow(flame,4.));
 vec3 color=fire*pow(flame,1.5)*.72;
 color+=vec3(.2,.035,.005)*exp(-uv.y*5.)*.45;
 for(int i=0;i<18;i++){
  float seed=float(i);float speed=.06+hash(vec2(seed,2.))*.05;
  float y=fract(time*speed+hash(vec2(seed,3.)));
  float x=hash(vec2(seed,4.))+sin(time*.5+seed)*.016;
  vec2 d=(uv-vec2(x,y))*vec2(aspect,1.);
  float spark=exp(-dot(d,d)*180000.)*(1.-y)*smoothstep(0.,.12,y);
  color+=vec3(1.,.46,.1)*spark;
 }
 gl_FragColor=vec4(color,1.);
}`;

export default function FireBackground() {
 const ref = useRef(null);
 useEffect(() => {
  const canvas = ref.current;
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, powerPreference: 'low-power' });
  if (!gl) return; // CSS supplies a warm, static fallback.
  const shaders = [];
  const compile = (type, source) => {
   const shader = gl.createShader(type); shaders.push(shader);
   gl.shaderSource(shader, source); gl.compileShader(shader);
   return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
  };
  const vs=compile(gl.VERTEX_SHADER,vertex), fs=compile(gl.FRAGMENT_SHADER,fragment);
  if (!vs || !fs) { shaders.forEach(shader=>gl.deleteShader(shader)); return; }
  const program=gl.createProgram(); gl.attachShader(program,vs); gl.attachShader(program,fs); gl.linkProgram(program);
  if (!gl.getProgramParameter(program,gl.LINK_STATUS)) { gl.deleteProgram(program); shaders.forEach(shader=>gl.deleteShader(shader)); return; }
  gl.useProgram(program);
  const buffer=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  const position=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
  const uniforms={time:gl.getUniformLocation(program,'time'),aspect:gl.getUniformLocation(program,'aspect'),pointer:gl.getUniformLocation(program,'pointer')};
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame=0,visible=false,previous=0,elapsed=3,pointer=0,lost=false;
  const paint=() => {
   if(lost)return;
   gl.uniform1f(uniforms.time,elapsed);gl.uniform1f(uniforms.aspect,canvas.clientWidth/Math.max(canvas.clientHeight,1));gl.uniform1f(uniforms.pointer,pointer);
   gl.drawArrays(gl.TRIANGLES,0,6);
  };
  const resize=()=>{
   const ratio=Math.min(window.devicePixelRatio || 1,1.25);
   const scale=Math.min(1,1000/Math.max(canvas.clientWidth,canvas.clientHeight));
   canvas.width=Math.max(1,Math.round(canvas.clientWidth*ratio*scale));canvas.height=Math.max(1,Math.round(canvas.clientHeight*ratio*scale));
   gl.viewport(0,0,canvas.width,canvas.height);paint();
  };
  const tick=now=>{
   frame=0;
   if(previous && now-previous<32){frame=requestAnimationFrame(tick);return;}
   if(previous)elapsed+=Math.min((now-previous)/1000,.1);
   previous=now;paint();frame=requestAnimationFrame(tick);
  };
  const sync=()=>{
   cancelAnimationFrame(frame);frame=0;previous=0;
   if(visible && !document.hidden && !media.matches && !lost)frame=requestAnimationFrame(tick);
   else if(media.matches)paint();
  };
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();});observer.observe(canvas);
  const sizes=new ResizeObserver(resize);sizes.observe(canvas);resize();
  const move=event=>{const box=canvas.getBoundingClientRect();pointer=(event.clientX-box.left)/box.width-.5;};
  const contextLost=event=>{event.preventDefault();lost=true;canvas.style.visibility='hidden';sync();};
  canvas.addEventListener('webglcontextlost',contextLost);
  canvas.parentElement.addEventListener('pointermove',move,{passive:true});
  document.addEventListener('visibilitychange',sync);media.addEventListener('change',sync);
  return ()=>{
   cancelAnimationFrame(frame);observer.disconnect();sizes.disconnect();
   canvas.removeEventListener('webglcontextlost',contextLost);canvas.parentElement?.removeEventListener('pointermove',move);
   document.removeEventListener('visibilitychange',sync);media.removeEventListener('change',sync);
   gl.deleteBuffer(buffer);gl.deleteProgram(program);shaders.forEach(shader=>gl.deleteShader(shader));
  };
 }, []);
 return <div className="fire-background" aria-hidden="true"><canvas ref={ref} /><div className="fire-background-shade" /></div>;
}
