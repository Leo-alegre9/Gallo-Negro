import React from 'react';
import { useForm } from '@inertiajs/react';
import { CheckCircle2, Clock3, Mail, MapPin, Phone, Send } from 'lucide-react';
import '../../css/visit-us.css';

const phone = '1135879396';
const email = 'ventas@gallonegroba.com.ar';
const address = 'Villa Udaondo 4560, Ituzaingó, Provincia de Buenos Aires';
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

export default function VisitUs({ products = [] }) {
 return (
  <section id="contacto" className="visit-us" aria-labelledby="visit-us-title">
   <div className="shell visit-us-layout">
    <div className="visit-us-content">
     <p className="visit-us-intro"><MapPin size={16} aria-hidden="true" /> Contactanos</p>
     <h2 id="visit-us-title">El taller te espera.</h2>

     <div className="visit-us-details">
      <div className="visit-us-detail">
       <MapPin size={19} aria-hidden="true" />
       <div><h3>Dirección</h3><p>{address}</p></div>
      </div>
      <div className="visit-us-detail">
       <Clock3 size={19} aria-hidden="true" />
       <div><h3>Atención al cliente</h3><p>Lunes a viernes, de 8 a 16 h</p></div>
      </div>
      <div className="visit-us-detail">
       <Phone size={19} aria-hidden="true" />
       <div><h3>Teléfono</h3><a href={`tel:+54${phone}`}>11 3587-9396</a></div>
      </div>
      <div className="visit-us-detail">
       <Mail size={19} aria-hidden="true" />
       <div><h3>Correo</h3><a href={`mailto:${email}`}>{email}</a></div>
      </div>
     </div>
    </div>

    <ContactForm products={products} />
   </div>
  </section>
 );
}
