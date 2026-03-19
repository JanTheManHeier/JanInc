/* ============================================================
 *  SpisSlank — app.js
 *  Hovedlogikk: navigasjon, måltidskort, radar, bytte-modal
 * ============================================================ */

(function () {
  'use strict';

  // ── Konstantar ──────────────────────────────────────────────
  const STORAGE_KEYS = {
    currentWeek:     'spisslank-currentWeek',
    swaps:           'spisslank-swaps',
    shoppingChecked: 'spisslank-shoppingChecked',
    lastView:        'spisslank-lastView',
  };

  const MEAL_TYPES = [
    { key: 'breakfast',  icon: '🌅', label: 'Frokost' },
    { key: 'lunchAddon', icon: '🥗', label: 'Lunsj-tillegg' },
    { key: 'snack',      icon: '🥜', label: 'Mellommåltid 16:00' },
    { key: 'dinner',     icon: '🍽️', label: 'Middag' },
    { key: 'evening',    icon: '🌙', label: 'Kveldsmat' },
  ];

  const NORWEGIAN_DAYS = [
    'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag',
    'Fredag', 'Lørdag', 'Søndag',
  ];

  const NORWEGIAN_MONTHS = [
    'januar', 'februar', 'mars', 'april', 'mai', 'juni',
    'juli', 'august', 'september', 'oktober', 'november', 'desember',
  ];

  // ── Hjelpefunksjoner ────────────────────────────────────────

  /** Hent måltid fra MEALS-arrayen */
  const getMealById = (id) => window.MEALS.find((m) => m.id === id) || null;

  /** Norsk dagnamn */
  const getNorwegianDay = (dayIndex) => NORWEGIAN_DAYS[dayIndex] || '';

  /** Formater dagens dato på norsk, f.eks. «Tirsdag 17. mars» */
  const getNorwegianDate = () => {
    const now = new Date();
    const jsDay = now.getDay();                     // 0=søndag
    const dayIndex = jsDay === 0 ? 6 : jsDay - 1;   // 0=mandag
    const dayName = getNorwegianDay(dayIndex);
    const date = now.getDate();
    const month = NORWEGIAN_MONTHS[now.getMonth()];
    return `${dayName} ${date}. ${month}`;
  };

  /** Formater tilberedningstid */
  const formatPrepTime = (minutes) => `${minutes} min`;

  /** Gjeldande vekeindeks (0-3) frå localStorage */
  const getCurrentWeek = () => {
    const stored = localStorage.getItem(STORAGE_KEYS.currentWeek);
    const week = parseInt(stored, 10);
    return Number.isFinite(week) && week >= 0 && week < 4 ? week : 0;
  };

  /** Lagra gjeldande veke */
  const setCurrentWeek = (index) => {
    localStorage.setItem(STORAGE_KEYS.currentWeek, String(index));
  };

  /** Hent bytteoverstyringer som objekt */
  const getSwaps = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.swaps)) || {}; }
    catch { return {}; }
  };

  /** Lagra ei ny bytteovertyring */
  const setSwap = (dayIndex, mealTypeKey, mealId) => {
    const swaps = getSwaps();
    swaps[`${dayIndex}-${mealTypeKey}`] = mealId;
    localStorage.setItem(STORAGE_KEYS.swaps, JSON.stringify(swaps));
  };

  /** Indeks for dagens vekedag (0=mandag … 6=søndag) */
  const getTodayIndex = () => {
    const d = new Date().getDay();
    return d === 0 ? 6 : d - 1;
  };

  /**
   * Hent måltid-ID-ar for éin dag, med eventuelle bytter lagt inn.
   * Returnerer { breakfast: id, lunch: id, snack: id, dinner: id }
   */
  const getDayPlan = (weekIndex, dayIndex) => {
    const plan = window.WEEKLY_PLANS[weekIndex];
    if (!plan || !plan.days[dayIndex]) return null;
    const dayObj = plan.days[dayIndex];
    const base = { ...(dayObj.meals || dayObj) };
    const swaps = getSwaps();
    for (const mt of MEAL_TYPES) {
      const override = swaps[`${dayIndex}-${mt.key}`];
      if (override) base[mt.key] = override;
    }
    return base;
  };

  /** Hent fullstendige måltidsobjekt for éin dag */
  const getTodaysMeals = () => {
    const plan = getDayPlan(getCurrentWeek(), getTodayIndex());
    if (!plan) return [];
    return MEAL_TYPES.map((mt) => ({
      ...mt,
      meal: getMealById(plan[mt.key]),
    })).filter((m) => m.meal);
  };

  /** Hent alle måltid for ei heil veke (7 dagar) */
  const getWeekMeals = (weekIndex) => {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const dayPlan = getDayPlan(weekIndex, d);
      const meals = dayPlan
        ? MEAL_TYPES.map((mt) => ({ ...mt, meal: getMealById(dayPlan[mt.key]) })).filter((m) => m.meal)
        : [];
      week.push({ dayIndex: d, meals });
    }
    return week;
  };

  /** Pathway-nøklar i fast rekkefølge (brukt av radar m.m.) */
  const pathwayKeys = () => Object.keys(window.PATHWAYS);

  /**
   * Rekn ut dagsdekning for kvar pathway.
   * Summerer pathwayScores frå alle måltid, normaliserer til 0-5.
   */
  const calculateDailyPathways = (mealObjects) => {
    const keys = pathwayKeys();
    const raw = {};
    keys.forEach((k) => (raw[k] = 0));

    mealObjects.forEach((m) => {
      if (!m || !m.pathways) return;
      keys.forEach((k) => { raw[k] += m.pathways[k] || 0; });
    });

    // Normaliser: max mogleg er 5 * antal måltid, men clamp til 5
    const maxPossible = mealObjects.length * 5 || 1;
    const normalized = {};
    keys.forEach((k) => {
      normalized[k] = Math.min(raw[k] / maxPossible * 5, 5);
    });
    return normalized;
  };

  /** Prosentvis totaldekning (gjennomsnitt av normaliserte verdiar) */
  const coveragePercent = (normalized) => {
    const keys = pathwayKeys();
    if (keys.length === 0) return 0;
    const sum = keys.reduce((s, k) => s + (normalized[k] || 0), 0);
    return Math.round((sum / (keys.length * 5)) * 100);
  };

  // ── Navigasjon ──────────────────────────────────────────────

  const switchView = (viewName) => {
    document.querySelectorAll('[data-view]').forEach((section) => {
      if (section.tagName === 'SECTION') {
        section.style.display = section.dataset.view === viewName ? 'block' : 'none';
      }
    });

    document.querySelectorAll('.nav-tab').forEach((btn) => {
      const isActive = btn.dataset.view === viewName;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-current', isActive ? 'page' : 'false');
    });

    localStorage.setItem(STORAGE_KEYS.lastView, viewName);

    // Deleger rendering til rette modul
    if (viewName === 'today')    renderTodayView();
    if (viewName === 'week')     renderWeekView();
    if (viewName === 'shopping' && typeof window.renderShoppingList === 'function') window.renderShoppingList();
    if (viewName === 'science'  && typeof window.renderScienceView  === 'function') window.renderScienceView();
  };

  // ── Today-visning ───────────────────────────────────────────

  const renderTodayView = () => {
    // Dato
    const dateEl = document.getElementById('today-date');
    if (dateEl) {
      const dateStr = getNorwegianDate();
      dateEl.textContent = dateStr;
      dateEl.setAttribute('datetime', new Date().toISOString().slice(0, 10));
    }

    const todayMeals = getTodaysMeals();
    const mealObjects = todayMeals.map((m) => m.meal);

    renderPathwayDots(mealObjects);
    drawRadarChart(mealObjects);
    renderMealCards(todayMeals);
  };

  /** Oppdater pathway-prikkane i headeren */
  const renderPathwayDots = (mealObjects) => {
    const container = document.getElementById('today-pathway-dots');
    if (!container) return;

    const keys = pathwayKeys();
    const normalized = calculateDailyPathways(mealObjects);

    container.innerHTML = keys.map((k) => {
      const pw = window.PATHWAYS[k];
      const level = normalized[k] || 0;
      const active = level >= 1;
      return `<span class="dot${active ? ' dot-active' : ''}"
                    title="${pw.name}: ${Math.round(level * 20)}%"
                    aria-label="${pw.name}"
                    style="background:${active ? pw.color : 'var(--color-muted, #444)'}"></span>`;
    }).join('');
  };

  /** Render måltidskort for i-dag */
  const renderMealCards = (todayMeals) => {
    const container = document.getElementById('today-meals');
    if (!container) return;

    container.innerHTML = todayMeals.map(({ key, icon, label, meal }) => {
      const pathwayBadges = buildPathwayBadges(meal);
      return `
        <article class="meal-card" role="listitem" data-meal-id="${meal.id}" data-meal-type="${key}">
          <div class="meal-card-header">
            <span class="meal-icon">${icon}</span>
            <div class="meal-meta">
              <span class="meal-type">${label}</span>
              <h2 class="meal-name">${meal.name}</h2>
            </div>
            <span class="prep-badge">⏱ ${formatPrepTime(meal.prepTime)}</span>
          </div>
          <div class="pathway-badges">${pathwayBadges}</div>
          <div class="meal-detail" hidden>
            ${buildMealDetail(meal)}
          </div>
          <div class="meal-actions">
            <button class="btn-expand" aria-expanded="false">Vis detaljer</button>
            <button class="btn-swap" data-meal-type="${key}" data-meal-id="${meal.id}">🔄 Bytt</button>
          </div>
        </article>`;
    }).join('');
  };

  /** Bygg fargeprikkane for pathways med score ≥ 3 */
  const buildPathwayBadges = (meal) => {
    if (!meal || !meal.pathways) return '';
    const keys = pathwayKeys();
    return keys
      .filter((k) => (meal.pathways[k] || 0) >= 3)
      .map((k) => {
        const pw = window.PATHWAYS[k];
        return `<span class="pathway-pill" style="background:${pw.color}" title="${pw.name}">${pw.name}</span>`;
      })
      .join('');
  };

  /** Bygg detaljseksjon for eit måltid */
  const buildMealDetail = (meal) => {
    const ingredients = (meal.ingredients || [])
      .map((ing) => {
        const txt = typeof ing === 'string' ? ing : `${ing.amount} ${ing.name}`;
        return `<li>${txt}</li>`;
      })
      .join('');

    let steps = '';
    if (typeof meal.instructions === 'string' && meal.instructions) {
      steps = `<li>${meal.instructions}</li>`;
    } else if (Array.isArray(meal.instructions)) {
      steps = meal.instructions.map((s) => `<li>${s}</li>`).join('');
    }

    let html = '';
    if (ingredients) html += `<div class="detail-section"><h3>Ingredienser</h3><ul>${ingredients}</ul></div>`;
    if (steps)       html += `<div class="detail-section"><h3>Fremgangsmåte</h3><ol>${steps}</ol></div>`;
    if (meal.scienceNote)    html += `<div class="detail-section detail-science"><h3>🔬 Hvorfor dette virker</h3><p>${meal.scienceNote}</p></div>`;
    if (meal.drugEquivalent) html += `<div class="detail-section detail-drug"><h3>💊 Medisin-ekvivalent</h3><p>${meal.drugEquivalent}</p></div>`;
    return html;
  };

  // ── Expand / Collapse ───────────────────────────────────────

  const handleMealCardClick = (e) => {
    const expandBtn = e.target.closest('.btn-expand');
    if (!expandBtn) return;

    const card = expandBtn.closest('.meal-card');
    if (!card) return;

    const detail = card.querySelector('.meal-detail');
    const isExpanded = card.classList.contains('expanded');

    // Lukk alle andre
    document.querySelectorAll('.meal-card.expanded').forEach((c) => {
      if (c !== card) {
        c.classList.remove('expanded');
        const d = c.querySelector('.meal-detail');
        if (d) d.hidden = true;
        const btn = c.querySelector('.btn-expand');
        if (btn) { btn.setAttribute('aria-expanded', 'false'); btn.textContent = 'Vis detaljer'; }
      }
    });

    // Toggle gjeldande
    if (isExpanded) {
      card.classList.remove('expanded');
      if (detail) detail.hidden = true;
      expandBtn.setAttribute('aria-expanded', 'false');
      expandBtn.textContent = 'Vis detaljer';
    } else {
      card.classList.add('expanded');
      if (detail) detail.hidden = false;
      expandBtn.setAttribute('aria-expanded', 'true');
      expandBtn.textContent = 'Skjul detaljer';
    }
  };

  // ── Bytt-modal ──────────────────────────────────────────────

  const openSwapModal = (mealTypeKey, currentMealId) => {
    const modal = document.getElementById('swap-modal');
    const optionsContainer = document.getElementById('swap-options');
    if (!modal || !optionsContainer) return;

    // Map WEEKLY_PLANS slot keys to meal.type values
    const slotToMealType = {
      breakfast: 'breakfast',
      lunchAddon: 'lunch-addon',
      snack: 'snack',
      dinner: 'dinner',
      evening: 'evening',
    };
    const mealType = slotToMealType[mealTypeKey] || mealTypeKey;

    // Finn alternative måltid av same type
    const alternatives = window.MEALS
      .filter((m) => m.type === mealType && m.id !== currentMealId)
      .slice(0, 5);

    if (alternatives.length === 0) {
      optionsContainer.innerHTML = '<p class="swap-empty">Ingen alternativer tilgjengeleg.</p>';
    } else {
      optionsContainer.innerHTML = alternatives.map((alt) => `
        <button class="swap-option" role="listitem" data-swap-id="${alt.id}" data-swap-type="${mealTypeKey}">
          <span class="swap-name">${alt.name}</span>
          <span class="swap-prep">⏱ ${formatPrepTime(alt.prepTime)}</span>
          <div class="pathway-badges">${buildPathwayBadges(alt)}</div>
        </button>
      `).join('');
    }

    modal.hidden = false;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModals = () => {
    document.querySelectorAll('.modal-overlay').forEach((m) => {
      m.hidden = true;
      m.classList.remove('active');
    });
    document.body.style.overflow = '';
  };

  const handleSwapSelection = (e) => {
    const option = e.target.closest('.swap-option');
    if (!option) return;

    const newMealId = option.dataset.swapId;
    const mealTypeKey = option.dataset.swapType;
    const dayIndex = getTodayIndex();

    setSwap(dayIndex, mealTypeKey, newMealId);
    closeModals();
    renderTodayView();
  };

  // ── Måltidsdetalj-modal ─────────────────────────────────────

  const openMealModal = (meal) => {
    const modal = document.getElementById('meal-modal');
    const body = document.getElementById('modal-body');
    if (!modal || !body || !meal) return;

    body.innerHTML = `
      <h2 class="modal-meal-name">${meal.name}</h2>
      ${buildMealDetail(meal)}
    `;

    modal.hidden = false;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  // ── Week-visning ────────────────────────────────────────────

  const renderWeekView = () => {
    const weekIndex = getCurrentWeek();
    const plan = window.WEEKLY_PLANS[weekIndex];
    if (!plan) return;

    // Oppdater veke-veljar-knappar
    document.querySelectorAll('.week-btn').forEach((btn) => {
      const wi = parseInt(btn.dataset.week, 10) - 1;
      const isActive = wi === weekIndex;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });

    const weekData = getWeekMeals(weekIndex);
    const grid = document.getElementById('week-grid');
    if (!grid) return;

    grid.innerHTML = weekData.map(({ dayIndex, meals }) => {
      const dayName = getNorwegianDay(dayIndex);
      const isToday = dayIndex === getTodayIndex();
      const mealRows = meals.map(({ icon, label, meal }) => {
        const dots = buildPathwayBadges(meal);
        return `
          <div class="day-meal-item" data-meal-id="${meal.id}">
            <button class="day-meal-header" aria-expanded="false">
              <span class="day-meal-label">${icon} <strong>${label}:</strong> ${meal.name}</span>
              <span class="day-meal-badges">${dots}</span>
              <span class="day-meal-expand" aria-hidden="true">📖</span>
            </button>
            <div class="day-meal-recipe" hidden>
              ${buildMealDetail(meal)}
            </div>
          </div>`;
      }).join('');

      return `
        <article class="day-card${isToday ? ' day-today' : ''}" role="listitem" data-day="${dayIndex}">
          <button class="day-header" aria-expanded="false">
            <span class="day-name">${dayName}${isToday ? ' (i dag)' : ''}</span>
            <span class="day-summary">${meals.length} måltider</span>
            <span class="day-expand-icon" aria-hidden="true">▸</span>
          </button>
          <div class="day-meals" hidden>
            ${mealRows}
          </div>
        </article>`;
    }).join('');
  };

  /** Expand/collapse dagkort i vekeoversikten */
  const handleDayCardClick = (e) => {
    // Handle recipe expand/collapse within a meal
    const mealHeader = e.target.closest('.day-meal-header');
    if (mealHeader) {
      e.stopPropagation();
      const mealItem = mealHeader.closest('.day-meal-item');
      if (!mealItem) return;

      const recipe = mealItem.querySelector('.day-meal-recipe');
      const expandIcon = mealItem.querySelector('.day-meal-expand');
      const isExpanded = mealHeader.getAttribute('aria-expanded') === 'true';

      // Collapse other open recipes in same day
      const dayCard = mealItem.closest('.day-card');
      dayCard.querySelectorAll('.day-meal-item').forEach((item) => {
        if (item !== mealItem) {
          item.querySelector('.day-meal-header')?.setAttribute('aria-expanded', 'false');
          const r = item.querySelector('.day-meal-recipe');
          if (r) r.hidden = true;
          const ic = item.querySelector('.day-meal-expand');
          if (ic) ic.textContent = '📖';
          item.classList.remove('recipe-open');
        }
      });

      mealHeader.setAttribute('aria-expanded', String(!isExpanded));
      if (recipe) recipe.hidden = isExpanded;
      if (expandIcon) expandIcon.textContent = isExpanded ? '📖' : '✕';
      mealItem.classList.toggle('recipe-open', !isExpanded);
      return;
    }

    // Handle day card expand/collapse
    const header = e.target.closest('.day-header');
    if (!header) return;

    const card = header.closest('.day-card');
    if (!card) return;

    const mealsDiv = card.querySelector('.day-meals');
    const icon = card.querySelector('.day-expand-icon');
    const isExpanded = header.getAttribute('aria-expanded') === 'true';

    // Lukk alle andre dagkort
    document.querySelectorAll('.day-card').forEach((c) => {
      if (c !== card) {
        c.querySelector('.day-header')?.setAttribute('aria-expanded', 'false');
        const dm = c.querySelector('.day-meals');
        if (dm) dm.hidden = true;
        const ic = c.querySelector('.day-expand-icon');
        if (ic) ic.textContent = '▸';
      }
    });

    header.setAttribute('aria-expanded', String(!isExpanded));
    if (mealsDiv) mealsDiv.hidden = isExpanded;
    if (icon) icon.textContent = isExpanded ? '▸' : '▾';
  };

  // ── Radar-diagram (canvas) ──────────────────────────────────

  const drawRadarChart = (mealObjects) => {
    const canvas = document.getElementById('pathway-radar');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const displayW = canvas.clientWidth || 300;
    const displayH = canvas.clientHeight || 300;
    canvas.width = displayW * dpr;
    canvas.height = displayH * dpr;
    ctx.scale(dpr, dpr);

    const cx = displayW / 2;
    const cy = displayH / 2;
    const radius = Math.min(cx, cy) - 40;

    const keys = pathwayKeys();
    const n = keys.length;
    if (n === 0) return;

    const normalized = calculateDailyPathways(mealObjects);
    const pct = coveragePercent(normalized);
    const angleStep = (2 * Math.PI) / n;
    const startAngle = -Math.PI / 2; // start frå toppen

    ctx.clearRect(0, 0, displayW, displayH);

    // Bakgrunnsrutenett (5 nivå: 20%, 40%, 60%, 80%, 100%)
    for (let level = 1; level <= 5; level++) {
      const r = (radius * level) / 5;
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const angle = startAngle + i * angleStep;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Akselinjer
    for (let i = 0; i < n; i++) {
      const angle = startAngle + i * angleStep;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Datapunktpolygon (fylt)
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const k = keys[i];
      const value = (normalized[k] || 0) / 5;  // 0-1
      const r = radius * value;
      const angle = startAngle + i * angleStep;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(34, 197, 94, 0.25)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Datapunkt-prikkar
    for (let i = 0; i < n; i++) {
      const k = keys[i];
      const value = (normalized[k] || 0) / 5;
      const r = radius * value;
      const angle = startAngle + i * angleStep;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);

      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = window.PATHWAYS[k].color;
      ctx.fill();
    }

    // Labels rundt kanten
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '11px Inter, sans-serif';

    for (let i = 0; i < n; i++) {
      const k = keys[i];
      const pw = window.PATHWAYS[k];
      const angle = startAngle + i * angleStep;
      const labelR = radius + 22;
      const x = cx + labelR * Math.cos(angle);
      const y = cy + labelR * Math.sin(angle);

      ctx.fillStyle = pw.color;
      ctx.fillText(pw.name, x, y);
    }

    // Dekningsprosent i midten
    ctx.font = 'bold 18px Space Grotesk, Inter, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${pct}%`, cx, cy - 6);
    ctx.font = '11px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillText('Dekning', cx, cy + 12);
  };

  // ── Veke-veljar ─────────────────────────────────────────────

  const handleWeekSelect = (e) => {
    const btn = e.target.closest('.week-btn');
    if (!btn) return;
    const weekNum = parseInt(btn.dataset.week, 10);
    if (!Number.isFinite(weekNum)) return;
    setCurrentWeek(weekNum - 1);
    renderWeekView();
  };

  // ── Event-delegering ────────────────────────────────────────

  const setupEventListeners = () => {
    // Navigasjon
    document.querySelector('.bottom-nav')?.addEventListener('click', (e) => {
      const tab = e.target.closest('.nav-tab');
      if (tab && tab.dataset.view) switchView(tab.dataset.view);
    });

    // Måltidskort: expand + swap (event-delegering)
    const todayContainer = document.getElementById('today-meals');
    if (todayContainer) {
      todayContainer.addEventListener('click', (e) => {
        // Expand/collapse
        if (e.target.closest('.btn-expand')) {
          handleMealCardClick(e);
          return;
        }

        // Bytt-knapp
        const swapBtn = e.target.closest('.btn-swap');
        if (swapBtn) {
          openSwapModal(swapBtn.dataset.mealType, swapBtn.dataset.mealId);
          return;
        }

        // Klikk på sjølve kortet (ikkje knapp) → opne modal
        const card = e.target.closest('.meal-card');
        if (card && !e.target.closest('button')) {
          const meal = getMealById(card.dataset.mealId);
          if (meal) openMealModal(meal);
        }
      });
    }

    // Vekeoversikt: dagkort expand
    const weekGrid = document.getElementById('week-grid');
    if (weekGrid) {
      weekGrid.addEventListener('click', handleDayCardClick);
    }

    // Veke-veljar
    const weekSelector = document.querySelector('.week-selector');
    if (weekSelector) {
      weekSelector.addEventListener('click', handleWeekSelect);
    }

    // Swap-modal: val alternativ
    const swapOptions = document.getElementById('swap-options');
    if (swapOptions) {
      swapOptions.addEventListener('click', handleSwapSelection);
    }

    // Lukk modalar
    document.querySelectorAll('.modal-close').forEach((btn) => {
      btn.addEventListener('click', closeModals);
    });

    document.querySelectorAll('.modal-overlay').forEach((overlay) => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModals();
      });
    });

    // Escape-tast lukkar modalar
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModals();
    });

    // Redraw radar ved resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const currentView = localStorage.getItem(STORAGE_KEYS.lastView) || 'today';
        if (currentView === 'today') {
          const mealObjects = getTodaysMeals().map((m) => m.meal);
          drawRadarChart(mealObjects);
        }
      }, 200);
    });
  };

  // ── Initialisering ──────────────────────────────────────────

  const init = () => {
    // Sjekk at naudsynte data finst
    if (!window.PATHWAYS || !window.MEALS || !window.WEEKLY_PLANS) {
      console.error('SpisSlank: Mangler data (PATHWAYS, MEALS eller WEEKLY_PLANS).');
      return;
    }

    setupEventListeners();

    // Gå til sist brukte visning, eller «today»
    const lastView = localStorage.getItem(STORAGE_KEYS.lastView) || 'today';
    switchView(lastView);
  };

  // Vent på DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
