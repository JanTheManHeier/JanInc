/* ============================================================
   Den siste villhingsten — app.js
   ============================================================ */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const LS = {
  get: (k, d) => { try { const v = localStorage.getItem('warszawa-' + k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set: (k, v) => localStorage.setItem('warszawa-' + k, JSON.stringify(v))
};

/* ==========================================================
   THEME SWITCHER
   ========================================================== */
const THEMES = [
  { id: 'dark-gold', label: 'Dark Gold', color: '#d4af37', bg: '#0a0807' },
  { id: 'neon-noir', label: 'Neon Noir', color: '#ff3cac', bg: '#0b0618' },
  { id: 'papier',    label: 'Papier',    color: '#c1272d', bg: '#f5f1e8' }
];

function applyTheme(id) {
  const t = THEMES.find(x => x.id === id) || THEMES[0];
  document.documentElement.setAttribute('data-theme', t.id);
  LS.set('theme', t.id);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', t.bg);
}

function initTheme() {
  const saved = LS.get('theme', 'dark-gold');
  applyTheme(saved);
  const btn = document.getElementById('theme-btn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark-gold';
    const idx = THEMES.findIndex(t => t.id === current);
    const next = THEMES[(idx + 1) % THEMES.length];
    applyTheme(next.id);
    // Flash label
    const old = btn.innerHTML;
    btn.innerHTML = `<span style="font-size:10px;letter-spacing:.05em">${next.label}</span>`;
    setTimeout(() => btn.innerHTML = '🎨', 1200);
  });
}

/* ==========================================================
   TABS + HASH ROUTING
   ========================================================== */

function initTabs() {
  const tabs = $$('.tab');
  const panels = $$('.panel');
  function showTab(id) {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === id));
    panels.forEach(p => p.classList.toggle('active', p.id === id));
    if (id === 'kart') setTimeout(() => window._map && window._map.invalidateSize(), 50);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  tabs.forEach(t => t.addEventListener('click', e => {
    e.preventDefault();
    location.hash = t.dataset.tab;
    showTab(t.dataset.tab);
  }));
  window.addEventListener('hashchange', () => {
    const id = location.hash.slice(1) || 'hjem';
    showTab(id);
  });
  const initial = location.hash.slice(1) || 'hjem';
  showTab(initial);
}

/* ==========================================================
   COUNTDOWN
   ========================================================== */

function initCountdown() {
  const el = $('#countdown');
  const target = new Date(TRIP.startISO).getTime();
  const end = new Date(TRIP.endISO).getTime();

  function tick() {
    const now = Date.now();
    let t = target - now;
    let label = 'Til avreise';
    if (now > target && now < end) { t = end - now; label = 'Gjenstår av turen'; }
    if (now > end) { el.innerHTML = `<div class="cd-unit"><div class="cd-num">🐎</div><div class="cd-label">Villhingsten har returnert</div></div>`; return; }

    const d = Math.floor(t / 86400000);
    const h = Math.floor((t % 86400000) / 3600000);
    const m = Math.floor((t % 3600000) / 60000);
    const s = Math.floor((t % 60000) / 1000);

    el.innerHTML = `
      <div class="cd-unit"><div class="cd-num">${d}</div><div class="cd-label">${label === 'Til avreise' ? 'Dager' : 'Dager igjen'}</div></div>
      <div class="cd-unit"><div class="cd-num">${String(h).padStart(2,'0')}</div><div class="cd-label">Timer</div></div>
      <div class="cd-unit"><div class="cd-num">${String(m).padStart(2,'0')}</div><div class="cd-label">Min</div></div>
      <div class="cd-unit"><div class="cd-num">${String(s).padStart(2,'0')}</div><div class="cd-label">Sek</div></div>
    `;
  }
  tick(); setInterval(tick, 1000);
}

/* ==========================================================
   PROGRAM
   ========================================================== */

function renderProgram() {
  const root = $('#program-root');
  const placeById = Object.fromEntries(PLACES.map(p => [p.id, p]));
  root.innerHTML = PROGRAM.map(day => `
    <div class="day-block">
      <div class="day-header"><h3>${day.day}</h3></div>
      <div class="timeline">
        ${day.items.map((item, i) => {
          const ids = item.placeIds || (item.placeId ? [item.placeId] : []);
          const places = ids.map(id => placeById[id]).filter(Boolean);
          const multi = places.length > 1;
          const linksHtml = places.length ? `
            <div class="event-links">
              ${places.map(place => `
                <div class="event-place">
                  ${multi ? `<div class="event-place-name">${place.name}</div>` : ''}
                  <div class="event-place-links">
                    <a href="#kart" class="event-link" data-place="${place.id}" title="Vis på kart">
                      <span class="el-icon">🗺️</span><span>Kart</span>
                    </a>
                    <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' Warszawa')}" target="_blank" rel="noopener" class="event-link" title="Google Maps">
                      <span class="el-icon">🌐</span><span>Google Maps</span>
                    </a>
                    ${place.ig ? `<a href="https://www.instagram.com/${place.ig}/" target="_blank" rel="noopener" class="event-link" title="Instagram">
                      <span class="el-icon">📸</span><span>Instagram</span>
                    </a>` : ''}
                  </div>
                </div>
              `).join('')}
            </div>` : '';
          return `
          <div class="event ${item.status}" data-idx="${day.dayId}-${i}">
            <div class="event-time">${item.time}</div>
            <div class="event-body">
              <h4>${item.title}<span class="event-badge">${badgeText(item.status)}</span></h4>
              <p class="event-desc">${item.desc}</p>
              ${linksHtml}
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>
  `).join('');

  $$('.event', root).forEach(e => e.addEventListener('click', ev => {
    if (ev.target.closest('.event-link')) return;
    e.classList.toggle('open');
  }));

  $$('.event-link[data-place]', root).forEach(a => a.addEventListener('click', ev => {
    ev.preventDefault();
    ev.stopPropagation();
    const id = a.dataset.place;
    location.hash = 'kart';
    setTimeout(() => {
      const entry = window._markers && window._markers[id];
      const place = placeById[id];
      if (entry && window._map && place) {
        window._map.setView([place.lat, place.lng], 16);
        entry.marker.openPopup();
      }
    }, 200);
  }));
}

function badgeText(s) {
  return s === 'confirmed' ? 'Booket' : s === 'suggestion' ? 'Forslag' : 'Planlagt';
}

/* ==========================================================
   PEOPLE
   ========================================================== */

function renderPeople() {
  const root = $('#people-root');
  root.innerHTML = PEOPLE.map(p => `
    <div class="person ${p.isGroom ? 'groom' : ''}">
      <div class="person-head">
        <img class="person-avatar" src="images/${p.id}.jpg" alt="${p.name}" onerror="this.style.display='none'">
        <div>
          <h3 class="person-name">${p.name}</h3>
          <div class="person-role">${p.role}</div>
        </div>
      </div>
      <div class="person-body">
        ${p.job ? `<div class="person-meta">💼 ${p.job}</div>` : ''}
        ${p.age ? `<div class="person-meta">🎂 ${p.age} år</div>` : ''}
        <p class="person-bio">${p.bio}</p>
        ${p.tags ? `<div class="person-tags">${p.tags.map(t => `<span class="person-tag">${t}</span>`).join('')}</div>` : ''}
      </div>
    </div>
  `).join('');
}

/* ==========================================================
   REISE
   ========================================================== */

function renderFlights() {
  const out = FLIGHTS.out;
  $('#flights-out').innerHTML = out.segments.map((s, i) => {
    const layover = i > 0 ? `<div class="flight-layover">Mellomlanding: ${out.layovers[i-1] || ''}</div>` : '';
    return `
      ${layover}
      <div class="flight-segment">
        <div class="flight-port">
          <div class="flight-code">${s.from}</div>
          <div class="flight-name">${s.fromName}</div>
          <div class="flight-time">${s.dep}</div>
        </div>
        <div class="flight-arrow">→</div>
        <div class="flight-port">
          <div class="flight-code">${s.to}</div>
          <div class="flight-name">${s.toName}${s.terminal ? ' · ' + s.terminal : ''}</div>
          <div class="flight-time">${s.arr}</div>
        </div>
        <div class="flight-meta">${s.flight} · ${s.carrier} · ${s.dur}</div>
      </div>
    `;
  }).join('');

  const home = FLIGHTS.home;
  $('#flights-home').innerHTML = home.segments.map(s => `
    <div class="flight-segment">
      <div class="flight-port">
        <div class="flight-code">${s.from}</div>
        <div class="flight-name">${s.fromName}</div>
        <div class="flight-time">${s.dep}</div>
      </div>
      <div class="flight-arrow">→</div>
      <div class="flight-port">
        <div class="flight-code">${s.to}</div>
        <div class="flight-name">${s.toName}</div>
        <div class="flight-time">${s.arr}</div>
      </div>
      <div class="flight-meta">${s.carrier} · ${s.dur}</div>
    </div>
  `).join('') + `<p class="muted small">${home.notes}</p>`;
}

/* ==========================================================
   MAP
   ========================================================== */

const CAT_ICONS = { hotel: '🏨', food: '🍽️', bar: '🍺', club: '🌃', cafe: '☕', sight: '⭐' };

function initMap() {
  const map = L.map('map').setView([52.235, 21.010], 13);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    maxZoom: 19
  }).addTo(map);

  const markers = {};
  PLACES.forEach(p => {
    const icon = L.divIcon({
      className: 'custom-marker',
      html: `<div style="background:#d4af37; color:#0a0807; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:16px; box-shadow:0 0 10px rgba(212,175,55,.6); border:2px solid #0a0807;">${CAT_ICONS[p.cat] || '📍'}</div>`,
      iconSize: [32, 32], iconAnchor: [16, 16]
    });
    const m = L.marker([p.lat, p.lng], { icon }).addTo(map);
    m.bindPopup(`<strong>${p.name}</strong><br>${p.desc}`);
    markers[p.id] = { marker: m, cat: p.cat };
  });

  window._map = map;
  window._markers = markers;

  // "Her er du nå"-prikk (pulserende blå)
  let meMarker = null;
  let meCircle = null;
  const meIcon = L.divIcon({
    className: 'me-marker',
    html: '<div class="me-dot"><div class="me-pulse"></div></div>',
    iconSize: [20, 20], iconAnchor: [10, 10]
  });

  function updateMe(lat, lng, acc) {
    if (!meMarker) {
      meMarker = L.marker([lat, lng], { icon: meIcon, zIndexOffset: 1000 }).addTo(map);
      meMarker.bindPopup('Her er du nå 📍');
      meCircle = L.circle([lat, lng], {
        radius: acc || 30,
        color: '#4a9eff', fillColor: '#4a9eff', fillOpacity: 0.12, weight: 1
      }).addTo(map);
    } else {
      meMarker.setLatLng([lat, lng]);
      meCircle.setLatLng([lat, lng]);
      if (acc) meCircle.setRadius(acc);
    }
  }

  if ('geolocation' in navigator) {
    // Initial fix — zoom til brukeren hvis vi er i Warszawa-området
    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude, accuracy } = pos.coords;
      updateMe(latitude, longitude, accuracy);
      // Hvis innenfor ~50km fra Warszawa, pan dit
      const d = Math.hypot(latitude - 52.235, longitude - 21.010);
      if (d < 0.6) map.setView([latitude, longitude], 14);
    }, err => console.log('Geolocation:', err.message), {
      enableHighAccuracy: true, timeout: 10000, maximumAge: 30000
    });
    // Live oppdatering
    navigator.geolocation.watchPosition(pos => {
      updateMe(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy);
    }, null, { enableHighAccuracy: true, maximumAge: 10000 });
  }

  // "Senter på meg"-knapp
  const locBtn = L.control({ position: 'topright' });
  locBtn.onAdd = function() {
    const btn = L.DomUtil.create('button', 'locate-btn');
    btn.innerHTML = '📍';
    btn.title = 'Senter på meg';
    btn.onclick = () => {
      if (meMarker) map.setView(meMarker.getLatLng(), 15);
      else if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(pos => {
          updateMe(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy);
          map.setView([pos.coords.latitude, pos.coords.longitude], 15);
        });
      }
    };
    L.DomEvent.disableClickPropagation(btn);
    return btn;
  };
  locBtn.addTo(map);

  $$('.filter-btn').forEach(btn => btn.addEventListener('click', () => {
    $$('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.cat;
    Object.values(markers).forEach(m => {
      if (cat === 'all' || m.cat === cat) m.marker.addTo(map);
      else map.removeLayer(m.marker);
    });
  }));
}

/* ==========================================================
   CHALLENGES
   ========================================================== */

function renderChallenges() {
  const done = LS.get('challenges-done', {});
  const root = $('#challenges-root');
  root.innerHTML = CHALLENGES.map(c => `
    <div class="challenge ${c.type === 'crude' ? 'crude' : ''} ${done[c.id] ? 'done' : ''}" data-id="${c.id}">
      <div class="challenge-check"></div>
      <div class="challenge-text">
        ${c.text} ${c.type === 'crude' ? '<span class="tag-crude">C</span>' : ''}
      </div>
    </div>
  `).join('');

  $$('.challenge').forEach(ch => ch.addEventListener('click', () => {
    const id = ch.dataset.id;
    const d = LS.get('challenges-done', {});
    d[id] = !d[id];
    LS.set('challenges-done', d);
    ch.classList.toggle('done', d[id]);
    updateChallengeStats();
  }));

  updateChallengeStats();
}

function updateChallengeStats() {
  const done = LS.get('challenges-done', {});
  const total = CHALLENGES.length;
  const n = CHALLENGES.filter(c => done[c.id]).length;
  const pct = Math.round(n / total * 100);
  $('#challenge-stats').innerHTML = `
    <div class="progress-text">${n} / ${total}</div>
    <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
    <div class="progress-text">${pct}%</div>
  `;
}

/* ==========================================================
   WEATHER (open-meteo, no key)
   ========================================================== */

const WMO = {
  0:'☀️ Klart',1:'🌤️ Lett skyet',2:'⛅ Delvis skyet',3:'☁️ Overskyet',
  45:'🌫️ Tåke',48:'🌫️ Tåke',
  51:'🌦️ Lett støvregn',53:'🌦️ Støvregn',55:'🌦️ Kraftig støvregn',
  61:'🌧️ Lett regn',63:'🌧️ Regn',65:'🌧️ Kraftig regn',
  71:'🌨️ Lett snø',73:'🌨️ Snø',75:'🌨️ Mye snø',
  80:'🌦️ Regnskyll',81:'🌦️ Regnskyll',82:'⛈️ Kraftige regnskyll',
  95:'⛈️ Torden',96:'⛈️ Torden med hagl',99:'⛈️ Kraftig torden'
};

async function initWeather() {
  try {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=52.23&longitude=21.01&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Europe%2FWarsaw&start_date=2026-04-23&end_date=2026-04-26';
    const r = await fetch(url);
    if (!r.ok) throw new Error('no weather');
    const d = await r.json();
    const cur = d.current;
    const fc = d.daily;

    const days = ['Tor','Fre','Lør','Søn'];
    const forecast = fc.time.map((date, i) => `
      <div class="weather-day">
        <div class="wd-day">${days[i] || date}</div>
        <div class="wd-icon">${(WMO[fc.weather_code[i]] || '').split(' ')[0]}</div>
        <div class="wd-temp">${Math.round(fc.temperature_2m_min[i])}° / ${Math.round(fc.temperature_2m_max[i])}°</div>
      </div>
    `).join('');

    $('#weather').innerHTML = `
      <div class="weather-main">
        <div class="weather-temp">${Math.round(cur.temperature_2m)}°</div>
        <div class="weather-desc">Nå i Warszawa · ${WMO[cur.weather_code] || 'Ukjent'}</div>
      </div>
      <div class="weather-forecast">${forecast}</div>
    `;
  } catch (e) {
    $('#weather').innerHTML = '<p class="muted small">Kunne ikke hente vær. Sjekk yr.no/warszawa.</p>';
  }
}

/* ==========================================================
   CURRENCY
   ========================================================== */

function initCurrency() {
  let rate = LS.get('pln-rate', null);

  async function loadRate() {
    if (rate) { applyRate(rate); return; }
    try {
      const r = await fetch('https://open.er-api.com/v6/latest/NOK');
      if (r.ok) {
        const d = await r.json();
        if (d.rates && d.rates.PLN) {
          rate = d.rates.PLN;
          LS.set('pln-rate', rate);
        } else throw 0;
      } else throw 0;
    } catch {
      rate = 0.38;
    }
    applyRate(rate);
  }

  function applyRate(r) {
    $('#rate-display').textContent = r.toFixed(3);
    convert();
  }

  function convert() {
    const nok = parseFloat($('#nok-input').value) || 0;
    $('#pln-input').value = (nok * rate).toFixed(2);
  }

  $('#nok-input').addEventListener('input', convert);
  $('#rate-edit').addEventListener('click', () => {
    const v = prompt('Ny PLN-rate (PLN per 1 NOK):', rate);
    if (v && !isNaN(parseFloat(v))) {
      rate = parseFloat(v);
      LS.set('pln-rate', rate);
      applyRate(rate);
    }
  });

  loadRate();
}

/* ==========================================================
   PHRASES
   ========================================================== */

function renderPhrases() {
  $('#phrases-root').innerHTML = `
    <table class="phrases-table">
      <thead><tr><th>Polsk</th><th>Norsk</th><th>Uttale</th></tr></thead>
      <tbody>
        ${PHRASES.map(p => `<tr><td class="pl">${p.pl}</td><td>${p.no}</td><td class="pron">${p.pron}</td></tr>`).join('')}
      </tbody>
    </table>
  `;
}

/* ==========================================================
   EMERGENCY
   ========================================================== */

function renderEmergency() {
  $('#emergency-root').innerHTML = `
    <div class="emergency-list">
      ${EMERGENCY.map(e => `
        <div class="emergency-item">
          <strong>${e.label}</strong>
          ${e.type === 'phone'
            ? `<a href="tel:${e.value.replace(/\s/g,'')}">${e.value}</a>`
            : `<span>${e.value}</span>`}
        </div>
      `).join('')}
    </div>
  `;
}

/* ==========================================================
   PACKING LIST
   ========================================================== */

function renderPacking() {
  const root = $('#pack-root');
  const done = LS.get('packing-done', {});
  root.innerHTML = PACKING.map((group, gi) => `
    <div class="pack-group">
      <h3 class="pack-cat">${group.cat}</h3>
      ${group.items.map((item, ii) => {
        const id = `${gi}-${ii}`;
        return `
          <label class="pack-item ${done[id] ? 'checked' : ''}" data-id="${id}">
            <span class="pack-check"></span>
            <span class="pack-text">${item}</span>
          </label>`;
      }).join('')}
    </div>
  `).join('');

  updatePackProgress();

  $$('.pack-item', root).forEach(el => el.addEventListener('click', e => {
    e.preventDefault();
    const id = el.dataset.id;
    const d = LS.get('packing-done', {});
    d[id] = !d[id];
    LS.set('packing-done', d);
    el.classList.toggle('checked', !!d[id]);
    updatePackProgress();
  }));
}

function updatePackProgress() {
  const done = LS.get('packing-done', {});
  const total = PACKING.reduce((n, g) => n + g.items.length, 0);
  const checked = Object.values(done).filter(Boolean).length;
  const pct = total ? (checked / total) * 100 : 0;
  $('#pack-fill').style.width = pct + '%';
  $('#pack-count').textContent = `${checked} / ${total}`;
}

/* ==========================================================
   EXPENSES (budget)
   ========================================================== */

function renderExpenses() {
  const list = LS.get('expenses', []);
  const root = $('#expenses-list');
  if (!list.length) { root.innerHTML = '<p class="muted small">Ingen utlegg registrert enda.</p>'; }
  else {
    root.innerHTML = list.map((e, i) => `
      <div class="expense-row">
        <span>${e.desc}</span>
        <span class="amt">${e.amount.toFixed(2)} ${e.currency}</span>
        <span class="muted">${e.who}</span>
        <button data-idx="${i}" aria-label="Slett">✕</button>
      </div>
    `).join('');
    $$('.expense-row button', root).forEach(b => b.addEventListener('click', () => {
      const all = LS.get('expenses', []);
      all.splice(parseInt(b.dataset.idx), 1);
      LS.set('expenses', all);
      renderExpenses();
    }));
  }

  // Summary
  const rate = LS.get('pln-rate', 0.38);
  let totalNOK = 0;
  list.forEach(e => { totalNOK += e.currency === 'NOK' ? e.amount : e.amount / rate; });
  const perPerson = totalNOK / 8;
  $('#expenses-summary').innerHTML = `
    <span>Totalt: <strong>${totalNOK.toFixed(0)} NOK</strong></span>
    <span>Per mann (8): <strong>${perPerson.toFixed(0)} NOK</strong></span>
  `;
}

function initExpenses() {
  $('#expense-form').addEventListener('submit', e => {
    e.preventDefault();
    const entry = {
      desc: $('#exp-desc').value.trim(),
      amount: parseFloat($('#exp-amount').value),
      currency: $('#exp-currency').value,
      who: $('#exp-who').value.trim(),
      time: Date.now()
    };
    const list = LS.get('expenses', []);
    list.push(entry);
    LS.set('expenses', list);
    $('#expense-form').reset();
    $('#exp-currency').value = 'PLN';
    renderExpenses();
  });
  renderExpenses();
}

/* ==========================================================
   NOTES (per day)
   ========================================================== */

function initNotes() {
  let current = 'torsdag';
  const area = $('#notes-area');
  const status = $('#notes-status');

  function load() {
    const all = LS.get('notes', {});
    area.value = all[current] || '';
  }

  function save() {
    const all = LS.get('notes', {});
    all[current] = area.value;
    LS.set('notes', all);
    status.textContent = 'Lagret ' + new Date().toLocaleTimeString('no');
    setTimeout(() => status.textContent = 'Lagres automatisk', 2000);
  }

  area.addEventListener('input', debounce(save, 500));

  $$('.day-btn').forEach(b => b.addEventListener('click', () => {
    save();
    $$('.day-btn').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    current = b.dataset.day;
    load();
  }));

  load();
}

function debounce(fn, ms) {
  let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

/* ==========================================================
   PHOTOS (localStorage base64)
   ========================================================== */

function initPhotos() {
  const input = $('#photo-input');
  const root = $('#photos-root');
  const modal = $('#img-modal');
  const modalImg = $('#img-modal-img');

  function render() {
    const photos = LS.get('photos', []);
    if (!photos.length) {
      root.innerHTML = '<p class="muted small">Ingen bilder enda. Trykk «Legg til bilder».</p>';
      return;
    }
    root.innerHTML = photos.map((p, i) => `
      <div class="photo-cell" data-idx="${i}">
        <img src="${p.data}" alt="Bilde ${i+1}">
        <button class="del" data-idx="${i}">✕</button>
      </div>
    `).join('');
    $$('.photo-cell img', root).forEach(img => img.addEventListener('click', () => {
      modalImg.src = img.src;
      modal.hidden = false;
    }));
    $$('.photo-cell .del', root).forEach(btn => btn.addEventListener('click', e => {
      e.stopPropagation();
      const all = LS.get('photos', []);
      all.splice(parseInt(btn.dataset.idx), 1);
      LS.set('photos', all);
      render();
    }));
  }

  input.addEventListener('change', async () => {
    const files = Array.from(input.files);
    const all = LS.get('photos', []);
    for (const f of files) {
      try {
        const data = await resize(f, 1200);
        all.push({ data, time: Date.now(), name: f.name });
      } catch (e) { console.error(e); }
    }
    try {
      LS.set('photos', all);
    } catch (e) {
      alert('Lagringsplass full. Slett noen bilder først.');
    }
    input.value = '';
    render();
  });

  $('#img-modal-close').addEventListener('click', () => modal.hidden = true);
  modal.addEventListener('click', e => { if (e.target === modal) modal.hidden = true; });

  render();
}

function resize(file, maxDim) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = () => { img.src = reader.result; };
    reader.onerror = reject;
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', 0.82));
    };
    img.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ==========================================================
   INIT
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initTabs();
  initCountdown();
  renderProgram();
  renderPeople();
  renderFlights();
  initMap();
  renderChallenges();
  initWeather();
  initCurrency();
  renderPhrases();
  renderEmergency();
  renderPacking();
});
