/* ============================================================
   DATA for Warszawa-appen — Den siste villhingsten
   ============================================================ */

const TRIP = {
  title: "Den siste villhingsten",
  subtitle: "Terjes utdrikningslag • Warszawa",
  groom: "Terje",
  startISO: "2026-04-23T06:00:00+02:00",
  endISO: "2026-04-26T21:45:00+02:00"
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
    ref: "",
    date: "Søndag 26. april 2026",
    segments: [
      { flight: "DY1021", carrier: "Norwegian", from: "WAW", fromName: "Warszawa", to: "OSL", toName: "Oslo-Gardermoen", dep: "16:05", arr: "18:00", dur: "1t 55m" },
      { flight: "DY328",  carrier: "Norwegian", from: "OSL", fromName: "Oslo-Gardermoen", to: "TOS", toName: "Tromsø", dep: "19:50", arr: "21:45", dur: "1t 55m" }
    ],
    layovers: ["1t 50m Oslo-Gardermoen"],
    notes: "Norwegian LowFare — seter ikke reservert."
  }
};

const PEOPLE = [
  {
    id: "terje",
    name: "Terje Karlstad",
    role: "VILLHINGSTEN",
    isGroom: true,
    age: 46,
    job: "Head of Investor Relations — SpareBank 1 Nord-Norge",
    phone: "41122220",
    bio: "Hovedpersonen. Leder IR-funksjonen i SpareBank 1 Nord-Norge — han som snakker tall med investorer og analytikere hver kvartal. Ungdommelig, pen, velkledd, ordentlig. Familiemann gift med Silje (47) etter 20 år sammen — far til Lilly (10) og Iver (17). Fit, går på fjellet om sommeren, jakter rype på høsten. Hundeeier (Milo). Høy moral, god stemning — en knakende god fyr.",
    tags: ["Familiemann", "Fjellmann", "Rypejeger", "IR-sjef"]
  },
  {
    id: "vegard",
    name: "Vegard Lund Aspen",
    role: "ARRANGØREN",
    age: 45,
    job: "Avdelingssjef — Bravida AS, Tromsø (rør)",
    phone: "93218121",
    bio: "Arrangøren som har satt opp hele greia. Bestilte hotell og Level 27. Avdelingssjef hos Bravida Tromsø — under hans ledelse ble avdelingen nominert til Årets Lærebedrift 2023 for hvordan de følger opp lærlingene. Gift med Silje Helèn siden 2023. Utdannet fra Tromsdalen VGS + UiT.",
    tags: ["Sjefen", "Fikser alt", "Lærling-mentor"]
  },
  {
    id: "jan",
    name: "Jan Heier Johansen",
    role: "APP-ARKITEKTEN",
    age: 48,
    job: "TPM — Microsoft",
    phone: "41416828",
    bio: "Fyren som bygger denne appen. TPM i Microsoft. Blir 49 i august. Liker folkeliv, lokale favoritter og hidden gems over museer. Kjører ski med Thomas.",
    tags: ["App-hjernen", "Microsoft", "Ski"]
  },
  {
    id: "thomas",
    name: "Thomas Helge Hansen",
    role: "FOMO-MESTEREN",
    age: 49,
    job: "Sales Director North America — GC Rieber VivoMega (omega-3)",
    phone: "97775929",
    bio: "Yes-mannen som aldri går glipp av neste ting. 20+ års erfaring i omega-3-bransjen — kom nylig tilbake til GC Rieber VivoMega for å lede Nord-Amerika-salget. Tidligere daglig leder i Olivita AS (Tromsø). Trener, kjører ski med Jan. Sovner som regel på do i løpet av festen. Far til Snorre (20) og Birk (17), gift med Maja (46). Blir 50 i mai 2026 — egen fest allerede bookt.",
    tags: ["FOMO", "Omega-3", "Ski", "Sovnet-på-do-klubben"]
  },
  {
    id: "trond-bjornar",
    name: "Trond-Bjørnar Pedersen",
    role: "DEN ROLIGE VETERANEN",
    age: 50,
    job: "Leder Flykoordineringssentralen — Luftambulansetjenesten",
    phone: "91126286",
    bio: "Leder Luftambulansetjenestens flykoordineringssentral i Tromsø — det er han som sørger for at ambulanseflyene kommer fram. Bor på Kvaløya. Flott skikompis, rolig og avbalansert. Singel. Far til Alma (f. 17. sept 2005, 20 år) og Vetle (17). Nylig fylt 50.",
    tags: ["Luftambulanse", "Skikompis", "Zen-master"]
  },
  {
    id: "magnus",
    name: "Magnus Seppola",
    role: "NORDREISA-REPRESENTANTEN",
    age: 48,
    job: "Business Developer — Norinnova AS (TTO for UiT)",
    phone: "95112385",
    bio: "Hyggelig og fin mann fra Nord-Reisa. Business Developer hos Norinnova — hjelper UiT-forskere å kommersialisere innovasjonene sine. Fit. Gift med Ellen, har barn. Trener fredag morgen — alle er invitert.",
    tags: ["Nord-Reisa", "Innovasjon", "Trening"]
  },
  {
    id: "mikal",
    name: "Mikal Johnsen",
    role: "KLUBB-KOORDINATOREN",
    age: 44,
    job: "Utviklingssjef — SmartDok AS",
    phone: "98269088",
    bio: "Utviklingssjef i SmartDok (programvare for byggebransjen) — bygde blant annet dokumentsenteret deres. Bakgrunn fra Tromsø, basert i Alta, i bransjen siden 2011. Han som booket Level 27 og holder styr på nattelivet. Aktiv på event-siden.",
    tags: ["Utvikler", "Nattliv", "Level 27"]
  },
  {
    id: "ole-nicolai",
    name: "Ole Nicolai S. Aarbakke",
    role: "BEERMILE-GENERALEN",
    age: 45,
    job: "Daglig leder — Norwegian Seaweed Association",
    phone: "41296866",
    bio: "Marinbiolog fra Tromsø, født 1981. PhD fra UiT på hoppekreps (!). Siden mars 2024 daglig leder i Norwegian Seaweed Association — tang og tare-gjengens sjef. Bor i Steigen. Lørdagens ankermann: leder beermile-avdelingen kl 12:00 — craft beer-crawl gjennom sentrum.",
    tags: ["Marinbiolog", "Tang & tare", "Beermile", "Craft beer"]
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
    { time: "16:05", title: "✈️ WAW → OSL", desc: "DY1021 — Norwegian. 1t 55m.", status: "confirmed" },
    { time: "18:00", title: "🛬 Landet Gardermoen", desc: "1t 50m layover på Oslo-Gardermoen.", status: "confirmed" },
    { time: "19:50", title: "✈️ OSL → TOS", desc: "DY328 — Norwegian. 1t 55m.", status: "confirmed" },
    { time: "21:45", title: "🛬 Hjemme i Tromsø", desc: "Villhingsten er tammet. Eller?", status: "confirmed" }
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
  { id: "opera-club", name: "Opera Club", cat: "club", lat: 52.2409, lng: 21.0118, desc: "Elegant klubb under operaen. Plac Teatralny.", ig: "operaclub" },

  // Hidden gems — lokale favoritter, Praga-tunge
  { id: "pyzy-flaki", name: "Pyzy, Flaki Gorące!", cat: "hidden", lat: 52.2562, lng: 21.0346, desc: "Kult-vindu i Praga på Brzeska 29/31. Tradisjonelle dumplings + varm flaki-suppe rett ut av luka. Lokalene elsker det.", ig: "pyzyflakigorace" },
  { id: "peaches", name: "Peaches Gastro Girls", cat: "hidden", lat: 52.2596, lng: 21.0388, desc: "Kreativt vegansk/vegetarisk i Praga (Stalowa 36). Sesongbasert, leken meny, liten lokalfavoritt.", ig: "peachesgastrogirls" },
  { id: "w-oparach", name: "W Oparach Absurdu", cat: "hidden", lat: 52.2570, lng: 21.0385, desc: "Bar/kafé på Ząbkowska med vintage-interiør og live-musikk. Rå, arty stemning — tidligkvelds eller sent.", ig: "woparachabsurdu" },
  { id: "pardon", name: "Pardon, To Tu", cat: "hidden", lat: 52.2535, lng: 21.0402, desc: "Legendarisk Praga-jazzbar. Live-konserter — jazz, elektronika, world music. Hipster-hub.", ig: "pardontotu" },
  { id: "halas", name: "Hałas (vinyl + kaffe)", cat: "hidden", lat: 52.2235, lng: 21.0135, desc: "Specialty-kaffe og vinylplater i samme rom. Rolig, støvete og stilig.", ig: "halaskawa" },
  { id: "zabkowska", name: "Ząbkowska-gata", cat: "hidden", lat: 52.2570, lng: 21.0385, desc: "Praga-gata som går fra rå til hipster — kafeer, barer, gatekunst, gamle bygg. Spaser her om kvelden." },
  { id: "hala-mirowska", name: "Hala Mirowska", cat: "hidden", lat: 52.2370, lng: 20.9992, desc: "Historisk matmarked rett ved hotellet. Snacks, blomster, lokalt folkeliv. Ikke turistete.", ig: "halamirowska" },
  { id: "skaryszewski", name: "Skaryszewski Park", cat: "hidden", lat: 52.2418, lng: 21.0485, desc: "Underdog-parken i Praga. Grønn oase lokalene bruker for piknik og unwinding. Perfekt dagen derpå." }
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
   OM WARSZAWA — historikk, fakta, topp 5, events, hidden gems
   ============================================================ */

const WARSAW_INTRO = "Phoenix-byen. Ødelagt til 85% i WW2, gjenoppbygget murstein for murstein. UNESCO-gamleby, Chopin's by, havfrue på våpenskjoldet, og et nattliv som locals vet om men turistene sjelden finner.";

const FUN_FACTS = [
  { emoji: "🔥", title: "Phoenix-byen", text: "85% av Warszawa ble jevnet med jorden etter oppstanden i 1944. Gamlebyen ble gjenoppbygget stein for stein etter krigen — UNESCO kaller det et enestående eksempel på total rekonstruksjon." },
  { emoji: "🎹", title: "Chopin-benkene", text: "Rundt i byen finner du svarte benker. Trykk på knappen og du hører Chopin-komposisjoner + korte historier om hans tilknytning til byen. Gratis konsert i lomma." },
  { emoji: "🧜‍♀️", title: "Havfruen Syrenka", text: "Warszawas symbol. Legenden sier hun bestemte seg for å bli og beskytte byen etter at fiskere reddet henne. Hovedstatuen står på Gamlebyens torg." },
  { emoji: "🏛️", title: "Stalin-gaven", text: "Kulturpalasset (237 m) var en \"gave\" fra Stalin i 1955. Polakkene har blandede følelser om det — men utsikten fra 30. etasje er fantastisk." },
  { emoji: "🙏", title: "Willy Brandts kne", text: "I 1970 knelte Vest-Tysklands kansler foran Ghetto-minnesmerket her — en historisk forsoningsgest som endret Europa." },
  { emoji: "🌳", title: "25% grønt", text: "Nesten en fjerdedel av byen er parker og grøntområder. Łazienki, Saski, Skaryszewski — pusterom overalt." },
  { emoji: "🎷", title: "Jazz-hovedstad", text: "Warszawa har en av Europas mest levende jazzscener. Pardon To Tu i Praga er en legende." },
  { emoji: "🥟", title: "Pierogi-testen", text: "Ekte polakker dømmer deg på hvordan du sier og spiser pierogi (ikke \"pie-row-gi\" — det er \"pje-ro-gi\")." }
];

const TOP_SIGHTS = [
  { n: 1, emoji: "🏰", name: "Stare Miasto (Gamlebyen)", why: "UNESCO-verdensarv, fargerike fasader, Havfruestatuen på torget. Gjenoppbygd etter krigen med vanvittig detaljnivå.", placeId: "old-town" },
  { n: 2, emoji: "🌳", name: "Łazienki Park", why: "Elegant palass-park med påfugler, Chopin-monumentet og søndagskonserter. Perfekt for en lat ettermiddag.", placeId: null },
  { n: 3, emoji: "🏛️", name: "Kulturpalasset", why: "237 m høyt skyskraper-symbol. Ta heisen til 30. etasje — hele byen under deg.", placeId: null },
  { n: 4, emoji: "🎨", name: "Praga-distriktet", why: "Hipster-hjertet. Gatekunst, Neon Muzeum, Koneser vodka-fabrikk. Ikke i de fleste turistguidene, men lokalenes favoritt.", placeId: "koneser" },
  { n: 5, emoji: "🏰", name: "Wilanów-palasset", why: "\"Det polske Versailles\". Barokk, hager, kunstsamling. 30 min med buss fra sentrum.", placeId: null }
];

const TOP_ACTIVITIES = [
  { n: 1, emoji: "🚲", name: "Sykle langs Vistula", why: "Flat, vakker elvesti — fra Old Town ned til Praga-siden. Vi gjør dette lørdag." },
  { n: 2, emoji: "🥃", name: "Vodka-smaking på Koneser", why: "Gammel vodka-fabrikk med museum + tasting. Koneser = kjenner, og gjengen blir det." },
  { n: 3, emoji: "🍺", name: "Craft beer-crawl", why: "Warszawa er Polens craft-hovedstad. Kufle i Kapsle, Jabeerwocky, PiwPaw — vår beermile." },
  { n: 4, emoji: "🥟", name: "Pierogi-kurs eller milk bar-lunsj", why: "Lær å lage dumplings, eller bare spis en supperask ekte polsk lunsj for 30 zł på en bar mleczny." },
  { n: 5, emoji: "🎷", name: "Live jazz i Praga", why: "Pardon To Tu eller Miłośći. Det er her lokale hipstere går på kveldstid." }
];

const EVENTS_WEEKEND = [
  { day: "Tor 23.", items: [
    { time: "20:00", title: "Lovejoy (indie/rock)", venue: "Klub Proxima", note: "Britisk indie-band — ungt publikum" },
    { time: "20:00", title: "bôa (alt-rock)", venue: "Klub Progresja", note: "90-talls cult-band som har comeback" },
    { time: "20:00", title: "Wieczór Włoski", venue: "Teatr Buffo", note: "Italiensk musikk-aften — hvis gjengen vil ha noe litt kulturelt" }
  ]},
  { day: "Fre 24.", items: [
    { time: "19:00", title: "Falstaff (Verdi)", venue: "Teatr Wielki – Opera Narodowa", note: "Klassisk opera i praktfullt hus. Kultur-opsjon før Level 27" },
    { time: "20:00", title: "Only The Poets", venue: "Klub Niebo", note: "Britisk pop/indie" },
    { time: "All day", title: "Camper Caravan Show", venue: "Ptak Warsaw Expo", note: "For bobilnerden — ikke oss, kanskje" }
  ]},
  { day: "Lør 25.", items: [
    { time: "20:00", title: "GoGo Penguin (jazz/electronica) 🔥", venue: "Klub Progresja", note: "Britisk instrumentaltrio i verdensklasse. Dette passer gjengen!", pick: true },
    { time: "20:00", title: "Pezet (polsk hiphop)", venue: "COS Torwar", note: "Polens største hiphop-navn — stor arena-vibe" },
    { time: "10:00", title: "Breakfast Markets Żoliborz", venue: "Plac Słoneczny", note: "Frokost-marked lokalene elsker — kaffe, boller, lokalt" }
  ]},
  { day: "Søn 26.", items: [
    { time: "14:00", title: "Chopin-konsert", venue: "Łazienki Park (hvis fint vær)", note: "Sommerkonsertene starter — sjekk sesongstart" },
    { time: "Hele helga", title: "Mazurkas of the World-festival", venue: "Ulike scener", note: "Folk/tradisjonsmusikk-festival" }
  ]}
];

const SEARCH_URL = (q) => `https://www.google.com/search?q=${encodeURIComponent(q + ' Warszawa')}`;


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

