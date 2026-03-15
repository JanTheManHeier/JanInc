// SmartHandel - Main Application Logic
// Handles navigation, UI state, and orchestration

class SmartHandelApp {
  constructor() {
    this.currentTab = 'shopping';
    this.initialized = false;
  }

  async init() {
    // Initialize database
    await db.init();
    await db.seedItemDatabase();

    // Auto-import receipt data if DB is empty and data file exists
    if (typeof loadReceiptData === 'function' && typeof RECEIPT_DATA !== 'undefined' && RECEIPT_DATA.receipts.length > 0) {
      const existingReceipts = await db.getAllReceipts();
      if (existingReceipts.length === 0) {
        const result = await loadReceiptData();
        if (result.receipts > 0) {
          showToast(`${result.receipts} kvitteringer importert (${result.purchases} varer)`, 'success');
        }
      }
    }

    // Initialize auth
    await auth.init();

    // Setup event listeners
    this.setupNavigation();
    this.setupShoppingTab();
    this.setupReceiptTab();
    this.setupMealsTab();
    this.setupSuggestionsTab();
    this.setupInsightsTab();
    this.setupSettingsTab();

    // Load initial data
    if (auth.isLoggedIn()) {
      todoApi.loadLists();
    }

    this.switchTab('shopping');
    this.initialized = true;

    // Show stats
    this.updateStats();
  }

