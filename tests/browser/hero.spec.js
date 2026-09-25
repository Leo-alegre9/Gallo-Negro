import { test, expect } from '@playwright/test';
test('integrated hero has one background, two working CTAs and no carousel controls', async ({page}) => {
 await page.emulateMedia({reducedMotion:'reduce'});
 for (const [width,height] of [[1440,1000],[390,844],[320,568]]) {
  await page.setViewportSize({width,height});
  await page.goto('/');
  await page.evaluate(()=>document.fonts.ready);
  await expect(page.locator('.cinema-video')).toHaveCount(1);
  await expect(page.locator('.cinema-video')).toBeHidden();
  await expect(page.getByRole('button',{name:'Imagen siguiente'})).toHaveCount(0);
  await expect(page.getByRole('button',{name:'Imagen anterior'})).toHaveCount(0);
  await expect(page.locator('.cinema-background')).toHaveCSS('transform','none');
  const hero = page.getByRole('region',{name:'Gallo Negro: nuestros productos y taller'});
  for (const name of ['Ver catálogo','Conocé el taller']) {
   const link = hero.getByRole('link',{name});
   await expect(link).toBeVisible();
   const box = await link.boundingBox();
   expect(box.y + box.height).toBeLessThanOrEqual(height);
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.locator('.cinema-video-poster').evaluate(i=>i.decode());
  await page.screenshot({path:'storage/app/integrated-'+width+'.png'});
 }
 await page.getByRole('region').getByRole('link',{name:'Conocé el taller'}).click();
 await expect(page).toHaveURL(/#taller$/);
});
test('unobstructed HD video plays silently and stops outside the hero', async ({page}) => {
 await page.goto('/');
 const video = page.locator('.cinema-video');
 await expect.poll(() => video.evaluate(v => v.readyState >= 2 && !v.paused && v.currentTime > 0)).toBe(true);
 expect(await video.evaluate(v => v.muted && v.loop && v.playsInline)).toBe(true);
 expect(await video.evaluate(v => v.videoWidth)).toBe(1920);
 await expect(page.getByRole('button', { name: 'Pausar video de fondo' })).toHaveCount(0);
 await expect(page.locator('.hero-signature')).toHaveCount(0);
 await expect(page.locator('.cinema-shade')).toHaveCount(0);
 await expect(video).toHaveCSS('object-fit', 'contain');
 const videoBox = await video.boundingBox();
 const titleBox = await page.locator('.cinema-content h1').boundingBox();
 expect(titleBox.x + titleBox.width).toBeLessThanOrEqual(videoBox.x);
 await page.locator('footer').scrollIntoViewIfNeeded();
 await expect.poll(() => video.evaluate(v => v.paused)).toBe(true);
});
