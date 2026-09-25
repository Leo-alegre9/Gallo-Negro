import { test, expect } from '@playwright/test';

test('admin can log in, edit a product and see its audit', async ({ page }) => {
 test.skip(!process.env.ADMIN_E2E_URL, 'Requires the isolated admin test server');
 const base = process.env.ADMIN_E2E_URL;
 const errors = [];
 page.on('pageerror', error => errors.push(error.message));
 await page.goto(`${base}/admin/login`);
 await page.getByLabel('Correo electrónico').fill('browser@example.test');
 await page.getByLabel('Contraseña').fill('OnlyForIsolatedBrowserTests');
 await page.getByRole('button', { name: 'Ingresar', exact: true }).click();
 await expect(page.getByRole('heading', { name: 'Resumen', exact: true })).toBeVisible();
 await page.screenshot({ path: 'test-results/admin-dashboard.png', fullPage: true });
 for (const width of [1440, 390]) {
  await page.setViewportSize({ width, height: 900 });
  for (const [path, label] of [['/admin', 'Resumen'], ['/admin/productos', 'Productos'], ['/admin/categorias', 'Categorías'], ['/admin/auditoria', 'Auditoría']]) {
   await page.goto(`${base}${path}`);
   const active = page.getByRole('navigation', { name: 'Administración', exact: true }).getByRole('link', { name: label, exact: true });
   await expect(active).toHaveAttribute('aria-current', 'page');
   await expect(active).toBeInViewport();
   expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
   await page.screenshot({ path: `test-results/admin-${label}-${width}.png`, fullPage: true });
  }
 }
 await page.setViewportSize({ width: 1440, height: 900 });
 await page.getByRole('link', { name: 'Productos', exact: true }).click();
 await page.getByRole('link', { name: 'Editar', exact: true }).first().click();
 await page.getByLabel('Modelo', { exact: true }).fill('GN-E2E');
 await page.getByRole('button', { name: 'Guardar cambios' }).click();
 await expect(page.getByRole('status')).toContainText('Producto actualizado');
 await page.setViewportSize({ width: 390, height: 844 });
 expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
 await page.screenshot({ path: 'test-results/admin-form-mobile.png', fullPage: true });
 await page.getByRole('link', { name: 'Auditoría', exact: true }).click();
 await expect(page.locator('table')).toContainText('Administrador de prueba');
 await page.getByRole('button', { name: 'Cerrar sesión' }).click();
 await expect(page.getByRole('heading', { name: 'Panel de administración' })).toBeVisible();
 expect(errors).toEqual([]);
});
