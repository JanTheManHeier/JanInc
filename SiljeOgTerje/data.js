// ============================================================
//  Silje & Terje – Bryllup 22. august 2026
//  Data-grunnlag (DEFAULTS). Redigerbart innhold hentes fra
//  /api/siljeterje-content og overstyrer disse verdiene.
// ============================================================

const EVENT_DATO_ISO = "2026-08-22T13:00:00+02:00";

// Programmet for dagen. Tider er foreløpige – Silje & Terje
// kan endre alt selv via admin-siden.
const PROGRAM = [
  { tid: "19:00", dag: "Fredag 21. august", tittel: "Mingling kvelden før", sted: "(sted kommer)", ikon: "🍕", beskrivelse: "Uformell sammenkomst for tilreisende kvelden før bryllupet. Mer info kommer – følg med her!" },
  { tid: "13:00", dag: "Lørdag 22. august", tittel: "Vielse i Elverhøy kirke", sted: "Elverhøy kirke, Tromsø", ikon: "💒", beskrivelse: "Vi gifter oss! Møt opp i god tid – dørene åpner 12:30.", adresse: "Elverhøy kirke, Tromsø", kart: "https://maps.google.com/?q=Elverh%C3%B8y+kirke+Troms%C3%B8" },
  { tid: "14:00", tittel: "Gratulasjoner & bobler", sted: "Utenfor kirken", ikon: "🥂", beskrivelse: "Ris, klemmer og et glass til brudeparet utenfor kirken." },
  { tid: "14:30", tittel: "Fotografering", sted: "Tromsø sentrum", ikon: "📸", beskrivelse: "Brudeparet tar bilder. Gjestene forflytter seg mot festlokalet." },
  { tid: "17:00", tittel: "Mottakelse på Rødbanken", sted: "Rødbanken, Tromsø sentrum", ikon: "🏛️", beskrivelse: "Velkomstdrink og mingling i de vakre lokalene til Sparebank 1 Nord-Norge.", adresse: "Rødbanken, Tromsø sentrum", kart: "https://maps.google.com/?q=R%C3%B8dbanken+Troms%C3%B8" },
  { tid: "18:00", tittel: "Bryllupsmiddag", sted: "Rødbanken", ikon: "🍽️", beskrivelse: "Tre retter, taler og gode historier. Toastmasterne Maja & Thomas loser oss gjennom kvelden." },
  { tid: "21:00", tittel: "Kaffe, kake & første dans", sted: "Rødbanken", ikon: "💃", beskrivelse: "Bryllupskake, brudevals og åpning av dansegulvet." },
  { tid: "22:00", tittel: "Fest til langt på natt", sted: "Rødbanken", ikon: "🎶", beskrivelse: "Dans, bar og moro. Vi feirer til nattbussen går!" },
];

