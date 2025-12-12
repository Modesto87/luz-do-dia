# Luz do Dia

Daylight companion PWA that helps you plan outdoor light, photography windows, and smart alerts. Runs fully in the browser (no backend) and works offline once loaded.

## What it does
- Shows current daylight conditions with a visual sky meter and estimated exterior light level.
- Displays sunrise/sunset times and remaining daylight.
- Hourly light forecast for the next ~12 hours (uses cloud cover + sun position).
- Photography goal mode (Golden hour, Portrait, Landscape, Long exposure) with tailored tips.
- Smart alerts: remind before sunset and when light drops below a threshold (with web notifications).
- Works as a PWA: offline cache, installable, notification click deep-link back to the app.
- Multi-language UI: Portuguese, English, French (selection is persisted locally).

## How it works
- Data sources: 
	- Weather and cloud cover from Open-Meteo API.
	- Reverse geocoding from Nominatim (OpenStreetMap) to name the current location.
	- Browser Geolocation to center the forecast (falls back to Lisbon coordinates if blocked).
- Service Worker: caches static assets and API responses; handles notification clicks to focus/open the app.
- Light estimate: combines sun elevation (time between sunrise/sunset) with cloud cover and weather code multipliers.
- Alerts: scheduled client-side in the main app; notifications are shown via the registered service worker when permission is granted.

## Running locally
```bash
npm install
npm start
```
Then open http://localhost:3000. Notifications require https or localhost.

Tests:
```bash
npm test -- --watchAll=false
```

Production build:
```bash
npm run build
```

## Deployment
- Auto-deployed to GitHub Pages from the `main` branch via GitHub Actions (`.github/workflows/deploy.yml`).
- Build uses Node 24 (npm 11) to match the lockfile; output is published to the `gh-pages` branch.

## Notes
- Offline/PWA: once loaded, the app works offline with cached assets and last-known API responses.
- Permissions: location and notifications are optional but improve accuracy and alert delivery.
