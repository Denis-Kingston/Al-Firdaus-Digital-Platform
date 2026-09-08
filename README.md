# Al-Firdaus-Digital-Platform
A digital platform for Al Firdaus Mosque, Dar es Salaam, providing mosque services, prayer information, Islamic learning resources, announcements, events, community engagement and donation services through a web and mobile application.
Al Firdaus Institute & Mosque — Digital Platform

Website, backend API, admin dashboard, and mobile app for Al Firdaus Institute & Mosque, Dar es Salaam. This README is the map — start here, then follow the links into whichever repo or doc you actually need.

Repositories
Repo	What it is	Deployed to
al-firdaus-website	Public website — 10 pages, plain HTML/CSS/JS, no build step	Cloudflare Pages
al-firdaus-backend	Django + PostgreSQL API, admin dashboard, Django admin	Render

(Flutter mobile app: code and screen mockups exist — see Al_Firdaus_Complete_Build_Guide.md Part 4 — not yet in its own repo.)

How the pieces fit
Public website  ─┐
Admin dashboard ─┼─→  Cloudflare  →  Django REST API (Render)  →  PostgreSQL
Mobile app      ─┘                          │
                                             ├─→ Selcom (payments)
                                             ├─→ Email (password resets)
                                             └─→ Firebase (push notifications only)

One backend, one database. The website, admin dashboard, and mobile app are three different windows onto the same system — nothing is duplicated. Full diagrams and explanation: Al_Firdaus_System_Architecture.md.

Documentation index
Document	Read this when you need to...
Al_Firdaus_System_Architecture.md	Understand how everything fits together, and why each decision was made
Al_Firdaus_Complete_Build_Guide.md	Actually build or run any part of this — backend setup, website, admin platform, the Flutter app, and deployment, step by step
al-firdaus-website/README.md	Work specifically on the website
al-firdaus-backend/README.md	Work specifically on the backend
Current status
✅ Website: built, tested, all 10 pages working (including Qibla finder, Zakat calculator, EN/Swahili toggle, PWA)
✅ Backend: built, tested against real PostgreSQL — RBAC, audit logging, auto-calculated prayer times, donations with PDF receipts, event RSVPs, khutbah archive
✅ Admin dashboard: working login (with password reset), donation analytics, full Django admin CRUD
🟡 Mobile app: screens designed and coded, not yet compiled/run (no Flutter toolchain available in the build environment)
🟡 Payments: Selcom integration is code-complete but running in sandbox mode — needs a real Selcom merchant account before it can move real money
⬜ Deployment: see the "Going live" checklist below
Going live — quick checklist

Full detail in the build guide, Part 5. Short version:

Push both repos to GitHub (done, if you're reading this from the repos)
Deploy al-firdaus-backend to Render — PostgreSQL + web service, set env vars, migrate, create a superuser, run generate_prayer_times
Set the real backend URL in al-firdaus-website/js/main.js (API_BASE constant, near the top of the file)
Deploy al-firdaus-website to Cloudflare Pages
Update CORS_ALLOWED_ORIGINS on Render to match the live website URL
Real SMTP credentials (for password resets) and real Selcom credentials (for live payments) before telling the public it's live
Known open items
Swahili translations are structurally complete but not reviewed by a native speaker
Demo/placeholder content (bank details, phone numbers, gallery photos) needs replacing with real information
Recurring donations record the intent to give monthly — the actual re-charge scheduling still needs a periodic task once Selcom is live
sitesettings app (for admin-editable site text like the Zakat Nisab threshold) is planned but not built
Contact

Deogratius Diu — GRC Lead & ISO Champion, SoftNet Technologies Limited deogratiusdiu123@gmail.com
