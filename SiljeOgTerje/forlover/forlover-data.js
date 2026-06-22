// forlover-data.js — hemmelig spørrerunde for forloverne.
// Personer (slug må matche whitelist i api/siljeterje-forlover/index.js):
window.FORLOVER_PERSONER = [
  { slug: 'hege',       navn: 'Hege Lauritzen',           emoji: '👰', side: 'Forlover for Silje' },
  { slug: 'annsissel',  navn: 'Ann Sissel Christoffersen', emoji: '👰', side: 'Forlover for Silje' },
  { slug: 'vegard',     navn: 'Vegard Lund Aspen',        emoji: '🤵', side: 'Forlover for Terje' },
  { slug: 'mikal',      navn: 'Mikal Johnsen',            emoji: '🤵', side: 'Forlover for Terje' },
  { slug: 'olenicolai', navn: 'Ole Nicolai S. Aarbakke',  emoji: '🤵', side: 'Forlover for Terje' }
];

// Alle svar er KUN for brudeparets «hjelpere»/admin — brudeparet ser dem ikke i appen.
// Hvert spørsmål: { id, tittel, hjelp?, type:"kort"|"lang"|"valg", forslag?:[] }
window.FORLOVER_SPORSMAL = [
  {
    seksjon: 'Om deg',
    ikon: '🙋',
    intro: 'Bare så vi vet hvem som har skrevet hva. 💛',
    sporsmal: [
      { id: 'din-relasjon', tittel: 'Hvordan kjenner du brudeparet?', type: 'kort' },
      { id: 'hvor-lenge', tittel: 'Hvor lenge har dere kjent hverandre?', type: 'kort' },
      { id: 'din-rolle', tittel: 'Hva er rollen din på dagen?', type: 'valg', forslag: ['Forlover', 'Toastmaster', 'Annet'] }
    ]
  },
  {
    seksjon: 'Bli kjent',
    ikon: '✨',
    sporsmal: [
      { id: 'forste-inntrykk', tittel: 'Hva var ditt aller første inntrykk?', hjelp: 'Av den du er forlover for', type: 'lang' },
      { id: 'hvordan-mottes', tittel: 'Hvordan ble dere kjent?', type: 'lang' },
      { id: 'beskriv-tre-ord', tittel: 'Beskriv vedkommende med tre ord', type: 'kort' }
    ]
  },
  {
    seksjon: 'Personligheten',
    ikon: '🌟',
    sporsmal: [
      { id: 'beste-egenskap', tittel: 'Hva er den beste egenskapen deres?', type: 'lang' },
      { id: 'sjarmerende-uvane', tittel: 'En sjarmerende uvane eller særhet?', type: 'lang' },
      { id: 'skjult-talent', tittel: 'Et skjult talent folk ikke vet om?', type: 'lang' },
      { id: 'guilty-pleasure', tittel: 'Et «guilty pleasure» (musikk, mat, serie…)?', type: 'kort' },
      { id: 'typisk-utsagn', tittel: 'Et typisk utsagn / en signaturfrase?', type: 'kort' }
    ]
  },
  {
    seksjon: 'Paret sammen',
    ikon: '💞',
    sporsmal: [
      { id: 'nar-skjonte', tittel: 'Når skjønte du at de to var midt i blinken?', type: 'lang' },
      { id: 'hva-utfyller', tittel: 'Hvordan utfyller de hverandre?', type: 'lang' },
      { id: 'soteste', tittel: 'Det søteste du har sett dem gjøre for hverandre?', type: 'lang' },
      { id: 'hvem-bestemmer', tittel: 'Hvem bestemmer egentlig mest?', type: 'valg', forslag: ['Silje', 'Terje', 'Helt likt', 'Avhenger av saken'] }
    ]
  },
  {
    seksjon: 'Historier og anekdoter',
    ikon: '😄',
    intro: 'Gull til talene! Skriv så detaljert du orker.',
    sporsmal: [
      { id: 'beste-minne', tittel: 'Ditt beste minne med dem?', type: 'lang' },
      { id: 'morsomste', tittel: 'Den morsomste historien du har?', type: 'lang' },
      { id: 'pinlig-men-snill', tittel: 'En pinlig (men snill!) historie?', hjelp: 'Noe som tåler å fortelles i bryllup 😅', type: 'lang' },
      { id: 'most-likely', tittel: 'Mest sannsynlig til å gjøre noe spontant og sprøtt?', type: 'valg', forslag: ['Silje', 'Terje', 'Begge'] }
    ]
  },
  {
    seksjon: 'Hjelp til talen',
    ikon: '🎤',
    intro: 'Slik at toastmaster og talere kan koordinere.',
    sporsmal: [
      { id: 'holder-tale', tittel: 'Skal du holde tale?', type: 'valg', forslag: ['Ja', 'Nei', 'Vurderer det'] },
      { id: 'innsidevitser', tittel: 'Gode insider-vitser / stikkord andre kan bruke?', type: 'lang' },
      { id: 'unnga-temaer', tittel: 'Temaer man bør UNNGÅ i taler?', hjelp: 'Ekser, ømme punkter, etc.', type: 'lang' },
      { id: 'kallenavn', tittel: 'Kjælenavn eller kallenavn?', type: 'kort' }
    ]
  },
  {
    seksjon: 'Overraskelser og innslag',
    ikon: '🎁',
    sporsmal: [
      { id: 'planlegger-innslag', tittel: 'Planlegger du et innslag eller en overraskelse?', type: 'valg', forslag: ['Ja', 'Nei', ' Idé på gang'] },
      { id: 'innslag-hva', tittel: 'I så fall – hva? (så vi kan koordinere)', type: 'lang' },
      { id: 'trenger-hjelp', tittel: 'Trenger du hjelp/utstyr til det?', type: 'lang' }
    ]
  },
  {
    seksjon: 'Hilsen og råd',
    ikon: '💌',
    sporsmal: [
      { id: 'rad-ekteskap', tittel: 'Et godt råd for ekteskapet?', type: 'lang' },
      { id: 'onske', tittel: 'Ditt ønske for dem på dagen?', type: 'lang' },
      { id: 'noe-annet', tittel: 'Noe annet vi bør vite? (fritt felt)', type: 'lang' }
    ]
  }
];
