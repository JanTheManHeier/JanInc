# Arbeidsliste - ny nettside

Oppdatert 25. oktober 2026. Listen gjelder WordPress-kilden og den nye
testinstallasjonen hos BedSys. Dagens produksjonsside og DNS for
produksjonsdomenet skal ikke endres som del av punktene nedenfor.

## Dagsplan - 25. oktober 2026

Hovedmål: sikre arbeidet og gi Ørjan tilgang til den faktiske WordPress-testsiden
fra egen PC. Deling er ikke en produksjonslansering. Punktene nedenfor er dagens
prioriteringer; eksterne avhengigheter kan hindre ferdigstilling samme dag.

### Kontrollert etter omstart

- [x] SSH-tilgang gjenopprettet med eksisterende nøkkel og kontrollert vertsnøkkel.
- [x] Lokal tunnel til `http://127.0.0.1:18090/` gjenopprettet.
      Forside og WordPress-innlogging svarer 200; forsiden har `noindex`.
- [x] WordPress, database, arkivtjeneste og staging-proxy kjører med frisk
      helsestatus. Avgrenset cron og backup-tjenesten kjører.
- [x] Dagens backup er bekreftet fullført 25. oktober kl. 10:48:16 UTC
      (11:48:16 norsk tid). Dette er en loggkontroll av dagens kjøring,
      ikke en ny gjenopprettingstest.

### Prioritert gjennomføring

1. [x] **Sikre kildekoden.** Gå gjennom endrede og usporte Storm-filer,
       kontroller at overleveringsdata og hemmeligheter holdes utenfor Git,
       og lagre kildekode/dokumentasjon i avtalt repo. Ikke ta med andre
       prosjekters lokale endringer.
2. [x] **Gjør testsiden delbar for Ørjan via `janinc.no/storm/`.**
       Avklar DNS-tilgang, testnavn og hvem som skal ha tilgang.
       Foreslått mål er `storm.janinc.no` på BedSys, med HTTPS og
       tilgangskontroll på selve testmålet, inkludert medier og API-er.
       Tilpass WordPress-adresse og proxy-ruting, behold e-postsperre og
       `noindex`, og opprett delelenken først når testmålet virker.
       Bruk midlertidig videresending; nettleseren vil vise testmålets adresse.
       Test fra en annen PC eller mobil uten SSH: uvedkommende avvises,
       mens Ørjan kommer inn. Dagens produksjonsside skal ikke berøres.
3. [ ] **Klargjør Ørjans gjennomgang.** Opprett personlig konto med nødvendige,
       begrensede rettigheter; ikke del administratorkontoen. Send delelenke
       og håndbok når tilgangen er verifisert. La Ørjan kontrollere design,
       mobilvisning og redaktørflyt med håndbokens akseptansetest.
       Avhenger av punkt 2 og Ørjans tilgjengelighet.
4. [x] **Rett faneikonet teknisk.** Fullfør punkt 1 nedenfor i WordPress-kilden,
       kontroller proporsjoner og cache i Edge, og eksporter skyggekopien
       etter verifisering.
5. [ ] **Oppdater og avklar innhold.** Kontroller og oppdater resultatet fra
       24. oktober og neste kamp mot offisiell kilde. Be Hans-Henry om fersk
       overlevering/synkstatus; avstem nyere profiler og de åtte nyhetsutkastene
       uten duplikater. Full artikkel-/medieimport krever ferskt grunnlag.
       Avklar også Teknisk Bureau og portrett/rettigheter for Gregor.
6. [ ] **Avklar integrasjoner og gjenstående lanseringsporter.**
       Kartlegg godkjent NIF-tilgang og test eksisterende integrasjon før
       automatisk kampoppdatering aktiveres. Avklar SMTP og engelsk
       oversettelsesflyt separat; ikke åpne e-postutsending på staging.
       Manglende tilganger registreres som blokkeringer, ikke som ferdige oppgaver.

