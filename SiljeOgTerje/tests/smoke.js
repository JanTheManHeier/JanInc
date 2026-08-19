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

function mockApi(page, captured, options = {}) {
  return page.route('**/api/**', async route => {
    const req = route.request();
    const url = new URL(req.url());
    const endpoint = url.pathname.split('/').pop();
    if (req.method() === 'POST') {
      const body = req.postDataJSON();
      captured.push({ endpoint, body });
      if (endpoint === 'siljeterje-musikk' && options.musicFailures > 0) {
        options.musicFailures--;
        await route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'Testfeil' }) });
        return;
      }
      const response = endpoint === 'siljeterje-rsvp'
        ? { success: true, ledsagereOpprettet: String(body.ledsagere || '').split(/\n+/).filter(Boolean) }
        : { success: true };
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(response) });
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
            gave: {
              tittel: 'Gaveønske', intro: 'Test gave', onsker: ['Bryllupsreise'],
              detaljer: 'Vipps 12345678\nMerk betalingen med navn',
            },
            innstillinger: { musikkOnske: !!options.musicEnabled },
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
          generertAt: new Date().toISOString(), totalt: 12, unikeNavn: 3, anonymeEnheter: 2,
          hilsener: [], taler: [],
          musikk: [{ id: 1, navn: 'Test Gjest', artist: 'Testartist', laat: 'Testlåt', melding: '', opprettet: new Date().toISOString() }],
          highscore: [], spillTopp: [],
          perNavn: [
            { navn: 'Eldst Aktiv', besok: 20, forste: '2026-08-01T10:00:00Z', sist: '2026-08-10T10:00:00Z', ip: '' },
            { navn: 'Nyest Aktiv', besok: 1, forste: '2026-08-14T15:00:00Z', sist: '2026-08-14T16:00:00Z', ip: '' },
            { navn: 'Mellom Aktiv', besok: 5, forste: '2026-08-05T10:00:00Z', sist: '2026-08-12T10:00:00Z', ip: '' },
          ],
          perSide: [], sisteBesok: [],
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
            fredag: true, fredagAntall: 2, antall: 2, ledsagere: 'Test Følge',
            allergier: '', kommentar: '', oppdatert: new Date().toISOString(),
          }],
          sammendrag: { svart: 1, kommer: 1, kommerIkke: 0, fredag: 1, fredagPersoner: 2, antallPersoner: 2 },
        }),
      });
      return;
    }
    if (endpoint === 'siljeterje-rsvp') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"svar":null}' });
      return;
    }
    if (endpoint === 'siljeterje-forlover' && url.searchParams.has('all')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          svar: {
            hege: {
              'holder-tale': 'Ja',
              'planlegger-innslag': 'Idé på gang',
              'innslag-hva': 'Et tidlig musikalsk innslag',
              'trenger-hjelp': 'Må teste flygelet',
              'unnga-temaer': 'Unngå aldersvitser',
              'beskriv-tre-ord': 'Omsorgsfull, vakker og tøff',
              'sjarmerende-uvane': 'Nynner når maten er god',
              'skjult-talent': 'Råsterk',
              'guilty-pleasure': 'Popmusikk',
              'typisk-utsagn': 'Testutsagn Silje',
              'beste-minne': 'En trygg historie fra en hyttetur med mye latter og god mat.',
              'hvem-bestemmer': 'Silje',
              'most-likely': 'Begge',
            },
            annsissel: {
              'holder-tale': 'Ja',
              'unnga-temaer': 'Unngå aldersvitser',
              'beskriv-tre-ord': 'Raus, omsorgsfull og ærlig',
              'hvem-bestemmer': 'Silje',
              'most-likely': 'Terje',
            },
            vegard: {
              'holder-tale': 'Ja',
              'trenger-hjelp': 'Skjerm og lyd',
              'beskriv-tre-ord': 'Inkluderende, morsom og optimistisk',
              'guilty-pleasure': 'Noilly Prat',
              'typisk-utsagn': 'Testutsagn Terje',
              'skjult-talent': 'Nynner og synger',
              'hvem-bestemmer': 'Avhenger av saken',
              'most-likely': 'Terje',
            },
            mikal: {
              'holder-tale': 'Ja',
              'beskriv-tre-ord': 'Inkluderende, leken og seriøs',
              'guilty-pleasure': 'Rock og ost',
              'typisk-utsagn': 'Et annet utsagn',
              'skjult-talent': 'Tidligere paintballspiller',
              'hvem-bestemmer': 'Avhenger av saken',
              'most-likely': 'Terje',
            },
            olenicolai: {
              'holder-tale': 'Ja, felles tale',
              'planlegger-innslag': 'Ja',
              'innslag-hva': 'Felles tale på 5–8 minutter',
              'trenger-hjelp': 'Lerret og laptop',
              'beskriv-tre-ord': 'Morsom, entusiastisk og inkluderende',
              'hvem-bestemmer': 'Avhenger av saken',
              'most-likely': 'Begge',
            },
          },
          meta: {
            hege: { antall: 14 }, annsissel: { antall: 6 }, vegard: { antall: 9 },
            mikal: { antall: 9 }, olenicolai: { antall: 8 },
          },
        }),
      });
      return;
    }
    if (endpoint === 'siljeterje-gjest-edit') {
      const langBio = Array(36).fill('Dette er en lengre presentasjon av gjesten.').join('\n');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{
          navn: 'Dynamisk Ledsager', relasjon: 'Følge til Test App',
          bio: langBio, bord: 1, sete: 1, bordType: null, nyGjest: true, skjult: false,
        }]),
      });
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

