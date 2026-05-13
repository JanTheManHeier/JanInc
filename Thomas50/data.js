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
    adresse: "Søndre Tollbodgate 5, Tromsø",
    kart: "https://maps.google.com/?q=Pust+badstue+Tromsø",
    farge: "#E8A87C",
    lat: 69.6478,
    lng: 18.9626,
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
    lat: 69.6499,
    lng: 18.9587,
  },
  {
    id: "bakrommet",
    tid: "22:00 – 02:30",
    sted: "Bakrommet på Amtmandens",
    ikon: "🎶",
    beskrivelse: "Vi går i samla tropp til Bakrommet. Aggie Frost spiller, og vi har hele lokalet til stengetid ca 02:30.",
    adresse: "Grønnegata 81, Tromsø",
    kart: "https://maps.google.com/?q=Amtmandens+Tromsø",
    farge: "#C8A0D8",
    lat: 69.6494,
    lng: 18.9591,
  },
];

// Gjester hentet fra FB-event-kommentarer + Messenger-spleisegruppe
// Kort biografi er placeholder — kan oppdateres manuelt eller via LinkedIn-søk
const GJESTER = [
  // Pust + fest (kommentert "Pust" på badstue-posten)
  { navn: "Lars Hadsel Hansen", pust: true, plus: 0, bio: "Skal gjøre alt han kan for å komme på feiringa." },
  { navn: "Cathrine Marie Giæver", pust: true, plus: 0, bio: "Terningkast 6 for tidlig beskjed — gleder seg!" },
  { navn: "Hilde Sander Meling", pust: true, plus: 1, bio: "Pust for både Ivar og henne selv.", folge: "Ivar Wulff" },
  { navn: "Silje Ingebrigtsen", pust: true, plus: 0, bio: "Klar for badstue og fest." },
  { navn: "Ole-Herman Strømmesen", pust: true, plus: 0, bio: "Klar for damp og dans." },
  { navn: "Marianne Bille", pust: true, plus: 1, bio: "Pust for Øyvind og henne selv — gleder seg!", folge: "Øyvind Grinde" },
  { navn: "Kristina Garfjell Kantola", pust: true, plus: 0, bio: "Sammen med Jan på fest og Pust." },
  { navn: "Andreas Willumsen", pust: true, plus: 0, bio: "Pust 🔥" },
  { navn: "Jan Heier Johansen", pust: true, plus: 1, bio: "Bursdagsapp-bygger og venn av Thomas. Sammen med Kristina.", folge: "Kristina" },
  { navn: "Geir-Olav Skogstad", pust: true, plus: 1, bio: "Pust x 2 — kommer med følge." },
  { navn: "Terje Karlstad", pust: true, plus: 1, bio: "Nydelig initiativ — er med! Kommer kanskje med Silje." },
  { navn: "Bjarte Kristoffersen", pust: true, plus: 1, bio: "Initiativtaker for spleis. Pust med +1 hvis følget puster." },
  { navn: "Maria Christina Edwall", pust: true, plus: 0, bio: "Klar for Pust 💦" },
  { navn: "Jon Steinar Engenes", pust: true, plus: 0, bio: "Pust! ❄️" },
  { navn: "Rune Myreng", pust: true, plus: 1, bio: "Sammen med Line på Pust og fest.", folge: "Line Myreng" },
  { navn: "Ørjan Berg Karlsen", pust: true, plus: 0, bio: "Pust 😍" },
  { navn: "Marianne Svorken", pust: true, plus: 0, bio: "Klar for Pust og fest." },
  { navn: "Marit Osima", pust: true, plus: 1, bio: "Pust med +1." },
  { navn: "Nina Bjæring Brox", pust: true, plus: 1, bio: "Pust pluss 1 (Hans Thomas).", folge: "Hans Thomas Brox" },
  { navn: "Jon Marius Aareskjold", pust: true, plus: 1, bio: "Pust!! +1 — detta blir stas!" },
  { navn: "Arne Aarhus", pust: true, plus: 0, bio: "Pust og spleis-deltaker." },
  { navn: "Ingelill Kleivnes", pust: true, plus: 0, bio: "Pust 😍" },
  { navn: "Maja Wilhelmsen", pust: true, plus: 0, bio: "Pust 💦" },
  { navn: "Marianne Wilhelmsen", pust: false, plus: 0, bio: "🎤 Toastmaster sammen med Ronny André. Send mail til ronnyandre@gmail.com hvis du vil holde tale!", rolle: "Toastmaster" },
  { navn: "Ronny André", pust: false, plus: 0, bio: "🎤 Toastmaster sammen med Marianne. Kontakt: ronnyandre@gmail.com", rolle: "Toastmaster" },

  // Bekreftet på event-post (likes/kommentarer)
  { navn: "Lena Gustavsen Nymark", pust: false, plus: 0, bio: "Bekreftet på event-posten." },
  { navn: "Erin Mathiesen Hald", pust: false, plus: 0, bio: "Bekreftet på event-posten." },
  { navn: "Ellen Dølvik Eliassen", pust: false, plus: 0, bio: "Bekreftet på event-posten." },
  { navn: "Jan Erik Olsen", pust: false, plus: 0, bio: "Bekreftet på event-posten." },
  { navn: "Marius Furnes", pust: false, plus: 0, bio: "Bekreftet på event-posten." },

  // Spleisegruppen (festen)
  { navn: "Kjell Roger Andersen", pust: false, plus: 0, bio: "Med på spleisen til Thomas." },
  { navn: "Einar Nilsen", pust: false, plus: 0, bio: "Med på spleisen til Thomas." },
  { navn: "Odd Gunnar Ingebrigtsen", pust: false, plus: 0, bio: "Med på spleisen til Thomas." },

  // Avbud
  { navn: "Kirsten Buck Rustad", pust: false, plus: 0, bio: "Dessverre avbud — bortreist. Håper på å få feire ved en seinere anledning!", avbud: true },
];

const SANGER_LYRICS = `🎵 ENDELIG VOKSEN (KANSKJE) — Thomas på Femti 🎵
(melodi: inspirert av nordnorske viser)

Vers 1:
Han kom fra nord der fjordene er dype,
der havet synger stille mot et skjær.
Thomas — danseløva med blikk som ingen griper,
nå er det femti år som er hans her.

Refreng:
Thomas på femti, Thomas på femti!
Kjekkeste karen fra Tromsø by!
Badstue og hav og venner som er glade —
femti er bare starten, se deg ikke tilbake!

Vers 2:
Han bader på Pust, ler av kulda litt,
og smiler bredt mot Tromsøysundets glans.
Kystens Hus i hjertet, fest i hvert et blikk —
vi heier på deg, Thomas — ta en dans!

(Refreng)

Vers 3:
På Bakrommet svinger vi til Aggie Frost,
til klokka går mot to og enda mer.
Fra badstue til scene, fra glass til toast —
en kveld for danseløva, det er det vi feirer!

(Refreng)

Outro:
Skål for Thomas, skål for femti år!
🥂🌊❤️🎉
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
