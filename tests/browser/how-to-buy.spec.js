import { test, expect } from '@playwright/test';

test('purchase guide highlights steps on scroll and opens the order', async ({ page }) => {
 await page.emulateMedia({ reducedMotion:'reduce' });
 await page.goto('/#como-comprar');
 const guide = page.locator('#como-comprar');
 await expect(guide.locator('li')).toHaveCount(4);
 await expect(guide.locator('.how-to-buy-heading')).toHaveCSS('position', 'sticky');
 const third = guide.locator('[data-step="2"]');
 await third.evaluate(element => element.scrollIntoView({ block:'center', behavior:'instant' }));
 await expect(third).toHaveClass(/is-active/);
 await page.screenshot({ path:'test-results/how-to-buy-desktop.png' });
 await guide.getByRole('button', { name:'Ver mi pedido', exact:true }).click();
 await expect(page.getByRole('dialog')).toBeVisible();
});

test('mobile purchase guide remains readable without horizontal overflow', async ({ page }) => {
 await page.setViewportSize({ width:390, height:844 });
 await page.emulateMedia({ reducedMotion:'reduce' });
 await page.goto('/#como-comprar');
 await expect(page.locator('.how-to-buy-heading')).toHaveCSS('position', 'static');
 await expect(page.locator('#como-comprar h2')).toBeVisible();
 expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
 await page.screenshot({ path:'test-results/how-to-buy-mobile.png' });
});
