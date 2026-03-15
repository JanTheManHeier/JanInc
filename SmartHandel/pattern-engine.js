// SmartHandel - Pattern Detection Engine
// Analyzes purchase history to detect buying patterns and meal groupings

class PatternEngine {
  constructor() {
    this.purchaseFrequencies = new Map(); // normalizedName -> frequency data
    this.coOccurrences = new Map(); // "item1|item2" -> count
    this.detectedMealPatterns = []; // auto-detected groups
  }

  // Analyze all purchase data
  async analyze() {
    const purchases = await db.getAllPurchases();
    const receipts = await db.getAllReceipts();

    this.calculateFrequencies(purchases);
    this.calculateCoOccurrences(purchases);
    this.detectMealPatterns(purchases, receipts);

    return {
      frequencies: this.getFrequencyReport(),
      patterns: this.detectedMealPatterns,
      restockSuggestions: this.getRestockSuggestions(),
    };
  }

  // Calculate purchase frequency per item
  calculateFrequencies(purchases) {
    this.purchaseFrequencies.clear();

    // Group purchases by normalized name
    const grouped = {};
    for (const p of purchases) {
      const key = p.normalizedName;
      if (!grouped[key]) {
        grouped[key] = { dates: [], prices: [], name: p.itemName, category: p.category };
      }
      grouped[key].dates.push(new Date(p.date));
      if (p.price > 0) grouped[key].prices.push(p.price);
    }

    for (const [key, data] of Object.entries(grouped)) {
      data.dates.sort((a, b) => a - b);

      const count = data.dates.length;
      let avgDaysBetween = null;

      if (count >= 2) {
        const intervals = [];
        for (let i = 1; i < data.dates.length; i++) {
          const days = (data.dates[i] - data.dates[i - 1]) / (1000 * 60 * 60 * 24);
          if (days > 0) intervals.push(days);
        }
        if (intervals.length > 0) {
          avgDaysBetween = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        }
      }

      const firstPurchase = data.dates[0];
      const lastPurchase = data.dates[data.dates.length - 1];
      const daysSinceLast = (new Date() - lastPurchase) / (1000 * 60 * 60 * 24);

      const avgPrice = data.prices.length > 0
        ? data.prices.reduce((a, b) => a + b, 0) / data.prices.length
        : null;

      let pattern = 'sjelden'; // rare
      if (avgDaysBetween !== null) {
        if (avgDaysBetween <= 7) pattern = 'ukentlig';       // weekly
        else if (avgDaysBetween <= 14) pattern = 'annenhver uke'; // biweekly
        else if (avgDaysBetween <= 35) pattern = 'månedlig';  // monthly
        else pattern = 'sjelden';
      } else if (count === 1) {
        pattern = 'engangskjøp';
      }

      this.purchaseFrequencies.set(key, {
        normalizedName: key,
        displayName: data.name,
        category: data.category,
        purchaseCount: count,
        avgDaysBetween,
        daysSinceLast: Math.round(daysSinceLast),
        firstPurchase: firstPurchase.toISOString().split('T')[0],
        lastPurchase: lastPurchase.toISOString().split('T')[0],
        avgPrice,
        pattern,
      });
    }
  }

  // Calculate co-occurrence of items on same receipt
  calculateCoOccurrences(purchases) {
    this.coOccurrences.clear();

    // Group purchases by receipt
    const byReceipt = {};
    for (const p of purchases) {
      if (!byReceipt[p.receiptId]) byReceipt[p.receiptId] = [];
      byReceipt[p.receiptId].push(p);
    }

    // Count co-occurrences
    for (const items of Object.values(byReceipt)) {
      // Filter to food items only (exclude hygiene etc.)
      const foodItems = items.filter(i =>
        !['Hygiene', 'Rengjøringsartikler', 'Hund', 'Diverse', 'Tran og Sanasol'].includes(i.category)
      );

      for (let i = 0; i < foodItems.length; i++) {
        for (let j = i + 1; j < foodItems.length; j++) {
          const pair = [foodItems[i].normalizedName, foodItems[j].normalizedName].sort();
          const key = pair.join('|');
          this.coOccurrences.set(key, (this.coOccurrences.get(key) || 0) + 1);
        }
      }
    }
  }

