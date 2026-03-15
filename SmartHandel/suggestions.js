// SmartHandel - Smart Shopping Suggestions
// Generates shopping suggestions based on patterns, meals, and preferences

class SuggestionEngine {
  constructor() {
    this.suggestions = [];
  }

  async generateAll() {
    const analysis = await patternEngine.analyze();
    const alwaysBuyItems = await db.getAlwaysBuyItems();
    const mealSuggestions = await patternEngine.getMealSuggestions();

    this.suggestions = [];

    // 1. Always-buy items
    const alwaysBuy = alwaysBuyItems.map(item => ({
      type: 'always',
      label: 'Kj\u00f8pes alltid',
      item: item.displayName,
      normalizedName: item.normalizedName,
      category: item.category,
      reason: 'Merket som fast vare',
      priority: 3,
    }));

    // 2. Restock suggestions
    const restock = analysis.restockSuggestions.map(item => ({
      type: 'restock',
      label: item.overdue ? 'P\u00e5 tide' : 'Snart tid',
      item: item.displayName,
      normalizedName: item.normalizedName,
      category: item.category,
      reason: item.overdue
        ? `${item.daysOverdue} dager over vanlig kj\u00f8pssyklus (${item.pattern})`
        : `Kj\u00f8pes vanligvis ${item.pattern} (${Math.round(item.avgDaysBetween)} dager)`,
      priority: item.overdue ? 2 : 1,
      urgency: item.urgency,
      avgPrice: item.avgPrice,
    }));

    // 3. Meal-based suggestions
    const mealBased = [];
    for (const meal of mealSuggestions.slice(0, 5)) {
      const items = meal.items.map(i => i.displayName || i.normalizedName);
      mealBased.push({
        type: 'meal',
        label: 'M\u00e5ltidsforslag',
        item: meal.name,
        items,
        mealId: meal.id,
        reason: meal.neverMade
          ? 'Har ikke blitt laget enn\u00e5'
          : `Sist laget for ${meal.daysSinceLastMade} dager siden`,
        priority: meal.neverMade ? 1 : (meal.daysSinceLastMade > 14 ? 2 : 0),
      });
    }

    this.suggestions = [...alwaysBuy, ...restock, ...mealBased];
    this.suggestions.sort((a, b) => b.priority - a.priority);

    return this.suggestions;
  }

  // Generate a complete weekly shopping list
  async generateWeeklyList() {
    const analysis = await patternEngine.analyze();
    const alwaysBuyItems = await db.getAlwaysBuyItems();
    const meals = await db.getAllMeals();

    const weeklyItems = new Map(); // normalizedName -> { item, reasons[] }

    // Add always-buy items
    for (const item of alwaysBuyItems) {
      weeklyItems.set(item.normalizedName, {
        name: item.displayName,
        category: item.category,
        reasons: ['Fast vare'],
      });
    }

    // Add overdue restock items
    for (const item of analysis.restockSuggestions) {
      if (item.overdue || item.pattern === 'ukentlig') {
        const existing = weeklyItems.get(item.normalizedName);
        if (existing) {
          existing.reasons.push('Tid for p\u00e5fyll');
        } else {
          weeklyItems.set(item.normalizedName, {
            name: item.displayName,
            category: item.category,
            reasons: ['Tid for p\u00e5fyll'],
          });
        }
      }
    }

    // Suggest one meal's ingredients
    const mealSuggestions = await patternEngine.getMealSuggestions();
    if (mealSuggestions.length > 0) {
      const suggestedMeal = mealSuggestions[0];
      for (const item of suggestedMeal.items) {
        const key = item.normalizedName;
        const existing = weeklyItems.get(key);
        if (existing) {
          existing.reasons.push(`Til ${suggestedMeal.name}`);
        } else {
          weeklyItems.set(key, {
            name: item.displayName || item.normalizedName,
            category: item.category || 'Annet',
            reasons: [`Til ${suggestedMeal.name}`],
          });
        }
      }
    }

    // Group by category
    const byCategory = {};
    for (const [key, data] of weeklyItems) {
      if (!byCategory[data.category]) byCategory[data.category] = [];
      byCategory[data.category].push({
        normalizedName: key,
        ...data,
      });
    }

    return {
      items: weeklyItems,
      byCategory,
      totalItems: weeklyItems.size,
      suggestedMeal: mealSuggestions[0] || null,
    };
  }

  // Add suggestions to To Do list
  async addToTodoList(items, listId = null) {
    if (!auth.isLoggedIn()) {
      showToast('Logg inn for \u00e5 legge til i handlelisten', 'warning');
      return;
    }

    const titles = items.map(i => typeof i === 'string' ? i : i.name || i.item);
    await todoApi.createTasks(titles, listId);
  }
}

const suggestionEngine = new SuggestionEngine();
