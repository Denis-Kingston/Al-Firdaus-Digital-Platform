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
  full forgot-password flow** (email