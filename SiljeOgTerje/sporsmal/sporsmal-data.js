// sporsmal-data.js — spørrerunden til brudeparet.
// Hvert spørsmål: { id, tittel, hjelp?, synlighet:"felles"|"privat", type:"kort"|"lang"|"valg", forslag?:[] }
//  - synlighet "felles": objektiv bryllups-info; den andres svar kan vises som forslag/default.
//  - synlighet "privat": handler om den andre / morsom quiz; den andres svar vises ALDRI for motparten.
// Stabile id-er (kebab-case) — endre dem ikke etter at svar er lagret.
window.SPORSMAL = [
  {
    seksjon: 'Om dere',
    ikon: '💑',
    sporsmal: [
      { id: 'dato', tittel: 'Bryllupsdato', synlighet: 'felles', type: 'kort', forslag: ['22. august 2026'] },
      { id: 'sted-vielse', tittel: 'Sted for vielse', synlighet: 'felles', type: 'kort', forslag: ['Elverhøy kirke, Tromsø'] },
      { id: 'sted-fest', tittel: 'Sted for middag/fest', synlighet: 'felles', type: 'kort', forslag: ['Rødbanken, Tromsø'] },
      { id: 'tema', tittel: 'Har bryllupet et tema?', synlighet: 'felles', type: 'kort', forslag: ['Nei', 'Ja – '] },
      { id: 'mottes', tittel: 'Hvordan møttes dere?', synlighet: 'felles', type: 'lang' },
      { id: 'kjaerester', tittel: 'Når ble dere kjærester?', synlighet: 'felles', type: 'kort' },
      { id: 'frieri', tittel: 'Hvordan fridde du?', hjelp: 'Fortell gjerne historien!', synlighet: 'felles', type: 'lang' },
      { id: 'favorittminne', tittel: 'Hva er deres favorittminne sammen?', synlighet: 'felles', type: 'lang' },
      { id: 'huske', tittel: 'Hva ønsker dere at gjestene skal huske fra dagen?', synlighet: 'felles', type: 'lang' }
    ]
  },
  {
    seksjon: 'Om hverandre',
    ikon: '💞',
    privatHele: true,
    intro: 'Disse svarene er private — den andre får ikke se hva du skriver her. 🤫',
    sporsmal: [
      { id: 'tre-ord-silje', tittel: 'Tre ord som beskriver Silje', hjelp: 'Terje svarer 😉', synlighet: 'privat', type: 'kort' },
      { id: 'tre-ord-terje', tittel: 'Tre ord som beskriver Terje', hjelp: 'Silje svarer 😉', synlighet: 'privat', type: 'kort' },
      { id: 'sent', tittel: 'Hvem kommer oftest for sent?', synlighet: 'privat', type: 'valg', forslag: ['Silje', 'Terje', 'Begge', 'Ingen'] },
      { id: 'impulsiv', tittel: 'Hvem er mest impulsiv?', synlighet: 'privat', type: 'valg', forslag: ['Silje', 'Terje', 'Begge', 'Ingen'] },
      { id: 'middag', tittel: 'Hvem lager oftest middag?', synlighet: 'privat', type: 'valg', forslag: ['Silje', 'Terje', 'Begge', 'Ingen'] },
      { id: 'diskusjon', tittel: 'Hvem vinner en diskusjon?', synlighet: 'privat', type: 'valg', forslag: ['Silje', 'Terje', 'Begge', 'Ingen'] },
      { id: 'morsomme-fakta', tittel: 'Noen morsomme fakta om dere?', synlighet: 'privat', type: 'lang' }
    ]
  },
  {
    seksjon: 'Program',
    ikon: '📅',
    sporsmal: [
      { id: 'vielse-start', tittel: 'Når starter vielsen?', synlighet: 'felles', type: 'kort' },
      { id: 'pa-plass', tittel: 'Når bør gjestene være på plass?', synlighet: 'felles', type: 'kort' },
      { id: 'tid-vielse', tittel: 'Tidspunkt: vielse', synlighet: 'felles', type: 'kort' },
      { id: 'tid-foto', tittel: 'Tidspunkt: fotografering', synlighet: 'felles', type: 'kort' },
      { id: 'tid-aperitiff', tittel: 'Tidspunkt: aperitiff', synlighet: 'felles', type: 'kort' },
      { id: 'tid-middag', tittel: 'Tidspunkt: middag', synlighet: 'felles', type: 'kort' },
      { id: 'tid-kaffe', tittel: 'Tidspunkt: kaffe og kaker', synlighet: 'felles', type: 'kort' },
      { id: 'tid-fest', tittel: 'Tidspunkt: fest', synlighet: 'felles', type: 'kort' },
      { id: 'tid-nattmat', tittel: 'Tidspunkt: nattmat', synlighet: 'felles', type: 'kort' },
      { id: 'fest-slutt', tittel: 'Når forventer dere at festen avsluttes?', synlighet: 'felles', type: 'kort' }
    ]
  },
  {
    seksjon: 'Praktisk informasjon',
    ikon: '📍',
    sporsmal: [
      { id: 'adresse-vielse', tittel: 'Adresse til vielse', synlighet: 'felles', type: 'kort' },
      { id: 'adresse-fest', tittel: 'Adresse til festlokale', synlighet: 'felles', type: 'kort' },
      { id: 'kartlenker', tittel: 'Kartlenker (Google Maps e.l.)', synlighet: 'felles', type: 'lang' },
      { id: 'parkering', tittel: 'Hvor kan gjestene parkere?', synlighet: 'felles', type: 'lang' },
      { id: 'parkering-gratis', tittel: 'Er parkeringen gratis?', synlighet: 'felles', type: 'valg', forslag: ['Ja', 'Nei', 'Vet ikke'] },
      { id: 'parkering-begrenset', tittel: 'Begrenset antall plasser?', synlighet: 'felles', type: 'valg', forslag: ['Ja', 'Nei', 'Vet ikke'] },
      { id: 'transport-tilbys', tittel: 'Tilbys transport?', synlighet: 'felles', type: 'valg', forslag: ['Ja', 'Nei', 'Vet ikke'] },
      { id: 'taxi', tittel: 'Anbefalte taxinummer?', synlighet: 'felles', type: 'kort' },
      { id: 'buss', tittel: 'Bussholdeplasser i nærheten?', synlighet: 'felles', type: 'lang' },
      { id: 'hoteller', tittel: 'Anbefalte hoteller?', synlighet: 'felles', type: 'lang' },
      { id: 'rabattkode', tittel: 'Rabattkode eller avtale?', synlighet: 'felles', type: 'kort' },
      { id: 'avstand', tittel: 'Avstand fra overnatting til lokalet?', synlighet: 'felles', type: 'kort' }
    ]
  },
  {
    seksjon: 'Dresscode',
    ikon: '👔',
    sporsmal: [
      { id: 'dresscode', tittel: 'Hva er dresscoden?', synlighet: 'felles', type: 'valg', forslag: ['Mørk dress', 'Smoking', 'Bunad', 'Pen/lang kjole', 'Sommerlig pent', 'Fritt'] },
      { id: 'dresscode-praksis', tittel: 'Hva betyr dette i praksis?', synlighet: 'felles', type: 'lang' },
      { id: 'dress', tittel: 'Bør gjester ha dress?', synlighet: 'felles', type: 'valg', forslag: ['Ja', 'Nei', 'Vet ikke'] },
      { id: 'smoking', tittel: 'Bør gjester ha smoking?', synlighet: 'felles', type: 'valg', forslag: ['Ja', 'Nei', 'Vet ikke'] },
      { id: 'bunad', tittel: 'Er bunad passende?', synlighet: 'felles', type: 'valg', forslag: ['Ja', 'Nei', 'Vet ikke'] },
      { id: 'lang-kjole', tittel: 'Bør damer ha lang kjole?', synlighet: 'felles', type: 'valg', forslag: ['Ja', 'Nei', 'Vet ikke'] },
      { id: 'vaer', tittel: 'Noe å ta hensyn til med vær eller underlag?', synlighet: 'felles', type: 'lang' }
    ]
  },
  {
    seksjon: 'Mat og drikke',
    ikon: '🍽️',
    sporsmal: [
      { id: 'forrett', tittel: 'Forrett', synlighet: 'felles', type: 'kort' },
      { id: 'hovedrett', tittel: 'Hovedrett', synlighet: 'felles', type: 'kort' },
      { id: 'dessert', tittel: 'Dessert', synlighet: 'felles', type: 'kort' },
      { id: 'kake', tittel: 'Kake', synlighet: 'felles', type: 'kort' },
      { id: 'allergier', tittel: 'Hvilke allergier håndteres?', synlighet: 'felles', type: 'lang' },
      { id: 'allergi-kontakt', tittel: 'Hvem kontaktes ved spesielle behov / allergier?', synlighet: 'felles', type: 'kort' },
      { id: 'vinpakke', tittel: 'Vinpakke?', synlighet: 'felles', type: 'valg', forslag: ['Ja', 'Nei', 'Vet ikke'] },
      { id: 'bar', tittel: 'Bar tilgjengelig?', synlighet: 'felles', type: 'valg', forslag: ['Ja', 'Nei', 'Vet ikke'] },
      { id: 'alkoholfritt', tittel: 'Mulighet for alkoholfritt?', synlighet: 'felles', type: 'valg', forslag: ['Ja', 'Nei', 'Vet ikke'] }
    ]
  },
  {
    seksjon: 'Gaver',
    ikon: '🎁',
    sporsmal: [
      { id: 'onskeliste', tittel: 'Har dere ønskeliste?', synlighet: 'felles', type: 'valg', forslag: ['Ja', 'Nei', 'Vet ikke'] },
      { id: 'onskeliste-hvor', tittel: 'Hvor finner gjestene den?', synlighet: 'felles', type: 'kort' },
      { id: 'pengegave', tittel: 'Ønsker dere pengegave?', synlighet: 'felles', type: 'valg', forslag: ['Ja', 'Nei', 'Vet ikke'] },
      { id: 'bryllupsreise', tittel: 'Bidrag til bryllupsreise?', synlighet: 'felles', type: 'valg', forslag: ['Ja', 'Nei', 'Vet ikke'] },
      { id: 'gave-annet', tittel: 'Annen informasjon om gaver?', synlighet: 'felles', type: 'lang' }
    ]
  },
  {
    seksjon: 'Gjestene',
    ikon: '👥',
    sporsmal: [
      { id: 'rsvp-frist', tittel: 'Frist for å svare (RSVP)', synlighet: 'felles', type: 'kort' },
      { id: 'rsvp-kontakt', tittel: 'Kontaktperson ved spørsmål', synlighet: 'felles', type: 'kort' },
      { id: 'bordplassering', tittel: 'Skal bordplassering publiseres i appen?', synlighet: 'felles', type: 'valg', forslag: ['Ja', 'Nei', 'Vet ikke'] },
      { id: 'barn-invitert', tittel: 'Er barn invitert?', synlighet: 'felles', type: 'valg', forslag: ['Ja', 'Nei', 'Vet ikke'] },
      { id: 'barn-aktiviteter', tittel: 'Finnes det egne aktiviteter for barn?', synlighet: 'felles', type: 'lang' }
    ]
  },
  {
    seksjon: 'Taler og innslag',
    ikon: '🎤',
    sporsmal: [
      { id: 'toast-navn', tittel: 'Toastmaster – navn', synlighet: 'felles', type: 'kort', forslag: ['Maja Wilhelmsen', 'Thomas Helge Hansen'] },
      { id: 'toast-tlf', tittel: 'Toastmaster – telefon', synlighet: 'felles', type: 'kort' },
      { id: 'toast-epost', tittel: 'Toastmaster – e-post', synlighet: 'felles', type: 'kort', forslag: ['majawilhelmsen@hotmail.com', 'thomas.helge@gmail.com'] },
      { id: 'tale-melde', tittel: 'Hvordan melder man inn tale?', synlighet: 'felles', type: 'lang' },
      { id: 'tale-frist', tittel: 'Frist for å kontakte toastmaster?', synlighet: 'felles', type: 'kort' },
      { id: 'andre-innslag', tittel: 'Er andre innslag tillatt?', synlighet: 'felles', type: 'valg', forslag: ['Ja', 'Nei', 'Vet ikke'] }
    ]
  },
  {
    seksjon: 'Bilder',
    ikon: '📸',
    sporsmal: [
      { id: 'bilde-opplasting', tittel: 'Hvor skal gjestene laste opp bilder?', synlighet: 'felles', type: 'kort' },
      { id: 'qr-album', tittel: 'QR-kode til album?', synlighet: 'felles', type: 'valg', forslag: ['Ja', 'Nei', 'Vet ikke'] },
      { id: 'bilde-tjeneste', tittel: 'Hvilken tjeneste brukes?', synlighet: 'felles', type: 'valg', forslag: ['OneDrive', 'Google Photos', 'Dropbox', 'Annen'] },
      { id: 'hashtag', tittel: 'Egen hashtag?', synlighet: 'felles', type: 'kort' },
      { id: 'deling-offentlig', tittel: 'Ønsker dere at gjestene deler bilder offentlig?', synlighet: 'felles', type: 'valg', forslag: ['Ja', 'Nei', 'Vet ikke'] }
    ]
  },
  {
    seksjon: 'Hilsen til gjestene',
    ikon: '💌',
    sporsmal: [
      { id: 'velkomsttekst', tittel: 'Velkomsttekst fra brudeparet', synlighet: 'felles', type: 'lang' },
      { id: 'takk', tittel: 'Takk for at gjestene kommer', synlighet: 'felles', type: 'lang' },
      { id: 'onsker-dagen', tittel: 'Eventuelle ønsker for dagen', synlighet: 'felles', type: 'lang' }
    ]
  },
  {
    seksjon: 'Quiz om brudeparet',
    ikon: '🎉',
    privatHele: true,
    intro: 'Fasit til quizen — svar slik DU mener det er. Privat, så den andre ikke ser fasiten din. 😄',
    sporsmal: [
      { id: 'quiz-elsker-deg', tittel: 'Hvem sa "jeg elsker deg" først?', synlighet: 'privat', type: 'valg', forslag: ['Silje', 'Terje'] },
      { id: 'quiz-forste-date', tittel: 'Hvor var første date?', synlighet: 'privat', type: 'kort' },
      { id: 'quiz-telefon', tittel: 'Hvem bruker mest tid på telefonen?', synlighet: 'privat', type: 'valg', forslag: ['Silje', 'Terje'] },
      { id: 'quiz-konkurranse', tittel: 'Hvem er mest konkurranselysten?', synlighet: 'privat', type: 'valg', forslag: ['Silje', 'Terje'] },
      { id: 'quiz-sist-opp', tittel: 'Hvem står sist opp?', synlighet: 'privat', type: 'valg', forslag: ['Silje', 'Terje'] },
      { id: 'quiz-mat', tittel: 'Hvem er best til å lage mat?', synlighet: 'privat', type: 'valg', forslag: ['Silje', 'Terje'] },
      { id: 'quiz-frieri-sted', tittel: 'Hvor gikk frieriet for seg?', synlighet: 'privat', type: 'kort' },
      { id: 'quiz-sang', tittel: 'Hva er deres "vår sang"?', synlighet: 'privat', type: 'kort' },
      { id: 'quiz-rydder', tittel: 'Hvem rydder mest?', synlighet: 'privat', type: 'valg', forslag: ['Silje', 'Terje'] },
      { id: 'quiz-reise', tittel: 'Drømmedestinasjon for bryllupsreise?', synlighet: 'privat', type: 'kort' },
      { id: 'quiz-lokale', tittel: 'Hvem valgte bryllupslokalet?', synlighet: 'privat', type: 'valg', forslag: ['Silje', 'Terje', 'Begge'] },
      { id: 'quiz-film', tittel: 'Felles favorittfilm/serie?', synlighet: 'privat', type: 'kort' }
    ]
  },
  {
    seksjon: 'Nødkontakter',
    ikon: '📞',
    sporsmal: [
      { id: 'nod-toast', tittel: 'Toastmaster (navn + telefon)', synlighet: 'felles', type: 'kort' },
      { id: 'nod-forlover-silje', tittel: 'Forlover Silje', synlighet: 'felles', type: 'kort', forslag: ['Hege Lauritzen', 'Ann Sissel Christoffersen'] },
      { id: 'nod-forlover-terje', tittel: 'Forlover Terje', synlighet: 'felles', type: 'kort', forslag: ['Vegard Lund Aspen', 'Mikal Johnsen', 'Ole Nicolai S. Aarbakke'] },
      { id: 'nod-ansvarlig', tittel: 'Praktisk ansvarlig på lokasjonen (navn + telefon)', synlighet: 'felles', type: 'kort' }
    ]
  },
  {
    seksjon: 'FAQ',
    ikon: '❓',
    intro: 'Skriv svaret dere ønsker å gi på vanlige spørsmål fra gjestene.',
    sporsmal: [
      { id: 'faq-barn', tittel: 'Kan jeg ta med barn?', synlighet: 'felles', type: 'lang' },
      { id: 'faq-tale', tittel: 'Kan jeg holde tale?', synlighet: 'felles', type: 'lang' },
      { id: 'faq-parkering', tittel: 'Hvor parkerer jeg?', synlighet: 'felles', type: 'lang' },
      { id: 'faq-kun-fest', tittel: 'Kan jeg komme kun til festen?', synlighet: 'felles', type: 'lang' },
      { id: 'faq-dagen-etter', tittel: 'Hva skjer dagen etter?', synlighet: 'felles', type: 'lang' },
      { id: 'faq-andre', tittel: 'Andre spørsmål dere ofte får?', synlighet: 'felles', type: 'lang' }
    ]
  }
];
