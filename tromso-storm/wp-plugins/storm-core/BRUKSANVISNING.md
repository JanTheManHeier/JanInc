# Bruksanvisning for Ørjan – Tromsø Storm

Gjelder den nye WordPress-løsningen, med Classic Editor og Storm Core 0.5.
Arbeidsgrunnlag: delprosjekt 1 i hovedplanen. Sponsorbilletter med QR, nettbutikk
og betjening av hallens storskjerm er egne delprosjekter og inngår ikke her.

Versjon: 24. oktober 2026. Datagrunnlaget er overleveringen fra 23. september,
ikke en løpende kopi av dagens produksjon. Kontroller spesielt nye nyheter,
kamper, resultater og avtaler før eventuell produksjonssetting.

**Den korte daglige flyten:** riktig nettsted → riktig sesong → rediger →
lagre utkast → forhåndsvis → publiser/oppdater → kontroller som utlogget.

## 1. Tilgang og forskjellen på test og produksjon

Logg inn på nettstedets adresse med /wp-admin/ til slutt.
På den private BedSys-testsiden er adressen http://127.0.0.1:18090/wp-admin/.
Denne virker bare på en PC med riktig SSH-tunnel. En offentlig delingsadresse er
ikke etablert. Jan/teknisk ansvarlig må gi deg tilgang og en personlig konto før
du starter. Ikke del administratorpassord eller SSH-nøkler.

Testsiden sender ikke e-post og er sperret for søkemotorer. Publisering der
endrer ikke dagens tromsostorm.no. Glemt-passord-epost virker derfor ikke på test;
kontakt teknisk ansvarlig. Ikke bruk testsiden til virkelige billettbestillinger.

Du bruker WordPress-administrasjonen til innhold. Du trenger ikke phpMyAdmin,
databasetilgang, Git eller serverkommandoer. Tekniske oppdateringer, backup og
produksjonssetting er ikke del av den daglige innholdsjobben.

## 2. Finn riktig meny

**Innlegg / Posts:** nyheter, kampreferater, intervjuer og andre artikler.

**Sider / Pages:** arena, billetter, sesongkort, klubbinfo og andre faste sider.

**Media / Medier:** bilder og PDF-er.

**Storm:** klubbdata. Personprofiler og sponsorprofiler er varige. Stalltilknytning
og sponsoravtale kobler dem til en bestemt sesong. Ikke lag ny personprofil bare
fordi en spiller fortsetter neste år.

**Storm → Sesongskifte:** klargjøring, gjennomgang, NIF-import og aktivering.

**Storm → Forsideinnhold:** velg redigerbare sider for forsidens tekst og bilder.

**Storm → Innholdskontroll:** innhold som har nådd kontroll- eller utløpsdato.

**Storm → Redaktørhåndbok:** denne veiledningen. «Skriv ut / lagre som PDF»
åpner nettleserens utskriftsvindu.

WordPress-knapper kan stå på norsk eller engelsk avhengig av kontospråk.
Fyll inn **Tittel / Title** eller navn også på nye klubbposter, for eksempel
«Storm – motstander», «Bedrift – 2026/27» eller «Herrelag – tirsdag».
Stalltilknytninger og avtaler får en beskrivende tittel når de lagres.

Du kan se eldre pluginbokser som **AIOSEO Settings** og **AIOSEO Writing
Assistant**. De er ikke nødvendige for publiseringsflyten i denne håndboken.
Du trenger ikke registrere deg hos en ekstern AI-/SEO-tjeneste. Boksene kan
foldes sammen; ikke endre tekniske plugininnstillinger uten avtale.

## 3. Slik publiserer du en nyhet

1. Velg **Innlegg → Legg til nytt / Posts → Add New**.
2. Skriv en presis tittel og artikkelteksten i den visuelle editoren.
3. Velg en relevant kategori. Ikke lag nesten like kategorier ved hvert innlegg.
4. Legg inn hovedbildet som **Fremhevet bilde / Featured image**. Dette er
   førstevalget på nyhetskortene. Bilder inne i teksten legges til med **Legg til
   media / Add Media**.
5. Fyll ut alternativtekst i mediebiblioteket. Beskriv det bildet tilfører saken.
   Bekreft at klubben har publiseringsrett og nødvendige samtykker.
6. Velg innholdsansvarlig og eventuell kontrollfrist i **Storm: publiseringskontroll**.
7. Velg **Lagre utkast / Save Draft**, så **Forhåndsvis / Preview**.
8. Kontroller overskrift, avsnitt, bildebeskjæring, lenker og mobilvisning.
9. Velg **Publiser / Publish**. Saken kommer på nyhetsoversikten og forsiden
   etter vanlig dato-sortering.

