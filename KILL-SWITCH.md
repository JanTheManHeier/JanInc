# 🛠️ Kill-switch — skru apper av/på fra mobilen

Denne guiden lar deg **skru av en app** (eller hele siden) på janinc.no direkte fra
**GitHub-appen på mobilen** – uten laptop. Endringen deployes automatisk til Azure på ~2 minutter.

Alt styres av fila **`staticwebapp.config.json`** i roten av repoet. Når du legger inn en
"av"-snutt, sendes appen til `/maintenance.html` (en pen "midlertidig stengt"-side) i stedet.

---

## ⚡ Raskeste nødbrems: Revert (bruk denne først)

Hvis en app slutter å virke **rett etter en endring/deploy**:

1. Åpne **GitHub-appen** → repo `JanInc` → fanen **Commits** (eller Pull requests)
2. Åpne den siste endringen → trykk **⋯ → Revert**
3. Bekreft. Auto-deploy ruller tilbake til forrige fungerende versjon på ~2 min.

Dette fikser de fleste "noe gikk galt"-tilfeller. For å slå av en app som tuller
**uavhengig** av deploys, bruk av/på-snuttene under.

---

## 🔧 Slik skrur du AV en app

1. GitHub-appen → repo `JanInc` → åpne **`staticwebapp.config.json`** → blyant-ikonet (Edit)
2. Finn linja helt øverst:
   ```json
   "routes": [
   ```
3. **Lim inn den aktuelle app-blokken rett under `"routes": [`** (se liste nedenfor)
4. Trykk **Commit changes** → velg "Commit directly to main"
5. Vent ~2 min. Appen viser nå vedlikeholdssiden.

## ✅ Slik skrur du appen PÅ igjen

- Rediger `staticwebapp.config.json` og **slett blokken du limte inn**, commit. ELLER
- **Revert** commit-en der du la den inn (GitHub-appen → Commits → Revert).

> Viktig: hver blokk MÅ ende med komma `,` så JSON-en forblir gyldig, siden det kommer
> flere routes under. Ikke fjern det som allerede står der.

---

## 📋 Av-snutter per app

Lim inn **én** av blokkene under rett etter `"routes": [`.

### GymTracker
```json
    { "route": "/GymTracker", "redirect": "/maintenance.html", "statusCode": 302 },
    { "route": "/GymTracker/*", "redirect": "/maintenance.html", "statusCode": 302 },
```

### Daltind
```json
    { "route": "/Daltind", "redirect": "/maintenance.html", "statusCode": 302 },
    { "route": "/Daltind/*", "redirect": "/maintenance.html", "statusCode": 302 },
```

### helmersen
```json
    { "route": "/helmersen", "redirect": "/maintenance.html", "statusCode": 302 },
    { "route": "/helmersen/*", "redirect": "/maintenance.html", "statusCode": 302 },
```

### babynavn-am
```json
    { "route": "/babynavn-am", "redirect": "/maintenance.html", "statusCode": 302 },
    { "route": "/babynavn-am/*", "redirect": "/maintenance.html", "statusCode": 302 },
```

### warszawa
```json
    { "route": "/warszawa", "redirect": "/maintenance.html", "statusCode": 302 },
    { "route": "/warszawa/*", "redirect": "/maintenance.html", "statusCode": 302 },
```

### babynavn
```json
    { "route": "/babynavn", "redirect": "/maintenance.html", "statusCode": 302 },
    { "route": "/babynavn/*", "redirect": "/maintenance.html", "statusCode": 302 },
```

### Jonna
```json
    { "route": "/Jonna", "redirect": "/maintenance.html", "statusCode": 302 },
    { "route": "/Jonna/*", "redirect": "/maintenance.html", "statusCode": 302 },
```

### dugnadsmamma
```json
    { "route": "/dugnadsmamma", "redirect": "/maintenance.html", "statusCode": 302 },
    { "route": "/dugnadsmamma/*", "redirect": "/maintenance.html", "statusCode": 302 },
```

