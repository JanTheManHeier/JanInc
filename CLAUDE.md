# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

Monorepo containing multiple independent projects, hosted at **https://janinc.no**.

**Remote:** https://github.com/JanTheManHeier/JanInc.git
**Live site:** https://janinc.no

## Hosting & Deployment Architecture

### How it works (end-to-end)

```
Local (C:\JanInc)  →  git push  →  GitHub (JanTheManHeier/JanInc)  →  GitHub Actions  →  Azure Static Web Apps  →  janinc.no
```

1. **Local development:** Edit files in `C:\JanInc`
2. **Push to GitHub:** `git push origin main` triggers auto-deploy
3. **GitHub Actions** (`.github/workflows/azure-static-web-apps-kind-smoke-0bde8c903.yml`) builds and deploys to Azure
4. **Azure Static Web Apps** (Free tier) serves the site globally with SSL
5. **Custom domain** `janinc.no` points to the Azure app via DNS (A record + TXT validation at Domeneshop)

### Key details

| Component | Detail |
|-----------|--------|
| **GitHub account** | `JanTheManHeier` (personal) |
| **GitHub repo** | `JanTheManHeier/JanInc` (public) |
| **Azure subscription** | Visual Studio Enterprise (`3c6fea4e-0c72-4c30-b816-08bbfc002924`) via `janhj@hotmail.com` |
| **Azure resource group** | `rg-janinc` (West Europe) |
| **Azure Static Web App** | `janinc-site` |
| **Azure auto-deploy URL** | `https://kind-smoke-0bde8c903.1.azurestaticapps.net` |
| **Custom domain** | `https://janinc.no` (DNS at Domeneshop, registrar Norid) |
| **Deploy trigger** | Push to `main` branch → GitHub Actions → Azure |
| **Auth (if needed)** | Configure `staticwebapp.config.json` for route-level auth via Microsoft Entra ID |

### Adding a new project to the site

To add a new app/page accessible at `janinc.no/myproject/`:

1. Create folder: `mkdir C:\JanInc\myproject`
2. Add your files (at minimum `index.html`)
3. Commit and push:
   ```bash
   cd C:\JanInc
   git add myproject/
   git commit -m "Add myproject"
   git push origin main
   ```
4. The app will be live at `https://janinc.no/myproject/` within ~2 minutes

### Making pages private (password-protected)

Create `staticwebapp.config.json` in the repo root:
```json
{
  "routes": [
    {
      "route": "/private/*",
      "allowedRoles": ["authenticated"]
    }
  ],
  "responseOverrides": {
    "401": {
      "redirect": "/.auth/login/aad",
      "statusCode": 302
    }
  }
}
```
Users will be prompted to log in with a Microsoft account.

### Important constraints

- **Max file size** — GitHub rejects files >100 MB. Use `.gitignore` for large files (videos, datasets)
- **Storage limit** — 250 MB per app on the free tier
- **.gitignore** is set up to exclude `node_modules/`, `.env`, `__pycache__/`, `.claude/`, `temp/`

### Database: Azure SQL Database (Free tier)

| Component | Detail |
|-----------|--------|
| **Server** | `janinc-db-server.database.windows.net` |
| **Database** | `janinc-db` |
| **Region** | North Europe |
| **Tier** | Free (32 GB, auto-pause after 60 min idle) |
| **Admin user** | `janincadmin` |
| **Connection string** | Stored as `DATABASE_CONNECTION_STRING` app setting in Azure (never in code) |

### API: Azure Functions (built into Static Web Apps)

API code lives in the `api/` folder. Each function is a subfolder with `function.json` + `index.js`.

```
api/
├── host.json              — Azure Functions runtime config
├── package.json           — Dependencies (tedious for SQL)
├── shared/
│   └── db.js              — Database helper (getConnection, executeQuery)
└── health/
    ├── function.json      — HTTP trigger config
    └── index.js           — Health check endpoint
```

- **Health check:** `GET https://janinc.no/api/health` — returns DB connectivity status
- **Adding a new API endpoint:**
  1. Create folder: `api/myendpoint/`
  2. Add `function.json` (HTTP trigger config)
  3. Add `index.js` (handler using `../shared/db.js`)
  4. Commit and push — auto-deploys

**Example: Creating a new API function**
```js
// api/myendpoint/index.js
const { getConnection, executeQuery, TYPES } = require('../shared/db');

module.exports = async function (context, req) {
    const connection = await getConnection();
    const rows = await executeQuery(connection, 'SELECT * FROM MyTable');
    connection.close();
    context.res = { status: 200, body: rows };
};
```

