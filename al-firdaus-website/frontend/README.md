# Al Firdaus Institute & Mosque — Website

Static public website (HTML/CSS/JS, no build step) for Al Firdaus Institute
& Mosque, Dar es Salaam. Deployed on Cloudflare Pages.

## Structure

```
.
├── index.html          Home
├── about.html          About the Institute
├── institute.html      Programs (Quran Tajweed, Islamic Studies, Arabic, Hifdh)
├── mosque.html          Prayer times, live countdown, Jumu'ah, live-stream placeholder
├── events.html          Upcoming/past events with RSVP
├── media.html           Photo gallery + khutbah audio archive
├── donate.html          Causes, amount picker, recurring toggle
├── contact.html         Contact form
├── qibla.html           Qibla direction finder
├── zakat.html           Zakat calculator
├── css/style.css        All styling — single stylesheet, CSS variables for the brand palette
├── js/main.js           All interactivity — nav, forms, prayer countdown, API calls
├── js/i18n.js           English/Swahili language toggle
├── manifest.json        PWA manifest
├── service-worker.js     PWA offline cache
└── icons/                PWA icons
```

## Running locally

No build step. Either:
```bash
python3 -m http.server 5500
```
then open `http://127.0.0.1:5500`, or just open `index.html` directly in a browser.

## Connecting to the backend

This site calls the [al-firdaus-backend](../al-firdaus-backend) Django API for
live prayer times, event RSVPs, donation causes, and the khutbah archive —
with a graceful fallback to demo content if the API isn't reachable.

**Before deploying**, set the real backend URL in `js/main.js`:
```js
const API_BASE = 'https://your-backend.onrender.com'; // or your custom domain
```
Everything else in the file reads from this one constant.

## Deployment

Deployed via Cloudflare Pages, connected directly to this repo — no build
command needed, output directory is the repo root. See
`Al_Firdaus_Complete_Build_Guide.md` Part 5 for the full walkthrough.

## Notes

- Swahili translations (`js/i18n.js`) are structurally complete but have not
  been reviewed by a native speaker — worth doing before public launch.
- Demo/placeholder content (gallery photos, bank account numbers, phone
  numbers) needs replacing with real details before launch.
