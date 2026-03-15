// trip-planner.js - Trip configuration and smart list generation

const TripPlanner = {
  STORAGE_KEY: 'turpakker_trips',
  CURRENT_TRIP_KEY: 'turpakker_current',

  /**
   * Get saved trips from localStorage
   */
  getSavedTrips() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  },

  /**
   * Save trips to localStorage
   */
  _saveTrips(trips) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trips));
  },

  /**
   * Save a trip (create or update)
   */
  saveTrip(trip) {
    const trips = this.getSavedTrips();
    const idx = trips.findIndex(t => t.id === trip.id);
    if (idx >= 0) {
      trips[idx] = trip;
    } else {
      trips.push(trip);
    }
    this._saveTrips(trips);
  },

  /**
   * Delete a trip
   */
  deleteTrip(tripId) {
    const trips = this.getSavedTrips().filter(t => t.id !== tripId);
    this._saveTrips(trips);
  },

  /**
   * Get or create current trip config
   */
  getCurrentTrip() {
    try {
      return JSON.parse(localStorage.getItem(this.CURRENT_TRIP_KEY));
    } catch {
      return null;
    }
  },

  /**
   * Save current trip config
   */
  saveCurrentTrip(trip) {
    localStorage.setItem(this.CURRENT_TRIP_KEY, JSON.stringify(trip));
  },

  /**
   * Create a new trip config
   */
  createTrip(config) {
    const trip = {
      id: 'trip_' + Date.now(),
      name: config.name || '',
      destination: config.destination || '',
      destinationCustom: config.destinationCustom || '',
      startDate: config.startDate || '',
      endDate: config.endDate || '',
      tripType: config.tripType || 'alpint',
      familyMembers: config.familyMembers || [],
      hasKids: config.hasKids || false,
      packingList: null,
      todoListId: null,
      createdAt: new Date().toISOString(),
    };

    // Generate packing list
    trip.packingList = PackingLists.generateList(trip);

    return trip;
  },

  /**
   * Get destination info (name and coordinates)
   */
  getDestinationInfo(trip) {
    if (trip.destination === 'custom') {
      return { name: trip.destinationCustom, lat: null, lon: null };
    }
    const dest = PackingLists.destinations.find(d => d.name === trip.destination);
    return dest || { name: trip.destination, lat: null, lon: null };
  },

  /**
   * Get the display name for a trip
   */
  getTripDisplayName(trip) {
    const dest = trip.destination === 'custom' ? trip.destinationCustom : trip.destination;
    const type = PackingLists.tripTypes[trip.tripType]?.label || trip.tripType;
    return trip.name || `${type} - ${dest}`;
  },

  /**
   * Calculate packing progress
   */
  getProgress(packingList) {
    let total = 0;
    let packed = 0;

    for (const category of Object.values(packingList)) {
      for (const item of category.items) {
        total++;
        if (item.packed) packed++;
      }
    }

    return {
      total,
      packed,
      percentage: total > 0 ? Math.round((packed / total) * 100) : 0
    };
  },

  /**
   * Toggle item packed status
   */
  toggleItem(packingList, categoryKey, itemId) {
    const category = packingList[categoryKey];
    if (!category) return;
    const item = category.items.find(i => i.id === itemId);
    if (item) {
      item.packed = !item.packed;
    }
  },

  /**
   * Add custom item to a category
   */
  addCustomItem(packingList, categoryKey, name, assignee = null) {
    if (!packingList[categoryKey]) return;
    const id = 'custom_' + Date.now();
    packingList[categoryKey].items.push({
      id,
      name,
      desc: '',
      packed: false,
      assignee,
      isCustom: true,
    });
    return id;
  },

  /**
   * Remove a custom item
   */
  removeItem(packingList, categoryKey, itemId) {
    if (!packingList[categoryKey]) return;
    packingList[categoryKey].items = packingList[categoryKey].items.filter(
      i => i.id !== itemId
    );
  },

  /**
   * Assign item to family member
   */
  assignItem(packingList, categoryKey, itemId, memberName) {
    const category = packingList[categoryKey];
    if (!category) return;
    const item = category.items.find(i => i.id === itemId);
    if (item) {
      item.assignee = memberName;
    }
  },

  /**
   * Add weather-suggested items to the packing list
   */
  addWeatherItems(packingList, suggestions) {
    if (!suggestions || suggestions.length === 0) return;

    const catKey = 'VaerTips';
    if (!packingList[catKey]) {
      packingList[catKey] = {
        label: 'V\u00E6r-tips (Weather suggestions)',
        icon: '\uD83C\uDF26\uFE0F',
        items: [],
      };
    }

    for (const suggestion of suggestions) {
      // Don't add duplicates
      if (packingList[catKey].items.some(i => i.id === suggestion.id)) continue;
      packingList[catKey].items.push({
        ...suggestion,
        packed: false,
        assignee: null,
        isCustom: false,
        isWeatherSuggestion: true,
      });
    }
  },

  /**
   * Generate pre-loaded trip: Kvaløyvågen-Finnvikdalen 14. mars 2026
   */
  generateTodaysTrip() {
    const trip = this.createTrip({
      name: 'Langrenn Kvaløyvågen → Finnvikdalen',
      destination: 'Kvaløya/Tromsø',
      destinationCustom: '',
      startDate: '2026-03-14',
      endDate: '2026-03-14',
      tripType: 'langrenn',
      familyMembers: [
        { name: 'Jan', age: null, role: 'adult' },
        { name: 'Kristina', age: 48, role: 'adult' },
        { name: 'Olivia', age: 12, role: 'kid' },
        { name: 'Ylvi', age: null, role: 'dog', breed: 'Alaska Malamute' },
      ],
      hasKids: true,
      hasDog: true,
    });

    // Customize the list for this specific trip
    const list = trip.packingList;

    // Remove items not needed for a day trip
    const removeItems = ['indoor-shoes', 'change-clothes', 'toiletries', 'towel', 'lift-pass', 'insurance', 'id-card', 'camera', 'helmet', 'back-protector'];
    for (const cat of Object.values(list)) {
      cat.items = cat.items.filter(i => !removeItems.includes(i.id));
    }

    // Remove sled from kids — Ylvi pulls Olivia in harness, not sled
    if (list.Barn) {
      list.Barn.items = list.Barn.items.filter(i => i.id !== 'sled');
    }

    // Add trip-specific items
    if (!list.Diverse) list.Diverse = { label: 'Diverse (Misc)', icon: '\uD83C\uDFD4\uFE0F', items: [] };

    // Transport: two cars
    list.Dokumenter.items.push(
      { id: 'car-keys-2', name: 'Bilnøkler bil 2 (Finnvikdalen)', desc: 'Keys for car parked at Finnvikdalen', packed: false, assignee: null, isCustom: false },
    );

    list.Diverse.items.push(
      { id: 'phone-charged', name: 'Telefon fulladet', desc: 'Phone fully charged', packed: false, assignee: null, isCustom: false },
      { id: 'gps-map', name: 'Kart/GPS (Kvaløya)', desc: 'Map of route', packed: false, assignee: null, isCustom: false },
    );

    // Weather: 3-4°C, sunny/fair, mild — add sun items, wax tip
    list.SkiUtstyr.items.push(
      { id: 'warm-wax', name: 'Smøring for våt snø (klister/varmt)', desc: 'Warm/wet snow wax — 3°C today', packed: false, assignee: null, isCustom: false },
    );

    if (!list.VaerTips) {
      list.VaerTips = { label: 'Vær-tips (Weather)', icon: '\uD83C\uDF26\uFE0F', items: [] };
    }
    list.VaerTips.items.push(
      { id: 'sun-tip', name: 'Solkrem SPF 50 (sol + refleksjon fra snø)', desc: 'Sunny day, snow reflection', packed: false, assignee: null, isCustom: false },
      { id: 'sunglasses-tip', name: 'Solbriller til alle (klart vær)', desc: 'Clear sky conditions', packed: false, assignee: null, isCustom: false },
      { id: 'light-layers', name: 'Lett påkledning (3-4°C, mildt)', desc: 'Mild temps, dress light', packed: false, assignee: null, isCustom: false },
      { id: 'extra-water', name: 'Ekstra vann (mildt vær = tørst)', desc: 'Warm day means more thirst', packed: false, assignee: null, isCustom: false },
    );

    // Assign some items to family members
    const assignDefaults = {
      'thermos': 'Jan',
      'packed-lunch': 'Kristina',
      'kvikklunsj': 'Olivia',
      'first-aid': 'Jan',
      'sunscreen': 'Kristina',
      'dog-harness': 'Olivia',
      'dog-treats': 'Olivia',
      'dog-water': 'Jan',
      'dog-poop-bags': 'Kristina',
      'car-keys': 'Jan',
      'car-keys-2': 'Kristina',
    };

    for (const cat of Object.values(list)) {
      for (const item of cat.items) {
        if (assignDefaults[item.id]) {
          item.assignee = assignDefaults[item.id];
        }
      }
    }

    trip.weather = {
      temperature: 3.5,
      wind: 4,
      condition: 'fair_day',
      description: '3-4°C, sol/lettskyet, lite vind. Mildt for langrenn — bruk varm smøring.',
      forecast: [
        { time: '11:00', temp: 3.7, wind: 3.6, condition: 'clearsky_day' },
        { time: '12:00', temp: 3.8, wind: 3.4, condition: 'partlycloudy_day' },
        { time: '13:00', temp: 3.7, wind: 4.3, condition: 'cloudy' },
        { time: '14:00', temp: 3.5, wind: 5.3, condition: 'cloudy' },
        { time: '15:00', temp: 3.0, wind: 4.6, condition: 'fair_day' },
        { time: '16:00', temp: 2.5, wind: 3.5, condition: 'partlycloudy_day' },
      ],
    };

    trip.route = {
      from: 'Kvaløyvågen',
      to: 'Finnvikdalen',
      distance: '11 km',
      type: 'Enveis (to biler)',
      departure: '10:20 fra Bamsestien 7',
      arrival: '~11:00 Kvaløyvågen',
    };

    return trip;
  },

  /**
   * Get trip duration in days
   */
  getDuration(trip) {
    if (!trip.startDate || !trip.endDate) return 0;
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const diff = end - start;
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1);
  }
};