const GJESTER = [
  { navn: "Silje Ingebrigtsen", rolle: "Brud", bio: "Tromsø · Sykehusinnkjøp HF · Kongsbakken Videregående Skole", sted: "Tromsø", jobb: "Sykehusinnkjøp HF", utdanning: "University of Tromsø", bildeFil: "images/gjester/silje-ingebrigtsen.jpg", fbUrl: "https://www.facebook.com/profile.php?id=753975108" },
  { navn: "Terje Karlstad", rolle: "Brudgom", bio: "Tromsø · SpareBank 1 Nord-Norge · Uni. Tromsø", sted: "Tromsø", jobb: "SpareBank 1 Nord-Norge", utdanning: "Uni. Tromsø", bildeFil: "images/gjester/terje-karlstad.jpg", fbUrl: "https://www.facebook.com/profile.php?id=867125701" },
  { navn: "Maja Wilhelmsen", rolle: "Toastmaster", bio: "Tromsø · Universitetssykehuset Nord-Norge HF · Kongsbakken Videregående Skole", sted: "Tromsø", jobb: "Universitetssykehuset Nord-Norge HF", utdanning: "Universitetet i Oslo (UiO)", bildeFil: "images/gjester/maja-wilhelmsen.jpg", fbUrl: "https://www.facebook.com/profile.php?id=872035617" },
  { navn: "Thomas Helge Hansen", rolle: "Toastmaster", bio: "Tromsø · GC Rieber VivoMega", sted: "Tromsø", jobb: "GC Rieber VivoMega", utdanning: "Universitetet i tromsø", bildeFil: "images/gjester/thomas-helge-hansen.jpg", fbUrl: "https://www.facebook.com/profile.php?id=639430084" },
  { navn: "Ann Sissel Christoffersen", rolle: "Forlover", bio: "Tromsø · SpareBank 1 Nord-Norge · University of Surrey", sted: "Tromsø", jobb: "SpareBank 1 Nord-Norge", utdanning: "University of Surrey", bildeFil: "images/gjester/ann-sissel-christoffersen.jpg", fbUrl: "https://www.facebook.com/profile.php?id=872495143" },
  { navn: "Hege Lauritzen", rolle: "Forlover", bio: "Tromsø", sted: "Tromsø", bildeFil: "images/gjester/hege-lauritzen.jpg", fbUrl: "https://www.facebook.com/profile.php?id=901130111" },
  { navn: "Mikal Johnsen", rolle: "Forlover", bio: "Alta · SmartDok Norge · Tromsdalen videregående skole", sted: "Alta", jobb: "SmartDok Norge", utdanning: "Tromsdalen videregående skole", bildeFil: "images/gjester/mikal-johnsen.jpg", fbUrl: "https://www.facebook.com/profile.php?id=100034202899293" },
  { navn: "Ole Nicolai S. Aarbakke", rolle: "Forlover", bio: "Uni. Bergen", utdanning: "Uni. Bergen", bildeFil: "images/gjester/ole-nicolai-s-aarbakke.jpg", fbUrl: "https://www.facebook.com/profile.php?id=530175040" },
  { navn: "Vegard Lund Aspen", rolle: "Forlover", bio: "Tromsø · Bravida Norge · Tromsdalen Videregående Skole", sted: "Tromsø", jobb: "Bravida Norge", utdanning: "Tromsø University College", bildeFil: "images/gjester/vegard-lund-aspen.jpg", fbUrl: "https://www.facebook.com/profile.php?id=808170513" },
  { navn: "Adrian Edvardsen", bio: "Tromsø", sted: "Tromsø", bildeFil: "images/gjester/adrian-edvardsen.jpg", fbUrl: "https://www.facebook.com/profile.php?id=100047523670880" },
  { navn: "Andreas Granaas", bio: "", bildeFil: "images/gjester/andreas-granaas.jpg", fbUrl: "https://www.facebook.com/profile.php?id=792680653" },
  { navn: "Anette Ingebrigtsen", bio: "Harstad", sted: "Harstad", bildeFil: "images/gjester/anette-ingebrigtsen.jpg", fbUrl: "https://www.facebook.com/profile.php?id=540096301" },
  { navn: "Berith Olsen", bio: "Tromsø", sted: "Tromsø", bildeFil: "images/gjester/berith-olsen.jpg", fbUrl: "https://www.facebook.com/profile.php?id=100000121218332" },
  { navn: "Charlotte Marianne Hammer", bio: "Tromsø", sted: "Tromsø", bildeFil: "images/gjester/charlotte-marianne-hammer.jpg", fbUrl: "https://www.facebook.com/profile.php?id=100001658231067" },
  { navn: "Christianne B. Eilertsen", bio: "UiT Norges arktiske universitet", utdanning: "UiT Norges arktiske universitet", bildeFil: "images/gjester/christianne-b-eilertsen.jpg", fbUrl: "https://www.facebook.com/profile.php?id=600581135" },
  { navn: "Edvard Eilertsen", bio: "", bildeFil: "images/gjester/edvard-eilertsen.jpg", fbUrl: "https://www.facebook.com/profile.php?id=100086657239762" },
  { navn: "Eirik Torbergsen", bio: "Tromsø · Tromsøterminalen · Hammerfest Videregående Skole", sted: "Tromsø", jobb: "Tromsøterminalen", utdanning: "Tromsø University College", bildeFil: "images/gjester/eirik-torbergsen.jpg", fbUrl: "https://www.facebook.com/profile.php?id=628422400" },
  { navn: "Elin Andersen", bio: "", bildeFil: "images/gjester/elin-andersen.jpg", fbUrl: "https://www.facebook.com/profile.php?id=653761814" },
  { navn: "Ellen Dølvik Eliassen", bio: "Tromsø · NFH", sted: "Tromsø", utdanning: "NFH", bildeFil: "images/gjester/ellen-dolvik-eliassen.jpg", fbUrl: "https://www.facebook.com/profile.php?id=100002818676282" },
  { navn: "Else-Marie Olsen", bio: "Tønsberg · Pensjonist på heltid.", sted: "Tønsberg", jobb: "Pensjonist på heltid.", bildeFil: "images/gjester/else-marie-olsen.jpg", fbUrl: "https://www.facebook.com/profile.php?id=100001697782306" },
  { navn: "Grete Ingebrigtsen", bio: "", bildeFil: "images/gjester/grete-ingebrigtsen.jpg", fbUrl: "https://www.facebook.com/profile.php?id=100087805985545" },
  { navn: "Hege Oleanna Iversen", bio: "Tromsø", sted: "Tromsø", bildeFil: "images/gjester/hege-oleanna-iversen.jpg", fbUrl: "https://www.facebook.com/profile.php?id=665847635" },
  { navn: "Heidi Martens", bio: "", bildeFil: "images/gjester/heidi-martens.jpg", fbUrl: "https://www.facebook.com/profile.php?id=631825393" },
  { navn: "Ingrid Karlsen", bio: "Oslo · NTNU - Norges teknisk-naturvitenskapelige universitet", sted: "Oslo", utdanning: "NTNU - Norges teknisk-naturvitenskapelige universitet", bildeFil: "images/gjester/ingrid-karlsen.jpg", fbUrl: "https://www.facebook.com/profile.php?id=539927616" },
  { navn: "Jan Heier Johansen", bio: "Tromsø · Microsoft", sted: "Tromsø", jobb: "Microsoft", utdanning: "UiTø", bildeFil: "images/gjester/jan-heier-johansen.jpg", fbUrl: "https://www.facebook.com/profile.php?id=762145494" },
  { navn: "Jon Christoffersen", bio: "Tromsø · Sparebank 1 Markets · Uni. Tromsø", sted: "Tromsø", jobb: "Sparebank 1 Markets", utdanning: "Uni. Tromsø", bildeFil: "images/gjester/jon-christoffersen.jpg", fbUrl: "https://www.facebook.com/profile.php?id=673690264" },
  { navn: "Jorunn Karlstad", bio: "", bildeFil: "images/gjester/jorunn-karlstad.jpg", fbUrl: "https://www.facebook.com/profile.php?id=100028038393719" },
  { navn: "Jørn Magnus Karlsen", bio: "Tromsø", sted: "Tromsø", bildeFil: "images/gjester/jorn-magnus-karlsen.jpg", fbUrl: "https://www.facebook.com/profile.php?id=515960159" },
  { navn: "Karl Erik Thomassen", bio: "Harstad · Forsvaret", sted: "Harstad", jobb: "Forsvaret", utdanning: "Traverse City High School", bildeFil: "images/gjester/karl-erik-thomassen.jpg", fbUrl: "https://www.facebook.com/profile.php?id=607386371" },
  { navn: "Kjell G Karlsen", bio: "Tromsø", sted: "Tromsø", bildeFil: "images/gjester/kjell-g-karlsen.jpg", fbUrl: "https://www.facebook.com/profile.php?id=1516068902" },
  { navn: "Kjell Ove Haug", bio: "", bildeFil: "images/gjester/kjell-ove-haug.jpg", fbUrl: "https://www.facebook.com/profile.php?id=100003107973190" },
  { navn: "Kjerstin Johnsen", bio: "", bildeFil: "images/gjester/kjerstin-johnsen.jpg", fbUrl: "https://www.facebook.com/profile.php?id=589580279" },
  { navn: "Kristin Halvorsen", bio: "Tromsø · Tromsdalen videregående skole · UiT Norges arktiske universitet", sted: "Tromsø", jobb: "Tromsdalen videregående skole", utdanning: "UiT Norges arktiske universitet", bildeFil: "images/gjester/kristin-halvorsen.jpg", fbUrl: "https://www.facebook.com/profile.php?id=537807476" },
  { navn: "Kristina Antonsen", bio: "Tromsø · Sparebankstiftelsen SpareBank 1 Nord-Norge", sted: "Tromsø", jobb: "Sparebankstiftelsen SpareBank 1 Nord-Norge", bildeFil: "images/gjester/kristina-antonsen.jpg", fbUrl: "https://www.facebook.com/profile.php?id=100000512954145" },
  { navn: "Kristina Garfjell Kantola", bio: "", bildeFil: "images/gjester/kristina-garfjell-kantola.jpg", fbUrl: "https://www.facebook.com/profile.php?id=100054691760675" },
  { navn: "Kristina Rognmo", bio: "", bildeFil: "images/gjester/kristina-rognmo.jpg", fbUrl: "https://www.facebook.com/profile.php?id=617850637" },
  { navn: "Magnus Seppola", bio: "Tromsø", sted: "Tromsø", bildeFil: "images/gjester/magnus-seppola.jpg", fbUrl: "https://www.facebook.com/profile.php?id=672813460" },
  { navn: "Marita Haugen", bio: "UNN Åsgård · Universitetet i tromsø", sted: "Tromsø", jobb: "UNN Åsgård", utdanning: "Universitetet i tromsø", bildeFil: "images/gjester/marita-haugen.jpg", fbUrl: "https://www.facebook.com/profile.php?id=720385427" },
  { navn: "Merit Reiertsen", bio: "", bildeFil: "images/gjester/merit-reiertsen.jpg", fbUrl: "https://www.facebook.com/profile.php?id=685555560" },
  { navn: "Per Johnny Olsen", bio: "Tromsø", sted: "Tromsø", bildeFil: "images/gjester/per-johnny-olsen.jpg", fbUrl: "https://www.facebook.com/profile.php?id=603927524" },
  { navn: "Pernille Vebostad", bio: "Harstad", sted: "Harstad", jobb: "FC Barcelona", bildeFil: "images/gjester/pernille-vebostad.jpg", fbUrl: "https://www.facebook.com/profile.php?id=100075535900516" },
  { navn: "Ragnhild Lettrem Olsen", bio: "Kvaløysletta helsestasjon", jobb: "Kvaløysletta helsestasjon", bildeFil: "images/gjester/ragnhild-lettrem-olsen.jpg", fbUrl: "https://www.facebook.com/profile.php?id=588281926" },
  { navn: "Renate Elida Haug", bio: "Biopat www.renatehaug.no · Urtemedisin www.herbateket.no · Sjamanisme www.brsingamen.no", sted: "Ytre Enebakk", jobb: "Renate Elida Haug", utdanning: "Steinerhøyskolen", bildeFil: "images/gjester/renate-elida-haug.jpg", fbUrl: "https://www.facebook.com/profile.php?id=586771419" },
  { navn: "Silje Helèn", bio: "TUIL Treningssenter", jobb: "TUIL Treningssenter", bildeFil: "images/gjester/silje-hel-n.jpg", fbUrl: "https://www.facebook.com/profile.php?id=748735855" },
  { navn: "Silje-Kristin Jensen", bio: "Tromsø · Fiskeridirektoratet · UiT Norges arktiske universitet", sted: "Tromsø", jobb: "Fiskeridirektoratet", utdanning: "University of St Andrews", bildeFil: "images/gjester/silje-kristin-jensen.jpg", fbUrl: "https://www.facebook.com/profile.php?id=607171186" },
  { navn: "Siri Jaklin", bio: "Tromsø · Kongsberg Satellite Services AS · Universitetet i tromsø", sted: "Tromsø", jobb: "Kongsberg Satellite Services AS", utdanning: "Universitetet i tromsø", bildeFil: "images/gjester/siri-jaklin.jpg", fbUrl: "https://www.facebook.com/profile.php?id=895880456" },
  { navn: "Sissel Maria Myrnes Karlstad", bio: "Tromsø · Universitetssykehuset Nord-Norge HF · University of Tromsø", sted: "Tromsø", jobb: "Dagkirurgen", utdanning: "University of Tromsø", bildeFil: "images/gjester/sissel-maria-myrnes-karlstad.jpg", fbUrl: "https://www.facebook.com/profile.php?id=546183029" },
  { navn: "Siv Sofie Vian", bio: "", bildeFil: "images/gjester/siv-sofie-vian.jpg", fbUrl: "https://www.facebook.com/profile.php?id=693445398" },
  { navn: "Siv-Cathrine Torbergsen", bio: "Tromsø · Domstein · Norges Fiskerihøgskole", sted: "Tromsø", jobb: "Domstein", utdanning: "Norges Fiskerihøgskole (1999–2006)", bildeFil: "images/gjester/siv-cathrine-torbergsen.jpg", fbUrl: "https://www.facebook.com/profile.php?id=624157521" },
  { navn: "Sofie Ingebrigtsen", bio: "Grand Commander🕊️ · Bruce McLaren & Andrea Stella❤️ · Harstad", sted: "Harstad", bildeFil: "images/gjester/sofie-ingebrigtsen.jpg", fbUrl: "https://www.facebook.com/profile.php?id=100037134136196" },
  { navn: "Stian Simonsen", bio: "Frydenlund Videregående Skole · UiT Norges arktiske universitet i Narvik", sted: "Tromsø", utdanning: "UiT Norges arktiske universitet i Narvik", bildeFil: "images/gjester/stian-simonsen.jpg", fbUrl: "https://www.facebook.com/profile.php?id=100001057641022" },
  { navn: "Stine Smith Ingebrigtsen", bio: "Tromsø", sted: "Tromsø", bildeFil: "images/gjester/stine-smith-ingebrigtsen.jpg", fbUrl: "https://www.facebook.com/profile.php?id=572805559" },
  { navn: "Thomas Karlsen", bio: "Tromsø · Utsikten Borettslag", sted: "Tromsø", jobb: "Utsikten Borettslag", bildeFil: "images/gjester/thomas-karlsen.jpg", fbUrl: "https://www.facebook.com/profile.php?id=550117040" },
  { navn: "Tina Nikolaisen", bio: "Tromsø · Universitetssykehuset Nord-Norge HF · Uni. Tromsø", sted: "Tromsø", jobb: "Universitetssykehuset Nord-Norge HF", utdanning: "Uni. Tromsø", bildeFil: "images/gjester/tina-nikolaisen.jpg", fbUrl: "https://www.facebook.com/profile.php?id=883980480" },
  { navn: "Tone Christin Nilsen", bio: "Tromsø", sted: "Tromsø", bildeFil: "images/gjester/tone-christin-nilsen.jpg", fbUrl: "https://www.facebook.com/profile.php?id=903705000" },
  { navn: "Tore Arnesen", bio: "Tromsø · Nordkjosbotn videregående skole / Gárgána joatkkaskuvla · Bardufoss vgs", sted: "Tromsø", jobb: "Kvaløya Videregående Skole", utdanning: "Uni. Tromsø", bildeFil: "images/gjester/tore-arnesen.jpg", fbUrl: "https://www.facebook.com/profile.php?id=648333571" },
  { navn: "Trond-Bjørnar Pedersen", bio: "Tromsø · University of Tromsø", sted: "Tromsø", utdanning: "University of Tromsø", bildeFil: "images/gjester/trond-bjornar-pedersen.jpg", fbUrl: "https://www.facebook.com/profile.php?id=834390602" },
];


