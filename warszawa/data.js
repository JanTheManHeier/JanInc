/* ============================================================
   DATA for Warszawa-appen — Den siste villhingsten
   ============================================================ */

const TRIP = {
  title: "Den siste villhingsten",
  subtitle: "Terjes utdrikningslag • Warszawa",
  groom: "Terje",
  startISO: "2026-04-23T06:00:00+02:00",
  endISO: "2026-04-26T21:30:00+02:00"
};

const HOTEL = {
  name: "Radisson Collection Hotel, Warsaw",
  address: "Grzybowska 24, 00-132 Warszawa",
  lat: 52.2370, lng: 20.9940,
  priceNOK: 3700,
  features: ["SPA-avdeling", "Basseng", "Badstu", "Frokost inkludert"],
  notes: "Booket av Vegard. Inkluderer frokost. Pris ca 3700 kr pp for hele oppholdet (inkl. Terjes andel).",
  url: "https://www.radissonhotels.com/en-us/hotels/radisson-collection-warsaw"
};

const FLIGHTS = {
  out: {
    ref: "XNLJ6Z",
    date: "Torsdag 23. april 2026",
    segments: [
      { flight: "SK4403", carrier: "Scandinavian Airlines", from: "TOS", fromName: "Tromsø", to: "OSL", toName: "Oslo", dep: "06:00", arr: "08:00", dur: "2t 00m" },
      { flight: "SK455",  carrier: "SAS Connect", from: "OSL", fromName: "Oslo", to: "CPH", toName: "København", dep: "09:00", arr: "10:10", dur: "1t 10m" },
      { flight: "SK2761", carrier: "SAS Connect", from: "CPH", fromName: "København", to: "WAW", toName: "Warszawa", dep: "13:05", arr: "14:25", dur: "1t 20m", terminal: "T3" }
    ],
    layovers: ["1t 00m Oslo", "2t 55m København T3"]
  },
  home: {
    date: "Søndag 26. april 2026",
    segments: [
      { flight: "Norwegian", carrier: "Norwegian", from: "WAW", fromName: "Warszawa", to: "TOS", toName: "Tromsø", dep: "16:05", arr: "21:30", dur: "ca 5t 25m (med mellomlanding)" }
    ],
    notes: "Norwegian, avgang Warszawa 16:05, fremme Tromsø 21:30."
  }
};

const PEOPLE = [
  {
    id: "terje",
    name: "Terje Karlstad",
    role: "VILLHINGSTEN",
    isGroom: true,
    age: 46,
    job: "Aksjer & valuta — Sparebanken Nord-Norge",
    bio: "Hovedpersonen. Ungdommelig, pen, velkledd, ordentlig. Familiemann gift med Silje (47) etter 20 år sammen — far til Lilly (10) og Iver (17). Fit, går på fjellet om sommeren, jakter rype på høsten. Hundeeier (Milo). Høy moral, god stemning — en knakende god fyr.",
    tags: ["Familiemann", "Fjellmann", "Rypejeger", "Finans"]
  },
  {
    id: "vegard",
    name: "Vegard Lund Aspen",
    role: "ARRANGØR",
    job: "Avdelingsleder Bravida rør, Tromsø",
    bio: "Arrangøren som har satt opp hele greia. Bestilte hotell og Level 27. Gift med Silje Helèn siden 2023. Utdannet fra Tromsdalen VGS + UiT.",
    tags: ["Sjefen", "Fikser alt"]
  },
  {
    id: "jan",
    name: "Jan Heier Johansen",
    role: "DEN NYE APPENS FAR",
    bio: "Fyren som bygger denne appen. Liker folkeliv, lokale favoritter og hider gems over museer.",
    tags: ["App-hjernen"]
  },
  {
    id: "thomas",
    name: "Thomas Helge Hansen",
    role: "FOMO-MESTEREN",
    age: 49,
    bio: "Yes-mannen som aldri går glipp av neste ting. Trener, kjører ski med Jan. Sovner som regel på do i løpet av festen. Far til Snorre (20) og Birk (17), gift med Maja (46). Blir 50 i mai 2026 — egen fest allerede bookt.",
    tags: ["FOMO", "Ski", "Sovnet-på-do-klubben"]
  },
  {
    id: "trond-bjornar",
    name: "Trond-Bjørnar Pedersen",
    role: "DEN ROLIGE VETERANEN",
    age: 50,
    bio: "Flott skikompis, rolig og avbalansert. Singel. Far til Alma (22) og Vetle (17). Nylig fylt 50.",
    tags: ["Skikompis", "Zen-master"]
  },
  {
    id: "magnus",
    name: "Magnus Seppola",
    role: "NORDREISA-REPRESENTANTEN",
    age: 48,
    bio: "Hyggelig og fin mann fra Nord-Reisa. Fit. Gift med Ellen, har barn. Trener fredag morgen — alle er invitert.",
    tags: ["Nord-Reisa", "Trening"]
  },
  {
    id: "mikal",
    name: "Mikal Johnsen",
    role: "KLUBB-KOORDINATOREN",
    bio: "Han som booket Level 27 og holder styr på nattelivet. Aktiv på event-siden.",
    tags: ["Nattliv", "Level 27"]
  },
  {
    id: "ole-nicolai",
    name: "Ole Nicolai S. Aarbakke",
    role: "BEERMILE-GENERALEN",
    bio: "Lørdagens ankermann. Leder beermile-avdelingen kl 12:00 lørdag — craft beer-crawl gjennom sentrum.",
    tags: ["Beermile", "Craft beer"]
  }
];

