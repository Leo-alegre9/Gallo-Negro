import test from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeCart, orderMessage } from '../../resources/js/cart.js';
test('restores only known products with bounded positive quantities', () => {
 assert.deepEqual(sanitizeCart([{id:'a',quantity:200},{id:'a',quantity:2},{id:'b',quantity:-1},{id:'unknown',quantity:3},null], [{id:'a'},{id:'b'}]), [{id:'a',quantity:99}]);
 assert.deepEqual(sanitizeCart({}, []), []);
});
test('WhatsApp includes quantities, subtotals and total', () => {
 const message = orderMessage([{name:'Fogonero',quantity:2,price:100},{name:'Parrilla',quantity:1,price:50}], n => `$${n}`);
 assert.match(message, /2 × Fogonero — \$200/);
 assert.match(message, /Total estimado: \$250/);
});
