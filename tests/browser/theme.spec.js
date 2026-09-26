import { test, expect } from '@playwright/test';

test('store stays dark with a previously saved light preference', async ({ page }) => {
 await page.addInitScript(() => localStorage.setItem('gallo-negro-theme', 'light'));
 await page.goto('/catalogo');
 await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
 await expect(page.locator('.theme-toggle')).toHaveCount(0);
 await page.locator('#primary-navigation').getByRole('link', { name:'Nuestro taller' }).click();
 await page.reload();
 await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('embers cover the lower homepage and exclude the footer', async ({ page }) => {
 await page.emulateMedia({ reducedMotion:'reduce' });
 await page.goto('/');
 const background = page.locator('.galaxy-sections');
 await expect(background.locator('canvas')).toBeVisible();
 for (const selector of ['#catalogo', '#taller', '.visit-us']) {
  await expect(background.locator(selector)).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
 }
 await expect(background.locator('.site-footer')).toHaveCount(0);
 await page.setViewportSize({ width:320, height:700 });
 await expect(page.getByRole('button', { name:'Abrir menú' })).toBeVisible();
 expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
