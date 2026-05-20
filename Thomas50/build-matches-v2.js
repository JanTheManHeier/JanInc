// Builds top-3 matches.json from Thomas50-allguests.json
// Each guest gets rank 1 (kept from v1), rank 2, rank 3
const fs = require('fs');
const path = require('path');

const guests = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'Thomas50-allguests.json'), 'utf8'));
const bordOf = {};
guests.forEach(g => { bordOf[g.navn] = g.bord; });

// Structure: same order as input. Each entry has allianse + 3 ranked matches.
const data = [
  // ---- Bord 1 ----
  { navn: "Adele Kjær-Appelbom", allianse: "De vise",
    r: [
      ["Lotte Møller", ["Begge er hundeglade turjenter","Snille sjeler fra Tromsø","Elsker dyr og frisk luft"], "Spør Lotte om hun har sett kolibri på fuglebrettet — det har Adele!"],
      ["Kristina Kantola", ["Begge er hundemammaer","Snille dyrevenner","Kongsbakken-til-tannlege-vibes"], "Bytt verste hundetriks og beste valpe-knep."],
      ["Hege Blikfeldt", ["Begge gir verdens beste klemmer","Snille som lam","Tromsø-jenter med hjerte"], "Hvem klemmer hardest — utfordring i kveld!"],
    ] },
  { navn: "Birk H Wilhelmsen", allianse: "Fjellfolket",
    r: [
      ["Anne Marvik", ["Begge har bakgrunn fra turn","Sterke, sporty Tromsø-folk","Vokst opp i hallene"], "Sammenlign favorittapparat — Birk var nordnorsk beste på flere!"],
      ["Marit Bratrud Nilsen", ["Begge lever for turn","Klatre- og turnmamma-energi","Sterke kropper"], "Diskuter hvilket element foreldre filmer altfor mye."],
      ["Bjarte Kristoffersen", ["Begge er NM-nivå sport","Turn møter svømming","Stålvilje i kroppen"], "Battle: hvem hadde slått hvem — turnmatte mot bassengkant?"],
    ] },
  { navn: "Inger Johanne Sumstad", allianse: "Mikrofon-kapererne",
    r: [
      ["Ellen Eliassen", ["Begge er drømmelærere","Kjent av tusenvis av elever","Varme klasseromsmagikere"], "Bytt beste «frøken-historie» — hvem har flest gamle elever som hilser i butikken?"],
      ["Hege Blikfeldt", ["Begge er lærere med klem","Elsker elevene sine","Tromsø-skolen banker"], "Bytt favoritt-knep for å roe en bråkete klasse."],
      ["Ragnhild Wilhelmsen", ["Begge er hjertet i familien","Bestemødre-energi","Henter folk hjem på middag"], "Sammenlign favorittoppskrift som barnebarna alltid spør om."],
    ] },
  { navn: "Maja Wilhelmsen", allianse: "De vise",
    r: [
      ["Nina Brox", ["Begge jobber på UNN","Helsehelter i hverdagen","Tromsø-naboer i ånden"], "Sammenlign verste vaktrapport — hvem har den villeste UNN-natta?"],
      ["Erin Hald", ["Begge er UNN-leger","Forskning møter klinikk","Tromsø-medisin på toppnivå"], "Bytt rareste blodprøve-historie uten å avsløre noen."],
      ["Marit Bratrud Nilsen", ["Begge er helsefolk med barn","Lege møter fysio","Holder familien gående"], "Diskuter hvilken kropp som klager mest etter en helg på fjellet."],
    ] },
  { navn: "Marianne Wilhelmsen", allianse: "Mikrofon-kapererne",
    r: [
      ["Anne Marit Bjørnflaten", ["Begge er sentrale AP-stemmer","Politikk i blodet","Bygger Norge fra nord"], "Diskuter hvilken statsråd som har best kakeoppskrift på Stortinget."],
      ["Odne Stunes", ["Begge er AP-engasjerte","Kreftforeningen møter regjering","Hjerte for samfunnet"], "Spør Odne hvilken sak han ville løftet inn på Stortinget i morgen."],
      ["Nina Wilhelmsen", ["Begge er ledere på toppnivå","Politikk møter IBM","Står på, døgnet rundt"], "Bytt verste møte-skrekk — uten å bryte taushetsplikten."],
    ] },
  { navn: "Ronny Andre Bendiksen", allianse: "Mikrofon-kapererne",
    r: [
      ["Øyvind Grinde", ["Begge er tech-hjerner i flokken","Datakonsulent møter kryptolog","Familiens IT-support"], "Spør Øyvind hva han ville sikret først hvis han fikk Ronnys familie-nettverk."],
      ["Jan Heier Johansen", ["Begge bygger med kode","Datakonsulent møter AI-mann","App-snakk på høyt nivå"], "Spitball: hvilken app skulle vært laget for Thomas50?"],
      ["Gro-Hilde Severinsen", ["Begge tenker tech og data","IT-konsulent møter e-helse","Framtidas verktøy på agendaen"], "Diskuter hvilken AI-assistent dere ville hatt på jobben i morgen."],
    ] },
  { navn: "Snorre H Wilhelmsen", allianse: "De vise",
    r: [
      ["Stig Tennås", ["Begge har vinylspiller","Strålende musikksmak","Stille kraftsentre"], "Be Stig anbefale tre LP-er som må stå på hybelen i Trondheim."],
      ["Iris Wikmark", ["Begge er turntalenter","Nordnorsk turntradisjon","Apparat-eksperter"], "Bytt favoritt-apparat — hvilket savner dere mest i dag?"],
      ["Jan Erik Olsen", ["Begge fordyper seg helt","FysMat møter forskning","Intellektuell musikkglede"], "Spør Jan Erik om beste klassisk-gitar-låt for vinylen."],
    ] },
  { navn: "Thomas Hansen", allianse: "Mikrofon-kapererne",
    r: [
      ["Jan Heier Johansen", ["Begge er Yes-menn med FOMO","Bursdagsapp-makker","Topptur og festkompis"], "Velg neste topptur i Alpene sammen — hvilken uke i 2026 passer?"],
      ["Odd Gunnar Ingebrigtsen", ["Reist verden sammen","Fallskjerm til munk-tilværelse","Eventyrkompis nummer én"], "Hent fram beste tur-historie — taperen tar runden!"],
      ["Kjell Roger Andersen", ["Tallrike telttur og topptur","Løvens Hule-alumni","Sprek og turklar"], "Plan neste fjelltur — Balsfjord eller Lyngen først?"],
    ] },

  // ---- Bord 2 ----
  { navn: "Anita Sivertsen", allianse: "De vise",
    r: [
      ["Erik Josefsen", ["Begge jobber i bank","Nord-norske finansfolk","Stødige hverdagshelter"], "Sammenlign hvem som har best kundehistorie fra fredag ettermiddag."],
      ["Terje Karlsen", ["Begge er bankfolk","Tromsø-finans i hverdagen","Service med smil"], "Bytt verste systemkrasj-skrekk fra månedsslutt."],
      ["Bjarte Kristoffersen", ["Begge har orden på tallene","Bankdame møter økonomisjef","Hold-hjulene-i-gang-folk"], "Diskuter hvilken Tromsø-bedrift som har sterkest finansiell vekst i 2026."],
    ] },
  { navn: "Helge Hansen", allianse: "Fjellfolket",
    r: [
      ["Kjell Roger Andersen", ["Begge er friluftsmenn","Elsker gård og fjord","Blir bare sprekere"], "Sammenlign favoritt-turmål i Balsfjorden eller Sørreisa."],
      ["Arne Aarhus", ["Begge er eventyr-veteraner","Sørreisa-energi møter Island","Historier i bøtter og spann"], "Spør Arne om verste hopp han noensinne har gjort."],
      ["Geir Helge Valle", ["Begge er sporty distrikts-folk","Hytte-folk med ekte beina","Tør å gå ut i alt vær"], "Bytt favoritt-hyttebok — eller beste fiskestang-tips."],
    ] },
  { navn: "Iris Wikmark", allianse: "Fjellfolket",
    r: [
      ["Kristina Kantola", ["Begge har turn i hjertet","Turnmamma-energi","Midt-Troms og Tromsø-puls"], "Diskuter hvilket apparat barna gruer seg mest for."],
      ["Marit Bratrud Nilsen", ["Begge er turn- og fysio-glade","Sterke kvinner i hallen","Hold-deg-i-form-vibes"], "Spør Marit om beste fotomodell-historie fra før fysio-yrket."],
      ["Anne Marvik", ["Begge er nordnorske turntalenter","RG møter apparat-turn","Gyllenborg-historien lever"], "Bytt favoritt-element — hvilket hadde dere aldri turt på matta i dag?"],
    ] },
  { navn: "Jakob B Hansen", allianse: "Bakrommet-stammen",
    r: [
      ["Terje Karlsen", ["Begge elsker fotball og tall","EY-rådgiver møter banktrener","Konkurranseinstinkt"], "Tipp neste cupvinner — taperen spanderer cazadores."],
      ["Marius Furnes", ["Begge er sporty festløver","Ung Tromsø-puls","Aldri nei til afterski"], "Velg neste skihelg — hvem booker hytta?"],
      ["Ståle Søfting", ["Begge er forretningsfolk","EY møter Sales Director","Tar plassen i møterommet"], "Bytt verste pitch-skrekk fra siste kvartalspresentasjon."],
    ] },
  { navn: "Kathrine B Hansen", allianse: "Bakrommet-stammen",
    r: [
      ["Magnus Seppola", ["Begge er smittende morsomme","Latterkramper på rekord","Frekk humor"], "Bytt verste vits fra Myre vs. Tromsø — best vits vinner ølpils."],
      ["Hårek Guneriussen", ["Begge har frekk humor","Latter-magnet i rommet","Distrikts-stolthet"], "Lag en TikTok sammen — Hårek filmer, Kathrine knekker vitsen."],
      ["Andreas Willumsen", ["Begge løfter stemningen","Frekk og festglad","Aldri kjedelig i lag"], "Velg kveldens vorspielsang — bordet bestemmer."],
    ] },
  { navn: "Marte Lysnes Kristoffersen", allianse: "Havets folk",
    r: [
      ["Nina Mikkelsen", ["Begge er NFH-folk","Fiskeri og forskning","Senja og gård-vibe"], "Diskuter hvor mye fysio en havforsker egentlig trenger."],
      ["Synne Guldbrandsen", ["Begge er NFH-jenter","Fiskeri-næringa i blodet","Senja møter Råfisklaget"], "Bytt favoritt-sild-rett som ikke krever bestikk."],
      ["Marit Bratrud Nilsen", ["Begge er fysioterapeuter","Helse og bevegelse","Sporty kvinner"], "Spør Marit om beste øvelse mot dårlig kontorholdning."],
    ] },
  { navn: "Trond Vidar Hansen", allianse: "Fjellfolket",
    r: [
      ["Bjarte Kristoffersen", ["Begge er kompetitive sportsfolk","Ersfjord og Kvaløya-helter","Eliteserie møter NM-svømming"], "Krev revansje: golf vs. svømming — hvem ler sist?"],
      ["Terje Karlsen", ["Begge brenner for fotball","Eliteserie møter trener","Strava-folk"], "Spå neste TIL-sesong — taperen tar mårrabrødet."],
      ["Eirik Torbergsen", ["Begge løper raskere enn skyggen","Kompetativ til siste meter","Knærne holder så lenge de må"], "Velg neste løp — Midnattsola eller Tromsø Skyrace?"],
    ] },
  { navn: "Åge Hansen", allianse: "Havets folk",
    r: [
      ["Geir Olav Skogstad", ["Begge er sjø- og rederi-folk","Skibsverft møter rederi","Saltvann i årene"], "Bytt verste verft-historie og beste sjømann-vise."],
      ["Ivar Wullf", ["Begge bygger sjønæringa","Skibsverft møter Lerøy","Lange karrierer på kaikanten"], "Spør Ivar hvilken båt han ville eid hvis han kunne velge fritt."],
      ["Renate Larsen", ["Begge er sjø-mennesker","Verft møter Ocean Food","Tromsø-stolthet"], "Diskuter neste store sjømat-eventyr fra nord."],
    ] },

  // ---- Bord 3 ----
  { navn: "Anne Marit Bjørnflaten", allianse: "Mikrofon-kapererne",
    r: [
      ["Marianne Wilhelmsen", ["Begge er AP-stjerner","Politikk på toppnivå","Sterke kvinner i regjeringsapparatet"], "Sammenlign verste valgkamp-historie — Tromsø vs. Oslo."],
      ["Synne Guldbrandsen", ["Begge jobber med havets ressurser","Råfisklaget møter sjømat-politikk","Bygger Norges blå merke"], "Velg neste sjømat-eksportmarked — Sør-Korea eller Brasil?"],
      ["Ivar Wullf", ["Begge er havbruks-toppfolk","Politikk møter Lerøy","Grønt gull fra havet"], "Bytt favoritt-laksefilet og beste tilbehør."],
    ] },
  { navn: "Gunnar Wilhelmsen", allianse: "Mikrofon-kapererne",
    r: [
      ["Lasse Pettersen", ["Begge bygger Tromsø","Ordfører møter bussjef","Byutvikling i praksis"], "Diskuter neste rutekart — hvor trengs det en ny holdeplass først?"],
      ["Anne Marvik", ["Begge er Tromsø-ledere","Aleris møter ordfører","Bygger byens hverdag"], "Velg hvilken bydel som trenger mer helsetilbud først."],
      ["Jon Steinar Engenes", ["Begge er Tromsø-bygger","Ordfører møter Head of Comm","Holder hjul i bevegelse"], "Bytt verste presse-skrekk fra en mandag morgen."],
    ] },
  { navn: "Jacob Wilhelmsen", allianse: "Bakrommet-stammen",
    r: [
      ["Marius Furnes", ["Begge elsker ski og fotball","Aldri nei til afterski","Ung og sporty"], "Hvor er beste afterski-baren i Norge nå? Bestem dere."],
      ["Andreas Willumsen", ["Begge er festglade Tromsø-gutter","Utelivskonge møter utflytter","Trives best på dansegulvet"], "Velg kveldens vorspielsang — bordet skal lære den."],
      ["Magnus Seppola", ["Begge er morsomme festløver","Latter og ølpils","Bakrom-energi"], "Bytt verste russe-historie — kun lyse minner!"],
    ] },
  { navn: "Jørgen Wilhelmsen", allianse: "Mikrofon-kapererne",
    r: [
      ["Erlend Hagan", ["Begge er NRK-folk","Språknerder i mikrofonen","Skifter tonefall som ingen andre"], "Konkurrer: hvem klarer best Kola-russisk og kav tromsøværing i samme setning?"],
      ["Hilde Sander Meling", ["Begge er journalister","Avisa Tromsø møter NRK","Skriver Tromsø inn i historien"], "Bytt favoritt-intervjuobjekt og verste deadline-skrekk."],
      ["Lasse Pettersen", ["Begge driver Tromsø-mediekultur","Bukta møter Helgemorgen","Holder byen på lufta"], "Plan en Bukta-reportasje sammen — hvilken artist åpner?"],
    ] },
  { navn: "Mats Sæverud", allianse: "Bakrommet-stammen",
    r: [
      ["Hårek Guneriussen", ["Begge underholder hele gjengen","Gitar møter standup","Narvik-Tromsø-energi"], "Lag en ti-sekunders TikTok sammen — Hårek filmer, Mats spiller."],
      ["Anneli Drecker", ["Begge er allsang-magnetene","Gitar møter sang","Får hele rommet med"], "Velg én låt som garantert får bordet til å reise seg."],
      ["Jon Marius Aareskjold", ["Begge er musikknerder","Gitar møter produsent","Studio-prat på høyt nivå"], "Plan en jam-session — hvilken låt åpner kvelden?"],
    ] },
  { navn: "Nina Wilhelmsen", allianse: "Mikrofon-kapererne",
    r: [
      ["Cathrine Marie Giæver", ["Begge er ledere med stil","IBM-exec møter komm-sjef","Tar styringen elegant"], "Bytt beste tips for å lede møter uten kjedelige PowerPoints."],
      ["Anne Marvik", ["Begge er topp-ledere","IBM møter Aleris","Tromsø-jenter som styrer"], "Sammenlign beste teknikk for å holde ro i krise-møter."],
      ["Lise Valle", ["Begge er superorganisatorer","IBM møter sjenkebevilling","Holder tråden i alt"], "Plan drømmemiddagen — hvem inviterer, hvem lager menyen?"],
    ] },
  { navn: "Odne Stunes", allianse: "Bakrommet-stammen",
    r: [
      ["Jon Marius Aareskjold", ["Begge er musikere på høyt nivå","Kontrabass møter produsent","Tromsø-scenen banker"], "Plan en jam-session — hvilken låt åpner kvelden?"],
      ["Anne Marvik", ["Begge brenner for helse og samfunn","Kreftforeningen møter Aleris","Stort hjerte for folk"], "Bytt favoritt-sak dere ville løftet i media i morgen."],
      ["Erlend Hagan", ["Begge er kreative kulturfolk","Kontrabass møter revy","Kirkenes møter NRK"], "Lag en sketsj sammen — kontrabass som lydeffekt."],
    ] },
  { navn: "Ragnhild Wilhelmsen", allianse: "De vise",
    r: [
      ["Inger Johanne Sumstad", ["Begge er hjertet i familien","Bestemødre-energi","Inviterer på middag uten varsel"], "Sammenlign favorittoppskrift som barnebarna alltid spør om."],
      ["Helge Hansen", ["Begge er familiens støttepunkt","Pensjonist-energi med fart","Tar vare på alle rundt"], "Bytt beste hverdags-tips for å holde seg sprek over 70."],
      ["Åge Hansen", ["Begge er familiens trygge favn","Onkel og bestemor-energi","Skaper plass for alle"], "Spør Åge om beste skipper-historie fra 80-tallet."],
    ] },
  { navn: "Renate Larsen", allianse: "Havets folk",
    r: [
      ["Ivar Wullf", ["Begge er sjømat-toppledere","Styrerom og havbruk","Bygger Norges blå framtid"], "Diskuter hvilket havbrukseventyr som kommer neste tiår."],
      ["Synne Guldbrandsen", ["Begge er sjømat-dronninger","Ocean Food møter Råfisklaget","Tromsø-stolthet på tallerken"], "Bytt favoritt-sild-rett som ikke krever bestikk."],
      ["Kenneth Mikkelsen", ["Begge har sjøen som arbeidsplass","Styreleder møter fiskerijus","Næringens stødige ryggrad"], "Spør Kenneth om rareste seilbåt-historie fra Middelhavet."],
    ] },

  // ---- Bord 4 ----
  { navn: "Heidi Lekang", allianse: "Bakrommet-stammen",
    r: [
      ["Anneli Drecker", ["Begge lever og ånder musikk","Filharmoni møter Bel Canto","Tromsø-kulturen i hjertet"], "Anbefal hverandre én britisk plate som må høres før sommeren."],
      ["Stig Tennås", ["Begge har dyp musikkglede","Filharmoni møter vinyl","Stille kraftsentre"], "Spør Stig om beste vinyl å høre med god kaffe og bok."],
      ["Lena Schøning", ["Begge er rolige akademikere","Filharmoni møter Viddeseminar","Bok og hytte først"], "Bytt favoritt-bok du gjerne leser om igjen."],
    ] },
  { navn: "Jan Erik Olsen", allianse: "De vise",
    r: [
      ["Marianne Svorken", ["Begge er Nofima-forskere","Marin biotek-elskere","Fordyper seg helt"], "Diskuter neste forskningsprosjekt — kan det involvere japansk seaweed?"],
      ["Erlend Hagan", ["Begge er språk-nerder","Japansk møter russisk og samisk","Lærer for moro skyld"], "Bytt favoritt-frase på hvert deres språk — bordet gjetter betydningen."],
      ["Jon Marius Aareskjold", ["Begge har sterk musikkidentitet","Klassisk gitar møter studio","Fordyper seg i lyd"], "Plan en akustisk kveld — hvem leder, hvem produserer?"],
    ] },
  { navn: "Lise Benjaminsen", allianse: "Bakrommet-stammen",
    r: [
      ["Siv-Cathrine Torbergsen", ["Begge er SATS-faste","Sprudlende morgenmennesker","Tromsø-puls i topp"], "Sammenlign favorittime — bodypump eller spinning på mårran?"],
      ["Anneli Drecker", ["Begge brenner for sang og scene","Bel Canto møter Filharmoni","Tromsø-kulturen lever"], "Velg én sang dere kan synge i kanon ved bordet."],
      ["Lise Valle", ["Begge heter Lise og er sprudlende","Salg/marked møter sjenkebevilling","Tromsø-energien banker"], "Hvem er kveldens beste Lise — la bordet bestemme!"],
    ] },
  { navn: "Marita Mokkelbost", allianse: "Bakrommet-stammen",
    r: [
      ["Maria Christina Edwall", ["Begge er kreative sjeler","Kunst møter grønne fingre","Tilflyttere med sansen"], "Tegn drømmehagen sammen — Marita maler, Maria planter."],
      ["Anneli Drecker", ["Begge er kreative kvinner","Kunst møter sang","Lever for det vakre"], "Bytt favoritt-konsert eller utstilling fra siste år."],
      ["Marianne Wilhelmsen", ["Begge elsker kunst","Investerer møter skaper","Smykker og lerret"], "Spør Marianne hvilken kunstner hun ville støttet neste."],
    ] },
  { navn: "Morten Gammelgård", allianse: "Bakrommet-stammen",
    r: [
      ["Rune Myreng", ["Begge er mat-feinschmeckere","Etikette møter kosthold","Vet hvilken gaffel"], "Lag dagens meny — Morten setter etiketten, Rune vurderer næringen."],
      ["Lars Gaute Jørgensen", ["Begge er livsnyter-typer","Badstu og festival","Tur, mat og uteservering"], "Plan en perfekt lørdag — badstu, mat, øl — i hvilken rekkefølge?"],
      ["Geir Olav Skogstad", ["Begge er reise-livsnytere","Festival møter stamp på hytta","Synger gjerne høyt"], "Velg favoritt-festival — Bukta, Trænafest eller Roskilde?"],
    ] },
  { navn: "Ole-Morten Indigo Lekang", allianse: "Bakrommet-stammen",
    r: [
      ["Jon Marius Aareskjold", ["Begge er Tromsø-musikere","Trommer møter produsent","Jernbanen-stamgjester"], "Plan en live-kveld på Jernbanen — hvilken sjanger først?"],
      ["Mats Sæverud", ["Begge spiller og synger","Trommer møter gitar","Allsang-garantister"], "Velg én låt dere kan jamme på umiddelbart."],
      ["Ellen Eliassen", ["Begge er lærere som elsker jobben","VGS møter KUS","Tar elevene på alvor"], "Bytt beste klasseromsanekdote uten å bryte taushetsplikten."],
    ] },
  { navn: "Ranveig Langseth", allianse: "De vise",
    r: [
      ["Line Myreng", ["Begge er sykepleiere","Holder hjul i helsenord","Tålmodighet på pro-nivå"], "Sammenlign rareste vakt-historie — nyfødt-intensiv vs. allmenn."],
      ["Nina Brox", ["Begge er helsefolk","Sykepleier møter farmasøyt","UNN-kollegaer i ånden"], "Bytt verste resept-skrekk eller pasient-overraskelse."],
      ["Ingelill Kleivnes", ["Begge er rolige helsehelter","Sykepleier møter farmasøyt","Holder ut sterke menn"], "Diskuter hvordan dere overlever ektemennenes store ideer."],
    ] },
  { navn: "Ståle Søfting", allianse: "Mikrofon-kapererne",
    r: [
      ["Jakob B Hansen", ["Begge er forretningsfolk","Sales Director møter EY","Stavanger og Tromsø allierer seg"], "Diskuter Tottenham vs. norsk eliteserie — hvem leverer flest skuffelser?"],
      ["Marius Furnes", ["Begge er sales- og fest-typer","SK Gruppen møter GC Rieber","Ler godt på jobben"], "Bytt verste lunsjmøte-skrekk fra siste konferanse."],
      ["Ørjan Berg Karlsen", ["Begge har dyre vaner","Stavanger møter Tromsø","Tar en god flaske til middag"], "Velg neste fellestur — vinmarker eller golfbane?"],
    ] },

  // ---- Bord 5 ----
  { navn: "Anneli Drecker", allianse: "Bakrommet-stammen",
    r: [
      ["Mats Sæverud", ["Begge er allsang-magnetene","Sang møter gitar","Får hele rommet med"], "Velg én låt som alltid funker rundt bålet."],
      ["Heidi Lekang", ["Begge lever for musikk","Bel Canto møter Filharmoni","Tromsø-kulturen banker"], "Anbefal hverandre én britisk plate som må høres før sommeren."],
      ["Lena Schøning", ["Begge er rolige akademikere","Doktorgrad møter førsteamanuensis","Klatrer høyt"], "Diskuter hva som er hardest: viddeseminar eller live-konsert?"],
    ] },
  { navn: "Hans Thomas Brox", allianse: "Fjellfolket",
    r: [
      ["Arne Aarhus", ["Begge er fallskjerm-veteraner","Eventyr i blodet","Historier på lager"], "Bytt skrekkhistorie fra siste hopp — eller verste flytur."],
      ["Odd Gunnar Ingebrigtsen", ["Begge er fallskjerm-hoppere","Eventyr-typer på alle nivå","Rolig under press"], "Spør Odd Gunnar om munke-tilværelsen — er fallskjerm med?"],
      ["Ivar Wullf", ["Begge er fallskjermklubb-veteraner","Uredde sjeler","Tar ledelse uten å rope"], "Bytt favoritt-landing — verste eller mest elegante?"],
    ] },
  { navn: "Hege Blikfeldt", allianse: "De vise",
    r: [
      ["Ellen Eliassen", ["Begge er lærere som elsker","Klemmer på rekord","Elevene først"], "Bytt beste klassefavoritt-knep som funker hver gang."],
      ["Inger Johanne Sumstad", ["Begge er fødte lærere","Kjent som «frøken»","Hjerte for elevene"], "Sammenlign nyutdanna møter veteran — hva har endret seg mest?"],
      ["Ragnhild Wilhelmsen", ["Begge er varme familiehjerter","Lærer møter middagsvert","Tar vare på alle"], "Bytt favoritt-middagsrett som alltid samler folket."],
    ] },
  { navn: "Hårek Guneriussen", allianse: "Bakrommet-stammen",
    r: [
      ["Erlend Hagan", ["Begge er fødte underholdere","TikTok møter NRK-revy","Får latteren til å renne"], "Lag en sketsj sammen — Narvik møter Kola-halvøya."],
      ["Magnus Seppola", ["Begge er morsomme festløver","Vitser og ølpils","Får hele rommet med"], "Battle: én tre-liner hver — bordet kårer vinneren."],
      ["Andreas Willumsen", ["Begge er festens midtpunkt","TikTok møter after-ski","Sjarmør-energi"], "Plan en festkveld — hvem booker DJ, hvem booker baren?"],
    ] },
  { navn: "Jon Marius Aareskjold", allianse: "Bakrommet-stammen",
    r: [
      ["Ole-Morten Indigo Lekang", ["Begge er proff-musikere","Produsent møter trommis","Tromsø-scenen er hjemmebanen"], "Planlegg en nabolagsdrink-kveld med live-trommer i hagen."],
      ["Odne Stunes", ["Begge er musikere med dybde","Produsent møter kontrabass","Studio og scene"], "Velg én låt dere kan jamme med kontrabass og synth."],
      ["Mats Sæverud", ["Begge er musikknerder","Produsent møter gitar","Allsang-energi i flokk"], "Bytt favoritt-Triko-låt eller -Tromsø-konsert."],
    ] },
  { navn: "Lena Nymark", allianse: "Bakrommet-stammen",
    r: [
      ["Lena Schøning", ["Begge heter Lena og er gjestfrie","Tidsoptimister møter jurist","Lange middager"], "Bestem hvem som er kveldens beste Lena — myntkast?"],
      ["Ragnhild Wilhelmsen", ["Begge er gjestfrie middagsverter","Inviterer alltid en til","Holder familien samlet"], "Bytt favoritt-middagsrett som alltid samler folk."],
      ["Anita Sivertsen", ["Begge er vennlige Tromsø-folk","Gjestfrie og blide","Ser folk skikkelig"], "Spør Anita om favoritt-Olivita-trikset for energi."],
    ] },
  { navn: "Nina Brox", allianse: "De vise",
    r: [
      ["Ingelill Kleivnes", ["Begge er farmasøyter","Tromsø via omveier","Holder ut sterke menn"], "Sammenlign verste resept-skrekk fra ekspedisjonen."],
      ["Maja Wilhelmsen", ["Begge er UNN-helter","Farmasi møter klinikk","Tromsø-helse på topp"], "Bytt favoritt-vaktrutine for å overleve nattevakter."],
      ["Ranveig Langseth", ["Begge er rolige helsehelter","Farmasi møter sykepleier","Tålmodighet på topp"], "Diskuter hvilke medisinske myter pasientene bringer mest."],
    ] },
  { navn: "Terje Nymark", allianse: "Bakrommet-stammen",
    r: [
      ["Lasse Pettersen", ["Begge er Tromsø-kultur","Bukta møter Arktisk Film","Bygger byens scene"], "Hvem booker neste headliner? Foreslå én artist hver."],
      ["Lars Hadsel Hansen", ["Begge er Melbu-gutter","Vesterålen-stolthet","Hjemstedet sitter i blodet"], "Bytt favoritt-Moviebox-film fra 90-tallet."],
      ["Erlend Hagan", ["Begge driver media og scene","Film møter NRK-revy","Storyteller-energi"], "Plan en kortfilm-pitch — én setning, én location."],
    ] },

  // ---- Bord 6 ----
  { navn: "Arne Aarhus", allianse: "Fjellfolket",
    r: [
      ["Erlend Hagan", ["Begge er reise-eventyrere","Islending møter Kola-reddet","Historier uten ende"], "Hvem har det villeste pass-stempelet? Bytt to historier hver."],
      ["Hans Thomas Brox", ["Begge er fallskjerm-veteraner","Eventyr i blodet","Tør det meste"], "Bytt skrekkhistorie fra siste hopp — eller verste flytur."],
      ["Hårek Guneriussen", ["Begge er Mirage-fallskjerm-folk","Eventyr og historier","Får latteren til å gå"], "Velg verste eventyr-uhell dere har fortalt på TikTok eller scene."],
    ] },
  { navn: "Bjarte Kristoffersen", allianse: "Fjellfolket",
    r: [
      ["Eirik Torbergsen", ["Begge er løps- og svømmehelter","Sport på toppnivå","Knærne holder enda"], "Bestem neste triatlon — Ersfjorden eller Tromsø sentrum?"],
      ["Trond Vidar Hansen", ["Begge er kompetative sportsfolk","Svøm møter fotball","Konkurranseinstinkt"], "Krev revansje: golf vs. svømming — hvem ler sist?"],
      ["Terje Karlsen", ["Begge kombinerer bank og sport","Økonomi møter Strava","Disiplin i begge gater"], "Sammenlign favoritt-løype rundt Tromsøya."],
    ] },
  { navn: "Gina Bjørnstrøm", allianse: "De vise",
    r: [
      ["Marit Osima", ["Begge er leger fra distriktet","Sørreisa møter Båtsfjord","Snille som sommerdag"], "Sammenlign rareste pasient-historie fra hjembygda."],
      ["Christine Strøm", ["Begge er leger","Allmenn møter psykiatri","Lytter mer enn de snakker"], "Bytt beste reisetips for å koble av etter en vakt."],
      ["Maja Wilhelmsen", ["Begge er leger med distriktsglede","Tromsø-base, hjerte for nord","Familiens huslege"], "Spør Maja om beste skipper-pakke for en sjøsyk turist."],
    ] },
  { navn: "Hilde Sander Meling", allianse: "Havets folk",
    r: [
      ["Jørgen Wilhelmsen", ["Begge er journalister","Avisa Tromsø møter NRK","Skriver Tromsø inn i historien"], "Bytt favoritt-intervjuobjekt og verste deadline-skrekk."],
      ["Erlend Hagan", ["Begge er media-folk","Bergen-journalistikk møter NRK-revy","Forteller-stemmer"], "Plan en reportasje fra Andøya — hvilken vinkel åpner?"],
      ["Christine Strøm", ["Begge er reisende sjeler","Vestlandsglede møter reiseorganisator","Familie-tun og rikt liv"], "Velg drømme-reisemål dere kunne booket i morgen."],
    ] },
  { navn: "Ingelill Kleivnes", allianse: "De vise",
    r: [
      ["Marit Bratrud Nilsen", ["Begge er fagperson som holder ut","Farmasi møter fysio","Sterke kvinner i bakgrunnen"], "Sammenlign hvilken kropp som klager mest etter en helg på fjellet."],
      ["Nina Brox", ["Begge er farmasøyter","Tromsø-kollegaer i ånden","Tilflyttere som ble"], "Bytt verste resept-skrekk fra ekspedisjonen."],
      ["Ranveig Langseth", ["Begge er helsefolk med tålmodighet","Farmasi møter sykepleie","Holder ut sterke menn"], "Diskuter hvordan dere overlever ektemennenes store ideer."],
    ] },
  { navn: "Ivar Wullf", allianse: "Havets folk",
    r: [
      ["Kenneth Mikkelsen", ["Begge er sjømat-toppfolk","Lerøy møter fiskerijus","Andøya og Middelhav"], "Diskuter beste sjømat-paring til Mack-pils."],
      ["Renate Larsen", ["Begge er sjømat-toppledere","Lerøy møter Ocean Food","Bygger Norges blå framtid"], "Plan neste store havbruks-eventyr — privat eller næring?"],
      ["Ole Herman Strømmesen", ["Begge er havbruks-veteraner","Lerøy møter OHS","Saltvann i blodet"], "Bytt verste storm-historie fra anlegget."],
    ] },
  { navn: "Jon Steinar Engenes", allianse: "Mikrofon-kapererne",
    r: [
      ["Cathrine Marie Giæver", ["Begge styrer kommunikasjonen","Head of Comm møter komm-sjef","Tromsø-stemmer ut i verden"], "Velg krisens beste talepunkt: «Vi har full kontroll» eller «Vi vurderer fortløpende»."],
      ["Ørjan Berg Karlsen", ["Begge har reise-livsstil","Apollo møter dyre vaner","Trives med opplevelser"], "Bytt favoritt-destinasjon som ikke står i Lonely Planet."],
      ["Geir Olav Skogstad", ["Begge er livsnytende ledere","Apollo-veteran møter rederi-sjef","Reise og rom for fest"], "Plan en charter-helg — hvilken destinasjon og hvem booker baren?"],
    ] },
  { navn: "Odd Gunnar Ingebrigtsen", allianse: "Fjellfolket",
    r: [
      ["Hårek Guneriussen", ["Begge er Mirage-veteraner","Fallskjerm og fest","Eventyrere på alle plan"], "Hvem hopper først hvis dere får sjansen igjen? Bestem nå."],
      ["Geir Helge Valle", ["Begge er HV-veteraner","Militær møter Lombola-hytte","Uredd og sporty"], "Bytt verste øvelse-historie — hvem hostet mest under tåregassen?"],
      ["Erik Josefsen", ["Begge er Indre-Troms-folk","Jakthund møter fjell-eventyr","Trives i skogen"], "Plan neste jakttur — rype eller elg?"],
    ] },

  // ---- Bord 7 ----
  { navn: "Andreas Willumsen", allianse: "Bakrommet-stammen",
    r: [
      ["Geir Olav Skogstad", ["Begge er livsnytere","Afterski møter stamp","Tar plassen kvelden trenger"], "Hvor er beste stamp i Nord-Norge akkurat nå? Bestem dere."],
      ["Magnus Seppola", ["Begge er festløver","Afterski møter mårratoget","Latter og ølpils"], "Velg kveldens nattmat — kebab eller solbærsuppe på Mack?"],
      ["Hårek Guneriussen", ["Begge løfter stemningen","After-ski møter TikTok-vitser","Festens midtpunkt"], "Plan en festkveld — hvem booker DJ, hvem booker baren?"],
    ] },
  { navn: "Jan Heier Johansen", allianse: "Fjellfolket",
    r: [
      ["Gro-Hilde Severinsen", ["Begge er AI-nerder","App-bygger møter e-helse","Bygger framtidas helsenorge"], "Planlegg en AI-prototype som hjelper Thomas å huske bursdager."],
      ["Øyvind Grinde", ["Begge er tech-hjerner","AI møter kryptolog","Matte og kode"], "Diskuter neste store sikkerhetshull AI vil utløse."],
      ["Kjell Roger Andersen", ["Begge er toppturkompiser","Alpene møter Lyngen","Sprek hele veien"], "Plan neste topptur — hvilken topp i Lyngen er prioritet?"],
    ] },
  { navn: "Kristina Kantola", allianse: "Fjellfolket",
    r: [
      ["Lotte Møller", ["Begge er tannleger med hund","Jekta møter klinikk","Turjenter med fire bein"], "Sammenlign verste tann-historie — pasient eller egen valp?"],
      ["Anne Marvik", ["Begge har turn i hverdagen","Turnmamma møter Aleris-leder","Tromsø-kvinner med fart"], "Diskuter hvilket apparat barna gruer seg mest for."],
      ["Marit Bratrud Nilsen", ["Begge er turn/klatre-mammaer","Tannlege møter fysio","Fart og familie"], "Bytt verste hentebommert fra trening eller skole."],
    ] },
  { navn: "Line Myreng", allianse: "De vise",
    r: [
      ["Ranveig Langseth", ["Begge er sykepleiere","Vakter på rotasjon","Holder helsenord oppe"], "Velg verste turnusuke noensinne — vinn med flest nattevakter."],
      ["Marit Bratrud Nilsen", ["Begge er helsefolk med småbarn","Sykepleier møter fysio","Familieliv i skift"], "Sammenlign verste «mamma kan ikke»-historie."],
      ["Christine Strøm", ["Begge er helsefolk på reise","Sykepleier møter lege","Trives i forskjellige miljøer"], "Bytt beste vakttips — hvordan holde humøret oppe på nattevakter."],
    ] },
  { navn: "Maria Christina Edwall", allianse: "De vise",
    r: [
      ["Nina Mikkelsen", ["Begge har grønne fingre","Gård møter blomstereng","Naturfolk på Tromsøya"], "Bytt tips: hva tåler å stå ute i Tromsø-mai?"],
      ["Lena Nymark", ["Begge er gjestfrie sjeler","Svensk grønn finger møter gjestfri vert","Holder døra åpen"], "Plan en hagefest sammen — hva planter dere før gjestene kommer?"],
      ["Marianne Svorken", ["Begge er natur- og fjellfolk","Grønne fingre møter klatremus","Trives ute"], "Bytt favoritt-tur i nærområdet — hvem leder neste søndag?"],
    ] },
  { navn: "Marius Furnes", allianse: "Bakrommet-stammen",
    r: [
      ["Magnus Seppola", ["Begge er festløver","Fireball møter ølkonge","Mårratoget kjenner dem"], "Hvem klarer flest fireballs uten å gå ned tre nummer i hatt?"],
      ["Jacob Wilhelmsen", ["Begge er sporty festkompiser","Ski og fotball","Ung Tromsø-puls"], "Velg neste skihelg — hvem booker hytta?"],
      ["Hårek Guneriussen", ["Begge er festens motor","Fireball møter TikTok","Latter på rekord"], "Plan en festkveld — hvem booker DJ, hvem booker baren?"],
    ] },
  { navn: "Rune Myreng", allianse: "De vise",
    r: [
      ["Morten Gammelgård", ["Begge er mat-eksperter","Kosthold møter etikette","Vet hva som skåles med hva"], "Lag drømme-tasting-meny — hvilken vin til hva?"],
      ["Ståle Søfting", ["Begge er voksen-fest-typer","Kosthold møter glemt middag","Liker en god flaske"], "Bytt verste matglemming-historie og beste comeback-rett."],
      ["Stig Tennås", ["Begge er rolige feinschmeckere","Mat møter vinyl","Tålmodig livsnytelse"], "Velg perfekt parring — hvilken plate til hvilken middag?"],
    ] },
  { navn: "Ørjan Berg Karlsen", allianse: "Bakrommet-stammen",
    r: [
      ["Jon Steinar Engenes", ["Begge har dyre vaner","Flyveleder møter Apollo-veteran","Reise og presisjon"], "Bytt beste reisetips — hvilken destinasjon må bookes nå?"],
      ["Ståle Søfting", ["Begge har dyre vaner og smak","Flyveleder møter Sales Director","Forretningsmann-energi"], "Velg neste fellestur — vinmarker eller golfbane?"],
      ["Geir Helge Valle", ["Begge er sporty og turglade","Flyveleder møter Lombola-hytte","Trives på fjellet"], "Plan en pilote- og hytte-helg — hvem ordner båt?"],
    ] },

  // ---- Bord 8 ----
  { navn: "Cathrine Marie Giæver", allianse: "Mikrofon-kapererne",
    r: [
      ["Gaute Marvik", ["Begge jobber i Helse Nord IKT","Komm møter teknikk","Kollegaer på tvers av bord"], "Bytt verste sak fra kantina — uten å nevne navn."],
      ["Nina Wilhelmsen", ["Begge er ledere med stil","Komm-sjef møter IBM-exec","Tar plassen i møterommet"], "Bytt beste tips for å lede møter uten kjedelige PowerPoints."],
      ["Lise Valle", ["Begge er organisatorer","Macks-bakgrunn møter sjenkebevilling","Holder byen i sving"], "Plan drømmemiddagen — hvem inviterer, hvem lager menyen?"],
    ] },
  { navn: "Einar Nilsen", allianse: "De vise",
    r: [
      ["Christine Strøm", ["Begge er leger med hjerte","Molde møter Tromsø","Allmenn møter psykiatri"], "Spør Christine om beste reise hun har planlagt — Einar tar notater."],
      ["Gina Bjørnstrøm", ["Begge er leger","Molde møter Brekka Sørreisa","Familiær lege-energi"], "Bytt rareste pasient-historie uten å nevne diagnose."],
      ["Lars Hadsel Hansen", ["Begge er leger med distrikt-hjerte","Molde møter Trondheim","Trives utenfor by-stresset"], "Sammenlign hvilket distrikt har mest rare hverdagshistorier."],
    ] },
  { navn: "Erin Hald",allianse: "De vise",
    r: [
      ["Lena Schøning", ["Begge er akademiske toppfolk","Blodforsker møter jurist","Tromsø-elite på UiT"], "Bytt favoritt-felttur — fra Finnmarksvidda til familietun."],
      ["Marianne Svorken", ["Begge har doktorgrad-energi","Blodforsker møter Nofima","Forsker dypt og bredt"], "Diskuter mest undervurderte forskningstema akkurat nå."],
      ["Nina Mikkelsen", ["Begge er forsker-kvinner","Blod møter hav","Akademisk hjerte"], "Bytt favoritt-felttur eller laboratorie-historie."],
    ] },
  { navn: "Lasse Pettersen", allianse: "Bakrommet-stammen",
    r: [
      ["Terje Nymark", ["Begge er Tromsø-kultur","Bukta møter Arktisk Film","Bygger byens scene"], "Hvem booker neste headliner? Foreslå én artist hver."],
      ["Gunnar Wilhelmsen", ["Begge bygger Tromsø","Bybuss møter ordfører","Byutvikling i praksis"], "Diskuter neste rutekart — hvor trengs en ny holdeplass først?"],
      ["Jon Marius Aareskjold", ["Begge er rocker-typer","Bukta-styret møter studio","Tromsø-scenen banker"], "Plan en konsertkveld — hvem booker, hvem mikser drinker?"],
    ] },
  { navn: "Marit Bratrud Nilsen", allianse: "Fjellfolket",
    r: [
      ["Anne Marvik", ["Begge er turn- og klatremammaer","Fysio møter Aleris","Sterke kvinner i hallen"], "Diskuter hvilket apparat foreldre bør slutte å filme."],
      ["Marte Lysnes Kristoffersen", ["Begge er fysioterapeuter","Helse og bevegelse","Sporty fra Senja og Molde"], "Bytt beste øvelse mot dårlig kontorholdning."],
      ["Kristina Kantola", ["Begge er turn- og hundemammaer","Fysio møter tannlege","Familiens støttepunkt"], "Bytt verste hentebommert fra trening eller skole."],
    ] },
  { navn: "Marit Osima", allianse: "De vise",
    r: [
      ["Silje Ingebrigtsen", ["Begge er Helse-Nord-folk","Snille kraftsentre","Ser det positive først"], "Bytt favoritt-helgepause — hva får dagen til å smile?"],
      ["Gina Bjørnstrøm", ["Begge er distrikts-leger","Mosjøen møter Brekka","Snille som sommerdag"], "Sammenlign rareste pasient-historie fra hjembygda."],
      ["Lars Hadsel Hansen", ["Begge er leger med distriktsglede","Mosjøen møter Trondheim","Trives utenfor by-stress"], "Bytt favoritt-vaktrutine — hvordan holde humøret oppe."],
    ] },
  { navn: "Stig Tennås", allianse: "De vise",
    r: [
      ["Snorre H Wilhelmsen", ["Begge har vinyl-passion","Strålende musikksmak","Tålmodige sjeler"], "Anbefal én plate som passer perfekt mens Stig lager apelyder."],
      ["Christine Strøm", ["Begge er psyk-mennesker","Tålmodighet på pro-nivå","Lytter til alt"], "Bytt verste «kan jeg spørre om en ting»-historie fra venner."],
      ["Heidi Lekang", ["Begge elsker musikk og bok","Vinyl møter Filharmoni","Rolige sjeler"], "Velg drømme-soundtrack for en lat søndag."],
    ] },
  { navn: "Øyvind Nordgård", allianse: "Fjellfolket",
    r: [
      ["Geir Olav Skogstad", ["Begge er hytte- og utfartsfolk","Scooter møter stamp","Finnmark og Bjørnfjell"], "Hvor går neste scootertur — Mosjøen eller Bjørnfjell-runden?"],
      ["Erlend Hagan", ["Begge har Kola-røtter i historien","Scooter møter russisk","Finnmark-energi"], "Bytt favoritt-Kola-historie — Powercatch teller."],
      ["Erik Josefsen", ["Begge er Indre-Troms-folk","Scooter møter jakthund","Skog og fjell"], "Plan neste jakttur — hvem stiller med hytte?"],
    ] },

  // ---- Bord 9 ----
  { navn: "Christine Strøm", allianse: "Mikrofon-kapererne",
    r: [
      ["Stig Tennås", ["Begge er psyk-mennesker","Tålmodighet på pro-nivå","Lytter til alt"], "Bytt verste «kan jeg spørre om en ting»-historie fra venner."],
      ["Einar Nilsen", ["Begge er leger med reise-genet","Allmenn møter psykiatri","Lytter mer enn de snakker"], "Spør Christine om beste reise hun har planlagt — Einar tar notater."],
      ["Erin Hald", ["Begge er leger med rikt liv","Psykiatri møter blodforsker","Internasjonal smak"], "Bytt favoritt-reisedestinasjon og verste hotell-historie."],
    ] },
  { navn: "Eirik Torbergsen", allianse: "Fjellfolket",
    r: [
      ["Lars Gaute Jørgensen", ["Begge er på startstreken","Løp møter yoga","Sprek hele veien"], "Velg neste løp — Midnattsola eller Tromsø Skyrace?"],
      ["Bjarte Kristoffersen", ["Begge er svøm- og løpshelter","Sport på toppnivå","Knærne holder enda"], "Bestem neste triatlon — Ersfjorden eller Tromsø sentrum?"],
      ["Trond Vidar Hansen", ["Begge er kompetative sportsfolk","Løp møter eliteserie","Vinnervilje"], "Krev revansje — løpetur eller fotballkamp?"],
    ] },
  { navn: "Ellen Eliassen", allianse: "De vise",
    r: [
      ["Hege Blikfeldt", ["Begge er lærere med klem","Elever som familie","Snadder i sekken"], "Bytt favoritt-skoletur — beste minne uten våte sokker."],
      ["Inger Johanne Sumstad", ["Begge er drømmelærere","Kjent som «frøken»","Hjerte for elevene"], "Sammenlign nyutdanna møter veteran — hva har endret seg mest?"],
      ["Ole-Morten Indigo Lekang", ["Begge er VGS-lærere","KUS møter VGS","Elsker faget og elevene"], "Bytt beste klasseromsanekdote uten å bryte taushetsplikten."],
    ] },
  { navn: "Erik Josefsen", allianse: "Fjellfolket",
    r: [
      ["Lotte Møller", ["Begge er hundefolk","Jakt møter Jekta","Indre Troms og by-Tromsø"], "Sammenlign rareste hundetriks — Erik har jakthunden, Lotte har valpen."],
      ["Anita Sivertsen", ["Begge er bank-folk","Danske Bank møter SNN","Nord-norske finansfolk"], "Sammenlign hvem som har best kundehistorie fra fredag ettermiddag."],
      ["Kjell Roger Andersen", ["Begge er fjell- og utfartsfolk","Jakt møter telttur","Trives best ute"], "Plan neste jakt- eller turhelg — hvem stiller med hytte?"],
    ] },
  { navn: "Geir Olav Skogstad", allianse: "Bakrommet-stammen",
    r: [
      ["Mats Sæverud", ["Begge er allsang-magnetene","Synger høyt på tur","Får hele bussen med"], "Velg én låt som alltid funker rundt bålet."],
      ["Morten Gammelgård", ["Begge er livsnytere","Stamp på hytta møter etikette","Trives med god mat"], "Plan drømme-helga — stamp, mat og musikk i hvilken rekkefølge?"],
      ["Andreas Willumsen", ["Begge er livsnytere","Stamp møter after-ski","Ser etter neste fest"], "Hvor er beste stamp i Nord-Norge akkurat nå? Bestem dere."],
    ] },
  { navn: "Magnus Seppola", allianse: "Bakrommet-stammen",
    r: [
      ["Hårek Guneriussen", ["Begge er fødte komikere","Får rommet til å brøle","Frekk humor"], "Battle: én tre-liners hver — best joke vinner runde med Mack."],
      ["Marius Furnes", ["Begge er festløver","Ølkonge møter Fireball","Mårratoget kjenner dem"], "Hvem klarer flest fireballs uten å miste hatten?"],
      ["Kathrine B Hansen", ["Begge har frekk humor","Latterkramper på rekord","Får hele bordet med"], "Bytt verste vits — best vits vinner ølpils."],
    ] },
  { navn: "Silje Ingebrigtsen", allianse: "De vise",
    r: [
      ["Cathrine Marie Giæver", ["Begge er vennlige kraftsentre","Ser folk skikkelig","Helse Nord-kollegaer"], "Bytt verste møte-skrekk uten å nevne avdelingen."],
      ["Lise Benjaminsen", ["Begge er sprudlende","Helse Nord møter Filharmoni","Energi som smitter"], "Plan en SATS-spinning-økt før neste fest."],
      ["Anne Marvik", ["Begge jobber med helse","Helse Nord møter Aleris","Bygger Tromsø-helsetilbud"], "Diskuter hvilken bydel som trenger mer helsetilbud først."],
    ] },
  { navn: "Siv-Cathrine Torbergsen", allianse: "Fjellfolket",
    r: [
      ["Lise Benjaminsen", ["Begge er SATS-rutinemennesker","Mårran-trening fast","Energi-bunter"], "Velg neste fellestrening — hvem holder ut lengst på spinning?"],
      ["Lars Gaute Jørgensen", ["Begge er løp- og treningsfolk","SATS møter yoga","Sprek i alle ender"], "Bytt favoritt-økt — bodypump eller fjelltur?"],
      ["Trond Vidar Hansen", ["Begge er kompetitive sportsfolk","Coca Cola-jenta møter eliteserien","Aldri sliten"], "Velg neste konkurranse — løp eller sykkel?"],
    ] },
  { navn: "Synne Guldbrandsen", allianse: "Havets folk",
    r: [
      ["Renate Larsen", ["Begge er sjømat-dronninger","Råfisklaget møter Ocean Food","Bygger Norges blå merke"], "Diskuter beste silde-rett som ikke krever bestikk."],
      ["Marte Lysnes Kristoffersen", ["Begge er NFH-jenter","Råfisklaget møter fiskeri","Senja-energi"], "Bytt favoritt-fiskeri-anekdote fra studietiden."],
      ["Anne Marit Bjørnflaten", ["Begge jobber med havets ressurser","Råfisklaget møter sjømat-politikk","Bygger Norges blå merke"], "Velg neste sjømat-eksportmarked — Sør-Korea eller Brasil?"],
    ] },
  { navn: "Terje Karlsen", allianse: "Fjellfolket",
    r: [
      ["Jakob B Hansen", ["Begge er tall- og fotballfolk","Strava møter EY","Vinnerinstinkt på Sentrum stadion"], "Spå neste TIL-sesong — taperen tar mårrabrødet."],
      ["Lars Gaute Jørgensen", ["Begge er på startstreken","Strava møter yoga","Sprek hele veien"], "Velg neste fjell-løp — taperen baker mårrabrød til hele bordet."],
      ["Anita Sivertsen", ["Begge er bankfolk","Tromsø-finans i hverdagen","Service med smil"], "Bytt verste systemkrasj-skrekk fra månedsslutt."],
    ] },

  // ---- Bord 10 ----
  { navn: "Erlend Hagan", allianse: "Mikrofon-kapererne",
    r: [
      ["Jørgen Wilhelmsen", ["Begge er NRK-stemmer","Språk-virtuoser","Dyrevenn møter Helgemorgen"], "Spill «gjett dialekten» — én setning hver, motparten gjetter fylke."],
      ["Hårek Guneriussen", ["Begge er fødte underholdere","NRK-revy møter TikTok","Får latteren til å renne"], "Lag en sketsj sammen — Narvik møter Kola-halvøya."],
      ["Arne Aarhus", ["Begge er reise-eventyrere","Russisk-redder møter Island","Historier i bøtter"], "Hvem har det villeste pass-stempelet? Bytt to historier hver."],
    ] },
  { navn: "Gro-Hilde Severinsen", allianse: "De vise",
    r: [
      ["Jan Heier Johansen", ["Begge bygger AI","E-helse møter app-utvikling","Framtidas Tromsø"], "Spitball en idé: en AI-assistent for hytte-pakkeliste."],
      ["Erin Hald", ["Begge er UiT-forskere","E-helse møter blodforsker","Akademisk hjerte"], "Diskuter mest undervurderte forskningstema akkurat nå."],
      ["Cathrine Marie Giæver", ["Begge er Helse Nord-folk","Forskning møter komm","Tromsø-helse i sving"], "Bytt favoritt-prosjekt som faktisk endret hverdagen."],
    ] },
  { navn: "Kjell Roger Andersen", allianse: "Fjellfolket",
    r: [
      ["Gaute Marvik", ["Begge er Løvens Hule-folk","Rødekors og HV","Tromsø-kollektiv-alumni"], "Bytt verste «hva skjedde egentlig den kvelden»-historie fra hula."],
      ["Geir Helge Valle", ["Begge er Løvens Hule-veteraner","Rødekors møter HV","Sporty og turglad"], "Spør Geir Helge om favoritt-tur fra Lombola-tiden."],
      ["Helge Hansen", ["Begge er friluftsfolk","Balsfjord møter Sørreisa","Sprek og turklar"], "Sammenlign favoritt-turmål i Balsfjorden eller Sørreisa."],
    ] },
  { navn: "Lars Hadsel Hansen", allianse: "Havets folk",
    r: [
      ["Terje Nymark", ["Begge er Melbu-gutter","Hav, film og barndomsminner","Vesterålen-stolthet"], "Bytt favoritt-Moviebox-film fra 90-tallet."],
      ["Einar Nilsen", ["Begge er leger","Trondheim møter Molde","Distrikt-leger med hjerte"], "Bytt rareste pasient-historie uten å nevne diagnose."],
      ["Marit Osima", ["Begge er leger","Trondheim møter Mosjøen","Trives utenfor storby"], "Sammenlign hvilket distrikt har mest rare hverdagshistorier."],
    ] },
  { navn: "Lena Schøning", allianse: "De vise",
    r: [
      ["Anneli Drecker", ["Begge har doktorgrad-energi","Jus møter sang","UiT-stjerner"], "Diskuter hva som er hardest: viddeseminar eller live-konsert?"],
      ["Lena Nymark", ["Begge heter Lena","Jurist møter tidsoptimist","Tromsø-energi"], "Bestem hvem som er kveldens beste Lena — myntkast?"],
      ["Erin Hald", ["Begge er UiT-akademikere","Jurist møter blodforsker","Forsker og fordyper"], "Bytt favoritt-felttur — fra Finnmarksvidda til familietun."],
    ] },
  { navn: "Marianne Bille", allianse: "De vise",
    r: [
      ["Lise Valle", ["Begge er organisatorer","Statnett møter sjenkebevilling","Holder tråden"], "Bytt verste logistikk-blooper fra siste store arrangement."],
      ["Nina Wilhelmsen", ["Begge er Oslo-ledere med Tromsø-røtter","Statnett møter IBM","Pendler-energi"], "Bytt favoritt-Tromsø-rutine når dere endelig er på besøk."],
      ["Ranveig Langseth", ["Begge holder gjengen samlet","Statnett møter sykepleier","Tålmodig logistikk"], "Diskuter hvordan dere overlever ektemennenes store ideer."],
    ] },
  { navn: "Marianne Svorken", allianse: "Fjellfolket",
    r: [
      ["Nina Mikkelsen", ["Begge er forskere som klatrer","Nofima møter Akvaplan","Fjellet er kontoret"], "Spør Marianne om beste Stakkevollan-historie fra oppvekst-rampen."],
      ["Jan Erik Olsen", ["Begge er Nofima-forskere","Marin biotek-elskere","Fordyper seg helt"], "Diskuter neste forskningsprosjekt — kan det involvere japansk seaweed?"],
      ["Erin Hald", ["Begge er doktorgrad-jenter","Nofima møter blodforsker","Forsker dypt"], "Diskuter mest undervurderte forskningstema akkurat nå."],
    ] },
  { navn: "Øyvind Grinde", allianse: "De vise",
    r: [
      ["Åge Hansen", ["Begge venter på kveiten","Hav og tålmodighet","Tromsø-drømmen ligger fast"], "Plan en kveite-helg sammen — hvem fanger først får skryt resten av året."],
      ["Jan Heier Johansen", ["Begge er smarte tech-hjerner","Kryptolog møter AI","Matte og kode"], "Diskuter neste store sikkerhetshull AI vil utløse."],
      ["Stig Tennås", ["Begge er rolige intellektuelle","Matte/filosofi møter psykiatri","Tålmodige lyttere"], "Bytt favoritt-bok som forandret tankesett."],
    ] },

  // ---- Bord 11 ----
  { navn: "Anne Marvik", allianse: "Mikrofon-kapererne",
    r: [
      ["Iris Wikmark", ["Begge er turn-talenter","RG møter apparat-turn","Gyllenborg-energi"], "Bytt favoritt-element — hvilket hadde dere aldri turt på matta i dag?"],
      ["Marit Bratrud Nilsen", ["Begge er turn- og klatremammaer","Aleris møter fysio","Sterke kvinner i hallen"], "Diskuter hvilket apparat foreldre bør slutte å filme."],
      ["Nina Wilhelmsen", ["Begge er topp-ledere","Aleris møter IBM","Tromsø-jenter som styrer"], "Sammenlign beste teknikk for å holde ro i krise-møter."],
    ] },
  { navn: "Gaute Marvik", allianse: "Fjellfolket",
    r: [
      ["Kjell Roger Andersen", ["Begge bodde i Løvens Hule","Rødekors og HV","Klassiske kollektiv-alumni"], "Spør Gaute hvor mye han egentlig gråt under sin egen bryllupstale."],
      ["Cathrine Marie Giæver", ["Begge jobber i Helse Nord IKT","Teknikk møter komm","Kollegaer på tvers av bord"], "Bytt verste sak fra kantina — uten å nevne navn."],
      ["Odd Gunnar Ingebrigtsen", ["Begge er HV-veteraner","Løvens Hule møter FN-soldat","Sporty og rolig"], "Plan en gjenforenings-tur — hvem booker hytta?"],
    ] },
  { navn: "Geir Helge Valle", allianse: "Fjellfolket",
    r: [
      ["Odd Gunnar Ingebrigtsen", ["Begge er HV/FN-veteraner","Tåregass og fallskjerm","Uredde turkamerater"], "Bytt verste øvelse-historie — hvem hostet mest under tåregassen?"],
      ["Kjell Roger Andersen", ["Begge er Løvens Hule-veteraner","HV møter Rødekors","Sporty og turklar"], "Spør Kjell Roger om favoritt-tur fra Balsfjorden."],
      ["Helge Hansen", ["Begge er sporty distriktsfolk","Lombola-hytte møter Sørreisa","Tør å gå ut i alt vær"], "Bytt favoritt-hyttebok eller beste fiskestang-tips."],
    ] },
  { navn: "Kenneth Mikkelsen", allianse: "Havets folk",
    r: [
      ["Ole Herman Strømmesen", ["Begge lever av sjøen","Fiskerijus møter havbruk","Næringens stødige ryggrad"], "Plan en seiltur i Middelhavet — Kenneth har båten, Ole Herman tar dam-besøk."],
      ["Ivar Wullf", ["Begge er sjømat-toppfolk","Fiskerijus møter Lerøy","Andøya og Middelhav"], "Diskuter beste sjømat-paring til Mack-pils."],
      ["Renate Larsen", ["Begge er styrerom-folk","Fiskerijus møter Ocean Food","Næringens stødige ryggrad"], "Spør Renate om neste store oppstarts-eventyr fra nord."],
    ] },
  { navn: "Lars Gaute Jørgensen", allianse: "Fjellfolket",
    r: [
      ["Eirik Torbergsen", ["Begge er løpsfolk","Yoga møter sprintløp","Startstreken er hjemme"], "Velg neste fjell-løp — taperen baker mårrabrød til hele bordet."],
      ["Terje Karlsen", ["Begge er Strava-folk","Yoga møter banker-løper","Sprek hele veien"], "Bytt favoritt-løype rundt Tromsøya."],
      ["Siv-Cathrine Torbergsen", ["Begge er trenings-rutinemennesker","Yoga møter SATS","Mårran-energi"], "Bytt favoritt-økt — bodypump eller fjelltur?"],
    ] },
  { navn: "Lise Valle", allianse: "Mikrofon-kapererne",
    r: [
      ["Lise Benjaminsen", ["Begge er sprudlende organisatorer","Lise møter Lise","Tromsø-energien banker"], "Hvem er kveldens beste Lise — la bordet bestemme!"],
      ["Marianne Bille", ["Begge er organisatorer","Sjenkebevilling møter Statnett","Holder tråden i alt"], "Bytt verste logistikk-blooper fra siste store arrangement."],
      ["Cathrine Marie Giæver", ["Begge er kvinnelige organisator-ledere","Sjenkebevilling møter komm-sjef","Holder byen i sving"], "Plan drømmemiddagen — hvem inviterer, hvem lager menyen?"],
    ] },
  { navn: "Nina Mikkelsen", allianse: "Havets folk",
    r: [
      ["Marianne Svorken", ["Begge er forsker-fjellfolk","Akvaplan møter Nofima","Gård og klatremus"], "Plan neste vidde-tur — hvem tar med kaffe og hvem tar med kake?"],
      ["Marte Lysnes Kristoffersen", ["Begge er NFH-fiskeri-folk","Havforsker møter fysio-fisker","Senja og gård"], "Diskuter hvor mye fysio en havforsker egentlig trenger."],
      ["Maria Christina Edwall", ["Begge har grønne fingre","Gård møter blomstereng","Naturfolk på Tromsøya"], "Bytt tips: hva tåler å stå ute i Tromsø-mai?"],
    ] },
  { navn: "Ole Herman Strømmesen", allianse: "Havets folk",
    r: [
      ["Kenneth Mikkelsen", ["Begge lever av sjøen","Oppdrett møter fiskerijus","Reise og næring"], "Bytt verste tollhistorie — Amerika-koffert vs. Middelhav-seilas."],
      ["Ivar Wullf", ["Begge er havbruks-toppfolk","OHS møter Lerøy","Lange karrierer på kaikanten"], "Bytt verste storm-historie fra anlegget."],
      ["Åge Hansen", ["Begge er sjø-veteraner","Havbruk møter Skibsverft","Saltvann i blodet"], "Plan en helg på sjøen — Åge tar båten, Ole Herman fisken."],
    ] },
  { navn: "Lotte Møller", allianse: "Fjellfolket",
    r: [
      ["Adele Kjær-Appelbom", ["Begge er hundeglade turjenter","Dyr og snill","Tromsø-puls"], "Bytt favoritt-tursti der hunden får løpe løs."],
      ["Kristina Kantola", ["Begge er tannleger med hund","Jekta møter klinikk","Turjenter med fire bein"], "Sammenlign verste tann-historie — pasient eller egen valp?"],
      ["Erik Josefsen", ["Begge er hundefolk","Jekta-valp møter jakthund","Tur og skog"], "Sammenlign rareste hundetriks — Erik har jakthunden, Lotte har valpen."],
    ] },
];

