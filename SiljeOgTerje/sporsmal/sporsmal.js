// sporsmal.js — spørrerunde-logikk for brudeparet.
// Identifisering = bare navnevalg (Silje/Terje), lagret i localStorage.
// Personvern: vi henter KUN den innloggede personens egne svar fra API-et —
// aldri den andres — så private svar om partneren ikke kan leses fra denne enheten.
window.ST = (function () {
  const API = '/api/siljeterje-svar';
  const KEY_PERSON = 'siljeterje-person';
  const NAVN = { silje: 'Silje 👰', terje: 'Terje 🤵' };

  const seksjoner = window.SPORSMAL || [];
  let person = localStorage.getItem(KEY_PERSON) || '';
  let svar = {};        // { sporsmal_id: tekst } — kun denne personens svar
  let idx = 0;          // aktiv seksjon

  // ---------- Oppstart ----------
  function init() {
    if (person === 'silje' || person === 'terje') {
      startSkjema();
    } // ellers vises navnevalget (default i HTML)
  }

  function velgPerson(p) {
    person = p;
    localStorage.setItem(KEY_PERSON, p);
    startSkjema();
  }

  function byttPerson() {
    localStorage.removeItem(KEY_PERSON);
    person = '';
    svar = {};
    idx = 0;
    vis('velg');
  }

  async function startSkjema() {
    document.getElementById('person-navn').textContent = NAVN[person] || person;
    vis('skjema');
    await hentSvar();
    idx = 0;
    renderSeksjon();
  }

  async function hentSvar() {
    setStatus('Henter svarene dine…', '');
    try {
      const res = await fetch(`${API}?person=${encodeURIComponent(person)}`, { cache: 'no-store' });
      if (res.ok) {
        const d = await res.json();
        svar = (d && d.svar) ? d.svar : {};
      }
    } catch (_) { /* offline/lokal: start tomt */ }
    setStatus('', '');
  }

  // ---------- Rendring ----------
  function renderSeksjon() {
    const sek = seksjoner[idx];
    if (!sek) return;
    oppdaterFremdrift();

    let h = `<div class="seksjon-tittel">${sek.ikon || ''} ${esc(sek.seksjon)}</div>`;
    if (sek.intro) h += `<div class="seksjon-intro">${esc(sek.intro)}</div>`;

    sek.sporsmal.forEach(sp => {
      const verdi = svar[sp.id] != null ? svar[sp.id] : '';
      const privat = sp.synlighet === 'privat';
      h += `<div class="sp${privat ? ' privat' : ''}">`;
      h += `<div class="sp-tittel">${esc(sp.tittel)}${privat ? ' <span class="sp-laas">🔒 privat</span>' : ''}</div>`;
      if (sp.hjelp) h += `<div class="sp-hjelp">${esc(sp.hjelp)}</div>`;

      if (Array.isArray(sp.forslag) && sp.forslag.length) {
        h += '<div class="chips">';
        sp.forslag.forEach(f => {
          const aktiv = verdi && verdi === f ? ' aktiv' : '';
          h += `<button type="button" class="chip${aktiv}" data-for="${sp.id}" onclick="ST.velgChip('${sp.id}', this)">${esc(f)}</button>`;
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

  // For valg-type: chip = svaret. For fritekst med forslag: fyll feltet.
  function velgChip(id, el) {
    const felt = document.getElementById('felt-' + id);
    if (felt) felt.value = el.textContent;
    // marker aktiv chip i samme gruppe
    document.querySelectorAll(`.chip[data-for="${cssEsc(id)}"]`).forEach(c => c.classList.remove('aktiv'));
    el.classList.add('aktiv');
  }

  function oppdaterFremdrift() {
    const totalt = seksjoner.reduce((n, s) => n + s.sporsmal.length, 0);
    const besvart = Object.keys(svar).filter(k => (svar[k] || '').toString().trim() !== '').length;
    const pst = totalt ? Math.round((besvart / totalt) * 100) : 0;
    document.getElementById('fremdrift-fyll').style.width = pst + '%';
    document.getElementById('fremdrift-seksjon').textContent =
      `Seksjon ${idx + 1} av ${seksjoner.length}`;
    document.getElementById('fremdrift-prosent').textContent =
      `${besvart}/${totalt} besvart`;
  }

  // ---------- Lagring / navigasjon ----------
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
    } catch (_) {
      return false; // lokalt (404) — la brukeren fortsette uten å miste det de skrev
    }
  }

  async function neste() {
    const knapp = document.getElementById('neste');
    knapp.disabled = true;
    setStatus('Lagrer…', '');
    const ok = await lagre(lesFelter());
    knapp.disabled = false;
    if (!ok) {
      setStatus('Kunne ikke lagre nå (er du på nett?). Du kan prøve igjen.', 'feil');
      return;
    }
    if (idx < seksjoner.length - 1) {
      idx++;
      renderSeksjon();
    } else {
      vis('ferdig');
      window.scrollTo({ top: 0 });
    }
  }

  async function forrige() {
    if (idx === 0) return;
    await lagre(lesFelter()); // lagre stille før vi går tilbake
    idx--;
    renderSeksjon();
  }

  function startPaNytt() {
    idx = 0;
    vis('skjema');
    renderSeksjon();
  }

  // ---------- Hjelpere ----------
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