For å endre en sak: åpne den fra Innlegg og velg **Oppdater / Update**.
For å avpublisere: endre status til Utkast. Bruk papirkurven bare ved tilsiktet
sletting, ikke ved sesongskifte. WordPress-revisjoner kan brukes til å hente
tilbake tidligere tekstversjoner.

Publisering på et senere tidspunkt velges ved datoen i publiseringsboksen.
Klikk **Rediger / Edit** ved «Publiser straks / Publish immediately», velg dato
og klokkeslett, bekreft med OK og velg **Planlegg / Schedule**. Kontroller at
status er Planlagt. Driftsjobben behandler planlagte innlegg hvert minutt;
publisering kan komme litt etter tidspunktet. Kontakt teknisk ansvarlig hvis
den fortsatt er planlagt flere minutter senere. Dette er testet med en
virkelig tidsstyrt artikkel på den isolerte BedSys-testinstansen.

## 4. Bilder, PDF-er og video

Last opp egne filer i Medier. Bruk beskrivende filnavn og alternativtekst.
Ikke slett gamle filer bare fordi de ikke brukes på forsiden; historiske saker
kan fremdeles peke til dem.

En klubbavis lastes opp som PDF og lenkes fra riktig side eller innlegg.
Åpne lenken som besøkende etterpå. Last opp en ny filversjon fremfor å endre
adressen til en historisk PDF uten å avklare konsekvensene.

Portrett velges som fremhevet bilde på spiller-, trener- eller sponsorprofilen.
Et nytt fremhevet bilde erstatter den importerte bildeadressen i visningen.
Andre bilder og gallerier kan legges inn i profilens vanlige tekstfelt.
Profilvideo kan legges inn som lenke; ikke publiser materiale uten avklart rett.

## 5. Faste sider og redigerbare forsidefelt

Åpne riktig side under **Sider**. Enkelte sider har en spesialmal med ferdig
design og automatisk innhold. Vanlig tekstredigering erstatter ikke automatisk
denne malen.

For en fast informasjonsside som du vil redigere helt selv, fyll inn ønsket
tittel, tekst, bilder og lenker. Slå på **Bruk redigert sideinnhold i stedet for
standardmalen** i publiseringskontrollen. Forhåndsvis før Oppdater. Hele
spesialmalen erstattes av redigerbar tekst. Slå av valget for å få standardmalen
tilbake. Ikke bruk dette på dynamisk terminliste eller spillerstall.

For forsiden: lag en vanlig side med godkjent innhold og publiser den. Velg den
under **Storm → Forsideinnhold**. Forsidens introduksjon bruker sidens tittel,
tekst og fremhevede bilde. De andre feltene bruker sidens tittel og innhold.
Du velger siden med navn, ikke med database-ID. Utkast vises ikke offentlig.

Valgene er hovedoppslag, samfunnsseksjon, billettseksjon, partnerpresentasjon,
arena og lagbilde. Sett inn selve lagbildet og bildeteksten i den valgte sidens
innhold. Når normalisert sesonginnhold er aktivert, vises ikke et gammelt
standardlagbilde automatisk for nye sesonger. Ønsket bilde må velges/redigeres.
Velg **Standardinnhold** for å angre et tekstvalg; dette sletter ikke siden.

Ved prisendring kontrolleres både billettside, sesongkortside og forsidens
billettseksjon. Ikke annonser Vipps-beløp, betalingslenker eller fordeler som
klubben ikke har godkjent.

## 6. Kamper, resultater og billettlenke

Velg **Storm → Kamper → Legg til**. Velg sesong, dato/klokkeslett, hjemme- og
bortelag, arena og status. Tidspunktet legges inn i norsk lokal tid.
Bruk korrekt fullt arenanavn.

Legg inn kampens godkjente billettlenke hvis den finnes. Uten en slik lenke
bruker neste-kamp-knappen den vanlige billetthuben. Strømming og statistikk
har egne lenkefelt. En lenke er ikke det samme som et integrert billettsystem.

Planlagt kamp: velg status **Planlagt**. Etter kampen: legg inn sluttresultat
og velg **Ferdigspilt**. Ikke vis «LIVE» bare fordi starttidspunktet er passert.
Utsatte og avlyste kamper merkes med riktig status, og blir ikke neste-kamp-kort.

Bruk **Skjul kampen fra offentlig terminliste** ved feil eller duplikat.
Ved korreksjon av NIF-data velges **Manuell overstyring**, slik at en senere
import ikke overskriver redaktørens endring.