// ---- Validate ----
const errors = [];
const validAlliances = new Set(["Havets folk","Fjellfolket","Bakrommet-stammen","Mikrofon-kapererne","De vise"]);
const guestNames = new Set(guests.map(g => g.navn));

if (data.length !== guests.length) {
  errors.push(`Length mismatch: ${data.length} vs ${guests.length}`);
}

const totalUsage = {};
const rank1Usage = {};
const allianseCounts = {};

data.forEach((d, i) => {
  const guest = guests[i];
  if (d.navn !== guest.navn) errors.push(`[${i}] navn mismatch: ${d.navn} vs ${guest.navn}`);
  if (!validAlliances.has(d.allianse)) errors.push(`[${i}] invalid allianse: ${d.allianse}`);
  if (d.r.length !== 3) errors.push(`[${i}] not 3 matches: ${d.navn}`);

  const seen = new Set();
  d.r.forEach(([m, grunner, starter], idx) => {
    const rank = idx + 1;
    if (!guestNames.has(m)) errors.push(`[${i}] ${d.navn} r${rank}: "${m}" not in guest list`);
    if (m === "Thomas Hansen" && d.navn !== "Thomas Hansen") errors.push(`[${i}] ${d.navn} r${rank} matched to Thomas`);
    if (bordOf[m] === guest.bord) errors.push(`[${i}] ${d.navn} (bord ${guest.bord}) r${rank} same bord: ${m}`);
    if (m === d.navn) errors.push(`[${i}] ${d.navn} r${rank} self-match`);
    if (seen.has(m)) errors.push(`[${i}] ${d.navn} duplicate match: ${m}`);
    seen.add(m);
    if (!Array.isArray(grunner) || grunner.length !== 3) errors.push(`[${i}] ${d.navn} r${rank} not 3 grunner`);
    totalUsage[m] = (totalUsage[m] || 0) + 1;
    if (rank === 1) rank1Usage[m] = (rank1Usage[m] || 0) + 1;
  });

  allianseCounts[d.allianse] = (allianseCounts[d.allianse] || 0) + 1;
});

