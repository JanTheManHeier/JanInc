// packing-lists.js - Pre-built packing list templates for Norwegian ski trips

const PackingLists = {
  // Base items for ALL ski trips
  base: {
    'Klaer': {
      label: 'Kl\u00e6r (Clothing)',
      icon: '\uD83E\uDDE5',
      items: [
        { id: 'wool-top', name: 'Ullundert\u00F8y overdel', desc: 'Wool base layer top' },
        { id: 'wool-bottom', name: 'Ullundert\u00F8y underdel', desc: 'Wool base layer bottom' },
        { id: 'wool-socks', name: 'Ullsokker x2', desc: 'Wool socks' },
        { id: 'mid-layer', name: 'Fleece/mellomlag', desc: 'Mid layer' },
        { id: 'ski-pants', name: 'Skibukse', desc: 'Ski pants' },
        { id: 'ski-jacket', name: 'Skijakke', desc: 'Ski jacket' },
        { id: 'beanie', name: 'Lue', desc: 'Hat/Beanie' },
        { id: 'buff', name: 'Buff/hals', desc: 'Neck gaiter' },
        { id: 'ski-gloves', name: 'Skihansker', desc: 'Ski gloves' },
        { id: 'mittens', name: 'Votter (reserve)', desc: 'Mittens, backup' },
        { id: 'sunglasses', name: 'Solbriller', desc: 'Sunglasses' },
        { id: 'goggles', name: 'Skibriller/goggles', desc: 'Ski goggles' },
        { id: 'indoor-shoes', name: 'Innesko/t\u00F8fler', desc: 'Indoor shoes/slippers' },
        { id: 'change-clothes', name: 'Skift kl\u00E6r', desc: 'Change of clothes' },
        { id: 'liners', name: 'Liners (hanskeliner)', desc: 'Glove liners' },
        { id: 'super-undertoy', name: 'Superundert\u00F8y', desc: 'Base layer (wool/synth)' },
        { id: 'uteklaer', name: 'Utekl\u00E6r', desc: 'Outdoor clothing' },
      ]
    },
    'Sikkerhet': {
      label: 'Sikkerhet (Safety)',
      icon: '\u26D1\uFE0F',
      items: [
        { id: 'helmet', name: 'Hjelm', desc: 'Helmet' },
        { id: 'back-protector', name: 'Ryggbeskytter', desc: 'Back protector' },
        { id: 'sunscreen', name: 'Solkrem SPF 50', desc: 'Sunscreen' },
        { id: 'lip-balm', name: 'Leppepomade', desc: 'Lip balm' },
        { id: 'first-aid', name: 'F\u00F8rstehjelpsutstyr', desc: 'First aid kit' },
        { id: 'hand-warmers-base', name: 'H\u00E5ndvarmere', desc: 'Hand warmers' },
      ]
    },
    'MatDrikke': {
      label: 'Mat/Drikke (Food/Drink)',
      icon: '\uD83E\uDDC3',
      items: [
        { id: 'thermos', name: 'Termos', desc: 'Thermos' },
        { id: 'packed-lunch', name: 'Niste/matpakke', desc: 'Packed lunch' },
        { id: 'energy-bar', name: 'Sjokolade/energibar', desc: 'Chocolate/energy bar' },
        { id: 'water', name: 'Vann', desc: 'Water' },
        { id: 'kvikklunsj', name: 'Kvikklunsj', desc: 'Norwegian classic!' },
        { id: 'camelback', name: 'Camelback', desc: 'Hydration pack' },
        { id: 'bestikk', name: 'Bestikk', desc: 'Cutlery' },
        { id: 'kopper', name: 'Kopper', desc: 'Cups' },
        { id: 'polsetermos', name: 'P\u00F8lsetermos', desc: 'Sausage thermos' },
        { id: 'polsebrod', name: 'P\u00F8lsebr\u00F8d', desc: 'Hot dog buns' },
        { id: 'ketchup', name: 'Ketchup', desc: 'Ketchup' },
        { id: 'kaffe', name: 'Kaffe', desc: 'Coffee' },
        { id: 'saft-kakao', name: 'Saft / kakao', desc: 'Juice / cocoa' },
        { id: 'nocco', name: 'Nocco', desc: 'Energy drink' },
        { id: 'tursjokolade', name: 'Tursjokolade', desc: 'Hiking chocolate' },
        { id: 'frukt', name: 'Frukt', desc: 'Fruit' },
      ]
    },
    'Dokumenter': {
      label: 'Dokumenter (Documents)',
      icon: '\uD83D\uDCC4',
      items: [
        { id: 'lift-pass', name: 'Heiskort/hyttereservasjon', desc: 'Lift pass/cabin reservation' },
        { id: 'insurance', name: 'Forsikringskort', desc: 'Insurance card' },
        { id: 'id-card', name: 'Legitimasjon', desc: 'ID' },
        { id: 'car-keys', name: 'Biln\u00F8kler', desc: 'Car keys' },
      ]
    },
    'Diverse': {
      label: 'Diverse (Misc)',
      icon: '\uD83C\uDFD4\uFE0F',
      items: [
        { id: 'charger', name: 'Lader/powerbank', desc: 'Charger/power bank' },
        { id: 'camera', name: 'Kamera', desc: 'Camera' },
        { id: 'gopro', name: 'GoPro', desc: 'Action camera' },
        { id: 'toiletries', name: 'Toalettmappe', desc: 'Toiletries' },
        { id: 'towel', name: 'H\u00E5ndkle', desc: 'Towel' },
        { id: 'brillevisker', name: 'Brilleglass-visker', desc: 'Lens wiper' },
        { id: 'klokka', name: 'Klokka', desc: 'Watch' },
        { id: 'torkerull', name: 'T\u00F8rkerull', desc: 'Paper towels' },
      ]
    }
  },

  // Trip-type specific additions
  tripTypes: {
    alpint: {
      label: 'Alpint (Downhill)',
      category: 'SkiUtstyr',
      categoryLabel: 'Ski-utstyr (Ski Gear)',
      categoryIcon: '\u26F7\uFE0F',
      items: [
        { id: 'downhill-skis', name: 'Slal\u00E5mski', desc: 'Downhill skis' },
        { id: 'downhill-boots', name: 'Slal\u00E5mst\u00F8vler', desc: 'Ski boots' },
        { id: 'downhill-poles', name: 'Skistaver', desc: 'Poles' },
      ]
    },
    langrenn: {
      label: 'Langrenn (Cross-country)',
      category: 'SkiUtstyr',
      categoryLabel: 'Ski-utstyr (Ski Gear)',
      categoryIcon: '\u26F7\uFE0F',
      items: [
        { id: 'xc-skis', name: 'Langrennsski', desc: 'XC skis' },
        { id: 'xc-boots', name: 'Langrennsst\u00F8vler', desc: 'XC boots' },
        { id: 'xc-poles', name: 'Langrennsstaver', desc: 'XC poles' },
        { id: 'wax', name: 'Sm\u00F8ring/glider', desc: 'Wax/glide' },
        { id: 'wax-kit', name: 'Sm\u00F8rebod-utstyr', desc: 'Wax kit' },
        { id: 'hydration-belt', name: 'Drikkebelte', desc: 'Hydration belt' },
      ]
    },
    topptur: {
      label: 'Topptur/Randonee',
      category: 'SkiUtstyr',
      categoryLabel: 'Ski-utstyr (Ski Gear)',
      categoryIcon: '\u26F7\uFE0F',
      items: [
        { id: 'touring-skis', name: 'Randonee-ski', desc: 'Touring skis' },
        { id: 'touring-bindings', name: 'Randonee-bindinger', desc: 'Touring bindings' },
        { id: 'touring-boots', name: 'Randonee-st\u00F8vler', desc: 'Touring boots' },
        { id: 'skins', name: 'Skifeller', desc: 'Climbing skins' },
        { id: 'beacon', name: 'Skreds\u00F8ker', desc: 'Avalanche transceiver' },
        { id: 'shovel', name: 'Skredspade', desc: 'Avalanche shovel' },
        { id: 'probe', name: 'Skredsonde', desc: 'Avalanche probe' },
        { id: 'backpack', name: 'Sekk 30-40L', desc: 'Backpack' },
        { id: 'map-gps', name: 'Kart/GPS', desc: 'Map/GPS' },
        { id: 'headlamp', name: 'Pannelykt', desc: 'Headlamp' },
        { id: 'ice-axe', name: 'Is\u00F8ks', desc: 'Ice axe' },
        { id: 'crampons', name: 'Stegjern', desc: 'Crampons' },
        { id: 'crust-irons', name: 'Skarejern', desc: 'Crust irons (ski)' },
      ]
    },
    hyttetur: {
      label: 'Hyttetur (Cabin trip)',
      category: 'Hytte',
      categoryLabel: 'Hytte (Cabin)',
      categoryIcon: '\uD83C\uDFE0',
      items: [
        { id: 'cabin-food', name: 'Mat til hytta', desc: 'Food for cabin' },
        { id: 'games', name: 'Spill/kortspill', desc: 'Games/cards' },
        { id: 'books', name: 'B\u00F8ker', desc: 'Books' },
        { id: 'firewood-lighter', name: 'Fyrstikker/lighter', desc: 'Matches/lighter' },
        { id: 'candles', name: 'Stearinlys', desc: 'Candles' },
      ]
    }
  },

  // Kids additions
  kids: {
    category: 'Barn',
    categoryLabel: 'Barn (Kids)',
    categoryIcon: '\uD83D\uDC76',
    items: [
      { id: 'kids-ski-gear', name: 'Barnas skiutstyr', desc: "Kids' ski gear" },
      { id: 'extra-mittens', name: 'Ekstra votter', desc: 'Extra mittens' },
      { id: 'extra-hat', name: 'Ekstra lue', desc: 'Extra hat' },
      { id: 'extra-base', name: 'Ekstra ullundert\u00F8y', desc: 'Extra base layer' },
      { id: 'kids-snacks', name: 'Snacks', desc: 'Snacks' },
      { id: 'sled', name: 'Pulk/akebrett', desc: 'Sled/toboggan' },
      { id: 'hand-warmers', name: 'Varmeposer', desc: 'Hand warmers' },
    ]
  },

  // Dog additions (for trips with dogs)
  dog: {
    category: 'Hund',
    categoryLabel: 'Hund (Dog)',
    categoryIcon: '\uD83D\uDC15',
    items: [
      { id: 'dog-harness', name: 'Sele/line', desc: 'Harness/leash' },
      { id: 'dog-water', name: 'Vannflaske til hund', desc: 'Dog water bottle' },
      { id: 'dog-bowl', name: 'Sammenleggbar skål', desc: 'Collapsible bowl' },
      { id: 'dog-treats', name: 'Godbit/hundesnacks', desc: 'Dog treats' },
      { id: 'dog-poop-bags', name: 'Hundeposer', desc: 'Poop bags' },
      { id: 'dog-booties', name: 'Hundesko (is/salt)', desc: 'Dog booties' },
      { id: 'dog-towel', name: 'Håndkle til hund', desc: 'Dog towel' },
      { id: 'dog-food', name: 'Hundemat (dagsrasjon)', desc: 'Dog food (day ration)' },
      { id: 'dog-boblis', name: 'Boblis (boblejakke)', desc: 'Bubble jacket for dog' },
      { id: 'dog-ski-leash', name: 'Skib\u00E5nd til hund', desc: 'Ski leash for dog' },
      { id: 'dog-gps', name: 'Mitt Spor (hunde-GPS)', desc: 'GPS tracker for dog' },
    ]
  },

  // Weather-based additions
  weatherAdditions: {
    veryCold: {
      threshold: -15,
      label: 'Ekstra kulde-utstyr',
      items: [
        { id: 'extra-wool', name: 'Ekstra ulllag', desc: 'Extra wool layer' },
        { id: 'warm-mittens', name: 'Dunvotter', desc: 'Down mittens' },
        { id: 'heat-packs', name: 'Varmeposer', desc: 'Hand/toe warmers' },
        { id: 'balaclava', name: 'Balaklava', desc: 'Balaclava' },
      ]
    },
    windy: {
      threshold: 10, // m/s
      label: 'Vind-utstyr',
      items: [
        { id: 'wind-layer', name: 'Vindtett lag', desc: 'Windproof layer' },
        { id: 'goggles-essential', name: 'Goggles (viktig!)', desc: 'Goggles essential' },
      ]
    },
    sunny: {
      label: 'Sol-utstyr',
      items: [
        { id: 'extra-sunscreen', name: 'Ekstra solkrem', desc: 'Extra sunscreen' },
        { id: 'sun-hat', name: 'Solhatt/caps', desc: 'Sun hat/cap' },
      ]
    },
    snowy: {
      label: 'Sn\u00F8-utstyr',
      items: [
        { id: 'goggles-snow', name: 'Goggles (sn\u00F8v\u00E6r)', desc: 'Goggles for snow' },
        { id: 'extra-dry-clothes', name: 'Ekstra t\u00F8rre kl\u00E6r', desc: 'Extra dry clothes' },
      ]
    }
  },

  // Norwegian ski destinations with coordinates for weather API
  destinations: [
    { name: 'Hemsedal', lat: 60.86, lon: 8.56 },
    { name: 'Trysil', lat: 61.31, lon: 12.26 },
    { name: 'Hafjell', lat: 61.23, lon: 10.53 },
    { name: 'Kvitfjell', lat: 61.47, lon: 10.13 },
    { name: 'Geilo', lat: 60.53, lon: 8.21 },
    { name: 'Norefjell', lat: 60.17, lon: 9.53 },
    { name: 'Beitost\u00F8len', lat: 61.25, lon: 8.92 },
    { name: 'Sjusj\u00F8en', lat: 61.27, lon: 10.83 },
    { name: 'Oppdal', lat: 62.59, lon: 9.69 },
    { name: 'Myrkdalen', lat: 60.88, lon: 6.44 },
    { name: 'Hovden', lat: 59.57, lon: 7.39 },
    { name: '\u00C5l', lat: 60.63, lon: 8.57 },
    { name: 'Skeikampen', lat: 61.31, lon: 10.23 },
    { name: 'Kvaløya/Tromsø', lat: 69.68, lon: 18.85 },
    { name: 'Kroken/Tromsø', lat: 69.68, lon: 19.05 },
  ],

  /**
   * Generate a complete packing list for a trip configuration
   */
  generateList(tripConfig) {
    const list = {};

    // Add all base categories
    for (const [key, category] of Object.entries(this.base)) {
      list[key] = {
        label: category.label,
        icon: category.icon,
        items: category.items.map(item => ({
          ...item,
          packed: false,
          assignee: null,
          isCustom: false,
        }))
      };
    }

    // Add trip-type specific items
    if (tripConfig.tripType && this.tripTypes[tripConfig.tripType]) {
      const typeData = this.tripTypes[tripConfig.tripType];
      const catKey = typeData.category;
      if (!list[catKey]) {
        list[catKey] = {
          label: typeData.categoryLabel,
          icon: typeData.categoryIcon,
          items: []
        };
      }
      for (const item of typeData.items) {
        list[catKey].items.push({
          ...item,
          packed: false,
          assignee: null,
          isCustom: false,
        });
      }
    }

    // Add kids items if there are kids
    if (tripConfig.hasKids) {
      const catKey = this.kids.category;
      list[catKey] = {
        label: this.kids.categoryLabel,
        icon: this.kids.categoryIcon,
        items: this.kids.items.map(item => ({
          ...item,
          packed: false,
          assignee: null,
          isCustom: false,
        }))
      };
    }

    // Add dog items if there's a dog
    if (tripConfig.hasDog) {
      const catKey = this.dog.category;
      list[catKey] = {
        label: this.dog.categoryLabel,
        icon: this.dog.categoryIcon,
        items: this.dog.items.map(item => ({
          ...item,
          packed: false,
          assignee: null,
          isCustom: false,
        }))
      };
    }

    return list;
  },

  /**
   * Add weather-based suggestions to an existing list
   */
  addWeatherSuggestions(list, weatherData) {
    const suggestions = [];

    if (!weatherData || !weatherData.temperature) return suggestions;

    const temp = weatherData.temperature;
    const wind = weatherData.wind || 0;
    const condition = weatherData.condition || '';

    if (temp < this.weatherAdditions.veryCold.threshold) {
      suggestions.push(...this.weatherAdditions.veryCold.items.map(i => ({
        ...i, reason: `Veldig kaldt (${temp}\u00B0C)`
      })));
    }

    if (wind > this.weatherAdditions.windy.threshold) {
      suggestions.push(...this.weatherAdditions.windy.items.map(i => ({
        ...i, reason: `Mye vind (${wind} m/s)`
      })));
    }

    if (condition.includes('fair') || condition.includes('clear')) {
      suggestions.push(...this.weatherAdditions.sunny.items.map(i => ({
        ...i, reason: 'Solrikt v\u00E6r'
      })));
    }

    if (condition.includes('snow') || condition.includes('sleet')) {
      suggestions.push(...this.weatherAdditions.snowy.items.map(i => ({
        ...i, reason: 'Sn\u00F8v\u00E6r'
      })));
    }

    return suggestions;
  }
};
