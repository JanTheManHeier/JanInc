// Thomas50 — data: program, gjester, sang, spill
// Hentet fra Facebook-event "Endelig voksen (kanskje)" 30. mai 2026

const EVENT_DATO_ISO = "2026-05-30T18:00:00+02:00";

const PROGRAM = [
  {
    id: "pust",
    tid: "14:30 – 15:30",
    sted: "Pust — Flytende Badstue",
    ikon: "🧖",
    beskrivelse: "Privat badstue på Pust. Plass til ca 30 stk — første mann/dame til mølla. (Påmelding stengt)",
    adresse: "Søndre Tollbodgate, Vervet, Tromsø",
    kart: "https://maps.google.com/?q=Pust+badstue+Tromsø",
    farge: "#E8A87C",
    lat: 69.6509374,
    lng: 18.9623166,
  },
  {
    id: "kystens",
    tid: "18:00",
    sted: "Kystens Hus — Festen begynner!",
    ikon: "🥂",
    beskrivelse: "Velkomst med prosecco, deretter middag med blinis, bacalao-buffet og kakebord. Baren er åpen hele kvelden.",
    adresse: "Havnegata 1A, 9008 Tromsø",
    kart: "https://maps.google.com/?q=Kystens+Hus+Tromsø",
    farge: "#7EB8D4",
    lat: 69.6516695,
    lng: 18.9604905,
  },
  {
    id: "bakrommet",
    tid: "22:00 – 02:30",
    sted: "Bakrommet på Amtmandens",
    ikon: "🎶",
    beskrivelse: "Vi går i samla tropp til Bakrommet. Aggie Frost spiller, og vi har hele lokalet til stengetid ca 02:30.",
    adresse: "Cora Sandels gate, Tromsø",
    kart: "https://maps.google.com/?q=Amtmandens+Tromsø",
    farge: "#C8A0D8",
    lat: 69.6506935,
    lng: 18.9557289,
  },
];