Object.entries(rank1Usage).forEach(([n, c]) => {
  if (c > 4) errors.push(`Rank-1 overuse: ${n} = ${c} (max 4)`);
});
Object.entries(totalUsage).forEach(([n, c]) => {
  if (c > 10) errors.push(`Total overuse: ${n} = ${c} (max 10)`);
});

const toasts = ["Marianne Wilhelmsen", "Ronny Andre Bendiksen"];
toasts.forEach(t => {
  const c = totalUsage[t] || 0;
  if (c > 3) console.warn(`WARN: Toastmaster ${t} used ${c} times total`);
});

if (errors.length) {
  console.error("ERRORS:");
  errors.slice(0, 50).forEach(e => console.error("  - " + e));
  console.error(`Total errors: ${errors.length}`);
  process.exit(1);
}

const output = data.map(d => ({
  navn: d.navn,
  allianse: d.allianse,
  matches: d.r.map(([m, grunner, starter], idx) => ({
    rank: idx + 1,
    match_navn: m,
    match_grunner: grunner,
    samtale_starter: starter,
  })),
}));

fs.writeFileSync(path.join(__dirname, 'matches.json'), JSON.stringify(output, null, 2), 'utf8');

console.log(`✅ Wrote ${output.length} guests × 3 matches to matches.json`);
console.log("\n🎭 Allianse-fordeling:");
Object.entries(allianseCounts).sort().forEach(([a, c]) => console.log(`  ${a}: ${c}`));

console.log("\n🏆 Topp 5 mest-brukte match_navn (over alle ranks):");
Object.entries(totalUsage).sort((a,b) => b[1]-a[1]).slice(0, 5).forEach(([n, c]) =>
  console.log(`  ${n}: ${c} (rank-1: ${rank1Usage[n] || 0})`)
);

console.log("\n🎤 Toastmaster total-bruk:");
toasts.forEach(t => console.log(`  ${t}: ${totalUsage[t] || 0}`));

console.log("\n📊 Rank-1 topp 5:");
Object.entries(rank1Usage).sort((a,b) => b[1]-a[1]).slice(0, 5).forEach(([n, c]) =>
  console.log(`  ${n}: ${c}`)
);
