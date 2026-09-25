import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const files = dir => readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? files(join(dir, entry.name)) : [join(dir, entry.name)]);

test('every Inertia page rendered by the server is registered in app.jsx', () => {
 const app = readFileSync('resources/js/app.jsx', 'utf8');
 const registered = new Set([...app.matchAll(/'([\w/]+)':\s*\w+|[{,]\s*(\w+)(?=\s*[,}])/g)].map(match => match[1] || match[2]));
 const rendered = files('app').filter(file => file.endsWith('.php'))
  .flatMap(file => [...readFileSync(file, 'utf8').matchAll(/Inertia::render\('([^']+)'/g)].map(match => match[1]));
 assert.ok(rendered.length > 0);
 for (const page of new Set(rendered)) assert.ok(registered.has(page), `Falta registrar la página "${page}" en resources/js/app.jsx`);
});