// Gjester hentet fra FB-event-kommentarer + Messenger-spleisegruppe
// Kort biografi er placeholder — kan oppdateres manuelt eller via LinkedIn-søk
const GJESTER = [
  {
    navn: "Adele Kjær",
    bord: 1,
    sete: 5,
    bordType: 8,
    relasjon: "Kjæreste til yngste sønn",
    fbUrl: "https://www.facebook.com/share/1CjWbh1Fyq/",
    igUrl: "https://www.instagram.com/adelekjar/",
    bildeFil: "images/gjester/adele-kjar.jpg"
  },
  {
    navn: "Birk H Wilhelmsen",
    bord: 1,
    sete: 4,
    bordType: 8,
    relasjon: "Yngste sønn",
    fbUrl: "https://www.facebook.com/birk.wilhelmsen",
    bildeFil: "images/gjester/birk-h-wilhelmsen.jpg"
  },
  {
    navn: "Inger Johanne Sumstad",
    bord: 1,
    sete: 8,
    bordType: 8,
    relasjon: "Mor",
    fbUrl: "https://www.facebook.com/inger.johanne.sumstad",
    bildeFil: "images/gjester/inger-johanne-sumstad.jpg"
  },
  {
    navn: "Maja Wilhelmsen",
    bord: 1,
    sete: 2,
    bordType: 8,
    pust: true,
    bio: "Pust 💦",
    fbBio: "Universitetssykehuset Nord-Norge HF · 📚 Kongsbakken Videregående Skole · 📍 Tromsø, Norway · 💕 Gift med Thomas Helge Hansen",
    fbUrl: "https://www.facebook.com/majawilhelmsen",
    relasjon: "Kone",
    bildeFil: "images/gjester/maja-wilhelmsen.jpg"
  },
  {
    navn: "Marianne Wilhelmsen",
    bord: 1,
    sete: 6,
    bordType: 8,
    rolle: "TOASTMASTER",
    bio: "🎤 Toastmaster sammen med Ronny André. Send mail til ronnyandre@gmail.com hvis du vil holde tale!",
    fbBio: "📚 Høgskolen i Buskerud, Hønefoss · 📍 Oslo, Norge",
    fbUrl: "https://www.facebook.com/supermarianne",
    liBio: "Assisterende partisekretær i Arbeiderpartiet · 📍 Oslo, Oslo, Norway",
    liUrl: "https://www.linkedin.com/in/marianne-wilhelmsen-/",
    bildeFil: "images/gjester/marianne-wilhelmsen.jpg",
    extraBio: "🌟 Statssekretær i regjeringen — utnevnt i statsråd",
    relasjon: "Søster til hans kone"
  },
  {
    navn: "Ronny Andre Bendiksen",
    bord: 1,
    sete: 7,
    bordType: 8,
    rolle: "TOASTMASTER",
    bio: "🎤 Toastmaster sammen med Marianne. Kontakt: ronnyandre@gmail.com",
    fbUrl: "https://www.facebook.com/ronnyandre",
    relasjon: "Mannen til søster til hans kone",
    bildeFil: "images/gjester/ronny-andre-bendiksen.jpg"
  },
  {
    navn: "Snorre H Wilhelmsen",
    bord: 1,
    sete: 3,
    bordType: 8,
    relasjon: "Eldste sønn",
    fbUrl: "https://www.facebook.com/snorre.wilhelmsen",
    bildeFil: "images/gjester/snorre-h-wilhelmsen.jpg",
    fbBio: "📍 Tromsø, Norway"
  },
  {
    navn: "Thomas Hansen",
    bord: 1,
    sete: 1,
    jubilant: true,
    bordType: 8,
    pust: true,
    fbUrl: "https://www.facebook.com/2mashh",
    bildeFil: "images/gjester/thomas-hansen.jpg",
    fbBio: "📍 Tromsø, Norway · 💕 Gift med Maja Wilhelmsen"
  },
  {
    navn: "Anita Sivertsen",
    bord: 2,
    sete: 8,
    bordType: 8,
    fbUrl: "https://www.facebook.com/anita.sivertsen.14",
    relasjon: "Samboer til Åge hansen",
    bildeFil: "images/gjester/anita-sivertsen.jpg",
    fbBio: "📍 Tromsø, Norway"
  },
  {
    navn: "Helge Hansen",
    bord: 2,
    sete: 1,
    bordType: 8,
    relasjon: "Far",
    fbUrl: "https://www.facebook.com/helge.hansen.140",
    bildeFil: "images/gjester/helge-hansen.jpg",
    fbBio: "📚 NKI Ingeniørhøgskole · 📍 Skøelv, Troms, Norway"
  },
  {
    navn: "Iris Wikmark",
    bord: 2,
    sete: 4,
    bordType: 8,
    relasjon: "Konen til Trond Vidar Hansen",
    fbUrl: "https://www.facebook.com/share/18rq2pcN4u/",
    bildeFil: "images/gjester/iris-wikmark.jpg"
  },
  {
    navn: "Jakob B Hansen",
    bord: 2,
    sete: 5,
    bordType: 8,
    relasjon: "Bror",
    fbUrl: "https://www.facebook.com/jakob.hansen.17",
    fbBio: "📚 UiT Norges arktiske universitet · 📍 Tromsø, Norway",
    bildeFil: "images/gjester/jakob-b-hansen.jpg"
  },
  {
    navn: "Kathrine B Hansen",
    bord: 2,
    sete: 2,
    bordType: 8,
    relasjon: "Søster",
    fbUrl: "https://www.facebook.com/kathrine.hansen.71",
    bildeFil: "images/gjester/kathrine-b-hansen.jpg",
    fbBio: "BioMar AS, Myre · 📚 Finnfjordbotn Vidaregåande Skole · 📍 Myre, Nordland, Norway"
  },
  {
    navn: "Marte Lysnes Kristoffersen",
    bord: 2,
    sete: 6,
    bordType: 8,
    relasjon: "Samboer til Jakob B Hansen",
    fbUrl: "https://www.facebook.com/marte.lysnes",
    bildeFil: "images/gjester/marte-lysnes-kristoffersen.jpg",
    fbBio: "📍 Tromsø, Norway"
  },
  {
    navn: "Trond Vidar Hansen",
    bord: 2,
    sete: 3,
    bordType: 8,
    relasjon: "Søskendebarn",
    fbUrl: "https://www.facebook.com/trond.v.hansen.1",
    bildeFil: "images/gjester/trond-vidar-hansen.jpg",
    fbBio: "📚 Kvaløya Videregående Skole"
  },
  {
    navn: "Åge Hansen",
    bord: 2,
    sete: 7,
    bordType: 8,
    fbUrl: "https://www.facebook.com/age.hansen.56",
    relasjon: "Onkel",
    bildeFil: "images/gjester/age-hansen.jpg",
    fbBio: "📚 Finnfjordbotn Vidaregåande Skole · 📍 Tromsø, Norway"
  },
  {
    navn: "Anne Marit Bjørnflaten",
    bord: 3,
    sete: 2,
    bordType: 10,
    relasjon: "konen til svigerfar",
    fbUrl: "https://www.facebook.com/ambjornflaten",
    bildeFil: "images/gjester/anne-marit-bjornflaten.jpg",
    fbBio: "📍 Tromsø, Norway"
  },
  {
    navn: "Gunnar Wilhelmsen",
    bord: 3,
    sete: 1,
    bordType: 10,
    relasjon: "Svigerfar",
    fbUrl: "https://www.facebook.com/gwilhelmsen",
    bildeFil: "images/gjester/gunnar-wilhelmsen.jpg",
    fbBio: "📍 Tromsø, Norway"
  },
  {
    navn: "Jacob Wilhelmsen",
    bord: 3,
    sete: 9,
    bordType: 10,
    relasjon: "Sønn til Nina og Mats",
    fbUrl: "https://www.facebook.com/jacob.wilhelmsen",
    fbBio: "🏠 Utdanning · 💕 Singel",
    bildeFil: "images/gjester/jacob-wilhelmsen.jpg"
  },
  {
    navn: "Jørgen Wilhelmsen",
    bord: 3,
    sete: 6,
    bordType: 10,
    relasjon: "Sønn til Nina og Mats",
    fbUrl: "https://www.facebook.com/profile.php?id=1013976800",
    bildeFil: "images/gjester/jorgen-wilhelmsen.jpg"
  },
  {
    navn: "Mats Sæverud",
    bord: 3,
    sete: 5,
    bordType: 10,
    relasjon: "Mann til Nina Wilhelmsen",
    fbUrl: "https://www.facebook.com/profile.php?id=751660085",
    bildeFil: "images/gjester/mats-saeverud.jpg"
  },
  {
    navn: "Nina Wilhelmsen",
    bord: 3,
    sete: 4,
    bordType: 10,
    relasjon: "Sviger søster",
    fbUrl: "https://www.facebook.com/nina.wilhelmsen.18",
    bildeFil: "images/gjester/nina-wilhelmsen.jpg",
    liBio: "IBM Executive · 📍 Oslo, Oslo, Norway"
  },
  {
    navn: "Odne Stunes",
    bord: 3,
    sete: 8,
    bordType: 10,
    fbUrl: "https://www.facebook.com/odne.stunes",
    bildeFil: "images/gjester/odne-stunes.jpg",
    fbBio: "📍 Tromsø, Norway"
  },
  {
    navn: "Ragnhild Wilhelmsen",
    bord: 3,
    sete: 3,
    bordType: 10,
    relasjon: "Svigermor",
    fbUrl: "N/A",
    bildeFil: "images/gjester/ragnhild-wilhelmsen.jpg"
  },
  {
    navn: "Renate Larsen",
    bord: 3,
    sete: 7,
    bordType: 10,
    fbUrl: "https://www.facebook.com/renate.larsen.12",
    bildeFil: "images/gjester/renate-larsen.jpg",
    fbBio: "📍 Tromsø, Norway",
    liBio: "Styrearbeid og gründervirksomhet · 📍 Tromsø, Troms og Finnmark, Norway"
  },
  {
    navn: "Heidi Lekang",
    bord: 4,
    sete: 3,
    bordType: 8,
    relasjon: "Venn",
    fbUrl: "https://www.facebook.com/heidi.lekang",
    bildeFil: "images/gjester/heidi-lekang.jpg",
    fbBio: "📚 Kongsbakken Videregående Skole · 📍 Tromsø, Norway · 💕 Gift med Ole-Morten Indigo Lekang"
  },
  {
    navn: "Jan Erik Olsen",
    bord: 4,
    sete: 5,
    bordType: 8,
    bio: "Bekreftet på event-posten.",
    fbBio: "📍 Tromsø, Norway",
    fbUrl: "https://www.facebook.com/jan.e.olsen.777",
    liBio: "Research Director Marine Biotechnology at Nofima · 📍 Tromsø, Troms og Finnmark, Norway",
    liUrl: "https://www.linkedin.com/in/jan-erik-olsen-70b0a33/",
    bildeFil: "images/gjester/jan-erik-olsen.jpg",
    relasjon: "Venn"
  },
  {
    navn: "Lise Benjaminsen",
    bord: 4,
    sete: 1,
    bordType: 8,
    relasjon: "Venn",
    fbUrl: "https://www.facebook.com/lise.hilmarsdatterstrand",
    bildeFil: "images/gjester/lise-benjaminsen.jpg",
    fbBio: "📍 Tromsø, Norway · 💕 I et forhold med Morten Gammelgård Pedersen",
    liBio: "Teamleder salg, publikum og marked hos Arktisk Filharmoni AS · 📍 Tromsø, Troms og Finnmark, Norway"
  },
  {
    navn: "Marita Mokkelbost",
    bord: 4,
    sete: 8,
    bordType: 8,
    fbUrl: "https://www.facebook.com/marita.mokkelbost",
    relasjon: "Venn",
    bildeFil: "images/gjester/marita-mokkelbost.jpg"
  },
  {
    navn: "Morten Gammelgård",
    bord: 4,
    sete: 2,
    bordType: 8,
    relasjon: "Venn",
    fbUrl: "https://www.facebook.com/morten.gammelgaard.pedersen",
    bildeFil: "images/gjester/morten-gammelgard.jpg",
    fbBio: "📍 Tromsø, Norway"
  },
  {
    navn: "Ole Lekang",
    bord: 4,
    sete: 4,
    bordType: 8,
    relasjon: "Venn",
    fbUrl: "https://www.facebook.com/share/18poiFnhFe/",
    bildeFil: "images/gjester/ole-lekang.jpg"
  },
  {
    navn: "Ranveig Langseth",
    bord: 4,
    sete: 6,
    bordType: 8,
    relasjon: "Venn",
    fbUrl: "https://www.facebook.com/share/1byzjK5n42/",
    bildeFil: "images/gjester/ranveig-langseth.jpg"
  },
  {
    navn: "Ståle Søfting",
    bord: 4,
    sete: 7,
    bordType: 8,
    relasjon: "Venn",
    fbUrl: "https://www.facebook.com/stale.softing",
    bildeFil: "images/gjester/stale-softing.jpg",
    liBio: "Sales & Marketing Director at GC Rieber VivoMega AS · 📍 Kristiansund, Møre og Romsdal, Norway"
  },
  {
    navn: "Anneli Drecker",
    bord: 5,
    sete: 5,
    bordType: 8,
    pust: true,
    relasjon: "Venn og nabo",
    fbUrl: "https://www.facebook.com/ho.anneli",
    bildeFil: "images/gjester/anneli-drecker.jpg",
    fbBio: "📍 Tromsø, Norway · 💕 Gift med Jon Marius Aareskjold"
  },
  {
    navn: "Hans Thomas Brox",
    bord: 5,
    sete: 7,
    bordType: 8,
    pust: true,
    bio: "Sammen med Nina på Pust.",
    fbBio: "📍 Tromsø, Norway",
    fbUrl: "https://www.facebook.com/hans.t.brox",
    extraBio: "🦷 Oralkirurg",
    relasjon: "Venn og nabo",
    bildeFil: "images/gjester/hans-thomas-brox.jpg"
  },
  {
    navn: "Hege Blikfeldt",
    bord: 5,
    sete: 1,
    bordType: 8,
    relasjon: "Venn",
    fbUrl: "https://www.facebook.com/hege.blikfeldt",
    bildeFil: "images/gjester/hege-blikfeldt.jpg",
    fbBio: "📍 Tromsø, Norway · 💕 Gift med Hårek Guneriussen"
  },
  {
    navn: "Hårek Guneriussen",
    bord: 5,
    sete: 2,
    bordType: 8,
    relasjon: "Venn",
    fbUrl: "https://www.facebook.com/Keraah",
    bildeFil: "images/gjester/harek-guneriussen.jpg"
  },
  {
    navn: "Jon Marius Aareskjold",
    bord: 5,
    sete: 6,
    bordType: 8,
    pust: true,
    bio: "Pust!! +1 — detta blir stas!",
    fbUrl: "https://www.facebook.com/jonmariusaareskjold",
    relasjon: "Venn og nabo",
    bildeFil: "images/gjester/jon-marius-aareskjold.jpg"
  },
  {
    navn: "Lena Nymark",
    bord: 5,
    sete: 3,
    bordType: 8,
    pust: true,
    bio: "Bekreftet på event-posten.",
    fbBio: "📍 Tromsø, Norway · 💕 Gift med Terje André",
    fbUrl: "https://www.facebook.com/lena.g.nymark",
    relasjon: "Venn og nabo",
    bildeFil: "images/gjester/lena-nymark.jpg"
  },
  {
    navn: "Nina Brox",
    bord: 5,
    sete: 8,
    bordType: 8,
    pust: true,
    bio: "Pust pluss 1 (Hans Thomas).",
    fbBio: "Universitetssykehuset Nord-Norge HF · 📚 Universitetet i Oslo (UiO) · 📍 Tromsø, Norway",
    fbUrl: "https://www.facebook.com/broxene",
    folge: "Hans Thomas Brox",
    relasjon: "Venn og nabo",
    bildeFil: "images/gjester/nina-brox.jpg"
  },
  {
    navn: "Terje Nymark",
    bord: 5,
    sete: 4,
    bordType: 8,
    relasjon: "Venn og nabo",
    fbUrl: "https://www.facebook.com/terje.a.nymark",
    bildeFil: "images/gjester/terje-nymark.jpg",
    fbBio: "📚 Tvibit"
  },
  {
    navn: "Arne Aarhus",
    bord: 6,
    sete: 7,
    bordType: 8,
    pust: true,
    bio: "Pust-deltaker.",
    fbUrl: "https://www.facebook.com/arne.aarhus.7",
    relasjon: "Venn",
    bildeFil: "images/gjester/arne-aarhus.jpg"
  },
  {
    navn: "Bjarte Kristoffersen",
    bord: 6,
    sete: 4,
    bordType: 8,
    pust: true,
    bio: "Pust med +1 hvis følget puster.",
    fbUrl: "https://www.facebook.com/bjarte.kristoffersen",
    liBio: "Økonomisjef · 📍 Tromsø, Troms og Finnmark, Norway",
    liUrl: "https://www.linkedin.com/in/bjarte-kristoffersen-444a6813/",
    bildeFil: "images/gjester/bjarte-kristoffersen.jpg",
    relasjon: "Venn"
  },
  {
    navn: "Gina Bjørnstrøm",
    bord: 6,
    sete: 3,
    bordType: 8,
    pust: true,
    relasjon: "Venn",
    fbUrl: "https://www.facebook.com/Livligina",
    bildeFil: "images/gjester/gina-bjornstrom.jpg"
  },
  {
    navn: "Hilde Sander Meling",
    bord: 6,
    sete: 6,
    bordType: 8,
    pust: true,
    bio: "Pust for både Ivar og henne selv.",
    fbBio: "📚 Haukeland universitetssjukehus · 📍 Bergen, Hordaland",
    fbUrl: "https://www.facebook.com/litlo",
    folge: "Ivar Wulff",
    relasjon: "Venn",
    bildeFil: "images/gjester/hilde-sander-meling.jpg"
  },
  {
    navn: "Ingelill Kleivnes",
    bord: 6,
    sete: 8,
    bordType: 8,
    pust: true,
    bio: "Pust 😍",
    fbBio: "📚 University of Tromso · 💕 Gift med Arne Aarhus",
    fbUrl: "https://www.facebook.com/ingelill.kleivnes",
    relasjon: "Venn",
    bildeFil: "images/gjester/ingelill-kleivnes.jpg"
  },
  {
    navn: "Ivar Wullf",
    bord: 6,
    sete: 5,
    bordType: 8,
    pust: true,
    bio: "Sammen med Hilde på Pust.",
    fbUrl: "https://www.facebook.com/ivar.wulff",
    liBio: "COO VAP S&D · 📍 Norway",
    liUrl: "https://www.linkedin.com/in/ivarwulff/",
    bildeFil: "images/gjester/ivar-wullf.jpg",
    relasjon: "Venn"
  },
  {
    navn: "Jon Steinar Engenes",
    bord: 6,
    sete: 2,
    bordType: 8,
    pust: true,
    bio: "Pust! ❄️",
    fbBio: "📍 Tromsø, Norway · 💕 I et forhold med Kirsten Buck Rustad",
    fbUrl: "https://www.facebook.com/jon.engenes",
    liBio: "Head of Communications · 📍 Tromsø Region",
    liUrl: "https://www.linkedin.com/in/jonengenes/",
    bildeFil: "images/gjester/jon-steinar-engenes.jpg",
    relasjon: "Venn"
  },
  {
    navn: "Odd Gunnar Ingebritsen",
    bord: 6,
    sete: 1,
    bordType: 8,
    fbBio: "Universitetssykehuset Nord-Norge HF · 📚 Melbu videregående skole · 📍 Tromsø, Norway",
    fbUrl: "https://www.facebook.com/odd.g.ingebrigtsen",
    liBio: "Ønsker du markedets mest komplette datasikkerhetsløsning? · 📍 Tromsø, Troms og Finnmark, Norway",
    liUrl: "https://www.linkedin.com/in/oddgunnaringebrigtsen/",
    bildeFil: "images/gjester/odd-gunnar-ingebritsen.jpg",
    relasjon: "Venn"
  },
  {
    navn: "Andreas Willumsen",
    bord: 7,
    sete: 7,
    bordType: 8,
    pust: true,
    bio: "Pust 🔥",
    fbBio: "📚 Kongsbakken Videregående Skole · 📍 Tromsø, Norway · 💕 I et forhold med Oddrun Halvorsen",
    fbUrl: "https://www.facebook.com/andreas.willumsen",
    relasjon: "Venn",
    bildeFil: "images/gjester/andreas-willumsen.jpg"
  },
  {
    navn: "Jan Heier Johansen",
    bord: 7,
    sete: 2,
    bordType: 8,
    pust: true,
    bio: "Bursdagsapp-bygger og venn av Thomas. Sammen med Kristina.",
    folge: "Kristina",
    relasjon: "Venn",
    fbUrl: "https://www.facebook.com/janheierjohansen",
    bildeFil: "images/gjester/jan-heier-johansen.jpg"
  },
  {
    navn: "Kristina Kantola",
    bord: 7,
    sete: 1,
    bordType: 8,
    pust: true,
    bio: "Sammen med Jan på fest og Pust.",
    fbUrl: "https://www.facebook.com/kristina.kantola.90",
    relasjon: "Venn",
    bildeFil: "images/gjester/kristina-kantola.jpg"
  },
  {
    navn: "Line Myreng",
    bord: 7,
    sete: 4,
    bordType: 8,
    pust: true,
    bio: "Sammen med Rune på Pust.",
    fbBio: "📚 Universitetet i tromsø · 📍 Tromsø, Norway · 💕 Gift med Rune Myreng",
    fbUrl: "https://www.facebook.com/line.myreng",
    relasjon: "Venn",
    bildeFil: "images/gjester/line-myreng.jpg"
  },
  {
    navn: "Maria Christina Edwall",
    bord: 7,
    sete: 6,
    bordType: 8,
    pust: true,
    bio: "Klar for Pust 💦",
    fbBio: "📚 UiT Norges arktiske universitet · 📍 Tromsø, Norway · 💕 I et forhold med Ørjan Berg Karlsen",
    fbUrl: "https://www.facebook.com/maria.c.edwall",
    relasjon: "Venn",
    bildeFil: "images/gjester/maria-christina-edwall.jpg"
  },
  {
    navn: "Marius Furnes",
    bord: 7,
    sete: 8,
    bordType: 8,
    bio: "Bekreftet på event-posten.",
    fbUrl: "https://www.facebook.com/furnesmarius",
    relasjon: "Venn",
    bildeFil: "images/gjester/marius-furnes.jpg",
    extraBio: "Jobber hos SK Gruppen AS"
  },
  {
    navn: "Rune Myreng",
    bord: 7,
    sete: 3,
    bordType: 8,
    pust: true,
    bio: "Sammen med Line på Pust og fest.",
    fbBio: "Bailbrook College, Bath UK · 📍 Tromsø, Norway · 💕 Gift med Line Myreng",
    fbUrl: "https://www.facebook.com/rune.myreng",
    folge: "Line Myreng",
    relasjon: "Venn",
    bildeFil: "images/gjester/rune-myreng.jpg"
  },
  {
    navn: "Ørjan Berg Karlsen",
    bord: 7,
    sete: 5,
    bordType: 8,
    pust: true,
    bio: "Pust 😍",
    fbBio: "📚 Kongsbakken Videregående Skole · 📍 Tromsø, Norway · 💕 I et forhold med Maria Christina Edwall",
    fbUrl: "https://www.facebook.com/orjanbk",
    relasjon: "Venn",
    bildeFil: "images/gjester/orjan-berg-karlsen.jpg"
  },
  {
    navn: "Cathrine Marie Giæver",
    bord: 8,
    sete: 3,
    bordType: 8,
    bio: "Terningkast 6 for tidlig beskjed — gleder seg!",
    fbBio: "Macks Ølbryggeri AS · 📚 BI Norwegian Business School · 📍 Tromsø, Norway · 💕 Gift med Lasse Lauritz Pettersen",
    fbUrl: "https://www.facebook.com/cathrine.giaever",
    bildeFil: "images/gjester/cathrine-marie-giaever.jpg",
    relasjon: "Venn"
  },
  {
    navn: "Einar Nilsen",
    bord: 8,
    sete: 5,
    bordType: 8,
    fbBio: "📚 University of Tromsø · 📍 Molde, Norway",
    fbUrl: "https://www.facebook.com/einar.nilsen.5",
    relasjon: "Venn",
    bildeFil: "images/gjester/einar-nilsen.jpg"
  },
  {
    navn: "Erin Hald",
    bord: 8,
    sete: 2,
    bordType: 8,
    bio: "Bekreftet på event-posten.",
    fbBio: "Universitetssykehuset Nord-Norge HF · 📚 UiT Norges arktiske universitet · 📍 Tromsø, Norway",
    fbUrl: "https://www.facebook.com/erin.hald",
    relasjon: "Venn",
    bildeFil: "images/gjester/erin-hald.jpg"
  },
  {
    navn: "Lasse Pettersen",
    bord: 8,
    sete: 4,
    bordType: 8,
    relasjon: "Venn",
    fbUrl: "https://www.facebook.com/lasselauritz",
    bildeFil: "images/gjester/lasse-pettersen.jpg",
    fbBio: "📚 Kongsbakken Videregående Skole · 📍 Tromsø, Norway · 💕 Gift med Cathrine Marie Giæver",
    liBio: "Section Manager, Customer Experience · 📍 Tromsø, Troms og Finnmark, Norway"
  },
  {
    navn: "Marit Bratrud Nilsen",
    bord: 8,
    sete: 6,
    bordType: 8,
    relasjon: "Venn",
    fbUrl: "https://www.facebook.com/marit.b.nilsen.1",
    bildeFil: "images/gjester/marit-bratrud-nilsen.jpg",
    fbBio: "📍 Molde, Norway"
  },
  {
    navn: "Marit Osima",
    bord: 8,
    sete: 7,
    bordType: 8,
    bio: "Pust med +1.",
    fbBio: "📍 Tromsø, Norway",
    fbUrl: "https://www.facebook.com/marit.osima",
    extraBio: "👩‍⚕️ Allmennlegespesialist og fastlege",
    relasjon: "Venn",
    bildeFil: "images/gjester/marit-osima.jpg"
  },
  {
    navn: "Stig Tennås",
    bord: 8,
    sete: 1,
    bordType: 8,
    relasjon: "Venn",
    fbUrl: "https://www.facebook.com/stig.tennas",
    bildeFil: "images/gjester/stig-tennas.jpg"
  },
  {
    navn: "Øyvind Nordgård",
    bord: 8,
    sete: 8,
    bordType: 8,
    relasjon: "Venn",
    fbUrl: "N/A",
    bildeFil: "images/gjester/oyvind-nordgard.png"
  },
  {
    navn: "Christine Strøm",
    bord: 9,
    sete: 8,
    bordType: 10,
    pust: true,
    relasjon: "Venn",
    fbUrl: "https://www.facebook.com/profile.php?id=877385373",
    bildeFil: "images/gjester/christine-strom.jpg"
  },
  {
    navn: "Eirik Torbergsen",
    bord: 9,
    sete: 4,
    bordType: 10,
    relasjon: "Venn",
    fbUrl: "https://www.facebook.com/eirik.torbergsen",
    bildeFil: "images/gjester/eirik-torbergsen.jpg",
    fbBio: "📚 Hammerfest Videregående Skole · 📍 Tromsø, Norway"
  },
  {
    navn: "Ellen Eliassen",
    bord: 9,
    sete: 5,
    bordType: 10,
    bio: "Bekreftet på event-posten.",
    fbBio: "📍 Tromsø, Norway",
    fbUrl: "https://www.facebook.com/ellendeliassen",
    relasjon: "Venn",
    bildeFil: "images/gjester/ellen-eliassen.jpg"
  },
  {
    navn: "Erik Josefsen",
    bord: 9,
    sete: 2,
    bordType: 10,
    relasjon: "Venn",
    fbUrl: "N/A",
    bildeFil: "images/gjester/erik-josefsen.jpg"
  },
  {
    navn: "Geir Olav Skogstad",
    bord: 9,
    sete: 7,
    bordType: 10,
    pust: true,
    bio: "Pust x 2 — kommer med følge.",
    fbUrl: "https://www.facebook.com/geirolav.skogstad",
    relasjon: "Venn",
    bildeFil: "images/gjester/geir-olav-skogstad.jpg"
  },
  {
    navn: "Magnus Seppola",
    bord: 9,
    sete: 6,
    bordType: 10,
    relasjon: "Venn",
    fbUrl: "https://www.facebook.com/magnus.seppola",
    bildeFil: "images/gjester/magnus-seppola.jpg"
  },
  {
    navn: "Silje Ingebrigtsen",
    bord: 9,
    sete: 9,
    bordType: 10,
    pust: true,
    bio: "Klar for badstue og fest.",
    fbBio: "Sykehusinnkjøp HF · 📚 Kongsbakken Videregående Skole · 📍 Tromsø, Norway · 💕 I et forhold med Terje Karlstad",
    fbUrl: "https://www.facebook.com/silje.ingebrigtsen.75",
    relasjon: "Venn",
    bildeFil: "images/gjester/silje-ingebrigtsen.jpg"
  },
  {
    navn: "Siv-Cathrine Torbergsen",
    bord: 9,
    sete: 3,
    bordType: 10,
    relasjon: "Venn",
    fbUrl: "https://www.facebook.com/share/1EiMmN7x2J/",
    bildeFil: "images/gjester/siv-cathrine-torbergsen.jpg"
  },
  {
    navn: "Synne Guldbrandsen",
    bord: 9,
    sete: 1,
    bordType: 10,
    relasjon: "Venn",
    fbUrl: "https://www.facebook.com/synne.guldbrandsen",
    fbBio: "📚 Norges Fiskerihøgskole",
    bildeFil: "images/gjester/synne-guldbrandsen.jpg"
  },
  {
    navn: "Terje Karlsen",
    bord: 9,
    sete: 10,
    bordType: 10,
    pust: true,
    relasjon: "Venn",
    fbUrl: "https://www.facebook.com/terje.karlstad.1",
    bildeFil: "images/gjester/terje-karlsen.jpg",
    fbBio: "📍 Tromsø, Norway · 💕 I et forhold med Silje Ingebrigtsen"
  },
  {
    navn: "Erlend Hagan",
    bord: 10,
    sete: 1,
    bordType: 8,
    relasjon: "Venn",
    fbUrl: "https://www.facebook.com/erlend.hagan",
    bildeFil: "images/gjester/erlend-hagan.jpg",
    fbBio: "💕 Gift med Lena Schøning"
  },
  {
    navn: "Gro-Hilde Severinsen",
    bord: 10,
    sete: 8,
    bordType: 8,
    pust: true,
    relasjon: "Venn",
    fbUrl: "https://www.facebook.com/share/1BtYwPzsD8/",
    bildeFil: "images/gjester/gro-hilde-severinsen.jpg"
  },
  {
    navn: "Kjell Roger Andersen",
    bord: 10,
    sete: 7,
    bordType: 8,
    pust: true,
    fbBio: "📍 Balsfjord",
    fbUrl: "https://www.facebook.com/kjellra",
    relasjon: "Venn",
    bildeFil: "images/gjester/kjell-roger-andersen.jpg"
  },
  {
    navn: "Lars Hadsen Hansen",
    bord: 10,
    sete: 5,
    bordType: 8,
    pust: true,
    bio: "Skal gjøre alt han kan for å komme på feiringa.",
    fbBio: "St. Olavs Hospital Trondheim · 📚 University Of Pécs · 📍 Trondheim, Norway · 💕 I et forhold med Oda Bolkan Fugelsnes",
    fbUrl: "https://www.facebook.com/fiskarlars",
    relasjon: "Venn",
    bildeFil: "images/gjester/lars-hadsen-hansen.jpg"
  },
  {
    navn: "Lena Schøning",
    bord: 10,
    sete: 2,
    bordType: 8,
    relasjon: "Venn",
    fbUrl: "https://www.facebook.com/profile.php?id=596541244",
    bildeFil: "images/gjester/lena-schoning.jpg"
  },
  {
    navn: "Marianne Bille",
    bord: 10,
    sete: 4,
    bordType: 8,
    pust: true,
    bio: "Pust for Øyvind og henne selv — gleder seg!",
    fbUrl: "https://www.facebook.com/marianne.bille.1",
    liBio: "Seniorrådgiver OU og kompetanse hos Statnett · 📍 Oslo, Oslo, Norway",
    liUrl: "https://www.linkedin.com/in/marianne-bille-8b9b1911/",
    bildeFil: "images/gjester/marianne-bille.jpg",
    folge: "Øyvind Grinde",
    relasjon: "Venn"
  },
  {
    navn: "Marianne Svorken",
    bord: 10,
    sete: 6,
    bordType: 8,
    bio: "Klar for Pust og fest.",
    fbBio: "📍 Tromsø, Norway · 💕 I et forhold med Anders Mo Hanssen",
    fbUrl: "https://www.facebook.com/marianne.svorken",
    relasjon: "Venn",
    bildeFil: "images/gjester/marianne-svorken.jpg"
  },
  {
    navn: "Øyvind Grinde",
    bord: 10,
    sete: 3,
    bordType: 8,
    pust: true,
    bio: "Sammen med Marianne Bille på Pust.",
    fbBio: "📍 Oslo, Norge",
    fbUrl: "https://www.facebook.com/ogrinde",
    relasjon: "Venn",
    bildeFil: "images/gjester/oyvind-grinde.jpg"
  },
  {
    navn: "Anne Marvik",
    bord: 11,
    sete: 4,
    bordType: 8,
    relasjon: "Venn",
    fbUrl: "https://www.facebook.com/annekristine.marvik",
    bildeFil: "images/gjester/anne-marvik.jpg",
    fbBio: "Aleris - sykehus & medisinske sentre · 📚 Kongsbakken Videregående Skole · 📍 Tromsø, Norway · 💕 Gift med Gaute Marvik"
  },
  {
    navn: "Gaute Marvik",
    bord: 11,
    sete: 3,
    bordType: 8,
    relasjon: "Venn",
    fbUrl: "https://www.facebook.com/gmarvik",
    bildeFil: "images/gjester/gaute-marvik.jpg",
    fbBio: "📍 Tromsø, Norway · 💕 Gift med Anne Kristine Marvik",
    liBio: "Helse Nord IKT · 📍 Tromsø, Troms og Finnmark, Norway"
  },
  {
    navn: "Geir Helge Valle",
    bord: 11,
    sete: 1,
    bordType: 8,
    relasjon: "Venn",
    fbUrl: "https://www.facebook.com/geirhelge.valle",
    bildeFil: "images/gjester/geir-helge-valle.jpg",
    fbBio: "📚 Kongsbakken Videregående Skole"
  },
  {
    navn: "Kenneth Mikkelsen",
    bord: 11,
    sete: 5,
    bordType: 8,
    relasjon: "Venn",
    fbUrl: "https://www.facebook.com/kenneth.mikkelsen.921",
    bildeFil: "images/gjester/kenneth-mikkelsen.jpg",
    fbBio: "📚 Universitetet i tromsø · 📍 Tromsø, Norway · 💕 Gift med Nina Mikkelsen"
  },
  {
    navn: "Lars Gaute Jørgensen",
    bord: 11,
    sete: 8,
    bordType: 8,
    pust: true,
    relasjon: "Venn",
    fbUrl: "https://www.facebook.com/larsgaute",
    bildeFil: "images/gjester/lars-gaute-jorgensen.jpg",
    fbBio: "PHARMAQ AS · 📍 Tromsø, Norway",
    liBio: "Area Sales Manager Norway and Nordics at PHARMAQ · 📍 Tromsø, Troms og Finnmark, Norway"
  },
  {
    navn: "Lise Valle",
    bord: 11,
    sete: 2,
    bordType: 8,
    relasjon: "Venn",
    fbUrl: "https://www.facebook.com/lise.fransiska.valle",
    bildeFil: "images/gjester/lise-valle.jpg",
    fbBio: "📚 BI Norwegian Business School"
  },
  {
    navn: "Nina Mikkelsen",
    bord: 11,
    sete: 6,
    bordType: 8,
    relasjon: "Venn",
    fbUrl: "https://www.facebook.com/nina.mikkelsen.5",
    bildeFil: "images/gjester/nina-mikkelsen.jpg",
    fbBio: "Akvaplan-niva AS · 📍 Tromsø, Norway",
    liBio: "Senior researcher, Environmental impact assessments and monitoring · 📍 Tromsø, Troms og Finnmark, Norway"
  },
  {
    navn: "Ole Herman Størmmesen",
    bord: 11,
    sete: 7,
    bordType: 8,
    pust: true,
    bio: "Klar for damp og dans.",
    relasjon: "Venn",
    fbUrl: "https://www.facebook.com/profile.php?id=100095565124276",
    bildeFil: "images/gjester/ole-herman-stormmesen.jpg"
  }
];