  // Detect meal patterns from co-occurring items
  detectMealPatterns(purchases, receipts) {
    this.detectedMealPatterns = [];

    // Get items that co-occur frequently (3+ times)
    const frequentPairs = [];
    for (const [key, count] of this.coOccurrences) {
      if (count >= 2) { // Lower threshold for demo
        const [item1, item2] = key.split('|');
        frequentPairs.push({ item1, item2, count });
      }
    }

    // Cluster co-occurring items into groups (simple greedy clustering)
    const groups = this.clusterItems(frequentPairs);

    // Filter and score groups
    for (const group of groups) {
      if (group.items.length < 2) continue;
      if (group.items.length > 10) continue; // Too big to be a single meal

      // Check if group has protein + carb/veg (likely a meal)
      const categories = new Set(group.items.map(i => {
        const freq = this.purchaseFrequencies.get(i);
        return freq ? freq.category : 'Annet';
      }));

      const isMealLike = (
        (categories.has('Kjøtt') || categories.has('Fisk')) &&
        (categories.has('Grønnsaker') || categories.has('Tørrvarer'))
      );

      const suggestedName = this.suggestMealName(group.items);

      this.detectedMealPatterns.push({
        items: group.items.map(i => {
          const freq = this.purchaseFrequencies.get(i);
          return {
            normalizedName: i,
            displayName: freq ? freq.displayName : i,
            category: freq ? freq.category : 'Annet',
          };
        }),
        coOccurrenceScore: group.score,
        isMealLike,
        suggestedName,
        confirmed: false,
      });
    }

    // Sort by score
    this.detectedMealPatterns.sort((a, b) => b.coOccurrenceScore - a.coOccurrenceScore);
  }

  // Cluster frequently co-occurring items
  clusterItems(pairs) {
    const groups = [];
    const assigned = new Set();

    // Sort pairs by count descending
    pairs.sort((a, b) => b.count - a.count);

    for (const pair of pairs) {
      if (assigned.has(pair.item1) && assigned.has(pair.item2)) continue;

      // Find or create group
      let targetGroup = null;

      for (const group of groups) {
        if (group.items.includes(pair.item1) || group.items.includes(pair.item2)) {
          targetGroup = group;
          break;
        }
      }

      if (!targetGroup) {
        targetGroup = { items: [], score: 0 };
        groups.push(targetGroup);
      }

      if (!targetGroup.items.includes(pair.item1)) {
        targetGroup.items.push(pair.item1);
        assigned.add(pair.item1);
      }
      if (!targetGroup.items.includes(pair.item2)) {
        targetGroup.items.push(pair.item2);
        assigned.add(pair.item2);
      }
      targetGroup.score += pair.count;
    }

    return groups;
  }

