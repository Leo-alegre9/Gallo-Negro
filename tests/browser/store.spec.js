import { test, expect } from '@playwright/test';
test('catalog, detail, cart persistence and demo checkout', async ({page}) => {
 const errors = []; page.on('pageerror', e => errors.push(e.message));
 await page.goto('/');
 await expect(page.getByRole('heading',{level:1})).toContainText('Donde hay fuego');
 await page.getByRole('navigation', { name: 'Principal', exact: true }).getByRole('link', { name: 'Catálogo', exact: true }).click();
 await page.getByRole('button',{name:'Parrillas',exact:true}).click();
 await expect(page.locator('.product')).toHaveCount(1);
 await page.getByRole('button',{name:'Todos',exact:true}).click();
 await page.getByLabel('Buscar productos').fill('inexistente');
 await expect(page.getByText('No encontramos esa pieza')).toBeVisible();
 await page.getByRole('button',{name:'Ver todas las piezas'}).click();
 await page.getByRole('button',{name:'Ver Fogonero Encuentro',exact:true}).click();
 await expect(page.getByRole('dialog')).toBeVisible();
 await page.getByRole('button',{name:'Agregar a mi pedido'}).click();
 await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'Abrir pedido, 1 productos'}).click();
 await page.getByRole('button',{name:'Sumar Fogonero Encuentro',exact:true}).click();
 await expect(page.locator('.cart-total')).toContainText('570.000');
 await page.getByRole('button',{name:'Ver mensaje para WhatsApp'}).click();
 await expect(page.locator('.message-preview')).toContainText('2 × Fogonero Encuentro');
 await page.reload();
 await page.getByRole('button',{name:'Abrir pedido, 2 productos'}).click();
 await page.getByRole('button',{name:'Quitar Fogonero Encuentro'}).click();
 await expect(page.getByText('Todo empieza con una chispa.')).toBeVisible();
 expect(errors).toEqual([]);
});
test('desktop and mobile layouts have no overflow or broken images', async ({page}) => {
 for (const width of [1440,390,320]) {
  await page.setViewportSize({width,height:900}); await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole('heading',{level:1})).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  for (const image of await page.locator('img').all()) {
   await image.evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
   await expect.poll(() => image.evaluate(i => i.complete && i.naturalWidth > 0)).toBe(true);
  }
  await expect.poll(() => page.locator('img').evaluateAll(images => images.every(i => i.complete && i.naturalWidth > 0))).toBe(true);
  await page.evaluate(() => scrollTo(0,0));
  await page.screenshot({path:`storage/app/preview-${width}.png`,fullPage:true});
  if(width === 390) { await page.getByRole('button',{name:'Abrir menú'}).click(); await expect(page.getByRole('navigation')).toBeVisible(); }
 }
});
test('reduced motion keeps content visible and restores focus after closing', async ({page}) => {
 await page.emulateMedia({ reducedMotion: 'reduce' });
 await page.goto('/');
 await expect(page.locator('.title-mask').first()).toBeVisible();
 await expect(page.locator('.cinema-background')).toHaveCSS('transform', 'none');
 await expect(page.getByRole('button', { name: 'Pausar carrusel' })).toHaveCount(0);
 const trigger = page.getByRole('button', { name: 'Ver Fogonero Encuentro', exact: true });
 await trigger.click();
 await expect(page.getByRole('dialog')).toBeVisible();
 await page.getByRole('button', { name: 'Cerrar', exact: true }).click();
 await expect(page.getByRole('dialog')).toHaveCount(0);
 await expect(trigger).toBeFocused();
 await page.getByRole('button', { name: 'Parrillas', exact: true }).click();
 await expect(page.locator('.product')).toHaveCount(1);
});

test('product detail opens a navigable image gallery', async ({page}) => {
 await page.goto('/');
 await page.getByRole('button', { name: 'Ver Fogonero Encuentro', exact: true }).click();
 await expect(page.locator('.product-gallery')).toBeVisible();
 await expect(page.getByRole('tab')).toHaveCount(3);
 await expect(page.locator('.gallery-count')).toContainText('01 / 03');
 await page.getByRole('button', { name: 'Imagen siguiente' }).click();
 await expect(page.locator('.gallery-count')).toContainText('02 / 03');
 await page.getByRole('tab').nth(2).click();
 await expect(page.locator('.gallery-count')).toContainText('03 / 03');
 await page.keyboard.press('ArrowLeft');
 await expect(page.locator('.gallery-count')).toContainText('02 / 03');
});
