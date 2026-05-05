// Kjemi 2 – Likevekter
// Kompetansemål #5: Utforske likevekter og bruke massevirkningsloven

const LIKEVEKTER = {
  id: "likevekter",
  title: "Likevekter",
  description: "Massevirkningsloven, Le Chatelier og likevektsberegninger",

  flashcards: [
    {
      front: "Hva er kjemisk likevekt?",
      back: "En tilstand der hastigheten til hin-reaksjonen er lik hastigheten til tilbake-reaksjonen. Konsentrasjonene er konstante, men reaksjonen stopper ikke."
    },
    {
      front: "Hva er massevirkningsloven (likevektsuttrykket)?",
      back: "For reaksjonen aA + bB ⇌ cC + dD:\nK = [C]ᶜ·[D]ᵈ / [A]ᵃ·[B]ᵇ\nProdukter i teller, reaktanter i nevner."
    },
    {
      front: "Hva betyr en stor K-verdi?",
      back: "Likevekten ligger langt mot høyre – det dannes mye produkter. Reaksjonen er tilnærmet fullstendig."
    },
    {
      front: "Hva betyr en liten K-verdi (K << 1)?",
      back: "Likevekten ligger mot venstre – det er mest reaktanter igjen. Lite produkt dannes."
    },
    {
      front: "Hva sier Le Chateliers prinsipp?",
      back: "Når et system i likevekt utsettes for en ytre påvirkning, vil likevekten forskyves slik at den motvirker endringen."
    },
    {
      front: "Hvordan påvirker temperaturøkning en eksoterm reaksjon?",
      back: "Likevekten forskyves mot venstre (mot reaktantene) fordi systemet motvirker varmetilførselen. K-verdien synker."
    },
    {
      front: "Hvordan påvirker temperaturøkning en endoterm reaksjon?",
      back: "Likevekten forskyves mot høyre (mot produktene) fordi systemet bruker varmen. K-verdien øker."
    },
    {
      front: "Påvirker en katalysator likevektsposisjonen?",
      back: "Nei. En katalysator øker hastigheten til både hin- og tilbakereaksjonen like mye. Likevekt nås raskere, men K endres ikke."
    },
    {
      front: "Hva skjer med likevekten hvis man øker konsentrasjonen av en reaktant?",
      back: "Likevekten forskyves mot høyre (mot produktene) for å motvirke økningen."
    },
    {
      front: "Hva skjer med likevekten i en gassreaksjon hvis trykket økes?",
      back: "Likevekten forskyves mot den siden med færrest mol gass, for å redusere trykket."
    },
    {
      front: "Hva er reaksjonskvotienten Q?",
      back: "Q beregnes med samme formel som K, men med vilkårlige konsentrasjoner (ikke likevektskonsentrasjoner). Sammenlignes med K for å forutsi retning."
    },
    {
      front: "Hva skjer hvis Q < K?",
      back: "Reaksjonen går mot høyre (danner mer produkt) for å nå likevekt."
    },
    {
      front: "Hva skjer hvis Q > K?",
      back: "Reaksjonen går mot venstre (danner mer reaktant) for å nå likevekt."
    },
    {
      front: "Inkluderes rene faste stoffer og rene væsker i likevektsuttrykket?",
      back: "Nei. Konsentrasjonen av rene faste stoffer og rene væsker er konstant og inkluderes ikke i K-uttrykket."
    },
    {
      front: "Hva er en homogen likevekt?",
      back: "En likevekt der alle reaktanter og produkter er i samme fase (f.eks. alle i gass eller alle i løsning)."
    },
    {
      front: "Hva er en heterogen likevekt?",
      back: "En likevekt der reaktanter og produkter er i ulike faser (f.eks. fast stoff og gass)."
    }
  ],

  multipleChoice: [
    {
      question: "For reaksjonen N₂(g) + 3H₂(g) ⇌ 2NH₃(g), hva er riktig likevektsuttrykk?",
      options: [
        "K = [NH₃]² / ([N₂]·[H₂]³)",
        "K = [N₂]·[H₂]³ / [NH₃]²",
        "K = [NH₃] / ([N₂]·[H₂])",
        "K = 2[NH₃] / ([N₂]·3[H₂])"
      ],
      correct: 0,
      explanation: "K = produkter/reaktanter med koeffisienter som eksponenter: K = [NH₃]² / ([N₂]·[H₂]³)."
    },
    {
      question: "Reaksjonen A ⇌ B er eksoterm. Hva skjer med K hvis temperaturen øker?",
      options: ["K øker", "K synker", "K er uforandret", "K blir null"],
      correct: 1,
      explanation: "For en eksoterm reaksjon forskyves likevekten mot venstre ved temperaturøkning, altså synker K."
    },
    {
      question: "En katalysator tilsettes et likevektssystem. Hva skjer?",
      options: [
        "K øker",
        "Likevekt nås raskere, K uendret",
        "Likevekten forskyves mot høyre",
        "Likevekten forskyves mot venstre"
      ],
      correct: 1,
      explanation: "Katalysatoren øker hastigheten i begge retninger like mye. K endres ikke, men likevekt nås raskere."
    },
    {
      question: "For 2SO₂(g) + O₂(g) ⇌ 2SO₃(g). Hva skjer hvis trykket økes?",
      options: [
        "Likevekten forskyves mot høyre",
        "Likevekten forskyves mot venstre",
        "Ingen endring",
        "K-verdien endres"
      ],
      correct: 0,
      explanation: "Venstre: 3 mol gass. Høyre: 2 mol gass. Økt trykk forskyver mot færrest mol gass = mot høyre."
    },
    {
      question: "K = 4,0 × 10⁻³ for en reaksjon. Hva kan vi si?",
      options: [
        "Det er mest produkter ved likevekt",
        "Det er mest reaktanter ved likevekt",
        "Konsentrasjonene er like",
        "Reaksjonen er irreversibel"
      ],
      correct: 1,
      explanation: "K << 1 betyr at likevekten ligger mot venstre – det er mest reaktanter ved likevekt."
    },
    {
      question: "Hva endrer IKKE likevektskonstanten K?",
      options: [
        "Temperaturendring",
        "Konsentrasjonsendring",
        "Begge endrer K",
        "Ingen av dem endrer K"
      ],
      correct: 1,
      explanation: "Bare temperatur endrer K. Konsentrasjonsendring forskyver likevekten, men K forblir den samme."
    },
    {
      question: "For CaCO₃(s) ⇌ CaO(s) + CO₂(g), hva er likevektsuttrykket?",
      options: [
        "K = [CaO]·[CO₂] / [CaCO₃]",
        "K = [CO₂]",
        "K = [CO₂] / [CaCO₃]",
        "K = 1 / [CO₂]"
      ],
      correct: 1,
      explanation: "Rene faste stoffer inkluderes ikke. Bare CO₂(g) er i uttrykket: K = [CO₂] (eller Kp = p(CO₂))."
    },
    {
      question: "Q = 0,5 og K = 2,0. Hvilken vei går reaksjonen?",
      options: [
        "Mot høyre (danner produkter)",
        "Mot venstre (danner reaktanter)",
        "Systemet er i likevekt",
        "Kan ikke avgjøres"
      ],
      correct: 0,
      explanation: "Q < K → det er for lite produkter. Reaksjonen går mot høyre for å nå likevekt."
    },
    {
      question: "N₂O₄(g) ⇌ 2NO₂(g), ΔH > 0. Hva forskyver likevekten mot høyre?",
      options: [
        "Økt trykk og økt temperatur",
        "Redusert trykk og økt temperatur",
        "Økt trykk og redusert temperatur",
        "Tilsatt katalysator"
      ],
      correct: 1,
      explanation: "Endoterm (ΔH > 0): økt T forskyver mot høyre. 1 mol → 2 mol gass: lavere trykk forskyver mot høyre."
    },
    {
      question: "Hva er forskjellen mellom Kc og Kp?",
      options: [
        "Kc bruker konsentrasjoner, Kp bruker partialtrykk",
        "Kc gjelder gasser, Kp gjelder løsninger",
        "De er alltid like",
        "Kp er alltid større enn Kc"
      ],
      correct: 0,
      explanation: "Kc bruker konsentrasjoner (mol/L) og Kp bruker partialtrykk (atm/bar) for gassreaksjoner."
    },
    {
      question: "Hva skjer med likevekten A(g) + B(g) ⇌ C(g) hvis man fjerner noe C?",
      options: [
        "Likevekten forskyves mot høyre",
        "Likevekten forskyves mot venstre",
        "Ingen endring",
        "K-verdien endres"
      ],
      correct: 0,
      explanation: "Fjernes C, vil systemet motvirke dette ved å danne mer C → likevekten forskyves mot høyre."
    },
    {
      question: "En likevekt har K = 1. Hva betyr det?",
      options: [
        "Konsentrasjonene av produkter og reaktanter er omtrent like",
        "Reaksjonen går ikke",
        "Bare produkter finnes",
        "Bare reaktanter finnes"
      ],
      correct: 0,
      explanation: "K = 1 betyr at produkter og reaktanter har omtrent like store konsentrasjoner ved likevekt."
    },
    {
      question: "Haber-prosessen: N₂ + 3H₂ ⇌ 2NH₃ (eksoterm). Hvilke betingelser gir mest NH₃ ved likevekt?",
      options: [
        "Høy temperatur, lavt trykk",
        "Lav temperatur, høyt trykk",
        "Høy temperatur, høyt trykk",
        "Lav temperatur, lavt trykk"
      ],
      correct: 1,
      explanation: "Eksoterm → lav T forskyver mot høyre. 4 mol gass → 2 mol: høyt trykk forskyver mot høyre."
    },
    {
      question: "Hva er en dynamisk likevekt?",
      options: [
        "En likevekt der alle reaksjoner har stoppet",
        "En likevekt der hin- og tilbakereaksjonen skjer like raskt",
        "En likevekt som kun gjelder gasser",
        "En likevekt der K endres over tid"
      ],
      correct: 1,
      explanation: "Dynamisk likevekt betyr at begge reaksjonene fortsatt pågår, men med lik hastighet slik at konsentrasjonene er konstante."
    },
    {
      question: "Tilsetting av inert gass (f.eks. Ar) til en likevekt i lukket beholder ved konstant volum:",
      options: [
        "Forskyver likevekten mot høyre",
        "Forskyver likevekten mot venstre",
        "Påvirker ikke likevekten",
        "Endrer K-verdien"
      ],
      correct: 2,
      explanation: "Inert gass ved konstant volum endrer ikke konsentrasjonene til reaktanter/produkter, så likevekten påvirkes ikke."
    }
  ],

  trueFalse: [
    {
      statement: "Ved likevekt er konsentrasjonene av reaktanter og produkter alltid like.",
      correct: false,
      explanation: "Ved likevekt er konsentrasjonene konstante, men ikke nødvendigvis like. Forholdet avhenger av K."
    },
    {
      statement: "K-verdien endres kun ved temperaturendring.",
      correct: true,
      explanation: "K er en funksjon av temperatur. Konsentrasjons- og trykkendringer forskyver likevekten, men endrer ikke K."
    },
    {
      statement: "En katalysator endrer ikke K, men gjør at likevekt nås raskere.",
      correct: true,
      explanation: "Katalysatoren senker aktiveringsenergien for begge retninger like mye, så K er uendret."
    },
    {
      statement: "Økt trykk forskyver alltid likevekten mot høyre.",
      correct: false,
      explanation: "Økt trykk forskyver mot den siden med færrest mol gass. Hvis produktsiden har flere mol gass, forskyves det mot venstre."
    },
    {
      statement: "Rene faste stoffer og væsker tas med i likevektsuttrykket.",
      correct: false,
      explanation: "Rene faste stoffer og rene væsker har konstant konsentrasjon og inkluderes ikke i K-uttrykket."
    },
    {
      statement: "Hvis Q = K, er systemet i likevekt.",
      correct: true,
      explanation: "Når reaksjonskvotienten Q er lik likevektskonstanten K, er systemet i likevekt og netto reaksjon er null."
    },
    {
      statement: "For en endoterm reaksjon øker K med økende temperatur.",
      correct: true,
      explanation: "Økt temperatur forskyver en endoterm reaksjon mot høyre (produkter), som betyr at K øker."
    },
    {
      statement: "Le Chateliers prinsipp gjelder bare for gassreaksjoner.",
      correct: false,
      explanation: "Le Chateliers prinsipp gjelder for alle reversible reaksjoner i likevekt, inkludert reaksjoner i løsning."
    },
    {
      statement: "Å fortynne en likevektsblanding i løsning forskyver likevekten mot den siden med flest løste partikler.",
      correct: true,
      explanation: "Fortynning reduserer konsentrasjonene. Systemet motvirker dette ved å forskyves mot siden med flest mol i løsning."
    },
    {
      statement: "I Haber-prosessen brukes høyt trykk fordi det forskyver likevekten mot NH₃.",
      correct: true,
      explanation: "N₂ + 3H₂ ⇌ 2NH₃: 4 mol gass → 2 mol gass. Høyt trykk forskyver mot færrest mol = mot NH₃."
    }
  ]
};

if (typeof window !== 'undefined') {
  window.LIKEVEKTER = LIKEVEKTER;
}