## Site Structure

| URL path | Local folder | What it is |
|----------|-------------|------------|
| `/` | `index.html` | Futuristic "JanInc" landing page (dark, neural network particles, neon glow) |
| `/mychoice/` | `mychoice/` | My Choice — bilingual cravings management PWA |

## Root: Landing Page

Standalone `index.html` with inline CSS/JS. Dark theme with animated neural network particles and "JANINC" logo in Orbitron font with cyan neon glow. No dependencies.

## My Choice PWA (`mychoice/`)

Vanilla JS/HTML/CSS Progressive Web App with bilingual support (EN/NO). No build step — edit files directly.

- `mychoice/index.html` — main app entry
- `mychoice/script.js` — core logic (tips, translations, localStorage favorites)
- `mychoice/style.css` — styling (green theme #4CAF50, Inter font)
- `mychoice/manifest.json` — PWA manifest

## Sub-Projects

Each has its own CLAUDE.md with detailed instructions:

| Project | Path | Stack | Purpose |
|---------|------|-------|---------|
| Escape Room Modern | `AE - Current/escape-room-modern/` | Next.js 16 + Socket.IO + Prisma + PostgreSQL | Real-time escape room management |
| Escape Room v1.3 | `AE - Current/EscapeRoomv1.3/` | Express + Socket.IO 1.x + jQuery | Legacy escape room (deprecated) |
| MyAssistant | `MyAssistant/` | TypeScript + Claude Agent SDK + MCP + Playwright | Autonomous Teams auto-reply agent |
| Prompting | `Prompting/` | Node.js + Playwright CDP | Teams automation tools |
| SearchExt | `Prompting/SearchExt/` | C# / .NET 8 / MSBuild | M365 search extension services |
| randonee-overlay | `randonee-overlay/` | Tampermonkey userscript | GPX track overlay on topptur.guide |
| PDHResearcher | `PDHResearcher/` | Python 3 + SQLite | PhD research manuscript analysis |
| NorskSkatt | `NorskSkatt/` | Vanilla JS/HTML/CSS | Norwegian tax return helper (stock sales, FIFO, RF-1159) |
| SmartHandel | `SmartHandel/` | Vanilla JS/HTML/CSS + MSAL.js + IndexedDB | Smart grocery shopping with MS To Do integration |
| TurPakker | `TurPakker/` | Vanilla JS/HTML/CSS + MSAL.js + Yr.no API | Ski trip packing planner with MS To Do & weather |

## Key Commands by Project

### Escape Room Modern (`AE - Current/escape-room-modern/`)
```bash
npm run dev              # Dev server (ts-node server.ts, port 3000)
npm run build            # Next.js production build
npm run test             # Vitest
npm run test:coverage    # Coverage report
npm run lint             # ESLint
npm run prisma:migrate   # Run DB migrations
npm run prisma:generate  # Generate Prisma client
```
Requires `DATABASE_URL` and `SESSION_SECRET` in `.env.local`.

### MyAssistant (`MyAssistant/`)
```bash
npm run agent            # Start polling loop
npm test                 # Vitest
npm run teams:read       # Read unread Teams messages
npm run teams:send       # Send Teams message
```
Requires Edge with `--remote-debugging-port=9222` and `ANTHROPIC_API_KEY` in `.env`.

### randonee-overlay (`randonee-overlay/`)
```bash
node scripts/convert-gpx.js   # Convert GPX files to embedded coords
npm start                      # Dev server on port 3456
```

### PDHResearcher (`PDHResearcher/`)
```bash
pip install -r requirements.txt
python generate_andersen.py    # Main evidence synthesis
python find_gaps.py            # Gap analysis
```

### NorskSkatt (`NorskSkatt/`)
No build step — open `index.html` in browser. All processing client-side.

### SmartHandel (`SmartHandel/`)
No build step — open `index.html` for offline features. For To Do integration, serve via `npx serve .` and configure Azure AD Client ID in Settings.

### TurPakker (`TurPakker/`)
No build step — open `index.html` in browser. For To Do integration, serve via `npx serve .` and configure Azure AD Client ID in Settings.

## Architecture Notes

- **Escape Room Modern** uses a custom `server.ts` (not standard Next.js dev server) because of Windows symlink permission issues with Turbopack. Socket.IO is integrated into the same HTTP server.
- **MyAssistant** uses a 30-second polling loop with MCP tools, connecting to Teams via persistent Playwright CDP sessions (`lib/teams-fast.js`).
- **randonee-overlay** intercepts `L.Map.prototype.initialize` at document-start to capture the Leaflet map instance before the page loads.