/* ============================================================
   PROGRAM — fra den opprinnelige planen + Jans anbefalinger
   Status: 'confirmed' | 'planned' | 'suggestion'
   ============================================================ */

const PROGRAM = [
  // TORSDAG 23. APRIL
  { day: "Torsdag 23. april", dayId: "torsdag", date: "2026-04-23", items: [
    { time: "04:00", title: "Henter Terje 🐎", desc: "Villhingsten må vekkes og dras med til flyplassen. Vegards ord: «Håper flest mulig er klar tre nat for å bli med på denne nydelige reisen sammen med denne nydelige villhingsten av en mann!»", status: "confirmed" },
    { time: "05:00", title: "Sjekker inn Tromsø lufthavn", desc: "Ladestasjon for elbiler, Flyplassvegen 31 — event-startpunkt.", status: "confirmed" },
    { time: "06:00", title: "✈️ TOS → OSL", desc: "SK4403 — Scandinavian Airlines. 2t flight.", status: "confirmed" },
    { time: "08:00", title: "🛬 Landet Oslo", desc: "1t layover på Gardermoen.", status: "confirmed" },
    { time: "09:00", title: "✈️ OSL → CPH", desc: "SK455 — SAS Connect. 1t 10m.", status: "confirmed" },
    { time: "10:10", title: "🛬 København T3", desc: "2t 55m layover — lang pause.", status: "confirmed" },
    { time: "11:00", title: "CPH chill / SPA / mat", desc: "Lang pause på Kastrup. Spisemuligheter + duty-free.", status: "planned" },
    { time: "13:05", title: "✈️ CPH → WAW", desc: "SK2761 — SAS Connect. 1t 20m.", status: "confirmed" },
    { time: "14:25", title: "🛬 Landet Warszawa", desc: "Bolt/Uber til hotell — billig, ca 40-60 zł.", status: "confirmed" },
    { time: "15:00", title: "🏨 Innsjekk hotell", desc: "Radisson Collection — Grzybowska 24. SPA-avdeling, basseng, badstu. Husk speedoen 😏", status: "confirmed", placeId: "hotel" },
    { time: "16:00", title: "🍸 Første drink", desc: "Forslag: Warszawa Powiśle — gammel togstasjon under broen, ikonisk bar. Eller start på Nowy Świat.", status: "suggestion", placeId: "warszawa-powisle" },
    { time: "19:00", title: "🍽️ Middag", desc: "Forslag: Poznańska-gata — matgate lokalene elsker. Velg når dere ser hva som frister.", status: "suggestion", placeId: "poznanska" },
    { time: "23:00", title: "🌃 Nattklubb?", desc: "Forslag: Smolna (lokalenes valg, rå stemning) eller Opera Club (elegant).", status: "suggestion", placeIds: ["smolna", "opera-club"] }
  ]},

  // FREDAG 24. APRIL
  { day: "Fredag 24. april", dayId: "fredag", date: "2026-04-24", items: [
    { time: "01:00", title: "💤 Tilbake på hotell", desc: "Noen har klart det. Andre ikke.", status: "planned" },
    { time: "09:00", title: "🏋️ Trening @ Magnus", desc: "Magnus leder morgentrening for de som orker. Frivillig.", status: "planned" },
    { time: "10:00", title: "🥞 Frokost", desc: "Inkludert på Radisson. Bra utvalg.", status: "confirmed" },
    { time: "11:00", title: "🧖 SPA + hotell-chill", desc: "Basseng, badstu, spa-avdeling. Restitusjon før helgen kicker.", status: "confirmed" },
    { time: "14:00", title: "🍴 Lunsj — Hala Koszyki", desc: "Restaurert markedshall fra 1908, nå food hall med 20+ barer/restauranter. Lokalt favoritt. Koszykowa 63.", status: "suggestion", placeId: "hala-koszyki" },
    { time: "16:00", title: "🚶 Plac Zbawiciela + Nowy Świat", desc: "Gå Plac Zba → Nowy Świat. Kaffe på Charlotte Menora. Stopp på E. Wedel Pijalnia Czekolady for varm sjokolade så tykk du må spise den med skje.", status: "suggestion", placeId: "plac-zba" },
    { time: "17:00", title: "🏨 Hotellhvile — Smart Casual", desc: "Bytt til finstas før middag.", status: "planned" },
    { time: "19:00", title: "🍷 Alewino", desc: "Vinbar — booket.", status: "confirmed", placeId: "alewino" },
    { time: "20:00", title: "🍽️ Middag", desc: "Booket (sted: sjekk med Vegard).", status: "confirmed" },
    { time: "23:00", title: "🌃 Level 27 — BOOKET", desc: "Bord booket av Mikal. 50% av bordkravet betalt, resten betales ved inngangen. Rooftop-klubb på Warsaw Hotel. DRESSCODE: smart casual.", status: "confirmed", placeId: "level27" }
  ]},

  // LØRDAG 25. APRIL
  { day: "Lørdag 25. april", dayId: "lordag", date: "2026-04-25", items: [
    { time: "09:00", title: "🥞 Frokost", desc: "Radisson.", status: "confirmed" },
    { time: "10:00", title: "🚴 Leie sykkel", desc: "Veloturystyka eller lignende. Sykkelrute langs Vistula-boulevarden (Wisłostrada) — flat, bilfri.", status: "planned" },
    { time: "10:30", title: "🚴 Sykkelrute: Gamlebyen → Praga", desc: "Start Gamlebyen → sørover langs elva → Kopernikus Science Centre (morsomme installasjoner utenfor) → kryss bro til Praga → kaffe på Centrum Praskie Koneser (gammelt vodka-destilleri, nå kreativt nav).", status: "suggestion", placeId: "old-town" },
    { time: "11:00", title: "🗺️ Guide (valgfritt)", desc: "Alternativ: Free Walking Tour Warsaw — Gamlebyen, 2,5t, tips-basert. Eller privat guide via GetYourGuide.", status: "planned" },
    { time: "12:00", title: "🍺 Beermile @ Ole", desc: "Ole leder! Rute (gangavstand, Nowogrodzka-området): Kufle i Kapsle → Jabeerwocky → Cuda na Kiju → PiwPaw Beer Heaven (100+ taps).", status: "confirmed", placeIds: ["kufle", "jabeerwocky", "cuda", "piwpaw"] },
    { time: "14:00", title: "🍴 Lunsj", desc: "Forslag: Hala Gwardii (mindre turistete søsterhall ved Gamlebyen) eller Elektrownia Powiśle (gammelt kraftverk, food hall).", status: "suggestion", placeIds: ["hala-gwardii", "elektrownia"] },
    { time: "16:00", title: "🛍️ Valgfri tid", desc: "Nowy Świat shopping, Old Town wandering, eller Praga murals. Hidden gem: Neon Muzeum (Praga) — kommunisttidens neonskilt, 15 zł, 45 min.", status: "suggestion", placeId: "neon" },
    { time: "17:00", title: "🏨 Hotellhvile — Smart Casual", desc: "Lading før siste kveld.", status: "planned" },
    { time: "20:00", title: "🍽️ Middag — siste kveld", desc: "Forslag: Zoni (gammel vodka-fabrikk, moderne polsk, Koneser/Praga) · Bibenda (uformell, kreativ, fullt av lokale) · Kieliszki na Próżnej (vinbar + polsk mat, stemning).", status: "suggestion", placeIds: ["zoni", "bibenda", "kieliszki"] }
  ]},

  // SØNDAG 26. APRIL
  { day: "Søndag 26. april", dayId: "sondag", date: "2026-04-26", items: [
    { time: "11:00", title: "🥞 Frokost + avskjed", desc: "Forslag: Charlotte (Plac Zba) — lokalinstitusjon, croissanter + egg. Perfekt siste stopp.", status: "suggestion", placeId: "charlotte" },
    { time: "13:00", title: "🚕 Avreise til flyplass", desc: "Bolt til Chopin Airport (WAW).", status: "planned" },
    { time: "14:00", title: "✈️ Innsjekk WAW", desc: "Norwegian.", status: "planned" },
    { time: "16:05", title: "✈️ Hjemreise", desc: "Norwegian WAW → TOS.", status: "confirmed" },
    { time: "21:30", title: "🛬 Hjemme i Tromsø", desc: "Villhingsten er tammet. Eller?", status: "confirmed" }
  ]}
];

