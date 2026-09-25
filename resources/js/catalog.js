export const stockLabels = {
 available: 'Disponible',
 ask: 'Consultar disponibilidad',
 out: 'Sin stock',
};

export function recordProductView(productId) {
 const token = document.querySelector('meta[name="csrf-token"]')?.content;
 if (!token) return;
 fetch('/catalogo/vistas', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': token, Accept: 'application/json' },
  body: JSON.stringify({ product_id: productId }),
  keepalive: true,
 }).catch(() => {});
}