const SANGER_LYRICS = `🎵 HURRA FOR THOMAS 🎵

[Verse 1]
Han kom innj i rommet med et smil på sin munnj
Femti år gammel, men ung som en hunnj
Danseløva fra Tromsø, han stikk aldri av
Han e' han vi vil ha med oss, fra vogga te' grav

[Chorus]
Hurra for Thomas — vi digger dæ!
Du e' kul, du e' best, og en hælvetes go' fyr
Hurra for Thomas — vi heie på dæ!
Skål for danseløva — kveldens villaste dyr!

[Verse 2]
Han danse heile natta, han gir sæ aldri ned
Når Thomas e' på byen så e' det fest med
Et hjerte stort som havet, en latter som et brak
Vi e' her for å feire dæ — kom igjen, ta et tak!

[Chorus]
Hurra for Thomas — vi digger dæ!
Du e' kul, du e' best, og en hælvetes go' fyr
Hurra for Thomas — vi heie på dæ!
Skål for danseløva — kveldens villaste dyr!

[Outro – chant]
Tho-mas! Tho-mas! Tho-mas!
Hurra! Hurra! Hurra! 🎉🥂🦁
`;

// Bord-tema: hvert bord får navn og farge etter en fjelltopp rundt Tromsø
const BORD_TEMA = {
  1:  { fjell: 'Hamperokken',     hoyde: 1404, hvor: 'Ullsfjorden',  farge: '#D4A853', url: 'https://kugo.no/2011/07/hamperokken-1404-moh/' },
  2:  { fjell: 'Tromsdalstinden', hoyde: 1238, hvor: 'Tromsdalen',   farge: '#4A6FA5', url: 'https://kugo.no/2015/04/tromsdalstinden-1238-moh-3/' },
  3:  { fjell: 'Fløya',            hoyde: 671,  hvor: 'Tromsøya (Sherpatrappa)', farge: '#C97B4F', url: 'https://kugo.no/2022/11/floya-671-sherpatrappa/' },
  4:  { fjell: 'Steinskartinden',  hoyde: 817,  hvor: 'Kvaløya, Kattfjordeidet', farge: '#6B8AA0', url: 'https://kugo.no/2020/05/steinskartinden-817-moh/' },
  5:  { fjell: 'Store Blåmann',    hoyde: 1044, hvor: 'Kvaløya',      farge: '#5B7BA8', url: 'https://kugo.no/2011/09/store-blamann-1044-moh/' },
  6:  { fjell: 'Skamtinden',       hoyde: 884,  hvor: 'Kvaløya, Ersfjorden', farge: '#6B9476', url: 'https://kugo.no/2012/10/skamtinden-884-moh/' },
  7:  { fjell: 'Daltinden',        hoyde: 1533, hvor: 'Lyngsalpene, Furuflaten', farge: '#A55A4A', url: 'https://kugo.no/2010/03/daltinden1533/' },
  8:  { fjell: 'Rema 1000',        hoyde: 1000, hvor: 'Ringvassøya (Soltindan N)', farge: '#4A7A6F', url: 'https://kugo.no/2009/10/massiv-nord-av-soltindan-1000-moh-2/' },
  9:  { fjell: 'Skitntinden',      hoyde: 1042, hvor: 'Kvaløya, Kattfjordeidet', farge: '#8A6B8A', url: 'https://kugo.no/2011/04/skitntinden-1042-moh/' },
  10: { fjell: 'Blåskredtinden',   hoyde: 785,  hvor: 'Kvaløya, Nordfjordbotn', farge: '#6BA0B0', url: 'https://kugo.no/2012/10/blaskredtinden-785-moh/' },
  11: { fjell: 'Styrmannstinden',  hoyde: 955,  hvor: 'Kvaløya, Vågbotn', farge: '#B07A5A', url: 'https://kugo.no/2014/06/styrmannstinden-955-moh-2/' },
};

