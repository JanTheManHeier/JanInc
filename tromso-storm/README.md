# Tromsø Storm – ny hjemmeside

WordPress-tema, statisk designforhåndsvisning og produksjonsgrunnlag for en ny,
mobiltilpasset Tromsø Storm-side.

`wp-theme/storm-arena/` er kildekoden til WordPress-designet. Rotens `index.html`,
undersidene og `wp-content/` er en generert, statisk skyggekopi av den lokale
WordPress-instansen. Skyggekopien publiseres på:

`https://janinc.no/tromso-storm/`

Den er merket `noindex` og skal bare brukes til visuell gjennomgang. Skjemaer,
innlogging, søk og andre serverfunksjoner må testes i WordPress, ikke i kopien.

Forsiden er en designvelger med tre konsepter:

- **Arena** – mørk og kampdrevet
- **Pulse** – ungdommelig og nyhetsorientert
- **Arven** – klubbhistorie og redaksjonelt innhold

Alle konseptene henter kommende kamper fra NIFs resultat- og turneringstjeneste via
`/api/storm-matches`. `data/kamper.json` brukes automatisk som reserve hvis tjenesten
midlertidig er utilgjengelig.
De inneholder også neste kamp, kalendernedlasting, stall, tabellstatus,
Rødtindhallen, klubbhistorie, partnere og et kuratert arkiv.

Forsiden viser de fem neste kampene og kan utvides til hele terminlisten.
Arkivet har søk, spillerstall og trenerteam er adskilt, og mobilvisningen
bevarer motstander, arena og hjemme-/bortestatus i neste-kamp-modulen.

## Oppdatere skyggekopien

Start den lokale WordPress-løsningen på `http://127.0.0.1:8090/`, og kjør:

```powershell
python C:\JanInc\tromso-storm\scripts\export-shadow.py
```

Eksporten speiler de viktigste offentlige sidene og nødvendige CSS-, JavaScript-,
bilde- og fontfiler. Interne sider som ikke speiles, peker til dagens
`tromsostorm.no`. Ingen administratorflater eller private API-er eksporteres.

## Lokal visning av skyggekopien

Kjør en enkel lokal server fra repo-roten slik at `/tromso-storm/`-stien blir lik
produksjon:

```powershell
python -m http.server 8080 --directory C:\JanInc
```

Siden er da tilgjengelig på `http://127.0.0.1:8080/tromso-storm/`.

## Publisering

Når den genererte kopien committes og pushes til `main`, publiseres den på:

`https://janinc.no/tromso-storm/`

Nyheter og enkelte detaljsider peker foreløpig til eksisterende `tromsostorm.no`.

### Automatisk terminliste

Azure Static Web Apps må ha disse appinnstillingene:

- `NIF_CLIENT_ID`
- `NIF_CLIENT_SECRET`
- `NIF_ORG_ID` (valgfri, standard er Tromsø Storms NIF-ID `220005`)

Klienthemmeligheten skal bare ligge i Azure-appinnstillingene og aldri i JavaScript,
GitHub Actions eller andre filer i repoet. API-funksjonen dedupliserer NIF-responsen,
normaliserer lag- og klokkeslett og sender bare kampdata til nettleseren. Kampene lenker
til NIFs kampdetaljer for oppdatert status og mer informasjon.

BLNO-tabellen hentes fra BasketLives offentlige tabellendepunkt via
`/api/storm-standings`. Turneringen kan overstyres med appinnstillingen
`NIF_TOURNAMENT_ID`; standardverdien er `449378` for BLNO Menn 2026/27.

Produksjonsløsningen bygges som et tradisjonelt WordPress-nettsted med
`storm-arena`-temaet. Eksisterende artikler, bilder, klubbaviser og historikk kan
da migreres samtidig som dagens redaksjonelle arbeidsflyt beholdes.

`deploy/` inneholder første del av produksjonsløpet: Docker, Traefik/HTTPS, MariaDB,
hemmelighetshåndtering, import av overleveringsdumpen og obligatorisk ekstern backup. Se
`deploy/README.md`. Overleveringsdata, medier og nøkler skal aldri legges i dette offentlige
repoet.

Dagens WordPress har over 2 100 artikler og 1 200 mediefiler tilbake til 2001. Prototypen viser hvordan dette kan løftes frem som et redaksjonelt klubbarkiv, inkludert eldre StormVarsel-PDF-er.

Logoen brukes som optimalisert SVG. Eksterne bilder og historiske fotografier må rettighetsavklares før endelig produksjonslansering.
