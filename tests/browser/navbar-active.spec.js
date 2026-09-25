import { test, expect } from '@playwright/test';

test('navbar indicator follows the current page and section', async ({ page }) => {
 const nav = page.locator('#primary-navigation');

 await page.goto('/catalogo');
 await expect(nav.getByRole('link', { name: 'Catálogo' })).toHaveAttribute('aria-current', 'page');
 await expect(nav.getByRole('link', { name: 'Nuestro taller' })).not.toHaveAttribute('aria-current');

 await nav.getByRole('link', { name: 'Nuestro taller' }).click();
 await expect(page).toHaveURL(/\/taller$/);
 await expect(nav.getByRole('link', { name: 'Nuestro taller' })).toHaveAttribute('aria-current', 'page');
 await expect(nav.getByRole('link', { name: 'Nuestro taller' })).toHaveCSS('text-decoration-line', 'underline');
 await expect(nav.getByRole('link', { name: 'Catálogo' })).not.toHaveAttribute('aria-current');

 await nav.getByRole('link', { name: 'Contactanos' }).click();
 await expect(page).toHaveURL(/\/#contacto$/);
 await expect(nav.getByRole('link', { name: 'Contactanos' })).toHaveAttribute('aria-current', 'location');
 await expect(nav.getByRole('link', { name: 'Contactanos' })).toHaveCSS('text-decoration-line', 'underline');
 await expect(nav.getByRole('link', { name: 'Catálogo' })).not.toHaveAttribute('aria-current');

 await page.goto('/#como-comprar');
 await expect(nav.getByRole('button', { name: 'Más' })).toHaveAttribute('aria-current', 'location');
});

test('mobile navigation marks the workshop page', async ({ page }) => {
 await page.setViewportSize({ width: 390, height: 844 });
 await page.goto('/taller');
 await page.getByRole('button', { name: 'Abrir menú' }).click();
 const nav = page.locator('.navbar-mobile-links');
 await expect(nav.getByRole('link', { name: 'Nuestro taller' })).toHaveAttribute('aria-current', 'page');
 await expect(nav.getByRole('link', { name: 'Catálogo' })).not.toHaveAttribute('aria-current');
});
