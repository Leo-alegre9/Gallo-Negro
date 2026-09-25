import { test, expect } from '@playwright/test';

test('category filtering, product details and order note work', async ({ page }) => {
 const errors = [];
 page.on('pageerror', error => errors.push(error.message));
 await page.emulateMedia({ reducedMotion: 'reduce' });
 await page.goto('/catalogo');
 await page.getByRole('button', { name: 'Parrillas (1)', exact: true }).click();
 await expect(page.locator('.product-grid article')).toHaveCount(1);
 await page.getByRole('button', { name: 'Parrilla del Monte', exact: true }).click();
 await expect(page.getByRole('dialog')).toBeVisible();
 await expect(page.getByRole('button', { name: 'Consultar por WhatsApp', exact: true })).toBeVisible();
 await page.getByRole('link', { name: 'Ver ficha completa' }).click();
 await expect(page).toHaveURL(/productos\/parrilla-del-monte$/);
 await expect(page.locator('h1')).toHaveText('Parrilla del Monte');
 await page.getByRole('button', { name: 'Agregar a mi pedido' }).click();
 await page.getByRole('button', { name: 'Ver pedido', exact: true }).click();
 await page.locator('#cart-note').fill('Quiero otra medida');
 await page.getByRole('button', { name: 'Ver mensaje para WhatsApp' }).click();
 await expect(page.locator('.message-preview')).toContainText('Quiero otra medida');
 await expect(page.locator('.message-preview')).toContainText('Imagen:');
 expect(errors).toEqual([]);
});

for (const width of [1440, 390]) {
 test(`product and login layout at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/productos/fogonero-encuentro');
  await expect(page.locator('h1')).toHaveText('Fogonero Encuentro');
  await expect(page.locator('.product-gallery img').first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  await page.screenshot({ path: `test-results/product-${width}.png`, fullPage: true });
  await page.goto('/admin/login');
  await expect(page.getByRole('heading', { name: 'Panel de administración' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  await page.screenshot({ path: `test-results/admin-login-${width}.png`, fullPage: true });
 });
}
