// Thomas50 — hovedlogikk

// === Tema-init: kjøres umiddelbart for å unngå flash ===
(function temaInit() {
  const KEY = 'thomas50-tema';
  // Default mørkt — kun bruk lagret valg, ignorer prefers-color-scheme
  const tema = localStorage.getItem(KEY) || 'dark';
  document.documentElement.setAttribute('data-theme', tema);
})();

(function () {
  const STORAGE_NAVN = 'thomas50-navn';
  const STORAGE_BILDER = 'thomas50-bilder';
  const STORAGE_HILSEN_LOKAL = 'thomas50-hilsener-lokal';
  const STORAGE_TEMA = 'thomas50-tema';
  const API_BASE = '/api';

  let mittNavn = localStorage.getItem(STORAGE_NAVN) || '';
  let aktivSide = 'hjem';
  let map = null;
  let hilsener = [];
  let bilder = JSON.parse(localStorage.getItem(STORAGE_BILDER) || '[]');
  let gjesterFilter = 'alle';
  let gjesterSok = '';
  let quizIdx = 0;
  let diskIdx = 0;
  let quizScore = 0;       // antall riktige
  let quizSvart = 0;       // antall besvart
  let quizFerdig = false;
  let aktivSpillTab = 'quiz';

  // ============ Init ============
  document.addEventListener('DOMContentLoaded', () => {
    initNavnPille();
    initNavnModal();
    initTema();
    initNavigasjon();
    // Init kjøres umiddelbart — DB-avhengige kall venter ikke på SQL-vekking
    initHjem();
    initProgram();
    initGjester();
    initHilsener();
    initToastmaster();
    initSang();
    initSpill();
    initMinnebok();
    initOverlay();
    initMario();
    initBord();
    sporBesok('hjem');
    // Wake-up + admin-overstyringer hentes parallelt, blokkerer ikke UI
    vekkDb();
    lastGjesteEdits().then(() => {
      // Re-render gjester med eventuelle admin-overstyringer
      if (typeof renderGjester === 'function') renderGjester();
    });
  });

  // Vekk Azure SQL Free-tier som auto-pauser etter 60 min inaktivitet.
  // Vi gjør et lett kall så DB kan starte å våkne mens brukeren leser velkomstskjermen.
  async function vekkDb() {
    try {
      await fetchMedTimeout(`${API_BASE}/thomas50-greetings`, {}, 30000);
    } catch {}
  }

  // Hjelper: fetch med timeout (default 10 sek)
  async function fetchMedTimeout(url, opts = {}, ms = 10000) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), ms);
    try {
      return await fetch(url, { ...opts, signal: ctrl.signal });
    } finally {
      clearTimeout(timer);
    }
  }

  // Henter overstyrt info som Thomas har redigert i admin
  async function lastGjesteEdits() {
    try {
      const r = await fetchMedTimeout(`${API_BASE}/thomas50-gjest-edit`, {}, 60000);
      if (!r.ok) return;
      const data = await r.json();
      data.forEach(d => {
        const g = GJESTER.find(x => x.navn === d.navn);
        if (g) {
          if (d.bio !== null && d.bio !== undefined) g.bio = d.bio;
          if (d.relasjon !== null && d.relasjon !== undefined) g.relasjon = d.relasjon;
          if (d.extraBio !== null && d.extraBio !== undefined) g.extraBio = d.extraBio;
        }
      });
    } catch {}
  }

  // ============ Navn-pille (vises hvis anonym) ============
  function initNavnPille() {
    const p = document.getElementById('navn-pille');
    if (!p) return;
    function oppdater() {
      p.hidden = !!mittNavn;
      p.style.display = mittNavn ? 'none' : '';
    }
    oppdater();
    p.onclick = () => {
      const modal = document.getElementById('navn-modal');
      modal.hidden = false;
      modal.style.display = '';
      setTimeout(() => document.getElementById('navn-input').focus(), 200);
    };
    window._oppdaterNavnPille = oppdater;
  }
  function settNavn(n) {
    if (!n || mittNavn === n) return;
    mittNavn = n;
    localStorage.setItem(STORAGE_NAVN, n);
    if (window._oppdaterNavnPille) window._oppdaterNavnPille();
  }

  // ============ Navn-modal ============
  function initNavnModal() {
    const modal = document.getElementById('navn-modal');
    function lukk() {
      modal.hidden = true;
      modal.style.display = 'none';
      sporBesok('hjem');
    }
    if (!mittNavn) {
      modal.hidden = false;
      modal.style.display = '';
      const inp = document.getElementById('navn-input');
      setTimeout(() => inp.focus(), 200);
      document.getElementById('navn-lagre').onclick = () => {
        const n = inp.value.trim();
        if (n) {
          settNavn(n); // oppdaterer mittNavn + localStorage + pille
          lukk();
          toast(`Velkommen, ${n}! 🎉`);
        } else {
          inp.focus();
        }
      };
      document.getElementById('navn-skip').onclick = lukk;
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('navn-lagre').click(); });
    } else {
      modal.hidden = true;
      modal.style.display = 'none';
    }
  }

  // ============ Device fingerprint ============
  // Lager en stabil, lesbar enhet-ID per nettleser/enhet
  function deviceId() {
    let id = localStorage.getItem('thomas50-device');
    if (id) return id;
    const ua = navigator.userAgent;
    let device = 'Ukjent';
    if (/iPhone/.test(ua)) device = 'iPhone';
    else if (/iPad/.test(ua)) device = 'iPad';
    else if (/Android/.test(ua)) device = 'Android';
    else if (/Macintosh/.test(ua)) device = 'Mac';
    else if (/Windows/.test(ua)) device = 'Windows';
    else if (/Linux/.test(ua)) device = 'Linux';
    let browser = 'Browser';
    if (/Edg\//.test(ua)) browser = 'Edge';
    else if (/Chrome\//.test(ua)) browser = 'Chrome';
    else if (/Firefox\//.test(ua)) browser = 'Firefox';
    else if (/Safari\//.test(ua)) browser = 'Safari';
    // Hash av UA + screen + tz for unik ID
    const fp = ua + '|' + screen.width + 'x' + screen.height + '|' + (Intl.DateTimeFormat().resolvedOptions().timeZone || '');
    let hash = 0;
    for (let i = 0; i < fp.length; i++) hash = ((hash << 5) - hash + fp.charCodeAt(i)) | 0;
    const short = Math.abs(hash).toString(36).substring(0, 5).toUpperCase();
    id = `${device}/${browser} #${short}`;
    localStorage.setItem('thomas50-device', id);
    return id;
  }

  // ============ Tema (lyst/mørkt) ============
  function initTema() {
    const btn = document.getElementById('tema-toggle');
    if (!btn) return;
    const oppdaterKnapp = () => {
      const tema = document.documentElement.getAttribute('data-theme') || 'dark';
      const ikon = btn.querySelector('.tema-ikon');
      const tekst = btn.querySelector('.tema-tekst');
      if (tema === 'light') {
        if (ikon) ikon.textContent = '🌙';
        if (tekst) tekst.textContent = 'Mørkt tema';
      } else {
        if (ikon) ikon.textContent = '☀️';
        if (tekst) tekst.textContent = 'Lyst tema';
      }
    };
    oppdaterKnapp();
    btn.onclick = () => {
      const nav = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', nav);
      localStorage.setItem(STORAGE_TEMA, nav);
      oppdaterKnapp();
    };

    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
      refreshBtn.onclick = () => {
        // Tving full reload — bypass cache for service worker / nettleser
        if ('caches' in window) {
          caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
            .finally(() => location.reload());
        } else {
          location.reload();
        }
      };
    }
  }

  // ============ Navigasjon ============
  function initNavigasjon() {
    document.querySelectorAll('[data-go]').forEach(b => {
      b.addEventListener('click', () => visSide(b.dataset.go));
    });
  }
  // Sammenslåtte sider: sub-side → forelder-knapp i hovedmenyen
  const NAV_GROUP = {
    bord: 'gjester',
    toastmaster: 'hilsener',
    mario: 'spill',
    meny: 'program',
  };

  function visSide(id) {
    aktivSide = id;
    document.querySelectorAll('.page').forEach(p => p.hidden = (p.dataset.page !== id));
    const navParent = NAV_GROUP[id] || id;
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.go === navParent));
    document.querySelectorAll('.sub-tab').forEach(t => t.classList.toggle('active', t.dataset.go === id));
    window.scrollTo(0, 0);
    if (id === 'program') setTimeout(initMap, 100);
    if (id === 'hilsener') lastHilsener();
    if (id === 'gjester') renderGjester();
    if (id === 'mario') lastMarioTopp();
    if (id === 'bord') renderBord();
    sporBesok(id);
  }

  // ============ Hjem ============
  function initHjem() {
    const cd = document.getElementById('countdown');
    const oppdater = () => {
      const target = new Date(EVENT_DATO_ISO).getTime();
      const diff = target - Date.now();
      if (diff <= 0) { cd.innerHTML = '🎉 Festen er i gang!'; return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      cd.innerHTML = `⏳ ${d} dager, ${h} t, ${m} min til festen!`;
    };
    oppdater();
    setInterval(oppdater, 60000);

    // QR-kode med Thomas-bilde i midten (easyqrcodejs)
    const qrEl = document.getElementById('qr-kode');
    if (qrEl && window.QRCode) {
      try {
        qrEl.innerHTML = '';
        new QRCode(qrEl, {
          text: 'https://janinc.no/Thomas50/',
          width: 220,
          height: 220,
          colorDark: '#0D1B2A',
          colorLight: '#E8E0D4',
          correctLevel: QRCode.CorrectLevel.H,
          logo: 'images/thomas.jpg',
          logoWidth: 56,
          logoHeight: 56,
          logoBackgroundColor: '#E8E0D4',
          logoBackgroundTransparent: false,
        });
      } catch (e) {
        qrEl.innerHTML = '<p class="muted">Kunne ikke generere QR: ' + e.message + '</p>';
      }
    }
  }

  // ============ Program ============
  function initProgram() {
    const liste = document.getElementById('program-list');
    liste.innerHTML = PROGRAM.map(p => `
      <div class="program-kort" style="border-left-color:${p.farge}">
        <div class="program-tid">${p.tid}</div>
        <div class="program-ikon">${p.ikon}</div>
        <div class="program-info">
          <div class="sted">${esc(p.sted)}</div>
          <div class="beskrivelse">${esc(p.beskrivelse)}</div>
          <div class="adresse">📍 ${esc(p.adresse)}</div>
          ${p.kart ? `<a class="kart-link" href="${p.kart}" target="_blank" rel="noopener">🗺️ Åpne i Google Maps →</a>` : ''}
        </div>
      </div>`).join('');
  }

  function initMap() {
    const el = document.getElementById('map');
    if (!el || map) return;
    map = L.map('map').setView([69.6493, 18.9590], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);
    PROGRAM.forEach(p => {
      if (p.lat && p.lng) {
        const m = L.marker([p.lat, p.lng]).addTo(map);
        m.bindPopup(`<strong>${esc(p.sted)}</strong><br/>${esc(p.tid)}<br/><small>${esc(p.adresse)}</small>`);
      }
    });
    setTimeout(() => map.invalidateSize(), 200);
  }

  // ============ Gjester ============
  function initGjester() {
    const stats = document.getElementById('gjester-stats');
    const totalt = GJESTER.filter(g => !g.avbud).length;
    const pust = GJESTER.filter(g => g.pust && !g.avbud).length;
    const folge = GJESTER.filter(g => g.plus > 0).reduce((a, g) => a + g.plus, 0);
    stats.innerHTML = `
      <div><strong>${totalt}</strong>Bekreftet</div>
      <div><strong>${pust}</strong>På Pust</div>
      <div><strong>${folge}</strong>Følge</div>`;

    document.querySelectorAll('.chip[data-filter]').forEach(c => {
      c.addEventListener('click', () => {
        document.querySelectorAll('.chip[data-filter]').forEach(x => x.classList.toggle('active', x === c));
        gjesterFilter = c.dataset.filter;
        renderGjester();
      });
    });
    const sokInp = document.getElementById('gjester-sok');
    if (sokInp) sokInp.oninput = () => { gjesterSok = sokInp.value.trim().toLowerCase(); renderGjester(); };
    renderGjester();
  }

  function renderGjester() {
    const grid = document.getElementById('gjester-grid');
    let liste = GJESTER.slice();
    if (gjesterFilter === 'pust') liste = liste.filter(g => g.pust);
    else if (gjesterFilter === 'toast') liste = liste.filter(g => (g.rolle || '').toLowerCase() === 'toastmaster');
    else if (gjesterFilter === 'avbud') liste = liste.filter(g => g.avbud);
    else liste = liste.filter(g => !g.avbud);
    if (gjesterSok) {
      liste = liste.filter(g => {
        const tekst = [g.navn, g.bio, g.fbBio, g.liBio, g.relasjon, g.extraBio, g.folge, 'bord ' + g.bord]
          .filter(Boolean).join(' ').toLowerCase();
        return tekst.includes(gjesterSok);
      });
    }
    if (gjesterFilter === 'avbud' && liste.length === 0) {
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:#7A8FA8;padding:20px">Ingen avbud — nice! 🎉</div>`;
      return;
    }
    // Sortering: jubilanten først, så alfabetisk på fornavn
    liste.sort((a, b) => {
      if (a.jubilant && !b.jubilant) return -1;
      if (b.jubilant && !a.jubilant) return 1;
      return a.navn.localeCompare(b.navn, 'no');
    });
    if (liste.length === 0) {
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:#7A8FA8;padding:20px">Ingen treff for "${esc(gjesterSok)}"</div>`;
      return;
    }
    grid.innerHTML = liste.map((g, idx) => {
      const init = g.navn.split(' ').map(s => s[0]).slice(0, 2).join('');
      const klasser = ['gjest-kort'];
      const erToast = (g.rolle || '').toLowerCase() === 'toastmaster';
      if (erToast) klasser.push('toast');
      if (g.avbud) klasser.push('avbud');
      if (g.jubilant) klasser.push('jubilant');
      let tag = '';
      if (g.jubilant) tag = `<span class="gjest-tag jubilant">🦁 Danseløva</span>`;
      else if (erToast) tag = `<span class="gjest-tag toast">🎤 Toastmaster</span>`;
      else if (g.avbud) tag = `<span class="gjest-tag avbud">Avbud</span>`;
      else if (g.pust) tag = `<span class="gjest-tag">🧖 Pust${g.plus ? ` +${g.plus}` : ''}</span>`;
      else if (g.plus) tag = `<span class="gjest-tag">+${g.plus} følge</span>`;
      const bordTag = g.bord && !g.avbud ? (() => {
        const t = (typeof BORD_TEMA !== 'undefined' && BORD_TEMA[g.bord]) || null;
        return t
          ? `<span class="gjest-bord-tag" style="background:${t.farge}33;border-color:${t.farge}AA;color:${t.farge}">🪑 Bord ${esc(String(g.bord))} · 🏔️ ${esc(t.fjell)}</span>`
          : `<span class="gjest-bord-tag">🪑 Bord ${esc(String(g.bord))}</span>`;
      })() : '';
      return `
        <div class="${klasser.join(' ')}" data-gjest-idx="${idx}">
          ${g.bildeFil ? `<img class="gjest-bilde" src="${esc(g.bildeFil)}" alt="${esc(g.navn)}" />` : `<div class="gjest-avatar">${esc(init)}</div>`}
          <div class="gjest-navn">${esc(g.navn)}</div>
          <div class="gjest-bio">${esc(g.bio)}</div>
          ${bordTag}
          ${tag}
        </div>`;
    }).join('');
    // Lagre filtrert liste for modal-oppslag
    sistGjesterListe = liste;
    grid.querySelectorAll('.gjest-kort').forEach(el => {
      el.addEventListener('click', () => {
        const i = parseInt(el.dataset.gjestIdx, 10);
        visGjestModal(sistGjesterListe[i]);
      });
    });
  }

  let sistGjesterListe = [];

  function visGjestModal(g) {
    if (!g) return;
    const init = g.navn.split(' ').map(s => s[0]).slice(0, 2).join('');
    const innhold = document.getElementById('gjest-modal-innhold');
    let tag = '';
    if (g.jubilant) tag = `<span class="gjest-tag jubilant">🦁 Danseløva — Jubilanten</span>`;
    else if ((g.rolle || '').toLowerCase() === 'toastmaster') tag = `<span class="gjest-tag toast">🎤 Toastmaster</span>`;
    else if (g.avbud) tag = `<span class="gjest-tag avbud">Avbud</span>`;
    else if (g.pust) tag = `<span class="gjest-tag">🧖 På Pust${g.plus ? ` +${g.plus}` : ''}</span>`;
    else if (g.plus) tag = `<span class="gjest-tag">+${g.plus} følge</span>`;
    innhold.innerHTML = `
      ${g.bildeFil
        ? `<img class="gjest-modal-bilde" src="${esc(g.bildeFil)}" alt="${esc(g.navn)}" />`
        : `<div class="gjest-modal-avatar">${esc(init)}</div>`}
      <h2 class="gjest-modal-navn">${esc(g.navn)}</h2>
      ${g.bord && !g.avbud ? (() => {
        const t = (typeof BORD_TEMA !== 'undefined' && BORD_TEMA[g.bord]) || null;
        return t
          ? `<div class="gjest-modal-bord" style="background:${t.farge}33;border-color:${t.farge}AA;color:${t.farge}">🪑 Bord ${esc(String(g.bord))} — 🏔️ ${esc(t.fjell)}</div>`
          : `<div class="gjest-modal-bord">🪑 Bord ${esc(String(g.bord))}</div>`;
      })() : ''}
      <div class="gjest-modal-bio">${esc(g.bio)}</div>
      ${g.liBio ? `<div class="gjest-modal-felt">💼 ${esc(g.liBio)}</div>` : ''}
      ${g.fbBio ? `<div class="gjest-modal-felt">${esc(g.fbBio)}</div>` : ''}
      ${g.relasjon ? `<div class="gjest-modal-felt">👨‍👩‍👧 ${esc(g.relasjon)}</div>` : ''}
      ${g.extraBio ? `<div class="gjest-modal-felt gjest-modal-extra">✨ ${esc(g.extraBio)}</div>` : ''}
      ${g.folge ? `<div class="gjest-modal-felt">Følge: ${esc(g.folge)}</div>` : ''}
      <div class="gjest-modal-tags">${tag}</div>
      <div class="gjest-modal-lenker">
        ${g.fbUrl ? `<a class="gjest-fb-link" href="${esc(g.fbUrl)}" target="_blank" rel="noopener">facebook</a>` : ''}
        ${g.liUrl ? `<a class="gjest-fb-link" href="${esc(g.liUrl)}" target="_blank" rel="noopener">linkedin</a>` : ''}
      </div>`;
    const gjestModal = document.getElementById('gjest-modal');
    gjestModal.hidden = false;
    gjestModal.style.display = '';
  }

  // ============ Hilsener ============
  function initHilsener() {
    document.getElementById('hilsen-lagre').onclick = sendHilsen;
    if (mittNavn) document.getElementById('hilsen-navn').value = mittNavn;
  }

  async function lastHilsener() {
    const status = document.getElementById('hilsen-status');
    status.innerHTML = '⏳ Henter hilsener... (databasen kan trenge inntil 60 sek på å våkne første gang)';
    try {
      const res = await fetchMedTimeout(`${API_BASE}/thomas50-greetings`, {}, 60000);
      if (!res.ok) throw new Error('API feil');
      hilsener = await res.json();
      status.textContent = '';
    } catch (e) {
      // Fallback: localStorage
      hilsener = JSON.parse(localStorage.getItem(STORAGE_HILSEN_LOKAL) || '[]');
      status.textContent = '(Offline — viser lokale hilsener)';
    }
    renderHilsener();
  }

  function renderHilsener() {
    const liste = document.getElementById('hilsen-liste');
    if (!hilsener.length) {
      liste.innerHTML = `<div class="empty-state"><div class="empty-icon">💌</div><div>Ingen hilsener ennå — vær den første!</div></div>`;
      return;
    }
    liste.innerHTML = hilsener.map(h => `
      <div class="hilsen-kort">
        <div class="hilsen-navn">${esc(h.navn)}</div>
        <div class="hilsen-tekst">${esc(h.tekst)}</div>
        <div class="hilsen-tid">${formaterDato(h.opprettet)}</div>
      </div>`).join('');
  }

  async function sendHilsen() {
    const navn = document.getElementById('hilsen-navn').value.trim();
    const tekst = document.getElementById('hilsen-tekst').value.trim();
    if (!navn || !tekst) { toast('Fyll inn både navn og hilsen'); return; }
    const ny = { navn, tekst, opprettet: new Date().toISOString() };
    try {
      const res = await fetch(`${API_BASE}/thomas50-greetings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ny),
      });
      if (!res.ok) throw new Error('API feil');
      toast('Hilsen sendt! 🎉');
    } catch (e) {
      // Fallback til localStorage
      const lokal = JSON.parse(localStorage.getItem(STORAGE_HILSEN_LOKAL) || '[]');
      lokal.unshift(ny);
      localStorage.setItem(STORAGE_HILSEN_LOKAL, JSON.stringify(lokal));
      toast('Hilsen lagret lokalt (sendes når du er online)');
    }
    document.getElementById('hilsen-tekst').value = '';
    if (!mittNavn) settNavn(navn);
    lastHilsener();
  }

  // ============ Toastmaster ============
  function initToastmaster() {
    if (mittNavn) document.getElementById('toast-navn').value = mittNavn;
    document.getElementById('toast-lagre').onclick = sendToast;
  }

  async function sendToast() {
    const data = {
      navn: document.getElementById('toast-navn').value.trim(),
      epost: document.getElementById('toast-epost').value.trim(),
      tema: document.getElementById('toast-tema').value.trim(),
      melding: document.getElementById('toast-melding').value.trim(),
    };
    if (!data.navn || !data.melding) { toast('Fyll inn navn og melding'); return; }
    const status = document.getElementById('toast-status');
    status.textContent = 'Sender...';
    try {
      const res = await fetch(`${API_BASE}/thomas50-toast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('API feil');
      status.textContent = '';
      toast('🎤 Talen er meldt inn til Ronny og Marianne!');
      document.getElementById('toast-tema').value = '';
      document.getElementById('toast-melding').value = '';
    } catch (e) {
      status.textContent = 'Kunne ikke sende — prøv igjen senere eller send mail direkte til ronnyandre@gmail.com';
    }
    if (data.navn) settNavn(data.navn);
  }

  // ============ Sang ============
  function initSang() {
    document.getElementById('lyrics-text').textContent = SANGER_LYRICS;
    document.getElementById('vis-lyrics').onclick = () => {
      const l = document.getElementById('lyrics');
      const b = document.getElementById('vis-lyrics');
      l.hidden = !l.hidden;
      b.textContent = l.hidden ? '📜 Vis sangtekst' : '🙈 Skjul tekst';
    };
    document.getElementById('kopier-tekst').onclick = async () => {
      try {
        await navigator.clipboard.writeText(SANGER_LYRICS);
        toast('Sangtekst kopiert!');
      } catch {
        toast('Kunne ikke kopiere — kopier manuelt');
      }
    };
  }

  // ============ Spill ============
  function initSpill() {
    document.querySelectorAll('.tab[data-spill]').forEach(t => {
      t.addEventListener('click', () => {
        document.querySelectorAll('.tab[data-spill]').forEach(x => x.classList.toggle('active', x === t));
        const v = t.dataset.spill;
        aktivSpillTab = v;
        document.getElementById('quiz-view').hidden = v !== 'quiz';
        document.getElementById('topp-view').hidden = v !== 'topp';
        document.getElementById('diskusjon-view').hidden = v !== 'diskusjon';
        document.getElementById('regler-view').hidden = v !== 'regler';
        if (v === 'topp') lastTopp();
      });
    });

    nullstillQuiz();
    renderQuiz();
    document.getElementById('quiz-prev').onclick = () => {
      if (quizFerdig) return;
      quizIdx = (quizIdx - 1 + SPILL_QUIZ.length) % SPILL_QUIZ.length;
      renderQuiz();
    };
    document.getElementById('quiz-next').onclick = neste;
    document.getElementById('quiz-restart').onclick = () => { nullstillQuiz(); renderQuiz(); };
    document.getElementById('quiz-se-topp').onclick = () => {
      document.querySelector('.tab[data-spill="topp"]').click();
    };

    renderDiskusjon();
    document.getElementById('disk-next').onclick = () => { diskIdx = (diskIdx + 1) % SPILL_SPØRSMÅL.length; renderDiskusjon(); };
    document.getElementById('disk-rand').onclick = () => { diskIdx = Math.floor(Math.random() * SPILL_SPØRSMÅL.length); renderDiskusjon(); };
  }

  function nullstillQuiz() {
    quizIdx = 0; quizScore = 0; quizSvart = 0; quizFerdig = false;
    document.getElementById('quiz-resultat').hidden = true;
    document.querySelector('#quiz-view .quiz-card').hidden = false;
    document.getElementById('quiz-spill-status').hidden = false;
  }

  function neste() {
    if (quizIdx < SPILL_QUIZ.length - 1) {
      quizIdx++;
      renderQuiz();
    } else {
      visResultat();
    }
  }

  function renderQuiz() {
    const q = SPILL_QUIZ[quizIdx];
    document.getElementById('quiz-spill-status').textContent = `Score: ${quizScore} / ${quizSvart}`;
    document.getElementById('quiz-num').textContent = `Spørsmål ${quizIdx + 1} / ${SPILL_QUIZ.length}`;
    document.getElementById('quiz-q').textContent = q.spm;
    const opts = document.getElementById('quiz-options');
    const fasit = document.getElementById('quiz-fasit');
    const nextBtn = document.getElementById('quiz-next');
    const prevBtn = document.getElementById('quiz-prev');
    fasit.hidden = true;
    nextBtn.textContent = quizIdx === SPILL_QUIZ.length - 1 ? '🏁 Ferdig' : 'Neste →';
    nextBtn.disabled = true;
    nextBtn.style.opacity = '0.5';
    prevBtn.disabled = quizIdx === 0;
    prevBtn.style.opacity = quizIdx === 0 ? '0.5' : '1';
    opts.innerHTML = q.valg.map((v, i) => `<button class="quiz-opt" data-i="${i}">${esc(v)}</button>`).join('');
    opts.querySelectorAll('.quiz-opt').forEach(b => {
      b.onclick = () => svarKlikket(b, q);
    });
  }

  function svarKlikket(btn, q) {
    const opts = document.getElementById('quiz-options');
    if (opts.querySelector('.disabled')) return;
    const i = +btn.dataset.i;
    opts.querySelectorAll('.quiz-opt').forEach(x => x.classList.add('disabled'));
    quizSvart++;
    if (q.svar === null) {
      btn.classList.add('korrekt');
      quizScore++;
    } else if (i === q.svar) {
      btn.classList.add('korrekt');
      quizScore++;
    } else {
      btn.classList.add('feil');
      const k = opts.querySelector(`[data-i="${q.svar}"]`);
      if (k) k.classList.add('korrekt');
    }
    document.getElementById('quiz-fasit').textContent = q.fasit;
    document.getElementById('quiz-fasit').hidden = false;
    document.getElementById('quiz-spill-status').textContent = `Score: ${quizScore} / ${quizSvart}`;
    // Aktiver Neste-knappen
    const nextBtn = document.getElementById('quiz-next');
    nextBtn.disabled = false;
    nextBtn.style.opacity = '1';
  }

  function visResultat() {
    quizFerdig = true;
    document.querySelector('#quiz-view .quiz-card').hidden = true;
    document.getElementById('quiz-spill-status').hidden = true;
    document.getElementById('quiz-resultat').hidden = false;

    const prosent = Math.round((quizScore / SPILL_QUIZ.length) * 100);
    let tittel = `${quizScore} av ${SPILL_QUIZ.length} riktig!`;
    let tekst = '';
    if (prosent === 100) tekst = 'Perfekt! Du må kjenne Thomas usedvanlig godt 🥇';
    else if (prosent >= 80) tekst = 'Imponerende! Du er definitivt en ekte venn 🥈';
    else if (prosent >= 60) tekst = 'Bra! Du kjenner Thomas godt 🥉';
    else if (prosent >= 40) tekst = 'OK — kanskje du lærer mer i kveld 🍻';
    else tekst = 'Hm... Kanskje på tide å bli bedre kjent? 😉';
    document.getElementById('quiz-resultat-tittel').textContent = tittel;
    document.getElementById('quiz-resultat-tekst').textContent = tekst;

    // Hvis ingen navn: vis input
    const tekstEl = document.getElementById('quiz-resultat-tekst');
    const eksisterende = document.getElementById('quiz-navn-form');
    if (eksisterende) eksisterende.remove();

    if (!mittNavn) {
      const form = document.createElement('div');
      form.id = 'quiz-navn-form';
      form.style.marginTop = '16px';
      form.innerHTML = `
        <p style="font-size:13px;color:#D4A853">🏆 Du kommer på topp 10! Skriv navnet ditt:</p>
        <input id="quiz-navn-input" type="text" placeholder="Ditt navn" 
          style="display:block;width:100%;padding:10px;margin:8px 0;background:rgba(255,255,255,0.07);
          border:1px solid rgba(255,255,255,0.15);border-radius:8px;color:#E8E0D4;font-size:15px;
          box-sizing:border-box;font-family:inherit" />
        <button id="quiz-navn-lagre" class="btn-primary" style="margin:0">💾 Lagre score</button>`;
      tekstEl.after(form);
      const inp = form.querySelector('#quiz-navn-input');
      setTimeout(() => inp.focus(), 100);
      form.querySelector('#quiz-navn-lagre').onclick = async () => {
        const n = inp.value.trim();
        if (!n) { inp.focus(); return; }
        settNavn(n);
        await sendHighscore(n, quizScore, SPILL_QUIZ.length);
        form.remove();
        toast('🏆 Score lagret!');
        lastTopp();
      };
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') form.querySelector('#quiz-navn-lagre').click(); });
    } else {
      // Auto-lagre
      sendHighscore(mittNavn, quizScore, SPILL_QUIZ.length).then(() => toast('🏆 Score lagret!'));
    }
  }

  async function sendHighscore(navn, score, antall) {
    try {
      await fetch(`${API_BASE}/thomas50-highscore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ navn, score, antall }),
      });
    } catch {}
  }

  async function lastTopp() {
    const liste = document.getElementById('topp-liste');
    liste.innerHTML = '<p class="muted" style="text-align:center;padding:20px">⏳ Henter topp 10... (databasen kan trenge inntil 60 sek på å våkne)</p>';
    try {
      const r = await fetchMedTimeout(`${API_BASE}/thomas50-highscore`, {}, 60000);
      const data = await r.json();
      if (!data.length) {
        liste.innerHTML = '<div class="empty-state"><div class="empty-icon">🏆</div><div>Ingen scores ennå — bli den første!</div></div>';
        return;
      }
      liste.innerHTML = '<div class="topp-liste">' + data.map((d, i) => {
        const medalje = ['🥇', '🥈', '🥉'][i] || `${i+1}.`;
        const prosent = Math.round((d.score / d.antall) * 100);
        return `<div class="topp-rad">
          <span class="topp-medalje">${medalje}</span>
          <span class="topp-navn">${esc(d.navn)}</span>
          <span class="topp-score">${d.score}/${d.antall} (${prosent}%)</span>
        </div>`;
      }).join('') + '</div>';
    } catch {
      liste.innerHTML = '<p class="muted" style="text-align:center;padding:20px">Kunne ikke hente topp-listen.</p>';
    }
  }

  function renderDiskusjon() {
    document.getElementById('disk-num').textContent = `Spørsmål ${diskIdx + 1} / ${SPILL_SPØRSMÅL.length}`;
    document.getElementById('disk-q').textContent = SPILL_SPØRSMÅL[diskIdx];
  }

  // ============ Minnebok ============
  function initMinnebok() {
    const lastOppBtn = document.getElementById('last-opp');
    const fileInput = document.getElementById('file-input');
    if (lastOppBtn && fileInput) {
      lastOppBtn.onclick = () => fileInput.click();
      fileInput.onchange = lastOpp;
      renderBilder();
    }
  }

  function lastOpp(e) {
    const filer = Array.from(e.target.files);
    let i = 0;
    filer.forEach(f => {
      const reader = new FileReader();
      reader.onload = ev => {
        bilder.unshift({ id: Date.now() + Math.random(), src: ev.target.result, navn: f.name });
        bilder = bilder.slice(0, 60);
        localStorage.setItem(STORAGE_BILDER, JSON.stringify(bilder));
        if (++i === filer.length) { renderBilder(); toast('📷 Bilder lastet opp!'); }
      };
      reader.readAsDataURL(f);
    });
  }

  function renderBilder() {
    const grid = document.getElementById('bilde-grid');
    const tom = document.getElementById('minnebok-tom');
    if (!bilder.length) { tom.hidden = false; grid.innerHTML = ''; return; }
    tom.hidden = true;
    grid.innerHTML = bilder.map(b => `
      <div class="bilde-wrap" data-id="${b.id}">
        <img src="${b.src}" alt="" />
      </div>`).join('');
    grid.querySelectorAll('.bilde-wrap').forEach(el => {
      el.onclick = () => visBilde(el.dataset.id);
    });
  }

  function visBilde(id) {
    const b = bilder.find(x => String(x.id) === String(id));
    if (!b) return;
    document.getElementById('overlay-img').src = b.src;
    document.getElementById('overlay').hidden = false;
    document.getElementById('overlay-close').onclick = () => {
      if (confirm('Slett dette bildet fra Minneboken?')) {
        bilder = bilder.filter(x => x.id !== b.id);
        localStorage.setItem(STORAGE_BILDER, JSON.stringify(bilder));
        renderBilder();
      }
      document.getElementById('overlay').hidden = true;
    };
  }

  function initOverlay() {
    document.getElementById('overlay').addEventListener('click', e => {
      if (e.target.id === 'overlay') document.getElementById('overlay').hidden = true;
    });
    const gm = document.getElementById('gjest-modal');
    if (gm) {
      const lukk = () => { gm.hidden = true; gm.style.display = 'none'; };
      gm.addEventListener('click', e => {
        if (e.target.id === 'gjest-modal') lukk();
      });
      const closeBtn = document.getElementById('gjest-modal-close');
      if (closeBtn) closeBtn.onclick = lukk;
    }
  }

  // ============ Bord ============
  let bordSok = '';
  let bordGjesterFlat = [];
  function initBord() {
    const inp = document.getElementById('bord-sok');
    if (!inp) return;
    inp.oninput = () => { bordSok = inp.value.trim().toLowerCase(); renderBord(); };
  }

  function renderBord() {
    const liste = document.getElementById('bord-liste');
    if (!liste) return;
    // Grupper gjester per bord
    const bordMap = {};
    GJESTER.forEach(g => {
      if (g.avbud) return;
      if (!g.bord) return;
      if (!bordMap[g.bord]) bordMap[g.bord] = { type: g.bordType || 8, gjester: [] };
      bordMap[g.bord].gjester.push(g);
    });
    // Sorter gjester innenfor hvert bord etter setnummer
    Object.values(bordMap).forEach(b => {
      b.gjester.sort((a, c) => (a.sete || 999) - (c.sete || 999));
    });
    const bordNumre = Object.keys(bordMap).map(n => +n).sort((a,b) => a - b);

    let html = '';
    bordGjesterFlat = [];
    for (const nr of bordNumre) {
      const b = bordMap[nr];
      const tema = (typeof BORD_TEMA !== 'undefined' && BORD_TEMA[nr]) || null;
      const farge = tema ? tema.farge : '#D4A853';
      const matchSok = bordSok && b.gjester.some(g => g.navn.toLowerCase().includes(bordSok));
      const utheve = matchSok ? ' bord-treff' : '';
      const tittel = tema
        ? `${tema.url ? `<a class="bord-fjell-link" href="${esc(tema.url)}" target="_blank" rel="noopener"><span class="bord-fjell">🏔️ ${esc(tema.fjell)}</span></a>` : `<span class="bord-fjell">🏔️ ${esc(tema.fjell)}</span>`}<span class="bord-fjell-meta">${tema.hoyde} m · ${esc(tema.hvor)}</span>`
        : `<span class="bord-fjell">Bord ${nr}</span>`;
      html += `<div class="bord-kort${utheve}" id="bord-${nr}" style="--bord-farge:${farge}">
        <div class="bord-header">
          <div class="bord-tittel">
            <span class="bord-nr-mini">Bord ${nr}</span>
            ${tittel}
          </div>
          <span class="bord-info">${b.gjester.length} 🪑</span>
        </div>
        <div class="bord-gjester">`;
      for (const g of b.gjester) {
        const treff = bordSok && g.navn.toLowerCase().includes(bordSok);
        const init = g.navn.split(' ').map(s => s[0]).slice(0, 2).join('');
        const idx = bordGjesterFlat.length;
        bordGjesterFlat.push(g);
        const navnTag = g.jubilant ? `<span class="jubilant-tag">🦁 Danseløva</span>` : '';
        html += `<div class="bord-gjest${treff ? ' bord-gjest-treff' : ''}${g.jubilant ? ' bord-gjest-jubilant' : ''}" data-bord-idx="${idx}">
          <span class="bord-sete">${g.sete || '?'}</span>
          ${g.bildeFil ? `<img class="bord-avatar" src="${esc(g.bildeFil)}" alt="" />` : `<div class="bord-avatar bord-init">${esc(init)}</div>`}
          <span class="bord-navn">${esc(g.navn)} ${navnTag}</span>
          ${g.relasjon ? `<span class="bord-rel">${esc(g.relasjon)}</span>` : ''}
          ${g.rolle ? `<span class="bord-tag">${esc(g.rolle)}</span>` : ''}
        </div>`;
      }
      html += '</div></div>';
    }
    liste.innerHTML = html;

    // Klikk på rad åpner gjest-modal
    liste.querySelectorAll('.bord-gjest').forEach(el => {
      el.addEventListener('click', () => {
        const i = parseInt(el.dataset.bordIdx, 10);
        visGjestModal(bordGjesterFlat[i]);
      });
    });

    // Scroll til treff hvis sokt
    if (bordSok) {
      const t = liste.querySelector('.bord-treff');
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  function initMario() {
    const canvas = document.getElementById('mario-canvas');
    const startScr = document.getElementById('mario-start');
    const resScr = document.getElementById('mario-resultat');
    const startBtn = document.getElementById('mario-start-btn');
    const restartBtn = document.getElementById('mario-restart-btn');
    const seToppBtn = document.getElementById('mario-se-topp-btn');
    const hoppBtn = document.getElementById('mario-hopp-btn');

    if (!canvas || !window.ThomasSpill) return;

    if (hoppBtn) {
      const trigger = (e) => { e.preventDefault(); ThomasSpill.hopp(); };
      hoppBtn.addEventListener('touchstart', trigger, { passive: false });
      hoppBtn.addEventListener('mousedown', trigger);
    }

    ThomasSpill.init(canvas, async (score) => {
      canvas.hidden = true;
      if (hoppBtn) hoppBtn.hidden = true;
      resScr.hidden = false;
      let tittel = `Du tok ${score} poeng!`;
      let tekst = '';
      if (score >= 50) tekst = '🥇 Helt sykt! Du er en ekte runner.';
      else if (score >= 30) tekst = '🥈 Imponerende! Du kommer trygt til festen.';
      else if (score >= 15) tekst = '🥉 Bra jobbet! Litt øl underveis.';
      else if (score > 0) tekst = '🍺 Du fikk noen øl, men hadde litt trøbbel.';
      else tekst = '😅 Pust dypt og prøv igjen!';
      document.getElementById('mario-resultat-tittel').textContent = tittel;
      document.getElementById('mario-resultat-tekst').textContent = tekst;

      // Eksisterende navn-input fjernes hvis allerede der
      const eks = document.getElementById('mario-navn-form');
      if (eks) eks.remove();

      if (!mittNavn) {
        const form = document.createElement('div');
        form.id = 'mario-navn-form';
        form.style.marginTop = '16px';
        form.innerHTML = `
          <p style="font-size:13px;color:#D4A853">🏆 Skriv navnet ditt for å komme på topp 10!</p>
          <input id="mario-navn-input" type="text" placeholder="Ditt navn"
            style="display:block;width:100%;padding:10px;margin:8px 0;background:rgba(255,255,255,0.07);
            border:1px solid rgba(255,255,255,0.15);border-radius:8px;color:#E8E0D4;font-size:15px;
            box-sizing:border-box;font-family:inherit" />
          <button id="mario-navn-lagre" class="btn-primary" style="margin:0">💾 Lagre score</button>`;
        document.getElementById('mario-resultat-tekst').after(form);
        const inp = form.querySelector('#mario-navn-input');
        setTimeout(() => inp.focus(), 100);
        form.querySelector('#mario-navn-lagre').onclick = async () => {
          const n = inp.value.trim();
          if (!n) { inp.focus(); return; }
          settNavn(n);
          await sendMarioScore(n, score);
          form.remove();
          toast(`🏆 Lagret: ${score} poeng for ${n}`);
          lastMarioTopp();
        };
        inp.addEventListener('keydown', e => { if (e.key === 'Enter') form.querySelector('#mario-navn-lagre').click(); });
      } else {
        sendMarioScore(mittNavn, score).then(() => {
          toast(`🏆 Lagret: ${score} poeng for ${mittNavn}`);
          lastMarioTopp();
        });
      }
    });

    function startSpill() {
      startScr.hidden = true;
      resScr.hidden = true;
      canvas.hidden = false;
      if (hoppBtn) hoppBtn.hidden = false;
      const form = document.getElementById('mario-navn-form');
      if (form) form.remove();
      // Wait for layout, then start
      setTimeout(() => ThomasSpill.start(), 50);
    }

    startBtn.onclick = startSpill;
    restartBtn.onclick = startSpill;
    seToppBtn.onclick = () => {
      resScr.scrollIntoView({ behavior: 'smooth' });
      lastMarioTopp();
    };

    lastMarioTopp();
  }

  async function sendMarioScore(navn, score) {
    try {
      await fetch(`${API_BASE}/thomas50-spillscore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ navn, score }),
      });
    } catch {}
  }

  async function lastMarioTopp() {
    const liste = document.getElementById('mario-topp');
    if (!liste) return;
    liste.innerHTML = '<p class="muted" style="text-align:center;padding:14px">⏳ Henter topp 10...</p>';
    try {
      const r = await fetchMedTimeout(`${API_BASE}/thomas50-spillscore`, {}, 60000);
      const data = await r.json();
      if (!data.length) {
        liste.innerHTML = '<div class="empty-state"><div class="empty-icon">🎮</div><div>Ingen scores ennå — bli den første!</div></div>';
        return;
      }
      liste.innerHTML = '<div class="topp-liste">' + data.map((d, i) => {
        const medalje = ['🥇', '🥈', '🥉'][i] || `${i+1}.`;
        return `<div class="topp-rad">
          <span class="topp-medalje">${medalje}</span>
          <span class="topp-navn">${esc(d.navn)}</span>
          <span class="topp-score">${d.score} poeng</span>
        </div>`;
      }).join('') + '</div>';
    } catch {
      liste.innerHTML = '<p class="muted" style="text-align:center;padding:14px">Kunne ikke hente topp-listen.</p>';
    }
  }

  // ============ Brukerstatistikk ============
  async function sporBesok(side) {
    try {
      const navnTilSporing = mittNavn || `(anon) ${deviceId()}`;
      await fetchMedTimeout(`${API_BASE}/thomas50-track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          navn: navnTilSporing,
          side,
          tidspunkt: new Date().toISOString(),
          ua: navigator.userAgent.substring(0, 200),
        }),
      }, 60000);
    } catch { /* stille */ }
  }

  // ============ Helpers ============
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function formaterDato(iso) {
    try {
      const d = new Date(iso);
      return d.toLocaleString('nb-NO', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    } catch { return ''; }
  }
  function toast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(window._tT);
    window._tT = setTimeout(() => { t.hidden = true; }, 3200);
  }
})();