Før endringer i aktiv staging: ta fersk ekstern backup og bevar konfigurasjon
og kode for tilbakeføring. Etter endringer: kontroller berørte funksjoner,
tilgangssperrer og backup. Oppdater status her med faktisk utførte kontroller.
DNS-/HTTPS-oppsett for testnavnet krever avklart tilgang og godkjenning;
en videresending til den lokale SSH-adressen fungerer ikke for arbeidsgruppen.

### Utført 25. oktober

- [x] WordPress-tema, Storm Core, driftsverktøy og håndbok er committet og pushet.
      Private overleveringer, passord, nøkler og nettleserøkter er ekskludert.
      Azure-publiseringen holder PHP-kilden utenfor den statiske nettsiden.
- [x] Kun testnavnet `storm.janinc.no` er lagt til i DNS. HTTPS med gyldig
      sertifikat og personlige tilgangspassord er aktivert på BedSys.
      Produksjonsdomenet `tromsostorm.no` og dets DNS er ikke endret.
- [x] Både `janinc.no/storm` og `janinc.no/storm/` gir 302 til
      `https://storm.janinc.no/`, med `Cache-Control: no-store`.
      Azure-kjøring `40203640440` er fullført. En tidligere konfigurasjonsfeil
      med dupliserte skråstrek-normaliserte ruter er rettet.
- [x] Personlig WordPress-konto `orjan` har rollen Redaktør, ikke administrator.
      Tilgangsinstruksene ligger lokalt i `deploy\private\ORJAN-TESTTILGANG.txt`.
      Del bare denne filen med Ørjan, ikke filen med begge brukernes tilgang.
      Ingen melding eller passord er sendt på vegne av brukeren.
- [x] 61 isolerte WordPress-assertsjoner og 15 review-Compose-kontroller bestått.
      Åtte kontroller i ekte Edge verifiserer adgangssperrer også på medier,
      arkiv, API og admin, HTTPS-innlogging, redaktørhåndbok, ikon på norsk/
      engelsk og mobil uten horisontal overflyt ved 390 piksler.
      E-post, indeksering og ikke-godkjente planlagte jobber er fortsatt sperret.
- [x] Nidaros–Storm 24. oktober er avsluttet med 86–112, manuelt overstyrt
      mot senere automatisk overskriving. Neste kamp er Fyllingen hjemme
      8. november kl. 15.00. Reserveterminlistens TNT-dato er rettet til 18. oktober.
- [x] Eksterne krypterte backuper før/etter HTTPS- og kontoendringen,
      `20261025T141932Z` og `20261025T143520Z`, er lastet ned og gjenopprettet
      isolert. Alle 128 tabellers radantall og motorer stemmer; alle 34
      WordPress-tabeller er InnoDB. Tilbakeføringskode og konfigurasjon er bevart.
- [x] Sluttbackup etter engelsk ikonretting, `20261025T144624Z`, er fullført
      kl. 14:49:20 UTC og hentet fra ekstern lagring. Ny isolert gjenoppretting
      bekrefter alle 128 tabellantall/motorer; 173 tema-/pluginfiler er identiske
      med aktiv kilde. Daglig backup og avgrenset cron kjører videre.
- [x] Den oppfriskede statiske skyggekopien omfatter 20 sider med kontrollert
      `noindex`, ikon og lokale ressursreferanser. Ingen administratorflate,
      passord eller gamle localhost-adresser er med i disse sidene.
      Den gamle SSH-tunnelen er stoppet; HTTPS-løsningen trenger den ikke.
- [ ] Send tilgangsfilen sikkert og la Ørjan teste fra egen PC.
      Offentlig og autoritativ DNS svarer riktig; administrator-PC-ens vanlige
      DNS-oppslag hadde fortsatt negativ cache under kontrollen. Edge-testen
      brukte en avgrenset vertsoppslagsoverstyring, ikke svekket TLS-kontroll.
