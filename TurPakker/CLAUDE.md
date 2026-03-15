# TurPakker

Ski trip packing planner with Microsoft To Do integration.

## Stack
- Vanilla HTML/CSS/JS (no build step)
- MSAL.js 2.x (CDN) for Microsoft auth
- Microsoft Graph API for To Do sync
- Yr.no API for weather forecasts
- LocalStorage for persistence

## Files
- `index.html` - Main app entry
- `style.css` - Winter/mountain theme styling
- `app.js` - Main app logic, navigation, UI orchestration
- `auth.js` - MSAL authentication flow
- `todo-api.js` - Microsoft Graph To Do API wrapper
- `packing-lists.js` - Pre-built Norwegian ski packing templates
- `trip-planner.js` - Trip configuration and smart list generation
- `weather.js` - Yr.no weather integration and suggestions

## Setup
1. Register an Azure AD app at https://portal.azure.com
2. Set redirect URI to your hosting URL
3. Update `CLIENT_ID` in `auth.js`
4. Open `index.html` in browser

## APIs
- Microsoft Graph: `https://graph.microsoft.com/v1.0/me/todo/lists`
- Yr.no: `https://api.met.no/weatherapi/locationforecast/2.0/compact`
