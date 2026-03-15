// app.js - Main application logic and UI

const App = {
  currentTab: 'plan',
  currentTrip: null,
  weatherData: null,

  /**
   * Initialize the app
   */
  init() {
    // Initialize auth
    AuthManager.init();

    // Load current trip
    this.currentTrip = TripPlanner.getCurrentTrip();

    // Set up navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
    });

    // Set up auth button
    document.getElementById('auth-btn').addEventListener('click', () => {
      if (AuthManager.isSignedIn()) {
        AuthManager.signOut();
      } else {
        AuthManager.signIn();
      }
    });

    // Populate destination dropdown
    this._populateDestinations();

    // Set up trip form
    this._setupTripForm();

    // Set up add-member button
    document.getElementById('add-member-btn').addEventListener('click', () => this._addFamilyMember());

    // Set default dates (next weekend)
    this._setDefaultDates();

    // Load current trip if exists
    if (this.currentTrip) {
      this._loadTripIntoForm(this.currentTrip);
      this._renderPackingList();
      this._updateProgress();
    }

    // Render saved trips
    this._renderSavedTrips();

    // Update auth UI
    this.updateAuthUI();

    // Show plan tab by default
    this.switchTab('plan');
  },

  /**
   * Switch active tab
   */
  switchTab(tab) {
    this.currentTab = tab;

    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.toggle('active', content.id === `tab-${tab}`);
    });

    if (tab === 'weather' && this.currentTrip) {
      this._loadWeather();
    }
    if (tab === 'trips') {
      this._renderSavedTrips();
    }
  },

  /**
   * Update auth UI elements
   */
  updateAuthUI() {
    const btn = document.getElementById('auth-btn');
    const userName = document.getElementById('user-name');

    if (AuthManager.isSignedIn()) {
      btn.textContent = 'Logg ut';
      btn.classList.add('signed-in');
      userName.textContent = AuthManager.getDisplayName() || '';
      userName.style.display = 'inline';
      document.getElementById('sync-todo-btn').style.display = 'inline-flex';
    } else {
      btn.textContent = 'Logg inn med Microsoft';
      btn.classList.remove('signed-in');
      userName.style.display = 'none';
      document.getElementById('sync-todo-btn').style.display = 'none';
    }
  },

  /**
   * Load today's pre-configured trip
   */
  loadTodaysTrip() {
    this.currentTrip = TripPlanner.generateTodaysTrip();
    TripPlanner.saveCurrentTrip(this.currentTrip);
    this._loadTripIntoForm(this.currentTrip);
    this._renderPackingList();
    this._updateProgress();

    // Render weather directly from pre-loaded data
    if (this.currentTrip.weather) {
      this._renderTripWeather(this.currentTrip);
    }

    this.switchTab('packing');
    this._showToast('Dagens tur lastet: Kvaløyvågen → Finnvikdalen!', 'success');
  },

  /**
   * Render pre-loaded weather + route info for today's trip
   */
  _renderTripWeather(trip) {
    const container = document.getElementById('weather-content');
    if (!container || !trip.weather || !trip.route) return;

    let forecastHtml = '';
    for (const h of trip.weather.forecast) {
      const icon = h.condition.includes('clear') ? '\u2600\uFE0F' :
                   h.condition.includes('fair') ? '\uD83C\uDF24\uFE0F' :
                   h.condition.includes('partly') ? '\u26C5' : '\u2601\uFE0F';
      forecastHtml += `
        <div class="weather-hour">
          <div class="weather-time">${h.time}</div>
          <div class="weather-icon">${icon}</div>
          <div class="weather-temp">${h.temp}\u00B0C</div>
          <div class="weather-wind">${h.wind} m/s</div>
        </div>`;
    }

    container.innerHTML = `
      <div class="weather-card">
        <h3>\uD83D\uDDFA\uFE0F Rute: ${trip.route.from} \u2192 ${trip.route.to}</h3>
        <div class="route-info">
          <p><strong>Avstand:</strong> ${trip.route.distance} (enveis)</p>
          <p><strong>Transport:</strong> ${trip.route.type}</p>
          <p><strong>Avreise:</strong> ${trip.route.departure}</p>
          <p><strong>Ankomst start:</strong> ${trip.route.arrival}</p>
        </div>
      </div>
      <div class="weather-card">
        <h3>\uD83C\uDF26\uFE0F V\u00E6rmelding Kval\u00F8ya — 14. mars 2026</h3>
        <p class="weather-summary">${trip.weather.description}</p>
        <div class="weather-hours">${forecastHtml}</div>
      </div>`;
  },

  // ---- Trip Planning ----

  _populateDestinations() {
    const select = document.getElementById('destination');
    PackingLists.destinations.forEach(dest => {
      const opt = document.createElement('option');
      opt.value = dest.name;
      opt.textContent = dest.name;
      select.appendChild(opt);
    });
    const customOpt = document.createElement('option');
    customOpt.value = 'custom';
    customOpt.textContent = 'Annet sted...';
    select.appendChild(customOpt);

    select.addEventListener('change', () => {
      document.getElementById('destination-custom').style.display =
        select.value === 'custom' ? 'block' : 'none';
    });
  },

  _setDefaultDates() {
    const today = new Date();
    const nextFri = new Date(today);
    nextFri.setDate(today.getDate() + ((5 - today.getDay() + 7) % 7 || 7));
    const nextSun = new Date(nextFri);
    nextSun.setDate(nextFri.getDate() + 2);

    const fmt = d => d.toISOString().split('T')[0];
    document.getElementById('start-date').value = fmt(nextFri);
    document.getElementById('end-date').value = fmt(nextSun);
  },

  _setupTripForm() {
    document.getElementById('generate-list-btn').addEventListener('click', () => {
      this._generateTrip();
    });
  },

  _addFamilyMember() {
    const container = document.getElementById('family-members');
    const div = document.createElement('div');
    div.className = 'family-member-row';
    div.innerHTML = `
      <input type="text" class="member-name" placeholder="Navn" />
      <select class="member-age-group">
        <option value="adult">Voksen</option>
        <option value="child">Barn (4-12)</option>
        <option value="toddler">Sm\u00E5barn (0-3)</option>
      </select>
      <button class="btn-icon remove-member" title="Fjern">&times;</button>
    `;
    div.querySelector('.remove-member').addEventListener('click', () => div.remove());
    container.appendChild(div);
  },

  _generateTrip() {
    const destination = document.getElementById('destination').value;
    const destinationCustom = document.getElementById('destination-custom-input')?.value || '';
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const tripType = document.getElementById('trip-type').value;
    const tripName = document.getElementById('trip-name').value;

    if (!destination) {
      this._showToast('Velg et reisem\u00E5l!', 'error');
      return;
    }
    if (!startDate || !endDate) {
      this._showToast('Velg datoer!', 'error');
      return;
    }

    // Collect family members
    const memberRows = document.querySelectorAll('.family-member-row');
    const familyMembers = [];
    let hasKids = false;
    memberRows.forEach(row => {
      const name = row.querySelector('.member-name').value.trim();
      const ageGroup = row.querySelector('.member-age-group').value;
      if (name) {
        familyMembers.push({ name, ageGroup });
        if (ageGroup === 'child' || ageGroup === 'toddler') hasKids = true;
      }
    });

    const trip = TripPlanner.createTrip({
      name: tripName,
      destination,
      destinationCustom,
      startDate,
      endDate,
      tripType,
      familyMembers,
      hasKids,
    });

    this.currentTrip = trip;
    TripPlanner.saveCurrentTrip(trip);

    this._renderPackingList();
    this._updateProgress();
    this.switchTab('packing');
    this._showToast('Pakkeliste generert!', 'success');

    // Auto-load weather
    this._loadWeather();
  },

  _loadTripIntoForm(trip) {
    document.getElementById('trip-name').value = trip.name || '';
    document.getElementById('destination').value = trip.destination || '';
    if (trip.destination === 'custom') {
      document.getElementById('destination-custom').style.display = 'block';
      const inp = document.getElementById('destination-custom-input');
      if (inp) inp.value = trip.destinationCustom || '';
    }
    document.getElementById('start-date').value = trip.startDate || '';
    document.getElementById('end-date').value = trip.endDate || '';
    document.getElementById('trip-type').value = trip.tripType || 'alpint';

    // Restore family members
    const container = document.getElementById('family-members');
    container.innerHTML = '';
    (trip.familyMembers || []).forEach(member => {
      const div = document.createElement('div');
      div.className = 'family-member-row';
      div.innerHTML = `
        <input type="text" class="member-name" placeholder="Navn" value="${member.name}" />
        <select class="member-age-group">
          <option value="adult" ${member.ageGroup === 'adult' ? 'selected' : ''}>Voksen</option>
          <option value="child" ${member.ageGroup === 'child' ? 'selected' : ''}>Barn (4-12)</option>
          <option value="toddler" ${member.ageGroup === 'toddler' ? 'selected' : ''}>Sm\u00E5barn (0-3)</option>
        </select>
        <button class="btn-icon remove-member" title="Fjern">&times;</button>
      `;
      div.querySelector('.remove-member').addEventListener('click', () => div.remove());
      container.appendChild(div);
    });
  },

  // ---- Packing List ----

  _renderPackingList() {
    const container = document.getElementById('packing-list');
    container.innerHTML = '';

    if (!this.currentTrip || !this.currentTrip.packingList) {
      container.innerHTML = '<div class="empty-state"><p>Ingen pakkeliste enn\u00E5. Planlegg en tur f\u00F8rst!</p></div>';
      return;
    }

    const list = this.currentTrip.packingList;

    // Trip header
    const header = document.createElement('div');
    header.className = 'packing-header';
    const destInfo = TripPlanner.getDestinationInfo(this.currentTrip);
    const duration = TripPlanner.getDuration(this.currentTrip);
    const typeLabel = PackingLists.tripTypes[this.currentTrip.tripType]?.label || '';
    header.innerHTML = `
      <h2>${destInfo.name} - ${typeLabel}</h2>
      <p class="trip-dates">${this.currentTrip.startDate} til ${this.currentTrip.endDate} (${duration} dager)</p>
    `;
    container.appendChild(header);

    // Progress bar
    const progressDiv = document.createElement('div');
    progressDiv.id = 'packing-progress';
    container.appendChild(progressDiv);
    this._updateProgress();

    // Filter controls
    const filterDiv = document.createElement('div');
    filterDiv.className = 'filter-controls';
    filterDiv.innerHTML = `
      <button class="filter-btn active" data-filter="all">Alle</button>
      <button class="filter-btn" data-filter="unpacked">Ikke pakket</button>
      <button class="filter-btn" data-filter="packed">Pakket</button>
    `;
    filterDiv.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        filterDiv.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this._applyFilter(btn.dataset.filter);
      });
    });
    container.appendChild(filterDiv);

    // Categories
    for (const [catKey, category] of Object.entries(list)) {
      const catDiv = document.createElement('div');
      catDiv.className = 'category';
      catDiv.dataset.category = catKey;

      const catHeader = document.createElement('div');
      catHeader.className = 'category-header';
      catHeader.innerHTML = `
        <span class="category-icon">${category.icon}</span>
        <span class="category-label">${category.label}</span>
        <span class="category-count">${category.items.filter(i => i.packed).length}/${category.items.length}</span>
        <button class="btn-icon collapse-btn" title="Vis/skjul">\u25BC</button>
      `;
      catHeader.addEventListener('click', () => {
        catDiv.classList.toggle('collapsed');
        const btn = catHeader.querySelector('.collapse-btn');
        btn.textContent = catDiv.classList.contains('collapsed') ? '\u25B6' : '\u25BC';
      });
      catDiv.appendChild(catHeader);

      const itemsList = document.createElement('div');
      itemsList.className = 'category-items';

      category.items.forEach(item => {
        itemsList.appendChild(this._createItemElement(catKey, item));
      });

      // Add custom item input
      const addRow = document.createElement('div');
      addRow.className = 'add-item-row';
      addRow.innerHTML = `
        <input type="text" class="add-item-input" placeholder="Legg til..." />
        <button class="btn-icon add-item-btn" title="Legg til">+</button>
      `;
      const addInput = addRow.querySelector('.add-item-input');
      const addBtn = addRow.querySelector('.add-item-btn');

      const doAdd = () => {
        const name = addInput.value.trim();
        if (!name) return;
        const id = TripPlanner.addCustomItem(this.currentTrip.packingList, catKey, name);
        const newItem = category.items.find(i => i.id === id);
        if (newItem) {
          itemsList.appendChild(this._createItemElement(catKey, newItem));
        }
        addInput.value = '';
        this._saveAndUpdateProgress();
      };

      addBtn.addEventListener('click', doAdd);
      addInput.addEventListener('keydown', e => { if (e.key === 'Enter') doAdd(); });

      itemsList.appendChild(addRow);
      catDiv.appendChild(itemsList);
      container.appendChild(catDiv);
    }
  },

  _createItemElement(catKey, item) {
    const el = document.createElement('div');
    el.className = `packing-item ${item.packed ? 'packed' : ''}`;
    el.dataset.itemId = item.id;
    el.dataset.packed = item.packed ? 'true' : 'false';

    const members = this.currentTrip?.familyMembers || [];
    const assigneeOptions = members.length > 0
      ? `<select class="item-assignee" title="Tildel">
           <option value="">--</option>
           ${members.map(m => `<option value="${m.name}" ${item.assignee === m.name ? 'selected' : ''}>${m.name}</option>`).join('')}
         </select>`
      : '';

    el.innerHTML = `
      <label class="item-checkbox">
        <input type="checkbox" ${item.packed ? 'checked' : ''} />
        <span class="checkmark"></span>
      </label>
      <span class="item-name">${item.name}</span>
      ${item.desc ? `<span class="item-desc">${item.desc}</span>` : ''}
      ${item.reason ? `<span class="item-reason">${item.reason}</span>` : ''}
      ${assigneeOptions}
      ${item.isCustom ? `<button class="btn-icon remove-item" title="Fjern">&times;</button>` : ''}
    `;

    // Toggle packed
    el.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
      TripPlanner.toggleItem(this.currentTrip.packingList, catKey, item.id);
      el.classList.toggle('packed', item.packed);
      el.dataset.packed = item.packed ? 'true' : 'false';
      this._saveAndUpdateProgress();
      this._updateCategoryCount(catKey);
    });

    // Assignee change
    const assigneeSelect = el.querySelector('.item-assignee');
    if (assigneeSelect) {
      assigneeSelect.addEventListener('change', () => {
        TripPlanner.assignItem(this.currentTrip.packingList, catKey, item.id, assigneeSelect.value);
        this._saveAndUpdateProgress();
      });
    }

    // Remove custom item
    const removeBtn = el.querySelector('.remove-item');
    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        TripPlanner.removeItem(this.currentTrip.packingList, catKey, item.id);
        el.remove();
        this._saveAndUpdateProgress();
        this._updateCategoryCount(catKey);
      });
    }

    return el;
  },

  _updateCategoryCount(catKey) {
    const catDiv = document.querySelector(`.category[data-category="${catKey}"]`);
    if (!catDiv) return;
    const category = this.currentTrip.packingList[catKey];
    const count = catDiv.querySelector('.category-count');
    if (count && category) {
      count.textContent = `${category.items.filter(i => i.packed).length}/${category.items.length}`;
    }
  },

  _updateProgress() {
    const el = document.getElementById('packing-progress');
    if (!el || !this.currentTrip?.packingList) return;

    const progress = TripPlanner.getProgress(this.currentTrip.packingList);
    el.innerHTML = `
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${progress.percentage}%"></div>
      </div>
      <div class="progress-text">
        <span>${progress.packed} av ${progress.total} pakket</span>
        <span class="progress-pct">${progress.percentage}%</span>
      </div>
    `;
  },

  _applyFilter(filter) {
    document.querySelectorAll('.packing-item').forEach(el => {
      if (filter === 'all') {
        el.style.display = '';
      } else if (filter === 'packed') {
        el.style.display = el.dataset.packed === 'true' ? '' : 'none';
      } else {
        el.style.display = el.dataset.packed === 'false' ? '' : 'none';
      }
    });
  },

  _saveAndUpdateProgress() {
    TripPlanner.saveCurrentTrip(this.currentTrip);
    this._updateProgress();
  },

  // ---- Weather ----

  async _loadWeather() {
    const container = document.getElementById('weather-content');
    if (!this.currentTrip) {
      container.innerHTML = '<div class="empty-state"><p>Planlegg en tur f\u00F8rst for \u00E5 se v\u00E6rmelding.</p></div>';
      return;
    }

    const destInfo = TripPlanner.getDestinationInfo(this.currentTrip);
    if (!destInfo.lat || !destInfo.lon) {
      container.innerHTML = '<div class="empty-state"><p>V\u00E6rmelding er ikke tilgjengelig for egendefinerte steder.</p></div>';
      return;
    }

    container.innerHTML = '<div class="loading"><div class="spinner"></div><p>Henter v\u00E6rmelding fra Yr.no...</p></div>';

    const forecasts = await Weather.getForecastForDates(
      destInfo.lat, destInfo.lon,
      this.currentTrip.startDate, this.currentTrip.endDate
    );

    if (!forecasts || forecasts.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>Kunne ikke hente v\u00E6rmelding. Pr\u00F8v igjen senere.</p></div>';
      return;
    }

    this.weatherData = Weather.getWeatherSummary(forecasts);

    let html = `
      <div class="weather-header">
        <h2>V\u00E6rmelding for ${destInfo.name}</h2>
        <p class="weather-source">Kilde: Yr.no (Meteorologisk institutt)</p>
      </div>
      <div class="weather-grid">
    `;

    for (const day of forecasts) {
      html += `
        <div class="weather-card">
          <div class="weather-date">${Weather.formatDate(day.date)}</div>
          <div class="weather-icon">${Weather.getWeatherIcon(day.condition)}</div>
          <div class="weather-condition">${Weather.getConditionText(day.condition)}</div>
          <div class="weather-temp">
            <span class="temp-high">${day.maxTemp}\u00B0</span>
            <span class="temp-low">${day.minTemp}\u00B0</span>
          </div>
          <div class="weather-details">
            <span>Vind: ${day.avgWind} m/s (maks ${day.maxWind})</span>
            <span>Nedb\u00F8r: ${day.precipitation} mm</span>
          </div>
        </div>
      `;
    }

    html += '</div>';

    // Weather-based packing suggestions
    const suggestions = PackingLists.addWeatherSuggestions(
      this.currentTrip.packingList,
      this.weatherData
    );

    if (suggestions.length > 0) {
      html += `
        <div class="weather-suggestions">
          <h3>V\u00E6rbaserte pakketips</h3>
          <div class="suggestion-list">
      `;

      for (const s of suggestions) {
        html += `
          <div class="suggestion-item">
            <span class="suggestion-name">${s.name}</span>
            <span class="suggestion-reason">${s.reason}</span>
            <button class="btn btn-sm add-weather-item" data-id="${s.id}">Legg til</button>
          </div>
        `;
      }

      html += '</div></div>';
    }

    container.innerHTML = html;

    // Bind add-weather-item buttons
    container.querySelectorAll('.add-weather-item').forEach(btn => {
      btn.addEventListener('click', () => {
        TripPlanner.addWeatherItems(this.currentTrip.packingList, suggestions);
        this._saveAndUpdateProgress();
        this._renderPackingList();
        btn.textContent = 'Lagt til!';
        btn.disabled = true;
        this._showToast('V\u00E6r-tips lagt til i pakkelisten!', 'success');
      });
    });
  },

  // ---- Saved Trips ----

  _renderSavedTrips() {
    const container = document.getElementById('saved-trips');
    const trips = TripPlanner.getSavedTrips();

    if (trips.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <p>Ingen lagrede turer enn\u00E5.</p>
          <p>Planlegg en tur og lagre den for gjenbruk!</p>
        </div>
      `;
      return;
    }

    let html = '';
    for (const trip of trips) {
      const progress = TripPlanner.getProgress(trip.packingList || {});
      const destInfo = trip.destination === 'custom' ? trip.destinationCustom : trip.destination;
      const typeLabel = PackingLists.tripTypes[trip.tripType]?.label || trip.tripType;

      html += `
        <div class="saved-trip-card" data-trip-id="${trip.id}">
          <div class="trip-card-header">
            <h3>${trip.name || destInfo}</h3>
            <span class="trip-type-badge">${typeLabel}</span>
          </div>
          <div class="trip-card-details">
            <span>${destInfo}</span>
            <span>${trip.startDate} - ${trip.endDate}</span>
            <span>${trip.familyMembers?.length || 0} familiemedlemmer</span>
          </div>
          <div class="trip-card-progress">
            <div class="progress-bar small">
              <div class="progress-fill" style="width: ${progress.percentage}%"></div>
            </div>
            <span>${progress.percentage}% pakket</span>
          </div>
          <div class="trip-card-actions">
            <button class="btn btn-sm load-trip">Last inn</button>
            <button class="btn btn-sm btn-danger delete-trip">Slett</button>
          </div>
        </div>
      `;
    }

    container.innerHTML = html;

    // Bind actions
    container.querySelectorAll('.load-trip').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.closest('.saved-trip-card').dataset.tripId;
        const trip = trips.find(t => t.id === id);
        if (trip) {
          this.currentTrip = trip;
          TripPlanner.saveCurrentTrip(trip);
          this._loadTripIntoForm(trip);
          this._renderPackingList();
          this._updateProgress();
          this.switchTab('packing');
          this._showToast('Tur lastet inn!', 'success');
        }
      });
    });

    container.querySelectorAll('.delete-trip').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.closest('.saved-trip-card').dataset.tripId;
        if (confirm('Er du sikker p\u00E5 at du vil slette denne turen?')) {
          TripPlanner.deleteTrip(id);
          this._renderSavedTrips();
          this._showToast('Tur slettet.', 'info');
        }
      });
    });
  },

  // ---- To Do Sync ----

  async syncToTodo() {
    if (!AuthManager.isSignedIn()) {
      this._showToast('Logg inn med Microsoft f\u00F8rst!', 'error');
      return;
    }
    if (!this.currentTrip) {
      this._showToast('Ingen pakkeliste \u00E5 synkronisere!', 'error');
      return;
    }

    const btn = document.getElementById('sync-todo-btn');
    btn.disabled = true;
    btn.textContent = 'Synkroniserer...';

    try {
      const tripName = TripPlanner.getTripDisplayName(this.currentTrip);
      const result = await TodoApi.syncToTodo(tripName, this.currentTrip.packingList);
      this.currentTrip.todoListId = result.listId;
      TripPlanner.saveCurrentTrip(this.currentTrip);
      this._showToast(`Synkronisert ${result.itemCount} elementer til Microsoft To Do!`, 'success');
    } catch (e) {
      this._showToast('Synkronisering feilet: ' + e.message, 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Synk til To Do';
    }
  },

  // ---- Save Trip ----

  saveCurrentTrip() {
    if (!this.currentTrip) {
      this._showToast('Ingen tur \u00E5 lagre!', 'error');
      return;
    }
    TripPlanner.saveTrip(this.currentTrip);
    this._showToast('Tur lagret!', 'success');
  },

  // ---- Print ----

  printList() {
    window.print();
  },

  // ---- Toast notifications ----

  _showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => App.init());
