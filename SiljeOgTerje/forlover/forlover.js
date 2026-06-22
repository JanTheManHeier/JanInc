// forlover.js — hemmelig spørrerunde for forloverne. Samme oppsett som brudeparets
// spørrerunde, men med dynamisk personliste (FORLOVER_PERSONER). Henter kun den
// innloggede forloverens egne svar — ingen ser de andres.
window.FL = (function () {
  const API = '/api/siljeterje-forlover';
  const KEY_PERSON = 'siljeterje-forlover-person';
  const personer = window.FORLOVER_PERSONER || [];
  const seksjoner = window.FORLOVER_SPORSMAL || [];

  let person = localStorage.getItem(KEY_PERSON) || '';
  let svar = {};
  let idx = 0;

  function personObj(slug) { return personer.find(p => p.slug === slug) || null; }

  function init() {
    renderVelg();
    if (personObj(person)) startSkjema();
  }

  function renderVelg() {
    let h = '';
    personer.forEach(p => {
      h += `<div class="velg-knapp" onclick="FL.velgPerson('${p.slug}')">
        <span class="emoji">${p.emoji}</span>
        <span class="navn">${esc(p.navn)}</span>
        <span class="velg-side">${esc(p.side)}</span>
      </div>`;
    });
    document.getElementById('velg-knapper').innerHTML = h;
  }

  function velgPerson(slug) {
    if (!personObj(slug)) return;
    person = slug;
    localStorage.setItem(KEY_PERSON, slug);
    startSkjema();
  }

  function byttPerson() {
    localStorage.removeItem(KEY_PERSON);
    person = ''; svar = {}; idx = 0;
    vis('velg');
  }

  async function startSkjema() {
    const p = personObj(person);
    document.getElementById('person-navn').textContent = p ? p.navn : person;
    vis('skjema');
    await hentSvar();
    idx = 0;
    renderSeksjon();
  }

  async function hentSvar() {
    setStatus('Henter svarene dine…', '');
    try {
      const res = await fetch(`${API}?person=${encodeURIComponent(person)}`, { cache: 'no-store' });
      if (res.ok) { const d = await res.json(); svar = (d && d.svar) ? d.svar : {}; }
    } catch (_) {}
    setStatus('', '');
  }

  function renderSeksjon() {
    const sek = seksjoner[idx];
    if (!sek) return;
    oppdaterFremdrift();

    let h = `<div class="seksjon-tittel">${sek.ikon || ''} ${esc(sek.seksjon)}</div>`;
    if (sek.intro) h += `<div class="seksjon-intro">${esc(sek.intro)}</div>`;

    sek.sporsmal.forEach(sp => {
      const verdi = svar[sp.id] != null ? svar[sp.id] : '';
      h += '<div class="sp">';
      h += `<div class="sp-tittel">${esc(sp.tittel)}</div>`;
      if (sp.hjelp) h += `<div class="sp-hjelp">${esc(sp.hjelp)}</div>`;

      if (Array.isArray(sp.forslag) && sp.forslag.length) {
        h += '<div class="chips">';
        sp.forslag.forEach(f => {
          const aktiv = verdi && verdi === f.trim() ? ' aktiv' : '';
          h += `<button type="button" class="chip${aktiv}" data-for="${sp.id}" onclick="FL.velgChip('${sp.id}', this)">${esc(f.trim())}</button>`;
        });
        h += '</div>';
      }

      if (sp.type === 'lang') {
        h += `<textarea id="felt-${sp.id}" data-id="${sp.id}" placeholder="Skriv her…">${esc(verdi)}</textarea>`;
      } else {
        h += `<input id="felt-${sp.id}" data-id="${sp.id}" type="text" value="${esc(verdi)}" placeholder="Skriv her…" />`;
      }
      h += '</div>';
    });

    document.getElementById('seksjon').innerHTML = h;
    document.getElementById('forrige').disabled = idx === 0;
    document.getElementById('neste').textContent =
      idx === seksjoner.length - 1 ? 'Lagre og fullfør ✓' : 'Lagre og fortsett →';
    setStatus('', '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function velgChip(id, el) {
    const felt = document.getElementById('felt-' + id);
    if (felt) felt.value = el.textContent;
    document.querySelectorAll(`.chip[data-for="${cssEsc(id)}"]`).forEach(c => c.classList.remove('aktiv'));
    el.classList.add('aktiv');
  }

  function oppdaterFremdrift() {
    const totalt = seksjoner.reduce((n, s) => n + s.sporsmal.length, 0);
    const besvart = Object.keys(svar).filter(k => (svar[k] || '').toString().trim() !== '').length;
    const pst = totalt ? Math.round((besvart / totalt) * 100) : 0;
    document.getElementById('fremdrift-fyll').style.width = pst + '%';
    document.getElementById('fremdrift-seksjon').textContent = `Seksjon ${idx + 1} av ${seksjoner.length}`;
    document.getElementById('fremdrift-prosent').textContent = `${besvart}/${totalt} besvart`;
  }

  function lesFelter() {
    const endret = {};
    document.querySelectorAll('#seksjon [data-id]').forEach(el => {
      const id = el.getAttribute('data-id');
      const v = el.value.trim();
      if (v !== (svar[id] || '')) { endret[id] = v; svar[id] = v; }
    });
    return endret;
  }

  async function lagre(endret) {
    if (!Object.keys(endret).length) return true;
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ person, svar: endret })
      });
      return res.ok;
    } catch (_) { return false; }
  }

  async function neste() {
    const knapp = document.getElementById('neste');
    knapp.disabled = true;
    setStatus('Lagrer…', '');
    const ok = await lagre(lesFelter());
    knapp.disabled = false;
    if (!ok) { setStatus('Kunne ikke lagre nå (er du på nett?). Prøv igjen.', 'feil'); return; }
    if (idx < seksjoner.length - 1) { idx++; renderSeksjon(); }
    else { vis('ferdig'); window.scrollTo({ top: 0 }); }
  }

  async function forrige() {
    if (idx === 0) return;
    await lagre(lesFelter());
    idx--; renderSeksjon();
  }

  function startPaNytt() { idx = 0; vis('skjema'); renderSeksjon(); }

  function vis(hvilken) {
    ['velg', 'skjema', 'ferdig'].forEach(s => {
      document.getElementById(s).classList.toggle('skjult', s !== hvilken);
    });
  }
  function setStatus(tekst, type) {
    const el = document.getElementById('status');
    el.textContent = tekst;
    el.className = 'status' + (type ? ' ' + type : '');
  }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function cssEsc(s) { return String(s).replace(/"/g, '\\"'); }

  document.addEventListener('DOMContentLoaded', init);
  return { velgPerson, byttPerson, velgChip, neste, forrige, startPaNytt };
})();
