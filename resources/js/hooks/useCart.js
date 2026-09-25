import { useEffect, useState } from 'react';
import { sanitizeCart, orderMessage } from '../cart';

export function useCart(products, money) {
 const [cart, setCart] = useState(() => { try { return sanitizeCart(JSON.parse(localStorage.getItem('gallo-negro-cart')), products); } catch { return []; } });
 const [notice, setNotice] = useState('');
 useEffect(() => { try { localStorage.setItem('gallo-negro-cart', JSON.stringify(cart)); } catch {} }, [cart]);
 useEffect(() => { if (notice) { const id = setTimeout(() => setNotice(''), 2600); return () => clearTimeout(id); } }, [notice]);
 const items = sanitizeCart(cart, products).map(item => ({ ...products.find(p => p.id === item.id), quantity: item.quantity }));
 const count = items.reduce((n, p) => n + p.quantity, 0);
 const total = items.reduce((n, p) => n + p.price * p.quantity, 0);
 const message = orderMessage(items, money);
 const add = product => { setCart(old => { const match = old.find(p => p.id === product.id); return match ? old.map(p => p.id === product.id ? { ...p, quantity: Math.min(99, p.quantity + 1) } : p) : [...old, { id: product.id, quantity: 1 }]; }); setNotice(`${product.name} agregado a tu pedido`); };
 const quantity = (id, delta) => setCart(old => old.map(p => p.id === id ? { ...p, quantity: Math.min(99, p.quantity + delta) } : p).filter(p => p.quantity > 0));
 const remove = id => setCart(old => old.filter(i => i.id !== id));
 return { items, count, total, message, notice, setNotice, add, quantity, remove };
}