  // Navigation
  setupNavigation() {
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.switchTab(tab.dataset.tab);
      });
    });
  }

  switchTab(tabName) {
    this.currentTab = tabName;

    // Update nav
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.toggle('active', content.id === `tab-${tabName}`);
    });

    // Load tab-specific data
    switch (tabName) {
      case 'shopping':
        this.refreshShopping();
        break;
      case 'receipts':
        this.refreshReceipts();
        break;
      case 'meals':
        this.refreshMeals();
        break;
      case 'suggestions':
        this.refreshSuggestions();
        break;
      case 'insights':
        break; // loaded on button click
      case 'settings':
        this.refreshSettings();
        break;
    }
  }

  // Shopping Tab
  setupShoppingTab() {
    const addBtn = document.getElementById('quick-add-btn');
    const input = document.getElementById('quick-add-input');

    addBtn.addEventListener('click', () => this.quickAddItem());
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.quickAddItem();
    });

    const listSelector = document.getElementById('todo-list-selector');
    listSelector.addEventListener('change', (e) => {
      if (e.target.value) {
        todoApi.selectList(e.target.value);
      }
    });

    document.getElementById('suggest-today-btn').addEventListener('click', () => this.suggestTodaysList());
  }

  async suggestTodaysList() {
    const container = document.getElementById('todo-tasks');
    container.innerHTML = '<div class="loading">Analyserer kj\u00f8pshistorikk...</div>';

    try {
      const purchases = await db.getAllPurchases();
      const receipts = await db.getAllReceipts();
      if (purchases.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>Legg til kvitteringer f\u00f8rst for \u00e5 f\u00e5 forslag.</p></div>';
        return;
      }

      // Product equivalence: map variant names to a canonical product
      // [displayName, category, patterns]
      var equivGroups = [
        // Brus / cola (Coca Cola, Pepsi Max, etc. — all carbonated soft drinks)
        ['Brus/Cola', 'Drikke', [/coca cola/i, /pepsi/i, /solo(?:\s|$)/i, /fanta(?:\s|$)/i]],
        // Makrell i tomat (King Oscar, Stabbur, etc.)
        ['Makrell i tomat', 'Kj\u00f8tt og Ost', [/makrell(?!.*nudl|.*makron)/i, /stabbur.*makrell/i, /king.*makrell/i, /k\.o\s*skinnf.*makr/i]],
        // Kjøttdeig (all brands)
        ['Kj\u00f8ttdeig', 'Kj\u00f8tt og Ost', [/kjøttdeig/i]],
        // Kyllingfilet (all brands)
        ['Kyllingfilet', 'Kj\u00f8tt og Ost', [/kyllingfil/i, /xtra.*kylling/i, /coop.*lårfilet/i, /grillet kylling/i, /kyllingfil.*naturell/i]],
        // Laksefilet (all brands)
        ['Laksefilet', 'Kj\u00f8tt og Ost', [/laksefil/i, /coop.*laksefil/i]],
        // Grillpølse (600G and 3X600G are the same product)
        ['Grillp\u00f8lse', 'Kj\u00f8tt og Ost', [/grillpølse/i]],
        // Gulost (Norvegia, Synnøve, etc.)
        ['Gulost', 'Kj\u00f8tt og Ost', [/norvegia/i, /synnnøve.*gulost/i, /jarlsberg/i, /burgerost/i, /duopack/i]],
        // Druer (rød and grønn are the same product category)
        ['Druer', 'Frukt og gr\u00f8nt', [/drue/i]],
        // Sørlandschips (all variants from same brand)
        ['S\u00f8rlandschips', 'Godis', [/sørl\./i]],
        // Sjokoladeplater (Freia, Firkløver, Helnøtt, Kvikklunsj-variant, etc.)
        ['Sjokolade', 'Godis', [/freia melkesjok/i, /firkløver/i, /helnøtt/i, /melkesjo\.m/i, /freia.*brown/i]],
        // Lettmelk
        ['Lettmelk', 'Melkeskapet', [/lettm.*1%/i, /tine lettmelk/i]],
        // Potetchips (Xtra, Maarud, etc.)
        ['Potetchips', 'Godis', [/potetch/i, /potetstick/i]],
        // Kjøttpølse
        ['Kj\u00f8ttp\u00f8lse', 'Kj\u00f8tt og Ost', [/gilde.*kjøttpølse/i, /(?:^|\s)kjøttpølse/i]],
        // Tortilla
        ['Tortilla', 'T\u00f8rrvarer', [/tortilla.*[lm]\./i, /s\.m\.tortilla/i, /oep.*tortil/i]],
        // Rømme
        ['R\u00f8mme', 'Melkeskapet', [/lettrøm/i, /q-lettrøm/i]],
        // Yoghurt vanilje
        ['Yoghurt vanilje', 'Melkeskapet', [/yogh.*vanilje/i]],
        // Eplejuice
        ['Eplejuice', 'Drikke', [/sunniva.*eple/i, /smak.*app.*juice/i]],
        // Fiskegrateng
        ['Fiskegrateng', 'Frysevarer', [/fiskegrat/i]],
        // Kaviar
        ['Kaviar', 'Br\u00f8dmat', [/kaviar/i]],
        // Knekkebrød
        ['Knekkebr\u00f8d', 'Br\u00f8dmat', [/knekkebrød|kn\.brød|leksands/i]],
        // Is (Ben & Jerry's variants)
        ['Ben & Jerrys', 'Is', [/b&j/i, /half\s*baked/i, /choco.*fud/i]],
        // Litago sjokomelk
        ['Sjokomelk', 'Drikke', [/litago/i, /sjokomelk/i, /tine\s*sjoko/i]],
        // Kims snacks
        ['Kims chips', 'Godis', [/kims/i]],
        // Grytemix (TORO variants — Stroganoff, Jeger, Tikka, Thai, Bali, etc.)
        ['Grytemix', 'T\u00f8rrvarer', [/toro.*gryte/i, /toro.*kyllipanne/i, /saritas/i]],
        // Øl (Isbjørn etc.)
        ['\u00d8l', 'Drikke', [/isbj/i]],
        // Frossenpizza (Grandiosa variants, Big One, etc.)
        ['Frossenpizza', 'Frysevarer', [/grandiosa|grand\.\s*del|big\s*one/i]],
        // Hundetygg (all variants: tyggerulle, chew rolls, tyggerull)
        ['Hundetygg', 'Hund', [/tyggerulle|tyggerull|chew\s*roll/i]],
        // Hundesnacks (lever etc.)
        ['Hundesnacks', 'Hund', [/hundedigg|frolic/i]],
      ];

      // Build item frequency data with equivalence merging
      var items = {};
      for (var p of purchases) {
        var key = p.normalizedName || p.itemName.toLowerCase();
        var displayName = p.itemName;
        var cat = p.category;

        // Check if this item maps to an equivalence group
        for (var gi = 0; gi < equivGroups.length; gi++) {
          var group = equivGroups[gi];
          if (group[2].some(function(pat) { return pat.test(p.itemName); })) {
            key = group[0].toLowerCase();
            displayName = group[0];
            cat = group[1];
            break;
          }
        }

        if (!items[key]) {
          items[key] = { name: displayName, category: cat, dates: [], totalSpent: 0, count: 0 };
        }
        items[key].dates.push(new Date(p.date));
        items[key].totalSpent += p.price || 0;
        items[key].count++;
      }

      const today = new Date();
      const suggestions = [];

      for (const [key, data] of Object.entries(items)) {
        if (data.count < 3) continue; // need at least 3 purchases for reliable pattern

        data.dates.sort((a, b) => a - b);
        const intervals = [];
        for (let i = 1; i < data.dates.length; i++) {
          intervals.push((data.dates[i] - data.dates[i - 1]) / (1000 * 60 * 60 * 24));
        }
        const avgDays = intervals.reduce((s, v) => s + v, 0) / intervals.length;
        if (avgDays < 3) continue; // skip items bought multiple times on same trip (noise)

        const lastDate = data.dates[data.dates.length - 1];
        const daysSinceLast = (today - lastDate) / (1000 * 60 * 60 * 24);
        const urgency = daysSinceLast / avgDays;

        // Skip non-shopping-list categories
        if (['Diverse', 'Hygiene', 'Rengj\u00f8ringsartikler'].includes(data.category)) continue;

        if (urgency >= 0.8) {
          suggestions.push({
            name: data.name,
            category: data.category,
            urgency,
            avgDays: Math.round(avgDays),
            daysSinceLast: Math.round(daysSinceLast),
            overdue: urgency >= 1.0,
            count: data.count,
          });
        }
      }

      suggestions.sort((a, b) => b.urgency - a.urgency);

      if (suggestions.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>Ikke nok data for \u00e5 gi forslag enn\u00e5. Legg til flere kvitteringer.</p></div>';
        return;
      }

      // Group by category using the 19-category order
      const categoryOrder = ['Frukt og gr\u00f8nt', 'Kj\u00f8tt og Ost', 'Br\u00f8dmat', 'Frysevarer', 'Melkeskapet', 'Drikke', 'T\u00f8rrvarer', 'Bakevarer', 'Andre t\u00f8rrvarer', 'Godis', 'Is', 'Tran og Sanasol', 'Hund'];
      const grouped = {};
      for (const s of suggestions) {
        if (!grouped[s.category]) grouped[s.category] = [];
        grouped[s.category].push(s);
      }

      var html = '<div class="today-header"><h3>Forslag til dagens handleliste</h3>';
      html += '<p class="muted">Basert p\u00e5 kj\u00f8psm\u00f8nstre. Sjekk hva dere har i kj\u00f8leskap/skap f\u00f8r dere handler.</p></div>';
      categoryOrder.filter(function(c) { return grouped[c]; }).forEach(function(cat) {
        html += '<div class="today-category">';
        html += '<h4 class="item-category-badge cat-' + cat.toLowerCase().replace(/[^a-z\u00e6\u00f8\u00e5]/g, '') + '" style="display:inline-block;margin-bottom:0.5rem">' + cat + '</h4>';
        grouped[cat].forEach(function(s) {
          html += '<div class="today-item ' + (s.overdue ? 'overdue' : 'due-soon') + '">';
          html += '<label><input type="checkbox" class="today-check" data-name="' + escapeAttr(s.name) + '"' + (s.overdue ? ' checked' : '') + '> ' + escapeHtml(s.name) + '</label>';
          html += '<span class="today-reason">' + (s.overdue ? 'P\u00e5 tide' : 'Snart') + ' \u2022 sist ' + s.daysSinceLast + 'd, snitt ' + s.avgDays + 'd</span>';
          html += '</div>';
        });
        html += '</div>';
      });
      html += '<div style="margin-top:1rem;display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center">';
      html += '<button class="btn btn-primary" onclick="app.addTodayToTodo()">Legg valgte i To Do</button>';
      html += '<button class="btn btn-secondary" onclick="app.toggleTodayChecks(true)">Velg alle</button>';
      html += '<button class="btn btn-secondary" onclick="app.toggleTodayChecks(false)">Fjern alle</button>';
      html += '<span class="muted" style="margin-left:auto">' + suggestions.length + ' varer foresl\u00e5tt</span></div>';
      container.innerHTML = html;
    } catch (err) {
      console.error('Suggest today error:', err);
      container.innerHTML = '<div class="empty-state"><p>Feil ved generering av forslag.</p></div>';
    }
  }

  toggleTodayChecks(checked) {
    document.querySelectorAll('.today-check').forEach(function(cb) { cb.checked = checked; });
  }

  async addTodayToTodo() {
    if (!auth.isLoggedIn()) {
      showToast('Logg inn f\u00f8rst', 'warning');
      return;
    }
    var checked = document.querySelectorAll('.today-check:checked');
    if (checked.length === 0) { showToast('Ingen varer valgt', 'warning'); return; }

    // Build items with category for smart sync
    var items = Array.from(checked).map(function(cb) {
      var row = cb.closest('.today-item');
      var cat = row ? row.closest('.today-category') : null;
      var catName = cat ? cat.querySelector('h4').textContent : 'Diverse';
      return { name: cb.dataset.name, category: catName };
    });

    await todoApi.smartSync(items);
  }

  async quickAddItem() {
    const input = document.getElementById('quick-add-input');
    const value = input.value.trim();
    if (!value) return;

    if (auth.isLoggedIn() && todoApi.selectedListId) {
      await todoApi.createTask(value);
    } else {
      showToast('Logg inn og velg en liste for \u00e5 legge til varer', 'warning');
    }

    input.value = '';
    input.focus();
  }

  refreshShopping() {
    if (auth.isLoggedIn()) {
      todoApi.renderTasks();
    }
  }

  // Receipts Tab
  setupReceiptTab() {
    const parseBtn = document.getElementById('parse-receipt-btn');
    parseBtn.addEventListener('click', () => this.parseReceiptInput());

    const sampleBtn = document.getElementById('load-sample-btn');
    sampleBtn.addEventListener('click', () => this.showSampleReceipts());

    const saveBtn = document.getElementById('save-receipt-btn');
    saveBtn.addEventListener('click', () => this.saveCurrentReceipt());

    // File upload
    const fileInput = document.getElementById('receipt-file-input');
    const uploadArea = document.getElementById('receipt-upload-area');

    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('dragover');
    });
    uploadArea.addEventListener('dragleave', () => {
      uploadArea.classList.remove('dragover');
    });
    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('dragover');
      if (e.dataTransfer.files.length > 0) {
        this.handleReceiptFile(e.dataTransfer.files[0]);
      }
    });
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        this.handleReceiptFile(e.target.files[0]);
      }
    });
  }

  async handleReceiptFile(file) {
    const textarea = document.getElementById('receipt-text');
    if (file.type.startsWith('text/') || file.name.endsWith('.txt')) {
      const text = await file.text();
      textarea.value = text;
      this.parseReceiptInput();
    } else {
      showToast('Lim inn teksten fra kvitteringen i feltet under', 'info');
    }
  }

  _currentParsed = null;

  parseReceiptInput() {
    const textarea = document.getElementById('receipt-text');
    const text = textarea.value.trim();
    if (!text) {
      showToast('Lim inn kvitteringstekst f\u00f8rst', 'warning');
      return;
    }

    const parsed = receiptParser.parse(text);
    this._currentParsed = parsed;
    this.renderParsedReceipt(parsed);
  }

  renderParsedReceipt(parsed) {
    const container = document.getElementById('parsed-receipt');
    const saveBtn = document.getElementById('save-receipt-btn');

    if (!parsed || parsed.items.length === 0) {
      container.innerHTML = '<p class="muted">Ingen varer funnet i kvitteringen</p>';
      saveBtn.style.display = 'none';
      return;
    }

    const totalCalc = parsed.items.reduce((sum, i) => sum + (i.totalPrice || i.price * i.quantity), 0);

    container.innerHTML = `
      <div class="parsed-header">
        <h3>${escapeHtml(parsed.store)}</h3>
        <span class="parsed-date">${parsed.date}</span>
        ${parsed.savings ? `<span class="parsed-savings">Spart: ${parsed.savings.toFixed(2)} kr</span>` : ''}
      </div>
      <div class="parsed-items">
        ${parsed.items.map((item, idx) => `
          <div class="parsed-item" data-idx="${idx}">
            <span class="item-category-badge cat-${item.category.toLowerCase().replace(/[^a-zæøå]/g, '')}">${item.category}</span>
            <span class="item-name">${escapeHtml(item.name)}${item.quantity > 1 ? ` <small class="item-qty">${item.quantity}x</small>` : ''}${item.weight ? ` <small class="item-qty">${item.weight}kg</small>` : ''}${item.mixDeal ? ` <small class="item-mix">mix</small>` : ''}</span>
            <span class="item-price">${(item.totalPrice || item.price) > 0 ? (item.totalPrice || item.price).toFixed(2) + ' kr' : ''}${item.discountAmount > 0 ? ` <small class="item-discount">-${item.discountAmount.toFixed(0)}</small>` : ''}</span>
          </div>
        `).join('')}
      </div>
      <div class="parsed-footer">
        <span>${parsed.items.length} varer</span>
        <span class="parsed-total">${parsed.total ? parsed.total.toFixed(2) : totalCalc.toFixed(2)} kr</span>
      </div>
    `;

    saveBtn.style.display = 'inline-flex';
  }

  async saveCurrentReceipt() {
    if (!this._currentParsed) return;

    try {
      const id = await receiptParser.saveReceipt(this._currentParsed);
      showToast(`Kvittering lagret (${this._currentParsed.items.length} varer)`, 'success');
      this._currentParsed = null;
      document.getElementById('receipt-text').value = '';
      document.getElementById('parsed-receipt').innerHTML = '';
      document.getElementById('save-receipt-btn').style.display = 'none';
      this.refreshReceipts();
      this.updateStats();
    } catch (error) {
      console.error('Save receipt error:', error);
      showToast('Kunne ikke lagre kvittering: ' + error.message, 'error');
    }
  }

  showSampleReceipts() {
    const samples = receiptParser.getSampleReceipts();
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    const modalTitle = document.getElementById('modal-title');

    modalTitle.textContent = 'Eksempelkvitteringer';
    modalBody.innerHTML = `
      <p class="muted">Velg en eksempelkvittering for testing:</p>
      <div class="sample-list">
        ${samples.map((s, i) => `
          <button class="sample-btn" onclick="app.loadSampleReceipt(${i})">${s.name}</button>
        `).join('')}
      </div>
      <button class="btn btn-secondary" onclick="app.loadAllSampleReceipts()">Last inn alle (for testing)</button>
    `;

    modal.classList.add('active');
  }

  loadSampleReceipt(index) {
    const samples = receiptParser.getSampleReceipts();
    const textarea = document.getElementById('receipt-text');
    textarea.value = samples[index].text;
    closeModal();
    this.parseReceiptInput();
  }

  async loadAllSampleReceipts() {
    const samples = receiptParser.getSampleReceipts();
    let count = 0;

    for (const sample of samples) {
      const parsed = receiptParser.parse(sample.text);
      await receiptParser.saveReceipt(parsed);
      count++;
    }

    closeModal();
    showToast(`${count} eksempelkvitteringer lastet inn`, 'success');
    this.refreshReceipts();
    this.updateStats();
  }

  async refreshReceipts() {
    const container = document.getElementById('receipt-history');
    const receipts = await db.getAllReceipts();

    if (receipts.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>Ingen kvitteringer enn\u00e5. Lim inn en kvittering eller last inn eksempler.</p></div>';
      return;
    }

    // Sort by date descending
    receipts.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

    container.innerHTML = `
      <h3>Kvitteringshistorikk (${receipts.length})</h3>
      <div class="receipt-list">
        ${receipts.map(r => `
          <div class="receipt-card" onclick="app.viewReceipt(${r.id})">
            <div class="receipt-card-header">
              <span class="receipt-store">${escapeHtml(r.store)}</span>
              <span class="receipt-date">${r.date}</span>
            </div>
            <div class="receipt-card-footer">
              <span>${r.itemCount} varer</span>
              <span class="receipt-total">${r.total ? r.total.toFixed(2) + ' kr' : ''}</span>
            </div>
            <button class="btn-icon delete-receipt" onclick="event.stopPropagation(); app.deleteReceipt(${r.id})" title="Slett">&times;</button>
          </div>
        `).join('')}
      </div>
    `;
  }

  async viewReceipt(id) {
    const receipt = await db.getReceipt(id);
    const purchases = await db.getPurchasesByReceipt(id);

    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    const modalTitle = document.getElementById('modal-title');

    modalTitle.textContent = `${receipt.store} - ${receipt.date}`;
    modalBody.innerHTML = `
      <div class="parsed-items">
        ${purchases.map(p => `
          <div class="parsed-item">
            <span class="item-category-badge cat-${p.category.toLowerCase().replace(/[^a-z]/g, '')}">${p.category}</span>
            <span class="item-name">${escapeHtml(p.itemName)}</span>
            <span class="item-price">${p.price > 0 ? p.price.toFixed(2) + ' kr' : ''}</span>
          </div>
        `).join('')}
      </div>
      <div class="parsed-footer">
        <span>${purchases.length} varer</span>
        <span class="parsed-total">${receipt.total ? receipt.total.toFixed(2) + ' kr' : ''}</span>
      </div>
    `;

    modal.classList.add('active');
  }

  async deleteReceipt(id) {
    if (!confirm('Slette denne kvitteringen?')) return;
    await db.deleteReceipt(id);
    showToast('Kvittering slettet', 'info');
    this.refreshReceipts();
    this.updateStats();
  }

  // Meals Tab
  setupMealsTab() {
    const detectBtn = document.getElementById('detect-patterns-btn');
    detectBtn.addEventListener('click', () => this.detectPatterns());

    const createBtn = document.getElementById('create-meal-btn');
    createBtn.addEventListener('click', () => this.showCreateMealForm());
  }

  async detectPatterns() {
    const analysis = await patternEngine.analyze();
    this.renderDetectedPatterns(analysis.patterns);
  }

  renderDetectedPatterns(patterns) {
    const container = document.getElementById('detected-patterns');

    if (patterns.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>Ingen m\u00f8nstre oppdaget enn\u00e5. Legg til flere kvitteringer for bedre analyse.</p></div>';
      return;
    }

    container.innerHTML = `
      <h3>Oppdagede m\u00e5ltidsm\u00f8nstre</h3>
      ${patterns.map((pattern, idx) => `
        <div class="pattern-card ${pattern.isMealLike ? 'meal-like' : ''}">
          <div class="pattern-header">
            <span class="pattern-name">${escapeHtml(pattern.suggestedName)}</span>
            <span class="pattern-score">Score: ${pattern.coOccurrenceScore}</span>
            ${pattern.isMealLike ? '<span class="badge badge-meal">M\u00e5ltid</span>' : ''}
          </div>
          <div class="pattern-items">
            ${pattern.items.map(i => `
              <span class="pattern-item-tag cat-${i.category.toLowerCase().replace(/[^a-z]/g, '')}">${escapeHtml(i.displayName)}</span>
            `).join('')}
          </div>
          <div class="pattern-actions">
            <button class="btn btn-small btn-primary" onclick="app.confirmMealPattern(${idx})">Lagre som m\u00e5ltid</button>
          </div>
        </div>
      `).join('')}
    `;
  }

  async confirmMealPattern(idx) {
    const pattern = patternEngine.detectedMealPatterns[idx];
    if (!pattern) return;

    const name = prompt('Gi m\u00e5ltidet et navn:', pattern.suggestedName);
    if (!name) return;

    const meal = {
      name,
      items: pattern.items,
      confirmed: true,
      createdAt: new Date().toISOString(),
    };

    await db.addMeal(meal);
    showToast(`M\u00e5ltid "${name}" lagret!`, 'success');
    this.refreshMeals();
  }

  showCreateMealForm() {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    const modalTitle = document.getElementById('modal-title');

    modalTitle.textContent = 'Opprett nytt m\u00e5ltid';
    modalBody.innerHTML = `
      <div class="form-group">
        <label>M\u00e5ltidsnavn</label>
        <input type="text" id="new-meal-name" placeholder="F.eks. Taco-fredag" class="input">
      </div>
      <div class="form-group">
        <label>Ingredienser (en per linje)</label>
        <textarea id="new-meal-items" rows="8" placeholder="Kjøttdeig\nTortilla\nRømme\nOst\nSalat\nTomat" class="input"></textarea>
      </div>
      <button class="btn btn-primary" onclick="app.createMealFromForm()">Lagre m\u00e5ltid</button>
    `;

    modal.classList.add('active');
    setTimeout(() => document.getElementById('new-meal-name').focus(), 100);
  }

  async createMealFromForm() {
    const name = document.getElementById('new-meal-name').value.trim();
    const itemsText = document.getElementById('new-meal-items').value.trim();

    if (!name) { showToast('Skriv inn et navn', 'warning'); return; }
    if (!itemsText) { showToast('Legg til ingredienser', 'warning'); return; }

    const items = itemsText.split('\n').filter(l => l.trim()).map(l => {
      const n = l.trim();
      return {
        normalizedName: normalizeName(n),
        displayName: n,
        category: receiptParser.categorizeItem(n),
      };
    });

    const meal = {
      name,
      items,
      confirmed: true,
      createdAt: new Date().toISOString(),
    };

    await db.addMeal(meal);
    closeModal();
    showToast(`M\u00e5ltid "${name}" opprettet!`, 'success');
    this.refreshMeals();
  }

  async refreshMeals() {
    const container = document.getElementById('saved-meals');
    const meals = await db.getAllMeals();

    if (meals.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>Ingen m\u00e5ltider lagret enn\u00e5. Oppdag m\u00f8nstre fra kvitteringer eller opprett manuelt.</p></div>';
      return;
    }

    const mealSuggestions = await patternEngine.getMealSuggestions();
    const mealMap = {};
    for (const ms of mealSuggestions) {
      mealMap[ms.id] = ms;
    }

    container.innerHTML = `
      <h3>Lagrede m\u00e5ltider (${meals.length})</h3>
      <div class="meal-grid">
        ${meals.map(meal => {
          const suggestion = mealMap[meal.id];
          return `
            <div class="meal-card">
              <div class="meal-card-header">
                <h4>${escapeHtml(meal.name)}</h4>
                <button class="btn-icon" onclick="app.deleteMeal(${meal.id})" title="Slett">&times;</button>
              </div>
              <div class="meal-items">
                ${meal.items.map(i => `
                  <span class="meal-item-tag">${escapeHtml(i.displayName)}</span>
                `).join('')}
              </div>
              ${suggestion ? `
                <div class="meal-suggestion-info">
                  ${suggestion.neverMade ? 'Ikke laget enn\u00e5' : `Sist laget: ${suggestion.daysSinceLastMade} dager siden`}
                </div>
              ` : ''}
              <div class="meal-actions">
                <button class="btn btn-small btn-primary" onclick="app.addMealToList(${meal.id})">
                  Legg til i handleliste
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  async deleteMeal(id) {
    if (!confirm('Slette dette m\u00e5ltidet?')) return;
    await db.deleteMeal(id);
    showToast('M\u00e5ltid slettet', 'info');
    this.refreshMeals();
  }

  async addMealToList(mealId) {
    const meal = await db.getMeal(mealId);
    if (!meal) return;

    const items = meal.items.map(i => i.displayName);

    if (auth.isLoggedIn() && todoApi.selectedListId) {
      await todoApi.createTasks(items);
    } else {
      showToast('Logg inn og velg en liste f\u00f8rst', 'warning');
    }
  }

  // Suggestions Tab
  setupSuggestionsTab() {
    const refreshBtn = document.getElementById('refresh-suggestions-btn');
    refreshBtn.addEventListener('click', () => this.refreshSuggestions());

    const weeklyBtn = document.getElementById('weekly-list-btn');
    weeklyBtn.addEventListener('click', () => this.generateWeeklyList());
  }

  async refreshSuggestions() {
    const container = document.getElementById('suggestions-container');
    container.innerHTML = '<div class="loading">Analyserer kj\u00f8psm\u00f8nstre...</div>';

    try {
      const suggestions = await suggestionEngine.generateAll();

      if (suggestions.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>Ingen forslag enn\u00e5. Legg til kvitteringer for \u00e5 bygge opp kj\u00f8pshistorikk.</p></div>';
        return;
      }

      const grouped = {
        always: suggestions.filter(s => s.type === 'always'),
        restock: suggestions.filter(s => s.type === 'restock'),
        meal: suggestions.filter(s => s.type === 'meal'),
      };

      container.innerHTML = `
        ${grouped.always.length > 0 ? `
          <div class="suggestion-group">
            <h3>Faste varer</h3>
            ${grouped.always.map(s => `
              <div class="suggestion-item">
                <span class="suggestion-name">${escapeHtml(s.item)}</span>
                <span class="suggestion-reason">${s.reason}</span>
                <button class="btn btn-small btn-primary" onclick="app.addSuggestionToList('${escapeAttr(s.item)}')">+ Liste</button>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${grouped.restock.length > 0 ? `
          <div class="suggestion-group">
            <h3>P\u00e5fyll-forslag</h3>
            ${grouped.restock.map(s => `
              <div class="suggestion-item ${s.label === 'P\u00e5 tide' ? 'overdue' : ''}">
                <div class="suggestion-main">
                  <span class="suggestion-badge ${s.label === 'P\u00e5 tide' ? 'badge-urgent' : 'badge-soon'}">${s.label}</span>
                  <span class="suggestion-name">${escapeHtml(s.item)}</span>
                  ${s.avgPrice ? `<span class="suggestion-price">~${s.avgPrice.toFixed(0)} kr</span>` : ''}
                </div>
                <span class="suggestion-reason">${s.reason}</span>
                <button class="btn btn-small btn-primary" onclick="app.addSuggestionToList('${escapeAttr(s.item)}')">+ Liste</button>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${grouped.meal.length > 0 ? `
          <div class="suggestion-group">
            <h3>M\u00e5ltidsforslag</h3>
            ${grouped.meal.map(s => `
              <div class="suggestion-item meal-suggestion">
                <div class="suggestion-main">
                  <span class="suggestion-badge badge-meal">M\u00e5ltid</span>
                  <span class="suggestion-name">${escapeHtml(s.item)}</span>
                </div>
                <span class="suggestion-reason">${s.reason}</span>
                <div class="suggestion-meal-items">
                  ${s.items.map(i => `<span class="meal-item-tag">${escapeHtml(i)}</span>`).join('')}
                </div>
                <button class="btn btn-small btn-primary" onclick="app.addMealSuggestionToList(${s.mealId})">+ Alle til liste</button>
              </div>
            `).join('')}
          </div>
        ` : ''}
      `;
    } catch (error) {
      console.error('Suggestions error:', error);
      container.innerHTML = '<div class="empty-state"><p>Feil ved generering av forslag.</p></div>';
    }
  }

  async addSuggestionToList(itemName) {
    if (auth.isLoggedIn() && todoApi.selectedListId) {
      await todoApi.createTask(itemName);
    } else {
      showToast('Logg inn og velg en liste f\u00f8rst', 'warning');
    }
  }

  async addMealSuggestionToList(mealId) {
    await this.addMealToList(mealId);
  }

  async generateWeeklyList() {
    const container = document.getElementById('weekly-list-container');
    container.innerHTML = '<div class="loading">Genererer ukeliste...</div>';

    try {
      const weekly = await suggestionEngine.generateWeeklyList();

      if (weekly.totalItems === 0) {
        container.innerHTML = '<div class="empty-state"><p>Ikke nok data for \u00e5 generere ukeliste. Legg til flere kvitteringer.</p></div>';
        return;
      }

      const categoryOrder = ['Frukt og gr\u00f8nt', 'Kj\u00f8tt og Ost', 'Br\u00f8dmat', 'Frysevarer', 'Melkeskapet', 'Drikke', 'T\u00f8rrvarer', 'Bakevarer', 'Andre t\u00f8rrvarer', 'Hygiene', 'Rengj\u00f8ringsartikler', 'Godis', 'Is', 'Tran og Sanasol', 'Hund', 'Diverse'];

      container.innerHTML = `
        <div class="weekly-header">
          <h3>Ukens handleliste (${weekly.totalItems} varer)</h3>
          <button class="btn btn-primary" onclick="app.addWeeklyToTodo()">Legg alle i To Do</button>
        </div>
        ${weekly.suggestedMeal ? `
          <div class="weekly-meal-suggestion">
            Forslag til ukens middag: <strong>${escapeHtml(weekly.suggestedMeal.name)}</strong>
          </div>
        ` : ''}
        <div class="weekly-categories">
          ${categoryOrder.filter(c => weekly.byCategory[c]).map(cat => `
            <div class="weekly-category">
              <h4 class="cat-header cat-${cat.toLowerCase().replace(/[^a-z]/g, '')}">${cat}</h4>
              ${weekly.byCategory[cat].map(item => `
                <div class="weekly-item">
                  <label>
                    <input type="checkbox" class="weekly-check" data-name="${escapeAttr(item.name)}" checked>
                    ${escapeHtml(item.name)}
                  </label>
                  <span class="weekly-reason">${item.reasons.join(', ')}</span>
                </div>
              `).join('')}
            </div>
          `).join('')}
        </div>
      `;

      this._weeklyList = weekly;
    } catch (error) {
      console.error('Weekly list error:', error);
      container.innerHTML = '<div class="empty-state"><p>Feil ved generering av ukeliste.</p></div>';
    }
  }

  async addWeeklyToTodo() {
    if (!auth.isLoggedIn() || !todoApi.selectedListId) {
      showToast('Logg inn og velg en liste f\u00f8rst', 'warning');
      return;
    }

    const checked = document.querySelectorAll('.weekly-check:checked');
    const items = Array.from(checked).map(cb => cb.dataset.name);

    if (items.length === 0) {
      showToast('Ingen varer valgt', 'warning');
      return;
    }

    await todoApi.createTasks(items);
  }

  async importReceiptData(data) {
    let imported = 0;
    for (let i = 0; i < data.receipts.length; i++) {
      const r = data.receipts[i];
      const receiptId = await db.addReceipt({
        store: r.store,
        date: r.date,
        total: r.total,
        itemCount: r.itemCount,
        parsedAt: new Date().toISOString(),
      });

      const purchases = (data.purchases || [])
        .filter(p => p.receiptIdx === i)
        .map(p => ({
          receiptId,
          itemName: p.itemName,
          normalizedName: p.normalizedName,
          price: p.price,
          quantity: p.quantity || 1,
          category: p.category,
          date: r.date,
        }));

      if (purchases.length > 0) {
        await db.addPurchases(purchases);
      }

      // Update item database
      for (const p of purchases) {
        const existing = await db.getItem(p.normalizedName);
        if (existing) {
          existing.purchaseCount = (existing.purchaseCount || 0) + 1;
          if (p.price > 0) {
            existing.avgPrice = existing.avgPrice ? (existing.avgPrice + p.price) / 2 : p.price;
          }
          await db.addItem(existing);
        } else {
          await db.addItem({
            normalizedName: p.normalizedName,
            displayName: p.itemName,
            category: p.category,
            alwaysBuy: false,
            avgPrice: p.price > 0 ? p.price : null,
            purchaseCount: 1,
          });
        }
      }
      imported++;
    }
    if (imported > 0) {
      showToast(`${imported} kvitteringer importert automatisk`, 'success');
      this.updateStats();
    }
  }

  // Insights Tab
  setupInsightsTab() {
    document.getElementById('generate-insights-btn').addEventListener('click', () => this.generateInsights());
  }

  async generateInsights() {
    const container = document.getElementById('insights-container');
    container.innerHTML = '<div class="loading">Analyserer forbruksdata...</div>';

    try {
      const report = await insightsEngine.generateReport();
      if (!report) {
        container.innerHTML = '<div class="empty-state"><p>Ingen kvitteringsdata. Legg til kvitteringer f\u00f8rst.</p></div>';
        return;
      }
      this.renderInsights(report, container);
    } catch (err) {
      console.error('Insights error:', err);
      container.innerHTML = '<div class="empty-state"><p>Feil ved generering av rapport.</p></div>';
    }
  }

  renderInsights(r, container) {
    const fmtKr = (v) => v.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    const fmtPct = (v) => v.toFixed(1);
    const months = r.monthsSpanned;

    // Category bars
    const catEntries = Object.entries(r.byCategory).sort((a, b) => b[1].total - a[1].total);
    const catMax = catEntries.length > 0 ? catEntries[0][1].total : 1;

    // Discretionary
    const discEntries = Object.entries(r.discretionary);
    const discTotal = discEntries.reduce((s, [_, v]) => s + v.total, 0);
    const discMonthly = discTotal / months;

    // SIFO
    const sifo = r.sifo;
    const sifoStatus = sifo.pct > 15 ? 'over' : sifo.pct < -5 ? 'under' : 'normal';

    container.innerHTML = `
      <!-- Overview -->
      <div class="card insight-overview">
        <h3>Oversikt</h3>
        <div class="insight-grid">
          <div class="insight-stat">
            <span class="insight-value">${fmtKr(r.totalSpent)} kr</span>
            <span class="insight-label">Totalt brukt</span>
          </div>
          <div class="insight-stat">
            <span class="insight-value">${r.totalReceipts}</span>
            <span class="insight-label">Handleturer</span>
          </div>
          <div class="insight-stat">
            <span class="insight-value">${fmtKr(r.avgPerTrip)} kr</span>
            <span class="insight-label">Snitt per tur</span>
          </div>
          <div class="insight-stat">
            <span class="insight-value">${fmtKr(r.avgPerMonth)} kr</span>
            <span class="insight-label">Snitt per m\u00e5ned</span>
          </div>
        </div>
        <p class="muted" style="margin-top:0.5rem">Periode: ${r.dateRange.from} til ${r.dateRange.to} (${fmtPct(months)} m\u00e5neder)${r.savings > 0 ? ` \u2022 Spart med Coop-medlemskap: ${fmtKr(r.savings)} kr` : ''}</p>
      </div>

      <!-- Monthly Trend -->
      <div class="card">
        <h3>M\u00e5nedlig forbruk</h3>
        <div class="trend-chart">
          ${(() => {
            const trend = r.monthlyTrend;
            const maxTotal = Math.max(...trend.map(m => m.total));
            const sifoLine = sifo.sifoMonthly;
            return trend.map(m => {
              const pct = (m.total / maxTotal) * 100;
              const overSifo = m.total > sifoLine * 1.15;
              return '<div class="trend-bar-group">' +
                '<div class="trend-bar-container">' +
                  '<div class="trend-bar ' + (overSifo ? 'trend-over' : 'trend-ok') + '" style="height:' + Math.max(4, pct) + '%"></div>' +
                '</div>' +
                '<div class="trend-amount">' + fmtKr(m.total) + '</div>' +
                '<div class="trend-label">' + m.label + '</div>' +
                '<div class="trend-trips muted">' + m.trips + ' turer</div>' +
              '</div>';
            }).join('');
          })()}
        </div>
        <div class="trend-legend">
          <span class="trend-legend-item"><span class="trend-dot trend-ok"></span> Under SIFO+15%</span>
          <span class="trend-legend-item"><span class="trend-dot trend-over"></span> Over SIFO+15% (${fmtKr(sifo.sifoMonthly * 1.15)} kr)</span>
        </div>
      </div>

      <!-- SIFO Comparison -->
      <div class="card insight-sifo">
        <h3>SIFO Referansebudsjett</h3>
        <p class="muted">Sammenligning med SIFOs anbefalt matbudsjett for en familie p\u00e5 4 (2025-tall). SIFO dekker mat og drikke, ikke snacks/godis/hygiene.</p>
        <div class="sifo-compare">
          <div class="sifo-bar-container">
            <div class="sifo-bar-label">Ditt forbruk (mat & drikke)</div>
            <div class="sifo-bar">
              <div class="sifo-bar-fill ${sifoStatus}" style="width:${Math.min(100, (sifo.yourFoodMonthly / Math.max(sifo.yourFoodMonthly, sifo.sifoMonthly)) * 100)}%">
                ${fmtKr(sifo.yourFoodMonthly)} kr/mnd
              </div>
            </div>
          </div>
          <div class="sifo-bar-container">
            <div class="sifo-bar-label">SIFO referanse</div>
            <div class="sifo-bar">
              <div class="sifo-bar-fill sifo-ref" style="width:${Math.min(100, (sifo.sifoMonthly / Math.max(sifo.yourFoodMonthly, sifo.sifoMonthly)) * 100)}%">
                ${fmtKr(sifo.sifoMonthly)} kr/mnd
              </div>
            </div>
          </div>
        </div>
        <p class="${sifo.pct > 15 ? 'insight-warn' : sifo.pct > 0 ? 'insight-neutral' : 'insight-good'}">
          ${sifo.pct > 0 ? `${fmtPct(sifo.pct)}% over SIFO-referansen (${fmtKr(Math.abs(sifo.diff))} kr/mnd mer)` : `${fmtPct(Math.abs(sifo.pct))}% under SIFO-referansen`}
        </p>
        <details>
          <summary>SIFO-detaljer per familiemedlem</summary>
          <div class="sifo-details">
            ${Object.entries(sifo.sifoBreakdown).map(([k, v]) => `<div>${k}: <strong>${fmtKr(v)} kr/mnd</strong></div>`).join('')}
            <div style="border-top:1px solid #eee;padding-top:0.5rem;margin-top:0.5rem"><strong>Totalt: ${fmtKr(sifo.sifoMonthly)} kr/mnd</strong></div>
          </div>
          <p class="muted" style="margin-top:0.5rem">Merk: Familien har to aktive idrettsut\u00f8vere (rytmisk gymnastikk og basketball) med h\u00f8yere energibehov enn gjennomsnitt. Noe h\u00f8yere matforbruk er forventet.</p>
        </details>
      </div>

      <!-- Discretionary spending -->
      <div class="card insight-discretionary">
        <h3>Verdt \u00e5 tenke over</h3>
        <p class="muted">Forbruk p\u00e5 varer som ikke er n\u00f8dvendige dagligvarer. Idrettsrelaterte drikker (Powerade, sjokomelk) er holdt utenfor.</p>
        <div class="disc-total">
          <span class="insight-value">${fmtKr(discTotal)} kr</span>
          <span class="insight-label">totalt (${fmtKr(discMonthly)} kr/mnd)</span>
          <span class="insight-pct">${fmtPct((discTotal / r.totalSpent) * 100)}% av totalforbruk</span>
        </div>
        <div class="disc-breakdown">
          ${discEntries.map(([label, data]) => `
            <details class="disc-detail">
              <summary class="disc-row">
                <span class="disc-label">${label}</span>
                <div class="disc-bar-wrap">
                  <div class="disc-bar" style="width:${Math.max(2, (data.total / discTotal) * 100)}%"></div>
                </div>
                <span class="disc-amount">${fmtKr(data.total)} kr</span>
                <span class="disc-monthly muted">(${fmtKr(data.total / months)}/mnd)</span>
              </summary>
              <div class="disc-items">
                ${data.items.map(item => `
                  <div class="disc-subitem"><span>${escapeHtml(item.name)}</span><span>${item.count}x</span><span>${fmtKr(item.total)} kr</span></div>
                `).join('')}
              </div>
            </details>
          `).join('')}
        </div>
        ${r.athleteSupplements.total > 0 ? `
          <p class="insight-info" style="margin-top:1rem">Idrettssupplement (sjokomelk, Powerade): <strong>${fmtKr(r.athleteSupplements.total)} kr</strong> (${r.athleteSupplements.count} kj\u00f8p) \u2014 holdt utenfor oversikten over.</p>
        ` : ''}
      </div>

      <!-- Category breakdown -->
      <div class="card">
        <h3>Forbruk per kategori</h3>
        <div class="cat-breakdown">
          ${catEntries.map(([cat, data]) => `
            <details class="cat-detail">
              <summary class="cat-row">
                <span class="cat-label">${cat}</span>
                <div class="cat-bar-wrap">
                  <div class="cat-bar cat-bar-${cat.toLowerCase().replace(/[^a-z\u00e6\u00f8\u00e5]/g, '')}" style="width:${Math.max(2, (data.total / catMax) * 100)}%"></div>
                </div>
                <span class="cat-amount">${fmtKr(data.total)} kr</span>
                <span class="cat-pct muted">${fmtPct(data.pct)}%</span>
              </summary>
              <div class="cat-items">
                ${data.items.slice(0, 15).map(item => `
                  <div class="cat-subitem"><span>${escapeHtml(item.name)}</span><span>${item.count}x</span><span>${fmtKr(item.total)} kr</span></div>
                `).join('')}
                ${data.items.length > 15 ? '<div class="muted" style="padding:0.25rem 0">...og ' + (data.items.length - 15) + ' til</div>' : ''}
              </div>
            </details>
          `).join('')}
        </div>
      </div>

      <!-- Top items -->
      <div class="card">
        <h3>Topp 20 varer (st\u00f8rst totalforbruk)</h3>
        <div class="top-items">
          ${r.topItems.map((item, idx) => `
            <div class="top-item">
              <span class="top-rank">${idx + 1}</span>
              <span class="top-name">${escapeHtml(item.name)}</span>
              <span class="top-cat muted">${item.category}</span>
              <span class="top-count">${item.count}x</span>
              <span class="top-amount">${fmtKr(item.total)} kr</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Staples -->
      <div class="card">
        <h3>Faste varer (kj\u00f8pt p\u00e5 >25% av turene)</h3>
        <p class="muted">Disse varene er sannsynligvis planlagte og p\u00e5 handlelisten.</p>
        <div class="staple-items">
          ${r.staples.map(item => `
            <div class="staple-item">
              <span class="staple-name">${escapeHtml(item.name)}</span>
              <span class="staple-freq">${item.frequency} av ${r.totalReceipts} turer</span>
              <span class="staple-total">${fmtKr(item.total)} kr</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- One-off purchases -->
      ${r.oneOffs.length > 0 ? `
      <div class="card">
        <h3>Mulige impulskj\u00f8p (kj\u00f8pt \u00e9n gang, >30 kr)</h3>
        <p class="muted">Disse varene ble bare kj\u00f8pt \u00e9n gang \u2014 kanskje planlagte, kanskje impulskj\u00f8p.</p>
        <div class="oneoff-items">
          ${r.oneOffs.map(item => `
            <div class="oneoff-item">
              <span class="oneoff-name">${escapeHtml(item.name)}</span>
              <span class="oneoff-cat muted">${item.category}</span>
              <span class="oneoff-amount">${fmtKr(item.total)} kr</span>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}

      <!-- Budget suggestion -->
      <div class="card insight-budget">
        <h3>Forslag til m\u00e5nedsbudsjett</h3>
        <p class="muted">Basert p\u00e5 ditt faktiske forbruk og SIFO-referansen, med justering for aktive idrettsut\u00f8vere.</p>
        <div class="budget-suggestion">
          <div class="budget-row">
            <span>Mat og drikke (SIFO + 15% for idrett)</span>
            <span class="budget-amount">${fmtKr(sifo.sifoMonthly * 1.15)} kr</span>
          </div>
          <div class="budget-row">
            <span>Godis/snacks/is (m\u00e5lrettet)</span>
            <span class="budget-amount">${fmtKr(Math.min(discMonthly, 1500))} kr</span>
          </div>
          <div class="budget-row">
            <span>Hund</span>
            <span class="budget-amount">${fmtKr((r.byCategory['Hund']?.total || 0) / months)} kr</span>
          </div>
          <div class="budget-row">
            <span>Hygiene + Rengj\u00f8ring</span>
            <span class="budget-amount">${fmtKr(((r.byCategory['Hygiene']?.total || 0) + (r.byCategory['Rengj\u00f8ringsartikler']?.total || 0)) / months)} kr</span>
          </div>
          <div class="budget-row budget-total">
            <span><strong>Forsl\u00e5tt m\u00e5nedsbudsjett</strong></span>
            <span class="budget-amount"><strong>${fmtKr(
              sifo.sifoMonthly * 1.15 +
              Math.min(discMonthly, 1500) +
              ((r.byCategory['Hund']?.total || 0) / months) +
              (((r.byCategory['Hygiene']?.total || 0) + (r.byCategory['Rengj\u00f8ringsartikler']?.total || 0)) / months)
            )} kr</strong></span>
          </div>
          <div class="budget-row muted">
            <span>Ditt faktiske snitt</span>
            <span>${fmtKr(r.avgPerMonth)} kr/mnd</span>
          </div>
        </div>
      </div>
    `;
  }

  // Settings Tab
  setupSettingsTab() {
    const saveClientIdBtn = document.getElementById('save-client-id-btn');
    saveClientIdBtn.addEventListener('click', () => this.saveClientId());

    const clearDataBtn = document.getElementById('clear-data-btn');
    clearDataBtn.addEventListener('click', () => this.clearAllData());

    const exportBtn = document.getElementById('export-data-btn');
    exportBtn.addEventListener('click', () => this.exportData());
  }

  async refreshSettings() {
    const clientIdInput = document.getElementById('client-id-input');
    const savedClientId = await db.getSetting('clientId');
    if (savedClientId) {
      clientIdInput.value = savedClientId;
    }

    todoApi.renderSettingsLists();
    this.updateStats();
  }

  async saveClientId() {
    const input = document.getElementById('client-id-input');
    const clientId = input.value.trim();
    if (!clientId) {
      showToast('Skriv inn en Client ID', 'warning');
      return;
    }

    await auth.updateClientId(clientId);
  }

  async clearAllData() {
    if (!confirm('Er du sikker p\u00e5 at du vil slette all lokal data? Dette kan ikke angres.')) return;
    if (!confirm('Siste sjanse - all kj\u00f8pshistorikk, m\u00e5ltider og m\u00f8nstre vil bli slettet.')) return;

    indexedDB.deleteDatabase(DB_NAME);
    showToast('All data slettet. Siden lastes p\u00e5 nytt.', 'info');
    setTimeout(() => window.location.reload(), 1000);
  }

  async exportData() {
    const [receipts, purchases, meals, items, settings] = await Promise.all([
      db.getAllReceipts(),
      db.getAllPurchases(),
      db.getAllMeals(),
      db.getAllItems(),
      db.getAllSettings(),
    ]);

    const exportObj = { receipts, purchases, meals, items, settings, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `smarthandel-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    showToast('Data eksportert', 'success');
  }

  async updateStats() {
    const stats = await db.getStats();
    const statsEl = document.getElementById('app-stats');
    if (statsEl) {
      statsEl.innerHTML = `
        <span>${stats.receipts} kvitteringer</span>
        <span>${stats.purchases} kj\u00f8p</span>
        <span>${stats.meals} m\u00e5ltider</span>
      `;
    }
  }
}

// Utility functions
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function escapeAttr(text) {
  return text.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function closeModal() {
  document.getElementById('modal').classList.remove('active');
}

// Initialize app
const app = new SmartHandelApp();

document.addEventListener('DOMContentLoaded', () => {
  app.init().catch(err => {
    console.error('App init error:', err);
    showToast('Feil ved oppstart: ' + err.message, 'error');
  });
});