// Sang-tekster. To sanger spilles på festen:
//   1) Siljes utdrikningslags-sang  2) "Den siste villhingsten" (Terjes utdrikningslag)
const SANG1_TITTEL = "Sangen til Silje";
const SANG1_FIL = "audio/silje.mp3";
const SANG1_LYRICS = `🎵 SANGEN TIL SILJE 🎵

Laget med kjærlighet til Siljes utdrikningslag.
Trykk på spilleren over og syng med – jentegjengen kan teksten!`;

const SANG2_TITTEL = "Den siste villhingsten";
const SANG2_FIL = "audio/den-siste-villhingsten.mp3";
const SANG2_LYRICS = `🐎 DEN SISTE VILLHINGSTEN 🐎

Terjes hyllest fra utdrikningslaget i Warszawa.
Nå er villhingsten temmet – Silje sa ja!
Trykk play og skål for brudgommen. 🥂`;

// Bakoverkompatibel alias (sang-siden viser begge)
const SANGER_LYRICS = SANG1_LYRICS;


// Bord-tema: hvert bord oppkalt etter en fjelltopp rundt Tromsø.
const BORD_TEMA = {
  1:  { fjell: 'Hamperokken',     hoyde: 1404, hvor: 'Ullsfjorden',  farge: '#8A6420', url: 'https://kugo.no/2011/07/hamperokken-1404-moh/' },
  2:  { fjell: 'Tromsdalstinden', hoyde: 1238, hvor: 'Tromsdalen',   farge: '#A07828', url: 'https://kugo.no/2015/04/tromsdalstinden-1238-moh-3/' },
  3:  { fjell: 'Fløya',            hoyde: 671,  hvor: 'Tromsøya (Sherpatrappa)', farge: '#9C7A3C', url: 'https://kugo.no/2022/11/floya-671-sherpatrappa/' },
  4:  { fjell: 'Steinskartinden',  hoyde: 817,  hvor: 'Kvaløya, Kattfjordeidet', farge: '#7E6230', url: 'https://kugo.no/2020/05/steinskartinden-817-moh/' },
  5:  { fjell: 'Store Blåmann',    hoyde: 1044, hvor: 'Kvaløya',      farge: '#8A6420', url: 'https://kugo.no/2011/09/store-blamann-1044-moh/' },
  6:  { fjell: 'Skamtinden',       hoyde: 884,  hvor: 'Kvaløya, Ersfjorden', farge: '#A07828', url: 'https://kugo.no/2012/10/skamtinden-884-moh/' },
  7:  { fjell: 'Daltinden',        hoyde: 1533, hvor: 'Lyngsalpene, Furuflaten', farge: '#9C7A3C', url: 'https://kugo.no/2010/03/daltinden1533/' },
  8:  { fjell: 'Store Kjølen',     hoyde: 668,  hvor: 'Tromsøya', farge: '#7E6230', url: 'https://kugo.no/' },
  9:  { fjell: 'Skitntinden',      hoyde: 1042, hvor: 'Kvaløya, Kattfjordeidet', farge: '#8A6420', url: 'https://kugo.no/2011/04/skitntinden-1042-moh/' },
  10: { fjell: 'Blåskredtinden',   hoyde: 785,  hvor: 'Kvaløya, Nordfjordbotn', farge: '#A07828', url: 'https://kugo.no/2012/10/blaskredtinden-785-moh/' },
  11: { fjell: 'Styrmannstinden',  hoyde: 955,  hvor: 'Kvaløya, Vågbotn', farge: '#9C7A3C', url: 'https://kugo.no/2014/06/styrmannstinden-955-moh-2/' },
  12: { fjell: 'Bønntuva',         hoyde: 689,  hvor: 'Kvaløya, Ersfjorden', farge: '#7E6230', url: 'https://kugo.no/' },
};


