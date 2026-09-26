import test from 'node:test';
import assert from 'node:assert/strict';
import { openingStatus } from '../../resources/js/data/contact.js';

// Buenos Aires está en UTC-3 todo el año.
const at = iso => openingStatus(new Date(`${iso}-03:00`));

test('workshop is open on weekdays between 8 and 16 in Buenos Aires', () => {
 assert.deepEqual(at('2026-09-23T08:00'), { open: true, label: 'Abierto ahora', detail: 'Atendemos hasta las 16 h' });
 assert.equal(at('2026-09-23T15:59').open, true);
});

test('workshop tells when it opens next', () => {
 assert.equal(at('2026-09-23T07:30').detail, 'Abrimos hoy a las 8 h');
 assert.equal(at('2026-09-23T16:00').detail, 'Abrimos mañana a las 8 h');
 assert.equal(at('2026-09-25T18:00').detail, 'Abrimos el lunes a las 8 h');
 assert.equal(at('2026-09-26T11:00').detail, 'Abrimos el lunes a las 8 h');
 assert.equal(at('2026-09-27T11:00').detail, 'Abrimos mañana a las 8 h');
});