NIF-import startes fra Sesongskifte for den valgte sesongen og gir utkast.
Den krever klubbens nye, prosjektspesifikke NIF-tilgang. Uten fungerende tilgang
legges kamper inn manuelt. En feil i NIF skal ikke stoppe manuell publisering.

## 7. Spillere og trenere

1. Åpne **Storm → Spillere** eller **Trenere og støtteapparat**. Søk først etter
   en eksisterende profil.
2. Opprett eller endre navn, biografi, portrett og relevante profilfelt.
   Bruk bare verifiserte opplysninger. Ikke legg private kontaktopplysninger eller
   unødvendig full fødselsdato i offentlig innhold; fødselsår er tilstrekkelig.
3. Lagre/publiser profilen.
4. Åpne **Stalltilknytninger**, velg sesong og person. Velg riktig persontype.
5. Legg inn draktnummer, posisjon/rolle, rekkefølge og om tilknytningen er aktiv.
   Nummer **0** er gyldig. Velg fremheving for spillere som skal prioriteres på
   forsiden. Publiser tilknytningen.

Profil og tilknytning må begge være publisert for å vises. Ta en spiller ut av
aktiv stall ved å deaktivere den aktuelle sesongtilknytningen – ikke ved å
slette personprofilen eller tidligere sesonger.

Den delbare profiladressen finnes med **Vis** på profilen. Profilsiden viser
biografi, bilde, relevante profilopplysninger, eventuelle sosiale/video-lenker
og publiserte sesonger. Aksjonsbilder og mer historie legges i profilteksten.

## 8. Sponsorer og avtaler

Opprett sponsorens varige profil under **Storm → Sponsorer**: navn,
beskrivelse, logo som fremhevet bilde og godkjent nettadresse.

Opprett så **Sponsoravtale**. Velg sponsor, sesong, nivå, rekkefølge,
gyldighetsdatoer og aktiv-status. Publiser profilen og avtalen.

Det er sesongavtalen som bestemmer synligheten. Hovednivå vises prioritert;
andre nivåer brukes i partneroversiktene. En profil alene gir ikke automatisk
eksponering. Utkast og private profiler vises ikke.

Støttemedlemmer bruker også profil og sesongavtale, men avtalen har nivå
**Støttemedlem**. Velg **Bedrift** eller **Person** i profilens støttemedlemstype.
Bedrifter vises i bedriftslisten, personer i navnelisten. De blandes ikke inn
i hovedpartnernes logohierarki. Navn fra den gamle medlemslisten er bevart;
ikke anta at en historisk oppføring dokumenterer betalt medlemskap i dag.
Kontroller grunnlaget og klubbens tillatelse før publisering eller videreføring.

For å avslutte synlighet: deaktiver avtalen eller sett riktig sluttdato.
Tidligere sesongers avtaler beholdes som historikk. Kopiering til en ny sesong
er et utkast til nettsideinnhold, ikke en juridisk forlengelse av sponsoravtalen.
Kontroller nivå, datoer, logo, lenke og klubbens godkjenning før aktivering.

## 9. Treningstider

Velg **Storm → Treningstider**. Velg sesong, lag/gruppe, ukedag, start- og
sluttid, sted og eventuell gyldighetsperiode. Publiser.

Den aktive sesongens publiserte og gyldige tider vises på treningstidersiden.
En sluttid må være senere enn starttiden. Utkast og utløpte tider vises ikke.
Ikke rediger fjorårets sesong for å oppdatere årets treninger.

## 10. Facebook- og Instagram-kort

Velg **Storm → SOME-innlegg**. Legg inn tittel, kort tekst, plattform,
lenke til originalinnlegget, opprinnelig dato, lokalt opplastet fremhevet bilde,
alternativtekst og rekkefølge. Bekreft publiseringsrett og nødvendige samtykker.

Publiser og kontroller forsiden. Inntil fire aktive, publiserte og godkjente
kort vises. Utløpsdato skjuler et gammelt SOME-kort automatisk i visningen.
Slå av aktiv-status eller sett Utkast for å ta det bort. Hvis ingen kort
er klare, skjules hele seksjonen. Det hentes ingen ukontrollert Meta-feed.

## 11. Sesongskifte – uten tekniker

1. Åpne **Storm → Sesongskifte**.
2. Skriv startår, velg sesongen du vil kopiere fra og hvilke deler som skal
   videreføres: stall/trenerteam, sponsoravtaler og treningstider.
