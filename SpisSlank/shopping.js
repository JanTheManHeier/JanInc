/* ============================================================
   SpisSlank — Shopping List (shopping.js)
   Aggregates ingredients from weekly meal plans into a grouped,
   checkable grocery list with localStorage persistence.
   ============================================================ */

(function () {
  'use strict';

  var STORAGE_KEY = 'spisslank-shoppingChecked';

  // Norwegian grocery store aisle order
  var SECTION_ORDER = [
    { key: 'Frukt & Grønt', emoji: '🥬' },
    { key: 'Meieri',        emoji: '🥛' },
    { key: 'Kjøtt & Fisk',  emoji: '🥩' },
    { key: 'Bakeri',         emoji: '🍞' },
    { key: 'Tørrvarer',     emoji: '📦' },
    { key: 'Helse',          emoji: '🫙' },
    { key: 'Drikke',         emoji: '☕' },
  ];

  // Carnivore diet store sections
  var CARNIVORE_SECTION_ORDER = [
    { key: 'Kjøtt',          emoji: '🥩' },
    { key: 'Fisk',           emoji: '🐟' },
    { key: 'Egg & Meieri',   emoji: '🥚' },
    { key: 'Krydder & Salt', emoji: '🧂' },
    { key: 'Ekstra',         emoji: '🍯' },
  ];

  // Units we know how to sum
  var KNOWN_UNITS = ['g', 'kg', 'dl', 'l', 'ss', 'ts', 'stk'];

  // ---- Amount parsing & aggregation ----

  /**
   * Parse a quantity string like "150g", "2 ss", "0.5 dl" into { value, unit }.
   * Returns null if unparseable.
   */
  function parseAmount(str) {
    if (!str) return null;
    var s = str.trim();
    // Match a leading number (int or decimal) followed by optional whitespace and a unit
    var m = s.match(/^(\d+(?:[.,]\d+)?)\s*([a-zA-ZæøåÆØÅ]+)$/);
    if (!m) return null;
    var value = parseFloat(m[1].replace(',', '.'));
    var unit = m[2].toLowerCase();
    if (KNOWN_UNITS.indexOf(unit) === -1) return null;
    return { value: value, unit: unit };
  }

  /**
   * Aggregate an array of amount strings.
   * Groups by unit, sums numeric parts, returns combined string like "230g, 3 ss".
   * Amounts that can't be parsed are kept as-is.
   */
  function aggregateAmounts(amounts) {
    var byUnit = {};     // unit -> total value
    var unknowns = [];   // strings we can't parse

    for (var i = 0; i < amounts.length; i++) {
      var parsed = parseAmount(amounts[i]);
      if (parsed) {
        byUnit[parsed.unit] = (byUnit[parsed.unit] || 0) + parsed.value;
      } else if (amounts[i] && amounts[i].trim()) {
        unknowns.push(amounts[i].trim());
      }
    }

    var parts = [];

    // Output in KNOWN_UNITS order for consistency
    for (var u = 0; u < KNOWN_UNITS.length; u++) {
      var unit = KNOWN_UNITS[u];
      if (byUnit[unit] !== undefined) {
        var val = byUnit[unit];
        // Show integer when possible, otherwise one decimal
        var display = (val === Math.floor(val)) ? String(val) : val.toFixed(1).replace(/\.0$/, '');
        parts.push(display + ' ' + unit);
      }
    }

    // Append any unparseable amounts
    for (var k = 0; k < unknowns.length; k++) {
      parts.push(unknowns[k]);
    }

    return parts.join(', ');
  }

  // ---- Collect meals for a week ----

  /**
   * Resolve the meals for a given weekIndex, applying any user swaps.
   * Returns a flat array of meal objects.
   */
  function getMealsForWeek(weekIndex, swaps, plansSource, mealsSource) {
    var plans = plansSource || window.WEEKLY_PLANS;
    if (!plans || !plans[weekIndex]) return [];

    var plan = plans[weekIndex];

    // plan.days is expected: array of day objects, each with meal slots
    // Each day has keys like { frokost, lunsj, middag, snack } mapping to meal IDs
    var days = plan.days || plan;
    if (!Array.isArray(days)) {
      // If plan itself is an array of days
      days = plan;
    }

    var meals = mealsSource || window.MEALS || [];
    var mealMap = {};
    for (var m = 0; m < meals.length; m++) {
      mealMap[meals[m].id] = meals[m];
    }

    var result = [];
    var seenMealIds = {};

    for (var d = 0; d < days.length; d++) {
      var day = days[d];
      var slots = day.meals || day;
      // slots can be an object { frokost: 'id', ... } or array of ids
      var ids = [];

      if (Array.isArray(slots)) {
        ids = slots;
      } else if (typeof slots === 'object') {
        var keys = Object.keys(slots);
        for (var k = 0; k < keys.length; k++) {
          var val = slots[keys[k]];
          if (typeof val === 'string') {
            ids.push(val);
          } else if (Array.isArray(val)) {
            ids = ids.concat(val);
          }
        }
      }

      for (var j = 0; j < ids.length; j++) {
        var mealId = ids[j];
        // Apply swaps: swaps keys can be "weekIndex-dayIndex-slot" or just mealId
        if (swaps) {
          var swapKey = weekIndex + '-' + d + '-' + j;
          if (swaps[swapKey]) mealId = swaps[swapKey];
          else if (swaps[mealId]) mealId = swaps[mealId];
        }

        var meal = mealMap[mealId];
        if (meal && !seenMealIds[meal.id]) {
          result.push(meal);
          seenMealIds[meal.id] = true;
        } else if (meal) {
          // Same meal appears again — still collect its ingredients
          result.push(meal);
        }
      }
    }

    return result;
  }

  // ---- Build shopping data ----

  /**
   * Aggregate all ingredients from the given meals into a map:
   *   { "ingredient name (lowercase)": { name, section, amounts: [...] } }
   */
  function buildIngredientMap(meals, arsenalSource) {
    var arsenal = arsenalSource || window.FOOD_ARSENAL || [];
    var arsenalMap = {};
    for (var a = 0; a < arsenal.length; a++) {
      arsenalMap[arsenal[a].id] = arsenal[a];
      arsenalMap[arsenal[a].nameNO.toLowerCase()] = arsenal[a];
    }

    var map = {}; // key = lowercase name

    for (var m = 0; m < meals.length; m++) {
      var ingredients = meals[m].ingredients || [];
      for (var i = 0; i < ingredients.length; i++) {
        var ing = ingredients[i];
        // ing can be { name, amount, section? } or a string
        var name, amount, section;

        if (typeof ing === 'string') {
          name = ing;
          amount = '';
          section = '';
        } else {
          name = ing.name || ing.nameNO || '';
          amount = ing.amount || ing.qty || '';
          section = ing.section || ing.storeSection || '';
        }

        var key = name.toLowerCase().trim();
        if (!key) continue;

        if (!map[key]) {
          // Try to find store section from FOOD_ARSENAL if not on the ingredient
          if (!section) {
            var arsenalItem = arsenalMap[key];
            if (arsenalItem) section = arsenalItem.storeSection || '';
          }

          map[key] = {
            name: name.trim(),
            section: section || 'Tørrvarer', // default section
            amounts: [],
          };
        }

        if (amount) {
          map[key].amounts.push(String(amount).trim());
        }
      }
    }

    return map;
  }

  /**
   * Group ingredient map entries by store section.
   * Returns array of { section, emoji, items: [{ name, qty }] } in aisle order.
   */
  function groupBySection(ingredientMap, sectionOrder) {
    sectionOrder = sectionOrder || SECTION_ORDER;
    var sections = {};

    var keys = Object.keys(ingredientMap);
    for (var i = 0; i < keys.length; i++) {
      var entry = ingredientMap[keys[i]];
      var sec = entry.section;
      if (!sections[sec]) sections[sec] = [];
      sections[sec].push({
        name: entry.name,
        qty: aggregateAmounts(entry.amounts),
      });
    }

    // Sort items alphabetically within each section
    var sectionKeys = Object.keys(sections);
    for (var s = 0; s < sectionKeys.length; s++) {
      sections[sectionKeys[s]].sort(function (a, b) {
        return a.name.localeCompare(b.name, 'no');
      });
    }

    // Build ordered result following section order
    var result = [];
    for (var o = 0; o < sectionOrder.length; o++) {
      var def = sectionOrder[o];
      if (sections[def.key]) {
        result.push({
          section: def.key,
          emoji: def.emoji,
          items: sections[def.key],
        });
        delete sections[def.key];
      }
    }

    // Append any sections not in our predefined list
    var remaining = Object.keys(sections);
    for (var r = 0; r < remaining.length; r++) {
      result.push({
        section: remaining[r],
        emoji: '🛒',
        items: sections[remaining[r]],
      });
    }

    return result;
  }

  // ---- localStorage helpers ----

  function loadChecked() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveChecked(checkedMap) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checkedMap));
    } catch (e) { /* quota exceeded — ignore */ }
  }

  // ---- Render ----

  function renderSummary(container, totalCount, checkedCount) {
    var summary = document.createElement('div');
    summary.className = 'shopping-summary';
    summary.setAttribute('aria-live', 'polite');

    var total = document.createElement('span');
    total.className = 'shopping-summary__total';
    var tFn = window.t || function (k) { return k; };
    total.textContent = totalCount + ' ' + tFn('shopping.itemsThisWeek');

    var progress = document.createElement('span');
    progress.className = 'shopping-summary__progress';
    progress.textContent = tFn('shopping.progress').replace('{checked}', checkedCount).replace('{total}', totalCount);

    summary.appendChild(total);
    summary.appendChild(progress);
    container.appendChild(summary);

    return { totalEl: total, progressEl: progress };
  }

  function render(sectionGroups, checkedMap) {
    var container = document.getElementById('shopping-list');
    if (!container) return;
    container.innerHTML = '';

    var totalCount = 0;
    var checkedCount = 0;

    // Count totals
    for (var c = 0; c < sectionGroups.length; c++) {
      totalCount += sectionGroups[c].items.length;
      for (var ci = 0; ci < sectionGroups[c].items.length; ci++) {
        if (checkedMap[sectionGroups[c].items[ci].name]) checkedCount++;
      }
    }

    // Summary bar
    var summaryEls = renderSummary(container, totalCount, checkedCount);

    // Sections
    for (var s = 0; s < sectionGroups.length; s++) {
      var group = sectionGroups[s];
      var section = document.createElement('div');
      section.className = 'shopping-section';

      // Header
      var header = document.createElement('div');
      header.className = 'shopping-section__header';

      var emojiSpan = document.createElement('span');
      emojiSpan.className = 'shopping-section__emoji';
      emojiSpan.setAttribute('aria-hidden', 'true');
      emojiSpan.textContent = group.emoji;

      var titleSpan = document.createElement('span');
      titleSpan.textContent = group.section;

      header.appendChild(emojiSpan);
      header.appendChild(titleSpan);
      section.appendChild(header);

      // Items
      for (var i = 0; i < group.items.length; i++) {
        var item = group.items[i];
        var isChecked = !!checkedMap[item.name];

        var row = document.createElement('div');
        row.className = 'shopping-item' + (isChecked ? ' checked' : '');

        var cbWrap = document.createElement('div');
        cbWrap.className = 'shopping-item__checkbox';

        var cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = isChecked;
        cb.setAttribute('data-item', item.name);

        cbWrap.appendChild(cb);

        var label = document.createElement('span');
        label.className = 'shopping-item__label';
        label.textContent = item.name;

        var qty = document.createElement('span');
        qty.className = 'shopping-item__qty';
        qty.textContent = item.qty || '';

        row.appendChild(cbWrap);
        row.appendChild(label);
        row.appendChild(qty);
        section.appendChild(row);
      }

      container.appendChild(section);
    }

    // Event delegation for checkboxes
    container.addEventListener('change', function (e) {
      if (e.target.type !== 'checkbox') return;
      var itemName = e.target.getAttribute('data-item');
      if (!itemName) return;

      var row = e.target.closest('.shopping-item');
      var currentChecked = loadChecked();

      if (e.target.checked) {
        currentChecked[itemName] = true;
        if (row) row.classList.add('checked');
        checkedCount++;
      } else {
        delete currentChecked[itemName];
        if (row) row.classList.remove('checked');
        checkedCount--;
      }

      saveChecked(currentChecked);
      summaryEls.progressEl.textContent = (window.t || function(k){return k;})('shopping.progress').replace('{checked}', checkedCount).replace('{total}', totalCount);
    });

    // Nullstill button
    var clearBtn = document.getElementById('btn-clear-shopping');
    if (clearBtn) {
      // Remove old listeners by cloning
      var newBtn = clearBtn.cloneNode(true);
      clearBtn.parentNode.replaceChild(newBtn, clearBtn);

      newBtn.addEventListener('click', function () {
        localStorage.removeItem(STORAGE_KEY);
        var boxes = container.querySelectorAll('input[type="checkbox"]');
        for (var b = 0; b < boxes.length; b++) {
          boxes[b].checked = false;
          var r = boxes[b].closest('.shopping-item');
          if (r) r.classList.remove('checked');
        }
        checkedCount = 0;
        summaryEls.progressEl.textContent = (window.t || function(k){return k;})('shopping.progress').replace('{checked}', 0).replace('{total}', totalCount);
      });
    }

    // Week label
    return { totalCount: totalCount, checkedCount: checkedCount };
  }

  // ---- Main public function ----

  /**
   * Render the shopping list for a given week plan.
   * @param {number} weekIndex — 0-3, which weekly plan
   * @param {object} swaps — any meal swaps the user made
   */
  window.renderShoppingList = function (weekIndex, swaps) {
    weekIndex = weekIndex || 0;
    swaps = swaps || {};

    // Detect carnivore diet mode
    var profile = JSON.parse(localStorage.getItem('spisslank-profile') || '{}');
    var isCarnivore = profile.dietMode === 'carnivore';

    var plansSource = isCarnivore ? window.CARNIVORE_WEEKLY_PLANS : window.WEEKLY_PLANS;
    var mealsSource = isCarnivore ? window.CARNIVORE_MEALS : window.MEALS;
    var sections = isCarnivore ? CARNIVORE_SECTION_ORDER : SECTION_ORDER;
    var foodArsenal = isCarnivore ? window.CARNIVORE_FOOD_ARSENAL : window.FOOD_ARSENAL;

    // Update week label
    var weekLabel = document.getElementById('shopping-week-label');
    if (weekLabel) {
      weekLabel.textContent = (window.t ? window.t('shopping.weekLabel') : 'Uke') + ' ' + (weekIndex + 1);
    }

    // Collect meals and aggregate (use filtered meals from app.js if available)
    var meals = (typeof window.getFilteredMealsForWeek === 'function')
      ? window.getFilteredMealsForWeek(weekIndex)
      : getMealsForWeek(weekIndex, swaps, plansSource, mealsSource);
    var ingredientMap = buildIngredientMap(meals, foodArsenal);
    var sectionGroups = groupBySection(ingredientMap, sections);
    var checkedMap = loadChecked();

    render(sectionGroups, checkedMap);
  };
})();