// Quiz: "Hvor godt kjenner du Silje & Terje?"
const SPILL_QUIZ = [
  { spm: "I hvilken kirke gifter Silje & Terje seg?", valg: ["Tromsø domkirke", "Elverhøy kirke", "Ishavskatedralen", "Kvaløya kirke"], svar: 1, fasit: "Elverhøy kirke i Tromsø! 💒" },
  { spm: "Hvor holdes bryllupsfesten?", valg: ["Rødbanken", "Clarion The Edge", "Rica Ishavshotel", "Rorbua"], svar: 0, fasit: "Rødbanken – Sparebank 1 Nord-Norge sine vakre lokaler i sentrum. 🏛️" },
  { spm: "Hvem er toastmastere i bryllupet?", valg: ["Hege & Ann Sissel", "Maja & Thomas", "Vegard & Mikal", "Ole & Jan"], svar: 1, fasit: "Maja Wilhelmsen & Thomas Helge Hansen. 🎤" },
  { spm: "Hva het Terjes utdrikningslags-sang?", valg: ["Kongen av Tromsø", "Den siste villhingsten", "Nordlysmannen", "Brudgommen"], svar: 1, fasit: "Den siste villhingsten – fra turen til Warszawa! 🐎" },
  { spm: "Hvor jobber Silje?", valg: ["UNN", "Sykehusinnkjøp HF", "SpareBank 1", "Fiskeridirektoratet"], svar: 1, fasit: "Sykehusinnkjøp HF. 💼" },
  { spm: "Hvor jobber Terje?", valg: ["SpareBank 1 Nord-Norge", "GC Rieber", "Bravida", "SmartDok"], svar: 0, fasit: "SpareBank 1 Nord-Norge. 🏦" },
  { spm: "Hvor mange forlovere har Terje?", valg: ["1", "2", "3", "4"], svar: 2, fasit: "Tre! Vegard, Mikal og Ole. 🤵" },
  { spm: "Hvilken dato er bryllupet?", valg: ["22. juli 2026", "22. august 2026", "12. august 2026", "2. august 2026"], svar: 1, fasit: "22. august 2026 – en dag å huske! 💍" },
  { spm: "Hvem fridde til hvem?", valg: ["Terje fridde", "Silje fridde", "Samtidig", "Det er en hemmelighet"], svar: 0, fasit: "Terje fridde – på Siljes bursdag, ved gapahuken! 💍" },
  { spm: "Hvor reiser brudeparet på bryllupsreise?", valg: ["Syden", "Nordlys-safari", "Storbyferie", "Det er hemmelig"], svar: null, fasit: "Diskuter rundt bordet – kanskje de avslører det i talen!" },
  { spm: "Hvem av brudeparet kommer oftest for sent?", valg: ["Silje", "Terje", "Begge", "Ingen vil innrømme det"], svar: 0, fasit: "Ifølge Terje: Silje! ⏰" },
  { spm: "Hvem er mest impulsiv?", valg: ["Silje", "Terje", "Begge", "Umulig å si"], svar: 1, fasit: "Terje – ifølge ham selv! 🎲" },
  { spm: "Hvem lager oftest middag?", valg: ["Silje", "Terje", "De deler likt", "Take-away"], svar: 0, fasit: "Silje står for mest matlaging. 🍳" },
  { spm: "Hvem vinner som regel en diskusjon?", valg: ["Silje", "Terje", "Uavgjort", "Katten"], svar: 0, fasit: "Silje – ingen overraskelse der! 😄" },
];

