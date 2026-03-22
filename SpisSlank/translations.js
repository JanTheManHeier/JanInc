/* translations.js — bilingual (no/en) translation system for SpisSlank */
(function () {
  'use strict';

  var LANG_KEY = 'spisslank-language';

  var TRANSLATIONS = {
    no: {
      // Navigation
      'nav.today':       'I dag',
      'nav.week':        'Uke',
      'nav.shopping':    'Handel',
      'nav.science':     'Vitenskap',
      'nav.settings':    'Innstillinger',

      // Today view
      'today.title':           'I dag',
      'today.pathwayCoverage': 'Veier dekket i dag',
      'today.coverage':        'Dekning',
      'today.showDetails':     'Vis detaljer',
      'today.hideDetails':     'Skjul detaljer',
      'today.swap':            '🔄 Bytt',
      'today.ingredients':     'Ingredienser',
      'today.instructions':    'Fremgangsmåte',
      'today.scienceNote':     '🔬 Hvorfor dette virker',
      'today.drugEquivalent':  '💊 Medisin-ekvivalent',
      'today.prepTime':        'min',

      // Week view
      'week.title':      'Ukeoversikt',
      'week.weekPrefix': 'Uke',
      'week.meals':      'måltider',
      'week.today':      '(i dag)',

      // Shopping view
      'shopping.title':         'Handleliste',
      'shopping.weekLabel':     'Uke',
      'shopping.reset':         'Nullstill',
      'shopping.itemsThisWeek': 'varer denne uken',
      'shopping.progress':      '{checked} av {total} handlet',

      // Science view
      'science.title':             'Hvordan virker det?',
      'science.intro':             'Maten i SpisSlank er satt sammen for å aktivere de samme metthetsveiene som moderne slankemedisiner — helt naturlig.',
      'science.drugsHeading':      'Slankemedisiner — hva de gjør',
      'science.drugsIntro':        'Nye slankemedisiner virker ved å etterligne kroppens egne metthetshormoner. Her er de viktigste:',
      'science.pathwaysHeading':   '8 veier til metthet',
      'science.pathwaysIntro':     'Kroppen har flere mekanismer for å regulere appetitt og metthet. SpisSlank dekker alle åtte:',
      'science.foodHeading':       'Matens superkrefter',
      'science.foodIntro':         'Disse matvarene scorer høyt på én eller flere metthetsveier:',
      'science.cascadeHeading':    'Din dag — før og etter',
      'science.cascadeIntro':      'Slik endres kroppens signaler gjennom dagen med SpisSlank-maten:',
      'science.disclaimer':        '⚕️ Medisinsk merknad: Denne appen er ikke medisinsk rådgivning. Rådfør deg med lege for vekthåndtering. Matbaserte strategier kan ikke erstatte medisiner, men kan støtte en sunnere livsstil. Kostholdsendringer kan påvirke blodsukkernivå og annen medisinering — rådfør deg med lege før du gjør store endringer i kostholdet. Vekttapstallene som vises er basert på publiserte kliniske studier av legemidlene, ikke på denne matplanen.',
      'science.generation':        'generasjon',
      'science.pathways':          'Veier',
      'science.weightLoss':        'Vekttap',
      'science.approved':          'Godkjent',
      'science.phase3':            'Fase 3',
      'science.evidenceStrong':    'Sterk',
      'science.evidenceModerate':  'Moderat',
      'science.evidencePreliminary': 'Foreløpig',

      // Meal types
      'mealType.breakfast':  'Frokost',
      'mealType.lunchAddon': 'Lunsj-tillegg',
      'mealType.snack':      'Mellommåltid 16:00',
      'mealType.dinner':     'Middag',
      'mealType.evening':    'Kveldsmat',

      // Day names
      'day.monday':    'Mandag',
      'day.tuesday':   'Tirsdag',
      'day.wednesday': 'Onsdag',
      'day.thursday':  'Torsdag',
      'day.friday':    'Fredag',
      'day.saturday':  'Lørdag',
      'day.sunday':    'Søndag',

      // Month names
      'month.january':   'Januar',
      'month.february':  'Februar',
      'month.march':     'Mars',
      'month.april':     'April',
      'month.may':       'Mai',
      'month.june':      'Juni',
      'month.july':      'Juli',
      'month.august':    'August',
      'month.september': 'September',
      'month.october':   'Oktober',
      'month.november':  'November',
      'month.december':  'Desember',

      // Swap modal
      'swap.title':          'Velg alternativt måltid',
      'swap.noAlternatives': 'Ingen alternativer tilgjengeleg.',

      // Settings
      'settings.title':         'Innstillinger',
      'settings.name':          'Navn',
      'settings.language':      'Språk',
      'settings.dietary':       'Kostholdsrestriksjoner',
      'settings.allergies':     'Allergier',
      'settings.mealFrequency': 'Måltidsfrekvens',
      'settings.save':          'Lagre',
      'settings.saved':         'Lagret!',
      'settings.vegetarian':    'Vegetar',
      'settings.vegan':         'Vegan',
      'settings.lactoseFree':   'Laktosefri',
      'settings.glutenFree':    'Glutenfri',
      'settings.allergyNuts':      'Nøtter',
      'settings.allergyShellfish': 'Skalldyr',
      'settings.allergyEggs':     'Egg',
      'settings.allergyDairy':    'Melk',
      'settings.allergySoy':      'Soya',
      'settings.allergyGluten':   'Gluten',
      'settings.allergyFish':     'Fisk',

      // Share
      'share.shareApp':  'Del appen',
      'share.shareMeal': 'Del måltid',
      'share.sharePlan': 'Del plan',
      'share.copied':    'Kopiert!',
      'share.shareTitle': 'SpisSlank — Spis deg slank',
      'share.shareText':  'Sjekk ut SpisSlank! Måltidsplaner som etterligner slankemedisinenes effekt med vanlig mat.',

      // Onboarding
      'onboarding.welcome':    'Velkommen til SpisSlank!',
      'onboarding.subtitle':   'La oss tilpasse planen din',
      'onboarding.skip':       'Hopp over',
      'onboarding.next':       'Neste',
      'onboarding.done':       'Ferdig',
      'onboarding.namePrompt': 'Hva heter du?',

      // General
      'general.close':  'Lukk',
      'general.cancel': 'Avbryt',
      'general.ok':     'OK',

      // Store sections
      'section.fruktGront': 'Frukt & Grønt',
      'section.meieri':     'Meieri',
      'section.kjottFisk':  'Kjøtt & Fisk',
      'section.bakeri':     'Bakeri',
      'section.torrvarer':  'Tørrvarer',
      'section.helse':      'Helse',
      'section.drikke':     'Drikke'
    },

    en: {
      // Navigation
      'nav.today':       'Today',
      'nav.week':        'Week',
      'nav.shopping':    'Shopping',
      'nav.science':     'Science',
      'nav.settings':    'Settings',

      // Today view
      'today.title':           'Today',
      'today.pathwayCoverage': 'Pathways covered today',
      'today.coverage':        'Coverage',
      'today.showDetails':     'Show details',
      'today.hideDetails':     'Hide details',
      'today.swap':            '🔄 Swap',
      'today.ingredients':     'Ingredients',
      'today.instructions':    'Instructions',
      'today.scienceNote':     '🔬 Why this works',
      'today.drugEquivalent':  '💊 Drug equivalent',
      'today.prepTime':        'min',

      // Week view
      'week.title':      'Week overview',
      'week.weekPrefix': 'Week',
      'week.meals':      'meals',
      'week.today':      '(today)',

      // Shopping view
      'shopping.title':         'Shopping list',
      'shopping.weekLabel':     'Week',
      'shopping.reset':         'Reset',
      'shopping.itemsThisWeek': 'items this week',
      'shopping.progress':      '{checked} of {total} done',

      // Science view
      'science.title':             'How does it work?',
      'science.intro':             'The food in SpisSlank is designed to activate the same satiety pathways as modern weight-loss drugs — completely naturally.',
      'science.drugsHeading':      'Weight-loss drugs — what they do',
      'science.drugsIntro':        'Modern weight-loss drugs work by mimicking the body\'s own satiety hormones. Here are the key ones:',
      'science.pathwaysHeading':   '8 pathways to satiety',
      'science.pathwaysIntro':     'The body has several mechanisms to regulate appetite and satiety. SpisSlank covers all eight:',
      'science.foodHeading':       'Food superpowers',
      'science.foodIntro':         'These foods score high on one or more satiety pathways:',
      'science.cascadeHeading':    'Your day — before and after',
      'science.cascadeIntro':      'This is how your body\'s signals change throughout the day with SpisSlank food:',
      'science.disclaimer':        '⚕️ Medical notice: This app is not medical advice. Consult a doctor for weight management. Food-based strategies cannot replace medication, but can support a healthier lifestyle. Dietary changes may affect blood sugar levels and other medications — consult a doctor before making major changes to your diet. The weight-loss figures shown are based on published clinical studies of the drugs, not on this meal plan.',
      'science.generation':        'generation',
      'science.pathways':          'Pathways',
      'science.weightLoss':        'Weight loss',
      'science.approved':          'Approved',
      'science.phase3':            'Phase 3',
      'science.evidenceStrong':    'Strong',
      'science.evidenceModerate':  'Moderate',
      'science.evidencePreliminary': 'Preliminary',

      // Meal types
      'mealType.breakfast':  'Breakfast',
      'mealType.lunchAddon': 'Lunch add-on',
      'mealType.snack':      'Afternoon snack',
      'mealType.dinner':     'Dinner',
      'mealType.evening':    'Evening snack',

      // Day names
      'day.monday':    'Monday',
      'day.tuesday':   'Tuesday',
      'day.wednesday': 'Wednesday',
      'day.thursday':  'Thursday',
      'day.friday':    'Friday',
      'day.saturday':  'Saturday',
      'day.sunday':    'Sunday',

      // Month names
      'month.january':   'January',
      'month.february':  'February',
      'month.march':     'March',
      'month.april':     'April',
      'month.may':       'May',
      'month.june':      'June',
      'month.july':      'July',
      'month.august':    'August',
      'month.september': 'September',
      'month.october':   'October',
      'month.november':  'November',
      'month.december':  'December',

      // Swap modal
      'swap.title':          'Choose alternative meal',
      'swap.noAlternatives': 'No alternatives available.',

      // Settings
      'settings.title':         'Settings',
      'settings.name':          'Name',
      'settings.language':      'Language',
      'settings.dietary':       'Dietary restrictions',
      'settings.allergies':     'Allergies',
      'settings.mealFrequency': 'Meal frequency',
      'settings.save':          'Save',
      'settings.saved':         'Saved!',
      'settings.vegetarian':    'Vegetarian',
      'settings.vegan':         'Vegan',
      'settings.lactoseFree':   'Lactose-free',
      'settings.glutenFree':    'Gluten-free',
      'settings.allergyNuts':      'Nuts',
      'settings.allergyShellfish': 'Shellfish',
      'settings.allergyEggs':     'Eggs',
      'settings.allergyDairy':    'Dairy',
      'settings.allergySoy':      'Soy',
      'settings.allergyGluten':   'Gluten',
      'settings.allergyFish':     'Fish',

      // Share
      'share.shareApp':  'Share app',
      'share.shareMeal': 'Share meal',
      'share.sharePlan': 'Share plan',
      'share.copied':    'Copied!',
      'share.shareTitle': 'SpisSlank — Eat yourself slim',
      'share.shareText':  'Check out SpisSlank! Meal plans that mimic the effect of weight-loss drugs using ordinary food.',

      // Onboarding
      'onboarding.welcome':    'Welcome to SpisSlank!',
      'onboarding.subtitle':   'Let\'s customize your plan',
      'onboarding.skip':       'Skip',
      'onboarding.next':       'Next',
      'onboarding.done':       'Done',
      'onboarding.namePrompt': 'What\'s your name?',

      // General
      'general.close':  'Close',
      'general.cancel': 'Cancel',
      'general.ok':     'OK',

      // Store sections
      'section.fruktGront': 'Fruits & Vegetables',
      'section.meieri':     'Dairy',
      'section.kjottFisk':  'Meat & Fish',
      'section.bakeri':     'Bakery',
      'section.torrvarer':  'Dry goods',
      'section.helse':      'Health',
      'section.drikke':     'Beverages'
    }
  };

  Object.freeze(TRANSLATIONS.no);
  Object.freeze(TRANSLATIONS.en);
  Object.freeze(TRANSLATIONS);

  function getLanguage() {
    try {
      return localStorage.getItem(LANG_KEY) || 'no';
    } catch (_) {
      return 'no';
    }
  }

  function setLanguage(lang) {
    if (lang !== 'no' && lang !== 'en') { return; }
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch (_) { /* storage unavailable */ }
  }

  function t(key) {
    var lang = getLanguage();
    var table = TRANSLATIONS[lang] || TRANSLATIONS.no;
    return (key in table) ? table[key] : key;
  }

  window.TRANSLATIONS = TRANSLATIONS;
  window.t            = t;
  window.setLanguage  = setLanguage;
  window.getLanguage  = getLanguage;
})();