test('Alle gjester har tre gyldige bestevenner uten partnerkoblinger', async () => {
  const matches = JSON.parse(fs.readFileSync(path.join(appRoot, 'matches.json'), 'utf8'));
  const navn = new Set(matches.map(x => x.navn));
  const nyeGjester = [
    'Alma Lauritzen', 'Angelica Sophie Rybak Jensen', 'Åse Florholmen-Kjær',
    'Astrid Løvberg Sørensen', 'Axel  Ingebrigtsen Thomassen', 'Børge Finsæther',
    'Christel Slettli Hansen', 'Endre Laugerud', 'Erik Josefsen',
    'Espen Widding Bruwold', 'Gaute Myklebust', 'Gjermund Halvorsen',
    'Håvard Florholmen-Kjær', 'Hermine Widding Bruwold', 'Kjell Jamissen',
    'Kolbjørn Engeseth', 'Leif Johnny Engseth', 'Marianne Widding Bruwold',
    'Maryam Amri', 'Øystein Aasland', 'Ronny Løvberg Sørensen', 'Stine Jensen',
    'Susanne Jenssen', 'Synne Gulbrandsen', 'Torkel Fredriksen', 'Trond Haug',
    'Vetle Lauritzen',
  ];
  assert.equal(matches.length, 90, 'Matchmatrisen skal dekke alle synlige gjester');
  nyeGjester.forEach(n => assert.ok(navn.has(n), `Ny gjest mangler i matchmatrisen: ${n}`));
  ['Angelica Berg Jensen', 'Else-Marie Olsen', 'Halvard Olsen'].forEach(n => {
    assert.ok(!navn.has(n), `Skjult eller erstattet profil skal ikke ligge i matrisen: ${n}`);
  });
  matches.forEach(person => {
    assert.equal(person.matches.length, 3, `${person.navn} skal ha tre forslag`);
    assert.equal(new Set(person.matches.map(x => x.match_navn)).size, 3,
      `${person.navn} skal ha tre unike forslag`);
    person.matches.forEach(forslag => {
      assert.ok(navn.has(forslag.match_navn),
        `${person.navn} peker til en skjult eller ukjent gjest: ${forslag.match_navn}`);
      assert.notEqual(forslag.match_navn, person.navn, `${person.navn} kan ikke matche seg selv`);
      assert.equal(forslag.match_grunner.length, 2, `${person.navn} mangler begrunnelse`);
      assert.ok(forslag.samtale_starter, `${person.navn} mangler samtalestarter`);
    });
  });

  const utelukkedePar = [
    ['Silje Ingebrigtsen', 'Terje Karlstad'],
    ['Hege Lauritzen', 'Trond-Bjørnar Pedersen'],
    ['Anders Bjørnar Ingebrigtsen', 'Grete Ingebrigtsen'],
    ['Ann Sissel Christoffersen', 'Jon Christoffersen'],
    ['Anette Ingebrigtsen', 'Karl Erik Thomassen'],
    ['Angelica Sophie Rybak Jensen', 'Iver Ingebrigtsen Karlstad'],
    ['Åse Florholmen-Kjær', 'Håvard Florholmen-Kjær'],
    ['Astrid Løvberg Sørensen', 'Ronny Løvberg Sørensen'],
    ['Berit Skog', 'Tore Arnesen'],
    ['Berith Olsen', 'Tore Olsen'],
    ['Børge Finsæther', 'Siv Sofie Vian'],
    ['Charlotte Marianne Hammer', 'Aslak Hammer'],
    ['Christel Slettli Hansen', 'Gaute Myklebust'],
    ['Christianne B. Eilertsen', 'Edvard Eilertsen'],
    ['Elin Andersen', 'Per Johnny Olsen'],
    ['Endre Laugerud', 'Siri Jaklin'],
    ['Erik Josefsen', 'Synne Gulbrandsen'],
    ['Espen Widding Bruwold', 'Marianne Widding Bruwold'],
    ['Gjermund Halvorsen', 'Kristin Halvorsen'],
    ['Kjell G Karlsen', 'Jorunn Karlstad'],
    ['Kjell Jamissen', 'Ingrid Karlsen'],
    ['Leif Johnny Engseth', 'Ragnhild Lettrem Olsen'],
    ['Magnus Seppola', 'Ellen Dølvik Eliassen'],
    ['Maryam Amri', 'Torkel Fredriksen'],
    ['Øystein Aasland', 'Stine Jensen'],
    ['Silje Helèn', 'Vegard Lund Aspen'],
    ['Silje Ramsvatn', 'Ole Nicolai S. Aarbakke'],
    ['Sissel Maria Myrnes Karlstad', 'Helge Karlstad'],
    ['Stian Simonsen', 'Tone Christin Nilsen'],
    ['Susanne Jenssen', 'Jørn Magnus Karlsen'],
    ['Thomas Karlsen', 'Tina Nikolaisen'],
    ['Andreas Granaas', 'Heidi Martens'],
    ['Mikal Johnsen', 'Kjerstin Johnsen'],
    ['Jan Heier Johansen', 'Kristina Garfjell Kantola'],
  ];
  utelukkedePar.forEach(([a, b]) => {
    const personA = matches.find(x => x.navn === a);
    const personB = matches.find(x => x.navn === b);
    assert.ok(personA && personB, `Begge i utelukket par må finnes: ${a} / ${b}`);
    assert.ok(!personA.matches.some(x => x.match_navn === b), `${a} skal ikke foreslå ${b}`);
    assert.ok(!personB.matches.some(x => x.match_navn === a), `${b} skal ikke foreslå ${a}`);
  });
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

test('Gjestesiden åpnes uten passord når den er satt live', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ viewport: { width: 402, height: 874 } });
  const page = await context.newPage();
  await page.route('**/api/siljeterje-content', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ content: { innstillinger: { passordbeskyttelse: false } } }),
  }));
  await page.goto(`${baseURL}/SiljeOgTerje/`);
  await assert.doesNotReject(() => page.locator('.hero').waitFor({ state: 'visible' }));
  assert.equal(await page.locator('#tilgang-overlay').count(), 0);
  await context.close();
});