// Åpne diskusjonsspørsmål for bordet (uten fasit)
const SPILL_SPØRSMÅL = [
  "Beskriv Silje med tre ord – bordet stemmer!",
  "Beskriv Terje med tre ord – bordet stemmer!",
  "Hvor og når møttes Silje & Terje første gang? Gjett!",
  "Hva er den fineste minnet ditt med brudeparet?",
  "Hvem av de to er mest morgenfugl?",
  "Hva blir Silje & Terjes største krangel – kart eller playliste?",
  "Hvilken sang åpner de dansegulvet med?",
  "Hva ønsker du brudeparet de neste 50 årene?",
  "Hvem ved bordet har kjent brudeparet lengst?",
  "Hva tror du Terje sa da Silje sa ja?",
];

const TOASTMASTER_EPOST = "majawilhelmsen@hotmail.com, thomas.helge@gmail.com";

// Om brudeparet (valgfritt – kan redigeres i admin)
const OM_PARET = {
  brud: { navn: "Silje Ingebrigtsen", by: "Tromsø", jobb: "Sykehusinnkjøp HF" },
  brudgom: { navn: "Terje Karlstad", by: "Tromsø", jobb: "SpareBank 1 Nord-Norge" },
  dato: "22. august 2026",
  sted: "Elverhøy kirke & Rødbanken, Tromsø",
};

