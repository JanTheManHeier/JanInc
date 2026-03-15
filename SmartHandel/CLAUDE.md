# SmartHandel

Smart grocery shopping app connected to Microsoft To Do.

## Stack
- Vanilla HTML/CSS/JavaScript (no build step)
- MSAL.js 2.x for Microsoft authentication (CDN)
- Microsoft Graph API for To Do list integration
- IndexedDB for local data storage

## Running
Open `index.html` in a browser. For MSAL authentication (To Do integration), serve via a local web server:
```bash
npx serve .        # or python -m http.server 8000
```

## Configuration
1. Create an Azure AD app registration at https://portal.azure.com
2. Add redirect URI matching your dev server (e.g., `http://localhost:3000`)
3. Add API permission: Microsoft Graph > Delegated > `Tasks.ReadWrite`
4. Copy the Application (Client) ID
5. Paste it in the app's Settings tab

## File Structure
| File | Purpose |
|------|---------|
| `index.html` | Main app entry, all HTML structure |
| `style.css` | Complete styling (green/orange theme) |
| `app.js` | Main app logic, navigation, UI orchestration |
| `auth.js` | MSAL authentication setup and token management |
| `todo-api.js` | Microsoft Graph To Do API wrapper |
| `receipt-parser.js` | Norwegian grocery receipt text parsing |
| `pattern-engine.js` | Purchase frequency and meal pattern detection |
| `suggestions.js` | Smart shopping suggestion generator |
| `db.js` | IndexedDB storage layer with Norwegian grocery item database |

## Features
- **To Do Integration**: Read/write Microsoft To Do lists and tasks
- **Receipt Parsing**: Parse Norwegian grocery store receipts (REMA, KIWI, MENY, COOP, etc.)
- **Pattern Detection**: Track purchase frequency, detect meal groupings via co-occurrence analysis
- **Smart Suggestions**: Restock reminders, meal suggestions, weekly list generator
- **Offline**: Receipt parsing, pattern analysis, and local storage work without internet
- **Norwegian UI**: Full Norwegian interface with Norwegian grocery item categories

## Architecture Notes
- All data stored in IndexedDB (no server-side storage)
- Auth tokens managed by MSAL.js with localStorage cache
- Item categorization uses keyword matching against ~150 pre-seeded Norwegian grocery items
- Co-occurrence analysis groups items bought together on 2+ receipts as potential meals
- Scripts load in dependency order: db -> auth -> todo-api -> receipt-parser -> pattern-engine -> suggestions -> app
