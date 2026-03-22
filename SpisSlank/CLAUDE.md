# SpisSlank — CLAUDE.md

## Overview
SpisSlank ("Eat yourself slim") is a bilingual (NO/EN) Progressive Web App that creates meal plans activating the same hormonal satiety pathways as weight-loss drugs (GLP-1, GIP, etc.) using ordinary grocery store food.

**Live:** https://janinc.no/SpisSlank/
**Stack:** Vanilla JS/HTML/CSS PWA — no build step, no framework

## Architecture

### Frontend (C:\JanInc\SpisSlank\)
| File | Purpose |
|------|---------|
| `index.html` | Main SPA with 5 views (Today, Week, Shopping, Science, Settings) |
| `pathways.js` | 8 pathway definitions, 7 drugs, ~25 foods with pathway scores |
| `meals.js` | ~49 meals with NO/EN translations, allergen/dietary tags, 4 weekly plans |
| `translations.js` | i18n system with `t(key)` helper, 111 keys in NO+EN |
| `api-client.js` | Device UUID, profile sync, usage tracking, plan sharing |
| `shopping.js` | Aggregated grocery list grouped by store section |
| `science.js` | Drug cards, pathway explainers, food arsenal table |
| `app.js` | Navigation, meal cards, radar chart, settings, onboarding, sharing |
| `style.css` | Dark theme, mobile-first, CSS custom properties |
| `sw.js` | Service worker (cache-first, stale-while-revalidate for fonts) |
| `manifest.json` | PWA manifest with shortcuts |

### Backend (C:\JanInc\api\spisslank-*)
Azure Functions using `shared/db.js` (Tedious → Azure SQL `janinc-db`):
- `spisslank-migrate` — Creates DB tables (one-time POST)
- `spisslank-profile` — PUT to upsert user profile
- `spisslank-profile-get` — GET profile by deviceId
- `spisslank-usage` — POST anonymous usage events
- `spisslank-share` — POST to create shareable plan snapshot (returns short code)
- `spisslank-plan` — GET shared plan by short code

### Data Flow
- **No auth** — device UUID in localStorage, synced to server fire-and-forget
- **Offline-first** — all data is client-side, API sync is optional
- **Shared plans** — read-only snapshots via short codes (e.g. `SLANK-A3F7`)

## Key Concepts

### Pathway System
8 hormonal pathways scored 0-5 per meal: GLP-1, GIP, Glucagon, Amylin, PYY, Leptin, Ghrelin↓, Insulin stability. Radar chart visualizes daily coverage.

### Meal Filtering
Users set dietary restrictions (vegetarian, vegan, lactose-free, gluten-free) and allergies (nuts, eggs, dairy, fish, shellfish, soy, gluten). Incompatible meals are auto-replaced with compatible alternatives maintaining pathway balance.

### i18n
`t('key')` returns translated string for current language. All UI strings use translation keys. Meal data has `nameEN`, `scienceNoteEN`, `instructionsEN`, ingredient `nameEN` fields.

## localStorage Keys
| Key | Content |
|-----|---------|
| `spisslank-profile` | User profile (name, language, dietary, allergies, mealFrequency) |
| `spisslank-currentWeek` | Active week index (0-3) |
| `spisslank-swaps` | Meal swap overrides |
| `spisslank-shoppingChecked` | Shopping list checkbox state |
| `spisslank-lastView` | Last visited view |
| `spisslank-language` | UI language (no/en) |
| `spisslank-deviceId` | UUID for API identification |
| `spisslank-onboarding-done` | Whether onboarding was shown |

## Commands
No build step — edit files directly. Push to `main` auto-deploys via GitHub Actions → Azure Static Web Apps.

To set up the database tables, call `POST /api/spisslank-migrate` once after deploy.