// ============================================================
//  REDIGERBART INNHOLD (DEFAULTS)
//  Silje & Terje kan endre alt dette selv via admin-siden.
//  Appen henter overstyringer fra /api/siljeterje-content.
// ============================================================

// Forsidetekster
const HERO = {
  brud: "Silje",
  brudgom: "Terje",
  datoTekst: "Lørdag 22. august 2026",
  stedTekst: "Elverhøy kirke & Rødbanken · Tromsø",
  tagline: "Vi gifter oss! 💍",
  omTittel: "Om dagen",
  omTekst: "Silje og Terje gifter seg! Vi feirer dagen sammen med dere – fra vielsen i vakre Elverhøy kirke til en kveld med god mat, varme taler og dans på Rødbanken midt i Tromsø sentrum. Velkommen til en dag vi aldri vil glemme. ❤️",
  kleskode: "Dress / lang kjole – bunad er også fint. Ta gjerne med et varmt ytterplagg til Tromsø-været.",
};

// Om brudeparet / forlovelseshistorien
const OMOSS = {
  tittel: "Om oss",
  tekst: "Silje og Terje møttes på jobb på Matservice. Terje var 13 år, og Silje var «ho søte, men litt eldre jenta i fruktdisken». Det krevde noen års hardt arbeid å vinne hennes fulle oppmerksomhet – men 14. februar 2004 ble de kjærester. Siden har de bygget livet sitt sammen i Tromsø. 💛",
  forlovelse: "Det var Silje sin bursdag i desember 2025. Silje hadde bare ett ønske – et besøk på favorittrestauranten. Dagen før ringte Terje restauranten mens Silje hørte på; de var «selvsagt fullbooket», og skuffelsen ble tydelig i ansiktet hennes. Det hun ikke visste, var at Terje hadde booket bord der flere uker i forveien. På selve bursdagen var planen en tur til gapahuken 1,5 km hjemmefra. Snøen, som hadde vært perfekt noen dager før, var nå blitt råtten av mildværet – Lilly løp lett oppå, mens de voksne gikk gjennom. Stemningen sank, og Silje ble etter hvert helt stille og la seg et stykke bak de andre. Terje slet med en svær sekk (fylt med vannflasker og en dyne, så det skulle se ut som en tung gave), og ba Silje snu seg bort mens han, Iver og Lilly gjorde «pakken» klar. Og der, ved gapahuken, ble det et ja. 💍",
};

