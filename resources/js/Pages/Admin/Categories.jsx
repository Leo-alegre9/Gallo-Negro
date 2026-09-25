import React, { useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import AdminLayout from '../../Components/AdminLayout';

const empty = { name: '', parent_id: '', sort_order: 0, is_active: 1 };

export default function Categories({ categories }) {
 const [editingId, setEditingId] = useState(null);
 const { data, setData, reset, post, patch, processing, errors, clearErrors } = useForm(empty);
 const parents = categories.filter(category => !category.parent_id);
 const edit = category => {
  setEditingId(category.id);
  setData({ name: category.name, parent_id: category.parent_id || '', sort_order: category.sort_order, is_active: category.is_active ? 1 : 0 });
  clearErrors();
  window.scrollTo({ top: 0, behavior: 'smooth' });
 };
 const cancel = () => { setEditingId(null); reset(); clearErrors(); };
 const submit = event => {
  event.preventDefault();
  const options = { onSuccess: cancel };
  editingId ? patch(`/admin/categorias/${editingId}`, options) : post('/admin/categorias', options);
 };
 const remove = category => {
  if (window.confirm(`¿Eliminar la categoría “${category.name}”? Solo se puede si está vacía.`)) router.delete(`/admin/categorias/${category.id}`);
 };

 return <AdminLayout title="Categorías y subcategorías">
  <div className="admin-categories-layout">
   <section className="admin-panel"><h2>{editingId ? 'Editar categoría' : 'Nueva categoría'}</h2><p>Una subcategoría pertenece a una sola categoría principal.</p>
    <form className="admin-category-form" onSubmit={submit}>
     <label>Nombre<input required maxLength={100} value={data.name} onChange={event => setData('name', event.target.value)} /></label>{errors.name && <small className="admin-error">{errors.name}</small>}
     <label>Depende de<select value={data.parent_id} onChange={event => setData('parent_id', event.target.value)}><option value="">Categoría principal</option>{parents.filter(item => item.id !== editingId).map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>{errors.parent_id && <small className="admin-error">{errors.parent_id}</small>}
     <label>Orden<input type="number" min="0" value={data.sort_order} onChange={event => setData('sort_order', event.target.value)} /></label>
     <label className="admin-check"><input type="checkbox" checked={Boolean(Number(data.is_active))} onChange={event => setData('is_active', event.target.checked ? 1 : 0)} /> Visible en el catálogo</label>
     <div className="admin-form-actions"><button type="submit" className="admin-primary" disabled={processing}>{editingId ? 'Guardar cambios' : 'Crear categoría'}</button>{editingId && <button type="button" onClick={cancel}>Cancelar</button>}</div>
    </form>
   </section>
   <section className="admin-panel"><h2>Categorías cargadas</h2><div className="admin-category-list">{categories.map(category => <div key={category.id} className={category.parent_id ? 'is-child' : ''}><div><strong>{category.name}</strong><span>{category.parent?.name || 'Principal'} · {category.is_active ? 'Visible' : 'Oculta'}</span></div><div><button type="button" onClick={() => edit(category)}>Editar</button><button type="button" className="danger" onClick={() => remove(category)}>Eliminar</button></div></div>)}</div>{!categories.length && <p className="admin-empty">Todavía no hay categorías.</p>}</section>
  </div>
 </AdminLayout>;
}
