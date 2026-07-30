const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const { chromium } = require('playwright');

const repoRoot = path.resolve(__dirname, '..', '..');
const appRoot = path.resolve(__dirname, '..');
const results = [];

function test(name, fn) {
  results.push({ name, fn });
}

function contentType(file) {
  return ({
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.mp3': 'audio/mpeg',
  })[path.extname(file).toLowerCase()] || 'application/octet-stream';
}

function startServer() {
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let file = path.resolve(repoRoot, '.' + urlPath);
    if (!file.startsWith(repoRoot)) {
      res.writeHead(403).end('Forbidden');
      return;
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
      res.writeHead(404).end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType(file), 'Cache-Control': 'no-store' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise(resolve => {
    server.listen(0, '127.0.0.1', () => {
      resolve({ server, baseURL: `http://127.0.0.1:${server.address().port}` });
    });
  });
}

function mockApi(page, captured) {
  return page.route('**/api/**', async route => {
    const req = route.request();
    const url = new URL(req.url());
    const endpoint = url.pathname.split('/').pop();
    if (req.method() === 'POST') {
      captured.push({ endpoint, body: req.postDataJSON() });
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' });
      return;
    }
    if (endpoint === 'siljeterje-content') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          content: {
            hero: {
              brud: 'Silje', brudgom: 'Terje', tagline: 'Vi gifter oss! 💍',
              datoTekst: 'Lørdag 22. august 2026',
              stedTekst: 'Gammelt sted', omTittel: 'Om dagen',
              omTekst: 'Gammel tekst', kleskode: 'Gammel kleskode',
            },
            program: [
              { dag: 'Fredag 21. august', tid: '19:00', tittel: 'Mingling kvelden før', sted: '(sted kommer)', tekst: 'Mer info kommer' },
              { dag: 'Lørdag 22. august', tid: '13:05', tittel: 'Vielse i Elverhøy kirke', sted: 'Elverhøy kirke', tekst: 'Gammel tid' },
              { tid: '14:30', tittel: 'Fotografering', sted: 'Tromsø sentrum', tekst: 'Brudeparet fotograferes' },
              { tid: '17:00', tittel: 'Mottakelse på Rødbanken', sted: 'Rødbanken', tekst: 'Velkommen' },
            ],
            innstillinger: { musikkOnske: false },
          },
        }),
      });
      return;
    }
    if (endpoint === 'siljeterje-stats') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          generertAt: new Date().toISOString(), totalt: 0, unikeNavn: 0,
          hilsener: [], taler: [], highscore: [], spillTopp: [],
          perNavn: [], perSide: [], sisteBesok: [],
        }),
      });
      return;
    }
    if (endpoint === 'siljeterje-rsvp' && url.searchParams.has('all')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          svar: [{
            slug: 'hege-lauritzen', navn: 'Hege Lauritzen', kommer: true,
            fredag: true, antall: 2, ledsagere: 'Test Følge',
            allergier: '', kommentar: '', oppdatert: new Date().toISOString(),
          }],
          sammendrag: { svart: 1, kommer: 1, kommerIkke: 0, fredag: 1, antallPersoner: 2 },
        }),
      });
      return;
    }
    if (endpoint === 'siljeterje-rsvp') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"svar":null}' });
      return;
    }
    await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
  });
}