// Ekstra info nederst på meny-siden (allergener, vegetar osv.)
const MENYINFO = [
  "🌿 Vegetar / vegansk alternativ finnes – si fra ved RSVP",
  "⚠️ Allergener? Gi beskjed til toastmasterne i god tid",
  "💧 Vann til alle bord",
];

// Praktisk info (program-siden)
const PRAKTISK = [
  "👗 Kleskode: dress / lang kjole – bunad er også fint",
  "⛪ Vielse: Elverhøy kirke, Barduvegen 16, 9012 Tromsø – kom i god tid",
  "🥂 Fest: Rødbanken, Storgata 65, 9008 Tromsø",
  "🅿️ Parkering i Tromsø-tunnelen (avgift)",
  "🚕 Taxi: 03011",
  "🏨 Overnatting i nærheten: The Dock 69°39 (Scandic) eller Clarion The Edge – 200–500 m unna",
  "🍷 Vinpakke, bar og alkoholfritt alternativ til middagen",
  "🧒 Barna får fri denne dagen – festen er for de voksne",
  "📷 Last opp bilder i Minneboken – QR-kode til felles album",
];

// Kveldens meny – placeholder, brudeparet redigerer selv i admin
const MENY = [
  { tag: "VELKOMST", ikon: "🥂", tittel: "Velkomstdrink", beskrivelse: "Bobler og alkoholfritt alternativ ved ankomst Rødbanken.", drikke: ["🥂 Champagne / prosecco", "🍎 Alkoholfri cider"] },
  { tag: "FORRETT", ikon: "🐟", tittel: "Forrett", beskrivelse: "Nordnorsk forrett – detaljer kommer.", drikke: ["🍷 Hvitvin", "💧 Vann"] },
  { tag: "HOVEDRETT", ikon: "🍽️", tittel: "Hovedrett", beskrivelse: "Hovedrett – detaljer kommer.", drikke: ["🍷 Rødvin", "🍺 Øl"] },
  { tag: "DESSERT", ikon: "🎂", tittel: "Bryllupskake & kaffe", beskrivelse: "Kake, kaffe og avec.", drikke: ["☕ Kaffe / te", "🥃 Avec"] },
];

// Gaveønske / spleis
const GAVE = {
  tittel: "Gaveønske",
  intro: "Den største gaven er at dere feirer dagen sammen med oss. Ønsker du likevel å gi noe, setter vi stor pris på et bidrag til bryllupsreisen vår. 💕",
  onsker: [
    "✈️ Bidrag til bryllupsreisen",
    "💌 En hilsen eller et godt minne",
  ],
  vipps: "",
  vippsTekst: "Vipps til brudeparet (legges inn av Silje & Terje)",
  spleisUrl: "",
  konto: "",
};
