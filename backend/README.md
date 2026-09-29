# Al Firdaus Institute & Mosque — Backend

Django + Django REST Framework + PostgreSQL backend, with a branded custom
admin dashboard (donations analytics, receipts) sitting alongside the full
Django admin (used as the CRUD engine for everything else).

This has been built and tested end-to-end against a real PostgreSQL
database in the build environment — not just scaffolded.

## What's included

- **`accounts`** — custom User model with 5 RBAC roles (Super Admin, Content
  Editor, Finance Manager, Admissions, Viewer)
- **`auditlog`** — middleware + signals that automatically log every create /
  update / delete on content models, with who/when/what changed
- **`programs`** — Programs, class schedules, enrollments (drives the "Total
  Students" / "Active Courses" dashboard numbers)
- **`events`**, **`announcements`**, **`media_gallery`** — content for the
  public site, including **event RSVPs** (`/api/events/{id}/rsvp/` — idempotent
  per phone number) and a **khutbah audio archive** (`/api/khutbahs/`)
- **`prayertimes`** — **auto-calculated** daily prayer times for Dar es
  Salaam using the `adhanpy` library (no manual entry needed); a management
  command regenerates a rolling window of days
- **`donations`** — Causes + Donations, a provider-agnostic payment gateway
  abstraction (Selcom implemented, Azampay/ClickPesa can drop in later),
  webhook handling, **recurring donations** (`is_recurring` / `recurring_interval`
  fields), and **PDF receipt generation** (`reportlab`, no system dependencies)
- **`leads`** — contact / admissions enquiries
- **`dashboard`** — the custom-branded admin UI: **login with "remember me" and a
  full forgot-password flow** (email-based reset, console backend in dev),
  dashboard home (summary cards matching the original mockup), and a full
  donations analytics page (progress-by-cause bars, monthly trend chart, recent
  transactions with print-receipt / mark-completed actions) — **fully responsive**
  down to mobile (collapsing sidebar with a hamburger menu, stacking cards,
  horizontally-scrollable tables that stay contained within their own panel)

The public website (the static prototype delivered earlier) is meant to
call this backend's `/api/...` endpoints instead of using hardcoded data —
see `config/urls.py` for the full route list. The website prototype now
also includes an EN/Swahili language toggle, a Hijri calendar, a Zakat
calculator, a Qibla finder, a campaign-progress thermometer, event RSVPs,
a khutbah archive, a live-stream placeholder, and PWA install support —
several of these (RSVP, khutbah archive, recurring donations) call the
API endpoints above directly, with a graceful offline/demo fallback when
the backend isn't reachable.

## Local setup

1. **Install PostgreSQL** and create a database + user:
   ```sql
   CREATE USER alfirdaus WITH PASSWORD 'choose-a-real-password';
   CREATE DATABASE alfirdaus_db OWNER alfirdaus;
   ```

2. **Create a virtual environment and install dependencies:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # edit .env with your real DB password and (later) Selcom credentials
   ```

4. **Run migrations and create an admin user:**
   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```

5. **Generate prayer times** (run this once, then schedule it monthly via cron
   or a task scheduler):
   ```bash
   python manage.py generate_prayer_times --days 30
   ```

6. *(Optional)* **Seed demo data** to see the dashboard populated:
   ```bash
   python manage.py seed_demo_data
   ```

7. **Run the server:**
   ```bash
   python manage.py runserver
   ```
   - Admin dashboard: http://127.0.0.1:8000/dashboard/
   - Django admin (full CRUD): http://127.0.0.1:8000/admin/
   - API root: http://127.0.0.1:8000/api/
   - Demo login: `admin` / `AlFirdaus2026!`

   Password-reset emails print to the console in dev (`EMAIL_BACKEND` in
   `.env`) — request a reset from the login page and the reset link will
   appear in your terminal.

## Before going live

- Set a real `SECRET_KEY` and `DEBUG=False` in `.env`
- Switch `EMAIL_BACKEND` to real SMTP (e.g. your domain's mail provider) so
  password-reset emails actually send — see the `EMAIL_*` settings in `.env.example`
- Fill in real `SELCOM_API_KEY` / `SELCOM_API_SECRET` / `SELCOM_VENDOR_ID`
  once the Selcom merchant account is set up, and update the webhook URL in
  `donations/providers.py` to your real domain
- Point `DB_HOST` etc. at your production PostgreSQL instance
- Run `python manage.py collectstatic` and serve `/static/` and `/media/`
  via your web server or a CDN
- Put this behind HTTPS + Cloudflare (or similar) per the original proposal
- Review `CORS_ALLOW_ALL_ORIGINS` in `config/settings.py` — it's only wide
  open while `DEBUG=True`

## Notes on decisions already made

- **Database:** PostgreSQL (not MS SQL Server as in the original proposal)
- **Prayer times:** auto-calculated (adhanpy, Muslim World League method by
  default — configurable in `.env`), not manually entered
- **Payment gateway:** Selcom first, built provider-agnostic so switching to
  Azampay/ClickPesa later is a config change, not a rewrite
- **Mobile app:** the same API (with JWT auth via `djangorestframework-simplejwt`)
  is meant to serve the future Flutter app — no separate backend needed;
  Firebase is recommended only for push notifications, not as a data backend