test('Førstegangsbesøk spores én gang etter navnevalg', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ viewport: { width: 402, height: 874 } });
  await context.addInitScript(() => {
    localStorage.setItem('siljeterje-tilgang', '1');
    localStorage.setItem('siljeterje-install-dismissed', '1');
  });
  const page = await context.newPage();
  const captured = [];
  await mockApi(page, captured);
  await page.goto(`${baseURL}/SiljeOgTerje/`);
  await page.locator('#navn-input').fill('Ny Gjest');
  await page.locator('#navn-lagre').click();
  await page.waitForTimeout(150);
  const hjemSporinger = captured.filter(x =>
    x.endpoint === 'siljeterje-track' && x.body.side === 'hjem');
  assert.equal(hjemSporinger.length, 1, 'Førstegangsbesøk skal ikke dobbelttelles på Hjem');
  assert.equal(hjemSporinger[0].body.navn, 'Ny Gjest',
    'Første besøk skal knyttes til valgt navn, ikke en anonym enhet');
  await context.close();
});

test('iPhone-visning, program og kart er konsistente', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ viewport: { width: 402, height: 874 } });
  await context.addInitScript(() => {
    localStorage.setItem('siljeterje-tilgang', '1');
    localStorage.setItem('siljeterje-navn', 'Test App');
    localStorage.setItem('siljeterje-install-dismissed', '1');
    localStorage.setItem('siljeterje-tema', 'salvie');
    localStorage.setItem('siljeterje-meny', 'topp');
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
    miniTitleSize: parseFloat(getComputedStyle(document.querySelector('.mini-title')).fontSize),
    miniSubSize: parseFloat(getComputedStyle(document.querySelector('.mini-sub')).fontSize),
    theme: document.documentElement.dataset.theme,
    nav: document.documentElement.dataset.nav,
    styleSelectors: document.querySelectorAll('[data-stil], [data-meny]').length,
    musicVisible: [...document.querySelectorAll('[data-feature="musikk"]')]
      .some(el => getComputedStyle(el).display !== 'none'),
  }));
  assert.equal(layout.htmlWidth, layout.innerWidth, 'HTML har horisontal overflow');
  assert.equal(layout.bodyWidth, layout.innerWidth, 'Body har horisontal overflow');
  assert.ok(layout.leadSize >= 17, 'Brødtekst er for liten');
  assert.ok(layout.heroSubSize >= 16, 'Stedsteksten i hero er for liten');
  assert.ok(layout.miniTitleSize >= 19, 'Tittel i hurtigkort er for liten');
  assert.ok(layout.miniSubSize >= 17, 'Tidspunkt i hurtigkort er for lite');
  assert.equal(layout.theme, 'invitasjon', 'Invitasjonsfargene skal være eneste lyse standard');
  assert.equal(layout.nav, 'waffel', 'Hamburgermeny skal være eneste menyplassering');
  assert.equal(layout.styleSelectors, 0, 'Alternative stil- og menyvalg skal være skjult');
  assert.equal(layout.musicVisible, false, 'Musikkønsker skal være avslått som standard');
  assert.match(await page.locator('#festvenn-cta-tittel').innerText(), /Test/,
    'Forsiden skal gjøre festvenninngangen personlig');
  assert.ok(await page.locator('#festvenn-cta [data-festvenn-ny]').isVisible(),
    'Festvenninngangen skal merkes som ny før den åpnes');

  await page.evaluate(() => document.querySelector('[data-go="gjester"]').click());
  const langBioKort = page.locator('.gjest-kort', { hasText: 'Dynamisk Ledsager' });
  await assert.doesNotReject(() => langBioKort.waitFor({ state: 'visible' }));
  await page.locator('#gjester-sok').fill('Dynamisk Ledsager');
  const gjesteSokFarger = await page.locator('#gjester-sok').evaluate(el => ({
    color: getComputedStyle(el).color,
    background: getComputedStyle(el).backgroundColor,
    placeholder: getComputedStyle(el, '::placeholder').color,
  }));
  assert.equal(gjesteSokFarger.color, 'rgb(26, 44, 63)', 'Gjestenavn i søkefeltet skal være mørkt i lyst tema');
  assert.equal(gjesteSokFarger.background, 'rgb(255, 255, 255)', 'Gjestenavn skal stå på hvit søkeflate');
  assert.equal(gjesteSokFarger.placeholder, 'rgb(92, 107, 124)', 'Plassholdertekst skal ha lesbar kontrast');
  await page.locator('#gjester-sok').fill('');
  const bioLayout = await langBioKort.evaluate(kort => {
    const bio = kort.querySelector('.gjest-bio');
    const rect = kort.getBoundingClientRect();
    return {
      length: bio.textContent.length,
      whiteSpace: getComputedStyle(bio).whiteSpace,
      fontSize: parseFloat(getComputedStyle(bio).fontSize),
      lineClamp: getComputedStyle(bio).webkitLineClamp,
      left: rect.left,
      right: rect.right,
      viewport: innerWidth,
    };
  });
  assert.ok(bioLayout.length > 500, 'Hele biografien må ligge tilgjengelig i gjestekortet');
  assert.equal(bioLayout.whiteSpace, 'pre-line', 'Linjeskift i bio skal bevares');
  assert.ok(bioLayout.fontSize >= 13, 'Biografien i gjestekortet er for liten');
  assert.equal(bioLayout.lineClamp, '5', 'Lange biografier skal ha en lesbar forhåndsvisning');
  assert.ok(bioLayout.left >= 0 && bioLayout.right <= bioLayout.viewport, 'Lang bio går utenfor mobilskjermen');
  await langBioKort.click();
  await assert.doesNotReject(() => page.locator('#gjest-modal').waitFor({ state: 'visible' }));
  assert.ok((await page.locator('.gjest-modal-bio').innerText()).length > 500,
    'Hele biografien skal vises når gjesten åpnes');
  await page.locator('#gjest-modal-close').click();
  assert.equal(await page.locator('#navn-pille').isVisible(), false,
    'Navneknappen skal ikke dekke navigasjonen på undersider');
  await page.evaluate(() => document.querySelector('.nav > button[data-go="hjem"]').click());

  await page.locator('#tema-toggle').click();
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  await page.locator('#tema-toggle').click();
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'invitasjon');

  await page.locator('button[data-go="gave"]').first().click();
  assert.match(await page.locator('#gave-detaljer').innerText(), /Vipps 12345678/);
  assert.match(await page.locator('#gave-detaljer').innerText(), /Merk betalingen med navn/);
  await page.evaluate(() => document.querySelector('.nav > button[data-go="hjem"]').click());
  await page.evaluate(() => document.querySelector('.nav > button[data-go="gjester"]').click());
  await page.locator('[data-page="gjester"] button[data-go="bestevenn"]').click();
  await page.locator('#bv-search').fill('Andreas Granaas');
  await page.locator('.bv-dropdown-item').filter({ hasText: 'Andreas Granaas' }).click();
  await assert.doesNotReject(() => page.locator('#bv-resultat .bv-resultat-kort').nth(2).waitFor({ state: 'visible' }));
  assert.equal(await page.locator('#bv-resultat .bv-resultat-kort').count(), 3);
  await page.waitForTimeout(100);
  assert.ok(captured.some(x => x.endpoint === 'siljeterje-track' && x.body.side === 'bestevenn-resultat'),
    'Et vist festvennresultat skal spores');
  await page.locator('#bv-resultat .bv-resultat-kort').first().click();
  await page.waitForTimeout(100);
  assert.ok(captured.some(x => x.endpoint === 'siljeterje-track' && x.body.side === 'bestevenn-profil'),
    'Klikk på en festvennprofil skal spores');
  await page.locator('#gjest-modal-close').click();
  assert.equal(await page.locator('#bv-search').evaluate(el => getComputedStyle(el).color), 'rgb(26, 44, 63)',
    'Bestevenn-søk skal bruke mørk tekst i lyst tema');
  assert.doesNotMatch(await page.locator('#bv-resultat').innerText(), /Bord \?/);
  const bvFarger = await page.locator('#bv-resultat .bv-resultat-kort').first().evaluate(kort => ({
    kort: getComputedStyle(kort).backgroundColor,
    grunn: getComputedStyle(kort.querySelector('.bv-grunne')).color,
    samtale: getComputedStyle(kort.querySelector('.bv-samtale')).color,
    navn: getComputedStyle(kort.querySelector('.bv-resultat-navn')).color,
  }));
  assert.equal(bvFarger.kort, 'rgb(255, 249, 247)');
  assert.equal(bvFarger.grunn, 'rgb(58, 74, 92)');
  assert.equal(bvFarger.samtale, 'rgb(26, 44, 63)');
  assert.equal(bvFarger.navn, 'rgb(160, 78, 92)');
  assert.match(await page.locator('[data-page="bestevenn"] .bv-info-box').innerText(), /ikke dating/i);
  assert.equal(await page.locator('.nav > button[data-go="gjester"]').evaluate(el => el.classList.contains('active')), true,
    'Bestevenn skal markeres som en del av gjestesiden');
  await page.evaluate(() => document.querySelector('.nav > button[data-go="hjem"]').click());
  await page.locator('button[data-go="bord"]').first().click();
  await page.waitForTimeout(150);
  assert.match(await page.locator('.bord-info').first().innerText(), /1\s*\/\s*10/,
    'Bord uten egen kapasitet skal være timannsbord');
  await page.locator('#bord-sok').fill('Dynamisk Ledsager');
  const bordSokFarger = await page.locator('#bord-sok').evaluate(el => ({
    color: getComputedStyle(el).color,
    background: getComputedStyle(el).backgroundColor,
  }));
  assert.equal(bordSokFarger.color, 'rgb(26, 44, 63)', 'Navnet i bordsøket skal være mørkt i lyst tema');
  assert.equal(bordSokFarger.background, 'rgb(255, 255, 255)', 'Bordsøket skal ha hvit bakgrunn');
  await assert.doesNotReject(() => page.locator('.bord-gjest-treff').waitFor({ state: 'visible' }));
  assert.equal(await page.locator('.bord-gjest-treff .bord-navn').evaluate(el => getComputedStyle(el).color),
    'rgb(26, 44, 63)', 'Navnet i markert bordtreff skal være tydelig');
  await page.evaluate(() => document.querySelector('.nav > button[data-go="hjem"]').click());

  await page.setViewportSize({ width: 390, height: 560 });
  await page.locator('#meny-knapp').click();
  assert.equal(await page.locator('html').evaluate(el => el.classList.contains('meny-apen')), true,
    'Hamburgermenyen skal åpnes på mobil');
  const menyMaal = await page.locator('.nav').evaluate(nav => {
    nav.scrollTop = nav.scrollHeight;
    const siste = nav.querySelector('.nav-pop-item[data-go="hjelp"]');
    const navRect = nav.getBoundingClientRect();
    const sisteRect = siste.getBoundingClientRect();
    return {
      top: navRect.top,
      bottom: navRect.bottom,
      viewport: innerHeight,
      overflowY: getComputedStyle(nav).overflowY,
      sisteTop: sisteRect.top,
      sisteBottom: sisteRect.bottom,
    };
  });
  assert.ok(menyMaal.top >= 0 && menyMaal.bottom <= menyMaal.viewport,
    'PWA-menyen skal holde seg innenfor synlig mobilhøyde');
  assert.equal(menyMaal.overflowY, 'scroll', 'PWA-menyen skal kunne rulles');
  assert.ok(menyMaal.sisteTop >= 0 && menyMaal.sisteBottom <= menyMaal.viewport,
    'Siste menypunkt skal kunne nås på en kort mobilskjerm');
  await page.locator('#meny-scrim').click({ position: { x: 380, y: 400 } });
  await page.setViewportSize({ width: 402, height: 874 });

  await page.locator('button[data-go="program"]').first().click();
  await page.waitForTimeout(250);
  const cards = await page.locator('.program-kort').allInnerTexts();
  assert.ok(cards.some(text => text.includes('Minglefest') && text.includes('19:00') && text.includes('Amtmandens Datter')));
  assert.ok(cards.some(text => text.includes('Vigsel i Elverhøy kirke') && text.includes('12:00')));
  assert.ok(cards.some(text => text.includes('Walter & Leonard') && text.includes('14:00') && text.includes('Dick')));
  assert.ok(cards.some(text => text.includes('Middag og fest') && text.includes('17:00')));
  assert.equal(cards.filter(text => text.includes('17:00') && /Middag og fest|Bryllupsmiddag/.test(text)).length, 1,
    'Programmet skal bare ha ett middagspunkt kl. 17');
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

  await page.locator('[data-page="program"] button[data-go="meny"]').click();
  assert.equal(await page.locator('.meny-drikke').first().evaluate(el => getComputedStyle(el).color), 'rgb(58, 74, 92)',
    'Drikketekst skal ha tydelig kontrast i invitasjonstemaet');
  await page.evaluate(() => document.querySelector('[data-go="mario"]').click());
  assert.equal(await page.locator('.mario-instruksjon').evaluate(el => getComputedStyle(el).color), 'rgb(58, 74, 92)',
    'Spillinstruksjonen skal ha tydelig kontrast i invitasjonstemaet');
  await page.evaluate(() => document.querySelector('[data-go="hjelp"]').click());
  assert.ok(await page.locator('.hjelp-seksjon').filter({ hasText: 'Festvenner' }).count());
  assert.ok(await page.locator('.hjelp-seksjon').filter({ hasText: 'Musikkønske' }).count());
  assert.ok(await page.locator('.hjelp-seksjon p').first().evaluate(el => parseFloat(getComputedStyle(el).fontSize)) >= 14);
  assert.equal(pageErrors.length, 0, `JavaScript-feil: ${pageErrors.join('; ')}`);
  await context.close();
});