  // Suggest a meal name based on ingredients
  suggestMealName(items) {
    const names = items.map(i => {
      const freq = this.purchaseFrequencies.get(i);
      return freq ? freq.displayName.toLowerCase() : i;
    });

    const joinedNames = names.join(' ');

    // Check for known meal patterns
    const mealHints = [
      { keywords: ['taco', 'tortilla', 'salsa', 'guacamole'], name: 'Taco' },
      { keywords: ['pasta', 'spaghetti', 'penne', 'fusilli'], name: 'Pasta' },
      { keywords: ['ris', 'jasmin', 'basmati'], name: 'Risrett' },
      { keywords: ['pizza', 'grandiosa'], name: 'Pizza' },
      { keywords: ['laks', 'laksfilet'], name: 'Laksemiddag' },
      { keywords: ['kylling', 'kyllingfilet'], name: 'Kyllingmiddag' },
      { keywords: ['kjøttdeig', 'tomater', 'spaghetti'], name: 'Spaghetti Bolognese' },
      { keywords: ['kjøttdeig', 'taco'], name: 'Tacofredag' },
      { keywords: ['torsk', 'torskefilet'], name: 'Torskemiddag' },
      { keywords: ['poteter', 'kjøtt'], name: 'Kjøtt og poteter' },
    ];

    for (const hint of mealHints) {
      if (hint.keywords.some(kw => joinedNames.includes(kw))) {
        return hint.name;
      }
    }

    // Default: use the protein + main ingredient
    const protein = names.find(n =>
      ['kylling', 'kjøtt', 'laks', 'torsk', 'sei', 'svin', 'biff'].some(p => n.includes(p))
    );
    if (protein) {
      return protein.charAt(0).toUpperCase() + protein.slice(1) + '-middag';
    }

    return 'Ukjent m\u00e5ltid';
  }

  // Get items due for restock
  getRestockSuggestions() {
    const suggestions = [];

    for (const [key, freq] of this.purchaseFrequencies) {
      if (freq.purchaseCount < 2) continue; // Need at least 2 purchases for pattern
      if (!freq.avgDaysBetween) continue;

      const overdue = freq.daysSinceLast > freq.avgDaysBetween;
      const dueSoon = freq.daysSinceLast > freq.avgDaysBetween * 0.7;
      const urgency = freq.daysSinceLast / freq.avgDaysBetween;

      if (dueSoon) {
        suggestions.push({
          ...freq,
          overdue,
          dueSoon: !overdue,
          urgency: Math.round(urgency * 100) / 100,
          daysOverdue: overdue ? Math.round(freq.daysSinceLast - freq.avgDaysBetween) : 0,
        });
      }
    }

    suggestions.sort((a, b) => b.urgency - a.urgency);
    return suggestions;
  }

  // Get frequency report sorted by purchase count
  getFrequencyReport() {
    const items = Array.from(this.purchaseFrequencies.values());
    items.sort((a, b) => b.purchaseCount - a.purchaseCount);
    return items;
  }

  // Get meal suggestions based on what hasn't been made recently
  async getMealSuggestions() {
    const meals = await db.getAllMeals();
    if (meals.length === 0) return [];

    const purchases = await db.getAllPurchases();

    return meals.map(meal => {
      // Find the last time all items in this meal were bought together
      const itemNames = meal.items.map(i => i.normalizedName);

      // Find receipts containing these items
      const receiptIds = new Set();
      for (const p of purchases) {
        if (itemNames.includes(p.normalizedName)) {
          receiptIds.add(p.receiptId);
        }
      }

      // Check which receipts have all (or most) items
      let lastMadeDate = null;
      for (const rid of receiptIds) {
        const receiptPurchases = purchases.filter(p => p.receiptId === rid);
        const receiptItems = receiptPurchases.map(p => p.normalizedName);
        const matchCount = itemNames.filter(i => receiptItems.includes(i)).length;

        if (matchCount >= itemNames.length * 0.6) { // 60% match
          const receiptDate = receiptPurchases[0]?.date;
          if (receiptDate && (!lastMadeDate || receiptDate > lastMadeDate)) {
            lastMadeDate = receiptDate;
          }
        }
      }

      const daysSince = lastMadeDate
        ? Math.round((new Date() - new Date(lastMadeDate)) / (1000 * 60 * 60 * 24))
        : null;

      return {
        ...meal,
        lastMadeDate,
        daysSinceLastMade: daysSince,
        neverMade: daysSince === null,
      };
    }).sort((a, b) => {
      if (a.neverMade && !b.neverMade) return -1;
      if (!a.neverMade && b.neverMade) return 1;
      return (b.daysSinceLastMade || 0) - (a.daysSinceLastMade || 0);
    });
  }
}

const patternEngine = new PatternEngine();
