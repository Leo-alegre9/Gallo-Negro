import React, { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, Check, CheckCircle2, Clock3, Copy, Mail, MapPin, Phone, Send } from 'lucide-react';
import { Reveal, ease } from './Effects';
import '../../css/visit-us.css';
import { contact, openingStatus } from '../data/contact';

const topics = [
 ['producto', 'Consulta por un producto'],
 ['medida', 'Trabajo a medida'],
 ['otro', 'Otro'],
];

function Field({ id, label, optional, error, children }) {
 return (
  <div className="contact-field">
   <label htmlFor={id}>{label}{optional && <span>Opcional</span>}</label>
   {children}
   {error && <p id={`${id}-error`} className="contact-error">{error}</p>}
  </div>
 );
}

function ContactForm({ products }) {
 const { data, setData, post, processing, errors, wasSuccessful, reset, clearErrors } = useForm({
  name: '', email: '', phone: '', topic: 'producto', product_id: '', message: '', website: '',
 });
 const invalid = field => errors[field] ? { 'aria-invalid': true, 'aria-describedby': `contact-${field}-error` } : {};
 const change = field => event => { setData(field, event.target.value); if (errors[field]) clearErrors(field); };

 const submit = event => {
  event.preventDefault();
  post('/consultas/contacto', { preserveScroll: true, onSuccess: () => reset() });
 };

 return (
  <form className="contact-form" onSubmit={submit} noValidate>
   <div className="contact-form-heading">
    <h3>Escribinos</h3>
    <p>Dejanos tu consulta y te respondemos por correo.</p>
   </div>

   <Field id="contact-name" label="Nombre" error={errors.name}>
    <input id="contact-name" name="name" autoComplete="name" required maxLength={120} placeholder="Juan Pérez" value={data.name} onChange={change('name')} {...invalid('name')} />
   </Field>
   <div className="contact-row">
    <Field id="contact-email" label="Correo" error={errors.email}>
     <input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={160} placeholder="hola@ejemplo.com" value={data.email} onChange={change('email')} {...invalid('email')} />
    </Field>
    <Field id="contact-phone" label="Teléfono" optional error={errors.phone}>
     <input id="contact-phone" name="phone" type="tel" autoComplete="tel" maxLength={40} placeholder="11 1234-5678" value={data.phone} onChange={change('phone')} {...invalid('phone')} />
    </Field>
   </div>
   <Field id="contact-topic" label="Motivo" error={errors.topic}>
    <select id="contact-topic" name="topic" value={data.topic} onChange={change('topic')} {...invalid('topic')}>
     {topics.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
    </select>
   </Field>
   {data.topic === 'producto' && products.length > 0 && (
    <Field id="contact-product_id" label="Producto" optional error={errors.product_id}>
     <select id="contact-product_id" name="product_id" value={data.product_id} onChange={change('product_id')} {...invalid('product_id')}>
      <option value="">Elegí un producto</option>
      {products.map(product => <option key={product.id} value={product.id}>{product.name}</option>)}
     </select>
    </Field>
   )}
   <Field id="contact-message" label="Mensaje" error={errors.message}>
    <textarea id="contact-message" name="message" required minLength={10} maxLength={2000} rows={4} placeholder="Contanos qué necesitás: medidas, cantidades, dudas…" value={data.message} onChange={change('message')} {...invalid('message')} />
   </Field>

   <input className="contact-trap" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={data.website} onChange={change('website')} />

   <button type="submit" className="contact-submit" disabled={processing}>
    {processing ? 'Enviando…' : <>Enviar consulta <Send size={16} aria-hidden="true" /></>}
   </button>
   <div role="status" aria-live="polite">
    {wasSuccessful && !processing && <p className="contact-success"><CheckCircle2 size={17} aria-hidden="true" /> ¡Gracias! Recibimos tu consulta y te respondemos a la brevedad.</p>}
   </div>
  </form>
 );
}

function OpeningStatus() {
 const [status, setStatus] = useState(() => openingStatus());
 useEffect(() => {
  const timer = setInterval(() => setStatus(openingStatus()), 60_000);
  return () => clearInterval(timer);
 }, []);

 return <p className={`visit-us-status ${status.open ? 'is-open' : ''}`}>
  <span className="visit-us-status-dot" aria-hidden="true" />
  <strong>{status.label}</strong>
  <span>{status.detail}</span>
 </p>;
}

function CopyEmail() {
 const [copied, setCopied] = useState(false);
 useEffect(() => {
  if (!copied) return undefined;
  const timer = setTimeout(() => setCopied(false), 2000);
  return () => clearTimeout(timer);
 }, [copied]);

 const copy = async () => {
  try {
   await navigator.clipboard.writeText(contact.email);
   setCopied(true);
  } catch {
   window.location.href = `mailto:${contact.email}`;
  }
 };

 return <button type="button" className="visit-us-action" onClick={copy} aria-label={copied ? 'Correo copiado' : 'Copiar correo'}>
  {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
  <span aria-hidden="true">{copied ? 'Copiado' : 'Copiar'}</span>
  <span className="sr-only" aria-live="polite">{copied ? 'Correo copiado al portapapeles' : ''}</span>
 </button>;
}

const titleLines = [['El taller'], ['te ', 'espera.']];

export default function VisitUs({ products = [] }) {
 const reduced = useReducedMotion();
 const rows = [
  { icon: Phone, label: 'Teléfono', value: <a href={`tel:+54${contact.phone}`}>{contact.phoneLabel}</a>,
   action: <a className="visit-us-action" href={`tel:+54${contact.phone}`} tabIndex={-1} aria-hidden="true">Llamar <ArrowUpRight size={14} /></a> },
  { icon: Mail, label: 'Correo', value: <a href={`mailto:${contact.email}`}>{contact.email}</a>, action: <CopyEmail /> },
  { icon: MapPin, label: 'Dirección', value: <p>{contact.street}<span>{contact.city}</span></p> },
  { icon: Clock3, label: 'Atención al cliente', value: <p>{contact.hours}</p> },
 ];

 return (
  <section id="contacto" className="visit-us" aria-labelledby="visit-us-title">
   <div className="shell visit-us-layout">
    <div className="visit-us-content">
     <Reveal>
      <p className="visit-us-intro"><span aria-hidden="true" /> Contactanos</p>
     </Reveal>
     {/* El título entero dispara la animación: las líneas arrancan ocultas bajo su recorte y no se verían "en pantalla". */}
     <motion.h2 id="visit-us-title" aria-label="El taller te espera." initial={reduced ? false : 'hidden'} whileInView="shown" viewport={{ once: true, amount: 0.5 }}>
      {titleLines.map((line, index) => <span className="visit-us-title-mask" aria-hidden="true" key={index}>
       <motion.span variants={{ hidden: { y: '110%' }, shown: { y: 0 } }} transition={{ duration: 0.9, delay: index * 0.12, ease }}>
        {line.length > 1 ? <>{line[0]}<em>{line[1]}</em></> : line[0]}
       </motion.span>
      </span>)}
     </motion.h2>
     <Reveal transition={{ duration: reduced ? 0 : 0.65, delay: reduced ? 0 : 0.25, ease }}>
      <OpeningStatus />
     </Reveal>

     <ul className="visit-us-details">
      {rows.map(({ icon: Icon, label, value, action }, index) => <motion.li key={label} className="visit-us-detail"
       initial={reduced ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }}
       transition={{ duration: reduced ? 0 : 0.55, delay: reduced ? 0 : 0.1 + index * 0.08, ease }}>
       <span className="visit-us-icon"><Icon size={17} aria-hidden="true" /></span>
       <div className="visit-us-detail-text"><h3>{label}</h3>{value}</div>
       {action}
      </motion.li>)}
     </ul>
    </div>

    <Reveal className="visit-us-form-wrap" transition={{ duration: reduced ? 0 : 0.7, delay: reduced ? 0 : 0.15, ease }}>
     <ContactForm products={products} />
    </Reveal>
   </div>
  </section>
 );
}