test('Musikkønsker beholdes lokalt og kan sendes på nytt', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ viewport: { width: 402, height: 874 } });
  await context.addInitScript(() => {
    localStorage.setItem('siljeterje-tilgang', '1');
    localStorage.setItem('siljeterje-navn', 'Test Gjest');
    localStorage.setItem('siljeterje-install-dismissed', '1');
  });
  const page = await context.newPage();
  const captured = [];
  const options = { musicEnabled: true, musicFailures: 1 };
  await mockApi(page, captured, options);
  await page.goto(`${baseURL}/SiljeOgTerje/`);
  await assert.doesNotReject(() => page.locator('[data-go="musikk"]').first().waitFor({ state: 'visible' }));
  await page.locator('[data-go="musikk"]').first().click();
  await page.locator('#musikk-artist').fill('Testartist');
  await page.locator('#musikk-laat').fill('Testlåt');
  await page.locator('#musikk-lagre').click();
  await assert.doesNotReject(() => page.locator('#musikk-status').filter({ hasText: 'lagret trygt' }).waitFor());

  const ventende = await page.evaluate(() => JSON.parse(localStorage.getItem('siljeterje-musikk-ko') || '[]'));
  assert.equal(ventende.length, 1);
  assert.ok(ventende[0].requestId, 'Ventende forslag skal ha en stabil requestId');
  assert.equal(await page.locator('#musikk-laat').inputValue(), 'Testlåt',
    'Skjemaet skal ikke tømmes når sending feiler');

  await page.locator('#musikk-proev-igjen').click();
  await page.waitForTimeout(150);
  const etterRetry = await page.evaluate(() => JSON.parse(localStorage.getItem('siljeterje-musikk-ko') || '[]'));
  assert.equal(etterRetry.length, 0, 'Forslaget skal fjernes fra lokal kø etter vellykket sending');
  const requests = captured.filter(x => x.endpoint === 'siljeterje-musikk');
  assert.equal(requests.length, 2);
  assert.equal(requests[0].body.requestId, requests[1].body.requestId,
    'Retry skal bruke samme requestId og være idempotent');
  await context.close();
});

