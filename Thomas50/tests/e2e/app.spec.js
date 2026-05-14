import { test, expect } from '@playwright/test';

// Hjelp: hopp over navn-modal som dukker opp ved første besøk
async function dismiss(page) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);
  const skip = page.locator('#navn-skip');
  if (await skip.isVisible().catch(() => false)) await skip.click();
}

test('appen laster uten JS-feil', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await dismiss(page);
  await page.waitForTimeout(500);
  expect(errors).toEqual([]);
});

test('navigasjon: kan gå til alle hovedsider', async ({ page }) => {
  await dismiss(page);
  for (const side of ['program', 'gjester', 'hilsener', 'sang', 'spill', 'minnebok', 'hjem']) {
    await page.evaluate(s => document.querySelector(`[data-go="${s}"]`)?.click(), side);
    await page.waitForTimeout(150);
    const visible = await page.evaluate(s => !document.querySelector(`[data-page="${s}"]`)?.hidden, side);
    expect(visible, `side ${side} skal være synlig`).toBe(true);
  }
});

test('Mario-spillet: Start spillet-knappen starter spillet', async ({ page }) => {
  await dismiss(page);
  await page.evaluate(() => document.querySelector('[data-go="spill"]')?.click());
  await page.waitForTimeout(200);
  await page.evaluate(() => document.querySelector('.sub-tab[data-go="mario"]')?.click());
  await page.waitForTimeout(200);

  // Før klikk: start-skjerm synlig, canvas skjult
  expect(await page.locator('#mario-start').isVisible()).toBe(true);
  expect(await page.locator('#mario-canvas').isVisible()).toBe(false);

  await page.click('#mario-start-btn');
  await page.waitForTimeout(300);

  // Etter klikk: start-skjerm skjult, canvas + hopp-knapp synlig
  expect(await page.locator('#mario-start').isVisible()).toBe(false);
  expect(await page.locator('#mario-canvas').isVisible()).toBe(true);
  expect(await page.locator('#mario-hopp-btn').isVisible()).toBe(true);
});

test('gjest-modal: X-knappen lukker modalen', async ({ page }) => {
  await dismiss(page);
  await page.evaluate(() => document.querySelector('[data-go="gjester"]')?.click());
  await page.waitForTimeout(400);

  // Klikk på første gjest-kort
  await page.locator('.gjest-kort').first().click();
  await page.waitForTimeout(200);

  const modal = page.locator('#gjest-modal');
  expect(await modal.isVisible()).toBe(true);

  await page.click('#gjest-modal-close');
  await page.waitForTimeout(200);
  expect(await modal.isVisible()).toBe(false);
});

test('gjest-modal: klikk utenfor kortet lukker modalen', async ({ page }) => {
  await dismiss(page);
  await page.evaluate(() => document.querySelector('[data-go="gjester"]')?.click());
  await page.waitForTimeout(400);
  await page.locator('.gjest-kort').first().click();
  await page.waitForTimeout(200);
  expect(await page.locator('#gjest-modal').isVisible()).toBe(true);

  // Trigger click på selve overlay-elementet (ikke kortet inni)
  await page.evaluate(() => {
    const m = document.getElementById('gjest-modal');
    m.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await page.waitForTimeout(200);
  expect(await page.locator('#gjest-modal').isVisible()).toBe(false);
});

test('tema-toggle: bytter mellom mørk og lys', async ({ page }) => {
  await dismiss(page);
  const toggle = page.locator('#tema-toggle');
  await toggle.scrollIntoViewIfNeeded();
  expect(await toggle.isVisible()).toBe(true);

  // Default er mørk
  const startTema = await page.evaluate(() => document.documentElement.getAttribute('data-theme') || 'dark');
  await toggle.click();
  await page.waitForTimeout(150);
  const nyttTema = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
  expect(nyttTema).not.toBe(startTema);

  // Persistere
  const lagret = await page.evaluate(() => localStorage.getItem('thomas50-tema'));
  expect(lagret).toBe(nyttTema);
});