// Quiz: "Hvor godt kjenner du Thomas?" — fasit-spørsmål med svar
const SPILL_QUIZ = [
  {
    spm: "Hvor sovner Thomas på fest?",
    valg: ["I sofaen", "På do", "På dansegulvet", "I taxien hjem"],
    svar: 1,
    fasit: "På do! 🚽 Klassisk Thomas-trekk."
  },
  {
    spm: "Kjører Thomas brett, rando eller telemark?",
    valg: ["Brett", "Randonee", "Telemark", "Alpint"],
    svar: 2,
    fasit: "Telemark! 🎿 Knebøy ned hver eneste sving."
  },
  {
    spm: "Hva er Thomas sin foretrukne badstu-temperatur?",
    valg: ["70°C — koselig", "85°C — vanlig", "100°C+ — knall", "Iskaldt bad i stedet"],
    svar: 2,
    fasit: "100°C+ — Thomas tåler det meste. 🔥"
  },
  {
    spm: "Hvilket kallenavn fikk Thomas av toastmasterne?",
    valg: ["Kongen", "Danseløva", "Nordlysmannen", "Senja-Thomas"],
    svar: 1,
    fasit: "Danseløva! 🦁 Marianne Wilhelmsen kalte han det selv."
  },
  {
    spm: "Hvor mange år har Thomas vært i Tromsø?",
    valg: ["Hele livet", "Siden studiene", "Siden 2000-tallet", "Bare noen år"],
    svar: null,
    fasit: "Diskuter rundt bordet — hvem vet best?"
  },
  {
    spm: "Hva er Thomas sin perfekte søndag?",
    valg: ["Lang frokost + tur", "Pust badstue + bad", "Sofa + serie", "Hytte med venner"],
    svar: null,
    fasit: "Alle svar er rett — så lenge han får lov å danse om kvelden!"
  },
  {
    spm: "Hva drikker Thomas helst når han skåler?",
    valg: ["Pils", "Rødvin", "Aquavit", "Champagne"],
    svar: null,
    fasit: "Thomas avgjør — spør ham!"
  },
  {
    spm: "Hvilken artist får Thomas først ut på dansegulvet?",
    valg: ["Aggie Frost (selvsagt!)", "Postgirobygget", "Kygo", "ABBA"],
    svar: 0,
    fasit: "Aggie Frost — det er jo derfor hun spiller på Bakrommet! 🎶"
  },
  {
    spm: "Hvilke land har Thomas vært i i 2026?",
    valg: ["Canada + USA", "Frankrike + Spania", "Sveits + Polen", "Alle de over!"],
    svar: 3,
    fasit: "Alle! 🌍 Canada, USA, Frankrike, Spania, Sveits OG Polen — Omega-3 til folket."
  },
  {
    spm: "Hvilken kjendis er Thomas sin nye bestevenn?",
    valg: ["Petter Northug", "Marit Bjørgen", "Anette Bøe", "Bjørn Dæhlie"],
    svar: 2,
    fasit: "Anette Bøe! 🎿 Den tidligere skiløperen er Thomas sin nye bestevenn."
  },
  {
    spm: "Hvor jobber Thomas nå?",
    valg: ["ScanBio Marine Group", "Olivita AS", "GC Rieber VivoMega", "Ayanda"],
    svar: 2,
    fasit: "GC Rieber VivoMega AS — Sales Manager for Nord-Amerika og Europa."
  },
  {
    spm: "Hva er Thomas sin verste fobi?",
    valg: ["Edderkopper 🕷️", "FOMO — sier ja til alt!", "Høyder 🪂", "Tom badstue"],
    svar: 1,
    fasit: "FOMO! 😱 Thomas vil være med på ALT og sier ja før spørsmålet er ferdig stilt."
  },
  {
    spm: "Hvilke maraton har Thomas fullført?",
    valg: ["Bare et halvmaraton", "Maraton på asfalt", "Skimaraton på Svalbard", "Både skimaraton på Svalbard OG vanlig maraton"],
    svar: 3,
    fasit: "Begge deler! 🎿🏃 Thomas er sprek som en oter — skimaraton på Svalbard OG vanlig maraton i beina."
  },
  {
    spm: "Hva er Thomas sin maraton-pers?",
    valg: ["3:08:15", "3:28:38", "3:45:02", "4:11:30"],
    svar: 1,
    fasit: "3:28:38! 🏃💨 Det er omtrent 4:56/km i 42 km strake — respekt!"
  },
  {
    spm: "Hvor langt har Thomas løpt totalt på Strava?",
    valg: ["1 000 km", "2 500 km", "4 100 km", "8 000 km"],
    svar: 2,
    fasit: "Over 4 100 km! 🌍 Det er som å løpe fra Tromsø til Roma — og litt til."
  },
  {
    spm: "Hvor mange høydemeter har Thomas tatt totalt?",
    valg: ["10 000 m (litt over Mount Everest)", "25 000 m (3x Everest)", "50 000 m (~6x Everest)", "100 000 m"],
    svar: 2,
    fasit: "Nesten 50 000 m — det er som å bestige Mount Everest 6 ganger fra havet! 🏔️"
  },
];