test('RSVP registrerer minglekvelden og viser bekreftelse', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ viewport: { width: 402, height: 874 } });
  const page = await context.newPage();
  const captured = [];
  await mockApi(page, captured);
  await page.goto(`${baseURL}/SiljeOgTerje/rsvp/`);
  await page.locator('#velg-gjest').selectOption({ index: 1 });
  await page.locator('#valg-fredag label[data-v="ja"]').click();
  await page.locator('#fredag-antall').fill('2');
  await page.locator('#lagre-btn').click();
  await assert.doesNotReject(() => page.locator('#takk').waitFor({ state: 'visible' }));
  const post = captured.find(x => x.endpoint === 'siljeterje-rsvp');
  assert.ok(post, 'RSVP ble ikke sendt');
  assert.equal(post.body.kunFredag, true);
  assert.equal(post.body.fredag, true);
  assert.equal(post.body.fredagAntall, 2);
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
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto(`${baseURL}/SiljeOgTerje/admin/`);
  await page.waitForLoadState('networkidle');
  const besokNavn = await page.locator('#besok-per-navn tbody tr td:nth-child(2)').allInnerTexts();
  assert.deepEqual(besokNavn, ['Nyest Aktiv', 'Mellom Aktiv', 'Eldst Aktiv'],
    'Besøksoversikten skal vise senest aktive navn først');
  assert.match(await page.locator('#besok-per-navn thead').innerText(), /Sist aktiv/);
  assert.match(await page.locator('.stat-card', { hasText: 'Navngitte profiler' }).innerText(), /3/);
  assert.match(await page.locator('.stat-card', { hasText: 'Anonyme enheter' }).innerText(), /2/);
  assert.match(await page.locator('.stat-card', { hasText: 'Musikkønsker' }).innerText(), /1/);
  assert.ok(await page.locator('table').filter({ hasText: 'Testlåt' }).count(),
    'Admin skal vise lagrede musikkønsker');
  assert.equal(await page.locator('#i-musikk').isChecked(), false);
  assert.equal(await page.locator('#i-passord').isChecked(), true);
  assert.ok(await page.locator('.program-rad [data-k="lat"]').count() >= 4);
  assert.ok(await page.locator('.program-rad [data-k="nettside"]').count() >= 4);
  const adminProgram = await page.locator('.program-rad').evaluateAll(rows => rows.map(row => ({
    tid: row.querySelector('[data-k="tid"]').value,
    tittel: row.querySelector('[data-k="tittel"]').value,
    sted: row.querySelector('[data-k="sted"]').value,
  })));
  assert.ok(adminProgram.some(p => p.tittel === 'Minglefest' && p.tid === '19:00' && p.sted === 'Amtmandens Datter'));
  assert.ok(adminProgram.some(p => p.tittel === 'Vigsel i Elverhøy kirke' && p.tid === '12:00'));
  assert.ok(adminProgram.some(p => p.sted === 'Walter & Leonard' && p.tid === '14:00'));
  assert.ok(adminProgram.some(p => p.tittel === 'Middag og fest' && p.tid === '17:00'));
  assert.equal(await page.locator('#g-detaljer').inputValue(), 'Vipps 12345678\nMerk betalingen med navn');
  await page.locator('#g-vipps').fill('99887766');
  await page.locator('#i-passord').uncheck();
  await page.getByRole('button', { name: /Lagre alt innhold/ }).click();
  await page.waitForTimeout(100);
  const contentPost = captured.find(x => x.endpoint === 'siljeterje-content');
  assert.equal(contentPost.body.content.gave.vipps, '99887766');
  assert.equal(contentPost.body.content.gave.detaljer, 'Vipps 12345678\nMerk betalingen med navn');
  assert.equal(contentPost.body.content.innstillinger.passordbeskyttelse, false);
  assert.ok(contentPost.body.content.program.some(p => p.tittel === 'Vigsel i Elverhøy kirke' && p.tid === '12:00'));
  assert.ok(contentPost.body.content.program.some(p => p.sted === 'Walter & Leonard' && p.tid === '14:00'));

  await page.getByRole('button', { name: /Vis RSVP-svar/ }).click();
  await assert.doesNotReject(() => page.locator('#rsvp-admin-gjest').waitFor({ state: 'visible' }));
  assert.ok(await page.locator('#rsvp-admin-gjest option').count() > 50);
  await page.locator('#rsvp-admin-gjest').selectOption('hege-lauritzen');
  assert.equal(await page.locator('#rsvp-admin-antall').inputValue(), '2');
  assert.equal(await page.locator('#rsvp-admin-folge').inputValue(), 'Test Følge');
  assert.match(await page.locator('#rsvp-admin-valgt').innerText(), /Endrer eksisterende svar for Hege Lauritzen/);
  await page.locator('#rsvp-admin-antall').fill('3');
  await page.locator('#rsvp-admin-folge').fill('Test Følge\nNy Ledsager');
  await page.getByRole('button', { name: /Lagre RSVP/ }).click();
  await page.waitForTimeout(250);
  const rsvpPost = captured.find(x => x.endpoint === 'siljeterje-rsvp');
  assert.ok(rsvpPost, 'Admin-RSVP ble ikke sendt');
  assert.equal(rsvpPost.body.navn, 'Hege Lauritzen');
  assert.equal(rsvpPost.body.antall, 3);
  assert.equal(rsvpPost.body.ledsagere, 'Test Følge\nNy Ledsager');

  await page.getByRole('button', { name: /Hent forlover-pakke/ }).click();
  await assert.doesNotReject(() => page.locator('#forlover-pakke').waitFor({ state: 'visible' }));
  const pakkeTekst = await page.locator('#forlover-pakke').innerText();
  assert.match(pakkeTekst, /Toastmaster- og talehjelpspakke/);
  assert.match(pakkeTekst, /Temaer som skal unngås/);
  assert.match(pakkeTekst, /Unngå aldersvitser/);
  assert.match(pakkeTekst, /Skjerm og lyd/);
  assert.match(pakkeTekst, /Trygge quizkandidater/);
  assert.ok(await page.locator('.quiz-kort').count() >= 8, 'Det skal lages minst åtte quizkandidater');
  assert.equal(await page.locator('.quiz-kort').filter({ hasText: 'Hege Lauritzen' }).count(), 0,
    'Quizkandidater skal ikke røpe hvem som leverte svaret');
  assert.equal(await page.locator('.quiz-status').count(), await page.locator('.quiz-kort').count(),
    'Alle quizkandidater skal kreve manuell godkjenning');
  assert.equal(await page.locator('details.forlover-raa').isVisible(), true,
    'Komplette råsvar skal ligge sammenfoldet under pakken');
  assert.equal(pageErrors.length, 0, `JavaScript-feil i admin: ${pageErrors.join('; ')}`);
  await context.close();
});