- [ ] Innhent fersk overlevering, partner-/bilderettigheter og godkjente
      integrasjonstilganger. NIF- og oversettelsesnøkler er fortsatt tomme;
      ingen NIF-oppdateringsjobb er aktivert, og SMTP er fortsatt sperret.

## 1. Rett proporsjonene på faneikonet i Edge

Status: rettet i aktiv WordPress og eksportert skyggekopi 25. oktober.
Manuell vurdering av den synlige Edge-fanen gjenstår hos brukerne.

- [x] Undersøk hvilket favicon Edge faktisk bruker i testinstallasjonen.
- [x] Rett ikonressursen eller ikonreferansen slik at logoens proporsjoner bevares.
      Bruk en kvadratisk ikonflate med nødvendig luft, ikke strekk selve logoen.
- [ ] Kontroller resultatet i en egen Edge-fane ved vanlig fanestørrelse og etter
      oppfrisking av favicon-cachen.
- [x] Kontroller at den statiske skyggekopien fortsatt bruker riktig ikon når den
      eksporteres på nytt.

Kontrollert 24. oktober: produksjonssiden bruker
`wp-content/themes/storm6/favicon.ico`, som inneholder et kvadratisk 80 x 80-ikon.
Den nye WordPress-testsiden bruker derimot `assets/storm-mark.svg`, med
`width="120"` og `height="72"` og uten `viewBox`. Det er altså ulike
ikonressurser, ikke bare ulik visning av samme fil. Den brede SVG-utgaven gir
et flatere og mindre gjenkjennelig faneikon. Vurder å gjenbruke det eksisterende
faneikonet separat fra logoene som brukes inne på nettsiden.
Den opprinnelige ICO-filen er nå lagt separat i
`assets/icons/storm-favicon.ico`; begge PHP-headerne og de ti engelske
HTML-malene bruker denne. SVG-kunst inne på sidene er ikke endret.
Ekte Edge bekrefter ICO-type, 80 x 80 og riktige referanser i begge design
og på engelsk underside. Alle 20 eksporterte sider har riktig ikon og `noindex`.
Skjermbildet er lagret i `docs\edge-favicon-2026-10-24.png`.

Ferdig når Edge viser en gjenkjennelig logo uten forvrengte proporsjoner.

## 2. Oppdater datagrunnlaget fra Hans-Henrys overlevering

Status: avtalt snapshot fra 23. september er importert, validert og aktivert
på den private testsiden hos BedSys 24. oktober. Den tidligere testinstansen
er stoppet, men filer, containere og databasevolumer er beholdt for tilbakeføring.
Ferskere overlevering og vurdering av partnerpresentasjonen gjenstår.

Her betyr oppdatering/rebase å fornye importgrunnlaget og innarbeide relevante
endringer i vår løsning, ikke å omskrive Git-historikk eller erstatte det nye temaet
med det gamle nettstedets kode.

### Bekreftet 24. oktober 2026

- [x] Det private overleveringsrepoet kan fortsatt leses med eksisterende tilgang.
- [x] Nye Git-objekter er hentet for sammenligning uten å endre lokal arbeidskopi.
- [x] Det finnes 17 nye commits og 17 endrede filer sammenlignet med grunnlaget
      fra 2. september.
- [x] Nyeste publiserte snapshot er fra 23. september 2026 kl. 03:32:14 +02:00.
- [x] Database, mediepakke, URL-inventar, terminliste, sponsor-/partnerdata og
      trenerdata er endret. To partnerpluginer er endret, og en plugin for
      utstyrsleverandør er lagt til.

Viktig: snapshotet fra 23. september er fortsatt eldre enn kontrolltidspunktet.
En lesbar Git-server betyr ikke at den nattlige produksjonssynkroniseringen
fortsatt leverer ferske data. Brukeren har uttrykkelig godkjent at snapshotet
fra 23. september importeres nå, selv om en ferskere overlevering fortsatt
må avklares før produksjonssetting. Tilhørende mediepakke er lastet ned og
SHA256-verifisert. En ny kryptert sikkerhetskopi av eksisterende testinstans
ble fullført 24. oktober kl. 07:06:08 UTC (`20261024T070345Z`).