/* ============================================================
   STEDER PÅ KART (lat/lng for Leaflet)
   ============================================================ */

const PLACES = [
  { id: "hotel", name: "Radisson Collection Hotel", cat: "hotel", lat: 52.2370, lng: 20.9940, desc: "Vårt hotell. Grzybowska 24.", ig: "radissoncollectionwarsaw" },

  // Bars / drikke
  { id: "level27", name: "Level 27", cat: "club", lat: 52.2329, lng: 21.0005, desc: "Rooftop-klubb, Warsaw Hotel. Booket fredag 23:00.", ig: "level27warsaw" },
  { id: "warszawa-powisle", name: "Warszawa Powiśle", cat: "bar", lat: 52.2370, lng: 21.0268, desc: "Gammel togstasjon under broen, ikonisk lokal bar.", ig: "warszawapowisle" },
  { id: "charlotte", name: "Charlotte Menora (Plac Zba)", cat: "cafe", lat: 52.2204, lng: 21.0160, desc: "Kafé/bar/bakeri, lokalinstitusjon.", ig: "bistrocharlotte" },
  { id: "kufle", name: "Kufle i Kapsle", cat: "bar", lat: 52.2273, lng: 21.0080, desc: "Craft beer-mekka. Beermile-start.", ig: "kufleikapsle" },
  { id: "jabeerwocky", name: "Jabeerwocky", cat: "bar", lat: 52.2269, lng: 21.0082, desc: "20+ taps, rett ved Kufle. Beermile #2.", ig: "jabeerwocky" },
  { id: "cuda", name: "Cuda na Kiju", cat: "bar", lat: 52.2388, lng: 21.0153, desc: "Craft + urban stemning.", ig: "cudanakiju" },
  { id: "piwpaw", name: "PiwPaw Beer Heaven", cat: "bar", lat: 52.2305, lng: 21.0167, desc: "100+ taps. Beermile-finale.", ig: "piwpaw" },

  // Mat
  { id: "hala-koszyki", name: "Hala Koszyki", cat: "food", lat: 52.2197, lng: 21.0161, desc: "Food hall, 20+ steder, 1908-markedshall. Fredags-lunsj.", ig: "halakoszyki" },
  { id: "hala-gwardii", name: "Hala Gwardii", cat: "food", lat: 52.2451, lng: 21.0055, desc: "Mindre turistete søsterhall.", ig: "halagwardii" },
  { id: "elektrownia", name: "Elektrownia Powiśle", cat: "food", lat: 52.2405, lng: 21.0277, desc: "Gammelt kraftverk, food hall + shopping.", ig: "elektrowniapowisle" },
  { id: "zoni", name: "Zoni (Koneser)", cat: "food", lat: 52.2562, lng: 21.0480, desc: "Moderne polsk i gammel vodka-fabrikk.", ig: "zoni_restaurant" },
  { id: "bibenda", name: "Bibenda", cat: "food", lat: 52.2269, lng: 21.0082, desc: "Uformell, kreativ polsk mat.", ig: "bibendawarszawa" },
  { id: "kieliszki", name: "Kieliszki na Próżnej", cat: "food", lat: 52.2359, lng: 21.0074, desc: "Vinbar + polsk mat, liten gate.", ig: "kieliszkinaproznej" },
  { id: "wedel", name: "E. Wedel Pijalnia Czekolady", cat: "cafe", lat: 52.2350, lng: 21.0160, desc: "Varm sjokolade så tykk du må spise den med skje.", ig: "ewedelofficial" },

  // Severdigheter / micro-stops
  { id: "old-town", name: "Stare Miasto (Gamlebyen)", cat: "sight", lat: 52.2500, lng: 21.0123, desc: "UNESCO. Gjenoppbygget murstein for murstein." },
  { id: "st-anne", name: "St. Anne's Church-tårnet", cat: "sight", lat: 52.2494, lng: 21.0138, desc: "147 trinn opp — beste utsikt, ~10 zł." },
  { id: "plac-zba", name: "Plac Zbawiciela", cat: "sight", lat: 52.2204, lng: 21.0160, desc: "Hipster-plassen. Kaféer, folkeliv." },
  { id: "koneser", name: "Centrum Praskie Koneser", cat: "sight", lat: 52.2562, lng: 21.0480, desc: "Gammel vodka-fabrikk i Praga, nå kreativt nav.", ig: "koneserpraga" },
  { id: "neon", name: "Neon Muzeum (Praga)", cat: "sight", lat: 52.2572, lng: 21.0495, desc: "Kommunisttidens neonskilt. 15 zł, 45 min.", ig: "neonmuzeum" },
  { id: "nowy-swiat", name: "Nowy Świat", cat: "sight", lat: 52.2373, lng: 21.0175, desc: "Hovedstrøket — spaser her." },
  { id: "poznanska", name: "Poznańska-gata", cat: "sight", lat: 52.2247, lng: 21.0133, desc: "Matgate-strekk lokale elsker." },
  { id: "alewino", name: "Alewino (booket)", cat: "food", lat: 52.2311, lng: 21.0252, desc: "Vinbar — fredag 19:00, booket.", ig: "alewino" },

  // Nattklubber — fredag/torsdag-alternativer
  { id: "smolna", name: "Smolna", cat: "club", lat: 52.2335, lng: 21.0243, desc: "Rå stemning, lokalenes valg. Smolna 38.", ig: "smolna38" },
  { id: "opera-club", name: "Opera Club", cat: "club", lat: 52.2409, lng: 21.0118, desc: "Elegant klubb under operaen. Plac Teatralny.", ig: "operaclub" }
];

