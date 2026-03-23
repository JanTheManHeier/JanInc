// ============================================================================
// SpisSlank — Carnivore Meal Database & Weekly Plans
// ~30 carnivore meals (breakfast/lunch/dinner) with Norwegian grocery ingredients
// and 4 weekly meal plans progressing from simple to advanced.
// ============================================================================

(function () {
  'use strict';

  // ─────────────────────────────────────────────────────────────────────────
  // CARNIVORE_MEALS — 30 meals (10 breakfast, 10 lunch, 10 dinner)
  // ─────────────────────────────────────────────────────────────────────────

  window.CARNIVORE_MEALS = [

    // ═══ BREAKFAST (10) ═══════════════════════════════════════════════════

    {
      id: 'carni-steak-eggs',
      name: 'Biff og Egg',
      nameEN: 'Steak and Eggs',
      type: 'breakfast',
      prepTime: 15,
      pathways: {
        ketosis: 4, protein: 5, mtor: 5, autophagy: 3,
        omega: 2, collagen: 1, iron: 5, inflam: 4
      },
      scienceNote: 'Entrecôte gir rikelig hemjern og leucin for muskelbygging. Egg tilfører kolin og fettløselige vitaminer. Sammen gir de komplett aminosyreprofil og lang metthet.',
      scienceNoteEN: 'Ribeye provides abundant heme iron and leucine for muscle building. Eggs add choline and fat-soluble vitamins. Together they deliver a complete amino acid profile and lasting satiety.',
      ingredients: [
        { name: 'Entrecôte', nameEN: 'Ribeye steak', amount: '200 g', section: 'Kjøtt' },
        { name: 'Egg', nameEN: 'Eggs', amount: '3 stk', section: 'Egg & Meieri' },
        { name: 'Smør', nameEN: 'Butter', amount: '1 ss', section: 'Egg & Meieri' },
        { name: 'Salt', nameEN: 'Salt', amount: 'etter smak', section: 'Krydder & Salt' }
      ],
      instructions: [
        'Ta biffen ut av kjøleskapet 20 min før steking.',
        'Krydre med salt. Stek i smør på høy varme, 3–4 min per side.',
        'La biffen hvile 5 min under folie.',
        'Stek eggene i samme panne med resterende smør.'
      ],
      instructionsEN: [
        'Take the steak out of the fridge 20 min before cooking.',
        'Season with salt. Sear in butter on high heat, 3–4 min per side.',
        'Let the steak rest 5 min under foil.',
        'Fry the eggs in the same pan with remaining butter.'
      ],
      tags: ['high-protein', 'strict'],
      allergens: ['eggs'],
      dietary: ['carnivore'],
      variant: ['strict', 'animal-based']
    },

    {
      id: 'carni-bacon-eggs',
      name: 'Bacon og Eggerøre',
      nameEN: 'Bacon and Scrambled Eggs',
      type: 'breakfast',
      prepTime: 10,
      pathways: {
        ketosis: 5, protein: 4, mtor: 3, autophagy: 2,
        omega: 1, collagen: 2, iron: 2, inflam: 3
      },
      scienceNote: 'Bacon gir mye fett som fremmer ketose. Eggerøre med smør er proteintett og mettende, og den lave karbohydratmengden holder insulinet lavt.',
      scienceNoteEN: 'Bacon provides high fat promoting ketosis. Scrambled eggs with butter are protein-dense and satiating, and the low carb content keeps insulin low.',
      ingredients: [
        { name: 'Bacon', nameEN: 'Bacon', amount: '150 g', section: 'Kjøtt' },
        { name: 'Egg', nameEN: 'Eggs', amount: '4 stk', section: 'Egg & Meieri' },
        { name: 'Smør', nameEN: 'Butter', amount: '1 ss', section: 'Egg & Meieri' },
        { name: 'Salt og pepper', nameEN: 'Salt and pepper', amount: 'etter smak', section: 'Krydder & Salt' }
      ],
      instructions: [
        'Stek baconet sprøtt i en stekepanne på middels varme.',
        'Legg bacon til side. Visp egg løst.',
        'Smelt smør i pannen, hell i eggene.',
        'Rør forsiktig på lav varme til eggerøren er krämig. Krydre med salt og pepper.'
      ],
      instructionsEN: [
        'Fry bacon crispy in a pan over medium heat.',
        'Set bacon aside. Lightly whisk the eggs.',
        'Melt butter in the pan, pour in the eggs.',
        'Stir gently on low heat until creamy. Season with salt and pepper.'
      ],
      tags: ['quick', 'high-protein', 'budget', 'strict'],
      allergens: ['eggs'],
      dietary: ['carnivore'],
      variant: ['strict', 'animal-based']
    },

    {
      id: 'carni-omelette',
      name: 'Kjøttomelett',
      nameEN: 'Meat Omelette',
      type: 'breakfast',
      prepTime: 12,
      pathways: {
        ketosis: 4, protein: 5, mtor: 4, autophagy: 2,
        omega: 1, collagen: 1, iron: 4, inflam: 3
      },
      scienceNote: 'Kombinasjonen av egg og kjøttdeig gir en kraftig proteindose med alle essensielle aminosyrer. Kjøttdeig tilfører ekstra hemjern og B12.',
      scienceNoteEN: 'The combination of eggs and ground beef delivers a powerful protein dose with all essential amino acids. Ground beef adds extra heme iron and B12.',
      ingredients: [
        { name: 'Egg', nameEN: 'Eggs', amount: '3 stk', section: 'Egg & Meieri' },
        { name: 'Kjøttdeig', nameEN: 'Ground beef', amount: '100 g', section: 'Kjøtt' },
        { name: 'Smør', nameEN: 'Butter', amount: '1 ss', section: 'Egg & Meieri' },
        { name: 'Salt', nameEN: 'Salt', amount: 'etter smak', section: 'Krydder & Salt' }
      ],
      instructions: [
        'Brun kjøttdeigen i smør, krydre med salt.',
        'Visp eggene og hell over kjøttdeigen i pannen.',
        'Stek på middels varme til omeletten er satt. Brett sammen og server.'
      ],
      instructionsEN: [
        'Brown ground beef in butter, season with salt.',
        'Whisk eggs and pour over the meat in the pan.',
        'Cook on medium heat until set. Fold and serve.'
      ],
      tags: ['high-protein', 'budget', 'strict'],
      allergens: ['eggs'],
      dietary: ['carnivore'],
      variant: ['strict', 'animal-based']
    },

    {
      id: 'carni-omelette-cheese',
      name: 'Omellett med Ost og Skinke',
      nameEN: 'Omelette with Cheese and Ham',
      type: 'breakfast',
      prepTime: 10,
      pathways: {
        ketosis: 4, protein: 4, mtor: 4, autophagy: 1,
        omega: 1, collagen: 1, iron: 2, inflam: 2
      },
      scienceNote: 'Ost tilfører kasein-protein som fordøyes sakte og gir langvarig metthet. Skinke gir raskt tilgjengelig protein. Samlet gir dette stabilt energinivå.',
      scienceNoteEN: 'Cheese adds casein protein that digests slowly for lasting satiety. Ham provides readily available protein. Combined this gives stable energy levels.',
      ingredients: [
        { name: 'Egg', nameEN: 'Eggs', amount: '3 stk', section: 'Egg & Meieri' },
        { name: 'Norvegia ost', nameEN: 'Norwegian cheese', amount: '40 g', section: 'Egg & Meieri' },
        { name: 'Kokt skinke', nameEN: 'Cooked ham', amount: '60 g', section: 'Kjøtt' },
        { name: 'Smør', nameEN: 'Butter', amount: '1 ss', section: 'Egg & Meieri' },
        { name: 'Salt og pepper', nameEN: 'Salt and pepper', amount: 'etter smak', section: 'Krydder & Salt' }
      ],
      instructions: [
        'Visp eggene med salt og pepper.',
        'Smelt smør i pannen, hell i eggene.',
        'Legg skivet skinke og revet ost på den ene halvdelen.',
        'Brett omeletten sammen når egget er satt. Server straks.'
      ],
      instructionsEN: [
        'Whisk eggs with salt and pepper.',
        'Melt butter in the pan, pour in the eggs.',
        'Place sliced ham and grated cheese on one half.',
        'Fold the omelette when the egg is set. Serve immediately.'
      ],
      tags: ['quick', 'high-protein', 'animal-based'],
      allergens: ['eggs', 'dairy'],
      dietary: ['carnivore'],
      variant: ['animal-based']
    },

    {
      id: 'carni-salmon-eggs',
      name: 'Røkelaks og Egg',
      nameEN: 'Smoked Salmon and Eggs',
      type: 'breakfast',
      prepTime: 10,
      pathways: {
        ketosis: 4, protein: 4, mtor: 4, autophagy: 3,
        omega: 5, collagen: 1, iron: 2, inflam: 5
      },
      scienceNote: 'Røkelaks er en av de rikeste kildene til omega-3 (EPA/DHA), som demper betennelse og støtter hjernefunksjon. Kokte egg kompletterer aminosyreprofilen.',
      scienceNoteEN: 'Smoked salmon is one of the richest sources of omega-3 (EPA/DHA), reducing inflammation and supporting brain function. Boiled eggs complete the amino acid profile.',
      ingredients: [
        { name: 'Røkelaks', nameEN: 'Smoked salmon', amount: '100 g', section: 'Fisk' },
        { name: 'Egg', nameEN: 'Eggs', amount: '3 stk', section: 'Egg & Meieri' },
        { name: 'Smør', nameEN: 'Butter', amount: '1 ts', section: 'Egg & Meieri' },
        { name: 'Salt', nameEN: 'Salt', amount: 'etter smak', section: 'Krydder & Salt' }
      ],
      instructions: [
        'Kok eggene 7–8 min til de er hardkokte. Avkjøl i kaldt vann.',
        'Skjær eggene i to. Legg røkelaksen ved siden av.',
        'Topp med en liten klatt smør på eggene.'
      ],
      instructionsEN: [
        'Boil eggs 7–8 min until hard-boiled. Cool in cold water.',
        'Halve the eggs. Place smoked salmon alongside.',
        'Top with a small knob of butter on the eggs.'
      ],
      tags: ['quick', 'high-protein', 'fish', 'strict'],
      allergens: ['eggs', 'fish'],
      dietary: ['carnivore'],
      variant: ['strict', 'animal-based']
    },

    {
      id: 'carni-liver-bacon',
      name: 'Lever og Bacon',
      nameEN: 'Liver and Bacon',
      type: 'breakfast',
      prepTime: 15,
      pathways: {
        ketosis: 3, protein: 5, mtor: 4, autophagy: 4,
        omega: 2, collagen: 3, iron: 5, inflam: 4
      },
      scienceNote: 'Storfekjøttlever er naturens multivitamin — ekstremt rik på vitamin A, B12, folat og hemjern. Bacon balanserer den kraftige smaken og tilfører ekstra fett for ketose.',
      scienceNoteEN: 'Beef liver is nature\'s multivitamin — extremely rich in vitamin A, B12, folate and heme iron. Bacon balances the strong flavor and adds extra fat for ketosis.',
      ingredients: [
        { name: 'Storfekjøttlever', nameEN: 'Beef liver', amount: '150 g', section: 'Kjøtt' },
        { name: 'Bacon', nameEN: 'Bacon', amount: '100 g', section: 'Kjøtt' },
        { name: 'Smør', nameEN: 'Butter', amount: '1 ss', section: 'Egg & Meieri' },
        { name: 'Salt og pepper', nameEN: 'Salt and pepper', amount: 'etter smak', section: 'Krydder & Salt' }
      ],
      instructions: [
        'Stek baconet sprøtt. Legg til side.',
        'Skjær leveren i tynne skiver. Krydre med salt og pepper.',
        'Stek leveren raskt i smør og baconfett, 2 min per side. Ikke overstek!',
        'Server lever og bacon sammen.'
      ],
      instructionsEN: [
        'Fry bacon until crispy. Set aside.',
        'Slice liver thin. Season with salt and pepper.',
        'Quickly fry the liver in butter and bacon fat, 2 min per side. Don\'t overcook!',
        'Serve liver and bacon together.'
      ],
      tags: ['high-protein', 'organ-meat', 'strict'],
      allergens: [],
      dietary: ['carnivore'],
      variant: ['strict', 'animal-based']
    },

    {
      id: 'carni-sausage-eggs',
      name: 'Pølse og Speilegg',
      nameEN: 'Sausage and Fried Eggs',
      type: 'breakfast',
      prepTime: 10,
      pathways: {
        ketosis: 4, protein: 4, mtor: 3, autophagy: 2,
        omega: 1, collagen: 2, iron: 3, inflam: 2
      },
      scienceNote: 'En enkel og rask frokost med god fett-til-protein-ratio. Grillpølser gir rikelig kalorier fra fett, mens egg gir komplett protein og kolin.',
      scienceNoteEN: 'A simple, quick breakfast with good fat-to-protein ratio. Sausages provide ample calories from fat while eggs deliver complete protein and choline.',
      ingredients: [
        { name: 'Grillpølser', nameEN: 'Grilled sausages', amount: '3 stk', section: 'Kjøtt' },
        { name: 'Egg', nameEN: 'Eggs', amount: '2 stk', section: 'Egg & Meieri' },
        { name: 'Smør', nameEN: 'Butter', amount: '1 ss', section: 'Egg & Meieri' },
        { name: 'Salt', nameEN: 'Salt', amount: 'etter smak', section: 'Krydder & Salt' }
      ],
      instructions: [
        'Stek pølsene i en panne på middels varme til de er gylne.',
        'Smelt smør i pannen og stek speilegg.',
        'Server sammen.'
      ],
      instructionsEN: [
        'Fry sausages in a pan on medium heat until golden.',
        'Melt butter in the pan and fry eggs sunny-side up.',
        'Serve together.'
      ],
      tags: ['quick', 'budget', 'strict'],
      allergens: ['eggs'],
      dietary: ['carnivore'],
      variant: ['strict', 'animal-based']
    },

    {
      id: 'carni-ground-beef',
      name: 'Kjøttdeig og Egg',
      nameEN: 'Ground Beef and Eggs',
      type: 'breakfast',
      prepTime: 10,
      pathways: {
        ketosis: 4, protein: 5, mtor: 4, autophagy: 2,
        omega: 1, collagen: 2, iron: 4, inflam: 3
      },
      scienceNote: 'Kjøttdeig er en rimelig kilde til komplett protein og hemjern. Stekt med egg i smør gir dette et proteintett måltid som holder blodsukkeret stabilt i timevis.',
      scienceNoteEN: 'Ground beef is an affordable source of complete protein and heme iron. Fried with eggs in butter this delivers a protein-dense meal that keeps blood sugar stable for hours.',
      ingredients: [
        { name: 'Kjøttdeig', nameEN: 'Ground beef', amount: '150 g', section: 'Kjøtt' },
        { name: 'Egg', nameEN: 'Eggs', amount: '3 stk', section: 'Egg & Meieri' },
        { name: 'Smør', nameEN: 'Butter', amount: '1 ss', section: 'Egg & Meieri' },
        { name: 'Salt og pepper', nameEN: 'Salt and pepper', amount: 'etter smak', section: 'Krydder & Salt' }
      ],
      instructions: [
        'Brun kjøttdeigen i smør på middels-høy varme. Krydre med salt og pepper.',
        'Lag et hull i midten og knekk eggene oppi.',
        'Stek til eggene er ferdige. Rør alt sammen eller server separat.'
      ],
      instructionsEN: [
        'Brown ground beef in butter on medium-high heat. Season with salt and pepper.',
        'Make a well in the center and crack the eggs in.',
        'Cook until eggs are done. Mix together or serve separately.'
      ],
      tags: ['quick', 'high-protein', 'budget', 'strict'],
      allergens: ['eggs'],
      dietary: ['carnivore'],
      variant: ['strict', 'animal-based']
    },

    {
      id: 'carni-yogurt-honey',
      name: 'Gresk Yoghurt med Honning',
      nameEN: 'Greek Yogurt with Honey',
      type: 'breakfast',
      prepTime: 3,
      pathways: {
        ketosis: 1, protein: 3, mtor: 2, autophagy: 1,
        omega: 0, collagen: 1, iron: 0, inflam: 2
      },
      scienceNote: 'Gresk yoghurt er rik på kaseinprotein som gir langvarig metthet. Honning er det eneste søtningsmiddelet i animal-based-varianten og gir raskt tilgjengelig energi.',
      scienceNoteEN: 'Greek yogurt is rich in casein protein providing sustained satiety. Honey is the only sweetener in the animal-based variant and provides quickly available energy.',
      ingredients: [
        { name: 'Gresk yoghurt', nameEN: 'Greek yogurt', amount: '200 g', section: 'Egg & Meieri' },
        { name: 'Honning', nameEN: 'Honey', amount: '1 ss', section: 'Ekstra' },
        { name: 'Egg (kokt)', nameEN: 'Eggs (boiled)', amount: '2 stk', section: 'Egg & Meieri' }
      ],
      instructions: [
        'Kok eggene 7–8 min. Avkjøl.',
        'Ha yoghurt i en bolle, dryss honning over.',
        'Server med kokte egg ved siden av for ekstra protein.'
      ],
      instructionsEN: [
        'Boil eggs 7–8 min. Cool.',
        'Place yogurt in a bowl, drizzle honey on top.',
        'Serve with boiled eggs on the side for extra protein.'
      ],
      tags: ['quick', 'animal-based'],
      allergens: ['dairy', 'eggs'],
      dietary: ['carnivore'],
      variant: ['animal-based']
    },

    {
      id: 'carni-butter-eggs',
      name: 'Smørstekte Egg',
      nameEN: 'Butter-Fried Eggs',
      type: 'breakfast',
      prepTime: 5,
      pathways: {
        ketosis: 5, protein: 4, mtor: 3, autophagy: 3,
        omega: 1, collagen: 0, iron: 2, inflam: 3
      },
      scienceNote: 'Den enkleste carnivore-frokosten. Rikelig smør driver ketose mens fire egg gir ~24 g protein. Null karbohydrater holder insulinet på et minimum.',
      scienceNoteEN: 'The simplest carnivore breakfast. Generous butter drives ketosis while four eggs deliver ~24g protein. Zero carbs keep insulin at a minimum.',
      ingredients: [
        { name: 'Egg', nameEN: 'Eggs', amount: '4 stk', section: 'Egg & Meieri' },
        { name: 'Smør', nameEN: 'Butter', amount: '2 ss', section: 'Egg & Meieri' },
        { name: 'Salt', nameEN: 'Salt', amount: 'etter smak', section: 'Krydder & Salt' }
      ],
      instructions: [
        'Smelt rikelig smør i en panne på middels-lav varme.',
        'Knekk 4 egg i pannen. Øs smeltet smør over eggeplommene.',
        'Stek til ønsket konsistens. Krydre med salt.'
      ],
      instructionsEN: [
        'Melt generous butter in a pan on medium-low heat.',
        'Crack 4 eggs into the pan. Baste egg yolks with melted butter.',
        'Cook to desired doneness. Season with salt.'
      ],
      tags: ['quick', 'budget', 'strict'],
      allergens: ['eggs'],
      dietary: ['carnivore'],
      variant: ['strict', 'animal-based']
    },

    // ═══ LUNCH (10) ══════════════════════════════════════════════════════

    {
      id: 'carni-burger-patties',
      name: 'Burgerbiffer',
      nameEN: 'Burger Patties',
      type: 'lunch',
      prepTime: 15,
      pathways: {
        ketosis: 4, protein: 5, mtor: 5, autophagy: 2,
        omega: 1, collagen: 2, iron: 4, inflam: 3
      },
      scienceNote: 'Kjøttdeig formet til biffer gir en mettende, proteinrik lunsj. Det høye innholdet av leucin aktiverer mTOR-signalveien for muskelbygging.',
      scienceNoteEN: 'Ground beef formed into patties makes a satiating, protein-rich lunch. The high leucine content activates the mTOR signaling pathway for muscle building.',
      ingredients: [
        { name: 'Kjøttdeig', nameEN: 'Ground beef', amount: '200 g', section: 'Kjøtt' },
        { name: 'Smør', nameEN: 'Butter', amount: '1 ss', section: 'Egg & Meieri' },
        { name: 'Salt og pepper', nameEN: 'Salt and pepper', amount: 'etter smak', section: 'Krydder & Salt' }
      ],
      instructions: [
        'Form kjøttdeigen til 2 biffer. Krydre med salt og pepper.',
        'Stek i smør på høy varme, 3–4 min per side.',
        'Legg en ekstra klatt smør på toppen ved servering.'
      ],
      instructionsEN: [
        'Form ground beef into 2 patties. Season with salt and pepper.',
        'Fry in butter on high heat, 3–4 min per side.',
        'Place an extra knob of butter on top when serving.'
      ],
      tags: ['quick', 'high-protein', 'budget', 'strict'],
      allergens: [],
      dietary: ['carnivore'],
      variant: ['strict', 'animal-based']
    },

    {
      id: 'carni-salmon-butter',
      name: 'Laks med Smør',
      nameEN: 'Salmon with Butter',
      type: 'lunch',
      prepTime: 15,
      pathways: {
        ketosis: 4, protein: 4, mtor: 4, autophagy: 3,
        omega: 5, collagen: 2, iron: 2, inflam: 5
      },
      scienceNote: 'Laks er en av de beste kildene til EPA og DHA, som kraftig demper betennelse. Smør tilfører mettede fettsyrer og fettløselige vitaminer. Et optimalt anti-inflammatorisk måltid.',
      scienceNoteEN: 'Salmon is one of the best sources of EPA and DHA, which powerfully reduce inflammation. Butter adds saturated fatty acids and fat-soluble vitamins. An optimal anti-inflammatory meal.',
      ingredients: [
        { name: 'Laksefilet', nameEN: 'Salmon fillet', amount: '200 g', section: 'Fisk' },
        { name: 'Smør', nameEN: 'Butter', amount: '2 ss', section: 'Egg & Meieri' },
        { name: 'Salt', nameEN: 'Salt', amount: 'etter smak', section: 'Krydder & Salt' }
      ],
      instructions: [
        'Krydre laksen med salt.',
        'Smelt smør i en panne på middels varme.',
        'Stek laksen med skinnsiden ned først, 4 min. Snu og stek 3 min til.',
        'Server med ekstra smeltet smør over.'
      ],
      instructionsEN: [
        'Season salmon with salt.',
        'Melt butter in a pan on medium heat.',
        'Fry salmon skin-side down first, 4 min. Flip and cook 3 more min.',
        'Serve with extra melted butter on top.'
      ],
      tags: ['high-protein', 'fish', 'strict'],
      allergens: ['fish'],
      dietary: ['carnivore'],
      variant: ['strict', 'animal-based']
    },

    {
      id: 'carni-bone-broth-meal',
      name: 'Beinbuljong med Egg',
      nameEN: 'Bone Broth with Eggs',
      type: 'lunch',
      prepTime: 10,
      pathways: {
        ketosis: 3, protein: 3, mtor: 2, autophagy: 5,
        omega: 1, collagen: 5, iron: 1, inflam: 4
      },
      scienceNote: 'Beinbuljong er ekstremt rik på kollagen, glycin og glutamin som reparerer tarmslimhinnen. Glycin fremmer også autofagi. Kokte egg gir protein for å gjøre dette til et komplett måltid.',
      scienceNoteEN: 'Bone broth is extremely rich in collagen, glycine and glutamine that repair the gut lining. Glycine also promotes autophagy. Boiled eggs add protein to make this a complete meal.',
      ingredients: [
        { name: 'Beinbuljong (hjemmelaget)', nameEN: 'Bone broth (homemade)', amount: '4 dl', section: 'Kjøtt' },
        { name: 'Egg (kokt)', nameEN: 'Eggs (boiled)', amount: '3 stk', section: 'Egg & Meieri' },
        { name: 'Smør', nameEN: 'Butter', amount: '1 ss', section: 'Egg & Meieri' },
        { name: 'Salt', nameEN: 'Salt', amount: 'etter smak', section: 'Krydder & Salt' }
      ],
      instructions: [
        'Varm beinbuljong i en kjele.',
        'Kok egg 7–8 min, avkjøl og skrell.',
        'Hell buljong i en bolle, legg i smør og rør til det smelter.',
        'Halver eggene og legg dem oppi.'
      ],
      instructionsEN: [
        'Heat bone broth in a pot.',
        'Boil eggs 7–8 min, cool and peel.',
        'Pour broth in a bowl, add butter and stir until melted.',
        'Halve the eggs and place them in the broth.'
      ],
      tags: ['budget', 'strict'],
      allergens: ['eggs'],
      dietary: ['carnivore'],
      variant: ['strict', 'animal-based']
    },

    {
      id: 'carni-chicken-thighs',
      name: 'Kyllinglår med Skinn',
      nameEN: 'Chicken Thighs with Skin',
      type: 'lunch',
      prepTime: 40,
      pathways: {
        ketosis: 3, protein: 4, mtor: 4, autophagy: 2,
        omega: 1, collagen: 4, iron: 2, inflam: 3
      },
      scienceNote: 'Kyllinglår med skinn gir rikelig kollagen fra skinnet og mørkt kjøtt. Langsom ovnsbaking gjør skinnet sprøtt og bevarer saftig kollagenrikt kjøtt.',
      scienceNoteEN: 'Chicken thighs with skin provide abundant collagen from the skin and dark meat. Slow roasting makes the skin crispy while preserving juicy, collagen-rich meat.',
      ingredients: [
        { name: 'Kyllinglår med skinn', nameEN: 'Chicken thighs with skin', amount: '4 stk', section: 'Kjøtt' },
        { name: 'Smør', nameEN: 'Butter', amount: '1 ss', section: 'Egg & Meieri' },
        { name: 'Salt', nameEN: 'Salt', amount: 'rikelig', section: 'Krydder & Salt' }
      ],
      instructions: [
        'Sett ovnen på 200 °C.',
        'Gni kyllinglårene med smør og salt.',
        'Legg dem med skinnsiden opp på et stekebrett.',
        'Stek i 35–40 min til skinnet er sprøtt og gyllent.'
      ],
      instructionsEN: [
        'Preheat oven to 200 °C.',
        'Rub chicken thighs with butter and salt.',
        'Place them skin-side up on a baking tray.',
        'Roast 35–40 min until skin is crispy and golden.'
      ],
      tags: ['high-protein', 'budget', 'strict'],
      allergens: [],
      dietary: ['carnivore'],
      variant: ['strict', 'animal-based']
    },

    {
      id: 'carni-tuna-eggs',
      name: 'Tunfisk og Egg',
      nameEN: 'Tuna and Eggs',
      type: 'lunch',
      prepTime: 10,
      pathways: {
        ketosis: 3, protein: 5, mtor: 4, autophagy: 2,
        omega: 3, collagen: 1, iron: 2, inflam: 3
      },
      scienceNote: 'Tunfisk i olje er en effektiv proteinkilde rik på selen og omega-3. Kombinert med kokte egg gir dette et raskt og billig måltid med over 40 g protein.',
      scienceNoteEN: 'Canned tuna in oil is an efficient protein source rich in selenium and omega-3. Combined with boiled eggs this makes a quick and cheap meal with over 40g protein.',
      ingredients: [
        { name: 'Tunfisk i olje', nameEN: 'Tuna in oil', amount: '1 boks (140 g)', section: 'Fisk' },
        { name: 'Egg (kokt)', nameEN: 'Eggs (boiled)', amount: '3 stk', section: 'Egg & Meieri' },
        { name: 'Smør', nameEN: 'Butter', amount: '1 ts', section: 'Egg & Meieri' },
        { name: 'Salt og pepper', nameEN: 'Salt and pepper', amount: 'etter smak', section: 'Krydder & Salt' }
      ],
      instructions: [
        'Kok egg 7–8 min, avkjøl og skrell.',
        'Tøm tunfisken og legg på en tallerken.',
        'Halver eggene og legg ved siden av. Topp med smør og krydder.'
      ],
      instructionsEN: [
        'Boil eggs 7–8 min, cool and peel.',
        'Drain tuna and place on a plate.',
        'Halve eggs and place alongside. Top with butter and seasoning.'
      ],
      tags: ['quick', 'high-protein', 'fish', 'budget', 'strict'],
      allergens: ['fish', 'eggs'],
      dietary: ['carnivore'],
      variant: ['strict', 'animal-based']
    },

    {
      id: 'carni-pork-belly',
      name: 'Ovnsbakt Sideflesk',
      nameEN: 'Roasted Pork Belly',
      type: 'lunch',
      prepTime: 45,
      pathways: {
        ketosis: 5, protein: 3, mtor: 3, autophagy: 2,
        omega: 1, collagen: 3, iron: 2, inflam: 2
      },
      scienceNote: 'Sideflesk har svært høy fett-til-protein-ratio som driver dyp ketose. Skinnet gir kollagen. Et kaloririkt og mettende måltid som holder deg i fettforbrenning.',
      scienceNoteEN: 'Pork belly has a very high fat-to-protein ratio that drives deep ketosis. The rind provides collagen. A calorie-rich and satiating meal that keeps you in fat burning.',
      ingredients: [
        { name: 'Sideflesk/svineribbe', nameEN: 'Pork belly', amount: '300 g', section: 'Kjøtt' },
        { name: 'Grovt salt', nameEN: 'Coarse salt', amount: '2 ts', section: 'Krydder & Salt' }
      ],
      instructions: [
        'Sett ovnen på 180 °C.',
        'Skjær ruter i svoren. Gni inn med grovt salt.',
        'Legg på rist over en langpanne.',
        'Stek i 40–50 min til svoren er sprø.'
      ],
      instructionsEN: [
        'Preheat oven to 180 °C.',
        'Score the rind in a diamond pattern. Rub with coarse salt.',
        'Place on a rack over a roasting pan.',
        'Roast 40–50 min until rind is crackling crispy.'
      ],
      tags: ['strict'],
      allergens: [],
      dietary: ['carnivore'],
      variant: ['strict', 'animal-based']
    },

    {
      id: 'carni-shrimp-butter',
      name: 'Smørstekte Reker',
      nameEN: 'Butter-Fried Shrimp',
      type: 'lunch',
      prepTime: 10,
      pathways: {
        ketosis: 3, protein: 4, mtor: 3, autophagy: 2,
        omega: 3, collagen: 2, iron: 2, inflam: 3
      },
      scienceNote: 'Reker er lave i kalorier men rike på protein, selen og astaxanthin — en kraftig antioksidant. Smør tilfører fett for metthet og energi.',
      scienceNoteEN: 'Shrimp are low in calories but rich in protein, selenium and astaxanthin — a potent antioxidant. Butter adds fat for satiety and energy.',
      ingredients: [
        { name: 'Reker (pillede)', nameEN: 'Shrimp (peeled)', amount: '250 g', section: 'Fisk' },
        { name: 'Smør', nameEN: 'Butter', amount: '2 ss', section: 'Egg & Meieri' },
        { name: 'Salt', nameEN: 'Salt', amount: 'etter smak', section: 'Krydder & Salt' }
      ],
      instructions: [
        'Smelt smør i en panne på middels-høy varme.',
        'Legg i rekene og stek i 3–4 min til de er gjennomvarme.',
        'Krydre med salt. Server straks.'
      ],
      instructionsEN: [
        'Melt butter in a pan on medium-high heat.',
        'Add shrimp and cook 3–4 min until heated through.',
        'Season with salt. Serve immediately.'
      ],
      tags: ['quick', 'fish', 'strict'],
      allergens: ['shellfish'],
      dietary: ['carnivore'],
      variant: ['strict', 'animal-based']
    },

    {
      id: 'carni-meatballs',
      name: 'Hjemmelagde Kjøttboller',
      nameEN: 'Homemade Meatballs',
      type: 'lunch',
      prepTime: 20,
      pathways: {
        ketosis: 4, protein: 5, mtor: 4, autophagy: 2,
        omega: 1, collagen: 2, iron: 4, inflam: 3
      },
      scienceNote: 'Kjøttboller med egg som bindemiddel gir et proteintett, komplett måltid. Smørstekingen tilfører fett for ketose og gir fantastisk smak.',
      scienceNoteEN: 'Meatballs with egg as binder create a protein-dense, complete meal. The butter frying adds fat for ketosis and delivers great flavor.',
      ingredients: [
        { name: 'Kjøttdeig', nameEN: 'Ground beef', amount: '300 g', section: 'Kjøtt' },
        { name: 'Egg', nameEN: 'Egg', amount: '1 stk', section: 'Egg & Meieri' },
        { name: 'Smør', nameEN: 'Butter', amount: '2 ss', section: 'Egg & Meieri' },
        { name: 'Salt og pepper', nameEN: 'Salt and pepper', amount: 'etter smak', section: 'Krydder & Salt' }
      ],
      instructions: [
        'Bland kjøttdeig, egg, salt og pepper.',
        'Form til små boller (ca. 12 stk).',
        'Smelt smør i en panne på middels varme.',
        'Stek bollene i 8–10 min, snu jevnlig til de er brune og gjennomstekte.'
      ],
      instructionsEN: [
        'Mix ground beef, egg, salt and pepper.',
        'Form into small balls (about 12 pcs).',
        'Melt butter in a pan on medium heat.',
        'Fry the meatballs 8–10 min, turning regularly until browned and cooked through.'
      ],
      tags: ['high-protein', 'budget', 'strict'],
      allergens: ['eggs'],
      dietary: ['carnivore'],
      variant: ['strict', 'animal-based']
    },

    {
      id: 'carni-cheese-meat',
      name: 'Kjøtt- og Ostetallerken',
      nameEN: 'Meat and Cheese Platter',
      type: 'lunch',
      prepTime: 5,
      pathways: {
        ketosis: 4, protein: 4, mtor: 3, autophagy: 1,
        omega: 1, collagen: 1, iron: 2, inflam: 2
      },
      scienceNote: 'En enkel tallerken med påleggskjøtt og ost gir en balanse av kasein og kjøttprotein. Kasein fordøyes sakte og gir langvarig metthet, mens skinke og salami gir raskt protein.',
      scienceNoteEN: 'A simple platter of cured meats and cheese provides a balance of casein and meat protein. Casein digests slowly for sustained satiety while ham and salami provide quick protein.',
      ingredients: [
        { name: 'Kokt skinke', nameEN: 'Cooked ham', amount: '80 g', section: 'Kjøtt' },
        { name: 'Salami', nameEN: 'Salami', amount: '60 g', section: 'Kjøtt' },
        { name: 'Norvegia ost', nameEN: 'Norwegian cheese', amount: '60 g', section: 'Egg & Meieri' },
        { name: 'Egg (kokt)', nameEN: 'Eggs (boiled)', amount: '2 stk', section: 'Egg & Meieri' }
      ],
      instructions: [
        'Kok egg 7–8 min, avkjøl og skrell.',
        'Legg skinke, salami og osteskiver på en tallerken.',
        'Halver eggene og legg ved siden av.'
      ],
      instructionsEN: [
        'Boil eggs 7–8 min, cool and peel.',
        'Arrange ham, salami and cheese slices on a plate.',
        'Halve eggs and place alongside.'
      ],
      tags: ['quick', 'animal-based'],
      allergens: ['dairy', 'eggs'],
      dietary: ['carnivore'],
      variant: ['animal-based']
    },

    {
      id: 'carni-sardines',
      name: 'Sardiner med Egg',
      nameEN: 'Sardines with Eggs',
      type: 'lunch',
      prepTime: 10,
      pathways: {
        ketosis: 3, protein: 4, mtor: 3, autophagy: 3,
        omega: 5, collagen: 3, iron: 3, inflam: 5
      },
      scienceNote: 'Sardiner er en av de mest næringstette matvarene — rike på omega-3, kalsium (fra beina), selen og vitamin D. Sammen med egg gir de et komplett, rimelig og svært anti-inflammatorisk måltid.',
      scienceNoteEN: 'Sardines are one of the most nutrient-dense foods — rich in omega-3, calcium (from bones), selenium and vitamin D. Together with eggs they make a complete, affordable and highly anti-inflammatory meal.',
      ingredients: [
        { name: 'Sardiner i olje', nameEN: 'Sardines in oil', amount: '1 boks (120 g)', section: 'Fisk' },
        { name: 'Egg (kokt)', nameEN: 'Eggs (boiled)', amount: '2 stk', section: 'Egg & Meieri' },
        { name: 'Smør', nameEN: 'Butter', amount: '1 ts', section: 'Egg & Meieri' },
        { name: 'Salt', nameEN: 'Salt', amount: 'etter smak', section: 'Krydder & Salt' }
      ],
      instructions: [
        'Kok egg 7–8 min, avkjøl og skrell.',
        'Åpne sardinesken og legg innholdet på en tallerken.',
        'Halver eggene og legg ved siden av. Topp eggene med smør.'
      ],
      instructionsEN: [
        'Boil eggs 7–8 min, cool and peel.',
        'Open the sardine can and place contents on a plate.',
        'Halve eggs and place alongside. Top eggs with butter.'
      ],
      tags: ['quick', 'fish', 'budget', 'strict'],
      allergens: ['fish', 'eggs'],
      dietary: ['carnivore'],
      variant: ['strict', 'animal-based']
    },

    // ═══ DINNER (10) ═════════════════════════════════════════════════════

    {
      id: 'carni-ribeye',
      name: 'Entrecôte',
      nameEN: 'Ribeye Steak',
      type: 'dinner',
      prepTime: 20,
      pathways: {
        ketosis: 4, protein: 5, mtor: 5, autophagy: 3,
        omega: 2, collagen: 2, iron: 5, inflam: 4
      },
      scienceNote: 'Entrecôte er den ultimate carnivore-middag. Fettet i marmoreringen driver ketose, mens det høye proteininnholdet gir maksimal leucin for mTOR-aktivering. Rik på hemjern, sink og B-vitaminer.',
      scienceNoteEN: 'Ribeye is the ultimate carnivore dinner. The marbling fat drives ketosis while the high protein content delivers maximum leucine for mTOR activation. Rich in heme iron, zinc and B vitamins.',
      ingredients: [
        { name: 'Entrecôte', nameEN: 'Ribeye steak', amount: '250 g', section: 'Kjøtt' },
        { name: 'Smør', nameEN: 'Butter', amount: '2 ss', section: 'Egg & Meieri' },
        { name: 'Salt og pepper', nameEN: 'Salt and pepper', amount: 'rikelig', section: 'Krydder & Salt' }
      ],
      instructions: [
        'Ta biffen ut av kjøleskapet 30 min før steking.',
        'Krydre rikelig med salt og pepper.',
        'Stek i svært varm panne med smør, 3–4 min per side for medium.',
        'Hvil kjøttet 5 min under folie. Server med smeltet smør over.'
      ],
      instructionsEN: [
        'Take steak out of fridge 30 min before cooking.',
        'Season generously with salt and pepper.',
        'Sear in a very hot pan with butter, 3–4 min per side for medium.',
        'Rest the meat 5 min under foil. Serve with melted butter on top.'
      ],
      tags: ['high-protein', 'strict'],
      allergens: [],
      dietary: ['carnivore'],
      variant: ['strict', 'animal-based']
    },

    {
      id: 'carni-lamb-chops',
      name: 'Lammekotteletter',
      nameEN: 'Lamb Chops',
      type: 'dinner',
      prepTime: 20,
      pathways: {
        ketosis: 4, protein: 5, mtor: 5, autophagy: 3,
        omega: 2, collagen: 3, iron: 4, inflam: 4
      },
      scienceNote: 'Lammekjøtt er rik på CLA (konjugert linolsyre) som kan ha fettforbrennende egenskaper. Lam fra norske beiter har høyere omega-3-innhold enn konvensjonelt kjøtt.',
      scienceNoteEN: 'Lamb is rich in CLA (conjugated linoleic acid) which may have fat-burning properties. Norwegian pasture-raised lamb has higher omega-3 content than conventional meat.',
      ingredients: [
        { name: 'Lammekotteletter', nameEN: 'Lamb chops', amount: '4 stk (ca. 300 g)', section: 'Kjøtt' },
        { name: 'Smør', nameEN: 'Butter', amount: '1 ss', section: 'Egg & Meieri' },
        { name: 'Salt og pepper', nameEN: 'Salt and pepper', amount: 'etter smak', section: 'Krydder & Salt' }
      ],
      instructions: [
        'La kotelettene temperere 20 min utenfor kjøleskapet.',
        'Krydre med salt og pepper.',
        'Stek i smør på høy varme, 3 min per side for rosa midten.',
        'Hvil 3–5 min før servering.'
      ],
      instructionsEN: [
        'Let chops come to room temperature 20 min out of the fridge.',
        'Season with salt and pepper.',
        'Sear in butter on high heat, 3 min per side for pink center.',
        'Rest 3–5 min before serving.'
      ],
      tags: ['high-protein', 'strict'],
      allergens: [],
      dietary: ['carnivore'],
      variant: ['strict', 'animal-based']
    },

    {
      id: 'carni-salmon-skin',
      name: 'Hel Laksefilet med Skinn',
      nameEN: 'Whole Salmon Fillet with Skin',
      type: 'dinner',
      prepTime: 25,
      pathways: {
        ketosis: 4, protein: 4, mtor: 4, autophagy: 3,
        omega: 5, collagen: 3, iron: 2, inflam: 5
      },
      scienceNote: 'Ovnsbakt laks med skinn bevarer alle omega-3-fettsyrene og gir sprøtt skinn fullt av kollagen. Laks er den beste DHA-kilden i norsk dagligvare.',
      scienceNoteEN: 'Oven-baked salmon with skin preserves all omega-3 fatty acids and provides crispy skin full of collagen. Salmon is the best DHA source in Norwegian grocery stores.',
      ingredients: [
        { name: 'Laksefilet med skinn', nameEN: 'Salmon fillet with skin', amount: '250 g', section: 'Fisk' },
        { name: 'Smør', nameEN: 'Butter', amount: '1 ss', section: 'Egg & Meieri' },
        { name: 'Salt', nameEN: 'Salt', amount: 'etter smak', section: 'Krydder & Salt' }
      ],
      instructions: [
        'Sett ovnen på 200 °C.',
        'Legg laksen med skinnsiden ned på bakepapir.',
        'Smør over med smør og salt.',
        'Stek i 15–18 min til fisken flaker lett.'
      ],
      instructionsEN: [
        'Preheat oven to 200 °C.',
        'Place salmon skin-side down on baking paper.',
        'Brush with butter and salt.',
        'Bake 15–18 min until fish flakes easily.'
      ],
      tags: ['high-protein', 'fish', 'strict'],
      allergens: ['fish'],
      dietary: ['carnivore'],
      variant: ['strict', 'animal-based']
    },

    {
      id: 'carni-ground-beef-dinner',
      name: 'Kjøttdeig Middag',
      nameEN: 'Ground Beef Dinner',
      type: 'dinner',
      prepTime: 15,
      pathways: {
        ketosis: 4, protein: 5, mtor: 4, autophagy: 2,
        omega: 1, collagen: 2, iron: 4, inflam: 3
      },
      scienceNote: 'En generøs porsjon kjøttdeig er den mest rimelige veien til høyt protein- og jerninntak. 300 g kjøttdeig gir ca. 60 g protein og dekker mesteparten av daglig jernbehov.',
      scienceNoteEN: 'A generous portion of ground beef is the most affordable path to high protein and iron intake. 300g ground beef delivers ~60g protein and covers most daily iron needs.',
      ingredients: [
        { name: 'Kjøttdeig', nameEN: 'Ground beef', amount: '300 g', section: 'Kjøtt' },
        { name: 'Smør', nameEN: 'Butter', amount: '2 ss', section: 'Egg & Meieri' },
        { name: 'Salt og pepper', nameEN: 'Salt and pepper', amount: 'etter smak', section: 'Krydder & Salt' }
      ],
      instructions: [
        'Smelt smør i en stor panne på middels-høy varme.',
        'Brun kjøttdeigen i 8–10 min. Bryt opp klumper med en stekespade.',
        'Krydre med salt og pepper. Server med ekstra smør om ønskelig.'
      ],
      instructionsEN: [
        'Melt butter in a large pan on medium-high heat.',
        'Brown ground beef 8–10 min. Break up lumps with a spatula.',
        'Season with salt and pepper. Serve with extra butter if desired.'
      ],
      tags: ['quick', 'high-protein', 'budget', 'strict'],
      allergens: [],
      dietary: ['carnivore'],
      variant: ['strict', 'animal-based']
    },

    {
      id: 'carni-pork-chops',
      name: 'Svinekoteletter',
      nameEN: 'Pork Chops',
      type: 'dinner',
      prepTime: 20,
      pathways: {
        ketosis: 3, protein: 4, mtor: 4, autophagy: 2,
        omega: 1, collagen: 3, iron: 3, inflam: 3
      },
      scienceNote: 'Svinekoteletter er en god kilde til tiamin (vitamin B1) og gir en bra mengde protein med moderat fettinnhold. Kollagen fra bein og bindevev støtter ledd og hud.',
      scienceNoteEN: 'Pork chops are a good source of thiamine (vitamin B1) and provide ample protein with moderate fat content. Collagen from bone and connective tissue supports joints and skin.',
      ingredients: [
        { name: 'Svinekoteletter', nameEN: 'Pork chops', amount: '2 stk (ca. 300 g)', section: 'Kjøtt' },
        { name: 'Smør', nameEN: 'Butter', amount: '2 ss', section: 'Egg & Meieri' },
        { name: 'Salt og pepper', nameEN: 'Salt and pepper', amount: 'etter smak', section: 'Krydder & Salt' }
      ],
      instructions: [
        'La kotelettene temperere 15 min utenfor kjøleskapet.',
        'Krydre med salt og pepper.',
        'Smelt smør i panne på middels-høy varme.',
        'Stek 4–5 min per side til gjennomstekt. Hvil 3 min.'
      ],
      instructionsEN: [
        'Let chops come to room temperature 15 min out of fridge.',
        'Season with salt and pepper.',
        'Melt butter in pan on medium-high heat.',
        'Fry 4–5 min per side until cooked through. Rest 3 min.'
      ],
      tags: ['high-protein', 'budget', 'strict'],
      allergens: [],
      dietary: ['carnivore'],
      variant: ['strict', 'animal-based']
    },

    {
      id: 'carni-whole-chicken',
      name: 'Helstekt Kylling',
      nameEN: 'Whole Roast Chicken',
      type: 'dinner',
      prepTime: 70,
      pathways: {
        ketosis: 3, protein: 5, mtor: 4, autophagy: 2,
        omega: 1, collagen: 4, iron: 2, inflam: 3
      },
      scienceNote: 'Helstekt kylling med smør under skinnet gir rikelig kollagen fra skinn, brusk og ben. Mørkt kjøtt (lår) har mer jern og sink enn brystkjøtt. Bena kan brukes til beinbuljong.',
      scienceNoteEN: 'Whole roast chicken with butter under the skin provides abundant collagen from skin, cartilage and bones. Dark meat (thighs) has more iron and zinc than breast. Bones can be used for bone broth.',
      ingredients: [
        { name: 'Hel kylling', nameEN: 'Whole chicken', amount: '1 stk (ca. 1.5 kg)', section: 'Kjøtt' },
        { name: 'Smør', nameEN: 'Butter', amount: '3 ss', section: 'Egg & Meieri' },
        { name: 'Salt', nameEN: 'Salt', amount: 'rikelig', section: 'Krydder & Salt' }
      ],
      instructions: [
        'Sett ovnen på 190 °C.',
        'Løsne skinnet forsiktig og fordel smør under det.',
        'Gni utsiden med salt.',
        'Stek i 60–70 min (til kjøtttermometeret viser 74 °C i låret).',
        'Hvil 10 min før oppskjæring.'
      ],
      instructionsEN: [
        'Preheat oven to 190 °C.',
        'Gently loosen the skin and spread butter underneath.',
        'Rub the outside with salt.',
        'Roast 60–70 min (until meat thermometer reads 74 °C in thigh).',
        'Rest 10 min before carving.'
      ],
      tags: ['high-protein', 'budget', 'strict'],
      allergens: [],
      dietary: ['carnivore'],
      variant: ['strict', 'animal-based']
    },

    {
      id: 'carni-mackerel',
      name: 'Stekt Makrell',
      nameEN: 'Pan-Fried Mackerel',
      type: 'dinner',
      prepTime: 15,
      pathways: {
        ketosis: 4, protein: 4, mtor: 3, autophagy: 3,
        omega: 5, collagen: 2, iron: 2, inflam: 5
      },
      scienceNote: 'Makrell er en av de feiteste fiskene med ekstremt høyt innhold av omega-3. Stekt i smør blir den saftig og smaksrik. En av de beste matvarene for å redusere systemisk betennelse.',
      scienceNoteEN: 'Mackerel is one of the fattiest fish with extremely high omega-3 content. Pan-fried in butter it becomes juicy and flavorful. One of the best foods for reducing systemic inflammation.',
      ingredients: [
        { name: 'Makrellfilet', nameEN: 'Mackerel fillet', amount: '2 stk (ca. 250 g)', section: 'Fisk' },
        { name: 'Smør', nameEN: 'Butter', amount: '2 ss', section: 'Egg & Meieri' },
        { name: 'Salt', nameEN: 'Salt', amount: 'etter smak', section: 'Krydder & Salt' }
      ],
      instructions: [
        'Krydre makrellfiletene med salt.',
        'Smelt smør i en panne på middels-høy varme.',
        'Stek fisken med skinnsiden ned først, 3 min.',
        'Snu forsiktig og stek 2–3 min til. Server med smeltet smør.'
      ],
      instructionsEN: [
        'Season mackerel fillets with salt.',
        'Melt butter in a pan on medium-high heat.',
        'Fry fish skin-side down first, 3 min.',
        'Flip carefully and cook 2–3 more min. Serve with melted butter.'
      ],
      tags: ['fish', 'strict'],
      allergens: ['fish'],
      dietary: ['carnivore'],
      variant: ['strict', 'animal-based']
    },

    {
      id: 'carni-beef-liver-dinner',
      name: 'Lever med Smør',
      nameEN: 'Liver with Butter',
      type: 'dinner',
      prepTime: 15,
      pathways: {
        ketosis: 2, protein: 5, mtor: 4, autophagy: 4,
        omega: 2, collagen: 3, iron: 5, inflam: 4
      },
      scienceNote: 'Storfekjøttlever er det mest næringstette organet — inneholder enorme mengder vitamin A, B12, folat, kobber og hemjern. Anbefalt å spise 100–200 g 1–2 ganger i uken for optimal ernæring.',
      scienceNoteEN: 'Beef liver is the most nutrient-dense organ — contains enormous amounts of vitamin A, B12, folate, copper and heme iron. Recommended to eat 100–200g 1–2 times per week for optimal nutrition.',
      ingredients: [
        { name: 'Storfekjøttlever', nameEN: 'Beef liver', amount: '200 g', section: 'Kjøtt' },
        { name: 'Smør', nameEN: 'Butter', amount: '2 ss', section: 'Egg & Meieri' },
        { name: 'Salt og pepper', nameEN: 'Salt and pepper', amount: 'etter smak', section: 'Krydder & Salt' }
      ],
      instructions: [
        'Skjær leveren i ca. 1 cm tykke skiver.',
        'Krydre med salt og pepper.',
        'Smelt smør i en panne på middels-høy varme.',
        'Stek leveren raskt — 2 min per side. Den skal være rosa inni.',
        'Server umiddelbart med ekstra smør.'
      ],
      instructionsEN: [
        'Slice liver into about 1 cm thick pieces.',
        'Season with salt and pepper.',
        'Melt butter in a pan on medium-high heat.',
        'Fry liver quickly — 2 min per side. It should be pink inside.',
        'Serve immediately with extra butter.'
      ],
      tags: ['high-protein', 'organ-meat', 'strict'],
      allergens: [],
      dietary: ['carnivore'],
      variant: ['strict', 'animal-based']
    },

    {
      id: 'carni-burger-cheese',
      name: 'Osteburgere',
      nameEN: 'Cheeseburgers',
      type: 'dinner',
      prepTime: 15,
      pathways: {
        ketosis: 4, protein: 5, mtor: 4, autophagy: 1,
        omega: 1, collagen: 2, iron: 4, inflam: 2
      },
      scienceNote: 'Burgere med ost og bacon kombinerer kjøttprotein med kasein fra ost for langsommere aminosyreopptask. Uten brød får du et rendyrket proteint- og fettmåltid i ketose.',
      scienceNoteEN: 'Burgers with cheese and bacon combine meat protein with casein from cheese for slower amino acid uptake. Without bun you get a pure protein and fat meal in ketosis.',
      ingredients: [
        { name: 'Kjøttdeig', nameEN: 'Ground beef', amount: '250 g', section: 'Kjøtt' },
        { name: 'Norvegia ost', nameEN: 'Norwegian cheese', amount: '2 skiver', section: 'Egg & Meieri' },
        { name: 'Bacon', nameEN: 'Bacon', amount: '4 skiver', section: 'Kjøtt' },
        { name: 'Smør', nameEN: 'Butter', amount: '1 ss', section: 'Egg & Meieri' },
        { name: 'Salt og pepper', nameEN: 'Salt and pepper', amount: 'etter smak', section: 'Krydder & Salt' }
      ],
      instructions: [
        'Stek baconet sprøtt i en panne. Legg til side.',
        'Form kjøttdeigen til 2 burgere. Krydre med salt og pepper.',
        'Stek i smør på høy varme, 3–4 min per side.',
        'Legg ost på toppen og la den smelte med lokk på.',
        'Topp med sprøtt bacon.'
      ],
      instructionsEN: [
        'Fry bacon crispy in a pan. Set aside.',
        'Form ground beef into 2 patties. Season with salt and pepper.',
        'Sear in butter on high heat, 3–4 min per side.',
        'Place cheese on top and let it melt with lid on.',
        'Top with crispy bacon.'
      ],
      tags: ['high-protein', 'animal-based'],
      allergens: ['dairy'],
      dietary: ['carnivore'],
      variant: ['animal-based']
    },

    {
      id: 'carni-stew',
      name: 'Kjøttgryte',
      nameEN: 'Beef Stew',
      type: 'dinner',
      prepTime: 120,
      pathways: {
        ketosis: 3, protein: 5, mtor: 4, autophagy: 4,
        omega: 1, collagen: 4, iron: 4, inflam: 4
      },
      scienceNote: 'Langtidskokt biffkjøtt i beinbuljong bryter ned kollagen til gelatin, som er svært gunstig for tarmhelse og ledd. Buljongbasisen gir ekstra glycin for autofagi.',
      scienceNoteEN: 'Slow-cooked beef in bone broth breaks down collagen into gelatin, highly beneficial for gut health and joints. The broth base provides extra glycine for autophagy.',
      ingredients: [
        { name: 'Biffkjøtt (grytekjøtt)', nameEN: 'Stewing beef', amount: '400 g', section: 'Kjøtt' },
        { name: 'Beinbuljong', nameEN: 'Bone broth', amount: '5 dl', section: 'Kjøtt' },
        { name: 'Smør', nameEN: 'Butter', amount: '2 ss', section: 'Egg & Meieri' },
        { name: 'Salt og pepper', nameEN: 'Salt and pepper', amount: 'etter smak', section: 'Krydder & Salt' }
      ],
      instructions: [
        'Skjær kjøttet i terninger. Krydre med salt og pepper.',
        'Brun kjøttet i smør i en gryte på høy varme.',
        'Hell over beinbuljong. Kok opp.',
        'Senk varmen og la det småkoke i 1.5–2 timer til kjøttet er mørt.',
        'Smak til med salt og pepper.'
      ],
      instructionsEN: [
        'Cut beef into cubes. Season with salt and pepper.',
        'Brown the meat in butter in a pot on high heat.',
        'Pour over bone broth. Bring to a boil.',
        'Reduce heat and let simmer 1.5–2 hours until meat is tender.',
        'Adjust seasoning with salt and pepper.'
      ],
      tags: ['high-protein', 'strict'],
      allergens: [],
      dietary: ['carnivore'],
      variant: ['strict', 'animal-based']
    }

  ];

  // ─────────────────────────────────────────────────────────────────────────
  // CARNIVORE_WEEKLY_PLANS — 4 weekly plans (3 meal slots: breakfast/lunch/dinner)
  // ─────────────────────────────────────────────────────────────────────────

  window.CARNIVORE_WEEKLY_PLANS = [

    // ── Week 1: Simple Start ─────────────────────────────────────────────
    {
      id: 'carni-week-1',
      name: 'Uke 1 — Enkel Start',
      nameEN: 'Week 1 — Simple Start',
      description: 'Enkle, trygge retter for å komme i gang med carnivore. Fokus på kjøttdeig, egg, bacon og biff.',
      descriptionEN: 'Simple, safe dishes to get started with carnivore. Focus on ground beef, eggs, bacon and steak.',
      days: [
        { day: 'Mandag',  meals: { breakfast: 'carni-bacon-eggs',     lunch: 'carni-burger-patties',   dinner: 'carni-ribeye' } },
        { day: 'Tirsdag', meals: { breakfast: 'carni-butter-eggs',    lunch: 'carni-meatballs',        dinner: 'carni-ground-beef-dinner' } },
        { day: 'Onsdag',  meals: { breakfast: 'carni-ground-beef',    lunch: 'carni-tuna-eggs',        dinner: 'carni-pork-chops' } },
        { day: 'Torsdag', meals: { breakfast: 'carni-bacon-eggs',     lunch: 'carni-burger-patties',   dinner: 'carni-ribeye' } },
        { day: 'Fredag',  meals: { breakfast: 'carni-sausage-eggs',   lunch: 'carni-salmon-butter',    dinner: 'carni-ground-beef-dinner' } },
        { day: 'Lørdag',  meals: { breakfast: 'carni-steak-eggs',     lunch: 'carni-shrimp-butter',    dinner: 'carni-lamb-chops' } },
        { day: 'Søndag',  meals: { breakfast: 'carni-omelette',       lunch: 'carni-chicken-thighs',   dinner: 'carni-pork-chops' } }
      ]
    },

    // ── Week 2: Variety ──────────────────────────────────────────────────
    {
      id: 'carni-week-2',
      name: 'Uke 2 — Variasjon',
      nameEN: 'Week 2 — Variety',
      description: 'Introduserer fisk, beinbuljong og mer variert kjøtt. Bygg et bredere repertoar.',
      descriptionEN: 'Introduces fish, bone broth and more varied meats. Build a broader repertoire.',
      days: [
        { day: 'Mandag',  meals: { breakfast: 'carni-salmon-eggs',    lunch: 'carni-bone-broth-meal',  dinner: 'carni-ribeye' } },
        { day: 'Tirsdag', meals: { breakfast: 'carni-bacon-eggs',     lunch: 'carni-sardines',         dinner: 'carni-pork-chops' } },
        { day: 'Onsdag',  meals: { breakfast: 'carni-butter-eggs',    lunch: 'carni-salmon-butter',    dinner: 'carni-lamb-chops' } },
        { day: 'Torsdag', meals: { breakfast: 'carni-ground-beef',    lunch: 'carni-shrimp-butter',    dinner: 'carni-mackerel' } },
        { day: 'Fredag',  meals: { breakfast: 'carni-sausage-eggs',   lunch: 'carni-tuna-eggs',        dinner: 'carni-ground-beef-dinner' } },
        { day: 'Lørdag',  meals: { breakfast: 'carni-steak-eggs',     lunch: 'carni-meatballs',        dinner: 'carni-salmon-skin' } },
        { day: 'Søndag',  meals: { breakfast: 'carni-omelette',       lunch: 'carni-chicken-thighs',   dinner: 'carni-stew' } }
      ]
    },

    // ── Week 3: Advanced ─────────────────────────────────────────────────
    {
      id: 'carni-week-3',
      name: 'Uke 3 — Avansert',
      nameEN: 'Week 3 — Advanced',
      description: 'Innmat, hel fisk og langtidskoking. For deg som vil utforske alle aspekter av carnivore.',
      descriptionEN: 'Organ meats, whole fish and slow cooking. For those wanting to explore all aspects of carnivore.',
      days: [
        { day: 'Mandag',  meals: { breakfast: 'carni-liver-bacon',    lunch: 'carni-sardines',         dinner: 'carni-stew' } },
        { day: 'Tirsdag', meals: { breakfast: 'carni-bacon-eggs',     lunch: 'carni-bone-broth-meal',  dinner: 'carni-mackerel' } },
        { day: 'Onsdag',  meals: { breakfast: 'carni-salmon-eggs',    lunch: 'carni-pork-belly',       dinner: 'carni-ribeye' } },
        { day: 'Torsdag', meals: { breakfast: 'carni-butter-eggs',    lunch: 'carni-meatballs',        dinner: 'carni-beef-liver-dinner' } },
        { day: 'Fredag',  meals: { breakfast: 'carni-ground-beef',    lunch: 'carni-salmon-butter',    dinner: 'carni-whole-chicken' } },
        { day: 'Lørdag',  meals: { breakfast: 'carni-steak-eggs',     lunch: 'carni-shrimp-butter',    dinner: 'carni-lamb-chops' } },
        { day: 'Søndag',  meals: { breakfast: 'carni-liver-bacon',    lunch: 'carni-chicken-thighs',   dinner: 'carni-salmon-skin' } }
      ]
    },

    // ── Week 4: Mastery ──────────────────────────────────────────────────
    {
      id: 'carni-week-4',
      name: 'Uke 4 — Mestring',
      nameEN: 'Week 4 — Mastery',
      description: 'Blanding av alt — innmat, fisk, biff og kreative kombinasjoner. Du mestrer carnivore!',
      descriptionEN: 'Mix of everything — organ meats, fish, steak and creative combinations. You\'ve mastered carnivore!',
      days: [
        { day: 'Mandag',  meals: { breakfast: 'carni-omelette',       lunch: 'carni-sardines',         dinner: 'carni-ribeye' } },
        { day: 'Tirsdag', meals: { breakfast: 'carni-liver-bacon',    lunch: 'carni-bone-broth-meal',  dinner: 'carni-salmon-skin' } },
        { day: 'Onsdag',  meals: { breakfast: 'carni-salmon-eggs',    lunch: 'carni-burger-patties',   dinner: 'carni-whole-chicken' } },
        { day: 'Torsdag', meals: { breakfast: 'carni-bacon-eggs',     lunch: 'carni-pork-belly',       dinner: 'carni-beef-liver-dinner' } },
        { day: 'Fredag',  meals: { breakfast: 'carni-steak-eggs',     lunch: 'carni-shrimp-butter',    dinner: 'carni-mackerel' } },
        { day: 'Lørdag',  meals: { breakfast: 'carni-butter-eggs',    lunch: 'carni-salmon-butter',    dinner: 'carni-stew' } },
        { day: 'Søndag',  meals: { breakfast: 'carni-ground-beef',    lunch: 'carni-tuna-eggs',        dinner: 'carni-lamb-chops' } }
      ]
    }

  ];

})();