Den separate september-instansen er importert: alle 125 tabellers radantall
stemte med selve SQL-filen før WordPress-klargjøring, og alle 5 829 mediefiler
har identisk SHA256 med arkivet. Overleveringens `manifest.json` oppgir et
foreldet antall for `wp_options` (1 102); SQL-filen inneholder 1 253, som også
er antallet importerte rader. Kontroll er derfor gjort mot faktisk SQL, ikke
ved å ignorere avviket. Etter klargjøring stemmer alle 94 eldre domenetabeller
fortsatt. Alle 2 168 inventar-URL-er er kontrollert: 2 138 flate adresser og
30 eksisterende hierarkiske undersideadresser virker.

Ekstern OneDrive-backup `20261024T074300Z` er lastet ned og gjenopprettet
i en isolert instans. Alle 127 tabellers radantall og aktiv tema-/pluginkode
stemte, og gjenopprettet WordPress virket med e-post og indeksering blokkert.
Den daglige backupens første kjøring ble også fullført kl. 07:48:31 UTC.
Den private testadressen ble deretter byttet til september-instansen kl.
07:48:53 UTC (09:48:53 norsk tid). Den samme SSH-tunnelen og
`http://127.0.0.1:18090` ble brukt ved denne kontrollen, og administratorinnlogging
ble kontrollert med uendret testpassord. Fra 25. oktober er den kanoniske
testadressen `https://storm.janinc.no/`; produksjonssiden og dens DNS er ikke endret.

Aktivt serverprosjekt: `/home/janheier/tromsostorm-staging-sep23`.
Tidligere prosjekt: `/home/janheier/tromsostorm-staging`.
Kildecommit: `9e40d2db75aa188161ae8c17574cc4e43891f336`.
Faser og tilbakeføring er dokumentert i `deploy\README.md`; kontrollkvitteringer
ligger i prosjektroten på serveren.

### Gjenstående arbeid

- [ ] Be Hans-Henry bekrefte synkstatus og kjøre en fersk overlevering.
- [ ] Gå gjennom endringene i partnerpluginene og vurder hva som må innarbeides
      i `storm-core` og det nye temaet; ikke kopier gammel kode ukritisk.
- [x] Hent avtalt snapshot og tilhørende mediepakke. Verifiser at dato, manifest
      og SHA256 hører sammen.
- [x] Ta og kontroller backup av testinstallasjonen før oppdateringen.
- [x] Prøv ny import i en separat database/instans først. Behold det nye temaet,
      lokale tilpasninger og staging-sperrene for e-post og indeksering.
- [x] Bevar historiske filnavn og store/små bokstaver ved medieimport på Linux;
      Windows kan slå sammen ulike filer som `13.jpg` og `13.JPG`.
- [x] Kontroller artikler, bilder/PDF-er, sponsorer, trenere, kamper og historiske
      URL-er mot den avtalte overleveringen.
- [x] Kontroller de 30 flate URL-ene i dagens inventarliste mot sidenes lagrede
      hierarkiske adresser og den nye listen. Ikke endre foreldre eller legge inn
      omdirigeringer uten å ha avklart ønsket historisk URL.
- [x] Oppdater testinstallasjonen først når importen er validert, og gjennomfør
      ny ekstern backup og gjenopprettingskontroll.

Ferdig når testinstallasjonen bygger på et dokumentert, avtalt snapshot og
relevante endringer er innarbeidet uten tap av det nye designet eller historikk.

## 3. Kontroller arenanavnet i Neste kamp

Status: rettet på privat staging 24. oktober; kontrollert på mobil og desktop.