function verifyLocalReferences() {
  const files = ['index.html', path.join('rsvp', 'index.html'), path.join('admin', 'index.html')];
  const missing = [];
  for (const relative of files) {
    const html = fs.readFileSync(path.join(appRoot, relative), 'utf8');
    const baseDir = path.dirname(path.join(appRoot, relative));
    for (const match of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
      const ref = match[1];
      if (/^(?:https?:|mailto:|tel:|data:|#)/.test(ref) || ref.startsWith('/api/')) continue;
      const clean = ref.split(/[?#]/)[0];
      const target = clean.startsWith('/SiljeOgTerje/')
        ? path.join(appRoot, clean.slice('/SiljeOgTerje/'.length))
        : path.resolve(baseDir, clean);
      if (clean && !fs.existsSync(target)) missing.push(`${relative}: ${ref}`);
    }
  }
  assert.deepEqual(missing, [], `Manglende lokale filer:\n${missing.join('\n')}`);
}

test('Alle lokale bilder, skript og sider finnes', async () => {
  verifyLocalReferences();
});

test('Passordporten godtar riktig passord', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ viewport: { width: 402, height: 874 } });
  const page = await context.newPage();
  await page.goto(`${baseURL}/SiljeOgTerje/`);
  await page.locator('#tilgang-pass').fill('Silje&Terje');
  await page.locator('#tilgang-knapp').click();
  await assert.doesNotReject(() => page.locator('.hero').waitFor({ state: 'visible' }));
  assert.equal(await page.locator('#tilgang-overlay').count(), 0);
  await context.close();
});

test('iPhone-visning, program og kart er konsistente', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ viewport: { width: 402, height: 874 } });
  await context.addInitScript(() => {
    localStorage.setItem('siljeterje-tilgang', '1');
    localStorage.setItem('siljeterje-navn', 'Test App');
    localStorage.setItem('siljeterje-install-dismissed', '1');
  });
  const page = await context.newPage();
  const captured = [];
  await mockApi(page, captured);
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto(`${baseURL}/SiljeOgTerje/`);
  await page.waitForLoadState('networkidle');

  const layout = await page.evaluate(() => ({
    innerWidth,
    htmlWidth: document.documentElement.scrollWidth,
    bodyWidth: document.body.scrollWidth,
    leadSize: parseFloat(getComputedStyle(document.querySelector('.lead')).fontSize),
    heroSubSize: parseFloat(getComputedStyle(document.querySelector('.hero-sub')).fontSize),
    musicVisible: [...document.querySelectorAll('[data-feature="musikk"]')]
      .some(el => getComputedStyle(el).display !== 'none'),
  }));
  assert.equal(layout.htmlWidth, layout.innerWidth, 'HTML har horisontal overflow');
  assert.equal(layout.bodyWidth, layout.innerWidth, 'Body har horisontal overflow');
  assert.ok(layout.leadSize >= 17, 'Brødtekst er for liten');
  assert.ok(layout.heroSubSize >= 16, 'Stedsteksten i hero er for liten');
  assert.equal(layout.musicVisible, false, 'Musikkønsker skal være avslått som standard');

  await page.locator('button[data-go="program"]').first().click();
  await page.waitForTimeout(250);
  const cards = await page.locator('.program-kort').allInnerTexts();
  assert.ok(cards.some(text => text.includes('Minglefest') && text.includes('19:00') && text.includes('Amtmandens Datter')));
  assert.ok(cards.some(text => text.includes('Vigsel i Elverhøy kirke') && text.includes('12:00')));
  assert.ok(cards.some(text => text.includes('Walter & Leonard') && text.includes('14:00') && text.includes('Dick')));
  assert.ok(cards.some(text => text.includes('Middag og fest') && text.includes('17:00')));
  assert.equal(await page.locator('.leaflet-marker-icon').count(), 4, 'Kartet skal ha fire unike lokasjoner');

  const walter = page.locator('.program-kort').filter({ hasText: 'Walter & Leonard' });
  await walter.locator('.vis-i-kart').click();
  await page.waitForTimeout(300);
  assert.match(await page.locator('.leaflet-popup-content').innerText(), /Walter & Leonard/);
  const walterLink = await walter.locator('a.kart-link').first().getAttribute('href');
  assert.match(walterLink, /69\.64909901495177%2C18\.956037276009752/);
  const rodbanken = page.locator('.program-kort').filter({ hasText: 'Middag og fest' });
  const rodbankenLink = await rodbanken.locator('a.kart-link').first().getAttribute('href');
  assert.match(rodbankenLink, /69\.64934760314557%2C18\.955826114305662/);
  assert.equal(pageErrors.length, 0, `JavaScript-feil: ${pageErrors.join('; ')}`);
  await context.close();
});

test('RSVP støtter følge og viser bekreftelse', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ viewport: { width: 402, height: 874 } });
  const page = await context.newPage();
  const captured = [];
  await mockApi(page, captured);
  await page.goto(`${baseURL}/SiljeOgTerje/rsvp/`);
  await page.locator('#velg-gjest').selectOption({ index: 1 });
  await page.locator('#valg-kommer label[data-v="ja"]').click();
  await page.locator('#valg-fredag label[data-v="ja"]').click();
  await page.locator('#antall').fill('2');
  await page.locator('#ledsagere').fill('Test Agent');
  await page.locator('#lagre-btn').click();
  await assert.doesNotReject(() => page.locator('#takk').waitFor({ state: 'visible' }));
  const post = captured.find(x => x.endpoint === 'siljeterje-rsvp');
  assert.ok(post, 'RSVP ble ikke sendt');
  assert.equal(post.body.antall, 2);
  assert.equal(post.body.ledsagere, 'Test Agent');
  await context.close();
});

test('Admin har kartfelter, musikk-toggle og hurtig RSVP', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ viewport: { width: 1100, height: 900 } });
  await context.addInitScript(() => {
    localStorage.setItem('siljeterje-tilgang', '1');
    sessionStorage.setItem('siljeterje-admin-key', 'test-key');
  });
  const page = await context.newPage();
  const captured = [];
  await mockApi(page, captured);
  await page.goto(`${baseURL}/SiljeOgTerje/admin/`);
  await page.waitForLoadState('networkidle');
  assert.equal(await page.locator('#i-musikk').isChecked(), false);
  assert.ok(await page.locator('.program-rad [data-k="lat"]').count() >= 4);
  assert.ok(await page.locator('.program-rad [data-k="nettside"]').count() >= 4);
  await page.getByRole('button', { name: /Vis RSVP-svar/ }).click();
  await assert.doesNotReject(() => page.locator('#rsvp-admin-gjest').waitFor({ state: 'visible' }));
  assert.ok(await page.locator('#rsvp-admin-gjest option').count() > 50);
  await context.close();
});

test('Manifest og appikoner kan lastes', async ({ browser, baseURL }) => {
  const context = await browser.newContext();
  for (const resource of ['manifest.json', 'images/icon-180.png', 'images/icon-192.png', 'images/icon-512.png']) {
    const response = await context.request.get(`${baseURL}/SiljeOgTerje/${resource}`);
    assert.equal(response.status(), 200, `${resource} ga HTTP ${response.status()}`);
  }
  await context.close();
});

(async () => {
  const { server, baseURL } = await startServer();
  let browser;
  let failed = 0;
  try {
    browser = await chromium.launch({ headless: true });
    for (const item of results) {
      try {
        await item.fn({ browser, baseURL });
        console.log(`✓ ${item.name}`);
      } catch (error) {
        failed++;
        console.error(`✗ ${item.name}\n  ${error.stack || error.message}`);
      }
    }
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
  console.log(`\n${results.length - failed}/${results.length} tester bestått.`);
  process.exitCode = failed ? 1 : 0;
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
