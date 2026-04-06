# Luz do Dia

Luz do Dia is a mobile-first PWA for reading daylight quality, planning photography windows, and simulating scene conditions without any backend. The current version turns the app into a premium light observatory: goal-driven scoring, richer solar analysis, alert presets, a local Scene Lab, and more technical context for field decisions.

## Core product

- Briefing Now: current opportunity score for the active goal, phase of light, live reading, next best window, and a contextual action.
- Goal tabs: Golden, Portrait, Landscape, Long Exposure, and Night/Astro.
- 12h timeline: live or simulated opportunity curve with markers for now, sunrise, and sunset.
- Solar panel: solar arc, sunrise, sunset, solar noon, daylight duration, and key blue/golden windows.
- Pro metrics: softness, hard light, sky drama, short-term trend, and tripod risk.
- Alerts Center: local notifications by goal, threshold, lead time, sunset reminder, and low-light warning.
- Scene Lab: simulate local time, cloud cover, and weather code with all derived scores recalculated locally.
- Secondary insights: astro-lite moon read, today vs tomorrow comparison, packing hints, setup guidance, and technical weather details.

## Technical notes

- Stack: React 19 with Create React App (`react-scripts`).
- Styling: plain CSS, no component library, no paid APIs.
- Data sources:
  - Open-Meteo for forecast, current weather, hourly data, and sunrise/sunset.
  - Nominatim reverse geocoding for location naming.
  - Browser Geolocation for positioning.
- PWA/offline:
  - Service worker caches app shell assets with scope-safe relative paths.
  - External API responses are not cached by the service worker; offline fallback uses a minimized local weather snapshot instead.
  - Navigation falls back to cached app shell when offline.
- Persistence:
  - Language, active goal, Scene Lab, and alerts are stored locally.
  - Location persistence is reduced to coarse coordinates only, and weather persistence keeps a trimmed snapshot with short-lived retention for offline startup.

## App structure

- `src/App.js`: lightweight orchestrator for state, effects, weather fetch, derived data, and alert scheduling.
- `src/components/`: feature sections such as `UtilityBar`, `BriefingHero`, `TimelinePanel`, `SolarPanel`, `AlertsCenter`, and `SceneLab`.
- `src/lib/`: local heuristics and utilities for i18n, storage, solar phases, moon phase, weather catalog, formatting, and scoring.
- `public/sw.js`: offline cache and notification click handling.

## Scoring model

All scoring stays local and heuristic-based. The app combines:

- solar phase and relative sun position
- weather code profile
- cloud cover
- wind and precipitation probability
- moon illumination for astro-lite

These inputs produce a goal score plus supporting indices like softness, hard light, sky drama, and tripod need. The numbers are estimates, not measurements, but they are designed to be explainable and actionable.

## Run locally

```bash
npm install
npm start
```

Then open `http://localhost:3000`.

## Test

```bash
npm test -- --watchAll=false
```

## Production build

```bash
npm run build
```

## Deployment

- GitHub Pages is the current target.
- The service worker and manifest are configured to work from the app subpath.

## Limitations

- No backend means alerts only fire while the app is loaded and notifications are permitted.
- Moon and setup guidance are heuristic and intended as lightweight field support, not astronomical precision.# Luz do Dia

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
- Service Worker: caches static assets only and handles notification clicks to focus/open the app.
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
- Offline/PWA: once loaded, the app works offline with cached assets and a minimized last-known weather snapshot kept for short-lived fallback.
- Permissions: location and notifications are optional but improve accuracy and alert delivery.
