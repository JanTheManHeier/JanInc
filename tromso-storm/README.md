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

Åpne oppgaver for den nye nettsiden og oppdatering av overleveringsgrunnlaget er
samlet i [TASKS.md](TASKS.md).

## WordPress og redaktørhåndbok

Den private BedSys-instansen er en ekte WordPress-instans, ikke den statiske
skyggekopien. [Bruksanvisningen for Ørjan](wp-plugins/storm-core/BRUKSANVISNING.md)
finnes også under **Storm → Redaktørhåndbok** med utskrift til PDF.
En ferdig A4-kopi finnes i [BRUKSANVISNING-ORJAN.pdf](docs/BRUKSANVISNING-ORJAN.pdf).

Storm Core 0.5 har native redaktørfelt, forsidesider, kontrollfrister og lenkekontroll,
sesongklargjøring/kopiering, eksplisitt gjennomgang og aktivering, profiler,
sesongavtaler for sponsorer/støttemedlemmer, treningstider og godkjente SOME-kort.
Etter aktivering leser temaet det publiserte Storm-innholdet; tomme datasett
erstattes ikke med gamle kamper eller demonstrasjonsdata. Sesongens tabell må ha
sin egen verifiserte turnerings-ID. Se pluginens README og `deploy/README.md`.

Ørjans personlige konto og tilgang fra hans PC må avklares før brukertesten.
NIF-klient, SMTP, offentlig deling og produksjonsgodkjenning er separate porter;
håndboken innebærer ikke at de allerede er på plass.

Dagens WordPress har over 2 100 artikler og 1 200 mediefiler tilbake til 2001. Prototypen viser hvordan dette kan løftes frem som et redaksjonelt klubbarkiv, inkludert eldre StormVarsel-PDF-er.

Logoen brukes som optimalisert SVG. Eksterne bilder og historiske fotografier må rettighetsavklares før endelig produksjonslansering.

## Storskjerm

`storskjerm/` er et lokalt arena-master-system som kjører på arena-PC-en uten
internett. Én Node.js-server leverer React-adminflaten, publikumsvisningen,
Socket.IO-synkronisering og lokale mediefiler til maskiner på hallens LAN.

Kampdata lagres i lokal SQLite som en append-only hendelseslogg. Poeng, feil,
periode, klokke og skjermfase bygges alltid opp igjen ved replay av loggen; det
lagres ingen gjeldende poengsnapshot. Admin åpnes på `/admin` og storskjermen på
`/display` på port 4173. Phase 2 er implementert med replay-sikre Defence,
Make Some Noise- og Heia Storm-grafikker samt en offline timeout-modul for
reklame, konkurranse, visuell spilleautomat og frisbee. Timeout-oppsettet med
sponsor, lokal logo, visningsnummer, kampanjeord og premie lagres også som
hendelser. Reell SMS-integrasjon, statistikk-API-er, mobilplattform og
sponsorstatistikk/-rapporter er fortsatt utenfor scope. Se `storskjerm/README.md`
for installasjon, LAN-adresser, offline-drift og medieopplasting.

Standard hjemmelag genereres fra `data/players.json`, slik at draktnummer, navn
og lokale spillerbilder følger samme datakilde som nettsiden. Kjør
`npm run sync:roster` i `storskjerm/` etter endringer i spillerstallen.
Rødtindhallen er standardarena, og kampvelgeren leser hjemmekampene direkte fra
`data/kamper.json`.

## Nytt WordPress-design og tilgjengelighet

Det nye designet bruker `header-new.php`, `front-page-new.php`,
`footer-new.php` og `assets/storm-new-design.css` i temaet. Banen er statisk
i perspektiv, med dempet opasitet og en ny midtbanering hvert fjerde sekund.
«Pause bakgrunn» i designvelgeren stopper ringene og husker valget i fanen.
Hvis banneret er skjult, åpnes det igjen med «Designvelger».
Systeminnstillingen for redusert bevegelse respekteres automatisk.
`?design=classic` gir fortsatt tilgang til det klassiske designet.

Hovedmenyen er samlet til Nyheter, Kamper, Laget, Arena, Samfunn og Partnere.
Logoen lenker hjem; neste kamp, siste resultat og tabell beholdes som innhold
uten egne hovedmenypunkter. Under kamputdraget lenker «Se alle kamper» til
hele terminlisten, med tilsvarende lenke på engelsk. Draktnummer 0 er et gyldig nummer og vises også
på spillerkortene. Manglende nummer holdes separat som `null`.

Nyhetskort bruker temaets felles `storm_arena_get_post_image_url`: fremhevet
bilde først, deretter første innholdsbilde i artikkelen (ikke små emoji-ikoner),
og til slutt reservebildet hvis artikkelen mangler bilde. Bilder med
WordPress-medie-ID hentes i større størrelse fra det lokale mediebiblioteket.
Dette gjelder både den nye forsiden, klassisk forside og nyhetsarkivet.

Tilgjengelighetsgjennomgangen datert 7. september i
`UX-UI-AUDIT-REVALIDATION-2026.md` beskriver rettinger og gjenstående manuelle
funn. En automatisk kontroll uten registrerte avvik er ikke en full
WCAG-godkjenning. Denne runden oppdaterer WordPress-kilden; den statiske
skyggekopien må eksporteres separat med kommandoen ovenfor.