test('Spillscore over 1000 lagres', async () => {
  const dbPath = require.resolve('../../api/shared/db');
  const apiPath = require.resolve('../../api/siljeterje-spillscore');
  const originalDb = require.cache[dbPath];
  const queries = [];
  require.cache[dbPath] = {
    id: dbPath,
    filename: dbPath,
    loaded: true,
    exports: {
      TYPES: { NVarChar: 'nvarchar', Int: 'int' },
      getConnection: async () => ({ close() {} }),
      executeQuery: async (_connection, sql, params) => {
        queries.push({ sql, params });
        return [];
      },
    },
  };
  delete require.cache[apiPath];

  try {
    const handler = require(apiPath);
    const context = { log: { error() {} } };
    await handler(context, { method: 'POST', body: { navn: 'Terje', score: 1375 } });
    assert.equal(context.res.status, 200, 'En gyldig rekord over 1000 skal godtas');
    const insert = queries.find(q => q.sql.includes('INSERT INTO SiljeTerje_Spillscore'));
    assert.ok(insert, 'Scoren skal skrives til databasen');
    assert.equal(insert.params.find(p => p.name === 'score').value, 1375);
  } finally {
    delete require.cache[apiPath];
    if (originalDb) require.cache[dbPath] = originalDb;
    else delete require.cache[dbPath];
  }
});

test('Brudgomspoeng avgjør bare poenglikhet med Thomas', async () => {
  const { applyGroomTieBonus } = require('../../api/shared/weddingGameScores');
  const rows = [
    { navn: 'Thomas Hansen', score: 1000, sist: '2026-08-14T20:00:00Z' },
    { navn: 'Terje Karlstad', score: 1000, sist: '2026-08-16T10:00:00Z' },
    { navn: 'Terje Test', score: 875, sist: '2026-08-16T10:00:00Z' },
    { navn: 'Jan', score: 875, sist: '2026-08-15T10:00:00Z' },
  ];
  const result = applyGroomTieBonus(rows);
  assert.equal(result[0].navn, 'Terje Karlstad');
  assert.equal(result[0].score, 1001);
  assert.equal(result[0].grunnscore, 1000);
  assert.equal(result[0].bonus, 1);
  assert.equal(result.find(row => row.navn === 'Terje Test').score, 875,
    'Terje skal ikke få bonus ved poenglikhet med andre enn Thomas');
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
