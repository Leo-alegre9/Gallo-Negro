export function sanitizeCart(value, products) {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  return value.filter(item => item && products.some(p => p.id === item.id && p.stockStatus !== 'out') && Number.isInteger(item.quantity) && item.quantity > 0 && !seen.has(item.id) && seen.add(item.id)).map(item => ({ id: item.id, quantity: Math.min(item.quantity, 99) }));
}
export function orderMessage(items, format, note = '') {
  return ['Hola Gallo Negro, quiero consultar por este pedido:', '', ...items.flatMap(p => [
   `${p.quantity} × ${p.name} — ${format(p.price * p.quantity)}`,
   ...(p.url ? [`Ficha: ${p.url}`] : []),
   ...(p.absoluteImageUrl ? [`Imagen: ${p.absoluteImageUrl}`] : []),
   '',
  ]), `Total estimado: ${format(items.reduce((sum, p) => sum + p.price * p.quantity, 0))}`, ...(note.trim() ? [`Mi consulta: ${note.trim()}`] : []), '¿Me confirman disponibilidad y opciones de entrega?'].join('\n');
}
