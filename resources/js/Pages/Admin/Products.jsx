import React from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '../../Components/AdminLayout';
import { money } from '../../data/products';
import { stockLabels } from '../../catalog';
import { Plus, Pencil, RotateCcw } from 'lucide-react';

const filters = [['todos', 'Todos'], ['activos', 'Activos'], ['baja', 'Dados de baja'], ['eliminados', 'Eliminados']];

export default function Products({ products, status }) {
 const confirmDelete = product => {
  if (window.confirm(`¿Eliminar “${product.name}”? Podrás restaurarlo desde Eliminados.`)) router.delete(`/admin/productos/${product.id}`);
 };

 return <AdminLayout title="Productos" actions={<Link className="admin-primary" href="/admin/productos/create"><Plus size={18} aria-hidden="true" />Cargar producto</Link>}>
  <div className="admin-tabs">{filters.map(([value, label]) => <Link key={value} href={value === 'todos' ? '/admin/productos' : `/admin/productos?estado=${value}`} className={status === value ? 'active' : ''}>{label}</Link>)}</div>
  <div className="admin-table-wrap"><table className="admin-table admin-products-table"><thead><tr><th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>
   {products.data.map(product => <tr key={product.id}>
    <td><div className="admin-product-name"><img src={product.image} alt="" /><div><strong>{product.name}</strong>{product.isDemo && <small>Datos de muestra</small>}</div></div></td>
    <td>{product.category}{product.subcategory && <small>{product.subcategory}</small>}</td>
    <td>{product.promoPrice !== null ? <><del>{money(product.price)}</del><strong>{money(product.promoPrice)}</strong></> : money(product.price)}</td>
    <td><span className={`admin-badge admin-badge-${product.stockStatus === 'available' ? 'green' : product.stockStatus === 'ask' ? 'amber' : 'red'}`}>{stockLabels[product.stockStatus]}</span></td>
    <td><span className={`admin-badge admin-badge-${product.deletedAt ? 'red' : product.isActive ? 'green' : 'muted'}`}>{product.deletedAt ? 'Eliminado' : product.isActive ? 'Activo' : 'De baja'}</span></td>
    <td><div className="admin-row-actions">
     {product.deletedAt
      ? <button type="button" onClick={() => router.patch(`/admin/productos/${product.id}/restaurar`)}><RotateCcw size={13} aria-hidden="true" />Restaurar</button>
      : <><Link href={`/admin/productos/${product.id}/edit`}><Pencil size={13} aria-hidden="true" />Editar</Link><button type="button" onClick={() => router.patch(`/admin/productos/${product.id}/estado`)}>{product.isActive ? 'Dar de baja' : 'Activar'}</button><button type="button" className="danger" onClick={() => confirmDelete(product)}>Eliminar</button></>}
    </div></td>
   </tr>)}
  </tbody></table>{!products.data.length && <p className="admin-empty">No hay productos en esta vista.</p>}</div>
  <nav className="admin-pagination" aria-label="Páginas de productos">{products.links.map((link, index) => link.url ? <Link key={index} href={link.url} className={link.active ? 'active' : ''} dangerouslySetInnerHTML={{ __html: link.label }} /> : <span key={index} dangerouslySetInnerHTML={{ __html: link.label }} />)}</nav>
 </AdminLayout>;
}
