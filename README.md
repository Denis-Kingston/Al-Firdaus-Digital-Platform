# Al Firdaus Digital Platform

Al Firdaus Institute & Mosque public website and Django API project for Dar es
Salaam.

## Repository status

The deployable static frontend is currently located at:

```text
al-firdaus-website/frontend/
```

The repository also contains a backend pointer at
`al-firdaus-website/al-firdaus-backend/backend`. It is currently stored as a
Git submodule entry, so the backend source must be available in that submodule
before a Django deployment can run. The root `manage.py` references
`config.settings`, but the corresponding `config/` package is not currently
present in this repository.

## Important issues before hosting

1. The frontend HTML references `css/style.css` and `icons/icon-192.png` / `icons/icon-512.png`, but those assets are not currently present in the tracked frontend tree. Add them before deployment.
2. Several navigation links reference `institute.html`, `mosque.html`, and `media.html`; these pages are also not currently tracked and will return 404s until added.
3. `manifest.json` must be valid JSON; it has been corrected.
4. The frontend JavaScript now defaults to same-origin API requests. For a separately hosted API, define `window.AL_FIRDAUS_API_BASE` before `js/main.js` loads.
5. Do not deploy with demo phone numbers, bank details, payment credentials, or `DEBUG=True`.

## Run the frontend locally

```bash
cd al-firdaus-website/frontend
python3 -m http.server 5500
```

Open <http://127.0.0.1:5500>.

## Hosting plan

- Host `al-firdaus-website/frontend` as a static site on Cloudflare Pages,
  Netlify, or GitHub Pages.
- Host the Django API separately on Render, Railway, or another Python host
  with PostgreSQL.
- Configure the API's production `ALLOWED_HOSTS`, CORS origins, HTTPS,
  `SECRET_KEY`, database URL, migrations, static files, and payment webhook
  URL before accepting donations.

The project validation workflow runs on pushes and pull requests to `main`.
