# Silje & Terje — Bryllupsapp (`SiljeOgTerje/`)

Live: **https://janinc.no/SiljeOgTerje/** · Bryllup **22. august 2026**, Tromsø
(vielse Elverhøy kirke → fest Rødbanken).

Vanilla-JS PWA (ingen byggesteg for frontend) — bygget på samme oppsett som `Thomas50/`,
men med lyst, elegant hvit/gull-tema og bryllup som tema.

## Filstruktur
- `index.html` — hele appen (SPA, seksjoner vises/skjules via nav)
- `script.js` — all app-logikk (IIFE). Tema = `light` som standard.
- `data.js` — **GENERERT** av `build-data.js`. Inneholder runtime-data + innholds-DEFAULTS
  (HERO, OMOSS, PROGRAM, PRAKTISK, MENY, MENYINFO, GAVE, GJESTER, SANG*, BORD_TEMA, SPILL_QUIZ).
- `spill.js` — Bubble Bobble bryllupsspill (`window.ThomasSpill = {init,start,stopp,hopp}` — navnet beholdt).
- `style.css` — tema via `[data-theme="light"]` (gull #8A6420, krem #FAF6EE).
- `admin/index.html` — admin: statistikk + **innholds-redaktør** (selvbetjent for brudeparet).
- `admin/gjester.html` — rediger/legg til/skjul gjester, sette bord/sete.
- `audio/silje.mp3`, `audio/den-siste-villhingsten.mp3` — de to sangene.
- `images/gjester/*.jpg` — 57 gjestebilder (scrapet fra Facebook-gruppe).

## KRITISK: Selvbetjent innhold
Silje og Terje redigerer ALT praktisk selv via `admin/` — ikke endre i kode.
- Innhold lagres som ett JSON-dokument i DB via API `siljeterje-content`
  (GET offentlig, POST krever `ADMIN_KEY`). Se `api/siljeterje-content/`.
- `data.js` = DEFAULTS. `script.js` `lastContent()` henter fra API og overstyrer
  HERO/OMOSS/PROGRAM/PRAKTISK/MENY/MENYINFO/GAVE der lagret innhold finnes.
- Admin-redaktøren laster `../data.js` og pre-fyller skjemaene med defaults når
  ingenting er lagret ennå, så første lagring ikke visker ut standardinnholdet.
- Tolerante felt-navn: PROGRAM/MENY leser `beskrivelse || tekst`; PRAKTISK tåler
  både string og `{tittel,tekst}`; GAVE viser `detaljer`-fritekst hvis ingen
  strukturerte felt (vipps/konto/spleisUrl).

## Endre standardinnhold (kode)
Rediger **`build-data.js`** (ikke `data.js` direkte), så:
```
cd C:\JanInc\SiljeOgTerje
node build-data.js      # skriver data.js
node -c data.js         # syntaks-sjekk
```
Gjestelista genereres fra `scraped-guests.json` via `gen-gjester.js`
(→ `gjester-array.gen.js`, splices inn i `build-data.js`).

## Roller (gjester)
`rolle`-feltet: `Brud` / `Brudgom` / `Toastmaster` / `Forlover`. Styrer filter,
tagger og sortering i gjesteliste.
- Toastmastere: Maja Wilhelmsen, Thomas Helge Hansen (e-post for taler:
  majawilhelmsen@hotmail.com, thomas.helge@gmail.com).
- Forlovere Silje: Hege Lauritzen, Ann Sissel Christoffersen.
- Forlovere Terje: Vegard Lund Aspen, Mikal Johnsen, Ole Nicolai S. Aarbakke.

## API-endepunkter (`api/siljeterje-*`)
content, stats, track, greetings, gjest-edit, spillscore, admin-reset,
admin-delete-greeting, taler m.fl. Bruker `../shared/db.js`. Tabeller med prefiks
`SiljeTerje_` opprettes ved behov.

## Lokal test
Statisk server fra repo-rot (API-kall gir 404 lokalt — forventet):
```
node -e "<enkel http-server>" på repo-rot, åpne /SiljeOgTerje/
```
Frontend testes med Playwright (allerede installert). Sjekk konsoll for ekte feil
(API-404 er OK lokalt).

## Scraper-artefakter (i .gitignore — IKKE deploy)
`scrape-guests.js`, `scraped-guests.json`, `member-links.json`, `gen-gjester.js`,
`gjester-array.gen.js`, `build-data.js`, `package.json`. `data.js` er generert MEN committes.

## Kjente TODO / placeholders (brudeparet fyller via admin)
- Program-tider, meny-detaljer, gaveønske/betaling (Vipps/Spleis/konto), Om oss-tekst.
- Ikoner i `images/icon-*.png` er foreløpig gjenbrukt fra Thomas50 — bør byttes til bryllupsikon.
- DJ og «bestevenn»-funksjon er bevisst utsatt.
