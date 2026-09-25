import React from 'react';
import { Link } from '@inertiajs/react';
import AdminLayout from '../../Components/AdminLayout';

const actionLabels = { created: 'Creó', updated: 'Editó', deleted: 'Eliminó', restored: 'Restauró', deactivated: 'Dio de baja', reactivated: 'Activó' };
const entityLabels = { Product: 'producto', Category: 'categoría' };

export default function Audit({ audits }) {
 return <AdminLayout title="Auditoría">
  <p className="admin-lead">Cambios realizados por cada cuenta administradora. Las eliminaciones de productos pueden restaurarse.</p>
  <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Fecha</th><th>Administrador</th><th>Acción</th><th>Elemento</th><th>Detalle</th></tr></thead><tbody>{audits.data.map(entry => <tr key={entry.id}>
   <td>{new Date(entry.created_at).toLocaleString('es-AR')}</td>
   <td>{entry.user?.name || 'Cuenta eliminada'}<small>{entry.user?.email}</small></td>
   <td>{actionLabels[entry.action] || entry.action}</td>
   <td>{entityLabels[entry.entity_type] || entry.entity_type} · {entry.after?.name || entry.before?.name || entry.entity_id}</td>
   <td><details><summary>Ver cambios</summary><div className="admin-audit-detail"><div><strong>Antes</strong><pre>{JSON.stringify(entry.before, null, 2) || '—'}</pre></div><div><strong>Después</strong><pre>{JSON.stringify(entry.after, null, 2) || '—'}</pre></div></div></details></td>
  </tr>)}</tbody></table>{!audits.data.length && <p className="admin-empty">Todavía no se registraron cambios.</p>}</div>
  <nav className="admin-pagination" aria-label="Páginas de auditoría">{audits.links.map((link, index) => link.url ? <Link key={index} href={link.url} className={link.active ? 'active' : ''} dangerouslySetInnerHTML={{ __html: link.label }} /> : <span key={index} dangerouslySetInnerHTML={{ __html: link.label }} />)}</nav>
 </AdminLayout>;
}
