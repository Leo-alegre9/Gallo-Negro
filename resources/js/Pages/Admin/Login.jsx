import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import '../../../css/admin.css';

export default function Login() {
 const { data, setData, post, processing, errors } = useForm({ email: '', password: '' });
 const submit = event => { event.preventDefault(); post('/admin/login'); };

 return <div className="admin-login-page">
  <Head title="Ingresar — Administración Gallo Negro" />
  <form className="admin-login" onSubmit={submit}>
   <img src="/images/logo.png" alt="" width="70" height="70" />
   <p className="admin-kicker">Gallo Negro</p>
   <h1>Panel de administración</h1>
   <p>Ingresá con tu cuenta para gestionar el catálogo.</p>
   <label>Correo electrónico<input type="email" autoComplete="username" required value={data.email} onChange={event => setData('email', event.target.value)} /></label>
   {errors.email && <span className="admin-error">{errors.email}</span>}
   <label>Contraseña<input type="password" autoComplete="current-password" required value={data.password} onChange={event => setData('password', event.target.value)} /></label>
   {errors.password && <span className="admin-error">{errors.password}</span>}
   <button type="submit" className="admin-primary" disabled={processing}>Ingresar</button>
   <Link href="/">Volver a la tienda</Link>
  </form>
 </div>;
}