// Åpne diskusjonsspørsmål for bordet (uten fasit)
const SPILL_SPØRSMÅL = [
  "Beskriv Thomas med tre ord — gjestene stemmer!",
  "Hvem kjenner Thomas best — gi ham en utfordring!",
  "Hva tror du Thomas drømmer om å gjøre de neste 50 år?",
  "Hva var Thomas' verste mote-feil på 90-tallet?",
  "Hvor mange land har Thomas besøkt? Gjett!",
  "Hvem av gjestene har kjent Thomas lengst?",
  "Hvilken sang åpner danseløva dansegulvet med?",
  "Hva er Thomas' mest minneverdige badstu-opplevelse?",
  "Hva ville Thomas gjort hvis han vant 50 millioner i dag?",
  "Hva er den beste festhistorien om Thomas du kjenner?",
];

const TOASTMASTER_EPOST = "ronnyandre@gmail.com";

// Om Thomas — fra LinkedIn
const OM_THOMAS = {
  navn: "Thomas Helge Hansen",
  kallenavn: "Danseløva 🦁",
  by: "Tromsø",
  utdanning: "UiT — The Arctic University of Norway",
  jobb_naa: {
    tittel: "Sales Manager",
    selskap: "GC Rieber VivoMega AS",
    beskrivelse: "Salgsledelse i Nord-Amerika og Europa innen Omega-3.",
  },
  jobber: [
    { tittel: "Sales Manager — Nord-Amerika & Europa", selskap: "GC Rieber VivoMega AS", periode: "Nå" },
    { tittel: "CEO", selskap: "Olivita AS / Arctic Omega-3 Norway AS", periode: "Tidligere" },
    { tittel: "Business Unit Director / Sales Director", selskap: "ScanBio Marine Group AS", periode: "Tidligere" },
    { tittel: "Business Development — Australia & Asia", selskap: "GC Rieber Oils / Ayanda", periode: "Tidligere" },
  ],
  reiser_2026: ["🇨🇦 Canada", "🇺🇸 USA", "🇫🇷 Frankrike", "🇪🇸 Spania", "🇨🇭 Sveits", "🇵🇱 Polen"],
  fun_facts: [
    "🏃 Maraton-pers: 3:28:38 (~4:56/km)",
    "🎿 Har gått skimaraton på Svalbard",
    "🌍 Over 4 100 km totalt på Strava",
    "🏔️ Nesten 50 000 høydemeter — ~6x Mount Everest",
    "😱 Lider av kronisk FOMO — sier ja til ALT",
    "🚽 Sovner på do når festen er over",
    "🦁 Toastmasterne kaller han Danseløva",
  ],
};
