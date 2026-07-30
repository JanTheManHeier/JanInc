# Silje & Terje — Bryllupsapp (`SiljeOgTerje/`)

Live: **https://janinc.no/SiljeOgTerje/** · Bryllup **22. august 2026**, Tromsø
(vielse Elverhøy kirke → fest Rødbanken).

Vanilla-JS PWA (ingen byggesteg for frontend) — bygget på samme oppsett som `Thomas50/`.
**Standardtema = `invitasjon`**: blomster/kalligrafi hentet fra papirinvitasjonen
(rosa roser + lavendel, rose #C4737E, plomme #5E3A62, krem #FCF5F0).

## Fakta fra papirinvitasjonen (fasit)
- Vigsel **kl. 12.00** — Elverhøy kirke
- Middag og fest **kl. 17.00** — **Festsalen i Rødbanken**
- Minglefest **fredag 21.08.26 kl. 19.00** — **Amtmandens datter**
- Dresskode: **mørk dress** · Svarfrist **01.08.26** til Silje **952 952 61**

## Filstruktur
- `index.html` — hele appen (SPA, seksjoner vises/skjules via nav)
- `script.js` — all app-logikk (IIFE). Tema = `light` som standard.
- `data.js` — **GENERERT** av `build-data.js`. Inneholder runtime-data + innholds-DEFAULTS
  (HERO, OMOSS, PROGRAM, PRAKTISK, MENY, MENYINFO, GAVE, INNSTILLINGER, GJESTER,
  SANG*, BORD_TEMA, SPILL_QUIZ).
- `spill.js` — Bubble Bobble bryllupsspill (`window.ThomasSpill = {init,start,stopp,hopp}` — navnet beholdt).
- `style.css` — tema via `[data-theme]`. Fire lyse stiler: **`invitasjon`** (standard),
  `light` (champagne), `salvie`, `stovbla` + mørkt `dark`/`smaragd`.
  Lys-reglene deles via `:is([data-theme="light"],[data-theme="invitasjon"],…)`; legger du
  til et nytt lyst tema må det inn i alle disse `:is(...)`-listene. Invitasjonsstilen ligger
  i egen blokk nederst i fila (fonter Great Vibes + Cormorant Garamond fra Google Fonts).
- `images/blomster-hjorne.svg` — akvarell-blomsterhjørne (roser, lavendel, blad) brukt i
  hero-hjørnene og som bunndekor i invitasjonsstilen.
- `admin/index.html` — admin: statistikk + **innholds-redaktør** (selvbetjent for brudeparet).
  Her kan musikkønsker skrus av/på og RSVP registreres manuelt på vegne av gjester.
- `admin/gjester.html` — rediger/legg til/skjul gjester, sette bord/sete.
- `audio/silje.mp3`, `audio/den-siste-villhingsten.mp3` — de to sangene.
- `images/gjester/*.jpg` — 57 gjestebilder (scrapet fra Facebook-gruppe).

## KRITISK: Selvbetjent innhold
Silje og Terje redigerer ALT praktisk selv via `admin/` — ikke endre i kode.
- Innhold lagres som ett JSON-dokument i DB via API `siljeterje-content`
  (GET offentlig, POST krever `ADMIN_KEY`). Se `api/siljeterje-content/`.
- `data.js` = DEFAULTS. `script.js` `lastContent()` henter fra API og overstyrer
  HERO/OMOSS/PROGRAM/PRAKTISK/MENY/MENYINFO/GAVE/INNSTILLINGER der lagret innhold finnes.
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

Kritisk smoke-/regresjonstest kjøres fra repo-roten:
```
node SiljeOgTerje/tests/smoke.js
```
Testen starter en lokal server, mocker API-kall (skriver aldri produksjonsdata) og sjekker
iPhone-bredde, horisontal overflow, program/fakta, kartpinner, RSVP, admin, PWA-filer og
JavaScript-feil. Den bruker eksisterende Playwright-installasjon og krever ingen npm-nedlasting
ved kjøring. Kjør den manuelt før push så lenge npm-registeret er blokkert av IT-policy.

## Scraper-artefakter (i .gitignore — IKKE deploy)
`scrape-guests.js`, `scraped-guests.json`, `member-links.json`, `gen-gjester.js`,
`gjester-array.gen.js`, `build-data.js`, `package.json`. `data.js` er generert MEN committes.

## Kjente TODO / placeholders (brudeparet fyller via admin)
- Meny-detaljer og gaveønske/betaling (Vipps/Spleis/konto).
- Ikoner i `images/icon-*.png` er foreløpig gjenbrukt fra Thomas50 — bør byttes til bryllupsikon.
- Musikkønsker er standard av og aktiveres via admin når DJ/musikk er avklart.
- Bordtema bruker Tromsø-bydeler og kjente områder, ikke fjell.
