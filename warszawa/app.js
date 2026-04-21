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
    // Eksterne tabs (f.eks. spillet) — la nettleseren navigere
    if (t.classList.contains('tab-ext')) return;
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
        <img class="person-avatar" src="/warszawa/images/${p.id}.jpg" alt="${p.name}" onerror="this.style.display='none'">
        <div>
          <h3 class="person-name">${p.name}</h3>
          <div class="person-role">${p.role}</div>
        </div>
      </div>
      <div class="person-body">
        ${p.job ? `<div class="person-meta">💼 ${p.job}</div>` : ''}
        ${p.age ? `<div class="person-meta">🎂 ${p.age} år</div>` : ''}
        ${p.phone ? `<div class="person-meta">📞 <a href="tel:+47${p.phone}">+47 ${p.phone.replace(/(\d{3})(\d{2})(\d{3})/, '$1 $2 $3')}</a></div>` : ''}
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

const CAT_ICONS = { hotel: '🏨', food: '🍽️', bar: '🍺', club: '🌃', cafe: '☕', sight: '⭐', hidden: '💎' };

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
    const gmaps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name + ' Warszawa')}`;
    const igLink = p.ig ? `<a href="https://www.instagram.com/${p.ig}/" target="_blank" rel="noopener" class="map-popup-link ig">📷 Instagram</a>` : '';
    m.bindPopup(`
      <div class="map-popup">
        <strong>${p.name}</strong>
        <div class="map-popup-desc">${p.desc}</div>
        <div class="map-popup-links">
          <a href="${gmaps}" target="_blank" rel="noopener" class="map-popup-link gmaps">🗺️ Google Maps</a>
          ${igLink}
        </div>
      </div>
    `);
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
   WEATHER (api.met.no / yr.no — no key, free public data)
   ========================================================== */

// Yr symbol_code → emoji + norsk tekst
const YR_EMOJI = {
  clearsky: '☀️', fair: '🌤️', partlycloudy: '⛅', cloudy: '☁️',
  lightrainshowers: '🌦️', rainshowers: '🌦️', heavyrainshowers: '🌧️',
  lightrain: '🌦️', rain: '🌧️', heavyrain: '🌧️',
  lightsleet: '🌨️', sleet: '🌨️', heavysleet: '🌨️',
  lightsleetshowers: '🌨️', sleetshowers: '🌨️', heavysleetshowers: '🌨️',
  lightsnow: '🌨️', snow: '❄️', heavysnow: '❄️',
  lightsnowshowers: '🌨️', snowshowers: '🌨️', heavysnowshowers: '❄️',
  fog: '🌫️',
  thunder: '⛈️', rainshowersandthunder: '⛈️', rainandthunder: '⛈️',
  snowandthunder: '⛈️', sleetandthunder: '⛈️',
  heavyrainandthunder: '⛈️', heavyrainshowersandthunder: '⛈️',
  heavysleetandthunder: '⛈️', heavysleetshowersandthunder: '⛈️',
  heavysnowandthunder: '⛈️', heavysnowshowersandthunder: '⛈️',
  lightrainandthunder: '⛈️', lightrainshowersandthunder: '⛈️',
  lightsleetandthunder: '⛈️', lightsnowandthunder: '⛈️',
  lightssleetshowersandthunder: '⛈️', lightssnowshowersandthunder: '⛈️'
};
const YR_TEXT = {
  clearsky: 'Klart', fair: 'Lettskyet', partlycloudy: 'Delvis skyet', cloudy: 'Skyet',
  lightrainshowers: 'Lette regnbyger', rainshowers: 'Regnbyger', heavyrainshowers: 'Kraftige regnbyger',
  lightrain: 'Lett regn', rain: 'Regn', heavyrain: 'Kraftig regn',
  lightsleet: 'Lett sludd', sleet: 'Sludd', heavysleet: 'Kraftig sludd',
  lightsnow: 'Lett snø', snow: 'Snø', heavysnow: 'Kraftig snø',
  fog: 'Tåke', thunder: 'Torden',
  rainshowersandthunder: 'Regnbyger og torden', rainandthunder: 'Regn og torden'
};

function parseYrSymbol(code) {
  if (!code) return { e: '❓', t: '' };
  const base = code.replace(/_day$|_night$|_polartwilight$/, '');
  return { e: YR_EMOJI[base] || '❓', t: YR_TEXT[base] || base.replace(/_/g, ' ') };
}

async function initWeather() {
  const root = $('#weather');
  if (!root) return;
  try {
    const r = await fetch('https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=52.2370&lon=20.9940');
    if (!r.ok) throw new Error('met.no ' + r.status);
    const d = await r.json();
    const series = d.properties.timeseries;
    if (!series || !series.length) throw new Error('empty series');

    // NÅ
    const now = series[0];
    const curT = now.data.instant.details.air_temperature;
    const curWind = now.data.instant.details.wind_speed;
    const curSym = now.data.next_1_hours?.summary?.symbol_code
                || now.data.next_6_hours?.summary?.symbol_code || '';
    const curParsed = parseYrSymbol(curSym);

    // DAGLIG (tur-datoer 23.–26. april 2026)
    const tripDates = ['2026-04-23', '2026-04-24', '2026-04-25', '2026-04-26'];
    const dayNames = ['Tor', 'Fre', 'Lør', 'Søn'];
    const daily = tripDates.map((date, i) => {
      const points = series.filter(t => t.time.startsWith(date));
      if (!points.length) return null;
      const temps = points.map(p => p.data.instant.details.air_temperature);
      const tMin = Math.min(...temps);
      const tMax = Math.max(...temps);
      // Symbol fra kl 12 hvis tilgjengelig
      const noon = points.find(p => p.time.includes('T12:'))
                || points.find(p => p.time.includes('T14:'))
                || points[Math.floor(points.length / 2)];
      const sym = noon.data.next_6_hours?.summary?.symbol_code
               || noon.data.next_1_hours?.summary?.symbol_code || '';
      return { day: dayNames[i], tMin, tMax, sym };
    }).filter(Boolean);

    const forecast = daily.map(dy => `
      <div class="weather-day">
        <div class="wd-day">${dy.day}</div>
        <div class="wd-icon">${parseYrSymbol(dy.sym).e}</div>
        <div class="wd-temp">${Math.round(dy.tMin)}° / ${Math.round(dy.tMax)}°</div>
      </div>
    `).join('');

    const updated = new Date().toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' });

    root.innerHTML = `
      <div class="weather-main">
        <div class="weather-temp">${Math.round(curT)}°</div>
        <div class="weather-desc">
          Nå i Warszawa${curParsed.e ? ` · ${curParsed.e} ${curParsed.t}` : ''}
          <span class="muted small"> · vind ${Math.round(curWind)} m/s</span>
        </div>
      </div>
      <div class="weather-forecast">${forecast || ''}</div>
      ${daily.length === 0 ? '<p class="muted small" style="text-align:center;margin:0.5rem 0 1rem">Daglig prognose tilgjengelig fra ca 9 dager før avreise.</p>' : ''}
      <div class="weather-meteogram">
        <div class="wm-label">48-timers prognose</div>
        <a href="https://www.yr.no/nb/v%C3%A6rvarsel/daglig-tabell/2-756135/Polen/Mazowieckie/Warsaw/Warszawa" target="_blank" rel="noopener" aria-label="Åpne full prognose på yr.no">
          <img src="https://www.yr.no/en/content/2-756135/meteogram.svg"
               alt="Meteogram for Warszawa fra yr.no"
               loading="lazy"
               onerror="this.parentElement.style.display='none'">
        </a>
      </div>
      <p class="weather-source">
        Data fra <a href="https://www.yr.no/nb/v%C3%A6rvarsel/daglig-tabell/2-756135/Polen/Mazowieckie/Warsaw/Warszawa" target="_blank" rel="noopener">yr.no</a>
        · © Meteorologisk institutt / NRK · Oppdatert ${updated}
      </p>
    `;
  } catch (e) {
    root.innerHTML = `
      <p class="muted small">Kunne ikke hente sanntidsvær.
        <a href="https://www.yr.no/nb/v%C3%A6rvarsel/daglig-tabell/2-756135/Polen/Mazowieckie/Warsaw/Warszawa" target="_blank" rel="noopener">Se yr.no/warszawa →</a>
      </p>
    `;
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
    fromNok(); // initial render basert på NOK-feltet
  }

  function fromNok() {
    const nok = parseFloat($('#nok-input').value);
    if (isNaN(nok)) { $('#pln-input').value = ''; return; }
    $('#pln-input').value = (nok * rate).toFixed(2);
  }

  function fromPln() {
    const pln = parseFloat($('#pln-input').value);
    if (isNaN(pln)) { $('#nok-input').value = ''; return; }
    $('#nok-input').value = (pln / rate).toFixed(2);
  }

  $('#nok-input').addEventListener('input', fromNok);
  $('#pln-input').addEventListener('input', fromPln);
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

function initSOS() {
  // Populer hotell fra data.js
  if (typeof HOTEL !== 'undefined') {
    const nameEl = $('#taxi-hotel-name');
    const addrEl = $('#taxi-hotel-addr');
    if (nameEl) nameEl.textContent = HOTEL.name;
    if (addrEl) addrEl.innerHTML = (HOTEL.address || '').replace(',', ',<br>');
  }

  // Populer gjengen med telefonnummer
  const peopleRoot = $('#sos-people');
  if (peopleRoot && typeof PEOPLE !== 'undefined') {
    peopleRoot.innerHTML = PEOPLE
      .filter(p => p.phone)
      .map(p => {
        const fmt = p.phone.replace(/(\d{3})(\d{2})(\d{3})/, '$1 $2 $3');
        return `<a href="tel:+47${p.phone}">
          <span class="nm">${p.name.split(' ')[0]}</span>
          <span class="ph">+47 ${fmt}</span>
        </a>`;
      }).join('');
  }
}

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
  initSOS();
  initSongLyrics();
  renderOmWarszawa();
  initFlightMap();
  initShareCopy();
  scrollProgramToNext();
});

function initSongLyrics() {
  const btn = document.getElementById('song-lyrics-toggle');
  const box = document.getElementById('song-lyrics');
  if (!btn || !box) return;
  btn.addEventListener('click', () => {
    const open = !box.hidden;
    box.hidden = open;
    btn.setAttribute('aria-expanded', String(!open));
    btn.textContent = open ? '📜 Vis tekst' : '📜 Skjul tekst';
  });
}

/* ==========================================================
   OM WARSZAWA — historikk, fakta, top 5, events, hidden gems
   ========================================================== */

function renderOmWarszawa() {
  const intro = $('#warsaw-intro');
  if (intro) intro.textContent = WARSAW_INTRO;

  // Events
  const evRoot = $('#events-root');
  if (evRoot) {
    evRoot.innerHTML = EVENTS_WEEKEND.map(d => `
      <div class="events-day">
        <div class="events-day-head">${d.day}</div>
        <ul class="events-list">
          ${d.items.map(i => `
            <li class="event-item ${i.pick ? 'event-pick' : ''}">
              <span class="event-item-time">${i.time}</span>
              <div class="event-item-body">
                <div class="event-item-title">${i.title}</div>
                <div class="event-item-venue">📍 <a href="${SEARCH_URL(i.venue)}" target="_blank" rel="noopener">${i.venue}</a></div>
                ${i.note ? `<div class="event-item-note">${i.note}</div>` : ''}
              </div>
            </li>`).join('')}
        </ul>
      </div>`).join('');
  }

  // Top sights
  const tsRoot = $('#top-sights-root');
  if (tsRoot) tsRoot.innerHTML = TOP_SIGHTS.map(t => `
    <div class="top5-card">
      <div class="top5-rank">#${t.n}</div>
      <div class="top5-body">
        <div class="top5-title">${t.emoji} ${t.name}</div>
        <div class="top5-why">${t.why}</div>
        <div class="top5-actions">
          ${t.placeId ? `<a href="#kart" class="event-link" data-place="${t.placeId}">🗺️ Kart</a>` : ''}
          <a href="${SEARCH_URL(t.name)}" target="_blank" rel="noopener" class="event-link">🌐 Les mer</a>
        </div>
      </div>
    </div>`).join('');

  // Top activities
  const taRoot = $('#top-activities-root');
  if (taRoot) taRoot.innerHTML = TOP_ACTIVITIES.map(t => `
    <div class="top5-card">
      <div class="top5-rank">#${t.n}</div>
      <div class="top5-body">
        <div class="top5-title">${t.emoji} ${t.name}</div>
        <div class="top5-why">${t.why}</div>
      </div>
    </div>`).join('');

  // Hidden gems
  const hgRoot = $('#hidden-gems-root');
  if (hgRoot) {
    const gems = PLACES.filter(p => p.cat === 'hidden');
    hgRoot.innerHTML = gems.map(p => `
      <div class="gem-card">
        <div class="gem-name">💎 ${p.name}</div>
        <div class="gem-desc">${p.desc}</div>
        <div class="gem-actions">
          <a href="#kart" class="event-link" data-place="${p.id}">🗺️ Kart</a>
          <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name + ' Warszawa')}" target="_blank" rel="noopener" class="event-link">🌐 Google Maps</a>
          ${p.ig ? `<a href="https://www.instagram.com/${p.ig}/" target="_blank" rel="noopener" class="event-link">📸 Instagram</a>` : ''}
        </div>
      </div>`).join('');
  }

  // Fun facts
  const ffRoot = $('#facts-root');
  if (ffRoot) ffRoot.innerHTML = FUN_FACTS.map(f => `
    <div class="fact-card">
      <div class="fact-emoji">${f.emoji}</div>
      <div class="fact-body">
        <div class="fact-title">${f.title}</div>
        <div class="fact-text">${f.text}</div>
      </div>
    </div>`).join('');

  // Wire up place-link clicks from this tab too
  $$('.event-link[data-place]', $('#omwarszawa')).forEach(a => a.addEventListener('click', ev => {
    ev.preventDefault();
    const id = a.dataset.place;
    location.hash = 'kart';
    setTimeout(() => {
      const entry = window._markers && window._markers[id];
      const place = PLACES.find(p => p.id === id);
      if (entry && window._map && place) {
        window._map.setView([place.lat, place.lng], 16);
        entry.marker.openPopup();
      }
    }, 200);
  }));
}

/* ==========================================================
   FLIGHT ROUTE MAP (Reise-fanen)
   ========================================================== */

const AIRPORTS = {
  TOS: { lat: 69.6833, lng: 18.9189, name: "Tromsø" },
  OSL: { lat: 60.1939, lng: 11.1004, name: "Oslo" },
  CPH: { lat: 55.6180, lng: 12.6560, name: "København" },
  WAW: { lat: 52.1657, lng: 20.9671, name: "Warszawa" }
};

function initFlightMap() {
  const el = document.getElementById('flight-map');
  if (!el || typeof L === 'undefined') return;
  const map = L.map('flight-map', { scrollWheelZoom: false, zoomControl: true })
    .setView([60, 15], 4);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OSM &copy; CARTO',
    maxZoom: 10
  }).addTo(map);

  const outCoords = [AIRPORTS.TOS, AIRPORTS.OSL, AIRPORTS.CPH, AIRPORTS.WAW].map(a => [a.lat, a.lng]);
  const homeCoords = [AIRPORTS.WAW, AIRPORTS.OSL, AIRPORTS.TOS].map(a => [a.lat, a.lng]);

  L.polyline(outCoords, { color: '#d4af37', weight: 3, opacity: 0.9, dashArray: null })
    .addTo(map).bindTooltip('Utreise: TOS → OSL → CPH → WAW');
  L.polyline(homeCoords, { color: '#4aa5a5', weight: 3, opacity: 0.9, dashArray: '8,6', offset: 6 })
    .addTo(map).bindTooltip('Hjemreise: WAW → OSL → TOS');

  Object.entries(AIRPORTS).forEach(([code, a]) => {
    const icon = L.divIcon({
      className: 'airport-marker',
      html: `<div class="airport-dot">${code}</div>`,
      iconSize: [40, 24], iconAnchor: [20, 12]
    });
    L.marker([a.lat, a.lng], { icon }).addTo(map)
      .bindPopup(`<strong>${code}</strong><br>${a.name}`);
  });

  map.fitBounds(outCoords, { padding: [20, 20] });

  // Re-invalidate size when the reise tab becomes active
  window.addEventListener('hashchange', () => {
    if (location.hash === '#reise') setTimeout(() => map.invalidateSize(), 100);
  });
  if (location.hash === '#reise') setTimeout(() => map.invalidateSize(), 200);
}

/* ==========================================================
   PROGRAM AUTO-SCROLL TO NEXT UPCOMING ITEM
   ========================================================== */

function scrollProgramToNext() {
  const root = $('#program-root');
  if (!root || typeof PROGRAM === 'undefined') return;
  const now = new Date();
  // Find first item whose timestamp is in the future (or the same day as today)
  let targetEl = null;
  for (const day of PROGRAM) {
    for (let i = 0; i < day.items.length; i++) {
      const it = day.items[i];
      const [hh, mm] = (it.time.match(/\d+/g) || ['12','00']).map(Number);
      const ts = new Date(`${day.date}T${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}:00+02:00`);
      if (ts >= now) {
        targetEl = root.querySelector(`[data-idx="${day.dayId}-${i}"]`);
        break;
      }
    }
    if (targetEl) break;
  }
  if (!targetEl) return;
  targetEl.classList.add('event-current');
  // Only scroll when we're on the program tab
  if (location.hash === '#program' || location.hash === '') {
    setTimeout(() => targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
  }
  // Also hook on hashchange so it works when user navigates to program later
  window.addEventListener('hashchange', () => {
    if (location.hash === '#program') {
      setTimeout(() => targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' }), 250);
    }
  });
}

/* ==========================================================
   SHARE COPY BUTTON
   ========================================================== */

function initShareCopy() {
  const btn = document.getElementById('share-copy');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    const url = 'https://janinc.no/warszawa/';
    try {
      await navigator.clipboard.writeText(url);
      const orig = btn.textContent;
      btn.textContent = '✅ Kopiert!';
      setTimeout(() => { btn.textContent = orig; }, 1800);
    } catch (e) {
      btn.textContent = '⚠️ Prøv å kopier manuelt';
    }
  });
}