Skjermbildet viser `Trheim Spektrum F`, mens brukeren forventer Trondheim
Spektrum uten uønsket forkorting eller klipping. Den lokale
[reservekampdatafilen](data/kamper.json#L9-L10) har `Trondheim Spektrum F`.
Dette fastslår ikke om forskjellen skyldes visningslogikk, en annen datakilde
eller CSS. Ikke fjern hallbokstaven uten å kontrollere hva den betyr.
Skjermbildet er lagret i `docs\next-match-arena-2026-10-24.png`.

- [x] Sammenlign innkommende arenanavn med tekst og beregnet stil i kampkortet.
- [x] Kontroller forkortelser, fast bredde, linjebryting og eventuell klipping
      på både mobil og desktop.
- [x] Rett visningen slik at hele det avtalte arenanavnet er lesbart, uten at
      kampdato, motstandere eller knapper presses ut av kortet.

Årsaken var forkortelsen i importert kampdata, ikke avkuttet tekst i kortet.
Begge Nidaros-kampene har nå `Trondheim Spektrum F`. Hallbokstaven er beholdt
etter kontroll mot klubbens eget Instagram-innlegg `De06tr8Dm-j`. Faktisk tekst
og tekstens plassering i kortet er kontrollert ved 375, 390, 768 og 1440 piksler,
uten ellipser eller klipping. Dette er en kildekontrollert dataretting; automatisk
innhenting og eventuell normalisering i NIF-flyten er fortsatt punkt 4.

Ferdig når lange arenanavn er lesbare i Neste kamp på relevante skjermbredder.

## 4. Verifiser og aktiver automatisk oppdatering av neste kamp

Status: eksisterende integrasjon funnet; tilgang og drift må avklares.
Kontrollert 25. oktober: NIF-innstillinger er tomme, ingen synkjobb er planlagt
og ingen NIF-cache er fylt. Kamprettingene er manuelle, ikke automatisk synk.

Det finnes allerede en [NIF-integrasjon i WordPress-pluginen](wp-plugins/storm-core/includes/class-storm-core-nif.php#L9-L42)
og et endepunkt i `api\storm-matches\index.js` for den statiske løsningen.
Undersøk og gjenbruk disse før det bygges en ny integrasjon eller en skraper.
NBBFs offisielle side «Finn din serie» viser til `kamper.basket.no`.
NIF publiserer også en Data API-beskrivelse; gjeldende endepunkt og tilgang må
verifiseres mot den, ikke bare antas ut fra eksisterende kode.

- [ ] Avklar hvilken offisiell tjeneste og godkjent tilgang som skal være
      autoritativ kilde for Tromsø Storms aktuelle lag, sesong og turnering.
- [ ] Verifiser dagens API-endepunkt, nødvendige rettigheter og organisasjons-/
      lag-ID-er. Oppbevar eventuelle klienthemmeligheter kun på serversiden.
- [ ] Ta hensyn til at BedSys-staging har tomme NIF-innstillinger og deaktivert
      WP-Cron. Planlegg kampoppdateringen eksplisitt uten å åpne e-postutsending
      eller aktivere alle andre planlagte WordPress-jobber.
- [ ] Kontroller dato, klokkeslett, tidssone, hjemme-/bortelag, fullstendig
      arenanavn og lenke til offisiell kampinformasjon.
- [ ] Test flyttede, utsatte og avlyste kamper samt situasjonen uten kommende
      kamper. Neste kamp skal ikke bli hengende igjen etter kampstart.
- [ ] Behold siste gyldige data ved API-feil, vis når data er sist oppdatert,
      og synliggjør feil i drift.
- [ ] Sammenlign den viste neste kampen med den offisielle kampsiden.

Ferdig når neste kamp oppdateres automatisk fra en verifisert offisiell kilde
uten manuell redigering, med dokumentert oppdateringsjobb og reservehåndtering.

## 5. Gjør den nye WordPress-testsiden delbar med arbeidsgruppen

Status: teknisk ferdig 25. oktober; Ørjans egen brukerakseptanse gjenstår.

Målet er å dele WordPress-installasjonen på BedSys, ikke en lenke til
`127.0.0.1` eller bare den statiske designkopien. Testtilgangen går nå over
beskyttet HTTPS uten krav om SSH-tunnel.

Valgt løsning: `https://storm.janinc.no/` på BedSys med tilgangskontroll for
gruppen. `janinc.no/storm/` videresender til denne testadressen.
En videresending endrer adressen i nettleseren; den gjør ikke Azure-siden til
en transparent WordPress-proxy.

- [x] Avklar testnavn, DNS-ansvar og hvem som skal få tilgang. Alternativt kan
      et eget underdomene på `janinc.no` brukes hvis DNS-tilgangen er tilgjengelig.
- [x] Sett opp HTTPS og tilgangskontroll på selve BedSys-testadressen før
      WordPress blir tilgjengelig utenfor SSH-tunnelen.
- [x] Beskytt også bilder, API-er og andre direkte adresser på testmålet;
      innlogging kun på en JanInc-delelenke beskytter ikke målserveren.
- [x] Behold e-postsperre og `noindex`, og bruk separate testkontoer. Ikke del
      administratorpassordet eller SSH-nøkler med hele gruppen.
- [x] Tilpass WordPress-adresse, interne lenker og proxy-ruting til testnavnet;
      ikke flytt nettstedet til en undermappe bare for å få en kort delelenke.
- [x] Opprett `janinc.no/storm/` som videresending når testmålet virker.
- [ ] Test fra en annen PC eller mobil uten SSH-tunnel: tilgang nektes uten
      godkjenning og fungerer for gruppen etter innlogging.

Ferdig når gruppen har en dokumentert, fungerende og tilgangsbegrenset HTTPS-lenke
til den faktiske nye WordPress-løsningen, uten å endre dagens produksjonsdomene.

Overleveringsdump, medier, tokens, passord og nøkler skal fortsatt holdes utenfor
dette offentlige repoet. Produksjonsbytte avtales separat.

## 6. Fullfør redaktørflyten for delmål 1 og bruksanvisningen

Status: Storm Core 0.5 er implementert, testet isolert og installert på den
aktive private BedSys-testsiden. Produksjon og DNS er ikke endret.
Dette er teknisk verifikasjon, ikke Ørjans brukerakseptanse.

- [x] Native redaktørfelt for klubbdata, redigerbare sider og seks forsidevalg.
- [x] Sesongklargjøring, kopiering som utkast, gjennomgang, aktivering,
      tilbakebytte og bevart publisert historikk.
- [x] Individuelle profiler, sesongavtaler, treningstider, kuraterte SOME-kort,
      kontrollfrister og avgrenset ekstern lenkekontroll.
- [x] Normalisert import: 1 721 poster uten konflikt, idempotent ny kjøring og
      vern mot overskriving av manuelle endringer. Alle 178 støttemedlemmer
      fra de to kildetabellene er bevart.
- [x] 57 WordPress-integrasjonsassertsjoner og 12 Compose-kontroller bestått.
      Ekte nettlesertest omfatter nyhet, bildeopplasting, alternativtekst,
      fremhevet bilde, PDF-opplasting/nedlasting, sider, forsidevalg, kamp,
      sesongskifte og mobilvisning.
- [x] Reell tidsstyrt publisering etter 125 sekunder; en bekreftet kølagt,
      ikke-godkjent jobb ble ikke kjørt. Bare gjennomgåtte publiserings-,
      Storm-NIF- og lenkekontrolljobber tillates.
- [x] Rettet publisering av nye flate sideadresser, balansert HTML ved valg
      av redigerbart arenainnhold og fjernet oppdiktede resultater/tabeller
      fra normalisert visning.
- [x] Norsk håndbok med 13 kapitler og egen akseptansetest:
      `wp-plugins\storm-core\BRUKSANVISNING.md`, menyen
      **Storm → Redaktørhåndbok** og en utskriftsklar PDF på sju sider:
      `docs\BRUKSANVISNING-ORJAN.pdf`.
- [x] Rettet transaksjonsforutsetningen i september-dumpen: 13 MyISAM-tabeller
      konvertert, slik at alle 34 WordPress-tabeller bruker InnoDB. Eksakte
      radantall og sorterte radhash-er er identiske i samtlige 128 tabeller;
      de 94 eldre domenetabellenes motorer er ikke endret.
- [x] Sesongaktivering avviser ikke-transaksjonell lagring. Reell tilbakerulling
      er testet etter påbegynt publisering, ved unntak og ved mislykket lagring
      av aktiv sesong. Ingen halvveis publisert sesong beholdes.
- [x] Utrull til aktiv privat staging etter fersk sikkerhetskopi; kontroller
      import, URL-er og ny ekstern backup med isolert gjenoppretting.
- [x] Aktiv side kontrollert i ekte nettleser: innlogging, håndbok, redaktørfelt,
      profiler, historisk bilde og alle sju API-visninger. Innhold ved denne
      utrullingen, før gjennomgangen i punkt 7:
      18 spillere, 3 trenere, 30 sponsorer, 45 bedriftsmedlemmer,
      133 personmedlemmer, 4 treningstider og 27 kamper.
- [x] Alle 2 168 kontrollerte flate adresser og 30 opprinnelige hierarkiske
      sideadresser svarer 200; ingen sideforeldre er endret.
- [x] Sluttbackup `20261024T095324Z` er lastet ned fra kryptert OneDrive og
      gjenopprettet isolert. Alle 128 tabellers antall og lagringsmotorer
      stemmer, alle 34 WordPress-tabeller er InnoDB, aktiv kode er identisk,
      og gjenopprettet WordPress virker med e-post/indeksering blokkert.
- [x] Aktiv avgrenset cron kjører som UID 33 uten vertsporter eller omstarter.
      Daglig kryptert backup er startet; første nye kjøring
      `20261024T095851Z` er fullført og kontrollsummene stemmer.
      Intervall er 24 timer og ekstern oppbevaring 35 dager.
      Sluttkvittering: `EDITORIAL-OPERATIONS-VERIFIED.json` på serveren,
      kontrollert kl. 10:02:08 UTC. Isolerte testtjenester er stoppet.
- [x] Opprett Ørjans personlige redaktørkonto og verifiser innlogging/håndbok.
- [ ] Bekreft faktisk tilgang fra Ørjans egen PC etter sikker deling av tilgang.
- [ ] La Ørjan gjennomføre håndbokens akseptansetest, særlig sesongskiftet.

NIF-tilgang, SMTP, godkjent engelsk oversettelsesflyt og produksjonssetting
krever egne avklaringer. Delt testadresse er etablert. Sponsorbilletter med QR, butikk
og hallens resultattavle er ikke del av denne leveransen.

## 7. Oppdater innhold etter september-snapshotet

Status: bekreftede spiller-/trenerendringer og kampresultater er lagt inn på
privat staging 24. oktober. Åtte nyere nyheter er klargjort som tydelig merkede
sammendragsutkast, ikke full artikkelimport. Dagens produksjon og DNS er uendret.

- [x] Sammenlign dagens offisielle spillerstall og de tilgjengelige
      Facebook-/Instagram-presentasjonene med septembergrunnlaget.
- [x] Legg inn Isac Angelsen, slik klubben staver navnet: guard, drakt 9,
      186 cm, født 2003, med klubbens eksisterende nettportrett og aktiv
      sesongtilknytning. De 18 tidligere spillerprofilene er uendret.
- [x] Legg inn Gregor Heil som fysisk trener med aktiv sesongtilknytning.
      Fornavn/rolle er kontrollert mot klubbens innlegg `DeyV70WDoVT`;
      etternavnet er kontrollert mot den lenkede offentlige profilen
      `gregor_heil`, ikke utledet av brukernavnet alene.
- [x] Behold Sergio Beleña, Kjetil Andresen og Hani Issalhi uten duplikater.
      De lå allerede i septembergrunnlaget. Aktiv side har nå 19 spillere
      og fire personer i trener-/støtteapparatet.
- [x] Oppdater sju manglende sluttresultater fra 26. september til
      23. oktober mot klubbens terminliste. Åtte kamper er nå ferdigspilt.
      Kampen 24. oktober er senere oppdatert til 86–112 og ferdigspilt
      25. oktober. Det er nå ni ferdigspilte kamper i det normaliserte datasettet.
- [x] Kontroller dagens partneroversikter, treningstider og billettside.
      De fire treningstidene stemmer; ingen priser eller avtaler er endret.
- [x] Klargjør åtte nyheter fra 25. september–19. oktober som egne, korte
      sammendragsutkast med originaldato og kildelenke. De er synlige for
      innlogget redaktør, men ikke publisert eller tilgjengelige anonymt.
      Originale produksjons-ID-er brukes aldri som mål-ID-er: de kolliderer
      med normaliserte kamp-/sesongposter i staging.
- [x] Rett to feil som ble avdekket i nettlesertesten: en trener uten bilde
      skal få nøytrale initialer, ikke Sergios portrett; sammendragsutkastenes
      kildelenker skal gå til originalartikkelen, ikke omskrives til en
      manglende staging-artikkel. Vanlige eldre internlenker omskrives fortsatt.
- [x] Kontroller endringene i desktop-/mobilnettleser, profiladresser,
      redaktørfelt, upubliserte utkast og uendrede eksisterende data.
      Oppdateringen er kjørt to ganger uten duplikater. Alle 94 eldre
      domenetabellers kontrollsummer og alle eksisterende artikkelrader er
      bevart. Den isolerte integrasjonstesten består nå av 61 assertsjoner.
- [x] Ta og gjenopprett ekstern backup før endringen:
      `20261024T102031Z`, med alle 128 tabellantall og lagringsmotorer like.
- [ ] Fullfør importen av de åtte originalartiklene og tilhørende medier fra
      en fersk, avklart overlevering. Ikke kall sammendragsutkastene en
      fullstendig arkivoppdatering eller publiser dem ukritisk som originaltekst.
- [ ] Avstem Isac/Gregor og nyhetsutkastene mot fersk overlevering med
      kildeadresse, navn og sesong før import. De nye native profilene har ikke
      oppdiktede legacy-ID-er; en senere import må ikke lage duplikater eller
      overskrive redaktørendringer.
- [ ] Skaff avklart portrett av Gregor. Ingen sosiale medier-bilder er kopiert
      eller automatisk merket med avklarte publiseringsrettigheter.
- [ ] Kontroller eventuelle eldre SOME-presentasjoner som ikke er offentlig
      lesbare uten innlogging, gjerne via direkte innleggslenker.
- [ ] Avklar Teknisk Bureau: finnes i septembergrunnlaget, men vises ikke på
      dagens offentlige side for øvrige samarbeidspartnere. Avtalen er ikke
      automatisk skjult eller slettet på grunnlag av dette alene.
- [x] Ta og gjenopprett ny ekstern sluttbackup etter innholdsoppdateringen:
      `20261024T103904Z`. Alle 128 tabellantall og lagringsmotorer stemmer;
      aktiv kode og Isacs nye portrett er kontrollert mot arkivet.
- [x] Kontroller at avgrenset cron og daglig backup fortsatt kjører. Cron
      kjører som UID 33 uten vertsporter/omstarter; gjenopptatt daglig backup
      `20261024T104239Z` er fullført og kontrollsummene stemmer.

Kildekontroll: 24. oktober 2026 kl. 12:26 norsk tid. Nettleserkontroll:
kl. 12:36; backup- og driftskontroll kl. 12:45. Detaljert oppdateringskvittering ligger som
`CONTENT-REFRESH-20261024.json` i den private prosjektroten på serveren.
Kampoppdateringen er manuell og dokumentert; den aktiverer ikke NIF automatisk.
