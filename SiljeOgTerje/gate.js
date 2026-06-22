/* Enkel "under arbeid"-portvakt for bryllupsappen.
   Passord huskes i browseren (localStorage). Unntatt: spørreundersøkelser + RSVP.
   NB: Dette er en enkel sperre for å holde siden privat mens den bygges,
   ikke ekte sikkerhet (faktiske admin-handlinger er beskyttet av ADMIN_KEY på serveren). */
(function () {
  var KEY = 'siljeterje-tilgang';
  var PASS = 'Silje&Terje';
  try {
    if (localStorage.getItem(KEY) === '1') return; // allerede logget inn
  } catch (_) { /* localStorage utilgjengelig – vis sperre likevel */ }

  function lagOverlay() {
    var o = document.createElement('div');
    o.id = 'tilgang-overlay';
    o.style.cssText = [
      'position:fixed', 'inset:0', 'z-index:2147483647',
      'background:linear-gradient(160deg,#FAF6EE 0%,#F3E9D6 100%)',
      'color:#1A2C3F', 'display:flex', 'align-items:center', 'justify-content:center',
      'font-family:Georgia,\'Times New Roman\',serif', 'padding:24px', 'box-sizing:border-box'
    ].join(';');
    o.innerHTML =
      '<div style="max-width:420px;width:100%;text-align:center;background:#fff;border:1px solid #E6D6B0;border-radius:18px;padding:40px 28px;box-shadow:0 20px 60px rgba(120,90,30,.18)">' +
        '<div style="font-size:46px;margin-bottom:8px">💍</div>' +
        '<h1 style="margin:0 0 6px;font-size:24px;letter-spacing:1px;color:#1A2C3F">Silje &amp; Terje</h1>' +
        '<div style="color:#B8912E;font-weight:bold;letter-spacing:2px;text-transform:uppercase;font-size:13px;margin-bottom:18px">🚧 Under arbeid</div>' +
        '<p style="margin:0 0 18px;color:#5a5142;font-size:15px;line-height:1.5">Denne siden er ikke helt klar ennå.<br>Skriv inn passordet for å se forhåndsvisningen.</p>' +
        '<input id="tilgang-pass" type="password" placeholder="Passord" autocomplete="off" ' +
          'autocapitalize="none" autocorrect="off" spellcheck="false" ' +
          'style="width:100%;box-sizing:border-box;padding:13px 14px;font-size:16px;border:1px solid #D9C48E;border-radius:10px;outline:none;margin-bottom:10px;font-family:inherit">' +
        '<div id="tilgang-feil" style="color:#b53b3b;font-size:13px;min-height:18px;margin-bottom:10px"></div>' +
        '<button id="tilgang-knapp" style="width:100%;padding:13px;font-size:16px;font-weight:bold;color:#fff;background:linear-gradient(135deg,#C9A24B,#B8912E);border:none;border-radius:10px;cursor:pointer;font-family:inherit">Logg inn</button>' +
      '</div>';
    return o;
  }

  function init() {
    var o = lagOverlay();
    document.documentElement.appendChild(o);
    var prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    var input = document.getElementById('tilgang-pass');
    var feil = document.getElementById('tilgang-feil');
    var knapp = document.getElementById('tilgang-knapp');

    function provLogin() {
      var inn = (input.value || '').trim();
      if (inn.toLowerCase() === PASS.toLowerCase()) {
        try { localStorage.setItem(KEY, '1'); } catch (_) {}
        document.documentElement.style.overflow = prevOverflow;
        o.parentNode && o.parentNode.removeChild(o);
      } else {
        feil.textContent = 'Feil passord. Prøv igjen.';
        input.value = '';
        input.focus();
      }
    }
    knapp.addEventListener('click', provLogin);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') provLogin(); });
    input.focus();
  }

  if (document.documentElement) {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