3. Velg **Klargjør sesong som utkast**. Dette endrer ikke aktiv sesong.
   Profiler gjenbrukes; de sesongspesifikke tilknytningene blir nye utkast.
   Gamle kamper og avtaledatoer kopieres ikke. Gjentatt klargjøring lager ikke
   flere kopier av den samme tilknytningen.
4. Åpne lenkene i oversikten for den nye sesongen. Ta bort kopierte utkast
   som ikke skal videreføres. Oppdater numre, roller, avtaler og treninger.
   En profilendring er felles på tvers av sesonger; sesongdata endres på
   tilknytningen.
5. Hent ny terminliste som utkast fra NIF, eller legg inn kampene manuelt.
   En eventuell offisiell tabell-ID må høre til den nye sesongen. Hvis den
   ikke er avklart, la feltet stå tomt; siden skal ikke vise fjorårets tabell
   eller oppdiktede tabellplasseringer. Be teknisk ansvarlig bekrefte ID-en.
6. Kontroller alle utkast i den nye sesongen. Publisering ved aktivering
   omfatter også sesongens tilknyttede utkast-profiler. Private profiler må
   håndteres uttrykkelig og publiseres ikke av veiviseren.
7. Velg sesongen i aktiveringsdelen, bekreft at alt innhold er gjennomgått,
   og velg **Publiser gjennomgått innhold og aktiver**.
8. Kontroller forsiden, terminliste, stall, sponsorer og treningstider som
   utlogget besøkende.

Bare én publisert sesong er aktiv. Den forrige sesongen slettes ikke og kan
åpnes som historikk. Ved feil kan en tidligere sesong aktiveres igjen.
Ikke slett data for å rydde forsiden. Be teknisk ansvarlig om hjelp hvis
veiviseren melder at en annen sesongoperasjon fremdeles pågår.

## 12. Kontrollfrister, feil og daglig rutine

Åpne **Storm → Innholdskontroll** regelmessig, og alltid før sesongstart.
Kontroller tekst, eier, datoer, billettpriser, bilder og lenkemål. Sett ny
kontrollfrist når saken er gjennomgått. Artikler og historiske sider blir ikke
automatisk slettet ved utløp.

Under **Eksterne lenker** vises kontrollerte adresser, HTTP-svar og kontrolldato.
Velg **Kontroller neste fem lenker** for en manuell delkontroll. Driftsjobben
kjører tilsvarende automatisk hver time, med begrenset antall forespørsler.
Den prioriterer de 100 sist endrede innleggene/sidene, 100 klubbposter og
valgte forsidesider; dette er ikke en full kontroll av hele det historiske arkivet.
Interne sider og lenker uten kontrolldato må fortsatt kontrolleres manuelt.
HTTP 404/410 bør rettes. HTTP 403/405 eller tidsavbrudd kan skyldes botfilter;
åpne lenken selv før den fjernes. Et HTTP-svar godkjenner ikke selve innholdet.

Hvis en endring ikke vises: kontroller at du er på riktig nettsted, at innholdet
er publisert, at riktig sesong er aktiv, og at person/sponsor OG tilknytning er
publisert. Sjekk aktiv-status, gyldighetsdato og om en spesialmal fortsatt brukes.
Prøv deretter en utlogget fane. Ikke løs det ved å redigere databasen.

Hvis publisering stoppes: les feilmeldingen, rett obligatoriske felt og lagre
på nytt. Ufullstendig klubbinnhold skal ikke publiseres som om alt var i orden.

Engelsk visning, endelig betalingsoppsett, automatisk NIF-tilgang og offentlig
testtilgang må godkjennes separat der leverandørtilgang eller innhold mangler.
Ikke anta at automatisk oversettelse er redaktørgodkjent.

## 13. Akseptansetest for Ørjan

Gjennomfør på test før produksjonsgodkjenning:

1. Lag, forhåndsvis, publiser og oppdater en nyhet med hovedbilde.
2. Last opp og åpne en PDF.
3. Endre en fast informasjonsside og kontroller offentlig visning.
4. Legg til en kamp, korriger arena og registrer resultat.
5. Opprett en spiller og koble personen til riktig sesong.
6. Publiser en sponsor med sesongavtale og kontroller nivå og utløp.
7. Endre en treningstid og publiser/avpubliser et SOME-kort.
8. Klargjør en ny prøvesesong, kontroller kopiene og aktiver den.
9. Kontroller at gammel sesong fortsatt kan åpnes, og aktiver originalsesongen
   igjen etter testen.

Si fra om skjermbilder, felt eller knapper ikke stemmer med denne veiledningen.
En teknisk test erstatter ikke din godkjenning av arbeidsflyten og klubbinnholdet.
