// Kjemi 2 – Løselighet
// Kompetansemål #8: Utforske og beregne løselighet

const LOSELIGHET = {
  id: "loselighet",
  title: "Løselighet",
  description: "Løselighetsprodukt, fellingsreaksjoner og løselighet i praksis",

  flashcards: [
    {
      front: "Hva er løselighetsproduktet (Ksp)?",
      back: "Likevektskonstanten for oppløsning av et tungtløselig salt: MₐXᵦ(s) ⇌ aM⁺(aq) + bX⁻(aq). Ksp = [M⁺]ᵃ · [X⁻]ᵇ"
    },
    {
      front: "Hva betyr lav Ksp-verdi?",
      back: "Stoffet er svært tungtløselig – det løser seg lite i vann. Jo lavere Ksp, desto mindre løselig."
    },
    {
      front: "Når felles et stoff ut av løsning?",
      back: "Når ioneproduktet Q > Ksp. Da er løsningen overmettet, og fast stoff felles ut inntil Q = Ksp."
    },
    {
      front: "Hva er fellesioneffekten?",
      back: "Løseligheten av et salt reduseres når ett av ionene allerede finnes i løsningen. Le Chatelier: likevekten forskyves mot uoppløst stoff."
    },
    {
      front: "Hvordan beregner man løseligheten (s) fra Ksp for AgCl?",
      back: "AgCl ⇌ Ag⁺ + Cl⁻. Ksp = [Ag⁺][Cl⁻] = s · s = s². Altså s = √Ksp."
    },
    {
      front: "Hvordan beregner man s fra Ksp for Ca(OH)₂?",
      back: "Ca(OH)₂ ⇌ Ca²⁺ + 2OH⁻. Ksp = [Ca²⁺][OH⁻]² = s · (2s)² = 4s³. Altså s = ∛(Ksp/4)."
    },
    {
      front: "Hva er en mettet løsning?",
      back: "En løsning der maksimal mengde stoff er løst – likevekt mellom uoppløst fast stoff og ioner i løsning."
    },
    {
      front: "Hvordan påvirker temperatur løseligheten av de fleste faste stoffer?",
      back: "Løseligheten øker vanligvis med økende temperatur (oppløsning er ofte endoterm). Unntak finnes (f.eks. Ca(OH)₂)."
    },
    {
      front: "Hva er forskjellen på «løselig» og «tungtløselig»?",
      back: "Løselige salter dissossierer fullstendig (Ksp er svært stor). Tungtløselige salter har en målbar Ksp og likevekt mellom fast stoff og ioner."
    },
    {
      front: "Gi et eksempel på bruk av fellingsreaksjoner.",
      back: "Vannrensing: Al₂(SO₄)₃ tilsettes for å felle ut fosfater. Medisin: BaSO₄ brukes som kontrastmiddel (tungtløselig, ufarlig)."
    },
    {
      front: "Hvordan påvirker pH løseligheten av basiske salter?",
      back: "Lav pH (syre) øker løseligheten av salter med basiske anioner (f.eks. CaCO₃): Syren reagerer med CO₃²⁻ og fjerner den fra likevekten."
    }
  ],

  multipleChoice: [
    {
      question: "Ksp for AgCl = 1,8 × 10⁻¹⁰. Hva er løseligheten (s)?",
      options: ["1,3 × 10⁻⁵ M", "1,8 × 10⁻¹⁰ M", "9,0 × 10⁻⁶ M", "1,8 × 10⁻⁵ M"],
      correct: 0,
      explanation: "s = √Ksp = √(1,8 × 10⁻¹⁰) = 1,3 × 10⁻⁵ M."
    },
    {
      question: "Hva skjer hvis man blander Ag⁺ og Cl⁻ slik at Q > Ksp?",
      options: [
        "Ingenting skjer",
        "AgCl felles ut",
        "AgCl løser seg opp",
        "Løsningen blir sur"
      ],
      correct: 1,
      explanation: "Når Q > Ksp er løsningen overmettet. Fast AgCl felles ut inntil Q = Ksp (likevekt)."
    },
    {
      question: "Hvilken løsning reduserer løseligheten av PbCl₂ mest (fellesioneffekt)?",
      options: ["Rent vann", "NaCl-løsning", "NaNO₃-løsning", "Sukkerløsning"],
      correct: 1,
      explanation: "NaCl tilfører Cl⁻-ioner. Fellesioneffekten forskyver PbCl₂-likevekten mot venstre → mindre løselig."
    },
    {
      question: "Ksp for CaF₂ = 3,9 × 10⁻¹¹. Hva er Ksp-uttrykket?",
      options: [
        "Ksp = [Ca²⁺][F⁻]",
        "Ksp = [Ca²⁺][F⁻]²",
        "Ksp = [Ca²⁺]²[F⁻]",
        "Ksp = [Ca²⁺][F⁻]³"
      ],
      correct: 1,
      explanation: "CaF₂ ⇌ Ca²⁺ + 2F⁻. Ksp = [Ca²⁺][F⁻]² (koeffisienten 2 blir eksponent)."
    },
    {
      question: "Hvilket salt er mest løselig i vann?",
      options: [
        "AgCl (Ksp = 1,8 × 10⁻¹⁰)",
        "BaSO₄ (Ksp = 1,1 × 10⁻¹⁰)",
        "PbI₂ (Ksp = 9,8 × 10⁻⁹)",
        "CaCO₃ (Ksp = 3,4 × 10⁻⁹)"
      ],
      correct: 2,
      explanation: "Høyest Ksp = mest løselig. PbI₂ med Ksp = 9,8 × 10⁻⁹ har størst Ksp her (men husk at formelen varierer)."
    },
    {
      question: "Hva skjer med løseligheten av CaCO₃ i surt vann (lav pH)?",
      options: [
        "Løseligheten øker",
        "Løseligheten synker",
        "Ingen endring",
        "CaCO₃ dekomponerer til Ca og CO₂"
      ],
      correct: 0,
      explanation: "H⁺ reagerer med CO₃²⁻ → HCO₃⁻ → H₂CO₃ → CO₂. CO₃²⁻ fjernes fra likevekten → mer CaCO₃ løses."
    },
    {
      question: "Løseligheten av BaSO₄ er 1,0 × 10⁻⁵ M. Hva er Ksp?",
      options: [
        "1,0 × 10⁻⁵",
        "1,0 × 10⁻¹⁰",
        "2,0 × 10⁻⁵",
        "1,0 × 10⁻¹⁵"
      ],
      correct: 1,
      explanation: "BaSO₄ ⇌ Ba²⁺ + SO₄²⁻. Ksp = s × s = s² = (1,0 × 10⁻⁵)² = 1,0 × 10⁻¹⁰."
    },
    {
      question: "Hviken faktor påvirker IKKE Ksp-verdien?",
      options: ["Temperatur", "Konsentrasjon av fellesion", "Stoffets natur", "Ingen av disse"],
      correct: 1,
      explanation: "Ksp er en likevektskonstant som kun avhenger av temperatur og stoffets natur. Fellesion forskyver likevekten, men endrer ikke Ksp."
    },
    {
      question: "Hvorfor brukes BaSO₄ som kontrastmiddel til tross for at Ba²⁺ er giftig?",
      options: [
        "Det omdannes til ufarlig stoff i kroppen",
        "Det er så tungtløselig at svært lite Ba²⁺ frigis",
        "Bariumsulfat er ikke giftig i det hele tatt",
        "Det brukes i så små mengder at det er trygt"
      ],
      correct: 1,
      explanation: "BaSO₄ har ekstremt lav Ksp. Mengden frie Ba²⁺-ioner i løsning er neglisjerbar, så det er trygt."
    },
    {
      question: "Selektiv felling brukes til å separere ioner. Hva menes med dette?",
      options: [
        "Man tilsetter et reagens som feller ut alle ioner samtidig",
        "Man tilsetter et reagens som feller ut bare ett ion basert på ulike Ksp-verdier",
        "Man varmer opp løsningen for å felle ut alle salter",
        "Man filtrerer for å separere ionene"
      ],
      correct: 1,
      explanation: "Ved selektiv felling bruker man forskjeller i Ksp til å felle ut ett ion mens andre forblir i løsning."
    }
  ],

  trueFalse: [
    {
      statement: "Ksp endres ved tilsetning av fellesion.",
      correct: false,
      explanation: "Ksp er en konstant (ved gitt temperatur). Fellesion forskyver likevekten og reduserer løseligheten, men Ksp forblir den samme."
    },
    {
      statement: "Når Q < Ksp, vil mer salt løse seg.",
      correct: true,
      explanation: "Q < Ksp betyr at løsningen er umettet – den kan løse mer stoff inntil Q = Ksp (likevekt)."
    },
    {
      statement: "Alle natriumsalter er lettløselige i vann.",
      correct: true,
      explanation: "Natriumsalter (og kaliumsalter) er generelt svært lettløselige i vann. Ingen vanlige Na-salter er tungtløselige."
    },
    {
      statement: "Løseligheten av gasser i vann øker med økende temperatur.",
      correct: false,
      explanation: "Gasser blir MINDRE løselige ved høyere temperatur (de 'koker ut'). Faste stoffer blir vanligvis mer løselige."
    },
    {
      statement: "CaCO₃ i kalkstein løses lettere i surt regnvann enn i rent vann.",
      correct: true,
      explanation: "Syre (H⁺) reagerer med CO₃²⁻ og fjerner den fra likevekten → forskyver oppløsningen mot høyre."
    },
    {
      statement: "Ksp-uttrykket inkluderer konsentrasjonen av det faste saltet.",
      correct: false,
      explanation: "Fast stoff har konstant konsentrasjon og tas ikke med i Ksp-uttrykket (som for alle heterogene likevekter)."
    },
    {
      statement: "Tungtløselige salter løser seg ikke i det hele tatt.",
      correct: false,
      explanation: "Tungtløselige salter løser seg i svært liten grad – det finnes en likevekt med en liten, men målbar løselighet."
    },
    {
      statement: "Økt trykk har stor effekt på løseligheten av faste stoffer i vann.",
      correct: false,
      explanation: "Trykk har neglisjerbar effekt på løselighet av faste stoffer. Det påvirker primært gassers løselighet (Henrys lov)."
    }
  ]
};

if (typeof window !== 'undefined') {
  window.LOSELIGHET = LOSELIGHET;
}
