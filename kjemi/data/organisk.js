// Kjemi 2 – Organisk kjemi og reaksjonstyper
// Kompetansemål #10: Reaksjonstyper og reaksjonsmekanismer

const ORGANISK = {
  id: "organisk",
  title: "Organisk kjemi",
  description: "Addisjon, eliminasjon, substitusjon, hydrolyse og kondensasjon",

  flashcards: [
    {
      front: "Hva er en addisjonsreaksjon?",
      back: "En reaksjon der atomer/grupper adderes til en dobbelt- eller trippelbinding uten at noe fjernes. Dobbeltbindingen brytes."
    },
    {
      front: "Hva er en eliminasjonsreaksjon?",
      back: "En reaksjon der atomer/grupper fjernes fra nabokarboner, og det dannes en dobbelt- eller trippelbinding. Motsatt av addisjon."
    },
    {
      front: "Hva er en substitusjonsreaksjon?",
      options: null,
      back: "En reaksjon der et atom eller en gruppe i et molekyl byttes ut med et annet atom/gruppe."
    },
    {
      front: "Hva er hydrolyse?",
      back: "En reaksjon der en binding brytes ved tilsetning av vann. Vann spaltes og delene (-H og -OH) bindes til fragmentene."
    },
    {
      front: "Hva er en kondensasjonsreaksjon?",
      back: "En reaksjon der to molekyler kobles sammen mens et lite molekyl (ofte H₂O) avgis. Motsatt av hydrolyse."
    },
    {
      front: "Hva er et nukleofil?",
      back: "Et elektronrikt atom/ion som angriper et positivt senter i et molekyl. Har fritt elektronpar. Eks: OH⁻, NH₃, Cl⁻."
    },
    {
      front: "Hva er et elektrofil?",
      back: "Et elektronfattig atom/ion som angriper et negativt/elektronrikt senter. Har mangel på elektroner. Eks: H⁺, NO₂⁺, BF₃."
    },
    {
      front: "Gi et eksempel på addisjon til alken.",
      back: "CH₂=CH₂ + HBr → CH₃−CH₂Br (eten + hydrogenbromid → brommetan). Dobbeltbindingen brytes."
    },
    {
      front: "Gi et eksempel på eliminasjon.",
      back: "CH₃−CH₂OH →(H₂SO₄, varme) CH₂=CH₂ + H₂O. Etanol mister vann og danner eten."
    },
    {
      front: "Hva er en esterbinding?",
      back: "En binding dannet ved kondensasjon mellom en karboksylsyre (−COOH) og en alkohol (−OH): R−COO−R' + H₂O."
    },
    {
      front: "Hva er en peptidbinding?",
      back: "En binding mellom to aminosyrer dannet ved kondensasjon: −CO−NH− + H₂O. Bygger opp proteiner."
    },
    {
      front: "Hva er Markovnikovs regel?",
      back: "Ved addisjon av HX til usymmetriske alkener: H adderes til karbonet med flest H-atomer fra før. 'De rike blir rikere.'"
    },
    {
      front: "Hva er forskjellen på SN1 og SN2?",
      back: "SN1: tostegsmekanisme via karbokation (tertiære substrater). SN2: ettstegs bakside-angrep (primære substrater)."
    },
    {
      front: "Hva dannes ved hydrolyse av en ester?",
      back: "Karboksylsyre + alkohol. Esterbindingen brytes ved at vann adderes: R−COO−R' + H₂O → R−COOH + R'−OH."
    },
    {
      front: "Hva er polymerisasjon?",
      back: "Mange monomerer kobles sammen til et polymer. Kan skje via addisjon (addisjonpolymerisasjon) eller kondensasjon (kondensasjonspolymerisasjon)."
    }
  ],

  multipleChoice: [
    {
      question: "CH₂=CH₂ + Br₂ → CH₂Br−CH₂Br. Hva slags reaksjon er dette?",
      options: ["Substitusjon", "Addisjon", "Eliminasjon", "Kondensasjon"],
      correct: 1,
      explanation: "Brom adderes til dobbeltbindingen i eten. Dobbeltbindingen brytes → addisjon."
    },
    {
      question: "CH₃CH₂OH → CH₂=CH₂ + H₂O. Hva slags reaksjon er dette?",
      options: ["Addisjon", "Substitusjon", "Eliminasjon", "Hydrolyse"],
      correct: 2,
      explanation: "H og OH fjernes fra etanol og danner eten + vann. Dobbeltbinding dannes → eliminasjon."
    },
    {
      question: "CH₃COOH + CH₃OH → CH₃COOCH₃ + H₂O. Hva slags reaksjon?",
      options: ["Hydrolyse", "Addisjon", "Kondensasjon", "Eliminasjon"],
      correct: 2,
      explanation: "To molekyler kobles sammen og vann avgis → kondensasjon (esterdannelse)."
    },
    {
      question: "CH₃COOCH₃ + H₂O → CH₃COOH + CH₃OH. Hva slags reaksjon?",
      options: ["Kondensasjon", "Hydrolyse", "Addisjon", "Substitusjon"],
      correct: 1,
      explanation: "Esterbindingen brytes ved tilsetning av vann → hydrolyse (motsatt av kondensasjon)."
    },
    {
      question: "CH₄ + Cl₂ → CH₃Cl + HCl (under UV-lys). Hva slags reaksjon?",
      options: ["Addisjon", "Eliminasjon", "Substitusjon", "Kondensasjon"],
      correct: 2,
      explanation: "Et H-atom i metan byttes ut med Cl → substitusjon (radikalsubstitusjon)."
    },
    {
      question: "Hva er et nukleofil?",
      options: [
        "Et elektronfattig partikkel som søker elektroner",
        "Et elektronrikt partikkel som angriper positive sentre",
        "Et nøytralt molekyl uten ladning",
        "En katalysator"
      ],
      correct: 1,
      explanation: "Et nukleofil er elektronrikt (har ledig elektronpar) og angriper elektrofile (positive) karbonsentre."
    },
    {
      question: "Hvilken funksjonell gruppe dannes ved kondensasjon mellom karboksylsyre og alkohol?",
      options: ["Eter", "Ester", "Amid", "Keton"],
      correct: 1,
      explanation: "R−COOH + R'−OH → R−COO−R' (ester) + H₂O."
    },
    {
      question: "Hvilken reaksjonstype bryter ned proteiner til aminosyrer?",
      options: ["Kondensasjon", "Addisjon", "Hydrolyse", "Eliminasjon"],
      correct: 2,
      explanation: "Peptidbindinger brytes ved hydrolyse (tilsetning av vann) → frigjør aminosyrer."
    },
    {
      question: "Addisjon av HBr til propen (CH₃−CH=CH₂) gir hovedsakelig:",
      options: ["1-brompropan", "2-brompropan", "Like mengder av begge", "Propan"],
      correct: 1,
      explanation: "Markovnikovs regel: H til C med flest H, Br til C med færrest H → 2-brompropan (CH₃−CHBr−CH₃)."
    },
    {
      question: "Hva er polyeten?",
      options: [
        "Et addisjonpolymer av eten-monomerer",
        "Et kondensasjonspolymer av etanol",
        "En ester av etylenglykol",
        "En naturlig polymer"
      ],
      correct: 0,
      explanation: "Polyeten dannes ved addisjonspolymerisasjon: n CH₂=CH₂ → −(CH₂−CH₂)ₙ−. Dobbeltbindinger brytes."
    },
    {
      question: "Nylon dannes ved kondensasjon mellom:",
      options: [
        "To alkoholer",
        "En dikarboksylsyre og et diamin",
        "To estere",
        "En alken og et halogen"
      ],
      correct: 1,
      explanation: "Nylon er et kondensasjonspolymer dannet fra dikarboksylsyre + diamin → amidbindinger + H₂O."
    },
    {
      question: "Hvorfor er alkener mer reaktive enn alkaner?",
      options: [
        "Alkener er mindre stabile på grunn av dobbeltbindingen",
        "Alkener har høyere molmasse",
        "Alkaner har sterkere bindinger",
        "Alkener løser seg bedre i vann"
      ],
      correct: 0,
      explanation: "π-bindingen i dobbeltbindingen er svakere enn σ-bindingen og gjør alkener tilgjengelige for addisjonsreaksjoner."
    },
    {
      question: "Hva er forskjellen mellom addisjon og substitusjon?",
      options: [
        "Addisjon: atomer legges til. Substitusjon: atomer byttes ut",
        "De er det samme",
        "Addisjon krever katalysator, substitusjon ikke",
        "Substitusjon gir alltid polymer"
      ],
      correct: 0,
      explanation: "Ved addisjon adderes nye atomer (produktet er større). Ved substitusjon byttes et atom ut (produktet har like mange atomer som startmolekylet)."
    }
  ],

  trueFalse: [
    {
      statement: "Addisjon er motsatt reaksjon av eliminasjon.",
      correct: true,
      explanation: "Addisjon legger til atomer og bryter dobbeltbinding. Eliminasjon fjerner atomer og danner dobbeltbinding."
    },
    {
      statement: "Kondensasjon er motsatt reaksjon av hydrolyse.",
      correct: true,
      explanation: "Kondensasjon kobler molekyler og avgir vann. Hydrolyse bryter bindinger ved å tilsette vann."
    },
    {
      statement: "Alkaner gjennomgår lett addisjonsreaksjoner.",
      correct: false,
      explanation: "Alkaner har bare σ-bindinger og er mettede – de gjennomgår substitusjon (under UV-lys), ikke addisjon."
    },
    {
      statement: "Et nukleofilt angrep skjer alltid på et karbon med positiv partialladning.",
      correct: true,
      explanation: "Nukleofiler (elektronrike) angriper elektrofile (elektronfattige) sentre, typisk karbon med δ+ pga. elektronegative naboatomer."
    },
    {
      statement: "Proteiner brytes ned til aminosyrer ved kondensasjon.",
      correct: false,
      explanation: "Proteiner brytes ned ved hydrolyse (peptidbindinger + H₂O → aminosyrer). Kondensasjon bygger opp proteiner."
    },
    {
      statement: "Polyeten dannes ved kondensasjonspolymerisasjon.",
      correct: false,
      explanation: "Polyeten dannes ved addisjonspolymerisasjon av eten. Ingen liten molekyler avgis."
    },
    {
      statement: "Ved SN2-mekanisme skjer angrepet fra baksiden av molekylet.",
      correct: true,
      explanation: "I SN2 angriper nukleofilen fra motsatt side av avgangsgruppen → inversjon av konfigurasjon."
    },
    {
      statement: "Estere har typisk fruktig lukt.",
      correct: true,
      explanation: "Mange estere gir frukt- og blomsterdufter. F.eks. etylbutyrat lukter ananas, isoamylacetat lukter banan."
    },
    {
      statement: "Eliminasjon fra et alkohol krever alltid en base.",
      correct: false,
      explanation: "Eliminasjon kan også skje med syre (f.eks. H₂SO₄) som katalysator ved oppvarming (dehydratisering)."
    },
    {
      statement: "Halogenering av alkaner er en radikalsubstusjonsreaksjon.",
      correct: true,
      explanation: "CH₄ + Cl₂ → CH₃Cl + HCl under UV-lys. Initieres av radikaler (Cl·) dannet ved homolyse."
    }
  ]
};

if (typeof window !== 'undefined') {
  window.ORGANISK = ORGANISK;
}
