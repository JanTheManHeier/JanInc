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
    beskrivelse: "Velkomstdrink, deretter 3-retters middag i kantinen i 2. etasje. For de ekstra tørste — bar i lokalet.",
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
    bordType: 8
  },
  {
    navn: "Birk H Wilhelmsen",
    bord: 1,
    bordType: 8
  },
  {
    navn: "Inger Johanne Sumstad",
    bord: 1,
    bordType: 8
  },
  {
    navn: "Maja Wilhelmsen",
    bord: 1,
    bordType: 8,
    pust: true,
    bio: "Pust 💦",
    fbBio: "Universitetssykehuset Nord-Norge HF · 📚 Kongsbakken Videregående Skole · 📍 Tromsø, Norway · 💕 Gift med Thomas Helge Hansen",
    fbUrl: "https://www.facebook.com/majawilhelmsen"
  },
  {
    navn: "Marianne Wilhelmsen",
    bord: 1,
    bordType: 8,
    rolle: "TOASTMASTER",
    bio: "🎤 Toastmaster sammen med Ronny André. Send mail til ronnyandre@gmail.com hvis du vil holde tale!",
    fbBio: "📚 Høgskolen i Buskerud, Hønefoss · 📍 Oslo, Norge",
    fbUrl: "https://www.facebook.com/supermarianne",
    liBio: "Assisterende partisekretær i Arbeiderpartiet · 📍 Oslo, Oslo, Norway",
    liUrl: "https://www.linkedin.com/in/marianne-wilhelmsen-/",
    bildeFil: "images/gjester/marianne-wilhelmsen.jpg",
    extraBio: "🌟 Statssekretær i regjeringen — utnevnt i statsråd"
  },
  {
    navn: "Ronny Andre Bendiksen",
    bord: 1,
    bordType: 8,
    rolle: "TOASTMASTER",
    bio: "🎤 Toastmaster sammen med Marianne. Kontakt: ronnyandre@gmail.com",
    fbUrl: "https://www.facebook.com/ronnyandre"
  },
  {
    navn: "Snorre H Wilhelmsen",
    bord: 1,
    bordType: 8
  },
  {
    navn: "Thomas Hansen",
    bord: 1,
    bordType: 8,
    pust: true
  },
  {
    navn: "Anita Sivertsen",
    bord: 2,
    bordType: 8
  },
  {
    navn: "Helge Hansen",
    bord: 2,
    bordType: 8
  },
  {
    navn: "Iris Wikmark",
    bord: 2,
    bordType: 8
  },
  {
    navn: "Jakob B Hansen",
    bord: 2,
    bordType: 8
  },
  {
    navn: "Kathrine B Hansen",
    bord: 2,
    bordType: 8
  },
  {
    navn: "Marte Lysnes Kristoffersen",
    bord: 2,
    bordType: 8
  },
  {
    navn: "Trond Vidar Hansen",
    bord: 2,
    bordType: 8
  },
  {
    navn: "Åge Hansen",
    bord: 2,
    bordType: 8
  },
  {
    navn: "Anne Marit Bjørnflaten",
    bord: 3,
    bordType: 10
  },
  {
    navn: "Gunnar Wilhelmsen",
    bord: 3,
    bordType: 10
  },
  {
    navn: "Jacob Wilhelmsen",
    bord: 3,
    bordType: 10
  },
  {
    navn: "Jørgen Wilhelmsen",
    bord: 3,
    bordType: 10
  },
  {
    navn: "Mats Sæverud",
    bord: 3,
    bordType: 10
  },
  {
    navn: "Nina Wilhelmsen",
    bord: 3,
    bordType: 10
  },
  {
    navn: "Odne Stunes",
    bord: 3,
    bordType: 10
  },
  {
    navn: "Ragnhild Wilhelmsen",
    bord: 3,
    bordType: 10
  },
  {
    navn: "Renate Larsen",
    bord: 3,
    bordType: 10
  },
  {
    navn: "Heidi Lekang",
    bord: 4,
    bordType: 8
  },
  {
    navn: "Jan Erik Olsen",
    bord: 4,
    bordType: 8,
    bio: "Bekreftet på event-posten.",
    fbBio: "📍 Tromsø, Norway",
    fbUrl: "https://www.facebook.com/jan.e.olsen.777",
    liBio: "Research Director Marine Biotechnology at Nofima · 📍 Tromsø, Troms og Finnmark, Norway",
    liUrl: "https://www.linkedin.com/in/jan-erik-olsen-70b0a33/",
    bildeFil: "images/gjester/jan-erik-olsen.jpg"
  },
  {
    navn: "Lise Benjaminsen",
    bord: 4,
    bordType: 8
  },
  {
    navn: "Marita Mokkelbost",
    bord: 4,
    bordType: 8
  },
  {
    navn: "Morten Gammelgård",
    bord: 4,
    bordType: 8
  },
  {
    navn: "Ole Lekang",
    bord: 4,
    bordType: 8
  },
  {
    navn: "Ranveig Langseth",
    bord: 4,
    bordType: 8
  },
  {
    navn: "Ståle Søfting",
    bord: 4,
    bordType: 8
  },
  {
    navn: "Anneli Drecker",
    bord: 5,
    bordType: 8,
    pust: true
  },
  {
    navn: "Hans Thomas Brox",
    bord: 5,
    bordType: 8,
    pust: true,
    bio: "Sammen med Nina på Pust.",
    fbBio: "📍 Tromsø, Norway",
    fbUrl: "https://www.facebook.com/hans.t.brox",
    extraBio: "🦷 Oralkirurg"
  },
  {
    navn: "Hege Blikfeldt",
    bord: 5,
    bordType: 8
  },
  {
    navn: "Hårek Guneriussen",
    bord: 5,
    bordType: 8
  },
  {
    navn: "Jon Marius Aareskjold",
    bord: 5,
    bordType: 8,
    pust: true,
    bio: "Pust!! +1 — detta blir stas!",
    fbUrl: "https://www.facebook.com/jonmariusaareskjold"
  },
  {
    navn: "Lena Nymark",
    bord: 5,
    bordType: 8,
    pust: true,
    bio: "Bekreftet på event-posten.",
    fbBio: "📍 Tromsø, Norway · 💕 Gift med Terje André",
    fbUrl: "https://www.facebook.com/lena.g.nymark"
  },
  {
    navn: "Nina Brox",
    bord: 5,
    bordType: 8,
    pust: true,
    bio: "Pust pluss 1 (Hans Thomas).",
    fbBio: "Universitetssykehuset Nord-Norge HF · 📚 Universitetet i Oslo (UiO) · 📍 Tromsø, Norway",
    fbUrl: "https://www.facebook.com/broxene",
    folge: "Hans Thomas Brox"
  },
  {
    navn: "Terje Nymark",
    bord: 5,
    bordType: 8
  },
  {
    navn: "Arne Aarhus",
    bord: 6,
    bordType: 8,
    pust: true,
    bio: "Pust og spleis-deltaker.",
    fbUrl: "https://www.facebook.com/arne.aarhus.7"
  },
  {
    navn: "Bjarte Kristoffersen",
    bord: 6,
    bordType: 8,
    pust: true,
    bio: "Initiativtaker for spleis. Pust med +1 hvis følget puster.",
    fbUrl: "https://www.facebook.com/bjarte.kristoffersen",
    liBio: "Økonomisjef · 📍 Tromsø, Troms og Finnmark, Norway",
    liUrl: "https://www.linkedin.com/in/bjarte-kristoffersen-444a6813/",
    bildeFil: "images/gjester/bjarte-kristoffersen.jpg"
  },
  {
    navn: "Gina Bjørnstrøm",
    bord: 6,
    bordType: 8,
    pust: true
  },
  {
    navn: "Hilde Sander Meling",
    bord: 6,
    bordType: 8,
    pust: true,
    bio: "Pust for både Ivar og henne selv.",
    fbBio: "📚 Haukeland universitetssjukehus · 📍 Bergen, Hordaland",
    fbUrl: "https://www.facebook.com/litlo",
    folge: "Ivar Wulff"
  },
  {
    navn: "Ingelill Kleivnes",
    bord: 6,
    bordType: 8,
    pust: true,
    bio: "Pust 😍",
    fbBio: "📚 University of Tromso · 💕 Gift med Arne Aarhus",
    fbUrl: "https://www.facebook.com/ingelill.kleivnes"
  },
  {
    navn: "Ivar Wullf",
    bord: 6,
    bordType: 8,
    pust: true,
    bio: "Sammen med Hilde på Pust.",
    fbUrl: "https://www.facebook.com/ivar.wulff",
    liBio: "COO VAP S&D · 📍 Norway",
    liUrl: "https://www.linkedin.com/in/ivarwulff/",
    bildeFil: "images/gjester/ivar-wulff.jpg"
  },
  {
    navn: "Jon Steinar Engenes",
    bord: 6,
    bordType: 8,
    pust: true,
    bio: "Pust! ❄️",
    fbBio: "📍 Tromsø, Norway · 💕 I et forhold med Kirsten Buck Rustad",
    fbUrl: "https://www.facebook.com/jon.engenes",
    liBio: "Head of Communications · 📍 Tromsø Region",
    liUrl: "https://www.linkedin.com/in/jonengenes/",
    bildeFil: "images/gjester/jon-steinar-engenes.jpg"
  },
  {
    navn: "Odd Gunnar Ingebritsen",
    bord: 6,
    bordType: 8,
    bio: "Med på spleisen til Thomas.",
    fbBio: "Universitetssykehuset Nord-Norge HF · 📚 Melbu videregående skole · 📍 Tromsø, Norway",
    fbUrl: "https://www.facebook.com/odd.g.ingebrigtsen",
    liBio: "Ønsker du markedets mest komplette datasikkerhetsløsning? · 📍 Tromsø, Troms og Finnmark, Norway",
    liUrl: "https://www.linkedin.com/in/oddgunnaringebrigtsen/",
    bildeFil: "images/gjester/odd-gunnar-ingebrigtsen.jpg"
  },
  {
    navn: "Andreas Willumsen",
    bord: 7,
    bordType: 8,
    pust: true,
    bio: "Pust 🔥",
    fbBio: "📚 Kongsbakken Videregående Skole · 📍 Tromsø, Norway · 💕 I et forhold med Oddrun Halvorsen",
    fbUrl: "https://www.facebook.com/andreas.willumsen"
  },
  {
    navn: "Jan Heier Johansen",
    bord: 7,
    bordType: 8,
    pust: true,
    bio: "Bursdagsapp-bygger og venn av Thomas. Sammen med Kristina.",
    folge: "Kristina"
  },
  {
    navn: "Kristina Kantola",
    bord: 7,
    bordType: 8,
    pust: true,
    bio: "Sammen med Jan på fest og Pust.",
    fbUrl: "https://www.facebook.com/kristina.kantola.90"
  },
  {
    navn: "Line Myreng",
    bord: 7,
    bordType: 8,
    pust: true,
    bio: "Sammen med Rune på Pust.",
    fbBio: "📚 Universitetet i tromsø · 📍 Tromsø, Norway · 💕 Gift med Rune Myreng",
    fbUrl: "https://www.facebook.com/line.myreng"
  },
  {
    navn: "Maria Christina Edwall",
    bord: 7,
    bordType: 8,
    pust: true,
    bio: "Klar for Pust 💦",
    fbBio: "📚 UiT Norges arktiske universitet · 📍 Tromsø, Norway · 💕 I et forhold med Ørjan Berg Karlsen",
    fbUrl: "https://www.facebook.com/maria.c.edwall"
  },
  {
    navn: "Marius Furnes",
    bord: 7,
    bordType: 8,
    bio: "Bekreftet på event-posten.",
    fbUrl: "https://www.facebook.com/furnesmarius"
  },
  {
    navn: "Rune Myreng",
    bord: 7,
    bordType: 8,
    pust: true,
    bio: "Sammen med Line på Pust og fest.",
    fbBio: "Bailbrook College, Bath UK · 📍 Tromsø, Norway · 💕 Gift med Line Myreng",
    fbUrl: "https://www.facebook.com/rune.myreng",
    folge: "Line Myreng"
  },
  {
    navn: "Ørjan Berg Karlsen",
    bord: 7,
    bordType: 8,
    pust: true,
    bio: "Pust 😍",
    fbBio: "📚 Kongsbakken Videregående Skole · 📍 Tromsø, Norway · 💕 I et forhold med Maria Christina Edwall",
    fbUrl: "https://www.facebook.com/orjanbk"
  },
  {
    navn: "Cathrine Marie Gi'ver",
    bord: 8,
    bordType: 8,
    bio: "Terningkast 6 for tidlig beskjed — gleder seg!",
    fbBio: "Macks Ølbryggeri AS · 📚 BI Norwegian Business School · 📍 Tromsø, Norway · 💕 Gift med Lasse Lauritz Pettersen",
    fbUrl: "https://www.facebook.com/cathrine.giaever"
  },
  {
    navn: "Einar Nilsen",
    bord: 8,
    bordType: 8,
    bio: "Med på spleisen til Thomas.",
    fbBio: "📚 University of Tromsø · 📍 Molde, Norway",
    fbUrl: "https://www.facebook.com/einar.nilsen.5"
  },
  {
    navn: "Erin Hald",
    bord: 8,
    bordType: 8,
    bio: "Bekreftet på event-posten.",
    fbBio: "Universitetssykehuset Nord-Norge HF · 📚 UiT Norges arktiske universitet · 📍 Tromsø, Norway",
    fbUrl: "https://www.facebook.com/erin.hald"
  },
  {
    navn: "Lasse Pettersen",
    bord: 8,
    bordType: 8
  },
  {
    navn: "Marit Bratrud Nilsen",
    bord: 8,
    bordType: 8
  },
  {
    navn: "Marit Osima",
    bord: 8,
    bordType: 8,
    bio: "Pust med +1.",
    fbBio: "📍 Tromsø, Norway",
    fbUrl: "https://www.facebook.com/marit.osima",
    extraBio: "👩‍⚕️ Allmennlegespesialist og fastlege"
  },
  {
    navn: "Stig Tennås",
    bord: 8,
    bordType: 8
  },
  {
    navn: "Øyvind Nordgård",
    bord: 8,
    bordType: 8
  },
  {
    navn: "Christine Strøm",
    bord: 9,
    bordType: 10,
    pust: true
  },
  {
    navn: "Eirik Torbergsen",
    bord: 9,
    bordType: 10
  },
  {
    navn: "Ellen Eliassen",
    bord: 9,
    bordType: 10,
    bio: "Bekreftet på event-posten.",
    fbBio: "📍 Tromsø, Norway",
    fbUrl: "https://www.facebook.com/ellendeliassen"
  },
  {
    navn: "Erik Josefsen",
    bord: 9,
    bordType: 10
  },
  {
    navn: "Geir Olav Skogstad",
    bord: 9,
    bordType: 10,
    pust: true,
    bio: "Pust x 2 — kommer med følge.",
    fbUrl: "https://www.facebook.com/geirolav.skogstad"
  },
  {
    navn: "Magnus Seppola",
    bord: 9,
    bordType: 10
  },
  {
    navn: "Silje Ingebrigtsen",
    bord: 9,
    bordType: 10,
    pust: true,
    bio: "Klar for badstue og fest.",
    fbBio: "Sykehusinnkjøp HF · 📚 Kongsbakken Videregående Skole · 📍 Tromsø, Norway · 💕 I et forhold med Terje Karlstad",
    fbUrl: "https://www.facebook.com/silje.ingebrigtsen.75"
  },
  {
    navn: "Siw Cathrine  Torbergsen",
    bord: 9,
    bordType: 10
  },
  {
    navn: "Synne Guldbrandsen",
    bord: 9,
    bordType: 10
  },
  {
    navn: "Terje Karlsen",
    bord: 9,
    bordType: 10,
    pust: true
  },
  {
    navn: "Erlend Hagan",
    bord: 10,
    bordType: 8
  },
  {
    navn: "Gro-Hilde Severinsen",
    bord: 10,
    bordType: 8,
    pust: true
  },
  {
    navn: "Kjell Roger Andersen",
    bord: 10,
    bordType: 8,
    pust: true,
    bio: "Med på spleisen til Thomas.",
    fbBio: "📍 Balsfjord",
    fbUrl: "https://www.facebook.com/kjellra"
  },
  {
    navn: "Lars Hadsen Hansen",
    bord: 10,
    bordType: 8,
    pust: true,
    bio: "Skal gjøre alt han kan for å komme på feiringa.",
    fbBio: "St. Olavs Hospital Trondheim · 📚 University Of Pécs · 📍 Trondheim, Norway · 💕 I et forhold med Oda Bolkan Fugelsnes",
    fbUrl: "https://www.facebook.com/fiskarlars"
  },
  {
    navn: "Lena Schøning",
    bord: 10,
    bordType: 8
  },
  {
    navn: "Marianne Bille",
    bord: 10,
    bordType: 8,
    pust: true,
    bio: "Pust for Øyvind og henne selv — gleder seg!",
    fbUrl: "https://www.facebook.com/marianne.bille.1",
    liBio: "Seniorrådgiver OU og kompetanse hos Statnett · 📍 Oslo, Oslo, Norway",
    liUrl: "https://www.linkedin.com/in/marianne-bille-8b9b1911/",
    bildeFil: "images/gjester/marianne-bille.jpg",
    folge: "Øyvind Grinde"
  },
  {
    navn: "Marianne Svorken",
    bord: 10,
    bordType: 8,
    bio: "Klar for Pust og fest.",
    fbBio: "📍 Tromsø, Norway · 💕 I et forhold med Anders Mo Hanssen",
    fbUrl: "https://www.facebook.com/marianne.svorken"
  },
  {
    navn: "Øyvind Grinde",
    bord: 10,
    bordType: 8,
    pust: true,
    bio: "Sammen med Marianne Bille på Pust.",
    fbBio: "📍 Oslo, Norge",
    fbUrl: "https://www.facebook.com/ogrinde"
  },
  {
    navn: "Anne Marvik",
    bord: 11,
    bordType: 8
  },
  {
    navn: "Gaute Marvik",
    bord: 11,
    bordType: 8
  },
  {
    navn: "Geir Helge Valle",
    bord: 11,
    bordType: 8
  },
  {
    navn: "Kenneth Mikkelsen",
    bord: 11,
    bordType: 8
  },
  {
    navn: "Lars Gaute Jørgensen",
    bord: 11,
    bordType: 8,
    pust: true
  },
  {
    navn: "Lise Valle",
    bord: 11,
    bordType: 8
  },
  {
    navn: "Nina Mikkelsen",
    bord: 11,
    bordType: 8
  },
  {
    navn: "Ole Herman Størmmesen",
    bord: 11,
    bordType: 8,
    pust: true,
    bio: "Klar for damp og dans.",
    fbUrl: "https://www.facebook.com/profile.php"
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