/* ============================================================
   UTFORDRINGER TIL TERJE — 70% snille, 30% litt crude (markert)
   ============================================================ */

const CHALLENGES = [
  // SNILLE (14 stk)
  { id: "c1", type: "mild", text: "Lær å si «Gratulerer med bryllupet» på polsk og si det høyt på restaurant." },
  { id: "c2", type: "mild", text: "Ta bilde foran Havfruen (Syrenka) i Old Town Square." },
  { id: "c3", type: "mild", text: "Bestill en rett du ikke kan uttale — og spis alt." },
  { id: "c4", type: "mild", text: "Hold en 30-sek takketale til Silje på karaoke-bar." },
  { id: "c5", type: "mild", text: "Drikk minst 3 forskjellige polske craft-øl på beermile." },
  { id: "c6", type: "mild", text: "Lær én polsk vits og fortell den til gjengen." },
  { id: "c7", type: "mild", text: "Ta en shot vodka fra Vodka Museum i Koneser." },
  { id: "c8", type: "mild", text: "Bestem en helt ny ting for bryllupsreisen — book den der og da." },
  { id: "c9", type: "mild", text: "Klatre 147 trinn til toppen av St. Anne's-tårnet før lunsj lørdag." },
  { id: "c10", type: "mild", text: "Si «Na zdrowie!» riktig (skål på polsk) og forklar den etymologi." },
  { id: "c11", type: "mild", text: "Kjøp en souvenir til Silje, Lilly OG Iver — kan ikke være samme ting." },
  { id: "c12", type: "mild", text: "Spør en lokal om beste skjulte bar og bli der i minst én drink." },
  { id: "c13", type: "mild", text: "Sykle i Łazienki Park og ta selfie med en påfugl." },
  { id: "c14", type: "mild", text: "Ring Silje fra Level 27-rooftoppen og vis utsikten." },

  // LITT CRUDE (6 stk — markert)
  { id: "c15", type: "crude", text: "Få en fremmed til å synge Despacito sammen med deg på karaoke." },
  { id: "c16", type: "crude", text: "Gå i speedo i hotellets basseng — minst 10 minutter. (Vegards ordre: husk speedoen.)" },
  { id: "c17", type: "crude", text: "Få en bartender til å finne opp en cocktail oppkalt etter deg («The Villhingst»)." },
  { id: "c18", type: "crude", text: "Danse minst én hel sang på Level 27 uten å kjenne koreografien." },
  { id: "c19", type: "crude", text: "Bær en t-skjorte med «LAST NIGHT OF FREEDOM» hele fredag kveld." },
  { id: "c20", type: "crude", text: "Løp én runde rundt hotellkvartalet kun i hotellkåpen (innenfor loven, takk)." }
];

