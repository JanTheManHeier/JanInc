/* Enkel "under arbeid"-portvakt for bryllupsappen.
   Passord huskes i browseren (localStorage). Unntatt: spørreundersøkelser + RSVP.
   NB: Dette er en enkel sperre for å holde siden privat mens den bygges,
   ikke ekte sikkerhet (faktiske admin-handlinger er beskyttet av ADMIN_KEY på serveren). */
(function () {
  var KEY = 'siljeterje-tilgang';
  var PASS = 'Silje&Terje';
  var script = document.currentScript;
  var offentligSide = !!(script && script.hasAttribute('data-public-page'));
  try {
    if (localStorage.getItem(KEY) === '1') return; // allerede logget inn
  } catch (_) { /* localStorage utilgjengelig – vis sperre likevel */ }

  function lagOverlay(laster) {
    var o = document.createElement('div');
    o.id = 'tilgang-overlay';
    o.style.cssText = [
      'position:fixed', 'inset:0', 'z-index:2147483647',
      'background:linear-gradient(160deg,#FCF5F0 0%,#F6E7EC 100%)',
      'color:#5E3A62', 'display:flex', 'align-items:center', 'justify-content:center',
      'font-family:Georgia,\'Times New Roman\',serif', 'padding:24px', 'box-sizing:border-box'
    ].join(';');
    o.innerHTML =
      '<div style="max-width:420px;width:100%;text-align:center;background:#fff;border:1px solid #EBD2D6;border-radius:18px;padding:40px 28px;box-shadow:0 20px 60px rgba(107,65,114,.18)">' +
        '<div style="font-size:46px;margin-bottom:8px">💍</div>' +
        '<h1 style="margin:0 0 6px;font-size:24px;letter-spacing:1px;color:#5E3A62">Silje &amp; Terje</h1>' +
        '<div id="tilgang-innhold">' +
          (laster
            ? '<p style="margin:18px 0 0;color:#4A3A4E;font-size:15px;line-height:1.5">Åpner bryllupssiden…</p>'
            : loginHtml()) +
        '</div>' +
      '</div>';
    return o;
  }

  function loginHtml() {
    return '<div style="color:#C4737E;font-weight:bold;letter-spacing:2px;text-transform:uppercase;font-size:13px;margin-bottom:18px">🚧 Under arbeid</div>' +
      '<p style="margin:0 0 18px;color:#4A3A4E;font-size:15px;line-height:1.5">Denne siden er ikke helt klar ennå.<br>Skriv inn passordet for å se forhåndsvisningen.</p>' +
      '<input id="tilgang-pass" type="password" placeholder="Passord" autocomplete="off" ' +
        'autocapitalize="none" autocorrect="off" spellcheck="false" ' +
        'style="width:100%;box-sizing:border-box;padding:13px 14px;font-size:16px;border:1px solid #E3BFC5;border-radius:10px;outline:none;margin-bottom:10px;font-family:inherit">' +
      '<div id="tilgang-feil" style="color:#b53b3b;font-size:13px;min-height:18px;margin-bottom:10px"></div>' +
      '<button id="tilgang-knapp" style="width:100%;padding:13px;font-size:16px;font-weight:bold;color:#fff;background:linear-gradient(135deg,#C4737E,#A04E5C);border:none;border-radius:10px;cursor:pointer;font-family:inherit">Logg inn</button>';
  }

  function aktiverLogin(o, prevOverflow) {
    var innhold = document.getElementById('tilgang-innhold');
    innhold.innerHTML = loginHtml();
    document.documentElement.appendChild(o);
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
    input.addEventListener('keydown', function (e) {
      e.stopPropagation();
      if (e.key === 'Enter') provLogin();
    });
    // hindre at globale tastatur-handlere i appen sluker tegn (f.eks. spillkontroller)
    ['keypress', 'keyup'].forEach(function (evt) {
      input.addEventListener(evt, function (e) { e.stopPropagation(); });
    });
    input.focus();
  }

  function init() {
    var o = lagOverlay(offentligSide);
    document.documentElement.appendChild(o);
    var prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';

    if (!offentligSide) {
      aktiverLogin(o, prevOverflow);
      return;
    }

    fetch('/api/siljeterje-content', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        var innstillinger = data && data.content && data.content.innstillinger;
        if (innstillinger && innstillinger.passordbeskyttelse === false) {
          document.documentElement.style.overflow = prevOverflow;
          o.parentNode && o.parentNode.removeChild(o);
          return;
        }
        aktiverLogin(o, prevOverflow);
      })
      .catch(function () {
        aktiverLogin(o, prevOverflow);
      });
  }

  if (document.documentElement) {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
