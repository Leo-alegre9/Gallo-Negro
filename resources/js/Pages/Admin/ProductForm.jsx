import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import AdminLayout from '../../Components/AdminLayout';
import AdminProductImages, { savedGallery } from '../../Components/AdminProductImages';

function Field({ label, error, children }) {
 return <label className="admin-field"><span>{label}</span>{children}{error && <small className="admin-error">{error}</small>}</label>;
}

export default function ProductForm({ product, categories }) {
 const editing = Boolean(product);
 const [uploadVersion, setUploadVersion] = useState(0);
 const [gallery, setGallery] = useState(() => savedGallery(product));
 const { data, setData, post, transform, processing, errors } = useForm({
  ...(editing ? { _method: 'put' } : {}),
  name: product?.name || '',
  category_id: product?.category_id || '',
  subcategory_id: product?.subcategory_id || '',
  model: product?.model || '',
  short_description: product?.short_description || '',
  measurements: product?.measurements || '',
  colors_variants: product?.colors_variants || '',
  material: product?.material || '',
  finish: product?.finish || '',
  price: product?.price ?? '',
  promo_price: product?.promo_price ?? '',
  stock_status: product?.stock_status || 'available',
  tag: product?.tag || '',
  is_active: product?.is_active === false ? 0 : 1,
  is_featured: product?.is_featured ? 1 : 0,
  sort_order: product?.sort_order ?? 0,
  primary_image: null,
  gallery_images: [],
  remove_images: [],
 });
 const selectedCategory = categories.find(category => String(category.id) === String(data.category_id));
 const submit = event => {
  event.preventDefault();
  let newIndex = 0;
  transform(values => ({
   ...values,
   gallery_images: gallery.filter(image => image.file).map(image => image.file),
   gallery_order: JSON.stringify(gallery.map(image => image.file ? `new:${newIndex++}` : `saved:${image.id}`)),
   remove_images: (product?.images || []).filter(image => !gallery.some(item => item.id === image.id)).map(image => image.id),
  }));
  post(editing ? `/admin/productos/${product.id}` : '/admin/productos', {
   forceFormData: true,
   onSuccess: page => {
    setData(previous => ({ ...previous, primary_image: null, gallery_images: [], remove_images: [] }));
    setGallery(savedGallery(page.props.product));
    setUploadVersion(previous => previous + 1);
   },
  });
 };

 return <AdminLayout title={editing ? `Editar ${product.name}` : 'Cargar producto'} actions={<Link className="admin-text-link" href="/admin/productos">Volver a productos</Link>}>
  {!categories.length && <p className="admin-warning">Primero creá una categoría para poder cargar productos. <Link href="/admin/categorias">Ir a categorías</Link></p>}
  {product?.is_demo && <p className="admin-warning">Esta ficha contiene datos de muestra. Al guardarla, se marcará como producto real.</p>}
  <form onSubmit={submit} className="admin-product-form">
   <section className="admin-form-section"><h2>Información del producto</h2><div className="admin-form-grid">
    <Field label="Nombre *" error={errors.name}><input required maxLength={160} value={data.name} onChange={event => setData('name', event.target.value)} /></Field>
    <Field label="Modelo" error={errors.model}><input value={data.model} onChange={event => setData('model', event.target.value)} /></Field>
    <Field label="Categoría *" error={errors.category_id}><select required value={data.category_id} onChange={event => { setData(previous => ({ ...previous, category_id: event.target.value, subcategory_id: '' })); }}><option value="">Elegir categoría</option>{categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}</select></Field>
    <Field label="Subcategoría" error={errors.subcategory_id}><select value={data.subcategory_id} onChange={event => setData('subcategory_id', event.target.value)}><option value="">Sin subcategoría</option>{(selectedCategory?.subcategories || []).map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></Field>
    <Field label="Medidas" error={errors.measurements}><input value={data.measurements} onChange={event => setData('measurements', event.target.value)} placeholder="Ej.: 80 cm de diámetro × 55 cm de alto" /></Field>
    <Field label="Colores o variantes" error={errors.colors_variants}><input value={data.colors_variants} onChange={event => setData('colors_variants', event.target.value)} placeholder="Ej.: negro, óxido, acero natural" /></Field>
    <Field label="Material" error={errors.material}><input value={data.material} onChange={event => setData('material', event.target.value)} /></Field>
    <Field label="Terminación" error={errors.finish}><input value={data.finish} onChange={event => setData('finish', event.target.value)} /></Field>
    <Field label="Descripción breve *" error={errors.short_description}><textarea required maxLength={1500} rows={4} value={data.short_description} onChange={event => setData('short_description', event.target.value)} /></Field>
   </div></section>
   <section className="admin-form-section"><h2>Precio y publicación</h2><div className="admin-form-grid">
    <Field label="Precio normal (ARS) *" error={errors.price}><input type="number" min="0" step="1" required value={data.price} onChange={event => setData('price', event.target.value)} /></Field>
    <Field label="Precio promocional (ARS)" error={errors.promo_price}><input type="number" min="0" step="1" value={data.promo_price} onChange={event => setData('promo_price', event.target.value)} /><small>Si se completa, el precio normal aparecerá tachado.</small></Field>
    <Field label="Stock *" error={errors.stock_status}><select value={data.stock_status} onChange={event => setData('stock_status', event.target.value)}><option value="available">Disponible</option><option value="ask">Consultar disponibilidad</option><option value="out">Sin stock</option></select></Field>
    <Field label="Etiqueta destacada" error={errors.tag}><input value={data.tag} onChange={event => setData('tag', event.target.value)} placeholder="Ej.: El favorito de la ronda" /></Field>
    <Field label="Orden en el catálogo" error={errors.sort_order}><input type="number" min="0" value={data.sort_order} onChange={event => setData('sort_order', event.target.value)} /></Field>
   </div><div className="admin-checks"><label><input type="checkbox" checked={Boolean(Number(data.is_active))} onChange={event => setData('is_active', event.target.checked ? 1 : 0)} /> Producto activo</label><label><input type="checkbox" checked={Boolean(Number(data.is_featured))} onChange={event => setData('is_featured', event.target.checked ? 1 : 0)} /> Destacar en la portada</label></div></section>
   <AdminProductImages key={uploadVersion} product={product} primary={data.primary_image} setPrimary={file => setData('primary_image', file)} gallery={gallery} setGallery={setGallery} processing={processing} errors={errors} />
   <div className="admin-form-actions"><button type="submit" className="admin-primary" disabled={processing || !categories.length}>{processing ? 'Guardando…' : editing ? 'Guardar cambios' : 'Crear producto'}</button><Link href="/admin/productos">Cancelar</Link></div>
  </form>
 </AdminLayout>;
}