/* ============================================================
   POLSK PARLØR
   ============================================================ */

const PHRASES = [
  { pl: "Cześć", no: "Hei", pron: "Tsjesjtsj" },
  { pl: "Dzień dobry", no: "God dag", pron: "Dzjenj dobry" },
  { pl: "Dobry wieczór", no: "God kveld", pron: "Dobry vjetsjur" },
  { pl: "Dziękuję", no: "Takk", pron: "Dzjenkuje" },
  { pl: "Proszę", no: "Vær så snill / vær så god", pron: "Prosje" },
  { pl: "Przepraszam", no: "Unnskyld", pron: "Psjepraasjam" },
  { pl: "Tak", no: "Ja", pron: "Tak" },
  { pl: "Nie", no: "Nei", pron: "Nje" },
  { pl: "Na zdrowie!", no: "Skål!", pron: "Na zdrovje" },
  { pl: "Dwa piwa proszę", no: "To øl, takk", pron: "Dva piva prosje" },
  { pl: "Jeszcze jedno", no: "Én til", pron: "Jesjtsje jedno" },
  { pl: "Rachunek proszę", no: "Regningen, takk", pron: "Rahunek prosje" },
  { pl: "Gdzie jest toaleta?", no: "Hvor er toalettet?", pron: "Gdzje jest toaleta" },
  { pl: "Ile to kosztuje?", no: "Hva koster det?", pron: "Ile to kosjtuje" },
  { pl: "Smacznego", no: "Vel bekomme", pron: "Smatsjnego" },
  { pl: "Gratulacje!", no: "Gratulerer!", pron: "Gratulatsje" },
  { pl: "Wesele", no: "Bryllup", pron: "Vesele" },
  { pl: "Wieczór kawalerski", no: "Utdrikningslag", pron: "Vjetsjur kavalerski" },
  { pl: "Ostatnia wolność", no: "Siste frihet (siste villhingst 🐎)", pron: "Ostatnja volnosjtsj" },
  { pl: "Nie rozumiem", no: "Jeg forstår ikke", pron: "Nje rozumjem" }
];

