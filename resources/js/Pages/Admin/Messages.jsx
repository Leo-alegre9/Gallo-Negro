import React from 'react';
import { Link, router } from '@inertiajs/react';
import { Inbox, Mail, MailOpen, Phone, Reply, Trash2 } from 'lucide-react';
import AdminLayout from '../../Components/AdminLayout';

const filters = [
 ['todas', 'Todas', 'all'],
 ['sin-leer', 'Sin leer', 'unread'],
];

function MessageCard({ message }) {
 const setRead = read => router.patch(`/admin/consultas/${message.id}`, { read }, { preserveScroll: true });
 const remove = () => {
  if (window.confirm(`¿Eliminar la consulta de ${message.name}? No se puede deshacer.`)) router.delete(`/admin/consultas/${message.id}`, { preserveScroll: true });
 };
 const replySubject = encodeURIComponent(`Re: ${message.topic}${message.product ? ` — ${message.product.name}` : ''}`);

 return <article className={`admin-message ${message.read ? '' : 'is-unread'}`}>
  <header className="admin-message-header">
   <div>
    <h2>{message.name}</h2>
    <p className="admin-message-contact">
     <a href={`mailto:${message.email}`}>{message.email}</a>
     {message.phone && <a href={`tel:${message.phone.replace(/[^\d+]/g, '')}`}><Phone size={12} aria-hidden="true" /> {message.phone}</a>}
    </p>
   </div>
   <div className="admin-message-meta">
    {!message.read && <span className="admin-badge admin-badge-amber">Sin leer</span>}
    <time dateTime={message.created_at}>{new Date(message.created_at).toLocaleString('es-AR', { dateStyle: 'medium', timeStyle: 'short' })}</time>
   </div>
  </header>
  <p className="admin-message-topic">
   <strong>{message.topic}</strong>
   {message.product && <> · {message.product.url ? <a href={message.product.url} target="_blank" rel="noopener noreferrer">{message.product.name}</a> : <>{message.product.name} <small>(eliminado)</small></>}</>}
  </p>
  <p className="admin-message-body">{message.message}</p>
  <div className="admin-row-actions">
   <a href={`mailto:${message.email}?subject=${replySubject}`} onClick={() => !message.read && setRead(true)}><Reply size={14} aria-hidden="true" /> Responder</a>
   <button type="button" onClick={() => setRead(!message.read)}>
    {message.read ? <><Mail size={14} aria-hidden="true" /> Marcar como no leída</> : <><MailOpen size={14} aria-hidden="true" /> Marcar como leída</>}
   </button>
   <button type="button" onClick={remove}><Trash2 size={14} aria-hidden="true" /> Eliminar</button>
  </div>
 </article>;
}

export default function Messages({ messages, filter, counts }) {
 return <AdminLayout title="Consultas">
  <nav className="admin-message-filters" aria-label="Filtrar consultas">
   {filters.map(([value, label, key]) => <Link key={value} href={value === 'todas' ? '/admin/consultas' : `/admin/consultas?filtro=${value}`} preserveScroll aria-current={filter === value ? 'page' : undefined} className={filter === value ? 'active' : ''}>{label} <span>{counts[key]}</span></Link>)}
  </nav>

  {messages.data.length ? <div className="admin-message-list">{messages.data.map(message => <MessageCard key={message.id} message={message} />)}</div>
   : <div className="admin-table-wrap"><div className="admin-empty"><Inbox size={30} aria-hidden="true" /><strong>{filter === 'sin-leer' ? 'No hay consultas sin leer' : 'Todavía no llegaron consultas'}</strong><p>{filter === 'sin-leer' ? 'Estás al día con todos los mensajes.' : 'Cuando alguien complete el formulario de contacto de la tienda, la consulta va a aparecer acá.'}</p></div></div>}

  {messages.last_page > 1 && <nav className="admin-pagination" aria-label="Páginas de consultas">{messages.links.map((link, index) => link.url ? <Link key={index} href={link.url} preserveScroll className={link.active ? 'active' : ''} dangerouslySetInnerHTML={{ __html: link.label }} /> : <span key={index} dangerouslySetInnerHTML={{ __html: link.label }} />)}</nav>}
 </AdminLayout>;
}