### vitnemal
```json
    { "route": "/vitnemal", "redirect": "/maintenance.html", "statusCode": 302 },
    { "route": "/vitnemal/*", "redirect": "/maintenance.html", "statusCode": 302 },
```

### Johan
```json
    { "route": "/Johan", "redirect": "/maintenance.html", "statusCode": 302 },
    { "route": "/Johan/*", "redirect": "/maintenance.html", "statusCode": 302 },
```

### kjemi
```json
    { "route": "/kjemi", "redirect": "/maintenance.html", "statusCode": 302 },
    { "route": "/kjemi/*", "redirect": "/maintenance.html", "statusCode": 302 },
```

### TurPakker
```json
    { "route": "/TurPakker", "redirect": "/maintenance.html", "statusCode": 302 },
    { "route": "/TurPakker/*", "redirect": "/maintenance.html", "statusCode": 302 },
```

### mychoice
```json
    { "route": "/mychoice", "redirect": "/maintenance.html", "statusCode": 302 },
    { "route": "/mychoice/*", "redirect": "/maintenance.html", "statusCode": 302 },
```

### tipatopp
```json
    { "route": "/tipatopp", "redirect": "/maintenance.html", "statusCode": 302 },
    { "route": "/tipatopp/*", "redirect": "/maintenance.html", "statusCode": 302 },
```

### SpisSlank
```json
    { "route": "/SpisSlank", "redirect": "/maintenance.html", "statusCode": 302 },
    { "route": "/SpisSlank/*", "redirect": "/maintenance.html", "statusCode": 302 },
```

### sardinia
```json
    { "route": "/sardinia", "redirect": "/maintenance.html", "statusCode": 302 },
    { "route": "/sardinia/*", "redirect": "/maintenance.html", "statusCode": 302 },
```

### Thomas50
```json
    { "route": "/Thomas50", "redirect": "/maintenance.html", "statusCode": 302 },
    { "route": "/Thomas50/*", "redirect": "/maintenance.html", "statusCode": 302 },
```

### Silje
```json
    { "route": "/Silje", "redirect": "/maintenance.html", "statusCode": 302 },
    { "route": "/Silje/*", "redirect": "/maintenance.html", "statusCode": 302 },
```

### SiljeOgTerje
```json
    { "route": "/SiljeOgTerje", "redirect": "/maintenance.html", "statusCode": 302 },
    { "route": "/SiljeOgTerje/*", "redirect": "/maintenance.html", "statusCode": 302 },
```

### SmartHandel
```json
    { "route": "/SmartHandel", "redirect": "/maintenance.html", "statusCode": 302 },
    { "route": "/SmartHandel/*", "redirect": "/maintenance.html", "statusCode": 302 },
```

### randonee-overlay
```json
    { "route": "/randonee-overlay", "redirect": "/maintenance.html", "statusCode": 302 },
    { "route": "/randonee-overlay/*", "redirect": "/maintenance.html", "statusCode": 302 },
```

---

## 🚨 Skru av HELE siden

Lim inn disse TO linjene rett etter `"routes": [`. Den første sørger for at selve
vedlikeholdssiden fortsatt vises (unngår redirect-løkke), den andre sender alt annet dit:

```json
    { "route": "/maintenance.html" },
    { "route": "/*", "redirect": "/maintenance.html", "statusCode": 302 },
```

Slå på igjen: slett de to linjene / revert commit-en.

---

## 💡 Tips

- **API-et** (`/api/*`) er egne Azure Functions. En av-snutt for en app påvirker ikke API-et.
  Vil du stoppe API-et også, ta ned hele siden (over) eller stopp Static Web App i
  **Azure Portal** (portal.azure.com fungerer i mobilnettleser) → ressurs `janinc-site`.
- Endringer krever bare at commit-en går inn på `main`. GitHub Actions gjør resten.
- Sjekk deploy-status i GitHub-appen → fanen **Actions** hvis du vil se at det gikk grønt.