/* ============================================================
   NØDINFO
   ============================================================ */

const EMERGENCY = [
  { label: "Europeisk nødnummer", value: "112", type: "phone" },
  { label: "Politi (Polen)", value: "997", type: "phone" },
  { label: "Ambulanse (Polen)", value: "999", type: "phone" },
  { label: "Brannvesen (Polen)", value: "998", type: "phone" },
  { label: "Norske ambassade Warszawa", value: "+48 22 696 40 30", type: "phone" },
  { label: "Ambassadens adresse", value: "ul. Chopina 2A, 00-559 Warszawa", type: "addr" },
  { label: "Hotell", value: "Radisson Collection, Grzybowska 24", type: "addr" },
  { label: "SAS kundeservice", value: "+47 21 49 63 00", type: "phone" },
  { label: "Norwegian kundeservice", value: "+47 21 49 00 15", type: "phone" },
  { label: "Blokker norsk bankkort (DNB/Sparebanken)", value: "+47 915 04800", type: "phone" },
  { label: "Chopin Airport (WAW) info", value: "+48 22 650 42 20", type: "phone" }
];

/* ============================================================
   PAKKELISTE — menn som pusher 50, pakk lett men ta med alt
   ============================================================ */

const PACKING = [
  { cat: "🎯 Essensielt — glem dette og du er screwed", items: [
    "Pass (gyldig min 3 mnd)",
    "Bankkort + backup-kort",
    "Kontanter (noen €, veksles til PLN i Warszawa)",
    "Telefon + lader",
    "Reiseforsikring-kort / app",
    "Europeisk helsetrygdekort",
    "Boardingkort (last ned offline)",
    "Hotell-adresse på polsk (bruk Hjelp-knappen)"
  ]},
  { cat: "👔 Smart Casual — dresscode Level 27 + Alewino", items: [
    "1 chinos eller mørk jeans (ikke slitt)",
    "1 skjorte (strøket)",
    "1 blazer/dressjakke (valgfritt, men hever)",
    "Pene sko (ikke sneakers — Level 27 avviser)",
    "Belte som matcher skoene"
  ]},
  { cat: "👕 Klær — 3 netter, pakk lett", items: [
    "3 t-skjorter (+ 1 ekstra for sikkerhet)",
    "2 skjorter dag/kveld",
    "1 genser / hettegenser",
    "1 lett jakke (~12°C + regn mulig)",
    "1 jeans dag + 1 pen bukse",
    "4 par undertøy (+ 1 ekstra)",
    "4 par sokker (+ 1 ekstra)",
    "Komfortable sko til mye gåing",
    "Speedo / badebukse (Radisson har basseng + spa)",
    "Treningstøy (Magnus' morgentrening fredag)"
  ]},
  { cat: "🧴 Toalett — travel-size", items: [
    "Tannbørste + tannkrem",
    "Deodorant",
    "Barbering (eller: la skjegget herje)",
    "Shampoo/sjampo (hotellet har, men…)",
    "Hårvoks/gel hvis du bruker",
    "Neglesaks",
    "Paracet / ibuprofen",
    "Plaster",
    "Myggmiddel (hvis varmt)",
    "Kondomer (bare i tilfelle… for VENNENE, ikke Terje)",
    "Resolve / dagen-derpå-redning"
  ]},
  { cat: "🔌 Elektronikk", items: [
    "Type C/E adapter (Polen = EU-plugg, samme som Norge — men sjekk)",
    "Powerbank (10 000 mAh+)",
    "Ladekabler (USB-C, Lightning om du må)",
    "Hodetelefoner / AirPods",
    "Kamera (valgfritt — telefon er nok)"
  ]},
  { cat: "💊 Utdrikningslag-spesifikt", items: [
    "Godt humør",
    "Toleranse for Terjes reaksjoner",
    "Noe smått å gi Terje når han fullfører utfordringer (sjokolade, shot, osv)",
    "Evt. kostyme-element (speedo over klærne på Level 27? Vegard avgjør)",
    "Kontanter til drikkepenger (15% restaurant, avrunding bar)"
  ]},
  { cat: "🧠 Smart å ha — lett glemt", items: [
    "Solbriller",
    "Lip balm",
    "Ørepropper (for de som snorker… eller naboen)",
    "Sovemaske",
    "Liten sekk / veske til dagsbruk",
    "Vaskepose til brukt undertøy",
    "Tyggegummi",
    "Kulepenn (grense-skjema, kvitteringer)"
  ]}
];

