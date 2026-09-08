# Al Firdaus Website

Public-facing website for Al Firdaus Institute & Mosque, Dar es Salaam. Plain HTML, CSS, and JavaScript with no build step — simple to develop, easy to deploy.

## Quick Start

```bash
# Clone repository
git clone https://github.com/Denis-Kingston/al-firdaus-website.git
cd al-firdaus-website

# Start local development server (any of these work)
python -m http.server 3000
# or
http-server -p 3000
# or use VS Code Live Server extension

# Open browser
open http://localhost:3000
```

## Project Structure

```
al-firdaus-website/
├── index.html              # Home page
├── about.html              # About mosque & history
├── prayer-times.html       # Prayer times (fetched from API)
├── qibla-finder.html       # Find prayer direction
├── zakat-calculator.html   # Zakat calculation tool
├── learning.html           # Islamic resources & materials
├── events.html             # Mosque events calendar
├── khutbahs.html           # Sermon archive
├── announcements.html      # Community announcements
├── donate.html             # Donation/contribution page
├── css/
│   ├── style.css           # Main stylesheet
│   ├── responsive.css      # Mobile responsiveness
│   └── theme.css           # Color & branding
├── js/
│   ├── main.js             # API client & utility functions
│   ├── qibla.js            # Qibla calculation logic
│   ├── zakat.js            # Zakat calculator
│   └── pwa.js              # Service worker registration
├── images/
│   ├── logo.png            # Mosque logo
│   ├── gallery/            # Photo gallery
│   └── icons/              # UI icons
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker for offline support
└── README.md               # This file
```

## Features

### 1. Prayer Times Display
- Fetches from backend API at `/api/prayer-times/`
- Shows Fajr, Dhuhr, Asr, Maghrib, Isha
- Auto-updates daily
- Displays in both English and Swahili

```javascript
// In main.js, prayer times are fetched like:
fetch(`${API_BASE}/prayer-times/`)
  .then(r => r.json())
  .then(data => renderPrayerTimes(data))
```

### 2. Qibla Finder
- Uses browser geolocation API
- Calculates compass direction to Mecca
- Shows on map with distance
- Works offline after first load

### 3. Zakat Calculator
- Client-side calculation (no API call needed)
- Supports multiple asset types (gold, silver, cash, etc.)
- Uses current Islamic Nisab values
- Offline capable

### 4. Events Calendar
- Fetches events from `/api/events/`
- Shows mosque activities, programs, and celebrations
- RSVP button integrated
- Calendar view with dates and times

### 5. Khutbah Archive
- Browse past sermons
- Filter by date range
- Read summaries or full text
- Loaded from `/api/khutbahs/`

### 6. Announcements Feed
- Latest updates and notices
- Fetched from `/api/announcements/`
- Timestamped and categorized

### 7. Donations
- Integration with Selcom payment gateway
- Secure payment processing
- Receipt generation (PDF)

### 8. Language Toggle
- English ↔ Swahili switching
- Persisted in browser localStorage
- All text dynamically updated

### 9. Progressive Web App (PWA)
- Installable on mobile home screen
- Offline functionality via Service Worker
- Works with poor network connection

## Configuration

### Set Backend API URL

Edit `js/main.js` and update the `API_BASE` constant:

```javascript
// Development
const API_BASE = 'http://localhost:8000/api';

// Production (update during deployment)
const API_BASE = 'https://your-production-api.onrender.com/api';
```

### Customize Branding

Edit `css/theme.css`:
```css
:root {
  --primary-color: #2c5aa0;      /* Main mosque color */
  --secondary-color: #d4af37;    /* Accent (gold) */
  --text-color: #333;
  --background-color: #fff;
}
```

## Local Development

### Prerequisites
- Any modern web browser (Chrome, Firefox, Safari, Edge)
- Text editor (VS Code recommended)
- Git

### Setup Steps

1. Clone repository
```bash
git clone https://github.com/Denis-Kingston/al-firdaus-website.git
cd al-firdaus-website
```

2. Start web server
```bash
python -m http.server 3000
# Website available at http://localhost:3000
```

3. Make backend available
- Ensure Django backend is running on `http://localhost:8000`
- Or update `API_BASE` in main.js to point to existing backend

### Testing Checklist

Before pushing changes:

- [ ] All pages load without errors
- [ ] Prayer times display correctly
- [ ] Qibla finder works (request location permission)
- [ ] Zakat calculator produces correct amounts
- [ ] Events load from API
- [ ] Language toggle switches all text
- [ ] Mobile responsive (test in DevTools device mode)
- [ ] Service worker registered (Application tab in DevTools)
- [ ] No console errors (F12 → Console)

## Deployment

### Deploy to Cloudflare Pages

1. Push to GitHub
```bash
git push origin main
```

2. Connect repository to Cloudflare
   - Go to [pages.cloudflare.com](https://pages.cloudflare.com)
   - Click "Create Project" → "Connect to Git"
   - Select this repository
   - Keep build settings empty (static site)
   - Deploy

3. Update backend URL
   - After live, edit `js/main.js`
   - Change `API_BASE` to production backend URL
   - Push to trigger auto-redeploy

## API Integration

### Prayer Times

```javascript
const response = await fetch(`${API_BASE}/prayer-times/`);
const times = await response.json();
document.getElementById('fajr-time').textContent = times.fajr;
```

### Events

```javascript
const response = await fetch(`${API_BASE}/events/`);
const events = await response.json();
events.forEach(event => renderEvent(event));
```

### Donations

```javascript
const donation = {
  amount: 50000,  // in shillings
  donor_name: "John Doe",
  donor_email: "john@example.com",
  payment_method: "selcom"
};

const response = await fetch(`${API_BASE}/donations/`, {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify(donation)
});
```

## Troubleshooting

### Prayer Times Don't Load
- Check DevTools Console (F12) for CORS errors
- Verify backend is running and `API_BASE` is correct
- Ensure backend `CORS_ALLOWED_ORIGINS` includes website URL

### Qibla Finder Shows Error
- Check browser geolocation permission
- Some browsers require HTTPS (except localhost)
- Test in incognito mode if permission cached

### Offline Not Working
- Check Service Worker in DevTools → Application
- Clear browser cache (Application → Clear storage)
- Refresh page

### Layout Broken on Mobile
- Check viewport meta tag in HTML
- Test in DevTools device mode
- Verify CSS media queries in responsive.css

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Android)

## Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/awesome-feature`
3. Make changes and test
4. Commit: `git commit -m "Add awesome feature"`
5. Push: `git push origin feature/awesome-feature`
6. Create Pull Request

## Support & Issues

For bugs, questions, or suggestions:
- Create an issue on GitHub
- Contact: deogratiusdiu123@gmail.com

---

**Last Updated:** September 2026  
**Maintained by:** SoftNet Technologies Limited
