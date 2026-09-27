import { test, expect } from '@playwright/test';

test('fire bowl enters, exits and reveals the usable hero', async ({ page }) => {
 await page.goto('/');
 const intro = page.locator('.forge-intro');
 await expect(intro).toHaveAttribute('data-phase', 'loading');
 await expect(intro.locator('.forge-intro-logo')).toBeVisible();
 await expect(intro).toHaveAttribute('data-phase', 'logo-out');
 await expect(intro).toHaveCount(0);
 await expect(page.locator('.hero-scene h1')).toBeVisible();
 await page.locator('.hero-scene').getByRole('link', { name:'Ver catálogo', exact:true }).click();
 await expect(page).toHaveURL(/\/catalogo$/);
 await page.locator('.navbar-logo').click();
 await expect(page.locator('.forge-intro')).toHaveCount(0);
});

test('reduced motion skips the intro on mobile', async ({ page }) => {
 await page.emulateMedia({ reducedMotion:'reduce' });
 await page.setViewportSize({ width:320, height:700 });
 await page.goto('/');
 await expect(page.locator('.forge-intro')).toHaveCount(0);
 await expect(page.locator('.hero-scene h1')).toBeVisible();
});
